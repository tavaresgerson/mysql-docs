#### 7.6.6.14 Clone Plugin Limitations

The clone plugin is subject to these limitations:

* An instance cannot be cloned from a different MySQL server series. For example, you cannot clone between MySQL 8.0 and MySQL 8.4, but can clone within a series such as MySQL 8.4.1 and MySQL 8.4.13.

* Only a single MySQL instance can be cloned at a time. Cloning multiple MySQL instances in a single cloning operation is not supported.

* The X Protocol port specified by `mysqlx_port` is not supported for remote cloning operations (when specifying the port number of the donor MySQL server instance in a `CLONE INSTANCE` statement).

* The clone plugin does not support cloning of MySQL server configurations. The recipient MySQL server instance retains its configuration, including persisted system variable settings (see Section 7.1.9.3, “Persisted System Variables”.)

* The clone plugin does not support cloning of binary logs.
* The clone plugin only clones data stored in `InnoDB`. Other storage engine data is not cloned. `MyISAM` and `CSV` tables stored in any schema including the `sys` schema are cloned as empty tables.

* Connecting to the donor MySQL server instance through MySQL Router is not supported.

* Local cloning operations do not support cloning of general tablespaces that were created with an absolute path. A cloned tablespace file with the same path as the source tablespace file would cause a conflict.
