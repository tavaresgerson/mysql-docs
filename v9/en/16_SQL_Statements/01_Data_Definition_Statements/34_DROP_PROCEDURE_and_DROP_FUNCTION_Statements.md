### 15.1.34 DROP PROCEDURE and DROP FUNCTION Statements

```
DROP {PROCEDURE | FUNCTION} [IF EXISTS] sp_name
```

These statements are used to drop a stored routine (a stored
procedure or function). That is, the specified routine is removed
from the server. (`DROP FUNCTION` is also used to
drop loadable functions; see
[Section 15.7.4.2, “DROP FUNCTION Statement for Loadable Functions”](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions").)

To drop a stored routine, you must have the
[`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) privilege for it. (If
the [`automatic_sp_privileges`](server-system-variables.html#sysvar_automatic_sp_privileges)
system variable is enabled, that privilege and
[`EXECUTE`](privileges-provided.html#priv_execute) are granted automatically
to the routine creator when the routine is created and dropped
from the creator when the routine is dropped. See
[Section 27.2.2, “Stored Routines and MySQL Privileges”](stored-routines-privileges.html "27.2.2 Stored Routines and MySQL Privileges").)

In addition, if the definer of the routine has the
[`SYSTEM_USER`](privileges-provided.html#priv_system-user) privilege, the user
dropping it must also have this privilege.

The `IF EXISTS` clause is a MySQL extension. It
prevents an error from occurring if the procedure or function does
not exist. A warning is produced that can be viewed with
[`SHOW WARNINGS`](show-warnings.html "15.7.7.43 SHOW WARNINGS Statement").

[`DROP FUNCTION`](drop-function.html "15.1.30 DROP FUNCTION Statement") is also used to drop
loadable functions (see [Section 15.7.4.2, “DROP FUNCTION Statement for Loadable Functions”](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions")).