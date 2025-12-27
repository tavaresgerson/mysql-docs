### 28.3.33 The INFORMATION\_SCHEMA ROLE\_ROUTINE\_GRANTS Table

The `ROLE_ROUTINE_GRANTS` table provides information about the routine privileges for roles that are available to or granted by the currently enabled roles.

The `ROLE_ROUTINE_GRANTS` table has these columns:

* `GRANTOR`

  The user name part of the account that granted the role.

* `GRANTOR_HOST`

  The host name part of the account that granted the role.

* `GRANTEE`

  The user name part of the account to which the role is granted.

* `GRANTEE_HOST`

  The host name part of the account to which the role is granted.

* `SPECIFIC_CATALOG`

  The name of the catalog to which the routine belongs. This value is always `def`.

* `SPECIFIC_SCHEMA`

  The name of the schema (database) to which the routine belongs.

* `SPECIFIC_NAME`

  The name of the routine.

* `ROUTINE_CATALOG`

  The name of the catalog to which the routine belongs. This value is always `def`.

* `ROUTINE_SCHEMA`

  The name of the schema (database) to which the routine belongs.

* `ROUTINE_NAME`

  The name of the routine.

* `PRIVILEGE_TYPE`

  The privilege granted. The value can be any privilege that can be granted at the routine level; see Section 15.7.1.6, “GRANT Statement”. Each row lists a single privilege, so there is one row per column privilege held by the grantee.

* `IS_GRANTABLE`

  `YES` or `NO`, depending on whether the role is grantable to other accounts.
