### 25.2.4 What is New in MySQL NDB Cluster 9.5

The following sections describe changes in the implementation of MySQL NDB Cluster in NDB Cluster 9.5.0, as compared to earlier release series. NDB Cluster 9.5 is available as a Development release for preview and testing of new features currently under development. For production, please use NDB 8.4; for more information, see MySQL NDB Cluster 8.4. NDB Cluster 8.0 and 7.6 are previous GA releases which are still supported in production, although we recommend that new deployments for production use MySQL NDB Cluster 8.4.

#### What is New in NDB Cluster 9.5

Major changes and new features in NDB Cluster 9.5 which are likely to be of interest are listed here:

* **Ndb.cfg support removed.** Use of an `Ndb.cfg` configuration file in an `NDB` executable's startup directory was deprecated in MySQL 9.1, and is no longer supported as of NDB 9.5.0; such files are no longer read by any NDB Cluster executable.

  See Section 25.4.3.3, “NDB Cluster Connection Strings”, for more information.

MySQL Cluster Manager has an advanced command-line interface that can simplify many complex NDB Cluster management tasks. See MySQL Cluster Manager 9.5.0 User Manual, for more information.
