#### 19.1.7.1 Verificar o status da replicação

A tarefa mais comum ao gerenciar um processo de replicação é garantir que a replicação esteja ocorrendo e que não haja erros entre a replica e a fonte.

A declaração `SHOW REPLICA STATUS`, que você deve executar em cada replica, fornece informações sobre a configuração e o status da conexão entre o servidor de replica e o servidor de origem. A partir do MySQL 8.0.22, `SHOW SLAVE STATUS` é desatualizado e `SHOW REPLICA STATUS` está disponível para uso. O Schema de Desempenho tem tabelas de replicação que fornecem essas informações de uma forma mais acessível. Veja a Seção 29.12.11, “Tabelas de Replicação do Schema de Desempenho”.

As informações sobre o batimento cardíaco de replicação exibidas nas tabelas de replicação do Schema de Desempenho permitem verificar se a conexão de replicação está ativa, mesmo que a fonte não tenha enviado eventos para a réplica recentemente. A fonte envia um sinal de batimento cardíaco para uma réplica se não houver atualizações ou eventos não enviados no log binário por um período maior que o intervalo de batimento cardíaco. A configuração `MASTER_HEARTBEAT_PERIOD` na fonte (definida pela declaração `CHANGE MASTER TO`) especifica a frequência do batimento cardíaco, que é a metade do intervalo de tempo de desconexão da conexão para a réplica (especificado pela variável de sistema `replica_net_timeout` ou `slave_net_timeout`). A tabela do Schema de Desempenho `replication_connection_status` mostra quando o sinal de batimento cardíaco mais recente foi recebido por uma réplica e quantas vezes recebeu sinais de batimento cardíaco.

Se você estiver usando a instrução `SHOW REPLICA STATUS` para verificar o status de uma replica individual, a instrução fornece as seguintes informações:

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

- `Replica_IO_State`: O status atual da replica. Consulte a Seção 10.14.5, “Estados de Threads de E/S de Replicação (Receptor)”, e a Seção 10.14.6, “Estados de Threads de SQL de Replicação”, para obter mais informações.

- `Replica_IO_Running`: Se a thread de E/S (receptor) para ler o log binário da fonte está em execução. Normalmente, você deseja que isso seja `Yes`, a menos que você ainda não tenha iniciado a replicação ou a tenha parado explicitamente com `STOP REPLICA`.

- `Replica_SQL_Running`: Se o fio SQL para executar eventos no log de relé está em execução. Assim como o fio de E/S, isso normalmente deve ser `Yes`.

- `Last_IO_Error`, `Last_SQL_Error`: Os últimos erros registrados pelas threads de I/O (receptor) e SQL (aplicador) ao processar o log de retransmissão. Idealmente, esses devem estar em branco, indicando ausência de erros.

- `Seconds_Behind_Source`: O número de segundos que o thread de replicação SQL (aplicador) está atrasado no processamento do log binário de origem. Um número alto (ou um número crescente) pode indicar que a replica não consegue lidar com os eventos da origem de forma oportuna.

  Um valor de 0 para `Seconds_Behind_Source` geralmente pode ser interpretado como indicando que a réplica alcançou a fonte, mas há alguns casos em que isso não é estritamente verdadeiro. Por exemplo, isso pode ocorrer se a conexão de rede entre a fonte e a réplica for interrompida, mas o fio de I/O de replicação (receptor) ainda não notou isso; ou seja, o período de tempo definido por `replica_net_timeout` ou `slave_net_timeout` ainda não passou.

  Também é possível que os valores transitórios para `Seconds_Behind_Source` não reflitam a situação com precisão. Quando o fio de SQL de replicação (aplicador) recupera o I/O, `Seconds_Behind_Source` exibe 0; mas quando o fio de I/O de replicação (receptor) ainda está agendando um novo evento, `Seconds_Behind_Source` pode mostrar um valor grande até que o fio de aplicador de replicação termine a execução do novo evento. Isso é especialmente provável quando os eventos têm timestamps antigos; nesses casos, se você executar `SHOW REPLICA STATUS` várias vezes em um período relativamente curto, você pode ver esse valor mudar para frente e para trás repetidamente entre 0 e um valor relativamente grande.

Vários pares de campos fornecem informações sobre o progresso da replica na leitura de eventos do log binário de origem e seu processamento no log de retransmissão:

- (`Master_Log_file`, `Read_Master_Log_Pos`): Coordenadas no log binário de origem que indicam até onde a thread de I/O de replicação (receptor) leu os eventos desse log.

- (`Relay_Master_Log_File`, `Exec_Master_Log_Pos`): Coordenadas no log binário de origem que indicam até onde a thread de SQL de replicação (aplicador) executou os eventos recebidos desse log.

- (`Relay_Log_File`, `Relay_Log_Pos`): Coordenadas no log de retransmissão da replica que indicam até onde a thread de SQL de replicação (aplicador) executou o log de retransmissão. Essas correspondem às coordenadas anteriores, mas são expressas em coordenadas do log de retransmissão da replica, em vez de coordenadas do log binário de origem.

Na fonte, você pode verificar o status das réplicas conectadas usando `SHOW PROCESSLIST` para examinar a lista de processos em execução. As conexões de réplica têm `Binlog Dump` no campo `Command`:

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

Como é a réplica que impulsiona o processo de replicação, muito poucas informações estão disponíveis neste relatório.

Para réplicas iniciadas com a opção `--report-host` e conectadas à fonte, a instrução `SHOW REPLICAS` (ou antes do MySQL 8.0.22, `SHOW SLAVE HOSTS`) na fonte exibe informações básicas sobre as réplicas. A saída inclui o ID do servidor da réplica, o valor da opção `--report-host`, a porta de conexão e o ID da fonte:

```
mysql> SHOW REPLICAS;
+-----------+----------+------+-------------------+-----------+
| Server_id | Host     | Port | Rpl_recovery_rank | Source_id |
+-----------+----------+------+-------------------+-----------+
|        10 | replica1 | 3306 |                 0 |         1 |
+-----------+----------+------+-------------------+-----------+
1 row in set (0.00 sec)
```
