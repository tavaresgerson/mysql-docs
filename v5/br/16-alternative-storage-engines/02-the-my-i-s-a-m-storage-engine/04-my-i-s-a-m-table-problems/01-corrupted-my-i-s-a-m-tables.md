#### 15.2.4.1 Corrupted MyISAM Tables

Even though the `MyISAM` table format is very reliable (all changes to a table made by an SQL statement are written before the statement returns), you can still get corrupted tables if any of the following events occur:

* The **mysqld** process is killed in the middle of a write.

* An unexpected computer shutdown occurs (for example, the computer is turned off).

* Hardware failures.
* You are using an external program (such as **myisamchk**) to modify a table that is being modified by the server at the same time.

* A software bug in the MySQL or `MyISAM` code.

Typical symptoms of a corrupt table are:

* You get the following error while selecting data from the table:

  ```sql
  Incorrect key file for table: '...'. Try to repair it
  ```

* Queries don't find rows in the table or return incomplete results.

You can check the health of a `MyISAM` table using the `CHECK TABLE` statement, and repair a corrupted `MyISAM` table with `REPAIR TABLE`. When **mysqld** is not running, you can also check or repair a table with the **myisamchk** command. See Section 13.7.2.2, “CHECK TABLE Statement”, Section 13.7.2.5, “REPAIR TABLE Statement”, and Section 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”.

If your tables become corrupted frequently, you should try to determine why this is happening. The most important thing to know is whether the table became corrupted as a result of an unexpected server exit. You can verify this easily by looking for a recent `restarted mysqld` message in the error log. If there is such a message, it is likely that table corruption is a result of the server dying. Otherwise, corruption may have occurred during normal operation. This is a bug. You should try to create a reproducible test case that demonstrates the problem. See Section B.3.3.3, “What to Do If MySQL Keeps Crashing”, and Section 5.8, “Debugging MySQL”.
