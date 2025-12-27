### 4.6.4 myisamlog — Display MyISAM Log File Contents

**myisamlog** processes the contents of a `MyISAM` log file. To create such a file, start the server with a `--log-isam=log_file` option.

Invoke **myisamlog** like this:

```sql
myisamlog [options] [file_name [tbl_name] ...]
```

The default operation is update (`-u`). If a recovery is done (`-r`), all writes and possibly updates and deletes are done and errors are only counted. The default log file name is `myisam.log` if no *`log_file`* argument is given. If tables are named on the command line, only those tables are updated.

**myisamlog** supports the following options:

* `-?`, `-I`

  Display a help message and exit.

* `-c N`

  Execute only *`N`* commands.

* `-f N`

  Specify the maximum number of open files.

* `-F filepath/`

  Specify the file path with a trailing slash.

* `-i`

  Display extra information before exiting.

* `-o offset`

  Specify the starting offset.

* `-p N`

  Remove *`N`* components from path.

* `-r`

  Perform a recovery operation.

* `-R record_pos_file record_pos`

  Specify record position file and record position.

* `-u`

  Perform an update operation.

* `-v`

  Verbose mode. Print more output about what the program does. This option can be given multiple times to produce more and more output.

* `-w write_file`

  Specify the write file.

* `-V`

  Display version information.
