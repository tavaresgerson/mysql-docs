### 28.3.31 A tabela INFORMATION\_SCHEMA SCHEMATA

Um esquema é um banco de dados, então a tabela `SCHEMATA` fornece informações sobre bancos de dados.

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

- `DEFAULT_ENCRYPTION`

  A criptografia padrão do esquema. Esta coluna foi adicionada no MySQL 8.0.16.

Os nomes dos esquemas também estão disponíveis na declaração `SHOW DATABASES`. Veja a Seção 15.7.7.14, “Declaração SHOW DATABASES”. As seguintes declarações são equivalentes:

```
SELECT SCHEMA_NAME AS `Database`
  FROM INFORMATION_SCHEMA.SCHEMATA
  [WHERE SCHEMA_NAME LIKE 'wild']

SHOW DATABASES
  [LIKE 'wild']
```

Você só verá os bancos de dados para os quais você tenha algum tipo de privilégio, a menos que você tenha o privilégio global `SHOW DATABASES`.

Cuidado

Como qualquer privilégio global estático é considerado um privilégio para todas as bases de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de base de dados com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` de `INFORMATION_SCHEMA`, exceto as bases de dados que foram restringidas ao nível da base de dados por revogações parciais.

#### Notas

- A tabela `SCHEMATA_EXTENSIONS` complementa a tabela `SCHEMATA` com informações sobre as opções do esquema.
