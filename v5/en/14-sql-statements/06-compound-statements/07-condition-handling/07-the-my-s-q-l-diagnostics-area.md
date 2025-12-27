#### 13.6.7.7 The MySQL Diagnostics Area

SQL statements produce diagnostic information that populates the diagnostics area. Standard SQL has a diagnostics area stack, containing a diagnostics area for each nested execution context. Standard SQL also supports [`GET STACKED DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") syntax for referring to the second diagnostics area during condition handler execution. MySQL supports the `STACKED` keyword as of MySQL 5.7. Before that, MySQL does not support `STACKED`; there is a single diagnostics area containing information from the most recent statement that wrote to it.

The following discussion describes the structure of the diagnostics area in MySQL, the information items recognized by MySQL, how statements clear and set the diagnostics area, and how diagnostics areas are pushed to and popped from the stack.

* [Diagnostics Area Structure](diagnostics-area.html#diagnostics-area-structure "Diagnostics Area Structure")
* [Diagnostics Area Information Items](diagnostics-area.html#diagnostics-area-information-items "Diagnostics Area Information Items")
* [How the Diagnostics Area is Cleared and Populated](diagnostics-area.html#diagnostics-area-populating "How the Diagnostics Area is Cleared and Populated")
* [How the Diagnostics Area Stack Works](diagnostics-area.html#diagnostics-area-stack "How the Diagnostics Area Stack Works")
* [Diagnostics Area-Related System Variables](diagnostics-area.html#diagnostics-area-system-variables "Diagnostics Area-Related System Variables")

##### Diagnostics Area Structure

The diagnostics area contains two kinds of information:

* Statement information, such as the number of conditions that occurred or the affected-rows count.

* Condition information, such as the error code and message. If a statement raises multiple conditions, this part of the diagnostics area has a condition area for each one. If a statement raises no conditions, this part of the diagnostics area is empty.

For a statement that produces three conditions, the diagnostics area contains statement and condition information like this:

```sql
Statement information:
  row count
  ... other statement information items ...
Condition area list:
  Condition area 1:
    error code for condition 1
    error message for condition 1
    ... other condition information items ...
  Condition area 2:
    error code for condition 2:
    error message for condition 2
    ... other condition information items ...
  Condition area 3:
    error code for condition 3
    error message for condition 3
    ... other condition information items ...
```

##### Diagnostics Area Information Items

The diagnostics area contains statement and condition information items. Numeric items are integers. The character set for character items is UTF-8. No item can be `NULL`. If a statement or condition item is not set by a statement that populates the diagnostics area, its value is 0 or the empty string, depending on the item data type.

The statement information part of the diagnostics area contains these items:

* `NUMBER`: An integer indicating the number of condition areas that have information.

* `ROW_COUNT`: An integer indicating the number of rows affected by the statement. `ROW_COUNT` has the same value as the [`ROW_COUNT()`](information-functions.html#function_row-count) function (see [Section 12.15, “Information Functions”](information-functions.html "12.15 Information Functions")).

The condition information part of the diagnostics area contains a condition area for each condition. Condition areas are numbered from 1 to the value of the `NUMBER` statement condition item. If `NUMBER` is 0, there are no condition areas.

Each condition area contains the items in the following list. All items are standard SQL except `MYSQL_ERRNO`, which is a MySQL extension. The definitions apply for conditions generated other than by a signal (that is, by a [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") or [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") statement). For nonsignal conditions, MySQL populates only those condition items not described as always empty. The effects of signals on the condition area are described later.

* `CLASS_ORIGIN`: A string containing the class of the `RETURNED_SQLSTATE` value. If the `RETURNED_SQLSTATE` value begins with a class value defined in SQL standards document ISO 9075-2 (section 24.1, SQLSTATE), `CLASS_ORIGIN` is `'ISO 9075'`. Otherwise, `CLASS_ORIGIN` is `'MySQL'`.

* `SUBCLASS_ORIGIN`: A string containing the subclass of the `RETURNED_SQLSTATE` value. If `CLASS_ORIGIN` is `'ISO 9075'` or `RETURNED_SQLSTATE` ends with `'000'`, `SUBCLASS_ORIGIN` is `'ISO 9075'`. Otherwise, `SUBCLASS_ORIGIN` is `'MySQL'`.

* `RETURNED_SQLSTATE`: A string that indicates the `SQLSTATE` value for the condition.

* `MESSAGE_TEXT`: A string that indicates the error message for the condition.

* `MYSQL_ERRNO`: An integer that indicates the MySQL error code for the condition.

* `CONSTRAINT_CATALOG`, `CONSTRAINT_SCHEMA`, `CONSTRAINT_NAME`: Strings that indicate the catalog, schema, and name for a violated constraint. They are always empty.

* `CATALOG_NAME`, `SCHEMA_NAME`, `TABLE_NAME`, `COLUMN_NAME`: Strings that indicate the catalog, schema, table, and column related to the condition. They are always empty.

* `CURSOR_NAME`: A string that indicates the cursor name. This is always empty.

For the `RETURNED_SQLSTATE`, `MESSAGE_TEXT`, and `MYSQL_ERRNO` values for particular errors, see [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html).

If a [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") (or [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement")) statement populates the diagnostics area, its `SET` clause can assign to any condition information item except `RETURNED_SQLSTATE` any value that is legal for the item data type. [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") also sets the `RETURNED_SQLSTATE` value, but not directly in its `SET` clause. That value comes from the [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement `SQLSTATE` argument.

[`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") also sets statement information items. It sets `NUMBER` to 1. It sets `ROW_COUNT` to −1 for errors and 0 otherwise.

##### How the Diagnostics Area is Cleared and Populated

Nondiagnostic SQL statements populate the diagnostics area automatically, and its contents can be set explicitly with the [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") and [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") statements. The diagnostics area can be examined with [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") to extract specific items, or with [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") or [`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement") to see conditions or errors.

SQL statements clear and set the diagnostics area as follows:

* When the server starts executing a statement after parsing it, it clears the diagnostics area for nondiagnostic statements. Diagnostic statements do not clear the diagnostics area. These statements are diagnostic:

  + [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement")
  + [`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement")
  + [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement")
* If a statement raises a condition, the diagnostics area is cleared of conditions that belong to earlier statements. The exception is that conditions raised by [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") and [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") are added to the diagnostics area without clearing it.

Thus, even a statement that does not normally clear the diagnostics area when it begins executing clears it if the statement raises a condition.

The following example shows the effect of various statements on the diagnostics area, using [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") to display information about conditions stored there.

This [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") statement clears the diagnostics area and populates it when the condition occurs:

```sql
mysql> DROP TABLE IF EXISTS test.no_such_table;
Query OK, 0 rows affected, 1 warning (0.01 sec)

mysql> SHOW WARNINGS;
+-------+------+------------------------------------+
| Level | Code | Message                            |
+-------+------+------------------------------------+
| Note  | 1051 | Unknown table 'test.no_such_table' |
+-------+------+------------------------------------+
1 row in set (0.00 sec)
```

This [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement generates an error, so it clears and populates the diagnostics area:

```sql
mysql> SET @x = @@x;
ERROR 1193 (HY000): Unknown system variable 'x'

mysql> SHOW WARNINGS;
+-------+------+-----------------------------+
| Level | Code | Message                     |
+-------+------+-----------------------------+
| Error | 1193 | Unknown system variable 'x' |
+-------+------+-----------------------------+
1 row in set (0.00 sec)
```

The previous [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement produced a single condition, so 1 is the only valid condition number for [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") at this point. The following statement uses a condition number of 2, which produces a warning that is added to the diagnostics area without clearing it:

```sql
mysql> GET DIAGNOSTICS CONDITION 2 @p = MESSAGE_TEXT;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> SHOW WARNINGS;
+-------+------+------------------------------+
| Level | Code | Message                      |
+-------+------+------------------------------+
| Error | 1193 | Unknown system variable 'xx' |
| Error | 1753 | Invalid condition number     |
+-------+------+------------------------------+
2 rows in set (0.00 sec)
```

Now there are two conditions in the diagnostics area, so the same [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") statement succeeds:

```sql
mysql> GET DIAGNOSTICS CONDITION 2 @p = MESSAGE_TEXT;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @p;
+--------------------------+
| @p                       |
+--------------------------+
| Invalid condition number |
+--------------------------+
1 row in set (0.01 sec)
```

##### How the Diagnostics Area Stack Works

When a push to the diagnostics area stack occurs, the first (current) diagnostics area becomes the second (stacked) diagnostics area and a new current diagnostics area is created as a copy of it. Diagnostics areas are pushed to and popped from the stack under the following circumstances:

* Execution of a stored program

  A push occurs before the program executes and a pop occurs afterward. If the stored program ends while handlers are executing, there can be more than one diagnostics area to pop; this occurs due to an exception for which there are no appropriate handlers or due to [`RETURN`](return.html "13.6.5.7 RETURN Statement") in the handler.

  Any warning or error conditions in the popped diagnostics areas then are added to the current diagnostics area, except that, for triggers, only errors are added. When the stored program ends, the caller sees these conditions in its current diagonstics area.

* Execution of a condition handler within a stored program

  When a push occurs as a result of condition handler activation, the stacked diagnostics area is the area that was current within the stored program prior to the push. The new now-current diagnostics area is the handler's current diagnostics area. [`GET [CURRENT] DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") and [`GET STACKED DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") can be used within the handler to access the contents of the current (handler) and stacked (stored program) diagnostics areas. Initially, they return the same result, but statements executing within the handler modify the current diagnostics area, clearing and setting its contents according to the normal rules (see [How the Diagnostics Area is Cleared and Populated](diagnostics-area.html#diagnostics-area-populating "How the Diagnostics Area is Cleared and Populated")). The stacked diagnostics area cannot be modified by statements executing within the handler except [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement").

  If the handler executes successfully, the current (handler) diagnostics area is popped and the stacked (stored program) diagnostics area again becomes the current diagnostics area. Conditions added to the handler diagnostics area during handler execution are added to the current diagnostics area.

* Execution of [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement")

  The [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") statement passes on the error condition information that is available during execution of a condition handler within a compound statement inside a stored program. [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") may change some or all information before passing it on, modifying the diagnostics stack as described in [Section 13.6.7.4, “RESIGNAL Statement”](resignal.html "13.6.7.4 RESIGNAL Statement").

##### Diagnostics Area-Related System Variables

Certain system variables control or are related to some aspects of the diagnostics area:

* [`max_error_count`](server-system-variables.html#sysvar_max_error_count) controls the number of condition areas in the diagnostics area. If more conditions than this occur, MySQL silently discards information for the excess conditions. (Conditions added by [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") are always added, with older conditions being discarded as necessary to make room.)

* [`warning_count`](server-system-variables.html#sysvar_warning_count) indicates the number of conditions that occurred. This includes errors, warnings, and notes. Normally, `NUMBER` and [`warning_count`](server-system-variables.html#sysvar_warning_count) are the same. However, as the number of conditions generated exceeds [`max_error_count`](server-system-variables.html#sysvar_max_error_count), the value of [`warning_count`](server-system-variables.html#sysvar_warning_count) continues to rise whereas `NUMBER` remains capped at [`max_error_count`](server-system-variables.html#sysvar_max_error_count) because no additional conditions are stored in the diagnostics area.

* [`error_count`](server-system-variables.html#sysvar_error_count) indicates the number of errors that occurred. This value includes “not found” and exception conditions, but excludes warnings and notes. Like [`warning_count`](server-system-variables.html#sysvar_warning_count), its value can exceed [`max_error_count`](server-system-variables.html#sysvar_max_error_count).

* If the [`sql_notes`](server-system-variables.html#sysvar_sql_notes) system variable is set to 0, notes are not stored and do not increment [`warning_count`](server-system-variables.html#sysvar_warning_count).

Example: If [`max_error_count`](server-system-variables.html#sysvar_max_error_count) is 10, the diagnostics area can contain a maximum of 10 condition areas. Suppose that a statement raises 20 conditions, 12 of which are errors. In that case, the diagnostics area contains the first 10 conditions, `NUMBER` is 10, [`warning_count`](server-system-variables.html#sysvar_warning_count) is 20, and [`error_count`](server-system-variables.html#sysvar_error_count) is 12.

Changes to the value of [`max_error_count`](server-system-variables.html#sysvar_max_error_count) have no effect until the next attempt to modify the diagnostics area. If the diagnostics area contains 10 condition areas and [`max_error_count`](server-system-variables.html#sysvar_max_error_count) is set to 5, that has no immediate effect on the size or content of the diagnostics area.
