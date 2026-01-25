### 12.16.8 Funções de Operadores Espaciais

O OpenGIS propõe várias funções que podem produzir Geometries. Elas são projetadas para implementar operadores espaciais.

Essas funções suportam todas as combinações de tipos de argumento, exceto aquelas que são inaplicáveis de acordo com a especificação do Open Geospatial Consortium.

Além disso, a Seção 12.16.7, “Funções de Propriedades de Geometry”, discute várias funções que constroem novas Geometries a partir de Geometries existentes. Consulte essa seção para descrições destas funções:

* `ST_Envelope(g)`
* `ST_StartPoint(ls)`
* `ST_EndPoint(ls)`
* `ST_PointN(ls, N)`

* `ST_ExteriorRing(poly)`
* `ST_InteriorRingN(poly, N)`

* `ST_GeometryN(gc, N)`

Estas funções de operadores espaciais estão disponíveis:

* [`Buffer(g, d [, strategy1 [, strategy2 [, strategy3])`](spatial-operator-functions.html#function_buffer)

  `ST_Buffer()` e `Buffer()` são sinônimos. Para mais informações, consulte a descrição de `ST_Buffer()`.

  `Buffer()` está obsoleto; espera-se que seja removido em uma futura versão do MySQL. Use `ST_Buffer()` em seu lugar.

* `ConvexHull(g)`

  `ST_ConvexHull()` e `ConvexHull()` são sinônimos. Para mais informações, consulte a descrição de `ST_ConvexHull()`.

  `ConvexHull()` está obsoleto; espera-se que seja removido em uma futura versão do MySQL. Use `ST_ConvexHull()` em seu lugar.

* [`ST_Buffer(g, d [, strategy1 [, strategy2 [, strategy3])`](spatial-operator-functions.html#function_st-buffer)

  Retorna uma Geometry que representa todos os Points cuja distância do valor Geometry *`g`* é menor ou igual a uma distância de *`d`*, ou `NULL` se qualquer argumento for `NULL`. O SRID do argumento Geometry deve ser 0 porque `ST_Buffer()` suporta apenas o sistema de coordenadas Cartesianas. Se qualquer argumento Geometry não for uma Geometry sintaticamente bem-formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

  Se o argumento Geometry estiver vazio, `ST_Buffer()` retorna uma Geometry vazia.

  Se a distância for 0, `ST_Buffer()` retorna o argumento Geometry inalterado:

  ```sql
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 0));
  +------------------------------+
  | ST_AsText(ST_Buffer(@pt, 0)) |
  +------------------------------+
  | POINT(0 0)                   |
  +------------------------------+
  ```

  `ST_Buffer()` suporta distâncias negativas para valores `Polygon` e `MultiPolygon`, e para coleções de Geometry contendo valores `Polygon` ou `MultiPolygon`. O resultado pode ser uma Geometry vazia. Um erro `ER_WRONG_ARGUMENTS` ocorre para `ST_Buffer()` com uma distância negativa para valores `Point`, `MultiPoint`, `LineString` e `MultiLineString`, e para coleções de Geometry que não contenham quaisquer valores `Polygon` ou `MultiPolygon`.

  `ST_Buffer()` permite até três argumentos opcionais de estratégia após o argumento de distância. Estratégias influenciam o cálculo do Buffer. Estes argumentos são valores de string de bytes produzidos pela função `ST_Buffer_Strategy()`, a serem usados para estratégias de Point, Join e End:

  + Estratégias de Point se aplicam a Geometries `Point` e `MultiPoint`. Se nenhuma estratégia de Point for especificada, o padrão é `ST_Buffer_Strategy('point_circle', 32)`.

  + Estratégias de Join se aplicam a Geometries `LineString`, `MultiLineString`, `Polygon` e `MultiPolygon`. Se nenhuma estratégia de Join for especificada, o padrão é `ST_Buffer_Strategy('join_round', 32)`.

  + Estratégias de End se aplicam a Geometries `LineString` e `MultiLineString`. Se nenhuma estratégia de End for especificada, o padrão é `ST_Buffer_Strategy('end_round', 32)`.

  Pode ser especificada no máximo uma estratégia de cada tipo, e elas podem ser fornecidas em qualquer ordem. Se múltiplas estratégias de um determinado tipo forem especificadas, ocorrerá um erro `ER_WRONG_ARGUMENTS`.

  ```sql
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SET @pt_strategy = ST_Buffer_Strategy('point_square');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 2, @pt_strategy));
  +--------------------------------------------+
  | ST_AsText(ST_Buffer(@pt, 2, @pt_strategy)) |
  +--------------------------------------------+
  | POLYGON((-2 -2,2 -2,2 2,-2 2,-2 -2))       |
  +--------------------------------------------+
  ```

  ```sql
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

  `ST_Buffer()` e `Buffer()` são sinônimos.

* `ST_Buffer_Strategy(strategy [, points_per_circle])`

  Esta função retorna uma string de bytes de estratégia para uso com `ST_Buffer()` para influenciar o cálculo do Buffer. Se qualquer argumento for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento for inválido, ocorrerá um erro `ER_WRONG_ARGUMENTS`.

  Informações sobre estratégias estão disponíveis em Boost.org.

  O primeiro argumento deve ser uma string indicando uma opção de estratégia:

  + Para estratégias de Point, os valores permitidos são `'point_circle'` e `'point_square'`.

  + Para estratégias de Join, os valores permitidos são `'join_round'` e `'join_miter'`.

  + Para estratégias de End, os valores permitidos são `'end_round'` e `'end_flat'`.

  Se o primeiro argumento for `'point_circle'`, `'join_round'`, `'join_miter'` ou `'end_round'`, o argumento *`points_per_circle`* deve ser fornecido como um valor numérico positivo. O valor máximo de *`points_per_circle`* é o valor da variável de sistema `max_points_in_geometry`. Se o primeiro argumento for `'point_square'` ou `'end_flat'`, o argumento *`points_per_circle`* não deve ser fornecido, ou ocorrerá um erro `ER_WRONG_ARGUMENTS`.

  Para exemplos, consulte a descrição de `ST_Buffer()`.

* `ST_ConvexHull(g)`

  Retorna uma Geometry que representa o `convex hull` do valor Geometry *`g`*. Se o argumento for `NULL`, o valor de retorno é `NULL`.

  Esta função calcula o `convex hull` de uma Geometry verificando primeiro se seus Points de vértice são colineares. A função retorna um linear hull, se forem colineares, ou um polygon hull, caso contrário. Esta função processa coleções de Geometry extraindo todos os Points de vértice de todos os componentes da coleção, criando um valor `MultiPoint` a partir deles e calculando seu `convex hull`. Se o argumento for uma coleção de Geometry vazia, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @g = 'MULTIPOINT(5 0,25 0,15 10,15 25)';
  mysql> SELECT ST_AsText(ST_ConvexHull(ST_GeomFromText(@g)));
  +-----------------------------------------------+
  | ST_AsText(ST_ConvexHull(ST_GeomFromText(@g))) |
  +-----------------------------------------------+
  | POLYGON((5 0,25 0,15 25,5 0))                 |
  +-----------------------------------------------+
  ```

  `ST_ConvexHull()` e `ConvexHull()` são sinônimos.

* `ST_Difference(g1, g2)`

  Retorna uma Geometry que representa a diferença do conjunto de Points dos valores Geometry *`g1`* e *`g2`*. Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_AsText(ST_Difference(@g1, @g2));
  +------------------------------------+
  | ST_AsText(ST_Difference(@g1, @g2)) |
  +------------------------------------+
  | POINT(1 1)                         |
  +------------------------------------+
  ```

* `ST_Intersection(g1, g2)`

  Retorna uma Geometry que representa a interseção do conjunto de Points dos valores Geometry *`g1`* e *`g2`*. Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('LineString(1 1, 3 3)');
  mysql> SET @g2 = ST_GeomFromText('LineString(1 3, 3 1)');
  mysql> SELECT ST_AsText(ST_Intersection(@g1, @g2));
  +--------------------------------------+
  | ST_AsText(ST_Intersection(@g1, @g2)) |
  +--------------------------------------+
  | POINT(2 2)                           |
  +--------------------------------------+
  ```

* `ST_SymDifference(g1, g2)`

  Retorna uma Geometry que representa a diferença simétrica do conjunto de Points dos valores Geometry *`g1`* e *`g2`*, que é definida como:

  ```sql
  g1 symdifference g2 := (g1 union g2) difference (g1 intersection g2)
  ```

  Ou, em notação de chamada de função:

  ```sql
  ST_SymDifference(g1, g2) = ST_Difference(ST_Union(g1, g2), ST_Intersection(g1, g2))
  ```

  Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('MULTIPOINT(5 0,15 10,15 25)');
  mysql> SET @g2 = ST_GeomFromText('MULTIPOINT(1 1,15 10,15 25)');
  mysql> SELECT ST_AsText(ST_SymDifference(@g1, @g2));
  +---------------------------------------+
  | ST_AsText(ST_SymDifference(@g1, @g2)) |
  +---------------------------------------+
  | MULTIPOINT((1 1),(5 0))               |
  +---------------------------------------+
  ```

* `ST_Union(g1, g2)`

  Retorna uma Geometry que representa a união do conjunto de Points dos valores Geometry *`g1`* e *`g2`*. Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('LineString(1 1, 3 3)');
  mysql> SET @g2 = ST_GeomFromText('LineString(1 3, 3 1)');
  mysql> SELECT ST_AsText(ST_Union(@g1, @g2));
  +--------------------------------------+
  | ST_AsText(ST_Union(@g1, @g2))        |
  +--------------------------------------+
  | MULTILINESTRING((1 1,3 3),(1 3,3 1)) |
  +--------------------------------------+
  ```
