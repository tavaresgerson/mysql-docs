#### 7.6.7.14 Clone Plugin Limitations

The clone plugin is subject to these limitations:

* An instance cannot be cloned from a different MySQL server series. For example, you cannot clone between MySQL 8.0 and MySQL 8.4, but can clone within a series such as MySQL 8.0.37 and MySQL 8.0.42. Before 8.0.37, the point release number also had to match, so cloning the likes of 8.0.36 to 8.0.42 or vice-versa is not permitted

* Prior to MySQL 8.0.27, DDL on the donor and recipient, including `TRUNCATE TABLE`, is not permitted during a cloning operation. This limitation should be considered when selecting data sources. A workaround is to use dedicated donor instances, which can accommodate DDL operations being blocked while data is cloned. Concurrent DML is permitted.

  From MySQL 8.0.27, concurrent DDL is permitted on the donor by default. Support for concurrent DDL on the donor is controlled by the `clone_block_ddl` variable. See Section 7.6.7.4, “Cloning and Concurrent DDL”.

* Cloning from a donor MySQL server instance to a hotfix MySQL server instance of the same version and release is only supported with MySQL 8.0.26 and higher.

* Only a single MySQL instance can be cloned at a time. Cloning multiple MySQL instances in a single cloning operation is not supported.

* The X Protocol port specified by `mysqlx_port` is not supported for remote cloning operations (when specifying the port number of the donor MySQL server instance in a `CLONE INSTANCE` statement).

* The clone plugin does not support cloning of MySQL server configurations. The recipient MySQL server instance retains its configuration, including persisted system variable settings (see Section 7.1.9.3, “Persisted System Variables”.)

* The clone plugin does not support cloning of binary logs.
* The clone plugin only clones data stored in `InnoDB`. Other storage engine data is not cloned. `MyISAM` and `CSV` tables stored in any schema including the `sys` schema are cloned as empty tables.

* Connecting to the donor MySQL server instance through MySQL Router is not supported.

* Local cloning operations do not support cloning of general tablespaces that were created with an absolute path. A cloned tablespace file with the same path as the source tablespace file would cause a conflict.
