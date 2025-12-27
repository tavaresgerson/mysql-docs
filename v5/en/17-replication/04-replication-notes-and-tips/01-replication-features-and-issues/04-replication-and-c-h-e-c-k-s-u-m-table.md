#### 16.4.1.4 Replication and CHECKSUM TABLE

[`CHECKSUM TABLE`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") returns a checksum that is calculated row by row, using a method that depends on the table row storage format. The storage format is not guaranteed to remain the same between MySQL versions, so the checksum value might change following an upgrade.
