### 12.16.4 Funções que criam valores de geometria a partir de valores WKB

Essas funções aceitam como argumentos um `BLOB` contendo uma representação em formato Well-Known Binary (WKB) e, opcionalmente, um identificador do sistema de referência espacial (SRID). Elas retornam a geometria correspondente.

`ST_GeomFromWKB()` aceita um valor WKB de qualquer tipo de geometria como seu primeiro argumento. Outras funções fornecem funções de construção específicas para cada tipo de geometria.

Essas funções também aceitam objetos de geometria como retornados pelas funções na Seção 12.16.5, “Funções Específicas do MySQL que Criam Valores de Geometria”. Assim, essas funções podem ser usadas para fornecer o primeiro argumento às funções nesta seção. No entanto, a partir do MySQL 5.7.19, o uso de argumentos de geometria é desaconselhado e gera uma mensagem de aviso. Argumentos de geometria não são aceitos no MySQL 8.0. Para migrar chamadas que usam argumentos de geometria para usar argumentos WKB, siga estas diretrizes:

Para uma descrição do formato WKB, consulte "Formato de Formato Binário Bem Conhecido (WKB)".

- Construções como `ST_GeomFromWKB(Point(0, 0))` devem ser reescritas como `Point(0, 0)`.

- Construções como `ST_GeomFromWKB(Point(0, 0), 4326)` devem ser reescritas como `ST_GeomFromWKB(ST_AsWKB(Point(0, 0)), 4326)`. (Alternativamente, no MySQL 8.0, você pode usar `ST_SRID(Point(0, 0), 4326)`.

- `GeomCollFromWKB(wkb [, srid])`, `GeometryCollectionFromWKB(wkb [, srid])`

  `ST_GeomCollFromWKB()`, `ST_GeometryCollectionFromWKB()`, `GeomCollFromWKB()` e `GeometryCollectionFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeomCollFromWKB()`.

  `GeomCollFromWKB()` e `GeometryCollectionFromWKB()` estão desatualizados; espere que eles sejam removidos em uma futura versão do MySQL. Use `ST_GeomCollFromWKB()` e `ST_GeometryCollectionFromWKB()` em vez disso.

- `GeomFromWKB(wkb [, srid])`, `GeometryFromWKB(wkb [, srid])`

  `ST_GeomFromWKB()`, `ST_GeometryFromWKB()`, `GeomFromWKB()` e `GeometryFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeomFromWKB()`.

  `GeomFromWKB()` e `GeometryFromWKB()` estão desatualizados; espere-os serem removidos em uma futura versão do MySQL. Use `ST_GeomFromWKB()` e `ST_GeometryFromWKB()` em vez disso.

- `LineFromWKB(wkb [, srid])`, `LineStringFromWKB(wkb [, srid])`

  `ST_LineFromWKB()`, `ST_LineStringFromWKB()`, `LineFromWKB()` e `LineStringFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_LineFromWKB()`.

  `LineFromWKB()` e `LineStringFromWKB()` estão desatualizados; espere-os serem removidos em uma futura versão do MySQL. Use `ST_LineFromWKB()` e `ST_LineStringFromWKB()` em vez disso.

- `MLineFromWKB(wkb [, srid])`, `MultiLineStringFromWKB(wkb [, srid])`

  `ST_MLineFromWKB()`, `ST_MultiLineStringFromWKB()`, `MLineFromWKB()` e `MultiLineStringFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_MLineFromWKB()`.

  `MLineFromWKB()` e `MultiLineStringFromWKB()` estão desatualizados; espere-os serem removidos em uma futura versão do MySQL. Use `ST_MLineFromWKB()` e `ST_MultiLineStringFromWKB()` em vez disso.

- `MPointFromWKB(wkb [, srid])`, `MultiPointFromWKB(wkb [, srid])`

  `ST_MPointFromWKB()`, `ST_MultiPointFromWKB()`, `MPointFromWKB()` e `MultiPointFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_MPointFromWKB()`.

  `MPointFromWKB()` e `MultiPointFromWKB()` estão desatualizados; espere-se que sejam removidos em uma futura versão do MySQL. Use `ST_MPointFromWKB()` e `ST_MultiPointFromWKB()` em vez disso.

- `MPolyFromWKB(wkb [, srid])`, `MultiPolygonFromWKB(wkb [, srid])`

  `ST_MPolyFromWKB()`, `ST_MultiPolygonFromWKB()`, `MPolyFromWKB()` e `MultiPolygonFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_MPolyFromWKB()`.

  `MPolyFromWKB()` e `MultiPolygonFromWKB()` estão desatualizados; espere que eles sejam removidos em uma futura versão do MySQL. Use `ST_MPolyFromWKB()` e `ST_MultiPolygonFromWKB()` em vez disso.

- `PointFromWKB(wkb [, srid])`

  `ST_PointFromWKB()` e `PointFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_PointFromWKB()`.

  `PointFromWKB()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_PointFromWKB()` em vez disso.

- `PolyFromWKB(wkb [, srid])`, `PolygonFromWKB(wkb [, srid])`

  `ST_PolyFromWKB()`, `ST_PolygonFromWKB()`, `PolyFromWKB()` e `PolygonFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_PolyFromWKB()`.

  `PolyFromWKB()` e `PolygonFromWKB()` estão desatualizados; espere-os serem removidos em uma futura versão do MySQL. Use `ST_PolyFromWKB()` e `ST_PolygonFromWKB()` em vez disso.

- `ST_GeomCollFromWKB(wkb [, srid])`, `ST_GeometryCollectionFromWKB(wkb [, srid])`

  Constrói um valor de `GeometryCollection` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_GeomCollFromWKB()`, `ST_GeometryCollectionFromWKB()`, `GeomCollFromWKB()` e `GeometryCollectionFromWKB()` são sinônimos.

- `ST_GeomFromWKB(wkb [, srid])`, `ST_GeometryFromWKB(wkb [, srid])`

  Constrói um valor de geometria de qualquer tipo usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_GeomFromWKB()`, `ST_GeometryFromWKB()`, `GeomFromWKB()` e `GeometryFromWKB()` são sinônimos.

- `ST_LineFromWKB(wkb [, srid])`, `ST_LineStringFromWKB(wkb [, srid])`

  Constrói um valor `LineString` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_LineFromWKB()`, `ST_LineStringFromWKB()`, `LineFromWKB()` e `LineStringFromWKB()` são sinônimos.

- `ST_MLineFromWKB(wkb [, srid])`, `ST_MultiLineStringFromWKB(wkb [, srid])`

  Constrói um valor `MultiLineString` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_MLineFromWKB()`, `ST_MultiLineStringFromWKB()`, `MLineFromWKB()` e `MultiLineStringFromWKB()` são sinônimos.

- `ST_MPointFromWKB(wkb [, srid])`, `ST_MultiPointFromWKB(wkb [, srid])`

  Constrói um valor `MultiPoint` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_MPointFromWKB()`, `ST_MultiPointFromWKB()`, `MPointFromWKB()` e `MultiPointFromWKB()` são sinônimos.

- `ST_MPolyFromWKB(wkb [, srid])`, `ST_MultiPolygonFromWKB(wkb [, srid])`

  Constrói um valor `MultiPolygon` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_MPolyFromWKB()`, `ST_MultiPolygonFromWKB()`, `MPolyFromWKB()` e `MultiPolygonFromWKB()` são sinônimos.

- `ST_PointFromWKB(wkb [, srid])`

  Constrói um valor `Ponto` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_PointFromWKB()` e `PointFromWKB()` são sinônimos.

- `ST_PolyFromWKB(wkb [, srid])`, `ST_PolygonFromWKB(wkb [, srid])`

  Constrói um valor `Polygon` usando sua representação WKB e SRID.

  O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

  `ST_PolyFromWKB()`, `ST_PolygonFromWKB()`, `PolyFromWKB()` e `PolygonFromWKB()` são sinônimos.
