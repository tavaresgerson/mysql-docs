#### 17.5.1.3 Finding the Primary

The following example shows how to find out which server is currently the primary when deployed in single-primary mode.

```sql
mysql> SHOW STATUS LIKE 'group_replication_primary_member';
```
