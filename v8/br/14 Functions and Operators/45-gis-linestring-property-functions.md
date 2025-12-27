#### 14.16.7.3 Funções de Propriedades de LineString e MultiLineString

Um `LineString` é composto por valores `Point`. Você pode extrair pontos específicos de um `LineString`, contar o número de pontos que ele contém ou obter sua extensão.

Algumas funções nesta seção também funcionam para valores de `MultiLineString`.

A menos que especificado de outra forma, as funções nesta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL` ou se qualquer argumento de geometria for uma geometria vazia, o valor de retorno é `NULL`.
* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.
* Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial (SRS) indefinido, ocorre um erro `ER_SRS_NOT_FOUND`.
* Caso contrário, o valor de retorno não é `NULL`.

Estas funções estão disponíveis para obter propriedades de lineString:

*  `ST_EndPoint(ls)`

  Retorna o `Point` que é o ponto final do valor `LineString` *`ls`*.

   `ST_EndPoint()` trata seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_EndPoint(ST_GeomFromText(@ls)));
  +----------------------------------------------+
  | ST_AsText(ST_EndPoint(ST_GeomFromText(@ls))) |
  +----------------------------------------------+
  | POINT(3 3)                                   |
  +----------------------------------------------+
  ```
*  `ST_IsClosed(ls)`

  Para um valor `LineString` *`ls`*, `ST_IsClosed()` retorna 1 se *`ls`* for fechado (ou seja, seus valores `ST_StartPoint()` e `ST_EndPoint()` são os mesmos).

  Para um valor `MultiLineString` *`ls`*, `ST_IsClosed()` retorna 1 se *`ls`* for fechado (ou seja, os valores `ST_StartPoint()` e `ST_EndPoint()` são os mesmos para cada `LineString` em *`ls`*).

   `ST_IsClosed()` retorna 0 se *`ls`* não for fechado e `NULL` se *`ls`* for `NULL`.

   `ST_IsClosed()` trata seus argumentos conforme descrito na introdução desta seção, com esta exceção:

  + Se a geometria tiver um valor SRID para um sistema de referência espacial (SRS) geográfico, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

  ```
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
* `ST_Length(ls [, unit])`
```
  mysql> SET @ls = ST_GeomFromText('LineString(1 1,2 2,3 3)');
  mysql> SELECT ST_Length(@ls);
  +--------------------+
  | ST_Length(@ls)     |
  +--------------------+
  | 2.8284271247461903 |
  +--------------------+

  mysql> SET @mls = ST_GeomFromText('MultiLineString((1 1,2 2,3 3),(4 4,5 5))');
  mysql> SELECT ST_Length(@mls);
  +-------------------+
  | ST_Length(@mls)   |
  +-------------------+
  | 4.242640687119286 |
  +-------------------+

  mysql> SET @ls = ST_GeomFromText('LineString(1 1,2 2,3 3)', 4326);
  mysql> SELECT ST_Length(@ls);
  +-------------------+
  | ST_Length(@ls)    |
  +-------------------+
  | 313701.9623204328 |
  +-------------------+
  mysql> SELECT ST_Length(@ls, 'metre');
  +-------------------------+
  | ST_Length(@ls, 'metre') |
  +-------------------------+
  |       313701.9623204328 |
  +-------------------------+
  mysql> SELECT ST_Length(@ls, 'foot');
  +------------------------+
  | ST_Length(@ls, 'foot') |
  +------------------------+
  |     1029205.9131247795 |
  +------------------------+
  ```2TN01QMqDX
*  `ST_NumPoints(ls)`
```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_NumPoints(ST_GeomFromText(@ls));
  +------------------------------------+
  | ST_NumPoints(ST_GeomFromText(@ls)) |
  +------------------------------------+
  |                                  3 |
  +------------------------------------+
  ```6c8c3i1SPB
* `ST_PointN(ls, N)`
```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_PointN(ST_GeomFromText(@ls),2));
  +----------------------------------------------+
  | ST_AsText(ST_PointN(ST_GeomFromText(@ls),2)) |
  +----------------------------------------------+
  | POINT(2 2)                                   |
  +----------------------------------------------+
  ```SYTzIXFh20
*  `ST_StartPoint(ls)`
```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_StartPoint(ST_GeomFromText(@ls)));
  +------------------------------------------------+
  | ST_AsText(ST_StartPoint(ST_GeomFromText(@ls))) |
  +------------------------------------------------+
  | POINT(1 1)                                     |
  +------------------------------------------------+
  ```UQKfFS2gP2


```