### 28.3.39 A Tabela SCHEMA_PRIVILEGIOS da INFORMATION_SCHEMA

A tabela `SCHEMA_PRIVILEGES` fornece informações sobre os privilégios do esquema (banco de dados). Ela obtém seus valores da tabela `mysql.db` do sistema.

A tabela `SCHEMA_PRIVILEGES` tem as seguintes colunas:

* `GRANTEE`

  O nome da conta a qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

  O nome do catálogo ao qual o esquema pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

  O nome do esquema.

* `PRIVILEGE_TYPE`

  O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível do esquema; veja a Seção 15.7.1.6, “Instrução GRANT”. Cada linha lista um único privilégio, portanto, há uma linha por privilégio do esquema detido pelo concedente.

* `IS_GRANTABLE`

  `YES` se o usuário tiver o privilégio `GRANT OPTION`, `NO` caso contrário. A saída não lista `GRANT OPTION` como uma linha separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* `SCHEMA_PRIVILEGES` é uma tabela não padrão da `INFORMATION_SCHEMA`.

As seguintes declarações **não** são equivalentes:

```
SELECT ... FROM INFORMATION_SCHEMA.SCHEMA_PRIVILEGES

SHOW GRANTS ...
```