#### 25.2.7.5 Limits Associated with Database Objects in NDB Cluster

Some database objects such as tables and indexes have different limitations when using the `NDBCLUSTER` storage engine:

* **Number of database objects.** The maximum number of *all* `NDB` database objects in a single NDB Cluster—including databases, tables, and indexes—is limited to 20320.

* **Attributes per table.** The maximum number of attributes (that is, columns and indexes) that can belong to a given table is 512.

* **Attributes per key.** The maximum number of attributes per key is 32.

* **Row size.** The maximum permitted size of any one row is 30000 bytes.

  Each `BLOB` or `TEXT` column contributes 256 + 8 = 264 bytes to this total; this includes `JSON` columns. See String Type Storage Requirements, as well as JSON Storage Requirements, for more information relating to these types.

  In addition, the maximum offset for a fixed-width column of an `NDB` table is 8188 bytes; attempting to create a table that violates this limitation fails with NDB error 851 Maximum offset for fixed-size columns exceeded. For memory-based columns, you can work around this limitation by using a variable-width column type such as `VARCHAR` or defining the column as `COLUMN_FORMAT=DYNAMIC`; this does not work with columns stored on disk. For disk-based columns, you may be able to do so by reordering one or more of the table's disk-based columns such that the combined width of all but the disk-based column defined last in the `CREATE TABLE` statement used to create the table does not exceed 8188 bytes, less any possible rounding performed for some data types such as `CHAR` or `VARCHAR`; otherwise it is necessary to use memory-based storage for one or more of the offending column or columns instead.

* **BIT column storage per table.** The maximum combined width for all `BIT` columns used in a given `NDB` table is 4096.

* **FIXED column storage.** NDB Cluster supports a maximum of 128 TB per fragment of data in `FIXED` columns.
