# Chapter 6 MySQL Programs

**Table of Contents**

6.1 Overview of MySQL Programs

6.2 Using MySQL Programs :   6.2.1 Invoking MySQL Programs

    6.2.2 Specifying Program Options

    6.2.3 Command Options for Connecting to the Server

    6.2.4 Connecting to the MySQL Server Using Command Options

    6.2.5 Connecting to the Server Using URI-Like Strings or Key-Value Pairs

    6.2.6 Connecting to the Server Using DNS SRV Records

    6.2.7 Connection Transport Protocols

    6.2.8 Connection Compression Control

    6.2.9 Setting Environment Variables

6.3 Server and Server-Startup Programs :   6.3.1 mysqld — The MySQL Server

    6.3.2 mysqld\_safe — MySQL Server Startup Script

    6.3.3 mysql.server — MySQL Server Startup Script

    6.3.4 mysqld\_multi — Manage Multiple MySQL Servers

6.4 Installation-Related Programs :   6.4.1 comp\_err — Compile MySQL Error Message File

    6.4.2 mysql\_secure\_installation — Improve MySQL Installation Security

    6.4.3 mysql\_tzinfo\_to\_sql — Load the Time Zone Tables

6.5 Client Programs :   6.5.1 mysql — The MySQL Command-Line Client

    6.5.2 mysqladmin — A MySQL Server Administration Program

    6.5.3 mysqlcheck — A Table Maintenance Program

    6.5.4 mysqldump — A Database Backup Program

    6.5.5 mysqlimport — A Data Import Program

    6.5.6 mysqlshow — Display Database, Table, and Column Information

    6.5.7 mysqlslap — A Load Emulation Client

    6.5.8 mysqldm — The MySQL Diagnostic Monitor

6.6 Administrative and Utility Programs :   6.6.1 ibd2sdi — InnoDB Tablespace SDI Extraction Utility

    6.6.2 innochecksum — Offline InnoDB File Checksum Utility

    6.6.3 myisam\_ftdump — Display Full-Text Index information

    6.6.4 myisamchk — MyISAM Table-Maintenance Utility

    6.6.5 myisamlog — Display MyISAM Log File Contents

    6.6.6 myisampack — Generate Compressed, Read-Only MyISAM Tables

    6.6.7 mysql\_config\_editor — MySQL Configuration Utility

    6.6.8 mysql\_migrate\_keyring — Keyring Key Migration Utility

    6.6.9 mysqlbinlog — Utility for Processing Binary Log Files

    6.6.10 mysqldumpslow — Summarize Slow Query Log Files

6.7 Program Development Utilities :   6.7.1 mysql\_config — Display Options for Compiling Clients

    6.7.2 my\_print\_defaults — Display Options from Option Files

6.8 Miscellaneous Programs :   6.8.1 perror — Display MySQL Error Message Information

6.9 Environment Variables

6.10 Unix Signal Handling in MySQL

This chapter provides a brief overview of the MySQL command-line programs provided by Oracle Corporation. It also discusses the general syntax for specifying options when you run these programs. Most programs have options that are specific to their own operation, but the option syntax is similar for all of them. Finally, the chapter provides more detailed descriptions of individual programs, including which options they recognize.
