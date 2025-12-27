### 25.5.28 ndb\_sign\_keys — Create, Sign, and Manage TLS Keys and Certificates for NDB Cluster

Management of TLS keys and certificates in implemented in NDB Cluster as the executable utility program **ndb\_sign\_keys**, which can normally be found in the MySQL `bin` directory. The program performs such functions as creating, signing, and retiring keys and certificates, and normally works as follows:

1. **ndb\_sign\_keys** connects to **ndb\_mgmd** and fetches the cluster' configuration.

2. For each cluster node that is configured to run on the local machine, **ndb\_sign\_keys** finds the node' private key and sign it, creating an active node certificate.

Some additional tasks that can be performed by **ndb\_sign\_keys** are listed here:

* Obtaining configuration information from a config.ini file rather than a running **ndb\_mgmd**

* Creating the cluster' certificate authority (CA) if it does not yet exist

* Creating private keys
* Saving keys and certificates as pending rather than active
* Signing the key for a single node as specified using command-line options described later in this section

* Requesting a CA located on a remote host to sign a local key

Options that can be used with **ndb\_sign\_keys** are shown in the following table. Additional descriptions follow the table.

* `--bind-host`

  <table frame="box" rules="all" summary="Properties for bind-host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bind-host=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mgmd, api</code></td> </tr></tbody></table>

  Create a certificate bound to a hostname list of node types that should have certificate hostname bindings, from the set `(mgmd,db,api)`.

* `--bound-hostname`

  <table frame="box" rules="all" summary="Properties for bound-hostname"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bound-hostname=hostname</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Create a certificate bound to the hostname passed to this option.

* `--CA-cert`

  <table frame="box" rules="all" summary="Properties for CA-cert"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-cert=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-cert</code></td> </tr></tbody></table>

  Use the name passed to this option for the CA Certificate file.

* `--CA-key`

  <table frame="box" rules="all" summary="Properties for CA-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-key=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-private-key</code></td> </tr></tbody></table>

  Use the name passed to this option for the CA private key file.

* `--CA-ordinal`

  <table frame="box" rules="all" summary="Properties for CA-ordinal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-ordinal=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">First</code></p><p class="valid-value"><code class="literal">Second</code></p></td> </tr></tbody></table>

  Set the ordinal CA name; defaults to `First` for `--create-CA` and `Second` for `--rotate-CA`. The Common Name in the CA certificate is “MySQL NDB Cluster *`ordinal`* Certificate”, where *`ordinal`* is the ordinal name passed to this option.

* `--CA-search-path`

  <table frame="box" rules="all" summary="Properties for CA-search-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-search-path=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Specify a list of directories to search for a CA file. On Unix platforms, the directory names are separated by colons (`:`); on Windows systems, the semicolon character (`;`) is used as the separator. A directory reference may be relative or absolute; it may contain one or more environment variables, each denoted by a prefixed dollar sign (`$`), and expanded prior to use.

  Searching begins with the leftmost named directory and proceeds from left to right until a file is found. An empty string denotes an empty search path, which causes all searches to fail. A string consisting of a single dot (`.`) indicates that the search path is limited to the current working directory.

  If no search path is supplied, the compiled-in default value is used. This value depends on the platform used: On Windows, this is `$HOMEPATH\ndb-tls`; on other platforms (including Linux), it is `$HOME/ndb-tls`. This default can be overridden by compiling NDB Cluster using `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--CA-tool`

  <table frame="box" rules="all" summary="Properties for CA-tool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-tool=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Designate an executable helper tool, including the path.

* `--check`

  <table frame="box" rules="all" summary="Properties for check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--check</code></td> </tr></tbody></table>

  Check certificate expiry dates.

* `--config-file`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">no-config</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Supply the path to the cluster configuration file (usually `config.ini`).

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">12</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">-1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">12</code></td> </tr></tbody></table>

  Set the number of times that **ndb\_sign\_keys** attempts to connect to the cluster. If you use `-1`, the program keeps trying to connect until it succeeds or is forced to stop.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for bound-hostname"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bound-hostname=hostname</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>0

  Set the number of seconds after a failed connection attempt which **ndb\_sign\_keys** waits before trying again, up to the number of times determined by `--connect-retries`.

* `--create-CA`

  <table frame="box" rules="all" summary="Properties for bound-hostname"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bound-hostname=hostname</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>1

  Create the CA key and certificate.

* `--CA-days`

  <table frame="box" rules="all" summary="Properties for bound-hostname"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bound-hostname=hostname</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>2

  Set the lifetime of the certificate to this many days. The default is equivalent to 4 years plus 1 day. `-1` means the certificate never expires.

  This option was added in NDB 8.4.1.

* `--create-key`

  <table frame="box" rules="all" summary="Properties for bound-hostname"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bound-hostname=hostname</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>3

  Create or replace private keys.

* `--curve`

  <table frame="box" rules="all" summary="Properties for bound-hostname"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bound-hostname=hostname</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>4

  Use the named curve for encrypting node keys.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for bound-hostname"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bound-hostname=hostname</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>5

  Read this option file after the global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for bound-hostname"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bound-hostname=hostname</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>6

  Read this option file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for bound-hostname"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bound-hostname=hostname</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>7

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`string`*.

* `--duration`

  <table frame="box" rules="all" summary="Properties for bound-hostname"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bound-hostname=hostname</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>8

  Set the lifetime of certificates or signing requests, in seconds.

* `--help`

  <table frame="box" rules="all" summary="Properties for bound-hostname"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bound-hostname=hostname</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>9

  Print help text and exit.

* `--keys-to-dir`

  <table frame="box" rules="all" summary="Properties for CA-cert"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-cert=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-cert</code></td> </tr></tbody></table>0

  Specify output directory for private keys (only); for this purpose, it overrides any value set for `--to-dir`.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for CA-cert"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-cert=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-cert</code></td> </tr></tbody></table>1

  Read this path from the login file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for CA-cert"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-cert=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-cert</code></td> </tr></tbody></table>2

  Set the connection string to use for connecting to **ndb\_mgmd**, using the syntax `[nodeid=id;][host=]hostname[:port]`. If this option is set, it overrides the value set for `NDB_CONNECTSTRING` (if any), as well as any value set in a `my.cnf`. file.

* `--ndb-mgm-tls`

  <table frame="box" rules="all" summary="Properties for CA-cert"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-cert=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-cert</code></td> </tr></tbody></table>3

  Sets the level of TLS support required for the **ndb\_mgm** client; one of `relaxed` or `strict`. `relaxed` (the default) means that a TLS connection is attempted, but success is not required; `strict` means that TLS is required to connect.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Properties for CA-cert"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-cert=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-cert</code></td> </tr></tbody></table>4

  Specify a list of directories containing TLS keys and certificates.

  For syntax, see the description of the `--CA-search-path` option.

* `--no-config`

  <table frame="box" rules="all" summary="Properties for CA-cert"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-cert=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-cert</code></td> </tr></tbody></table>5

  Do not obtain the cluster configuration; create a single certificate based on the options supplied (including defaults for those not specified).

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for CA-cert"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-cert=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-cert</code></td> </tr></tbody></table>6

  Do not read default options from any option file other than the login file.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Properties for CA-cert"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-cert=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-cert</code></td> </tr></tbody></table>7

  Do not read login paths from the login path file.

* `--passphrase`

  <table frame="box" rules="all" summary="Properties for CA-cert"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-cert=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-cert</code></td> </tr></tbody></table>8

  Specify a CA key pass phrase.

* `--node-id`

  <table frame="box" rules="all" summary="Properties for CA-cert"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-cert=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-cert</code></td> </tr></tbody></table>9

  Create or sign a key for the node having the specified node ID.

* `--node-type`

  <table frame="box" rules="all" summary="Properties for CA-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-key=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-private-key</code></td> </tr></tbody></table>0

  Create or sign keys for the specified type or types from the set `(mgmd,db,api)`.

* `--pending`

  <table frame="box" rules="all" summary="Properties for CA-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-key=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-private-key</code></td> </tr></tbody></table>1

  Save keys and certificates as pending, rather than active.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for CA-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-key=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-private-key</code></td> </tr></tbody></table>2

  Print the program argument list, then exit.

* `--promote`

  <table frame="box" rules="all" summary="Properties for CA-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-key=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-private-key</code></td> </tr></tbody></table>3

  Promote pending files to active, then exit.

* `--remote-CA-host`

  <table frame="box" rules="all" summary="Properties for CA-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-key=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-private-key</code></td> </tr></tbody></table>4

  Specify the address or hostname of a remote CA host.

* `--remote-exec-path`

  <table frame="box" rules="all" summary="Properties for CA-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-key=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-private-key</code></td> </tr></tbody></table>5

  Provide the full path to an executable on the remote CA host specified with `--remote-CA-host`.

* `--remote-openssl`

  <table frame="box" rules="all" summary="Properties for CA-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-key=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-private-key</code></td> </tr></tbody></table>6

  Use OpenSSL for signing of keys on the remote CA host specified with `--remote-CA-host`.

* `--replace-by`

  <table frame="box" rules="all" summary="Properties for CA-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-key=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-private-key</code></td> </tr></tbody></table>7

  Suggest a certificate replacement date for periodic checks, as a number of days after the CA expiration date. Use a negative number to indicate days before expiration.

* `--rotate-CA`

  <table frame="box" rules="all" summary="Properties for CA-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-key=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-private-key</code></td> </tr></tbody></table>8

  Replace an older CA with a newer one. The new CA can be created using OpenSSL, or you can allow **ndb\_sign\_keys** to create the new one, in which case the new CA is created with an intermediate CA certificate, signed by the old CA.

* `--schedule`

  <table frame="box" rules="all" summary="Properties for CA-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-key=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">NDB-Cluster-private-key</code></td> </tr></tbody></table>9

  Assign a schedule of expiration dates to certificates. The schedule is defined as a comma-delimited list of six integers, in the format shown here:

  ```
  api_valid,api_extra,dn_valid,dn_extra,mgm_valid,mgm_extra
  ```

  These values are defined as follows:

  + `api_valid`: A fixed number of days of validity for client certificates.

    `api_extra`: A number of extra days for client certificates.

    `dn_valid`: A fixed number of days of validity for client certificates for data node certificates.

    `dn_extra`: A number of extra days for data node certificates.

    `mgm_valid`: A fixed number of days of validity for management server certificates.

    `mgm_extra`: A number of extra days for management server certificates.

  In other words, for each node type (API node, data node, management node), certificates are created with a lifetime equal to a whole fixed number of days, plus some random amount of time less than or equal to the number of extra days. The default schedule is shown here:

  ```
  --schedule=120,10,130,10,150,0
  ```

  Following the default schedule, client certificates begin expiring on the 120th day, and expire at random intervals over the next 10 days; data node certificates expire at random times between the 130th and 140th days; and management node certificates expire on the 150th day (with no random interval following).

* `--sign`

  <table frame="box" rules="all" summary="Properties for CA-ordinal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-ordinal=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">First</code></p><p class="valid-value"><code class="literal">Second</code></p></td> </tr></tbody></table>0

  Create signed certificates; enabled by default. Use `--skip-sign` to create certificate signing requests instead.

* `--skip-sign`

  <table frame="box" rules="all" summary="Properties for CA-ordinal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-ordinal=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">First</code></p><p class="valid-value"><code class="literal">Second</code></p></td> </tr></tbody></table>1

  Create certificate signing requests instead of signed certificates.

* `--stdio`

  <table frame="box" rules="all" summary="Properties for CA-ordinal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-ordinal=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">First</code></p><p class="valid-value"><code class="literal">Second</code></p></td> </tr></tbody></table>2

  Read certificate signing requests from `stdin`, and write X.509 to `stdout`.

* `--to-dir`

  <table frame="box" rules="all" summary="Properties for CA-ordinal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-ordinal=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">First</code></p><p class="valid-value"><code class="literal">Second</code></p></td> </tr></tbody></table>3

  Specify the output directory for created files. For private key files, this can be overriden using `--keys-to-dir`.

* `--usage`

  <table frame="box" rules="all" summary="Properties for CA-ordinal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-ordinal=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">First</code></p><p class="valid-value"><code class="literal">Second</code></p></td> </tr></tbody></table>4

  Print help text, then exit (alias for `--help`).

* `--version`

  <table frame="box" rules="all" summary="Properties for CA-ordinal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--CA-ordinal=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">First</code></p><p class="valid-value"><code class="literal">Second</code></p></td> </tr></tbody></table>5

  Print version information, then exit.
