### 28.3.44 A tabela INFORMATION\_SCHEMA TABLE\_PRIVILEGES

A tabela `TABLE_PRIVILEGES` fornece informações sobre privilégios de tabela. Ela obtém seus valores da tabela `mysql.tables_priv` do sistema.

A tabela `TABLE_PRIVILEGES` tem essas colunas:

- `GRANTEE`

  O nome da conta a qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

- `TABLE_CATALOG`

  O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

- `TABLE_SCHEMA`

  O nome do esquema (banco de dados) ao qual a tabela pertence.

- `TABLE_NAME`

  O nome da tabela.

- `PRIVILEGE_TYPE`

  O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível da tabela; veja a Seção 15.7.1.6, "Instrução GRANT". Cada linha lista um único privilégio, portanto, há uma linha por privilégio da tabela detido pelo beneficiário.

- `IS_GRANTABLE`

  `YES` se o usuário tiver o privilégio `GRANT OPTION`, `NO` caso contrário. A saída não lista `GRANT OPTION` como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

- `TABLE_PRIVILEGES` é uma tabela não padrão `INFORMATION_SCHEMA`.

As seguintes afirmações *não* são equivalentes:

```
SELECT ... FROM INFORMATION_SCHEMA.TABLE_PRIVILEGES

SHOW GRANTS ...
```
