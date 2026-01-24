#### 21.6.15.23 The ndbinfo logbuffers Table

The `logbuffer` table provides information on NDB Cluster log buffer usage.

The `logbuffers` table contains the following columns:

* `node_id`

  The ID of this data node.

* `log_type`

  Type of log. In NDB 7.5, one of: `REDO` or `DD-UNDO`. In NDB 7.6, one of: `REDO`, `DD-UNDO`, `BACKUP-DATA`, or `BACKUP-LOG`.

* `log_id`

  The log ID; for Disk Data undo log files, this is the same as the value shown in the `LOGFILE_GROUP_NUMBER` column of the Information Schema [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table as well as the value shown for the `log_id` column of the `ndbinfo` [`logspaces`](mysql-cluster-ndbinfo-logspaces.html "21.6.15.24 The ndbinfo logspaces Table") table

* `log_part`

  The log part number

* `total`

  Total space available for this log

* `used`

  Space used by this log

##### Notes

NDB 7.6.6 makes available `logbuffers` table rows reflecting two additional log types when performing an NDB backup. One of these rows has the log type `BACKUP-DATA`, which shows the amount of data buffer used during backup to copy fragments to backup files. The other row has the log type `BACKUP-LOG`, which displays the amount of log buffer used during the backup to record changes made after the backup has started. One each of these `log_type` rows is shown in the `logbuffers` table for each data node in the cluster. These rows are not present unless an NDB backup is currently being performed. (Bug #25822988)
