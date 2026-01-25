### 24.3.23 A Tabela SCHEMA_PRIVILEGES do INFORMATION_SCHEMA

A tabela [`SCHEMA_PRIVILEGES`](information-schema-schema-privileges-table.html "24.3.23 The INFORMATION_SCHEMA SCHEMA_PRIVILEGES Table") fornece informações sobre os *privileges* de *schema* (*Database*). Ela obtém seus valores da tabela de sistema `mysql.db`.

A tabela [`SCHEMA_PRIVILEGES`](information-schema-schema-privileges-table.html "24.3.23 The INFORMATION_SCHEMA SCHEMA_PRIVILEGES Table") possui estas colunas:

* `GRANTEE`

  O nome da conta à qual o *privilege* foi concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

  O nome do *catalog* ao qual o *schema* pertence. Este valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do *schema*.

* `PRIVILEGE_TYPE`

  O *privilege* concedido. O valor pode ser qualquer *privilege* que pode ser concedido no nível do *schema*; veja [Seção 13.7.1.4, “GRANT Statement”](grant.html "13.7.1.4 GRANT Statement"). Cada linha lista um único *privilege*, então há uma linha por *privilege* de *schema* detido pelo *grantee*.

* `IS_GRANTABLE`

  `YES` se o usuário tiver o *privilege* [`GRANT OPTION`](privileges-provided.html#priv_grant-option), `NO` caso contrário. A saída não lista [`GRANT OPTION`](privileges-provided.html#priv_grant-option) como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* [`SCHEMA_PRIVILEGES`](information-schema-schema-privileges-table.html "24.3.23 The INFORMATION_SCHEMA SCHEMA_PRIVILEGES Table") é uma tabela `INFORMATION_SCHEMA` não padrão.

As seguintes instruções *não* são equivalentes:

```sql
SELECT ... FROM INFORMATION_SCHEMA.SCHEMA_PRIVILEGES

SHOW GRANTS ...
```
