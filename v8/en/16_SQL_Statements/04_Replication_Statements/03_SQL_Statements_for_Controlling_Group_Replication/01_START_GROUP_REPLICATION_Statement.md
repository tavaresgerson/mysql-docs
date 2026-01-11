#### 15.4.3.1 START GROUP_REPLICATION Statement

```
  START GROUP_REPLICATION
          [USER='user_name']
          [, PASSWORD='user_pass']
          [, DEFAULT_AUTH='plugin_name']
```

Starts group replication. This statement requires the `GROUP_REPLICATION_ADMIN` privilege (or the deprecated `SUPER` privilege). If `super_read_only=ON` is set and the member should join as a primary, `super_read_only` is set to `OFF` once Group Replication successfully starts.

A server that participates in a group in single-primary mode should use `skip_replica_start=ON`. Otherwise, the server is not allowed to join a group as a secondary.

In MySQL 8.0.21 and later, you can specify user credentials for distributed recovery on the `START GROUP_REPLICATION` statement using the `USER`, `PASSWORD`, and `DEFAULT_AUTH` options, as follows:

* `USER`: The replication user for distributed recovery. For instructions to set up this account, see Section 20.2.1.3, “User Credentials For Distributed Recovery”. You cannot specify an empty or null string, or omit the `USER` option if `PASSWORD` is specified.

* `PASSWORD`: The password for the replication user account. The password cannot be encrypted, but it is masked in the query log.

* `DEFAULT_AUTH`: The name of the authentication plugin used for the replication user account. If you do not specify this option, MySQL native authentication (the `mysql_native_password` plugin) is assumed. This option acts as a hint to the server, and the donor for distributed recovery overrides it if a different plugin is associated with the user account on that server. The authentication plugin used by default when you create user accounts in MySQL 8 is the caching SHA-2 authentication plugin (`caching_sha2_password`). See Section 8.2.17, “Pluggable Authentication” for more information on authentication plugins.

These credentials are used for distributed recovery on the `group_replication_recovery` channel. When you specify user credentials on `START GROUP_REPLICATION`, the credentials are saved in memory only, and are removed by a `STOP GROUP_REPLICATION` statement or server shutdown. You must issue a `START GROUP_REPLICATION` statement to provide the credentials again. This method is therefore not compatible with starting Group Replication automatically on server start, as specified by the `group_replication_start_on_boot` system variable.

User credentials specified on `START GROUP_REPLICATION` take precedence over any user credentials set for the `group_replication_recovery` channel using a `CHANGE REPLICATION SOURCE TO` statement (from MySQL 8.0.23) or `CHANGE MASTER TO` statement (before MySQL 8.0.23). Note that user credentials set using these statements are stored in the replication metadata repositories, and are used when `START GROUP_REPLICATION` is specified without user credentials, including automatic starts if the `group_replication_start_on_boot` system variable is set to `ON`. To gain the security benefits of specifying user credentials on `START GROUP_REPLICATION`, ensure that `group_replication_start_on_boot` is set to `OFF` (the default is `ON`), and clear any user credentials previously set for the `group_replication_recovery` channel, following the instructions in Section 20.6.3, “Securing Distributed Recovery Connections”.

While a member is rejoining a replication group, its status can be displayed as `OFFLINE` or `ERROR` before the group completes the compatibility checks and accepts it as a member. When the member is catching up with the group's transactions, its status is `RECOVERING`.
