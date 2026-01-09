### 24.3.22 A tabela INFORMATION_SCHEMA SCHEMATA

Um esquema é um banco de dados, então a tabela `SCHEMATA` fornece informações sobre os bancos de dados.

A tabela `SCHEMATA` tem essas colunas:

- `CATALOG_NAME`

  O nome do catálogo ao qual o esquema pertence. Esse valor é sempre `def`.

- `SCHEMA_NAME`

  O nome do esquema.

- `DEFAULT_CHARACTER_SET_NAME`

  O conjunto de caracteres padrão do esquema.

- `DEFAULT_COLLATION_NAME`

  A concordância padrão do esquema.

- `SQL_PATH`

  Esse valor é sempre `NULL`.

Os nomes dos esquemas também estão disponíveis na instrução `SHOW DATABASES`. Veja Seção 13.7.5.14, “Instrução SHOW DATABASES”. As seguintes instruções são equivalentes:

```sql
SELECT SCHEMA_NAME AS `Database`
  FROM INFORMATION_SCHEMA.SCHEMATA
  [WHERE SCHEMA_NAME LIKE 'wild']

SHOW DATABASES
  [LIKE 'wild']
```

Você só verá os bancos de dados para os quais você tenha algum tipo de privilégio, a menos que você tenha o privilégio global `SHOW DATABASES`.

Cuidado

Como um privilégio global é considerado um privilégio para todas as bases de dados, *qualquer* privilégio global permite que um usuário veja todos os nomes de bases de dados com `SHOW DATABASES` ou examinando a tabela `INFORMATION_SCHEMA` `SCHEMATA`.
