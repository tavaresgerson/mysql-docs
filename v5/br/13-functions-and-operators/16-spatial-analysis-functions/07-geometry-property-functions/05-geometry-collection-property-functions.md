#### 12.16.7.5 Funções de Propriedade de GeometryCollection

Essas funções retornam propriedades dos valores de `GeometryCollection`.

- `GeometryN(gc, N)`

  `ST_GeometryN()` e `GeometryN()` são sinônimos. Para mais informações, consulte a descrição de `ST_GeometryN()`.

  `GeometryN()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_GeometryN()` em vez disso.

- `NumGeometries(gc)`

  `ST_NumGeometries()` e `NumGeometries()` são sinônimos. Para mais informações, consulte a descrição de `ST_NumGeometries()`.

  `NumGeometries()` está desatualizado; espere que ele seja removido em uma futura versão do MySQL. Use `ST_NumGeometries()` em vez disso.

- `ST_GeometryN(gc, N)`

  Retorna a *`N`*-ésima geometria no valor `GeometryCollection` *`gc`*. As geometrias são numeradas a partir do 1. Se algum argumento for `NULL` ou o argumento de geometria for uma geometria vazia, o valor de retorno é `NULL`.

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

- `ST_NumGeometries(gc)`

  Retorna o número de geometrias no valor `GeometryCollection` *`gc`*. Se o argumento for `NULL` ou uma geometria vazia, o valor de retorno será `NULL`.

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
