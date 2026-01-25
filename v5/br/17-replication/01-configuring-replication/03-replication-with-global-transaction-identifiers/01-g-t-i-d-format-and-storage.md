#### 16.1.3.1 Formato e Armazenamento de GTID

Um global transaction identifier (GTID) é um identificador único criado e associado a cada transaction committed no server de origem (a source). Este identificador é único não apenas para o server onde se originou, mas é único em todos os servers em uma dada topologia de replication.

A atribuição de GTID distingue entre transactions de cliente, que são committed na source, e transactions replicadas, que são reproduzidas em uma replica. Quando uma transaction de cliente é committed na source, um novo GTID é atribuído, desde que a transaction tenha sido escrita no binary log. As transactions de cliente têm a garantia de possuir GTIDs monotonicamente crescentes, sem lacunas entre os números gerados. Se uma transaction de cliente não for escrita no binary log (por exemplo, porque a transaction foi filtrada ou era read-only), ela não recebe um GTID no server de origem.

Transactions replicadas retêm o mesmo GTID que foi atribuído à transaction no server de origem. O GTID está presente antes que a transaction replicada comece a ser executada, e é persistido mesmo que a transaction replicada não seja escrita no binary log na replica, ou seja filtrada na replica. A tabela do sistema MySQL `mysql.gtid_executed` é usada para preservar os GTIDs atribuídos de todas as transactions aplicadas em um MySQL server, exceto aquelas que estão armazenadas em um arquivo de binary log atualmente ativo.

A função auto-skip para GTIDs significa que uma transaction committed na source pode ser aplicada não mais do que uma vez na replica, o que ajuda a garantir a consistência. Uma vez que uma transaction com um determinado GTID tenha sido committed em um dado server, qualquer tentativa de executar uma transaction subsequente com o mesmo GTID é ignorada por esse server. Nenhum error é levantado e nenhum statement na transaction é executado.

Se uma transaction com um determinado GTID começou a ser executada em um server, mas ainda não foi committed ou rolled back, qualquer tentativa de iniciar uma transaction concorrente no server com o mesmo GTID bloqueia. O server não inicia a execução da transaction concorrente nem retorna o controle ao cliente. Uma vez que a primeira tentativa da transaction seja committed ou rolled back, as sessions concorrentes que estavam blocking no mesmo GTID podem prosseguir. Se a primeira tentativa foi rolled back, uma session concorrente prossegue para tentar a transaction, e quaisquer outras sessions concorrentes que estavam blocking no mesmo GTID permanecem blocked. Se a primeira tentativa foi committed, todas as sessions concorrentes param de ser blocked e fazem auto-skip de todos os statements da transaction.

Um GTID é representado como um par de coordenadas, separadas por um caractere de dois pontos (`:`), conforme mostrado aqui:

```sql
GTID = source_id:transaction_id
```

O *`source_id`* identifica o server de origem. Normalmente, o [`server_uuid`](replication-options.html#sysvar_server_uuid) da source é usado para essa finalidade. O *`transaction_id`* é um número de sequência determinado pela ordem em que a transaction foi committed na source. Por exemplo, a primeira transaction a ser committed tem `1` como seu *`transaction_id`*, e à décima transaction a ser committed no mesmo server de origem é atribuído um *`transaction_id`* de `10`. Não é possível que uma transaction tenha `0` como número de sequência em um GTID. Por exemplo, a vigésima terceira transaction a ser committed originalmente no server com o UUID `3E11FA47-71CA-11E1-9E33-C80AA9429562` tem este GTID:

```sql
3E11FA47-71CA-11E1-9E33-C80AA9429562:23
```

O limite superior para números de sequência de GTIDs em uma instância de server é o número de valores não negativos para um inteiro de 64 bits com sinal (2 elevado à potência de 63 menos 1, ou 9.223.372.036.854.775.807). Se o server ficar sem GTIDs, ele executa a ação especificada por [`binlog_error_action`](replication-options-binary-log.html#sysvar_binlog_error_action).

O GTID para uma transaction é mostrado na saída de [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"), e é usado para identificar uma transaction individual nas tabelas de status de replication do Performance Schema, por exemplo, [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table"). O valor armazenado pela system variable [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next) (`@@GLOBAL.gtid_next`) é um GTID único.

##### GTID Sets

Um GTID set é um conjunto que compreende um ou mais GTIDs únicos ou ranges de GTIDs. GTID sets são usados em um MySQL server de várias maneiras. Por exemplo, os valores armazenados pelas system variables [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) e [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) são GTID sets. As cláusulas `UNTIL SQL_BEFORE_GTIDS` e `UNTIL SQL_AFTER_GTIDS` do [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") podem ser usadas para fazer uma replica processar transactions apenas até o primeiro GTID em um GTID set, ou parar após o último GTID em um GTID set. As funções internas [`GTID_SUBSET()`](gtid-functions.html#function_gtid-subset) e [`GTID_SUBTRACT()`](gtid-functions.html#function_gtid-subtract) requerem GTID sets como entrada.

Um range de GTIDs originado no mesmo server pode ser condensado em uma única expressão, conforme mostrado aqui:

```sql
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
```

O exemplo acima representa da primeira à quinta transactions originadas no MySQL server cujo [`server_uuid`](replication-options.html#sysvar_server_uuid) é `3E11FA47-71CA-11E1-9E33-C80AA9429562`. Múltiplos GTIDs únicos ou ranges de GTIDs originados no mesmo server também podem ser incluídos em uma única expressão, com os GTIDs ou ranges separados por dois pontos, como no exemplo a seguir:

```sql
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-3:11:47-49
```

Um GTID set pode incluir qualquer combinação de GTIDs únicos e ranges de GTIDs, e pode incluir GTIDs originados de servers diferentes. Este exemplo mostra o GTID set armazenado na system variable [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) (`@@GLOBAL.gtid_executed`) de uma replica que aplicou transactions de mais de uma source:

```sql
2174B383-5441-11E8-B90A-C80AA9429562:1-3, 24DA167-0C0C-11E8-8442-00059A3C7B00:1-19
```

Quando GTID sets são retornados de server variables, os UUIDs estão em ordem alfabética, e os intervalos numéricos são mesclados e em ordem crescente.

A sintaxe para um GTID set é a seguinte:

```sql
gtid_set:
    uuid_set [, uuid_set] ...
    | ''

uuid_set:
    uuid:interval[:interval]...

uuid:
    hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh

h:
    [0-9|A-F]

interval:
    n[-n]

    (n >= 1)
```

##### Tabela mysql.gtid_executed

GTIDs são armazenados em uma table chamada `gtid_executed`, no `mysql` Database. Uma row nesta table contém, para cada GTID ou conjunto de GTIDs que representa, o UUID do server de origem, e os transaction IDs inicial e final do conjunto; para uma row que referencia apenas um GTID único, estes dois últimos valores são os mesmos.

A table `mysql.gtid_executed` é criada (se ainda não existir) quando o MySQL Server é instalado ou atualizado, usando um statement [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") semelhante ao mostrado aqui:

```sql
CREATE TABLE gtid_executed (
    source_uuid CHAR(36) NOT NULL,
    interval_start BIGINT(20) NOT NULL,
    interval_end BIGINT(20) NOT NULL,
    PRIMARY KEY (source_uuid, interval_start)
)
```

Aviso

Assim como com outras system tables do MySQL, não tente criar ou modificar esta table por conta própria.

A table `mysql.gtid_executed` é fornecida para uso interno pelo MySQL server. Ela permite que uma replica use GTIDs quando o binary logging estiver desabilitado na replica, e permite a retenção do estado do GTID quando os binary logs tiverem sido perdidos. Note que a table `mysql.gtid_executed` é limpa se você emitir [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement").

GTIDs são armazenados na table `mysql.gtid_executed` apenas quando [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) for `ON` ou `ON_PERMISSIVE`. O ponto em que os GTIDs são armazenados depende se o binary logging está habilitado ou desabilitado:

* Se o binary logging estiver desabilitado (`log_bin` for `OFF`), ou se [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) estiver desabilitado, o server armazena o GTID pertencente a cada transaction junto com a transaction no buffer quando a transaction é committed, e a background thread adiciona o conteúdo do buffer periodicamente como uma ou mais entradas na table `mysql.gtid_executed`. Além disso, a table é compactada periodicamente a uma taxa configurável pelo usuário; consulte [mysql.gtid_executed Table Compression](replication-gtids-concepts.html#replication-gtids-gtid-executed-table-compression "mysql.gtid_executed Table Compression"), para obter mais informações. Esta situação só pode ser aplicada a uma replica onde o binary logging ou o replica update logging estão desabilitados. Não se aplica a um replication source server, pois na source, o binary logging deve estar habilitado para que a replication ocorra.

* Se o binary logging estiver habilitado (`log_bin` for `ON`), sempre que o binary log for rotacionado ou o server for shut down, o server escreve os GTIDs para todas as transactions que foram escritas no binary log anterior na table `mysql.gtid_executed`. Esta situação se aplica a um replication source server, ou a uma replica onde o binary logging está habilitado.

  No caso de o server parar inesperadamente, o conjunto de GTIDs do arquivo de binary log atual não é salvo na table `mysql.gtid_executed`. Esses GTIDs são adicionados à table a partir do arquivo de binary log durante a recovery. A exceção a isto é se o binary logging não estiver habilitado quando o server for reiniciado. Nesta situação, o server não pode acessar o arquivo de binary log para recuperar os GTIDs, portanto a replication não pode ser iniciada.

  Quando o binary logging está habilitado, a table `mysql.gtid_executed` não contém um registro completo dos GTIDs para todas as transactions executadas. Essa informação é fornecida pelo valor global da system variable [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed). Sempre use `@@GLOBAL.gtid_executed`, que é atualizado após cada commit, para representar o estado do GTID para o MySQL server, e não consulte a table `mysql.gtid_executed`.

##### Compressão da Tabela mysql.gtid_executed

Ao longo do tempo, a table `mysql.gtid_executed` pode ficar cheia de muitas rows referindo-se a GTIDs individuais que se originam no mesmo server, e cujos transaction IDs formam um range, semelhante ao mostrado aqui:

```sql
+--------------------------------------+----------------+--------------+
| source_uuid                          | interval_start | interval_end |
|--------------------------------------+----------------+--------------|
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 37             | 37           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 38             | 38           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 39             | 39           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 40             | 40           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 41             | 41           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 42             | 42           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 43             | 43           |
...
```

Para economizar espaço, o MySQL server compacta a table `mysql.gtid_executed` periodicamente, substituindo cada conjunto de rows por uma única row que abrange todo o intervalo de transaction identifiers, assim:

```sql
+--------------------------------------+----------------+--------------+
| source_uuid                          | interval_start | interval_end |
|--------------------------------------+----------------+--------------|
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 37             | 43           |
...
```

Você pode controlar o número de transactions que podem decorrer antes que a table seja compactada e, portanto, a taxa de compressão, definindo a system variable [`gtid_executed_compression_period`](replication-options-gtids.html#sysvar_gtid_executed_compression_period). O valor default desta variável é 1000, o que significa que, por default, a compressão da table é executada após cada 1000 transactions. Definir [`gtid_executed_compression_period`](replication-options-gtids.html#sysvar_gtid_executed_compression_period) para 0 impede que a compressão seja executada, e você deve estar preparado para um potencial grande aumento na quantidade de espaço em disco que pode ser exigida pela table `gtid_executed` se fizer isso.

Note

Quando o binary logging está habilitado, o valor de [`gtid_executed_compression_period`](replication-options-gtids.html#sysvar_gtid_executed_compression_period) *não* é usado e a table `mysql.gtid_executed` é compactada a cada rotação do binary log.

A compressão da table `mysql.gtid_executed` é realizada por uma foreground thread dedicada chamada `thread/sql/compress_gtid_table`. Esta thread não está listada na saída de [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"), mas pode ser vista como uma row na table [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table"), conforme mostrado aqui:

```sql
mysql> SELECT * FROM performance_schema.threads WHERE NAME LIKE '%gtid%'\G
*************************** 1. row ***************************
          THREAD_ID: 26
               NAME: thread/sql/compress_gtid_table
               TYPE: FOREGROUND
     PROCESSLIST_ID: 1
   PROCESSLIST_USER: NULL
   PROCESSLIST_HOST: NULL
     PROCESSLIST_DB: NULL
PROCESSLIST_COMMAND: Daemon
   PROCESSLIST_TIME: 1509
  PROCESSLIST_STATE: Suspending
   PROCESSLIST_INFO: NULL
   PARENT_THREAD_ID: 1
               ROLE: NULL
       INSTRUMENTED: YES
            HISTORY: YES
    CONNECTION_TYPE: NULL
       THREAD_OS_ID: 18677
```

A thread `thread/sql/compress_gtid_table` normalmente dorme até que [`gtid_executed_compression_period`](replication-options-gtids.html#sysvar_gtid_executed_compression_period) transactions tenham sido executadas, então acorda para executar a compressão da table `mysql.gtid_executed`, conforme descrito anteriormente. Em seguida, ela dorme até que mais [`gtid_executed_compression_period`](replication-options-gtids.html#sysvar_gtid_executed_compression_period) transactions tenham ocorrido, e então acorda para realizar a compressão novamente, repetindo este loop indefinidamente. Definir este valor como 0 quando o binary logging estiver desabilitado significa que a thread sempre dorme e nunca acorda, o que significa que este método explícito de compressão não é usado. Em vez disso, a compressão ocorre implicitamente, conforme necessário.