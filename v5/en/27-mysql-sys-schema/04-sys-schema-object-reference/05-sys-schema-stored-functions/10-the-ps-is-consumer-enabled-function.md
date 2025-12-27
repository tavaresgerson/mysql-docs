#### 26.4.5.10 The ps\_is\_consumer\_enabled() Function

Returns `YES` or `NO` to indicate whether a given Performance Schema consumer is enabled, or `NULL` if the argument is `NULL`. If the argument is not a valid consumer name, an error occurs. (Prior to MySQL 5.7.28, the function returns `NULL` if the argument is not a valid consumer name.)

This function accounts for the consumer hierarchy, so a consumer is not considered enabled unless all consumers on which depends are also enabled. For information about the consumer hierarchy, see Section 25.4.7, “Pre-Filtering by Consumer”.

##### Parameters

* `in_consumer VARCHAR(64)`: The name of the consumer to check.

##### Return Value

An `ENUM('YES','NO')` value.

##### Example

```sql
mysql> SELECT sys.ps_is_consumer_enabled('thread_instrumentation');
+------------------------------------------------------+
| sys.ps_is_consumer_enabled('thread_instrumentation') |
+------------------------------------------------------+
| YES                                                  |
+------------------------------------------------------+
```
