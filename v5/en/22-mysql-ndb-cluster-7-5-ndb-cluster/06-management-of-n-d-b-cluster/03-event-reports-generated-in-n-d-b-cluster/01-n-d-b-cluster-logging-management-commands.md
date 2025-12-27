#### 21.6.3.1 NDB Cluster Logging Management Commands

[**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") supports a number of management commands related to the cluster log and node logs. In the listing that follows, *`node_id`* denotes either a storage node ID or the keyword `ALL`, which indicates that the command should be applied to all of the cluster's data nodes.

* `CLUSTERLOG ON`

  Turns the cluster log on.

* `CLUSTERLOG OFF`

  Turns the cluster log off.

* `CLUSTERLOG INFO`

  Provides information about cluster log settings.

* `node_id CLUSTERLOG category=threshold`

  Logs *`category`* events with priority less than or equal to *`threshold`* in the cluster log.

* `CLUSTERLOG TOGGLE severity_level`

  Toggles cluster logging of events of the specified *`severity_level`*.

The following table describes the default setting (for all data nodes) of the cluster log category threshold. If an event has a priority with a value lower than or equal to the priority threshold, it is reported in the cluster log.

Note

Events are reported per data node, and that the threshold can be set to different values on different nodes.

**Table 21.48 Cluster log categories, with default threshold setting**

<table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Category</th> <th>Default threshold (All data nodes)</th> </tr></thead><tbody><tr> <td><code class="literal">STARTUP</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">SHUTDOWN</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">STATISTICS</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">CHECKPOINT</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">NODERESTART</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">CONNECTION</code></td> <td><code class="literal">8</code></td> </tr><tr> <td><code class="literal">ERROR</code></td> <td><code class="literal">15</code></td> </tr><tr> <td><code class="literal">INFO</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">BACKUP</code></td> <td><code class="literal">15</code></td> </tr><tr> <td><code class="literal">CONGESTION</code></td> <td><code class="literal">7</code></td> </tr><tr> <td><code class="literal">SCHEMA</code></td> <td><code class="literal">7</code></td> </tr></tbody></table>

The `STATISTICS` category can provide a great deal of useful data. See [Section 21.6.3.3, “Using CLUSTERLOG STATISTICS in the NDB Cluster Management Client”](mysql-cluster-log-statistics.html "21.6.3.3 Using CLUSTERLOG STATISTICS in the NDB Cluster Management Client"), for more information.

Thresholds are used to filter events within each category. For example, a `STARTUP` event with a priority of 3 is not logged unless the threshold for `STARTUP` is set to 3 or higher. Only events with priority 3 or lower are sent if the threshold is 3.

The following table shows the event severity levels.

Note

These correspond to Unix `syslog` levels, except for `LOG_EMERG` and `LOG_NOTICE`, which are not used or mapped.

**Table 21.49 Event severity levels**

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th scope="col">Severity Level Value</th> <th scope="col">Severity</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row">1</th> <td><code class="literal">ALERT</code></td> <td>A condition that should be corrected immediately, such as a corrupted system database</td> </tr><tr> <th scope="row">2</th> <td><code class="literal">CRITICAL</code></td> <td>Critical conditions, such as device errors or insufficient resources</td> </tr><tr> <th scope="row">3</th> <td><code class="literal">ERROR</code></td> <td>Conditions that should be corrected, such as configuration errors</td> </tr><tr> <th scope="row">4</th> <td><code class="literal">WARNING</code></td> <td>Conditions that are not errors, but that might require special handling</td> </tr><tr> <th scope="row">5</th> <td><code class="literal">INFO</code></td> <td>Informational messages</td> </tr><tr> <th scope="row">6</th> <td><code class="literal">DEBUG</code></td> <td>Debugging messages used for <a class="link" href="mysql-cluster.html" title="Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"><code class="literal">NDBCLUSTER</code></a> development</td> </tr></tbody></table>

Event severity levels can be turned on or off using `CLUSTERLOG TOGGLE`. If a severity level is turned on, then all events with a priority less than or equal to the category thresholds are logged. If the severity level is turned off then no events belonging to that severity level are logged.

Important

Cluster log levels are set on a per [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), per subscriber basis. This means that, in an NDB Cluster with multiple management servers, using a `CLUSTERLOG` command in an instance of [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") connected to one management server affects only logs generated by that management server but not by any of the others. This also means that, should one of the management servers be restarted, only logs generated by that management server are affected by the resetting of log levels caused by the restart.
