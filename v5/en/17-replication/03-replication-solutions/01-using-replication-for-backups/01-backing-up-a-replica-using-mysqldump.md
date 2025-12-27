#### 16.3.1.1 Backing Up a Replica Using mysqldump

Using [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") to create a copy of a database enables you to capture all of the data in the database in a format that enables the information to be imported into another instance of MySQL Server (see [Section 4.5.4, “mysqldump — A Database Backup Program”](mysqldump.html "4.5.4 mysqldump — A Database Backup Program")). Because the format of the information is SQL statements, the file can easily be distributed and applied to running servers in the event that you need access to the data in an emergency. However, if the size of your data set is very large, [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") may be impractical.

When using [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), you should stop replication on the replica before starting the dump process to ensure that the dump contains a consistent set of data:

1. Stop the replica from processing requests. You can stop replication completely on the replica using [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"):

   ```sql
   $> mysqladmin stop-slave
   ```

   Alternatively, you can stop only the replication SQL thread to pause event execution:

   ```sql
   $> mysql -e 'STOP SLAVE SQL_THREAD;'
   ```

   This enables the replica to continue to receive data change events from the source's binary log and store them in the relay logs using the I/O thread, but prevents the replica from executing these events and changing its data. Within busy replication environments, permitting the I/O thread to run during backup may speed up the catch-up process when you restart the replication SQL thread.

2. Run [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") to dump your databases. You may either dump all databases or select databases to be dumped. For example, to dump all databases:

   ```sql
   $> mysqldump --all-databases > fulldb.dump
   ```

3. Once the dump has completed, start replica operations again:

   ```sql
   $> mysqladmin start-slave
   ```

In the preceding example, you may want to add login credentials (user name, password) to the commands, and bundle the process up into a script that you can run automatically each day.

If you use this approach, make sure you monitor the replication process to ensure that the time taken to run the backup does not affect the replica's ability to keep up with events from the source. See [Section 16.1.7.1, “Checking Replication Status”](replication-administration-status.html "16.1.7.1 Checking Replication Status"). If the replica is unable to keep up, you may want to add another replica and distribute the backup process. For an example of how to configure this scenario, see [Section 16.3.5, “Replicating Different Databases to Different Replicas”](replication-solutions-partitioning.html "16.3.5 Replicating Different Databases to Different Replicas").
