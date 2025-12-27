## 3.5 Using mysql in Batch Mode

In the previous sections, you used [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") interactively to enter statements and view the results. You can also run [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") in batch mode. To do this, put the statements you want to run in a file, then tell [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") to read its input from the file:

```sql
$> mysql < batch-file
```

If you are running [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") under Windows and have some special characters in the file that cause problems, you can do this:

```sql
C:\> mysql -e "source batch-file"
```

If you need to specify connection parameters on the command line, the command might look like this:

```sql
$> mysql -h host -u user -p < batch-file
Enter password: ********
```

When you use [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") this way, you are creating a script file, then executing the script.

If you want the script to continue even if some of the statements in it produce errors, you should use the [`--force`](mysql-command-options.html#option_mysql_force) command-line option.

Why use a script? Here are a few reasons:

* If you run a query repeatedly (say, every day or every week), making it a script enables you to avoid retyping it each time you execute it.

* You can generate new queries from existing ones that are similar by copying and editing script files.

* Batch mode can also be useful while you are developing a query, particularly for multiple-line statements or multiple-statement sequences. If you make a mistake, you do not have to retype everything. Just edit your script to correct the error, then tell [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") to execute it again.

* If you have a query that produces a lot of output, you can run the output through a pager rather than watching it scroll off the top of your screen:

  ```sql
  $> mysql < batch-file | more
  ```

* You can catch the output in a file for further processing:

  ```sql
  $> mysql < batch-file > mysql.out
  ```

* You can distribute your script to other people so that they can also run the statements.

* Some situations do not allow for interactive use, for example, when you run a query from a **cron** job. In this case, you must use batch mode.

The default output format is different (more concise) when you run [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") in batch mode than when you use it interactively. For example, the output of `SELECT DISTINCT species FROM pet` looks like this when [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") is run interactively:

```sql
+---------+
| species |
+---------+
| bird    |
| cat     |
| dog     |
| hamster |
| snake   |
+---------+
```

In batch mode, the output looks like this instead:

```sql
species
bird
cat
dog
hamster
snake
```

If you want to get the interactive output format in batch mode, use [**mysql -t**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"). To echo to the output the statements that are executed, use [**mysql -v**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

You can also use scripts from the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") prompt by using the `source` command or `\.` command:

```sql
mysql> source filename;
mysql> \. filename
```

See [Section 4.5.1.5, “Executing SQL Statements from a Text File”](mysql-batch-commands.html "4.5.1.5 Executing SQL Statements from a Text File"), for more information.
