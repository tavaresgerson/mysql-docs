#### 13.4.2.9 Classe `MultiPoint`

Uma `MultiPoint` é uma coleção de geometria composta por elementos `Point`. Os pontos não estão conectados ou ordenados de nenhuma maneira.

**Exemplos de `MultiPoint`**

* Em um mapa do mundo, uma `MultiPoint` poderia representar uma cadeia de pequenas ilhas.
* Em um mapa de uma cidade, uma `MultiPoint` poderia representar as saídas de uma bilheteria.

**Propriedades de `MultiPoint`**

* Uma `MultiPoint` é uma geometria de zero dimensão.
* Uma `MultiPoint` é simples se nenhum dos seus valores `Point` for igual (ter valores de coordenadas idênticos).
* A fronteira de uma `MultiPoint` é o conjunto vazio.