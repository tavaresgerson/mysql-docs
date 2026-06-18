#### 13.4.2.13 Classe MultiPolygon

Um `MultiPolygon` é um objeto `MultiSurface` composto por elementos `Polygon`.

**`MultiPolygon` Exemplos**

- Em um mapa da região, um `MultiPolygon` poderia representar um sistema de lagos.

**`MultiPolygon` Afirmações**

- Um `MultiPolygon` não tem dois elementos `Polygon` com interiores que se intersectam.

- Um `MultiPolygon` não tem dois elementos `Polygon` que se cruzam (a interseção também é proibida pela afirmação anterior) ou que tocam em um número infinito de pontos.

- Um `MultiPolygon` não pode ter linhas cortadas, pontas ou perfurações. Um `MultiPolygon` é um conjunto de pontos regular e fechado.

- Um `MultiPolygon` que tem mais de um `Polygon` tem um interior que não está conectado. O número de componentes conectados do interior de um `MultiPolygon` é igual ao número de valores de `Polygon` no `MultiPolygon`.

**`MultiPolygon` Propriedades**

- Um `MultiPolygon` é uma geometria bidimensional.

- Uma `MultiPolygon` fronteira é um conjunto de curvas fechadas (valores `LineString`), correspondentes às fronteiras de seus elementos `Polygon`.

- Cada `Curve` na borda do `MultiPolygon` está na borda de exatamente um elemento `Polygon`.

- Cada `Curve` na borda de um elemento `Polygon` está na borda do `MultiPolygon`.
