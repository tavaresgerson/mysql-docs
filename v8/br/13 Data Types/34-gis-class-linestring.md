#### 13.4.2.5 Classe `LineString`

Uma `LineString` é uma `Curve` com interpolação linear entre pontos.

**Exemplos de `LineString`**

* Em um mapa mundial, os objetos `LineString` poderiam representar rios.
* Em um mapa de uma cidade, os objetos `LineString` poderiam representar ruas.

**Propriedades de `LineString`**

* Uma `LineString` tem coordenadas de segmentos, definidas por cada par consecutivo de pontos.
* Uma `LineString` é uma `Line` se consistir exatamente em dois pontos.
* Uma `LineString` é uma `LinearRing` se for fechada e simples.