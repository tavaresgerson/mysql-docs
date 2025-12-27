#### 5.5.4.3 Rewriter Query Rewrite Plugin Reference

The following discussion serves as a reference to these elements associated with the `Rewriter` query rewrite plugin:

* The `Rewriter` rules table in the `query_rewrite` database

* `Rewriter` procedures and functions
* `Rewriter` system and status variables

##### 5.5.4.3.1 Rewriter Query Rewrite Plugin Rules Table

The `rewrite_rules` table in the `query_rewrite` database provides persistent storage for the rules that the `Rewriter` plugin uses to decide whether to rewrite statements.

Users communicate with the plugin by modifying the set of rules stored in this table. The plugin communicates information to users by setting the table's `message` column.

Note

The rules table is loaded into the plugin by the `flush_rewrite_rules` stored procedure. Unless that procedure has been called following the most recent table modification, the table contents do not necessarily correspond to the set of rules the plugin is using.

The `rewrite_rules` table has these columns:

* `id`

  The rule ID. This column is the table primary key. You can use the ID to uniquely identify any rule.

* `pattern`

  The template that indicates the pattern for statements that the rule matches. Use `?` to represent parameter markers that match data values.

* `pattern_database`

  The database used to match unqualified table names in statements. Qualified table names in statements match qualified names in the pattern if corresponding database and table names are identical. Unqualified table names in statements match unqualified names in the pattern only if the default database is the same as `pattern_database` and the table names are identical.

* `replacement`

  The template that indicates how to rewrite statements matching the `pattern` column value. Use `?` to represent parameter markers that match data values. In rewritten statements, the plugin replaces `?` parameter markers in `replacement` using data values matched by the corresponding markers in `pattern`.

* `enabled`

  Whether the rule is enabled. Load operations (performed by invoking the `flush_rewrite_rules()` stored procedure) load the rule from the table into the `Rewriter` in-memory cache only if this column is `YES`.

  This column makes it possible to deactivate a rule without removing it: Set the column to a value other than `YES` and reload the table into the plugin.

* `message`

  The plugin uses this column for communicating with users. If no error occurs when the rules table is loaded into memory, the plugin sets the `message` column to `NULL`. A non-`NULL` value indicates an error and the column contents are the error message. Errors can occur under these circumstances:

  + Either the pattern or the replacement is an incorrect SQL statement that produces syntax errors.

  + The replacement contains more `?` parameter markers than the pattern.

  If a load error occurs, the plugin also sets the [`Rewriter_reload_error`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_reload_error) status variable to `ON`.

* `pattern_digest`

  This column is used for debugging and diagnostics. If the column exists when the rules table is loaded into memory, the plugin updates it with the pattern digest. This column may be useful if you are trying to determine why some statement fails to be rewritten.

* `normalized_pattern`

  This column is used for debugging and diagnostics. If the column exists when the rules table is loaded into memory, the plugin updates it with the normalized form of the pattern. This column may be useful if you are trying to determine why some statement fails to be rewritten.

##### 5.5.4.3.2 Rewriter Query Rewrite Plugin Procedures and Functions

`Rewriter` plugin operation uses a stored procedure that loads the rules table into its in-memory cache, and a helper loadable function. Under normal operation, users invoke only the stored procedure. The function is intended to be invoked by the stored procedure, not directly by users.

* [`flush_rewrite_rules()`](rewriter-query-rewrite-plugin-reference.html#function_flush-rewrite-rules)

  This stored procedure uses the [`load_rewrite_rules()`](rewriter-query-rewrite-plugin-reference.html#function_load-rewrite-rules) function to load the contents of the `rewrite_rules` table into the `Rewriter` in-memory cache.

  Calling `flush_rewrite_rules()` implies [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

  Invoke this procedure after you modify the rules table to cause the plugin to update its cache from the new table contents. If any errors occur, the plugin sets the `message` column for the appropriate rule rows in the table and sets the [`Rewriter_reload_error`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_reload_error) status variable to `ON`.

* [`load_rewrite_rules()`](rewriter-query-rewrite-plugin-reference.html#function_load-rewrite-rules)

  This function is a helper routine used by the [`flush_rewrite_rules()`](rewriter-query-rewrite-plugin-reference.html#function_flush-rewrite-rules) stored procedure.

##### 5.5.4.3.3 Rewriter Query Rewrite Plugin System Variables

The `Rewriter` query rewrite plugin supports the following system variables. These variables are available only if the plugin is installed (see [Section 5.5.4.1, “Installing or Uninstalling the Rewriter Query Rewrite Plugin”](rewriter-query-rewrite-plugin-installation.html "5.5.4.1 Installing or Uninstalling the Rewriter Query Rewrite Plugin")).

* [`rewriter_enabled`](rewriter-query-rewrite-plugin-reference.html#sysvar_rewriter_enabled)

  <table frame="box" rules="all" summary="Properties for rewriter_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="rewriter-query-rewrite-plugin-reference.html#sysvar_rewriter_enabled">rewriter_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valid Values</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Whether the `Rewriter` query rewrite plugin is enabled.

* [`rewriter_verbose`](rewriter-query-rewrite-plugin-reference.html#sysvar_rewriter_verbose)

  <table frame="box" rules="all" summary="Properties for rewriter_verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="rewriter-query-rewrite-plugin-reference.html#sysvar_rewriter_verbose">rewriter_verbose</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr></tbody></table>

  For internal use.

##### 5.5.4.3.4 Rewriter Query Rewrite Plugin Status Variables

The `Rewriter` query rewrite plugin supports the following status variables. These variables are available only if the plugin is installed (see [Section 5.5.4.1, “Installing or Uninstalling the Rewriter Query Rewrite Plugin”](rewriter-query-rewrite-plugin-installation.html "5.5.4.1 Installing or Uninstalling the Rewriter Query Rewrite Plugin")).

* [`Rewriter_number_loaded_rules`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_number_loaded_rules)

  The number of rewrite plugin rewrite rules successfully loaded from the `rewrite_rules` table into memory for use by the `Rewriter` plugin.

* [`Rewriter_number_reloads`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_number_reloads)

  The number of times the `rewrite_rules` table has been loaded into the in-memory cache used by the `Rewriter` plugin.

* [`Rewriter_number_rewritten_queries`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_number_rewritten_queries)

  The number of queries rewritten by the `Rewriter` query rewrite plugin since it was loaded.

* [`Rewriter_reload_error`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_reload_error)

  Whether an error occurred the most recent time that the `rewrite_rules` table was loaded into the in-memory cache used by the `Rewriter` plugin. If the value is `OFF`, no error occurred. If the value is `ON`, an error occurred; check the `message` column of the `rewriter_rules` table for error messages.
