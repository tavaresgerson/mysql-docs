#### 11.4.2.2 Classe Geometry

`Geometry` é a classe raiz da hierarquia. É uma classe não instanciável, mas possui várias propriedades, descritas na lista a seguir, que são comuns a todos os valores `geometry` criados a partir de qualquer uma das subclasses de `Geometry`. Subclasses específicas têm suas próprias propriedades específicas, descritas posteriormente.

**Propriedades de Geometry**

Um valor `geometry` possui as seguintes propriedades:

* Seu **tipo**. Cada `geometry` pertence a uma das classes instanciáveis na hierarquia.

* Seu **SRID**, ou identificador de referência espacial. Este valor identifica o sistema de referência espacial associado ao `geometry` que descreve o espaço de coordenadas no qual o objeto `geometry` é definido.

  No MySQL, o valor do `SRID` é um inteiro associado ao valor `geometry`. O valor máximo de `SRID` utilizável é 2^32−1. Se um valor maior for fornecido, apenas os 32 bits inferiores serão usados. Todos os cálculos são feitos assumindo `SRID 0`, independentemente do valor real do `SRID`. `SRID 0` representa um plano Cartesiano plano infinito sem unidades atribuídas aos seus eixos.

* Suas **coordenadas** em seu sistema de referência espacial, representadas como números de precisão dupla (8 bytes). Todos os geometries não vazios incluem pelo menos um par de coordenadas (X,Y). Geometries vazios não contêm coordenadas.

  As Coordenadas estão relacionadas ao `SRID`. Por exemplo, em diferentes sistemas de coordenadas, a distância entre dois objetos pode diferir mesmo quando os objetos têm as mesmas coordenadas, porque a distância no sistema de coordenadas **planar** e a distância no sistema **geodético** (coordenadas na superfície da Terra) são coisas diferentes.

* Seu **interior**, **boundary** e **exterior**.

  Cada `geometry` ocupa alguma posição no espaço. O exterior de um `geometry` é todo o espaço não ocupado pelo `geometry`. O interior é o espaço ocupado pelo `geometry`. O `boundary` é a interface entre o interior e o exterior do `geometry`.

* Seu **MBR** (minimum bounding rectangle), ou envelope. Este é o `geometry` delimitador, formado pelas coordenadas mínimas e máximas (X,Y):

  ```sql
  ((MINX MINY, MAXX MINY, MAXX MAXY, MINX MAXY, MINX MINY))
  ```

* Se o valor é **simple** ou **nonsimple**. Valores `geometry` dos tipos (`LineString`, `MultiPoint`, `MultiLineString`) são `simple` ou `nonsimple`. Cada tipo determina suas próprias asserções para ser `simple` ou `nonsimple`.

* Se o valor é **closed** ou **not closed**. Valores `geometry` dos tipos (`LineString`, `MultiString`) são `closed` ou `not closed`. Cada tipo determina suas próprias asserções para ser `closed` ou `not closed`.

* Se o valor é **empty** ou **nonempty**. Um `geometry` é `empty` se não tiver nenhum `point`. Exterior, interior e `boundary` de um `geometry empty` não são definidos (ou seja, são representados por um valor `NULL`). Um `geometry empty` é definido como sempre `simple` e tem uma área de 0.

* Sua **dimension**. Um `geometry` pode ter uma `dimension` de −1, 0, 1 ou 2:

  + −1 para um `geometry empty`.
  + 0 para um `geometry` sem comprimento e sem área.
  + 1 para um `geometry` com comprimento diferente de zero e área zero.
  + 2 para um `geometry` com área diferente de zero.

  Objetos `Point` têm `dimension` zero. Objetos `LineString` têm `dimension` 1. Objetos `Polygon` têm `dimension` 2. As `dimensions` dos objetos `MultiPoint`, `MultiLineString` e `MultiPolygon` são as mesmas das `dimensions` dos elementos que os compõem.