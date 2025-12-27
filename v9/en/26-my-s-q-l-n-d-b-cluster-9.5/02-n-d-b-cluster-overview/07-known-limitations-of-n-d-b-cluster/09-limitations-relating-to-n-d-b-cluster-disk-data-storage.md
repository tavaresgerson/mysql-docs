#### 25.2.7.9 Limitations Relating to NDB Cluster Disk Data Storage

**Disk Data object maximums and minimums.** Disk data objects are subject to the following maximums and minimums:

* Maximum number of tablespaces: 232 (4294967296)

* Maximum number of data files per tablespace: 216 (65536)

* The minimum and maximum possible sizes of extents for tablespace data files are 32K and 2G, respectively. See Section 15.1.25, “CREATE TABLESPACE Statement”, for more information.

In addition, when working with NDB Disk Data tables, you should be aware of the following issues regarding data files and extents:

* Data files use `DataMemory`. Usage is the same as for in-memory data.

* Data files use file descriptors. It is important to keep in mind that data files are always open, which means the file descriptors are always in use and cannot be re-used for other system tasks.

* Extents require sufficient `DiskPageBufferMemory`; you must reserve enough for this parameter to account for all memory used by all extents (number of extents times size of extents).

**Disk Data tables and diskless mode.** Use of Disk Data tables is not supported when running the cluster in diskless mode.
