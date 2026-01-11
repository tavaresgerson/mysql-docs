## 13.4 Spatial Data Types

13.4.1 Spatial Data Types

13.4.2 The OpenGIS Geometry Model

13.4.3 Supported Spatial Data Formats

13.4.4 Geometry Well-Formedness and Validity

13.4.5 Spatial Reference System Support

13.4.6 Creating Spatial Columns

13.4.7 Populating Spatial Columns

13.4.8 Fetching Spatial Data

13.4.9 Optimizing Spatial Analysis

13.4.10 Creating Spatial Indexes

13.4.11 Using Spatial Indexes

The Open Geospatial Consortium (OGC) is an international consortium of more than 250 companies, agencies, and universities participating in the development of publicly available conceptual solutions that can be useful with all kinds of applications that manage spatial data.

The Open Geospatial Consortium publishes the *OpenGIS® Implementation Standard for Geographic information - Simple feature access - Part 2: SQL option*, a document that proposes several conceptual ways for extending an SQL RDBMS to support spatial data. This specification is available from the OGC website at <http://www.opengeospatial.org/standards/sfs>.

Following the OGC specification, MySQL implements spatial extensions as a subset of the **SQL with Geometry Types** environment. This term refers to an SQL environment that has been extended with a set of geometry types. A geometry-valued SQL column is implemented as a column that has a geometry type. The specification describes a set of SQL geometry types, as well as functions on those types to create and analyze geometry values.

MySQL spatial extensions enable the generation, storage, and analysis of geographic features:

* Data types for representing spatial values
* Functions for manipulating spatial values
* Spatial indexing for improved access times to spatial columns

The spatial data types and functions are available for `MyISAM`, `InnoDB`, `NDB`, and `ARCHIVE` tables. For indexing spatial columns, `MyISAM` and `InnoDB` support both `SPATIAL` and non-`SPATIAL` indexes. The other storage engines support non-`SPATIAL` indexes, as described in Section 15.1.15, “CREATE INDEX Statement”.

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

For information about functions that operate on spatial data, see Section 14.16, “Spatial Analysis Functions”.

### Additional Resources

These standards are important for the MySQL implementation of spatial operations:

* SQL/MM Part 3: Spatial.
* The Open Geospatial Consortium publishes the *OpenGIS® Implementation Standard for Geographic information*, a document that proposes several conceptual ways for extending an SQL RDBMS to support spatial data. See in particular Simple Feature Access - Part 1: Common Architecture, and Simple Feature Access - Part 2: SQL Option. The Open Geospatial Consortium (OGC) maintains a website at <http://www.opengeospatial.org/>. The specification is available there at <http://www.opengeospatial.org/standards/sfs>. It contains additional information relevant to the material here.

* The grammar for spatial reference system (SRS) definitions is based on the grammar defined in *OpenGIS Implementation Specification: Coordinate Transformation Services*, Revision 1.00, OGC 01-009, January 12, 2001, Section 7.2. This specification is available at <http://www.opengeospatial.org/standards/ct>. For differences from that specification in SRS definitions as implemented in MySQL, see Section 15.1.19, “CREATE SPATIAL REFERENCE SYSTEM Statement”.

If you have questions or concerns about the use of the spatial extensions to MySQL, you can discuss them in the GIS forum: <https://forums.mysql.com/list.php?23>.
