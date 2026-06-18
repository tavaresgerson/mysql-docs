#### 8.4.4.17 Keyring Metadata

This section describes sources of information about keyring use.

To see whether a keyring plugin is loaded, check the Information
Schema [`PLUGINS`](information-schema-plugins-table.html "28.3.22 The INFORMATION_SCHEMA PLUGINS Table") table or use the
[`SHOW PLUGINS`](show-plugins.html "15.7.7.25 SHOW PLUGINS Statement") statement (see
[Section 7.6.2, “Obtaining Server Plugin Information”](obtaining-plugin-information.html "7.6.2 Obtaining Server Plugin Information")). For example:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+--------------+---------------+
| PLUGIN_NAME  | PLUGIN_STATUS |
+--------------+---------------+
| keyring_file | ACTIVE        |
+--------------+---------------+
```

To see which keys exist, check the Performance Schema
[`keyring_keys`](performance-schema-keyring-keys-table.html "29.12.18.2 The keyring_keys table") table:

```
mysql> SELECT * FROM performance_schema.keyring_keys;
+-----------------------------+--------------+----------------+
| KEY_ID                      | KEY_OWNER    | BACKEND_KEY_ID |
+-----------------------------+--------------+----------------+
| audit_log-20210322T130749-1 |              |                |
| MyKey                       | me@localhost |                |
| YourKey                     | me@localhost |                |
+-----------------------------+--------------+----------------+
```

To see whether a keyring component is loaded, check the
Performance Schema
[`keyring_component_status`](performance-schema-keyring-component-status-table.html "29.12.18.1 The keyring_component_status Table") table. For
example:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
+---------------------+-------------------------------------------------+
| STATUS_KEY          | STATUS_VALUE                                    |
+---------------------+-------------------------------------------------+
| Component_name      | component_keyring_file                          |
| Author              | Oracle Corporation                              |
| License             | GPL                                             |
| Implementation_name | component_keyring_file                          |
| Version             | 1.0                                             |
| Component_status    | Active                                          |
| Data_file           | /usr/local/mysql/keyring/component_keyring_file |
| Read_only           | No                                              |
+---------------------+-------------------------------------------------+
```

A `Component_status` value of
`Active` indicates that the component
initialized successfully. If the component loaded but failed to
initialize, the value is `Disabled`.