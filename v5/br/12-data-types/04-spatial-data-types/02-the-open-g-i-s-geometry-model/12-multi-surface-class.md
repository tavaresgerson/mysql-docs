#### 11.4.2.12 Classe MultiSurface

Uma `MultiSurface` é uma coleção de geometria composta por elementos de superfície. A `MultiSurface` é uma classe não instanciável. Sua única subclasse instanciável é a `MultiPolygon`.

**Asserções MultiSurface**

* Surfaces dentro de uma `MultiSurface` não possuem interiores que se intersectam.

* Surfaces dentro de uma `MultiSurface` possuem limites que se intersectam no máximo em um número finito de pontos.