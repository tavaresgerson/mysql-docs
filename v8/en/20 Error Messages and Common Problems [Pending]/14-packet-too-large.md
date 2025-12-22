#### B.3.2.8 Packet Too Large

A communication packet is a single SQL statement sent to the MySQL server, a single row that is sent to the client, or a binary log event sent from a replication source server to a replica.

The largest possible packet that can be transmitted to or from a MySQL 8.4 server or client is 1GB.

When a MySQL client or the  `mysqld` server receives a packet bigger than  `max_allowed_packet` bytes, it issues an  `ER_NET_PACKET_TOO_LARGE` error and closes the connection. With some clients, you may also get a `Lost connection to MySQL server during query` error if the communication packet is too large.

Both the client and the server have their own  `max_allowed_packet` variable, so if you want to handle big packets, you must increase this variable both in the client and in the server.

If you are using the  `mysql` client program, its default  `max_allowed_packet` variable is 16MB. To set a larger value, start  `mysql` like this:

```
$> mysql --max_allowed_packet=32M
```

That sets the packet size to 32MB.

The server's default  `max_allowed_packet` value is 64MB. You can increase this if the server needs to handle big queries (for example, if you are working with big  `BLOB` columns). For example, to set the variable to 128MB, start the server like this:

```
$> mysqld --max_allowed_packet=128M
```

You can also use an option file to set  `max_allowed_packet`. For example, to set the size for the server to 128MB, add the following lines in an option file:

```
[mysqld]
max_allowed_packet=128M
```

It is safe to increase the value of this variable because the extra memory is allocated only when needed. For example,  `mysqld` allocates more memory only when you issue a long query or when  `mysqld` must return a large result row. The small default value of the variable is a precaution to catch incorrect packets between the client and server and also to ensure that you do not run out of memory by using large packets accidentally.

You can also get strange problems with large packets if you are using large  `BLOB` values but have not given  `mysqld` access to enough memory to handle the query. If you suspect this is the case, try adding **ulimit -d 256000** to the beginning of the  **mysqld\_safe** script and restarting  `mysqld`.


