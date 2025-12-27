### 14.16.8 Funções Operadoras Espaciais

O OpenGIS propõe várias funções que podem produzir geometrias. Elas são projetadas para implementar operadores espaciais. Essas funções suportam todas as combinações de tipos de argumentos, exceto aquelas que são inapropriadas de acordo com a especificação do Consórcio de Geoespacial Open.

O MySQL também implementa certas funções que são extensões do OpenGIS, conforme observado nas descrições das funções. Além disso, a Seção 14.16.7, “Funções de Propriedades Geométrica”, discute várias funções que constroem novas geometrias a partir de outras existentes. Veja essa seção para descrições dessas funções:

*  `ST_Envelope(g)`
*  `ST_StartPoint(ls)`
*  `ST_EndPoint(ls)`
* `ST_PointN(ls, N)`
*  `ST_ExteriorRing(poly)`
* `ST_InteriorRingN(poly, N)`
* `ST_GeometryN(gc, N)`

A menos que especificado de outra forma, as funções nesta seção tratam seus argumentos geométricos da seguinte forma:

* Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.
* Se qualquer argumento geométrico não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.
* Se qualquer argumento geométrico for uma geometria sintaticamente bem formada em um sistema de referência espacial (SRS) indefinido, ocorre um erro `ER_SRS_NOT_FOUND`.
* Para funções que aceitam múltiplos argumentos geométricos, se esses argumentos não estiverem no mesmo SRS, ocorre um erro `ER_GIS_DIFFERENT_SRIDS`.
* Se qualquer argumento geométrico tiver um valor SRID para um SRS geográfico e a função não lidar com geometrias geográficas, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.
* Para argumentos de geometria SRS geográficas, se qualquer argumento tiver uma longitude ou latitude fora do intervalo, ocorre um erro:

  + Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE`.
  + Se um valor de latitude não estiver no intervalo [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE`.

Os intervalos mostrados são em graus. Se um SRS usar outra unidade, o intervalo usa os valores correspondentes em sua unidade. Os limites exatos do intervalo diferem ligeiramente devido à aritmética de ponto flutuante.
* Caso contrário, o valor de retorno não é `NULL`.

Esses operadores espaciais estão disponíveis:

[`ST_Buffer(g, d [, strategy1 [, strategy2 [, strategy3]]])`](https://docs.oracle.com/en/database/sql/t-sql/dev/st-buffer.aspx#function_st-buffer)

  Retorna uma geometria que representa todos os pontos cuja distância do valor de geometria *`g`* é menor ou igual a uma distância de *`d`*. O resultado está na mesma SRS da argumento de geometria.

  Se o argumento de geometria estiver vazio, o `ST_Buffer()` retorna uma geometria vazia.

  Se a distância for 0, o `ST_Buffer()` retorna o argumento de geometria inalterado:

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 0));
  +------------------------------+
  | ST_AsText(ST_Buffer(@pt, 0)) |
  +------------------------------+
  | POINT(0 0)                   |
  +------------------------------+
  ```

  Se o argumento de geometria estiver em uma SRS cartesiana:

  + O `ST_Buffer()` suporta distâncias negativas para valores de `Polygon` e `MultiPolygon` e para coleções de geometria contendo valores de `Polygon` ou `MultiPolygon`.
  + Se o resultado for reduzido tanto que desaparece, o resultado é uma geometria vazia.
  + Um erro `ER_WRONG_ARGUMENTS` ocorre para o `ST_Buffer()` com uma distância negativa para valores de `Point`, `MultiPoint`, `LineString` e `MultiLineString`, e para coleções de geometria que não contêm nenhum valor de `Polygon` ou `MultiPolygon`.

  Geometrias `Point` em uma SRS geográfica são permitidas, sujeito às seguintes condições:

  + Se a distância não for negativa e nenhuma estratégia for especificada, o função retorna o buffer geográfico do `Point` em sua SRS. O argumento de distância deve estar na unidade de distância da SRS (atualmente sempre metros).
  + Se a distância for negativa ou qualquer estratégia (exceto `NULL`) for especificada, ocorre um erro `ER_WRONG_ARGUMENTS`.

  Para geometrias não `Point`, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

`ST_Buffer()` permite até três argumentos de estratégia opcionais após o argumento de distância. As estratégias influenciam o cálculo do buffer. Esses argumentos são valores de string de bytes produzidos pela função `ST_Buffer_Strategy()`, a serem usados para estratégias de ponto, junção e fim:

  + Estratégias de ponto aplicam-se a geometrias `Point` e `MultiPoint`. Se nenhuma estratégia de ponto for especificada, o padrão é `ST_Buffer_Strategy('point_circle', 32)`.
  + Estratégias de junção aplicam-se a geometrias `LineString`, `MultiLineString`, `Polygon` e `MultiPolygon`. Se nenhuma estratégia de junção for especificada, o padrão é `ST_Buffer_Strategy('join_round', 32)`.
  + Estratégias de fim aplicam-se a geometrias `LineString` e `MultiLineString`. Se nenhuma estratégia de fim for especificada, o padrão é `ST_Buffer_Strategy('end_round', 32)`.

  Pode-se especificar até uma estratégia de cada tipo, e elas podem ser fornecidas em qualquer ordem.

  Se as estratégias de buffer forem inválidas, ocorre um erro `ER_WRONG_ARGUMENTS`. As estratégias são inválidas sob qualquer uma dessas circunstâncias:

  + Múltiplas estratégias de um determinado tipo (ponto, junção ou fim) são especificadas.
  + Um valor que não é uma estratégia (como uma string binária arbitrária ou um número) é passado como estratégia.
  + Uma estratégia de `Point` é passada e a geometria não contém valores de `Point` ou `MultiPoint`.
  + Uma estratégia de fim ou junção é passada e a geometria não contém valores de `LineString`, `Polygon`, `MultiLineString` ou `MultiPolygon`.

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SET @pt_strategy = ST_Buffer_Strategy('point_square');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 2, @pt_strategy));
  +--------------------------------------------+
  | ST_AsText(ST_Buffer(@pt, 2, @pt_strategy)) |
  +--------------------------------------------+
  | POLYGON((-2 -2,2 -2,2 2,-2 2,-2 -2))       |
  +--------------------------------------------+
  ```

  ```
  mysql> SET @ls = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)');
  mysql> SET @end_strategy = ST_Buffer_Strategy('end_flat');
  mysql> SET @join_strategy = ST_Buffer_Strategy('join_round', 10);
  mysql> SELECT ST_AsText(ST_Buffer(@ls, 5, @end_strategy, @join_strategy))
  +---------------------------------------------------------------+
  | ST_AsText(ST_Buffer(@ls, 5, @end_strategy, @join_strategy))   |
  +---------------------------------------------------------------+
  | POLYGON((5 5,5 10,0 10,-3.5355339059327373 8.535533905932738, |
  | -5 5,-5 0,0 0,5 0,5 5))                                       |
  +---------------------------------------------------------------+
  ```
* `ST_Buffer_Strategy(strategy [, points_per_circle])`

  Esta função retorna uma string de byte de estratégia para uso com `ST_Buffer()` para influenciar o cálculo do buffer.

  Informações sobre estratégias estão disponíveis no Boost.org.

  O primeiro argumento deve ser uma string indicando uma opção de estratégia:

+ Para estratégias de ponto, os valores permitidos são `'point_circle'` e `'point_square'`.
  + Para estratégias de junção, os valores permitidos são `'join_round'` e `'join_miter'`.
  + Para estratégias de extremidade, os valores permitidos são `'end_round'` e `'end_flat'`.

  Se o primeiro argumento for `'point_circle'`, `'join_round'`, `'join_miter'` ou `'end_round'`, o argumento *`points_per_circle`* deve ser fornecido como um valor numérico positivo. O valor máximo de *`points_per_circle`* é o valor da variável de sistema `max_points_in_geometry`.

  Para exemplos, consulte a descrição de `ST_Buffer()`.

   `ST_Buffer_Strategy()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

  + Se qualquer argumento for inválido, ocorrerá um erro `ER_WRONG_ARGUMENTS`.
  + Se o primeiro argumento for `'point_square'` ou `'end_flat'`, o argumento *`points_per_circle`* não deve ser fornecido ou ocorrerá um erro `ER_WRONG_ARGUMENTS`.
*  `ST_ConvexHull(g)`

  Retorna uma geometria que representa o casco convexo do valor de geometria *`g`*.

  Esta função computa o casco convexo de uma geometria verificando primeiro se seus pontos de vértice são colineares. A função retorna um casco linear se for o caso, um casco poligonal caso contrário. Esta função processa coleções de geometrias extraindo todos os pontos de vértice de todos os componentes da coleção, criando um valor `MultiPoint` a partir deles e calculando seu casco convexo.

   `ST_ConvexHull()` lida com seus argumentos conforme descrito na introdução desta seção, com esta exceção:

  + O valor de retorno é `NULL` para a condição adicional de que o argumento é uma coleção de geometria vazia.

  ```
  mysql> SET @g = 'MULTIPOINT(5 0,25 0,15 10,15 25)';
  mysql> SELECT ST_AsText(ST_ConvexHull(ST_GeomFromText(@g)));
  +-----------------------------------------------+
  | ST_AsText(ST_ConvexHull(ST_GeomFromText(@g))) |
  +-----------------------------------------------+
  | POLYGON((5 0,25 0,15 25,5 0))                 |
  +-----------------------------------------------+
  ```
* `ST_Difference(g1, g2)`

  Retorna uma geometria que representa a diferença de conjuntos de pontos dos valores de geometria *`g1`* e *`g2`*. O resultado está no mesmo SRS da geometria dos argumentos.

   `ST_Difference()` permite argumentos em um SRS cartesiano ou geográfico e lida com seus argumentos conforme descrito na introdução desta seção.

```
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_AsText(ST_Difference(@g1, @g2));
  +------------------------------------+
  | ST_AsText(ST_Difference(@g1, @g2)) |
  +------------------------------------+
  | POINT(1 1)                         |
  +------------------------------------+
  ```
* `ST_Intersection(g1, g2)`

Retorna uma geometria que representa a interseção do conjunto de pontos das geometrias *`g1`* e *`g2`*. O resultado está no mesmo SRS (Sistema de Referência Espacial) que os argumentos de geometria.

`ST_Intersection()` permite argumentos em um SRS (Sistema de Referência Espacial) cartesiano ou geográfico, e lida com seus argumentos conforme descrito na introdução desta seção.

```
  mysql> SET @g1 = ST_GeomFromText('LineString(1 1, 3 3)');
  mysql> SET @g2 = ST_GeomFromText('LineString(1 3, 3 1)');
  mysql> SELECT ST_AsText(ST_Intersection(@g1, @g2));
  +--------------------------------------+
  | ST_AsText(ST_Intersection(@g1, @g2)) |
  +--------------------------------------+
  | POINT(2 2)                           |
  +--------------------------------------+
  ```
* `ST_LineInterpolatePoint(ls, fractional_distance)`

Esta função recebe uma geometria `LineString` e uma distância fracionária no intervalo [0.0, 1.0] e retorna o `Point` ao longo da `LineString` na fração dada da distância de seu ponto de início até seu ponto final. Pode ser usada para responder a perguntas como qual `Point` está à metade da estrada descrita pelo argumento de geometria.

A função é implementada para geometrias `LineString` em todos os sistemas de referência espacial, tanto cartesianos quanto geográficos.

Se o argumento *`fractional_distance`* for 1.0, o resultado pode não ser exatamente o último ponto da `LineString` do argumento, mas um ponto próximo a ele devido a imprecisões numéricas em cálculos de valor aproximado.

Uma função relacionada, `ST_LineInterpolatePoints()`, recebe argumentos semelhantes, mas retorna um `MultiPoint` consistindo de valores de `Point` ao longo da `LineString` em cada fração da distância de seu ponto de início até seu ponto final. Para exemplos de ambas as funções, consulte a descrição de `ST_LineInterpolatePoints()`.

`ST_LineInterpolatePoint()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Se o argumento de geometria não for uma `LineString`, ocorre um erro `ER_UNEXPECTED_GEOMETRY_TYPE`.
+ Se o argumento de distância fracionária estiver fora do intervalo [0.0, 1.0], ocorre um erro `ER_DATA_OUT_OF_RANGE`.

`ST_LineInterpolatePoint()` é uma extensão do MySQL para OpenGIS.
* `ST_LineInterpolatePoints(ls, fractional_distance)`

Esta função recebe uma geometria `LineString` e uma distância fracionária no intervalo (0,0] e retorna o `MultiPoint` composto pelo ponto inicial da `LineString`, além dos valores `Point` ao longo da `LineString` em cada fração da distância do seu ponto inicial ao seu ponto final. Pode ser usada para responder a perguntas como quais valores de `Point` estão a cada 10% da distância ao longo da estrada descrita pelo argumento de geometria.

A função é implementada para geometrias `LineString` em todos os sistemas de referência espacial, tanto cartesianos quanto geográficos.

Se o argumento *`fractional_distance`* dividir 1,0 com zero resto, o resultado pode não conter o último ponto da `LineString` argumento, mas um ponto próximo a ele devido a imprecisões numéricas em cálculos de valor aproximado.

Uma função relacionada, `ST_LineInterpolatePoint()`, recebe argumentos semelhantes, mas retorna o `Point` ao longo da `LineString` na fração dada da distância do seu ponto inicial ao seu ponto final.

`ST_LineInterpolatePoints()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Se o argumento de geometria não for uma `LineString`, ocorre um erro `ER_UNEXPECTED_GEOMETRY_TYPE`.
+ Se o argumento de distância fracionária estiver fora do intervalo [0,0], ocorre um erro `ER_DATA_OUT_OF_RANGE`.

```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)');
  mysql> SELECT ST_AsText(ST_LineInterpolatePoint(@ls1, .5));
  +----------------------------------------------+
  | ST_AsText(ST_LineInterpolatePoint(@ls1, .5)) |
  +----------------------------------------------+
  | POINT(0 5)                                   |
  +----------------------------------------------+
  mysql> SELECT ST_AsText(ST_LineInterpolatePoint(@ls1, .75));
  +-----------------------------------------------+
  | ST_AsText(ST_LineInterpolatePoint(@ls1, .75)) |
  +-----------------------------------------------+
  | POINT(2.5 5)                                  |
  +-----------------------------------------------+
  mysql> SELECT ST_AsText(ST_LineInterpolatePoint(@ls1, 1));
  +---------------------------------------------+
  | ST_AsText(ST_LineInterpolatePoint(@ls1, 1)) |
  +---------------------------------------------+
  | POINT(5 5)                                  |
  +---------------------------------------------+
  mysql> SELECT ST_AsText(ST_LineInterpolatePoints(@ls1, .25));
  +------------------------------------------------+
  | ST_AsText(ST_LineInterpolatePoints(@ls1, .25)) |
  +------------------------------------------------+
  | MULTIPOINT((0 2.5),(0 5),(2.5 5),(5 5))        |
  +------------------------------------------------+
  ```

`ST_LineInterpolatePoints()` é uma extensão do MySQL para OpenGIS.
* `ST_PointAtDistance(ls, distance)`

Esta função recebe uma geometria `LineString` e uma distância no intervalo [0,0] medido na unidade do sistema de referência espacial (SRS) da `LineString`, e retorna o `Point` ao longo da `LineString` naquela distância do seu ponto inicial. Pode ser usada para responder a perguntas como qual valor de `Point` está a 400 metros do início da estrada descrita pelo argumento de geometria.

A função é implementada para geometrias `LineString` em todos os sistemas de referência espacial, tanto cartesianos quanto geográficos.

`ST_PointAtDistance()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Se o argumento de geometria não for uma `LineString`, ocorre um erro `ER_UNEXPECTED_GEOMETRY_TYPE`.
+ Se o argumento de distância fracionária estiver fora do intervalo [0,0, `ST_Length(ls)`,], ocorre um erro `ER_DATA_OUT_OF_RANGE`.

`ST_PointAtDistance()` é uma extensão do MySQL para OpenGIS.
* `ST_SymDifference(g1, g2)`

  Retorna uma geometria que representa a diferença simétrica do conjunto de pontos dos valores de geometria *`g1`* e *`g2`*, definida como:

  ```
  g1 symdifference g2 := (g1 union g2) difference (g1 intersection g2)
  ```

  Ou, na notação de chamada de função:

  ```
  ST_SymDifference(g1, g2) = ST_Difference(ST_Union(g1, g2), ST_Intersection(g1, g2))
  ```

  O resultado está no mesmo SRS da geometria dos argumentos.

  `ST_SymDifference()` permite argumentos em um SRS cartesiano ou geográfico e lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g1 = ST_GeomFromText('MULTIPOINT(5 0,15 10,15 25)');
  mysql> SET @g2 = ST_GeomFromText('MULTIPOINT(1 1,15 10,15 25)');
  mysql> SELECT ST_AsText(ST_SymDifference(@g1, @g2));
  +---------------------------------------+
  | ST_AsText(ST_SymDifference(@g1, @g2)) |
  +---------------------------------------+
  | MULTIPOINT((1 1),(5 0))               |
  +---------------------------------------+
  ```
* `ST_Transform(g, target_srid)`

  Transforma uma geometria de um sistema de referência espacial (SRS) para outro. O valor de retorno é uma geometria do mesmo tipo que a geometria de entrada, com todas as coordenadas transformadas para o SRID de destino, *`target_srid`*. O MySQL suporta todos os SRSs definidos por EPSG, exceto os listados aqui:

  + EPSG 1042 Krovak Modificado
  + EPSG 1043 Krovak Modificado (Orientado a Norte)
  + EPSG 9816 Grid de Mineração da Tunísia
  + EPSG 9826 Lambert Conic Conformal (Orientado a Oeste)

  `ST_Transform()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

Argumentos de geometria que possuem um valor SRID para um SRS geográfico não produzem um erro.
+ Se o argumento de geometria ou SRID de destino tiver um valor SRID que se refere a um sistema de referência espacial (SRS) indefinido, ocorrerá um erro `ER_SRS_NOT_FOUND`.
+ Se a geometria ou o argumento SRID de destino tiver um valor SRID que se refere a um sistema de referência espacial (SRS) não definido, ocorrerá um erro `ER_TRANSFORM_SOURCE_SRS_NOT_SUPPORTED`.
+ Se o SRID de destino estiver em um SRS que o `ST_Transform()` não pode transformar, ocorrerá um erro `ER_TRANSFORM_TARGET_SRS_NOT_SUPPORTED`.
+ Se a geometria estiver em um SRS que o `ST_Transform()` não pode transformar, ocorrerá um erro `ER_TRANSFORM_SOURCE_SRS_MISSING_TOWGS84`.
+ Se o SRID de destino estiver em um SRS que não é WGS 84 e não tem a cláusula TOWGS84, ocorrerá um erro `ER_TRANSFORM_TARGET_SRS_MISSING_TOWGS84`.

`ST_SRID(g, target_srid)` e `ST_Transform(g, target_srid)` diferem da seguinte forma:

+ `ST_SRID()` altera o valor SRID da geometria sem transformar suas coordenadas.
+ `ST_Transform()` transforma as coordenadas da geometria além de alterar seu valor SRID.

```
  mysql> SET @p = ST_GeomFromText('POINT(52.381389 13.064444)', 4326);
  mysql> SELECT ST_AsText(@p);
  +----------------------------+
  | ST_AsText(@p)              |
  +----------------------------+
  | POINT(52.381389 13.064444) |
  +----------------------------+
  mysql> SET @p = ST_Transform(@p, 4230);
  mysql> SELECT ST_AsText(@p);
  +---------------------------------------------+
  | ST_AsText(@p)                               |
  +---------------------------------------------+
  | POINT(52.38208611407426 13.065520672345304) |
  +---------------------------------------------+
  ```
* `ST_Union(g1, g2)`

Retorna uma geometria que representa a união do conjunto de pontos das geometrias *`g1`* e *`g2`*. O resultado está no mesmo SRS das geometrias argumentos.

`ST_Union()` permite argumentos em um SRS cartesiano ou geográfico e lida com seus argumentos conforme descrito na introdução desta seção.

```
  mysql> SET @g1 = ST_GeomFromText('LineString(1 1, 3 3)');
  mysql> SET @g2 = ST_GeomFromText('LineString(1 3, 3 1)');
  mysql> SELECT ST_AsText(ST_Union(@g1, @g2));
  +--------------------------------------+
  | ST_AsText(ST_Union(@g1, @g2))        |
  +--------------------------------------+
  | MULTILINESTRING((1 1,3 3),(1 3,3 1)) |
  +--------------------------------------+
  ```