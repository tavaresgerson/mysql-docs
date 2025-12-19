### 6.6.10 mysqldumpslow — Summarize Slow Query Log Files

The MySQL slow query log contains information about queries that take a long time to execute (see Section 7.4.5, “The Slow Query Log”). **mysqldumpslow** parses MySQL slow query log files and summarizes their contents.

Normally,  **mysqldumpslow** groups queries that are similar except for the particular values of number and string data values. It “abstracts” these values to `N` and `'S'` when displaying summary output. To modify value abstracting behavior, use the `-a` and `-n` options.

Invoke  **mysqldumpslow** like this:

```
mysqldumpslow [options] [log_file ...]
```

Example output with no options given:

```
Reading mysql slow query log from /usr/local/mysql/data/mysqld84-slow.log
Count: 1  Time=4.32s (4s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1

Count: 3  Time=2.53s (7s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1 limit N

Count: 3  Time=2.13s (6s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t1 select * from t1
```

 **mysqldumpslow** supports the following options.

**Table 6.21 mysqldumpslow Options**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td>-a</td> <td>Do not abstract all numbers to N and strings to 'S'</td> </tr><tr><td>-n</td> <td>Abstract numbers with at least the specified digits</td> </tr><tr><td>--debug</td> <td>Write debugging information</td> </tr><tr><td>-g</td> <td>Only consider statements that match the pattern</td> </tr><tr><td>--help</td> <td>Display help message and exit</td> </tr><tr><td>-h</td> <td>Host name of the server in the log file name</td> </tr><tr><td>-i</td> <td>Name of the server instance</td> </tr><tr><td>-l</td> <td>Do not subtract lock time from total time</td> </tr><tr><td>-r</td> <td>Reverse the sort order</td> </tr><tr><td>-s</td> <td>How to sort output</td> </tr><tr><td>-t</td> <td>Display only first num queries</td> </tr><tr><td>--verbose</td> <td>Verbose mode</td> </tr></tbody></table>

*  `--help`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.
* `-a`

  Do not abstract all numbers to `N` and strings to `'S'`.
*  `--debug`, `-d`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug</code></td> </tr></tbody></table>

  Run in debug mode.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.
* `-g pattern`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Consider only queries that match the (**grep**-style) pattern.
* `-h host_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  Host name of MySQL server for `*-slow.log` file name. The value can contain a wildcard. The default is `*` (match all).
* `-i name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Name of server instance (if using **mysql.server** startup script).
* `-l`

  Do not subtract lock time from total time.
* `-n N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Abstract numbers with at least *`N`* digits within names.
* `-r`

  Reverse the sort order.
* `-s sort_type`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>at</code></td> </tr></tbody></table>

  How to sort the output. The value of *`sort_type`* should be chosen from the following list:

  + `t`, `at`: Sort by query time or average query time
  + `l`, `al`: Sort by lock time or average lock time
  + `r`, `ar`: Sort by rows sent or average rows sent
  + `c`: Sort by count

  By default,  **mysqldumpslow** sorts by average query time (equivalent to `-s at`).
* `-t N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Display only the first *`N`* queries in the output.
*  `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Verbose mode. Print more information about what the program does.
