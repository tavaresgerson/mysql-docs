#### 12.16.7.3 Funções de Propriedade de LineString e MultiLineString

Uma `LineString` é composta por valores de `Point`. Você pode extrair pontos específicos de uma `LineString`, contar o número de pontos que ela contém ou obter sua extensão.

Algumas funções nesta seção também funcionam para valores de `MultiLineString`.

- `EndPoint(ls)`

  `ST_EndPoint()` e `EndPoint()` são sinônimos. Para mais informações, consulte a descrição de `ST_EndPoint()`.

  `EndPoint()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_EndPoint()` em vez disso.

- `GLength(ls)`

  `GLength()` é um nome não padrão. Ele corresponde à função OpenGIS `ST_Length()`. (Existe uma função SQL existente `Length()` que calcula o comprimento dos valores de string.)

  `GLength()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_Length()` em vez disso.

- `IsClosed(ls)`

  `ST_IsClosed()` e `IsClosed()` são sinônimos. Para mais informações, consulte a descrição de `ST_IsClosed()`.

  `IsClosed()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_IsClosed()` em vez disso.

- `NumPoints(ls)`

  `ST_NumPoints()` e `NumPoints()` são sinônimos. Para mais informações, consulte a descrição de `ST_NumPoints()`.

  `NumPoints()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_NumPoints()` em vez disso.

- `PontoN(ls, N)`

  `ST_PointN()` e `PointN()` são sinônimos. Para mais informações, consulte a descrição de `ST_PointN()`.

  `PointN()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_PointN()` em vez disso.

- `ST_EndPoint(ls)`

  Retorna o `Ponto` que é o ponto final do valor `LineString` *`ls`*. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno será `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_EndPoint(ST_GeomFromText(@ls)));
  +----------------------------------------------+
  | ST_AsText(ST_EndPoint(ST_GeomFromText(@ls))) |
  +----------------------------------------------+
  | POINT(3 3)                                   |
  +----------------------------------------------+
  ```

  `ST_EndPoint()` e `EndPoint()` são sinônimos.

- `ST_IsClosed(ls)`

  Para um valor de `LineString` *`ls`*, `ST_IsClosed()` retorna 1 se *`ls`* for fechado (ou seja, seus valores de `ST_StartPoint()` e `ST_EndPoint()` forem os mesmos). Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

  Para um valor de `MultiLineString` *`ls`*, `ST_IsClosed()` retorna 1 se *`ls`* estiver fechado (ou seja, os valores de `ST_StartPoint()` e `ST_EndPoint()` forem os mesmos para cada `LineString` em *`ls`*).

  `ST_IsClosed()` retorna 0 se o *`ls`* não estiver fechado.

  ```sql
  mysql> SET @ls1 = 'LineString(1 1,2 2,3 3,2 2)';
  mysql> SET @ls2 = 'LineString(1 1,2 2,3 3,1 1)';

  mysql> SELECT ST_IsClosed(ST_GeomFromText(@ls1));
  +------------------------------------+
  | ST_IsClosed(ST_GeomFromText(@ls1)) |
  +------------------------------------+
  |                                  0 |
  +------------------------------------+

  mysql> SELECT ST_IsClosed(ST_GeomFromText(@ls2));
  +------------------------------------+
  | ST_IsClosed(ST_GeomFromText(@ls2)) |
  +------------------------------------+
  |                                  1 |
  +------------------------------------+

  mysql> SET @ls3 = 'MultiLineString((1 1,2 2,3 3),(4 4,5 5))';

  mysql> SELECT ST_IsClosed(ST_GeomFromText(@ls3));
  +------------------------------------+
  | ST_IsClosed(ST_GeomFromText(@ls3)) |
  +------------------------------------+
  |                                  0 |
  +------------------------------------+
  ```

  `ST_IsClosed()` e `IsClosed()` são sinônimos.

- `ST_Length(ls)`

  Retorna um número de ponto flutuante duplo que indica a extensão da linha `LineString` ou `MultiLineString` *`ls`* no seu sistema de referência espacial associado. A extensão de um valor `MultiLineString` é igual à soma das extensões dos seus elementos. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_Length(ST_GeomFromText(@ls));
  +---------------------------------+
  | ST_Length(ST_GeomFromText(@ls)) |
  +---------------------------------+
  |              2.8284271247461903 |
  +---------------------------------+

  mysql> SET @mls = 'MultiLineString((1 1,2 2,3 3),(4 4,5 5))';
  mysql> SELECT ST_Length(ST_GeomFromText(@mls));
  +----------------------------------+
  | ST_Length(ST_GeomFromText(@mls)) |
  +----------------------------------+
  |                4.242640687119286 |
  +----------------------------------+
  ```

  `ST_Length()` deve ser usado em preferência a `GLength()`, que tem um nome não padrão.

- `ST_NumPoints(ls)`

  Retorna o número de objetos `Point` no valor `LineString` *`ls`*. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno será `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_NumPoints(ST_GeomFromText(@ls));
  +------------------------------------+
  | ST_NumPoints(ST_GeomFromText(@ls)) |
  +------------------------------------+
  |                                  3 |
  +------------------------------------+
  ```

  `ST_NumPoints()` e `NumPoints()` são sinônimos.

- `ST_PointN(ls, N)`

  Retorna o *`N`*-ésimo `Ponto` no valor `Linestring` *`ls`*. Os pontos são numerados a partir do 1. Se algum argumento for `NULL` ou o argumento de geometria for uma geometria vazia, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_PointN(ST_GeomFromText(@ls),2));
  +----------------------------------------------+
  | ST_AsText(ST_PointN(ST_GeomFromText(@ls),2)) |
  +----------------------------------------------+
  | POINT(2 2)                                   |
  +----------------------------------------------+
  ```

  `ST_PointN()` e `PointN()` são sinônimos.

- `ST_StartPoint(ls)`

  Retorna o `Ponto` que é o ponto de início do valor `LineString` *`ls`*. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_StartPoint(ST_GeomFromText(@ls)));
  +------------------------------------------------+
  | ST_AsText(ST_StartPoint(ST_GeomFromText(@ls))) |
  +------------------------------------------------+
  | POINT(1 1)                                     |
  +------------------------------------------------+
  ```

  `ST_StartPoint()` e `StartPoint()` são sinônimos.

- `StartPoint(ls)`

  `ST_StartPoint()` e `StartPoint()` são sinônimos. Para mais informações, consulte a descrição de `ST_StartPoint()`.

  `StartPoint()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_StartPoint()` em vez disso.
