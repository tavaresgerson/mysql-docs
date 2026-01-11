### 25.5.5 ndb_mgm — The NDB Cluster Management Client

The **ndb_mgm** management client process is actually not needed to run the cluster. Its value lies in providing a set of commands for checking the cluster's status, starting backups, and performing other administrative functions. The management client accesses the management server using a C API. Advanced users can also employ this API for programming dedicated management processes to perform tasks similar to those performed by **ndb_mgm**.

To start the management client, it is necessary to supply the host name and port number of the management server:

```
$> ndb_mgm [host_name [port_num
```

For example:

```
$> ndb_mgm ndb_mgmd.mysql.com 1186
```

The default host name and port number are `localhost` and 1186, respectively.

All options that can be used with **ndb_mgm** are shown in the following table. Additional descriptions follow the table.

**Table 25.27 Command-line options used with the program ndb_mgm**

<table frame="box" rules="all"><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code> --backup-password-from-stdin </code> </p></th> <td>Get decryption password in a secure fashion from STDIN; use together with --execute and ndb_mgm START BACKUP command</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Set number of times to retry connection before giving up; 0 means 1 attempt only (and no retries)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --encrypt-backup </code> </p></th> <td>Cause START BACKUP to encrypt whenever making a backup, prompting for password if not supplied by user</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--execute=command</code>, </p><p> <code> -e command </code> </p></th> <td>Execute command and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--try-reconnect=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_try-reconnect">-t
                #</a> </code> </p></th> <td>Set number of times to retry connection before giving up; synonym for --connect-retries</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody></table>

* `--backup-password-from-stdin[=TRUE|FALSE]`

  <table summary="Properties for backup-password-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>

  This option enables input of the backup password from the system shell (`stdin`) when using `--execute "START BACKUP"` or similar to create a backup. Use of this option requires use of `--execute` as well.

* `--character-sets-dir`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries=#`

  <table summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  This option specifies the number of times following the first attempt to retry a connection before giving up (the client always tries the connection at least once). The length of time to wait per attempt is set using `--connect-retry-delay`.

  This option is synonymous with the `--try-reconnect` option, which is now deprecated.

* `--connect-retry-delay`

  <table summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table summary="Properties for connect-string"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table summary="Properties for core-file"><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--defaults-extra-file`

  <table summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table summary="Properties for defaults-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table summary="Properties for defaults-group-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--encrypt-backup`

  <table summary="Properties for backup-password-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>0

  When used, this option causes all backups to be encrypted. To make this happen whenever **ndb_mgm** is run, put the option in the `[ndb_mgm]` section of the `my.cnf` file.

* `--execute=command`, `-e command`

  <table summary="Properties for backup-password-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>1

  This option can be used to send a command to the NDB Cluster management client from the system shell. For example, either of the following is equivalent to executing `SHOW` in the management client:

  ```
  $> ndb_mgm -e "SHOW"

  $> ndb_mgm --execute="SHOW"
  ```

  This is analogous to how the `--execute` or `-e` option works with the **mysql** command-line client. See Section 6.2.2.1, “Using Options on the Command Line”.

  Note

  If the management client command to be passed using this option contains any space characters, then the command *must* be enclosed in quotation marks. Either single or double quotation marks may be used. If the management client command contains no space characters, the quotation marks are optional.

* `--help`

  <table summary="Properties for backup-password-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>2

  Display help text and exit.

* `--login-path`

  <table summary="Properties for backup-password-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>3

  Read given path from login file.

* `--ndb-connectstring`

  <table summary="Properties for backup-password-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>4

  Set connect string for connecting to **ndb_mgmd**. Syntax: [`nodeid=id;`][`host=`]`hostname`[`:port`]. Overrides entries in `NDB_CONNECTSTRING` and `my.cnf`.

* `--ndb-nodeid`

  <table summary="Properties for backup-password-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>5

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-mgmd-host`

  <table summary="Properties for backup-password-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>6

  Same as `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table summary="Properties for backup-password-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>7

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table summary="Properties for backup-password-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>8

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table summary="Properties for backup-password-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>9

  Print program argument list and exit.

* `--try-reconnect=number`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

  If the connection to the management server is broken, the node tries to reconnect to it every 5 seconds until it succeeds. By using this option, it is possible to limit the number of attempts to *`number`* before giving up and reporting an error instead.

  This option is deprecated and subject to removal in a future release. Use `--connect-retries`, instead.

* `--usage`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

  Display help text and exit; same as `--help`.

* `--version`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

  Display version information and exit.

Additional information about using **ndb_mgm** can be found in Section 25.6.1, “Commands in the NDB Cluster Management Client”.
