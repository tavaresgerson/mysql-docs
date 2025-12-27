### 28.3.10 A Tabela `INFORMATION_SCHEMA COLUMN_PRIVILEGES`

A tabela `COLUMN_PRIVILEGES` fornece informações sobre os privilégios das colunas. Ela obtém seus valores da tabela `mysql.columns_priv` do sistema.

A tabela `COLUMN_PRIVILEGES` tem as seguintes colunas:

* `GRANTEE`

  O nome da conta a qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela que contém a coluna pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela que contém a coluna pertence.

* `TABLE_NAME`

  O nome da tabela que contém a coluna.

* `COLUMN_NAME`

  O nome da coluna.

* `PRIVILEGE_TYPE`

  O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível da coluna; veja a Seção 15.7.1.6, “Instrução GRANT”. Cada linha lista um único privilégio, portanto, há uma linha por privilégio da coluna mantido pelo concedente.

  Na saída de `SHOW FULL COLUMNS`, os privilégios estão todos em uma coluna e em minúsculas, por exemplo, `select,insert,update,references`. Em `COLUMN_PRIVILEGES`, há um privilégio por linha, em maiúsculas.

* `IS_GRANTABLE`

  `YES` se o usuário tiver o privilégio `GRANT OPTION`, `NO` caso contrário. A saída não lista `GRANT OPTION` como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* `COLUMN_PRIVILEGES` é uma tabela `INFORMATION_SCHEMA` não padrão.

As seguintes declarações **não** são equivalentes:

```
SELECT ... FROM INFORMATION_SCHEMA.COLUMN_PRIVILEGES

SHOW GRANTS ...
```