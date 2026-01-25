#### 21.6.11.1 Objetos Disk Data do NDB Cluster

O armazenamento Disk Data do NDB Cluster é implementado usando vários objetos Disk Data. Estes incluem o seguinte:

* Tablespaces atuam como contêineres para outros objetos Disk Data.

* Undo log files armazenam informações de undo necessárias para o rollback de transações.

* Um ou mais undo log files são atribuídos a um log file group, que é então atribuído a um tablespace.

* Data files armazenam dados de tabelas Disk Data. Um data file é atribuído diretamente a um tablespace.

Undo log files e data files são arquivos reais no file system de cada data node; por padrão, eles são colocados em `ndb_node_id_fs` dentro do *`DataDir`* especificado no arquivo `config.ini` do NDB Cluster, onde *`node_id`* é o ID do data node. É possível colocá-los em outro lugar especificando um caminho absoluto ou relativo como parte do nome do arquivo ao criar o undo log file ou data file. As instruções que criam esses arquivos são mostradas mais adiante nesta seção.

Tablespaces e log file groups do NDB Cluster não são implementados como arquivos.

Importante

Embora nem todos os objetos Disk Data sejam implementados como arquivos, todos eles compartilham o mesmo namespace. Isso significa que *cada objeto Disk Data* deve ter um nome exclusivo (e não apenas cada objeto Disk Data de um determinado tipo). Por exemplo, você não pode ter um tablespace e um log file group ambos nomeados `dd1`.

Assumindo que você já tenha configurado um NDB Cluster com todos os nodes (incluindo nodes de gerenciamento e SQL), os passos básicos para criar uma tabela do NDB Cluster em disco são os seguintes:

1. Crie um log file group e atribua um ou mais undo log files a ele (um undo log file também é às vezes referido como um undofile).

   Nota

   Undo log files são necessários apenas para tabelas Disk Data; eles não são usados para tabelas [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que são armazenadas apenas em memória.

2. Crie um tablespace; atribua o log file group, bem como um ou mais data files, ao tablespace.

3. Crie uma tabela Disk Data que utilize este tablespace para armazenamento de dados.

Cada uma dessas tarefas pode ser realizada usando instruções SQL no cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") ou em outro aplicativo cliente MySQL, conforme mostrado no exemplo a seguir.

1. Criamos um log file group chamado `lg_1` usando [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement"). Este log file group será composto por dois undo log files, que nomeamos `undo_1.log` e `undo_2.log`, cujos tamanhos iniciais são 16 MB e 12 MB, respectivamente. (O tamanho inicial padrão para um undo log file é 128 MB.) Opcionalmente, você também pode especificar um tamanho para o undo buffer do log file group, ou permitir que ele assuma o valor padrão de 8 MB. Neste exemplo, definimos o tamanho do UNDO buffer em 2 MB. Um log file group deve ser criado com um undo log file; portanto, adicionamos `undo_1.log` a `lg_1` nesta instrução [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement"):

   ```sql
   CREATE LOGFILE GROUP lg_1
       ADD UNDOFILE 'undo_1.log'
       INITIAL_SIZE 16M
       UNDO_BUFFER_SIZE 2M
       ENGINE NDBCLUSTER;
   ```

   Para adicionar `undo_2.log` ao log file group, use a seguinte instrução [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement"):

   ```sql
   ALTER LOGFILE GROUP lg_1
       ADD UNDOFILE 'undo_2.log'
       INITIAL_SIZE 12M
       ENGINE NDBCLUSTER;
   ```

   Alguns pontos a serem observados:

   * A extensão de arquivo `.log` usada aqui não é obrigatória. Nós a usamos apenas para tornar os log files facilmente reconhecíveis.

   * Toda instrução [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") e [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement") deve incluir uma opção `ENGINE`. Os únicos valores permitidos para esta opção são [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") e [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

     Importante

     Pode existir no máximo um log file group no mesmo NDB Cluster a qualquer momento.

   * Ao adicionar um undo log file a um log file group usando `ADD UNDOFILE 'filename'`, um arquivo com o nome *`filename`* é criado no diretório `ndb_node_id_fs` dentro do [`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir) de cada data node no cluster, onde *`node_id`* é o ID do data node. Cada undo log file tem o tamanho especificado na instrução SQL. Por exemplo, se um NDB Cluster tiver 4 data nodes, a instrução [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement") recém-mostrada cria 4 undo log files, 1 em cada diretório de dados de cada um dos 4 data nodes; cada um desses arquivos é nomeado `undo_2.log` e cada arquivo tem 12 MB de tamanho.

   * `UNDO_BUFFER_SIZE` é limitado pela quantidade de memória do sistema disponível.

   * Para mais informações sobre a instrução [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement"), consulte [Section 13.1.15, “CREATE LOGFILE GROUP Statement”](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement"). Para mais informações sobre [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement"), consulte [Section 13.1.5, “ALTER LOGFILE GROUP Statement”](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement").

2. Agora podemos criar um tablespace, que contém arquivos a serem usados por tabelas NDB Cluster Disk Data para armazenar seus dados. Um tablespace também está associado a um log file group específico. Ao criar um novo tablespace, você deve especificar o log file group que ele deve usar para undo logging; você também deve especificar um data file. Você pode adicionar mais data files ao tablespace após a criação do tablespace; também é possível descartar data files de um tablespace (um exemplo de descarte de data files é fornecido mais adiante nesta seção).

   Suponha que desejamos criar um tablespace chamado `ts_1` que use `lg_1` como seu log file group. Este tablespace deve conter dois data files chamados `data_1.dat` e `data_2.dat`, cujos tamanhos iniciais são 32 MB e 48 MB, respectivamente. (O valor padrão para `INITIAL_SIZE` é 128 MB.) Podemos fazer isso usando duas instruções SQL, conforme mostrado aqui:

   ```sql
   CREATE TABLESPACE ts_1
       ADD DATAFILE 'data_1.dat'
       USE LOGFILE GROUP lg_1
       INITIAL_SIZE 32M
       ENGINE NDBCLUSTER;

   ALTER TABLESPACE ts_1
       ADD DATAFILE 'data_2.dat'
       INITIAL_SIZE 48M
       ENGINE NDBCLUSTER;
   ```

   A instrução [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") cria um tablespace `ts_1` com o data file `data_1.dat` e associa `ts_1` ao log file group `lg_1`. O [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") adiciona o segundo data file (`data_2.dat`).

   Alguns pontos a serem observados:

   * Assim como acontece com a extensão de arquivo `.log` usada neste exemplo para undo log files, não há significado especial para a extensão de arquivo `.dat`; ela é usada apenas para fácil reconhecimento dos data files.

   * Ao adicionar um data file a um tablespace usando `ADD DATAFILE 'filename'`, um arquivo com o nome *`filename`* é criado no diretório `ndb_node_id_fs` dentro do [`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir) de cada data node no cluster, onde *`node_id`* é o ID do data node. Cada data file tem o tamanho especificado na instrução SQL. Por exemplo, se um NDB Cluster tiver 4 data nodes, a instrução [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") recém-mostrada cria 4 data files, 1 em cada diretório de dados de cada um dos 4 data nodes; cada um desses arquivos é nomeado `data_2.dat` e cada arquivo tem 48 MB de tamanho.

   * O NDB 7.6 (e posterior) reserva 4% de cada tablespace para uso durante reinicializações dos data nodes. Este espaço não está disponível para o armazenamento de dados.

   * Todas as instruções [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") e [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") devem conter uma cláusula `ENGINE`; apenas tabelas que usam o mesmo Storage Engine que o tablespace podem ser criadas no tablespace. Para tablespaces do NDB Cluster, os únicos valores permitidos para esta opção são [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") e [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").

   * Para mais informações sobre as instruções [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") e [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement"), consulte [Section 13.1.19, “CREATE TABLESPACE Statement”](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") e [Section 13.1.9, “ALTER TABLESPACE Statement”](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement").

3. Agora é possível criar uma tabela cujas colunas não indexadas são armazenadas em disco no tablespace `ts_1`:

   ```sql
   CREATE TABLE dt_1 (
       member_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
       last_name VARCHAR(50) NOT NULL,
       first_name VARCHAR(50) NOT NULL,
       dob DATE NOT NULL,
       joined DATE NOT NULL,
       INDEX(last_name, first_name)
       )
       TABLESPACE ts_1 STORAGE DISK
       ENGINE NDBCLUSTER;
   ```

   A opção `TABLESPACE ... STORAGE DISK` informa ao Storage Engine [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") para usar o tablespace `ts_1` para armazenamento Disk Data.

   Assim que a tabela `ts_1` for criada conforme mostrado, você poderá executar instruções [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`SELECT`](select.html "13.2.9 SELECT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement") e [`DELETE`](delete.html "13.2.2 DELETE Statement") nela, assim como faria com qualquer outra tabela MySQL.

   Também é possível especificar se uma coluna individual é armazenada em disco ou em memória usando uma cláusula `STORAGE` como parte da definição da coluna em uma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"). `STORAGE DISK` faz com que a coluna seja armazenada em disco, e `STORAGE MEMORY` faz com que seja usado o armazenamento em memória. Consulte [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement"), para mais informações.

**Indexação de colunas implicitamente armazenadas em disco.** Para a tabela `dt_1`, conforme definida no exemplo mostrado, apenas as colunas `dob` e `joined` são armazenadas em disco. Isso ocorre porque existem Indexes nas colunas `id`, `last_name` e `first_name`, e, portanto, os dados pertencentes a essas colunas são armazenados na RAM. Apenas colunas não indexadas podem ser mantidas em disco; Indexes e dados de colunas indexadas continuam a ser armazenados em memória. Essa compensação entre o uso de Indexes e a conservação da RAM é algo que você deve ter em mente ao projetar tabelas Disk Data.

Você não pode adicionar um Index a uma coluna que foi explicitamente declarada `STORAGE DISK`, sem primeiro alterar seu tipo de Storage para `MEMORY`; qualquer tentativa de fazê-lo falhará com um erro. Uma coluna que usa Storage em disco *implicitamente* pode ser indexada; quando isso é feito, o tipo de Storage da coluna é alterado para `MEMORY` automaticamente. Por "implicitamente", queremos dizer uma coluna cujo tipo de Storage não é declarado, mas que é herdado da tabela pai. Na seguinte instrução CREATE TABLE (usando o tablespace `ts_1` definido anteriormente), as colunas `c2` e `c3` usam Storage em disco implicitamente:

```sql
mysql> CREATE TABLE ti (
    ->     c1 INT PRIMARY KEY,
    ->     c2 INT,
    ->     c3 INT,
    ->     c4 INT
    -> )
    ->     STORAGE DISK
    ->     TABLESPACE ts_1
    ->     ENGINE NDBCLUSTER;
Query OK, 0 rows affected (1.31 sec)
```

Como `c2`, `c3` e `c4` não são declaradas com `STORAGE DISK`, é possível indexá-las. Aqui, adicionamos Indexes a `c2` e `c3`, usando, respectivamente, `CREATE INDEX` e `ALTER TABLE`:

```sql
mysql> CREATE INDEX i1 ON ti(c2);
Query OK, 0 rows affected (2.72 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> ALTER TABLE ti ADD INDEX i2(c3);
Query OK, 0 rows affected (0.92 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

[`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") confirma que os Indexes foram adicionados.

```sql
mysql> SHOW CREATE TABLE ti\G
*************************** 1. row ***************************
       Table: ti
Create Table: CREATE TABLE `ti` (
  `c1` int(11) NOT NULL,
  `c2` int(11) DEFAULT NULL,
  `c3` int(11) DEFAULT NULL,
  `c4` int(11) DEFAULT NULL,
  PRIMARY KEY (`c1`),
  KEY `i1` (`c2`),
  KEY `i2` (`c3`)
) /*!50100 TABLESPACE `ts_1` STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.00 sec)
```

Você pode ver usando [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") que as colunas indexadas (texto em destaque) agora usam Storage em memória, em vez de Storage em disco:

```sql
$> ./ndb_desc -d test t1
-- t1 --
Version: 33554433
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 4
Number of primary keys: 1
Length of frm data: 317
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 4
FragmentCount: 4
PartitionBalance: FOR_RP_BY_LDM
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options:
HashMap: DEFAULT-HASHMAP-3840-4
-- Attributes --
c1 Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c2 Int NULL AT=FIXED ST=MEMORY
c3 Int NULL AT=FIXED ST=MEMORY
c4 Int NULL AT=FIXED ST=DISK
-- Indexes --
PRIMARY KEY(c1) - UniqueHashIndex
i2(c3) - OrderedIndex
PRIMARY(c1) - OrderedIndex
i1(c2) - OrderedIndex

NDBT_ProgramExit: 0 - OK
```

**Nota de Performance.** A performance de um cluster usando Storage Disk Data é bastante melhorada se os arquivos Disk Data forem mantidos em um disco físico separado do file system do data node. Isso deve ser feito para cada data node no cluster para obter qualquer benefício notável.

Você pode usar paths (caminhos) absolutos e relativos do file system com `ADD UNDOFILE` e `ADD DATAFILE`. Paths relativos são calculados em relação ao diretório de dados do data node. Você também pode usar symbolic links (links simbólicos); consulte [Section 21.6.11.2, “Using Symbolic Links with Disk Data Objects”](mysql-cluster-disk-data-symlinks.html "21.6.11.2 Using Symbolic Links with Disk Data Objects"), para mais informações e exemplos.

Um log file group, um tablespace e quaisquer tabelas Disk Data que os utilizem devem ser criados em uma ordem específica. O mesmo se aplica ao descarte (dropping) de qualquer um desses objetos:

* Um log file group não pode ser descartado enquanto houver tablespaces que o estejam usando.

* Um tablespace não pode ser descartado enquanto contiver quaisquer data files.

* Você não pode descartar quaisquer data files de um tablespace enquanto houver tabelas que estejam usando o tablespace.

* Não é possível descartar arquivos criados em associação com um tablespace diferente daquele com o qual os arquivos foram criados. (Bug #20053)

Por exemplo, para descartar todos os objetos criados até agora nesta seção, você usaria as seguintes instruções:

```sql
mysql> DROP TABLE dt_1;

mysql> ALTER TABLESPACE ts_1
    -> DROP DATAFILE 'data_2.dat'
    -> ENGINE NDBCLUSTER;

mysql> ALTER TABLESPACE ts_1
    -> DROP DATAFILE 'data_1.dat'
    -> ENGINE NDBCLUSTER;

mysql> DROP TABLESPACE ts_1
    -> ENGINE NDBCLUSTER;

mysql> DROP LOGFILE GROUP lg_1
    -> ENGINE NDBCLUSTER;
```

Estas instruções devem ser executadas na ordem mostrada, exceto que as duas instruções `ALTER TABLESPACE ... DROP DATAFILE` podem ser executadas em qualquer ordem.

Você pode obter informações sobre data files usados por tabelas Disk Data consultando a tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") no Database `INFORMATION_SCHEMA`. Uma “linha `NULL`” extra fornece informações adicionais sobre undo log files. Para mais informações e exemplos, consulte [Section 24.3.9, “The INFORMATION_SCHEMA FILES Table”](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table").