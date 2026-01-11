#### B.3.2.16 File Not Found and Similar Errors

If you get `ERROR 'file_name' not found (errno: 23)`, `Can't open file: file_name (errno: 24)`, or any other error with `errno 23` or `errno 24` from MySQL, it means that you have not allocated enough file descriptors for the MySQL server. You can use the **perror** utility to get a description of what the error number means:

```
$> perror 23
OS error code  23:  File table overflow
$> perror 24
OS error code  24:  Too many open files
$> perror 11
OS error code  11:  Resource temporarily unavailable
```

The problem here is that **mysqld** is trying to keep open too many files simultaneously. You can either tell **mysqld** not to open so many files at once or increase the number of file descriptors available to **mysqld**.

To tell **mysqld** to keep open fewer files at a time, you can make the table cache smaller by reducing the value of the `table_open_cache` system variable (the default value is 64). This may not entirely prevent running out of file descriptors because in some circumstances the server may attempt to extend the cache size temporarily, as described in Section 10.4.3.1, “How MySQL Opens and Closes Tables”. Reducing the value of `max_connections` also reduces the number of open files (the default value is 100).

To change the number of file descriptors available to **mysqld**, you can use the `--open-files-limit` option to **mysqld\_safe** or set the `open_files_limit` system variable. See Section 7.1.8, “Server System Variables”. The easiest way to set these values is to add an option to your option file. See Section 6.2.2.2, “Using Option Files”. If you have an old version of **mysqld** that does not support setting the open files limit, you can edit the **mysqld\_safe** script. There is a commented-out line **ulimit -n 256** in the script. You can remove the `#` character to uncomment this line, and change the number `256` to set the number of file descriptors to be made available to **mysqld**.

`--open-files-limit` and **ulimit** can increase the number of file descriptors, but only up to the limit imposed by the operating system. There is also a “hard” limit that can be overridden only if you start **mysqld\_safe** or **mysqld** as `root` (just remember that you also need to start the server with the `--user` option in this case so that it does not continue to run as `root` after it starts up). If you need to increase the operating system limit on the number of file descriptors available to each process, consult the documentation for your system.

Note

If you run the **tcsh** shell, **ulimit** does not work! **tcsh** also reports incorrect values when you ask for the current limits. In this case, you should start **mysqld\_safe** using **sh**.
