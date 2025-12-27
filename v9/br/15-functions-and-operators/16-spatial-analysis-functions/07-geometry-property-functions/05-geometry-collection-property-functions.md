#### 14.16.7.5 Funções de Propriedade de GeometryCollection

Esses funções retornam propriedades dos valores de `GeometryCollection`.

A menos que especificado de outra forma, as funções nesta seção tratam seus argumentos de geometria da seguinte forma:

* Se qualquer argumento for `NULL` ou se qualquer argumento de geometria for uma geometria vazia, o valor de retorno é `NULL`.

* Se qualquer argumento de geometria não for uma geometria bem formada sintaticamente, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se qualquer argumento de geometria for uma geometria bem formada sintaticamente em um sistema de referência espacial (SRS) indefinido, ocorre um erro `ER_SRS_NOT_FOUND`.

* Caso contrário, o valor de retorno não é `NULL`.

Essas funções estão disponíveis para obter propriedades de coleção de geometria:

* `ST_GeometryN(gc, N)`

  Retorna a *`N`*-ésima geometria no valor de `GeometryCollection` *`gc`*. As geometrias são numeradas a partir de 1.

  `ST_GeometryN()` trata seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1));
  +-------------------------------------------------+
  | ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1)) |
  +-------------------------------------------------+
  | POINT(1 1)                                      |
  +-------------------------------------------------+
  ```

* `ST_NumGeometries(gc)`

  Retorna o número de geometrias no valor de `GeometryCollection` *`gc`*.

  `ST_NumGeometries()` trata seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_NumGeometries(ST_GeomFromText(@gc));
  +----------------------------------------+
  | ST_NumGeometries(ST_GeomFromText(@gc)) |
  +----------------------------------------+
  |                                      2 |
  +----------------------------------------+
  ```