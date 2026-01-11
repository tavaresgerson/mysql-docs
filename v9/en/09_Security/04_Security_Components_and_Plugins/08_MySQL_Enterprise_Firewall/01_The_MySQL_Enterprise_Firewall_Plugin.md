#### 8.4.8.1 The MySQL Enterprise Firewall Plugin

This section contains information about the MySQL Enterprise Firewall plugin.

Important

The firewall plugin is deprecated in favor of a firewall component which implements most of the same functionality but uses the superior component architecture. For general information about the firewall component, see Section 8.4.8.2, “The MySQL Enterprise Firewall Component”; for information about upgrading the firewall plugin to the firewall component (recommended), see Upgrading to the MySQL Enterprise Firewall Component.

##### 8.4.8.1.1 Elements of MySQL Enterprise Firewall (Plugin)

MySQL Enterprise Firewall is based on a plugin library that includes these elements:

* A server-side plugin named `MYSQL_FIREWALL` examines SQL statements before they execute and, based on the registered firewall profiles, renders a decision whether to execute or reject each statement.

* The `MYSQL_FIREWALL` plugin, along with server-side plugins named `MYSQL_FIREWALL_USERS` and `MYSQL_FIREWALL_WHITELIST`, implement Performance Schema and Information Schema tables that provide views into the registered profiles.

* Profiles are cached in memory for better performance. Tables in the firewall database provide backing storage of firewall data for persistence of profiles across server restarts. The firewall database can be the `mysql` system database (the default) or a custom schema (see Installing the MySQL Enterprise Firewall Plugin).

* Stored procedures perform tasks such as registering firewall profiles, establishing their operational modes, and managing transfer of firewall data between the cache and persistent storage.

* Administrative functions provide an API for lower-level tasks such as synchronizing the cache with persistent storage.

* System variables and status variables specific to the firewall plugin enable firewall configuration and provide runtime operational information, respectively.

* The `FIREWALL_ADMIN` privilege enables users to administer firewall rules for any user; `FIREWALL_USER` (deprecated) allows users to administer their own firewall rules.

  Note

  The `FIREWALL_USER` privilege is not supported by the MySQL Enterprise Firewall component.

* The `FIREWALL_EXEMPT` privilege exempts a user from firewall restrictions. This is useful, for example, for any database administrator who configures the firewall, to avoid the possibility of a misconfiguration causing even the administrator to be locked out and unable to execute statements.

##### 8.4.8.1.2 Installing or Uninstalling the MySQL Enterprise Firewall Plugin

MySQL Enterprise Firewall plugin installation is a one-time operation that installs the elements described in Section 8.4.8.1.1, “Elements of MySQL Enterprise Firewall (Plugin)”"). Installation can be performed using a graphical interface or manually:

* On Windows, MySQL Configurator includes an option to enable MySQL Enterprise Firewall for you.

* MySQL Workbench 6.3.4 or higher can install the MySQL Enterprise Firewall plugin, enable or disable an installed firewall, or uninstall the firewall.

* Manual MySQL Enterprise Firewall installation involves running a script located in the `share` directory of your MySQL installation.

Important

Read this entire section before following its instructions. Parts of the procedure differ depending on your environment.

Note

If installed, the MySQL Enterprise Firewall plugin involves some minimal overhead even when disabled. To avoid this overhead, do not install the plugin unless you plan to use it.

For usage instructions, see Section 8.4.8.1.3, “Using the MySQL Enterprise Firewall Plugin”. For reference information, see Section 8.4.8.1.4, “MySQL Enterprise Firewall Plugin Reference”.

* Installing the MySQL Enterprise Firewall Plugin
* Uninstalling the MySQL Enterprise Firewall Plugin

###### Installing the MySQL Enterprise Firewall Plugin

If the MySQL Enterprise Firewall plugin from an older version of MySQL is already installed, uninstall it using the instructions given later in this section, then restart the server before installing the current version. In this case, it is also necessary to re-register the configuration.

On Windows, you can use Section 2.3.2, “Configuration: Using MySQL Configurator” to install the MySQL Enterprise Firewall plugin by checking the Enable MySQL Enterprise Firewall check box from the `Type and Networking` tab. (Open Firewall port for network access has a different purpose. It refers to Windows Firewall and controls whether Windows blocks the TCP/IP port on which the MySQL server listens for client connections.)

To install the MySQL Enterprise Firewall plugin using MySQL Workbench, see MySQL Enterprise Firewall Interface.

To install the firewall plugin manually, look in the `share` directory of your MySQL installation and choose the script that is appropriate for your platform from those listed here:

* `win_install_firewall.sql`
* `linux_install_firewall.sql`

The installation script creates stored procedures and tables in the firewall database you specify when you run the script. The `mysql` system database is the default location, but we recommend that you create and use a custom schema specifically for this purpose.

To use the `mysql` system database, run the script as follows from the command line. The example here uses the Linux installation script. Make any substitutions appropriate for your system.

```
$> mysql -u root -p -D mysql < linux_install_firewall.sql
Enter password: (enter root password here)
```

To create and use a custom schema with the script, do the following:

1. Start the server with the `--loose-mysql-firewall-database=database-name` option. Insert the name of the custom schema to be used as the firewall database.

   Prefixing the option name with `--loose`, causes the server to issue a warning rather than to terminate with an error due to there being (as yet) no such database.

2. Invoke the MySQL client program and create the custom schema on the server, like this:

   ```
   mysql> CREATE DATABASE IF NOT EXISTS database-name;
   ```

3. Run the installation script, specifying by name the custom schema just created as the firewall database:

   ```
   $> mysql -u root -p -D database-name < linux_install_firewall.sql
   Enter password: (enter root password here)
   ```

Installing MySQL Enterprise Firewall either using a graphical interface or manually should enable the firewall. To verify this, connect to the server and execute the statement shonw here:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'mysql_firewall_mode';
+---------------------+-------+
| Variable_name       | Value |
+---------------------+-------+
| mysql_firewall_mode | ON    |
+---------------------+-------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

Note

To use the MySQL Enterprise Firewall plugin in the context of source/replica replication, Group Replication, or InnoDB Cluster, you must prepare any replica nodes prior to running the installation script on the source node. This is necessary because the `INSTALL PLUGIN` statements in the script are not replicated.

1. On each replica node, extract the `INSTALL PLUGIN` statements from the installation script and execute them manually.

2. On the source node, run the installation script appropriate to your platform, as described previously.

###### Uninstalling the MySQL Enterprise Firewall Plugin

The MySQL Enterprise Firewall plugin can be uninstalled using MySQL Workbench, or manually.

To uninstall the MySQL Enterprise Firewall plugin using MySQL Workbench 6.3.4 or later, see MySQL Enterprise Firewall Interface, in Chapter 33, *MySQL Workbench*.

To uninstall the firewall plugin from the command line, run the uninstall script located in the `share` directory of your MySQL installation. This example specifies `mysql` as the firewall database:

```
$> mysql -u root -p -D mysql < uninstall_firewall.sql
Enter password: (enter root password here)
```

If you created a custom schema when you installed the firewall plugin, run the uninstall script as shown here, substituting the schema name for *`database-name`*:

```
$> mysql -u root -p -D database-name < uninstall_firewall.sql
Enter password: (enter root password here)
```

`uninstall_firewall.sql` removes all firewall plugins, tables, functions, and stored procedures associated with the MySQL Enterprise Firewall plugin.

##### 8.4.8.1.3 Using the MySQL Enterprise Firewall Plugin

Before using the MySQL Enterprise Firewall plugin, install it according to the instructions provided in Section 8.4.8.1.2, “Installing or Uninstalling the MySQL Enterprise Firewall Plugin”.

This section describes how to configure the firewall plugin using SQL statements. Alternatively, MySQL Workbench 6.3.4 and later versions provide a graphical interface for firewall control. See MySQL Enterprise Firewall Interface.

* Enabling or Disabling the Firewall Plugin
* Scheduling Firewall Cache Reloads
* Assigning Firewall Privileges (Plugin)")
* Firewall Concepts
* Registering Firewall Group Profiles
* Registering Firewall Account Profiles
* Monitoring the Firewall
* Migrating Account Profiles to Group Profiles

###### Enabling or Disabling the Firewall Plugin

To enable or disable the firewall plugin, set the `mysql_firewall_mode` system variable. By default, this is `ON` when the firewall plugin is installed. To set the initial firewall state explicitly at server startup, you can set the variable in an option file such as `my.cnf`, like this:

```
[mysqld]
mysql_firewall_mode=ON
```

After modifying `my.cnf`, restart the server to cause the new setting to take effect. See Section 6.2.2.2, “Using Option Files”, for more information.

Alternatively, to set and persist the firewall setting at runtime, run the SQL statements shown here:

```
SET PERSIST mysql_firewall_mode = OFF;
SET PERSIST mysql_firewall_mode = ON;
```

`SET PERSIST` sets a value for the running MySQL instance. It also saves the value, causing it to carry over to subsequent server restarts. To change a value for the running MySQL instance without having it carry over to subsequent restarts, use the `GLOBAL` keyword rather than `PERSIST`. See Section 15.7.6.1, “SET Syntax for Variable Assignment”.

###### Scheduling Firewall Cache Reloads

Each time the `MYSQL_FIREWALL` server-side plugin initializes, it loads data into its internal cache from the tables listed here:

* `firewall_whitelist`
* `firewall_group_allowlist`
* `firewall_users`
* `firewall_groups`
* `firewall_membership`

Without restarting the server or reinstalling the server-side plugin, modification of data outside of the plugin is not reflected internally. The `mysql_firewall_reload_interval_seconds` system variable makes it possible to force memory cache reloads from tables at specified intervals. By default, the interval value is `0`, which disables such reloads.

To schedule regular cache reloads, first ensure that the `scheduler` component is installed and enabled (see Section 7.5.5, “Scheduler Component”). To check the status of the component, execute the following `SHOW VARIABLES` statement:

```
SHOW VARIABLES LIKE 'component_scheduler%';
+-----------------------------+-------+
| Variable_name               | Value |
+-----------------------------+-------|
| component_scheduler.enabled | On    |
+-----------------------------+-------+
```

With the firewall plugin installed, set `mysql_firewall_reload_interval_seconds` at server startup to a number between 60 and `INT_MAX`, whose value is platform-specific. Values in the range `1` to `59` (inclusive) are reset to 60, with a warning, as shown here:

```
$> mysqld [server-options] --mysql-firewall-reload-interval-seconds=40
...
2023-08-31T17:46:35.043468Z 0 [Warning] [MY-015031] [Server] Plugin MYSQL_FIREWALL
reported: 'Invalid reload interval specified: 40. Valid values are 0 (off) or
greater than or equal to 60. Adjusting to 60.'
...
```

Alternatively, to set and persist this setting at startup, precede the variable name with the `PERSIST_ONLY` keyword or the `@@PERSIST_ONLY.` qualifier, like this:

```
SET PERSIST_ONLY mysql_firewall_reload_interval_seconds = 120;
SET @@PERSIST_ONLY.mysql_firewall_reload_interval_seconds = 120;
```

After performing this modification, restart the server, to cause the new setting to take effect.

###### Assigning Firewall Privileges (Plugin)

After the firewall plugin has been installed and configured, you should grant appropriate privileges to the MySQL account or accounts to be used for administering it. The assignment of privileges depends on which firewall operations an account should be permitted to perform, as listed here:

* Grant the `FIREWALL_EXEMPT` privilege to any account that should be exempt from firewall restrictions. This is useful, for example, for a database administrator who configures the firewall, to avoid the possibility of a misconfiguration causing even the administrator to be locked out and unable to execute statements.

* Grant the `FIREWALL_ADMIN` privilege to any account that should have full administrative firewall access. (Some administrative firewall functions can be invoked by accounts that have `FIREWALL_ADMIN` *or* the deprecated `SUPER` privilege, as indicated in the individual function descriptions.)

* Grant the `FIREWALL_USER` privilege (deprecated) to any account that should have administrative access only for its own firewall rules.

  Note

  `FIREWALL_USER` is not supported by the MySQL Enterprise Firewall component.

* Grant the `EXECUTE` privilege for the stored procedures in the firewall database. These may invoke administrative functions, so stored procedure access also requires the privileges indicated earlier that are needed for those functions. The firewall database can be the `mysql` system database or a custom schema (see Installing the MySQL Enterprise Firewall Plugin).

Note

The `FIREWALL_EXEMPT`, `FIREWALL_ADMIN`, and `FIREWALL_USER` privileges can be granted only while the firewall is installed because the `MYSQL_FIREWALL` plugin defines those privileges.

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

* A scope of applicability. The scope indicates which client connections the profile applies to:

  + The firewall supports account-based profiles such that each profile matches a particular client account (client user name and host name combination). For example, you can register one account profile for which the allowlist applies to connections originating from `admin@localhost` and another account profile for which the allowlist applies to connections originating from `myapp@apphost.example.com`.

    Note

    Account-based profiles are deprecated, and are not supported by the MySQL Enterprise Firewall component. If you are using account profiles with the firewall plugin, you can migrate them to group profiles as described in Migrating Account Profiles to Group Profiles. This is also done when you run `upgrade_firewall_to_component.sql` (see MySQL Enterprise Firewall Component Scripts) or migrate from the firewall plugin to the component using MySQL Configurator (see Section 2.3.2.1, “MySQL Server Configuration with MySQL Configurator”).

  + The firewall supports group profiles that can have multiple accounts as members, with the profile allowlist applying equally to all members. Group profiles enable easier administration and greater flexibility for deployments that require applying a given set of allowlist rules to multiple accounts.

Initially, no profiles exist, so by default, the firewall accepts all statements and has no effect on which statements MySQL accounts can execute. To apply firewall protective capabilities, explicit action is required:

* Register one or more profiles with the firewall.
* Train the firewall by establishing the allowlist for each profile; that is, the types of statements the profile permits clients to execute.

* Place the trained profiles in protecting mode to harden MySQL against unauthorized statement execution:

  + MySQL associates each client session with a specific user name and host name combination. This combination is the *session account*.

  + For each client connection, the firewall uses the session account to determine which profiles apply to handling incoming statements from the client.

    The firewall accepts only statements permitted by the applicable profile allowlists.

Most firewall principles apply identically to group profiles and account profiles. The two types of profiles differ in these respects:

* An account profile allowlist applies only to a single account. A group profile allowlist applies when the session account matches any account that is a member of the group.

* To apply an allowlist to multiple accounts using account profiles, it is necessary to register one profile per account and duplicate the allowlist across each profile. This entails training each account profile individually because each one must be trained using the single account to which it applies.

  A group profile allowlist applies to multiple accounts, with no need to duplicate it for each account. A group profile can be trained using any or all of the group member accounts, or training can be limited to any single member. Either way, the allowlist applies to all members.

* Account profile names are based on specific user name and host name combinations that depend on which clients connect to the MySQL server. Group profile names are chosen by the firewall administrator with no constraints other than that their length must be from 1 to 288 characters.

Note

Due to the advantages of group profiles over account profiles, and because a group profile with a single member account is logically equivalent to an account profile for that account, it is recommended that all new firewall profiles be created as group profiles. Account profiles are deprecated, and subject to removal in a future MySQL version. For assistance converting existing account profiles, see Migrating Account Profiles to Group Profiles. The firewall component does not support account profiles.

The profile-based protection afforded by the firewall enables implementation of strategies such as those listed here:

* If an application has unique protection requirements, have it use an account not used for any other purpose, and set up a group profile or account profile for that account.

* If related applications share protection requirements, associate each application with its own account, then add these application accounts as members of the same group profile. Alternatively, have all of the applications use the same account and associate them with an account profile for that account.

###### Firewall Statement Matching

Statement matching performed by the firewall does not use SQL statements as received from clients. Instead, the server converts incoming statements to normalized digest form and firewall operation uses these digests. The benefit of statement normalization is that it enables similar statements to be grouped and recognized using a single pattern. For example, these statements are distinct from each other:

```
SELECT first_name, last_name FROM customer WHERE customer_id = 1;
select first_name, last_name from customer where customer_id = 99;
SELECT first_name, last_name FROM customer WHERE customer_id = 143;
```

But all of them have the same normalized digest form:

```
SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?
```

By using normalization, firewall allowlists can store digests that each match many different statements received from clients. For more information about normalization and digests, see Section 29.10, “Performance Schema Statement Digests and Sampling”.

Warning

Setting the `max_digest_length` system variable to `0` disables digest production, which also disables server functionality that requires digests, such as MySQL Enterprise Firewall.

###### Profile Operational Modes

Each profile registered with the firewall has its own operational mode, chosen from these values:

* `OFF`: This mode disables the profile. The firewall considers it inactive and ignores it.

* `RECORDING`: This is the firewall training mode. Incoming statements received from a client that matches the profile are considered acceptable for the profile and become part of its “fingerprint.” The firewall records the normalized digest form of each statement to learn the acceptable statement patterns for the profile. Each pattern is a rule, and the union of the rules is the profile allowlist.

  Group and account profiles differ in that statement recording for a group profile can be limited to statements received from a single group member (the training member).

* `PROTECTING`: In this mode, the profile allows or prevents statement execution. The firewall matches incoming statements against the profile allowlist, accepting only statements that match and rejecting those that do not. After training a profile in `RECORDING` mode, switch it to `PROTECTING` mode to harden MySQL against access by statements that deviate from the allowlist. If the `mysql_firewall_trace` system variable is enabled, the firewall also writes rejected statements to the error log.

* `DETECTING`: This mode detects but not does not block intrusions (statements that are suspicious because they match nothing in the profile allowlist). In `DETECTING` mode, the firewall writes suspicious statements to the error log but accepts them without denying access.

When a profile is assigned any of the preceding mode values, the firewall stores the mode in the profile. Firewall mode-setting operations also permit a mode value of `RESET`, but this value is not stored: setting a profile to `RESET` mode causes the firewall to delete all rules for the profile and set its mode to `OFF`.

Note

Messages written to the error log in `DETECTING` mode or because `mysql_firewall_trace` is enabled are written as Notes, which are information messages. To ensure that such messages appear in the error log and are not discarded, make sure that error-logging verbosity is sufficient to include information messages. For example, if you are using priority-based log filtering, as described in Section 7.4.2.5, “Priority-Based Error Log Filtering (log\_filter\_internal)”"), set the `log_error_verbosity` system variable to `3`.

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

###### Registering Firewall Group Profiles

MySQL Enterprise Firewall supports registration of group profiles. A group profile can have multiple accounts as its members. To use a firewall group profile to protect MySQL against incoming statements from a given account, follow these steps:

1. Register the group profile and put it in `RECORDING` mode.

2. Add a member account to the group profile.
3. Connect to the MySQL server using the member account and execute statements to be learned. This trains the group profile and establishes the rules that form the profile allowlist.

4. Add to the group profile any other accounts that are to be group members.

5. Switch the group profile to `PROTECTING` mode. When a client connects to the server using any account that is a member of the group profile, the profile allowlist restricts statement execution.

6. Should additional training be necessary, switch the group profile to `RECORDING` mode again, update its allowlist with new statement patterns, then switch it back to `PROTECTING` mode.

Observe these guidelines for account references relating to the MySQL Enterprise Firewall plugin:

* Take note of the context in which account references occur. To name an account for firewall operations, specify it as a single quoted string (`'user_name@host_name'`). This differs from the usual MySQL convention for statements such as `CREATE USER` and `GRANT`, for which you quote the user and host parts of an account name separately (`'user_name'@'host_name'`).

  The requirement for naming accounts as a single quoted string for firewall operations means that you cannot use accounts that have embedded `@` characters in the user name.

* The firewall assesses statements against accounts represented by actual user and host names as authenticated by the server. When registering accounts in profiles, do not use wildcard characters or netmasks:

  + Suppose that an account named `me@%.example.org` exists and a client uses it to connect to the server from the host `abc.example.org`.

  + The account name contains a `%` wildcard character, but the server authenticates the client as having a user name of `me` and host name of `abc.example.com`, and that is what the firewall sees.

  + Consequently, the account name to use for firewall operations is `me@abc.example.org` rather than `me@%.example.org`.

The following procedure shows how to register a group profile with the firewall, train the firewall to know the acceptable statements for that profile (its allowlist), use the profile to protect MySQL against execution of unacceptable statements, and add and remove group members. The example uses a group profile name of `fwgrp`. The example profile is presumed for use by clients of an application that accesses tables in the `sakila` database (available at https://dev.mysql.com/doc/index-other.html).

Use an administrative MySQL account to perform the steps in this procedure, except those steps designated for execution by member accounts of the firewall group profile. For statements executed by member accounts, the default database should be `sakila`. (You can use a different database by adjusting the instructions accordingly.)

1. If necessary, create the accounts that are to be members of the `fwgrp` group profile and grant them appropriate access privileges. Statements for one member are shown here (choose an appropriate password):

   ```
   CREATE USER 'member1'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'member1'@'localhost';
   ```

2. Use the `sp_set_firewall_group_mode()` stored procedure to register the group profile with the firewall and place the profile in `RECORDING` (training) mode, as shown here:

   ```
   CALL mysql.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
   ```

   Note

   If you have installed MySQL Enterprise Firewall in a custom schema, substitute its name for `mysql`. For example, if the firewall is installed in the `fwdb` schema, execute the stored procedure like this:

   ```
   CALL fwdb.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
   ```

3. Use the `sp_firewall_group_enlist()` stored procedure to add an initial member account for use in training the group profile allowlist:

   ```
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member1@localhost');
   ```

4. To train the group profile using the initial member account, connect to the server as `member1` from the server host so that the firewall sees a session account for `member1@localhost`. Then execute some statements to be considered legitimate for the profile. For example:

   ```
   SELECT title, release_year FROM film WHERE film_id = 1;
   UPDATE actor SET last_update = NOW() WHERE actor_id = 1;
   SELECT store_id, COUNT(*) FROM inventory GROUP BY store_id;
   ```

   The firewall receives the statements from the `member1@localhost` account. Because that account is a member of the `fwgrp` profile, which is in `RECORDING` mode, the firewall interprets the statements as applicable to `fwgrp` and records the normalized digest form of the statements as rules in the `fwgrp` allowlist. Those rules then apply to all accounts that are members of `fwgrp`.

   Note

   Until the `fwgrp` group profile receives statements in `RECORDING` mode, its allowlist is empty, which is equivalent to “deny all.” No statement can match an empty allowlist, which has these implications:

   * The group profile cannot be switched to `PROTECTING` mode. It would reject every statement, effectively prohibiting the accounts that are group members from executing any statement.

   * The group profile can be switched to `DETECTING` mode. In this case, the profile accepts every statement but logs it as suspicious.

5. At this point, the group profile information is cached, including its name, membership, and allowlist. To see this information, query the Performance Schema firewall tables, like this:

   ```
   mysql> SELECT MODE FROM performance_schema.firewall_groups
          WHERE NAME = 'fwgrp';
   +-----------+
   | MODE      |
   +-----------+
   | RECORDING |
   +-----------+
   mysql> SELECT * FROM performance_schema.firewall_membership
          WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   +----------+-------------------+
   mysql> SELECT RULE FROM performance_schema.firewall_group_allowlist
          WHERE NAME = 'fwgrp';
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

   The `@@version_comment` rule comes from a statement sent automatically by the **mysql** client when you connect to the server.

   Important

   Train the firewall under conditions matching application use. For example, to determine server characteristics and capabilities, a given MySQL connector might send statements to the server at the beginning of each session. If an application normally is used through that connector, train the firewall using the connector, too. That enables those initial statements to become part of the allowlist for the group profile associated with the application.

6. Invoke `sp_set_firewall_group_mode()` again to switch the group profile to `PROTECTING` mode:

   ```
   CALL mysql.sp_set_firewall_group_mode('fwgrp', 'PROTECTING');
   ```

   Important

   Switching the group profile out of `RECORDING` mode synchronizes its cached data to the firewall database tables that provide persistent underlying storage. If you do not switch the mode for a profile that is being recorded, the cached data is not written to persistent storage and is lost when the server is restarted. The firewall database can be the `mysql` system database or a custom schema (see Installing the MySQL Enterprise Firewall Plugin).

7. Add to the group profile any other accounts that should be members:

   ```
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member2@localhost');
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member3@localhost');
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member4@localhost');
   ```

   The profile allowlist trained using the `member1@localhost` account now also applies to the additional accounts.

8. To verify the updated group membership, query the `firewall_membership` table again:

   ```
   mysql> SELECT * FROM performance_schema.firewall_membership
          WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   | fwgrp    | member2@localhost |
   | fwgrp    | member3@localhost |
   | fwgrp    | member4@localhost |
   +----------+-------------------+
   ```

9. Test the group profile against the firewall by using any account in the group to execute some acceptable and unacceptable statements. The firewall matches each statement from the account against the profile allowlist and accepts or rejects it:

   * This statement is not identical to a training statement but produces the same normalized statement as one of them, so the firewall accepts it:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98;
     +-------------------+--------------+
     | title             | release_year |
     +-------------------+--------------+
     | BRIGHT ENCOUNTERS |         2006 |
     +-------------------+--------------+
     ```

   * These statements match nothing in the allowlist, so the firewall rejects each with an error:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   * If the `mysql_firewall_trace` system variable is enabled, the firewall also writes rejected statements to the error log. For example:

     ```
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for 'member1@localhost'. Reason: No match in allowlist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log`'
     ```

     These log messages may be helpful in identifying the source of attacks, should that be necessary.

10. Should members need to be removed from the group profile, use the stored procedure `sp_firewall_group_delist()`, like this:

    ```
    CALL mysql.sp_firewall_group_delist('fwgrp', 'member3@localhost');
    ```

The firewall group profile now is trained for member accounts. When clients connect using any account in the group and attempt to execute statements, the profile protects MySQL against statements not matched by the profile allowlist.

The procedure just shown added only one member to the group profile before training its allowlist. Doing so provides better control over the training period by limiting which accounts can add new acceptable statements to the allowlist. Should additional training be necessary, you can switch the profile back to `RECORDING` mode:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
```

However, that enables any member of the group to execute statements and add them to the allowlist. To limit the additional training to a single group member, call `sp_set_firewall_group_mode_and_user()`, which is like `sp_set_firewall_group_mode()` but takes one more argument specifying which account is permitted to train the profile in `RECORDING` mode. For example, to enable training only by `member4@localhost`, call `sp_set_firewall_group_mode_and_user()` as shown here:

```
CALL mysql.sp_set_firewall_group_mode_and_user('fwgrp', 'RECORDING', 'member4@localhost');
```

This enables additional training by the specified account without having to remove the other group members. They can execute statements, but the statements are not added to the allowlist. You should keep in mind that, in `RECORDING` mode, the other members can execute *any* statement.

Note

To avoid unexpected behavior when a particular account is specified as the training account for a group profile, always ensure that account is a member of the group.

After the additional training, set the group profile back to `PROTECTING` mode, like this:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'PROTECTING');
```

The training account established by `sp_set_firewall_group_mode_and_user()` is saved in the group profile, so the firewall remembers it in case more training is needed later. Thus, if you call `sp_set_firewall_group_mode()` (which takes no training account argument), the current profile training account, `member4@localhost`, remains unchanged.

To clear the training account if it actually is desired to enable all group members to perform training in `RECORDING` mode, call `sp_set_firewall_group_mode_and_user()` and pass a `NULL` value for the account argument:

```
CALL mysql.sp_set_firewall_group_mode_and_user('fwgrp', 'RECORDING', NULL);
```

It is possible to detect intrusions by logging nonmatching statements as suspicious without denying access. First, put the group profile in `DETECTING` mode:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'DETECTING');
```

Then, using a member account, execute a statement that does not match the group profile allowlist. In `DETECTING` mode, the firewall permits the nonmatching statement to execute:

```
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

In addition, the firewall writes a message to the error log:

```
[Note] Plugin MYSQL_FIREWALL reported:
'SUSPICIOUS STATEMENT from 'member1@localhost'. Reason: No match in allowlist.
Statement: SHOW TABLES LIKE ?'
```

To disable a group profile, change its mode to `OFF`:

```
CALL mysql.sp_set_firewall_group_mode(group, 'OFF');
```

To forget all training for a profile and disable it, reset it:

```
CALL mysql.sp_set_firewall_group_mode(group, 'RESET');
```

The reset operation causes the firewall to delete all rules for the profile and set its mode to `OFF`.

###### Registering Firewall Account Profiles

MySQL Enterprise Firewall enables profiles to be registered that correspond to individual accounts. To use a firewall account profile to protect MySQL against incoming statements from a given account, follow these steps:

1. Register the account profile and put it in `RECORDING` mode.

2. Connect to the MySQL server using the account and execute statements to be learned. This trains the account profile and establishes the rules that form the profile allowlist.

3. Switch the account profile to `PROTECTING` mode. When a client connects to the server using the account, the account profile allowlist restricts statement execution.

4. Should additional training be necessary, switch the account profile to `RECORDING` mode again, update its allowlist with new statement patterns, then switch it back to `PROTECTING` mode.

Observe these guidelines for account references relating to the MySQL Enterprise Firewall plugin:

* Take note of the context in which account references occur. To name an account for firewall operations, specify it as a single quoted string (`'user_name@host_name'`). This differs from the usual MySQL convention for statements such as `CREATE USER` and `GRANT`, for which you quote the user and host parts of an account name separately (`'user_name'@'host_name'`).

  The requirement for naming accounts as a single quoted string for firewall operations means that you cannot use accounts that have embedded `@` characters in the user name.

* The firewall assesses statements against accounts represented by actual user and host names as authenticated by the server. When registering accounts in profiles, do not use wildcard characters or netmasks:

  + Suppose that an account named `me@%.example.org` exists and a client uses it to connect to the server from the host `abc.example.org`.

  + The account name contains a `%` wildcard character, but the server authenticates the client as having a user name of `me` and host name of `abc.example.com`, and that is what the firewall sees.

  + Consequently, the account name to use for firewall operations is `me@abc.example.org` rather than `me@%.example.org`.

The following procedure shows how to register an account profile with the firewall, train the firewall to know the acceptable statements for that profile (its allowlist), and use the profile to protect MySQL against execution of unacceptable statements by the account. The example account, `fwuser@localhost`, is presumed for use by an application that accesses tables in the `sakila` database (available at https://dev.mysql.com/doc/index-other.html).

Use an administrative MySQL account to perform the steps in this procedure, except those steps designated for execution by the `fwuser@localhost` account that corresponds to the account profile registered with the firewall. For statements executed using this account, the default database should be `sakila`. (You can use a different database by adjusting the instructions accordingly.)

1. If necessary, create the account to use for executing statements (choose an appropriate password) and grant it privileges for the `sakila` database, like this:

   ```
   CREATE USER 'fwuser'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'fwuser'@'localhost';
   ```

2. Use the `sp_set_firewall_mode()` stored procedure to register the account profile with the firewall and place the profile in `RECORDING` (training) mode, as shown here:

   ```
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

   Note

   If you have installed the MySQL Enterprise Firewall using a custom schema, substitute its name for `mysql` in the preceding statement. For example, if the firewall is installed in the `fwdb` schema, execute the stored procedure like this:

   ```
   CALL fwdb.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

3. To train the registered account profile, connect to the server as `fwuser` from the server host so that the firewall sees a session account for `fwuser@localhost`. Then use the account to execute some statements to be considered legitimate for the profile. For example:

   ```
   SELECT first_name, last_name FROM customer WHERE customer_id = 1;
   UPDATE rental SET return_date = NOW() WHERE rental_id = 1;
   SELECT get_customer_balance(1, NOW());
   ```

   Because the profile is in `RECORDING` mode, the firewall records the normalized digest form of the statements as rules in the profile allowlist.

   Note

   Until the `fwuser@localhost` account profile receives statements in `RECORDING` mode, its allowlist is empty, which is equivalent to “deny all.” No statement can match an empty allowlist, which has these implications:

   * The account profile cannot be switched to `PROTECTING` mode. It would reject every statement, effectively prohibiting the account from executing any statement.

   * The account profile can be switched to `DETECTING` mode. In this case, the profile accepts every statement but logs it as suspicious.

4. At this point, the account profile information is cached. To see this information, query the `INFORMATION_SCHEMA` firewall tables:

   ```
   mysql> SELECT MODE FROM INFORMATION_SCHEMA.MYSQL_FIREWALL_USERS
          WHERE USERHOST = 'fwuser@localhost';
   +-----------+
   | MODE      |
   +-----------+
   | RECORDING |
   +-----------+
   mysql> SELECT RULE FROM INFORMATION_SCHEMA.MYSQL_FIREWALL_WHITELIST
          WHERE USERHOST = 'fwuser@localhost';
   +----------------------------------------------------------------------------+
   | RULE                                                                       |
   +----------------------------------------------------------------------------+
   | SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?  |
   | SELECT `get_customer_balance` ( ? , NOW ( ) )                              |
   | UPDATE `rental` SET `return_date` = NOW ( ) WHERE `rental_id` = ?          |
   | SELECT @@`version_comment` LIMIT ?                                         |
   +----------------------------------------------------------------------------+
   ```

   See Section 28.7, “INFORMATION\_SCHEMA MySQL Enterprise Firewall Plugin Tables”, for more information about these tables.

   Note

   The `@@version_comment` rule comes from a statement sent automatically by the **mysql** client when it connects to the server.

   Important

   Train the firewall under conditions matching application use. For example, to determine server characteristics and capabilities, a given MySQL connector might send statements to the server at the beginning of each session. If an application normally is used through that connector, train the firewall using the connector, too. That enables those initial statements to become part of the allowlist for the account profile associated with the application.

5. Invoke `sp_set_firewall_mode()` again, this time switching the account profile to `PROTECTING` mode, as shown here:

   ```
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'PROTECTING');
   ```

   Important

   Switching the account profile out of `RECORDING` mode synchronizes its cached data to the firewall database tables that provide persistent underlying storage. If you do not switch the mode for a profile that is being recorded, the cached data is not written to persistent storage and is lost when the server is restarted. The firewall database can be the `mysql` system database or a custom schema (see Installing the MySQL Enterprise Firewall Plugin).

6. Test the account profile by using the account to execute some acceptable and unacceptable statements. The firewall matches each statement from the account against the profile allowlist and accepts or rejects it. This list provides some examples:

   * This statement is not identical to a training statement but produces the same normalized statement as one of them, so the firewall accepts it:

     ```
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = '48';
     +------------+-----------+
     | first_name | last_name |
     +------------+-----------+
     | ANN        | EVANS     |
     +------------+-----------+
     ```

   * These statements match nothing in the allowlist, so the firewall rejects each with an error:

     ```
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = 1 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   * If `mysql_firewall_trace` is enabled, the firewall also writes rejected statements to the error log. For example:

     ```
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for fwuser@localhost. Reason: No match in allowlist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log`'
     ```

     Such log messages may be helpful in identifying the source of attacks, should that be necessary.

The firewall account profile now is trained for the `fwuser@localhost` account. When clients connect using that account and attempt to execute statements, the profile protects MySQL against statements not matched by the profile allowlist.

It is possible to detect intrusions by logging nonmatching statements as suspicious without denying access. First, put the account profile in `DETECTING` mode:

```
CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'DETECTING');
```

Then, using the account, execute a statement that does not match the account profile allowlist. In `DETECTING` mode, the firewall permits the nonmatching statement to execute:

```
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

In addition, the firewall writes a message to the error log:

```
[Note] Plugin MYSQL_FIREWALL reported:
'SUSPICIOUS STATEMENT from 'fwuser@localhost'. Reason: No match in allowlist.
Statement: SHOW TABLES LIKE ?'
```

To disable an account profile, change its mode to `OFF`:

```
CALL mysql.sp_set_firewall_mode(user, 'OFF');
```

To forget all training for a profile and disable it, reset it:

```
CALL mysql.sp_set_firewall_mode(user, 'RESET');
```

The reset operation causes the firewall to delete all rules for the profile and set its mode to `OFF`.

###### Monitoring the Firewall

To assess firewall activity, examine its associated status variables. For example, after performing the procedure shown earlier to train and protect the `fwgrp` group profile, these variables have the values shown in the output of this `SHOW GLOBAL STATUS` statement:

```
mysql> SHOW GLOBAL STATUS LIKE 'Firewall%';
+----------------------------+-------+
| Variable_name              | Value |
+----------------------------+-------+
| Firewall_access_denied     | 3     |
| Firewall_access_granted    | 4     |
| Firewall_access_suspicious | 1     |
| Firewall_cached_entries    | 4     |
+----------------------------+-------+
```

These variables indicate the numbers of statements rejected, accepted, logged as suspicious, and added to the cache, respectively. The `Firewall_access_granted` count is 4 because of the `@@version_comment` statement sent by the **mysql** client each of the three times the registered account connected to the server, plus the `SHOW TABLES` statement that was not blocked in `DETECTING` mode.

###### Migrating Account Profiles to Group Profiles

The MySQL Enterprise Firewall plugin supports account profiles, each of which applies to a single account as well as group profiles which can each apply to multiple accounts. A group profile simplifies administration when the same allowlist is to be applied to multiple accounts: instead of creating one account profile per account and duplicating the allowlist across all of those profiles, you can create a single group profile and make the accounts members of it. The group allowlist then applies to all of the accounts.

A group profile with a single member account is logically equivalent to an account profile for that account, so it is possible to administer the firewall using group profiles exclusively, rather than a mix of account and group profiles. For new firewall installations, that is accomplished by uniformly creating new profiles as group profiles and avoiding account profiles.

Due to the greater flexibility offered by group profiles, it is recommended that all new firewall profiles be created as group profiles. Account profiles are deprecated, and subject to removal in a future MySQL version. (In addition, account profiles are not supported by the MySQL Enterprise Firewall component.) For upgrades from firewall installations which use account profiles, the MySQL Enterprise Firewall plugin includes a stored procedure named `sp_migrate_firewall_user_to_group()` to help you convert account profiles to group profiles. To use it, perform the following procedure as a user who has the `FIREWALL_ADMIN` privilege:

1. Run the `firewall_profile_migration.sql` script to install the `sp_migrate_firewall_user_to_group()` stored procedure. The script is located in the `share` directory of the MySQL installation.

   Specify the same firewall database name on the command line that you previously defined for your firewall installation. The example here specifies the system database, `mysql`.

   ```
   $> mysql -u root -p -D mysql < firewall_profile_migration.sql
   Enter password: (enter root password here)
   ```

   If you installed the MySQL Enterprise Firewall plugin using a custom schema, make the appropriate substitution for your system.

2. Identify which account profiles exist by querying the Information Schema `MYSQL_FIREWALL_USERS` table, like this:

   ```
   mysql> SELECT USERHOST FROM INFORMATION_SCHEMA.MYSQL_FIREWALL_USERS;
   +-------------------------------+
   | USERHOST                      |
   +-------------------------------+
   | admin@localhost               |
   | local_client@localhost        |
   | remote_client@abc.example.com |
   +-------------------------------+
   ```

3. For each account profile identified by the previous step, convert it to a group profile. Replace the `mysql` prefix with the actual firewall database name, if necessary:

   ```
   CALL mysql.sp_migrate_firewall_user_to_group('admin@localhost', 'admins');
   CALL mysql.sp_migrate_firewall_user_to_group('local_client@localhost', 'local_clients');
   CALL mysql.sp_migrate_firewall_user_to_group('remote_client@localhost', 'remote_clients');
   ```

   In each case, the account profile must exist and must not currently be in `RECORDING` mode, and the group profile must not already exist. The resulting group profile has the named account as its single enlisted member, which is also set as the group training account. The group profile operational mode is taken from the account profile operational mode.

4. (*Optional*:) Remove `sp_migrate_firewall_user_to_group()`:

   ```
   DROP PROCEDURE IF EXISTS mysql.sp_migrate_firewall_user_to_group;
   ```

   If you installed the MySQL Enterprise Firewall plugin using a custom schema, use it sname in place of `mysql` in the preceding statement.

For additional information about `sp_migrate_firewall_user_to_group()`, see Firewall Plugin Miscellaneous Stored Procedures.

##### 8.4.8.1.4 MySQL Enterprise Firewall Plugin Reference

The following sections provide a reference to the following MySQL Enterprise Firewall plugin elements:

* MySQL Enterprise Firewall Plugin Tables
* MySQL Enterprise Firewall Plugin Stored Procedures
* MySQL Enterprise Firewall Plugin Administrative Functions
* MySQL Enterprise Firewall Plugin System Variables
* MySQL Enterprise Firewall Plugin Status Variables

###### MySQL Enterprise Firewall Plugin Tables

The MySQL Enterprise Firewall plugin maintains profile information on a per-group and per-account basis, using tables in the firewall database for persistent storage, and Information Schema tables to provide views into in-memory cached data. When enabled, the firewall bases operational decisions on the cached data. The firewall database can be the `mysql` system database or one determined during installation (see Installing the MySQL Enterprise Firewall Plugin).

Tables in the firewall database are covered in this section. For information about MySQL Enterprise Firewall plugin Information Schema tables, see Section 28.7, “INFORMATION\_SCHEMA MySQL Enterprise Firewall Plugin Tables”; for information about MySQL Enterprise Firewall Performance Schema tables, see Section 29.12.17, “Performance Schema Firewall Tables”.

* Firewall Group Profile Tables
* Firewall Account Profile Tables

###### Firewall Group Profile Tables

The MySQL Enterprise Firewall plugin maintains group profile information using tables in the firewall database (`mysql` or custom) for persistent storage and Performance Schema tables to provide views into in-memory cached data.

Each firewall and Performance Schema table is accessible only by accounts that have the `SELECT` privilege for that table.

The `firewall-database.firewall_groups` table lists names and operational modes of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_groups` table having similar but not necessarily identical columns):

* `NAME`

  The group profile name.

* `MODE`

  The current operational mode for the profile. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, and `RECORDING`. For information about their meanings, see Firewall Concepts.

* `USERHOST`

  The training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or an account in the format `user_name@host_name`:

  + If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.

  + If the value is not `NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

The `firewall-database.firewall_group_allowlist` table lists allowlist rules of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_group_allowlist` table having similar but not necessarily identical columns):

* `NAME`

  The group profile name.

* `RULE`

  A normalized statement indicating an acceptable statement pattern for the profile. A profile allowlist is the union of its rules.

* `ID`

  A unique integer; the table's primary key.

The `firewall-database.firewall_membership` table lists the members (accounts) of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_membership` table having similar but not necessarily identical columns):

* `GROUP_ID`

  The group profile name.

* `MEMBER_ID`

  The name of an account that is a member of the profile.

###### Firewall Account Profile Tables

MySQL Enterprise Firewall maintains account profile information using tables in the firewall database for persistent storage and `INFORMATION_SCHEMA` tables to provide views into in-memory cached data. The firewall database can be the `mysql` system database or a custom schema (see Installing the MySQL Enterprise Firewall Plugin).

Each default database table is accessible only by accounts that have the `SELECT` privilege for it. The `INFORMATION_SCHEMA` tables are accessible by anyone.

These tables are deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

The `firewall-database.firewall_users` table lists names and operational modes of registered firewall account profiles. The table has the following columns (with the corresponding `MYSQL_FIREWALL_USERS` table having similar but not necessarily identical columns):

* `USERHOST`

  The account profile, in the format `user_name@host_name`.

* `MODE`

  The profile's current operational mode. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, `RECORDING`, and `RESET`. For information about their meanings, see Firewall Concepts.

The `firewall-database.firewall_whitelist` table lists allowlist rules of registered firewall account profiles. The table has the following columns (with the corresponding `MYSQL_FIREWALL_WHITELIST` table having similar but not necessarily identical columns):

* `USERHOST`

  The account profile name, using the format `user_name@host_name`.

* `RULE`

  A normalized statement indicating an acceptable statement pattern for the profile. A profile allowlist is the union of its rules.

* `ID`

  Unique identifier (integer); this table's primary key.

###### MySQL Enterprise Firewall Plugin Stored Procedures

MySQL Enterprise Firewall plugin stored procedures perform tasks such as registering profiles with the firewall, establishing their operational mode, and managing transfer of firewall data between the cache and persistent storage. These procedures invoke administrative functions that provide an API for lower-level tasks.

Firewall stored procedures are created in the firewall database, which can be the `mysql` or other database (see Installing the MySQL Enterprise Firewall Plugin).

To invoke a firewall stored procedure, either do so while the specified firewall database is the default database, or qualify the procedure name with the database name. For example, if `mysql` is the firewall database:

```
CALL mysql.sp_set_firewall_group_mode(group, mode);
```

Firewall stored procedures are transactional; if an error occurs during execution of a firewall stored procedure, all changes made by it up to that point are rolled back, and an error is reported.

Note

If you have installed MySQL Enterprise Firewall in a custom schema, use its name in place of `mysql` when invoking firewall plugin stored procedures. For example, if the firewall is installed in the `fwdb` schema, then execute the stored procedure `sp_set_firewall_group_mode` like this:

```
CALL fwdb.sp_set_firewall_group_mode(group, mode);
```

* Firewall Group Profile Stored Procedures
* Firewall Plugin Account Profile Stored Procedures
* Firewall Plugin Miscellaneous Stored Procedures

###### Firewall Group Profile Stored Procedures

The stored procedures listed here perform management operations on firewall group profiles:

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

###### Firewall Plugin Account Profile Stored Procedures

The stored procedures listed here perform management operations on firewall account profiles:

* `sp_reload_firewall_rules(user)`

  This stored procedure provides control over firewall operation for individual account profiles. The procedure uses firewall administrative functions to reload the in-memory rules for an account profile from the rules stored in the `firewall-database.firewall_whitelist` table.

  Arguments:

  + *`user`*: The name of the affected account profile, as a string in `user_name@host_name` format.

  Example:

  ```
  CALL sp_reload_firewall_rules('fwuser@localhost');
  ```

  Warning

  This procedure clears the account profile in-memory allowlist rules before reloading them from persistent storage, and sets the profile mode to `OFF`. If the profile mode was not `OFF` prior to the `sp_reload_firewall_rules()` call, use `sp_set_firewall_mode()` to restore its previous mode after reloading the rules. For example, if the profile was in `PROTECTING` mode, that is no longer true after calling `sp_reload_firewall_rules()` and you must set it to `PROTECTING` again explicitly.

  This procedure is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

* `sp_set_firewall_mode(user, mode)`

  This stored procedure establishes the operational mode for a firewall account profile, after registering the profile with the firewall if it was not already registered. The procedure also invokes firewall administrative functions as necessary to transfer firewall data between the cache and persistent storage. This procedure may be called even if the `mysql_firewall_mode` system variable is `OFF`, although setting the mode for a profile has no operational effect until the firewall is enabled.

  Arguments:

  + *`user`*: The name of the affected account profile, as a string in `user_name@host_name` format.

  + *`mode`*: The operational mode for the profile, as a string. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, `RECORDING`, and `RESET`. For details about their meanings, see Firewall Concepts.

  Switching an account profile to any mode but `RECORDING` synchronizes its firewall cache data to the firewall database tables that provide persistent underlying storage (`mysql` or custom). Switching the mode from `OFF` to `RECORDING` reloads the allowlist from the `firewall-database.firewall_whitelist` table into the cache.

  If an account profile has an empty allowlist, its mode cannot be set to `PROTECTING` because the profile would reject every statement, effectively prohibiting the account from executing statements. In response to such a mode-setting attempt, the firewall produces a diagnostic message that is returned as a result set rather than as an SQL error:

  ```
  mysql> CALL sp_set_firewall_mode('a@b','PROTECTING');
  +----------------------------------------------------------------------+
  | set_firewall_mode(arg_userhost, arg_mode)                            |
  +----------------------------------------------------------------------+
  | ERROR: PROTECTING mode requested for a@b but the allowlist is empty. |
  +----------------------------------------------------------------------+
  ```

  This procedure is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

###### Firewall Plugin Miscellaneous Stored Procedures

The stored procedures listed perform miscellaneous firewall management operations.

* `sp_migrate_firewall_user_to_group(user, group)`

  The `sp_migrate_firewall_user_to_group()` stored procedure converts a firewall account profile to a group profile with the account as its single enlisted member. Run the `firewall_profile_migration.sql` script to install it. The conversion procedure is discussed in Migrating Account Profiles to Group Profiles.

  This routine requires the `FIREWALL_ADMIN` privilege.

  Arguments:

  + *`user`*: The name of the account profile to convert to a group profile, as a string in `user_name@host_name` format. The account profile must exist, and must not currently be in `RECORDING` mode.

  + *`group`*: The name of the new group profile, which must not already exist. The new group profile has the named account as its single enlisted member, and that member is set as the group training account. The group profile operational mode is taken from the account profile operational mode.

  Example:

  ```
  CALL sp_migrate_firewall_user_to_group('fwuser@localhost', 'mygroup);
  ```

###### MySQL Enterprise Firewall Plugin Administrative Functions

MySQL Enterprise Firewall plugin administrative functions provide an API for lower-level tasks such as synchronizing the firewall cache with the underlying system tables.

*Under normal operation, these functions are invoked by the firewall stored procedures, not directly by users.* For that reason, these function descriptions do not include details such as information about their arguments and return types.

* Firewall Group Profile Functions
* Firewall Plugin Account Profile Functions
* Firewall Plugin Miscellaneous Functions

###### Firewall Group Profile Functions

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

  If the optional *`user`* argument is given, it specifies the training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or an account name in the format `user_name@host_name`:

  + If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.

  + If the value is not `NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

  Example:

  ```
  SELECT set_firewall_group_mode('g', 'DETECTING');
  ```

###### Firewall Plugin Account Profile Functions

The functions listed here perform management operations on firewall account profiles:

* `read_firewall_users(user, mode)`

  This aggregate function updates the firewall account profile cache using a `SELECT` statement on the `firewall-database.firewall_users` table. It requires the `FIREWALL_ADMIN` privilege or the deprecated `SUPER` privilege.

  Example:

  ```
  SELECT read_firewall_users('fwuser@localhost', 'RECORDING')
  FROM mysql.firewall_users;
  ```

  This function is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

* `read_firewall_whitelist(user, rule)`

  This aggregate function updates the recorded statement cache for the named account profile through a `SELECT` statement on the `firewall-database.firewall_whitelist` table. It requires the `FIREWALL_ADMIN` privilege or the deprecated `SUPER` privilege.

  Example:

  ```
  SELECT read_firewall_whitelist('fwuser@localhost', fw.rule)
  FROM mysql.firewall_whitelist AS fw
  WHERE USERHOST = 'fwuser@localhost';
  ```

  This function is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

* `set_firewall_mode(user, mode)`

  This function manages the account profile cache and establishes the profile operational mode. It requires the `FIREWALL_ADMIN` privilege or the deprecated `SUPER` privilege.

  Example:

  ```
  SELECT set_firewall_mode('fwuser@localhost', 'RECORDING');
  ```

  This function is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

###### Firewall Plugin Miscellaneous Functions

The functions listed here perform miscellaneous firewall operations:

* `mysql_firewall_flush_status()`

  This function resets the following firewall plugin status variables to `0`:

  + `Firewall_access_denied`
  + `Firewall_access_granted`
  + `Firewall_access_suspicious`

  This function requires the `FIREWALL_ADMIN` privilege or the deprecated `SUPER` privilege.

  Example:

  ```
  SELECT mysql_firewall_flush_status();
  ```

* `normalize_statement(stmt)`

  This function normalizes an SQL statement into the digest form used for allowlist rules. It requires the `FIREWALL_ADMIN` privilege or the deprecated `SUPER` privilege.

  Example:

  ```
  SELECT normalize_statement('SELECT * FROM t1 WHERE c1 > 2');
  ```

  Note

  The same digest functionality is available from the `STATEMENT_DIGEST_TEXT()` SQL function.

###### MySQL Enterprise Firewall Plugin System Variables

The MySQL Enterprise Firewall plugin supports the following system variables for controlling various aspects of firewall operation. These variables are unavailable unless the firewall plugin is installed (see Section 8.4.8.1.2, “Installing or Uninstalling the MySQL Enterprise Firewall Plugin”).

* `mysql_firewall_database`

  <table frame="box" rules="all" summary="Properties for mysql_firewall_database"><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-database[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_database</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql</code></td> </tr></tbody></table>

  Specifies the database from which the MySQL Enterprise Firewall plugin reads data. Typically, the `MYSQL_FIREWALL` server-side plugin stores its internal data (tables, stored procedures, and functions) in the `mysql` system database, but you can create and use a custom schema instead (see Installing the MySQL Enterprise Firewall Plugin). This variable permits specifying an alternative database name at startup.

* `mysql_firewall_mode`

  <table frame="box" rules="all" summary="Properties for mysql_firewall_mode"><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-mode[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_mode</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Whether the MySQL Enterprise Firewall plugin is enabled (the default) or disabled.

* `mysql_firewall_reload_interval_seconds`

  <table frame="box" rules="all" summary="Properties for mysql_firewall_reload_interval_seconds"><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-reload-interval-seconds[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_reload_interval_seconds</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>60 (unless 0: OFF)</code></td> </tr><tr><th>Maximum Value</th> <td><code>INT_MAX</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  Specifies the interval (in seconds) that the server-side plugin uses to reload its internal cache from firewall tables. When `mysql_firewall_reload_interval_seconds` has a value of zero (the default), no periodic reloading of data from tables occurs at runtime. Values between `0` and `60` (1 to 59) are not acknowledged by the plugin. Instead, these values adjust to `60` automatically.

  This variable requires that the `scheduler` component be enabled (`ON`). For more information, see Scheduling Firewall Cache Reloads.

* `mysql_firewall_trace`

  <table frame="box" rules="all" summary="Properties for mysql_firewall_trace"><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-trace[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_trace</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether the MySQL Enterprise Firewall trace is enabled or disabled (the default). When `mysql_firewall_trace` is enabled, for `PROTECTING` mode, the firewall writes rejected statements to the error log.

###### MySQL Enterprise Firewall Plugin Status Variables

The MySQL Enterprise Firewall plugin supports the following status variables which provide information about the firewall's operational status. These variables are unavailable unless the firewall plugin is installed (see Section 8.4.8.1.2, “Installing or Uninstalling the MySQL Enterprise Firewall Plugin”). Firewall plugin status variables are set to `0` whenever the `MYSQL_FIREWALL` plugin is installed or the server is started. Many of them are reset to zero by the `mysql_firewall_flush_status()` function (see MySQL Enterprise Firewall Plugin Administrative Functions).

* `Firewall_access_denied`

  The number of statements rejected by the MySQL Enterprise Firewall plugin.

  Deprecated.

* `Firewall_access_granted`

  The number of statements accepted by the MySQL Enterprise Firewall plugin.

  Deprecated.

* `Firewall_access_suspicious`

  The number of statements logged by the MySQL Enterprise Firewall plugin as suspicious for users who are in `DETECTING` mode.

  Deprecated.

* `Firewall_cached_entries`

  The number of statements recorded by the MySQL Enterprise Firewall plugin, including duplicates.

  Deprecated.
