#### B.3.2.6 Out of memory

If you issue a query using the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client program and receive an error like the following one, it means that [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") does not have enough memory to store the entire query result:

```sql
mysql: Out of memory at line 42, 'malloc.c'
mysql: needed 8136 byte (8k), memory in use: 12481367 bytes (12189k)
ERROR 2008: MySQL client ran out of memory
```

To remedy the problem, first check whether your query is correct. Is it reasonable that it should return so many rows? If not, correct the query and try again. Otherwise, you can invoke [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") with the [`--quick`](mysql-command-options.html#option_mysql_quick) option. This causes it to use the [`mysql_use_result()`](/doc/c-api/5.7/en/mysql-use-result.html) C API function to retrieve the result set, which places less of a load on the client (but more on the server).
