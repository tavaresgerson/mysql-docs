## 17.20 InnoDB memcached Plugin

17.20.1 Benefits of the InnoDB memcached Plugin

17.20.2 InnoDB memcached Architecture

17.20.3 Setting Up the InnoDB memcached Plugin

17.20.4 InnoDB memcached Multiple get and Range Query Support

17.20.5 Security Considerations for the InnoDB memcached Plugin

17.20.6 Writing Applications for the InnoDB memcached Plugin

17.20.7 The InnoDB memcached Plugin and Replication

17.20.8 InnoDB memcached Plugin Internals

17.20.9 Troubleshooting the InnoDB memcached Plugin

Important

The `InnoDB` **memcached** plugin was removed in MySQL 8.3.0, and was deprecated in MySQL 8.0.22.

The `InnoDB` **memcached** plugin (`daemon_memcached`) provides an integrated **memcached** daemon that automatically stores and retrieves data from `InnoDB` tables, turning the MySQL server into a fast “key-value store”. Instead of formulating queries in SQL, you can use simple `get`, `set`, and `incr` operations that avoid the performance overhead associated with SQL parsing and constructing a query optimization plan. You can also access the same `InnoDB` tables through SQL for convenience, complex queries, bulk operations, and other strengths of traditional database software.

This “NoSQL-style” interface uses the **memcached** API to speed up database operations, letting `InnoDB` handle memory caching using its buffer pool mechanism. Data modified through **memcached** operations such as `add`, `set`, and `incr` are stored to disk, in `InnoDB` tables. The combination of **memcached** simplicity and `InnoDB` reliability and consistency provides users with the best of both worlds, as explained in Section 17.20.1, “Benefits of the InnoDB memcached Plugin”. For an architectural overview, see Section 17.20.2, “InnoDB memcached Architecture”.
