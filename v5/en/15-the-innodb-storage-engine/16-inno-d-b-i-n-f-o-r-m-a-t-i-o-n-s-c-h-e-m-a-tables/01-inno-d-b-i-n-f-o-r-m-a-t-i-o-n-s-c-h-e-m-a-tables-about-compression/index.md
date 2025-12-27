### 14.16.1 InnoDB INFORMATION\_SCHEMA Tables about Compression

14.16.1.1 INNODB\_CMP and INNODB\_CMP\_RESET

14.16.1.2 INNODB\_CMPMEM and INNODB\_CMPMEM\_RESET

14.16.1.3 Using the Compression Information Schema Tables

There are two pairs of `InnoDB` `INFORMATION_SCHEMA` tables about compression that can provide insight into how well compression is working overall:

* `INNODB_CMP` and `INNODB_CMP_RESET` provide information about the number of compression operations and the amount of time spent performing compression.

* `INNODB_CMPMEM` and `INNODB_CMPMEM_RESET` provide information about the way memory is allocated for compression.
