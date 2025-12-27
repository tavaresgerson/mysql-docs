### 20.7.9 Monitoring Group Replication Memory Usage with Performance Schema Memory Instrumentation

20.7.9.1 Enabling or Disabling Group Replication Instrumentation

20.7.9.2 Example Queries

The MySQL Performance Schema provides instrumentation for performance monitoring of Group Replication memory usage. To view the available Group Replication instrumentation, issue the following query:

```
mysql> SELECT NAME,ENABLED FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'memory/group_rpl/%';
+-------------------------------------------------------------------+---------+
| NAME                                                              | ENABLED |
+-------------------------------------------------------------------+---------+
| memory/group_rpl/write_set_encoded                                | YES     |
| memory/group_rpl/certification_data                               | YES     |
| memory/group_rpl/certification_data_gc                            | YES     |
| memory/group_rpl/certification_info                               | YES     |
| memory/group_rpl/transaction_data                                 | YES     |
| memory/group_rpl/sql_service_command_data                         | YES     |
| memory/group_rpl/mysql_thread_queued_task                         | YES     |
| memory/group_rpl/message_service_queue                            | YES     |
| memory/group_rpl/message_service_received_message                 | YES     |
| memory/group_rpl/group_member_info                                | YES     |
| memory/group_rpl/consistent_members_that_must_prepare_transaction | YES     |
| memory/group_rpl/consistent_transactions                          | YES     |
| memory/group_rpl/consistent_transactions_prepared                 | YES     |
| memory/group_rpl/consistent_transactions_waiting                  | YES     |
| memory/group_rpl/consistent_transactions_delayed_view_change      | YES     |
| memory/group_rpl/GCS_XCom::xcom_cache                             | YES     |
| memory/group_rpl/Gcs_message_data::m_buffer                       | YES     |
+-------------------------------------------------------------------+---------+
```

For more information on Performance Schema's memory instrumentation and events, see Section 29.12.20.10, “Memory Summary Tables”.

#### Performance Schema Group Replication instruments memory allocation for Group Replication.

The `memory/group_rpl/` Performance Schema instrumentation contains the following instruments:

* `write_set_encoded`: Memory allocated to encode the write set before it is broadcast to the group members.

* `Gcs_message_data::m_buffer`: Memory allocated for the transaction data payload sent to the network.

* `certification_data`: Memory allocated for certification of incoming transactions.

* `certification_data_gc`: Memory allocated for the GTID\_EXECUTED sent by each member for garbage collection.

* `certification_info`: Memory allocated for storage of certification information allocated to resolve conflicts between concurrent transactions.

* `transaction_data`: Memory allocated for incoming transactions queued for the plugin pipeline.

* `message_service_received_message`: Memory allocated to receiving messages from Group Replication delivery message service.

* `sql_service_command_data`: Memory allocated for processing the queue of internal SQL service commands.

* `mysql_thread_queued_task`: Memory allocated when a MySQL-thread dependent task is added to the processing queue.

* `message_service_queue`: Memory allocated for queued messages of the Group Replication delivery message service.

* `GCS_XCom::xcom_cache`: Memory allocated to XCOM ache for messaging and metadata exchanged between group members as part of the consensus protocol.

* `consistent_members_that_must_prepare_transaction`: Memory allocated to hold list of members preparing transaction for Group Replication transaction consistency guarantees.

* `consistent_transactions`: Memory allocated to hold transaction and list of members that must prepare that transaction for Group Replication transaction consistency guarantees.

* `consistent_transactions_prepared`: Memory allocated to hold list of transaction's info prepared for the Group Replication Transaction Consistency Guarantees.

* `consistent_transactions_waiting`: Memory allocated to hold information on a list of transactions while preceding prepared transactions with consistency of `AFTER` and `BEFORE_AND_AFTER` are processed.

* `consistent_transactions_delayed_view_change`: Memory allocated to hold list of view change events (`view_change_log_event`) delayed by prepared consistent transactions waiting for prepare acknowledgement.

* `group_member_info`: Memory allocated to hold the group member properties. Properties such as hostname, port, member weight and role, and so on.

The following instruments in the `memory/sql/` grouping are also used to monitor Group Replication memory:

* `Log_event`: Memory allocated for encoding transaction data into the binary log format; this is the same format in which Group Replication transmits data.

* `write_set_extraction`: Memory allocated to the transaction's generated write set before it is committed.

* `Gtid_set::to_string`: Memory allocated to stored the string representation of a GTID set.

* `Gtid_set::Interval_chunk`: Memory allocated to store the GTID object.
