### 29.12.12 Performance Schema NDB Cluster Tables

29.12.12.1 The ndb_sync_pending_objects Table

29.12.12.2 The ndb_sync_excluded_objects Table

The following table shows all Performance Schema tables relating to the `NDBCLUSTER` storage engine.

**Table 29.3 Performance Schema NDB Tables**

<table summary="A reference that lists all Performance Schema tables relating to NDB Cluster."><thead><tr><th>Table Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th><code>ndb_sync_excluded_objects</code></th> <td>NDB objects which cannot be synchronized</td> <td>8.0.21</td> </tr><tr><th><code>ndb_sync_pending_objects</code></th> <td>NDB objects waiting for synchronization</td> <td>8.0.21</td> </tr></tbody></table>

Beginning with NDB 8.0.16, automatic synchronization in `NDB` attempts to detect and synchronize automatically all mismatches in metadata between the NDB Cluster's internal dictionary and the MySQL Server's datadictionary. This is done by default in the background at regular intervals as determined by the `ndb_metadata_check_interval` system variable, unless disabled using `ndb_metadata_check` or overridden by setting `ndb_metadata_sync`. Prior to NDB 8.0.21, the only information readily accessible to users about this process was in the form of logging messages and object counts available (beginning with NDB 8.0.18) as the status variables `Ndb_metadata_detected_count`, `Ndb_metadata_synced_count`, and `Ndb_metadata_excluded_count` (prior to NDB 8.0.22, this variable was named `Ndb_metadata_blacklist_size`). Beginning with NDB 8.0.21, more detailed information about the current state of automatic synchronization is exposed by a MySQL server acting as an SQL node in an NDB Cluster in these two Performance Schema tables:

* `ndb_sync_pending_objects`: Displays information about `NDB` database objects for which mismatches have been detected between the `NDB` dictionary and the MySQL data dictionary. When attempting to synchronize such objects, `NDB` removes the object from the queue awaiting synchronization, and from this table, and tries to reconcile the mismatch. If synchronization of the object fails due to a temporary error, it is picked up and added back to the queue (and to this table) the next time `NDB` performs mismatch detection; if the attempts fails due a permanent error, the object is added to the `ndb_sync_excluded_objects` table.

* `ndb_sync_excluded_objects`: Shows information about `NDB` database objects for which automatic synchronization has failed due to permanent errors resulting from mismatches which cannot be reconciled without manual intervention; these objects are blocklisted and not considered again for mismatch detection until this has been done.

The `ndb_sync_pending_objects` and `ndb_sync_excluded_objects` tables are present only if MySQL has support enabled for the `NDBCLUSTER` storage engine.

These tables are described in more detail in the following two sections.
