### 19.4.11 Replicação atrasada

O MySQL suporta a replicação atrasada, de modo que um servidor de replicação executa deliberadamente as transações com um atraso maior do que o do servidor de origem, pelo menos por um período especificado. Esta seção descreve como configurar um atraso de replicação em uma replica e como monitorar o atraso de replicação.

No MySQL 8.0, o método de adiamento da replicação depende de dois timestamps, `immediate_commit_timestamp` e `original_commit_timestamp` (veja Timestamps de Adiamento da Replicação). Se todos os servidores na topologia de replicação estiverem executando o MySQL 8.0 ou superior, a replicação adiada é medida usando esses timestamps. Se o servidor de origem imediato ou a réplica não estiverem usando esses timestamps, a implementação da replicação adiada do MySQL 5.7 é usada (veja Replicação Adiada). Esta seção descreve a replicação adiada entre servidores que estão usando esses timestamps.

O atraso padrão da replicação é de 0 segundos. Use uma declaração `CHANGE REPLICATION SOURCE TO SOURCE_DELAY=N` (a partir do MySQL 8.0.23) ou uma declaração `CHANGE MASTER TO MASTER_DELAY=N` (antes do MySQL 8.0.23) para definir o atraso para `N` segundos. Uma transação recebida da fonte não é executada até pelo menos `N` segundos depois de seu commit na fonte imediata. O atraso ocorre por transação (e não por evento, como nas versões anteriores do MySQL) e o atraso real é imposto apenas em `gtid_log_event` ou `anonymous_gtid_log_event`. Os outros eventos na transação sempre seguem esses eventos sem qualquer tempo de espera imposto sobre eles.

Nota

`START REPLICA` e `STOP REPLICA` entram em vigor imediatamente e ignoram qualquer atraso. `RESET REPLICA` redefini o atraso para 0.

A tabela `replication_applier_configuration` do Schema de Desempenho contém a coluna `DESIRED_DELAY`, que mostra o atraso configurado usando a opção `SOURCE_DELAY` | `MASTER_DELAY`. A tabela `replication_applier_status` do Schema de Desempenho contém a coluna `REMAINING_DELAY`, que mostra o número de segundos de atraso restantes.

A replicação retardada pode ser usada para vários propósitos:

- Para proteger contra erros do usuário na fonte. Com um atraso, você pode reverter uma réplica atrasada para o momento imediatamente anterior ao erro.

- Para testar como o sistema se comporta quando há um atraso. Por exemplo, em uma aplicação, um atraso pode ser causado por uma carga pesada na replica. No entanto, pode ser difícil gerar esse nível de carga. A replicação atrasada pode simular o atraso sem precisar simular a carga. Também pode ser usado para depurar condições relacionadas a uma replica que está atrasada.

- Para verificar como o banco de dados era no passado, sem precisar recarregar um backup. Por exemplo, configurando uma replica com um atraso de uma semana, se você precisar ver como o banco de dados era antes dos últimos dias de desenvolvimento, a replica com atraso pode ser verificada.

#### Tempo de atraso de replicação

O MySQL 8.0 oferece um novo método para medir o atraso (também conhecido como atraso de replicação) em topologias de replicação que depende dos seguintes timestamps associados ao GTID de cada transação (em vez de cada evento) escrita no log binário.

- `original_commit_timestamp`: o número de microsegundos desde a época em que a transação foi escrita (confirmada) no log binário da fonte original.

- `immediate_commit_timestamp`: o número de microsegundos desde a época em que a transação foi escrita (confirmada) no log binário da fonte imediata.

A saída do **mysqlbinlog** exibe esses timestamps em dois formatos: microsegundos a partir da época e também no formato `TIMESTAMP`, que é baseado no fuso horário definido pelo usuário para melhor legibilidade. Por exemplo:

```
#170404 10:48:05 server id 1  end_log_pos 233 CRC32 0x016ce647     GTID    last_committed=0
\ sequence_number=1    original_committed_timestamp=1491299285661130    immediate_commit_timestamp=1491299285843771
# original_commit_timestamp=1491299285661130 (2017-04-04 10:48:05.661130 WEST)
# immediate_commit_timestamp=1491299285843771 (2017-04-04 10:48:05.843771 WEST)
 /*!80001 SET @@SESSION.original_commit_timestamp=1491299285661130*//*!*/;
   SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1'/*!*/;
# at 233
```

Como regra geral, o `original_commit_timestamp` é sempre o mesmo em todas as réplicas onde a transação é aplicada. Na replicação de origem-réplica, o `original_commit_timestamp` de uma transação no log binário da origem (original) é sempre o mesmo que seu `immediate_commit_timestamp`. No log de retransmissão da réplica, os `original_commit_timestamp` e `immediate_commit_timestamp` da transação são os mesmos que no log binário da origem; enquanto que em seu próprio log binário, o `immediate_commit_timestamp` da transação corresponde ao momento em que a réplica comprometeu a transação.

Em uma configuração de replicação em grupo, quando a fonte original é membro de um grupo, o `original_commit_timestamp` é gerado quando a transação está pronta para ser confirmada. Em outras palavras, quando ela terminou de ser executada na fonte original e seu conjunto de escrita está pronto para ser enviado para todos os membros do grupo para certificação. Quando a fonte original é um servidor fora do grupo, o `original_commit_timestamp` é preservado. O mesmo `original_commit_timestamp` para uma transação específica é replicado para todos os servidores no grupo e para qualquer replica fora do grupo que esteja replicando de um membro. A partir do MySQL 8.0.26, cada destinatário da transação também armazena o tempo local de confirmação em seu log binário usando `immediate_commit_timestamp`.

Os eventos de alteração, que são exclusivos da Replicação em Grupo, são um caso especial. As transações que contêm esses eventos são geradas por cada membro do grupo, mas compartilham o mesmo GTID (portanto, não são executadas primeiro em uma fonte e depois replicadas para o grupo, mas todos os membros do grupo executam e aplicam a mesma transação). Antes do MySQL 8.0.26, essas transações têm seu `original_commit_timestamp` definido como zero e aparecem dessa forma na saída visível. A partir do MySQL 8.0.26, para melhorar a observabilidade, os membros do grupo definem valores de marca-passos locais para as transações associadas aos eventos de alteração de visualização.

#### Monitoramento do Retardo de Replicação

Uma das maneiras mais comuns de monitorar o atraso (lag) na replicação em versões anteriores do MySQL era confiar no campo `Seconds_Behind_Master` na saída do `SHOW REPLICA STATUS`. No entanto, essa métrica não é adequada ao usar topologias de replicação mais complexas do que a configuração tradicional de fonte-replica, como a Replicação por Grupo. A adição de `immediate_commit_timestamp` e `original_commit_timestamp` ao MySQL 8 fornece um grau muito mais fino de informações sobre o atraso da replicação. O método recomendado para monitorar o atraso da replicação em uma topologia que suporte esses timestamps é usar as seguintes tabelas do Schema de Desempenho.

- `replication_connection_status`: estado atual da conexão com a fonte, fornece informações sobre a última e a transação atual que o fio de conexão foi enfileirado no log de retransmissão.

- `replication_applier_status_by_coordinator`: estado atual da thread do coordenador que exibe informações apenas ao usar uma replica multithread, fornece informações sobre a última transação armazenada na fila da thread do coordenador para a fila de um trabalhador, bem como a transação que está atualmente armazenando.

- `replication_applier_status_by_worker`: estado atual da(s) thread(s) que aplicam transações recebidas da fonte, fornece informações sobre as transações aplicadas pelo thread de replicação SQL ou por cada thread de trabalhador ao usar uma replica multithread.

Com essas tabelas, você pode monitorar informações sobre a última transação processada pelo fio correspondente e a transação que o fio está processando atualmente. Essas informações incluem:

- GTID de uma transação

- `original_commit_timestamp` e `immediate_commit_timestamp` de uma transação, recuperados do log de retransmissão da réplica

- o tempo em que um fio começou a processar uma transação

- para a última transação processada, o tempo que o fio levou para processá-la

Além das tabelas do Schema de Desempenho, a saída do `SHOW REPLICA STATUS` tem três campos que mostram:

- `SQL_Delay`: Um número inteiro não negativo que indica o atraso de replicação configurado usando `CHANGE REPLICATION SOURCE TO SOURCE_DELAY=N` (a partir do MySQL 8.0.23) ou `CHANGE MASTER TO MASTER_DELAY=N` (antes do MySQL 8.0.23), medido em segundos.

- `SQL_Remaining_Delay`: Quando `Replica_SQL_Running_State` é `Waiting until MASTER_DELAY seconds after master executed event`, este campo contém um número inteiro que indica o número de segundos restantes do atraso. Em outros momentos, este campo é `NULL`.

- `Replica_SQL_Running_State`: Uma string que indica o estado do fio SQL (análogo a `Replica_IO_State`). O valor é idêntico ao valor `State` do fio SQL conforme exibido por `SHOW PROCESSLIST`.

Quando o fio de replicação SQL está aguardando o término do atraso antes de executar um evento, `SHOW PROCESSLIST` exibe seu valor `State` como `Waiting until MASTER_DELAY seconds after master executed event`.
