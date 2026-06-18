#### 14.16.9.2 Funções de Relação Espacial que Utilizam Rectângulos de Limite Mínimos

O MySQL oferece várias funções específicas do MySQL que testam a relação entre os retângulos de contorno mínimo (MBRs) de duas geómetrias `g1` e `g2`. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente.

A caixa de delimitação de um ponto é interpretada como um ponto que é tanto limite quanto interior.

A caixa de delimitação de uma linha horizontal ou vertical reta é interpretada como uma linha onde o interior da linha também é a fronteira. Os pontos finais são pontos de fronteira.

Se algum dos parâmetros for uma coleção de geometria, o interior, a borda e o exterior desses parâmetros serão os da união de todos os elementos da coleção.

As funções desta seção detectam argumentos em sistemas de referência espacial cartesianos ou geográficos (SRS) e retornam resultados adequados ao SRS.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

- Se qualquer argumento for `NULL` ou uma geometria vazia, o valor de retorno será `NULL`.

- Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

- Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorrerá um erro `ER_SRS_NOT_FOUND`.

- Para funções que aceitam múltiplos argumentos de geometria, se esses argumentos não estiverem no mesmo SRS, ocorre um erro `ER_GIS_DIFFERENT_SRIDS`.

- Se qualquer argumento for geometricamente inválido, o resultado será verdadeiro ou falso (não se sabe qual), ou ocorrerá um erro.

- Para argumentos de geometria SRS geográfica, se algum argumento tiver uma longitude ou latitude fora do intervalo, ocorrerá um erro:

  - Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

  - Se um valor de latitude não estiver no intervalo \[−90, 90], ocorrerá um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

  As faixas mostradas são em graus. Se um SRS usar outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa variam ligeiramente devido à aritmética de ponto flutuante.

- Caso contrário, o valor de retorno não é `NULL`.

Essas funções do MBR estão disponíveis para testar as relações de geometria:

- `MBRContains(g1, g2)`

  Retorna 1 ou 0 para indicar se o retângulo de contorno mínimo de `g1` contém o retângulo de contorno mínimo de `g2`. Isso testa a relação oposta como `MBRWithin()`.

  `MBRContains()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @g3 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))'),
      ->   @g4 = ST_GeomFromText('Polygon((5 5,5 10,10 10,10 5,5 5))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)');
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBRContains(@g1, @g2), MBRContains(@g1, @g4),
      ->   MBRContains(@g2, @g1), MBRContains(@g2, @g4),
      ->   MBRContains(@g2, @g3), MBRContains(@g3, @g4),
      ->   MBRContains(@g3, @g1), MBRContains(@g1, @g3),
      ->   MBRContains(@g1, @p1), MBRContains(@p1, @g1),
      ->   MBRContains(@g1, @p1), MBRContains(@p1, @g1),
      ->   MBRContains(@g2, @p2), MBRContains(@g2, @p3),
      ->   MBRContains(@g3, @p1), MBRContains(@g3, @p2),
      ->   MBRContains(@g3, @p3), MBRContains(@g4, @p1),
      ->   MBRContains(@g4, @p2), MBRContains(@g4, @p3)\G
  *************************** 1. row ***************************
  MBRContains(@g1, @g2): 1
  MBRContains(@g1, @g4): 0
  MBRContains(@g2, @g1): 0
  MBRContains(@g2, @g4): 0
  MBRContains(@g2, @g3): 0
  MBRContains(@g3, @g4): 0
  MBRContains(@g3, @g1): 1
  MBRContains(@g1, @g3): 0
  MBRContains(@g1, @p1): 1
  MBRContains(@p1, @g1): 0
  MBRContains(@g1, @p1): 1
  MBRContains(@p1, @g1): 0
  MBRContains(@g2, @p2): 0
  MBRContains(@g2, @p3): 0
  MBRContains(@g3, @p1): 1
  MBRContains(@g3, @p2): 1
  MBRContains(@g3, @p3): 0
  MBRContains(@g4, @p1): 0
  MBRContains(@g4, @p2): 0
  MBRContains(@g4, @p3): 0
  1 row in set (0.00 sec)
  ```

- `MBRCoveredBy(g1, g2)`

  Retorna 1 ou 0 para indicar se o retângulo de contorno mínimo de `g1` está coberto pelo retângulo de contorno mínimo de `g2`. Isso testa a relação oposta como `MBRCovers()`.

  `MBRCoveredBy()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))');
  mysql> SET @g2 = ST_GeomFromText('Point(1 1)');
  mysql> SELECT MBRCovers(@g1,@g2), MBRCoveredby(@g1,@g2);
  +--------------------+-----------------------+
  | MBRCovers(@g1,@g2) | MBRCoveredby(@g1,@g2) |
  +--------------------+-----------------------+
  |                  1 |                     0 |
  +--------------------+-----------------------+
  mysql> SELECT MBRCovers(@g2,@g1), MBRCoveredby(@g2,@g1);
  +--------------------+-----------------------+
  | MBRCovers(@g2,@g1) | MBRCoveredby(@g2,@g1) |
  +--------------------+-----------------------+
  |                  0 |                     1 |
  +--------------------+-----------------------+
  ```

  Veja a descrição da função `MBRCovers()` para exemplos adicionais.

- `MBRCovers(g1, g2)`

  Retorna 1 ou 0 para indicar se o retângulo de contorno mínimo de `g1` cobre o retângulo de contorno mínimo de `g2`. Isso testa a relação oposta como `MBRCoveredBy()`. Veja a descrição de `MBRCoveredBy()` para exemplos adicionais.

  `MBRCovers()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)'),
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.02 sec)

  mysql> SELECT
      ->   MBRCovers(@g1, @p1), MBRCovers(@g1, @p2),
      ->   MBRCovers(@g1, @g2), MBRCovers(@g1, @p3)\G
  *************************** 1. row ***************************
  MBRCovers(@g1, @p1): 1
  MBRCovers(@g1, @p2): 1
  MBRCovers(@g1, @g2): 1
  MBRCovers(@g1, @p3): 0
  1 row in set (0.00 sec)
  ```

- `MBRDisjoint(g1, g2)`

  Retorna 1 ou 0 para indicar se os retângulos de contorno mínimos das duas geometrias `g1` e `g2` são disjuntos (não se intersectam).

  `MBRDisjoint()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @g3 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))'),
      ->   @g4 = ST_GeomFromText('Polygon((5 5,5 10,10 10,10 5,5 5))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)'),
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBRDisjoint(@g1, @g4), MBRDisjoint(@g2, @g4),
      ->   MBRDisjoint(@g3, @g4), MBRDisjoint(@g4, @g4),
      ->   MBRDisjoint(@g1, @p1), MBRDisjoint(@g1, @p2),
      ->   MBRDisjoint(@g1, @p3)\G
  *************************** 1. row ***************************
  MBRDisjoint(@g1, @g4): 1
  MBRDisjoint(@g2, @g4): 1
  MBRDisjoint(@g3, @g4): 0
  MBRDisjoint(@g4, @g4): 0
  MBRDisjoint(@g1, @p1): 0
  MBRDisjoint(@g1, @p2): 0
  MBRDisjoint(@g1, @p3): 1
  1 row in set (0.00 sec)
  ```

- `MBREquals(g1, g2)`

  Retorna 1 ou 0 para indicar se os retângulos de contorno mínimos das duas geometrias `g1` e `g2` são os mesmos.

  `MBREquals()` lida com seus argumentos conforme descrito na introdução desta seção, exceto que ele não retorna `NULL` para argumentos de geometria vazios.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)'),
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBREquals(@g1, @g1), MBREquals(@g1, @g2),
      ->   MBREquals(@g1, @p1), MBREquals(@g1, @p2), MBREquals(@g2, @g2),
      ->   MBREquals(@p1, @p1), MBREquals(@p1, @p2), MBREquals(@p2, @p2)\G
  *************************** 1. row ***************************
  MBREquals(@g1, @g1): 1
  MBREquals(@g1, @g2): 0
  MBREquals(@g1, @p1): 0
  MBREquals(@g1, @p2): 0
  MBREquals(@g2, @g2): 1
  MBREquals(@p1, @p1): 1
  MBREquals(@p1, @p2): 0
  MBREquals(@p2, @p2): 1
  1 row in set (0.00 sec)
  ```

- `MBRIntersects(g1, g2)`

  Retorna 1 ou 0 para indicar se os retângulos de contorno mínimo das duas geometrias `g1` e `g2` se intersectam.

  `MBRIntersects()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @g3 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))'),
      ->   @g4 = ST_GeomFromText('Polygon((5 5,5 10,10 10,10 5,5 5))'),
      ->   @g5 = ST_GeomFromText('Polygon((2 2,2 8,8 8,8 2,2 2))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)'),
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBRIntersects(@g1, @g1), MBRIntersects(@g1, @g2),
      ->   MBRIntersects(@g1, @g3), MBRIntersects(@g1, @g4), MBRIntersects(@g1, @g5),
      ->   MBRIntersects(@g1, @p1), MBRIntersects(@g1, @p2), MBRIntersects(@g1, @p3),
      ->   MBRIntersects(@g2, @p1), MBRIntersects(@g2, @p2), MBRIntersects(@g2, @p3)\G
  *************************** 1. row ***************************
  MBRIntersects(@g1, @g1): 1
  MBRIntersects(@g1, @g2): 1
  MBRIntersects(@g1, @g3): 1
  MBRIntersects(@g1, @g4): 0
  MBRIntersects(@g1, @g5): 1
  MBRIntersects(@g1, @p1): 1
  MBRIntersects(@g1, @p2): 1
  MBRIntersects(@g1, @p3): 0
  MBRIntersects(@g2, @p1): 1
  MBRIntersects(@g2, @p2): 0
  MBRIntersects(@g2, @p3): 0
  1 row in set (0.00 sec)
  ```

- `MBROverlaps(g1, g2)`

  Duas geometrias *se sobrepõem espacialmente* se intersectam e sua interseção resulta em uma geometria da mesma dimensão, mas não igual a nenhuma das geometrias dadas.

  Essa função retorna 1 ou 0 para indicar se os retângulos de contorno mínimos das duas geometrias `g1` e `g2` se sobrepõem.

  `MBROverlaps()` lida com seus argumentos conforme descrito na introdução desta seção.

- `MBRTouches(g1, g2)`

  Duas geometrias *tocam-se espacialmente* se seus interiores não se intersectam, mas a borda de uma das geometrias intersecta a borda ou o interior da outra.

  Essa função retorna 1 ou 0 para indicar se os retângulos de contorno mínimos das duas geometrias `g1` e `g2` se tocam.

  `MBRTouches()` lida com seus argumentos conforme descrito na introdução desta seção.

- `MBRWithin(g1, g2)`

  Retorna 1 ou 0 para indicar se o retângulo de contorno mínimo de `g1` está dentro do retângulo de contorno mínimo de `g2`. Isso testa a relação oposta como `MBRContains()`.

  `MBRWithin()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @g3 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))'),
      ->   @g4 = ST_GeomFromText('Polygon((5 5,5 10,10 10,10 5,5 5))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)');
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBRWithin(@g1, @g2), MBRWithin(@g1, @g4),
      ->   MBRWithin(@g2, @g1), MBRWithin(@g2, @g4),
      ->   MBRWithin(@g2, @g3), MBRWithin(@g3, @g4),
      ->   MBRWithin(@g1, @p1), MBRWithin(@p1, @g1),
      ->   MBRWithin(@g1, @p1), MBRWithin(@p1, @g1),
      ->   MBRWithin(@g2, @p2), MBRWithin(@g2, @p3)\G
  *************************** 1. row ***************************
  MBRWithin(@g1, @g2): 0
  MBRWithin(@g1, @g4): 0
  MBRWithin(@g2, @g1): 1
  MBRWithin(@g2, @g4): 0
  MBRWithin(@g2, @g3): 1
  MBRWithin(@g3, @g4): 0
  MBRWithin(@g1, @p1): 0
  MBRWithin(@p1, @g1): 1
  MBRWithin(@g1, @p1): 0
  MBRWithin(@p1, @g1): 1
  MBRWithin(@g2, @p2): 0
  MBRWithin(@g2, @p3): 0
  1 row in set (0.00 sec)
  ```
