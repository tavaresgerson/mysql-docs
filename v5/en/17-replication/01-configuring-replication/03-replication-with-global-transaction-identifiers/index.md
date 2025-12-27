### 16.1.3 Replication with Global Transaction Identifiers

[16.1.3.1 GTID Format and Storage](replication-gtids-concepts.html)

[16.1.3.2 GTID Life Cycle](replication-gtids-lifecycle.html)

[16.1.3.3 GTID Auto-Positioning](replication-gtids-auto-positioning.html)

[16.1.3.4 Setting Up Replication Using GTIDs](replication-gtids-howto.html)

[16.1.3.5 Using GTIDs for Failover and Scaleout](replication-gtids-failover.html)

[16.1.3.6 Restrictions on Replication with GTIDs](replication-gtids-restrictions.html)

[16.1.3.7 Stored Function Examples to Manipulate GTIDs](replication-gtids-functions.html)

This section explains transaction-based replication using global transaction identifiers (GTIDs). When using GTIDs, each transaction can be identified and tracked as it is committed on the originating server and applied by any replicas; this means that it is not necessary when using GTIDs to refer to log files or positions within those files when starting a new replica or failing over to a new source, which greatly simplifies these tasks. Because GTID-based replication is completely transaction-based, it is simple to determine whether sources and replicas are consistent; as long as all transactions committed on a source are also committed on a replica, consistency between the two is guaranteed. You can use either statement-based or row-based replication with GTIDs (see [Section 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats")); however, for best results, we recommend that you use the row-based format.

GTIDs are always preserved between source and replica. This means that you can always determine the source for any transaction applied on any replica by examining its binary log. In addition, once a transaction with a given GTID is committed on a given server, any subsequent transaction having the same GTID is ignored by that server. Thus, a transaction committed on the source can be applied no more than once on the replica, which helps to guarantee consistency.

This section discusses the following topics:

* How GTIDs are defined and created, and how they are represented in a MySQL server (see [Section 16.1.3.1, “GTID Format and Storage”](replication-gtids-concepts.html "16.1.3.1 GTID Format and Storage")).

* The life cycle of a GTID (see [Section 16.1.3.2, “GTID Life Cycle”](replication-gtids-lifecycle.html "16.1.3.2 GTID Life Cycle")).

* The auto-positioning function for synchronizing a replica and source that use GTIDs (see [Section 16.1.3.3, “GTID Auto-Positioning”](replication-gtids-auto-positioning.html "16.1.3.3 GTID Auto-Positioning")).

* A general procedure for setting up and starting GTID-based replication (see [Section 16.1.3.4, “Setting Up Replication Using GTIDs”](replication-gtids-howto.html "16.1.3.4 Setting Up Replication Using GTIDs")).

* Suggested methods for provisioning new replication servers when using GTIDs (see [Section 16.1.3.5, “Using GTIDs for Failover and Scaleout”](replication-gtids-failover.html "16.1.3.5 Using GTIDs for Failover and Scaleout")).

* Restrictions and limitations that you should be aware of when using GTID-based replication (see [Section 16.1.3.6, “Restrictions on Replication with GTIDs”](replication-gtids-restrictions.html "16.1.3.6 Restrictions on Replication with GTIDs")).

* Stored functions that you can use to work with GTIDs (see [Section 16.1.3.7, “Stored Function Examples to Manipulate GTIDs”](replication-gtids-functions.html "16.1.3.7 Stored Function Examples to Manipulate GTIDs")).

For information about MySQL Server options and variables relating to GTID-based replication, see [Section 16.1.6.5, “Global Transaction ID System Variables”](replication-options-gtids.html "16.1.6.5 Global Transaction ID System Variables"). See also [Section 12.18, “Functions Used with Global Transaction Identifiers (GTIDs)”](gtid-functions.html "12.18 Functions Used with Global Transaction Identifiers (GTIDs)"), which describes SQL functions supported by MySQL 5.7 for use with GTIDs.
