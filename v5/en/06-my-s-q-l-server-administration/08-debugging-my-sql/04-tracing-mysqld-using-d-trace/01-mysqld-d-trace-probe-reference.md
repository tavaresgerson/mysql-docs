#### 5.8.4.1 mysqld DTrace Probe Reference

MySQL supports the following static probes, organized into groups of functionality.

**Table 5.5 MySQL DTrace Probes**

<table><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Group</th> <th>Probes</th> </tr></thead><tbody><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-connection" title="5.8.4.1.1 Connection Probes">Connection</a></td> <td><code>connection-start</code>, <code>connection-done</code></td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-command" title="5.8.4.1.2 Command Probes">Command</a></td> <td><code>command-start</code>, <code>command-done</code></td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-query" title="5.8.4.1.3 Query Probes">Query</a></td> <td><code>query-start</code>, <code>query-done</code></td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-query-parsing" title="5.8.4.1.4 Query Parsing Probes">Query Parsing</a></td> <td><code>query-parse-start</code>, <code>query-parse-done</code></td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-querycache" title="5.8.4.1.5 Query Cache Probes">Query Cache</a></td> <td><code>query-cache-hit</code>, <code>query-cache-miss</code></td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-queryexec" title="5.8.4.1.6 Query Execution Probes">Query Execution</a></td> <td><code>query-exec-start</code>, <code>query-exec-done</code></td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-rowlevel" title="5.8.4.1.7 Row-Level Probes">Row Level</a></td> <td><code>insert-row-start</code>, <code>insert-row-done</code></td> </tr><tr> <td></td> <td><code>update-row-start</code>, <code>update-row-done</code></td> </tr><tr> <td></td> <td><code>delete-row-start</code>, <code>delete-row-done</code></td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-readrow" title="5.8.4.1.8 Read Row Probes">Row Reads</a></td> <td><code>read-row-start</code>, <code>read-row-done</code></td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-index" title="5.8.4.1.9 Index Probes">Index Reads</a></td> <td><code>index-read-row-start</code>, <code>index-read-row-done</code></td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-lock" title="5.8.4.1.10 Lock Probes">Lock</a></td> <td><code>handler-rdlock-start</code>, <code>handler-rdlock-done</code></td> </tr><tr> <td></td> <td><code>handler-wrlock-start</code>, <code>handler-wrlock-done</code></td> </tr><tr> <td></td> <td><code>handler-unlock-start</code>, <code>handler-unlock-done</code></td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-filesort" title="5.8.4.1.11 Filesort Probes">Filesort</a></td> <td><code>filesort-start</code>, <code>filesort-done</code></td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-statement" title="5.8.4.1.12 Statement Probes">Statement</a></td> <td><code>select-start</code>, <code>select-done</code></td> </tr><tr> <td></td> <td><code>insert-start</code>, <code>insert-done</code></td> </tr><tr> <td></td> <td><code>insert-select-start</code>, <code>insert-select-done</code></td> </tr><tr> <td></td> <td><code>update-start</code>, <code>update-done</code></td> </tr><tr> <td></td> <td><code>multi-update-start</code>, <code>multi-update-done</code></td> </tr><tr> <td></td> <td><code>delete-start</code>, <code>delete-done</code></td> </tr><tr> <td></td> <td><code>multi-delete-start</code>, <code>multi-delete-done</code></td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-network" title="5.8.4.1.13 Network Probes">Network</a></td> <td><code>net-read-start</code>, <code>net-read-done</code>, <code>net-write-start</code>, <code>net-write-done</code></td> </tr><tr> <td><a class="link" href="dba-dtrace-mysqld-ref.html#dba-dtrace-ref-keycache" title="5.8.4.1.14 Keycache Probes">Keycache</a></td> <td><code>keycache-read-start</code>, <code>keycache-read-block</code>, <code>keycache-read-done</code>, <code>keycache-read-hit</code>, <code>keycache-read-miss</code>, <code>keycache-write-start</code>, <code>keycache-write-block</code>, <code>keycache-write-done</code></td> </tr></tbody></table>

Note

When extracting the argument data from the probes, each argument is available as `argN`, starting with `arg0`. To identify each argument within the definitions they are provided with a descriptive name, but you must access the information using the corresponding `argN` parameter.

##### 5.8.4.1.1 Connection Probes

The `connection-start` and `connection-done` probes enclose a connection from a client, regardless of whether the connection is through a socket or network connection.

```sql
connection-start(connectionid, user, host)
connection-done(status, connectionid)
```

* `connection-start`: Triggered after a connection and successful login/authentication have been completed by a client. The arguments contain the connection information:

  + `connectionid`: An `unsigned long` containing the connection ID. This is the same as the process ID shown as the `Id` value in the output from [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").

  + `user`: The username used when authenticating. The value is blank for the anonymous user.

  + `host`: The host of the client connection. For a connection made using Unix sockets, the value is blank.

* `connection-done`: Triggered just as the connection to the client has been closed. The arguments are:

  + `status`: The status of the connection when it was closed. A logout operation has a value of 0; any other termination of the connection has a nonzero value.

  + `connectionid`: The connection ID of the connection that was closed.

The following D script quantifies and summarizes the average duration of individual connections, and provides a count, dumping the information every 60 seconds:

```sql
#!/usr/sbin/dtrace -s


mysql*:::connection-start
{
  self->start = timestamp;
}

mysql*:::connection-done
/self->start/
{
  @ = quantize(((timestamp - self->start)/1000000));
  self->start = 0;
}

tick-60s
{
  printa(@);
}
```

When executed on a server with a large number of clients you might see output similar to this:

```sql
  1  57413                        :tick-60s

           value  ------------- Distribution ------------- count
              -1 |                                         0
               0 |@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 30011
               1 |                                         59
               2 |                                         5
               4 |                                         20
               8 |                                         29
              16 |                                         18
              32 |                                         27
              64 |                                         30
             128 |                                         11
             256 |                                         10
             512 |                                         1
            1024 |                                         6
            2048 |                                         8
            4096 |                                         9
            8192 |                                         8
           16384 |                                         2
           32768 |                                         1
           65536 |                                         1
          131072 |                                         0
          262144 |                                         1
524288 |                                         0
```

##### 5.8.4.1.2 Command Probes

The command probes are executed before and after a client command is executed, including any SQL statement that might be executed during that period. Commands include operations such as the initialization of the DB, use of the `COM_CHANGE_USER` operation (supported by the MySQL protocol), and manipulation of prepared statements. Many of these commands are used only by the MySQL client API from various connectors such as PHP and Java.

```sql
command-start(connectionid, command, user, host)
command-done(status)
```

* `command-start`: Triggered when a command is submitted to the server.

  + `connectionid`: The connection ID of the client executing the command.

  + `command`: An integer representing the command that was executed. Possible values are shown in the following table.

    <table summary="Possible command-start command values and a name and description for each."><col style="width: 10%"/><col style="width: 20%"/><col style="width: 70%"/><thead><tr> <th scope="col">Value</th> <th scope="col">Name</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row">00</th> <td>COM_SLEEP</td> <td>Internal thread state</td> </tr><tr> <th scope="row">01</th> <td>COM_QUIT</td> <td>Close connection</td> </tr><tr> <th scope="row">02</th> <td>COM_INIT_DB</td> <td>Select database (<code>USE ...</code>)</td> </tr><tr> <th scope="row">03</th> <td>COM_QUERY</td> <td>Execute a query</td> </tr><tr> <th scope="row">04</th> <td>COM_FIELD_LIST</td> <td>Get a list of fields</td> </tr><tr> <th scope="row">05</th> <td>COM_CREATE_DB</td> <td>Create a database (deprecated)</td> </tr><tr> <th scope="row">06</th> <td>COM_DROP_DB</td> <td>Drop a database (deprecated)</td> </tr><tr> <th scope="row">07</th> <td>COM_REFRESH</td> <td>Refresh connection</td> </tr><tr> <th scope="row">08</th> <td>COM_SHUTDOWN</td> <td>Shutdown server</td> </tr><tr> <th scope="row">09</th> <td>COM_STATISTICS</td> <td>Get statistics</td> </tr><tr> <th scope="row">10</th> <td>COM_PROCESS_INFO</td> <td>Get processes (<a class="link" href="show-processlist.html" title="13.7.5.29 SHOW PROCESSLIST Statement"><code>SHOW PROCESSLIST</code></a>)</td> </tr><tr> <th scope="row">11</th> <td>COM_CONNECT</td> <td>Initialize connection</td> </tr><tr> <th scope="row">12</th> <td>COM_PROCESS_KILL</td> <td>Kill process</td> </tr><tr> <th scope="row">13</th> <td>COM_DEBUG</td> <td>Get debug information</td> </tr><tr> <th scope="row">14</th> <td>COM_PING</td> <td>Ping</td> </tr><tr> <th scope="row">15</th> <td>COM_TIME</td> <td>Internal thread state</td> </tr><tr> <th scope="row">16</th> <td>COM_DELAYED_INSERT</td> <td>Internal thread state</td> </tr><tr> <th scope="row">17</th> <td>COM_CHANGE_USER</td> <td>Change user</td> </tr><tr> <th scope="row">18</th> <td>COM_BINLOG_DUMP</td> <td>Used by a replica or <a class="link" href="mysqlbinlog.html" title="4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"><span class="command"><strong>mysqlbinlog</strong></span></a> to initiate a binary log read</td> </tr><tr> <th scope="row">19</th> <td>COM_TABLE_DUMP</td> <td>Used by a replica to get the source table information</td> </tr><tr> <th scope="row">20</th> <td>COM_CONNECT_OUT</td> <td>Used by a replica to log a connection to the server</td> </tr><tr> <th scope="row">21</th> <td>COM_REGISTER_SLAVE</td> <td>Used by a replica during registration</td> </tr><tr> <th scope="row">22</th> <td>COM_STMT_PREPARE</td> <td>Prepare a statement</td> </tr><tr> <th scope="row">23</th> <td>COM_STMT_EXECUTE</td> <td>Execute a statement</td> </tr><tr> <th scope="row">24</th> <td>COM_STMT_SEND_LONG_DATA</td> <td>Used by a client when requesting extended data</td> </tr><tr> <th scope="row">25</th> <td>COM_STMT_CLOSE</td> <td>Close a prepared statement</td> </tr><tr> <th scope="row">26</th> <td>COM_STMT_RESET</td> <td>Reset a prepared statement</td> </tr><tr> <th scope="row">27</th> <td>COM_SET_OPTION</td> <td>Set a server option</td> </tr><tr> <th scope="row">28</th> <td>COM_STMT_FETCH</td> <td>Fetch a prepared statement</td> </tr></tbody></table>

  + `user`: The user executing the command.

  + `host`: The client host.
* `command-done`: Triggered when the command execution completes. The `status` argument contains 0 if the command executed successfully, or 1 if the statement was terminated before normal completion.

The `command-start` and `command-done` probes are best used when combined with the statement probes to get an idea of overall execution time.

##### 5.8.4.1.3 Query Probes

The `query-start` and `query-done` probes are triggered when a specific query is received by the server and when the query has been completed and the information has been successfully sent to the client.

```sql
query-start(query, connectionid, database, user, host)
query-done(status)
```

* `query-start`: Triggered after the query string has been received from the client. The arguments are:

  + `query`: The full text of the submitted query.

  + `connectionid`: The connection ID of the client that submitted the query. The connection ID equals the connection ID returned when the client first connects and the `Id` value in the output from [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").

  + `database`: The database name on which the query is being executed.

  + `user`: The username used to connect to the server.

  + `host`: The hostname of the client.
* `query-done`: Triggered once the query has been executed and the information has been returned to the client. The probe includes a single argument, `status`, which returns 0 when the query is successfully executed and 1 if there was an error.

You can get a simple report of the execution time for each query using the following D script:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-20s %-20s %-40s %-9s\n", "Who", "Database", "Query", "Time(ms)");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->connid = arg1;
   self->db    = copyinstr(arg2);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->querystart = timestamp;
}

mysql*:::query-done
{
   printf("%-20s %-20s %-40s %-9d\n",self->who,self->db,self->query,
          (timestamp - self->querystart) / 1000000);
}
```

When executing the above script you should get a basic idea of the execution time of your queries:

```sql
$> ./query.d
Who                  Database             Query                                    Time(ms)
root@localhost       test                 select * from t1 order by i limit 10     0
root@localhost       test                 set global query_cache_size=0            0
root@localhost       test                 select * from t1 order by i limit 10     776
root@localhost       test                 select * from t1 order by i limit 10     773
root@localhost       test                 select * from t1 order by i desc limit 10 795
```

##### 5.8.4.1.4 Query Parsing Probes

The query parsing probes are triggered before the original SQL statement is parsed and when the parsing of the statement and determination of the execution model required to process the statement has been completed:

```sql
query-parse-start(query)
query-parse-done(status)
```

* `query-parse-start`: Triggered just before the statement is parsed by the MySQL query parser. The single argument, `query`, is a string containing the full text of the original query.

* `query-parse-done`: Triggered when the parsing of the original statement has been completed. The `status` is an integer describing the status of the operation. A `0` indicates that the query was successfully parsed. A `1` indicates that the parsing of the query failed.

For example, you could monitor the execution time for parsing a given query using the following D script:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

mysql*:::query-parse-start
{
   self->parsestart = timestamp;
   self->parsequery = copyinstr(arg0);
}

mysql*:::query-parse-done
/arg0 == 0/
{
   printf("Parsing %s: %d microseconds\n", self->parsequery,((timestamp - self->parsestart)/1000));
}

mysql*:::query-parse-done
/arg0 != 0/
{
   printf("Error parsing %s: %d microseconds\n", self->parsequery,((timestamp - self->parsestart)/1000));
}
```

In the above script a predicate is used on `query-parse-done` so that different output is generated based on the status value of the probe.

When running the script and monitoring the execution:

```sql
$> ./query-parsing.d
Error parsing select from t1 join (t2) on (t1.i = t2.i) order by t1.s,t1.i limit 10: 36 ms
Parsing select * from t1 join (t2) on (t1.i = t2.i) order by t1.s,t1.i limit 10: 176 ms
```

##### 5.8.4.1.5 Query Cache Probes

The query cache probes are fired when executing any query. The `query-cache-hit` query is triggered when a query exists in the query cache and can be used to return the query cache information. The arguments contain the original query text and the number of rows returned from the query cache for the query. If the query is not within the query cache, or the query cache is not enabled, then the `query-cache-miss` probe is triggered instead.

```sql
query-cache-hit(query, rows)
query-cache-miss(query)
```

* `query-cache-hit`: Triggered when the query has been found within the query cache. The first argument, `query`, contains the original text of the query. The second argument, `rows`, is an integer containing the number of rows in the cached query.

* `query-cache-miss`: Triggered when the query is not found within the query cache. The first argument, `query`, contains the original text of the query.

The query cache probes are best combined with a probe on the main query so that you can determine the differences in times between using or not using the query cache for specified queries. For example, in the following D script, the query and query cache information are combined into the information output during monitoring:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-20s %-20s %-40s %2s %-9s\n", "Who", "Database", "Query", "QC", "Time(ms)");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->connid = arg1;
   self->db    = copyinstr(arg2);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->querystart = timestamp;
   self->qc = 0;
}

mysql*:::query-cache-hit
{
   self->qc = 1;
}

mysql*:::query-cache-miss
{
   self->qc = 0;
}

mysql*:::query-done
{
   printf("%-20s %-20s %-40s %-2s %-9d\n",self->who,self->db,self->query,(self->qc ? "Y" : "N"),
          (timestamp - self->querystart) / 1000000);
}
```

When executing the script you can see the effects of the query cache. Initially the query cache is disabled. If you set the query cache size and then execute the query multiple times you should see that the query cache is being used to return the query data:

```sql
$> ./query-cache.d
root@localhost       test                 select * from t1 order by i limit 10     N  1072
root@localhost                            set global query_cache_size=262144       N  0
root@localhost       test                 select * from t1 order by i limit 10     N  781
root@localhost       test                 select * from t1 order by i limit 10     Y  0
```

##### 5.8.4.1.6 Query Execution Probes

The query execution probe is triggered when the actual execution of the query starts, after the parsing and checking the query cache but before any privilege checks or optimization. By comparing the difference between the start and done probes you can monitor the time actually spent servicing the query (instead of just handling the parsing and other elements of the query).

```sql
query-exec-start(query, connectionid, database, user, host, exec_type)
query-exec-done(status)
```

Note

The information provided in the arguments for `query-start` and `query-exec-start` are almost identical and designed so that you can choose to monitor either the entire query process (using `query-start`) or only the execution (using `query-exec-start`) while exposing the core information about the user, client, and query being executed.

* `query-exec-start`: Triggered when the execution of a individual query is started. The arguments are:

  + `query`: The full text of the submitted query.

  + `connectionid`: The connection ID of the client that submitted the query. The connection ID equals the connection ID returned when the client first connects and the `Id` value in the output from [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").

  + `database`: The database name on which the query is being executed.

  + `user`: The username used to connect to the server.

  + `host`: The hostname of the client.
  + `exec_type`: The type of execution. Execution types are determined based on the contents of the query and where it was submitted. The values for each type are shown in the following table.

    <table summary="exec_type values."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>Executed query from sql_parse, top-level query.</td> </tr><tr> <td>1</td> <td>Executed prepared statement</td> </tr><tr> <td>2</td> <td>Executed cursor statement</td> </tr><tr> <td>3</td> <td>Executed query in stored procedure</td> </tr></tbody></table>

* `query-exec-done`: Triggered when the execution of the query has completed. The probe includes a single argument, `status`, which returns 0 when the query is successfully executed and 1 if there was an error.

##### 5.8.4.1.7 Row-Level Probes

The `*row-{start,done}` probes are triggered each time a row operation is pushed down to a storage engine. For example, if you execute an [`INSERT`](insert.html "13.2.5 INSERT Statement") statement with 100 rows of data, then the `insert-row-start` and `insert-row-done` probes are triggered 100 times each, for each row insert.

```sql
insert-row-start(database, table)
insert-row-done(status)

update-row-start(database, table)
update-row-done(status)

delete-row-start(database, table)
delete-row-done(status)
```

* `insert-row-start`: Triggered before a row is inserted into a table.

* `insert-row-done`: Triggered after a row is inserted into a table.

* `update-row-start`: Triggered before a row is updated in a table.

* `update-row-done`: Triggered before a row is updated in a table.

* `delete-row-start`: Triggered before a row is deleted from a table.

* `delete-row-done`: Triggered before a row is deleted from a table.

The arguments supported by the probes are consistent for the corresponding `start` and `done` probes in each case:

* `database`: The database name.
* `table`: The table name.
* `status`: The status; 0 for success or 1 for failure.

Because the row-level probes are triggered for each individual row access, these probes can be triggered many thousands of times each second, which may have a detrimental effect on both the monitoring script and MySQL. The DTrace environment should limit the triggering on these probes to prevent the performance being adversely affected. Either use the probes sparingly, or use counter or aggregation functions to report on these probes and then provide a summary when the script terminates or as part of a `query-done` or `query-exec-done` probes.

The following example script summarizes the duration of each row operation within a larger query:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-2s %-10s %-10s %9s %9s %-s \n",
          "St", "Who", "DB", "ConnID", "Dur ms", "Query");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->db    = copyinstr(arg2);
   self->connid = arg1;
   self->querystart = timestamp;
   self->rowdur = 0;
}

mysql*:::query-done
{
   this->elapsed = (timestamp - self->querystart) /1000000;
   printf("%2d %-10s %-10s %9d %9d %s\n",
          arg0, self->who, self->db,
          self->connid, this->elapsed, self->query);
}

mysql*:::query-done
/ self->rowdur /
{
   printf("%34s %9d %s\n", "", (self->rowdur/1000000), "-> Row ops");
}

mysql*:::insert-row-start
{
   self->rowstart = timestamp;
}

mysql*:::delete-row-start
{
   self->rowstart = timestamp;
}

mysql*:::update-row-start
{
   self->rowstart = timestamp;
}

mysql*:::insert-row-done
{
   self->rowdur += (timestamp-self->rowstart);
}

mysql*:::delete-row-done
{
   self->rowdur += (timestamp-self->rowstart);
}

mysql*:::update-row-done
{
   self->rowdur += (timestamp-self->rowstart);
}
```

Running the above script with a query that inserts data into a table, you can monitor the exact time spent performing the raw row insertion:

```sql
St Who        DB            ConnID    Dur ms Query
 0 @localhost test              13     20767 insert into t1(select * from t2)
                                        4827 -> Row ops
```

##### 5.8.4.1.8 Read Row Probes

The read row probes are triggered at a storage engine level each time a row read operation occurs. These probes are specified within each storage engine (as opposed to the `*row-start` probes which are in the storage engine interface). These probes can therefore be used to monitor individual storage engine row-level operations and performance. Because these probes are triggered around the storage engine row read interface, they may be hit a significant number of times during a basic query.

```sql
read-row-start(database, table, scan_flag)
read-row-done(status)
```

* `read-row-start`: Triggered when a row is read by the storage engine from the specified `database` and `table`. The `scan_flag` is set to 1 (true) when the read is part of a table scan (that is, a sequential read), or 0 (false) when the read is of a specific record.

* `read-row-done`: Triggered when a row read operation within a storage engine completes. The `status` returns 0 on success, or a positive value on failure.

##### 5.8.4.1.9 Index Probes

The index probes are triggered each time a row is read using one of the indexes for the specified table. The probe is triggered within the corresponding storage engine for the table.

```sql
index-read-row-start(database, table)
index-read-row-done(status)
```

* `index-read-row-start`: Triggered when a row is read by the storage engine from the specified `database` and `table`.

* `index-read-row-done`: Triggered when an indexed row read operation within a storage engine completes. The `status` returns 0 on success, or a positive value on failure.

##### 5.8.4.1.10 Lock Probes

The lock probes are called whenever an external lock is requested by MySQL for a table using the corresponding lock mechanism on the table as defined by the table's engine type. There are three different types of lock, the read lock, write lock, and unlock operations. Using the probes you can determine the duration of the external locking routine (that is, the time taken by the storage engine to implement the lock, including any time waiting for another lock to become free) and the total duration of the lock/unlock process.

```sql
handler-rdlock-start(database, table)
handler-rdlock-done(status)

handler-wrlock-start(database, table)
handler-wrlock-done(status)

handler-unlock-start(database, table)
handler-unlock-done(status)
```

* `handler-rdlock-start`: Triggered when a read lock is requested on the specified `database` and `table`.

* `handler-wrlock-start`: Triggered when a write lock is requested on the specified `database` and `table`.

* `handler-unlock-start`: Triggered when an unlock request is made on the specified `database` and `table`.

* `handler-rdlock-done`: Triggered when a read lock request completes. The `status` is 0 if the lock operation succeeded, or `>0` on failure.

* `handler-wrlock-done`: Triggered when a write lock request completes. The `status` is 0 if the lock operation succeeded, or `>0` on failure.

* `handler-unlock-done`: Triggered when an unlock request completes. The `status` is 0 if the unlock operation succeeded, or `>0` on failure.

You can use arrays to monitor the locking and unlocking of individual tables and then calculate the duration of the entire table lock using the following script:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

mysql*:::handler-rdlock-start
{
   self->rdlockstart = timestamp;
   this->lockref = strjoin(copyinstr(arg0),strjoin("@",copyinstr(arg1)));
   self->lockmap[this->lockref] = self->rdlockstart;
   printf("Start: Lock->Read   %s.%s\n",copyinstr(arg0),copyinstr(arg1));
}

mysql*:::handler-wrlock-start
{
   self->wrlockstart = timestamp;
   this->lockref = strjoin(copyinstr(arg0),strjoin("@",copyinstr(arg1)));
   self->lockmap[this->lockref] = self->rdlockstart;
   printf("Start: Lock->Write  %s.%s\n",copyinstr(arg0),copyinstr(arg1));
}

mysql*:::handler-unlock-start
{
   self->unlockstart = timestamp;
   this->lockref = strjoin(copyinstr(arg0),strjoin("@",copyinstr(arg1)));
   printf("Start: Lock->Unlock %s.%s (%d ms lock duration)\n",
          copyinstr(arg0),copyinstr(arg1),
          (timestamp - self->lockmap[this->lockref])/1000000);
}

mysql*:::handler-rdlock-done
{
   printf("End:   Lock->Read   %d ms\n",
          (timestamp - self->rdlockstart)/1000000);
}

mysql*:::handler-wrlock-done
{
   printf("End:   Lock->Write  %d ms\n",
          (timestamp - self->wrlockstart)/1000000);
}

mysql*:::handler-unlock-done
{
   printf("End:   Lock->Unlock %d ms\n",
          (timestamp - self->unlockstart)/1000000);
}
```

When executed, you should get information both about the duration of the locking process itself, and of the locks on a specific table:

```sql
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
Start: Lock->Unlock test.t2 (25743 ms lock duration)
End:   Lock->Unlock 0 ms
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
Start: Lock->Unlock test.t2 (1 ms lock duration)
End:   Lock->Unlock 0 ms
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
Start: Lock->Unlock test.t2 (1 ms lock duration)
End:   Lock->Unlock 0 ms
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
```

##### 5.8.4.1.11 Filesort Probes

The filesort probes are triggered whenever a filesort operation is applied to a table. For more information on filesort and the conditions under which it occurs, see [Section 8.2.1.14, “ORDER BY Optimization”](order-by-optimization.html "8.2.1.14 ORDER BY Optimization").

```sql
filesort-start(database, table)
filesort-done(status, rows)
```

* `filesort-start`: Triggered when the filesort operation starts on a table. The two arguments to the probe, `database` and `table`, identify the table being sorted.

* `filesort-done`: Triggered when the filesort operation completes. Two arguments are supplied, the `status` (0 for success, 1 for failure), and the number of rows sorted during the filesort process.

An example of this is in the following script, which tracks the duration of the filesort process in addition to the duration of the main query:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-2s %-10s %-10s %9s %18s %-s \n",
          "St", "Who", "DB", "ConnID", "Dur microsec", "Query");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->db    = copyinstr(arg2);
   self->connid = arg1;
   self->querystart = timestamp;
   self->filesort = 0;
   self->fsdb = "";
   self->fstable = "";
}

mysql*:::filesort-start
{
  self->filesort = timestamp;
  self->fsdb = copyinstr(arg0);
  self->fstable = copyinstr(arg1);
}

mysql*:::filesort-done
{
   this->elapsed = (timestamp - self->filesort) /1000;
   printf("%2d %-10s %-10s %9d %18d Filesort on %s\n",
          arg0, self->who, self->fsdb,
          self->connid, this->elapsed, self->fstable);
}

mysql*:::query-done
{
   this->elapsed = (timestamp - self->querystart) /1000;
   printf("%2d %-10s %-10s %9d %18d %s\n",
          arg0, self->who, self->db,
          self->connid, this->elapsed, self->query);
}
```

Executing a query on a large table with an `ORDER BY` clause that triggers a filesort, and then creating an index on the table and then repeating the same query, you can see the difference in execution speed:

```sql
St Who        DB            ConnID       Dur microsec Query
 0 @localhost test              14           11335469 Filesort on t1
 0 @localhost test              14           11335787 select * from t1 order by i limit 100
 0 @localhost test              14          466734378 create index t1a on t1 (i)
 0 @localhost test              14              26472 select * from t1 order by i limit 100
```

##### 5.8.4.1.12 Statement Probes

The individual statement probes are provided to give specific information about different statement types. For the start probes the string of the query is provided as the only argument. Depending on the statement type, the information provided by the corresponding done probe can differ. For all done probes the status of the operation (`0` for success, `>0` for failure) is provided. For [`SELECT`](select.html "13.2.9 SELECT Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`INSERT ... (SELECT FROM ...)`](insert.html "13.2.5 INSERT Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement"), and [`DELETE FROM t1,t2`](delete.html "13.2.2 DELETE Statement") operations the number of rows affected is returned.

For [`UPDATE`](update.html "13.2.11 UPDATE Statement") and [`UPDATE t1,t2 ...`](update.html "13.2.11 UPDATE Statement") statements the number of rows matched and the number of rows actually changed is provided. This is because the number of rows actually matched by the corresponding `WHERE` clause, and the number of rows changed can differ. MySQL does not update the value of a row if the value already matches the new setting.

```sql
select-start(query)
select-done(status,rows)

insert-start(query)
insert-done(status,rows)

insert-select-start(query)
insert-select-done(status,rows)

update-start(query)
update-done(status,rowsmatched,rowschanged)

multi-update-start(query)
multi-update-done(status,rowsmatched,rowschanged)

delete-start(query)
delete-done(status,rows)

multi-delete-start(query)
multi-delete-done(status,rows)
```

* `select-start`: Triggered before a [`SELECT`](select.html "13.2.9 SELECT Statement") statement.

* `select-done`: Triggered at the end of a [`SELECT`](select.html "13.2.9 SELECT Statement") statement.

* `insert-start`: Triggered before a [`INSERT`](insert.html "13.2.5 INSERT Statement") statement.

* `insert-done`: Triggered at the end of an [`INSERT`](insert.html "13.2.5 INSERT Statement") statement.

* `insert-select-start`: Triggered before an [`INSERT ... SELECT`](insert.html "13.2.5 INSERT Statement") statement.

* `insert-select-done`: Triggered at the end of an [`INSERT ... SELECT`](insert.html "13.2.5 INSERT Statement") statement.

* `update-start`: Triggered before an [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement.

* `update-done`: Triggered at the end of an [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement.

* `multi-update-start`: Triggered before an [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement involving multiple tables.

* `multi-update-done`: Triggered at the end of an [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement involving multiple tables.

* `delete-start`: Triggered before a [`DELETE`](delete.html "13.2.2 DELETE Statement") statement.

* `delete-done`: Triggered at the end of a [`DELETE`](delete.html "13.2.2 DELETE Statement") statement.

* `multi-delete-start`: Triggered before a [`DELETE`](delete.html "13.2.2 DELETE Statement") statement involving multiple tables.

* `multi-delete-done`: Triggered at the end of a [`DELETE`](delete.html "13.2.2 DELETE Statement") statement involving multiple tables.

The arguments for the statement probes are:

* `query`: The query string.
* `status`: The status of the query. `0` for success, and `>0` for failure.

* `rows`: The number of rows affected by the statement. This returns the number rows found for [`SELECT`](select.html "13.2.9 SELECT Statement"), the number of rows deleted for [`DELETE`](delete.html "13.2.2 DELETE Statement"), and the number of rows successfully inserted for [`INSERT`](insert.html "13.2.5 INSERT Statement").

* `rowsmatched`: The number of rows matched by the `WHERE` clause of an [`UPDATE`](update.html "13.2.11 UPDATE Statement") operation.

* `rowschanged`: The number of rows actually changed during an [`UPDATE`](update.html "13.2.11 UPDATE Statement") operation.

You use these probes to monitor the execution of these statement types without having to monitor the user or client executing the statements. A simple example of this is to track the execution times:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-60s %-8s %-8s %-8s\n", "Query", "RowsU", "RowsM", "Dur (ms)");
}

mysql*:::update-start, mysql*:::insert-start,
mysql*:::delete-start, mysql*:::multi-delete-start,
mysql*:::multi-delete-done, mysql*:::select-start,
mysql*:::insert-select-start, mysql*:::multi-update-start
{
    self->query = copyinstr(arg0);
    self->querystart = timestamp;
}

mysql*:::insert-done, mysql*:::select-done,
mysql*:::delete-done, mysql*:::multi-delete-done, mysql*:::insert-select-done
/ self->querystart /
{
    this->elapsed = ((timestamp - self->querystart)/1000000);
    printf("%-60s %-8d %-8d %d\n",
           self->query,
           0,
           arg1,
           this->elapsed);
    self->querystart = 0;
}

mysql*:::update-done, mysql*:::multi-update-done
/ self->querystart /
{
    this->elapsed = ((timestamp - self->querystart)/1000000);
    printf("%-60s %-8d %-8d %d\n",
           self->query,
           arg1,
           arg2,
           this->elapsed);
    self->querystart = 0;
}
```

When executed you can see the basic execution times and rows matches:

```sql
Query                                                        RowsU    RowsM    Dur (ms)
select * from t2                                             0        275      0
insert into t2 (select * from t2)                            0        275      9
update t2 set i=5 where i > 75                               110      110      8
update t2 set i=5 where i < 25                               254      134      12
delete from t2 where i < 5                                   0        0        0
```

Another alternative is to use the aggregation functions in DTrace to aggregate the execution time of individual statements together:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet


mysql*:::update-start, mysql*:::insert-start,
mysql*:::delete-start, mysql*:::multi-delete-start,
mysql*:::multi-delete-done, mysql*:::select-start,
mysql*:::insert-select-start, mysql*:::multi-update-start
{
    self->querystart = timestamp;
}

mysql*:::select-done
{
        @statements["select"] = sum(((timestamp - self->querystart)/1000000));
}

mysql*:::insert-done, mysql*:::insert-select-done
{
        @statements["insert"] = sum(((timestamp - self->querystart)/1000000));
}

mysql*:::update-done, mysql*:::multi-update-done
{
        @statements["update"] = sum(((timestamp - self->querystart)/1000000));
}

mysql*:::delete-done, mysql*:::multi-delete-done
{
        @statements["delete"] = sum(((timestamp - self->querystart)/1000000));
}

tick-30s
{
        printa(@statements);
}
```

The script just shown aggregates the times spent doing each operation, which could be used to help benchmark a standard suite of tests.

```sql
 delete                                                            0
  update                                                            0
  insert                                                           23
  select                                                         2484

  delete                                                            0
  update                                                            0
  insert                                                           39
  select                                                        10744

  delete                                                            0
  update                                                           26
  insert                                                           56
  select                                                        10944

  delete                                                            0
  update                                                           26
  insert                                                         2287
  select                                                        15985
```

##### 5.8.4.1.13 Network Probes

The network probes monitor the transfer of information from the MySQL server and clients of all types over the network. The probes are defined as follows:

```sql
net-read-start()
net-read-done(status, bytes)
net-write-start(bytes)
net-write-done(status)
```

* `net-read-start`: Triggered when a network read operation is started.

* `net-read-done`: Triggered when the network read operation completes. The `status` is an `integer` representing the return status for the operation, `0` for success and `1` for failure. The `bytes` argument is an integer specifying the number of bytes read during the process.

* `net-start-bytes`: Triggered when data is written to a network socket. The single argument, `bytes`, specifies the number of bytes written to the network socket.

* `net-write-done`: Triggered when the network write operation has completed. The single argument, `status`, is an integer representing the return status for the operation, `0` for success and `1` for failure.

You can use the network probes to monitor the time spent reading from and writing to network clients during execution. The following D script provides an example of this. Both the cumulative time for the read or write is calculated, and the number of bytes. Note that the dynamic variable size has been increased (using the `dynvarsize` option) to cope with the rapid firing of the individual probes for the network reads/writes.

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet
#pragma D option dynvarsize=4m

dtrace:::BEGIN
{
   printf("%-2s %-30s %-10s %9s %18s %-s \n",
          "St", "Who", "DB", "ConnID", "Dur microsec", "Query");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->db    = copyinstr(arg2);
   self->connid = arg1;
   self->querystart = timestamp;
   self->netwrite = 0;
   self->netwritecum = 0;
   self->netwritebase = 0;
   self->netread = 0;
   self->netreadcum = 0;
   self->netreadbase = 0;
}

mysql*:::net-write-start
{
   self->netwrite += arg0;
   self->netwritebase = timestamp;
}

mysql*:::net-write-done
{
   self->netwritecum += (timestamp - self->netwritebase);
   self->netwritebase = 0;
}

mysql*:::net-read-start
{
   self->netreadbase = timestamp;
}

mysql*:::net-read-done
{
   self->netread += arg1;
   self->netreadcum += (timestamp - self->netreadbase);
   self->netreadbase = 0;
}

mysql*:::query-done
{
   this->elapsed = (timestamp - self->querystart) /1000000;
   printf("%2d %-30s %-10s %9d %18d %s\n",
          arg0, self->who, self->db,
          self->connid, this->elapsed, self->query);
   printf("Net read: %d bytes (%d ms) write: %d bytes (%d ms)\n",
               self->netread, (self->netreadcum/1000000),
               self->netwrite, (self->netwritecum/1000000));
}
```

When executing the above script on a machine with a remote client, you can see that approximately a third of the time spent executing the query is related to writing the query results back to the client.

```sql
St Who                            DB            ConnID       Dur microsec Query
 0 root@::ffff:198.51.100.108      test              31               3495 select * from t1 limit 1000000
Net read: 0 bytes (0 ms) write: 10000075 bytes (1220 ms)
```

##### 5.8.4.1.14 Keycache Probes

The keycache probes are triggered when using the index key cache used with the MyISAM storage engine. Probes exist to monitor when data is read into the keycache, cached key data is written from the cache into a cached file, or when accessing the keycache.

Keycache usage indicates when data is read or written from the index files into the cache, and can be used to monitor how efficient the memory allocated to the keycache is being used. A high number of keycache reads across a range of queries may indicate that the keycache is too small for size of data being accessed.

```sql
keycache-read-start(filepath, bytes, mem_used, mem_free)
keycache-read-block(bytes)
keycache-read-hit()
keycache-read-miss()
keycache-read-done(mem_used, mem_free)
keycache-write-start(filepath, bytes, mem_used, mem_free)
keycache-write-block(bytes)
keycache-write-done(mem_used, mem_free)
```

When reading data from the index files into the keycache, the process first initializes the read operation (indicated by `keycache-read-start`), then loads blocks of data (`keycache-read-block`), and then the read block is either matches the data being identified (`keycache-read-hit`) or more data needs to be read (`keycache-read-miss`). Once the read operation has completed, reading stops with the `keycache-read-done`.

Data can be read from the index file into the keycache only when the specified key is not already within the keycache.

* `keycache-read-start`: Triggered when the keycache read operation is started. Data is read from the specified `filepath`, reading the specified number of `bytes`. The `mem_used` and `mem_avail` indicate memory currently used by the keycache and the amount of memory available within the keycache.

* `keycache-read-block`: Triggered when the keycache reads a block of data, of the specified number of `bytes`, from the index file into the keycache.

* `keycache-read-hit`: Triggered when the block of data read from the index file matches the key data requested.

* `keycache-read-miss`: Triggered when the block of data read from the index file does not match the key data needed.

* `keycache-read-done`: Triggered when the keycache read operation has completed. The `mem_used` and `mem_avail` indicate memory currently used by the keycache and the amount of memory available within the keycache.

Keycache writes occur when the index information is updated during an `INSERT`, `UPDATE`, or `DELETE` operation, and the cached key information is flushed back to the index file.

* `keycache-write-start`: Triggered when the keycache write operation is started. Data is written to the specified `filepath`, reading the specified number of `bytes`. The `mem_used` and `mem_avail` indicate memory currently used by the keycache and the amount of memory available within the keycache.

* `keycache-write-block`: Triggered when the keycache writes a block of data, of the specified number of `bytes`, to the index file from the keycache.

* `keycache-write-done`: Triggered when the keycache write operation has completed. The `mem_used` and `mem_avail` indicate memory currently used by the keycache and the amount of memory available within the keycache.
