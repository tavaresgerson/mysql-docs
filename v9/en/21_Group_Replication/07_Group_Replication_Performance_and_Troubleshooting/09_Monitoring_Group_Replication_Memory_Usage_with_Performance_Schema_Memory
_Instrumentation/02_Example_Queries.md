#### 20.7.9.2 Example Queries

This section describes sample queries using the instruments and events for monitoring Group Replication memory usage. The queries retrieve data from the `memory_summary_global_by_event_name` table.

The memory data can be queried for individual events, for example:

```
SELECT * FROM performance_schema.memory_summary_global_by_event_name
WHERE EVENT_NAME = 'memory/group_rpl/write_set_encoded'\G

*************************** 1. row ***************************
                  EVENT_NAME: memory/group_rpl/write_set_encoded
                 COUNT_ALLOC: 1
                  COUNT_FREE: 0
   SUM_NUMBER_OF_BYTES_ALLOC: 45
    SUM_NUMBER_OF_BYTES_FREE: 0
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 1
             HIGH_COUNT_USED: 1
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 45
   HIGH_NUMBER_OF_BYTES_USED: 45
```

See Section 29.12.20.10, “Memory Summary Tables” for more information on the columns.

You can also define queries which sum various events to provide overviews of specific areas of memory usage.

The following examples are described:

* Memory Used to Capture Transactions
* Memory Used to Broadcast Transactions
* Total Memory Used in Group Replication
* Memory Used in Certification
* Memory Used in Certification
* Memory Used in Replication Pipeline
* Memory Used in Consistency
* Memory Used in Delivery Message Service
* Memory Used to Broadcast and Receive Transactions

##### Memory Used to Capture Transactions

The memory allocated to capture user transactions is a sum of the `write_set_encoded`, `write_set_extraction`, and `Log_event` event's values. For example:

```
SELECT * FROM (SELECT
                (CASE
                  WHEN EVENT_NAME LIKE 'memory/group_rpl/write_set_encoded'
                  THEN 'memory/group_rpl/memory_gr'
                  WHEN EVENT_NAME = 'memory/sql/write_set_extraction'
                  THEN 'memory/group_rpl/memory_gr'
                  WHEN EVENT_NAME = 'memory/sql/Log_event'
                  THEN 'memory/group_rpl/memory_gr'
                  ELSE 'memory_gr_rest'
                END) AS EVENT_NAME,
                SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME LIKE 'memory/group_rpl/write_set_encoded'
                            THEN 'memory/group_rpl/memory_gr'
                            WHEN EVENT_NAME = 'memory/sql/write_set_extraction'
                            THEN 'memory/group_rpl/memory_gr'
                            WHEN EVENT_NAME = 'memory/sql/Log_event'
                            THEN 'memory/group_rpl/memory_gr'
                            ELSE 'memory_gr_rest'
                          END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                       EVENT_NAME: memory/group_rpl/memory_gr
                 SUM(COUNT_ALLOC): 127
                  SUM(COUNT_FREE): 117
   SUM(SUM_NUMBER_OF_BYTES_ALLOC): 54808
    SUM(SUM_NUMBER_OF_BYTES_FREE): 52051
              SUM(LOW_COUNT_USED): 0
          SUM(CURRENT_COUNT_USED): 10
             SUM(HIGH_COUNT_USED): 35
    SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 2757
   SUM(HIGH_NUMBER_OF_BYTES_USED): 15630
```

##### Memory Used to Broadcast Transactions

The memory allocated to broadcast transactions is a sum of the `Gcs_message_data::m_buffer`, `transaction_data`, and `GCS_XCom::xcom_cache` event values. For example:

```
SELECT * FROM (
                SELECT
                  (CASE
                    WHEN EVENT_NAME =  'memory/group_rpl/Gcs_message_data::m_buffer'
                    THEN 'memory/group_rpl/memory_gr'
                    WHEN EVENT_NAME = 'memory/group_rpl/GCS_XCom::xcom_cache'
                    THEN 'memory/group_rpl/memory_gr'
                    WHEN EVENT_NAME = 'memory/group_rpl/transaction_data'
                    THEN 'memory/group_rpl/memory_gr'
                    ELSE 'memory_gr_rest'
                  END) AS EVENT_NAME,
                  SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                  SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                  SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                  SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                  SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                  SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME =  'memory/group_rpl/Gcs_message_data::m_buffer'
                            THEN 'memory/group_rpl/memory_gr'
                            WHEN EVENT_NAME = 'memory/group_rpl/GCS_XCom::xcom_cache'
                            THEN 'memory/group_rpl/memory_gr'
                            WHEN EVENT_NAME = 'memory/group_rpl/transaction_data'
                            THEN 'memory/group_rpl/memory_gr'
                            ELSE 'memory_gr_rest'
                          END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                       EVENT_NAME: memory/group_rpl/memory_gr
                 SUM(COUNT_ALLOC): 84
                  SUM(COUNT_FREE): 31
   SUM(SUM_NUMBER_OF_BYTES_ALLOC): 1072324
    SUM(SUM_NUMBER_OF_BYTES_FREE): 7149
              SUM(LOW_COUNT_USED): 0
          SUM(CURRENT_COUNT_USED): 53
             SUM(HIGH_COUNT_USED): 59
    SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 1065175
   SUM(HIGH_NUMBER_OF_BYTES_USED): 1065809
```

##### Total Memory Used in Group Replication

The memory allocation to sending and receiving transactions, certification, and all other major processes. It is calculated by querying all the events of the `memory/group_rpl/` group. For example:

```
SELECT * FROM (
                SELECT
                  (CASE
                    WHEN EVENT_NAME LIKE 'memory/group_rpl/%'
                    THEN 'memory/group_rpl/memory_gr'
                    ELSE 'memory_gr_rest'
                    END) AS EVENT_NAME,
                    SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                    SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                    SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                    SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                    SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                    SUM(HIGH_NUMBER_OF_BYTES_USED)
                 FROM performance_schema.memory_summary_global_by_event_name
                 GROUP BY (CASE
                              WHEN EVENT_NAME LIKE 'memory/group_rpl/%'
                              THEN 'memory/group_rpl/memory_gr'
                              ELSE 'memory_gr_rest'
                            END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                      EVENT_NAME: memory/group_rpl/memory_gr
                SUM(COUNT_ALLOC): 190
                 SUM(COUNT_FREE): 127
  SUM(SUM_NUMBER_OF_BYTES_ALLOC): 1096370
   SUM(SUM_NUMBER_OF_BYTES_FREE): 28675
             SUM(LOW_COUNT_USED): 0
         SUM(CURRENT_COUNT_USED): 63
            SUM(HIGH_COUNT_USED): 77
   SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 1067695
  SUM(HIGH_NUMBER_OF_BYTES_USED): 1069255
```

##### Memory Used in Certification

The memory allocation in the certification process is a sum of the `certification_data`, `certification_data_gc`, and `certification_info` event values. For example:

```
SELECT * FROM (
                SELECT
                  (CASE
                     WHEN EVENT_NAME = 'memory/group_rpl/certification_data'
                     THEN 'memory/group_rpl/certification'
                     WHEN EVENT_NAME = 'memory/group_rpl/certification_data_gc'
                     THEN 'memory/group_rpl/certification'
                     WHEN EVENT_NAME = 'memory/group_rpl/certification_info'
                     THEN 'memory/group_rpl/certification'
                     ELSE 'memory_gr_rest'
                   END) AS EVENT_NAME, SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                   SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                   SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                   SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                   SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                   SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME = 'memory/group_rpl/certification_data'
                            THEN 'memory/group_rpl/certification'
                            WHEN EVENT_NAME = 'memory/group_rpl/certification_data_gc'
                            THEN 'memory/group_rpl/certification'
                            WHEN EVENT_NAME = 'memory/group_rpl/certification_info'
                            THEN 'memory/group_rpl/certification'
                            ELSE 'memory_gr_rest'
                         END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                      EVENT_NAME: memory/group_rpl/certification
                SUM(COUNT_ALLOC): 80
                 SUM(COUNT_FREE): 80
  SUM(SUM_NUMBER_OF_BYTES_ALLOC): 9442
   SUM(SUM_NUMBER_OF_BYTES_FREE): 9442
             SUM(LOW_COUNT_USED): 0
         SUM(CURRENT_COUNT_USED): 0
            SUM(HIGH_COUNT_USED): 66
   SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 0
  SUM(HIGH_NUMBER_OF_BYTES_USED): 6561
```

##### Memory Used in Replication Pipeline

The memory allocation of the replication pipeline is the sum of the `certification_data` and `transaction_data` event values. For example:

```
SELECT * FROM (
                SELECT
                  (CASE
                     WHEN EVENT_NAME LIKE 'memory/group_rpl/certification_data'
                     THEN 'memory/group_rpl/pipeline'
                     WHEN EVENT_NAME LIKE 'memory/group_rpl/transaction_data'
                     THEN 'memory/group_rpl/pipeline'
                     ELSE 'memory_gr_rest'
                   END) AS EVENT_NAME, SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                   SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                   SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                   SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                   SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                   SUM(HIGH_NUMBER_OF_BYTES_USED)
                 FROM performance_schema.memory_summary_global_by_event_name
                 GROUP BY (CASE
                            WHEN EVENT_NAME LIKE 'memory/group_rpl/certification_data'
                            THEN 'memory/group_rpl/pipeline'
                            WHEN EVENT_NAME LIKE 'memory/group_rpl/transaction_data'
                            THEN 'memory/group_rpl/pipeline'
                            ELSE 'memory_gr_rest'
                          END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                 EVENT_NAME: memory/group_rpl/pipeline
                COUNT_ALLOC: 17
                 COUNT_FREE: 13
  SUM_NUMBER_OF_BYTES_ALLOC: 2483
   SUM_NUMBER_OF_BYTES_FREE: 1668
             LOW_COUNT_USED: 0
         CURRENT_COUNT_USED: 4
            HIGH_COUNT_USED: 4
   LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 815
  HIGH_NUMBER_OF_BYTES_USED: 815
```

##### Memory Used in Consistency

The memory allocation for transaction consistency guarantees is the sum of the `consistent_members_that_must_prepare_transaction`, `consistent_transactions`, `consistent_transactions_prepared`, `consistent_transactions_waiting`, and `consistent_transactions_delayed_view_change` event values. For example:

```
SELECT * FROM (
                SELECT
                  (CASE
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_members_that_must_prepare_transaction'
                     THEN 'memory/group_rpl/consistency'
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions'
                     THEN 'memory/group_rpl/consistency'
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_prepared'
                     THEN 'memory/group_rpl/consistency'
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_waiting'
                     THEN 'memory/group_rpl/consistency'
                     WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_delayed_view_change'
                     THEN 'memory/group_rpl/consistency'
                     ELSE 'memory_gr_rest'
                   END) AS EVENT_NAME, SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                  SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                  SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                  SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                  SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                  SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_members_that_must_prepare_transaction'
                            THEN 'memory/group_rpl/consistency'
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions'
                            THEN 'memory/group_rpl/consistency'
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_prepared'
                            THEN 'memory/group_rpl/consistency'
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_waiting'
                            THEN 'memory/group_rpl/consistency'
                            WHEN EVENT_NAME = 'memory/group_rpl/consistent_transactions_delayed_view_change'
                            THEN 'memory/group_rpl/consistency'
                            ELSE 'memory_gr_rest'
                          END)
                ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                  EVENT_NAME: memory/group_rpl/consistency
                 COUNT_ALLOC: 16
                  COUNT_FREE: 6
   SUM_NUMBER_OF_BYTES_ALLOC: 1464
    SUM_NUMBER_OF_BYTES_FREE: 528
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 10
             HIGH_COUNT_USED: 11
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 936
   HIGH_NUMBER_OF_BYTES_USED: 1024
```

##### Memory Used in Delivery Message Service

Note

This instrumentation applies only to data received, not data sent.

The memory allocation for the Group Replication delivery message service is the sum of the `message_service_received_message` and `message_service_queue` event values. For example:

```
SELECT * FROM (
                SELECT
                  (CASE
                     WHEN EVENT_NAME = 'memory/group_rpl/message_service_received_message'
                     THEN 'memory/group_rpl/message_service'
                     WHEN EVENT_NAME = 'memory/group_rpl/message_service_queue'
                     THEN 'memory/group_rpl/message_service'
                     ELSE 'memory_gr_rest'
                  END) AS EVENT_NAME,
                  SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                  SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                  SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                  SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                  SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                  SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                            WHEN EVENT_NAME = 'memory/group_rpl/message_service_received_message'
                            THEN 'memory/group_rpl/message_service'
                            WHEN EVENT_NAME = 'memory/group_rpl/message_service_queue'
                            THEN 'memory/group_rpl/message_service'
                            ELSE 'memory_gr_rest'
                          END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                 EVENT_NAME: memory/group_rpl/message_service
                COUNT_ALLOC: 2
                 COUNT_FREE: 0
  SUM_NUMBER_OF_BYTES_ALLOC: 1048664
   SUM_NUMBER_OF_BYTES_FREE: 0
             LOW_COUNT_USED: 0
         CURRENT_COUNT_USED: 2
            HIGH_COUNT_USED: 2
   LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 1048664
  HIGH_NUMBER_OF_BYTES_USED: 1048664
```

##### Memory Used to Broadcast and Receive Transactions

The memory allocation for the broadcasting and receiving transactions to and from the network is the sum of the `wGcs_message_data::m_buffer` and `GCS_XCom::xcom_cache` event values. For example:

```
SELECT * FROM (
                SELECT
                  (CASE
                    WHEN EVENT_NAME = 'memory/group_rpl/Gcs_message_data::m_buffer'
                    THEN 'memory/group_rpl/memory_gr'
                    WHEN EVENT_NAME = 'memory/group_rpl/GCS_XCom::xcom_cache'
                    THEN 'memory/group_rpl/memory_gr'
                    ELSE 'memory_gr_rest'
                  END) AS EVENT_NAME,
                  SUM(COUNT_ALLOC), SUM(COUNT_FREE),
                  SUM(SUM_NUMBER_OF_BYTES_ALLOC),
                  SUM(SUM_NUMBER_OF_BYTES_FREE), SUM(LOW_COUNT_USED),
                  SUM(CURRENT_COUNT_USED), SUM(HIGH_COUNT_USED),
                  SUM(LOW_NUMBER_OF_BYTES_USED), SUM(CURRENT_NUMBER_OF_BYTES_USED),
                  SUM(HIGH_NUMBER_OF_BYTES_USED)
                FROM performance_schema.memory_summary_global_by_event_name
                GROUP BY (CASE
                           WHEN EVENT_NAME = 'memory/group_rpl/Gcs_message_data::m_buffer'
                           THEN 'memory/group_rpl/memory_gr'
                           WHEN EVENT_NAME = 'memory/group_rpl/GCS_XCom::xcom_cache'
                           THEN 'memory/group_rpl/memory_gr'
                           ELSE 'memory_gr_rest'
                         END)
              ) f
WHERE f.EVENT_NAME != 'memory_gr_rest'\G

*************************** 1. row ***************************
                      EVENT_NAME: memory/group_rpl/memory_gr
                SUM(COUNT_ALLOC): 73
                 SUM(COUNT_FREE): 20
  SUM(SUM_NUMBER_OF_BYTES_ALLOC): 1070845
   SUM(SUM_NUMBER_OF_BYTES_FREE): 5670
             SUM(LOW_COUNT_USED): 0
         SUM(CURRENT_COUNT_USED): 53
            SUM(HIGH_COUNT_USED): 56
   SUM(LOW_NUMBER_OF_BYTES_USED): 0
SUM(CURRENT_NUMBER_OF_BYTES_USED): 1065175
  SUM(HIGH_NUMBER_OF_BYTES_USED): 1065175
```
