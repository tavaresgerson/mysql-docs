### 24.3.30 A Tabela INFORMATION_SCHEMA USER_PRIVILEGES

A tabela [`USER_PRIVILEGES`](information-schema-user-privileges-table.html "24.3.30 The INFORMATION_SCHEMA USER_PRIVILEGES Table") fornece informações sobre global privileges. Ela obtém seus valores da tabela de sistema `mysql.user`.

A tabela [`USER_PRIVILEGES`](information-schema-user-privileges-table.html "24.3.30 The INFORMATION_SCHEMA USER_PRIVILEGES Table") possui estas colunas:

* `GRANTEE`

  O nome da conta para a qual o privilege é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

  O nome do catalog. Este valor é sempre `def`.

* `PRIVILEGE_TYPE`

  O privilege concedido. O valor pode ser qualquer privilege que possa ser concedido no nível global; consulte [Section 13.7.1.4, “GRANT Statement”](grant.html "13.7.1.4 GRANT Statement"). Cada linha lista um único privilege, portanto, há uma linha por global privilege detido pelo grantee.

* `IS_GRANTABLE`

  `YES` se o usuário tiver o privilege [`GRANT OPTION`](privileges-provided.html#priv_grant-option), `NO` caso contrário. A saída não lista [`GRANT OPTION`](privileges-provided.html#priv_grant-option) como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* [`USER_PRIVILEGES`](information-schema-user-privileges-table.html "24.3.30 The INFORMATION_SCHEMA USER_PRIVILEGES Table") é uma tabela `INFORMATION_SCHEMA` não padrão.

As seguintes instruções *não* são equivalentes:

```sql
SELECT ... FROM INFORMATION_SCHEMA.USER_PRIVILEGES

SHOW GRANTS ...
```