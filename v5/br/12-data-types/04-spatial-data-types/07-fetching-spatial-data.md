### 11.4.7 Recuperando Dados Espaciais

Valores Geometry armazenados em uma tabela podem ser recuperados no formato interno. Você também pode convertê-los para o formato WKT ou WKB.

* Recuperando dados espaciais em formato interno:

  A recuperação de valores Geometry usando o formato interno pode ser útil em transferências de tabela para tabela (table-to-table transfers):

  ```sql
  CREATE TABLE geom2 (g GEOMETRY) SELECT g FROM geom;
  ```

* Recuperando dados espaciais no formato WKT:

  A função `ST_AsText()` converte uma Geometry do formato interno para uma string WKT.

  ```sql
  SELECT ST_AsText(g) FROM geom;
  ```

* Recuperando dados espaciais no formato WKB:

  A função `ST_AsBinary()` converte uma Geometry do formato interno para um `BLOB` contendo o valor WKB.

  ```sql
  SELECT ST_AsBinary(g) FROM geom;
  ```