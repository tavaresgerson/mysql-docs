### 24.3.24 A Tabela STATISTICS do INFORMATION_SCHEMA

A tabela [`STATISTICS`](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table") fornece informações sobre Indexes de tabela.

A tabela [`STATISTICS`](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table") possui as seguintes colunas:

* `TABLE_CATALOG`

  O nome do Catalog ao qual pertence a tabela que contém o Index. Este valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do Schema (Database) ao qual pertence a tabela que contém o Index.

* `TABLE_NAME`

  O nome da tabela que contém o Index.

* `NON_UNIQUE`

  0 se o Index não puder conter duplicatas, 1 se puder.

* `INDEX_SCHEMA`

  O nome do Schema (Database) ao qual pertence o Index.

* `INDEX_NAME`

  O nome do Index. Se o Index for a Primary Key, o nome é sempre `PRIMARY`.

* `SEQ_IN_INDEX`

  O número sequencial da coluna no Index, começando em 1.

* `COLUMN_NAME`

  O nome da coluna. Consulte também a descrição para a coluna `EXPRESSION`.

* `COLLATION`

  Como a coluna é ordenada no Index. Pode ter os valores `A` (ascendente), `D` (descendente) ou `NULL` (não ordenada).

* `CARDINALITY`

  Uma estimativa do número de valores exclusivos no Index. Para atualizar este número, execute [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") ou (para tabelas `MyISAM`) [**myisamchk -a**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").

  `CARDINALITY` é contado com base em estatísticas armazenadas como inteiros, portanto o valor não é necessariamente exato, mesmo para tabelas pequenas. Quanto maior a Cardinality, maior a chance de o MySQL usar o Index ao realizar JOINs.

* `SUB_PART`

  O prefixo do Index. Ou seja, o número de caracteres indexados se a coluna for apenas parcialmente indexada, `NULL` se a coluna inteira estiver indexada.

  **Nota**

  Os *limites* de prefixo são medidos em bytes. No entanto, os *comprimentos* de prefixo para especificações de Index nas instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") e [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") são interpretados como o número de caracteres para tipos de string não binários ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types")) e número de bytes para tipos de string binários ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")). Leve isso em consideração ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

  Para obter informações adicionais sobre prefixos de Index, consulte [Section 8.3.4, “Column Indexes”](column-indexes.html "8.3.4 Column Indexes") e [Section 13.1.14, “CREATE INDEX Statement”](create-index.html "13.1.14 CREATE INDEX Statement").

* `PACKED`

  Indica como a Key está empacotada. `NULL` se não estiver.

* `NULLABLE`

  Contém `YES` se a coluna puder conter valores `NULL` e `''` caso contrário.

* `INDEX_TYPE`

  O método de Index usado (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

* `COMMENT`

  Informações sobre o Index não descritas em sua própria coluna, como `disabled` (desabilitado) se o Index estiver desabilitado.

* `INDEX_COMMENT`

  Qualquer comentário fornecido para o Index com um atributo `COMMENT` quando o Index foi criado.

#### Notas

* Não há uma tabela `INFORMATION_SCHEMA` padrão para Indexes. A lista de colunas do MySQL é semelhante ao que o SQL Server 2000 retorna para `sp_statistics`, exceto que `QUALIFIER` e `OWNER` são substituídos por `CATALOG` e `SCHEMA`, respectivamente.

Informações sobre Indexes de tabela também estão disponíveis na instrução [`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement"). Consulte [Section 13.7.5.22, “SHOW INDEX Statement”](show-index.html "13.7.5.22 SHOW INDEX Statement"). As seguintes instruções são equivalentes:

```sql
SELECT * FROM INFORMATION_SCHEMA.STATISTICS
  WHERE table_name = 'tbl_name'
  AND table_schema = 'db_name'

SHOW INDEX
  FROM tbl_name
  FROM db_name
```
