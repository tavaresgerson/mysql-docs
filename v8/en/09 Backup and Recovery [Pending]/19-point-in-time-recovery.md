--- title: MySQL 8.4 Reference Manual :: 9.5 Point-in-Time (Incremental) Recovery url: https://dev.mysql.com/doc/refman/8.4/en/point-in-time-recovery.html order: 19 ---



## 9.5 Point-in-Time (Incremental) Recovery

 9.5.1 Point-in-Time Recovery Using Binary Log

 9.5.2 Point-in-Time Recovery Using Event Positions

Point-in-time recovery refers to recovery of data changes up to a given point in time. Typically, this type of recovery is performed after restoring a full backup that brings the server to its state as of the time the backup was made. (The full backup can be made in several ways, such as those listed in Section 9.2, “Database Backup Methods”.) Point-in-time recovery then brings the server up to date incrementally from the time of the full backup to a more recent time.


