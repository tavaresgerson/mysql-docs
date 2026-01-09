#### 26.4.3.26 A visualização schema_object_overview

Essa visualização resume os tipos de objetos dentro de cada esquema. Por padrão, as linhas são ordenadas por esquema e tipo de objeto.

Nota

Para instâncias do MySQL com um grande número de objetos, essa visualização pode demorar muito para ser executada.

A visualização `schema_object_overview` tem essas colunas:

- `db`

  O nome do esquema.

- `tipo_objeto`

  O tipo de objeto: `TABELA BÁSICA`, `ÍNDICE (tipo_de_índice)`, `EVENTO`, `FUNÇÃO`, `PROCEDIMENTO`, `ATRIZ DE TRIGGER`, `VISTA`.

- `contagem`

  O número de objetos no esquema do tipo fornecido.
