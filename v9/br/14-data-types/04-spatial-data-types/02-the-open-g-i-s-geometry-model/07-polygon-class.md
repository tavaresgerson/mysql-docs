#### 13.4.2.7 Classe Polygon

Um `Polygon` é uma `Superfície` plana que representa uma geometria de vários lados. Ele é definido por um único contorno exterior e zero ou mais limites internos, onde cada limite interno define uma abertura no `Polygon`.

**Exemplos de `Polygon`**

* Em um mapa de região, os objetos `Polygon` poderiam representar florestas, distritos, e assim por diante.

**Afirmações de `Polygon`**

* O contorno de um `Polygon` é composto por um conjunto de objetos `LinearRing` (ou seja, objetos `LineString` que são simples e fechados) que compõem seus limites exteriores e internos.

* Um `Polygon` não possui anéis que se cruzam. Os anéis no contorno de um `Polygon` podem se intersectar em um `Ponto`, mas apenas como tangente.

* Um `Polygon` não possui linhas, pontas ou perfurações.

* Um `Polygon` possui um interior que é um conjunto de pontos conectados.

* Um `Polygon` pode ter aberturas. O exterior de um `Polygon` com aberturas não é conectado. Cada abertura define um componente conectado do exterior.

As afirmações anteriores tornam um `Polygon` uma geometria simples.