### 21.7.6 Iniciando a Replication do NDB Cluster (Canal Único de Replication)

Esta seção descreve o procedimento para iniciar a Replication do NDB Cluster usando um canal único de replication.

1. Inicie o servidor Source de Replication MySQL emitindo este comando, onde *`id`* é o ID exclusivo deste servidor (veja [Seção 21.7.2, “Requisitos Gerais para Replication do NDB Cluster”](mysql-cluster-replication-general.html "21.7.2 Requisitos Gerais para Replication do NDB Cluster")):

   ```sql
   shellS> mysqld --ndbcluster --server-id=id \
           --log-bin --ndb-log-bin &
   ```

   Isso inicia o processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") do servidor com o Binary Log ativado, usando o formato de logging apropriado.

   Note

   Você também pode iniciar o Source com [`--binlog-format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format), caso em que a Replication baseada em linha (row-based replication) é usada automaticamente ao replicar entre Clusters. Statement-based binary logging não é suportado para Replication do NDB Cluster (veja [Seção 21.7.2, “Requisitos Gerais para Replication do NDB Cluster”](mysql-cluster-replication-general.html "21.7.2 Requisitos Gerais para Replication do NDB Cluster")).

2. Inicie o servidor Replica MySQL conforme mostrado aqui:

   ```sql
   shellR> mysqld --ndbcluster --server-id=id &
   ```

   No comando exibido, *`id`* é o ID exclusivo do servidor Replica. Não é necessário habilitar o logging no Replica.

   Note

   Você deve usar a opção [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) com este comando ou deve incluir `skip-slave-start` no arquivo `my.cnf` do servidor Replica, a menos que você queira que a Replication comece imediatamente. Com o uso desta opção, o início da Replication é atrasado até que a instrução [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") apropriada tenha sido emitida, conforme explicado na Etapa 4 abaixo.

3. É necessário sincronizar o servidor Replica com o Binary Log de Replication do servidor Source. Se o Binary Log não estava sendo executado anteriormente no Source, execute a seguinte instrução no Replica:

   ```sql
   mysqlR> CHANGE MASTER TO
        -> MASTER_LOG_FILE='',
        -> MASTER_LOG_POS=4;
   ```

   Isso instrui o Replica a começar a ler o Binary Log do servidor Source a partir do ponto inicial do log. Caso contrário — ou seja, se você estiver carregando dados do Source usando um Backup — consulte [Seção 21.7.8, “Implementando Failover com Replication do NDB Cluster”](mysql-cluster-replication-failover.html "21.7.8 Implementando Failover com Replication do NDB Cluster"), para obter informações sobre como conseguir os valores corretos a serem usados para `MASTER_LOG_FILE` e `MASTER_LOG_POS` em tais casos.

4. Finalmente, instrua o Replica a começar a aplicar a Replication, emitindo este comando a partir do cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") no Replica:

   ```sql
   mysqlR> START SLAVE;
   ```

   Isso também inicia a transmissão de dados e alterações do Source para o Replica.

Também é possível usar dois canais de replication, de forma semelhante ao procedimento descrito na próxima seção; as diferenças entre este e o uso de um canal único de replication são abordadas em [Seção 21.7.7, “Usando Dois Canais de Replication para Replication do NDB Cluster”](mysql-cluster-replication-two-channels.html "21.7.7 Usando Dois Canais de Replication para Replication do NDB Cluster").

Também é possível melhorar o performance da Replication do Cluster habilitando Batched Updates. Isso pode ser realizado configurando a variável de sistema [`slave_allow_batching`](mysql-cluster-options-variables.html#sysvar_slave_allow_batching) nos processos [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") dos Replicas. Normalmente, os Updates são aplicados assim que são recebidos. No entanto, o uso de Batching faz com que os Updates sejam aplicados em Batches de 32 KB cada; isso pode resultar em Throughput mais alto e menor uso de CPU, particularmente onde os Updates individuais são relativamente pequenos.

Note

Batching funciona com base em um Epoch; Updates pertencentes a mais de uma Transaction podem ser enviados como parte do mesmo Batch.

Todos os Updates pendentes são aplicados quando o fim de um Epoch é atingido, mesmo que o total dos Updates seja inferior a 32 KB.

O Batching pode ser ativado e desativado em Runtime. Para ativá-lo em Runtime, você pode usar qualquer uma destas duas instruções:

```sql
SET GLOBAL slave_allow_batching = 1;
SET GLOBAL slave_allow_batching = ON;
```

Se um Batch específico causar problemas (como uma Statement cujos efeitos não parecem ser replicados corretamente), o Batching pode ser desativado usando qualquer uma das seguintes instruções:

```sql
SET GLOBAL slave_allow_batching = 0;
SET GLOBAL slave_allow_batching = OFF;
```

Você pode verificar se o Batching está sendo usado atualmente por meio de uma instrução [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") apropriada, como esta:

```sql
mysql> SHOW VARIABLES LIKE 'slave%';
+---------------------------+-------+
| Variable_name             | Value |
+---------------------------+-------+
| slave_allow_batching      | ON    |
| slave_compressed_protocol | OFF   |
| slave_load_tmpdir         | /tmp  |
| slave_net_timeout         | 3600  |
| slave_skip_errors         | OFF   |
| slave_transaction_retries | 10    |
+---------------------------+-------+
6 rows in set (0.00 sec)
```