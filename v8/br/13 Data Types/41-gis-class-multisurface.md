#### 13.4.2.12 Classe MultiSurface

Uma `MultiSurface` é uma coleção de geometria composta por elementos de superfície. `MultiSurface` é uma classe não instanciável. Sua única subclasse instanciável é `MultiPolygon`.

**Afirmações da `MultiSurface`**

* As superfícies dentro de uma `MultiSurface` não têm interiores que se intersectem.
* As superfícies dentro de uma `MultiSurface` têm limites que se intersectam no máximo em um número finito de pontos.