#### 13.4.2.7 Classe Polygon

Um `Polygon` é um `Surface` plano que representa uma geometria multifacetada. Ele é definido por uma única borda externa e zero ou mais bordas internas, onde cada borda interna define um furo no `Polygon`.

**`Polygon` Exemplos**

- Em um mapa da região, os objetos `Polygon` poderiam representar florestas, distritos, e assim por diante.

**`Polygon` Afirmações**

- A fronteira de um `Polygon` é composta por um conjunto de objetos `LinearRing` (ou seja, objetos `LineString` que são simples e fechados) que compõem suas fronteiras externas e internas.

- Um `Polygon` não tem anéis que se cruzam. Os anéis na borda de um `Polygon` podem se cruzar em um `Point`, mas apenas como tangente.

- Um `Polygon` não tem linhas, picos ou perfurações.

- Um `Polygon` tem um interior que é um conjunto de pontos conectados.

- Um `Polygon` pode ter furos. O exterior de um `Polygon` com furos não está conectado. Cada furo define um componente conectado do exterior.

As afirmações anteriores tornam um `Polygon` uma geometria simples.
