### 6.8.1 perror — Display MySQL Error Message Information

**perror** displays the error message for MySQL or operating system error codes. Invoke **perror** like this:

```
perror [options] errorcode ...
```

**perror** attempts to be flexible in understanding its arguments. For example, for the `ER_WRONG_VALUE_FOR_VAR` error, **perror** understands any of these arguments: `1231`, `001231`, `MY-1231`, or `MY-001231`, or `ER_WRONG_VALUE_FOR_VAR`.

```
$> perror 1231
MySQL error code MY-001231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s'
can't be set to the value of '%-.200s'
```

If an error number is in the range where MySQL and operating system errors overlap, **perror** displays both error messages:

```
$> perror 1 13
OS error code   1:  Operation not permitted
MySQL error code MY-000001: Can't create/write to file '%s' (OS errno %d - %s)
OS error code  13:  Permission denied
MySQL error code MY-000013: Can't get stat of '%s' (OS errno %d - %s)
```

To obtain the error message for a MySQL Cluster error code, use the **ndb_perror** utility.

The meaning of system error messages may be dependent on your operating system. A given error code may mean different things on different operating systems.

**perror** supports the following options.

* `--help`, `--info`, `-I`, `-?`

  Display a help message and exit.

* `--silent`, `-s`

  Silent mode. Print only the error message.

* `--verbose`, `-v`

  Verbose mode. Print error code and message. This is the default behavior.

* `--version`, `-V`

  Display version information and exit.
