#### B.3.3.4 How MySQL Handles a Full Disk

This section describes how MySQL responds to disk-full errors (such as “no space left on device”), and to quota-exceeded errors (such as “write failed” or “user block limit reached”).

This section is relevant for writes to `MyISAM` tables. It also applies for writes to binary log files and binary log index file, except that references to “row” and “record” should be understood to mean “event.”

When a disk-full condition occurs, MySQL does the following:

* It checks once every minute to see whether there is enough space to write the current row. If there is enough space, it continues as if nothing had happened.
* Every 10 minutes it writes an entry to the log file, warning about the disk-full condition.

To alleviate the problem, take the following actions:

* To continue, you only have to free enough disk space to insert all records.
* Alternatively, to abort the thread, use  `mysqladmin kill`. The thread is aborted the next time it checks the disk (in one minute).
* Other threads might be waiting for the table that caused the disk-full condition. If you have several “locked” threads, killing the one thread that is waiting on the disk-full condition enables the other threads to continue.

Exceptions to the preceding behavior are when you use  `REPAIR TABLE` or  `OPTIMIZE TABLE` or when the indexes are created in a batch after  `LOAD DATA` or after an  `ALTER TABLE` statement. All of these statements may create large temporary files that, if left to themselves, would cause big problems for the rest of the system. If the disk becomes full while MySQL is doing any of these operations, it removes the big temporary files and mark the table as crashed. The exception is that for  `ALTER TABLE`, the old table is left unchanged.


