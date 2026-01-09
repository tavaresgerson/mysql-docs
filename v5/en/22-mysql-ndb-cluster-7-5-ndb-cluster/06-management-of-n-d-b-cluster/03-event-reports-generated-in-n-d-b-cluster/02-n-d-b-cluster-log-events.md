#### 21.6.3.2 NDB Cluster Log Events

An event report reported in the event logs has the following format:

```sql
datetime [string] severity -- message
```

For example:

```sql
09:19:30 2005-07-24 [NDB] INFO -- Node 4 Start phase 4 completed
```

This section discusses all reportable events, ordered by category and severity level within each category.

In the event descriptions, GCP and LCP mean “Global Checkpoint” and “Local Checkpoint”, respectively.

##### CONNECTION Events

These events are associated with connections between Cluster nodes.

**Table 21.50 Events associated with connections between cluster nodes**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Event</th> <th>Priority</th> <th>Severity Level</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>Connected</code></th> <td>8</td> <td><code>INFO</code></td> <td>Data nodes connected</td> </tr><tr> <th><code>Disconnected</code></th> <td>8</td> <td><code>ALERT</code></td> <td>Data nodes disconnected</td> </tr><tr> <th><code>CommunicationClosed</code></th> <td>8</td> <td><code>INFO</code></td> <td>SQL node or data node connection closed</td> </tr><tr> <th><code>CommunicationOpened</code></th> <td>8</td> <td><code>INFO</code></td> <td>SQL node or data node connection open</td> </tr><tr> <th><code>ConnectedApiVersion</code></th> <td>8</td> <td><code>INFO</code></td> <td>Connection using API version</td> </tr></tbody></table>

##### CHECKPOINT Events

The logging messages shown here are associated with checkpoints.

**Table 21.51 Events associated with checkpoints**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Event</th> <th>Priority</th> <th>Severity Level</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>GlobalCheckpointStarted</code></th> <td>9</td> <td><code>INFO</code></td> <td>Start of GCP: REDO log is written to disk</td> </tr><tr> <th><code>GlobalCheckpointCompleted</code></th> <td>10</td> <td><code>INFO</code></td> <td>GCP finished</td> </tr><tr> <th><code>LocalCheckpointStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Start of LCP: data written to disk</td> </tr><tr> <th><code>LocalCheckpointCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>LCP completed normally</td> </tr><tr> <th><code>LCPStoppedInCalcKeepGci</code></th> <td>0</td> <td><code>ALERT</code></td> <td>LCP stopped</td> </tr><tr> <th><code>LCPFragmentCompleted</code></th> <td>11</td> <td><code>INFO</code></td> <td>LCP on a fragment has been completed</td> </tr><tr> <th><code>UndoLogBlocked</code></th> <td>7</td> <td><code>INFO</code></td> <td>UNDO logging blocked; buffer near overflow</td> </tr><tr> <th><code>RedoStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Redo status</td> </tr></tbody></table>

##### STARTUP Events

The following events are generated in response to the startup of a node or of the cluster and of its success or failure. They also provide information relating to the progress of the startup process, including information concerning logging activities.

**Table 21.52 Events relating to the startup of a node or cluster**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Event</th> <th>Priority</th> <th>Severity Level</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>NDBStartStarted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Data node start phases initiated (all nodes starting)</td> </tr><tr> <th><code>NDBStartCompleted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Start phases completed, all data nodes</td> </tr><tr> <th><code>STTORRYRecieved</code></th> <td>15</td> <td><code>INFO</code></td> <td>Blocks received after completion of restart</td> </tr><tr> <th><code>StartPhaseCompleted</code></th> <td>4</td> <td><code>INFO</code></td> <td>Data node start phase <em class="replaceable"><code>X</code></em> completed</td> </tr><tr> <th><code>CM_REGCONF</code></th> <td>3</td> <td><code>INFO</code></td> <td>Node has been successfully included into the cluster; shows the node, managing node, and dynamic ID</td> </tr><tr> <th><code>CM_REGREF</code></th> <td>8</td> <td><code>INFO</code></td> <td>Node has been refused for inclusion in the cluster; cannot be included in cluster due to misconfiguration, inability to establish communication, or other problem</td> </tr><tr> <th><code>FIND_NEIGHBOURS</code></th> <td>8</td> <td><code>INFO</code></td> <td>Shows neighboring data nodes</td> </tr><tr> <th><code>NDBStopStarted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Data node shutdown initiated</td> </tr><tr> <th><code>NDBStopCompleted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Data node shutdown complete</td> </tr><tr> <th><code>NDBStopForced</code></th> <td>1</td> <td><code>ALERT</code></td> <td>Forced shutdown of data node</td> </tr><tr> <th><code>NDBStopAborted</code></th> <td>1</td> <td><code>INFO</code></td> <td>Unable to shut down data node normally</td> </tr><tr> <th><code>StartREDOLog</code></th> <td>4</td> <td><code>INFO</code></td> <td>New redo log started; GCI keep <em class="replaceable"><code>X</code></em>, newest restorable GCI <em class="replaceable"><code>Y</code></em></td> </tr><tr> <th><code>StartLog</code></th> <td>10</td> <td><code>INFO</code></td> <td>New log started; log part <em class="replaceable"><code>X</code></em>, start MB <em class="replaceable"><code>Y</code></em>, stop MB <em class="replaceable"><code>Z</code></em></td> </tr><tr> <th><code>UNDORecordsExecuted</code></th> <td>15</td> <td><code>INFO</code></td> <td>Undo records executed</td> </tr><tr> <th><code>StartReport</code></th> <td>4</td> <td><code>INFO</code></td> <td>Report started</td> </tr><tr> <th><code>LogFileInitStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Log file initialization status</td> </tr><tr> <th><code>LogFileInitCompStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Log file completion status</td> </tr><tr> <th><code>StartReadLCP</code></th> <td>10</td> <td><code>INFO</code></td> <td>Start read for local checkpoint</td> </tr><tr> <th><code>ReadLCPComplete</code></th> <td>10</td> <td><code>INFO</code></td> <td>Read for local checkpoint completed</td> </tr><tr> <th><code>RunRedo</code></th> <td>8</td> <td><code>INFO</code></td> <td>Running the redo log</td> </tr><tr> <th><code>RebuildIndex</code></th> <td>10</td> <td><code>INFO</code></td> <td>Rebuilding indexes</td> </tr></tbody></table>

##### NODERESTART Events

The following events are generated when restarting a node and relate to the success or failure of the node restart process.

**Table 21.53 Events relating to restarting a node**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Event</th> <th>Priority</th> <th>Severity Level</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>NR_CopyDict</code></th> <td>7</td> <td><code>INFO</code></td> <td>Completed copying of dictionary information</td> </tr><tr> <th><code>NR_CopyDistr</code></th> <td>7</td> <td><code>INFO</code></td> <td>Completed copying distribution information</td> </tr><tr> <th><code>NR_CopyFragsStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Starting to copy fragments</td> </tr><tr> <th><code>NR_CopyFragDone</code></th> <td>10</td> <td><code>INFO</code></td> <td>Completed copying a fragment</td> </tr><tr> <th><code>NR_CopyFragsCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Completed copying all fragments</td> </tr><tr> <th><code>NodeFailCompleted</code></th> <td>8</td> <td><code>ALERT</code></td> <td>Node failure phase completed</td> </tr><tr> <th><code>NODE_FAILREP</code></th> <td>8</td> <td><code>ALERT</code></td> <td>Reports that a node has failed</td> </tr><tr> <th><code>ArbitState</code></th> <td>6</td> <td><code>INFO</code></td> <td>Report whether an arbitrator is found or not; there are seven different possible outcomes when seeking an arbitrator, listed here: <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Management server restarts arbitration thread [state=<em class="replaceable"><code>X</code></em>] </p></li><li class="listitem"><p> Prepare arbitrator node <em class="replaceable"><code>X</code></em> [ticket=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Receive arbitrator node <em class="replaceable"><code>X</code></em> [ticket=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Started arbitrator node <em class="replaceable"><code>X</code></em> [ticket=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Lost arbitrator node <em class="replaceable"><code>X</code></em> - process failure [state=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Lost arbitrator node <em class="replaceable"><code>X</code></em> - process exit [state=<em class="replaceable"><code>Y</code></em>] </p></li><li class="listitem"><p> Lost arbitrator node <em class="replaceable"><code>X</code></em> &lt;error msg&gt; [state=<em class="replaceable"><code>Y</code></em>] </p></li></ul> </div> </td> </tr><tr> <th><code>ArbitResult</code></th> <td>2</td> <td><code>ALERT</code></td> <td>Report arbitrator results; there are eight different possible results for arbitration attempts, listed here: <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Arbitration check failed: less than 1/2 nodes left </p></li><li class="listitem"><p> Arbitration check succeeded: node group majority </p></li><li class="listitem"><p> Arbitration check failed: missing node group </p></li><li class="listitem"><p> Network partitioning: arbitration required </p></li><li class="listitem"><p> Arbitration succeeded: affirmative response from node <em class="replaceable"><code>X</code></em> </p></li><li class="listitem"><p> Arbitration failed: negative response from node <em class="replaceable"><code>X</code></em> </p></li><li class="listitem"><p> Network partitioning: no arbitrator available </p></li><li class="listitem"><p> Network partitioning: no arbitrator configured </p></li></ul> </div> </td> </tr><tr> <th><code>GCP_TakeoverStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>GCP takeover started</td> </tr><tr> <th><code>GCP_TakeoverCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>GCP takeover complete</td> </tr><tr> <th><code>LCP_TakeoverStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>LCP takeover started</td> </tr><tr> <th><code>LCP_TakeoverCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>LCP takeover complete (state = <em class="replaceable"><code>X</code></em>)</td> </tr><tr> <th><code>ConnectCheckStarted</code></th> <td>6</td> <td><code>INFO</code></td> <td>Connection check started</td> </tr><tr> <th><code>ConnectCheckCompleted</code></th> <td>6</td> <td><code>INFO</code></td> <td>Connection check completed</td> </tr><tr> <th><code>NodeFailRejected</code></th> <td>6</td> <td><code>ALERT</code></td> <td>Node failure phase failed</td> </tr></tbody></table>

##### STATISTICS Events

The following events are of a statistical nature. They provide information such as numbers of transactions and other operations, amount of data sent or received by individual nodes, and memory usage.

**Table 21.54 Events of a statistical nature**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Event</th> <th>Priority</th> <th>Severity Level</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>TransReportCounters</code></th> <td>8</td> <td><code>INFO</code></td> <td>Report transaction statistics, including numbers of transactions, commits, reads, simple reads, writes, concurrent operations, attribute information, and aborts</td> </tr><tr> <th><code>OperationReportCounters</code></th> <td>8</td> <td><code>INFO</code></td> <td>Number of operations</td> </tr><tr> <th><code>TableCreated</code></th> <td>7</td> <td><code>INFO</code></td> <td>Report number of tables created</td> </tr><tr> <th><code>JobStatistic</code></th> <td>9</td> <td><code>INFO</code></td> <td>Mean internal job scheduling statistics</td> </tr><tr> <th><code>ThreadConfigLoop</code></th> <td>9</td> <td><code>INFO</code></td> <td>Number of thread configuration loops</td> </tr><tr> <th><code>SendBytesStatistic</code></th> <td>9</td> <td><code>INFO</code></td> <td>Mean number of bytes sent to node <em class="replaceable"><code>X</code></em></td> </tr><tr> <th><code>ReceiveBytesStatistic</code></th> <td>9</td> <td><code>INFO</code></td> <td>Mean number of bytes received from node <em class="replaceable"><code>X</code></em></td> </tr><tr> <th><code>MemoryUsage</code></th> <td>5</td> <td><code>INFO</code></td> <td>Data and index memory usage (80%, 90%, and 100%)</td> </tr><tr> <th><code>MTSignalStatistics</code></th> <td>9</td> <td><code>INFO</code></td> <td>Multithreaded signals</td> </tr></tbody></table>

##### SCHEMA Events

These events relate to NDB Cluster schema operations.

**Table 21.55 Events relating to NDB Cluster schema operations**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Event</th> <th>Priority</th> <th>Severity Level</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>CreateSchemaObject</code></th> <td>8</td> <td><code>INFO</code></td> <td>Schema objected created</td> </tr><tr> <th><code>AlterSchemaObject</code></th> <td>8</td> <td><code>INFO</code></td> <td>Schema object updated</td> </tr><tr> <th><code>DropSchemaObject</code></th> <td>8</td> <td><code>INFO</code></td> <td>Schema object dropped</td> </tr></tbody></table>

##### ERROR Events

These events relate to Cluster errors and warnings. The presence of one or more of these generally indicates that a major malfunction or failure has occurred.

**Table 21.56 Events relating to cluster errors and warnings**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Event</th> <th>Priority</th> <th>Severity Level</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>TransporterError</code></th> <td>2</td> <td><code>ERROR</code></td> <td>Transporter error</td> </tr><tr> <th><code>TransporterWarning</code></th> <td>8</td> <td><code>WARNING</code></td> <td>Transporter warning</td> </tr><tr> <th><code>MissedHeartbeat</code></th> <td>8</td> <td><code>WARNING</code></td> <td>Node <em class="replaceable"><code>X</code></em> missed heartbeat number <em class="replaceable"><code>Y</code></em></td> </tr><tr> <th><code>DeadDueToHeartbeat</code></th> <td>8</td> <td><code>ALERT</code></td> <td>Node <em class="replaceable"><code>X</code></em> declared <span class="quote">“<span class="quote">dead</span>”</span> due to missed heartbeat</td> </tr><tr> <th><code>WarningEvent</code></th> <td>2</td> <td><code>WARNING</code></td> <td>General warning event</td> </tr><tr> <th><code>SubscriptionStatus</code></th> <td>4</td> <td><code>WARNING</code></td> <td>Change in subscription status</td> </tr></tbody></table>

##### INFO Events

These events provide general information about the state of the cluster and activities associated with Cluster maintenance, such as logging and heartbeat transmission.

**Table 21.57 Information events**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Event</th> <th>Priority</th> <th>Severity Level</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>SentHeartbeat</code></th> <td>12</td> <td><code>INFO</code></td> <td>Sent heartbeat</td> </tr><tr> <th><code>CreateLogBytes</code></th> <td>11</td> <td><code>INFO</code></td> <td>Create log: Log part, log file, size in MB</td> </tr><tr> <th><code>InfoEvent</code></th> <td>2</td> <td><code>INFO</code></td> <td>General informational event</td> </tr><tr> <th><code>EventBufferStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Event buffer status</td> </tr><tr> <th><code>EventBufferStatus2</code></th> <td>7</td> <td><code>INFO</code></td> <td>Improved event buffer status information; added in NDB 7.5.1</td> </tr></tbody></table>

Note

`SentHeartbeat` events are available only if NDB Cluster was compiled with `VM_TRACE` enabled.

##### SINGLEUSER Events

These events are associated with entering and exiting single user mode.

**Table 21.58 Events relating to single user mode**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Event</th> <th>Priority</th> <th>Severity Level</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>SingleUser</code></th> <td>7</td> <td><code>INFO</code></td> <td>Entering or exiting single user mode</td> </tr></tbody></table>

##### BACKUP Events

These events provide information about backups being created or restored.

**Table 21.59 Backup events**

<table><col style="width: 35%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 45%"/><thead><tr> <th>Event</th> <th>Priority</th> <th>Severity Level</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>BackupStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Backup started</td> </tr><tr> <th><code>BackupStatus</code></th> <td>7</td> <td><code>INFO</code></td> <td>Backup status</td> </tr><tr> <th><code>BackupCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Backup completed</td> </tr><tr> <th><code>BackupFailedToStart</code></th> <td>7</td> <td><code>ALERT</code></td> <td>Backup failed to start</td> </tr><tr> <th><code>BackupAborted</code></th> <td>7</td> <td><code>ALERT</code></td> <td>Backup aborted by user</td> </tr><tr> <th><code>RestoreStarted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Started restoring from backup</td> </tr><tr> <th><code>RestoreMetaData</code></th> <td>7</td> <td><code>INFO</code></td> <td>Restoring metadata</td> </tr><tr> <th><code>RestoreData</code></th> <td>7</td> <td><code>INFO</code></td> <td>Restoring data</td> </tr><tr> <th><code>RestoreLog</code></th> <td>7</td> <td><code>INFO</code></td> <td>Restoring log files</td> </tr><tr> <th><code>RestoreCompleted</code></th> <td>7</td> <td><code>INFO</code></td> <td>Completed restoring from backup</td> </tr><tr> <th><code>SavedEvent</code></th> <td>7</td> <td><code>INFO</code></td> <td>Event saved</td> </tr></tbody></table>
