#### 21.6.7.3 Adicionando Data Nodes do NDB Cluster Online: Exemplo Detalhado

Nesta seção, fornecemos um exemplo detalhado que ilustra como adicionar novos Data Nodes do NDB Cluster online, começando com um NDB Cluster que possui 2 Data Nodes em um único Grupo de Nodes e concluindo com um Cluster que possui 4 Data Nodes em 2 Grupos de Nodes.

**Configuração inicial.** Para fins de ilustração, assumimos uma configuração mínima e que o Cluster usa um arquivo `config.ini` contendo apenas as seguintes informações:

```sql
[ndbd default]
DataMemory = 100M
IndexMemory = 100M
NoOfReplicas = 2
DataDir = /usr/local/mysql/var/mysql-cluster

[ndbd]
Id = 1
HostName = 198.51.100.1

[ndbd]
Id = 2
HostName = 198.51.100.2

[mgm]
HostName = 198.51.100.10
Id = 10

[api]
Id=20
HostName = 198.51.100.20

[api]
Id=21
HostName = 198.51.100.21
```

Nota

Deixamos um espaço na sequência entre os IDs dos Data Nodes e de outros Nodes. Isso facilita, posteriormente, a atribuição de IDs de Node que ainda não estão em uso para Data Nodes recém-adicionados.

Também assumimos que você já iniciou o Cluster usando a linha de comando apropriada ou as opções `my.cnf`, e que a execução de [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) no Cliente de Gerenciamento produz uma saída semelhante à mostrada aqui:

```sql
-- NDB Cluster -- Management Client --
ndb_mgm> SHOW
Connected to Management Server at: 198.51.100.10:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @198.51.100.1  (5.7.44-ndb-7.5.36, Nodegroup: 0, *)
id=2    @198.51.100.2  (5.7.44-ndb-7.5.36, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @198.51.100.10  (5.7.44-ndb-7.5.36)

[mysqld(API)]   2 node(s)
id=20   @198.51.100.20  (5.7.44-ndb-7.5.36)
id=21   @198.51.100.21  (5.7.44-ndb-7.5.36)
```

Finalmente, assumimos que o Cluster contém uma única tabela [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") criada conforme mostrado aqui:

```sql
USE n;

CREATE TABLE ips (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    country_code CHAR(2) NOT NULL,
    type CHAR(4) NOT NULL,
    ip_address VARCHAR(15) NOT NULL,
    addresses BIGINT UNSIGNED DEFAULT NULL,
    date BIGINT UNSIGNED DEFAULT NULL
)   ENGINE NDBCLUSTER;
```

O uso de memória e informações relacionadas mostradas posteriormente nesta seção foram gerados após a inserção de aproximadamente 50.000 linhas nesta tabela.

Nota

Neste exemplo, mostramos o [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") de thread único sendo usado para os processos dos Data Nodes. Você também pode aplicar este exemplo se estiver usando o [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") multi-threaded, substituindo [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") por [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") onde quer que ele apareça nas etapas a seguir.

**Passo 1: Atualizar o arquivo de configuração.** Abra o arquivo de configuração global do Cluster em um editor de texto e adicione seções `[ndbd]` correspondentes aos 2 novos Data Nodes. (Damos a estes Data Nodes os IDs 3 e 4, e assumimos que eles serão executados em hosts nos endereços 198.51.100.3 e 198.51.100.4, respectivamente.) Depois de adicionar as novas seções, o conteúdo do arquivo `config.ini` deve se parecer com o que é mostrado aqui, onde as adições ao arquivo são exibidas em negrito:

```sql
[ndbd default]
DataMemory = 100M
IndexMemory = 100M
NoOfReplicas = 2
DataDir = /usr/local/mysql/var/mysql-cluster

[ndbd]
Id = 1
HostName = 198.51.100.1

[ndbd]
Id = 2
HostName = 198.51.100.2

[ndbd]
Id = 3
HostName = 198.51.100.3

[ndbd]
Id = 4
HostName = 198.51.100.4

[mgm]
HostName = 198.51.100.10
Id = 10

[api]
Id=20
HostName = 198.51.100.20

[api]
Id=21
HostName = 198.51.100.21
```

Assim que você fizer as alterações necessárias, salve o arquivo.

**Passo 2: Reiniciar o Servidor de Gerenciamento.** Reiniciar o Servidor de Gerenciamento do Cluster exige que você emita comandos separados para parar o Servidor de Gerenciamento e, em seguida, iniciá-lo novamente, como segue:

1. Pare o Servidor de Gerenciamento usando o comando [`STOP`](mysql-cluster-mgm-client-commands.html#ndbclient-stop) do Cliente de Gerenciamento, conforme mostrado aqui:

   ```sql
   ndb_mgm> 10 STOP
   Node 10 has shut down.
   Disconnecting to allow Management Server to shutdown

   $>
   ```

2. Como o desligamento do Servidor de Gerenciamento causa o encerramento do Cliente de Gerenciamento, você deve iniciar o Servidor de Gerenciamento a partir do shell do sistema. Para simplificar, assumimos que `config.ini` está no mesmo diretório que o binário do Servidor de Gerenciamento, mas, na prática, você deve fornecer o caminho correto para o arquivo de configuração. Você também deve fornecer a opção [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) ou [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) para que o Servidor de Gerenciamento leia a nova configuração do arquivo em vez de seu cache de configuração. Se o diretório atual do seu shell for o mesmo do diretório onde o binário do Servidor de Gerenciamento está localizado, você pode invocar o Servidor de Gerenciamento conforme mostrado aqui:

   ```sql
   $> ndb_mgmd -f config.ini --reload
   2008-12-08 17:29:23 [MgmSrvr] INFO     -- NDB Cluster Management Server. 5.7.44-ndb-7.5.36
   2008-12-08 17:29:23 [MgmSrvr] INFO     -- Reading cluster configuration from 'config.ini'
   ```

Se você verificar a saída de [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) no Cliente de Gerenciamento após reiniciar o processo [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"), você deverá ver algo como isto:

```sql
-- NDB Cluster -- Management Client --
ndb_mgm> SHOW
Connected to Management Server at: 198.51.100.10:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @198.51.100.1  (5.7.44-ndb-7.5.36, Nodegroup: 0, *)
id=2    @198.51.100.2  (5.7.44-ndb-7.5.36, Nodegroup: 0)
id=3 (not connected, accepting connect from 198.51.100.3)
id=4 (not connected, accepting connect from 198.51.100.4)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @198.51.100.10  (5.7.44-ndb-7.5.36)

[mysqld(API)]   2 node(s)
id=20   @198.51.100.20  (5.7.44-ndb-7.5.36)
id=21   @198.51.100.21  (5.7.44-ndb-7.5.36)
```

**Passo 3: Realizar um Reinício em Sequência (Rolling Restart) dos Data Nodes existentes.** Esta etapa pode ser realizada inteiramente dentro do Cliente de Gerenciamento do Cluster usando o comando [`RESTART`](mysql-cluster-mgm-client-commands.html#ndbclient-restart), conforme mostrado aqui:

```sql
ndb_mgm> 1 RESTART
Node 1: Node shutdown initiated
Node 1: Node shutdown completed, restarting, no start.
Node 1 is being restarted

ndb_mgm> Node 1: Start initiated (version 7.5.36)
Node 1: Started (version 7.5.36)

ndb_mgm> 2 RESTART
Node 2: Node shutdown initiated
Node 2: Node shutdown completed, restarting, no start.
Node 2 is being restarted

ndb_mgm> Node 2: Start initiated (version 7.5.36)

ndb_mgm> Node 2: Started (version 7.5.36)
```

Importante

Após emitir cada comando `X RESTART`, espere até que o Cliente de Gerenciamento relate `Node X: Started (version ...)` *antes* de prosseguir.

Você pode verificar se todos os Data Nodes existentes foram reiniciados usando a configuração atualizada, verificando a tabela [`ndbinfo.nodes`](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 The ndbinfo nodes Table") no Cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

**Passo 4: Realizar um Reinício em Sequência de todos os Nodes de API do Cluster.** Desligue e reinicie cada Servidor MySQL atuando como um SQL Node no Cluster usando [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") seguido por [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") (ou outro script de inicialização). Isso deve ser semelhante ao que é mostrado aqui, onde *`password`* é a senha `root` do MySQL para uma determinada instância do Servidor MySQL:

```sql
$> mysqladmin -uroot -ppassword shutdown
081208 20:19:56 mysqld_safe mysqld from pid file
/usr/local/mysql/var/tonfisk.pid ended
$> mysqld_safe --ndbcluster --ndb-connectstring=198.51.100.10 &
081208 20:20:06 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
081208 20:20:06 mysqld_safe Starting mysqld daemon with databases
from /usr/local/mysql/var
```

É claro que a entrada e a saída exatas dependem de como e onde o MySQL está instalado no sistema, bem como de quais opções você escolhe para iniciá-lo (e se algumas ou todas essas opções estão especificadas em um arquivo `my.cnf`).

**Passo 5: Realizar uma inicialização inicial dos novos Data Nodes.** A partir de um shell do sistema em cada um dos hosts para os novos Data Nodes, inicie os Data Nodes conforme mostrado aqui, usando a opção [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial):

```sql
$> ndbd -c 198.51.100.10 --initial
```

Nota

Diferentemente do caso de reinicialização dos Data Nodes existentes, você pode iniciar os novos Data Nodes concorrentemente; você não precisa esperar que um termine de iniciar antes de iniciar o outro.

*Espere até que ambos os novos Data Nodes tenham iniciado antes de prosseguir com a próxima etapa*. Assim que os novos Data Nodes iniciarem, você pode ver na saída do comando [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) do Cliente de Gerenciamento que eles ainda não pertencem a nenhum Grupo de Nodes (conforme indicado em negrito aqui):

```sql
ndb_mgm> SHOW
Connected to Management Server at: 198.51.100.10:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @198.51.100.1  (5.7.44-ndb-7.5.36, Nodegroup: 0, *)
id=2    @198.51.100.2  (5.7.44-ndb-7.5.36, Nodegroup: 0)
id=3    @198.51.100.3  (5.7.44-ndb-7.5.36, no nodegroup)
id=4    @198.51.100.4  (5.7.44-ndb-7.5.36, no nodegroup)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @198.51.100.10  (5.7.44-ndb-7.5.36)

[mysqld(API)]   2 node(s)
id=20   @198.51.100.20  (5.7.44-ndb-7.5.36)
id=21   @198.51.100.21  (5.7.44-ndb-7.5.36)
```

**Passo 6: Criar um novo Grupo de Nodes.** Você pode fazer isso emitindo um comando [`CREATE NODEGROUP`](mysql-cluster-mgm-client-commands.html#ndbclient-create-nodegroup) no Cliente de Gerenciamento do Cluster. Este comando recebe como argumento uma lista separada por vírgulas dos IDs dos Data Nodes a serem incluídos no novo Grupo de Nodes, conforme mostrado aqui:

```sql
ndb_mgm> CREATE NODEGROUP 3,4
Nodegroup 1 created
```

Ao emitir [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) novamente, você pode verificar que os Data Nodes 3 e 4 se juntaram ao novo Grupo de Nodes (novamente indicados em negrito):

```sql
ndb_mgm> SHOW
Connected to Management Server at: 198.51.100.10:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @198.51.100.1  (5.7.44-ndb-7.5.36, Nodegroup: 0, *)
id=2    @198.51.100.2  (5.7.44-ndb-7.5.36, Nodegroup: 0)
id=3    @198.51.100.3  (5.7.44-ndb-7.5.36, Nodegroup: 1)
id=4    @198.51.100.4  (5.7.44-ndb-7.5.36, Nodegroup: 1)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @198.51.100.10  (5.7.44-ndb-7.5.36)

[mysqld(API)]   2 node(s)
id=20   @198.51.100.20  (5.7.44-ndb-7.5.36)
id=21   @198.51.100.21  (5.7.44-ndb-7.5.36)
```

**Passo 7: Redistribuir os dados do Cluster.** Quando um Grupo de Nodes é criado, os dados e Indexes existentes não são distribuídos automaticamente para os Data Nodes do novo Grupo de Nodes, como você pode ver emitindo o comando [`REPORT`](mysql-cluster-mgm-client-commands.html#ndbclient-report) apropriado no Cliente de Gerenciamento:

```sql
ndb_mgm> ALL REPORT MEMORY

Node 1: Data usage is 5%(177 32K pages of total 3200)
Node 1: Index usage is 0%(108 8K pages of total 12832)
Node 2: Data usage is 5%(177 32K pages of total 3200)
Node 2: Index usage is 0%(108 8K pages of total 12832)
Node 3: Data usage is 0%(0 32K pages of total 3200)
Node 3: Index usage is 0%(0 8K pages of total 12832)
Node 4: Data usage is 0%(0 32K pages of total 3200)
Node 4: Index usage is 0%(0 8K pages of total 12832)
```

Ao usar [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") com a opção `-p`, que faz com que a saída inclua informações de Particionamento, você pode ver que a tabela ainda usa apenas 2 Partitions (na seção `Per partition info` da saída, mostrada aqui em negrito):

```sql
$> ndb_desc -c 198.51.100.10 -d n ips -p
-- ips --
Version: 1
Fragment type: 9
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 6
Number of primary keys: 1
Length of frm data: 340
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
TableStatus: Retrieved
-- Attributes --
id Bigint PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
country_code Char(2;latin1_swedish_ci) NOT NULL AT=FIXED ST=MEMORY
type Char(4;latin1_swedish_ci) NOT NULL AT=FIXED ST=MEMORY
ip_address Varchar(15;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
addresses Bigunsigned NULL AT=FIXED ST=MEMORY
date Bigunsigned NULL AT=FIXED ST=MEMORY

-- Indexes --
PRIMARY KEY(id) - UniqueHashIndex
PRIMARY(id) - OrderedIndex

-- Per partition info --
Partition   Row count   Commit count  Frag fixed memory   Frag varsized memory
0           26086       26086         1572864             557056
1           26329       26329         1605632             557056

NDBT_ProgramExit: 0 - OK
```

Você pode fazer com que os dados sejam redistribuídos entre todos os Data Nodes executando, para cada tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), uma instrução [`ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement") no Cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

Importante

`ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` não funciona em tabelas que foram criadas com a opção `MAX_ROWS`. Em vez disso, use `ALTER TABLE ... ALGORITHM=INPLACE, MAX_ROWS=...` para reorganizar tais tabelas.

Lembre-se de que usar `MAX_ROWS` para definir o número de Partitions por tabela está obsoleto no NDB 7.5.4 e posterior, onde você deve usar `PARTITION_BALANCE` em vez disso; consulte [Section 13.1.18.9, “Setting NDB Comment Options”](create-table-ndb-comment-options.html "13.1.18.9 Setting NDB Comment Options"), para obter mais informações.

Após emitir a instrução `ALTER TABLE ips ALGORITHM=INPLACE, REORGANIZE PARTITION`, você pode ver usando [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") que os dados para esta tabela agora estão armazenados usando 4 Partitions, conforme mostrado aqui (com as partes relevantes da saída em negrito):

```sql
$> ndb_desc -c 198.51.100.10 -d n ips -p
-- ips --
Version: 16777217
Fragment type: 9
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 6
Number of primary keys: 1
Length of frm data: 341
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 4
TableStatus: Retrieved
-- Attributes --
id Bigint PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
country_code Char(2;latin1_swedish_ci) NOT NULL AT=FIXED ST=MEMORY
type Char(4;latin1_swedish_ci) NOT NULL AT=FIXED ST=MEMORY
ip_address Varchar(15;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
addresses Bigunsigned NULL AT=FIXED ST=MEMORY
date Bigunsigned NULL AT=FIXED ST=MEMORY

-- Indexes --
PRIMARY KEY(id) - UniqueHashIndex
PRIMARY(id) - OrderedIndex

-- Per partition info --
Partition   Row count   Commit count  Frag fixed memory   Frag varsized memory
0           12981       52296         1572864             557056
1           13236       52515         1605632             557056
2           13105       13105         819200              294912
3           13093       13093         819200              294912

NDBT_ProgramExit: 0 - OK
```

Nota

Normalmente, [`ALTER TABLE table_name [ALGORITHM=INPLACE,] REORGANIZE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement") é usado com uma lista de identificadores de Partition e um conjunto de definições de Partition para criar um novo esquema de Particionamento para uma tabela que já foi explicitamente particionada. Seu uso aqui para redistribuir dados para um novo Grupo de Nodes do NDB Cluster é uma exceção a este respeito; quando usado desta forma, nenhum outro termo ou identificador segue `REORGANIZE PARTITION`.

Para mais informações, consulte [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement").

Além disso, para cada tabela, a instrução [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") deve ser seguida por um [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") para recuperar espaço desperdiçado. Você pode obter uma lista de todas as tabelas [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") usando a seguinte Query contra a tabela Information Schema [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table"):

```sql
SELECT TABLE_SCHEMA, TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE ENGINE = 'NDBCLUSTER';
```

Nota

O valor `INFORMATION_SCHEMA.TABLES.ENGINE` para uma tabela NDB Cluster é sempre [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), independentemente de a instrução `CREATE TABLE` usada para criar a tabela (ou a instrução [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") usada para converter uma tabela existente de um Storage Engine diferente) ter usado [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") ou [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") em sua opção `ENGINE`.

Você pode ver, após executar essas instruções na saída de [`ALL REPORT MEMORY`](mysql-cluster-mgm-client-commands.html#ndbclient-report), que os dados e Indexes agora estão redistribuídos entre todos os Data Nodes do Cluster, conforme mostrado aqui:

```sql
ndb_mgm> ALL REPORT MEMORY

Node 1: Data usage is 5%(176 32K pages of total 3200)
Node 1: Index usage is 0%(76 8K pages of total 12832)
Node 2: Data usage is 5%(176 32K pages of total 3200)
Node 2: Index usage is 0%(76 8K pages of total 12832)
Node 3: Data usage is 2%(80 32K pages of total 3200)
Node 3: Index usage is 0%(51 8K pages of total 12832)
Node 4: Data usage is 2%(80 32K pages of total 3200)
Node 4: Index usage is 0%(50 8K pages of total 12832)
```

Nota

Como apenas uma operação DDL em tabelas [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") pode ser executada por vez, você deve esperar que cada instrução [`ALTER TABLE ... REORGANIZE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement") termine antes de emitir a próxima.

Não é necessário emitir instruções [`ALTER TABLE ... REORGANIZE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement") para tabelas [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") criadas *depois* que os novos Data Nodes foram adicionados; os dados adicionados a tais tabelas são distribuídos entre todos os Data Nodes automaticamente. No entanto, em tabelas [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que existiam *antes* da adição dos novos Nodes, nem os dados existentes nem os novos dados são distribuídos usando os novos Nodes até que essas tabelas tenham sido reorganizadas usando [`ALTER TABLE ... REORGANIZE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement").

**Procedimento alternativo, sem Reinício em Sequência.** É possível evitar a necessidade de um Reinício em Sequência configurando os Data Nodes extras, mas não os iniciando, ao iniciar o Cluster pela primeira vez. Assumimos, como antes, que você deseja começar com dois Data Nodes – Nodes 1 e 2 – em um Grupo de Nodes e, posteriormente, expandir o Cluster para quatro Data Nodes, adicionando um segundo Grupo de Nodes consistindo nos Nodes 3 e 4:

```sql
[ndbd default]
DataMemory = 100M
IndexMemory = 100M
NoOfReplicas = 2
DataDir = /usr/local/mysql/var/mysql-cluster

[ndbd]
Id = 1
HostName = 198.51.100.1

[ndbd]
Id = 2
HostName = 198.51.100.2

[ndbd]
Id = 3
HostName = 198.51.100.3
Nodegroup = 65536

[ndbd]
Id = 4
HostName = 198.51.100.4
Nodegroup = 65536

[mgm]
HostName = 198.51.100.10
Id = 10

[api]
Id=20
HostName = 198.51.100.20

[api]
Id=21
HostName = 198.51.100.21
```

Os Data Nodes que serão colocados online posteriormente (Nodes 3 e 4) podem ser configurados com [`NodeGroup = 65536`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodegroup), caso em que os Nodes 1 e 2 podem ser iniciados conforme mostrado aqui:

```sql
$> ndbd -c 198.51.100.10 --initial
```

Os Data Nodes configurados com [`NodeGroup = 65536`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodegroup) são tratados pelo Servidor de Gerenciamento como se você tivesse iniciado os Nodes 1 e 2 usando [`--nowait-nodes=3,4`](mysql-cluster-programs-ndbd.html#option_ndbd_nowait-nodes) após esperar por um período de tempo determinado pela configuração do parâmetro de configuração do Data Node [`StartNoNodeGroupTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startnonodegrouptimeout). Por padrão, este é de 15 segundos (15000 milissegundos).

Nota

[`StartNoNodegroupTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startnonodegrouptimeout) deve ser o mesmo para todos os Data Nodes no Cluster; por esta razão, você deve sempre configurá-lo na seção `[ndbd default]` do arquivo `config.ini`, em vez de para Data Nodes individuais.

Quando estiver pronto para adicionar o segundo Grupo de Nodes, você só precisa executar as seguintes etapas adicionais:

1. Inicie os Data Nodes 3 e 4, invocando o processo do Data Node uma vez para cada novo Node:

   ```sql
   $> ndbd -c 198.51.100.10 --initial
   ```

2. Emita o comando [`CREATE NODEGROUP`](mysql-cluster-mgm-client-commands.html#ndbclient-create-nodegroup) apropriado no Cliente de Gerenciamento:

   ```sql
   ndb_mgm> CREATE NODEGROUP 3,4
   ```

3. No Cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), emita as instruções [`ALTER TABLE ... REORGANIZE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement") e [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") para cada tabela [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") existente. (Conforme observado em outras partes desta seção, as tabelas NDB Cluster existentes não podem usar os novos Nodes para distribuição de dados até que isso tenha sido feito.)