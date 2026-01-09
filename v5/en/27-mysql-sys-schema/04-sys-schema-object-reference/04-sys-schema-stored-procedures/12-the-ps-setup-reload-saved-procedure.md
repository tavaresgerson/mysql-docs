#### 26.4.4.12 The ps_setup_reload_saved() Procedure

Reloads a Performance Schema configuration saved earlier within the same session using `ps_setup_save()` Procedure"). For more information, see the description of `ps_setup_save()` Procedure").

This procedure disables binary logging during its execution by manipulating the session value of the `sql_log_bin` system variable. That is a restricted operation, so the procedure requires privileges sufficient to set restricted session variables. See Section 5.1.8.1, “System Variable Privileges”.

##### Parameters

None.
