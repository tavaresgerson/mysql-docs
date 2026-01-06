#### 12.16.9.2 Funções de Relação Espacial que Utilizam Rectângulos de Limite Mínimos

O MySQL oferece várias funções específicas do MySQL que testam a relação entre os retângulos de contorno mínimo (MBRs) de duas geómetrias *`g1`* e *`g2`*. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente.

Um conjunto correspondente de funções de MBR definido de acordo com a especificação OpenGIS é descrito mais adiante nesta seção.

- `MBRContains(g1, g2)`

  Retorna 1 ou 0 para indicar se o retângulo de contorno mínimo de *`g1`* contém o retângulo de contorno mínimo de *`g2`*. Isso testa a relação oposta à `MBRWithin()`.

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

- `MBRCobertoPor(g1, g2)`

  Retorna 1 ou 0 para indicar se o retângulo de contorno mínimo de *`g1`* está coberto pelo retângulo de contorno mínimo de *`g2`*. Isso testa a relação oposta à `MBRCovers()`.

  `MBRCoveredBy()` lida com seus argumentos da seguinte forma:

  - Se qualquer argumento for `NULL` ou uma geometria vazia, o valor de retorno será `NULL`.

  - Se qualquer argumento não for uma cadeia de bytes de geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

  - Caso contrário, o valor de retorno não é `NULL`.

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

- `MBRCovers(g1, g2)`

  Retorna 1 ou 0 para indicar se o retângulo de contorno mínimo de *`g1`* cobre o retângulo de contorno mínimo de *`g2`*. Isso testa a relação oposta à `MBRCoveredBy()`. Veja a descrição de `MBRCoveredBy()` para exemplos.

  `MBRCovers()` lida com seus argumentos da seguinte forma:

  - Se qualquer argumento for `NULL` ou uma geometria vazia, o valor de retorno será `NULL`.

  - Se qualquer argumento não for uma cadeia de bytes de geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

  - Caso contrário, o valor de retorno não é `NULL`.

- `MBRDisjoint(g1, g2)`

  Retorna 1 ou 0 para indicar se os retângulos de contorno mínimos das duas geometrias *`g1`* e *`g2`* são disjuntos (não se intersectam).

  `MBRDisjoint()` e `Disjoint()` são sinônimos.

- `MBREqual(g1, g2)`

  Retorna 1 ou 0 para indicar se os retângulos de contorno mínimos das duas geometrias *`g1`* e *`g2`* são os mesmos.

  `MBREqual()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `MBREquals()`.

- `MBREquals(g1, g2)`

  Retorna 1 ou 0 para indicar se os retângulos de contorno mínimos das duas geometrias *`g1`* e *`g2`* são os mesmos.

  `MBREquals()`, `MBREqual()` e `Equals()` são sinônimos.

- `MBRIntersects(g1, g2)`

  Retorna 1 ou 0 para indicar se os retângulos de contorno mínimos das duas geometrias *`g1`* e *`g2`* se intersectam.

  `MBRIntersects()` e `Intersects()` são sinônimos.

- `MBROverlaps(g1, g2)`

  Duas geometrias *se sobrepõem espacialmente* se intersectam e sua interseção resulta em uma geometria da mesma dimensão, mas não igual a nenhuma das geometrias dadas.

  Essa função retorna 1 ou 0 para indicar se os retângulos de contorno mínimos das duas geometrias *`g1`* e *`g2`* se sobrepõem.

  `MBROverlaps()` e `Overlaps()` são sinônimos.

- `MBRTouches(g1, g2)`

  Duas geometrias *tocam-se espacialmente* se seus interiores não se intersectam, mas a borda de uma das geometrias intersecta a borda ou o interior da outra.

  Essa função retorna 1 ou 0 para indicar se os retângulos de contorno mínimos das duas geometrias *`g1`* e *`g2`* se tocam.

- `MBRWithin(g1, g2)`

  Retorna 1 ou 0 para indicar se o retângulo de contorno mínimo de *`g1`* está dentro do retângulo de contorno mínimo de *`g2`*. Isso testa a relação oposta à `MBRContains()`.

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

A especificação OpenGIS define as seguintes funções que testam a relação entre dois valores de geometria *`g1`* e *`g2`*. A implementação do MySQL usa retângulos de delimitação mínima, portanto, essas funções retornam o mesmo resultado que as funções baseadas em MBR descritas anteriormente nesta seção. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente.

Essas funções suportam todas as combinações de tipos de argumento, exceto aquelas que não são aplicáveis de acordo com a especificação do Open Geospatial Consortium.

- `Contains(g1, g2)`

  `MBRContains()` e `Contains()` são sinônimos. Para mais informações, consulte a descrição de `MBRContains()`.

  `Contains()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `MBRContains()` em vez disso.

- `Disjoint(g1, g2)`

  `MBRDisjoint()` e `Disjoint()` são sinônimos. Para mais informações, consulte a descrição de `MBRDisjoint()`.

  `Disjoint()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `MBRDisjoint()` em vez disso.

- `Equals(g1, g2)`

  `MBREquals()` e `Equals()` são sinônimos. Para mais informações, consulte a descrição de `MBREquals()`.

  `Equals()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `MBREquals()` em vez disso.

- `Intersects(g1, g2)`

  `MBRIntersects()` e `Intersects()` são sinônimos. Para mais informações, consulte a descrição de `MBRIntersects()`.

  `Intersects()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `MBRIntersects()` em vez disso.

- `Overlaps(g1, g2)`

  `MBROverlaps()` e `Overlaps()` são sinônimos. Para mais informações, consulte a descrição de `MBROverlaps()`.

  `Overlaps()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `MBROverlaps()` em vez disso.

- `Dentro(g1, g2)`

  `MBRWithin()` e `Within()` são sinônimos. Para mais informações, consulte a descrição de `MBRWithin()`.

  `Within()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `MBRWithin()` em vez disso.
