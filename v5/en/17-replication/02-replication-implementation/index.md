## 16.2 Replication Implementation

[16.2.1 Replication Formats](replication-formats.html)

[16.2.2 Replication Channels](replication-channels.html)

[16.2.3 Replication Threads](replication-threads.html)

[16.2.4 Relay Log and Replication Metadata Repositories](replica-logs.html)

[16.2.5 How Servers Evaluate Replication Filtering Rules](replication-rules.html)

Replication is based on the replication source server keeping track of all changes to its databases (updates, deletes, and so on) in its binary log. The binary log serves as a written record of all events that modify database structure or content (data) from the moment the server was started. Typically, [`SELECT`](select.html "13.2.9 SELECT Statement") statements are not recorded because they modify neither database structure nor content.

Each replica that connects to the source requests a copy of the binary log. That is, it pulls the data from the source, rather than the source pushing the data to the replica. The replica also executes the events from the binary log that it receives. This has the effect of repeating the original changes just as they were made on the source. Tables are created or their structure modified, and data is inserted, deleted, and updated according to the changes that were originally made on the source.

Because each replica is independent, the replaying of the changes from the source's binary log occurs independently on each replica that is connected to the source. In addition, because each replica receives a copy of the binary log only by requesting it from the source, the replica is able to read and update the copy of the database at its own pace and can start and stop the replication process at will without affecting the ability to update to the latest database status on either the source or replica side.

For more information on the specifics of the replication implementation, see [Section 16.2.3, “Replication Threads”](replication-threads.html "16.2.3 Replication Threads").

Sources and replicas report their status in respect of the replication process regularly so that you can monitor them. See [Section 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information"), for descriptions of all replicated-related states.

The source's binary log is written to a local relay log on the replica before it is processed. The replica also records information about the current position with the source's binary log and the replica's relay log. See [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories").

Database changes are filtered on the replica according to a set of rules that are applied according to the various configuration options and variables that control event evaluation. For details on how these rules are applied, see [Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules").
