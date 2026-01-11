### 28.3.27 The INFORMATION_SCHEMA ROLE_COLUMN_GRANTS Table

The `ROLE_COLUMN_GRANTS` table (available as of MySQL 8.0.19) provides information about the column privileges for roles that are available to or granted by the currently enabled roles.

The `ROLE_COLUMN_GRANTS` table has these columns:

* `GRANTOR`

  The user name part of the account that granted the role.

* `GRANTOR_HOST`

  The host name part of the account that granted the role.

* `GRANTEE`

  The user name part of the account to which the role is granted.

* `GRANTEE_HOST`

  The host name part of the account to which the role is granted.

* `TABLE_CATALOG`

  The name of the catalog to which the role applies. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the role applies.

* `TABLE_NAME`

  The name of the table to which the role applies.

* `COLUMN_NAME`

  The name of the column to which the role applies.

* `PRIVILEGE_TYPE`

  The privilege granted. The value can be any privilege that can be granted at the column level; see Section 15.7.1.6, “GRANT Statement”. Each row lists a single privilege, so there is one row per column privilege held by the grantee.

* `IS_GRANTABLE`

  `YES` or `NO`, depending on whether the role is grantable to other accounts.
