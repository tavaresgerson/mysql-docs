#### 11.4.2.12 Classe MultiSurface

Uma `MultiSurface` é uma coleção de geometrias composta por elementos de superfície. `MultiSurface` é uma classe não instanciável. Sua única subclasse instanciável é `MultiPolygon`.

**Afirmações `MultiSurface`**

- As superfícies dentro de um `MultiSurface` não têm interiores que se intersectem.

- As superfícies dentro de uma `MultiSurface` têm limites que se intersectam no máximo em um número finito de pontos.
