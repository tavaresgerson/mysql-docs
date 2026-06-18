#### 11.4.2.5 Classe LineString

Uma `LineString` é uma `Curve` com interpolação linear entre pontos.

**Exemplos de LineString**

* Em um mapa mundial, objetos `LineString` podem representar rios.

* Em um mapa da cidade, objetos `LineString` podem representar ruas.

**Propriedades de LineString**

* Uma `LineString` possui coordenadas de segmentos, definidas por cada par consecutivo de pontos.

* Uma `LineString` é uma `Line` se consistir de exatamente dois pontos.

* Uma `LineString` é um `LinearRing` se for simultaneamente fechada (`closed`) e simples (`simple`).