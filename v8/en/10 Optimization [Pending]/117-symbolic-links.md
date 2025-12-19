--- title: MySQL 8.4 Reference Manual :: 10.12.2 Using Symbolic Links url: https://dev.mysql.com/doc/refman/8.4/en/symbolic-links.html order: 117 ---



### 10.12.2 Using Symbolic Links

 10.12.2.1 Using Symbolic Links for Databases on Unix

 10.12.2.2 Using Symbolic Links for MyISAM Tables on Unix

 10.12.2.3 Using Symbolic Links for Databases on Windows

You can move databases or tables from the database directory to other locations and replace them with symbolic links to the new locations. You might want to do this, for example, to move a database to a file system with more free space or increase the speed of your system by spreading your tables to different disks.

For `InnoDB` tables, use the `DATA DIRECTORY` clause of the [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") statement instead of symbolic links, as explained in  Section 17.6.1.2, “Creating Tables Externally”. This new feature is a supported, cross-platform technique.

The recommended way to do this is to symlink entire database directories to a different disk. Symlink `MyISAM` tables only as a last resort.

To determine the location of your data directory, use this statement:

```
SHOW VARIABLES LIKE 'datadir';
```


