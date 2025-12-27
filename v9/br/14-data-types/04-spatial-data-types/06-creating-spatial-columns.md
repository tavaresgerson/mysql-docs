### 13.4.6 Criando Colunas Espaciais

O MySQL oferece uma maneira padrão de criar colunas espaciais para tipos de geometria, por exemplo, com `CREATE TABLE` ou `ALTER TABLE`. Colunas espaciais são suportadas para tabelas `MyISAM`, `InnoDB`, `NDB` e `ARCHIVE`. Veja também as notas sobre índices espaciais na Seção 13.4.10, “Criando Índices Espaciais”.

Colunas com um tipo de dados espacial podem ter um atributo SRID, para indicar explicitamente o sistema de referência espacial (SRS) para os valores armazenados na coluna. Para as implicações de uma coluna com SRID restrito, consulte a Seção 13.4.1, “Tipos de Dados Espaciais”.

* Use a instrução `CREATE TABLE` para criar uma tabela com uma coluna espacial:

  ```
  CREATE TABLE geom (g GEOMETRY);
  ```

* Use a instrução `ALTER TABLE` para adicionar ou remover uma coluna espacial de uma tabela existente:

  ```
  ALTER TABLE geom ADD pt POINT;
  ALTER TABLE geom DROP pt;
  ```