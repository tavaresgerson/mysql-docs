## 2.9 Postinstallation Setup and Testing

This section discusses tasks that you should perform after installing MySQL:

* If necessary, initialize the data directory and create the MySQL grant tables. For some MySQL installation methods, data directory initialization may be done for you automatically:

  + Windows installation operations performed by the MSI installer and MySQL Configurator.
  + Installation on Linux using a server RPM or Debian distribution from Oracle.
  + Installation using the native packaging system on many platforms, including Debian Linux, Ubuntu Linux, Gentoo Linux, and others.
  + Installation on macOS using a DMG distribution.

  For other platforms and installation types, you must initialize the data directory manually. These include installation from generic binary and source distributions on Unix and Unix-like system, and installation from a ZIP Archive package on Windows. For instructions, see Section 2.9.1, “Initializing the Data Directory”.
* Start the server and make sure that it can be accessed. For instructions, see  Section 2.9.2, “Starting the Server”, and Section 2.9.3, “Testing the Server”.
* Assign passwords to the initial `root` account in the grant tables, if that was not already done during data directory initialization. Passwords prevent unauthorized access to the MySQL server. For instructions, see Section 2.9.4, “Securing the Initial MySQL Account”.
* Optionally, arrange for the server to start and stop automatically when your system starts and stops. For instructions, see  Section 2.9.5, “Starting and Stopping MySQL Automatically”.
* Optionally, populate time zone tables to enable recognition of named time zones.

When you are ready to create additional user accounts, you can find information on the MySQL access control system and account management in  Section 8.2, “Access Control and Account Management”.
