#### 7.6.6.13 Clone System Variables

This section describes the system variables that control operation of the clone plugin. If values specified at startup are incorrect, the clone plugin may fail to initialize properly and the server does not load it. In this case, the server may also produce error messages for other clone settings because it does not recognize them.

Each system variable has a default value. System variables can be set at server startup using options on the command line or in an option file. They can be changed dynamically at runtime using the `SET` statement, which enables you to modify operation of the server without having to stop and restart it.

Setting a global system variable runtime value normally requires the `SYSTEM_VARIABLES_ADMIN` privilege (or the deprecated `SUPER` privilege). For more information, see Section 7.1.9.1, “System Variable Privileges”.

Clone variables are configured on the recipient MySQL server instance where the cloning operation is executed.

* `clone_autotune_concurrency`

  <table frame="box" rules="all" summary="Properties for clone_autotune_concurrency"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-autotune-concurrency</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_autotune_concurrency">clone_autotune_concurrency</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  When `clone_autotune_concurrency` is enabled (the default), additional threads for remote cloning operations are spawned dynamically to optimize data transfer speed. The setting is applicable to recipient MySQL server instance only.

  During a cloning operation, the number of threads increases incrementally toward a target of double the current thread count. The effect on the data transfer speed is evaluated at each increment. The process either continues or stops according to the following rules:

  + If the data transfer speed degrades more than 5% with an incremental increase, the process stops.

  + If there is at least a 5% improvement after reaching 25% of the target, the process continues. Otherwise, the process stops.

  + If there is at least a 10% improvement after reaching 50% of the target, the process continues. Otherwise, the process stops.

  + If there is at least a 25% improvement after reaching the target, the process continues toward a new target of double the current thread count. Otherwise, the process stops.

  The autotuning process does not support decreasing the number of threads.

  The `clone_max_concurrency` variable defines the maximum number of threads that can be spawned.

  If `clone_autotune_concurrency` is disabled, `clone_max_concurrency` defines the number of threads spawned for a remote cloning operation.

* `clone_buffer_size`

  <table frame="box" rules="all" summary="Properties for clone_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-buffer-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_buffer_size">clone_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">4194304</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">268435456</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  Defines the size of the intermediate buffer used when transferring data during a local cloning operation. The default value is 4 mebibytes (MiB). A larger buffer size may permit I/O device drivers to fetch data in parallel, which can improve cloning performance.

* `clone_block_ddl`

  <table frame="box" rules="all" summary="Properties for clone_block_ddl"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-block-ddl</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_block_ddl">clone_block_ddl</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Enables an exclusive backup lock on the donor MySQL Server instance during a cloning operation, which blocks concurrent DDL operations on the donor. See Section 7.6.6.4, “Cloning and Concurrent DDL”.

* `clone_delay_after_data_drop`

  <table frame="box" rules="all" summary="Properties for clone_delay_after_data_drop"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-delay-after-data-drop</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_delay_after_data_drop">clone_delay_after_data_drop</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">3600</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  Specifies a delay period immediately after removing existing data on the recipient MySQL Server instance at the start of a remote cloning operation. The delay is intended to provide enough time for the file system on the recipient host to free space before data is cloned from the donor MySQL Server instance. Certain file systems such as VxFS free space asynchronously in a background process. On these file systems, cloning data too soon after dropping existing data can result in clone operation failures due to insufficient space. The maximum delay period is 3600 seconds (1 hour). The default setting is 0 (no delay).

  This variable is applicable to remote cloning operation only and is configured on the recipient MySQL Server instance.

* `clone_ddl_timeout`

  <table frame="box" rules="all" summary="Properties for clone_ddl_timeout"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-ddl-timeout</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_ddl_timeout">clone_ddl_timeout</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">300</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2592000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  The time in seconds that a cloning operation waits for a backup lock. The backup lock blocks concurrent DDL when executing a cloning operation. This setting is applied on both the donor and recipient MySQL server instances.

  A setting of 0 means that the cloning operation does not wait for a backup lock. In this case, executing a concurrent DDL operation can cause the cloning operation to fail.

  Concurrent DDL is permitted on the donor during a cloning operation if `clone_block_ddl` is set to `OFF` (the default). In this case, the cloning operation does not have to wait for a backup lock on the donor. See Section 7.6.6.4, “Cloning and Concurrent DDL”.

* `clone_donor_timeout_after_network_failure`

  <table frame="box" rules="all" summary="Properties for clone_donor_timeout_after_network_failure"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-donor-timeout-after-network-failure</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_donor_timeout_after_network_failure">clone_donor_timeout_after_network_failure</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">5</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">30</code></td> </tr><tr><th>Unit</th> <td>minutes</td> </tr></tbody></table>

  Defines the amount of time in minutes the donor allows for the recipient to reconnect and restart a cloning operation after a network failure. For more information, see Section 7.6.6.9, “Remote Cloning Operation Failure Handling”.

  This variable is set on the donor MySQL server instance. Setting it on the recipient MySQL server instance has no effect.

* `clone_enable_compression`

  <table frame="box" rules="all" summary="Properties for clone_enable_compression"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-enable-compression</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_enable_compression">clone_enable_compression</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Enables compression of data at the network layer during a remote cloning operation. Compression saves network bandwidth at the cost of CPU. Enabling compression may improve the data transfer rate. This setting is only applied on the recipient MySQL server instance.

* `clone_max_concurrency`

  <table frame="box" rules="all" summary="Properties for clone_max_concurrency"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-max-concurrency</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_max_concurrency">clone_max_concurrency</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">16</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">128</code></td> </tr><tr><th>Unit</th> <td>threads</td> </tr></tbody></table>

  Defines the maximum number of concurrent threads for a remote cloning operation. The default value is 16. A greater number of threads can improve cloning performance but also reduces the number of permitted simultaneous client connections, which can affect the performance of existing client connections. This setting is only applied on the recipient MySQL server instance.

  If `clone_autotune_concurrency` is enabled (the default), `clone_max_concurrency` is the maximum number of threads that can be dynamically spawned for a remote cloning operation. If `clone_autotune_concurrency` is disabled, `clone_max_concurrency` defines the number of threads spawned for a remote cloning operation.

  A minimum data transfer rate of 1 mebibyte (MiB) per thread is recommended for remote cloning operations. The data transfer rate for a remote cloning operation is controlled by the `clone_max_data_bandwidth` variable.

* `clone_max_data_bandwidth`

  <table frame="box" rules="all" summary="Properties for clone_max_data_bandwidth"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-max-data-bandwidth</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_max_data_bandwidth">clone_max_data_bandwidth</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Unit</th> <td>miB/second</td> </tr></tbody></table>

  Defines the maximum data transfer rate in mebibytes (MiB) per second for a remote cloning operation. This variable helps manage the performance impact of a cloning operation. A limit should be set only when donor disk I/O bandwidth is saturated, affecting performance. A value of 0 means “unlimited”, which permits cloning operations to run at the highest possible data transfer rate. This setting is only applicable to the recipient MySQL server instance.

  The minimum data transfer rate is 1 MiB per second, per thread. For example, if there are 8 threads, the minimum transfer rate is 8 MiB per second. The `clone_max_concurrency` variable controls the maximum number threads spawned for a remote cloning operation.

  The requested data transfer rate specified by `clone_max_data_bandwidth` may differ from the actual data transfer rate reported by the `DATA_SPEED` column in the `performance_schema.clone_progress` table. If your cloning operation is not achieving the desired data transfer rate and you have available bandwidth, check I/O usage on the recipient and donor. If there is underutilized bandwidth, I/O is the next mostly likely bottleneck.

* `clone_max_network_bandwidth`

  <table frame="box" rules="all" summary="Properties for clone_max_network_bandwidth"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-max-network-bandwidth</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_max_network_bandwidth">clone_max_network_bandwidth</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Unit</th> <td>miB/second</td> </tr></tbody></table>

  Specifies the maximum approximate network transfer rate in mebibytes (MiB) per second for a remote cloning operation. This variable can be used to manage the performance impact of a cloning operation on network bandwidth. It should be set only when network bandwidth is saturated, affecting performance on the donor instance. A value of 0 means “unlimited”, which permits cloning at the highest possible data transfer rate over the network, providing the best performance. This setting is only applicable to the recipient MySQL server instance.

* `clone_ssl_ca`

  <table frame="box" rules="all" summary="Properties for clone_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-buffer-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_buffer_size">clone_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">4194304</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">268435456</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>0

  Specifies the path to the certificate authority (CA) file. Used to configure an encrypted connection for a remote cloning operation. This setting configured on the recipient and used when connecting to the donor.

* `clone_ssl_cert`

  <table frame="box" rules="all" summary="Properties for clone_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-buffer-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_buffer_size">clone_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">4194304</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">268435456</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>1

  Specifies the path to the public key certificate. Used to configure an encrypted connection for a remote cloning operation. This setting configured on the recipient and used when connecting to the donor.

* `clone_ssl_key`

  <table frame="box" rules="all" summary="Properties for clone_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-buffer-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_buffer_size">clone_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">4194304</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">268435456</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>2

  Specifies the path to the private key file. Used to configure an encrypted connection for a remote cloning operation. This setting configured on the recipient and used when connecting to the donor.

* `clone_valid_donor_list`

  <table frame="box" rules="all" summary="Properties for clone_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--clone-buffer-size</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="clone-plugin-options-variables.html#sysvar_clone_buffer_size">clone_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">4194304</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">268435456</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>3

  Defines valid donor host addresses for remote cloning operations. This setting is applied on the recipient MySQL server instance. A comma-separated list of values is permitted in the following format: “`HOST1:PORT1,HOST2:PORT2,HOST3:PORT3`”. Spaces are not permitted.

  The `clone_valid_donor_list` variable adds a layer of security by providing control over the sources of cloned data. The privilege required to configure `clone_valid_donor_list` is different from the privilege required to execute remote cloning operations, which permits assigning those responsibilities to different roles. Configuring `clone_valid_donor_list` requires the `SYSTEM_VARIABLES_ADMIN` privilege, whereas executing a remote cloning operation requires the `CLONE_ADMIN` privilege.

  Internet Protocol version 6 (IPv6) address format is not supported. Internet Protocol version 6 (IPv6) address format is not supported. An alias to the IPv6 address can be used instead. An IPv4 address can be used as is.
