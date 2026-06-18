### 29.12.12 Performance Schema NDB Cluster Tables

[29.12.12.1 The ndb\_sync\_pending\_objects Table](performance-schema-ndb-sync-pending-objects-table.html)

[29.12.12.2 The ndb\_sync\_excluded\_objects Table](performance-schema-ndb-sync-excluded-objects-table.html)

[29.12.12.3 The ndb\_replication\_applier\_status Table](performance-schema-ndb-replication-applier-status-table.html)

The following table shows all Performance Schema tables relating
to the [`NDBCLUSTER`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") storage engine.

**Table 29.3 Performance Schema NDB Tables**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema tables relating to NDB Cluster."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th>
<th>Description</th>
</tr></thead><tbody><tr><td><a class="link" href="performance-schema-ndb-replication-applier-status-table.html" title="29.12.12.3 The ndb_replication_applier_status Table"><code class="literal">ndb_replication_applier_status</code></a></td>
<td>NDB replication applier status information for each replication channel</td>
</tr><tr><td><a class="link" href="performance-schema-ndb-sync-excluded-objects-table.html" title="29.12.12.2 The ndb_sync_excluded_objects Table"><code class="literal">ndb_sync_excluded_objects</code></a></td>
<td>NDB objects which cannot be synchronized</td>
</tr><tr><td><a class="link" href="performance-schema-ndb-sync-pending-objects-table.html" title="29.12.12.1 The ndb_sync_pending_objects Table"><code class="literal">ndb_sync_pending_objects</code></a></td>
<td>NDB objects waiting for synchronization</td>
</tr></tbody></table>

Note

These tables are present only if MySQL has support enabled for
the [`NDBCLUSTER`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") storage engine.

Automatic synchronization in [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5")
attempts to detect and synchronize automatically all mismatches
in metadata between the NDB Cluster's internal dictionary
and the MySQL Server's datadictionary. This is done by
default in the background at regular intervals as determined by
the [`ndb_metadata_check_interval`](mysql-cluster-options-variables.html#sysvar_ndb_metadata_check_interval)
system variable, unless disabled using
[`ndb_metadata_check`](mysql-cluster-options-variables.html#sysvar_ndb_metadata_check) or
overridden by setting
[`ndb_metadata_sync`](mysql-cluster-options-variables.html#sysvar_ndb_metadata_sync).

Information about the current state of automatic synchronization
is exposed by a MySQL server acting as an SQL node in an NDB
Cluster in these two Performance Schema tables:

* [`ndb_sync_pending_objects`](performance-schema-ndb-sync-pending-objects-table.html "29.12.12.1 The ndb_sync_pending_objects Table"):
  Displays information about [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5")
  database objects for which mismatches have been detected
  between the `NDB` dictionary and the MySQL
  data dictionary. When attempting to synchronize such
  objects, [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") removes the object
  from the queue awaiting synchronization, and from this
  table, and tries to reconcile the mismatch. If
  synchronization of the object fails due to a temporary
  error, it is picked up and added back to the queue (and to
  this table) the next time `NDB` performs
  mismatch detection; if the attempts fails due a permanent
  error, the object is added to the
  [`ndb_sync_excluded_objects`](performance-schema-ndb-sync-excluded-objects-table.html "29.12.12.2 The ndb_sync_excluded_objects Table")
  table.

* [`ndb_sync_excluded_objects`](performance-schema-ndb-sync-excluded-objects-table.html "29.12.12.2 The ndb_sync_excluded_objects Table"):
  Shows information about [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5")
  database objects for which automatic synchronization has
  failed due to permanent errors resulting from mismatches
  which cannot be reconciled without manual intervention;
  these objects are blocklisted and not considered again for
  mismatch detection until this has been done.

These tables are described in more detail in the next two
sections.

Historically, information about the state of the
`NDB` replication applier was available only as
a set of server status variables, which reflected the state of
the default replication channel only. The
`ndb_replication_applier_status` table provides
this information for each active replication channel. See
[Section 29.12.12.3, “The ndb\_replication\_applier\_status Table”](performance-schema-ndb-replication-applier-status-table.html "29.12.12.3 The ndb_replication_applier_status Table"),
for a detailed description of this table and its columns.