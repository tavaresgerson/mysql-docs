# Chapter 6 MySQL Programs

**Table of Contents**

:   [6.2.1 Invoking MySQL Programs](invoking-programs.html)

    [6.2.2 Specifying Program Options](program-options.html)

    [6.2.3 Command Options for Connecting to the Server](connection-options.html)

    [6.2.4 Connecting to the MySQL Server Using Command Options](connecting.html)

    [6.2.5 Connecting to the Server Using URI-Like Strings or Key-Value Pairs](connecting-using-uri-or-key-value-pairs.html)

    [6.2.6 Connecting to the Server Using DNS SRV Records](connecting-using-dns-srv.html)

    [6.2.7 Connection Transport Protocols](transport-protocols.html)

    [6.2.8 Connection Compression Control](connection-compression-control.html)

    [6.2.9 Setting Environment Variables](setting-environment-variables.html)

:   [6.3.1 mysqld — The MySQL Server](mysqld.html)

    [6.3.2 mysqld\_safe — MySQL Server Startup Script](mysqld-safe.html)

    [6.3.3 mysql.server — MySQL Server Startup Script](mysql-server.html)

    [6.3.4 mysqld\_multi — Manage Multiple MySQL Servers](mysqld-multi.html)

:   [6.4.1 comp\_err — Compile MySQL Error Message File](comp-err.html)

    [6.4.2 mysql\_secure\_installation — Improve MySQL Installation Security](mysql-secure-installation.html)

    [6.4.3 mysql\_tzinfo\_to\_sql — Load the Time Zone Tables](mysql-tzinfo-to-sql.html)

:   [6.5.1 mysql — The MySQL Command-Line Client](mysql.html)

    [6.5.2 mysqladmin — A MySQL Server Administration Program](mysqladmin.html)

    [6.5.3 mysqlcheck — A Table Maintenance Program](mysqlcheck.html)

    [6.5.4 mysqldump — A Database Backup Program](mysqldump.html)

    [6.5.5 mysqlimport — A Data Import Program](mysqlimport.html)

    [6.5.6 mysqlshow — Display Database, Table, and Column Information](mysqlshow.html)

    [6.5.7 mysqlslap — A Load Emulation Client](mysqlslap.html)

    [6.5.8 mysqldm — The MySQL Diagnostic Monitor](mysqldm.html)

:   [6.6.1 ibd2sdi — InnoDB Tablespace SDI Extraction Utility](ibd2sdi.html)

    [6.6.2 innochecksum — Offline InnoDB File Checksum Utility](innochecksum.html)

    [6.6.3 myisam\_ftdump — Display Full-Text Index information](myisam-ftdump.html)

    [6.6.4 myisamchk — MyISAM Table-Maintenance Utility](myisamchk.html)

    [6.6.5 myisamlog — Display MyISAM Log File Contents](myisamlog.html)

    [6.6.6 myisampack — Generate Compressed, Read-Only MyISAM Tables](myisampack.html)

    [6.6.7 mysql\_config\_editor — MySQL Configuration Utility](mysql-config-editor.html)

    [6.6.8 mysql\_migrate\_keyring — Keyring Key Migration Utility](mysql-migrate-keyring.html)

    [6.6.9 mysqlbinlog — Utility for Processing Binary Log Files](mysqlbinlog.html)

    [6.6.10 mysqldumpslow — Summarize Slow Query Log Files](mysqldumpslow.html)

:   [6.7.1 mysql\_config — Display Options for Compiling Clients](mysql-config.html)

    [6.7.2 my\_print\_defaults — Display Options from Option Files](my-print-defaults.html)

:   [6.8.1 perror — Display MySQL Error Message Information](perror.html)

This chapter provides a brief overview of the MySQL command-line
programs provided by Oracle Corporation. It also discusses the
general syntax for specifying options when you run these programs.
Most programs have options that are specific to their own operation,
but the option syntax is similar for all of them. Finally, the
chapter provides more detailed descriptions of individual programs,
including which options they recognize.