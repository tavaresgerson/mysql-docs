### 13.4.3 Supported Spatial Data Formats

Two standard spatial data formats are used to represent geometry objects in queries:

* Well-Known Text (WKT) format
* Well-Known Binary (WKB) format

Internally, MySQL stores geometry values in a format that is not identical to either WKT or WKB format. (Internal format is like WKB but with an initial 4 bytes to indicate the SRID.)

There are functions available to convert between different data formats; see Section 14.16.6, “Geometry Format Conversion Functions”.

The following sections describe the spatial data formats MySQL uses:

* Well-Known Text (WKT) Format Format")
* Well-Known Binary (WKB) Format Format")
* Internal Geometry Storage Format

#### Well-Known Text (WKT) Format

The Well-Known Text (WKT) representation of geometry values is designed for exchanging geometry data in ASCII form. The OpenGIS specification provides a Backus-Naur grammar that specifies the formal production rules for writing WKT values (see Section 13.4, “Spatial Data Types”).

Examples of WKT representations of geometry objects:

* A `Point`:

  ```
  POINT(15 20)
  ```

  The point coordinates are specified with no separating comma. This differs from the syntax for the SQL `Point()` function, which requires a comma between the coordinates. Take care to use the syntax appropriate to the context of a given spatial operation. For example, the following statements both use `ST_X()` to extract the X-coordinate from a `Point` object. The first produces the object directly using the `Point()` function. The second uses a WKT representation converted to a `Point` with `ST_GeomFromText()`.

  ```
  mysql> SELECT ST_X(Point(15, 20));
  +---------------------+
  | ST_X(POINT(15, 20)) |
  +---------------------+
  |                  15 |
  +---------------------+

  mysql> SELECT ST_X(ST_GeomFromText('POINT(15 20)'));
  +---------------------------------------+
  | ST_X(ST_GeomFromText('POINT(15 20)')) |
  +---------------------------------------+
  |                                    15 |
  +---------------------------------------+
  ```

* A `LineString` with four points:

  ```
  LINESTRING(0 0, 10 10, 20 25, 50 60)
  ```

  The point coordinate pairs are separated by commas.

* A `Polygon` with one exterior ring and one interior ring:

  ```
  POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7, 5 5))
  ```

* A `MultiPoint` with three `Point` values:

  ```
  MULTIPOINT(0 0, 20 20, 60 60)
  ```

  Spatial functions such as `ST_MPointFromText()` and `ST_GeomFromText()` that accept WKT-format representations of `MultiPoint` values permit individual points within values to be surrounded by parentheses. For example, both of the following function calls are valid:

  ```
  ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
  ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
  ```

* A `MultiLineString` with two `LineString` values:

  ```
  MULTILINESTRING((10 10, 20 20), (15 15, 30 15))
  ```

* A `MultiPolygon` with two `Polygon` values:

  ```
  MULTIPOLYGON(((0 0,10 0,10 10,0 10,0 0)),((5 5,7 5,7 7,5 7, 5 5)))
  ```

* A `GeometryCollection` consisting of two `Point` values and one `LineString`:

  ```
  GEOMETRYCOLLECTION(POINT(10 10), POINT(30 30), LINESTRING(15 15, 20 20))
  ```

#### Well-Known Binary (WKB) Format

The Well-Known Binary (WKB) representation of geometric values is used for exchanging geometry data as binary streams represented by `BLOB` values containing geometric WKB information. This format is defined by the OpenGIS specification (see Section 13.4, “Spatial Data Types”). It is also defined in the ISO *SQL/MM Part 3: Spatial* standard.

WKB uses 1-byte unsigned integers, 4-byte unsigned integers, and 8-byte double-precision numbers (IEEE 754 format). A byte is eight bits.

For example, a WKB value that corresponds to `POINT(1 -1)` consists of this sequence of 21 bytes, each represented by two hexadecimal digits:

```
0101000000000000000000F03F000000000000F0BF
```

The sequence consists of the components shown in the following table.

**Table 13.2 WKB Components Example**

<table summary="Example showing component in WKB values."><thead><tr> <th>Component</th> <th>Size</th> <th>Value</th> </tr></thead><tbody><tr> <th>Byte order</th> <td>1 byte</td> <td><code>01</code></td> </tr><tr> <th>WKB type</th> <td>4 bytes</td> <td><code>01000000</code></td> </tr><tr> <th>X coordinate</th> <td>8 bytes</td> <td><code>000000000000F03F</code></td> </tr><tr> <th>Y coordinate</th> <td>8 bytes</td> <td><code>000000000000F0BF</code></td> </tr></tbody></table>

Component representation is as follows:

* The byte order indicator is either 1 or 0 to signify little-endian or big-endian storage. The little-endian and big-endian byte orders are also known as Network Data Representation (NDR) and External Data Representation (XDR), respectively.

* The WKB type is a code that indicates the geometry type. MySQL uses values from 1 through 7 to indicate `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon`, and `GeometryCollection`.

* A `Point` value has X and Y coordinates, each represented as a double-precision value.

WKB values for more complex geometry values have more complex data structures, as detailed in the OpenGIS specification.

#### Internal Geometry Storage Format

MySQL stores geometry values using 4 bytes to indicate the SRID followed by the WKB representation of the value. For a description of WKB format, see Well-Known Binary (WKB) Format Format").

For the WKB part, these MySQL-specific considerations apply:

* The byte-order indicator byte is 1 because MySQL stores geometries as little-endian values.

* MySQL supports geometry types of `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon`, and `GeometryCollection`. Other geometry types are not supported.

* Only `GeometryCollection` can be empty. Such a value is stored with 0 elements.

* Polygon rings can be specified both clockwise and counterclockwise. MySQL flips the rings automatically when reading data.

Cartesian coordinates are stored in the length unit of the spatial reference system, with X values in the X coordinates and Y values in the Y coordinates. Axis directions are those specified by the spatial reference system.

Geographic coordinates are stored in the angle unit of the spatial reference system, with longitudes in the X coordinates and latitudes in the Y coordinates. Axis directions and the meridian are those specified by the spatial reference system.

The `LENGTH()` function returns the space in bytes required for value storage. Example:

```
mysql> SET @g = ST_GeomFromText('POINT(1 -1)');
mysql> SELECT LENGTH(@g);
+------------+
| LENGTH(@g) |
+------------+
|         25 |
+------------+
mysql> SELECT HEX(@g);
+----------------------------------------------------+
| HEX(@g)                                            |
+----------------------------------------------------+
| 000000000101000000000000000000F03F000000000000F0BF |
+----------------------------------------------------+
```

The value length is 25 bytes, made up of these components (as can be seen from the hexadecimal value):

* 4 bytes for integer SRID (0)
* 1 byte for integer byte order (1 = little-endian)
* 4 bytes for integer type information (1 = `Point`)

* 8 bytes for double-precision X coordinate (1)
* 8 bytes for double-precision Y coordinate (−1)
