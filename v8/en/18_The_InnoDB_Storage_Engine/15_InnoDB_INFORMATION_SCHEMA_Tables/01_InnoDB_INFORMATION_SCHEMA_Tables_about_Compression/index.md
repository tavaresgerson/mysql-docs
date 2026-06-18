### 17.15.1 InnoDB INFORMATION\_SCHEMA Tables about Compression

[17.15.1.1 INNODB\_CMP and INNODB\_CMP\_RESET](innodb-information-schema-innodb_cmp.html)

[17.15.1.2 INNODB\_CMPMEM and INNODB\_CMPMEM\_RESET](innodb-information-schema-innodb_cmpmem.html)

[17.15.1.3 Using the Compression Information Schema Tables](innodb-information-schema-examples-compression-sect.html)

There are two pairs of `InnoDB`
`INFORMATION_SCHEMA` tables about compression
that can provide insight into how well compression is working
overall:

* [`INNODB_CMP`](information-schema-innodb-cmp-table.html "28.4.6 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables") and
  [`INNODB_CMP_RESET`](information-schema-innodb-cmp-table.html "28.4.6 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables") provide
  information about the number of compression operations and the
  amount of time spent performing compression.

* [`INNODB_CMPMEM`](information-schema-innodb-cmpmem-table.html "28.4.7 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables") and
  [`INNODB_CMPMEM_RESET`](information-schema-innodb-cmpmem-table.html "28.4.7 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables") provide
  information about the way memory is allocated for compression.