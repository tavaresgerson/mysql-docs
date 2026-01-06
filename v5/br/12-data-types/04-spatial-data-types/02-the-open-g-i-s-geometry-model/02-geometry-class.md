#### 11.4.2.2 Classe de Geometria

`Geometry` é a classe raiz da hierarquia. É uma classe não instanciável, mas possui uma série de propriedades, descritas na lista a seguir, que são comuns a todos os valores de geometria criados a partir de qualquer uma das subclasses de `Geometry`. Subclasses específicas têm suas próprias propriedades específicas, descritas mais adiante.

**Propriedades da Geometria**

Um valor de geometria tem as seguintes propriedades:

- Seu **tipo**. Cada geometria pertence a uma das classes instanciáveis na hierarquia.

- Seu **SRID**, ou identificador de referência espacial. Esse valor identifica o sistema de referência espacial associado à geometria, que descreve o espaço de coordenadas no qual o objeto de geometria é definido.

  No MySQL, o valor SRID é um inteiro associado ao valor de geometria. O valor máximo utilizável do SRID é 232−1. Se for fornecido um valor maior, apenas os 32 bits inferiores são usados. Todos os cálculos são feitos assumindo SRID 0, independentemente do valor real do SRID. O SRID 0 representa um plano cartesiano plano infinito sem unidades atribuídas aos seus eixos.

- Suas **coordenadas** em seu sistema de referência espacial, representadas como números de dupla precisão (8 bytes). Todas as geometrias não vazias incluem pelo menos um par de coordenadas (X, Y). Geometrias vazias não contêm coordenadas.

  As coordenadas estão relacionadas ao SRID. Por exemplo, em diferentes sistemas de coordenadas, a distância entre dois objetos pode variar mesmo quando os objetos têm as mesmas coordenadas, porque a distância no sistema de coordenadas **plana** e a distância no sistema **geodésico** (coordenadas na superfície da Terra) são coisas diferentes.

- Seu **interior**, **fronteira** e **exterior**.

  Cada geometria ocupa uma posição no espaço. O exterior de uma geometria é todo o espaço que não é ocupado pela geometria. O interior é o espaço ocupado pela geometria. A borda é a interface entre o interior e o exterior da geometria.

- Seu **MBR** (retângulo mínimo de delimitação) ou envelope. Esta é a geometria de delimitação, formada pelas coordenadas mínimas e máximas (X, Y):

  ```sql
  ((MINX MINY, MAXX MINY, MAXX MAXY, MINX MAXY, MINX MINY))
  ```

- Se o valor for **simples** ou **não simples**. Os valores de geometria dos tipos (`LineString`, `MultiPoint`, `MultiLineString`) são simples ou não simples. Cada tipo determina suas próprias asserções para ser simples ou não simples.

- Se o valor for **fechado** ou **não fechado**. Os valores de geometria dos tipos (`LineString`, `MultiString`) são fechados ou não fechados. Cada tipo determina suas próprias asserções para ser fechado ou não fechado.

- Se o valor for **vazio** ou **não vazio** Uma geometria é vazia se não tiver nenhum ponto. O exterior, interior e limite de uma geometria vazia não são definidos (ou seja, são representados por um valor `NULL`). Uma geometria vazia é definida como sempre simples e tem uma área de 0.

- Sua **dimenso**ão. Uma geometria pode ter uma dimensão de -1, 0, 1 ou 2:

  - −1 para uma geometria vazia.
  - 0 para uma geometria sem comprimento e sem área.
  - 1 para uma geometria com comprimento não nulo e área zero.
  - 2 para uma geometria com área não nula.

  Os objetos `Ponto` têm uma dimensão de zero. Os objetos `Linha de String` têm uma dimensão de

  1. Os objetos `Polygon` têm uma dimensão de
  2. As dimensões dos objetos `MultiPoint`, `MultiLineString` e `MultiPolygon` são as mesmas das dimensões dos elementos que eles compõem.
