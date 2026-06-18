#### 13.4.2.6 Classe de superfície

Um `Surface` é uma geometria bidimensional. É uma classe não instanciável. Sua única subclasse instanciável é `Polygon`.

Superfícies simples no espaço tridimensional são isomórficas às superfícies planas.

As superfícies poliédricas são formadas “costurando” superfícies simples ao longo de seus limites. Em um espaço tridimensional, as superfícies poliédricas podem não ser planas como um todo.

**`Surface` Propriedades**

- Um `Surface` é definido como uma geometria bidimensional.

- A especificação OpenGIS define um `Surface` simples como uma geometria que consiste em um único "patch" associado a uma única borda externa e zero ou mais bordas internas.

- A fronteira de um simples `Surface` é o conjunto de curvas fechadas correspondentes aos seus limites externos e internos.
