#### 30.4.3.26 A visualização schema_object_overview

Essa visualização resume os tipos de objetos dentro de cada esquema. Por padrão, as linhas são ordenadas por esquema e tipo de objeto.

Observação

Para instâncias do MySQL com um grande número de objetos, essa visualização pode demorar muito para ser executada.

A visualização `schema_object_overview` tem as seguintes colunas:

* `db`

  O nome do esquema.

* `object_type`

  O tipo de objeto: `TABELA BÁSICA`, `ÍNDICE (tipo_índice)`, `EVENTO`, `FUNÇÃO`, `PROCEDURE`, `TRIGGER`, `VISTA`.

* `count`

  O número de objetos no esquema do tipo especificado.