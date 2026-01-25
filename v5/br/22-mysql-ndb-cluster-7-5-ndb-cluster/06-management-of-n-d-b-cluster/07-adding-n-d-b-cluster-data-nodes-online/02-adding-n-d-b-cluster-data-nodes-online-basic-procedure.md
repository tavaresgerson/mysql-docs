#### 21.6.7.2 Adicionando Data Nodes NDB Cluster Online: Procedimento Básico

Nesta seção, listamos os passos básicos necessários para adicionar novos data nodes a um NDB Cluster. Este procedimento se aplica independentemente de você estar usando os binários [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") ou [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") para os processos de data node. Para um exemplo mais detalhado, consulte [Seção 21.6.7.3, “Adicionando Data Nodes NDB Cluster Online: Exemplo Detalhado”](mysql-cluster-online-add-node-example.html "21.6.7.3 Adicionando NDB Cluster Data Nodes Online: Exemplo Detalhado").

Assumindo que você já tenha um NDB Cluster em execução, adicionar data nodes online exige os seguintes passos:

1. Edite o arquivo de configuração do cluster `config.ini`, adicionando novas seções `[ndbd]` correspondentes aos nodes a serem adicionados. No caso em que o cluster utiliza múltiplos management servers, essas alterações precisam ser feitas em todos os arquivos `config.ini` usados pelos management servers.

   Você deve ter cuidado para que os Node IDs de quaisquer novos data nodes adicionados no arquivo `config.ini` não se sobreponham aos Node IDs usados pelos nodes existentes. Caso você tenha API nodes usando Node IDs alocados dinamicamente e esses IDs correspondam aos Node IDs que você deseja usar para novos data nodes, é possível forçar qualquer API node a “migrar”, conforme descrito posteriormente neste procedimento.

2. Realize um *rolling restart* (reinicialização gradual) de todos os management servers do NDB Cluster.

   Important

   Todos os management servers devem ser reiniciados com a opção [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) ou [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) para forçar a leitura da nova configuração.

3. Realize um *rolling restart* de todos os data nodes NDB Cluster existentes. Não é necessário (e geralmente nem mesmo desejável) usar [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) ao reiniciar os data nodes existentes.

   Se você estiver usando API nodes com IDs alocados dinamicamente que correspondam a quaisquer Node IDs que você deseja atribuir a novos data nodes, você deve reiniciar todos os API nodes (incluindo SQL nodes) antes de reiniciar quaisquer processos de data nodes nesta etapa. Isso faz com que quaisquer API nodes com Node IDs que não foram explicitamente atribuídos anteriormente liberem esses Node IDs e adquiram novos.

4. Realize um *rolling restart* de quaisquer SQL nodes ou API nodes conectados ao NDB Cluster.

5. Inicie os novos data nodes.

   Os novos data nodes podem ser iniciados em qualquer ordem. Eles também podem ser iniciados concorrentemente, desde que sejam iniciados após a conclusão dos *rolling restarts* de todos os data nodes existentes e antes de prosseguir para a próxima etapa.

6. Execute um ou mais comandos [`CREATE NODEGROUP`](mysql-cluster-mgm-client-commands.html#ndbclient-create-nodegroup) no management client do NDB Cluster para criar o(s) novo(s) node group(s) ao(s) qual(is) os novos data nodes pertencem.

7. Redistribua os dados do cluster entre todos os data nodes, incluindo os novos. Normalmente, isso é feito emitindo uma instrução [`ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement") no client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para cada tabela [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

   *Exceção*: Para tabelas criadas usando a opção `MAX_ROWS`, esta instrução não funciona; em vez disso, use `ALTER TABLE ... ALGORITHM=INPLACE MAX_ROWS=...` para reorganizar essas tabelas. Você também deve ter em mente que o uso de `MAX_ROWS` para definir o número de Partitions dessa forma está depreciado no NDB 7.5.4 e posterior, onde você deve usar `PARTITION_BALANCE` em seu lugar; consulte [Seção 13.1.18.9, “Setting NDB Comment Options”](create-table-ndb-comment-options.html "13.1.18.9 Setting NDB Comment Options"), para mais informações.

   Note

   Isso precisa ser feito apenas para tabelas que já existiam no momento em que o novo node group foi adicionado. Os dados em tabelas criadas após a adição do novo node group são distribuídos automaticamente; no entanto, os dados adicionados a qualquer tabela específica `tbl` que existia antes da adição dos novos nodes não são distribuídos usando os novos nodes até que essa tabela tenha sido reorganizada.

8. `ALTER TABLE ... REORGANIZE PARTITION ALGORITHM=INPLACE` reorganiza as Partitions, mas não recupera o espaço liberado nos nodes "antigos". Você pode fazer isso emitindo, para cada tabela [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), uma instrução [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") no client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

   Isso funciona para o espaço usado por colunas de largura variável de tabelas `NDB` in-memory. `OPTIMIZE TABLE` não é suportado para colunas de largura fixa de tabelas in-memory; também não é suportado para Disk Data tables.

Você pode adicionar todos os nodes desejados e, em seguida, emitir vários comandos [`CREATE NODEGROUP`](mysql-cluster-mgm-client-commands.html#ndbclient-create-nodegroup) em sucessão para adicionar os novos node groups ao cluster.