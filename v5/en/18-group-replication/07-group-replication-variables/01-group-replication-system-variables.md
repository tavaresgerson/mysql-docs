### 17.7.1 Group Replication System Variables

This section lists the system variables that are specific to the Group Replication plugin.

The name of each Group Replication system variable is prefixed with `group_replication_`.

Most system variables for Group Replication are described as dynamic, and their values can be changed while the server is running. However, in most cases, the change only takes effect after you stop and restart Group Replication on the group member using a [`STOP GROUP_REPLICATION`](stop-group-replication.html "13.4.3.2 STOP GROUP_REPLICATION Statement") statement followed by a [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") statement. Changes to the following system variables take effect without stopping and restarting Group Replication:

* [`group_replication_exit_state_action`](group-replication-system-variables.html#sysvar_group_replication_exit_state_action)
* [`group_replication_flow_control_applier_threshold`](group-replication-system-variables.html#sysvar_group_replication_flow_control_applier_threshold)
* [`group_replication_flow_control_certifier_threshold`](group-replication-system-variables.html#sysvar_group_replication_flow_control_certifier_threshold)
* [`group_replication_flow_control_hold_percent`](group-replication-system-variables.html#sysvar_group_replication_flow_control_hold_percent)
* [`group_replication_flow_control_max_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_max_quota)
* [`group_replication_flow_control_member_quota_percent`](group-replication-system-variables.html#sysvar_group_replication_flow_control_member_quota_percent)
* [`group_replication_flow_control_min_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_min_quota)
* [`group_replication_flow_control_min_recovery_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_min_recovery_quota)
* [`group_replication_flow_control_mode`](group-replication-system-variables.html#sysvar_group_replication_flow_control_mode)
* [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members)
* [`group_replication_member_weight`](group-replication-system-variables.html#sysvar_group_replication_member_weight)
* [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit)
* [`group_replication_unreachable_majority_timeout`](group-replication-system-variables.html#sysvar_group_replication_unreachable_majority_timeout)

Most system variables for Group Replication can have different values on different group members. For the following system variables, it is advisable to set the same value on all members of a group in order to avoid unnecessary rollback of transactions, failure of message delivery, or failure of message recovery:

* [`group_replication_auto_increment_increment`](group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment)
* [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold)
* [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit)

Some system variables on a Group Replication group member, including some Group Replication-specific system variables and some general system variables, are group-wide configuration settings. These system variables must have the same value on all group members, cannot be changed while Group Replication is running, and require a full reboot of the group (a bootstrap by a server with [`group_replication_bootstrap_group=ON`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group)) in order for the value change to take effect. These conditions apply to the following system variables:

* [`group_replication_single_primary_mode`](group-replication-system-variables.html#sysvar_group_replication_single_primary_mode)
* [`group_replication_enforce_update_everywhere_checks`](group-replication-system-variables.html#sysvar_group_replication_enforce_update_everywhere_checks)
* [`group_replication_gtid_assignment_block_size`](group-replication-system-variables.html#sysvar_group_replication_gtid_assignment_block_size)
* [`default_table_encryption`](/doc/refman/8.0/en/server-system-variables.html#sysvar_default_table_encryption)
* [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names)
* [`transaction_write_set_extraction`](replication-options-binary-log.html#sysvar_transaction_write_set_extraction)

Important

* A number of system variables for Group Replication are not completely validated during server startup if they are passed as command line arguments to the server. These system variables include [`group_replication_group_name`](group-replication-system-variables.html#sysvar_group_replication_group_name), [`group_replication_single_primary_mode`](group-replication-system-variables.html#sysvar_group_replication_single_primary_mode), [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members), the SSL variables, and the flow control system variables. They are only fully validated after the server has started.

* System variables for Group Replication that specify IP addresses or host names for group members are not validated until a [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") statement is issued. Group Replication's Group Communication System (GCS) is not available to validate the values until that point.

The system variables that are specific to the Group Replication plugin are as follows:

* [`group_replication_allow_local_disjoint_gtids_join`](group-replication-system-variables.html#sysvar_group_replication_allow_local_disjoint_gtids_join)

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_disjoint_gtids_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-disjoint-gtids-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>Deprecated</th> <td>5.7.21</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_allow_local_disjoint_gtids_join">group_replication_allow_local_disjoint_gtids_join</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Deprecated in version 5.7.21 and scheduled for removal in a future version. Allows the server to join the group even if it has local transactions that are not present in the group.

  Warning

  Use caution when enabling this option as incorrect usage can lead to conflicts in the group and rollback of transactions. The option should only be enabled as a last resort method to allow a server that has local transactions to join an existing group, and then only if the local transactions do not affect the data that is handled by the group (for example, an administrative action that was written to the binary log). The option should not be left enabled on all group members.

* [`group_replication_allow_local_lower_version_join`](group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join)

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join">group_replication_allow_local_lower_version_join</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Allows the current server to join the group even if it has a lower major version than the group. With the default setting `OFF`, servers are not permitted to join a replication group if they have a lower major version than the existing group members. For example, a MySQL 5.7 server cannot join a group that consists of MySQL 8.0 servers. This standard policy ensures that all members of a group are able to exchange messages and apply transactions. Set [`group_replication_allow_local_lower_version_join`](group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join) to `ON` only in the following scenarios:

  + A server must be added to the group in an emergency in order to improve the group's fault tolerance, and only older versions are available.

  + You want to carry out a downgrade of the replication group members without shutting down the whole group and bootstrapping it again.

  Warning

  Setting this option to `ON` does not make the new member compatible with the group, and allows it to join the group without any safeguards against incompatible behaviors by the existing members. To ensure the new member's correct operation, take *both* of the following precautions:

  1. Before the server with the lower major version joins the group, stop all writes on that server.

  2. From the point where the server with the lower major version joins the group, stop all writes on the other servers in the group.

  Without these precautions, the server with the lower major version is likely to experience difficulties and terminate with an error.

* [`group_replication_auto_increment_increment`](group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment)

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  Determines the interval between successive column values for transactions that execute on this server instance. This system variable should have the same value on all group members. When Group Replication is started on a server, the value of the server system variable [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) is changed to this value, and the value of the server system variable [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) is changed to the server ID. These settings avoid the selection of duplicate auto-increment values for writes on group members, which causes rollback of transactions. The changes are reverted when Group Replication is stopped. These changes are only made and reverted if [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) and [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) each have their default value of 1. If their values have already been modified from the default, Group Replication does not alter them.

  The default value of 7 represents a balance between the number of usable values and the permitted maximum size of a replication group (9 members). If your group has more or fewer members, you can set this system variable to match the expected number of group members before Group Replication is started. You cannot change the setting while Group Replication is running.

  Important

  Setting `group_replication_auto_increment_increment` has no effect when [`group_replication_single_primary_mode`](group-replication-system-variables.html#sysvar_group_replication_single_primary_mode) is `ON`.

* [`group_replication_bootstrap_group`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group)

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Configure this server to bootstrap the group. This option must only be set on one server and only when starting the group for the first time or restarting the entire group. After the group has been bootstrapped, set this option to `OFF`. It should be set to `OFF` both dynamically and in the configuration files. Starting two servers or restarting one server with this option set while the group is running may lead to an artificial split brain situation, where two independent groups with the same name are bootstrapped.

* [`group_replication_components_stop_timeout`](group-replication-system-variables.html#sysvar_group_replication_components_stop_timeout)

  <table frame="box" rules="all" summary="Properties for group_replication_components_stop_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-components-stop-timeout=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_components_stop_timeout">group_replication_components_stop_timeout</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>31536000</code></td> </tr><tr><th>Minimum Value</th> <td><code>2</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  Timeout, in seconds, that Group Replication waits for each of the components when shutting down.

* [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold)

  <table frame="box" rules="all" summary="Properties for group_replication_compression_threshold"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-compression-threshold=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_compression_threshold">group_replication_compression_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1000000</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  The threshold value in bytes above which compression is applied to messages sent between group members. If this system variable is set to zero, compression is disabled. The value of [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold) should be the same on all group members.

  Group Replication uses the LZ4 compression algorithm to compress messages sent in the group. Note that the maximum supported input size for the LZ4 compression algorithm is 2113929216 bytes. This limit is lower than the maximum possible value for the [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold) system variable, which is matched to the maximum message size accepted by XCom. With the LZ4 compression algorithm, do not set a value greater than 2113929216 bytes for [`group_replication_compression_threshold`](group-replication-system-variables.html#sysvar_group_replication_compression_threshold), because transactions above this size cannot be committed when message compression is enabled.

  For more information, see [Section 17.9.7.2, “Message Compression”](group-replication-message-compression.html "17.9.7.2 Message Compression").

* [`group_replication_enforce_update_everywhere_checks`](group-replication-system-variables.html#sysvar_group_replication_enforce_update_everywhere_checks)

  <table frame="box" rules="all" summary="Properties for group_replication_enforce_update_everywhere_checks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-enforce-update-everywhere-checks[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_enforce_update_everywhere_checks">group_replication_enforce_update_everywhere_checks</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Enable or disable strict consistency checks for multi-primary update everywhere. The default is that checks are disabled. In single-primary mode, this option must be disabled on all group members. In multi-primary mode, when this option is enabled, statements are checked as follows to ensure they are compatible with multi-primary mode:

  + If a transaction is executed under the `SERIALIZABLE` isolation level, then its commit fails when synchronizing itself with the group.

  + If a transaction executes against a table that has foreign keys with cascading constraints, then the transaction fails to commit when synchronizing itself with the group.

  This system variable is a group-wide configuration setting. It must have the same value on all group members, cannot be changed while Group Replication is running, and requires a full reboot of the group (a bootstrap by a server with [`group_replication_bootstrap_group=ON`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group)) in order for the value change to take effect.

* [`group_replication_exit_state_action`](group-replication-system-variables.html#sysvar_group_replication_exit_state_action)

  <table frame="box" rules="all" summary="Properties for group_replication_exit_state_action"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-exit-state-action=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.24</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_exit_state_action">group_replication_exit_state_action</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>READ_ONLY</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ABORT_SERVER</code></p><p class="valid-value"><code>READ_ONLY</code></p></td> </tr></tbody></table>

  Configures how Group Replication behaves when a server instance leaves the group unintentionally, for example after encountering an applier error, or in the case of a loss of majority, or when another member of the group expels it due to a suspicion timing out. The timeout period for a member to leave the group in the case of a loss of majority is set by the [`group_replication_unreachable_majority_timeout`](group-replication-system-variables.html#sysvar_group_replication_unreachable_majority_timeout) system variable. Note that an expelled group member does not know that it was expelled until it reconnects to the group, so the specified action is only taken if the member manages to reconnect, or if the member raises a suspicion on itself and expels itself.

  When [`group_replication_exit_state_action`](group-replication-system-variables.html#sysvar_group_replication_exit_state_action) is set to `ABORT_SERVER`, if the member exits the group unintentionally, the instance shuts down MySQL.

  When [`group_replication_exit_state_action`](group-replication-system-variables.html#sysvar_group_replication_exit_state_action) is set to `READ_ONLY`, if the member exits the group unintentionally, the instance switches MySQL to super read only mode (by setting the system variable [`super_read_only`](server-system-variables.html#sysvar_super_read_only) to `ON`). This setting is the default in MySQL 5.7.

  Important

  If a failure occurs before the member has successfully joined the group, the specified exit action *is not taken*. This is the case if there is a failure during the local configuration check, or a mismatch between the configuration of the joining member and the configuration of the group. In these situations, the [`super_read_only`](server-system-variables.html#sysvar_super_read_only) system variable is left with its original value, and the server does not shut down MySQL. To ensure that the server cannot accept updates when Group Replication did not start, we therefore recommend that [`super_read_only=ON`](server-system-variables.html#sysvar_super_read_only) is set in the server's configuration file at startup, which Group Replication changes to `OFF` on primary members after it has been started successfully. This safeguard is particularly important when the server is configured to start Group Replication on server boot ([`group_replication_start_on_boot=ON`](group-replication-system-variables.html#sysvar_group_replication_start_on_boot)), but it is also useful when Group Replication is started manually using a [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") command.

  If a failure occurs after the member has successfully joined the group, the specified exit action *is taken*. This is the case if there is an applier error, if the member is expelled from the group, or if the member is set to time out in the event of an unreachable majority. In these situations, if `READ_ONLY` is the exit action, the [`super_read_only`](server-system-variables.html#sysvar_super_read_only) system variable is set to `ON`, or if `ABORT_SERVER` is the exit action, the server shuts down MySQL.

  **Table 17.5 Exit actions in Group Replication failure situations**

  <table frame="all" summary="Summarizes how the selected exit action does or does not operate depending on the failure situation"><col align="left" style="width: 33%"/><col align="left" style="width: 33%"/><col align="left" style="width: 33%"/><thead><tr> <th scope="col"><p> Failure situation </p></th> <th scope="col"><p> Group Replication started with <code>START GROUP_REPLICATION</code> </p></th> <th scope="col"><p> Group Replication started with <code>group_replication_start_on_boot =ON</code> </p></th> </tr></thead><tbody><tr> <th scope="row"><p> Member fails local configuration check </p><p> OR </p><p> Mismatch between joining member and group configuration </p></th> <td><p> <code>super_read_only</code> unchanged </p><p> MySQL continues running </p><p> Set <code>super_read_only=ON</code> at startup to prevent updates </p></td> <td><p> <code>super_read_only</code> unchanged </p><p> MySQL continues running </p><p> Set <code>super_read_only=ON</code> at startup to prevent updates (Important) </p></td> </tr><tr> <th scope="row"><p> Applier error on member </p><p> OR </p><p> Member expelled from group </p><p> OR </p><p> Unreachable majority timeout </p></th> <td><p> <code>super_read_only</code> set to <code>ON</code> </p><p> OR </p><p> MySQL shuts down </p></td> <td><p> <code>super_read_only</code> set to <code>ON</code> </p><p> OR </p><p> MySQL shuts down </p></td> </tr></tbody></table>

* [`group_replication_flow_control_applier_threshold`](group-replication-system-variables.html#sysvar_group_replication_flow_control_applier_threshold)

  <table frame="box" rules="all" summary="Properties for group_replication_flow_control_applier_threshold"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-flow-control-applier-threshold=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_flow_control_applier_threshold">group_replication_flow_control_applier_threshold</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>25000</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483647</code></td> </tr><tr><th>Unit</th> <td>transactions</td> </tr></tbody></table>

  Specifies the number of waiting transactions in the applier queue that trigger flow control. This variable can be changed without resetting Group Replication.

* [`group_replication_flow_control_certifier_threshold`](group-replication-system-variables.html#sysvar_group_replication_flow_control_certifier_threshold)

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join">group_replication_allow_local_lower_version_join</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  Specifies the number of waiting transactions in the certifier queue that trigger flow control. This variable can be changed without resetting Group Replication.

* [`group_replication_flow_control_hold_percent`](group-replication-system-variables.html#sysvar_group_replication_flow_control_hold_percent)

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join">group_replication_allow_local_lower_version_join</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

  Defines what percentage of the group quota remains unused to allow a cluster under flow control to catch up on backlog. A value of 0 implies that no part of the quota is reserved for catching up on the work backlog.

* [`group_replication_flow_control_max_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_max_quota)

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join">group_replication_allow_local_lower_version_join</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

  Defines the maximum flow control quota of the group, or the maximum available quota for any period while flow control is enabled. A value of 0 implies that there is no maximum quota set. Cannot be smaller than [`group_replication_flow_control_min_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_min_quota) and `group_replication_flow_control_min_recovery_quota`.

* [`group_replication_flow_control_member_quota_percent`](group-replication-system-variables.html#sysvar_group_replication_flow_control_member_quota_percent)

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join">group_replication_allow_local_lower_version_join</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

  Defines the percentage of the quota that a member should assume is available for itself when calculating the quotas. A value of 0 implies that the quota should be split equally between members that were writers in the last period.

* [`group_replication_flow_control_min_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_min_quota)

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join">group_replication_allow_local_lower_version_join</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

  Controls the lowest flow control quota that can be assigned to a member, independently of the calculated minimum quota executed in the last period. A value of 0 implies that there is no minimum quota. Cannot be larger than [`group_replication_flow_control_max_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_max_quota).

* [`group_replication_flow_control_min_recovery_quota`](group-replication-system-variables.html#sysvar_group_replication_flow_control_min_recovery_quota)

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join">group_replication_allow_local_lower_version_join</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

  Controls the lowest quota that can be assigned to a member because of another recovering member in the group, independently of the calculated minimum quota executed in the last period. A value of 0 implies that there is no minimum quota. Cannot be larger than `group_replication_flow_control_max_quota`.

* [`group_replication_flow_control_mode`](group-replication-system-variables.html#sysvar_group_replication_flow_control_mode)

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join">group_replication_allow_local_lower_version_join</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

  Specifies the mode used for flow control. This variable can be changed without resetting Group Replication.

* [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members)

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join">group_replication_allow_local_lower_version_join</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

  A list of peer addresses as a comma separated list such as `host1:port1`,`host2:port2`. This option is used to force a new group membership, in which the excluded members do not receive a new view and are blocked. (You need to manually kill the excluded servers.) Any invalid host names in the list could cause this action to fail because they could block group membership. For a description of the procedure to follow, see [Section 17.5.3, “Network Partitioning”](group-replication-network-partitioning.html "17.5.3 Network Partitioning").

  You must specify the address or host name and port as they are given in the [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) option for each member. For example:

  ```sql
  "198.51.100.44:33061,example.org:33061"
  ```

  After you have used the [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members) system variable to successfully force a new group membership and unblock the group, ensure that you clear the system variable. [`group_replication_force_members`](group-replication-system-variables.html#sysvar_group_replication_force_members) must be empty in order to issue a [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") statement.

* [`group_replication_group_name`](group-replication-system-variables.html#sysvar_group_replication_group_name)

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join">group_replication_allow_local_lower_version_join</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

  The name of the group which this server instance belongs to. Must be a valid UUID. This UUID is used internally when setting GTIDs for Group Replication events in the binary log.

  Important

  A unique UUID must be used.

* [`group_replication_group_seeds`](group-replication-system-variables.html#sysvar_group_replication_group_seeds)

  <table frame="box" rules="all" summary="Properties for group_replication_allow_local_lower_version_join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-allow-local-lower-version-join[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_allow_local_lower_version_join">group_replication_allow_local_lower_version_join</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

  A list of group members to which a joining member can connect to obtain details of all the current group members. The joining member uses these details to select and connect to a group member to obtain the data needed for synchrony with the group. The list consists of the seed member's network addresses specified as a comma separated list, such as `host1:port1`,`host2:port2`.

  Important

  These addresses must not be the member's SQL hostname and port.

  Note that the value you specify for this variable is not validated until a [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") statement is issued and the Group Communication System (GCS) is available.

  Usually this list consists of all members of the group, but you can choose a subset of the group members to be seeds. The list must contain at least one valid member address. Each address is validated when starting Group Replication. If the list does not contain any valid host names, issuing [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") fails.

* [`group_replication_gtid_assignment_block_size`](group-replication-system-variables.html#sysvar_group_replication_gtid_assignment_block_size)

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>0

  The number of consecutive GTIDs that are reserved for each member. Each member consumes its blocks and reserves more when needed.

  This system variable is a group-wide configuration setting. It must have the same value on all group members, cannot be changed while Group Replication is running, and requires a full reboot of the group (a bootstrap by a server with [`group_replication_bootstrap_group=ON`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group)) in order for the value change to take effect.

* [`group_replication_ip_whitelist`](group-replication-system-variables.html#sysvar_group_replication_ip_whitelist)

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>1

  Specifies the allowlist of hosts that are permitted to connect to the group. The address that you specify for each group member in [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) must be allowlisted on the other servers in the replication group. Note that the value you specify for this variable is not validated until a [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") statement is issued and the Group Communication System (GCS) is available.

  By default, this system variable is set to `AUTOMATIC`, which permits connections from private subnetworks active on the host. The group communication engine (XCom) automatically scans active interfaces on the host, and identifies those with addresses on private subnetworks. These addresses and the `localhost` IP address for IPv4 are used to create the Group Replication allowlist. For a list of the ranges from which addresses are automatically allowlisted, see [Section 17.6.1, “Group Replication IP Address Allowlisting”](group-replication-ip-address-permissions.html "17.6.1 Group Replication IP Address Allowlisting").

  The automatic allowlist of private addresses cannot be used for connections from servers outside the private network. For Group Replication connections between server instances that are on different machines, you must provide public IP addresses and specify these as an explicit allowlist. If you specify any entries for the allowlist, the private addresses are not added automatically, so if you use any of these, you must specify them explicitly. The `localhost` IP address is added automatically.

  As the value of the [`group_replication_ip_whitelist`](group-replication-system-variables.html#sysvar_group_replication_ip_whitelist) option, you can specify any combination of the following:

  + IPv4 addresses (for example, `198.51.100.44`)

  + IPv4 addresses with CIDR notation (for example, `192.0.2.21/24`)

  + Host names, from MySQL 5.7.21 (for example, `example.org`)

  + Host names with CIDR notation, from MySQL 5.7.21 (for example, `www.example.com/24`)

  IPv6 addresses, and host names that resolve to IPv6 addresses, are not supported in MySQL 5.7. You can use CIDR notation in combination with host names or IP addresses to allowlist a block of IP addresses with a particular network prefix, but do ensure that all the IP addresses in the specified subnet are under your control.

  A comma must separate each entry in the allowlist. For example:

  ```sql
  192.0.2.22,198.51.100.0/24,example.org,www.example.com/24
  ```

  It is possible to configure different allowlists on different group members according to your security requirements, for example, in order to keep different subnets separate. However, this can cause issues when a group is reconfigured. If you do not have a specific security requirement to do otherwise, use the same allowlist on all members of a group. For more details, see [Section 17.6.1, “Group Replication IP Address Allowlisting”](group-replication-ip-address-permissions.html "17.6.1 Group Replication IP Address Allowlisting").

  For host names, name resolution takes place only when a connection request is made by another server. A host name that cannot be resolved is not considered for allowlist validation, and a warning message is written to the error log. Forward-confirmed reverse DNS (FCrDNS) verification is carried out for resolved host names.

  Warning

  Host names are inherently less secure than IP addresses in an allowlist. FCrDNS verification provides a good level of protection, but can be compromised by certain types of attack. Specify host names in your allowlist only when strictly necessary, and ensure that all components used for name resolution, such as DNS servers, are maintained under your control. You can also implement name resolution locally using the hosts file, to avoid the use of external components.

* [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address)

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>2

  The network address which the member provides for connections from other members, specified as a `host:port` formatted string. This address must be reachable by all members of the group because it is used by the group communication engine for Group Replication (XCom, a Paxos variant) for TCP communication between remote XCom instances. Communication with the local instance is over an input channel using shared memory.

  Warning

  Do not use this address for communication with the member.

  Other Group Replication members contact this member through this `host:port` for all internal group communication. This is not the MySQL server SQL protocol host and port.

  The address or host name that you specify in [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) is used by Group Replication as the unique identifier for a group member within the replication group. You can use the same port for all members of a replication group as long as the host names or IP addresses are all different, and you can use the same host name or IP address for all members as long as the ports are all different. The recommended port for [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) is 33061. Note that the value you specify for this variable is not validated until the [`START GROUP_REPLICATION`](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") statement is issued and the Group Communication System (GCS) is available.

* [`group_replication_member_weight`](group-replication-system-variables.html#sysvar_group_replication_member_weight)

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>3

  A percentage weight that can be assigned to members to influence the chance of the member being elected as primary in the event of failover, for example when the existing primary leaves a single-primary group. Assign numeric weights to members to ensure that specific members are elected, for example during scheduled maintenance of the primary or to ensure certain hardware is prioritized in the event of failover.

  For a group with members configured as follows:

  + `member-1`: group\_replication\_member\_weight=30, server\_uuid=aaaa

  + `member-2`: group\_replication\_member\_weight=40, server\_uuid=bbbb

  + `member-3`: group\_replication\_member\_weight=40, server\_uuid=cccc

  + `member-4`: group\_replication\_member\_weight=40, server\_uuid=dddd

  during election of a new primary the members above would be sorted as `member-2`, `member-3`, `member-4`, and `member-1`. This results in `member`-2 being chosen as the new primary in the event of failover. For more information, see [Section 17.5.1.1, “Single-Primary Mode”](group-replication-single-primary-mode.html "17.5.1.1 Single-Primary Mode").

* [`group_replication_poll_spin_loops`](group-replication-system-variables.html#sysvar_group_replication_poll_spin_loops)

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>4

  The number of times the group communication thread waits for the communication engine mutex to be released before the thread waits for more incoming network messages.

* [`group_replication_recovery_complete_at`](group-replication-system-variables.html#sysvar_group_replication_recovery_complete_at)

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>5

  Recovery policies when handling cached transactions after state transfer. This option specifies whether a member is marked online after it has received all transactions that it missed before it joined the group (`TRANSACTIONS_CERTIFIED`) or after it has received and applied them (`TRANSACTIONS_APPLIED`).

* [`group_replication_recovery_retry_count`](group-replication-system-variables.html#sysvar_group_replication_recovery_retry_count)

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>6

  The number of times that the member that is joining tries to connect to the available donors before giving up.

* [`group_replication_recovery_reconnect_interval`](group-replication-system-variables.html#sysvar_group_replication_recovery_reconnect_interval)

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>7

  The sleep time, in seconds, between reconnection attempts when no donor was found in the group.

* [`group_replication_recovery_ssl_ca`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_ca)

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>8

  The path to a file that contains a list of trusted SSL certificate authorities.

* [`group_replication_recovery_ssl_capath`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_capath)

  <table frame="box" rules="all" summary="Properties for group_replication_auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-auto-increment-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment">group_replication_auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>7</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>9

  The path to a directory that contains trusted SSL certificate authority certificates.

* [`group_replication_recovery_ssl_cert`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_cert)

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  The name of the SSL certificate file to use for establishing a secure connection.

* [`group_replication_recovery_ssl_key`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_key)

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

  The name of the SSL key file to use for establishing a secure connection.

* [`group_replication_recovery_ssl_cipher`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_cipher)

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

  The list of permissible ciphers for SSL encryption.

* [`group_replication_recovery_ssl_crl`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_crl)

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

  The path to a directory that contains files containing certificate revocation lists.

* [`group_replication_recovery_ssl_crlpath`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_crlpath)

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

  The path to a directory that contains files containing certificate revocation lists.

* [`group_replication_recovery_ssl_verify_server_cert`](group-replication-system-variables.html#sysvar_group_replication_recovery_ssl_verify_server_cert)

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

  Make the recovery process check the server's Common Name value in the donor sent certificate.

* [`group_replication_recovery_use_ssl`](group-replication-system-variables.html#sysvar_group_replication_recovery_use_ssl)

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

  Whether Group Replication recovery connection should use SSL or not.

* [`group_replication_single_primary_mode`](group-replication-system-variables.html#sysvar_group_replication_single_primary_mode)

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

  Note

  This system variable is a group-wide configuration setting, and a full reboot of the replication group is required for a change to take effect.

  [`group_replication_single_primary_mode`](group-replication-system-variables.html#sysvar_group_replication_single_primary_mode) instructs the group to pick a single server automatically to be the one that handles read/write workload. This server is the primary and all others are secondaries.

  This system variable is a group-wide configuration setting. It must have the same value on all group members, cannot be changed while Group Replication is running, and requires a full reboot of the group (a bootstrap by a server with [`group_replication_bootstrap_group=ON`](group-replication-system-variables.html#sysvar_group_replication_bootstrap_group)) in order for the value change to take effect. For instructions to safely bootstrap a group where transactions have been executed and certified, see [Section 17.5.4, “Restarting a Group”](group-replication-restarting-group.html "17.5.4 Restarting a Group").

  If the group has a value set for this system variable, and a joining member has a different value set for the system variable, the joining member cannot join the group until the value is changed to match. If the group members have a value set for this system variable, and the joining member does not support the system variable, it cannot join the group.

  Setting this variable `ON` causes any setting for [`group_replication_auto_increment_increment`](group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment) to be ignored.

* [`group_replication_ssl_mode`](group-replication-system-variables.html#sysvar_group_replication_ssl_mode)

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

  Specifies the security state of the connection between Group Replication members.

* [`group_replication_start_on_boot`](group-replication-system-variables.html#sysvar_group_replication_start_on_boot)

  <table frame="box" rules="all" summary="Properties for group_replication_bootstrap_group"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-bootstrap-group[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_bootstrap_group">group_replication_bootstrap_group</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

  Whether the server should start Group Replication or not during server start.

* [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit)

  <table frame="box" rules="all" summary="Properties for group_replication_components_stop_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-components-stop-timeout=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_components_stop_timeout">group_replication_components_stop_timeout</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>31536000</code></td> </tr><tr><th>Minimum Value</th> <td><code>2</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>0

  Configures the maximum transaction size in bytes which the replication group accepts. Transactions larger than this size are rolled back by the receiving member and are not broadcast to the group. Large transactions can cause problems for a replication group in terms of memory allocation, which can cause the system to slow down, or in terms of network bandwidth consumption, which can cause a member to be suspected of having failed because it is busy processing the large transaction.

  When this system variable is set to 0, there is no limit to the size of transactions the group accepts. In releases up to and including MySQL 5.7.37, the default setting for this system variable is 0. From MySQL 5.7.38, and in MySQL 8.0, the default setting is 150000000 bytes (approximately 143 MB). Adjust the value of this system variable depending on the maximum message size that you need the group to tolerate, bearing in mind that the time taken to process a transaction is proportional to its size. The value of [`group_replication_transaction_size_limit`](group-replication-system-variables.html#sysvar_group_replication_transaction_size_limit) should be the same on all group members. For further mitigation strategies for large transactions, see [Section 17.3.2, “Group Replication Limitations”](group-replication-limitations.html "17.3.2 Group Replication Limitations").

* [`group_replication_unreachable_majority_timeout`](group-replication-system-variables.html#sysvar_group_replication_unreachable_majority_timeout)

  <table frame="box" rules="all" summary="Properties for group_replication_components_stop_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--group-replication-components-stop-timeout=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="group-replication-system-variables.html#sysvar_group_replication_components_stop_timeout">group_replication_components_stop_timeout</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>31536000</code></td> </tr><tr><th>Minimum Value</th> <td><code>2</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>1

  Configures how long members that suffer a network partition and cannot connect to the majority wait before leaving the group.

  In a group of 5 servers (S1,S2,S3,S4,S5), if there is a disconnection between (S1,S2) and (S3,S4,S5) there is a network partition. The first group (S1,S2) is now in a minority because it cannot contact more than half of the group. While the majority group (S3,S4,S5) remains running, the minority group waits for the specified time for a network reconnection. Any transactions processed by the minority group are blocked until Group Replication is stopped using [`STOP GROUP REPLICATION`](stop-group-replication.html "13.4.3.2 STOP GROUP_REPLICATION Statement") on the members of the minority. Note that [`group_replication_unreachable_majority_timeout`](group-replication-system-variables.html#sysvar_group_replication_unreachable_majority_timeout) has no effect if it is set on the servers in the minority group after the loss of majority has been detected.

  By default, this system variable is set to 0, which means that members that find themselves in a minority due to a network partition wait forever to leave the group. If configured to a number of seconds, members wait for this amount of time after losing contact with the majority of members before leaving the group. When the specified time elapses, all pending transactions processed by the minority are rolled back, and the servers in the minority partition move to the `ERROR` state. These servers then follow the action specified by the system variable [`group_replication_exit_state_action`](group-replication-system-variables.html#sysvar_group_replication_exit_state_action), which can be to set themselves to super read only mode or shut down MySQL.

  Warning

  When you have a symmetric group, with just two members for example (S0,S2), if there is a network partition and there is no majority, after the configured timeout all members enter `ERROR` state.
