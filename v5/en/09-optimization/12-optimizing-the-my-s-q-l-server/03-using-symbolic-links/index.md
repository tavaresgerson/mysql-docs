### 8.12.3 Using Symbolic Links

8.12.3.1 Using Symbolic Links for Databases on Unix

8.12.3.2 Using Symbolic Links for MyISAM Tables on Unix

8.12.3.3 Using Symbolic Links for Databases on Windows

You can move databases or tables from the database directory to other locations and replace them with symbolic links to the new locations. You might want to do this, for example, to move a database to a file system with more free space or increase the speed of your system by spreading your tables to different disks.

For `InnoDB` tables, use the `DATA DIRECTORY` clause of the `CREATE TABLE` statement instead of symbolic links, as explained in Section 14.6.1.2, “Creating Tables Externally”. This new feature is a supported, cross-platform technique.

The recommended way to do this is to symlink entire database directories to a different disk. Symlink `MyISAM` tables only as a last resort.

To determine the location of your data directory, use this statement:

```sql
SHOW VARIABLES LIKE 'datadir';
```
