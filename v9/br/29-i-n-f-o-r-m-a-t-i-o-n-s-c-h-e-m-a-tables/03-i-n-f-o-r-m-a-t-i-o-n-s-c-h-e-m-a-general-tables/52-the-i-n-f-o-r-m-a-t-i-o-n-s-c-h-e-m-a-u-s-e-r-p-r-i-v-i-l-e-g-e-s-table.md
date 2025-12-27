### 28.3.52 A Tabela `INFORMATION_SCHEMA USER_PRIVILEGES`

A tabela `USER_PRIVILEGES` fornece informações sobre privilégios globais. Ela obtém seus valores da tabela `mysql.user` do sistema.

A tabela `USER_PRIVILEGES` tem as seguintes colunas:

* `GRANTEE`

  O nome da conta a qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

  O nome do catálogo. Esse valor é sempre `def`.

* `PRIVILEGE_TYPE`

  O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido a nível global; veja a Seção 15.7.1.6, “Instrução GRANT”. Cada linha lista um único privilégio, portanto, há uma linha por privilégio global mantido pelo concedente.

* `IS_GRANTABLE`

  `YES` se o usuário tiver o privilégio `GRANT OPTION`, `NO` caso contrário. A saída não lista `GRANT OPTION` como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* `USER_PRIVILEGES` é uma tabela `INFORMATION_SCHEMA` não padrão.

As seguintes declarações **não** são equivalentes:

```
SELECT ... FROM INFORMATION_SCHEMA.USER_PRIVILEGES

SHOW GRANTS ...
```