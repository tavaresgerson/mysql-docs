### 8.2.11 Account Categories

MySQL incorporates the concept of user account categories, based on the  `SYSTEM_USER` privilege.

*  System and Regular Accounts
*  Operations Affected by the SYSTEM\_USER Privilege
*  System and Regular Sessions
*  Protecting System Accounts Against Manipulation by Regular Accounts

#### System and Regular Accounts

MySQL incorporates the concept of user account categories, with system and regular users distinguished according to whether they have the `SYSTEM_USER` privilege:

* A user with the `SYSTEM_USER` privilege is a system user.
* A user without the `SYSTEM_USER` privilege is a regular user.

The `SYSTEM_USER` privilege has an effect on the accounts to which a given user can apply its other privileges, as well as whether the user is protected from other accounts:

* A system user can modify both system and regular accounts. That is, a user who has the appropriate privileges to perform a given operation on regular accounts is enabled by possession of `SYSTEM_USER` to also perform the operation on system accounts. A system account can be modified only by system users with appropriate privileges, not by regular users.
* A regular user with appropriate privileges can modify regular accounts, but not system accounts. A regular account can be modified by both system and regular users with appropriate privileges.

If a user has the appropriate privileges to perform a given operation on regular accounts, `SYSTEM_USER` enables the user to also perform the operation on system accounts. `SYSTEM_USER` does not imply any other privilege, so the ability to perform a given account operation remains predicated on possession of any other required privileges. For example, if a user can grant the `SELECT` and `UPDATE` privileges to regular accounts, then with  `SYSTEM_USER` the user can also grant  `SELECT` and  `UPDATE` to system accounts.

The distinction between system and regular accounts enables better control over certain account administration issues by protecting accounts that have the `SYSTEM_USER` privilege from accounts that do not have the privilege. For example, the `CREATE USER` privilege enables not only creation of new accounts, but modification and removal of existing accounts. Without the system user concept, a user who has the  `CREATE USER` privilege can modify or drop any existing account, including the `root` account. The concept of system user enables restricting modifications to the `root` account (itself a system account) so they can be made only by system users. Regular users with the `CREATE USER` privilege can still modify or drop existing accounts, but only regular accounts.

#### Operations Affected by the `SYSTEM_USER` Privilege

The `SYSTEM_USER` privilege affects these operations:

* Account manipulation.

  Account manipulation includes creating and dropping accounts, granting and revoking privileges, changing account authentication characteristics such as credentials or authentication plugin, and changing other account characteristics such as password expiration policy.

  The `SYSTEM_USER` privilege is required to manipulate system accounts using account-management statements such as `CREATE USER` and `GRANT`. To prevent an account from modifying system accounts this way, make it a regular account by not granting it the `SYSTEM_USER` privilege. (However, to fully protect system accounts against regular accounts, you must also withhold modification privileges for the `mysql` system schema from regular accounts. See  Protecting System Accounts Against Manipulation by Regular Accounts.)
* Killing current sessions and statements executing within them.

  To kill a session or statement that is executing with the `SYSTEM_USER` privilege, your own session must have the `SYSTEM_USER` privilege, in addition to any other required privilege ( `CONNECTION_ADMIN` or the deprecated  `SUPER` privilege).

  If the user that puts a server in offline mode does not have the  `SYSTEM_USER` privilege, connected client users who have the `SYSTEM_USER` privilege are also not disconnected. However, these users cannot initiate new connections to the server while it is in offline mode, unless they have the `CONNECTION_ADMIN` or `SUPER` privilege as well. It is only their existing connection that is not terminated, because the  `SYSTEM_USER` privilege is required to do that.
* Setting the `DEFINER` attribute for stored objects.

  To set the `DEFINER` attribute for a stored object to an account that has the `SYSTEM_USER` privilege, you must have the  `SYSTEM_USER` privilege, in addition to any other required privilege.
* Specifying mandatory roles.

  A role that has the `SYSTEM_USER` privilege cannot be listed in the value of the `mandatory_roles` system variable.
* Overriding “abort” items in MySQL Enterprise Audit’s audit log filter.

  Accounts with the  `SYSTEM_USER` privilege are automatically assigned the `AUDIT_ABORT_EXEMPT` privilege, so that queries from the account are always executed even if an “abort” item in the audit log filter would block them. Accounts with the `SYSTEM_USER` privilege can therefore be used to regain access to a system following an audit misconfiguration. See  Section 8.4.5, “MySQL Enterprise Audit”.

#### System and Regular Sessions

Sessions executing within the server are distinguished as system or regular sessions, similar to the distinction between system and regular users:

* A session that possesses the `SYSTEM_USER` privilege is a system session.
* A session that does not possess the `SYSTEM_USER` privilege is a regular session.

A regular session is able to perform only operations permitted to regular users. A system session is additionally able to perform operations permitted only to system users.

The privileges possessed by a session are those granted directly to its underlying account, plus those granted to all roles currently active within the session. Thus, a session may be a system session because its account has been granted the `SYSTEM_USER` privilege directly, or because the session has activated a role that has the `SYSTEM_USER` privilege. Roles granted to an account that are not active within the session do not affect session privileges.

Because activating and deactivating roles can change the privileges possessed by sessions, a session may change from a regular session to a system session or vice versa. If a session activates or deactivates a role that has the `SYSTEM_USER` privilege, the appropriate change between regular and system session takes place immediately, for that session only:

* If a regular session activates a role with the `SYSTEM_USER` privilege, the session becomes a system session.
* If a system session deactivates a role with the `SYSTEM_USER` privilege, the session becomes a regular session, unless some other role with the  `SYSTEM_USER` privilege remains active.

These operations have no effect on existing sessions:

* If the  `SYSTEM_USER` privilege is granted to or revoked from an account, existing sessions for the account do not change between regular and system sessions. The grant or revoke operation affects only sessions for subsequent connections by the account.
* Statements executed by a stored object invoked within a session execute with the system or regular status of the parent session, even if the object `DEFINER` attribute names a system account.

Because role activation affects only sessions and not accounts, granting a role that has the `SYSTEM_USER` privilege to a regular account does not protect that account against regular users. The role protects only sessions for the account in which the role has been activated, and protects the session only against being killed by regular sessions.

#### Protecting System Accounts Against Manipulation by Regular Accounts

Account manipulation includes creating and dropping accounts, granting and revoking privileges, changing account authentication characteristics such as credentials or authentication plugin, and changing other account characteristics such as password expiration policy.

Account manipulation can be done two ways:

* By using account-management statements such as `CREATE USER` and `GRANT`. This is the preferred method.
* By direct grant-table modification using statements such as `INSERT` and `UPDATE`. This method is discouraged but possible for users with the appropriate privileges on the `mysql` system schema that contains the grant tables.

To fully protect system accounts against modification by a given account, make it a regular account and do not grant it modification privileges for the `mysql` schema:

* The  `SYSTEM_USER` privilege is required to manipulate system accounts using account-management statements. To prevent an account from modifying system accounts this way, make it a regular account by not granting `SYSTEM_USER` to it. This includes not granting `SYSTEM_USER` to any roles granted to the account.
* Privileges for the `mysql` schema enable manipulation of system accounts through direct modification of the grant tables, even if the modifying account is a regular account. To restrict unauthorized direct modification of system accounts by a regular account, do not grant modification privileges for the `mysql` schema to the account (or any roles granted to the account). If a regular account must have global privileges that apply to all schemas, `mysql` schema modifications can be prevented using privilege restrictions imposed using partial revokes. See  Section 8.2.12, “Privilege Restriction Using Partial Revokes”.

::: info Note

Unlike withholding the `SYSTEM_USER` privilege, which prevents an account from modifying system accounts but not regular accounts, withholding `mysql` schema privileges prevents an account from modifying system accounts as well as regular accounts. This should not be an issue because, as mentioned, direct grant-table modification is discouraged.

:::

Suppose that you want to create a user `u1` who has all privileges on all schemas, except that `u1` should be a regular user without the ability to modify system accounts. Assuming that the `partial_revokes` system variable is enabled, configure `u1` as follows:

```
CREATE USER u1 IDENTIFIED BY 'password';

GRANT ALL ON *.* TO u1 WITH GRANT OPTION;
-- GRANT ALL includes SYSTEM_USER, so at this point
-- u1 can manipulate system or regular accounts

REVOKE SYSTEM_USER ON *.* FROM u1;
-- Revoking SYSTEM_USER makes u1 a regular user;
-- now u1 can use account-management statements
-- to manipulate only regular accounts

REVOKE ALL ON mysql.* FROM u1;
-- This partial revoke prevents u1 from directly
-- modifying grant tables to manipulate accounts
```

To prevent all `mysql` system schema access by an account, revoke all its privileges on the `mysql` schema, as just shown. It is also possible to permit partial `mysql` schema access, such as read-only access. The following example creates an account that has `SELECT`, `INSERT`, `UPDATE`, and `DELETE` privileges globally for all schemas, but only `SELECT` for the `mysql` schema:

```
CREATE USER u2 IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO u2;
REVOKE INSERT, UPDATE, DELETE ON mysql.* FROM u2;
```

Another possibility is to revoke all `mysql` schema privileges but grant access to specific `mysql` tables or columns. This can be done even with a partial revoke on `mysql`. The following statements enable read-only access to `u1` within the `mysql` schema, but only for the `db` table and the `Host` and `User` columns of the `user` table:

```
CREATE USER u3 IDENTIFIED BY 'password';
GRANT ALL ON *.* TO u3;
REVOKE ALL ON mysql.* FROM u3;
GRANT SELECT ON mysql.db TO u3;
GRANT SELECT(Host,User) ON mysql.user TO u3;
```
