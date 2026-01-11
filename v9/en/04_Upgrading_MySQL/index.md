# Chapter 3 Upgrading MySQL

**Table of Contents**

3.1 Before You Begin

3.2 Upgrade Paths

3.3 Upgrade Best Practices

3.4 What the MySQL Upgrade Process Upgrades

3.5 Changes in MySQL 9.5

3.6 Preparing Your Installation for Upgrade

3.7 Upgrading MySQL Binary or Package-based Installations on Unix/Linux

3.8 Upgrading MySQL with the MySQL Yum Repository

3.9 Upgrading MySQL with the MySQL APT Repository

3.10 Upgrading MySQL with the MySQL SLES Repository

3.11 Upgrading MySQL on Windows

3.12 Upgrading a Docker Installation of MySQL

3.13 Upgrade Troubleshooting

3.14 Rebuilding or Repairing Tables or Indexes

3.15 Copying MySQL Databases to Another Machine

This chapter describes the steps to upgrade a MySQL installation.

Upgrading is a common procedure, as you pick up bug fixes within the same MySQL release series or significant features between major MySQL releases. You perform this procedure first on some test systems to make sure everything works smoothly, and then on the production systems.

Note

In the following discussion, MySQL commands that must be run using a MySQL account with administrative privileges include `-u root`  on the command line to specify the MySQL `root` user. Commands that require a password for `root` also include a `-p` option. Because `-p` is followed by no option value, such commands prompt for the password. Type the password when prompted and press Enter.

SQL statements can be executed using the **mysql** command-line client (connect as `root` to ensure that you have the necessary privileges).
