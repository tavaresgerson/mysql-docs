#### 6.4.5.6 Reading Audit Log Files

The audit log plugin supports functions that provide an SQL interface for reading JSON-format audit log files. (This capability does not apply to log files written in other formats.)

When the audit log plugin initializes and is configured for JSON logging, it uses the directory containing the current audit log file as the location to search for readable audit log files. The plugin determines the file location, base name, and suffix from the value of the [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) system variable, then looks for files with names that match the following pattern, where `[...]` indicates optional file name parts:

```sql
basename[.timestamp].suffix[.gz][.enc]
```

If a file name ends with `.enc`, the file is encrypted and reading its unencrypted contents requires a decryption password obtained from the keyring. For more information about encrypted audit log files, see [Encrypting Audit Log Files](audit-log-logging-configuration.html#audit-log-file-encryption "Encrypting Audit Log Files").

The plugin ignores files that have been renamed manually and do not match the pattern, and files that were encrypted with a password no longer available in the keyring. The plugin opens each remaining candidate file, verifies that the file actually contains [`JSON`](json.html "11.5 The JSON Data Type") audit events, and sorts the files using the timestamps from the first event of each file. The result is a sequence of files that are subject to access using the log-reading functions:

* [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) reads events from the audit log or closes the reading process.

* [`audit_log_read_bookmark()`](audit-log-reference.html#function_audit-log-read-bookmark) returns a bookmark for the most recently written audit log event. This bookmark is suitable for passing to [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) to indicate where to begin reading.

[`audit_log_read()`](audit-log-reference.html#function_audit-log-read) takes an optional [`JSON`](json.html "11.5 The JSON Data Type") string argument, and the result returned from a successful call to either function is a [`JSON`](json.html "11.5 The JSON Data Type") string.

To use the functions to read the audit log, follow these principles:

* Call [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) to read events beginning from a given position or the current position, or to close reading:

  + To initialize an audit log read sequence, pass an argument that indicates the position at which to begin. One way to do so is to pass the bookmark returned by [`audit_log_read_bookmark()`](audit-log-reference.html#function_audit-log-read-bookmark):

    ```sql
    SELECT audit_log_read(audit_log_read_bookmark());
    ```

  + To continue reading from the current position in the sequence, call [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) with no position specified:

    ```sql
    SELECT audit_log_read();
    ```

  + To explicitly close the read sequence, pass a [`JSON`](json.html "11.5 The JSON Data Type") `null` argument:

    ```sql
    SELECT audit_log_read('null');
    ```

    It is unnecessary to close reading explicitly. Reading is closed implicitly when the session ends or a new read sequence is initialized by calling [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) with an argument that indicates the position at which to begin.

* A successful call to [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) to read events returns a [`JSON`](json.html "11.5 The JSON Data Type") string containing an array of audit events:

  + If the final value of the returned array is not a [`JSON`](json.html "11.5 The JSON Data Type") `null` value, there are more events following those just read and [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) can be called again to read more of them.

  + If the final value of the returned array is a [`JSON`](json.html "11.5 The JSON Data Type") `null` value, there are no more events left to be read in the current read sequence.

  Each non-`null` array element is an event represented as a [`JSON`](json.html "11.5 The JSON Data Type") hash. For example:

  ```sql
  [
    {
      "timestamp": "2020-05-18 13:39:33", "id": 0,
      "class": "connection", "event": "connect",
      ...
    },
    {
      "timestamp": "2020-05-18 13:39:33", "id": 1,
      "class": "general", "event": "status",
      ...
    },
    {
      "timestamp": "2020-05-18 13:39:33", "id": 2,
      "class": "connection", "event": "disconnect",
      ...
    },
    null
  ]
  ```

  For more information about the content of JSON-format audit events, see [JSON Audit Log File Format](audit-log-file-formats.html#audit-log-file-json-format "JSON Audit Log File Format").

* An [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) call to read events that does not specify a position produces an error under any of these conditions:

  + A read sequence has not yet been initialized by passing a position to [`audit_log_read()`](audit-log-reference.html#function_audit-log-read).

  + There are no more events left to be read in the current read sequence; that is, [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) previously returned an array ending with a [`JSON`](json.html "11.5 The JSON Data Type") `null` value.

  + The most recent read sequence has been closed by passing a [`JSON`](json.html "11.5 The JSON Data Type") `null` value to [`audit_log_read()`](audit-log-reference.html#function_audit-log-read).

  To read events under those conditions, it is necessary to first initialize a read sequence by calling [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) with an argument that specifies a position.

To specify a position to [`audit_log_read()`](audit-log-reference.html#function_audit-log-read), pass a bookmark, which is a [`JSON`](json.html "11.5 The JSON Data Type") hash containing `timestamp` and `id` elements that uniquely identify a particular event. Here is an example bookmark, obtained by calling the [`audit_log_read_bookmark()`](audit-log-reference.html#function_audit-log-read-bookmark) function:

```sql
mysql> SELECT audit_log_read_bookmark();
+-------------------------------------------------+
| audit_log_read_bookmark()                       |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 21:03:44", "id": 0 } |
+-------------------------------------------------+
```

Passing the current bookmark to [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) initializes event reading beginning at the bookmark position:

```sql
mysql> SELECT audit_log_read(audit_log_read_bookmark());
+-----------------------------------------------------------------------+
| audit_log_read(audit_log_read_bookmark())                             |
+-----------------------------------------------------------------------+
| [ {"timestamp":"2020-05-18 22:41:24","id":0,"class":"connection", ... |
+-----------------------------------------------------------------------+
```

The argument to [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) is optional. If present, it can be a [`JSON`](json.html "11.5 The JSON Data Type") `null` value to close the read sequence, or a [`JSON`](json.html "11.5 The JSON Data Type") hash.

Within a hash argument to [`audit_log_read()`](audit-log-reference.html#function_audit-log-read), items are optional and control aspects of the read operation such as the position at which to begin reading or how many events to read. The following items are significant (other items are ignored):

* `timestamp`, `id`: The position within the audit log of the first event to read. If the position is omitted from the argument, reading continues from the current position. The `timestamp` and `id` items together comprise a bookmark that uniquely identify a particular event. If an [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) argument includes either item, it must include both to completely specify a position or an error occurs.

* `max_array_length`: The maximum number of events to read from the log. If this item is omitted, the default is to read to the end of the log or until the read buffer is full, whichever comes first.

Example arguments accepted by [`audit_log_read()`](audit-log-reference.html#function_audit-log-read):

* Read events starting with the event that has the exact timestamp and event ID:

  ```sql
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0 }')
  ```

* Like the previous example, but read at most 3 events:

  ```sql
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0, "max_array_length": 3 }')
  ```

* Read events from the current position in the read sequence:

  ```sql
  audit_log_read()
  ```

* Read at most 5 events beginning at the current position in the read sequence:

  ```sql
  audit_log_read('{ "max_array_length": 5 }')
  ```

* Close the current read sequence:

  ```sql
  audit_log_read('null')
  ```

To use the binary [`JSON`](json.html "11.5 The JSON Data Type") string with functions that require a nonbinary string (such as functions that manipulate [`JSON`](json.html "11.5 The JSON Data Type") values), perform a conversion to `utf8mb4`. Suppose that a call to obtain a bookmark produces this value:

```sql
mysql> SET @mark := audit_log_read_bookmark();
mysql> SELECT @mark;
+-------------------------------------------------+
| @mark                                           |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 16:10:28", "id": 2 } |
+-------------------------------------------------+
```

Calling [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) with that argument can return multiple events. To limit [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) to reading at most *`N`* events, convert the string to `utf8mb4`, then add to it a `max_array_length` item with that value. For example, to read a single event, modify the string as follows:

```sql
mysql> SET @mark = CONVERT(@mark USING utf8mb4);
mysql> SET @mark := JSON_SET(@mark, '$.max_array_length', 1);
mysql> SELECT @mark;
+----------------------------------------------------------------------+
| @mark                                                                |
+----------------------------------------------------------------------+
| {"id": 2, "timestamp": "2020-05-18 16:10:28", "max_array_length": 1} |
+----------------------------------------------------------------------+
```

The modified string, when passed to [`audit_log_read()`](audit-log-reference.html#function_audit-log-read), produces a result containing at most one event, no matter how many are available.

To read a specific number of events beginning at the current position, pass a [`JSON`](json.html "11.5 The JSON Data Type") hash that includes a `max_array_length` value but no position. This statement invoked repeatedly returns five events each time until no more events are available:

```sql
SELECT audit_log_read('{"max_array_length": 5}');
```

To set a limit on the number of bytes that [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) reads, set the [`audit_log_read_buffer_size`](audit-log-reference.html#sysvar_audit_log_read_buffer_size) system variable. As of MySQL 5.7.23, this variable has a default of 32KB and can be set at runtime. Each client should set its session value of [`audit_log_read_buffer_size`](audit-log-reference.html#sysvar_audit_log_read_buffer_size) appropriately for its use of [`audit_log_read()`](audit-log-reference.html#function_audit-log-read). Prior to MySQL 5.7.23, [`audit_log_read_buffer_size`](audit-log-reference.html#sysvar_audit_log_read_buffer_size) has a default of 1MB, affects all clients, and can be changed only at server startup.

For additional information about audit log-reading functions, see [Audit Log Functions](audit-log-reference.html#audit-log-routines "Audit Log Functions").
