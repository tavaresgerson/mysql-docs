### 28.3.32 A tabela INFORMATION\_SCHEMA SCHEMATA\_EXTENSIONS

A tabela `SCHEMATA_EXTENSIONS` (disponível a partir do MySQL 8.0.22) complementa a tabela `SCHEMATA` com informações sobre as opções do esquema.

A tabela `SCHEMATA_EXTENSIONS` tem essas colunas:

- `CATALOG_NAME`

  O nome do catálogo ao qual o esquema pertence. Esse valor é sempre `def`.

- `SCHEMA_NAME`

  O nome do esquema.

- `OPTIONS`

  As opções para o esquema. Se o esquema for somente de leitura, o valor contém `READ ONLY=1`. Se o esquema não for somente de leitura, a opção `READ ONLY` não aparece.

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

- `SCHEMATA_EXTENSIONS` é uma tabela não padrão `INFORMATION_SCHEMA`.
