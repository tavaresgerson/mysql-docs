### 2.4.2 Installing MySQL on macOS Using Native Packages

The package is located inside a disk image (`.dmg`) file that you first need to mount by double-clicking its icon in the Finder. It should then mount the image and display its contents.

Note

Before proceeding with the installation, be sure to stop all running MySQL server instances by using either the MySQL Manager Application (on macOS Server), the preference pane, or **mysqladmin shutdown** on the command line.

To install MySQL using the package installer:

1. Download the disk image (`.dmg`) file (the community version is available [here](https://dev.mysql.com/downloads/mysql/)) that contains the MySQL package installer. Double-click the file to mount the disk image and see its contents.

   **Figure 2.13 MySQL Package Installer: DMG Contents**

   ![Mounted macOS disk image contents that contains the MySQL Server package file.](images/mac-installer-dmg-contents.png)

2. Double-click the MySQL installer package from the disk. It is named according to the version of MySQL you have downloaded. For example, for MySQL server 5.7.44 it might be named `mysql-5.7.44-macos-10.13-x86_64.pkg`.

3. The initial wizard introduction screen references the MySQL server version to install. Click Continue to begin the installation.

   **Figure 2.14 MySQL Package Installer Wizard: Introduction**

   ![Shows that the installation is ready to start, the MySQL server version being installed, and includes links to the MySQL manual, mysql.com, and oracle.com.](images/mac-installer-dmg-introduction.png)

4. The MySQL community edition shows a copy of the relevant GNU General Public License. Click Continue and then Agree to continue.

5. From the Installation Type page you can either click Install to execute the installation wizard using all defaults, click Customize to alter which components to install (MySQL server, Preference Pane, Launchd Support -- all enabled by default).

   Note

   Although the Change Install Location option is visible, the installation location cannot be changed.

   **Figure 2.15 MySQL Package Installer Wizard: Installation Type**

   ![Content is described in the surrounding text.](images/mac-installer-installation-type.png)

   **Figure 2.16 MySQL Package Installer Wizard: Customize**

   ![Customize shows three package name options: MySQL Server, Preference Pane, and Launchd Support. All three options are checked.](images/mac-installer-installation-customize.png)

6. Click Install to begin the installation process.

7. After a successful installation, the installer displays a window with your temporary root password. This cannot be recovered so you must save this password for the initial login to MySQL. For example:

   **Figure 2.17 MySQL Package Installer Wizard: Temporary Root Password**

   ![Content is described in the surrounding text.](images/mac-installer-root-password.png)

   Note

   MySQL expires this temporary root password after the initial login and requires you to create a new password.

8. Summary is the final step and references a successful and complete MySQL Server installation. Close the wizard.

   **Figure 2.18 MySQL Package Installer Wizard: Summary**

   ![Shows that the installation was a success, and includes links to the MySQL manual, mysql.com, and oracle.com.](images/mac-installer-summary.png)

MySQL server is now installed, but it is not loaded (or started) by default. Use either launchctl from the command line, or start MySQL by clicking "Start" using the MySQL preference pane. For additional information, see Section 2.4.3, “Installing a MySQL Launch Daemon”, and Section 2.4.4, “Installing and Using the MySQL Preference Pane”. Use the MySQL Preference Pane or launchd to configure MySQL to automatically start at bootup.

When installing using the package installer, the files are installed into a directory within `/usr/local` matching the name of the installation version and platform. For example, the installer file `mysql-5.7.44-macos10.13-x86_64.dmg` installs MySQL into `/usr/local/mysql-5.7.44-macos10.13-x86_64/`. The following table shows the layout of the installation directory.

**Table 2.7 MySQL Installation Layout on macOS**

<table><col style="width: 45%"/><col style="width: 55%"/><thead><tr> <th>Directory</th> <th>Contents of Directory</th> </tr></thead><tbody><tr> <td><code>bin</code></td> <td><span><strong>mysqld</strong></span> server, client and utility programs</td> </tr><tr> <td><code>data</code></td> <td>Log files, databases</td> </tr><tr> <td><code>docs</code></td> <td>Helper documents, like the Release Notes and build information</td> </tr><tr> <td><code>include</code></td> <td>Include (header) files</td> </tr><tr> <td><code>lib</code></td> <td>Libraries</td> </tr><tr> <td><code>man</code></td> <td>Unix manual pages</td> </tr><tr> <td><code>mysql-test</code></td> <td>MySQL test suite</td> </tr><tr> <td><code>share</code></td> <td>Miscellaneous support files, including error messages, sample configuration files, SQL for database installation</td> </tr><tr> <td><code>support-files</code></td> <td>Scripts and sample configuration files</td> </tr><tr> <td><code>/tmp/mysql.sock</code></td> <td>Location of the MySQL Unix socket</td> </tr></tbody></table>

During the package installer process, a symbolic link from `/usr/local/mysql` to the version/platform specific directory created during installation is created automatically.
