### 24.3.20 A Tabela REFERENTIAL_CONSTRAINTS do INFORMATION_SCHEMA

A tabela [`REFERENTIAL_CONSTRAINTS`](information-schema-referential-constraints-table.html "24.3.20 The INFORMATION_SCHEMA REFERENTIAL_CONSTRAINTS Table") fornece informações sobre Foreign Keys.

A tabela [`REFERENTIAL_CONSTRAINTS`](information-schema-referential-constraints-table.html "24.3.20 The INFORMATION_SCHEMA REFERENTIAL_CONSTRAINTS Table") possui as seguintes colunas:

* `CONSTRAINT_CATALOG`

  O nome do Catalog ao qual o Constraint pertence. Este valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

  O nome do Schema (Database) ao qual o Constraint pertence.

* `CONSTRAINT_NAME`

  O nome do Constraint.

* `UNIQUE_CONSTRAINT_CATALOG`

  O nome do Catalog que contém o Unique Constraint que o Constraint referencia. Este valor é sempre `def`.

* `UNIQUE_CONSTRAINT_SCHEMA`

  O nome do Schema (Database) que contém o Unique Constraint que o Constraint referencia.

* `UNIQUE_CONSTRAINT_NAME`

  O nome do Unique Constraint que o Constraint referencia.

* `MATCH_OPTION`

  O valor do atributo `MATCH` do Constraint. O único valor válido neste momento é `NONE`.

* `UPDATE_RULE`

  O valor do atributo `ON UPDATE` do Constraint. Os valores possíveis são `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

* `DELETE_RULE`

  O valor do atributo `ON DELETE` do Constraint. Os valores possíveis são `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

* `TABLE_NAME`

  O nome da Table. Este valor é o mesmo que na tabela [`TABLE_CONSTRAINTS`](information-schema-table-constraints-table.html "24.3.27 The INFORMATION_SCHEMA TABLE_CONSTRAINTS Table").

* `REFERENCED_TABLE_NAME`

  O nome da Table referenciada pelo Constraint.