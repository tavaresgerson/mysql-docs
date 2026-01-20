#### 16.1.7.1 Verificar o status da replicação

A tarefa mais comum ao gerenciar um processo de replicação é garantir que a replicação esteja ocorrendo e que não haja erros entre a replica e a fonte.

A instrução `SHOW SLAVE STATUS`, que você deve executar em cada replica, fornece informações sobre a configuração e o status da conexão entre o servidor replica e o servidor fonte. A partir do MySQL 5.7, o Schema de Desempenho tem tabelas de replicação que fornecem essas informações de uma forma mais acessível. Veja Seção 25.12.11, “Tabelas de Replicação do Schema de Desempenho”.

A declaração `SHOW STATUS` também forneceu algumas informações relacionadas especificamente às réplicas. A partir da versão 5.7.5 do MySQL, as seguintes variáveis de status que anteriormente eram monitoradas usando `SHOW STATUS` foram desatualizadas e transferidas para as tabelas de replicação do Schema de Desempenho:

- `Slave_retried_transactions`
- `Slave_last_heartbeat`
- `Slave_received_heartbeats`
- `Slave_heartbeat_period`
- `Slave_running`

As informações sobre o batimento cardíaco de replicação exibidas nas tabelas de replicação do Schema de Desempenho permitem que você verifique se a conexão de replicação está ativa, mesmo que a fonte não tenha enviado eventos para a réplica recentemente. A fonte envia um sinal de batimento cardíaco para uma réplica se não houver atualizações ou eventos não enviados no log binário por um período maior que o intervalo de batimento cardíaco. A configuração `MASTER_HEARTBEAT_PERIOD` na fonte (definida pela instrução `CHANGE MASTER TO`) especifica a frequência do batimento cardíaco, que tem como padrão metade do intervalo de tempo de timeout da conexão para a réplica (`slave_net_timeout`). A tabela do Schema de Desempenho `[replicação_conexão_status`]\(performance-schema-replication-connection-status-table.html) mostra quando o sinal de batimento cardíaco mais recente foi recebido por uma réplica e quantas vezes ela recebeu sinais de batimento cardíaco.

Se você estiver usando a instrução `SHOW SLAVE STATUS` para verificar o status de uma replica individual, a instrução fornece as seguintes informações:

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

Os campos principais do relatório de status a serem examinados são:

- `Slave_IO_State`: O estado atual da replica. Consulte Seção 8.14.6, “Estados de E/S de Replicação de Replica” e Seção 8.14.7, “Estados de E/S de Replicação de SQL de Replica” para obter mais informações.

- `Slave_IO_Running`: Se a thread de E/S para ler o log binário da fonte está em execução. Normalmente, você deseja que isso seja `Sim`, a menos que você ainda não tenha iniciado a replicação ou a tenha parado explicitamente com `STOP SLAVE`.

- `Slave_SQL_Running`: Se o thread SQL para executar eventos no log de retransmissão está em execução. Assim como o thread de E/S, normalmente deve ser `Sim`.

- `Last_IO_Error`, `Last_SQL_Error`: Os últimos erros registrados pelos threads de E/S e SQL ao processar o log de retransmissão. Idealmente, esses campos devem estar em branco, indicando que não há erros.

- `Seconds_Behind_Master`: O número de segundos que o thread de replicação SQL está atrasado no processamento do log binário da fonte. Um número alto (ou um número crescente) pode indicar que a replica não consegue lidar com os eventos da fonte de forma oportuna.

  Um valor de 0 para `Seconds_Behind_Master` geralmente pode ser interpretado como indicando que a replica alcançou o mestre, mas há alguns casos em que isso não é estritamente verdadeiro. Por exemplo, isso pode ocorrer se a conexão de rede entre o mestre e a replica for interrompida, mas o thread de I/O de replicação ainda não notou isso — ou seja, `slave_net_timeout` ainda não expirou.

  Também é possível que os valores transitórios para `Seconds_Behind_Master` não reflitam a situação com precisão. Quando o thread de replicação SQL alcança o I/O, `Seconds_Behind_Master` exibe 0; mas quando o thread de I/O de replicação ainda está agendando um novo evento, `Seconds_Behind_Master` pode mostrar um valor grande até que o thread SQL termine de executar o novo evento. Isso é especialmente provável quando os eventos têm timestamps antigos; nesses casos, se você executar `SHOW SLAVE STATUS` várias vezes em um período relativamente curto, você pode ver esse valor mudar repetidamente entre 0 e um valor relativamente grande.

Vários pares de campos fornecem informações sobre o progresso da replica na leitura de eventos do log binário da fonte e seu processamento no log de retransmissão:

- (`Master_Log_file`, `Read_Master_Log_Pos`): Coordenadas no log binário da fonte que indicam até onde a thread de I/O de replicação leu os eventos desse log.

- (`Relay_Master_Log_File`, `Exec_Master_Log_Pos`): Coordenadas no log binário da fonte que indicam até onde o thread de replicação SQL executou os eventos recebidos desse log.

- (`Relay_Log_File`, `Relay_Log_Pos`): Coordenadas no log de retransmissão da replica que indicam até onde o thread de SQL de replicação executou o log de retransmissão. Essas correspondem às coordenadas anteriores, mas são expressas nas coordenadas do log de retransmissão da replica, em vez das coordenadas do log binário da fonte.

Na fonte, você pode verificar o status das réplicas conectadas usando `SHOW PROCESSLIST` para examinar a lista de processos em execução. As conexões da réplica têm `Binlog Dump` no campo `Command`:

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

Como é a réplica que impulsiona o processo de replicação, muito poucas informações estão disponíveis neste relatório.

Para réplicas iniciadas com a opção `--report-host` e conectadas à fonte, a instrução `SHOW SLAVE HOSTS` na fonte exibe informações básicas sobre as réplicas. A saída inclui o ID do servidor da réplica, o valor da opção `--report-host`, a porta de conexão e o ID da fonte:

```sql
mysql> SHOW SLAVE HOSTS;
+-----------+----------+------+-------------------+-----------+
| Server_id | Host     | Port | Rpl_recovery_rank | Master_id |
+-----------+----------+------+-------------------+-----------+
|        10 | replica1 | 3306 |                 0 |         1 |
+-----------+----------+------+-------------------+-----------+
1 row in set (0.00 sec)
```
