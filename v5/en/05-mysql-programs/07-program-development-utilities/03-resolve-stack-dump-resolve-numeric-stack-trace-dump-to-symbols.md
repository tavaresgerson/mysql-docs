### 4.7.3 resolve\_stack\_dump — Resolve Numeric Stack Trace Dump to Symbols

**resolve\_stack\_dump** resolves a numeric stack dump to symbols.

Note

**resolve\_stack\_dump** is deprecated and is removed in MySQL 8.0. Stack traces from official MySQL builds are always symbolized, so there is no need to use **resolve\_stack\_dump**.

Invoke **resolve\_stack\_dump** like this:

```sql
resolve_stack_dump [options] symbols_file [numeric_dump_file]
```

The symbols file should include the output from the **nm --numeric-sort mysqld** command. The numeric dump file should contain a numeric stack track from **mysqld**. If no numeric dump file is named on the command line, the stack trace is read from the standard input.

**resolve\_stack\_dump** supports the following options.

* `--help`, `-h`

  Display a help message and exit.

* `--numeric-dump-file=file_name`, `-n file_name`

  Read the stack trace from the given file.

* `--symbols-file=file_name`, `-s file_name`

  Use the given symbols file.

* `--version`, `-V`

  Display version information and exit.

For more information, see Section 5.8.1.5, “Using a Stack Trace”.
