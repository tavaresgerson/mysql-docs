#### 21.4.3.4 Defining Computers in an NDB Cluster

The `[computer]` section has no real significance other than serving as a way to avoid the need of defining host names for each node in the system. All parameters mentioned here are required.

* `Id`

  <table frame="box" rules="all" summary="Id computer configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a <a class="link" href="mysql-cluster-backup.html" title="21.6.8 Online Backup of NDB Cluster">backup</a>, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This is a unique identifier, used to refer to the host computer elsewhere in the configuration file.

  Important

  The computer ID is *not* the same as the node ID used for a management, API, or data node. Unlike the case with node IDs, you cannot use `NodeId` in place of `Id` in the `[computer]` section of the `config.ini` file.

* `HostName`

  <table frame="box" rules="all" summary="HostName computer configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This is the computer's hostname or IP address.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 21.7 NDB Cluster restart types**

<table><col style="width: 10%"/><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Symbol</th> <th>Restart Type</th> <th>Description</th> </tr></thead><tbody><tr> <th>N</th> <td>Node</td> <td>The parameter can be updated using a rolling restart (see <a class="xref" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”</a>)</td> </tr><tr> <th>S</th> <td>System</td> <td>All cluster nodes must be shut down completely, then restarted, to effect a change in this parameter</td> </tr><tr> <th>I</th> <td>Initial</td> <td>Data nodes must be restarted using the <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code>--initial</code></a> option</td> </tr></tbody></table>
