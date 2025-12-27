### 28.3.3 A Tabela INFORMATION_SCHEMA APPLICABLE_ROLES

A tabela `APPLICABLE_ROLES` fornece informações sobre os papéis aplicáveis para o usuário atual.

A tabela `APPLICABLE_ROLES` tem as seguintes colunas:

* `USER`

  A parte do nome do usuário da conta atual.

* `HOST`

  A parte do nome do host da conta atual.

* `GRANTEE`

  A parte do nome do usuário da conta à qual o papel é concedido.

* `GRANTEE_HOST`

  A parte do nome do host da conta à qual o papel é concedido.

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