### 24.3.20 Tabela INFORMATION\_SCHEMA REFERENTIAL\_CONSTRAINTS

A tabela [`REFERENTIAL_CONSTRAINTS`](https://information-schema-referential-constraints-table.html) fornece informações sobre as chaves estrangeiras.

A tabela `REFERENTIAL_CONSTRAINTS` tem as seguintes colunas:

- `CONSTRAINT_CATALOG`

  O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

- `CONSTRAINT_SCHEMA`

  O nome do esquema (banco de dados) ao qual a restrição pertence.

- `CONSTRAINT_NAME`

  O nome da restrição.

- `UNIQUE_CONSTRAINT_CATALOG`

  O nome do catálogo que contém a restrição exclusiva que a restrição faz referência. Esse valor é sempre `def`.

- `UNIQUE_CONSTRAINT_SCHEMA`

  O nome do esquema (banco de dados) que contém a restrição exclusiva que a restrição faz referência.

- `NOME_CONSTRELA_ÚNICA`

  O nome da restrição única que a restrição faz referência.

- `OPCÃO_DO_CAMPEONATO`

  O valor do atributo `MATCH` (CONCORDA). O único valor válido neste momento é `NONE` (NÃO).

- `UPDATE_RULE`

  O valor do atributo `ON UPDATE`. Os valores possíveis são `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

- `DELETE_RULE`

  O valor do atributo `ON DELETE`. Os valores possíveis são `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

- `NOME_TABELA`

  O nome da tabela. Esse valor é o mesmo da tabela `[TABLE_CONSTRAINTS]` (information-schema-table-constraints-table.html).

- `REFERENCIADA_NOME_TABELA`

  O nome da tabela referenciada pela restrição.
