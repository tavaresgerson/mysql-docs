### 28.3.12 A tabela INFORMATION\_SCHEMA ENABLED\_ROLES

A tabela `ENABLED_ROLES` (disponível a partir do MySQL 8.0.19) fornece informações sobre os papéis habilitados na sessão atual.

A tabela `ENABLED_ROLES` tem essas colunas:

- `ROLE_NAME`

  A parte do nome de usuário da função concedida.

- `ROLE_HOST`

  A parte do nome do host da função concedida.

- `IS_DEFAULT`

  `YES` ou `NO`, dependendo se o papel é um papel padrão.

- `IS_MANDATORY`

  `YES` ou `NO`, dependendo se o papel é obrigatório.
