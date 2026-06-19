## 17.6 Group Replication Security

This section explains how to secure a group, securing the connections between members of a group, or by establishing a security perimeter using IP address allowlisting.


### 17.6.1 Group Replication IP Address Allowlisting

The Group Replication plugin has a configuration option to determine from which hosts an incoming Group Communication System connection can be accepted. This option is called `group_replication_ip_whitelist`. If you set this option on a server s1, then when server s2 is establishing a connection to s1 for the purpose of engaging group communication, s1 first checks the allowlist before accepting the connection from s2. If s2 is in the allowlist, then s1 accepts the connection, otherwise s1 rejects the connection attempt by s2.

If you do not specify an allowlist explicitly, the group communication engine (XCom) automatically scans active interfaces on the host, and identifies those with addresses on private subnetworks. These addresses and the `localhost` IP address for IPv4 are used to create an automatic Group Replication allowlist. The automatic allowlist therefore includes any IP addresses found for the host in the following ranges:

```sql
10/8 prefix       (10.0.0.0 - 10.255.255.255) - Class A
172.16/12 prefix  (172.16.0.0 - 172.31.255.255) - Class B
192.168/16 prefix (192.168.0.0 - 192.168.255.255) - Class C
127.0.0.1 - localhost for IPv4
```

An entry is added to the error log stating the addresses that have been allowlisted automatically for the host.

The automatic allowlist of private addresses cannot be used for connections from servers outside the private network, so a server, even if it has interfaces on public IPs, does not by default allow Group Replication connections from external hosts. For Group Replication connections between server instances that are on different machines, you must provide public IP addresses and specify these as an explicit allowlist. If you specify any entries for the allowlist, the private and `localhost` addresses are not added automatically, so if you use any of these, you must specify them explicitly.

To specify an allowlist manually, use the `group_replication_ip_whitelist` option. You cannot change the allowlist on a server while it is an active member of a replication group. If the member is active, you must issue a `STOP GROUP_REPLICATION` statement before changing the allowlist, and a `START GROUP_REPLICATION` statement afterwards.

In the allowlist, you can specify any combination of the following:

* IPv4 addresses (for example, `198.51.100.44`)
* IPv4 addresses with CIDR notation (for example, `192.0.2.21/24`)

* Host names, from MySQL 5.7.21 (for example, `example.org`)

* Host names with CIDR notation, from MySQL 5.7.21 (for example, `www.example.com/24`)

IPv6 addresses, and host names that resolve to IPv6 addresses, are not supported in MySQL 5.7. You can use CIDR notation in combination with host names or IP addresses to allowlist a block of IP addresses with a particular network prefix, but do ensure that all the IP addresses in the specified subnet are under your control.

You must stop and restart Group Replication on a member in order to change its allowlist. A comma must separate each entry in the allowlist. For example:

```sql
mysql> STOP GROUP_REPLICATION;
mysql> SET GLOBAL group_replication_ip_whitelist="192.0.2.21/24,198.51.100.44,203.0.113.0/24,example.org,www.example.com/24";
mysql> START GROUP_REPLICATION;
```

The allowlist must contain the IP address or host name that is specified in each member's `group_replication_local_address` system variable. This address is not the same as the MySQL server SQL protocol host and port, and is not specified in the `bind_address` system variable for the server instance.

When a replication group is reconfigured (for example, when a new primary is elected or a member joins or leaves), the group members re-establish connections between themselves. If a group member is only allowlisted by servers that are no longer part of the replication group after the reconfiguration, it is unable to reconnect to the remaining servers in the replication group that do not allowlist it. To avoid this scenario entirely, specify the same allowlist for all servers that are members of the replication group.

Note

It is possible to configure different allowlists on different group members according to your security requirements, for example, in order to keep different subnets separate. If you need to configure different allowlists to meet your security requirements, ensure that there is sufficient overlap between the allowlists in the replication group to maximize the possibility of servers being able to reconnect in the absence of their original seed member.

For host names, name resolution takes place only when a connection request is made by another server. A host name that cannot be resolved is not considered for allowlist validation, and a warning message is written to the error log. Forward-confirmed reverse DNS (FCrDNS) verification is carried out for resolved host names.

Warning

Host names are inherently less secure than IP addresses in an allowlist. FCrDNS verification provides a good level of protection, but can be compromised by certain types of attack. Specify host names in your allowlist only when strictly necessary, and ensure that all components used for name resolution, such as DNS servers, are maintained under your control. You can also implement name resolution locally using the hosts file, to avoid the use of external components.


### 17.6.2 Group Replication Secure Socket Layer (SSL) Support

Group communication connections as well as recovery connections, are secured using SSL. The following sections explain how to configure connections.

#### Configuring SSL for Group Replication Recovery

Recovery is performed through a regular asynchronous replication connection. Once the donor is selected, the server joining the group establishes an asynchronous replication connection. This is all automatic.

However, a user that requires an SSL connection must have been created before the server joining the group connects to the donor. Typically, this is set up at the time one is provisioning a server to join the group.

```sql
donor> SET SQL_LOG_BIN=0;
donor> CREATE USER 'rec_ssl_user'@'%' REQUIRE SSL;
donor> GRANT replication slave ON *.* TO 'rec_ssl_user'@'%';
donor> SET SQL_LOG_BIN=1;
```

Assuming that all servers already in the group have a replication user set up to use SSL, you configure the server joining the group to use those credentials when connecting to the donor. That is done according to the values of the SSL options provided for the Group Replication plugin.

```sql
new_member> SET GLOBAL group_replication_recovery_use_ssl=1;
new_member> SET GLOBAL group_replication_recovery_ssl_ca= '.../cacert.pem';
new_member> SET GLOBAL group_replication_recovery_ssl_cert= '.../client-cert.pem';
new_member> SET GLOBAL group_replication_recovery_ssl_key= '.../client-key.pem';
```

And by configuring the recovery channel to use the credentials of the user that requires an SSL connection.

```sql
new_member> CHANGE MASTER TO MASTER_USER="rec_ssl_user" FOR CHANNEL "group_replication_recovery";
new_member> START GROUP_REPLICATION;
```

#### Configuring SSL for Group Communication

Secure sockets can be used to establish communication between members in a group. The configuration for this depends on the server's SSL configuration. As such, if the server has SSL configured, the Group Replication plugin also has SSL configured. For more information on the options for configuring the server SSL, see Command Options for Encrypted Connections. The options which configure Group Replication are shown in the following table.

**Table 17.2 SSL Options**

<table summary="Lists the server configuration options for SSL and describes their effect on the configuration of the Group Replication plugin for SSL."><col style="width: 43%"/><col style="width: 57%"/><thead><tr> <th><p> Server Configuration </p></th> <th><p> Plugin Configuration Description </p></th> </tr></thead><tbody><tr> <td><p> ssl_key </p></td> <td><p> Path of key file. To be used as client and server certificate. </p></td> </tr><tr> <td><p> ssl_cert </p></td> <td><p> Path of certificate file. To be used as client and server certificate. </p></td> </tr><tr> <td><p> ssl_ca </p></td> <td><p> Path of file with SSL Certificate Authorities that are trusted. </p></td> </tr><tr> <td><p> ssl_capath </p></td> <td><p> Path of directory containing certificates for SSL Certificate Authorities that are trusted. </p></td> </tr><tr> <td><p> ssl_crl </p></td> <td><p> Path of file containing the certificate revocation lists. </p></td> </tr><tr> <td><p> ssl_crlpath </p></td> <td><p> Path of directory containing revoked certificate lists. </p></td> </tr><tr> <td><p> ssl_cipher </p></td> <td><p> Permitted ciphers to use while encrypting data over the connection. </p></td> </tr><tr> <td><p> tls_version </p></td> <td><p> Secure communication uses this version and its protocols. </p></td> </tr></tbody></table>

These options are MySQL Server configuration options which Group Replication relies on for its configuration. In addition there is the following Group Replication specific option to configure SSL on the plugin itself.

* `group_replication_ssl_mode`
  - specifies the security state of the connection between Group Replication members.

**Table 17.3 group\_replication\_ssl\_mode configuration values**

<table summary="Lists the possible values for group_replication_ssl_mode and describes their effect on how replication group members connect to each other."><col style="width: 43%"/><col style="width: 57%"/><thead><tr> <th><p> Value </p></th> <th><p> Description </p></th> </tr></thead><tbody><tr> <td><p> <em>DISABLED</em> </p></td> <td><p> Establish an unencrypted connection (<em>default</em>). </p></td> </tr><tr> <td><p> REQUIRED </p></td> <td><p> Establish a secure connection if the server supports secure connections. </p></td> </tr><tr> <td><p> VERIFY_CA </p></td> <td><p> Like REQUIRED, but additionally verify the server TLS certificate against the configured Certificate Authority (CA) certificates. </p></td> </tr><tr> <td><p> VERIFY_IDENTITY </p></td> <td><p> Like VERIFY_CA, but additionally verify that the server certificate matches the host to which the connection is attempted. </p></td> </tr></tbody></table>

The following example shows an example my.cnf file section used to configure SSL on a server and how activate it for Group Replication.

```sql
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

The only plugin specific configuration option that is listed is `group_replication_ssl_mode`. This option activates the SSL communication between members of the group, by configuring the SSL framework with the `ssl_*` parameters that are provided to the server.


### 17.6.3 Group Replication and Virtual Private Networks (VPNs)

There is nothing preventing Group Replication from operating over a virtual private network. At its core, it just relies on an IPv4 socket to establish connections between servers for the purpose of propagating messages between them.
