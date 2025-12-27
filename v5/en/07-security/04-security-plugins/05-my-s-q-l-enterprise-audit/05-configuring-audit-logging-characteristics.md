#### 6.4.5.5 Configuring Audit Logging Characteristics

This section describes how to configure audit logging characteristics, such as the file to which the audit log plugin writes events, the format of written events, whether to enable log file compression and encryption, and space management.

* [Naming Conventions for Audit Log Files](audit-log-logging-configuration.html#audit-log-file-name "Naming Conventions for Audit Log Files")
* [Selecting Audit Log File Format](audit-log-logging-configuration.html#audit-log-file-format "Selecting Audit Log File Format")
* [Compressing Audit Log Files](audit-log-logging-configuration.html#audit-log-file-compression "Compressing Audit Log Files")
* [Encrypting Audit Log Files](audit-log-logging-configuration.html#audit-log-file-encryption "Encrypting Audit Log Files")
* [Manually Uncompressing and Decrypting Audit Log Files](audit-log-logging-configuration.html#audit-log-file-uncompression-decryption "Manually Uncompressing and Decrypting Audit Log Files")
* [Space Management of Audit Log Files](audit-log-logging-configuration.html#audit-log-space-management "Space Management of Audit Log Files")
* [Write Strategies for Audit Logging](audit-log-logging-configuration.html#audit-log-strategy "Write Strategies for Audit Logging")

For additional information about the functions and system variables that affect audit logging, see [Audit Log Functions](audit-log-reference.html#audit-log-routines "Audit Log Functions"), and [Audit Log Options and Variables](audit-log-reference.html#audit-log-options-variables "Audit Log Options and Variables").

The audit log plugin can also control which audited events are written to the audit log file, based on event content or the account from which events originate. See [Section 6.4.5.7, “Audit Log Filtering”](audit-log-filtering.html "6.4.5.7 Audit Log Filtering").

##### Naming Conventions for Audit Log Files

To configure the audit log file name, set the [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) system variable at server startup. The default name is `audit.log` in the server data directory. For best security, write the audit log to a directory accessible only to the MySQL server and to users with a legitimate reason to view the log.

As of MySQL 5.7.21, the plugin interprets the [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) value as composed of an optional leading directory name, a base name, and an optional suffix. If compression or encryption are enabled, the effective file name (the name actually used to create the log file) differs from the configured file name because it has additional suffixes:

* If compression is enabled, the plugin adds a suffix of `.gz`.

* If encryption is enabled, the plugin adds a suffix of `.enc`. The audit log plugin stores the encryption password in the keyring (see [Encrypting Audit Log Files](audit-log-logging-configuration.html#audit-log-file-encryption "Encrypting Audit Log Files").

The effective audit log file name is the name resulting from the addition of applicable compression and encryption suffixes to the configured file name. For example, if the configured [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) value is `audit.log`, the effective file name is one of the values shown in the following table.

<table summary="audit_log effective file names for various combinations of the compression and encryption features."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Enabled Features</th> <th>Effective File Name</th> </tr></thead><tbody><tr> <td>No compression or encryption</td> <td><code class="filename">audit.log</code></td> </tr><tr> <td>Compression</td> <td><code class="filename">audit.log.gz</code></td> </tr><tr> <td>Encryption</td> <td><code class="filename">audit.log.enc</code></td> </tr><tr> <td>Compression, encryption</td> <td><code class="filename">audit.log.gz.enc</code></td> </tr></tbody></table>

Prior to MySQL 5.7.21, the configured and effective log file names are the same. For example, if the configured [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) value is `audit.log`, the audit log plugin writes to `audit.log`.

The audit log plugin performs certain actions during initialization and termination based on the effective audit log file name:

As of MySQL 5.7.21:

* During initialization, the plugin checks whether a file with the audit log file name already exists and renames it if so. (In this case, the plugin assumes that the previous server invocation exited unexpectedly with the audit log plugin running.) The plugin then writes to a new empty audit log file.

* During termination, the plugin renames the audit log file.
* File renaming (whether during plugin initialization or termination) occurs according to the usual rules for automatic size-based log file rotation; see [Manual Audit Log File Rotation](audit-log-logging-configuration.html#audit-log-manual-rotation "Manual Audit Log File Rotation").

Prior to MySQL 5.7.21, only the XML log formats are available and the plugin performs rudimentary integrity checking:

* During initialization, the plugin checks whether the file ends with an `</AUDIT>` tag and truncates the tag before writing any `<AUDIT_RECORD>` elements. If the log file exists but does not end with `</AUDIT>` or the `</AUDIT>` tag cannot be truncated, the plugin considers the file malformed and renames it. (Such renaming can occur if the server exits unexpectedly with the audit log plugin running.) The plugin then writes to a new empty audit log file.

* At termination, no file renaming occurs.
* When renaming occurs at plugin initialization, the renamed file has `.corrupted`, a timestamp, and `.xml` added to the end. For example, if the file name is `audit.log`, the plugin renames it to a value such as `audit.log.corrupted.15081807937726520.xml`. The timestamp value is similar to a Unix timestamp, with the last 7 digits representing the fractional second part. For information about interpreting the timestamp, see [Space Management of Audit Log Files](audit-log-logging-configuration.html#audit-log-space-management "Space Management of Audit Log Files").

##### Selecting Audit Log File Format

To configure the audit log file format, set the [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format) system variable at server startup. These formats are available:

* `NEW`: New-style XML format. This is the default.

* `OLD`: Old-style XML format.
* `JSON`: JSON format.

For details about each format, see [Section 6.4.5.4, “Audit Log File Formats”](audit-log-file-formats.html "6.4.5.4 Audit Log File Formats").

If you change [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format), it is recommended that you also change [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file). For example, if you set [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format) to `JSON`, set [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) to `audit.json`. Otherwise, newer log files will have a different format than older files, but they will all have the same base name with nothing to indicate when the format changed.

Note

Prior to MySQL 5.7.21, changing the value of [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format) can result in writing log entries in one format to an existing log file that contains entries in a different format. To avoid this issue, use the following procedure:

1. Stop the server.
2. Either change the value of the [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) system variable so the plugin writes to a different file, or rename the current audit log file manually.

3. Restart the server with the new value of [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format). The audit log plugin creates a new log file and writes entries to it in the selected format.

##### Compressing Audit Log Files

Audit log file compression is available as of MySQL 5.7.21. Compression can be enabled for any log format.

To configure audit log file compression, set the [`audit_log_compression`](audit-log-reference.html#sysvar_audit_log_compression) system variable at server startup. Permitted values are `NONE` (no compression; the default) and `GZIP` (GNU Zip compression).

If both compression and encryption are enabled, compression occurs before encryption. To recover the original file manually, first decrypt it, then uncompress it. See [Manually Uncompressing and Decrypting Audit Log Files](audit-log-logging-configuration.html#audit-log-file-uncompression-decryption "Manually Uncompressing and Decrypting Audit Log Files").

##### Encrypting Audit Log Files

Audit log file encryption is available as of MySQL 5.7.21. Encryption can be enabled for any log format. Encryption is based on a user-defined password (with the exception of the initial password, which the audit log plugin generates). To use this feature, the MySQL keyring must be enabled because audit logging uses it for password storage. Any keyring plugin can be used; for instructions, see [Section 6.4.4, “The MySQL Keyring”](keyring.html "6.4.4 The MySQL Keyring").

To configure audit log file encryption, set the [`audit_log_encryption`](audit-log-reference.html#sysvar_audit_log_encryption) system variable at server startup. Permitted values are `NONE` (no encryption; the default) and `AES` (AES-256-CBC cipher encryption).

To set or get an encryption password at runtime, use these audit log functions:

* To set the current encryption password, invoke [`audit_log_encryption_password_set()`](audit-log-reference.html#function_audit-log-encryption-password-set). This function stores the new password in the keyring. If encryption is enabled, it also performs a log file rotation operation that renames the current log file, and begins a new log file encrypted with the password. File renaming occurs according to the usual rules for automatic size-based log file rotation; see [Manual Audit Log File Rotation](audit-log-logging-configuration.html#audit-log-manual-rotation "Manual Audit Log File Rotation").

  Previously written audit log files are not re-encrypted with the new password. Keep a record of the previous password should you need to decrypt those files manually.

* To get the current encryption password, invoke [`audit_log_encryption_password_get()`](audit-log-reference.html#function_audit-log-encryption-password-get), which retrieves the password from the keyring.

For additional information about audit log encryption functions, see [Audit Log Functions](audit-log-reference.html#audit-log-routines "Audit Log Functions").

When the audit log plugin initializes, if it finds that log file encryption is enabled, it checks whether the keyring contains an audit log encryption password. If not, the plugin automatically generates a random initial encryption password and stores it in the keyring. To discover this password, invoke [`audit_log_encryption_password_get()`](audit-log-reference.html#function_audit-log-encryption-password-get).

If both compression and encryption are enabled, compression occurs before encryption. To recover the original file manually, first decrypt it, then uncompress it. See [Manually Uncompressing and Decrypting Audit Log Files](audit-log-logging-configuration.html#audit-log-file-uncompression-decryption "Manually Uncompressing and Decrypting Audit Log Files").

##### Manually Uncompressing and Decrypting Audit Log Files

Audit log files can be uncompressed and decrypted using standard tools. This should be done only for log files that have been closed (archived) and are no longer in use, not for the log file that the audit log plugin is currently writing. You can recognize archived log files because they have been renamed by the audit log plugin to include a timestamp in the file name just after the base name.

For this discussion, assume that [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) is set to `audit.log`. In that case, an archived audit log file has one of the names shown in the following table.

<table summary="audit_log archived file names for various combinations of the compression and encryption features."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Enabled Features</th> <th>Archived File Name</th> </tr></thead><tbody><tr> <td>No compression or encryption</td> <td><code class="filename">audit.<em class="replaceable"><code>timestamp</code></em>.log</code></td> </tr><tr> <td>Compression</td> <td><code class="filename">audit.<em class="replaceable"><code>timestamp</code></em>.log.gz</code></td> </tr><tr> <td>Encryption</td> <td><code class="filename">audit.<em class="replaceable"><code>timestamp</code></em>.log.enc</code></td> </tr><tr> <td>Compression, encryption</td> <td><code class="filename">audit.<em class="replaceable"><code>timestamp</code></em>.log.gz.enc</code></td> </tr></tbody></table>

To uncompress a compressed log file manually, use **gunzip**, **gzip -d**, or equivalent command. For example:

```sql
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

To decrypt an encrypted log file manually, use the **openssl** command. For example:

```sql
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.enc
    -out audit.timestamp.log
```

If both compression and encryption are enabled for audit logging, compression occurs before encryption. In this case, the file name has `.gz` and `.enc` suffixes added, corresponding to the order in which those operations occur. To recover the original file manually, perform the operations in reverse. That is, first decrypt the file, then uncompress it:

```sql
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.gz.enc
    -out audit.timestamp.log.gz
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

##### Space Management of Audit Log Files

The audit log file has the potential to grow quite large and consume a great deal of disk space. To manage the space used, log rotation can be employed. This involves rotating the current log file by renaming it, then opening a new current log file using the original name. Rotation can be performed manually, or configured to occur automatically.

To configure audit log file space management, use the following system variables:

* If [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) is 0 (the default), automatic log file rotation is disabled:

  + No rotation occurs unless performed manually.
  + To rotate the current file, manually rename it, then enable [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush) to close it and open a new current log file using the original name; see [Manual Audit Log File Rotation](audit-log-logging-configuration.html#audit-log-manual-rotation "Manual Audit Log File Rotation").

* If [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) is greater than 0, automatic audit log file rotation is enabled:

  + Automatic rotation occurs when a write to the current log file causes its size to exceed the [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) value, as well as under certain other conditions; see [Automatic Audit Log File Rotation](audit-log-logging-configuration.html#audit-log-automatic-rotation "Automatic Audit Log File Rotation"). When rotation occurs, the audit log plugin renames the current log file and opens a new current log file using the original name.

  + With automatic rotation enabled, [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush) has no effect.

Note

For JSON-format log files, rotation also occurs when the value of the [`audit_log_format_unix_timestamp`](audit-log-reference.html#sysvar_audit_log_format_unix_timestamp) system variable is changed at runtime. However, this does not occur for space-management purposes, but rather so that, for a given JSON-format log file, all records in the file either do or do not include the `time` field.

Note

Rotated (renamed) log files are not removed automatically. For example, with size-based log file rotation, renamed log files have unique names and accumulate indefinitely. They do not rotate off the end of the name sequence. To avoid excessive use of space, remove old files periodically, backing them up first as necessary.

The following sections describe log file rotation in greater detail.

* [Manual Audit Log File Rotation](audit-log-logging-configuration.html#audit-log-manual-rotation "Manual Audit Log File Rotation")
* [Automatic Audit Log File Rotation](audit-log-logging-configuration.html#audit-log-automatic-rotation "Automatic Audit Log File Rotation")

###### Manual Audit Log File Rotation

If [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) is 0 (the default), no log rotation occurs unless performed manually. In this case, the audit log plugin closes and reopens the log file when the [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush) value changes from disabled to enabled. Log file renaming must be done externally to the server. Suppose that the log file name is `audit.log` and you want to maintain the three most recent log files, cycling through the names `audit.log.1` through `audit.log.3`. On Unix, perform rotation manually like this:

1. From the command line, rename the current log files:

   ```sql
   mv audit.log.2 audit.log.3
   mv audit.log.1 audit.log.2
   mv audit.log audit.log.1
   ```

   This strategy overwrites the current `audit.log.3` contents, placing a bound on the number of archived log files and the space they use.

2. At this point, the plugin is still writing to the current log file, which has been renamed to `audit.log.1`. Connect to the server and flush the log file so the plugin closes it and reopens a new `audit.log` file:

   ```sql
   SET GLOBAL audit_log_flush = ON;
   ```

   [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush) is special in that its value remains `OFF` so that you need not disable it explicitly before enabling it again to perform another flush.

Note

For JSON-format logging, renaming audit log files manually makes them unavailable to the log-reading functions because the audit log plugin can no longer determine that they are part of the log file sequence (see [Section 6.4.5.6, “Reading Audit Log Files”](audit-log-file-reading.html "6.4.5.6 Reading Audit Log Files")). Consider setting [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) greater than 0 to use size-based rotation instead.

###### Automatic Audit Log File Rotation

If [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) is greater than 0, setting [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush) has no effect. Instead, whenever a write to the current log file causes its size to exceed the [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) value, the audit log plugin automatically renames the current log file and opens a new current log file using the original name.

Automatic size-based rotation also occurs under these conditions:

* During plugin initialization, if a file with the audit log file name already exists (see [Naming Conventions for Audit Log Files](audit-log-logging-configuration.html#audit-log-file-name "Naming Conventions for Audit Log Files")).

* During plugin termination.
* When the [`audit_log_encryption_password_set()`](audit-log-reference.html#function_audit-log-encryption-password-set) function is called to set the encryption password.

The plugin renames the original file as follows:

* As of MySQL 5.7.21, the renamed file has a timestamp inserted after its base name and before its suffix. For example, if the file name is `audit.log`, the plugin renames it to a value such as `audit.20180115T140633.log`. The timestamp is a UTC value in `YYYYMMDDThhmmss` format. For XML logging, the timestamp indicates rotation time. For JSON logging, the timestamp is that of the last event written to the file.

  If log files are encrypted, the original file name already contains a timestamp indicating the encryption password creation time (see [Naming Conventions for Audit Log Files](audit-log-logging-configuration.html#audit-log-file-name "Naming Conventions for Audit Log Files")). In this case, the file name after rotation contains two timestamps. For example, an encrypted log file named `audit.log.20180110T130749-1.enc` is renamed to a value such as `audit.20180115T140633.log.20180110T130749-1.enc`.

* Prior to MySQL 5.7.21, the renamed file has a timestamp and `.xml` added to the end. For example, if the file name is `audit.log`, the plugin renames it to a value such as `audit.log.15159344437726520.xml`. The timestamp value is similar to a Unix timestamp, with the last 7 digits representing the fractional second part. By inserting a decimal point, the value can be interpreted using the [`FROM_UNIXTIME()`](date-and-time-functions.html#function_from-unixtime) function:

  ```sql
  mysql> SELECT FROM_UNIXTIME(1515934443.7726520);
  +-----------------------------------+
  | FROM_UNIXTIME(1515934443.7726520) |
  +-----------------------------------+
  | 2018-01-14 06:54:03.772652        |
  +-----------------------------------+
  ```

##### Write Strategies for Audit Logging

The audit log plugin can use any of several strategies for log writes. Regardless of strategy, logging occurs on a best-effort basis, with no guarantee of consistency.

To specify a write strategy, set the [`audit_log_strategy`](audit-log-reference.html#sysvar_audit_log_strategy) system variable at server startup. By default, the strategy value is `ASYNCHRONOUS` and the plugin logs asynchronously to a buffer, waiting if the buffer is full. You can tell the plugin not to wait (`PERFORMANCE`) or to log synchronously, either using file system caching (`SEMISYNCHRONOUS`) or forcing output with a `sync()` call after each write request (`SYNCHRONOUS`).

For asynchronous write strategy, the [`audit_log_buffer_size`](audit-log-reference.html#sysvar_audit_log_buffer_size) system variable is the buffer size in bytes. Set this variable at server startup to change the buffer size. The plugin uses a single buffer, which it allocates when it initializes and removes when it terminates. The plugin does not allocate this buffer for nonasynchronous write strategies.

Asynchronous logging strategy has these characteristics:

* Minimal impact on server performance and scalability.
* Blocking of threads that generate audit events for the shortest possible time; that is, time to allocate the buffer plus time to copy the event to the buffer.

* Output goes to the buffer. A separate thread handles writes from the buffer to the log file.

With asynchronous logging, the integrity of the log file may be compromised if a problem occurs during a write to the file or if the plugin does not shut down cleanly (for example, in the event that the server host exits unexpectedly). To reduce this risk, set [`audit_log_strategy`](audit-log-reference.html#sysvar_audit_log_strategy) to use synchronous logging.

A disadvantage of `PERFORMANCE` strategy is that it drops events when the buffer is full. For a heavily loaded server, the audit log may have events missing.
