### 28.3.34 A tabela INFORMATION\_SCHEMA STATISTICS

A tabela `STATISTICS` fornece informações sobre índices de tabela.

As colunas em `STATISTICS` que representam estatísticas de tabela armazenam valores armazenados em cache. A variável de sistema `information_schema_stats_expiry` define o período de tempo antes que as estatísticas de tabela armazenadas em cache expirem. O padrão é de 86400 segundos (24 horas). Se não houver estatísticas armazenadas em cache ou se as estatísticas expiraram, as estatísticas são recuperadas dos mecanismos de armazenamento ao fazer uma consulta às colunas de estatísticas de tabela. Para atualizar os valores armazenados em cache a qualquer momento para uma determinada tabela, use `ANALYZE TABLE`. Para sempre recuperar as estatísticas mais recentes diretamente dos mecanismos de armazenamento, defina `information_schema_stats_expiry=0`. Para obter mais informações, consulte a Seção 10.2.3, “Otimizando consultas do INFORMATION\_SCHEMA”.

Nota

Se a variável de sistema `innodb_read_only` estiver habilitada, o `ANALYZE TABLE` pode falhar porque ele não pode atualizar as tabelas de estatísticas no dicionário de dados, que usam `InnoDB`. Para operações `ANALYZE TABLE` que atualizam a distribuição de chaves, o erro pode ocorrer mesmo se a operação atualizar a própria tabela (por exemplo, se for uma tabela `MyISAM`). Para obter as estatísticas de distribuição atualizadas, defina `information_schema_stats_expiry=0`.

A tabela `STATISTICS` tem essas colunas:

- `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela que contém o índice pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela que contém o índice pertence.

- `TABLE_NAME`

  O nome da tabela que contém o índice.

- `NON_UNIQUE`

  0 se o índice não puder conter duplicatas; 1 se puder.

- `INDEX_SCHEMA`

  O nome do esquema (banco de dados) ao qual o índice pertence.

- `INDEX_NAME`

  O nome do índice. Se o índice for a chave primária, o nome será sempre `PRIMARY`.

- `SEQ_IN_INDEX`

  O número de sequência da coluna no índice, começando com 1.

- `COLUMN_NAME`

  O nome da coluna. Veja também a descrição para a coluna `EXPRESSION`.

- `COLLATION`

  Como a coluna é ordenada no índice. Isso pode ter valores `A` (crescente), `D` (decrescente) ou `NULL` (não ordenado).

- `CARDINALITY`

  Uma estimativa do número de valores únicos no índice. Para atualizar esse número, execute `ANALYZE TABLE` ou (para tabelas `MyISAM`), **myisamchk -a**.

  `CARDINALITY` é contado com base em estatísticas armazenadas como inteiros, portanto, o valor não é necessariamente exato, mesmo para tabelas pequenas. Quanto maior a cardinalidade, maior a chance de o MySQL usar o índice ao realizar junções.

- `SUB_PART`

  O prefixo do índice. Ou seja, o número de caracteres indexados se a coluna estiver apenas parcialmente indexada, `NULL` se toda a coluna estiver indexada.

  Nota

  Os prefixos *limits* são medidos em bytes. No entanto, os prefixos *lengths* para especificações de índice nas instruções `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de strings não binárias (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de strings binárias (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

  Para obter informações adicionais sobre prefixos de índice, consulte a Seção 10.3.5, “Índices de Colunas”, e a Seção 15.1.15, “Instrução CREATE INDEX”.

- `PACKED`

  Indica como a chave está embalada. `NULL` se não estiver.

- `NULLABLE`

  Contém `YES` se a coluna pode conter valores de `NULL` e `''` se

- `INDEX_TYPE`

  O método de índice utilizado (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

- `COMMENT`

  Informações sobre o índice não descritas em sua própria coluna, como `disabled` se o índice estiver desativado.

- `INDEX_COMMENT`

  Qualquer comentário fornecido para o índice com o atributo `COMMENT` quando o índice foi criado.

- `IS_VISIBLE`

  Se o índice é visível para o otimizador. Consulte a Seção 10.3.12, “Índices Invisíveis”.

- `EXPRESSION`

  O MySQL 8.0.13 e versões superiores suportam partes de chave funcional (veja Partes de Chave Funcional), o que afeta as colunas `COLUMN_NAME` e `EXPRESSION`:

  - Para uma parte da chave não funcional, `COLUMN_NAME` indica a coluna indexada pela parte da chave e `EXPRESSION` é `NULL`.

  - Para uma parte chave funcional, a coluna `COLUMN_NAME` é `NULL` e `EXPRESSION` indica a expressão para a parte chave.

#### Notas

- Não existe uma tabela padrão `INFORMATION_SCHEMA` para índices. A lista de colunas do MySQL é semelhante àquela que o SQL Server 2000 retorna para `sp_statistics`, exceto que `QUALIFIER` e `OWNER` são substituídos por `CATALOG` e `SCHEMA`, respectivamente.

Informações sobre índices de tabela também estão disponíveis na declaração `SHOW INDEX`. Veja a Seção 15.7.7.22, “Declaração SHOW INDEX”. As seguintes declarações são equivalentes:

```
SELECT * FROM INFORMATION_SCHEMA.STATISTICS
  WHERE table_name = 'tbl_name'
  AND table_schema = 'db_name'

SHOW INDEX
  FROM tbl_name
  FROM db_name
```

No MySQL 8.0.30 e versões posteriores, as informações sobre as colunas primárias invisíveis geradas são visíveis por padrão nesta tabela. Você pode ocultar essas informações definindo `show_gipk_in_create_table_and_information_schema = OFF`. Para mais informações, consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”.
