### 12.16.4 Funções Que Criam Valores Geometry a partir de Valores WKB

Estas funções aceitam como argumentos um `BLOB` contendo uma representação Well-Known Binary (WKB) e, opcionalmente, um identificador de sistema de referência espacial (SRID). Elas retornam a Geometry correspondente.

`ST_GeomFromWKB()` aceita um valor WKB de qualquer tipo de Geometry como seu primeiro argumento. Outras funções fornecem funções de construção específicas de tipo para a construção de valores Geometry de cada tipo de Geometry.

Estas funções também aceitam objetos Geometry conforme retornados pelas funções na Seção 12.16.5, “Funções Específicas do MySQL Que Criam Valores Geometry”. Assim, essas funções podem ser usadas para fornecer o primeiro argumento para as funções nesta seção. No entanto, a partir do MySQL 5.7.19, o uso de argumentos Geometry está deprecated e gera um warning. Argumentos Geometry não são aceitos no MySQL 8.0. Para migrar chamadas do uso de argumentos Geometry para o uso de argumentos WKB, siga estas diretrizes:

Para uma descrição do formato WKB, consulte Well-Known Binary (WKB) Format Format").

* Reescreva construções como `ST_GeomFromWKB(Point(0, 0))` como `Point(0, 0)`.

* Reescreva construções como `ST_GeomFromWKB(Point(0, 0), 4326)` como `ST_GeomFromWKB(ST_AsWKB(Point(0, 0)), 4326)`. (Alternativamente, no MySQL 8.0, você pode usar `ST_SRID(Point(0, 0), 4326)`.)

* `GeomCollFromWKB(wkb [, srid])`, `GeometryCollectionFromWKB(wkb [, srid])`

  `ST_GeomCollFromWKB()`, `ST_GeometryCollectionFromWKB()`, `GeomCollFromWKB()` e `GeometryCollectionFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeomCollFromWKB()`.

  `GeomCollFromWKB()` e `GeometryCollectionFromWKB()` estão deprecated; espere que sejam removidas em um futuro lançamento do MySQL. Use `ST_GeomCollFromWKB()` e `ST_GeometryCollectionFromWKB()` em seu lugar.

* `GeomFromWKB(wkb [, srid])`, `GeometryFromWKB(wkb [, srid])`

  `ST_GeomFromWKB()`, `ST_GeometryFromWKB()`, `GeomFromWKB()` e `GeometryFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeomFromWKB()`.

  `GeomFromWKB()` e `GeometryFromWKB()` estão deprecated; espere que sejam removidas em um futuro lançamento do MySQL. Use `ST_GeomFromWKB()` e `ST_GeometryFromWKB()` em seu lugar.

* `LineFromWKB(wkb [, srid])`, `LineStringFromWKB(wkb [, srid])`

  `ST_LineFromWKB()`, `ST_LineStringFromWKB()`, `LineFromWKB()` e `LineStringFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_LineFromWKB()`.

  `LineFromWKB()` e `LineStringFromWKB()` estão deprecated; espere que sejam removidas em um futuro lançamento do MySQL. Use `ST_LineFromWKB()` e `ST_LineStringFromWKB()` em seu lugar.

* `MLineFromWKB(wkb [, srid])`, `MultiLineStringFromWKB(wkb [, srid])`

  `ST_MLineFromWKB()`, `ST_MultiLineStringFromWKB()`, `MLineFromWKB()` e `MultiLineStringFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_MLineFromWKB()`.

  `MLineFromWKB()` e `MultiLineStringFromWKB()` estão deprecated; espere que sejam removidas em um futuro lançamento do MySQL. Use `ST_MLineFromWKB()` e `ST_MultiLineStringFromWKB()` em seu lugar.

* `MPointFromWKB(wkb [, srid])`, `MultiPointFromWKB(wkb [, srid])`

  `ST_MPointFromWKB()`, `ST_MultiPointFromWKB()`, `MPointFromWKB()` e `MultiPointFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_MPointFromWKB()`.

  `MPointFromWKB()` e `MultiPointFromWKB()` estão deprecated; espere que sejam removidas em um futuro lançamento do MySQL. Use `ST_MPointFromWKB()` e `ST_MultiPointFromWKB()` em seu lugar.

* `MPolyFromWKB(wkb [, srid])`, `MultiPolygonFromWKB(wkb [, srid])`

  `ST_MPolyFromWKB()`, `ST_MultiPolygonFromWKB()`, `MPolyFromWKB()` e `MultiPolygonFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_MPolyFromWKB()`.

  `MPolyFromWKB()` e `MultiPolygonFromWKB()` estão deprecated; espere que sejam removidas em um futuro lançamento do MySQL. Use `ST_MPolyFromWKB()` e `ST_MultiPolygonFromWKB()` em seu lugar.

* `PointFromWKB(wkb [, srid])`

  `ST_PointFromWKB()` e `PointFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_PointFromWKB()`.

  `PointFromWKB()` está deprecated; espere que seja removida em um futuro lançamento do MySQL. Use `ST_PointFromWKB()` em seu lugar.

* `PolyFromWKB(wkb [, srid])`, `PolygonFromWKB(wkb [, srid])`

  `ST_PolyFromWKB()`, `ST_PolygonFromWKB()`, `PolyFromWKB()` e `PolygonFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_PolyFromWKB()`.

  `PolyFromWKB()` e `PolygonFromWKB()` estão deprecated; espere que sejam removidas em um futuro lançamento do MySQL. Use `ST_PolyFromWKB()` e `ST_PolygonFromWKB()` em seu lugar.

* `ST_GeomCollFromWKB(wkb [, srid])`, `ST_GeometryCollectionFromWKB(wkb [, srid])`

  Constrói um valor `GeometryCollection` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_GeomCollFromWKB()`, `ST_GeometryCollectionFromWKB()`, `GeomCollFromWKB()` e `GeometryCollectionFromWKB()` são sinônimos.

* `ST_GeomFromWKB(wkb [, srid])`, `ST_GeometryFromWKB(wkb [, srid])`

  Constrói um valor Geometry de qualquer tipo usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_GeomFromWKB()`, `ST_GeometryFromWKB()`, `GeomFromWKB()` e `GeometryFromWKB()` são sinônimos.

* `ST_LineFromWKB(wkb [, srid])`, `ST_LineStringFromWKB(wkb [, srid])`

  Constrói um valor `LineString` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_LineFromWKB()`, `ST_LineStringFromWKB()`, `LineFromWKB()` e `LineStringFromWKB()` são sinônimos.

* `ST_MLineFromWKB(wkb [, srid])`, `ST_MultiLineStringFromWKB(wkb [, srid])`

  Constrói um valor `MultiLineString` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_MLineFromWKB()`, `ST_MultiLineStringFromWKB()`, `MLineFromWKB()` e `MultiLineStringFromWKB()` são sinônimos.

* `ST_MPointFromWKB(wkb [, srid])`, `ST_MultiPointFromWKB(wkb [, srid])`

  Constrói um valor `MultiPoint` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_MPointFromWKB()`, `ST_MultiPointFromWKB()`, `MPointFromWKB()` e `MultiPointFromWKB()` são sinônimos.

* `ST_MPolyFromWKB(wkb [, srid])`, `ST_MultiPolygonFromWKB(wkb [, srid])`

  Constrói um valor `MultiPolygon` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_MPolyFromWKB()`, `ST_MultiPolygonFromWKB()`, `MPolyFromWKB()` e `MultiPolygonFromWKB()` são sinônimos.

* `ST_PointFromWKB(wkb [, srid])`

  Constrói um valor `Point` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_PointFromWKB()` e `PointFromWKB()` são sinônimos.

* `ST_PolyFromWKB(wkb [, srid])`, `ST_PolygonFromWKB(wkb [, srid])`

  Constrói um valor `Polygon` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_PolyFromWKB()`, `ST_PolygonFromWKB()`, `PolyFromWKB()` e `PolygonFromWKB()` são sinônimos.