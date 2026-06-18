### 24.3.4 A Tabela COLLATION_CHARACTER_SET_APPLICABILITY do INFORMATION_SCHEMA

A tabela `COLLATION_CHARACTER_SET_APPLICABILITY` indica qual `Character Set` é aplicável para qual `Collation`.

A tabela `COLLATION_CHARACTER_SET_APPLICABILITY` possui as seguintes colunas:

* `COLLATION_NAME`

  O nome da `Collation`.

* `CHARACTER_SET_NAME`

  O nome do `Character Set` ao qual a `Collation` está associada.

#### Notas

As colunas da tabela `COLLATION_CHARACTER_SET_APPLICABILITY` são equivalentes às duas primeiras colunas exibidas pela instrução `SHOW COLLATION`.