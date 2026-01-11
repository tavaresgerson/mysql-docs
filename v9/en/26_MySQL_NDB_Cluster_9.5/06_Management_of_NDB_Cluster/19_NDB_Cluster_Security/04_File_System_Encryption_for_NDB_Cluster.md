#### 25.6.19.4 File System Encryption for NDB Cluster

The following sections provide information about `NDB` data node file system encryption.

##### 25.6.19.4.1 NDB File System Encryption Setup and Usage

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

##### 25.6.19.4.2 NDB File System Encryption Implementation

For `NDB` Transparent Data Encryption (TDE), data nodes encrypt user data at rest, with security provided by a password (file system password), which is used to encrypt and decrypt a secrets file on each data node. The secrets file contains a Node Master Key (NMK), a key used later to encrypt the different file types used for persistence. `NDB` TDE encrypts user data files including LCP files, redo log files, tablespace files, and undo log files.

You can use the **ndbxfrm** utility to see whether a file is encrypted, as shown here:

```
> ndbxfrm -i ndb_5_fs/LCP/0/T2F0.Data
File=ndb_5_fs/LCP/0/T2F0.Data, compression=no, encryption=yes
> ndbxfrm -i ndb_6_fs/LCP/0/T2F0.Data
File=ndb_6_fs/LCP/0/T2F0.Data, compression=no, encryption=no
```

It is possible to obtain the key from the secrets file using the **ndb\_secretsfile\_reader** program, like this:

```
> ndb_secretsfile_reader --filesystem-password=54kl14 ndb_5_fs/D1/NDBCNTR/S0.sysfile
ndb_secretsfile_reader: [Warning] Using a password on the command line interface can be insecure.
cac256e18b2ddf6b5ef82d99a72f18e864b78453cc7fa40bfaf0c40b91122d18
```

The per-node key hierarchy can be represented as follows:

* A user-supplied passphrase (P) is processed by a key-derivation function using a random salt to generate a unique passphase key (PK).

* The PK (unique to each node) encrypts the data on each node in its own secrets file.

* The data in the secrets file includes a unique, randomly generated Node Master Key (NMK).

* The NMK encrypts (using wrapping) one or more randomly generated data encryption key (DEK) values in the header of each encrypted file (including LCP and TS files, and redo and undo logs).

* Data encryption key values (DEK0, ..., DEKn) are used for encryption of [subsets of] data in each file.

The passphrase indirectly encrypts the secrets file containing the random NMK, which encrypts a portion of the header of each encrypted file on the node. The encrypted file header contains random data keys used for the data in that file.

Encryption is implemented transparently by the `NDBFS` layer within the data nodes. `NDBFS` internal client blocks operate on their files as normal; `NDBFS` wraps the physical file with extra header and footer information supporting encryption, and encrypts and decrypts data as it is read from and written to the file. The wrapped file format is referred to as `ndbxfrm1`.

The node password is processed with PBKDF2 and the random salt to encrypt the secrets file, which contains the randomly generated NMK which is used to encrypt the randomly generated data encryption key in each encrypted file.

The work of encryption and decryption is performed in the NDBFS I/O threads (rather than in signal execution threads such as main, tc, ldm, or rep). This is similar to what happens with compressed LCPs and compressed backups, and normally results in increased I/O thread CPU usage; you may wish to adjust `ThreadConfig` (if in use) with regard to the I/O threads.

##### 25.6.19.4.3 NDB File System Encryption Limitations

Transparent data encryption in NDB Cluster is subject to the following restrictions and limitations:

* The file system password must be supplied to each individual data node.

* File system password rotation requires an initial rolling restart of the data nodes; this must be performed manually, or by an application external to `NDB`).

* For a cluster with only a single replica (`NoOfReplicas = 1`), a full backup and restore is required for file system password rotation.

* Rotation of all data encryption keys requires an initial node restart.

**NDB TDE and NDB Replication.** The use of an encrypted filesystem does not have any effect on NDB Replication. All of the following scenarios are supported:

* Replication of an NDB Cluster having an encrypted file system to an NDB Cluster whose file system is not encrypted.

* Replication of an NDB Cluster whose file system is not encrypted to an NDB Cluster whose file system is encrypted.

* Replication of an NDB Cluster whose file system is encrypted to a standalone MySQL server using `InnoDB` tables which are not encrypted.

* Replication of an NDB Cluster with an unencrypted file system to a standalone MySQL server using `InnoDB` tables with file sytem encryption.
