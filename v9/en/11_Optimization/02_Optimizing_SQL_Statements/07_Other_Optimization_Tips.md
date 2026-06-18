### 10.2.7 Other Optimization Tips

This section lists a number of miscellaneous tips for improving
query processing speed:

* If your application makes several database requests to
  perform related updates, combining the statements into a
  stored routine can help performance. Similarly, if your
  application computes a single result based on several column
  values or large volumes of data, combining the computation
  into a loadable function can help performance. The resulting
  fast database operations are then available to be reused by
  other queries, applications, and even code written in
  different programming languages. See
  [Section 27.2, “Using Stored Routines”](stored-routines.html "27.2 Using Stored Routines") and
  [Adding Functions to MySQL](/doc/extending-mysql/9.5/en/adding-functions.html) for more information.

* To fix any compression issues that occur with
  `ARCHIVE` tables, use
  [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement"). See
  [Section 18.5, “The ARCHIVE Storage Engine”](archive-storage-engine.html "18.5 The ARCHIVE Storage Engine").

* If possible, classify reports as “live” or as
  “statistical”, where data needed for
  statistical reports is created only from summary tables that
  are generated periodically from the live data.

* If you have data that does not conform well to a
  rows-and-columns table structure, you can pack and store
  data into a [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") column. In
  this case, you must provide code in your application to pack
  and unpack information, but this might save I/O operations
  to read and write the sets of related values.

* With Web servers, store images and other binary assets as
  files, with the path name stored in the database rather than
  the file itself. Most Web servers are better at caching
  files than database contents, so using files is generally
  faster. (Although you must handle backups and storage issues
  yourself in this case.)

* If you need really high speed, look at the low-level MySQL
  interfaces. For example, by accessing the MySQL
  [`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") or
  [`MyISAM`](myisam-storage-engine.html "18.2 The MyISAM Storage Engine") storage engine directly,
  you could get a substantial speed increase compared to using
  the SQL interface.

  Similarly, for databases using the
  [`NDBCLUSTER`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") storage engine, you
  may wish to investigate possible use of the NDB API (see
  [MySQL NDB Cluster API Developer Guide](/doc/ndbapi/en/)).

* Replication can provide a performance benefit for some
  operations. You can distribute client retrievals among
  replicas to split up the load. To avoid slowing down the
  source while making backups, you can make backups using a
  replica. See [Chapter 19, *Replication*](replication.html "Chapter 19 Replication").