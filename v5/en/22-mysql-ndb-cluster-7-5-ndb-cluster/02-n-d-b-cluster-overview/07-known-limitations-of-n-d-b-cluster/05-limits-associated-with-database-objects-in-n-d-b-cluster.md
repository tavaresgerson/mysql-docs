#### 21.2.7.5 Limits Associated with Database Objects in NDB Cluster

Some database objects such as tables and indexes have different limitations when using the [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine:

* **Database and table names.** When using the `NDB` storage engine, the maximum allowed length both for database names and for table names is 63 characters. A statement using a database name or table name longer than this limit fails with an appropriate error.

* **Number of database objects.** The maximum number of *all* [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") database objects in a single NDB Cluster—including databases, tables, and indexes—is limited to 20320.

* **Attributes per table.** The maximum number of attributes (that is, columns and indexes) that can belong to a given table is 512.

* **Attributes per key.** The maximum number of attributes per key is 32.

* **Row size.** The maximum permitted size of any one row is 14000 bytes.

  Each [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") column contributes 256 + 8 = 264 bytes to this total; this includes [`JSON`](json.html "11.5 The JSON Data Type") columns. See [String Type Storage Requirements](storage-requirements.html#data-types-storage-reqs-strings "String Type Storage Requirements"), as well as [JSON Storage Requirements](storage-requirements.html#data-types-storage-reqs-json "JSON Storage Requirements"), for more information relating to these types.

  In addition, the maximum offset for a fixed-width column of an `NDB` table is 8188 bytes; attempting to create a table that violates this limitation fails with NDB error 851 Maximum offset for fixed-size columns exceeded. For memory-based columns, you can work around this limitation by using a variable-width column type such as [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") or defining the column as `COLUMN_FORMAT=DYNAMIC`; this does not work with columns stored on disk. For disk-based columns, you may be able to do so by reordering one or more of the table's disk-based columns such that the combined width of all but the disk-based column defined last in the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement used to create the table does not exceed 8188 bytes, less any possible rounding performed for some data types such as [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") or `VARCHAR`; otherwise it is necessary to use memory-based storage for one or more of the offending column or columns instead.

* **BIT column storage per table.** The maximum combined width for all [`BIT`](bit-type.html "11.1.5 Bit-Value Type - BIT") columns used in a given `NDB` table is 4096.

* **FIXED column storage.** NDB Cluster 7.5 and later supports a maximum of 128 TB per fragment of data in `FIXED` columns. (Previously, this was 16 GB.)
