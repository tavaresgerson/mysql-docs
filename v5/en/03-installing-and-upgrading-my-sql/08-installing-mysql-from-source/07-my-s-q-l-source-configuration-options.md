### 2.8.7 MySQL Source-Configuration Options

The **CMake** program provides a great deal of control over how you configure a MySQL source distribution. Typically, you do this using options on the **CMake** command line. For information about options supported by **CMake**, run either of these commands in the top-level source directory:

```sql
$> cmake . -LH

$> ccmake .
```

You can also affect **CMake** using certain environment variables. See Section 4.9, “Environment Variables”.

For boolean options, the value may be specified as `1` or `ON` to enable the option, or as `0` or `OFF` to disable the option.

Many options configure compile-time defaults that can be overridden at server startup. For example, the `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT`, and `MYSQL_UNIX_ADDR` options that configure the default installation base directory location, TCP/IP port number, and Unix socket file can be changed at server startup with the `--basedir`, `--port`, and `--socket` options for **mysqld**. Where applicable, configuration option descriptions indicate the corresponding **mysqld** startup option.

The following sections provide more information about **CMake** options.

* CMake Option Reference
* General Options
* Installation Layout Options
* Storage Engine Options
* Feature Options
* Compiler Flags
* CMake Options for Compiling NDB Cluster

#### CMake Option Reference

The following table shows the available **CMake** options. In the `Default` column, `PREFIX` stands for the value of the `CMAKE_INSTALL_PREFIX` option, which specifies the installation base directory. This value is used as the parent location for several of the installation subdirectories.

**Table 2.14 MySQL Source-Configuration Option Reference (CMake)**

<table frame="box" rules="all" summary="CMake options that are available to configure MySQL when building from source.">
   <col style="width: 30%"/>
   <col style="width: 30%"/>
   <col style="width: 20%"/>
   <col style="width: 10%"/>
   <col style="width: 10%"/>
   <thead>
      <tr>
         <th>Formats</th>
         <th>Description</th>
         <th>Default</th>
         <th>Introduced</th>
         <th>Removed</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th><code>BUILD_CONFIG</code></th>
         <td>Use same build options as official releases</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>CMAKE_BUILD_TYPE</code></th>
         <td>Type of build to produce</td>
         <td><code>RelWithDebInfo</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>CMAKE_CXX_FLAGS</code></th>
         <td>Flags for C++ Compiler</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>CMAKE_C_FLAGS</code></th>
         <td>Flags for C Compiler</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>CMAKE_INSTALL_PREFIX</code></th>
         <td>Installation base directory</td>
         <td><code>/usr/local/mysql</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>COMPILATION_COMMENT</code></th>
         <td>Comment about compilation environment</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>CPACK_MONOLITHIC_INSTALL</code></th>
         <td>Whether package build produces single file</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DEFAULT_CHARSET</code></th>
         <td>The default server character set</td>
         <td><code>latin1</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DEFAULT_COLLATION</code></th>
         <td>The default server collation</td>
         <td><code>latin1_swedish_ci</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_COND</code></th>
         <td>Exclude Performance Schema condition instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_FILE</code></th>
         <td>Exclude Performance Schema file instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_IDLE</code></th>
         <td>Exclude Performance Schema idle instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_MEMORY</code></th>
         <td>Exclude Performance Schema memory instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_METADATA</code></th>
         <td>Exclude Performance Schema metadata instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_MUTEX</code></th>
         <td>Exclude Performance Schema mutex instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_PS</code></th>
         <td>Exclude the performance schema prepared statements</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_RWLOCK</code></th>
         <td>Exclude Performance Schema rwlock instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_SOCKET</code></th>
         <td>Exclude Performance Schema socket instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_SP</code></th>
         <td>Exclude Performance Schema stored program instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_STAGE</code></th>
         <td>Exclude Performance Schema stage instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_STATEMENT</code></th>
         <td>Exclude Performance Schema statement instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_STATEMENT_DIGEST</code></th>
         <td>Exclude Performance Schema statements_digest instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_TABLE</code></th>
         <td>Exclude Performance Schema table instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_THREAD</code></th>
         <td>Exclude the performance schema thread instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DISABLE_PSI_TRANSACTION</code></th>
         <td>Exclude the performance schema transaction instrumentation</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DOWNLOAD_BOOST</code></th>
         <td>Whether to download the Boost library</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>DOWNLOAD_BOOST_TIMEOUT</code></th>
         <td>Timeout in seconds for downloading the Boost library</td>
         <td><code>600</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLED_LOCAL_INFILE</code></th>
         <td>Whether to enable LOCAL for LOAD DATA</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLED_PROFILING</code></th>
         <td>Whether to enable query profiling code</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLE_DOWNLOADS</code></th>
         <td>Whether to download optional files</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLE_DTRACE</code></th>
         <td>Whether to include DTrace support</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLE_GCOV</code></th>
         <td>Whether to include gcov support</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ENABLE_GPROF</code></th>
         <td>Enable gprof (optimized Linux builds only)</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>FORCE_UNSUPPORTED_COMPILER</code></th>
         <td>Whether to permit unsupported compilers</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>IGNORE_AIO_CHECK</code></th>
         <td>With -DBUILD_CONFIG=mysql_release, ignore libaio check</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_BINDIR</code></th>
         <td>User executables directory</td>
         <td><code>PREFIX/bin</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_DOCDIR</code></th>
         <td>Documentation directory</td>
         <td><code>PREFIX/docs</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_DOCREADMEDIR</code></th>
         <td>README file directory</td>
         <td><code>PREFIX</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_INCLUDEDIR</code></th>
         <td>Header file directory</td>
         <td><code>PREFIX/include</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_INFODIR</code></th>
         <td>Info file directory</td>
         <td><code>PREFIX/docs</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_LAYOUT</code></th>
         <td>Select predefined installation layout</td>
         <td><code>STANDALONE</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_LIBDIR</code></th>
         <td>Library file directory</td>
         <td><code>PREFIX/lib</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_MANDIR</code></th>
         <td>Manual page directory</td>
         <td><code>PREFIX/man</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_MYSQLKEYRINGDIR</code></th>
         <td>Directory for keyring_file plugin data file</td>
         <td><code>platform specific</code></td>
         <td>5.7.11</td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_MYSQLSHAREDIR</code></th>
         <td>Shared data directory</td>
         <td><code>PREFIX/share</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_MYSQLTESTDIR</code></th>
         <td>mysql-test directory</td>
         <td><code>PREFIX/mysql-test</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_PKGCONFIGDIR</code></th>
         <td>Directory for mysqlclient.pc pkg-config file</td>
         <td><code>INSTALL_LIBDIR/pkgconfig</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_PLUGINDIR</code></th>
         <td>Plugin directory</td>
         <td><code>PREFIX/lib/plugin</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SBINDIR</code></th>
         <td>Server executable directory</td>
         <td><code>PREFIX/bin</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SCRIPTDIR</code></th>
         <td>Scripts directory</td>
         <td><code>PREFIX/scripts</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SECURE_FILE_PRIVDIR</code></th>
         <td>secure_file_priv default value</td>
         <td><code>platform specific</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR</code></th>
         <td>secure_file_priv default value for libmysqld</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SHAREDIR</code></th>
         <td>aclocal/mysql.m4 installation directory</td>
         <td><code>PREFIX/share</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>INSTALL_SUPPORTFILESDIR</code></th>
         <td>Extra support files directory</td>
         <td><code>PREFIX/support-files</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MAX_INDEXES</code></th>
         <td>Maximum indexes per table</td>
         <td><code>64</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MEMCACHED_HOME</code></th>
         <td>Path to memcached; obsolete</td>
         <td><code>[none]</code></td>
         <td></td>
         <td>5.7.33</td>
      </tr>
      <tr>
         <th><code>MUTEX_TYPE</code></th>
         <td>InnoDB mutex type</td>
         <td><code>event</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQLX_TCP_PORT</code></th>
         <td>TCP/IP port number used by X Plugin</td>
         <td><code>33060</code></td>
         <td>5.7.17</td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQLX_UNIX_ADDR</code></th>
         <td>Unix socket file used by X Plugin</td>
         <td><code>/tmp/mysqlx.sock</code></td>
         <td>5.7.15</td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQL_DATADIR</code></th>
         <td>Data directory</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQL_MAINTAINER_MODE</code></th>
         <td>Whether to enable MySQL maintainer-specific development environment</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQL_PROJECT_NAME</code></th>
         <td>Windows/macOS project name</td>
         <td><code>MySQL</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQL_TCP_PORT</code></th>
         <td>TCP/IP port number</td>
         <td><code>3306</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>MYSQL_UNIX_ADDR</code></th>
         <td>Unix socket file</td>
         <td><code>/tmp/mysql.sock</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ODBC_INCLUDES</code></th>
         <td>ODBC includes directory</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>ODBC_LIB_DIR</code></th>
         <td>ODBC library directory</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>OPTIMIZER_TRACE</code></th>
         <td>Whether to support optimizer tracing</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>REPRODUCIBLE_BUILD</code></th>
         <td>Take extra care to create a build result independent of build location and time</td>
         <td></td>
         <td>5.7.19</td>
         <td></td>
      </tr>
      <tr>
         <th><code>SUNPRO_CXX_LIBRARY</code></th>
         <td>Client link library on Solaris 10+</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>SYSCONFDIR</code></th>
         <td>Option file directory</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>SYSTEMD_PID_DIR</code></th>
         <td>Directory for PID file under systemd</td>
         <td><code>/var/run/mysqld</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>SYSTEMD_SERVICE_NAME</code></th>
         <td>Name of MySQL service under systemd</td>
         <td><code>mysqld</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>TMPDIR</code></th>
         <td>tmpdir default value</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WIN_DEBUG_NO_INLINE</code></th>
         <td>Whether to disable function inlining</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITHOUT_SERVER</code></th>
         <td>Do not build the server; internal use only</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITHOUT_xxx_STORAGE_ENGINE</code></th>
         <td>Exclude storage engine xxx from build</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_ASAN</code></th>
         <td>Enable AddressSanitizer</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_ASAN_SCOPE</code></th>
         <td>Enable AddressSanitizer -fsanitize-address-use-after-scope Clang flag</td>
         <td><code>OFF</code></td>
         <td>5.7.21</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_AUTHENTICATION_LDAP</code></th>
         <td>Whether to report error if LDAP authentication plugins cannot be built</td>
         <td><code>OFF</code></td>
         <td>5.7.19</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_AUTHENTICATION_PAM</code></th>
         <td>Build PAM authentication plugin</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_AWS_SDK</code></th>
         <td>Location of Amazon Web Services software development kit</td>
         <td></td>
         <td>5.7.19</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_BOOST</code></th>
         <td>The location of the Boost library sources</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_BUNDLED_LIBEVENT</code></th>
         <td>Use bundled libevent when building ndbmemcache; obsolete</td>
         <td><code>ON</code></td>
         <td></td>
         <td>5.7.33</td>
      </tr>
      <tr>
         <th><code>WITH_BUNDLED_MEMCACHED</code></th>
         <td>Use bundled memcached when building ndbmemcache; obsolete</td>
         <td><code>ON</code></td>
         <td></td>
         <td>5.7.33</td>
      </tr>
      <tr>
         <th><code>WITH_CLASSPATH</code></th>
         <td>Classpath to use when building MySQL Cluster Connector for Java. Default is an empty string.</td>
         <td><code></code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_CLIENT_PROTOCOL_TRACING</code></th>
         <td>Build client-side protocol tracing framework</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_CURL</code></th>
         <td>Location of curl library</td>
         <td></td>
         <td>5.7.19</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_DEBUG</code></th>
         <td>Whether to include debugging support</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_DEFAULT_COMPILER_OPTIONS</code></th>
         <td>Whether to use default compiler options</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_DEFAULT_FEATURE_SET</code></th>
         <td>Whether to use default feature set</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_EDITLINE</code></th>
         <td>Which libedit/editline library to use</td>
         <td><code>bundled</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_EMBEDDED_SERVER</code></th>
         <td>Whether to build embedded server</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_EMBEDDED_SHARED_LIBRARY</code></th>
         <td>Whether to build a shared embedded server library</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_ERROR_INSERT</code></th>
         <td>Enable error injection in the NDB storage engine. Should not be used for building binaries intended for production.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_EXTRA_CHARSETS</code></th>
         <td>Which extra character sets to include</td>
         <td><code>all</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_GMOCK</code></th>
         <td>Path to googlemock distribution</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_INNODB_EXTRA_DEBUG</code></th>
         <td>Whether to include extra debugging support for InnoDB.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_INNODB_MEMCACHED</code></th>
         <td>Whether to generate memcached shared libraries.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_KEYRING_TEST</code></th>
         <td>Build the keyring test program</td>
         <td><code>OFF</code></td>
         <td>5.7.11</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_LDAP</code></th>
         <td>Internal use only</td>
         <td></td>
         <td>5.7.29</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_LIBEVENT</code></th>
         <td>Which libevent library to use</td>
         <td><code>bundled</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_LIBWRAP</code></th>
         <td>Whether to include libwrap (TCP wrappers) support</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_LZ4</code></th>
         <td>Type of LZ4 library support</td>
         <td><code>bundled</code></td>
         <td>5.7.14</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_MECAB</code></th>
         <td>Compiles MeCab</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_MSAN</code></th>
         <td>Enable MemorySanitizer</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_MSCRT_DEBUG</code></th>
         <td>Enable Visual Studio CRT memory leak tracing</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDBAPI_EXAMPLES</code></th>
         <td>Build API example programs.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDBCLUSTER</code></th>
         <td>NDB 8.0.30 and earlier: Build NDB storage engine. NDB 8.0.31 and later: Deprecated; use WITH_NDB instead</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDBCLUSTER_STORAGE_ENGINE</code></th>
         <td>Prior to NDB 8.0.31, this was for internal use only. NDB 8.0.31 and later: toggles (only) inclusion of NDBCLUSTER storage engine</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDBMTD</code></th>
         <td>Build multithreaded data node binary</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_BINLOG</code></th>
         <td>Enable binary logging by default by mysqld.</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_DEBUG</code></th>
         <td>Produce a debug build for testing or troubleshooting.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_JAVA</code></th>
         <td>Enable building of Java and ClusterJ support. Enabled by default. Supported in MySQL Cluster only.</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_PORT</code></th>
         <td>Default port used by a management server built with this option. If this option was not used to build it, the management server's default port is 1186.</td>
         <td><code>[none]</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NDB_TEST</code></th>
         <td>Include NDB API test programs.</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_NUMA</code></th>
         <td>Set NUMA memory allocation policy</td>
         <td></td>
         <td>5.7.17</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_PROTOBUF</code></th>
         <td>Which Protocol Buffers package to use</td>
         <td><code>bundled</code></td>
         <td>5.7.12</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_RAPID</code></th>
         <td>Whether to build rapid development cycle plugins</td>
         <td><code>ON</code></td>
         <td>5.7.12</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_SASL</code></th>
         <td>Internal use only</td>
         <td></td>
         <td>5.7.29</td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_SSL</code></th>
         <td>Type of SSL support</td>
         <td><code>system</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_SYSTEMD</code></th>
         <td>Enable installation of systemd support files</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_TEST_TRACE_PLUGIN</code></th>
         <td>Build test protocol trace plugin</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_UBSAN</code></th>
         <td>Enable Undefined Behavior Sanitizer</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_UNIT_TESTS</code></th>
         <td>Compile MySQL with unit tests</td>
         <td><code>ON</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_UNIXODBC</code></th>
         <td>Enable unixODBC support</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_VALGRIND</code></th>
         <td>Whether to compile in Valgrind header files</td>
         <td><code>OFF</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_ZLIB</code></th>
         <td>Type of zlib support</td>
         <td><code>bundled</code></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>WITH_xxx_STORAGE_ENGINE</code></th>
         <td>Compile storage engine xxx statically into server</td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
   </tbody>
</table>

#### General Options

* `-DBUILD_CONFIG=mysql_release`

  This option configures a source distribution with the same build options used by Oracle to produce binary distributions for official MySQL releases.

* `-DCMAKE_BUILD_TYPE=type`

  The type of build to produce:

  + `RelWithDebInfo`: Enable optimizations and generate debugging information. This is the default MySQL build type.

  + `Debug`: Disable optimizations and generate debugging information. This build type is also used if the `WITH_DEBUG` option is enabled. That is, `-DWITH_DEBUG=1` has the same effect as `-DCMAKE_BUILD_TYPE=Debug`.

* `-DCPACK_MONOLITHIC_INSTALL=bool`

  This option affects whether the **make package** operation produces multiple installation package files or a single file. If disabled, the operation produces multiple installation package files, which may be useful if you want to install only a subset of a full MySQL installation. If enabled, it produces a single file for installing everything.

#### Installation Layout Options

The `CMAKE_INSTALL_PREFIX` option indicates the base installation directory. Other options with names of the form `INSTALL_xxx` that indicate component locations are interpreted relative to the prefix and their values are relative pathnames. Their values should not include the prefix.

* `-DCMAKE_INSTALL_PREFIX=dir_name`

  The installation base directory.

  This value can be set at server startup using the `--basedir` option.

* `-DINSTALL_BINDIR=dir_name`

  Where to install user programs.

* `-DINSTALL_DOCDIR=dir_name`

  Where to install documentation.

* `-DINSTALL_DOCREADMEDIR=dir_name`

  Where to install `README` files.

* `-DINSTALL_INCLUDEDIR=dir_name`

  Where to install header files.

* `-DINSTALL_INFODIR=dir_name`

  Where to install Info files.

* `-DINSTALL_LAYOUT=name`

  Select a predefined installation layout:

  + `STANDALONE`: Same layout as used for `.tar.gz` and `.zip` packages. This is the default.

  + `RPM`: Layout similar to RPM packages.
  + `SVR4`: Solaris package layout.
  + `DEB`: DEB package layout (experimental).

  You can select a predefined layout but modify individual component installation locations by specifying other options. For example:

  ```sql
  cmake . -DINSTALL_LAYOUT=SVR4 -DMYSQL_DATADIR=/var/mysql/data
  ```

  The `INSTALL_LAYOUT` value determines the default value of the `secure_file_priv`, `keyring_encrypted_file_data`, and `keyring_file_data` system variables. See the descriptions of those variables in Section 5.1.7, “Server System Variables”, and Section 6.4.4.12, “Keyring System Variables”.

* `-DINSTALL_LIBDIR=dir_name`

  Where to install library files.

* `-DINSTALL_MANDIR=dir_name`

  Where to install manual pages.

* `-DINSTALL_MYSQLKEYRINGDIR=dir_path`

  The default directory to use as the location of the `keyring_file` plugin data file. The default value is platform specific and depends on the value of the `INSTALL_LAYOUT` **CMake** option; see the description of the `keyring_file_data` system variable in Section 5.1.7, “Server System Variables”.

  This option was added in MySQL 5.7.11.

* `-DINSTALL_MYSQLSHAREDIR=dir_name`

  Where to install shared data files.

* `-DINSTALL_MYSQLTESTDIR=dir_name`

  Where to install the `mysql-test` directory. To suppress installation of this directory, explicitly set the option to the empty value (`-DINSTALL_MYSQLTESTDIR=`).

* `-DINSTALL_PKGCONFIGDIR=dir_name`

  The directory in which to install the `mysqlclient.pc` file for use by **pkg-config**. The default value is `INSTALL_LIBDIR/pkgconfig`, unless `INSTALL_LIBDIR` ends with `/mysql`, in which case that is removed first.

* `-DINSTALL_PLUGINDIR=dir_name`

  The location of the plugin directory.

  This value can be set at server startup with the `--plugin_dir` option.

* `-DINSTALL_SBINDIR=dir_name`

  Where to install the **mysqld** server.

* `-DINSTALL_SCRIPTDIR=dir_name`

  Where to install **mysql_install_db**.

* `-DINSTALL_SECURE_FILE_PRIVDIR=dir_name`

  The default value for the `secure_file_priv` system variable. The default value is platform specific and depends on the value of the `INSTALL_LAYOUT` **CMake** option; see the description of the `secure_file_priv` system variable in Section 5.1.7, “Server System Variables”.

  To set the value for the `libmysqld` embedded server, use `INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`.

* `-DINSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR=dir_name`

  The default value for the `secure_file_priv` system variable, for the `libmysqld` embedded server.

  Note

  The `libmysqld` embedded server library is deprecated as of MySQL 5.7.19; expect it to be removed in MySQL 8.0.

* `-DINSTALL_SHAREDIR=dir_name`

  Where to install `aclocal/mysql.m4`.

* `-DINSTALL_SUPPORTFILESDIR=dir_name`

  Where to install extra support files.

* `-DMYSQL_DATADIR=dir_name`

  The location of the MySQL data directory.

  This value can be set at server startup with the `--datadir` option.

* `-DODBC_INCLUDES=dir_name`

  The location of the ODBC includes directory, which may be used while configuring Connector/ODBC.

* `-DODBC_LIB_DIR=dir_name`

  The location of the ODBC library directory, which may be used while configuring Connector/ODBC.

* `-DSYSCONFDIR=dir_name`

  The default `my.cnf` option file directory.

  This location cannot be set at server startup, but you can start the server with a given option file using the `--defaults-file=file_name` option, where *`file_name`* is the full path name to the file.

* `-DSYSTEMD_PID_DIR=dir_name`

  The name of the directory in which to create the PID file when MySQL is managed by systemd. The default is `/var/run/mysqld`; this might be changed implicitly according to the `INSTALL_LAYOUT` value.

  This option is ignored unless `WITH_SYSTEMD` is enabled.

* `-DSYSTEMD_SERVICE_NAME=name`

  The name of the MySQL service to use when MySQL is managed by **systemd**. The default is `mysqld`; this might be changed implicitly according to the `INSTALL_LAYOUT` value.

  This option is ignored unless `WITH_SYSTEMD` is enabled.

* `-DTMPDIR=dir_name`

  The default location to use for the `tmpdir` system variable. If unspecified, the value defaults to `P_tmpdir` in `<stdio.h>`.

#### Storage Engine Options

Storage engines are built as plugins. You can build a plugin as a static module (compiled into the server) or a dynamic module (built as a dynamic library that must be installed into the server using the `INSTALL PLUGIN` statement or the `--plugin-load` option before it can be used). Some plugins might not support static or dynamic building.

The `InnoDB`, `MyISAM`, `MERGE`, `MEMORY`, and `CSV` engines are mandatory (always compiled into the server) and need not be installed explicitly.

To compile a storage engine statically into the server, use `-DWITH_engine_STORAGE_ENGINE=1`. Some permissible *`engine`* values are `ARCHIVE`, `BLACKHOLE`, `EXAMPLE`, `FEDERATED`, and `PARTITION` (partitioning support). Examples:

```sql
-DWITH_ARCHIVE_STORAGE_ENGINE=1
-DWITH_BLACKHOLE_STORAGE_ENGINE=1
```

To build MySQL with support for NDB Cluster, use the `WITH_NDBCLUSTER` option.

Note

`WITH_NDBCLUSTER` is supported only when building NDB Cluster using the NDB Cluster sources. It cannot be used to enable clustering support in other MySQL source trees or distributions. In NDB Cluster source distributions, it is enabled by default. See Section 21.3.1.4, “Building NDB Cluster from Source on Linux”, and Section 21.3.2.2, “Compiling and Installing NDB Cluster from Source on Windows”, for more information.

Note

It is not possible to compile without Performance Schema support. If it is desired to compile without particular types of instrumentation, that can be done with the following **CMake** options:

```sql
DISABLE_PSI_COND
DISABLE_PSI_FILE
DISABLE_PSI_IDLE
DISABLE_PSI_MEMORY
DISABLE_PSI_METADATA
DISABLE_PSI_MUTEX
DISABLE_PSI_PS
DISABLE_PSI_RWLOCK
DISABLE_PSI_SOCKET
DISABLE_PSI_SP
DISABLE_PSI_STAGE
DISABLE_PSI_STATEMENT
DISABLE_PSI_STATEMENT_DIGEST
DISABLE_PSI_TABLE
DISABLE_PSI_THREAD
DISABLE_PSI_TRANSACTION
```

For example, to compile without mutex instrumentation, configure MySQL using `-DDISABLE_PSI_MUTEX=1`.

To exclude a storage engine from the build, use `-DWITH_engine_STORAGE_ENGINE=0`. Examples:

```sql
-DWITH_EXAMPLE_STORAGE_ENGINE=0
-DWITH_FEDERATED_STORAGE_ENGINE=0
-DWITH_PARTITION_STORAGE_ENGINE=0
```

It is also possible to exclude a storage engine from the build using `-DWITHOUT_engine_STORAGE_ENGINE=1` (but `-DWITH_engine_STORAGE_ENGINE=0` is preferred). Examples:

```sql
-DWITHOUT_EXAMPLE_STORAGE_ENGINE=1
-DWITHOUT_FEDERATED_STORAGE_ENGINE=1
-DWITHOUT_PARTITION_STORAGE_ENGINE=1
```

If neither `-DWITH_engine_STORAGE_ENGINE` nor `-DWITHOUT_engine_STORAGE_ENGINE` are specified for a given storage engine, the engine is built as a shared module, or excluded if it cannot be built as a shared module.

#### Feature Options

* `-DCOMPILATION_COMMENT=string`

  A descriptive comment about the compilation environment.

* `-DDEFAULT_CHARSET=charset_name`

  The server character set. By default, MySQL uses the `latin1` (`cp1252` West European) character set.

  *`charset_name`* may be one of `binary`, `armscii8`, `ascii`, `big5`, `cp1250`, `cp1251`, `cp1256`, `cp1257`, `cp850`, `cp852`, `cp866`, `cp932`, `dec8`, `eucjpms`, `euckr`, `gb2312`, `gbk`, `geostd8`, `greek`, `hebrew`, `hp8`, `keybcs2`, `koi8r`, `koi8u`, `latin1`, `latin2`, `latin5`, `latin7`, `macce`, `macroman`, `sjis`, `swe7`, `tis620`, `ucs2`, `ujis`, `utf8`, `utf8mb4`, `utf16`, `utf16le`, `utf32`. The permissible character sets are listed in the `cmake/character_sets.cmake` file as the value of `CHARSETS_AVAILABLE`.

  This value can be set at server startup with the `--character-set-server` option.

* `-DDEFAULT_COLLATION=collation_name`

  The server collation. By default, MySQL uses `latin1_swedish_ci`. Use the `SHOW COLLATION` statement to determine which collations are available for each character set.

  This value can be set at server startup with the `--collation_server` option.

* `-DDISABLE_PSI_COND=bool`

  Whether to exclude the Performance Schema condition instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_FILE=bool`

  Whether to exclude the Performance Schema file instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_IDLE=bool`

  Whether to exclude the Performance Schema idle instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_MEMORY=bool`

  Whether to exclude the Performance Schema memory instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_METADATA=bool`

  Whether to exclude the Performance Schema metadata instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_MUTEX=bool`

  Whether to exclude the Performance Schema mutex instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_RWLOCK=bool`

  Whether to exclude the Performance Schema rwlock instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_SOCKET=bool`

  Whether to exclude the Performance Schema socket instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_SP=bool`

  Whether to exclude the Performance Schema stored program instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_STAGE=bool`

  Whether to exclude the Performance Schema stage instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_STATEMENT=bool`

  Whether to exclude the Performance Schema statement instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_STATEMENT_DIGEST=bool`

  Whether to exclude the Performance Schema statement digest instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_TABLE=bool`

  Whether to exclude the Performance Schema table instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_PS=bool`

  Exclude the Performance Schema prepared statements instances instrumentation. The default is `OFF` (include).

* `-DDISABLE_PSI_THREAD=bool`

  Exclude the Performance Schema thread instrumentation. The default is `OFF` (include).

  Only disable threads when building without any instrumentation, because other instrumentations have a dependency on threads.

* `-DDISABLE_PSI_TRANSACTION=bool`

  Exclude the Performance Schema transaction instrumentation. The default is `OFF` (include).

* `-DDOWNLOAD_BOOST=bool`

  Whether to download the Boost library. The default is `OFF`.

  See the `WITH_BOOST` option for additional discussion about using Boost.

* `-DDOWNLOAD_BOOST_TIMEOUT=seconds`

  The timeout in seconds for downloading the Boost library. The default is 600 seconds.

  See the `WITH_BOOST` option for additional discussion about using Boost.

* `-DENABLE_DOWNLOADS=bool`

  Whether to download optional files. For example, with this option enabled, **CMake** downloads the Google Test distribution that is used by the test suite to run unit tests.

* `-DENABLE_DTRACE=bool`

  Whether to include support for DTrace probes. For information about DTrace, wee Section 5.8.4, “Tracing mysqld Using DTrace”

  This option is deprecated because support for DTrace is deprecated in MySQL 5.7 and is removed in MySQL 8.0.

* `-DENABLE_GCOV=bool`

  Whether to include **gcov** support (Linux only).

* `-DENABLE_GPROF=bool`

  Whether to enable **gprof** (optimized Linux builds only).

* `-DENABLED_LOCAL_INFILE=bool`

  This option controls the compiled-in default `LOCAL` capability for the MySQL client library. Clients that make no explicit arrangements therefore have `LOCAL` capability disabled or enabled according to the `ENABLED_LOCAL_INFILE` setting specified at MySQL build time.

  By default, the client library in MySQL binary distributions is compiled with `ENABLED_LOCAL_INFILE` disabled. (Prior to MySQL 5.7.6, it was enabled by default.) If you compile MySQL from source, configure it with `ENABLED_LOCAL_INFILE` disabled or enabled based on whether clients that make no explicit arrangements should have `LOCAL` capability disabled or enabled, respectively.

  `ENABLED_LOCAL_INFILE` controls the default for client-side `LOCAL` capability. For the server, the `local_infile` system variable controls server-side `LOCAL` capability. To explicitly cause the server to refuse or permit `LOAD DATA LOCAL` statements (regardless of how client programs and libraries are configured at build time or runtime), start **mysqld** with `--local-infile` disabled or enabled, respectively. `local_infile` can also be set at runtime. See Section 6.1.6, “Security Considerations for LOAD DATA LOCAL”.

* `-DENABLED_PROFILING=bool`

  Whether to enable query profiling code (for the `SHOW PROFILE` and `SHOW PROFILES` statements).

* `-DFORCE_UNSUPPORTED_COMPILER=bool`

  By default, **CMake** checks for minimum versions of supported compilers: Visual Studio 2013 (Windows); GCC 4.4 or Clang 3.3 (Linux); Developer Studio 12.5 (Solaris server); Developer Studio 12.2 or GCC 4.4 (Solaris client library); Clang 3.3 (macOS), Clang 3.3 (FreeBSD). To disable this check, use `-DFORCE_UNSUPPORTED_COMPILER=ON`.

* `-DIGNORE_AIO_CHECK=bool`

  If the `-DBUILD_CONFIG=mysql_release` option is given on Linux, the `libaio` library must be linked in by default. If you do not have `libaio` or do not want to install it, you can suppress the check for it by specifying `-DIGNORE_AIO_CHECK=1`.

* `-DMAX_INDEXES=num`

  The maximum number of indexes per table. The default is 64. The maximum is 255. Values smaller than 64 are ignored and the default of 64 is used.

* `-DMYSQL_MAINTAINER_MODE=bool`

  Whether to enable a MySQL maintainer-specific development environment. If enabled, this option causes compiler warnings to become errors.

* `-DMUTEX_TYPE=type`

  The mutex type used by `InnoDB`. Options include:

  + `event`: Use event mutexes. This is the default value and the original `InnoDB` mutex implementation.

  + `sys`: Use POSIX mutexes on UNIX systems. Use `CRITICAL_SECTION` objects on Windows, if available.

  + `futex`: Use Linux futexes instead of condition variables to schedule waiting threads.

* `-DMYSQLX_TCP_PORT=port_num`

  The port number on which X Plugin listens for TCP/IP connections. The default is 33060.

  This value can be set at server startup with the `mysqlx_port` system variable.

* `-DMYSQLX_UNIX_ADDR=file_name`

  The Unix socket file path on which the server listens for X Plugin socket connections. This must be an absolute path name. The default is `/tmp/mysqlx.sock`.

  This value can be set at server startup with the `mysqlx_port` system variable.

* `-DMYSQL_PROJECT_NAME=name`

  For Windows or macOS, the project name to incorporate into the project file name.

* `-DMYSQL_TCP_PORT=port_num`

  The port number on which the server listens for TCP/IP connections. The default is 3306.

  This value can be set at server startup with the `--port` option.

* `-DMYSQL_UNIX_ADDR=file_name`

  The Unix socket file path on which the server listens for socket connections. This must be an absolute path name. The default is `/tmp/mysql.sock`.

  This value can be set at server startup with the `--socket` option.

* `-DOPTIMIZER_TRACE=bool`

  Whether to support optimizer tracing. See Section 8.15, “Tracing the Optimizer”.

* `-DREPRODUCIBLE_BUILD=bool`

  For builds on Linux systems, this option controls whether to take extra care to create a build result independent of build location and time.

  This option was added in MySQL 5.7.19.

* `-DWIN_DEBUG_NO_INLINE=bool`

  Whether to disable function inlining on Windows. The default is `OFF` (inlining enabled).

* `-DWITH_ASAN=bool`

  Whether to enable the AddressSanitizer, for compilers that support it. The default is `OFF`.

* `-DWITH_ASAN_SCOPE=bool`

  Whether to enable the AddressSanitizer `-fsanitize-address-use-after-scope` Clang flag for use-after-scope detection. The default is off. To use this option, `-DWITH_ASAN` must also be enabled.

* `-DWITH_AUTHENTICATION_LDAP=bool`

  Whether to report an error if the LDAP authentication plugins cannot be built:

  + If this option is disabled (the default), the LDAP plugins are built if the required header files and libraries are found. If they are not, **CMake** displays a note about it.

  + If this option is enabled, a failure to find the required header file and libraries causes CMake to produce an error, preventing the server from being built.

  For information about LDAP authentication, see Section 6.4.1.9, “LDAP Pluggable Authentication”. This option was added in MySQL 5.7.19.

* `-DWITH_AUTHENTICATION_PAM=bool`

  Whether to build the PAM authentication plugin, for source trees that include this plugin. (See Section 6.4.1.7, “PAM Pluggable Authentication”.) If this option is specified and the plugin cannot be compiled, the build fails.

* `-DWITH_AWS_SDK=path_name`

  The location of the Amazon Web Services software development kit.

  This option was added in MySQL 5.7.19.

* `-DWITH_BOOST=path_name`

  The Boost library is required to build MySQL. These **CMake** options enable control over the library source location, and whether to download it automatically:

  + `-DWITH_BOOST=path_name` specifies the Boost library directory location. It is also possible to specify the Boost location by setting the `BOOST_ROOT` or `WITH_BOOST` environment variable.

    As of MySQL 5.7.11, `-DWITH_BOOST=system` is also permitted and indicates that the correct version of Boost is installed on the compilation host in the standard location. In this case, the installed version of Boost is used rather than any version included with a MySQL source distribution.

  + `-DDOWNLOAD_BOOST=bool` specifies whether to download the Boost source if it is not present in the specified location. The default is `OFF`.

  + `-DDOWNLOAD_BOOST_TIMEOUT=seconds` the timeout in seconds for downloading the Boost library. The default is 600 seconds.

  For example, if you normally build MySQL placing the object output in the `bld` subdirectory of your MySQL source tree, you can build with Boost like this:

  ```sql
  mkdir bld
  cd bld
  cmake .. -DDOWNLOAD_BOOST=ON -DWITH_BOOST=$HOME/my_boost
  ```

  This causes Boost to be downloaded into the `my_boost` directory under your home directory. If the required Boost version is already there, no download is done. If the required Boost version changes, the newer version is downloaded.

  If Boost is already installed locally and your compiler finds the Boost header files on its own, it may not be necessary to specify the preceding **CMake** options. However, if the version of Boost required by MySQL changes and the locally installed version has not been upgraded, you may have build problems. Using the **CMake** options should give you a successful build.

  With the above settings that allow Boost download into a specified location, when the required Boost version changes, you need to remove the `bld` folder, recreate it, and perform the **cmake** step again. Otherwise, the new Boost version might not get downloaded, and compilation might fail.

* `-DWITH_CLIENT_PROTOCOL_TRACING=bool`

  Whether to build the client-side protocol tracing framework into the client library. By default, this option is enabled.

  For information about writing protocol trace client plugins, see Writing Protocol Trace Plugins.

  See also the `WITH_TEST_TRACE_PLUGIN` option.

* `-DWITH_CURL=curl_type`

  The location of the `curl` library. *`curl_type`* can be `system` (use the system `curl` library) or a path name to the `curl` library.

  This option was added in MySQL 5.7.19.

* `-DWITH_DEBUG=bool`

  Whether to include debugging support.

  Configuring MySQL with debugging support enables you to use the `--debug="d,parser_debug"` option when you start the server. This causes the Bison parser that is used to process SQL statements to dump a parser trace to the server's standard error output. Typically, this output is written to the error log.

  Sync debug checking for the `InnoDB` storage engine is defined under `UNIV_DEBUG` and is available when debugging support is compiled in using the `WITH_DEBUG` option. When debugging support is compiled in, the `innodb_sync_debug` configuration option can be used to enable or disable `InnoDB` sync debug checking.

  As of MySQL 5.7.18, enabling `WITH_DEBUG` also enables Debug Sync. For a description of the Debug Sync facility and how to use synchronization points, see MySQL Internals: Test Synchronization.

* `-DWITH_DEFAULT_FEATURE_SET=bool`

  Whether to use the flags from `cmake/build_configurations/feature_set.cmake`.

* `-DWITH_EDITLINE=value`

  Which `libedit`/`editline` library to use. The permitted values are `bundled` (the default) and `system`.

  `WITH_EDITLINE` replaces `WITH_LIBEDIT`, which has been removed.

* `-DWITH_EMBEDDED_SERVER=bool`

  Whether to build the `libmysqld` embedded server library.

  Note

  The `libmysqld` embedded server library is deprecated as of MySQL 5.7.17 and has been removed in MySQL 8.0.

* `-DWITH_EMBEDDED_SHARED_LIBRARY=bool`

  Whether to build a shared `libmysqld` embedded server library.

  Note

  The `libmysqld` embedded server library is deprecated as of MySQL 5.7.17 and has been removed in MySQL 8.0.

* `-DWITH_EXTRA_CHARSETS=name`

  Which extra character sets to include:

  + `all`: All character sets. This is the default.

  + `complex`: Complex character sets.
  + `none`: No extra character sets.
* `-DWITH_GMOCK=path_name`

  The path to the googlemock distribution, for use with Google Test-based unit tests. The option value is the path to the distribution Zip file. Alternatively, set the `WITH_GMOCK` environment variable to the path name. It is also possible to use `-DENABLE_DOWNLOADS=1`, in which case **CMake** downloads the distribution from GitHub.

  If you build MySQL without the Google Test unit tests (by configuring wihout `WITH_GMOCK`), **CMake** displays a message indicating how to download it.

* `-DWITH_INNODB_EXTRA_DEBUG=bool`

  Whether to include extra InnoDB debugging support.

  Enabling `WITH_INNODB_EXTRA_DEBUG` turns on extra InnoDB debug checks. This option can only be enabled when `WITH_DEBUG` is enabled.

* `-DWITH_INNODB_MEMCACHED=bool`

  Whether to generate memcached shared libraries (`libmemcached.so` and `innodb_engine.so`).

* `-DWITH_KEYRING_TEST=bool`

  Whether to build the test program that accompanies the `keyring_file` plugin. The default is `OFF`. Test file source code is located in the `plugin/keyring/keyring-test` directory.

  This option was added in MySQL 5.7.11.

* `-DWITH_LDAP=value`

  Internal use only. This option was added in MySQL 5.7.29.

* `-DWITH_LIBEVENT=string`

  Which `libevent` library to use. Permitted values are `bundled` (default) and `system`. Prior to MySQL 5.7.31, if you specify `system`, the system `libevent` library is used if present, and an error occurs otherwise. In MySQL 5.7.31 and later, if `system` is specified and no system `libevent` library can be found, an error occurs regardless, and the bundled `libevent` is not used.

  The `libevent` library is required by `InnoDB` memcached and X Plugin.

* `-DWITH_LIBWRAP=bool`

  Whether to include `libwrap` (TCP wrappers) support.

* `-DWITH_LZ4=lz4_type`

  The `WITH_LZ4` option indicates the source of `zlib` support:

  + `bundled`: Use the `lz4` library bundled with the distribution. This is the default.

  + `system`: Use the system `lz4` library. If `WITH_LZ4` is set to this value, the **lz4_decompress** utility is not built. In this case, the system **lz4** command can be used instead.

* `-DWITH_MECAB={disabled|system|path_name}`

  Use this option to compile the MeCab parser. If you have installed MeCab to its default installation directory, set `-DWITH_MECAB=system`. The `system` option applies to MeCab installations performed from source or from binaries using a native package management utility. If you installed MeCab to a custom installation directory, specify the path to the MeCab installation, for example, `-DWITH_MECAB=/opt/mecab`. If the `system` option does not work, specifying the MeCab installation path should work in all cases.

  For related information, see Section 12.9.9, “MeCab Full-Text Parser Plugin”.

* `-DWITH_MSAN=bool`

  Whether to enable MemorySanitizer, for compilers that support it. The default is off.

  For this option to have an effect if enabled, all libraries linked to MySQL must also have been compiled with the option enabled.

* `-DWITH_MSCRT_DEBUG=bool`

  Whether to enable Visual Studio CRT memory leak tracing. The default is `OFF`.

* `-DWITH_NUMA=bool`

  Explicitly set the NUMA memory allocation policy. **CMake** sets the default `WITH_NUMA` value based on whether the current platform has `NUMA` support. For platforms without NUMA support, **CMake** behaves as follows:

  + With no NUMA option (the normal case), **CMake** continues normally, producing only this warning: NUMA library missing or required version not available.

  + With `-DWITH_NUMA=ON`, **CMake** aborts with this error: NUMA library missing or required version not available.

  This option was added in MySQL 5.7.17.

* `-DWITH_PROTOBUF=protobuf_type`

  Which Protocol Buffers package to use. *`protobuf_type`* can be one of the following values:

  + `bundled`: Use the package bundled with the distribution. This is the default.

  + `system`: Use the package installed on the system.

  Other values are ignored, with a fallback to `bundled`.

  This option was added in MySQL 5.7.12.

* `-DWITH_RAPID=bool`

  Whether to build the rapid development cycle plugins. When enabled, a `rapid` directory is created in the build tree containing these plugins. When disabled, no `rapid` directory is created in the build tree. The default is `ON`, unless the `rapid` directory is removed from the source tree, in which case the default becomes `OFF`. This option was added in MySQL 5.7.12.

* `-DWITH_SASL=value`

  Internal use only. This option was added in MySQL 5.7.29. Not supported on Windows.

* `-DWITH_SSL={ssl_type`|*`path_name`*}

  For support of encrypted connections, entropy for random number generation, and other encryption-related operations, MySQL must be built using an SSL library. This option specifies which SSL library to use.

  + *`ssl_type`* can be one of the following values:

    - `yes`: Use the system OpenSSL library if present, else the library bundled with the distribution.

    - `bundled`: Use the SSL library bundled with the distribution. This is the default prior to MySQL 5.7.28. As of 5.7.28, this is no longer a permitted value and the default is `system`.

    - `system`: Use the system OpenSSL library. This is the default as of MySQL 5.7.28.

  + *`path_name`* is the path name to the OpenSSL installation to use. This can be preferable to using the *`ssl_type`* value of `system` because it can prevent CMake from detecting and using an older or incorrect OpenSSL version installed on the system. (Another permitted way to do the same thing is to set `WITH_SSL` to `system` and set the `CMAKE_PREFIX_PATH` option to *`path_name`*.)

  For additional information about configuring the SSL library, see Section 2.8.6, “Configuring SSL Library Support”.

* `-DWITH_SYSTEMD=bool`

  Whether to enable installation of **systemd** support files. By default, this option is disabled. When enabled, **systemd** support files are installed, and scripts such as **mysqld_safe** and the System V initialization script are not installed. On platforms where **systemd** is not available, enabling `WITH_SYSTEMD` results in an error from **CMake**.

  For more information about using **systemd**, see Section 2.5.10, “Managing MySQL Server with systemd”. That section also includes information about specifying options otherwise specified in `[mysqld_safe]` option groups. Because **mysqld_safe** is not installed when **systemd** is used, such options must be specified another way.

* `-DWITH_TEST_TRACE_PLUGIN=bool`

  Whether to build the test protocol trace client plugin (see Using the Test Protocol Trace Plugin). By default, this option is disabled. Enabling this option has no effect unless the `WITH_CLIENT_PROTOCOL_TRACING` option is enabled. If MySQL is configured with both options enabled, the `libmysqlclient` client library is built with the test protocol trace plugin built in, and all the standard MySQL clients load the plugin. However, even when the test plugin is enabled, it has no effect by default. Control over the plugin is afforded using environment variables; see Using the Test Protocol Trace Plugin.

  Note

  Do *not* enable the `WITH_TEST_TRACE_PLUGIN` option if you want to use your own protocol trace plugins because only one such plugin can be loaded at a time and an error occurs for attempts to load a second one. If you have already built MySQL with the test protocol trace plugin enabled to see how it works, you must rebuild MySQL without it before you can use your own plugins.

  For information about writing trace plugins, see Writing Protocol Trace Plugins.

* `-DWITH_UBSAN=bool`

  Whether to enable the Undefined Behavior Sanitizer, for compilers that support it. The default is off.

* `-DWITH_UNIT_TESTS={ON|OFF}`

  If enabled, compile MySQL with unit tests. The default is `ON` unless the server is not being compiled.

* `-DWITH_UNIXODBC=1`

  Enables unixODBC support, for Connector/ODBC.

* `-DWITH_VALGRIND=bool`

  Whether to compile in the Valgrind header files, which exposes the Valgrind API to MySQL code. The default is `OFF`.

  To generate a Valgrind-aware debug build, `-DWITH_VALGRIND=1` normally is combined with `-DWITH_DEBUG=1`. See Building Debug Configurations.

* `-DWITH_ZLIB=zlib_type`

  Some features require that the server be built with compression library support, such as the `COMPRESS()` and `UNCOMPRESS()` functions, and compression of the client/server protocol. The `WITH_ZLIB` option indicates the source of `zlib` support:

  + `bundled`: Use the `zlib` library bundled with the distribution. This is the default.

  + `system`: Use the system `zlib` library.

* `-DWITHOUT_SERVER=bool`

  Whether to build without MySQL Server. The default is OFF, which does build the server.

  This is considered an experimental option; it is preferred to build with the server.

#### Compiler Flags

* `-DCMAKE_C_FLAGS="flags`"

  Flags for the C compiler.

* `-DCMAKE_CXX_FLAGS="flags`"

  Flags for the C++ compiler.

* `-DWITH_DEFAULT_COMPILER_OPTIONS=bool`

  Whether to use the flags from `cmake/build_configurations/compiler_options.cmake`.

  Note

  All optimization flags are carefully chosen and tested by the MySQL build team. Overriding them can lead to unexpected results and is done at your own risk.

* `-DSUNPRO_CXX_LIBRARY="lib_name`"

  Enable linking against `libCstd` instead of `stlport4` on Solaris 10 or later. This works only for client code because the server depends on C++98.

To specify your own C and C++ compiler flags, for flags that do not affect optimization, use the `CMAKE_C_FLAGS` and `CMAKE_CXX_FLAGS` CMake options.

When providing your own compiler flags, you might want to specify `CMAKE_BUILD_TYPE` as well.

For example, to create a 32-bit release build on a 64-bit Linux machine, do this:

```sql
$> mkdir build
$> cd build
$> cmake .. -DCMAKE_C_FLAGS=-m32 \
  -DCMAKE_CXX_FLAGS=-m32 \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo
```

If you set flags that affect optimization (`-Onumber`), you must set the `CMAKE_C_FLAGS_build_type` and/or `CMAKE_CXX_FLAGS_build_type` options, where *`build_type`* corresponds to the `CMAKE_BUILD_TYPE` value. To specify a different optimization for the default build type (`RelWithDebInfo`) set the `CMAKE_C_FLAGS_RELWITHDEBINFO` and `CMAKE_CXX_FLAGS_RELWITHDEBINFO` options. For example, to compile on Linux with `-O3` and with debug symbols, do this:

```sql
$> cmake .. -DCMAKE_C_FLAGS_RELWITHDEBINFO="-O3 -g" \
  -DCMAKE_CXX_FLAGS_RELWITHDEBINFO="-O3 -g"
```

#### CMake Options for Compiling NDB Cluster

The following options are for use when building NDB Cluster with the NDB Cluster sources; they are not currently supported when using sources from the MySQL 5.7 Server tree.

* `-DMEMCACHED_HOME=dir_name`

  `NDB` support for memcached was removed in NDB 7.5.21 and NDB 7.6.17; thus, this option is no longer supported for building `NDB` in these or later versions.

* `-DWITH_BUNDLED_LIBEVENT={ON|OFF}`

  `NDB` support for memcached was removed in NDB 7.5.21 and NDB 7.6.17, and thus this option is no longer supported for building `NDB` in these or later versions.

* `-DWITH_BUNDLED_MEMCACHED={ON|OFF}`

  `NDB` support for memcached was removed in NDB 7.5.21 and NDB 7.6.17, and thus this option is no longer supported for building `NDB` in these or later versions.

* `-DWITH_CLASSPATH=path`

  Sets the classpath for building MySQL NDB Cluster Connector for Java. The default is empty. This option is ignored if `-DWITH_NDB_JAVA=OFF` is used.

* `-DWITH_ERROR_INSERT={ON|OFF}`

  Enables error injection in the `NDB` kernel. For testing only; not intended for use in building production binaries. The default is `OFF`.

* `-DWITH_NDBAPI_EXAMPLES={ON|OFF}`

  Build NDB API example programs in `storage/ndb/ndbapi-examples/`. See NDB API Examples, for information about these.

* `-DWITH_NDBCLUSTER_STORAGE_ENGINE={ON|OFF}`

  For internal use only; may not always work as expected. To build with `NDB` support, use `WITH_NDBCLUSTER` instead.

* `-DWITH_NDBCLUSTER={ON|OFF}`

  Build and link in support for the `NDB` storage engine in **mysqld**. The default is `ON`.

* `-DWITH_NDBMTD={ON|OFF}`

  Build the multithreaded data node executable **ndbmtd**"). The default is `ON`.

* `-DWITH_NDB_BINLOG={ON|OFF}`

  Enable binary logging by default in the **mysqld** built using this option. `ON` by default.

* `-DWITH_NDB_DEBUG={ON|OFF}`

  Enable building the debug versions of the NDB Cluster binaries. This is `OFF` by default.

* `-DWITH_NDB_JAVA={ON|OFF}`

  Enable building NDB Cluster with Java support, including support for ClusterJ (see MySQL NDB Cluster Connector for Java).

  This option is `ON` by default. If you do not wish to compile NDB Cluster with Java support, you must disable it explicitly by specifying `-DWITH_NDB_JAVA=OFF` when running **CMake**. Otherwise, if Java cannot be found, configuration of the build fails.

* `-DWITH_NDB_PORT=port`

  Causes the NDB Cluster management server (**ndb_mgmd**) that is built to use this *`port`* by default. If this option is unset, the resulting management server tries to use port 1186 by default.

* `-DWITH_NDB_TEST={ON|OFF}`

  If enabled, include a set of NDB API test programs. The default is `OFF`.
