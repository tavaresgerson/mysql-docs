### 7.5.2 Obtaining Component Information

The `mysql.component` system table contains information about currently loaded components and shows which components have been registered using `INSTALL COMPONENT`. Selecting from the table shows which components are installed. For example:

```
mysql> SELECT * FROM mysql.component;
+--------------+--------------------+------------------------------------+
| component_id | component_group_id | component_urn                      |
+--------------+--------------------+------------------------------------+
|            1 |                  1 | file://component_validate_password |
|            2 |                  2 | file://component_log_sink_json     |
+--------------+--------------------+------------------------------------+
```

The `component_id` and `component_group_id` values are for internal use. The `component_urn` is the URN used in `INSTALL COMPONENT` and `UNINSTALL COMPONENT` statements to load and unload the component.
