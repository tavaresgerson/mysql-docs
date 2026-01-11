#### 15.7.2.2 CREATE RESOURCE GROUP Statement

```
CREATE RESOURCE GROUP group_name
    TYPE = {SYSTEM|USER}
    [VCPU [=] vcpu_spec [, vcpu_spec] ...]
    [THREAD_PRIORITY [=] N]
    [ENABLE|DISABLE]

vcpu_spec: {N | M - N}
```

`CREATE RESOURCE GROUP` is used for resource group management (see Section 7.1.16, “Resource Groups”). This statement creates a new resource group and assigns its initial attribute values. It requires the `RESOURCE_GROUP_ADMIN` privilege.

*`group_name`* identifies which resource group to create. If the group already exists, an error occurs.

The `TYPE` attribute is required. It should be `SYSTEM` for a system resource group, `USER` for a user resource group. The group type affects permitted `THREAD_PRIORITY` values, as described later.

The `VCPU` attribute indicates the CPU affinity; that is, the set of virtual CPUs the group can use:

* If `VCPU` is not given, the resource group has no CPU affinity and can use all available CPUs.

* If `VCPU` is given, the attribute value is a list of comma-separated CPU numbers or ranges:

  + Each number must be an integer in the range from 0 to the number of CPUs − 1. For example, on a system with 64 CPUs, the number can range from 0 to 63.

  + A range is given in the form *`M`* − *`N`*, where *`M`* is less than or equal to *`N`* and both numbers are in the CPU range.

  + If a CPU number is an integer outside the permitted range or is not an integer, an error occurs.

Example `VCPU` specifiers (these are all equivalent):

```
VCPU = 0,1,2,3,9,10
VCPU = 0-3,9-10
VCPU = 9,10,0-3
VCPU = 0,10,1,9,3,2
```

The `THREAD_PRIORITY` attribute indicates the priority for threads assigned to the group:

* If `THREAD_PRIORITY` is not given, the default priority is 0.

* If `THREAD_PRIORITY` is given, the attribute value must be in the range from -20 (highest priority) to 19 (lowest priority). The priority for system resource groups must be in the range from -20 to 0. The priority for user resource groups must be in the range from 0 to 19. Use of different ranges for system and user groups ensures that user threads never have a higher priority than system threads.

`ENABLE` and `DISABLE` specify that the resource group is initially enabled or disabled. If neither is specified, the group is enabled by default. A disabled group cannot have threads assigned to it.

Examples:

* Create an enabled user group that has a single CPU and the lowest priority:

  ```
  CREATE RESOURCE GROUP rg1
    TYPE = USER
    VCPU = 0
    THREAD_PRIORITY = 19;
  ```

* Create a disabled system group that has no CPU affinity (can use all CPUs) and the highest priority:

  ```
  CREATE RESOURCE GROUP rg2
    TYPE = SYSTEM
    THREAD_PRIORITY = -20
    DISABLE;
  ```

Resource group management is local to the server on which it occurs. `CREATE RESOURCE GROUP` statements are not written to the binary log and are not replicated.
