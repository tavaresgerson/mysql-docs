#### 14.16.9.1 Funções de Relação Espacial que Utilizam Formas de Objetos

A especificação OpenGIS define as seguintes funções para testar a relação entre dois valores de geometria `g1` e `g2`, utilizando formas de objetos precisas. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente, exceto que as funções de distância retornam valores de distância.

As funções desta seção detectam argumentos em sistemas de referência espacial cartesianos ou geográficos (SRS) e retornam resultados adequados ao SRS.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

- Se qualquer argumento for `NULL` ou se qualquer argumento de geometria for uma geometria vazia, o valor de retorno será `NULL`.

- Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

- Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorrerá um erro `ER_SRS_NOT_FOUND`.

- Para funções que aceitam múltiplos argumentos de geometria, se esses argumentos não estiverem no mesmo SRS, ocorre um erro `ER_GIS_DIFFERENT_SRIDS`.

- Se qualquer argumento geométrico for geometricamente inválido, o resultado será verdadeiro ou falso (não é definido qual), ou ocorrerá um erro.

- Para argumentos de geometria SRS geográfica, se algum argumento tiver uma longitude ou latitude fora do intervalo, ocorrerá um erro:

  - Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

  - Se um valor de latitude não estiver no intervalo \[−90, 90], ocorrerá um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

  As faixas mostradas são em graus. Se um SRS usar outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa variam ligeiramente devido à aritmética de ponto flutuante.

- Caso contrário, o valor de retorno não é `NULL`.

Algumas funções nesta seção permitem um argumento de unidade que especifica a unidade de comprimento para o valor de retorno. A menos que especificado de outra forma, as funções tratam seu argumento de unidade da seguinte forma:

- Uma unidade é suportada se ela for encontrada na tabela `INFORMATION_SCHEMA` `ST_UNITS_OF_MEASURE`. Veja a Seção 28.3.37, “A tabela INFORMATION\_SCHEMA ST\_UNITS\_OF\_MEASURE”.

- Se uma unidade for especificada, mas não suportada pelo MySQL, ocorrerá um erro `ER_UNIT_NOT_FOUND`.

- Se uma unidade linear suportada for especificada e o SRID for 0, ocorrerá um erro `ER_GEOMETRY_IN_UNKNOWN_LENGTH_UNIT`.

- Se uma unidade linear suportada for especificada e o SRID não for 0, o resultado será nessa unidade.

- Se não for especificado uma unidade, o resultado será na unidade do SRS das geometrias, seja cartesiana ou geográfica. Atualmente, todos os SRSs do MySQL são expressos em metros.

Essas funções de forma de objeto estão disponíveis para testar relações de geometria:

- `ST_Contains(g1, g2)`

  Retorna 1 ou 0 para indicar se `g1` contém completamente `g2` (isso significa que `g1` e `g2` não podem se sobrepor). Essa relação é o inverso daquela testada por `ST_Within()`.

  `ST_Contains()` lida com seus argumentos conforme descrito na introdução desta seção.

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

- `ST_Crosses(g1, g2)`

  Duas geometrias são *espacialmente cruzadas* se sua relação espacial tiver as seguintes propriedades:

  - A menos que `g1` e `g2` tenham ambos a dimensão 1: `g1` cruza `g2` se o interior de `g2` tiver pontos em comum com o interior de `g1`, mas `g2` não cubra todo o interior de `g1`.

  - Se ambos `g1` e `g2` tiverem dimensão 1: Se as linhas se cruzarem em um número finito de pontos (ou seja, sem segmentos de linha comuns, apenas pontos únicos em comum).

  Essa função retorna 1 ou 0 para indicar se `g1` cruza espacialmente `g2`.

  `ST_Crosses()` lida com seus argumentos conforme descrito na introdução desta seção, exceto que o valor de retorno é `NULL` para essas condições adicionais:

  - `g1` tem dimensão 2 (`Polygon` ou `MultiPolygon`).

  - `g2` tem dimensão 1 (`Point` ou `MultiPoint`).

- `ST_Disjoint(g1, g2)`

  Retorna 1 ou 0 para indicar se `g1` está espacialmente disjuntado de (não intersecta) `g2`.

  `ST_Disjoint()` lida com seus argumentos conforme descrito na introdução desta seção.

- `ST_Distance(g1, g2 [, unit])`

  Retorna a distância entre `g1` e `g2`, medida na unidade de comprimento do sistema de referência espacial (SRS) dos argumentos de geometria, ou na unidade do argumento opcional `unit` se este for especificado.

  Essa função processa coleções de geometria, retornando a menor distância entre todas as combinações dos componentes dos dois argumentos de geometria.

  `ST_Distance()` trata seus argumentos de geometria conforme descrito na introdução desta seção, com essas exceções:

  - `ST_Distance()` detecta argumentos em um sistema de referência espacial geodésico (elíptico) e retorna a distância geodésica no elipsoide. A partir do MySQL 8.0.18, o `ST_Distance()` suporta cálculos de distância para argumentos de SRS geográficos de todos os tipos de geometria. Antes do MySQL 8.0.18, os únicos tipos de argumentos geográficos permitidos são `Point` e `Point`, ou `Point` e `MultiPoint` (em qualquer ordem de argumento). Se chamado com outras combinações de argumentos de tipos de geometria em um SRS geográfico, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

  - Se qualquer argumento for geometricamente inválido, o resultado será uma distância indefinida (ou seja, pode ser qualquer número) ou ocorrerá um erro.

  - Se um resultado intermediário ou final produzir `NaN` ou um número negativo, ocorre um erro `ER_GIS_INVALID_DATA`.

  A partir do MySQL 8.0.14, o `ST_Distance()` permite um argumento opcional `unit` que especifica a unidade linear para o valor de distância retornado. O `ST_Distance()` lida com seu argumento `unit` conforme descrito na introdução desta seção.

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

- `ST_Equals(g1, g2)`

  Retorna 1 ou 0 para indicar se `g1` é igual espacialmente a `g2`.

  `ST_Equals()` lida com seus argumentos conforme descrito na introdução desta seção, exceto que ele não retorna `NULL` para argumentos de geometria vazios.

  ```
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_Equals(@g1, @g1), ST_Equals(@g1, @g2);
  +---------------------+---------------------+
  | ST_Equals(@g1, @g1) | ST_Equals(@g1, @g2) |
  +---------------------+---------------------+
  |                   1 |                   0 |
  +---------------------+---------------------+
  ```

- `ST_FrechetDistance(g1, g2 [, unit])`

  Retorna a distância discreta de Fréchet entre duas geometrias, refletindo quão semelhantes as geometrias são. O resultado é um número de ponto duplo medido na unidade de comprimento do sistema de referência espacial (SRS) dos argumentos da geometria, ou na unidade de comprimento do argumento `unit` se esse argumento for fornecido.

  Essa função implementa a distância discreta de Fréchet, o que significa que ela é restrita às distâncias entre os pontos das geometrias. Por exemplo, dados dois argumentos `LineString`, apenas os pontos explicitamente mencionados nas geometrias são considerados. Os pontos nos segmentos de linha entre esses pontos não são considerados.

  `ST_FrechetDistance()` trata seus argumentos de geometria conforme descrito na introdução desta seção, com essas exceções:

  - As geometrias podem ter um SRS cartesiano ou geográfico, mas apenas os valores `LineString` são suportados. Se os argumentos estiverem no mesmo SRS cartesiano ou geográfico, mas nenhum deles for um `LineString`, `ER_NOT_IMPLEMENTED_FOR_CARTESIAN_SRS` ou `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`, ocorrerá um erro dependendo do tipo de SRS.

  O `ST_FrechetDistance()` lida com seu argumento opcional `unit` conforme descrito na introdução desta seção.

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

  Essa função foi adicionada no MySQL 8.0.23.

- `ST_HausdorffDistance(g1, g2 [, unit])`

  Retorna a distância discreta de Hausdorff entre duas geometrias, refletindo quão semelhantes as geometrias são. O resultado é um número de ponto duplo medido na unidade de comprimento do sistema de referência espacial (SRS) dos argumentos de geometria, ou na unidade de comprimento do argumento `unit` se esse argumento for fornecido.

  Essa função implementa a distância discreta de Hausdorff, o que significa que ela é restrita às distâncias entre os pontos das geometrias. Por exemplo, dados dois argumentos `LineString`, apenas os pontos explicitamente mencionados nas geometrias são considerados. Os pontos nos segmentos de linha entre esses pontos não são considerados.

  `ST_HausdorffDistance()` trata seus argumentos de geometria conforme descrito na introdução desta seção, com essas exceções:

  - Se os argumentos de geometria estiverem no mesmo SRS cartesiano ou geográfico, mas não estiverem em uma combinação suportada, ocorrerá um erro `ER_NOT_IMPLEMENTED_FOR_CARTESIAN_SRS` ou `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`, dependendo do tipo de SRS. Essas combinações são suportadas:

    - `LineString` e `LineString`

    - `Point` e `MultiPoint`

    - `LineString` e `MultiLineString`

    - `MultiPoint` e `MultiPoint`

    - `MultiLineString` e `MultiLineString`

  O `ST_HausdorffDistance()` lida com seu argumento opcional `unit` conforme descrito na introdução desta seção.

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

  Essa função foi adicionada no MySQL 8.0.23.

- `ST_Intersects(g1, g2)`

  Retorna 1 ou 0 para indicar se `g1` intersecta espacialmente `g2`.

  `ST_Intersects()` lida com seus argumentos conforme descrito na introdução desta seção.

- `ST_Overlaps(g1, g2)`

  Duas geometrias *se sobrepõem espacialmente* se intersectam e sua interseção resulta em uma geometria da mesma dimensão, mas não igual a nenhuma das geometrias dadas.

  Essa função retorna 1 ou 0 para indicar se `g1` sobrepõe-se espacialmente a `g2`.

  `ST_Overlaps()` lida com seus argumentos conforme descrito na introdução desta seção, exceto pelo fato de que o valor de retorno é `NULL` para a condição adicional de que as dimensões das duas geometrias não são iguais.

- `ST_Touches(g1, g2)`

  Duas geometrias *tocam-se espacialmente* se seus interiores não se intersectam, mas a borda de uma das geometrias intersecta a borda ou o interior da outra.

  Essa função retorna 1 ou 0 para indicar se `g1` toca espacialmente `g2`.

  `ST_Touches()` lida com seus argumentos conforme descrito na introdução desta seção, exceto pelo fato de que o valor de retorno é `NULL` para a condição adicional de que ambas as geometrias tenham dimensão 0 (`Point` ou `MultiPoint`).

- `ST_Within(g1, g2)`

  Retorna 1 ou 0 para indicar se `g1` está espacialmente dentro de `g2`. Isso testa a relação oposta como `ST_Contains()`.

  `ST_Within()` lida com seus argumentos conforme descrito na introdução desta seção.
