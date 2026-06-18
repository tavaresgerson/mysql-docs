### 12.16.3 Funções Que Criam Valores Geometry a Partir de Valores WKT

Estas funções aceitam como argumentos uma representação Well-Known Text (WKT) e, opcionalmente, um identificador de sistema de referência espacial (SRID). Elas retornam a Geometry correspondente.

`ST_GeomFromText()` aceita um valor WKT de qualquer tipo de Geometry como seu primeiro argumento. Outras funções fornecem funções de construção específicas de tipo para a construção de valores Geometry de cada tipo de Geometry.

Para uma descrição do formato WKT, consulte Formato Well-Known Text (WKT)".

* `GeomCollFromText(wkt [, srid])`, `GeometryCollectionFromText(wkt [, srid])`

  `ST_GeomCollFromText()`, `ST_GeometryCollectionFromText()`, `ST_GeomCollFromTxt()`, `GeomCollFromText()` e `GeometryCollectionFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeomCollFromText()`.

  `GeomCollFromText()` e `GeometryCollectionFromText()` estão obsoletas (deprecated); espere que elas sejam removidas em um futuro release do MySQL. Use `ST_GeomCollFromText()` e `ST_GeometryCollectionFromText()` em vez disso.

* `GeomFromText(wkt [, srid])`, `GeometryFromText(wkt [, srid])`

  `ST_GeomFromText()`, `ST_GeometryFromText()`, `GeomFromText()` e `GeometryFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeomFromText()`.

  `GeomFromText()` e `GeometryFromText()` estão obsoletas (deprecated); espere que elas sejam removidas em um futuro release do MySQL. Use `ST_GeomFromText()` e `ST_GeometryFromText()` em vez disso.

* `LineFromText(wkt [, srid])`, `LineStringFromText(wkt [, srid])`

  `ST_LineFromText()`, `ST_LineStringFromText()`, `LineFromText()` e `LineStringFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_LineFromText()`.

  `LineFromText()` e `LineStringFromText()` estão obsoletas (deprecated); espere que elas sejam removidas em um futuro release do MySQL. Use `ST_LineFromText()` e `ST_LineStringFromText()` em vez disso.

* `MLineFromText(wkt [, srid])`, `MultiLineStringFromText(wkt [, srid])`

  `ST_MLineFromText()`, `ST_MultiLineStringFromText()`, `MLineFromText()` e `MultiLineStringFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_MLineFromText()`.

  `MLineFromText()` e `MultiLineStringFromText()` estão obsoletas (deprecated); espere que elas sejam removidas em um futuro release do MySQL. Use `ST_MLineFromText()` e `ST_MultiLineStringFromText()` em vez disso.

* `MPointFromText(wkt [, srid])`, `MultiPointFromText(wkt [, srid])`

  `ST_MPointFromText()`, `ST_MultiPointFromText()`, `MPointFromText()` e `MultiPointFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_MPointFromText()`.

  `MPointFromText()` e `MultiPointFromText()` estão obsoletas (deprecated); espere que elas sejam removidas em um futuro release do MySQL. Use `ST_MPointFromText()` e `ST_MultiPointFromText()` em vez disso.

* `MPolyFromText(wkt [, srid])`, `MultiPolygonFromText(wkt [, srid])`

  `ST_MPolyFromText()`, `ST_MultiPolygonFromText()`, `MPolyFromText()` e `MultiPolygonFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_MPolyFromText()`.

  `MPolyFromText()` e `MultiPolygonFromText()` estão obsoletas (deprecated); espere que elas sejam removidas em um futuro release do MySQL. Use `ST_MPolyFromText()` e `ST_MultiPolygonFromText()` em vez disso.

* `PointFromText(wkt [, srid])`

  `ST_PointFromText()` e `PointFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_PointFromText()`.

  `PointFromText()` está obsoleta (deprecated); espere que ela seja removida em um futuro release do MySQL. Use `ST_PointFromText()` em vez disso.

* `PolyFromText(wkt [, srid])`, `PolygonFromText(wkt [, srid])`

  `ST_PolyFromText()`, `ST_PolygonFromText()`, `PolyFromText()` e `PolygonFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_PolyFromText()`.

  `PolyFromText()` e `PolygonFromText()` estão obsoletas (deprecated); espere que elas sejam removidas em um futuro release do MySQL. Use `ST_PolyFromText()` e `ST_PolygonFromText()` em vez disso.

* `ST_GeomCollFromText(wkt [, srid])`, `ST_GeometryCollectionFromText(wkt [, srid])`, `ST_GeomCollFromTxt(wkt [, srid])`

  Constrói um valor `GeometryCollection` usando sua representação WKT e SRID.

  Se o argumento Geometry for `NULL` ou não for uma Geometry sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @g = "MULTILINESTRING((10 10, 11 11), (9 9, 10 10))";
  mysql> SELECT ST_AsText(ST_GeomCollFromText(@g));
  +--------------------------------------------+
  | ST_AsText(ST_GeomCollFromText(@g))         |
  +--------------------------------------------+
  | MULTILINESTRING((10 10,11 11),(9 9,10 10)) |
  +--------------------------------------------+
  ```

  `ST_GeomCollFromText()`, `ST_GeometryCollectionFromText()`, `ST_GeomCollFromTxt()`, `GeomCollFromText()` e `GeometryCollectionFromText()` são sinônimos.

* `ST_GeomFromText(wkt [, srid])`, `ST_GeometryFromText(wkt [, srid])`

  Constrói um valor Geometry de qualquer tipo usando sua representação WKT e SRID.

  Se o argumento Geometry for `NULL` ou não for uma Geometry sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

  `ST_GeomFromText()`, `ST_GeometryFromText()`, `GeomFromText()` e `GeometryFromText()` são sinônimos.

* `ST_LineFromText(wkt [, srid])`, `ST_LineStringFromText(wkt [, srid])`

  Constrói um valor `LineString` usando sua representação WKT e SRID.

  Se o argumento Geometry for `NULL` ou não for uma Geometry sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

  `ST_LineFromText()`, `ST_LineStringFromText()`, `LineFromText()` e `LineStringFromText()` são sinônimos.

* `ST_MLineFromText(wkt [, srid])`, `ST_MultiLineStringFromText(wkt [, srid])`

  Constrói um valor `MultiLineString` usando sua representação WKT e SRID.

  Se o argumento Geometry for `NULL` ou não for uma Geometry sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

  `ST_MLineFromText()`, `ST_MultiLineStringFromText()`, `MLineFromText()` e `MultiLineStringFromText()` são sinônimos.

* `ST_MPointFromText(wkt [, srid])`, `ST_MultiPointFromText(wkt [, srid])`

  Constrói um valor `MultiPoint` usando sua representação WKT e SRID.

  Se o argumento Geometry for `NULL` ou não for uma Geometry sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

  Funções como `ST_MPointFromText()` e `ST_GeomFromText()` que aceitam representações em formato WKT de valores `MultiPoint` permitem que pontos individuais dentro dos valores sejam cercados por parênteses. Por exemplo, ambas as seguintes chamadas de função são válidas:

  ```sql
  ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
  ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
  ```

  `ST_MPointFromText()`, `ST_MultiPointFromText()`, `MPointFromText()` e `MultiPointFromText()` são sinônimos.

* `ST_MPolyFromText(wkt [, srid])`, `ST_MultiPolygonFromText(wkt [, srid])`

  Constrói um valor `MultiPolygon` usando sua representação WKT e SRID.

  Se o argumento Geometry for `NULL` ou não for uma Geometry sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

  `ST_MPolyFromText()`, `ST_MultiPolygonFromText()`, `MPolyFromText()` e `MultiPolygonFromText()` são sinônimos.

* `ST_PointFromText(wkt [, srid])`

  Constrói um valor `Point` usando sua representação WKT e SRID.

  Se o argumento Geometry for `NULL` ou não for uma Geometry sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

  `ST_PointFromText()` e `PointFromText()` são sinônimos.

* `ST_PolyFromText(wkt [, srid])`, `ST_PolygonFromText(wkt [, srid])`

  Constrói um valor `Polygon` usando sua representação WKT e SRID.

  Se o argumento Geometry for `NULL` ou não for uma Geometry sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

  `ST_PolyFromText()`, `ST_PolygonFromText()`, `PolyFromText()` e `PolygonFromText()` são sinônimos.