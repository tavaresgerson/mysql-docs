### 14.16.5 Funções específicas do MySQL que criam valores de geometria

O MySQL oferece um conjunto de funções não padrão úteis para criar valores de geometria. As funções descritas nesta seção são extensões do MySQL à especificação OpenGIS.

Essas funções produzem objetos geométricos a partir de valores WKB ou objetos geométricos como argumentos. Se qualquer argumento não for uma representação WKB adequada ou uma representação geométrica do tipo de objeto adequado, o valor de retorno será `NULL`.

Por exemplo, você pode inserir o valor de retorno da geometria de `Point()` diretamente em uma coluna `POINT`:

```
INSERT INTO t1 (pt_col) VALUES(Point(1,2));
```

- `GeomCollection(g [, g] ...)`

  Constrói um valor `GeomCollection` a partir dos argumentos de geometria.

  `GeomCollection()` retorna todas as geometrias corretas contidas nos argumentos, mesmo que uma geometria não suportada esteja presente.

  `GeomCollection()` sem argumentos é permitido como uma maneira de criar uma geometria vazia. Além disso, funções como `ST_GeomFromText()` que aceitam argumentos de coleção de geometria WKT entendem tanto a sintaxe padrão OpenGIS `'GEOMETRYCOLLECTION EMPTY'` quanto a sintaxe não padrão MySQL `'GEOMETRYCOLLECTION()'`.

  `GeomCollection()` e `GeometryCollection()` são sinônimos, com `GeomCollection()` sendo a função preferida.

- `GeometryCollection(g [, g] ...)`

  Constrói um valor `GeomCollection` a partir dos argumentos de geometria.

  `GeometryCollection()` retorna todas as geometrias corretas contidas nos argumentos, mesmo que uma geometria não suportada esteja presente.

  `GeometryCollection()` sem argumentos é permitido como uma maneira de criar uma geometria vazia. Além disso, funções como `ST_GeomFromText()` que aceitam argumentos de coleção de geometria WKT entendem tanto a sintaxe padrão OpenGIS `'GEOMETRYCOLLECTION EMPTY'` quanto a sintaxe não padrão MySQL `'GEOMETRYCOLLECTION()'`.

  `GeomCollection()` e `GeometryCollection()` são sinônimos, com `GeomCollection()` sendo a função preferida.

- `LineString(pt [, pt] ...)`

  Constrói um valor `LineString` a partir de um número de argumentos `Point` ou WKB `Point`. Se o número de argumentos for menor que dois, o valor de retorno é `NULL`.

- `MultiLineString(ls [, ls] ...)`

  Constrói um valor `MultiLineString` usando os argumentos `LineString` ou WKB `LineString`.

- `MultiPoint(pt [, pt2] ...)`

  Constrói um valor `MultiPoint` usando os argumentos `Point` ou WKB `Point`.

- `MultiPolygon(poly [, poly] ...)`

  Constrói um valor `MultiPolygon` a partir de um conjunto de argumentos `Polygon` ou WKB `Polygon`.

- `Point(x, y)`

  Construi um `Point` usando suas coordenadas.

- `Polygon(ls [, ls] ...)`

  Constrói um valor `Polygon` a partir de um número de argumentos `LineString` ou WKB `LineString`. Se qualquer argumento não representar um `LinearRing` (ou seja, não ser um `LineString` fechado e simples), o valor de retorno é `NULL`.
