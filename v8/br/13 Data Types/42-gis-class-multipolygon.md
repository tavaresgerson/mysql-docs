#### 13.4.2.13 Classe `MultiPolygon`

Uma `MultiPolygon` é um objeto `MultiSurface` composto por elementos `Polygon`.

**Exemplos de `MultiPolygon`**

* Em um mapa de região, uma `MultiPolygon` pode representar um sistema de lagos.

**Afirmações de `MultiPolygon`**

* Uma `MultiPolygon` não tem dois elementos `Polygon` com interiores que se intersectam.
* Uma `MultiPolygon` não tem dois elementos `Polygon` que se cruzam (a interseção também é proibida pela afirmação anterior), ou que se tocam em um número infinito de pontos.
* Uma `MultiPolygon` não pode ter linhas cortadas, espinhos ou perfurações. Uma `MultiPolygon` é um conjunto de pontos regular e fechado.
* Uma `MultiPolygon` que tem mais de um `Polygon` tem um interior que não é conectado. O número de componentes conectadas do interior de uma `MultiPolygon` é igual ao número de valores `Polygon` na `MultiPolygon`.

**Propriedades de `MultiPolygon`**

* Uma `MultiPolygon` é uma geometria bidimensional.
* A fronteira de uma `MultiPolygon` é um conjunto de curvas fechadas (`LineString` valores) correspondentes às fronteiras de seus elementos `Polygon`.
* Cada `Curve` na fronteira do elemento `Polygon` está na fronteira de exatamente um elemento `Polygon`.
* Cada `Curve` na fronteira de um elemento `Polygon` está na fronteira da `MultiPolygon`.