#### 12.16.9.1 Funções de Relação Espacial que Usam Formas de Objeto

A especificação OpenGIS define as seguintes funções para testar a relação entre dois valores de geometry *`g1`* e *`g2`*, usando formas de objeto precisas. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente, exceto para `ST_Distance()` e `Distance()`, que retornam valores de distância.

Estas funções suportam todas as combinações de tipos de argumento, exceto aquelas que são inaplicáveis de acordo com a especificação do Open Geospatial Consortium.

* `Crosses(g1, g2)`

  `ST_Crosses()` e `Crosses()` são sinônimos. Para mais informações, veja a descrição de `ST_Crosses()`.

  `Crosses()` está depreciada; espere que seja removida em um futuro release do MySQL. Use `ST_Crosses()` em vez disso.

* `Distance(g1, g2)`

  `ST_Distance()` e `Distance()` são sinônimos. Para mais informações, veja a descrição de `ST_Distance()`.

  `Distance()` está depreciada; espere que seja removida em um futuro release do MySQL. Use `ST_Distance()` em vez disso.

* `ST_Contains(g1, g2)`

  Retorna 1 ou 0 para indicar se *`g1`* contém *`g2`* completamente. Isso testa a relação oposta a `ST_Within()`.

* `ST_Crosses(g1, g2)`

  O termo *cruzamento espacial* (*spatially crosses*) denota uma relação espacial entre duas geometries fornecidas que possui as seguintes propriedades:

  + As duas geometries se intersectam (intersect).
  + Sua interseção resulta em uma geometry que tem uma dimension um a menos do que a dimension máxima das duas geometries fornecidas.
  + Sua interseção não é igual a nenhuma das duas geometries fornecidas.

  Esta função retorna 1 ou 0 para indicar se *`g1`* cruza espacialmente *`g2`*. Se *`g1`* for um `Polygon` ou um `MultiPolygon`, ou se *`g2`* for um `Point` ou um `MultiPoint`, o valor de retorno é `NULL`.

  Esta função retorna 0 se for chamada com uma combinação de tipo de argumento geometry inaplicável. Por exemplo, retorna 0 se o primeiro argumento for um `Polygon` ou `MultiPolygon` e/ou o segundo argumento for um `Point` ou `MultiPoint`.

  Retorna 1 se *`g1`* cruzar espacialmente *`g2`*. Retorna `NULL` se *`g1`* for um `Polygon` ou um `MultiPolygon`, ou se *`g2`* for um `Point` ou um `MultiPoint`. Caso contrário, retorna 0.

  Esta função retorna 0 se for chamada com uma combinação de tipo de argumento geometry inaplicável. Por exemplo, retorna 0 se o primeiro argumento for um `Polygon` ou `MultiPolygon` e/ou o segundo argumento for um `Point` ou `MultiPoint`.

  `ST_Crosses()` e `Crosses()` são sinônimos.

* `ST_Disjoint(g1, g2)`

  Retorna 1 ou 0 para indicar se *`g1`* está espacialmente disjunto de (não intersecta) *`g2`*.

* `ST_Distance(g1, g2)`

  Retorna a distância entre *`g1`* e *`g2`*. Se qualquer argumento for `NULL` ou uma geometry vazia, o valor de retorno é `NULL`.

  Esta função processa coleções de geometry retornando a distância mais curta entre todas as combinações dos componentes dos dois argumentos de geometry.

  Se um resultado intermediário ou final produzir NaN ou um número negativo, ocorre um erro `ER_GIS_INVALID_DATA`.

  ```sql
  mysql> SET @g1 = Point(1,1);
  mysql> SET @g2 = Point(2,2);
  mysql> SELECT ST_Distance(@g1, @g2);
  +-----------------------+
  | ST_Distance(@g1, @g2) |
  +-----------------------+
  |    1.4142135623730951 |
  +-----------------------+
  ```

  `ST_Distance()` e `Distance()` são sinônimos.

* `ST_Equals(g1, g2)`

  Retorna 1 ou 0 para indicar se *`g1`* é espacialmente igual a *`g2`*.

  ```sql
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_Equals(@g1, @g1), ST_Equals(@g1, @g2);
  +---------------------+---------------------+
  | ST_Equals(@g1, @g1) | ST_Equals(@g1, @g2) |
  +---------------------+---------------------+
  |                   1 |                   0 |
  +---------------------+---------------------+
  ```

* `ST_Intersects(g1, g2)`

  Retorna 1 ou 0 para indicar se *`g1`* intersecta espacialmente *`g2`*.

* `ST_Overlaps(g1, g2)`

  Duas geometries *se sobrepõem espacialmente* (*spatially overlap*) se elas intersectam e sua interseção resulta em uma geometry da mesma dimension, mas não igual a nenhuma das geometries fornecidas.

  Esta função retorna 1 ou 0 para indicar se *`g1`* se sobrepõe espacialmente *`g2`*.

  Esta função retorna 0 se for chamada com uma combinação de tipo de argumento geometry inaplicável. Por exemplo, retorna 0 se for chamada com geometries de dimensions diferentes ou se qualquer argumento for um `Point`.

* `ST_Touches(g1, g2)`

  Duas geometries *se tocam espacialmente* (*spatially touch*) se seus interiores não intersectam, mas o limite (boundary) de uma das geometries intersecta ou o limite ou o interior da outra.

  Esta função retorna 1 ou 0 para indicar se *`g1`* toca espacialmente *`g2`*.

  Esta função retorna 0 se for chamada com uma combinação de tipo de argumento geometry inaplicável. Por exemplo, retorna 0 se qualquer um dos argumentos for um `Point` ou `MultiPoint`.

  `ST_Touches()` e `Touches()` são sinônimos.

* `ST_Within(g1, g2)`

  Retorna 1 ou 0 para indicar se *`g1`* está espacialmente dentro (*within*) de *`g2`*. Isso testa a relação oposta a `ST_Contains()`.

* `Touches(g1, g2)`

  `ST_Touches()` e `Touches()` são sinônimos. Para mais informações, veja a descrição de `ST_Touches()`.

  `Touches()` está depreciada; espere que seja removida em um futuro release do MySQL. Use `ST_Touches()` em vez disso.