### 28.3.51 The INFORMATION\_SCHEMA USER\_ATTRIBUTES Table

The `USER_ATTRIBUTES` table provides information about user comments and user attributes. It takes its values from the `mysql.user` system table.

The `USER_ATTRIBUTES` table has these columns:

* `USER`

  The user name portion of the account to which the `ATTRIBUTE` column value applies.

* `HOST`

  The host name portion of the account to which the `ATTRIBUTE` column value applies.

* `ATTRIBUTE`

  The user comment, user attribute, or both belonging to the account specified by the `USER` and `HOST` columns. The value is in JSON object notation. Attributes are shown exactly as set using `CREATE USER` and `ALTER USER` statements with `ATTRIBUTE` or `COMMENT` options. A comment is shown as a key-value pair having `comment` as the key. For additional information and examples, see CREATE USER Comment and Attribute Options.

#### Notes

* `USER_ATTRIBUTES` is a nonstandard `INFORMATION_SCHEMA` table.

* To obtain only the user comment for a given user as an unquoted string, you can employ a query such as this one:

  ```
  mysql> SELECT ATTRIBUTE->>"$.comment" AS Comment
      ->     FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
      ->     WHERE USER='bill' AND HOST='localhost';
  +-----------+
  | Comment   |
  +-----------+
  | A comment |
  +-----------+
  ```

  Similarly, you can obtain the unquoted value for a given user attribute using its key.

* `USER_ATTRIBUTES` contents are accessible as follows:

  + All rows are accessible if:

    - The current thread is a replica thread.
    - The access control system has not been initialized (for example, the server was started with the `--skip-grant-tables` option).

    - The currently authenticated account has the `UPDATE` or `SELECT` privilege for the `mysql.user` system table.

    - The currently authenticated account has the `CREATE USER` and `SYSTEM_USER` privileges.

  + Otherwise, the currently authenticated account can see the row for that account. Additionally, if the account has the `CREATE USER` privilege but not the `SYSTEM_USER` privilege, it can see rows for all other accounts that do not have the `SYSTEM_USER` privilege.

For more information about specifying account comments and attributes, see Section 15.7.1.3, “CREATE USER Statement”.
