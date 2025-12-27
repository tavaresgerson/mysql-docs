### 28.3.7 A tabela INFORMATION_SCHEMA COLLATION_CHARACTER_SET_APPLICABILITY

A tabela `COLLATION_CHARACTER_SET_APPLICABILITY` indica qual conjunto de caracteres é aplicável para qual coligação.

A tabela `COLLATION_CHARACTER_SET_APPLICABILITY` tem as seguintes colunas:

* `COLLATION_NAME`

  O nome da coligação.

* `CHARACTER_SET_NAME`

  O nome do conjunto de caracteres com o qual a coligação está associada.

#### Notas

As colunas `COLLATION_CHARACTER_SET_APPLICABILITY` são equivalentes às duas primeiras colunas exibidas pela instrução `SHOW COLLATION`.