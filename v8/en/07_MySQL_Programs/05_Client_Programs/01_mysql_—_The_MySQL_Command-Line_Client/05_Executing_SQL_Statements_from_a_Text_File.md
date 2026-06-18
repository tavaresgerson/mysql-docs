#### 6.5.1.5 Executing SQL Statements from a Text File

The [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client typically is used
interactively, like this:

```
mysql db_name
```

However, it is also possible to put your SQL statements in a
file and then tell [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") to read its input
from that file. To do so, create a text file
*`text_file`* that contains the
statements you wish to execute. Then invoke
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") as shown here:

```
mysql db_name < text_file
```

If you place a `USE
db_name` statement as the
first statement in the file, it is unnecessary to specify the
database name on the command line:

```
mysql < text_file
```

If you are already running [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client"), you can
execute an SQL script file using the `source`
command or `\.` command:

```
mysql> source file_name
mysql> \. file_name
```

Sometimes you may want your script to display progress
information to the user. For this you can insert statements like
this:

```
SELECT '<info_to_display>' AS ' ';
```

The statement shown outputs
`<info_to_display>`.

You can also invoke [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") with the
[`--verbose`](mysql-command-options.html#option_mysql_verbose) option, which causes
each statement to be displayed before the result that it
produces.

[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") ignores Unicode byte order mark (BOM)
characters at the beginning of input files. Previously, it read
them and sent them to the server, resulting in a syntax error.
Presence of a BOM does not cause [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") to
change its default character set. To do that, invoke
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") with an option such as
[`--default-character-set=utf8mb4`](mysql-command-options.html#option_mysql_default-character-set).

For more information about batch mode, see
[Section 5.5, “Using mysql in Batch Mode”](batch-mode.html "5.5 Using mysql in Batch Mode").