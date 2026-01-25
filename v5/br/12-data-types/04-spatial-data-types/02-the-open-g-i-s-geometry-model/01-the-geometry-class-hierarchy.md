#### 11.4.2.1 A Hierarquia de Classes Geometry

As classes Geometry definem uma hierarquia da seguinte forma:

* `Geometry` (não instanciável)

  + `Point` (instanciável)
  + `Curve` (não instanciável)

    - `LineString` (instanciável)

      * `Line`
      * `LinearRing`
  + `Surface` (não instanciável)

    - `Polygon` (instanciável)
  + `GeometryCollection` (instanciável)

    - `MultiPoint` (instanciável)
    - `MultiCurve` (não instanciável)

      * `MultiLineString` (instanciável)

    - `MultiSurface` (não instanciável)

      * `MultiPolygon` (instanciável)

Não é possível criar objetos em classes não instanciáveis. É possível criar objetos em classes instanciáveis. Todas as classes possuem propriedades, e classes instanciáveis também podem ter *assertions* (regras que definem instâncias de classe válidas).

`Geometry` é a classe base. É uma classe abstrata. As subclasses instanciáveis de `Geometry` são restritas a objetos geométricos de zero, uma ou duas dimensões que existem no espaço de coordenadas bidimensional. Todas as classes *Geometry* instanciáveis são definidas de modo que instâncias válidas de uma classe *Geometry* sejam topologicamente fechadas (ou seja, todas as geometrias definidas incluem seu contorno).

A classe base `Geometry` possui subclasses para `Point`, `Curve`, `Surface` e `GeometryCollection`:

* `Point` representa objetos de dimensão zero.

* `Curve` representa objetos unidimensionais e tem a subclasse `LineString`, com as sub-subclasses `Line` e `LinearRing`.

* `Surface` é projetada para objetos bidimensionais e tem a subclasse `Polygon`.

* `GeometryCollection` possui classes de coleção especializadas de zero, uma e duas dimensões, denominadas `MultiPoint`, `MultiLineString` e `MultiPolygon`, para modelar geometrias correspondentes a coleções de `Points`, `LineStrings` e `Polygons`, respectivamente. `MultiCurve` e `MultiSurface` são introduzidas como superclasses abstratas que generalizam as interfaces de coleção para manipular `Curves` e `Surfaces`.

`Geometry`, `Curve`, `Surface`, `MultiCurve` e `MultiSurface` são definidas como classes não instanciáveis. Elas definem um conjunto comum de métodos para suas subclasses e estão incluídas para fins de extensibilidade.

`Point`, `LineString`, `Polygon`, `GeometryCollection`, `MultiPoint`, `MultiLineString` e `MultiPolygon` são classes instanciáveis.