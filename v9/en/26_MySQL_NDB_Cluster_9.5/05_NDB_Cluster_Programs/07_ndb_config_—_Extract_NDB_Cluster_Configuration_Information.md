### 25.5.7 ndb\_config — Extract NDB Cluster Configuration Information

This tool extracts current configuration information for data nodes, SQL nodes, and API nodes from one of a number of sources: an NDB Cluster management node, or its `config.ini` or `my.cnf` file. By default, the management node is the source for the configuration data; to override the default, execute ndb\_config with the `--config-file` or `--mycnf` option. It is also possible to use a data node as the source by specifying its node ID with `--config_from_node=node_id`.

**ndb\_config** can also provide an offline dump of all configuration parameters which can be used, along with their default, maximum, and minimum values and other information. The dump can be produced in either text or XML format; for more information, see the discussion of the `--configinfo` and `--xml` options later in this section).

You can filter the results by section (`DB`, `SYSTEM`, or `CONNECTIONS`) using one of the options `--nodes`, `--system`, or `--connections`.

All options that can be used with **ndb\_config** are shown in the following table. Additional descriptions follow the table.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `cluster-config-suffix`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Override defaults group suffix when reading cluster configuration sections in `my.cnf`; used in testing.

* `--configinfo`

  The `--configinfo` option causes **ndb\_config** to dump a list of each NDB Cluster configuration parameter supported by the NDB Cluster distribution of which **ndb\_config** is a part, including the following information:

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

  <table frame="box" rules="all" summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Gives the path to the management server's cached binary configuration file (`ndb_nodeID_config.bin.seqno`). This may be a relative or absolute path. If the management server and the **ndb\_config** binary used reside on different hosts, you must use an absolute path.

  This example demonstrates combining `--config-binary-file` with other **ndb\_config** options to obtain useful output:

  ```
  $> ndb_config --config-binary-file=../mysql-cluster/ndb_50_config.bin.1 --diff-default --type=ndbd
  config of [DB] node id 5 that is different from default
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  NodeId,5,(mandatory)
  BackupDataDir,/local/data/9.5,(null)
  DataDir,/local/data/9.5,.
  DataMemory,2G,98M
  FileSystemPath,/local/data/9.5,(null)
  HostName,127.0.0.1,localhost
  Nodegroup,0,(null)
  ThreadConfig,,(null)

  config of [DB] node id 6 that is different from default
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  NodeId,6,(mandatory)
  BackupDataDir,/local/data/9.5,(null)
  DataDir,/local/data/9.5.
  DataMemory,2G,98M
  FileSystemPath,/local/data/9.5,(null)
  HostName,127.0.0.1,localhost
  Nodegroup,0,(null)
  ThreadConfig,,(null)

  $> ndb_config --config-binary-file=../mysql-cluster/ndb_50_config.bin.1 --diff-default --system
  config of [SYSTEM] system
  CONFIG_PARAMETER,ACTUAL_VALUE,DEFAULT_VALUE
  Name,MC_20220906060042,(mandatory)
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
  DataDir= /local/data/9.5

  [ndbd]
  NodeId= 6
  HostName= 127.0.0.1
  DataDir= /local/data/9.5
  ```

  By comparing the output with the configuration file, you can see that all of the settings in the file have been written by the management server to the binary cache, and thus, applied to the cluster.

* `--config-file=path-to-file`

  <table frame="box" rules="all" summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Gives the path to the cluster configuration file (`config.ini`). This may be a relative or absolute path. If the management server and the **ndb\_config** binary used reside on different hosts, you must use an absolute path.

* `--config_from_node=#`

  <table frame="box" rules="all" summary="Properties for config_from_node"><tbody><tr><th>Command-Line Format</th> <td><code>--config-from-node=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>48</code></td> </tr></tbody></table>

  Obtain the cluster's configuration data from the data node that has this ID.

  If the node having this ID is not a data node, **ndb\_config** fails with an error. (To obtain configuration data from the management node instead, simply omit this option.)

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--connections`

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Command-Line Format</th> <td><code>--connections</code></td> </tr></tbody></table>

  Tells **ndb\_config** to print `CONNECTIONS` information only—that is, information about parameters found in the `[tcp]`, `[tcp default]`, `[shm]`, or `[shm default]` sections of the cluster configuration file (see Section 25.4.3.10, “NDB Cluster TCP/IP Connections”, and Section 25.4.3.12, “NDB Cluster Shared-Memory Connections”, for more information).

  This option is mutually exclusive with `--nodes` and `--system`; only one of these 3 options can be used.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  Also read groups with concat(group, suffix).

* `--diff-default`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  Print only configuration parameters that have non-default values.

* `--fields=delimiter`, `-f` *`delimiter`*

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  Specifies a *`delimiter`* string used to separate the fields in the result. The default is `,` (the comma character).

  Note

  If the *`delimiter`* contains spaces or escapes (such as `\n` for the linefeed character), then it must be quoted.

* `--help`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

  Display help text and exit.

* `--host=hostname`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

  Specifies the host name of the node for which configuration information is to be obtained.

  Note

  While the hostname `localhost` usually resolves to the IP address `127.0.0.1`, this may not necessarily be true for all operating platforms and configurations. This means that it is possible, when `localhost` is used in `config.ini`, for **ndb\_config `--host=localhost`** to fail if **ndb\_config** is run on a different host where `localhost` resolves to a different address (for example, on some versions of SUSE Linux, this is `127.0.0.2`). In general, for best results, you should use numeric IP addresses for all NDB Cluster configuration values relating to hosts, or verify that all NDB Cluster hosts handle `localhost` in the same fashion.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

  Read given path from login file.

* `--mycnf`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

  Read configuration data from the `my.cnf` file.

* `--ndb-connectstring=connection_string`, `-c connection_string`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

  Specifies the connection string to use in connecting to the management server. The format for the connection string is the same as described in Section 25.4.3.3, “NDB Cluster Connection Strings”, and defaults to `localhost:1186`.

* `--ndb-mgm-tls`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>0

  Sets the level of TLS support required to connect to the management server; one of `relaxed` or `strict`. `relaxed` (the default) means that a TLS connection is attempted, but success is not required; `strict` means that TLS is required to connect.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>1

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>2

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>3

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>4

  Specify a list of directories to search for a CA file. On Unix platforms, the directory names are separated by colons (`:`); on Windows systems, the semicolon character (`;`) is used as the separator. A directory reference may be relative or absolute; it may contain one or more environment variables, each denoted by a prefixed dollar sign (`$`), and expanded prior to use.

  Searching begins with the leftmost named directory and proceeds from left to right until a file is found. An empty string denotes an empty search path, which causes all searches to fail. A string consisting of a single dot (`.`) indicates that the search path limited to the current working directory.

  If no search path is supplied, the compiled-in default value is used. This value depends on the platform used: On Windows, this is `\ndb-tls`; on other platforms (including Linux), it is `$HOME/ndb-tls`. This can be overridden by compiling NDB Cluster using `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>5

  Do not read default options from any option file other than login file.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>6

  Skips reading options from the login path file.

* `--nodeid=node_id`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>7

  Specify the node ID of the node for which configuration information is to be obtained.

* `--nodes`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>8

  Tells **ndb\_config** to print information relating only to parameters defined in an `[ndbd]` or `[ndbd default]` section of the cluster configuration file (see Section 25.4.3.6, “Defining NDB Cluster Data Nodes”).

  This option is mutually exclusive with `--connections` and `--system`; only one of these 3 options can be used.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for config-binary-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-binary-file=path/to/file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>9

  Print program argument list and exit.

* `--query=query-options`, `-q` *`query-options`*

  <table frame="box" rules="all" summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>0

  This is a comma-delimited list of query options—that is, a list of one or more node attributes to be returned. These include `nodeid` (node ID), type (node type—that is, `ndbd`, `mysqld`, or `ndb_mgmd`), and any configuration parameters whose values are to be obtained.

  For example, `--query=nodeid,type,datamemory,datadir` returns the node ID, node type, `DataMemory`, and `DataDir` for each node.

  Note

  If a given parameter is not applicable to a certain type of node, than an empty string is returned for the corresponding value. See the examples later in this section for more information.

* `--query-all`, `-a`

  <table frame="box" rules="all" summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>1

  Returns a comma-delimited list of all query options (node attributes; note that this list is a single string.

* `--rows=separator`, `-r` *`separator`*

  <table frame="box" rules="all" summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>2

  Specifies a *`separator`* string used to separate the rows in the result. The default is a space character.

  Note

  If the *`separator`* contains spaces or escapes (such as `\n` for the linefeed character), then it must be quoted.

* `--system`

  <table frame="box" rules="all" summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>3

  Tells **ndb\_config** to print `SYSTEM` information only. This consists of system variables that cannot be changed at run time; thus, there is no corresponding section of the cluster configuration file for them. They can be seen (prefixed with `****** SYSTEM ******`) in the output of **ndb\_config** `--configinfo`.

  This option is mutually exclusive with `--nodes` and `--connections`; only one of these 3 options can be used.

* `--type=node_type`

  <table frame="box" rules="all" summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>4

  Filters results so that only configuration values applying to nodes of the specified *`node_type`* (`ndbd`, `mysqld`, or `ndb_mgmd`) are returned.

* `--usage`, `--help`, or `-?`

  <table frame="box" rules="all" summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>5

  Causes **ndb\_config** to print a list of available options, and then exit.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>6

  Causes **ndb\_config** to print a version information string, and then exit.

* `--configinfo` `--xml`

  <table frame="box" rules="all" summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>7

  Cause **ndb\_config** `--configinfo` to provide output as XML by adding this option. A portion of such output is shown in this example:

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

  Normally, the XML output produced by **ndb\_config** `--configinfo` `--xml` is formatted using one line per element; we have added extra whitespace in the previous example, as well as the next one, for reasons of legibility. This should not make any difference to applications using this output, since most XML processors either ignore nonessential whitespace as a matter of course, or can be instructed to do so.

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

  Unlike the options used with this program to obtain current configuration data, `--configinfo` and `--xml` use information obtained from the NDB Cluster sources when **ndb\_config** was compiled. For this reason, no connection to a running NDB Cluster or access to a `config.ini` or `my.cnf` file is required for these two options.

Combining other **ndb\_config** options (such as `--query` or `--type`) with `--configinfo` (with or without the `--xml` option is not supported. Currently, if you attempt to do so, the usual result is that all other options besides `--configinfo` or `--xml` are simply ignored. *However, this behavior is not guaranteed and is subject to change at any time*. In addition, since **ndb\_config**, when used with the `--configinfo` option, does not access the NDB Cluster or read any files, trying to specify additional options such as `--ndb-connectstring` or `--config-file` with `--configinfo` serves no purpose.

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

3. This invocation of **ndb\_config** checks only data nodes (using the `--type` option), and shows the values for each node's ID and host name, as well as the values set for its `DataMemory` and `DataDir` parameters:

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
