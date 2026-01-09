### 28.3.33 A Tabela ROLE_ROUTINE_GRANTS da INFORMATION_SCHEMA

A tabela `ROLE_ROUTINE_GRANTS` fornece informações sobre os privilégios de rotina para os papéis que estão disponíveis para ou concedidos pelos papéis atualmente habilitados.

A tabela `ROLE_ROUTINE_GRANTS` tem as seguintes colunas:

* `GRANTOR`

  A parte do nome do usuário da conta que concedeu o papel.

* `GRANTOR_HOST`

  A parte do nome do host da conta que concedeu o papel.

* `GRANTEE`

  A parte do nome do usuário da conta a que o papel é concedido.

* `GRANTEE_HOST`

  A parte do nome do host da conta a que o papel é concedido.

* `SPECIFIC_CATALOG`

  O nome do catálogo ao qual a rotina pertence. Esse valor é sempre `def`.

* `SPECIFIC_SCHEMA`

  O nome do esquema (banco de dados) ao qual a rotina pertence.

* `SPECIFIC_NAME`

  O nome da rotina.

* `ROUTINE_CATALOG`

  O nome do catálogo ao qual a rotina pertence. Esse valor é sempre `def`.

* `ROUTINE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a rotina pertence.

* `ROUTINE_NAME`

  O nome da rotina.

* `PRIVILEGE_TYPE`

  O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível da rotina; consulte a Seção 15.7.1.6, “Instrução GRANT”. Cada linha lista um único privilégio, portanto, há uma linha por privilégio da coluna detido pelo concedente.

* `IS_GRANTABLE`

  `YES` ou `NO`, dependendo se o papel é concedível a outras contas.