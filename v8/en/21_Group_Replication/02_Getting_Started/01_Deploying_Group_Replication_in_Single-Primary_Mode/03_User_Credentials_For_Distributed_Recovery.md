#### 20.2.1.3 User Credentials For Distributed Recovery

Group Replication uses a distributed recovery process to synchronize group members when joining them to the group. Distributed recovery involves transferring transactions from a donor's binary log to a joining member using a replication channel named `group_replication_recovery`. You must therefore set up a replication user with the correct permissions so that Group Replication can establish direct member-to-member replication channels. If group members have been set up to support the use of a remote cloning operation as part of distributed recovery, which is available in MySQL 8.0.17 and later, this replication user is also used as the clone user on the donor, and requires the correct permissions for this role too. For a complete description of distributed recovery, see Section 20.5.4, “Distributed Recovery”.

The same replication user must be used for distributed recovery on every group member. The process of creating the replication user for distributed recovery can be captured in the binary log, and then you can rely on distributed recovery to replicate the statements used to create the user. Alternatively, you can disable binary logging before creating the replication user, and then create the user manually on each member, for example if you want to avoid the changes being propagated to other server instances. If you do this, ensure you re-enable binary logging once you have configured the user.

Important

If distributed recovery connections for your group use SSL, the replication user must be created on each server *before* the joining member connects to the donor. For instructions to set up SSL for distributed recovery connections and create a replication user that requires SSL, see Section 20.6.3, “Securing Distributed Recovery Connections”

Important

By default, users created in MySQL 8 use Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”. If the replication user for distributed recovery uses the caching SHA-2 authentication plugin, and you are *not* using SSL for distributed recovery connections, RSA key-pairs are used for password exchange. You can either copy the public key of the replication user to the joining member, or configure the donors to provide the public key when requested. For instructions to do this, see Section 20.6.3.1, “Secure User Credentials for Distributed Recovery”.

To create the replication user for distributed recovery, follow these steps:

1. Start the MySQL server instance, then connect a client to it.

2. If you want to disable binary logging in order to create the replication user separately on each instance, do so by issuing the following statement:

   ```
   mysql> SET SQL_LOG_BIN=0;
   ```

3. Create a MySQL user with the following privileges:

   * `REPLICATION SLAVE`, which is required for making a distributed recovery connection to a donor to retrieve data.

   * `CONNECTION_ADMIN`, which ensures that Group Replication connections are not terminated if one of the servers involved is placed in offline mode.

   * `BACKUP_ADMIN`, if the servers in the replication group are set up to support cloning (see Section 20.5.4.2, “Cloning for Distributed Recovery”). This privilege is required for a member to act as the donor in a cloning operation for distributed recovery.

   * `GROUP_REPLICATION_STREAM`, if the MySQL communication stack is in use for the replication group (see Section 20.6.1, “Communication Stack for Connection Security Management”). This privilege is required for the user account to be able to establish and maintain connections for Group Replication using the MySQL communication stack.

   In this example the user *`rpl_user`* with the password *`password`* is shown. When configuring your servers use a suitable user name and password:

   ```
   mysql> CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
   mysql> GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
   mysql> GRANT CONNECTION_ADMIN ON *.* TO rpl_user@'%';
   mysql> GRANT BACKUP_ADMIN ON *.* TO rpl_user@'%';
   mysql> GRANT GROUP_REPLICATION_STREAM ON *.* TO rpl_user@'%';
   mysql> FLUSH PRIVILEGES;
   ```

4. If you disabled binary logging, enable it again as soon as you have created the user, by issuing the following statement:

   ```
   mysql> SET SQL_LOG_BIN=1;
   ```

5. When you have created the replication user, you must supply the user credentials to the server for use with distributed recovery. You can do this by setting the user credentials as the credentials for the `group_replication_recovery` channel, using a `CHANGE REPLICATION SOURCE TO` statement (MySQL 8.0.23 or later) or `CHANGE MASTER TO` statement (prior to MySQL 8.0.23). Alternatively, in MySQL 8.0.21 and later, you can specify the user credentials for distributed recovery on the `START GROUP_REPLICATION` statement.

   * User credentials set using `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` are stored in plain text in the replication metadata repositories on the server. They are applied whenever Group Replication is started, including automatic starts if the `group_replication_start_on_boot` system variable is set to `ON`.

   * User credentials specified on `START GROUP_REPLICATION` are saved in memory only, and are removed by a `STOP GROUP_REPLICATION` statement or server shutdown. You must issue a `START GROUP_REPLICATION` statement to provide the credentials again, so you cannot start Group Replication automatically with these credentials. This method of specifying the user credentials helps to secure the Group Replication servers against unauthorized access.

   For more information on the security implications of each method of providing the user credentials, see Section 20.6.3.1.3, “Providing Replication User Credentials Securely”. If you choose to provide the user credentials using a `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` statement, issue the following statement on the server instance now, replacing *`rpl_user`* and *`password`* with the values used when creating the user:

   ```
   mysql> CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' \\
   		      FOR CHANNEL 'group_replication_recovery';
   ```

   Or in MySQL 8.0.23 or later:

   ```
   mysql> CHANGE REPLICATION SOURCE TO SOURCE_USER='rpl_user', SOURCE_PASSWORD='password' \\
   		      FOR CHANNEL 'group_replication_recovery';
   ```
