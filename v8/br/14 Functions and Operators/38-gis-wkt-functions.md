### 14.16.3 Funções que criam valores de geometria a partir de valores WKT

Essas funções aceitam como argumentos uma representação em Texto Conhecido (WKT) e, opcionalmente, um identificador do sistema de referência espacial (SRID). Elas retornam o correspondente valor de geometria. Para uma descrição do formato WKT, consulte  Formato de Texto Conhecido (WKT)").

As funções desta seção detectam argumentos em sistemas de referência espacial (SRS) cartesianos ou geográficos e retornam resultados apropriados ao SRS.

 `ST_GeomFromText()` aceita um valor WKT de qualquer tipo de geometria como seu primeiro argumento. Outras funções fornecem funções de construção específicas para cada tipo de geometria.

Funções como `ST_MPointFromText()` e `ST_GeomFromText()` que aceitam representações em formato WKT de valores `MultiPoint` permitem que os pontos individuais dentro dos valores sejam envolvidos por parênteses. Por exemplo, ambas as chamadas de função a seguir são válidas:

```
ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
```

Funções como `ST_GeomFromText()` que aceitam argumentos de coleção de geometria WKT entendem tanto a sintaxe padrão OpenGIS `'GEOMETRYCOLLECTION EMPTY'` quanto a sintaxe não padrão MySQL `'GEOMETRYCOLLECTION()'`. Funções como `ST_AsWKT()` que produzem valores WKT produzem a sintaxe padrão `'GEOMETRYCOLLECTION EMPTY':

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

* Se qualquer argumento de geometria for `NULL` ou não for uma geometria sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.
* Por padrão, as coordenadas geográficas (latitude, longitude) são interpretadas na ordem especificada pelo sistema de referência espacial dos argumentos de geometria. Um argumento opcional *`options`* pode ser fornecido para sobrescrever a ordem padrão dos eixos. `options` consiste em uma lista de valores separados por vírgula `chave=valor`. O único valor permitido de `chave` é `axis-order`, com valores permitidos de `lat-long`, `long-lat` e `srid-defined` (o padrão).

Se o argumento `options` for `NULL`, o valor de retorno será `NULL`. Se o argumento `options` for inválido, ocorrerá um erro para indicar o motivo.
* Se um argumento `SRID` se referir a um sistema de referência espacial (SRS) indefinido, ocorrerá um erro `ER_SRS_NOT_FOUND`.
* Para argumentos de geometria de SRS geográficas, se qualquer argumento tiver uma longitude ou latitude fora do intervalo, ocorrerá um erro:

  + Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_LONGITUDE_OUT_OF_RANGE`.
  + Se um valor de latitude não estiver no intervalo [−90, 90], ocorrerá um erro `ER_LATITUDE_OUT_OF_RANGE`.

Os intervalos mostrados são em graus. Se um SRS usar outra unidade, o intervalo usa os valores correspondentes em sua unidade. Os limites exatos do intervalo diferem ligeiramente devido à aritmética de ponto flutuante.

Essas funções estão disponíveis para criar geometrias a partir de valores WKT:

[`ST_GeomCollFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-geomcollfromtext), 

  Construi um valor `GeometryCollection` usando sua representação WKT e SRID.

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

[`ST_GeomFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-geomfromtext), 

  Construi um valor de geometria de qualquer tipo usando sua representação WKT e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.
[`ST_LineFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-linefromtext), 

  Construi um valor `LineString` usando sua representação WKT e SRID.

  Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.
[`ST_MLineFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-mlinefromtext), 

  Construi um valor `MultiLineString` usando sua representação WKT e SRID.

Essas funções tratam seus argumentos conforme descrito na introdução desta seção.
[`ST_MPointFromText(wkt [, srid [, opções]])`](gis-wkt-functions.html#function_st-mpointfromtext), 

  Construi um valor `MultiPoint` usando sua representação WKT e SRID.

  Essas funções tratam seus argumentos conforme descrito na introdução desta seção.
[`ST_MPolyFromText(wkt [, srid [, opções]])`](gis-wkt-functions.html#function_st-mpolyfromtext), 

  Construi um valor `MultiPolygon` usando sua representação WKT e SRID.

  Essas funções tratam seus argumentos conforme descrito na introdução desta seção.
[`ST_PointFromText(wkt [, srid [, opções]])`](gis-wkt-functions.html#function_st-pointfromtext)

  Construi um valor `Point` usando sua representação WKT e SRID.

   `ST_PointFromText()` trata seus argumentos conforme descrito na introdução desta seção.
[`ST_PolyFromText(wkt [, srid [, opções]])`](gis-wkt-functions.html#function_st-polyfromtext), 

  Construi um valor `Polygon` usando sua representação WKT e SRID.

  Essas funções tratam seus argumentos conforme descrito na introdução desta seção.