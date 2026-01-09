## 2.3 Installing MySQL on Microsoft Windows

2.3.1 Choosing an Installation Package

2.3.2 Configuration: Using MySQL Configurator

2.3.3 Configuration: Manually

2.3.4 Troubleshooting a Microsoft Windows MySQL Server Installation

2.3.5 Windows Postinstallation Procedures

2.3.6 Windows Platform Restrictions

MySQL is available for Microsoft Windows 64-bit operating systems only. For supported Windows platform information, see <https://www.mysql.com/support/supportedplatforms/database.html>.

There are different methods to install MySQL on Microsoft Windows: the MSI, the standard binary distribution (packaged as a compressed file) containing all of the necessary files that you unpack, and source files to compile MySQL yourself. For related information, see Section 2.3.1, “Choosing an Installation Package”.

Note

MySQL 9.5 Server requires the Microsoft Visual C++ 2019 Redistributable Package to run on Windows platforms. Users should make sure the package has been installed on the system before installing the server. The package is available at the Microsoft Download Center. Additionally, MySQL debug binaries require Visual Studio 2019.

### Recommended MSI Installation Method

The simplest and recommended method is to download the MSI and let it install MySQL Server, and then use the MySQL Configurator it installs to configure MySQL:

1. Download the MSI from <https://dev.mysql.com/downloads/> and execute it. This installs the MySQL server, an associated MySQL Configurator application, and it adds related MySQL items to the Microsoft Windows Start menu under the `MySQL` group.

2. Upon completion, the installation wizard prompts to execute MySQL Configurator. Execute it now (recommended) or later, or instead choose to manually configure MySQL.

   Note

   The MySQL server won't start until it's configured; it's recommended to execute the bundled MySQL Configurator immediately after the MSI.

MySQL is now installed. If you used MySQL Configurator to configure MySQL as a Windows service, then Windows automatically starts the MySQL server every time you restart the system. Also, the MSI installs the MySQL Configurator application on the local host, which you can use later to reconfigure MySQL server. It and other MySQL start up menu items were added by the MSI.

### MySQL Installation Layout on Microsoft Windows

For MySQL 9.5 on Windows, the default installation directory is `C:\Program Files\MySQL\MySQL Server 9.5` for installations using the MSI, although the MSI Custom setup type allows using a different location. If you use the ZIP archive method to install MySQL, install it there are elsewhere, such as `C:\mysql`. Regardless, the layout of the subdirectories remains the same.

All of the files are located within this parent directory using the structure shown in the following table.

**Table 2.4 Default MySQL Installation Layout for Microsoft Windows**

<table><col style="width: 30%"/><col style="width: 40%"/><col style="width: 30%"/><thead><tr> <th>Directory</th> <th>Contents of Directory</th> <th>Notes</th> </tr></thead><tbody><tr> <th><code class="filename">bin</code></th> <td><a class="link" href="mysqld.html" title="6.3.1 mysqld — The MySQL Server"><span><strong>mysqld</strong></span></a> server, client, and utility programs</td> <td></td> </tr><tr> <th><code class="filename">%PROGRAMDATA%\MySQL\MySQL Server 9.5\</code></th> <td>Log files, databases</td> <td>The Windows system variable <code class="varname">%PROGRAMDATA%</code> defaults to <code class="filename">C:\ProgramData</code>.</td> </tr><tr> <th><code class="filename">docs</code></th> <td>Release documentation</td> <td>With the MSI, use the <code class="literal">Custom</code> type to include this optional component.</td> </tr><tr> <th><code class="filename">include</code></th> <td>Include (header) files</td> <td></td> </tr><tr> <th><code class="filename">lib</code></th> <td>Libraries</td> <td></td> </tr><tr> <th><code class="filename">share</code></th> <td>Miscellaneous support files, including error messages, character set files, sample configuration files, SQL for database installation</td> <td></td> </tr></tbody></table>

### Silent Installation Methods

Use the standard [msiexec](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/msiexec#install-options) options for a silent installation. This example includes `/i` for a normal installation, `/qn` to not show a GUI and to avoid user interaction, and `/lv` to write verbose installation output to a new log file target. Execute the installation as Administrator from the command-line, for example:

```
$> msiexec /i "C:\mysql\mysql-9.5.0-winx64.msi" /qn /lv "C:\mysql\install.log"
```

The MSI also supports `INSTALLDIR` to optionally override the default installation directory path to a non-default location. The following example installs MySQL to `C:\mysql\` instead of `C:\Program Files\MySQL\MySQL Server 9.5\`:

```
$> msiexec  /i "C:\mysql\mysql-9.5-winx64.msi" /qn /lv "C:\mysql\install.log" INSTALLDIR="C:\mysql"
```

### Additional Installation Information

By default, MySQL Configurator sets up the MySQL server as a Windows service. By using a service, you can monitor and control the operation of the server through the standard Windows service management tools. For related information about manually setting up the Windows service, see Section 2.3.3.8, “Starting MySQL as a Windows Service”.

To accommodate the `RESTART` statement, the MySQL server forks when run as a service or standalone, to enable a monitor process to supervise the server process. In this case, there are two **mysqld** processes. If `RESTART` capability is not required, the server can be started with the `--no-monitor` option. See Section 15.7.8.8, “RESTART Statement”.

Generally, you should install MySQL on Windows using an account that has administrator rights. Otherwise, you may encounter problems with certain operations such as editing the `PATH` environment variable or accessing the **Service Control Manager**. When installed, MySQL does not need to be executed using a user with Administrator privileges.

For a list of limitations on the use of MySQL on the Windows platform, see Section 2.3.6, “Windows Platform Restrictions”.

In addition to the MySQL Server package, you may need or want additional components to use MySQL with your application or development environment. These include, but are not limited to:

* To connect to the MySQL server using ODBC, you must have a Connector/ODBC driver. For more information, including installation and configuration instructions, see MySQL Connector/ODBC Developer Guide.

* To use MySQL server with .NET applications, you must have the Connector/NET driver. For more information, including installation and configuration instructions, see MySQL Connector/NET Developer Guide.

MySQL distributions for Windows can be downloaded from <https://dev.mysql.com/downloads/>. See Section 2.1.3, “How to Get MySQL”.

MySQL for Windows is available in several distribution formats, detailed here. Generally speaking, you should use the MSI to install MySQL server and MySQL Configurator to configure it. The MSI is simpler to use than the compressed file, and you need no additional tools to get MySQL up and running. MySQL Configurator automatically configures MySQL Server, creates an options file, starts the server, enables you to create default user accounts, and more. For more information on choosing a package, see Section 2.3.1, “Choosing an Installation Package”.

### MySQL on Windows Considerations

* **Large Table Support**

  If you need tables with a size larger than 4GB, install MySQL on an NTFS or newer file system. Do not forget to use `MAX_ROWS` and `AVG_ROW_LENGTH` when you create tables. See Section 15.1.24, “CREATE TABLE Statement”.

* **MySQL and Virus Checking Software**

  Virus-scanning software such as Norton/Symantec Anti-Virus on directories containing MySQL data and temporary tables can cause issues, both in terms of the performance of MySQL and the virus-scanning software misidentifying the contents of the files as containing spam. This is due to the fingerprinting mechanism used by the virus-scanning software, and the way in which MySQL rapidly updates different files, which may be identified as a potential security risk.

  After installing MySQL Server, it is recommended that you disable virus scanning on the main directory (`datadir`) used to store your MySQL table data. There is usually a system built into the virus-scanning software to enable specific directories to be ignored.

  In addition, by default, MySQL creates temporary files in the standard Windows temporary directory. To prevent the temporary files also being scanned, configure a separate temporary directory for MySQL temporary files and add this directory to the virus scanning exclusion list. To do this, add a configuration option for the `tmpdir` parameter to your `my.ini` configuration file. For more information, see Section 2.3.3.2, “Creating an Option File”.
