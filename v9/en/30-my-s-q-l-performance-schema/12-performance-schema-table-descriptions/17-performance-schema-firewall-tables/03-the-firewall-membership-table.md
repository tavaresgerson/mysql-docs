#### 29.12.17.3 The firewall\_membership Table

The `firewall_membership` table provides a view into the in-memory data cache for MySQL Enterprise Firewall. It lists the members (accounts) of registered firewall group profiles. It is used in conjunction with the `mysql.firewall_membership` system table that provides persistent storage of firewall data; see MySQL Enterprise Firewall Tables.

The `firewall_membership` table has these columns:

* `GROUP_ID`

  The group profile name.

* `MEMBER_ID`

  The name of an account that is a member of the profile.

The `firewall_membership` table has no indexes.

`TRUNCATE TABLE` is not permitted for the `firewall_membership` table.
