# Chapter 16 Replication

**Table of Contents**

[16.1 Configuring Replication](replication-configuration.html) :   [16.1.1 Binary Log File Position Based Replication Configuration Overview](binlog-replication-configuration-overview.html)

    [16.1.2 Setting Up Binary Log File Position Based Replication](replication-howto.html)

    [16.1.3 Replication with Global Transaction Identifiers](replication-gtids.html)

    [16.1.4 Changing Replication Modes on Online Servers](replication-mode-change-online.html)

    [16.1.5 MySQL Multi-Source Replication](replication-multi-source.html)

    [16.1.6 Replication and Binary Logging Options and Variables](replication-options.html)

    [16.1.7 Common Replication Administration Tasks](replication-administration.html)

[16.2 Replication Implementation](replication-implementation.html) :   [16.2.1 Replication Formats](replication-formats.html)

    [16.2.2 Replication Channels](replication-channels.html)

    [16.2.3 Replication Threads](replication-threads.html)

    [16.2.4 Relay Log and Replication Metadata Repositories](replica-logs.html)

    [16.2.5 How Servers Evaluate Replication Filtering Rules](replication-rules.html)

[16.3 Replication Solutions](replication-solutions.html) :   [16.3.1 Using Replication for Backups](replication-solutions-backups.html)

    [16.3.2 Handling an Unexpected Halt of a Replica](replication-solutions-unexpected-replica-halt.html)

    [16.3.3 Using Replication with Different Source and Replica Storage Engines](replication-solutions-diffengines.html)

    [16.3.4 Using Replication for Scale-Out](replication-solutions-scaleout.html)

    [16.3.5 Replicating Different Databases to Different Replicas](replication-solutions-partitioning.html)

    [16.3.6 Improving Replication Performance](replication-solutions-performance.html)

    [16.3.7 Switching Sources During Failover](replication-solutions-switch.html)

    [16.3.8 Setting Up Replication to Use Encrypted Connections](replication-encrypted-connections.html)

    [16.3.9 Semisynchronous Replication](replication-semisync.html)

    [16.3.10 Delayed Replication](replication-delayed.html)

[16.4 Replication Notes and Tips](replication-notes.html) :   [16.4.1 Replication Features and Issues](replication-features.html)

    [16.4.2 Replication Compatibility Between MySQL Versions](replication-compatibility.html)

    [16.4.3 Upgrading a Replication Topology](replication-upgrade.html)

    [16.4.4 Troubleshooting Replication](replication-problems.html)

    [16.4.5 How to Report Replication Bugs or Problems](replication-bugs.html)

Replication enables data from one MySQL database server (the source) to be copied to one or more MySQL database servers (the replicas). Replication is asynchronous by default; replicas do not need to be connected permanently to receive updates from the source. Depending on the configuration, you can replicate all databases, selected databases, or even selected tables within a database.

Advantages of replication in MySQL include:

* Scale-out solutions - spreading the load among multiple replicas to improve performance. In this environment, all writes and updates must take place on the replication source server. Reads, however, may take place on one or more replicas. This model can improve the performance of writes (since the source is dedicated to updates), while dramatically increasing read speed across an increasing number of replicas.

* Data security - because data is replicated to the replica, and the replica can pause the replication process, it is possible to run backup services on the replica without corrupting the corresponding source data.

* Analytics - live data can be created on the source, while the analysis of the information can take place on the replica without affecting the performance of the source.

* Long-distance data distribution - you can use replication to create a local copy of data for a remote site to use, without permanent access to the source.

For information on how to use replication in such scenarios, see [Section 16.3, “Replication Solutions”](replication-solutions.html "16.3 Replication Solutions").

MySQL 5.7 supports different methods of replication. The traditional method is based on replicating events from the source's binary log, and requires the log files and positions in them to be synchronized between source and replica. The newer method based on global transaction identifiers (GTIDs) is transactional and therefore does not require working with log files or positions within these files, which greatly simplifies many common replication tasks. Replication using GTIDs guarantees consistency between source and replica as long as all transactions committed on the source have also been applied on the replica. For more information about GTIDs and GTID-based replication in MySQL, see [Section 16.1.3, “Replication with Global Transaction Identifiers”](replication-gtids.html "16.1.3 Replication with Global Transaction Identifiers"). For information on using binary log file position based replication, see [Section 16.1, “Configuring Replication”](replication-configuration.html "16.1 Configuring Replication").

Replication in MySQL supports different types of synchronization. The original type of synchronization is one-way, asynchronous replication, in which one server acts as the source, while one or more other servers act as replicas. This is in contrast to the *synchronous* replication which is a characteristic of NDB Cluster (see [Chapter 21, *MySQL NDB Cluster 7.5 and NDB Cluster 7.6*](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")). In MySQL 5.7, semisynchronous replication is supported in addition to the built-in asynchronous replication. With semisynchronous replication, a commit performed on the source blocks before returning to the session that performed the transaction until at least one replica acknowledges that it has received and logged the events for the transaction; see [Section 16.3.9, “Semisynchronous Replication”](replication-semisync.html "16.3.9 Semisynchronous Replication"). MySQL 5.7 also supports delayed replication such that a replica deliberately lags behind the source by at least a specified amount of time; see [Section 16.3.10, “Delayed Replication”](replication-delayed.html "16.3.10 Delayed Replication"). For scenarios where *synchronous* replication is required, use NDB Cluster (see [Chapter 21, *MySQL NDB Cluster 7.5 and NDB Cluster 7.6*](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")).

There are a number of solutions available for setting up replication between servers, and the best method to use depends on the presence of data and the engine types you are using. For more information on the available options, see [Section 16.1.2, “Setting Up Binary Log File Position Based Replication”](replication-howto.html "16.1.2 Setting Up Binary Log File Position Based Replication").

There are two core types of replication format, Statement Based Replication (SBR), which replicates entire SQL statements, and Row Based Replication (RBR), which replicates only the changed rows. You can also use a third variety, Mixed Based Replication (MBR). For more information on the different replication formats, see [Section 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").

Replication is controlled through a number of different options and variables. For more information, see [Section 16.1.6, “Replication and Binary Logging Options and Variables”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables").

You can use replication to solve a number of different problems, including performance, supporting the backup of different databases, and as part of a larger solution to alleviate system failures. For information on how to address these issues, see [Section 16.3, “Replication Solutions”](replication-solutions.html "16.3 Replication Solutions").

For notes and tips on how different data types and statements are treated during replication, including details of replication features, version compatibility, upgrades, and potential problems and their resolution, see [Section 16.4, “Replication Notes and Tips”](replication-notes.html "16.4 Replication Notes and Tips"). For answers to some questions often asked by those who are new to MySQL Replication, see [Section A.14, “MySQL 5.7 FAQ: Replication”](faqs-replication.html "A.14 MySQL 5.7 FAQ: Replication").

For detailed information on the implementation of replication, how replication works, the process and contents of the binary log, background threads and the rules used to decide how statements are recorded and replicated, see [Section 16.2, “Replication Implementation”](replication-implementation.html "16.2 Replication Implementation").
