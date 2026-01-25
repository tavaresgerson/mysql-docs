### 24.3.25 A Tabela INFORMATION_SCHEMA TABLES

A tabela [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") fornece informações sobre tabelas em Databases.

A tabela [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") possui as seguintes Columns:

* `TABLE_CATALOG`

  O nome do Catalog ao qual a tabela pertence. Este valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do Schema (Database) ao qual a tabela pertence.

* `TABLE_NAME`

  O nome da tabela.

* `TABLE_TYPE`

  `BASE TABLE` para uma tabela, `VIEW` para uma View, ou `SYSTEM VIEW` para uma tabela `INFORMATION_SCHEMA`.

  A tabela [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") não lista tabelas `TEMPORARY`.

* `ENGINE`

  O Storage Engine para a tabela. Consulte [Chapter 14, *The InnoDB Storage Engine*](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") e [Chapter 15, *Alternative Storage Engines*](storage-engines.html "Chapter 15 Alternative Storage Engines").

  Para tabelas particionadas, `ENGINE` mostra o nome do Storage Engine usado por todas as Partitions.

* `VERSION`

  O número da versão do arquivo `.frm` da tabela.

* `ROW_FORMAT`

  O formato de armazenamento de Row (`Fixed`, `Dynamic`, `Compressed`, `Redundant`, `Compact`). Para tabelas `MyISAM`, `Dynamic` corresponde ao que [**myisamchk -dvv**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") relata como `Packed`. O formato de tabela `InnoDB` é `Redundant` ou `Compact` ao usar o formato de arquivo `Antelope`, ou `Compressed` ou `Dynamic` ao usar o formato de arquivo `Barracuda`.

* `TABLE_ROWS`

  O número de Rows. Alguns Storage Engines, como o `MyISAM`, armazenam a contagem exata. Para outros Storage Engines, como o `InnoDB`, este valor é uma aproximação e pode variar do valor real em até 40% a 50%. Nesses casos, use `SELECT COUNT(*)` para obter uma contagem precisa.

  `TABLE_ROWS` é `NULL` para tabelas `INFORMATION_SCHEMA`.

  Para tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), a contagem de Rows é apenas uma estimativa aproximada usada na otimização SQL. (Isso também é verdade se a tabela [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") for particionada.)

* `AVG_ROW_LENGTH`

  O comprimento médio da Row.

  Consulte as notas no final desta seção para informações relacionadas.

* `DATA_LENGTH`

  Para `MyISAM`, `DATA_LENGTH` é o comprimento do arquivo de dados, em bytes.

  Para `InnoDB`, `DATA_LENGTH` é a quantidade aproximada de espaço alocado para o Clustered Index, em bytes. Especificamente, é o tamanho do Clustered Index, em pages, multiplicado pelo tamanho da Page do `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros Storage Engines.

* `MAX_DATA_LENGTH`

  Para `MyISAM`, `MAX_DATA_LENGTH` é o comprimento máximo do arquivo de dados. Este é o número total de bytes de dados que podem ser armazenados na tabela, dado o tamanho do ponteiro de dados utilizado.

  Não utilizado para `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros Storage Engines.

* `INDEX_LENGTH`

  Para `MyISAM`, `INDEX_LENGTH` é o comprimento do arquivo de Index, em bytes.

  Para `InnoDB`, `INDEX_LENGTH` é a quantidade aproximada de espaço alocado para Indexes não Clustered, em bytes. Especificamente, é a soma dos tamanhos dos Indexes não Clustered, em pages, multiplicada pelo tamanho da Page do `InnoDB`.

  Consulte as notas no final desta seção para obter informações sobre outros Storage Engines.

* `DATA_FREE`

  O número de bytes alocados, mas não utilizados.

  Tabelas `InnoDB` relatam o Free Space do Tablespace ao qual a tabela pertence. Para uma tabela localizada no Tablespace compartilhado, este é o Free Space do Tablespace compartilhado. Se você estiver usando múltiplos Tablespaces e a tabela tiver seu próprio Tablespace, o Free Space é apenas para aquela tabela. Free Space significa o número de bytes em Extents completamente livres menos uma margem de segurança. Mesmo que o Free Space seja exibido como 0, ainda pode ser possível inserir Rows, contanto que novos Extents não precisem ser alocados.

  Para NDB Cluster, `DATA_FREE` mostra o espaço alocado em Disk para, mas não usado por, uma tabela ou fragmento Disk Data no Disk. (O uso de recursos de dados In-Memory é relatado pela Column `DATA_LENGTH`.)

  Para tabelas particionadas, este valor é apenas uma estimativa e pode não estar absolutamente correto. Um método mais preciso de obter esta informação nesses casos é consultar a tabela `INFORMATION_SCHEMA` [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table"), conforme mostrado neste exemplo:

  ```sql
  SELECT SUM(DATA_FREE)
      FROM  INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_SCHEMA = 'mydb'
      AND   TABLE_NAME   = 'mytable';
  ```

  Para mais informações, consulte [Section 24.3.16, “The INFORMATION_SCHEMA PARTITIONS Table”](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table").

* `AUTO_INCREMENT`

  O próximo valor `AUTO_INCREMENT`.

* `CREATE_TIME`

  Quando a tabela foi criada.

* `UPDATE_TIME`

  Quando o arquivo de dados foi atualizado pela última vez. Para alguns Storage Engines, este valor é `NULL`. Por exemplo, `InnoDB` armazena múltiplas tabelas em seu [system tablespace](glossary.html#glos_system_tablespace "system tablespace") e o Timestamp do arquivo de dados não se aplica. Mesmo com o modo [file-per-table](glossary.html#glos_file_per_table "file-per-table"), com cada tabela `InnoDB` em um arquivo `.ibd` separado, o [change buffering](glossary.html#glos_change_buffering "change buffering") pode atrasar a escrita no arquivo de dados, portanto, o tempo de modificação do arquivo é diferente do tempo do último Insert, Update ou Delete. Para `MyISAM`, o Timestamp do arquivo de dados é usado; no entanto, no Windows, o Timestamp não é atualizado por Updates, então o valor é impreciso.

  `UPDATE_TIME` exibe um valor de Timestamp para o último [`UPDATE`](update.html "13.2.11 UPDATE Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement") ou [`DELETE`](delete.html "13.2.2 DELETE Statement") executado em tabelas `InnoDB` que não são particionadas. Para MVCC, o valor do Timestamp reflete o tempo de [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), que é considerado o tempo da última atualização. Timestamps não são persistidos quando o Server é reiniciado ou quando a tabela é removida do cache do Dicionário de Dados do `InnoDB`.

  A Column `UPDATE_TIME` também mostra essa informação para tabelas `InnoDB` particionadas.

* `CHECK_TIME`

  Quando a tabela foi verificada pela última vez. Nem todos os Storage Engines atualizam esse tempo, caso em que o valor é sempre `NULL`.

  Para tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") particionadas, `CHECK_TIME` é sempre `NULL`.

* `TABLE_COLLATION`

  O Collation padrão da tabela. A saída não lista explicitamente o Character Set padrão da tabela, mas o nome do Collation começa com o nome do Character Set.

* `CHECKSUM`

  O valor do Checksum ativo, se houver.

* `CREATE_OPTIONS`

  Opções extras usadas com o [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

  `CREATE_OPTIONS` mostra `partitioned` se a tabela for particionada.

  `CREATE_OPTIONS` mostra a cláusula `ENCRYPTION` especificada para tabelas criadas em Tablespaces File-Per-Table.

  Ao criar uma tabela com [strict mode](glossary.html#glos_strict_mode "strict mode") desabilitado, o Row Format padrão do Storage Engine é usado se o Row Format especificado não for suportado. O Row Format real da tabela é relatado na Column `ROW_FORMAT`. `CREATE_OPTIONS` mostra o Row Format que foi especificado na Statement [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

  Ao alterar o Storage Engine de uma tabela, as opções de tabela que não são aplicáveis ao novo Storage Engine são mantidas na definição da tabela para permitir reverter a tabela com suas opções previamente definidas para o Storage Engine original, se necessário. A Column `CREATE_OPTIONS` pode mostrar opções retidas.

* `TABLE_COMMENT`

  O Comment usado ao criar a tabela (ou informações sobre por que o MySQL não pôde acessar as informações da tabela).

#### Notas

* Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), a saída desta Statement mostra valores apropriados para as Columns `AVG_ROW_LENGTH` e `DATA_LENGTH`, com a exceção de que Columns [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") não são levadas em consideração.

* Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), `DATA_LENGTH` inclui dados armazenados apenas na memória principal; as Columns `MAX_DATA_LENGTH` e `DATA_FREE` aplicam-se a Disk Data.

* Para tabelas NDB Cluster Disk Data, `MAX_DATA_LENGTH` mostra o espaço alocado para a parte em Disk de uma tabela ou fragmento Disk Data. (O uso de recursos de dados In-Memory é relatado pela Column `DATA_LENGTH`.)

* Para tabelas `MEMORY`, os valores `DATA_LENGTH`, `MAX_DATA_LENGTH` e `INDEX_LENGTH` aproximam a quantidade real de memória alocada. O algoritmo de alocação reserva memória em grandes quantidades para reduzir o número de operações de alocação.

* Para Views, todas as Columns da tabela [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") são `NULL`, exceto que `TABLE_NAME` indica o nome da View e `TABLE_COMMENT` diz `VIEW`.

Informações sobre a tabela também estão disponíveis nas Statements [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement") e [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement"). Consulte [Section 13.7.5.36, “SHOW TABLE STATUS Statement”](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement") e [Section 13.7.5.37, “SHOW TABLES Statement”](show-tables.html "13.7.5.37 SHOW TABLES Statement"). As seguintes Statements são equivalentes:

```sql
SELECT
    TABLE_NAME, ENGINE, VERSION, ROW_FORMAT, TABLE_ROWS, AVG_ROW_LENGTH,
    DATA_LENGTH, MAX_DATA_LENGTH, INDEX_LENGTH, DATA_FREE, AUTO_INCREMENT,
    CREATE_TIME, UPDATE_TIME, CHECK_TIME, TABLE_COLLATION, CHECKSUM,
    CREATE_OPTIONS, TABLE_COMMENT
  FROM INFORMATION_SCHEMA.TABLES
  WHERE table_schema = 'db_name'
  [AND table_name LIKE 'wild']

SHOW TABLE STATUS
  FROM db_name
  [LIKE 'wild']
```

As seguintes Statements são equivalentes:

```sql
SELECT
  TABLE_NAME, TABLE_TYPE
  FROM INFORMATION_SCHEMA.TABLES
  WHERE table_schema = 'db_name'
  [AND table_name LIKE 'wild']

SHOW FULL TABLES
  FROM db_name
  [LIKE 'wild']
```