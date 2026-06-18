### 29.12.13 Performance Schema Lock Tables

[29.12.13.1 The data\_locks Table](performance-schema-data-locks-table.html)

[29.12.13.2 The data\_lock\_waits Table](performance-schema-data-lock-waits-table.html)

[29.12.13.3 The metadata\_locks Table](performance-schema-metadata-locks-table.html)

[29.12.13.4 The table\_handles Table](performance-schema-table-handles-table.html)

The Performance Schema exposes lock information through these
tables:

* [`data_locks`](performance-schema-data-locks-table.html "29.12.13.1 The data_locks Table"): Data locks held and
  requested

* [`data_lock_waits`](performance-schema-data-lock-waits-table.html "29.12.13.2 The data_lock_waits Table"): Relationships
  between data lock owners and data lock requestors blocked by
  those owners

* [`metadata_locks`](performance-schema-metadata-locks-table.html "29.12.13.3 The metadata_locks Table"): Metadata locks
  held and requested

* [`table_handles`](performance-schema-table-handles-table.html "29.12.13.4 The table_handles Table"): Table locks held
  and requested

The following sections describe these tables in more detail.