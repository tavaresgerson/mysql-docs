#### 19.1.7.1 Verificar o Status da Replicação

A tarefa mais comum ao gerenciar um processo de replicação é garantir que a replicação esteja ocorrendo e que não tenham havido erros entre a replica e a fonte.

A instrução `SHOW REPLICA STATUS`, que você deve executar em cada replica, fornece informações sobre a configuração e o status da conexão entre o servidor da replica e o servidor da fonte. O Schema de Desempenho do MySQL contém tabelas de replicação que fornecem essas informações de uma forma mais acessível. Veja a Seção 29.12.11, “Tabelas de Replicação do Schema de Desempenho”.

As informações do batimento cardíaco de replicação mostradas nas tabelas de replicação do Schema de Desempenho permitem verificar se a conexão de replicação está ativa, mesmo que a fonte não tenha enviado eventos para a replica recentemente. A fonte envia um sinal de batimento cardíaco para uma replica se não houver atualizações ou eventos não enviados no log binário por um período maior que o intervalo de batimento cardíaco. A configuração `SOURCE_HEARTBEAT_PERIOD` na fonte (definida por `CHANGE REPLICATION SOURCE TO`) especifica a frequência do batimento cardíaco, que é a metade do intervalo de tempo de conexão para a replica (especificado pela variável de sistema `replica_net_timeout`. A tabela do Schema de Desempenho `replication_connection_status` mostra quando o sinal de batimento cardíaco mais recente foi recebido por uma replica e quantos sinais de batimento cardíaco ela recebeu.

Você pode usar `SHOW REPLICA STATUS` para verificar o status de uma replica individual; essa instrução fornece as informações mostradas aqui:

```
mysql> SHOW REPLICA STATUS\G
*************************** 1. row ***************************
             Replica_IO_State: Waiting for source to send event
                  Source_Host: 127.0.0.1
                  Source_User: root
                  Source_Port: 13000
                Connect_Retry: 1
              Source_Log_File: master-bin.000001
          Read_Source_Log_Pos: 927
               Relay_Log_File: slave-relay-bin.000002
                Relay_Log_Pos: 1145
        Relay_Source_Log_File: master-bin.000001
           Replica_IO_Running: Yes
          Replica_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Source_Log_Pos: 927
              Relay_Log_Space: 1355
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Source_SSL_Allowed: No
           Source_SSL_CA_File:
           Source_SSL_CA_Path:
              Source_SSL_Cert:
            Source_SSL_Cipher:
               Source_SSL_Key:
        Seconds_Behind_Source: 0
Source_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Source_Server_Id: 1
                  Source_UUID: 73f86016-978b-11ee-ade5-8d2a2a562feb
             Source_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
    Replica_SQL_Running_State: Replica has read all relay log; waiting for more updates
           Source_Retry_Count: 10
                  Source_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Source_SSL_Crl:
           Source_SSL_Crlpath:
           Retrieved_Gtid_Set: 73f86016-978b-11ee-ade5-8d2a2a562feb:1-3
            Executed_Gtid_Set: 73f86016-978b-11ee-ade5-8d2a2a562feb:1-3
                Auto_Position: 1
         Replicate_Rewrite_DB:
                 Channel_Name:
           Source_TLS_Version:
       Source_public_key_path:
        Get_Source_public_key: 0
            Network_Namespace:
```

Os campos principais do relatório de status a serem examinados são:

* `Replica_IO_State`: O estado atual da replica. Consulte a Seção 10.14.5, “Estados dos Threads de E/S de Replicação (Receptor)”, e a Seção 10.14.6, “Estados dos Threads SQL de Replicação”, para obter mais informações.

* `Replica_IO_Running`: Se o thread de E/S (receptor) para leitura do log binário da fonte está em execução. Normalmente, você deseja que isso seja `Sim`, a menos que você ainda não tenha iniciado a replicação ou tenha parado explicitamente com `STOP REPLICA`.

* `Replica_SQL_Running`: Se o thread SQL para execução de eventos no log de relevo está em execução. Como no thread de E/S, isso normalmente deve ser `Sim`.

* `Last_IO_Error`, `Last_SQL_Error`: Os últimos erros registrados pelos threads de E/S (receptor) e SQL (aplicativo) ao processar o log de relevo. Idealmente, esses devem estar em branco, indicando que não há erros.

* `Seconds_Behind_Source`: O número de segundos que o thread SQL de replicação (aplicativo) está atrasado no processamento do log binário da fonte. Um número alto (ou um número crescente) pode indicar que a replica não consegue lidar com os eventos da fonte de forma oportuna.

Um valor de 0 para `Seconds_Behind_Source` geralmente pode ser interpretado como indicando que a replica alcançou a fonte, mas há alguns casos em que isso não é estritamente verdadeiro. Por exemplo, isso pode ocorrer se a conexão de rede entre a fonte e a replica for interrompida, mas o thread de E/S (receptor) de replicação ainda não notou isso; ou seja, o período de tempo definido por `replica_net_timeout` ainda não expirou.

Também é possível que os valores transitórios para `Seconds_Behind_Source` não reflitam a situação com precisão. Quando o thread de aplicação de SQL de replicação (aplicador) recupera o I/O, `Seconds_Behind_Source` exibe 0; mas quando o thread de I/O de replicação (receptor) ainda está agendando um novo evento, `Seconds_Behind_Source` pode mostrar um valor grande até que o thread de aplicação de replicação termine a execução do novo evento. Isso é especialmente provável quando os eventos têm timestamps antigos; nesses casos, se você executar `SHOW REPLICA STATUS` várias vezes em um período relativamente curto, você pode ver esse valor mudar repetidamente entre 0 e um valor relativamente grande.

Vários pares de campos fornecem informações sobre o progresso da replica na leitura de eventos do log binário de origem e no processamento deles no log de relevo:

* (`Master_Log_file`, `Read_Master_Log_Pos`): Coordenadas no log binário de origem que indicam até onde o thread de I/O de replicação (receptor) leu eventos desse log.

* (`Relay_Master_Log_File`, `Exec_Master_Log_Pos`): Coordenadas no log binário de origem que indicam até onde o thread de SQL de replicação (aplicador) executou eventos recebidos desse log.

* (`Relay_Log_File`, `Relay_Log_Pos`): Coordenadas no log de relevo da replica que indicam até onde o thread de SQL de replicação (aplicador) executou o log de relevo. Essas correspondem às coordenadas anteriores, mas são expressas em coordenadas do log de relevo da replica em vez de coordenadas do log binário de origem.

Na origem, você pode verificar o status das réplicas conectadas usando `SHOW PROCESSLIST` para examinar a lista de processos em execução. As conexões de replica têm `Binlog Dump` no campo `Command`:

```
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

Como é a replica que impulsiona o processo de replicação, há pouquíssimas informações disponíveis neste relatório.

Para réplicas que foram iniciadas com a opção `--report-host` e estão conectadas à fonte, a instrução `SHOW REPLICAS` na fonte mostra informações básicas sobre as réplicas. A saída inclui o ID do servidor da replica, o valor da opção `--report-host`, a porta de conexão e o ID da fonte:

```
mysql> SHOW REPLICAS;
+-----------+----------+------+-------------------+-----------+
| Server_id | Host     | Port | Rpl_recovery_rank | Source_id |
+-----------+----------+------+-------------------+-----------+
|        10 | replica1 | 3306 |                 0 |         1 |
+-----------+----------+------+-------------------+-----------+
1 row in set (0.00 sec)
```