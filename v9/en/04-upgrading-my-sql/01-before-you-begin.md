## 3.1 Before You Begin

Review the information in this section before upgrading. Perform any recommended actions.

* Understand what may occur during an upgrade. See Section 3.4, “What the MySQL Upgrade Process Upgrades”.

* Protect your data by creating a backup. The backup should include the `mysql` system database, which contains the MySQL data dictionary tables and system tables. See Section 9.2, “Database Backup Methods”.

  Important

  Downgrade from MySQL 9.5 to MySQL 9.4, or from a MySQL 9.5 release to a previous MySQL 9.5 release, is not supported. The only supported alternative is to restore a backup taken *before* upgrading. It is therefore imperative that you back up your data before starting the upgrade process.

* Review Section 3.2, “Upgrade Paths” to ensure that your intended upgrade path is supported.

* Review Section 3.5, “Changes in MySQL 9.5” for changes that you should be aware of before upgrading. Some changes may require action.

* Review Section 1.4, “What Is New in MySQL 9.5” for deprecated and removed features. An upgrade may require changes with respect to those features if you use any of them.

* Review Section 1.5, “Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 9.5”. If you use deprecated or removed variables, an upgrade may require configuration changes.

* Review the Release Notes for information about fixes, changes, and new features.

* If you use replication, review Section 19.5.3, “Upgrading or Downgrading a Replication Topology”.

* Review Section 3.3, “Upgrade Best Practices” and plan accordingly.

* Upgrade procedures vary by platform and how the initial installation was performed. Use the procedure that applies to your current MySQL installation:

  + For binary and package-based installations on non-Windows platforms, refer to Section 3.7, “Upgrading MySQL Binary or Package-based Installations on Unix/Linux”.

    Note

    For supported Linux distributions, the preferred method for upgrading package-based installations is to use the MySQL software repositories (MySQL Yum Repository, MySQL APT Repository, and MySQL SLES Repository).

  + For installations on an Enterprise Linux platform or Fedora using the MySQL Yum Repository, refer to Section 3.8, “Upgrading MySQL with the MySQL Yum Repository”.

  + For installations on Ubuntu using the MySQL APT repository, refer to Section 3.9, “Upgrading MySQL with the MySQL APT Repository”.

  + For installations on SLES using the MySQL SLES repository, refer to Section 3.10, “Upgrading MySQL with the MySQL SLES Repository”.

  + For installations performed using Docker, refer to Section 3.12, “Upgrading a Docker Installation of MySQL”.

  + For installations on Windows, refer to Section 3.11, “Upgrading MySQL on Windows”.

* If your MySQL installation contains a large amount of data that might take a long time to convert after an in-place upgrade, it may be useful to create a test instance for assessing the conversions that are required and the work involved to perform them. To create a test instance, make a copy of your MySQL instance that contains the `mysql` database and other databases without the data. Run the upgrade procedure on the test instance to assess the work involved to perform the actual data conversion.

* Rebuilding and reinstalling MySQL language interfaces is recommended when you install or upgrade to a new release of MySQL. This applies to MySQL interfaces such as PHP `mysql` extensions and the Perl `DBD::mysql` module.
