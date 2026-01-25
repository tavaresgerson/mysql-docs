#### 11.4.2.8 Classe GeometryCollection

Uma `GeometryCollection` é uma geometria que representa uma coleção de zero ou mais geometrias de qualquer classe.

Todos os elementos em uma coleção de geometria devem estar no mesmo sistema de referência espacial (ou seja, no mesmo sistema de coordenadas). Não há outras restrições sobre os elementos de uma coleção de geometria, embora as subclasses de `GeometryCollection` descritas nas seções a seguir possam restringir a participação. As restrições podem ser baseadas em:

* Tipo de elemento (por exemplo, um `MultiPoint` pode conter apenas elementos `Point`)

* Dimensão
* Restrições sobre o grau de sobreposição espacial entre elementos
