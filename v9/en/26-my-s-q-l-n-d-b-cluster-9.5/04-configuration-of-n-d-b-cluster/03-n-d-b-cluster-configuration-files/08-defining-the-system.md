#### 25.4.3.8 Defining the System

The `[system]` section is used for parameters applying to the cluster as a whole. The `Name` system parameter is used with MySQL Enterprise Monitor; `ConfigGenerationNumber` and `PrimaryMGMNode` are not used in production environments. Except when using NDB Cluster with MySQL Enterprise Monitor, is not necessary to have a `[system]` section in the `config.ini` file.

More information about these parameters can be found in the following list:

* `ConfigGenerationNumber`

  <table frame="box" rules="all" summary="ConfigGenerationNumber system configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 9.5.0) </p></td> </tr></tbody></table>

  Configuration generation number. This parameter is currently unused.

* `Name`

  <table frame="box" rules="all" summary="Name system configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 9.5.0) </p></td> </tr></tbody></table>

  Set a name for the cluster. This parameter is required for deployments with MySQL Enterprise Monitor; it is otherwise unused.

  You can obtain the value of this parameter by checking the `Ndb_system_name` status variable. In NDB API applications, you can also retrieve it using `get_system_name()`.

* `PrimaryMGMNode`

  <table frame="box" rules="all" summary="PrimaryMGMNode system configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 9.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="25.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 9.5.0) </p></td> </tr></tbody></table>

  Node ID of the primary management node. This parameter is currently unused.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 25.18 NDB Cluster restart types**

<table><col style="width: 10%"/><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Symbol</th> <th>Restart Type</th> <th>Description</th> </tr></thead><tbody><tr> <th>N</th> <td>Node</td> <td>The parameter can be updated using a rolling restart (see <a class="xref" href="mysql-cluster-rolling-restart.html" title="25.6.5 Performing a Rolling Restart of an NDB Cluster">Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”</a>)</td> </tr><tr> <th>S</th> <td>System</td> <td>All cluster nodes must be shut down completely, then restarted, to effect a change in this parameter</td> </tr><tr> <th>I</th> <td>Initial</td> <td>Data nodes must be restarted using the <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_initial"><code>--initial</code></a> option</td> </tr></tbody></table>
