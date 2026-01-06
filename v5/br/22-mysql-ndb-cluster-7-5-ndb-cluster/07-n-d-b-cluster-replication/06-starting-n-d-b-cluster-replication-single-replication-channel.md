### 21.7.6 Início da replicação do cluster NDB (canal de replicação único)

Esta seção descreve o procedimento para iniciar a replicação do NDB Cluster usando um único canal de replicação.

1. Inicie o servidor de origem de replicação do MySQL executando este comando, onde *`id`* é o ID único deste servidor (consulte Seção 21.7.2, “Requisitos Gerais para a Replicação do NDB Cluster”):

   ```sql
   shellS> mysqld --ndbcluster --server-id=id \
           --log-bin --ndb-log-bin &
   ```

   Isso inicia o processo do servidor **mysqld** com registro binário habilitado, usando o formato de registro adequado.

   Nota

   Você também pode iniciar a fonte com [`--binlog-format=MIXED`](https://pt.replication-options-binary-log.html#sysvar_binlog_format), caso em que a replicação baseada em linhas é usada automaticamente ao replicar entre clusters. O registro binário baseado em declarações não é suportado para a replicação de NDB Cluster (consulte [Seção 21.7.2, “Requisitos Gerais para a Replicação de NDB Cluster”](https://pt.mysql-cluster-replication-general.html)).

2. Inicie o servidor de réplica do MySQL conforme mostrado aqui:

   ```sql
   shellR> mysqld --ndbcluster --server-id=id &
   ```

   No comando mostrado acima, *`id`* é o ID único do servidor replica. Não é necessário habilitar o registro no replica.

   Nota

   Você deve usar a opção [`--skip-slave-start`](https://pt.wikipedia.org/wiki/Replicação_\(database\)#Op%C3%A9rnia_de_replicac%C3%A3o.3Coption.3E.22skip-slave-start.3D) com este comando, ou então você deve incluir `skip-slave-start` no arquivo `my.cnf` do servidor replica, a menos que você queira que a replicação comece imediatamente. Com o uso desta opção, o início da replicação é adiado até que a declaração apropriada `START SLAVE` (<https://pt.wikipedia.org/wiki/Replicação_(database)#Instru%C3%A7%C3%A3o_START_SLAVE>) tenha sido emitida, conforme explicado no Passo 4 abaixo.

3. É necessário sincronizar o servidor de replicação com o log de replicação binário do servidor de origem. Se o registro binário não estiver sendo executado anteriormente no origem, execute a seguinte instrução no replica:

   ```sql
   mysqlR> CHANGE MASTER TO
        -> MASTER_LOG_FILE='',
        -> MASTER_LOG_POS=4;
   ```

   Isso instrui a replica a começar a ler o log binário do servidor de origem a partir do ponto de início do log. Caso contrário, ou seja, se você estiver carregando dados da origem usando um backup, consulte Seção 21.7.8, “Implementando Failover com Replicação de NDB Cluster” para obter informações sobre como obter os valores corretos para usar em tais casos.

4. Por fim, instrua a réplica a começar a aplicar a replicação emitindo este comando a partir do cliente **mysql** na réplica:

   ```sql
   mysqlR> START SLAVE;
   ```

   Isso também inicia a transmissão de dados e alterações da fonte para a replica.

Também é possível usar dois canais de replicação, de maneira semelhante ao procedimento descrito na próxima seção; as diferenças entre isso e o uso de um único canal de replicação são abordadas em Seção 21.7.7, “Usando Dois Canais de Replicação para a Replicação de NDB Cluster”.

É também possível melhorar o desempenho da replicação de clusters ao habilitar atualizações em lote. Isso pode ser feito configurando a variável de sistema `slave_allow_batching` nos processos do **mysqld** das réplicas. Normalmente, as atualizações são aplicadas assim que são recebidas. No entanto, o uso de atualizações em lote faz com que as atualizações sejam aplicadas em lotes de 32 KB cada; isso pode resultar em maior capacidade de processamento e menor uso da CPU, especialmente quando as atualizações individuais são relativamente pequenas.

Nota

O agrupamento funciona em uma base por período; as atualizações que pertencem a mais de uma transação podem ser enviadas como parte do mesmo grupo.

Todas as atualizações pendentes são aplicadas quando o fim de uma época é alcançado, mesmo que as atualizações totalizem menos de 32 KB.

A opção de loteamento pode ser ativada ou desativada durante a execução. Para ativá-la durante a execução, você pode usar uma das duas seguintes instruções:

```sql
SET GLOBAL slave_allow_batching = 1;
SET GLOBAL slave_allow_batching = ON;
```

Se um lote específico causar problemas (como uma declaração cujos efeitos não parecem ser replicados corretamente), o lote pode ser desativado usando uma das seguintes declarações:

```sql
SET GLOBAL slave_allow_batching = 0;
SET GLOBAL slave_allow_batching = OFF;
```

Você pode verificar se o agrupamento está sendo usado atualmente por meio de uma declaração apropriada `SHOW VARIABLES`, como esta:

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
