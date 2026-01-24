## 12.16 Spatial Analysis Functions

12.16.1 Spatial Function Reference

12.16.2 Argument Handling by Spatial Functions

12.16.3 Functions That Create Geometry Values from WKT Values

12.16.4 Functions That Create Geometry Values from WKB Values

12.16.5 MySQL-Specific Functions That Create Geometry Values

12.16.6 Geometry Format Conversion Functions

12.16.7 Geometry Property Functions

12.16.8 Spatial Operator Functions

12.16.9 Functions That Test Spatial Relations Between Geometry Objects

12.16.10 Spatial Geohash Functions

12.16.11 Spatial GeoJSON Functions

12.16.12 Spatial Convenience Functions

MySQL provides functions to perform various operations on spatial data. These functions can be grouped into several major categories according to the type of operation they perform:

* Functions that create geometries in various formats (WKT, WKB, internal)

* Functions that convert geometries between formats
* Functions that access qualitative or quantitative properties of a geometry

* Functions that describe relations between two geometries
* Functions that create new geometries from existing ones

For general background about MySQL support for using spatial data, see Section 11.4, “Spatial Data Types”.
