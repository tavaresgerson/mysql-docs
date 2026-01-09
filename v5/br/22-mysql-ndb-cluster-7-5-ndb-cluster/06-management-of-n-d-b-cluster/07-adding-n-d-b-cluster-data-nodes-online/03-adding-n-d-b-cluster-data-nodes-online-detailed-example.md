#### 21.6.7.3 Adicionando nós de dados do NDB Cluster Online: exemplo detalhado

Nesta seção, fornecemos um exemplo detalhado que ilustra como adicionar novos nós de dados do NDB Cluster online, começando com um NDB Cluster com 2 nós de dados em um único grupo de nós e concluindo com um cluster com 4 nós de dados em 2 grupos de nós.

**Configuração inicial.** Para fins ilustrativos, assumimos uma configuração mínima e que o clúster utilize um arquivo `config.ini` contendo apenas as seguintes informações:

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

Nós deixamos uma lacuna na sequência entre os IDs dos nós de dados e outros nós. Isso facilita a atribuição de IDs de nós que ainda não estão em uso a nós de dados que são adicionados recentemente.

Também assumimos que você já iniciou o clúster usando o comando apropriado ou as opções do `my.cnf`, e que a execução de `SHOW` no cliente de gerenciamento produz uma saída semelhante à mostrada aqui:

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

Por fim, assumimos que o conjunto contém uma única tabela `NDBCLUSTER` criada conforme mostrado aqui:

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

O uso da memória e as informações relacionadas mostradas mais adiante nesta seção foram geradas após inserir aproximadamente 50.000 linhas nesta tabela.

Nota

Neste exemplo, mostramos o processo de nó de dados sendo executado com o **ndbd** em execução em um único fio. Você também pode aplicar este exemplo, se estiver usando o **ndbmtd** em multithread, substituindo **ndbmtd** por **ndbd** sempre que aparecer nas etapas que se seguem.

**Passo 1: Atualize o arquivo de configuração.** Abra o arquivo de configuração global do cluster em um editor de texto e adicione as seções `[ndbd]` correspondentes aos 2 novos nós de dados. (Damos esses nós de dados os IDs 3 e 4, e assumimos que eles devem ser executados em máquinas hospedeiras nos endereços 198.51.100.3 e 198.51.100.4, respectivamente.) Após adicionar as novas seções, o conteúdo do arquivo `config.ini` deve parecer o que está mostrado aqui, onde as adições ao arquivo são mostradas em negrito:

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

Depois de fazer as alterações necessárias, salve o arquivo.

**Passo 2: Reinicie o servidor de gerenciamento.** Para reiniciar o servidor de gerenciamento do clúster, você precisa emitir comandos separados para parar o servidor de gerenciamento e, em seguida, iniciá-lo novamente, conforme segue:

1. Pare o servidor de gerenciamento usando o comando do cliente de gerenciamento `STOP`, conforme mostrado aqui:

   ```sql
   ndb_mgm> 10 STOP
   Node 10 has shut down.
   Disconnecting to allow Management Server to shutdown

   $>
   ```

2. Como o encerramento do servidor de gerenciamento faz com que o cliente de gerenciamento seja encerrado, você deve iniciar o servidor de gerenciamento a partir da shell do sistema. Para simplificar, assumimos que o `config.ini` está no mesmo diretório que o binário do servidor de gerenciamento, mas, na prática, você deve fornecer o caminho correto para o arquivo de configuração. Você também deve fornecer a opção `--reload` (mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) ou `--initial` (mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) para que o servidor de gerenciamento leia a nova configuração do arquivo em vez de sua cache de configuração. Se o diretório atual da sua shell também for o mesmo do diretório onde o binário do servidor de gerenciamento está localizado, então você pode invocar o servidor de gerenciamento da seguinte forma:

   ```sql
   $> ndb_mgmd -f config.ini --reload
   2008-12-08 17:29:23 [MgmSrvr] INFO     -- NDB Cluster Management Server. 5.7.44-ndb-7.5.36
   2008-12-08 17:29:23 [MgmSrvr] INFO     -- Reading cluster configuration from 'config.ini'
   ```

Se você verificar a saída do comando `SHOW` no cliente de gerenciamento após reiniciar o processo **ndb_mgm**, você deve ver algo como este:

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

**Passo 3: Realize um reinício contínuo dos nós de dados existentes.** Esse passo pode ser realizado inteiramente no cliente de gerenciamento do clúster usando o comando `RESTART`, conforme mostrado aqui:

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

Após emitir cada comando `X RESTART`, aguarde até que o cliente de gerenciamento informe `Node X: Started (version ...)` *antes* de prosseguir.

Você pode verificar se todos os nós de dados existentes foram reiniciados usando a configuração atualizada verificando a tabela `ndbinfo.nodes` no cliente **mysql**.

**Passo 4: Realize um reinício contínuo de todos os nós da API do cluster.** Desligue e reinicie cada servidor MySQL que atua como um nó SQL no cluster usando **mysqladmin shutdown** seguido de **mysqld_safe** (ou outro script de inicialização). Isso deve ser semelhante ao que está mostrado aqui, onde *`password`* é a senha do `root` do MySQL para uma instância específica do servidor MySQL:

```sql
$> mysqladmin -uroot -ppassword shutdown
081208 20:19:56 mysqld_safe mysqld from pid file
/usr/local/mysql/var/tonfisk.pid ended
$> mysqld_safe --ndbcluster --ndb-connectstring=198.51.100.10 &
081208 20:20:06 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
081208 20:20:06 mysqld_safe Starting mysqld daemon with databases
from /usr/local/mysql/var
```

Claro, a entrada e a saída exatas dependem de como e onde o MySQL está instalado no sistema, além das opções que você escolher para iniciá-lo (e se algumas ou todas essas opções estão especificadas em um arquivo `my.cnf`).

**Passo 5: Realize o início inicial dos novos nós de dados.** A partir de uma janela de sistema em cada um dos hosts dos novos nós de dados, inicie os nós de dados conforme mostrado aqui, usando a opção `--initial`:

```sql
$> ndbd -c 198.51.100.10 --initial
```

Nota

Ao contrário do caso de reiniciar os nós de dados existentes, você pode iniciar os novos nós de dados simultaneamente; você não precisa esperar que um deles termine de iniciar antes de iniciar o outro.

*Aguarde até que ambos os novos nós de dados tenham iniciado antes de prosseguir para o próximo passo*. Uma vez que os novos nós de dados tenham iniciado, você poderá ver na saída do comando de cliente de gerenciamento `SHOW` que eles ainda não pertencem a nenhum grupo de nós (como indicado em negrito aqui):

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

**Passo 6: Crie um novo grupo de nós.** Você pode fazer isso emitindo o comando `CREATE NODEGROUP` no cliente de gerenciamento de clúster. Esse comando recebe como argumento uma lista de IDs de nós separados por vírgula dos nós de dados a serem incluídos no novo grupo de nós, conforme mostrado aqui:

```sql
ndb_mgm> CREATE NODEGROUP 3,4
Nodegroup 1 created
```

Ao emitir novamente `SHOW`, você pode verificar que os nós de dados 3 e 4 se juntaram ao novo grupo de nós (novamente indicado em negrito):

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

**Passo 7: Redistribua os dados do cluster.** Quando um grupo de nós é criado, os dados e índices existentes não são distribuídos automaticamente para os nós de dados do novo grupo de nós, como você pode ver ao emitir o comando apropriado `REPORT` no cliente de gerenciamento:

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

Ao usar **ndb_desc** com a opção `-p`, o que faz com que a saída inclua informações de particionamento, você pode ver que a tabela ainda usa apenas 2 particionamentos (na seção `Per partition info` da saída, mostrada aqui em texto em negrito):

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

Você pode fazer com que os dados sejam redistribuídos entre todos os nós de dados executando, para cada tabela `NDB`, uma instrução `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` no cliente **mysql**.

Importante

`ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` não funciona em tabelas criadas com a opção `MAX_ROWS`. Em vez disso, use `ALTER TABLE ... ALGORITHM=INPLACE, MAX_ROWS=...` para reorganizar essas tabelas.

Tenha em mente que o uso de `MAX_ROWS` para definir o número de partições por tabela está desatualizado no NDB 7.5.4 e versões posteriores, onde você deve usar `PARTITION_BALANCE`; consulte Seção 13.1.18.9, “Definindo Opções de Comentário do NDB” para obter mais informações.

Após emitir a declaração `ALTER TABLE ips ALGORITHM=INPLACE, REORGANIZE PARTITION`, você pode ver usando **ndb_desc** que os dados desta tabela agora estão armazenados usando 4 partições, conforme mostrado aqui (com as partes relevantes do resultado em negrito):

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

Normalmente, `ALTER TABLE nome_tabela [ALGORITHM=INPLACE,] REORGANIZE PARTITION` é usado com uma lista de identificadores de partição e um conjunto de definições de partição para criar um novo esquema de partição para uma tabela que já foi explicitamente particionada. Seu uso aqui para redistribuir dados em um novo grupo de nós do NDB Cluster é uma exceção a esse respeito; quando usado dessa maneira, nenhum outro termo-chave ou identificador segue `REORGANIZE PARTITION`.

Para obter mais informações, consulte Seção 13.1.8, “Instrução ALTER TABLE”.

Além disso, para cada tabela, a instrução `ALTER TABLE` deve ser seguida por uma instrução `OPTIMIZE TABLE` para recuperar o espaço desperdiçado. Você pode obter uma lista de todas as tabelas `NDBCLUSTER` usando a seguinte consulta na tabela do Schema de Informações `TABLES`:

```sql
SELECT TABLE_SCHEMA, TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE ENGINE = 'NDBCLUSTER';
```

Nota

O valor `INFORMATION_SCHEMA.TABLES.ENGINE` para uma tabela de NDB Cluster é sempre `NDBCLUSTER`, independentemente de a instrução `CREATE TABLE` usada para criar a tabela (ou a instrução `ALTER TABLE` usada para converter uma tabela existente de um motor de armazenamento diferente) ter usado `NDB` ou `NDBCLUSTER` em sua opção `ENGINE`.

Você pode ver após executar essas declarações na saída de `ALL REPORT MEMORY` que os dados e índices agora estão redistribuídos entre todos os nós de dados do cluster, conforme mostrado aqui:

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

Como apenas uma operação DDL nas tabelas de `NDBCLUSTER` pode ser executada de cada vez, você deve esperar que cada instrução `ALTER TABLE ... REORGANIZE PARTITION` termine antes de emitir a próxima.

Não é necessário emitir declarações de `ALTER TABLE ... REORGANIZE PARTITION` para tabelas de `NDBCLUSTER` criadas *após* a adição dos novos nós de dados; os dados adicionados a essas tabelas são distribuídos automaticamente entre todos os nós de dados. No entanto, em tabelas de `NDBCLUSTER` que existiam *antes* da adição dos novos nós, nem os dados existentes nem os novos são distribuídos usando os novos nós até que essas tabelas tenham sido reorganizadas usando `ALTER TABLE ... REORGANIZE PARTITION`.

**Procedimento alternativo, sem reinício contínuo.** É possível evitar a necessidade de um reinício contínuo configurando os nós de dados extras, mas não iniciando-os, ao iniciar o clúster pela primeira vez. Continuamos assumindo que você deseja começar com dois nós de dados — os nós 1 e 2 — em um grupo de nós e, posteriormente, expandir o clúster para quatro nós de dados, adicionando um segundo grupo de nós, composto pelos nós 3 e 4:

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

Os nós de dados que serão colocados online posteriormente (nós 3 e 4) podem ser configurados com `NodeGroup = 65536`, caso em que os nós 1 e 2 podem ser iniciados individualmente, conforme mostrado aqui:

```sql
$> ndbd -c 198.51.100.10 --initial
```

Os nós de dados configurados com `NodeGroup = 65536` são tratados pelo servidor de gerenciamento como se você tivesse iniciado os nós 1 e 2 usando `--nowait-nodes=3,4` após esperar por um período de tempo determinado pelo ajuste do parâmetro de configuração do nó de dados `StartNoNodeGroupTimeout`. Por padrão, isso é de 15 segundos (15000 milissegundos).

Nota

`StartNoNodegroupTimeout` deve ser o mesmo para todos os nós de dados no clúster; por essa razão, você deve defini-lo sempre na seção `[ndbd default]` do arquivo `config.ini`, e não para nós de dados individuais.

Quando estiver pronto para adicionar o segundo grupo de nós, basta realizar as seguintes etapas adicionais:

1. Inicie os nós de dados 3 e 4, invocando o processo do nó de dados uma vez para cada novo nó:

   ```sql
   $> ndbd -c 198.51.100.10 --initial
   ```

2. Emita o comando apropriado `CREATE NODEGROUP` no cliente de gerenciamento:

   ```sql
   ndb_mgm> CREATE NODEGROUP 3,4
   ```

3. No cliente **mysql**, execute as instruções `ALTER TABLE ... REORGANIZE PARTITION` e `OPTIMIZE TABLE` para cada tabela existente do NDBCLUSTER. (Como mencionado em outro lugar nesta seção, as tabelas existentes do NDB Cluster não podem usar os novos nós para distribuição de dados até que isso tenha sido feito.)
