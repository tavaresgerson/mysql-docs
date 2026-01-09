### 28.3.31 The INFORMATION_SCHEMA RESOURCE_GROUPS Table

The `RESOURCE_GROUPS` table provides access to information about resource groups. For general discussion of the resource group capability, see Section 7.1.16, “Resource Groups”.

You can see information only for columns for which you have some privilege.

The `RESOURCE_GROUPS` table has these columns:

* `RESOURCE_GROUP_NAME`

  The name of the resource group.

* `RESOURCE_GROUP_TYPE`

  The resource group type, either `SYSTEM` or `USER`.

* `RESOURCE_GROUP_ENABLED`

  Whether the resource group is enabled (1) or disabled (0);

* `VCPU_IDS`

  The CPU affinity; that is, the set of virtual CPUs that the resource group can use. The value is a list of comma-separated CPU numbers or ranges.

* `THREAD_PRIORITY`

  The priority for threads assigned to the resource group. The priority ranges from -20 (highest priority) to 19 (lowest priority). System resource groups have a priority that ranges from -20 to 0. User resource groups have a priority that ranges from 0 to 19.
