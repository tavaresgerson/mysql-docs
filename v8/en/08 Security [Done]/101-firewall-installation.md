#### 8.4.7.2 Installing or Uninstalling MySQL Enterprise Firewall

MySQL Enterprise Firewall installation is a one-time operation that installs the elements described in  Section 8.4.7.1, “Elements of MySQL Enterprise Firewall”. Installation can be performed using a graphical interface or manually:

* On Windows, MySQL Configurator includes an option to enable MySQL Enterprise Firewall for you.
* MySQL Workbench 6.3.4 or higher can install MySQL Enterprise Firewall, enable or disable an installed firewall, or uninstall the firewall.
* Manual MySQL Enterprise Firewall installation involves running a script located in the `share` directory of your MySQL installation. Important

Read this entire section before following its instructions. Parts of the procedure differ depending on your environment.

::: info Note

If installed, MySQL Enterprise Firewall involves some minimal overhead even when disabled. To avoid this overhead, do not install the firewall unless you plan to use it.

:::

For usage instructions, see  Section 8.4.7.3, “Using MySQL Enterprise Firewall”. For reference information, see Section 8.4.7.4, “MySQL Enterprise Firewall Reference”.

*  Installing MySQL Enterprise Firewall
*  Uninstalling MySQL Enterprise Firewall

##### Installing MySQL Enterprise Firewall

If MySQL Enterprise Firewall is already installed from an older version of MySQL, uninstall it using the instructions given later in this section and then restart your server before installing the current version. In this case, it is also necessary to register your configuration again.

On Windows, you can use  Section 2.3.2, “Configuration: Using MySQL Configurator” to install MySQL Enterprise Firewall by checking the Enable MySQL Enterprise Firewall check box from the `Type and Networking` tab. (Open Firewall port for network access has a different purpose. It refers to Windows Firewall and controls whether Windows blocks the TCP/IP port on which the MySQL server listens for client connections.)

To install MySQL Enterprise Firewall using MySQL Workbench, see MySQL Enterprise Firewall Interface.

To install MySQL Enterprise Firewall manually, look in the `share` directory of your MySQL installation and choose the script that is appropriate for your platform. The available scripts differ in the file name used to refer to the script:

* `win_install_firewall.sql`
* `linux_install_firewall.sql`

The installation script creates stored procedures and tables in the firewall database you specify when you run the script. The `mysql` system database is the traditional storage option, however, it is preferred that you create and use a custom schema for this purpose.

To use the `mysql` system database, run the script as follows from the command line. The example here uses the Linux installation script. Make the appropriate substitutions for your system.

```
$> mysql -u root -p -D mysql < linux_install_firewall.sql
Enter password: (enter root password here)
```

To create and use a custom schema with the script, do the following:

1. Start the server with the `--loose-mysql-firewall-database=database-name` option. Insert the name of the custom schema to be used as the firewall database.

   By prefixing the option with `--loose`, the program does not emit an error and exit, but instead issues only a warning.
2. Invoke the MySQL client program and create the custom schema on the server.

   ```
   mysql> CREATE DATABASE IF NOT EXISTS database-name;
   ```
3. Run the script, naming the custom schema as the database for MySQL Enterprise Firewall.

   ```
   $> mysql -u root -p -D database-name < linux_install_firewall.sql
   Enter password: (enter root password here)
   ```

Installing MySQL Enterprise Firewall either using a graphical interface or manually should enable the firewall. To verify that, connect to the server and execute this statement:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'mysql_firewall_mode';
+---------------------+-------+
| Variable_name       | Value |
+---------------------+-------+
| mysql_firewall_mode | ON    |
+---------------------+-------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

::: info Note

To use MySQL Enterprise Firewall in the context of source/replica replication, Group Replication, or InnoDB Cluster, you must prepare the replica nodes prior to running the installation script on the source node. This is necessary because the `INSTALL PLUGIN` statements in the script are not replicated.

1. On each replica node, extract the `INSTALL PLUGIN` statements from the installation script and execute them manually.
2. On the source node, run the installation script as described previously.

:::

##### Uninstalling MySQL Enterprise Firewall

MySQL Enterprise Firewall can be uninstalled using MySQL Workbench or manually.

To uninstall MySQL Enterprise Firewall using MySQL Workbench 6.3.4 or higher, see MySQL Enterprise Firewall Interface, in Chapter 33, *MySQL Workbench*.

To uninstall MySQL Enterprise Firewall at the command line, run the uninstall script located in the `share` directory of your MySQL installation. The example here specifies the system database, `mysql`.

```
$> mysql -u root -p -D mysql < uninstall_firewall.sql
Enter password: (enter root password here)
```

If you created a custom schema when you installed MySQL Enterprise Firewall, make the appropriate substitution for your system.

```
$> mysql -u root -p -D database-name < uninstall_firewall.sql
Enter password: (enter root password here)
```

This script removes the plugins, tables, functions, and stored procedures for MySQL Enterprise Firewall.
