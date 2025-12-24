## 3.11 Upgrading MySQL on Windows

To upgrade MySQL on Windows, either download and execute the latest MySQL Server MSI or use the Windows ZIP archive distribution.

::: info Note

Unlike MySQL 8.4, MySQL 8.0 uses MySQL Installer to install and upgrade MySQL Server along with most other MySQL products; but MySQL Installer is not available with MySQL 8.1 and higher. However, the configuration functionality used in MySQL Installer is available as of MySQL 8.1 using  Section 2.3.2, “Configuration: Using MySQL Configurator” that is bundled with both the MSI and Zip archive.

:::

The approach you select depends on how the existing installation was performed. Before proceeding, review Chapter 3, *Upgrading MySQL* for additional information on upgrading MySQL that is not specific to Windows.

### Upgrading MySQL with MSI

Download and execute the latest MSI. Although upgrading between release series is not directly supported, the "Custom Setup" option allows defining an installation location as otherwise the MSI installs to the standard location, such as `C:\Program Files\MySQL\MySQL Server 8.4\`.

Execute MySQL Configurator to configure your installation.

### Upgrading MySQL Using the Windows ZIP Distribution

To perform an upgrade using the Windows ZIP archive distribution:

1. Download the latest Windows ZIP Archive distribution of MySQL from <https://dev.mysql.com/downloads/>.
2. If the server is running, stop it. If the server is installed as a service, stop the service with the following command from the command prompt:

   ```
   C:\> SC STOP mysqld_service_name
   ```

   Alternatively, use `NET STOP mysqld_service_name`.

   If you are not running the MySQL server as a service, use `mysqladmin` to stop it. For example, before upgrading from MySQL 8.3 to 8.4, use `mysqladmin` from MySQL 8.3 as follows:

   ```
   C:\> "C:\Program Files\MySQL\MySQL Server 8.3\bin\mysqladmin" -u root shutdown
   ```

   ::: info Note

   If the MySQL `root` user account has a password, invoke  `mysqladmin` with the `-p` option and enter the password when prompted.

   :::

3. Extract the ZIP archive. You may either overwrite your existing MySQL installation (usually located at `C:\mysql`), or install it into a different directory, such as `C:\mysql8`. Overwriting the existing installation is recommended.
4. Restart the server. For example, use the `SC START mysqld_service_name`  or `NET START mysqld_service_name` command if you run MySQL as a service, or invoke `mysqld` directly otherwise.
5. If you encounter errors, see Section 2.3.4, “Troubleshooting a Microsoft Windows MySQL Server Installation”.

