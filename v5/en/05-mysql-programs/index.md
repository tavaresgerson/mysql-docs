# Chapter 4 MySQL Programs

**Table of Contents**

4.1 Overview of MySQL Programs

4.2 Using MySQL Programs :   4.2.1 Invoking MySQL Programs

    4.2.2 Specifying Program Options

    4.2.3 Command Options for Connecting to the Server

    4.2.4 Connecting to the MySQL Server Using Command Options

    4.2.5 Connection Transport Protocols

    4.2.6 Connection Compression Control

    4.2.7 Setting Environment Variables

4.3 Server and Server-Startup Programs :   4.3.1 mysqld — The MySQL Server

    4.3.2 mysqld\_safe — MySQL Server Startup Script

    4.3.3 mysql.server — MySQL Server Startup Script

    4.3.4 mysqld\_multi — Manage Multiple MySQL Servers

4.4 Installation-Related Programs :   4.4.1 comp\_err — Compile MySQL Error Message File

    4.4.2 mysql\_install\_db — Initialize MySQL Data Directory

    4.4.3 mysql\_plugin — Configure MySQL Server Plugins

    4.4.4 mysql\_secure\_installation — Improve MySQL Installation Security

    4.4.5 mysql\_ssl\_rsa\_setup — Create SSL/RSA Files

    4.4.6 mysql\_tzinfo\_to\_sql — Load the Time Zone Tables

    4.4.7 mysql\_upgrade — Check and Upgrade MySQL Tables

4.5 Client Programs :   4.5.1 mysql — The MySQL Command-Line Client

    4.5.2 mysqladmin — A MySQL Server Administration Program

    4.5.3 mysqlcheck — A Table Maintenance Program

    4.5.4 mysqldump — A Database Backup Program

    4.5.5 mysqlimport — A Data Import Program

    4.5.6 mysqlpump — A Database Backup Program

    4.5.7 mysqlshow — Display Database, Table, and Column Information

    4.5.8 mysqlslap — A Load Emulation Client

4.6 Administrative and Utility Programs :   4.6.1 innochecksum — Offline InnoDB File Checksum Utility

    4.6.2 myisam\_ftdump — Display Full-Text Index information

    4.6.3 myisamchk — MyISAM Table-Maintenance Utility

    4.6.4 myisamlog — Display MyISAM Log File Contents

    4.6.5 myisampack — Generate Compressed, Read-Only MyISAM Tables

    4.6.6 mysql\_config\_editor — MySQL Configuration Utility

    4.6.7 mysqlbinlog — Utility for Processing Binary Log Files

    4.6.8 mysqldumpslow — Summarize Slow Query Log Files

4.7 Program Development Utilities :   4.7.1 mysql\_config — Display Options for Compiling Clients

    4.7.2 my\_print\_defaults — Display Options from Option Files

    4.7.3 resolve\_stack\_dump — Resolve Numeric Stack Trace Dump to Symbols

4.8 Miscellaneous Programs :   4.8.1 lz4\_decompress — Decompress mysqlpump LZ4-Compressed Output

    4.8.2 perror — Display MySQL Error Message Information

    4.8.3 replace — A String-Replacement Utility

    4.8.4 resolveip — Resolve Host name to IP Address or Vice Versa

    4.8.5 zlib\_decompress — Decompress mysqlpump ZLIB-Compressed Output

4.9 Environment Variables

4.10 Unix Signal Handling in MySQL

This chapter provides a brief overview of the MySQL command-line programs provided by Oracle Corporation. It also discusses the general syntax for specifying options when you run these programs. Most programs have options that are specific to their own operation, but the option syntax is similar for all of them. Finally, the chapter provides more detailed descriptions of individual programs, including which options they recognize.
