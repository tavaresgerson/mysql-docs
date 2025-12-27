#### 8.12.3.3 Using Symbolic Links for Databases on Windows

On Windows, symbolic links can be used for database directories. This enables you to put a database directory at a different location (for example, on a different disk) by setting up a symbolic link to it. Use of database symlinks on Windows is similar to their use on Unix, although the procedure for setting up the link differs.

Suppose that you want to place the database directory for a database named `mydb` at `D:\data\mydb`. To do this, create a symbolic link in the MySQL data directory that points to `D:\data\mydb`. However, before creating the symbolic link, make sure that the `D:\data\mydb` directory exists by creating it if necessary. If you already have a database directory named `mydb` in the data directory, move it to `D:\data`. Otherwise, the symbolic link is ineffective. To avoid problems, make sure that the server is not running when you move the database directory.

On Windows, you can create a symlink using the **mklink** command. This command requires administrative privileges.

1. Make sure that the desired path to the database exists. For this example, we use `D:\data\mydb`, and a database named `mydb`.

2. If the database does not already exist, issue `CREATE DATABASE mydb` in the **mysql** client to create it.

3. Stop the MySQL service.
4. Using Windows Explorer or the command line, move the directory `mydb` from the data directory to `D:\data`, replacing the directory of the same name.

5. If you are not already using the command prompt, open it, and change location to the data directory, like this:

   ```sql
   C:\> cd \path\to\datadir
   ```

   If your MySQL installation is in the default location, you can use this:

   ```sql
   C:\> cd C:\ProgramData\MySQL\MySQL Server 5.7\Data
   ```

6. In the data directory, create a symlink named `mydb` that points to the location of the database directory:

   ```sql
   C:\> mklink /d mydb D:\data\mydb
   ```

7. Start the MySQL service.

After this, all tables created in the database `mydb` are created in `D:\data\mydb`.

Alternatively, on any version of Windows supported by MySQL, you can create a symbolic link to a MySQL database by creating a `.sym` file in the data directory that contains the path to the destination directory. The file should be named `db_name.sym`, where *`db_name`* is the database name.

Support for database symbolic links on Windows using `.sym` files is enabled by default. If you do not need `.sym` file symbolic links, you can disable support for them by starting **mysqld** with the `--skip-symbolic-links` option. To determine whether your system supports `.sym` file symbolic links, check the value of the `have_symlink` system variable using this statement:

```sql
SHOW VARIABLES LIKE 'have_symlink';
```

To create a `.sym` file symlink, use this procedure:

1. Change location into the data directory:

   ```sql
   C:\> cd \path\to\datadir
   ```

2. In the data directory, create a text file named `mydb.sym` that contains this path name: `D:\data\mydb\`

   Note

   The path name to the new database and tables should be absolute. If you specify a relative path, the location is relative to the `mydb.sym` file.

After this, all tables created in the database `mydb` are created in `D:\data\mydb`.

Note

Because support for `.sym` files is redundant with native symlink support available using **mklink**, use of `.sym` files is deprecated; expect support for them to be removed in a future MySQL release.

The following limitations apply to the use of `.sym` files for database symbolic linking on Windows. These limitations do not apply for symlinks created using **mklink**.

* The symbolic link is not used if a directory with the same name as the database exists in the MySQL data directory.

* The `--innodb_file_per_table` option cannot be used.

* If you run **mysqld** as a service, you cannot use a mapped drive to a remote server as the destination of the symbolic link. As a workaround, you can use the full path (`\\servername\path\`).
