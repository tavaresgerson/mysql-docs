## 12.16 Funções de Análise Espacial

O MySQL oferece funções para realizar várias operações em dados espaciais. Essas funções podem ser agrupadas em várias categorias principais de acordo com o tipo de operação que realizam:

* Funções que criam geometrias em vários formatos (WKT, WKB, interno)

* Funções que convertem geometrias entre formatos * Funções que acessam propriedades qualitativas ou quantitativas de uma geometria

* Funções que descrevem relações entre duas geometrias
* Funções que criam novas geometrias a partir de outras existentes

Para informações gerais sobre o suporte do MySQL para o uso de dados espaciais, consulte a Seção 11.4, “Tipos de dados espaciais”.

### 12.16.1 Referência de função espacial

A tabela a seguir lista cada função espacial e fornece uma breve descrição de cada uma.

**Tabela 12.21 Funções Espaciais**

<table frame="box" rules="all" summary="A reference that lists all spatial functions."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Deprecated</th> </tr></thead><tbody><tr><th><code>Area()</code></th> <td> Return Polygon or MultiPolygon area </td> <td>Yes</td> </tr><tr><th><code>AsBinary()</code>,<code>AsWKB()</code></th> <td>Converter de formato de geometria interna para WKB</td> <td>Sim</td> </tr><tr><th><code>AsText()</code>,<code>AsWKT()</code></th> <td>Converter de formato de geometria interna para WKT</td> <td>Sim</td> </tr><tr><th><code>Buffer()</code></th> <td>Geometria de retorno de pontos dentro da distância dada da geometria</td> <td>Sim</td> </tr><tr><th><code>Centroid()</code></th> <td> Return centroid as a point </td> <td>Yes</td> </tr><tr><th><code>Contains()</code></th> <td>Se o MBR de uma geometria contém o MBR de outra</td> <td>Sim</td> </tr><tr><th><code>ConvexHull()</code></th> <td> Return convex hull of geometry </td> <td>Yes</td> </tr><tr><th><code>Crosses()</code></th> <td> Whether one geometry crosses another </td> <td>Yes</td> </tr><tr><th><code>Dimension()</code></th> <td> Dimension of geometry </td> <td>Yes</td> </tr><tr><th><code>Disjoint()</code></th> <td>Se os MBRs de duas geometrias são disjuntos</td> <td>Sim</td> </tr><tr><th><code>EndPoint()</code></th> <td> End Point of LineString </td> <td>Yes</td> </tr><tr><th><code>Envelope()</code></th> <td> Return MBR of geometry </td> <td>Yes</td> </tr><tr><th><code>Equals()</code></th> <td>Se os MBRs de duas geometrias são iguais</td> <td>Sim</td> </tr><tr><th><code>ExteriorRing()</code></th> <td> Return exterior ring of Polygon </td> <td>Yes</td> </tr><tr><th><code>GeomCollFromText()</code>,<code>GeometryCollectionFromText()</code></th> <td>Coleção de geometria de retorno do WKT</td> <td>Sim</td> </tr><tr><th><code>GeomCollFromWKB()</code>,<code>GeometryCollectionFromWKB()</code></th> <td>Coleção de geometria de retorno de WKB</td> <td>Sim</td> </tr><tr><th><code>GeometryCollection()</code></th> <td>Construa uma coleção de geometrias a partir de geometrias</td> <td></td> </tr><tr><th><code>GeometryN()</code></th> <td>Retorno da N-ésima geometria da coleção de geometrias</td> <td>Sim</td> </tr><tr><th><code>GeometryType()</code></th> <td> Return name of geometry type </td> <td>Yes</td> </tr><tr><th><code>GeomFromText()</code>,<code>GeometryFromText()</code></th> <td>Geometria de retorno a partir de WKT</td> <td>Sim</td> </tr><tr><th><code>GeomFromWKB()</code>,<code>GeometryFromWKB()</code></th> <td>Geometria de retorno do WKB</td> <td>Sim</td> </tr><tr><th><code>GLength()</code></th> <td> Return length of LineString </td> <td>Yes</td> </tr><tr><th><code>InteriorRingN()</code></th> <td>Retorno do N-ésimo anel interno do polígono</td> <td>Sim</td> </tr><tr><th><code>Intersects()</code></th> <td>Se os MBRs de duas geometrias se intersectam</td> <td>Sim</td> </tr><tr><th><code>IsClosed()</code></th> <td>Se a geometria é fechada e simples</td> <td>Sim</td> </tr><tr><th><code>IsEmpty()</code></th> <td> Whether a geometry is empty </td> <td>Yes</td> </tr><tr><th><code>IsSimple()</code></th> <td> Whether a geometry is simple </td> <td>Yes</td> </tr><tr><th><code>LineFromText()</code>,<code>LineStringFromText()</code></th> <td>Construa uma LineString a partir de WKT</td> <td>Sim</td> </tr><tr><th><code>LineFromWKB()</code>,<code>LineStringFromWKB()</code></th> <td>Construa uma linha String a partir de WKB</td> <td>Sim</td> </tr><tr><th><code>LineString()</code></th> <td>Construa uma linha String a partir de valores de Ponto</td> <td></td> </tr><tr><th><code>MBRContains()</code></th> <td>Se o MBR de uma geometria contém o MBR de outra</td> <td></td> </tr><tr><th><code>MBRCoveredBy()</code></th> <td>Se um MBR está coberto por outro</td> <td></td> </tr><tr><th><code>MBRCovers()</code></th> <td>Se um MBR cobre outro</td> <td></td> </tr><tr><th><code>MBRDisjoint()</code></th> <td>Se os MBRs de duas geometrias são disjuntos</td> <td></td> </tr><tr><th><code>MBREqual()</code></th> <td>Se os MBRs de duas geometrias são iguais</td> <td>Sim</td> </tr><tr><th><code>MBREquals()</code></th> <td>Se os MBRs de duas geometrias são iguais</td> <td></td> </tr><tr><th><code>MBRIntersects()</code></th> <td>Se os MBRs de duas geometrias se intersectam</td> <td></td> </tr><tr><th><code>MBROverlaps()</code></th> <td>Se os MBRs de duas geometrias se sobrepõem</td> <td></td> </tr><tr><th><code>MBRTouches()</code></th> <td>Se os MBRs de duas geometrias se tocam</td> <td></td> </tr><tr><th><code>MBRWithin()</code></th> <td>Se o MBR de uma geometria está dentro do MBR de outra</td> <td></td> </tr><tr><th><code>MLineFromText()</code>,<code>MultiLineStringFromText()</code></th> <td>Construa MultiLineString a partir de WKT</td> <td>Sim</td> </tr><tr><th><code>MLineFromWKB()</code>,<code>MultiLineStringFromWKB()</code></th> <td>Construa MultiLineString a partir de WKB</td> <td>Sim</td> </tr><tr><th><code>MPointFromText()</code>,<code>MultiPointFromText()</code></th> <td>Construa o MultiPoint a partir do WKT</td> <td>Sim</td> </tr><tr><th><code>MPointFromWKB()</code>,<code>MultiPointFromWKB()</code></th> <td>Construa o MultiPoint a partir do WKB</td> <td>Sim</td> </tr><tr><th><code>MPolyFromText()</code>,<code>MultiPolygonFromText()</code></th> <td>Construa MultiPolygon a partir de WKT</td> <td>Sim</td> </tr><tr><th><code>MPolyFromWKB()</code>,<code>MultiPolygonFromWKB()</code></th> <td>Construa MultiPolygon a partir de WKB</td> <td>Sim</td> </tr><tr><th><code>MultiLineString()</code></th> <td>Construa uma MultiLineString a partir de valores de LineString</td> <td></td> </tr><tr><th><code>MultiPoint()</code></th> <td>Construa o MultiPoint a partir de valores de ponto</td> <td></td> </tr><tr><th><code>MultiPolygon()</code></th> <td>Construa MultiPolygon a partir de valores Polygon</td> <td></td> </tr><tr><th><code>NumGeometries()</code></th> <td>Retorne o número de geometrias na coleção de geometrias</td> <td>Sim</td> </tr><tr><th><code>NumInteriorRings()</code></th> <td>Retorne o número de anéis internos no polígono</td> <td>Sim</td> </tr><tr><th><code>NumPoints()</code></th> <td>Retorne o número de pontos na linha String</td> <td>Sim</td> </tr><tr><th><code>Overlaps()</code></th> <td>Se os MBRs de duas geometrias se sobrepõem</td> <td>Sim</td> </tr><tr><th><code>Point()</code></th> <td>Construir ponto a partir de coordenadas</td> <td></td> </tr><tr><th><code>PointFromText()</code></th> <td> Construct Point from WKT </td> <td>Yes</td> </tr><tr><th><code>PointFromWKB()</code></th> <td> Construct Point from WKB </td> <td>Yes</td> </tr><tr><th><code>PointN()</code></th> <td> Return N-th point from LineString </td> <td>Yes</td> </tr><tr><th><code>PolyFromText()</code>,<code>PolygonFromText()</code></th> <td>Construa polígono a partir de WKT</td> <td>Sim</td> </tr><tr><th><code>PolyFromWKB()</code>,<code>PolygonFromWKB()</code></th> <td>Construa polígono a partir de WKB</td> <td>Sim</td> </tr><tr><th><code>Polygon()</code></th> <td>Construir polígono a partir de argumentos LineString</td> <td></td> </tr><tr><th><code>Distance()</code></th> <td>A distância de uma geometria em relação a outra</td> <td>Sim</td> </tr><tr><th><code>SRID()</code></th> <td>ID do sistema de referência espacial de retorno para geometria</td> <td>Sim</td> </tr><tr><th><code>ST_Area()</code></th> <td>Retorno da área Polygon ou MultiPolygon</td> <td></td> </tr><tr><th><code>ST_AsBinary()</code>,<code>ST_AsWKB()</code></th> <td>Converter de formato de geometria interna para WKB</td> <td></td> </tr><tr><th><code>ST_AsGeoJSON()</code></th> <td>Gerar objeto GeoJSON a partir da geometria</td> <td></td> </tr><tr><th><code>ST_AsText()</code>,<code>ST_AsWKT()</code></th> <td>Converter de formato de geometria interna para WKT</td> <td></td> </tr><tr><th><code>ST_Buffer()</code></th> <td>Geometria de retorno de pontos dentro da distância dada da geometria</td> <td></td> </tr><tr><th><code>ST_Buffer_Strategy()</code></th> <td> Produce strategy option for ST_Buffer() </td> <td></td> </tr><tr><th><code>ST_Centroid()</code></th> <td>Retorne o centroide como um ponto</td> <td></td> </tr><tr><th><code>ST_Contains()</code></th> <td>Se uma geometria contém outra</td> <td></td> </tr><tr><th><code>ST_ConvexHull()</code></th> <td>Retorne o casco convexo da geometria</td> <td></td> </tr><tr><th><code>ST_Crosses()</code></th> <td>Se uma geometria cruza outra</td> <td></td> </tr><tr><th><code>ST_Difference()</code></th> <td>Diferença do ponto de retorno entre duas geometrias</td> <td></td> </tr><tr><th><code>ST_Dimension()</code></th> <td> Dimension of geometry </td> <td></td> </tr><tr><th><code>ST_Disjoint()</code></th> <td>Se uma geometria é disjunta de outra</td> <td></td> </tr><tr><th><code>ST_Distance()</code></th> <td>A distância de uma geometria em relação a outra</td> <td></td> </tr><tr><th><code>ST_Distance_Sphere()</code></th> <td>Distância mínima na Terra entre duas geometrias</td> <td></td> </tr><tr><th><code>ST_EndPoint()</code></th> <td>Ponto final de LineString</td> <td></td> </tr><tr><th><code>ST_Envelope()</code></th> <td>Retorno do MBR da geometria</td> <td></td> </tr><tr><th><code>ST_Equals()</code></th> <td>Se uma geometria é igual a outra</td> <td></td> </tr><tr><th><code>ST_ExteriorRing()</code></th> <td>Anel exterior do Polygon</td> <td></td> </tr><tr><th><code>ST_GeoHash()</code></th> <td>Produza um valor geohash</td> <td></td> </tr><tr><th><code>ST_GeomCollFromText()</code>,<code>ST_GeometryCollectionFromText()</code>,<code>ST_GeomCollFromTxt()</code></th> <td>Coleção de geometria de retorno do WKT</td> <td></td> </tr><tr><th><code>ST_GeomCollFromWKB()</code>,<code>ST_GeometryCollectionFromWKB()</code></th> <td>Coleção de geometria de retorno de WKB</td> <td></td> </tr><tr><th><code>ST_GeometryN()</code></th> <td>Retorno da N-ésima geometria da coleção de geometrias</td> <td></td> </tr><tr><th><code>ST_GeometryType()</code></th> <td>Retorne o nome do tipo de geometria</td> <td></td> </tr><tr><th><code>ST_GeomFromGeoJSON()</code></th> <td>Gerar geometria a partir do objeto GeoJSON</td> <td></td> </tr><tr><th><code>ST_GeomFromText()</code>,<code>ST_GeometryFromText()</code></th> <td>Geometria de retorno a partir de WKT</td> <td></td> </tr><tr><th><code>ST_GeomFromWKB()</code>,<code>ST_GeometryFromWKB()</code></th> <td>Geometria de retorno do WKB</td> <td></td> </tr><tr><th><code>ST_InteriorRingN()</code></th> <td>Retorno do N-ésimo anel interno do polígono</td> <td></td> </tr><tr><th><code>ST_Intersection()</code></th> <td>Ponto de retorno definido pela interseção de duas geometrias</td> <td></td> </tr><tr><th><code>ST_Intersects()</code></th> <td>Se uma geometria intersecta outra</td> <td></td> </tr><tr><th><code>ST_IsClosed()</code></th> <td>Se a geometria é fechada e simples</td> <td></td> </tr><tr><th><code>ST_IsEmpty()</code></th> <td>Se uma geometria está vazia</td> <td></td> </tr><tr><th><code>ST_IsSimple()</code></th> <td>Se a geometria é simples</td> <td></td> </tr><tr><th><code>ST_IsValid()</code></th> <td>Se uma geometria é válida</td> <td></td> </tr><tr><th><code>ST_LatFromGeoHash()</code></th> <td>Retorno da latitude a partir do valor geohash</td> <td></td> </tr><tr><th><code>ST_Length()</code></th> <td>Comprimento de retorno da linha String</td> <td></td> </tr><tr><th><code>ST_LineFromText()</code>,<code>ST_LineStringFromText()</code></th> <td>Construa uma LineString a partir de WKT</td> <td></td> </tr><tr><th><code>ST_LineFromWKB()</code>,<code>ST_LineStringFromWKB()</code></th> <td>Construa uma linha String a partir de WKB</td> <td></td> </tr><tr><th><code>ST_LongFromGeoHash()</code></th> <td>Retorno da longitude a partir do valor geohash</td> <td></td> </tr><tr><th><code>ST_MakeEnvelope()</code></th> <td>Retângulo em torno de dois pontos</td> <td></td> </tr><tr><th><code>ST_MLineFromText()</code>,<code>ST_MultiLineStringFromText()</code></th> <td>Construa MultiLineString a partir de WKT</td> <td></td> </tr><tr><th><code>ST_MLineFromWKB()</code>,<code>ST_MultiLineStringFromWKB()</code></th> <td>Construa MultiLineString a partir de WKB</td> <td></td> </tr><tr><th><code>ST_MPointFromText()</code>,<code>ST_MultiPointFromText()</code></th> <td>Construa o MultiPoint a partir do WKT</td> <td></td> </tr><tr><th><code>ST_MPointFromWKB()</code>,<code>ST_MultiPointFromWKB()</code></th> <td>Construa o MultiPoint a partir do WKB</td> <td></td> </tr><tr><th><code>ST_MPolyFromText()</code>,<code>ST_MultiPolygonFromText()</code></th> <td>Construa MultiPolygon a partir de WKT</td> <td></td> </tr><tr><th><code>ST_MPolyFromWKB()</code>,<code>ST_MultiPolygonFromWKB()</code></th> <td>Construa MultiPolygon a partir de WKB</td> <td></td> </tr><tr><th><code>ST_NumGeometries()</code></th> <td>Retorne o número de geometrias na coleção de geometrias</td> <td></td> </tr><tr><th><code>ST_NumInteriorRing()</code>,<code>ST_NumInteriorRings()</code></th> <td>Retorne o número de anéis internos no polígono</td> <td></td> </tr><tr><th><code>ST_NumPoints()</code></th> <td>Retorne o número de pontos na linha String</td> <td></td> </tr><tr><th><code>ST_Overlaps()</code></th> <td>Se uma geometria se sobrepõe a outra</td> <td></td> </tr><tr><th><code>ST_PointFromGeoHash()</code></th> <td>Converta o valor geohash para o valor POINT</td> <td></td> </tr><tr><th><code>ST_PointFromText()</code></th> <td>Construa o Ponto a partir de WKT</td> <td></td> </tr><tr><th><code>ST_PointFromWKB()</code></th> <td>Construa o Ponto de WKB</td> <td></td> </tr><tr><th><code>ST_PointN()</code></th> <td>Retorno do N-ésimo ponto da LineString</td> <td></td> </tr><tr><th><code>ST_PolyFromText()</code>,<code>ST_PolygonFromText()</code></th> <td>Construa polígono a partir de WKT</td> <td></td> </tr><tr><th><code>ST_PolyFromWKB()</code>,<code>ST_PolygonFromWKB()</code></th> <td>Construa polígono a partir de WKB</td> <td></td> </tr><tr><th><code>ST_Simplify()</code></th> <td> Return simplified geometry </td> <td></td> </tr><tr><th><code>ST_SRID()</code></th> <td>ID do sistema de referência espacial de retorno para geometria</td> <td></td> </tr><tr><th><code>ST_StartPoint()</code></th> <td>Ponto de início da linha String</td> <td></td> </tr><tr><th><code>ST_SymDifference()</code></th> <td>Ponto de retorno definido como diferença simétrica de duas geometrias</td> <td></td> </tr><tr><th><code>ST_Touches()</code></th> <td>Se uma geometria toca outra</td> <td></td> </tr><tr><th><code>ST_Union()</code></th> <td>Ponto de retorno definido como união de duas geometrias</td> <td></td> </tr><tr><th><code>ST_Validate()</code></th> <td> Return validated geometry </td> <td></td> </tr><tr><th><code>ST_Within()</code></th> <td>Se uma geometria está dentro de outra</td> <td></td> </tr><tr><th><code>ST_X()</code></th> <td>Retorne a coordenada X do Ponto</td> <td></td> </tr><tr><th><code>ST_Y()</code></th> <td>Coordenada Y de retorno do Ponto</td> <td></td> </tr><tr><th><code>StartPoint()</code></th> <td> Start Point of LineString </td> <td>Yes</td> </tr><tr><th><code>Touches()</code></th> <td> Whether one geometry touches another </td> <td>Yes</td> </tr><tr><th><code>Within()</code></th> <td>Se o MBR de uma geometria está dentro do MBR de outra</td> <td>Sim</td> </tr><tr><th><code>X()</code></th> <td> Return X coordinate of Point </td> <td>Yes</td> </tr><tr><th><code>Y()</code></th> <td> Return Y coordinate of Point </td> <td>Yes</td> </tr></tbody></table>

### 12.16.2 Tratamento de argumentos por funções espaciais

Os valores espaciais, ou geometrias, possuem as propriedades descritas na Seção 11.4.2.2, “Classe de Geometria”. A discussão a seguir lista as características gerais de manipulação de argumentos de funções espaciais. Funções ou grupos de funções específicas podem ter características adicionais ou diferentes de manipulação de argumentos, conforme discutido nas seções onde essas descrições de funções ocorrem. Quando isso for verdade, essas descrições têm precedência sobre a discussão geral aqui.

As funções espaciais são definidas apenas para valores de geometria válidos. Consulte a Seção 11.4.4, “Bem-formação e validade da geometria”.

O identificador de referência espacial (SRID) de uma geometria identifica o espaço de coordenadas no qual a geometria é definida. No MySQL, o valor SRID é um número inteiro associado ao valor da geometria. O valor SRID máximo utilizável é 232−1. Se um valor maior for fornecido, apenas os 32 bits inferiores são utilizados.

Em MySQL, todos os cálculos são feitos assumindo SRID 0, independentemente do valor real do SRID. SRID 0 representa um plano cartesiano plano infinito sem unidades atribuídas a seus eixos. No futuro, os cálculos podem usar os valores SRID especificados. Para garantir o comportamento do SRID 0, crie valores de geometria usando SRID 0. SRID 0 é o padrão para novos valores de geometria se nenhum SRID for especificado.

Os valores de geometria produzidos por qualquer função espacial herdam o SRID dos argumentos de geometria.

As diretrizes do [Open Geospatial Consortium][(http://www.opengeospatial.org)] exigem que os polígonos de entrada já estejam fechados, portanto, polígonos abertos são rejeitados como inválidos, em vez de serem fechados.

O tratamento de uma coleção de geometria vazia é o seguinte: uma coleção de geometria de entrada WKT vazia pode ser especificada como [[`'GEOMETRYCOLLECTION()'`]. Esse também é o WKT de saída resultante de uma operação espacial que produz uma coleção de geometria vazia.

Durante a análise de uma coleção de geometria aninhada, a coleção é achatada e seus componentes básicos são utilizados em várias operações de SIG para calcular resultados. Isso oferece maior flexibilidade aos usuários, pois não é necessário se preocupar com a unicidade dos dados de geometria. Coleções de geometria aninhadas podem ser produzidas a partir de chamadas de função de SIG aninhadas sem precisar ser explicitamente achatadas primeiro.

### 12.16.3 Funções que criam valores de geometria a partir de valores WKT

Essas funções recebem como argumentos uma representação de texto bem conhecido (WKT) e, opcionalmente, um identificador do sistema de referência espacial (SRID). Elas retornam a geometria correspondente.

`ST_GeomFromText()` aceita um valor WKT de qualquer tipo de geometria como seu primeiro argumento. Outras funções fornecem funções de construção específicas para cada tipo de geometria, para a construção de valores de geometria.

Para uma descrição do formato WKT, consulte o formato Well-Known Text (WKT) ("Formato de Texto Conhecido").

* `GeomCollFromText(wkt [, srid])`(gis-wkt-functions.html#function_geomcollfromtext), `GeometryCollectionFromText(wkt [, srid])`(gis-wkt-functions.html#function_geomcollfromtext)

`ST_GeomCollFromText()`, `ST_GeometryCollectionFromText()`, `ST_GeomCollFromTxt()`, `GeomCollFromText()` e `GeometryCollectionFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeomCollFromText()`.

`GeomCollFromText()` e `GeometryCollectionFromText()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_GeomCollFromText()` e `ST_GeometryCollectionFromText()` em vez disso.

* `GeomFromText(wkt [, srid])`(gis-wkt-functions.html#function_geomfromtext), `GeometryFromText(wkt [, srid])`(gis-wkt-functions.html#function_geomfromtext)

`ST_GeomFromText()`, `ST_GeometryFromText()`, `GeomFromText()` e `GeometryFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeomFromText()`.

`GeomFromText()` e `GeometryFromText()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_GeomFromText()` e `ST_GeometryFromText()` em vez disso.

* `LineFromText(wkt [, srid])` (gis-wkt-functions.html#function_linefromtext), `LineStringFromText(wkt [, srid])` (gis-wkt-functions.html#function_linefromtext)

`ST_LineFromText()`, `ST_LineStringFromText()`, `LineFromText()` e `LineStringFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_LineFromText()`.

`LineFromText()` e `LineStringFromText()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_LineFromText()` e `ST_LineStringFromText()` em vez disso.

* `MLineFromText(wkt [, srid])`(gis-wkt-functions.html#function_mlinefromtext), `MultiLineStringFromText(wkt [, srid])`(gis-wkt-functions.html#function_mlinefromtext)

`ST_MLineFromText()`, `ST_MultiLineStringFromText()`, `MLineFromText()` e `MultiLineStringFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_MLineFromText()`.

`MLineFromText()` e `MultiLineStringFromText()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_MLineFromText()` e `ST_MultiLineStringFromText()` em vez disso.

* `MPointFromText(wkt [, srid])`](gis-wkt-functions.html#function_mpointfromtext), [`MultiPointFromText(wkt [, srid])`](gis-wkt-functions.html#function_mpointfromtext)

`ST_MPointFromText()`, `ST_MultiPointFromText()`, `MPointFromText()` e `MultiPointFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_MPointFromText()`.

`MPointFromText()` e `MultiPointFromText()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_MPointFromText()` e `ST_MultiPointFromText()` em vez disso.

* `MPolyFromText(wkt [, srid])`(gis-wkt-functions.html#function_mpolyfromtext), `MultiPolygonFromText(wkt [, srid])`(gis-wkt-functions.html#function_mpolyfromtext)

`ST_MPolyFromText()`, `ST_MultiPolygonFromText()`, `MPolyFromText()` e `MultiPolygonFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_MPolyFromText()`.

`MPolyFromText()` e `MultiPolygonFromText()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_MPolyFromText()` e `ST_MultiPolygonFromText()` em vez disso.

* `PointFromText(wkt [, srid])`(gis-wkt-functions.html#function_pointfromtext)

`ST_PointFromText()` e `PointFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_PointFromText()`.

`PointFromText()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_PointFromText()` em vez disso.

* `PolyFromText(wkt [, srid])`(gis-wkt-functions.html#function_polyfromtext), `PolygonFromText(wkt [, srid])`(gis-wkt-functions.html#function_polyfromtext)

`ST_PolyFromText()`, `ST_PolygonFromText()`, `PolyFromText()` e `PolygonFromText()` são sinônimos. Para mais informações, consulte a descrição de `ST_PolyFromText()`.

`PolyFromText()` e `PolygonFromText()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_PolyFromText()` e `ST_PolygonFromText()` em vez disso.

* `ST_GeomCollFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-geomcollfromtext), `ST_GeometryCollectionFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-geomcollfromtext), `ST_GeomCollFromTxt(wkt [, srid])`(gis-wkt-functions.html#function_st-geomcollfromtext)

Construi um valor `GeometryCollection` usando sua representação WKT e SRID.

Se o argumento de geometria for `NULL` ou não for uma geometria sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

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

* `ST_GeomFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-geomfromtext), `ST_GeometryFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-geomfromtext)

Construi um valor de geometria de qualquer tipo usando sua representação WKT e SRID.

Se o argumento de geometria for `NULL` ou não for uma geometria sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

`ST_GeomFromText()`, `ST_GeometryFromText()`, `GeomFromText()` e `GeometryFromText()` são sinônimos.

* `ST_LineFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-linefromtext), `ST_LineStringFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-linefromtext)

Construi um valor `LineString` usando sua representação WKT e SRID.

Se o argumento de geometria for `NULL` ou não for uma geometria sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

`ST_LineFromText()`, `ST_LineStringFromText()`, `LineFromText()` e `LineStringFromText()` são sinônimos.

* `ST_MLineFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-mlinefromtext), `ST_MultiLineStringFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-mlinefromtext)

Construi um valor `MultiLineString` usando sua representação WKT e SRID.

Se o argumento de geometria for `NULL` ou não for uma geometria sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

`ST_MLineFromText()`, `ST_MultiLineStringFromText()`, `MLineFromText()` e `MultiLineStringFromText()` são sinônimos.

* `ST_MPointFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-mpointfromtext), `ST_MultiPointFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-mpointfromtext)

Construi um valor `MultiPoint` usando sua representação WKT e SRID.

Se o argumento de geometria for `NULL` ou não for uma geometria sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

Funções como `ST_MPointFromText()` e `ST_GeomFromText()` que aceitam representações de valores em formato WKT de `MultiPoint` permitem que os pontos individuais dentro dos valores sejam rodeados por parênteses. Por exemplo, ambas as chamadas de função a seguir são válidas:

  ```sql
  ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
  ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
  ```

`ST_MPointFromText()`, `ST_MultiPointFromText()`, `MPointFromText()` e `MultiPointFromText()` são sinônimos.

* `ST_MPolyFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-mpolyfromtext), `ST_MultiPolygonFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-mpolyfromtext)

Construi um valor `MultiPolygon` usando sua representação WKT e SRID.

Se o argumento de geometria for `NULL` ou não for uma geometria sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

`ST_MPolyFromText()`, `ST_MultiPolygonFromText()`, `MPolyFromText()` e `MultiPolygonFromText()` são sinônimos.

* `ST_PointFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-pointfromtext)

Construi um valor `Point` usando sua representação WKT e SRID.

Se o argumento de geometria for `NULL` ou não for uma geometria sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

`ST_PointFromText()` e `PointFromText()` são sinônimos.

* `ST_PolyFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-polyfromtext), `ST_PolygonFromText(wkt [, srid])`(gis-wkt-functions.html#function_st-polyfromtext)

Construi um valor `Polygon` usando sua representação WKT e SRID.

Se o argumento de geometria for `NULL` ou não for uma geometria sintaticamente bem formada, ou se o argumento SRID for `NULL`, o valor de retorno é `NULL`.

`ST_PolyFromText()`, `ST_PolygonFromText()`, `PolyFromText()` e `PolygonFromText()` são sinônimos.

### 12.16.4 Funções que criam valores de geometria a partir de valores WKB

Essas funções aceitam como argumentos um `BLOB` que contém uma representação de Binário Conhecido (WKB) e, opcionalmente, um identificador do sistema de referência espacial (SRID). Elas retornam a geometria correspondente.

`ST_GeomFromWKB()` aceita um valor WKB de qualquer tipo de geometria como seu primeiro argumento. Outras funções fornecem funções de construção específicas para cada tipo de geometria, para a construção de valores de geometria.

Essas funções também aceitam objetos geométricos como os retornados pelas funções na Seção 12.16.5, “Funções específicas do MySQL que criam valores geométricos”. Assim, essas funções podem ser usadas para fornecer o primeiro argumento às funções nesta seção. No entanto, a partir do MySQL 5.7.19, o uso de argumentos geométricos é desaconselhado e gera um aviso. Argumentos geométricos não são aceitos no MySQL 8.0. Para migrar chamadas que usam argumentos geométricos para usar argumentos WKB, siga estas diretrizes:

Para uma descrição do formato WKB, consulte o formato Formato de Binário Bem Conhecido (WKB).

* Reescreva construções como `ST_GeomFromWKB(Point(0, 0))` como `Point(0, 0)`.

* Reescreva construções como `ST_GeomFromWKB(Point(0, 0), 4326)` como `ST_GeomFromWKB(ST_AsWKB(Point(0, 0)), 4326)`. (Alternativamente, no MySQL 8.0, você pode usar `ST_SRID(Point(0, 0), 4326)`.)

* `GeomCollFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_geomcollfromwkb), `GeometryCollectionFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_geomcollfromwkb)

`ST_GeomCollFromWKB()`, `ST_GeometryCollectionFromWKB()`, `GeomCollFromWKB()` e `GeometryCollectionFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeomCollFromWKB()`.

`GeomCollFromWKB()` e `GeometryCollectionFromWKB()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_GeomCollFromWKB()` e `ST_GeometryCollectionFromWKB()` em vez disso.

* `GeomFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_geomfromwkb), [`GeometryFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_geomfromwkb)

`ST_GeomFromWKB()`, `ST_GeometryFromWKB()`, `GeomFromWKB()` e `GeometryFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeomFromWKB()`.

`GeomFromWKB()` e `GeometryFromWKB()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_GeomFromWKB()` e `ST_GeometryFromWKB()` em vez disso.

* `LineFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_linefromwkb), `LineStringFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_linefromwkb)

`ST_LineFromWKB()`, `ST_LineStringFromWKB()`, `LineFromWKB()` e `LineStringFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_LineFromWKB()`.

`LineFromWKB()` e `LineStringFromWKB()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_LineFromWKB()` e `ST_LineStringFromWKB()` em vez disso.

* `MLineFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_mlinefromwkb), `MultiLineStringFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_mlinefromwkb)

`ST_MLineFromWKB()`, `ST_MultiLineStringFromWKB()`, `MLineFromWKB()` e `MultiLineStringFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_MLineFromWKB()`.

`MLineFromWKB()` e `MultiLineStringFromWKB()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_MLineFromWKB()` e `ST_MultiLineStringFromWKB()` em vez disso.

* `MPointFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_mpointfromwkb), [`MultiPointFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_mpointfromwkb)

`ST_MPointFromWKB()`, `ST_MultiPointFromWKB()`, `MPointFromWKB()` e `MultiPointFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_MPointFromWKB()`.

`MPointFromWKB()` e `MultiPointFromWKB()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_MPointFromWKB()` e `ST_MultiPointFromWKB()` em vez disso.

* `MPolyFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_mpolyfromwkb), `MultiPolygonFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_mpolyfromwkb)

`ST_MPolyFromWKB()`, `ST_MultiPolygonFromWKB()`, `MPolyFromWKB()` e `MultiPolygonFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_MPolyFromWKB()`.

`MPolyFromWKB()` e `MultiPolygonFromWKB()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_MPolyFromWKB()` e `ST_MultiPolygonFromWKB()` em vez disso.

* `PointFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_pointfromwkb)

`ST_PointFromWKB()` e `PointFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_PointFromWKB()`.

`PointFromWKB()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_PointFromWKB()` em vez disso.

* `PolyFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_polyfromwkb), [`PolygonFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_polyfromwkb)

`ST_PolyFromWKB()`, `ST_PolygonFromWKB()`, `PolyFromWKB()` e `PolygonFromWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_PolyFromWKB()`.

`PolyFromWKB()` e `PolygonFromWKB()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_PolyFromWKB()` e `ST_PolygonFromWKB()` em vez disso.

* `ST_GeomCollFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-geomcollfromwkb), [`ST_GeometryCollectionFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-geomcollfromwkb)

Construi um valor de `GeometryCollection` usando sua representação WKB e SRID.

O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

`ST_GeomCollFromWKB()`, `ST_GeometryCollectionFromWKB()`, `GeomCollFromWKB()` e `GeometryCollectionFromWKB()` são sinônimos.

* `ST_GeomFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_st-geomfromwkb), `ST_GeometryFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_st-geomfromwkb)

Construi um valor de geometria de qualquer tipo usando sua representação WKB e SRID.

O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

`ST_GeomFromWKB()`, `ST_GeometryFromWKB()`, `GeomFromWKB()` e `GeometryFromWKB()` são sinônimos.

* `ST_LineFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_st-linefromwkb), `ST_LineStringFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_st-linefromwkb)

Construi um valor `LineString` usando sua representação WKB e SRID.

O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

`ST_LineFromWKB()`, `ST_LineStringFromWKB()`, `LineFromWKB()` e `LineStringFromWKB()` são sinônimos.

* `ST_MLineFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_st-mlinefromwkb), `ST_MultiLineStringFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_st-mlinefromwkb)

Construi um valor `MultiLineString` usando sua representação WKB e SRID.

O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

`ST_MLineFromWKB()`, `ST_MultiLineStringFromWKB()`, `MLineFromWKB()` e `MultiLineStringFromWKB()` são sinônimos.

* `ST_MPointFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_st-mpointfromwkb), `ST_MultiPointFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_st-mpointfromwkb)

Construi um valor `MultiPoint` usando sua representação WKB e SRID.

O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

`ST_MPointFromWKB()`, `ST_MultiPointFromWKB()`, `MPointFromWKB()` e `MultiPointFromWKB()` são sinônimos.

* `ST_MPolyFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-mpolyfromwkb), [`ST_MultiPolygonFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-mpolyfromwkb)

Construi um valor `MultiPolygon` usando sua representação WKB e SRID.

O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

`ST_MPolyFromWKB()`, `ST_MultiPolygonFromWKB()`, `MPolyFromWKB()` e `MultiPolygonFromWKB()` são sinônimos.

* `ST_PointFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_st-pointfromwkb)

Construi um valor `Point` usando sua representação WKB e SRID.

O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

`ST_PointFromWKB()` e `PointFromWKB()` são sinônimos.

* `ST_PolyFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_st-polyfromwkb), `ST_PolygonFromWKB(wkb [, srid])`(gis-wkb-functions.html#function_st-polyfromwkb)

Construi um valor `Polygon` usando sua representação WKB e SRID.

O resultado é `NULL` se o argumento WKB ou SRID for `NULL`.

`ST_PolyFromWKB()`, `ST_PolygonFromWKB()`, `PolyFromWKB()` e `PolygonFromWKB()` são sinônimos.

### 12.16.5 Funções específicas do MySQL que criam valores de geometria

O MySQL oferece um conjunto de funções não padrão úteis para criar valores de geometria. As funções descritas nesta seção são extensões do MySQL à especificação OpenGIS.

Essas funções produzem objetos geométricos a partir de valores WKB ou objetos geométricos como argumentos. Se qualquer argumento não for uma representação adequada WKB ou geométrica do tipo de objeto adequado, o valor de retorno é `NULL`.

Por exemplo, você pode inserir o valor de retorno da geometria de `Point()` diretamente em uma coluna de `POINT`:

```sql
INSERT INTO t1 (pt_col) VALUES(Point(1,2));
```

* `GeometryCollection(g [, g] ...)`(gis-mysql-specific-functions.html#function_geometrycollection)

Construi um valor `GeometryCollection` a partir dos argumentos de geometria.

`GeometryCollection()` retorna todas as geometrias apropriadas contidas nos argumentos, mesmo que uma geometria não suportada esteja presente.

`GeometryCollection()` sem argumentos é permitido como uma maneira de criar uma geometria vazia.

* `LineString(pt [, pt] ...)`(gis-mysql-specific-functions.html#function_linestring)

Construi um valor `LineString` a partir de um número de argumentos `Point` ou WKB `Point`. Se o número de argumentos for menor que dois, o valor de retorno é `NULL`.

* `MultiLineString(ls [, ls] ...)`](gis-mysql-specific-functions.html#function_multilinestring)

Construi um valor `MultiLineString` usando os argumentos `LineString` ou WKB `LineString`.

* `MultiPoint(pt [, pt2] ...)`(gis-mysql-specific-functions.html#function_multipoint)

Construi um valor `MultiPoint` usando os argumentos `Point` ou WKB `Point`.

* `MultiPolygon(poly [, poly] ...)`(gis-mysql-specific-functions.html#function_multipolygon)

Constrói um valor `MultiPolygon` a partir de um conjunto de argumentos `Polygon` ou WKB `Polygon`.

* `Point(x, y)`(gis-mysql-specific-functions.html#function_point)

Construi um `Point` usando suas coordenadas.

* `Polygon(ls [, ls] ...)`(gis-mysql-specific-functions.html#function_polygon)

Construi um valor de `Polygon` a partir de um número de argumentos de `LineString` ou WKB `LineString`. Se qualquer argumento não representar um `LinearRing` (ou seja, não ser um `LineString` fechado e simples), o valor de retorno é `NULL`.

### 12.16.6 Funções de conversão de formato de geometria

O MySQL suporta as funções listadas nesta seção para a conversão de valores de geometria do formato de geometria interna para o formato WKT ou WKB.

Há também funções para converter uma cadeia de caracteres do formato WKT ou WKB para o formato de geometria interna. Consulte a Seção 12.16.3, “Funções que criam valores de geometria a partir de valores WKT”, e a Seção 12.16.4, “Funções que criam valores de geometria a partir de valores WKB”.

* `AsBinary(g)`, `AsWKB(g)`

`ST_AsBinary()`, `ST_AsWKB()`, `AsBinary()` e `AsWKB()` são sinônimos. Para mais informações, consulte a descrição de `ST_AsBinary()`.

`AsBinary()` e `AsWKB()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_AsBinary()` e `ST_AsWKB()` em vez disso.

* `AsText(g)`, `AsWKT(g)`

`ST_AsText()`, `ST_AsWKT()`, `AsText()` e `AsWKT()` são sinônimos. Para mais informações, consulte a descrição de `ST_AsText()`.

`AsText()` e `AsWKT()` são desatualizados; espere que eles sejam removidos em um lançamento futuro do MySQL. Use `ST_AsText()` e `ST_AsWKT()` em vez disso.

* `ST_AsBinary(g)`, `ST_AsWKB(g)`

Converte um valor no formato de geometria interna para sua representação WKB e retorna o resultado binário.

Se o argumento for `NULL`, o valor de retorno é `NULL`. Se o argumento não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

  ```sql
  SELECT ST_AsBinary(g) FROM geom;
  ```

`ST_AsBinary()`, `ST_AsWKB()`, `AsBinary()` e `AsWKB()` são sinônimos.

* `ST_AsText(g)`, `ST_AsWKT(g)`

Converte um valor no formato de geometria interna para sua representação WKT e retorna o resultado em string.

Se o argumento for `NULL`, o valor de retorno é `NULL`. Se o argumento não for uma geometria bem formada sintaticamente, ocorre um erro `ER_GIS_INVALID_DATA`.

  ```sql
  mysql> SET @g = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@g));
  +--------------------------------+
  | ST_AsText(ST_GeomFromText(@g)) |
  +--------------------------------+
  | LINESTRING(1 1,2 2,3 3)        |
  +--------------------------------+
  ```

`ST_AsText()`, `ST_AsWKT()`, `AsText()` e `AsWKT()` são sinônimos.

A saída para os valores de `MultiPoint` inclui parênteses em torno de cada ponto. Por exemplo:

  ```sql
  mysql> SET @mp = 'MULTIPOINT(1 1, 2 2, 3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@mp));
  +---------------------------------+
  | ST_AsText(ST_GeomFromText(@mp)) |
  +---------------------------------+
  | MULTIPOINT((1 1),(2 2),(3 3))   |
  +---------------------------------+
  ```

### 12.16.7 Funções de Propriedade Geométrica

Cada função que pertence a este grupo recebe um valor de geometria como seu argumento e retorna alguma propriedade quantitativa ou qualitativa da geometria. Algumas funções restringem o tipo de argumento. Essas funções retornam `NULL` se o argumento for de um tipo de geometria incorreto. Por exemplo, a função `ST_Area()` de polígono retorna `NULL` se o tipo de objeto não for nem `Polygon` nem `MultiPolygon`.

#### 12.16.7.1 Funções de Propriedade Geométrica Geral

As funções listadas nesta seção não restringem seu argumento e aceitam um valor de geometria de qualquer tipo.

* `Dimension(g)`

`ST_Dimension()` e `Dimension()` são sinônimos. Para mais informações, consulte a descrição de `ST_Dimension()`.

`Dimension()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_Dimension()` em vez disso.

* `Envelope(g)`

`ST_Envelope()` e `Envelope()` são sinônimos. Para mais informações, consulte a descrição de `ST_Envelope()`.

`Envelope()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_Envelope()` em vez disso.

* `GeometryType(g)`

`ST_GeometryType()` e `GeometryType()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeometryType()`.

`GeometryType()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_GeometryType()` em vez disso.

* `IsEmpty(g)`

`ST_IsEmpty()` e `IsEmpty()` são sinônimos. Para mais informações, consulte a descrição de `ST_IsEmpty()`.

`IsEmpty()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_IsEmpty()` em vez disso.

* `IsSimple(g)`

`ST_IsSimple()` e `IsSimple()` são sinônimos. Para mais informações, consulte a descrição de `ST_IsSimple()`.

`IsSimple()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_IsSimple()` em vez disso.

* `SRID(g)`

`ST_SRID()` e `SRID()` são sinônimos. Para mais informações, consulte a descrição de `ST_SRID()`.

`SRID()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_SRID()` em vez disso.

* `ST_Dimension(g)`

Retorna a dimensão inerente do valor de geometria *`g`*, ou `NULL` se o argumento for `NULL`. A dimensão pode ser −1, 0, 1 ou 2. O significado desses valores é dado na Seção 11.4.2.2, “Classe de Geometria”.

  ```sql
  mysql> SELECT ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)'));
  +------------------------------------------------------+
  | ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)')) |
  +------------------------------------------------------+
  |                                                    1 |
  +------------------------------------------------------+
  ```

`ST_Dimension()` e `Dimension()` são sinônimos.

* `ST_Envelope(g)`

Retorna o retângulo mínimo de delimitação (MBR) para o valor de geometria *`g`*, ou `NULL` se o argumento for `NULL`. O resultado é retornado como um valor `Polygon` que é definido pelos pontos de esquina da caixa de delimitação:

  ```sql
  POLYGON((MINX MINY, MAXX MINY, MAXX MAXY, MINX MAXY, MINX MINY))
  ```

  ```sql
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)'))) |
  +----------------------------------------------------------------+
  | POLYGON((1 1,2 1,2 2,1 2,1 1))                                 |
  +----------------------------------------------------------------+
  ```

Se o argumento for um ponto ou um segmento de linha vertical ou horizontal, `ST_Envelope()` retorna o ponto ou o segmento de linha como seu MBR, em vez de retornar um polígono inválido:

  ```sql
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)'))) |
  +----------------------------------------------------------------+
  | LINESTRING(1 1,1 2)                                            |
  +----------------------------------------------------------------+
  ```

`ST_Envelope()` e `Envelope()` são sinônimos.

* `ST_GeometryType(g)`

Retorna uma string binária que indica o nome do tipo de geometria do qual a instância de geometria *`g`* é membro, ou `NULL` se o argumento for `NULL`. O nome corresponde a uma das subclasses instanciáveis `Geometry`.

  ```sql
  mysql> SELECT ST_GeometryType(ST_GeomFromText('POINT(1 1)'));
  +------------------------------------------------+
  | ST_GeometryType(ST_GeomFromText('POINT(1 1)')) |
  +------------------------------------------------+
  | POINT                                          |
  +------------------------------------------------+
  ```

`ST_GeometryType()` e `GeometryType()` são sinônimos.

* `ST_IsEmpty(g)`

Essa função é um marcador que retorna 0 para qualquer valor válido de geometria, 1 para qualquer valor de geometria inválido ou `NULL` se o argumento for `NULL`.

MySQL não suporta os valores de SIG `EMPTY`, como `POINT EMPTY`.

`ST_IsEmpty()` e `IsEmpty()` são sinônimos.

* `ST_IsSimple(g)`

Retorna 1 se o valor de geometria *`g`* não tiver pontos geométricos anômalos, como autointersecção ou autotangência. `ST_IsSimple()` retorna 0 se o argumento não for simples, e `NULL` se o argumento for `NULL`.

As descrições das classes geométricas instanciáveis dadas na Seção 11.4.2, “O Modelo de Geometria OpenGIS”, incluem as condições específicas que fazem com que as instâncias da classe sejam classificadas como não simples.

`ST_IsSimple()` e `IsSimple()` são sinônimos.

* `ST_SRID(g)`

Retorna um número inteiro que indica o ID do sistema de referência espacial associado ao valor de geometria *`g`*, ou `NULL` se o argumento for `NULL`.

  ```sql
  mysql> SELECT ST_SRID(ST_GeomFromText('LineString(1 1,2 2)',101));
  +-----------------------------------------------------+
  | ST_SRID(ST_GeomFromText('LineString(1 1,2 2)',101)) |
  +-----------------------------------------------------+
  |                                                 101 |
  +-----------------------------------------------------+
  ```

`ST_SRID()` e `SRID()` são sinônimos.

#### 12.16.7.2 Funções de Propriedade de Pontos

Um `Point` é composto por coordenadas X e Y, que podem ser obtidas usando as seguintes funções:

* `ST_X(p)`

Retorna o valor da coordenada X do objeto `Point` *`p`* como um número de precisão dupla.

  ```sql
  mysql> SELECT ST_X(Point(56.7, 53.34));
  +--------------------------+
  | ST_X(Point(56.7, 53.34)) |
  +--------------------------+
  |                     56.7 |
  +--------------------------+
  ```

`ST_X()` e `X()` são sinônimos.

* `ST_Y(p)`

Retorna o valor da coordenada Y do objeto `Point` *`p`* como um número de precisão dupla.

  ```sql
  mysql> SELECT ST_Y(Point(56.7, 53.34));
  +--------------------------+
  | ST_Y(Point(56.7, 53.34)) |
  +--------------------------+
  |                    53.34 |
  +--------------------------+
  ```

`ST_Y()` e `Y()` são sinônimos.

* `X(p)`

`ST_X()` e `X()` são sinônimos. Para mais informações, consulte a descrição de `ST_X()`.

`X()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_X()` em vez disso.

* `Y(p)`

`ST_Y()` e `Y()` são sinônimos. Para mais informações, consulte a descrição de `ST_Y()`.

`Y()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_Y()` em vez disso.

#### 12.16.7.3 Funções de Propriedade de LineString e MultiLineString

Um `LineString` é composto por valores de `Point`. Você pode extrair pontos específicos de um `LineString`, contar o número de pontos que ele contém ou obter seu comprimento.

Algumas funções nesta seção também funcionam para valores de `MultiLineString`.

* `EndPoint(ls)`

`ST_EndPoint()` e `EndPoint()` são sinônimos. Para mais informações, consulte a descrição de `ST_EndPoint()`.

`EndPoint()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_EndPoint()` em vez disso.

* `GLength(ls)`

`GLength()` é um nome não padrão. Ele corresponde à função OpenGIS `ST_Length()`. (Existe uma função SQL existente `Length()` que calcula o comprimento dos valores de cadeia.)

`GLength()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_Length()` em vez disso.

* `IsClosed(ls)`

`ST_IsClosed()` e `IsClosed()` são sinônimos. Para mais informações, consulte a descrição de `ST_IsClosed()`.

`IsClosed()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_IsClosed()` em vez disso.

* `NumPoints(ls)`

`ST_NumPoints()` e `NumPoints()` são sinônimos. Para mais informações, consulte a descrição de `ST_NumPoints()`.

`NumPoints()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_NumPoints()` em vez disso.

* `PointN(ls, N)`(gis-linestring-property-functions.html#function_pointn)

`ST_PointN()` e `PointN()` são sinônimos. Para mais informações, consulte a descrição de `ST_PointN()`.

`PointN()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_PointN()` em vez disso.

* `ST_EndPoint(ls)`

Retorna o `Point` que é o ponto final do valor `LineString` *`ls`*. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

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

* `ST_IsClosed(ls)`

Para um valor de `LineString` *`ls`*, `ST_IsClosed()` retorna 1 se *`ls`* estiver fechado (ou seja, seus valores de `ST_StartPoint()` e `ST_EndPoint()` são os mesmos). Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

Para um valor de `MultiLineString` *`ls`*, `ST_IsClosed()` retorna 1 se *`ls`* estiver fechado (ou seja, os valores de `ST_StartPoint()` e `ST_EndPoint()` são os mesmos para cada `LineString` em *`ls`*).

`ST_IsClosed()` retorna 0 se *`ls`* não estiver fechado.

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

* `ST_Length(ls)`

Retorna um número de dupla precisão que indica a extensão do valor `LineString` ou `MultiLineString` *`ls`* em seu sistema de referência espacial associado. A extensão de um valor `MultiLineString` é igual à soma das extensões de seus elementos. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

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

* `ST_NumPoints(ls)`

Retorna o número de objetos `Point` no valor `LineString` *`ls`*. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

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

* `ST_PointN(ls, N)`(gis-linestring-property-functions.html#function_st-pointn)

Retorna o *`N`*-ésimo `Point` no valor `Linestring` *`ls`*. Os pontos são numerados a partir do número 1. Se qualquer argumento for `NULL` ou o argumento de geometria for uma geometria vazia, o valor de retorno é `NULL`.

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

* `ST_StartPoint(ls)`

Retorna o `Point` que é o ponto de início do valor `LineString` *`ls`*. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

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

* `StartPoint(ls)`

`ST_StartPoint()` e `StartPoint()` são sinônimos. Para mais informações, consulte a descrição de `ST_StartPoint()`.

`StartPoint()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_StartPoint()` em vez disso.

#### 12.16.7.4 Funções de Propriedade de Poligono e MultiPoligono

As funções desta seção retornam propriedades dos valores de `Polygon` ou `MultiPolygon`.

* `Area({poly|mpoly})`

`ST_Area()` e `Area()` são sinônimos. Para mais informações, consulte a descrição de `ST_Area()`.

`Area()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_Area()` em vez disso.

* `Centroid({poly|mpoly})`

`ST_Centroid()` e `Centroid()` são sinônimos. Para mais informações, consulte a descrição de `ST_Centroid()`.

`Centroid()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_Centroid()` em vez disso.

* `ExteriorRing(poly)`

`ST_ExteriorRing()` e `ExteriorRing()` são sinônimos. Para mais informações, consulte a descrição de `ST_ExteriorRing()`.

`ExteriorRing()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_ExteriorRing()` em vez disso.

* `InteriorRingN(poly, N)`(gis-polygon-property-functions.html#function_interiorringn)

`ST_InteriorRingN()` e `InteriorRingN()` são sinônimos. Para mais informações, consulte a descrição de `ST_InteriorRingN()`.

`InteriorRingN()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_InteriorRingN()` em vez disso.

* `NumInteriorRings(poly)`

`ST_NumInteriorRings()` e `NumInteriorRings()` são sinônimos. Para mais informações, consulte a descrição de `ST_NumInteriorRings()`.

`NumInteriorRings()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_NumInteriorRings()` em vez disso.

* `ST_Area({poly|mpoly})`

Retorna um número de dupla precisão que indica a área do argumento `Polygon` ou `MultiPolygon`, medida em seu sistema de referência espacial. Para argumentos de dimensão 0 ou 1, o resultado é 0. Se o argumento for uma geometria vazia, o valor de retorno é 0. Se o argumento for `NULL`, o valor de retorno é `NULL`.

O resultado é a soma dos valores de área de todos os componentes de uma coleção de geometria. Se uma coleção de geometria estiver vazia, sua área será devolvida como 0.

  ```sql
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

`ST_Area()` e `Area()` são sinônimos.

* `ST_Centroid({poly|mpoly})`

Retorna o centroide matemático para o argumento `Polygon` ou `MultiPolygon` como um `Point`. O resultado não é garantido para estar no `MultiPolygon`. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

Essa função processa coleções de geometria, calculando o ponto central para componentes da maior dimensão na coleção. Esses componentes são extraídos e transformados em um único `MultiPolygon`, `MultiLineString` ou `MultiPoint` para o cálculo do centro. Se o argumento for uma coleção de geometria vazia, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @poly =
         ST_GeomFromText('POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7,5 5))');
  mysql> SELECT ST_GeometryType(@poly),ST_AsText(ST_Centroid(@poly));
  +------------------------+--------------------------------------------+
  | ST_GeometryType(@poly) | ST_AsText(ST_Centroid(@poly))              |
  +------------------------+--------------------------------------------+
  | POLYGON                | POINT(4.958333333333333 4.958333333333333) |
  +------------------------+--------------------------------------------+
  ```

`ST_Centroid()` e `Centroid()` são sinônimos.

* `ST_ExteriorRing(poly)`

Retorna o anel exterior do valor `Polygon` *`poly`* como um `LineString`. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_AsText(ST_ExteriorRing(ST_GeomFromText(@poly)));
  +----------------------------------------------------+
  | ST_AsText(ST_ExteriorRing(ST_GeomFromText(@poly))) |
  +----------------------------------------------------+
  | LINESTRING(0 0,0 3,3 3,3 0,0 0)                    |
  +----------------------------------------------------+
  ```

`ST_ExteriorRing()` e `ExteriorRing()` são sinônimos.

* `ST_InteriorRingN(poly, N)`(gis-polygon-property-functions.html#function_st-interiorringn)

Retorna o anel interno *`N`*-o para o valor `poly` *`poly`* como um `LineString`. Os anéis são numerados começando com 1. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1));
  +-------------------------------------------------------+
  | ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1)) |
  +-------------------------------------------------------+
  | LINESTRING(1 1,1 2,2 2,2 1,1 1)                       |
  +-------------------------------------------------------+
  ```

`ST_InteriorRingN()` e `InteriorRingN()` são sinônimos.

* `ST_NumInteriorRing(poly)`, `ST_NumInteriorRings(poly)`

Retorna o número de anéis internos no valor `Polygon` *`poly`*. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_NumInteriorRings(ST_GeomFromText(@poly));
  +---------------------------------------------+
  | ST_NumInteriorRings(ST_GeomFromText(@poly)) |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  ```

`ST_NumInteriorRing()`, `ST_NumInteriorRings()` e `NumInteriorRings()` são sinônimos.

#### 12.16.7.5 Funções de Propriedade de GeometryCollection

Essas funções retornam propriedades dos valores de `GeometryCollection`.

* `GeometryN(gc, N)`(gis-geometrycollection-property-functions.html#function_geometryn)

`ST_GeometryN()` e `GeometryN()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeometryN()`.

`GeometryN()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_GeometryN()` em vez disso.

* `NumGeometries(gc)`

`ST_NumGeometries()` e `NumGeometries()` são sinônimos. Para mais informações, consulte a descrição de `ST_NumGeometries()`.

`NumGeometries()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_NumGeometries()` em vez disso.

* `ST_GeometryN(gc, N)`(gis-geometrycollection-property-functions.html#function_st-geometryn)

Retorna a *`N`*-aª geometria no valor `GeometryCollection` *`gc`*. As geometrias são numeradas começando com 1. Se qualquer argumento for `NULL` ou o argumento de geometria for uma geometria vazia, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1));
  +-------------------------------------------------+
  | ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1)) |
  +-------------------------------------------------+
  | POINT(1 1)                                      |
  +-------------------------------------------------+
  ```

`ST_GeometryN()` e `GeometryN()` são sinônimos.

* `ST_NumGeometries(gc)`

Retorna o número de geometrias no valor `GeometryCollection` *`gc`*. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_NumGeometries(ST_GeomFromText(@gc));
  +----------------------------------------+
  | ST_NumGeometries(ST_GeomFromText(@gc)) |
  +----------------------------------------+
  |                                      2 |
  +----------------------------------------+
  ```

`ST_NumGeometries()` e `NumGeometries()` são sinônimos.

### 12.16.8 Funções de Operadores Espaciais

O OpenGIS propõe uma série de funções que podem produzir geometrias. Elas são projetadas para implementar operadores espaciais.

Essas funções suportam todas as combinações de tipos de argumento, exceto aquelas que não são aplicáveis de acordo com a especificação do [Consórcio de Geoprocessamento Aberto][(http://www.opengeospatial.org)].

Além disso, a Seção 12.16.7, “Funções de Propriedade Geométrica”, discute várias funções que constroem novas geometrias a partir de outras existentes. Veja essa seção para obter descrições dessas funções:

* `ST_Envelope(g)`
* `ST_StartPoint(ls)`
* `ST_EndPoint(ls)`
* [`ST_PointN(ls, N)`](gis-linestring-property-functions.html#function_st-pointn)

* `ST_ExteriorRing(poly)`
* [`ST_InteriorRingN(poly, N)`](gis-polygon-property-functions.html#function_st-interiorringn)

* `ST_GeometryN(gc, N)`(gis-geometrycollection-property-functions.html#function_st-geometryn)

Essas funções de operadores espaciais estão disponíveis:

* `Buffer(g, d [, strategy1 [, strategy2 [, strategy3]]])`(spatial-operator-functions.html#function_buffer)

`ST_Buffer()` e `Buffer()` são sinônimos. Para mais informações, consulte a descrição de `ST_Buffer()`.

`Buffer()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_Buffer()` em vez disso.

* `ConvexHull(g)`

`ST_ConvexHull()` e `ConvexHull()` são sinônimos. Para mais informações, consulte a descrição de `ST_ConvexHull()`.

`ConvexHull()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_ConvexHull()` em vez disso.

* `ST_Buffer(g, d [, strategy1 [, strategy2 [, strategy3]]])`(spatial-operator-functions.html#function_st-buffer)

Retorna uma geometria que representa todos os pontos cuja distância do valor da geometria *`g`* é menor ou igual a uma distância de *`d`*, ou `NULL` se houver algum argumento `NULL`. O SRID do argumento da geometria deve ser 0 porque `ST_Buffer()` suporta apenas o sistema de coordenadas cartesianas. Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

Se o argumento de geometria estiver vazio, `ST_Buffer()` retorna uma geometria vazia.

Se a distância for 0, `ST_Buffer()` retorna o argumento de geometria inalterado:

  ```sql
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 0));
  +------------------------------+
  | ST_AsText(ST_Buffer(@pt, 0)) |
  +------------------------------+
  | POINT(0 0)                   |
  +------------------------------+
  ```

`ST_Buffer()` suporta distâncias negativas para os valores de `Polygon` e `MultiPolygon` e para coleções de geometria que contêm valores de `Polygon` ou `MultiPolygon`. O resultado pode ser uma geometria vazia. Um erro de `ER_WRONG_ARGUMENTS` ocorre para `ST_Buffer()` com uma distância negativa para os valores de `Point`, `MultiPoint`, `LineString` e `MultiLineString`, e para coleções de geometria que não contêm quaisquer valores de `Polygon` ou `MultiPolygon`.

`ST_Buffer()` permite até três argumentos opcionais de estratégia após o argumento de distância. As estratégias influenciam o cálculo do buffer. Esses argumentos são valores de cadeia de bytes produzidos pela função `ST_Buffer_Strategy()`, a serem utilizados para estratégias de ponto, junção e fim:

As estratégias de ponto se aplicam às geometrias `Point` e `MultiPoint`. Se nenhuma estratégia de ponto for especificada, o padrão é `ST_Buffer_Strategy('point_circle', 32)`(spatial-operator-functions.html#function_st-buffer-strategy).

As estratégias de junção se aplicam a geometrias de `LineString`, `MultiLineString`, `Polygon` e `MultiPolygon`. Se nenhuma estratégia de junção for especificada, o padrão é `ST_Buffer_Strategy('join_round', 32)`(spatial-operator-functions.html#function_st-buffer-strategy).

As estratégias de finalização se aplicam às geometrias `LineString` e `MultiLineString`. Se nenhuma estratégia de finalização for especificada, a predefinição é `ST_Buffer_Strategy('end_round', 32)`(spatial-operator-functions.html#function_st-buffer-strategy).

Até uma estratégia de cada tipo pode ser especificada, e elas podem ser dadas em qualquer ordem. Se várias estratégias de um determinado tipo são especificadas, ocorre um erro `ER_WRONG_ARGUMENTS`.

  ```sql
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SET @pt_strategy = ST_Buffer_Strategy('point_square');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 2, @pt_strategy));
  +--------------------------------------------+
  | ST_AsText(ST_Buffer(@pt, 2, @pt_strategy)) |
  +--------------------------------------------+
  | POLYGON((-2 -2,2 -2,2 2,-2 2,-2 -2))       |
  +--------------------------------------------+
  ```

  ```sql
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

`ST_Buffer()` e `Buffer()` são sinônimos.

* `ST_Buffer_Strategy(strategy [, points_per_circle])`(spatial-operator-functions.html#function_st-buffer-strategy)

Essa função retorna uma cadeia de bytes de estratégia para uso com `ST_Buffer()` para influenciar o cálculo do buffer. Se qualquer argumento for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento for inválido, ocorre um erro `ER_WRONG_ARGUMENTS`.

Informações sobre estratégias estão disponíveis em Boost.org.

O primeiro argumento deve ser uma string que indique uma opção de estratégia:

+ Para estratégias de ponto, os valores permitidos são `'point_circle'` e `'point_square'`.

+ Para estratégias de associação, os valores permitidos são `'join_round'` e `'join_miter'`.

+ Para estratégias finais, os valores permitidos são `'end_round'` e `'end_flat'`.

Se o primeiro argumento for `'point_circle'`, `'join_round'`, `'join_miter'` ou `'end_round'`, o argumento *`points_per_circle`* deve ser fornecido como um valor numérico positivo. O valor máximo de *`points_per_circle`* é o valor da variável do sistema `max_points_in_geometry`. Se o primeiro argumento for `'point_square'` ou `'end_flat'`, o argumento *`points_per_circle`* não deve ser fornecido ou ocorre um erro `ER_WRONG_ARGUMENTS`.

Para exemplos, veja a descrição de `ST_Buffer()`.

* `ST_ConvexHull(g)`

Retorna uma geometria que representa a casca convexa do valor de geometria *`g`*. Se o argumento for `NULL`, o valor de retorno é `NULL`.

Essa função calcula a casca convexa de uma geometria, verificando primeiro se seus pontos de vértice são colineares. A função retorna uma casca linear se assim for, e uma casca poligonal caso contrário. Essa função processa coleções de geometria, extraindo todos os pontos de vértice de todos os componentes da coleção, criando um valor `MultiPoint` a partir deles e calculando sua casca convexa. Se o argumento for uma coleção de geometria vazia, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @g = 'MULTIPOINT(5 0,25 0,15 10,15 25)';
  mysql> SELECT ST_AsText(ST_ConvexHull(ST_GeomFromText(@g)));
  +-----------------------------------------------+
  | ST_AsText(ST_ConvexHull(ST_GeomFromText(@g))) |
  +-----------------------------------------------+
  | POLYGON((5 0,25 0,15 25,5 0))                 |
  +-----------------------------------------------+
  ```

`ST_ConvexHull()` e `ConvexHull()` são sinônimos.

* `ST_Difference(g1, g2)`(spatial-operator-functions.html#function_st-difference)

Retorna uma geometria que representa a diferença de conjuntos de geometria dos valores *`g1`* e *`g2`*. Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_AsText(ST_Difference(@g1, @g2));
  +------------------------------------+
  | ST_AsText(ST_Difference(@g1, @g2)) |
  +------------------------------------+
  | POINT(1 1)                         |
  +------------------------------------+
  ```

* `ST_Intersection(g1, g2)`(spatial-operator-functions.html#function_st-intersection)

Retorna uma geometria que representa a interseção do conjunto de valores de geometria *`g1`* e *`g2`*. Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('LineString(1 1, 3 3)');
  mysql> SET @g2 = ST_GeomFromText('LineString(1 3, 3 1)');
  mysql> SELECT ST_AsText(ST_Intersection(@g1, @g2));
  +--------------------------------------+
  | ST_AsText(ST_Intersection(@g1, @g2)) |
  +--------------------------------------+
  | POINT(2 2)                           |
  +--------------------------------------+
  ```

* `ST_SymDifference(g1, g2)`(spatial-operator-functions.html#function_st-symdifference)

Retorna uma geometria que representa a diferença simétrica do conjunto de pontos dos valores de geometria *`g1`* e *`g2`*, que é definida da seguinte forma:

  ```sql
  g1 symdifference g2 := (g1 union g2) difference (g1 intersection g2)
  ```

Ou, na notação de chamada de função:

  ```sql
  ST_SymDifference(g1, g2) = ST_Difference(ST_Union(g1, g2), ST_Intersection(g1, g2))
  ```

Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('MULTIPOINT(5 0,15 10,15 25)');
  mysql> SET @g2 = ST_GeomFromText('MULTIPOINT(1 1,15 10,15 25)');
  mysql> SELECT ST_AsText(ST_SymDifference(@g1, @g2));
  +---------------------------------------+
  | ST_AsText(ST_SymDifference(@g1, @g2)) |
  +---------------------------------------+
  | MULTIPOINT((1 1),(5 0))               |
  +---------------------------------------+
  ```

* `ST_Union(g1, g2)`(spatial-operator-functions.html#function_st-union)

Retorna uma geometria que representa a união do conjunto de valores de geometria *`g1`* e *`g2`*. Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('LineString(1 1, 3 3)');
  mysql> SET @g2 = ST_GeomFromText('LineString(1 3, 3 1)');
  mysql> SELECT ST_AsText(ST_Union(@g1, @g2));
  +--------------------------------------+
  | ST_AsText(ST_Union(@g1, @g2))        |
  +--------------------------------------+
  | MULTILINESTRING((1 1,3 3),(1 3,3 1)) |
  +--------------------------------------+
  ```

### 12.16.9 Funções que testam relações espaciais entre objetos geométricos

As funções descritas nesta seção recebem duas geometrias como argumentos e retornam uma relação qualitativa ou quantitativa entre elas.

O MySQL implementa dois conjuntos de funções usando nomes de funções definidos pela especificação OpenGIS. Um conjunto testa a relação entre dois valores de geometria usando formas de objetos precisas, o outro conjunto usa retângulos mínimos de delimitação de objetos (MBRs).

Há também um conjunto específico de funções com base em MBR disponível para testar a relação entre dois valores de geometria.

#### 12.16.9.1 Funções de Relação Espacial que Utilizam Formas de Objeto

A especificação OpenGIS define as seguintes funções para testar a relação entre dois valores de geometria *`g1`* e *`g2`*, utilizando formas de objetos precisas. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente, exceto para `ST_Distance()` e `Distance()`, que retornam valores de distância.

Essas funções suportam todas as combinações de tipos de argumento, exceto aquelas que não são aplicáveis de acordo com a especificação do Open Geospatial Consortium.

* `Crosses(g1, g2)`(spatial-relation-functions-object-shapes.html#function_crosses)

`ST_Crosses()` e `Crosses()` são sinônimos. Para mais informações, consulte a descrição de `ST_Crosses()`.

`Crosses()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_Crosses()` em vez disso.

* `Distance(g1, g2)`(spatial-relation-functions-object-shapes.html#function_spatial-distance)

`ST_Distance()` e `Distance()` são sinônimos. Para mais informações, consulte a descrição de `ST_Distance()`.

`Distance()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_Distance()` em vez disso.

* `ST_Contains(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-contains)

Devolve 1 ou 0 para indicar se *`g1`* contém completamente *`g2`*. Este teste a relação oposta como `ST_Within()`.

* `ST_Crosses(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-crosses)

O termo *cruza espacialmente* denota uma relação espacial entre duas geometrias dadas que possui as seguintes propriedades:

+ As duas geometrias se intersectam.  
+ Sua intersecção resulta em uma geometria que tem uma dimensão que é menor que a dimensão máxima das duas geometrias dadas.

+ Sua interseção não é igual a nenhuma das duas geometrias dadas.

Essa função retorna 1 ou 0 para indicar se *`g1`* cruza espacialmente *`g2`*. Se *`g1`* é um `Polygon` ou um `MultiPolygon`, ou se *`g2`* é um `Point` ou um `MultiPoint`, o valor de retorno é `NULL`.

Essa função retorna 0 se chamada com uma combinação de tipos de argumento de geometria inapropriada. Por exemplo, ela retorna 0 se o primeiro argumento for um `Polygon` ou `MultiPolygon` e/ou o segundo argumento for um `Point` ou `MultiPoint`.

Retorna 1 se *`g1`* cruzar espacialmente *`g2`*. Retorna `NULL` se *`g1`* é um `Polygon` ou um `MultiPolygon`, ou se *`g2`* é um `Point` ou um `MultiPoint`. Caso contrário, retorna 0.

Essa função retorna 0 se chamada com uma combinação de tipos de argumento de geometria inapropriada. Por exemplo, ela retorna 0 se o primeiro argumento for um `Polygon` ou `MultiPolygon` e/ou o segundo argumento for um `Point` ou `MultiPoint`.

`ST_Crosses()` e `Crosses()` são sinônimos.

* `ST_Disjoint(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-disjoint)

Retorna 1 ou 0 para indicar se *`g1`* é espacialmente disjuntado (não intersecta) *`g2`*.

* `ST_Distance(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-distance)

Retorna a distância entre *`g1`* e *`g2`*. Se qualquer um dos argumentos for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

Essa função processa coleções de geometria, retornando a menor distância entre todas as combinações dos componentes dos dois argumentos de geometria.

Se um resultado intermediário ou final produzir NaN ou um número negativo, ocorre um erro `ER_GIS_INVALID_DATA`.

  ```sql
  mysql> SET @g1 = Point(1,1);
  mysql> SET @g2 = Point(2,2);
  mysql> SELECT ST_Distance(@g1, @g2);
  +-----------------------+
  | ST_Distance(@g1, @g2) |
  +-----------------------+
  |    1.4142135623730951 |
  +-----------------------+
  ```

`ST_Distance()` e `Distance()` são sinônimos.

* `ST_Equals(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-equals)

Retorna 1 ou 0 para indicar se *`g1`* é espacialmente igual a *`g2`*.

  ```sql
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_Equals(@g1, @g1), ST_Equals(@g1, @g2);
  +---------------------+---------------------+
  | ST_Equals(@g1, @g1) | ST_Equals(@g1, @g2) |
  +---------------------+---------------------+
  |                   1 |                   0 |
  +---------------------+---------------------+
  ```

* `ST_Intersects(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-intersects)

Retorna 1 ou 0 para indicar se *`g1`* intersecta espacialmente *`g2`*.

* `ST_Overlaps(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-overlaps)

Duas geometrias *se sobrepõem espacialmente* se elas se intersectam e sua intersecção resulta em uma geometria da mesma dimensão, mas não igual a nenhuma das geometrias dadas.

Essa função retorna 1 ou 0 para indicar se *`g1`* sobrepõe-se espacialmente a *`g2`*.

Essa função retorna 0 se chamada com uma combinação de tipos de argumento de geometria inapropriável. Por exemplo, ela retorna 0 se chamada com geometrias de dimensões diferentes ou qualquer argumento é um `Point`.

* `ST_Touches(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-touches)

Duas geometrias *tocam-se espacialmente* se seus interiores não se intersectam, mas a borda de uma das geometrias intersecta a borda ou o interior da outra.

Essa função retorna 1 ou 0 para indicar se *`g1`* toca espacialmente *`g2`*.

Essa função retorna 0 se chamada com uma combinação de tipos de argumento de geometria inapropriada. Por exemplo, ela retorna 0 se qualquer um dos argumentos for um `Point` ou `MultiPoint`.

`ST_Touches()` e `Touches()` são sinônimos.

* `ST_Within(g1, g2)`(spatial-relation-functions-object-shapes.html#function_st-within)

Retorna 1 ou 0 para indicar se *`g1`* está espacialmente dentro de *`g2`*. Isso testa a relação oposta como `ST_Contains()`.

* `Touches(g1, g2)`(spatial-relation-functions-object-shapes.html#function_touches)

`ST_Touches()` e `Touches()` são sinônimos. Para mais informações, consulte a descrição de `ST_Touches()`.

`Touches()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `ST_Touches()` em vez disso.

#### 12.16.9.2 Funções de Relação Espacial que Utilizam Rectângulos Mínimos de Limiteamento

O MySQL oferece várias funções específicas do MySQL que testam a relação entre os retângulos de delimitação mínima (MBRs) de duas geometrias *`g1`* e *`g2`*. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente.

Um conjunto correspondente de funções de MBR definido de acordo com a especificação OpenGIS é descrito mais adiante nesta seção.

* `MBRContains(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrcontains)

Retorna 1 ou 0 para indicar se o retângulo mínimo de delimitação de *`g1`* contém o retângulo mínimo de delimitação de *`g2`*. Este teste a relação oposta como `MBRWithin()`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))');
  mysql> SET @g2 = ST_GeomFromText('Point(1 1)');
  mysql> SELECT MBRContains(@g1,@g2), MBRWithin(@g2,@g1);
  +----------------------+--------------------+
  | MBRContains(@g1,@g2) | MBRWithin(@g2,@g1) |
  +----------------------+--------------------+
  |                    1 |                  1 |
  +----------------------+--------------------+
  ```

`MBRContains()` e `Contains()` são sinônimos.

* `MBRCoveredBy(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrcoveredby)

Retorna 1 ou 0 para indicar se o retângulo mínimo de delimitação de *`g1`* está coberto pelo retângulo mínimo de delimitação de *`g2`*. Este teste a relação oposta como `MBRCovers()`.

`MBRCoveredBy()` trata seus argumentos da seguinte forma:

+ Se qualquer argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

+ Se qualquer argumento não for uma cadeia de bytes de geometria bem formada sintaticamente, ocorre um erro `ER_GIS_INVALID_DATA`.

+ Caso contrário, o valor de retorno não é `NULL`.

  ```sql
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

* `MBRCovers(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrcovers)

Devolve 1 ou 0 para indicar se o retângulo mínimo de delimitação de *`g1`* cobre o retângulo mínimo de delimitação de *`g2`*. Este teste a relação oposta como `MBRCoveredBy()`. Veja a descrição de `MBRCoveredBy()` para exemplos.

`MBRCovers()` lida com seus argumentos da seguinte forma:

+ Se qualquer argumento for `NULL` ou uma geometria vazia, o valor de retorno é `NULL`.

+ Se qualquer argumento não for uma cadeia de bytes de geometria bem formada sintaticamente, ocorre um erro `ER_GIS_INVALID_DATA`.

+ Caso contrário, o valor de retorno não é `NULL`.

* `MBRDisjoint(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrdisjoint)

Retorna 1 ou 0 para indicar se os retângulos mínimos de delimitação das duas geometrias *`g1`* e *`g2`* são disjuntos (não se intersectam).

`MBRDisjoint()` e `Disjoint()` são sinônimos.

* `MBREqual(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrequal)

Retorna 1 ou 0 para indicar se os retângulos mínimos de delimitação das duas geometrias *`g1`* e *`g2`* são os mesmos.

`MBREqual()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `MBREquals()` em vez disso.

* `MBREquals(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrequals)

Retorna 1 ou 0 para indicar se os retângulos mínimos de delimitação das duas geometrias *`g1`* e *`g2`* são os mesmos.

`MBREquals()`, `MBREqual()` e `Equals()` são sinônimos.

* `MBRIntersects(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrintersects)

Retorna 1 ou 0 para indicar se os retângulos mínimos de delimitação das duas geometrias *`g1`* e *`g2`* se intersectam.

`MBRIntersects()` e `Intersects()` são sinônimos.

* `MBROverlaps(g1, g2)`(spatial-relation-functions-mbr.html#function_mbroverlaps)

Duas geometrias *se sobrepõem espacialmente* se elas se intersectam e sua intersecção resulta em uma geometria da mesma dimensão, mas não igual a nenhuma das geometrias dadas.

Essa função retorna 1 ou 0 para indicar se os retângulos de contorno mínimo das duas geometrias *`g1`* e *`g2`* se sobrepõem.

`MBROverlaps()` e `Overlaps()` são sinônimos.

* `MBRTouches(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrtouches)

Duas geometrias *tocam-se espacialmente* se seus interiores não se intersectam, mas a borda de uma das geometrias intersecta a borda ou o interior da outra.

Essa função retorna 1 ou 0 para indicar se os retângulos de contorno mínimo das duas geometrias *`g1`* e *`g2`* se tocam.

* `MBRWithin(g1, g2)`(spatial-relation-functions-mbr.html#function_mbrwithin)

Retorna 1 ou 0 para indicar se o retângulo mínimo de delimitação de *`g1`* está dentro do retângulo mínimo de delimitação de *`g2`*. Isso testa a relação oposta à de `MBRContains()`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))');
  mysql> SET @g2 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))');
  mysql> SELECT MBRWithin(@g1,@g2), MBRWithin(@g2,@g1);
  +--------------------+--------------------+
  | MBRWithin(@g1,@g2) | MBRWithin(@g2,@g1) |
  +--------------------+--------------------+
  |                  1 |                  0 |
  +--------------------+--------------------+
  ```

`MBRWithin()` e `Within()` são sinônimos.

A especificação OpenGIS define as seguintes funções que testam a relação entre dois valores de geometria *`g1`* e *`g2`*. A implementação MySQL usa retângulos de delimitação mínima, portanto, essas funções retornam o mesmo resultado que as funções baseadas em MBR (Minimum Bounding Rectangle) descritas anteriormente nesta seção. Os valores de retorno 1 e 0 indicam verdadeiro e falso, respectivamente.

Essas funções suportam todas as combinações de tipos de argumento, exceto aquelas que não são aplicáveis de acordo com a especificação do Open Geospatial Consortium.

* `Contains(g1, g2)`(spatial-relation-functions-mbr.html#function_contains)

`MBRContains()` e `Contains()` são sinônimos. Para mais informações, consulte a descrição de `MBRContains()`.

`Contains()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `MBRContains()` em vez disso.

* `Disjoint(g1, g2)`(spatial-relation-functions-mbr.html#function_disjoint)

`MBRDisjoint()` e `Disjoint()` são sinônimos. Para mais informações, consulte a descrição de `MBRDisjoint()`.

`Disjoint()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `MBRDisjoint()` em vez disso.

* `Equals(g1, g2)`(spatial-relation-functions-mbr.html#function_equals)

`MBREquals()` e `Equals()` são sinônimos. Para mais informações, consulte a descrição de `MBREquals()`.

`Equals()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `MBREquals()` em vez disso.

* `Intersects(g1, g2)`(spatial-relation-functions-mbr.html#function_intersects)

`MBRIntersects()` e `Intersects()` são sinônimos. Para mais informações, consulte a descrição de `MBRIntersects()`.

`Intersects()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `MBRIntersects()` em vez disso.

* `Overlaps(g1, g2)`(spatial-relation-functions-mbr.html#function_overlaps)

`MBROverlaps()` e `Overlaps()` são sinônimos. Para mais informações, consulte a descrição de `MBROverlaps()`.

`Overlaps()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `MBROverlaps()` em vez disso.

* `Within(g1, g2)`(spatial-relation-functions-mbr.html#function_within)

`MBRWithin()` e `Within()` são sinônimos. Para mais informações, consulte a descrição de `MBRWithin()`.

`Within()` é descontinuado; espere que ele seja removido em um lançamento futuro do MySQL. Use `MBRWithin()` em vez disso.

### 12.16.10 Funções Geohash Espaciais

Geohash é um sistema para codificar coordenadas de latitude e longitude de precisão arbitrária em uma string de texto. Os valores Geohash são strings que contêm apenas caracteres escolhidos de `"0123456789bcdefghjkmnpqrstuvwxyz"`.

As funções desta seção permitem a manipulação de valores geohash, o que fornece às aplicações a capacidade de importar e exportar dados geohash e de indexar e pesquisar valores geohash.

* `ST_GeoHash(longitude, latitude, max_length)`(spatial-geohash-functions.html#function_st-geohash), `ST_GeoHash(point, max_length)`(spatial-geohash-functions.html#function_st-geohash)

Retorna uma string de geohash no conjunto de caracteres de conexão e na ordenação.

Se qualquer argumento for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento for inválido, ocorre um erro.

Para a primeira sintaxe, o *`longitude`* deve ser um número no intervalo [-180, 180], e o *`latitude`* deve ser um número no intervalo [-90, 90]. Para a segunda sintaxe, é necessário um valor de `POINT`, onde as coordenadas X e Y estão nos intervalos válidos para longitude e latitude, respectivamente.

A string resultante não tem mais do que *`max_length`* caracteres, que tem um limite máximo de 100. A string pode ser mais curta do que *`max_length`* caracteres porque o algoritmo que cria o valor geohash continua até criar uma string que seja uma representação exata da localização ou *`max_length`* caracteres, o que vier primeiro.

  ```sql
  mysql> SELECT ST_GeoHash(180,0,10), ST_GeoHash(-180,-90,15);
  +----------------------+-------------------------+
  | ST_GeoHash(180,0,10) | ST_GeoHash(-180,-90,15) |
  +----------------------+-------------------------+
  | xbpbpbpbpb           | 000000000000000         |
  +----------------------+-------------------------+
  ```

* `ST_LatFromGeoHash(geohash_str)`

Retorna a latitude de um valor de cadeia de geohash, como um valor `DOUBLE` - FLOAT, DOUBLE") na faixa [-90, 90].

Se o argumento for `NULL`, o valor de retorno é `NULL`. Se o argumento for inválido, ocorre um erro.

A função de decodificação `ST_LatFromGeoHash()` não lê mais do que 433 caracteres do argumento *`geohash_str`*. Isso representa o limite superior de informações na representação interna dos valores de coordenadas. Os caracteres além do 433º são ignorados, mesmo que sejam ilegais e produzam um erro.

  ```sql
  mysql> SELECT ST_LatFromGeoHash(ST_GeoHash(45,-20,10));
  +------------------------------------------+
  | ST_LatFromGeoHash(ST_GeoHash(45,-20,10)) |
  +------------------------------------------+
  |                                      -20 |
  +------------------------------------------+
  ```

* `ST_LongFromGeoHash(geohash_str)`

Retorna a longitude de um valor de cadeia de geohash, como um valor `DOUBLE` - FLOAT, DOUBLE") na faixa [-180, 180].

Se o argumento for `NULL`, o valor de retorno é `NULL`. Se o argumento for inválido, ocorre um erro.

As observações na descrição de `ST_LatFromGeoHash()` em relação ao número máximo de caracteres processados a partir do argumento *`geohash_str`* também se aplicam a `ST_LongFromGeoHash()`.

  ```sql
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

Se qualquer argumento for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento for inválido, ocorre um erro.

O argumento *`srid`* é um inteiro de 32 bits não assinado.

As observações na descrição de `ST_LatFromGeoHash()` em relação ao número máximo de caracteres processados a partir do argumento *`geohash_str`* também se aplicam a `ST_PointFromGeoHash()`.

  ```sql
  mysql> SET @gh = ST_GeoHash(45,-20,10);
  mysql> SELECT ST_AsText(ST_PointFromGeoHash(@gh,0));
  +---------------------------------------+
  | ST_AsText(ST_PointFromGeoHash(@gh,0)) |
  +---------------------------------------+
  | POINT(45 -20)                         |
  +---------------------------------------+
  ```

### 12.16.11 Funções GeoJSON Espaciais

Esta seção descreve funções para a conversão entre documentos GeoJSON e valores espaciais. O GeoJSON é um padrão aberto para codificação de características geométricas/geográficas. Para mais informações, consulte <http://geojson.org>. As funções discutidas aqui seguem a revisão da especificação GeoJSON 1.0.

O GeoJSON suporta os mesmos tipos de dados geométricos/geográficos que o MySQL suporta. Os objetos Feature e FeatureCollection não são suportados, exceto que os objetos de geometria são extraídos deles. O suporte ao CRS é limitado a valores que identificam um SRID.

O MySQL também suporta um tipo de dados nativo `JSON` e um conjunto de funções SQL para permitir operações em valores JSON. Para mais informações, consulte a Seção 11.5, “O tipo de dados JSON”, e a Seção 12.17, “Funções JSON”.

* `ST_AsGeoJSON(g [, max_dec_digits [, options]])`(spatial-geojson-functions.html#function_st-asgeojson)

Gera um objeto GeoJSON a partir da geometria *`g`*. A string do objeto tem o conjunto de caracteres de conexão e a correção de caracteres.

Se qualquer argumento for `NULL`, o valor de retorno é `NULL`. Se qualquer argumento que não seja `NULL` for inválido, ocorre um erro.

*`max_dec_digits`*, se especificado, limita o número de dígitos decimais para coordenadas e faz com que o resultado seja arredondado. Se não especificado, este argumento tem como padrão seu valor máximo de 232 −

1. O mínimo é 0.

*`options`*, se especificado, é uma máscara de bits. O seguinte quadro mostra os valores de sinalizador permitidos. Se o argumento de geometria tiver um SRID de 0, nenhum objeto de CRS é produzido, mesmo para aqueles valores de sinalizador que solicitam um.

  <table summary="Option flags for the ST_AsGeoJSON() function."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Flag Value</th> <th>Significado</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem opções. Isso é o padrão se<code>options</code>não é especificado.</td> </tr><tr> <td>1</td> <td>Adicione uma caixa de delimitação à saída.</td> </tr><tr> <td>2</td> <td>Adicione um URN de CRS de formato curto à saída. O formato padrão é um formato curto (<code>EPSG:<code>srid</code></code>).</td> </tr><tr> <td>4</td> <td>Adicione um URN de CRS de formato longo (<code>urn:ogc:def:crs:EPSG::<code>srid</code></code>). Essa bandeira substitui a bandeira 2. Por exemplo, os valores das opções 5 e 7 significam o mesmo (adicionar uma caixa de delimitação e um URN de CRS de formato longo).</td> </tr></tbody></table>

  ```sql
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

  <table summary="Option flags for the ST_GeomFromGeoJSON() function."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Option Value</th> <th>Significado</th> </tr></thead><tbody><tr> <td>1</td> <td>Rejeite o documento e produza um erro. Isso é o padrão se<code>options</code>não é especificado.</td> </tr><tr> <td>2, 3, 4</td> <td>Aceite o documento e elimine as coordenadas para obter dimensões de coordenadas mais altas.</td> </tr></tbody></table>

Os valores *`options`* de 2, 3 e 4 atualmente produzem o mesmo efeito. Se as geometrias com dimensões de coordenadas superiores a 2 forem suportadas no futuro, espera-se que esses valores produzam efeitos diferentes.

O argumento *`srid`*, se fornecido, deve ser um inteiro sem sinal de 32 bits. Se não for fornecido, o valor de geometria de retorno tem um SRID de 4326.

Os objetos de geometria, características e coleções de características GeoJSON podem ter uma propriedade `crs`. A função de análise analisa URNs de CRS nomeados nos namespaces `urn:ogc:def:crs:EPSG::srid` e `EPSG:srid`, mas não CRSs fornecidos como objetos de link. Além disso, `urn:ogc:def:crs:OGC:1.3:CRS84` é reconhecido como SRID 4326. Se um objeto tiver um CRS que não é compreendido, ocorre um erro, com exceção de que, se o argumento opcional *`srid`* for fornecido, qualquer CRS é ignorado, mesmo que seja inválido.

Como especificado na especificação GeoJSON, a análise é sensível ao caso para o membro `type` do GeoJSON de entrada (`Point`, `LineString`, e assim por diante). A especificação é silenciosa em relação à sensibilidade ao caso para outras análises, que no MySQL não é sensível ao caso.

Este exemplo mostra o resultado da análise de um objeto GeoJSON simples:

  ```sql
  mysql> SET @json = '{ "type": "Point", "coordinates": [102.0, 0.0]}';
  mysql> SELECT ST_AsText(ST_GeomFromGeoJSON(@json));
  +--------------------------------------+
  | ST_AsText(ST_GeomFromGeoJSON(@json)) |
  +--------------------------------------+
  | POINT(102 0)                         |
  +--------------------------------------+
  ```

### 12.16.12 Funções de Conveniência Espacial

As funções desta seção oferecem operações de conveniência em valores de geometria.

* `ST_Distance_Sphere(g1, g2 [, radius])`(spatial-convenience-functions.html#function_st-distance-sphere)

Retorna a distância esférica mínima entre dois pontos e/ou vários pontos em uma esfera, em metros, ou `NULL` se algum argumento de geometria for `NULL` ou vazio.

Os cálculos utilizam uma Terra esférica e um raio configurável. O argumento opcional *`radius`* deve ser fornecido em metros. Se omitido, o raio padrão é de 6.370.986 metros. Um erro `ER_WRONG_ARGUMENTS` ocorre se o argumento *`radius`* estiver presente, mas não positivo.

Os argumentos de geometria devem consistir em pontos que especificam valores de coordenadas (longitude, latitude):

+ Longitude e latitude são as primeiras e segundas coordenadas do ponto, respectivamente.

+ Ambas as coordenadas são em graus.  
+ Os valores de longitude devem estar na faixa (-180, 180]. Valores positivos estão a leste do meridiano principal.

+ Os valores de latitude devem estar na faixa [-90, 90]. Valores positivos estão ao norte do equador.

As combinações de argumentos suportadas são (`Point`, `Point`), (`Point`, `MultiPoint`) e (`MultiPoint`, `Point`). Um erro `ER_GIS_UNSUPPORTED_ARGUMENT` ocorre para outras combinações.

Se qualquer argumento de geometria não for uma cadeia de bytes de geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

  ```sql
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

Retorna 1 se o argumento for sintaticamente bem formado e geometricamente válido, 0 se o argumento não for sintaticamente bem formado ou não for geometricamente válido. Se o argumento for `NULL`, o valor de retorno é `NULL`. A validade geométrica é definida pela especificação OGC.

A única geometria vazia válida é representada na forma de um valor de coleção de geometria vazia. `ST_IsValid()` retorna 1 nesse caso.

`ST_IsValid()` funciona apenas para o sistema de coordenadas cartesianas e requer um argumento de geometria com um SRID de 0. Caso contrário, ocorre um erro `ER_WRONG_ARGUMENTS`.

  ```sql
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

Retorna o retângulo que forma o envelope ao redor de dois pontos, como um `Point`, `LineString` ou `Polygon`. Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

Os cálculos são feitos usando o sistema de coordenadas cartesianas, e não em uma esfera, esferoide ou na Terra.

Dado dois pontos *`pt1`* e *`pt2`*, o `ST_MakeEnvelope()` cria o resultado geométrico em um plano abstrato assim:

+ Se *`pt1`* e *`pt2`* forem iguais, o resultado é o ponto *`pt1`*.

Caso contrário, se `(pt1, pt2)` seja um segmento de linha vertical ou horizontal, o resultado é o segmento de linha `(pt1, pt2)`.

Caso contrário, o resultado é um polígono usando *`pt1`* e *`pt2`* como pontos diagonais.

O resultado da geometria tem um SRID de 0.

`ST_MakeEnvelope()` exige argumentos de geometria `Point` com um SRID de 0. Caso contrário, ocorre um erro `ER_WRONG_ARGUMENTS`.

Se qualquer argumento não for uma cadeia de bytes de geometria bem formada sintaticamente, ou se qualquer valor de coordenada dos dois pontos for infinito ou `NaN`, ocorre um erro `ER_GIS_INVALID_DATA`.

  ```sql
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

Simplifica uma geometria usando o algoritmo Douglas-Peucker e retorna um valor simplificado do mesmo tipo. Se qualquer argumento for `NULL`, o valor de retorno é `NULL`.

A geometria pode ser qualquer tipo de geometria, embora o algoritmo de Douglas-Peucker, na verdade, não processe todos os tipos. Uma coleção de geometria é processada, dando seus componentes um a um para o algoritmo de simplificação, e as geometrias devolvidas são colocadas em uma coleção de geometria como resultado.

O argumento *`max_distance`* é a distância (em unidades das coordenadas de entrada) de um vértice para outros segmentos a serem removidos. Os vértices dentro desta distância das linhas simplificadas são removidos. Se o argumento *`max_distance`* não for positivo ou for `NaN`, ocorre um erro `ER_WRONG_ARGUMENTS`.

De acordo com o Boost.Geometry, as geometrias podem se tornar inválidas como resultado do processo de simplificação, e o processo pode criar autointerseções. Para verificar a validade do resultado, passe-o para `ST_IsValid()`.

Se o argumento de geometria não for uma cadeia de bytes de geometria bem formada sintaticamente, ocorre um erro `ER_GIS_INVALID_DATA`.

  ```sql
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

`ST_Validate()` funciona apenas para o sistema de coordenadas cartesianas e requer um argumento de geometria com um SRID de 0. Caso contrário, ocorre um erro `ER_WRONG_ARGUMENTS`.

  ```sql
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
