#### 16.4.1.3 Replication and Character Sets

The following applies to replication between MySQL servers that use different character sets:

* If the source has databases with a character set different from the global [`character_set_server`](server-system-variables.html#sysvar_character_set_server) value, you should design your [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statements so that they do not implicitly rely on the database default character set. A good workaround is to state the character set and collation explicitly in [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statements.
