## 14.21 InnoDB memcached Plugin

14.21.1 Benefits of the InnoDB memcached Plugin

14.21.2 InnoDB memcached Architecture

14.21.3 Setting Up the InnoDB memcached Plugin

14.21.4 Security Considerations for the InnoDB memcached Plugin

14.21.5 Writing Applications for the InnoDB memcached Plugin

14.21.6 The InnoDB memcached Plugin and Replication

14.21.7 InnoDB memcached Plugin Internals

14.21.8 Troubleshooting the InnoDB memcached Plugin

The `InnoDB` **memcached** plugin (`daemon_memcached`) provides an integrated **memcached** daemon that automatically stores and retrieves data from `InnoDB` tables, turning the MySQL server into a fast “key-value store”. Instead of formulating queries in SQL, you can use simple `get`, `set`, and `incr` operations that avoid the performance overhead associated with SQL parsing and constructing a query optimization plan. You can also access the same `InnoDB` tables through SQL for convenience, complex queries, bulk operations, and other strengths of traditional database software.

This “NoSQL-style” interface uses the **memcached** API to speed up database operations, letting `InnoDB` handle memory caching using its buffer pool mechanism. Data modified through **memcached** operations such as `add`, `set`, and `incr` are stored to disk, in `InnoDB` tables. The combination of **memcached** simplicity and `InnoDB` reliability and consistency provides users with the best of both worlds, as explained in Section 14.21.1, “Benefits of the InnoDB memcached Plugin”. For an architectural overview, see Section 14.21.2, “InnoDB memcached Architecture”.
