#### 14.16.1.2 INNODB\_CMPMEM and INNODB\_CMPMEM\_RESET

The [`INNODB_CMPMEM`](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables") and
[`INNODB_CMPMEM_RESET`](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables") tables provide
status information about compressed pages that reside in the
buffer pool. Please consult [Section 14.9, “InnoDB Table and Page Compression”](innodb-compression.html "14.9 InnoDB Table and Page Compression")
for further information on compressed tables and the use of the
buffer pool. The [`INNODB_CMP`](information-schema-innodb-cmp-table.html "24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables") and
[`INNODB_CMP_RESET`](information-schema-innodb-cmp-table.html "24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables") tables should
provide more useful statistics on compression.

##### Internal Details

`InnoDB` uses a
[buddy allocator](glossary.html#glos_buddy_allocator "buddy allocator")
system to manage memory allocated to
[pages of various sizes](glossary.html#glos_page_size "page size"),
from 1KB to 16KB. Each row of the two tables described here
corresponds to a single page size.

The [`INNODB_CMPMEM`](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables") and
[`INNODB_CMPMEM_RESET`](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables") tables have
identical contents, but reading from
[`INNODB_CMPMEM_RESET`](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables") resets the
statistics on relocation operations. For example, if every 60
minutes you archived the output of
[`INNODB_CMPMEM_RESET`](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables"), it would show
the hourly statistics. If you never read
[`INNODB_CMPMEM_RESET`](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables") and monitored
the output of [`INNODB_CMPMEM`](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables")
instead, it would show the cumulative statistics since
`InnoDB` was started.

For the table definition, see
[Section 24.4.6, “The INFORMATION\_SCHEMA INNODB\_CMPMEM and INNODB\_CMPMEM\_RESET Tables”](information-schema-innodb-cmpmem-table.html "24.4.6 The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables").