### 24.3.30 A tabela INFORMATION\_SCHEMA USER\_PRIVILEGES

A tabela [`USER_PRIVILEGES`](https://pt.wikipedia.org/wiki/Tabela_de_informa%C3%A7%C3%A3o_sobre_usu%C3%A1rios_com_privilegios) fornece informações sobre privilégios globais. Ela obtém seus valores da tabela `mysql.user` do sistema.

A tabela `USER_PRIVILEGES` tem as seguintes colunas:

- `GARANTE`

  O nome da conta a qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

- `TABLE_CATALOG`

  O nome do catálogo. Esse valor é sempre `def`.

- `PRIVILEGE_TYPE`

  O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido a nível global; veja Seção 13.7.1.4, "Declaração GRANT". Cada linha lista um único privilégio, portanto, há uma linha por privilégio global detido pelo beneficiário.

- `IS_GRANTABLE`

  `SIM` se o usuário tiver o privilégio `GRANT OPTION`, `NÃO` caso contrário. A saída não lista `GRANT OPTION` como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

- `USER_PRIVILEGES` é uma tabela `INFORMATION_SCHEMA` não padrão.

As seguintes afirmações *não* são equivalentes:

```sql
SELECT ... FROM INFORMATION_SCHEMA.USER_PRIVILEGES

SHOW GRANTS ...
```
