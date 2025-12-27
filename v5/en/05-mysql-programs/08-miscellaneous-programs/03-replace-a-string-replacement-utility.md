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
