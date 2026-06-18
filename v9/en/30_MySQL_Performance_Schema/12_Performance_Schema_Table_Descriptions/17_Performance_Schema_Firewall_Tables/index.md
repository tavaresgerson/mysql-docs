### 29.12.17 Performance Schema Firewall Tables

[29.12.17.1 The firewall\_groups Table](performance-schema-firewall-groups-table.html)

[29.12.17.2 The firewall\_group\_allowlist Table](performance-schema-firewall-group-allowlist-table.html)

[29.12.17.3 The firewall\_membership Table](performance-schema-firewall-membership-table.html)

The following sections describe the Performance Schema tables
associated with MySQL Enterprise Firewall (see [Section 8.4.8, “MySQL Enterprise Firewall”](firewall.html "8.4.8 MySQL Enterprise Firewall")). They
provide information about firewall operation:

* [`firewall_groups`](performance-schema-firewall-groups-table.html "29.12.17.1 The firewall_groups Table"): Information
  about firewall group profiles.

* [`firewall_group_allowlist`](performance-schema-firewall-group-allowlist-table.html "29.12.17.2 The firewall_group_allowlist Table"):
  Allowlist rules of registered firewall group profiles.

* [`firewall_membership`](performance-schema-firewall-membership-table.html "29.12.17.3 The firewall_membership Table"): Members
  (accounts) of registered firewall group profiles.

These tables are supported by both the firewall plugin
(deprecated) and the MySQL Enterprise Firewall component.