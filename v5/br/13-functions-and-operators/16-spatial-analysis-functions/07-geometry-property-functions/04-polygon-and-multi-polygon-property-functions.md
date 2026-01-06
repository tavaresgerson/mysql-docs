#### 12.16.7.4 Funções de Propriedade de Poligono e MultiPoligono

As funções nesta seção retornam propriedades dos valores de `Polygon` ou `MultiPolygon`.

- `Área({poly|mpoly})`

  `ST_Area()` e `Area()` são sinônimos. Para mais informações, consulte a descrição de `ST_Area()`.

  `Area()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_Area()` em vez disso.

- `Centroid({poly|mpoly})`

  `ST_Centroid()` e `Centroid()` são sinônimos. Para mais informações, consulte a descrição de `ST_Centroid()`.

  `Centroid()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_Centroid()` em vez disso.

- `ExteriorRing(poly)`

  `ST_ExteriorRing()` e `ExteriorRing()` são sinônimos. Para mais informações, consulte a descrição de `ST_ExteriorRing()`.

  `ExteriorRing()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_ExteriorRing()` em vez disso.

- `InteriorRingN(poly, N)`

  `ST_InteriorRingN()` e `InteriorRingN()` são sinônimos. Para mais informações, consulte a descrição de `ST_InteriorRingN()`.

  `InteriorRingN()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_InteriorRingN()` em vez disso.

- `NumInteriorRings(poly)`

  `ST_NumInteriorRings()` e `NumInteriorRings()` são sinônimos. Para mais informações, consulte a descrição de `ST_NumInteriorRings()`.

  `NumInteriorRings()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_NumInteriorRings()` em vez disso.

- `ST_Área({poly|mpoly})`

  Retorna um número de ponto dupla que indica a área do argumento `Polygon` ou `MultiPolygon`, medida em seu sistema de referência espacial. Para argumentos de dimensão 0 ou 1, o resultado é 0. Se o argumento for uma geometria vazia, o valor de retorno é 0. Se o argumento for `NULL`, o valor de retorno é `NULL`.

  O resultado é a soma dos valores de área de todos os componentes de uma coleção de geometrias. Se uma coleção de geometrias estiver vazia, sua área será devolvida como 0.

  ```sql
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 0,0 0),(1 1,1 2,2 1,1 1))';
  mysql> SELECT ST_Area(ST_GeomFromText(@poly));
  +---------------------------------+
  | ST_Area(ST_GeomFromText(@poly)) |
  +---------------------------------+
  |                               4 |
  +---------------------------------+

  mysql> SET @mpoly =
         'MultiPolygon(((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1)))';
  mysql> SELECT ST_Area(ST_GeomFromText(@mpoly));
  +----------------------------------+
  | ST_Area(ST_GeomFromText(@mpoly)) |
  +----------------------------------+
  |                                8 |
  +----------------------------------+
  ```

  `ST_Area()` e `Area()` são sinônimos.

- `ST_Centroid({poly|mpoly})`

  Retorna o centroide matemático para o argumento `Polygon` ou `MultiPolygon` como um `Point`. O resultado não é garantido estar na `MultiPolygon`. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno será `NULL`.

  Essa função processa coleções de geometria, calculando o ponto central para os componentes de maior dimensão na coleção. Esses componentes são extraídos e transformados em um único `MultiPolygon`, `MultiLineString` ou `MultiPoint` para o cálculo do centroide. Se o argumento for uma coleção de geometria vazia, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @poly =
         ST_GeomFromText('POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7,5 5))');
  mysql> SELECT ST_GeometryType(@poly),ST_AsText(ST_Centroid(@poly));
  +------------------------+--------------------------------------------+
  | ST_GeometryType(@poly) | ST_AsText(ST_Centroid(@poly))              |
  +------------------------+--------------------------------------------+
  | POLYGON                | POINT(4.958333333333333 4.958333333333333) |
  +------------------------+--------------------------------------------+
  ```

  `ST_Centroid()` e `Centroid()` são sinônimos.

- `ST_ExteriorRing(poly)`

  Retorna o anel externo do valor `Polygon` *`poly`* como uma `LineString`. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno será `NULL`.

  ```sql
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_AsText(ST_ExteriorRing(ST_GeomFromText(@poly)));
  +----------------------------------------------------+
  | ST_AsText(ST_ExteriorRing(ST_GeomFromText(@poly))) |
  +----------------------------------------------------+
  | LINESTRING(0 0,0 3,3 3,3 0,0 0)                    |
  +----------------------------------------------------+
  ```

  `ST_ExteriorRing()` e `ExteriorRing()` são sinônimos.

- `ST_InteriorRingN(poly, N)`

  Retorna o anel interno *`N`*-ésimo para o valor `Polygon` *`poly`* como uma `LineString`. Os anéis são numerados a partir de 1. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1));
  +-------------------------------------------------------+
  | ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1)) |
  +-------------------------------------------------------+
  | LINESTRING(1 1,1 2,2 2,2 1,1 1)                       |
  +-------------------------------------------------------+
  ```

  `ST_InteriorRingN()` e `InteriorRingN()` são sinônimos.

- `ST_NumInteriorRing(poly)`, `ST_NumInteriorRings(poly)`

  Retorna o número de anéis internos no valor `Polygon` *`poly`*. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno será `NULL`.

  ```sql
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_NumInteriorRings(ST_GeomFromText(@poly));
  +---------------------------------------------+
  | ST_NumInteriorRings(ST_GeomFromText(@poly)) |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  ```

  `ST_NumInteriorRing()`, `ST_NumInteriorRings()` e `NumInteriorRings()` são sinônimos.
