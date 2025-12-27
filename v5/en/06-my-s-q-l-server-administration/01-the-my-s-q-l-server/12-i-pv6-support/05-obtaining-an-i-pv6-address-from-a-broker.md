#### 5.1.12.5 Obtaining an IPv6 Address from a Broker

If you do not have a public IPv6 address that enables your system to communicate over IPv6 outside your local network, you can obtain one from an IPv6 broker. The [Wikipedia IPv6 Tunnel Broker page](http://en.wikipedia.org/wiki/List_of_IPv6_tunnel_brokers) lists several brokers and their features, such as whether they provide static addresses and the supported routing protocols.

After configuring your server host to use a broker-supplied IPv6 address, start the MySQL server with an appropriate [`bind_address`](server-system-variables.html#sysvar_bind_address) setting to permit the server to accept IPv6 connections. For example, put the following lines in the server option file and restart the server:

```sql
[mysqld]
bind_address = *
```

Alternatively, you can bind the server to the specific IPv6 address provided by the broker, but that makes the server more restrictive for TCP/IP connections. It accepts only IPv6 connections for that single address and rejects IPv4 connections. For more information, see the [`bind_address`](server-system-variables.html#sysvar_bind_address) description in [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"). In addition, if the broker allocates dynamic addresses, the address provided for your system might change the next time you connect to the broker. If so, any accounts you create that name the original address become invalid. To bind to a specific address but avoid this change-of-address problem, you may be able to arrange with the broker for a static IPv6 address.

The following example shows how to use Freenet6 as the broker and the **gogoc** IPv6 client package on Gentoo Linux.

1. Create an account at Freenet6 by visiting this URL and signing up:

   ```sql
   http://gogonet.gogo6.com
   ```

2. After creating the account, go to this URL, sign in, and create a user ID and password for the IPv6 broker:

   ```sql
   http://gogonet.gogo6.com/page/freenet6-registration
   ```

3. As `root`, install **gogoc**:

   ```sql
   $> emerge gogoc
   ```

4. Edit `/etc/gogoc/gogoc.conf` to set the `userid` and `password` values. For example:

   ```sql
   userid=gogouser
   passwd=gogopass
   ```

5. Start **gogoc**:

   ```sql
   $> /etc/init.d/gogoc start
   ```

   To start **gogoc** each time your system boots, execute this command:

   ```sql
   $> rc-update add gogoc default
   ```

6. Use **ping6** to try to ping a host:

   ```sql
   $> ping6 ipv6.google.com
   ```

7. To see your IPv6 address:

   ```sql
   $> ifconfig tun
   ```
