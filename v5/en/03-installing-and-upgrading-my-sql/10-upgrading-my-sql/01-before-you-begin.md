### 2.10.1 Before You Begin

Review the information in this section before upgrading. Perform any recommended actions.

* Protect your data by creating a backup. The backup should include the `mysql` system database, which contains the MySQL system tables. See Section 7.2, “Database Backup Methods”.

* Review Section 2.10.2, “Upgrade Paths” to ensure that your intended upgrade path is supported.

* Review Section 2.10.3, “Changes in MySQL 5.7” for changes that you should be aware of before upgrading. Some changes may require action.

* Review Section 1.3, “What Is New in MySQL 5.7” for deprecated and removed features. An upgrade may require changes with respect to those features if you use any of them.

* Review Section 1.4, “Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 5.7”. If you use deprecated or removed variables, an upgrade may require configuration changes.

* Review the Release Notes for information about fixes, changes, and new features.

* If you use replication, review Section 16.4.3, “Upgrading a Replication Topology”.

* Upgrade procedures vary by platform and how the initial installation was performed. Use the procedure that applies to your current MySQL installation:

  + For binary and package-based installations on non-Windows platforms, refer to Section 2.10.4, “Upgrading MySQL Binary or Package-based Installations on Unix/Linux”.

    Note

    For supported Linux distributions, the preferred method for upgrading package-based installations is to use the MySQL software repositories (MySQL Yum Repository, MySQL APT Repository, and MySQL SLES Repository).

  + For installations on an Enterprise Linux platform or Fedora using the MySQL Yum Repository, refer to Section 2.10.5, “Upgrading MySQL with the MySQL Yum Repository”.

  + For installations on Ubuntu using the MySQL APT repository, refer to Section 2.10.6, “Upgrading MySQL with the MySQL APT Repository”.

  + For installations on SLES using the MySQL SLES repository, refer to Section 2.10.7, “Upgrading MySQL with the MySQL SLES Repository”.

  + For installations performed using Docker, refer to Section 2.10.9, “Upgrading a Docker Installation of MySQL”.

  + For installations on Windows, refer to Section 2.10.8, “Upgrading MySQL on Windows”.

* If your MySQL installation contains a large amount of data that might take a long time to convert after an in-place upgrade, it may be useful to create a test instance for assessing the conversions that are required and the work involved to perform them. To create a test instance, make a copy of your MySQL instance that contains the `mysql` database and other databases without the data. Run the upgrade procedure on the test instance to assess the work involved to perform the actual data conversion.

* Rebuilding and reinstalling MySQL language interfaces is recommended when you install or upgrade to a new release of MySQL. This applies to MySQL interfaces such as PHP `mysql` extensions and the Perl `DBD::mysql` module.
