#### 26.4.4.14 The ps\_setup\_save() Procedure

Saves the current Performance Schema configuration. This enables you to alter the configuration temporarily for debugging or other purposes, then restore it to the previous state by invoking the `ps_setup_reload_saved()` Procedure") procedure.

To prevent other simultaneous calls to save the configuration, `ps_setup_save()` Procedure") acquires an advisory lock named `sys.ps_setup_save` by calling the `GET_LOCK()` function. `ps_setup_save()` Procedure") takes a timeout parameter to indicate how many seconds to wait if the lock already exists (which indicates that some other session has a saved configuration outstanding). If the timeout expires without obtaining the lock, `ps_setup_save()` Procedure") fails.

It is intended you call `ps_setup_reload_saved()` Procedure") later within the *same* session as `ps_setup_save()` Procedure") because the configuration is saved in `TEMPORARY` tables. `ps_setup_save()` Procedure") drops the temporary tables and releases the lock. If you end your session without invoking `ps_setup_save()` Procedure"), the tables and lock disappear automatically.

This procedure disables binary logging during its execution by manipulating the session value of the `sql_log_bin` system variable. That is a restricted operation, so the procedure requires privileges sufficient to set restricted session variables. See Section 5.1.8.1, “System Variable Privileges”.

##### Parameters

* `in_timeout INT`: How many seconds to wait to obtain the `sys.ps_setup_save` lock. A negative timeout value means infinite timeout.

##### Example

```sql
mysql> CALL sys.ps_setup_save(10);

... make Performance Schema configuration changes ...

mysql> CALL sys.ps_setup_reload_saved();
```
