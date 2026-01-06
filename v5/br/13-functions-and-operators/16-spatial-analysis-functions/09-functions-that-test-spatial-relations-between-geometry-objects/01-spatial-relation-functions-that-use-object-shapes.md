#### 12.16.9.1 Funções de Relação Espacial que Utilizam Formas de Objetos

A especificação OpenGIS define as seguintes funções para testar a relação entre dois valores de geometria *`g1`* e *`g2`*, usando formas de objetos precisas. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente, exceto para `ST_Distance()` e `Distance()`, que retornam valores de distância.

Essas funções suportam todas as combinações de tipos de argumento, exceto aquelas que não são aplicáveis de acordo com a especificação do Open Geospatial Consortium.

- `Cruzes(g1, g2)`

  `ST_Crosses()` e `Crosses()` são sinônimos. Para mais informações, consulte a descrição de `ST_Crosses()`.

  `Crosses()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_Crosses()` em vez disso.

- `Distância(g1, g2)`

  `ST_Distance()` e `Distance()` são sinônimos. Para mais informações, consulte a descrição de `ST_Distance()`.

  `Distance()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_Distance()` em vez disso.

- `ST_Contains(g1, g2)`

  Retorna 1 ou 0 para indicar se *`g1`* contém completamente *`g2`*. Isso testa a relação oposta à `ST_Within()`.

- `ST_Crosses(g1, g2)`

  O termo *cruza espacialmente* denota uma relação espacial entre duas geómetrias dadas que possui as seguintes propriedades:

  - As duas geometrias se cruzam.

  - Sua interseção resulta em uma geometria que tem uma dimensão que é uma unidade menor que a dimensão máxima das duas geometrias dadas.

  - Sua interseção não é igual a nenhuma das duas geometrias dadas.

  Essa função retorna 1 ou 0 para indicar se *`g1`* cruza espacialmente *`g2`*. Se *`g1`* for um `Polygon` ou um `MultiPolygon`, ou se *`g2`* for um `Point` ou um `MultiPoint`, o valor de retorno é `NULL`.

  Essa função retorna 0 se chamada com uma combinação de tipos de argumento de geometria inapropriada. Por exemplo, ela retorna 0 se o primeiro argumento for um `Polygon` ou `MultiPolygon` e/ou o segundo argumento for um `Point` ou `MultiPoint`.

  Retorna 1 se *`g1`* cruzar espacialmente *`g2`*. Retorna `NULL` se *`g1`* for um `Polygon` ou um `MultiPolygon`, ou se *`g2`* for um `Point` ou um `MultiPoint`. Caso contrário, retorna 0.

  Essa função retorna 0 se chamada com uma combinação de tipos de argumento de geometria inapropriada. Por exemplo, ela retorna 0 se o primeiro argumento for um `Polygon` ou `MultiPolygon` e/ou o segundo argumento for um `Point` ou `MultiPoint`.

  `ST_Crosses()` e `Crosses()` são sinônimos.

- `ST_Disjoint(g1, g2)`

  Retorna 1 ou 0 para indicar se *`g1`* é espacialmente disjuntado de (não intersecta) *`g2`*.

- `ST_Distância(g1, g2)`

  Retorna a distância entre *`g1`* e *`g2`*. Se qualquer argumento for `NULL` ou uma geometria vazia, o valor de retorno será `NULL`.

  Essa função processa coleções de geometria, retornando a menor distância entre todas as combinações dos componentes dos dois argumentos de geometria.

  Se um resultado intermediário ou final produzir NaN ou um número negativo, ocorrerá um erro `ER_GIS_INVALID_DATA`.

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

- `ST_Equals(g1, g2)`

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

- `ST_Intersects(g1, g2)`

  Retorna 1 ou 0 para indicar se *`g1`* intersecta espacialmente *`g2`*.

- `ST_Overlaps(g1, g2)`

  Duas geometrias *se sobrepõem espacialmente* se intersectam e sua interseção resulta em uma geometria da mesma dimensão, mas não igual a nenhuma das geometrias dadas.

  Essa função retorna 1 ou 0 para indicar se *`g1`* sobrepõe-se espacialmente a *`g2`*.

  Essa função retorna 0 se chamada com uma combinação de tipos de argumento de geometria inapropriada. Por exemplo, ela retorna 0 se chamada com geometrias de dimensões diferentes ou se qualquer argumento for um `Ponto`.

- `ST_Touches(g1, g2)`

  Duas geometrias *tocam-se espacialmente* se seus interiores não se intersectam, mas a borda de uma das geometrias intersecta a borda ou o interior da outra.

  Essa função retorna 1 ou 0 para indicar se *`g1`* toca espacialmente *`g2`*.

  Essa função retorna 0 se chamada com uma combinação de tipos de argumento de geometria inapropriada. Por exemplo, ela retorna 0 se qualquer um dos argumentos for um `Ponto` ou `MultiPonto`.

  `ST_Touches()` e `Touches()` são sinônimos.

- `ST_Dentro(g1, g2)`

  Retorna 1 ou 0 para indicar se *`g1`* está espacialmente dentro de *`g2`*. Isso testa a relação oposta à `ST_Contains()`.

- `Touches(g1, g2)`

  `ST_Touches()` e `Touches()` são sinônimos. Para mais informações, consulte a descrição de `ST_Touches()`.

  `Touches()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_Touches()` em vez disso.
