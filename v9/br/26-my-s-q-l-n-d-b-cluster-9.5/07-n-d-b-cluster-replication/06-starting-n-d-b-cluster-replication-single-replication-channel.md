### 25.7.6 Início da replicação do NDB Cluster (Canal de replicação único)

Esta seção descreve o procedimento para iniciar a replicação do NDB Cluster usando um único canal de replicação.

1. Inicie o servidor de origem da replicação MySQL executando o seguinte comando, onde *`id`* é o ID único desse servidor (consulte a Seção 25.7.2, “Requisitos gerais para a replicação do NDB Cluster”):

   ```
   shellS> mysqld --ndbcluster --server-id=id \
           --log-bin --ndb-log-bin &
   ```

   Isso inicia o processo **mysqld** do servidor com registro binário habilitado usando o formato de registro apropriado. Também é necessário habilitar o registro de atualizações nas tabelas `NDB` explicitamente, usando a opção `--ndb-log-bin`.

   Observação

   Você também pode iniciar o servidor de origem com `--binlog-format=MIXED`, caso em que a replicação baseada em linhas é usada automaticamente ao replicar entre clusters. O registro binário baseado em declarações não é suportado para a replicação do NDB Cluster (consulte a Seção 25.7.2, “Requisitos gerais para a replicação do NDB Cluster”).

2. Inicie o servidor de replica MySQL conforme mostrado aqui:

   ```
   shellR> mysqld --ndbcluster --server-id=id &
   ```

   No comando mostrado acima, *`id`* é o ID único do servidor de replica. Não é necessário habilitar o registro no replica.

   Observação

   A menos que você queira iniciar a replicação imediatamente, adiar o início dos threads de replicação até que a declaração apropriada `START REPLICA` tenha sido emitida, conforme explicado no Passo 4 abaixo. Você pode fazer isso iniciando o replica com `--skip-replica-start`.

3. É necessário sincronizar o servidor de replica com o log binário de replicação do servidor de origem. Se o registro binário não estiver sendo executado anteriormente no origem, execute a seguinte declaração no replica:

   ```
   mysqlR> CHANGE REPLICATION SOURCE TO
        -> SOURCE_LOG_FILE='',
        -> SOURCE_LOG_POS=4;
   ```

Isso instrui a replica a começar a ler o log binário do servidor de origem a partir do ponto de início do log. Caso contrário — ou seja, se você estiver carregando dados da origem usando um backup — consulte a Seção 25.7.8, “Implementando Failover com Replicação de NDB Cluster”, para obter informações sobre como obter os valores corretos para usar em `SOURCE_LOG_FILE` e `SOURCE_LOG_POS` nesses casos.

4. Por fim, instrua a replica a começar a aplicar a replicação emitindo este comando do cliente **mysql** na replica:

```
   mysqlR> START REPLICA;
   ```

Isso também inicia a transmissão de dados e alterações da origem para a replica.

Também é possível usar dois canais de replicação, de maneira semelhante ao procedimento descrito na próxima seção; as diferenças entre isso e o uso de um único canal de replicação são abordadas na Seção 25.7.7, “Usando Dois Canais de Replicação para Replicação de NDB Cluster”.

Também é possível melhorar o desempenho da replicação do cluster habilitando atualizações em lote. Isso pode ser feito configurando a variável de sistema `replica_allow_batching` nos processos **mysqld** das réplicas. Normalmente, as atualizações são aplicadas assim que são recebidas. No entanto, o uso de lote causa a aplicação de atualizações em lotes de 32 KB cada; isso pode resultar em maior throughput e menor uso de CPU, especialmente quando as atualizações individuais são relativamente pequenas.

Nota

O lote funciona em uma base por epoc; atualizações pertencentes a mais de uma transação podem ser enviadas como parte do mesmo lote.

Todas as atualizações pendentes são aplicadas quando o final de um epoc é alcançado, mesmo que as atualizações totalizem menos de 32 KB.

O lote pode ser ativado e desativado em tempo de execução. Para ativá-lo em tempo de execução, você pode usar uma das duas seguintes declarações:

```
SET GLOBAL replica_allow_batching = 1;
SET GLOBAL replica_allow_batching = ON;
```

Se um lote específico causar problemas (como uma declaração cujos efeitos não parecem ser replicados corretamente), o lote pode ser desativado usando uma das seguintes declarações:

```
SET GLOBAL replica_allow_batching = 0;
SET GLOBAL replica_allow_batching = OFF;
```

Você pode verificar se o lote está sendo usado atualmente por meio de uma declaração apropriada `SHOW VARIABLES`, como esta:

```
mysql> SHOW VARIABLES LIKE 'replica%';
```