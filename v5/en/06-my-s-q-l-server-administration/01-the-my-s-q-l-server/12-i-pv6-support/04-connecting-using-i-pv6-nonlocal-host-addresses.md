#### 5.1.12.4 Connecting Using IPv6 Nonlocal Host Addresses

The following procedure shows how to configure MySQL to permit IPv6 connections by remote clients. It is similar to the preceding procedure for local clients, but the server and client hosts are distinct and each has its own nonlocal IPv6 address. The example uses these addresses:

```sql
Server host: 2001:db8:0:f101::1
Client host: 2001:db8:0:f101::2
```

These addresses are chosen from the nonroutable address range recommended by [IANA](http://www.iana.org/assignments/ipv6-unicast-address-assignments/ipv6-unicast-address-assignments.xml) for documentation purposes and suffice for testing on your local network. To accept IPv6 connections from clients outside the local network, the server host must have a public address. If your network provider assigns you an IPv6 address, you can use that. Otherwise, another way to obtain an address is to use an IPv6 broker; see [Section 5.1.12.5, “Obtaining an IPv6 Address from a Broker”](ipv6-brokers.html "5.1.12.5 Obtaining an IPv6 Address from a Broker").

1. Start the MySQL server with an appropriate [`bind_address`](server-system-variables.html#sysvar_bind_address) setting to permit it to accept IPv6 connections. For example, put the following lines in the server option file and restart the server:

   ```sql
   [mysqld]
   bind_address = *
   ```

   Alternatively, you can bind the server to `2001:db8:0:f101::1`, but that makes the server more restrictive for TCP/IP connections. It accepts only IPv6 connections for that single address and rejects IPv4 connections. For more information, see the [`bind_address`](server-system-variables.html#sysvar_bind_address) description in [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

2. On the server host (`2001:db8:0:f101::1`), create an account for a user who connects from the client host (`2001:db8:0:f101::2`):

   ```sql
   mysql> CREATE USER 'remoteipv6user'@'2001:db8:0:f101::2' IDENTIFIED BY 'remoteipv6pass';
   ```

3. On the client host (`2001:db8:0:f101::2`), invoke the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client to connect to the server using the new account:

   ```sql
   $> mysql -h 2001:db8:0:f101::1 -u remoteipv6user -premoteipv6pass
   ```

4. Try some simple statements that show connection information:

   ```sql
   mysql> STATUS
   ...
   Connection:   2001:db8:0:f101::1 via TCP/IP
   ...

   mysql> SELECT CURRENT_USER(), @@bind_address;
   +-----------------------------------+----------------+
   | CURRENT_USER()                    | @@bind_address |
   +-----------------------------------+----------------+
   | remoteipv6user@2001:db8:0:f101::2 | ::             |
   +-----------------------------------+----------------+
   ```
