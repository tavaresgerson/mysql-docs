### 12.16.5 Funções Específicas do MySQL Que Criam Valores de Geometria

O MySQL fornece um conjunto de funções não padrão úteis para a criação de valores de geometria. As funções descritas nesta seção são extensões do MySQL para a especificação OpenGIS.

Essas funções produzem objetos de geometry a partir de valores WKB ou objetos de geometry como argumentos. Se qualquer argumento não for uma representação WKB ou geometry apropriada do tipo de objeto correto, o valor de retorno será `NULL`.

Por exemplo, você pode inserir o valor de retorno geometry de `Point()` diretamente em uma coluna `POINT`:

```sql
INSERT INTO t1 (pt_col) VALUES(Point(1,2));
```

* `GeometryCollection(g [, g] ...)`

  Constrói um valor `GeometryCollection` a partir dos argumentos de geometry.

  `GeometryCollection()` retorna todas as geometries apropriadas contidas nos argumentos, mesmo que uma geometry não suportada esteja presente.

  `GeometryCollection()` sem argumentos é permitido como uma maneira de criar uma geometry vazia.

* `LineString(pt [, pt] ...)`

  Constrói um valor `LineString` a partir de vários argumentos `Point` ou WKB `Point`. Se o número de argumentos for menor que dois, o valor de retorno será `NULL`.

* `MultiLineString(ls [, ls] ...)`

  Constrói um valor `MultiLineString` usando argumentos `LineString` ou WKB `LineString`.

* `MultiPoint(pt [, pt2] ...)`

  Constrói um valor `MultiPoint` usando argumentos `Point` ou WKB `Point`.

* `MultiPolygon(poly [, poly] ...)`

  Constrói um valor `MultiPolygon` a partir de um conjunto de argumentos `Polygon` ou WKB `Polygon`.

* `Point(x, y)`

  Constrói um `Point` usando suas coordenadas.

* `Polygon(ls [, ls] ...)`

  Constrói um valor `Polygon` a partir de vários argumentos `LineString` ou WKB `LineString`. Se algum argumento não representar um `LinearRing` (ou seja, não for um `LineString` fechado e simples), o valor de retorno será `NULL`.