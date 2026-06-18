#### 13.4.2.9 Classe MultiPoint

Um `MultiPoint` é uma coleção de geometria composta por elementos `Point`. Os pontos não estão conectados ou ordenados de qualquer maneira.

**`MultiPoint` Exemplos**

- Em um mapa do mundo, um `MultiPoint` poderia representar uma cadeia de pequenas ilhas.

- Em um mapa da cidade, um `MultiPoint` poderia representar as caixas de atendimento de bilhetes.

**`MultiPoint` Propriedades**

- Um `MultiPoint` é uma geometria de dimensão zero.

- Um `MultiPoint` é simples se nenhum dos seus valores `Point` são iguais (têm valores de coordenadas idênticos).

- A fronteira de um `MultiPoint` é o conjunto vazio.
