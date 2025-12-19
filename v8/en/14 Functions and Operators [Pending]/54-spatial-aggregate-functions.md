--- title: MySQL 8.4 Reference Manual :: 14.16.12 Spatial Aggregate Functions url: https://dev.mysql.com/doc/refman/8.4/en/spatial-aggregate-functions.html order: 54 ---



### 14.16.12 Spatial Aggregate Functions

MySQL supports aggregate functions that perform a calculation on a set of values. For general information about these functions, see Section 14.19.1, “Aggregate Function Descriptions”. This section describes the `ST_Collect()` spatial aggregate function.

 `ST_Collect()` can be used as a window function, as signified in its syntax description by `[over_clause]`, representing an optional `OVER` clause. *`over_clause`* is described in Section 14.20.2, “Window Function Concepts and Syntax”, which also includes other information about window function usage.

* [`ST_Collect([DISTINCT] g) [over_clause]`](spatial-aggregate-functions.html#function_st-collect)

  Aggregates geometry values and returns a single geometry collection value. With the `DISTINCT` option, returns the aggregation of the distinct geometry arguments.

  As with other aggregate functions, `GROUP BY` may be used to group arguments into subsets. `ST_Collect()` returns an aggregate value for each subset.

  This function executes as a window function if *`over_clause`* is present. *`over_clause`* is as described in Section 14.20.2, “Window Function Concepts and Syntax”. In contrast to most aggregate functions that support windowing, `ST_Collect()` permits use of *`over_clause`* together with `DISTINCT`.

   `ST_Collect()` handles its arguments as follows:

  + `NULL` arguments are ignored.
  + If all arguments are `NULL` or the aggregate result is empty, the return value is `NULL`.
  + If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.
  + If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an  `ER_SRS_NOT_FOUND` error occurs.
  + If there are multiple geometry arguments and those arguments are in the same SRS, the return value is in that SRS. If those arguments are not in the same SRS, an `ER_GIS_DIFFERENT_SRIDS_AGGREGATION` error occurs.
  + The result is the narrowest `MultiXxx` or `GeometryCollection` value possible, with the result type determined from the non-`NULL` geometry arguments as follows:

    - If all arguments are `Point` values, the result is a `MultiPoint` value.
    - If all arguments are `LineString` values, the result is a `MultiLineString` value.
    - If all arguments are `Polygon` values, the result is a `MultiPolygon` value.
    - Otherwise, the arguments are a mix of geometry types and the result is a `GeometryCollection` value.

  This example data set shows hypothetical products by year and location of manufacture:

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

  Some sample queries using `ST_Collect()` on the data set:

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

