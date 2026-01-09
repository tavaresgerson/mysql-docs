### 29.12.12 Performance Schema NDB Cluster Tables

29.12.12.1 The ndb_sync_pending_objects Table

29.12.12.2 The ndb_sync_excluded_objects Table

29.12.12.3 The ndb_replication_applier_status Table

The following table shows all Performance Schema tables relating to the `NDBCLUSTER` storage engine.

**Table 29.3 Performance Schema NDB Tables**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema tables relating to NDB Cluster."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code class="literal">ndb_replication_applier_status</code></td> <td>NDB replication applier status information for each replication channel</td> </tr><tr><td><code class="literal">ndb_sync_excluded_objects</code></td> <td>NDB objects which cannot be synchronized</td> </tr><tr><td><code class="literal">ndb_sync_pending_objects</code></td> <td>NDB objects waiting for synchronization</td> </tr></tbody></table>

Note

These tables are present only if MySQL has support enabled for the `NDBCLUSTER` storage engine.

Automatic synchronization in `NDB` attempts to detect and synchronize automatically all mismatches in metadata between the NDB Cluster's internal dictionary and the MySQL Server's datadictionary. This is done by default in the background at regular intervals as determined by the `ndb_metadata_check_interval` system variable, unless disabled using `ndb_metadata_check` or overridden by setting `ndb_metadata_sync`.

Information about the current state of automatic synchronization is exposed by a MySQL server acting as an SQL node in an NDB Cluster in these two Performance Schema tables:

* `ndb_sync_pending_objects`: Displays information about `NDB` database objects for which mismatches have been detected between the `NDB` dictionary and the MySQL data dictionary. When attempting to synchronize such objects, `NDB` removes the object from the queue awaiting synchronization, and from this table, and tries to reconcile the mismatch. If synchronization of the object fails due to a temporary error, it is picked up and added back to the queue (and to this table) the next time `NDB` performs mismatch detection; if the attempts fails due a permanent error, the object is added to the `ndb_sync_excluded_objects` table.

* `ndb_sync_excluded_objects`: Shows information about `NDB` database objects for which automatic synchronization has failed due to permanent errors resulting from mismatches which cannot be reconciled without manual intervention; these objects are blocklisted and not considered again for mismatch detection until this has been done.

These tables are described in more detail in the next two sections.

Historically, information about the state of the `NDB` replication applier was available only as a set of server status variables, which reflected the state of the default replication channel only. The `ndb_replication_applier_status` table provides this information for each active replication channel. See Section 29.12.12.3, “The ndb_replication_applier_status Table”, for a detailed description of this table and its columns.
