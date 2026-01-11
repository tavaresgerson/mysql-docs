### 25.5.7 ndb_config — Extract NDB Cluster Configuration Information

This tool extracts current configuration information for data nodes, SQL nodes, and API nodes from one of a number of sources: an NDB Cluster management node, or its `config.ini` or `my.cnf` file. By default, the management node is the source for the configuration data; to override the default, execute ndb_config with the `--config-file` or `--mycnf` option. It is also possible to use a data node as the source by specifying its node ID with `--config_from_node=node_id`.

**ndb_config** can also provide an offline dump of all configuration parameters which can be used, along with their default, maximum, and minimum values and other information. The dump can be produced in either text or XML format; for more information, see the discussion of the `--configinfo` and `--xml` options later in this section).

You can filter the results by section (`DB`, `SYSTEM`, or `CONNECTIONS`) using one of the options `--nodes`, `--system`, or `--connections`.

All options that can be used with **ndb_config** are shown in the following table. Additional descriptions follow the table.

**Table 25.29 Command-line options used with the program ndb_config**

<table frame="box" rules="all"><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --cluster-config-suffix=name </code> </p></th> <td>Override defaults group suffix when reading cluster_config sections in my.cnf file; used in testing</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --config-binary-file=path/to/file </code> </p></th> <td>Read this binary configuration file</td> <td><p> ADDED: NDB 8.0.32 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --config-file=file_name </code> </p></th> <td>Set the path to config.ini file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --config-from-node=# </code> </p></th> <td>Obtain configuration data from the node having this ID (must be a data node)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --configinfo </code> </p></th> <td>Dumps information about all NDB configuration parameters in text format with default, maximum, and minimum values. Use with --xml to obtain XML output</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connections </code> </p></th> <td>Print information only about connections specified in [tcp], [tcp default], [sci], [sci default], [shm], or [shm default] sections of cluster configuration file. Cannot be used with --system or --nodes</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --diff-default </code> </p></th> <td>Print only configuration parameters that have non-default values</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--fields=string</code>, </p><p> <code> -f </code> </p></th> <td>Field separator</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --host=name </code> </p></th> <td>Specify host</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --mycnf </code> </p></th> <td>Read configuration data from my.cnf file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --nodeid=# </code> </p></th> <td>Get configuration of node with this ID</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --nodes </code> </p></th> <td>Print node information ([ndbd] or [ndbd default] section of cluster configuration file) only. Cannot be used with --system or --connections</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--query=string</code>, </p><p> <code> -q string </code> </p></th> <td>One or more query options (attributes)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--query-all</code>, </p><p> <code> -a </code> </p></th> <td>Dumps all parameters and values to a single comma-delimited string</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--rows=string</code>, </p><p> <code> -r string </code> </p></th> <td>Row separator</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --system </code> </p></th> <td>Print SYSTEM section information only (see ndb_config --configinfo output). Cannot be used with --nodes or --connections</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --type=name </code> </p></th> <td>Specify node type</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --configinfo --xml </code> </p></th> <td>Use --xml with --configinfo to obtain a dump of all NDB configuration parameters in XML format with default, maximum, and minimum values</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody></table>

* `cluster-config-suffix`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Override defaults group suffix when reading cluster configuration sections in `my.cnf`; used in testing.

* `--configinfo`

  The `--configinfo` option causes **ndb_config** to dump a list of each NDB Cluster configuration parameter supported by the NDB Cluster distribution of which **ndb_config** is a part, including the following information:

  + A brief description of each parameter's purpose, effects, and usage

  + The section of the `config.ini` file where the parameter may be used

  + The parameter's data type or unit of measurement
  + Where applicable, the parameter's default, minimum, and maximum values

  + NDB Cluster release version and build information

  By default, this output is in text format. Part of this output is shown here:

  ```
  $> ndb_config --configinfo

  ****** SYSTEM ******

  Name (String)
  Name of system (NDB Cluster)
  MANDATORY

  PrimaryMGMNode (Non-negative Integer)
  Node id of Primary ndb_mgmd(MGM) node
  Default: 0 (Min: 0, Max: 4294967039)

  ConfigGenerationNumber (Non-negative Integer)
  Configuration generation number
  Default: 0 (Min: 0, Max: 4294967039)

  ****** DB ******

  MaxNoOfSubscriptions (Non-negative Integer)
  Max no of subscriptions (default 0 == MaxNoOfTables)
  Default: 0 (Min: 0, Max: 4294967039)

  MaxNoOfSubscribers (Non-negative Integer)
  Max no of subscribers (default 0 == 2 * MaxNoOfTables)
  Default: 0 (Min: 0, Max: 4294967039)

  …
  ```

  Use this option together with the `--xml` option to obtain output in XML format.

* `--config-binary-file=path-to-file`

  <table summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Gives the path to the management server's cached binary configuration file (`ndb_nodeID_config.bin.seqno`). This may be a relative or absolute path. If the management server and the **ndb_config** binary used reside on different hosts, you must use an absolute path.

  This example demonstrates combining `--config-binary-file` with other **ndb_config** options to obtain useful output:

  ```
  > ndb_config --config-binary-file=ndb_50_config.bin.1 --diff-default --type=ndbd
  config of [DB] node id 5 that is different from default
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  NodeId,5,(mandatory)
  BackupDataDir,/home/jon/data/8.0,(null)
  DataDir,/home/jon/data/8.0,.
  DataMemory,2G,98M
  FileSystemPath,/home/jon/data/8.0,(null)
  HostName,127.0.0.1,localhost
  Nodegroup,0,(null)
  ThreadConfig,,(null)

  config of [DB] node id 6 that is different from default
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  NodeId,6,(mandatory)
  BackupDataDir,/home/jon/data/8.0,(null)
  DataDir,/home/jon/data/8.0,.
  DataMemory,2G,98M
  FileSystemPath,/home/jon/data/8.0,(null)
  HostName,127.0.0.1,localhost
  Nodegroup,0,(null)
  ThreadConfig,,(null)

  > ndb_config --config-binary-file=ndb_50_config.bin.1 --diff-default --system
  config of [SYSTEM] system
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  Name,MC_20220216092809,(mandatory)
  ConfigGenerationNumber,1,0
  PrimaryMGMNode,50,0
  ```

  The relevant portions of the `config.ini` file are shown here:

  ```
  [ndbd default]
  DataMemory= 2G
  NoOfReplicas= 2

  [ndb_mgmd]
  NodeId= 50
  HostName= 127.0.0.1

  [ndbd]
  NodeId= 5
  HostName= 127.0.0.1
  DataDir= /home/jon/data/8.0

  [ndbd]
  NodeId= 6
  HostName= 127.0.0.1
  DataDir= /home/jon/data/8.0
  ```

  By comparing the output with the configuration file, you can see that all of the settings in the file have been written by the management server to the binary cache, and thus, applied to the cluster.

* `--config-file=path-to-file`

  <table summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Gives the path to the cluster configuration file (`config.ini`). This may be a relative or absolute path. If the management server and the **ndb_config** binary used reside on different hosts, you must use an absolute path.

* `--config_from_node=#`

  <table summary="Properties for config_from_node"><tbody><tr><th>Command-Line Format</th> <td><code>--config-from-node=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>48</code></td> </tr></tbody></table>

  Obtain the cluster's configuration data from the data node that has this ID.

  If the node having this ID is not a data node, **ndb_config** fails with an error. (To obtain configuration data from the management node instead, simply omit this option.)

* `--connections`

  <table summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections</code></td> </tr></tbody></table>

  Tells **ndb_config** to print `CONNECTIONS` information only—that is, information about parameters found in the `[tcp]`, `[tcp default]`, `[shm]`, or `[shm default]` sections of the cluster configuration file (see Section 25.4.3.10, “NDB Cluster TCP/IP Connections”, and Section 25.4.3.12, “NDB Cluster Shared-Memory Connections”, for more information).

  This option is mutually exclusive with `--nodes` and `--system`; only one of these 3 options can be used.

* `--diff-default`

  <table summary="Properties for diff-default"><tbody><tr><th>Command-Line Format</th> <td><code>--diff-default</code></td> </tr></tbody></table>

  Print only configuration parameters that have non-default values.

* `--fields=delimiter`, `-f` *`delimiter`*

  <table summary="Properties for fields"><tbody><tr><th>Command-Line Format</th> <td><code>--fields=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Specifies a *`delimiter`* string used to separate the fields in the result. The default is `,` (the comma character).

  Note

  If the *`delimiter`* contains spaces or escapes (such as `\n` for the linefeed character), then it must be quoted.

* `--host=hostname`

  <table summary="Properties for host"><tbody><tr><th>Command-Line Format</th> <td><code>--host=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Specifies the host name of the node for which configuration information is to be obtained.

  Note

  While the hostname `localhost` usually resolves to the IP address `127.0.0.1`, this may not necessarily be true for all operating platforms and configurations. This means that it is possible, when `localhost` is used in `config.ini`, for **ndb_config `--host=localhost`** to fail if **ndb_config** is run on a different host where `localhost` resolves to a different address (for example, on some versions of SUSE Linux, this is `127.0.0.2`). In general, for best results, you should use numeric IP addresses for all NDB Cluster configuration values relating to hosts, or verify that all NDB Cluster hosts handle `localhost` in the same fashion.

* `--mycnf`

  <table summary="Properties for mycnf"><tbody><tr><th>Command-Line Format</th> <td><code>--mycnf</code></td> </tr></tbody></table>

  Read configuration data from the `my.cnf` file.

* `--ndb-connectstring=connection_string`, `-c connection_string`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Specifies the connection string to use in connecting to the management server. The format for the connection string is the same as described in Section 25.4.3.3, “NDB Cluster Connection Strings”, and defaults to `localhost:1186`.

* `--no-defaults`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  Do not read default options from any option file other than login file.

* `--nodeid=node_id`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  Specify the node ID of the node for which configuration information is to be obtained.

* `--nodes`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  Tells **ndb_config** to print information relating only to parameters defined in an `[ndbd]` or `[ndbd default]` section of the cluster configuration file (see Section 25.4.3.6, “Defining NDB Cluster Data Nodes”).

  This option is mutually exclusive with `--connections` and `--system`; only one of these 3 options can be used.

* `--query=query-options`, `-q` *`query-options`*

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  This is a comma-delimited list of query options—that is, a list of one or more node attributes to be returned. These include `nodeid` (node ID), type (node type—that is, `ndbd`, `mysqld`, or `ndb_mgmd`), and any configuration parameters whose values are to be obtained.

  For example, `--query=nodeid,type,datamemory,datadir` returns the node ID, node type, `DataMemory`, and `DataDir` for each node.

  Note

  If a given parameter is not applicable to a certain type of node, than an empty string is returned for the corresponding value. See the examples later in this section for more information.

* `--query-all`, `-a`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

  Returns a comma-delimited list of all query options (node attributes; note that this list is a single string.

* `--rows=separator`, `-r` *`separator`*

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

  Specifies a *`separator`* string used to separate the rows in the result. The default is a space character.

  Note

  If the *`separator`* contains spaces or escapes (such as `\n` for the linefeed character), then it must be quoted.

* `--system`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

  Tells **ndb_config** to print `SYSTEM` information only. This consists of system variables that cannot be changed at run time; thus, there is no corresponding section of the cluster configuration file for them. They can be seen (prefixed with `****** SYSTEM ******`) in the output of **ndb_config** `--configinfo`.

  This option is mutually exclusive with `--nodes` and `--connections`; only one of these 3 options can be used.

* `--type=node_type`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

  Filters results so that only configuration values applying to nodes of the specified *`node_type`* (`ndbd`, `mysqld`, or `ndb_mgmd`) are returned.

* `--usage`, `--help`, or `-?`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

  Causes **ndb_config** to print a list of available options, and then exit.

* `--version`, `-V`

  <table summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>0

  Causes **ndb_config** to print a version information string, and then exit.

* `--configinfo` `--xml`

  <table summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>1

  Cause **ndb_config** `--configinfo` to provide output as XML by adding this option. A portion of such output is shown in this example:

  ```
  $> ndb_config --configinfo --xml

  <configvariables protocolversion="1" ndbversionstring="5.7.44-ndb-7.5.36"
                      ndbversion="460032" ndbversionmajor="7" ndbversionminor="5"
                      ndbversionbuild="0">
    <section name="SYSTEM">
      <param name="Name" comment="Name of system (NDB Cluster)" type="string"
                mandatory="true"/>
      <param name="PrimaryMGMNode" comment="Node id of Primary ndb_mgmd(MGM) node"
                type="unsigned" default="0" min="0" max="4294967039"/>
      <param name="ConfigGenerationNumber" comment="Configuration generation number"
                type="unsigned" default="0" min="0" max="4294967039"/>
    </section>
    <section name="MYSQLD" primarykeys="NodeId">
      <param name="wan" comment="Use WAN TCP setting as default" type="bool"
                default="false"/>
      <param name="HostName" comment="Name of computer for this node"
                type="string" default=""/>
      <param name="Id" comment="NodeId" type="unsigned" mandatory="true"
                min="1" max="255" deprecated="true"/>
      <param name="NodeId" comment="Number identifying application node (mysqld(API))"
                type="unsigned" mandatory="true" min="1" max="255"/>
      <param name="ExecuteOnComputer" comment="HostName" type="string"
                deprecated="true"/>

      …

    </section>

    …

  </configvariables>
  ```

  Note

  Normally, the XML output produced by **ndb_config** `--configinfo` `--xml` is formatted using one line per element; we have added extra whitespace in the previous example, as well as the next one, for reasons of legibility. This should not make any difference to applications using this output, since most XML processors either ignore nonessential whitespace as a matter of course, or can be instructed to do so.

  The XML output also indicates when changing a given parameter requires that data nodes be restarted using the `--initial` option. This is shown by the presence of an `initial="true"` attribute in the corresponding `<param>` element. In addition, the restart type (`system` or `node`) is also shown; if a given parameter requires a system restart, this is indicated by the presence of a `restart="system"` attribute in the corresponding `<param>` element. For example, changing the value set for the `Diskless` parameter requires a system initial restart, as shown here (with the `restart` and `initial` attributes highlighted for visibility):

  ```
  <param name="Diskless" comment="Run wo/ disk" type="bool" default="false"
            restart="system" initial="true"/>
  ```

  Currently, no `initial` attribute is included in the XML output for `<param>` elements corresponding to parameters which do not require initial restarts; in other words, `initial="false"` is the default, and the value `false` should be assumed if the attribute is not present. Similarly, the default restart type is `node` (that is, an online or “rolling” restart of the cluster), but the `restart` attribute is included only if the restart type is `system` (meaning that all cluster nodes must be shut down at the same time, then restarted).

  Deprecated parameters are indicated in the XML output by the `deprecated` attribute, as shown here:

  ```
  <param name="NoOfDiskPagesToDiskAfterRestartACC" comment="DiskCheckpointSpeed"
         type="unsigned" default="20" min="1" max="4294967039" deprecated="true"/>
  ```

  In such cases, the `comment` refers to one or more parameters that supersede the deprecated parameter. Similarly to `initial`, the `deprecated` attribute is indicated only when the parameter is deprecated, with `deprecated="true"`, and does not appear at all for parameters which are not deprecated. (Bug #21127135)

  Parameters that are required are indicated with `mandatory="true"`, as shown here:

  ```
  <param name="NodeId"
            comment="Number identifying application node (mysqld(API))"
            type="unsigned" mandatory="true" min="1" max="255"/>
  ```

  In much the same way that the `initial` or `deprecated` attribute is displayed only for a parameter that requires an initial restart or that is deprecated, the `mandatory` attribute is included only if the given parameter is actually required.

  Important

  The `--xml` option can be used only with the `--configinfo` option. Using `--xml` without `--configinfo` fails with an error.

  Unlike the options used with this program to obtain current configuration data, `--configinfo` and `--xml` use information obtained from the NDB Cluster sources when **ndb_config** was compiled. For this reason, no connection to a running NDB Cluster or access to a `config.ini` or `my.cnf` file is required for these two options.

* `--print-defaults`

  <table summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>2

  Print program argument list and exit.

* `--defaults-file`

  <table summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>3

  Read default options from given file only.

* `--defaults-extra-file`

  <table summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>4

  Read given file after global files are read.

* `--defaults-group-suffix`

  <table summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>5

  Also read groups with concat(group, suffix).

* `--login-path`

  <table summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>6

  Read given path from login file.

* `--help`

  <table summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>7

  Display help text and exit.

* `--connect-string`

  <table summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>8

  Same as `--ndb-connectstring`.

* `--ndb-mgmd-host`

  <table summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Introduced</th> <td>8.0.32-ndb-8.0.32</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>9

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>0

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--core-file`

  <table summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>1

  Write core file on error; used in debugging.

* `--character-sets-dir`

  <table summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>2

  Directory containing character sets.

* `--connect-retries`

  <table summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>3

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>4

  Number of seconds to wait between attempts to contact management server.

* `--ndb-optimized-node-selection`

  <table summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>5

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

Combining other **ndb_config** options (such as `--query` or `--type`) with `--configinfo` (with or without the `--xml` option is not supported. Currently, if you attempt to do so, the usual result is that all other options besides `--configinfo` or `--xml` are simply ignored. *However, this behavior is not guaranteed and is subject to change at any time*. In addition, since **ndb_config**, when used with the `--configinfo` option, does not access the NDB Cluster or read any files, trying to specify additional options such as `--ndb-connectstring` or `--config-file` with `--configinfo` serves no purpose.

#### Examples

1. To obtain the node ID and type of each node in the cluster:

   ```
   $> ./ndb_config --query=nodeid,type --fields=':' --rows='\n'
   1:ndbd
   2:ndbd
   3:ndbd
   4:ndbd
   5:ndb_mgmd
   6:mysqld
   7:mysqld
   8:mysqld
   9:mysqld
   ```

   In this example, we used the `--fields` options to separate the ID and type of each node with a colon character (`:`), and the `--rows` options to place the values for each node on a new line in the output.

2. To produce a connection string that can be used by data, SQL, and API nodes to connect to the management server:

   ```
   $> ./ndb_config --config-file=usr/local/mysql/cluster-data/config.ini \
   --query=hostname,portnumber --fields=: --rows=, --type=ndb_mgmd
   198.51.100.179:1186
   ```

3. This invocation of **ndb_config** checks only data nodes (using the `--type` option), and shows the values for each node's ID and host name, as well as the values set for its `DataMemory` and `DataDir` parameters:

   ```
   $> ./ndb_config --type=ndbd --query=nodeid,host,datamemory,datadir -f ' : ' -r '\n'
   1 : 198.51.100.193 : 83886080 : /usr/local/mysql/cluster-data
   2 : 198.51.100.112 : 83886080 : /usr/local/mysql/cluster-data
   3 : 198.51.100.176 : 83886080 : /usr/local/mysql/cluster-data
   4 : 198.51.100.119 : 83886080 : /usr/local/mysql/cluster-data
   ```

   In this example, we used the short options `-f` and `-r` for setting the field delimiter and row separator, respectively, as well as the short option `-q` to pass a list of parameters to be obtained.

4. To exclude results from any host except one in particular, use the `--host` option:

   ```
   $> ./ndb_config --host=198.51.100.176 -f : -r '\n' -q id,type
   3:ndbd
   5:ndb_mgmd
   ```

   In this example, we also used the short form `-q` to determine the attributes to be queried.

   Similarly, you can limit results to a node with a specific ID using the `--nodeid` option.
