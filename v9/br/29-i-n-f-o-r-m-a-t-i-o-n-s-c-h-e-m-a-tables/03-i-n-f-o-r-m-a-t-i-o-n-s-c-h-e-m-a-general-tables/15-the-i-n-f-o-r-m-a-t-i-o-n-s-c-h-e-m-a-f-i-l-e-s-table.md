### 28.3.15 A Tabela `FILES\_SCHEMA`

A tabela `FILES` fornece informações sobre os arquivos nos quais os dados do espaço de tabela do MySQL são armazenados.

A tabela `FILES` fornece informações sobre os arquivos de dados `InnoDB`. No NDB Cluster, essa tabela também fornece informações sobre os arquivos nos quais as tabelas de dados do disco do NDB Cluster são armazenadas. Para informações adicionais específicas do `InnoDB`, consulte as Notas do InnoDB, mais adiante nesta seção; para informações adicionais específicas do NDB Cluster, consulte as Notas do NDB.

A tabela `FILES` tem as seguintes colunas:

* `FILE_ID`

  Para `InnoDB`: O ID do espaço de tabela, também referido como `space_id` ou `fil_space_t::id`.

  Para `NDB`: Um identificador de arquivo. Os valores da coluna `FILE_ID` são gerados automaticamente.

* `FILE_NAME`

  Para `InnoDB`: O nome do arquivo de dados. Os arquivos por tabela e os espaços de tabela gerais têm a extensão de nome de arquivo `.ibd`. Os espaços de tabela de desfazer são prefixados por `undo`. O espaço de tabela do sistema é prefixado por `ibdata`. O espaço de tabela temporário global é prefixado por `ibtmp`. O nome do arquivo inclui o caminho do arquivo, que pode ser relativo ao diretório de dados do MySQL (o valor da variável de sistema `datadir`).

  Para `NDB`: O nome de um arquivo de log de desfazer criado por `CREATE LOGFILE GROUP` ou `ALTER LOGFILE GROUP`, ou de um arquivo de dados criado por `CREATE TABLESPACE` ou `ALTER TABLESPACE`. No NDB 9.5, o nome do arquivo é exibido com um caminho relativo; para um arquivo de log de desfazer, esse caminho é relativo ao diretório `DataDir/ndb_NodeId_fs/LG`; para um arquivo de dados, é relativo ao diretório `DataDir/ndb_NodeId_fs/TS`. Isso significa, por exemplo, que o nome de um arquivo de dados criado com `ALTER TABLESPACE ts ADD DATAFILE 'data_2.dat' INITIAL SIZE 256M` é exibido como `./data_2.dat`.

* `FILE_TYPE`

Para `InnoDB`: O tipo de arquivo do espaço de tabelas. Existem três tipos de arquivo possíveis para arquivos `InnoDB`. `TABLESPACE` é o tipo de arquivo para qualquer espaço de tabela do sistema, geral ou por tabela, que contém tabelas, índices ou outras formas de dados do usuário. `TEMPORARY` é o tipo de arquivo para espaços de tabelas temporários. `UNDO LOG` é o tipo de arquivo para espaços de tabelas de desfazer, que contêm registros de desfazer.

Para `NDB`: Um dos valores `UNDO LOG` ou `DATAFILE`.

* `TABLESPACE_NAME`

  O nome do espaço de tabela com o qual o arquivo está associado.

  Para `InnoDB`: Os nomes dos espaços de tabela gerais são especificados quando criados. Os nomes dos espaços de tabela por tabela são mostrados no seguinte formato: `schema_name/table_name`. O nome do espaço de tabela do sistema `InnoDB` é `innodb_system`. O nome do espaço de tabela temporário global é `innodb_temporary`. Os nomes padrão dos espaços de tabela de desfazer são `innodb_undo_001` e `innodb_undo_002`. Os nomes dos espaços de tabela de desfazer criados pelo usuário são especificados quando criados.

* `TABLE_CATALOG`

  Este valor é sempre vazio.

* `TABLE_SCHEMA`

  Este é sempre `NULL`.

* `TABLE_NAME`

  Este é sempre `NULL`.

* `LOGFILE_GROUP_NAME`

  Para `InnoDB`: Este é sempre `NULL`.

  Para `NDB`: O nome do grupo de arquivos de log ao qual o arquivo de log ou o arquivo de dados pertence.

* `LOGFILE_GROUP_NUMBER`

  Para `InnoDB`: Este é sempre `NULL`.

  Para `NDB`: Para um arquivo de log de desfazer de dados de disco, o número de ID gerado automaticamente do grupo de arquivos de log ao qual o arquivo de log pertence. Este é o mesmo valor mostrado para a coluna `id` na tabela `ndbinfo.dict_obj_info` e a coluna `log_id` nas tabelas `ndbinfo.logspaces` e `ndbinfo.logspaces` para este arquivo de log de desfazer.

* `ENGINE`

  Para `InnoDB`: Este valor é sempre `InnoDB`.

  Para `NDB`: Este valor é sempre `ndbcluster`.

* `FULLTEXT_KEYS`

  Este é sempre `NULL`.

* `DELETED_ROWS`

Isso é sempre `NULL`.

* `UPDATE_COUNT`

  Isso é sempre `NULL`.

* `FREE_EXTENTS`

  Para `InnoDB`: O número de extensões totalmente livres no arquivo de dados atual.

  Para `NDB`: O número de extensões que ainda não foram usadas pelo arquivo.

* `TOTAL_EXTENTS`

  Para `InnoDB`: O número de extensões completas usadas no arquivo de dados atual. Qualquer extensão parcial no final do arquivo não é contada.

  Para `NDB`: O número total de extensões alocadas para o arquivo.

* `EXTENT_SIZE`

  Para `InnoDB`: O tamanho da extensão é de 1048576 (1MB) para arquivos com tamanho de página de 4KB, 8KB ou 16KB. O tamanho da extensão é de 2097152 bytes (2MB) para arquivos com tamanho de página de 32KB, e 4194304 (4MB) para arquivos com tamanho de página de 64KB. `FILES` não relata o tamanho da página `InnoDB`. O tamanho da página é definido pela variável de sistema `innodb_page_size`. As informações sobre o tamanho da extensão também podem ser recuperadas da tabela `INNODB_TABLESPACES` onde `FILES.FILE_ID = INNODB_TABLESPACES.SPACE`.

  Para `NDB`: O tamanho de uma extensão para o arquivo em bytes.

* `INITIAL_SIZE`

  Para `InnoDB`: O tamanho inicial do arquivo em bytes.

  Para `NDB`: O tamanho do arquivo em bytes. Este é o mesmo valor que foi usado na cláusula `INITIAL_SIZE` da instrução `CREATE LOGFILE GROUP`, `ALTER LOGFILE GROUP`, `CREATE TABLESPACE` ou `ALTER TABLESPACE` usada para criar o arquivo.

* `MAXIMUM_SIZE`

  Para `InnoDB`: O número máximo de bytes permitido no arquivo. O valor é `NULL` para todos os arquivos de dados, exceto para arquivos de dados de espaço de tabela de sistema pré-definido. O tamanho máximo do arquivo de espaço de tabela de sistema é definido por `innodb_data_file_path`. O tamanho máximo do arquivo de espaço de tabela de temporário global é definido por `innodb_temp_data_file_path`. Um valor `NULL` para um arquivo de dados de espaço de tabela de sistema pré-definido indica que um limite de tamanho de arquivo não foi definido explicitamente.

Para `NDB`: Este valor é sempre o mesmo que o valor de `INITIAL_SIZE`.

* `AUTOEXTEND_SIZE`

  O tamanho de autoextensão do espaço de tabelas. Para `NDB`, `AUTOEXTEND_SIZE` é sempre `NULL`.

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

  Para `NDB`: Um dos valores `FIXED` ou `DYNAMIC`.

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

  Para `InnoDB`: O valor total de espaço livre (em bytes) para todo o espaço de tabelas. Os espaços de tabelas predefinidos do sistema, que incluem os espaços de tabelas de sistema e os espaços de tabelas de tabelas temporárias, podem ter um ou mais arquivos de dados.

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

  Para `InnoDB`: Este valor é `NORMAL` por padrão. Os espaços de tabelas `file-per-table` de `InnoDB` podem relatar `IMPORTING`, o que indica que o espaço de tabelas ainda não está disponível.

  Para `NDB`: Para os arquivos de dados do NDB Cluster Disk, este valor é sempre `NORMAL`.

* `EXTRA`

  Para `InnoDB`: Este é sempre `NULL`.

  Para `NDB`: Para os arquivos de log de desfazer, esta coluna mostra o tamanho do buffer de log de desfazer; para os arquivos de dados, este é sempre `*NULL*`. Uma explicação mais detalhada é fornecida nos próximos parágrafos.

O `NDB` armazena uma cópia de cada arquivo de dados e de cada arquivo de registro de desfazer em cada nó de dados no clúster. A tabela `FILES` contém uma linha para cada arquivo desse tipo. Suponha que você execute as seguintes duas instruções em um NDB Cluster com quatro nós de dados:

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

Após executar essas duas instruções com sucesso, você deve ver um resultado semelhante ao mostrado aqui para essa consulta contra a tabela `FILES`:

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

#### Notas

* `FILES` é uma tabela não padrão da `INFORMATION_SCHEMA`.

* Você deve ter o privilégio `PROCESS` para consultar essa tabela.

#### Notas do InnoDB

As seguintes notas se aplicam aos arquivos de dados `InnoDB`.

* As informações relatadas por `FILES` são obtidas do cache em memória `InnoDB` para arquivos abertos, enquanto `INNODB_DATAFILES` obtém seus dados da tabela interna `SYS_DATAFILES` do dicionário de dados `InnoDB`.

* As informações fornecidas por `FILES` incluem informações sobre o espaço temporário de tabelas globais, que não estão disponíveis na tabela interna `SYS_DATAFILES` do dicionário de dados `InnoDB`, e, portanto, não estão incluídas em `INNODB_DATAFILES`.

* As informações sobre o espaço de tabelas de desfazer são mostradas em `FILES` quando espaços de tabelas de desfazer separados estão presentes, como é o caso padrão no MySQL 9.5.

* A seguinte consulta retorna todas as informações da tabela `FILES` relacionadas aos espaços de tabelas `InnoDB`.

```
  SELECT
    FILE_ID, FILE_NAME, FILE_TYPE, TABLESPACE_NAME, FREE_EXTENTS,
    TOTAL_EXTENTS, EXTENT_SIZE, INITIAL_SIZE, MAXIMUM_SIZE,
    AUTOEXTEND_SIZE, DATA_FREE, STATUS
  FROM INFORMATION_SCHEMA.FILES
  WHERE ENGINE='InnoDB'\G
  ```

#### Notas do NDB

* A tabela `FILES` fornece informações apenas sobre arquivos de dados de disco; você não pode usá-la para determinar a alocação ou disponibilidade de espaço em disco para tabelas `NDB`. No entanto, é possível ver quanto espaço está alocado para cada tabela `NDB` com dados armazenados em disco — bem como quanto espaço ainda está disponível para armazenamento de dados em disco para essa tabela — usando **ndb\_desc**.

* Grande parte das informações contidas na tabela `FILES` também pode ser encontrada na tabela `ndbinfo` `files`.

* Os valores `CREATION_TIME`, `LAST_UPDATE_TIME` e `LAST_ACCESSED` são fornecidos pelo sistema operacional e não são fornecidos pelo motor de armazenamento `NDB`. Quando nenhum valor é fornecido pelo sistema operacional, essas colunas exibem `NULL`.

* A diferença entre as colunas `TOTAL EXTENTS` e `FREE_EXTENTS` é o número de extensões atualmente em uso pelo arquivo:

  ```
  SELECT TOTAL_EXTENTS - FREE_EXTENTS AS extents_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

  Para estimar a quantidade de espaço em disco em uso pelo arquivo, multiplique essa diferença pelo valor da coluna `EXTENT_SIZE`, que fornece o tamanho de uma extensão para o arquivo em bytes:

  ```
  SELECT (TOTAL_EXTENTS - FREE_EXTENTS) * EXTENT_SIZE AS bytes_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

  Da mesma forma, você pode estimar a quantidade de espaço que permanece disponível em um arquivo específico ao multiplicar `FREE_EXTENTS` por `EXTENT_SIZE`:

  ```
  SELECT FREE_EXTENTS * EXTENT_SIZE AS bytes_free
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

  Importante

  Os valores em bytes produzidos pelas consultas anteriores são apenas aproximações e sua precisão é inversamente proporcional ao valor de `EXTENT_SIZE`. Isso significa que, quanto maior for `EXTENT_SIZE`, menos precisas serão as aproximações.

  Também é importante lembrar que, uma vez que uma extensão é usada, ela não pode ser liberada novamente sem descartar o arquivo de dados do qual faz parte. Isso significa que os apagamentos de uma tabela de dados de disco *não* liberam espaço em disco.

  O tamanho da extensão pode ser definido em uma declaração `CREATE TABLESPACE`. Para mais informações, consulte a Seção 15.1.25, “Declaração CREATE TABLESPACE”.

* Você pode obter informações sobre os espaços de tabelas de dados de disco usando o utilitário **ndb\_desc**. Para mais informações, consulte a Seção 25.6.11.1, “Objetos de Disco de Tabela de Agrupamento NDB”, bem como a descrição de **ndb\_desc**.

* Para obter informações adicionais e exemplos de criação, eliminação e obtenção de informações sobre objetos de dados de disco do NDB Cluster, consulte a Seção 25.6.11, “Tabelas de Dados de Disco do NDB Cluster”.