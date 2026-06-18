#### 13.4.2.12 Classe MultiSurface

Um `MultiSurface` é uma coleção de geometria composta por elementos de superfície. `MultiSurface` é uma classe não instanciável. Sua única subclasse instanciável é `MultiPolygon`.

**`MultiSurface` Afirmações**

- As superfícies dentro de um `MultiSurface` não têm interiores que se intersectem.

- As superfícies dentro de um `MultiSurface` têm limites que se intersectam no máximo em um número finito de pontos.
