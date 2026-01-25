### 13.1.18 Instrução CREATE TABLE

[13.1.18.1 Arquivos Criados por CREATE TABLE](create-table-files.html)

[13.1.18.2 Instrução CREATE TEMPORARY TABLE](create-temporary-table.html)

[13.1.18.3 Instrução CREATE TABLE ... LIKE](create-table-like.html)

[13.1.18.4 Instrução CREATE TABLE ... SELECT](create-table-select.html)

[13.1.18.5 Restrições FOREIGN KEY](create-table-foreign-keys.html)

[13.1.18.6 Alterações Silenciosas na Especificação de Colunas](silent-column-changes.html)

[13.1.18.7 CREATE TABLE e Colunas Geradas](create-table-generated-columns.html)

[13.1.18.8 Secondary Indexes e Colunas Geradas](create-table-secondary-indexes.html)

[13.1.18.9 Configurando Opções de Comentário NDB](create-table-ndb-comment-options.html)

```sql
CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    (create_definition,...)
    [table_options]
    [partition_options]

CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    [(create_definition,...)]
    [table_options]
    [partition_options]
    [IGNORE | REPLACE]
    [AS] query_expression

CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    { LIKE old_tbl_name | (LIKE old_tbl_name) }

create_definition: {
    col_name column_definition
  | {INDEX | KEY} [index_name] [index_type] (key_part,...)
      [index_option] ...
  | {FULLTEXT | SPATIAL} [INDEX | KEY] [index_name] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol PRIMARY KEY
      [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol UNIQUE [INDEX | KEY]
      [index_name] [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol FOREIGN KEY
      [index_name] (col_name,...)
      reference_definition
  | CHECK (expr)
}

column_definition: {
    data_type [NOT NULL | NULL] [DEFAULT default_value]
      [AUTO_INCREMENT] [UNIQUE [KEY PRIMARY] KEY]
      [COMMENT 'string']
      [COLLATE collation_name]
      [COLUMN_FORMAT {FIXED | DYNAMIC | DEFAULT}]
      [STORAGE {DISK | MEMORY}]
      [reference_definition]
  | data_type
      [COLLATE collation_name]
      [GENERATED ALWAYS] AS (expr)
      [VIRTUAL | STORED] [NOT NULL | NULL]
      [UNIQUE [KEY PRIMARY] KEY]
      [COMMENT 'string']
      [reference_definition]
}

data_type:
    (see Chapter 11, Data Types)

key_part:
    col_name [(length)] [ASC | DESC]

index_type:
    USING {BTREE | HASH}

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
}

reference_definition:
    REFERENCES tbl_name (key_part,...)
      [MATCH FULL | MATCH PARTIAL | MATCH SIMPLE]
      [ON DELETE reference_option]
      [ON UPDATE reference_option]

reference_option:
    RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT

table_options:
    table_option ,] table_option] ...

table_option: {
    AUTO_INCREMENT [=] value
  | AVG_ROW_LENGTH [=] value
  | [DEFAULT] CHARACTER SET [=] charset_name
  | CHECKSUM [=] {0 | 1}
  | [DEFAULT] COLLATE [=] collation_name
  | COMMENT [=] 'string'
  | COMPRESSION [=] {'ZLIB' | 'LZ4' | 'NONE'}
  | CONNECTION [=] 'connect_string'
  | {DATA | INDEX} DIRECTORY [=] 'absolute path to directory'
  | DELAY_KEY_WRITE [=] {0 | 1}
  | ENCRYPTION [=] {'Y' | 'N'}
  | ENGINE [=] engine_name
  | INSERT_METHOD [=] { NO | FIRST | LAST }
  | KEY_BLOCK_SIZE [=] value
  | MAX_ROWS [=] value
  | MIN_ROWS [=] value
  | PACK_KEYS [=] {0 | 1 | DEFAULT}
  | PASSWORD [=] 'string'
  | ROW_FORMAT [=] {DEFAULT | DYNAMIC | FIXED | COMPRESSED | REDUNDANT | COMPACT}
  | STATS_AUTO_RECALC [=] {DEFAULT | 0 | 1}
  | STATS_PERSISTENT [=] {DEFAULT | 0 | 1}
  | STATS_SAMPLE_PAGES [=] value
  | tablespace_option
  | UNION [=] (tbl_name[,tbl_name]...)
}

partition_options:
    PARTITION BY
        { [LINEAR] HASH(expr)
        | [LINEAR] KEY [ALGORITHM={1 | 2}] (column_list)
        | RANGE{(expr) | COLUMNS(column_list)}
        | LIST{(expr) | COLUMNS(column_list)} }
    [PARTITIONS num]
    [SUBPARTITION BY
        { [LINEAR] HASH(expr)
        | [LINEAR] KEY [ALGORITHM={1 | 2}] (column_list) }
      [SUBPARTITIONS num]
    ]
    [(partition_definition [, partition_definition] ...)]

partition_definition:
    PARTITION partition_name
        [VALUES
            {LESS THAN {(expr | value_list) | MAXVALUE}
            |
            IN (value_list)}]
        STORAGE] ENGINE [=] engine_name]
        [COMMENT [=] 'string' ]
        [DATA DIRECTORY [=] 'data_dir']
        [INDEX DIRECTORY [=] 'index_dir']
        [MAX_ROWS [=] max_number_of_rows]
        [MIN_ROWS [=] min_number_of_rows]
        [TABLESPACE [=] tablespace_name]
        [(subpartition_definition [, subpartition_definition] ...)]

subpartition_definition:
    SUBPARTITION logical_name
        STORAGE] ENGINE [=] engine_name]
        [COMMENT [=] 'string' ]
        [DATA DIRECTORY [=] 'data_dir']
        [INDEX DIRECTORY [=] 'index_dir']
        [MAX_ROWS [=] max_number_of_rows]
        [MIN_ROWS [=] min_number_of_rows]
        [TABLESPACE [=] tablespace_name]

tablespace_option:
    TABLESPACE tablespace_name [STORAGE DISK]
  | [TABLESPACE tablespace_name] STORAGE MEMORY

query_expression:
    SELECT ...   (Some valid select or union statement)
```

A instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") cria uma tabela com o nome fornecido. Você deve ter o privilégio [`CREATE`](privileges-provided.html#priv_create) para a tabela.

Por padrão, as tabelas são criadas no Database padrão, utilizando o Storage Engine [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"). Ocorre um erro se a tabela já existir, se não houver um Database padrão, ou se o Database não existir.

O MySQL não tem limite para o número de tabelas. O File System subjacente pode ter um limite no número de arquivos que representam tabelas. Storage Engines individuais podem impor restrições específicas do Engine. O `InnoDB` permite até 4 bilhões de tabelas.

Para informações sobre a representação física de uma tabela, consulte [Seção 13.1.18.1, “Arquivos Criados por CREATE TABLE”](create-table-files.html "13.1.18.1 Files Created by CREATE TABLE").

A instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") possui vários aspectos, descritos nos seguintes tópicos nesta seção:

* [Nome da Tabela](create-table.html#create-table-name "Table Name")
* [Tabelas Temporárias](create-table.html#create-table-temporary-tables "Temporary Tables")
* [Clonagem e Cópia de Tabela](create-table.html#create-table-clone-copy "Table Cloning and Copying")
* [Tipos de Dados e Atributos de Coluna](create-table.html#create-table-types-attributes "Column Data Types and Attributes")
* [Indexes e Foreign Keys](create-table.html#create-table-indexes-keys "Indexes and Foreign Keys")
* [Opções de Tabela](create-table.html#create-table-options "Table Options")
* [Particionamento de Tabela](create-table.html#create-table-partitioning "Table Partitioning")

#### Nome da Tabela

* `tbl_name`

  O nome da tabela pode ser especificado como *`db_name.tbl_name`* para criar a tabela em um Database específico. Isso funciona independentemente de haver um Database padrão, assumindo que o Database exista. Se você usar identificadores entre aspas, coloque o Database e os nomes da tabela separadamente entre aspas. Por exemplo, escreva `` `mydb`.`mytbl` ``, e não `` `mydb.mytbl` ``.

  As regras para nomes de tabelas permitidos são fornecidas na [Seção 9.2, “Nomes de Objetos de Schema”](identifiers.html "9.2 Schema Object Names").

* `IF NOT EXISTS`

  Impede que ocorra um erro se a tabela existir. No entanto, não há verificação de que a tabela existente tenha uma estrutura idêntica à indicada pela instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

#### Tabelas Temporárias

Você pode usar a palavra-chave `TEMPORARY` ao criar uma tabela. Uma tabela `TEMPORARY` é visível apenas dentro da sessão atual e é descartada automaticamente quando a sessão é fechada. Para obter mais informações, consulte [Seção 13.1.18.2, “Instrução CREATE TEMPORARY TABLE”](create-temporary-table.html "13.1.18.2 CREATE TEMPORARY TABLE Statement").

#### Clonagem e Cópia de Tabela

* `LIKE`

  Use `CREATE TABLE ... LIKE` para criar uma tabela vazia baseada na definição de outra tabela, incluindo quaisquer atributos de coluna e Indexes definidos na tabela original:

  ```sql
  CREATE TABLE new_tbl LIKE orig_tbl;
  ```

  Para obter mais informações, consulte [Seção 13.1.18.3, “Instrução CREATE TABLE ... LIKE”](create-table-like.html "13.1.18.3 CREATE TABLE ... LIKE Statement").

* `[AS] query_expression`

  Para criar uma tabela a partir de outra, adicione uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") ao final da instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"):

  ```sql
  CREATE TABLE new_tbl AS SELECT * FROM orig_tbl;
  ```

  Para obter mais informações, consulte [Seção 13.1.18.4, “Instrução CREATE TABLE ... SELECT”](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement").

* `IGNORE | REPLACE`

  As opções `IGNORE` e `REPLACE` indicam como lidar com linhas que duplicam valores de Unique Key ao copiar uma tabela usando uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement").

  Para obter mais informações, consulte [Seção 13.1.18.4, “Instrução CREATE TABLE ... SELECT”](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement").

#### Tipos de Dados e Atributos de Coluna

Há um limite rígido de 4096 colunas por tabela, mas o máximo efetivo pode ser menor para uma determinada tabela e depende dos fatores discutidos na [Seção 8.4.7, “Limites na Contagem de Colunas e Tamanho de Linha da Tabela”](column-count-limit.html "8.4.7 Limits on Table Column Count and Row Size").

* `data_type`

  *`data_type`* representa o tipo de dado em uma definição de coluna. Para uma descrição completa da sintaxe disponível para especificar tipos de dados de coluna, bem como informações sobre as propriedades de cada tipo, consulte [Capítulo 11, *Data Types*](data-types.html "Chapter 11 Data Types").

  + Alguns atributos não se aplicam a todos os tipos de dados. `AUTO_INCREMENT` se aplica apenas a tipos inteiros e de ponto flutuante. `DEFAULT` não se aplica aos tipos [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"), `GEOMETRY` e [`JSON`](json.html "11.5 The JSON Data Type").

  + Os tipos de dados de caracteres ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), os tipos [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"), [`ENUM`](enum.html "11.3.5 The ENUM Type"), [`SET`](set.html "11.3.6 The SET Type") e quaisquer sinônimos) podem incluir `CHARACTER SET` para especificar o conjunto de caracteres para a coluna. `CHARSET` é um sinônimo para `CHARACTER SET`. Uma Collation (agrupamento) para o conjunto de caracteres pode ser especificada com o atributo `COLLATE`, juntamente com quaisquer outros atributos. Para detalhes, consulte [Capítulo 10, *Character Sets, Collations, Unicode*](charset.html "Chapter 10 Character Sets, Collations, Unicode"). Exemplo:

    ```sql
    CREATE TABLE t (c CHAR(20) CHARACTER SET utf8 COLLATE utf8_bin);
    ```

    O MySQL 5.7 interpreta as especificações de comprimento em definições de colunas de caracteres em caracteres. Os comprimentos para [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") e [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") são em bytes.

  + Para colunas [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") e [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), podem ser criados Indexes que usam apenas a parte inicial dos valores da coluna, utilizando a sintaxe `col_name(length)` para especificar um comprimento de Prefix do Index. Colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") e [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") também podem ser indexadas, mas um comprimento de Prefix *deve* ser fornecido. Os comprimentos de Prefix são fornecidos em caracteres para tipos de String não binários e em bytes para tipos de String binários. Ou seja, as entradas do Index consistem nos primeiros *`length`* caracteres de cada valor de coluna para colunas [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") e [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"), e nos primeiros *`length`* bytes de cada valor de coluna para colunas [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") e [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"). Indexar apenas um Prefix de valores de coluna como este pode tornar o arquivo de Index muito menor. Para informações adicionais sobre Index Prefixes, consulte [Seção 13.1.14, “Instrução CREATE INDEX”](create-index.html "13.1.14 CREATE INDEX Statement").

    Somente os Storage Engines `InnoDB` e `MyISAM` suportam Indexing em colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") e [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"). Por exemplo:

    ```sql
    CREATE TABLE test (blob_col BLOB, INDEX(blob_col(10)));
    ```

    A partir do MySQL 5.7.17, se um Prefix de Index especificado exceder o tamanho máximo do tipo de dado da coluna, [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") lida com o Index da seguinte forma:

    - Para um Index não Unique, ocorre um erro (se o modo SQL estrito estiver ativado), ou o comprimento do Index é reduzido para se adequar ao tamanho máximo do tipo de dado da coluna e um Warning é produzido (se o modo SQL estrito não estiver ativado).

    - Para um Index Unique, ocorre um erro, independentemente do modo SQL, porque a redução do comprimento do Index pode permitir a inserção de entradas não únicas que não atendem ao requisito de unicidade especificado.

  + Colunas [`JSON`](json.html "11.5 The JSON Data Type") não podem ser indexadas. Você pode contornar essa restrição criando um Index em uma coluna gerada que extrai um valor escalar da coluna `JSON`. Consulte [Indexing a Generated Column to Provide a JSON Column Index](create-table-secondary-indexes.html#json-column-indirect-index "Indexing a Generated Column to Provide a JSON Column Index"), para um exemplo detalhado.

* `NOT NULL | NULL`

  Se nem `NULL` nem `NOT NULL` for especificado, a coluna é tratada como se `NULL` tivesse sido especificado.

  No MySQL 5.7, apenas os Storage Engines `InnoDB`, `MyISAM` e `MEMORY` suportam Indexes em colunas que podem ter valores `NULL`. Em outros casos, você deve declarar colunas indexadas como `NOT NULL` ou resultará em um erro.

* `DEFAULT`

  Especifica um valor Default para uma coluna. Para obter mais informações sobre o tratamento de valores Default, incluindo o caso em que uma definição de coluna não inclui um valor `DEFAULT` explícito, consulte [Seção 11.6, “Valores Default de Tipos de Dados”](data-type-defaults.html "11.6 Data Type Default Values").

  Se o modo SQL [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) ou [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date) estiver ativado e um Default baseado em data não estiver correto de acordo com esse modo, [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") produz um Warning se o modo SQL estrito não estiver ativado e um erro se o modo estrito estiver ativado. Por exemplo, com [`NO_ZERO_IN_DATE`](sql-mode.html#sqlmode_no_zero_in_date) ativado, `c1 DATE DEFAULT '2010-00-00'` produz um Warning.

* `AUTO_INCREMENT`

  Uma coluna inteira ou de ponto flutuante pode ter o atributo adicional `AUTO_INCREMENT`. Quando você insere um valor `NULL` (recomendado) ou `0` em uma coluna `AUTO_INCREMENT` indexada, a coluna é definida como o próximo valor da sequência. Normalmente, este é `value+1`, onde *`value`* é o maior valor para a coluna atualmente na tabela. As sequências `AUTO_INCREMENT` começam com `1`.

  Para recuperar um valor `AUTO_INCREMENT` após inserir uma linha, use a função SQL [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) ou a função C API [`mysql_insert_id()`](/doc/c-api/5.7/en/mysql-insert-id.html). Consulte [Seção 12.15, “Information Functions”](information-functions.html "12.15 Information Functions") e [mysql_insert_id()](/doc/c-api/5.7/en/mysql-insert-id.html).

  Se o modo SQL [`NO_AUTO_VALUE_ON_ZERO`](sql-mode.html#sqlmode_no_auto_value_on_zero) estiver ativado, você pode armazenar `0` em colunas `AUTO_INCREMENT` como `0` sem gerar um novo valor de sequência. Consulte [Seção 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

  Pode haver apenas uma coluna `AUTO_INCREMENT` por tabela, ela deve ser indexada e não pode ter um valor `DEFAULT`. Uma coluna `AUTO_INCREMENT` funciona corretamente apenas se contiver apenas valores positivos. Inserir um número negativo é considerado como a inserção de um número positivo muito grande. Isso é feito para evitar problemas de precisão quando os números "ultrapassam" de positivo para negativo e também para garantir que você não obtenha acidentalmente uma coluna `AUTO_INCREMENT` que contenha `0`.

  Para tabelas `MyISAM`, você pode especificar uma coluna secundária `AUTO_INCREMENT` em uma Key de múltiplas colunas. Consulte [Seção 3.6.9, “Using AUTO_INCREMENT”](example-auto-increment.html "3.6.9 Using AUTO_INCREMENT").

  Para tornar o MySQL compatível com alguns aplicativos ODBC, você pode encontrar o valor `AUTO_INCREMENT` para a última linha inserida com a seguinte Query:

  ```sql
  SELECT * FROM tbl_name WHERE auto_col IS NULL
  ```

  Este método requer que a variável [`sql_auto_is_null`](server-system-variables.html#sysvar_sql_auto_is_null) não esteja definida como 0. Consulte [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

  Para informações sobre `InnoDB` e `AUTO_INCREMENT`, consulte [Seção 14.6.1.6, “AUTO_INCREMENT Handling in InnoDB”](innodb-auto-increment-handling.html "14.6.1.6 AUTO_INCREMENT Handling in InnoDB"). Para informações sobre `AUTO_INCREMENT` e MySQL Replication, consulte [Seção 16.4.1.1, “Replication and AUTO_INCREMENT”](replication-features-auto-increment.html "16.4.1.1 Replication and AUTO_INCREMENT").

* `COMMENT`

  Um Comment para uma coluna pode ser especificado com a opção `COMMENT`, com até 1024 caracteres de comprimento. O Comment é exibido pelas instruções [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") e [`SHOW FULL COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement"). Também é exibido na coluna `COLUMN_COMMENT` da tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do Information Schema.

* `COLUMN_FORMAT`

  No NDB Cluster, também é possível especificar um formato de armazenamento de dados para colunas individuais de tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") usando `COLUMN_FORMAT`. Os formatos de coluna permitidos são `FIXED`, `DYNAMIC` e `DEFAULT`. `FIXED` é usado para especificar o armazenamento de largura fixa, `DYNAMIC` permite que a coluna tenha largura variável, e `DEFAULT` faz com que a coluna use armazenamento de largura fixa ou variável conforme determinado pelo tipo de dado da coluna (possivelmente substituído por um especificador `ROW_FORMAT`).

  A partir do MySQL NDB Cluster 7.5.4, para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), o valor Default para `COLUMN_FORMAT` é `FIXED`. (O Default havia sido alterado para `DYNAMIC` no MySQL NDB Cluster 7.5.1, mas esta alteração foi revertida para manter a compatibilidade com versões GA existentes.) (Bug #24487363)

  No NDB Cluster, o deslocamento máximo possível para uma coluna definida com `COLUMN_FORMAT=FIXED` é de 8188 bytes. Para obter mais informações e possíveis soluções alternativas, consulte [Seção 21.2.7.5, “Limits Associated with Database Objects in NDB Cluster”](mysql-cluster-limitations-database-objects.html "21.2.7.5 Limits Associated with Database Objects in NDB Cluster").

  Atualmente, `COLUMN_FORMAT` não tem efeito em colunas de tabelas que usam Storage Engines diferentes de [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). No MySQL 5.7 e posterior, `COLUMN_FORMAT` é ignorado silenciosamente.

* `STORAGE`

  Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), é possível especificar se a coluna é armazenada em disco ou em memória usando uma cláusula `STORAGE`. `STORAGE DISK` faz com que a coluna seja armazenada em disco, e `STORAGE MEMORY` faz com que seja usado o armazenamento em memória. A instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") utilizada ainda deve incluir uma cláusula `TABLESPACE`:

  ```sql
  mysql> CREATE TABLE t1 (
      ->     c1 INT STORAGE DISK,
      ->     c2 INT STORAGE MEMORY
      -> ) ENGINE NDB;
  ERROR 1005 (HY000): Can't create table 'c.t1' (errno: 140)

  mysql> CREATE TABLE t1 (
      ->     c1 INT STORAGE DISK,
      ->     c2 INT STORAGE MEMORY
      -> ) TABLESPACE ts_1 ENGINE NDB;
  Query OK, 0 rows affected (1.06 sec)
  ```

  Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), `STORAGE DEFAULT` é equivalente a `STORAGE MEMORY`.

  A cláusula `STORAGE` não tem efeito em tabelas que usam Storage Engines diferentes de [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). A palavra-chave `STORAGE` é suportada apenas na build do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") fornecida com o NDB Cluster; ela não é reconhecida em nenhuma outra versão do MySQL, onde qualquer tentativa de usar a palavra-chave `STORAGE` causa um erro de sintaxe.

* `GENERATED ALWAYS`

  Usado para especificar uma expressão de Coluna Gerada. Para informações sobre [generated columns](glossary.html#glos_generated_column "generated column"), consulte [Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”](create-table-generated-columns.html "13.1.18.7 CREATE TABLE and Generated Columns").

  [Stored generated columns](glossary.html#glos_stored_generated_column "stored generated column") podem ser indexadas. `InnoDB` suporta Secondary Indexes em [virtual generated columns](glossary.html#glos_virtual_generated_column "virtual generated column"). Consulte [Seção 13.1.18.8, “Secondary Indexes e Colunas Geradas”](create-table-secondary-indexes.html "13.1.18.8 Secondary Indexes and Generated Columns").

#### Indexes e Foreign Keys

Várias palavras-chave se aplicam à criação de Indexes e Foreign Keys. Para informações gerais, além das seguintes descrições, consulte [Seção 13.1.14, “Instrução CREATE INDEX”](create-index.html "13.1.14 CREATE INDEX Statement") e [Seção 13.1.18.5, “Restrições FOREIGN KEY”](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints").

* `CONSTRAINT symbol`

  A cláusula `CONSTRAINT symbol` pode ser fornecida para nomear uma Constraint. Se a cláusula não for fornecida, ou se um *`symbol`* não for incluído após a palavra-chave `CONSTRAINT`, o MySQL gera automaticamente um nome de Constraint, com a exceção observada abaixo. O valor *`symbol`*, se usado, deve ser Unique por Schema (Database), por tipo de Constraint. Um *`symbol`* duplicado resulta em um erro. Consulte também a discussão sobre limites de comprimento de identificadores de Constraint gerados em [Seção 9.2.1, “Limites de Comprimento de Identificadores”](identifier-length.html "9.2.1 Identifier Length Limits").

  Note

  Se a cláusula `CONSTRAINT symbol` não for fornecida em uma definição de Foreign Key, ou se um *`symbol`* não for incluído após a palavra-chave `CONSTRAINT`, o [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") usa o nome do Foreign Key Index.

  O padrão SQL especifica que todos os tipos de Constraints (Primary Key, Unique Index, Foreign Key, Check) pertencem ao mesmo namespace. No MySQL, cada tipo de Constraint tem seu próprio namespace por Schema. Consequentemente, os nomes para cada tipo de Constraint devem ser Unique por Schema.

* `PRIMARY KEY`

  Um Unique Index onde todas as Key columns devem ser definidas como `NOT NULL`. Se não forem declaradas explicitamente como `NOT NULL`, o MySQL as declara implicitamente (e silenciosamente). Uma tabela pode ter apenas uma `PRIMARY KEY`. O nome de uma `PRIMARY KEY` é sempre `PRIMARY`, que, portanto, não pode ser usado como nome para qualquer outro tipo de Index.

  Se você não tiver uma `PRIMARY KEY` e um aplicativo solicitar a `PRIMARY KEY` em suas tabelas, o MySQL retorna o primeiro Index `UNIQUE` que não tem colunas `NULL` como a `PRIMARY KEY`.

  Em tabelas `InnoDB`, mantenha a `PRIMARY KEY` curta para minimizar a sobrecarga de armazenamento para Secondary Indexes. Cada entrada de Secondary Index contém uma cópia das Primary Key columns para a linha correspondente. (Consulte [Seção 14.6.2.1, “Clustered and Secondary Indexes”](innodb-index-types.html "14.6.2.1 Clustered and Secondary Indexes").)

  Na tabela criada, uma `PRIMARY KEY` é colocada em primeiro lugar, seguida por todos os Indexes `UNIQUE`, e então os Indexes não Unique. Isso ajuda o otimizador do MySQL a priorizar qual Index usar e também a detectar mais rapidamente Keys `UNIQUE` duplicadas.

  Uma `PRIMARY KEY` pode ser um Index de múltiplas colunas. No entanto, você não pode criar um Index de múltiplas colunas usando o atributo Key `PRIMARY KEY` em uma especificação de coluna. Fazer isso apenas marca aquela coluna única como Primary. Você deve usar uma cláusula `PRIMARY KEY(key_part, ...)` separada.

  Se uma tabela tiver uma `PRIMARY KEY` ou Index `UNIQUE NOT NULL` que consiste em uma única coluna que tenha um tipo inteiro, você pode usar `_rowid` para se referir à coluna indexada em instruções [`SELECT`](select.html "13.2.9 SELECT Statement"), conforme descrito em [Unique Indexes](create-index.html#create-index-unique "Unique Indexes").

  No MySQL, o nome de uma `PRIMARY KEY` é `PRIMARY`. Para outros Indexes, se você não atribuir um nome, o Index recebe o mesmo nome da primeira coluna indexada, com um sufixo opcional (`_2`, `_3`, `...`) para torná-lo Unique. Você pode ver os nomes dos Indexes para uma tabela usando `SHOW INDEX FROM tbl_name`. Consulte [Seção 13.7.5.22, “Instrução SHOW INDEX”](show-index.html "13.7.5.22 SHOW INDEX Statement").

* `KEY | INDEX`

  `KEY` é normalmente um sinônimo para `INDEX`. O atributo Key `PRIMARY KEY` também pode ser especificado apenas como `KEY` quando fornecido em uma definição de coluna. Isso foi implementado para compatibilidade com outros Database systems.

* `UNIQUE`

  Um Index `UNIQUE` cria uma Constraint tal que todos os valores no Index devem ser distintos. Ocorre um erro se você tentar adicionar uma nova linha com um valor Key que corresponda a uma linha existente. Para todos os Engines, um Index `UNIQUE` permite múltiplos valores `NULL` para colunas que podem conter `NULL`. Se você especificar um valor Prefix para uma coluna em um Index `UNIQUE`, os valores da coluna devem ser Unique dentro do comprimento do Prefix.

  Se uma tabela tiver uma `PRIMARY KEY` ou Index `UNIQUE NOT NULL` que consiste em uma única coluna que tenha um tipo inteiro, você pode usar `_rowid` para se referir à coluna indexada em instruções [`SELECT`](select.html "13.2.9 SELECT Statement"), conforme descrito em [Unique Indexes](create-index.html#create-index-unique "Unique Indexes").

* `FULLTEXT`

  Um Index `FULLTEXT` é um tipo especial de Index usado para pesquisas de texto completo (full-text searches). Apenas os Storage Engines [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") e [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") suportam Indexes `FULLTEXT`. Eles podem ser criados apenas a partir de colunas [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") e [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"). A Indexação sempre acontece em toda a coluna; a Indexação de Prefix de coluna não é suportada e qualquer comprimento de Prefix é ignorado se especificado. Consulte [Seção 12.9, “Full-Text Search Functions”](fulltext-search.html "12.9 Full-Text Search Functions"), para detalhes da operação. Uma cláusula `WITH PARSER` pode ser especificada como um valor *`index_option`* para associar um plugin Parser ao Index, caso as operações de Indexação e busca de texto completo exijam tratamento especial. Esta cláusula é válida apenas para Indexes `FULLTEXT`. Tanto [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") quanto [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") suportam plugins de Full-Text Parser. Consulte [Full-Text Parser Plugins](/doc/extending-mysql/5.7/en/plugin-types.html#full-text-plugin-type) e [Writing Full-Text Parser Plugins](/doc/extending-mysql/5.7/en/writing-full-text-plugins.html) para obter mais informações.

* `SPATIAL`

  Você pode criar Indexes `SPATIAL` em tipos de dados espaciais. Tipos espaciais são suportados apenas para tabelas `MyISAM` e `InnoDB`, e colunas indexadas devem ser declaradas como `NOT NULL`. Consulte [Seção 11.4, “Spatial Data Types”](spatial-types.html "11.4 Spatial Data Types").

* `FOREIGN KEY`

  O MySQL suporta Foreign Keys, que permitem fazer referência cruzada de dados relacionados em tabelas, e Foreign Key Constraints, que ajudam a manter a consistência desses dados distribuídos. Para definição e informações de opção, consulte [*`reference_definition`*](create-table.html#create-table-reference-definition) e [*`reference_option`*](create-table.html#create-table-reference-option).

  Tabelas particionadas que empregam o Storage Engine [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") não suportam Foreign Keys. Consulte [Seção 22.6, “Restrictions and Limitations on Partitioning”](partitioning-limitations.html "22.6 Restrictions and Limitations on Partitioning"), para obter mais informações.

* `CHECK`

  A cláusula `CHECK` é analisada (parsed) mas ignorada por todos os Storage Engines.

* `key_part`

  + Uma especificação *`key_part`* pode terminar com `ASC` ou `DESC`. Essas palavras-chave são permitidas para futuras extensões para especificar o armazenamento de valores de Index ascendente ou descendente. Atualmente, elas são analisadas, mas ignoradas; os valores de Index são sempre armazenados em ordem ascendente.

  + Prefixes, definidos pelo atributo *`length`*, podem ter até 767 bytes de comprimento para tabelas `InnoDB` ou 3072 bytes se a opção [`innodb_large_prefix`](innodb-parameters.html#sysvar_innodb_large_prefix) estiver ativada. Para tabelas `MyISAM`, o limite de comprimento do Prefix é de 1000 bytes.

    Os *limites* de Prefix são medidos em bytes. No entanto, os *comprimentos* de Prefix para especificações de Index nas instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") e [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") são interpretados como número de caracteres para tipos de String não binários ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types")) e número de bytes para tipos de String binários ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")). Leve isso em consideração ao especificar um comprimento de Prefix para uma coluna de String não binária que usa um conjunto de caracteres multibyte.

* `index_type`

  Alguns Storage Engines permitem que você especifique um tipo de Index ao criar um Index. A sintaxe para o especificador *`index_type`* é `USING type_name`.

  Exemplo:

  ```sql
  CREATE TABLE lookup
    (id INT, INDEX USING BTREE (id))
    ENGINE = MEMORY;
  ```

  A posição preferencial para `USING` é após a lista de colunas do Index. Pode ser fornecida antes da lista de colunas, mas o suporte para o uso da opção nessa posição está depreciado; espere que seja removido em uma futura versão do MySQL.

* `index_option`

  Os valores *`index_option`* especificam opções adicionais para um Index.

  + `KEY_BLOCK_SIZE`

    Para tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para Key Blocks do Index. O valor é tratado como uma sugestão (hint); um tamanho diferente pode ser usado, se necessário. Um valor `KEY_BLOCK_SIZE` especificado para uma definição de Index individual substitui o valor `KEY_BLOCK_SIZE` no nível da tabela.

    Para obter informações sobre o atributo `KEY_BLOCK_SIZE` no nível da tabela, consulte [Opções de Tabela](create-table.html#create-table-options "Table Options").

  + `WITH PARSER`

    A opção `WITH PARSER` pode ser usada apenas com Indexes `FULLTEXT`. Ela associa um plugin Parser ao Index se as operações de Indexação e busca de texto completo precisarem de tratamento especial. Tanto [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") quanto [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") suportam plugins de Full-Text Parser. Se você tiver uma tabela [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") com um Full-Text Parser Plugin associado, você pode converter a tabela para `InnoDB` usando `ALTER TABLE`.

  + `COMMENT`

    Definições de Index podem incluir um Comment opcional de até 1024 caracteres.

    Você pode definir o valor `MERGE_THRESHOLD` do `InnoDB` para um Index individual usando a cláusula `COMMENT` de *`index_option`*. Consulte [Seção 14.8.12, “Configuring the Merge Threshold for Index Pages”](index-page-merge-threshold.html "14.8.12 Configuring the Merge Threshold for Index Pages").

  Para obter mais informações sobre os valores *`index_option`* permitidos, consulte [Seção 13.1.14, “Instrução CREATE INDEX”](create-index.html "13.1.14 CREATE INDEX Statement"). Para obter mais informações sobre Indexes, consulte [Seção 8.3.1, “Como o MySQL Usa Indexes”](mysql-indexes.html "8.3.1 How MySQL Uses Indexes").

* `reference_definition`

  Para detalhes e exemplos de sintaxe de *`reference_definition`*, consulte [Seção 13.1.18.5, “Restrições FOREIGN KEY”](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints").

  Tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") e [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") suportam a verificação de Foreign Key Constraints. As colunas da tabela referenciada devem ser sempre nomeadas explicitamente. Ambas as ações `ON DELETE` e `ON UPDATE` em Foreign Keys são suportadas. Para informações e exemplos mais detalhados, consulte [Seção 13.1.18.5, “Restrições FOREIGN KEY”](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints").

  Para outros Storage Engines, o MySQL Server analisa e ignora a sintaxe `FOREIGN KEY` nas instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

  Importante

  Para usuários familiarizados com o Padrão SQL ANSI/ISO, observe que nenhum Storage Engine, incluindo o `InnoDB`, reconhece ou aplica a cláusula `MATCH` usada em definições de Constraint de integridade referencial. O uso de uma cláusula `MATCH` explícita não tem o efeito especificado e também faz com que as cláusulas `ON DELETE` e `ON UPDATE` sejam ignoradas. Por essas razões, deve-se evitar a especificação de `MATCH`.

  A cláusula `MATCH` no padrão SQL controla como os valores `NULL` em uma Foreign Key composta (de múltiplas colunas) são tratados ao comparar com uma Primary Key. O `InnoDB` essencialmente implementa a semântica definida por `MATCH SIMPLE`, que permite que uma Foreign Key seja total ou parcialmente `NULL`. Nesse caso, a linha (tabela filha) contendo tal Foreign Key é permitida para inserção e não corresponde a nenhuma linha na tabela referenciada (pai). É possível implementar outras semânticas usando Triggers.

  Além disso, o MySQL exige que as colunas referenciadas sejam indexadas por questões de performance. No entanto, o `InnoDB` não impõe nenhuma exigência de que as colunas referenciadas sejam declaradas `UNIQUE` ou `NOT NULL`. O tratamento de referências de Foreign Key a Keys não Unique ou Keys que contêm valores `NULL` não é bem definido para operações como `UPDATE` ou `DELETE CASCADE`. É aconselhável usar Foreign Keys que referenciem apenas Keys que sejam simultaneamente `UNIQUE` (ou `PRIMARY`) e `NOT NULL`.

  O MySQL analisa, mas ignora, "inline `REFERENCES` specifications" (conforme definido no padrão SQL) onde as referências são definidas como parte da especificação da coluna. O MySQL aceita cláusulas `REFERENCES` apenas quando especificadas como parte de uma especificação `FOREIGN KEY` separada. Para obter mais informações, consulte [Seção 1.6.2.3, “FOREIGN KEY Constraint Differences”](ansi-diff-foreign-keys.html "1.6.2.3 FOREIGN KEY Constraint Differences").

* `reference_option`

  Para obter informações sobre as opções `RESTRICT`, `CASCADE`, `SET NULL`, `NO ACTION` e `SET DEFAULT`, consulte [Seção 13.1.18.5, “Restrições FOREIGN KEY”](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints").

#### Opções de Tabela

As Opções de Tabela são usadas para otimizar o comportamento da tabela. Na maioria dos casos, você não precisa especificar nenhuma delas. Essas opções se aplicam a todos os Storage Engines, a menos que indicado de outra forma. Opções que não se aplicam a um determinado Storage Engine podem ser aceitas e memorizadas como parte da definição da tabela. Tais opções se aplicam se você posteriormente usar [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") para converter a tabela para usar um Storage Engine diferente.

* `ENGINE`

  Especifica o Storage Engine para a tabela, usando um dos nomes mostrados na tabela a seguir. O nome do Engine pode estar sem aspas ou entre aspas. O nome entre aspas `'DEFAULT'` é reconhecido, mas ignorado.

  <table summary="Nomes de Storage Engine permitidos para a opção de tabela ENGINE e uma descrição de cada Engine."><col style="width: 25%"/><col style="width: 70%"/><thead><tr> <th>Storage Engine</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>InnoDB</code></td> <td>Tabelas seguras para Transações com Row Locking e Foreign Keys. O Storage Engine padrão para novas tabelas. Consulte o Capítulo 14, <i>The InnoDB Storage Engine</i>, e em particular a Seção 14.1, “Introdução ao InnoDB”, se você tem experiência com MySQL, mas é novo no <code>InnoDB</code>.</td> </tr><tr> <td><code>MyISAM</code></td> <td>O Storage Engine binário portátil que é usado principalmente para Workloads somente leitura ou predominantemente leitura. Consulte a Seção 15.2, “The MyISAM Storage Engine”.</td> </tr><tr> <td><code>MEMORY</code></td> <td>Os dados para este Storage Engine são armazenados apenas na memória. Consulte a Seção 15.3, “The MEMORY Storage Engine”.</td> </tr><tr> <td><code>CSV</code></td> <td>Tabelas que armazenam linhas no formato de Valores Separados por Vírgula (Comma-Separated Values). Consulte a Seção 15.4, “The CSV Storage Engine”.</td> </tr><tr> <td><code>ARCHIVE</code></td> <td>O Storage Engine de arquivamento. Consulte a Seção 15.5, “The ARCHIVE Storage Engine”.</td> </tr><tr> <td><code>EXAMPLE</code></td> <td>Um Engine de exemplo. Consulte a Seção 15.9, “The EXAMPLE Storage Engine”.</td> </tr><tr> <td><code>FEDERATED</code></td> <td>Storage Engine que acessa tabelas remotas. Consulte a Seção 15.8, “The FEDERATED Storage Engine”.</td> </tr><tr> <td><code>HEAP</code></td> <td>Este é um sinônimo para <code>MEMORY</code>.</td> </tr><tr> <td><code>MERGE</code></td> <td>Uma coleção de tabelas <code>MyISAM</code> usadas como uma única tabela. Também conhecido como <code>MRG_MyISAM</code>. Consulte a Seção 15.7, “The MERGE Storage Engine”.</td> </tr><tr> <td><code>NDB</code></td> <td>Tabelas em Cluster, tolerantes a falhas e baseadas em memória, que suportam Transações e Foreign Keys. Também conhecido como <code>NDBCLUSTER</code>. Consulte o Capítulo 21, <i>MySQL NDB Cluster 7.5 and NDB Cluster 7.6</i>.</td> </tr></tbody></table>

  Por padrão, se um Storage Engine especificado não estiver disponível, a instrução falha com um erro. Você pode anular esse comportamento removendo [`NO_ENGINE_SUBSTITUTION`](sql-mode.html#sqlmode_no_engine_substitution) do SQL mode do servidor (consulte [Seção 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes")) para que o MySQL permita a substituição do Engine especificado pelo Storage Engine padrão. Normalmente, em tais casos, este é o `InnoDB`, que é o valor Default para a variável de sistema [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine). Quando `NO_ENGINE_SUBSTITUTION` está desativado, ocorre um Warning se a especificação do Storage Engine não for honrada.

* `AUTO_INCREMENT`

  O valor `AUTO_INCREMENT` inicial para a tabela. No MySQL 5.7, isso funciona para tabelas `MyISAM`, `MEMORY`, `InnoDB` e `ARCHIVE`. Para definir o primeiro valor Auto-Increment para Engines que não suportam a opção de tabela `AUTO_INCREMENT`, insira uma linha "dummy" com um valor menor do que o valor desejado após a criação da tabela e, em seguida, exclua a linha dummy.

  Para Engines que suportam a opção de tabela `AUTO_INCREMENT` nas instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), você também pode usar `ALTER TABLE tbl_name AUTO_INCREMENT = N` para redefinir o valor `AUTO_INCREMENT`. O valor não pode ser definido como menor do que o valor máximo atualmente na coluna.

* `AVG_ROW_LENGTH`

  Uma aproximação do comprimento médio da linha para sua tabela. Você só precisa definir isso para tabelas grandes com linhas de tamanho variável.

  Ao criar uma tabela `MyISAM`, o MySQL usa o produto das opções `MAX_ROWS` e `AVG_ROW_LENGTH` para decidir o tamanho da tabela resultante. Se você não especificar nenhuma das opções, o tamanho máximo para arquivos de dados e Indexes `MyISAM` é de 256TB por padrão. (Se o seu sistema operacional não suportar arquivos tão grandes, os tamanhos das tabelas serão limitados pelo limite de tamanho do arquivo.) Se você quiser manter os tamanhos dos ponteiros baixos para tornar o Index menor e mais rápido e não precisar realmente de arquivos grandes, você pode diminuir o tamanho padrão do ponteiro definindo a variável de sistema [`myisam_data_pointer_size`](server-system-variables.html#sysvar_myisam_data_pointer_size). (Consulte [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").) Se você quiser que todas as suas tabelas possam crescer acima do limite padrão e estiver disposto a ter suas tabelas um pouco mais lentas e maiores do que o necessário, você pode aumentar o tamanho padrão do ponteiro definindo esta variável. Definir o valor como 7 permite tamanhos de tabela de até 65.536TB.

* `[DEFAULT] CHARACTER SET`

  Especifica um Character Set Default para a tabela. `CHARSET` é um sinônimo para `CHARACTER SET`. Se o nome do Character Set for `DEFAULT`, o Character Set do Database é usado.

* `CHECKSUM`

  Defina isso como 1 se você quiser que o MySQL mantenha um Checksum ativo para todas as linhas (ou seja, um Checksum que o MySQL atualiza automaticamente conforme a tabela muda). Isso torna a atualização da tabela um pouco mais lenta, mas também facilita a localização de tabelas corrompidas. A instrução [`CHECKSUM TABLE`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") relata o Checksum. (`MyISAM` apenas.)

* `[DEFAULT] COLLATE`

  Especifica uma Collation Default para a tabela.

* `COMMENT`

  Um Comment para a tabela, com até 2048 caracteres de comprimento.

  Você pode definir o valor `MERGE_THRESHOLD` do `InnoDB` para uma tabela usando a cláusula `COMMENT` de *`table_option`*. Consulte [Seção 14.8.12, “Configuring the Merge Threshold for Index Pages”](index-page-merge-threshold.html "14.8.12 Configuring the Merge Threshold for Index Pages").

  **Configurando opções NDB_TABLE.**

  No MySQL NDB Cluster 7.5.2 e posterior, o Comment da tabela em uma instrução `CREATE TABLE` ou [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") também pode ser usado para especificar de uma a quatro das opções `NDB_TABLE` (`NOLOGGING`, `READ_BACKUP`, `PARTITION_BALANCE` ou `FULLY_REPLICATED`) como um conjunto de pares nome-valor, separados por vírgulas, se necessário, imediatamente após a String `NDB_TABLE=` que inicia o texto do Comment entre aspas. Um exemplo de instrução usando esta sintaxe é mostrado aqui (texto enfatizado):

  ```sql
  CREATE TABLE t1 (
      c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      c2 VARCHAR(100),
      c3 VARCHAR(100) )
  ENGINE=NDB
  COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
  ```

  Espaços não são permitidos dentro da String entre aspas. A String não diferencia maiúsculas de minúsculas.

  O Comment é exibido como parte da saída de [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"). O texto do Comment também está disponível como a coluna TABLE_COMMENT da tabela [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") do MySQL Information Schema.

  Esta sintaxe de Comment também é suportada com instruções [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") para tabelas `NDB`. Lembre-se de que um Comment de tabela usado com `ALTER TABLE` substitui qualquer Comment existente que a tabela possa ter tido anteriormente.

  A configuração da opção `MERGE_THRESHOLD` em Comments de tabela não é suportada para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") (ela é ignorada).

  Para sintaxe completa e exemplos, consulte [Seção 13.1.18.9, “Configurando Opções de Comentário NDB”](create-table-ndb-comment-options.html "13.1.18.9 Setting NDB Comment Options").

* `COMPRESSION`

  O algoritmo de Compression usado para Page Level Compression para tabelas `InnoDB`. Os valores suportados incluem `Zlib`, `LZ4` e `None`. O atributo `COMPRESSION` foi introduzido com o recurso de Page Compression transparente. A Page Compression é suportada apenas com tabelas `InnoDB` que residem em Tablespaces [file-per-table](glossary.html#glos_file_per_table "file-per-table") e está disponível apenas em plataformas Linux e Windows que suportam Sparse Files e Hole Punching. Para obter mais informações, consulte [Seção 14.9.2, “InnoDB Page Compression”](innodb-page-compression.html "14.9.2 InnoDB Page Compression").

* `CONNECTION`

  A Connection String para uma tabela `FEDERATED`.

  Note

  Versões mais antigas do MySQL usavam uma opção `COMMENT` para a Connection String.

* `DATA DIRECTORY`, `INDEX DIRECTORY`

  Para `InnoDB`, a cláusula `DATA DIRECTORY='directory'` permite criar uma tabela fora do diretório de dados. A variável [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table) deve estar ativada para usar a cláusula `DATA DIRECTORY`. O caminho completo do diretório deve ser especificado. Para obter mais informações, consulte [Seção 14.6.1.2, “Creating Tables Externally”](innodb-create-table-external.html "14.6.1.2 Creating Tables Externally").

  Ao criar tabelas `MyISAM`, você pode usar a cláusula `DATA DIRECTORY='directory'`, a cláusula `INDEX DIRECTORY='directory'` ou ambas. Elas especificam onde colocar o arquivo de dados e o arquivo de Index de uma tabela `MyISAM`, respectivamente. Ao contrário das tabelas `InnoDB`, o MySQL não cria subdiretórios que correspondem ao nome do Database ao criar uma tabela `MyISAM` com uma opção `DATA DIRECTORY` ou `INDEX DIRECTORY`. Os arquivos são criados no diretório especificado.

  A partir do MySQL 5.7.17, você deve ter o privilégio [`FILE`](privileges-provided.html#priv_file) para usar a opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY`.

  Importante

  As opções de nível de tabela `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas para tabelas particionadas. (Bug #32091)

  Essas opções funcionam apenas quando você não está usando a opção [`--skip-symbolic-links`](server-options.html#option_mysqld_symbolic-links). Seu sistema operacional também deve ter uma chamada `realpath()` funcional e Thread-safe. Consulte [Seção 8.12.3.2, “Using Symbolic Links for MyISAM Tables on Unix”](symbolic-links-to-tables.html "8.12.3.2 Using Symbolic Links for MyISAM Tables on Unix"), para informações mais completas.

  Se uma tabela `MyISAM` for criada sem a opção `DATA DIRECTORY`, o arquivo `.MYD` é criado no Database Directory. Por padrão, se o `MyISAM` encontrar um arquivo `.MYD` existente neste caso, ele o sobrescreve. O mesmo se aplica aos arquivos `.MYI` para tabelas criadas sem a opção `INDEX DIRECTORY`. Para suprimir esse comportamento, inicie o servidor com a opção [`--keep_files_on_create`](server-system-variables.html#sysvar_keep_files_on_create), caso em que o `MyISAM` não sobrescreve arquivos existentes e retorna um erro.

  Se uma tabela `MyISAM` for criada com uma opção `DATA DIRECTORY` ou `INDEX DIRECTORY` e um arquivo `.MYD` ou `.MYI` existente for encontrado, o `MyISAM` sempre retorna um erro. Ele não sobrescreve um arquivo no diretório especificado.

  Importante

  Você não pode usar nomes de caminho que contenham o diretório de dados do MySQL com `DATA DIRECTORY` ou `INDEX DIRECTORY`. Isso inclui tabelas particionadas e partições de tabela individuais. (Consulte Bug #32167.)

* `DELAY_KEY_WRITE`

  Defina isso como 1 se você quiser atrasar as atualizações de Key para a tabela até que a tabela seja fechada. Consulte a descrição da variável de sistema [`delay_key_write`](server-system-variables.html#sysvar_delay_key_write) em [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"). (`MyISAM` apenas.)

* `ENCRYPTION`

  Defina a opção `ENCRYPTION` como `'Y'` para ativar a Criptografia de dados em nível de Page para uma tabela `InnoDB` criada em um Tablespace [file-per-table](glossary.html#glos_file_per_table "file-per-table"). Os valores da opção não diferenciam maiúsculas de minúsculas. A opção `ENCRYPTION` foi introduzida com o recurso de Criptografia de Tablespace do `InnoDB`; consulte [Seção 14.14, “InnoDB Data-at-Rest Encryption”](innodb-data-encryption.html "14.14 InnoDB Data-at-Rest Encryption"). Um Plugin `keyring` deve ser instalado e configurado antes que a Criptografia possa ser ativada.

  A opção `ENCRYPTION` é suportada apenas pelo Storage Engine `InnoDB`; portanto, ela funciona apenas se o Storage Engine padrão for `InnoDB`, ou se a instrução `CREATE TABLE` também especificar `ENGINE=InnoDB`. Caso contrário, a instrução é rejeitada com [`ER_CHECK_NOT_IMPLEMENTED`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_check_not_implemented).

* `INSERT_METHOD`

  Se você quiser inserir dados em uma tabela `MERGE`, você deve especificar com `INSERT_METHOD` a tabela na qual a linha deve ser inserida. `INSERT_METHOD` é uma opção útil apenas para tabelas `MERGE`. Use um valor de `FIRST` ou `LAST` para que as inserções vão para a primeira ou última tabela, ou um valor de `NO` para impedir inserções. Consulte [Seção 15.7, “The MERGE Storage Engine”](merge-storage-engine.html "15.7 The MERGE Storage Engine").

* `KEY_BLOCK_SIZE`

  Para tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para Key Blocks do Index. O valor é tratado como uma sugestão (hint); um tamanho diferente pode ser usado, se necessário. Um valor `KEY_BLOCK_SIZE` especificado para uma definição de Index individual substitui o valor `KEY_BLOCK_SIZE` no nível da tabela.

  Para tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), `KEY_BLOCK_SIZE` especifica o tamanho da [Page](glossary.html#glos_page "page") em kilobytes a ser usado para tabelas `InnoDB` [comprimidas](glossary.html#glos_compression "compression"). O valor `KEY_BLOCK_SIZE` é tratado como uma sugestão; um tamanho diferente pode ser usado pelo `InnoDB`, se necessário. `KEY_BLOCK_SIZE` só pode ser menor ou igual ao valor de [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size). Um valor de 0 representa o tamanho padrão da Page comprimida, que é metade do valor de [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size). Dependendo de [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size), os valores possíveis de `KEY_BLOCK_SIZE` incluem 0, 1, 2, 4, 8 e 16. Consulte [Seção 14.9.1, “InnoDB Table Compression”](innodb-table-compression.html "14.9.1 InnoDB Table Compression") para obter mais informações.

  A Oracle recomenda ativar [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) ao especificar `KEY_BLOCK_SIZE` para tabelas `InnoDB`. Quando [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) está ativado, a especificação de um valor `KEY_BLOCK_SIZE` inválido retorna um erro. Se [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) estiver desativado, um valor `KEY_BLOCK_SIZE` inválido resulta em um Warning, e a opção `KEY_BLOCK_SIZE` é ignorada.

  A coluna `Create_options` em resposta a [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement") relata a opção `KEY_BLOCK_SIZE` originalmente especificada, assim como [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement").

  O `InnoDB` suporta `KEY_BLOCK_SIZE` apenas no nível da tabela.

  `KEY_BLOCK_SIZE` não é suportado com valores de [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) de 32KB e 64KB. A Table Compression do `InnoDB` não suporta esses tamanhos de Page.

* `MAX_ROWS`

  O número máximo de linhas que você planeja armazenar na tabela. Este não é um limite rígido, mas sim uma sugestão (hint) para o Storage Engine de que a tabela deve ser capaz de armazenar pelo menos esse número de linhas.

  Importante

  O uso de `MAX_ROWS` com tabelas `NDB` para controlar o número de partições de tabela está depreciado a partir do NDB Cluster 7.5.4. Ele permanece suportado em versões posteriores para compatibilidade retroativa, mas está sujeito a remoção em uma futura release. Use `PARTITION_BALANCE` em vez disso; consulte [Configurando opções NDB_TABLE](create-table.html#create-table-comment-ndb-table-options "Setting NDB_TABLE options").

  O Storage Engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") trata esse valor como um máximo. Se você planeja criar tabelas NDB Cluster muito grandes (contendo milhões de linhas), você deve usar esta opção para garantir que o [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") aloque slots de Index suficientes na Hash Table usada para armazenar Hashes das Primary Keys da tabela, definindo `MAX_ROWS = 2 * rows`, onde *`rows`* é o número de linhas que você espera inserir na tabela.

  O valor máximo de `MAX_ROWS` é 4294967295; valores maiores são truncados para este limite.

* `MIN_ROWS`

  O número mínimo de linhas que você planeja armazenar na tabela. O Storage Engine [`MEMORY`](memory-storage-engine.html "15.3 The MEMORY Storage Engine") usa esta opção como uma sugestão sobre o uso de memória.

* `PACK_KEYS`

  Entra em vigor apenas com tabelas `MyISAM`. Defina esta opção como 1 se você quiser ter Indexes menores. Isso geralmente torna as atualizações mais lentas e as leituras mais rápidas. Definir a opção como 0 desativa todo o Packing de Keys. Definir como `DEFAULT` instrui o Storage Engine a empacotar apenas colunas [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") ou [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") longas.

  Se você não usar `PACK_KEYS`, o Default é empacotar Strings, mas não números. Se você usar `PACK_KEYS=1`, os números também são empacotados.

  Ao empacotar Keys de números binários, o MySQL usa Prefix Compression:

  + Cada Key precisa de um Byte extra para indicar quantos Bytes da Key anterior são os mesmos para a próxima Key.

  + O ponteiro para a linha é armazenado em ordem high-byte-first (byte mais significativo primeiro) diretamente após a Key, para melhorar a Compression.

  Isso significa que se você tiver muitas Keys iguais em duas linhas consecutivas, todas as Keys "iguais" seguintes geralmente levam apenas dois bytes (incluindo o ponteiro para a linha). Compare isso com o caso comum, onde as Keys seguintes levam `storage_size_for_key + pointer_size` (onde o tamanho do ponteiro é geralmente 4). Por outro lado, você obtém um benefício significativo da Prefix Compression apenas se tiver muitos números que são iguais. Se todas as Keys forem totalmente diferentes, você usa um Byte a mais por Key, se a Key não for uma Key que pode ter valores `NULL`. (Neste caso, o comprimento da Key empacotada é armazenado no mesmo Byte usado para marcar se uma Key é `NULL`.)

* `PASSWORD`

  Esta opção não é usada. Se você precisar embaralhar seus arquivos `.frm` e torná-los inutilizáveis para qualquer outro MySQL Server, entre em contato com nosso departamento de vendas.

* `ROW_FORMAT`

  Define o formato físico em que as linhas são armazenadas.

  Ao criar uma tabela com [strict mode](glossary.html#glos_strict_mode "strict mode") desativado, o Row Format padrão do Storage Engine é usado se o Row Format especificado não for suportado. O Row Format real da tabela é relatado na coluna `Row_format` em resposta a [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement"). A coluna `Create_options` mostra o Row Format que foi especificado na instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), assim como [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement").

  As opções de Row Format diferem dependendo do Storage Engine usado para a tabela.

  Para tabelas `InnoDB`:

  + O Row Format padrão é definido por [`innodb_default_row_format`](innodb-parameters.html#sysvar_innodb_default_row_format), que tem uma configuração Default de `DYNAMIC`. O Row Format padrão é usado quando a opção `ROW_FORMAT` não está definida ou quando `ROW_FORMAT=DEFAULT` é usado.

    Se a opção `ROW_FORMAT` não estiver definida, ou se `ROW_FORMAT=DEFAULT` for usado, as operações que reconstroem uma tabela também alteram silenciosamente o Row Format da tabela para o Default definido por [`innodb_default_row_format`](innodb-parameters.html#sysvar_innodb_default_row_format). Para obter mais informações, consulte [Defining the Row Format of a Table](innodb-row-format.html#innodb-row-format-defining "Defining the Row Format of a Table").

  + Para um armazenamento `InnoDB` mais eficiente de tipos de dados, especialmente tipos [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"), use `DYNAMIC`. Consulte [DYNAMIC Row Format](innodb-row-format.html#innodb-row-format-dynamic "DYNAMIC Row Format") para os requisitos associados ao Row Format `DYNAMIC`.

  + Para ativar a Compression para tabelas `InnoDB`, especifique `ROW_FORMAT=COMPRESSED`. Consulte [Seção 14.9, “InnoDB Table and Page Compression”](innodb-compression.html "14.9 InnoDB Table and Page Compression") para os requisitos associados ao Row Format `COMPRESSED`.

  + O Row Format usado em versões mais antigas do MySQL ainda pode ser solicitado especificando o Row Format `REDUNDANT`.

  + Ao especificar uma cláusula `ROW_FORMAT` não padrão, considere também ativar a opção de configuração [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode).

  + `ROW_FORMAT=FIXED` não é suportado. Se `ROW_FORMAT=FIXED` for especificado enquanto [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) estiver desativado, o `InnoDB` emite um Warning e assume `ROW_FORMAT=DYNAMIC`. Se `ROW_FORMAT=FIXED` for especificado enquanto [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) estiver ativado, que é o Default, o `InnoDB` retorna um erro.

  + Para obter informações adicionais sobre Row Formats do `InnoDB`, consulte [Seção 14.11, “InnoDB Row Formats”](innodb-row-format.html "14.11 InnoDB Row Formats").

  Para tabelas `MyISAM`, o valor da opção pode ser `FIXED` ou `DYNAMIC` para Row Format de comprimento estático ou variável. [**myisampack**](myisampack.html "4.6.5 myisampack — Generate Compressed, Read-Only MyISAM Tables") define o tipo como `COMPRESSED`. Consulte [Seção 15.2.3, “MyISAM Table Storage Formats”](myisam-table-formats.html "15.2.3 MyISAM Table Storage Formats").

  Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), o `ROW_FORMAT` Default no MySQL NDB Cluster 7.5.1 e posterior é `DYNAMIC`. (Anteriormente, era `FIXED`.)

* `STATS_AUTO_RECALC`

  Especifica se deve recalcular automaticamente [persistent statistics](glossary.html#glos_persistent_statistics "persistent statistics") para uma tabela `InnoDB`. O valor `DEFAULT` faz com que a configuração de persistent statistics para a tabela seja determinada pela opção de configuração [`innodb_stats_auto_recalc`](innodb-parameters.html#sysvar_innodb_stats_auto_recalc). O valor `1` faz com que as estatísticas sejam recalculadas quando 10% dos dados na tabela forem alterados. O valor `0` impede o recálculo automático para esta tabela; com esta configuração, emita uma instrução [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") para recalcular as estatísticas após fazer alterações substanciais na tabela. Para obter mais informações sobre o recurso de persistent statistics, consulte [Seção 14.8.11.1, “Configuring Persistent Optimizer Statistics Parameters”](innodb-persistent-stats.html "14.8.11.1 Configuring Persistent Optimizer Statistics Parameters").

* `STATS_PERSISTENT`

  Especifica se deve ativar [persistent statistics](glossary.html#glos_persistent_statistics "persistent statistics") para uma tabela `InnoDB`. O valor `DEFAULT` faz com que a configuração de persistent statistics para a tabela seja determinada pela opção de configuração [`innodb_stats_persistent`](innodb-parameters.html#sysvar_innodb_stats_persistent). O valor `1` ativa persistent statistics para a tabela, enquanto o valor `0` desativa este recurso. Após ativar persistent statistics através de uma instrução `CREATE TABLE` ou `ALTER TABLE`, emita uma instrução [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") para calcular as estatísticas, após carregar dados representativos na tabela. Para obter mais informações sobre o recurso de persistent statistics, consulte [Seção 14.8.11.1, “Configuring Persistent Optimizer Statistics Parameters”](innodb-persistent-stats.html "14.8.11.1 Configuring Persistent Optimizer Statistics Parameters").

* `STATS_SAMPLE_PAGES`

  O número de Index Pages a serem amostradas ao estimar a Cardinality e outras estatísticas para uma coluna indexada, como as calculadas por [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"). Para obter mais informações, consulte [Seção 14.8.11.1, “Configuring Persistent Optimizer Statistics Parameters”](innodb-persistent-stats.html "14.8.11.1 Configuring Persistent Optimizer Statistics Parameters").

* `TABLESPACE`

  A cláusula `TABLESPACE` pode ser usada para criar uma tabela [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") em um General Tablespace existente, um Tablespace file-per-table, ou o System Tablespace.

  ```sql
  CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name
  ```

  O General Tablespace que você especificar deve existir antes de usar a cláusula `TABLESPACE`. Para obter informações sobre General Tablespaces, consulte [Seção 14.6.3.3, “General Tablespaces”](general-tablespaces.html "14.6.3.3 General Tablespaces").

  O `tablespace_name` é um identificador que diferencia maiúsculas de minúsculas. Pode estar entre aspas ou sem aspas. O caractere barra (`/`) não é permitido. Nomes que começam com "innodb_" são reservados para uso especial.

  Para criar uma tabela no System Tablespace, especifique `innodb_system` como o nome do Tablespace.

  ```sql
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_system
  ```

  Usando `TABLESPACE [=] innodb_system`, você pode colocar uma tabela de qualquer Row Format não comprimido no System Tablespace, independentemente da configuração [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table). Por exemplo, você pode adicionar uma tabela com `ROW_FORMAT=DYNAMIC` ao System Tablespace usando `TABLESPACE [=] innodb_system`.

  Para criar uma tabela em um Tablespace file-per-table, especifique `innodb_file_per_table` como o nome do Tablespace.

  ```sql
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_file_per_table
  ```

  Note

  Se [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table) estiver ativado, você não precisa especificar `TABLESPACE=innodb_file_per_table` para criar um Tablespace `InnoDB` file-per-table. As tabelas `InnoDB` são criadas em Tablespaces file-per-table por padrão quando [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table) está ativado.

  Note

  O suporte para a criação de partições de tabela em Tablespaces `InnoDB` compartilhados está depreciado no MySQL 5.7.24; espere que seja removido em uma futura versão do MySQL. Tablespaces compartilhados incluem o `InnoDB` System Tablespace e General Tablespaces.

  A cláusula `DATA DIRECTORY` é permitida com `CREATE TABLE ... TABLESPACE=innodb_file_per_table`, mas não é suportada para uso em combinação com a opção `TABLESPACE`.

  Note

  O suporte para as cláusulas `TABLESPACE = innodb_file_per_table` e `TABLESPACE = innodb_temporary` com [`CREATE TEMPORARY TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") está depreciado a partir do MySQL 5.7.24; espere que seja removido em uma futura versão do MySQL.

  A opção de tabela `STORAGE` é empregada apenas com tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). `STORAGE` determina o tipo de armazenamento usado e pode ser `DISK` ou `MEMORY`.

  `TABLESPACE ... STORAGE DISK` atribui uma tabela a um Tablespace NDB Cluster Disk Data. `STORAGE DISK` não pode ser usado em `CREATE TABLE` a menos que seja precedido por `TABLESPACE` *`tablespace_name`*.

  Para `STORAGE MEMORY`, o nome do Tablespace é opcional, assim, você pode usar `TABLESPACE tablespace_name STORAGE MEMORY` ou simplesmente `STORAGE MEMORY` para especificar explicitamente que a tabela está em memória.

  Consulte [Seção 21.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables"), para obter mais informações.

* [`UNION`](union.html "13.2.9.3 UNION Clause")

  Usado para acessar uma coleção de tabelas `MyISAM` idênticas como uma só. Isso funciona apenas com tabelas `MERGE`. Consulte [Seção 15.7, “The MERGE Storage Engine”](merge-storage-engine.html "15.7 The MERGE Storage Engine").

  Você deve ter os privilégios [`SELECT`](privileges-provided.html#priv_select), [`UPDATE`](privileges-provided.html#priv_update) e [`DELETE`](privileges-provided.html#priv_delete) para as tabelas que você mapeia para uma tabela `MERGE`.

  Note

  Anteriormente, todas as tabelas usadas tinham que estar no mesmo Database que a própria tabela `MERGE`. Essa restrição não se aplica mais.

#### Particionamento de Tabela

As *`partition_options`* podem ser usadas para controlar o Particionamento da tabela criada com [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

Nem todas as opções mostradas na sintaxe para *`partition_options`* no início desta seção estão disponíveis para todos os tipos de Particionamento. Consulte as listagens para os seguintes tipos individuais para obter informações específicas de cada tipo, e consulte [Capítulo 22, *Partitioning*](partitioning.html "Chapter 22 Partitioning"), para obter informações mais completas sobre o funcionamento e usos do Particionamento no MySQL, bem como exemplos adicionais de criação de tabela e outras instruções relacionadas ao Particionamento do MySQL.

As Partitions podem ser modificadas, mescladas, adicionadas a tabelas e descartadas de tabelas. Para informações básicas sobre as instruções MySQL para realizar essas tarefas, consulte [Seção 13.1.8, “Instrução ALTER TABLE”](alter-table.html "13.1.8 ALTER TABLE Statement"). Para descrições e exemplos mais detalhados, consulte [Seção 22.3, “Partition Management”](partitioning-management.html "22.3 Partition Management").

* `PARTITION BY`

  Se usada, uma cláusula *`partition_options`* começa com `PARTITION BY`. Esta cláusula contém a função que é usada para determinar a Partition; a função retorna um valor inteiro que varia de 1 a *`num`*, onde *`num`* é o número de Partitions. (O número máximo de Partitions definidas pelo usuário que uma tabela pode conter é 1024; o número de Subpartitions — discutido posteriormente nesta seção — está incluído neste máximo.)

  Note

  A expressão (*`expr`*) usada em uma cláusula `PARTITION BY` não pode se referir a nenhuma coluna que não esteja na tabela que está sendo criada; tais referências não são especificamente permitidas e fazem com que a instrução falhe com um erro. (Bug #29444)

* `HASH(expr)`

  Faz o Hash de uma ou mais colunas para criar uma Key para colocar e localizar linhas. *`expr`* é uma expressão usando uma ou mais colunas da tabela. Esta pode ser qualquer expressão MySQL válida (incluindo funções MySQL) que produza um único valor inteiro. Por exemplo, ambas são instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") válidas usando `PARTITION BY HASH`:

  ```sql
  CREATE TABLE t1 (col1 INT, col2 CHAR(5))
      PARTITION BY HASH(col1);

  CREATE TABLE t1 (col1 INT, col2 CHAR(5), col3 DATETIME)
      PARTITION BY HASH ( YEAR(col3) );
  ```

  Você não pode usar as cláusulas `VALUES LESS THAN` ou `VALUES IN` com `PARTITION BY HASH`.

  `PARTITION BY HASH` usa o resto de *`expr`* dividido pelo número de Partitions (ou seja, o Módulo). Para exemplos e informações adicionais, consulte [Seção 22.2.4, “HASH Partitioning”](partitioning-hash.html "22.2.4 HASH Partitioning").

  A palavra-chave `LINEAR` implica um algoritmo um tanto diferente. Neste caso, o número da Partition na qual uma linha é armazenada é calculado como resultado de uma ou mais operações lógicas [`AND`](logical-operators.html#operator_and). Para discussão e exemplos de Hashing linear, consulte [Seção 22.2.4.1, “LINEAR HASH Partitioning”](partitioning-linear-hash.html "22.2.4.1 LINEAR HASH Partitioning").

* `KEY(column_list)`

  Isso é semelhante a `HASH`, exceto que o MySQL fornece a função de Hashing para garantir uma distribuição uniforme dos dados. O argumento *`column_list`* é simplesmente uma lista de 1 ou mais colunas da tabela (máximo: 16). Este exemplo mostra uma tabela simples particionada por Key, com 4 Partitions:

  ```sql
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY KEY(col3)
      PARTITIONS 4;
  ```

  Para tabelas que são particionadas por Key, você pode empregar o Particionamento linear usando a palavra-chave `LINEAR`. Isso tem o mesmo efeito que com tabelas que são particionadas por `HASH`. Ou seja, o número da Partition é encontrado usando o operador [`&`](bit-functions.html#operator_bitwise-and) em vez do Módulo (consulte [Seção 22.2.4.1, “LINEAR HASH Partitioning”](partitioning-linear-hash.html "22.2.4.1 LINEAR HASH Partitioning") e [Seção 22.2.5, “KEY Partitioning”](partitioning-key.html "22.2.5 KEY Partitioning"), para detalhes). Este exemplo usa Particionamento linear por Key para distribuir dados entre 5 Partitions:

  ```sql
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY LINEAR KEY(col3)
      PARTITIONS 5;
  ```

  A opção `ALGORITHM={1 | 2}` é suportada com `[SUB]PARTITION BY [LINEAR] KEY`. `ALGORITHM=1` faz com que o servidor use as mesmas funções de Key-hashing do MySQL 5.1; `ALGORITHM=2` significa que o servidor emprega as funções de Key-hashing usadas por padrão para novas tabelas particionadas por `KEY` no MySQL 5.7 e posterior. Não especificar a opção tem o mesmo efeito que usar `ALGORITHM=2`. Esta opção destina-se principalmente ao uso ao fazer Upgrade de tabelas particionadas por `[LINEAR] KEY` do MySQL 5.1 para versões posteriores do MySQL. Para obter mais informações, consulte [Seção 13.1.8.1, “ALTER TABLE Partition Operations”](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations").

  [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") escreve esta opção envolta em Comments versionados, assim:

  ```sql
  CREATE TABLE t1 (a INT)
  /*!50100 PARTITION BY KEY */ /*!50611 ALGORITHM = 1 */ /*!50100 ()
        PARTITIONS 3 */
  ```

  Isso faz com que o MySQL 5.6.10 e servidores anteriores ignorem a opção, o que de outra forma causaria um erro de sintaxe nessas versões.

  `ALGORITHM=1` é exibido quando necessário na saída de [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") usando Comments versionados da mesma maneira que [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"). `ALGORITHM=2` é sempre omitido da saída de `SHOW CREATE TABLE`, mesmo que esta opção tenha sido especificada ao criar a tabela original.

  Você não pode usar as cláusulas `VALUES LESS THAN` ou `VALUES IN` com `PARTITION BY KEY`.

* `RANGE(expr)`

  Neste caso, *`expr`* mostra um Range de valores usando um conjunto de operadores `VALUES LESS THAN`. Ao usar Range Partitioning, você deve definir pelo menos uma Partition usando `VALUES LESS THAN`. Você não pode usar `VALUES IN` com Range Partitioning.

  Note

  Para tabelas particionadas por `RANGE`, `VALUES LESS THAN` deve ser usado com um valor literal inteiro ou uma expressão que avalie para um único valor inteiro. No MySQL 5.7, você pode superar essa limitação em uma tabela que é definida usando `PARTITION BY RANGE COLUMNS`, conforme descrito posteriormente nesta seção.

  Suponha que você tenha uma tabela que deseja particionar em uma coluna contendo valores de ano, de acordo com o seguinte esquema.

  <table summary="Um esquema de Particionamento de tabela baseado em uma coluna contendo valores de ano, conforme descrito no texto precedente. A tabela lista os números das Partitions e o Range de anos correspondente."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Número da Partition:</th> <th>Range de Anos:</th> </tr></thead><tbody><tr> <td>0</td> <td>1990 e anteriores</td> </tr><tr> <td>1</td> <td>1991 a 1994</td> </tr><tr> <td>2</td> <td>1995 a 1998</td> </tr><tr> <td>3</td> <td>1999 a 2002</td> </tr><tr> <td>4</td> <td>2003 a 2005</td> </tr><tr> <td>5</td> <td>2006 e posteriores</td> </tr></tbody></table>

  Uma tabela que implementa tal esquema de Particionamento pode ser realizada pela instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") mostrada aqui:

  ```sql
  CREATE TABLE t1 (
      year_col  INT,
      some_data INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999),
      PARTITION p3 VALUES LESS THAN (2002),
      PARTITION p4 VALUES LESS THAN (2006),
      PARTITION p5 VALUES LESS THAN MAXVALUE
  );
  ```

  As instruções `PARTITION ... VALUES LESS THAN ...` funcionam de forma consecutiva. `VALUES LESS THAN MAXVALUE` funciona para especificar valores "restantes" que são maiores do que o valor máximo especificado de outra forma.

  As cláusulas `VALUES LESS THAN` funcionam sequencialmente de maneira semelhante à das partes `case` de um bloco `switch ... case` (como encontrado em muitas linguagens de programação, como C, Java e PHP). Ou seja, as cláusulas devem ser organizadas de tal forma que o limite superior especificado em cada `VALUES LESS THAN` sucessivo seja maior do que o anterior, com aquele que referencia `MAXVALUE` vindo por último na lista.

* `RANGE COLUMNS(column_list)`

  Esta variante de `RANGE` facilita a Partition Pruning para Queries que usam condições de Range em múltiplas colunas (ou seja, tendo condições como `WHERE a = 1 AND b < 10` ou `WHERE a = 1 AND b = 10 AND c < 10`). Ela permite que você especifique Ranges de valores em múltiplas colunas usando uma lista de colunas na cláusula `COLUMNS` e um conjunto de valores de coluna em cada cláusula de definição de Partition `PARTITION ... VALUES LESS THAN (value_list)`. (No caso mais simples, este conjunto consiste em uma única coluna.) O número máximo de colunas que podem ser referenciadas em *`column_list`* e *`value_list`* é 16.

  A *`column_list`* usada na cláusula `COLUMNS` pode conter apenas nomes de colunas; cada coluna na lista deve ser um dos seguintes tipos de dados MySQL: os tipos inteiros; os tipos String; e os tipos de coluna de tempo ou data. Colunas usando tipos de dados `BLOB`, `TEXT`, `SET`, `ENUM`, `BIT` ou espaciais não são permitidas; colunas que usam tipos de números de ponto flutuante também não são permitidas. Você também não pode usar funções ou expressões aritméticas na cláusula `COLUMNS`.

  A cláusula `VALUES LESS THAN` usada em uma definição de Partition deve especificar um valor literal para cada coluna que aparece na cláusula `COLUMNS()`; ou seja, a lista de valores usada para cada cláusula `VALUES LESS THAN` deve conter o mesmo número de valores que o número de colunas listadas na cláusula `COLUMNS`. Uma tentativa de usar mais ou menos valores em uma cláusula `VALUES LESS THAN` do que há na cláusula `COLUMNS` faz com que a instrução falhe com o erro Inconsistency in usage of column lists for partitioning.... Você não pode usar `NULL` para nenhum valor que apareça em `VALUES LESS THAN`. É possível usar `MAXVALUE` mais de uma vez para uma determinada coluna diferente da primeira, conforme mostrado neste exemplo:

  ```sql
  CREATE TABLE rc (
      a INT NOT NULL,
      b INT NOT NULL
  )
  PARTITION BY RANGE COLUMNS(a,b) (
      PARTITION p0 VALUES LESS THAN (10,5),
      PARTITION p1 VALUES LESS THAN (20,10),
      PARTITION p2 VALUES LESS THAN (50,MAXVALUE),
      PARTITION p3 VALUES LESS THAN (65,MAXVALUE),
      PARTITION p4 VALUES LESS THAN (MAXVALUE,MAXVALUE)
  );
  ```

  Cada valor usado em uma lista de valores `VALUES LESS THAN` deve corresponder exatamente ao tipo da coluna correspondente; nenhuma conversão é feita. Por exemplo, você não pode usar a String `'1'` para um valor que corresponda a uma coluna que usa um tipo inteiro (você deve usar o numeral `1` em vez disso), nem pode usar o numeral `1` para um valor que corresponda a uma coluna que usa um tipo String (em tal caso, você deve usar uma String entre aspas: `'1'`).

  Para obter mais informações, consulte [Seção 22.2.1, “RANGE Partitioning”](partitioning-range.html "22.2.1 RANGE Partitioning") e [Seção 22.4, “Partition Pruning”](partitioning-pruning.html "22.4 Partition Pruning").

* `LIST(expr)`

  Isso é útil ao atribuir Partitions com base em uma coluna da tabela com um conjunto restrito de valores possíveis, como um código de estado ou país. Nesses casos, todas as linhas pertencentes a um determinado estado ou país podem ser atribuídas a uma única Partition, ou uma Partition pode ser reservada para um determinado conjunto de estados ou países. É semelhante a `RANGE`, exceto que apenas `VALUES IN` pode ser usado para especificar valores permitidos para cada Partition.

  `VALUES IN` é usado com uma lista de valores a serem correspondidos. Por exemplo, você poderia criar um esquema de Particionamento como o seguinte:

  ```sql
  CREATE TABLE client_firms (
      id   INT,
      name VARCHAR(35)
  )
  PARTITION BY LIST (id) (
      PARTITION r0 VALUES IN (1, 5, 9, 13, 17, 21),
      PARTITION r1 VALUES IN (2, 6, 10, 14, 18, 22),
      PARTITION r2 VALUES IN (3, 7, 11, 15, 19, 23),
      PARTITION r3 VALUES IN (4, 8, 12, 16, 20, 24)
  );
  ```

  Ao usar List Partitioning, você deve definir pelo menos uma Partition usando `VALUES IN`. Você não pode usar `VALUES LESS THAN` com `PARTITION BY LIST`.

  Note

  Para tabelas particionadas por `LIST`, a lista de valores usada com `VALUES IN` deve consistir apenas em valores inteiros. No MySQL 5.7, você pode superar essa limitação usando Particionamento por `LIST COLUMNS`, que é descrito posteriormente nesta seção.

* `LIST COLUMNS(column_list)`

  Esta variante de `LIST` facilita a Partition Pruning para Queries que usam condições de comparação em múltiplas colunas (ou seja, tendo condições como `WHERE a = 5 AND b = 5` ou `WHERE a = 1 AND b = 10 AND c = 5`). Ela permite que você especifique valores em múltiplas colunas usando uma lista de colunas na cláusula `COLUMNS` e um conjunto de valores de coluna em cada cláusula de definição de Partition `PARTITION ... VALUES IN (value_list)`.

  As regras que governam os tipos de dados para a Column List usada em `LIST COLUMNS(column_list)` e a Value List usada em `VALUES IN(value_list)` são as mesmas que para a Column List usada em `RANGE COLUMNS(column_list)` e a Value List usada em `VALUES LESS THAN(value_list)`, respectivamente, exceto que na cláusula `VALUES IN`, `MAXVALUE` não é permitido, e você pode usar `NULL`.

  Há uma diferença importante entre a lista de valores usada para `VALUES IN` com `PARTITION BY LIST COLUMNS` em comparação com quando é usada com `PARTITION BY LIST`. Quando usada com `PARTITION BY LIST COLUMNS`, cada elemento na cláusula `VALUES IN` deve ser um *conjunto* de valores de coluna; o número de valores em cada conjunto deve ser o mesmo que o número de colunas usadas na cláusula `COLUMNS`, e os tipos de dados desses valores devem corresponder aos das colunas (e ocorrer na mesma ordem). No caso mais simples, o conjunto consiste em uma única coluna. O número máximo de colunas que podem ser usadas em *`column_list`* e nos elementos que compõem a *`value_list`* é 16.

  A tabela definida pela seguinte instrução `CREATE TABLE` fornece um exemplo de uma tabela usando Particionamento `LIST COLUMNS`:

  ```sql
  CREATE TABLE lc (
      a INT NULL,
      b INT NULL
  )
  PARTITION BY LIST COLUMNS(a,b) (
      PARTITION p0 VALUES IN( (0,0), (NULL,NULL) ),
      PARTITION p1 VALUES IN( (0,1), (0,2), (0,3), (1,1), (1,2) ),
      PARTITION p2 VALUES IN( (1,0), (2,0), (2,1), (3,0), (3,1) ),
      PARTITION p3 VALUES IN( (1,3), (2,2), (2,3), (3,2), (3,3) )
  );
  ```

* `PARTITIONS num`

  O número de Partitions pode ser opcionalmente especificado com uma cláusula `PARTITIONS num`, onde *`num`* é o número de Partitions. Se esta cláusula *e* quaisquer cláusulas `PARTITION` forem usadas, *`num`* deve ser igual ao número total de quaisquer Partitions que são declaradas usando cláusulas `PARTITION`.

  Note

  Independentemente de você usar ou não uma cláusula `PARTITIONS` ao criar uma tabela que é particionada por `RANGE` ou `LIST`, você ainda deve incluir pelo menos uma cláusula `PARTITION VALUES` na definição da tabela (veja abaixo).

* `SUBPARTITION BY`

  Uma Partition pode ser opcionalmente dividida em um número de Subpartitions. Isso pode ser indicado usando a cláusula opcional `SUBPARTITION BY`. O Subpartitioning pode ser feito por `HASH` ou `KEY`. Qualquer um destes pode ser `LINEAR`. Eles funcionam da mesma forma que o descrito anteriormente para os tipos de Particionamento equivalentes. (Não é possível fazer Subpartitioning por `LIST` ou `RANGE`.)

  O número de Subpartitions pode ser indicado usando a palavra-chave `SUBPARTITIONS` seguida por um valor inteiro.

* A verificação rigorosa do valor usado nas cláusulas `PARTITIONS` ou `SUBPARTITIONS` é aplicada e este valor deve aderir às seguintes regras:

  + O valor deve ser um inteiro positivo e não zero.
  + Nenhum zero à esquerda é permitido.
  + O valor deve ser um Literal Integer e não pode ser uma expressão. Por exemplo, `PARTITIONS 0.2E+01` não é permitido, mesmo que `0.2E+01` avalie para `2`. (Bug #15890)

* `partition_definition`

  Cada Partition pode ser definida individualmente usando uma cláusula *`partition_definition`*. As partes individuais que compõem esta cláusula são as seguintes:

  + `PARTITION partition_name`

    Especifica um nome lógico para a Partition.

  + `VALUES`

    Para Range Partitioning, cada Partition deve incluir uma cláusula `VALUES LESS THAN`; para List Partitioning, você deve especificar uma cláusula `VALUES IN` para cada Partition. Isso é usado para determinar quais linhas devem ser armazenadas nesta Partition. Consulte as discussões sobre tipos de Particionamento em [Capítulo 22, *Partitioning*](partitioning.html "Chapter 22 Partitioning"), para exemplos de sintaxe.

  + `[STORAGE] ENGINE`

    O Partitioning Handler aceita uma opção `[STORAGE] ENGINE` para `PARTITION` e `SUBPARTITION`. Atualmente, a única maneira de usar isso é definir todas as Partitions ou todas as Subpartitions para o mesmo Storage Engine, e uma tentativa de definir diferentes Storage Engines para Partitions ou Subpartitions na mesma tabela levanta o erro ERROR 1469 (HY000): The mix of handlers in the partitions is not permitted in this version of MySQL. Esperamos suspender esta restrição no Particionamento em uma futura versão do MySQL.

  + `COMMENT`

    Uma cláusula `COMMENT` opcional pode ser usada para especificar uma String que descreve a Partition. Exemplo:

    ```sql
    COMMENT = 'Data for the years previous to 1999'
    ```

    O comprimento máximo para um Comment de Partition é de 1024 caracteres.

  + `DATA DIRECTORY` e `INDEX DIRECTORY`

    `DATA DIRECTORY` e `INDEX DIRECTORY` podem ser usados para indicar o diretório onde, respectivamente, os dados e Indexes para esta Partition devem ser armazenados. Tanto o `data_dir` quanto o `index_dir` devem ser nomes de caminhos de sistema absolutos.

    A partir do MySQL 5.7.17, você deve ter o privilégio [`FILE`](privileges-provided.html#priv_file) para usar a opção de Partition `DATA DIRECTORY` ou `INDEX DIRECTORY`.

    Exemplo:

    ```sql
    CREATE TABLE th (id INT, name VARCHAR(30), adate DATE)
    PARTITION BY LIST(YEAR(adate))
    (
      PARTITION p1999 VALUES IN (1995, 1999, 2003)
        DATA DIRECTORY = '/var/appdata/95/data'
        INDEX DIRECTORY = '/var/appdata/95/idx',
      PARTITION p2000 VALUES IN (1996, 2000, 2004)
        DATA DIRECTORY = '/var/appdata/96/data'
        INDEX DIRECTORY = '/var/appdata/96/idx',
      PARTITION p2001 VALUES IN (1997, 2001, 2005)
        DATA DIRECTORY = '/var/appdata/97/data'
        INDEX DIRECTORY = '/var/appdata/97/idx',
      PARTITION p2002 VALUES IN (1998, 2002, 2006)
        DATA DIRECTORY = '/var/appdata/98/data'
        INDEX DIRECTORY = '/var/appdata/98/idx'
    );
    ```

    `DATA DIRECTORY` e `INDEX DIRECTORY` se comportam da mesma forma que na cláusula *`table_option`* da instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") usada para tabelas `MyISAM`.

    Um Data Directory e um Index Directory podem ser especificados por Partition. Se não forem especificados, os dados e Indexes são armazenados por padrão no Database Directory da tabela.

    No Windows, as opções `DATA DIRECTORY` e `INDEX DIRECTORY` não são suportadas para Partitions ou Subpartitions individuais de tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), e a opção `INDEX DIRECTORY` não é suportada para Partitions ou Subpartitions individuais de tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"). Essas opções são ignoradas no Windows, exceto que um Warning é gerado. (Bug #30459)

    Note

    As opções `DATA DIRECTORY` e `INDEX DIRECTORY` são ignoradas ao criar tabelas particionadas se [`NO_DIR_IN_CREATE`](sql-mode.html#sqlmode_no_dir_in_create) estiver em vigor. (Bug #24633)

  + `MAX_ROWS` e `MIN_ROWS`

    Podem ser usados para especificar, respectivamente, o número máximo e mínimo de linhas a serem armazenadas na Partition. Os valores para *`max_number_of_rows`* e *`min_number_of_rows`* devem ser inteiros positivos. Assim como as opções de nível de tabela com os mesmos nomes, estas atuam apenas como "sugestões" para o servidor e não são limites rígidos.

  + `TABLESPACE`

    Pode ser usado para designar um Tablespace para a Partition. Suportado pelo NDB Cluster. Para tabelas `InnoDB`, pode ser usado para designar um Tablespace file-per-table para a Partition especificando `` TABLESPACE `innodb_file_per_table` ``. Todas as Partitions devem pertencer ao mesmo Storage Engine.

    Note

    O suporte para colocar Partitions de tabela `InnoDB` em Tablespaces `InnoDB` compartilhados está depreciado no MySQL 5.7.24; espere que seja removido em uma futura versão do MySQL. Tablespaces compartilhados incluem o `InnoDB` System Tablespace e General Tablespaces.

    A opção de tabela `STORAGE` é empregada apenas com tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). `STORAGE` determina o tipo de armazenamento usado e pode ser `DISK` ou `MEMORY`.

    `TABLESPACE ... STORAGE DISK` atribui uma tabela a um Tablespace NDB Cluster Disk Data. `STORAGE DISK` não pode ser usado em `CREATE TABLE` a menos que seja precedido por `TABLESPACE` *`tablespace_name`*.

    Para `STORAGE MEMORY`, o nome do Tablespace é opcional, portanto, você pode usar `TABLESPACE tablespace_name STORAGE MEMORY` ou simplesmente `STORAGE MEMORY` para especificar explicitamente que a tabela está em memória.

    Consulte [Seção 21.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables"), para obter mais informações.

* `subpartition_definition`

  A definição de Partition pode opcionalmente conter uma ou mais cláusulas *`subpartition_definition`*. Cada uma delas consiste no mínimo em `SUBPARTITION name`, onde *`name`* é um identificador para a Subpartition. Exceto pela substituição da palavra-chave `PARTITION` por `SUBPARTITION`, a sintaxe para uma definição de Subpartition é idêntica à de uma definição de Partition.

  O Subpartitioning deve ser feito por `HASH` ou `KEY`, e só pode ser feito em Partitions `RANGE` ou `LIST`. Consulte [Seção 22.2.6, “Subpartitioning”](partitioning-subpartitions.html "22.2.6 Subpartitioning").

**Particionamento por Colunas Geradas**

O Particionamento por Generated Columns é permitido. Por exemplo:

```sql
CREATE TABLE t1 (
  s1 INT,
  s2 INT AS (EXP(s1)) STORED
)
PARTITION BY LIST (s2) (
  PARTITION p1 VALUES IN (1)
);
```

O Particionamento vê uma Generated Column como uma coluna regular, o que permite soluções alternativas para limitações em funções que não são permitidas para Particionamento (consulte [Seção 22.6.3, “Partitioning Limitations Relating to Functions”](partitioning-limitations-functions.html "22.6.3 Partitioning Limitations Relating to Functions")). O exemplo anterior demonstra esta técnica: [`EXP()`](mathematical-functions.html#function_exp) não pode ser usado diretamente na cláusula `PARTITION BY`, mas uma Generated Column definida usando [`EXP()`](mathematical-functions.html#function_exp) é permitida.