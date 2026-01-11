#### 8.4.8.2 The MySQL Enterprise Firewall Component

* Purpose: Provide an application-level firewall enabling the database administrator to allow or block SQL statements based on matching them against accepted statement patterns.

* URN: `file://component_firewall`

More information about the firewall component, installing it (and performing similar operations with it), and using it can be found in the following sections, listed here:

* Section 8.4.8.2.1, “Elements of MySQL Enterprise Firewall (Component)”")
* Section 8.4.8.2.2, “MySQL Enterprise Firewall Component Installation”
* Section 8.4.8.2.3, “Using the MySQL Enterprise Firewall Component”
* Section 8.4.8.2.4, “MySQL Enterprise Firewall Component Reference”

##### 8.4.8.2.1 Elements of MySQL Enterprise Firewall (Component)

The MySQL Enterprise Firewall component is intended to replace the firewall plugin, which is now deprecated. The component-based version of MySQL Enterprise Firewall includes the following elements:

* The `component_firewall` component, which examines SQL statements before they execute and, based on registered firewall profiles, decides whether to execute or reject each statement.

* Performance Schema tables providing views into registered profiles. See Section 29.12.17, “Performance Schema Firewall Tables”.

* Profiles are cached in memory for better performance. Tables in the firewall database provide backing storage of firewall data for persistence of profiles across server restarts. The firewall database can be the `mysql` system database (the default) or one determined at install time (see Installing the MySQL Enterprise Firewall Component).

* Stored procedures perform tasks such as registering firewall profiles, establishing their operational modes, and managing transfer of firewall data between the cache and persistent storage. These are described in MySQL Enterprise Firewall Component Stored Procedures.

* Administrative functions provide an API for lower-level tasks such as synchronizing the cache with persistent storage. See MySQL Enterprise Firewall Component Functions, for more information.

* System variables and status variables specific to the firewall plugin enable firewall configuration and provide runtime operational information, respectively. For descriptions of these variables, see MySQL Enterprise Firewall Component System Variables, as well as MySQL Enterprise Firewall Component Status Variables.

* The `FIREWALL_ADMIN` privilege enables users to administer firewall rules for any user.

  The `FIREWALL_EXEMPT` privilege exempts a user from firewall restrictions. This is useful, for example, for any database administrator who configures the firewall, to avoid the possibility of a misconfiguration causing even the administrator to be locked out and unable to execute statements.

  Note

  The `FIREWALL_USER` privilege (deprecated) is not supported by the MySQL Enterprise Firewall component.

* The MySQL Enterprise Firewall component also provides a number of SQL scripts (in the installation `share` directory) which facilitate installation and removal of the component, as well as migrations between the firewall plugin and the component. MySQL Enterprise Firewall Component Scripts provides more information about these scripts; see also Section 8.4.8.2.2, “MySQL Enterprise Firewall Component Installation”, for help with using them.

##### 8.4.8.2.2 MySQL Enterprise Firewall Component Installation

This section covers topics relating to installation and configuration of the MySQL Enterprise Firewall component, including installation, removal, and migration between the firewall component and the firewall plugin (deprecated).

* Installing the MySQL Enterprise Firewall Component
* Uninstalling the MySQL Enterprise Firewall Component
* Upgrading to the MySQL Enterprise Firewall Component
* Downgrading the MySQL Enterprise Firewall Component

###### Installing the MySQL Enterprise Firewall Component

This section provides information about performing a new installation of the MySQL Enterprise Firewall component. If, instead, you wish to upgrade an existing plugin-based installation of MySQL Enterprise Firewall to use the firewall component, see Upgrading to the MySQL Enterprise Firewall Component.

Prior to beginning the installation, you must choose a location for the firewall database. While it is possible to use the `mysql` system database, we recommend that you use a separate, dedicated database for this purpose. For example, to install MySQL Enterprise Firewall to a new, not previously existing, database named `myfwdb`, execute the statements shown here in the **mysql** client:

```
mysql> CREATE DATABASE IF NOT EXISTS myfwdb;
Query OK, 1 row affected (0.01 sec)

mysql> USE myfwdb;
Database changed
```

To perform the installation, use `install_component_firewall.sql` from the `share` directory of your MySQL installation. This script installs the firewall database to the current database, so you should make sure that this is the case before proceeding, like this:

```
mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| myfwdb     |
+------------+
1 row in set (0.00 sec)
```

This script requires (and accepts) no arguments; simply run it using the **mysql** client `source` command, as shown here:

```
mysql> source ../share/install_component_firewall.sql
```

Adjust the path to the `share` directory as needed to match your installation layout. See Section 6.5.1.2, “mysql Client Commands”, and Section 6.5.1.5, “Executing SQL Statements from a Text File”, for more information about using the `source` command.

`install_component_firewall.sql` creates all tables, stored procedures, and server variables needed by the MySQL Enterprise Firewall component. The `component_firewall.database` server system variable is set to the name of the current database (and persisted), and the firewall is enabled, as you can see by checking the values of `component_firewall.database` and `component_firewall.enabled`, like this:

```
SELECT component_firewall.database, component_firewall.enabled;
+-----------------------------+----------------------------+
| component_firewall.database | component_firewall.enabled |
+-----------------------------+----------------------------+
|                      myfwdb |                         ON |
+-----------------------------+----------------------------+
1 row in set (0.00 sec)
```

###### Uninstalling the MySQL Enterprise Firewall Component

This section provides information about performing a complete removal of the MySQL Enterprise Firewall component and its related elements. For information about downgrading the component to the firewall plugin (deprecated), see Downgrading the MySQL Enterprise Firewall Component.

You can remove the MySQL Enterprise Firewall component from your MySQL installation using the supplied script `uninstall_component_firewall.sql` which can be found in the `share` directory.

Important

Before running `uninstall_component_firewall.sql`, you must insure that there are no other connections to the server. Use `SHOW PROCESSLIST` or query the Performance Schema `processlist` table to help you determine that this is the case.

After ensuring the the current database is the firewall database, execute this script from a **mysql** client session. In this example, we assume that the firewall database is named `myfwdb`:

```
SELECT @@component_firewall.database;
+-------------------------------+
| @@component_firewall.database |
+-------------------------------+
|                        myfwdb |
+-------------------------------+
1 row in set (0.00 sec)

mysql> USE myfwdb;
Database changed

mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| myfwdb     |
+------------+
1 row in set (0.00 sec)

mysql> source ../share/uninstall_component_firewall.sql
```

You may need to adjust the path to the `share` directory to match the layout of your installation. For more information, see Section 6.5.1.2, “mysql Client Commands”, as well as Section 6.5.1.5, “Executing SQL Statements from a Text File”.

###### Upgrading to the MySQL Enterprise Firewall Component

This section describes how to upgrade an existing MySQL Enterprise Firewall plugin installation to the firewall component.

You can perform an upgrade from the firewall plugin to the firewall component using the script `firewall_plugin_to_component.sql`, in the MySQL installation `share` directory. This script performs the following tasks:

* Migrates any plugin account profiles to group profiles with single users.

* Drops the plugin's stored procedures.
* Uninstalls all firewall plugins.
* Drops all tables not used by the component.
* Alters those tables remaining after the others are dropped to conform with the table definitions accepted by the firewall component.

* Translates plugin system variables to those used by the component and persists them. For example, the value of `mysql_firewall_database` is copied to `component_firewall.database`.

* Installs the firewall component.
* Creates the stored procedures used by the component.

Important

If the firewall plugin was loaded using `--plugin-load-add`, you must remove it from the list of plugins specified for that option prior to running `firewall_plugin_to_component.sql`.

To perform the upgrade, start a **mysql** client session and ensure that the current database is the firewall database (`mysql_firewall_database`). After this, simply run the script. This is shown here:

```
mysql> SELECT @@mysql_firewall_database;
+---------------------------+
| @@mysql_firewall.database |
+---------------------------+
|                    myfwdb |
+---------------------------+
1 row in set (0.00 sec)

mysql> USE myfwdb;
Database changed

mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| myfwdb     |
+------------+
1 row in set (0.00 sec)

mysql> source ../share/firewall_plugin_to_component.sql
```

We use `myfwdb` in the preceding example as the name of the firewall database; this value is almost certain to be different on your system. In addition, you may also need to adjust the path to the `share` directory.

###### Downgrading the MySQL Enterprise Firewall Component

This section describes how to downgrade an existing MySQL Enterprise Firewall component installation to the legacy firewall plugin (deprecated).

A downgrade from the firewall component to the firewall plugin consists of two parts:

* Preparation for the plugin and uninstallation of the firewall component

  This is performed by executing the SQL script `firewall_component_to_plugin.sql` in a **mysql** client session.

* Installation of the firewall plugin

  This is accomplished by running `linux_install_firewall.sql` or `win_install_firewall.sql` (also in the **mysql** client), depending on the platform.

`firewall_component_to_plugin.sql` must be run with the firewall database as the current database. You can ensure that this is the case, and then execute the script using the **mysql** client `source` command, as shown here:

```
SELECT @@component_firewall.database;
+-------------------------------+
| @@component_firewall.database |
+-------------------------------+
|                        myfwdb |
+-------------------------------+
1 row in set (0.00 sec)

mysql> USE myfwdb;
Database changed

mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| myfwdb     |
+------------+
1 row in set (0.00 sec)

mysql> source ../share/firewall_component_to_plugin.sql
```

The example shows `myfwdb` as the name of the firewall database; this is likely to be different on your system. Adjust the path shown here to the `share` directory as necessary to conform to the installation layout on your system.

`firewall_component_to_plugin.sql` terminates with the output shown here:

```
Restart mysqld with the following options:
--loose-mysql-firewall-database=database,
--loose-mysql-firewall-mode=mode,
--loose-mysql-firewall-reload-interval-seconds=seconds,
--loose-mysql-firewall-trace=trace,
and run win_install_firewall.sql or linux_install_firewall.sql on schema database.
```

Restart the MySQL server using the indicated options and values, then start a **mysql** client session and run `linux_install_firewall.sql` (Linux and other Unix platforms) or `win_install_firewall.sql` (Windows platforms). See Installing the MySQL Enterprise Firewall Plugin for more information about using these scripts to install the firewall plugin.

##### 8.4.8.2.3 Using the MySQL Enterprise Firewall Component

Before using the MySQL Enterprise Firewall component, install it according to the instructions provided in Section 8.4.8.2.2, “MySQL Enterprise Firewall Component Installation”.

This section describes how to configure the firewall component using SQL statements. Alternatively, MySQL Workbench 6.3.4 and later versions provide a graphical interface for firewall control. See MySQL Enterprise Firewall Interface.

* Enabling or Disabling the Firewall Plugin
* Scheduling Firewall Cache Reloads
* Assigning Firewall Privileges (Component)")
* Firewall Concepts
* Registering Firewall Profiles
* Monitoring the Firewall

###### Enabling or Disabling the Firewall Plugin

To enable or disable the firewall plugin, set the `component_firewall.enabled` system variable. By default, this is `ON` when the firewall component is installed. To set the initial firewall state explicitly at server startup, you can set the variable in an option file such as `my.cnf`, like this:

```
[mysqld]
component_firewall.enabled=ON
```

After modifying `my.cnf`, you must restart the server to cause the new setting to take effect. See Section 6.2.2.2, “Using Option Files”.

Alternatively, you can set and persist the firewall setting at runtime by executing either of the SQL statements shown here:

```
SET PERSIST component_firewall.enabled = OFF;
SET PERSIST component_firewall.enabled = ON;
```

`SET PERSIST` sets a value for the running MySQL instance, and saves the value, causing it to carry over to subsequent server restarts. To change a value for the running MySQL instance without having it carry over to subsequent restarts, use the `GLOBAL` keyword rather than `PERSIST`. See Section 15.7.6.1, “SET Syntax for Variable Assignment”, for more information.

###### Scheduling Firewall Cache Reloads

Each time the firewall component initializes, it loads data into its internal cache from the following tables (see MySQL Enterprise Firewall Component Tables):

* `firewall_group_allowlist`
* `firewall_groups`
* `firewall_membership`

Without restarting the server or reinstalling the server-side plugin, modification of data outside of the plugin is not reflected internally. The `component_firewall.reload_interval_seconds` system variable makes it possible to force memory cache reloads from tables at specified intervals. By default, the interval value is `0`, which disables such reloads.

To schedule regular cache reloads, first ensure that the `scheduler` component is installed and enabled (see Section 7.5.5, “Scheduler Component”). To check the status of the component, use a `SHOW VARIABLES` statement similar to this one:

```
mysql> SHOW VARIABLES LIKE 'component_scheduler%';
+-----------------------------+-------+
| Variable_name               | Value |
+-----------------------------+-------|
| component_scheduler.enabled | On    |
+-----------------------------+-------+
```

With the firewall plugin installed, set `component_firewall.reload_interval_seconds` at server startup to a number between 60 and `INT_MAX`, whose value is platform-specific. Values in the range `1` to `59` (inclusive) are reset to 60, with a warning, as shown here:

```
$> mysqld [server-options] --component_firewall.reload_interval_seconds=40
...
2023-08-31T17:46:35.043468Z 0 [Warning] [MY-015031] [Server] Plugin MYSQL_FIREWALL
reported: 'Invalid reload interval specified: 40. Valid values are 0 (off) or
greater than or equal to 60. Adjusting to 60.'
...
```

Alternatively, to set and persist this value at startup, precede the variable name with the `PERSIST_ONLY` keyword or the `@@PERSIST_ONLY.` qualifier, like this:

```
SET PERSIST_ONLY component_firewall.reload_interval_seconds = 120;
SET @@PERSIST_ONLY.component_firewall.reload_interval_seconds = 120;
```

After performing this modification, restart the server to cause the new setting to take effect.

###### Assigning Firewall Privileges (Component)

After the firewall component has been installed and configured, you should grant appropriate privileges to the MySQL account or accounts to be used for administering it. The assignment of privileges depends on which firewall operations an account should be permitted to perform, as listed here:

* Grant the `FIREWALL_EXEMPT` privilege to any account that should be exempt from firewall restrictions. This is useful, for example, for a database administrator who configures the firewall, to avoid the possibility of a misconfiguration causing even the administrator to be locked out and unable to execute statements.

* Grant the `FIREWALL_ADMIN` privilege to any account that should have full administrative firewall access. (Some administrative firewall functions can be invoked by accounts that have `FIREWALL_ADMIN` *or* the deprecated `SUPER` privilege, as indicated in the individual function descriptions.)

* Grant the `EXECUTE` privilege for the stored procedures in the firewall database (see MySQL Enterprise Firewall Component Stored Procedures). These may invoke administrative functions, so stored procedure access also requires the privileges indicated earlier that are needed for those functions.

Note

The `FIREWALL_EXEMPT` and `FIREWALL_ADMIN` privileges can be granted only while the firewall is installed because those privileges are defined by `component_firewall`.

###### Firewall Concepts

The MySQL server permits clients to connect and receives from them SQL statements to be executed. If the firewall is enabled, the server passes to it each incoming statement that does not immediately fail with a syntax error. Based on whether the firewall accepts the statement, the server executes it or returns an error to the client. This section describes how the firewall accomplishes the task of accepting or rejecting statements.

* Firewall Profiles
* Firewall Statement Matching
* Profile Operational Modes
* Firewall Statement Handling When Multiple Profiles Apply

###### Firewall Profiles

The firewall uses a registry of profiles that determine whether to permit statement execution. Profiles have these attributes:

* An allowlist. The allowlist is the set of rules that defines which statements are acceptable to the profile.

* A current operational mode. The mode enables the profile to be used in different ways. For example: the profile can be placed in training mode to establish the allowlist; the allowlist can be used for restricting statement execution or intrusion detection; the profile can be disabled entirely.

* The firewall supports group profiles which can have multiple accounts as members, with the profile allowlist applying equally to all members.

Initially, no profiles exist, so by default, the firewall accepts all statements and has no effect on which statements MySQL accounts can execute. To apply firewall protective capabilities, explicit action is required. This includes the following steps:

* Register one or more profiles with the firewall.
* Train the firewall by establishing the allowlist for each profile; that is, the types of statements the profile permits clients to execute.

* Place the trained profiles in `PROTECTING` mode to harden MySQL against unauthorized statement execution. It does this first by associating each client session with a specific user name and host name combination, known as the *session account*. Then, for each client connection, the firewall uses the session account to determine which profile or profiles apply to incoming statements from this client, accepting only those statements which are permitted by the applicable profile allowlists.

Note

The firewall component does not support account profiles. For assistance with converting existing account profiles prior to upgrading from the firewall plugin, see Migrating Account Profiles to Group Profiles.

The profile-based protection afforded by the firewall enables implementation of strategies such as those listed here:

* If an application has unique protection requirements, have it use an account not used for any other purpose, and set up a group profile for that account.

* If related applications share protection requirements, associate each application with its own account, then add these application accounts as members of the same group profile.

###### Firewall Statement Matching

Statement matching performed by the firewall does not use SQL statements as received from clients. Instead, the server converts incoming statements to normalized digest form and firewall operation uses these digests. The benefit of statement normalization is that it enables similar statements to be grouped and recognized using a single pattern. For example, these statements are distinct from each other:

```
SELECT first_name, last_name FROM customer WHERE customer_id = 1;
select first_name, last_name from customer where customer_id = 99;
SELECT first_name, last_name FROM customer WHERE customer_id = 143;
```

But all of them have the same normalized digest form, shown here:

```
SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?
```

By using normalization, firewall allowlists can store digests that each match many different statements received from clients. For more information about normalization and digests, see Section 29.10, “Performance Schema Statement Digests and Sampling”.

Warning

Setting `max_digest_length` to `0` disables digest production, which also disables server functionality that requires digests, such as MySQL Enterprise Firewall.

###### Profile Operational Modes

Each profile registered with the firewall has its own operational mode, chosen from the following values:

* `OFF`: Disables the profile. The firewall considers the profile inactive and ignores it.

* `RECORDING`: Firewall training mode. Incoming statements received from a client that matches the profile are considered acceptable for the profile and become part of its “fingerprint”. The firewall records the normalized digest form of each statement to learn the acceptable statement patterns for the profile. Each pattern is a rule; the profile allowlist consists of the union of all such rules.

* `PROTECTING`: The profile allows or prevents statement execution. The firewall matches incoming statements against the profile allowlist, accepting only statements that match and rejecting those that do not. After training a profile in `RECORDING` mode, switch it to `PROTECTING` mode to harden MySQL against access by statements that deviate from the allowlist. If the `component_firewall.trace` system variable is enabled, the firewall also writes any rejected statements to the error log.

* `DETECTING`: Detects but not does not block intrusions (statements that are suspicious because they match nothing in the profile allowlist). In `DETECTING` mode, the firewall writes suspicious statements to the error log but accepts them without denying access.

When a profile is assigned any of the preceding mode values, the firewall stores the mode in the profile. Firewall mode-setting operations also permit the mode value `RESET`, but this value is not stored: setting a given profile to `RESET` mode causes the firewall to delete all rules for this profile, and then set its mode to `OFF`.

Note

Messages written to the error log in `DETECTING` mode or because `mysql_firewall_trace` is enabled are written as Notes, which are information messages. To ensure that such messages appear in the error log and are not discarded, make sure that error-logging verbosity is sufficient to include information messages. For example, if you are using priority-based log filtering, as described in Section 7.4.2.5, “Priority-Based Error Log Filtering (log\_filter\_internal)”"), set `log_error_verbosity` to `3`.

###### Firewall Statement Handling When Multiple Profiles Apply

For simplicity, later sections that describe how to set up profiles take the perspective that the firewall matches incoming statements from a client against only a single profile, either a group profile or account profile. But firewall operation can be more complex:

* A group profile can include multiple accounts as members.

* An account can be a member of multiple group profiles.
* Multiple profiles can match a given client.

The following description covers the general case of how the firewall operates, when potentially multiple profiles apply to incoming statements.

As previously mentioned, MySQL associates each client session with a specific user name and host name combination known as the *session account*. The firewall matches the session account against registered profiles to determine which profiles apply to handling incoming statements from the session:

* The firewall ignores inactive profiles (profiles with a mode of `OFF`).

* The session account matches every active group profile that includes a member having the same user and host. There can be more than one such group profile.

* The session account matches an active account profile having the same user and host, if there is one. There is at most one such account profile.

In other words, the session account can match 0 or more active group profiles, and 0 or 1 active account profiles. This means that 0, 1, or multiple firewall profiles are applicable to a given session, for which the firewall handles each incoming statement as follows:

* If there is no applicable profile, the firewall imposes no restrictions and accepts the statement.

* If there are applicable profiles, their modes determine statement handling:

  + The firewall records the statement in the allowlist of each applicable profile that is in `RECORDING` mode.

  + The firewall writes the statement to the error log for each applicable profile in `DETECTING` mode for which the statement is suspicious (does not match the profile allowlist).

  + The firewall accepts the statement if at least one applicable profile is in `RECORDING` or `DETECTING` mode (those modes accept all statements), or if the statement matches the allowlist of at least one applicable profile in `PROTECTING` mode. Otherwise, the firewall rejects the statement (and writes it to the error log if the `mysql_firewall_trace` system variable is enabled).

With that description in mind, the next sections revert to the simplicity of the situations when a single group profile or a single account profile apply, and cover how to set up each type of profile.

###### Registering Firewall Profiles

MySQL Enterprise Firewall supports registration of group profiles. A group profile can have multiple accounts as its members. To use a firewall group profile to protect MySQL against incoming statements from a given account, follow these steps:

1. Register the profile and put it in `RECORDING` mode.

2. Add a member account to the profile.
3. Connect to the MySQL server using this member account and execute statements to be learned. This trains the profile and establishes the rules that form the profile allowlist.

4. Add any other accounts that are to be group members to the profile.

5. Switch the profile to `PROTECTING` mode. When a client connects to the server using any account that is a member of the group, the profile allowlist restricts statement execution.

6. Should additional training be necessary, switch the profile to `RECORDING` mode again, update its allowlist with new statement patterns, then switch it back to `PROTECTING` mode.

Observe these guidelines for account references relating to the MySQL Enterprise Firewall plugin:

* Take note of the context in which account references occur. To name an account for firewall operations, specify it as a single quoted string (`'user_name@host_name'`). This differs from the usual MySQL convention for statements such as `CREATE USER` and `GRANT`, for which you quote the user and host parts of an account name separately (`'user_name'@'host_name'`).

  The requirement for naming accounts as a single quoted string for firewall operations means that you cannot use any account whose user name contains the `@` character.

* The firewall assesses statements against accounts represented by actual user and host names as authenticated by the server. When registering accounts in profiles, do not use wildcard characters or netmasks. The reasons for this are described here:

  + Suppose that an account named `me@%.example.org` exists and a client uses it to connect to the server from the host `abc.example.org`.

  + The account name contains a `%` wildcard character, but the server authenticates the client as having the user name `me` and host name `abc.example.com`, and that is what the firewall sees.

  + Consequently, the account name to use for firewall operations is `me@abc.example.org` rather than `me@%.example.org`.

The following procedure shows how to register a group profile with the firewall, train the firewall to know the acceptable statements for that profile (its allowlist), use the profile to protect MySQL against execution of unacceptable statements, and add and remove group members. The example uses the group profile name `fwgrp`. The example profile is presumed for use by clients of an application that accesses tables in the `sakila` database (available at https://dev.mysql.com/doc/index-other.html).

Use an administrative MySQL account to perform the steps in this procedure, except those steps designated for execution by member accounts of the firewall group profile. For statements executed by member accounts, the default database should be `sakila`. (You can use a different database by adjusting the instructions accordingly.)

1. If necessary, create the accounts that are to be members of the `fwgrp` group profile and grant them appropriate access privileges. Statements for one member are shown here (choose an appropriate password):

   ```
   CREATE USER 'member1'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'member1'@'localhost';
   ```

2. Use the stored procedure `set_firewall_group_mode()` to register the group profile with the firewall and place the profile in `RECORDING` (training) mode, as shown here:

   ```
   CALL firewall-database.set_firewall_group_mode('fwgrp', 'RECORDING');
   ```

3. Use the stored procedure `firewall_group_enlist()` to add an initial member account for use in training the group profile allowlist:

   ```
   CALL firewall-database.firewall_group_enlist('fwgrp', 'member1@localhost');
   ```

4. To train the group profile using the initial member account, connect to the server as `member1` from the server host so that the firewall sees a session account for `member1@localhost`. Then execute some statements to be considered legitimate for the profile. For example:

   ```
   SELECT title, release_year FROM film WHERE film_id = 1;
   UPDATE actor SET last_update = NOW() WHERE actor_id = 1;
   SELECT store_id, COUNT(*) FROM inventory GROUP BY store_id;
   ```

   The firewall receives the statements from the `member1@localhost` account. Because that account is a member of the `fwgrp` profile, which is in `RECORDING` mode, the firewall interprets the statements as applicable to `fwgrp` and records the normalized digest form of the statements as rules in the `fwgrp` allowlist. Those rules then apply to all accounts that are members of `fwgrp`.

   Note

   Until the `fwgrp` group profile receives statements in `RECORDING` mode, its allowlist is empty, which is equivalent to “deny all” and means that no statement can match. This has the following implications:

   * The group profile cannot be switched to `PROTECTING` mode, since it would then reject every statement, effectively prohibiting the accounts that are group members from executing any statements whatsoever.

   * The group profile can be switched to `DETECTING` mode. In this case, the profile accepts every statement but logs it as suspicious.

5. At this point, the group profile information is cached, including its name, membership, and allowlist. To see this information, query the Performance Schema firewall tables, like this:

   ```
   mysql> SELECT MODE FROM performance_schema.firewall_groups
       -> WHERE NAME = 'fwgrp';
   +-----------+
   | MODE      |
   +-----------+
   | RECORDING |
   +-----------+

   mysql> SELECT * FROM performance_schema.firewall_membership
       -> WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   +----------+-------------------+

   mysql> SELECT RULE FROM performance_schema.firewall_group_allowlist
       -> WHERE NAME = 'fwgrp';
   +----------------------------------------------------------------------+
   | RULE                                                                 |
   +----------------------------------------------------------------------+
   | SELECT @@`version_comment` LIMIT ?                                   |
   | UPDATE `actor` SET `last_update` = NOW ( ) WHERE `actor_id` = ?      |
   | SELECT `title` , `release_year` FROM `film` WHERE `film_id` = ?      |
   | SELECT `store_id` , COUNT ( * ) FROM `inventory` GROUP BY `store_id` |
   +----------------------------------------------------------------------+
   ```

   See Section 29.12.17, “Performance Schema Firewall Tables”, for more information about these tables.

   Note

   The `@@version_comment` rule comes from a statement sent automatically by the **mysql** client when it connects to the server.

   Important

   Train the firewall under conditions matching application use. For example, to determine server characteristics and capabilities, a given MySQL connector might send statements to the server at the beginning of each session. If an application normally is used through that connector, train the firewall using the connector, too. That enables those initial statements to become part of the allowlist for the group profile associated with the application.

6. Invoke `set_firewall_group_mode()` again to switch the group profile to `PROTECTING` mode:

   ```
   CALL firewall-database.set_firewall_group_mode('fwgrp', 'PROTECTING');
   ```

   Important

   Switching the group profile out of `RECORDING` mode synchronizes its cached data to the firewall database tables that provide persistent underlying storage. If you do not switch the mode for a profile that is being recorded, the cached data is not written to persistent storage and is lost when the server is restarted.

7. Add any other accounts that should be members of this group profile, like this:

   ```
   CALL firewall-database.firewall_group_enlist('fwgrp', 'member2@localhost');
   CALL firewall-database.firewall_group_enlist('fwgrp', 'member3@localhost');
   CALL firewall-database.firewall_group_enlist('fwgrp', 'member4@localhost');
   ```

   The profile allowlist trained using the `member1@localhost` account now also applies to the accounts just added.

8. To verify the updated group membership, query the `firewall_membership` table again:

   ```
   mysql> SELECT * FROM performance_schema.firewall_membership
       -> WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   | fwgrp    | member2@localhost |
   | fwgrp    | member3@localhost |
   | fwgrp    | member4@localhost |
   +----------+-------------------+
   ```

9. Test the group profile against the firewall by using any account in the group to execute some acceptable and unacceptable statements. The firewall matches each statement from this account against the profile allowlist and accepts or rejects it based on the result, as described here:

   * This statement is not identical to any of the training statements but produces the same normalized statement as one of them, so the firewall accepts it:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98;
     +-------------------+--------------+
     | title             | release_year |
     +-------------------+--------------+
     | BRIGHT ENCOUNTERS |         2006 |
     +-------------------+--------------+
     ```

   * These statements match nothing in the allowlist, so the firewall rejects each one with an error:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   * If `component_firewall.trace` is enabled, the firewall also writes rejected statements to the error log. These log messages may be helpful in identifying the source of attacks, should that be necessary.

10. Should members need to be removed from the group profile, use the stored procedure `firewall_group_delist()`, like this:

    ```
    CALL firewall-database.firewall_group_delist('fwgrp', 'member3@localhost');
    ```

The firewall group profile now is trained for member accounts. When clients connect using any account in the group and attempt to execute statements, the profile protects MySQL against statements not matched by the profile allowlist.

The procedure just shown added only one member to the group profile before training its allowlist. Doing so provides better control over the training period by limiting which accounts can add new acceptable statements to the allowlist. Should additional training be necessary, you can switch the profile back to `RECORDING` mode, like this:

```
CALL firewall-database.set_firewall_group_mode('fwgrp', 'RECORDING');
```

You should keep in mind that this enables any member of the group to execute statements and to add them to the allowlist. To limit the additional training to a single group member, call `set_firewall_group_mode_and_user()` instead. This is like `set_firewall_group_mode()` but takes an additional argument specifying which account is permitted to train the profile in `RECORDING` mode. For example, to enable training only by `member4@localhost`, call `set_firewall_group_mode_and_user()` as shown here:

```
CALL firewall-database.set_firewall_group_mode_and_user('fwgrp', 'RECORDING', 'member4@localhost');
```

This enables additional training by the specified account without having to remove the other group members. (They can execute statements, but the statements are not added to the allowlist.) You should also keep in mind that, in `RECORDING` mode, the other members can execute *any* statement.

Note

To avoid unexpected behavior when a particular account is specified as the training account for a group profile, always ensure that account is a member of the group.

After the additional training, set the group profile back to `PROTECTING` mode, like this:

```
CALL firewall-database.set_firewall_group_mode('fwgrp', 'PROTECTING');
```

The training account established by `set_firewall_group_mode_and_user()` is saved in the group profile, so that the firewall remembers it in case more training is needed later. Thus, if you call `set_firewall_group_mode()` (which takes no training account argument), the current profile training account, `member4@localhost`, remains unchanged.

If desired, you can clear the training account, and enable all group members to perform training in `RECORDING` mode, by calling `set_firewall_group_mode_and_user()` and passing `NULL` for the account name, as shown here:

```
CALL firewall-database.set_firewall_group_mode_and_user('fwgrp', 'RECORDING', NULL);
```

It is possible to detect intrusions by logging nonmatching statements as suspicious without denying access. First, put the group profile in `DETECTING` mode, like this:

```
CALL firewall-database.set_firewall_group_mode('fwgrp', 'DETECTING');
```

Then, using a member account, execute a statement that does not match the group profile allowlist. In `DETECTING` mode, the firewall permits the nonmatching statement to execute, as shown here:

```
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

In addition, the firewall writes a message to the error log.

To disable a group profile, change its mode to `OFF`, like this:

```
CALL firewall-database.set_firewall_group_mode('fwgrp', 'OFF');
```

To forget all training for a profile and disable it, reset it:

```
CALL firewall-database.sp_set_firewall_group_mode('fwgrp', 'RESET');
```

The reset operation causes the firewall to delete all rules for this profile, and to set its mode to `OFF`.

###### Monitoring the Firewall

You can assess firewall activity by examine its associated status variables. For example, after performing the procedure shown earlier to train and protect the `fwgrp` group profile (see Registering Firewall Profiles), these variables have the values shown in the output of this `SHOW GLOBAL STATUS` statement:

```
mysql> SHOW GLOBAL STATUS LIKE 'firewall%';
+----------------------------+-------+
| Variable_name              | Value |
+----------------------------+-------+
| firewall_access_denied     | 3     |
| firewall_access_granted    | 4     |
| firewall_access_suspicious | 1     |
| firewall_cached_entries    | 4     |
+----------------------------+-------+
```

These variables indicate the numbers of statements rejected, accepted, logged as suspicious, and added to the cache, respectively. `firewall_access_granted` is 4 due to the `@@version_comment` statement sent by the **mysql** client each of the three times the registered account connected to the server, plus the `SHOW TABLES` statement that was not blocked in `DETECTING` mode.

##### 8.4.8.2.4 MySQL Enterprise Firewall Component Reference

The following sections provide reference information for elements of the MySQL Enterprise Firewall component, including tables, stored routines, system and status variables, and SQL scripts.

* MySQL Enterprise Firewall Component Tables
* MySQL Enterprise Firewall Component Stored Procedures
* MySQL Enterprise Firewall Component Functions
* MySQL Enterprise Firewall Component System Variables
* MySQL Enterprise Firewall Component Status Variables
* MySQL Enterprise Firewall Component Scripts

###### MySQL Enterprise Firewall Component Tables

the MySQL Enterprise Firewall component maintains profile information on a per-group basis, using tables in the firewall database for persistent storage and Information Schema tables to provide views into in-memory cached data. When enabled, the firewall bases operational decisions on the cached data. The firewall database can be the `mysql` system database or one determined when installing the component (see Installing the MySQL Enterprise Firewall Component).

Tables in the firewall database are covered in this section. For information about MySQL Enterprise Firewall Performance Schema tables, see Section 29.12.17, “Performance Schema Firewall Tables”.

The MySQL Enterprise Firewall component maintains group profile information using tables in the firewall database for persistent storage, and Performance Schema tables to provide views into in-memory, cached data.

Each system and Performance Schema table is accessible only by accounts that have the `SELECT` privilege for it.

The `firewall-database.firewall_groups` table lists names and operational modes of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_groups` table having similar but not necessarily identical columns):

* `NAME`

  The group profile name.

* `MODE`

  The current operational mode for the profile. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, and `RECORDING`. For details about their meanings, see Firewall Concepts.

* `USERHOST`

  The training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or a non-`NULL` account that has the format `user_name@host_name`:

  + If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.

  + If the value is non-`NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

The `firewall-database.firewall_group_allowlist` table lists allowlist rules of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_group_allowlist` table having similar but not necessarily identical columns):

* `NAME`

  The group profile name.

* `RULE`

  A normalized statement indicating an acceptable statement pattern for the profile. A profile allowlist is the union of its rules.

* `ID`

  An integer column that is a primary key for the table.

The `firewall-database.firewall_membership` table lists the members (accounts) of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_membership` table having similar but not necessarily identical columns):

* `GROUP_ID`

  The group profile name.

* `MEMBER_ID`

  The name of an account that is a member of the profile.

###### MySQL Enterprise Firewall Component Stored Procedures

The MySQL Enterprise Firewall component provides the following stored procedures for performing management operations on firewall group profiles:

* `sp_firewall_group_delist(group, user)`

  This stored procedure removes an account from a firewall group profile.

  If the call succeeds, the change in group membership is made to both the in-memory cache and persistent storage.

  Arguments:

  + *`group`*: The name of the affected group profile.

  + *`user`*: The account to remove, as a string in `user_name@host_name` format.

  Example:

  ```
  CALL mysql.sp_firewall_group_delist('g', 'fwuser@localhost');
  ```

* `sp_firewall_group_enlist(group, user)`

  This stored procedure adds an account to a firewall group profile. It is not necessary to register the account itself with the firewall before adding the account to the group.

  If the call succeeds, the change in group membership is made to both the in-memory cache and persistent storage.

  Arguments:

  + *`group`*: The name of the affected group profile.

  + *`user`*: The account to add, as a string in `user_name@host_name` format.

  Example:

  ```
  CALL mysql.sp_firewall_group_enlist('g', 'fwuser@localhost');
  ```

* `sp_firewall_group_remove(name)`

  Removes the the group having the supplied name.

* `sp_firewall_group_rename(oldname, newname)`

  Renames the group named *`oldname`* to *`newname`*.

* `sp_reload_firewall_group_rules(group)`

  This stored procedure provides control over firewall operation for individual group profiles. The procedure uses firewall administrative functions to reload the in-memory rules for a group profile from the rules stored in the `firewall-database.firewall_group_allowlist` table.

  Arguments:

  + *`group`*: The name of the affected group profile.

  Example:

  ```
  CALL mysql.sp_reload_firewall_group_rules('myapp');
  ```

  Warning

  This procedure clears the group profile in-memory allowlist rules before reloading them from persistent storage, and sets the profile mode to `OFF`. If the profile mode was not `OFF` prior to the `sp_reload_firewall_group_rules()` call, use `sp_set_firewall_group_mode()` to restore its previous mode after reloading the rules. For example, if the profile was in `PROTECTING` mode, that is no longer true after calling `sp_reload_firewall_group_rules()` and you must set it to `PROTECTING` again explicitly.

* `sp_set_firewall_group_mode(group, mode)`

  This stored procedure establishes the operational mode for a firewall group profile, after registering the profile with the firewall if it was not already registered. The procedure also invokes firewall administrative functions as necessary to transfer firewall data between the cache and persistent storage. This procedure may be called even if the `mysql_firewall_mode` system variable is `OFF`, although setting the mode for a profile has no operational effect until the firewall is enabled.

  If the profile previously existed, any recording limitation for it remains unchanged. To set or clear the limitation, call `sp_set_firewall_group_mode_and_user()` instead.

  Arguments:

  + *`group`*: The name of the affected group profile.

  + *`mode`*: The operational mode for the profile, as a string. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, and `RECORDING`. For details about their meanings, see Firewall Concepts.

  Example:

  ```
  CALL mysql.sp_set_firewall_group_mode('myapp', 'PROTECTING');
  ```

* `sp_set_firewall_group_mode_and_user(group, mode, user)`

  This stored procedure registers a group with the firewall and establishes its operational mode, similar to `sp_set_firewall_group_mode()`, but also specifies the training account to be used when the group is in `RECORDING` mode.

  Arguments:

  + *`group`*: The name of the affected group profile.

  + *`mode`*: The operational mode for the profile, as a string. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, and `RECORDING`. For details about their meanings, see Firewall Concepts.

  + *`user`*: The training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or a non-`NULL` account that has the format `user_name@host_name`:

    - If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.

    - If the value is non-`NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

  Example:

  ```
  CALL mysql.sp_set_firewall_group_mode_and_user('myapp', 'RECORDING', 'myapp_user1@localhost');
  ```

###### MySQL Enterprise Firewall Component Functions

MySQL Enterprise Firewall administrative functions provide an API for lower-level tasks such as synchronizing the firewall cache with the underlying system tables.

*Under normal operation, these functions are invoked by the firewall stored procedures, not directly by users.* For that reason, these function descriptions do not include details such as information about their arguments and return types.

These functions perform management operations on firewall group profiles:

* `firewall_group_delist(group, user)`

  This function removes an account from a group profile. It requires the `FIREWALL_ADMIN` privilege.

  Example:

  ```
  SELECT firewall_group_delist('g', 'fwuser@localhost');
  ```

* `firewall_group_enlist(group, user)`

  This function adds an account to a group profile. It requires the `FIREWALL_ADMIN` privilege.

  It is not necessary to register the account itself with the firewall before adding the account to the group.

  Example:

  ```
  SELECT firewall_group_enlist('g', 'fwuser@localhost');
  ```

* `mysql_firewall_flush_status()`

  This function resets several firewall status variables to 0:

  + `firewall_access_denied`
  + `firewall_access_granted`
  + `firewall_access_suspicious`

  This function requires the `FIREWALL_ADMIN` privilege or the deprecated `SUPER` privilege.

  Example:

  ```
  SELECT mysql_firewall_flush_status();
  ```

* `read_firewall_group_allowlist(group, rule)`

  This aggregate function updates the recorded-statement cache for the named group profile through a `SELECT` statement on the `firewall-database.firewall_group_allowlist` table. It requires the `FIREWALL_ADMIN` privilege.

  Example:

  ```
  SELECT read_firewall_group_allowlist('my_fw_group', fgw.rule)
  FROM mysql.firewall_group_allowlist AS fgw
  WHERE NAME = 'my_fw_group';
  ```

* `read_firewall_groups(group, mode, user)`

  This aggregate function updates the firewall group profile cache through a `SELECT` statement on the `firewall-database.firewall_groups` table. It requires the `FIREWALL_ADMIN` privilege.

  Example:

  ```
  SELECT read_firewall_groups('g', 'RECORDING', 'fwuser@localhost')
  FROM mysql.firewall_groups;
  ```

* `set_firewall_group_mode(group, mode[, user])`

  This function manages the group profile cache, establishes the profile operational mode, and optionally specifies the profile training account. It requires the `FIREWALL_ADMIN` privilege.

  If the optional *`user`* argument is not given, any previous *`user`* setting for the profile remains unchanged. To change the setting, call the function with a third argument.

  If the optional *`user`* argument is given, it specifies the training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or a non-`NULL` account that has the format `user_name@host_name`:

  + If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.

  + If the value is non-`NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

  Example:

  ```
  SELECT set_firewall_group_mode('g', 'DETECTING');
  ```

###### MySQL Enterprise Firewall Component System Variables

The MySQL Enterprise Firewall component provides the system variables listed in this section. These variables are unavailable unless the component is installed (see Section 8.4.8.1.2, “Installing or Uninstalling the MySQL Enterprise Firewall Plugin”).

* `component_firewall.database`

  <table frame="box" rules="all" summary="Properties for component_firewall.database"><tbody><tr><th>System Variable</th> <td><code>component_firewall.database</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql</code></td> </tr></tbody></table>

  The name of the database used for MySQL Enterprise Firewall component tables. For more information about these tables, see MySQL Enterprise Firewall Component Tables.

* `component_firewall.enabled`

  <table frame="box" rules="all" summary="Properties for component_firewall.enabled"><tbody><tr><th>System Variable</th> <td><code>component_firewall.enabled</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Whether the MySQL Enterprise Firewall component is enabled.

* `component_firewall.reload_interval_seconds`

  <table frame="box" rules="all" summary="Properties for component_firewall.reload_interval_seconds"><tbody><tr><th>System Variable</th> <td><code>component_firewall.reload_interval_seconds</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>60 (0 = no reload)</code></td> </tr><tr><th>Maximum Value</th> <td><code>INT_MAX</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  Time in seconds between reloads of the MySQL Enterprise Firewall internal cache. Set to 0 to disable. Values from 1 to 59 inclusive are rounded up to 60.

* `component_firewall.trace`

  <table frame="box" rules="all" summary="Properties for component_firewall.trace"><tbody><tr><th>System Variable</th> <td><code>component_firewall.trace</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether the firewall component trace is enabled or disabled (the default). When the trace is enabled, for `PROTECTING` mode, the firewall writes rejected statements to the error log.

###### MySQL Enterprise Firewall Component Status Variables

The MySQL Enterprise Firewall component provides the status variables listed in this section; you can them to obtain information about the firewall component's operational status.

Firewall component status variables are set to 0 whenever the component is installed or the server is started.

* `firewall_access_denied`

  The number of statements rejected by the MySQL Enterprise Firewall component.

* `firewall_access_granted`

  The number of statements accepted by the MySQL Enterprise Firewall component.

* `firewall_access_suspicious`

  The number of statements logged by the MySQL Enterprise Firewall component as suspicious for users in `DETECTING` mode.

* `firewall_cached_entries`

  The number of statements recorded by the MySQL Enterprise Firewall component, including duplicates.

###### MySQL Enterprise Firewall Component Scripts

This section contains information about SQL scripts provided by the MySQL Enterprise Firewall component.

* `install_component_firewall.sql`

  This script installs all elements of the MySQL Enterprise Firewall component, performing the steps listed here:

  1. Checks whether the firewall plugin is installed; if so, stops with an error.

  2. Creates the component tables (see MySQL Enterprise Firewall Component Tables).

  3. Installs the component.
  4. Creates the component's stored procedures (see MySQL Enterprise Firewall Component Stored Procedures.

  See Installing the MySQL Enterprise Firewall Component, for usage instructions.

* `firewall_plugin_to_component.sql`

  This script upgrades an existing firewall plugin installation to an installation of the firewall component. It performs the steps listed here:

  1. Runs `firewall_profile_migration.sql` (provided by the firewall plugin) to migrate account profiles to group profiles. (The firewall component does not support account profiles.)

  2. Uninstalls the firewall plugin using `uninstall_firewall.sql` (also provided by the firewall plugin).

  3. Drops the plugin's stored procedures and functions.

  4. Drops the `firewall_whitelist` and `firewall_users` tables.

  5. Installs the firewall component using `install_component_firewall.sql`, skipping the check for the plugin.

  Note

  If the firewall plugin was loaded using `--plugin-load-add`, you must remove it from that option prior to running the script.

  See Upgrading to the MySQL Enterprise Firewall Component, for additional information and instructions.

* `firewall_component_to_plugin.sql`

  This script can be used to perform a downgrade from the MySQL Enterprise Firewall component to the firewall plugin. `firewall_component_to_plugin.sql` performs the following actions:

  1. Uninstalls the firewall component using `uninstall_component_firewall.sql`.

  2. Drops the component's stored procedures and functions.

  3. Creates the `firewall_whitelist` and `firewall_users` tables.

  4. Creates the plugin's stored procedures and functions.

  See Downgrading the MySQL Enterprise Firewall Component, for usage and other information.

* `uninstall_component_firewall.sql`

  Run this script to remove an installation of the MySQL Enterprise Firewall component. The script performs the steps listed here:

  1. Uninstalls the firewall component tables.
  2. Drops the component's stored procedures and functions.

  3. Uninstalls the firewall component.

  For usage information, see Uninstalling the MySQL Enterprise Firewall Component.
