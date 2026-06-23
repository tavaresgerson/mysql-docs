## 14.16 Funções de Análise Espacial

O MySQL oferece funções para realizar várias operações em dados espaciais. Essas funções podem ser agrupadas em várias categorias principais de acordo com o tipo de operação que realizam:

* Funções que criam geometrias em vários formatos (WKT, WKB, interno)

* Funções que convertem geometrias entre formatos * Funções que acessam propriedades qualitativas ou quantitativas de uma geometria

* Funções que descrevem relações entre duas geometrias
* Funções que criam novas geometrias a partir de outras existentes

Para informações gerais sobre o suporte do MySQL para o uso de dados espaciais, consulte a Seção 13.4, “Tipos de dados espaciais”.

### 14.16.1 Referência de função espacial

A tabela a seguir lista cada função espacial e fornece uma breve descrição de cada uma.

**Tabela 14.21 Funções Espaciais**

<table frame="box" rules="all" summary="A reference that lists all spatial functions."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th scope="row"><code>GeomCollection()</code></th> <td>Construa uma coleção de geometrias a partir de geometrias</td> <td></td> </tr><tr><th scope="row"><code>GeometryCollection()</code></th> <td>Construa uma coleção de geometrias a partir de geometrias</td> <td></td> </tr><tr><th scope="row"><code>LineString()</code></th> <td>Construa uma linha String a partir de valores de Ponto</td> <td></td> </tr><tr><th scope="row"><code>MBRContains()</code></th> <td>Se o MBR de uma geometria contém o MBR de outra</td> <td></td> </tr><tr><th scope="row"><code>MBRCoveredBy()</code></th> <td>Se um MBR está coberto por outro</td> <td></td> </tr><tr><th scope="row"><code>MBRCovers()</code></th> <td>Se um MBR cobre outro</td> <td></td> </tr><tr><th scope="row"><code>MBRDisjoint()</code></th> <td>Se os MBRs de duas geometrias são disjuntos</td> <td></td> </tr><tr><th scope="row"><code>MBREquals()</code></th> <td>Se os MBRs de duas geometrias são iguais</td> <td></td> </tr><tr><th scope="row"><code>MBRIntersects()</code></th> <td>Se os MBRs de duas geometrias se intersectam</td> <td></td> </tr><tr><th scope="row"><code>MBROverlaps()</code></th> <td>Se os MBRs de duas geometrias se sobrepõem</td> <td></td> </tr><tr><th scope="row"><code>MBRTouches()</code></th> <td>Se os MBRs de duas geometrias se tocam</td> <td></td> </tr><tr><th scope="row"><code>MBRWithin()</code></th> <td>Se o MBR de uma geometria está dentro do MBR de outra</td> <td></td> </tr><tr><th scope="row"><code>MultiLineString()</code></th> <td>Construa uma MultiLineString a partir de valores de LineString</td> <td></td> </tr><tr><th scope="row"><code>MultiPoint()</code></th> <td>Construa o MultiPoint a partir de valores de ponto</td> <td></td> </tr><tr><th scope="row"><code>MultiPolygon()</code></th> <td>Construa MultiPolygon a partir de valores Polygon</td> <td></td> </tr><tr><th scope="row"><code>Point()</code></th> <td>Construir ponto a partir de coordenadas</td> <td></td> </tr><tr><th scope="row"><code>Polygon()</code></th> <td>Construir polígono a partir de argumentos LineString</td> <td></td> </tr><tr><th scope="row"><code>ST_Area()</code></th> <td>Retorno da área Polygon ou MultiPolygon</td> <td></td> </tr><tr><th scope="row"><code>ST_AsBinary()</code>,<code>ST_AsWKB()</code></th> <td>Converter de formato de geometria interna para WKB</td> <td></td> </tr><tr><th scope="row"><code>ST_AsGeoJSON()</code></th> <td>Gerar objeto GeoJSON a partir da geometria</td> <td></td> </tr><tr><th scope="row"><code>ST_AsText()</code>,<code>ST_AsWKT()</code></th> <td>Converter de formato de geometria interna para WKT</td> <td></td> </tr><tr><th scope="row"><code>ST_Buffer()</code></th> <td>Geometria de retorno de pontos dentro da distância dada da geometria</td> <td></td> </tr><tr><th scope="row"><code>ST_Buffer_Strategy()</code></th> <td> Produce strategy option for ST_Buffer() </td> <td></td> </tr><tr><th scope="row"><code>ST_Centroid()</code></th> <td>Retorne o centroide como um ponto</td> <td></td> </tr><tr><th scope="row"><code>ST_Collect()</code></th> <td> Aggregate spatial values into collection </td> <td>8.0.24</td> </tr><tr><th scope="row"><code>ST_Contains()</code></th> <td>Se uma geometria contém outra</td> <td></td> </tr><tr><th scope="row"><code>ST_ConvexHull()</code></th> <td>Retorne o casco convexo da geometria</td> <td></td> </tr><tr><th scope="row"><code>ST_Crosses()</code></th> <td>Se uma geometria cruza outra</td> <td></td> </tr><tr><th scope="row"><code>ST_Difference()</code></th> <td>Diferença do ponto de retorno entre duas geometrias</td> <td></td> </tr><tr><th scope="row"><code>ST_Dimension()</code></th> <td> Dimension of geometry </td> <td></td> </tr><tr><th scope="row"><code>ST_Disjoint()</code></th> <td>Se uma geometria é disjunta de outra</td> <td></td> </tr><tr><th scope="row"><code>ST_Distance()</code></th> <td>A distância de uma geometria em relação a outra</td> <td></td> </tr><tr><th scope="row"><code>ST_Distance_Sphere()</code></th> <td>Distância mínima na Terra entre duas geometrias</td> <td></td> </tr><tr><th scope="row"><code>ST_EndPoint()</code></th> <td>Ponto final de LineString</td> <td></td> </tr><tr><th scope="row"><code>ST_Envelope()</code></th> <td>Retorno do MBR da geometria</td> <td></td> </tr><tr><th scope="row"><code>ST_Equals()</code></th> <td>Se uma geometria é igual a outra</td> <td></td> </tr><tr><th scope="row"><code>ST_ExteriorRing()</code></th> <td>Anel exterior do Polygon</td> <td></td> </tr><tr><th scope="row"><code>ST_FrechetDistance()</code></th> <td>A distância discreta de Fréchet de uma geometria em relação a outra</td> <td>8.0.23</td> </tr><tr><th scope="row"><code>ST_GeoHash()</code></th> <td>Produza um valor geohash</td> <td></td> </tr><tr><th scope="row"><code>ST_GeomCollFromText()</code>,<code>ST_GeometryCollectionFromText()</code>,<code>ST_GeomCollFromTxt()</code></th> <td>Coleção de geometria de retorno do WKT</td> <td></td> </tr><tr><th scope="row"><code>ST_GeomCollFromWKB()</code>,<code>ST_GeometryCollectionFromWKB()</code></th> <td>Coleção de geometria de retorno de WKB</td> <td></td> </tr><tr><th scope="row"><code>ST_GeometryN()</code></th> <td>Retorno da N-ésima geometria da coleção de geometrias</td> <td></td> </tr><tr><th scope="row"><code>ST_GeometryType()</code></th> <td>Retorne o nome do tipo de geometria</td> <td></td> </tr><tr><th scope="row"><code>ST_GeomFromGeoJSON()</code></th> <td>Gerar geometria a partir do objeto GeoJSON</td> <td></td> </tr><tr><th scope="row"><code>ST_GeomFromText()</code>,<code>ST_GeometryFromText()</code></th> <td>Geometria de retorno a partir de WKT</td> <td></td> </tr><tr><th scope="row"><code>ST_GeomFromWKB()</code>,<code>ST_GeometryFromWKB()</code></th> <td>Geometria de retorno do WKB</td> <td></td> </tr><tr><th scope="row"><code>ST_HausdorffDistance()</code></th> <td>A distância discreta de Hausdorff de uma geometria em relação a outra</td> <td>8.0.23</td> </tr><tr><th scope="row"><code>ST_InteriorRingN()</code></th> <td>Retorno do N-ésimo anel interno do polígono</td> <td></td> </tr><tr><th scope="row"><code>ST_Intersection()</code></th> <td>Ponto de retorno definido pela interseção de duas geometrias</td> <td></td> </tr><tr><th scope="row"><code>ST_Intersects()</code></th> <td>Se uma geometria intersecta outra</td> <td></td> </tr><tr><th scope="row"><code>ST_IsClosed()</code></th> <td>Se a geometria é fechada e simples</td> <td></td> </tr><tr><th scope="row"><code>ST_IsEmpty()</code></th> <td>Se uma geometria está vazia</td> <td></td> </tr><tr><th scope="row"><code>ST_IsSimple()</code></th> <td>Se a geometria é simples</td> <td></td> </tr><tr><th scope="row"><code>ST_IsValid()</code></th> <td>Se uma geometria é válida</td> <td></td> </tr><tr><th scope="row"><code>ST_LatFromGeoHash()</code></th> <td>Retorno da latitude a partir do valor geohash</td> <td></td> </tr><tr><th scope="row"><code>ST_Latitude()</code></th> <td> Return latitude of Point </td> <td>8.0.12</td> </tr><tr><th scope="row"><code>ST_Length()</code></th> <td>Comprimento de retorno da linha String</td> <td></td> </tr><tr><th scope="row"><code>ST_LineFromText()</code>,<code>ST_LineStringFromText()</code></th> <td>Construa uma LineString a partir de WKT</td> <td></td> </tr><tr><th scope="row"><code>ST_LineFromWKB()</code>,<code>ST_LineStringFromWKB()</code></th> <td>Construa uma linha String a partir de WKB</td> <td></td> </tr><tr><th scope="row"><code>ST_LineInterpolatePoint()</code></th> <td>O ponto de uma porcentagem dada ao longo de uma LineString</td> <td>8.0.24</td> </tr><tr><th scope="row"><code>ST_LineInterpolatePoints()</code></th> <td>Os pontos de uma determinada porcentagem ao longo de uma LineString</td> <td>8.0.24</td> </tr><tr><th scope="row"><code>ST_LongFromGeoHash()</code></th> <td>Retorno da longitude a partir do valor geohash</td> <td></td> </tr><tr><th scope="row"><code>ST_Longitude()</code></th> <td> Return longitude of Point </td> <td>8.0.12</td> </tr><tr><th scope="row"><code>ST_MakeEnvelope()</code></th> <td>Retângulo em torno de dois pontos</td> <td></td> </tr><tr><th scope="row"><code>ST_MLineFromText()</code>,<code>ST_MultiLineStringFromText()</code></th> <td>Construa MultiLineString a partir de WKT</td> <td></td> </tr><tr><th scope="row"><code>ST_MLineFromWKB()</code>,<code>ST_MultiLineStringFromWKB()</code></th> <td>Construa MultiLineString a partir de WKB</td> <td></td> </tr><tr><th scope="row"><code>ST_MPointFromText()</code>,<code>ST_MultiPointFromText()</code></th> <td>Construa o MultiPoint a partir do WKT</td> <td></td> </tr><tr><th scope="row"><code>ST_MPointFromWKB()</code>,<code>ST_MultiPointFromWKB()</code></th> <td>Construa o MultiPoint a partir do WKB</td> <td></td> </tr><tr><th scope="row"><code>ST_MPolyFromText()</code>,<code>ST_MultiPolygonFromText()</code></th> <td>Construa MultiPolygon a partir de WKT</td> <td></td> </tr><tr><th scope="row"><code>ST_MPolyFromWKB()</code>,<code>ST_MultiPolygonFromWKB()</code></th> <td>Construa MultiPolygon a partir de WKB</td> <td></td> </tr><tr><th scope="row"><code>ST_NumGeometries()</code></th> <td>Retorne o número de geometrias na coleção de geometrias</td> <td></td> </tr><tr><th scope="row"><code>ST_NumInteriorRing()</code>,<code>ST_NumInteriorRings()</code></th> <td>Retorne o número de anéis internos no polígono</td> <td></td> </tr><tr><th scope="row"><code>ST_NumPoints()</code></th> <td>Retorne o número de pontos na linha String</td> <td></td> </tr><tr><th scope="row"><code>ST_Overlaps()</code></th> <td>Se uma geometria se sobrepõe a outra</td> <td></td> </tr><tr><th scope="row"><code>ST_PointAtDistance()</code></th> <td>O ponto a uma distância dada ao longo de uma LineString</td> <td>8.0.24</td> </tr><tr><th scope="row"><code>ST_PointFromGeoHash()</code></th> <td>Converta o valor geohash para o valor POINT</td> <td></td> </tr><tr><th scope="row"><code>ST_PointFromText()</code></th> <td>Construa o Ponto a partir de WKT</td> <td></td> </tr><tr><th scope="row"><code>ST_PointFromWKB()</code></th> <td>Construa o Ponto de WKB</td> <td></td> </tr><tr><th scope="row"><code>ST_PointN()</code></th> <td>Retorno do N-ésimo ponto da LineString</td> <td></td> </tr><tr><th scope="row"><code>ST_PolyFromText()</code>,<code>ST_PolygonFromText()</code></th> <td>Construa polígono a partir de WKT</td> <td></td> </tr><tr><th scope="row"><code>ST_PolyFromWKB()</code>,<code>ST_PolygonFromWKB()</code></th> <td>Construa polígono a partir de WKB</td> <td></td> </tr><tr><th scope="row"><code>ST_Simplify()</code></th> <td> Return simplified geometry </td> <td></td> </tr><tr><th scope="row"><code>ST_SRID()</code></th> <td>ID do sistema de referência espacial de retorno para geometria</td> <td></td> </tr><tr><th scope="row"><code>ST_StartPoint()</code></th> <td>Ponto de início da linha String</td> <td></td> </tr><tr><th scope="row"><code>ST_SwapXY()</code></th> <td> Return argument with X/Y coordinates swapped </td> <td></td> </tr><tr><th scope="row"><code>ST_SymDifference()</code></th> <td>Ponto de retorno definido como diferença simétrica de duas geometrias</td> <td></td> </tr><tr><th scope="row"><code>ST_Touches()</code></th> <td>Se uma geometria toca outra</td> <td></td> </tr><tr><th scope="row"><code>ST_Transform()</code></th> <td> Transform coordinates of geometry </td> <td>8.0.13</td> </tr><tr><th scope="row"><code>ST_Union()</code></th> <td>Ponto de retorno definido como união de duas geometrias</td> <td></td> </tr><tr><th scope="row"><code>ST_Validate()</code></th> <td> Return validated geometry </td> <td></td> </tr><tr><th scope="row"><code>ST_Within()</code></th> <td>Se uma geometria está dentro de outra</td> <td></td> </tr><tr><th scope="row"><code>ST_X()</code></th> <td>Retorne a coordenada X do Ponto</td> <td></td> </tr><tr><th scope="row"><code>ST_Y()</code></th> <td>Coordenada Y de retorno do Ponto</td> <td></td> </tr></tbody></table>

### 14.16.2 Tratamento de argumentos por funções espaciais

Os valores espaciais, ou geometrias, possuem as propriedades descritas na Seção 13.4.2.2, “Classe de Geometria”. A discussão a seguir lista as características gerais de manipulação de argumentos de funções espaciais. Funções ou grupos de funções específicas podem ter características adicionais ou diferentes de manipulação de argumentos, conforme discutido nas seções onde essas descrições de funções ocorrem. Quando isso for verdade, essas descrições têm precedência sobre a discussão geral aqui.

As funções espaciais são definidas apenas para valores de geometria válidos. Consulte a Seção 13.4.4, “Bem-formação e validade da geometria”.

Cada valor de geometria está associado a um sistema de referência espacial (SRS), que é um sistema baseado em coordenadas para localização geográfica. Consulte a Seção 13.4.5, “Suporte ao Sistema de Referência Espacial”.

O identificador de referência espacial (SRID) de uma geometria identifica o SRS no qual a geometria é definida. No MySQL, o valor SRID é um número inteiro associado ao valor da geometria. O valor máximo utilizável do SRID é 232-1. Se um valor maior for fornecido, apenas os 32 bits inferiores são utilizados.

O SRID 0 representa um plano cartesiano plano infinito sem unidades atribuídas a seus eixos. Para garantir o comportamento do SRID 0, crie valores de geometria usando SRID 0. O SRID 0 é o padrão para novos valores de geometria se nenhum SRID for especificado.

Para cálculos com múltiplos valores de geometria, todos os valores devem estar no mesmo SRS ou ocorrerá um erro. Assim, as funções espaciais que aceitam múltiplos argumentos de geometria exigem que esses argumentos estejam no mesmo SRS. Se uma função espacial retornar `ER_GIS_DIFFERENT_SRIDS`, isso significa que os argumentos de geometria não estavam todos no mesmo SRS. Você deve modificá-los para ter o mesmo SRS.

Uma geometria devolvida por uma função espacial está no SRS dos argumentos de geometria porque os valores de geometria produzidos por qualquer função espacial herdam o SRID dos argumentos de geometria.

As diretrizes do [Open Geospatial Consortium][(http://www.opengeospatial.org)] exigem que os polígonos de entrada já estejam fechados, portanto, polígonos não fechados são rejeitados como inválidos, em vez de serem fechados.

Em MySQL, a única geometria vazia válida é representada na forma de uma coleção de geometria vazia. O tratamento de coleções de geometria vazia é o seguinte: uma coleção de geometria WKT vazia pode ser especificada como `'GEOMETRYCOLLECTION()'`. Esse também é o WKT de saída resultante de uma operação espacial que produz uma coleção de geometria vazia.

Durante a análise de uma coleção de geometria aninhada, a coleção é achatada e seus componentes básicos são utilizados em várias operações de SIG para calcular resultados. Isso oferece maior flexibilidade aos usuários, pois não é necessário se preocupar com a unicidade dos dados de geometria. Coleções de geometria aninhadas podem ser produzidas a partir de chamadas de função de SIG aninhadas sem precisar ser explicitamente achatadas primeiro.

### 14.16.3 Funções que criam valores de geometria a partir de valores WKT

Essas funções recebem como argumentos uma representação de Texto Conhecido (WKT) e, opcionalmente, um identificador do sistema de referência espacial (SRID). Elas retornam a geometria correspondente. Para uma descrição do formato WKT, consulte o formato de Texto Conhecido (WKT) ("Format").

As funções desta seção detectam argumentos em sistemas de referência espaciais cartesianos ou geográficos (SRS), e retornam resultados adequados ao SRS.

`ST_GeomFromText()` aceita um valor WKT de qualquer tipo de geometria como seu primeiro argumento. Outras funções fornecem funções de construção específicas para cada tipo de geometria, para a construção de valores de geometria.

Funções como `ST_MPointFromText()` e `ST_GeomFromText()` que aceitam representações de valores do formato WKT- `MultiPoint` permitem que os pontos individuais dentro dos valores sejam rodeados por parênteses. Por exemplo, ambas as chamadas de função a seguir são válidas:

```
ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
```

Funções como `ST_GeomFromText()` que aceitam argumentos de coleção de geometria WKT entendem tanto a sintaxe padrão OpenGIS `'GEOMETRYCOLLECTION EMPTY'` quanto a sintaxe não padrão MySQL `'GEOMETRYCOLLECTION()'`. Funções como `ST_AsWKT()` que produzem valores WKT produzem sintaxe padrão `'GEOMETRYCOLLECTION EMPTY'`:

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

* Por padrão, as coordenadas geográficas (latitude, longitude) são interpretadas na ordem especificada pelo sistema de referência espacial dos argumentos de geometria. Um argumento opcional *`options`* pode ser dado para ignorar a ordem padrão dos eixos. `options` consiste em uma lista de `key=value` separados por vírgula. O único valor permitido de *`key`* é `axis-order`, com valores permitidos de `lat-long`, `long-lat` e `srid-defined` (o padrão).

Se o argumento *`options`* for `NULL`, o valor de retorno é `NULL`. Se o argumento *`options`* for inválido, ocorre um erro para indicar o motivo.

* Se um argumento SRID se refere a um sistema de referência espacial não definido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

* Para argumentos de geometria SRS geográfica, se algum argumento tiver uma longitude ou latitude fora do intervalo, ocorre um erro:

+ Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_LONGITUDE_OUT_OF_RANGE`.

+ Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_LATITUDE_OUT_OF_RANGE`.

As faixas mostradas são em graus. Se um SRS usa outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa diferem ligeiramente devido à aritmética de ponto flutuante.

Essas funções estão disponíveis para criar geometrias a partir de valores WKT:

* `ST_GeomCollFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-geomcollfromtext), `ST_GeometryCollectionFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-geomcollfromtext), `ST_GeomCollFromTxt(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-geomcollfromtext)

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

* `ST_GeomFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-geomfromtext), `ST_GeometryFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-geomfromtext)

Construi um valor de geometria de qualquer tipo usando sua representação WKT e SRID.

Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

* `ST_LineFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-linefromtext), `ST_LineStringFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-linefromtext)

Construi um valor `LineString` usando sua representação WKT e SRID.

Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

* `ST_MLineFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-mlinefromtext), `ST_MultiLineStringFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-mlinefromtext)

Construi um valor `MultiLineString` usando sua representação WKT e SRID.

Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

* `ST_MPointFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-mpointfromtext), `ST_MultiPointFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-mpointfromtext)

Construi um valor `MultiPoint` usando sua representação WKT e SRID.

Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

* `ST_MPolyFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-mpolyfromtext), `ST_MultiPolygonFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-mpolyfromtext)

Construi um valor `MultiPolygon` usando sua representação WKT e SRID.

Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

* `ST_PointFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-pointfromtext)

Construi um valor `Point` usando sua representação WKT e SRID.

`ST_PointFromText()` lida com seus argumentos conforme descrito na introdução desta seção.

* `ST_PolyFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-polyfromtext), `ST_PolygonFromText(wkt [, srid [, options]])`(gis-wkt-functions.html#function_st-polyfromtext)

Construi um valor `Polygon` usando sua representação WKT e SRID.

Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

### 14.16.4 Funções que criam valores de geometria a partir de valores WKB

Essas funções aceitam como argumentos um `BLOB` que contém uma representação de Binário Bem Conhecido (WKB) e, opcionalmente, um identificador do sistema de referência espacial (SRID). Elas retornam a geometria correspondente. Para uma descrição do formato WKB, consulte o "Formato de Binário Bem Conhecido (WKB)".

As funções desta seção detectam argumentos em sistemas de referência espaciais cartesianos ou geográficos (SRS), e retornam resultados adequados ao SRS.

`ST_GeomFromWKB()` aceita um valor WKB de qualquer tipo de geometria como seu primeiro argumento. Outras funções fornecem funções de construção específicas para cada tipo de geometria, para a construção de valores de geometria.

Antes do MySQL 8.0, essas funções também aceitavam objetos de geometria como retornados pelas funções na Seção 14.16.5, “Funções específicas do MySQL que criam valores de geometria”. Argumentos de geometria não são mais permitidos e produzem um erro. Para migrar chamadas que usam argumentos de geometria para usar argumentos WKB, siga estas diretrizes:

* Reescreva construções como `ST_GeomFromWKB(Point(0, 0))` como `Point(0, 0)`.

* Reescreva construções como `ST_GeomFromWKB(Point(0, 0), 4326)` como `ST_SRID(Point(0, 0), 4326)` ou `ST_GeomFromWKB(ST_AsWKB(Point(0, 0)), 4326)`.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se o argumento WKB ou SRID for `NULL`, o valor de retorno é `NULL`.

* Por padrão, as coordenadas geográficas (latitude, longitude) são interpretadas na ordem especificada pelo sistema de referência espacial dos argumentos de geometria. Um argumento opcional *`options`* pode ser dado para ignorar a ordem padrão dos eixos. `options` consiste em uma lista de `key=value` separados por vírgula. O único valor permitido de *`key`* é `axis-order`, com valores permitidos de `lat-long`, `long-lat` e `srid-defined` (o padrão).

Se o argumento *`options`* for `NULL`, o valor de retorno é `NULL`. Se o argumento *`options`* for inválido, ocorre um erro para indicar o motivo.

* Se um argumento SRID se refere a um sistema de referência espacial não definido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

* Para argumentos de geometria SRS geográfica, se algum argumento tiver uma longitude ou latitude fora do intervalo, ocorre um erro:

+ Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro [[`ER_LONGITUDE_OUT_OF_RANGE`].

+ Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_LATITUDE_OUT_OF_RANGE`.

As faixas mostradas são em graus. Se um SRS usa outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa diferem ligeiramente devido à aritmética de ponto flutuante.

Essas funções estão disponíveis para criar geometrias a partir de valores WKB:

* `ST_GeomCollFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-geomcollfromwkb), `ST_GeometryCollectionFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-geomcollfromwkb)

Construi um valor `GeometryCollection` usando sua representação WKB e SRID.

Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

* `ST_GeomFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-geomfromwkb), `ST_GeometryFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-geomfromwkb)

Construi um valor de geometria de qualquer tipo usando sua representação WKB e SRID.

Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

* `ST_LineFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-linefromwkb), `ST_LineStringFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-linefromwkb)

Construi um valor `LineString` usando sua representação WKB e SRID.

Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

* `ST_MLineFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-mlinefromwkb), `ST_MultiLineStringFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-mlinefromwkb)

Construi um valor `MultiLineString` usando sua representação WKB e SRID.

Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

* `ST_MPointFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-mpointfromwkb), `ST_MultiPointFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-mpointfromwkb)

Construi um valor `MultiPoint` usando sua representação WKB e SRID.

Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

* `ST_MPolyFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-mpolyfromwkb), `ST_MultiPolygonFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-mpolyfromwkb)

Construi um valor `MultiPolygon` usando sua representação WKB e SRID.

Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

* `ST_PointFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-pointfromwkb)

Construi um valor `Point` usando sua representação WKB e SRID.

`ST_PointFromWKB()` lida com seus argumentos conforme descrito na introdução desta seção.

* `ST_PolyFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-polyfromwkb), `ST_PolygonFromWKB(wkb [, srid [, options]])`(gis-wkb-functions.html#function_st-polyfromwkb)

Construi um valor `Polygon` usando sua representação WKB e SRID.

Essas funções lidam com seus argumentos conforme descrito na introdução desta seção.

### 14.16.5 Funções específicas do MySQL que criam valores de geometria

O MySQL oferece um conjunto de funções não padrão úteis para criar valores de geometria. As funções descritas nesta seção são extensões do MySQL à especificação OpenGIS.

Essas funções produzem objetos geométricos a partir de valores WKB ou objetos geométricos como argumentos. Se qualquer argumento não for uma representação adequada WKB ou geométrica do tipo de objeto adequado, o valor de retorno é `NULL`.

Por exemplo, você pode inserir o valor de retorno da geometria de `Point()` diretamente em uma coluna de `POINT`:

```
INSERT INTO t1 (pt_col) VALUES(Point(1,2));
```

* `GeomCollection(g [, g] ...)`(gis-mysql-specific-functions.html#function_geomcollection)

Construi um valor `GeomCollection` a partir dos argumentos de geometria.

`GeomCollection()` retorna todas as geometrias apropriadas contidas nos argumentos, mesmo que uma geometria não suportada esteja presente.

`GeomCollection()` sem argumentos é permitido como uma maneira de criar uma geometria vazia. Além disso, funções como `ST_GeomFromText()` que aceitam argumentos de coleção de geometria WKT entendem tanto a sintaxe padrão OpenGIS `'GEOMETRYCOLLECTION EMPTY'` quanto a sintaxe não padrão MySQL `'GEOMETRYCOLLECTION()'`.

`GeomCollection()` e `GeometryCollection()` são sinônimos, com `GeomCollection()` sendo a função preferida.

* `GeometryCollection(g [, g] ...)`(gis-mysql-specific-functions.html#function_geometrycollection)

Construi um valor `GeomCollection` a partir dos argumentos de geometria.

`GeometryCollection()` retorna todas as geometrias apropriadas contidas nos argumentos, mesmo que uma geometria não suportada esteja presente.

`GeometryCollection()` sem argumentos é permitido como uma maneira de criar uma geometria vazia. Além disso, funções como `ST_GeomFromText()` que aceitam argumentos de coleção de geometria WKT entendem tanto a sintaxe padrão OpenGIS `'GEOMETRYCOLLECTION EMPTY'` quanto a sintaxe não padrão MySQL `'GEOMETRYCOLLECTION()'`.

`GeomCollection()` e `GeometryCollection()` são sinônimos, com `GeomCollection()` sendo a função preferida.

* `LineString(pt [, pt] ...)`(gis-mysql-specific-functions.html#function_linestring)

Construi um valor `LineString` a partir de um número de argumentos `Point` ou WKB `Point`. Se o número de argumentos for menor que dois, o valor de retorno é `NULL`.

* `MultiLineString(ls [, ls] ...)`(gis-mysql-specific-functions.html#function_multilinestring)

Construi um valor `MultiLineString` usando os argumentos `LineString` ou WKB `LineString`.

* `MultiPoint(pt [, pt2] ...)`(gis-mysql-specific-functions.html#function_multipoint)

Construi um valor `MultiPoint` usando os argumentos `Point` ou WKB `Point`.

* `MultiPolygon(poly [, poly] ...)`(gis-mysql-specific-functions.html#function_multipolygon)

Constrói um valor `MultiPolygon` a partir de um conjunto de argumentos `Polygon` ou WKB `Polygon`.

* `Point(x, y)`(gis-mysql-specific-functions.html#function_point)

Construi um `Point` usando suas coordenadas.

* `Polygon(ls [, ls] ...)`(gis-mysql-specific-functions.html#function_polygon)

Construi um valor de `Polygon` a partir de um número de argumentos de `LineString` ou WKB `LineString`. Se qualquer argumento não representar um `LinearRing` (ou seja, não ser um `LineString` fechado e simples), o valor de retorno é `NULL`.

### 14.16.6 Funções de conversão de formato de geometria

O MySQL suporta as funções listadas nesta seção para converter valores de geometria do formato de geometria interna para o formato WKT ou WKB, ou para trocar a ordem das coordenadas X e Y.

Há também funções para converter uma cadeia de caracteres do formato WKT ou WKB para o formato de geometria interna. Consulte a Seção 14.16.3, “Funções que criam valores de geometria a partir de valores WKT”, e a Seção 14.16.4, “Funções que criam valores de geometria a partir de valores WKB”.

Funções como `ST_GeomFromText()` que aceitam argumentos de coleção de geometria WKT entendem tanto a sintaxe padrão do OpenGIS `'GEOMETRYCOLLECTION EMPTY'` quanto a sintaxe não padrão do MySQL `'GEOMETRYCOLLECTION()'`. Outra maneira de produzir uma coleção de geometria vazia é chamar `GeometryCollection()` sem argumentos. Funções como `ST_AsWKT()` que produzem valores WKT produzem sintaxe padrão de `'GEOMETRYCOLLECTION EMPTY'`:

```
mysql> SET @s1 = ST_GeomFromText('GEOMETRYCOLLECTION()');
mysql> SET @s2 = ST_GeomFromText('GEOMETRYCOLLECTION EMPTY');
mysql> SELECT ST_AsWKT(@s1), ST_AsWKT(@s2);
+--------------------------+--------------------------+
| ST_AsWKT(@s1)            | ST_AsWKT(@s2)            |
+--------------------------+--------------------------+
| GEOMETRYCOLLECTION EMPTY | GEOMETRYCOLLECTION EMPTY |
+--------------------------+--------------------------+
mysql> SELECT ST_AsWKT(GeomCollection());
+----------------------------+
| ST_AsWKT(GeomCollection()) |
+----------------------------+
| GEOMETRYCOLLECTION EMPTY   |
+----------------------------+
```

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria estiver em um sistema de referência espacial indefinido, os eixos são exibidos na ordem em que aparecem na geometria e ocorre uma advertência `ER_WARN_SRS_NOT_FOUND_AXIS_ORDER`.

* Por padrão, as coordenadas geográficas (latitude, longitude) são interpretadas na ordem especificada pelo sistema de referência espacial dos argumentos de geometria. Um argumento opcional *`options`* pode ser dado para ignorar a ordem padrão dos eixos. `options` consiste em uma lista de `key=value` separados por vírgula. O único valor permitido de *`key`* é `axis-order`, com valores permitidos de `lat-long`, `long-lat` e `srid-defined` (o padrão).

Se o argumento *`options`* for `NULL`, o valor de retorno é `NULL`. Se o argumento *`options`* for inválido, ocorre um erro para indicar o motivo.

* Caso contrário, o valor de retorno não é `NULL`.

Essas funções estão disponíveis para conversões de formato ou troca de coordenadas:

* `ST_AsBinary(g [, options])`](gis-format-conversion-functions.html#function_st-asbinary), [`ST_AsWKB(g [, options])`](gis-format-conversion-functions.html#function_st-asbinary)

Converte um valor no formato de geometria interna para sua representação WKB e retorna o resultado binário.

O valor de retorno da função possui coordenadas geográficas (latitude, longitude) na ordem especificada pelo sistema de referência espacial que se aplica ao argumento de geometria. Um argumento opcional *`options`* pode ser dado para sobrescrever a ordem padrão do eixo.

`ST_AsBinary()` e `ST_AsWKB()` tratam seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g = ST_LineFromText('LINESTRING(0 5,5 10,10 15)', 4326);
  mysql> SELECT ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g)));
  +-----------------------------------------+
  | ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g))) |
  +-----------------------------------------+
  | LINESTRING(5 0,10 5,15 10)              |
  +-----------------------------------------+
  mysql> SELECT ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g, 'axis-order=long-lat')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g, 'axis-order=long-lat'))) |
  +----------------------------------------------------------------+
  | LINESTRING(0 5,5 10,10 15)                                     |
  +----------------------------------------------------------------+
  mysql> SELECT ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g, 'axis-order=lat-long')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g, 'axis-order=lat-long'))) |
  +----------------------------------------------------------------+
  | LINESTRING(5 0,10 5,15 10)                                     |
  +----------------------------------------------------------------+
  ```

* `ST_AsText(g [, options])`(gis-format-conversion-functions.html#function_st-astext), `ST_AsWKT(g [, options])`(gis-format-conversion-functions.html#function_st-astext)

Converte um valor no formato de geometria interna para sua representação WKT e retorna o resultado em string.

O valor de retorno da função possui coordenadas geográficas (latitude, longitude) na ordem especificada pelo sistema de referência espacial que se aplica ao argumento de geometria. Um argumento opcional *`options`* pode ser dado para sobrescrever a ordem padrão do eixo.

`ST_AsText()` e `ST_AsWKT()` tratam seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@g));
  +--------------------------------+
  | ST_AsText(ST_GeomFromText(@g)) |
  +--------------------------------+
  | LINESTRING(1 1,2 2,3 3)        |
  +--------------------------------+
  ```

A saída para os valores de `MultiPoint` inclui parênteses em torno de cada ponto. Por exemplo:

  ```
  mysql> SELECT ST_AsText(ST_GeomFromText(@mp));
  +---------------------------------+
  | ST_AsText(ST_GeomFromText(@mp)) |
  +---------------------------------+
  | MULTIPOINT((1 1),(2 2),(3 3))   |
  +---------------------------------+
  ```

* `ST_SwapXY(g)`

Aceita um argumento no formato de geometria interna, troca os valores X e Y de cada par de coordenadas dentro da geometria e retorna o resultado.

`ST_SwapXY()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g = ST_LineFromText('LINESTRING(0 5,5 10,10 15)');
  mysql> SELECT ST_AsText(@g);
  +----------------------------+
  | ST_AsText(@g)              |
  +----------------------------+
  | LINESTRING(0 5,5 10,10 15) |
  +----------------------------+
  mysql> SELECT ST_AsText(ST_SwapXY(@g));
  +----------------------------+
  | ST_AsText(ST_SwapXY(@g))   |
  +----------------------------+
  | LINESTRING(5 0,10 5,15 10) |
  +----------------------------+
  ```

### 14.16.7 Funções de Propriedade Geométrica

Cada função que pertence a este grupo recebe um valor de geometria como seu argumento e retorna alguma propriedade quantitativa ou qualitativa da geometria. Algumas funções restringem o tipo de argumento. Essas funções retornam `NULL` se o argumento for de um tipo de geometria incorreto. Por exemplo, a função `ST_Area()` de polígono retorna `NULL` se o tipo de objeto não for nem `Polygon` nem `MultiPolygon`.

#### 14.16.7.1 Funções de Propriedade Geométrica Geral

As funções listadas nesta seção não restringem seu argumento e aceitam um valor de geometria de qualquer tipo.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

* Se qualquer argumento SRID não estiver dentro do intervalo de um inteiro sem sinal de 32 bits, ocorre um erro `ER_DATA_OUT_OF_RANGE`.

* Se qualquer argumento SRID se referir a um SRS não definido, ocorre um erro `ER_SRS_NOT_FOUND`.

* Caso contrário, o valor de retorno não é `NULL`.

Essas funções estão disponíveis para obter propriedades de geometria:

* `ST_Dimension(g)`

Retorna a dimensão inerente do valor de geometria *`g`*. A dimensão pode ser -1, 0, 1 ou 2. O significado desses valores é dado na Seção 13.4.2.2, “Classe de Geometria”.

`ST_Dimension()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SELECT ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)'));
  +------------------------------------------------------+
  | ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)')) |
  +------------------------------------------------------+
  |                                                    1 |
  +------------------------------------------------------+
  ```

* `ST_Envelope(g)`

Retorna o retângulo mínimo de delimitação (MBR) para o valor de geometria *`g`*. O resultado é retornado como um valor `Polygon` que é definido pelos pontos de esquina da caixa de delimitação:

  ```
  POLYGON((MINX MINY, MAXX MINY, MAXX MAXY, MINX MAXY, MINX MINY))
  ```

  ```
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)'))) |
  +----------------------------------------------------------------+
  | POLYGON((1 1,2 1,2 2,1 2,1 1))                                 |
  +----------------------------------------------------------------+
  ```

Se o argumento for um ponto ou um segmento de linha vertical ou horizontal, `ST_Envelope()` retorna o ponto ou o segmento de linha como seu MBR, em vez de retornar um polígono inválido:

  ```
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)'))) |
  +----------------------------------------------------------------+
  | LINESTRING(1 1,1 2)                                            |
  +----------------------------------------------------------------+
  ```

`ST_Envelope()` lida com seus argumentos conforme descrito na introdução desta seção, com esta exceção:

+ Se a geometria tiver um valor SRID para um sistema de referência espacial geográfica (SRS), ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

* `ST_GeometryType(g)`

Retorna uma string binária que indica o nome do tipo de geometria do qual a instância de geometria *`g`* é membro. O nome corresponde a uma das subclasses instanciáveis `Geometry`.

`ST_GeometryType()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SELECT ST_GeometryType(ST_GeomFromText('POINT(1 1)'));
  +------------------------------------------------+
  | ST_GeometryType(ST_GeomFromText('POINT(1 1)')) |
  +------------------------------------------------+
  | POINT                                          |
  +------------------------------------------------+
  ```

* `ST_IsEmpty(g)`

Essa função é um marcador que retorna 1 para um valor vazio da coleção de geometria ou 0 caso contrário.

A única geometria vazia válida é representada na forma de um valor de coleção de geometria vazia. O MySQL não suporta valores GIS `EMPTY`, como `POINT EMPTY`.

`ST_IsEmpty()` lida com seus argumentos conforme descrito na introdução desta seção.

* `ST_IsSimple(g)`

Retorna 1 se o valor de geometria *`g`* for simples de acordo com o padrão ISO *SQL/MM Parte 3: Espacial*. `ST_IsSimple()` retorna 0 se o argumento não for simples.

As descrições das classes geométricas instanciáveis dadas na Seção 13.4.2, “O Modelo de Geometria OpenGIS”, incluem as condições específicas que fazem com que as instâncias da classe sejam classificadas como não simples.

`ST_IsSimple()` trata seus argumentos conforme descrito na introdução desta seção, com esta exceção:

+ Se a geometria tiver um SRS geográfico com uma longitude ou latitude fora do intervalo, ocorrerá um erro:

- Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

- Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

As faixas mostradas são em graus. Os limites exatos das faixas variam ligeiramente devido à aritmética de ponto flutuante.

* `ST_SRID(g [, srid])`(gis-general-property-functions.html#function_st-srid)

Com um único argumento que representa um objeto de geometria válido *`g`*, `ST_SRID()` retorna um inteiro que indica a ID do sistema de referência espacial (SRS) associado a *`g`*.

Com o segundo argumento opcional representando um valor válido de SRID, `ST_SRID()` retorna um objeto com o mesmo tipo que seu primeiro argumento com um valor de SRID igual ao segundo argumento. Isso apenas define o valor de SRID do objeto; ele não realiza nenhuma transformação dos valores de coordenadas.

`ST_SRID()` trata seus argumentos conforme descrito na introdução desta seção, com esta exceção:

+ Para a sintaxe de argumento único, `ST_SRID()` retorna o SRID da geometria mesmo se se referir a um SRS indefinido. Não ocorre um erro `ER_SRS_NOT_FOUND`.

`ST_SRID(g, target_srid)`](gis-general-property-functions.html#function_st-srid) e `ST_Transform(g, target_srid)`](spatial-operator-functions.html#function_st-transform) diferem da seguinte forma:

+ `ST_SRID()` altera o valor de geometria SRID sem transformar suas coordenadas.

+ `ST_Transform()` transforma as coordenadas geométricas além de alterar seu valor SRID.

  ```
  mysql> SET @g = ST_GeomFromText('LineString(1 1,2 2)', 0);
  mysql> SELECT ST_SRID(@g);
  +-------------+
  | ST_SRID(@g) |
  +-------------+
  |           0 |
  +-------------+
  mysql> SET @g = ST_SRID(@g, 4326);
  mysql> SELECT ST_SRID(@g);
  +-------------+
  | ST_SRID(@g) |
  +-------------+
  |        4326 |
  +-------------+
  ```

É possível criar uma geometria em um SRID específico passando para `ST_SRID()` o resultado de uma das funções específicas do MySQL para criar valores espaciais, juntamente com um valor de SRID. Por exemplo:

  ```
  SET @g1 = ST_SRID(Point(1, 1), 4326);
  ```

No entanto, esse método cria a geometria no SRID 0 e, em seguida, a transforma para o SRID 4326 (WGS 84). Uma alternativa preferível é criar a geometria com o sistema de referência espacial correto desde o início. Por exemplo:

  ```
  SET @g1 = ST_PointFromText('POINT(1 1)', 4326);
  SET @g1 = ST_GeomFromText('POINT(1 1)', 4326);
  ```

A forma de dois argumentos de `ST_SRID()` é útil para tarefas como corrigir ou alterar o SRS de geometrias que têm um SRID incorreto.

#### 14.16.7.2 Funções de Propriedade de Pontos

Um `Point` é composto por coordenadas X e Y, que podem ser obtidas usando as funções `ST_X()` e `ST_Y()`, respectivamente. Essas funções também permitem um segundo argumento opcional que especifica um valor de coordenada X ou Y, nesse caso, o resultado da função é o objeto `Point` do primeiro argumento com a coordenada apropriada modificada para ser igual ao segundo argumento.

Para objetos `Point` que possuem um sistema de referência espacial geográfico (SRS), a longitude e a latitude podem ser obtidas usando as funções `ST_Longitude()` e `ST_Latitude()`, respectivamente. Essas funções também permitem um argumento opcional secundário que especifica um valor de longitude ou latitude, no qual o resultado da função é o objeto `Point` do primeiro argumento com a longitude ou latitude modificada para ser igual ao segundo argumento.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria for uma geometria válida, mas não um objeto `Point`, ocorrerá um erro `ER_UNEXPECTED_GEOMETRY_TYPE`.

* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

* Se um argumento de coordenada X ou Y for fornecido e o valor for `-inf`, `+inf` ou `NaN`, ocorre um erro de `ER_DATA_OUT_OF_RANGE`.

* Se um valor de longitude ou latitude estiver fora do intervalo, ocorre um erro:

+ Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_LONGITUDE_OUT_OF_RANGE`.

+ Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_LATITUDE_OUT_OF_RANGE`.

As faixas mostradas são em graus. Os limites exatos das faixas variam ligeiramente devido à aritmética de ponto flutuante.

* Caso contrário, o valor de retorno não é `NULL`.

Essas funções estão disponíveis para obter propriedades de ponto:

* `ST_Latitude(p [, new_latitude_val])`(gis-point-property-functions.html#function_st-latitude)

Com um único argumento que representa um objeto válido `Point` *`p`* que possui um sistema de referência espacial geográfica (SRS), `ST_Latitude()` retorna o valor de latitude de *`p`* como um número de dupla precisão.

Com o segundo argumento opcional representando um valor de latitude válido, `ST_Latitude()` retorna um objeto `Point` semelhante ao primeiro argumento, com sua latitude igual à do segundo argumento.

`ST_Latitude()` lida com seus argumentos conforme descrito na introdução desta seção, com a adição de que, se o objeto `Point` for válido, mas não tiver um SRS geográfico, ocorrerá um erro `ER_SRS_NOT_GEOGRAPHIC`.

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(45 90)', 4326);
  mysql> SELECT ST_Latitude(@pt);
  +------------------+
  | ST_Latitude(@pt) |
  +------------------+
  |               45 |
  +------------------+
  mysql> SELECT ST_AsText(ST_Latitude(@pt, 10));
  +---------------------------------+
  | ST_AsText(ST_Latitude(@pt, 10)) |
  +---------------------------------+
  | POINT(10 90)                    |
  +---------------------------------+
  ```

Essa função foi adicionada no MySQL 8.0.12.

* `ST_Longitude(p [, new_longitude_val])`(gis-point-property-functions.html#function_st-longitude)

Com um único argumento que representa um objeto válido `Point` *`p`* que possui um sistema de referência espacial geográfica (SRS), `ST_Longitude()` retorna o valor da longitude de *`p`* como um número de dupla precisão.

Com o segundo argumento opcional representando um valor de longitude válido, `ST_Longitude()` retorna um objeto `Point` como o primeiro argumento, com sua longitude igual à do segundo argumento.

`ST_Longitude()` lida com seus argumentos conforme descrito na introdução desta seção, com a adição de que, se o objeto `Point` for válido, mas não tiver um SRS geográfico, ocorrerá um erro `ER_SRS_NOT_GEOGRAPHIC`.

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(45 90)', 4326);
  mysql> SELECT ST_Longitude(@pt);
  +-------------------+
  | ST_Longitude(@pt) |
  +-------------------+
  |                90 |
  +-------------------+
  mysql> SELECT ST_AsText(ST_Longitude(@pt, 10));
  +----------------------------------+
  | ST_AsText(ST_Longitude(@pt, 10)) |
  +----------------------------------+
  | POINT(45 10)                     |
  +----------------------------------+
  ```

Essa função foi adicionada no MySQL 8.0.12.

* `ST_X(p [, new_x_val])`(gis-point-property-functions.html#function_st-x)

Com um único argumento que representa um objeto `Point` válido *`p`*, o `ST_X()` retorna o valor da coordenada X de *`p`* como um número de precisão dupla. A partir do MySQL 8.0.12, a coordenada X é considerada para se referir ao eixo que aparece primeiro na definição do sistema de referência espacial (SRS) `Point`.

Com o segundo argumento opcional, `ST_X()` retorna um objeto `Point` como o primeiro argumento, com sua coordenada X igual ao segundo argumento. A partir do MySQL 8.0.12, se o objeto `Point` tiver um SRS geográfico, o segundo argumento deve estar no intervalo adequado para valores de longitude ou latitude.

`ST_X()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SELECT ST_X(Point(56.7, 53.34));
  +--------------------------+
  | ST_X(Point(56.7, 53.34)) |
  +--------------------------+
  |                     56.7 |
  +--------------------------+
  mysql> SELECT ST_AsText(ST_X(Point(56.7, 53.34), 10.5));
  +-------------------------------------------+
  | ST_AsText(ST_X(Point(56.7, 53.34), 10.5)) |
  +-------------------------------------------+
  | POINT(10.5 53.34)                         |
  +-------------------------------------------+
  ```

* `ST_Y(p [, new_y_val])`(gis-point-property-functions.html#function_st-y)

Com um único argumento que representa um objeto `Point` válido *`p`*, `ST_Y()` retorna o valor da coordenada Y de *`p`* como um número de precisão dupla. A partir do MySQL 8.0.12, a coordenada Y é considerada para se referir ao eixo que aparece em segundo lugar na definição do sistema de referência espacial (SRS) `Point`.

Com o segundo argumento opcional, `ST_Y()` retorna um objeto `Point` como o primeiro argumento, com sua coordenada Y igual ao segundo argumento. A partir do MySQL 8.0.12, se o objeto `Point` tiver um SRS geográfico, o segundo argumento deve estar no intervalo adequado para valores de longitude ou latitude.

`ST_Y()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SELECT ST_Y(Point(56.7, 53.34));
  +--------------------------+
  | ST_Y(Point(56.7, 53.34)) |
  +--------------------------+
  |                    53.34 |
  +--------------------------+
  mysql> SELECT ST_AsText(ST_Y(Point(56.7, 53.34), 10.5));
  +-------------------------------------------+
  | ST_AsText(ST_Y(Point(56.7, 53.34), 10.5)) |
  +-------------------------------------------+
  | POINT(56.7 10.5)                          |
  +-------------------------------------------+
  ```

#### 14.16.7.3 Funções de Propriedade de LineString e MultiLineString

Um `LineString` é composto por valores de `Point`. Você pode extrair pontos específicos de um `LineString`, contar o número de pontos que ele contém ou obter seu comprimento.

Algumas funções nesta seção também funcionam para valores de `MultiLineString`.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL` ou qualquer argumento de geometria for uma geometria vazia, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

* Caso contrário, o valor de retorno não é `NULL`.

Essas funções estão disponíveis para obter propriedades de linhastring:

* `ST_EndPoint(ls)`

Retorna o `Point` que é o ponto final do valor `LineString` *`ls`*.

`ST_EndPoint()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_EndPoint(ST_GeomFromText(@ls)));
  +----------------------------------------------+
  | ST_AsText(ST_EndPoint(ST_GeomFromText(@ls))) |
  +----------------------------------------------+
  | POINT(3 3)                                   |
  +----------------------------------------------+
  ```

* `ST_IsClosed(ls)`

Para um valor de `LineString` *`ls`*, `ST_IsClosed()` retorna 1 se *`ls`* estiver fechado (ou seja, seus valores de `ST_StartPoint()` e `ST_EndPoint()` são os mesmos).

Para um valor de `MultiLineString` *`ls`*, `ST_IsClosed()` retorna 1 se *`ls`* estiver fechado (ou seja, os valores de `ST_StartPoint()` e `ST_EndPoint()` são os mesmos para cada `LineString` em *`ls`*).

`ST_IsClosed()` retorna 0 se *`ls`* não estiver fechado, e `NULL` se *`ls`* estiver em `NULL`.

`ST_IsClosed()` lida com seus argumentos conforme descrito na introdução desta seção, com esta exceção:

+ Se a geometria tiver um valor SRID para um sistema de referência espacial geográfica (SRS), ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

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

* `ST_Length(ls [, unit])`(gis-linestring-property-functions.html#function_st-length)

Retorna um número de dupla precisão que indica a extensão do valor `LineString` ou `MultiLineString` *`ls`* em seu sistema de referência espacial associado. A extensão de um valor `MultiLineString` é igual à soma das extensões de seus elementos.

`ST_Length()` calcula um resultado da seguinte forma:

+ Se a geometria for um `LineString` válido em um SRS cartesiano, o valor de retorno é o comprimento cartesiano da geometria.

+ Se a geometria for um `MultiLineString` válido em um SRS cartesiano, o valor de retorno é a soma das medidas cartesianas de seus elementos.

+ Se a geometria for um `LineString` válido em um SRS geográfico, o valor de retorno é o comprimento geodésico da geometria nesse SRS, em metros.

+ Se a geometria for um `MultiLineString` válido em um SRS geográfico, o valor de retorno é a soma das distâncias geodésicas de seus elementos nesse SRS, em metros.

`ST_Length()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Se a geometria não for um `LineString` ou `MultiLineString`, o valor de retorno é `NULL`.

+ Se a geometria for geométricamente inválida, o resultado é uma medida indefinida (ou seja, pode ser qualquer número) ou ocorre um erro.

+ Se o resultado da computação de comprimento for `+inf`, ocorre um erro `ER_DATA_OUT_OF_RANGE`.

+ Se a geometria tiver um SRS geográfico com uma longitude ou latitude fora do intervalo, ocorrerá um erro:

- Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

- Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

As faixas mostradas são em graus. Os limites exatos das faixas variam ligeiramente devido à aritmética de ponto flutuante.

A partir do MySQL 8.0.16, `ST_Length()` permite um argumento opcional *`unit`* que especifica a unidade linear para o valor de comprimento retornado. Essas regras se aplicam:

+ Se uma unidade for especificada, mas não é suportada pelo MySQL, ocorre um erro `ER_UNIT_NOT_FOUND`.

+ Se uma unidade linear compatível for especificada e o SRID for 0, ocorre um erro `ER_GEOMETRY_IN_UNKNOWN_LENGTH_UNIT`.

+ Se uma unidade linear compatível for especificada e o SRID não for 0, o resultado será nessa unidade.

+ Se uma unidade não for especificada, o resultado é na unidade do SRS das geometrias, seja cartesiano ou geográfico. Atualmente, todos os SRSs do MySQL são expressos em metros.

Uma unidade é suportada se for encontrada na tabela `INFORMATION_SCHEMA` `ST_UNITS_OF_MEASURE`. Veja a Seção 28.3.37, “A tabela INFORMATION_SCHEMA ST_UNITS_OF_MEASURE”.

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
  ```

* `ST_NumPoints(ls)`

Retorna o número de objetos `Point` no valor `LineString` *`ls`*.

`ST_NumPoints()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_NumPoints(ST_GeomFromText(@ls));
  +------------------------------------+
  | ST_NumPoints(ST_GeomFromText(@ls)) |
  +------------------------------------+
  |                                  3 |
  +------------------------------------+
  ```

* `ST_PointN(ls, N)`(gis-linestring-property-functions.html#function_st-pointn)

Retorna o *`N`*-o `Point` no valor `Linestring` *`ls`*. Os pontos são numerados a partir do número 1.

`ST_PointN()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_PointN(ST_GeomFromText(@ls),2));
  +----------------------------------------------+
  | ST_AsText(ST_PointN(ST_GeomFromText(@ls),2)) |
  +----------------------------------------------+
  | POINT(2 2)                                   |
  +----------------------------------------------+
  ```

* `ST_StartPoint(ls)`

Retorna o `Point` que é o ponto de início do valor `LineString` *`ls`*.

`ST_StartPoint()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_StartPoint(ST_GeomFromText(@ls)));
  +------------------------------------------------+
  | ST_AsText(ST_StartPoint(ST_GeomFromText(@ls))) |
  +------------------------------------------------+
  | POINT(1 1)                                     |
  +------------------------------------------------+
  ```

#### 14.16.7.4 Funções de Propriedade de Poligono e MultiPoligono

As funções desta seção retornam propriedades dos valores de `Polygon` ou `MultiPolygon`.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL` ou qualquer argumento de geometria for uma geometria vazia, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

* Para funções que aceitam múltiplos argumentos de geometria, se esses argumentos não estiverem no mesmo SRS, ocorre um erro `ER_GIS_DIFFERENT_SRIDS`.

* Caso contrário, o valor de retorno não é `NULL`.

Essas funções estão disponíveis para obter propriedades de polígonos:

* `ST_Area({poly|mpoly})`

Retorna um número de precisão dupla que indica a área do argumento `Polygon` ou `MultiPolygon`, medida em seu sistema de referência espacial.

A partir do MySQL 8.0.13, `ST_Area()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Se a geometria for geométricamente inválida, o resultado é uma área indefinida (ou seja, pode ser qualquer número) ou ocorre um erro.

+ Se a geometria for válida, mas não for um objeto `Polygon` ou `MultiPolygon`, ocorrerá um erro `ER_UNEXPECTED_GEOMETRY_TYPE`.

+ Se a geometria for um `Polygon` válido em um SRS cartesiano, o resultado é a área cartesiana do polígono.

+ Se a geometria for um `MultiPolygon` válido em um SRS cartesiano, o resultado é a soma da área cartesiana dos polígonos.

+ Se a geometria for um `Polygon` válido em um SRS geográfico, o resultado é a área geodésica do polígono nesse SRS, em metros quadrados.

+ Se a geometria for um `MultiPolygon` válido em um SRS geográfico, o resultado é a soma da área geodésica dos polígonos nesse SRS, em metros quadrados.

+ Se uma computação de área resultar em `+inf`, ocorre um erro `ER_DATA_OUT_OF_RANGE`.

+ Se a geometria tiver um SRS geográfico com uma longitude ou latitude fora do intervalo, ocorrerá um erro:

- Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

- Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

As faixas mostradas são em graus. Os limites exatos das faixas variam ligeiramente devido à aritmética de ponto flutuante.

Antes do MySQL 8.0.13, `ST_Area()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Para argumentos de dimensão 0 ou 1, o resultado é 0.  
+ Se uma geometria estiver vazia, o valor de retorno é 0 em vez de `NULL`.

+ Para uma coleção de geometria, o resultado é a soma dos valores de área de todos os componentes. Se a coleção de geometria estiver vazia, sua área será devolvida como 0.

+ Se a geometria tiver um valor SRID para um sistema de referência espacial geográfica (SRS), ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

  ```
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 0,0 0),(1 1,1 2,2 1,1 1))';
  mysql> SELECT ST_Area(ST_GeomFromText(@poly));
  +---------------------------------+
  | ST_Area(ST_GeomFromText(@poly)) |
  +---------------------------------+
  |                               4 |
  +---------------------------------+

  mysql> SET @mpoly =
         'MultiPolygon(((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1)))';
  mysql> SELECT ST_Area(ST_GeomFromText(@mpoly));
  +----------------------------------+
  | ST_Area(ST_GeomFromText(@mpoly)) |
  +----------------------------------+
  |                                8 |
  +----------------------------------+
  ```

* `ST_Centroid({poly|mpoly})`

Retorna o centroide matemático para o argumento `Polygon` ou `MultiPolygon` como um `Point`. O resultado não é garantido para estar no `MultiPolygon`.

Essa função processa coleções de geometria, calculando o ponto central para componentes da maior dimensão na coleção. Esses componentes são extraídos e transformados em um único `MultiPolygon`, `MultiLineString` ou `MultiPoint` para o cálculo do centro.

`ST_Centroid()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ O valor de retorno é `NULL` para a condição adicional de que o argumento é uma coleção de geometria vazia.

+ Se a geometria tiver um valor SRID para um sistema de referência espacial geográfica (SRS), ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

  ```
  mysql> SET @poly =
         ST_GeomFromText('POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7,5 5))');
  mysql> SELECT ST_GeometryType(@poly),ST_AsText(ST_Centroid(@poly));
  +------------------------+--------------------------------------------+
  | ST_GeometryType(@poly) | ST_AsText(ST_Centroid(@poly))              |
  +------------------------+--------------------------------------------+
  | POLYGON                | POINT(4.958333333333333 4.958333333333333) |
  +------------------------+--------------------------------------------+
  ```

* `ST_ExteriorRing(poly)`

Retorna o anel exterior do valor `Polygon` *`poly`* como um `LineString`.

`ST_ExteriorRing()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_AsText(ST_ExteriorRing(ST_GeomFromText(@poly)));
  +----------------------------------------------------+
  | ST_AsText(ST_ExteriorRing(ST_GeomFromText(@poly))) |
  +----------------------------------------------------+
  | LINESTRING(0 0,0 3,3 3,3 0,0 0)                    |
  +----------------------------------------------------+
  ```

* `ST_InteriorRingN(poly, N)`(gis-polygon-property-functions.html#function_st-interiorringn)

Retorna o anel interno *`N`*-o para o valor `Polygon` *`poly`* como um `LineString`. Os anéis são numerados começando com 1.

`ST_InteriorRingN()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1));
  +-------------------------------------------------------+
  | ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1)) |
  +-------------------------------------------------------+
  | LINESTRING(1 1,1 2,2 2,2 1,1 1)                       |
  +-------------------------------------------------------+
  ```

* `ST_NumInteriorRing(poly)`, `ST_NumInteriorRings(poly)`

Retorna o número de anéis internos no valor `Polygon` * `poly`*.

`ST_NumInteriorRing()` e `ST_NuminteriorRings()` tratam seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_NumInteriorRings(ST_GeomFromText(@poly));
  +---------------------------------------------+
  | ST_NumInteriorRings(ST_GeomFromText(@poly)) |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  ```

#### 14.16.7.5 Funções de Propriedade de GeometryCollection

Essas funções retornam propriedades dos valores de `GeometryCollection`.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL` ou qualquer argumento de geometria for uma geometria vazia, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

* Caso contrário, o valor de retorno não é `NULL`.

Essas funções estão disponíveis para obter propriedades de coleção de geometria:

* `ST_GeometryN(gc, N)`(gis-geometrycollection-property-functions.html#function_st-geometryn)

Retorna a *`N`*-aª geometria no valor `GeometryCollection` *`gc`*. As geometrias são numeradas a partir do número 1.

`ST_GeometryN()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1));
  +-------------------------------------------------+
  | ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1)) |
  +-------------------------------------------------+
  | POINT(1 1)                                      |
  +-------------------------------------------------+
  ```

* `ST_NumGeometries(gc)`

Retorna o número de geometrias no valor `GeometryCollection` *`gc`*.

`ST_NumGeometries()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_NumGeometries(ST_GeomFromText(@gc));
  +----------------------------------------+
  | ST_NumGeometries(ST_GeomFromText(@gc)) |
  +----------------------------------------+
  |                                      2 |
  +----------------------------------------+
  ```

### 14.16.8 Funções de Operadores Espaciais

O OpenGIS propõe uma série de funções que podem produzir geometrias. Elas são projetadas para implementar operadores espaciais. Essas funções suportam todas as combinações de tipos de argumentos, exceto aquelas que são inapropriadas de acordo com a especificação do [Consórcio de Geoprocessamento de Abertura][(http://www.opengeospatial.org)].

O MySQL também implementa certas funções que são extensões do OpenGIS, conforme observado nas descrições das funções. Além disso, a Seção 14.16.7, “Funções de Propriedade Geométrica”, discute várias funções que constroem novas geometrias a partir de outras existentes. Veja essa seção para obter descrições dessas funções:

* `ST_Envelope(g)`
* `ST_StartPoint(ls)`
* `ST_EndPoint(ls)`
* [`ST_PointN(ls, N)`](gis-linestring-property-functions.html#function_st-pointn)

* `ST_ExteriorRing(poly)`
* [`ST_InteriorRingN(poly, N)`](gis-polygon-property-functions.html#function_st-interiorringn)

* `ST_GeometryN(gc, N)`(gis-geometrycollection-property-functions.html#function_st-geometryn)

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

* Para funções que aceitam múltiplos argumentos de geometria, se esses argumentos não estiverem no mesmo SRS, ocorre um erro `ER_GIS_DIFFERENT_SRIDS`.

* Se qualquer argumento de geometria tiver um valor SRID para um SRS geográfico e a função não lidar com geometrias geográficas, ocorrerá um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

* Para argumentos de geometria SRS geográfica, se algum argumento tiver uma longitude ou latitude fora do intervalo, ocorre um erro:

+ Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

+ Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

As faixas mostradas são em graus. Se um SRS usa outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa diferem ligeiramente devido à aritmética de ponto flutuante.

* Caso contrário, o valor de retorno não é `NULL`.

Essas funções de operadores espaciais estão disponíveis:

* `ST_Buffer(g, d [, strategy1 [, strategy2 [, strategy3]]])`(spatial-operator-functions.html#function_st-buffer)

Retorna uma geometria que representa todos os pontos cuja distância do valor da geometria *`g`* é menor ou igual a uma distância de *`d`*. O resultado está no mesmo SRS que o argumento de geometria.

Se o argumento de geometria estiver vazio, `ST_Buffer()` retorna uma geometria vazia.

Se a distância for 0, `ST_Buffer()` retorna o argumento de geometria inalterado:

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 0));
  +------------------------------+
  | ST_AsText(ST_Buffer(@pt, 0)) |
  +------------------------------+
  | POINT(0 0)                   |
  +------------------------------+
  ```

Se o argumento de geometria estiver em um SRS cartesiano:

+ `ST_Buffer()` suporta distâncias negativas para os valores de `Polygon` e `MultiPolygon`, e para coleções de geometria que contêm valores de `Polygon` ou `MultiPolygon`.

+ Se o resultado for reduzido tanto que desaparece, o resultado é uma geometria vazia.

+ Uma erro `ER_WRONG_ARGUMENTS` ocorre para `ST_Buffer()` com uma distância negativa para os valores de `Point`, `MultiPoint`, `LineString` e `MultiLineString`, e para coleções de geometria que não contêm quaisquer valores de `Polygon` ou `MultiPolygon`.

Se o argumento de geometria estiver em um SRS geográfico:

+ Antes do MySQL 8.0.26, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

+ A partir do MySQL 8.0.26, as geometrias `Point` em um SRS geográfico são permitidas. Para geometrias que não são `Point`, ainda ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

Para as versões do MySQL que permitem geometrias geográficas `Point`:

+ Se a distância não for negativa e não forem especificadas estratégias, a função retorna o buffer geográfico do `Point` em sua SRS. O argumento de distância deve estar na unidade de distância da SRS (atualmente sempre metros).

+ Se a distância for negativa ou se for especificada qualquer estratégia (exceto `NULL`), ocorre um erro `ER_WRONG_ARGUMENTS`.

`ST_Buffer()` permite até três argumentos opcionais de estratégia após o argumento de distância. As estratégias influenciam o cálculo do buffer. Esses argumentos são valores de string de bytes produzidos pela função `ST_Buffer_Strategy()`, a serem utilizados para estratégias de ponto, junção e fim:

As estratégias de ponto aplicam-se às geometrias `Point` e `MultiPoint`. Se nenhuma estratégia de ponto for especificada, o padrão é `ST_Buffer_Strategy('point_circle', 32)`(spatial-operator-functions.html#function_st-buffer-strategy).

As estratégias de junção se aplicam a geometrias de `LineString`, `MultiLineString`, `Polygon` e `MultiPolygon`. Se nenhuma estratégia de junção for especificada, o padrão é `ST_Buffer_Strategy('join_round', 32)`(spatial-operator-functions.html#function_st-buffer-strategy).

As estratégias de finalização se aplicam às geometrias `LineString` e `MultiLineString`. Se nenhuma estratégia de finalização for especificada, o padrão é `ST_Buffer_Strategy('end_round', 32)`(spatial-operator-functions.html#function_st-buffer-strategy).

Até uma estratégia de cada tipo pode ser especificada, e elas podem ser dadas em qualquer ordem.

Se as estratégias de buffer forem inválidas, ocorrerá um erro `ER_WRONG_ARGUMENTS`. As estratégias são inválidas em qualquer uma dessas circunstâncias:

+ São especificadas múltiplas estratégias de um determinado tipo (ponto, junção ou fim).

+ Um valor que não é uma estratégia (como uma string binária arbitrária ou um número) é passado como uma estratégia.

+ Uma estratégia `Point` é passada e a geometria não contém valores de `Point` ou `MultiPoint`.

+ Uma estratégia de término ou junção é passada e a geometria não contém valores de `LineString`, `Polygon`, `MultiLinestring` ou `MultiPolygon`.

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SET @pt_strategy = ST_Buffer_Strategy('point_square');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 2, @pt_strategy));
  +--------------------------------------------+
  | ST_AsText(ST_Buffer(@pt, 2, @pt_strategy)) |
  +--------------------------------------------+
  | POLYGON((-2 -2,2 -2,2 2,-2 2,-2 -2))       |
  +--------------------------------------------+
  ```

  ```
  mysql> SET @ls = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)');
  mysql> SET @end_strategy = ST_Buffer_Strategy('end_flat');
  mysql> SET @join_strategy = ST_Buffer_Strategy('join_round', 10);
  mysql> SELECT ST_AsText(ST_Buffer(@ls, 5, @end_strategy, @join_strategy))
  +---------------------------------------------------------------+
  | ST_AsText(ST_Buffer(@ls, 5, @end_strategy, @join_strategy))   |
  +---------------------------------------------------------------+
  | POLYGON((5 5,5 10,0 10,-3.5355339059327373 8.535533905932738, |
  | -5 5,-5 0,0 0,5 0,5 5))                                       |
  +---------------------------------------------------------------+
  ```

* `ST_Buffer_Strategy(strategy [, points_per_circle])`(spatial-operator-functions.html#function_st-buffer-strategy)

Essa função retorna uma cadeia de bytes de estratégia para uso com `ST_Buffer()` para influenciar o cálculo do buffer.

Informações sobre estratégias estão disponíveis em Boost.org.

O primeiro argumento deve ser uma string que indique uma opção de estratégia:

+ Para estratégias de ponto, os valores permitidos são `'point_circle'` e `'point_square'`.

+ Para estratégias de junção, os valores permitidos são `'join_round'` e `'join_miter'`.

+ Para estratégias finais, os valores permitidos são `'end_round'` e `'end_flat'`.

Se o primeiro argumento for `'point_circle'`, `'join_round'`, `'join_miter'` ou `'end_round'`, o argumento *`points_per_circle`* deve ser fornecido como um valor numérico positivo. O valor máximo de *`points_per_circle`* é o valor da variável do sistema `max_points_in_geometry`.

Para exemplos, veja a descrição de `ST_Buffer()`.

`ST_Buffer_Strategy()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Se qualquer argumento for inválido, ocorre um erro `ER_WRONG_ARGUMENTS`.

+ Se o primeiro argumento for `'point_square'` ou `'end_flat'`, o argumento *`points_per_circle`* não deve ser dado ou ocorrerá um erro `ER_WRONG_ARGUMENTS`.

* `ST_ConvexHull(g)`

Retorna uma geometria que representa o casco convexo do valor de geometria *`g`*.

Essa função calcula a casca convexa de uma geometria, verificando primeiro se seus pontos de vértice são colineares. A função retorna uma casca linear se assim for, e uma casca poligonal caso contrário. Essa função processa coleções de geometria, extraindo todos os pontos de vértice de todos os componentes da coleção, criando um valor `MultiPoint` a partir deles e calculando sua casca convexa.

`ST_ConvexHull()` lida com seus argumentos conforme descrito na introdução desta seção, com esta exceção:

+ O valor de retorno é `NULL` para a condição adicional de que o argumento é uma coleção de geometria vazia.

  ```
  mysql> SET @g = 'MULTIPOINT(5 0,25 0,15 10,15 25)';
  mysql> SELECT ST_AsText(ST_ConvexHull(ST_GeomFromText(@g)));
  +-----------------------------------------------+
  | ST_AsText(ST_ConvexHull(ST_GeomFromText(@g))) |
  +-----------------------------------------------+
  | POLYGON((5 0,25 0,15 25,5 0))                 |
  +-----------------------------------------------+
  ```

* `ST_Difference(g1, g2)`(spatial-operator-functions.html#function_st-difference)

Retorna uma geometria que representa a diferença de conjuntos de pontos dos valores de geometria *`g1`* e *`g2`*. O resultado está no mesmo SRS que os argumentos de geometria.

A partir do MySQL 8.0.26, `ST_Difference()` permite argumentos em um SRS cartesiano ou em um SRS geográfico. Antes do MySQL 8.0.26, `ST_Difference()` permite argumentos em um SRS cartesiano apenas; para argumentos em um SRS geográfico, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

`ST_Difference()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_AsText(ST_Difference(@g1, @g2));
  +------------------------------------+
  | ST_AsText(ST_Difference(@g1, @g2)) |
  +------------------------------------+
  | POINT(1 1)                         |
  +------------------------------------+
  ```

* `ST_Intersection(g1, g2)`(spatial-operator-functions.html#function_st-intersection)

Retorna uma geometria que representa a interseção do conjunto de pontos dos valores de geometria *`g1`* e *`g2`*. O resultado está no mesmo SRS que os argumentos de geometria.

A partir do MySQL 8.0.27, `ST_Intersection()` permite argumentos em um SRS cartesiano ou em um SRS geográfico. Antes do MySQL 8.0.27, `ST_Intersection()` permite argumentos em um SRS cartesiano apenas; para argumentos em um SRS geográfico, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

`ST_Intersection()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g1 = ST_GeomFromText('LineString(1 1, 3 3)');
  mysql> SET @g2 = ST_GeomFromText('LineString(1 3, 3 1)');
  mysql> SELECT ST_AsText(ST_Intersection(@g1, @g2));
  +--------------------------------------+
  | ST_AsText(ST_Intersection(@g1, @g2)) |
  +--------------------------------------+
  | POINT(2 2)                           |
  +--------------------------------------+
  ```

* `ST_LineInterpolatePoint(ls, fractional_distance)`(spatial-operator-functions.html#function_st-lineinterpolatepoint)

Essa função recebe uma geometria `LineString` e uma distância fracionária no intervalo [0,0; 1,0] e retorna a `Point` ao longo da `LineString` no dado fracionamento da distância de seu ponto de partida até seu ponto final. Ela pode ser usada para responder a perguntas como qual `Point` está a meio caminho ao longo da estrada descrita pelo argumento da geometria.

A função é implementada para geometrias `LineString` em todos os sistemas de referência espacial, tanto cartesianos quanto geográficos.

Se o argumento *`fractional_distance`* for 1,0, o resultado pode não ser exatamente o último ponto do argumento `LineString`, mas sim um ponto próximo a ele devido a imprecisões numéricas em cálculos de valor aproximado.

Uma função relacionada, `ST_LineInterpolatePoints()`, recebe argumentos semelhantes, mas retorna um `MultiPoint` composto por valores de `Point` ao longo do `LineString` em cada fração da distância de seu ponto de partida até seu ponto final. Para exemplos de ambas as funções, consulte a descrição de `ST_LineInterpolatePoints()`.

`ST_LineInterpolatePoint()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Se o argumento de geometria não for um `LineString`, ocorre um erro `ER_UNEXPECTED_GEOMETRY_TYPE`.

+ Se o argumento da distância fracionária estiver fora da faixa [0,0; 1,0], ocorrerá um erro `ER_DATA_OUT_OF_RANGE`.

`ST_LineInterpolatePoint()` é uma extensão do MySQL para OpenGIS. Essa função foi adicionada no MySQL 8.0.24.

* `ST_LineInterpolatePoints(ls, fractional_distance)`(spatial-operator-functions.html#function_st-lineinterpolatepoints)

Essa função recebe uma geometria `LineString` e uma distância fracionária no intervalo (0,0 a 1,0) e retorna o `MultiPoint` composto pelo ponto de início `LineString`, além dos valores `Point` ao longo do `LineString` em cada fração da distância de seu ponto de início até seu ponto final. Pode ser usada para responder a perguntas como quais valores `Point` estão em cada 10% do caminho ao longo da estrada descrita pelo argumento de geometria.

A função é implementada para geometrias de `LineString` em todos os sistemas de referência espacial, tanto cartesianos quanto geográficos.

Se o argumento *`fractional_distance`* dividir 1,0 com resto zero, o resultado pode não conter o último ponto do argumento `LineString`, mas sim um ponto próximo a ele, devido a imprecisões numéricas em cálculos de valor aproximado.

Uma função relacionada, `ST_LineInterpolatePoint()`, recebe argumentos semelhantes, mas retorna o `Point` ao longo do `LineString` na fração dada da distância de seu ponto de partida até seu ponto final.

`ST_LineInterpolatePoints()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Se o argumento de geometria não for um `LineString`, ocorre um erro `ER_UNEXPECTED_GEOMETRY_TYPE`.

+ Se o argumento da distância fracionária estiver fora da faixa [0,0; 1,0], ocorrerá um erro `ER_DATA_OUT_OF_RANGE`.

  ```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)');
  mysql> SELECT ST_AsText(ST_LineInterpolatePoint(@ls1, .5));
  +----------------------------------------------+
  | ST_AsText(ST_LineInterpolatePoint(@ls1, .5)) |
  +----------------------------------------------+
  | POINT(0 5)                                   |
  +----------------------------------------------+
  mysql> SELECT ST_AsText(ST_LineInterpolatePoint(@ls1, .75));
  +-----------------------------------------------+
  | ST_AsText(ST_LineInterpolatePoint(@ls1, .75)) |
  +-----------------------------------------------+
  | POINT(2.5 5)                                  |
  +-----------------------------------------------+
  mysql> SELECT ST_AsText(ST_LineInterpolatePoint(@ls1, 1));
  +---------------------------------------------+
  | ST_AsText(ST_LineInterpolatePoint(@ls1, 1)) |
  +---------------------------------------------+
  | POINT(5 5)                                  |
  +---------------------------------------------+
  mysql> SELECT ST_AsText(ST_LineInterpolatePoints(@ls1, .25));
  +------------------------------------------------+
  | ST_AsText(ST_LineInterpolatePoints(@ls1, .25)) |
  +------------------------------------------------+
  | MULTIPOINT((0 2.5),(0 5),(2.5 5),(5 5))        |
  +------------------------------------------------+
  ```

`ST_LineInterpolatePoints()` é uma extensão do MySQL para OpenGIS. Essa função foi adicionada no MySQL 8.0.24.

* `ST_PointAtDistance(ls, distance)`(spatial-operator-functions.html#function_st-pointatdistance)

Essa função recebe uma geometria `LineString` e uma distância no intervalo [0,0, `ST_Length(ls)`], medida na unidade do sistema de referência espacial (SRS) do `LineString`, e retorna o `Point` ao longo do `LineString` naquela distância do seu ponto de partida. Pode ser usada para responder a perguntas como qual o valor do `Point` que está a 400 metros do início da estrada descrita pelo argumento de geometria.

A função é implementada para geometrias de `LineString` em todos os sistemas de referência espacial, tanto cartesianos quanto geográficos.

`ST_PointAtDistance()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Se o argumento de geometria não for um `LineString`, ocorre um erro `ER_UNEXPECTED_GEOMETRY_TYPE`.

+ Se o argumento da distância fracionária estiver fora da faixa [0,0, `ST_Length(ls)`], ocorrerá um erro de `ER_DATA_OUT_OF_RANGE`.

`ST_PointAtDistance()` é uma extensão do MySQL para OpenGIS. Essa função foi adicionada no MySQL 8.0.24.

* `ST_SymDifference(g1, g2)`(spatial-operator-functions.html#function_st-symdifference)

Retorna uma geometria que representa a diferença simétrica do conjunto de pontos dos valores de geometria *`g1`* e *`g2`*, que é definida da seguinte forma:

  ```
  g1 symdifference g2 := (g1 union g2) difference (g1 intersection g2)
  ```

Ou, na notação de chamada de função:

  ```
  ST_SymDifference(g1, g2) = ST_Difference(ST_Union(g1, g2), ST_Intersection(g1, g2))
  ```

O resultado está no mesmo SRS que os argumentos de geometria.

A partir do MySQL 8.0.27, `ST_SymDifference()` permite argumentos em um SRS cartesiano ou em um SRS geográfico. Antes do MySQL 8.0.27, `ST_SymDifference()` permite argumentos em um SRS cartesiano apenas; para argumentos em um SRS geográfico, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

`ST_SymDifference()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g1 = ST_GeomFromText('MULTIPOINT(5 0,15 10,15 25)');
  mysql> SET @g2 = ST_GeomFromText('MULTIPOINT(1 1,15 10,15 25)');
  mysql> SELECT ST_AsText(ST_SymDifference(@g1, @g2));
  +---------------------------------------+
  | ST_AsText(ST_SymDifference(@g1, @g2)) |
  +---------------------------------------+
  | MULTIPOINT((1 1),(5 0))               |
  +---------------------------------------+
  ```

* `ST_Transform(g, target_srid)`(spatial-operator-functions.html#function_st-transform)

Transforma uma geometria de um sistema de referência espacial (SRS) para outro. O valor de retorno é uma geometria do mesmo tipo que a geometria de entrada, com todas as coordenadas transformadas para o SRID de destino, *`target_srid`*. Antes do MySQL 8.0.30, o suporte à transformação era limitado a SRSs geográficas (a menos que o SRID do argumento da geometria fosse o mesmo que o valor do SRID de destino, no qual caso o valor de retorno era a geometria de entrada para qualquer SRS válido), e esta função não suportava SRSs cartesianas. A partir do MySQL 8.0.30, é fornecido suporte ao método de projeção Popular Visualisation Pseudo Mercator (EPSG 1024), usado para WGS 84 Pseudo-Mercator (SRID 3857). No MySQL 8.0.32 e posterior, o suporte é estendido para todas as SRSs definidas por EPSG, exceto as listadas aqui:

+ EPSG 1042 Krovak Modificado
+ EPSG 1043 Krovak Modificado (Orientado ao Norte)
+ EPSG 9816 Tunisia Mining Grid
+ EPSG 9826 Lambert Conic Conformal (Orientado a Oeste)

`ST_Transform()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

Argumentos de geometria que têm um valor SRID para um SRS geográfico não produzem um erro.

+ Se a geometria ou o argumento SRID alvo tiver um valor SRID que se refere a um sistema de referência espacial não definido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

+ Se a geometria estiver em um SRS que o `ST_Transform()` não pode transformar, ocorre um erro `ER_TRANSFORM_SOURCE_SRS_NOT_SUPPORTED`.

+ Se o SRID de destino estiver em um SRS que o `ST_Transform()` não pode transformar, ocorre um erro `ER_TRANSFORM_TARGET_SRS_NOT_SUPPORTED`.

+ Se a geometria estiver em um SRS que não é WGS 84 e não tenha cláusula TOWGS84, ocorrerá um erro `ER_TRANSFORM_SOURCE_SRS_MISSING_TOWGS84`.

+ Se o SRID de destino estiver em um SRS que não é WGS 84 e não tiver uma cláusula TOWGS84, ocorrerá um erro `ER_TRANSFORM_TARGET_SRS_MISSING_TOWGS84`.

`ST_SRID(g, target_srid)` e (gis-general-property-functions.html#function_st-srid) diferem da seguinte forma: e `ST_Transform(g, target_srid)` e (spatial-operator-functions.html#function_st-transform) diferem da seguinte forma:

+ `ST_SRID()` altera o valor de geometria SRID sem transformar suas coordenadas.

+ `ST_Transform()` transforma as coordenadas geométricas além de alterar seu valor SRID.

  ```
  mysql> SET @p = ST_GeomFromText('POINT(52.381389 13.064444)', 4326);
  mysql> SELECT ST_AsText(@p);
  +----------------------------+
  | ST_AsText(@p)              |
  +----------------------------+
  | POINT(52.381389 13.064444) |
  +----------------------------+
  mysql> SET @p = ST_Transform(@p, 4230);
  mysql> SELECT ST_AsText(@p);
  +---------------------------------------------+
  | ST_AsText(@p)                               |
  +---------------------------------------------+
  | POINT(52.38208611407426 13.065520672345304) |
  +---------------------------------------------+
  ```

* `ST_Union(g1, g2)`(spatial-operator-functions.html#function_st-union)

Retorna uma geometria que representa a união do conjunto de valores de geometria *`g1`* e *`g2`*. O resultado está no mesmo SRS que os argumentos de geometria.

A partir do MySQL 8.0.26, `ST_Union()` permite argumentos em um SRS cartesiano ou em um SRS geográfico. Antes do MySQL 8.0.26, `ST_Union()` permite argumentos em um SRS cartesiano apenas; para argumentos em um SRS geográfico, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

`ST_Union()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g1 = ST_GeomFromText('LineString(1 1, 3 3)');
  mysql> SET @g2 = ST_GeomFromText('LineString(1 3, 3 1)');
  mysql> SELECT ST_AsText(ST_Union(@g1, @g2));
  +--------------------------------------+
  | ST_AsText(ST_Union(@g1, @g2))        |
  +--------------------------------------+
  | MULTILINESTRING((1 1,3 3),(1 3,3 1)) |
  +--------------------------------------+
  ```

### 14.16.9 Funções que testam relações espaciais entre objetos geométricos

As funções descritas nesta seção recebem duas geometrias como argumentos e retornam uma relação qualitativa ou quantitativa entre elas.

O MySQL implementa dois conjuntos de funções usando nomes de funções definidos pela especificação OpenGIS. Um conjunto testa a relação entre dois valores de geometria usando formas de objetos precisas, o outro conjunto usa retângulos mínimos de delimitação de objetos (MBRs).

#### 14.16.9.1 Funções de Relação Espacial que Utilizam Formas de Objeto

A especificação OpenGIS define as seguintes funções para testar a relação entre dois valores de geometria *`g1`* e *`g2`*, utilizando formas de objetos precisas. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente, exceto que as funções de distância retornam valores de distância.

As funções desta seção detectam argumentos em sistemas de referência espaciais cartesianos ou geográficos (SRS), e retornam resultados adequados ao SRS.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL` ou qualquer argumento de geometria for uma geometria vazia, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

* Para funções que aceitam múltiplos argumentos de geometria, se esses argumentos não estiverem no mesmo SRS, ocorre um erro `ER_GIS_DIFFERENT_SRIDS`.

* Se qualquer argumento geométrico for geometricamente inválido, o resultado é verdadeiro ou falso (não é definido qual), ou ocorre um erro.

* Para argumentos de geometria SRS geográfica, se algum argumento tiver uma longitude ou latitude fora do intervalo, ocorre um erro:

+ Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

+ Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

As faixas mostradas são em graus. Se um SRS usa outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa diferem ligeiramente devido à aritmética de ponto flutuante.

* Caso contrário, o valor de retorno não é `NULL`.

Algumas funções nesta seção permitem um argumento de unidade que especifica a unidade de comprimento para o valor de retorno. A menos que especificado de outra forma, as funções tratam seu argumento de unidade da seguinte forma:

* Uma unidade é suportada se for encontrada na tabela `INFORMATION_SCHEMA` `ST_UNITS_OF_MEASURE`. Veja a Seção 28.3.37, “A tabela INFORMATION_SCHEMA ST_UNITS_OF_MEASURE”.

* Se uma unidade for especificada, mas não é suportada pelo MySQL, ocorre um erro `ER_UNIT_NOT_FOUND`.

* Se uma unidade linear compatível for especificada e o SRID for 0, ocorre um erro `ER_GEOMETRY_IN_UNKNOWN_LENGTH_UNIT`.

* Se uma unidade linear compatível for especificada e o SRID não for 0, o resultado será nessa unidade.

* Se uma unidade não for especificada, o resultado é na unidade do SRS das geometrias, seja cartesiano ou geográfico. Atualmente, todos os SRSs do MySQL são expressos em metros.

Essas funções de forma de objeto estão disponíveis para testar relações de geometria:

* `ST_Contains(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-contains)

Devolve 1 ou 0 para indicar se *`g1`* contém completamente *`g2`* (o que significa que *`g1`* e *`g2`* não devem se sobrepor). Esta relação é o inverso daquela testada por `ST_Within()`.

`ST_Contains()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->     @p1 = ST_GeomFromText('Point(1 1)'),
      ->     @p2 = ST_GeomFromText('Point(3 3)'),
      ->     @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   ST_Contains(@g1, @p1), ST_Within(@p1, @g1),
      ->   ST_Disjoint(@g1, @p1), ST_Intersects(@g1, @p1)\G
  *************************** 1. row ***************************
    ST_Contains(@g1, @p1): 1
      ST_Within(@p1, @g1): 1
    ST_Disjoint(@g1, @p1): 0
  ST_Intersects(@g1, @p1): 1
  1 row in set (0.00 sec)

  mysql> SELECT
      ->   ST_Contains(@g1, @p2), ST_Within(@p2, @g1),
      ->   ST_Disjoint(@g1, @p2), ST_Intersects(@g1, @p2)\G
  *************************** 1. row ***************************
    ST_Contains(@g1, @p2): 0
      ST_Within(@p2, @g1): 0
    ST_Disjoint(@g1, @p2): 0
  ST_Intersects(@g1, @p2): 1
  1 row in set (0.00 sec)

  mysql>
      -> SELECT
      ->   ST_Contains(@g1, @p3), ST_Within(@p3, @g1),
      ->   ST_Disjoint(@g1, @p3), ST_Intersects(@g1, @p3)\G
  *************************** 1. row ***************************
    ST_Contains(@g1, @p3): 0
      ST_Within(@p3, @g1): 0
    ST_Disjoint(@g1, @p3): 1
  ST_Intersects(@g1, @p3): 0
  1 row in set (0.00 sec)
  ```

* `ST_Crosses(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-crosses)

Duas geometrias são *espacialmente cruzadas* se sua relação espacial possui as seguintes propriedades:

+ A menos que *`g1`* e *`g2`* tenham ambos a dimensão 1: *`g1`* cruza *`g2`* se o interior de *`g2`* tiver pontos em comum com o interior de *`g1`*, mas *`g2`* não cubra todo o interior de *`g1`*.

+ Se tanto *`g1`* quanto *`g2`* tiverem dimensão 1: Se as linhas se cruzarem em um número finito de pontos (ou seja, sem segmentos de linha comuns, apenas pontos comuns).

Essa função retorna 1 ou 0 para indicar se *`g1`* cruza espacialmente *`g2`*.

`ST_Crosses()` lida com seus argumentos conforme descrito na introdução desta seção, exceto que o valor de retorno é `NULL` para essas condições adicionais:

+ *`g1`* tem dimensão 2 (`Polygon` ou `MultiPolygon`).

+ *`g2`* tem dimensão 1 (`Point` ou `MultiPoint`).

* `ST_Disjoint(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-disjoint)

Retorna 1 ou 0 para indicar se *`g1`* é espacialmente disjuntado (não intersecta) *`g2`*.

`ST_Disjoint()` lida com seus argumentos conforme descrito na introdução desta seção.

* `ST_Distance(g1, g2 [, unit])`(spatial-relation-functions-object-shapes.html#function_st-distance)

Retorna a distância entre *`g1`* e *`g2`*, medida na unidade de comprimento do sistema de referência espacial (SRS) dos argumentos de geometria, ou na unidade do argumento opcional *`unit`* se este for especificado.

Essa função processa coleções de geometria, retornando a menor distância entre todas as combinações dos componentes dos dois argumentos de geometria.

`ST_Distance()` trata seus argumentos de geometria conforme descrito na introdução desta seção, com essas exceções:

+ `ST_Distance()` detecta argumentos em um sistema de referência espacial geográfico (elíptico) e retorna a distância geodésica no elipsoide. A partir do MySQL 8.0.18, `ST_Distance()` suporta cálculos de distância para argumentos de SRS geográficos de todos os tipos de geometria. Antes do MySQL 8.0.18, os únicos tipos de argumento geográficos permitidos são `Point` e `Point`, ou `Point` e `MultiPoint` (em qualquer ordem de argumento). Se chamado com outras combinações de argumentos de tipos de geometria em um SRS geográfico, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

+ Se qualquer argumento for geometricamente inválido, o resultado é uma distância indefinida (ou seja, pode ser qualquer número) ou ocorre um erro.

+ Se um resultado intermediário ou final produzir `NaN` ou um número negativo, ocorre um erro `ER_GIS_INVALID_DATA`.

A partir do MySQL 8.0.14, `ST_Distance()` permite um argumento opcional *`unit`* que especifica a unidade linear para o valor de distância retornado. `ST_Distance()` lida com seu argumento *`unit`* conforme descrito na introdução desta seção.

  ```
  mysql> SET @g1 = ST_GeomFromText('POINT(1 1)');
  mysql> SET @g2 = ST_GeomFromText('POINT(2 2)');
  mysql> SELECT ST_Distance(@g1, @g2);
  +-----------------------+
  | ST_Distance(@g1, @g2) |
  +-----------------------+
  |    1.4142135623730951 |
  +-----------------------+

  mysql> SET @g1 = ST_GeomFromText('POINT(1 1)', 4326);
  mysql> SET @g2 = ST_GeomFromText('POINT(2 2)', 4326);
  mysql> SELECT ST_Distance(@g1, @g2);
  +-----------------------+
  | ST_Distance(@g1, @g2) |
  +-----------------------+
  |     156874.3859490455 |
  +-----------------------+
  mysql> SELECT ST_Distance(@g1, @g2, 'metre');
  +--------------------------------+
  | ST_Distance(@g1, @g2, 'metre') |
  +--------------------------------+
  |              156874.3859490455 |
  +--------------------------------+
  mysql> SELECT ST_Distance(@g1, @g2, 'foot');
  +-------------------------------+
  | ST_Distance(@g1, @g2, 'foot') |
  +-------------------------------+
  |             514679.7439273146 |
  +-------------------------------+
  ```

Para o caso especial de cálculos de distância em uma esfera, consulte a função `ST_Distance_Sphere()`.

* `ST_Equals(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-equals)

Retorna 1 ou 0 para indicar se *`g1`* é espacialmente igual a *`g2`*.

`ST_Equals()` lida com seus argumentos conforme descrito na introdução desta seção, exceto que ele não retorna `NULL` para argumentos de geometria vazia.

  ```
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_Equals(@g1, @g1), ST_Equals(@g1, @g2);
  +---------------------+---------------------+
  | ST_Equals(@g1, @g1) | ST_Equals(@g1, @g2) |
  +---------------------+---------------------+
  |                   1 |                   0 |
  +---------------------+---------------------+
  ```

* `ST_FrechetDistance(g1, g2 [, unit])`(spatial-relation-functions-object-shapes.html#function_st-frechetdistance)

Retorna a distância discreta de Fréchet entre duas geometrias, refletindo quão semelhantes as geometrias são. O resultado é um número de dupla precisão medido na unidade de comprimento do sistema de referência espacial (SRS) dos argumentos da geometria, ou na unidade de comprimento do argumento *`unit`* se esse argumento for fornecido.

Essa função implementa a distância discreta de Fréchet, o que significa que ela é restrita a distâncias entre os pontos das geometrias. Por exemplo, dados dois argumentos `LineString`, apenas os pontos explicitamente mencionados nas geometrias são considerados. Os pontos nos segmentos de linha entre esses pontos não são considerados.

`ST_FrechetDistance()` trata seus argumentos de geometria conforme descrito na introdução desta seção, com essas exceções:

+ As geometrias podem ter um SRS cartesiano ou geográfico, mas apenas os valores `LineString` são suportados. Se os argumentos estiverem no mesmo SRS cartesiano ou geográfico, mas nenhum deles for um `LineString`, `ER_NOT_IMPLEMENTED_FOR_CARTESIAN_SRS` ou `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`, ocorrerá um erro, dependendo do tipo de SRS.

`ST_FrechetDistance()` lida com seu argumento opcional *`unit`* conforme descrito na introdução desta seção.

  ```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)');
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 1,0 6,3 3,5 6)');
  mysql> SELECT ST_FrechetDistance(@ls1, @ls2);
  +--------------------------------+
  | ST_FrechetDistance(@ls1, @ls2) |
  +--------------------------------+
  |             2.8284271247461903 |
  +--------------------------------+

  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)', 4326);
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 1,0 6,3 3,5 6)', 4326);
  mysql> SELECT ST_FrechetDistance(@ls1, @ls2);
  +--------------------------------+
  | ST_FrechetDistance(@ls1, @ls2) |
  +--------------------------------+
  |              313421.1999416798 |
  +--------------------------------+
  mysql> SELECT ST_FrechetDistance(@ls1, @ls2, 'foot');
  +----------------------------------------+
  | ST_FrechetDistance(@ls1, @ls2, 'foot') |
  +----------------------------------------+
  |                     1028284.7767115477 |
  +----------------------------------------+
  ```

Essa função foi adicionada no MySQL 8.0.23.

* `ST_HausdorffDistance(g1, g2 [, unit])`(spatial-relation-functions-object-shapes.html#function_st-hausdorffdistance)

Retorna a distância discreta de Hausdorff entre duas geometrias, refletindo quão semelhantes as geometrias são. O resultado é um número de dupla precisão medido na unidade de comprimento do sistema de referência espacial (SRS) dos argumentos de geometria, ou na unidade de comprimento do argumento *`unit`* se esse argumento for fornecido.

Essa função implementa a distância discreta de Hausdorff, o que significa que ela é restrita a distâncias entre os pontos das geometrias. Por exemplo, dados dois argumentos `LineString`, apenas os pontos explicitamente mencionados nas geometrias são considerados. Os pontos nos segmentos de linha entre esses pontos não são considerados.

`ST_HausdorffDistance()` trata seus argumentos de geometria conforme descrito na introdução desta seção, com essas exceções:

+ Se os argumentos de geometria estiverem no mesmo SRS cartesiano ou geográfico, mas não em uma combinação compatível, ocorrerá um erro `ER_NOT_IMPLEMENTED_FOR_CARTESIAN_SRS` ou `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`, dependendo do tipo de SRS. Essas combinações são compatíveis:

- `LineString` e `LineString`

- `Point` e `MultiPoint`

- `LineString` e `MultiLineString`

- `MultiPoint` e `MultiPoint`

- `MultiLineString` e `MultiLineString`

`ST_HausdorffDistance()` lida com seu argumento opcional *`unit`* conforme descrito na introdução desta seção.

  ```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)');
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 1,0 6,3 3,5 6)');
  mysql> SELECT ST_HausdorffDistance(@ls1, @ls2);
  +----------------------------------+
  | ST_HausdorffDistance(@ls1, @ls2) |
  +----------------------------------+
  |                                1 |
  +----------------------------------+

  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)', 4326);
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 1,0 6,3 3,5 6)', 4326);
  mysql> SELECT ST_HausdorffDistance(@ls1, @ls2);
  +----------------------------------+
  | ST_HausdorffDistance(@ls1, @ls2) |
  +----------------------------------+
  |               111319.49079326246 |
  +----------------------------------+
  mysql> SELECT ST_HausdorffDistance(@ls1, @ls2, 'foot');
  +------------------------------------------+
  | ST_HausdorffDistance(@ls1, @ls2, 'foot') |
  +------------------------------------------+
  |                        365221.4264870815 |
  +------------------------------------------+
  ```

Essa função foi adicionada no MySQL 8.0.23.

* `ST_Intersects(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-intersects)

Retorna 1 ou 0 para indicar se *`g1`* intersecta espacialmente *`g2`*.

`ST_Intersects()` lida com seus argumentos conforme descrito na introdução desta seção.

* `ST_Overlaps(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-overlaps)

Duas geometrias *se sobrepõem espacialmente* se elas se intersectam e sua intersecção resulta em uma geometria da mesma dimensão, mas não igual a nenhuma das geometrias dadas.

Essa função retorna 1 ou 0 para indicar se *`g1`* sobrepõe-se espacialmente a *`g2`*.

`ST_Overlaps()` lida com seus argumentos conforme descrito na introdução desta seção, exceto pelo fato de que o valor de retorno é `NULL` para a condição adicional de que as dimensões das duas geometrias não são iguais.

* `ST_Touches(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-touches)

Duas geometrias *tocam-se espacialmente* se seus interiores não se intersectam, mas a borda de uma das geometrias intersecta a borda ou o interior da outra.

Essa função retorna 1 ou 0 para indicar se *`g1`* toca espacialmente *`g2`*.

`ST_Touches()` lida com seus argumentos conforme descrito na introdução desta seção, exceto pelo fato de que o valor de retorno é `NULL` para a condição adicional de que ambas as geometrias tenham dimensão 0 (`Point` ou `MultiPoint`).

* `ST_Within(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-within)

Devolve 1 ou 0 para indicar se *`g1`* está espacialmente dentro de *`g2`*. Este teste a relação oposta como `ST_Contains()`.

`ST_Within()` lida com seus argumentos conforme descrito na introdução desta seção.

#### 14.16.9.2 Funções de Relação Espacial que Utilizam Rectângulos Mínimos de Limiteamento
#### 14.16.9.3 Funções de Relação Espacial que Utilizam Rectângulos Mínimos de Limiteamento em Conjuntos de Dados
#### 14.16.9.4 Funções de Relação Espacial que Utilizam Rectângulos Mínimos de Limiteamento em Conjuntos de Dados com Relações de Relação
#### 14.16.9.5 Funções de Relação Espacial que Utilizam Rectângulos Mínimos de Limiteamento em Conjuntos de Dados com Relações de Relação e Relações de Relação com Relações de Relação
#### 14.16.9.6 Funções de Relação Espacial que Utilizam Rectângulos Mínimos de Limiteamento em Conjuntos de Dados com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação
#### 14.16.9.7 Funções de Relação Espacial que Utilizam Rectângulos Mínimos de Limiteamento em Conjuntos de Dados com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação e Relações de Relação com Relações de Relação

O MySQL oferece várias funções específicas do MySQL que testam a relação entre os retângulos de delimitação mínima (MBRs) de duas geotecnias *`g1`* e *`g2`*. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente.

A caixa delimitadora de um ponto é interpretada como um ponto que é tanto limite quanto interior.

A caixa delimitadora de uma linha reta horizontal ou vertical é interpretada como uma linha onde o interior da linha também é limite. Os pontos finais são pontos de limite.

Se algum dos parâmetros for uma coleção de geometria, o interior, a borda e o exterior desses parâmetros são os da união de todos os elementos da coleção.

As funções desta seção detectam argumentos em sistemas de referência espaciais cartesianos ou geográficos (SRS), e retornam resultados adequados ao SRS.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

* Para funções que aceitam múltiplos argumentos de geometria, se esses argumentos não estiverem no mesmo SRS, ocorre um erro `ER_GIS_DIFFERENT_SRIDS`.

* Se qualquer argumento for geometricamente inválido, o resultado é verdadeiro ou falso (não é definido qual), ou ocorre um erro.

* Para argumentos de geometria SRS geográfica, se algum argumento tiver uma longitude ou latitude fora do intervalo, ocorre um erro:

+ Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

+ Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

As faixas mostradas são em graus. Se um SRS usa outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa diferem ligeiramente devido à aritmética de ponto flutuante.

* Caso contrário, o valor de retorno não é `NULL`.

Essas funções do MBR estão disponíveis para testar relações geométricas:

* `MBRContains(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrcontains)

Devolve 1 ou 0 para indicar se o retângulo mínimo de delimitação de *`g1`* contém o retângulo mínimo de delimitação de *`g2`*. Este teste a relação oposta como `MBRWithin()`.

`MBRContains()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @g3 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))'),
      ->   @g4 = ST_GeomFromText('Polygon((5 5,5 10,10 10,10 5,5 5))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)');
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBRContains(@g1, @g2), MBRContains(@g1, @g4),
      ->   MBRContains(@g2, @g1), MBRContains(@g2, @g4),
      ->   MBRContains(@g2, @g3), MBRContains(@g3, @g4),
      ->   MBRContains(@g3, @g1), MBRContains(@g1, @g3),
      ->   MBRContains(@g1, @p1), MBRContains(@p1, @g1),
      ->   MBRContains(@g1, @p1), MBRContains(@p1, @g1),
      ->   MBRContains(@g2, @p2), MBRContains(@g2, @p3),
      ->   MBRContains(@g3, @p1), MBRContains(@g3, @p2),
      ->   MBRContains(@g3, @p3), MBRContains(@g4, @p1),
      ->   MBRContains(@g4, @p2), MBRContains(@g4, @p3)\G
  *************************** 1. row ***************************
  MBRContains(@g1, @g2): 1
  MBRContains(@g1, @g4): 0
  MBRContains(@g2, @g1): 0
  MBRContains(@g2, @g4): 0
  MBRContains(@g2, @g3): 0
  MBRContains(@g3, @g4): 0
  MBRContains(@g3, @g1): 1
  MBRContains(@g1, @g3): 0
  MBRContains(@g1, @p1): 1
  MBRContains(@p1, @g1): 0
  MBRContains(@g1, @p1): 1
  MBRContains(@p1, @g1): 0
  MBRContains(@g2, @p2): 0
  MBRContains(@g2, @p3): 0
  MBRContains(@g3, @p1): 1
  MBRContains(@g3, @p2): 1
  MBRContains(@g3, @p3): 0
  MBRContains(@g4, @p1): 0
  MBRContains(@g4, @p2): 0
  MBRContains(@g4, @p3): 0
  1 row in set (0.00 sec)
  ```

* `MBRCoveredBy(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrcoveredby)

Retorna 1 ou 0 para indicar se o retângulo mínimo de delimitação de *`g1`* está coberto pelo retângulo mínimo de delimitação de *`g2`*. Este teste a relação oposta como `MBRCovers()`.

`MBRCoveredBy()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
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

Veja a descrição da função `MBRCovers()` para exemplos adicionais.

* `MBRCovers(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrcovers)

Devolve 1 ou 0 para indicar se o retângulo mínimo de delimitação de *`g1`* cobre o retângulo mínimo de delimitação de *`g2`*. Este teste a relação oposta como `MBRCoveredBy()`. Consulte a descrição de `MBRCoveredBy()` para exemplos adicionais.

`MBRCovers()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)'),
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.02 sec)

  mysql> SELECT
      ->   MBRCovers(@g1, @p1), MBRCovers(@g1, @p2),
      ->   MBRCovers(@g1, @g2), MBRCovers(@g1, @p3)\G
  *************************** 1. row ***************************
  MBRCovers(@g1, @p1): 1
  MBRCovers(@g1, @p2): 1
  MBRCovers(@g1, @g2): 1
  MBRCovers(@g1, @p3): 0
  1 row in set (0.00 sec)
  ```

* `MBRDisjoint(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrdisjoint)

Retorna 1 ou 0 para indicar se os retângulos mínimos de delimitação das duas geometrias *`g1`* e *`g2`* são disjuntos (não se intersectam).

`MBRDisjoint()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @g3 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))'),
      ->   @g4 = ST_GeomFromText('Polygon((5 5,5 10,10 10,10 5,5 5))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)'),
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBRDisjoint(@g1, @g4), MBRDisjoint(@g2, @g4),
      ->   MBRDisjoint(@g3, @g4), MBRDisjoint(@g4, @g4),
      ->   MBRDisjoint(@g1, @p1), MBRDisjoint(@g1, @p2),
      ->   MBRDisjoint(@g1, @p3)\G
  *************************** 1. row ***************************
  MBRDisjoint(@g1, @g4): 1
  MBRDisjoint(@g2, @g4): 1
  MBRDisjoint(@g3, @g4): 0
  MBRDisjoint(@g4, @g4): 0
  MBRDisjoint(@g1, @p1): 0
  MBRDisjoint(@g1, @p2): 0
  MBRDisjoint(@g1, @p3): 1
  1 row in set (0.00 sec)
  ```

* `MBREquals(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrequals)

Retorna 1 ou 0 para indicar se os retângulos mínimos de delimitação das duas geometrias *`g1`* e *`g2`* são os mesmos.

`MBREquals()` lida com seus argumentos conforme descrito na introdução desta seção, exceto que ele não retorna `NULL` para argumentos de geometria vazia.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)'),
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBREquals(@g1, @g1), MBREquals(@g1, @g2),
      ->   MBREquals(@g1, @p1), MBREquals(@g1, @p2), MBREquals(@g2, @g2),
      ->   MBREquals(@p1, @p1), MBREquals(@p1, @p2), MBREquals(@p2, @p2)\G
  *************************** 1. row ***************************
  MBREquals(@g1, @g1): 1
  MBREquals(@g1, @g2): 0
  MBREquals(@g1, @p1): 0
  MBREquals(@g1, @p2): 0
  MBREquals(@g2, @g2): 1
  MBREquals(@p1, @p1): 1
  MBREquals(@p1, @p2): 0
  MBREquals(@p2, @p2): 1
  1 row in set (0.00 sec)
  ```

* `MBRIntersects(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrintersects)

Retorna 1 ou 0 para indicar se os retângulos mínimos de delimitação das duas geometrias *`g1`* e *`g2`* se intersectam.

`MBRIntersects()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @g3 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))'),
      ->   @g4 = ST_GeomFromText('Polygon((5 5,5 10,10 10,10 5,5 5))'),
      ->   @g5 = ST_GeomFromText('Polygon((2 2,2 8,8 8,8 2,2 2))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)'),
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBRIntersects(@g1, @g1), MBRIntersects(@g1, @g2),
      ->   MBRIntersects(@g1, @g3), MBRIntersects(@g1, @g4), MBRIntersects(@g1, @g5),
      ->   MBRIntersects(@g1, @p1), MBRIntersects(@g1, @p2), MBRIntersects(@g1, @p3),
      ->   MBRIntersects(@g2, @p1), MBRIntersects(@g2, @p2), MBRIntersects(@g2, @p3)\G
  *************************** 1. row ***************************
  MBRIntersects(@g1, @g1): 1
  MBRIntersects(@g1, @g2): 1
  MBRIntersects(@g1, @g3): 1
  MBRIntersects(@g1, @g4): 0
  MBRIntersects(@g1, @g5): 1
  MBRIntersects(@g1, @p1): 1
  MBRIntersects(@g1, @p2): 1
  MBRIntersects(@g1, @p3): 0
  MBRIntersects(@g2, @p1): 1
  MBRIntersects(@g2, @p2): 0
  MBRIntersects(@g2, @p3): 0
  1 row in set (0.00 sec)
  ```

* `MBROverlaps(g1, g2)`(spatial-relation-functions-mbr.html#function_mbroverlaps)

Duas geometrias *se sobrepõem espacialmente* se elas se intersectam e sua intersecção resulta em uma geometria da mesma dimensão, mas não igual a nenhuma das geometrias dadas.

Essa função retorna 1 ou 0 para indicar se os retângulos de contorno mínimo das duas geometrias *`g1`* e *`g2`* se sobrepõem.

`MBROverlaps()` lida com seus argumentos conforme descrito na introdução desta seção.

* `MBRTouches(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrtouches)

Duas geometrias *tocam-se espacialmente* se seus interiores não se intersectam, mas a borda de uma das geometrias intersecta a borda ou o interior da outra.

Essa função retorna 1 ou 0 para indicar se os retângulos de contorno mínimo das duas geometrias *`g1`* e *`g2`* se tocam.

`MBRTouches()` lida com seus argumentos conforme descrito na introdução desta seção.

* `MBRWithin(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrwithin)

Devolve 1 ou 0 para indicar se o retângulo mínimo de delimitação de *`g1`* está dentro do retângulo mínimo de delimitação de *`g2`*. Este teste a relação oposta como `MBRContains()`.

`MBRWithin()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @g3 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))'),
      ->   @g4 = ST_GeomFromText('Polygon((5 5,5 10,10 10,10 5,5 5))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)');
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBRWithin(@g1, @g2), MBRWithin(@g1, @g4),
      ->   MBRWithin(@g2, @g1), MBRWithin(@g2, @g4),
      ->   MBRWithin(@g2, @g3), MBRWithin(@g3, @g4),
      ->   MBRWithin(@g1, @p1), MBRWithin(@p1, @g1),
      ->   MBRWithin(@g1, @p1), MBRWithin(@p1, @g1),
      ->   MBRWithin(@g2, @p2), MBRWithin(@g2, @p3)\G
  *************************** 1. row ***************************
  MBRWithin(@g1, @g2): 0
  MBRWithin(@g1, @g4): 0
  MBRWithin(@g2, @g1): 1
  MBRWithin(@g2, @g4): 0
  MBRWithin(@g2, @g3): 1
  MBRWithin(@g3, @g4): 0
  MBRWithin(@g1, @p1): 0
  MBRWithin(@p1, @g1): 1
  MBRWithin(@g1, @p1): 0
  MBRWithin(@p1, @g1): 1
  MBRWithin(@g2, @p2): 0
  MBRWithin(@g2, @p3): 0
  1 row in set (0.00 sec)
  ```

### 14.16.10 Funções de Geohash Espaciais

Geohash é um sistema para codificar coordenadas de latitude e longitude de precisão arbitrária em uma string de texto. Os valores Geohash são strings que contêm apenas caracteres escolhidos de `"0123456789bcdefghjkmnpqrstuvwxyz"`.

As funções desta seção permitem a manipulação de valores geohash, o que fornece às aplicações a capacidade de importar e exportar dados geohash e de indexar e pesquisar valores geohash.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

* Se qualquer argumento for inválido, ocorrerá um erro.
* Se qualquer argumento tiver uma longitude ou latitude fora do intervalo, ocorrerá um erro:

+ Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

+ Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

As faixas mostradas são em graus. Os limites exatos das faixas variam ligeiramente devido à aritmética de ponto flutuante.

* Se qualquer argumento de ponto não tiver SRID 0 ou 4326, ocorre um erro `ER_SRS_NOT_FOUND`. *`point`* A validade do argumento SRID não é verificada.

* Se qualquer argumento SRID se referir a um sistema de referência espacial não definido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

* Se qualquer argumento SRID não estiver dentro do intervalo de um inteiro sem sinal de 32 bits, ocorre um erro `ER_DATA_OUT_OF_RANGE`.

* Caso contrário, o valor de retorno não é `NULL`.

Essas funções geohash estão disponíveis:

* `ST_GeoHash(longitude, latitude, max_length)`(spatial-geohash-functions.html#function_st-geohash), `ST_GeoHash(point, max_length)`(spatial-geohash-functions.html#function_st-geohash)

Retorna uma string de geohash no conjunto de caracteres de conexão e na ordenação.

Para a primeira sintaxe, o *`longitude`* deve ser um número no intervalo [−180, 180], e o *`latitude`* deve ser um número no intervalo [−90, 90]. Para a segunda sintaxe, é necessário um valor de `POINT`, onde as coordenadas X e Y estão nos intervalos válidos para longitude e latitude, respectivamente.

A string resultante não tem mais do que *`max_length`* caracteres, que tem um limite máximo de 100. A string pode ser mais curta do que *`max_length`* caracteres porque o algoritmo que cria o valor geohash continua até criar uma string que seja uma representação exata da localização ou *`max_length`* caracteres, o que vier primeiro.

`ST_GeoHash()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SELECT ST_GeoHash(180,0,10), ST_GeoHash(-180,-90,15);
  +----------------------+-------------------------+
  | ST_GeoHash(180,0,10) | ST_GeoHash(-180,-90,15) |
  +----------------------+-------------------------+
  | xbpbpbpbpb           | 000000000000000         |
  +----------------------+-------------------------+
  ```

* `ST_LatFromGeoHash(geohash_str)`

Retorna a latitude de um valor de cadeia de geohash, como um número de precisão dupla no intervalo [-90, 90].

A função de decodificação `ST_LatFromGeoHash()` não lê mais do que 433 caracteres do argumento *`geohash_str`*. Isso representa o limite superior de informações na representação interna dos valores de coordenadas. Os caracteres além do 433º são ignorados, mesmo que sejam ilegais e produzam um erro.

`ST_LatFromGeoHash()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SELECT ST_LatFromGeoHash(ST_GeoHash(45,-20,10));
  +------------------------------------------+
  | ST_LatFromGeoHash(ST_GeoHash(45,-20,10)) |
  +------------------------------------------+
  |                                      -20 |
  +------------------------------------------+
  ```

* `ST_LongFromGeoHash(geohash_str)`

Retorna a longitude de um valor de cadeia de geohash, como um número de precisão dupla no intervalo [-180, 180].

As observações na descrição de `ST_LatFromGeoHash()` em relação ao número máximo de caracteres processados a partir do argumento *`geohash_str`* também se aplicam a `ST_LongFromGeoHash()`.

`ST_LongFromGeoHash()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SELECT ST_LongFromGeoHash(ST_GeoHash(45,-20,10));
  +-------------------------------------------+
  | ST_LongFromGeoHash(ST_GeoHash(45,-20,10)) |
  +-------------------------------------------+
  |                                        45 |
  +-------------------------------------------+
  ```

* `ST_PointFromGeoHash(geohash_str, srid)`(spatial-geohash-functions.html#function_st-pointfromgeohash)

Retorna um valor `POINT` contendo o valor geohash decodificado, dado um valor de cadeia de geohash.

As coordenadas X e Y do ponto são a longitude na faixa de [−180, 180] e a latitude na faixa de [−90, 90], respectivamente.

O argumento *`srid`* é um inteiro sem sinal de 32 bits.

As observações na descrição de `ST_LatFromGeoHash()` sobre o número máximo de caracteres processados a partir do argumento *`geohash_str`* também se aplicam a `ST_PointFromGeoHash()`.

`ST_PointFromGeoHash()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @gh = ST_GeoHash(45,-20,10);
  mysql> SELECT ST_AsText(ST_PointFromGeoHash(@gh,0));
  +---------------------------------------+
  | ST_AsText(ST_PointFromGeoHash(@gh,0)) |
  +---------------------------------------+
  | POINT(45 -20)                         |
  +---------------------------------------+
  ```

### 14.16.11 Funções GeoJSON Espaciais

Esta seção descreve funções para a conversão entre documentos GeoJSON e valores espaciais. O GeoJSON é um padrão aberto para codificação de características geométricas/geográficas. Para mais informações, consulte <http://geojson.org>. As funções discutidas aqui seguem a revisão da especificação GeoJSON 1.0.

O GeoJSON suporta os mesmos tipos de dados geométricos/geográficos que o MySQL suporta. Os objetos Feature e FeatureCollection não são suportados, exceto que os objetos de geometria são extraídos deles. O suporte ao CRS é limitado a valores que identificam um SRID.

O MySQL também suporta um tipo de dados nativo `JSON` e um conjunto de funções SQL para permitir operações em valores JSON. Para mais informações, consulte a Seção 13.5, “O tipo de dados JSON”, e a Seção 14.17, “Funções JSON”.

* `ST_AsGeoJSON(g [, max_dec_digits [, options]])`(spatial-geojson-functions.html#function_st-asgeojson)

Gera um objeto GeoJSON a partir da geometria *[[`g`]*. A string do objeto tem o conjunto de caracteres de conexão e a correção de caracteres.

Se qualquer argumento for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento que não seja `NULL` for inválido, ocorre um erro.

*`max_dec_digits`*, se especificado, limita o número de dígitos decimais para as coordenadas e faz com que o resultado seja arredondado. Se não especificado, este argumento tem como padrão seu valor máximo de 232 −

1. O mínimo é 0.

*`options`*, se especificado, é uma máscara de bits. O seguinte quadro mostra os valores de sinalizador permitidos. Se o argumento de geometria tiver um SRID de 0, nenhum objeto de CRS é produzido, mesmo para aqueles valores de sinalizador que o solicitam.

  <table summary="Option flags for the ST_AsGeoJSON() function."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Flag Value</th> <th>Significado</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem opções. Isso é o padrão se<em class="replaceable"><code>options</code></em>não é especificado.</td> </tr><tr> <td>1</td> <td>Adicione uma caixa de delimitação à saída.</td> </tr><tr> <td>2</td> <td>Adicione um URN de CRS de formato curto à saída. O formato padrão é um formato curto (<code>EPSG:<em class="replaceable"><code>srid</code></em></code>).</td> </tr><tr> <td>4</td> <td>Adicione um URN de CRS de formato longo (<code>urn:ogc:def:crs:EPSG::<em class="replaceable"><code>srid</code></em></code>). Essa bandeira substitui a bandeira 2. Por exemplo, os valores das opções 5 e 7 significam o mesmo (adicionar uma caixa de delimitação e um URN de CRS de formato longo).</td> </tr></tbody></table>

  ```
  mysql> SELECT ST_AsGeoJSON(ST_GeomFromText('POINT(11.11111 12.22222)'),2);
  +-------------------------------------------------------------+
  | ST_AsGeoJSON(ST_GeomFromText('POINT(11.11111 12.22222)'),2) |
  +-------------------------------------------------------------+
  | {"type": "Point", "coordinates": [11.11, 12.22]}            |
  +-------------------------------------------------------------+
  ```

* `ST_GeomFromGeoJSON(str [, options [, srid]])`(spatial-geojson-functions.html#function_st-geomfromgeojson)

Analisa uma string *`str`* que representa um objeto GeoJSON e retorna uma geometria.

Se qualquer argumento for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento que não seja `NULL` for inválido, ocorre um erro.

*`options`*, se fornecido, descreve como lidar com documentos GeoJSON que contêm geometrias com dimensões de coordenadas superiores a 2. A tabela a seguir mostra os valores permitidos de *`options`*.

  <table summary="Option flags for the ST_GeomFromGeoJSON() function."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Option Value</th> <th>Significado</th> </tr></thead><tbody><tr> <td>1</td> <td>Rejeite o documento e produza um erro. Isso é o padrão se<em class="replaceable"><code>options</code></em>não é especificado.</td> </tr><tr> <td>2, 3, 4</td> <td>Aceite o documento e elimine as coordenadas para obter dimensões de coordenadas mais altas.</td> </tr></tbody></table>

Os valores *`options`* de 2, 3 e 4 atualmente produzem o mesmo efeito. Se as geometrias com dimensões de coordenadas superiores a 2 forem suportadas no futuro, você pode esperar que esses valores produzam efeitos diferentes.

O argumento *`srid`*, se fornecido, deve ser um inteiro sem sinal de 32 bits. Se não for fornecido, o valor de geometria de retorno tem um SRID de 4326.

Se *`srid`* se refere a um sistema de referência espacial não definido (SRS), ocorre um erro de `ER_SRS_NOT_FOUND`.

Para argumentos de geometria SRS geográfica, se algum argumento tiver uma longitude ou latitude fora do intervalo, ocorre um erro:

+ Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro [[`ER_LONGITUDE_OUT_OF_RANGE`].

+ Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_LATITUDE_OUT_OF_RANGE`.

As faixas mostradas são em graus. Se um SRS usa outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa diferem ligeiramente devido à aritmética de ponto flutuante.

Os objetos de geometria, características e coleções de características GeoJSON podem ter uma propriedade `crs`. A função de análise analisa URNs de CRS nomeadas nos namespaces `urn:ogc:def:crs:EPSG::srid` e `EPSG:srid`, mas não CRSs fornecidos como objetos de link. Além disso, `urn:ogc:def:crs:OGC:1.3:CRS84` é reconhecido como SRID 4326. Se um objeto tiver um CRS que não é compreendido, ocorre um erro, com exceção de que, se o argumento opcional *`srid`* for fornecido, qualquer CRS é ignorado, mesmo que seja inválido.

Se um membro `crs` que especifica um SRID diferente do SRID do objeto de nível superior for encontrado em um nível inferior do documento GeoJSON, ocorre um erro `ER_INVALID_GEOJSON_CRS_NOT_TOP_LEVEL`.

Como especificado na especificação GeoJSON, a análise é sensível ao caso para o membro `type` do GeoJSON de entrada (`Point`, `LineString`, e assim por diante). A especificação é silenciosa em relação à sensibilidade ao caso para outras análises, que no MySQL não é sensível ao caso.

Este exemplo mostra o resultado da análise de um objeto GeoJSON simples. Observe que a ordem das coordenadas depende do SRID utilizado.

  ```
  mysql> SET @json = '{ "type": "Point", "coordinates": [102.0, 0.0]}';
  mysql> SELECT ST_AsText(ST_GeomFromGeoJSON(@json));
  +--------------------------------------+
  | ST_AsText(ST_GeomFromGeoJSON(@json)) |
  +--------------------------------------+
  | POINT(0 102)                         |
  +--------------------------------------+
  mysql> SELECT ST_SRID(ST_GeomFromGeoJSON(@json));
  +------------------------------------+
  | ST_SRID(ST_GeomFromGeoJSON(@json)) |
  +------------------------------------+
  |                               4326 |
  +------------------------------------+
  mysql> SELECT ST_AsText(ST_SRID(ST_GeomFromGeoJSON(@json),0));
  +-------------------------------------------------+
  | ST_AsText(ST_SRID(ST_GeomFromGeoJSON(@json),0)) |
  +-------------------------------------------------+
  | POINT(102 0)                                    |
  +-------------------------------------------------+
  ```

### 14.16.12 Funções agregadas espaciais

O MySQL suporta funções agregadas que realizam um cálculo em um conjunto de valores. Para informações gerais sobre essas funções, consulte a Seção 14.19.1, “Descrição das funções agregadas [[`ST_Collect()`]”. Esta seção descreve a função agregada espacial `ST_Collect()`.

`ST_Collect()` pode ser usado como uma função de janela, conforme indicado em sua descrição de sintaxe por `[over_clause]`, representando uma cláusula opcional `OVER`. *`over_clause`* é descrito na Seção 14.20.2, “Conceitos e Sintaxe de Função de Janela”, que também inclui outras informações sobre o uso da função de janela.

* `ST_Collect([DISTINCT] g) [over_clause]`(spatial-aggregate-functions.html#function_st-collect)

Agrupa os valores de geometria e retorna um único valor de coleção de geometria. Com a opção `DISTINCT`, retorna a agregação dos argumentos de geometria distintos.

Assim como outras funções agregadas, `GROUP BY` pode ser usada para agrupar argumentos em subconjuntos. `ST_Collect()` retorna um valor agregado para cada subconjunto.

Essa função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é conforme descrito na Seção 14.20.2, "Conceitos e Sintaxe de Função de Janela". Em contraste com a maioria das funções agregadas que suportam janela, *`ST_Collect()`* permite o uso de *`over_clause`* juntamente com *`DISTINCT`*.

`ST_Collect()` lida com seus argumentos da seguinte forma:

+ Os argumentos `NULL` são ignorados.  
  + Se todos os argumentos forem `NULL` ou o resultado agregado for vazio, o valor de retorno será `NULL`.

+ Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

+ Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

+ Se houver vários argumentos de geometria e esses argumentos estiverem no mesmo SRS, o valor de retorno estará nesse SRS. Se esses argumentos não estiverem no mesmo SRS, ocorrerá um erro `ER_GIS_DIFFERENT_SRIDS_AGGREGATION`.

+ O resultado é o valor mais estreito possível do `MultiXxx` ou `GeometryCollection`, com o tipo de resultado determinado a partir dos argumentos de geometria não `NULL`, conforme descrito a seguir:

- Se todos os argumentos forem valores de `Point`, o resultado será um valor de `MultiPoint`.

- Se todos os argumentos forem valores de `LineString`, o resultado será um valor de `MultiLineString`.

- Se todos os argumentos forem valores de `Polygon`, o resultado será um valor de `MultiPolygon`.

- Caso contrário, os argumentos são uma mistura de tipos de geometria e o resultado é um valor `GeometryCollection`.

Este conjunto de dados exemplificativo mostra produtos hipotéticos por ano e local de fabricação:

  ```
  CREATE TABLE product (
    year INTEGER,
    product VARCHAR(256),
    location Geometry
  );

  INSERT INTO product
  (year,  product,     location) VALUES
  (2000, "Calculator", ST_GeomFromText('point(60 -24)',4326)),
  (2000, "Computer"  , ST_GeomFromText('point(28 -77)',4326)),
  (2000, "Abacus"    , ST_GeomFromText('point(28 -77)',4326)),
  (2000, "TV"        , ST_GeomFromText('point(38  60)',4326)),
  (2001, "Calculator", ST_GeomFromText('point(60 -24)',4326)),
  (2001, "Computer"  , ST_GeomFromText('point(28 -77)',4326));
  ```

Algumas consultas de amostra usando `ST_Collect()` no conjunto de dados:

  ```
  mysql> SELECT ST_AsText(ST_Collect(location)) AS result
         FROM product;
  +------------------------------------------------------------------+
  | result                                                           |
  +------------------------------------------------------------------+
  | MULTIPOINT((60 -24),(28 -77),(28 -77),(38 60),(60 -24),(28 -77)) |
  +------------------------------------------------------------------+

  mysql> SELECT ST_AsText(ST_Collect(DISTINCT location)) AS result
         FROM product;
  +---------------------------------------+
  | result                                |
  +---------------------------------------+
  | MULTIPOINT((60 -24),(28 -77),(38 60)) |
  +---------------------------------------+

  mysql> SELECT year, ST_AsText(ST_Collect(location)) AS result
         FROM product GROUP BY year;
  +------+------------------------------------------------+
  | year | result                                         |
  +------+------------------------------------------------+
  | 2000 | MULTIPOINT((60 -24),(28 -77),(28 -77),(38 60)) |
  | 2001 | MULTIPOINT((60 -24),(28 -77))                  |
  +------+------------------------------------------------+

  mysql> SELECT year, ST_AsText(ST_Collect(DISTINCT location)) AS result
         FROM product GROUP BY year;
  +------+---------------------------------------+
  | year | result                                |
  +------+---------------------------------------+
  | 2000 | MULTIPOINT((60 -24),(28 -77),(38 60)) |
  | 2001 | MULTIPOINT((60 -24),(28 -77))         |
  +------+---------------------------------------+

  # selects nothing
  mysql> SELECT ST_Collect(location) AS result
         FROM product WHERE year = 1999;
  +--------+
  | result |
  +--------+
  | NULL   |
  +--------+

  mysql> SELECT ST_AsText(ST_Collect(location)
           OVER (ORDER BY year, product ROWS BETWEEN 1 PRECEDING AND CURRENT ROW))
           AS result
         FROM product;
  +-------------------------------+
  | result                        |
  +-------------------------------+
  | MULTIPOINT((28 -77))          |
  | MULTIPOINT((28 -77),(60 -24)) |
  | MULTIPOINT((60 -24),(28 -77)) |
  | MULTIPOINT((28 -77),(38 60))  |
  | MULTIPOINT((38 60),(60 -24))  |
  | MULTIPOINT((60 -24),(28 -77)) |
  +-------------------------------+
  ```

Essa função foi adicionada no MySQL 8.0.24.

### 14.16.13 Funções de Conveniência Espacial

As funções desta seção oferecem operações de conveniência em valores de geometria.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

* Para funções que aceitam múltiplos argumentos de geometria, se esses argumentos não estiverem no mesmo SRS, ocorre um erro `ER_GIS_DIFFERENT_SRIDS`.

* Caso contrário, o valor de retorno não é `NULL`.

Essas funções de conveniência estão disponíveis:

* `ST_Distance_Sphere(g1, g2 [, radius])`(spatial-convenience-functions.html#function_st-distance-sphere)

Retorna a distância esférica mínima entre os argumentos `Point` ou `MultiPoint` em um globo, em metros. (Para cálculos de distância de propósito geral, consulte a função `ST_Distance()`. O argumento opcional *`radius`* deve ser fornecido em metros.

Se ambos os parâmetros geométricos forem valores válidos cartesianos `Point` ou `MultiPoint` no SRID 0, o valor de retorno é a menor distância entre as duas geometrias em uma esfera com o raio fornecido. Se omitido, o raio padrão é de 6.370.986 metros. As coordenadas dos pontos X e Y são interpretadas como longitude e latitude, respectivamente, em graus.

Se ambos os parâmetros de geometria forem valores válidos `Point` ou `MultiPoint` em um sistema de referência espacial geográfico (SRS), o valor de retorno é a menor distância entre as duas geometrias em uma esfera com o raio fornecido. Se omitido, o raio padrão é igual ao raio médio, definido como (2a + b)/3, onde a é o eixo semi-maior e b é o eixo semi-menor do SRS.

`ST_Distance_Sphere()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

As combinações de argumentos de geometria suportadas são `Point` e `Point`, ou `Point` e `MultiPoint` (em qualquer ordem de argumento). Se pelo menos uma das geometrias não for `Point` ou `MultiPoint`, e seu SRID for 0, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_CARTESIAN_SRS`. Se pelo menos uma das geometrias não for `Point` ou `MultiPoint`, e seu SRID se refere a um SRS geográfico, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`. Se alguma geometria se referir a um SRS projetado, ocorre um erro `ER_NOT_IMPLEMENTED_FOR_PROJECTED_SRS`.

+ Se qualquer argumento tiver uma longitude ou latitude fora do intervalo, ocorrerá um erro:

- Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

- Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

As faixas mostradas são em graus. Se um SRS usa outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa diferem ligeiramente devido à aritmética de ponto flutuante.

+ Se o argumento *`radius`* estiver presente, mas não positivo, ocorre um erro `ER_NONPOSITIVE_RADIUS`.

+ Se a distância exceder o alcance de um número de dupla precisão, ocorre um erro `ER_STD_OVERFLOW_ERROR`.

  ```
  mysql> SET @pt1 = ST_GeomFromText('POINT(0 0)');
  mysql> SET @pt2 = ST_GeomFromText('POINT(180 0)');
  mysql> SELECT ST_Distance_Sphere(@pt1, @pt2);
  +--------------------------------+
  | ST_Distance_Sphere(@pt1, @pt2) |
  +--------------------------------+
  |             20015042.813723423 |
  +--------------------------------+
  ```

* `ST_IsValid(g)`

Retorna 1 se o argumento for geometricamente válido, 0 se o argumento não for geometricamente válido. A validade geométrica é definida pela especificação OGC.

A única geometria vazia válida é representada na forma de um valor de coleção de geometria vazia. `ST_IsValid()` retorna 1 neste caso. O MySQL não suporta valores de SIG `EMPTY` como `POINT EMPTY`.

`ST_IsValid()` trata seus argumentos conforme descrito na introdução desta seção, com esta exceção:

+ Se a geometria tiver um SRS geográfico com uma longitude ou latitude fora do intervalo, ocorrerá um erro:

- Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

- Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

As faixas mostradas são em graus. Se um SRS usa outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa diferem ligeiramente devido à aritmética de ponto flutuante.

  ```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,-0.00 0,0.0 0)');
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 0, 1 1)');
  mysql> SELECT ST_IsValid(@ls1);
  +------------------+
  | ST_IsValid(@ls1) |
  +------------------+
  |                0 |
  +------------------+
  mysql> SELECT ST_IsValid(@ls2);
  +------------------+
  | ST_IsValid(@ls2) |
  +------------------+
  |                1 |
  +------------------+
  ```

* `ST_MakeEnvelope(pt1, pt2)`(spatial-convenience-functions.html#function_st-makeenvelope)

Retorna o retângulo que forma o envelope ao redor de dois pontos, como um `Point`, `LineString` ou `Polygon`.

Os cálculos são feitos usando o sistema de coordenadas cartesianas, e não em uma esfera, esferoide ou na Terra.

Dado dois pontos *`pt1`* e *`pt2`*, `ST_MakeEnvelope()` cria o resultado geométrico em um plano abstrato assim:

+ Se *`pt1`* e *`pt2`* forem iguais, o resultado é o ponto *`pt1`*.

+ Caso contrário, se `(pt1, pt2)` seja um segmento de linha vertical ou horizontal, o resultado é o segmento de linha `(pt1, pt2)`.

Caso contrário, o resultado é um polígono usando *`pt1`* e *`pt2`* como pontos diagonais.

O resultado da geometria tem um SRID de 0.

`ST_MakeEnvelope()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Se os argumentos não forem valores de `Point`, ocorrerá um erro de `ER_WRONG_ARGUMENTS`.

+ Uma erro `ER_GIS_INVALID_DATA` ocorre para a condição adicional de que qualquer valor de coordenada dos dois pontos é infinito ou `NaN`.

+ Se qualquer geometria tiver um valor SRID para um sistema de referência espacial geográfica (SRS), ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

  ```
  mysql> SET @pt1 = ST_GeomFromText('POINT(0 0)');
  mysql> SET @pt2 = ST_GeomFromText('POINT(1 1)');
  mysql> SELECT ST_AsText(ST_MakeEnvelope(@pt1, @pt2));
  +----------------------------------------+
  | ST_AsText(ST_MakeEnvelope(@pt1, @pt2)) |
  +----------------------------------------+
  | POLYGON((0 0,1 0,1 1,0 1,0 0))         |
  +----------------------------------------+
  ```

* `ST_Simplify(g, max_distance)`(spatial-convenience-functions.html#function_st-simplify)

Simplifica uma geometria usando o algoritmo de Douglas-Peucker e retorna um valor simplificado do mesmo tipo.

A geometria pode ser qualquer tipo de geometria, embora o algoritmo de Douglas-Peucker, na verdade, não processe todos os tipos. Uma coleção de geometria é processada, dando seus componentes um a um para o algoritmo de simplificação, e as geometrias devolvidas são colocadas em uma coleção de geometria como resultado.

O argumento *`max_distance`* é a distância (em unidades das coordenadas de entrada) de um vértice para outros segmentos a serem removidos. Os vértices dentro dessa distância das linhas simplificadas são removidos.

De acordo com o Boost.Geometry, as geometrias podem se tornar inválidas como resultado do processo de simplificação, e o processo pode criar autointerseções. Para verificar a validade do resultado, passe-o para `ST_IsValid()`.

`ST_Simplify()` trata seus argumentos conforme descrito na introdução desta seção, com esta exceção:

+ Se o argumento *`max_distance`* não for positivo ou for `NaN`, ocorre um erro `ER_WRONG_ARGUMENTS`.

  ```
  mysql> SET @g = ST_GeomFromText('LINESTRING(0 0,0 1,1 1,1 2,2 2,2 3,3 3)');
  mysql> SELECT ST_AsText(ST_Simplify(@g, 0.5));
  +---------------------------------+
  | ST_AsText(ST_Simplify(@g, 0.5)) |
  +---------------------------------+
  | LINESTRING(0 0,0 1,1 1,2 3,3 3) |
  +---------------------------------+
  mysql> SELECT ST_AsText(ST_Simplify(@g, 1.0));
  +---------------------------------+
  | ST_AsText(ST_Simplify(@g, 1.0)) |
  +---------------------------------+
  | LINESTRING(0 0,3 3)             |
  +---------------------------------+
  ```

* `ST_Validate(g)`

Valida uma geometria de acordo com a especificação OGC. Uma geometria pode ser sintaticamente bem formada (valor WKB mais SRID) mas geometricamente inválida. Por exemplo, este polígono é geometricamente inválido: `POLYGON((0 0, 0 0, 0 0, 0 0, 0 0))`

`ST_Validate()` retorna a geometria se for sintaticamente bem formada e geometricamente válida, `NULL` se o argumento não for sintaticamente bem formado ou não for geometricamente válido ou é `NULL`.

`ST_Validate()` pode ser usado para filtrar dados de geometria inválidos, embora isso tenha um custo. Para aplicações que exigem resultados mais precisos e não contaminados por dados inválidos, essa penalidade pode valer a pena.

Se o argumento de geometria for válido, ele é retornado como está, exceto que, se um entrada `Polygon` ou `MultiPolygon` tiver anéis no sentido horário, esses anéis são invertidos antes de verificar a validade. Se a geometria for válida, o valor com os anéis invertidos é retornado.

A única geometria vazia válida é representada na forma de um valor de coleção de geometria vazia. `ST_Validate()` retorna diretamente, sem verificações adicionais, neste caso.

A partir do MySQL 8.0.13, `ST_Validate()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Se a geometria tiver um SRS geográfico com uma longitude ou latitude fora do intervalo, ocorrerá um erro:

- Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` (`ER_LONGITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

- Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` (`ER_LATITUDE_OUT_OF_RANGE` antes do MySQL 8.0.12).

As faixas mostradas são em graus. Os limites exatos das faixas variam ligeiramente devido à aritmética de ponto flutuante.

Antes do MySQL 8.0.13, `ST_Validate()` lida com seus argumentos conforme descrito na introdução desta seção, com essas exceções:

+ Se a geometria não for sintaticamente bem formada, o valor de retorno é `NULL`. Não ocorre um erro `ER_GIS_INVALID_DATA`.

+ Se a geometria tiver um valor SRID para um sistema de referência espacial geográfica (SRS), ocorre um erro `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`.

  ```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0)');
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 0, 1 1)');
  mysql> SELECT ST_AsText(ST_Validate(@ls1));
  +------------------------------+
  | ST_AsText(ST_Validate(@ls1)) |
  +------------------------------+
  | NULL                         |
  +------------------------------+
  mysql> SELECT ST_AsText(ST_Validate(@ls2));
  +------------------------------+
  | ST_AsText(ST_Validate(@ls2)) |
  +------------------------------+
  | LINESTRING(0 0,1 1)          |
  +------------------------------+
  ```
