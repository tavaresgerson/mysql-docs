#### 25.6.15.35 The ndbinfo events Table

This table provides information about event subscriptions in `NDB`. The columns of the `events` table are listed here, with short descriptions of each:

* `event_id`

  The event ID

* `name`

  The name of the event

* `table_id`

  The ID of the table on which the event occurred

* `reporting`

  One of `updated`, `all`, `subscribe`, or `DDL`

* `columns`

  A comma-separated list of columns affected by the event

* `table_event`

  One or more of `INSERT`, `DELETE`, `UPDATE`, `SCAN`, `DROP`, `ALTER`, `CREATE`, `GCP_COMPLETE`, `CLUSTER_FAILURE`, `STOP`, `NODE_FAILURE`, `SUBSCRIBE`, `UNSUBSCRIBE`, and `ALL` (defined by `Event::TableEvent` in the NDB API)
