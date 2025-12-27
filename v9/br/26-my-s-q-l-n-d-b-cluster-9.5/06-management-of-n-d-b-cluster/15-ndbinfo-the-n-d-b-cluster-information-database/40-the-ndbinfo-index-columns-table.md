#### 25.6.15.40 A tabela ndbinfo index_columns

Esta tabela fornece informações sobre índices em tabelas `NDB`. As colunas da tabela `index_columns` estão listadas aqui, juntamente com descrições breves:

* `table_id`

  ID único da tabela `NDB` para a qual o índice é definido

* Nome do banco de dados que contém esta tabela

  `varchar(64)`

* `table_name`

  Nome da tabela

* `index_object_id`

  ID do objeto deste índice

* `index_name`

  Nome do índice; se o índice não tiver um nome, o nome da primeira coluna no índice é usado

* `index_type`

  Tipo de índice; normalmente, este é 3 (índice de hash único) ou 6 (índice ordenado); os valores são os mesmos que os da coluna `type_id` da tabela `dict_obj_types`

* `status`

  Um dos valores `new`, `changed`, `retrieved`, `invalid` ou `altered`

* `columns`

  Lista separada por vírgula das colunas que compõem o índice