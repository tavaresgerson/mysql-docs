## 28.7 INFORMATION_SCHEMA MySQL Enterprise Firewall Plugin Tables

The following sections describe the `INFORMATION_SCHEMA` tables associated with the MySQL Enterprise Firewall plugin (see Section 8.4.8.1, “The MySQL Enterprise Firewall Plugin”). They provide views into the firewall in-memory data cache. These tables are available only if the appropriate firewall plugins are enabled. Like the firewall plugin, these tables are deprecated, and subject to removal in a future version of MySQL.

These `INFORMATION_SCHEMA` tables are *not* used or supported by the MySQL Enterprise Firewall component.


### 28.7.1 INFORMATION_SCHEMA Firewall Plugin Table Reference

The following table summarizes `INFORMATION_SCHEMA` tables used by the MySQL Enterprise Firewall plugin. For greater detail, see the individual table descriptions.

**Table 28.9 INFORMATION_SCHEMA Firewall Tables**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA firewall tables."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Table Name</th> <th>Description</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>MYSQL_FIREWALL_USERS</code></th> <td>Firewall in-memory data for account profiles</td> <td>Yes</td> </tr><tr><th scope="row"><code>MYSQL_FIREWALL_WHITELIST</code></th> <td>Firewall in-memory data for account profile allowlists</td> <td>Yes</td> </tr></tbody></table>


### 28.7.2 The INFORMATION_SCHEMA MYSQL_FIREWALL_USERS Table

The `MYSQL_FIREWALL_USERS` table provides a view into the in-memory data cache for the MySQL Enterprise Firewall plugin. It lists names and operational modes of registered firewall account profiles. It is used in conjunction with the `mysql.firewall_users` system table that provides persistent storage of firewall data; see MySQL Enterprise Firewall Tables.

The `MYSQL_FIREWALL_USERS` table has these columns:

* `USERHOST`

  The account profile name. Each account name has the format `user_name@host_name`.

* `MODE`

  The current operational mode for the profile. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, `RECORDING`, and `RESET`. For details about their meanings, see Firewall Concepts.

This table is deprecated and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.


### 28.7.3 The INFORMATION_SCHEMA MYSQL_FIREWALL_WHITELIST Table

The `MYSQL_FIREWALL_WHITELIST` table provides a view into the in-memory data cache for the MySQL Enterprise Firewall plugin. It lists allowlist rules of registered firewall account profiles. It is used in conjunction with the `mysql.firewall_whitelist` system table that provides persistent storage of firewall data; see MySQL Enterprise Firewall Tables.

The `MYSQL_FIREWALL_WHITELIST` table has these columns:

* `USERHOST`

  The account profile name. Each account name has the format `user_name@host_name`.

* `RULE`

  A normalized statement indicating an acceptable statement pattern for the profile. A profile allowlist is the union of its rules.

This table is deprecated and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.
