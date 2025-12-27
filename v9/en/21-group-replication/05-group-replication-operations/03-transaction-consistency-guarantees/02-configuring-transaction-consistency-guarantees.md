#### 20.5.3.2 Configuring Transaction Consistency Guarantees

Although the Transaction Synchronization Points section explains that conceptually there are two synchronization points from which you can choose: on read or on write, these terms were a simplification and the terms used in Group Replication are: *before* and *after* transaction execution. The consistency level can have different effects on read-only and read/write transactions processed by the group as demonstrated in this section.

* How to Choose a Consistency Level
* Impacts of Consistency Levels
* Impact of Consistency on Primary Election
* Permitted Queries Under Consistency Rules

The following list shows the possible consistency levels that you can configure in Group Replication using the `group_replication_consistency` variable, in order of increasing transaction consistency guarantee:

* `EVENTUAL`

  Neither read-only nor read/write transactions wait for preceding transactions to be applied before executing. This was the behavior of Group Replication before the `group_replication_consistency` variable was added. A read/write transaction does not wait for other members to apply a transaction. This means that a transaction could be externalized on one member before the others. This also means that in the event of a primary failover, the new primary can accept new read-only and read/write transactions before the previous primary transactions are all applied. Read-only transactions could result in outdated values, read/write transactions could result in a rollback due to conflicts.

* `BEFORE_ON_PRIMARY_FAILOVER`

  New read-only or read/write transactions with a newly elected primary that is applying a backlog from the old primary are not applied until any backlog has been applied. This ensures that when a primary failover happens, intentionally or not, clients always see the latest value on the primary. This guarantees consistency, but means that clients must be able to handle the delay in the event that a backlog is being applied. Usually this delay should be minimal, but it does depend on the size of the backlog.

* `BEFORE`

  A read/write transaction waits for all preceding transactions to complete before being applied. A read-only transaction waits for all preceding transactions to complete before being executed. This ensures that this transaction reads the latest value by only affecting the latency of the transaction. This reduces the overhead of synchronization on every read/write transaction, by ensuring synchronization is used only on read-only transactions. This consistency level also includes the consistency guarantees provided by `BEFORE_ON_PRIMARY_FAILOVER`.

* `AFTER`

  A read/write transaction waits until its changes have been applied to all of the other members. This value has no effect on read-only transactions. This mode ensures that when a transaction is committed on the local member, any subsequent transaction reads the written value or a more recent value on any group member. Use this mode with a group that is used for predominantly read-only operations to ensure that applied read/write transactions are applied everywhere once they commit. This could be used by your application to ensure that subsequent reads fetch the latest data which includes the latest writes. This reduces the overhead of synchronization on every read-only transaction, by ensuring synchronization is used only on read/write transactions. This consistency level also includes the consistency guarantees provided by `BEFORE_ON_PRIMARY_FAILOVER`.

* `BEFORE_AND_AFTER`

  A read/write transaction waits for 1) all preceding transactions to complete before being applied and 2) until its changes have been applied on other members. A read-only transaction waits for all preceding transactions to complete before execution takes place. This consistency level also includes the consistency guarantees provided by `BEFORE_ON_PRIMARY_FAILOVER`.

The `BEFORE` and `BEFORE_AND_AFTER` consistency levels can be used on both read-only and read/write transactions. The `AFTER` consistency level has no impact on read-only transactions, because they do not generate changes.

##### How to Choose a Consistency Level

The different consistency levels provide flexibility to both DBAs, who can use them to set up their infrastructure; and to developers who can use the consistency level that best suits their application's requirements. The following scenarios show how to choose a consistency guarantee level based on how you use your group:

* *Scenario 1*: You want to balance reads without being concerned about stale reads, and group write operations are considerably fewer than group read operations. In this case, you should choose `AFTER`.

* *Scenario 2*: For a data set that applies many writes, you want to perform occasional reads without concerns about reading stale data. In this case, you should choose `BEFORE`.

* *Scenario 3*: You want specific transactions to read only up-to-date data from the group, so that whenever sensitive data such as credentials for a file is updated, reads always use the most recent value. In this case, you should choose `BEFORE`.

* *Scenario 4*: For a group that has predominantly read-only data, you want read/write transactions to be applied everywhere once they commit, so that subsequent reads are done on data that includes your latest writes and you do not incur the cost of synchronization for every read-only transaction, but only for read/write transactions. In this case, you should choose `AFTER`.

* *Scenario 5*: For a group that works predominantly with read-only data, you want read/write transactions to read up-to-date data from the group and to be applied everywhere once they commit, so that subsequent reads are performed on data that includes the latest write and you do not incur the cost of synchronization for every read-only transaction, but only for read/write transactions. In this case, you should choose `BEFORE_AND_AFTER`.

You can choose the scope for which the consistency level is enforced by setting `group_replication_consistency` with session or global scope. This is important because consistency levels can have a negative impact on group performance they apply globally.

To enforce the consistency level for the current session, use session scope, like this:

```
> SET @@SESSION.group_replication_consistency= 'BEFORE';
```

To enforce the consistency level for all sessions, use global scope, as shown here:

```
> SET @@GLOBAL.group_replication_consistency= 'BEFORE';
```

The possibility of setting the consistency level on specific sessions enables you to take advantage of scenarios such as those listed here:

* *Scenario 6*: A given system handles several instructions that do not require a strong consistency level, but one kind of instruction does require strong consistency: managing access permissions to documents;. In this scenario, the system changes access permissions and it wants to be sure that all clients see the correct permission. You only need to `SET @@SESSION.group_replication_consistency= ‘AFTER’`, on those instructions and leave the other instructions to run with `EVENTUAL` set at the global scope.

* *Scenario 7*: On the same system as described in Scenario 6, a command that performs analytics needs to be executed daily, using the most up-to-date data. To achieve this, you need only run the SQL statement `SET @@SESSION.group_replication_consistency= ‘BEFORE’` prior to executing the command.

In sum, you do not need to run all transactions with the same specific consistency level, especially if only some transactions actually require it.

You should be aware that all read/write transactions are always ordered in Group Replication, so even when you set the consistency level to `AFTER` for the current session, this transaction waits until its changes are applied on all members, which means waiting for this and all preceding transactions that could be in the secondaries' queues. In other words, the consistency level `AFTER` waits for everything up to and including this transaction.

##### Impacts of Consistency Levels

Another way to classify the consistency levels is in terms of impact on the group, that is, the repercussions that the consistency levels have on the other members.

The `BEFORE` consistency level, apart from being ordered on the transaction stream, only impacts on the local member. That is, it does not require coordination with the other members and does not have repercussions on their transactions. In other words, `BEFORE` only impacts the transactions on which it is used.

The `AFTER` and `BEFORE_AND_AFTER` consistency levels do have side-effects on concurrent transactions executed on other members. These consistency levels make the other members transactions wait if transactions with the `EVENTUAL` consistency level start while a transaction with `AFTER` or `BEFORE_AND_AFTER` is executing. The other members wait until the `AFTER` transaction is committed on that member, even if the other member's transactions have the `EVENTUAL` consistency level. In other words, `AFTER` and `BEFORE_AND_AFTER` impact *all* `ONLINE` group members.

To illustrate this further, imagine a group with 3 members, M1, M2 and M3. On member M1 a client issues:

```
> SET @@SESSION.group_replication_consistency= AFTER;
> BEGIN;
> INSERT INTO t1 VALUES (1);
> COMMIT;
```

Then, while the above transaction is being applied, on member M2 a client issues:

```
> SET SESSION group_replication_consistency= EVENTUAL;
```

In this situation, even though the second transaction's consistency level is `EVENTUAL`, because it starts executing while the first transaction is already in the commit phase on M2, the second transaction has to wait for the first transaction to finish the commit and only then can it execute.

You can only use the consistency levels `BEFORE`, `AFTER` and `BEFORE_AND_AFTER` on `ONLINE` members, attempting to use them on members in other states causes a session error.

Transactions whose consistency level is not `EVENTUAL` hold execution until a timeout, configured by `wait_timeout` value is reached, which defaults to 8 hours. If the timeout is reached an `ER_GR_HOLD_WAIT_TIMEOUT` error is thrown.

##### Impact of Consistency on Primary Election

This section describes how a group's consistency level impacts on a single-primary group that has elected a new primary. Such a group automatically detects failures and adjusts the view of the members that are active, in other words the membership configuration. Furthermore, if a group is deployed in single-primary mode, whenever the group's membership changes there is a check performed to detect if there is still a primary member in the group. If there is none, a new one is selected from the list of secondary members. Typically, this is known as the secondary promotion.

Given the fact that the system detects failures and reconfigures itself automatically, the user may also expect that once the promotion takes place, the new primary is in the exact state, data-wise, as that of the old one. In other words, the user may expect that there is no backlog of replicated transactions to be applied on the new primary once he is able to read from and write to it. In practical terms, the user may expect that once his application fails-over to the new primary, there would be no chance, even if temporarily, to read old data or write into old data records.

When flow control is activated and properly tuned on a group, there is only a small chance of transiently reading stale data from a newly elected primary immediately after the promotion, as there should not be a backlog, or if there is one it should be small. Moreover, you might have a proxy or middleware layers that govern application accesses to the primary after a promotion and enforce the consistency criteria at that level. You can specify the behavior of the new primary once it is promoted using the `group_replication_consistency` variable, which controls whether a newly elected primary blocks both reads and writes until after the backlog is fully applied. If the `group_replication_consistency` variable was set to `BEFORE_ON_PRIMARY_FAILOVER` on a newly elected primary which has backlog to apply, and transactions are issued against the new primary while it is still applying the backlog, incoming transactions are blocked until the backlog is fully applied. This prevents the following anomalies:

* No stale reads for read-only and read/write transactions. This prevents stale reads from being externalized to the application by the new primary.

* No spurious rollbacks for read/write transactions, due to write-write conflicts with replicated read/write transactions still in the backlog waiting to be applied.

* No read skew on read/write transactions, such as this one:

  ```
  > BEGIN;
  > SELECT x FROM t1; -- x=1 because x=2 is in the backlog;
  > INSERT x INTO t2;
  > COMMIT;
  ```

  This query should not cause a conflict but writes outdated values.

To summarize, when `group_replication_consistency` is set to `BEFORE_ON_PRIMARY_FAILOVER` you are choosing to prioritize consistency over availability, because reads and writes are held whenever a new primary is elected. This is the trade-off you have to consider when configuring your group. It should also be remembered that if flow control is working correctly, backlog should be minimal. Note that the higher consistency levels `BEFORE`, `AFTER`, and `BEFORE_AND_AFTER` also include the consistency guarantees provided by `BEFORE_ON_PRIMARY_FAILOVER`.

To guarantee that the group provides the same consistency level regardless of which member is promoted to primary, all members of the group should have `BEFORE_ON_PRIMARY_FAILOVER` (or a higher consistency level) persisted to their configuration. For example, on each member issue:

```
> SET PERSIST group_replication_consistency='BEFORE_ON_PRIMARY_FAILOVER';
```

This ensures that the members all behave in the same way, and that the configuration is persisted after a restart of the member.

A transaction cannot be on-hold forever, and if the time held exceeds `wait_timeout` it returns an ER\_GR\_HOLD\_WAIT\_TIMEOUT error.

##### Permitted Queries Under Consistency Rules

Although all writes are held when using `BEFORE_ON_PRIMARY_FAILOVER` consistency level, not all reads are blocked to ensure that you can still inspect the server while it is applying backlog after a promotion took place. This is useful for debugging, monitoring, observability and troubleshooting. Some queries that do not modify data are allowed, such as the following:

* `SHOW` statements: These are restricted to those that do not depend on data, only on status and configuration.

  The `SHOW` statements that are allowed are `SHOW VARIABLES`, `SHOW PROCESSLIST`, `SHOW STATUS`, `SHOW ENGINE INNODB LOGS`, `SHOW ENGINE INNODB STATUS`, `SHOW ENGINE INNODB MUTEX`, `SHOW BINARY LOG STATUS`, `SHOW REPLICA STATUS`, `SHOW CHARACTER SET`, `SHOW COLLATION`, `SHOW BINARY LOGS`, `SHOW OPEN TABLES`, `SHOW REPLICAS`, `SHOW BINLOG EVENTS`, `SHOW WARNINGS`, `SHOW ERRORS`, `SHOW ENGINES`, `SHOW PRIVILEGES`, `SHOW PROCEDURE STATUS`, `SHOW FUNCTION STATUS`, `SHOW PLUGINS`, `SHOW EVENTS`, `SHOW PROFILE`, `SHOW PROFILES`, and `SHOW RELAYLOG EVENTS`.

* `SET` statements
* `DO` statements that do not use tables or loadable functions

* `EMPTY` statements
* `USE` statements
* Using `SELECT` statements against the `performance_schema` and `sys` databases

* Using `SELECT` statements against the `PROCESSLIST` table from the `infoschema` database

* `SELECT` statements that do not use tables or loadable functions

* `STOP GROUP_REPLICATION` statements

* `SHUTDOWN` statements
* `RESET PERSIST` statements
