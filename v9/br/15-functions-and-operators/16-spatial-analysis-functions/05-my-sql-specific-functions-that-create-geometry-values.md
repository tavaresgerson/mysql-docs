### 14.16.5 Funções Específicas do MySQL que Criam Valores de Geometria

O MySQL fornece um conjunto de funções não padrão úteis para criar valores de geometria. As funções descritas nesta seção são extensões do MySQL à especificação OpenGIS.

Essas funções produzem objetos de geometria a partir de valores WKB ou objetos de geometria como argumentos. Se qualquer argumento não for uma representação adequada de WKB ou de um objeto do tipo apropriado, o valor de retorno é `NULL`.

Por exemplo, você pode inserir o valor de retorno da geometria de `Point()` diretamente em uma coluna `POINT`:

```
INSERT INTO t1 (pt_col) VALUES(Point(1,2));
```

* `GeomCollection(g [, g] ...)`

  Construi um valor `GeomCollection` a partir dos argumentos de geometria.

  `GeomCollection()` retorna todas as geometrias adequadas contidas nos argumentos, mesmo que um objeto de geometria não suportado esteja presente.

  `GeomCollection()` sem argumentos é permitido como uma maneira de criar uma geometria vazia. Além disso, funções como `ST_GeomFromText()` que aceitam argumentos de coleção de geometria WKT entendem tanto a sintaxe padrão `'GEOMETRYCOLLECTION EMPTY'` do OpenGIS quanto a sintaxe não padrão `'GEOMETRYCOLLECTION()'` do MySQL.

  `GeomCollection()` e `GeometryCollection()` são sinônimos, com `GeomCollection()` sendo a função preferida.

* `GeometryCollection(g [, g] ...)`

  Construi um valor `GeomCollection` a partir dos argumentos de geometria.

  `GeometryCollection()` retorna todas as geometrias adequadas contidas nos argumentos, mesmo que um objeto de geometria não suportado esteja presente.

  `GeometryCollection()` sem argumentos é permitido como uma maneira de criar uma geometria vazia. Além disso, funções como `ST_GeomFromText()` que aceitam argumentos de coleção de geometria WKT entendem tanto a sintaxe padrão `'GEOMETRYCOLLECTION EMPTY'` do OpenGIS quanto a sintaxe não padrão `'GEOMETRYCOLLECTION()'` do MySQL.

`GeomCollection()` e `GeometryCollection()` são sinônimos, sendo `GeomCollection()` a função preferida.

* `LineString(pt [, pt] ...)`

  Construi um valor `LineString` a partir de um número de argumentos `Point` ou `Point` WKB. Se o número de argumentos for menor que dois, o valor de retorno é `NULL`.

* `MultiLineString(ls [, ls] ...)`

  Construi um valor `MultiLineString` usando argumentos `LineString` ou `LineString` WKB.

* `MultiPoint(pt [, pt2] ...)`

  Construi um valor `MultiPoint` usando argumentos `Point` ou `Point` WKB.

* `MultiPolygon(poly [, poly] ...)`

  Construi um valor `MultiPolygon` a partir de um conjunto de argumentos `Polygon` ou `Polygon` WKB.

* `Point(x, y)`

  Construi um `Point` usando suas coordenadas.

* `Polygon(ls [, ls] ...)`

  Construi um valor `Polygon` a partir de um número de argumentos `LineString` ou `LineString` WKB. Se qualquer argumento não representar um `LinearRing` (ou seja, não ser um `LineString` fechado e simples), o valor de retorno é `NULL`.