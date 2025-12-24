### 8.3.5 Reusing SSL Sessions

MySQL client programs may elect to resume a prior SSL session, provided that the server has the session in its runtime cache. This section describes the conditions that are favorable for SSL session reuse, the server variables used for managing and monitoring the session cache, and the client command-line options for storing and reusing session data.

*  Server-Side Runtime Configuration and Monitoring for SSL Session Reuse
*  Client-Side Configuration for SSL Session Reuse

Each full TLS exchange can be costly both in terms of computation and network overhead, less costly if TLSv1.3 is used. By extracting a session ticket from an established session and then submitting that ticket while establishing the next connection, the overall cost is reduced if the session can be reused. For example, consider the benefit of having web pages that can open multiple connections and generate faster.

In general, the following conditions must be satisfied before SSL sessions can be reused:

* The server must keep its session cache in memory.
* The server-side session cache timeout must not have expired.
* Each client has to maintain a cache of active sessions and keep it secure.

C applications can use the C API capabilities to enable session reuse for encrypted connections (see SSL Session Reuse).

#### Server-Side Runtime Configuration and Monitoring for SSL Session Reuse

To create the initial TLS context, the server uses the values that the context-related system variables have at startup. To expose the context values, the server also initializes a set of corresponding status variables. The following table shows the system variables that define the server's runtime session cache and the corresponding status variables that expose the currently active session-cache values.

**Table 8.13 System and Status Variables for Session Reuse**

<table><col style="width: 45%"/><col style="width: 55%"/><thead><tr> <th>System Variable Name</th> <th>Corresponding Status Variable Name</th> </tr></thead><tbody><tr> <td><code>ssl_session_cache_mode</code></td> <td><code>Ssl_session_cache_mode</code></td> </tr><tr> <td><code>ssl_session_cache_timeout</code></td> <td><code>Ssl_session_cache_timeout</code></td> </tr></tbody></table>

::: info Note

When the value of the `ssl_session_cache_mode` server variable is `ON`, which is the default mode, the value of the `Ssl_session_cache_mode` status variable is `SERVER`.

:::

SSL session cache variables apply to both the `mysql_main` and `mysql_admin` TLS channels. Their values are also exposed as properties in the Performance Schema `tls_channel_status` table, along with the properties for any other active TLS contexts.

To reconfigure the SSL session cache at runtime, use this procedure:

1. Set each cache-related system variable that should be changed to its new value. For example, change the cache timeout value from the default (300 seconds) to 600 seconds:

   ```
   mysql> SET GLOBAL ssl_session_cache_timeout = 600;
   ```

   The members of each pair of system and status variables may have different values temporarily due to the way the reconfiguration procedure works.

   ```
   mysql> SHOW VARIABLES LIKE 'ssl_session_cache_timeout';
   +---------------------------+-------+
   | Variable_name             | Value |
   +---------------------------+-------+
   | ssl_session_cache_timeout | 600   |
   +---------------------------+-------+
   1 row in set (0.00 sec)

   mysql> SHOW STATUS LIKE 'Ssl_session_cache_timeout';
   +---------------------------+-------+
   | Variable_name             | Value |
   +---------------------------+-------+
   | Ssl_session_cache_timeout | 300   |
   +---------------------------+-------+
   1 row in set (0.00 sec)
   ```

   For additional information about setting variable values, see  System Variable Assignment.
2. Execute `ALTER INSTANCE RELOAD TLS`. This statement reconfigures the active TLS context from the current values of the cache-related system variables. It also sets the cache-related status variables to reflect the new active cache values. The statement requires the  `CONNECTION_ADMIN` privilege.

   ```
   mysql> ALTER INSTANCE RELOAD TLS;
   Query OK, 0 rows affected (0.01 sec)

   mysql> SHOW VARIABLES LIKE 'ssl_session_cache_timeout';
   +---------------------------+-------+
   | Variable_name             | Value |
   +---------------------------+-------+
   | ssl_session_cache_timeout | 600   |
   +---------------------------+-------+
   1 row in set (0.00 sec)

   mysql> SHOW STATUS LIKE 'Ssl_session_cache_timeout';
   +---------------------------+-------+
   | Variable_name             | Value |
   +---------------------------+-------+
   | Ssl_session_cache_timeout | 600   |
   +---------------------------+-------+
   1 row in set (0.00 sec)
   ```

   New connections established after execution of `ALTER INSTANCE RELOAD TLS` use the new TLS context. Existing connections remain unaffected.

#### Client-Side Configuration for SSL Session Reuse

All MySQL client programs are capable of reusing a prior session for new encrypted connections made to the same server, provided that you stored the session data while the original connection was still active. Session data are stored to a file and you specify this file when you invoke the client again.

To store and reuse SSL session data, use this procedure:

1. Invoke  `mysql` to establish an encrypted connection to a server running MySQL 8.4.
2. Use the **ssl\_session\_data\_print** command to specify the path to a file where you can store the currently active session data securely. For example:

   ```
   mysql> ssl_session_data_print ~/private-dir/session.txt
   ```

   Session data are obtained in the form of a null-terminated, PEM encoded ANSI string. If you omit the path and file name, the string prints to standard output.
3. From the prompt of your command interpreter, invoke any MySQL client program to establish a new encrypted connection to the same server. To reuse the session data, specify the `--ssl-session-data` command-line option and the file argument.

   For example, establish a new connection using `mysql`:

   ```
   mysql -u admin -p --ssl-session-data=~/private-dir/session.txt
   ```

   and then  `mysqlshow` client:

   ```
   mysqlshow -u admin -p --ssl-session-data=~/private-dir/session.txt
   Enter password: *****
   +--------------------+
   |     Databases      |
   +--------------------+
   | information_schema |
   | mysql              |
   | performance_schema |
   | sys                |
   | world              |
   +--------------------+
   ```

   In each example, the client attempts to resume the original session while it establishes a new connection to the same server.

   To confirm whether  `mysql` reused a session, see the output from the `status` command. If the currently active  `mysql` connection did resume the session, the status information includes `SSL session reused: true`.

In addition to  `mysql` and `mysqlshow`, SSL session reuse applies to `mysqladmin`,  **mysqlbinlog**, `mysqlcheck`,  `mysqldump`, `mysqlimport`,  **mysqlslap**, **mysqltest**, **mysql\_migrate\_keyring**, and `mysql_secure_installation`.

Several conditions may prevent the successful retrieval of session data. For instance, if the session is not fully connected, it is not an SSL session, the server has not yet sent the session data, or the SSL session is simply not reusable. Even with properly stored session data, the server's session cache can time out. Regardless of the cause, an error is returned by default if you specify `--ssl-session-data` but the session cannot be reused. For example:

```
mysqlshow -u admin -p --ssl-session-data=~/private-dir/session.txt
Enter password: *****
ERROR:
--ssl-session-data specified but the session was not reused.
```

To suppress the error message, and to establish the connection by silently creating a new session instead, specify `--ssl-session-data-continue-on-failed-reuse` on the command line, along with `--ssl-session-data` . If the server's cache timeout has expired, you can store the session data again to the same file. The default server cache timeout can be extended (see Server-Side Runtime Configuration and Monitoring for SSL Session Reuse).
