## 27.6 libmysqld, the Embedded MySQL Server Library

[27.6.1 Compiling Programs with libmysqld](libmysqld-compiling.html)

[27.6.2 Restrictions When Using the Embedded MySQL Server](libmysqld-restrictions.html)

[27.6.3 Options with the Embedded Server](libmysqld-options.html)

[27.6.4 Embedded Server Examples](libmysqld-example.html)

The embedded MySQL server library makes it possible to run a full-featured MySQL server inside a client application. The main benefits are increased speed and more simple management for embedded applications.

Note

The `libmysqld` embedded server library is deprecated as of MySQL 5.7.19 and is removed in MySQL 8.0.

The embedded server library is based on the client/server version of MySQL, which is written in C/C++. Consequently, the embedded server also is written in C/C++. There is no embedded server available in other languages.

The API is identical for the embedded MySQL version and the client/server version. To change a threaded application to use the embedded library, you normally only have to add calls to the following functions.

**Table 27.2 MySQL Embedded Server Library Functions**

<table summary="MySQL embedded server library functions and descriptions of when the functions should be called."><thead><tr> <th><p> Function </p></th> <th><p> When to Call </p></th> </tr></thead><tbody><tr> <td><p> <a class="ulink" href="/doc/c-api/5.7/en/mysql-library-init.html" target="_top"><code>mysql_library_init()</code></a> </p></td> <td><p> Call it before any other MySQL function is called, preferably early in the <code>main()</code> function. </p></td> </tr><tr> <td><p> <a class="ulink" href="/doc/c-api/5.7/en/mysql-library-end.html" target="_top"><code>mysql_library_end()</code></a> </p></td> <td><p> Call it before your program exits. </p></td> </tr><tr> <td><p> <a class="ulink" href="/doc/c-api/5.7/en/mysql-thread-init.html" target="_top"><code>mysql_thread_init()</code></a> </p></td> <td><p> Call it in each thread you create that accesses MySQL. </p></td> </tr><tr> <td><a class="ulink" href="/doc/c-api/5.7/en/mysql-thread-end.html" target="_top"><code>mysql_thread_end()</code></a></td> <td>Call it before calling <code>pthread_exit()</code>.</td> </tr></tbody></table>

Then, link your code with `libmysqld.a` instead of `libmysqlclient.a`. To ensure binary compatibility between your application and the server library, always compile your application against headers for the same series of MySQL that was used to compile the server library. For example, if `libmysqld` was compiled against MySQL 5.6 headers, do not compile your application against MySQL 5.7 headers, or vice versa.

Because the `mysql_library_xxx()` functions are also included in `libmysqlclient.a`, you can change between the embedded and the client/server version by just linking your application with the right library. See [mysql\_library\_init()](/doc/c-api/5.7/en/mysql-library-init.html).

One difference between the embedded server and the standalone server is that for the embedded server, authentication for connections is disabled by default.
