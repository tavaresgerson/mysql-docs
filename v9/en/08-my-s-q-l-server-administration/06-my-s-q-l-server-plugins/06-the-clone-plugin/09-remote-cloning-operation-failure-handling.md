#### 7.6.6.9 Remote Cloning Operation Failure Handling

This section describes failure handing at different stages of a cloning operation.

1. Prerequisites are checked (see Remote Cloning Prerequisites).

   * If a failure occurs during the prerequisite check, the `CLONE INSTANCE` operation reports an error.

2. Concurrent DDL on the donor is blocked only if the `clone_block_ddl` variable is set to `ON` (the default setting is `OFF`). See Section 7.6.6.4, “Cloning and Concurrent DDL”.

   If the cloning operation is unable to obtain a DDL lock within the time limit specified by the `clone_ddl_timeout` variable, an error is reported.

3. User-created data (schemas, tables, tablespaces) and binary logs on the recipient are removed before data is cloned to the recipient data directory.

   When user-created data and binary logs are removed from the recipient data directory during a remote cloning operation, the data is not saved and may be lost if a failure occurs. If the data is of importance, a backup should be taken before initiating a remote cloning operation.

   For informational purposes, warnings are printed to the server error log to specify when data removal starts and finishes:

   ```
   [Warning] [MY-013453] [InnoDB] Clone removing all user data for provisioning:
   Started...

   [Warning] [MY-013453] [InnoDB] Clone removing all user data for provisioning:
   Finished
   ```

   If a failure occurs while removing data, the recipient may be left with a partial set of schemas, tables, and tablespaces that existed before the cloning operation. Any time during the execution of a cloning operation or after a failure, the server is always in a consistent state.

4. Data is cloned from the donor. User-created data, dictionary metadata, and other system data are cloned.

   If a failure occurs while cloning data, the cloning operation is rolled back and all cloned data removed. At this stage, the previously existing user-created data and binary logs on the recipient have also been removed.

   Should this scenario occur, you can either rectify the cause of the failure and re-execute the cloning operation, or forgo the cloning operation and restore the recipient data from a backup taken before the cloning operation.

5. The server is restarted automatically (applies to remote cloning operations that do not clone to a named directory). During startup, typical server startup tasks are performed.

   If the automatic server restart fails, you can restart the server manually to complete the cloning operation.

If a network error occurs during a cloning operation, the operation resumes if the error is resolved within the time specified by the `clone_donor_timeout_after_network_failure` variable defined on the donor instance. The `clone_donor_timeout_after_network_failure` default setting is 5 minutes but a range of 0 to 30 minutes is supported. If the operation does not resume within the allotted time, it aborts and returns an error, and the donor drops the snapshot. A setting of zero causes the donor to drop the snapshot immediately when a network error occurs. Configuring a longer timeout allows more time for resolving network issues but also increases the size of the delta on the donor instance, which increases clone recovery time as well as replication lag in cases where the clone is intended as a replica or replication group member.

The Clone idle timeout is set to the default `wait_timeout` setting, which is 28800 seconds (8 hours).
