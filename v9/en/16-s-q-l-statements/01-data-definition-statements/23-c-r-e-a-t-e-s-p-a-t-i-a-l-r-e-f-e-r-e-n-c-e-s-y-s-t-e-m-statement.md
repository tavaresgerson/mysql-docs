### 15.1.23 CREATE SPATIAL REFERENCE SYSTEM Statement

```
CREATE OR REPLACE SPATIAL REFERENCE SYSTEM
    srid srs_attribute ...

CREATE SPATIAL REFERENCE SYSTEM
    [IF NOT EXISTS]
    srid srs_attribute ...

srs_attribute: {
    NAME 'srs_name'
  | DEFINITION 'definition'
  | ORGANIZATION 'org_name' IDENTIFIED BY org_id
  | DESCRIPTION 'description'
}

srid, org_id: 32-bit unsigned integer
```

This statement creates a spatial reference system (SRS) definition and stores it in the data dictionary, and requires the `CREATE_SPATIAL_REFERENCE_SYSTEM` privilege (or `SUPER`). The resulting data dictionary entry can be inspected using the `INFORMATION_SCHEMA` `ST_SPATIAL_REFERENCE_SYSTEMS` table.

SRID values must be unique, so if neither `OR REPLACE` nor `IF NOT EXISTS` is specified, an error occurs if an SRS definition with the given *`srid`* value already exists.

With `CREATE OR REPLACE` syntax, any existing SRS definition with the same SRID value is replaced, unless the SRID value is used by some column in an existing table. In that case, an error occurs. For example:

```
mysql> CREATE OR REPLACE SPATIAL REFERENCE SYSTEM 4326 ...;
ERROR 3716 (SR005): Can't modify SRID 4326. There is at
least one column depending on it.
```

To identify which column or columns use the SRID, use this query, replacing 4326 with the SRID of the definition you are trying to create:

```
SELECT * FROM INFORMATION_SCHEMA.ST_GEOMETRY_COLUMNS WHERE SRS_ID=4326;
```

With `CREATE ... IF NOT EXISTS` syntax, any existing SRS definition with the same SRID value causes the new definition to be ignored and a warning occurs.

SRID values must be in the range of 32-bit unsigned integers, with these restrictions:

* SRID 0 is a valid SRID but cannot be used with `CREATE SPATIAL REFERENCE SYSTEM`.

* If the value is in a reserved SRID range, a warning occurs. Reserved ranges are [0, 32767] (reserved by EPSG), [60,000,000, 69,999,999] (reserved by EPSG), and [2,000,000,000, 2,147,483,647] (reserved by MySQL). EPSG stands for the European Petroleum Survey Group.

* Users should not create SRSs with SRIDs in the reserved ranges. Doing so runs the risk of the SRIDs conflicting with future SRS definitions distributed with MySQL, with the result that the new system-provided SRSs are not installed for MySQL upgrades or that the user-defined SRSs are overwritten.

Attributes for the statement must satisfy these conditions:

* Attributes can be given in any order, but no attribute can be given more than once.

* The `NAME` and `DEFINITION` attributes are mandatory.

* The `NAME` *`srs_name`* attribute value must be unique. The combination of the `ORGANIZATION` *`org_name`* and *`org_id`* attribute values must be unique.

* The `NAME` *`srs_name`* attribute value and `ORGANIZATION` *`org_name`* attribute value cannot be empty or begin or end with whitespace.

* String values in attribute specifications cannot contain control characters, including newline.

* The following table shows the maximum lengths for string attribute values.

  **Table 15.6 CREATE SPATIAL REFERENCE SYSTEM Attribute Lengths**

  <table summary="Maximum string attribute lengths for CREATE SPATIAL REFERENCE SYSTEM"><col style="width: 25%"/><col style="width: 50%"/><thead><tr> <th>Attribute</th> <th>Maximum Length (characters)</th> </tr></thead><tbody><tr> <td><code class="literal">NAME</code></td> <td>80</td> </tr><tr> <td><code class="literal">DEFINITION</code></td> <td>4096</td> </tr><tr> <td><code class="literal">ORGANIZATION</code></td> <td>256</td> </tr><tr> <td><code class="literal">DESCRIPTION</code></td> <td>2048</td> </tr></tbody></table>

Here is an example `CREATE SPATIAL REFERENCE SYSTEM` statement. The `DEFINITION` value is reformatted across multiple lines for readability. (For the statement to be legal, the value actually must be given on a single line.)

```
CREATE SPATIAL REFERENCE SYSTEM 4120
NAME 'Greek'
ORGANIZATION 'EPSG' IDENTIFIED BY 4120
DEFINITION
  'GEOGCS["Greek",DATUM["Greek",SPHEROID["Bessel 1841",
  6377397.155,299.1528128,AUTHORITY["EPSG","7004"]],
  AUTHORITY["EPSG","6120"]],PRIMEM["Greenwich",0,
  AUTHORITY["EPSG","8901"]],UNIT["degree",0.017453292519943278,
  AUTHORITY["EPSG","9122"]],AXIS["Lat",NORTH],AXIS["Lon",EAST],
  AUTHORITY["EPSG","4120"]]';
```

The grammar for SRS definitions is based on the grammar defined in *OpenGIS Implementation Specification: Coordinate Transformation Services*, Revision 1.00, OGC 01-009, January 12, 2001, Section 7.2. This specification is available at <http://www.opengeospatial.org/standards/ct>.

MySQL incorporates these changes to the specification:

* Only the `<horz cs>` production rule is implemented (that is, geographic and projected SRSs).

* There is an optional, nonstandard `<authority>` clause for `<parameter>`. This makes it possible to recognize projection parameters by authority instead of name.

* The specification does not make `AXIS` clauses mandatory in `GEOGCS` spatial reference system definitions. However, if there are no `AXIS` clauses, MySQL cannot determine whether a definition has axes in latitude-longitude order or longitude-latitude order. MySQL enforces the nonstandard requirement that each `GEOGCS` definition must include two `AXIS` clauses. One must be `NORTH` or `SOUTH`, and the other `EAST` or `WEST`. The `AXIS` clause order determines whether the definition has axes in latitude-longitude order or longitude-latitude order.

* SRS definitions may not contain newlines.

If an SRS definition specifies an authority code for the projection (which is recommended), an error occurs if the definition is missing mandatory parameters. In this case, the error message indicates what the problem is. The projection methods and mandatory parameters that MySQL supports are shown in Table 15.7, “Supported Spatial Reference System Projection Methods” and Table 15.8, “Spatial Reference System Projection Parameters”.

The following table shows the projection methods that MySQL supports. MySQL permits unknown projection methods but cannot check the definition for mandatory parameters and cannot convert spatial data to or from an unknown projection. For detailed explanations of how each projection works, including formulas, see EPSG Guidance Note 7-2.

**Table 15.7 Supported Spatial Reference System Projection Methods**

<table summary="Supported spatial reference system projection codes, names, and mandatory EPSG parameters."><col style="width: 10%"/><col style="width: 45%"/><col style="width: 35%"/><thead><tr> <th>EPSG Code</th> <th>Projection Name</th> <th>Mandatory Parameters (EPSG Codes)</th> </tr></thead><tbody><tr> <th>1024</th> <td>Popular Visualisation Pseudo Mercator</td> <td>8801, 8802, 8806, 8807</td> </tr><tr> <th>1027</th> <td>Lambert Azimuthal Equal Area (Spherical)</td> <td>8801, 8802, 8806, 8807</td> </tr><tr> <th>1028</th> <td>Equidistant Cylindrical</td> <td>8823, 8802, 8806, 8807</td> </tr><tr> <th>1029</th> <th>Equidistant Cylindrical (Spherical)</th> <th>8823, 8802, 8806, 8807</th> </tr><tr> <th>1041</th> <th>Krovak (North Orientated)</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807</th> </tr><tr> <th>1042</th> <th>Krovak Modified</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807, 8617, 8618, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035</th> </tr><tr> <th>1043</th> <th>Krovak Modified (North Orientated)</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807, 8617, 8618, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035</th> </tr><tr> <th>1051</th> <th>Lambert Conic Conformal (2SP Michigan)</th> <th>8821, 8822, 8823, 8824, 8826, 8827, 1038</th> </tr><tr> <th>1052</th> <th>Colombia Urban</th> <th>8801, 8802, 8806, 8807, 1039</th> </tr><tr> <th>9801</th> <th>Lambert Conic Conformal (1SP)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9802</th> <th>Lambert Conic Conformal (2SP)</th> <th>8821, 8822, 8823, 8824, 8826, 8827</th> </tr><tr> <th>9803</th> <th>Lambert Conic Conformal (2SP Belgium)</th> <th>8821, 8822, 8823, 8824, 8826, 8827</th> </tr><tr> <th>9804</th> <th>Mercator (variant A)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9805</th> <th>Mercator (variant B)</th> <th>8823, 8802, 8806, 8807</th> </tr><tr> <th>9806</th> <th>Cassini-Soldner</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9807</th> <th>Transverse Mercator</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9808</th> <th>Transverse Mercator (South Orientated)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9809</th> <th>Oblique Stereographic</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9810</th> <th>Polar Stereographic (variant A)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9811</th> <th>New Zealand Map Grid</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9812</th> <th>Hotine Oblique Mercator (variant A)</th> <th>8811, 8812, 8813, 8814, 8815, 8806, 8807</th> </tr><tr> <th>9813</th> <th>Laborde Oblique Mercator</th> <th>8811, 8812, 8813, 8815, 8806, 8807</th> </tr><tr> <th>9815</th> <th>Hotine Oblique Mercator (variant B)</th> <th>8811, 8812, 8813, 8814, 8815, 8816, 8817</th> </tr><tr> <th>9816</th> <th>Tunisia Mining Grid</th> <th>8821, 8822, 8826, 8827</th> </tr><tr> <th>9817</th> <th>Lambert Conic Near-Conformal</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9818</th> <th>American Polyconic</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9819</th> <th>Krovak</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807</th> </tr><tr> <th>9820</th> <th>Lambert Azimuthal Equal Area</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9822</th> <th>Albers Equal Area</th> <th>8821, 8822, 8823, 8824, 8826, 8827</th> </tr><tr> <th>9824</th> <th>Transverse Mercator Zoned Grid System</th> <th>8801, 8830, 8831, 8805, 8806, 8807</th> </tr><tr> <th>9826</th> <th>Lambert Conic Conformal (West Orientated)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th>9828</th> <th>Bonne (South Orientated)</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9829</th> <th>Polar Stereographic (variant B)</th> <th>8832, 8833, 8806, 8807</th> </tr><tr> <th>9830</th> <th>Polar Stereographic (variant C)</th> <th>8832, 8833, 8826, 8827</th> </tr><tr> <th>9831</th> <th>Guam Projection</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9832</th> <th>Modified Azimuthal Equidistant</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9833</th> <th>Hyperbolic Cassini-Soldner</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th>9834</th> <th>Lambert Cylindrical Equal Area (Spherical)</th> <th>8823, 8802, 8806, 8807</th> </tr><tr> <th>9835</th> <td>Lambert Cylindrical Equal Area</td> <td>8823, 8802, 8806, 8807</td> </tr></tbody></table>

The following table shows the projection parameters that MySQL recognizes. Recognition occurs primarily by authority code. If there is no authority code, MySQL falls back to case-insensitive string matching on the parameter name. For details about each parameter, look it up by code in the [EPSG Online Registry](https://www.epsg-registry.org).

**Table 15.8 Spatial Reference System Projection Parameters**

<table summary="Spatial reference system projection codes, fallback names, and EPSG names."><col style="width: 10%"/><col style="width: 45%"/><col style="width: 35%"/><thead><tr> <th>EPSG Code</th> <th>Fallback Name (Recognized by MySQL)</th> <th>EPSG Name</th> </tr></thead><tbody><tr> <th>1026</th> <th>c1</th> <th>C1</th> </tr><tr> <th>1027</th> <th>c2</th> <th>C2</th> </tr><tr> <th>1028</th> <th>c3</th> <th>C3</th> </tr><tr> <th>1029</th> <th>c4</th> <th>C4</th> </tr><tr> <th>1030</th> <th>c5</th> <th>C5</th> </tr><tr> <th>1031</th> <th>c6</th> <th>C6</th> </tr><tr> <th>1032</th> <th>c7</th> <th>C7</th> </tr><tr> <th>1033</th> <th>c8</th> <th>C8</th> </tr><tr> <th>1034</th> <th>c9</th> <th>C9</th> </tr><tr> <th>1035</th> <th>c10</th> <th>C10</th> </tr><tr> <th>1036</th> <th>azimuth</th> <th>Co-latitude of cone axis</th> </tr><tr> <th>1038</th> <th>ellipsoid_scale_factor</th> <th>Ellipsoid scaling factor</th> </tr><tr> <th>1039</th> <th>projection_plane_height_at_origin</th> <th>Projection plane origin height</th> </tr><tr> <th>8617</th> <th>evaluation_point_ordinate_1</th> <th>Ordinate 1 of evaluation point</th> </tr><tr> <th>8618</th> <th>evaluation_point_ordinate_2</th> <th>Ordinate 2 of evaluation point</th> </tr><tr> <th>8801</th> <th>latitude_of_origin</th> <th>Latitude of natural origin</th> </tr><tr> <th>8802</th> <th>central_meridian</th> <th>Longitude of natural origin</th> </tr><tr> <th>8805</th> <th>scale_factor</th> <th>Scale factor at natural origin</th> </tr><tr> <th>8806</th> <th>false_easting</th> <th>False easting</th> </tr><tr> <th>8807</th> <th>false_northing</th> <th>False northing</th> </tr><tr> <th>8811</th> <th>latitude_of_center</th> <th>Latitude of projection centre</th> </tr><tr> <th>8812</th> <th>longitude_of_center</th> <th>Longitude of projection centre</th> </tr><tr> <th>8813</th> <th>azimuth</th> <th>Azimuth of initial line</th> </tr><tr> <th>8814</th> <th>rectified_grid_angle</th> <th>Angle from Rectified to Skew Grid</th> </tr><tr> <th>8815</th> <th>scale_factor</th> <th>Scale factor on initial line</th> </tr><tr> <th>8816</th> <th>false_easting</th> <th>Easting at projection centre</th> </tr><tr> <th>8817</th> <th>false_northing</th> <th>Northing at projection centre</th> </tr><tr> <th>8818</th> <th>pseudo_standard_parallel_1</th> <th>Latitude of pseudo standard parallel</th> </tr><tr> <th>8819</th> <th>scale_factor</th> <th>Scale factor on pseudo standard parallel</th> </tr><tr> <th>8821</th> <th>latitude_of_origin</th> <th>Latitude of false origin</th> </tr><tr> <th>8822</th> <th>central_meridian</th> <th>Longitude of false origin</th> </tr><tr> <th>8823</th> <th>standard_parallel_1, standard_parallel1</th> <th>Latitude of 1st standard parallel</th> </tr><tr> <th>8824</th> <th>standard_parallel_2, standard_parallel2</th> <th>Latitude of 2nd standard parallel</th> </tr><tr> <th>8826</th> <th>false_easting</th> <th>Easting at false origin</th> </tr><tr> <th>8827</th> <th>false_northing</th> <th>Northing at false origin</th> </tr><tr> <th>8830</th> <th>initial_longitude</th> <th>Initial longitude</th> </tr><tr> <th>8831</th> <th>zone_width</th> <th>Zone width</th> </tr><tr> <th>8832</th> <th>standard_parallel</th> <th>Latitude of standard parallel</th> </tr><tr> <th>8833</th> <td>longitude_of_center</td> <td>Longitude of origin</td> </tr></tbody></table>
