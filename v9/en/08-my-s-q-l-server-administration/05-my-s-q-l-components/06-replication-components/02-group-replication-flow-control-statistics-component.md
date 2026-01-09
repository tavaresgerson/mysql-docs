#### 7.5.6.2 Group Replication Flow Control Statistics Component

The Group Replication Flow Control Statistics component (`component_group_replication_flow_control_stats`) enables a number of global status variables which provide information on Group Replication flow control execution. This component is available in MySQL 9.5 and later as part of MySQL Enterprise Edition.

* Purpose: Support Group Replication global variables in addition to those normally present for measuring statistics relating to flow control execution.

* URN: `file://component_group_replication_flow_control_stats`

Prior to installing the Group Replication Flow Control Statistics component, the Group Replication plugin must be installed using `INSTALL PLUGIN` or `--plugin-load-add` (see Section 20.2.1.2, “Configuring an Instance for Group Replication”); otherwise, the `INSTALL COMPONENT` statement is rejected with the error Cannot satisfy dependency for service 'group_replication_flow_control_metrics_service' required by component 'mysql:group_replication_flow_control_stats'. If you attempt to uninstall the Group Replication plugin when the Group Replication Flow Control Statistics component is installed, `UNINSTALL PLUGIN` fails with the error Plugin 'group_replication' cannot be uninstalled now. Please uninstall the component 'component_group_replication_flow_control_stats' and then UNINSTALL PLUGIN group_replication.

Provided that these conditions are met, The Group Replication Flow Control Statistics component can be installed and uninstalled using `INSTALL COMPONENT` and `UNINSTALL COMPONENT`, respectively. See the descriptions of these statements, as well as Section 7.5.1, “Installing and Uninstalling Components”, for more information.

The Group Replication Flow Control Statistics component provides the global status variables listed here with their meanings:

* `Gr_flow_control_throttle_active_count`: The number of transactions currently being throttled.

* `Gr_flow_control_throttle_count`: The number of transactions which have been throttled.

* `Gr_flow_control_throttle_last_throttle_timestamp`: The most recent date and time that a transaction was throttled.

* `Gr_flow_control_throttle_time_sum`: Time in microseconds that transactions have been throttled.

The values of these variables can be obtained by querying the Performance Schema `global_status` table, as shown here:

```
mysql> SELECT * FROM performance_schema.global_status
    -> WHERE VARIABLE_NAME LIKE 'Gr_flow_control%';
+--------------------------------------------------+---------------------+
| VARIABLE_NAME	                                  | VARIABLE_VALUE      |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_active_count	          | 10                  |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_count	                 | 10                  |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_last_throttle_timestamp | 2024-07-01 12:50:56 |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_time_sum	              | 10                  |
+--------------------------------------------------+---------------------+
```

You can also observe these values in the output of `SHOW GLOBAL STATUS`, like this:

```
mysql> SHOW GLOBAL STATUS LIKE 'Gr_flow_control%';
+--------------------------------------------------+---------------------+
| Variable_Name	                                  | Value               |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_active_count	          | 10                  |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_count	                 | 10                  |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_last_throttle_timestamp | 2024-07-01 12:50:56 |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_time_sum	              | 10                  |
+--------------------------------------------------+---------------------+
```

All of the status variables listed previously are reset whenever any of the following events occurs:

* The server is restarted.
* The group is bootstrapped.
* A new member joins, or a member automatically rejoins.

Since they reflect what what the local member observes, all of these status variables have member scope.
