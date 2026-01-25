#### 16.1.7.1 Verificando o Status da Replicação

A tarefa mais comum ao gerenciar um processo de Replication é garantir que a Replication esteja ocorrendo e que não houve erros entre a replica e o source.

A instrução [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"), que você deve executar em cada replica, fornece informações sobre a configuração e o status da conexão entre o replica server e o source server. A partir do MySQL 5.7, o Performance Schema possui tabelas de Replication que fornecem essas informações de uma forma mais acessível. Consulte [Seção 25.12.11, “Performance Schema Replication Tables”](performance-schema-replication-tables.html "25.12.11 Performance Schema Replication Tables").

A instrução [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") também forneceu algumas informações relacionadas especificamente às replicas. A partir da versão 5.7.5 do MySQL, as seguintes variáveis de status previamente monitoradas usando [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") foram descontinuadas e movidas para as tabelas de Replication do Performance Schema:

* [`Slave_retried_transactions`](server-status-variables.html#statvar_Slave_retried_transactions)
* [`Slave_last_heartbeat`](server-status-variables.html#statvar_Slave_last_heartbeat)
* [`Slave_received_heartbeats`](server-status-variables.html#statvar_Slave_received_heartbeats)
* [`Slave_heartbeat_period`](server-status-variables.html#statvar_Slave_heartbeat_period)
* [`Slave_running`](server-status-variables.html#statvar_Slave_running)

As informações de heartbeat da Replication mostradas nas tabelas de Replication do Performance Schema permitem verificar se a conexão de Replication está ativa, mesmo que o source não tenha enviado eventos para a replica recentemente. O source envia um sinal de heartbeat para uma replica se não houver atualizações e nem eventos não enviados no Binary Log por um período maior do que o intervalo de heartbeat. A configuração `MASTER_HEARTBEAT_PERIOD` no source (definida pela instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement")) especifica a frequência do heartbeat, que por padrão é metade do intervalo de timeout de conexão para a replica ([`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout)). A tabela [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") do Performance Schema mostra quando o sinal de heartbeat mais recente foi recebido por uma replica e quantos sinais de heartbeat ela recebeu.

Se você estiver usando a instrução [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") para verificar o status de uma replica individual, a instrução fornece as seguintes informações:

```sql
mysql> SHOW SLAVE STATUS\G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: source1
                  Master_User: root
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000004
          Read_Master_Log_Pos: 931
               Relay_Log_File: replica1-relay-bin.000056
                Relay_Log_Pos: 950
        Relay_Master_Log_File: mysql-bin.000004
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
          Exec_Master_Log_Pos: 931
              Relay_Log_Space: 1365
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
  Replicate_Ignore_Server_Ids: 0
```

Os campos chave do relatório de status a serem examinados são:

* `Slave_IO_State`: O status atual da replica. Consulte [Seção 8.14.6, “Replication Replica I/O Thread States”](replica-io-thread-states.html "8.14.6 Replication Replica I/O Thread States") e [Seção 8.14.7, “Replication Replica SQL Thread States”](replica-sql-thread-states.html "8.14.7 Replication Replica SQL Thread States"), para mais informações.

* `Slave_IO_Running`: Se o I/O Thread para leitura do Binary Log do source está em execução. Normalmente, você deseja que isso seja `Yes`, a menos que você ainda não tenha iniciado a Replication ou a tenha parado explicitamente com [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement").

* `Slave_SQL_Running`: Se o SQL Thread para execução de eventos no Relay Log está em execução. Assim como o I/O Thread, isso deve ser `Yes` normalmente.

* `Last_IO_Error`, `Last_SQL_Error`: Os últimos erros registrados pelos I/O Threads e SQL Threads ao processar o Relay Log. Idealmente, eles devem estar em branco, indicando que não há erros.

* `Seconds_Behind_Master`: O número de segundos que o SQL Thread da Replication está atrasado no processamento do Binary Log do source. Um número alto (ou crescente) pode indicar que a replica é incapaz de lidar com eventos do source em tempo hábil.

  Um valor de 0 para `Seconds_Behind_Master` geralmente pode ser interpretado como um sinal de que a replica alcançou o source, mas há alguns casos em que isso não é estritamente verdade. Por exemplo, isso pode ocorrer se a conexão de rede entre source e replica for interrompida, mas o I/O Thread da Replication ainda não tiver percebido isso – ou seja, o [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout) ainda não expirou.

  Também é possível que valores transientes para `Seconds_Behind_Master` não reflitam a situação com precisão. Quando o SQL Thread da Replication alcança o I/O, `Seconds_Behind_Master` exibe 0; mas quando o I/O Thread da Replication ainda está enfileirando um novo evento, `Seconds_Behind_Master` pode mostrar um valor alto até que o SQL Thread termine de executar o novo evento. Isso é especialmente provável quando os eventos têm carimbos de data/hora (timestamps) antigos; nesses casos, se você executar [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") várias vezes em um período relativamente curto, você poderá ver esse valor alternar repetidamente entre 0 e um valor relativamente grande.

Vários pares de campos fornecem informações sobre o progresso da replica na leitura de eventos do Binary Log do source e no processamento deles no Relay Log:

* (`Master_Log_file`, `Read_Master_Log_Pos`): Coordenadas no Binary Log do source indicando o quão longe o I/O Thread da Replication leu eventos desse log.

* (`Relay_Master_Log_File`, `Exec_Master_Log_Pos`): Coordenadas no Binary Log do source indicando o quão longe o SQL Thread da Replication executou eventos recebidos desse log.

* (`Relay_Log_File`, `Relay_Log_Pos`): Coordenadas no Relay Log da replica indicando o quão longe o SQL Thread da Replication executou o Relay Log. Estas correspondem às coordenadas anteriores, mas são expressas nas coordenadas do Relay Log da replica, em vez das coordenadas do Binary Log do source.

No source, você pode verificar o status das replicas conectadas usando [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") para examinar a lista de processos em execução. Conexões de replica têm `Binlog Dump` no campo `Command`:

```sql
mysql> SHOW PROCESSLIST \G;
*************************** 4. row ***************************
     Id: 10
   User: root
   Host: replica1:58371
     db: NULL
Command: Binlog Dump
   Time: 777
  State: Has sent all binlog to slave; waiting for binlog to be updated
   Info: NULL
```

Como é a replica que conduz o processo de Replication, muito pouca informação está disponível neste relatório.

Para replicas que foram iniciadas com a opção [`--report-host`](replication-options-replica.html#sysvar_report_host) e estão conectadas ao source, a instrução [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement") no source mostra informações básicas sobre as replicas. A saída inclui o ID do replica server, o valor da opção [`--report-host`](replication-options-replica.html#sysvar_report_host), a porta de conexão (connecting port) e o ID do source:

```sql
mysql> SHOW SLAVE HOSTS;
+-----------+----------+------+-------------------+-----------+
| Server_id | Host     | Port | Rpl_recovery_rank | Master_id |
+-----------+----------+------+-------------------+-----------+
|        10 | replica1 | 3306 |                 0 |         1 |
+-----------+----------+------+-------------------+-----------+
1 row in set (0.00 sec)
```