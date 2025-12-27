#### 13.4.2.1 A Hierarquia das Classes de Geometria

As classes de geometria definem uma hierarquia da seguinte forma:

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

Não é possível criar objetos em classes não instanciáveis. É possível criar objetos em classes instanciáveis. Todas as classes têm propriedades, e as classes instanciáveis também podem ter asserções (regras que definem instâncias válidas de uma classe).

`Geometry` é a classe base. É uma classe abstrata. As subclasses instanciáveis de `Geometry` são restritas a objetos geométricos de zero, um e dois dimensões que existem no espaço de coordenadas bidimensional. Todas as classes de geometria instanciáveis são definidas de modo que as instâncias válidas de uma classe de geometria são topologicamente fechadas (ou seja, todas as geometrias definidas incluem sua borda).

A classe base `Geometry` tem subclasses para `Point`, `Curve`, `Surface` e `GeometryCollection`:

* `Point` representa objetos de dimensão zero.
* `Curve` representa objetos de dimensão um, e tem a subclasse `LineString`, com sub-subclasses `Line` e `LinearRing`.
* `Surface` é projetada para objetos de dimensão dois e tem a subclasse `Polygon`.

* `GeometryCollection` possui classes especializadas de coleção de zero, um e dois dimensões chamadas `MultiPoint`, `MultiLineString` e `MultiPolygon`, para modelar geometrias correspondentes a coleções de `Pontos`, `LineStrings` e `Polígonos`, respectivamente. `MultiCurve` e `MultiSurface` são introduzidas como superclasses abstratas que generalizam as interfaces de coleção para lidar com `Curvas` e `Superfícies`.

`Geometry`, `Curve`, `Surface`, `MultiCurve` e `MultiSurface` são definidas como classes não instanciáveis. Elas definem um conjunto comum de métodos para suas subclasses e são incluídas para extensibilidade.

`Point`, `LineString`, `Polygon`, `GeometryCollection`, `MultiPoint`, `MultiLineString` e `MultiPolygon` são classes instanciáveis.