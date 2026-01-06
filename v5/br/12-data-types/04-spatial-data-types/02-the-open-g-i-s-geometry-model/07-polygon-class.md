#### 11.4.2.7 Classe Polygon

Um `Poligono` é uma `Superfície` plana que representa uma geometria de várias faces. Ele é definido por uma única borda externa e zero ou mais bordas internas, onde cada borda interna define um buraco no `Poligono`.

**Exemplos de `Polygon`**

- Em um mapa regional, os objetos `Polygon` poderiam representar florestas, distritos, e assim por diante.

**Afirmações `Polygon`**

- A borda de um `Polygon` é composta por um conjunto de objetos `LinearRing` (ou seja, objetos `LineString` que são simples e fechados), que compõem suas bordas externas e internas.

- Um `Polygon` não tem anéis que se cruzam. Os anéis na borda de um `Polygon` podem se cruzar em um `Ponto`, mas apenas como tangente.

- Um `Poligono` não tem linhas, espinhos ou perfurações.

- Um `Poligono` tem um interior que é um conjunto de pontos conectados.

- Um `Polygon` pode ter buracos. O exterior de um `Polygon` com buracos não está conectado. Cada buraco define um componente conectado do exterior.

As afirmações anteriores fazem de um `Polygon` uma geometria simples.
