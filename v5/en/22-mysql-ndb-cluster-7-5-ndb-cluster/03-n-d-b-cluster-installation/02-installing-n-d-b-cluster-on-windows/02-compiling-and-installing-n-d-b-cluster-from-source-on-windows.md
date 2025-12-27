#### 21.3.2.2 Compiling and Installing NDB Cluster from Source on Windows

Oracle provides precompiled NDB Cluster binaries for Windows which should be adequate for most users. However, if you wish, it is also possible to compile NDB Cluster for Windows from source code. The procedure for doing this is almost identical to the procedure used to compile the standard MySQL Server binaries for Windows, and uses the same tools. However, there are two major differences:

* Building NDB Cluster requires using the NDB Cluster sources. These are available from the NDB Cluster downloads page at <https://dev.mysql.com/downloads/cluster/>. The archived source file should have a name similar to `mysql-cluster-gpl-7.6.35.tar.gz`. You can also obtain NDB Cluster sources from GitHub at <https://github.com/mysql/mysql-server/tree/cluster-7.5> (NDB 7.5) and <https://github.com/mysql/mysql-server/tree/cluster-7.6> (NDB 7.6). *Building NDB Cluster 7.5 or 7.6 from standard MySQL Server 5.7 sources is not supported*.

* You must configure the build using the [`WITH_NDBCLUSTER`](source-configuration-options.html#option_cmake_with_ndbcluster) option in addition to any other build options you wish to use with **CMake**. ([`WITH_NDBCLUSTER_STORAGE_ENGINE`](source-configuration-options.html#option_cmake_with_ndbcluster_storage_engine) is supported as an alias.)

Important

The [`WITH_NDB_JAVA`](source-configuration-options.html#option_cmake_with_ndb_java) option is enabled by default. This means that, by default, if **CMake** cannot find the location of Java on your system, the configuration process fails; if you do not wish to enable Java and ClusterJ support, you must indicate this explicitly by configuring the build using `-DWITH_NDB_JAVA=OFF`. (Bug #12379735) Use [`WITH_CLASSPATH`](source-configuration-options.html#option_cmake_with_classpath) to provide the Java classpath if needed.

For more information about **CMake** options specific to building NDB Cluster, see [CMake Options for Compiling NDB Cluster](source-configuration-options.html#cmake-mysql-cluster-options "CMake Options for Compiling NDB Cluster").

Once the build process is complete, you can create a Zip archive containing the compiled binaries; [Section 2.8.4, “Installing MySQL Using a Standard Source Distribution”](installing-source-distribution.html "2.8.4 Installing MySQL Using a Standard Source Distribution") provides the commands needed to perform this task on Windows systems. The NDB Cluster binaries can be found in the `bin` directory of the resulting archive, which is equivalent to the `no-install` archive, and which can be installed and configured in the same manner. For more information, see [Section 21.3.2.1, “Installing NDB Cluster on Windows from a Binary Release”](mysql-cluster-install-windows-binary.html "21.3.2.1 Installing NDB Cluster on Windows from a Binary Release").
