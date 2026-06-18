#### 14.16.7.4 Funções de Propriedade de Poligono e MultiPoligono

As funções nesta seção retornam propriedades dos valores de `Polygon` ou `MultiPolygon`.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

- Se qualquer argumento for `NULL` ou se qualquer argumento de geometria for uma geometria vazia, o valor de retorno será `NULL`.

- Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

- Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorrerá um erro `ER_SRS_NOT_FOUND`.

- Para funções que aceitam múltiplos argumentos de geometria, se esses argumentos não estiverem no mesmo SRS, ocorre um erro `ER_GIS_DIFFERENT_SRIDS`.

- Caso contrário, o valor de retorno não é `NULL`.

Essas funções estão disponíveis para obter propriedades de polígonos:

- `ST_Area({poly|mpoly})`

  Retorna um número de ponto duplo que indica a área do argumento `Polygon` ou `MultiPolygon`, medida em seu sistema de referência espacial.

  A partir do MySQL 8.0.13, `ST_Area()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

  - Se a geometria for geométricamente inválida, o resultado será uma área indefinida (ou seja, pode ser qualquer número) ou ocorrerá um erro.

  - Se a geometria for válida, mas não for um objeto `Polygon` ou `MultiPolygon`, ocorrerá um erro `ER_UNEXPECTED_GEOMETRY_TYPE`.

  - Se a geometria for um `Polygon` válido em um SRS cartesiano, o resultado será a área cartesiana do polígono.

  - Se a geometria for um `MultiPolygon` válido em um SRS cartesiano, o resultado é a soma da área cartesiana dos polígonos.

  - Se a geometria for um `Polygon` válido em um SRS geográfico, o resultado será a área geodésica do polígono nesse SRS, em metros quadrados.

  - Se a geometria for um `MultiPolygon` válido em um SRS geográfico, o resultado é a soma da área geodésica dos polígonos nesse SRS, em metros quadrados.

  - Se uma computação de área resultar em `+inf`, ocorrerá um erro `ER_DATA_OUT_OF_RANGE`.

  - Se a geometria tiver um SRS geográfico com uma longitude ou latitude fora do intervalo, ocorrerá um erro:

    - Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

    - Se um valor de latitude não estiver no intervalo \[−90, 90], ocorrerá um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

    As faixas mostradas são em graus. Os limites exatos das faixas variam ligeiramente devido à aritmética de ponto flutuante.

  Antes do MySQL 8.0.13, `ST_Area()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

  - Para argumentos de dimensão 0 ou 1, o resultado é 0.

  - Se uma geometria estiver vazia, o valor de retorno será 0 em vez de `NULL`.

  - Para uma coleção de geometrias, o resultado é a soma dos valores de área de todos os componentes. Se a coleção de geometrias estiver vazia, sua área será devolvida como 0.

  - Se a geometria tiver um valor SRID para um sistema de referência espacial geográfica (SRS), ocorrerá um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

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

- `ST_Centroid({poly|mpoly})`

  Retorna o centroide matemático para o argumento `Polygon` ou `MultiPolygon` como um `Point`. O resultado não é garantido estar no `MultiPolygon`.

  Essa função processa coleções de geometria, calculando o ponto central para os componentes de maior dimensão na coleção. Esses componentes são extraídos e transformados em um único `MultiPolygon`, `MultiLineString` ou `MultiPoint` para o cálculo do centroide.

  `ST_Centroid()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

  - O valor de retorno é `NULL` para a condição adicional de que o argumento é uma coleção de geometria vazia.

  - Se a geometria tiver um valor SRID para um sistema de referência espacial geográfica (SRS), ocorrerá um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

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

- `ST_ExteriorRing(poly)`

  Retorna o anel externo do valor `Polygon` `poly` como um `LineString`.

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
  ```

- `ST_InteriorRingN(poly, N)`

  Retorna o anel interno `N`-o para o valor `Polygon` `poly` como um `LineString`. Os anéis são numerados a partir do 1.

  `ST_InteriorRingN()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1));
  +-------------------------------------------------------+
  | ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1)) |
  +-------------------------------------------------------+
  | LINESTRING(1 1,1 2,2 2,2 1,1 1)                       |
  +-------------------------------------------------------+
  ```

- `ST_NumInteriorRing(poly)`, `ST_NumInteriorRings(poly)`

  Retorna o número de anéis internos no valor `Polygon` \* \[\[`poly`] ].

  `ST_NumInteriorRing()` e `ST_NuminteriorRings()` lidam com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_NumInteriorRings(ST_GeomFromText(@poly));
  +---------------------------------------------+
  | ST_NumInteriorRings(ST_GeomFromText(@poly)) |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  ```
