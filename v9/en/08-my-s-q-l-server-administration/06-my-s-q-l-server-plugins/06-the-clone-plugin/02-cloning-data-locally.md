#### 7.6.6.2 Cloning Data Locally

The clone plugin supports the following syntax for cloning data locally; that is, cloning data from the local MySQL data directory to another directory on the same server or node where the MySQL server instance runs:

```
CLONE LOCAL DATA DIRECTORY [=] 'clone_dir';
```

To use `CLONE` syntax, the clone plugin must be installed. For installation instructions, see Section 7.6.6.1, “Installing the Clone Plugin”.

The `BACKUP_ADMIN` privilege is required to execute `CLONE LOCAL DATA DIRECTORY` statements.

```
mysql> GRANT BACKUP_ADMIN ON *.* TO 'clone_user';
```

where `clone_user` is the MySQL user that performs the cloning operation. The user you select to perform the cloning operation can be any MySQL user with the `BACKUP_ADMIN` privilege on \*.\*.

The following example demonstrates cloning data locally:

```
mysql> CLONE LOCAL DATA DIRECTORY = '/path/to/clone_dir';
```

where *`/path/to/clone_dir`* is the full path of the local directory that data is cloned to. An absolute path is required, and the specified directory (“*`clone_dir`*”) must not exist, but the specified path must be an existent path. The MySQL server must have the necessary write access to create the directory.

Note

A local cloning operation does not support cloning of user-created tables or tablespaces that reside outside of the data directory. Attempting to clone such tables or tablespaces causes the following error: ERROR 1086 (HY000): File '*`/path/to/tablespace_name.ibd`*' already exists. Cloning a tablespace with the same path as the source tablespace would cause a conflict and is therefore prohibited.

All other user-created `InnoDB` tables and tablespaces, the `InnoDB` system tablespace, redo logs, and undo tablespaces are cloned to the specified directory.

If desired, you can start the MySQL server on the cloned directory after the cloning operation is complete.

```
$> mysqld_safe --datadir=clone_dir
```

where *`clone_dir`* is the directory that data was cloned to.

For information about monitoring cloning operation status and progress, see Section 7.6.6.10, “Monitoring Cloning Operations”.
