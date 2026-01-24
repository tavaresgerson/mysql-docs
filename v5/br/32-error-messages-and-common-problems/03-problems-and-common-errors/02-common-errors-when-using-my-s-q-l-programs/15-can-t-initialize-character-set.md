#### B.3.2.15 Can't initialize character set

You might see an error like this if you have character set problems:

```sql
MySQL Connection Failed: Can't initialize character set charset_name
```

This error can have any of the following causes:

* The character set is a multibyte character set and you have no support for the character set in the client. In this case, you need to recompile the client by running **CMake** with the [`-DDEFAULT_CHARSET=charset_name`](source-configuration-options.html#option_cmake_default_charset) or [`-DWITH_EXTRA_CHARSETS=charset_name`](source-configuration-options.html#option_cmake_with_extra_charsets) option. See [Section 2.8.7, “MySQL Source-Configuration Options”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options").

  All standard MySQL binaries are compiled with [`-DWITH_EXTRA_CHARSETS=complex`](source-configuration-options.html#option_cmake_with_extra_charsets), which enables support for all multibyte character sets. See [Section 2.8.7, “MySQL Source-Configuration Options”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options").

* The character set is a simple character set that is not compiled into [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), and the character set definition files are not in the place where the client expects to find them.

  In this case, you need to use one of the following methods to solve the problem:

  + Recompile the client with support for the character set. See [Section 2.8.7, “MySQL Source-Configuration Options”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options").

  + Specify to the client the directory where the character set definition files are located. For many clients, you can do this with the `--character-sets-dir` option.

  + Copy the character definition files to the path where the client expects them to be.
