### 28.3.47 A Tabela `INFORMATION_SCHEMA\_TABLE\_CONSTRAINTS`

A tabela `TABLE_CONSTRAINTS` descreve quais tabelas possuem restrições.

A tabela `TABLE_CONSTRAINTS` tem as seguintes colunas:

* `CONSTRAINT_CATALOG`

  O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

  O nome do esquema (banco de dados) ao qual a restrição pertence.

* `CONSTRAINT_NAME`

  O nome da restrição.

* `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

  O nome da tabela.

* `CONSTRAINT_TYPE`

  O tipo de restrição. O valor pode ser `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY` ou `CHECK`. Essa é uma coluna `CHAR` (não `ENUM`).

As informações sobre `UNIQUE` e `PRIMARY KEY` são as mesmas que você obtém a partir da coluna `Key_name` no resultado da consulta `SHOW INDEX` quando a coluna `Non_unique` é `0`.

* `ENFORCED`

  Para restrições `CHECK`, o valor é `YES` ou `NO` para indicar se a restrição é aplicada. Para outras restrições, o valor é sempre `YES`.