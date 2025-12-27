#### 5.1.12.3 Connecting Using the IPv6 Local Host Address

The following procedure shows how to configure MySQL to permit IPv6 connections by clients that connect to the local server using the `::1` local host address. The instructions given here assume that your system supports IPv6.

1. Start the MySQL server with an appropriate [`bind_address`](server-system-variables.html#sysvar_bind_address) setting to permit it to accept IPv6 connections. For example, put the following lines in the server option file and restart the server:

   ```sql
   [mysqld]
   bind_address = *
   ```

   Alternatively, you can bind the server to `::1`, but that makes the server more restrictive for TCP/IP connections. It accepts only IPv6 connections for that single address and rejects IPv4 connections. For more information, see the [`bind_address`](server-system-variables.html#sysvar_bind_address) description in [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

2. As an administrator, connect to the server and create an account for a local user who connects from the `::1` local IPv6 host address:

   ```sql
   mysql> CREATE USER 'ipv6user'@'::1' IDENTIFIED BY 'ipv6pass';
   ```

   For the permitted syntax of IPv6 addresses in account names, see [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names"). In addition to the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement, you can issue [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statements that give specific privileges to the account, although that is not necessary for the remaining steps in this procedure.

3. Invoke the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client to connect to the server using the new account:

   ```sql
   $> mysql -h ::1 -u ipv6user -pipv6pass
   ```

4. Try some simple statements that show connection information:

   ```sql
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
