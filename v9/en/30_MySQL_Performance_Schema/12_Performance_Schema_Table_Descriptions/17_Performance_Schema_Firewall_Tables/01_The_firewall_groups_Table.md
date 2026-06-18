#### 29.12.17.1 The firewall\_groups Table

The [`firewall_groups`](performance-schema-firewall-groups-table.html "29.12.17.1 The firewall_groups Table") table
provides a view into the in-memory data cache for MySQL Enterprise Firewall. It
lists names and operational modes of registered firewall group
profiles. It is used in conjunction with the
`mysql.firewall_groups` system table that
provides persistent storage of firewall data; see
[MySQL Enterprise Firewall Tables](/doc/refman/8.4/en/firewall-reference.html#firewall-tables).

The [`firewall_groups`](performance-schema-firewall-groups-table.html "29.12.17.1 The firewall_groups Table") table has
these columns:

* `NAME`

  The group profile name.

* `MODE`

  The current operational mode for the profile. Permitted
  mode values are `OFF`,
  `DETECTING`,
  `PROTECTING`, and
  `RECORDING`. For details about their
  meanings, see [Firewall Concepts](/doc/refman/8.4/en/firewall-usage.html#firewall-concepts).

* `USERHOST`

  The training account for the group profile, to be used
  when the profile is in `RECORDING` mode.
  The value is `NULL`, or a
  non-`NULL` account that has the format
  `user_name@host_name`:

  + If the value is `NULL`, the firewall
    records allowlist rules for statements received from
    any account that is a member of the group.

  + If the value is non-`NULL`, the
    firewall records allowlist rules only for statements
    received from the named account (which should be a
    member of the group).

The [`firewall_groups`](performance-schema-firewall-groups-table.html "29.12.17.1 The firewall_groups Table") table has no
indexes.

[`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") is not permitted
for the [`firewall_groups`](performance-schema-firewall-groups-table.html "29.12.17.1 The firewall_groups Table") table.