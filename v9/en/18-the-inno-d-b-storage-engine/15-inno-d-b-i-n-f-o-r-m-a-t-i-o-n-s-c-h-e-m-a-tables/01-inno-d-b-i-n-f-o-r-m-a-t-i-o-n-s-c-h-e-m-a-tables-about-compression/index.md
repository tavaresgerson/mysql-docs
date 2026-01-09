### 17.15.1 InnoDB INFORMATION_SCHEMA Tables about Compression

17.15.1.1 INNODB_CMP and INNODB_CMP_RESET

17.15.1.2 INNODB_CMPMEM and INNODB_CMPMEM_RESET

17.15.1.3 Using the Compression Information Schema Tables

There are two pairs of `InnoDB` `INFORMATION_SCHEMA` tables about compression that can provide insight into how well compression is working overall:

* `INNODB_CMP` and `INNODB_CMP_RESET` provide information about the number of compression operations and the amount of time spent performing compression.

* `INNODB_CMPMEM` and `INNODB_CMPMEM_RESET` provide information about the way memory is allocated for compression.
