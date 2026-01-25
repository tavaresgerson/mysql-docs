### 24.3.3 A Tabela COLLATIONS do INFORMATION_SCHEMA

A tabela [`COLLATIONS`](information-schema-collations-table.html "24.3.3 A Tabela COLLATIONS do INFORMATION_SCHEMA") fornece informações sobre collations para cada character set.

A tabela [`COLLATIONS`](information-schema-collations-table.html "24.3.3 A Tabela COLLATIONS do INFORMATION_SCHEMA") possui estas colunas:

* `COLLATION_NAME`

  O nome da collation.

* `CHARACTER_SET_NAME`

  O nome do character set ao qual a collation está associada.

* `ID`

  O ID da collation.

* `IS_DEFAULT`

  Indica se a collation é o padrão (default) para o seu character set.

* `IS_COMPILED`

  Indica se o character set está compilado no servidor.

* `SORTLEN`

  Está relacionado à quantidade de memória necessária para ordenar strings expressas no character set.

#### Notas

Informações sobre Collation também estão disponíveis na instrução [`SHOW COLLATION`](show-collation.html "13.7.5.4 SHOW COLLATION Statement"). Consulte a [Seção 13.7.5.4, “SHOW COLLATION Statement”](show-collation.html "13.7.5.4 SHOW COLLATION Statement"). As seguintes instruções são equivalentes:

```sql
SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLLATIONS
  [WHERE COLLATION_NAME LIKE 'wild']

SHOW COLLATION
  [LIKE 'wild']
```