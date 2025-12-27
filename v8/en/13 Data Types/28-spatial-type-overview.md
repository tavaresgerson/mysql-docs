### 13.4.1 Spatial Data Types

MySQL has spatial data types that correspond to OpenGIS classes. The basis for these types is described in Section 13.4.2, “The OpenGIS Geometry Model”.

Some spatial data types hold single geometry values:

* `GEOMETRY`
* `POINT`
* `LINESTRING`
* `POLYGON`

`GEOMETRY` can store geometry values of any type. The other single-value types (`POINT`, `LINESTRING`, and `POLYGON`) restrict their values to a particular geometry type.

The other spatial data types hold collections of values:

* `MULTIPOINT`
* `MULTILINESTRING`
* `MULTIPOLYGON`
* `GEOMETRYCOLLECTION`

`GEOMETRYCOLLECTION` can store a collection of objects of any type. The other collection types (`MULTIPOINT`, `MULTILINESTRING`, and `MULTIPOLYGON`) restrict collection members to those having a particular geometry type.

Example: To create a table named `geom` that has a column named `g` that can store values of any geometry type, use this statement:

```
CREATE TABLE geom (g GEOMETRY);
```

Columns with a spatial data type can have an `SRID` attribute, to explicitly indicate the spatial reference system (SRS) for values stored in the column. For example:

```
CREATE TABLE geom (
    p POINT SRID 0,
    g GEOMETRY NOT NULL SRID 4326
);
```

`SPATIAL` indexes can be created on spatial columns if they are `NOT NULL` and have a specific SRID, so if you plan to index the column, declare it with the `NOT NULL` and `SRID` attributes:

```
CREATE TABLE geom (g GEOMETRY NOT NULL SRID 4326);
```

`InnoDB` tables permit `SRID` values for Cartesian and geographic SRSs. `MyISAM` tables permit `SRID` values for Cartesian SRSs.

The `SRID` attribute makes a spatial column SRID-restricted, which has these implications:

* The column can contain only values with the given SRID. Attempts to insert values with a different SRID produce an error.
* The optimizer can use `SPATIAL` indexes on the column. See Section 10.3.3, “SPATIAL Index Optimization”.

Spatial columns with no `SRID` attribute are not SRID-restricted and accept values with any SRID. However, the optimizer cannot use `SPATIAL` indexes on them until the column definition is modified to include an `SRID` attribute, which may require that the column contents first be modified so that all values have the same SRID.

For other examples showing how to use spatial data types in MySQL, see  Section 13.4.6, “Creating Spatial Columns”. For information about spatial reference systems, see Section 13.4.5, “Spatial Reference System Support”.


