#### 25.6.7.3 Adicionando Nodos de Dados do NDB Cluster Online: Exemplo Detalhado

Nesta seção, fornecemos um exemplo detalhado que ilustra como adicionar novos nós de dados do NDB Cluster online, começando com um NDB Cluster com 2 nós de dados em um único grupo de nós e concluindo com um cluster com 4 nós de dados em 2 grupos de nós.

**Configuração inicial.** Para fins ilustrativos, assumimos uma configuração mínima e que o cluster use um arquivo `config.ini` contendo apenas as seguintes informações:

```
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

Observação

Deixamos uma lacuna na sequência entre os IDs dos nós de dados e outros nós. Isso facilita a atribuição de IDs de nós que ainda não estão em uso a nós de dados que são recém-adicionados mais tarde.

Também assumimos que você já iniciou o cluster usando a linha de comando apropriada ou as opções `my.cnf`, e que executar `SHOW` no cliente de gerenciamento produz uma saída semelhante à mostrada aqui:

```
-- NDB Cluster -- Management Client --
ndb_mgm> SHOW
Connected to Management Server at: 198.51.100.10:1186 (using cleartext)
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @198.51.100.1  (9.5.0-ndb-9.5.0, Nodegroup: 0, *)
id=2    @198.51.100.2  (9.5.0-ndb-9.5.0, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @198.51.100.10  (9.5.0-ndb-9.5.0)

[mysqld(API)]   2 node(s)
id=20   @198.51.100.20  (9.5.0-ndb-9.5.0)
id=21   @198.51.100.21  (9.5.0-ndb-9.5.0)
```

Finalmente, assumimos que o cluster contém uma única tabela `NDBCLUSTER` criada como mostrado aqui:

```
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

O uso de memória e as informações relacionadas mostradas mais adiante nesta seção foram geradas após inserir aproximadamente 50.000 linhas nesta tabela.

Observação

Neste exemplo, mostramos o **ndbd** de fluxo único sendo usado para os processos dos nós de dados. Você também pode aplicar este exemplo, se estiver usando o **ndbmtd** de fluxo múltiplo") substituindo **ndbmtd**") por **ndbd** onde quer que apareça nas etapas que se seguem.

**Passo 1: Atualize o arquivo de configuração.** Abra o arquivo de configuração global do cluster em um editor de texto e adicione as seções `[ndbd]` correspondentes aos 2 novos nós de dados. (Damos esses nós de dados os IDs 3 e 4, e assumimos que eles devem ser executados em máquinas hospedeiras nos endereços 198.51.100.3 e 198.51.100.4, respectivamente.) Após adicionar as novas seções, o conteúdo do arquivo `config.ini` deve parecer o que está mostrado aqui, onde as adições ao arquivo são mostradas em negrito:

```
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

Uma vez que você tenha feito as alterações necessárias, salve o arquivo.

**Passo 2: Reinicie o servidor de gerenciamento.** Reiniciar o servidor de gerenciamento do cluster requer que você emita comandos separados para parar o servidor de gerenciamento e, em seguida, para iniciá-lo novamente, conforme mostrado aqui:

1. Pare o servidor de gerenciamento usando o comando `STOP` do cliente de gerenciamento, conforme mostrado aqui:

   ```
   ndb_mgm> 10 STOP
   Node 10 has shut down.
   Disconnecting to allow Management Server to shutdown

   $>
   ```

2. Como o desligamento do servidor de gerenciamento faz com que o cliente de gerenciamento seja encerrado, você deve iniciar o servidor de gerenciamento a partir da shell do sistema. Por simplicidade, assumimos que `config.ini` está no mesmo diretório que o binário do servidor de gerenciamento, mas na prática, você deve fornecer o caminho correto para o arquivo de configuração. Você também deve fornecer a opção `--reload` ou `--initial` para que o servidor de gerenciamento leia a nova configuração do arquivo em vez de sua cache de configuração. Se o diretório atual da sua shell também for o mesmo que o diretório onde o binário do servidor de gerenciamento está localizado, então você pode invocar o servidor de gerenciamento conforme mostrado aqui:

   ```
   $> ndb_mgmd -f config.ini --reload
   2008-12-08 17:29:23 [MgmSrvr] INFO     -- NDB Cluster Management Server. 9.5.0-ndb-9.5.0
   2008-12-08 17:29:23 [MgmSrvr] INFO     -- Reading cluster configuration from 'config.ini'
   ```

Se você verificar a saída do `SHOW` no cliente de gerenciamento após reiniciar o processo **ndb\_mgm**, você deve agora ver algo como isso:

```
-- NDB Cluster -- Management Client --
ndb_mgm> SHOW
Connected to Management Server at: 198.51.100.10:1186 (using cleartext)
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @198.51.100.1  (9.5.0-ndb-9.5.0, Nodegroup: 0, *)
id=2    @198.51.100.2  (9.5.0-ndb-9.5.0, Nodegroup: 0)
id=3 (not connected, accepting connect from 198.51.100.3)
id=4 (not connected, accepting connect from 198.51.100.4)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @198.51.100.10  (9.5.0-ndb-9.5.0)

[mysqld(API)]   2 node(s)
id=20   @198.51.100.20  (9.5.0-ndb-9.5.0)
id=21   @198.51.100.21  (9.5.0-ndb-9.5.0)
```

**Passo 3: Realize um reinício contínuo dos nós de dados existentes.** Esse passo pode ser realizado inteiramente no cliente de gerenciamento de clúster usando o comando `RESTART`, conforme mostrado aqui:

```
ndb_mgm> 1 RESTART
Node 1: Node shutdown initiated
Node 1: Node shutdown completed, restarting, no start.
Node 1 is being restarted

ndb_mgm> Node 1: Start initiated (version 9.5.0)
Node 1: Started (version 9.5.0)

ndb_mgm> 2 RESTART
Node 2: Node shutdown initiated
Node 2: Node shutdown completed, restarting, no start.
Node 2 is being restarted

ndb_mgm> Node 2: Start initiated (version 9.5.0)

ndb_mgm> Node 2: Started (version 9.5.0)
```

Importante

Após emitir cada comando `X RESTART`, aguarde até que o cliente de gerenciamento informe `Node X: Started (version ...)` *antes* de prosseguir.

Você pode verificar se todos os nós de dados existentes foram reiniciados usando a tabela `ndbinfo.nodes` no cliente **mysql**.

**Passo 4: Realize um reinício contínuo de todos os nós de API do clúster.** Desligue e reinicie cada servidor MySQL que atua como um nó SQL no clúster usando **mysqladmin shutdown** seguido por **mysqld\_safe** (ou outro script de inicialização). Isso deve ser semelhante ao que é mostrado aqui, onde *`password`* é a senha do `root` do MySQL para uma instância específica do servidor MySQL:

```
$> mysqladmin -uroot -ppassword shutdown
081208 20:19:56 mysqld_safe mysqld from pid file
/usr/local/mysql/var/tonfisk.pid ended
$> mysqld_safe --ndbcluster --ndb-connectstring=198.51.100.10 &
081208 20:20:06 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
081208 20:20:06 mysqld_safe Starting mysqld daemon with databases
from /usr/local/mysql/var
```

Claro, a entrada e a saída exatas dependem de como e onde o MySQL está instalado no sistema, bem como das opções que você escolhe para iniciá-lo (e se alguma ou todas essas opções estão especificadas em um arquivo `my.cnf`).

**Passo 5: Realize um início inicial dos novos nós de dados.** Em um shell do sistema em cada um dos hosts dos novos nós de dados, inicie os nós de dados conforme mostrado aqui, usando a opção `--initial`:

```
$> ndbd -c 198.51.100.10 --initial
```

Nota

Ao contrário do caso de reiniciar os nós de dados existentes, você pode iniciar os novos nós de dados simultaneamente; você não precisa esperar que um termine de iniciar antes de iniciar o outro.

*Aguarde até que ambos os novos nós de dados tenham iniciado antes de prosseguir com o próximo passo*. Uma vez que os novos nós de dados tenham iniciado, você pode ver na saída do comando `SHOW` do cliente de gerenciamento que eles ainda não pertencem a nenhum grupo de nó (como indicado em negrito aqui):

```
ndb_mgm> SHOW
Connected to Management Server at: 198.51.100.10:1186 (using cleartext)
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @198.51.100.1  (9.5.0-ndb-9.5.0, Nodegroup: 0, *)
id=2    @198.51.100.2  (9.5.0-ndb-9.5.0, Nodegroup: 0)
id=3    @198.51.100.3  (9.5.0-ndb-9.5.0, no nodegroup)
id=4    @198.51.100.4  (9.5.0-ndb-9.5.0, no nodegroup)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @198.51.100.10  (9.5.0-ndb-9.5.0)

[mysqld(API)]   2 node(s)
id=20   @198.51.100.20  (9.5.0-ndb-9.5.0)
id=21   @198.51.100.21  (9.5.0-ndb-9.5.0)
```

**Passo 6: Crie um novo grupo de nós.** Você pode fazer isso emitindo um comando `CREATE NODEGROUP` no cliente de gerenciamento de clúster. Esse comando recebe como argumento uma lista de IDs de nós separados por vírgula dos nós de dados a serem incluídos no novo grupo de nós, conforme mostrado aqui:

```
ndb_mgm> CREATE NODEGROUP 3,4
Nodegroup 1 created
```

Ao emitir `SHOW` novamente, você pode verificar que os nós de dados 3 e 4 se juntaram ao novo grupo de nós (novamente indicado em negrito):

```
ndb_mgm> SHOW
Connected to Management Server at: 198.51.100.10:1186 (using cleartext)
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @198.51.100.1  (9.5.0-ndb-9.5.0, Nodegroup: 0, *)
id=2    @198.51.100.2  (9.5.0-ndb-9.5.0, Nodegroup: 0)
id=3    @198.51.100.3  (9.5.0-ndb-9.5.0, Nodegroup: 1)
id=4    @198.51.100.4  (9.5.0-ndb-9.5.0, Nodegroup: 1)

[ndb_mgmd(MGM)] 1 node(s)
id=10   @198.51.100.10  (9.5.0-ndb-9.5.0)

[mysqld(API)]   2 node(s)
id=20   @198.51.100.20  (9.5.0-ndb-9.5.0)
id=21   @198.51.100.21  (9.5.0-ndb-9.5.0)
```

**Passo 7: Redistribua os dados do clúster.** Quando um grupo de nós é criado, os dados e índices existentes não são distribuídos automaticamente para os nós de dados do novo grupo de nós, como você pode ver ao emitir o comando `REPORT` apropriado no cliente de gerenciamento:

```
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

Usando **ndb\_desc** com a opção `-p`, que faz com que a saída inclua informações de particionamento, você pode ver que a tabela ainda usa apenas 2 particionamentos (na seção `Per partition info` da saída, mostrada aqui em texto em negrito):

```
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
```

Você pode fazer com que os dados sejam redistribuídos entre todos os nós de dados realizando, para cada tabela `NDB`, uma declaração `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` no cliente **mysql**.

Importante

`ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` não funciona em tabelas criadas com a opção `MAX_ROWS`. Em vez disso, use `ALTER TABLE ... ALGORITHM=INPLACE, MAX_ROWS=...` para reorganizar tais tabelas.

Lembre-se de que usar `MAX_ROWS` para definir o número de particionamentos por tabela está desatualizado e você deve usar `PARTITION_BALANCE` em vez disso; consulte a Seção 15.1.24.12, “Definindo Opções de Comentário NDB”, para mais informações.

Após emitir a declaração `ALTER TABLE ips ALGORITHM=INPLACE, REORGANIZE PARTITION`, você pode ver usando **ndb_desc** que os dados dessa tabela agora são armazenados usando 4 partições, conforme mostrado aqui (com as partes relevantes do resultado em negrito):

```
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
```

Nota

Normalmente, `ALTER TABLE table_name [ALGORITHM=INPLACE,] REORGANIZE PARTITION` é usado com uma lista de identificadores de partição e um conjunto de definições de partição para criar um novo esquema de particionamento para uma tabela que já foi explicitamente particionada. Seu uso aqui para redistribuir dados para um novo grupo de nós do NDB Cluster é uma exceção a esse respeito; quando usado dessa maneira, nenhum outro termo-chave ou identificador segue `REORGANIZE PARTITION`.

Para mais informações, consulte a Seção 15.1.11, “Declaração ALTER TABLE”.

Além disso, para cada tabela, a declaração `ALTER TABLE` deve ser seguida por `OPTIMIZE TABLE` para recuperar o espaço desperdiçado. Você pode obter uma lista de todas as tabelas `NDBCLUSTER` usando a seguinte consulta contra a tabela do Esquema de Informações `TABLES`:

```
SELECT TABLE_SCHEMA, TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE ENGINE = 'NDBCLUSTER';
```

Nota

O valor `INFORMATION_SCHEMA.TABLES.ENGINE` para uma tabela do NDB Cluster é sempre `NDBCLUSTER`, independentemente de a declaração `CREATE TABLE` usada para criar a tabela (ou a declaração `ALTER TABLE` usada para converter uma tabela existente de um motor de armazenamento diferente) ter usado `NDB` ou `NDBCLUSTER` na sua opção `ENGINE`.

Você pode ver após realizar essas declarações na saída do `ALL REPORT MEMORY` que os dados e índices agora são redistribuídos entre todos os nós de dados do cluster, conforme mostrado aqui:

```
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

Como apenas uma operação DDL em tabelas `NDBCLUSTER` pode ser executada por vez, você deve esperar que cada declaração `ALTER TABLE ... REORGANIZE PARTITION` termine antes de emitir a próxima.

Não é necessário emitir declarações `ALTER TABLE ... REORGANIZE PARTITION` para tabelas `NDBCLUSTER` criadas *após* a adição dos novos nós de dados. Os dados adicionados a essas tabelas são distribuídos automaticamente entre todos os nós de dados. No entanto, em tabelas `NDBCLUSTER` que existiam *antes* da adição dos novos nós, nem os dados existentes nem os novos são distribuídos usando os novos nós até que essas tabelas sejam reorganizadas usando `ALTER TABLE ... REORGANIZE PARTITION`.

**Procedimento alternativo, sem reinício contínuo.** É possível evitar a necessidade de um reinício contínuo configurando os novos nós de dados, mas não iniciando-os, ao iniciar o clúster pela primeira vez. Assumemos, como antes, que você deseja começar com dois nós de dados—nós 1 e 2—em um grupo de nós e, posteriormente, expandir o clúster para quatro nós de dados, adicionando um segundo grupo de nós composto pelos nós 3 e 4:

```
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

Os nós de dados a serem colocados em linha em um momento posterior (nós 3 e 4) podem ser configurados com `NodeGroup = 65536`, caso em que os nós 1 e 2 podem ser iniciados como mostrado aqui:

```
$> ndbd -c 198.51.100.10 --initial
```

Os nós de dados configurados com `NodeGroup = 65536` são tratados pelo servidor de gerenciamento como se você tivesse iniciado os nós 1 e 2 usando `--nowait-nodes=3,4` após esperar por um período de tempo determinado pelo ajuste do parâmetro de configuração do nó de dados `StartNoNodeGroupTimeout`. Por padrão, isso é 15 segundos (15000 milissegundos).

Observação

`StartNoNodegroupTimeout` deve ser o mesmo para todos os nós de dados no clúster; por essa razão, você deve sempre configurá-lo na seção `[ndbd default]` do arquivo `config.ini`, em vez de para nós de dados individuais.

Quando estiver pronto para adicionar o segundo grupo de nós, você só precisa realizar as seguintes etapas adicionais:

1. Inicie os nós de dados 3 e 4, invocando o processo do nó de dados uma vez para cada novo nó:

   ```
   $> ndbd -c 198.51.100.10 --initial
   ```

2. Emite o comando apropriado `CREATE NODEGROUP` no cliente de gerenciamento:

   ```
   ndb_mgm> CREATE NODEGROUP 3,4
   ```

3. No cliente **mysql**, emita as instruções `ALTER TABLE ... REORGANIZE PARTITION` e `OPTIMIZE TABLE` para cada tabela existente do NDBCLUSTER. (Como observado em outra parte desta seção, as tabelas existentes do NDB Cluster não podem usar os novos nós para distribuição de dados até que isso tenha sido feito.)