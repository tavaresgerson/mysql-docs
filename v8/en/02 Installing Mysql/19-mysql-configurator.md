### 2.3.2 Configuration: Using MySQL Configurator

MySQL Configurator is a standalone application designed to ease the complexity of configuring a MySQL server to run MySQL on Microsoft Windows. It is bundled with the MySQL server, in both the MSI and standalone Zip archive.

#### Methods to Start MySQL Configurator

MySQL Configurator can both configure and reconfigure MySQL server; and the methods to start MySQL Configurator are:

* The MySQL server MSI prompts to execute MySQL Configurator immediately after it installs the MySQL server.
* From the Start Menu: the MSI creates a MySQL Configurator start menu item.
* From the command line: the `mysql-configurator.exe` executable is located in the same directory as `mysqld.exe` and other MySQL binaries installed with the MySQL server.

  Typically this location is in `C:\Program Files\MySQL\MySQL Server X.Y\bin` if installed via the MSI, or a custom directory for the Zip archive.
