### 4.7.3 resolve\_stack\_dump — Resolve Numeric Stack Trace Dump to Symbols

[**resolve\_stack\_dump**](resolve-stack-dump.html "4.7.3 resolve_stack_dump — Resolve Numeric Stack Trace Dump to Symbols") resolves a numeric stack
dump to symbols.

Note

[**resolve\_stack\_dump**](resolve-stack-dump.html "4.7.3 resolve_stack_dump — Resolve Numeric Stack Trace Dump to Symbols") is deprecated and is
removed in MySQL 8.0. Stack traces from official
MySQL builds are always symbolized, so there is no need to use
[**resolve\_stack\_dump**](resolve-stack-dump.html "4.7.3 resolve_stack_dump — Resolve Numeric Stack Trace Dump to Symbols").

Invoke [**resolve\_stack\_dump**](resolve-stack-dump.html "4.7.3 resolve_stack_dump — Resolve Numeric Stack Trace Dump to Symbols") like this:

```sql
resolve_stack_dump [options] symbols_file [numeric_dump_file]
```

The symbols file should include the output from the **nm
--numeric-sort mysqld** command. The numeric dump file
should contain a numeric stack track from
[`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server"). If no numeric dump file is named on
the command line, the stack trace is read from the standard
input.

[**resolve\_stack\_dump**](resolve-stack-dump.html "4.7.3 resolve_stack_dump — Resolve Numeric Stack Trace Dump to Symbols") supports the following
options.

* [`--help`](resolve-stack-dump.html#option_resolve_stack_dump_help),
  `-h`

  Display a help message and exit.

* [`--numeric-dump-file=file_name`](resolve-stack-dump.html#option_resolve_stack_dump_numeric-dump-file),
  `-n file_name`

  Read the stack trace from the given file.

* [`--symbols-file=file_name`](resolve-stack-dump.html#option_resolve_stack_dump_symbols-file),
  `-s file_name`

  Use the given symbols file.

* [`--version`](resolve-stack-dump.html#option_resolve_stack_dump_version),
  `-V`

  Display version information and exit.

For more information, see [Section 5.8.1.5, “Using a Stack Trace”](using-stack-trace.html "5.8.1.5 Using a Stack Trace").