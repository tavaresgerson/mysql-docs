### 14.16.3 Funções que criam valores de geometria a partir de valores WKT

Essas funções aceitam como argumentos uma representação em texto bem conhecido (WKT) e, opcionalmente, um identificador do sistema de referência espacial (SRID). Elas retornam a geometria correspondente. Para uma descrição do formato WKT, consulte o formato de texto bem conhecido (WKT) ("Format").

As funções desta seção detectam argumentos em sistemas de referência espacial cartesianos ou geográficos (SRS) e retornam resultados adequados ao SRS.

`ST_GeomFromText()` aceita um valor WKT de qualquer tipo de geometria como seu primeiro argumento. Outras funções fornecem funções de construção específicas para cada tipo de geometria.

Funções como `ST_MPointFromText()` e `ST_GeomFromText()` que aceitam representações do formato WKT de valores `MultiPoint` permitem que os pontos individuais dentro dos valores sejam envolvidos por parênteses. Por exemplo, ambas as chamadas à função a seguir são válidas:

```
ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
```

Funções como `ST_GeomFromText()` que aceitam argumentos de coleção de geometria WKT entendem tanto a sintaxe padrão do OpenGIS `'GEOMETRYCOLLECTION EMPTY'` quanto a sintaxe não padrão do MySQL `'GEOMETRYCOLLECTION()'`. Funções como `ST_AsWKT()` que produzem valores WKT produzem sintaxe padrão: `'GEOMETRYCOLLECTION EMPTY'`

```
mysql> SET @s1 = ST_GeomFromText('GEOMETRYCOLLECTION()');
mysql> SET @s2 = ST_GeomFromText('GEOMETRYCOLLECTION EMPTY');
mysql> SELECT ST_AsWKT(@s1), ST_AsWKT(@s2);
+--------------------------+--------------------------+
| ST_AsWKT(@s1)            | ST_AsWKT(@s2)            |
+--------------------------+--------------------------+
| GEOMETRYCOLLECTION EMPTY | GEOMETRYCOLLECTION EMPTY |
+--------------------------+--------------------------+
```

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

- Se qualquer argumento de geometria for `NULL` ou não for uma geometria sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno será `NULL`.

- Por padrão, as coordenadas geográficas (latitude, longitude) são interpretadas na ordem especificada pelo sistema de referência espacial dos argumentos de geometria. Um argumento opcional `options` pode ser fornecido para sobrescrever a ordem padrão dos eixos. `options` consiste em uma lista de `key=value` separados por vírgula. O único valor permitido de `key` é `axis-order`, com valores permitidos de `lat-long`, `long-lat` e `srid-defined` (o padrão).

  Se o argumento `options` for `NULL`, o valor de retorno é `NULL`. Se o argumento `options` for inválido, ocorrerá um erro para indicar o motivo.

- Se um argumento SRID se refere a um sistema de referência espacial não definido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

- Para argumentos de geometria SRS geográfica, se algum argumento tiver uma longitude ou latitude fora do intervalo, ocorrerá um erro:

  - Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_LONGITUDE_OUT_OF_RANGE`.

  - Se um valor de latitude não estiver no intervalo \[−90, 90], ocorrerá um erro `ER_LATITUDE_OUT_OF_RANGE`.

  As faixas mostradas são em graus. Se um SRS usar outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa variam ligeiramente devido à aritmética de ponto flutuante.

Essas funções estão disponíveis para criar geometrias a partir de valores WKT:

- `ST_GeomCollFromText(wkt [, srid [, options]])`, `ST_GeometryCollectionFromText(wkt [, srid [, options]])`, `ST_GeomCollFromTxt(wkt [, srid [, options]])`

  Constrói um valor `GeometryCollection` usando sua representação WKT e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g = "MULTILINESTRING((10 10, 11 11), (9 9, 10 10))";
  mysql> SELECT ST_AsText(ST_GeomCollFromText(@g));
  +--------------------------------------------+
  | ST_AsText(ST_GeomCollFromText(@g))         |
  +--------------------------------------------+
  | MULTILINESTRING((10 10,11 11),(9 9,10 10)) |
  +--------------------------------------------+
  ```

- `ST_GeomFromText(wkt [, srid [, options]])`, `ST_GeometryFromText(wkt [, srid [, options]])`

  Constrói um valor de geometria de qualquer tipo usando sua representação WKT e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

- `ST_LineFromText(wkt [, srid [, options]])`, `ST_LineStringFromText(wkt [, srid [, options]])`

  Constrói um valor `LineString` usando sua representação WKT e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

- `ST_MLineFromText(wkt [, srid [, options]])`, `ST_MultiLineStringFromText(wkt [, srid [, options]])`

  Constrói um valor `MultiLineString` usando sua representação WKT e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

- `ST_MPointFromText(wkt [, srid [, options]])`, `ST_MultiPointFromText(wkt [, srid [, options]])`

  Constrói um valor `MultiPoint` usando sua representação WKT e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

- `ST_MPolyFromText(wkt [, srid [, options]])`, `ST_MultiPolygonFromText(wkt [, srid [, options]])`

  Constrói um valor `MultiPolygon` usando sua representação WKT e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

- `ST_PointFromText(wkt [, srid [, options]])`

  Constrói um valor `Point` usando sua representação WKT e SRID.

  `ST_PointFromText()` lida com seus argumentos conforme descrito na introdução desta seção.

- `ST_PolyFromText(wkt [, srid [, options]])`, `ST_PolygonFromText(wkt [, srid [, options]])`

  Constrói um valor `Polygon` usando sua representação WKT e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.
