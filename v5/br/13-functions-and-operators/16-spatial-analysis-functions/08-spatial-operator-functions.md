### 12.16.8 Funções de Operadores Espaciais

O OpenGIS propõe uma série de funções que podem gerar geometrias. Elas são projetadas para implementar operadores espaciais.

Essas funções suportam todas as combinações de tipos de argumento, exceto aquelas que não são aplicáveis de acordo com a especificação do Open Geospatial Consortium.

Além disso, a Seção 12.16.7, “Funções de Propriedade Geométrica”, discute várias funções que constroem novas geometrias a partir de geometrias existentes. Veja essa seção para obter descrições dessas funções:

- `ST_Envelope(g)`

- `ST_StartPoint(ls)`

- `ST_EndPoint(ls)`

- `ST_PointN(ls, N)`

- `ST_ExteriorRing(poly)`

- `ST_InteriorRingN(poly, N)`

- `ST_GeometryN(gc, N)`

Estes operadores espaciais estão disponíveis:

- [`Buffer(g, d [, estratégia1 [, estratégia2 [, estratégia3])`](funções-operadores-espaciais.html#função_buffer)

  `ST_Buffer()` e `Buffer()` são sinônimos. Para mais informações, consulte a descrição de `ST_Buffer()`.

  `Buffer()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_Buffer()` em vez disso.

- `ConvexHull(g)`

  `ST_ConvexHull()` e `ConvexHull()` são sinônimos. Para mais informações, consulte a descrição de `ST_ConvexHull()`.

  `ConvexHull()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_ConvexHull()` em vez disso.

- [`ST_Buffer(g, d [, estratégia1 [, estratégia2 [, estratégia3])`](funções-operadores-espaciais.html#função_st-buffer)

  Retorna uma geometria que representa todos os pontos cuja distância do valor da geometria *`g`* é menor ou igual a uma distância de *`d`*, ou `NULL` se algum argumento for `NULL`. O SRID do argumento de geometria deve ser 0 porque o `ST_Buffer()` suporta apenas o sistema de coordenadas cartesianas. Se algum argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

  Se o argumento de geometria estiver vazio, o `ST_Buffer()` retornará uma geometria vazia.

  Se a distância for 0, o `ST_Buffer()` retorna o argumento de geometria inalterado:

  ```sql
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 0));
  +------------------------------+
  | ST_AsText(ST_Buffer(@pt, 0)) |
  +------------------------------+
  | POINT(0 0)                   |
  +------------------------------+
  ```

  `ST_Buffer()` suporta distâncias negativas para valores de `Polygon` e `MultiPolygon` e para coleções de geometria que contêm valores de `Polygon` ou `MultiPolygon`. O resultado pode ser uma geometria vazia. Um erro `ER_WRONG_ARGUMENTS` ocorre para `ST_Buffer()` com uma distância negativa para valores de `Point`, `MultiPoint`, `LineString` e `MultiLineString`, e para coleções de geometria que não contêm nenhum valor de `Polygon` ou `MultiPolygon`.

  `ST_Buffer()` permite até três argumentos de estratégia opcionais após o argumento de distância. As estratégias influenciam o cálculo do buffer. Esses argumentos são valores de string de bytes produzidos pela função `ST_Buffer_Strategy()`, a serem usados para as estratégias ponto, junção e fim:

  - As estratégias de ponto aplicam-se às geometrias `Ponto` e `MultiPonto`. Se nenhuma estratégia de ponto for especificada, o padrão é `ST_Buffer_Strategy('ponto_círculo', 32)`.

  - As estratégias de junção são aplicadas às geometrias `LineString`, `MultiLineString`, `Polygon` e `MultiPolygon`. Se nenhuma estratégia de junção for especificada, o padrão é `ST_Buffer_Strategy('join_round', 32)`.

  - As estratégias de término se aplicam às geometrias `LineString` e `MultiLineString`. Se nenhuma estratégia de término for especificada, o padrão é `ST_Buffer_Strategy('end_round', 32)`.

  Pode-se especificar até uma estratégia de cada tipo, e elas podem ser listadas em qualquer ordem. Se forem especificadas várias estratégias de um determinado tipo, ocorrerá um erro `ER_WRONG_ARGUMENTS`.

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

- `ST_Buffer_Strategy(estratégia, pontos_por_círculo)`

  Essa função retorna uma cadeia de bytes de estratégia para uso com `ST_Buffer()`, para influenciar o cálculo do buffer. Se qualquer argumento for `NULL`, o valor de retorno será `NULL`. Se qualquer argumento for inválido, ocorrerá um erro `ER_WRONG_ARGUMENTS`.

  Informações sobre estratégias estão disponíveis em Boost.org.

  O primeiro argumento deve ser uma string que indique uma opção de estratégia:

  - Para estratégias de pontos, os valores permitidos são `'point_circle'` e `'point_square'`.

  - Para estratégias de junção, os valores permitidos são `'join_round'` e `'join_miter'`.

  - Para estratégias de término, os valores permitidos são `'end_round'` e `'end_flat'`.

  Se o primeiro argumento for `'point_circle'`, `'join_round'`, `'join_miter'`, ou `'end_round'`, o argumento *`points_per_circle`* deve ser fornecido como um valor numérico positivo. O valor máximo de *`points_per_circle`* é o valor da variável de sistema `max_points_in_geometry`. Se o primeiro argumento for `'point_square'` ou `'end_flat'`, o argumento *`points_per_circle`* não deve ser fornecido ou ocorrerá um erro `ER_WRONG_ARGUMENTS`.

  Para exemplos, veja a descrição de `ST_Buffer()`.

- `ST_ConvexHull(g)`

  Retorna uma geometria que representa a casca convexa do valor de geometria *`g`*. Se o argumento for `NULL`, o valor de retorno será `NULL`.

  Essa função calcula a casca convexa de uma geometria, verificando primeiro se seus pontos de vértice são colineares. A função retorna uma casca linear se for o caso, uma casca de polígono caso contrário. Essa função processa coleções de geometrias, extraindo todos os pontos de vértice de todos os componentes da coleção, criando um valor `MultiPoint` a partir deles e calculando sua casca convexa. Se o argumento for uma coleção de geometria vazia, o valor de retorno é `NULL`.

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

- `ST_Difference(g1, g2)`

  Retorna uma geometria que representa a diferença de conjuntos de pontos dos valores de geometria *`g1`* e *`g2`*. Se qualquer argumento for `NULL`, o valor de retorno será `NULL`.

  ```sql
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_AsText(ST_Difference(@g1, @g2));
  +------------------------------------+
  | ST_AsText(ST_Difference(@g1, @g2)) |
  +------------------------------------+
  | POINT(1 1)                         |
  +------------------------------------+
  ```

- `ST_Interseção(g1, g2)`

  Retorna uma geometria que representa a interseção do conjunto de pontos dos valores de geometria *`g1`* e *`g2`*. Se qualquer argumento for `NULL`, o valor de retorno será `NULL`.

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

- `ST_SymDifference(g1, g2)`

  Retorna uma geometria que representa a diferença simétrica do conjunto de pontos dos valores de geometria *`g1`* e *`g2`*, que é definida da seguinte forma:

  ```sql
  g1 symdifference g2 := (g1 union g2) difference (g1 intersection g2)
  ```

  Ou, na notação de chamada de função:

  ```sql
  ST_SymDifference(g1, g2) = ST_Difference(ST_Union(g1, g2), ST_Intersection(g1, g2))
  ```

  Se qualquer argumento for `NULL`, o valor de retorno será `NULL`.

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

- `ST_Union(g1, g2)`

  Retorna uma geometria que representa a união do conjunto de pontos dos valores de geometria *`g1`* e *`g2`*. Se qualquer argumento for `NULL`, o valor de retorno será `NULL`.

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
