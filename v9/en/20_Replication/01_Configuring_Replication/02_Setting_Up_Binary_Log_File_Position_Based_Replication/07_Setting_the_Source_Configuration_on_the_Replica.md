#### 19.1.2.7 Setting the Source Configuration on the Replica

To set up the replica to communicate with the source for replication, configure the replica with the necessary connection information. To do this, on the replica, execute the following `CHANGE REPLICATION SOURCE TO` statement, replacing the option values with the actual values relevant to your system:

```
mysql> CHANGE REPLICATION SOURCE TO
    ->     SOURCE_HOST='source_host_name',
    ->     SOURCE_USER='replication_user_name',
    ->     SOURCE_PASSWORD='replication_password',
    ->     SOURCE_LOG_FILE='recorded_log_file_name',
    ->     SOURCE_LOG_POS=recorded_log_position;
```

Note

Replication cannot use Unix socket files. You must be able to connect to the source MySQL server using TCP/IP.

The `CHANGE REPLICATION SOURCE TO` statement has other options as well. For example, it is possible to set up secure replication using SSL. For a full list of options, and information about the maximum permissible length for the string-valued options, see Section 15.4.2.2, “CHANGE REPLICATION SOURCE TO Statement”.

Important

As noted in Section 19.1.2.3, “Creating a User for Replication”, if you are not using a secure connection and the user account named in the `SOURCE_USER` option authenticates with the `caching_sha2_password` plugin (the default in MySQL 9.5), you must specify the `SOURCE_PUBLIC_KEY_PATH` or `GET_SOURCE_PUBLIC_KEY` option in the `CHANGE REPLICATION SOURCE TO` statement to enable RSA key pair-based password exchange.
