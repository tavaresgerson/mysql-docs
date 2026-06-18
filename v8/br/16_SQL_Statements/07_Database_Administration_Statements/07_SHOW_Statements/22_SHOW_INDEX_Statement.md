#### 15.7.7.22 Declaração de índice de exibição

```
SHOW [EXTENDED] {INDEX | INDEXES | KEYS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [WHERE expr]
```

`SHOW INDEX` retorna informações de índice de tabela. O formato é semelhante ao da chamada `SQLStatistics` no ODBC. Esta declaração requer algum privilégio para qualquer coluna da tabela.

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

Uma alternativa à sintaxe `tbl_name FROM db_name` é `db_name`.`tbl_name`. Essas duas declarações são equivalentes:

```
SHOW INDEX FROM mytable FROM mydb;
SHOW INDEX FROM mydb.mytable;
```

A palavra-chave opcional `EXTENDED` faz com que a saída inclua informações sobre índices ocultos que o MySQL usa internamente e que não são acessíveis pelos usuários.

A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, “Extensões para instruções SHOW”.

`SHOW INDEX` retorna os seguintes campos:

- `Table`

  O nome da tabela.

- `Non_unique`

  0 se o índice não puder conter duplicatas; 1 se puder.

- `Key_name`

  O nome do índice. Se o índice for a chave primária, o nome será sempre `PRIMARY`.

- `Seq_in_index`

  O número de sequência da coluna no índice, começando com 1.

- `Column_name`

  O nome da coluna. Veja também a descrição para a coluna `Expression`.

- `Collation`

  Como a coluna é ordenada no índice. Isso pode ter valores `A` (crescente), `D` (decrescente) ou `NULL` (não ordenado).

- `Cardinality`

  Uma estimativa do número de valores únicos no índice. Para atualizar esse número, execute `ANALYZE TABLE` ou (para tabelas `MyISAM`), **myisamchk -a**.

  `Cardinality` é contado com base em estatísticas armazenadas como inteiros, portanto, o valor não é necessariamente exato, mesmo para tabelas pequenas. Quanto maior a cardinalidade, maior a chance de o MySQL usar o índice ao realizar junções.

- `Sub_part`

  O prefixo do índice. Ou seja, o número de caracteres indexados se a coluna estiver apenas parcialmente indexada, `NULL` se toda a coluna estiver indexada.

  Nota

  Os prefixos *limits* são medidos em bytes. No entanto, os prefixos *lengths* para especificações de índice nas instruções `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de strings não binárias (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de strings binárias (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

  Para obter informações adicionais sobre prefixos de índice, consulte a Seção 10.3.5, “Índices de Colunas”, e a Seção 15.1.15, “Instrução CREATE INDEX”.

- `Packed`

  Indica como a chave está embalada. `NULL` se não estiver.

- `Null`

  Contém `YES` se a coluna pode conter valores de `NULL` e `''` se

- `Index_type`

  O método de índice utilizado (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

- `Comment`

  Informações sobre o índice não descritas em sua própria coluna, como `disabled` se o índice estiver desativado.

- `Index_comment`

  Qualquer comentário fornecido para o índice com o atributo `COMMENT` quando o índice foi criado.

- `Visible`

  Se o índice é visível para o otimizador. Consulte a Seção 10.3.12, “Índices Invisíveis”.

- `Expression`

  O MySQL 8.0.13 e versões superiores suportam partes de chave funcional (veja Partes de Chave Funcional), o que afeta as colunas `Column_name` e `Expression`:

  - Para uma parte da chave não funcional, `Column_name` indica a coluna indexada pela parte da chave e `Expression` é `NULL`.

  - Para uma parte chave funcional, a coluna `Column_name` é `NULL` e `Expression` indica a expressão para a parte chave.

Informações sobre índices de tabela também estão disponíveis na tabela `INFORMATION_SCHEMA` `STATISTICS`. Veja a Seção 28.3.34, “A Tabela STATISTICS do INFORMATION\_SCHEMA”. As informações detalhadas sobre índices ocultos estão disponíveis apenas usando `SHOW EXTENDED INDEX`; não podem ser obtidas a partir da tabela `STATISTICS`.

Você pode listar os índices de uma tabela com o comando **mysqlshow -k `db_name` `tbl_name`**.

No MySQL 8.0.30 e versões posteriores, `SHOW INDEX` inclui a chave primária invisível gerada da tabela, se houver, por padrão. Você pode evitar que essa informação seja exibida na saída do comando configurando `show_gipk_in_create_table_and_information_schema = OFF`. Para mais informações, consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”.
