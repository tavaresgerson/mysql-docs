#### 13.4.2.8 Classe `GeomCollection`

Uma `GeomCollection` é uma geometria que é uma coleção de zero ou mais geometrias de qualquer classe.

`GeomCollection` e `GeometryCollection` são sinônimos, sendo `GeomCollection` o nome de tipo preferido.

Todos os elementos de uma coleção de geometrias devem estar no mesmo sistema de referência espacial (ou seja, no mesmo sistema de coordenadas). Não há outras restrições aos elementos de uma coleção de geometrias, embora as subclasses de `GeomCollection` descritas nas seções seguintes possam restringir a adesão. As restrições podem ser baseadas em:

* Tipo de elemento (por exemplo, um `MultiPoint` pode conter apenas elementos `Point`)

* Dimensão
* Restrições sobre o grau de sobreposição espacial entre elementos