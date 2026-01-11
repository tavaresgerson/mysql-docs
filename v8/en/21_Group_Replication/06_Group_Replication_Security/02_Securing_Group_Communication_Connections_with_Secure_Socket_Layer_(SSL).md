### 20.6.2 Securing Group Communication Connections with Secure Socket Layer (SSL)

Secure sockets can be used for group communication connections between members of a group.

The Group Replication system variable `group_replication_ssl_mode` is used to activate the use of SSL for group communication connections and specify the security mode for the connections. This value should be the same on all group members; if it differs, some members may not be able to join the group. The default setting means that SSL is not used. This variable has the following possible values:

**Table 20.1 group_replication_ssl_mode configuration values**

<table summary="Lists the possible values for group_replication_ssl_mode and describes their effect on how replication group members connect to each other."><thead><tr> <th>Value</th> <th><p> Description </p></th> </tr></thead><tbody><tr> <td><code>DISABLED</code></td> <td><p> Establish an unencrypted connection (the default). </p></td> </tr><tr> <td><code>REQUIRED</code></td> <td><p> Establish a secure connection if the server supports secure connections. </p></td> </tr><tr> <td><code>VERIFY_CA</code></td> <td><p> Like <code>REQUIRED</code>, but additionally verify the server TLS certificate against the configured Certificate Authority (CA) certificates. </p></td> </tr><tr> <td><code>VERIFY_IDENTITY</code></td> <td><p> Like <code>VERIFY_CA</code>, but additionally verify that the server certificate matches the host to which the connection is attempted. </p></td> </tr></tbody></table>

If SSL is used, the means for configuring the secure connection depends on whether the XCom or the MySQL communication stack is used for group communication (a choice between the two is available since MySQL 8.0.27).

**When using the XCom communication stack (`group_replication_communication_stack=XCOM`):** The remainder of the configuration for Group Replication's group communication connections is taken from the server's SSL configuration. For more information on the options for configuring the server SSL, see Command Options for Encrypted Connections. The server SSL options that are applied to Group Replication's group communication connections are as follows:

**Table 20.2 SSL Options**

<table summary="Lists the server configuration options for SSL and describes their effect on the configuration of the Group Replication plugin for SSL."><thead><tr> <th>Server Configuration</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>ssl_key</code></td> <td>The path name of the SSL private key file in PEM format. On the client side, this is the client private key. On the server side, this is the server private key.</td> </tr><tr> <td><code>ssl_cert</code></td> <td>The path name of the SSL public key certificate file in PEM format. On the client side, this is the client public key certificate. On the server side, this is the server public key certificate.</td> </tr><tr> <td><code>ssl_ca</code></td> <td>The path name of the Certificate Authority (CA) certificate file in PEM format.</td> </tr><tr> <td><code>ssl_capath</code></td> <td>The path name of the directory that contains trusted SSL certificate authority (CA) certificate files in PEM format.</td> </tr><tr> <td><code>ssl_crl</code></td> <td>The path name of the file containing certificate revocation lists in PEM format.</td> </tr><tr> <td><code>ssl_crlpath</code></td> <td>The path name of the directory that contains certificate revocation list files in PEM format.</td> </tr><tr> <td><code>ssl_cipher</code></td> <td>A list of permissible ciphers for encrypted connections.</td> </tr><tr> <td><code>tls_version</code></td> <td>A list of the TLS protocols the server permits for encrypted connections.</td> </tr><tr> <td><code>tls_ciphersuites</code></td> <td>Which TLSv1.3 ciphersuites the server permits for encrypted connections.</td> </tr></tbody></table>

Important

* Support for the TLSv1 and TLSv1.1 connection protocols is removed from MySQL Server as of MySQL 8.0.28. The protocols were deprecated from MySQL 8.0.26, though MySQL Server clients, including Group Replication server instances acting as a client, do not return warnings to the user if a deprecated TLS protocol version is used. See Removal of Support for the TLSv1 and TLSv1.1 Protocols for more information.

* Support for the TLSv1.3 protocol is available in MySQL Server as of MySQL 8.0.16, provided that MySQL Server was compiled using OpenSSL 1.1.1. The server checks the version of OpenSSL at startup, and if it is lower than 1.1.1, TLSv1.3 is removed from the default value for the server system variables relating to TLS versions (including the `group_replication_recovery_tls_version` system variable).

* Group Replication supports TLSv1.3 from MySQL 8.0.18. In MySQL 8.0.16 and MySQL 8.0.17, if the server supports TLSv1.3, the protocol is not supported in the group communication engine and cannot be used by Group Replication.

* In MySQL 8.0.18, TLSv1.3 can be used in Group Replication for the distributed recovery connection, but the `group_replication_recovery_tls_version` and `group_replication_recovery_tls_ciphersuites` system variables are not available. The donor servers must therefore permit the use of at least one TLSv1.3 ciphersuite that is enabled by default, as listed in Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”. From MySQL 8.0.19, you can use the options to configure client support for any selection of ciphersuites, including only non-default ciphersuites if you want.

* In the list of TLS protocols specified in the `tls_version` system variable, ensure the specified versions are contiguous (for example, `TLSv1.2,TLSv1.3`). If there are any gaps in the list of protocols (for example, if you specified `TLSv1,TLSv1.2`, omitting TLS 1.1) Group Replication might be unable to make group communication connections.

In a replication group, OpenSSL negotiates the use of the highest TLS protocol that is supported by all members. A joining member that is configured to use only TLSv1.3 (`tls_version=TLSv1.3`) cannot join a replication group where any existing member does not support TLSv1.3, because the group members in that case are using a lower TLS protocol version. To join the member to the group, you must configure the joining member to also permit the use of lower TLS protocol versions supported by the existing group members. Conversely, if a joining member does not support TLSv1.3, but the existing group members all do and are using that version for connections to each other, the member can join if the existing group members already permit the use of a suitable lower TLS protocol version, or if you configure them to do so. In that situation, OpenSSL uses a lower TLS protocol version for the connections from each member to the joining member. Each member's connections to other existing members continue to use the highest available protocol that both members support.

From MySQL 8.0.16, you can change the `tls_version` system variable at runtime to alter the list of permitted TLS protocol versions for the server. Note that for Group Replication, the `ALTER INSTANCE RELOAD TLS` statement, which reconfigures the server's TLS context from the current values of the system variables that define the context, does not change the TLS context for Group Replication's group communication connection while Group Replication is running. To apply the reconfiguration to these connections, you must execute `STOP GROUP_REPLICATION` followed by `START GROUP_REPLICATION` to restart Group Replication on the member or members where you changed the `tls_version` system variable. Similarly, if you want to make all members of a group change to using a higher or lower TLS protocol version, you must carry out a rolling restart of Group Replication on the members after changing the list of permitted TLS protocol versions, so that OpenSSL negotiates the use of the higher TLS protocol version when the rolling restart is completed. For instructions to change the list of permitted TLS protocol versions at runtime, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers” and Server-Side Runtime Configuration and Monitoring for Encrypted Connections.

The following example shows a section from a `my.cnf` file that configures SSL on a server, and activates SSL for Group Replication group communication connections:

```
[mysqld]
ssl_ca = "cacert.pem"
ssl_capath = "/.../ca_directory"
ssl_cert = "server-cert.pem"
ssl_cipher = "DHE-RSA-AEs256-SHA"
ssl_crl = "crl-server-revoked.crl"
ssl_crlpath = "/.../crl_directory"
ssl_key = "server-key.pem"
group_replication_ssl_mode= REQUIRED
```

Important

The `ALTER INSTANCE RELOAD TLS` statement, which reconfigures the server's TLS context from the current values of the system variables that define the context, does not change the TLS context for Group Replication's group communication connections while Group Replication is running. To apply the reconfiguration to these connections, you must execute `STOP GROUP_REPLICATION` followed by `START GROUP_REPLICATION` to restart Group Replication.

Connections made between a joining member and an existing member for distributed recovery are not covered by the options described above. These connections use Group Replication's dedicated distributed recovery SSL options, which are described in Section 20.6.3.2, “Secure Socket Layer (SSL) Connections for Distributed Recovery” Connections for Distributed Recovery").

**When using the MySQL communication stack (group_replication_communication_stack=MYSQL):** The security settings for distributed recovery of the group are applied to the normal communications between group members. See Section 20.6.3, “Securing Distributed Recovery Connections” on how to configure the security settings.
