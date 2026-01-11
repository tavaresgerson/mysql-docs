### 2.3.3 MySQL Installer for Windows

2.3.3.1 MySQL Installer Initial Setup

2.3.3.2 Setting Alternative Server Paths with MySQL Installer

2.3.3.3 Installation Workflows with MySQL Installer

2.3.3.4 MySQL Installer Product Catalog and Dashboard

2.3.3.5 MySQL Installer Console Reference

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

MySQL Installer requires Microsoft .NET Framework 4.5.2 or later. If this version is not installed on the host computer, you can download it by visiting the Microsoft website.

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

The Commercial release integrates with your MOS account. For knowledge-base content and patches, see My Oracle Support.
