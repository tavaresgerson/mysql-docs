### 14.16.4 Funções que criam valores de geometria a partir de valores WKB

Essas funções aceitam como argumentos um `BLOB` contendo uma representação binária conhecida (WKB) e, opcionalmente, um identificador do sistema de referência espacial (SRID). Elas retornam o correspondente valor de geometria. Para uma descrição do formato WKB, consulte  Formato de Binário Conhecido (WKB)").

As funções desta seção detectam argumentos em sistemas de referência espacial (SRS) cartesianos ou geográficos e retornam resultados apropriados ao SRS.

 `ST_GeomFromWKB()` aceita um valor WKB de qualquer tipo de geometria como seu primeiro argumento. Outras funções fornecem funções de construção específicas para cada tipo de geometria.

Antes do MySQL 8.4, essas funções também aceitavam objetos de geometria como retornados pelas funções na Seção 14.16.5, “Funções Específicas do MySQL que criam valores de geometria”. Argumentos de geometria não são mais permitidos e produzem um erro. Para migrar chamadas de uso de argumentos de geometria para uso de argumentos WKB, siga estas diretrizes:

* Reescreva construções como `ST_GeomFromWKB(Point(0, 0))` como `Point(0, 0)`.
* Reescreva construções como `ST_GeomFromWKB(Point(0, 0), 4326)` como `ST_SRID(Point(0, 0), 4326)` ou `ST_GeomFromWKB(ST_AsWKB(Point(0, 0)), 4326)`.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se o argumento WKB ou SRID for `NULL`, o valor de retorno é `NULL`.
* Por padrão, as coordenadas geográficas (latitude, longitude) são interpretadas na ordem especificada pelo sistema de referência espacial dos argumentos de geometria. Um argumento opcional *`options`* pode ser fornecido para sobrescrever a ordem padrão dos eixos. `options` consiste em uma lista de `chave=valor` separadas por vírgula. O único valor permitido de *`chave`* é `axis-order`, com valores permitidos de `lat-long`, `long-lat` e `srid-defined` (o padrão).

Se o argumento *`options`* for `NULL`, o valor de retorno será `NULL`. Se o argumento *`options`* for inválido, ocorrerá um erro para indicar o motivo.
* Se um argumento SRID se referir a um sistema de referência espacial (SRS) indefinido, ocorrerá um erro `ER_SRS_NOT_FOUND`.
* Para argumentos de geometria de SRS geográficas, se qualquer argumento tiver uma longitude ou latitude fora do intervalo, ocorrerá um erro:

  + Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_LONGITUDE_OUT_OF_RANGE`.
  + Se um valor de latitude não estiver no intervalo [−90, 90], ocorrerá um erro `ER_LATITUDE_OUT_OF_RANGE`.

Os intervalos mostrados são em graus. Se um SRS usar outra unidade, o intervalo usa os valores correspondentes em sua unidade. Os limites exatos do intervalo diferem ligeiramente devido à aritmética de ponto flutuante.
Essas funções estão disponíveis para criar geometrias a partir de valores WKB:

[`ST_GeomCollFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-geomcollfromwkb), 

  Construi um valor `GeometryCollection` usando sua representação WKB e SRID.
  Essas funções tratam seus argumentos conforme descrito na introdução desta seção.
[`ST_GeomFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-geomfromwkb), 

  Construi um valor de geometria de qualquer tipo usando sua representação WKB e SRID.
  Essas funções tratam seus argumentos conforme descrito na introdução desta seção.
[`ST_LineFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-linefromwkb), 

  Construi um valor `LineString` usando sua representação WKB e SRID.
  Essas funções tratam seus argumentos conforme descrito na introdução desta seção.
[`ST_MLineFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-mlinefromwkb), 

  Construi um valor `MultiLineString` usando sua representação WKB e SRID.

Essas funções tratam seus argumentos conforme descrito na introdução desta seção.
[`ST_MPointFromWKB(wkb [, srid [, opções]])`](gis-wkb-functions.html#function_st-mpointfromwkb), 

  Construi um valor `MultiPoint` usando sua representação WKB e SRID.

  Essas funções tratam seus argumentos conforme descrito na introdução desta seção.
[`ST_MPolyFromWKB(wkb [, srid [, opções]])`](gis-wkb-functions.html#function_st-mpolyfromwkb), 

  Construi um valor `MultiPolygon` usando sua representação WKB e SRID.

  Essas funções tratam seus argumentos conforme descrito na introdução desta seção.
[`ST_PointFromWKB(wkb [, srid [, opções]])`](gis-wkb-functions.html#function_st-pointfromwkb)

  Construi um valor `Point` usando sua representação WKB e SRID.

   `ST_PointFromWKB()` trata seus argumentos conforme descrito na introdução desta seção.
[`ST_PolyFromWKB(wkb [, srid [, opções]])`](gis-wkb-functions.html#function_st-polyfromwkb), 

  Construi um valor `Polygon` usando sua representação WKB e SRID.

  Essas funções tratam seus argumentos conforme descrito na introdução desta seção.