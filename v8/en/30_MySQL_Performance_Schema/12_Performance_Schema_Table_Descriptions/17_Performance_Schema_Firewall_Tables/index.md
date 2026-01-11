### 29.12.17 Performance Schema Firewall Tables

29.12.17.1 The firewall_groups Table

29.12.17.2 The firewall_group_allowlist Table

29.12.17.3 The firewall_membership Table

Note

The Performance Schema tables described here are available as of MySQL 8.0.23. Prior to MySQL 8.0.23, use the corresponding `INFORMATION_SCHEMA` tables instead; see MySQL Enterprise Firewall Tables.

The following sections describe the Performance Schema tables associated with MySQL Enterprise Firewall (see Section 8.4.7, “MySQL Enterprise Firewall”). They provide information about firewall operation:

* `firewall_groups`: Information about firewall group profiles.

* `firewall_group_allowlist`: Allowlist rules of registered firewall group profiles.

* `firewall_membership`: Members (accounts) of registered firewall group profiles.
