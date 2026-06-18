### 28.3.47 A tabela INFORMATION\_SCHEMA USER\_PRIVILEGES

A tabela `USER_PRIVILEGES` fornece informações sobre privilégios globais. Ela obtém seus valores da tabela de sistema `mysql.user`.

A tabela `USER_PRIVILEGES` tem essas colunas:

- `GRANTEE`

  O nome da conta a qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

- `TABLE_CATALOG`

  O nome do catálogo. Esse valor é sempre `def`.

- `PRIVILEGE_TYPE`

  O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido a nível global; veja a Seção 15.7.1.6, "Declaração GRANT". Cada linha lista um único privilégio, portanto, há uma linha por privilégio global detido pelo beneficiário.

- `IS_GRANTABLE`

  `YES` se o usuário tiver o privilégio `GRANT OPTION`, `NO` caso contrário. A saída não lista `GRANT OPTION` como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

- `USER_PRIVILEGES` é uma tabela não padrão `INFORMATION_SCHEMA`.

As seguintes afirmações *não* são equivalentes:

```
SELECT ... FROM INFORMATION_SCHEMA.USER_PRIVILEGES

SHOW GRANTS ...
```
