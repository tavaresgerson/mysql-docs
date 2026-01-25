### 24.3.16 A Tabela INFORMATION_SCHEMA PARTITIONS

A tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 A Tabela INFORMATION_SCHEMA PARTITIONS") fornece informações sobre as PARTITIONS de tabelas. Cada linha nesta tabela corresponde a uma PARTITION individual ou SUBPARTITION de uma tabela particionada. Para mais informações sobre particionamento de tabelas, consulte [Capítulo 22, *Partitioning*](partitioning.html "Chapter 22 Partitioning").

A tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 A Tabela INFORMATION_SCHEMA PARTITIONS") possui estas colunas:

* `TABLE_CATALOG`

  O nome do CATALOG ao qual a tabela pertence. Este valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do SCHEMA (Database) ao qual a tabela pertence.

* `TABLE_NAME`

  O nome da tabela que contém a PARTITION.

* `PARTITION_NAME`

  O nome da PARTITION.

* `SUBPARTITION_NAME`

  Se a linha da tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 A Tabela INFORMATION_SCHEMA PARTITIONS") representar uma SUBPARTITION, o nome da SUBPARTITION; caso contrário, `NULL`.

* `PARTITION_ORDINAL_POSITION`

  Todas as PARTITIONS são indexadas na mesma ordem em que são definidas, sendo `1` o número atribuído à primeira PARTITION. A Indexing pode mudar à medida que PARTITIONS são adicionadas, removidas e reorganizadas; o número mostrado nesta coluna reflete a ordem atual, levando em conta quaisquer mudanças de Indexing.

* `SUBPARTITION_ORDINAL_POSITION`

  SUBPARTITIONS dentro de uma determinada PARTITION também são indexadas e reindexadas da mesma maneira que as PARTITIONS são indexadas dentro de uma tabela.

* `PARTITION_METHOD`

  Um dos valores `RANGE`, `LIST`, `HASH`, `LINEAR HASH`, `KEY`, ou `LINEAR KEY`; ou seja, um dos tipos de Partitioning disponíveis, conforme discutido na [Seção 22.2, “Partitioning Types”](partitioning-types.html "22.2 Partitioning Types").

* `SUBPARTITION_METHOD`

  Um dos valores `HASH`, `LINEAR HASH`, `KEY`, ou `LINEAR KEY`; ou seja, um dos tipos de Subpartitioning disponíveis, conforme discutido na [Seção 22.2.6, “Subpartitioning”](partitioning-subpartitions.html "22.2.6 Subpartitioning").

* `PARTITION_EXPRESSION`

  A expressão para a função de Partitioning usada na instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") que criou o esquema de Partitioning atual da tabela.

  Por exemplo, considere uma tabela particionada criada no Database `test` usando esta instrução:

  ```sql
  CREATE TABLE tp (
      c1 INT,
      c2 INT,
      c3 VARCHAR(25)
  )
  PARTITION BY HASH(c1 + c2)
  PARTITIONS 4;
  ```

  A coluna `PARTITION_EXPRESSION` em uma linha da tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 A Tabela INFORMATION_SCHEMA PARTITIONS") para uma PARTITION desta tabela exibe `c1 + c2`, conforme mostrado aqui:

  ```sql
  mysql> SELECT DISTINCT PARTITION_EXPRESSION
         FROM INFORMATION_SCHEMA.PARTITIONS
         WHERE TABLE_NAME='tp' AND TABLE_SCHEMA='test';
  +----------------------+
  | PARTITION_EXPRESSION |
  +----------------------+
  | c1 + c2              |
  +----------------------+
  ```

  Para uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que não está explicitamente particionada, esta coluna fica vazia. Para tabelas que utilizam outros Storage Engines e que não estão particionadas, esta coluna é `NULL`.

* `SUBPARTITION_EXPRESSION`

  Isto funciona da mesma forma para a expressão de Subpartitioning que define o Subpartitioning para uma tabela, assim como `PARTITION_EXPRESSION` funciona para a expressão de Partitioning usada para definir o Partitioning de uma tabela.

  Se a tabela não tiver SUBPARTITIONS, esta coluna é `NULL`.

* `PARTITION_DESCRIPTION`

  Esta coluna é usada para PARTITIONS `RANGE` e `LIST`. Para uma PARTITION `RANGE`, ela contém o valor definido na cláusula `VALUES LESS THAN` da PARTITION, que pode ser um inteiro ou `MAXVALUE`. Para uma PARTITION `LIST`, esta coluna contém os valores definidos na cláusula `VALUES IN` da PARTITION, que é uma lista de valores inteiros separados por vírgula.

  Para PARTITIONS cujo `PARTITION_METHOD` é diferente de `RANGE` ou `LIST`, esta coluna é sempre `NULL`.

* `TABLE_ROWS`

  O número de linhas da tabela na PARTITION.

  Para tabelas particionadas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), a contagem de linhas fornecida na coluna `TABLE_ROWS` é apenas um valor estimado usado na otimização de SQL, e pode nem sempre ser exato.

  Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), você também pode obter esta informação usando o utilitário [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables").

* `AVG_ROW_LENGTH`

  O comprimento médio das linhas armazenadas nesta PARTITION ou SUBPARTITION, em bytes. É o mesmo que `DATA_LENGTH` dividido por `TABLE_ROWS`.

  Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), você também pode obter esta informação usando o utilitário [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables").

* `DATA_LENGTH`

  O comprimento total de todas as linhas armazenadas nesta PARTITION ou SUBPARTITION, em bytes; ou seja, o número total de bytes armazenados na PARTITION ou SUBPARTITION.

  Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), você também pode obter esta informação usando o utilitário [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables").

* `MAX_DATA_LENGTH`

  O número máximo de bytes que podem ser armazenados nesta PARTITION ou SUBPARTITION.

  Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), você também pode obter esta informação usando o utilitário [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables").

* `INDEX_LENGTH`

  O comprimento do arquivo de Index para esta PARTITION ou SUBPARTITION, em bytes.

  Para PARTITIONS de tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), independentemente de as tabelas usarem Partitioning implícito ou explícito, o valor da coluna `INDEX_LENGTH` é sempre 0. No entanto, você pode obter informações equivalentes usando o utilitário [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables").

* `DATA_FREE`

  O número de bytes alocados à PARTITION ou SUBPARTITION, mas não utilizados.

  Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), você também pode obter esta informação usando o utilitário [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables").

* `CREATE_TIME`

  O tempo em que a PARTITION ou SUBPARTITION foi criada.

* `UPDATE_TIME`

  O tempo em que a PARTITION ou SUBPARTITION foi modificada pela última vez.

* `CHECK_TIME`

  A última vez em que a tabela à qual esta PARTITION ou SUBPARTITION pertence foi verificada.

  Para tabelas particionadas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), o valor é sempre `NULL`.

* `CHECKSUM`

  O valor do CHECKSUM, se houver; caso contrário, `NULL`.

* `PARTITION_COMMENT`

  O texto do comentário, se a PARTITION tiver um. Caso contrário, este valor está vazio.

  O comprimento máximo para um comentário de PARTITION é definido como 1024 caracteres, e a largura de exibição da coluna `PARTITION_COMMENT` também é de 1024 caracteres para corresponder a esse limite.

* `NODEGROUP`

  Este é o nodegroup ao qual a PARTITION pertence. Para tabelas NDB Cluster, este é sempre `default`. Para tabelas particionadas usando Storage Engines diferentes de [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), o valor também é `default`. Caso contrário, esta coluna fica vazia.

* `TABLESPACE_NAME`

  O nome do tablespace ao qual a PARTITION pertence. O valor é sempre `DEFAULT`, a menos que a tabela use o Storage Engine `NDB` (veja as *Notas* no final desta seção).

#### Notas

* [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 A Tabela INFORMATION_SCHEMA PARTITIONS") é uma tabela `INFORMATION_SCHEMA` não padrão.

* Uma tabela que usa qualquer Storage Engine diferente de [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") e que não é particionada tem uma linha na tabela `PARTITIONS`. No entanto, os valores das colunas `PARTITION_NAME`, `SUBPARTITION_NAME`, `PARTITION_ORDINAL_POSITION`, `SUBPARTITION_ORDINAL_POSITION`, `PARTITION_METHOD`, `SUBPARTITION_METHOD`, `PARTITION_EXPRESSION`, `SUBPARTITION_EXPRESSION` e `PARTITION_DESCRIPTION` são todos `NULL`. Além disso, a coluna `PARTITION_COMMENT` neste caso está em branco.

* Uma tabela `NDB` que não é explicitamente particionada possui uma linha na tabela `PARTITIONS` para cada data node no NDB cluster. Para cada uma dessas linhas:

  + As colunas `SUBPARTITION_NAME`, `SUBPARTITION_ORDINAL_POSITION`, `SUBPARTITION_METHOD`, `SUBPARTITION_EXPRESSION`, `CREATE_TIME`, `UPDATE_TIME`, `CHECK_TIME`, `CHECKSUM` e `TABLESPACE_NAME` são todas `NULL`.

  + O `PARTITION_METHOD` é sempre `KEY`.

  + A coluna `NODEGROUP` é `default`.

  + As colunas `PARTITION_EXPRESSION` e `PARTITION_COMMENT` estão vazias.
