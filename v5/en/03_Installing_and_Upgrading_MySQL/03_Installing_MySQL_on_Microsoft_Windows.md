## 2.3 Installing MySQL on Microsoft Windows

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

### 2.3.1 MySQL Installation Layout on Microsoft Windows

For MySQL 5.7 on Windows, the default installation directory is `C:\Program Files\MySQL\MySQL Server 5.7` for installations performed with MySQL Installer. If you use the ZIP archive method to install MySQL, you may prefer to install in `C:\mysql`. However, the layout of the subdirectories remains the same.

All of the files are located within this parent directory, using the structure shown in the following table.

**Table 2.4 Default MySQL Installation Layout for Microsoft Windows**

<table>
  <thead>
    <tr>
      <th>Directory</th>
      <th>Contents of Directory</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>bin</code></th>
      <td><strong>mysqld</strong>server, client and utility programs</td>
      <td></td>
    </tr>
    <tr>
      <th><code>%PROGRAMDATA%\MySQL\MySQL Server 5.7\</code></th>
      <td>Log files, databases</td>
      <td>The Windows system variable <code>%PROGRAMDATA%</code> defaults to
        <code>C:\ProgramData</code>.
      </td>
    </tr>
    <tr>
      <th><code>docs</code></th>
      <td>Release documentation</td>
      <td>With MySQL Installer, use the <code>Modify</code> operation to select this
        optional folder.
      </td>
    </tr>
    <tr>
      <th><code>include</code></th>
      <td>Include (header) files</td>
      <td></td>
    </tr>
    <tr>
      <th><code>lib</code></th>
      <td>Libraries</td>
      <td></td>
    </tr>
    <tr>
      <th><code>share</code></th>
      <td>Miscellaneous support files, including error messages, character set
        files, sample configuration files, SQL for database
        installation
      </td>
      <td></td>
    </tr>
  </tbody>
</table>

### 2.3.2 Choosing an Installation Package

For MySQL 5.7, there are multiple installation package formats to choose from when installing MySQL on Windows. The package formats described in this section are:

* MySQL Installer
* MySQL noinstall ZIP Archives
* MySQL Docker Images

Program Database (PDB) files (with file name extension `pdb`) provide information for debugging your MySQL installation in the event of a problem. These files are included in ZIP Archive distributions (but not MSI distributions) of MySQL.

#### MySQL Installer

This package has a file name similar to `mysql-installer-community-5.7.44.0.msi` or `mysql-installer-commercial-5.7.44.0.msi`, and uses MSIs to automatically install MySQL server and other products. MySQL Installer downloads and apply updates to itself, and for each of the installed products. It also configures the installed MySQL server (including a sandbox InnoDB cluster test setup) and MySQL Router. MySQL Installer is recommended for most users.

MySQL Installer can install and manage (add, modify, upgrade, and remove) many other MySQL products, including:

* Applications – MySQL Workbench, MySQL for Visual Studio, MySQL Utilities, MySQL Shell, MySQL Router

* Connectors – MySQL Connector/C++, MySQL Connector/NET, Connector/ODBC, MySQL Connector/Python, MySQL Connector/J, MySQL Connector/Node.js

* Documentation – MySQL Manual (PDF format), samples and examples

MySQL Installer operates on all MySQL supported versions of Windows (see <https://www.mysql.com/support/supportedplatforms/database.html>).

Note

Because MySQL Installer is not a native component of Microsoft Windows and depends on .NET, it does not work on installations with minimal options like the Server Core version of Windows Server.

For instructions on how to install MySQL using MySQL Installer, see Section 2.3.3, “MySQL Installer for Windows”.

#### MySQL noinstall ZIP Archives

These packages contain the files found in the complete MySQL Server installation package, with the exception of the GUI. This format does not include an automated installer, and must be manually installed and configured.

The `noinstall` ZIP archives are split into two separate compressed files. The main package is named `mysql-VERSION-winx64.zip` for 64-bit and `mysql-VERSION-win32.zip` for 32-bit. This contains the components needed to use MySQL on your system. The optional MySQL test suite, MySQL benchmark suite, and debugging binaries/information components (including PDB files) are in a separate compressed file named `mysql-VERSION-winx64-debug-test.zip` for 64-bit and `mysql-VERSION-win32-debug-test.zip` for 32-bit.

If you choose to install a `noinstall` ZIP archive, see Section 2.3.4, “Installing MySQL on Microsoft Windows Using a `noinstall` ZIP Archive”.

#### MySQL Docker Images

For information on using the MySQL Docker images provided by Oracle on Windows platform, see Section 2.5.7.3, “Deploying MySQL on Windows and Other Non-Linux Platforms with Docker”.

Warning

The MySQL Docker images provided by Oracle are built specifically for Linux platforms. Other platforms are not supported, and users running the MySQL Docker images from Oracle on them are doing so at their own risk.

### 2.3.3 MySQL Installer for Windows

MySQL Installer is a standalone application designed to ease the complexity of installing and configuring MySQL products that run on Microsoft Windows. It is downloaded with and supports the following MySQL products:

* MySQL Servers

  MySQL Installer can install and manage multiple, separate MySQL server instances on the same host at the same time. For example, MySQL Installer can install, configure, and upgrade separate instances of MySQL 5.7 and MySQL 8.0 on the same host. MySQL Installer does not permit server upgrades between major and minor version numbers, but does permit upgrades within a release series (such as 8.0.36 to 8.0.37).

  Note

  MySQL Installer cannot install both *Community* and *Commercial* releases of MySQL server on the same host. If you require both releases on the same host, consider using the ZIP archive distribution to install one of the releases.

* MySQL Applications

  MySQL Workbench, MySQL Shell, and MySQL Router.

* MySQL Connectors

  These are not supported, instead install from <https://dev.mysql.com/downloads/>. These connectors include MySQL Connector/NET, MySQL Connector/Python, MySQL Connector/ODBC, MySQL Connector/J, MySQL Connector/Node.js, and MySQL Connector/C++.

  Note

  The connectors were bundled before MySQL Installer 1.6.7 (MySQL Server 8.0.34), and MySQL Installer could install each connector up to version 8.0.33 until MySQL Installer 1.6.11 (MySQL Server 8.0.37). MySQL Installer now only detects these old connector versions to uninstall them.

#### Installation Requirements

MySQL Installer requires Microsoft .NET Framework 4.5.2 or later. If this version is not installed on the host computer, you can download it by visiting the [Microsoft website](https://www.microsoft.com/en-us/download/details.aspx?id=42643).

To invoke MySQL Installer after a successful installation:

1. Right-click Windows Start, select Run, and then click Browse. Navigate to `Program Files (x86) > MySQL > MySQL Installer for Windows` to open the program folder.

2. Select one of the following files:

   * `MySQLInstaller.exe` to open the graphical application.

   * `MySQLInstallerConsole.exe` to open the command-line application.

3. Click Open and then click OK in the Run window. If you are prompted to allow the application to make changes to the device, select `Yes`.

Each time you invoke MySQL Installer, the initialization process looks for the presence of an internet connection and prompts you to enable offline mode if it finds no internet access (and offline mode is disabled). Select `Yes` to run MySQL Installer without internet-connection capabilities. MySQL product availability is limited to only those products currently in the product cache when you enable offline mode. To download MySQL products, click the offline mode Disable quick action shown on the dashboard.

An internet connection is required to download a manifest containing metadata for the latest MySQL products that are not part of a full bundle. MySQL Installer attempts to download the manifest when you start the application for the first time and then periodically in configurable intervals (see MySQL Installer options). Alternatively, you can retrieve an updated manifest manually by clicking Catalog in the MySQL Installer dashboard.

Note

If the first-time or subsequent manifest download is unsuccessful, an error is logged and you may have limited access to MySQL products during your session. MySQL Installer attempts to download the manifest with each startup until the initial manifest structure is updated. For help finding a product, see Locating Products to Install.

#### MySQL Installer Community Release

Download software from <https://dev.mysql.com/downloads/installer/> to install the Community release of all MySQL products for Windows. Select one of the following MySQL Installer package options:

* *Web*: Contains MySQL Installer and configuration files only. The web package option downloads only the MySQL products you select to install, but it requires an internet connection for each download. The size of this file is approximately 2 MB. The file name has the form `mysql-installer-community-web-VERSION.N.msi` in which *`VERSION`* is the MySQL server version number such as 8.0 and `N` is the package number, which begins at 0.

* *Full or Current Bundle*: Bundles all of the MySQL products for Windows (including the MySQL server). The file size is over 300 MB, and the name has the form `mysql-installer-community-VERSION.N.msi` in which *`VERSION`* is the MySQL Server version number such as 8.0 and `N` is the package number, which begins at 0.

#### MySQL Installer Commercial Release

Download software from <https://edelivery.oracle.com/> to install the Commercial release (Standard or Enterprise Edition) of MySQL products for Windows. If you are logged in to your My Oracle Support (MOS) account, the Commercial release includes all of the current and previous GA versions available in the Community release, but it excludes development-milestone versions. When you are not logged in, you see only the list of bundled products that you downloaded already.

The Commercial release also includes the following products:

* Workbench SE/EE
* MySQL Enterprise Backup
* MySQL Enterprise Firewall

The Commercial release integrates with your MOS account. For knowledge-base content and patches, see [My Oracle Support](https://support.oracle.com/).

#### 2.3.3.1 MySQL Installer Initial Setup

* Choosing a Setup Type
* Path Conflicts
* Check Requirements
* MySQL Installer Configuration Files

When you download MySQL Installer for the first time, a setup wizard guides
you through the initial installation of MySQL products. As the
following figure shows, the initial setup is a one-time activity
in the overall process. MySQL Installer detects existing MySQL products
installed on the host during its initial setup and adds them to
the list of products to be managed.

**Figure 2.7 MySQL Installer Process Overview**

![MySQL Installer process. Non-repeating steps: download MySQL Installer; perform the initial setup. Repeating steps: install products (download products, run .msi files, configuration, and install complete); manage products and update the MySQL Installer catalog.](images/mi-process-overview.png)

MySQL Installer extracts configuration files (described later) to the hard drive of the host during the initial setup. Although MySQL Installer is a 32-bit application, it can install both 32-bit and 64-bit binaries.

The initial setup adds a link to the Start menu under the MySQL folder group. Click Start, MySQL, and MySQL Installer - [Community | Commercial] to open the community or commercial release of the graphical tool.

##### Choosing a Setup Type

During the initial setup, you are prompted to select the MySQL products to be installed on the host. One alternative is to use a predetermined setup type that matches your setup requirements. By default, both GA and pre-release products are included in the download and installation with the Client only and Full setup types. Select the Only install GA products option to restrict the product set to include GA products only when using these setup types.

Note

Commercial-only MySQL products, such as MySQL Enterprise Backup, are available to select and install if you are using the Commercial version of MySQL Installer (see MySQL Installer Commercial Release).

Choosing one of the following setup types determines the initial installation only and does not limit your ability to install or update MySQL products for Windows later:

* **Server only**: Only install the MySQL server. This setup type installs the general availability (GA) or development release server that you selected when you downloaded MySQL Installer. It uses the default installation and data paths.

* **Client only**: Only install the most recent MySQL applications (such as MySQL Shell, MySQL Router, and MySQL Workbench). This setup type excludes MySQL server or the client programs typically bundled with the server, such as **mysql** or **mysqladmin**.

* **Full**: Install all available MySQL products, excluding MySQL connectors.

* **Custom**: The custom setup type enables you to filter and select individual MySQL products from the MySQL Installer catalog.

  Use the `Custom` setup type to install:

  + A product or product version that is not available from the usual download locations. The catalog contains all product releases, including the other releases between pre-release (or development) and GA.

  + An instance of MySQL server using an alternative installation path, data path, or both. For instructions on how to adjust the paths, see Section 2.3.3.2, “Setting Alternative Server Paths with MySQL Installer”.

  + Two or more MySQL server versions on the same host at the same time (for example, 5.7 and 8.0).

  + A specific combination of products and features not offered as a predetermine setup type. For example, you can install a single product, such as MySQL Workbench, instead of installing all client applications for Windows.

##### Path Conflicts

When the default installation or data folder (required by MySQL server) for a product to be installed already exists on the host, the wizard displays the Path Conflict step to identify each conflict and enable you to take action to avoid having files in the existing folder overwritten by the new installation. You see this step in the initial setup only when MySQL Installer detects a conflict.

To resolve the path conflict, do one of the following:

* Select a product from the list to display the conflict options. A warning symbol indicates which path is in conflict. Use the browse button to choose a new path and then click Next.

* Click Back to choose a different setup type or product version, if applicable. The `Custom` setup type enables you to select individual product versions.

* Click Next to ignore the conflict and overwrite files in the existing folder.

* Delete the existing product. Click Cancel to stop the initial setup and close MySQL Installer. Open MySQL Installer again from the Start menu and delete the installed product from the host using the Delete operation from the MySQL Installer dashboard.

##### Check Requirements

MySQL Installer uses entries in the `package-rules.xml` file to determine whether the prerequisite software for each product is installed on the host. When the requirements check fails, MySQL Installer displays the Check Requirements step to help you update the host. Requirements are evaluated each time you download a new product (or version) for installation. The following figure identifies and describes the key areas of this step.

**Figure 2.8 Check Requirements**

![MySQL Installer check-requirements before any requirements are downloaded and installed.](images/mi-requirements-annotated.png)

###### Description of Check Requirements Elements

1. Shows the current step in the initial setup. Steps in this list may change slightly depending on the products already installed on the host, the availability of prerequisite software, and the products to be installed on the host.

2. Lists all pending installation requirements by product and indicates the status as follows:

   * A blank space in the Status column means that MySQL Installer can attempt to download and install the required software for you.

   * The word *Manual* in the Status column means that you must satisfy the requirement manually. Select each product in the list to see its requirement details.

3. Describes the requirement in detail to assist you with each manual resolution. When possible, a download URL is provided. After you download and install the required software, click Check to verify that the requirement has been met.

4. Provides the following set operations to proceed:

   * Back – Return to the previous step. This action enables you to select a different the setup type.

   * Execute – Have MySQL Installer attempt to download and install the required software for all items without a manual status. Manual requirements are resolved by you and verified by clicking Check.

   * Next – Do not execute the request to apply the requirements automatically and proceed to the installation without including the products that fail the check requirements step.

   * Cancel – Stop the installation of MySQL products. Because MySQL Installer is already installed, the initial setup begins again when you open MySQL Installer from the Start menu and click Add from the dashboard. For a description of the available management operations, see Product Catalog.

##### MySQL Installer Configuration Files

All MySQL Installer files are located within the `C:\Program Files (x86)` and `C:\ProgramData` folders. The following table describes the files and folders that define MySQL Installer as a standalone application.

Note

Installed MySQL products are neither altered nor removed when you update or uninstall MySQL Installer.

**Table 2.5 MySQL Installer Configuration Files**

<table>
  <thead>
    <tr>
      <th>File or Folder</th>
      <th>Description</th>
      <th>Folder Hierarchy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>
        <code>MySQL Installer for Windows</code>
      </th>
      <td>
        This folder contains all of the files needed to run MySQL Installer and <code>MySQLInstallerConsole.exe</code>, a command-line program with similar functionality.
      </td>
      <td>
        <code>C:\Program Files (x86)</code>
      </td>
    </tr>
    <tr>
      <th>
        <code>Templates</code>
      </th>
      <td>
        The <code>Templates</code> folder has one file for each version of MySQL server. Template files contain keys and formulas to calculate some values dynamically.
      </td>
      <td>
        <code>C:\ProgramData\MySQL\MySQL Installer for Windows\Manifest</code>
      </td>
    </tr>
    <tr>
      <th><code>package-rules.xml</code></th>
      <td>
          This file contains the prerequisites for every product to be installed.
      </td>
      <td>
        <code>C:\ProgramData\MySQL\MySQL Installer for Windows\Manifest</code>
      </td>
    </tr>
    <tr>
      <th><code>products.xml</code></th>
      <td>
        The <code>products</code> file (or product catalog) contains a list of all products available for download.
      </td>
      <td>
        <code>C:\ProgramData\MySQL\MySQL Installer for Windows\Manifest</code>
      </td>
    </tr>
    <tr>
      <th><code>Product Cache</code></th>
      <td>
          The <code>Product Cache</code> folder contains all standalone <code>.msi</code> files bundled with the full package or downloaded afterward.
      </td>
      <td>
        <code>C:\ProgramData\MySQL\MySQL Installer for Windows</code>
      </td>
    </tr>
  </tbody>
</table>

#### 2.3.3.2 Setting Alternative Server Paths with MySQL Installer

You can change the default installation path, the data path, or both when you install MySQL server. After you have installed the server, the paths cannot be altered without removing and reinstalling the server instance.

Note

Starting with MySQL Installer 1.4.39, if you move the data directory of an installed server manually, MySQL Installer identifies the change and can process a reconfiguration operation without errors.

**To change paths for MySQL server**

1. Identify the MySQL server to change and enable the Advanced Options link as follows:

   1. Navigate to the Select Products page by doing one of the following:

      1. If this is an initial setup of MySQL Installer, select the `Custom` setup type and click Next.

      2. If MySQL Installer is installed on your computer, click Add from the dashboard.

   2. Click Edit to apply a filter on the product list shown in Available Products (see Locating Products to Install).

   3. With the server instance selected, use the arrow to move the selected server to the Products To Be Installed list.

   4. Click the server to select it. When you select the server, the Advanced Options link is enabled below the list of products to be installed (see the following figure).

2. Click Advanced Options to open a dialog box where you can enter alternative path names. After the path names are validated, click Next to continue with the configuration steps.

   **Figure 2.9 Change MySQL Server Path**

   ![Content is described in the surrounding text.](images/mi-path-advanced-options-annotated.png)

#### 2.3.3.3 Installation Workflows with MySQL Installer

MySQL Installer provides a wizard-like tool to install and configure new MySQL products for Windows. Unlike the initial setup, which runs only once, MySQL Installer invokes the wizard each time you download or install a new product. For first-time installations, the steps of the initial setup proceed directly into the steps of the installation. For assistance with product selection, see Locating Products to Install.

Note

Full permissions are granted to the user executing MySQL Installer to all generated files, such as `my.ini`. This does not apply to files and directories for specific products, such as the MySQL server data directory in `%ProgramData%` that is owned by `SYSTEM`.

Products installed and configured on a host follow a general pattern that might require your input during the various steps. If you attempt to install a product that is incompatible with the existing MySQL server version (or a version selected for upgrade), you are alerted about the possible mismatch.

MySQL Installer provides the following sequence of actions that apply to different workflows:

* **Select Products.** If you selected the `Custom` setup type during the initial setup or clicked Add from the MySQL Installer dashboard, MySQL Installer includes this action in the sidebar. From this page, you can apply a filter to modify the Available Products list and then select one or more products to move (using arrow keys) to the Products To Be Installed list.

  Select the check box on this page to activate the Select Features action where you can customize the products features after the product is downloaded.

* **Download.** If you installed the full (not web) MySQL Installer package, all `.msi` files were loaded to the `Product Cache` folder during the initial setup and are not downloaded again. Otherwise, click Execute to begin the download. The status of each product changes from `Ready to Download`, to `Downloading`, and then to `Downloaded`.

  To retry a single unsuccessful download, click the Try Again link.

  To retry all unsuccessful downloads, click Try All.

* **Select Features To Install (disabled by default).** After MySQL Installer downloads a product's `.msi` file, you can customize the features if you enabled the optional check box previously during the Select Products action.

  To customize product features after the installation, click Modify in the MySQL Installer dashboard.

* **Installation.** The status of each product in the list changes from `Ready to Install`, to `Installing`, and lastly to `Complete`. During the process, click Show Details to view the installation actions.

  If you cancel the installation at this point, the products are installed, but the server (if installed) is not yet configured. To restart the server configuration, open MySQL Installer from the Start menu and click Reconfigure next to the appropriate server in the dashboard.

* **Product configuration.** This step applies to MySQL Server, MySQL Router, and samples only. The status for each item in the list should indicate `Ready to Configure`. Click Next to start the configuration wizard for all items in the list. The configuration options presented during this step are specific to the version of database or router that you selected to install.

  Click Execute to begin applying the configuration options or click Back (repeatedly) to return to each configuration page.

* **Installation complete.** This step finalizes the installation for products that do not require configuration. It enables you to copy the log to a clipboard and to start certain applications, such as MySQL Workbench and MySQL Shell. Click Finish to open the MySQL Installer dashboard.

##### 2.3.3.3.1 MySQL Server Configuration with MySQL Installer

MySQL Installer performs the initial configuration of the MySQL server. For example:

* It creates the configuration file (`my.ini`) that is used to configure the MySQL server. The values written to this file are influenced by choices you make during the installation process. Some definitions are host dependent.

* By default, a Windows service for the MySQL server is added. * Provides default installation and data paths for MySQL server. For instructions on how to change the default paths, see Section 2.3.3.2, “Setting Alternative Server Paths with MySQL Installer”.

* It can optionally create MySQL server user accounts with configurable permissions based on general roles, such as DB Administrator, DB Designer, and Backup Admin. It optionally creates a Windows user named `MysqlSys` with limited privileges, which would then run the MySQL Server.

  User accounts may also be added and configured in MySQL Workbench.

* Checking Show Advanced Options enables additional Logging Options to be set. This includes defining custom file paths for the error log, general log, slow query log (including the configuration of seconds it requires to execute a query), and the binary log.

During the configuration process, click Next to proceed to the next step or Back to return to the previous step. Click Execute at the final step to apply the server configuration.

The sections that follow describe the server configuration options that apply to MySQL server on Windows. The server version you installed will determine which steps and options you can configure. Configuring MySQL server may include some or all of the steps.

###### 2.3.3.3.1.1 Type and Networking

* Server Configuration Type

  Choose the MySQL server configuration type that describes your setup. This setting defines the amount of system resources (memory) to assign to your MySQL server instance.

  + **Development**: A computer that hosts many other applications, and typically this is your personal workstation. This setting configures MySQL to use the least amount of memory.

  + **Server**: Several other applications are expected to run on this computer, such as a web server. The Server setting configures MySQL to use a medium amount of memory.

  + **Dedicated**: A computer that is dedicated to running the MySQL server. Because no other major applications run on this server, this setting configures MySQL to use the majority of available memory.

  + **Manual**

    Prevents MySQL Installer from attempting to optimize the server installation, and instead, sets the default values to the server variables included in the `my.ini` configuration file. With the `Manual` type selected, MySQL Installer uses the default value of 16M for the `tmp_table_size` variable assignment.

* Connectivity

  Connectivity options control how the connection to MySQL is made. Options include:

  + TCP/IP: This option is selected by default. You may disable TCP/IP Networking to permit local host connections only. With the TCP/IP connection option selected, you can modify the following items:

    - Port for classic MySQL protocol connections. The default value is `3306`.

    - X Protocol Port shown when configuring MySQL 8.0 server only. The default value is `33060`

    - Open Windows Firewall port for network access, which is selected by default for TCP/IP connections.

    If a port number is in use already, you will see the information icon (!) next to the default value and Next is disabled until you provide a new port number.

  + Named Pipe: Enable and define the pipe name, similar to setting the `named_pipe` system variable. The default name is `MySQL`.

    When you select Named Pipe connectivity, and then proceed to the next step, you are prompted to set the level of access control granted to client software on named-pipe connections. Some clients require only minimum access control for communication, while other clients require full access to the named pipe.

    You can set the level of access control based on the Windows user (or users) running the client as follows:

    - **Minimum access to all users (RECOMMENDED).** This level is enabled by default because it is the most secure.

    - **Full access to members of a local group.** If the minimum-access option is too restrictive for the client software, use this option to reduce the number of users who have full access on the named pipe. The group must be established on Windows before you can select it from the list. Membership in this group should be limited and managed. Windows requires a newly added member to first log out and then log in again to join a local group.

    - **Full access to all users (NOT RECOMMENDED).** This option is less secure and should be set only when other safeguards are implemented.

  + Shared Memory: Enable and define the memory name, similar to setting the `shared_memory` system variable. The default name is `MySQL`.

* Advanced Configuration

  Check Show Advanced and Logging Options to set custom logging and advanced options in later steps. The Logging Options step enables you to define custom file paths for the error log, general log, slow query log (including the configuration of seconds it requires to execute a query), and the binary log. The Advanced Options step enables you to set the unique server ID required when binary logging is enabled in a replication topology.

* MySQL Enterprise Firewall (Enterprise Edition only)

  The Enable MySQL Enterprise Firewall check box is deselected by default. Select this option to enable a security list that offers protection against certain types of attacks. Additional post-installation configuration is required (see Section 6.4.6, “MySQL Enterprise Firewall”).

###### 2.3.3.3.1.2 Authentication Method

The Authentication Method step is visible only during the installation or upgrade of MySQL 8.0.4 or higher. It introduces a choice between two server-side authentication options. The MySQL user accounts that you create in the next step will use the authentication method that you select in this step.

MySQL 8.0 connectors and community drivers that use `libmysqlclient` 8.0 now support the `caching_sha2_password` default authentication plugin. However, if you are unable to update your clients and applications to support this new authentication method, you can configure the MySQL server to use `mysql_native_password` for legacy authentication. For more information about the implications of this change, see `caching_sha2_password` as the Preferred Authentication Plugin.

If you are installing or upgrading to MySQL 8.0.4 or higher, select one of the following authentication methods:

* Use Strong Password Encryption for Authentication (RECOMMENDED)

  MySQL 8.0 supports a new authentication based on improved, stronger SHA256-based password methods. It is recommended that all new MySQL server installations use this method going forward.

  Important

  The `caching_sha2_password` authentication plugin on the server requires new versions of connectors and clients, which add support for the new MySQL 8.0 default authentication.

* Use Legacy Authentication Method (Retain MySQL 5.x Compatibility)

  Using the old MySQL 5.x legacy authentication method should be considered only in the following cases:

  + Applications cannot be updated to use MySQL 8.0 connectors and drivers.

  + Recompilation of an existing application is not feasible.

  + An updated, language-specific connector or driver is not available yet.

###### 2.3.3.3.1.3 Accounts and Roles

* Root Account Password

  Assigning a root password is required and you will be asked for it when performing other MySQL Installer operations. Password strength is evaluated when you repeat the password in the box provided. For descriptive information regarding password requirements or status, move your mouse pointer over the information icon (!) when it appears.

* MySQL User Accounts (Optional)

  Click Add User or Edit User to create or modify MySQL user accounts with predefined roles. Next, enter the required account credentials:

  + User Name: MySQL user names can be up to 32 characters long.

  + Host: Select `localhost` for local connections only or `<All Hosts (%)>` when remote connections to the server are required.

  + Role: Each predefined role, such as `DB Admin`, is configured with its own set of privileges. For example, the `DB Admin` role has more privileges than the `DB Designer` role. The Role drop-down list contains a description of each role.

  + Password: Password strength assessment is performed while you type the password. Passwords must be confirmed. MySQL permits a blank or empty password (considered to be insecure).

  **MySQL Installer Commercial Release Only:** MySQL Enterprise Edition for Windows, a commercial product, also supports an authentication method that performs external authentication on Windows. Accounts authenticated by the Windows operating system can access the MySQL server without providing an additional password.

  To create a new MySQL account that uses Windows authentication, enter the user name and then select a value for Host and Role. Click Windows authentication to enable the `authentication_windows` plugin. In the Windows Security Tokens area, enter a token for each Windows user (or group) who can authenticate with the MySQL user name. MySQL accounts can include security tokens for both local Windows users and Windows users that belong to a domain. Multiple security tokens are separated by the semicolon character (`;`) and use the following format for local and domain accounts:

  + Local account

    Enter the simple Windows user name as the security token for each local user or group; for example, **`finley;jeffrey;admin`**.

  + Domain account

    Use standard Windows syntax (*`domain`*`\`*`domainuser`*) or MySQL syntax (*`domain`*`\\`*`domainuser`*) to enter Windows domain users and groups.

    For domain accounts, you may need to use the credentials of an administrator within the domain if the account running MySQL Installer lacks the permissions to query the Active Directory. If this is the case, select Validate Active Directory users with to activate the domain administrator credentials.

  Windows authentication permits you to test all of the security tokens each time you add or modify a token. Click Test Security Tokens to validate (or revalidate) each token. Invalid tokens generate a descriptive error message along with a red `X` icon and red token text. When all tokens resolve as valid (green text without an `X` icon), you can click OK to save the changes.

###### 2.3.3.3.1.4 Windows Service

On the Windows platform, MySQL server can run as a named service managed by the operating system and be configured to start up automatically when Windows starts. Alternatively, you can configure MySQL server to run as an executable program that requires manual configuration.

* Configure MySQL server as a Windows service (Selected by default.)

  When the default configuration option is selected, you can also select the following:

  + Start the MySQL Server at System Startup

    When selected (default), the service startup type is set to Automatic; otherwise, the startup type is set to Manual.

  + Run Windows Service as

    When Standard System Account is selected (default), the service logs on as Network Service.

    The Custom User option must have privileges to log on to Microsoft Windows as a service. The Next button will be disabled until this user is configured with the required privileges.

    A custom user account is configured in Windows by searching for "local security policy" in the Start menu. In the Local Security Policy window, select Local Policies, User Rights Assignment, and then Log On As A Service to open the property dialog. Click Add User or Group to add the custom user and then click OK in each dialog to save the changes.

* Deselect the Windows Service option.

###### 2.3.3.3.1.5 Server File Permissions

Optionally, permissions set on the folders and files located at `C:\ProgramData\MySQL\MySQL Server 8.0\Data` can be managed during the server configuration operation. You have the following options:

* MySQL Installer can configure the folders and files with full control granted exclusively to the user running the Windows service, if applicable, and to the Administrators group.

  All other groups and users are denied access. This is the default option.

* Have MySQL Installer use a configuration option similar to the one just described, but also have MySQL Installer show which users could have full control.

  You are then able to decide if a group or user should be given full control. If not, you can move the qualified members from this list to a second list that restricts all access.

* Have MySQL Installer skip making file-permission changes during the configuration operation.

  If you select this option, you are responsible for securing the `Data` folder and its related files manually after the server configuration finishes.

###### 2.3.3.3.1.6 Logging Options

This step is available if the Show Advanced Configuration check box was selected during the Type and Networking step. To enable this step now, click Back to return to the Type and Networking step and select the check box.

Advanced configuration options are related to the following MySQL log files:

* Error Log * General Log * Slow Query Log * Bin Log

Note

The binary log is enabled by default.

###### 2.3.3.3.1.7 Advanced Options

This step is available if the Show Advanced Configuration check box was selected during the Type and Networking step. To enable this step now, click Back to return to the Type and Networking step and select the check box.

The advanced-configuration options include:

* Server ID

  Set the unique identifier used in a replication topology. If binary logging is enabled, you must specify a server ID. The default ID value depends on the server version. For more information, see the description of the `server_id` system variable.

* Table Names Case

  You can set the following options during the initial and subsequent configuration the server. For the MySQL 8.0 release series, these options apply only to the initial configuration of the server.

  + Lower Case

    Sets the `lower_case_table_names` option value to 1 (default), in which table names are stored in lowercase on disk and comparisons are not case-sensitive.

  + Preserve Given Case

    Sets the `lower_case_table_names` option value to 2, in which table names are stored as given but compared in lowercase.

###### 2.3.3.3.1.8 Apply Server Configuration

All configuration settings are applied to the MySQL server when you click Execute. Use the Configuration Steps tab to follow the progress of each action; the icon for each toggles from white to green (with a check mark) on success. Otherwise, the process stops and displays an error message if an individual action times out. Click the Log tab to view the log.

When the installation completes successfully and you click Finish, MySQL Installer and the installed MySQL products are added to the Microsoft Windows Start menu under the `MySQL` group. Opening MySQL Installer loads the dashboard where installed MySQL products are listed and other MySQL Installer operations are available.

##### 2.3.3.3.2 MySQL Router Configuration with MySQL Installer

During the initial setup, choose any predetermined setup type, except `Server only`, to install the latest GA version of the tools. Use the `Custom` setup type to install an individual tool or specific version. If MySQL Installer is installed on the host already, use the Add operation to select and install tools from the MySQL Installer dashboard.

###### MySQL Router Configuration

MySQL Installer provides a configuration wizard that can bootstrap an installed instance of MySQL Router 8.0 to direct traffic between MySQL applications and an InnoDB Cluster. When configured, MySQL Router runs as a local Windows service.

Note

You are prompted to configure MySQL Router after the initial installation and when you reconfigure an installed router explicitly. In contrast, the upgrade operation does not require or prompt you to configure the upgraded product.

To configure MySQL Router, do the following:

1. Set up InnoDB Cluster. 2. Using MySQL Installer, download and install the MySQL Router application. After the installation finishes, the configuration wizard prompts you for information. Select the Configure MySQL Router for InnoDB Cluster check box to begin the configuration and provide the following configuration values:

   * Hostname: Host name of the primary (seed) server in the InnoDB Cluster (`localhost` by default).

   * Port: The port number of the primary (seed) server in the InnoDB Cluster (`3306` by default).

   * Management User: An administrative user with root-level privileges.

   * Password: The password for the management user.

   * Classic MySQL protocol connections to InnoDB Cluster

     Read/Write: Set the first base port number to one that is unused (between 80 and 65532) and the wizard will select the remaining ports for you.

     The figure that follows shows an example of the MySQL Router configuration page, with the first base port number specified as 6446 and the remaining ports set by the wizard to 6447, 6448, and 6449.

   **Figure 2.10 MySQL Router Configuration**

   ![Content is described in the surrounding text.](images/mi-router-config.png)

2. Click Next and then Execute to apply the configuration. Click Finish to close MySQL Installer or return to the MySQL Installer dashboard.

After configuring MySQL Router, the root account exists in the user table as `root@localhost` (local) only, instead of `root@%` (remote). Regardless of where the router and client are located, even if both are located on the same host as the seed server, any connection that passes through the router is viewed by server as being remote, not local. As a result, a connection made to the server using the local host (see the example that follows), does not authenticate.

```sql
$> \c root@localhost:6446
```

#### 2.3.3.4 MySQL Installer Product Catalog and Dashboard

This section describes the MySQL Installer product catalog, the dashboard, and other actions related to product selection and upgrades.

* Product Catalog
* MySQL Installer Dashboard
* Locating Products to Install
* Upgrading MySQL Server
* Removing MySQL Server
* Upgrading MySQL Installer

##### Product Catalog

The product catalog stores the complete list of released MySQL products for Microsoft Windows that are available to download from [MySQL Downloads](https://dev.mysql.com/downloads/). By default, and when an Internet connection is present, MySQL Installer attempts to update the catalog at startup every seven days. You can also update the catalog manually from the dashboard (described later).

An up-to-date catalog performs the following actions:

* Populates the Available Products pane of the Select Products page. This step appears when you select:

  + The `Custom` setup type during the initial setup.

  + The Add operation from the dashboard.

* Identifies when product updates are available for the installed products listed in the dashboard.

The catalog includes all development releases (Pre-Release), general releases (Current GA), and minor releases (Other Releases). Products in the catalog will vary somewhat, depending on the MySQL Installer release that you download.

##### MySQL Installer Dashboard

The MySQL Installer dashboard is the default view that you see when you start MySQL Installer after the initial setup finishes. If you closed MySQL Installer before the setup was finished, MySQL Installer resumes the initial setup before it displays the dashboard.

Note

Products covered under Oracle Lifetime Sustaining Support, if installed, may appear in the dashboard. These products, such as MySQL for Excel and MySQL Notifier, can be modified or removed only.

**Figure 2.11 MySQL Installer Dashboard Elements**

![Content is described in the surrounding text.](images/mi-dashboard-annotated.png)

###### Description of MySQL Installer Dashboard Elements

1. MySQL Installer dashboard operations provide a variety of actions that apply to installed products or products listed in the catalog. To initiate the following operations, first click the operation link and then select the product or products to manage:

   * Add: This operation opens the Select Products page. From there you can adjust the filter, select one or more products to download (as needed), and begin the installation. For hints about using the filter, see Locating Products to Install.

     Use the directional arrows to move each product from the Available Products column to the Products To Be Installed column. To enable the Product Features page where you can customize features, click the related check box (disabled by default).

   * Modify: Use this operation to add or remove the features associated with installed products. Features that you can modify vary in complexity by product. When the Program Shortcut check box is selected, the product appears in the Start menu under the `MySQL` group.

   * Upgrade: This operation loads the Select Products to Upgrade page and populates it with all the upgrade candidates. An installed product can have more than one upgrade version and the operation requires a current product catalog. MySQL Installer upgrades all of the selected products in one action. Click Show Details to view the actions performed by MySQL Installer.

   * Remove: This operation opens the Remove Products page and populates it with the MySQL products installed on the host. Select the MySQL products you want to remove (uninstall) and then click Execute to begin the removal process. During the operation, an indicator shows the number of steps that are executed as a percentage of all steps.

     To select products to remove, do one of the following:

     + Select the check box for one or more products. + Select the Product check box to select all products.

2. The Reconfigure link in the Quick Action column next to each installed server loads the current configuration values for the server and then cycles through all configuration steps enabling you to change the options and values. You must provide credentials with root privileges to reconfigure these items. Click the Log tab to show the output of each configuration step performed by MySQL Installer.

On completion, MySQL Installer stops the server, applies the configuration changes, and restarts the server for you. For a description of each configuration option, see Section 2.3.3.3.1, “MySQL Server Configuration with MySQL Installer”. Installed `Samples and Examples` associated with a specific MySQL server version can be also be reconfigured to apply new feature settings, if any.

3. The Catalog link enables you to download the latest catalog of MySQL products manually and then to integrate those product changes with MySQL Installer. The catalog-download action does not perform an upgrade of the products already installed on the host. Instead, it returns to the dashboard and adds an arrow icon to the Version column for each installed product that has a newer version. Use the Upgrade operation to install the newer product version.

You can also use the Catalog link to display the current change history of each product without downloading the new catalog. Select the Do not update at this time check box to view the change history only.

4. The MySQL Installer About icon (!) shows the current version of MySQL Installer and general information about MySQL. The version number is located above the Back button.

   Tip

   Always include this version number when reporting a problem with MySQL Installer.

   In addition to the About MySQL information (!), you can also select the following icons from the side panel:

   * License icon (!) for MySQL Installer.

     This product may include third-party software, used under license. If you are using a Commercial release of MySQL Installer, the icon opens the MySQL Installer Commercial License Information User Manual for licensing information, including licensing information relating to third-party software that may be included in this Commercial release. If you are using a Community release of MySQL Installer, the icon opens the MySQL Installer Community License Information User Manual for licensing information, including licensing information relating to third-party software that may be included in this Community release.

   * Resource links icon (!) to the latest MySQL product documentation, blogs, webinars, and more.

5. The MySQL Installer Options icon (!) includes the following tabs:

   * General: Enables or disables the Offline mode option. If selected, this option configures MySQL Installer to run without depending on internet-connection capabilities. When running MySQL Installer in offline mode, you see a warning together with a Disable quick action on the dashboard. The warning serves to remind you that running MySQL Installer in offline mode prevents you from downloading the latest MySQL products and product catalog updates. Offline mode persists until you disable the option.

  At startup, MySQL Installer determines whether an internet connection is present, and, if not, prompts you to enable offline mode to resume working without a connection.

   * Product Catalog: Manages the automatic catalog updates. By default, MySQL Installer checks for catalog updates at startup every seven days. When new products or product versions are available, MySQL Installer adds them to the catalog and then inserts an arrow icon (!) next to the version number of installed products listed in the dashboard.

  Use the product catalog option to enable or disable automatic updates and to reset the number of days between automatic catalog downloads. At startup, MySQL Installer uses the number of days you set to determine whether a download should be attempted. This action is repeated during next startup if MySQL Installer encounters an error downloading the catalog.

   * Connectivity Settings: Several operations performed by MySQL Installer require internet access. This option enables you to use a default value to validate the connection or to use a different URL, one selected from a list or added by you manually. With the Manual option selected, new URLs can be added and all URLs in the list can be moved or deleted. When the Automatic option is selected, MySQL Installer attempts to connect to each default URL in the list (in order) until a connection is made. If no connection can be made, it raises an error.

   * Proxy: MySQL Installer provides multiple proxy modes that enable you to download MySQL products, updates, or even the product catalog in most network environments. The mode are:

     + No proxy

       Select this mode to prevent MySQL Installer from looking for system settings. This mode disables any proxy settings.

     + Automatic

       Select this mode to have MySQL Installer look for system settings and to use those settings if found, or to use no proxy if nothing is found. This mode is the default.

     + Manual

       Select this mode to have MySQL Installer use your authentication details to configuration proxy access to the internet. Specifically:

       - A proxy-server address (`http://`*`address-to-server`*) and port number

       - A user name and password for authentication

##### Locating Products to Install

MySQL products in the catalog are listed by category: MySQL Servers, Applications, MySQL Connectors, and Documentation. Only the latest GA versions appear in the Available Products pane by default. If you are looking for a pre-release or older version of a product, it may not be visible in the default list.

Note

Keep the product catalog up-to-date. Click Catalog on the MySQL Installer dashboard to download the latest manifest.

To change the default product list, click Add in the dashboard to open the Select Products page, and then click Edit to open the dialog box shown in the figure that follows. Modify the settings and then click Filter.

**Figure 2.12 Filter Available Products**

![Filter by Text, Category, Maturity, Already Downloaded, and Architecture.](images/mi-product-filter.png)

Reset one or more of the following fields to modify the list of available products:

* Text: Filter by text. * Category: All Software (default), MySQL Servers, Applications, MySQL Connectors, or Documentation (for samples and documentation).

* Maturity: Current Bundle (appears initially with the full package only), Pre-Release, Current GA, or Other Releases. If you see a warning, confirm that you have the most recent product manifest by clicking Catalog on the MySQL Installer dashboard. If MySQL Installer is unable to download the manifest, the range of products you see is limited to bundled products, standalone product MSIs located in the `Product Cache` folder already, or both.

  Note

  The Commercial release of MySQL Installer does not display any MySQL products when you select the Pre-Release maturity filter. Products in development are available from the Community release of MySQL Installer only.

* Already Downloaded (the check box is deselected by default). Permits you to view and manage downloaded products only.

* Architecture: Any (default), 32-bit, or 64-bit.

##### Upgrading MySQL Server

Important server upgrade conditions:

* MySQL Installer does not permit server upgrades between major release versions or minor release versions, but does permit upgrades within a release series, such as an upgrade from 8.0.36 to 8.0.37.

* Upgrades between milestone releases (or from a milestone release to a GA release) are not supported. Significant development changes take place in milestone releases and you may encounter compatibility issues or problems starting the server.

* For upgrades, a check box enables you to skip the upgrade check and process for system tables, while checking and processing data dictionary tables normally. MySQL Installer does not prompt you with the check box when the previous server upgrade was skipped or when the server was configured as a sandbox InnoDB Cluster. This behavior represents a change in how MySQL Server performs an upgrade (see What the MySQL Upgrade Process Upgrades) and it alters the sequence of steps that MySQL Installer applies to the configuration process.

  If you select Skip system tables upgrade check and process. (Not recommended), MySQL Installer starts the upgraded server with the `--upgrade=MINIMAL` server option, which upgrades the data dictionary only. If you stop and then restart the server without the `--upgrade=MINIMAL` option, the server upgrades the system tables automatically, if needed.

  The following information appears in the Log tab and log file after the upgrade configuration (with system tables skipped) is complete:

  ```sql
  WARNING: The system tables upgrade was skipped after upgrading MySQL Server. The
  server will be started now with the --upgrade=MINIMAL option, but then each
  time the server is started it will attempt to upgrade the system tables, unless
  you modify the Windows service (command line) to add --upgrade=MINIMAL to bypass
  the upgrade.

  FOR THE BEST RESULTS: Run mysqld.exe --upgrade=FORCE on the command line to upgrade
  the system tables manually.
  ```

To choose a new server version:

1. Click Upgrade. Confirm that the check box next to product name in the Upgradeable Products pane has a check mark. Deselect the products that you do not intend to upgrade at this time.

   Note

   For server milestone releases in the same release series, MySQL Installer deselects the server upgrade and displays a warning to indicate that the upgrade is not supported, identifies the risks of continuing, and provides a summary of the steps to perform a logical upgrade manually. You can reselect server upgrade at your own risk. For instructions on how to perform a logical upgrade with a milestone release, see Logical Upgrade.

2. Click a product in the list to highlight it. This action populates the Upgradeable Versions pane with the details of each available version for the selected product: version number, published date, and a `Changes` link to open the release notes for that version.

##### Removing MySQL Server

To remove a local MySQL server:

1. Determine whether the local data directory should be removed. If you retain the data directory, another server installation can reuse the data. This option is enabled by default (removes the data directory).

2. Click Execute to begin uninstalling the local server. Note that all products that you selected to remove are also uninstalled at this time.

3. (Optional) Click the Log tab to display the current actions performed by MySQL Installer.

##### Upgrading MySQL Installer

MySQL Installer remains installed on your computer, and like other software, MySQL Installer can be upgraded from the previous version. In some cases, other MySQL software may require that you upgrade MySQL Installer for compatibility. This section describes how to identify the current version of MySQL Installer and how to upgrade MySQL Installer manually.

**To locate the installed version of MySQL Installer:**

1. Start MySQL Installer from the search menu. The MySQL Installer dashboard opens. 2. Click the MySQL Installer About icon (!). The version number is located above the Back button.

**To initiate an on-demand upgrade of MySQL Installer:**

1. Connect the computer with MySQL Installer installed to the internet. 2. Start MySQL Installer from the search menu. The MySQL Installer dashboard opens. 3. Click Catalog on the bottom of the dashboard to open the Update Catalog window.

4. Click Execute to begin the process. If the installed version of MySQL Installer can be upgraded, you will be prompted to start the upgrade.

5. Click Next to review all changes to the catalog and then click Finish to return to the dashboard.

6. Verify the (new) installed version of MySQL Installer (see the previous procedure).

#### 2.3.3.5 MySQL Installer Console Reference

**MySQLInstallerConsole.exe** provides command-line functionality that is similar to MySQL Installer. This reference includes:

* MySQL Product Names
* Command Syntax
* Command Actions

The console is installed when MySQL Installer is initially executed and then available within the `MySQL Installer for Windows` directory. By default, the directory location is `C:\Program Files (x86)\MySQL\MySQL Installer for Windows`. You must run the console as administrator.

To use the console:

1. Open a command prompt with administrative privileges by selecting Windows System from Start, then right-click Command Prompt, select More, and select Run as administrator.

2. From the command line, optionally change the directory to where the **MySQLInstallerConsole.exe** command is located. For example, to use the default installation location:

  ```prompt
  cd Program Files (x86)\MySQL\MySQL Installer for Windows
  ```

3. Type `MySQLInstallerConsole.exe` (or `mysqlinstallerconsole`) followed by a command action to perform a task. For example, to show the console's help:

   ```prompt
   MySQLInstallerConsole.exe --help
   ```

   ```sql
   =================== Start Initialization ===================
   MySQL Installer is running in Community mode

   Attempting to update manifest.
   Initializing product requirements.
   Loading product catalog.
   Checking for product packages in the bundle.
   Categorizing product catalog.
   Finding all installed packages.
   Your product catalog was last updated at 23/08/2022 12:41:05 p. m.
   Your product catalog has version number 671.
   =================== End Initialization ===================

   The following actions are available:

   Configure - Configures one or more of your installed programs.
   Help      - Provides list of available command actions.
   Install   - Installs and configures one or more available MySQL programs.
   List      - Lists all available MySQL products.
   Modify    - Modifies the features of installed products.
   Remove    - Removes one or more products from your system.
   Set       - Configures the general options of MySQL Installer.
   Status    - Shows the status of all installed products.
   Update    - Updates the current product catalog.
   Upgrade   - Upgrades one or more of your installed programs.

   The basic syntax for using MySQL Installer command actions. Brackets denote optional entities.
   Curly braces denote a list of possible entities.

   ...
   ```

##### MySQL Product Names

Many of the **MySQLInstallerConsole** command actions accept one or more abbreviated phrases that can match a MySQL product (or products) in the catalog. The current set of valid short phrases for use with commands is shown in the following table.

Note

Starting with MySQL Installer 1.6.7 (8.0.34), the `install`, `list`, and `upgrade` command options no longer apply to MySQL for Visual Studio (now EOL), MySQL Connector/NET, MySQL Connector/ODBC, MySQL Connector/C++, MySQL Connector/Python, and MySQL Connector/J. To install newer MySQL connectors, visit https://dev.mysql.com/downloads/.

**Table 2.6 MySQL Product Phrases for use with the MySQLInstallerConsole.exe command**

<table>
  <col style="width: 50%"/>
  <col style="width: 50%"/>
  <thead>
    <tr>
      <th>Phrase</th>
      <th>MySQL Product</th>
    </tr>
  </thead>
  <tr>
    <td><code>server</code></td>
    <td>MySQL Server</td>
  </tr>
  <tr>
    <td><code>workbench</code></td>
    <td>MySQL Workbench</td>
  </tr>
  <tr>
    <td><code>shell</code></td>
    <td>MySQL Shell</td>
  </tr>
  <tr>
    <td><code>visual</code></td>
    <td>MySQL for Visual Studio</td>
  </tr>
  <tr>
    <td><code>router</code></td>
    <td>MySQL Router</td>
  </tr>
  <tr>
    <td><code>backup</code></td>
    <td>MySQL Enterprise Backup (requires the commercial release)</td>
  </tr>
  <tr>
    <td><code>net</code></td>
    <td>MySQL Connector/NET</td>
  </tr>
  <tr>
    <td><code>odbc</code></td>
    <td>MySQL Connector/ODBC</td>
  </tr>
  <tr>
    <td><code>c++</code></td>
    <td>MySQL Connector/C++</td>
  </tr>
  <tr>
    <td><code>python</code></td>
    <td>MySQL Connector/Python</td>
  </tr>
  <tr>
    <td><code>j</code></td>
    <td>MySQL Connector/J</td>
  </tr>
  <tr>
    <td><code>documentation</code></td>
    <td>MySQL Server Documentation</td>
  </tr>
  <tr>
    <td><code>samples</code></td>
    <td>MySQL Samples (sakila and world databases)</td>
  </tr>
</table>

##### Command Syntax

The **MySQLInstallerConsole.exe** command can be issued with or without the file extension (`.exe`) and the command is not case-sensitive.

`mysqlinstallerconsole`[`.exe`] [[[`--`]*`action`*] [*`action_blocks_list`*] [*`options_list`*]]

Description:

* `action`: One of the permitted operational actions. If omitted, the default action is equivalent to the `--status` action. Using the `--` prefix is optional for all actions.

Possible actions are: [--]`configure`, [--]`help`, [--]`install`, [--]`list`, [--]`modify`, [--]`remove`, [--]`set`, [--]`status`, [--]`update`, and [--]`upgrade`.

* `action_blocks_list`: A list of blocks in which each represents a different item depending on the selected action. Blocks are separated by commas.

The `--remove` and `--upgrade` actions permit specifying an asterisk character (`*`) to indicate all products. If the `*` character is detected at the start of this block, it is assumed all products are to be processed and the remainder of the block is ignored.

Syntax: `*|action_block[,action_block][,action_block]...`

*`action_block`*: Contains a product selector followed by an indefinite number of argument blocks that behave differently depending on the selected action (see Command Actions).

* `options_list`: Zero or more options with possible values separated by spaces. See Command Actions to identify the options permitted for the corresponding action.

Syntax: `option_value_pair[ option_value_pair][ option_value_pair]...`

*`option_value_pair`*: A single option (for example, `--silent`) or a tuple of a key and a corresponding value with an options prefix. The key-value pair is in the form of `--key[=value]`.

##### Command Actions

**MySQLInstallerConsole.exe** supports the following command actions:

Note

Configuration block (or arguments\_block) values that contain a colon character (`:`) must be wrapped in quotation marks. For example, `install_dir="C:\MySQL\MySQL Server 8.0"`.

* `[--]configure [product1]:[configuration_argument]=[value], [product2]:[configuration_argument]=[value], [...]`

  Configures one or more MySQL products on your system. Multiple *`configuration_argument`*=*`value`* pairs can be configured for each product.

  Options:

  `--continue`: Continues processing the next product when an error is caught while processing the action blocks containing arguments for each product. If not specified the whole operation is aborted in case of an error.

  `--help`: Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  `--show-settings`: Displays the available options for the selected product by passing in the product name after `--show-settings`.

  `--silent` :   Disables confirmation prompts.

  Examples:

  ```sql MySQLInstallerConsole --configure --show-settings server ```

  ```sql mysqlinstallerconsole.exe --configure server:port=3307 ```

* `[--]help`

  Displays a help message with usage examples and then exits. Pass in an additional command action to receive help specific to that action.

  Options:

  `--action=[action]`: Shows the help for a specific action. Same as using the `--help` option with an action.

  Permitted values are: `all`, `configure`, `help` (default), `install`, `list`, `modify`, `remove`, `status`, `update`, `upgrade`, and `set`.

  `--help`: Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  Examples:

  ```sql
  MySQLInstallerConsole help
  ```

  ```sql
  MySQLInstallerConsole help --action=install
  ```

* `[--]install [product1]:[features]:[config block]:[config block], [product2]:[config block], [...]`

  Installs one or more MySQL products on your system. If pre-release products are available, both GA and pre-release products are installed when the value of the `--type` option value is `Client` or `Full`. Use the `--only_ga_products` option to restrict the product set to GA products only when using these setup types.

  Description:

  `[product]`: Each product can be specified by a product phrase with or without a semicolon-separated version qualifier. Passing in a product keyword alone selects the latest version of the product. If multiple architectures are available for that version of the product, the command returns the first one in the manifest list for interactive confirmation. Alternatively, you can pass in the exact version and architecture `(x86` or `x64`) after the product keyword using the `--silent` option.

  `[features]`: All features associated with a MySQL product are installed by default. The feature block is a semicolon-separated list of features or an asterisk character (`*`) that selects all features. To remove a feature, use the `modify` command.

  `[config block]`: One or more configuration blocks can be specified. Each configuration block is a semicolon-separated list of key-value pairs. A block can include either a `config` or `user` type key; `config` is the default type if one is not defined.

    Configuration block values that contain a colon character (`:`) must be wrapped in quotation marks. For example, `installdir="C:\MySQL\MySQL Server 8.0"`. Only one configuration type block can be defined for each product. A user block should be defined for each user to be created during the product installation.

    Note

    The `user` type key is not supported when a product is being reconfigured.

  Options:

  `--auto-handle-prereqs`: If present, MySQL Installer attempts to download and install some software prerequisites, not currently present. that can be resolved with minimal intervention. If the `--silent` option is not present, you are presented with installation pages for each prerequisite. If the `--auto-handle-prereqs` options is omitted, packages with missing prerequisites are not installed.

  `--continue`: Continues processing the next product when an error is caught while processing the action blocks containing arguments for each product. If not specified the whole operation is aborted in case of an error.

  `--help`: Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  `--mos-password=password`: Sets the My Oracle Support (MOS) user's password for commercial versions of the MySQL Installer.

  `--mos-user=user_name`: Specifies the My Oracle Support (MOS) user name for access to the commercial version of MySQL Installer. If not present, only the products in the bundle, if any, are available to be installed.

  `--only-ga-products`: Restricts the product set to include GA products only.

  `--setup-type=setup_type`: Installs a predefined set of software. The setup type can be one of the following:

    + `Server`: Installs a single MySQL server

    + `Client`: Installs client programs and libraries (excludes MySQL connectors)

    + `Full`: Installs everything (excludes MySQL connectors)

    + `Custom`: Installs user-selected products. This is the default option.

    Note

    Non-custom setup types are valid only when no other MySQL products are installed.

  `--show-settings`: Displays the available options for the selected product, by passing in the product name after `-showsettings`.

  `--silent`: Disable confirmation prompts.

  Examples:

  ```sql
  mysqlinstallerconsole.exe --install j;8.0.29, net;8.0.28 --silent
  ```

  ```sql
  MySQLInstallerConsole install server;8.0.30:*:port=3307;server_id=2:type=user;user=foo
  ```

  An example that passes in additional configuration blocks, separated by `^` to fit:

  ```sql
  MySQLInstallerConsole --install server;8.0.30;x64:*:type=config;open_win_firewall=true; ^
     general_log=true;bin_log=true;server_id=3306;tcp_ip=true;port=3306;root_passwd=pass; ^
     install_dir="C:\MySQL\MySQL Server 8.0":type=user;user_name=foo;password=bar;role=DBManager
  ```

* `[--]list`

  When this action is used without options, it activates an interactive list from which all of the available MySQL products can be searched. Enter `MySQLInstallerConsole --list` and specify a substring to search.

  Options:

  `--all`: Lists all available products. If this option is used, all other options are ignored.

  `--arch=architecture`: Lists that contain the specified architecture. Permitted values are: `x86`, `x64`, and `any` (default). This option can be combined with the `--name` and `--version` options.

  `--help` :   Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  `--name=package_name`: Lists products that contain the specified name (see product phrase), This option can be combined with the `--version` and `--arch` options.

  `--version=version`: Lists products that contain the specified version, such as 8.0 or 5.7. This option can be combined with the `--name` and `--arch` options.

  Examples:

  ```sql
  MySQLInstallerConsole --list --name=net --version=8.0
  ```

* `[--]modify [product1:-removelist|+addlist], [product2:-removelist|+addlist] [...]`

  Modifies or displays features of a previously installed MySQL product. To display the features of a product, append the product keyword to the command, for example:

  ```sql
  MySQLInstallerConsole --modify server
  ```

  Options:

  `--help`: Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  `--silent`: Disable confirmation prompts.

  Examples:

  ```sql
  MySQLInstallerConsole --modify server:+documentation
  ```

  ```sql
  MySQLInstallerConsole modify server:-debug
  ```

* `[--]remove [product1], [product2] [...]`

  Removes one ore more products from your system. An asterisk character (`*`) can be passed in to remove all MySQL products with one command.

  Options:

  `--continue`: Continue the operation even if an error occurs.

  `--help`: Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  `--keep-datadir`: Skips the removal of the data directory when removing MySQL Server products.

  `--silent`: Disable confirmation prompts.

  Examples:

  ```sql
  mysqlinstallerconsole.exe remove *
  ```

  ```sql
  MySQLInstallerConsole --remove server --continue
  ```

* `[--]set`

  Sets one or more configurable options that affect how the MySQL Installer program connects to the internet and whether the automatic products-catalog updates feature is activated.

  Options:

  `--catalog-update=bool_value`: Enables (`true`, default) or disables (`false`) the automatic products catalog update. This option requires an active connection to the internet.

  `--catalog-update-days=int_value`: Accepts an integer between 1 (default) and 365 to indicate the number of days between checks for a new catalog update when MySQL Installer is started. If `--catalog-update` is `false`, this option is ignored.

  `--connection-validation=validation_type`: Sets how MySQL Installer performs the check for an internet connection. Permitted values are `automatic` (default) and `manual`.

  `--connection-validation-urls=url_list`: A double-quote enclosed and comma-separated string that defines the list of URLs to use for checking the internet connection when `--connection-validation` is set to `manual`. Checks are made in the same order provided. If the first URL fails, the next URL in the list is used and so on.

  `--offline-mode=bool_value`: Enables MySQL Installer to run with or without internet capabilities. Valid modes are:

      + `True` to enable offline mode (run without an internet connection).

      + `False` (default) to disable offline mode (run with an internet connection). Set this mode before downloading the product catalog or any products to install.

  `--proxy-mode`: Specifies the proxy mode. Valid modes are:

      + `Automatic` to automatically identify the proxy based on the system settings.

      + `None` to ensure that no proxy is configured.

      + `Manual` to set the proxy details manually (`--proxy-server`, `--proxy-port`, `--proxy-username`, `--proxy-password`).

  `--proxy-password`: The password used to authenticate to the proxy server.

  `--proxy-port`: The port used for the proxy server.

  `--proxy-server`: The URL that point to the proxy server.

  `--proxy-username`: The user name used to authenticate to the proxy server.

  `--reset-defaults`: Resets the MySQL Installer options associated with the `--set` action to the default values.

  Examples:

  ```sql
  MySQLIntallerConsole.exe set --reset-defaults
  ```

  ```sql
  mysqlintallerconsole.exe --set --catalog-update=false
  ```

  ```sql
  MySQLIntallerConsole --set --catalog-update-days=3
  ```

  ```sql
  mysqlintallerconsole --set --connection-validation=manual
  --connection-validation-urls="https://www.bing.com,http://www.google.com"
  ```

* `[--]status`

  Provides a quick overview of the MySQL products that are installed on the system. Information includes product name and version, architecture, date installed, and install location.

  Options:

  `--help`: Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  Examples:

  ```sql
  MySQLInstallerConsole status
  ```

* `[--]update`

  Downloads the latest MySQL product catalog to your system. On success, the catalog is applied the next time either `MySQLInstaller` or **MySQLInstallerConsole.exe** is executed.

  MySQL Installer automatically checks for product catalog updates when it is started if *`n`* days have passed since the last check. Starting with MySQL Installer 1.6.4, the default value is 1 day. Previously, the default value was 7 days.

  Options:

  `--help`: Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  Examples:

  ```sql
  MySQLInstallerConsole update
  ```

* `[--]upgrade [product1:version], [product2:version] [...]`

  Upgrades one or more products on your system. The following characters are permitted for this action:

  `*`: Pass in `*` to upgrade all products to the latest version, or pass in specific products.

  `!`: Pass in `!` as a version number to upgrade the MySQL product to its latest version.

  Options:

  `--continue`: Continue the operation even if an error occurs.

  `--help`: Shows the options and available arguments for the corresponding action. If present the action is not executed, only the help is shown, so other action-related options are ignored as well.

  `--mos-password=password`: Sets the My Oracle Support (MOS) user's password for commercial versions of the MySQL Installer.

  `--mos-user=user_name`: Specifies the My Oracle Support (MOS) user name for access to the commercial version of MySQL Installer. If not present, only the products in the bundle, if any, are available to be installed.

  `--silent`: Disable confirmation prompts.

  Examples:

  ```sql
  MySQLInstallerConsole upgrade *
  ```

  ```sql
  MySQLInstallerConsole upgrade workbench:8.0.31
  ```

  ```sql
  MySQLInstallerConsole upgrade workbench:!
  ```

  ```sql
  MySQLInstallerConsole --upgrade server;8.0.30:!, j;8.0.29:!
  ```

### 2.3.4 Installing MySQL on Microsoft Windows Using a `noinstall` ZIP Archive

Users who are installing from the `noinstall` package can use the instructions in this section to manually install MySQL. The process for installing MySQL from a ZIP Archive package is as follows:

1. Extract the main archive to the desired install directory

   *Optional*: also extract the debug-test archive if you plan to execute the MySQL benchmark and test suite

2. Create an option file
3. Choose a MySQL server type
4. Initialize MySQL
5. Start the MySQL server
6. Secure the default user accounts

This process is described in the sections that follow.

#### 2.3.4.1 Extracting the Install Archive

To install MySQL manually, do the following:

1. If you are upgrading from a previous version please refer to Section 2.10.8, “Upgrading MySQL on Windows”, before beginning the upgrade process.

2. Make sure that you are logged in as a user with administrator privileges.

3. Choose an installation location. Traditionally, the MySQL server is installed in `C:\mysql`. If you do not install MySQL at `C:\mysql`, you must specify the path to the install directory during startup or in an option file. See Section 2.3.4.2, “Creating an Option File”.

   Note

   The MySQL Installer installs MySQL under `C:\Program Files\MySQL`.

4. Extract the install archive to the chosen installation location using your preferred file-compression tool. Some tools may extract the archive to a folder within your chosen installation location. If this occurs, you can move the contents of the subfolder into the chosen installation location.

#### 2.3.4.2 Creating an Option File

If you need to specify startup options when you run the server, you can indicate them on the command line or place them in an option file. For options that are used every time the server starts, you may find it most convenient to use an option file to specify your MySQL configuration. This is particularly true under the following circumstances:

* The installation or data directory locations are different from the default locations (`C:\Program Files\MySQL\MySQL Server 5.7` and `C:\Program Files\MySQL\MySQL Server 5.7\data`).

* You need to tune the server settings, such as memory, cache, or InnoDB configuration information.

When the MySQL server starts on Windows, it looks for option files in several locations, such as the Windows directory, `C:\`, and the MySQL installation directory (for the full list of locations, see Section 4.2.2.2, “Using Option Files”). The Windows directory typically is named something like `C:\WINDOWS`. You can determine its exact location from the value of the `WINDIR` environment variable using the following command:

```sql
C:\> echo %WINDIR%
```

MySQL looks for options in each location first in the `my.ini` file, and then in the `my.cnf` file. However, to avoid confusion, it is best if you use only one file. If your PC uses a boot loader where `C:` is not the boot drive, your only option is to use the `my.ini` file. Whichever option file you use, it must be a plain text file.

Note

When using the MySQL Installer to install MySQL Server, it creates the `my.ini` in the default location, and the user executing MySQL Installer is granted full permissions to this new `my.ini` file.

In other words, be sure that the MySQL Server user has permission to read the `my.ini` file.

You can also make use of the example option files included with your MySQL distribution; see Section 5.1.2, “Server Configuration Defaults”.

An option file can be created and modified with any text editor, such as Notepad. For example, if MySQL is installed in `E:\mysql` and the data directory is in `E:\mydata\data`, you can create an option file containing a `[mysqld]` section to specify values for the `basedir` and `datadir` options:

```sql
[mysqld]
# set basedir to your installation path
basedir=E:/mysql
# set datadir to the location of your data directory
datadir=E:/mydata/data
```

Microsoft Windows path names are specified in option files using (forward) slashes rather than backslashes. If you do use backslashes, double them:

```sql
[mysqld]
# set basedir to your installation path
basedir=E:\\mysql
# set datadir to the location of your data directory
datadir=E:\\mydata\\data
```

The rules for use of backslash in option file values are given in Section 4.2.2.2, “Using Option Files”.

As of MySQL 5.7.6, the ZIP archive no longer includes a `data` directory. To initialize a MySQL installation by creating the data directory and populating the tables in the mysql system database, initialize MySQL using either `--initialize` or `--initialize-insecure`. For additional information, see Section 2.9.1, “Initializing the Data Directory”.

If you would like to use a data directory in a different location, you should copy the entire contents of the `data` directory to the new location. For example, if you want to use `E:\mydata` as the data directory instead, you must do two things:

1. Move the entire `data` directory and all of its contents from the default location (for example `C:\Program Files\MySQL\MySQL Server 5.7\data`) to `E:\mydata`.

2. Use a `--datadir` option to specify the new data directory location each time you start the server.

#### 2.3.4.3 Selecting a MySQL Server Type

The following table shows the available servers for Windows in MySQL 5.7.

<table>
  <thead>
    <tr>
      <th>Binary</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>mysqld</code></td>
      <td>Optimized binary with named-pipe support</td>
    </tr>
    <tr>
      <td><code>mysqld-debug</code></td>
      <td>Like <code>mysqld</code>, but compiled with full debugging and automatic memory allocation checking
      </td>
    </tr>
  </tbody>
</table>

All of the preceding binaries are optimized for modern Intel processors, but should work on any Intel i386-class or higher processor.

Each of the servers in a distribution support the same set of storage engines. The `SHOW ENGINES` statement displays which engines a given server supports.

All Windows MySQL 5.7 servers have support for symbolic linking of database directories.

MySQL supports TCP/IP on all Windows platforms. MySQL servers on Windows also support named pipes, if you start the server with the `named_pipe` system variable enabled. It is necessary to enable this variable explicitly because some users have experienced problems with shutting down the MySQL server when named pipes were used. The default is to use TCP/IP regardless of platform because named pipes are slower than TCP/IP in many Windows configurations.

#### 2.3.4.4 Initializing the Data Directory

If you installed MySQL using the `noinstall` package, you may need to initialize the data directory:

* Windows distributions prior to MySQL 5.7.7 include a data directory with a set of preinitialized accounts in the `mysql` database.

* As of 5.7.7, Windows installation operations performed using the `noinstall` package do not include a data directory. To initialize the data directory, use the instructions at Section 2.9.1, “Initializing the Data Directory”.

#### 2.3.4.5 Starting the Server for the First Time

This section gives a general overview of starting the MySQL server. The following sections provide more specific information for starting the MySQL server from the command line or as a Windows service.

The information here applies primarily if you installed MySQL using the `noinstall` version, or if you wish to configure and test MySQL manually rather than with the GUI tools.

The examples in these sections assume that MySQL is installed under the default location of `C:\Program Files\MySQL\MySQL Server 5.7`. Adjust the path names shown in the examples if you have MySQL installed in a different location.

Clients have two options. They can use TCP/IP, or they can use a named pipe if the server supports named-pipe connections.

MySQL for Windows also supports shared-memory connections if the server is started with the `shared_memory` system variable enabled. Clients can connect through shared memory by using the `--protocol=MEMORY` option.

For information about which server binary to run, see Section 2.3.4.3, “Selecting a MySQL Server Type”.

Testing is best done from a command prompt in a console window (or “DOS window”). In this way you can have the server display status messages in the window where they are easy to see. If something is wrong with your configuration, these messages make it easier for you to identify and fix any problems.

Note

The database must be initialized before MySQL can be started. For additional information about the initialization process, see Section 2.9.1, “Initializing the Data Directory”.

To start the server, enter this command:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld" --console
```

For a server that includes `InnoDB` support, you should see the messages similar to those following as it starts (the path names and sizes may differ):

```sql
InnoDB: The first specified datafile c:\ibdata\ibdata1 did not exist:
InnoDB: a new database to be created!
InnoDB: Setting file c:\ibdata\ibdata1 size to 209715200
InnoDB: Database physically writes the file full: wait...
InnoDB: Log file c:\iblogs\ib_logfile0 did not exist: new to be created
InnoDB: Setting log file c:\iblogs\ib_logfile0 size to 31457280
InnoDB: Log file c:\iblogs\ib_logfile1 did not exist: new to be created
InnoDB: Setting log file c:\iblogs\ib_logfile1 size to 31457280
InnoDB: Log file c:\iblogs\ib_logfile2 did not exist: new to be created
InnoDB: Setting log file c:\iblogs\ib_logfile2 size to 31457280
InnoDB: Doublewrite buffer not found: creating new
InnoDB: Doublewrite buffer created
InnoDB: creating foreign key constraint system tables
InnoDB: foreign key constraint system tables created
011024 10:58:25  InnoDB: Started
```

When the server finishes its startup sequence, you should see something like this, which indicates that the server is ready to service client connections:

```sql
mysqld: ready for connections
Version: '5.7.44'  socket: ''  port: 3306
```

The server continues to write to the console any further diagnostic output it produces. You can open a new console window in which to run client programs.

If you omit the `--console` option, the server writes diagnostic output to the error log in the data directory (`C:\Program Files\MySQL\MySQL Server 5.7\data` by default). The error log is the file with the `.err` extension, and may be set using the `--log-error` option.

Note

The initial `root` account in the MySQL grant tables has no password. After starting the server, you should set up a password for it using the instructions in Section 2.9.4, “Securing the Initial MySQL Account”.

#### 2.3.4.6 Starting MySQL from the Windows Command Line

The MySQL server can be started manually from the command line. This can be done on any version of Windows.

To start the `mysqld` server from the command line, you should start a console window (or “DOS window”) and enter this command:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld"
```

The path to `mysqld` may vary depending on the install location of MySQL on your system.

You can stop the MySQL server by executing this command:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqladmin" -u root shutdown
```

Note

If the MySQL `root` user account has a password, you need to invoke **mysqladmin** with the `-p` option and supply the password when prompted.

This command invokes the MySQL administrative utility **mysqladmin** to connect to the server and tell it to shut down. The command connects as the MySQL `root` user, which is the default administrative account in the MySQL grant system.

Note

Users in the MySQL grant system are wholly independent from any operating system users under Microsoft Windows.

If `mysqld` does not start, check the error log to see whether the server wrote any messages there to indicate the cause of the problem. By default, the error log is located in the `C:\Program Files\MySQL\MySQL Server 5.7\data` directory. It is the file with a suffix of `.err`, or may be specified by passing in the `--log-error` option. Alternatively, you can try to start the server with the `--console` option; in this case, the server may display some useful information on the screen to help solve the problem.

The last option is to start `mysqld` with the `--standalone` and `--debug` options. In this case, `mysqld` writes a log file `C:\mysqld.trace` that should contain the reason why `mysqld` doesn't start. See Section 5.8.3, “The DBUG Package”.

Use **mysqld --verbose --help** to display all the options that `mysqld` supports.

#### 2.3.4.7 Customizing the PATH for MySQL Tools

Warning

You must exercise great care when editing your system `PATH` by hand; accidental deletion or modification of any portion of the existing `PATH` value can leave you with a malfunctioning or even unusable system.

To make it easier to invoke MySQL programs, you can add the path name of the MySQL `bin` directory to your Windows system `PATH` environment variable:

* On the Windows desktop, right-click the My Computer icon, and select Properties.

* Next select the Advanced tab from the System Properties menu that appears, and click the Environment Variables button.

* Under System Variables, select Path, and then click the Edit button. The Edit System Variable dialogue should appear.

* Place your cursor at the end of the text appearing in the space marked Variable Value. (Use the **End** key to ensure that your cursor is positioned at the very end of the text in this space.) Then enter the complete path name of your MySQL `bin` directory (for example, `C:\Program Files\MySQL\MySQL Server 5.7\bin`)

  Note

  There must be a semicolon separating this path from any values present in this field.

  Dismiss this dialogue, and each dialogue in turn, by clicking OK until all of the dialogues that were opened have been dismissed. The new `PATH` value should now be available to any new command shell you open, allowing you to invoke any MySQL executable program by typing its name at the DOS prompt from any directory on the system, without having to supply the path. This includes the servers, the **mysql** client, and all MySQL command-line utilities such as **mysqladmin** and **mysqldump**.

You should not add the MySQL `bin` directory to your Windows `PATH` if you are running multiple MySQL servers on the same machine.

#### 2.3.4.8 Starting MySQL as a Windows Service

On Windows, the recommended way to run MySQL is to install it as a Windows service, so that MySQL starts and stops automatically when Windows starts and stops. A MySQL server installed as a service can also be controlled from the command line using **NET** commands, or with the graphical **Services** utility. Generally, to install MySQL as a Windows service you should be logged in using an account that has administrator rights.

The **Services** utility (the Windows **Service Control Manager**) can be found in the Windows Control Panel. To avoid conflicts, it is advisable to close the **Services** utility while performing server installation or removal operations from the command line.

##### Installing the service

Before installing MySQL as a Windows service, you should first stop the current server if it is running by using the following command:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqladmin"
          -u root shutdown
```

Note

If the MySQL `root` user account has a password, you need to invoke **mysqladmin** with the `-p` option and supply the password when prompted.

This command invokes the MySQL administrative utility **mysqladmin** to connect to the server and tell it to shut down. The command connects as the MySQL `root` user, which is the default administrative account in the MySQL grant system.

Note

Users in the MySQL grant system are wholly independent from any operating system users under Windows.

Install the server as a service using this command:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld" --install
```

The service-installation command does not start the server. Instructions for that are given later in this section.

To make it easier to invoke MySQL programs, you can add the path name of the MySQL `bin` directory to your Windows system `PATH` environment variable:

* On the Windows desktop, right-click the My Computer icon, and select Properties.

* Next select the Advanced tab from the System Properties menu that appears, and click the Environment Variables button.

* Under System Variables, select Path, and then click the Edit button. The Edit System Variable dialogue should appear.

* Place your cursor at the end of the text appearing in the space marked Variable Value. (Use the **End** key to ensure that your cursor is positioned at the very end of the text in this space.) Then enter the complete path name of your MySQL `bin` directory (for example, `C:\Program Files\MySQL\MySQL Server 5.7\bin`), and there should be a semicolon separating this path from any values present in this field. Dismiss this dialogue, and each dialogue in turn, by clicking OK until all of the dialogues that were opened have been dismissed. You should now be able to invoke any MySQL executable program by typing its name at the DOS prompt from any directory on the system, without having to supply the path. This includes the servers, the **mysql** client, and all MySQL command-line utilities such as **mysqladmin** and **mysqldump**.

  You should not add the MySQL `bin` directory to your Windows `PATH` if you are running multiple MySQL servers on the same machine.

Warning

You must exercise great care when editing your system `PATH` by hand; accidental deletion or modification of any portion of the existing `PATH` value can leave you with a malfunctioning or even unusable system.

The following additional arguments can be used when installing the service:

* You can specify a service name immediately following the `--install` option. The default service name is `MySQL`.

* If a service name is given, it can be followed by a single option. By convention, this should be `--defaults-file=file_name` to specify the name of an option file from which the server should read options when it starts.

  The use of a single option other than `--defaults-file` is possible but discouraged. `--defaults-file` is more flexible because it enables you to specify multiple startup options for the server by placing them in the named option file.

* You can also specify a `--local-service` option following the service name. This causes the server to run using the `LocalService` Windows account that has limited system privileges. If both `--defaults-file` and `--local-service` are given following the service name, they can be in any order.

For a MySQL server that is installed as a Windows service, the following rules determine the service name and option files that the server uses:

* If the service-installation command specifies no service name or the default service name (`MySQL`) following the `--install` option, the server uses the service name of `MySQL` and reads options from the `[mysqld]` group in the standard option files.

* If the service-installation command specifies a service name other than `MySQL` following the `--install` option, the server uses that service name. It reads options from the `[mysqld]` group and the group that has the same name as the service in the standard option files. This enables you to use the `[mysqld]` group for options that should be used by all MySQL services, and an option group with the service name for use by the server installed with that service name.

* If the service-installation command specifies a `--defaults-file` option after the service name, the server reads options the same way as described in the previous item, except that it reads options only from the named file and ignores the standard option files.

As a more complex example, consider the following command:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld"
          --install MySQL --defaults-file=C:\my-opts.cnf
```

Here, the default service name (`MySQL`) is given after the `--install` option. If no `--defaults-file` option had been given, this command would have the effect of causing the server to read the `[mysqld]` group from the standard option files. However, because the `--defaults-file` option is present, the server reads options from the `[mysqld]` option group, and only from the named file.

Note

On Windows, if the server is started with the `--defaults-file` and `--install` options, `--install` must be first. Otherwise, `mysqld.exe` attempts to start the MySQL server.

You can also specify options as Start parameters in the Windows **Services** utility before you start the MySQL service.

Finally, before trying to start the MySQL service, make sure the user variables `%TEMP%` and `%TMP%` (and also `%TMPDIR%`, if it has ever been set) for the operating system user who is to run the service are pointing to a folder to which the user has write access. The default user for running the MySQL service is `LocalSystem`, and the default value for its `%TEMP%` and `%TMP%` is `C:\Windows\Temp`, a directory `LocalSystem` has write access to by default. However, if there are any changes to that default setup (for example, changes to the user who runs the service or to the mentioned user variables, or the `--tmpdir` option has been used to put the temporary directory somewhere else), the MySQL service might fail to run because write access to the temporary directory has not been granted to the proper user.

##### Starting the service

After a MySQL server instance has been installed as a service, Windows starts the service automatically whenever Windows starts. The service also can be started immediately from the **Services** utility, or by using an **sc start *`mysqld_service_name`*** or **NET START *`mysqld_service_name`*** command. **SC** and **NET** commands are not case-sensitive.

When run as a service, `mysqld` has no access to a console window, so no messages can be seen there. If `mysqld` does not start, check the error log to see whether the server wrote any messages there to indicate the cause of the problem. The error log is located in the MySQL data directory (for example, `C:\Program Files\MySQL\MySQL Server 5.7\data`). It is the file with a suffix of `.err`.

When a MySQL server has been installed as a service, and the service is running, Windows stops the service automatically when Windows shuts down. The server also can be stopped manually using the `Services` utility, the **sc stop *`mysqld_service_name`*** command, the **NET STOP *`mysqld_service_name`*** command, or the **mysqladmin shutdown** command.

You also have the choice of installing the server as a manual service if you do not wish for the service to be started automatically during the boot process. To do this, use the `--install-manual` option rather than the `--install` option:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld" --install-manual
```

##### Removing the service

To remove a server that is installed as a service, first stop it if it is running by executing **SC STOP *`mysqld_service_name`*** or **NET STOP *`mysqld_service_name`***. Then use **SC DELETE *`mysqld_service_name`*** to remove it:

```sql
C:\> SC DELETE mysql
```

Alternatively, use the `mysqld` `--remove` option to remove the service.

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld" --remove
```

If `mysqld` is not running as a service, you can start it from the command line. For instructions, see Section 2.3.4.6, “Starting MySQL from the Windows Command Line”.

If you encounter difficulties during installation, see Section 2.3.5, “Troubleshooting a Microsoft Windows MySQL Server Installation”.

For more information about stopping or removing a Windows service, see Section 5.7.2.2, “Starting Multiple MySQL Instances as Windows Services”.

#### 2.3.4.9 Testing The MySQL Installation

You can test whether the MySQL server is working by executing any of the following commands:

```sql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqlshow"
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqlshow" -u root mysql
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqladmin" version status proc
C:\> "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql" test
```

If `mysqld` is slow to respond to TCP/IP connections from client programs, there is probably a problem with your DNS. In this case, start `mysqld` with the `skip_name_resolve` system variable enabled and use only `localhost` and IP addresses in the `Host` column of the MySQL grant tables. (Be sure that an account exists that specifies an IP address or you may not be able to connect.)

You can force a MySQL client to use a named-pipe connection rather than TCP/IP by specifying the `--pipe` or `--protocol=PIPE` option, or by specifying `.` (period) as the host name. Use the `--socket` option to specify the name of the pipe if you do not want to use the default pipe name.

If you have set a password for the `root` account, deleted the anonymous account, or created a new user account, then to connect to the MySQL server you must use the appropriate `-u` and `-p` options with the commands shown previously. See Section 4.2.4, “Connecting to the MySQL Server Using Command Options”.

For more information about **mysqlshow**, see Section 4.5.7, “mysqlshow — Display Database, Table, and Column Information”.

### 2.3.5 Troubleshooting a Microsoft Windows MySQL Server Installation

When installing and running MySQL for the first time, you may encounter certain errors that prevent the MySQL server from starting. This section helps you diagnose and correct some of these errors.

Your first resource when troubleshooting server issues is the error log. The MySQL server uses the error log to record information relevant to the error that prevents the server from starting. The error log is located in the data directory specified in your `my.ini` file. The default data directory location is `C:\Program Files\MySQL\MySQL Server 5.7\data`, or `C:\ProgramData\Mysql` on Windows 7 and Windows Server 2008. The `C:\ProgramData` directory is hidden by default. You need to change your folder options to see the directory and contents. For more information on the error log and understanding the content, see Section 5.4.2, “The Error Log”.

For information regarding possible errors, also consult the console messages displayed when the MySQL service is starting. Use the **SC START *`mysqld_service_name`*** or **NET START *`mysqld_service_name`*** command from the command line after installing `mysqld` as a service to see any error messages regarding the starting of the MySQL server as a service. See Section 2.3.4.8, “Starting MySQL as a Windows Service”.

The following examples show other common error messages you might encounter when installing MySQL and starting the server for the first time:

* If the MySQL server cannot find the `mysql` privileges database or other critical files, it displays these messages:

  ```sql
  System error 1067 has occurred.
  Fatal error: Can't open and lock privilege tables:
  Table 'mysql.user' doesn't exist
  ```

  These messages often occur when the MySQL base or data directories are installed in different locations than the default locations (`C:\Program Files\MySQL\MySQL Server 5.7` and `C:\Program Files\MySQL\MySQL Server 5.7\data`, respectively).

  This situation can occur when MySQL is upgraded and installed to a new location, but the configuration file is not updated to reflect the new location. In addition, old and new configuration files might conflict. Be sure to delete or rename any old configuration files when upgrading MySQL.

  If you have installed MySQL to a directory other than `C:\Program Files\MySQL\MySQL Server 5.7`, ensure that the MySQL server is aware of this through the use of a configuration (`my.ini`) file. Put the `my.ini` file in your Windows directory, typically `C:\WINDOWS`. To determine its exact location from the value of the `WINDIR` environment variable, issue the following command from the command prompt:

  ```sql
  C:\> echo %WINDIR%
  ```

  You can create or modify an option file with any text editor, such as Notepad. For example, if MySQL is installed in `E:\mysql` and the data directory is `D:\MySQLdata`, you can create the option file and set up a `[mysqld]` section to specify values for the `basedir` and `datadir` options:

  ```sql
  [mysqld]
  # set basedir to your installation path
  basedir=E:/mysql
  # set datadir to the location of your data directory
  datadir=D:/MySQLdata
  ```

  Microsoft Windows path names are specified in option files using (forward) slashes rather than backslashes. If you do use backslashes, double them:

  ```sql
  [mysqld]
  # set basedir to your installation path
  basedir=C:\\Program Files\\MySQL\\MySQL Server 5.7
  # set datadir to the location of your data directory
  datadir=D:\\MySQLdata
  ```

  The rules for use of backslash in option file values are given in Section 4.2.2.2, “Using Option Files”.

  If you change the `datadir` value in your MySQL configuration file, you must move the contents of the existing MySQL data directory before restarting the MySQL server.

  See Section 2.3.4.2, “Creating an Option File”.

* If you reinstall or upgrade MySQL without first stopping and removing the existing MySQL service and install MySQL using the MySQL Installer, you might see this error:

  ```sql
  Error: Cannot create Windows service for MySql. Error: 0
  ```

  This occurs when the Configuration Wizard tries to install the service and finds an existing service with the same name.

  One solution to this problem is to choose a service name other than `mysql` when using the configuration wizard. This enables the new service to be installed correctly, but leaves the outdated service in place. Although this is harmless, it is best to remove old services that are no longer in use.

  To permanently remove the old `mysql` service, execute the following command as a user with administrative privileges, on the command line:

  ```sql
  C:\> SC DELETE mysql
  [SC] DeleteService SUCCESS
  ```

  If the `SC` utility is not available for your version of Windows, download the `delsrv` utility from <http://www.microsoft.com/windows2000/techinfo/reskit/tools/existing/delsrv-o.asp> and use the `delsrv mysql` syntax.

### 2.3.6 Windows Postinstallation Procedures

GUI tools exist that perform most of the tasks described in this section, including:

* MySQL Installer: Used to install and upgrade MySQL products.

* MySQL Workbench: Manages the MySQL server and edits SQL statements.

If necessary, initialize the data directory and create the MySQL grant tables. Windows distributions prior to MySQL 5.7.7 include a data directory with a set of preinitialized accounts in the `mysql` database. As of 5.7.7, Windows installation operations performed by MySQL Installer initialize the data directory automatically. For installation from a ZIP Archive package, initialize the data directory as described at Section 2.9.1, “Initializing the Data Directory”.

Regarding passwords, if you installed MySQL using the MySQL Installer, you may have already assigned a password to the initial `root` account. (See Section 2.3.3, “MySQL Installer for Windows”.) Otherwise, use the password-assignment procedure given in Section 2.9.4, “Securing the Initial MySQL Account”.

Before assigning a password, you might want to try running some client programs to make sure that you can connect to the server and that it is operating properly. Make sure that the server is running (see Section 2.3.4.5, “Starting the Server for the First Time”). You can also set up a MySQL service that runs automatically when Windows starts (see Section 2.3.4.8, “Starting MySQL as a Windows Service”).

These instructions assume that your current location is the MySQL installation directory and that it has a `bin` subdirectory containing the MySQL programs used here. If that is not true, adjust the command path names accordingly.

If you installed MySQL using MySQL Installer (see Section 2.3.3, “MySQL Installer for Windows”), the default installation directory is `C:\Program Files\MySQL\MySQL Server 5.7`:

```sql
C:\> cd "C:\Program Files\MySQL\MySQL Server 5.7"
```

A common installation location for installation from a ZIP archive is `C:\mysql`:

```sql
C:\> cd C:\mysql
```

Alternatively, add the `bin` directory to your `PATH` environment variable setting. That enables your command interpreter to find MySQL programs properly, so that you can run a program by typing only its name, not its path name. See Section 2.3.4.7, “Customizing the PATH for MySQL Tools”.

With the server running, issue the following commands to verify that you can retrieve information from the server. The output should be similar to that shown here.

Use **mysqlshow** to see what databases exist:

```sql
C:\> bin\mysqlshow
+--------------------+
|     Databases      |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

The list of installed databases may vary, but always includes at least `mysql` and `information_schema`. Before MySQL 5.7.7, a `test` database may also be created automatically.

The preceding command (and commands for other MySQL programs such as **mysql**) may not work if the correct MySQL account does not exist. For example, the program may fail with an error, or you may not be able to view all databases. If you install MySQL using MySQL Installer, the `root` user is created automatically with the password you supplied. In this case, you should use the `-u root` and `-p` options. (You must use those options if you have already secured the initial MySQL accounts.) With `-p`, the client program prompts for the `root` password. For example:

```sql
C:\> bin\mysqlshow -u root -p
Enter password: (enter root password here)
+--------------------+
|     Databases      |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

If you specify a database name, **mysqlshow** displays a list of the tables within the database:

```sql
C:\> bin\mysqlshow mysql
Database: mysql
+---------------------------+
|          Tables           |
+---------------------------+
| columns_priv              |
| db                        |
| engine_cost               |
| event                     |
| func                      |
| general_log               |
| gtid_executed             |
| help_category             |
| help_keyword              |
| help_relation             |
| help_topic                |
| innodb_index_stats        |
| innodb_table_stats        |
| ndb_binlog_index          |
| plugin                    |
| proc                      |
| procs_priv                |
| proxies_priv              |
| server_cost               |
| servers                   |
| slave_master_info         |
| slave_relay_log_info      |
| slave_worker_info         |
| slow_log                  |
| tables_priv               |
| time_zone                 |
| time_zone_leap_second     |
| time_zone_name            |
| time_zone_transition      |
| time_zone_transition_type |
| user                      |
+---------------------------+
```

Use the **mysql** program to select information from a table in the `mysql` database:

```sql
C:\> bin\mysql -e "SELECT User, Host, plugin FROM mysql.user" mysql
+------+-----------+-----------------------+
| User | Host      | plugin                |
+------+-----------+-----------------------+
| root | localhost | mysql_native_password |
+------+-----------+-----------------------+
```

For more information about **mysql** and **mysqlshow**, see Section 4.5.1, “mysql — The MySQL Command-Line Client”, and Section 4.5.7, “mysqlshow — Display Database, Table, and Column Information”.

### 2.3.7 Windows Platform Restrictions

The following restrictions apply to use of MySQL on the Windows platform:

**Process memory**

On Windows 32-bit platforms, it is not possible by default to use more than 2GB of RAM within a single process, including MySQL. This is because the physical address limit on Windows 32-bit is 4GB and the default setting within Windows is to split the virtual address space between kernel (2GB) and user/applications (2GB).

Some versions of Windows have a boot time setting to enable larger applications by reducing the kernel application. Alternatively, to use more than 2GB, use a 64-bit version of Windows.

**File system aliases**

When using `MyISAM` tables, you cannot use aliases within Windows link to the data files on another volume and then link back to the main MySQL `datadir` location.

This facility is often used to move the data and index files to a RAID or other fast solution, while retaining the main `.frm` files in the default data directory configured with the `datadir` option.

**Limited number of ports**

Windows systems have about 4,000 ports available for client connections, and after a connection on a port closes, it takes two to four minutes before the port can be reused. In situations where clients connect to and disconnect from the server at a high rate, it is possible for all available ports to be used up before closed ports become available again. If this happens, the MySQL server appears to be unresponsive even though it is running. Ports may be used by other applications running on the machine as well, in which case the number of ports available to MySQL is lower.

For more information about this problem, see <https://support.microsoft.com/kb/196271>.

**`DATA DIRECTORY` and `INDEX DIRECTORY`**

The `DATA DIRECTORY` clause of the `CREATE TABLE` statement is supported on Windows for `InnoDB` tables only, as described in Section 14.6.1.2, “Creating Tables Externally”. For `MyISAM` and other storage engines, the `DATA DIRECTORY` and `INDEX DIRECTORY` clauses for `CREATE TABLE` are ignored on Windows and any other platforms with a nonfunctional `realpath()` call.

**`DROP DATABASE`**

You cannot drop a database that is in use by another session.

**Case-insensitive names**

File names are not case-sensitive on Windows, so MySQL database and table names are also not case-sensitive on Windows. The only restriction is that database and table names must be specified using the same case throughout a given statement. See Section 9.2.3, “Identifier Case Sensitivity”.

**Directory and file names**

On Windows, MySQL Server supports only directory and file names that are compatible with the current ANSI code pages. For example, the following Japanese directory name does not work in the Western locale (code page 1252):

```sql
datadir="C:/私たちのプロジェクトのデータ"
```

The same limitation applies to directory and file names referred to in SQL statements, such as the data file path name in `LOAD DATA`.

**The `\` path name separator character**

Path name components in Windows are separated by the `\` character, which is also the escape character in MySQL. If you are using `LOAD DATA` or `SELECT ... INTO OUTFILE`, use Unix-style file names with `/` characters:

```sql
mysql> LOAD DATA INFILE 'C:/tmp/skr.txt' INTO TABLE skr;
mysql> SELECT * INTO OUTFILE 'C:/tmp/skr.txt' FROM skr;
```

Alternatively, you must double the `\` character:

```sql
mysql> LOAD DATA INFILE 'C:\\tmp\\skr.txt' INTO TABLE skr;
mysql> SELECT * INTO OUTFILE 'C:\\tmp\\skr.txt' FROM skr;
```

**Problems with pipes**

Pipes do not work reliably from the Windows command-line prompt. If the pipe includes the character `^Z` / `CHAR(24)`, Windows thinks that it has encountered end-of-file and aborts the program.

This is mainly a problem when you try to apply a binary log as follows:

```sql
C:\> mysqlbinlog binary_log_file | mysql --user=root
```

If you have a problem applying the log and suspect that it is because of a `^Z` / `CHAR(24)` character, you can use the following workaround:

```sql
C:\> mysqlbinlog binary_log_file --result-file=/tmp/bin.sql
C:\> mysql --user=root --execute "source /tmp/bin.sql"
```

The latter command also can be used to reliably read any SQL file that may contain binary data.
