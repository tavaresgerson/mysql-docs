#### 11.4.2.7 Classe Polygon

Um `Polygon` é um `Surface` planar que representa uma geometria multilátera. Ele é definido por um único limite exterior e zero ou mais limites interiores, onde cada limite interior define um buraco no `Polygon`.

**Exemplos de `Polygon`**

* Em um mapa regional, objetos `Polygon` podem representar florestas, distritos e assim por diante.

**Asserções de `Polygon`**

* O limite de um `Polygon` consiste em um conjunto de objetos `LinearRing` (ou seja, objetos `LineString` que são simultaneamente simples e fechados) que compõem seus limites exterior e interior.

* Um `Polygon` não possui anéis que se cruzem. Os anéis no limite de um `Polygon` podem se intersectar em um `Point`, mas apenas como uma tangente.

* Um `Polygon` não possui linhas, pontas ou perfurações.

* Um `Polygon` tem um interior que é um conjunto de pontos conectado.

* Um `Polygon` pode ter buracos. O exterior de um `Polygon` com buracos não é conectado. Cada buraco define um componente conectado do exterior.

As asserções precedentes tornam um `Polygon` uma geometria simples.