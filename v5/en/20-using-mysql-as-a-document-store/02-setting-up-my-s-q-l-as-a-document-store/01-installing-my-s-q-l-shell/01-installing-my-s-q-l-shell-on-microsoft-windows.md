#### 19.2.1.1 Installing MySQL Shell on Microsoft Windows

Important

The Community version of MySQL Shell requires the Visual C++ Redistributable for Visual Studio 2013 (available at the Microsoft Download Center) to work; make sure that is installed on your Windows system before installing MySQL Shell.

Note

MySQL Shell is currently not supplied with an MSI Installer. See Installing MySQL Shell Binaries for the manual install procedure.

To install MySQL Shell on Microsoft Windows using the MSI Installer, do the following:

1. Download the **Windows (x86, 64-bit), MSI Installer** package from <http://dev.mysql.com/downloads/shell/>.

2. When prompted, click Run.
3. Follow the steps in the Setup Wizard.

   **Figure 19.1 Installation of MySQL Shell on Windows**

   ![Installation of MySQL Shell on Windows](images/x-installation-mysql-shell-win.png)

If you have installed MySQL without enabling the X Plugin, then later on decide you want to install the X Plugin, or if you are installing MySQL *without* using MySQL Installer, see Installing the X Plugin.

##### Installing MySQL Shell Binaries

To install MySQL Shell binaries:

1. Unzip the content of the Zip file to the MySQL products directory, for example `C:\Program Files\MySQL\`.

2. To be able to start MySQL Shell from a command prompt add the bin directory `C:\Program Files\MySQL\mysql-shell-1.0.8-rc-windows-x86-64bit\bin` to the `PATH` system variable.
