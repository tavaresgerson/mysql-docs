### 6.8.1 perror — Display MySQL Error Message Information

[**perror**](perror.html "6.8.1 perror — Display MySQL Error Message Information") displays the error message for MySQL
or operating system error codes. Invoke
[**perror**](perror.html "6.8.1 perror — Display MySQL Error Message Information") like this:

```
perror [options] errorcode ...
```

[**perror**](perror.html "6.8.1 perror — Display MySQL Error Message Information") attempts to be flexible in
understanding its arguments. For example, for the
[`ER_WRONG_VALUE_FOR_VAR`](/doc/mysql-errors/9.5/en/server-error-reference.html#error_er_wrong_value_for_var) error,
[**perror**](perror.html "6.8.1 perror — Display MySQL Error Message Information") understands any of these arguments:
`1231`, `001231`,
`MY-1231`, or `MY-001231`, or
[`ER_WRONG_VALUE_FOR_VAR`](/doc/mysql-errors/9.5/en/server-error-reference.html#error_er_wrong_value_for_var).

```
$> perror 1231
MySQL error code MY-001231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s'
can't be set to the value of '%-.200s'
```

If an error number is in the range where MySQL and operating
system errors overlap, [**perror**](perror.html "6.8.1 perror — Display MySQL Error Message Information") displays both
error messages:

```
$> perror 1 13
OS error code   1:  Operation not permitted
MySQL error code MY-000001: Can't create/write to file '%s' (OS errno %d - %s)
OS error code  13:  Permission denied
MySQL error code MY-000013: Can't get stat of '%s' (OS errno %d - %s)
```

To obtain the error message for a MySQL Cluster error code, use
the [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "25.5.16 ndb_perror — Obtain NDB Error Message Information") utility.

The meaning of system error messages may be dependent on your
operating system. A given error code may mean different things
on different operating systems.

[**perror**](perror.html "6.8.1 perror — Display MySQL Error Message Information") supports the following options.

* [`--help`](perror.html#option_perror_help),
  [`--info`](perror.html#option_perror_help),
  `-I`, `-?`

  Display a help message and exit.

* [`--silent`](perror.html#option_perror_silent), `-s`

  Silent mode. Print only the error message.

* [`--verbose`](perror.html#option_perror_verbose),
  `-v`

  Verbose mode. Print error code and message. This is the
  default behavior.

* [`--version`](perror.html#option_perror_version),
  `-V`

  Display version information and exit.