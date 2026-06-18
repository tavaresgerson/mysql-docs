#### 21.6.2.1 NDB Cluster: Messages in the Cluster Log

The following table lists the most common
[`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") cluster log messages. For
information about the cluster log, log events, and event types,
see [Section 21.6.3, “Event Reports Generated in NDB Cluster”](mysql-cluster-event-reports.html "21.6.3 Event Reports Generated in NDB Cluster"). These log
messages also correspond to log event types in the MGM API; see
[The Ndb\_logevent\_type Type](/doc/ndbapi/en/mgm-types.html#mgm-ndb-logevent-type), for related information
of interest to Cluster API developers.

**Table 21.47 Common NDB cluster log messages**

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 25%"/><col style="width: 15%"/><col style="width: 10%"/><col style="width: 10%"/><thead><tr>
<th>Log Message</th>
<th>Description</th>
<th>Event Name</th>
<th>Event Type</th>
<th>Priority</th>
<th>Severity</th>
</tr></thead><tbody><tr>
<th><code>Node <code>mgm_node_id</code>: Node
              <code>data_node_id</code>
              Connected</code></th>
<td>The data node having node ID <code>node_id</code> has
              connected to the management server (node
              <code>mgm_node_id</code>).</td>
<td><code>Connected</code></td>
<td><code>Connection</code></td>
<td>8</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>mgm_node_id</code>: Node
              <code>data_node_id</code>
              Disconnected</code></th>
<td>The data node having node ID <code>data_node_id</code> has
              disconnected from the management server (node
              <code>mgm_node_id</code>).</td>
<td><code>Disconnected</code></td>
<td><code>Connection</code></td>
<td>8</td>
<td><code>ALERT</code></td>
</tr><tr>
<th><code>Node <code>data_node_id</code>: Communication to
              Node <code>api_node_id</code>
              closed</code></th>
<td>The API node or SQL node having node ID
              <code>api_node_id</code> is no longer
              communicating with data node
              <code>data_node_id</code>.</td>
<td><code>CommunicationClosed</code></td>
<td><code>Connection</code></td>
<td>8</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>data_node_id</code>: Communication to
              Node <code>api_node_id</code>
              opened</code></th>
<td>The API node or SQL node having node ID
              <code>api_node_id</code> is now
              communicating with data node
              <code>data_node_id</code>.</td>
<td><code>CommunicationOpened</code></td>
<td><code>Connection</code></td>
<td>8</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>mgm_node_id</code>: Node
              <code>api_node_id</code>: API
              <code>version</code></code></th>
<td>The API node having node ID <code>api_node_id</code> has
              connected to management node
              <code>mgm_node_id</code> using
              <code>NDB</code> API version
              <code>version</code> (generally the same as
              the MySQL version number).</td>
<td><code>ConnectedApiVersion</code></td>
<td><code>Connection</code></td>
<td>8</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Global checkpoint
              <code>gci</code> started</code></th>
<td>A global checkpoint with the ID <code>gci</code> has been
              started; node <code>node_id</code> is the
              master responsible for this global checkpoint.</td>
<td><code>GlobalCheckpointStarted</code></td>
<td><code>Checkpoint</code></td>
<td>9</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Global checkpoint
              <code>gci</code> completed</code></th>
<td>The global checkpoint having the ID <code>gci</code> has
              been completed; node <code>node_id</code>
              was the master responsible for this global checkpoint.</td>
<td><code>GlobalCheckpointCompleted</code></td>
<td><code>Checkpoint</code></td>
<td>10</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Local checkpoint
              <code>lcp</code> started. Keep GCI =
              <code>current_gci</code> oldest restorable
              GCI = <code>old_gci</code></code></th>
<td>The local checkpoint having sequence ID <code>lcp</code>
              has been started on node
              <code>node_id</code>. The most recent GCI
              that can be used has the index
              <code>current_gci</code>, and the oldest GCI
              from which the cluster can be restored has the index
              <code>old_gci</code>.</td>
<td><code>LocalCheckpointStarted</code></td>
<td><code>Checkpoint</code></td>
<td>7</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Local checkpoint
              <code>lcp</code> completed</code></th>
<td>The local checkpoint having sequence ID <code>lcp</code>
              on node <code>node_id</code> has been
              completed.</td>
<td><code>LocalCheckpointCompleted</code></td>
<td><code>Checkpoint</code></td>
<td>8</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Local Checkpoint
              stopped in CALCULATED_KEEP_GCI</code></th>
<td>The node was unable to determine the most recent usable GCI.</td>
<td><code>LCPStoppedInCalcKeepGci</code></td>
<td><code>Checkpoint</code></td>
<td>0</td>
<td><code>ALERT</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Table ID =
              <code>table_id</code>, fragment
              <code>ID = fragment_id</code> has completed
              LCP on Node <code>node_id</code>
              maxGciStarted: <code>started_gci</code>
              maxGciCompleted:
              <code>completed_gci</code></code></th>
<td>A table fragment has been checkpointed to disk on node
              <code>node_id</code>. The GCI in progress
              has the index <code>started_gci</code>, and
              the most recent GCI to have been completed has the index
              <code>completed_gci</code>.</td>
<td><code>LCPFragmentCompleted</code></td>
<td><code>Checkpoint</code></td>
<td>11</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: ACC Blocked
              <code>num_1</code> and TUP Blocked
              <code>num_2</code> times last
              second</code></th>
<td>Undo logging is blocked because the log buffer is close to overflowing.</td>
<td><code>UndoLogBlocked</code></td>
<td><code>Checkpoint</code></td>
<td>7</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Start initiated
              <code>version</code></code></th>
<td>Data node <code>node_id</code>, running
              <code>NDB</code> version
              <code>version</code>, is beginning its
              startup process.</td>
<td><code>NDBStartStarted</code></td>
<td><code>StartUp</code></td>
<td>1</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Started
              <code>version</code></code></th>
<td>Data node <code>node_id</code>, running
              <code>NDB</code> version
              <code>version</code>, has started
              successfully.</td>
<td><code>NDBStartCompleted</code></td>
<td><code>StartUp</code></td>
<td>1</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: STTORRY received after
              restart finished</code></th>
<td>The node has received a signal indicating that a cluster restart has
              completed.</td>
<td><code>STTORRYRecieved</code></td>
<td><code>StartUp</code></td>
<td>15</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Start phase
              <code>phase</code> completed
              (<code>type</code>)</code></th>
<td>The node has completed start phase <code>phase</code> of a
              <code>type</code> start. For a listing of
              start phases, see
              Section 21.6.4, “Summary of NDB Cluster Start Phases”.
              (<code>type</code> is one of
              <code>initial</code>, <code>system</code>,
              <code>node</code>, <code>initial node</code>,
              or <code>&lt;Unknown&gt;</code>.)</td>
<td><code>StartPhaseCompleted</code></td>
<td><code>StartUp</code></td>
<td>4</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: CM_REGCONF president =
              <code>president_id</code>, own Node =
              <code>own_id</code>, our dynamic id =
              <code>dynamic_id</code></code></th>
<td>Node <code>president_id</code> has been selected as
              “president”.
              <code>own_id</code> and
              <code>dynamic_id</code> should always be the
              same as the ID (<code>node_id</code>) of the
              reporting node.</td>
<td><code>CM_REGCONF</code></td>
<td><code>StartUp</code></td>
<td>3</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: CM_REGREF from Node
              <code>president_id</code> to our Node
              <code>node_id</code>. Cause =
              <code>cause</code></code></th>
<td>The reporting node (ID <code>node_id</code>) was unable to
              accept node <code>president_id</code> as
              president. The <code>cause</code> of the
              problem is given as one of <code>Busy</code>,
              <code>Election with wait = false</code>,
              <code>Not president</code>, <code>Election
              without selecting new candidate</code>, or <code>No
              such cause</code>.</td>
<td><code>CM_REGREF</code></td>
<td><code>StartUp</code></td>
<td>8</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: We are Node
              <code>own_id</code> with dynamic ID
              <code>dynamic_id</code>, our left neighbor
              is Node <code>id_1</code>, our right is Node
              <code>id_2</code></code></th>
<td>The node has discovered its neighboring nodes in the cluster (node
              <code>id_1</code> and node
              <code>id_2</code>).
              <code>node_id</code>,
              <code>own_id</code>, and
              <code>dynamic_id</code> should always be the
              same; if they are not, this indicates a serious
              misconfiguration of the cluster nodes.</td>
<td><code>FIND_NEIGHBOURS</code></td>
<td><code>StartUp</code></td>
<td>8</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>:
              <code>type</code> shutdown
              initiated</code></th>
<td>The node has received a shutdown signal. The
              <code>type</code> of shutdown is either
              <code>Cluster</code> or <code>Node</code>.</td>
<td><code>NDBStopStarted</code></td>
<td><code>StartUp</code></td>
<td>1</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Node shutdown
              completed </code>[<code>,
              <code>action</code></code>]
              [<code>Initiated by signal
              <code>signal</code>.</code>]</th>
<td>The node has been shut down. This report may include an
              <code>action</code>, which if present is one
              of <code>restarting</code>, <code>no
              start</code>, or <code>initial</code>. The report
              may also include a reference to an
              <code>NDB</code> Protocol
              <code>signal</code>; for possible signals,
              refer to
              Operations and Signals.</td>
<td><code>NDBStopCompleted</code></td>
<td><code>StartUp</code></td>
<td>1</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Forced node shutdown
              completed </code>[<code>,
              action</code>]<code>.</code> [<code>Occurred
              during startphase
              <code>start_phase</code>.</code>]
              [<code> Initiated by
              <code>signal</code>.</code>]
              [<code>Caused by error
              <code>error_code</code>:
              '<code>error_message</code>(<code>error_classification</code>).
              <code>error_status</code>'.</code>
              [<code>(extra info
              <code>extra_code</code>)</code>]]</th>
<td>The node has been forcibly shut down. The
              <code>action</code> (one of
              <code>restarting</code>, <code>no
              start</code>, or <code>initial</code>)
              subsequently being taken, if any, is also reported. If the
              shutdown occurred while the node was starting, the report
              includes the <code>start_phase</code> during
              which the node failed. If this was a result of a
              <code>signal</code> sent to the node, this
              information is also provided (see
              Operations and Signals,
              for more information). If the error causing the failure is
              known, this is also included; for more information about
              <code>NDB</code> error messages and
              classifications, see NDB Cluster API Errors.</td>
<td><code>NDBStopForced</code></td>
<td><code>StartUp</code></td>
<td>1</td>
<td><code>ALERT</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Node shutdown
              aborted</code></th>
<td>The node shutdown process was aborted by the user.</td>
<td><code>NDBStopAborted</code></td>
<td><code>StartUp</code></td>
<td>1</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: StartLog: [GCI Keep:
              <code>keep_pos</code> LastCompleted:
              <code>last_pos</code> NewestRestorable:
              <code>restore_pos</code>]</code></th>
<td>This reports global checkpoints referenced during a node start. The redo
              log prior to <code>keep_pos</code> is
              dropped. <code>last_pos</code> is the last
              global checkpoint in which data node the participated;
              <code>restore_pos</code> is the global
              checkpoint which is actually used to restore all data
              nodes.</td>
<td><code>StartREDOLog</code></td>
<td><code>StartUp</code></td>
<td>4</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>startup_message</code> [<span class="emphasis"><em>Listed separately;
              see below.</em></span>]</th>
<td>There are a number of possible startup messages that can be logged under
              different circumstances. These are listed separately; see
              Section 21.6.2.2, “NDB Cluster Log Startup Messages”.</td>
<td><code>StartReport</code></td>
<td><code>StartUp</code></td>
<td>4</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Node restart completed
              copy of dictionary information</code></th>
<td>Copying of data dictionary information to the restarted node has been
              completed.</td>
<td><code>NR_CopyDict</code></td>
<td><code>NodeRestart</code></td>
<td>8</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Node restart completed
              copy of distribution information</code></th>
<td>Copying of data distribution information to the restarted node has been
              completed.</td>
<td><code>NR_CopyDistr</code></td>
<td><code>NodeRestart</code></td>
<td>8</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Node restart starting
              to copy the fragments to Node
              <code>node_id</code></code></th>
<td>Copy of fragments to starting data node
              <code>node_id</code> has begun</td>
<td><code>NR_CopyFragsStarted</code></td>
<td><code>NodeRestart</code></td>
<td>8</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Table ID =
              <code>table_id</code>, fragment ID =
              <code>fragment_id</code> have been copied to
              Node <code>node_id</code></code></th>
<td>Fragment <code>fragment_id</code> from table
              <code>table_id</code> has been copied to
              data node <code>node_id</code></td>
<td><code>NR_CopyFragDone</code></td>
<td><code>NodeRestart</code></td>
<td>10</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Node restart completed
              copying the fragments to Node
              <code>node_id</code></code></th>
<td>Copying of all table fragments to restarting data node
              <code>node_id</code> has been completed</td>
<td><code>NR_CopyFragsCompleted</code></td>
<td><code>NodeRestart</code></td>
<td>8</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Node
              <code>node1_id</code> completed failure of
              Node <code>node2_id</code></code></th>
<td>Data node <code>node1_id</code> has detected the failure
              of data node <code>node2_id</code></td>
<td><code>NodeFailCompleted</code></td>
<td><code>NodeRestart</code></td>
<td>8</td>
<td><code>ALERT</code></td>
</tr><tr>
<th><code>All nodes completed failure of Node
              <code>node_id</code></code></th>
<td>All (remaining) data nodes have detected the failure of data node
              <code>node_id</code></td>
<td><code>NodeFailCompleted</code></td>
<td><code>NodeRestart</code></td>
<td>8</td>
<td><code>ALERT</code></td>
</tr><tr>
<th><code>Node failure of
              <code>node_id</code><code>block</code>
              completed</code></th>
<td>The failure of data node <code>node_id</code> has been
              detected in the
              <code>block</code><code>NDB</code>
              kernel block, where block is 1 of
              <code>DBTC</code>,
              <code>DBDICT</code>,
              <code>DBDIH</code>, or
              <code>DBLQH</code>; for more
              information, see
              NDB Kernel Blocks</td>
<td><code>NodeFailCompleted</code></td>
<td><code>NodeRestart</code></td>
<td>8</td>
<td><code>ALERT</code></td>
</tr><tr>
<th><code>Node <code>mgm_node_id</code>: Node
              <code>data_node_id</code> has failed. The
              Node state at failure was
              <code>state_code</code></code></th>
<td>A data node has failed. Its state at the time of failure is described by
              an arbitration state code
              <code>state_code</code>: possible state code
              values can be found in the file
              <code>include/kernel/signaldata/ArbitSignalData.hpp</code>.</td>
<td><code>NODE_FAILREP</code></td>
<td><code>NodeRestart</code></td>
<td>8</td>
<td><code>ALERT</code></td>
</tr><tr>
<th><code>President restarts arbitration thread
              [state=<code>state_code</code>]</code> or
              <code>Prepare arbitrator node
              <code>node_id</code>
              [ticket=<code>ticket_id</code>]</code> or
              <code>Receive arbitrator node
              <code>node_id</code>
              [ticket=<code>ticket_id</code>]</code> or
              <code>Started arbitrator node
              <code>node_id</code>
              [ticket=<code>ticket_id</code>]</code> or
              <code>Lost arbitrator node
              <code>node_id</code> - process failure
              [state=<code>state_code</code>]</code> or
              <code>Lost arbitrator node
              <code>node_id</code> - process exit
              [state=<code>state_code</code>]</code> or
              <code>Lost arbitrator node
              <code>node_id</code> -
              <code>error_message</code>
              [state=<code>state_code</code>]</code></th>
<td>This is a report on the current state and progress of arbitration in the
              cluster. <code>node_id</code> is the node ID
              of the management node or SQL node selected as the
              arbitrator. <code>state_code</code> is an
              arbitration state code, as found in
              <code>include/kernel/signaldata/ArbitSignalData.hpp</code>.
              When an error has occurred, an
              <code>error_message</code>, also defined in
              <code>ArbitSignalData.hpp</code>, is provided.
              <code>ticket_id</code> is a unique
              identifier handed out by the arbitrator when it is
              selected to all the nodes that participated in its
              selection; this is used to ensure that each node
              requesting arbitration was one of the nodes that took part
              in the selection process.</td>
<td><code>ArbitState</code></td>
<td><code>NodeRestart</code></td>
<td>6</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Arbitration check lost - less than 1/2 nodes left</code> or
              <code>Arbitration check won - all node groups and more
              than 1/2 nodes left</code> or <code>Arbitration
              check won - node group majority</code> or
              <code>Arbitration check lost - missing node
              group</code> or <code>Network partitioning -
              arbitration required</code> or <code>Arbitration won
              - positive reply from node
              <code>node_id</code></code> or
              <code>Arbitration lost - negative reply from node
              <code>node_id</code></code> or
              <code>Network partitioning - no arbitrator
              available</code> or <code>Network partitioning - no
              arbitrator configured</code> or <code>Arbitration
              failure - <code>error_message</code>
              [state=<code>state_code</code>]</code></th>
<td>This message reports on the result of arbitration. In the event of
              arbitration failure, an
              <code>error_message</code> and an
              arbitration <code>state_code</code> are
              provided; definitions for both of these are found in
              <code>include/kernel/signaldata/ArbitSignalData.hpp</code>.</td>
<td><code>ArbitResult</code></td>
<td><code>NodeRestart</code></td>
<td>2</td>
<td><code>ALERT</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: GCP Take over
              started</code></th>
<td>This node is attempting to assume responsibility for the next global
              checkpoint (that is, it is becoming the master node)</td>
<td><code>GCP_TakeoverStarted</code></td>
<td><code>NodeRestart</code></td>
<td>7</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: GCP Take over
              completed</code></th>
<td>This node has become the master, and has assumed responsibility for the
              next global checkpoint</td>
<td><code>GCP_TakeoverCompleted</code></td>
<td><code>NodeRestart</code></td>
<td>7</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: LCP Take over
              started</code></th>
<td>This node is attempting to assume responsibility for the next set of
              local checkpoints (that is, it is becoming the master
              node)</td>
<td><code>LCP_TakeoverStarted</code></td>
<td><code>NodeRestart</code></td>
<td>7</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: LCP Take over
              completed</code></th>
<td>This node has become the master, and has assumed responsibility for the
              next set of local checkpoints</td>
<td><code>LCP_TakeoverCompleted</code></td>
<td><code>NodeRestart</code></td>
<td>7</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Trans. Count =
              <code>transactions</code>, Commit Count =
              <code>commits</code>, Read Count =
              <code>reads</code>, Simple Read Count =
              <code>simple_reads</code>, Write Count =
              <code>writes</code>, AttrInfo Count =
              <code>AttrInfo_objects</code>, Concurrent
              Operations =
              <code>concurrent_operations</code>, Abort
              Count = <code>aborts</code>, Scans =
              <code>scans</code>, Range scans =
              <code>range_scans</code></code></th>
<td>This report of transaction activity is given approximately once every 10
              seconds</td>
<td><code>TransReportCounters</code></td>
<td><code>Statistic</code></td>
<td>8</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>:
              Operations=<code>operations</code></code></th>
<td>Number of operations performed by this node, provided approximately once
              every 10 seconds</td>
<td><code>OperationReportCounters</code></td>
<td><code>Statistic</code></td>
<td>8</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Table with ID =
              <code>table_id</code> created</code></th>
<td>A table having the table ID shown has been created</td>
<td><code>TableCreated</code></td>
<td><code>Statistic</code></td>
<td>7</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Mean loop Counter in
              doJob last 8192 times =
              <code>count</code></code></th>
<td></td>
<td><code>JobStatistic</code></td>
<td><code>Statistic</code></td>
<td>9</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Mean send size to Node = <code>node_id</code>
              last 4096 sends = <code>bytes</code>
              bytes</code></th>
<td>This node is sending an average of <code>bytes</code>
              bytes per send to node <code>node_id</code></td>
<td><code>SendBytesStatistic</code></td>
<td><code>Statistic</code></td>
<td>9</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Mean receive size to Node = <code>node_id</code>
              last 4096 sends = <code>bytes</code>
              bytes</code></th>
<td>This node is receiving an average of <code>bytes</code> of
              data each time it receives data from node
              <code>node_id</code></td>
<td><code>ReceiveBytesStatistic</code></td>
<td><code>Statistic</code></td>
<td>9</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Data usage is
              <code>data_memory_percentage</code>%
              (<code>data_pages_used</code> 32K pages of
              total
              <code>data_pages_total</code>)</code> /
              <code>Node <code>node_id</code>: Index
              usage is
              <code>index_memory_percentage</code>%
              (<code>index_pages_used</code> 8K pages of
              total <code>index_pages_total</code>)
              </code></th>
<td>This report is generated when a <a class="ulink" href="/doc/ndb-internals/en/dump-command-1000.html" target="_top"><code>DUMP
              1000</code></a> command is issued in the cluster management
              client</td>
<td><code>MemoryUsage</code></td>
<td><code>Statistic</code></td>
<td>5</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node1_id</code>: Transporter to node
              <code>node2_id</code> reported error
              <code>error_code</code>:
              <code>error_message</code></code></th>
<td>A transporter error occurred while communicating with node
              <code>node2_id</code>; for a listing of
              transporter error codes and messages, see
              NDB Transporter Errors, in
              MySQL NDB Cluster Internals Manual</td>
<td><code>TransporterError</code></td>
<td><code>Error</code></td>
<td>2</td>
<td><code>ERROR</code></td>
</tr><tr>
<th><code>Node <code>node1_id</code>: Transporter to node
              <code>node2_id</code> reported error
              <code>error_code</code>:
              <code>error_message</code></code></th>
<td>A warning of a potential transporter problem while communicating with
              node <code>node2_id</code>; for a listing of
              transporter error codes and messages, see
              NDB Transporter Errors, for more
              information</td>
<td><code>TransporterWarning</code></td>
<td><code>Error</code></td>
<td>8</td>
<td><code>WARNING</code></td>
</tr><tr>
<th><code>Node <code>node1_id</code>: Node
              <code>node2_id</code> missed heartbeat
              <code>heartbeat_id</code></code></th>
<td>This node missed a heartbeat from node
              <code>node2_id</code></td>
<td><code>MissedHeartbeat</code></td>
<td><code>Error</code></td>
<td>8</td>
<td><code>WARNING</code></td>
</tr><tr>
<th><code>Node <code>node1_id</code>: Node
              <code>node2_id</code> declared dead due to
              missed heartbeat</code></th>
<td>This node has missed at least 3 heartbeats from node
              <code>node2_id</code>, and so has declared
              that node “dead”</td>
<td><code>DeadDueToHeartbeat</code></td>
<td><code>Error</code></td>
<td>8</td>
<td><code>ALERT</code></td>
</tr><tr>
<th><code>Node <code>node1_id</code>: Node Sent Heartbeat
              to node = <code>node2_id</code></code></th>
<td>This node has sent a heartbeat to node
              <code>node2_id</code></td>
<td><code>SentHeartbeat</code></td>
<td><code>Info</code></td>
<td>12</td>
<td><code>INFO</code></td>
</tr><tr>
<th>(<em>NDB 7.5.0 and earlier</em>:) <code>Node
              <code>node_id</code>: Event buffer status:
              used=<code>bytes_used</code>
              (<code>percent_used</code>%)
              alloc=<code>bytes_allocated</code>
              (<code>percent_available</code>%)
              max=<code>bytes_available</code>
              apply_epoch=<code>latest_restorable_epoch</code>
              latest_epoch=<code>latest_epoch</code></code></th>
<td>This report is seen during heavy event buffer usage, for example, when
              many updates are being applied in a relatively short
              period of time; the report shows the number of bytes and
              the percentage of event buffer memory used, the bytes
              allocated and percentage still available, and the latest
              and latest restorable epochs</td>
<td><code>EventBufferStatus</code></td>
<td><code>Info</code></td>
<td>7</td>
<td><code>INFO</code></td>
</tr><tr>
<th>(<em>NDB 7.5.1 and later</em>:) <code>Node
              <code>node_id</code>: Event buffer status
              (<code>object_id</code>):
              used=<code>bytes_used</code>
              (<code>percent_used</code>% of alloc)
              alloc=<code>bytes_allocated</code>
              max=<code>bytes_available</code>
              latest_consumed_epoch=<code>latest_consumed_epoch</code>
              latest_buffered_epoch=<code>latest_buffered_epoch</code>
              report_reason=<code>report_reason</code></code></th>
<td>This report is seen during heavy event buffer usage, for example, when
              many updates are being applied in a relatively short
              period of time; the report shows the number of bytes and
              the percentage of event buffer memory used, the bytes
              allocated and percentage still available, and the latest
              buffered and consumed epochs; for more information, see
              Section 21.6.2.3, “Event Buffer Reporting in the Cluster Log”</td>
<td><code>EventBufferStatus2</code></td>
<td><code>Info</code></td>
<td>7</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Entering single user
              mode</code>, <code>Node
              <code>node_id</code>: Entered single user
              mode Node <code>API_node_id</code> has
              exclusive access</code>, <code>Node
              <code>node_id</code>: Entering single user
              mode</code></th>
<td>These reports are written to the cluster log when entering and exiting
              single user mode; <code>API_node_id</code>
              is the node ID of the API or SQL having exclusive access
              to the cluster (for more information, see
              Section 21.6.6, “NDB Cluster Single User Mode”); the
              message <code>Unknown single user report
              <code>API_node_id</code></code> indicates
              an error has taken place and should never be seen in
              normal operation</td>
<td><code>SingleUser</code></td>
<td><code>Info</code></td>
<td>7</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Backup
              <code>backup_id</code> started from node
              <code>mgm_node_id</code></code></th>
<td>A backup has been started using the management node having
              <code>mgm_node_id</code>; this message is
              also displayed in the cluster management client when the
              <code>START BACKUP</code> command
              is issued; for more information, see
              Section 21.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”</td>
<td><code>BackupStarted</code></td>
<td><code>Backup</code></td>
<td>7</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Backup
              <code>backup_id</code> started from node
              <code>mgm_node_id</code> completed.
              StartGCP: <code>start_gcp</code> StopGCP:
              <code>stop_gcp</code> #Records:
              <code>records</code> #LogRecords:
              <code>log_records</code> Data:
              <code>data_bytes</code> bytes Log:
              <code>log_bytes</code> bytes</code></th>
<td>The backup having the ID <code>backup_id</code> has been
              completed; for more information, see
              Section 21.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”</td>
<td><code>BackupCompleted</code></td>
<td><code>Backup</code></td>
<td>7</td>
<td><code>INFO</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Backup request from
              <code>mgm_node_id</code> failed to start.
              Error: <code>error_code</code></code></th>
<td>The backup failed to start; for error codes, see
              MGM API Errors</td>
<td><code>BackupFailedToStart</code></td>
<td><code>Backup</code></td>
<td>7</td>
<td><code>ALERT</code></td>
</tr><tr>
<th><code>Node <code>node_id</code>: Backup
              <code>backup_id</code> started from
              <code>mgm_node_id</code> has been aborted.
              Error: <code>error_code</code></code></th>
<td>The backup was terminated after starting, possibly due to user
              intervention</td>
<td><code>BackupAborted</code></td>
<td><code>Backup</code></td>
<td>7</td>
<td><code>ALERT</code></td>
</tr></tbody></table>