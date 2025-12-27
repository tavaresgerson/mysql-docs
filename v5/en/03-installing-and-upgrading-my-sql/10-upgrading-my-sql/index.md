## 2.10 Upgrading MySQL

2.10.1 Before You Begin

2.10.2 Upgrade Paths

2.10.3 Changes in MySQL 5.7

2.10.4 Upgrading MySQL Binary or Package-based Installations on Unix/Linux

2.10.5 Upgrading MySQL with the MySQL Yum Repository

2.10.6 Upgrading MySQL with the MySQL APT Repository

2.10.7 Upgrading MySQL with the MySQL SLES Repository

2.10.8 Upgrading MySQL on Windows

2.10.9 Upgrading a Docker Installation of MySQL

2.10.10 Upgrading MySQL with Directly-Downloaded RPM Packages

2.10.11 Upgrade Troubleshooting

2.10.12 Rebuilding or Repairing Tables or Indexes

2.10.13 Copying MySQL Databases to Another Machine

This section describes the steps to upgrade a MySQL installation.

Upgrading is a common procedure, as you pick up bug fixes within the same MySQL release series or significant features between major MySQL releases. You perform this procedure first on some test systems to make sure everything works smoothly, and then on the production systems.

Note

In the following discussion, MySQL commands that must be run using a MySQL account with administrative privileges include `-u root` on the command line to specify the MySQL `root` user. Commands that require a password for `root` also include a `-p` option. Because `-p` is followed by no option value, such commands prompt for the password. Type the password when prompted and press Enter.

SQL statements can be executed using the **mysql** command-line client (connect as `root` to ensure that you have the necessary privileges).
