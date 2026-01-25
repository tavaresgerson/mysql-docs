### 24.3.27 A Tabela INFORMATION_SCHEMA TABLE_CONSTRAINTS

A tabela [`TABLE_CONSTRAINTS`](information-schema-table-constraints-table.html "24.3.27 A Tabela INFORMATION_SCHEMA TABLE_CONSTRAINTS") descreve quais tabelas possuem Constraints.

A tabela [`TABLE_CONSTRAINTS`](information-schema-table-constraints-table.html "24.3.27 A Tabela INFORMATION_SCHEMA TABLE_CONSTRAINTS") possui as seguintes colunas:

* `CONSTRAINT_CATALOG`

  O nome do catalog ao qual a Constraint pertence. Este valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

  O nome do Schema (Database) ao qual a Constraint pertence.

* `CONSTRAINT_NAME`

  O nome da Constraint.

* `TABLE_SCHEMA`

  O nome do Schema (Database) ao qual a tabela pertence.

* `TABLE_NAME`

  O nome da tabela.

* `CONSTRAINT_TYPE`

  O tipo de Constraint. O valor pode ser `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`, ou `CHECK`. Esta é uma coluna [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") (não [`ENUM`](enum.html "11.3.5 The ENUM Type")). O valor `CHECK` não está disponível até que o MySQL suporte `CHECK`.

  A informação `UNIQUE` e `PRIMARY KEY` é a mesma que você obtém da coluna `Key_name` na saída do [`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") quando a coluna `Non_unique` é `0`.