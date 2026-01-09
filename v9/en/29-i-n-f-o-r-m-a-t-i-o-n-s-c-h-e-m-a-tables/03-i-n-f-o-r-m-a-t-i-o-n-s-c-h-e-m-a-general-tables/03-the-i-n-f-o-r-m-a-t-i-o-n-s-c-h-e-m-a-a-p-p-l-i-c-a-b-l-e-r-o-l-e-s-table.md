### 28.3.3 The INFORMATION_SCHEMA APPLICABLE_ROLES Table

The `APPLICABLE_ROLES` table provides information about the roles that are applicable for the current user.

The `APPLICABLE_ROLES` table has these columns:

* `USER`

  The user name part of the current user account.

* `HOST`

  The host name part of the current user account.

* `GRANTEE`

  The user name part of the account to which the role is granted.

* `GRANTEE_HOST`

  The host name part of the account to which the role is granted.

* `ROLE_NAME`

  The user name part of the granted role.

* `ROLE_HOST`

  The host name part of the granted role.

* `IS_GRANTABLE`

  `YES` or `NO`, depending on whether the role is grantable to other accounts.

* `IS_DEFAULT`

  `YES` or `NO`, depending on whether the role is a default role.

* `IS_MANDATORY`

  `YES` or `NO`, depending on whether the role is mandatory.
