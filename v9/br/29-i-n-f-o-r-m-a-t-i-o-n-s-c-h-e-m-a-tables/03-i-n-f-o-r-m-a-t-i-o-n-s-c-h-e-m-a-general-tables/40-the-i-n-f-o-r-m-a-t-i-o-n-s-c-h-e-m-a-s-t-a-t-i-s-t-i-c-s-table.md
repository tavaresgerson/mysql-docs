### 28.3.40 A Tabela `INFORMATION_SCHEMA STATISTICS`

A tabela `STATISTICS` fornece informações sobre índices de tabelas.

As colunas da `STATISTICS` que representam estatísticas de tabelas armazenam valores armazenados em cache. A variável de sistema `information_schema_stats_expiry` define o período de tempo antes que as estatísticas de tabelas armazenadas expirem. O valor padrão é de 86400 segundos (24 horas). Se não houver estatísticas armazenadas ou se as estatísticas expiraram, as estatísticas são recuperadas dos mecanismos de armazenamento ao consultar as colunas de estatísticas de tabelas. Para atualizar os valores armazenados a qualquer momento para uma determinada tabela, use `ANALYZE TABLE`. Para sempre recuperar as estatísticas mais recentes diretamente dos mecanismos de armazenamento, defina `information_schema_stats_expiry=0`. Para obter mais informações, consulte a Seção 10.2.3, “Otimizando Consultas `INFORMATION_SCHEMA`”.

Observação

Se a variável de sistema `innodb_read_only` estiver habilitada, a operação `ANALYZE TABLE` pode falhar porque não pode atualizar tabelas de estatísticas no dicionário de dados, que usam `InnoDB`. Para operações `ANALYZE TABLE` que atualizam a distribuição de chaves, a falha pode ocorrer mesmo se a operação atualizar a própria tabela (por exemplo, se for uma tabela `MyISAM`). Para obter as estatísticas de distribuição atualizadas, defina `information_schema_stats_expiry=0`.

A tabela `STATISTICS` tem essas colunas:

* `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela que contém o índice pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela que contém o índice pertence.

* `TABLE_NAME`

  O nome da tabela que contém o índice.

* `NON_UNIQUE`

  0 se o índice não pode conter duplicatas, 1 se pode.

* `INDEX_SCHEMA`

  O nome do esquema (banco de dados) ao qual o índice pertence.

* `INDEX_NAME`

O nome do índice. Se o índice for a chave primária, o nome será sempre `PRIMARY`.

* `SEQ_IN_INDEX`

  O número de sequência da coluna no índice, começando com 1.

* `COLUMN_NAME`

  O nome da coluna. Veja também a descrição da coluna `EXPRESSION`.

* `COLLATION`

  Como a coluna é ordenada no índice. Isso pode ter os valores `A` (ascendente), `D` (descendente) ou `NULL` (não ordenado).

* `CARDINALITY`

  Uma estimativa do número de valores únicos no índice. Para atualizar esse número, execute `ANALYZE TABLE` ou (para tabelas `MyISAM`) **myisamchk -a**.

  A `CARDINALITY` é contada com base em estatísticas armazenadas como inteiros, então o valor não é necessariamente exato, mesmo para tabelas pequenas. Quanto maior a cardinalidade, maior a chance de o MySQL usar o índice ao fazer junções.

* `SUB_PART`

  O prefixo do índice. Ou seja, o número de caracteres indexados se a coluna for indexada apenas parcialmente, `NULL` se toda a coluna for indexada.

  Nota

  Os *limites* de prefixo são medidos em bytes. No entanto, os *comprimentos* de prefixo para especificações de índice em declarações `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

  Para obter informações adicionais sobre prefixos de índice, consulte a Seção 10.3.5, “Indekses de Coluna”, e a Seção 15.1.18, “Declaração CREATE INDEX”.

* `PACKED`

  Indica como a chave é compactada. `NULL` se não for.

* `NULLABLE`

  Contém `YES` se a coluna pode conter valores `NULL` e `''` se não.

* `INDEX_TYPE`

  O método de índice usado (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

* `COMMENT`

Informações sobre o índice não descritas em sua própria coluna, como `disabled` se o índice estiver desativado.

* `INDEX_COMMENT`

  Qualquer comentário fornecido para o índice com um atributo `COMMENT` quando o índice foi criado.

* `IS_VISIBLE`

  Se o índice é visível para o otimizador. Consulte a Seção 10.3.12, “Indekses Invisíveis”.

* `EXPRESSION`

  O MySQL suporta partes de chave funcional (veja Partes de Chave Funcional), o que afeta tanto as colunas `COLUMN_NAME` quanto `EXPRESSION`:

  + Para uma parte de chave não funcional, `COLUMN_NAME` indica a coluna indexada pela parte de chave e `EXPRESSION` é `NULL`.

  + Para uma parte de chave funcional, a coluna `COLUMN_NAME` é `NULL` e `EXPRESSION` indica a expressão para a parte de chave.

#### Notas

* Não existe uma tabela padrão do `INFORMATION_SCHEMA` para índices. A lista de colunas do MySQL é semelhante àquela que o SQL Server 2000 retorna para `sp_statistics`, exceto que `QUALIFIER` e `OWNER` são substituídos por `CATALOG` e `SCHEMA`, respectivamente.

Informações sobre índices de tabelas também estão disponíveis a partir da instrução `SHOW INDEX`. Consulte a Seção 15.7.7.24, “Instrução SHOW INDEX”. As seguintes instruções são equivalentes:

```
SELECT * FROM INFORMATION_SCHEMA.STATISTICS
  WHERE table_name = 'tbl_name'
  AND table_schema = 'db_name'

SHOW INDEX
  FROM tbl_name
  FROM db_name
```

Informações sobre colunas de chave primária invisíveis geradas são visíveis nesta tabela por padrão. Você pode fazer com que essas informações sejam ocultas configurando `show_gipk_in_create_table_and_information_schema = OFF`. Para mais informações, consulte a Seção 15.1.24.11, “Chaves Primárias Invisíveis Geradas”.