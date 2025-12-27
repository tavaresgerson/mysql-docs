### 28.3.5 A Tabela `INFORMATION_SCHEMA CHECK_CONSTRAINTS`

O `CREATE TABLE` suporta as principais funcionalidades das restrições `CHECK` de tabela e coluna; a tabela `CHECK_CONSTRAINTS` fornece informações sobre essas restrições.

A tabela `CHECK_CONSTRAINTS` tem as seguintes colunas:

* `CONSTRAINT_CATALOG`

  O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

  O nome do esquema (banco de dados) ao qual a restrição pertence.

* `CONSTRAINT_NAME`

  O nome da restrição.

* `CHECK_CLAUSE`

  A expressão que especifica a condição da restrição.