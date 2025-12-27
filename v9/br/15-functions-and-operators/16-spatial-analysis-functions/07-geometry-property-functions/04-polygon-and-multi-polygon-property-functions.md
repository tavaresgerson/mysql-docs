#### 14.16.7.4 Funções de Propriedades de Polígono e Multipolígono

As funções desta seção retornam propriedades dos valores `Polygon` ou `MultiPolygon`.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL` ou se qualquer argumento de geometria for uma geometria vazia, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial (SRS) indefinido, ocorre um erro `ER_SRS_NOT_FOUND`.

* Para funções que aceitam múltiplos argumentos de geometria, se esses argumentos não estiverem no mesmo SRS, ocorre um erro `ER_GIS_DIFFERENT_SRIDS`.

* Caso contrário, o valor de retorno não é `NULL`.

Estas funções estão disponíveis para obter propriedades de polígono:

* `ST_Area({poly|mpoly})`

  Retorna um número de ponto flutuante de precisão dupla indicando a área do argumento `Polygon` ou `MultiPolygon`, medida em seu sistema de referência espacial.

  O `ST_Area()` trata seus argumentos conforme descrito na introdução desta seção, com estas exceções:

  + Se a geometria for geometricamente inválida, o resultado é uma área indefinida (ou seja, pode ser qualquer número), ou ocorre um erro.

  + Se a geometria for válida, mas não for um objeto `Polygon` ou `MultiPolygon`, ocorre um erro `ER_UNEXPECTED_GEOMETRY_TYPE`.

  + Se a geometria for um `Polygon` válido em um SRS cartesiano, o resultado é a área cartesiana do polígono.

  + Se a geometria for um `MultiPolygon` válido em um SRS cartesiano, o resultado é a soma das áreas cartesianas dos polígonos.

  + Se a geometria for um `Polygon` válido em um SRS geográfico, o resultado é a área geodésica do polígono nesse SRS, em metros quadrados.

+ Se a geometria for um `MultiPolygon` válido em um SRS geográfico, o resultado é a soma da área geodésica dos polígonos nesse SRS, em metros quadrados.

+ Se o cálculo de área resultar em `+inf`, ocorre um erro `ER_DATA_OUT_OF_RANGE`.

+ Se a geometria tiver um SRS geográfico com uma longitude ou latitude fora do intervalo, ocorre um erro:

    - Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE`.

    - Se um valor de latitude não estiver no intervalo [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE`.

    Os intervalos mostrados são em graus. Os limites exatos dos intervalos diferem ligeiramente devido à aritmética de ponto flutuante.

```
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

* `ST_Centroid({poly|mpoly})`

  Retorna o centro matemático para o argumento `Polygon` ou `MultiPolygon` como um `Point`. O resultado não é garantido estar no `MultiPolygon`.

  Esta função processa coleções de geometria calculando o ponto central para componentes de maior dimensão na coleção. Tais componentes são extraídos e transformados em um único `MultiPolygon`, `MultiLineString` ou `MultiPoint` para o cálculo do centro.

  `ST_Centroid()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

  + O valor de retorno é `NULL` para a condição adicional de que o argumento é uma coleção de geometria vazia.

  + Se a geometria tiver um valor de SRID para um sistema de referência espacial geográfico (SRS), ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

```
  mysql> SET @poly =
         ST_GeomFromText('POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7,5 5))');
  mysql> SELECT ST_GeometryType(@poly),ST_AsText(ST_Centroid(@poly));
  +------------------------+--------------------------------------------+
  | ST_GeometryType(@poly) | ST_AsText(ST_Centroid(@poly))              |
  +------------------------+--------------------------------------------+
  | POLYGON                | POINT(4.958333333333333 4.958333333333333) |
  +------------------------+--------------------------------------------+
  ```

* `ST_ExteriorRing(poly)`

  Retorna o anel exterior do valor `Polygon` *`poly`* como um `LineString`.

  `ST_ExteriorRing()` lida com seus argumentos conforme descrito na introdução desta seção.

```
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_AsText(ST_ExteriorRing(ST_GeomFromText(@poly)));
  +----------------------------------------------------+
  | ST_AsText(ST_ExteriorRing(ST_GeomFromText(@poly))) |
  +----------------------------------------------------+
  | LINESTRING(0 0,0 3,3 3,3 0,0 0)                    |
  +----------------------------------------------------+
  ```aTGnPJbr5Z```
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1));
  +-------------------------------------------------------+
  | ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1)) |
  +-------------------------------------------------------+
  | LINESTRING(1 1,1 2,2 2,2 1,1 1)                       |
  +-------------------------------------------------------+
  ```Im19GNUkJS```