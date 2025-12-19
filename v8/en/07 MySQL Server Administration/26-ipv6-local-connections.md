#### 7.1.13.3 Connecting Using the IPv6 Local Host Address

The following procedure shows how to configure MySQL to permit IPv6 connections by clients that connect to the local server using the `::1` local host address. The instructions given here assume that your system supports IPv6.

1. Start the MySQL server with an appropriate `bind_address` setting to permit it to accept IPv6 connections. For example, put the following lines in the server option file and restart the server:

   ```
   [mysqld]
   bind_address = *
   ```

   Specifying \* (or `::`) as the value for `bind_address` permits both IPv4 and IPv6 connections on all server host IPv4 and IPv6 interfaces. If you want to bind the server to a specific list of addresses, you can do this by specifying a comma-separated list of values for `bind_address`. This example specifies the local host addresses for both IPv4 and IPv6:

   ```
   [mysqld]
   bind_address = 127.0.0.1,::1
   ```

   For more information, see the `bind_address` description in Section 7.1.8, “Server System Variables”.
2. As an administrator, connect to the server and create an account for a local user who can connect from the `::1` local IPv6 host address:

   ```
   mysql> CREATE USER 'ipv6user'@'::1' IDENTIFIED BY 'ipv6pass';
   ```

   For the permitted syntax of IPv6 addresses in account names, see  Section 8.2.4, “Specifying Account Names”. In addition to the `CREATE USER` statement, you can issue  `GRANT` statements that give specific privileges to the account, although that is not necessary for the remaining steps in this procedure.
3. Invoke the  **mysql** client to connect to the server using the new account:

   ```
   $> mysql -h ::1 -u ipv6user -pipv6pass
   ```
4. Try some simple statements that show connection information:

   ```
   mysql> STATUS
   ...
   Connection:   ::1 via TCP/IP
   ...

   mysql> SELECT CURRENT_USER(), @@bind_address;
   +----------------+----------------+
   | CURRENT_USER() | @@bind_address |
   +----------------+----------------+
   | ipv6user@::1   | ::             |
   +----------------+----------------+
   ```
