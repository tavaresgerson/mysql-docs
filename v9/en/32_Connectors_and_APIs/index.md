# Chapter 31 Connectors and APIs

**Table of Contents**

31.1 MySQL Connector/C++

31.2 MySQL Connector/J

31.3 MySQL Connector/NET

31.4 MySQL Connector/ODBC

31.5 MySQL Connector/Python

31.6 MySQL Connector/Node.js

31.7 MySQL C API

31.8 MySQL PHP API

31.9 MySQL Perl API

31.10 MySQL Python API

31.11 MySQL Ruby APIs :   31.11.1 The MySQL/Ruby API

    31.11.2 The Ruby/MySQL API

31.12 MySQL Tcl API

31.13 MySQL Eiffel Wrapper

MySQL Connectors provide connectivity to the MySQL server for client programs. APIs provide low-level access to MySQL resources using either the classic MySQL protocol or X Protocol. Both Connectors and the APIs enable you to connect and execute MySQL statements from another language or environment, including ODBC, Java (JDBC), C++, Python, Node.js, PHP, Perl, Ruby, and C.

## MySQL Connectors

Oracle develops a number of connectors:

* Connector/C++ enables C++ applications to connect to MySQL.

* Connector/J provides driver support for connecting to MySQL from Java applications using the standard Java Database Connectivity (JDBC) API.

* Connector/NET enables developers to create .NET applications that connect to MySQL. Connector/NET implements a fully functional ADO.NET interface and provides support for use with ADO.NET aware tools. Applications that use Connector/NET can be written in any supported .NET language.

* Connector/ODBC provides driver support for connecting to MySQL using the Open Database Connectivity (ODBC) API. Support is available for ODBC connectivity from Windows, Unix, and macOS platforms.

* Connector/Python provides driver support for connecting to MySQL from Python applications using an API that is compliant with the Python DB API version 2.0. No additional Python modules or MySQL client libraries are required.

* `Connector/Node.js` provides an asynchronous API for connecting to MySQL from Node.js applications using X Protocol. Connector/Node.js supports managing database sessions and schemas, working with MySQL Document Store collections and using raw SQL statements.

## The MySQL C API

For direct access to using MySQL natively within a C application, the C API provides low-level access to the MySQL client/server protocol through the `libmysqlclient` client library. This is the primary method used to connect to an instance of the MySQL server, and is used both by MySQL command-line clients and many of the MySQL Connectors and third-party APIs detailed here.

`libmysqlclient` is included in MySQL distributions distributions.

See also MySQL C API Implementations.

To access MySQL from a C application, or to build an interface to MySQL for a language not supported by the Connectors or APIs in this chapter, the C API is where to start. A number of programmer's utilities are available to help with the process; see Section 6.7, “Program Development Utilities”.

## Third-Party MySQL APIs

The remaining APIs described in this chapter provide an interface to MySQL from specific application languages. These third-party solutions are not developed or supported by Oracle. Basic information on their usage and abilities is provided here for reference purposes only.

All the third-party language APIs are developed using one of two methods, using `libmysqlclient` or by implementing a native driver. The two solutions offer different benefits:

* Using *`libmysqlclient`* offers complete compatibility with MySQL because it uses the same libraries as the MySQL client applications. However, the feature set is limited to the implementation and interfaces exposed through `libmysqlclient` and the performance may be lower as data is copied between the native language, and the MySQL API components.

* *Native drivers* are an implementation of the MySQL network protocol entirely within the host language or environment. Native drivers are fast, as there is less copying of data between components, and they can offer advanced functionality not available through the standard MySQL API. Native drivers are also easier for end users to build and deploy because no copy of the MySQL client libraries is needed to build the native driver components.

Table 31.1, “MySQL APIs and Interfaces” lists many of the libraries and interfaces available for MySQL.

**Table 31.1 MySQL APIs and Interfaces**

<table summary="Summary of MySQL APIs and interfaces showing the environment, API, type, and related notes."><thead><tr> <th>Environment</th> <th>API</th> <th>Type</th> <th>Notes</th> </tr></thead><tbody><tr> <th>Ada</th> <td>GNU Ada MySQL Bindings</td> <td><code>libmysqlclient</code></td> <td>See MySQL Bindings for GNU Ada</td> </tr><tr> <th>C</th> <td>C API</td> <td><code>libmysqlclient</code></td> <td>See MySQL 9.5 C API Developer Guide.</td> </tr><tr> <th>C++</th> <td>Connector/C++</td> <td><code>libmysqlclient</code></td> <td>See MySQL Connector/C++ 9.5 Developer Guide.</td> </tr><tr> <th></th> <td>MySQL++</td> <td><code>libmysqlclient</code></td> <td>See MySQL++ website.</td> </tr><tr> <th></th> <td>MySQL wrapped</td> <td><code>libmysqlclient</code></td> <td>See MySQL wrapped.</td> </tr><tr> <th>Cocoa</th> <td>MySQL-Cocoa</td> <td><code>libmysqlclient</code></td> <td>Compatible with the Objective-C Cocoa environment. See http://mysql-cocoa.sourceforge.net/</td> </tr><tr> <th>D</th> <td>MySQL for D</td> <td><code>libmysqlclient</code></td> <td>See MySQL for D.</td> </tr><tr> <th>Eiffel</th> <td>Eiffel MySQL</td> <td><code>libmysqlclient</code></td> <td>See Section 31.13, “MySQL Eiffel Wrapper”.</td> </tr><tr> <th>Erlang</th> <td><code>erlang-mysql-driver</code></td> <td><code>libmysqlclient</code></td> <td>See <code>erlang-mysql-driver</code>.</td> </tr><tr> <th>Haskell</th> <td>Haskell MySQL Bindings</td> <td>Native Driver</td> <td>See Brian O'Sullivan's pure Haskell MySQL bindings.</td> </tr><tr> <th></th> <td><code>hsql-mysql</code></td> <td><code>libmysqlclient</code></td> <td>See MySQL driver for Haskell.</td> </tr><tr> <th>Java/JDBC</th> <td>Connector/J</td> <td>Native Driver</td> <td>See MySQL Connector/J Developer Guide.</td> </tr><tr> <th>Kaya</th> <td>MyDB</td> <td><code>libmysqlclient</code></td> <td>See MyDB.</td> </tr><tr> <th>Lua</th> <td>LuaSQL</td> <td><code>libmysqlclient</code></td> <td>See LuaSQL.</td> </tr><tr> <th>.NET/Mono</th> <td>Connector/NET</td> <td>Native Driver</td> <td>See MySQL Connector/NET Developer Guide.</td> </tr><tr> <th>Objective Caml</th> <td>OBjective Caml MySQL Bindings</td> <td><code>libmysqlclient</code></td> <td>See MySQL Bindings for Objective Caml.</td> </tr><tr> <th>Octave</th> <td>Database bindings for GNU Octave</td> <td><code>libmysqlclient</code></td> <td>See Database bindings for GNU Octave.</td> </tr><tr> <th>ODBC</th> <td>Connector/ODBC</td> <td><code>libmysqlclient</code></td> <td>See MySQL Connector/ODBC Developer Guide.</td> </tr><tr> <th>Perl</th> <td><code>DBI</code>/<code>DBD::mysql</code></td> <td><code>libmysqlclient</code></td> <td>See Section 31.9, “MySQL Perl API”.</td> </tr><tr> <th></th> <td><code>Net::MySQL</code></td> <td>Native Driver</td> <td>See <code>Net::MySQL</code> at CPAN</td> </tr><tr> <th>PHP</th> <td><code>mysql</code>, <code>ext/mysql</code> interface (deprecated)</td> <td><code>libmysqlclient</code></td> <td>See MySQL and PHP.</td> </tr><tr> <th></th> <td><code>mysqli</code>, <code>ext/mysqli</code> interface</td> <td><code>libmysqlclient</code></td> <td>See MySQL and PHP.</td> </tr><tr> <th></th> <td><code>PDO_MYSQL</code></td> <td><code>libmysqlclient</code></td> <td>See MySQL and PHP.</td> </tr><tr> <th></th> <td>PDO mysqlnd</td> <td>Native Driver</td> <td></td> </tr><tr> <th>Python</th> <td>Connector/Python</td> <td>Native Driver</td> <td>See MySQL Connector/Python Developer Guide.</td> </tr><tr> <th>Python</th> <td>Connector/Python C Extension</td> <td><code>libmysqlclient</code></td> <td>See MySQL Connector/Python Developer Guide.</td> </tr><tr> <th></th> <td>MySQLdb</td> <td><code>libmysqlclient</code></td> <td>See Section 31.10, “MySQL Python API”.</td> </tr><tr> <th>Ruby</th> <td>mysql2</td> <td><code>libmysqlclient</code></td> <td>Uses <code>libmysqlclient</code>. See Section 31.11, “MySQL Ruby APIs”.</td> </tr><tr> <th>Scheme</th> <td><code>Myscsh</code></td> <td><code>libmysqlclient</code></td> <td>See <code>Myscsh</code>.</td> </tr><tr> <th>SPL</th> <td><code>sql_mysql</code></td> <td><code>libmysqlclient</code></td> <td>See <code>sql_mysql</code> for SPL.</td> </tr><tr> <th>Tcl</th> <td>MySQLtcl</td> <td><code>libmysqlclient</code></td> <td>See Section 31.12, “MySQL Tcl API”.</td> </tr></tbody></table>
