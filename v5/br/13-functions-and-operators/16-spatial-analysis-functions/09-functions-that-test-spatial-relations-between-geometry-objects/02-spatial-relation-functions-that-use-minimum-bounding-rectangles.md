#### 12.16.9.2 Funções de Relação Espacial Que Usam Retângulos Delimitadores Mínimos

O MySQL fornece várias funções específicas do MySQL que testam a relação entre os *minimum bounding rectangles* (MBRs) de duas *geometries* *`g1`* e *`g2`*. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente.

Um conjunto correspondente de funções MBR definidas de acordo com a especificação OpenGIS é descrito mais adiante nesta seção.

* `MBRContains(g1, g2)`

  Retorna 1 ou 0 para indicar se o *minimum bounding rectangle* de *`g1`* contém o *minimum bounding rectangle* de *`g2`*. Isso testa a relação oposta a `MBRWithin()`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))');
  mysql> SET @g2 = ST_GeomFromText('Point(1 1)');
  mysql> SELECT MBRContains(@g1,@g2), MBRWithin(@g2,@g1);
  +----------------------+--------------------+
  | MBRContains(@g1,@g2) | MBRWithin(@g2,@g1) |
  +----------------------+--------------------+
  |                    1 |                  1 |
  +----------------------+--------------------+
  ```

  `MBRContains()` e `Contains()` são sinônimos.

* `MBRCoveredBy(g1, g2)`

  Retorna 1 ou 0 para indicar se o *minimum bounding rectangle* de *`g1`* está coberto pelo *minimum bounding rectangle* de *`g2`*. Isso testa a relação oposta a `MBRCovers()`.

  `MBRCoveredBy()` lida com seus argumentos da seguinte forma:

  + Se qualquer argumento for `NULL` ou uma *geometry* vazia, o valor de retorno é `NULL`.

  + Se qualquer argumento não for uma *geometry byte string* sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

  + Caso contrário, o valor de retorno é não-`NULL`.

  ```sql
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

* `MBRCovers(g1, g2)`

  Retorna 1 ou 0 para indicar se o *minimum bounding rectangle* de *`g1`* cobre o *minimum bounding rectangle* de *`g2`*. Isso testa a relação oposta a `MBRCoveredBy()`. Veja a descrição de `MBRCoveredBy()` para exemplos.

  `MBRCovers()` lida com seus argumentos da seguinte forma:

  + Se qualquer argumento for `NULL` ou uma *geometry* vazia, o valor de retorno é `NULL`.

  + Se qualquer argumento não for uma *geometry byte string* sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

  + Caso contrário, o valor de retorno é não-`NULL`.

* `MBRDisjoint(g1, g2)`

  Retorna 1 ou 0 para indicar se os *minimum bounding rectangles* das duas *geometries* *`g1`* e *`g2`* são *disjoint* (não se intersectam).

  `MBRDisjoint()` e `Disjoint()` são sinônimos.

* `MBREqual(g1, g2)`

  Retorna 1 ou 0 para indicar se os *minimum bounding rectangles* das duas *geometries* *`g1`* e *`g2`* são os mesmos.

  `MBREqual()` está descontinuada (*deprecated*); espere que seja removida em uma futura versão do MySQL. Use `MBREquals()` em vez disso.

* `MBREquals(g1, g2)`

  Retorna 1 ou 0 para indicar se os *minimum bounding rectangles* das duas *geometries* *`g1`* e *`g2`* são os mesmos.

  `MBREquals()`, `MBREqual()` e `Equals()` são sinônimos.

* `MBRIntersects(g1, g2)`

  Retorna 1 ou 0 para indicar se os *minimum bounding rectangles* das duas *geometries* *`g1`* e *`g2`* se intersectam.

  `MBRIntersects()` e `Intersects()` são sinônimos.

* `MBROverlaps(g1, g2)`

  Duas *geometries* *se sobrepõem espacialmente* (*spatially overlap*) se elas se intersectam e sua intersecção resulta em uma *geometry* da mesma dimensão, mas não igual a nenhuma das *geometries* fornecidas.

  Esta função retorna 1 ou 0 para indicar se os *minimum bounding rectangles* das duas *geometries* *`g1`* e *`g2`* se sobrepõem (*overlap*).

  `MBROverlaps()` e `Overlaps()` são sinônimos.

* `MBRTouches(g1, g2)`

  Duas *geometries* *se tocam espacialmente* (*spatially touch*) se seus interiores não se intersectam, mas o limite (*boundary*) de uma das *geometries* intersecta ou o limite ou o interior da outra.

  Esta função retorna 1 ou 0 para indicar se os *minimum bounding rectangles* das duas *geometries* *`g1`* e *`g2`* se tocam (*touch*).

* `MBRWithin(g1, g2)`

  Retorna 1 ou 0 para indicar se o *minimum bounding rectangle* de *`g1`* está dentro (*within*) do *minimum bounding rectangle* de *`g2`*. Isso testa a relação oposta a `MBRContains()`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))');
  mysql> SET @g2 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))');
  mysql> SELECT MBRWithin(@g1,@g2), MBRWithin(@g2,@g1);
  +--------------------+--------------------+
  | MBRWithin(@g1,@g2) | MBRWithin(@g2,@g1) |
  +--------------------+--------------------+
  |                  1 |                  0 |
  +--------------------+--------------------+
  ```

  `MBRWithin()` e `Within()` são sinônimos.

A especificação OpenGIS define as seguintes funções que testam a relação entre dois valores de *geometry* *`g1`* e *`g2`*. A implementação do MySQL usa *minimum bounding rectangles*, então essas funções retornam o mesmo resultado que as funções correspondentes baseadas em MBR descritas anteriormente nesta seção. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente.

Essas funções suportam todas as combinações de tipos de argumentos, exceto aquelas que são inaplicáveis de acordo com a especificação do Open Geospatial Consortium.

* `Contains(g1, g2)`

  `MBRContains()` e `Contains()` são sinônimos. Para mais informações, veja a descrição de `MBRContains()`.

  `Contains()` está descontinuada (*deprecated*); espere que seja removida em uma futura versão do MySQL. Use `MBRContains()` em vez disso.

* `Disjoint(g1, g2)`

  `MBRDisjoint()` e `Disjoint()` são sinônimos. Para mais informações, veja a descrição de `MBRDisjoint()`.

  `Disjoint()` está descontinuada (*deprecated*); espere que seja removida em uma futura versão do MySQL. Use `MBRDisjoint()` em vez disso.

* `Equals(g1, g2)`

  `MBREquals()` e `Equals()` são sinônimos. Para mais informações, veja a descrição de `MBREquals()`.

  `Equals()` está descontinuada (*deprecated*); espere que seja removida em uma futura versão do MySQL. Use `MBREquals()` em vez disso.

* `Intersects(g1, g2)`

  `MBRIntersects()` e `Intersects()` são sinônimos. Para mais informações, veja a descrição de `MBRIntersects()`.

  `Intersects()` está descontinuada (*deprecated*); espere que seja removida em uma futura versão do MySQL. Use `MBRIntersects()` em vez disso.

* `Overlaps(g1, g2)`

  `MBROverlaps()` e `Overlaps()` são sinônimos. Para mais informações, veja a descrição de `MBROverlaps()`.

  `Overlaps()` está descontinuada (*deprecated*); espere que seja removida em uma futura versão do MySQL. Use `MBROverlaps()` em vez disso.

* `Within(g1, g2)`

  `MBRWithin()` e `Within()` são sinônimos. Para mais informações, veja a descrição de `MBRWithin()`.

  `Within()` está descontinuada (*deprecated*); espere que seja removida em uma futura versão do MySQL. Use `MBRWithin()` em vez disso.