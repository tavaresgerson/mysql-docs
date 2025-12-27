### 14.21.5 Writing Applications for the InnoDB memcached Plugin

14.21.5.1 Adapting an Existing MySQL Schema for the InnoDB memcached Plugin

14.21.5.2 Adapting a memcached Application for the InnoDB memcached Plugin

14.21.5.3 Tuning InnoDB memcached Plugin Performance

14.21.5.4 Controlling Transactional Behavior of the InnoDB memcached Plugin

14.21.5.5 Adapting DML Statements to memcached Operations

14.21.5.6 Performing DML and DDL Statements on the Underlying InnoDB Table

Typically, writing an application for the `InnoDB` **memcached** plugin involves some degree of rewriting or adapting existing code that uses MySQL or the **memcached** API.

* With the `daemon_memcached` plugin, instead of many traditional **memcached** servers running on low-powered machines, you have the same number of **memcached** servers as MySQL servers, running on relatively high-powered machines with substantial disk storage and memory. You might reuse some existing code that works with the **memcached** API, but adaptation is likely required due to the different server configuration.

* The data stored through the `daemon_memcached` plugin goes into `VARCHAR`, `TEXT`, or `BLOB` columns, and must be converted to do numeric operations. You can perform the conversion on the application side, or by using the `CAST()` function in queries.

* Coming from a database background, you might be used to general-purpose SQL tables with many columns. The tables accessed by **memcached** code likely have only a few or even a single column holding data values.

* You might adapt parts of your application that perform single-row queries, inserts, updates, or deletes, to improve performance in critical sections of code. Both queries (read) and DML (write) operations can be substantially faster when performed through the `InnoDB` **memcached** interface. The performance improvement for writes is typically greater than the performance improvement for reads, so you might focus on adapting code that performs logging or records interactive choices on a website.

The following sections explore these points in more detail.
