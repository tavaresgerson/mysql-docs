#### 19.1.7.3 Ignorar transações

Se a replicação parar devido a um problema com um evento em uma transação replicada, você pode retomar a replicação ignorando a transação falha na replica. Antes de ignorar uma transação, certifique-se de que o fio de I/O de replicação (receptor) também esteja parado, assim como o fio de aplicação de SQL (aplicador).

Primeiro, você precisa identificar o evento replicado que causou o erro. Os detalhes do erro e a última transação aplicada com sucesso são registrados na tabela do Schema de Desempenho `replication_applier_status_by_worker`. Você pode usar o **mysqlbinlog** para recuperar e exibir os eventos que foram registrados na época do erro. Para obter instruções sobre como fazer isso, consulte a Seção 9.5, “Recuperação Ponto no Tempo (Incremental)”). Alternativamente, você pode emitir `SHOW RELAYLOG EVENTS` na replica ou `SHOW BINLOG EVENTS` na fonte.

Antes de pular a transação e reiniciar a replica, verifique os seguintes pontos:

- A transação que parou a replicação veio de uma fonte desconhecida ou não confiável? Se sim, investigue a causa, caso haja alguma consideração de segurança que indique que a replicação não deve ser reiniciada.

- A transação que interrompeu a replicação precisa ser aplicada na replica? Se sim, faça as correções necessárias e aplique novamente a transação ou reconcile manualmente os dados na replica.

- A transação que interrompeu a replicação precisou ser aplicada na fonte? Se não, desfaça a transação manualmente no servidor onde ela ocorreu originalmente.

Para pular a transação, escolha um dos seguintes métodos conforme apropriado:

- Quando os GTIDs estiverem em uso (`gtid_mode` é `ON`), consulte a Seção 19.1.7.3.1, “Saltar Transações com GTIDs”.

- Quando os GTIDs não estão em uso ou estão sendo implementados (`gtid_mode` é `OFF`, `OFF_PERMISSIVE` ou `ON_PERMISSIVE`), consulte a Seção 19.1.7.3.2, “Saltar Transações Sem GTIDs”.

- Se você habilitou a atribuição de GTID em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração `CHANGE REPLICATION SOURCE TO` ou `CHANGE MASTER TO`, consulte a Seção 19.1.7.3.2, “Saltar Transações Sem GTIDs”. Usar `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` em um canal de replicação não é o mesmo que introduzir a replicação baseada em GTID para o canal, e você não pode usar o método de salto de transação para a replicação baseada em GTID com esses canais.

Para reiniciar a replicação após pular a transação, execute `START REPLICA`, com a cláusula `FOR CHANNEL`, se a replica for uma replica de múltiplas fontes.

##### 19.1.7.3.1 Ignorar Transações com GTIDs

Quando os GTIDs estão em uso (`gtid_mode` é `ON`), o GTID de uma transação comprometida é persistido na replica, mesmo que o conteúdo da transação seja filtrado. Esse recurso impede que uma replica recupere transações previamente filtradas quando se reconectar à fonte usando o autoposicionamento do GTID. Também pode ser usado para pular uma transação na replica, comprometendo uma transação vazia no lugar da transação que falhou.

Esse método de pular transações não é adequado quando você habilitou a atribuição de GTID em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da instrução `CHANGE REPLICATION SOURCE TO`.

Se a transação que falhou gerou um erro em um thread de trabalhador, você pode obter seu GTID diretamente do campo `APPLYING_TRANSACTION` na tabela do Schema de Desempenho `replication_applier_status_by_worker`. Para ver qual transação é, execute `SHOW RELAYLOG EVENTS` na replica ou `SHOW BINLOG EVENTS` na fonte, e procure na saída uma transação precedida por esse GTID.

Depois de avaliar a transação falha para tomar quaisquer outras ações apropriadas, conforme descrito anteriormente (como considerações de segurança), para ignorá-la, realize uma transação vazia na replica que tenha o mesmo GTID da transação falha. Por exemplo:

```
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';
BEGIN;
COMMIT;
SET GTID_NEXT='AUTOMATIC';
```

A presença dessa transação vazia na replica significa que, quando você emitir uma declaração `START REPLICA` para reiniciar a replicação, a replica usa a função de desvio automático para ignorar a transação falhando, porque ela vê que uma transação com esse GTID já foi aplicada. Se a replica for uma replica de múltiplas fontes, você não precisa especificar o nome do canal ao confirmar a transação vazia, mas você precisa especificar o nome do canal ao emitir `START REPLICA`.

Observe que, se o registro binário estiver em uso nesta réplica, a transação vazia entrará no fluxo de replicação se a réplica se tornar uma fonte ou primária no futuro. Se você precisar evitar essa possibilidade, considere esvaziar e purgar os logs binários da réplica, como neste exemplo:

```
FLUSH LOGS;
PURGE BINARY LOGS TO 'binlog.000146';
```

O GTID da transação vazia é persistido, mas a própria transação é removida ao purgar os arquivos de log binário.

##### 19.1.7.3.2 Ignorar Transações sem GTIDs

Para pular transações que falham quando os GTIDs não estão em uso ou estão sendo implementados (`gtid_mode` é `OFF`, `OFF_PERMISSIVE` ou `ON_PERMISSIVE`), você pode pular um número especificado de eventos emitindo uma declaração `SET GLOBAL sql_replica_skip_counter` (a partir do MySQL 8.0.26) ou uma declaração `SET GLOBAL sql_slave_skip_counter`. Alternativamente, você pode pular um evento ou eventos emitindo uma declaração `CHANGE REPLICATION SOURCE TO` ou `CHANGE MASTER TO` para avançar a posição do log binário de origem.

Esses métodos também são adequados quando você habilitou a atribuição de GTID em um canal de replicação usando a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` da declaração `CHANGE REPLICATION SOURCE TO` ou `CHANGE MASTER TO`.

Ao usar esses métodos, é importante entender que você não está necessariamente ignorando uma transação completa, como sempre acontece com o método baseado no GTID descrito anteriormente. Esses métodos não baseados no GTID não estão cientes das transações como tal, mas operam em eventos. O log binário é organizado como uma sequência de grupos conhecidos como grupos de eventos, e cada grupo de eventos consiste em uma sequência de eventos.

- Para tabelas transacionais, um grupo de eventos corresponde a uma transação.

- Para tabelas não transacionais, um grupo de eventos corresponde a uma única instrução SQL.

Uma única transação pode conter alterações em tabelas tanto transacionais quanto não transacionais.

Quando você usa uma declaração `SET GLOBAL sql_replica_skip_counter` ou `SET GLOBAL sql_slave_skip_counter` para pular eventos e a posição resultante estiver no meio de um grupo de eventos, a replicação continua a pular eventos até chegar ao final do grupo. A execução então começa com o próximo grupo de eventos. A declaração `CHANGE REPLICATION SOURCE TO` ou `CHANGE MASTER TO` não tem essa função, então você deve ter cuidado para identificar a localização correta para reiniciar a replicação no início de um grupo de eventos. No entanto, ao usar `CHANGE REPLICATION SOURCE TO` ou `CHANGE MASTER TO`, você não precisa contar os eventos que precisam ser ignorados, como faria com `SET GLOBAL sql_replica_skip_counter` ou `SET GLOBAL sql_slave_skip_counter`, e, em vez disso, você pode simplesmente especificar a localização para reiniciar.

###### 19.1.7.3.2.1 Ignorar Transações com `SET GLOBAL sql_slave_skip_counter`

Quando você tiver avaliado a transação falha para qualquer outra ação apropriada, conforme descrito anteriormente (como considerações de segurança), conte o número de eventos que você precisa ignorar. Um evento normalmente corresponde a uma instrução SQL no log binário, mas observe que as instruções que usam `AUTO_INCREMENT` ou `LAST_INSERT_ID()` são contadas como dois eventos no log binário. Quando a compressão do log binário está em uso, um payload de transação comprimido (`Transaction_payload_event`) é contado como um único valor de contador, então todos os eventos dentro dele são ignorados como uma unidade.

Se você quiser pular a transação completa, pode contar os eventos até o final da transação ou simplesmente pular o grupo de eventos relevante. Lembre-se de que, com `SET GLOBAL sql_replica_skip_counter` ou `SET GLOBAL sql_slave_skip_counter`, a replica continua a pular até o final de um grupo de eventos. Certifique-se de não pular muito para frente e ir para o próximo grupo de eventos ou transação para que ele também não seja pulado.

Emita a declaração `SET` da seguinte forma, onde `N` é o número de eventos da fonte a serem ignorados:

```
SET GLOBAL sql_slave_skip_counter = N

Or from MySQL 8.0.26:
SET GLOBAL sql_replica_skip_counter = N
```

Esta declaração não pode ser emitida se `gtid_mode=ON` estiver definido ou se as threads de I/O de replicação (receptor) e SQL (aplicador) estiverem em execução.

A declaração `SET GLOBAL sql_replica_skip_counter` ou `SET GLOBAL sql_slave_skip_counter` não tem efeito imediato. Quando você emitir a declaração `START REPLICA` na próxima vez após essa declaração `SET`, o novo valor da variável de sistema `sql_replica_skip_counter` ou `sql_slave_skip_counter` é aplicado e os eventos são ignorados. A declaração `START REPLICA` também define automaticamente o valor da variável de sistema de volta a

0. Se a replica for uma replica de múltiplas fontes, quando você emitir a declaração `START REPLICA`, a cláusula `FOR CHANNEL` é necessária. Certifique-se de nomear o canal correto, caso contrário, os eventos serão ignorados no canal errado.

###### 19.1.7.3.2.2 Ignorar Transações com `CHANGE MASTER TO`

Depois de avaliar a transação falha para qualquer outra ação apropriada, conforme descrito anteriormente (como considerações de segurança), identifique as coordenadas (arquivo e posição) no log binário da fonte que representem uma posição adequada para reiniciar a replicação. Isso pode ser o início do grupo de eventos após o evento que causou o problema ou o início da próxima transação. O thread de I/O de replicação (receptor) começa a ler a partir da fonte nessas coordenadas na próxima vez que o thread for iniciado, ignorando o evento falha. Certifique-se de que você identificou a posição com precisão, porque essa declaração não leva em conta os grupos de eventos.

Emita a declaração `CHANGE REPLICATION SOURCE TO` ou `CHANGE MASTER TO` conforme a seguir, onde `source_log_name` é o arquivo de log binário que contém a posição de reinício, e `source_log_pos` é o número que representa a posição de reinício conforme declarado no arquivo de log binário:

```
CHANGE MASTER TO MASTER_LOG_FILE='source_log_name', MASTER_LOG_POS=source_log_pos;

Or from MySQL 8.0.24:
CHANGE REPLICATION SOURCE TO SOURCE_LOG_FILE='source_log_name', SOURCE_LOG_POS=source_log_pos;
```

Se a replica for uma replica de múltiplas fontes, você deve usar a cláusula `FOR CHANNEL` para nomear o canal apropriado na declaração `CHANGE REPLICATION SOURCE TO` ou `CHANGE MASTER TO`.

Esta declaração não pode ser emitida se `SOURCE_AUTO_POSITION=1` ou `MASTER_AUTO_POSITION=1` estiver definido, ou se as threads de I/O de replicação (receptor) e SQL (aplicador) estiverem em execução. Se você precisar usar esse método de pular uma transação quando `SOURCE_AUTO_POSITION=1` ou `MASTER_AUTO_POSITION=1` estiver normalmente definido, você pode alterar o ajuste para `SOURCE_AUTO_POSITION=0` ou `MASTER_AUTO_POSITION=0` enquanto emite a declaração, e depois alterá-lo novamente posteriormente. Por exemplo:

```
CHANGE MASTER TO MASTER_AUTO_POSITION=0, MASTER_LOG_FILE='binlog.000145', MASTER_LOG_POS=235;
CHANGE MASTER TO MASTER_AUTO_POSITION=1;

Or from MySQL 8.0.24:

CHANGE REPLICATION SOURCE TO SOURCE_AUTO_POSITION=0, SOURCE_LOG_FILE='binlog.000145', SOURCE_LOG_POS=235;
CHANGE REPLICATION SOURCE TO SOURCE_AUTO_POSITION=1;
```
