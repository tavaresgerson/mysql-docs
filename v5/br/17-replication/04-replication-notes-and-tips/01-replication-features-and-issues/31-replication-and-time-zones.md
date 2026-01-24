#### 16.4.1.31 Replication and Time Zones

By default, source and replica servers assume that they are in the same time zone. If you are replicating between servers in different time zones, the time zone must be set on both source and replica. Otherwise, statements depending on the local time on the source are not replicated properly, such as statements that use the [`NOW()`](date-and-time-functions.html#function_now) or [`FROM_UNIXTIME()`](date-and-time-functions.html#function_from-unixtime) functions.

Verify that your combination of settings for the system time zone ([`system_time_zone`](server-system-variables.html#sysvar_system_time_zone)), server current time zone (the global value of [`time_zone`](server-system-variables.html#sysvar_time_zone)), and per-session time zones (the session value of [`time_zone`](server-system-variables.html#sysvar_time_zone)) on the source and replica is producing the correct results. In particular, if the [`time_zone`](server-system-variables.html#sysvar_time_zone) system variable is set to the value `SYSTEM`, indicating that the server time zone is the same as the system time zone, this can cause the source and replica to apply different time zones. For example, a source could write the following statement in the binary log:

```sql
SET @@session.time_zone='SYSTEM';
```

If this source and its replica have a different setting for their system time zones, this statement can produce unexpected results on the replica, even if the replica's global [`time_zone`](server-system-variables.html#sysvar_time_zone) value has been set to match the source's. For an explanation of MySQL Server's time zone settings, and how to change them, see [Section 5.1.13, “MySQL Server Time Zone Support”](time-zone-support.html "5.1.13 MySQL Server Time Zone Support").

See also [Section 16.4.1.15, “Replication and System Functions”](replication-features-functions.html "16.4.1.15 Replication and System Functions").
