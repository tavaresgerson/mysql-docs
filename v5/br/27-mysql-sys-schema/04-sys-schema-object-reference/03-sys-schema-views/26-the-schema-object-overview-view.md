#### 26.4.3.26 A View schema_object_overview

Esta view resume os tipos de objetos dentro de cada schema. Por padrão, as linhas são ordenadas por schema e tipo de objeto.

Nota

Para instâncias MySQL com um grande número de objetos, a execução desta view pode levar um tempo considerável.

A view `schema_object_overview` possui as seguintes colunas:

* `db`

  O nome do schema.

* `object_type`

  O tipo de objeto: `BASE TABLE`, `INDEX (index_type)`, `EVENT`, `FUNCTION`, `PROCEDURE`, `TRIGGER`, `VIEW`.

* `count`

  O número de objetos no schema do tipo especificado.