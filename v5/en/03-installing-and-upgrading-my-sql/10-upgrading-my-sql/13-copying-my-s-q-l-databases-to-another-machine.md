### 2.10.13 Copying MySQL Databases to Another Machine

In cases where you need to transfer databases between different architectures, you can use **mysqldump** to create a file containing SQL statements. You can then transfer the file to the other machine and feed it as input to the **mysql** client.

Use **mysqldump --help** to see what options are available.

The easiest (although not the fastest) way to move a database between two machines is to run the following commands on the machine on which the database is located:

```sql
mysqladmin -h 'other_hostname' create db_name
mysqldump db_name | mysql -h 'other_hostname' db_name
```

If you want to copy a database from a remote machine over a slow network, you can use these commands:

```sql
mysqladmin create db_name
mysqldump -h 'other_hostname' --compress db_name | mysql db_name
```

You can also store the dump in a file, transfer the file to the target machine, and then load the file into the database there. For example, you can dump a database to a compressed file on the source machine like this:

```sql
mysqldump --quick db_name | gzip > db_name.gz
```

Transfer the file containing the database contents to the target machine and run these commands there:

```sql
mysqladmin create db_name
gunzip < db_name.gz | mysql db_name
```

You can also use **mysqldump** and **mysqlimport** to transfer the database. For large tables, this is much faster than simply using **mysqldump**. In the following commands, *`DUMPDIR`* represents the full path name of the directory you use to store the output from **mysqldump**.

First, create the directory for the output files and dump the database:

```sql
mkdir DUMPDIR
mysqldump --tab=DUMPDIR db_name
```

Then transfer the files in the *`DUMPDIR`* directory to some corresponding directory on the target machine and load the files into MySQL there:

```sql
mysqladmin create db_name           # create database
cat DUMPDIR/*.sql | mysql db_name   # create tables in database
mysqlimport db_name DUMPDIR/*.txt   # load data into tables
```

Do not forget to copy the `mysql` database because that is where the grant tables are stored. You might have to run commands as the MySQL `root` user on the new machine until you have the `mysql` database in place.

After you import the `mysql` database on the new machine, execute **mysqladmin flush-privileges** so that the server reloads the grant table information.

Note

You can copy the `.frm`, `.MYI`, and `.MYD` files for `MyISAM` tables between different architectures that support the same floating-point format. (MySQL takes care of any byte-swapping issues.) See Section 15.2, “The MyISAM Storage Engine”.
