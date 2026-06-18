#### 29.12.17.3 The firewall\_membership Table

The [`firewall_membership`](performance-schema-firewall-membership-table.html "29.12.17.3 The firewall_membership Table") table
provides a view into the in-memory data cache for MySQL Enterprise Firewall. It
lists the members (accounts) of registered firewall group
profiles. It is used in conjunction with the
`mysql.firewall_membership` system table that
provides persistent storage of firewall data; see
[MySQL Enterprise Firewall Tables](firewall-reference.html#firewall-tables "MySQL Enterprise Firewall Tables").

The [`firewall_membership`](performance-schema-firewall-membership-table.html "29.12.17.3 The firewall_membership Table") table has
these columns:

* `GROUP_ID`

  The group profile name.

* `MEMBER_ID`

  The name of an account that is a member of the profile.

The [`firewall_membership`](performance-schema-firewall-membership-table.html "29.12.17.3 The firewall_membership Table") table has
no indexes.

[`TRUNCATE TABLE`](truncate-table.html "15.1.37 TRUNCATE TABLE Statement") is not permitted
for the [`firewall_membership`](performance-schema-firewall-membership-table.html "29.12.17.3 The firewall_membership Table")
table.

The [`firewall_membership`](performance-schema-firewall-membership-table.html "29.12.17.3 The firewall_membership Table") table was
added in MySQL 8.0.23.