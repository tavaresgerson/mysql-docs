### 24.3.23 A tabela INFORMATION\_SCHEMA SCHEMA\_PRIVILEGES

A tabela [`SCHEMA_PRIVILEGES`](https://pt.wikipedia.org/wiki/Tabela_Schema_Privileges) fornece informações sobre privilégios de esquema (banco de dados). Ela obtém seus valores da tabela `mysql.db` do sistema.

A tabela `SCHEMA_PRIVILEGES` tem as seguintes colunas:

- `GARANTE`

  O nome da conta a qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

- `TABLE_CATALOG`

  O nome do catálogo ao qual o esquema pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema.

- `PRIVILEGE_TYPE`

  O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível do esquema; veja Seção 13.7.1.4, "Instrução GRANT". Cada linha lista um único privilégio, portanto, há uma linha por privilégio do esquema detido pelo beneficiário.

- `IS_GRANTABLE`

  `SIM` se o usuário tiver o privilégio `GRANT OPTION`, `NÃO` caso contrário. A saída não lista `GRANT OPTION` como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

- `SCHEMA_PRIVILEGES` é uma tabela `INFORMATION_SCHEMA` não padrão.

As seguintes afirmações *não* são equivalentes:

```sql
SELECT ... FROM INFORMATION_SCHEMA.SCHEMA_PRIVILEGES

SHOW GRANTS ...
```
