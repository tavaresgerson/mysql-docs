#### 15.7.2.4 SET RESOURCE GROUP Statement

```
SET RESOURCE GROUP group_name
    [FOR thread_id [, thread_id] ...]
```

`SET RESOURCE GROUP` is used for resource group management (see Section 7.1.16, “Resource Groups”). This statement assigns threads to a resource group. It requires the `RESOURCE_GROUP_ADMIN` or `RESOURCE_GROUP_USER` privilege.

*`group_name`* identifies which resource group to be assigned. Any *`thread_id`* values indicate threads to assign to the group. Thread IDs can be determined from the Performance Schema `threads` table. If the resource group or any named thread ID does not exist, an error occurs.

With no `FOR` clause, the statement assigns the current thread for the session to the resource group.

With a `FOR` clause that names thread IDs, the statement assigns those threads to the resource group.

For attempts to assign a system thread to a user resource group or a user thread to a system resource group, a warning occurs.

Examples:

* Assign the current session thread to a group:

  ```
  SET RESOURCE GROUP rg1;
  ```

* Assign the named threads to a group:

  ```
  SET RESOURCE GROUP rg2 FOR 14, 78, 4;
  ```

Resource group management is local to the server on which it occurs. `SET RESOURCE GROUP` statements are not written to the binary log and are not replicated.

An alternative to `SET RESOURCE GROUP` is the `RESOURCE_GROUP` optimizer hint, which assigns individual statements to a resource group. See Section 10.9.3, “Optimizer Hints”.
