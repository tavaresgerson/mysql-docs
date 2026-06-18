### 28.3.37 A tabela INFORMATION\_SCHEMA ST\_UNITS\_OF\_MEASURE

A tabela `ST_UNITS_OF_MEASURE` (disponível a partir do MySQL 8.0.14) fornece informações sobre as unidades aceitáveis para a função `ST_Distance()`.

A tabela `ST_UNITS_OF_MEASURE` tem essas colunas:

- `UNIT_NAME`

  O nome da unidade.

- `UNIT_TYPE`

  O tipo de unidade (por exemplo, `LINEAR`).

- `CONVERSION_FACTOR`

  Um fator de conversão usado para cálculos internos.

- `DESCRIPTION`

  Uma descrição da unidade.
