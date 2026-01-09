### 20.9.1 Group Replication System Variables

This section lists the system variables that are specific to the Group Replication plugin.

The name of each Group Replication system variable is prefixed with `group_replication_`.

Note

InnoDB Cluster uses Group Replication, but the default values of the Group Replication system variables may differ from the defaults documented in this section. For example, in InnoDB Cluster, the default value of `group_replication_communication_stack` is `MYSQL`, not `XCOM` as it is for a default Group Replication implementation.

For more information, see MySQL InnoDB Cluster.

Some system variables on a Group Replication group member, including some Group Replication-specific system variables and some general system variables, are group-wide configuration settings. These system variables must have the same value on all group members, and require a full reboot of the group (a bootstrap by a server with `group_replication_bootstrap_group=ON`) in order for the value change to take effect. For instructions to reboot a group where every member has been stopped, see Section 20.5.2, “Restarting a Group”.

If a running group has a value set for a group-wide configuration setting, and a joining member has a different value set for that system variable, the joining member cannot join the group until the value is changed to match. If the group has a value set for one of these system variables, and the joining member does not support the system variable, it cannot join the group.

The following system variables are group-wide configuration settings:

* `group_replication_single_primary_mode`
* `group_replication_enforce_update_everywhere_checks`
* `group_replication_gtid_assignment_block_size`
* `group_replication_view_change_uuid` (deprecated)

* `group_replication_paxos_single_leader`
* `group_replication_communication_stack` (a special case not policed by Group Replication's own checks; see the system variable description for details)

* `default_table_encryption`
* `lower_case_table_names`

Group-wide configuration settings cannot be changed by the usual methods while Group Replication is running, but it is possible to use the `group_replication_switch_to_single_primary_mode()` and `group_replication_switch_to_multi_primary_mode()` functions to change the values of `group_replication_single_primary_mode` and `group_replication_enforce_update_everywhere_checks` while the group is still running. For more information, see Section 20.5.1.2, “Changing the Group Mode”.

Most system variables for Group Replication can have different values on different group members. For the following system variables, it is advisable to set the same value on all members of a group in order to avoid unnecessary rollback of transactions, failure of message delivery, or failure of message recovery:

* `group_replication_auto_increment_increment`
* `group_replication_communication_max_message_size`
* `group_replication_compression_threshold`
* `group_replication_message_cache_size`
* `group_replication_transaction_size_limit`

The value of `group_replication_preemptive_garbage_collection` must be the same on all group members.

Most system variables for Group Replication are described as dynamic, and their values can be changed while the server is running. However, in most cases, the change takes effect only after you stop and restart Group Replication on the group member using a `STOP GROUP_REPLICATION` statement followed by a `START GROUP_REPLICATION` statement. Changes to the following system variables take effect without stopping and restarting Group Replication:

* `group_replication_advertise_recovery_endpoints`
* `group_replication_autorejoin_tries`
* `group_replication_consistency`
* `group_replication_elect_prefers_most_updated.enabled`
* `group_replication_exit_state_action`
* `group_replication_flow_control_applier_threshold`
* `group_replication_flow_control_certifier_threshold`
* `group_replication_flow_control_hold_percent`
* `group_replication_flow_control_max_quota`
* `group_replication_flow_control_member_quota_percent`
* `group_replication_flow_control_min_quota`
* `group_replication_flow_control_min_recovery_quota`
* `group_replication_flow_control_mode`
* `group_replication_flow_control_period`
* `group_replication_flow_control_release_percent`
* `group_replication_force_members`
* `group_replication_ip_allowlist`
* `group_replication_member_expel_timeout`
* `group_replication_member_weight`
* `group_replication_transaction_size_limit`
* `group_replication_unreachable_majority_timeout`

When you change the values of any Group Replication system variables, bear in mind that if there is a point where Group Replication is stopped on every member at once by a `STOP GROUP_REPLICATION` statement or system shutdown, the group must be restarted by bootstrapping as if it was being started for the first time. For instructions on doing this safely, see Section 20.5.2, “Restarting a Group”. In the case of group-wide configuration settings, this is required, but if you are changing other settings, try to ensure that at least one member is running at all times.

Important

* A number of system variables for Group Replication are not completely validated during server startup if they are passed as command line arguments to the server. These system variables include `group_replication_group_name`, `group_replication_single_primary_mode`, `group_replication_force_members`, the SSL variables, and the flow control system variables. They are fully validated only after the server has started.

* System variables for Group Replication that specify IP addresses or host names for group members are not validated until a `START GROUP_REPLICATION` statement is issued. Group Replication's Group Communication System (GCS) is not available to validate the values until that point.

Server system variables specific to the Group Replication plugin, along with descriptions of their function or purpose, are listed here:

* `group_replication_advertise_recovery_endpoints`

  <table frame="box" rules="all" summary="Properties for group_replication_advertise_recovery_endpoints"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-advertise-recovery-endpoints=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_advertise_recovery_endpoints">group_replication_advertise_recovery_endpoints</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">DEFAULT</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running. The change takes effect immediately on the member. However, a joining member that already received the previous value of the system variable continues to use that value. Only members that join after the value change receive the new value.

  `group_replication_advertise_recovery_endpoints` specifies how a joining member can establish a connection to an existing member for state transfer for distributed recovery. The connection is used for both remote cloning operations and state transfer from the donor's binary log.

  A value of `DEFAULT`, which is the default setting, means joining members use the existing member's standard SQL client connection, as specified by MySQL Server's `hostname` and `port` system variables. If an alternative port number is specified by the `report_port` system variable, that one is used instead. The Performance Schema table `replication_group_members` shows this connection's address and port number in the `MEMBER_HOST` and `MEMBER_PORT` columns.

  Instead of `DEFAULT`, you can specify one or more distributed recovery endpoints, which the existing member advertises to joining members for them to use. Offering distributed recovery endpoints lets administrators control distributed recovery traffic separately from regular MySQL client connections to the group members. Joining members try each of the endpoints in turn in the order they are specified on the list.

  Specify the distributed recovery endpoints as a comma-separated list of IP addresses and port numbers, for example:

  ```
  group_replication_advertise_recovery_endpoints= "127.0.0.1:3306,127.0.0.1:4567,[::1]:3306,localhost:3306"
  ```

  IPv4 and IPv6 addresses and host names can be used in any combination. IPv6 addresses must be specified in square brackets. Host names must resolve to a local IP address. Wildcard address formats cannot be used, and you cannot specify an empty list. Note that the standard SQL client connection is not automatically included on a list of distributed recovery endpoints. If you want to use it as an endpoint, you must include it explicitly on the list.

  For details of how to select IP addresses and ports as distributed recovery endpoints, and how joining members use them, see Section 20.5.4.1.1, “Selecting addresses for distributed recovery endpoints”. A summary of the requirements is as follows:

  + The IP addresses do not have to be configured for MySQL Server, but they do have to be assigned to the server.

  + The ports do have to be configured for MySQL Server using the `port`, `report_port`, or `admin_port` system variable.

  + Appropriate permissions are required for the replication user for distributed recovery if the `admin_port` is used.

  + The IP addresses do not need to be added to the Group Replication allowlist specified by the `group_replication_ip_allowlist` system variable.

  + The SSL requirements for the connection are as specified by the `group_replication_recovery_ssl_*` options.

* `group_replication_auto_increment_increment`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">7</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">65535</code></td> </tr></tbody></table>

  This system variable should have the same value on all group members. You cannot change the value of this system variable while Group Replication is running. You must stop Group Replication, change the value of the system variable, then restart Group Replication, on each of the group members. During this process, the value of the system variable is permitted to differ between group members, but some transactions on group members might be rolled back.

  `group_replication_auto_increment_increment` determines the interval between successive values for auto-incremented columns for transactions that execute on this server instance. Adding an interval avoids the selection of duplicate auto-increment values for writes on group members, which causes rollback of transactions. The default value of 7 represents a balance between the number of usable values and the permitted maximum size of a replication group (9 members). If your group has more or fewer members, you can set this system variable to match the expected number of group members before Group Replication is started.

  Important

  Setting `group_replication_auto_increment_increment` has no effect when `group_replication_single_primary_mode` is `ON`.

  When Group Replication is started on a server instance, the value of the server system variable `auto_increment_increment` is changed to this value, and the value of the server system variable `auto_increment_offset` is changed to the server ID. The changes are reverted when Group Replication is stopped. These changes are only made and reverted if `auto_increment_increment` and `auto_increment_offset` each have their default value of 1. If their values have already been modified from the default, Group Replication does not alter them. The system variables are also not modified when Group Replication is in single-primary mode, where only one server writes.

* `group_replication_autorejoin_tries`

  <table frame="box" rules="all" summary="Properties for group_replication_autorejoin_tries"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-autorejoin-tries=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_autorejoin_tries">group_replication_autorejoin_tries</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">3</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2016</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately. The system variable's current value is read when an issue occurs that means the behavior is needed.

  `group_replication_autorejoin_tries` specifies the number of tries that a member makes to automatically rejoin the group if it is expelled, or if it is unable to contact a majority of the group before the `group_replication_unreachable_majority_timeout` setting is reached. When the member's expulsion or unreachable majority timeout is reached, it makes an attempt to rejoin (using the current plugin option values), then continues to make further auto-rejoin attempts up to the specified number of tries. After an unsuccessful auto-rejoin attempt, the member waits 5 minutes before the next try. If the specified number of tries is exhausted without the member rejoining or being stopped, the member proceeds to the action specified by the `group_replication_exit_state_action` system variable.

  During and between auto-rejoin attempts, a member remains in super read only mode and does not accept writes, but reads can still be made on the member, with an increasing likelihood of stale reads over time. If you cannot tolerate the possibility of stale reads for any period of time, set `group_replication_autorejoin_tries` to 0. For more information on the auto-rejoin feature, and considerations when choosing a value for this option, see Section 20.7.7.3, “Auto-Rejoin”.

* `group_replication_bootstrap_group`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  `group_replication_bootstrap_group` configures this server to bootstrap the group. This system variable must *only* be set on one server, and *only* when starting the group for the first time or restarting the entire group. After the group has been bootstrapped, set this option to `OFF`. It should be set to `OFF` both dynamically and in the configuration files. Starting two servers or restarting one server with this option set while the group is running may lead to an artificial split brain situation, where two independent groups with the same name are bootstrapped.

  For instructions to bootstrap a group for the first time, see Section 20.2.1.5, “Bootstrapping the Group”. For instructions to safely bootstrap a group where transactions have been executed and certified, see Section 20.5.2, “Restarting a Group”.

* `group_replication_clone_threshold`

  <table frame="box" rules="all" summary="Properties for group_replication_clone_threshold"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-clone-threshold=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_clone_threshold">group_replication_clone_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Unit</th> <td>transactions</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_clone_threshold` specifies the transaction gap, as a number of transactions, between the existing member (donor) and the joining member (recipient) that triggers the use of a remote cloning operation for state transfer to the joining member during the distributed recovery process. If the transaction gap between the joining member and a suitable donor exceeds the threshold, Group Replication begins distributed recovery with a remote cloning operation. If the transaction gap is below the threshold, or if the remote cloning operation is not technically possible, Group Replication proceeds directly to state transfer from a donor's binary log.

  Warning

  Do not use a low setting for `group_replication_clone_threshold` in an active group. If a number of transactions above the threshold takes place in the group while the remote cloning operation is in progress, the joining member triggers a remote cloning operation again after restarting, and could continue this indefinitely. To avoid this situation, ensure that you set the threshold to a number higher than the number of transactions that you would expect to occur in the group during the time taken for the remote cloning operation.

  To use this function, both the donor and the joining member must be set up beforehand to support cloning. For instructions, see Section 20.5.4.2, “Cloning for Distributed Recovery”. When a remote cloning operation is carried out, Group Replication manages it for you, including the required server restart, provided that `group_replication_start_on_boot=ON` is set. If not, you must restart the server manually. The remote cloning operation replaces the existing data dictionary on the joining member, but Group Replication checks and does not proceed if the joining member has additional transactions that are not present on the other group members, because these transactions would be erased by the cloning operation.

  The default setting (which is the maximum permitted sequence number for a transaction in a GTID) means that state transfer from a donor's binary log is virtually always attempted rather than cloning. However, note that Group Replication always attempts to execute a cloning operation, regardless of your threshold, if state transfer from a donor's binary log is impossible, for example because the transactions needed by the joining member are not available in the binary logs on any existing group member. If you do not want to use cloning at all in your replication group, do not install the clone plugin on the members.

* `group_replication_communication_debug_options`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_debug_options"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-debug-options=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_debug_options">group_replication_communication_debug_options</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">GCS_DEBUG_NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">GCS_DEBUG_NONE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately.

  `group_replication_communication_debug_options` configures the level of debugging messages to provide for the different Group Replication components, such as the Group Communication System (GCS) and the group communication engine (XCom, a Paxos variant). The debug information is stored in the `GCS_DEBUG_TRACE` file in the data directory.

  The set of available options, specified as strings, can be combined. The following options are available:

  + `GCS_DEBUG_NONE` disables all debugging levels for both GCS and XCom.

  + `GCS_DEBUG_BASIC` enables basic debugging information in GCS.

  + `GCS_DEBUG_TRACE` enables trace information in GCS.

  + `XCOM_DEBUG_BASIC` enables basic debugging information in XCom.

  + `XCOM_DEBUG_TRACE` enables trace information in XCom.

  + `GCS_DEBUG_ALL` enables all debugging levels for both GCS and XCom.

  Setting the debug level to `GCS_DEBUG_NONE` only has an effect when provided without any other option. Setting the debug level to `GCS_DEBUG_ALL` overrides all other options.

* `group_replication_communication_max_message_size`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_max_message_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-max-message-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_max_message_size">group_replication_communication_max_message_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10485760</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  This system variable should have the same value on all group members. You cannot change the value of this system variable while Group Replication is running. You must stop Group Replication, change the value of the system variable, then restart Group Replication, on each of the group members. During this process, the value of the system variable is permitted to differ between group members, but some transactions on group members might be rolled back.

  `group_replication_communication_max_message_size` specifies a maximum message size for Group Replication communications. Messages greater than this size are automatically split into fragments that are sent separately and reassembled by the recipients. For more information, see Section 20.7.5, “Message Fragmentation”.

  A maximum message size of 10485760 bytes (10 MiB) is set by default, which means that fragmentation is used by default. The greatest permitted value is the same as the maximum value of the `replica_max_allowed_packet` system variable, which is 1073741824 bytes (1 GB). `group_replication_communication_max_message_size` must be less than `replica_max_allowed_packet`, because the applier thread cannot handle message fragments larger than the maximum permitted packet size. To switch off fragmentation, set `group_replication_communication_max_message_size` to `0`.

  In order for members of a replication group to use fragmentation, the group's communication protocol version must be 8.0.16 or later. Use the `group_replication_get_communication_protocol()` function to view the group's communication protocol version. If a lower version is in use, group members do not fragment messages. You can use the `group_replication_set_communication_protocol()` function to set the group's communication protocol to a higher version if all group members support it. For more information, see Section 20.5.1.4, “Setting a Group's Communication Protocol Version”.

* `group_replication_communication_stack`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_stack"><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_stack">group_replication_communication_stack</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">XCOM</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">XCOM</code></p><p class="valid-value"><code class="literal">MYSQL</code></p></td> </tr></tbody></table>

  Note

  This system variable is effectively a group-wide configuration setting; although it can be set at runtime, a full reboot of the replication group is required for any change to take effect.

  `group_replication_communication_stack` specifies whether the XCom communication stack or the MySQL communication stack is to be used to establish group communication connections between members. The XCom communication stack is Group Replication's own implementation, and does not support authentication or network namespaces. The MySQL communication stack is MySQL Server's native implementation, with support for authentication and network namespaces, and access to new security functions immediately on release. All members of a group must use the same communication stack.

  When you use the MySQL communication stack in place of XCom, MySQL Server establishes each connection between group members using its own authentication and encryption protocols.

  Note

  If you are using InnoDB Cluster, the default value of `group_replication_communication_stack` is `MYSQL`.

  For more information, see MySQL InnoDB Cluster.

  Additional configuration is required when you set up a group to use MySQL’s communication stack; see Section 20.6.1, “Communication Stack for Connection Security Management”.

  `group_replication_communication_stack` is effectively a group-wide configuration setting, and the setting must be the same on all group members. However, this is not policed by Group Replication’s own checks for group-wide configuration settings. A member with a different value from the rest of the group cannot communicate with the other members at all, because the communication protocols are incompatible, so it cannot exchange information about its configuration settings.

  This means that although the value of the system variable can be changed while Group Replication is running, and takes effect after you restart Group Replication on the group member, the member still cannot rejoin the group until the setting has been changed on all the members. You must therefore stop Group Replication on all of the members and change the value of the system variable on them all before you can restart the group. Because all of the members are stopped, a full reboot of the group (a bootstrap by a server with `group_replication_bootstrap_group=ON`) is required in order for the value change to take effect. For instructions to migrate from one communication stack to another, see Section 20.6.1, “Communication Stack for Connection Security Management”.

* `group_replication_components_stop_timeout`

  <table frame="box" rules="all" summary="Properties for group_replication_components_stop_timeout"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-components-stop-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_components_stop_timeout">group_replication_components_stop_timeout</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">300</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">2</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">31536000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_components_stop_timeout` specifies the time, in seconds, for which Group Replication waits for each of its modules to complete ongoing processes while shutting down. The component timeout applies after a `STOP GROUP_REPLICATION` statement is issued, which happens automatically during server restart or auto-rejoin.

  The timeout is used to resolve situations in which Group Replication components cannot be stopped normally, which might happen if a member is expelled from the group while it is in an error state, or while a process such as MySQL Enterprise Backup is holding a global lock on tables on the member. In such situations, the member cannot stop the applier thread or complete the distributed recovery process to rejoin. `STOP GROUP_REPLICATION` does not complete until either the situation is resolved (for example, by the lock being released), or the component timeout expires and the modules are shut down regardless of their status.

  The default value is 300 seconds, so that Group Replication components are stopped after 5 minutes if the situation is not resolved before that time, allowing the member to be restarted and to rejoin.

* `group_replication_compression_threshold`

  <table frame="box" rules="all" summary="Properties for group_replication_compression_threshold"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-compression-threshold=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_compression_threshold">group_replication_compression_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1000000</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  The threshold value in bytes above which compression is applied to messages sent between group members. If this system variable is set to zero, compression is disabled. The value of `group_replication_compression_threshold` should be the same on all group members.

  Group Replication uses the LZ4 compression algorithm to compress messages sent in the group. Note that the maximum supported input size for the LZ4 compression algorithm is 2113929216 bytes. This limit is lower than the maximum possible value for the `group_replication_compression_threshold` system variable, which is matched to the maximum message size accepted by XCom. With the LZ4 compression algorithm, do not set a value greater than 2113929216 bytes for `group_replication_compression_threshold`, because transactions above this size cannot be committed when message compression is enabled.

  For more information, see Section 20.7.4, “Message Compression”.

* `group_replication_consistency`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">7</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">65535</code></td> </tr></tbody></table>

  `group_replication_consistency` is a server system variable rather than a Group Replication plugin-specific variable, so a restart of Group Replication is not required for the change to take effect. Changing the session value of the system variable takes effect immediately, and changing the global value takes effect for new sessions that start after the change. The `GROUP_REPLICATION_ADMIN` privilege is required to change the global setting for this system variable.

  `group_replication_consistency` determines the transaction consistency guarantee which a group provides; this can done globally, or per transaction. `group_replication_consistency` also determines the fencing mechanism used by newly elected primaries in single primary groups. The effect of the variable must be considered both for read-only and for read/write transactions. The following list shows the possible values of this variable, in order of increasing transaction consistency guarantee:

  + `EVENTUAL`

    Neither read-only nor read/write transactions wait for preceding transactions to be applied before executing. (Before this variables was added, this was the default behavior.) A read/write transaction does not wait for other members to apply a transaction. This means that a transaction can be externalized on one member before the others. This also means that, in the event of a primary failover, the new primary can accept new read-only transactions before the previous primary transactions have all been applied, though read/write transactions are not allowed.

  + `BEFORE_ON_PRIMARY_FAILOVER`

    New read-only or read/write transactions with a newly elected primary that is applying a backlog from the old primary are not applied until any backlog has been applied. This ensures that, in the event of primary failover, clients always see the latest value on the primary, regardless of whether the failover is intentional. This guarantees consistency, but means that clients must be able to handle the delay in the event that a backlog is being applied. The length of this delay depends on the size of the backlog being processed, but is usually not great.

  + `BEFORE`

    A read/write transaction waits for all preceding transactions to complete before being applied. A read-only transaction waits for all preceding transactions to complete before being executed. This ensures that this transaction reads the latest value by affecting only the latency of the transaction. This reduces any overhead from synchronization, by ensuring it is used on read-only transactions only. This consistency level also includes the consistency guarantees provided by `BEFORE_ON_PRIMARY_FAILOVER`.

  + `AFTER`

    A read/write transaction waits until its changes have been applied to all of the other members. This value has no effect on read-only transactions, and ensures that, when a transaction is committed on the local member, any subsequent transaction reads the value written or a more recent value on any group member. This means that read-only transactions on the other members remain uncommitted until all preceding transactions are committed, increasing the latency of the affected transaction.

    Use this mode with a group that is intended primarily for read-only operations to ensure that any read/write transactions are applied everywhere once they commit. This can be used by your application to ensure that subsequent reads fetch the latest data, including the latest writes. This reduces any overhead from synchronization, by ensuring that synchronization is used for read/write transactions only.

    `AFTER` includes the consistency guarantees provided by `BEFORE_ON_PRIMARY_FAILOVER`.

  + `BEFORE_AND_AFTER`

    A read/write transaction waits for all preceding transactions to complete, and for all its changes to be applied on all other members, before being applied. A read-only transaction waits for all preceding transactions to complete before execution takes place. This consistency level also includes the consistency guarantees provided by `BEFORE_ON_PRIMARY_FAILOVER`.

  For more information, see Section 20.5.3, “Transaction Consistency Guarantees”.

* `group_replication_elect_prefers_most_updated.enabled`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">7</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">65535</code></td> </tr></tbody></table>

  Whether the Group Replication Primary Election component is enabled on this server. All group members must have it enabled (set to `ON`) in order for the most-up-to-date primary selection mechanism to function properly. If any member has it disabled or if any member does not support, the primary selection is based on member weights.

  Provided by the Group Replication Primary Election component, part of MySQL Enterprise Edition. See Section 7.5.6.4, “Group Replication Primary Election Component”, for more information.

* `group_replication_enforce_update_everywhere_checks`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">7</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">65535</code></td> </tr></tbody></table>

  Note

  This system variable is a group-wide configuration setting, and a full reboot of the replication group is required for a change to take effect.

  `group_replication_enforce_update_everywhere_checks` enables or disables strict consistency checks for multi-primary update everywhere. The default is that checks are disabled. In single-primary mode, this option must be disabled on all group members. In multi-primary mode, when this option is enabled, statements are checked as follows to ensure they are compatible with multi-primary mode:

  + If a transaction is executed under the `SERIALIZABLE` isolation level, then its commit fails when synchronizing itself with the group.

  + If a transaction executes against a table that has foreign keys with cascading constraints, then the transaction fails to commit when synchronizing itself with the group.

  This system variable is a group-wide configuration setting. It must have the same value on all group members, cannot be changed while Group Replication is running, and requires a full reboot of the group (a bootstrap by a server with `group_replication_bootstrap_group=ON`) in order for the value change to take effect. For instructions to safely bootstrap a group where transactions have been executed and certified, see Section 20.5.2, “Restarting a Group”.

  If the group has a value set for this system variable, and a joining member has a different value set for the system variable, the joining member cannot join the group until the value is changed to match. If the group members have a value set for this system variable, and the joining member does not support the system variable, it cannot join the group.

  Use the `group_replication_switch_to_single_primary_mode()` and `group_replication_switch_to_multi_primary_mode()` functions to change the value of this system variable while the group is still running. For more information, see Section 20.5.1.2, “Changing the Group Mode”.

* `group_replication_exit_state_action`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">7</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">65535</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately. The system variable's current value is read when an issue occurs that means the behavior is needed.

  `group_replication_exit_state_action` configures how Group Replication behaves when this server instance leaves the group unintentionally, for example after encountering an applier error, or in the case of a loss of majority, or when another member of the group expels it due to a suspicion timing out. The timeout period for a member to leave the group in the case of a loss of majority is set by the `group_replication_unreachable_majority_timeout` system variable, and the timeout period for suspicions is set by the `group_replication_member_expel_timeout` system variable. Note that an expelled group member does not know that it was expelled until it reconnects to the group, so the specified action is only taken if the member manages to reconnect, or if the member raises a suspicion on itself and expels itself.

  When a group member is expelled due to a suspicion timing out or a loss of majority, if the member has the `group_replication_autorejoin_tries` system variable set to specify a number of auto-rejoin attempts, it first makes the specified number of attempts while in super read only mode, and then follows the action specified by `group_replication_exit_state_action`. Auto-rejoin attempts are not made in case of an applier error, because these are not recoverable.

  When `group_replication_exit_state_action` is set to `READ_ONLY`, if the member exits the group unintentionally or exhausts its auto-rejoin attempts, the instance switches MySQL to super read only mode (by setting the system variable `super_read_only` to `ON`).

  When `group_replication_exit_state_action` is set to `OFFLINE_MODE`, if the member exits the group unintentionally or exhausts its auto-rejoin attempts, the instance switches MySQL to offline mode (by setting the system variable `offline_mode` to `ON`). In this mode, connected client users are disconnected on their next request and connections are no longer accepted, with the exception of client users that have the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege). Group Replication also sets the system variable `super_read_only` to `ON`, so clients cannot make any updates, even if they have connected with the `CONNECTION_ADMIN` or `SUPER` privilege.

  When `group_replication_exit_state_action` is set to `ABORT_SERVER`, if the member exits the group unintentionally or exhausts its auto-rejoin attempts, the instance shuts down MySQL.

  Important

  If a failure occurs before the member has successfully joined the group, the specified exit action *is not taken*. This is the case if there is a failure during the local configuration check, or a mismatch between the configuration of the joining member and the configuration of the group. In these situations, the `super_read_only` system variable is left with its original value, connections continue to be accepted, and the server does not shut down MySQL. To ensure that the server cannot accept updates when Group Replication did not start, we therefore recommend that `super_read_only=ON` is set in the server's configuration file at startup, which Group Replication changes to `OFF` on primary members after it has been started successfully. This safeguard is particularly important when the server is configured to start Group Replication on server boot (`group_replication_start_on_boot=ON`), but it is also useful when Group Replication is started manually using a `START GROUP_REPLICATION` command.

  For more information on using this option, and the full list of situations in which the exit action is taken, see Section 20.7.7.4, “Exit Action”.

* `group_replication_flow_control_applier_threshold`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">7</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">65535</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately.

  `group_replication_flow_control_applier_threshold` specifies the number of waiting transactions in the applier queue that trigger flow control.

* `group_replication_flow_control_certifier_threshold`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">7</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">65535</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately.

  `group_replication_flow_control_certifier_threshold` specifies the number of waiting transactions in the certifier queue that trigger flow control.

* `group_replication_flow_control_hold_percent`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">7</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">65535</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately.

  `group_replication_flow_control_hold_percent` defines what percentage of the group quota remains unused to allow a cluster under flow control to catch up on backlog. A value of 0 implies that no part of the quota is reserved for catching up on the work backlog.

* `group_replication_flow_control_max_quota`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">7</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">65535</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately.

  `group_replication_flow_control_max_quota` defines the maximum flow control quota of the group, or the maximum available quota for any period while flow control is enabled. A value of 0 implies that there is no maximum quota set. The value of this system variable cannot be smaller than `group_replication_flow_control_min_quota` and `group_replication_flow_control_min_recovery_quota`.

* `group_replication_flow_control_member_quota_percent`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">7</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">65535</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately.

  `group_replication_flow_control_member_quota_percent` defines the percentage of the quota that a member should assume is available for itself when calculating the quotas. A value of 0 implies that the quota should be split equally between members that were writers in the last period.

* `group_replication_flow_control_min_quota`

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">7</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">65535</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately.

  `group_replication_flow_control_min_quota` controls the lowest flow control quota that can be assigned to a member, independently of the calculated minimum quota executed in the last period. A value of 0 implies that there is no minimum quota. The value of this system variable cannot be larger than `group_replication_flow_control_max_quota`.

* `group_replication_flow_control_min_recovery_quota`

  <table frame="box" rules="all" summary="Properties for group_replication_autorejoin_tries"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-autorejoin-tries=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_autorejoin_tries">group_replication_autorejoin_tries</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">3</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2016</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately.

  `group_replication_flow_control_min_recovery_quota` controls the lowest quota that can be assigned to a member because of another recovering member in the group, independently of the calculated minimum quota executed in the last period. A value of 0 implies that there is no minimum quota. The value of this system variable cannot be larger than `group_replication_flow_control_max_quota`.

* `group_replication_flow_control_mode`

  <table frame="box" rules="all" summary="Properties for group_replication_autorejoin_tries"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-autorejoin-tries=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_autorejoin_tries">group_replication_autorejoin_tries</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">3</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2016</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately.

  `group_replication_flow_control_mode` specifies the mode used for flow control.

* `group_replication_flow_control_period`

  <table frame="box" rules="all" summary="Properties for group_replication_autorejoin_tries"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-autorejoin-tries=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_autorejoin_tries">group_replication_autorejoin_tries</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">3</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2016</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately.

  `group_replication_flow_control_period` defines how many seconds to wait between flow control iterations, in which flow control messages are sent and flow control management tasks are run.

* `group_replication_flow_control_release_percent`

  <table frame="box" rules="all" summary="Properties for group_replication_autorejoin_tries"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-autorejoin-tries=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_autorejoin_tries">group_replication_autorejoin_tries</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">3</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2016</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately.

  `group_replication_flow_control_release_percent` defines how the group quota should be released when flow control no longer needs to throttle the writer members, with this percentage being the quota increase per flow control period. A value of 0 implies that once the flow control thresholds are within limits the quota is released in a single flow control iteration. The range allows the quota to be released at up to 10 times current quota, as that allows a greater degree of adaptation, mainly when the flow control period is large and the quotas are very small.

* `group_replication_force_members`

  <table frame="box" rules="all" summary="Properties for group_replication_autorejoin_tries"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-autorejoin-tries=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_autorejoin_tries">group_replication_autorejoin_tries</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">3</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2016</code></td> </tr></tbody></table>

  This system variable is used to force a new group membership. The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately. You only need to set the value of the system variable on one of the group members that is to remain in the group. For details of the situation in which you might need to force a new group membership, and a procedure to follow when using this system variable, see Section 20.7.8, “Handling a Network Partition and Loss of Quorum”.

  `group_replication_force_members` specifies a list of peer addresses as a comma separated list, such as `host1:port1`,`host2:port2`. Any existing members that are not included in the list do not receive a new view of the group and are blocked. For each existing member that is to continue as a member, you must include the IP address or host name and the port, as they are given in the `group_replication_local_address` system variable for each member. An IPv6 address must be specified in square brackets. For example:

  ```
  "198.51.100.44:33061,[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061,example.org:33061"
  ```

  The group communication engine for Group Replication (XCom) checks that the supplied IP addresses are in a valid format, and checks that you have not included any group members that are currently unreachable. Otherwise, the new configuration is not validated, so you must be careful to include only online servers that are reachable members of the group. Any incorrect values or invalid host names in the list could cause the group to be blocked with an invalid configuration.

  It is important before forcing a new membership configuration to ensure that the servers to be excluded have been shut down. If they are not, shut them down before proceeding. Group members that are still online can automatically form new configurations, and if this has already taken place, forcing a further new configuration could create an artificial split-brain situation for the group.

  After you have used the `group_replication_force_members` system variable to successfully force a new group membership and unblock the group, ensure that you clear the system variable. `group_replication_force_members` must be empty in order to issue a `START GROUP_REPLICATION` statement.

* `group_replication_group_name`

  <table frame="box" rules="all" summary="Properties for group_replication_autorejoin_tries"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-autorejoin-tries=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_autorejoin_tries">group_replication_autorejoin_tries</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">3</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2016</code></td> </tr></tbody></table>

  The value of this system variable cannot be changed while Group Replication is running.

  `group_replication_group_name` specifies the name of the group which this server instance belongs to, which must be a valid UUID. This UUID forms part of the GTIDs that are used when transactions received by group members from clients, and view change events that are generated internally by the group members, are written to the binary log.

  Important

  A unique UUID must be used.

* `group_replication_group_seeds`

  <table frame="box" rules="all" summary="Properties for group_replication_autorejoin_tries"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-autorejoin-tries=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_autorejoin_tries">group_replication_autorejoin_tries</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">3</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2016</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_group_seeds` is a list of group members to which a joining member can connect to obtain details of all the current group members. The joining member uses these details to select and connect to a group member to obtain the data needed for synchrony with the group. The list consists of a single internal network address or host name for each included seed member, as configured in the seed member's `group_replication_local_address` system variable (not the seed member's SQL client connection, as specified by MySQL Server's `hostname` and `port` system variables). The addresses of the seed members are specified as a comma separated list, such as `host1:port1`,`host2:port2`. An IPv6 address must be specified in square brackets. For example:

  ```
  group_replication_group_seeds= "198.51.100.44:33061,[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061, example.org:33061"
  ```

  Note that the value you specify for this variable is not validated until a `START GROUP_REPLICATION` statement is issued and the Group Communication System (GCS) is available.

  Usually this list consists of all members of the group, but you can choose a subset of the group members to be seeds. The list must contain at least one valid member address. Each address is validated when starting Group Replication. If the list does not contain any valid member addresses, issuing `START GROUP_REPLICATION` fails.

  When a server is joining a replication group, it attempts to connect to the first seed member listed in its `group_replication_group_seeds` system variable. If the connection is refused, the joining member tries to connect to each of the other seed members in the list in order. If the joining member connects to a seed member but does not get added to the replication group as a result (for example, because the seed member does not have the joining member's address in its allowlist and closes the connection), the joining member continues to try the remaining seed members in the list in order.

  A joining member must communicate with the seed member using the same protocol (IPv4 or IPv6) that the seed member advertises in the `group_replication_group_seeds` option. For the purpose of IP address permissions for Group Replication, the allowlist on the seed member must include an IP address for the joining member for the protocol offered by the seed member, or a host name that resolves to an address for that protocol. This address or host name must be set up and permitted in addition to the joining member's `group_replication_local_address` if the protocol for that address does not match the seed member's advertised protocol. If a joining member does not have a permitted address for the appropriate protocol, its connection attempt is refused. For more information, see Section 20.6.4, “Group Replication IP Address Permissions”.

* `group_replication_gtid_assignment_block_size`

  <table frame="box" rules="all" summary="Properties for group_replication_autorejoin_tries"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-autorejoin-tries=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_autorejoin_tries">group_replication_autorejoin_tries</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">3</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2016</code></td> </tr></tbody></table>

  Note

  This system variable is a group-wide configuration setting, and a full reboot of the replication group is required for a change to take effect.

  `group_replication_gtid_assignment_block_size` specifies the number of consecutive GTIDs that are reserved for each group member. Each member consumes its own blocks and reserves more when needed.

  This system variable is a group-wide configuration setting. It must have the same value on all group members, cannot be changed while Group Replication is running, and requires a full reboot of the group (a bootstrap by a server with `group_replication_bootstrap_group=ON`) in order for the value change to take effect. For instructions to safely bootstrap a group where transactions have been executed and certified, see Section 20.5.2, “Restarting a Group”.

  If the group has a value set for this system variable, and a joining member has a different value set for the system variable, the joining member cannot join the group until the value is changed to match. If the group members have a value set for this system variable, and the joining member does not support the system variable, it cannot join the group.

* `group_replication_ip_allowlist`

  <table frame="box" rules="all" summary="Properties for group_replication_autorejoin_tries"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-autorejoin-tries=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_autorejoin_tries">group_replication_autorejoin_tries</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">3</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2016</code></td> </tr></tbody></table>

  `group_replication_ip_allowlist` specifies which hosts are permitted to connect to the group. When the XCom communication stack is in use for the group (`group_replication_communication_stack=XCOM`), the allowlist is used to control access to the group. When the MySQL communication stack is in use for the group (`group_replication_communication_stack=MYSQL`), user authentication is used to control access to the group, and the allowlist is not used and is ignored if set.

  The address that you specify for each group member in `group_replication_local_address` must be permitted on the other servers in the replication group. Note that the value you specify for this variable is not validated until a `START GROUP_REPLICATION` statement is issued and the Group Communication System (GCS) is available.

  By default, this system variable is set to `AUTOMATIC`, which permits connections from private subnetworks active on the host. The group communication engine for Group Replication (XCom) automatically scans active interfaces on the host, and identifies those with addresses on private subnetworks. These addresses and the `localhost` IP address for IPv4 and IPv6 are used to create the Group Replication allowlist. For a list of the ranges from which addresses are automatically permitted, see Section 20.6.4, “Group Replication IP Address Permissions”.

  The automatic allowlist of private addresses cannot be used for connections from servers outside the private network. For Group Replication connections between server instances that are on different machines, you must provide public IP addresses and specify these as an explicit allowlist. If you specify any entries for the allowlist, the private addresses are not added automatically, so if you use any of these, you must specify them explicitly. The `localhost` IP addresses are added automatically.

  As the value of the `group_replication_ip_allowlist` option, you can specify any combination of the following:

  + IPv4 addresses (for example, `198.51.100.44`)

  + IPv4 addresses with CIDR notation (for example, `192.0.2.21/24`)

  + IPv6 addresses (for example, `2001:db8:85a3:8d3:1319:8a2e:370:7348`)

  + IPv6 addresses using CIDR notation (for example, `2001:db8:85a3:8d3::/64`)

  + Host names (for example, `example.org`)
  + Host names with CIDR notation (for example, `www.example.com/24`)

  Host names can resolve to IPv4 addresses, IPv6 addresses, or both. If a host name resolves to both an IPv4 and an IPv6 address, the IPv4 address is always used for Group Replication connections. You can use CIDR notation in combination with host names or IP addresses to permit a block of IP addresses with a particular network prefix, but you should ensure that all the IP addresses in the specified subnet are under your control.

  A comma must separate each entry in the allowlist. For example:

  ```
  "192.0.2.21/24,198.51.100.44,203.0.113.0/24,2001:db8:85a3:8d3:1319:8a2e:370:7348,example.org,www.example.com/24"
  ```

  If any of the seed members for the group are listed in the `group_replication_group_seeds` option with an IPv6 address when a joining member has an IPv4 `group_replication_local_address`, or the reverse, you must also set up and permit an alternative address for the joining member for the protocol offered by the seed member (or a host name that resolves to an address for that protocol). For more information, see Section 20.6.4, “Group Replication IP Address Permissions”.

  It is possible to configure different allowlists on different group members according to your security requirements, for example, in order to keep different subnets separate. However, this can cause issues when a group is reconfigured. If you do not have a specific security requirement to do otherwise, use the same allowlist on all members of a group. For more details, see Section 20.6.4, “Group Replication IP Address Permissions”.

  For host names, name resolution takes place only when a connection request is made by another server. A host name that cannot be resolved is not considered for allowlist validation, and a warning message is written to the error log. Forward-confirmed reverse DNS (FCrDNS) verification is carried out for resolved host names.

  Warning

  Host names are inherently less secure than IP addresses in an allowlist. FCrDNS verification provides a good level of protection, but can be compromised by certain types of attack. Specify host names in your allowlist only when strictly necessary, and ensure that all components used for name resolution, such as DNS servers, are maintained under your control. You can also implement name resolution locally using the hosts file, to avoid the use of external components.

* `group_replication_local_address`

  <table frame="box" rules="all" summary="Properties for group_replication_autorejoin_tries"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-autorejoin-tries=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_autorejoin_tries">group_replication_autorejoin_tries</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">3</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">2016</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_local_address` sets the network address which the member provides for connections from other members, specified as a `host:port` formatted string. This address must be reachable by all members of the group because it is used by the group communication engine for Group Replication (XCom, a Paxos variant) for TCP communication between remote XCom instances. If you are using the MySQL communication stack to establish group communication connections between members (`group_replication_communication_stack` = MYSQL), the address must be one of the IP addresses and ports where MySQL Server is listening on, as specified by the `bind_address` system variable for the server.

  Warning

  Do not use this address to query or administer the databases on the member. This is not the SQL client connection host and port.

  The address or host name that you specify in `group_replication_local_address` is used by Group Replication as the unique identifier for a group member within the replication group. You can use the same port for all members of a replication group as long as the host names or IP addresses are all different, and you can use the same host name or IP address for all members as long as the ports are all different. The recommended port for `group_replication_local_address` is 33061. Note that the value you specify for this variable is not validated until the `START GROUP_REPLICATION` statement is issued and the Group Communication System (GCS) is available.

  The network address configured by `group_replication_local_address` must be resolvable by all group members. For example, if each server instance is on a different machine with a fixed network address, you could use the IP address of the machine, such as 10.0.0.1. If you use a host name, you must use a fully qualified name, and ensure it is resolvable through DNS, correctly configured `/etc/hosts` files, or other name resolution processes. An IPv6 address must be specified in square brackets in order to distinguish the port number, for example:

  ```
  group_replication_local_address= "[2001:db8:85a3:8d3:1319:8a2e:370:7348]:33061"
  ```

  If a host name specified as the Group Replication local address for a server instance resolves to both an IPv4 and an IPv6 address, the IPv4 address is always used for Group Replication connections. For more information on Group Replication support for IPv6 networks and on replication groups with a mix of members using IPv4 and members using IPv6, see Section 20.5.5, “Support For IPv6 And For Mixed IPv6 And IPv4 Groups”.

  If you are using the XCom communication stack to establish group communication connections between members (`group_replication_communication_stack = XCOM`), the address that you specify for each group member in `group_replication_local_address` must be added to the list for the `group_replication_ip_allowlist` system variable on the other servers in the replication group. When the XCom communication stack is in use for the group, the allowlist is used to control access to the group. When the MySQL communication stack is in use for the group, user authentication is used to control access to the group, and the allowlist is not used and is ignored if set. If any of the seed members for the group are listed in `group_replication_group_seeds` with an IPv6 address when this member has an IPv4 `group_replication_local_address`, or the reverse, you must also set up and permit an alternative address for this member for the required protocol (or a host name that resolves to an address for that protocol). For more information, see Section 20.6.4, “Group Replication IP Address Permissions”.

* `group_replication_member_expel_timeout`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately. The current value of the system variable is read whenever Group Replication checks the timeout. It is not mandatory for all members of a group to have the same setting, but it is recommended in order to avoid unexpected expulsions.

  `group_replication_member_expel_timeout` specifies the period of time in seconds that a Group Replication group member waits after creating a suspicion, before expelling from the group the member suspected of having failed. The initial 5-second detection period before a suspicion is created does not count as part of this time. The value of `group_replication_member_expel_timeout` defaults to 5, meaning that a suspected member is liable for expulsion 5 seconds after the 5-second detection period.

  Changing the value of `group_replication_member_expel_timeout` on a group member takes effect immediately for existing as well as future suspicions on that group member. You can therefore use this as a method to force a suspicion to time out and expel a suspected member, allowing changes to the group configuration. For more information, see Section 20.7.7.1, “Expel Timeout”.

  Increasing the value of `group_replication_member_expel_timeout` can help to avoid unnecessary expulsions on slower or less stable networks, or in the case of expected transient network outages or machine slowdowns. If a suspect member becomes active again before the suspicion times out, it applies all the messages that were buffered by the remaining group members and enters `ONLINE` state, without operator intervention. You can specify a timeout value up to a maximum of 3600 seconds (1 hour). It is important to ensure that XCom's message cache is sufficiently large to contain the expected volume of messages in your specified time period, plus the initial 5-second detection period, otherwise members are unable to reconnect. You can adjust the cache size limit using the `group_replication_message_cache_size` system variable. For more information, see Section 20.7.6, “XCom Cache Management”.

  If the timeout is exceeded, the suspect member is liable for expulsion immediately after the suspicion times out. If the member is able to resume communications and receives a view where it is expelled, and the member has the `group_replication_autorejoin_tries` system variable set to specify a number of auto-rejoin attempts, it proceeds to make the specified number of attempts to rejoin the group while in super read only mode. If the member does not have any auto-rejoin attempts specified, or if it has exhausted the specified number of attempts, it follows the action specified by the system variable `group_replication_exit_state_action`.

  For more information on using the `group_replication_member_expel_timeout` setting, see Section 20.7.7.1, “Expel Timeout”. For alternative mitigation strategies to avoid unnecessary expulsions where this system variable is not available, see Section 20.3.2, “Group Replication Limitations”.

* `group_replication_member_weight`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately. The system variable's current value is read when a failover situation occurs.

  `group_replication_member_weight` specifies a percentage weight that can be assigned to members to influence the chance of the member being elected as primary in the event of failover, for example when the existing primary leaves a single-primary group. Assign numeric weights to members to ensure that specific members are elected, for example during scheduled maintenance of the primary or to ensure certain hardware is prioritized in the event of failover.

  For a group with members configured as follows:

  + `member-1`: group\_replication\_member\_weight=30, server\_uuid=aaaa

  + `member-2`: group\_replication\_member\_weight=40, server\_uuid=bbbb

  + `member-3`: group\_replication\_member\_weight=40, server\_uuid=cccc

  + `member-4`: group\_replication\_member\_weight=40, server\_uuid=dddd

  during election of a new primary the members above would be sorted as `member-2`, `member-3`, `member-4`, and `member-1`. This results in `member`-2 being chosen as the new primary in the event of failover. For more information, see Section 20.1.3.1, “Single-Primary Mode”.

* `group_replication_message_cache_size`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  This system variable should have the same value on all group members. The value of this system variable can be changed while Group Replication is running. The change takes effect on each group member after you stop and restart Group Replication on the member. During this process, the value of the system variable is permitted to differ between group members, but members might be unable to reconnect in the event of a disconnection.

  `group_replication_message_cache_size` sets the maximum amount of memory that is available for the message cache in the group communication engine for Group Replication (XCom). The XCom message cache holds messages (and their metadata) that are exchanged between the group members as a part of the consensus protocol. Among other functions, the message cache is used for recovery of missed messages by members that reconnect with the group after a period where they were unable to communicate with the other group members.

  The `group_replication_member_expel_timeout` system variable determines the waiting period (up to an hour) that is allowed in addition to the initial 5-second detection period for members to return to the group rather than being expelled. The size of the XCom message cache should be set with reference to the expected volume of messages in this time period, so that it contains all the missed messages required for members to return successfully. The default is a 5-second waiting period after the 5-second detection period, for a total time period of 10 seconds.

  Ensure that sufficient memory is available on your system for your chosen cache size limit, considering the size of the server's other caches and object pools. The default setting is 1073741824 bytes (1 GB). The minimum setting of 134217728 bytes (128 MB) enables deployment on a host that has a restricted amount of available memory, and good network connectivity to minimize the frequency and duration of transient losses of connectivity for group members. Note that the limit set using `group_replication_message_cache_size` applies only to the data stored in the cache, and the cache structures require an additional 50 MB of memory.

  The cache size limit can be increased or reduced dynamically at runtime. If you reduce the cache size limit, XCom removes the oldest entries that have been decided and delivered until the current size is below the limit. Group Replication's Group Communication System (GCS) alerts you, by a warning message, when a message that is likely to be needed for recovery by a member that is currently unreachable is removed from the message cache. For more information on tuning the message cache size, see Section 20.7.6, “XCom Cache Management”.

* `group_replication_paxos_single_leader`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Note

  This system variable is a group-wide configuration setting, and a full reboot of the replication group is required for a change to take effect.

  `group_replication_paxos_single_leader` enables the group communication engine to operate with a single consensus leader when the group is in single-primary mode. With the default setting `OFF`, this behavior is disabled, and every member of the group is used as a leader, which is the behavior in releases before this system variable was available. When this variable is set to `ON`, the group communication engine can use a single leader to drive consensus. Operating with a single consensus leader improves performance and resilience in single-primary mode, particularly when some of the group’s secondary members are currently unreachable. For more information, see Section 20.7.3, “Single Consensus Leader”.

  In order for the group communication engine to use a single consensus leader, the group's communication protocol version must be MySQL 8.0.27 or later. Use `group_replication_get_communication_protocol()` to obtain the group's communication protocol version. If a lower version is in use, the group cannot use this behavior. You can use `group_replication_set_communication_protocol()` to set the communication protocol to a higher version if all group members support it. For more information, see Section 20.5.1.4, “Setting a Group's Communication Protocol Version”.

  This system variable is a group-wide configuration setting. It must have the same value on all group members, cannot be changed while Group Replication is running, and requires a full reboot of the group (a bootstrap by a server with `group_replication_bootstrap_group=ON`) in order for the value change to take effect. For instructions to safely bootstrap a group where transactions have been executed and certified, see Section 20.5.2, “Restarting a Group”.

  If the group has a value set for this system variable, and a joining member has a different value set for the system variable, the joining member cannot join the group until the value is changed to match. If the group members have a value set for this system variable, and the joining member does not support the system variable, it cannot join the group.

  The `WRITE_CONSENSUS_SINGLE_LEADER_CAPABLE` column of the Performance Schema `replication_group_communication_information` table shows whether the group supports the use of a single leader, even if `group_replication_paxos_single_leader` is currently set to `OFF` on the queried member. The column value is 1 if the group was started with `group_replication_paxos_single_leader` set to `ON`, and its communication protocol version is MySQL 8.0.27 or later.

* `group_replication_poll_spin_loops`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_poll_spin_loops` specifies the number of times the group communication thread waits for the communication engine mutex to be released before the thread waits for more incoming network messages.

* `group_replication_preemptive_garbage_collection`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Enable preemptive garbage collection in single-primary mode (only), keeping only the write sets for those transactions that have not yet been committed in the database.

  In single-primary mode it is possible to clean up write sets for a given transaction earlier than in multi-primary mode; this is because conflicts are detected and handled by the database lock manager in the server while transactions are executing; thus, the write sets are useful only for calculating dependencies between transactions, and not for conflict detection. This means that write sets can be cleaned up as soon as the transaction to which they belong is tracked in the Group Replication transaction dependency and conflict detection module.

  The aggressive purging of write sets which is performed when `group_replication_preemptive_garbage_collection` is enabled has the following effects:

  + Reduction in memory used to keep write sets in memory
  + Reduction of the impact of lagging secondaries on the tracking of write sets on the primary

  + Reduction of the amount of time that the write set database lock is held per round of write set deletion, and thus a reduction of its impact on throughput

  The value of `group_replication_preemptive_garbage_collection` can be changed only when Group Replication is not running, and has no effect on a group running in multi-primary mode. In addition, when this system variable is enabled, it is not possible to change between multi-primary mode and single-primary mode (see Section 20.5.1.2, “Changing the Group Mode”).

  `group_replication_preemptive_garbage_collection` must be set to the same value on all group members. A new joiner's `group_replication_preemptive_garbage_collection` value must be the same as those of all the group's current members, else it cannot join.

  A group member running a version of MySQL previous to 8.4.0 sends no `group_replication_preemptive_garbage_collection` value; in such cases, the value is considered to be `OFF`.

* `group_replication_preemptive_garbage_collection_rows_threshold`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  When preemptive garbage collection in single-primary mode is enabled (`group_replication_preemptive_garbage_collection` is `ON`), this is the number of rows of certification information needed to trigger its use.

  This variable has no effect on a group running in multi-primary mode.

* `group_replication_recovery_compression_algorithms`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  `group_replication_recovery_compression_algorithms` specifies the compression algorithms permitted for Group Replication distributed recovery connections for state transfer from a donor's binary log. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. For more information, see Section 6.2.8, “Connection Compression Control”.

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  This setting does not apply if the server has been set up to support cloning (see Section 20.5.4.2, “Cloning for Distributed Recovery”) and a remote cloning operation is used during distributed recovery. For this method of state transfer, the clone plugin's `clone_enable_compression` setting applies.

* `group_replication_recovery_get_public_key`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_get_public_key` specifies whether to request from the source the public key required for RSA key pair-based password exchange. If `group_replication_recovery_public_key_path` is set to a valid public key file, it takes precedence over `group_replication_recovery_get_public_key`. This variable applies if you are not using SSL for distributed recovery over the `group_replication_recovery` channel (`group_replication_recovery_use_ssl=ON`), and the replication user account for Group Replication authenticates with the `caching_sha2_password` plugin (the default). For more details, see Section 20.6.3.1.1, “Replication User With The Caching SHA-2 Authentication Plugin”.

* `group_replication_recovery_public_key_path`

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_public_key_path` specifies the path name to a file containing a replica-side copy of the public key required by the source for RSA key pair-based password exchange. The file must be in PEM format. If `group_replication_recovery_public_key_path` is set to a valid public key file, it takes precedence over `group_replication_recovery_get_public_key`. This variable applies if you are not using SSL for distributed recovery over the `group_replication_recovery` channel (so `group_replication_recovery_use_ssl` is set to `OFF`), and the replication user account for Group Replication authenticates with the `caching_sha2_password` plugin (the default) or the `sha256_password` plugin (deprecated). (For `sha256_password`, setting `group_replication_recovery_public_key_path` applies only if MySQL was built using OpenSSL.) For more details, see Section 20.6.3.1.1, “Replication User With The Caching SHA-2 Authentication Plugin”.

* `group_replication_recovery_reconnect_interval`

  <table frame="box" rules="all" summary="Properties for group_replication_clone_threshold"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-clone-threshold=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_clone_threshold">group_replication_clone_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Unit</th> <td>transactions</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_reconnect_interval` specifies the sleep time, in seconds, between reconnection attempts when no suitable donor was found in the group for distributed recovery.

* `group_replication_recovery_retry_count`

  <table frame="box" rules="all" summary="Properties for group_replication_clone_threshold"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-clone-threshold=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_clone_threshold">group_replication_clone_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Unit</th> <td>transactions</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_retry_count` specifies the number of times that the member that is joining tries to connect to the available donors for distributed recovery before giving up.

* `group_replication_recovery_ssl_ca`

  <table frame="box" rules="all" summary="Properties for group_replication_clone_threshold"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-clone-threshold=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_clone_threshold">group_replication_clone_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Unit</th> <td>transactions</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_ssl_ca` specifies the path to a file that contains a list of trusted SSL certificate authorities for distributed recovery connections. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”") for information on configuring SSL for distributed recovery.

  If this server has been set up to support cloning (see Section 20.5.4.2, “Cloning for Distributed Recovery”), and you have set `group_replication_recovery_use_ssl` to `ON`, Group Replication automatically configures the setting for the clone SSL option `clone_ssl_ca` to match your setting for `group_replication_recovery_ssl_ca`.

  When the MySQL communication stack is in use for the group (`group_replication_communication_stack = MYSQL`), this setting is used for the TLS/SSL configuration for group communication connections, as well as for distributed recovery connections.

* `group_replication_recovery_ssl_capath`

  <table frame="box" rules="all" summary="Properties for group_replication_clone_threshold"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-clone-threshold=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_clone_threshold">group_replication_clone_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Unit</th> <td>transactions</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_ssl_capath` specifies the path to a directory that contains trusted SSL certificate authority certificates for distributed recovery connections. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”") for information on configuring SSL for distributed recovery.

  When the MySQL communication stack is in use for the group (`group_replication_communication_stack = MYSQL`), this setting is used for the TLS/SSL configuration for group communication connections, as well as for distributed recovery connections.

* `group_replication_recovery_ssl_cert`

  <table frame="box" rules="all" summary="Properties for group_replication_clone_threshold"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-clone-threshold=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_clone_threshold">group_replication_clone_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Unit</th> <td>transactions</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_ssl_cert` specifies the name of the SSL certificate file to use for establishing a secure connection for distributed recovery. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”") for information on configuring SSL for distributed recovery.

  If this server has been set up to support cloning (see Section 20.5.4.2, “Cloning for Distributed Recovery”), and you have set `group_replication_recovery_use_ssl` to `ON`, Group Replication automatically configures the setting for the clone SSL option `clone_ssl_cert` to match your setting for `group_replication_recovery_ssl_cert`.

  When the MySQL communication stack is in use for the group (`group_replication_communication_stack = MYSQL`), this setting is used for the TLS/SSL configuration for group communication connections, as well as for distributed recovery connections.

* `group_replication_recovery_ssl_cipher`

  <table frame="box" rules="all" summary="Properties for group_replication_clone_threshold"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-clone-threshold=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_clone_threshold">group_replication_clone_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Unit</th> <td>transactions</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_ssl_cipher` specifies the list of permissible ciphers for SSL encryption. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”") for information on configuring SSL for distributed recovery.

  When the MySQL communication stack is in use for the group (`group_replication_communication_stack = MYSQL`), this setting is used for the TLS/SSL configuration for group communication connections, as well as for distributed recovery connections.

* `group_replication_recovery_ssl_crl`

  <table frame="box" rules="all" summary="Properties for group_replication_clone_threshold"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-clone-threshold=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_clone_threshold">group_replication_clone_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Unit</th> <td>transactions</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_ssl_crl` specifies the path to a directory that contains files containing certificate revocation lists. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”") for information on configuring SSL for distributed recovery.

  When the MySQL communication stack is in use for the group (`group_replication_communication_stack = MYSQL`), this setting is used for the TLS/SSL configuration for group communication connections, as well as for distributed recovery connections.

* `group_replication_recovery_ssl_crlpath`

  <table frame="box" rules="all" summary="Properties for group_replication_clone_threshold"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-clone-threshold=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_clone_threshold">group_replication_clone_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Unit</th> <td>transactions</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_ssl_crlpath` specifies the path to a directory that contains files containing certificate revocation lists. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”") for information on configuring SSL for distributed recovery.

  When the MySQL communication stack is in use for the group (`group_replication_communication_stack = MYSQL`), this setting is used for the TLS/SSL configuration for group communication connections, as well as for distributed recovery connections.

* `group_replication_recovery_ssl_key`

  <table frame="box" rules="all" summary="Properties for group_replication_clone_threshold"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-clone-threshold=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_clone_threshold">group_replication_clone_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Unit</th> <td>transactions</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_ssl_key` specifies the name of the SSL key file to use for establishing a secure connection. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”") for information on configuring SSL for distributed recovery.

  If this server has been set up to support cloning (see Section 20.5.4.2, “Cloning for Distributed Recovery”), and you have set `group_replication_recovery_use_ssl` to `ON`, Group Replication automatically configures the setting for the clone SSL option `clone_ssl_key` to match your setting for `group_replication_recovery_ssl_key`.

  When the MySQL communication stack is in use for the group (`group_replication_communication_stack = MYSQL`), this setting is used for the TLS/SSL configuration for group communication connections, as well as for distributed recovery connections.

* `group_replication_recovery_ssl_verify_server_cert`

  <table frame="box" rules="all" summary="Properties for group_replication_clone_threshold"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-clone-threshold=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_clone_threshold">group_replication_clone_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">9223372036854775807</code></td> </tr><tr><th>Unit</th> <td>transactions</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_ssl_verify_server_cert` specifies whether the distributed recovery connection should check the server's Common Name value in the certificate sent by the donor. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”") for information on configuring SSL for distributed recovery.

  When the MySQL communication stack is in use for the group (`group_replication_communication_stack = MYSQL`), this setting is used for the TLS/SSL configuration for group communication connections, as well as for distributed recovery connections.

* `group_replication_recovery_tls_ciphersuites`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_debug_options"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-debug-options=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_debug_options">group_replication_communication_debug_options</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">GCS_DEBUG_NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">GCS_DEBUG_NONE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_tls_ciphersuites` specifies a colon-separated list of one or more permitted ciphersuites when TLSv1.3 is used for connection encryption for the distributed recovery connection, and this server instance is the client in the distributed recovery connection, that is, the joining member. If this system variable is set to `NULL` when TLSv1.3 is used (which is the default if you do not set the system variable), the ciphersuites that are enabled by default are allowed, as listed in Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”. If this system variable is set to the empty string, no cipher suites are allowed, and TLSv1.3 is therefore not used. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”"), for information on configuring SSL for distributed recovery.

  When the MySQL communication stack is in use for the group (`group_replication_communication_stack = MYSQL`), this setting is used for the TLS/SSL configuration for group communication connections, as well as for distributed recovery connections.

* `group_replication_recovery_tls_version`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_debug_options"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-debug-options=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_debug_options">group_replication_communication_debug_options</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">GCS_DEBUG_NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">GCS_DEBUG_NONE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_tls_version` specifies a comma-separated list of one or more permitted TLS protocols for connection encryption when this server instance is the client in the distributed recovery connection, that is, the joining member. The group members involved in each distributed recovery connection as the client (joining member) and server (donor) negotiate the highest protocol version that they are both set up to support.

  When the MySQL communication stack is in use for the group (`group_replication_communication_stack = MYSQL`), this setting is used for the TLS/SSL configuration for group communication connections, as well as for distributed recovery connections.

  The default is “`TLSv1.2,TLSv1.3`”. Ensure that the specified protocol versions are contiguous, with no versions numbers skipped from the middle of the sequence.

  Important

  + Support for the TLSv1.3 protocol is available in MySQL 9.5, provided that MySQL was compiled using OpenSSL 1.1.1. The server checks the version of OpenSSL at startup, and if it is lower than 1.1.1, TLSv1.3 is removed from the default value for the system variable. In that case, the default is `TLSv1.2`.

  + Group Replication supports TLSv1.3 with support for ciphersuite selection. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”") for more information.

  See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”") for information on configuring SSL for distributed recovery.

* `group_replication_recovery_use_ssl`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_debug_options"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-debug-options=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_debug_options">group_replication_communication_debug_options</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">GCS_DEBUG_NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">GCS_DEBUG_NONE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_use_ssl` specifies whether Group Replication distributed recovery connections between group members should use SSL or not. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”") for information on configuring SSL for distributed recovery.

  If this server has been set up to support cloning (see Section 20.5.4.2, “Cloning for Distributed Recovery”), and you set this option to `ON`, Group Replication uses SSL for remote cloning operations as well as for state transfer from a donor's binary log. If you set this option to `OFF`, Group Replication does not use SSL for remote cloning operations.

* `group_replication_recovery_zstd_compression_level`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_debug_options"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-debug-options=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_debug_options">group_replication_communication_debug_options</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">GCS_DEBUG_NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">GCS_DEBUG_NONE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_recovery_zstd_compression_level` specifies the compression level to use for Group Replication distributed recovery connections that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. For distributed recovery connections that do not use `zstd` compression, this variable has no effect.

  For more information, see Section 6.2.8, “Connection Compression Control”.

* `group_replication_resource_manager.applier_channel_lag`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_debug_options"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-debug-options=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_debug_options">group_replication_communication_debug_options</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">GCS_DEBUG_NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">GCS_DEBUG_NONE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  Specifies the maximum allowed lag time for an applier on a Group Replication secondary. Provided by the Group Replication Resource Manager component.

  The default value of this variable is equivalent to 1 hour; the maximum is equivalent to 12 hours. Setting `group_replication_resource_manager.applier_channel_lag` to `0` disables applier lag handling.

  If the current lag by a secondary applier as shown by `Gr_resource_manager_applier_channel_lag` exceeds `group_replication_resource_manager.applier_channel_lag` 10 times in succession, the system initiates a graceful exit from the current group and sets the member's state to `ERROR`.

  See Section 7.5.6.3, “Group Replication Resource Manager Component”, for more information.

* `group_replication_resource_manager.memory_used_limit`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_debug_options"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-debug-options=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_debug_options">group_replication_communication_debug_options</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">GCS_DEBUG_NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">GCS_DEBUG_NONE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  Specifies the maximum allowed memory usage on a Group Replication secondary, as a percent of system memory. Provided by the Group Replication Resource Manager component.

  Setting `group_replication_resource_manager.memory_used_limit` to `0` disables memory usage monitoring.

  If the current memory usage on a group replication secondary as shown by `Gr_resource_manager_memory_used` exceeds `group_replication_resource_manager.memory_used_limit` 10 times in succession, the system initiates a graceful exit from the current group and sets the member's state to `ERROR`.

  For more information, see Section 7.5.6.3, “Group Replication Resource Manager Component”.

* `group_replication_resource_manager.quarantine_time`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_debug_options"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-debug-options=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_debug_options">group_replication_communication_debug_options</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">GCS_DEBUG_NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">GCS_DEBUG_NONE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  Length of time, in seconds, to prevent the immediate re-ejection of a member attempting to join or rejoin a group after it has been expelled. Provided by the Group Replication Resource Manager component.

  The default is equal to 1 hour.

  See Section 7.5.6.3, “Group Replication Resource Manager Component”, for more information.

* `group_replication_resource_manager.recovery_channel_lag`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_debug_options"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-debug-options=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_debug_options">group_replication_communication_debug_options</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">GCS_DEBUG_NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">GCS_DEBUG_NONE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  Specifies the maximum allowed lag time for a recovery thread on a Group Replication secondary. Provided by the Group Replication Resource Manager component.

  The default value of this variable is equivalent to 1 hour; the maximum is equivalent to 12 hours. Setting `group_replication_resource_manager.recovery_channel_lag` to `0` disables recovery lag handling.

  If the current lag by a recovery thread as shown by `Gr_resource_manager_recovery_channel_lag` exceeds `group_replication_resource_manager.recovery_channel_lag` 10 times in succession, the system initiates a graceful exit from the current group and sets the member's state to `ERROR`.

  For more information, see Section 7.5.6.3, “Group Replication Resource Manager Component”.

* `group_replication_single_primary_mode`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_debug_options"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-debug-options=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_debug_options">group_replication_communication_debug_options</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">GCS_DEBUG_NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">GCS_DEBUG_NONE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  Note

  This system variable is a group-wide configuration setting, and a full reboot of the replication group is required for a change to take effect.

  `group_replication_single_primary_mode` instructs the group to pick a single server automatically to be the one that handles read/write workload. This server is the primary and all others are secondaries.

  This system variable is a group-wide configuration setting. It must have the same value on all group members, cannot be changed while Group Replication is running, and requires a full reboot of the group (a bootstrap by a server with `group_replication_bootstrap_group=ON`) in order for the value change to take effect. For instructions to safely bootstrap a group where transactions have been executed and certified, see Section 20.5.2, “Restarting a Group”.

  If the group has a value set for this system variable, and a joining member has a different value set for the system variable, the joining member cannot join the group until the value is changed to match. If the group members have a value set for this system variable, and the joining member does not support the system variable, it cannot join the group.

  Setting this variable `ON` causes any setting for `group_replication_auto_increment_increment` to be ignored.

  Use the functions `group_replication_switch_to_single_primary_mode()` and `group_replication_switch_to_multi_primary_mode()` to change the value of this system variable while the group is still running. For more information, see Section 20.5.1.2, “Changing the Group Mode”.

* `group_replication_ssl_mode`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_debug_options"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-debug-options=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_debug_options">group_replication_communication_debug_options</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">GCS_DEBUG_NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">GCS_DEBUG_NONE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_BASIC</code></p><p class="valid-value"><code class="literal">XCOM_DEBUG_TRACE</code></p><p class="valid-value"><code class="literal">GCS_DEBUG_ALL</code></p></td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_ssl_mode` sets the security state of group communication connections between Group Replication members. The possible values are as follows:

  DISABLED :   Establish an unencrypted connection (the default).

  REQUIRED :   Establish a secure connection if the server supports secure connections.

  VERIFY\_CA :   Like `REQUIRED`, but additionally verify the server TLS certificate against the configured Certificate Authority (CA) certificates.

  VERIFY\_IDENTITY :   Like `VERIFY_CA`, but additionally verify that the server certificate matches the host to which the connection is attempted.

  This variable should have the same value on all members of the group; otherwise, new members may be unable to join.

  See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”") for information on configuring SSL for group communication.

* `group_replication_start_on_boot`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_max_message_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-max-message-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_max_message_size">group_replication_communication_max_message_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10485760</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_start_on_boot` specifies whether the server should start Group Replication automatically (`ON`) or not (`OFF`) during server start. When you set this option to `ON`, Group Replication restarts automatically after a remote cloning operation is used for distributed recovery.

  To start Group Replication automatically during server start, the user credentials for distributed recovery must be stored in the replication metadata repositories on the server using the `CHANGE REPLICATION SOURCE TO` statement. If you prefer to specify user credentials as part of `START GROUP_REPLICATION`, which stores the user credentials in memory only, ensure that `group_replication_start_on_boot` is set to `OFF`.

* `group_replication_tls_source`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_max_message_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-max-message-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_max_message_size">group_replication_communication_max_message_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10485760</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, but the change takes effect only after you stop and restart Group Replication on the group member.

  `group_replication_tls_source` specifies the source of TLS material for Group Replication.

* `group_replication_transaction_size_limit`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_max_message_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-max-message-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_max_message_size">group_replication_communication_max_message_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10485760</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  This system variable should have the same value on all group members. The value of this system variable can be changed while Group Replication is running. The change takes effect immediately on the group member, and applies from the next transaction started on that member. During this process, the value of the system variable is permitted to differ between group members, but some transactions might be rejected.

  `group_replication_transaction_size_limit` configures the maximum transaction size in bytes which the replication group accepts. Transactions larger than this size are rolled back by the receiving member and are not broadcast to the group. Large transactions can cause problems for a replication group in terms of memory allocation, which can cause the system to slow down, or in terms of network bandwidth consumption, which can cause a member to be suspected of having failed because it is busy processing the large transaction.

  When this system variable is set to 0 there is no limit to the size of transactions the group accepts. The default is 150000000 bytes (approximately 143 MB). Adjust the value of this system variable depending on the maximum message size that you need the group to tolerate, bearing in mind that the time taken to process a transaction is proportional to its size. The value of `group_replication_transaction_size_limit` should be the same on all group members. For further mitigation strategies for large transactions, see Section 20.3.2, “Group Replication Limitations”.

* `group_replication_unreachable_majority_timeout`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_max_message_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-max-message-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_max_message_size">group_replication_communication_max_message_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10485760</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  The value of this system variable can be changed while Group Replication is running, and the change takes effect immediately. The current value of the system variable is read when an issue occurs that means the behavior is needed.

  `group_replication_unreachable_majority_timeout` specifies a number of seconds for which members that suffer a network partition and cannot connect to the majority wait before leaving the group. In a group of 5 servers (S1,S2,S3,S4,S5), if there is a disconnection between (S1,S2) and (S3,S4,S5) there is a network partition. The first group (S1,S2) is now in a minority because it cannot contact more than half of the group. While the majority group (S3,S4,S5) remains running, the minority group waits for the specified time for a network reconnection. For a detailed description of this scenario, see Section 20.7.8, “Handling a Network Partition and Loss of Quorum”.

  By default, `group_replication_unreachable_majority_timeout` is set to 0, which means that members that find themselves in a minority due to a network partition wait forever to leave the group. If you set a timeout, when the specified time elapses, all pending transactions processed by the minority are rolled back, and the servers in the minority partition move to the `ERROR` state. If a member has the `group_replication_autorejoin_tries` system variable set to specify a number of auto-rejoin attempts, it proceeds to make the specified number of attempts to rejoin the group while in super read only mode. If the member does not have any auto-rejoin attempts specified, or if it has exhausted the specified number of attempts, it follows the action specified by the system variable `group_replication_exit_state_action`.

  Warning

  When you have a symmetric group, with just two members for example (S0,S2), if there is a network partition and there is no majority, after the configured timeout all members enter the `ERROR` state.

  For more information on using this option, see Section 20.7.7.2, “Unreachable Majority Timeout”.

* `group_replication_view_change_uuid`

  <table frame="box" rules="all" summary="Properties for group_replication_communication_max_message_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--group-replication-communication-max-message-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_communication_max_message_size">group_replication_communication_max_message_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10485760</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  Note

  This system variable is a group-wide configuration setting, and a full reboot of the replication group is required for a change to take effect.

  `group_replication_view_change_uuid` specifies an alternative UUID to use as the UUID part of the identifier in the GTIDs for view change events generated by the group. The alternative UUID makes these internally generated transactions easy to distinguish from transactions received by the group from clients. This can be useful if your setup allows for failover between groups, and you need to identify and discard transactions that were specific to the backup group. The default value for this system variable is `AUTOMATIC`, meaning that the GTIDs for view change events use the group name specified by the `group_replication_group_name` system variable, as transactions from clients do. Group members at a release that does not have this system variable are treated as having the value `AUTOMATIC`.

  The alternative UUID must be different from the group name specified by the `group_replication_group_name` system variable, and it must be different from the server UUID of any group member. It must also be different from any UUIDs used in the GTIDs that are applied to anonymous transactions on replication channels anywhere in this topology, using the `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` option of the `CHANGE REPLICATION SOURCE TO` statement.

  This system variable is a group-wide configuration setting. It must have the same value on all group members, cannot be changed while Group Replication is running, and requires a full reboot of the group (a bootstrap by a server with `group_replication_bootstrap_group=ON`) in order for the value change to take effect. For instructions to safely bootstrap a group where transactions have been executed and certified, see Section 20.5.2, “Restarting a Group”.

  If the group has a value set for this system variable, and a joining member has a different value set for the system variable, the joining member cannot join the group until the value is changed to match. If the group members have a value set for this system variable, and the joining member does not support the system variable, it cannot join the group.

  Logging of view change events is replaced by sharing of recovery metadata; thus, this variable is deprecated, and subject to removal in a future version of MySQL.

The previous list includes those system variables provided by the Group Replication Flow Control Statistics component and by the Group Replication Resource Manager component. See Section 7.5.6.2, “Group Replication Flow Control Statistics Component”, and Section 7.5.6.3, “Group Replication Resource Manager Component”, for more information about these components.
