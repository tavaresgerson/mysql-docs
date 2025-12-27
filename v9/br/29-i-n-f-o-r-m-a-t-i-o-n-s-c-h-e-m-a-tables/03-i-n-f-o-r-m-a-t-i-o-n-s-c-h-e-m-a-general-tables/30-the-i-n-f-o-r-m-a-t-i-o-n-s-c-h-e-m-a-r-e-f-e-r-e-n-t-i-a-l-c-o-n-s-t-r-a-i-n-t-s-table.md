### 28.3.30 A Tabela `INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS`

A tabela `REFERENTIAL_CONSTRAINTS` fornece informações sobre as chaves estrangeiras.

A tabela `REFERENTIAL_CONSTRAINTS` tem as seguintes colunas:

* `CONSTRAINT_CATALOG`

  O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

  O nome do esquema (banco de dados) ao qual a restrição pertence.

* `CONSTRAINT_NAME`

  O nome da restrição.

* `UNIQUE_CONSTRAINT_CATALOG`

  O nome do catálogo que contém a restrição exclusiva que a restrição referencia. Esse valor é sempre `def`.

* `UNIQUE_CONSTRAINT_SCHEMA`

  O nome do esquema que contém a restrição exclusiva que a restrição referencia.

* `UNIQUE_CONSTRAINT_NAME`

  O nome da restrição exclusiva que a restrição referencia.

* `MATCH_OPTION`

  O valor do atributo `MATCH` da restrição. O único valor válido neste momento é `NONE`.

* `UPDATE_RULE`

  O valor do atributo `ON UPDATE` da restrição. Os valores possíveis são `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

* `DELETE_RULE`

  O valor do atributo `ON DELETE` da restrição. Os valores possíveis são `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

* `TABLE_NAME`

  O nome da tabela. Esse valor é o mesmo que na tabela `TABLE_CONSTRAINTS`.

* `REFERENCED_TABLE_NAME`

  O nome da tabela referenciada pela restrição.