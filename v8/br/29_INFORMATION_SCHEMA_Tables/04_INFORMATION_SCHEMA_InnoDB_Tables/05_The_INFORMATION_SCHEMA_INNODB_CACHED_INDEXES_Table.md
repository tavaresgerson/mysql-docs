### 28.4.5 A tabela INFORMATION\_SCHEMA INNODB\_CACHED\_INDEXES

A tabela `INNODB_CACHED_INDEXES` relata o número de páginas de índice armazenadas em cache no pool de buffer `InnoDB` para cada índice.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.5, “Tabelas do Banco de Armazenamento do InnoDB INFORMATION\_SCHEMA”.

A tabela `INNODB_CACHED_INDEXES` tem essas colunas:

- `SPACE_ID`

  O ID do espaço de tabelas.

- `INDEX_ID`

  Um identificador para o índice. Os identificadores de índice são únicos em todas as bases de dados de uma instância.

- `N_CACHED_PAGES`

  O número total de páginas de índice armazenadas em cache no pool de buffers `InnoDB` para um índice específico desde que o MySQL Server foi iniciado pela última vez.

#### Exemplos

Essa consulta retorna o número de páginas de índice armazenadas em cache no pool de buffers `InnoDB` para um índice específico:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_CACHED_INDEXES WHERE INDEX_ID=65\G
*************************** 1. row ***************************
      SPACE_ID: 4294967294
      INDEX_ID: 65
N_CACHED_PAGES: 45
```

Essa consulta retorna o número de páginas de índice armazenadas em cache no pool de buffers `InnoDB` para cada índice, usando as tabelas `INNODB_INDEXES` e `INNODB_TABLES` para resolver o nome da tabela e o nome do índice para cada valor `INDEX_ID`.

```
SELECT
  tables.NAME AS table_name,
  indexes.NAME AS index_name,
  cached.N_CACHED_PAGES AS n_cached_pages
FROM
  INFORMATION_SCHEMA.INNODB_CACHED_INDEXES AS cached,
  INFORMATION_SCHEMA.INNODB_INDEXES AS indexes,
  INFORMATION_SCHEMA.INNODB_TABLES AS tables
WHERE
  cached.INDEX_ID = indexes.INDEX_ID
  AND indexes.TABLE_ID = tables.TABLE_ID;
```

#### Notas

- Você deve ter o privilégio `PROCESS` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
