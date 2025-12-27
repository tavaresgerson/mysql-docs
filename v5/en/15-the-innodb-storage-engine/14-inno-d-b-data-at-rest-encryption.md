## 14.14 InnoDB Data-at-Rest Encryption

`InnoDB` supports data-at-rest encryption for file-per-table tablespaces.

* About Data-at-Rest Encryption
* Encryption Prerequisites
* Enabling File-Per-Table Tablespace Encryption
* Master Key Rotation
* Encryption and Recovery
* Exporting Encrypted Tablespaces
* Encryption and Replication
* Identifying Encrypted Tablespaces
* Encryption Usage Notes
* Encryption Limitations

### About Data-at-Rest Encryption

`InnoDB` uses a two tier encryption key architecture, consisting of a master encryption key and tablespace keys. When a tablespace is encrypted, a tablespace key is encrypted and stored in the tablespace header. When an application or authenticated user wants to access encrypted data, `InnoDB` uses a master encryption key to decrypt the tablespace key. The decrypted version of a tablespace key never changes, but the master encryption key can be changed as required. This action is referred to as *master key rotation*.

The data-at-rest encryption feature relies on a keyring plugin for master encryption key management.

All MySQL editions provide a `keyring_file` plugin, which stores keyring data in a file local to the server host.

MySQL Enterprise Edition offers additional keyring plugins:

* `keyring_encrypted_file`: Stores keyring data in an encrypted, password-protected file local to the server host.

* `keyring_okv`: A KMIP 1.1 plugin for use with KMIP-compatible back end keyring storage products. Supported KMIP-compatible products include centralized key management solutions such as Oracle Key Vault, Gemalto KeySecure, Thales Vormetric key management server, and Fornetix Key Orchestration.

* `keyring_aws`: Communicates with the Amazon Web Services Key Management Service (AWS KMS) as a back end for key generation and uses a local file for key storage.

Warning

For encryption key management, the `keyring_file` and `keyring_encrypted_file` plugins are not intended as a regulatory compliance solution. Security standards such as PCI, FIPS, and others require use of key management systems to secure, manage, and protect encryption keys in key vaults or hardware security modules (HSMs).

A secure and robust encryption key management solution is critical for security and for compliance with various security standards. When the data-at-rest encryption feature uses a centralized key management solution, the feature is referred to as “MySQL Enterprise Transparent Data Encryption (TDE)”.

The data-at-rest encryption feature supports the Advanced Encryption Standard (AES) block-based encryption algorithm. It uses Electronic Codebook (ECB) block encryption mode for tablespace key encryption and Cipher Block Chaining (CBC) block encryption mode for data encryption.

For frequently asked questions about the data-at-rest encryption feature, see Section A.17, “MySQL 5.7 FAQ: InnoDB Data-at-Rest Encryption”.

### Encryption Prerequisites

* A keyring plugin must be installed and configured. Keyring plugin installation is performed at startup using the `early-plugin-load` option. Early loading ensures that the plugin is available prior to initialization of the `InnoDB` storage engine. For keyring plugin installation and configuration instructions, see Section 6.4.4, “The MySQL Keyring”.

  Only one keyring plugin should be enabled at a time. Enabling multiple keyring plugins is unsupported and results may not be as anticipated.

  Important

  Once encrypted tablespaces are created in a MySQL instance, the keyring plugin that was loaded when creating the encrypted tablespace must continue to be loaded at startup using the `early-plugin-load` option. Failing to do so results in errors when starting the server and during `InnoDB` recovery.

  To verify that a keyring plugin is active, use the `SHOW PLUGINS` statement or query the Information Schema `PLUGINS` table. For example:

  ```sql
  mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
         FROM INFORMATION_SCHEMA.PLUGINS
         WHERE PLUGIN_NAME LIKE 'keyring%';
  +--------------+---------------+
  | PLUGIN_NAME  | PLUGIN_STATUS |
  +--------------+---------------+
  | keyring_file | ACTIVE        |
  +--------------+---------------+
  ```

* When encrypting production data, ensure that you take steps to prevent loss of the master encryption key. *If the master encryption key is lost, data stored in encrypted tablespace files is unrecoverable.* If you use the `keyring_file` or `keyring_encrypted_file` plugin, create a backup of the keyring data file immediately after creating the first encrypted tablespace, before master key rotation, and after master key rotation. The `keyring_file_data` configuration option defines the keyring data file location for the `keyring_file` plugin. The `keyring_encrypted_file_data` configuration option defines the keyring data file location for the `keyring_encrypted_file` plugin. If you use the `keyring_okv` or `keyring_aws` plugin, ensure that you have performed the necessary configuration. For instructions, see Section 6.4.4, “The MySQL Keyring”.

### Enabling File-Per-Table Tablespace Encryption

To enable encryption for a new file-per-table tablespace, specify the `ENCRYPTION` option in a `CREATE TABLE` statement. The following example assumes that `innodb_file_per_table` is enabled.

```sql
mysql> CREATE TABLE t1 (c1 INT) ENCRYPTION='Y';
```

To enable encryption for an existing file-per-table tablespace, specify the `ENCRYPTION` option in an `ALTER TABLE` statement.

```sql
mysql> ALTER TABLE t1 ENCRYPTION='Y';
```

To disable encryption for file-per-table tablespace, set `ENCRYPTION='N'` using `ALTER TABLE`.

```sql
mysql> ALTER TABLE t1 ENCRYPTION='N';
```

### Master Key Rotation

The master encryption key should be rotated periodically and whenever you suspect that the key has been compromised.

Master key rotation is an atomic, instance-level operation. Each time the master encryption key is rotated, all tablespace keys in the MySQL instance are re-encrypted and saved back to their respective tablespace headers. As an atomic operation, re-encryption must succeed for all tablespace keys once a rotation operation is initiated. If master key rotation is interrupted by a server failure, `InnoDB` rolls the operation forward on server restart. For more information, see Encryption and Recovery.

Rotating the master encryption key only changes the master encryption key and re-encrypts tablespace keys. It does not decrypt or re-encrypt associated tablespace data.

Rotating the master encryption key requires the `SUPER` privilege.

To rotate the master encryption key, run:

```sql
mysql> ALTER INSTANCE ROTATE INNODB MASTER KEY;
```

`ALTER INSTANCE ROTATE INNODB MASTER KEY` supports concurrent DML. However, it cannot be run concurrently with tablespace encryption operations, and locks are taken to prevent conflicts that could arise from concurrent execution. If an `ALTER INSTANCE ROTATE INNODB MASTER KEY` operation is running, it must finish before a tablespace encryption operation can proceed, and vice versa.

### Encryption and Recovery

If a server failure occurs during an encryption operation, the operation is rolled forward when the server is restarted.

If a server failure occurs during master key rotation, `InnoDB` continues the operation on server restart.

The keyring plugin must be loaded prior to storage engine initialization so that the information necessary to decrypt tablespace data pages can be retrieved from tablespace headers before `InnoDB` initialization and recovery activities access tablespace data. (See Encryption Prerequisites.)

When `InnoDB` initialization and recovery begin, the master key rotation operation resumes. Due to the server failure, some tablespace keys may already be encrypted using the new master encryption key. `InnoDB` reads the encryption data from each tablespace header, and if the data indicates that the tablespace key is encrypted using the old master encryption key, `InnoDB` retrieves the old key from the keyring and uses it to decrypt the tablespace key. `InnoDB` then re-encrypts the tablespace key using the new master encryption key and saves the re-encrypted tablespace key back to the tablespace header.

### Exporting Encrypted Tablespaces

When an encrypted tablespace is exported, `InnoDB` generates a *transfer key* that is used to encrypt the tablespace key. The encrypted tablespace key and transfer key are stored in a `tablespace_name.cfp` file. This file together with the encrypted tablespace file is required to perform an import operation. On import, `InnoDB` uses the transfer key to decrypt the tablespace key in the `tablespace_name.cfp` file. For related information, see Section 14.6.1.3, “Importing InnoDB Tables”.

### Encryption and Replication

* The `ALTER INSTANCE ROTATE INNODB MASTER KEY` statement is only supported in replication environments where the source and replicas run a version of MySQL that supports at-rest data encryption.

* Successful `ALTER INSTANCE ROTATE INNODB MASTER KEY` statements are written to the binary log for replication on replicas.

* If an `ALTER INSTANCE ROTATE INNODB MASTER KEY` statement fails, it is not logged to the binary log and is not replicated on replicas.

* Replication of an `ALTER INSTANCE ROTATE INNODB MASTER KEY` operation fails if the keyring plugin is installed on the source but not on the replica.

* If the `keyring_file` or `keyring_encrypted_file` plugin is installed on both the source and a replica but the replica does not have a keyring data file, the replicated `ALTER INSTANCE ROTATE INNODB MASTER KEY` statement creates the keyring data file on the replica, assuming the keyring file data is not cached in memory. `ALTER INSTANCE ROTATE INNODB MASTER KEY` uses keyring file data that is cached in memory, if available.

### Identifying Encrypted Tablespaces

When the `ENCRYPTION` option is specified in a `CREATE TABLE` or `ALTER TABLE` statement, it is recorded in the `CREATE_OPTIONS` column of the Information Schema `TABLES` table. This column can be queried to identify tables that reside in encrypted file-per-table tablespaces.

```sql
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, CREATE_OPTIONS FROM INFORMATION_SCHEMA.TABLES
       WHERE CREATE_OPTIONS LIKE '%ENCRYPTION%';
+--------------+------------+----------------+
| TABLE_SCHEMA | TABLE_NAME | CREATE_OPTIONS |
+--------------+------------+----------------+
| test         | t1         | ENCRYPTION="Y" |
+--------------+------------+----------------+
```

Query `INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES` to retrieve information about the tablespace associated with a particular schema and table.

```sql
mysql> SELECT SPACE, NAME, SPACE_TYPE FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE NAME='test/t1';
+-------+---------+------------+
| SPACE | NAME    | SPACE_TYPE |
+-------+---------+------------+
|     3 | test/t1 | Single     |
+-------+---------+------------+
```

### Encryption Usage Notes

* Plan appropriately when altering an existing tablespace with the `ENCRYPTION` option. The table is rebuilt using the `COPY` algorithm. The `INPLACE` algorithm is not supported.

* If the server exits or is stopped during normal operation, it is recommended to restart the server using the same encryption settings that were configured previously.

* The first master encryption key is generated when the first new or existing tablespace is encrypted.

* Master key rotation re-encrypts tablespaces keys but does not change the tablespace key itself. To change a tablespace key, you must disable and re-enable encryption, which is an `ALGORITHM=COPY` operation that rebuilds the table.

* If a table is created with both the `COMPRESSION` and `ENCRYPTION` options, compression is performed before tablespace data is encrypted.

* If a keyring data file (the file named by `keyring_file_data` or `keyring_encrypted_file_data`) is empty or missing, the first execution of `ALTER INSTANCE ROTATE INNODB MASTER KEY` creates a master encryption key.

* Uninstalling the `keyring_file` or `keyring_encrypted_file` plugin does not remove an existing keyring data file.

* It is recommended that you not place a keyring data file under the same directory as tablespace data files.

* Modifying the `keyring_file_data` or `keyring_encrypted_file_data` setting at runtime or when restarting the server can cause previously encrypted tablespaces to become inaccessible, resulting in lost data.

### Encryption Limitations

* Advanced Encryption Standard (AES) is the only supported encryption algorithm. `InnoDB` data-at-rest encryption uses Electronic Codebook (ECB) block encryption mode for tablespace key encryption and Cipher Block Chaining (CBC) block encryption mode for data encryption. Padding is not used with CBC block encryption mode. Instead, `InnoDB` ensures that the text to be encrypted is a multiple of the block size.

* Altering the `ENCRYPTION` attribute of a table is performed using the `COPY` algorithm. The `INPLACE` algorithm is not supported.

* Encryption is only supported for file-per-table tablespaces. Encryption is not supported for other tablespace types including general tablespaces and the system tablespace.

* You cannot move or copy a table from an encrypted file-per-table tablespace to a tablespace type that does not support encryption.

* Encryption only applies to data in the tablespace. Data is not encrypted in the redo log, undo log, or binary log.

* It is not permitted to change the storage engine of a table that resides in, or previously resided in, an encrypted tablespace.

* Encryption is not supported for the `InnoDB` `FULLTEXT` index tables that are created implicitly when adding a `FULLTEXT` index. For related information, see InnoDB Full-Text Index Tables.
