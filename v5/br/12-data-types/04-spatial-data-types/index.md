## 11.4 Spatial Data Types

11.4.1 Spatial Data Types

11.4.2 The OpenGIS Geometry Model

11.4.3 Supported Spatial Data Formats

11.4.4 Geometry Well-Formedness and Validity

11.4.5 Creating Spatial Columns

11.4.6 Populating Spatial Columns

11.4.7 Fetching Spatial Data

11.4.8 Optimizing Spatial Analysis

11.4.9 Creating Spatial Indexes

11.4.10 Using Spatial Indexes

The Open Geospatial Consortium (OGC) is an international consortium of more than 250 companies, agencies, and universities participating in the development of publicly available conceptual solutions that can be useful with all kinds of applications that manage spatial data.

The Open Geospatial Consortium publishes the *OpenGIS® Implementation Standard for Geographic information - Simple Feature Access - Part 2: SQL Option*, a document that proposes several conceptual ways for extending an SQL RDBMS to support spatial data. This specification is available from the OGC website at <http://www.opengeospatial.org/standards/sfs>.

Following the OGC specification, MySQL implements spatial extensions as a subset of the **SQL with Geometry Types** environment. This term refers to an SQL environment that has been extended with a set of geometry types. A geometry-valued SQL column is implemented as a column that has a geometry type. The specification describes a set of SQL geometry types, as well as functions on those types to create and analyze geometry values.

MySQL spatial extensions enable the generation, storage, and analysis of geographic features:

* Data types for representing spatial values
* Functions for manipulating spatial values
* Spatial indexing for improved access times to spatial columns

The spatial data types and functions are available for `MyISAM`, `InnoDB`, `NDB`, and `ARCHIVE` tables. For indexing spatial columns, `MyISAM` and `InnoDB` support both `SPATIAL` and non-`SPATIAL` indexes. The other storage engines support non-`SPATIAL` indexes, as described in Section 13.1.14, “CREATE INDEX Statement”.

A **geographic feature** is anything in the world that has a location. A feature can be:

* An entity. For example, a mountain, a pond, a city.
* A space. For example, town district, the tropics.
* A definable location. For example, a crossroad, as a particular place where two streets intersect.

Some documents use the term **geospatial feature** to refer to geographic features.

**Geometry** is another word that denotes a geographic feature. Originally the word **geometry** meant measurement of the earth. Another meaning comes from cartography, referring to the geometric features that cartographers use to map the world.

The discussion here considers these terms synonymous: **geographic feature**, **geospatial feature**, **feature**, or **geometry**. The term most commonly used is **geometry**, defined as *a point or an aggregate of points representing anything in the world that has a location*.

The following material covers these topics:

* The spatial data types implemented in MySQL model
* The basis of the spatial extensions in the OpenGIS geometry model

* Data formats for representing spatial data
* How to use spatial data in MySQL
* Use of indexing for spatial data
* MySQL differences from the OpenGIS specification

For information about functions that operate on spatial data, see Section 12.16, “Spatial Analysis Functions”.

### MySQL GIS Conformance and Compatibility

MySQL does not implement the following GIS features:

* Additional Metadata Views

  OpenGIS specifications propose several additional metadata views. For example, a system view named `GEOMETRY_COLUMNS` contains a description of geometry columns, one row for each geometry column in the database.

* The OpenGIS function `Length()` on `LineString` and `MultiLineString` should be called in MySQL as `ST_Length()`

  The problem is that there is an existing SQL function `Length()` that calculates the length of string values, and sometimes it is not possible to distinguish whether the function is called in a textual or spatial context.

### Additional Resources

The Open Geospatial Consortium publishes the *OpenGIS® Implementation Standard for Geographic information - Simple feature access - Part 2: SQL option*, a document that proposes several conceptual ways for extending an SQL RDBMS to support spatial data. The Open Geospatial Consortium (OGC) maintains a website at <http://www.opengeospatial.org/>. The specification is available there at <http://www.opengeospatial.org/standards/sfs>. It contains additional information relevant to the material here.

If you have questions or concerns about the use of the spatial extensions to MySQL, you can discuss them in the GIS forum: <https://forums.mysql.com/list.php?23>.
