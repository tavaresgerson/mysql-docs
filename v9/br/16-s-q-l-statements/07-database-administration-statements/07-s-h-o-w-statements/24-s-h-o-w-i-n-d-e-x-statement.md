#### 15.7.7.24 Declaração `SHOW INDEX`

```
SHOW [EXTENDED] {INDEX | INDEXES | KEYS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [WHERE expr]
```

`SHOW INDEX` retorna informações sobre o índice da tabela. O formato é semelhante ao da chamada `SQLStatistics` no ODBC. Esta declaração requer algum privilégio para qualquer coluna na tabela.

```
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
      Visible: YES
   Expression: NULL
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
      Visible: YES
   Expression: NULL
```

Uma alternativa à sintaxe `db_name.*tbl_name` é *`db_name`.`tbl_name`*. Essas duas declarações são equivalentes:

```
SHOW INDEX FROM mytable FROM mydb;
SHOW INDEX FROM mydb.mytable;
```

A palavra-chave opcional `EXTENDED` faz com que a saída inclua informações sobre índices ocultos que o MySQL usa internamente e que não são acessíveis pelos usuários.

A cláusula `WHERE` pode ser usada para selecionar linhas usando condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações `SHOW`”.

`SHOW INDEX` retorna os seguintes campos:

* `Table`

  O nome da tabela.

* `Non_unique`

  0 se o índice não pode conter duplicatas, 1 se pode.

* `Key_name`

  O nome do índice. Se o índice for a chave primária, o nome é sempre `PRIMARY`.

* `Seq_in_index`

  O número de sequência da coluna no índice, começando com 1.

* `Column_name`

  O nome da coluna. Veja também a descrição para a coluna `Expression`.

* `Collation`

  Como a coluna é ordenada no índice. Isso pode ter valores `A` (ascendente), `D` (descendente) ou `NULL` (não ordenada).

* `Cardinality`

  Uma estimativa do número de valores únicos no índice. Para atualizar esse número, execute `ANALYZE TABLE` ou (para tabelas `MyISAM`) **myisamchk -a**.

  `Cardinality` é contado com base em estatísticas armazenadas como inteiros, então o valor não é necessariamente exato, mesmo para tabelas pequenas. Quanto maior a cardinalidade, maior a chance de o MySQL usar o índice ao fazer junções.

* `Sub_part`

  O prefixo do índice. Ou seja, o número de caracteres indexados se a coluna estiver apenas parcialmente indexada, `NULL` se toda a coluna estiver indexada.

Nota

Os prefixos *limites* são medidos em bytes. No entanto, os prefixos *comprimento* para especificações de índice nas instruções `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

Para obter informações adicionais sobre os prefixos de índice, consulte a Seção 10.3.5, “Indekses de Coluna”, e a Seção 15.1.18, “Instrução CREATE INDEX”.

* `Packed`

  Indica como a chave é compactada. `NULL` se não for.

* `Null`

  Contém `YES` se a coluna pode conter valores `NULL` e `''` se não.

* `Index_type`

  O método de índice usado (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

* `Comment`

  Informações sobre o índice não descritas em sua própria coluna, como `disabled` se o índice estiver desativado.

* `Index_comment`

  Qualquer comentário fornecido para o índice com um atributo `COMMENT` quando o índice foi criado.

* `Visible`

  Se o índice é visível para o otimizador. Consulte a Seção 10.3.12, “Indekses Invisíveis”.

* `Expression`

  O MySQL suporta partes de chave funcional (veja Partes de Chave Funcional); isso afeta tanto as colunas `Column_name` quanto `Expression`:

  + Para uma parte de chave não funcional, `Column_name` indica a coluna indexada pela parte da chave e `Expression` é `NULL`.

  + Para uma parte de chave funcional, a coluna `Column_name` é `NULL` e `Expression` indica a expressão para a parte da chave.

Informações sobre índices de tabelas também estão disponíveis na tabela `INFORMATION_SCHEMA` `STATISTICS`. Veja a Seção 28.3.40, “A Tabela STATISTICS da INFORMATION_SCHEMA”. As informações detalhadas sobre índices ocultos estão disponíveis apenas usando `SHOW EXTENDED INDEX`; não podem ser obtidas a partir da tabela `STATISTICS`.

Você pode listar os índices de uma tabela com o comando **mysqlshow -k *`db_name`* *`tbl_name`***.

`SHOW INDEX` inclui a chave invisível gerada da tabela, se houver, por padrão. Você pode suprimir essa informação na saída do comando definindo `show_gipk_in_create_table_and_information_schema = OFF`. Para mais informações, consulte a Seção 15.1.24.11, “Chaves Primárias Invisíveis Geradas”.