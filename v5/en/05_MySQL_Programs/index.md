# Chapter 4 MySQL Programs

**Table of Contents**

[4.1 Overview of MySQL Programs](programs-overview.html)

[4.2 Using MySQL Programs](programs-using.html)
:   [4.2.1 Invoking MySQL Programs](invoking-programs.html)

    [4.2.2 Specifying Program Options](program-options.html)

    [4.2.3 Command Options for Connecting to the Server](connection-options.html)

    [4.2.4 Connecting to the MySQL Server Using Command Options](connecting.html)

    [4.2.5 Connection Transport Protocols](transport-protocols.html)

    [4.2.6 Connection Compression Control](connection-compression-control.html)

    [4.2.7 Setting Environment Variables](setting-environment-variables.html)

[4.3 Server and Server-Startup Programs](programs-server.html)
:   [4.3.1 mysqld — The MySQL Server](mysqld.html)

    [4.3.2 `mysqld_safe` — MySQL Server Startup Script](mysqld-safe.html)

    [4.3.3 mysql.server — MySQL Server Startup Script](mysql-server.html)

    [4.3.4 mysqld\_multi — Manage Multiple MySQL Servers](mysqld-multi.html)

[4.4 Installation-Related Programs](programs-installation.html)
:   [4.4.1 comp\_err — Compile MySQL Error Message File](comp-err.html)

    [4.4.2 mysql\_install\_db — Initialize MySQL Data Directory](mysql-install-db.html)

    [4.4.3 mysql\_plugin — Configure MySQL Server Plugins](mysql-plugin.html)

    [4.4.4 mysql\_secure\_installation — Improve MySQL Installation Security](mysql-secure-installation.html)

    [4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files](mysql-ssl-rsa-setup.html)

    [4.4.6 mysql\_tzinfo\_to\_sql — Load the Time Zone Tables](mysql-tzinfo-to-sql.html)

    [4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables](mysql-upgrade.html)

[4.5 Client Programs](programs-client.html)
:   [4.5.1 mysql — The MySQL Command-Line Client](mysql.html)

    [4.5.2 mysqladmin — A MySQL Server Administration Program](mysqladmin.html)

    [4.5.3 mysqlcheck — A Table Maintenance Program](mysqlcheck.html)

    [4.5.4 mysqldump — A Database Backup Program](mysqldump.html)

    [4.5.5 mysqlimport — A Data Import Program](mysqlimport.html)

    [4.5.6 mysqlpump — A Database Backup Program](mysqlpump.html)

    [4.5.7 mysqlshow — Display Database, Table, and Column Information](mysqlshow.html)

    [4.5.8 mysqlslap — A Load Emulation Client](mysqlslap.html)

[4.6 Administrative and Utility Programs](programs-admin-utils.html)
:   [4.6.1 innochecksum — Offline InnoDB File Checksum Utility](innochecksum.html)

    [4.6.2 myisam\_ftdump — Display Full-Text Index information](myisam-ftdump.html)

    [4.6.3 myisamchk — MyISAM Table-Maintenance Utility](myisamchk.html)

    [4.6.4 myisamlog — Display MyISAM Log File Contents](myisamlog.html)

    [4.6.5 myisampack — Generate Compressed, Read-Only MyISAM Tables](myisampack.html)

    [4.6.6 mysql\_config\_editor — MySQL Configuration Utility](mysql-config-editor.html)

    [4.6.7 mysqlbinlog — Utility for Processing Binary Log Files](mysqlbinlog.html)

    [4.6.8 mysqldumpslow — Summarize Slow Query Log Files](mysqldumpslow.html)

[4.7 Program Development Utilities](programs-development.html)
:   [4.7.1 mysql\_config — Display Options for Compiling Clients](mysql-config.html)

    [4.7.2 my\_print\_defaults — Display Options from Option Files](my-print-defaults.html)

    [4.7.3 resolve\_stack\_dump — Resolve Numeric Stack Trace Dump to Symbols](resolve-stack-dump.html)

[4.8 Miscellaneous Programs](programs-miscellaneous.html)
:   [4.8.1 lz4\_decompress — Decompress mysqlpump LZ4-Compressed Output](lz4-decompress.html)

    [4.8.2 perror — Display MySQL Error Message Information](perror.html)

    [4.8.3 replace — A String-Replacement Utility](replace-utility.html)

    [4.8.4 resolveip — Resolve Host name to IP Address or Vice Versa](resolveip.html)

    [4.8.5 zlib\_decompress — Decompress mysqlpump ZLIB-Compressed Output](zlib-decompress.html)

[4.9 Environment Variables](environment-variables.html)

[4.10 Unix Signal Handling in MySQL](unix-signal-response.html)

This chapter provides a brief overview of the MySQL command-line
programs provided by Oracle Corporation. It also discusses the
general syntax for specifying options when you run these programs.
Most programs have options that are specific to their own operation,
but the option syntax is similar for all of them. Finally, the
chapter provides more detailed descriptions of individual programs,
including which options they recognize.