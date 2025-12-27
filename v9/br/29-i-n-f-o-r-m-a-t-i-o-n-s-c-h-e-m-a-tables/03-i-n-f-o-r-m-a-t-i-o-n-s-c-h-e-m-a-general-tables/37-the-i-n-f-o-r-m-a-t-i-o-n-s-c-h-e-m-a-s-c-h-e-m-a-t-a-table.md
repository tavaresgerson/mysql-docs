### 28.3.37 A Tabela SCHEMATA INFORMATION_SCHEMA

Um esquema é um banco de dados, portanto, a tabela `SCHEMATA` fornece informações sobre os bancos de dados.

A tabela `SCHEMATA` tem as seguintes colunas:

* `CATALOG_NAME`

  O nome do catálogo ao qual o esquema pertence. Esse valor é sempre `def`.

* `SCHEMA_NAME`

  O nome do esquema.

* `DEFAULT_CHARACTER_SET_NAME`

  O conjunto de caracteres padrão do esquema.

* `DEFAULT_COLLATION_NAME`

  A collation padrão do esquema.

* `SQL_PATH`

  Esse valor é sempre `NULL`.

* `DEFAULT_ENCRYPTION`

  A criptografia padrão do esquema.

Os nomes dos esquemas também estão disponíveis a partir da instrução `SHOW DATABASES`. Veja a Seção 15.7.7.16, “Instrução SHOW DATABASES”. As seguintes instruções são equivalentes:

```
SELECT SCHEMA_NAME AS `Database`
  FROM INFORMATION_SCHEMA.SCHEMATA
  [WHERE SCHEMA_NAME LIKE 'wild']

SHOW DATABASES
  [LIKE 'wild']
```

Você só verá os bancos de dados para os quais você tem algum tipo de privilégio, a menos que você tenha o privilégio global `SHOW DATABASES`.

Cuidado

Como qualquer privilégio global estático é considerado um privilégio para todos os bancos de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de bancos de dados com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` de `INFORMATION_SCHEMA`, exceto bancos de dados que tenham sido restringidos no nível do banco de dados por revogações parciais.

#### Notas

* A tabela `SCHEMATA_EXTENSIONS` complementa a tabela `SCHEMATA` com informações sobre as opções do esquema.