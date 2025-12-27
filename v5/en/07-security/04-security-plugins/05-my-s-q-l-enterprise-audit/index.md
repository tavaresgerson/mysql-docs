### 6.4.5 MySQL Enterprise Audit

[6.4.5.1 Elements of MySQL Enterprise Audit](audit-log-elements.html)

[6.4.5.2 Installing or Uninstalling MySQL Enterprise Audit](audit-log-installation.html)

[6.4.5.3 MySQL Enterprise Audit Security Considerations](audit-log-security.html)

[6.4.5.4 Audit Log File Formats](audit-log-file-formats.html)

[6.4.5.5 Configuring Audit Logging Characteristics](audit-log-logging-configuration.html)

[6.4.5.6 Reading Audit Log Files](audit-log-file-reading.html)

[6.4.5.7 Audit Log Filtering](audit-log-filtering.html)

[6.4.5.8 Writing Audit Log Filter Definitions](audit-log-filter-definitions.html)

[6.4.5.9 Disabling Audit Logging](audit-log-disabling.html)

[6.4.5.10 Legacy Mode Audit Log Filtering](audit-log-legacy-filtering.html)

[6.4.5.11 Audit Log Reference](audit-log-reference.html)

[6.4.5.12 Audit Log Restrictions](audit-log-restrictions.html)

Note

MySQL Enterprise Audit is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition includes MySQL Enterprise Audit, implemented using a server plugin named `audit_log`. MySQL Enterprise Audit uses the open MySQL Audit API to enable standard, policy-based monitoring, logging, and blocking of connection and query activity executed on specific MySQL servers. Designed to meet the Oracle audit specification, MySQL Enterprise Audit provides an out of box, easy to use auditing and compliance solution for applications that are governed by both internal and external regulatory guidelines.

When installed, the audit plugin enables MySQL Server to produce a log file containing an audit record of server activity. The log contents include when clients connect and disconnect, and what actions they perform while connected, such as which databases and tables they access.

After you install the audit plugin (see [Section 6.4.5.2, “Installing or Uninstalling MySQL Enterprise Audit”](audit-log-installation.html "6.4.5.2 Installing or Uninstalling MySQL Enterprise Audit")), it writes an audit log file. By default, the file is named `audit.log` in the server data directory. To change the name of the file, set the [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) system variable at server startup.

By default, audit log file contents are written in new-style XML format, without compression or encryption. To select the file format, set the [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format) system variable at server startup. For details on file format and contents, see [Section 6.4.5.4, “Audit Log File Formats”](audit-log-file-formats.html "6.4.5.4 Audit Log File Formats").

For more information about controlling how logging occurs, including audit log file naming and format selection, see [Section 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics"). To perform filtering of audited events, see [Section 6.4.5.7, “Audit Log Filtering”](audit-log-filtering.html "6.4.5.7 Audit Log Filtering"). For descriptions of the parameters used to configure the audit log plugin, see [Audit Log Options and Variables](audit-log-reference.html#audit-log-options-variables "Audit Log Options and Variables").

If the audit log plugin is enabled, the Performance Schema (see [Chapter 25, *MySQL Performance Schema*](performance-schema.html "Chapter 25 MySQL Performance Schema")) has instrumentation for it. To identify the relevant instruments, use this query:

```sql
SELECT NAME FROM performance_schema.setup_instruments
WHERE NAME LIKE '%/alog/%';
```
