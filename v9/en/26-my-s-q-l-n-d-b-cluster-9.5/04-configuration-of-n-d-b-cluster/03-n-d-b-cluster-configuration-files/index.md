### 25.4.3 NDB Cluster Configuration Files

25.4.3.1 NDB Cluster Configuration: Basic Example

25.4.3.2 Recommended Starting Configuration for NDB Cluster

25.4.3.3 NDB Cluster Connection Strings

25.4.3.4 Defining Computers in an NDB Cluster

25.4.3.5 Defining an NDB Cluster Management Server

25.4.3.6 Defining NDB Cluster Data Nodes

25.4.3.7 Defining SQL and Other API Nodes in an NDB Cluster

25.4.3.8 Defining the System

25.4.3.9 MySQL Server Options and Variables for NDB Cluster

25.4.3.10 NDB Cluster TCP/IP Connections

25.4.3.11 NDB Cluster TCP/IP Connections Using Direct Connections

25.4.3.12 NDB Cluster Shared-Memory Connections

25.4.3.13 Data Node Memory Management

25.4.3.14 Configuring NDB Cluster Send Buffer Parameters

Configuring NDB Cluster requires working with two files:

* `my.cnf`: Specifies options for all NDB Cluster executables. This file, with which you should be familiar with from previous work with MySQL, must be accessible by each executable running in the cluster.

* `config.ini`: This file, sometimes known as the global configuration file, is read only by the NDB Cluster management server, which then distributes the information contained therein to all processes participating in the cluster. `config.ini` contains a description of each node involved in the cluster. This includes configuration parameters for data nodes and configuration parameters for connections between all nodes in the cluster. For a quick reference to the sections that can appear in this file, and what sorts of configuration parameters may be placed in each section, see Sections of the `config.ini` File.

**Caching of configuration data.** `NDB` uses stateful configuration. Rather than reading the global configuration file every time the management server is restarted, the management server caches the configuration the first time it is started, and thereafter, the global configuration file is read only when one of the following conditions is true:

* **The management server is started using the --initial option.** When `--initial` is used, the global configuration file is re-read, any existing cache files are deleted, and the management server creates a new configuration cache.

* **The management server is started using the --reload option.** The `--reload` option causes the management server to compare its cache with the global configuration file. If they differ, the management server creates a new configuration cache; any existing configuration cache is preserved, but not used. If the management server's cache and the global configuration file contain the same configuration data, then the existing cache is used, and no new cache is created.

* **The management server is started using --config-cache=FALSE.** This disables `--config-cache` (enabled by default), and can be used to force the management server to bypass configuration caching altogether. In this case, the management server ignores any configuration files that may be present, always reading its configuration data from the `config.ini` file instead.

* **No configuration cache is found.** In this case, the management server reads the global configuration file and creates a cache containing the same configuration data as found in the file.

**Configuration cache files.** The management server by default creates configuration cache files in a directory named `mysql-cluster` in the MySQL installation directory. (If you build NDB Cluster from source on a Unix system, the default location is `/usr/local/mysql-cluster`.) This can be overridden at runtime by starting the management server with the `--configdir` option. Configuration cache files are binary files named according to the pattern `ndb_node_id_config.bin.seq_id`, where *`node_id`* is the management server's node ID in the cluster, and *`seq_id`* is a cache identifier. Cache files are numbered sequentially using *`seq_id`*, in the order in which they are created. The management server uses the latest cache file as determined by the *`seq_id`*.

Note

It is possible to roll back to a previous configuration by deleting later configuration cache files, or by renaming an earlier cache file so that it has a higher *`seq_id`*. However, since configuration cache files are written in a binary format, you should not attempt to edit their contents by hand.

For more information about the `--configdir`, `--config-cache`, `--initial`, and `--reload` options for the NDB Cluster management server, see Section 25.5.4, “ndb\_mgmd — The NDB Cluster Management Server Daemon”.

We are continuously making improvements in NDB Cluster configuration and attempting to simplify this process. Although we strive to maintain backward compatibility, there may be times when introduce an incompatible change. In such cases we try to let NDB Cluster users know in advance if a change is not backward compatible. If you find such a change and we have not documented it, please report it in the MySQL bugs database using the instructions given in Section 1.6, “How to Report Bugs or Problems”.
