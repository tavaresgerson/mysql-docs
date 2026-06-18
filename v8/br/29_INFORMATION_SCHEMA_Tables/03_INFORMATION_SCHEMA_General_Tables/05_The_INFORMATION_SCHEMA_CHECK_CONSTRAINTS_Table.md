### 28.3.5 A tabela INFORMATION\_SCHEMA CHECK\_CONSTRAINTS

A partir do MySQL 8.0.16, o `CREATE TABLE` permite as funcionalidades principais das restrições de tabela e coluna `CHECK` e a tabela `CHECK_CONSTRAINTS` fornece informações sobre essas restrições.

A tabela `CHECK_CONSTRAINTS` tem essas colunas:

- `CONSTRAINT_CATALOG`

  O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

- `CONSTRAINT_SCHEMA`

  O nome do esquema (banco de dados) ao qual a restrição pertence.

- `CONSTRAINT_NAME`

  O nome da restrição.

- `CHECK_CLAUSE`

  A expressão que especifica a condição de restrição.
