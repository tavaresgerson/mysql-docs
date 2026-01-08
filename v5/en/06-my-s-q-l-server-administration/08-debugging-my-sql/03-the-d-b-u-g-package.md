### 5.8.3 The DBUG Package

The MySQL server and most MySQL clients are compiled with the `DBUG` package originally created by Fred Fish. When you have configured MySQL for debugging, this package makes it possible to get a trace file of what the program is doing. See [Section 5.8.1.2, “Creating Trace Files”](making-trace-files.html "5.8.1.2 Creating Trace Files").

This section summarizes the argument values that you can specify in debug options on the command line for MySQL programs that have been built with debugging support.

The `DBUG` package can be used by invoking a program with the `--debug[=debug_options]` or `-# [debug_options]` option. If you specify the `--debug` or `-#` option without a *`debug_options`* value, most MySQL programs use a default value. The server default is `d:t:i:o,/tmp/mysqld.trace` on Unix and `d:t:i:O,\mysqld.trace` on Windows. The effect of this default is:

* `d`: Enable output for all debug macros
* `t`: Trace function calls and exits
* `i`: Add PID to output lines
* `o,/tmp/mysqld.trace`, `O,\mysqld.trace`: Set the debug output file.

Most client programs use a default *`debug_options`* value of `d:t:o,/tmp/program_name.trace`, regardless of platform.

Here are some example debug control strings as they might be specified on a shell command line:

```sql
--debug=d:t
--debug=d:f,main,subr1:F:L:t,20
--debug=d,input,output,files:n
--debug=d:t:i:O,\\mysqld.trace
```

For [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), it is also possible to change `DBUG` settings at runtime by setting the [`debug`](server-system-variables.html#sysvar_debug) system variable. This variable has global and session values:

```sql
mysql> SET GLOBAL debug = 'debug_options';
mysql> SET SESSION debug = 'debug_options';
```

Changing the global [`debug`](server-system-variables.html#sysvar_debug) value requires privileges sufficient to set global system variables. Changing the session [`debug`](server-system-variables.html#sysvar_debug) value requires privileges sufficient to set restricted session system variables. See [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

The *`debug_options`* value is a sequence of colon-separated fields:

```sql
field_1:field_2:...:field_N
```

Each field within the value consists of a mandatory flag character, optionally preceded by a `+` or `-` character, and optionally followed by a comma-separated list of modifiers:

```sql
[+|-]flag[,modifier,modifier,...,modifier]
```

The following table describes the permitted flag characters. Unrecognized flag characters are silently ignored.

<table frame="all" summary="Descriptions of permitted debug_options flag characters."><col style="width: 8%"/><col style="width: 92%"/><thead><tr> <th><p> Flag </p></th> <th><p> Description </p></th> </tr></thead><tbody><tr> <td><p> <code>d</code> </p></td> <td><p> Enable output from <code>DBUG_<em class="replaceable"><code>XXX</code></em></code> macros for the current state. May be followed by a list of keywords, which enables output only for the <code>DBUG</code> macros with that keyword. An empty list of keywords enables output for all macros. </p><p> In MySQL, common debug macro keywords to enable are <code>enter</code>, <code>exit</code>, <code>error</code>, <code>warning</code>, <code>info</code>, and <code>loop</code>. </p></td> </tr><tr> <td><p> <code>D</code> </p></td> <td><p> Delay after each debugger output line. The argument is the delay, in tenths of seconds, subject to machine capabilities. For example, <code>D,20</code> specifies a delay of two seconds. </p></td> </tr><tr> <td><p> <code>f</code> </p></td> <td><p> Limit debugging, tracing, and profiling to the list of named functions. An empty list enables all functions. The appropriate <code>d</code> or <code>t</code> flags must still be given; this flag only limits their actions if they are enabled. </p></td> </tr><tr> <td><p> <code>F</code> </p></td> <td><p> Identify the source file name for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code>i</code> </p></td> <td><p> Identify the process with the PID or thread ID for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code>L</code> </p></td> <td><p> Identify the source file line number for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code>n</code> </p></td> <td><p> Print the current function nesting depth for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code>N</code> </p></td> <td><p> Number each line of debug output. </p></td> </tr><tr> <td><p> <code>o</code> </p></td> <td><p> Redirect the debugger output stream to the specified file. The default output is <code>stderr</code>. </p></td> </tr><tr> <td><p> <code>O</code> </p></td> <td><p> Like <code>o</code>, but the file is really flushed between each write. When needed, the file is closed and reopened between each write. </p></td> </tr><tr> <td><p> <code>a</code> </p></td> <td><p> Like <code>o</code>, but opens for append. </p></td> </tr><tr> <td><p> <code>A</code> </p></td> <td><p> Like <code>O</code>, but opens for append. </p></td> </tr><tr> <td><p> <code>p</code> </p></td> <td><p> Limit debugger actions to specified processes. A process must be identified with the <code>DBUG_PROCESS</code> macro and match one in the list for debugger actions to occur. </p></td> </tr><tr> <td><p> <code>P</code> </p></td> <td><p> Print the current process name for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code>r</code> </p></td> <td><p> When pushing a new state, do not inherit the previous state's function nesting level. Useful when the output is to start at the left margin. </p></td> </tr><tr> <td><p> <code>t</code> </p></td> <td><p> Enable function call/exit trace lines. May be followed by a list (containing only one modifier) giving a numeric maximum trace level, beyond which no output occurs for either debugging or tracing macros. The default is a compile time option. </p></td> </tr><tr> <td><p> <code>T</code> </p></td> <td><p> Print the current timestamp for every line of output. </p></td> </tr></tbody></table>

The leading `+` or `-` character and trailing list of modifiers are used for flag characters such as `d` or `f` that can enable a debug operation for all applicable modifiers or just some of them:

* With no leading `+` or `-`, the flag value is set to exactly the modifier list as given.

* With a leading `+` or `-`, the modifiers in the list are added to or subtracted from the current modifier list.

The following examples show how this works for the `d` flag. An empty `d` list enabled output for all debug macros. A nonempty list enables output only for the macro keywords in the list.

These statements set the `d` value to the modifier list as given:

```sql
mysql> SET debug = 'd';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+
mysql> SET debug = 'd,error,warning';
mysql> SELECT @@debug;
+-----------------+
| @@debug         |
+-----------------+
| d,error,warning |
+-----------------+
```

A leading `+` or `-` adds to or subtracts from the current `d` value:

```sql
mysql> SET debug = '+d,loop';
mysql> SELECT @@debug;
+----------------------+
| @@debug              |
+----------------------+
| d,error,warning,loop |
+----------------------+
mysql> SET debug = '-d,error,loop';
mysql> SELECT @@debug;
+-----------+
| @@debug   |
+-----------+
| d,warning |
+-----------+
```

Adding to “all macros enabled” results in no change:

```sql
mysql> SET debug = 'd';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+
mysql> SET debug = '+d,loop';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+
```

Disabling all enabled macros disables the `d` flag entirely:

```sql
mysql> SET debug = 'd,error,loop';
mysql> SELECT @@debug;
+--------------+
| @@debug      |
+--------------+
| d,error,loop |
+--------------+
mysql> SET debug = '-d,error,loop';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
|         |
+---------+
```
