## 17.22 InnoDB Restrictions and Limitations

This section describes restrictions and limitations of the `InnoDB` storage engine.

* You cannot create a table with a column name that matches the name of an internal `InnoDB` column (including `DB_ROW_ID`, `DB_TRX_ID`, and `DB_ROLL_PTR`. This restriction applies to use of the names in any lettercase.

  ```
  mysql> CREATE TABLE t1 (c1 INT, db_row_id INT) ENGINE=INNODB;
  ERROR 1166 (42000): Incorrect column name 'db_row_id'
  ```

* `SHOW TABLE STATUS` does not provide accurate statistics for `InnoDB` tables except for the physical size reserved by the table. The row count is only a rough estimate used in SQL optimization.

* `InnoDB` does not keep an internal count of rows in a table because concurrent transactions might “see” different numbers of rows at the same time. Consequently, `SELECT COUNT(*)` statements only count rows visible to the current transaction.

  For information about how `InnoDB` processes `SELECT COUNT(*)` statements, refer to the `COUNT()` description in Section 14.19.1, “Aggregate Function Descriptions”.

* `ROW_FORMAT=COMPRESSED` is unsupported for page sizes greater than 16KB.

* A MySQL instance using a particular `InnoDB` page size (`innodb_page_size`) cannot use data files or log files from an instance that uses a different page size.

* For limitations associated with importing tables using the *Transportable Tablespaces* feature, see Table Import Limitations.

* For limitations associated with online DDL, see Section 17.12.8, “Online DDL Limitations”.

* For limitations associated with general tablespaces, see General Tablespace Limitations.

* For limitations associated with data-at-rest encryption, see Encryption Limitations.
