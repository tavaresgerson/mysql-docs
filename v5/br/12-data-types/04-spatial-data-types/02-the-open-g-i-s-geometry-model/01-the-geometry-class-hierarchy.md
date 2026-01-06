#### 11.4.2.1 Hierarquia da Classe de Geometria

As classes de geometria definem uma hierarquia da seguinte forma:

- `Geometria` (não instanciável)

  - `Ponto` (instanciável)
  - `Curva` (não instanciável)

    - `LineString` (instanciável)

      - `Linha`
      - `LinearRing`
  - `Superfície` (não instanciável)

    - `Polygon` (instanciável)
  - `GeometryCollection` (instanciável)

    - `MultiPoint` (instanciável)

    - `MultiCurve` (não instanciável)

      - `MultiLineString` (instanciável)

    - `MultiSurface` (não instanciável)

      - `MultiPolygon` (instanciável)

Não é possível criar objetos em classes não instanciáveis. É possível criar objetos em classes instanciáveis. Todas as classes têm propriedades, e as classes instanciáveis também podem ter asserções (regras que definem instâncias válidas de classe).

`Geometry` é a classe base. É uma classe abstrata. As subclasses instanciáveis de `Geometry` são restritas a objetos geométricos unidimensionais, bidimensionais e tridimensionais que existem no espaço de coordenadas bidimensional. Todas as classes de geometria instanciáveis são definidas de modo que as instâncias válidas de uma classe de geometria sejam topologicamente fechadas (ou seja, todas as geometrias definidas incluem sua borda).

A classe base `Geometry` tem subclasses para `Point`, `Curve`, `Surface` e `GeometryCollection`:

- O termo "ponto" representa objetos de dimensão zero.

- `Curve` representa objetos unidimensionais e tem a subclasse `LineString`, com sub-subclasses `Line` e `LinearRing`.

- `Surface` é projetado para objetos bidimensionais e possui a subclasse `Polygon`.

- `GeometryCollection` possui classes especializadas de coleção de zero, um e duas dimensões chamadas `MultiPoint`, `MultiLineString` e `MultiPolygon`, para modelar geometrias correspondentes a coleções de `Points`, `LineStrings` e `Polygons`, respectivamente. `MultiCurve` e `MultiSurface` são introduzidas como superclasses abstratas que generalizam as interfaces de coleção para lidar com `Curves` e `Surfaces`.

`Geometry`, `Curve`, `Surface`, `MultiCurve` e `MultiSurface` são definidas como classes não instanciáveis. Elas definem um conjunto comum de métodos para suas subclasses e são incluídas para extensibilidade.

`Ponto`, `LinhaString`, `Poligono`, `Coleção de Geometria`, `MultiPonto`, `MultiLinhaString` e `MultiPoligono` são classes instanciáveis.
