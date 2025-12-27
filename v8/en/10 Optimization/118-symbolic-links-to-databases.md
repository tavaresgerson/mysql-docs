#### 10.12.2.1 Using Symbolic Links for Databases on Unix

On Unix, symlink a database using this procedure:

1. Create the database using `CREATE DATABASE`:

   ```
   mysql> CREATE DATABASE mydb1;
   ```

   Using  `CREATE DATABASE` creates the database in the MySQL data directory and permits the server to update the data dictionary with information about the database directory.
2. Stop the server to ensure that no activity occurs in the new database while it is being moved.
3. Move the database directory to some disk where you have free space. For example, use `tar` or `mv`. If you use a method that copies rather than moves the database directory, remove the original database directory after copying it.
4. Create a soft link in the data directory to the moved database directory:

   ```
   $> ln -s /path/to/mydb1 /path/to/datadir
   ```

   The command creates a symlink named `mydb1` in the data directory.
5. Restart the server.

