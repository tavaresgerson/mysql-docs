#### 6.4.6.3 Using MySQL Enterprise Firewall

Before using MySQL Enterprise Firewall, install it according to the instructions provided in [Section 6.4.6.2, “Installing or Uninstalling MySQL Enterprise Firewall”](firewall-installation.html "6.4.6.2 Installing or Uninstalling MySQL Enterprise Firewall"). Also, MySQL Enterprise Firewall does not work together with the query cache; disable the query cache if it is enabled (see [Section 8.10.3.3, “Query Cache Configuration”](query-cache-configuration.html "8.10.3.3 Query Cache Configuration")).

This section describes how to configure MySQL Enterprise Firewall using SQL statements. Alternatively, MySQL Workbench 6.3.4 or higher provides a graphical interface for firewall control. See [MySQL Enterprise Firewall Interface](/doc/workbench/en/wb-mysql-firewall.html).

* [Enabling or Disabling the Firewall](firewall-usage.html#firewall-enabling-disabling "Enabling or Disabling the Firewall")
* [Assigning Firewall Privileges](firewall-usage.html#firewall-privileges "Assigning Firewall Privileges")
* [Firewall Concepts](firewall-usage.html#firewall-concepts "Firewall Concepts")
* [Registering Firewall Account Profiles](firewall-usage.html#firewall-account-profiles "Registering Firewall Account Profiles")
* [Monitoring the Firewall](firewall-usage.html#firewall-monitoring "Monitoring the Firewall")

##### Enabling or Disabling the Firewall

To enable or disable the firewall, set the [`mysql_firewall_mode`](firewall-reference.html#sysvar_mysql_firewall_mode) system variable. By default, this variable is enabled when the firewall is installed. To control the initial firewall state explicitly, you can set the variable at server startup. For example, to enable the firewall in an option file, use these lines:

```sql
[mysqld]
mysql_firewall_mode=ON
```

After modifying `my.cnf`, restart the server to cause the new setting to take effect.

It is also possible to disable or enable the firewall at runtime:

```sql
SET GLOBAL mysql_firewall_mode = OFF;
SET GLOBAL mysql_firewall_mode = ON;
```

##### Assigning Firewall Privileges

With the firewall installed, grant the appropriate privileges to the MySQL account or accounts to be used for administering it:

* Grant the [`EXECUTE`](privileges-provided.html#priv_execute) privilege for the firewall stored procedures in the `mysql` system database. These may invoke administrative functions, so stored procedure access also requires the privileges needed for those functions.

* Grant the [`SUPER`](privileges-provided.html#priv_super) privilege so that the firewall administrative functions can be executed.

##### Firewall Concepts

The MySQL server permits clients to connect and receives from them SQL statements to be executed. If the firewall is enabled, the server passes to it each incoming statement that does not immediately fail with a syntax error. Based on whether the firewall accepts the statement, the server executes it or returns an error to the client. This section describes how the firewall accomplishes the task of accepting or rejecting statements.

* [Firewall Profiles](firewall-usage.html#firewall-profiles "Firewall Profiles")
* [Firewall Statement Matching](firewall-usage.html#firewall-statement-matching "Firewall Statement Matching")
* [Profile Operational Modes](firewall-usage.html#firewall-profile-modes "Profile Operational Modes")

###### Firewall Profiles

The firewall uses a registry of profiles that determine whether to permit statement execution. Profiles have these attributes:

* An allowlist. The allowlist is the set of rules that defines which statements are acceptable to the profile.

* A current operational mode. The mode enables the profile to be used in different ways. For example: the profile can be placed in training mode to establish the allowlist; the allowlist can be used for restricting statement execution or intrusion detection; the profile can be disabled entirely.

* A scope of applicability. The scope indicates which client connections the profile applies to.

  The firewall supports account-based profiles such that each profile matches a particular client account (client user name and host name combination). For example, you can register one account profile for which the allowlist applies to connections originating from `admin@localhost` and another account profile for which the allowlist applies to connections originating from `myapp@apphost.example.com`.

Initially, no profiles exist, so by default, the firewall accepts all statements and has no effect on which statements MySQL accounts can execute. To apply firewall protective capabilities, explicit action is required:

* Register one or more profiles with the firewall.
* Train the firewall by establishing the allowlist for each profile; that is, the types of statements the profile permits clients to execute.

* Place the trained profiles in protecting mode to harden MySQL against unauthorized statement execution:

  + MySQL associates each client session with a specific user name and host name combination. This combination is the *session account*.

  + For each client connection, the firewall uses the session account to determine which profile applies to handling incoming statements from the client.

    The firewall accepts only statements permitted by the applicable profile allowlist.

The profile-based protection afforded by the firewall enables implementation of strategies such as these:

* If an application has unique protection requirements, configure it to use an account not used for any other purpose and set up a profile for that account.

* If related applications share protection requirements, configure them all to use the same account (and thus the same account profile).

###### Firewall Statement Matching

Statement matching performed by the firewall does not use SQL statements as received from clients. Instead, the server converts incoming statements to normalized digest form and firewall operation uses these digests. The benefit of statement normalization is that it enables similar statements to be grouped and recognized using a single pattern. For example, these statements are distinct from each other:

```sql
SELECT first_name, last_name FROM customer WHERE customer_id = 1;
select first_name, last_name from customer where customer_id = 99;
SELECT first_name, last_name FROM customer WHERE customer_id = 143;
```

But all of them have the same normalized digest form:

```sql
SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?
```

By using normalization, firewall allowlists can store digests that each match many different statements received from clients. For more information about normalization and digests, see [Section 25.10, “Performance Schema Statement Digests”](performance-schema-statement-digests.html "25.10 Performance Schema Statement Digests").

Warning

Setting the [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) system variable to zero disables digest production, which also disables server functionality that requires digests, such as MySQL Enterprise Firewall.

###### Profile Operational Modes

Each profile registered with the firewall has its own operational mode, chosen from these values:

* `OFF`: This mode disables the profile. The firewall considers it inactive and ignores it.

* `RECORDING`: This is the firewall training mode. Incoming statements received from a client that matches the profile are considered acceptable for the profile and become part of its “fingerprint.” The firewall records the normalized digest form of each statement to learn the acceptable statement patterns for the profile. Each pattern is a rule, and the union of the rules is the profile allowlist.

* `PROTECTING`: In this mode, the profile allows or prevents statement execution. The firewall matches incoming statements against the profile allowlist, accepting only statements that match and rejecting those that do not. After training a profile in `RECORDING` mode, switch it to `PROTECTING` mode to harden MySQL against access by statements that deviate from the allowlist. If the [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace) system variable is enabled, the firewall also writes rejected statements to the error log.

* `DETECTING`: This mode detects but not does not block intrusions (statements that are suspicious because they match nothing in the profile allowlist). In `DETECTING` mode, the firewall writes suspicious statements to the error log but accepts them without denying access.

When a profile is assigned any of the preceding mode values, the firewall stores the mode in the profile. Firewall mode-setting operations also permit a mode value of `RESET`, but this value is not stored: setting a profile to `RESET` mode causes the firewall to delete all rules for the profile and set its mode to `OFF`.

Note

Messages written to the error log in `DETECTING` mode or because [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace) is enabled are written as Notes, which are information messages. To ensure that such messages appear in the error log and are not discarded, set the [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) system variable to a value of 3.

As previously mentioned, MySQL associates each client session with a specific user name and host name combination known as the *session account*. The firewall matches the session account against registered profiles to determine which profile applies to handling incoming statements from the session:

* The firewall ignores inactive profiles (profiles with a mode of `OFF`).

* The session account matches an active account profile having the same user and host, if there is one. There is at most one such account profile.

After matching the session account to registered profiles, the firewall handles each incoming statement as follows:

* If there is no applicable profile, the firewall imposes no restrictions and accepts the statement.

* If there is an applicable profile, its mode determines statement handling:

  + In `RECORDING` mode, the firewall adds the statement to the profile allowlist rules and accepts it.

  + In `PROTECTING` mode, the firewall compares the statement to the rules in the profile allowlist. The firewall accepts the statement if there is a match, and rejects it otherwise. If the [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace) system variable is enabled, the firewall also writes rejected statements to the error log.

  + In `DETECTING` mode, the firewall detects instrusions without denying access. The firewall accepts the statement, but also matches it to the profile allowlist, as in `PROTECTING` mode. If the statement is suspicious (nonmatching), the firewall writes it to the error log.

##### Registering Firewall Account Profiles

MySQL Enterprise Firewall enables profiles to be registered that correspond to individual accounts. To use a firewall account profile to protect MySQL against incoming statements from a given account, follow these steps:

1. Register the account profile and put it in `RECORDING` mode.

2. Connect to the MySQL server using the account and execute statements to be learned. This trains the account profile and establishes the rules that form the profile allowlist.

3. Switch the account profile to `PROTECTING` mode. When a client connects to the server using the account, the account profile allowlist restricts statement execution.

4. Should additional training be necessary, switch the account profile to `RECORDING` mode again, update its allowlist with new statement patterns, then switch it back to `PROTECTING` mode.

Observe these guidelines for firewall-related account references:

* Take note of the context in which account references occur. To name an account for firewall operations, specify it as a single quoted string (`'user_name@host_name'`). This differs from the usual MySQL convention for statements such as [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") and [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), for which you quote the user and host parts of an account name separately (`'user_name'@'host_name'`).

  The requirement for naming accounts as a single quoted string for firewall operations means that you cannot use accounts that have embedded `@` characters in the user name.

* The firewall assesses statements against accounts represented by actual user and host names as authenticated by the server. When registering accounts in profiles, do not use wildcard characters or netmasks:

  + Suppose that an account named `me@%.example.org` exists and a client uses it to connect to the server from the host `abc.example.org`.

  + The account name contains a `%` wildcard character, but the server authenticates the client as having a user name of `me` and host name of `abc.example.com`, and that is what the firewall sees.

  + Consequently, the account name to use for firewall operations is `me@abc.example.org` rather than `me@%.example.org`.

The following procedure shows how to register an account profile with the firewall, train the firewall to know the acceptable statements for that profile (its allowlist), and use the profile to protect MySQL against execution of unacceptable statements by the account. The example account, `fwuser@localhost`, is presumed for use by an application that accesses tables in the `sakila` database (available at [https://dev.mysql.com/doc/index-other.html](/doc/index-other.html)).

Use an administrative MySQL account to perform the steps in this procedure, except those steps designated for execution by the `fwuser@localhost` account that corresponds to the account profile registered with the firewall. For statements executed using this account, the default database should be `sakila`. (You can use a different database by adjusting the instructions accordingly.)

1. If necessary, create the account to use for executing statements (choose an appropriate password) and grant it privileges for the `sakila` database:

   ```sql
   CREATE USER 'fwuser'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'fwuser'@'localhost';
   ```

2. Use the `sp_set_firewall_mode()` stored procedure to register the account profile with the firewall and place the profile in `RECORDING` (training) mode:

   ```sql
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

3. To train the registered account profile, connect to the server as `fwuser` from the server host so that the firewall sees a session account of `fwuser@localhost`. Then use the account to execute some statements to be considered legitimate for the profile. For example:

   ```sql
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

   ```sql
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

   Note

   The `@@version_comment` rule comes from a statement sent automatically by the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client when you connect to the server.

   Important

   Train the firewall under conditions matching application use. For example, to determine server characteristics and capabilities, a given MySQL connector might send statements to the server at the beginning of each session. If an application normally is used through that connector, train the firewall using the connector, too. That enables those initial statements to become part of the allowlist for the account profile associated with the application.

5. Invoke `sp_set_firewall_mode()` again, this time switching the account profile to `PROTECTING` mode:

   ```sql
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'PROTECTING');
   ```

   Important

   Switching the account profile out of `RECORDING` mode synchronizes its cached data to the `mysql` system database tables that provide persistent underlying storage. If you do not switch the mode for a profile that is being recorded, the cached data is not written to persistent storage and is lost when the server is restarted.

6. Test the account profile by using the account to execute some acceptable and unacceptable statements. The firewall matches each statement from the account against the profile allowlist and accepts or rejects it:

   * This statement is not identical to a training statement but produces the same normalized statement as one of them, so the firewall accepts it:

     ```sql
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = '48';
     +------------+-----------+
     | first_name | last_name |
     +------------+-----------+
     | ANN        | EVANS     |
     +------------+-----------+
     ```

   * These statements match nothing in the allowlist, so the firewall rejects each with an error:

     ```sql
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = 1 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   * If the [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace) system variable is enabled, the firewall also writes rejected statements to the error log. For example:

     ```sql
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for fwuser@localhost. Reason: No match in whitelist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log` '
     ```

     These log messages may be helpful in identifying the source of attacks, should that be necessary.

The firewall account profile now is trained for the `fwuser@localhost` account. When clients connect using that account and attempt to execute statements, the profile protects MySQL against statements not matched by the profile allowlist.

It is possible to detect intrusions by logging nonmatching statements as suspicious without denying access. First, put the account profile in `DETECTING` mode:

```sql
CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'DETECTING');
```

Then, using the account, execute a statement that does not match the account profile allowlist. In `DETECTING` mode, the firewall permits the nonmatching statement to execute:

```sql
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

In addition, the firewall writes a message to the error log:

```sql
[Note] Plugin MYSQL_FIREWALL reported:
'SUSPICIOUS STATEMENT from 'fwuser@localhost'. Reason: No match in whitelist.
Statement: SHOW TABLES LIKE ? '
```

To disable an account profile, change its mode to `OFF`:

```sql
CALL mysql.sp_set_firewall_mode(user, 'OFF');
```

To forget all training for a profile and disable it, reset it:

```sql
CALL mysql.sp_set_firewall_mode(user, 'RESET');
```

The reset operation causes the firewall to delete all rules for the profile and set its mode to `OFF`.

##### Monitoring the Firewall

To assess firewall activity, examine its status variables. For example, after performing the procedure shown earlier to train and protect the `fwuser@localhost` account, the variables look like this:

```sql
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

The variables indicate the number of statements rejected, accepted, logged as suspicious, and added to the cache, respectively. The [`Firewall_access_granted`](firewall-reference.html#statvar_Firewall_access_granted) count is 4 because of the `@@version_comment` statement sent by the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client each of the three times you connected using the registered account, plus the [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") statement that was not blocked in `DETECTING` mode.
