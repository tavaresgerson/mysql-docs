### 5.1.12 IPv6 Support

[5.1.12.1 Verifying System Support for IPv6](ipv6-system-support.html)

[5.1.12.2 Configuring the MySQL Server to Permit IPv6 Connections](ipv6-server-config.html)

[5.1.12.3 Connecting Using the IPv6 Local Host Address](ipv6-local-connections.html)

[5.1.12.4 Connecting Using IPv6 Nonlocal Host Addresses](ipv6-remote-connections.html)

[5.1.12.5 Obtaining an IPv6 Address from a Broker](ipv6-brokers.html)

Support for IPv6 in MySQL includes these capabilities:

* MySQL Server can accept TCP/IP connections from clients connecting over IPv6. For example, this command connects over IPv6 to the MySQL server on the local host:

  ```sql
  $> mysql -h ::1
  ```

  To use this capability, two things must be true:

  + Your system must be configured to support IPv6. See [Section 5.1.12.1, “Verifying System Support for IPv6”](ipv6-system-support.html "5.1.12.1 Verifying System Support for IPv6").

  + The default MySQL server configuration permits IPv6 connections in addition to IPv4 connections. To change the default configuration, start the server with the [`bind_address`](server-system-variables.html#sysvar_bind_address) system variable set to an appropriate value. See [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

* MySQL account names permit IPv6 addresses to enable DBAs to specify privileges for clients that connect to the server over IPv6. See [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names"). IPv6 addresses can be specified in account names in statements such as [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), and [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"). For example:

  ```sql
  mysql> CREATE USER 'bill'@'::1' IDENTIFIED BY 'secret';
  mysql> GRANT SELECT ON mydb.* TO 'bill'@'::1';
  ```

* IPv6 functions enable conversion between string and internal format IPv6 address formats, and checking whether values represent valid IPv6 addresses. For example, [`INET6_ATON()`](miscellaneous-functions.html#function_inet6-aton) and [`INET6_NTOA()`](miscellaneous-functions.html#function_inet6-ntoa) are similar to [`INET_ATON()`](miscellaneous-functions.html#function_inet-aton) and [`INET_NTOA()`](miscellaneous-functions.html#function_inet-ntoa), but handle IPv6 addresses in addition to IPv4 addresses. See [Section 12.20, “Miscellaneous Functions”](miscellaneous-functions.html "12.20 Miscellaneous Functions").

The following sections describe how to set up MySQL so that clients can connect to the server over IPv6.
