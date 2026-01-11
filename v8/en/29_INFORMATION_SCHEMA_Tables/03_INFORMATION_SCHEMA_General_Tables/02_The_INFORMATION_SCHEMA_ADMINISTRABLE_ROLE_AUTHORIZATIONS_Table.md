### 28.3.2 The INFORMATION_SCHEMA ADMINISTRABLE_ROLE_AUTHORIZATIONS Table

The `ADMINISTRABLE_ROLE_AUTHORIZATIONS` table (available as of MySQL 8.0.19) provides information about which roles applicable for the current user or role can be granted to other users or roles.

The `ADMINISTRABLE_ROLE_AUTHORIZATIONS` table has these columns:

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
