## 6.7 Program Development Utilities

6.7.1 mysql\_config — Display Options for Compiling Clients

6.7.2 my\_print\_defaults — Display Options from Option Files

This section describes some utilities that you may find useful when developing MySQL programs.

In shell scripts, you can use the **my\_print\_defaults** program to parse option files and see what options would be used by a given program. The following example shows the output that **my\_print\_defaults** might produce when asked to show the options found in the `[client]` and `[mysql]` groups:

```
$> my_print_defaults client mysql
--port=3306
--socket=/tmp/mysql.sock
--no-auto-rehash
```

Note for developers: Option file handling is implemented in the C client library simply by processing all options in the appropriate group or groups before any command-line arguments. This works well for programs that use the last instance of an option that is specified multiple times. If you have a C or C++ program that handles multiply specified options this way but that doesn't read option files, you need add only two lines to give it that capability. Check the source code of any of the standard MySQL clients to see how to do this.

Several other language interfaces to MySQL are based on the C client library, and some of them provide a way to access option file contents. These include Perl and Python. For details, see the documentation for your preferred interface.
