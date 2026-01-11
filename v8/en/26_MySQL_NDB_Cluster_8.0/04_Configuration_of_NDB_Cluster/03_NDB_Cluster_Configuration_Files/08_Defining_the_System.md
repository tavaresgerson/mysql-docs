#### 25.4.3.8 Defining the System

The `[system]` section is used for parameters applying to the cluster as a whole. The `Name` system parameter is used with MySQL Enterprise Monitor; `ConfigGenerationNumber` and `PrimaryMGMNode` are not used in production environments. Except when using NDB Cluster with MySQL Enterprise Monitor, is not necessary to have a `[system]` section in the `config.ini` file.

More information about these parameters can be found in the following list:

* `ConfigGenerationNumber`

  <table summary="ConfigGenerationNumber system configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  Configuration generation number. This parameter is currently unused.

* `Name`

  <table summary="Name system configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  Set a name for the cluster. This parameter is required for deployments with MySQL Enterprise Monitor; it is otherwise unused.

  You can obtain the value of this parameter by checking the `Ndb_system_name` status variable. In NDB API applications, you can also retrieve it using `get_system_name()`.

* `PrimaryMGMNode`

  <table summary="PrimaryMGMNode system configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  Node ID of the primary management node. This parameter is currently unused.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 25.19 NDB Cluster restart types**

<table><thead><tr> <th scope="col">Symbol</th> <th scope="col">Restart Type</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th>N</th> <td>Node</td> <td>The parameter can be updated using a rolling restart (see Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”)</td> </tr><tr> <th>S</th> <td>System</td> <td>All cluster nodes must be shut down completely, then restarted, to effect a change in this parameter</td> </tr><tr> <th>I</th> <td>Initial</td> <td>Data nodes must be restarted using the <code>--initial</code> option</td> </tr></tbody></table>
