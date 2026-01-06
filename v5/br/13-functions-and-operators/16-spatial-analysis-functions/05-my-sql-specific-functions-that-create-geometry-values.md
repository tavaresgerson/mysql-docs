### 12.16.5 Funções específicas do MySQL que criam valores de geometria

O MySQL oferece um conjunto de funções não padrão úteis para criar valores de geometria. As funções descritas nesta seção são extensões do MySQL à especificação OpenGIS.

Essas funções produzem objetos geométricos a partir de valores WKB ou objetos geométricos como argumentos. Se qualquer argumento não for uma representação WKB adequada ou um objeto geométrico do tipo correto, o valor de retorno será `NULL`.

Por exemplo, você pode inserir o valor de retorno da geometria de `Point()` diretamente em uma coluna `POINT`:

```sql
INSERT INTO t1 (pt_col) VALUES(Point(1,2));
```

- `GeometryCollection(g [, g] ...)`

  Constrói um valor de `GeometryCollection` a partir dos argumentos de geometria.

  `GeometryCollection()` retorna todas as geometrias válidas contidas nos argumentos, mesmo que uma geometria não suportada esteja presente.

  `GeometryCollection()` sem argumentos é permitido como uma maneira de criar uma geometria vazia.

- `LineString(pt [, pt] ...)`

  Constrói um valor `LineString` a partir de um número de argumentos `Point` ou `Point` WKB. Se o número de argumentos for menor que dois, o valor de retorno é `NULL`.

- `MultiLineString(ls [, ls] ...)`

  Constrói um valor `MultiLineString` usando argumentos `LineString` ou `LineString` WKB.

- `MultiPoint(pt [, pt2] ...)`

  Constrói um valor `MultiPoint` usando argumentos `Point` ou `Point` WKB.

- `MultiPolygon(poly [, poly] ...)`

  Constrói um valor `MultiPolygon` a partir de um conjunto de argumentos `Polygon` ou `Polygon` WKB.

- `Ponto(x, y)`

  Constrói um `Ponto` usando suas coordenadas.

- `Polygon(ls [, ls] ...)`

  Constrói um valor `Polygon` a partir de um número de argumentos `LineString` ou `LineString` WKB. Se qualquer argumento não representar um `LinearRing` (ou seja, não ser um `LineString` fechado e simples), o valor de retorno é `NULL`.
