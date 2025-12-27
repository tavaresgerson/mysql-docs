#### 13.4.2.9 Classe MultiPonto

Um `MultiPonto` é uma coleção de geometria composta por elementos `Ponto`. Os pontos não estão conectados ou ordenados de nenhuma maneira.

**Exemplos de `MultiPonto`**

* Em um mapa do mundo, um `MultiPonto` poderia representar uma cadeia de pequenas ilhas.

* Em um mapa de uma cidade, um `MultiPonto` poderia representar as saídas de uma bilheteria.

**Propriedades de `MultiPonto`**

* Um `MultiPonto` é uma geometria de zero dimensão.

* Um `MultiPonto` é simples se nenhum dos seus valores de `Ponto` for igual (ter valores de coordenadas idênticos).

* A fronteira de um `MultiPonto` é o conjunto vazio.