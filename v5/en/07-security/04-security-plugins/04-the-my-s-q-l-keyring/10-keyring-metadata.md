#### 6.4.4.10 Keyring Metadata

To see whether a keyring plugin is loaded, check the Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") table or use the [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") statement (see [Section 5.5.2, “Obtaining Server Plugin Information”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+--------------+---------------+
| PLUGIN_NAME  | PLUGIN_STATUS |
+--------------+---------------+
| keyring_file | ACTIVE        |
+--------------+---------------+
```
