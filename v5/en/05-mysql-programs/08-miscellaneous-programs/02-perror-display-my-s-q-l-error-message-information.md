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
