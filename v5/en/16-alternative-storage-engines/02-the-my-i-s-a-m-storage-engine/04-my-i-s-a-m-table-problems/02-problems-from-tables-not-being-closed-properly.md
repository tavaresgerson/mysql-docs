#### 15.2.4.2 Problems from Tables Not Being Closed Properly

Each `MyISAM` index file (`.MYI` file) has a counter in the header that can be used to check whether a table has been closed properly. If you get the following warning from `CHECK TABLE` or **myisamchk**, it means that this counter has gone out of sync:

```sql
clients are using or haven't closed the table properly
```

This warning does not necessarily mean that the table is corrupted, but you should at least check the table.

The counter works as follows:

* The first time a table is updated in MySQL, a counter in the header of the index files is incremented.

* The counter is not changed during further updates.
* When the last instance of a table is closed (because a `FLUSH TABLES` operation was performed or because there is no room in the table cache), the counter is decremented if the table has been updated at any point.

* When you repair the table or check the table and it is found to be okay, the counter is reset to zero.

* To avoid problems with interaction with other processes that might check the table, the counter is not decremented on close if it was zero.

In other words, the counter can become incorrect only under these conditions:

* A `MyISAM` table is copied without first issuing `LOCK TABLES` and `FLUSH TABLES`.

* MySQL has crashed between an update and the final close. (The table may still be okay because MySQL always issues writes for everything between each statement.)

* A table was modified by **myisamchk --recover** or **myisamchk --update-state** at the same time that it was in use by **mysqld**.

* Multiple **mysqld** servers are using the table and one server performed a `REPAIR TABLE` or `CHECK TABLE` on the table while it was in use by another server. In this setup, it is safe to use `CHECK TABLE`, although you might get the warning from other servers. However, `REPAIR TABLE` should be avoided because when one server replaces the data file with a new one, this is not known to the other servers.

  In general, it is a bad idea to share a data directory among multiple servers. See Section 5.7, “Running Multiple MySQL Instances on One Machine”, for additional discussion.
