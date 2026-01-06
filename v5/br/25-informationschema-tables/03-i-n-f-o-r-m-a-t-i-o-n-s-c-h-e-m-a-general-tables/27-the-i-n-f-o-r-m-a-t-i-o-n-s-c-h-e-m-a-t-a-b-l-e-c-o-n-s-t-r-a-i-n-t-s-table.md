### 24.3.27 A tabela INFORMATION\_SCHEMA TABLE\_CONSTRAINTS

A tabela [`TABLE_CONSTRAINTS`](https://pt.wikipedia.org/wiki/Informa%C3%A7%C3%A3o-schema-table-constraints-table.html) descreve quais tabelas possuem restrições.

A tabela `TABLE_CONSTRAINTS` tem as seguintes colunas:

- `CONSTRAINT_CATALOG`

  O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

- `CONSTRAINT_SCHEMA`

  O nome do esquema (banco de dados) ao qual a restrição pertence.

- `CONSTRAINT_NAME`

  O nome da restrição.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

- `NOME_TABELA`

  O nome da tabela.

- `CONSTRAINT_TYPE`

  O tipo de restrição. O valor pode ser `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY` ou `CHECK`. Esta é uma coluna de tipo `[CHAR]` (não `[ENUM]` - enum.html). O valor `CHECK` não está disponível até que o MySQL suporte `CHECK`.

  As informações `UNIQUE` e `PRIMARY KEY` são praticamente as mesmas que você obtém a partir da coluna `Key_name` no resultado do `SHOW INDEX` quando a coluna `Non_unique` é `0`.
