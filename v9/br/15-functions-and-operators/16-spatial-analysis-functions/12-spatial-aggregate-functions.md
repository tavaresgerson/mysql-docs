### 14.16.12 Funções Agregadas Espaciais

O MySQL suporta funções agregadas que realizam um cálculo em um conjunto de valores. Para informações gerais sobre essas funções, consulte a Seção 14.19.1, “Descrição das Funções Agregadas”. Esta seção descreve a função agregada espacial `ST_Collect()`.

`ST_Collect()` pode ser usado como uma função de janela, conforme indicado na descrição da sintaxe por `[over_clause]`, representando uma cláusula `OVER` opcional. *`over_clause`* é descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”, que também inclui outras informações sobre o uso de funções de janela.

* `ST_Collect([DISTINCT] g) [over_clause]`

  Agrupa valores de geometria e retorna um único valor de coleção de geometria. Com a opção `DISTINCT`, retorna a agregação dos argumentos de geometria distintos.

  Como com outras funções agregadas, `GROUP BY` pode ser usado para agrupar argumentos em subconjuntos. `ST_Collect()` retorna um valor agregado para cada subconjunto.

  Esta função é executada como uma função de janela se *`over_clause`* estiver presente. *`over_clause`* é descrito na Seção 14.20.2, “Conceitos e Sintaxe de Funções de Janela”. Em contraste com a maioria das funções agregadas que suportam janela, `ST_Collect()` permite o uso de *`over_clause`* junto com `DISTINCT`.

  `ST_Collect()` trata seus argumentos da seguinte forma:

  + Argumentos `NULL` são ignorados.
  + Se todos os argumentos forem `NULL` ou o resultado da agregação for vazio, o valor de retorno é `NULL`.

  + Se qualquer argumento de geometria não for uma geometria bem formada sintaticamente, ocorre um erro `ER_GIS_INVALID_DATA`.

  + Se qualquer argumento de geometria for uma geometria bem formada sintaticamente em um sistema de referência espacial (SRS) indefinido, ocorre um erro `ER_SRS_NOT_FOUND`.

+ Se houver vários argumentos de geometria e esses argumentos estiverem no mesmo SRS, o valor de retorno estará nesse SRS. Se esses argumentos não estiverem no mesmo SRS, ocorrerá um erro `ER_GIS_DIFFERENT_SRIDS_AGGREGATION`.

+ O resultado é o menor valor possível de `MultiXxx` ou `GeometryCollection`, com o tipo de resultado determinado a partir dos argumentos de geometria não `NULL` da seguinte forma:

    - Se todos os argumentos forem valores de `Point`, o resultado é um valor `MultiPoint`.

    - Se todos os argumentos forem valores de `LineString`, o resultado é um valor `MultiLineString`.

    - Se todos os argumentos forem valores de `Polygon`, o resultado é um valor `MultiPolygon`.

    - Caso contrário, os argumentos são uma mistura de tipos de geometria e o resultado é um valor `GeometryCollection`.

Este conjunto de dados de exemplo mostra produtos hipotéticos por ano e localização de fabricação:

```
  CREATE TABLE product (
    year INTEGER,
    product VARCHAR(256),
    location Geometry
  );

  INSERT INTO product
  (year,  product,     location) VALUES
  (2000, "Calculator", ST_GeomFromText('point(60 -24)',4326)),
  (2000, "Computer"  , ST_GeomFromText('point(28 -77)',4326)),
  (2000, "Abacus"    , ST_GeomFromText('point(28 -77)',4326)),
  (2000, "TV"        , ST_GeomFromText('point(38  60)',4326)),
  (2001, "Calculator", ST_GeomFromText('point(60 -24)',4326)),
  (2001, "Computer"  , ST_GeomFromText('point(28 -77)',4326));
  ```

Algumas consultas de amostra usando `ST_Collect()` no conjunto de dados:

```
  mysql> SELECT ST_AsText(ST_Collect(location)) AS result
         FROM product;
  +------------------------------------------------------------------+
  | result                                                           |
  +------------------------------------------------------------------+
  | MULTIPOINT((60 -24),(28 -77),(28 -77),(38 60),(60 -24),(28 -77)) |
  +------------------------------------------------------------------+

  mysql> SELECT ST_AsText(ST_Collect(DISTINCT location)) AS result
         FROM product;
  +---------------------------------------+
  | result                                |
  +---------------------------------------+
  | MULTIPOINT((60 -24),(28 -77),(38 60)) |
  +---------------------------------------+

  mysql> SELECT year, ST_AsText(ST_Collect(location)) AS result
         FROM product GROUP BY year;
  +------+------------------------------------------------+
  | year | result                                         |
  +------+------------------------------------------------+
  | 2000 | MULTIPOINT((60 -24),(28 -77),(28 -77),(38 60)) |
  | 2001 | MULTIPOINT((60 -24),(28 -77))                  |
  +------+------------------------------------------------+

  mysql> SELECT year, ST_AsText(ST_Collect(DISTINCT location)) AS result
         FROM product GROUP BY year;
  +------+---------------------------------------+
  | year | result                                |
  +------+---------------------------------------+
  | 2000 | MULTIPOINT((60 -24),(28 -77),(38 60)) |
  | 2001 | MULTIPOINT((60 -24),(28 -77))         |
  +------+---------------------------------------+

  # selects nothing
  mysql> SELECT ST_Collect(location) AS result
         FROM product WHERE year = 1999;
  +--------+
  | result |
  +--------+
  | NULL   |
  +--------+

  mysql> SELECT ST_AsText(ST_Collect(location)
           OVER (ORDER BY year, product ROWS BETWEEN 1 PRECEDING AND CURRENT ROW))
           AS result
         FROM product;
  +-------------------------------+
  | result                        |
  +-------------------------------+
  | MULTIPOINT((28 -77))          |
  | MULTIPOINT((28 -77),(60 -24)) |
  | MULTIPOINT((60 -24),(28 -77)) |
  | MULTIPOINT((28 -77),(38 60))  |
  | MULTIPOINT((38 60),(60 -24))  |
  | MULTIPOINT((60 -24),(28 -77)) |
  +-------------------------------+
  ```