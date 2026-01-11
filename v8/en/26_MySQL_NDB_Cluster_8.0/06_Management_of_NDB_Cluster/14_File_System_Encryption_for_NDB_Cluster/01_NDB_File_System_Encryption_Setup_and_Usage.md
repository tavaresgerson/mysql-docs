#### 25.6.14.1 NDB File System Encryption Setup and Usage

*Encryption of file system*: To enable encryption of a previously unencrypted file system, the following steps are required:

1. Set the required data node parameters in the `[ndbd default]` section of the `config.ini` file, as shown here:

   ```
   [ndbd default]
   EncryptedFileSystem= 1
   ```

   These parameters must be set as shown on all data nodes.

2. Start the management server with either `--initial` or `--reload` to cause it to read the updated configuration file.

3. Perform a rolling initial start (or restart) of all the data nodes (see Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”): Start each data node with `--initial`; in addition, supply either of the options `--filesystem-password` or `--filesystem-password-from-stdin`, plus a password, to each data node process. When you supply the password on the command line, a warning is shown, similar to this one:

   ```
   > ndbmtd -c 127.0.0.1 --filesystem-password=ndbsecret
   ndbmtd: [Warning] Using a password on the command line interface can be insecure.
   2022-08-22 16:17:58 [ndbd] INFO     -- Angel connected to '127.0.0.1:1186'
   2022-08-22 16:17:58 [ndbd] INFO     -- Angel allocated nodeid: 5
   ```

   `--filesystem-password` can accept the password form a file, `tty`, or `stdin`; `--filesystem-password-from-stdin` accepts the password from `stdin` only. The latter protects the password from exposure on the process command line or in the file system, and allows for the possibility of passing it from another secure application.

   You can also place the password in a `my.cnf` file that can be read by the data node process, but not by other users of the system. Using the same password as in the previous example, the relevant portion of the file should look like this:

   ```
   [ndbd]

   filesystem-password=ndbsecret
   ```

   You can also prompt the user starting the data node process to supply the encryption password when doing so, by using the `--filesystem-password-from-stdin` option in the `my.cnf` file instead, like this:

   ```
   [ndbd]

   filesystem-password-from-stdin
   ```

   In this case, the user is prompted for the password when starting the data node process, as shown here:

   ```
   > ndbmtd -c 127.0.0.1
   Enter filesystem password: *********
   2022-08-22 16:36:00 [ndbd] INFO     -- Angel connected to '127.0.0.1:1186'
   2022-08-22 16:36:00 [ndbd] INFO     -- Angel allocated nodeid: 5
   >
   ```

   Regardless of the method used, the format of the encryption password is the same as that used for passwords for encrypted backups (see Section 25.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”); the password must be supplied when starting each data node process; otherwise the data node process cannot start. This is indicated by the following message in the data node log:

   ```
   > tail -n2 ndb_5_out.log
   2022-08-22 16:08:30 [ndbd] INFO     -- Data node configured to have encryption but password not provided
   2022-08-22 16:08:31 [ndbd] ALERT    -- Node 5: Forced node shutdown completed. Occurred during startphase 0.
   ```

   When restarted as just described, each data node clears its on-disk state, and rebuilds it in encrypted form.

*Rotation of File system password*: To update the encryption password used by the data nodes, perform a rolling initial restart of the data nodes, supplying the new password to each data node when restarting it using `--filesystem-password` or `--filesystem-password-from-stdin`.

*Decryption of file system*: To remove encryption from an encrypted file system, do the following:

1. In the `[ndbd default]` section of the `config.ini` file, set `EncryptedFileSystem = OFF`.

2. Restart the management server with `--initial` or `--reload`.

3. Perform a rolling initial restart of the data nodes. Do *not* use any password-related options when restarting the node binaries.

   When restarted, each data node clears its on-disk state, and rebuilds it in unencrypted form.

To see whether file system encryption is properly configured, you can use a query against the `ndbinfo` `config_values` and `config_params` tables similar to this one:

```
mysql> SELECT v.node_id AS Node, p.param_name AS Parameter, v.config_value AS Value
    ->    FROM ndbinfo.config_values v
    ->  JOIN ndbinfo.config_params p
    ->    ON v.config_param=p.param_number
    ->  WHERE p.param_name='EncryptedFileSystem';
+------+----------------------+-------+
| Node | Parameter            | Value |
+------+----------------------+-------+
|    5 | EncryptedFileSystem  | 1     |
|    6 | EncryptedFileSystem  | 1     |
|    7 | EncryptedFileSystem  | 1     |
|    8 | EncryptedFileSystem  | 1     |
+------+----------------------+-------+
4 rows in set (0.10 sec)
```

Here, `EncryptedFileSystem` is equal to `1` on all data nodes, which means that filesystem encryption is enabled for this cluster.
