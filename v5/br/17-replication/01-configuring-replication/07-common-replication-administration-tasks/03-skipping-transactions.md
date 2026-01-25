#### 16.1.7.3 Ignorando Transações

Se a replicação parar devido a um problema com um Event em uma Transaction replicada, você pode retomar a replicação ignorando a Transaction que falhou na Replica. Antes de ignorar uma Transaction, certifique-se de que o replication I/O thread esteja parado, assim como o replication SQL thread.

Primeiro, você precisa identificar o Event replicado que causou o erro. Detalhes do erro e da última Transaction aplicada com sucesso são registrados na tabela Performance Schema [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table"). Você pode usar [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") para recuperar e exibir os Events que foram registrados em log (logged) no momento do erro. Para instruções sobre como fazer isso, consulte [Seção 7.5, “Point-in-Time (Incremental) Recovery”](point-in-time-recovery.html "7.5 Point-in-Time (Incremental) Recovery"). Alternativamente, você pode executar [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement") na Replica ou [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") no Source.

Antes de ignorar a Transaction e reiniciar a Replica, verifique estes pontos:

* A Transaction que parou a replicação é proveniente de um Source desconhecido ou não confiável? Caso positivo, investigue a causa, pois pode haver considerações de segurança que indiquem que a Replica não deve ser reiniciada.

* A Transaction que parou a replicação precisa ser aplicada na Replica? Caso positivo, faça as correções apropriadas e reaplique a Transaction, ou harmonize (reconcile) os dados manualmente na Replica.

* A Transaction que parou a replicação precisava ser aplicada no Source? Caso negativo, desfaça a Transaction manualmente no servidor onde ela ocorreu originalmente.

Para ignorar a Transaction, escolha um dos seguintes métodos, conforme apropriado:

* Quando GTIDs estão em uso ([`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) é `ON`), consulte [Seção 16.1.7.3.1, “Ignorando Transações Com GTIDs”](replication-administration-skip.html#replication-administration-skip-gtid "16.1.7.3.1 Skipping Transactions With GTIDs").

* Quando GTIDs não estão em uso ou estão sendo implementados gradualmente ([`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) é `OFF`, `OFF_PERMISSIVE`, ou `ON_PERMISSIVE`), consulte [Seção 16.1.7.3.2, “Ignorando Transações Sem GTIDs”](replication-administration-skip.html#replication-administration-skip-nogtid "16.1.7.3.2 Skipping Transactions Without GTIDs").

Para reiniciar a replicação após ignorar a Transaction, execute [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"), com a cláusula `FOR CHANNEL` se a Replica for uma multi-source Replica.

##### 16.1.7.3.1 Ignorando Transações Com GTIDs

Quando GTIDs estão em uso ([`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) é `ON`), o GTID de uma Transaction committed (confirmada) é persistido na Replica, mesmo que o conteúdo da Transaction seja filtrado. Este recurso impede que uma Replica recupere Transactions filtradas anteriormente quando ela se reconecta ao Source usando GTID auto-positioning. Ele também pode ser usado para ignorar uma Transaction na Replica, confirmando (committing) uma Transaction vazia no lugar da Transaction com falha.

Se a Transaction com falha gerou um erro em um worker thread, você pode obter seu GTID diretamente do campo `APPLYING_TRANSACTION` na tabela Performance Schema [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table"). Para ver qual é a Transaction, execute [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement") na Replica ou [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") no Source, e procure na saída por uma Transaction precedida por esse GTID.

Depois de avaliar a Transaction com falha para quaisquer outras ações apropriadas, conforme descrito anteriormente (como considerações de segurança), para ignorá-la, confirme (commit) uma Transaction vazia na Replica que tenha o mesmo GTID da Transaction com falha. Por exemplo:

```sql
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';
BEGIN;
COMMIT;
SET GTID_NEXT='AUTOMATIC';
```

A presença dessa Transaction vazia na Replica significa que, ao executar uma instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") para reiniciar a replicação, a Replica usa a função auto-skip para ignorar a Transaction com falha, pois ela detecta que uma Transaction com aquele GTID já foi aplicada. Se a Replica for uma multi-source Replica, você não precisa especificar o nome do Channel ao confirmar a Transaction vazia, mas precisa especificar o nome do Channel ao executar [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement").

Note que, se o binary logging estiver em uso nesta Replica, a Transaction vazia entrará no replication stream caso a Replica se torne um Source ou Primary no futuro. Se você precisar evitar essa possibilidade, considere fazer flush e purge dos binary logs da Replica, como neste exemplo:

```sql
FLUSH LOGS;
PURGE BINARY LOGS TO 'binlog.000146';
```

O GTID da Transaction vazia é persistido, mas a própria Transaction é removida ao fazer o purge dos binary log files.

##### 16.1.7.3.2 Ignorando Transações Sem GTIDs

Para ignorar Transactions com falha quando GTIDs não estão em uso ou estão sendo implementados gradualmente ([`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) é `OFF`, `OFF_PERMISSIVE`, ou `ON_PERMISSIVE`), você pode ignorar um número especificado de Events executando uma instrução `SET GLOBAL sql_slave_skip_counter`. Alternativamente, você pode pular um ou mais Events executando uma instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") para avançar a position do binary log do Source.

Ao usar esses métodos, é importante entender que você não está necessariamente ignorando uma Transaction completa, como é sempre o caso com o método baseado em GTID descrito anteriormente. Esses métodos não baseados em GTID não reconhecem Transactions como tal, mas operam em Events. O binary log é organizado como uma sequência de agrupamentos conhecidos como Event groups, e cada Event group consiste em uma sequência de Events.

* Para tabelas transacionais, um Event group corresponde a uma Transaction.

* Para tabelas não transacionais, um Event group corresponde a uma única instrução SQL.

Uma única Transaction pode conter alterações tanto em tabelas transacionais quanto em não transacionais.

Quando você usa uma instrução `SET GLOBAL sql_slave_skip_counter` para ignorar Events e a position resultante está no meio de um Event group, a Replica continua a ignorar Events até atingir o fim do grupo. A execução então começa com o próximo Event group. A instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") não possui essa função, então você deve ter cuidado ao identificar o local correto para reiniciar a replicação no início de um Event group. No entanto, usar [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") significa que você não precisa contar os Events que precisam ser ignorados, como acontece com um `SET GLOBAL sql_slave_skip_counter`, e em vez disso você pode apenas especificar o local para reiniciar.

###### 16.1.7.3.2.1 Ignorando Transações Com `SET GLOBAL sql_slave_skip_counter`

Depois de avaliar a Transaction com falha para quaisquer outras ações apropriadas, conforme descrito anteriormente (como considerações de segurança), conte o número de Events que você precisa ignorar. Um Event normalmente corresponde a uma instrução SQL no binary log, mas observe que as instruções que usam `AUTO_INCREMENT` ou `LAST_INSERT_ID()` contam como dois Events no binary log.

Se você quiser ignorar a Transaction completa, você pode contar os Events até o final da Transaction, ou pode simplesmente ignorar o Event group relevante. Lembre-se que com `SET GLOBAL sql_slave_skip_counter`, a Replica continua a ignorar até o final de um Event group. Certifique-se de não pular muito para frente e entrar no próximo Event group ou Transaction, pois isso fará com que ele também seja ignorado.

Execute a instrução `SET` da seguinte forma, onde *`N`* é o número de Events do Source a serem ignorados:

```sql
SET GLOBAL sql_slave_skip_counter = N
```

Esta instrução não pode ser executada se [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode) estiver definido, ou se os Replica threads estiverem em execução.

A instrução `SET GLOBAL sql_slave_skip_counter` não tem efeito imediato. Quando você executa a instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") na próxima vez, após esta instrução `SET`, o novo valor para a variável de sistema [`sql_slave_skip_counter`](replication-options-replica.html#sysvar_sql_slave_skip_counter) é aplicado, e os Events são ignorados. Essa instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") também define automaticamente o valor da variável de sistema de volta para 0. Se a Replica for uma multi-source Replica, ao executar a instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"), a cláusula `FOR CHANNEL` é obrigatória. Certifique-se de nomear o Channel correto, caso contrário, os Events serão ignorados no Channel errado.

###### 16.1.7.3.2.2 Ignorando Transações Com `CHANGE MASTER TO`

Depois de avaliar a Transaction com falha para quaisquer outras ações apropriadas, conforme descrito anteriormente (como considerações de segurança), identifique as coordenadas (arquivo e position) no binary log do Source que representam uma posição adequada para reiniciar a replicação. Esta pode ser o início do Event group que segue o Event que causou o problema, ou o início da próxima Transaction. O replication I/O thread começa a ler a partir do Source nessas coordenadas na próxima vez que o Thread iniciar, ignorando o Event com falha. Certifique-se de ter identificado a position com precisão, pois esta instrução não leva em consideração os Event groups.

Execute a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") da seguinte forma, onde *`source_log_name`* é o arquivo de binary log que contém a restart position, e *`source_log_pos`* é o número que representa a restart position conforme declarado no arquivo de binary log:

```sql
CHANGE MASTER TO MASTER_LOG_FILE='source_log_name', MASTER_LOG_POS=source_log_pos;
```

Se a Replica for uma multi-source Replica, você deve usar a cláusula `FOR CHANNEL` para nomear o Channel apropriado na instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement").

Esta instrução não pode ser executada se `MASTER_AUTO_POSITION=1` estiver definido, ou se os replication threads estiverem em execução. Se você precisar usar este método para ignorar uma Transaction quando `MASTER_AUTO_POSITION=1` está normalmente definido, você pode alterar a configuração para `MASTER_AUTO_POSITION=0` ao executar a instrução e depois alterá-la novamente. Por exemplo:

```sql
CHANGE MASTER TO MASTER_AUTO_POSITION=0, MASTER_LOG_FILE='binlog.000145', MASTER_LOG_POS=235;
CHANGE MASTER TO MASTER_AUTO_POSITION=1;
```