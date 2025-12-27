### 15.1.32 DROP LIBRARY Statement

```
DROP LIBRARY [IF EXISTS] [database.]library
```

Drops the named JavaScript library. An optional database name may be specified; otherwise, the current database is assumed.

To execute this statement, the user must have the `ALTER ROUTINE` privilege. A library created by a user with the `SYSTEM_USER` privilege can be dropped only by a user having the same privilege.

See Section 27.3.8, “Using JavaScript Libraries”, for more information and examples.
