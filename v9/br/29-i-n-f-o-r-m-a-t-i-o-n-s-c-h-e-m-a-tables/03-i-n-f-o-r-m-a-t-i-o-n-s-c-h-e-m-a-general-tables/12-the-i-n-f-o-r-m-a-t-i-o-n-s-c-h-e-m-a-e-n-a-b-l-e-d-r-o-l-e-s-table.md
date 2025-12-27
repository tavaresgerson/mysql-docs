### 28.3.12 A Tabela INFORMATION_SCHEMA ENABLED_ROLES

A tabela `ENABLED_ROLES` fornece informações sobre os papéis habilitados na sessão atual.

A tabela `ENABLED_ROLES` tem as seguintes colunas:

* `ROLE_NAME`

  A parte do nome do usuário do papel concedido.

* `ROLE_HOST`

  A parte do nome do host do papel concedido.

* `IS_DEFAULT`

  `SIM` ou `NÃO`, dependendo se o papel é um papel padrão.

* `IS_MANDATORY`

  `SIM` ou `NÃO`, dependendo se o papel é obrigatório.