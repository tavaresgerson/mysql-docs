### 28.3.15 A tabela INFORMATION\_SCHEMA FILES

A tabela `FILES` fornece informações sobre os arquivos nos quais os dados do espaço de tabela do MySQL são armazenados.

A tabela `FILES` fornece informações sobre os arquivos de dados `InnoDB`. No NDB Cluster, essa tabela também fornece informações sobre os arquivos nos quais as tabelas de Dados de Disco do NDB Cluster são armazenadas. Para informações adicionais específicas de `InnoDB`, consulte as Notas do InnoDB, mais adiante nesta seção; para informações adicionais específicas do NDB Cluster, consulte as Notas do NDB.

A tabela `FILES` tem essas colunas:

- `FILE_ID`

  Para `InnoDB`: O ID do espaço de tabelas, também conhecido como `space_id` ou `fil_space_t::id`.

  Para `NDB`: Um identificador de arquivo. Os valores da coluna `FILE_ID` são gerados automaticamente.

- `FILE_NAME`

  Para `InnoDB`: O nome do arquivo de dados. Os espaços de tabela por arquivo e os espaços de tabela gerais têm a extensão de nome de arquivo `.ibd`. Os espaços de tabela desfazer são prefixados por `undo`. O espaço de tabela do sistema é prefixado por `ibdata`. O espaço de tabela temporário global é prefixado por `ibtmp`. O nome do arquivo inclui o caminho do arquivo, que pode ser relativo ao diretório de dados do MySQL (o valor da variável do sistema `datadir`).

  Para `NDB`: O nome de um arquivo de registro de desfazer criado por `CREATE LOGFILE GROUP` ou `ALTER LOGFILE GROUP`, ou de um arquivo de dados criado por `CREATE TABLESPACE` ou `ALTER TABLESPACE`. No NDB 8.0, o nome do arquivo é exibido com um caminho relativo; para um arquivo de registro de desfazer, esse caminho é relativo ao diretório `DataDir/ndb_NodeId_fs/LG`; para um arquivo de dados, é relativo ao diretório `DataDir/ndb_NodeId_fs/TS`. Isso significa, por exemplo, que o nome de um arquivo de dados criado com `ALTER TABLESPACE ts ADD DATAFILE 'data_2.dat' INITIAL SIZE 256M` é exibido como `./data_2.dat`.

- `FILE_TYPE`

  Para `InnoDB`: O tipo de arquivo do espaço de tabelas. Existem três tipos de arquivo possíveis para arquivos `InnoDB`. `TABLESPACE` é o tipo de arquivo para qualquer espaço de tabela do sistema, geral ou por arquivo, que contém tabelas, índices ou outras formas de dados do usuário. `TEMPORARY` é o tipo de arquivo para espaços de tabelas temporários. `UNDO LOG` é o tipo de arquivo para espaços de tabelas de desfazer, que contêm registros de desfazer.

  Para `NDB`: Um dos valores `UNDO LOG` ou `DATAFILE`. Antes da versão NDB 8.0.13, `TABLESPACE` também era um valor possível.

- `TABLESPACE_NAME`

  O nome do espaço de tabelas com o qual o arquivo está associado.

  Para `InnoDB`: Os nomes dos espaços de tabela gerais são os especificados ao serem criados. Os nomes dos espaços de tabela por arquivo são mostrados no seguinte formato: `schema_name/table_name`. O nome do espaço de tabela do sistema `InnoDB` é `innodb_system`. O nome do espaço de tabela temporário global é `innodb_temporary`. Os nomes padrão dos espaços de undo são `innodb_undo_001` e `innodb_undo_002`. Os nomes dos espaços de undo criados pelo usuário são os especificados ao serem criados.

- `TABLE_CATALOG`

  Esse valor sempre está vazio.

- `TABLE_SCHEMA`

  Isso é sempre `NULL`.

- `TABLE_NAME`

  Isso é sempre `NULL`.

- `LOGFILE_GROUP_NAME`

  Para `InnoDB`: Isso é sempre `NULL`.

  Para `NDB`: O nome do grupo de arquivos de registro ao qual o arquivo de registro ou arquivo de dados pertence.

- `LOGFILE_GROUP_NUMBER`

  Para `InnoDB`: Isso é sempre `NULL`.

  Para `NDB`: Para um arquivo de registro de desfazer de dados de disco, o número de ID gerado automaticamente do grupo de arquivos de registro ao qual o arquivo de registro pertence. Este é o mesmo valor exibido para a coluna `id` na tabela `ndbinfo.dict_obj_info` e para a coluna `log_id` nas tabelas `ndbinfo.logspaces` e `ndbinfo.logspaces` para este arquivo de registro de desfazer.

- `ENGINE`

  Para `InnoDB`: Este valor é sempre `InnoDB`.

  Para `NDB`: Este valor é sempre `ndbcluster`.

- `FULLTEXT_KEYS`

  Isso é sempre `NULL`.

- `DELETED_ROWS`

  Isso é sempre `NULL`.

- `UPDATE_COUNT`

  Isso é sempre `NULL`.

- `FREE_EXTENTS`

  Para `InnoDB`: O número de extensões totalmente livres no arquivo de dados atual.

  Para `NDB`: O número de extensões que ainda não foram usadas pelo arquivo.

- `TOTAL_EXTENTS`

  Para `InnoDB`: O número de extensões completas usadas no arquivo de dados atual. Qualquer extensão parcial no final do arquivo não é contada.

  Para `NDB`: O número total de extensões alocadas ao arquivo.

- `EXTENT_SIZE`

  Para `InnoDB`: O tamanho do intervalo é de 1048576 (1 MB) para arquivos com tamanho de página de 4 KB, 8 KB ou 16 KB. O tamanho do intervalo é de 2097152 bytes (2 MB) para arquivos com tamanho de página de 32 KB e 4194304 (4 MB) para arquivos com tamanho de página de 64 KB. `FILES` não reporta o tamanho da página de `InnoDB`. O tamanho da página é definido pela variável de sistema `innodb_page_size`. As informações sobre o tamanho do intervalo também podem ser recuperadas da tabela `INNODB_TABLESPACES`, onde `FILES.FILE_ID = INNODB_TABLESPACES.SPACE`.

  Para `NDB`: O tamanho de uma extensão do arquivo em bytes.

- `INITIAL_SIZE`

  Para `InnoDB`: O tamanho inicial do arquivo em bytes.

  Para `NDB`: O tamanho do arquivo em bytes. Este é o mesmo valor que foi usado na cláusula `INITIAL_SIZE` da declaração `CREATE LOGFILE GROUP`, `ALTER LOGFILE GROUP`, `CREATE TABLESPACE` ou `ALTER TABLESPACE` usada para criar o arquivo.

- `MAXIMUM_SIZE`

  Para `InnoDB`: O número máximo de bytes permitido no arquivo. O valor é `NULL` para todos os arquivos de dados, exceto para os arquivos de dados de espaço de tabela do sistema predefinidos. O tamanho máximo do arquivo de espaço de tabela do sistema é definido por `innodb_data_file_path`. O tamanho máximo do arquivo de espaço de tabela temporário global é definido por `innodb_temp_data_file_path`. Um valor `NULL` para um arquivo de dados de espaço de tabela do sistema predefinido indica que um limite de tamanho de arquivo não foi definido explicitamente.

  Para `NDB`: Este valor é sempre o mesmo que o valor `INITIAL_SIZE`.

- `AUTOEXTEND_SIZE`

  O tamanho automático de expansão do espaço de tabelas. Para `NDB`, `AUTOEXTEND_SIZE` é sempre `NULL`.

- `CREATION_TIME`

  Isso é sempre `NULL`.

- `LAST_UPDATE_TIME`

  Isso é sempre `NULL`.

- `LAST_ACCESS_TIME`

  Isso é sempre `NULL`.

- `RECOVER_TIME`

  Isso é sempre `NULL`.

- `TRANSACTION_COUNTER`

  Isso é sempre `NULL`.

- `VERSION`

  Para `InnoDB`: Isso é sempre `NULL`.

  Para `NDB`: O número da versão do arquivo.

- `ROW_FORMAT`

  Para `InnoDB`: Isso é sempre `NULL`.

  Para `NDB`: Um dos `FIXED` ou `DYNAMIC`.

- `TABLE_ROWS`

  Isso é sempre `NULL`.

- `AVG_ROW_LENGTH`

  Isso é sempre `NULL`.

- `DATA_LENGTH`

  Isso é sempre `NULL`.

- `MAX_DATA_LENGTH`

  Isso é sempre `NULL`.

- `INDEX_LENGTH`

  Isso é sempre `NULL`.

- `DATA_FREE`

  Para `InnoDB`: O valor total do espaço livre (em bytes) para todo o espaço de tabelas. Os espaços de tabelas do sistema predefinidos, que incluem o espaço de tabelas de sistema e os espaços de tabelas temporárias, podem ter um ou mais arquivos de dados.

  Para `NDB`: Isso é sempre `NULL`.

- `CREATE_TIME`

  Isso é sempre `NULL`.

- `UPDATE_TIME`

  Isso é sempre `NULL`.

- `CHECK_TIME`

  Isso é sempre `NULL`.

- `CHECKSUM`

  Isso é sempre `NULL`.

- `STATUS`

  Para `InnoDB`: Este valor é `NORMAL` por padrão. Os espaços de tabela por arquivo `InnoDB` podem exibir `IMPORTING`, o que indica que o espaço de tabela ainda não está disponível.

  Para `NDB`: Para arquivos de dados de disco do NDB Cluster, este valor é sempre `NORMAL`.

- `EXTRA`

  Para `InnoDB`: Isso é sempre `NULL`.

  Para `NDB`: (*NDB 8.0.15 e versões posteriores*) Para arquivos de log de desfazer, esta coluna mostra o tamanho do buffer de log de desfazer; para arquivos de dados, ele é sempre *NULL*. Uma explicação mais detalhada é fornecida nos próximos parágrafos.

  `NDBCLUSTER` armazena uma cópia de cada arquivo de dados e de cada arquivo de registro de desfazer em cada nó de dados no clúster. No NDB 8.0.13 e versões posteriores, a tabela `FILES` contém apenas uma linha para cada arquivo desse tipo. Suponha que você execute as seguintes duas instruções em um NDB Cluster com quatro nós de dados:

  ```
  CREATE LOGFILE GROUP mygroup
      ADD UNDOFILE 'new_undo.dat'
      INITIAL_SIZE 2G
      ENGINE NDBCLUSTER;

  CREATE TABLESPACE myts
      ADD DATAFILE 'data_1.dat'
      USE LOGFILE GROUP mygroup
      INITIAL_SIZE 256M
      ENGINE NDBCLUSTER;
  ```

  Após executar essas duas declarações com sucesso, você deve ver um resultado semelhante ao mostrado aqui para essa consulta contra a tabela `FILES`:

  ```
  mysql> SELECT LOGFILE_GROUP_NAME, FILE_TYPE, EXTRA
      ->     FROM INFORMATION_SCHEMA.FILES
      ->     WHERE ENGINE = 'ndbcluster';

  +--------------------+-----------+--------------------------+
  | LOGFILE_GROUP_NAME | FILE_TYPE | EXTRA                    |
  +--------------------+-----------+--------------------------+
  | mygroup            | UNDO LOG  | UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | DATAFILE  | NULL                     |
  +--------------------+-----------+--------------------------+
  ```

  O tamanho do buffer do registro de desfazer foi removido acidentalmente no NDB 8.0.13, mas foi restaurado no NDB 8.0.15. (Bug #92796, Bug #28800252)

  Antes da versão 8.0.13 do NDB, a tabela `FILES` continha uma linha para cada um desses arquivos em cada nó de dados ao qual o arquivo pertencia, além do tamanho do buffer de desfazer. Nessas versões, o resultado da mesma consulta contém uma linha por nó de dados, conforme mostrado aqui:

  ```
  +--------------------+-----------+-----------------------------------------+
  | LOGFILE_GROUP_NAME | FILE_TYPE | EXTRA                                   |
  +--------------------+-----------+-----------------------------------------+
  | mygroup            | UNDO LOG  | CLUSTER_NODE=5;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=6;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=7;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=8;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | DATAFILE  | CLUSTER_NODE=5                          |
  | mygroup            | DATAFILE  | CLUSTER_NODE=6                          |
  | mygroup            | DATAFILE  | CLUSTER_NODE=7                          |
  | mygroup            | DATAFILE  | CLUSTER_NODE=8                          |
  +--------------------+-----------+-----------------------------------------+
  ```

#### Notas

- `FILES` é uma tabela não padrão `INFORMATION_SCHEMA`.

- A partir do MySQL 8.0.21, você deve ter o privilégio `PROCESS` para consultar essa tabela.

#### Notas do InnoDB

As seguintes notas se aplicam aos arquivos de dados `InnoDB`.

- As informações reportadas pelo `FILES` são obtidas do cache `InnoDB` de memória em tempo real para arquivos abertos, enquanto o `INNODB_DATAFILES` obtém seus dados da tabela de dicionário de dados interno `InnoDB` `SYS_DATAFILES`.

- As informações fornecidas pelo `FILES` incluem informações globais sobre o espaço de tabela temporário, que não estão disponíveis na tabela do dicionário de dados interno `InnoDB` `SYS_DATAFILES`, e, portanto, não estão incluídas no `INNODB_DATAFILES`.

- As informações sobre o espaço de undo são exibidas em `FILES` quando espaços de undo separados estão presentes, como é o caso padrão no MySQL 8.0.

- A consulta a seguir retorna todas as informações da tabela `FILES` relacionadas aos espaços de tabela `InnoDB`.

  ```
  SELECT
    FILE_ID, FILE_NAME, FILE_TYPE, TABLESPACE_NAME, FREE_EXTENTS,
    TOTAL_EXTENTS, EXTENT_SIZE, INITIAL_SIZE, MAXIMUM_SIZE,
    AUTOEXTEND_SIZE, DATA_FREE, STATUS
  FROM INFORMATION_SCHEMA.FILES
  WHERE ENGINE='InnoDB'\G
  ```

#### Notas do BNDES

- A tabela `FILES` fornece informações apenas sobre os arquivos de dados do disco; você não pode usá-la para determinar a alocação ou disponibilidade de espaço em disco para tabelas individuais `NDB`. No entanto, é possível ver quanto espaço é alocado para cada tabela `NDB` que tem dados armazenados no disco — bem como quanto espaço ainda está disponível para o armazenamento de dados no disco para essa tabela — usando **ndb\_desc**.

- A partir da versão NDB 8.0.29, grande parte das informações na tabela `FILES` também pode ser encontrada na tabela `ndbinfo.files`.

- Os valores `CREATION_TIME`, `LAST_UPDATE_TIME` e `LAST_ACCESSED` são fornecidos pelo sistema operacional e não são fornecidos pelo motor de armazenamento `NDB`. Quando nenhum valor é fornecido pelo sistema operacional, essas colunas exibem `NULL`.

- A diferença entre as colunas `TOTAL EXTENTS` e `FREE_EXTENTS` é o número de extensões atualmente em uso pelo arquivo:

  ```
  SELECT TOTAL_EXTENTS - FREE_EXTENTS AS extents_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

  Para aproximar a quantidade de espaço em disco utilizada pelo arquivo, multiplique essa diferença pelo valor da coluna `EXTENT_SIZE`, que fornece o tamanho de um intervalo para o arquivo em bytes:

  ```
  SELECT (TOTAL_EXTENTS - FREE_EXTENTS) * EXTENT_SIZE AS bytes_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

  Da mesma forma, você pode estimar a quantidade de espaço disponível em um arquivo específico ao multiplicar `FREE_EXTENTS` por `EXTENT_SIZE`:

  ```
  SELECT FREE_EXTENTS * EXTENT_SIZE AS bytes_free
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

  Importante

  Os valores de byte produzidos pelas consultas anteriores são apenas aproximações e sua precisão é inversamente proporcional ao valor de `EXTENT_SIZE`. Ou seja, quanto maior for `EXTENT_SIZE`, menos precisas serão as aproximações.

  É importante lembrar também que, uma vez que um índice é usado, ele não pode ser liberado novamente sem a eliminação do arquivo de dados do qual faz parte. Isso significa que a exclusão de uma tabela de Dados de Disco *não* libera espaço em disco.

  O tamanho do espaço pode ser definido em uma declaração `CREATE TABLESPACE`. Para mais informações, consulte a Seção 15.1.21, “Declaração CREATE TABLESPACE”.

- Antes da versão 8.0.13 do NDB, uma linha adicional estava presente na tabela `FILES` após a criação de um grupo de logfiles, com `NULL` na coluna `FILE_NAME`. Na versão 8.0.13 e em versões posteriores, essa linha — que não correspondia a nenhum arquivo — não é mais exibida, e é necessário consultar a tabela `ndbinfo.logspaces` para obter informações sobre o uso do arquivo de log de desfazer. Consulte a descrição dessa tabela, bem como a Seção 25.6.11.1, “Objetos de Dados de Disco do NDB Cluster”, para obter mais informações.

  O restante da discussão neste item aplica-se apenas ao NDB 8.0.12 e versões anteriores. Para a linha que contém `NULL` na coluna `FILE_NAME`, o valor da coluna `FILE_ID` é sempre `0`, o da coluna `FILE_TYPE` é sempre `UNDO LOG` e o da coluna `STATUS` é sempre `NORMAL`. O valor da coluna `ENGINE` é sempre `ndbcluster`.

  A coluna `FREE_EXTENTS` nesta linha mostra o número total de extensões livres disponíveis para todos os arquivos de desfazer pertencentes a um grupo de arquivos de log específico, cujo nome e número são mostrados nas colunas `LOGFILE_GROUP_NAME` e `LOGFILE_GROUP_NUMBER`, respectivamente.

  Suponha que não haja grupos de arquivos de registro existentes no seu NDB Cluster e que você crie um deles usando a seguinte declaração:

  ```
  mysql> CREATE LOGFILE GROUP lg1
           ADD UNDOFILE 'undofile.dat'
           INITIAL_SIZE = 16M
           UNDO_BUFFER_SIZE = 1M
           ENGINE = NDB;
  ```

  Agora você pode ver esta linha `NULL` ao fazer uma consulta na tabela `FILES`:

  ```
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

  O número total de extensões gratuitas disponíveis para registro de desfazer é sempre um pouco menor que a soma dos valores da coluna `TOTAL_EXTENTS` para todos os arquivos de desfazer no grupo de arquivos de log, devido ao overhead necessário para manter os arquivos de desfazer. Isso pode ser visto ao adicionar um segundo arquivo de desfazer ao grupo de arquivos de log, e então repetir a consulta anterior contra a tabela `FILES`:

  ```
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

  O espaço livre em bytes disponível para registro de desfazer nas tabelas de Dados de disco usando este grupo de arquivos de log pode ser aproximado multiplicando o número de extensões livres pelo tamanho inicial:

  ```
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

  Se você criar uma tabela de dados de disco de cluster NDB Cluster e, em seguida, inserir algumas linhas nela, você pode ver aproximadamente quanto espaço permanece para o registro de desfazer posteriormente, por exemplo:

  ```
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

- Antes da versão 8.0.13 do NDB, uma linha adicional estava presente na tabela `FILES` para cada espaço de dados de disco do NDB Cluster. Como ela não correspondia a um arquivo real, foi removida na versão 8.0.13 do NDB. Essa linha tinha `NULL` para o valor da coluna `FILE_NAME`, o valor da coluna `FILE_ID` era sempre `0`, o da coluna `FILE_TYPE` era sempre `TABLESPACE`, o da coluna `STATUS` era sempre `NORMAL` e o valor da coluna `ENGINE` é sempre `NDBCLUSTER`.

  No NDB 8.0.13 e versões posteriores, você pode obter informações sobre os espaços de dados de tabelas de disco usando o utilitário **ndb\_desc**. Para mais informações, consulte a Seção 25.6.11.1, “Objetos de Disco de Dados de Clúster NDB”, bem como a descrição do **ndb\_desc**.

- Para obter informações adicionais e exemplos de criação, eliminação e obtenção de informações sobre objetos de dados de disco do NDB Cluster, consulte a Seção 25.6.11, “Tabelas de Dados de Disco do NDB Cluster”.
