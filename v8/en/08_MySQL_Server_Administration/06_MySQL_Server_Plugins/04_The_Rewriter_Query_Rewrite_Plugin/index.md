### 7.6.4 The Rewriter Query Rewrite Plugin

[7.6.4.1 Installing or Uninstalling the Rewriter Query Rewrite Plugin](rewriter-query-rewrite-plugin-installation.html)

[7.6.4.2 Using the Rewriter Query Rewrite Plugin](rewriter-query-rewrite-plugin-usage.html)

[7.6.4.3 Rewriter Query Rewrite Plugin Reference](rewriter-query-rewrite-plugin-reference.html)

MySQL supports query rewrite plugins that can examine and possibly
modify SQL statements received by the server before the server
executes them. See [Query Rewrite Plugins](/doc/extending-mysql/8.0/en/plugin-types.html#query-rewrite-plugin-type).

MySQL distributions include a postparse query rewrite plugin named
`Rewriter` and scripts for installing the plugin
and its associated elements. These elements work together to
provide statement-rewriting capability:

* A server-side plugin named `Rewriter`
  examines statements and may rewrite them, based on its
  in-memory cache of rewrite rules.

* These statements are subject to rewriting:

  + As of MySQL 8.0.12: [`SELECT`](select.html "15.2.13 SELECT Statement"),
    [`INSERT`](insert.html "15.2.7 INSERT Statement"),
    [`REPLACE`](replace.html "15.2.12 REPLACE Statement"),
    [`UPDATE`](update.html "15.2.17 UPDATE Statement"), and
    [`DELETE`](delete.html "15.2.2 DELETE Statement").

  + Prior to MySQL 8.0.12:
    [`SELECT`](select.html "15.2.13 SELECT Statement") only.

  Standalone statements and prepared statements are subject to
  rewriting. Statements occurring within view definitions or
  stored programs are not subject to rewriting.

* The `Rewriter` plugin uses a database named
  `query_rewrite` containing a table named
  `rewrite_rules`. The table provides
  persistent storage for the rules that the plugin uses to
  decide whether to rewrite statements. Users communicate with
  the plugin by modifying the set of rules stored in this table.
  The plugin communicates with users by setting the
  `message` column of table rows.

* The `query_rewrite` database contains a
  stored procedure named
  `flush_rewrite_rules()` that loads the
  contents of the rules table into the plugin.

* A loadable function named
  [`load_rewrite_rules()`](rewriter-query-rewrite-plugin-reference.html#function_load-rewrite-rules) is used by
  the `flush_rewrite_rules()` stored procedure.

* The `Rewriter` plugin exposes system
  variables that enable plugin configuration and status
  variables that provide runtime operational information. In
  MySQL 8.0.31 and later, this plugin also supports a privilege
  ([`SKIP_QUERY_REWRITE`](privileges-provided.html#priv_skip-query-rewrite)) that
  protects a given user's queries from being rewritten.

The following sections describe how to install and use the
`Rewriter` plugin, and provide reference
information for its associated elements.