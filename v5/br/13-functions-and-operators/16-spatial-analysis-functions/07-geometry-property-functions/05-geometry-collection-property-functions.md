#### 12.16.7.5 Funções de Propriedade de GeometryCollection

Estas funções retornam propriedades dos valores de `GeometryCollection`.

* `GeometryN(gc, N)`

  `ST_GeometryN()` e `GeometryN()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeometryN()`.

  `GeometryN()` está obsoleto (deprecated); espere que ele seja removido em um futuro lançamento do MySQL. Use `ST_GeometryN()` em seu lugar.

* `NumGeometries(gc)`

  `ST_NumGeometries()` e `NumGeometries()` são sinônimos. Para mais informações, consulte a descrição de `ST_NumGeometries()`.

  `NumGeometries()` está obsoleto (deprecated); espere que ele seja removido em um futuro lançamento do MySQL. Use `ST_NumGeometries()` em seu lugar.

* `ST_GeometryN(gc, N)`

  Retorna a *`N`*-ésima geometry no valor `GeometryCollection` *`gc`*. As Geometries são numeradas começando com 1. Se qualquer argumento for `NULL` ou o argumento geometry for uma geometry vazia, o valor de retorno será `NULL`.

  ```sql
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1));
  +-------------------------------------------------+
  | ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1)) |
  +-------------------------------------------------+
  | POINT(1 1)                                      |
  +-------------------------------------------------+
  ```

  `ST_GeometryN()` e `GeometryN()` são sinônimos.

* `ST_NumGeometries(gc)`

  Retorna o número de geometries no valor `GeometryCollection` *`gc`*. Se o argumento for `NULL` ou uma geometry vazia, o valor de retorno será `NULL`.

  ```sql
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_NumGeometries(ST_GeomFromText(@gc));
  +----------------------------------------+
  | ST_NumGeometries(ST_GeomFromText(@gc)) |
  +----------------------------------------+
  |                                      2 |
  +----------------------------------------+
  ```

  `ST_NumGeometries()` e `NumGeometries()` são sinônimos.