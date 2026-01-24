### 13.1.4 ALTER INSTANCE Statement

```sql
ALTER INSTANCE ROTATE INNODB MASTER KEY
```

`ALTER INSTANCE`, introduced in MySQL 5.7.11, defines actions applicable to a MySQL server instance. The statement supports these actions:

* `ALTER INSTANCE ROTATE INNODB MASTER KEY`

  This action rotates the master encryption key used for `InnoDB` tablespace encryption. Key rotation requires the [`SUPER`](privileges-provided.html#priv_super) privilege. To perform this action, a keyring plugin must be installed and configured. For instructions, see [Section 6.4.4, “The MySQL Keyring”](keyring.html "6.4.4 The MySQL Keyring").

  `ALTER INSTANCE ROTATE INNODB MASTER KEY` supports concurrent DML. However, it cannot be run concurrently with [`CREATE TABLE ... ENCRYPTION`](create-table.html "13.1.18 CREATE TABLE Statement") or [`ALTER TABLE ... ENCRYPTION`](alter-table.html "13.1.8 ALTER TABLE Statement") operations, and locks are taken to prevent conflicts that could arise from concurrent execution of these statements. If one of the conflicting statements is running, it must complete before another can proceed.

  `ALTER INSTANCE` actions are written to the binary log so that they can be executed on replicated servers.

  For additional `ALTER INSTANCE ROTATE INNODB MASTER KEY` usage information, see [Section 14.14, “InnoDB Data-at-Rest Encryption”](innodb-data-encryption.html "14.14 InnoDB Data-at-Rest Encryption"). For information about keyring plugins, see [Section 6.4.4, “The MySQL Keyring”](keyring.html "6.4.4 The MySQL Keyring").
