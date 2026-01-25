#### 11.4.2.13 Classe MultiPolygon

Um `MultiPolygon` é um objeto `MultiSurface` composto por elementos `Polygon`.

**Exemplos de `MultiPolygon`**

* Em um mapa de região, um `MultiPolygon` pode representar um sistema de lagos.

**Asserções de `MultiPolygon`**

* Um `MultiPolygon` não possui dois elementos `Polygon` cujos interiores se intersectam.

* Um `MultiPolygon` não possui dois elementos `Polygon` que se cruzem (o cruzamento também é proibido pela asserção anterior) ou que se toquem em um número infinito de pontos.

* Um `MultiPolygon` não pode ter linhas de corte, picos ou perfurações (punctures). Um `MultiPolygon` é um conjunto de pontos regular e fechado.

* Um `MultiPolygon` que possui mais de um `Polygon` tem um interior que não é conectado. O número de componentes conectados do interior de um `MultiPolygon` é igual ao número de valores `Polygon` no `MultiPolygon`.

**Propriedades de `MultiPolygon`**

* Um `MultiPolygon` é uma geometria bidimensional.

* O limite (boundary) de um `MultiPolygon` é um conjunto de curvas fechadas (valores `LineString`) correspondentes aos limites de seus elementos `Polygon`.

* Cada `Curve` no limite do `MultiPolygon` está no limite de exatamente um elemento `Polygon`.

* Toda `Curve` no limite de um elemento `Polygon` está no limite do `MultiPolygon`.