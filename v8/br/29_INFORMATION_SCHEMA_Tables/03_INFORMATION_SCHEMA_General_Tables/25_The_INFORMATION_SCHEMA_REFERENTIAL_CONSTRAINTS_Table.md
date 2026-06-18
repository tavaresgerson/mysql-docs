### 28.3.25 A tabela INFORMATION\_SCHEMA REFERENTIAL\_CONSTRAINTS

A tabela `REFERENTIAL_CONSTRAINTS` fornece informações sobre as chaves estrangeiras.

A tabela `REFERENTIAL_CONSTRAINTS` tem essas colunas:

- `CONSTRAINT_CATALOG`

  O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

- `CONSTRAINT_SCHEMA`

  O nome do esquema (banco de dados) ao qual a restrição pertence.

- `CONSTRAINT_NAME`

  O nome da restrição.

- `UNIQUE_CONSTRAINT_CATALOG`

  O nome do catálogo que contém a restrição exclusiva que a restrição faz referência. Esse valor é sempre `def`.

- `UNIQUE_CONSTRAINT_SCHEMA`

  O nome do esquema que contém a restrição exclusiva que a restrição faz referência.

- `UNIQUE_CONSTRAINT_NAME`

  O nome da restrição única que a restrição faz referência.

- `MATCH_OPTION`

  O valor do atributo de restrição `MATCH`. O único valor válido neste momento é `NONE`.

- `UPDATE_RULE`

  O valor do atributo de restrição `ON UPDATE`. Os valores possíveis são `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

- `DELETE_RULE`

  O valor do atributo de restrição `ON DELETE`. Os valores possíveis são `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

- `TABLE_NAME`

  O nome da tabela. Esse valor é o mesmo da tabela `TABLE_CONSTRAINTS`.

- `REFERENCED_TABLE_NAME`

  O nome da tabela referenciada pela restrição.
