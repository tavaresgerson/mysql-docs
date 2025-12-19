--- title: MySQL 8.4 Reference Manual :: 14.18.1 Group Replication Functions url: https://dev.mysql.com/doc/refman/8.4/en/group-replication-functions.html order: 66 ---



### 14.18.1 Group Replication Functions

 14.18.1.1 Function which Configures Group Replication Primary

 14.18.1.2 Functions which Configure the Group Replication Mode

 14.18.1.3 Functions to Inspect and Configure the Maximum Consensus Instances of a Group

 14.18.1.4 Functions to Inspect and Set the Group Replication Communication Protocol Version

 14.18.1.5 Functions to Set and Reset Group Replication Member Actions

The functions described in the following sections are used with Group Replication.

**Table 14.25 Group Replication Functions**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>group_replication_disable_member_action()</code></td> <td> Disable member action for event specified </td> </tr><tr><td><code>group_replication_enable_member_action()</code></td> <td> Enable member action for event specified </td> </tr><tr><td><code>group_replication_get_communication_protocol()</code></td> <td> Get version of group replication communication protocol currently in use </td> </tr><tr><td><code>group_replication_get_write_concurrency()</code></td> <td> Get maximum number of consensus instances currently set for group </td> </tr><tr><td><code>group_replication_reset_member_actions()</code></td> <td> Reset all member actions to defaults and configuration version number to 1 </td> </tr><tr><td><code>group_replication_set_as_primary()</code></td> <td> Make a specific group member the primary </td> </tr><tr><td><code>group_replication_set_communication_protocol()</code></td> <td> Set version for group replication communication protocol to use </td> </tr><tr><td><code>group_replication_set_write_concurrency()</code></td> <td> Set maximum number of consensus instances that can be executed in parallel </td> </tr><tr><td><code>group_replication_switch_to_multi_primary_mode()</code></td> <td> Changes the mode of a group running in single-primary mode to multi-primary mode </td> </tr><tr><td><code>group_replication_switch_to_single_primary_mode()</code></td> <td> Changes the mode of a group running in multi-primary mode to single-primary mode </td> </tr></tbody></table>

