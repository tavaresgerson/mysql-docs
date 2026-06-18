## 14.12 InnoDB Disk I/O and File Space Management

[14.12.1 InnoDB Disk I/O](innodb-disk-io.html)

[14.12.2 File Space Management](innodb-file-space.html)

[14.12.3 InnoDB Checkpoints](innodb-checkpoints.html)

[14.12.4 Defragmenting a Table](innodb-file-defragmenting.html)

[14.12.5 Reclaiming Disk Space with TRUNCATE TABLE](innodb-truncate-table-reclaim-space.html)

As a DBA, you must manage disk I/O to keep the I/O subsystem from
becoming saturated, and manage disk space to avoid filling up
storage devices. The [ACID](glossary.html#glos_acid "ACID") design
model requires a certain amount of I/O that might seem redundant,
but helps to ensure data reliability. Within these constraints,
`InnoDB` tries to optimize the database work and
the organization of disk files to minimize the amount of disk I/O.
Sometimes, I/O is postponed until the database is not busy, or until
everything needs to be brought to a consistent state, such as during
a database restart after a [fast
shutdown](glossary.html#glos_fast_shutdown "fast shutdown").

This section discusses the main considerations for I/O and disk
space with the default kind of MySQL tables (also known as
`InnoDB` tables):

* Controlling the amount of background I/O used to improve query
  performance.

* Enabling or disabling features that provide extra durability at
  the expense of additional I/O.

* Organizing tables into many small files, a few larger files, or
  a combination of both.

* Balancing the size of redo log files against the I/O activity
  that occurs when the log files become full.

* How to reorganize a table for optimal query performance.