## 2.3 Installing MySQL on Microsoft Windows

2.3.1 MySQL Installation Layout on Microsoft Windows

2.3.2 Choosing an Installation Package

2.3.3 MySQL Installer for Windows

2.3.4 Installing MySQL on Microsoft Windows Using a `noinstall` ZIP Archive

2.3.5 Troubleshooting a Microsoft Windows MySQL Server Installation

2.3.6 Windows Postinstallation Procedures

2.3.7 Windows Platform Restrictions

Important

MySQL Community 5.7 Server requires the Microsoft Visual C++ 2019 Redistributable Package to run on Windows platforms. Users should make sure the package has been installed on the system before installing the server. The package is available at the Microsoft Download Center.

This requirement changed over time: MySQL 5.7.37 and below requires the Microsoft Visual C++ 2013 Redistributable Package, MySQL 5.7.38 and 5.7.39 require both, and only the Microsoft Visual C++ 2019 Redistributable Package is required as of MySQL 5.7.40.

MySQL is available for Microsoft Windows, for both 32-bit and 64-bit versions. For supported Windows platform information, see <https://www.mysql.com/support/supportedplatforms/database.html>.

Important

If your operating system is Windows 2008 R2 or Windows 7 and you do not have Service Pack 1 (SP1) installed, MySQL 5.7 regularly restarts with the following message in the MySQL server error log file:

```sql
mysqld got exception 0xc000001d
```

This error message occurs because you are also using a CPU that does not support the VPSRLQ instruction, indicating that the CPU instruction that was attempted is not supported.

To fix this error, you *must* install SP1. This adds the required operating system support for CPU capability detection and disables that support when the CPU does not have the required instructions.

Alternatively, install an older version of MySQL, such as 5.6.

There are different methods to install MySQL on Microsoft Windows.

### MySQL Installer Method

The simplest and recommended method is to download MySQL Installer (for Windows) and let it install and configure all of the MySQL products on your system. Here is how:

1. Download MySQL Installer from <https://dev.mysql.com/downloads/installer/> and execute it.

   Note

   Unlike the standard MySQL Installer, the smaller "web-community" version does not bundle any MySQL applications but rather downloads the MySQL products you choose to install.

2. Choose the appropriate Setup Type for your system. Typically you should choose Developer Default to install MySQL server and other MySQL tools related to MySQL development, helpful tools like MySQL Workbench. Choose the Custom setup type instead to manually select your desired MySQL products.

   Note

   Multiple versions of MySQL server can exist on a single system. You can choose one or multiple versions.

3. Complete the installation process by following the instructions. This installa several MySQL products and starts the MySQL server.

MySQL is now installed. If you configured MySQL as a service, then Windows automatically starts MySQL server every time you restart your system.

Note

You probably also installed other helpful MySQL products like MySQL Workbench on your system. Consider loading Chapter 29, *MySQL Workbench* to check your new MySQL server connection By default, this program automatically starts after installing MySQL.

This process also installs the MySQL Installer application on your system, and later you can use MySQL Installer to upgrade or reconfigure your MySQL products.

### Additional Installation Information

It is possible to run MySQL as a standard application or as a Windows service. By using a service, you can monitor and control the operation of the server through the standard Windows service management tools. For more information, see Section 2.3.4.8, “Starting MySQL as a Windows Service”.

Generally, you should install MySQL on Windows using an account that has administrator rights. Otherwise, you may encounter problems with certain operations such as editing the `PATH` environment variable or accessing the **Service Control Manager**. When installed, MySQL does not need to be executed using a user with Administrator privileges.

For a list of limitations on the use of MySQL on the Windows platform, see Section 2.3.7, “Windows Platform Restrictions”.

In addition to the MySQL Server package, you may need or want additional components to use MySQL with your application or development environment. These include, but are not limited to:

* To connect to the MySQL server using ODBC, you must have a Connector/ODBC driver. For more information, including installation and configuration instructions, see MySQL Connector/ODBC Developer Guide.

  Note

  MySQL Installer installs and configures Connector/ODBC for you.

* To use MySQL server with .NET applications, you must have the Connector/NET driver. For more information, including installation and configuration instructions, see MySQL Connector/NET Developer Guide.

  Note

  MySQL Installer installs and configures MySQL Connector/NET for you.

MySQL distributions for Windows can be downloaded from <https://dev.mysql.com/downloads/>. See Section 2.1.3, “How to Get MySQL”.

MySQL for Windows is available in several distribution formats, detailed here. Generally speaking, you should use MySQL Installer. It contains more features and MySQL products than the older MSI, is simpler to use than the compressed file, and you need no additional tools to get MySQL up and running. MySQL Installer automatically installs MySQL Server and additional MySQL products, creates an options file, starts the server, and enables you to create default user accounts. For more information on choosing a package, see Section 2.3.2, “Choosing an Installation Package”.

* A MySQL Installer distribution includes MySQL Server and additional MySQL products, including MySQL Workbench. MySQL Installer can also be used to upgrade these products in the future.

  For instructions on installing MySQL using MySQL Installer, see Section 2.3.3, “MySQL Installer for Windows”.

* The standard binary distribution (packaged as a compressed file) contains all of the necessary files that you unpack into your chosen location. This package contains all of the files in the full Windows MSI Installer package, but does not include an installation program.

  For instructions on installing MySQL using the compressed file, see Section 2.3.4, “Installing MySQL on Microsoft Windows Using a `noinstall` ZIP Archive”.

* The source distribution format contains all the code and support files for building the executables using the Visual Studio compiler system.

  For instructions on building MySQL from source on Windows, see Section 2.8, “Installing MySQL from Source”.

### MySQL on Windows Considerations

* **Large Table Support**

  If you need tables with a size larger than 4 GB, install MySQL on an NTFS or newer file system. Do not forget to use `MAX_ROWS` and `AVG_ROW_LENGTH` when you create tables. See Section 13.1.18, “CREATE TABLE Statement”.

  Note

  InnoDB tablespace files cannot exceed 4 GB on Windows 32-bit systems.

* **MySQL and Virus Checking Software**

  Virus-scanning software such as Norton/Symantec Anti-Virus on directories containing MySQL data and temporary tables can cause issues, both in terms of the performance of MySQL and the virus-scanning software misidentifying the contents of the files as containing spam. This is due to the fingerprinting mechanism used by the virus-scanning software, and the way in which MySQL rapidly updates different files, which may be identified as a potential security risk.

  After installing MySQL Server, it is recommended that you disable virus scanning on the main directory (`datadir`) used to store your MySQL table data. There is usually a system built into the virus-scanning software to enable specific directories to be ignored.

  In addition, by default, MySQL creates temporary files in the standard Windows temporary directory. To prevent the temporary files also being scanned, configure a separate temporary directory for MySQL temporary files and add this directory to the virus scanning exclusion list. To do this, add a configuration option for the `tmpdir` parameter to your `my.ini` configuration file. For more information, see Section 2.3.4.2, “Creating an Option File”.

* **Running MySQL on a 4K Sector Hard Drive**

  Running the MySQL server on a 4K sector hard drive on Windows is not supported with `innodb_flush_method=async_unbuffered`, which is the default setting. The workaround is to use `innodb_flush_method=normal`.
