## 12.18 Functions Used with Global Transaction Identifiers (GTIDs)

The functions described in this section are used with GTID-based replication. It is important to keep in mind that all of these functions take string representations of GTID sets as arguments. As such, the GTID sets must always be quoted when used with them. See GTID Sets for more information.

The union of two GTID sets is simply their representations as strings, joined together with an interposed comma. In other words, you can define a very simple function for obtaining the union of two GTID sets, similar to that created here:

```sql
CREATE FUNCTION GTID_UNION(g1 TEXT, g2 TEXT)
    RETURNS TEXT DETERMINISTIC
    RETURN CONCAT(g1,',',g2);
```

For more information about GTIDs and how these GTID functions are used in practice, see Section 16.1.3, “Replication with Global Transaction Identifiers”.

**Table 12.24 GTID Functions**

<table frame="box" rules="all" summary="A reference that lists functions used with global transaction identifiers (GTIDs)."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="gtid-functions.html#function_gtid-subset"><code class="literal">GTID_SUBSET()</code></a></td> <td> Return true if all GTIDs in subset are also in set; otherwise false. </td> </tr><tr><td><a class="link" href="gtid-functions.html#function_gtid-subtract"><code class="literal">GTID_SUBTRACT()</code></a></td> <td> Return all GTIDs in set that are not in subset. </td> </tr><tr><td><a class="link" href="gtid-functions.html#function_wait-for-executed-gtid-set"><code class="literal">WAIT_FOR_EXECUTED_GTID_SET()</code></a></td> <td> Wait until the given GTIDs have executed on the replica. </td> </tr><tr><td><a class="link" href="gtid-functions.html#function_wait-until-sql-thread-after-gtids"><code class="literal">WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()</code></a></td> <td> Use <code class="literal">WAIT_FOR_EXECUTED_GTID_SET()</code>. </td> </tr></tbody></table>

* `GTID_SUBSET(set1,set2)`

  Given two sets of global transaction identifiers *`set1`* and *`set2`*, returns true if all GTIDs in *`set1`* are also in *`set2`*. Returns false otherwise.

  The GTID sets used with this function are represented as strings, as shown in the following examples:

  ```sql
  mysql> SELECT GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'): 1
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23-25',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:23-25',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'): 1
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBSET('3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'): 0
  1 row in set (0.00 sec)
  ```

* `GTID_SUBTRACT(set1,set2)`

  Given two sets of global transaction identifiers *`set1`* and *`set2`*, returns only those GTIDs from *`set1`* that are not in *`set2`*.

  All GTID sets used with this function are represented as strings and must be quoted, as shown in these examples:

  ```sql
  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21'): 3e11fa47-71ca-11e1-9e33-c80aa9429562:22-57
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:20-25'): 3e11fa47-71ca-11e1-9e33-c80aa9429562:26-57
  1 row in set (0.00 sec)

  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:23-24')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:23-24'): 3e11fa47-71ca-11e1-9e33-c80aa9429562:21-22:25-57
  1 row in set (0.01 sec)
  ```

  Subtracting a GTID set from itself produces an empty set, as shown here:

  ```sql
  mysql> SELECT GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      ->     '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57')\G
  *************************** 1. row ***************************
  GTID_SUBTRACT('3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57',
      '3E11FA47-71CA-11E1-9E33-C80AA9429562:21-57'):
  1 row in set (0.00 sec)
  ```

* `WAIT_FOR_EXECUTED_GTID_SET(gtid_set[, timeout])`

  Wait until the server has applied all of the transactions whose global transaction identifiers are contained in *`gtid_set`*; that is, until the condition GTID\_SUBSET(*`gtid_subset`*, `@@GLOBAL.gtid_executed`) holds. See Section 16.1.3.1, “GTID Format and Storage” for a definition of GTID sets.

  If a timeout is specified, and *`timeout`* seconds elapse before all of the transactions in the GTID set have been applied, the function stops waiting. *`timeout`* is optional, and the default timeout is 0 seconds, in which case the function always waits until all of the transactions in the GTID set have been applied. *`timeout`* must be greater than or equal to 0; as of MySQL 5.7.18, when running in strict SQL mode, a negative *`timeout`* value is immediately rejected with an error; otherwise the function returns `NULL`, and raises a warning.

  `WAIT_FOR_EXECUTED_GTID_SET()` monitors all the GTIDs that are applied on the server, including transactions that arrive from all replication channels and user clients. It does not take into account whether replication channels have been started or stopped.

  For more information, see Section 16.1.3, “Replication with Global Transaction Identifiers”.

  GTID sets used with this function are represented as strings and so must be quoted as shown in the following example:

  ```sql
  mysql> SELECT WAIT_FOR_EXECUTED_GTID_SET('3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5');
          -> 0
  ```

  For a syntax description for GTID sets, see Section 16.1.3.1, “GTID Format and Storage”.

  For `WAIT_FOR_EXECUTED_GTID_SET()`, the return value is the state of the query, where 0 represents success, and 1 represents timeout. Any other failures generate an error.

  `gtid_mode` cannot be changed to OFF while any client is using this function to wait for GTIDs to be applied.

* `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS(gtid_set[, timeout][,channel])`

  `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` is similar to `WAIT_FOR_EXECUTED_GTID_SET()` in that it waits until all of the transactions whose global transaction identifiers are contained in *`gtid_set`* have been applied, or until *`timeout`* seconds have elapsed, whichever occurs first. However, `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` applies to a specific replication channel, and stops only after the transactions have been applied on the specified channel, for which the applier must be running. In contrast, `WAIT_FOR_EXECUTED_GTID_SET()` stops after the transactions have been applied, regardless of where they were applied (on any replication channel or any user client), and whether or not any replication channels are running.

  *`timeout`* must be greater than or equal to 0; as of MySQL 5.7.18, when running in strict SQL mode, a negative *`timeout`* value is immediately rejected with an error (`ER_WRONG_ARGUMENTS`); otherwise `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` returns `NULL`, and raises a warning.

  The *`channel`* option names which replication channel the function applies to. If no channel is named and no channels other than the default replication channel exist, the function applies to the default replication channel. If multiple replication channels exist, you must specify a channel as otherwise it is not known which replication channel the function applies to. See Section 16.2.2, “Replication Channels” for more information on replication channels.

  Note

  Because `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` applies to a specific replication channel, if an expected transaction arrives on a different replication channel or from a user client, for example in a failover or manual recovery situation, the function can hang indefinitely if no timeout is set. Use `WAIT_FOR_EXECUTED_GTID_SET()` instead to ensure correct handling of transactions in these situations.

  GTID sets used with `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` are represented as strings and must be quoted in the same way as for `WAIT_FOR_EXECUTED_GTID_SET()`. For `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`, the return value for the function is an arbitrary positive number. If GTID-based replication is not active (that is, if the value of the `gtid_mode` variable is OFF), then this value is undefined and `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` returns NULL. If the replica is not running then the function also returns NULL.

  `gtid_mode` cannot be changed to OFF while any client is using this function to wait for GTIDs to be applied.
