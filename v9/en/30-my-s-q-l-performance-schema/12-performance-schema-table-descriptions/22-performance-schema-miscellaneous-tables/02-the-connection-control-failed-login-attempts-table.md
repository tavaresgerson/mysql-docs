#### 29.12.22.2 The connection\_control\_failed\_login\_attempts Table

This table provides information about the current number of consecutive failed connection attempts per account.

The `connection_control_failed_login_attempts` table has the these columns:

* `USERHOST`

  A MySQL user account name in `user@host` format.

* `FAILED_ATTEMPTS`

  The number of failed connection attempts by this user.

This table is created and updated by the Connection Control component. It replaces the Information Schema `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` table, which—like the Connection Control plugins—is now deprecated, and subject to removal in a future version of MySQL. For more information, see Section 8.4.2, “The Connection Control Component”.
