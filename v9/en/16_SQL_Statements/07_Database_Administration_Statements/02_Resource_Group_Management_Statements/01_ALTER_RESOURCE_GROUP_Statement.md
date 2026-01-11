#### 15.7.2.1 ALTER RESOURCE GROUP Statement

```
ALTER RESOURCE GROUP group_name
    [VCPU [=] vcpu_spec [, vcpu_spec] ...]
    [THREAD_PRIORITY [=] N]
    [ENABLE|DISABLE [FORCE]]

vcpu_spec: {N | M - N}
```

`ALTER RESOURCE GROUP` is used for resource group management (see Section 7.1.16, “Resource Groups”). This statement alters modifiable attributes of an existing resource group. It requires the `RESOURCE_GROUP_ADMIN` privilege.

*`group_name`* identifies which resource group to alter. If the group does not exist, an error occurs.

The attributes for CPU affinity, priority, and whether the group is enabled can be modified with `ALTER RESOURCE GROUP`. These attributes are specified the same way as described for `CREATE RESOURCE GROUP` (see Section 15.7.2.2, “CREATE RESOURCE GROUP Statement”). Only the attributes specified are altered. Unspecified attributes retain their current values.

The `FORCE` modifier is used with `DISABLE`. It determines statement behavior if the resource group has any threads assigned to it:

* If `FORCE` is not given, existing threads in the group continue to run until they terminate, but new threads cannot be assigned to the group.

* If `FORCE` is given, existing threads in the group are moved to their respective default group (system threads to `SYS_default`, user threads to `USR_default`).

The name and type attributes are set at group creation time and cannot be modified thereafter with `ALTER RESOURCE GROUP`.

Examples:

* Alter a group CPU affinity:

  ```
  ALTER RESOURCE GROUP rg1 VCPU = 0-63;
  ```

* Alter a group thread priority:

  ```
  ALTER RESOURCE GROUP rg2 THREAD_PRIORITY = 5;
  ```

* Disable a group, moving any threads assigned to it to the default groups:

  ```
  ALTER RESOURCE GROUP rg3 DISABLE FORCE;
  ```

Resource group management is local to the server on which it occurs. `ALTER RESOURCE GROUP` statements are not written to the binary log and are not replicated.
