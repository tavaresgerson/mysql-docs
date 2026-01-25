#### 13.7.5.34 Instrução SHOW SLAVE STATUS

```sql
SHOW SLAVE STATUS [FOR CHANNEL channel]
```

Esta instrução fornece informações de status sobre parâmetros essenciais dos threads da replica. Ela requer o privilégio [`SUPER`](privileges-provided.html#priv_super) ou [`REPLICATION CLIENT`](privileges-provided.html#priv_replication-client).

Se você emitir esta instrução usando o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), você pode usar um terminador de instrução `\G` em vez de um ponto e vírgula para obter um layout vertical mais legível:

```sql
mysql> SHOW SLAVE STATUS\G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: localhost
                  Master_User: repl
                  Master_Port: 13000
                Connect_Retry: 60
              Master_Log_File: source-bin.000002
          Read_Master_Log_Pos: 1307
               Relay_Log_File: replica-relay-bin.000003
                Relay_Log_Pos: 1508
        Relay_Master_Log_File: source-bin.000002
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 1307
              Relay_Log_Space: 1858
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File:
           Master_SSL_CA_Path:
              Master_SSL_Cert:
            Master_SSL_Cipher:
               Master_SSL_Key:
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Master_Server_Id: 1
                  Master_UUID: 3e11fa47-71ca-11e1-9e33-c80aa9429562
             Master_Info_File: /var/mysqld.2/data/master.info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Reading event from the relay log
           Master_Retry_Count: 10
                  Master_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Master_SSL_Crl:
           Master_SSL_Crlpath:
           Retrieved_Gtid_Set: 3e11fa47-71ca-11e1-9e33-c80aa9429562:1-5
            Executed_Gtid_Set: 3e11fa47-71ca-11e1-9e33-c80aa9429562:1-5
                Auto_Position: 1
         Replicate_Rewrite_DB:
                 Channel_name:
           Master_TLS_Version: TLSv1.2
```

O Performance Schema fornece tabelas que expõem informações de replicação. Isso é semelhante às informações disponíveis na instrução [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"), mas representadas em formato de tabela. Para detalhes, veja [Seção 25.12.11, “Performance Schema Replication Tables”](performance-schema-replication-tables.html "25.12.11 Performance Schema Replication Tables").

A lista a seguir descreve os campos retornados por [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). Para informações adicionais sobre a interpretação de seus significados, veja [Seção 16.1.7.1, “Checking Replication Status”](replication-administration-status.html "16.1.7.1 Checking Replication Status").

* `Slave_IO_State`

  Uma cópia do campo `State` da saída do [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") para o thread I/O da replica. Isso informa o que o thread está fazendo: tentando conectar-se à source, esperando por events da source, reconectando-se à source, e assim por diante. Para uma lista de estados possíveis, veja [Seção 8.14.6, “Replication Replica I/O Thread States”](replica-io-thread-states.html "8.14.6 Replication Replica I/O Thread States").

* `Master_Host`

  O host source ao qual a replica está conectada.

* `Master_User`

  O nome de usuário da conta usada para conectar-se à source.

* `Master_Port`

  A port usada para conectar-se à source.

* `Connect_Retry`

  O número de segundos entre as tentativas de reconexão (padrão 60). Isso pode ser definido com a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement").

* `Master_Log_File`

  O nome do arquivo binary log da source do qual o thread I/O está lendo atualmente.

* `Read_Master_Log_Pos`

  A position no arquivo binary log atual da source até a qual o thread I/O leu.

* `Relay_Log_File`

  O nome do arquivo relay log do qual o thread SQL está lendo e executando atualmente.

* `Relay_Log_Pos`

  A position no arquivo relay log atual até a qual o thread SQL leu e executou.

* `Relay_Master_Log_File`

  O nome do arquivo binary log da source contendo o event mais recente executado pelo thread SQL.

* `Slave_IO_Running`

  Se o thread I/O está iniciado e se conectou com sucesso à source. Internamente, o estado deste thread é representado por um dos três valores a seguir:

  + **MYSQL_SLAVE_NOT_RUN.** O thread I/O da replica não está rodando. Para este estado, `Slave_IO_Running` é `No`.

  + **MYSQL_SLAVE_RUN_NOT_CONNECT.** O thread I/O da replica está rodando, mas não está conectado a uma source de replicação. Para este estado, `Slave_IO_Running` é `Connecting`.

  + **MYSQL_SLAVE_RUN_CONNECT.** O thread I/O da replica está rodando e está conectado a uma source de replicação. Para este estado, `Slave_IO_Running` é `Yes`.

  O valor da variável de status do sistema [`Slave_running`](server-status-variables.html#statvar_Slave_running) corresponde a este valor.

* `Slave_SQL_Running`

  Se o thread SQL está iniciado.

* `Replicate_Do_DB`, `Replicate_Ignore_DB`

  As listas de Databases que foram especificadas com as opções [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) e [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db), se houver.

* `Replicate_Do_Table`, `Replicate_Ignore_Table`, `Replicate_Wild_Do_Table`, `Replicate_Wild_Ignore_Table`

  As listas de tables que foram especificadas com as opções [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table), [`--replicate-ignore-table`](replication-options-replica.html#option_mysqld_replicate-ignore-table), [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) e [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table), se houver.

* `Last_Errno`, `Last_Error`

  Estas colunas são aliases para `Last_SQL_Errno` e `Last_SQL_Error`.

  Emitir [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") ou [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") redefine os valores mostrados nestas colunas.

  Note

  Quando o thread SQL da replica recebe um erro, ele relata o erro primeiro, depois para o thread SQL. Isso significa que há uma pequena janela de tempo durante a qual [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") mostra um valor diferente de zero para `Last_SQL_Errno`, mesmo que `Slave_SQL_Running` ainda exiba `Yes`.

* `Skip_Counter`

  O valor atual da variável de sistema [`sql_slave_skip_counter`](replication-options-replica.html#sysvar_sql_slave_skip_counter). Veja [Seção 13.4.2.4, “SET GLOBAL sql_slave_skip_counter Syntax”](set-global-sql-slave-skip-counter.html "13.4.2.4 SET GLOBAL sql_slave_skip_counter Syntax").

* `Exec_Master_Log_Pos`

  A position no arquivo binary log atual da source até a qual o thread SQL leu e executou, marcando o início da próxima transaction ou event a ser processado. Você pode usar este valor com a opção `MASTER_LOG_POS` da instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") ao iniciar uma nova replica a partir de uma replica existente, para que a nova replica leia a partir deste ponto. As coordenadas dadas por (`Relay_Master_Log_File`, `Exec_Master_Log_Pos`) no binary log da source correspondem às coordenadas dadas por (`Relay_Log_File`, `Relay_Log_Pos`) no relay log.

  Inconsistências na sequência de transactions do relay log que foram executadas podem fazer com que este valor seja uma “marca de nível baixo” (low-water mark). Em outras palavras, transactions que aparecem antes da position têm garantia de terem sido commitadas, mas transactions após a position podem ter sido commitadas ou não. Se essas lacunas precisarem ser corrigidas, use [`START SLAVE UNTIL SQL_AFTER_MTS_GAPS`](start-slave.html "13.4.2.5 START SLAVE Statement"). Veja [Seção 16.4.1.32, “Replication and Transaction Inconsistencies”](replication-features-transaction-inconsistencies.html "16.4.1.32 Replication and Transaction Inconsistencies") para mais informações.

* `Relay_Log_Space`

  O tamanho total combinado de todos os arquivos relay log existentes.

* `Until_Condition`, `Until_Log_File`, `Until_Log_Pos`

  Os valores especificados na cláusula `UNTIL` da instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement").

  `Until_Condition` tem estes valores:

  + `None` se nenhuma cláusula `UNTIL` foi especificada

  + `Master` se a replica estiver lendo até uma determinada position no binary log da source

  + `Relay` se a replica estiver lendo até uma determinada position em seu relay log

  + `SQL_BEFORE_GTIDS` se o thread SQL da replica estiver processando transactions até atingir a primeira transaction cujo GTID está listado no `gtid_set`.

  + `SQL_AFTER_GTIDS` se os threads da replica estiverem processando todas as transactions até que a última transaction no `gtid_set` tenha sido processada por ambos os threads.

  + [`SQL_AFTER_MTS_GAPS`](start-slave.html "13.4.2.5 START SLAVE Statement") se os threads SQL de uma replica multithreaded estiverem rodando até que não sejam encontradas mais lacunas no relay log.

  `Until_Log_File` e `Until_Log_Pos` indicam o nome e a position do arquivo log que definem as coordenadas nas quais o thread SQL para a execução.

  Para mais informações sobre as cláusulas `UNTIL`, veja [Seção 13.4.2.5, “START SLAVE Statement”](start-slave.html "13.4.2.5 START SLAVE Statement").

* `Master_SSL_Allowed`, `Master_SSL_CA_File`, `Master_SSL_CA_Path`, `Master_SSL_Cert`, `Master_SSL_Cipher`, `Master_SSL_CRL_File`, `Master_SSL_CRL_Path`, `Master_SSL_Key`, `Master_SSL_Verify_Server_Cert`

  Estes campos mostram os parâmetros SSL usados pela replica para se conectar à source, se houver.

  `Master_SSL_Allowed` tem estes valores:

  + `Yes` se uma conexão SSL com a source for permitida

  + `No` se uma conexão SSL com a source não for permitida

  + `Ignored` se uma conexão SSL for permitida, mas o servidor replica não tiver suporte a SSL habilitado

  Os valores dos outros campos relacionados a SSL correspondem aos valores das opções `MASTER_SSL_CA`, `MASTER_SSL_CAPATH`, `MASTER_SSL_CERT`, `MASTER_SSL_CIPHER`, `MASTER_SSL_CRL`, `MASTER_SSL_CRLPATH`, `MASTER_SSL_KEY` e `MASTER_SSL_VERIFY_SERVER_CERT` para a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"). Veja [Seção 13.4.2.1, “CHANGE MASTER TO Statement”](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement").

* `Seconds_Behind_Master`

  Este campo é uma indicação de quão “atrasada” a replica está:

  + Quando a replica está processando updates ativamente, este campo mostra a diferença entre o timestamp atual na replica e o timestamp original registrado na source para o event atualmente em processamento na replica.

  + Quando nenhum event está sendo processado atualmente na replica, este valor é 0.

  Em essência, este campo mede a diferença de tempo em segundos entre o thread SQL da replica e o thread I/O da replica. Se a conexão de rede entre a source e a replica for rápida, o thread I/O da replica está muito próximo da source, então este campo é uma boa aproximação de quão atrasado o thread SQL da replica está em comparação com a source. Se a rede for lenta, esta *não* é uma boa aproximação; o thread SQL da replica pode frequentemente alcançar o thread I/O da replica (que está lendo lentamente), então `Seconds_Behind_Master` frequentemente mostra um valor de 0, mesmo que o thread I/O esteja atrasado em comparação com a source. Em outras palavras, *esta coluna é útil apenas para redes rápidas*.

  Este cálculo de diferença de tempo funciona mesmo que a source e a replica não tenham horários de clock idênticos, desde que a diferença, calculada quando o thread I/O da replica inicia, permaneça constante a partir daí. Quaisquer alterações — incluindo atualizações NTP — podem levar a desvios de clock que podem tornar o cálculo de `Seconds_Behind_Master` menos confiável.

  No MySQL 5.7, este campo é `NULL` (indefinido ou desconhecido) se o thread SQL da replica não estiver rodando, ou se o thread SQL tiver consumido todo o relay log e o thread I/O da replica não estiver rodando. (Em versões mais antigas do MySQL, este campo era `NULL` se o thread SQL da replica ou o thread I/O da replica não estivesse rodando ou não estivesse conectado à source.) Se o thread I/O estiver rodando, mas o relay log estiver esgotado, `Seconds_Behind_Master` é definido como 0.

  O valor de `Seconds_Behind_Master` é baseado nos timestamps armazenados nos events, que são preservados através da replicação. Isso significa que se uma source M1 é ela mesma uma replica de M0, qualquer event do binary log de M1 que se origine do binary log de M0 tem o timestamp de M0 para aquele event. Isso permite que o MySQL replique [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") com sucesso. No entanto, o problema para `Seconds_Behind_Master` é que se M1 também receber updates diretos de clients, o valor de `Seconds_Behind_Master` flutua aleatoriamente porque às vezes o último event de M1 se origina de M0 e às vezes é o resultado de um update direto em M1.

  Ao usar uma replica multithreaded, você deve ter em mente que este valor é baseado em `Exec_Master_Log_Pos`, e portanto pode não refletir a position da transaction commitada mais recentemente.

* `Last_IO_Errno`, `Last_IO_Error`

  O error number e a error message do erro mais recente que fez o thread I/O parar. Um error number de 0 e uma mensagem de string vazia significam “nenhum erro.” Se o valor de `Last_IO_Error` não estiver vazio, os valores de erro também aparecem no error log da replica.

  As informações de erro I/O incluem um timestamp mostrando quando o erro mais recente do thread I/O ocorreu. Este timestamp usa o formato *`YYMMDD hh:mm:ss`*, e aparece na coluna `Last_IO_Error_Timestamp`.

  Emitir [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") ou [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") redefine os valores mostrados nestas colunas.

* `Last_SQL_Errno`, `Last_SQL_Error`

  O error number e a error message do erro mais recente que fez o thread SQL parar. Um error number de 0 e uma mensagem de string vazia significam “nenhum erro.” Se o valor de `Last_SQL_Error` não estiver vazio, os valores de erro também aparecem no error log da replica.

  Se a replica for multithreaded, o thread SQL é o coordenador para os worker threads. Neste caso, o campo `Last_SQL_Error` mostra exatamente o que a coluna `Last_Error_Message` na tabela Performance Schema [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 The replication_applier_status_by_coordinator Table") mostra. O valor do campo é modificado para sugerir que pode haver mais falhas nos outros worker threads que podem ser vistas na tabela [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table") que mostra o status de cada worker thread. Se essa tabela não estiver disponível, o error log da replica pode ser usado. O log ou a tabela [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table") também deve ser usada para saber mais sobre a falha mostrada por [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") ou pela tabela do coordenador.

  As informações de erro SQL incluem um timestamp mostrando quando o erro mais recente do thread SQL ocorreu. Este timestamp usa o formato *`YYMMDD hh:mm:ss`*, e aparece na coluna `Last_SQL_Error_Timestamp`.

  Emitir [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") ou [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") redefine os valores mostrados nestas colunas.

  No MySQL 5.7, todos os error codes e messages exibidos nas colunas `Last_SQL_Errno` e `Last_SQL_Error` correspondem aos valores de erro listados em [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html). Isso nem sempre foi verdade em versões anteriores. (Bug #11760365, Bug #52768)

* `Replicate_Ignore_Server_Ids`

  No MySQL 5.7, você configura uma replica para ignorar events de 0 ou mais sources usando a opção `IGNORE_SERVER_IDS` da instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"). Por padrão, isso está em branco e geralmente é modificado apenas ao usar uma configuração de replicação circular ou multisuporte. A mensagem mostrada para `Replicate_Ignore_Server_Ids` quando não está em branco consiste em uma lista separada por vírgulas de um ou mais números, indicando os server IDs a serem ignorados. Por exemplo:

  ```sql
  	Replicate_Ignore_Server_Ids: 2, 6, 9
  ```

  Note

  `Ignored_server_ids` também mostra os server IDs a serem ignorados, mas é uma lista separada por espaços, que é precedida pelo número total de server IDs a serem ignorados. Por exemplo, se uma instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") contendo a opção `IGNORE_SERVER_IDS = (2,6,9)` foi emitida para dizer a uma replica para ignorar sources que tenham o server ID 2, 6 ou 9, essa informação aparece como mostrado aqui:

  ```sql
  	Ignored_server_ids: 3, 2, 6, 9
  ```

  O primeiro número (neste caso `3`) mostra o número de server IDs que estão sendo ignorados.

  A filtragem `Replicate_Ignore_Server_Ids` é executada pelo thread I/O, em vez de pelo thread SQL, o que significa que os events que são filtrados não são escritos no relay log. Isso difere das ações de filtragem tomadas por opções do servidor como [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table), que se aplicam ao thread SQL.

* `Master_Server_Id`

  O valor [`server_id`](replication-options.html#sysvar_server_id) da source.

* `Master_UUID`

  O valor [`server_uuid`](replication-options.html#sysvar_server_uuid) da source.

* `Master_Info_File`

  A localização do arquivo `master.info`.

* `SQL_Delay`

  O número de segundos que a replica deve atrasar em relação à source.

* `SQL_Remaining_Delay`

  Quando `Slave_SQL_Running_State` é `Waiting until MASTER_DELAY seconds after master executed event`, este campo contém o número de segundos de delay restantes. Em outros momentos, este campo é `NULL`.

* `Slave_SQL_Running_State`

  O estado do thread SQL (análogo a `Slave_IO_State`). O valor é idêntico ao valor `State` do thread SQL, conforme exibido por [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"). [Seção 8.14.7, “Replication Replica SQL Thread States”](replica-sql-thread-states.html "8.14.7 Replication Replica SQL Thread States"), fornece uma lista de estados possíveis.

* `Master_Retry_Count`

  O número de vezes que a replica pode tentar reconectar-se à source em caso de perda de conexão. Este valor pode ser definido usando a opção `MASTER_RETRY_COUNT` da instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") (preferencial) ou a opção de servidor mais antiga [`--master-retry-count`](replication-options-replica.html#option_mysqld_master-retry-count) (ainda suportada para compatibilidade retroativa).

* `Master_Bind`

  A interface de rede à qual a replica está vinculada, se houver. Isso é definido usando a opção `MASTER_BIND` para a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement").

* `Last_IO_Error_Timestamp`

  Um timestamp no formato *`YYMMDD hh:mm:ss`* que mostra quando o erro I/O mais recente ocorreu.

* `Last_SQL_Error_Timestamp`

  Um timestamp no formato *`YYMMDD hh:mm:ss`* que mostra quando o erro SQL mais recente ocorreu.

* `Retrieved_Gtid_Set`

  O set de global transaction IDs correspondente a todas as transactions recebidas por esta replica. Vazio se GTIDs não estiverem em uso. Veja [GTID Sets](replication-gtids-concepts.html#replication-gtids-concepts-gtid-sets "GTID Sets") para mais informações.

  Este é o set de todos os GTIDs que existem ou existiram nos relay logs. Cada GTID é adicionado assim que o `Gtid_log_event` é recebido. Isso pode fazer com que transactions parcialmente transmitidas tenham seus GTIDs incluídos no set.

  Quando todos os relay logs são perdidos devido à execução de [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") ou [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"), ou devido aos efeitos da opção [`--relay-log-recovery`](replication-options-replica.html#sysvar_relay_log_recovery), o set é limpo. Quando [`relay_log_purge = 1`](replication-options-replica.html#sysvar_relay_log_purge), o relay log mais recente é sempre mantido e o set não é limpo.

* `Executed_Gtid_Set`

  O set de global transaction IDs escritos no binary log. Este é o mesmo que o valor para a variável de sistema global [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) neste servidor, bem como o valor para `Executed_Gtid_Set` na saída de [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement") neste servidor. Vazio se GTIDs não estiverem em uso. Veja [GTID Sets](replication-gtids-concepts.html#replication-gtids-concepts-gtid-sets "GTID Sets") para mais informações.

* `Auto_Position`

  1 se o autopositioning estiver em uso; caso contrário, 0.

* `Replicate_Rewrite_DB`

  O valor `Replicate_Rewrite_DB` exibe quaisquer regras de filtragem de replicação que foram especificadas. Por exemplo, se a seguinte regra de filtro de replicação foi definida:

  ```sql
  CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB=((db1,db2), (db3,db4));
  ```

  o valor `Replicate_Rewrite_DB` exibe:

  ```sql
  Replicate_Rewrite_DB: (db1,db2),(db3,db4)
  ```

  Para mais informações, veja [Seção 13.4.2.2, “CHANGE REPLICATION FILTER Statement”](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement").

* `Channel_name`

  O canal de replicação que está sendo exibido. Há sempre um canal de replicação default, e mais canais de replicação podem ser adicionados. Veja [Seção 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") para mais informações.

* `Master_TLS_Version`

  A versão TLS usada na source. Para informações de versão TLS, veja [Seção 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers"). Esta coluna foi adicionada no MySQL 5.7.10.