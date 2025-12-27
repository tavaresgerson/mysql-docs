#### 6.4.5.1 Elements of MySQL Enterprise Audit

MySQL Enterprise Audit is based on the audit log plugin and related elements:

* A server-side plugin named `audit_log` examines auditable events and determines whether to write them to the audit log.

* A set of functions enables manipulation of filtering definitions that control logging behavior, the encryption password, and log file reading.

* Tables in the `mysql` system database provide persistent storage of filter and user account data.

* System variables enable audit log configuration and status variables provide runtime operational information.

Note

Prior to MySQL 5.7.13, MySQL Enterprise Audit consists only of the `audit_log` plugin and operates in legacy mode. See [Section 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering").
