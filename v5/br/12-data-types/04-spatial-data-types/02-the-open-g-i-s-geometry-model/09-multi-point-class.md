#### 11.4.2.9 Classe MultiPoint

Um `MultiPonto` é uma coleção de geometria composta por elementos `Ponto`. Os pontos não estão conectados ou ordenados de nenhuma maneira.

**Exemplos de `MultiPoint`**

- Em um mapa do mundo, um `MultiPoint` poderia representar uma cadeia de pequenas ilhas.

- Em um mapa da cidade, um `MultiPoint` poderia representar as saídas de uma bilheteria.

**Propriedades do `MultiPoint`**

- Um `MultiPonto` é uma geometria de dimensão zero.

- Um `MultiPonto` é simples se nenhum dos seus valores `Ponto` for igual (ter valores de coordenadas idênticos).

- A fronteira de um `MultiPonto` é o conjunto vazio.
