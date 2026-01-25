#### 11.4.2.9 Classe MultiPoint

Um `MultiPoint` é uma coleção de geometria composta por elementos `Point`. Os pontos não estão conectados ou ordenados de forma alguma.

**Exemplos de `MultiPoint`**

* Em um mapa mundial, um `MultiPoint` pode representar uma cadeia de pequenas ilhas.

* Em um mapa da cidade, um `MultiPoint` pode representar os pontos de venda de uma bilheteria.

**Propriedades de `MultiPoint`**

* Um `MultiPoint` é uma geometria de dimensão zero.

* Um `MultiPoint` é simples se não houver dois de seus valores `Point` iguais (tiverem valores de coordenada idênticos).

* O Boundary de um `MultiPoint` é o conjunto vazio.