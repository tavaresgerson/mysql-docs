### 28.3.28 A tabela INFORMATION\_SCHEMA ROLE\_ROUTINE\_GRANTS

A tabela `ROLE_ROUTINE_GRANTS` (disponível a partir do MySQL 8.0.19) fornece informações sobre os privilégios de rotina para os papéis que estão disponíveis para os papéis atualmente habilitados ou concedidos por eles.

A tabela `ROLE_ROUTINE_GRANTS` tem essas colunas:

- `GRANTOR`

  A parte do nome de usuário da conta que concedeu o papel.

- `GRANTOR_HOST`

  A parte do nome do host da conta que concedeu o papel.

- `GRANTEE`

  A parte do nome de usuário da conta à qual o papel é concedido.

- `GRANTEE_HOST`

  A parte do nome do host da conta à qual o papel é concedido.

- `SPECIFIC_CATALOG`

  O nome do catálogo ao qual a rotina pertence. Esse valor é sempre `def`.

- `SPECIFIC_SCHEMA`

  O nome do esquema (banco de dados) ao qual a rotina pertence.

- `SPECIFIC_NAME`

  O nome da rotina.

- `ROUTINE_CATALOG`

  O nome do catálogo ao qual a rotina pertence. Esse valor é sempre `def`.

- `ROUTINE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a rotina pertence.

- `ROUTINE_NAME`

  O nome da rotina.

- `PRIVILEGE_TYPE`

  O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível de rotina; veja a Seção 15.7.1.6, "Declaração GRANT". Cada linha lista um único privilégio, portanto, há uma linha por privilégio da coluna detido pelo beneficiário.

- `IS_GRANTABLE`

  `YES` ou `NO`, dependendo se o papel é concedível a outras contas.
