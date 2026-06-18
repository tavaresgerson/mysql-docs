# Chapter 3 Upgrading MySQL

**Table of Contents**

[3.1 Before You Begin](upgrade-before-you-begin.html)

[3.2 Upgrade Paths](upgrade-paths.html)

[3.3 Upgrade Best Practices](upgrade-best-practices.html)

[3.4 What the MySQL Upgrade Process Upgrades](upgrading-what-is-upgraded.html)

[3.5 Changes in MySQL 9.5](upgrading-from-previous-series.html)

[3.6 Preparing Your Installation for Upgrade](upgrade-prerequisites.html)

[3.7 Upgrading MySQL Binary or Package-based Installations on Unix/Linux](upgrade-binary-package.html)

[3.8 Upgrading MySQL with the MySQL Yum Repository](updating-yum-repo.html)

[3.9 Upgrading MySQL with the MySQL APT Repository](updating-apt-repo.html)

[3.10 Upgrading MySQL with the MySQL SLES Repository](updating-sles-repo.html)

[3.11 Upgrading MySQL on Windows](windows-upgrading.html)

[3.12 Upgrading a Docker Installation of MySQL](upgrade-docker-mysql.html)

[3.13 Upgrade Troubleshooting](upgrade-troubleshooting.html)

[3.14 Rebuilding or Repairing Tables or Indexes](rebuilding-tables.html)

[3.15 Copying MySQL Databases to Another Machine](copying-databases.html)

This chapter describes the steps to upgrade a MySQL installation.

Upgrading is a common procedure, as you pick up bug fixes within the
same MySQL release series or significant features between major
MySQL releases. You perform this procedure first on some test
systems to make sure everything works smoothly, and then on the
production systems.

Note

In the following discussion, MySQL commands that must be run using
a MySQL account with administrative privileges include `-u
root`  on the command line to specify
the MySQL `root` user. Commands that require a
password for `root` also include a
`-p` option. Because `-p` is
followed by no option value, such commands prompt for the
password. Type the password when prompted and press Enter.

SQL statements can be executed using the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
command-line client (connect as `root` to ensure
that you have the necessary privileges).