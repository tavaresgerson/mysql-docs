### 13.4.8 Recuperação de Dados Espaciais

Os valores de geometria armazenados em uma tabela podem ser recuperados no formato interno. Você também pode convertê-los para o formato WKT ou WKB.

* Recuperação de dados espaciais no formato interno:

  A recuperação de valores de geometria usando o formato interno pode ser útil em transferências entre tabelas:

  ```
  CREATE TABLE geom2 (g GEOMETRY) SELECT g FROM geom;
  ```

* Recuperação de dados espaciais no formato WKT:

  A função `ST_AsText()` converte uma geometria do formato interno para uma string WKT.

  ```
  SELECT ST_AsText(g) FROM geom;
  ```

* Recuperação de dados espaciais no formato WKB:

  A função `ST_AsBinary()` converte uma geometria do formato interno para um `BLOB` contendo o valor WKB.

  ```
  SELECT ST_AsBinary(g) FROM geom;
  ```