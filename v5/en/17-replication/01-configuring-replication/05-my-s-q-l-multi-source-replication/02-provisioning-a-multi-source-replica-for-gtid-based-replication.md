#### 16.1.5.2 Provisioning a Multi-Source Replica for GTID-Based Replication

If the sources in the multi-source replication topology have existing data, it can save time to provision the replica with the relevant data before starting replication. In a multi-source replication topology, copying the data directory cannot be used to provision the replica with data from all of the sources, and you might also want to replicate only specific databases from each source. The best strategy for provisioning such a replica is therefore to use [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") to create an appropriate dump file on each source, then use the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client to import the dump file on the replica.

If you are using GTID-based replication, you need to pay attention to the `SET @@GLOBAL.gtid_purged` statement that [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") places in the dump output. This statement transfers the GTIDs for the transactions executed on the source to the replica, and the replica requires this information. However, for any case more complex than provisioning one new, empty replica from one source, you need to check what effect the statement has in the replica's version of MySQL, and handle the statement accordingly. The following guidance summarizes suitable actions, but for more details, see the [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") documentation.

In MySQL 5.6 and 5.7, the `SET @@GLOBAL.gtid_purged` statement written by [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") replaces the value of [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) on the replica. Also in those releases that value can only be changed when the replica's record of transactions with GTIDs (the [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) set) is empty. In a multi-source replication topology, you must therefore remove the `SET @@GLOBAL.gtid_purged` statement from the dump output before replaying the dump files, because you cannot apply a second or subsequent dump file including this statement. As an alternative to removing the `SET @@GLOBAL.gtid_purged` statement, if you are provisioning the replica with two partial dumps from the same source, and the GTID set in the second dump is the same as the first (so no new transactions have been executed on the source in between the dumps), you can set [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program")'s `--set-gtid-purged` option to `OFF` when you output the second dump file, to omit the statement.

For MySQL 5.6 and 5.7, these limitations mean all the dump files from the sources must be applied in a single operation on a replica with an empty [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) set. You can clear a replica's GTID execution history by issuing [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") on the replica, but if you have other, wanted transactions with GTIDs on the replica, choose an alternative method of provisioning from those described in [Section 16.1.3.5, “Using GTIDs for Failover and Scaleout”](replication-gtids-failover.html "16.1.3.5 Using GTIDs for Failover and Scaleout").

In the following provisioning example, we assume that the `SET @@GLOBAL.gtid_purged` statement needs to be removed from the files and handled manually. We also assume that there are no wanted transactions with GTIDs on the replica before provisioning starts.

1. To create dump files for a database named `db1` on `source1` and a database named `db2` on `source2`, run [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") for `source1` as follows:

   ```sql
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db1 > dumpM1.sql
   ```

   Then run [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") for `source2` as follows:

   ```sql
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db2 > dumpM2.sql
   ```

2. Record the [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) value that [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") added to each of the dump files. For example, for dump files created on MySQL 5.6 or 5.7, you can extract the value like this:

   ```sql
   cat dumpM1.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   cat dumpM2.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   ```

   The result in each case should be a GTID set, for example:

   ```sql
   source1:   2174B383-5441-11E8-B90A-C80AA9429562:1-1029
   source2:   224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695
   ```

3. Remove the line from each dump file that contains the `SET @@GLOBAL.gtid_purged` statement. For example:

   ```sql
   sed '/GTID_PURGED/d' dumpM1.sql > dumpM1_nopurge.sql
   sed '/GTID_PURGED/d' dumpM2.sql > dumpM2_nopurge.sql
   ```

4. Use the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client to import each edited dump file into the replica. For example:

   ```sql
   mysql -u<user> -p<password> < dumpM1_nopurge.sql
   mysql -u<user> -p<password> < dumpM2_nopurge.sql
   ```

5. On the replica, issue [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") to clear the GTID execution history (assuming, as explained above, that all the dump files have been imported and that there are no wanted transactions with GTIDs on the replica). Then issue a `SET @@GLOBAL.gtid_purged` statement to set the [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) value to the union of all the GTID sets from all the dump files, as you recorded in Step 2. For example:

   ```sql
   mysql> RESET MASTER;
   mysql> SET @@GLOBAL.gtid_purged = "2174B383-5441-11E8-B90A-C80AA9429562:1-1029, 224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695";
   ```

   If there are, or might be, overlapping transactions between the GTID sets in the dump files, you can use the stored functions described in [Section 16.1.3.7, “Stored Function Examples to Manipulate GTIDs”](replication-gtids-functions.html "16.1.3.7 Stored Function Examples to Manipulate GTIDs") to check this beforehand and to calculate the union of all the GTID sets.
