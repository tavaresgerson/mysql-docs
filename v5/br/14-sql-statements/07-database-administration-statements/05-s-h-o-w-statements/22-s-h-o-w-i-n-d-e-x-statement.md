#### 13.7.5.22 Declaração de índice de exibição

```sql
SHOW {INDEX | INDEXES | KEYS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [WHERE expr]
```

`SHOW INDEX` retorna informações do índice da tabela. O formato é semelhante ao da chamada `SQLStatistics` no ODBC. Esta declaração requer algum privilégio para qualquer coluna da tabela.

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

Uma alternativa à sintaxe `tbl_name FROM db_name` é *`db_name`*.\*`tbl_name*`. Essas duas instruções são equivalentes:

```sql
SHOW INDEX FROM mytable FROM mydb;
SHOW INDEX FROM mydb.mytable;
```

A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido em Seção 24.8, “Extensões para Declarações SHOW”.

`SHOW INDEX` retorna os seguintes campos:

- `Mesa`

  O nome da tabela.

- `Não_único`

  0 se o índice não puder conter duplicatas; 1 se puder.

- `Nome_chave`

  O nome do índice. Se o índice for a chave primária, o nome será sempre `PRIMARY`.

- `Seq_in_index`

  O número de sequência da coluna no índice, começando com 1.

- `Nome da coluna`

  O nome da coluna.

- `Colaboração`

  Como a coluna é ordenada no índice. Isso pode ter valores `A` (crescente) ou `NULL` (não ordenado).

- Cardinalidade

  Uma estimativa do número de valores únicos no índice. Para atualizar esse número, execute `ANALYZE TABLE` ou (para tabelas `MyISAM`) **myisamchk -a**.

  A cardinalidade é contada com base em estatísticas armazenadas como inteiros, portanto, o valor não é necessariamente exato, mesmo para tabelas pequenas. Quanto maior a cardinalidade, maior a chance de o MySQL usar o índice ao realizar junções.

- `Sub_part`

  O prefixo do índice. Ou seja, o número de caracteres indexados se a coluna estiver apenas parcialmente indexada, `NULL` se toda a coluna estiver indexada.

  Nota

  Os prefixos *limits* são medidos em bytes. No entanto, os prefixos *lengths* para especificações de índice nas instruções `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

  Para obter informações adicionais sobre prefixos de índice, consulte Seção 8.3.4, “Índices de Colunas” e Seção 13.1.14, “Instrução CREATE INDEX”.

- "Embalado"

  Indica como a chave está compactada. `NULL` se não estiver.

- `Nulo`

  Contém `SIM` se a coluna pode conter valores `NULL` e `''` se

- `Tipo de índice`

  O método de índice utilizado (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

- `Comentário`

  Informações sobre o índice não descritas em sua própria coluna, como `desativado`, se o índice estiver desativado.

- `Comentário_do_índice`

  Qualquer comentário fornecido para o índice com o atributo `COMMENT` quando o índice foi criado.

Informações sobre índices de tabelas também estão disponíveis na tabela `INFORMATION_SCHEMA` `STATISTICS`. Veja Seção 24.3.24, “A Tabela STATISTICS do INFORMATION\_SCHEMA”.

Você pode listar os índices de uma tabela com o comando **mysqlshow -k *`db_name`* *\`tbl\_name***.
