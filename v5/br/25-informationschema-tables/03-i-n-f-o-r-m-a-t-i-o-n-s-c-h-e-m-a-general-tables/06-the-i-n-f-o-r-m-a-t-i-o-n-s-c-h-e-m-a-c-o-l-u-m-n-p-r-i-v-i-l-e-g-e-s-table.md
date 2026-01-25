### 24.3.6 A Tabela COLUMN_PRIVILEGES do INFORMATION_SCHEMA

A tabela [`COLUMN_PRIVILEGES`](information-schema-column-privileges-table.html "24.3.6 A Tabela COLUMN_PRIVILEGES do INFORMATION_SCHEMA") fornece informações sobre privilégios de coluna. Ela obtém seus valores da tabela de sistema `mysql.columns_priv`.

A tabela [`COLUMN_PRIVILEGES`](information-schema-column-privileges-table.html "24.3.6 A Tabela COLUMN_PRIVILEGES do INFORMATION_SCHEMA") possui as seguintes colunas:

* `GRANTEE`

  O nome da conta para a qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

  O nome do catalog ao qual pertence a tabela que contém a coluna. Este valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do Schema (Database) ao qual pertence a tabela que contém a coluna.

* `TABLE_NAME`

  O nome da tabela que contém a coluna.

* `COLUMN_NAME`

  O nome da coluna.

* `PRIVILEGE_TYPE`

  O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível da coluna; veja [Seção 13.7.1.4, “Instrução GRANT”](grant.html "13.7.1.4 Instrução GRANT"). Cada linha lista um único privilégio, portanto, há uma linha por privilégio de coluna detido pelo *grantee*.

  Na saída de [`SHOW FULL COLUMNS`](show-columns.html "13.7.5.5 Instrução SHOW COLUMNS"), os privilégios estão todos em uma única coluna e em minúsculas, por exemplo, `select,insert,update,references`. Em [`COLUMN_PRIVILEGES`](information-schema-column-privileges-table.html "24.3.6 A Tabela COLUMN_PRIVILEGES do INFORMATION_SCHEMA"), há um privilégio por linha, em maiúsculas.

* `IS_GRANTABLE`

  `YES` se o usuário tiver o privilégio [`GRANT OPTION`](privileges-provided.html#priv_grant-option), `NO` caso contrário. A saída não lista [`GRANT OPTION`](privileges-provided.html#priv_grant-option) como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* [`COLUMN_PRIVILEGES`](information-schema-column-privileges-table.html "24.3.6 A Tabela COLUMN_PRIVILEGES do INFORMATION_SCHEMA") é uma tabela `INFORMATION_SCHEMA` não padrão.

As seguintes instruções *não* são equivalentes:

```sql
SELECT ... FROM INFORMATION_SCHEMA.COLUMN_PRIVILEGES

SHOW GRANTS ...
```