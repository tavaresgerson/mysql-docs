### 24.3.22 A Tabela SCHEMATA do INFORMATION_SCHEMA

Um schema é um Database, portanto, a tabela `SCHEMATA` fornece informações sobre Databases.

A tabela `SCHEMATA` possui as seguintes colunas:

* `CATALOG_NAME`

  O nome do catalog ao qual o schema pertence. Este valor é sempre `def`.

* `SCHEMA_NAME`

  O nome do schema.

* `DEFAULT_CHARACTER_SET_NAME`

  O character set default do schema.

* `DEFAULT_COLLATION_NAME`

  O collation default do schema.

* `SQL_PATH`

  Este valor é sempre `NULL`.

Os nomes dos Schemas também estão disponíveis através da instrução `SHOW DATABASES`. Veja Seção 13.7.5.14, “SHOW DATABASES Statement”. As seguintes instruções são equivalentes:

```sql
SELECT SCHEMA_NAME AS `Database`
  FROM INFORMATION_SCHEMA.SCHEMATA
  [WHERE SCHEMA_NAME LIKE 'wild']

SHOW DATABASES
  [LIKE 'wild']
```

Você vê apenas os Databases para os quais possui algum tipo de Privilege, a menos que possua o Privilege global `SHOW DATABASES`.

Atenção

Como um Privilege global é considerado um Privilege para todos os Databases, *qualquer* Privilege global permite que um usuário veja todos os nomes de Databases com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` do `INFORMATION_SCHEMA`.