## 3.3 Upgrade Best Practices

MySQL supports upgrading between minor versions (within an LTS series) and to the next major version (across an LTS series). Upgrading provides the latest features, performance, and security fixes.

To prepare and help ensure that your upgrade to the latest MySQL release is successful, we recommend the following best practices:

*  Decide on Major or Minor Version for Upgrade
*  Decide on Upgrade Type
*  Review Supported Platforms
*  Understand MySQL Server Changes
*  Run Upgrade Checker and Fix Incompatibilities
*  Run Applications in a Test Environment
*  Benchmark Applications and Workload Performance
*  Run Both MySQL Versions in Parallel
*  Run Final Test Upgrade
*  Check MySQL Backup
*  Upgrade Production Server
*  Enterprise Support

### Decide on Major or Minor Version for Upgrade

The MySQL Release Model makes a distinction between LTS (Long Term Support) and Innovation Releases. LTS releases have 8+ years of support and are meant for production use. Innovation Releases provide users with the latest features and capabilities. Learn more about the MySQL Release Model.

Performing a minor version upgrade is straightforward while major version upgrades require strategic planning and additional testing before the upgrade. This guide is especially useful for major version upgrades.

### Decide on Upgrade Type

There are three main ways to upgrade MySQL; read the associated documentation to determine which type of upgrade is best suited for your situation.

* An in-place upgrade: replacing the MySQL Server packages.
* A logical upgrade: exporting SQL from the old MySQL instance to the new.
* A replication topology upgrade: account for each server's topology role.

### Review Supported Platforms

If your current operating system is not supported by the new version of MySQL, then plan to upgrade the operating system as otherwise an in-place upgrade is not supported.

For a current list of supported platforms, see: <https://www.mysql.com/support/supportedplatforms/database.html>

### Understand MySQL Server Changes

Each major version comes with new features, changes in behavior, deprecations, and removals. It is important to understand the impact of each of these to existing applications.

See:  Section 3.5, “Changes in MySQL 8.4”.

### Run Upgrade Checker and Fix Incompatibilities

MySQL Shell's  Upgrade Checker Utility detects incompatibilities between database versions that must be addressed before performing the upgrade. The `util.checkForServerUpgrade()` function verifies that MySQL server instances are ready to upgrade. Connect to the existing MySQL server and select the MySQL Server version you plan to upgrade to for the utility to report issues to address prior to an upgrade. These include incompatibilities in data types, storage engines, and so on.

You are ready to upgrade when the upgrade checking utility no longer reports any issues.

### Run Applications in a Test Environment

After completing the upgrade checker's requirements, next test your applications on the new target MySQL server. Check for errors and warnings in the MySQL error log and application logs.

### Benchmark Applications and Workload Performance

We recommend benchmarking your own applications and workloads by comparing how they perform using the previous and new versions of MySQL. Usually, newer MySQL versions add features and improve performance but there are cases where an upgrade might run slower for specific queries. Possible issues resulting in performance regressions:

* Prior server configuration is not optimal for newer version
* Changes to data types
* Additional storage required by Multi-byte character set support
* Storage engines changes
* Dropped or changed indexes
* Stronger encryption
* Stronger authentication
* SQL optimizer changes
* Newer version of MySQL require additional memory
* Physical or Virtual Hardware is slower - compute or storage

For related information and potential mitigation techniques, see Valid Performance Regressions.

### Run Both MySQL Versions in Parallel

To minimize risk, it is best keep the current system running while running the upgraded system in parallel.

### Run Final Test Upgrade

Practice and do a run though prior to upgrading your production server. Thoroughly test the upgrade procedures before upgrading a production system.

### Check MySQL Backup

Check that the full backup exists and is viable before performing the upgrade.

### Upgrade Production Server

You are ready to complete the upgrade.

### Enterprise Support

If you're a MySQL Enterprise Edition customer, you can also contact the MySQL Support Team experts with any questions you may have.
