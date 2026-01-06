### 12.16.6 Funções de conversão de formato de geometria

O MySQL suporta as funções listadas nesta seção para converter valores de geometria do formato de geometria interna para o formato WKT ou WKB.

Há também funções para converter uma string do formato WKT ou WKB para o formato de geometria interna. Veja a Seção 12.16.3, “Funções que criam valores de geometria a partir de valores WKT”, e a Seção 12.16.4, “Funções que criam valores de geometria a partir de valores WKB”.

- `AsBinary(g)`, `AsWKB(g)`

  `ST_AsBinary()`, `ST_AsWKB()`, `AsBinary()` e `AsWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_AsBinary()`.

  `AsBinary()` e `AsWKB()` estão desatualizados; espere que eles sejam removidos em uma futura versão do MySQL. Use `ST_AsBinary()` e `ST_AsWKB()` em vez disso.

- `AsText(g)`, `AsWKT(g)`

  `ST_AsText()`, `ST_AsWKT()`, `AsText()` e `AsWKT()` são sinônimos. Para mais informações, consulte a descrição de `ST_AsText()`.

  `AsText()` e `AsWKT()` estão desatualizados; espere que eles sejam removidos em uma futura versão do MySQL. Use `ST_AsText()` e `ST_AsWKT()` em vez disso.

- `ST_AsBinary(g)`, `ST_AsWKB(g)`

  Converte um valor no formato de geometria interna para sua representação WKB e retorna o resultado binário.

  Se o argumento for `NULL`, o valor de retorno será `NULL`. Se o argumento não for uma geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

  ```sql
  SELECT ST_AsBinary(g) FROM geom;
  ```

  `ST_AsBinary()`, `ST_AsWKB()`, `AsBinary()` e `AsWKB()` são sinônimos.

- `ST_AsText(g)`, `ST_AsWKT(g)`

  Converte um valor no formato de geometria interna para sua representação WKT e retorna o resultado como uma string.

  Se o argumento for `NULL`, o valor de retorno será `NULL`. Se o argumento não for uma geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

  ```sql
  mysql> SET @g = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@g));
  +--------------------------------+
  | ST_AsText(ST_GeomFromText(@g)) |
  +--------------------------------+
  | LINESTRING(1 1,2 2,3 3)        |
  +--------------------------------+
  ```

  `ST_AsText()`, `ST_AsWKT()`, `AsText()` e `AsWKT()` são sinônimos.

  A saída para os valores de `MultiPoint` inclui parênteses ao redor de cada ponto. Por exemplo:

  ```sql
  mysql> SET @mp = 'MULTIPOINT(1 1, 2 2, 3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@mp));
  +---------------------------------+
  | ST_AsText(ST_GeomFromText(@mp)) |
  +---------------------------------+
  | MULTIPOINT((1 1),(2 2),(3 3))   |
  +---------------------------------+
  ```
