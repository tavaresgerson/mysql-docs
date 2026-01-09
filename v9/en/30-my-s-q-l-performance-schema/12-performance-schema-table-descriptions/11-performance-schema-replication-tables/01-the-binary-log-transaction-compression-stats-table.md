#### 29.12.11.1 The binary_log_transaction_compression_stats Table

This table shows statistical information for transaction payloads written to the binary log and relay log, and can be used to calculate the effects of enabling binary log transaction compression. For information on binary log transaction compression, see Section 7.4.4.5, “Binary Log Transaction Compression”.

The `binary_log_transaction_compression_stats` table is populated only when the server instance has a binary log, and the system variable `binlog_transaction_compression` is set to `ON`. The statistics cover all transactions written to the binary log and relay log from the time the server was started or the table was truncated. Compressed transactions are grouped by the compression algorithm used, and uncompressed transactions are grouped together with the compression algorithm stated as `NONE`, so the compression ratio can be calculated.

The `binary_log_transaction_compression_stats` table has these columns:

* `LOG_TYPE`

  Whether these transactions were written to the binary log or relay log.

* `COMPRESSION_TYPE`

  The compression algorithm used to compress the transaction payloads. `NONE` means the payloads for these transactions were not compressed, which is correct in a number of situations (see Section 7.4.4.5, “Binary Log Transaction Compression”).

* `TRANSACTION_COUNTER`

  The number of transactions written to this log type with this compression type.

* `COMPRESSED_BYTES`

  The total number of bytes that were compressed and then written to this log type with this compression type, counted after compression.

* `UNCOMPRESSED_BYTES`

  The total number of bytes before compression for this log type and this compression type.

* `COMPRESSION_PERCENTAGE`

  The compression ratio for this log type and this compression type, expressed as a percentage.

* `FIRST_TRANSACTION_ID`

  The ID of the first transaction that was written to this log type with this compression type.

* `FIRST_TRANSACTION_COMPRESSED_BYTES`

  The total number of bytes that were compressed and then written to the log for the first transaction, counted after compression.

* `FIRST_TRANSACTION_UNCOMPRESSED_BYTES`

  The total number of bytes before compression for the first transaction.

* `FIRST_TRANSACTION_TIMESTAMP`

  The timestamp when the first transaction was written to the log.

* `LAST_TRANSACTION_ID`

  The ID of the most recent transaction that was written to this log type with this compression type.

* `LAST_TRANSACTION_COMPRESSED_BYTES`

  The total number of bytes that were compressed and then written to the log for the most recent transaction, counted after compression.

* `LAST_TRANSACTION_UNCOMPRESSED_BYTES`

  The total number of bytes before compression for the most recent transaction.

* `LAST_TRANSACTION_TIMESTAMP`

  The timestamp when the most recent transaction was written to the log.

The `binary_log_transaction_compression_stats` table has no indexes.

`TRUNCATE TABLE` is permitted for the `binary_log_transaction_compression_stats` table.
