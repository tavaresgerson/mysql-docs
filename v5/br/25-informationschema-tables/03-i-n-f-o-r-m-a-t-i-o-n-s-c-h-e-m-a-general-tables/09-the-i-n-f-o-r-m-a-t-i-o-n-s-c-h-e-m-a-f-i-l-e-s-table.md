### 24.3.9 A tabela INFORMATION_SCHEMA FILES

A tabela `FILES` fornece informações sobre os arquivos nos quais os dados do espaço de tabela do MySQL são armazenados.

A tabela `FILES` fornece informações sobre os arquivos de dados do `InnoDB`. No NDB Cluster, essa tabela também fornece informações sobre os arquivos nos quais as tabelas de Dados de Disco do NDB Cluster são armazenadas. Para informações adicionais específicas do `InnoDB`, consulte Notas do InnoDB, mais adiante nesta seção; para informações adicionais específicas do NDB Cluster, consulte Notas do NDB.

A tabela `FILES` tem essas colunas:

- `ID do arquivo`

  Para `InnoDB`: O ID do espaço de tabelas, também conhecido como `space_id` ou `fil_space_t::id`.

  Para `NDB`: Um identificador de arquivo. Os valores da coluna `FILE_ID` são gerados automaticamente.

- `NOME_DO_ARQUIVO`

  Para `InnoDB`: O nome do arquivo de dados. Os espaços de tabela por arquivo e os espaços de tabela gerais têm a extensão de nome de arquivo `.ibd`. Os espaços de tabela de desfazer são prefixados por `undo`. O espaço de tabela do sistema é prefixado por `ibdata`. Os espaços de tabela temporários são prefixados por `ibtmp`. O nome do arquivo inclui o caminho do arquivo, que pode ser relativo ao diretório de dados do MySQL (o valor da variável de sistema `datadir`).

  Para `NDB`: O nome de um arquivo de registro `UNDO` criado por `CREATE LOGFILE GROUP` (create-logfile-group.html) ou `ALTER LOGFILE GROUP` (alter-logfile-group.html), ou de um arquivo de dados criado por `CREATE TABLESPACE` (create-tablespace.html) ou `ALTER TABLESPACE` (alter-tablespace.html).

- `FILE_TYPE`

  Para `InnoDB`: O tipo de arquivo do espaço de tabelas. Existem três tipos de arquivo possíveis para arquivos `InnoDB`. `TABLESPACE` é o tipo de arquivo para qualquer espaço de tabela do sistema, geral ou por arquivo, que contém tabelas, índices ou outras formas de dados do usuário. `TEMPORARY` é o tipo de arquivo para espaços de tabelas temporárias. `UNDO LOG` é o tipo de arquivo para espaços de tabelas de recuperação, que contêm registros de recuperação.

  Para `NDB`: Um dos valores `UNDO LOG`, `DATAFILE` ou `TABLESPACE`.

- `TABLESPACE_NAME`

  O nome do espaço de tabelas com o qual o arquivo está associado.

- `TABLE_CATALOG`

  Esse valor sempre está vazio.

- `TABLE_SCHEMA`

  Isso é sempre `NULL`.

- `NOME_TABELA`

  Isso é sempre `NULL`.

- `LOGFILE_GROUP_NAME`

  Para `InnoDB`: Isso é sempre `NULL`.

  Para `NDB`: O nome do grupo de arquivos de registro ao qual o arquivo de registro ou arquivo de dados pertence.

- `LOGFILE_GROUP_NUMBER`

  Para `InnoDB`: Isso é sempre `NULL`.

  Para `NDB`: Para um arquivo de log de desfazer de dados de disco, o número de ID gerado automaticamente do grupo de arquivos de log ao qual o arquivo de log pertence. Este é o mesmo valor exibido para a coluna `id` na tabela `ndbinfo.dict_obj_info` e para a coluna `log_id` nas tabelas `ndbinfo.logspaces` e `ndbinfo.logspaces` para este arquivo de log de desfazer.

- `MOTOR`

  Para `InnoDB`: Isso é sempre `InnoDB`.

  Para `NDB`: Isso é sempre `ndbcluster`.

- `FULLTEXT_KEYS`

  Isso é sempre `NULL`.

- `LINHAS_DELETADAS`

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

  Para `InnoDB`: o tamanho do intervalo é de 1048576 (1 MB) para arquivos com tamanho de página de 4 KB, 8 KB ou 16 KB. O tamanho do intervalo é de 2097152 bytes (2 MB) para arquivos com tamanho de página de 32 KB e 4194304 (4 MB) para arquivos com tamanho de página de 64 KB. A tabela `[FILES]` (information-schema-files-table.html) não reporta o tamanho da página do `InnoDB`. O tamanho da página é definido pela variável de sistema `[innodb_page_size]` (innodb-parameters.html#sysvar_innodb_page_size). As informações sobre o tamanho do intervalo também podem ser recuperadas da tabela `[INNODB_SYS_TABLESPACES]` (information-schema-innodb-sys-tablespaces-table.html), onde `FILES.FILE_ID = INNODB_SYS_TABLESPACES.SPACE`.

  Para `NDB`: O tamanho de uma extensão do arquivo em bytes.

- `INITIAL_SIZE`

  Para `InnoDB`: O tamanho inicial do arquivo em bytes.

  Para `NDB`: O tamanho do arquivo em bytes. Este é o mesmo valor que foi usado na cláusula `INITIAL_SIZE` da instrução `CREATE LOGFILE GROUP`, `ALTER LOGFILE GROUP`, `CREATE TABLESPACE` ou `ALTER TABLESPACE` usada para criar o arquivo.

- `MAXIMA_TAMANHO`

  Para `InnoDB`: O número máximo de bytes permitido no arquivo. O valor é `NULL` para todos os arquivos de espaço de tabela do sistema pré-definidos, exceto para os arquivos de dados dos espaços de tabela do sistema. O tamanho máximo do arquivo do espaço de tabela do sistema é definido por `innodb_data_file_path`. O tamanho máximo do arquivo do espaço de tabela temporário é definido por `innodb_temp_data_file_path`. Um valor `NULL` para um arquivo de espaço de tabela do sistema pré-definido indica que um limite de tamanho de arquivo não foi definido explicitamente.

  Para `NDB`: Este valor é sempre o mesmo que o valor `INITIAL_SIZE`.

- `AUTOEXTEND_SIZE`

  O tamanho de auto-extensão do espaço de tabela. Para `NDB`, `AUTOEXTEND_SIZE` é sempre `NULL`.

- `CREAÇÃO_TIME`

  Isso é sempre `NULL`.

- `LAST_UPDATE_TIME`

  Isso é sempre `NULL`.

- `LAST_ACCESS_TIME`

  Isso é sempre `NULL`.

- `RECOVER_TIME`

  Isso é sempre `NULL`.

- `CONTADOR_TRANSACAO`

  Isso é sempre `NULL`.

- `VERSÃO`

  Para `InnoDB`: Isso é sempre `NULL`.

  Para `NDB`: O número da versão do arquivo.

- `ROW_FORMAT`

  Para `InnoDB`: Isso é sempre `NULL`.

  Para `NDB`: Um dos valores `FIXED` ou `DYNAMIC`.

- `TABELA_LINHAS`

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

  Para `InnoDB`: O valor total de espaço livre (em bytes) para todo o espaço de tabelas. Os espaços de tabelas do sistema predefinidos, que incluem o espaço de tabelas do sistema e os espaços de tabelas temporárias, podem ter um ou mais arquivos de dados.

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

  Para `InnoDB`: Este valor é `NORMAL` por padrão. Os espaços de tabela `InnoDB` por arquivo podem exibir `IMPORTING`, o que indica que o espaço de tabela ainda não está disponível.

  Para `NDB`: Isso é sempre `NORMAL`.

- `EXTRA`

  Para `InnoDB`: Isso é sempre `NULL`.

  Para `NDB`: Esta coluna mostra a qual nó de dados o arquivo de dados ou o arquivo de log de desfazer pertence (cada nó de dados tem sua própria cópia de cada arquivo); para arquivos de log de desfazer, também mostra o tamanho do buffer de log de desfazer. Suponha que você use esta declaração em um NDB Cluster com quatro nós de dados:

  ```sql
  CREATE LOGFILE GROUP mygroup
      ADD UNDOFILE 'new_undo.dat'
      INITIAL_SIZE 2G
      ENGINE NDB;
  ```

  Após executar a instrução `CREATE LOGFILE GROUP` com sucesso, você deve ver um resultado semelhante ao mostrado aqui para esta consulta contra a tabela `FILES`:

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

- `FILES` é uma tabela `INFORMATION_SCHEMA` não padrão.

#### Notas do InnoDB

As seguintes notas se aplicam aos arquivos de dados do `InnoDB`.

- Os dados relatados por `FILES` são relatados a partir do cache em memória `InnoDB` para arquivos abertos. Em comparação, `INNODB_SYS_DATAFILES` relata dados da tabela interna `SYS_DATAFILES` do `InnoDB`.

- Os dados relatados por `FILES` incluem dados de espaço de tabela temporário. Esses dados não estão disponíveis na tabela `SYS_DATAFILES` do dicionário de dados interno `InnoDB`, e, portanto, não são relatados por `INNODB_SYS_DATAFILES`.

- Os dados do espaço de tabelas são relatados por `FILES`.

- A consulta a seguir retorna todos os dados pertinentes aos espaços de tabela `InnoDB`.

  ```sql
  SELECT
    FILE_ID, FILE_NAME, FILE_TYPE, TABLESPACE_NAME, FREE_EXTENTS,
    TOTAL_EXTENTS, EXTENT_SIZE, INITIAL_SIZE, MAXIMUM_SIZE,
    AUTOEXTEND_SIZE, DATA_FREE, STATUS
  FROM INFORMATION_SCHEMA.FILES WHERE ENGINE='InnoDB'\G
  ```

#### Notas do BNDES

- A tabela `FILES` fornece informações apenas sobre os arquivos de dados do disco; você não pode usá-la para determinar a alocação ou disponibilidade de espaço em disco para tabelas individuais de `NDB`. No entanto, é possível ver quanto espaço é alocado para cada tabela de `NDB` (mysql-cluster.html), com dados armazenados no disco, bem como quanto espaço ainda está disponível para o armazenamento de dados no disco para essa tabela, usando **ndb_desc**.

- Os valores `CREATION_TIME`, `LAST_UPDATE_TIME` e `LAST_ACCESSED` são fornecidos pelo sistema operacional e não pelo mecanismo de armazenamento `NDB`. Quando nenhum valor é fornecido pelo sistema operacional, essas colunas exibem `NULL`.

- A diferença entre as colunas `TOTAL EXTENTS` e `FREE_EXTENTS` é o número de extensões atualmente em uso pelo arquivo:

  ```sql
  SELECT TOTAL_EXTENTS - FREE_EXTENTS AS extents_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = 'myfile.dat';
  ```

  Para aproximar a quantidade de espaço em disco utilizada pelo arquivo, multiplique essa diferença pelo valor da coluna `EXTENT_SIZE`, que fornece o tamanho de um extent para o arquivo em bytes:

  ```sql
  SELECT (TOTAL_EXTENTS - FREE_EXTENTS) * EXTENT_SIZE AS bytes_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = 'myfile.dat';
  ```

  Da mesma forma, você pode estimar a quantidade de espaço disponível em um arquivo específico ao multiplicar `FREE_EXTENTS` por `EXTENT_SIZE`:

  ```sql
  SELECT FREE_EXTENTS * EXTENT_SIZE AS bytes_free
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = 'myfile.dat';
  ```

  Importante

  Os valores de byte produzidos pelas consultas anteriores são apenas aproximações e sua precisão é inversamente proporcional ao valor de `EXTENT_SIZE`. Isso significa que, quanto maior for o valor de `EXTENT_SIZE`, menos precisas serão as aproximações.

  É importante lembrar também que, uma vez que um índice é usado, ele não pode ser liberado novamente sem a eliminação do arquivo de dados do qual faz parte. Isso significa que a exclusão de uma tabela de Dados de Disco *não* libera espaço em disco.

  O tamanho da extensão pode ser definido em uma declaração de `CREATE TABLESPACE`. Para mais informações, consulte Seção 13.1.19, "Declaração CREATE TABLESPACE".

- Uma linha adicional está presente na tabela `FILES` após a criação de um grupo de logfiles. Essa linha tem `NULL` para o valor da coluna `FILE_NAME` e `0` para o valor da coluna `FILE_ID`; o valor da coluna `FILE_TYPE` é sempre `UNDO LOG` e o da coluna `STATUS` é sempre `NORMAL`. O valor da coluna `ENGINE` para essa linha é sempre `ndbcluster`.

  A coluna `FREE_EXTENTS` nesta linha mostra o número total de extensões livres disponíveis para todos os arquivos de desfazer pertencentes a um grupo de arquivos de log específico, cujo nome e número são mostrados nas colunas `LOGFILE_GROUP_NAME` e `LOGFILE_GROUP_NUMBER`, respectivamente.

  Suponha que não haja grupos de arquivos de registro existentes no seu NDB Cluster e que você crie um deles usando a seguinte declaração:

  ```sql
  mysql> CREATE LOGFILE GROUP lg1
           ADD UNDOFILE 'undofile.dat'
           INITIAL_SIZE = 16M
           UNDO_BUFFER_SIZE = 1M
           ENGINE = NDB;
  ```

  Agora você pode ver essa linha `NULL` ao fazer uma consulta na tabela `[FILES]` (information-schema-files-table.html):

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

  O número total de extensões livres disponíveis para registro de desfazer é sempre um pouco menor que a soma dos valores da coluna `TOTAL_EXTENTS` para todos os arquivos de desfazer no grupo de arquivos de log, devido ao overhead necessário para manter os arquivos de desfazer. Isso pode ser visto ao adicionar um segundo arquivo de desfazer ao grupo de arquivos de log, e então repetir a consulta anterior na tabela `FILES`:

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

  O espaço livre em bytes disponível para registro de desfazer nas tabelas de Dados de disco usando este grupo de arquivos de log pode ser aproximado multiplicando o número de extensões livres pelo tamanho inicial:

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

  Se você criar uma tabela de dados de disco de cluster NDB Cluster e, em seguida, inserir algumas linhas nela, você pode ver aproximadamente quanto espaço permanece para o registro de desfazer posteriormente, por exemplo:

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

- Uma linha adicional está presente na tabela `FILES` para qualquer espaço de tabela do NDB Cluster, independentemente de quaisquer arquivos de dados estarem ou não associados ao espaço de tabela. Essa linha tem `NULL` para o valor da coluna `FILE_NAME` e o valor da coluna `FILE_ID` é sempre `0`. O valor exibido na coluna `FILE_TYPE` é sempre `TABLESPACE` e o da coluna `STATUS` é sempre `NORMAL`. O valor da coluna `ENGINE` para essa linha é sempre `ndbcluster`.

- Para obter informações adicionais e exemplos de criação e eliminação de objetos de dados de disco do NDB Cluster, consulte Seção 21.6.11, “Tabelas de Dados de Disco do NDB Cluster”.

- A partir do MySQL 5.7.31, você deve ter o privilégio `PROCESS` para consultar essa tabela.
