### 14.16.4 Funções que criam valores de geometria a partir de valores WKB

Essas funções aceitam como argumentos um `BLOB` que contém uma representação em Binário Conhecido (WKB) e, opcionalmente, um identificador do sistema de referência espacial (SRID). Elas retornam a geometria correspondente. Para uma descrição do formato WKB, consulte o formato Binário Conhecido (WKB) ("Format").

As funções desta seção detectam argumentos em sistemas de referência espacial cartesianos ou geográficos (SRS) e retornam resultados adequados ao SRS.

`ST_GeomFromWKB()` aceita um valor WKB de qualquer tipo de geometria como seu primeiro argumento. Outras funções fornecem funções de construção específicas para cada tipo de geometria.

Antes do MySQL 8.0, essas funções também aceitavam objetos de geometria como retorno das funções na Seção 14.16.5, “Funções Específicas do MySQL que Criam Valores de Geometria”. Argumentos de geometria não são mais permitidos e produzem um erro. Para migrar chamadas que usam argumentos de geometria para usar argumentos WKB, siga estas diretrizes:

- Construções como `ST_GeomFromWKB(Point(0, 0))` devem ser reescritas como `Point(0, 0)`.

- Construções como `ST_GeomFromWKB(Point(0, 0), 4326)` devem ser reescritas como `ST_SRID(Point(0, 0), 4326)` ou `ST_GeomFromWKB(ST_AsWKB(Point(0, 0)), 4326)`.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

- Se o argumento WKB ou SRID for `NULL`, o valor de retorno será `NULL`.

- Por padrão, as coordenadas geográficas (latitude, longitude) são interpretadas na ordem especificada pelo sistema de referência espacial dos argumentos de geometria. Um argumento opcional `options` pode ser fornecido para sobrescrever a ordem padrão dos eixos. `options` consiste em uma lista de `key=value` separados por vírgula. O único valor permitido de `key` é `axis-order`, com valores permitidos de `lat-long`, `long-lat` e `srid-defined` (o padrão).

  Se o argumento `options` for `NULL`, o valor de retorno é `NULL`. Se o argumento `options` for inválido, ocorrerá um erro para indicar o motivo.

- Se um argumento SRID se refere a um sistema de referência espacial não definido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

- Para argumentos de geometria SRS geográfica, se algum argumento tiver uma longitude ou latitude fora do intervalo, ocorrerá um erro:

  - Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_LONGITUDE_OUT_OF_RANGE`.

  - Se um valor de latitude não estiver no intervalo \[−90, 90], ocorrerá um erro `ER_LATITUDE_OUT_OF_RANGE`.

  As faixas mostradas são em graus. Se um SRS usar outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa variam ligeiramente devido à aritmética de ponto flutuante.

Essas funções estão disponíveis para criar geometrias a partir de valores WKB:

- `ST_GeomCollFromWKB(wkb [, srid [, options]])`, `ST_GeometryCollectionFromWKB(wkb [, srid [, options]])`

  Constrói um valor `GeometryCollection` usando sua representação WKB e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

- `ST_GeomFromWKB(wkb [, srid [, options]])`, `ST_GeometryFromWKB(wkb [, srid [, options]])`

  Constrói um valor de geometria de qualquer tipo usando sua representação WKB e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

- `ST_LineFromWKB(wkb [, srid [, options]])`, `ST_LineStringFromWKB(wkb [, srid [, options]])`

  Constrói um valor `LineString` usando sua representação WKB e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

- `ST_MLineFromWKB(wkb [, srid [, options]])`, `ST_MultiLineStringFromWKB(wkb [, srid [, options]])`

  Constrói um valor `MultiLineString` usando sua representação WKB e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

- `ST_MPointFromWKB(wkb [, srid [, options]])`, `ST_MultiPointFromWKB(wkb [, srid [, options]])`

  Constrói um valor `MultiPoint` usando sua representação WKB e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

- `ST_MPolyFromWKB(wkb [, srid [, options]])`, `ST_MultiPolygonFromWKB(wkb [, srid [, options]])`

  Constrói um valor `MultiPolygon` usando sua representação WKB e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

- `ST_PointFromWKB(wkb [, srid [, options]])`

  Constrói um valor `Point` usando sua representação WKB e SRID.

  `ST_PointFromWKB()` lida com seus argumentos conforme descrito na introdução desta seção.

- `ST_PolyFromWKB(wkb [, srid [, options]])`, `ST_PolygonFromWKB(wkb [, srid [, options]])`

  Constrói um valor `Polygon` usando sua representação WKB e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.
