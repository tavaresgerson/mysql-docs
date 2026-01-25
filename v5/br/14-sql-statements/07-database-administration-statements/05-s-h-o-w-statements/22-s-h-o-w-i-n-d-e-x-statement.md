#### 13.7.5.22 Instrução SHOW INDEX

```sql
SHOW {INDEX | INDEXES | KEYS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [WHERE expr]
```

[`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") retorna informações sobre Index de tabelas. O formato se assemelha ao da chamada `SQLStatistics` no ODBC. Esta instrução requer algum privilégio para qualquer coluna na tabela.

```sql
mysql> SHOW INDEX FROM City\G
*************************** 1. row ***************************
        Table: city
   Non_unique: 0
     Key_name: PRIMARY
 Seq_in_index: 1
  Column_name: ID
    Collation: A
  Cardinality: 4188
     Sub_part: NULL
       Packed: NULL
         Null:
   Index_type: BTREE
      Comment:
Index_comment:
*************************** 2. row ***************************
        Table: city
   Non_unique: 1
     Key_name: CountryCode
 Seq_in_index: 1
  Column_name: CountryCode
    Collation: A
  Cardinality: 232
     Sub_part: NULL
       Packed: NULL
         Null:
   Index_type: BTREE
      Comment:
Index_comment:
```

Uma alternativa à sintaxe `tbl_name FROM db_name` é *`db_name`*.*`tbl_name`*. Estas duas instruções são equivalentes:

```sql
SHOW INDEX FROM mytable FROM mydb;
SHOW INDEX FROM mydb.mytable;
```

A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido na [Seção 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

[`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") retorna os seguintes campos:

* `Table`

  O nome da tabela.

* `Non_unique`

  0 se o Index não puder conter duplicatas, 1 se puder.

* `Key_name`

  O nome do Index. Se o Index for a Primary Key, o nome é sempre `PRIMARY`.

* `Seq_in_index`

  O número de sequência da coluna no Index, começando com 1.

* `Column_name`

  O nome da coluna.

* `Collation`

  Como a coluna é classificada no Index. Pode ter valores `A` (ascendente) ou `NULL` (não classificado).

* `Cardinality`

  Uma estimativa do número de valores exclusivos no Index. Para atualizar este número, execute [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") ou (para tabelas `MyISAM`) [**myisamchk -a**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").

  `Cardinality` é contado com base em estatísticas armazenadas como inteiros, então o valor não é necessariamente exato, mesmo para tabelas pequenas. Quanto maior a cardinality, maior a chance de o MySQL usar o Index ao realizar JOINs.

* `Sub_part`

  O prefixo do Index. Ou seja, o número de caracteres indexados se a coluna estiver apenas parcialmente indexada, `NULL` se a coluna inteira estiver indexada.

  Nota

  Os *limites* de prefixo são medidos em bytes. No entanto, os *comprimentos* de prefixo para especificações de Index nas instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") e [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") são interpretados como número de caracteres para tipos de string não binários ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types")) e número de bytes para tipos de string binários ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")). Leve isso em consideração ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

  Para informações adicionais sobre prefixos de Index, consulte a [Seção 8.3.4, “Column Indexes”](column-indexes.html "8.3.4 Column Indexes"), e a [Seção 13.1.14, “CREATE INDEX Statement”](create-index.html "13.1.14 CREATE INDEX Statement").

* `Packed`

  Indica como a Key é empacotada. `NULL` se não for.

* `Null`

  Contém `YES` se a coluna puder conter valores `NULL` e `''` se não puder.

* `Index_type`

  O método de Index usado (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

* `Comment`

  Informações sobre o Index não descritas em sua própria coluna, como `disabled` se o Index estiver desabilitado.

* `Index_comment`

  Qualquer comentário fornecido para o Index com um atributo `COMMENT` quando o Index foi criado.

Informações sobre Index de tabelas também estão disponíveis na tabela [`STATISTICS`](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table") do `INFORMATION_SCHEMA`. Consulte a [Seção 24.3.24, “The INFORMATION_SCHEMA STATISTICS Table”](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table").

Você pode listar os Index de uma tabela com o comando [**mysqlshow -k *`db_name`* *`tbl_name`***](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information").