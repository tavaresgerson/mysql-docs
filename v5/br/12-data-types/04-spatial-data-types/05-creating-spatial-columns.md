### 11.4.5 Criação de Colunas Espaciais

O MySQL fornece uma maneira padrão de criar colunas espaciais para *geometry types* (tipos de geometria), por exemplo, usando `CREATE TABLE` ou `ALTER TABLE`. Colunas espaciais são suportadas para tabelas `MyISAM`, `InnoDB`, `NDB` e `ARCHIVE`. Consulte também as notas sobre *spatial indexes* na Seção 11.4.9, “Criação de Indexes Espaciais”.

* Use a instrução `CREATE TABLE` para criar uma tabela com uma coluna espacial:

  ```sql
  CREATE TABLE geom (g GEOMETRY);
  ```

* Use a instrução `ALTER TABLE` para adicionar ou remover (*drop*) uma coluna espacial a ou de uma tabela existente:

  ```sql
  ALTER TABLE geom ADD pt POINT;
  ALTER TABLE geom DROP pt;
  ```