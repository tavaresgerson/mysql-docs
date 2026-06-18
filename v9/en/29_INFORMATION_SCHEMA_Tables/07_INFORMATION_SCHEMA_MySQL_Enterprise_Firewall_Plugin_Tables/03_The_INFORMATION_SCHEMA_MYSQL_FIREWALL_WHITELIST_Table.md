### 28.7.3 The INFORMATION\_SCHEMA MYSQL\_FIREWALL\_WHITELIST Table

The [`MYSQL_FIREWALL_WHITELIST`](information-schema-mysql-firewall-whitelist-table.html "28.7.3 The INFORMATION_SCHEMA MYSQL_FIREWALL_WHITELIST Table") table
provides a view into the in-memory data cache for the MySQL Enterprise Firewall
plugin. It lists allowlist rules of registered firewall account
profiles. It is used in conjunction with the
`mysql.firewall_whitelist` system table that
provides persistent storage of firewall data; see
[MySQL Enterprise Firewall Tables](/doc/refman/8.4/en/firewall-reference.html#firewall-tables).

The [`MYSQL_FIREWALL_WHITELIST`](information-schema-mysql-firewall-whitelist-table.html "28.7.3 The INFORMATION_SCHEMA MYSQL_FIREWALL_WHITELIST Table") table
has these columns:

* `USERHOST`

  The account profile name. Each account name has the format
  `user_name@host_name`.

* `RULE`

  A normalized statement indicating an acceptable statement
  pattern for the profile. A profile allowlist is the union of
  its rules.

This table is deprecated and subject to removal in a future MySQL
version. See [Migrating Account Profiles to Group Profiles](/doc/refman/8.4/en/firewall-usage.html#firewall-account-profile-migration).