### 5.8.2 Debugging a MySQL Client

To be able to debug a MySQL client with the integrated debug package, you should configure MySQL with [`-DWITH_DEBUG=1`](source-configuration-options.html#option_cmake_with_debug). See [Section 2.8.7, “MySQL Source-Configuration Options”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options").

Before running a client, you should set the `MYSQL_DEBUG` environment variable:

```sql
$> MYSQL_DEBUG=d:t:O,/tmp/client.trace
$> export MYSQL_DEBUG
```

This causes clients to generate a trace file in `/tmp/client.trace`.

If you have problems with your own client code, you should attempt to connect to the server and run your query using a client that is known to work. Do this by running [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") in debugging mode (assuming that you have compiled MySQL with debugging on):

```sql
$> mysql --debug=d:t:O,/tmp/client.trace
```

This provides useful information in case you mail a bug report. See [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems").

If your client crashes at some 'legal' looking code, you should check that your `mysql.h` include file matches your MySQL library file. A very common mistake is to use an old `mysql.h` file from an old MySQL installation with new MySQL library.
