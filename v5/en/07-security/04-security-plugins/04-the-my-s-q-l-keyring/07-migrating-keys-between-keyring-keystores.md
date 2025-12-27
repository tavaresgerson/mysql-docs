#### 6.4.4.7 Migrating Keys Between Keyring Keystores

A keyring migration copies keys from one keystore to another, enabling a DBA to switch a MySQL installation to a different keystore. to another. A successful migration operation has this result:

* The destination keystore contains the keys it had prior to the migration, plus the keys from the source keystore.

* The source keystore remains the same before and after the migration (because keys are copied, not moved).

If a key to be copied already exists in the destination keystore, an error occurs and the destination keystore is restored to its premigration state.

The following sections discuss the characteristics of offline and online migrations and describe how to perform migrations.

* [Offline and Online Key Migrations](keyring-key-migration.html#keyring-key-migration-offline-online "Offline and Online Key Migrations")
* [Key Migration Using a Migration Server](keyring-key-migration.html#keyring-key-migration-using-migration-server "Key Migration Using a Migration Server")
* [Key Migration Involving Multiple Running Servers](keyring-key-migration.html#keyring-key-migration-multiple-running-servers "Key Migration Involving Multiple Running Servers")

##### Offline and Online Key Migrations

A key migration is either offline or online:

* Offline migration: For use when you are sure that no running server on the local host is using the source or destination keystore. In this case, the migration operation can copy keys from the source keystore to the destination without the possibility of a running server modifying keystore content during the operation.

* Online migration: For use when a running server on the local host is using the source or destination keystore. In this case, care must be taken to prevent that server from updating keystores during the migration. This involves connecting to the running server and instructing it to pause keyring operations so that keys can be copied safely from the source keystore to the destination. When key copying is complete, the running server is permitted to resume keyring operations.

When you plan a key migration, use these points to decide whether it should be offline or online:

* Do not perform offline migration involving a keystore that is in use by a running server.

* Pausing keyring operations during an online migration is accomplished by connecting to the running server and setting its global [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) system variable to `OFF` before key copying and `ON` after key copying. This has several implications:

  + [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) was introduced in MySQL 5.7.21, so online migration is possible only if the running server is from MySQL 5.7.21 or higher. If the running server is older, you must stop it, perform an offline migration, and restart it. All migration instructions elsewhere that refer to [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) are subject to this condition.

  + The account used to connect to the running server must have the [`SUPER`](privileges-provided.html#priv_super) privilege required to modify [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations).

  + For an online migration, the migration operation takes care of enabling and disabling [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) on the running server. If the migration operation exits abnormally (for example, if it is forcibly terminated), it is possible for [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) to remain disabled on the running server, leaving it unable to perform keyring operations. In this case, it may be necessary to connect to the running server and enable [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) manually using this statement:

    ```sql
    SET GLOBAL keyring_operations = ON;
    ```

* Online key migration provides for pausing keyring operations on a single running server. To perform a migration if multiple running servers are using the keystores involved, use the procedure described at [Key Migration Involving Multiple Running Servers](keyring-key-migration.html#keyring-key-migration-multiple-running-servers "Key Migration Involving Multiple Running Servers").

##### Key Migration Using a Migration Server

As of MySQL 5.7.21, a MySQL server becomes a migration server if invoked in a special operational mode that supports key migration. A migration server does not accept client connections. Instead, it runs only long enough to migrate keys, then exits. A migration server reports errors to the console (the standard error output).

To perform a key migration operation using a migration server, determine the key migration options required to specify which keyring plugins or components are involved, and whether the migration is offline or online:

* To indicate the source and destination keyring plugins, specify these options:

  + [`--keyring-migration-source`](keyring-options.html#option_mysqld_keyring-migration-source): The source keyring plugin that manages the keys to be migrated.

  + [`--keyring-migration-destination`](keyring-options.html#option_mysqld_keyring-migration-destination): The destination keyring plugin to which the migrated keys are to be copied.

  These options tell the server to run in key migration mode. For key migration operations, both options are mandatory. The source and destination plugins must differ, and the migration server must support both plugins.

* For an offline migration, no additional key migration options are needed.

* For an online migration, some running server currently is using the source or destination keystore. To invoke the migration server, specify additional key migration options that indicate how to connect to the running server. This is necessary so that the migration server can connect to the running server and tell it to pause keyring use during the migration operation.

  Use of any of the following options signifies an online migration:

  + [`--keyring-migration-host`](keyring-options.html#option_mysqld_keyring-migration-host): The host where the running server is located. This is always the local host because the migration server can migrate keys only between keystores managed by local plugins.

  + [`--keyring-migration-user`](keyring-options.html#option_mysqld_keyring-migration-user), [`--keyring-migration-password`](keyring-options.html#option_mysqld_keyring-migration-password): The account credentials to use to connect to the running server.

  + [`--keyring-migration-port`](keyring-options.html#option_mysqld_keyring-migration-port): For TCP/IP connections, the port number to connect to on the running server.

  + [`--keyring-migration-socket`](keyring-options.html#option_mysqld_keyring-migration-socket): For Unix socket file or Windows named pipe connections, the socket file or named pipe to connect to on the running server.

For additional details about the key migration options, see [Section 6.4.4.11, “Keyring Command Options”](keyring-options.html "6.4.4.11 Keyring Command Options").

Start the migration server with key migration options indicating the source and destination keystores and whether the migration is offline or online, possibly with other options. Keep the following considerations in mind:

* Other server options might be required, such as configuration parameters for the two keyring plugins. For example, if `keyring_file` is the source or destination, you must set the [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) system variable if the keyring data file location is not the default location. Other non-keyring options may be required as well. One way to specify these options is by using [`--defaults-file`](option-file-options.html#option_general_defaults-file) to name an option file that contains the required options.

* The migration server expects path name option values to be full paths. Relative path names may not be resolved as you expect.

* The user who invokes a server in key-migration mode must not be the `root` operating system user, unless the [`--user`](server-options.html#option_mysqld_user) option is specified with a non-`root` user name to run the server as that user.

* The user a server in key-migration mode runs as must have permission to read and write any local keyring files, such as the data file for a file-based plugin.

  If you invoke the migration server from a system account different from that normally used to run MySQL, it might create keyring directories or files that are inaccessible to the server during normal operation. Suppose that [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") normally runs as the `mysql` operating system user, but you invoke the migration server while logged in as `isabel`. Any new directories or files created by the migration server are owned by `isabel`. Subsequent startup fails when a server run as the `mysql` operating system user attempts to access file system objects owned by `isabel`.

  To avoid this issue, start the migration server as the `root` operating system user and provide a [`--user=user_name`](server-options.html#option_mysqld_user) option, where *`user_name`* is the system account normally used to run MySQL. Alternatively, after the migration, examine the keyring-related file system objects and change their ownership and permissions if necessary using **chown**, **chmod**, or similar commands, so that the objects are accessible to the running server.

Example command line for offline migration (enter the command on a single line):

```sql
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=keyring_encrypted_file.so
  --keyring_encrypted_file_password=password
```

Example command line for online migration:

```sql
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=keyring_encrypted_file.so
  --keyring_encrypted_file_password=password
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

The key migration server performs a migration operation as follows:

1. (Online migration only) Connect to the running server using the connection options.

2. (Online migration only) Disable [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) on the running server.

3. Load the source and destination keyring plugins.
4. Copy keys from the source keystore to the destination.
5. Unload the keyring plugins.
6. (Online migration only) Enable [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) on the running server.

7. (Online migration only) Disconnect from the running server.

If an error occurs during key migration, the destination keystore is restored to its premigration state.

Important

For an online migration operation, the migration server takes care of enabling and disabling [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) on the running server. If the migration server exits abnormally (for example, if it is forcibly terminated), it is possible for [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) to remain disabled on the running server, leaving it unable to perform keyring operations. In this case, it may be necessary to connect to the running server and enable [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) manually using this statement:

```sql
SET GLOBAL keyring_operations = ON;
```

After a successful online key migration operation, the running server might need to be restarted:

* If the running server was using the source keystore before the migration and should continue to use it after the migration, it need not be restarted after the migration.

* If the running server was using the destination keystore before the migration and should continue to use it after the migration, it should be restarted after the migration to load all keys migrated into the destination keystore.

* If the running server was using the source keystore before the migration but should use the destination keystore after the migration, it must be reconfigured to use the destination keystore and restarted. In this case, be aware that although the running server is paused from modifying the source keystore during the migration itself, it is not paused during the interval between the migration and the subsequent restart. Care should be taken that the server does not modify the source keystore during this interval because any such changes will not be reflected in the destination keystore.

##### Key Migration Involving Multiple Running Servers

Online key migration provides for pausing keyring operations on a single running server. To perform a migration if multiple running servers are using the keystores involved, use this procedure:

1. Connect to each running server manually and set [`keyring_operations=OFF`](keyring-system-variables.html#sysvar_keyring_operations). This ensures that no running server is using the source or destination keystore and satisfies the required condition for offline migration.

2. Use a migration server to perform an offline key migration for each paused server.

3. Connect to each running server manually and set [`keyring_operations=ON`](keyring-system-variables.html#sysvar_keyring_operations).

All running servers must support the [`keyring_operations`](keyring-system-variables.html#sysvar_keyring_operations) system variable. Any server that does not must be stopped before the migration and restarted after.
