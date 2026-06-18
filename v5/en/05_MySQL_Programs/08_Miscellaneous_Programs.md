## 4.8 Miscellaneous Programs

### 4.8.1 lz4\_decompress — Decompress mysqlpump LZ4-Compressed Output

The **lz4\_decompress** utility decompresses **mysqlpump** output that was created using LZ4 compression. **lz4\_decompress** was added in MySQL 5.7.10.

Invoke **lz4\_decompress** like this:

```sql
lz4_decompress input_file output_file
```

Example:

```sql
mysqlpump --compress-output=LZ4 > dump.lz4
lz4_decompress dump.lz4 dump.txt
```

To see a help message, invoke **lz4\_decompress** with no arguments.

To decompress **mysqlpump** ZLIB-compressed output, use **zlib\_decompress**. See Section 4.8.5, “zlib\_decompress — Decompress mysqlpump ZLIB-Compressed Output”.

### 4.8.2 perror — Display MySQL Error Message Information

For most system errors, MySQL displays, in addition to an internal text message, the system error code in one of the following styles:

```sql
message ... (errno: #)
message ... (Errcode: #)
```

You can find out what the error code means by examining the documentation for your system or by using the **perror** utility.

**perror** prints a description for a system error code or for a storage engine (table handler) error code.

Invoke **perror** like this:

```sql
perror [options] errorcode ...
```

Examples:

```sql
$> perror 1231
MySQL error code 1231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s' can't
be set to the value of '%-.200s'
```

```sql
$> perror 13 64
OS error code  13:  Permission denied
OS error code  64:  Machine is not on the network
```

To obtain the error message for a MySQL Cluster error code, use the **ndb\_perror** utility.

The meaning of system error messages may be dependent on your operating system. A given error code may mean different things on different operating systems.

**perror** supports the following options.

* `--help`, `--info`, `-I`, `-?`

  Display a help message and exit.

* `--ndb`

  Print the error message for an NDB Cluster error code.

  This option is deprecated in NDB 7.6.4 and later, where **perror** prints a warning if it is used, and is removed in NDB Cluster 8.0. Use the **ndb\_perror** utility instead.

* `--silent`, `-s`

  Silent mode. Print only the error message.

* `--verbose`, `-v`

  Verbose mode. Print error code and message. This is the default behavior.

* `--version`, `-V`

  Display version information and exit.

### 4.8.3 replace — A String-Replacement Utility

The **replace** utility program changes strings in place in files or on the standard input.

Note

The **replace** utility is deprecated as of MySQL 5.7.18 and is removed in MySQL 8.0.

Invoke **replace** in one of the following ways:

```sql
replace from to [from to] ... -- file_name [file_name] ...
replace from to [from to] ... < file_name
```

*`from`* represents a string to look for and *`to`* represents its replacement. There can be one or more pairs of strings.

Use the `--` option to indicate where the string-replacement list ends and the file names begin. In this case, any file named on the command line is modified in place, so you may want to make a copy of the original before converting it. *`replace`* prints a message indicating which of the input files it actually modifies.

If the `--` option is not given, **replace** reads the standard input and writes to the standard output.

**replace** uses a finite state machine to match longer strings first. It can be used to swap strings. For example, the following command swaps `a` and `b` in the given files, `file1` and `file2`:

```sql
replace a b b a -- file1 file2 ...
```

**replace** supports the following options.

* `-?`, `-I`

  Display a help message and exit.

* `-#debug_options`

  Enable debugging.

* `-s`

  Silent mode. Print less information what the program does.

* `-v`

  Verbose mode. Print more information about what the program does.

* `-V`

  Display version information and exit.

### 4.8.4 resolveip — Resolve Host name to IP Address or Vice Versa

The **resolveip** utility resolves host names to IP addresses and vice versa.

Note

**resolveip** is deprecated and is removed in MySQL 8.0. **nslookup**, **host**, or **dig** can be used instead.

Invoke **resolveip** like this:

```sql
resolveip [options] {host_name|ip-addr} ...
```

**resolveip** supports the following options.

* `--help`, `--info`, `-?`, `-I`

  Display a help message and exit.

* `--silent`, `-s`

  Silent mode. Produce less output.

* `--version`, `-V`

  Display version information and exit.

### 4.8.5 zlib\_decompress — Decompress mysqlpump ZLIB-Compressed Output

The **zlib\_decompress** utility decompresses **mysqlpump** output that was created using ZLIB compression. **zlib\_decompress** was added in MySQL 5.7.10.

Invoke **zlib\_decompress** like this:

```sql
zlib_decompress input_file output_file
```

Example:

```sql
mysqlpump --compress-output=ZLIB > dump.zlib
zlib_decompress dump.zlib dump.txt
```

To see a help message, invoke **zlib\_decompress** with no arguments.

To decompress **mysqlpump** LZ4-compressed output, use **lz4\_decompress**. See Section 4.8.1, “lz4\_decompress — Decompress mysqlpump LZ4-Compressed Output”.

