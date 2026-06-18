#### 11.4.2.4 Classe Curve

Uma `Curve` é uma geometry unidimensional, geralmente representada por uma sequência de points. Subclasses particulares de `Curve` definem o tipo de interpolação entre os points. `Curve` é uma classe não instanciável.

**Propriedades da Curve**

* Uma `Curve` possui as coordenadas de seus points.

* Uma `Curve` é definida como uma geometry unidimensional.

* Uma `Curve` é simple se ela não passa pelo mesmo point duas vezes, com a exceção de que uma curve ainda pode ser simple se os points de início (start) e fim (end) forem os mesmos.

* Uma `Curve` é closed se seu point de início for igual ao seu endpoint.

* O boundary de uma `Curve` closed é vazio.

* O boundary de uma `Curve` não closed consiste em seus dois endpoints.

* Uma `Curve` que é simple e closed é um `LinearRing`.