### 28.3.35 The INFORMATION\_SCHEMA ROUTINE\_LIBRARIES Table

The `ROUTINE_LIBRARIES` table lists different JavaScript routines and the libraries supported by MLE Component (see Section 7.5.7, “Multilingual Engine Component (MLE)”")) that are imported by these JavaScript routines.

The `ROUTINE_LIBRARIES` table has the columns listed here:

* `ROUTINE_CATALOG`

  Routine catalog name. Currently, this is always `def`.

* `ROUTINE_SCHEMA`

  Routine schema or database.

* `ROUTINE_NAME`

  Name of the routine.

* `ROUTINE_TYPE`

  Type of routine. One of `FUNCTION`, `PROCEDURE`, or `LIBRARY`.

* `LIBRARY_CATALOG`

  Library catalog name. Currently, this is always `def`.

* `LIBRARY_SCHEMA`

  Library database or schema.

* `LIBRARY_NAME`

  Library name.

* `LIBRARY_VERSION`

  Library version.

Example:

```
mysql> TABLE information_schema.ROUTINE_LIBRARIES\G
*************************** 1. row ***************************
ROUTINE_CATALOG: def
 ROUTINE_SCHEMA: jslib
   ROUTINE_NAME: foo
   ROUTINE_TYPE: FUNCTION
LIBRARY_CATALOG: def
 LIBRARY_SCHEMA: jslib
   LIBRARY_NAME: lib1
LIBRARY_VERSION: NULL
*************************** 2. row ***************************
ROUTINE_CATALOG: def
 ROUTINE_SCHEMA: jslib
   ROUTINE_NAME: foo
   ROUTINE_TYPE: FUNCTION
LIBRARY_CATALOG: def
 LIBRARY_SCHEMA: jslib
   LIBRARY_NAME: lib2
LIBRARY_VERSION: NULL
2 rows in set (0.00 sec)
```

All stored routines importing libraries are listed in the `ROUTINE_LIBRARIES` table even if the referenced Library does not exist.
