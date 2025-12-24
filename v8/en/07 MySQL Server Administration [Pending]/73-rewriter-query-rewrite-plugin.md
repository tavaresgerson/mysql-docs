### 7.6.4 The Rewriter Query Rewrite Plugin

MySQL supports query rewrite plugins that can examine and possibly modify SQL statements received by the server before the server executes them. See  Query Rewrite Plugins.

MySQL distributions include a postparse query rewrite plugin named `Rewriter` and scripts for installing the plugin and its associated elements. These elements work together to provide statement-rewriting capability:

* A server-side plugin named `Rewriter` examines statements and may rewrite them, based on its in-memory cache of rewrite rules.
* These statements are subject to rewriting: `SELECT`, `INSERT`, `REPLACE`, `UPDATE`, and `DELETE`.

  Standalone statements and prepared statements are subject to rewriting. Statements occurring within view definitions or stored programs are not subject to rewriting.
* The `Rewriter` plugin uses a database named `query_rewrite` containing a table named `rewrite_rules`. The table provides persistent storage for the rules that the plugin uses to decide whether to rewrite statements. Users communicate with the plugin by modifying the set of rules stored in this table. The plugin communicates with users by setting the `message` column of table rows.
* The `query_rewrite` database contains a stored procedure named `flush_rewrite_rules()` that loads the contents of the rules table into the plugin.
* A loadable function named `load_rewrite_rules()` is used by the `flush_rewrite_rules()` stored procedure.
* The `Rewriter` plugin exposes system variables that enable plugin configuration and status variables that provide runtime operational information. This plugin also supports a privilege ( `SKIP_QUERY_REWRITE`) that protects a given user's queries from being rewritten.

The following sections describe how to install and use the `Rewriter` plugin, and provide reference information for its associated elements.


