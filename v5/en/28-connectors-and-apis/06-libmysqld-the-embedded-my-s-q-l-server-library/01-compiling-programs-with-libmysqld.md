### 27.6.1 Compiling Programs with libmysqld

In precompiled binary MySQL distributions that include `libmysqld`, the embedded server library, MySQL builds the library using the appropriate vendor compiler if there is one.

To get a `libmysqld` library if you build MySQL from source yourself, you should configure MySQL with the [`-DWITH_EMBEDDED_SERVER=1`](source-configuration-options.html#option_cmake_with_embedded_server) option. See [Section 2.8.7, “MySQL Source-Configuration Options”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options").

When you link your program with `libmysqld`, you must also include the system-specific `pthread` libraries and some libraries that the MySQL server uses. You can get the full list of libraries by executing [**mysql_config --libmysqld-libs**](mysql-config.html "4.7.1 mysql_config — Display Options for Compiling Clients").

The correct flags for compiling and linking a threaded program must be used, even if you do not directly call any thread functions in your code.

To compile a C program to include the necessary files to embed the MySQL server library into an executable version of a program, the compiler needs to know where to find various files and needs instructions on how to compile the program. The following example shows how a program could be compiled from the command line, assuming that you are using **gcc**, use the GNU C compiler:

```sql
gcc mysql_test.c -o mysql_test \
`/usr/local/mysql/bin/mysql_config --include --libmysqld-libs`
```

Immediately following the **gcc** command is the name of the C program source file. After it, the `-o` option is given to indicate that the file name that follows is the name that the compiler is to give to the output file, the compiled program. The next line of code tells the compiler to obtain the location of the include files and libraries and other settings for the system on which it is compiled. The [**mysql_config**](mysql-config.html "4.7.1 mysql_config — Display Options for Compiling Clients") command is contained in backticks, not single quotation marks.

On some non-**gcc** platforms, the embedded library depends on C++ runtime libraries and linking against the embedded library might result in missing-symbol errors. To solve this, link using a C++ compiler or explicitly list the required libraries on the link command line.
