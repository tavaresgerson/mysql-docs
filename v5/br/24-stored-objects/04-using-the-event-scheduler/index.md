## 23.4 Using the Event Scheduler

23.4.1 Event Scheduler Overview

23.4.2 Event Scheduler Configuration

23.4.3 Event Syntax

23.4.4 Event Metadata

23.4.5 Event Scheduler Status

23.4.6 The Event Scheduler and MySQL Privileges

The MySQL Event Scheduler manages the scheduling and execution of events, that is, tasks that run according to a schedule. The following discussion covers the Event Scheduler and is divided into the following sections:

* Section 23.4.1, “Event Scheduler Overview”, provides an introduction to and conceptual overview of MySQL Events.

* Section 23.4.3, “Event Syntax”, discusses the SQL statements for creating, altering, and dropping MySQL Events.

* Section 23.4.4, “Event Metadata”, shows how to obtain information about events and how this information is stored by the MySQL Server.

* Section 23.4.6, “The Event Scheduler and MySQL Privileges”, discusses the privileges required to work with events and the ramifications that events have with regard to privileges when executing.

Stored routines require the `event` table in the `mysql` database. This table is created during the MySQL 5.7 installation procedure. If you are upgrading to MySQL 5.7 from an earlier version, be sure to update your grant tables to make sure that the `event` table exists. See Section 2.10, “Upgrading MySQL”.

### Additional Resources

* There are some restrictions on the use of events; see Section 23.8, “Restrictions on Stored Programs”.

* Binary logging for events takes place as described in Section 23.7, “Stored Program Binary Logging”.

* You may also find the [MySQL User Forums](https://forums.mysql.com/list.php?20) to be helpful.
