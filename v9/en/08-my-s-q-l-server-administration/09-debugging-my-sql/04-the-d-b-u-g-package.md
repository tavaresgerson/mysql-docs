### 7.9.4 The DBUG Package

The MySQL server and most MySQL clients are compiled with the `DBUG` package originally created by Fred Fish. When you have configured MySQL for debugging, this package makes it possible to get a trace file of what the program is doing. See Section 7.9.1.2, “Creating Trace Files”.

This section summarizes the argument values that you can specify in debug options on the command line for MySQL programs that have been built with debugging support.

The `DBUG` package can be used by invoking a program with the `--debug[=debug_options]` or `-# [debug_options]` option. If you specify the `--debug` or `-#` option without a *`debug_options`* value, most MySQL programs use a default value. The server default is `d:t:i:o,/tmp/mysqld.trace` on Unix and `d:t:i:O,\mysqld.trace` on Windows. The effect of this default is:

* `d`: Enable output for all debug macros
* `t`: Trace function calls and exits
* `i`: Add PID to output lines
* `o,/tmp/mysqld.trace`, `O,\mysqld.trace`: Set the debug output file.

Most client programs use a default *`debug_options`* value of `d:t:o,/tmp/program_name.trace`, regardless of platform.

Here are some example debug control strings as they might be specified on a shell command line:

```
--debug=d:t
--debug=d:f,main,subr1:F:L:t,20
--debug=d,input,output,files:n
--debug=d:t:i:O,\\mysqld.trace
```

For **mysqld**, it is also possible to change DBUG settings at runtime by setting the `debug` system variable. This variable has global and session values:

```
mysql> SET GLOBAL debug = 'debug_options';
mysql> SET SESSION debug = 'debug_options';
```

Changing the global `debug` value requires privileges sufficient to set global system variables. Changing the session `debug` value requires privileges sufficient to set restricted session system variables. See Section 7.1.9.1, “System Variable Privileges”.

The *`debug_options`* value is a sequence of colon-separated fields:

```
field_1:field_2:...:field_N
```

Each field within the value consists of a mandatory flag character, optionally preceded by a `+` or `-` character, and optionally followed by a comma-separated list of modifiers:

```
[+|-]flag[,modifier,modifier,...,modifier]
```

The following table describes the permitted flag characters. Unrecognized flag characters are silently ignored.

<table frame="all" summary="Descriptions of permitted debug_options flag characters."><col style="width: 8%"/><col style="width: 92%"/><thead><tr> <th><p> Flag </p></th> <th><p> Description </p></th> </tr></thead><tbody><tr> <td><p> <code class="literal">d</code> </p></td> <td><p> Enable output from <code class="literal">DBUG_<em class="replaceable"><code>XXX</code></em></code> macros for the current state. May be followed by a list of keywords, which enables output only for the DBUG macros with that keyword. An empty list of keywords enables output for all macros. </p><p> In MySQL, common debug macro keywords to enable are <code class="literal">enter</code>, <code class="literal">exit</code>, <code class="literal">error</code>, <code class="literal">warning</code>, <code class="literal">info</code>, and <code class="literal">loop</code>. </p></td> </tr><tr> <td><p> <code class="literal">D</code> </p></td> <td><p> Delay after each debugger output line. The argument is the delay, in tenths of seconds, subject to machine capabilities. For example, <code class="literal">D,20</code> specifies a delay of two seconds. </p></td> </tr><tr> <td><p> <code class="literal">f</code> </p></td> <td><p> Limit debugging, tracing, and profiling to the list of named functions. An empty list enables all functions. The appropriate <code class="literal">d</code> or <code class="literal">t</code> flags must still be given; this flag only limits their actions if they are enabled. </p></td> </tr><tr> <td><p> <code class="literal">F</code> </p></td> <td><p> Identify the source file name for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code class="literal">i</code> </p></td> <td><p> Identify the process with the PID or thread ID for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code class="literal">L</code> </p></td> <td><p> Identify the source file line number for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code class="literal">n</code> </p></td> <td><p> Print the current function nesting depth for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code class="literal">N</code> </p></td> <td><p> Number each line of debug output. </p></td> </tr><tr> <td><p> <code class="literal">o</code> </p></td> <td><p> Redirect the debugger output stream to the specified file. The default output is <code class="literal">stderr</code>. </p></td> </tr><tr> <td><p> <code class="literal">O</code> </p></td> <td><p> Like <code class="literal">o</code>, but the file is really flushed between each write. When needed, the file is closed and reopened between each write. </p></td> </tr><tr> <td><p> <code class="literal">a</code> </p></td> <td><p> Like <code class="literal">o</code>, but opens for append. </p></td> </tr><tr> <td><p> <code class="literal">A</code> </p></td> <td><p> Like <code class="literal">O</code>, but opens for append. </p></td> </tr><tr> <td><p> <code class="literal">p</code> </p></td> <td><p> Limit debugger actions to specified processes. A process must be identified with the <code class="literal">DBUG_PROCESS</code> macro and match one in the list for debugger actions to occur. </p></td> </tr><tr> <td><p> <code class="literal">P</code> </p></td> <td><p> Print the current process name for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code class="literal">r</code> </p></td> <td><p> When pushing a new state, do not inherit the previous state's function nesting level. Useful when the output is to start at the left margin. </p></td> </tr><tr> <td><p> <code class="literal">t</code> </p></td> <td><p> Enable function call/exit trace lines. May be followed by a list (containing only one modifier) giving a numeric maximum trace level, beyond which no output occurs for either debugging or tracing macros. The default is a compile time option. </p></td> </tr><tr> <td><p> <code class="literal">T</code> </p></td> <td><p> Print the current timestamp for every line of output. </p></td> </tr></tbody></table>

The leading `+` or `-` character and trailing list of modifiers are used for flag characters such as `d` or `f` that can enable a debug operation for all applicable modifiers or just some of them:

* With no leading `+` or `-`, the flag value is set to exactly the modifier list as given.

* With a leading `+` or `-`, the modifiers in the list are added to or subtracted from the current modifier list.

The following examples show how this works for the `d` flag. An empty `d` list enabled output for all debug macros. A nonempty list enables output only for the macro keywords in the list.

These statements set the `d` value to the modifier list as given:

```
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

```
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

```
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

```
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
