#### 16.4.1.36 Replication and User Name Length

The maximum length of MySQL user names was increased from 16 characters to 32 characters in MySQL 5.7.8. Replication of user names longer than 16 characters to a replica that supports only shorter user names fails. However, this should occur only when replicating from a newer source to an older replica, which is not a recommended configuration.
