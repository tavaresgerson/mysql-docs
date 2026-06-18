#### 25.6.16.36 A tabela ndbinfo foreign\_keys estrangeiro

A tabela `foreign_keys` fornece informações sobre as chaves estrangeiras nas tabelas `NDB`. Esta tabela possui as seguintes colunas:

- `object_id`

  ID do objeto da chave estrangeira

- `name`

  Nome da chave estrangeira

- `parent_table`

  Nome da tabela pai da chave estrangeira

- `parent_columns`

  Uma lista separada por vírgula de colunas pai

- `child_table`

  O nome da tabela da criança

- `child_columns`

  Uma lista separada por vírgula de colunas de criança

- `parent_index`

  Nome do índice pai

- `child_index`

  Nome do índice de crianças

- `on_update_action`

  A ação `ON UPDATE` especificada para a chave estrangeira; uma das `No Action`, `Restrict`, `Cascade`, `Set Null` ou `Set Default`

- `on_delete_action`

  A ação `ON DELETE` especificada para a chave estrangeira; uma das `No Action`, `Restrict`, `Cascade`, `Set Null` ou `Set Default`

A tabela `foreign_keys` foi adicionada no NDB 8.0.29.
