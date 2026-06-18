#### 13.4.2.8 Classe GeometryCollection

Um `GeomCollection` é uma geometria que é uma coleção de zero ou mais geometrias de qualquer classe.

`GeomCollection` e `GeometryCollection` são sinônimos, sendo `GeomCollection` o nome preferido do tipo.

Todos os elementos de uma coleção de geometria devem estar no mesmo sistema de referência espacial (ou seja, no mesmo sistema de coordenadas). Não há outras restrições para os elementos de uma coleção de geometria, embora as subclasses de `GeomCollection` descritas nas seções seguintes possam restringir a associação. As restrições podem ser baseadas em:

- Tipo de elemento (por exemplo, um `MultiPoint` pode conter apenas elementos `Point`)

- Dimensão

- Restrições ao grau de sobreposição espacial entre elementos
