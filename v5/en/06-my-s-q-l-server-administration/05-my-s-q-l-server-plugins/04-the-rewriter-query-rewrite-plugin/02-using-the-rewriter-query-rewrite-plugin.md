#### 5.5.4.2 Using the Rewriter Query Rewrite Plugin

To enable or disable the plugin, enable or disable the [`rewriter_enabled`](rewriter-query-rewrite-plugin-reference.html#sysvar_rewriter_enabled) system variable. By default, the `Rewriter` plugin is enabled when you install it (see [Section 5.5.4.1, “Installing or Uninstalling the Rewriter Query Rewrite Plugin”](rewriter-query-rewrite-plugin-installation.html "5.5.4.1 Installing or Uninstalling the Rewriter Query Rewrite Plugin")). To set the initial plugin state explicitly, you can set the variable at server startup. For example, to enable the plugin in an option file, use these lines:

```sql
[mysqld]
rewriter_enabled=ON
```

It is also possible to enable or disable the plugin at runtime:

```sql
SET GLOBAL rewriter_enabled = ON;
SET GLOBAL rewriter_enabled = OFF;
```

Assuming that the `Rewriter` plugin is enabled, it examines and possibly modifies each [`SELECT`](select.html "13.2.9 SELECT Statement") statement received by the server. The plugin determines whether to rewrite statements based on its in-memory cache of rewriting rules, which are loaded from the `rewrite_rules` table in the `query_rewrite` database.

* [Adding Rewrite Rules](rewriter-query-rewrite-plugin-usage.html#rewriter-query-rewrite-plugin-adding-rewrite-rules "Adding Rewrite Rules")
* [How Statement Matching Works](rewriter-query-rewrite-plugin-usage.html#rewriter-query-rewrite-plugin-how-statement-matching-works "How Statement Matching Works")
* [Rewriting Prepared Statements](rewriter-query-rewrite-plugin-usage.html#rewriter-query-rewrite-plugin-rewriting-prepared-statements "Rewriting Prepared Statements")
* [Rewriter Plugin Operational Information](rewriter-query-rewrite-plugin-usage.html#rewriter-query-rewrite-plugin-operational-information "Rewriter Plugin Operational Information")
* [Rewriter Plugin Use of Character Sets](rewriter-query-rewrite-plugin-usage.html#rewriter-query-rewrite-plugin-use-of-character-sets "Rewriter Plugin Use of Character Sets")

##### Adding Rewrite Rules

To add rules for the `Rewriter` plugin, add rows to the `rewrite_rules` table, then invoke the `flush_rewrite_rules()` stored procedure to load the rules from the table into the plugin. The following example creates a simple rule to match statements that select a single literal value:

```sql
INSERT INTO query_rewrite.rewrite_rules (pattern, replacement)
VALUES('SELECT ?', 'SELECT ? + 1');
```

The resulting table contents look like this:

```sql
mysql> SELECT * FROM query_rewrite.rewrite_rules\G
*************************** 1. row ***************************
                id: 1
           pattern: SELECT ?
  pattern_database: NULL
       replacement: SELECT ? + 1
           enabled: YES
           message: NULL
    pattern_digest: NULL
normalized_pattern: NULL
```

The rule specifies a pattern template indicating which [`SELECT`](select.html "13.2.9 SELECT Statement") statements to match, and a replacement template indicating how to rewrite matching statements. However, adding the rule to the `rewrite_rules` table is not sufficient to cause the `Rewriter` plugin to use the rule. You must invoke `flush_rewrite_rules()` to load the table contents into the plugin in-memory cache:

```sql
mysql> CALL query_rewrite.flush_rewrite_rules();
```

Tip

If your rewrite rules seem not to be working properly, make sure that you have reloaded the rules table by calling `flush_rewrite_rules()`.

When the plugin reads each rule from the rules table, it computes a normalized (statement digest) form from the pattern and a digest hash value, and uses them to update the `normalized_pattern` and `pattern_digest` columns:

```sql
mysql> SELECT * FROM query_rewrite.rewrite_rules\G
*************************** 1. row ***************************
                id: 1
           pattern: SELECT ?
  pattern_database: NULL
       replacement: SELECT ? + 1
           enabled: YES
           message: NULL
    pattern_digest: 46b876e64cd5c41009d91c754921f1d4
normalized_pattern: select ?
```

For information about statement digesting, normalized statements, and digest hash values, see [Section 25.10, “Performance Schema Statement Digests”](performance-schema-statement-digests.html "25.10 Performance Schema Statement Digests").

If a rule cannot be loaded due to some error, calling `flush_rewrite_rules()` produces an error:

```sql
mysql> CALL query_rewrite.flush_rewrite_rules();
ERROR 1644 (45000): Loading of some rule(s) failed.
```

When this occurs, the plugin writes an error message to the `message` column of the rule row to communicate the problem. Check the `rewrite_rules` table for rows with non-`NULL` `message` column values to see what problems exist.

Patterns use the same syntax as prepared statements (see [Section 13.5.1, “PREPARE Statement”](prepare.html "13.5.1 PREPARE Statement")). Within a pattern template, `?` characters act as parameter markers that match data values. The `?` characters should not be enclosed within quotation marks. Parameter markers can be used only where data values should appear, and they cannot be used for SQL keywords, identifiers, functions, and so on. The plugin parses a statement to identify the literal values (as defined in [Section 9.1, “Literal Values”](literals.html "9.1 Literal Values")), so you can put a parameter marker in place of any literal value.

Like the pattern, the replacement can contain `?` characters. For a statement that matches a pattern template, the plugin rewrites it, replacing `?` parameter markers in the replacement using data values matched by the corresponding markers in the pattern. The result is a complete statement string. The plugin asks the server to parse it, and returns the result to the server as the representation of the rewritten statement.

After adding and loading the rule, check whether rewriting occurs according to whether statements match the rule pattern:

```sql
mysql> SELECT PI();
+----------+
| PI()     |
+----------+
| 3.141593 |
+----------+
1 row in set (0.01 sec)

mysql> SELECT 10;
+--------+
| 10 + 1 |
+--------+
|     11 |
+--------+
1 row in set, 1 warning (0.00 sec)
```

No rewriting occurs for the first [`SELECT`](select.html "13.2.9 SELECT Statement") statement, but does for the second. The second statement illustrates that when the `Rewriter` plugin rewrites a statement, it produces a warning message. To view the message, use [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement"):

```sql
mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1105
Message: Query 'SELECT 10' rewritten to 'SELECT 10 + 1' by a query rewrite plugin
```

To enable or disable an existing rule, modify its `enabled` column and reload the table into the plugin. To disable rule 1:

```sql
UPDATE query_rewrite.rewrite_rules SET enabled = 'NO' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

This enables you to deactivate a rule without removing it from the table.

To re-enable rule 1:

```sql
UPDATE query_rewrite.rewrite_rules SET enabled = 'YES' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

The `rewrite_rules` table contains a `pattern_database` column that `Rewriter` uses for matching table names that are not qualified with a database name:

* Qualified table names in statements match qualified names in the pattern if corresponding database and table names are identical.

* Unqualified table names in statements match unqualified names in the pattern only if the default database is the same as `pattern_database` and the table names are identical.

Suppose that a table named `appdb.users` has a column named `id` and that applications are expected to select rows from the table using a query of one of these forms, where the second can be used when `appdb` is the default database:

```sql
SELECT * FROM users WHERE appdb.id = id_value;
SELECT * FROM users WHERE id = id_value;
```

Suppose also that the `id` column is renamed to `user_id` (perhaps the table must be modified to add another type of ID and it is necessary to indicate more specifically what type of ID the `id` column represents).

The change means that applications must refer to `user_id` rather than `id` in the `WHERE` clause, but old applications that cannot be updated no longer work properly. The `Rewriter` plugin can solve this problem by matching and rewriting problematic statements. To match the statement `SELECT * FROM appdb.users WHERE id = value` and rewrite it as `SELECT * FROM appdb.users WHERE user_id = value`, you can insert a row representing a replacement rule into the rewrite rules table. If you also want to match this `SELECT` using the unqualified table name, it is also necessary to add an explicit rule. Using `?` as a value placeholder, the two [`INSERT`](insert.html "13.2.5 INSERT Statement") statements needed look like this:

```sql
INSERT INTO query_rewrite.rewrite_rules
    (pattern, replacement) VALUES(
    'SELECT * FROM appdb.users WHERE id = ?',
    'SELECT * FROM appdb.users WHERE user_id = ?'
    );
INSERT INTO query_rewrite.rewrite_rules
    (pattern, replacement, pattern_database) VALUES(
    'SELECT * FROM users WHERE id = ?',
    'SELECT * FROM users WHERE user_id = ?',
    'appdb'
    );
```

After adding the two new rules, execute the following statement to cause them to take effect:

```sql
CALL query_rewrite.flush_rewrite_rules();
```

`Rewriter` uses the first rule to match statements that use the qualified table name, and the second to match statements that use the unqualified name. The second rule works only when `appdb` is the default database.

##### How Statement Matching Works

The `Rewriter` plugin uses statement digests and digest hash values to match incoming statements against rewrite rules in stages. The `max_digest_length` system variable determines the size of the buffer used for computing statement digests. Larger values enable computation of digests that distinguish longer statements. Smaller values use less memory but increase the likelihood of longer statements colliding with the same digest value.

The plugin matches each statement to the rewrite rules as follows:

1. Compute the statement digest hash value and compare it to the rule digest hash values. This is subject to false positives, but serves as a quick rejection test.

2. If the statement digest hash value matches any pattern digest hash values, match the normalized (statement digest) form of the statement to the normalized form of the matching rule patterns.

3. If the normalized statement matches a rule, compare the literal values in the statement and the pattern. A `?` character in the pattern matches any literal value in the statement. If the statement prepares a [`SELECT`](select.html "13.2.9 SELECT Statement") statement, `?` in the pattern also matches `?` in the statement. Otherwise, corresponding literals must be the same.

If multiple rules match a statement, it is nondeterministic which one the plugin uses to rewrite the statement.

If a pattern contains more markers than the replacement, the plugin discards excess data values. If a pattern contains fewer markers than the replacement, it is an error. The plugin notices this when the rules table is loaded, writes an error message to the `message` column of the rule row to communicate the problem, and sets the [`Rewriter_reload_error`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_reload_error) status variable to `ON`.

##### Rewriting Prepared Statements

Prepared statements are rewritten at parse time (that is, when they are prepared), not when they are executed later.

Prepared statements differ from nonprepared statements in that they may contain `?` characters as parameter markers. To match a `?` in a prepared statement, a `Rewriter` pattern must contain `?` in the same location. Suppose that a rewrite rule has this pattern:

```sql
SELECT ?, 3
```

The following table shows several prepared [`SELECT`](select.html "13.2.9 SELECT Statement") statements and whether the rule pattern matches them.

<table summary="How the Rewriter plugin matches prepared statements against the pattern SELECT ?,3."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Prepared Statement</th> <th>Whether Pattern Matches Statement</th> </tr></thead><tbody><tr> <td><code class="literal">PREPARE s AS 'SELECT 3, 3'</code></td> <td>Yes</td> </tr><tr> <td><code class="literal">PREPARE s AS 'SELECT ?, 3'</code></td> <td>Yes</td> </tr><tr> <td><code class="literal">PREPARE s AS 'SELECT 3, ?'</code></td> <td>No</td> </tr><tr> <td><code class="literal">PREPARE s AS 'SELECT ?, ?'</code></td> <td>No</td> </tr></tbody></table>

##### Rewriter Plugin Operational Information

The `Rewriter` plugin makes information available about its operation by means of several status variables:

```sql
mysql> SHOW GLOBAL STATUS LIKE 'Rewriter%';
+-----------------------------------+-------+
| Variable_name                     | Value |
+-----------------------------------+-------+
| Rewriter_number_loaded_rules      | 1     |
| Rewriter_number_reloads           | 5     |
| Rewriter_number_rewritten_queries | 1     |
| Rewriter_reload_error             | ON    |
+-----------------------------------+-------+
```

For descriptions of these variables, see [Section 5.5.4.3.4, “Rewriter Query Rewrite Plugin Status Variables”](rewriter-query-rewrite-plugin-reference.html#rewriter-query-rewrite-plugin-status-variables "5.5.4.3.4 Rewriter Query Rewrite Plugin Status Variables").

When you load the rules table by calling the `flush_rewrite_rules()` stored procedure, if an error occurs for some rule, the `CALL` statement produces an error, and the plugin sets the `Rewriter_reload_error` status variable to `ON`:

```sql
mysql> CALL query_rewrite.flush_rewrite_rules();
ERROR 1644 (45000): Loading of some rule(s) failed.

mysql> SHOW GLOBAL STATUS LIKE 'Rewriter_reload_error';
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Rewriter_reload_error | ON    |
+-----------------------+-------+
```

In this case, check the `rewrite_rules` table for rows with non-`NULL` `message` column values to see what problems exist.

##### Rewriter Plugin Use of Character Sets

When the `rewrite_rules` table is loaded into the `Rewriter` plugin, the plugin interprets statements using the current global value of the [`character_set_client`](server-system-variables.html#sysvar_character_set_client) system variable. If the global [`character_set_client`](server-system-variables.html#sysvar_character_set_client) value is changed subsequently, the rules table must be reloaded.

A client must have a session [`character_set_client`](server-system-variables.html#sysvar_character_set_client) value identical to what the global value was when the rules table was loaded or rule matching does not work for that client.
