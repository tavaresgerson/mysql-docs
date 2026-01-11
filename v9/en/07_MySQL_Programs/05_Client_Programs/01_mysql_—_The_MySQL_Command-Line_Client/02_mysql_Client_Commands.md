#### 6.5.1.2 mysql Client Commands

**mysql** sends each SQL statement that you issue to the server to be executed. There is also a set of commands that **mysql** itself interprets. For a list of these commands, type `help` or `\h` at the `mysql>` prompt:

```
mysql> help

List of all MySQL commands:
Note that all text commands must be first on line and end with ';'
?         (\?) Synonym for `help'.
clear     (\c) Clear the current input statement.
connect   (\r) Reconnect to the server. Optional arguments are db and host.
delimiter (\d) Set statement delimiter.
edit      (\e) Edit command with $EDITOR.
ego       (\G) Send command to mysql server, display result vertically.
exit      (\q) Exit mysql. Same as quit.
go        (\g) Send command to mysql server.
help      (\h) Display this help.
nopager   (\n) Disable pager, print to stdout.
notee     (\t) Don't write into outfile.
pager     (\P) Set PAGER [to_pager]. Print the query results via PAGER.
print     (\p) Print current command.
prompt    (\R) Change your mysql prompt.
quit      (\q) Quit mysql.
rehash    (\#) Rebuild completion hash.
source    (\.) Execute an SQL script file. Takes a file name as an argument.
status    (\s) Get status information from the server.
system    (\!) Execute a system shell command.
tee       (\T) Set outfile [to_outfile]. Append everything into given
               outfile.
use       (\u) Use another database. Takes database name as argument.
charset   (\C) Switch to another charset. Might be needed for processing
               binlog with multi-byte charsets.
warnings  (\W) Show warnings after every statement.
nowarning (\w) Don't show warnings after every statement.
resetconnection(\x) Clean session context.
query_attributes Sets string parameters (name1 value1 name2 value2 ...)
for the next query to pick up.
ssl_session_data_print Serializes the current SSL session data to stdout
or file.

For server side help, type 'help contents'
```

If **mysql** is invoked with the `--binary-mode` option, all **mysql** commands are disabled except `charset` and `delimiter` in noninteractive mode (for input piped to **mysql** or loaded using the `source` command).The `--commands` option can be used to enable or disable all commands except `/C`, `delimiter`, and `use`.

Each command has both a long and short form. The long form is not case-sensitive; the short form is. The long form can be followed by an optional semicolon terminator, but the short form should not.

The use of short-form commands within multiple-line `/* ... */` comments is not supported. Short-form commands do work within single-line `/*! ... */` version comments, as do `/*+ ... */` optimizer-hint comments, which are stored in object definitions. If there is a concern that optimizer-hint comments may be stored in object definitions so that dump files when reloaded with `mysql` would result in execution of such commands, either invoke **mysql** with the `--binary-mode` option or use a reload client other than **mysql**.

* `help [arg]`, `\h [arg]`, `\? [arg]`, `? [arg]`

  Display a help message listing the available **mysql** commands.

  If you provide an argument to the `help` command, **mysql** uses it as a search string to access server-side help from the contents of the MySQL Reference Manual. For more information, see Section 6.5.1.4, “mysql Client Server-Side Help”.

* `charset charset_name`, `\C charset_name`

  Change the default character set and issue a `SET NAMES` statement. This enables the character set to remain synchronized on the client and server if **mysql** is run with auto-reconnect enabled (which is not recommended), because the specified character set is used for reconnects.

* `clear`, `\c`

  Clear the current input. Use this if you change your mind about executing the statement that you are entering.

* `connect [db_name [host_name]]`, `\r [db_name [host_name]]`

  Reconnect to the server. The optional database name and host name arguments may be given to specify the default database or the host where the server is running. If omitted, the current values are used.

  If the `connect` command specifies a host name argument, that host takes precedence over any `--dns-srv-name` option given at **mysql** startup to specify a DNS SRV record.

* `delimiter str`, `\d str`

  Change the string that **mysql** interprets as the separator between SQL statements. The default is the semicolon character (`;`).

  The delimiter string can be specified as an unquoted or quoted argument on the `delimiter` command line. Quoting can be done with either single quote (`'`), double quote (`"`), or backtick (`` ` ``) characters. To include a quote within a quoted string, either quote the string with a different quote character or escape the quote with a backslash (`\`) character. Backslash should be avoided outside of quoted strings because it is the escape character for MySQL. For an unquoted argument, the delimiter is read up to the first space or end of line. For a quoted argument, the delimiter is read up to the matching quote on the line.

  **mysql** interprets instances of the delimiter string as a statement delimiter anywhere it occurs, except within quoted strings. Be careful about defining a delimiter that might occur within other words. For example, if you define the delimiter as `X`, it is not possible to use the word `INDEX` in statements. **mysql** interprets this as `INDE` followed by the delimiter `X`.

  When the delimiter recognized by **mysql** is set to something other than the default of `;`, instances of that character are sent to the server without interpretation. However, the server itself still interprets `;` as a statement delimiter and processes statements accordingly. This behavior on the server side comes into play for multiple-statement execution (see Multiple Statement Execution Support), and for parsing the body of stored procedures and functions, triggers, and events (see Section 27.1, “Defining Stored Programs”).

* `edit`, `\e`

  Edit the current input statement. **mysql** checks the values of the `EDITOR` and `VISUAL` environment variables to determine which editor to use. The default editor is **vi** if neither variable is set.

  The `edit` command works only in Unix.

* `ego`, `\G`

  Send the current statement to the server to be executed and display the result using vertical format.

* `exit`, `\q`

  Exit **mysql**.

* `go`, `\g`

  Send the current statement to the server to be executed.

* `nopager`, `\n`

  Disable output paging. See the description for `pager`.

  The `nopager` command works only in Unix.

* `notee`, `\t`

  Disable output copying to the tee file. See the description for `tee`.

* `nowarning`, `\w`

  Disable display of warnings after each statement.

* `pager [command]`, `\P [command]`

  Enable output paging. By using the `--pager` option when you invoke **mysql**, it is possible to browse or search query results in interactive mode with Unix programs such as **less**, **more**, or any other similar program. If you specify no value for the option, **mysql** checks the value of the `PAGER` environment variable and sets the pager to that. Pager functionality works only in interactive mode.

  Output paging can be enabled interactively with the `pager` command and disabled with `nopager`. The command takes an optional argument; if given, the paging program is set to that. With no argument, the pager is set to the pager that was set on the command line, or `stdout` if no pager was specified.

  Output paging works only in Unix because it uses the `popen()` function, which does not exist on Windows. For Windows, the `tee` option can be used instead to save query output, although it is not as convenient as `pager` for browsing output in some situations.

* `print`, `\p`

  Print the current input statement without executing it.

* `prompt [str]`, `\R [str]`

  Reconfigure the **mysql** prompt to the given string. The special character sequences that can be used in the prompt are described later in this section.

  If you specify the `prompt` command with no argument, **mysql** resets the prompt to the default of `mysql>`.

* `query_attributes name value [name value ...]`

  Define query attributes that apply to the next query sent to the server. For discussion of the purpose and use of query attributes, see Section 11.6, “Query Attributes”.

  The `query_attributes` command follows these rules:

  + The format and quoting rules for attribute names and values are the same as for the `delimiter` command.

  + The command permits up to 32 attribute name/value pairs. Names and values may be up to 1024 characters long. If a name is given without a value, an error occurs.

  + If multiple `query_attributes` commands are issued prior to query execution, only the last command applies. After sending the query, **mysql** clears the attribute set.

  + If multiple attributes are defined with the same name, attempts to retrieve the attribute value have an undefined result.

  + An attribute defined with an empty name cannot be retrieved by name.

  + If a reconnect occurs while **mysql** executes the query, **mysql** restores the attributes after reconnecting so the query can be executed again with the same attributes.

* `quit`, `\q`

  Exit **mysql**.

* `rehash`, `\#`

  Rebuild the completion hash that enables database, table, and column name completion while you are entering statements. (See the description for the `--auto-rehash` option.)

* `resetconnection`, `\x`

  Reset the connection to clear the session state. This includes clearing any current query attributes defined using the `query_attributes` command.

  Resetting a connection has effects similar to `mysql_change_user()` or an auto-reconnect except that the connection is not closed and reopened, and re-authentication is not done. See mysql\_change\_user(), and Automatic Reconnection Control.

  This example shows how `resetconnection` clears a value maintained in the session state:

  ```
  mysql> SELECT LAST_INSERT_ID(3);
  +-------------------+
  | LAST_INSERT_ID(3) |
  +-------------------+
  |                 3 |
  +-------------------+

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                3 |
  +------------------+

  mysql> resetconnection;

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                0 |
  +------------------+
  ```

* `source file_name`, `\. file_name`

  Read the named file and executes the statements contained therein. On Windows, specify path name separators as `/` or `\\`.

  Quote characters are taken as part of the file name itself. For best results, the name should not include space characters.

* `ssl_session_data_print [file_name]`

  Fetches, serializes, and optionally stores the session data of a successful connection. The optional file name and arguments may be given to specify the file to store serialized session data. If omitted, the session data is printed to `stdout`.

  If the MySQL session is configured for reuse, session data from the file is deserialized and supplied to the `connect` command to reconnect. When the session is reused successfully, the `status` command contains a row showing `SSL session reused: true` while the client remains reconnected to the server.

* `status`, `\s`

  Provide status information about the connection and the server you are using. If you are running with `--safe-updates` enabled, `status` also prints the values for the **mysql** variables that affect your queries.

* `system command`, `\! command`

  Execute the given command using your default command interpreter.

  In MySQL 9.5, this command is disabled by default. You can enable it by starting the client with `--system-command=ON`.

* `tee [file_name]`, `\T [file_name]`

  By using the `--tee` option when you invoke **mysql**, you can log statements and their output. All the data displayed on the screen is appended into a given file. This can be very useful for debugging purposes also. **mysql** flushes results to the file after each statement, just before it prints its next prompt. Tee functionality works only in interactive mode.

  You can enable this feature interactively with the `tee` command. Without a parameter, the previous file is used. The `tee` file can be disabled with the `notee` command. Executing `tee` again re-enables logging.

* `use db_name`, `\u db_name`

  Use *`db_name`* as the default database.

* `warnings`, `\W`

  Enable display of warnings after each statement (if there are any).

Here are a few tips about the `pager` command:

* You can use it to write to a file and the results go only to the file:

  ```
  mysql> pager cat > /tmp/log.txt
  ```

  You can also pass any options for the program that you want to use as your pager:

  ```
  mysql> pager less -n -i -S
  ```

* In the preceding example, note the `-S` option. You may find it very useful for browsing wide query results. Sometimes a very wide result set is difficult to read on the screen. The `-S` option to **less** can make the result set much more readable because you can scroll it horizontally using the left-arrow and right-arrow keys. You can also use `-S` interactively within **less** to switch the horizontal-browse mode on and off. For more information, read the **less** manual page:

  ```
  man less
  ```

* The `-F` and `-X` options may be used with **less** to cause it to exit if output fits on one screen, which is convenient when no scrolling is necessary:

  ```
  mysql> pager less -n -i -S -F -X
  ```

* You can specify very complex pager commands for handling query output:

  ```
  mysql> pager cat | tee /dr1/tmp/res.txt \
            | tee /dr2/tmp/res2.txt | less -n -i -S
  ```

  In this example, the command would send query results to two files in two different directories on two different file systems mounted on `/dr1` and `/dr2`, yet still display the results onscreen using **less**.

You can also combine the `tee` and `pager` functions. Have a `tee` file enabled and `pager` set to **less**, and you are able to browse the results using the **less** program and still have everything appended into a file the same time. The difference between the Unix `tee` used with the `pager` command and the **mysql** built-in `tee` command is that the built-in `tee` works even if you do not have the Unix **tee** available. The built-in `tee` also logs everything that is printed on the screen, whereas the Unix **tee** used with `pager` does not log quite that much. Additionally, `tee` file logging can be turned on and off interactively from within **mysql**. This is useful when you want to log some queries to a file, but not others.

The `prompt` command reconfigures the default `mysql>` prompt. The string for defining the prompt can contain the following special sequences.

<table summary="prompt command options that are used to configure the mysql&gt; prompt."><thead><tr> <th>Option</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>\C</code></td> <td>The current connection identifier</td> </tr><tr> <td><code>\c</code></td> <td>A counter that increments for each statement you issue</td> </tr><tr> <td><code>\D</code></td> <td>The full current date</td> </tr><tr> <td><code>\d</code></td> <td>The default database</td> </tr><tr> <td><code>\h</code></td> <td>The server host</td> </tr><tr> <td><code>\l</code></td> <td>The current delimiter</td> </tr><tr> <td><code>\m</code></td> <td>Minutes of the current time</td> </tr><tr> <td><code>\n</code></td> <td>A newline character</td> </tr><tr> <td><code>\O</code></td> <td>The current month in three-letter format (Jan, Feb, …)</td> </tr><tr> <td><code>\o</code></td> <td>The current month in numeric format</td> </tr><tr> <td><code>\P</code></td> <td>am/pm</td> </tr><tr> <td><code>\p</code></td> <td>The current TCP/IP port or socket file</td> </tr><tr> <td><code>\R</code></td> <td>The current time, in 24-hour military time (0–23)</td> </tr><tr> <td><code>\r</code></td> <td>The current time, standard 12-hour time (1–12)</td> </tr><tr> <td><code>\S</code></td> <td>Semicolon</td> </tr><tr> <td><code>\s</code></td> <td>Seconds of the current time</td> </tr><tr> <td><code>\T</code></td> <td>Print an asterisk (<code>*</code>) if the current session is inside a transaction block</td> </tr><tr> <td><code>\t</code></td> <td>A tab character</td> </tr><tr> <td><code>\U</code></td> <td><p> Your full <code><em><code>user_name</code></em>@<em><code>host_name</code></em></code> account name </p></td> </tr><tr> <td><code>\u</code></td> <td>Your user name</td> </tr><tr> <td><code>\v</code></td> <td>The server version</td> </tr><tr> <td><code>\w</code></td> <td>The current day of the week in three-letter format (Mon, Tue, …)</td> </tr><tr> <td><code>\Y</code></td> <td>The current year, four digits</td> </tr><tr> <td><code>\y</code></td> <td>The current year, two digits</td> </tr><tr> <td><code>\_</code></td> <td>A space</td> </tr><tr> <td><code>\ </code></td> <td>A space (a space follows the backslash)</td> </tr><tr> <td><code>\'</code></td> <td>Single quote</td> </tr><tr> <td><code>\"</code></td> <td>Double quote</td> </tr><tr> <td><code>\\</code></td> <td>A literal <code>\</code> backslash character</td> </tr><tr> <td><code>\<em><code>x</code></em></code></td> <td><p> <em><code>x</code></em>, for any <span>“<span><em><code>x</code></em></span>”</span> not listed above </p></td> </tr></tbody></table>

You can set the prompt in several ways:

* *Use an environment variable.* You can set the `MYSQL_PS1` environment variable to a prompt string. For example:

  ```
  export MYSQL_PS1="(\u@\h) [\d]> "
  ```

* *Use a command-line option.* You can set the `--prompt` option on the command line to **mysql**. For example:

  ```
  $> mysql --prompt="(\u@\h) [\d]> "
  (user@host) [database]>
  ```

* *Use an option file.* You can set the `prompt` option in the `[mysql]` group of any MySQL option file, such as `/etc/my.cnf` or the `.my.cnf` file in your home directory. For example:

  ```
  [mysql]
  prompt=(\\u@\\h) [\\d]>\\_
  ```

  In this example, note that the backslashes are doubled. If you set the prompt using the `prompt` option in an option file, it is advisable to double the backslashes when using the special prompt options. There is some overlap in the set of permissible prompt options and the set of special escape sequences that are recognized in option files. (The rules for escape sequences in option files are listed in Section 6.2.2.2, “Using Option Files”.) The overlap may cause you problems if you use single backslashes. For example, `\s` is interpreted as a space rather than as the current seconds value. The following example shows how to define a prompt within an option file to include the current time in `hh:mm:ss>` format:

  ```
  [mysql]
  prompt="\\r:\\m:\\s> "
  ```

* *Set the prompt interactively.* You can change your prompt interactively by using the `prompt` (or `\R`) command. For example:

  ```
  mysql> prompt (\u@\h) [\d]>\_
  PROMPT set to '(\u@\h) [\d]>\_'
  (user@host) [database]>
  (user@host) [database]> prompt
  Returning to default PROMPT of mysql>
  mysql>
  ```
