#### 25.3.1.4 Building NDB Cluster from Source on Linux

This section provides information about compiling NDB Cluster on Linux and other Unix-like platforms. Building NDB Cluster from source is similar to building the standard MySQL Server, although it differs in a few key respects discussed here. For general information about building MySQL from source, see Section 2.8, “Installing MySQL from Source”. For information about compiling NDB Cluster on Windows platforms, see Section 25.3.2.2, “Compiling and Installing NDB Cluster from Source on Windows”.

Building MySQL NDB Cluster 8.0 requires using the MySQL Server 8.0 sources. These are available from the MySQL downloads page at <https://dev.mysql.com/downloads/>. The archived source file should have a name similar to `mysql-8.0.43.tar.gz`. You can also obtain the sources from GitHub at <https://github.com/mysql/mysql-server>.

Note

In previous versions, building of NDB Cluster from standard MySQL Server sources was not supported. In MySQL 8.0 and NDB Cluster 8.0, this is no longer the case—*both products are now built from the same sources*.

The `WITH_NDB` option for **CMake** causes the binaries for the management nodes, data nodes, and other NDB Cluster programs to be built; it also causes **mysqld** to be compiled with `NDB` storage engine support. This option (or, prior to NDB 8.0.31, `WITH_NDBCLUSTER`) is required when building NDB Cluster.

Important

The `WITH_NDB_JAVA` option is enabled by default. This means that, by default, if **CMake** cannot find the location of Java on your system, the configuration process fails; if you do not wish to enable Java and ClusterJ support, you must indicate this explicitly by configuring the build using `-DWITH_NDB_JAVA=OFF`. Use `WITH_CLASSPATH` to provide the Java classpath if needed.

For more information about **CMake** options specific to building NDB Cluster, see CMake Options for Compiling NDB Cluster.

After you have run **make && make install** (or your system's equivalent), the result is similar to what is obtained by unpacking a precompiled binary to the same location.

**Management nodes.** When building from source and running the default **make install**, the management server and management client binaries (**ndb_mgmd** and **ndb_mgm**) can be found in `/usr/local/mysql/bin`. Only **ndb_mgmd** is required to be present on a management node host; however, it is also a good idea to have **ndb_mgm** present on the same host machine. Neither of these executables requires a specific location on the host machine's file system.

**Data nodes.** The only executable required on a data node host is the data node binary **ndbd** or **ndbmtd**"). (**mysqld**, for example, does not have to be present on the host machine.) By default, when building from source, this file is placed in the directory `/usr/local/mysql/bin`. For installing on multiple data node hosts, only **ndbd** or **ndbmtd**") need be copied to the other host machine or machines. (This assumes that all data node hosts use the same architecture and operating system; otherwise you may need to compile separately for each different platform.) The data node binary need not be in any particular location on the host's file system, as long as the location is known.

When compiling NDB Cluster from source, no special options are required for building multithreaded data node binaries. Configuring the build with `NDB` storage engine support causes **ndbmtd**") to be built automatically; **make install** places the **ndbmtd**") binary in the installation `bin` directory along with **mysqld**, **ndbd**, and **ndb_mgm**.

**SQL nodes.** If you compile MySQL with clustering support, and perform the default installation (using **make install** as the system `root` user), **mysqld** is placed in `/usr/local/mysql/bin`. Follow the steps given in Section 2.8, “Installing MySQL from Source” to make **mysqld** ready for use. If you want to run multiple SQL nodes, you can use a copy of the same **mysqld** executable and its associated support files on several machines. The easiest way to do this is to copy the entire `/usr/local/mysql` directory and all directories and files contained within it to the other SQL node host or hosts, then repeat the steps from Section 2.8, “Installing MySQL from Source” on each machine. If you configure the build with a nondefault `PREFIX` option, you must adjust the directory accordingly.

In Section 25.3.3, “Initial Configuration of NDB Cluster”, we create configuration files for all of the nodes in our example NDB Cluster.
