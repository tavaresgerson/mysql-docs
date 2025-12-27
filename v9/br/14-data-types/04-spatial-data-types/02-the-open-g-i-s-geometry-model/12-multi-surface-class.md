#### 13.4.2.12 Classe MultiSurface

A `MultiSurface` é uma coleção de geometria composta por elementos de superfície. A `MultiSurface` é uma classe não instanciável. Sua única subclasse instanciável é a `MultiPolygon`.

**Afirmações da `MultiSurface`**

* As superfícies dentro de uma `MultiSurface` não têm interiores que se intersectem.

* As superfícies dentro de uma `MultiSurface` têm limites que se intersectam no máximo em um número finito de pontos.