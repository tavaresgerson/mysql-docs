#### 25.6.16.39 A tabela ndbinfo index\_columns

Esta tabela fornece informações sobre índices nas tabelas `NDB`. As colunas da tabela `index_columns` estão listadas aqui, juntamente com descrições breves:

- `table_id`

  ID único da tabela `NDB` para a qual o índice é definido

- Nome do banco de dados que contém esta tabela

  `varchar(64)`

- `table_name`

  Nome da tabela

- `index_object_id`

  ID de objeto deste índice

- `index_name`

  Nome do índice; se o índice não tiver um nome, será usado o nome da primeira coluna do índice

- `index_type`

  Tipo de índice; normalmente, este é 3 (índice de hash único) ou 6 (índice ordenado); os valores são os mesmos da coluna `type_id` da tabela `dict_obj_types`

- `status`

  Um dos `new`, `changed`, `retrieved`, `invalid` ou `altered`

- `columns`

  Uma lista separada por vírgula das colunas que compõem o índice

A tabela `index_columns` foi adicionada no NDB 8.0.29.
