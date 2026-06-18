#### 14.16.1.1 INNODB\_CMP and INNODB\_CMP\_RESET

The [`INNODB_CMP`](information-schema-innodb-cmp-table.html "24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables") and
[`INNODB_CMP_RESET`](information-schema-innodb-cmp-table.html "24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables") tables provide
status information about operations related to compressed
tables, which are described in
[Section 14.9, “InnoDB Table and Page Compression”](innodb-compression.html "14.9 InnoDB Table and Page Compression"). The
`PAGE_SIZE` column reports the compressed
[page size](glossary.html#glos_page_size "page size").

These two tables have identical contents, but reading from
[`INNODB_CMP_RESET`](information-schema-innodb-cmp-table.html "24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables") resets the
statistics on compression and uncompression operations. For
example, if you archive the output of
[`INNODB_CMP_RESET`](information-schema-innodb-cmp-table.html "24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables") every 60 minutes,
you see the statistics for each hourly period. If you monitor
the output of [`INNODB_CMP`](information-schema-innodb-cmp-table.html "24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables") (making
sure never to read
[`INNODB_CMP_RESET`](information-schema-innodb-cmp-table.html "24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables")), you see the
cumulative statistics since InnoDB was started.

For the table definition, see
[Section 24.4.5, “The INFORMATION\_SCHEMA INNODB\_CMP and INNODB\_CMP\_RESET Tables”](information-schema-innodb-cmp-table.html "24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables").