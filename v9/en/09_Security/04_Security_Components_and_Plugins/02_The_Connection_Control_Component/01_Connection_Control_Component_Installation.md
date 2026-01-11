#### 8.4.2.1 Connection Control Component Installation

The Connection Control Component is available in both the Community and Enterprise distributions of MySQL. The component can be installed in a running MySQL server using the `INSTALL COMPONENT` statement shown here:

```
mysql> INSTALL COMPONENT 'file://component_connection_control';
Query OK, 0 rows affected (0.01 sec)
```

To verify that the component was installed successfully, you can query the `mysql.component` table like this:

```
mysql> SELECT * FROM mysql.component
    -> WHERE component_urn LIKE '%connection%';
+--------------+--------------------+-------------------------------------+
| component_id | component_group_id | component_urn                       |
+--------------+--------------------+-------------------------------------+
|           16 |                 12 | file://component_connection_control |
+--------------+--------------------+-------------------------------------+
1 row in set (0.00 sec)
```

No additional steps are required to install and run the component. While it can be used with the default settings, you may wish to tune its operations to meet conditions specific to your environment. The next section, Section 8.4.2.2, “Connection Control Component Configuration”, provides information on how to accomplish this task.

See also Section 7.5.1, “Installing and Uninstalling Components”.
