### 24.3.6 A tabela INFORMATION\_SCHEMA COLUMN\_PRIVILEGES

A tabela [`COLUMN_PRIVILEGES`](https://docs.mysql.com/en/information-schema/columns/column_privileges_table.html) fornece informações sobre os privilégios das colunas. Ela obtém seus valores da tabela `mysql.columns_priv` do sistema.

A tabela `COLUMN_PRIVILEGES` possui as seguintes colunas:

- `GARANTE`

  O nome da conta a qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

- `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela que contém a coluna pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela que contém a coluna pertence.

- `NOME_TABELA`

  O nome da tabela que contém a coluna.

- `NOME_COLUNA`

  O nome da coluna.

- `PRIVILEGE_TYPE`

  O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível da coluna; veja Seção 13.7.1.4, "Instrução GRANT". Cada linha lista um único privilégio, portanto, há uma linha por privilégio da coluna detido pelo beneficiário.

  No resultado da consulta `SHOW FULL COLUMNS`, os privilégios estão todos em uma única coluna e em minúsculas, por exemplo, `select,insert,update,references`. Na tabela `COLUMN_PRIVILEGES` (tabela de informações de privilégios de coluna), há um privilégio por linha, em maiúsculas.

- `IS_GRANTABLE`

  `SIM` se o usuário tiver o privilégio `GRANT OPTION`, `NÃO` caso contrário. A saída não lista `GRANT OPTION` como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

- `COLUMN_PRIVILEGES` é uma tabela `INFORMATION_SCHEMA` não padrão.

As seguintes afirmações *não* são equivalentes:

```sql
SELECT ... FROM INFORMATION_SCHEMA.COLUMN_PRIVILEGES

SHOW GRANTS ...
```
