#### 7.6.7.3 Cloning Remote Data

The clone plugin supports the following syntax for cloning remote data; that is, cloning data from a remote MySQL server instance (the donor) and transferring it to the MySQL instance where the cloning operation was initiated (the recipient).

```
CLONE INSTANCE FROM 'user'@'host':port
IDENTIFIED BY 'password'
[DATA DIRECTORY [=] 'clone_dir']
[REQUIRE [NO] SSL];
```

where:

* `user` is the clone user on the donor MySQL server instance.

* `password` is the `user` password.

* `host` is the `hostname` address of the donor MySQL server instance. Internet Protocol version 6 (IPv6) address format is not supported. An alias to the IPv6 address can be used instead. An IPv4 address can be used as is.

* `port` is the `port` number of the donor MySQL server instance. (The X Protocol port specified by `mysqlx_port` is not supported. Connecting to the donor MySQL server instance through MySQL Router is also not supported.)

* `DATA DIRECTORY [=] 'clone_dir'` is an optional clause used to specify a directory on the recipient for the data you are cloning. Use this option if you do not want to remove existing user-created data (schemas, tables, tablespaces) and binary logs from the recipient data directory. An absolute path is required, and the directory must not exist. The MySQL server must have the necessary write access to create the directory.

  When the optional `DATA DIRECTORY [=] 'clone_dir'` clause is not used, a cloning operation removes user-created data (schemas, tables, tablespaces) and binary logs from the recipient data directory, clones the new data to the recipient data directory, and automatically restarts the server afterward.

* `[REQUIRE [NO] SSL]` explicitly specifies whether an encrypted connection is to be used or not when transferring cloned data over the network. An error is returned if the explicit specification cannot be satisfied. If an SSL clause is not specified, clone attempts to establish an encrypted connection by default, falling back to an insecure connection if the secure connection attempt fails. A secure connection is required when cloning encrypted data regardless of whether this clause is specified. For more information, see Configuring an Encrypted Connection for Cloning.

Note

By default, user-created `InnoDB` tables and tablespaces that reside in the data directory on the donor MySQL server instance are cloned to the data directory on the recipient MySQL server instance. If the `DATA DIRECTORY [=] 'clone_dir'` clause is specified, they are cloned to the specified directory.

User-created `InnoDB` tables and tablespaces that reside outside of the data directory on the donor MySQL server instance are cloned to the same path on the recipient MySQL server instance. An error is reported if a table or tablespace already exists.

By default, the `InnoDB` system tablespace, redo logs, and undo tablespaces are cloned to the same locations that are configured on the donor (as defined by `innodb_data_home_dir` and `innodb_data_file_path`, `innodb_log_group_home_dir`, and `innodb_undo_directory`, respectively). If the `DATA DIRECTORY [=] 'clone_dir'` clause is specified, those tablespaces and logs are cloned to the specified directory.

##### Remote Cloning Prerequisites

To perform a cloning operation, the clone plugin must be active on both the donor and recipient MySQL server instances. For installation instructions, see Section 7.6.7.1, “Installing the Clone Plugin”.

A MySQL user on the donor and recipient is required for executing the cloning operation (the “clone user”).

* On the donor, the clone user requires the `BACKUP_ADMIN` privilege for accessing and transferring data from the donor and blocking concurrent DDL during the cloning operation. Concurrent DDL during the cloning operation is blocked on the donor prior to MySQL 8.0.27. From MySQL 8.0.27, concurrent DDL is permitted on the donor by default. See Section 7.6.7.4, “Cloning and Concurrent DDL”.

* On the recipient, the clone user requires the `CLONE_ADMIN` privilege for replacing recipient data, blocking DDL on the recipient during the cloning operation, and automatically restarting the server. The `CLONE_ADMIN` privilege includes `BACKUP_ADMIN` and `SHUTDOWN` privileges implicitly.

Instructions for creating the clone user and granting the required privileges are included in the remote cloning example that follows this prerequisite information.

The following prerequisites are checked when the `CLONE INSTANCE` statement is executed:

* The clone plugin is supported in MySQL 8.0.17 and higher. The donor and recipient must be the same MySQL server series, such as 8.0.37 and 8.0.41. They must also be the same point release for versions before 8.0.37.

  ```
  mysql> SHOW VARIABLES LIKE 'version';
   +---------------+--------+
  | Variable_name | Value  |
  +---------------+--------+
  | version       | 8.0.44 |
  +---------------+--------+
  ```

  Cloning from a donor MySQL server instance to a hotfix MySQL server instance of the same version and release is supported as of MySQL 8.0.26.

  Cloning from different point releases within a series is supported as of MySQL 8.0.37. Previous restrictions still apply to versions older than 8.0.37. For example, cloning 8.0.36 to 8.0.42 or vice-versa is not permitted.

* The donor and recipient MySQL server instances must run on the same operating system and platform. For example, if the donor instance runs on a Linux 64-bit platform, the recipient instance must also run on that platform. Refer to your operating system documentation for information about how to determine your operating system platform.

* The recipient must have enough disk space for the cloned data. By default, user-created data (schemas, tables, tablespaces) and binary logs are removed on the recipient prior to cloning the donor data, so you only require enough space for the donor data. If you clone to a named directory using the `DATA DIRECTORY` clause, you must have enough disk space for the existing recipient data and the cloned data. You can estimate the size of your data by checking the data directory size on your file system and the size of any tablespaces that reside outside of the data directory. When estimating data size on the donor, remember that only `InnoDB` data is cloned. If you store data in other storage engines, adjust your data size estimate accordingly.

* `InnoDB` permits creating some tablespace types outside of the data directory. If the donor MySQL server instance has tablespaces that reside outside of the data directory, the cloning operation must be able access those tablespaces. You can query the Information Schema `FILES` table to identify tablespaces that reside outside of the data directory. Files that reside outside of the data directory have a fully qualified path to a directory other than the data directory.

  ```
  mysql> SELECT FILE_NAME FROM INFORMATION_SCHEMA.FILES;
  ```

* Plugins that are active on the donor, including any keyring plugin, must also be active on the recipient. You can identify active plugins by issuing a `SHOW PLUGINS` statement or by querying the Information Schema `PLUGINS` table.

* The donor and recipient must have the same MySQL server character set and collation. For information about MySQL server character set and collation configuration, see Section 12.15, “Character Set Configuration”.

* The same `innodb_page_size` and `innodb_data_file_path` settings are required on the donor and recipient. The `innodb_data_file_path` setting on the donor and recipient must specify the same number of data files of an equivalent size. You can check variable settings using `SHOW VARIABLES` syntax.

  ```
  mysql> SHOW VARIABLES LIKE 'innodb_page_size';
  mysql> SHOW VARIABLES LIKE 'innodb_data_file_path';
  ```

* If cloning encrypted or page-compressed data, the donor and recipient must have the same file system block size. For page-compressed data, the recipient file system must support sparse files and hole punching for hole punching to occur on the recipient. For information about these features and how to identify tables and tablespaces that use them, see Section 7.6.7.5, “Cloning Encrypted Data”, and Section 7.6.7.6, “Cloning Compressed Data”. To determine your file system block size, refer to your operating system documentation.

* A secure connection is required if you are cloning encrypted data. See Configuring an Encrypted Connection for Cloning.

* The `clone_valid_donor_list` setting on the recipient must include the host address of the donor MySQL server instance. You can only clone data from a host on the valid donor list. A MySQL user with the `SYSTEM_VARIABLES_ADMIN` privilege is required to configure this variable. Instructions for setting the `clone_valid_donor_list` variable are provided in the remote cloning example that follows this section. You can check the `clone_valid_donor_list` setting using `SHOW VARIABLES` syntax.

  ```
  mysql> SHOW VARIABLES LIKE 'clone_valid_donor_list';
  ```

* There must be no other cloning operation running. Only a single cloning operation is permitted at a time. To determine if a clone operation is running, query the `clone_status` table. See Monitoring Cloning Operations using Performance Schema Clone Tables.

* The clone plugin transfers data in 1MB packets plus metadata. The minimum required `max_allowed_packet` value is therefore 2MB on the donor and the recipient MySQL server instances. A `max_allowed_packet` value less than 2MB results in an error. Use the following query to check your `max_allowed_packet` setting:

  ```
  mysql> SHOW VARIABLES LIKE 'max_allowed_packet';
  ```

The following prerequisites also apply:

* Undo tablespace file names on the donor must be unique. When data is cloned to the recipient, undo tablespaces, regardless of their location on the donor, are cloned to the `innodb_undo_directory` location on the recipient or to the directory specified by the `DATA DIRECTORY [=] 'clone_dir'` clause, if used. Duplicate undo tablespace file names on the donor are not permitted for this reason. As of MySQL 8.0.18, an error is reported if duplicate undo tablespace file names are encountered during a cloning operation. Prior to MySQL 8.0.18, cloning undo tablespaces with the same file name could result in undo tablespace files being overwritten on the recipient.

  To view undo tablespace file names on the donor to ensure that they are unique, query `INFORMATION_SCHEMA.FILES`:

  ```
  mysql> SELECT TABLESPACE_NAME, FILE_NAME FROM INFORMATION_SCHEMA.FILES
         WHERE FILE_TYPE LIKE 'UNDO LOG';
  ```

  For information about dropping and adding undo tablespace files, see Section 17.6.3.4, “Undo Tablespaces”.

* By default, the recipient MySQL server instance is restarted (stopped and started) automatically after the data is cloned. For an automatic restart to occur, a monitoring process must be available on the recipient to detect server shutdowns. Otherwise, the cloning operation halts with the following error after the data is cloned, and the recipient MySQL server instance is shut down:

  ```
  ERROR 3707 (HY000): Restart server failed (mysqld is not managed by supervisor process).
  ```

  This error does not indicate a cloning failure. It means that the recipient MySQL server instance must be started again manually after the data is cloned. After starting the server manually, you can connect to the recipient MySQL server instance and check the Performance Schema clone tables to verify that the cloning operation completed successfully (see Monitoring Cloning Operations using Performance Schema Clone Tables.) The `RESTART` statement has the same monitoring process requirement. For more information, see Section 15.7.8.8, “RESTART Statement”. This requirement is not applicable if cloning to a named directory using the `DATA DIRECTORY` clause, as an automatic restart is not performed in this case.

* Several variables control various aspects of a remote cloning operation. Before performing a remote cloning operation, review the variables and adjust settings as necessary to suit your computing environment. Clone variables are set on recipient MySQL server instance where the cloning operation is executed. See Section 7.6.7.13, “Clone System Variables”.

##### Cloning Remote Data

The following example demonstrates cloning remote data. By default, a remote cloning operation removes user-created data (schemas, tables, tablespaces) and binary logs on the recipient, clones the new data to the recipient data directory, and restarts the MySQL server afterward.

The example assumes that remote cloning prerequisites are met. See Remote Cloning Prerequisites.

1. Login to the donor MySQL server instance with an administrative user account.

   1. Create a clone user with the `BACKUP_ADMIN` privilege.

      ```
      mysql> CREATE USER 'donor_clone_user'@'example.donor.host.com' IDENTIFIED BY 'password';
      mysql> GRANT BACKUP_ADMIN on *.* to 'donor_clone_user'@'example.donor.host.com';
      ```

   2. Install the clone plugin:

      ```
      mysql> INSTALL PLUGIN clone SONAME 'mysql_clone.so';
      ```

2. Login to the recipient MySQL server instance with an administrative user account.

   1. Create a clone user with the `CLONE_ADMIN` privilege.

      ```
      mysql> CREATE USER 'recipient_clone_user'@'example.recipient.host.com' IDENTIFIED BY 'password';
      mysql> GRANT CLONE_ADMIN on *.* to 'recipient_clone_user'@'example.recipient.host.com';
      ```

   2. Install the clone plugin:

      ```
      mysql> INSTALL PLUGIN clone SONAME 'mysql_clone.so';
      ```

   3. Add the host address of the donor MySQL server instance to the `clone_valid_donor_list` variable setting.

      ```
      mysql> SET GLOBAL clone_valid_donor_list = 'example.donor.host.com:3306';
      ```

3. Log on to the recipient MySQL server instance as the clone user you created previously (`recipient_clone_user'@'example.recipient.host.com`) and execute the `CLONE INSTANCE` statement.

   ```
   mysql> CLONE INSTANCE FROM 'donor_clone_user'@'example.donor.host.com':3306
          IDENTIFIED BY 'password';
   ```

   After the data is cloned, the MySQL server instance on the recipient is restarted automatically.

   For information about monitoring cloning operation status and progress, see Section 7.6.7.10, “Monitoring Cloning Operations”.

##### Cloning to a Named Directory

By default, a remote cloning operation removes user-created data (schemas, tables, tablespaces) and binary logs from the recipient data directory before cloning data from the donor MySQL Server instance. By cloning to a named directory, you can avoid removing data from the current recipient data directory.

The procedure for cloning to a named directory is the same procedure described in Cloning Remote Data with one exception: The `CLONE INSTANCE` statement must include the `DATA DIRECTORY` clause. For example:

```
mysql> CLONE INSTANCE FROM 'user'@'example.donor.host.com':3306
       IDENTIFIED BY 'password'
       DATA DIRECTORY = '/path/to/clone_dir';
```

An absolute path is required, and the directory must not exist. The MySQL server must have the necessary write access to create the directory.

When cloning to a named directory, the recipient MySQL server instance is not restarted automatically after the data is cloned. If you want to restart the MySQL server on the named directory, you must do so manually:

```
$> mysqld_safe --datadir=/path/to/clone_dir
```

where *`/path/to/clone_dir`* is the path to the named directory on the recipient.

##### Configuring an Encrypted Connection for Cloning

You can configure an encrypted connection for remote cloning operations to protect data as it is cloned over the network. An encrypted connection is required by default when cloning encrypted data. (see Section 7.6.7.5, “Cloning Encrypted Data”.)

The instructions that follow describe how to configure the recipient MySQL server instance to use an encrypted connection. It is assumed that the donor MySQL server instance is already configured to use encrypted connections. If not, refer to Section 8.3.1, “Configuring MySQL to Use Encrypted Connections” for server-side configuration instructions.

To configure the recipient MySQL server instance to use an encrypted connection:

1. Make the client certificate and key files of the donor MySQL server instance available to the recipient host. Either distribute the files to the recipient host using a secure channel or place them on a mounted partition that is accessible to the recipient host. The client certificate and key files to make available include:

   * `ca.pem`

     The self-signed certificate authority (CA) file.

   * `client-cert.pem`

     The client public key certificate file.

   * `client-key.pem`

     The client private key file.

2. Configure the following SSL options on the recipient MySQL server instance.

   * `clone_ssl_ca`

     Specifies the path to the self-signed certificate authority (CA) file.

   * `clone_ssl_cert`

     Specifies the path to the client public key certificate file.

   * `clone_ssl_key`

     Specifies the path to the client private key file.

   For example:

   ```
   clone_ssl_ca=/path/to/ca.pem
   clone_ssl_cert=/path/to/client-cert.pem
   clone_ssl_key=/path/to/client-key.pem
   ```

3. To require that an encrypted connection is used, include the `REQUIRE SSL` clause when issuing the `CLONE` statement on the recipient.

   ```
   mysql> CLONE INSTANCE FROM 'user'@'example.donor.host.com':3306
          IDENTIFIED BY 'password'
          DATA DIRECTORY = '/path/to/clone_dir'
          REQUIRE SSL;
   ```

   If an SSL clause is not specified, the clone plugin attempts to establish an encrypted connection by default, falling back to an unencrypted connection if the encrypted connection attempt fails.

   Note

   If you are cloning encrypted data, an encrypted connection is required by default regardless of whether the `REQUIRE SSL` clause is specified. Using `REQUIRE NO SSL` causes an error if you attempt to clone encrypted data.
