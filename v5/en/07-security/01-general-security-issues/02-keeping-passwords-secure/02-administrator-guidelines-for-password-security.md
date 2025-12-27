#### 6.1.2.2 Administrator Guidelines for Password Security

Database administrators should use the following guidelines to keep passwords secure.

MySQL stores passwords for user accounts in the `mysql.user` system table. Access to this table should never be granted to any nonadministrative accounts.

Account passwords can be expired so that users must reset them. See [Section 6.2.11, “Password Management”](password-management.html "6.2.11 Password Management"), and [Section 6.2.12, “Server Handling of Expired Passwords”](expired-password-handling.html "6.2.12 Server Handling of Expired Passwords").

The `validate_password` plugin can be used to enforce a policy on acceptable password. See [Section 6.4.3, “The Password Validation Plugin”](validate-password.html "6.4.3 The Password Validation Plugin").

A user who has access to modify the plugin directory (the value of the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable) or the `my.cnf` file that specifies the plugin directory location can replace plugins and modify the capabilities provided by plugins, including authentication plugins.

Files such as log files to which passwords might be written should be protected. See [Section 6.1.2.3, “Passwords and Logging”](password-logging.html "6.1.2.3 Passwords and Logging").
