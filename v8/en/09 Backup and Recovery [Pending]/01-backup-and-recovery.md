--- title: MySQL 8.4 Reference Manual :: 9 Backup and Recovery url: https://dev.mysql.com/doc/refman/8.4/en/backup-and-recovery.html order: 1 ---



# Chapter 9 Backup and Recovery

**Table of Contents**

 9.1 Backup and Recovery Types

 9.2 Database Backup Methods

 9.3 Example Backup and Recovery Strategy :    9.3.1 Establishing a Backup Policy

     9.3.2 Using Backups for Recovery

     9.3.3 Backup Strategy Summary

 9.4 Using mysqldump for Backups :    9.4.1 Dumping Data in SQL Format with mysqldump

     9.4.2 Reloading SQL-Format Backups

     9.4.3 Dumping Data in Delimited-Text Format with mysqldump

     9.4.4 Reloading Delimited-Text Format Backups

     9.4.5 mysqldump Tips

 9.5 Point-in-Time (Incremental) Recovery :    9.5.1 Point-in-Time Recovery Using Binary Log

     9.5.2 Point-in-Time Recovery Using Event Positions

 9.6 MyISAM Table Maintenance and Crash Recovery :    9.6.1 Using myisamchk for Crash Recovery

     9.6.2 How to Check MyISAM Tables for Errors

     9.6.3 How to Repair MyISAM Tables

     9.6.4 MyISAM Table Optimization

     9.6.5 Setting Up a MyISAM Table Maintenance Schedule

It is important to back up your databases so that you can recover your data and be up and running again in case problems occur, such as system crashes, hardware failures, or users deleting data by mistake. Backups are also essential as a safeguard before upgrading a MySQL installation, and they can be used to transfer a MySQL installation to another system or to set up replica servers.

MySQL offers a variety of backup strategies from which you can choose the methods that best suit the requirements for your installation. This chapter discusses several backup and recovery topics with which you should be familiar:

* Types of backups: Logical versus physical, full versus incremental, and so forth.
* Methods for creating backups.
* Recovery methods, including point-in-time recovery.
* Backup scheduling, compression, and encryption.
* Table maintenance, to enable recovery of corrupt tables.

## Additional Resources

Resources related to backup or to maintaining data availability include the following:

* Customers of MySQL Enterprise Edition can use the MySQL Enterprise Backup product for backups. For an overview of the MySQL Enterprise Backup product, see Section 32.1, “MySQL Enterprise Backup Overview”.
* A forum dedicated to backup issues is available at <https://forums.mysql.com/list.php?28>.
* Details for  **mysqldump** can be found in Chapter 6, *MySQL Programs*.
* The syntax of the SQL statements described here is given in Chapter 15, *SQL Statements*.
* For additional information about `InnoDB` backup procedures, see  Section 17.18.1, “InnoDB Backup”.
* Replication enables you to maintain identical data on multiple servers. This has several benefits, such as enabling client query load to be distributed over servers, availability of data even if a given server is taken offline or fails, and the ability to make backups with no impact on the source by using a replica. See  Chapter 19, *Replication*.
* MySQL InnoDB Cluster is a collection of products that work together to provide a high availability solution. A group of MySQL servers can be configured to create a cluster using MySQL Shell. The cluster of servers has a single source, called the primary, which acts as the read-write source. Multiple secondary servers are replicas of the source. A minimum of three servers are required to create a high availability cluster. A client application is connected to the primary via MySQL Router. If the primary fails, a secondary is automatically promoted to the role of primary, and MySQL Router routes requests to the new primary.
* NDB Cluster provides a high-availability, high-redundancy version of MySQL adapted for the distributed computing environment. See  Chapter 25, *MySQL NDB Cluster 8.4*, which provides information about MySQL NDB Cluster 8.4.7.

