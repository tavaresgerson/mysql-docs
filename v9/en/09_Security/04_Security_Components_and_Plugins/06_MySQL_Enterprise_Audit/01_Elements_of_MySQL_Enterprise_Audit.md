#### 8.4.6.1 Elements of MySQL Enterprise Audit

MySQL Enterprise Audit is based on the audit log plugin and related elements:

* A server-side plugin named `audit_log`
  examines auditable events and determines whether to write
  them to the audit log.

* A set of functions enables manipulation of filtering
  definitions that control logging behavior, the encryption
  password, and log file reading.

* Tables in the `mysql` system database
  provide persistent storage of filter and user account data,
  unless you set the
  [`audit_log_database`](audit-log-reference.html#sysvar_audit_log_database) system
  variable at server startup to specify a different database.

* System variables enable audit log configuration and status
  variables provide runtime operational information.

* The [`AUDIT_ADMIN`](privileges-provided.html#priv_audit-admin) privilege
  enable users to administer the audit log, and the
  [`AUDIT_ABORT_EXEMPT`](privileges-provided.html#priv_audit-abort-exempt) privilege
  enables system users to execute queries that would otherwise
  be blocked by an “abort” item in the audit log
  filter.