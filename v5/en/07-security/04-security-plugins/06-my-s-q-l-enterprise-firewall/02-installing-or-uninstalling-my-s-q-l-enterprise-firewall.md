#### 6.4.6.2 Installing or Uninstalling MySQL Enterprise Firewall

MySQL Enterprise Firewall installation is a one-time operation that installs the elements described in [Section 6.4.6.1, “Elements of MySQL Enterprise Firewall”](firewall-elements.html "6.4.6.1 Elements of MySQL Enterprise Firewall"). Installation can be performed using a graphical interface or manually:

* On Windows, MySQL Installer includes an option to enable MySQL Enterprise Firewall for you.

* MySQL Workbench 6.3.4 or higher can install MySQL Enterprise Firewall, enable or disable an installed firewall, or uninstall the firewall.

* Manual MySQL Enterprise Firewall installation involves running a script located in the `share` directory of your MySQL installation.

Important

Read this entire section before following its instructions. Parts of the procedure differ depending on your environment.

Note

If installed, MySQL Enterprise Firewall involves some minimal overhead even when disabled. To avoid this overhead, do not install the firewall unless you plan to use it.

Note

MySQL Enterprise Firewall does not work together with the query cache. If the query cache is enabled, disable it before installing the firewall (see [Section 8.10.3.3, “Query Cache Configuration”](query-cache-configuration.html "8.10.3.3 Query Cache Configuration")).

For usage instructions, see [Section 6.4.6.3, “Using MySQL Enterprise Firewall”](firewall-usage.html "6.4.6.3 Using MySQL Enterprise Firewall"). For reference information, see [Section 6.4.6.4, “MySQL Enterprise Firewall Reference”](firewall-reference.html "6.4.6.4 MySQL Enterprise Firewall Reference").

* [Installing MySQL Enterprise Firewall](firewall-installation.html#firewall-install "Installing MySQL Enterprise Firewall")
* [Uninstalling MySQL Enterprise Firewall](firewall-installation.html#firewall-uninstall "Uninstalling MySQL Enterprise Firewall")

##### Installing MySQL Enterprise Firewall

If MySQL Enterprise Firewall is already installed from an older version of MySQL, uninstall it using the instructions given later in this section and then restart your server before installing the current version. In this case, it is also necessary to register your configuration again.

On Windows, you can use MySQL Installer to install MySQL Enterprise Firewall, as shown in [Figure 6.2, “MySQL Enterprise Firewall Installation on Windows”](firewall-installation.html#firewall-installation-windows-installer "Figure 6.2 MySQL Enterprise Firewall Installation on Windows"). Check the Enable MySQL Enterprise Firewall check box. (Open Firewall port for network access has a different purpose. It refers to Windows Firewall and controls whether Windows blocks the TCP/IP port on which the MySQL server listens for client connections.)

**Figure 6.2 MySQL Enterprise Firewall Installation on Windows**

![Content is described in the surrounding text.](images/firewall-windows-installer-option.png)

To install MySQL Enterprise Firewall using MySQL Workbench 6.3.4 or higher, see [MySQL Enterprise Firewall Interface](/doc/workbench/en/wb-mysql-firewall.html).

To install MySQL Enterprise Firewall manually, look in the `share` directory of your MySQL installation and choose the script that is appropriate for your platform. The available scripts differ in the suffix used to refer to the plugin library file:

* `win_install_firewall.sql`: Choose this script for Windows systems that use `.dll` as the file name suffix.

* `linux_install_firewall.sql`: Choose this script for Linux and similar systems that use `.so` as the file name suffix.

The installation script creates stored procedures in the default database, `mysql`. Run the script as follows on the command line. The example here uses the Linux installation script. Make the appropriate substitutions for your system.

```sql
$> mysql -u root -p < linux_install_firewall.sql
Enter password: (enter root password here)
```

Note

As of MySQL 5.7.21, for a new installation of MySQL Enterprise Firewall, `InnoDB` is used instead of `MyISAM` for the firewall tables. For upgrades to 5.7.21 or higher of an installation for which MySQL Enterprise Firewall is already installed, it is recommended that you alter the firewall tables to use `InnoDB`:

```sql
ALTER TABLE mysql.firewall_users ENGINE=InnoDB;
ALTER TABLE mysql.firewall_whitelist ENGINE=InnoDB;
```

Note

To use MySQL Enterprise Firewall in the context of source/replica replication, Group Replication, or InnoDB Cluster, you must use MySQL 5.7.21 or higher, and ensure that the firewall tables use `InnoDB` as just described. Then you must prepare the replica nodes prior to running the installation script on the source node. This is necessary because the [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") statements in the script are not replicated.

1. On each replica node, extract the [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") statements from the installation script and execute them manually.

2. On the source node, run the installation script as described previously.

Installing MySQL Enterprise Firewall either using a graphical interface or manually should enable the firewall. To verify that, connect to the server and execute this statement:

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'mysql_firewall_mode';
+---------------------+-------+
| Variable_name       | Value |
+---------------------+-------+
| mysql_firewall_mode | ON    |
+---------------------+-------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

##### Uninstalling MySQL Enterprise Firewall

MySQL Enterprise Firewall can be uninstalled using MySQL Workbench or manually.

To uninstall MySQL Enterprise Firewall using MySQL Workbench 6.3.4 or higher, see [MySQL Enterprise Firewall Interface](/doc/workbench/en/wb-mysql-firewall.html), in [Chapter 29, *MySQL Workbench*](workbench.html "Chapter 29 MySQL Workbench").

To uninstall MySQL Enterprise Firewall manually, execute the following statements. Statements use `IF EXISTS` because, depending on the previously installed firewall version, some objects might not exist.

```sql
DROP TABLE IF EXISTS mysql.firewall_users;
DROP TABLE IF EXISTS mysql.firewall_whitelist;

UNINSTALL PLUGIN MYSQL_FIREWALL;
UNINSTALL PLUGIN MYSQL_FIREWALL_USERS;
UNINSTALL PLUGIN MYSQL_FIREWALL_WHITELIST;

DROP FUNCTION IF EXISTS mysql_firewall_flush_status;
DROP FUNCTION IF EXISTS normalize_statement;
DROP FUNCTION IF EXISTS read_firewall_users;
DROP FUNCTION IF EXISTS read_firewall_whitelist;
DROP FUNCTION IF EXISTS set_firewall_mode;

DROP PROCEDURE IF EXISTS mysql.sp_reload_firewall_rules;
DROP PROCEDURE IF EXISTS mysql.sp_set_firewall_mode;
```
