### 11.4.5 Criando Colunas Espaciais

O MySQL oferece uma maneira padrão de criar colunas espaciais para tipos de geometria, por exemplo, com `CREATE TABLE` ou `ALTER TABLE`. Colunas espaciais são suportadas para tabelas `MyISAM`, `InnoDB`, `NDB` e `ARCHIVE`. Veja também as notas sobre índices espaciais na Seção 11.4.9, “Criando Índices Espaciais”.

- Use a instrução `CREATE TABLE` para criar uma tabela com uma coluna espacial:

  ```sql
  CREATE TABLE geom (g GEOMETRY);
  ```

- Use a instrução `ALTER TABLE` para adicionar ou excluir uma coluna espacial de uma tabela existente:

  ```sql
  ALTER TABLE geom ADD pt POINT;
  ALTER TABLE geom DROP pt;
  ```
