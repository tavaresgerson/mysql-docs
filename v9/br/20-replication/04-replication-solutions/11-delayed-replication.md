### 19.4.11 Replicação Atrasarada

O MySQL suporta a replicação atrasada, de modo que um servidor de replicação executa deliberadamente transações com um atraso maior que o do servidor de origem, pelo menos por um período especificado de tempo. Esta secção descreve como configurar um atraso de replicação num servidor de replicação e como monitorizar o atraso de replicação.

No MySQL 9.5, o método de atraso de replicação depende de dois timestamps, `immediate_commit_timestamp` e `original_commit_timestamp` (ver Timestamps de Atraso de Replicação); a replicação atrasada é medida usando estes timestamps. Se o servidor de origem imediato ou o servidor de replicação não estiverem a utilizar estes timestamps, é utilizada a implementação de replicação atrasada do MySQL 5.7 (ver Replicação Atrasarada). Esta secção descreve a replicação atrasada entre servidores que estão a utilizar estes timestamps.

O atraso de replicação predefinido é de 0 segundos. Utilize a instrução `CHANGE REPLICATION SOURCE TO SOURCE_DELAY=N` para definir o atraso para *`N`* segundos. Uma transação recebida do servidor de origem não é executada até que, pelo menos, *`N`* segundos depois do seu commit no servidor de origem imediato. O atraso ocorre por transação (e não por evento, como nas versões anteriores do MySQL) e o atraso real é imposto apenas sobre `gtid_log_event` ou `anonymous_gtid_log_event`. Os outros eventos na transação seguem sempre estes eventos sem qualquer atraso imposto sobre eles.

Nota

`START REPLICA` e `STOP REPLICA` têm efeito imediato e ignoram qualquer atraso. `RESET REPLICA` redefini o atraso para 0.

A tabela `replication_applier_configuration` do esquema de desempenho `Performance Schema` contém a coluna `DESIRED_DELAY` que mostra o atraso configurado usando a opção `SOURCE_DELAY`. A tabela `replication_applier_status` do esquema de desempenho `Performance Schema` contém a coluna `REMAINING_DELAY` que mostra o número de segundos de atraso restantes.

A replicação com atraso pode ser usada para vários propósitos:

* Para proteger contra erros do usuário na fonte. Com um atraso, você pode reverter uma replica atrasada para o momento imediatamente antes do erro.

* Para testar como o sistema se comporta quando há um atraso. Por exemplo, em uma aplicação, um atraso pode ser causado por uma carga pesada na replica. No entanto, pode ser difícil gerar esse nível de carga. A replicação com atraso pode simular o atraso sem precisar simular a carga. Também pode ser usada para depurar condições relacionadas a uma replica atrasada.

* Para inspecionar como a base de dados parecia no passado, sem precisar recarregar um backup. Por exemplo, configurando uma replica com um atraso de uma semana, se você precisar ver como a base de dados parecia antes dos últimos dias de desenvolvimento, a replica com atraso pode ser inspecionada.

#### Timestamps de Atraso de Replicação

O MySQL 9.5 fornece um novo método para medir o atraso (também referido como atraso de replicação) em topologias de replicação que depende dos seguintes timestamps associados ao GTID de cada transação (em vez de cada evento) escrita no log binário.

* `original_commit_timestamp`: o número de microsegundos desde a época em que a transação foi escrita (comutada) no log binário da fonte original.

* `immediate_commit_timestamp`: o número de microsegundos desde a época em que a transação foi escrita (comutada) no log binário da fonte imediata.

A saída do **mysqlbinlog** exibe esses timestamps em dois formatos, microsegundos desde a época e também no formato `TIMESTAMP`, que é baseado no fuso horário definido pelo usuário para melhor legibilidade. Por exemplo:

```
#170404 10:48:05 server id 1  end_log_pos 233 CRC32 0x016ce647     GTID    last_committed=0
\ sequence_number=1    original_committed_timestamp=1491299285661130    immediate_commit_timestamp=1491299285843771
# original_commit_timestamp=1491299285661130 (2017-04-04 10:48:05.661130 WEST)
# immediate_commit_timestamp=1491299285843771 (2017-04-04 10:48:05.843771 WEST)
 /*!80001 SET @@SESSION.original_commit_timestamp=1491299285661130*//*!*/;
   SET @@SESSION.GTID_NEXT= 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa:1'/*!*/;
# at 233
```

Como regra, o `original_commit_timestamp` é sempre o mesmo em todas as réplicas onde a transação é aplicada. Na replicação de origem-réplica, o `original_commit_timestamp` de uma transação na (origem) log binário do (original) é sempre o mesmo que seu `immediate_commit_timestamp`. No log de retransmissão da réplica, o `original_commit_timestamp` e o `immediate_commit_timestamp` da transação são os mesmos que no log binário da origem; enquanto que em seu próprio log binário, o `immediate_commit_timestamp` da transação corresponde ao momento em que a réplica comprometeu a transação.

Em uma configuração de replicação em grupo, quando a origem original é membro de um grupo, o `original_commit_timestamp` é gerado quando a transação está pronta para ser comprometida. Em outras palavras, quando ela terminou de ser executada na origem original e seu conjunto de escrita está pronto para ser enviado para todos os membros do grupo para certificação. Quando a origem original é um servidor fora do grupo, o `original_commit_timestamp` é preservado. O mesmo `original_commit_timestamp` para uma transação particular é replicado para todos os servidores no grupo e para qualquer réplica fora do grupo que esteja replicando de um membro. Cada destinatário da transação também armazena o tempo de comprometimento local em seu log binário usando `immediate_commit_timestamp`.

Eventos de visualização de alterações, que são exclusivos da replicação em grupo, são um caso especial. Transações que contêm esses eventos são geradas por cada membro do grupo, mas compartilham o mesmo GTID (portanto, não são executadas primeiro em uma origem e depois replicadas para o grupo, mas todos os membros do grupo executam e aplicam a mesma transação). Os membros do grupo definem valores de marcação de tempo local para transações associadas a eventos de alteração de visualização.

#### Monitoramento do Retardo da Replicação

Uma das maneiras mais comuns de monitorar o atraso (lag) na replicação em versões anteriores do MySQL era confiar no campo `Seconds_Behind_Master` na saída do `SHOW REPLICA STATUS`. No entanto, essa métrica não é adequada ao usar topologias de replicação mais complexas do que a configuração tradicional de fonte-replica, como a Replicação por Grupo. A adição de `immediate_commit_timestamp` e `original_commit_timestamp` no MySQL 8 fornece um grau de informação muito mais fino sobre o atraso da replicação. O método recomendado para monitorar o atraso da replicação em uma topologia que suporta esses timestamps é usar as seguintes tabelas do Schema de Desempenho.

* `replication_connection_status`: status atual da conexão com a fonte, fornece informações sobre a última e a transação atual que o thread de conexão enfileirou no log de relevo.

* `replication_applier_status_by_coordinator`: status atual do thread do coordenador que apenas exibe informações quando usa uma replica multithread, fornece informações sobre a última transação armazenada pelo thread do coordenador em uma fila de trabalhadores, bem como a transação que ele está atualmente armazenando.

* `replication_applier_status_by_worker`: status atual do(s) thread(s) que aplica transações recebidas da fonte, fornece informações sobre as transações aplicadas pelo thread SQL de replicação ou por cada thread de trabalhador ao usar uma replica multithread.

Usando essas tabelas, você pode monitorar informações sobre a última transação processada pelo thread correspondente e a transação que o thread está atualmente processando. Essas informações incluem:

* GTID da transação
* `original_commit_timestamp` e `immediate_commit_timestamp` da transação, recuperados do log de relevo da replica

* o tempo em que um fio começou a processar uma transação;
* para a última transação processada, o tempo em que o fio a finalizou.

Além das tabelas do Gerenciamento de Desempenho, a saída do comando `SHOW REPLICA STATUS` tem três campos que mostram:

* `SQL_Delay`: Um inteiro não negativo que indica o atraso de replicação configurado usando `CHANGE REPLICATION SOURCE TO SOURCE_DELAY=N`, onde *`N`* é medido em segundos.

* `SQL_Remaining_Delay`: Quando `Replica_SQL_Running_State` é `Waiting until SOURCE_DELAY seconds after master executed event`, este campo contém um inteiro que indica o número de segundos restantes do atraso. Em outros momentos, este campo é `NULL`.

* `Replica_SQL_Running_State`: Uma string que indica o estado do fio SQL (análogo ao `Replica_IO_State`). O valor é idêntico ao valor `State` do fio SQL conforme exibido pelo comando `SHOW PROCESSLIST`.

Quando o fio SQL de replicação está aguardando o atraso para expirar antes de executar um evento, o comando `SHOW PROCESSLIST` exibe seu valor `State` como `Waiting until SOURCE_DELAY seconds after master executed event`.