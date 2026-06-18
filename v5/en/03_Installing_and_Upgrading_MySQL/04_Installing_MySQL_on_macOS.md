## 2.4 Installing MySQL on macOS

For a list of macOS versions that the MySQL server supports, see <https://www.mysql.com/support/supportedplatforms/database.html>.

MySQL for macOS is available in a number of different forms:

* Native Package Installer, which uses the native macOS installer (DMG) to walk you through the installation of MySQL. For more information, see Section 2.4.2, “Installing MySQL on macOS Using Native Packages”. You can use the package installer with macOS. The user you use to perform the installation must have administrator privileges.

* Compressed TAR archive, which uses a file packaged using the Unix **tar** and **gzip** commands. To use this method, you 'to open a **Terminal** window. You do not need administrator privileges using this method, as you can install the MySQL server anywhere using this method. For more information on using this method, you can use the generic instructions for using a tarball, Section 2.2, “Installing MySQL on Unix/Linux Using Generic Binaries”.

  In addition to the core installation, the Package Installer also includes Section 2.4.3, “Installing a MySQL Launch Daemon” and Section 2.4.4, “Installing and Using the MySQL Preference Pane”, both of which simplify the management of your installation.

For additional information on using MySQL on macOS, see Section 2.4.1, “General Notes on Installing MySQL on macOS”.

### 2.4.1 General Notes on Installing MySQL on macOS

You should keep the following issues and notes in mind:

* As of macOS 10.14 (Majave), the macOS MySQL 5.7 Installer application requires permission to control *System Events* so it can display a generated (temporary) MySQL root password. Choosing "Don't Allow" means this password won't be visible for use.

  If previously disallowed, the fix is enabling *System Events.app* for *Installer.app* under the *Security & Privacy* | *Automation* | *Privacy* tab.

* A launchd daemon is installed, and it includes MySQL configuration options. Consider editing it if needed, see the documentation below for additional information. Also, macOS 10.10 removed startup item support in favor of launchd daemons. The optional MySQL preference pane under macOS System Preferences uses the launchd daemon.

* You may need (or want) to create a specific `mysql` user to own the MySQL directory and data. You can do this through the **Directory Utility**, and the `mysql` user should already exist. For use in single user mode, an entry for `_mysql` (note the underscore prefix) should already exist within the system `/etc/passwd` file.

* Because the MySQL package installer installs the MySQL contents into a version and platform specific directory, you can use this to upgrade and migrate your database between versions. You need either to copy the `data` directory from the old version to the new version, or to specify an alternative `datadir` value to set location of the data directory. By default, the MySQL directories are installed under `/usr/local/`.

* You might want to add aliases to your shell's resource file to make it easier to access commonly used programs such as **mysql** and **mysqladmin** from the command line. The syntax for **bash** is:

  ```sql
  alias mysql=/usr/local/mysql/bin/mysql
  alias mysqladmin=/usr/local/mysql/bin/mysqladmin
  ```

  For **tcsh**, use:

  ```sql
  alias mysql /usr/local/mysql/bin/mysql
  alias mysqladmin /usr/local/mysql/bin/mysqladmin
  ```

  Even better, add `/usr/local/mysql/bin` to your `PATH` environment variable. You can do this by modifying the appropriate startup file for your shell. For more information, see Section 4.2.1, “Invoking MySQL Programs”.

* After you have copied over the MySQL database files from the previous installation and have successfully started the new server, you should consider removing the old installation files to save disk space. Additionally, you should also remove older versions of the Package Receipt directories located in `/Library/Receipts/mysql-VERSION.pkg`.

### 2.4.2 Installing MySQL on macOS Using Native Packages

The package is located inside a disk image (`.dmg`) file that you first need to mount by double-clicking its icon in the Finder. It should then mount the image and display its contents.

Note

Before proceeding with the installation, be sure to stop all running MySQL server instances by using either the MySQL Manager Application (on macOS Server), the preference pane, or **mysqladmin shutdown** on the command line.

To install MySQL using the package installer:

1. Download the disk image (`.dmg`) file (the community version is available here) that contains the MySQL package installer. Double-click the file to mount the disk image and see its contents.

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

<table>
  <thead>
    <tr>
      <th>Directory</th>
      <th>Contents of Directory</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>bin</code></td>
      <td><strong>mysqld</strong> server, client and utility programs</td>
    </tr>
    <tr>
      <td><code>data</code></td>
      <td>Log files, databases</td>
    </tr>
    <tr>
      <td><code>docs</code></td>
      <td>Helper documents, like the Release Notes and build information</td>
    </tr>
    <tr>
      <td><code>include</code></td>
      <td>Include (header) files</td>
    </tr>
    <tr>
      <td><code>lib</code></td>
      <td>Libraries</td>
    </tr>
    <tr>
      <td><code>man</code></td>
      <td>Unix manual pages</td>
    </tr>
    <tr>
      <td><code>mysql-test</code></td>
      <td>MySQL test suite</td>
    </tr>
    <tr>
      <td><code>share</code></td>
      <td>Miscellaneous support files, including error messages, sample
        configuration files, SQL for database installation
      </td>
    </tr>
    <tr>
      <td><code>support-files</code></td>
      <td>Scripts and sample configuration files</td>
    </tr>
    <tr>
      <td><code>/tmp/mysql.sock</code></td>
      <td>Location of the MySQL Unix socket</td>
    </tr>
  </tbody>
</table>

During the package installer process, a symbolic link from `/usr/local/mysql` to the version/platform specific directory created during installation is created automatically.

### 2.4.3 Installing a MySQL Launch Daemon

macOS uses launch daemons to automatically start, stop, and manage processes and applications such as MySQL.

By default, the installation package (DMG) on macOS installs a launchd file named `/Library/LaunchDaemons/com.oracle.oss.mysql.mysqld.plist` that contains a plist definition similar to:

```sql
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>             <string>com.oracle.oss.mysql.mysqld</string>
    <key>ProcessType</key>       <string>Interactive</string>
    <key>Disabled</key>          <false/>
    <key>RunAtLoad</key>         <true/>
    <key>KeepAlive</key>         <true/>
    <key>SessionCreate</key>     <true/>
    <key>LaunchOnlyOnce</key>    <false/>
    <key>UserName</key>          <string>_mysql</string>
    <key>GroupName</key>         <string>_mysql</string>
    <key>ExitTimeOut</key>       <integer>600</integer>
    <key>Program</key>           <string>/usr/local/mysql/bin/mysqld</string>
    <key>ProgramArguments</key>
        <array>
            <string>/usr/local/mysql/bin/mysqld</string>
            <string>--user=_mysql</string>
            <string>--basedir=/usr/local/mysql</string>
            <string>--datadir=/usr/local/mysql/data</string>
            <string>--plugin-dir=/usr/local/mysql/lib/plugin</string>
            <string>--log-error=/usr/local/mysql/data/mysqld.local.err</string>
            <string>--pid-file=/usr/local/mysql/data/mysqld.local.pid</string>
        </array>
    <key>WorkingDirectory</key>  <string>/usr/local/mysql</string>
</dict>
</plist>
```

Note

Some users report that adding a plist DOCTYPE declaration causes the launchd operation to fail, despite it passing the lint check. We suspect it's a copy-n-paste error. The md5 checksum of a file containing the above snippet is *24710a27dc7a28fb7ee6d825129cd3cf*.

To enable the launchd service, you can either:

* Click Start MySQL Server from the MySQL preference pane.

  **Figure 2.19 MySQL Preference Pane: Location**

  ![Content is described in the surrounding text.](images/mac-installer-preference-pane-location.png)

  **Figure 2.20 MySQL Preference Pane: Usage**

  ![Content is described in the surrounding text.](images/mac-installer-preference-pane-usage.png)

* Or, manually load the launchd file.

  ```sql
  $> cd /Library/LaunchDaemons
  $> sudo launchctl load -F com.oracle.oss.mysql.mysqld.plist
  ```

* To configure MySQL to automatically start at bootup, you can:

  ```sql
  $> sudo launchctl load -w com.oracle.oss.mysql.mysqld.plist
  ```

Note

When upgrading MySQL server, the launchd installation process removes the old startup items that were installed with MySQL server 5.7.7 and earlier.

Upgrading also replaces your existing **launchd** file of the same name.

Additional **launchd** related information:

* The `plist` entries override `my.cnf` entries, because they are passed in as command line arguments. For additional information about passing in program options, see Section 4.2.2, “Specifying Program Options”.

* The **ProgramArguments** section defines the command line options that are passed into the program, which is the `mysqld` binary in this case.

* The default `plist` definition is written with less sophisticated use cases in mind. For more complicated setups, you may want to remove some of the arguments and instead rely on a MySQL configuration file, such as `my.cnf`.

* If you edit the `plist` file, then uncheck the installer option when reinstalling or upgrading MySQL. Otherwise, your edited `plist` file is overwritten, with the loss of any changes you have made.

Because the default `plist` definition defines several **ProgramArguments**, you might remove most of these arguments and instead rely upon your `my.cnf` MySQL configuration file to define them. For example:

```sql
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>             <string>com.oracle.oss.mysql.mysqld</string>
    <key>ProcessType</key>       <string>Interactive</string>
    <key>Disabled</key>          <false/>
    <key>RunAtLoad</key>         <true/>
    <key>KeepAlive</key>         <true/>
    <key>SessionCreate</key>     <true/>
    <key>LaunchOnlyOnce</key>    <false/>
    <key>UserName</key>          <string>_mysql</string>
    <key>GroupName</key>         <string>_mysql</string>
    <key>ExitTimeOut</key>       <integer>600</integer>
    <key>Program</key>           <string>/usr/local/mysql/bin/mysqld</string>
    <key>WorkingDirectory</key>  <string>/usr/local/mysql</string>
    <key>ProgramArguments</key>
        <array>
            <string>/usr/local/mysql/bin/mysqld</string>
            <string>--user=_mysql</string>
        </array>
</dict>
</plist>
```

In this case, the `basedir`, `datadir`, `plugin_dir`, `log_error`, and `pid_file` options were removed from the plist definition, and then you might define them in `my.cnf`.

### 2.4.4 Installing and Using the MySQL Preference Pane

The MySQL Installation Package includes a MySQL preference pane that enables you to start, stop, and control automated startup during boot of your MySQL installation.

This preference pane is installed by default, and is listed under your system's *System Preferences* window.

**Figure 2.21 MySQL Preference Pane: Location**

![Content is described in the surrounding text.](images/mac-installer-preference-pane-location.png)

To install the MySQL Preference Pane:

1. Download the disk image (`.dmg`) file (the community version is available here) that contains the MySQL package installer. Double-click the file to mount the disk image and see its contents.

   **Figure 2.22 MySQL Package Installer: DMG Contents**

   ![Content is described in the surrounding text.](images/mac-installer-dmg-contents.png)

2. Go through the process of installing the MySQL server, as described in the documentation at Section 2.4.2, “Installing MySQL on macOS Using Native Packages”.

3. Click Customize at the Installation Type step. The "Preference Pane" option is listed there and enabled by default; make sure it is not deselected.

   **Figure 2.23 MySQL Installer on macOS: Customize**

   ![Content is described in the surrounding text.](images/mac-installer-installation-customize.png)

4. Complete the MySQL server installation process.

Note

The MySQL preference pane only starts and stops MySQL installation installed from the MySQL package installation that have been installed in the default location.

Once the MySQL preference pane has been installed, you can control your MySQL server instance using the preference pane. To use the preference pane, open the System Preferences... from the Apple menu. Select the MySQL preference pane by clicking the MySQL icon within the preference panes list.

**Figure 2.24 MySQL Preference Pane: Location**

![Content is described in the surrounding text.](images/mac-installer-preference-pane-location.png)

**Figure 2.25 MySQL Preference Pane: Usage**

![Content is described in the surrounding text.](images/mac-installer-preference-pane-usage.png)

The MySQL Preference Pane shows the current status of the MySQL server, showing stopped (in red) if the server is not running and running (in green) if the server has already been started. The preference pane also shows the current setting for whether the MySQL server has been set to start automatically.

* **To start the MySQL server using the preference pane:**

  Click Start MySQL Server. You may be prompted for the username and password of a user with administrator privileges to start the MySQL server.

* **To stop the MySQL server using the preference pane:**

  Click Stop MySQL Server. You may be prompted for the username and password of a user with administrator privileges to stop the MySQL server.

* **To automatically start the MySQL server when the system boots:**

  Check the check box next to Automatically Start MySQL Server on Startup.

* **To disable automatic MySQL server startup when the system boots:**

  Uncheck the check box next to Automatically Start MySQL Server on Startup.

You can close the **System Preferences...** window once you have completed your settings.
