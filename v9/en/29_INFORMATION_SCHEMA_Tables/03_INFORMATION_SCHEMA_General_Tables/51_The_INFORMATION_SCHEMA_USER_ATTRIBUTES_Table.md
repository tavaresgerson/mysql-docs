### 28.3.51 The INFORMATION\_SCHEMA USER\_ATTRIBUTES Table

The [`USER_ATTRIBUTES`](information-schema-user-attributes-table.html "28.3.51 The INFORMATION_SCHEMA USER_ATTRIBUTES Table") table provides
information about user comments and user attributes. It takes its
values from the `mysql.user` system table.

The [`USER_ATTRIBUTES`](information-schema-user-attributes-table.html "28.3.51 The INFORMATION_SCHEMA USER_ATTRIBUTES Table") table has these
columns:

* `USER`

  The user name portion of the account to which the
  `ATTRIBUTE` column value applies.

* `HOST`

  The host name portion of the account to which the
  `ATTRIBUTE` column value applies.

* `ATTRIBUTE`

  The user comment, user attribute, or both belonging to the
  account specified by the `USER` and
  `HOST` columns. The value is in JSON object
  notation. Attributes are shown exactly as set using
  [`CREATE
  USER`](create-user.html "15.7.1.3 CREATE USER Statement") and
  [`ALTER
  USER`](alter-user.html "15.7.1.1 ALTER USER Statement") statements with `ATTRIBUTE` or
  `COMMENT` options. A comment is shown as a
  key-value pair having `comment` as the key.
  For additional information and examples, see
  [CREATE USER Comment and Attribute Options](create-user.html#create-user-comments-attributes "CREATE USER Comment and Attribute Options").

#### Notes

* [`USER_ATTRIBUTES`](information-schema-user-attributes-table.html "28.3.51 The INFORMATION_SCHEMA USER_ATTRIBUTES Table") is a nonstandard
  `INFORMATION_SCHEMA` table.

* To obtain only the user comment for a given user as an
  unquoted string, you can employ a query such as this one:

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

  Similarly, you can obtain the unquoted value for a given user
  attribute using its key.

* [`USER_ATTRIBUTES`](information-schema-user-attributes-table.html "28.3.51 The INFORMATION_SCHEMA USER_ATTRIBUTES Table") contents are
  accessible as follows:

  + All rows are accessible if:

    - The current thread is a replica thread.
    - The access control system has not been initialized
      (for example, the server was started with the
      [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables)
      option).

    - The currently authenticated account has the
      [`UPDATE`](privileges-provided.html#priv_update) or
      [`SELECT`](privileges-provided.html#priv_select) privilege for
      the `mysql.user` system table.

    - The currently authenticated account has the
      [`CREATE USER`](privileges-provided.html#priv_create-user) and
      [`SYSTEM_USER`](privileges-provided.html#priv_system-user) privileges.

  + Otherwise, the currently authenticated account can see the
    row for that account. Additionally, if the account has the
    [`CREATE USER`](privileges-provided.html#priv_create-user) privilege but
    not the [`SYSTEM_USER`](privileges-provided.html#priv_system-user)
    privilege, it can see rows for all other accounts that do
    not have the [`SYSTEM_USER`](privileges-provided.html#priv_system-user)
    privilege.

For more information about specifying account comments and
attributes, see [Section 15.7.1.3, “CREATE USER Statement”](create-user.html "15.7.1.3 CREATE USER Statement").