### 28.3.12 The INFORMATION\_SCHEMA ENABLED\_ROLES Table

The `ENABLED_ROLES` table provides information about the roles that are enabled within the current session.

The `ENABLED_ROLES` table has these columns:

* `ROLE_NAME`

  The user name part of the granted role.

* `ROLE_HOST`

  The host name part of the granted role.

* `IS_DEFAULT`

  `YES` or `NO`, depending on whether the role is a default role.

* `IS_MANDATORY`

  `YES` or `NO`, depending on whether the role is mandatory.
