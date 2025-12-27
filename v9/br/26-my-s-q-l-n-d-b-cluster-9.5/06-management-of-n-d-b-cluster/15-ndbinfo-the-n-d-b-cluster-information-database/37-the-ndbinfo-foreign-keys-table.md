#### 25.6.15.37 A tabela ndbinfo foreign_keys

A tabela `foreign_keys` fornece informações sobre as chaves estrangeiras nas tabelas `NDB`. Esta tabela possui as seguintes colunas:

* `object_id`

  O ID do objeto da chave estrangeira

* `name`

  O nome da chave estrangeira

* `parent_table`

  O nome da tabela pai da chave estrangeira

* `parent_columns`

  Uma lista separada por vírgula das colunas pai

* `child_table`

  O nome da tabela filha

* `child_columns`

  Uma lista separada por vírgula das colunas filha

* `parent_index`

  O nome do índice pai

* `child_index`

  O nome do índice filho

* `on_update_action`

  A ação `ON UPDATE` especificada para a chave estrangeira; uma das opções `No Action`, `Restrict`, `Cascade`, `Set Null` ou `Set Default`

* `on_delete_action`

  A ação `ON DELETE` especificada para a chave estrangeira; uma das opções `No Action`, `Restrict`, `Cascade`, `Set Null` ou `Set Default`