### 7.1.13 IPv6 Support

7.1.13.1 Verifying System Support for IPv6

7.1.13.2 Configuring the MySQL Server to Permit IPv6 Connections

7.1.13.3 Connecting Using the IPv6 Local Host Address

7.1.13.4 Connecting Using IPv6 Nonlocal Host Addresses

7.1.13.5 Obtaining an IPv6 Address from a Broker

Support for IPv6 in MySQL includes these capabilities:

* MySQL Server can accept TCP/IP connections from clients connecting over IPv6. For example, this command connects over IPv6 to the MySQL server on the local host:

  ```
  $> mysql -h ::1
  ```

  To use this capability, two things must be true:

  + Your system must be configured to support IPv6. See Section 7.1.13.1, “Verifying System Support for IPv6”.

  + The default MySQL server configuration permits IPv6 connections in addition to IPv4 connections. To change the default configuration, start the server with the `bind_address` system variable set to an appropriate value. See Section 7.1.8, “Server System Variables”.

* MySQL account names permit IPv6 addresses to enable DBAs to specify privileges for clients that connect to the server over IPv6. See Section 8.2.4, “Specifying Account Names”. IPv6 addresses can be specified in account names in statements such as `CREATE USER`, `GRANT`, and `REVOKE`. For example:

  ```
  mysql> CREATE USER 'bill'@'::1' IDENTIFIED BY 'secret';
  mysql> GRANT SELECT ON mydb.* TO 'bill'@'::1';
  ```

* IPv6 functions enable conversion between string and internal format IPv6 address formats, and checking whether values represent valid IPv6 addresses. For example, `INET6_ATON()` and `INET6_NTOA()` are similar to `INET_ATON()` and `INET_NTOA()`, but handle IPv6 addresses in addition to IPv4 addresses. See Section 14.24, “Miscellaneous Functions”.

* Group Replication group members can use IPv6 addresses for communications within the group. A group can contain a mix of members using IPv6 and members using IPv4. See Section 20.5.5, “Support For IPv6 And For Mixed IPv6 And IPv4 Groups”.

The following sections describe how to set up MySQL so that clients can connect to the server over IPv6.
