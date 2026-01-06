### 24.3.24 A tabela INFORMATION\_SCHEMA STATISTICS

A tabela `STATÍSTICAS` fornece informações sobre índices de tabelas.

A tabela `STATÍSTICAS` tem essas colunas:

- `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela que contém o índice pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela que contém o índice pertence.

- `NOME_TABELA`

  O nome da tabela que contém o índice.

- `NON_UNIQUE`

  0 se o índice não puder conter duplicatas; 1 se puder.

- `INDEX_SCHEMA`

  O nome do esquema (banco de dados) ao qual o índice pertence.

- `INDEX_NAME`

  O nome do índice. Se o índice for a chave primária, o nome será sempre `PRIMARY`.

- `SEQ_IN_INDEX`

  O número de sequência da coluna no índice, começando com 1.

- `NOME_COLUNA`

  O nome da coluna. Veja também a descrição da coluna `EXPRESSION`.

- `COLAÇAO`

  Como a coluna é ordenada no índice. Isso pode ter valores `A` (crescente), `D` (decrescente) ou `NULL` (não ordenado).

- `CARDINALIDADE`

  Uma estimativa do número de valores únicos no índice. Para atualizar esse número, execute `ANALYZE TABLE` ou (para tabelas `MyISAM`) **myisamchk -a**.

  A `CARDINALITY` é contada com base em estatísticas armazenadas como inteiros, portanto, o valor não é necessariamente exato, mesmo para tabelas pequenas. Quanto maior a cardinalidade, maior a chance de o MySQL usar o índice ao realizar junções.

- `SUB_PART`

  O prefixo do índice. Ou seja, o número de caracteres indexados se a coluna estiver apenas parcialmente indexada, `NULL` se toda a coluna estiver indexada.

  Nota

  Os prefixos *limits* são medidos em bytes. No entanto, os prefixos *lengths* para especificações de índice nas instruções `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

  Para obter informações adicionais sobre prefixos de índice, consulte Seção 8.3.4, “Índices de Colunas” e Seção 13.1.14, “Instrução CREATE INDEX”.

- `PACKADO`

  Indica como a chave está compactada. `NULL` se não estiver.

- `NULLÁVEL`

  Contém `SIM` se a coluna pode conter valores `NULL` e `''` se

- `INDEX_TYPE`

  O método de índice utilizado (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

- `COMENTÁRIO`

  Informações sobre o índice não descritas em sua própria coluna, como `desativado`, se o índice estiver desativado.

- `INDEX_COMMENT`

  Qualquer comentário fornecido para o índice com o atributo `COMMENT` quando o índice foi criado.

#### Notas

- Não existe uma tabela padrão `INFORMATION_SCHEMA` para índices. A lista de colunas do MySQL é semelhante àquela que o SQL Server 2000 retorna para `sp_statistics`, exceto que `QUALIFIER` e `OWNER` são substituídos por `CATALOG` e `SCHEMA`, respectivamente.

Informações sobre índices de tabela também estão disponíveis na instrução `SHOW INDEX`. Veja Seção 13.7.5.22, “Instrução SHOW INDEX”. As seguintes instruções são equivalentes:

```sql
SELECT * FROM INFORMATION_SCHEMA.STATISTICS
  WHERE table_name = 'tbl_name'
  AND table_schema = 'db_name'

SHOW INDEX
  FROM tbl_name
  FROM db_name
```
