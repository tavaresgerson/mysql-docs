### 25.7.6 Início da replicação do cluster NDB (canal de replicação único)

Esta seção descreve o procedimento para iniciar a replicação do NDB Cluster usando um único canal de replicação.

1. Inicie o servidor de origem de replicação do MySQL executando este comando, onde `id` é o ID único deste servidor (consulte a Seção 25.7.2, “Requisitos Gerais para a Replicação do NDB Cluster”):

   ```
   shellS> mysqld --ndbcluster --server-id=id \
           --log-bin --ndb-log-bin &
   ```

   Isso inicia o processo do servidor **mysqld** com registro binário habilitado, usando o formato de registro adequado. Também é necessário no NDB 8.0 para habilitar o registro de atualizações nas tabelas `NDB` explicitamente, usando a opção `--ndb-log-bin`; essa é uma mudança em relação às versões anteriores do NDB Cluster, na qual essa opção era habilitada por padrão.

   Nota

   Você também pode iniciar a fonte com `--binlog-format=MIXED`, nesse caso, a replicação baseada em linhas é usada automaticamente ao replicar entre clusters. O registro binário baseado em declarações não é suportado para a replicação de NDB Cluster (consulte a Seção 25.7.2, “Requisitos Gerais para a Replicação de NDB Cluster”).

2. Inicie o servidor de réplica do MySQL conforme mostrado aqui:

   ```
   shellR> mysqld --ndbcluster --server-id=id &
   ```

   No comando mostrado acima, `id` é o ID único do servidor de replicação. Não é necessário habilitar o registro no replica.

   Nota

   A menos que você queira que a replicação comece imediatamente, adiar o início dos threads de replicação até que a declaração apropriada `START REPLICA` tenha sido emitida, conforme explicado na Etapa 4 abaixo. Você pode fazer isso iniciando a replica com a opção `--skip-slave-start` na linha de comando, incluindo `skip-slave-start` no arquivo `my.cnf` da replica, ou no NDB 8.0.24 e versões posteriores, configurando a variável de sistema `skip_slave_start`. No NDB 8.0.26 e versões posteriores, use `--skip-replica-start` e `skip_replica_start`.

3. É necessário sincronizar o servidor de replicação com o log de replicação binário do servidor de origem. Se o registro binário não estiver sendo executado anteriormente no origem, execute a seguinte instrução no replica:

   ```
   mysqlR> CHANGE MASTER TO
        -> MASTER_LOG_FILE='',
        -> MASTER_LOG_POS=4;
   ```

   A partir da versão NDB 8.0.23, você também pode usar a seguinte declaração:

   ```
   mysqlR> CHANGE REPLICATION SOURCE TO
        -> SOURCE_LOG_FILE='',
        -> SOURCE_LOG_POS=4;
   ```

   Isso instrui a replica a começar a ler o log binário do servidor de origem a partir do ponto de início do log. Caso contrário, ou seja, se você estiver carregando dados da origem usando um backup, consulte a Seção 25.7.8, “Implementando Failover com Replicação de NDB Cluster”, para obter informações sobre como obter os valores corretos para usar nos `SOURCE_LOG_FILE` | `MASTER_LOG_FILE` e `SOURCE_LOG_POS` | `MASTER_LOG_POS` nesses casos.

4. Por fim, instrua a réplica a começar a aplicar a replicação emitindo este comando a partir do cliente **mysql** na réplica:

   ```
   mysqlR> START SLAVE;
   ```

   No NDB 8.0.22 e versões posteriores, você também pode usar a seguinte declaração:

   ```
   mysqlR> START REPLICA;
   ```

   Isso também inicia a transmissão de dados e alterações da fonte para a replica.

Também é possível usar dois canais de replicação, de maneira semelhante ao procedimento descrito na seção seguinte; as diferenças entre isso e o uso de um único canal de replicação são abordadas na Seção 25.7.7, “Usando Dois Canais de Replicação para a Replicação do NDB Cluster”.

É também possível melhorar o desempenho da replicação de clusters ao habilitar atualizações em lote. Isso pode ser feito configurando a variável de sistema `replica_allow_batching` (NDB 8.0.26 e versões posteriores) ou `slave_allow_batching` (antes da versão 8.0.26) nos processos **mysqld** das réplicas. Normalmente, as atualizações são aplicadas assim que são recebidas. No entanto, o uso de atualizações em lote faz com que as atualizações sejam aplicadas em lotes de 32 KB cada; isso pode resultar em maior capacidade de processamento e menor uso da CPU, especialmente quando as atualizações individuais são relativamente pequenas.

Nota

O agrupamento funciona em uma base por período; as atualizações que pertencem a mais de uma transação podem ser enviadas como parte do mesmo grupo.

Todas as atualizações pendentes são aplicadas quando o fim de uma época é alcançado, mesmo que as atualizações totalizem menos de 32 KB.

A opção de loteamento pode ser ativada ou desativada durante a execução. Para ativá-la durante a execução, você pode usar uma das duas seguintes instruções:

```
SET GLOBAL slave_allow_batching = 1;
SET GLOBAL slave_allow_batching = ON;
```

A partir da versão NDB 8.0.26, você pode (e deve) usar uma das seguintes declarações:

```
SET GLOBAL replica_allow_batching = 1;
SET GLOBAL replica_allow_batching = ON;
```

Se um lote específico causar problemas (como uma declaração cujos efeitos não parecem ser replicados corretamente), o lote pode ser desativado usando uma das seguintes declarações:

```
SET GLOBAL slave_allow_batching = 0;
SET GLOBAL slave_allow_batching = OFF;
```

A partir da versão 8.0.26 do NDB, você pode (e deve) usar uma das seguintes declarações:

```
SET GLOBAL replica_allow_batching = 0;
SET GLOBAL replica_allow_batching = OFF;
```

Você pode verificar se o agrupamento está sendo usado atualmente por meio de uma declaração apropriada `SHOW VARIABLES`, como esta:

```
mysql> SHOW VARIABLES LIKE 'slave%';
```

Em ŃDB 8.0.26 e versões posteriores, use a seguinte declaração:

```
mysql> SHOW VARIABLES LIKE 'replica%';
```
