### 2.8.7 MySQL Source-Configuration Options

The **CMake** program provides a great deal of control over how you configure a MySQL source distribution. Typically, you do this using options on the **CMake** command line. For information about options supported by **CMake**, run either of these commands in the top-level source directory:

```
$> cmake . -LH

$> ccmake .
```

You can also affect **CMake** using certain environment variables. See Section 6.9, “Environment Variables”.

For boolean options, the value may be specified as `1` or `ON` to enable the option, or as `0` or `OFF` to disable the option.

Many options configure compile-time defaults that can be overridden at server startup. For example, the `CMAKE_INSTALL_PREFIX`, `MYSQL_TCP_PORT`, and `MYSQL_UNIX_ADDR` options that configure the default installation base directory location, TCP/IP port number, and Unix socket file can be changed at server startup with the  `--basedir`, `--port`, and `--socket` options for **mysqld**. Where applicable, configuration option descriptions indicate the corresponding  **mysqld** startup option.

The following sections provide more information about **CMake** options.

*  CMake Option Reference
*  General Options
*  Installation Layout Options
*  Storage Engine Options
*  Feature Options
*  Compiler Flags
*  CMake Options for Compiling NDB Cluster

#### CMake Option Reference

The following table shows the available **CMake** options. In the `Default` column, `PREFIX` stands for the value of the `CMAKE_INSTALL_PREFIX` option, which specifies the installation base directory. This value is used as the parent location for several of the installation subdirectories.

**Table 2.15 MySQL Source-Configuration Option Reference (CMake)**

<table><col style="width: 37%"/><col style="width: 37%"/><col style="width: 25%"/><thead><tr><th scope="col">Formats</th> <th scope="col">Description</th> <th scope="col">Default</th> </tr></thead><tbody><tr><th><code>ADD_GDB_INDEX</code></th> <td>Whether to enable generation of .gdb_index section in binaries</td> <td></td> </tr><tr><th><code>BUILD_CONFIG</code></th> <td>Use same build options as official releases</td> <td></td> </tr><tr><th><code>BUNDLE_RUNTIME_LIBRARIES</code></th> <td>Bundle runtime libraries with server MSI and Zip packages for Windows</td> <td><code>OFF</code></td> </tr><tr><th><code>CMAKE_BUILD_TYPE</code></th> <td>Type of build to produce</td> <td><code>RelWithDebInfo</code></td> </tr><tr><th><code>CMAKE_CXX_FLAGS</code></th> <td>Flags for C++ Compiler</td> <td></td> </tr><tr><th><code>CMAKE_C_FLAGS</code></th> <td>Flags for C Compiler</td> <td></td> </tr><tr><th><code>CMAKE_INSTALL_PREFIX</code></th> <td>Installation base directory</td> <td><code>/usr/local/mysql</code></td> </tr><tr><th><code>COMPILATION_COMMENT</code></th> <td>Comment about compilation environment</td> <td></td> </tr><tr><th><code>COMPILATION_COMMENT_SERVER</code></th> <td>Comment about compilation environment for use by mysqld</td> <td></td> </tr><tr><th><code>COMPRESS_DEBUG_SECTIONS</code></th> <td>Compress debug sections of binary executables</td> <td><code>OFF</code></td> </tr><tr><th><code>CPACK_MONOLITHIC_INSTALL</code></th> <td>Whether package build produces single file</td> <td><code>OFF</code></td> </tr><tr><th><code>DEFAULT_CHARSET</code></th> <td>The default server character set</td> <td><code>utf8mb4</code></td> </tr><tr><th><code>DEFAULT_COLLATION</code></th> <td>The default server collation</td> <td><code>utf8mb4_0900_ai_ci</code></td> </tr><tr><th><code>DISABLE_PSI_COND</code></th> <td>Exclude Performance Schema condition instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_DATA_LOCK</code></th> <td>Exclude the performance schema data lock instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_ERROR</code></th> <td>Exclude the performance schema server error instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_FILE</code></th> <td>Exclude Performance Schema file instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_IDLE</code></th> <td>Exclude Performance Schema idle instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_MEMORY</code></th> <td>Exclude Performance Schema memory instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_METADATA</code></th> <td>Exclude Performance Schema metadata instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_MUTEX</code></th> <td>Exclude Performance Schema mutex instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_PS</code></th> <td>Exclude the performance schema prepared statements</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_RWLOCK</code></th> <td>Exclude Performance Schema rwlock instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_SOCKET</code></th> <td>Exclude Performance Schema socket instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_SP</code></th> <td>Exclude Performance Schema stored program instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_STAGE</code></th> <td>Exclude Performance Schema stage instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_STATEMENT</code></th> <td>Exclude Performance Schema statement instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_STATEMENT_DIGEST</code></th> <td>Exclude Performance Schema statements_digest instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_TABLE</code></th> <td>Exclude Performance Schema table instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_THREAD</code></th> <td>Exclude the performance schema thread instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>DISABLE_PSI_TRANSACTION</code></th> <td>Exclude the performance schema transaction instrumentation</td> <td><code>OFF</code></td> </tr><tr><th><code>ENABLED_LOCAL_INFILE</code></th> <td>Whether to enable LOCAL for LOAD DATA</td> <td><code>OFF</code></td> </tr><tr><th><code>ENABLED_PROFILING</code></th> <td>Whether to enable query profiling code</td> <td><code>ON</code></td> </tr><tr><th><code>ENABLE_EXPERIMENTAL_SYSVARS</code></th> <td>Whether to enabled experimental InnoDB system variables</td> <td><code>OFF</code></td> </tr><tr><th><code>ENABLE_GCOV</code></th> <td>Whether to include gcov support</td> <td></td> </tr><tr><th><code>ENABLE_GPROF</code></th> <td>Enable gprof (optimized Linux builds only)</td> <td><code>OFF</code></td> </tr><tr><th><code>FORCE_COLORED_OUTPUT</code></th> <td>Whether to colorize compiler output</td> <td><code>OFF</code></td> </tr><tr><th><code>FORCE_INSOURCE_BUILD</code></th> <td>Whether to force an in-source build</td> <td><code>OFF</code></td> </tr><tr><th><code>FORCE_UNSUPPORTED_COMPILER</code></th> <td>Whether to permit unsupported compilers</td> <td><code>OFF</code></td> </tr><tr><th><code>FPROFILE_GENERATE</code></th> <td>Whether to generate profile guided optimization data</td> <td><code>OFF</code></td> </tr><tr><th><code>FPROFILE_USE</code></th> <td>Whether to use profile guided optimization data</td> <td><code>OFF</code></td> </tr><tr><th><code>HAVE_PSI_MEMORY_INTERFACE</code></th> <td>Enable performance schema memory tracing module for memory allocation functions used in dynamic storage of over-aligned types</td> <td><code>OFF</code></td> </tr><tr><th><code>IGNORE_AIO_CHECK</code></th> <td>With -DBUILD_CONFIG=mysql_release, ignore libaio check</td> <td><code>OFF</code></td> </tr><tr><th><code>INSTALL_BINDIR</code></th> <td>User executables directory</td> <td><code>PREFIX/bin</code></td> </tr><tr><th><code>INSTALL_DOCDIR</code></th> <td>Documentation directory</td> <td><code>PREFIX/docs</code></td> </tr><tr><th><code>INSTALL_DOCREADMEDIR</code></th> <td>README file directory</td> <td><code>PREFIX</code></td> </tr><tr><th><code>INSTALL_INCLUDEDIR</code></th> <td>Header file directory</td> <td><code>PREFIX/include</code></td> </tr><tr><th><code>INSTALL_INFODIR</code></th> <td>Info file directory</td> <td><code>PREFIX/docs</code></td> </tr><tr><th><code>INSTALL_LAYOUT</code></th> <td>Select predefined installation layout</td> <td><code>STANDALONE</code></td> </tr><tr><th><code>INSTALL_LIBDIR</code></th> <td>Library file directory</td> <td><code>PREFIX/lib</code></td> </tr><tr><th><code>INSTALL_MANDIR</code></th> <td>Manual page directory</td> <td><code>PREFIX/man</code></td> </tr><tr><th><code>INSTALL_MYSQLSHAREDIR</code></th> <td>Shared data directory</td> <td><code>PREFIX/share</code></td> </tr><tr><th><code>INSTALL_MYSQLTESTDIR</code></th> <td>mysql-test directory</td> <td><code>PREFIX/mysql-test</code></td> </tr><tr><th><code>INSTALL_PKGCONFIGDIR</code></th> <td>Directory for mysqlclient.pc pkg-config file</td> <td><code>INSTALL_LIBDIR/pkgconfig</code></td> </tr><tr><th><code>INSTALL_PLUGINDIR</code></th> <td>Plugin directory</td> <td><code>PREFIX/lib/plugin</code></td> </tr><tr><th><code>INSTALL_PRIV_LIBDIR</code></th> <td>Installation private library directory</td> <td></td> </tr><tr><th><code>INSTALL_SBINDIR</code></th> <td>Server executable directory</td> <td><code>PREFIX/bin</code></td> </tr><tr><th><code>INSTALL_SECURE_FILE_PRIVDIR</code></th> <td>secure_file_priv default value</td> <td><code>platform specific</code></td> </tr><tr><th><code>INSTALL_SHAREDIR</code></th> <td>aclocal/mysql.m4 installation directory</td> <td><code>PREFIX/share</code></td> </tr><tr><th><code>INSTALL_STATIC_LIBRARIES</code></th> <td>Whether to install static libraries</td> <td><code>ON</code></td> </tr><tr><th><code>INSTALL_SUPPORTFILESDIR</code></th> <td>Extra support files directory</td> <td><code>PREFIX/support-files</code></td> </tr><tr><th><code>LINK_RANDOMIZE</code></th> <td>Whether to randomize order of symbols in mysqld binary</td> <td><code>OFF</code></td> </tr><tr><th><code>LINK_RANDOMIZE_SEED</code></th> <td>Seed value for LINK_RANDOMIZE option</td> <td><code>mysql</code></td> </tr><tr><th><code>MAX_INDEXES</code></th> <td>Maximum indexes per table</td> <td><code>64</code></td> </tr><tr><th><code>MSVC_CPPCHECK</code></th> <td>Enable MSVC code analysis.</td> <td><code>ON</code></td> </tr><tr><th><code>MUTEX_TYPE</code></th> <td>InnoDB mutex type</td> <td><code>event</code></td> </tr><tr><th><code>MYSQLX_TCP_PORT</code></th> <td>TCP/IP port number used by X Plugin</td> <td><code>33060</code></td> </tr><tr><th><code>MYSQLX_UNIX_ADDR</code></th> <td>Unix socket file used by X Plugin</td> <td><code>/tmp/mysqlx.sock</code></td> </tr><tr><th><code>MYSQL_DATADIR</code></th> <td>Data directory</td> <td></td> </tr><tr><th><code>MYSQL_MAINTAINER_MODE</code></th> <td>Whether to enable MySQL maintainer-specific development environment</td> <td><code>OFF</code></td> </tr><tr><th><code>MYSQL_PROJECT_NAME</code></th> <td>Windows/macOS project name</td> <td><code>MySQL</code></td> </tr><tr><th><code>MYSQL_TCP_PORT</code></th> <td>TCP/IP port number</td> <td><code>3306</code></td> </tr><tr><th><code>MYSQL_UNIX_ADDR</code></th> <td>Unix socket file</td> <td><code>/tmp/mysql.sock</code></td> </tr><tr><th><code>NDB_UTILS_LINK_DYNAMIC</code></th> <td>Cause NDB tools to be dynamically linked to ndbclient</td> <td></td> </tr><tr><th><code>ODBC_INCLUDES</code></th> <td>ODBC includes directory</td> <td></td> </tr><tr><th><code>ODBC_LIB_DIR</code></th> <td>ODBC library directory</td> <td></td> </tr><tr><th><code>OPTIMIZER_TRACE</code></th> <td>Whether to support optimizer tracing</td> <td></td> </tr><tr><th><code>OPTIMIZE_SANITIZER_BUILDS</code></th> <td>Whether to optimize sanitizer builds</td> <td><code>ON</code></td> </tr><tr><th><code>REPRODUCIBLE_BUILD</code></th> <td>Take extra care to create a build result independent of build location and time</td> <td></td> </tr><tr><th><code>SHOW_SUPPRESSED_COMPILER_WARNING</code></th> <td>Whether to show suppressed compiler warnings and not fail with -Werror.</td> <td><code>OFF</code></td> </tr><tr><th><code>SYSCONFDIR</code></th> <td>Option file directory</td> <td></td> </tr><tr><th><code>SYSTEMD_PID_DIR</code></th> <td>Directory for PID file under systemd</td> <td><code>/var/run/mysqld</code></td> </tr><tr><th><code>SYSTEMD_SERVICE_NAME</code></th> <td>Name of MySQL service under systemd</td> <td><code>mysqld</code></td> </tr><tr><th><code>TMPDIR</code></th> <td>tmpdir default value</td> <td></td> </tr><tr><th><code>WIN_DEBUG_NO_INLINE</code></th> <td>Whether to disable function inlining</td> <td><code>OFF</code></td> </tr><tr><th><code>WITHOUT_SERVER</code></th> <td>Do not build the server; internal use only</td> <td><code>OFF</code></td> </tr><tr><th><code>WITHOUT_xxx_STORAGE_ENGINE</code></th> <td>Exclude storage engine xxx from build</td> <td></td> </tr><tr><th><code>WITH_ANT</code></th> <td>Path to Ant for building GCS Java wrapper</td> <td></td> </tr><tr><th><code>WITH_ASAN</code></th> <td>Enable AddressSanitizer</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_ASAN_SCOPE</code></th> <td>Enable AddressSanitizer -fsanitize-address-use-after-scope Clang flag</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_AUTHENTICATION_CLIENT_PLUGINS</code></th> <td>Enabled automatically if any corresponding server authentication plugins are built</td> <td></td> </tr><tr><th><code>WITH_AUTHENTICATION_LDAP</code></th> <td>Whether to report error if LDAP authentication plugins cannot be built</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_AUTHENTICATION_PAM</code></th> <td>Build PAM authentication plugin</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_AWS_SDK</code></th> <td>Location of Amazon Web Services software development kit</td> <td></td> </tr><tr><th><code>WITH_BUILD_ID</code></th> <td>On Linux systems, generate a unique build ID</td> <td><code>ON</code></td> </tr><tr><th><code>WITH_CLASSPATH</code></th> <td>Classpath to use when building MySQL Cluster Connector for Java. Default is an empty string.</td> <td><code></code></td> </tr><tr><th><code>WITH_CLIENT_PROTOCOL_TRACING</code></th> <td>Build client-side protocol tracing framework</td> <td><code>ON</code></td> </tr><tr><th><code>WITH_CURL</code></th> <td>Location of curl library</td> <td></td> </tr><tr><th><code>WITH_DEBUG</code></th> <td>Whether to include debugging support</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_DEFAULT_COMPILER_OPTIONS</code></th> <td>Whether to use default compiler options</td> <td><code>ON</code></td> </tr><tr><th><code>WITH_DEVELOPER_ENTITLEMENTS</code></th> <td>Whether to add the 'get-task-allow' entitlement to all executables on macOS to generate a core dump in the event of an unexpected server halt</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_EDITLINE</code></th> <td>Which libedit/editline library to use</td> <td><code>bundled</code></td> </tr><tr><th><code>WITH_ERROR_INSERT</code></th> <td>Enable error injection in the NDB storage engine. Should not be used for building binaries intended for production.</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_ICU</code></th> <td>Type of ICU support</td> <td><code>bundled</code></td> </tr><tr><th><code>WITH_INNODB_EXTRA_DEBUG</code></th> <td>Whether to include extra debugging support for InnoDB.</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_JEMALLOC</code></th> <td>Whether to link with -ljemalloc</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_LD</code></th> <td>Whether to use the LLVM lld or mold linker</td> <td><code></code></td> </tr><tr><th><code>WITH_LIBEVENT</code></th> <td>Which libevent library to use</td> <td><code>bundled</code></td> </tr><tr><th><code>WITH_LIBWRAP</code></th> <td>Whether to include libwrap (TCP wrappers) support</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_LOCK_ORDER</code></th> <td>Whether to enable LOCK_ORDER tooling</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_LSAN</code></th> <td>Whether to run LeakSanitizer, without AddressSanitizer</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_LTO</code></th> <td>Enable link-time optimizer</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_LZ4</code></th> <td>Type of LZ4 library support</td> <td><code>bundled</code></td> </tr><tr><th><code>WITH_MECAB</code></th> <td>Compiles MeCab</td> <td></td> </tr><tr><th><code>WITH_MSAN</code></th> <td>Enable MemorySanitizer</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_MSCRT_DEBUG</code></th> <td>Enable Visual Studio CRT memory leak tracing</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_MYSQLX</code></th> <td>Whether to disable X Protocol</td> <td><code>ON</code></td> </tr><tr><th><code>WITH_NDB</code></th> <td>Build MySQL NDB Cluster, including NDB storage engine and all NDB programs</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_NDBAPI_EXAMPLES</code></th> <td>Build API example programs.</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_NDBCLUSTER</code></th> <td>NDB 8.0.30 and earlier: Build NDB storage engine. NDB 8.0.31 and later: Deprecated; use WITH_NDB instead</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_NDBCLUSTER_STORAGE_ENGINE</code></th> <td>Prior to NDB 8.0.31, this was for internal use only. NDB 8.0.31 and later: toggles (only) inclusion of NDBCLUSTER storage engine</td> <td><code>ON</code></td> </tr><tr><th><code>WITH_NDBMTD</code></th> <td>Build multithreaded data node binary</td> <td><code>ON</code></td> </tr><tr><th><code>WITH_NDB_DEBUG</code></th> <td>Produce a debug build for testing or troubleshooting.</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_NDB_JAVA</code></th> <td>Enable building of Java and ClusterJ support. Enabled by default. Supported in MySQL Cluster only.</td> <td><code>ON</code></td> </tr><tr><th><code>WITH_NDB_PORT</code></th> <td>Default port used by a management server built with this option. If this option was not used to build it, the management server's default port is 1186.</td> <td><code>[none]</code></td> </tr><tr><th><code>WITH_NDB_TEST</code></th> <td>Include NDB API test programs.</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_NDB_TLS_SEARCH_PATH</code></th> <td>Default path used by NDB programs to search for TLS certificate and key files.</td> <td><code>$HOME/ndb-tls</code></td> </tr><tr><th><code>WITH_NUMA</code></th> <td>Set NUMA memory allocation policy</td> <td></td> </tr><tr><th><code>WITH_PACKAGE_FLAGS</code></th> <td>For flags typically used for RPM/DEB packages, whether to add them to standalone builds on those platforms</td> <td></td> </tr><tr><th><code>WITH_PROTOBUF</code></th> <td>Which Protocol Buffers package to use</td> <td><code>bundled</code></td> </tr><tr><th><code>WITH_RAPID</code></th> <td>Whether to build rapid development cycle plugins</td> <td><code>ON</code></td> </tr><tr><th><code>WITH_RAPIDJSON</code></th> <td>Type of RapidJSON support</td> <td><code>bundled</code></td> </tr><tr><th><code>WITH_ROUTER</code></th> <td>Whether to build MySQL Router</td> <td><code>ON</code></td> </tr><tr><th><code>WITH_SASL</code></th> <td>Internal use only</td> <td></td> </tr><tr><th><code>WITH_SHOW_PARSE_TREE</code></th> <td>Support for SHOW PARSE_TREE debugging statement</td> <td></td> </tr><tr><th><code>WITH_SSL</code></th> <td>Type of SSL support</td> <td><code>system</code></td> </tr><tr><th><code>WITH_SYSTEMD</code></th> <td>Enable installation of systemd support files</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_SYSTEMD_DEBUG</code></th> <td>Enable additional systemd debug information</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_SYSTEM_LIBS</code></th> <td>Set system value of library options not set explicitly</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_TCMALLOC</code></th> <td>Whether to link with -ltcmalloc. BUNDLED is supported on Linux only</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_TEST_TRACE_PLUGIN</code></th> <td>Build test protocol trace plugin</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_TSAN</code></th> <td>Enable ThreadSanitizer</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_UBSAN</code></th> <td>Enable Undefined Behavior Sanitizer</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_UNIT_TESTS</code></th> <td>Compile MySQL with unit tests</td> <td><code>ON</code></td> </tr><tr><th><code>WITH_UNIXODBC</code></th> <td>Enable unixODBC support</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_VALGRIND</code></th> <td>Whether to compile in Valgrind header files</td> <td><code>OFF</code></td> </tr><tr><th><code>WITH_WIN_JEMALLOC</code></th> <td>Path to directory containing jemalloc.dll</td> <td></td> </tr><tr><th><code>WITH_ZLIB</code></th> <td>Type of zlib support</td> <td><code>bundled</code></td> </tr><tr><th><code>WITH_ZSTD</code></th> <td>Type of zstd support</td> <td><code>bundled</code></td> </tr><tr><th><code>WITH_xxx_STORAGE_ENGINE</code></th> <td>Compile storage engine xxx statically into server</td> <td></td> </tr></tbody></table>

#### General Options

*  `-DBUILD_CONFIG=mysql_release`

  This option configures a source distribution with the same build options used by Oracle to produce binary distributions for official MySQL releases.
*  `-DWITH_BUILD_ID=bool`

  On Linux systems, generates a unique build ID which is used as the value of the `build_id` system variable and written to the MySQL server log on startup. Set this option to `OFF` to disable this feature.

  This option has no effect on platforms other than Linux.
*  `-DBUNDLE_RUNTIME_LIBRARIES=bool`

  Whether to bundle runtime libraries with server MSI and Zip packages for Windows.
*  `-DCMAKE_BUILD_TYPE=type`

  The type of build to produce:

  + `RelWithDebInfo`: Enable optimizations and generate debugging information. This is the default MySQL build type.
  + `Release`: Enable optimizations but omit debugging information to reduce the build size.
  + `Debug`: Disable optimizations and generate debugging information. This build type is also used if the  `WITH_DEBUG` option is enabled. That is, `-DWITH_DEBUG=1` has the same effect as `-DCMAKE_BUILD_TYPE=Debug`.

  The option values `None` and `MinSizeRel` are not supported.
*  `-DCPACK_MONOLITHIC_INSTALL=bool`

  This option affects whether the **make package** operation produces multiple installation package files or a single file. If disabled, the operation produces multiple installation package files, which may be useful if you want to install only a subset of a full MySQL installation. If enabled, it produces a single file for installing everything.
*  `-DFORCE_INSOURCE_BUILD=bool`

  Defines whether to force an in-source build. Out-of-source builds are recommended, as they permit multiple builds from the same source, and cleanup can be performed quickly by removing the build directory. To force an in-source build, invoke **CMake** with `-DFORCE_INSOURCE_BUILD=ON`.
*  `-DFORCE_COLORED_OUTPUT=bool`

  Defines whether to enable colorized compiler output for **gcc** and **clang** when compiling on the command line. Defaults to `OFF`.

#### Installation Layout Options

The  `CMAKE_INSTALL_PREFIX` option indicates the base installation directory. Other options with names of the form `INSTALL_xxx` that indicate component locations are interpreted relative to the prefix and their values are relative pathnames. Their values should not include the prefix.

*  `-DCMAKE_INSTALL_PREFIX=dir_name`

  The installation base directory.

  This value can be set at server startup using the `--basedir` option.
*  `-DINSTALL_BINDIR=dir_name`

  Where to install user programs.
*  `-DINSTALL_DOCDIR=dir_name`

  Where to install documentation.
*  `-DINSTALL_DOCREADMEDIR=dir_name`

  Where to install `README` files.
*  `-DINSTALL_INCLUDEDIR=dir_name`

  Where to install header files.
*  `-DINSTALL_INFODIR=dir_name`

  Where to install Info files.
*  `-DINSTALL_LAYOUT=name`

  Select a predefined installation layout:

  + `STANDALONE`: Same layout as used for `.tar.gz` and `.zip` packages. This is the default.
  + `RPM`: Layout similar to RPM packages.
  + `SVR4`: Solaris package layout.
  + `DEB`: DEB package layout (experimental).

  You can select a predefined layout but modify individual component installation locations by specifying other options. For example:

  ```
  cmake . -DINSTALL_LAYOUT=SVR4 -DMYSQL_DATADIR=/var/mysql/data
  ```

  The  `INSTALL_LAYOUT` value determines the default value of the `secure_file_priv` system variable. See the description of this variable in Section 7.1.8, “Server System Variables”.
*  `-DINSTALL_LIBDIR=dir_name`

  Where to install library files.
*  `-DINSTALL_MANDIR=dir_name`

  Where to install manual pages.
*  `-DINSTALL_MYSQLSHAREDIR=dir_name`

  Where to install shared data files.
*  `-DINSTALL_MYSQLTESTDIR=dir_name`

  Where to install the `mysql-test` directory. To suppress installation of this directory, explicitly set the option to the empty value ( `-DINSTALL_MYSQLTESTDIR=`).
*  `-DINSTALL_PKGCONFIGDIR=dir_name`

  The directory in which to install the `mysqlclient.pc` file for use by **pkg-config**. The default value is `INSTALL_LIBDIR/pkgconfig`, unless `INSTALL_LIBDIR` ends with `/mysql`, in which case that is removed first.
*  `-DINSTALL_PLUGINDIR=dir_name`

  The location of the plugin directory.

  This value can be set at server startup with the `--plugin_dir` option.
*  `-DINSTALL_PRIV_LIBDIR=dir_name`

  The location of the dynamic library directory.

  **Default location.** For RPM builds, this is `/usr/lib64/mysql/private/`, for DEB it is `/usr/lib/mysql/private/`, and for TAR it is `lib/private/`.

  **Protobuf.** Because this is a private location, the loader (such as `ld-linux.so` on Linux) may not find the `libprotobuf.so` files without help. To guide the loader, `RPATH=$ORIGIN/../$INSTALL_PRIV_LIBDIR` is added to  **mysqld** and **mysqlxtest**. This works for most cases but when using the Resource Group feature,  **mysqld** is `setsuid`, and the loader ignores any `RPATH` which contains `$ORIGIN`. To overcome this, an explicit full path to the directory is set in the DEB and RPM versions of  **mysqld**, since the target destination is known. For tarball installs, patching of **mysqld** with a tool like **patchelf** is required.
*  `-DINSTALL_SBINDIR=dir_name`

  Where to install the  **mysqld** server.
*  `-DINSTALL_SECURE_FILE_PRIVDIR=dir_name`

  The default value for the `secure_file_priv` system variable. The default value is platform specific and depends on the value of the `INSTALL_LAYOUT` **CMake** option; see the description of the `secure_file_priv` system variable in  Section 7.1.8, “Server System Variables”.
*  `-DINSTALL_SHAREDIR=dir_name`

  Where to install `aclocal/mysql.m4`.
*  `-DINSTALL_STATIC_LIBRARIES=bool`

  Whether to install static libraries. The default is `ON`. If set to `OFF`, these library files are not installed: `libmysqlclient.a`, `libmysqlservices.a`.
*  `-DINSTALL_SUPPORTFILESDIR=dir_name`

  Where to install extra support files.
*  `-DLINK_RANDOMIZE=bool`

  Whether to randomize the order of symbols in the **mysqld** binary. The default is `OFF`. This option should be enabled only for debugging purposes.
*  `-DLINK_RANDOMIZE_SEED=val`

  Seed value for the `LINK_RANDOMIZE` option. The value is a string. The default is `mysql`, an arbitrary choice.
*  `-DMYSQL_DATADIR=dir_name`

  The location of the MySQL data directory.

  This value can be set at server startup with the `--datadir` option.
*  `-DODBC_INCLUDES=dir_name`

  The location of the ODBC includes directory, which may be used while configuring Connector/ODBC.
*  `-DODBC_LIB_DIR=dir_name`

  The location of the ODBC library directory, which may be used while configuring Connector/ODBC.
*  `-DSYSCONFDIR=dir_name`

  The default `my.cnf` option file directory.

  This location cannot be set at server startup, but you can start the server with a given option file using the `--defaults-file=file_name` option, where *`file_name`* is the full path name to the file.
*  `-DSYSTEMD_PID_DIR=dir_name`

  The name of the directory in which to create the PID file when MySQL is managed by systemd. The default is `/var/run/mysqld`; this might be changed implicitly according to the `INSTALL_LAYOUT` value.

  This option is ignored unless `WITH_SYSTEMD` is enabled.
*  `-DSYSTEMD_SERVICE_NAME=name`

  The name of the MySQL service to use when MySQL is managed by **systemd**. The default is `mysqld`; this might be changed implicitly according to the `INSTALL_LAYOUT` value.

  This option is ignored unless `WITH_SYSTEMD` is enabled.
*  `-DTMPDIR=dir_name`

  The default location to use for the `tmpdir` system variable. If unspecified, the value defaults to `P_tmpdir` in `<stdio.h>`.

#### Storage Engine Options

Storage engines are built as plugins. You can build a plugin as a static module (compiled into the server) or a dynamic module (built as a dynamic library that must be installed into the server using the  `INSTALL PLUGIN` statement or the  `--plugin-load` option before it can be used). Some plugins might not support static or dynamic building.

The  `InnoDB`, `MyISAM`, `MERGE`, `MEMORY`, and `CSV` engines are mandatory (always compiled into the server) and need not be installed explicitly.

To compile a storage engine statically into the server, use `-DWITH_engine_STORAGE_ENGINE=1`. Some permissible *`engine`* values are `ARCHIVE`, `BLACKHOLE`, `EXAMPLE`, and `FEDERATED`. Examples:

```
-DWITH_ARCHIVE_STORAGE_ENGINE=1
-DWITH_BLACKHOLE_STORAGE_ENGINE=1
```

To build MySQL with support for NDB Cluster, use the `WITH_NDB` option.

::: info Note

It is not possible to compile without Performance Schema support. If it is desired to compile without particular types of instrumentation, that can be done with the following **CMake** options:

```
DISABLE_PSI_COND
DISABLE_PSI_DATA_LOCK
DISABLE_PSI_ERROR
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

:::

To exclude a storage engine from the build, use `-DWITH_engine_STORAGE_ENGINE=0`. Examples:

```
-DWITH_ARCHIVE_STORAGE_ENGINE=0
-DWITH_EXAMPLE_STORAGE_ENGINE=0
-DWITH_FEDERATED_STORAGE_ENGINE=0
```

It is also possible to exclude a storage engine from the build using `-DWITHOUT_engine_STORAGE_ENGINE=1` (but `-DWITH_engine_STORAGE_ENGINE=0` is preferred). Examples:

```
-DWITHOUT_ARCHIVE_STORAGE_ENGINE=1
-DWITHOUT_EXAMPLE_STORAGE_ENGINE=1
-DWITHOUT_FEDERATED_STORAGE_ENGINE=1
```

If neither `-DWITH_engine_STORAGE_ENGINE` nor `-DWITHOUT_engine_STORAGE_ENGINE` are specified for a given storage engine, the engine is built as a shared module, or excluded if it cannot be built as a shared module.

#### Feature Options

*  `-DADD_GDB_INDEX=bool`

  This option determines whether to enable generation of a `.gdb_index` section in binaries, which makes loading them in a debugger faster. The option is disabled by default. **lld** linker is used, and is disabled by It has no effect if a linker other than **lld** or GNU **gold** is used.
*  `-DCOMPILATION_COMMENT=string`

  A descriptive comment about the compilation environment. While  **mysqld** uses `COMPILATION_COMMENT_SERVER`, other programs use `COMPILATION_COMMENT`.
*  `-DCOMPRESS_DEBUG_SECTIONS=bool`

  Whether to compress the debug sections of binary executables (Linux only). Compressing executable debug sections saves space at the cost of extra CPU time during the build process.

  The default is `OFF`. If this option is not set explicitly but the `COMPRESS_DEBUG_SECTIONS` environment variable is set, the option takes its value from that variable.
*  `-DCOMPILATION_COMMENT_SERVER=string`

  A descriptive comment about the compilation environment for use by  **mysqld** (for example, to set the `version_comment` system variable). Programs other than the server use `COMPILATION_COMMENT`.
*  `-DDEFAULT_CHARSET=charset_name`

  The server character set. By default, MySQL uses the `utf8mb4` character set.

  *`charset_name`* may be one of `binary`, `armscii8`, `ascii`, `big5`, `cp1250`, `cp1251`, `cp1256`, `cp1257`, `cp850`, `cp852`, `cp866`, `cp932`, `dec8`, `eucjpms`, `euckr`, `gb2312`, `gbk`, `geostd8`, `greek`, `hebrew`, `hp8`, `keybcs2`, `koi8r`, `koi8u`, `latin1`, `latin2`, `latin5`, `latin7`, `macce`, `macroman`, `sjis`, `swe7`, `tis620`, `ucs2`, `ujis`, `utf8mb3`, `utf8mb4`, `utf16`, `utf16le`, `utf32`.

  This value can be set at server startup with the `--character-set-server` option.
*  `-DDEFAULT_COLLATION=collation_name`

  The server collation. By default, MySQL uses `utf8mb4_0900_ai_ci`. Use the `SHOW COLLATION` statement to determine which collations are available for each character set.

  This value can be set at server startup with the `--collation_server` option.
*  `-DDISABLE_PSI_COND=bool`

  Whether to exclude the Performance Schema condition instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_FILE=bool`

  Whether to exclude the Performance Schema file instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_IDLE=bool`

  Whether to exclude the Performance Schema idle instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_MEMORY=bool`

  Whether to exclude the Performance Schema memory instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_METADATA=bool`

  Whether to exclude the Performance Schema metadata instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_MUTEX=bool`

  Whether to exclude the Performance Schema mutex instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_RWLOCK=bool`

  Whether to exclude the Performance Schema rwlock instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_SOCKET=bool`

  Whether to exclude the Performance Schema socket instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_SP=bool`

  Whether to exclude the Performance Schema stored program instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_STAGE=bool`

  Whether to exclude the Performance Schema stage instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_STATEMENT=bool`

  Whether to exclude the Performance Schema statement instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_STATEMENT_DIGEST=bool`

  Whether to exclude the Performance Schema statement digest instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_TABLE=bool`

  Whether to exclude the Performance Schema table instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_PS=bool`

  Exclude the Performance Schema prepared statements instances instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_THREAD=bool`

  Exclude the Performance Schema thread instrumentation. The default is `OFF` (include).

  Only disable threads when building without any instrumentation, because other instrumentations have a dependency on threads.
*  `-DDISABLE_PSI_TRANSACTION=bool`

  Exclude the Performance Schema transaction instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_DATA_LOCK=bool`

  Exclude the performance schema data lock instrumentation. The default is `OFF` (include).
*  `-DDISABLE_PSI_ERROR=bool`

  Exclude the performance schema server error instrumentation. The default is `OFF` (include).
*  `-DENABLE_EXPERIMENTAL_SYSVARS=bool`

  Whether to enable experimental `InnoDB` system variables. Experimental system variables are intended for those engaged in MySQL development, should only be used in a development or test environment, and may be removed without notice in a future MySQL release. For information about experimental system variables, refer to `/storage/innobase/handler/ha_innodb.cc` in the MySQL source tree. Experimental system variables can be identified by searching for “PLUGIN_VAR_EXPERIMENTAL”.
*  `-DENABLE_GCOV=bool`

  Whether to include **gcov** support (Linux only).
*  `-DENABLE_GPROF=bool`

  Whether to enable **gprof** (optimized Linux builds only).
*  `-DENABLED_LOCAL_INFILE=bool`

  This option controls the compiled-in default `LOCAL` capability for the MySQL client library. Clients that make no explicit arrangements therefore have `LOCAL` capability disabled or enabled according to the `ENABLED_LOCAL_INFILE` setting specified at MySQL build time.

  By default, the client library in MySQL binary distributions is compiled with `ENABLED_LOCAL_INFILE` disabled. If you compile MySQL from source, configure it with `ENABLED_LOCAL_INFILE` disabled or enabled based on whether clients that make no explicit arrangements should have `LOCAL` capability disabled or enabled, respectively.

   `ENABLED_LOCAL_INFILE` controls the default for client-side `LOCAL` capability. For the server, the `local_infile` system variable controls server-side `LOCAL` capability. To explicitly cause the server to refuse or permit `LOAD DATA LOCAL` statements (regardless of how client programs and libraries are configured at build time or runtime), start  **mysqld** with `--local-infile` disabled or enabled, respectively. `local_infile` can also be set at runtime. See Section 8.1.6, “Security Considerations for LOAD DATA LOCAL”.
*  `-DENABLED_PROFILING=bool`

  Whether to enable query profiling code (for the `SHOW PROFILE` and `SHOW PROFILES` statements).
*  `-DFORCE_UNSUPPORTED_COMPILER=bool`

  By default, **CMake** checks for minimum versions of supported compilers; to disable this check, use `-DFORCE_UNSUPPORTED_COMPILER=ON`.
*  `-DFPROFILE_GENERATE=bool`

  Whether to generate profile guided optimization (PGO) data. This option is available for experimenting with PGO with GCC. See `cmake/fprofile.cmake` in the MySQL source distribution for information about using `FPROFILE_GENERATE` and `FPROFILE_USE`. These options have been tested with GCC 8 and 9.
*  `-DFPROFILE_USE=bool`

  Whether to use profile guided optimization (PGO) data. This option is available for experimenting with PGO with GCC. See the `cmake/fprofile.cmake` file in a MySQL source distribution for information about using `FPROFILE_GENERATE` and `FPROFILE_USE`. These options have been tested with GCC 8 and 9.

  Enabling  `FPROFILE_USE` also enables  `WITH_LTO`.
*  `-DHAVE_PSI_MEMORY_INTERFACE=bool`

  Whether to enable the performance schema memory tracing module for memory allocation functions (`ut::aligned_name` library functions) used in dynamic storage of over-aligned types.
*  `-DIGNORE_AIO_CHECK=bool`

  If the `-DBUILD_CONFIG=mysql_release` option is given on Linux, the `libaio` library must be linked in by default. If you do not have `libaio` or do not want to install it, you can suppress the check for it by specifying `-DIGNORE_AIO_CHECK=1`.
*  `-DMAX_INDEXES=num`

  The maximum number of indexes per table. The default is 64. The maximum is 255. Values smaller than 64 are ignored and the default of 64 is used.
*  `-DMYSQL_MAINTAINER_MODE=bool`

  Whether to enable a MySQL maintainer-specific development environment. If enabled, this option causes compiler warnings to become errors.
*  `-DWITH_DEVELOPER_ENTITLEMENTS=bool`

  Whether to add the `get-task-allow` entitlement to all executables to generate a core dump in the event of an unexpected server halt.

  On macOS 11+, core dumps are limited to processes with the `com.apple.security.get-task-allow` entitlement, which this CMake option enables. The entitlement allows other processes to attach and read/modify the processes memory, and allows `--core-file` to function as expected.
*  `-DMUTEX_TYPE=type`

  The mutex type used by `InnoDB`. Options include:

  + `event`: Use event mutexes. This is the default value and the original `InnoDB` mutex implementation.
  + `sys`: Use POSIX mutexes on UNIX systems. Use `CRITICAL_SECTION` objects on Windows, if available.
  + `futex`: Use Linux futexes instead of condition variables to schedule waiting threads.
*  `-DMYSQLX_TCP_PORT=port_num`

  The port number on which X Plugin listens for TCP/IP connections. The default is 33060.

  This value can be set at server startup with the `mysqlx_port` system variable.
*  `-DMYSQLX_UNIX_ADDR=file_name`

  The Unix socket file path on which the server listens for X Plugin socket connections. This must be an absolute path name. The default is `/tmp/mysqlx.sock`.

  This value can be set at server startup with the `mysqlx_port` system variable.
*  `-DMYSQL_PROJECT_NAME=name`

  For Windows or macOS, the project name to incorporate into the project file name.
*  `-DMYSQL_TCP_PORT=port_num`

  The port number on which the server listens for TCP/IP connections. The default is 3306.

  This value can be set at server startup with the `--port` option.
*  `-DMYSQL_UNIX_ADDR=file_name`

  The Unix socket file path on which the server listens for socket connections. This must be an absolute path name. The default is `/tmp/mysql.sock`.

  This value can be set at server startup with the `--socket` option.
*  `-DOPTIMIZER_TRACE=bool`

  Whether to support optimizer tracing. See Section 10.15, “Tracing the Optimizer”.
*  `-DREPRODUCIBLE_BUILD=bool`

  For builds on Linux systems, this option controls whether to take extra care to create a build result independent of build location and time.

  This option defaults to `ON` for `RelWithDebInfo` builds.
*  `-DSHOW_SUPPRESSED_COMPILER_WARNINGS=bool`

  Show suppressed compiler warnings, and do so without failing with `-Werror`. Defaults to `OFF`.
*  `-DWIN_DEBUG_NO_INLINE=bool`

  Whether to disable function inlining on Windows. The default is `OFF` (inlining enabled).
*  `-DWITH_LD=string`

  **CMake** uses the standard linker by default. Optionally pass in `lld` or `mold` to specify an alternative linker. **mold** must be version 2 or newer.

  This option can be used on Linux-based systems other than Enterprise Linux, which always uses the **ld** linker.

  ::: info Note

  Previously, the option `USE_LD_LLD` could be used to enable (the default) or disable explicitly the LLVM **lld** linker for Clang. In MySQL 8.3, `USE_LD_LLD` has been removed.

  :::

*  `-DWITH_ANT=path_name`

  Set the path to Ant, required when building GCS Java wrapper. Set  `WITH_ANT` to the path of a directory where the Ant tarball or unpacked archive is saved. When `WITH_ANT` is not set, or is set with the special value `system`, the build process assumes a binary `ant` exists in `$PATH`.
*  `-DWITH_ASAN=bool`

  Whether to enable the AddressSanitizer, for compilers that support it. The default is `OFF`.
*  `-DWITH_ASAN_SCOPE=bool`

  Whether to enable the AddressSanitizer `-fsanitize-address-use-after-scope` Clang flag for use-after-scope detection. The default is off. To use this option, `-DWITH_ASAN` must also be enabled.
*  `-DWITH_AUTHENTICATION_CLIENT_PLUGINS=bool`

  This option is enabled automatically if any corresponding server authentication plugins are built. Its value thus depends on other **CMake** options and it should not be set explicitly.
*  `-DWITH_AUTHENTICATION_LDAP=bool`

  Whether to report an error if the LDAP authentication plugins cannot be built:

  + If this option is disabled (the default), the LDAP plugins are built if the required header files and libraries are found. If they are not, **CMake** displays a note about it.
  + If this option is enabled, a failure to find the required header file and libraries causes CMake to produce an error, preventing the server from being built.
*  `-DWITH_AUTHENTICATION_PAM=bool`

  Whether to build the PAM authentication plugin, for source trees that include this plugin. (See Section 8.4.1.5, “PAM Pluggable Authentication”.) If this option is specified and the plugin cannot be compiled, the build fails.
*  `-DWITH_AWS_SDK=path_name`

  The location of the Amazon Web Services software development kit.
*  `-DWITH_CLIENT_PROTOCOL_TRACING=bool`

  Whether to build the client-side protocol tracing framework into the client library. By default, this option is enabled.

  For information about writing protocol trace client plugins, see  Writing Protocol Trace Plugins.

  See also the `WITH_TEST_TRACE_PLUGIN` option.
*  `-DWITH_CURL=curl_type`

  The location of the `curl` library. *`curl_type`* can be `system` (use the system `curl` library), a path name to the `curl` library, `no`|`off`|`none` to disable curl support, or `bundled` to use the bundled curl distribution in `extra/curl/`.
*  `-DWITH_DEBUG=bool`

  Whether to include debugging support.

  Configuring MySQL with debugging support enables you to use the  `--debug="d,parser_debug"` option when you start the server. This causes the Bison parser that is used to process SQL statements to dump a parser trace to the server's standard error output. Typically, this output is written to the error log.

  Sync debug checking for the `InnoDB` storage engine is defined under `UNIV_DEBUG` and is available when debugging support is compiled in using the `WITH_DEBUG` option. When debugging support is compiled in, the `innodb_sync_debug` configuration option can be used to enable or disable `InnoDB` sync debug checking.

  Enabling  `WITH_DEBUG` also enables Debug Sync. This facility is used for testing and debugging. When compiled in, Debug Sync is disabled by default at runtime. To enable it, start **mysqld** with the `--debug-sync-timeout=N` option, where *`N`* is a timeout value greater than 0. (The default value is 0, which disables Debug Sync.) *`N`* becomes the default timeout for individual synchronization points.

  Sync debug checking for the `InnoDB` storage engine is available when debugging support is compiled in using the `WITH_DEBUG` option.

  For a description of the Debug Sync facility and how to use synchronization points, see MySQL Internals: Test Synchronization.
*  `-DWITH_EDITLINE=value`

  Which `libedit`/`editline` library to use. The permitted values are `bundled` (the default) and `system`.
*  `-DWITH_ICU={icu_type|path_name}`

  MySQL uses International Components for Unicode (ICU) to support regular expression operations. The `WITH_ICU` option indicates the type of ICU support to include or the path name to the ICU installation to use.

  + *`icu_type`* can be one of the following values:

    - `bundled`: Use the ICU library bundled with the distribution. This is the default, and is the only supported option for Windows.
    - `system`: Use the system ICU library.
  + *`path_name`* is the path name to the ICU installation to use. This can be preferable to using the *`icu_type`* value of `system` because it can prevent CMake from detecting and using an older or incorrect ICU version installed on the system. (Another permitted way to do the same thing is to set `WITH_ICU` to `system` and set the `CMAKE_PREFIX_PATH` option to *`path_name`*.)
*  `-DWITH_INNODB_EXTRA_DEBUG=bool`

  Whether to include extra InnoDB debugging support.

  Enabling `WITH_INNODB_EXTRA_DEBUG` turns on extra InnoDB debug checks. This option can only be enabled when  `WITH_DEBUG` is enabled.
*  `-DWITH_JEMALLOC=bool`

  Whether to link with `-ljemalloc`. If enabled, built-in `malloc()`, `calloc()`, `realloc()`, and `free()` routines are disabled. The default is `OFF`.

   `WITH_JEMALLOC` and `WITH_TCMALLOC` are mutually exclusive.
*  `-DWITH_LIBEVENT=string`

  Which `libevent` library to use. Permitted values are `bundled` (default) and `system`. If `system` is specified and no system `libevent` library can be found, an error occurs regardless, and the bundled `libevent` is not used.

  The `libevent` library is required by X Plugin and MySQL Router.
*  `-DWITH_LIBWRAP=bool`

  Whether to include `libwrap` (TCP wrappers) support.
*  `-DWITH_LOCK_ORDER=bool`

  Whether to enable LOCK_ORDER tooling. By default, this option is disabled and server builds contain no tooling. If tooling is enabled, the LOCK_ORDER tool is available and can be used as described in  Section 7.9.3, “The LOCK_ORDER Tool”.

  ::: info Note

  With the  `WITH_LOCK_ORDER` option enabled, MySQL builds require the **flex** program.

  :::

*  `-DWITH_LSAN=bool`

  Whether to run LeakSanitizer, without AddressSanitizer. The default is `OFF`.
*  `-DWITH_LTO=bool`

  Whether to enable the link-time optimizer, if the compiler supports it. The default is `OFF` unless `FPROFILE_USE` is enabled.
*  `-DWITH_LZ4=lz4_type`

  The  `WITH_LZ4` option indicates the source of `zlib` support:

  + `bundled`: Use the `lz4` library bundled with the distribution. This is the default.
  + `system`: Use the system `lz4` library.
*  `-DWITH_MECAB={disabled|system|path_name}`

  Use this option to compile the MeCab parser. If you have installed MeCab to its default installation directory, set `-DWITH_MECAB=system`. The `system` option applies to MeCab installations performed from source or from binaries using a native package management utility. If you installed MeCab to a custom installation directory, specify the path to the MeCab installation, for example, `-DWITH_MECAB=/opt/mecab`. If the `system` option does not work, specifying the MeCab installation path should work in all cases.

  For related information, see Section 14.9.9, “MeCab Full-Text Parser Plugin”.
*  `-DWITH_MSAN=bool`

  Whether to enable MemorySanitizer, for compilers that support it. The default is off.

  For this option to have an effect if enabled, all libraries linked to MySQL must also have been compiled with the option enabled.
*  `-DWITH_MSCRT_DEBUG=bool`

  Whether to enable Visual Studio CRT memory leak tracing. The default is `OFF`.
*  `-DMSVC_CPPCHECK=bool`

  Whether to enable MSVC code analysis. The default is `ON`.
*  `-DWITH_MYSQLX=bool`

  Whether to build with support for X Plugin. The default is `ON`. See  Chapter 22, *Using MySQL as a Document Store*.
*  `-DWITH_NUMA=bool`

  Explicitly set the NUMA memory allocation policy. **CMake** sets the default `WITH_NUMA` value based on whether the current platform has `NUMA` support. For platforms without NUMA support, **CMake** behaves as follows:

  + With no NUMA option (the normal case), **CMake** continues normally, producing only this warning: NUMA library missing or required version not available.
  + With  `-DWITH_NUMA=ON`, **CMake** aborts with this error: NUMA library missing or required version not available.
*  `-DWITH_PACKAGE_FLAGS=bool`

  For flags typically used for RPM and Debian packages, whether to add them to standalone builds on those platforms. The default is `ON` for nondebug builds.
*  `-DWITH_PROTOBUF=protobuf_type`

  Which Protocol Buffers package to use. *`protobuf_type`* can be one of the following values:

  + `bundled`: Use the package bundled with the distribution. This is the default. Optionally use `INSTALL_PRIV_LIBDIR` to modify the dynamic Protobuf library directory.
  + `system`: Use the package installed on the system.

  Other values are ignored, with a fallback to `bundled`.
*  `-DWITH_RAPID=bool`

  Whether to build the rapid development cycle plugins. When enabled, a `rapid` directory is created in the build tree containing these plugins. When disabled, no `rapid` directory is created in the build tree. The default is `ON`, unless the `rapid` directory is removed from the source tree, in which case the default becomes `OFF`.
*  `-DWITH_RAPIDJSON=rapidjson_type`

  The type of RapidJSON library support to include. *`rapidjson_type`* can be one of the following values:

  + `bundled`: Use the RapidJSON library bundled with the distribution. This is the default.
  + `system`: Use the system RapidJSON library. Version 1.1.0 or later is required.
*  `-DWITH_ROUTER=bool`

  Whether to build MySQL Router. The default is `ON`.
*  `-DWITH_SASL=value`

  Internal use only. Not supported on Windows.
*  `-DWITH_SSL={ssl_type`|*`path_name`*}

  For support of encrypted connections, entropy for random number generation, and other encryption-related operations, MySQL must be built using an SSL library. This option specifies which SSL library to use.

  + *`ssl_type`* can be one of the following values:

    - `system`: Use the system OpenSSL library. This is the default.

      On macOS and Windows, using `system` configures MySQL to build as if CMake was invoked with *`path_name`* points to a manually installed OpenSSL library. This is because they do not have system SSL libraries. On macOS, *brew install openssl* installs to `/usr/local/opt/openssl` so that `system` can find it. On Windows, it checks `%ProgramFiles%/OpenSSL`, `%ProgramFiles%/OpenSSL-Win32`, `%ProgramFiles%/OpenSSL-Win64`, `C:/OpenSSL`, `C:/OpenSSL-Win32`, and `C:/OpenSSL-Win64`.
    - `yes`: This is a synonym for `system`.
    - `opensslversion`: Use an alternate OpenSSL system package such as `openssl11` on EL7, or `openssl3` (or `openssl3-fips`) on EL8.

      Authentication plugins, such as LDAP and Kerberos, are disabled as they do not support these alternative versions of OpenSSL.
  + *`path_name`* is the path name to the OpenSSL installation to use. This can be preferable to using the *`ssl_type`* value `system` because it can prevent CMake from detecting and using an older or incorrect OpenSSL version installed on the system. (Another permitted way to do the same thing is to set `WITH_SSL` to `system` and set the `CMAKE_PREFIX_PATH` option to *`path_name`*.)

  For additional information about configuring the SSL library, see Section 2.8.6, “Configuring SSL Library Support”.
*  `-DWITH_SHOW_PARSE_TREE=bool`

  Enables support for `SHOW PARSE_TREE` in the server, used in development and debugging only. Not used for release builds or supported in production.
*  `-DWITH_SYSTEMD=bool`

  Whether to enable installation of **systemd** support files. By default, this option is disabled. When enabled, **systemd** support files are installed, and scripts such as **mysqld_safe** and the System V initialization script are not installed. On platforms where **systemd** is not available, enabling `WITH_SYSTEMD` results in an error from **CMake**.

  When the server was built using this option, MySQL includes all **systemd** messages in the server's error log (see  Section 7.4.2, “The Error Log”).

  For more information about using **systemd**, see  Section 2.5.9, “Managing MySQL Server with systemd”. That section also includes information about specifying options otherwise specified in `[mysqld_safe]` option groups. Because  **mysqld_safe** is not installed when **systemd** is used, such options must be specified another way.
*  `-DWITH_SYSTEM_LIBS=bool`

  This option serves as an “umbrella” option to set the `system` value of any of the following **CMake** options that are not set explicitly:  `WITH_CURL`, `WITH_EDITLINE`, `WITH_ICU`, `WITH_LIBEVENT`, `WITH_LZ4`, `WITH_LZMA`, `WITH_PROTOBUF`, `WITH_RE2`, `WITH_SSL`, `WITH_ZLIB`, `WITH_ZSTD`.
*  `-DWITH_SYSTEMD_DEBUG=bool`

  Whether to produce additional **systemd** debugging information, for platforms on which **systemd** is used to run MySQL. The default is `OFF`.
*  `-DWITH_TCMALLOC=bool`

  Whether to link with `-ltcmalloc`. If enabled, built-in `malloc()`, `calloc()`, `realloc()`, and `free()` routines are disabled. The default is `OFF`.

  Beginning with MySQL 8.4.1, a `tcmalloc` library is included in the source; you can cause the build to use the bundled version by setting this option to `BUNDLED`. `BUNDLED` is supported on Linux systems only.

   `WITH_TCMALLOC` and `WITH_JEMALLOC` are mutually exclusive.
*  `-DWITH_TEST_TRACE_PLUGIN=bool`

  Whether to build the test protocol trace client plugin (see Using the Test Protocol Trace Plugin). By default, this option is disabled. Enabling this option has no effect unless the `WITH_CLIENT_PROTOCOL_TRACING` option is enabled. If MySQL is configured with both options enabled, the `libmysqlclient` client library is built with the test protocol trace plugin built in, and all the standard MySQL clients load the plugin. However, even when the test plugin is enabled, it has no effect by default. Control over the plugin is afforded using environment variables; see Using the Test Protocol Trace Plugin.

  ::: info Note

  Do *not* enable the `WITH_TEST_TRACE_PLUGIN` option if you want to use your own protocol trace plugins because only one such plugin can be loaded at a time and an error occurs for attempts to load a second one. If you have already built MySQL with the test protocol trace plugin enabled to see how it works, you must rebuild MySQL without it before you can use your own plugins.

  :::

  For information about writing trace plugins, see Writing Protocol Trace Plugins.
*  `-DWITH_TSAN=bool`

  Whether to enable the ThreadSanitizer, for compilers that support it. The default is off.
*  `-DWITH_UBSAN=bool`

  Whether to enable the Undefined Behavior Sanitizer, for compilers that support it. The default is off.
*  `-DWITH_UNIT_TESTS={ON|OFF}`

  If enabled, compile MySQL with unit tests. The default is `ON` unless the server is not being compiled.
*  `-DWITH_UNIXODBC=1`

  Enables unixODBC support, for Connector/ODBC.
*  `-DWITH_VALGRIND=bool`

  Whether to compile in the Valgrind header files, which exposes the Valgrind API to MySQL code. The default is `OFF`.

  To generate a Valgrind-aware debug build, `-DWITH_VALGRIND=1` normally is combined with  `-DWITH_DEBUG=1`. See Building Debug Configurations.
*  `-DWITH_WIN_JEMALLOC=string`

  On Windows, pass in a path to a directory containing `jemalloc.dll` to enable jemalloc functionality. The build system copies `jemalloc.dll` to the same directory as `mysqld.exe` and/or `mysqld-debug.exe` and utilizes it for memory management operations. Standard memory functions are used if `jemalloc.dll` is not found or does not export the required functions. An INFORMATION level log message records whether or not jemalloc is found and used.

  This option is enabled for official MySQL binaries for Windows.
*  `-DWITH_ZLIB=zlib_type`

  Some features require that the server be built with compression library support, such as the `COMPRESS()` and `UNCOMPRESS()` functions, and compression of the client/server protocol. The `WITH_ZLIB` option indicates the source of `zlib` support:

  The minimum supported version of `zlib` is 1.2.13.

  + `bundled`: Use the `zlib` library bundled with the distribution. This is the default.
  + `system`: Use the system `zlib` library.
*  `-DWITH_ZSTD=zstd_type`

  Connection compression using the `zstd` algorithm (see Section 6.2.8, “Connection Compression Control”) requires that the server be built with `zstd` library support. The  `WITH_ZSTD` option indicates the source of `zstd` support:

  + `bundled`: Use the `zstd` library bundled with the distribution. This is the default.
  + `system`: Use the system `zstd` library.
*  `-DWITHOUT_SERVER=bool`

  Whether to build without MySQL Server. The default is OFF, which does build the server.

  This is considered an experimental option; it is preferred to build with the server.

  This option also prevents building of the `NDB` storage engine or any `NDB` binaries including management and data node programs.

#### Compiler Flags

*  `-DCMAKE_C_FLAGS="flags`"

  Flags for the C compiler.
*  `-DCMAKE_CXX_FLAGS="flags`"

  Flags for the C++ compiler.
*  `-DWITH_DEFAULT_COMPILER_OPTIONS=bool`

  Whether to use the flags from `cmake/build_configurations/compiler_options.cmake`.

  ::: info Note

  All optimization flags are carefully chosen and tested by the MySQL build team. Overriding them can lead to unexpected results and is done at your own risk.

  :::

*  `-DOPTIMIZE_SANITIZER_BUILDS=bool`

  Whether to add `-O1 -fno-inline` to sanitizer builds. The default is `ON`.

To specify your own C and C++ compiler flags, for flags that do not affect optimization, use the `CMAKE_C_FLAGS` and `CMAKE_CXX_FLAGS` CMake options.

When providing your own compiler flags, you might want to specify  `CMAKE_BUILD_TYPE` as well.

For example, to create a 32-bit release build on a 64-bit Linux machine, do this:

```
$> mkdir build
$> cd build
$> cmake .. -DCMAKE_C_FLAGS=-m32 
  -DCMAKE_CXX_FLAGS=-m32 
  -DCMAKE_BUILD_TYPE=RelWithDebInfo
```

If you set flags that affect optimization (`-Onumber`), you must set the `CMAKE_C_FLAGS_build_type` and/or `CMAKE_CXX_FLAGS_build_type` options, where *`build_type`* corresponds to the  `CMAKE_BUILD_TYPE` value. To specify a different optimization for the default build type (`RelWithDebInfo`) set the `CMAKE_C_FLAGS_RELWITHDEBINFO` and `CMAKE_CXX_FLAGS_RELWITHDEBINFO` options. For example, to compile on Linux with `-O3` and with debug symbols, do this:

```
$> cmake .. -DCMAKE_C_FLAGS_RELWITHDEBINFO="-O3 -g" 
  -DCMAKE_CXX_FLAGS_RELWITHDEBINFO="-O3 -g"
```

#### CMake Options for Compiling NDB Cluster

To compile with support for NDB Cluster, you can use `-DWITH_NDB`, which causes the build to include the NDB storage engine and all NDB programs. This option is enabled by default. To prevent building of the NDB storage engine plugin, use `-DWITH_NDBCLUSTER_STORAGE_ENGINE=OFF`. Other aspects of the build can be controlled using the other options listed in this section.

The following options apply when building the MySQL sources with NDB Cluster support.

*  `-DNDB_UTILS_LINK_DYNAMIC={ON|OFF}`

  Controls whether NDB utilities such as **ndb_drop_table** are linked with `ndbclient` statically (`OFF`) or dynamically (`ON`); `OFF` (static linking) is the default. Normally static linking is used when building these to avoid problems with `LD_LIBRARY_PATH`, or when multiple versions of `ndbclient` are installed. This option is intended for creating Docker images and possibly other cases in which the target environment is subject to precise control and it is desirable to reduce image size.
*  `-DWITH_CLASSPATH=path`

  Sets the classpath for building MySQL NDB Cluster Connector for Java. The default is empty. This option is ignored if `-DWITH_NDB_JAVA=OFF` is used.
*  `-DWITH_ERROR_INSERT={ON|OFF}`

  Enables error injection in the `NDB` kernel. For testing only; not intended for use in building production binaries. The default is `OFF`.
*  `-DWITH_NDB={ON|OFF}`

  Build MySQL NDB Cluster; build the NDB plugin and all NDB Cluster programs.
*  `-DWITH_NDBAPI_EXAMPLES={ON|OFF}`

  Build NDB API example programs in `storage/ndb/ndbapi-examples/`. See NDB API Examples, for information about these.
*  `-DWITH_NDBCLUSTER_STORAGE_ENGINE={ON|OFF}`

  Controls (only) whether the `NDBCLUSTER` storage engine is included in the build; `WITH_NDB` enables this option automatically, so it is recommended that you use `WITH_NDB` instead.
*  `-DWITH_NDBCLUSTER={ON|OFF}` (DEPRECATED)

  Build and link in support for the `NDB` storage engine in **mysqld**.

  This option is deprecated and subject to eventual removal; use  `WITH_NDB` instead.
*  `-DWITH_NDBMTD={ON|OFF}`

  Build the multithreaded data node executable **ndbmtd**"). The default is `ON`.
*  `-DWITH_NDB_DEBUG={ON|OFF}`

  Enable building the debug versions of the NDB Cluster binaries. This is `OFF` by default.
*  `-DWITH_NDB_JAVA={ON|OFF}`

  Enable building NDB Cluster with Java support, including support for ClusterJ (see  MySQL NDB Cluster Connector for Java).

  This option is `ON` by default. If you do not wish to compile NDB Cluster with Java support, you must disable it explicitly by specifying `-DWITH_NDB_JAVA=OFF` when running **CMake**. Otherwise, if Java cannot be found, configuration of the build fails.
*  `-DWITH_NDB_PORT=port`

  Causes the NDB Cluster management server ( **ndb_mgmd**) that is built to use this *`port`* by default. If this option is unset, the resulting management server tries to use port 1186 by default.
*  `-DWITH_NDB_TEST={ON|OFF}`

  If enabled, include a set of NDB API test programs. The default is `OFF`.
*  `-DWITH_NDB_TLS_SEARCH_PATH=path`

  Set the default path searched by **ndb_sign_keys** and other `NDB` programs for TLS certificate and key files.

  The default for Windows platforms is `$HOMEDIR/ndb-tls`; for other platforms, such as Linux, it is `$HOME/ndb-tls`.
