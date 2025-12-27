### 2.4.4 Installing and Using the MySQL Preference Pane

The MySQL Installation Package includes a MySQL preference pane that enables you to start, stop, and control automated startup during boot of your MySQL installation.

This preference pane is installed by default, and is listed under your system's *System Preferences* window.

**Figure 2.21 MySQL Preference Pane: Location**

![Content is described in the surrounding text.](images/mac-installer-preference-pane-location.png)

To install the MySQL Preference Pane:

1. Download the disk image (`.dmg`) file (the community version is available [here](https://dev.mysql.com/downloads/mysql/)) that contains the MySQL package installer. Double-click the file to mount the disk image and see its contents.

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
