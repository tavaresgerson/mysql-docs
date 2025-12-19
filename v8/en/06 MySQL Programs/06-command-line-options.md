#### 6.2.2.1 Using Options on the Command Line

Program options specified on the command line follow these rules:

* Options are given after the command name.
* An option argument begins with one dash or two dashes, depending on whether it is a short form or long form of the option name. Many options have both short and long forms. For example, `-?` and `--help` are the short and long forms of the option that instructs a MySQL program to display its help message.
* Option names are case-sensitive. `-v` and `-V` are both legal and have different meanings. (They are the corresponding short forms of the `--verbose` and `--version` options.)
* Some options take a value following the option name. For example, `-h localhost` or `--host=localhost` indicate the MySQL server host to a client program. The option value tells the program the name of the host where the MySQL server is running.
* For a long option that takes a value, separate the option name and the value by an `=` sign. For a short option that takes a value, the option value can immediately follow the option letter, or there can be a space between: `-hlocalhost` and `-h localhost` are equivalent. An exception to this rule is the option for specifying your MySQL password. This option can be given in long form as `--password=pass_val` or as  `--password`. In the latter case (with no password value given), the program interactively prompts you for the password. The password option also may be given in short form as `-ppass_val` or as `-p`. However, for the short form, if the password value is given, it must follow the option letter with *no intervening space*: If a space follows the option letter, the program has no way to tell whether a following argument is supposed to be the password value or some other kind of argument. Consequently, the following two commands have two completely different meanings:

  ```
  mysql -ptest
  mysql -p test
  ```

  The first command instructs  **mysql** to use a password value of `test`, but specifies no default database. The second instructs **mysql** to prompt for the password value and to use `test` as the default database.
* Within option names, dash (`-`) and underscore (`_`) may be used interchangeably in most cases, although the leading dashes *cannot* be given as underscores. For example,  `--skip-grant-tables` and `--skip_grant_tables` are equivalent.

  In this Manual, we use dashes in option names, except where underscores are significant. This is the case with, for example,  `--log-bin` and `--log_bin`, which are different options. We encourage you to do so as well.
* The MySQL server has certain command options that may be specified only at startup, and a set of system variables, some of which may be set at startup, at runtime, or both. System variable names use underscores rather than dashes, and when referenced at runtime (for example, using `SET` or  `SELECT` statements), must be written using underscores:

  ```
  SET GLOBAL general_log = ON;
  SELECT @@GLOBAL.general_log;
  ```

  At server startup, the syntax for system variables is the same as for command options, so within variable names, dashes and underscores may be used interchangeably. For example,  `--general_log=ON` and `--general-log=ON` are equivalent. (This is also true for system variables set within option files.)
* For options that take a numeric value, the value can be given with a suffix of `K`, `M`, or `G` to indicate a multiplier of 1024, 10242 or
  10243. As of MySQL 8.0.14, a suffix can also be `T`, `P`, and `E` to indicate a multiplier of 10244, 10245 or
  10246. Suffix letters can be uppercase or lowercase.

  For example, the following command tells **mysqladmin** to ping the server 1024 times, sleeping 10 seconds between each ping:

  ```
  mysqladmin --count=1K --sleep=10 ping
  ```
* When specifying file names as option values, avoid the use of the `~` shell metacharacter. It might not be interpreted as you expect.

Option values that contain spaces must be quoted when given on the command line. For example, the `--execute` (or `-e`) option can be used with  **mysql** to pass one or more semicolon-separated SQL statements to the server. When this option is used,  **mysql** executes the statements in the option value and exits. The statements must be enclosed by quotation marks. For example:

```
$> mysql -u root -p -e "SELECT VERSION();SELECT NOW()"
Enter password: ******
+------------+
| VERSION()  |
+------------+
| 8.0.19     |
+------------+
+---------------------+
| NOW()               |
+---------------------+
| 2019-09-03 10:36:48 |
+---------------------+
$>
```

::: info Note

The long form ( `--execute`) is followed by an equal sign (`=`).

:::

To use quoted values within a statement, you must either escape the inner quotation marks, or use a different type of quotation marks within the statement from those used to quote the statement itself. The capabilities of your command processor dictate your choices for whether you can use single or double quotation marks and the syntax for escaping quote characters. For example, if your command processor supports quoting with single or double quotation marks, you can use double quotation marks around the statement, and single quotation marks for any quoted values within the statement.
