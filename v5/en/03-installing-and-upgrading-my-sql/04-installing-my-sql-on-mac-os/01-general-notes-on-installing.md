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
