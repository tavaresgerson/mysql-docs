#### 25.4.3.4 Defining Computers in an NDB Cluster

The `[computer]` section has no real significance other than serving as a way to avoid the need of defining host names for each node in the system. All parameters mentioned here are required.

* `Id`

  <table summary="Id computer configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  This is a unique identifier, used to refer to the host computer elsewhere in the configuration file.

  Important

  The computer ID is *not* the same as the node ID used for a management, API, or data node. Unlike the case with node IDs, you cannot use `NodeId` in place of `Id` in the `[computer]` section of the `config.ini` file.

* `HostName`

  <table summary="HostName computer configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  This is the computer's hostname or IP address.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 25.8 NDB Cluster restart types**

<table><thead><tr> <th scope="col">Symbol</th> <th scope="col">Restart Type</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th>N</th> <td>Node</td> <td>The parameter can be updated using a rolling restart (see Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”)</td> </tr><tr> <th>S</th> <td>System</td> <td>All cluster nodes must be shut down completely, then restarted, to effect a change in this parameter</td> </tr><tr> <th>I</th> <td>Initial</td> <td>Data nodes must be restarted using the <code>--initial</code> option</td> </tr></tbody></table>
