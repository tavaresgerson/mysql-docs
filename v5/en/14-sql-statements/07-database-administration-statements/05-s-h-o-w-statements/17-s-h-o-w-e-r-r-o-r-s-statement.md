#### 13.7.5.17 SHOW ERRORS Statement

```sql
SHOW ERRORS [LIMIT [offset,] row_count]
SHOW COUNT(*) ERRORS
```

[`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement") is a diagnostic statement that is similar to [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement"), except that it displays information only for errors, rather than for errors, warnings, and notes.

The `LIMIT` clause has the same syntax as for the [`SELECT`](select.html "13.2.9 SELECT Statement") statement. See [Section 13.2.9, “SELECT Statement”](select.html "13.2.9 SELECT Statement").

The [`SHOW COUNT(*) ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement") statement displays the number of errors. You can also retrieve this number from the [`error_count`](server-system-variables.html#sysvar_error_count) variable:

```sql
SHOW COUNT(*) ERRORS;
SELECT @@error_count;
```

[`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement") and [`error_count`](server-system-variables.html#sysvar_error_count) apply only to errors, not warnings or notes. In other respects, they are similar to [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") and [`warning_count`](server-system-variables.html#sysvar_warning_count). In particular, [`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement") cannot display information for more than [`max_error_count`](server-system-variables.html#sysvar_max_error_count) messages, and [`error_count`](server-system-variables.html#sysvar_error_count) can exceed the value of [`max_error_count`](server-system-variables.html#sysvar_max_error_count) if the number of errors exceeds [`max_error_count`](server-system-variables.html#sysvar_max_error_count).

For more information, see [Section 13.7.5.40, “SHOW WARNINGS Statement”](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement").
