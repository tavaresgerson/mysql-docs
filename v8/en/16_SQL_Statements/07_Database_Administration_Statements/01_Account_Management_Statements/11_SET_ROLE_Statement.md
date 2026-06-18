#### 15.7.1.11 SET ROLE Statement

```
SET ROLE {
    DEFAULT
  | NONE
  | ALL
  | ALL EXCEPT role [, role ] ...
  | role [, role ] ...
}
```

[`SET ROLE`](set-role.html "15.7.1.11 SET ROLE Statement") modifies the current
user's effective privileges within the current session by
specifying which of its granted roles are active. Granted roles
include those granted explicitly to the user and those named in
the [`mandatory_roles`](server-system-variables.html#sysvar_mandatory_roles) system
variable value.

Examples:

```
SET ROLE DEFAULT;
SET ROLE 'role1', 'role2';
SET ROLE ALL;
SET ROLE ALL EXCEPT 'role1', 'role2';
```

Each role name uses the format described in
[Section 8.2.5, “Specifying Role Names”](role-names.html "8.2.5 Specifying Role Names"). The host name part of the role
name, if omitted, defaults to `'%'`.

Privileges that the user has been granted directly (rather than
through roles) remain unaffected by changes to the active roles.

The statement permits these role specifiers:

* `DEFAULT`: Activate the account default
  roles. Default roles are those specified with
  [`SET DEFAULT ROLE`](set-default-role.html "15.7.1.9 SET DEFAULT ROLE Statement").

  When a user connects to the server and authenticates
  successfully, the server determines which roles to activate
  as the default roles. If the
  [`activate_all_roles_on_login`](server-system-variables.html#sysvar_activate_all_roles_on_login)
  system variable is enabled, the server activates all granted
  roles. Otherwise, the server executes
  [`SET ROLE
  DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement") implicitly. The server activates only
  default roles that can be activated. The server writes
  warnings to its error log for default roles that cannot be
  activated, but the client receives no warnings.

  If a user executes
  [`SET ROLE
  DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement") during a session, an error occurs if any
  default role cannot be activated (for example, if it does
  not exist or is not granted to the user). In this case, the
  current active roles are not changed.

* `NONE`: Set the active roles to
  `NONE` (no active roles).

* `ALL`: Activate all roles granted to the
  account.

* `ALL EXCEPT role [,
  role ] ...`: Activate
  all roles granted to the account except those named. The
  named roles need not exist or be granted to the account.

* `role [,
  role ] ...`: Activate
  the named roles, which must be granted to the account.

Note

[`SET DEFAULT ROLE`](set-default-role.html "15.7.1.9 SET DEFAULT ROLE Statement") and
[`SET ROLE
DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement") are different statements:

* [`SET DEFAULT ROLE`](set-default-role.html "15.7.1.9 SET DEFAULT ROLE Statement") defines
  which account roles to activate by default within account
  sessions.

* [`SET ROLE
  DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement") sets the active roles within the current
  session to the current account default roles.

For role usage examples, see [Section 8.2.10, “Using Roles”](roles.html "8.2.10 Using Roles").