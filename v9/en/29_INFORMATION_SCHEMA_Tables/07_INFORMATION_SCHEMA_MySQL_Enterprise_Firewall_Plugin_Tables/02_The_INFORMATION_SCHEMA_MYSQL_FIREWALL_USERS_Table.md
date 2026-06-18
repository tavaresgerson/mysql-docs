### 28.7.2 The INFORMATION\_SCHEMA MYSQL\_FIREWALL\_USERS Table

The [`MYSQL_FIREWALL_USERS`](information-schema-mysql-firewall-users-table.html "28.7.2 The INFORMATION_SCHEMA MYSQL_FIREWALL_USERS Table") table
provides a view into the in-memory data cache for the MySQL Enterprise Firewall
plugin. It lists names and operational modes of registered
firewall account profiles. It is used in conjunction with the
`mysql.firewall_users` system table that provides
persistent storage of firewall data; see
[MySQL Enterprise Firewall Tables](/doc/refman/8.4/en/firewall-reference.html#firewall-tables).

The [`MYSQL_FIREWALL_USERS`](information-schema-mysql-firewall-users-table.html "28.7.2 The INFORMATION_SCHEMA MYSQL_FIREWALL_USERS Table") table has
these columns:

* `USERHOST`

  The account profile name. Each account name has the format
  `user_name@host_name`.

* `MODE`

  The current operational mode for the profile. Permitted mode
  values are `OFF`,
  `DETECTING`, `PROTECTING`,
  `RECORDING`, and `RESET`.
  For details about their meanings, see
  [Firewall Concepts](/doc/refman/8.4/en/firewall-usage.html#firewall-concepts).

This table is deprecated and subject to removal in a future MySQL
version. See [Migrating Account Profiles to Group Profiles](/doc/refman/8.4/en/firewall-usage.html#firewall-account-profile-migration).