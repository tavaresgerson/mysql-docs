# Chapter 11 Data Types

**Table of Contents**

[11.1 Numeric Data Types](numeric-types.html)
:   [11.1.1 Numeric Data Type Syntax](numeric-type-syntax.html)

    [11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT](integer-types.html)

    [11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC](fixed-point-types.html)

    [11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE](floating-point-types.html)

    [11.1.5 Bit-Value Type - BIT](bit-type.html)

    [11.1.6 Numeric Type Attributes](numeric-type-attributes.html)

    [11.1.7 Out-of-Range and Overflow Handling](out-of-range-and-overflow.html)

[11.2 Date and Time Data Types](date-and-time-types.html)
:   [11.2.1 Date and Time Data Type Syntax](date-and-time-type-syntax.html)

    [11.2.2 The DATE, DATETIME, and TIMESTAMP Types](datetime.html)

    [11.2.3 The TIME Type](time.html)

    [11.2.4 The YEAR Type](year.html)

    [11.2.5 2-Digit YEAR(2) Limitations and Migrating to 4-Digit YEAR](migrating-from-year2.html)

    [11.2.6 Automatic Initialization and Updating for TIMESTAMP and DATETIME](timestamp-initialization.html)

    [11.2.7 Fractional Seconds in Time Values](fractional-seconds.html)

    [11.2.8 What Calendar Is Used By MySQL?](mysql-calendar.html)

    [11.2.9 Conversion Between Date and Time Types](date-and-time-type-conversion.html)

    [11.2.10 2-Digit Years in Dates](two-digit-years.html)

[11.3 String Data Types](string-types.html)
:   [11.3.1 String Data Type Syntax](string-type-syntax.html)

    [11.3.2 The CHAR and VARCHAR Types](char.html)

    [11.3.3 The BINARY and VARBINARY Types](binary-varbinary.html)

    [11.3.4 The BLOB and TEXT Types](blob.html)

    [11.3.5 The ENUM Type](enum.html)

    [11.3.6 The SET Type](set.html)

[11.4 Spatial Data Types](spatial-types.html)
:   [11.4.1 Spatial Data Types](spatial-type-overview.html)

    [11.4.2 The OpenGIS Geometry Model](opengis-geometry-model.html)

    [11.4.3 Supported Spatial Data Formats](gis-data-formats.html)

    [11.4.4 Geometry Well-Formedness and Validity](geometry-well-formedness-validity.html)

    [11.4.5 Creating Spatial Columns](creating-spatial-columns.html)

    [11.4.6 Populating Spatial Columns](populating-spatial-columns.html)

    [11.4.7 Fetching Spatial Data](fetching-spatial-data.html)

    [11.4.8 Optimizing Spatial Analysis](optimizing-spatial-analysis.html)

    [11.4.9 Creating Spatial Indexes](creating-spatial-indexes.html)

    [11.4.10 Using Spatial Indexes](using-spatial-indexes.html)

[11.5 The JSON Data Type](json.html)

[11.6 Data Type Default Values](data-type-defaults.html)

[11.7 Data Type Storage Requirements](storage-requirements.html)

[11.8 Choosing the Right Type for a Column](choosing-types.html)

[11.9 Using Data Types from Other Database Engines](other-vendor-data-types.html)

MySQL supports [SQL](glossary.html#glos_sql "SQL") data types in
several categories: numeric types, date and time types, string
(character and byte) types, spatial types, and the
[`JSON`](json.html "11.5 The JSON Data Type") data type. This chapter provides
an overview and more detailed description of the properties of the
types in each category, and a summary of the data type storage
requirements. The initial overviews are intentionally brief. Consult
the more detailed descriptions for additional information about
particular data types, such as the permissible formats in which you
can specify values.

Data type descriptions use these conventions:

* For integer types, *`M`* indicates the
  maximum display width. For floating-point and fixed-point types,
  *`M`* is the total number of digits that
  can be stored (the precision). For string types,
  *`M`* is the maximum length. The maximum
  permissible value of *`M`* depends on the
  data type.

* *`D`* applies to floating-point and
  fixed-point types and indicates the number of digits following
  the decimal point (the scale). The maximum possible value is 30,
  but should be no greater than
  *`M`*−2.

* *`fsp`* applies to the
  [`TIME`](time.html "11.2.3 The TIME Type"),
  [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), and
  [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") types and represents
  fractional seconds precision; that is, the number of digits
  following the decimal point for fractional parts of seconds. The
  *`fsp`* value, if given, must be in the
  range 0 to 6. A value of 0 signifies that there is no fractional
  part. If omitted, the default precision is 0. (This differs from
  the standard SQL default of 6, for compatibility with previous
  MySQL versions.)

* Square brackets (`[` and `]`)
  indicate optional parts of type definitions.