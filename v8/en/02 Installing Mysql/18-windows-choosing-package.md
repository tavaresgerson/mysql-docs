### 2.3.1 Choosing an Installation Package

For MySQL 8.4, there are multiple installation package formats to choose from when installing MySQL on Windows. The package formats described in this section are:

*  MySQL Installation MSI
*  MySQL noinstall ZIP Archives
*  MySQL Docker Images

#### MySQL Installation MSI

This package has a file name similar to `mysql-community-8.4.6.msi` or `mysql-commercial-8.4.6.msi`, and installs MySQL server along with MySQL Configurator. The MSI includes a MySQL Configurator application that is recommended for most users to set up, configure, and reconfigure the MySQL server.

The MSI and MySQL Configurator operate on all MySQL supported versions of Windows (see <https://www.mysql.com/support/supportedplatforms/database.html>). For instructions on how to configure MySQL using MySQL Configurator, see Section 2.3.2, “Configuration: Using MySQL Configurator”.

#### MySQL noinstall ZIP Archives

These packages contain the files found in the complete MySQL Server installation package, with the exception of the GUI. This format does not include an automated installer, but does include MySQL Configurator to configure the MySQL server.

The `noinstall` ZIP archives are split into two separate compressed files. The main package is named `mysql-VERSION-winx64.zip`. This contains the components needed to use MySQL on your system. The optional MySQL test suite, MySQL benchmark suite, and debugging binaries/information components (including PDB files) are in a separate compressed file named `mysql-VERSION-winx64-debug-test.zip`.

Program Database (PDB) files (with file name extension `pdb`) provide information for debugging your MySQL installation in the event of a problem. These files are included in ZIP Archive distributions (but not MSI distributions) of MySQL.

To install MySQL by extracting the Zip archive rather than use the MSI, consider the following:

1. If you are upgrading from a previous version please refer to Section 3.11, “Upgrading MySQL on Windows”, before beginning the upgrade process.
2. Make sure that you are logged in as a user with administrator privileges.
3. Choose an installation location. Traditionally, the MySQL server is installed in `C:\mysql`. If you do not install MySQL at `C:\mysql`, you must specify the path to the install directory during startup or in an option file. See Section 2.3.3.2, “Creating an Option File”.

   ::: info Note

   The MSI installs MySQL under `C:\Program Files\MySQL\MySQL Server 8.4\`.

   :::

4. Extract the install archive to the chosen installation location using your preferred file-compression tool. Some tools may extract the archive to a folder within your chosen installation location. If this occurs, you can move the contents of the subfolder into the chosen installation location.
5. Configure the MySQL server using either MySQL Configurator (recommended) or  Section 2.3.3, “Configuration: Manually”.

#### MySQL Docker Images

For information on using the MySQL Docker images provided by Oracle on Windows platform, see Section 2.5.6.3, “Deploying MySQL on Windows and Other Non-Linux Platforms with Docker”.

Warning

The MySQL Docker images provided by Oracle are built specifically for Linux platforms. Other platforms are not supported, and users running the MySQL Docker images from Oracle on them are doing so at their own risk.
