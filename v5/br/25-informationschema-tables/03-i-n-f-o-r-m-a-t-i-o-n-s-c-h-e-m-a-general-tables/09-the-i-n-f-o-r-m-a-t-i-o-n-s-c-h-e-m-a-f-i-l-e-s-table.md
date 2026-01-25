### 24.3.9 A Tabela FILES do INFORMATION_SCHEMA

A tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") fornece informações sobre os arquivos nos quais os dados de tablespaces do MySQL são armazenados.

A tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") fornece informações sobre arquivos de dados `InnoDB`. No NDB Cluster, esta tabela também fornece informações sobre os arquivos nos quais as tabelas NDB Cluster Disk Data são armazenadas. Para informações adicionais específicas do `InnoDB`, veja [Notas sobre InnoDB](information-schema-files-table.html#files-table-innodb-notes "InnoDB Notes"), adiante nesta seção; para informações adicionais específicas do NDB Cluster, veja [Notas sobre NDB](information-schema-files-table.html#files-table-ndb-notes "NDB Notes").

A tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") possui as seguintes colunas:

* `FILE_ID`

  Para `InnoDB`: O ID do tablespace, também referido como `space_id` ou `fil_space_t::id`.

  Para `NDB`: Um identificador de arquivo. Os valores da coluna `FILE_ID` são auto-gerados.

* `FILE_NAME`

  Para `InnoDB`: O nome do arquivo de dados. Tablespaces file-per-table e general tablespaces têm a extensão de arquivo `.ibd`. Undo tablespaces são prefixados por `undo`. O system tablespace é prefixado por `ibdata`. Temporary tablespaces são prefixados por `ibtmp`. O nome do arquivo inclui o caminho do arquivo, que pode ser relativo ao diretório de dados do MySQL (o valor da variável de sistema [`datadir`](server-system-variables.html#sysvar_datadir)).

  Para `NDB`: O nome de um arquivo de log `UNDO` criado por [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") ou [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement"), ou de um arquivo de dados criado por [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") ou [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement").

* `FILE_TYPE`

  Para `InnoDB`: O tipo de arquivo do tablespace. Existem três tipos de arquivo possíveis para arquivos `InnoDB`. `TABLESPACE` é o tipo de arquivo para qualquer arquivo de tablespace de sistema, geral ou file-per-table que contenha tabelas, Indexes ou outras formas de dados do usuário. `TEMPORARY` é o tipo de arquivo para temporary tablespaces. `UNDO LOG` é o tipo de arquivo para undo tablespaces, que contêm registros undo.

  Para `NDB`: Um dos valores `UNDO LOG`, `DATAFILE` ou `TABLESPACE`.

* `TABLESPACE_NAME`

  O nome do tablespace ao qual o arquivo está associado.

* `TABLE_CATALOG`

  Este valor está sempre vazio.

* `TABLE_SCHEMA`

  Este é sempre `NULL`.

* `TABLE_NAME`

  Este é sempre `NULL`.

* `LOGFILE_GROUP_NAME`

  Para `InnoDB`: Este é sempre `NULL`.

  Para `NDB`: O nome do grupo de log file group ao qual o log file ou data file pertence.

* `LOGFILE_GROUP_NUMBER`

  Para `InnoDB`: Este é sempre `NULL`.

  Para `NDB`: Para um undo log file Disk Data, o número de ID auto-gerado do log file group ao qual o log file pertence. Este é o mesmo valor exibido para a coluna `id` na tabela [`ndbinfo.dict_obj_info`](mysql-cluster-ndbinfo-dict-obj-info.html "21.6.15.15 The ndbinfo dict_obj_info Table") e a coluna `log_id` nas tabelas [`ndbinfo.logspaces`](mysql-cluster-ndbinfo-logspaces.html "21.6.15.24 The ndbinfo logspaces Table") e [`ndbinfo.logspaces`](mysql-cluster-ndbinfo-logspaces.html "21.6.15.24 The ndbinfo logspaces Table") para este undo log file.

* `ENGINE`

  Para `InnoDB`: Este é sempre `InnoDB`.

  Para `NDB`: Este é sempre `ndbcluster`.

* `FULLTEXT_KEYS`

  Este é sempre `NULL`.

* `DELETED_ROWS`

  Este é sempre `NULL`.

* `UPDATE_COUNT`

  Este é sempre `NULL`.

* `FREE_EXTENTS`

  Para `InnoDB`: O número de extents totalmente livres no arquivo de dados atual.

  Para `NDB`: O número de extents que ainda não foram utilizados pelo arquivo.

* `TOTAL_EXTENTS`

  Para `InnoDB`: O número de extents completos usados no arquivo de dados atual. Qualquer extent parcial no final do arquivo não é contado.

  Para `NDB`: O número total de extents alocados para o arquivo.

* `EXTENT_SIZE`

  Para `InnoDB`: O tamanho do Extent é 1048576 (1MB) para arquivos com tamanho de página de 4KB, 8KB ou 16KB. O tamanho do Extent é 2097152 bytes (2MB) para arquivos com tamanho de página de 32KB e 4194304 (4MB) para arquivos com tamanho de página de 64KB. `FILES` não reporta o tamanho da página `InnoDB`. O tamanho da página é definido pela variável de sistema [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size). As informações de tamanho de extent também podem ser recuperadas da tabela [`INNODB_SYS_TABLESPACES`](information-schema-innodb-sys-tablespaces-table.html "24.4.24 The INFORMATION_SCHEMA INNODB_SYS_TABLESPACES Table") onde `FILES.FILE_ID = INNODB_SYS_TABLESPACES.SPACE`.

  Para `NDB`: O tamanho de um extent para o arquivo em bytes.

* `INITIAL_SIZE`

  Para `InnoDB`: O tamanho inicial do arquivo em bytes.

  Para `NDB`: O tamanho do arquivo em bytes. Este é o mesmo valor que foi usado na cláusula `INITIAL_SIZE` da instrução [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement"), [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement"), [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") ou [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") usada para criar o arquivo.

* `MAXIMUM_SIZE`

  Para `InnoDB`: O número máximo de bytes permitidos no arquivo. O valor é `NULL` para todos os arquivos de dados, exceto para arquivos de dados de tablespace de sistema predefinidos. O tamanho máximo do arquivo do system tablespace é definido por [`innodb_data_file_path`](innodb-parameters.html#sysvar_innodb_data_file_path). O tamanho máximo do arquivo do temporary tablespace é definido por [`innodb_temp_data_file_path`](innodb-parameters.html#sysvar_innodb_temp_data_file_path). Um valor `NULL` para um arquivo de dados de tablespace de sistema predefinido indica que um limite de tamanho de arquivo não foi definido explicitamente.

  Para `NDB`: Este valor é sempre o mesmo que o valor de `INITIAL_SIZE`.

* `AUTOEXTEND_SIZE`

  O tamanho de auto-extensão do tablespace. Para `NDB`, `AUTOEXTEND_SIZE` é sempre `NULL`.

* `CREATION_TIME`

  Este é sempre `NULL`.

* `LAST_UPDATE_TIME`

  Este é sempre `NULL`.

* `LAST_ACCESS_TIME`

  Este é sempre `NULL`.

* `RECOVER_TIME`

  Este é sempre `NULL`.

* `TRANSACTION_COUNTER`

  Este é sempre `NULL`.

* `VERSION`

  Para `InnoDB`: Este é sempre `NULL`.

  Para `NDB`: O número da versão do arquivo.

* `ROW_FORMAT`

  Para `InnoDB`: Este é sempre `NULL`.

  Para `NDB`: Um de `FIXED` ou `DYNAMIC`.

* `TABLE_ROWS`

  Este é sempre `NULL`.

* `AVG_ROW_LENGTH`

  Este é sempre `NULL`.

* `DATA_LENGTH`

  Este é sempre `NULL`.

* `MAX_DATA_LENGTH`

  Este é sempre `NULL`.

* `INDEX_LENGTH`

  Este é sempre `NULL`.

* `DATA_FREE`

  Para `InnoDB`: A quantidade total de espaço livre (em bytes) para o tablespace inteiro. Tablespaces de sistema predefinidos, que incluem o system tablespace e temporary table tablespaces, podem ter um ou mais arquivos de dados.

  Para `NDB`: Este é sempre `NULL`.

* `CREATE_TIME`

  Este é sempre `NULL`.

* `UPDATE_TIME`

  Este é sempre `NULL`.

* `CHECK_TIME`

  Este é sempre `NULL`.

* `CHECKSUM`

  Este é sempre `NULL`.

* `STATUS`

  Para `InnoDB`: Este valor é `NORMAL` por padrão. Tablespaces `InnoDB` file-per-table podem reportar `IMPORTING`, o que indica que o tablespace ainda não está disponível.

  Para `NDB`: Este é sempre `NORMAL`.

* `EXTRA`

  Para `InnoDB`: Este é sempre `NULL`.

  Para `NDB`: Esta coluna mostra a qual nó de dados o arquivo de dados ou undo log file pertence (cada nó de dados tem sua própria cópia de cada arquivo); para um undo log file, ele também mostra o tamanho do undo log buffer. Suponha que você use esta instrução em um NDB Cluster com quatro nós de dados:

  ```sql
  CREATE LOGFILE GROUP mygroup
      ADD UNDOFILE 'new_undo.dat'
      INITIAL_SIZE 2G
      ENGINE NDB;
  ```

  Após executar a instrução [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") com sucesso, você deve ver um resultado semelhante ao mostrado aqui para esta Query na tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table"):

  ```sql
  mysql> SELECT LOGFILE_GROUP_NAME, FILE_TYPE, EXTRA
           FROM INFORMATION_SCHEMA.FILES
           WHERE FILE_NAME = 'new_undo.dat';

  +--------------------+-----------+-----------------------------------------+
  | LOGFILE_GROUP_NAME | FILE_TYPE | EXTRA                                   |
  +--------------------+-----------+-----------------------------------------+
  | mygroup            | UNDO LOG  | CLUSTER_NODE=5;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=6;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=7;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=8;UNDO_BUFFER_SIZE=8388608 |
  +--------------------+-----------+-----------------------------------------+
  ```

#### Notas

* [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") é uma tabela `INFORMATION_SCHEMA` não padrão.

#### Notas sobre InnoDB

As seguintes notas se aplicam aos arquivos de dados `InnoDB`.

* Os dados reportados por [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") são reportados a partir do cache em memória do `InnoDB` para arquivos abertos. Em comparação, [`INNODB_SYS_DATAFILES`](information-schema-innodb-sys-datafiles-table.html "24.4.18 The INFORMATION_SCHEMA INNODB_SYS_DATAFILES Table") reporta dados da tabela de dicionário de dados interna `SYS_DATAFILES` do `InnoDB`.

* Os dados reportados por [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") incluem dados de temporary tablespace. Esses dados não estão disponíveis na tabela de dicionário de dados interna `SYS_DATAFILES` do `InnoDB` e, portanto, não são reportados por [`INNODB_SYS_DATAFILES`](information-schema-innodb-sys-datafiles-table.html "24.4.18 The INFORMATION_SCHEMA INNODB_SYS_DATAFILES Table").

* Dados de undo tablespace são reportados por [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table").

* A seguinte Query retorna todos os dados pertinentes aos tablespaces `InnoDB`.

  ```sql
  SELECT
    FILE_ID, FILE_NAME, FILE_TYPE, TABLESPACE_NAME, FREE_EXTENTS,
    TOTAL_EXTENTS, EXTENT_SIZE, INITIAL_SIZE, MAXIMUM_SIZE,
    AUTOEXTEND_SIZE, DATA_FREE, STATUS
  FROM INFORMATION_SCHEMA.FILES WHERE ENGINE='InnoDB'\G
  ```

#### Notas sobre NDB

* A tabela `FILES` fornece informações apenas sobre *arquivos* Disk Data; você não pode usá-la para determinar a alocação ou disponibilidade de espaço em disco para tabelas `NDB` individuais. No entanto, é possível ver quanto espaço é alocado para cada tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que tem dados armazenados em disco—bem como quanto resta disponível para armazenamento de dados em disco para essa tabela—usando [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables").

* Os valores de `CREATION_TIME`, `LAST_UPDATE_TIME` e `LAST_ACCESSED` são os reportados pelo sistema operacional e não são fornecidos pelo storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Onde nenhum valor é fornecido pelo sistema operacional, essas colunas exibem `NULL`.

* A diferença entre as colunas `TOTAL EXTENTS` e `FREE_EXTENTS` é o número de extents atualmente em uso pelo arquivo:

  ```sql
  SELECT TOTAL_EXTENTS - FREE_EXTENTS AS extents_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = 'myfile.dat';
  ```

  Para aproximar a quantidade de espaço em disco em uso pelo arquivo, multiplique essa diferença pelo valor da coluna `EXTENT_SIZE`, que fornece o tamanho de um extent para o arquivo em bytes:

  ```sql
  SELECT (TOTAL_EXTENTS - FREE_EXTENTS) * EXTENT_SIZE AS bytes_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = 'myfile.dat';
  ```

  Da mesma forma, você pode estimar a quantidade de espaço que permanece disponível em um determinado arquivo multiplicando `FREE_EXTENTS` por `EXTENT_SIZE`:

  ```sql
  SELECT FREE_EXTENTS * EXTENT_SIZE AS bytes_free
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = 'myfile.dat';
  ```

  Importante

  Os valores em bytes produzidos pelas Queries precedentes são apenas aproximações, e sua precisão é inversamente proporcional ao valor de `EXTENT_SIZE`. Ou seja, quanto maior o `EXTENT_SIZE`, menos precisas são as aproximações.

  Também é importante lembrar que, uma vez que um extent é usado, ele não pode ser liberado novamente sem descartar o arquivo de dados do qual faz parte. Isso significa que as operações de delete de uma tabela Disk Data *não* liberam espaço em disco.

  O tamanho do extent pode ser definido em uma instrução [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement"). Para mais informações, veja [Section 13.1.19, “CREATE TABLESPACE Statement”](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement").

* Uma linha adicional está presente na tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") após a criação de um logfile group. Esta linha tem `NULL` para o valor da coluna `FILE_NAME` e `0` para o valor da coluna `FILE_ID`; o valor da coluna `FILE_TYPE` é sempre `UNDO LOG`, e o da coluna `STATUS` é sempre `NORMAL`. O valor da coluna `ENGINE` para esta linha é sempre `ndbcluster`.

  A coluna `FREE_EXTENTS` nesta linha mostra o número total de extents livres disponíveis para todos os undo files pertencentes a um determinado log file group, cujo nome e número são mostrados nas colunas `LOGFILE_GROUP_NAME` e `LOGFILE_GROUP_NUMBER`, respectivamente.

  Suponha que não haja log file groups existentes em seu NDB Cluster, e você crie um usando a seguinte instrução:

  ```sql
  mysql> CREATE LOGFILE GROUP lg1
           ADD UNDOFILE 'undofile.dat'
           INITIAL_SIZE = 16M
           UNDO_BUFFER_SIZE = 1M
           ENGINE = NDB;
  ```

  Agora você pode ver esta linha `NULL` ao consultar a tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table"):

  ```sql
  mysql> SELECT DISTINCT
           FILE_NAME AS File,
           FREE_EXTENTS AS Free,
           TOTAL_EXTENTS AS Total,
           EXTENT_SIZE AS Size,
           INITIAL_SIZE AS Initial
           FROM INFORMATION_SCHEMA.FILES;
  +--------------+---------+---------+------+----------+
  | File         | Free    | Total   | Size | Initial  |
  +--------------+---------+---------+------+----------+
  | undofile.dat |    NULL | 4194304 |    4 | 16777216 |
  | NULL         | 4184068 |    NULL |    4 |     NULL |
  +--------------+---------+---------+------+----------+
  ```

  O número total de extents livres disponíveis para undo logging é sempre um pouco menor do que a soma dos valores da coluna `TOTAL_EXTENTS` para todos os undo files no log file group devido à sobrecarga necessária para manter os undo files. Isso pode ser visto adicionando um segundo undo file ao log file group e, em seguida, repetindo a Query anterior na tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table"):

  ```sql
  mysql> ALTER LOGFILE GROUP lg1
           ADD UNDOFILE 'undofile02.dat'
           INITIAL_SIZE = 4M
           ENGINE = NDB;

  mysql> SELECT DISTINCT
           FILE_NAME AS File,
           FREE_EXTENTS AS Free,
           TOTAL_EXTENTS AS Total,
           EXTENT_SIZE AS Size,
           INITIAL_SIZE AS Initial
           FROM INFORMATION_SCHEMA.FILES;
  +----------------+---------+---------+------+----------+
  | File           | Free    | Total   | Size | Initial  |
  +----------------+---------+---------+------+----------+
  | undofile.dat   |    NULL | 4194304 |    4 | 16777216 |
  | undofile02.dat |    NULL | 1048576 |    4 |  4194304 |
  | NULL           | 5223944 |    NULL |    4 |     NULL |
  +----------------+---------+---------+------+----------+
  ```

  A quantidade de espaço livre em bytes que está disponível para undo logging por tabelas Disk Data usando este log file group pode ser aproximada multiplicando o número de extents livres pelo tamanho inicial:

  ```sql
  mysql> SELECT
           FREE_EXTENTS AS 'Free Extents',
           FREE_EXTENTS * EXTENT_SIZE AS 'Free Bytes'
           FROM INFORMATION_SCHEMA.FILES
           WHERE LOGFILE_GROUP_NAME = 'lg1'
           AND FILE_NAME IS NULL;
  +--------------+------------+
  | Free Extents | Free Bytes |
  +--------------+------------+
  |      5223944 |   20895776 |
  +--------------+------------+
  ```

  Se você criar uma tabela NDB Cluster Disk Data e então inserir algumas linhas nela, você poderá ver aproximadamente quanto espaço resta para undo logging depois, por exemplo:

  ```sql
  mysql> CREATE TABLESPACE ts1
           ADD DATAFILE 'data1.dat'
           USE LOGFILE GROUP lg1
           INITIAL_SIZE 512M
           ENGINE = NDB;

  mysql> CREATE TABLE dd (
           c1 INT NOT NULL PRIMARY KEY,
           c2 INT,
           c3 DATE
           )
           TABLESPACE ts1 STORAGE DISK
           ENGINE = NDB;

  mysql> INSERT INTO dd VALUES
           (NULL, 1234567890, '2007-02-02'),
           (NULL, 1126789005, '2007-02-03'),
           (NULL, 1357924680, '2007-02-04'),
           (NULL, 1642097531, '2007-02-05');

  mysql> SELECT
           FREE_EXTENTS AS 'Free Extents',
           FREE_EXTENTS * EXTENT_SIZE AS 'Free Bytes'
           FROM INFORMATION_SCHEMA.FILES
           WHERE LOGFILE_GROUP_NAME = 'lg1'
           AND FILE_NAME IS NULL;
  +--------------+------------+
  | Free Extents | Free Bytes |
  +--------------+------------+
  |      5207565 |   20830260 |
  +--------------+------------+
  ```

* Uma linha adicional está presente na tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") para qualquer tablespace NDB Cluster, independentemente de quaisquer arquivos de dados estarem associados ao tablespace. Esta linha tem `NULL` para o valor da coluna `FILE_NAME`, e o valor da coluna `FILE_ID` é sempre `0`. O valor exibido na coluna `FILE_TYPE` é sempre `TABLESPACE`, e o da coluna `STATUS` é sempre `NORMAL`. O valor da coluna `ENGINE` para esta linha é sempre `ndbcluster`.

* Para informações adicionais e exemplos de criação e descarte de objetos NDB Cluster Disk Data, veja [Section 21.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables").

* A partir do MySQL 5.7.31, você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para consultar esta tabela.