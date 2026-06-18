### 4.5.1 mysql — The MySQL Command-Line Client

[4.5.1.1 mysql Client Options](mysql-command-options.html)

[4.5.1.2 mysql Client Commands](mysql-commands.html)

[4.5.1.3 mysql Client Logging](mysql-logging.html)

[4.5.1.4 mysql Client Server-Side Help](mysql-server-side-help.html)

[4.5.1.5 Executing SQL Statements from a Text File](mysql-batch-commands.html)

[4.5.1.6 mysql Client Tips](mysql-tips.html)

[**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") is a simple SQL shell with input line
editing capabilities. It supports interactive and noninteractive
use. When used interactively, query results are presented in an
ASCII-table format. When used noninteractively (for example, as
a filter), the result is presented in tab-separated format. The
output format can be changed using command options.

If you have problems due to insufficient memory for large result
sets, use the [`--quick`](mysql-command-options.html#option_mysql_quick) option. This
forces [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") to retrieve results from the
server a row at a time rather than retrieving the entire result
set and buffering it in memory before displaying it. This is
done by returning the result set using the
[`mysql_use_result()`](/doc/c-api/5.7/en/mysql-use-result.html) C API
function in the client/server library rather than
[`mysql_store_result()`](/doc/c-api/5.7/en/mysql-store-result.html).

Note

Alternatively, MySQL Shell offers access to the X DevAPI.
For details, see [MySQL Shell 8.0](/doc/mysql-shell/8.0/en/).

Using [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") is very easy. Invoke it from the
prompt of your command interpreter as follows:

```sql
mysql db_name
```

Or:

```sql
mysql --user=user_name --password db_name
```

In this case, you'll need to enter your password in response to
the prompt that [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") displays:

```sql
Enter password: your_password
```

Then type an SQL statement, end it with `;`,
`\g`, or `\G` and press Enter.

Typing **Control+C** interrupts the current
statement if there is one, or cancels any partial input line
otherwise.

You can execute SQL statements in a script file (batch file)
like this:

```sql
mysql db_name < script.sql > output.tab
```

On Unix, the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client logs statements
executed interactively to a history file. See
[Section 4.5.1.3, “mysql Client Logging”](mysql-logging.html "4.5.1.3 mysql Client Logging").