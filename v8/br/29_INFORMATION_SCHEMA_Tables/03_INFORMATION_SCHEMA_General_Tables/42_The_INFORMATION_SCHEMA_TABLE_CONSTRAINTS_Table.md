### 28.3.42 A tabela INFORMATION\_SCHEMA TABLE\_CONSTRAINTS

A tabela `TABLE_CONSTRAINTS` descreve quais tabelas têm restrições.

A tabela `TABLE_CONSTRAINTS` tem essas colunas:

- `CONSTRAINT_CATALOG`

  O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

- `CONSTRAINT_SCHEMA`

  O nome do esquema (banco de dados) ao qual a restrição pertence.

- `CONSTRAINT_NAME`

  O nome da restrição.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

- `TABLE_NAME`

  O nome da tabela.

- `CONSTRAINT_TYPE`

  O tipo de restrição. O valor pode ser `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY` ou (a partir do MySQL 8.0.16) `CHECK`. Esta é uma coluna `CHAR` (não `ENUM`).

  As informações `UNIQUE` e `PRIMARY KEY` são semelhantes às obtidas a partir da coluna `Key_name` no resultado do `SHOW INDEX` quando a coluna `Non_unique` é `0`.

- `ENFORCED`

  Para as restrições `CHECK`, o valor é `YES` ou `NO` para indicar se a restrição é aplicada. Para outras restrições, o valor é sempre `YES`.

  Esta coluna foi adicionada no MySQL 8.0.16.
