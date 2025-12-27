#### 13.4.2.6 Classe de Superfície

Uma `Surface` é uma geometria bidimensional. É uma classe não instanciável. Sua única subclasse instanciável é `Polygon`.

Superfícies simples no espaço tridimensional são isomórficas a superfícies planas.

Superfícies poliédricas são formadas “costurando” superfícies simples ao longo de seus limites, superfícies poliédricas no espaço tridimensional podem não ser planas como um todo.

**Propriedades da `Surface`**

* Uma `Surface` é definida como uma geometria bidimensional.
* A especificação OpenGIS define uma `Surface` simples como uma geometria que consiste em um único “patch” que está associado a um único limite exterior e zero ou mais limites interiores.
* O limite de uma `Surface` simples é o conjunto de curvas fechadas correspondentes aos seus limites exterior e interior.