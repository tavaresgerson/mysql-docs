### 2.11.1 Before You Begin

Review the information in this section before downgrading. Perform any recommended actions.

* Protect your data by taking a backup. The backup should include the `mysql` database, which contains the MySQL system tables. See Section 7.2, “Database Backup Methods”.

* Review Section 2.11.2, “Downgrade Paths” to ensure that your intended downgrade path is supported.

* Review Section 2.11.3, “Downgrade Notes” for items that may require action before downgrading.

  Note

  The downgrade procedures described in the following sections assume you are downgrading with data files created or modified by the newer MySQL version. However, if you did not modify your data after upgrading, downgrading using backups taken *before* upgrading to the new MySQL version is recommended. Many of the changes described in Section 2.11.3, “Downgrade Notes” that require action are not applicable when downgrading using backups taken *before* upgrading to the new MySQL version.

* Use of new features, new configuration options, or new configuration option values that are not supported by a previous release may cause downgrade errors or failures. Before downgrading, reverse changes resulting from the use of new features and remove configuration settings that are not supported by the release you are downgrading to.
