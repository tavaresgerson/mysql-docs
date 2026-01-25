### 24.3.28 A Tabela TABLE_PRIVILEGES do INFORMATION_SCHEMA

A tabela [`TABLE_PRIVILEGES`](information-schema-table-privileges-table.html "24.3.28 A Tabela TABLE_PRIVILEGES do INFORMATION_SCHEMA") fornece informações sobre Privileges de tabela. Ela obtém seus valores da tabela de sistema `mysql.tables_priv`.

A tabela [`TABLE_PRIVILEGES`](information-schema-table-privileges-table.html "24.3.28 A Tabela TABLE_PRIVILEGES do INFORMATION_SCHEMA") possui as seguintes colunas:

* `GRANTEE`

  O nome da conta para a qual o Privilege é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

  O nome do catalog ao qual a tabela pertence. Este valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do Schema (Database) ao qual a tabela pertence.

* `TABLE_NAME`

  O nome da tabela.

* `PRIVILEGE_TYPE`

  O Privilege concedido. O valor pode ser qualquer Privilege que possa ser concedido no nível da tabela; consulte [Seção 13.7.1.4, “GRANT Statement”](grant.html "13.7.1.4 GRANT Statement"). Cada linha lista um único Privilege, então há uma linha por Privilege de tabela detido pelo grantee.

* `IS_GRANTABLE`

  `YES` se o usuário tiver o Privilege [`GRANT OPTION`](privileges-provided.html#priv_grant-option), `NO` caso contrário. A saída não lista [`GRANT OPTION`](privileges-provided.html#priv_grant-option) como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Observações

* [`TABLE_PRIVILEGES`](information-schema-table-privileges-table.html "24.3.28 A Tabela TABLE_PRIVILEGES do INFORMATION_SCHEMA") é uma tabela `INFORMATION_SCHEMA` não padrão.

As seguintes statements *não* são equivalentes:

```sql
SELECT ... FROM INFORMATION_SCHEMA.TABLE_PRIVILEGES

SHOW GRANTS ...
```