### 28.3.38 A Tabela INFORMATION_SCHEMA SCHEMATA_EXTENSIONS

A tabela `SCHEMATA_EXTENSIONS` complementa a tabela `SCHEMATA` com informações sobre as opções do esquema.

A tabela `SCHEMATA_EXTENSIONS` possui as seguintes colunas:

* `CATALOG_NAME`

  O nome do catálogo ao qual o esquema pertence. Esse valor é sempre `def`.

* `SCHEMA_NAME`

  O nome do esquema.

* `OPTIONS`

  As opções do esquema. Se o esquema for de leitura somente, o valor contém `READ ONLY=1`. Se o esquema não for de leitura somente, a opção `READ ONLY` não aparece.

#### Exemplo

```
mysql> ALTER SCHEMA mydb READ ONLY = 1;
mysql> SELECT * FROM INFORMATION_SCHEMA.SCHEMATA_EXTENSIONS
       WHERE SCHEMA_NAME = 'mydb';
+--------------+-------------+-------------+
| CATALOG_NAME | SCHEMA_NAME | OPTIONS     |
+--------------+-------------+-------------+
| def          | mydb        | READ ONLY=1 |
+--------------+-------------+-------------+

mysql> ALTER SCHEMA mydb READ ONLY = 0;
mysql> SELECT * FROM INFORMATION_SCHEMA.SCHEMATA_EXTENSIONS
       WHERE SCHEMA_NAME = 'mydb';
+--------------+-------------+---------+
| CATALOG_NAME | SCHEMA_NAME | OPTIONS |
+--------------+-------------+---------+
| def          | mydb        |         |
+--------------+-------------+---------+
```

#### Notas

* `SCHEMATA_EXTENSIONS` é uma tabela `INFORMATION_SCHEMA` não padrão.