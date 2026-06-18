#### 11.4.2.6 Classe Surface

Uma `Surface` é uma geometry bidimensional. É uma classe não instanciável. Sua única subclasse instanciável é `Polygon`.

Surfaces simples no espaço tridimensional são isomorfas a surfaces planares.

Surfaces poliédricas são formadas pela “costura” (stitching) de surfaces simples ao longo de seus boundaries; surfaces poliédricas no espaço tridimensional podem não ser planares como um todo.

**Propriedades de `Surface`**

* Uma `Surface` é definida como uma geometry bidimensional.

* A especificação OpenGIS define uma `Surface` simples como uma geometry que consiste em um único “patch” que está associado a um único boundary exterior e zero ou mais boundaries interiores.

* O boundary de uma `Surface` simples é o conjunto de curvas fechadas correspondente aos seus boundaries exterior e interior.