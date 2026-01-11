#### 7.5.6.3 Group Replication Resource Manager Component

The Group Replication Resource Manager component monitors secondary server lag time and memory usage, and can expel servers which lag excessively or use too many resources from the group. Allowable lag time and resource usage are configurable for both applier channels and recovery channels, as explained in this section. This component is available as part of MySQL Enterprise Edition.

* Purpose: Provide monitoring of and control over secondary server lag time and resource usage.

* URN: `file://component_group_replication_resource_manager`

Prior to installing the Group Replication Resource Manager component, the Group Replication plugin should be installed using `INSTALL PLUGIN` or `--plugin-load-add` (see Section 20.2.1.2, “Configuring an Instance for Group Replication”). It is possible to install the component without the Group Replication plugin being available, but in this case, the component is useful only for monitoring of memory usage and is not capable of taking any action.

The Group Replication Resource Manager component can be installed and uninstalled using `INSTALL COMPONENT` and `UNINSTALL COMPONENT`, respectively. See the descriptions of these statements, as well as Section 7.5.1, “Installing and Uninstalling Components”, for more information.

The Group Replication Resource Manager component provides a configurable automatic expulsion mechanism which detects when the applier or recovery channel on a group replication secondary is lagging, or when the secondary is swapping excessively, and expels the problematic server from the group, thus helping to maintain high availability. Due to the high availability requirement, *in order to use the auto-expulsion functionality with an active replication group, the group must initially consist of no fewer than three members, including the group replication primary*; this guarantees that there are at least two members (one primary and one secondary) in the event that one member has been expelled.

Note

The Group Replication Resource Manager component does not monitor the group replication primary, and is not intended to expel the primary, but it is possible for the decision to expel a secondary to be made just before the same secondary is promoted to primary (due to a concurrent primary failure), in which case the just-elected primary may be evicted.

Using the system and status variables provided by this component, the operator can separately monitor each of the three areas of concern—applier lag, recovery lag, and system resource exhaustion—and separate thresholds for expulsion set for each of them, as listed here:

* *Applier channel*: Obtain the time by which this server's applier channel lags behind that of the primary from the `Gr_resource_manager_applier_channel_lag` server status variable. You can set an upper limit for this by setting the `group_replication_resource_manager.applier_channel_lag` server system variable; if the lag exceeds this value 10 times or more in succession, this server is expelled from the group. The default threshold is 3600 seconds (1 hour).

* *Recovery channel*: The time by which this server's recovery channel lags behind that of the primary can be obtained by checking the value of the `Gr_resource_manager_recovery_channel_lag` server status variable. You can set an upper limit for this by setting `group_replication_resource_manager.recovery_channel_lag`; if the secondary's recovery lag is more than this, 10 times in succession, this server is expelled from the group. The default threshold is 3600 seconds (1 hour).

* *Resource (Memory) Usage*: The `group_replication_resource_manager.memory_used_limit` server system variable sets the threshold for memory consumption as a percentage of total memory; when `Gr_resource_manager_memory_used` exceeds this percentage 10 times in succession, this server is expelled.

The Resource Manager component checks lag and usage on group replication secondaries every 5 seconds. This period is not configurable by the operator.

A server which has been expelled from the group may subsequently try to rejoin it without manual intervention, provided that `group_replication_autorejoin_tries` is enabled (otherwise the server proceeds as specified by `group_replication_exit_state_action`). The auto-rejoin mechanism and behavior are the same as those described in Section 20.7.7.3, “Auto-Rejoin”.

For a replication group member attempting to join or rejoin a group after encountering issues and being expelled, a quarantine period prevents immediate re-expulsion. This period is tracked individually for each member, so that, during the quarantine period started after group member A has been expelled and subsequently allowed to re-join the group, member B can be expelled safely if the need arises. The duration of the quarantine period determined by the value of the `group_replication_resource_manager.quarantine_time` server system variable. The default length of the quarantine period is 3600 seconds (1 hour).

The Resource Management component provides a number of server status variables which can be used for monitoring the status of Group Replication and the Resource Manager component. In addition to the three such variables discussed previously, these include the following:

* `Gr_resource_manager_applier_channel_threshold_hits`: The number of samples which have exceeded `group_replication_resource_manager.applier_channel_lag`.

* `Gr_resource_manager_applier_channel_eviction_timestamp`: When the last eviction caused by applier channel lag occurred.

* `Gr_resource_manager_recovery_channel_threshold_hits`: The number of samples which have exceeded `group_replication_resource_manager.recovery_channel_lag`.

* `Gr_resource_manager_recovery_channel_eviction_timestamp`: When the last eviction caused by recovery channel lag occurred.

* `Gr_resource_manager_memory_threshold_hits`: The number of samples which have exceeded `group_replication_resource_manager.memory_used_limit`.

* `Gr_resource_manager_memory_eviction_timestamp`: When the last eviction caused by excess memory usage took place.

In addition, it is possible to determine if and when errors have occurred when attempting to get lag or memory usage information by checking the status variables listed here:

* `Gr_resource_manager_channel_lag_monitoring_error_timestamp`: Timestamp for the last time this member encountered an error while trying to obtain a value for channel lag.

* `Gr_resource_manager_memory_monitoring_error_timestamp`: The last time this member encountered an error while trying to obtain a value for the system memory usage.

For general information about MySQL Group Replication, see Chapter 20, *Group Replication*.
