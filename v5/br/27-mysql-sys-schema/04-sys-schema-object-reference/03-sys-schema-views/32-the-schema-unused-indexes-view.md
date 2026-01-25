#### 26.4.3.32 A View schema_unused_indexes

Estas Views exibem Indexes para os quais não há eventos, o que indica que eles não estão sendo usados. Por padrão, as linhas são ordenadas por Schema e Table.

Esta View é mais útil quando o server está ativo e processando por tempo suficiente para que sua carga de trabalho seja representativa. Caso contrário, a presença de um Index nesta View pode não ser significativa.

A View `schema_unused_indexes` possui as seguintes colunas:

* `object_schema`

  O nome do Schema.

* `object_name`

  O nome da Table.

* `index_name`

  O nome do Index não utilizado.