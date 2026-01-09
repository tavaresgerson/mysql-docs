#### 6.4.5.9 Disabling Audit Logging

The [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable) variable, introduced in MySQL 5.7.37, permits disabling audit logging for all connecting and connected sessions. The [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable) variable can be set in a MySQL Server option file, in a command-line startup string, or at runtime using a [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement; for example:

```sql
SET GLOBAL audit_log_disable = true;
```

Setting [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable) to true disables the audit log plugin. The plugin is re-enabled when [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable) is set back to `false`, which is the default setting.

Starting the audit log plugin with [`audit_log_disable = true`](audit-log-reference.html#sysvar_audit_log_disable) generates a warning (`ER_WARN_AUDIT_LOG_DISABLED`) with the following message: Audit Log is disabled. Enable it with audit_log_disable = false. Setting [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable) to false also generates warning. When [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable) is set to true, audit log function calls and variable changes generate a session warning.

Setting the runtime value of [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable) requires the [`SUPER`](privileges-provided.html#priv_super) privilege.
