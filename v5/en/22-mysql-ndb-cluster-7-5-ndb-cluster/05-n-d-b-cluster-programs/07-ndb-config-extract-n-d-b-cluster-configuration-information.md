### 21.5.7 ndb\_config — Extract NDB Cluster Configuration Information

This tool extracts current configuration information for data nodes, SQL nodes, and API nodes from one of a number of sources: an NDB Cluster management node, or its `config.ini` or `my.cnf` file. By default, the management node is the source for the configuration data; to override the default, execute ndb\_config with the [`--config-file`](mysql-cluster-programs-ndb-config.html#option_ndb_config_config-file) or [`--mycnf`](mysql-cluster-programs-ndb-config.html#option_ndb_config_mycnf) option. It is also possible to use a data node as the source by specifying its node ID with [`--config_from_node=node_id`](mysql-cluster-programs-ndb-config.html#option_ndb_config_config_from_node).

[**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") can also provide an offline dump of all configuration parameters which can be used, along with their default, maximum, and minimum values and other information. The dump can be produced in either text or XML format; for more information, see the discussion of the [`--configinfo`](mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo) and [`--xml`](mysql-cluster-programs-ndb-config.html#option_ndb_config_xml) options later in this section).

You can filter the results by section (`DB`, `SYSTEM`, or `CONNECTIONS`) using one of the options [`--nodes`](mysql-cluster-programs-ndb-config.html#option_ndb_config_nodes), [`--system`](mysql-cluster-programs-ndb-config.html#option_ndb_config_system), or [`--connections`](mysql-cluster-programs-ndb-config.html#option_ndb_config_connections).

Options that can be used with [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") are shown in the following table. Additional descriptions follow the table.

**Table 21.27 Command-line options used with the program ndb\_config**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_character-sets-dir">--character-sets-dir=path</a> </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_config-file">--config-file=file_name</a> </code> </p></th> <td>Set the path to config.ini file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_config_from_node">--config-from-node=#</a> </code> </p></th> <td>Obtain configuration data from the node having this ID (must be a data node)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo">--configinfo</a> </code> </p></th> <td>Dumps information about all NDB configuration parameters in text format with default, maximum, and minimum values. Use with --xml to obtain XML output</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_connections">--connections</a> </code> </p></th> <td>Print information only about connections specified in [tcp], [tcp default], [sci], [sci default], [shm], or [shm default] sections of cluster configuration file. Cannot be used with --system or --nodes</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_connect-retries">--connect-retries=#</a> </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_connect-retry-delay">--connect-retry-delay=#</a> </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_connect-string">--connect-string=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_core-file">--core-file</a> </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-extra-file">--defaults-extra-file=path</a> </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-file">--defaults-file=path</a> </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_defaults-group-suffix">--defaults-group-suffix=string</a> </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_diff-default">--diff-default</a> </code> </p></th> <td>Print only configuration parameters that have non-default values</td> <td><p> ADDED: NDB 7.5.7, NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_fields">--fields=string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_fields">-f</a> </code> </p></th> <td>Field separator</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_help">--help</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_help">-?</a> </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_host">--host=name</a> </code> </p></th> <td>Specify host</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_login-path">--login-path=path</a> </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_mycnf">--mycnf</a> </code> </p></th> <td>Read configuration data from my.cnf file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-connectstring">--ndb-connectstring=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-nodeid">--ndb-nodeid=#</a> </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-optimized-node-selection">--ndb-optimized-node-selection</a> </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_no-defaults">--no-defaults</a> </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_nodeid">--nodeid=#</a> </code> </p></th> <td>Get configuration of node with this ID</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_nodes">--nodes</a> </code> </p></th> <td>Print node information ([ndbd] or [ndbd default] section of cluster configuration file) only. Cannot be used with --system or --connections</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_query">--query=string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_query">-q string</a> </code> </p></th> <td>One or more query options (attributes)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_query-all">--query-all</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_query-all">-a</a> </code> </p></th> <td>Dumps all parameters and values to a single comma-delimited string</td> <td><p> ADDED: NDB 7.4.16, NDB 7.5.7 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_print-defaults">--print-defaults</a> </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_rows">--rows=string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_rows">-r string</a> </code> </p></th> <td>Row separator</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_system">--system</a> </code> </p></th> <td>Print SYSTEM section information only (see ndb_config --configinfo output). Cannot be used with --nodes or --connections</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_type">--type=name</a> </code> </p></th> <td>Specify node type</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_usage">--usage</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_usage">-?</a> </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_version">--version</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_version">-V</a> </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_xml">--configinfo --xml</a> </code> </p></th> <td>Use --xml with --configinfo to obtain a dump of all NDB configuration parameters in XML format with default, maximum, and minimum values</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--configinfo`

  The `--configinfo` option causes [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") to dump a list of each NDB Cluster configuration parameter supported by the NDB Cluster distribution of which [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") is a part, including the following information:

  + A brief description of each parameter's purpose, effects, and usage

  + The section of the `config.ini` file where the parameter may be used

  + The parameter's data type or unit of measurement
  + Where applicable, the parameter's default, minimum, and maximum values

  + NDB Cluster release version and build information

  By default, this output is in text format. Part of this output is shown here:

  ```sql
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

  Use this option together with the [`--xml`](mysql-cluster-programs-ndb-config.html#option_ndb_config_xml) option to obtain output in XML format.

* `--config-file=path-to-file`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>

  Gives the path to the management server's configuration file (`config.ini`). This may be a relative or absolute path. If the management node resides on a different host from the one on which [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") is invoked, then an absolute path must be used.

* `--config_from_node=#`

  <table frame="box" rules="all" summary="Properties for config_from_node"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-from-node=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code class="literal">none</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">48</code></td> </tr></tbody></table>

  Obtain the cluster's configuration data from the data node that has this ID.

  If the node having this ID is not a data node, [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") fails with an error. (To obtain configuration data from the management node instead, simply omit this option.)

* `--connections`

  <table frame="box" rules="all" summary="Properties for connections"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connections</code></td> </tr></tbody></table>

  Tells [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") to print `CONNECTIONS` information only—that is, information about parameters found in the `[tcp]`, `[tcp default]`, `[shm]`, or `[shm default]` sections of the cluster configuration file (see [Section 21.4.3.10, “NDB Cluster TCP/IP Connections”](mysql-cluster-tcp-definition.html "21.4.3.10 NDB Cluster TCP/IP Connections"), and [Section 21.4.3.12, “NDB Cluster Shared Memory Connections”](mysql-cluster-shm-definition.html "21.4.3.12 NDB Cluster Shared Memory Connections"), for more information).

  This option is mutually exclusive with [`--nodes`](mysql-cluster-programs-ndb-config.html#option_ndb_config_nodes) and [`--system`](mysql-cluster-programs-ndb-config.html#option_ndb_config_system); only one of these 3 options can be used.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">12</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">5</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>0

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>1

  Also read groups with concat(group, suffix).

* `--diff-default`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>2

  Print only configuration parameters that have non-default values.

* `--fields=delimiter`, `-f` *`delimiter`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>3

  Specifies a *`delimiter`* string used to separate the fields in the result. The default is `,` (the comma character).

  Note

  If the *`delimiter`* contains spaces or escapes (such as `\n` for the linefeed character), then it must be quoted.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>4

  Display help text and exit.

* `--host=hostname`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>5

  Specifies the host name of the node for which configuration information is to be obtained.

  Note

  While the hostname `localhost` usually resolves to the IP address `127.0.0.1`, this may not necessarily be true for all operating platforms and configurations. This means that it is possible, when `localhost` is used in `config.ini`, for [**ndb\_config `--host=localhost`**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") to fail if [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") is run on a different host where `localhost` resolves to a different address (for example, on some versions of SUSE Linux, this is `127.0.0.2`). In general, for best results, you should use numeric IP addresses for all NDB Cluster configuration values relating to hosts, or verify that all NDB Cluster hosts handle `localhost` in the same fashion.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>6

  Read given path from login file.

* `--mycnf`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>7

  Read configuration data from the `my.cnf` file.

* `--ndb-connectstring=connection_string`, `-c connection_string`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>8

  Specifies the connection string to use in connecting to the management server. The format for the connection string is the same as described in [Section 21.4.3.3, “NDB Cluster Connection Strings”](mysql-cluster-connection-strings.html "21.4.3.3 NDB Cluster Connection Strings"), and defaults to `localhost:1186`.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>9

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>0

  Set node ID for this node, overriding any ID set by [`--ndb-connectstring`](mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>1

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>2

  Do not read default options from any option file other than login file.

* `--nodeid=node_id`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>3

  Specify the node ID of the node for which configuration information is to be obtained. Formerly, `--id` could be used as a synonym for this option; in NDB 7.5 and later, the only form accepted is `--nodeid`.

* `--nodes`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>4

  Tells [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") to print information relating only to parameters defined in an `[ndbd]` or `[ndbd default]` section of the cluster configuration file (see [Section 21.4.3.6, “Defining NDB Cluster Data Nodes”](mysql-cluster-ndbd-definition.html "21.4.3.6 Defining NDB Cluster Data Nodes")).

  This option is mutually exclusive with [`--connections`](mysql-cluster-programs-ndb-config.html#option_ndb_config_connections) and [`--system`](mysql-cluster-programs-ndb-config.html#option_ndb_config_system); only one of these 3 options can be used.

* `--query=query-options`, `-q` *`query-options`*

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>5

  This is a comma-delimited list of query options—that is, a list of one or more node attributes to be returned. These include `nodeid` (node ID), type (node type—that is, `ndbd`, `mysqld`, or `ndb_mgmd`), and any configuration parameters whose values are to be obtained.

  For example, `--query=nodeid,type,datamemory,datadir` returns the node ID, node type, [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory), and [`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir) for each node.

  Formerly, `id` was accepted as a synonym for `nodeid`, but has been removed in NDB 7.5 and later.

  Note

  If a given parameter is not applicable to a certain type of node, than an empty string is returned for the corresponding value. See the examples later in this section for more information.

* `--query-all`, `-a`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>6

  Returns a comma-delimited list of all query options (node attributes; note that this list is a single string.

  This option was introduced in NDB 7.5.7 (Bug #60095, Bug
  #11766869).

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>7

  Print program argument list and exit.

* `--rows=separator`, `-r` *`separator`*

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>8

  Specifies a *`separator`* string used to separate the rows in the result. The default is a space character.

  Note

  If the *`separator`* contains spaces or escapes (such as `\n` for the linefeed character), then it must be quoted.

* `--system`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal"></code></td> </tr></tbody></table>9

  Tells [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") to print `SYSTEM` information only. This consists of system variables that cannot be changed at run time; thus, there is no corresponding section of the cluster configuration file for them. They can be seen (prefixed with `****** SYSTEM ******`) in the output of [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") [`--configinfo`](mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo).

  This option is mutually exclusive with [`--nodes`](mysql-cluster-programs-ndb-config.html#option_ndb_config_nodes) and [`--connections`](mysql-cluster-programs-ndb-config.html#option_ndb_config_connections); only one of these 3 options can be used.

* `--type=node_type`

  <table frame="box" rules="all" summary="Properties for config_from_node"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-from-node=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code class="literal">none</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">48</code></td> </tr></tbody></table>0

  Filters results so that only configuration values applying to nodes of the specified *`node_type`* (`ndbd`, `mysqld`, or `ndb_mgmd`) are returned.

* `--usage`, `--help`, or `-?`

  <table frame="box" rules="all" summary="Properties for config_from_node"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-from-node=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code class="literal">none</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">48</code></td> </tr></tbody></table>1

  Causes [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") to print a list of available options, and then exit. Synonym for [`--help`](mysql-cluster-programs-ndb-config.html#option_ndb_config_help).

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for config_from_node"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-from-node=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code class="literal">none</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">48</code></td> </tr></tbody></table>2

  Causes [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") to print a version information string, and then exit.

* `--configinfo` `--xml`

  <table frame="box" rules="all" summary="Properties for config_from_node"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-from-node=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code class="literal">none</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">48</code></td> </tr></tbody></table>3

  Cause [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") [`--configinfo`](mysql-cluster-programs-ndb-config.html#option_ndb_config_configinfo) to provide output as XML by adding this option. A portion of such output is shown in this example:

  ```sql
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

  Normally, the XML output produced by [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") `--configinfo` `--xml` is formatted using one line per element; we have added extra whitespace in the previous example, as well as the next one, for reasons of legibility. This should not make any difference to applications using this output, since most XML processors either ignore nonessential whitespace as a matter of course, or can be instructed to do so.

  The XML output also indicates when changing a given parameter requires that data nodes be restarted using the [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) option. This is shown by the presence of an `initial="true"` attribute in the corresponding `<param>` element. In addition, the restart type (`system` or `node`) is also shown; if a given parameter requires a system restart, this is indicated by the presence of a `restart="system"` attribute in the corresponding `<param>` element. For example, changing the value set for the [`Diskless`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskless) parameter requires a system initial restart, as shown here (with the `restart` and `initial` attributes highlighted for visibility):

  ```sql
  <param name="Diskless" comment="Run wo/ disk" type="bool" default="false"
            restart="system" initial="true"/>
  ```

  Currently, no `initial` attribute is included in the XML output for `<param>` elements corresponding to parameters which do not require initial restarts; in other words, `initial="false"` is the default, and the value `false` should be assumed if the attribute is not present. Similarly, the default restart type is `node` (that is, an online or “rolling” restart of the cluster), but the `restart` attribute is included only if the restart type is `system` (meaning that all cluster nodes must be shut down at the same time, then restarted).

  Deprecated parameters are indicated in the XML output by the `deprecated` attribute, as shown here:

  ```sql
  <param name="NoOfDiskPagesToDiskAfterRestartACC" comment="DiskCheckpointSpeed"
         type="unsigned" default="20" min="1" max="4294967039" deprecated="true"/>
  ```

  In such cases, the `comment` refers to one or more parameters that supersede the deprecated parameter. Similarly to `initial`, the `deprecated` attribute is indicated only when the parameter is deprecated, with `deprecated="true"`, and does not appear at all for parameters which are not deprecated. (Bug #21127135)

  Beginning with NDB 7.5.0, parameters that are required are indicated with `mandatory="true"`, as shown here:

  ```sql
  <param name="NodeId"
            comment="Number identifying application node (mysqld(API))"
            type="unsigned" mandatory="true" min="1" max="255"/>
  ```

  In much the same way that the `initial` or `deprecated` attribute is displayed only for a parameter that requires an intial restart or that is deprecated, the `mandatory` attribute is included only if the given parameter is actually required.

  Important

  The `--xml` option can be used only with the `--configinfo` option. Using `--xml` without `--configinfo` fails with an error.

  Unlike the options used with this program to obtain current configuration data, `--configinfo` and `--xml` use information obtained from the NDB Cluster sources when [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") was compiled. For this reason, no connection to a running NDB Cluster or access to a `config.ini` or `my.cnf` file is required for these two options.

Combining other [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") options (such as [`--query`](mysql-cluster-programs-ndb-config.html#option_ndb_config_query) or [`--type`](mysql-cluster-programs-ndb-config.html#option_ndb_config_type)) with `--configinfo` (with or without the `--xml` option is not supported. Currently, if you attempt to do so, the usual result is that all other options besides `--configinfo` or `--xml` are simply ignored. *However, this behavior is not guaranteed and is subject to change at any time*. In addition, since [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information"), when used with the `--configinfo` option, does not access the NDB Cluster or read any files, trying to specify additional options such as `--ndb-connectstring` or `--config-file` with `--configinfo` serves no purpose.

#### Examples

1. To obtain the node ID and type of each node in the cluster:

   ```sql
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

   In this example, we used the [`--fields`](mysql-cluster-programs-ndb-config.html#option_ndb_config_fields) options to separate the ID and type of each node with a colon character (`:`), and the [`--rows`](mysql-cluster-programs-ndb-config.html#option_ndb_config_rows) options to place the values for each node on a new line in the output.

2. To produce a connection string that can be used by data, SQL, and API nodes to connect to the management server:

   ```sql
   $> ./ndb_config --config-file=usr/local/mysql/cluster-data/config.ini \
   --query=hostname,portnumber --fields=: --rows=, --type=ndb_mgmd
   198.51.100.179:1186
   ```

3. This invocation of [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information") checks only data nodes (using the [`--type`](mysql-cluster-programs-ndb-config.html#option_ndb_config_type) option), and shows the values for each node's ID and host name, as well as the values set for its [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) and [`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir) parameters:

   ```sql
   $> ./ndb_config --type=ndbd --query=nodeid,host,datamemory,datadir -f ' : ' -r '\n'
   1 : 198.51.100.193 : 83886080 : /usr/local/mysql/cluster-data
   2 : 198.51.100.112 : 83886080 : /usr/local/mysql/cluster-data
   3 : 198.51.100.176 : 83886080 : /usr/local/mysql/cluster-data
   4 : 198.51.100.119 : 83886080 : /usr/local/mysql/cluster-data
   ```

   In this example, we used the short options `-f` and `-r` for setting the field delimiter and row separator, respectively, as well as the short option `-q` to pass a list of parameters to be obtained.

4. To exclude results from any host except one in particular, use the [`--host`](mysql-cluster-programs-ndb-config.html#option_ndb_config_host) option:

   ```sql
   $> ./ndb_config --host=198.51.100.176 -f : -r '\n' -q id,type
   3:ndbd
   5:ndb_mgmd
   ```

   In this example, we also used the short form `-q` to determine the attributes to be queried.

   Similarly, you can limit results to a node with a specific ID using the [`--nodeid`](mysql-cluster-programs-ndb-config.html#option_ndb_config_nodeid) option.
