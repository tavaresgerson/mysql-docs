#### 14.16.7.5 Funções de Propriedade de GeometryCollection

Essas funções retornam propriedades dos valores de `GeometryCollection`.

A menos que especificado de outra forma, as funções desta seção tratam seus argumentos de geometria da seguinte forma:

- Se qualquer argumento for `NULL` ou se qualquer argumento de geometria for uma geometria vazia, o valor de retorno será `NULL`.

- Se qualquer argumento de geometria não for uma geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

- Se qualquer argumento de geometria for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorrerá um erro `ER_SRS_NOT_FOUND`.

- Caso contrário, o valor de retorno não é `NULL`.

Essas funções estão disponíveis para obter propriedades da coleção de geometria:

- `ST_GeometryN(gc, N)`

  Retorna a `N`-ésima geometria no valor `GeometryCollection` `gc`. As geometrias são numeradas a partir de 1.

  `ST_GeometryN()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1));
  +-------------------------------------------------+
  | ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1)) |
  +-------------------------------------------------+
  | POINT(1 1)                                      |
  +-------------------------------------------------+
  ```

- `ST_NumGeometries(gc)`

  Retorna o número de geometrias no valor `GeometryCollection` \* `gc`\*.

  `ST_NumGeometries()` lida com seus argumentos conforme descrito na introdução desta seção.

  ```
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_NumGeometries(ST_GeomFromText(@gc));
  +----------------------------------------+
  | ST_NumGeometries(ST_GeomFromText(@gc)) |
  +----------------------------------------+
  |                                      2 |
  +----------------------------------------+
  ```
