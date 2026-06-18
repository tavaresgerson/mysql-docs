#### 7.4.5.3 Dumping Stored Programs

Several options control how [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program")
handles stored programs (stored procedures and functions,
triggers, and events):

* [`--events`](mysqldump.html#option_mysqldump_events): Dump Event
  Scheduler events

* [`--routines`](mysqldump.html#option_mysqldump_routines): Dump stored
  procedures and functions

* [`--triggers`](mysqldump.html#option_mysqldump_triggers): Dump
  triggers for tables

The [`--triggers`](mysqldump.html#option_mysqldump_triggers) option is
enabled by default so that when tables are dumped, they are
accompanied by any triggers they have. The other options are
disabled by default and must be specified explicitly to dump
the corresponding objects. To disable any of these options
explicitly, use its skip form:
[`--skip-events`](mysqldump.html#option_mysqldump_events),
[`--skip-routines`](mysqldump.html#option_mysqldump_routines),
or
[`--skip-triggers`](mysqldump.html#option_mysqldump_triggers).