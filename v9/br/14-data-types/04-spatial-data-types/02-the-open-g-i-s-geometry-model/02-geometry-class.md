#### 13.4.2.2 Classe de Geometria

`Geometry` é a classe raiz da hierarquia. É uma classe não instanciável, mas possui uma série de propriedades, descritas na lista a seguir, que são comuns a todos os valores de geometria criados a partir de qualquer uma das subclasses de `Geometry`. Subclasses específicas têm suas próprias propriedades específicas, descritas mais adiante.

**Propriedades da Geometria**

Um valor de geometria possui as seguintes propriedades:

* Seu **tipo**. Cada geometria pertence a uma das classes instanciáveis na hierarquia.

* Seu **SRID**, ou identificador de referência espacial. Esse valor identifica o sistema de referência espacial associado à geometria, que descreve o espaço de coordenadas no qual o objeto de geometria é definido.

  No MySQL, o valor SRID é um inteiro associado ao valor de geometria. O valor máximo de SRID utilizável é 232−1. Se um valor maior for fornecido, apenas os 32 bits inferiores são usados.

  SRID 0 representa um plano cartesiano plano infinito sem unidades atribuídas aos seus eixos. Para garantir o comportamento de SRID 0, crie valores de geometria usando SRID 0. SRID 0 é o padrão para novos valores de geometria se nenhum SRID for especificado.

  Para cálculos em múltiplos valores de geometria, todos os valores devem ter o mesmo SRID ou ocorrerá um erro.

* Suas **coordenadas** em seu sistema de referência espacial, representadas como números de ponto flutuante (8 bytes). Todas as geometrias não vazias incluem pelo menos um par de coordenadas (X, Y). Geometrias vazias não contêm coordenadas.

  As coordenadas estão relacionadas ao SRID. Por exemplo, em diferentes sistemas de coordenadas, a distância entre dois objetos pode diferir mesmo quando os objetos têm as mesmas coordenadas, porque a distância no sistema de coordenadas **plana** e a distância no sistema **geodésico** (coordenadas na superfície da Terra) são coisas diferentes.

* Seu **interior**, **fronteira** e **exterior**.

  Cada geometria ocupa uma posição no espaço. O exterior de uma geometria é todo o espaço não ocupado pela geometria. O interior é o espaço ocupado pela geometria. A fronteira é a interface entre o interior e o exterior da geometria.

* Seu **MBR** (retângulo de limite mínimo) ou envelope. Este é o limite da geometria, formado pelas coordenadas mínimas e máximas (X, Y):

  ```
  ((MINX MINY, MAXX MINY, MAXX MAXY, MINX MAXY, MINX MINY))
  ```

* Se o valor é **simples** ou **não simples**. Os valores de geometria dos tipos (`LineString`, `MultiPoint`, `MultiLineString`) são simples ou não simples. Cada tipo determina suas próprias asserções para ser simples ou não simples.

* Se o valor é **fechado** ou **não fechado**. Os valores de geometria dos tipos (`LineString`, `MultiString`) são fechados ou não fechados. Cada tipo determina suas próprias asserções para ser fechado ou não fechado.

* Se o valor é **vazio** ou **não vazio**. Uma geometria é vazia se não tiver nenhum ponto. O exterior, interior e fronteira de uma geometria vazia não são definidos (ou seja, são representados por um valor `NULL`). Uma geometria vazia é definida como sempre simples e tem uma área de 0.

* Sua **dimensão**. Uma geometria pode ter uma dimensão de −1, 0, 1 ou 2:

  + −1 para uma geometria vazia.
  + 0 para uma geometria sem comprimento e sem área.
  + 1 para uma geometria com comprimento não nulo e área zero.
  + 2 para uma geometria com área não nulo.

  Objetos `Point` têm uma dimensão de zero. Objetos `LineString` têm uma dimensão de

  1. Objetos `Polygon` têm uma dimensão de
  2. As dimensões dos objetos `MultiPoint`, `MultiLineString` e `MultiPolygon` são as mesmas das dimensões dos elementos que eles consistem.