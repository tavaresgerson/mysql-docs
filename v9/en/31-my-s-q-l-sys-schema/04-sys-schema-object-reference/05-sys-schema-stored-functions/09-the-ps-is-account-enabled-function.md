#### 30.4.5.9 The ps\_is\_account\_enabled() Function

Returns `YES` or `NO` to indicate whether Performance Schema instrumentation for a given account is enabled.

##### Parameters

* `in_host VARCHAR(60)`: The host name of the account to check.

* `in_user VARCHAR(32)`: The user name of the account to check.

##### Return Value

An `ENUM('YES','NO')` value.

##### Example

```
mysql> SELECT sys.ps_is_account_enabled('localhost', 'root');
+------------------------------------------------+
| sys.ps_is_account_enabled('localhost', 'root') |
+------------------------------------------------+
| YES                                            |
+------------------------------------------------+
```
