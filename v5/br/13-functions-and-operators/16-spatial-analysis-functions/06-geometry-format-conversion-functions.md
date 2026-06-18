### 12.16.6 Funções de Conversão de Formato Geometry

O MySQL suporta as funções listadas nesta seção para converter valores geometry do formato geometry interno para o formato WKT ou WKB.

Existem também funções para converter uma string do formato WKT ou WKB para o formato geometry interno. Consulte a Seção 12.16.3, “Funções Que Criam Valores Geometry a Partir de Valores WKT”, e a Seção 12.16.4, “Funções Que Criam Valores Geometry a Partir de Valores WKB”.

* `AsBinary(g)`, `AsWKB(g)`

  `ST_AsBinary()`, `ST_AsWKB()`, `AsBinary()` e `AsWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_AsBinary()`.

  `AsBinary()` e `AsWKB()` estão obsoletas (deprecated); espere que sejam removidas em uma futura versão do MySQL. Use `ST_AsBinary()` e `ST_AsWKB()` em vez disso.

* `AsText(g)`, `AsWKT(g)`

  `ST_AsText()`, `ST_AsWKT()`, `AsText()` e `AsWKT()` são sinônimos. Para mais informações, consulte a descrição de `ST_AsText()`.

  `AsText()` e `AsWKT()` estão obsoletas (deprecated); espere que sejam removidas em uma futura versão do MySQL. Use `ST_AsText()` e `ST_AsWKT()` em vez disso.

* `ST_AsBinary(g)`, `ST_AsWKB(g)`

  Converte um valor no formato geometry interno para sua representação WKB e retorna o resultado binário.

  Se o argumento for `NULL`, o valor de retorno é `NULL`. Se o argumento não for um geometry sintaticamente bem-formado, ocorrerá um erro `ER_GIS_INVALID_DATA`.

  ```sql
  SELECT ST_AsBinary(g) FROM geom;
  ```

  `ST_AsBinary()`, `ST_AsWKB()`, `AsBinary()` e `AsWKB()` são sinônimos.

* `ST_AsText(g)`, `ST_AsWKT(g)`

  Converte um valor no formato geometry interno para sua representação WKT e retorna o resultado string.

  Se o argumento for `NULL`, o valor de retorno é `NULL`. Se o argumento não for um geometry sintaticamente bem-formado, ocorrerá um erro `ER_GIS_INVALID_DATA`.

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

  A saída para valores `MultiPoint` inclui parênteses ao redor de cada ponto. Por exemplo:

  ```sql
  mysql> SET @mp = 'MULTIPOINT(1 1, 2 2, 3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@mp));
  +---------------------------------+
  | ST_AsText(ST_GeomFromText(@mp)) |
  +---------------------------------+
  | MULTIPOINT((1 1),(2 2),(3 3))   |
  +---------------------------------+
  ```
