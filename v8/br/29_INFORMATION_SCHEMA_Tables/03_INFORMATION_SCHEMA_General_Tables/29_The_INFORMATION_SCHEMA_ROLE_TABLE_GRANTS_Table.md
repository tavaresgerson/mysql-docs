### 28.3.29 A tabela ROLE\_TABLE\_GRANTS do esquema INFORMATION\_SCHEMA

A tabela `ROLE_TABLE_GRANTS` (disponível a partir do MySQL 8.0.19) fornece informações sobre os privilégios da tabela para os papéis que estão disponíveis para os papéis atualmente habilitados ou concedidos por eles.

A tabela `ROLE_TABLE_GRANTS` tem essas colunas:

- `GRANTOR`

  A parte do nome de usuário da conta que concedeu o papel.

- `GRANTOR_HOST`

  A parte do nome do host da conta que concedeu o papel.

- `GRANTEE`

  A parte do nome de usuário da conta à qual o papel é concedido.

- `GRANTEE_HOST`

  A parte do nome do host da conta à qual o papel é concedido.

- `TABLE_CATALOG`

  O nome do catálogo ao qual o papel se aplica. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual o papel se aplica.

- `TABLE_NAME`

  O nome da tabela à qual o papel se aplica.

- `PRIVILEGE_TYPE`

  O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível da tabela; veja a Seção 15.7.1.6, "Instrução GRANT". Cada linha lista um único privilégio, portanto, há uma linha por privilégio da coluna detido pelo beneficiário.

- `IS_GRANTABLE`

  `YES` ou `NO`, dependendo se o papel é concedível a outras contas.
