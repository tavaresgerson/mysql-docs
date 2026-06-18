#### 29.12.17.2 The firewall\_group\_allowlist Table

The [`firewall_group_allowlist`](performance-schema-firewall-group-allowlist-table.html "29.12.17.2 The firewall_group_allowlist Table")
table provides a view into the in-memory data cache for
MySQL Enterprise Firewall. It lists allowlist rules of registered firewall group
profiles. It is used in conjunction with the
`mysql.firewall_group_allowlist` system table
that provides persistent storage of firewall data; see
[MySQL Enterprise Firewall Tables](/doc/refman/8.4/en/firewall-reference.html#firewall-tables).

The [`firewall_group_allowlist`](performance-schema-firewall-group-allowlist-table.html "29.12.17.2 The firewall_group_allowlist Table")
table has these columns:

* `NAME`

  The group profile name.

* `RULE`

  A normalized statement indicating an acceptable statement
  pattern for the profile. A profile allowlist is the union
  of its rules.

The [`firewall_group_allowlist`](performance-schema-firewall-group-allowlist-table.html "29.12.17.2 The firewall_group_allowlist Table")
table has no indexes.

[`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") is not permitted
for the [`firewall_group_allowlist`](performance-schema-firewall-group-allowlist-table.html "29.12.17.2 The firewall_group_allowlist Table")
table.