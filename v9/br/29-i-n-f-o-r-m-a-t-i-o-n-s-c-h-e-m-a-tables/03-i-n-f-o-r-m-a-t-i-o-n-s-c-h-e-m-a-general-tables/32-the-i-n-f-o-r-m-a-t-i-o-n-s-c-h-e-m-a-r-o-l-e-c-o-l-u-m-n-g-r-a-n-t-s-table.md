### 28.3.32 A Tabela INFORMATION_SCHEMA ROLE_COLUMN_GRANTS

A tabela `ROLE_COLUMN_GRANTS` fornece informações sobre os privilégios de coluna para os papéis que estão disponíveis para ou concedidos pelos papéis atualmente habilitados.

A tabela `ROLE_COLUMN_GRANTS` tem as seguintes colunas:

* `GRANTOR`

  A parte do nome do usuário da conta que concedeu o papel.

* `GRANTOR_HOST`

  A parte do nome do host da conta que concedeu o papel.

* `GRANTEE`

  A parte do nome do usuário da conta a que o papel é concedido.

* `GRANTEE_HOST`

  A parte do nome do host da conta a que o papel é concedido.

* `TABLE_CATALOG`

  O nome do catálogo ao qual o papel se aplica. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual o papel se aplica.

* `TABLE_NAME`

  O nome da tabela ao qual o papel se aplica.

* `COLUMN_NAME`

  O nome da coluna ao qual o papel se aplica.

* `PRIVILEGE_TYPE`

  O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível da coluna; veja a Seção 15.7.1.6, “Instrução GRANT”. Cada linha lista um único privilégio, portanto, há uma linha por privilégio de coluna mantido pelo concedente.

* `IS_GRANTABLE`

  `YES` ou `NO`, dependendo se o papel é concedível a outras contas.