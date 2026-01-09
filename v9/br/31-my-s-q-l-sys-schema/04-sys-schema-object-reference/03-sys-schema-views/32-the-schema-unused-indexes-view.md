#### 30.4.3.32 A visão schema_unused_indexes

Essas visões exibem índices para os quais não há eventos, o que indica que eles não estão sendo usados. Por padrão, as linhas são ordenadas por esquema e tabela.

Essa visão é mais útil quando o servidor está em funcionamento há tempo suficiente para que sua carga de trabalho seja representativa. Caso contrário, a presença de um índice nessa visão pode não ser significativa.

A visão `schema_unused_indexes` tem as seguintes colunas:

* `object_schema`

  O nome do esquema.

* `object_name`

  O nome da tabela.

* `index_name`

  O nome do índice não utilizado.