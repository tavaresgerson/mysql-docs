## 24.7 INFORMATION\_SCHEMA MySQL Enterprise Firewall Tables

The following sections describe the `INFORMATION_SCHEMA` tables associated with MySQL Enterprise Firewall (see Section 6.4.6, “MySQL Enterprise Firewall”). They provide views into the firewall in-memory data cache. These tables are available only if the appropriate firewall plugins are enabled.


### 24.7.1 INFORMATION\_SCHEMA Firewall Table Reference

The following table summarizes `INFORMATION_SCHEMA` firewall tables. For greater detail, see the individual table descriptions.

**Table 24.10 INFORMATION\_SCHEMA Firewall Tables**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA firewall tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>MYSQL_FIREWALL_USERS</code></td> <td>Firewall in-memory data for account profiles</td> </tr><tr><td><code>MYSQL_FIREWALL_WHITELIST</code></td> <td>Firewall in-memory data for account profile allowlists</td> </tr></tbody></table>


### 24.7.2 The INFORMATION\_SCHEMA MYSQL\_FIREWALL\_USERS Table

The `MYSQL_FIREWALL_USERS` table provides a view into the in-memory data cache for MySQL Enterprise Firewall. It lists names and operational modes of registered firewall account profiles. It is used in conjunction with the `mysql.firewall_users` system table that provides persistent storage of firewall data; see MySQL Enterprise Firewall Tables.

The `MYSQL_FIREWALL_USERS` table has these columns:

* `USERHOST`

  The account profile name. Each account name has the format `user_name@host_name`.

* `MODE`

  The current operational mode for the profile. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, `RECORDING`, and `RESET`. For details about their meanings, see Firewall Concepts.


### 24.7.3 The INFORMATION\_SCHEMA MYSQL\_FIREWALL\_WHITELIST Table

The `MYSQL_FIREWALL_WHITELIST` table provides a view into the in-memory data cache for MySQL Enterprise Firewall. It lists allowlist rules of registered firewall account profiles. It is used in conjunction with the `mysql.firewall_whitelist` system table that provides persistent storage of firewall data; see MySQL Enterprise Firewall Tables.

The `MYSQL_FIREWALL_WHITELIST` table has these columns:

* `USERHOST`

  The account profile name. Each account name has the format `user_name@host_name`.

* `RULE`

  A normalized statement indicating an acceptable statement pattern for the profile. A profile allowlist is the union of its rules.
