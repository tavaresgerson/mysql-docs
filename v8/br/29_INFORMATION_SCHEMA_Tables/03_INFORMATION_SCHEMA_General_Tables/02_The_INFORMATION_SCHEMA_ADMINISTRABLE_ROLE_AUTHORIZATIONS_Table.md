### 28.3.2 A tabela INFORMATION\_SCHEMA ADMINISTRABLE\_ROLE\_AUTHORIZATIONS

A tabela `ADMINISTRABLE_ROLE_AUTHORIZATIONS` (disponível a partir do MySQL 8.0.19) fornece informações sobre quais papéis aplicáveis ao usuário ou papel atual podem ser concedidos a outros usuários ou papéis.

A tabela `ADMINISTRABLE_ROLE_AUTHORIZATIONS` tem essas colunas:

- `USER`

  A parte do nome de usuário da conta de usuário atual.

- `HOST`

  A parte do nome do host da conta de usuário atual.

- `GRANTEE`

  A parte do nome de usuário da conta à qual o papel é concedido.

- `GRANTEE_HOST`

  A parte do nome do host da conta à qual o papel é concedido.

- `ROLE_NAME`

  A parte do nome de usuário da função concedida.

- `ROLE_HOST`

  A parte do nome do host da função concedida.

- `IS_GRANTABLE`

  `YES` ou `NO`, dependendo se o papel é concedível a outras contas.

- `IS_DEFAULT`

  `YES` ou `NO`, dependendo se o papel é um papel padrão.

- `IS_MANDATORY`

  `YES` ou `NO`, dependendo se o papel é obrigatório.
