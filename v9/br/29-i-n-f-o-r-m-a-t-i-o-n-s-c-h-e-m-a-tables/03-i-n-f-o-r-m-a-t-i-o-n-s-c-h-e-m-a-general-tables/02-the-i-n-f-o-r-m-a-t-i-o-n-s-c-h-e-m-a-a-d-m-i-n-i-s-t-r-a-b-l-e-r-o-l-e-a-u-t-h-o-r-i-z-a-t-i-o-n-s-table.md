### 28.3.2 A Tabela INFORMATION_SCHEMA ADMINISTRABLE_ROLE_AUTHORIZATIONS

A tabela `ADMINISTRABLE_ROLE_AUTHORIZATIONS` fornece informações sobre quais papéis aplicáveis para o usuário ou papel atual podem ser concedidos a outros usuários ou papéis.

A tabela `ADMINISTRABLE_ROLE_AUTHORIZATIONS` tem as seguintes colunas:

* `USER`

  A parte do nome do usuário da conta atual do usuário.

* `HOST`

  A parte do nome do host da conta atual do usuário.

* `GRANTEE`

  A parte do nome do usuário da conta para a qual o papel é concedido.

* `GRANTEE_HOST`

  A parte do nome do host da conta para a qual o papel é concedido.

* `ROLE_NAME`

  A parte do nome do usuário do papel concedido.

* `ROLE_HOST`

  A parte do nome do host do papel concedido.

* `IS_GRANTABLE`

  `YES` ou `NO`, dependendo se o papel é concedível a outras contas.

* `IS_DEFAULT`

  `YES` ou `NO`, dependendo se o papel é um papel padrão.

* `IS_MANDATORY`

  `YES` ou `NO`, dependendo se o papel é obrigatório.