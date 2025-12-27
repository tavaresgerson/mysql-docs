#### 7.5.7.2 MLE Component Status and Session Information

Once the MLE component is installed, you can obtain information about the component as shown here:

```
mysql> SHOW STATUS LIKE 'mle%';
+-------------------------+---------------+
| Variable_name           | Value         |
+-------------------------+---------------+
| mle_heap_status         | Not Allocated |
| mle_languages_supported | JavaScript    |
| mle_memory_used         | 0             |
| mle_status              | Inactive      |
+-------------------------+---------------+
4 rows in set (0.01 sec)
```

As with other MySQL status variables, you can also access those shown here by selecting from the Performance Schema `global_status` table.

The MLE component's status is indicated by the `mle_status` status variable. This remains `Inactive` until a user creates or invokes a stored procedure or function using a language supported by MLE, at which time it becomes (very briefly) `Initializing` or (more usually) `Active`. It remains `Active` until the server is shutting down or restarting, at which the value is `Pending shutdown`.

You can obtain status information and console output from an MLE stored program using the loadable function `mle_session_state()` supplied by the MLE component. See the description of this function for more information.

`mle_languages_supported` shows a list of languages supported by this instance of the component; in MySQL 9.5, this is always `JavaScript`.

See Section 7.5.7.3, “MLE Component Memory and Thread Usage”, for information about status variables relating to MLE component memory usage.

You can also obtain information about MLE sessions from system status variables. The `mle_sessions` status variable provides the number of active MLE sessions. `mle_sessions_max` displays the greatest number of MLE sessions simultaneously active at any one time since the MLE component became active. `mle_session_resets` shows the number of times the session state was cleared by calling `mle_session_reset()`. See the descriptions of these status variables for more information.

Counts of several JavaScript library SQL statements are kept as status variables. These include `Com_create_library`, `Com_drop_library`, `Com_alter_library`, `Com_show_create_library`, and `Com_show_library_status`; these indicate, respectively, the numbers of `CREATE LIBRARY`, `DROP LIBRARY`, `ALTER LIBRARY`, `SHOW CREATE LIBRARY`, and `SHOW LIBRARY STATUS` statements executed. For more information, see Com\_xxx Variables.
