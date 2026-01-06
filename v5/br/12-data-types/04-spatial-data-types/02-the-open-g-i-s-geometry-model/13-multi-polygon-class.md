#### 11.4.2.13 Classe MultiPolygon

Um `MultiPolygon` é um objeto `MultiSurface` composto por elementos `Polygon`.

**Exemplos de `MultiPolygon`**

- Em um mapa regional, um `MultiPolygon` poderia representar um sistema de lagos.

**Afirmações `MultiPolygon`**

- Um `MultiPolygon` não tem dois elementos `Polygon` com interiores que se intersectam.

- Um `MultiPolygon` não tem dois elementos `Polygon` que se cruzam (a interseção também é proibida pela afirmação anterior) ou que tocam em um número infinito de pontos.

- Uma `MultiPolygon` não pode ter linhas de corte, espinhos ou perfurações. Uma `MultiPolygon` é um conjunto de pontos regular e fechado.

- Um `MultiPolygon` que tem mais de um `Polygon` tem um interior que não está conectado. O número de componentes conectados do interior de um `MultiPolygon` é igual ao número de valores de `Polygon` na `MultiPolygon`.

**Propriedades de `MultiPolygon`**

- Um `MultiPolygon` é uma geometria bidimensional.

- Uma fronteira `MultiPolygon` é um conjunto de curvas fechadas (`LineString` valores) que correspondem às fronteiras dos seus elementos `Polygon`.

- Cada `Curva` na borda da `MultiPolygon` está na borda de exatamente um elemento `Polygon`.

- Cada `Curva` na borda de um elemento `Polygon` está na borda do `MultiPolygon`.
