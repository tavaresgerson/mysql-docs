### 17.20.4 Troubleshooting InnoDB Data Dictionary Operations

Information about table definitions is stored in the InnoDB data dictionary. If you move data files around, dictionary data can become inconsistent.

If a data dictionary corruption or consistency issue prevents you from starting `InnoDB`, see Section 17.20.3, “Forcing InnoDB Recovery” for information about manual recovery.

#### Cannot Open Datafile

With `innodb_file_per_table` enabled (the default), the following messages may appear at startup if a file-per-table tablespace file (`.ibd` file) is missing:

```
[ERROR] InnoDB: Operating system error number 2 in a file operation.
[ERROR] InnoDB: The error means the system cannot find the path specified.
[ERROR] InnoDB: Cannot open datafile for read-only: './test/t1.ibd' OS error: 71
[Warning] InnoDB: Ignoring tablespace `test/t1` because it could not be opened.
```

To address these messages, issue `DROP TABLE` statement to remove data about the missing table from the data dictionary.

#### Restoring Orphan File-Per-Table ibd Files

This procedure describes how to restore orphan file-per-table `.ibd` files to another MySQL instance. You might use this procedure if the system tablespace is lost or unrecoverable and you want to restore `.ibd` file backups on a new MySQL instance.

The procedure is not supported for general tablespace `.ibd` files.

The procedure assumes that you only have `.ibd` file backups, you are recovering to the same version of MySQL that initially created the orphan `.ibd` files, and that `.ibd` file backups are clean. See Section 17.6.1.4, “Moving or Copying InnoDB Tables” for information about creating clean backups.

Table import limitations outlined in Section 17.6.1.3, “Importing InnoDB Tables” are applicable to this procedure.

1. On the new MySQL instance, recreate the table in a database of the same name.

   ```
   mysql> CREATE DATABASE sakila;

   mysql> USE sakila;

   mysql> CREATE TABLE actor (
       ->     actor_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
       ->     first_name VARCHAR(45) NOT NULL,
       ->     last_name VARCHAR(45) NOT NULL,
       ->     last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       ->     PRIMARY KEY  (actor_id),
       ->     KEY idx_actor_last_name (last_name)
       -> )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
   ```

2. Discard the tablespace of the newly created table.

   ```
   mysql> ALTER TABLE sakila.actor DISCARD TABLESPACE;
   ```

3. Copy the orphan `.ibd` file from your backup directory to the new database directory.

   ```
   $> cp /backup_directory/actor.ibd path/to/mysql-5.7/data/sakila/
   ```

4. Ensure that the `.ibd` file has the necessary file permissions.

5. Import the orphan `.ibd` file. A warning is issued indicating that `InnoDB` is attempting to import the file without schema verification.

   ```
   mysql> ALTER TABLE sakila.actor IMPORT TABLESPACE; SHOW WARNINGS;
   Query OK, 0 rows affected, 1 warning (0.15 sec)

   Warning | 1810 | InnoDB: IO Read error: (2, No such file or directory)
   Error opening './sakila/actor.cfg', will attempt to import
   without schema verification
   ```

6. Query the table to verify that the `.ibd` file was successfully restored.

   ```
   mysql> SELECT COUNT(*) FROM sakila.actor;
   +----------+
   | count(*) |
   +----------+
   |      200 |
   +----------+
   ```
