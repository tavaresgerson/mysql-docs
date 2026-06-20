### 29.12.13 Performance Schema Lock Tables

The Performance Schema exposes lock information through these tables:

* `data_locks`: Data locks held and requested

* `data_lock_waits`: Relationships between data lock owners and data lock requestors blocked by those owners

* `metadata_locks`: Metadata locks held and requested

* `table_handles`: Table locks held and requested

The following sections describe these tables in more detail.