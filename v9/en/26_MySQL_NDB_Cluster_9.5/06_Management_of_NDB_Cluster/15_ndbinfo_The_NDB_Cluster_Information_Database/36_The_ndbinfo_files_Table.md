#### 25.6.15.36 The ndbinfo files Table

The `files` tables provides information about files and other objects used by `NDB` disk data tables, and contains the columns listed here:

* `id`

  Object ID

* `type`

  The type of object; one of `Log file group`, `Tablespace`, `Undo file`, or `Data file`

* `name`

  The name of the object

* `parent`

  ID of the parent object

* `parent_name`

  Name of the parent object

* `free_extents`

  Number of free extents

* `total_extents`

  Total number of extents

* `extent_size`

  Extent size (MB)

* `initial_size`

  Initial size (bytes)

* `maximum_size`

  Maximum size (bytes)

* `autoextend_size`

  Autoextend size (bytes)

For log file groups and tablespaces, `parent` is always `0`, and the `parent_name`, `free_extents`, `total_extents`, `extent_size`, `initial_size`, `maximum_size`, and `autoentend_size` columns are all `NULL`.

The `files` table is empty if no disk data objects have been created in `NDB`. See Section 25.6.11.1, “NDB Cluster Disk Data Objects”, for more information.

See also Section 28.3.15, “The INFORMATION\_SCHEMA FILES Table”.
