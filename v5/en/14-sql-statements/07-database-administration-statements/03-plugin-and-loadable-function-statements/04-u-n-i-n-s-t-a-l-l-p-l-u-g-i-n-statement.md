#### 13.7.3.4 UNINSTALL PLUGIN Statement

```sql
UNINSTALL PLUGIN plugin_name
```

This statement removes an installed server plugin. [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") is the complement of [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"). It requires the [`DELETE`](privileges-provided.html#priv_delete) privilege for the `mysql.plugin` system table because it removes the row from that table that registers the plugin.

*`plugin_name`* must be the name of some plugin that is listed in the `mysql.plugin` table. The server executes the plugin's deinitialization function and removes the row for the plugin from the `mysql.plugin` system table, so that subsequent server restarts do not load and initialize the plugin. [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") does not remove the plugin's shared library file.

You cannot uninstall a plugin if any table that uses it is open.

Plugin removal has implications for the use of associated tables. For example, if a full-text parser plugin is associated with a `FULLTEXT` index on the table, uninstalling the plugin makes the table unusable. Any attempt to access the table results in an error. The table cannot even be opened, so you cannot drop an index for which the plugin is used. This means that uninstalling a plugin is something to do with care unless you do not care about the table contents. If you are uninstalling a plugin with no intention of reinstalling it later and you care about the table contents, you should dump the table with [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") and remove the `WITH PARSER` clause from the dumped [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement so that you can reload the table later. If you do not care about the table, [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") can be used even if any plugins associated with the table are missing.

For additional information about plugin loading, see [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").
