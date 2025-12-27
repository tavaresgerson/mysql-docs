#### 14.16.9.1 Funções de Relação Espacial que Usam Formas de Objetos

A especificação OpenGIS define as seguintes funções para testar a relação entre dois valores de geometria *`g1`* e *`g2`*, usando formas de objetos precisas. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente, exceto que as funções de distância retornam valores de distância.

As funções desta seção detectam argumentos em sistemas de referência espacial (SRS) cartesianos ou geográficos, e retornam resultados apropriados ao SRS.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL` ou qualquer argumento de geometria for uma geometria vazia, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria não for uma geometria bem formada sintaticamente, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria for uma geometria bem formada sintaticamente em um sistema de referência espacial (SRS) indefinido, ocorre um erro `ER_SRS_NOT_FOUND`.

* Para funções que aceitam múltiplos argumentos de geometria, se esses argumentos não estiverem no mesmo SRS, ocorre um erro `ER_GIS_DIFFERENT_SRIDS`.

* Se qualquer argumento de geometria for geometricamente inválido, o resultado é verdadeiro ou falso (não está definido qual), ou ocorre um erro.

* Para argumentos de geometria de SRS geográficos, se qualquer argumento tiver uma longitude ou latitude fora do intervalo, ocorre um erro:

  + Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE`.

  + Se um valor de latitude não estiver no intervalo [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE`.

Os intervalos mostrados são em graus. Se um SRS usar outra unidade, o intervalo usa os valores correspondentes em sua unidade. Os limites exatos do intervalo diferem ligeiramente devido à aritmética de ponto flutuante.

* Caso contrário, o valor de retorno não é `NULL`.

Algumas funções nesta seção permitem um argumento de unidade que especifica a unidade de comprimento para o valor de retorno. A menos que especificado de outra forma, as funções tratam seu argumento de unidade da seguinte forma:

* Uma unidade é suportada se ela for encontrada na tabela `INFORMATION_SCHEMA` `ST_UNITS_OF_MEASURE`. Veja a Seção 28.3.43, “A Tabela INFORMATION\_SCHEMA ST\_UNITS\_OF\_MEASURE”.

* Se uma unidade for especificada, mas não suportada pelo MySQL, ocorre um erro `ER_UNIT_NOT_FOUND`.

* Se uma unidade suportada for especificada e o SRID for 0, ocorre um erro `ER_GEOMETRY\_IN\_UNKNOWN\_LENGTH\_UNIT`.

* Se uma unidade suportada for especificada e o SRID não for 0, o resultado está naquela unidade.

* Se uma unidade não for especificada, o resultado está na unidade da SRS das geometrias, seja cartesiana ou geográfica. Atualmente, todas as SRSs do MySQL são expressas em metros.

Essas funções de forma de objeto estão disponíveis para testar relações de geometria:

* `ST_Contains(g1, g2)`

  Retorna 1 ou 0 para indicar se *`g1`* contém completamente *`g2`* (isso significa que *`g1`* e *`g2`* não devem se intersectar). Esta relação é o inverso da testada por `ST_Within()`.

  `ST_Contains()` trata seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->     @p1 = ST_GeomFromText('Point(1 1)'),
      ->     @p2 = ST_GeomFromText('Point(3 3)'),
      ->     @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   ST_Contains(@g1, @p1), ST_Within(@p1, @g1),
      ->   ST_Disjoint(@g1, @p1), ST_Intersects(@g1, @p1)\G
  *************************** 1. row ***************************
    ST_Contains(@g1, @p1): 1
      ST_Within(@p1, @g1): 1
    ST_Disjoint(@g1, @p1): 0
  ST_Intersects(@g1, @p1): 1
  1 row in set (0.00 sec)

  mysql> SELECT
      ->   ST_Contains(@g1, @p2), ST_Within(@p2, @g1),
      ->   ST_Disjoint(@g1, @p2), ST_Intersects(@g1, @p2)\G
  *************************** 1. row ***************************
    ST_Contains(@g1, @p2): 0
      ST_Within(@p2, @g1): 0
    ST_Disjoint(@g1, @p2): 0
  ST_Intersects(@g1, @p2): 1
  1 row in set (0.00 sec)

  mysql>
      -> SELECT
      ->   ST_Contains(@g1, @p3), ST_Within(@p3, @g1),
      ->   ST_Disjoint(@g1, @p3), ST_Intersects(@g1, @p3)\G
  *************************** 1. row ***************************
    ST_Contains(@g1, @p3): 0
      ST_Within(@p3, @g1): 0
    ST_Disjoint(@g1, @p3): 1
  ST_Intersects(@g1, @p3): 0
  1 row in set (0.00 sec)
  ```

* `ST_Crosses(g1, g2)`

  Duas geometrias *cruzam* espacialmente se sua relação espacial tiver as seguintes propriedades:

  + A menos que *`g1`* e *`g2`* sejam ambos de dimensão 1: *`g1`* cruza *`g2`* se o interior de *`g2`* tiver pontos em comum com o interior de *`g1`*, mas *`g2`* não cobre todo o interior de *`g1`*.

  + Se ambos *`g1`* e *`g2`* forem de dimensão 1: Se as linhas cruzam-se em um número finito de pontos (ou seja, sem segmentos de linha comuns, apenas pontos únicos em comum).

Esta função retorna 1 ou 0 para indicar se *`g1`* cruza espacialmente *`g2`*.

`ST_Crosses()` lida com seus argumentos conforme descrito na introdução desta seção, exceto que o valor de retorno é `NULL` para essas condições adicionais:

+ *`g1`* é de dimensão 2 (`Polygon` ou `MultiPolygon`).

+ *`g2`* é de dimensão 1 (`Point` ou `MultiPoint`).

* `ST_Disjoint(g1, g2)`

Retorna 1 ou 0 para indicar se *`g1`* é espacialmente disjuntos de (não cruza) *`g2`*.

`ST_Disjoint()` lida com seus argumentos conforme descrito na introdução desta seção.

* `ST_Distance(g1, g2 [, unit])`

Retorna a distância entre *`g1`* e *`g2`*, medida na unidade de comprimento do sistema de referência espacial (SRS) da geometria dos argumentos, ou na unidade do argumento opcional *`unit`* se este for especificado.

Esta função processa coleções de geometria, retornando a distância mais curta entre todas as combinações dos componentes dos dois argumentos de geometria.

`ST_Distance()` lida com seus argumentos de geometria conforme descrito na introdução desta seção, com estas exceções:

+ `ST_Distance()` detecta argumentos em um sistema de referência espacial (elíptico) geográfico e retorna a distância geodésica no elipsoide. `ST_Distance()` suporta cálculos de distância para argumentos SRS geográficos de todos os tipos de geometria.

+ Se qualquer argumento for geometricamente inválido, o resultado é uma distância indefinida (ou seja, pode ser qualquer número), ou ocorre um erro.

+ Se um resultado intermediário ou final produzir `NaN` ou um número negativo, ocorre um erro `ER_GIS_INVALID_DATA`.

`ST_Distance()` permite especificar a unidade linear para o valor de distância retornado com um argumento opcional *`unit`* que `ST_Distance()` lida como descrito na introdução desta seção.

```
  mysql> SET @g1 = ST_GeomFromText('POINT(1 1)');
  mysql> SET @g2 = ST_GeomFromText('POINT(2 2)');
  mysql> SELECT ST_Distance(@g1, @g2);
  +-----------------------+
  | ST_Distance(@g1, @g2) |
  +-----------------------+
  |    1.4142135623730951 |
  +-----------------------+

  mysql> SET @g1 = ST_GeomFromText('POINT(1 1)', 4326);
  mysql> SET @g2 = ST_GeomFromText('POINT(2 2)', 4326);
  mysql> SELECT ST_Distance(@g1, @g2);
  +-----------------------+
  | ST_Distance(@g1, @g2) |
  +-----------------------+
  |     156874.3859490455 |
  +-----------------------+
  mysql> SELECT ST_Distance(@g1, @g2, 'metre');
  +--------------------------------+
  | ST_Distance(@g1, @g2, 'metre') |
  +--------------------------------+
  |              156874.3859490455 |
  +--------------------------------+
  mysql> SELECT ST_Distance(@g1, @g2, 'foot');
  +-------------------------------+
  | ST_Distance(@g1, @g2, 'foot') |
  +-------------------------------+
  |             514679.7439273146 |
  +-------------------------------+
  ```

Para o caso especial de cálculos de distância em uma esfera, consulte a função `ST_Distance_Sphere()`.

* `ST_Equals(g1, g2)`

Retorna 1 ou 0 para indicar se *`g1`* é espacialmente igual a *`g2`*.

`ST_Equals()` lida com seus argumentos como descrito na introdução desta seção, exceto que não retorna `NULL` para argumentos de geometria vazios.

```
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_Equals(@g1, @g1), ST_Equals(@g1, @g2);
  +---------------------+---------------------+
  | ST_Equals(@g1, @g1) | ST_Equals(@g1, @g2) |
  +---------------------+---------------------+
  |                   1 |                   0 |
  +---------------------+---------------------+
  ```

* `ST_FrechetDistance(g1, g2 [, unit])`

Retorna a distância discreta de Fréchet entre duas geometrias, refletindo quão semelhantes as geometrias são. O resultado é um número de precisão dupla medido na unidade de comprimento do sistema de referência espacial (SRS) dos argumentos de geometria, ou na unidade de comprimento do argumento *`unit`* se esse argumento for fornecido.

Esta função implementa a distância discreta de Fréchet, o que significa que é restrita a distâncias entre os pontos das geometrias. Por exemplo, dados dois argumentos `LineString`, apenas os pontos explicitamente mencionados nas geometrias são considerados. Pontos nos segmentos de linha entre esses pontos não são considerados.

`ST_FrechetDistance()` lida com seus argumentos de geometria como descrito na introdução desta seção, com essas exceções:

+ As geometrias podem ter um SRS cartesiano ou geográfico, mas apenas valores `LineString` são suportados. Se os argumentos estiverem no mesmo SRS cartesiano ou geográfico, mas um deles não for um `LineString`, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_CARTESIAN_SRS` ou `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`, dependendo do tipo de SRS.

`ST_FrechetDistance()` lida com seu argumento opcional *`unit`* conforme descrito na introdução desta seção.

```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)');
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 1,0 6,3 3,5 6)');
  mysql> SELECT ST_FrechetDistance(@ls1, @ls2);
  +--------------------------------+
  | ST_FrechetDistance(@ls1, @ls2) |
  +--------------------------------+
  |             2.8284271247461903 |
  +--------------------------------+

  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)', 4326);
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 1,0 6,3 3,5 6)', 4326);
  mysql> SELECT ST_FrechetDistance(@ls1, @ls2);
  +--------------------------------+
  | ST_FrechetDistance(@ls1, @ls2) |
  +--------------------------------+
  |              313421.1999416798 |
  +--------------------------------+
  mysql> SELECT ST_FrechetDistance(@ls1, @ls2, 'foot');
  +----------------------------------------+
  | ST_FrechetDistance(@ls1, @ls2, 'foot') |
  +----------------------------------------+
  |                     1028284.7767115477 |
  +----------------------------------------+
  ```

* `ST_HausdorffDistance(g1, g2 [, unit])`

  Retorna a distância Hausdorff discreta entre duas geometrias, refletindo quão semelhantes as geometrias são. O resultado é um número de ponto-flutuante medido na unidade de comprimento do sistema de referência espacial (SRS) dos argumentos de geometria, ou na unidade de comprimento do argumento *`unit`* se esse argumento for fornecido.

  Esta função implementa a distância Hausdorff discreta, o que significa que é restrita a distâncias entre os pontos das geometrias. Por exemplo, dados dois argumentos `LineString`, apenas os pontos explicitamente mencionados nas geometrias são considerados. Pontos nos segmentos de linha entre esses pontos não são considerados.

  `ST_HausdorffDistance()` lida com seus argumentos de geometria conforme descrito na introdução desta seção, com essas exceções:

  + Se os argumentos de geometria estiverem no mesmo SRS cartesiano ou geográfico, mas não estiverem em uma combinação suportada, ocorrerá um erro `ER_NOT_IMPLEMENTED_FOR_CARTESIAN_SRS` ou `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`, dependendo do tipo de SRS. Essas combinações são suportadas:

    - `LineString` e `LineString`

    - `Point` e `MultiPoint`

    - `LineString` e `MultiLineString`

    - `MultiPoint` e `MultiPoint`

    - `MultiLineString` e `MultiLineString`

  `ST_HausdorffDistance()` lida com seu argumento opcional *`unit`* conforme descrito na introdução desta seção.

```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)');
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 1,0 6,3 3,5 6)');
  mysql> SELECT ST_HausdorffDistance(@ls1, @ls2);
  +----------------------------------+
  | ST_HausdorffDistance(@ls1, @ls2) |
  +----------------------------------+
  |                                1 |
  +----------------------------------+

  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)', 4326);
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 1,0 6,3 3,5 6)', 4326);
  mysql> SELECT ST_HausdorffDistance(@ls1, @ls2);
  +----------------------------------+
  | ST_HausdorffDistance(@ls1, @ls2) |
  +----------------------------------+
  |               111319.49079326246 |
  +----------------------------------+
  mysql> SELECT ST_HausdorffDistance(@ls1, @ls2, 'foot');
  +------------------------------------------+
  | ST_HausdorffDistance(@ls1, @ls2, 'foot') |
  +------------------------------------------+
  |                        365221.4264870815 |
  +------------------------------------------+
  ```

* `ST_Intersects(g1, g2)`

  Retorna 1 ou 0 para indicar se *`g1`* intersecta espacialmente *`g2`*.

  `ST_Intersects()` lida com seus argumentos conforme descrito na introdução desta seção.

* `ST_Overlaps(g1, g2)`

Duas geometrias *se sobrepõem espacialmente* se se intersectam e sua interseção resulta em uma geometria da mesma dimensão, mas não igual a nenhuma das geometrias dadas.

Esta função retorna 1 ou 0 para indicar se *`g1`* se sobrepõe espacialmente a *`g2`*.

`ST_Overlaps()` lida com seus argumentos conforme descrito na introdução desta seção, exceto que o valor de retorno é `NULL` para a condição adicional de que as dimensões das duas geometrias não são iguais.

* `ST_Touches(g1, g2)`

Duas geometrias *se tocam espacialmente* se seus interiores não se intersectam, mas a borda de uma das geometrias se intersecta com a borda ou o interior da outra.

Esta função retorna 1 ou 0 para indicar se *`g1`* se toca espacialmente a *`g2`*.

`ST_Touches()` lida com seus argumentos conforme descrito na introdução desta seção.

* `ST_Within(g1, g2)`

Retorna 1 ou 0 para indicar se *`g1`* está espacialmente dentro de *`g2`*. Isso testa a relação oposta à `ST_Contains()`.

`ST_Within()` lida com seus argumentos conforme descrito na introdução desta seção.