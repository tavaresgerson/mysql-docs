#### 17.20.6.1 Adapting an Existing MySQL Schema for the InnoDB memcached Plugin

Consider these aspects of **memcached** applications when adapting an existing MySQL schema or application to use the `daemon_memcached` plugin:

* **memcached** keys cannot contain spaces or newlines, because these characters are used as separators in the ASCII protocol. If you are using lookup values that contain spaces, transform or hash them into values without spaces before using them as keys in calls to `add()`, `set()`, `get()`, and so on. Although theoretically these characters are allowed in keys in programs that use the binary protocol, you should restrict the characters used in keys to ensure compatibility with a broad range of clients.

* If there is a short numeric primary key column in an `InnoDB` table, use it as the unique lookup key for **memcached** by converting the integer to a string value. If the **memcached** server is used for multiple applications, or with more than one `InnoDB` table, consider modifying the name to ensure that it is unique. For example, prepend the table name, or the database name and the table name, before the numeric value.

  Note

  The `daemon_memcached` plugin supports inserts and reads on mapped `InnoDB` tables that have an `INTEGER` defined as the primary key.

* You cannot use a partitioned table for data queried or stored using **memcached**.

* The **memcached** protocol passes numeric values around as strings. To store numeric values in the underlying `InnoDB` table, to implement counters that can be used in SQL functions such as `SUM()` or `AVG()`, for example:

  + Use `VARCHAR` columns with enough characters to hold all the digits of the largest expected number (and additional characters if appropriate for the negative sign, decimal point, or both).

  + In any query that performs arithmetic using column values, use the `CAST()` function to convert the values from string to integer, or to some other numeric type. For example:

    ```
    # Alphabetic entries are returned as zero.

    SELECT CAST(c2 as unsigned integer) FROM demo_test;

    # Since there could be numeric values of 0, can't disqualify them.
    # Test the string values to find the ones that are integers, and average only those.

    SELECT AVG(cast(c2 as unsigned integer)) FROM demo_test
      WHERE c2 BETWEEN '0' and '9999999999';

    # Views let you hide the complexity of queries. The results are already converted;
    # no need to repeat conversion functions and WHERE clauses each time.

    CREATE VIEW numbers AS SELECT c1 KEY, CAST(c2 AS UNSIGNED INTEGER) val
      FROM demo_test WHERE c2 BETWEEN '0' and '9999999999';
    SELECT SUM(val) FROM numbers;
    ```

    Note

    Any alphabetic values in the result set are converted into 0 by the call to `CAST()`. When using functions such as `AVG()`, which depend on the number of rows in the result set, include `WHERE` clauses to filter out non-numeric values.

* If the `InnoDB` column used as a key could have values longer than 250 bytes, hash the value to less than 250 bytes.

* To use an existing table with the `daemon_memcached` plugin, define an entry for it in the `innodb_memcache.containers` table. To make that table the default for all **memcached** requests, specify a value of `default` in the `name` column, then restart the MySQL server to make the change take effect. If you use multiple tables for different classes of **memcached** data, set up multiple entries in the `innodb_memcache.containers` table with `name` values of your choice, then issue a **memcached** request in the form of `get @@name` or `set @@name` within the application to specify the table to be used for subsequent **memcached** requests.

  For an example of using a table other than the predefined `test.demo_test` table, see Example 17.13, “Using Your Own Table with an InnoDB memcached Application”. For the required table layout, see Section 17.20.8, “InnoDB memcached Plugin Internals”.

* To use multiple `InnoDB` table column values with **memcached** key-value pairs, specify column names separated by comma, semicolon, space, or pipe characters in the `value_columns` field of the `innodb_memcache.containers` entry for the `InnoDB` table. For example, specify `col1,col2,col3` or `col1|col2|col3` in the `value_columns` field.

  Concatenate the column values into a single string using the pipe character as a separator before passing the string to **memcached** `add` or `set` calls. The string is unpacked automatically into the correct column. Each `get` call returns a single string containing the column values that is also delimited by the pipe character. You can unpack the values using the appropriate application language syntax.

**Example 17.13 Using Your Own Table with an InnoDB memcached Application**

This example shows how to use your own table with a sample Python application that uses `memcached` for data manipulation.

The example assumes that the `daemon_memcached` plugin is installed as described in Section 17.20.3, “Setting Up the InnoDB memcached Plugin”. It also assumes that your system is configured to run a Python script that uses the `python-memcache` module.

1. Create the `multicol` table which stores country information including population, area, and driver side data (`'R'` for right and `'L'` for left).

   ```
   mysql> USE test;

   mysql> CREATE TABLE `multicol` (
           `country` varchar(128) NOT NULL DEFAULT '',
           `population` varchar(10) DEFAULT NULL,
           `area_sq_km` varchar(9) DEFAULT NULL,
           `drive_side` varchar(1) DEFAULT NULL,
           `c3` int(11) DEFAULT NULL,
           `c4` bigint(20) unsigned DEFAULT NULL,
           `c5` int(11) DEFAULT NULL,
           PRIMARY KEY (`country`)
           ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
   ```

2. Insert a record into the `innodb_memcache.containers` table so that the `daemon_memcached` plugin can access the `multicol` table.

   ```
   mysql> INSERT INTO innodb_memcache.containers
          (name,db_schema,db_table,key_columns,value_columns,flags,cas_column,
          expire_time_column,unique_idx_name_on_key)
          VALUES
          ('bbb','test','multicol','country','population,area_sq_km,drive_side',
          'c3','c4','c5','PRIMARY');

   mysql> COMMIT;
   ```

   * The `innodb_memcache.containers` record for the `multicol` table specifies a `name` value of `'bbb'`, which is the table identifier.

     Note

     If a single `InnoDB` table is used for all **memcached** applications, the `name` value can be set to `default` to avoid using `@@` notation to switch tables.

   * The `db_schema` column is set to `test`, which is the name of the database where the `multicol` table resides.

   * The `db_table` column is set to `multicol`, which is the name of the `InnoDB` table.

   * `key_columns` is set to the unique `country` column. The `country` column is defined as the primary key in the `multicol` table definition.

   * Rather than a single `InnoDB` table column to hold a composite data value, data is divided among three table columns (`population`, `area_sq_km`, and `drive_side`). To accommodate multiple value columns, a comma-separated list of columns is specified in the `value_columns` field. The columns defined in the `value_columns` field are the columns used when storing or retrieving values.

   * Values for the `flags`, `expire_time`, and `cas_column` fields are based on values used in the `demo.test` sample table. These fields are typically not significant in applications that use the `daemon_memcached` plugin because MySQL keeps data synchronized, and there is no need to worry about data expiring or becoming stale.

   * The `unique_idx_name_on_key` field is set to `PRIMARY`, which refers to the primary index defined on the unique `country` column in the `multicol` table.

3. Copy the sample Python application into a file. In this example, the sample script is copied to a file named `multicol.py`.

   The sample Python application inserts data into the `multicol` table and retrieves data for all keys, demonstrating how to access an `InnoDB` table through the `daemon_memcached` plugin.

   ```
   import sys, os
   import memcache

   def connect_to_memcached():
     memc = memcache.Client(['127.0.0.1:11211'], debug=0);
     print "Connected to memcached."
     return memc

   def banner(message):
     print
     print "=" * len(message)
     print message
     print "=" * len(message)

   country_data = [
   ("Canada","34820000","9984670","R"),
   ("USA","314242000","9826675","R"),
   ("Ireland","6399152","84421","L"),
   ("UK","62262000","243610","L"),
   ("Mexico","113910608","1972550","R"),
   ("Denmark","5543453","43094","R"),
   ("Norway","5002942","385252","R"),
   ("UAE","8264070","83600","R"),
   ("India","1210193422","3287263","L"),
   ("China","1347350000","9640821","R"),
   ]

   def switch_table(memc,table):
     key = "@@" + table
     print "Switching default table to '" + table + "' by issuing GET for '" + key + "'."
     result = memc.get(key)

   def insert_country_data(memc):
     banner("Inserting initial data via memcached interface")
     for item in country_data:
       country = item[0]
       population = item[1]
       area = item[2]
       drive_side = item[3]

       key = country
       value = "|".join([population,area,drive_side])
       print "Key = " + key
       print "Value = " + value

       if memc.add(key,value):
         print "Added new key, value pair."
       else:
         print "Updating value for existing key."
         memc.set(key,value)

   def query_country_data(memc):
     banner("Retrieving data for all keys (country names)")
     for item in country_data:
       key = item[0]
       result = memc.get(key)
       print "Here is the result retrieved from the database for key " + key + ":"
       print result
       (m_population, m_area, m_drive_side) = result.split("|")
       print "Unpacked population value: " + m_population
       print "Unpacked area value      : " + m_area
       print "Unpacked drive side value: " + m_drive_side

   if __name__ == '__main__':

     memc = connect_to_memcached()
     switch_table(memc,"bbb")
     insert_country_data(memc)
     query_country_data(memc)

     sys.exit(0)
   ```

   Sample Python application notes:

   * No database authorization is required to run the application, since data manipulation is performed through the **memcached** interface. The only required information is the port number on the local system where the **memcached** daemon listens.

   * To make sure the application uses the `multicol` table, the `switch_table()` function is called, which performs a dummy `get` or `set` request using `@@` notation. The `name` value in the request is `bbb`, which is the `multicol` table identifier defined in the `innodb_memcache.containers.name` field.

     A more descriptive `name` value might be used in a real-world application. This example simply illustrates that a table identifier is specified rather than the table name in `get @@...` requests.

   * The utility functions used to insert and query data demonstrate how to turn a Python data structure into pipe-separated values for sending data to MySQL with `add` or `set` requests, and how to unpack the pipe-separated values returned by `get` requests. This extra processing is only required when mapping a single **memcached** value to multiple MySQL table columns.

4. Run the sample Python application.

   ```
   $> python multicol.py
   ```

   If successful, the sample application returns this output:

   ```
   Connected to memcached.
   Switching default table to 'bbb' by issuing GET for '@@bbb'.

   ==============================================
   Inserting initial data via memcached interface
   ==============================================
   Key = Canada
   Value = 34820000|9984670|R
   Added new key, value pair.
   Key = USA
   Value = 314242000|9826675|R
   Added new key, value pair.
   Key = Ireland
   Value = 6399152|84421|L
   Added new key, value pair.
   Key = UK
   Value = 62262000|243610|L
   Added new key, value pair.
   Key = Mexico
   Value = 113910608|1972550|R
   Added new key, value pair.
   Key = Denmark
   Value = 5543453|43094|R
   Added new key, value pair.
   Key = Norway
   Value = 5002942|385252|R
   Added new key, value pair.
   Key = UAE
   Value = 8264070|83600|R
   Added new key, value pair.
   Key = India
   Value = 1210193422|3287263|L
   Added new key, value pair.
   Key = China
   Value = 1347350000|9640821|R
   Added new key, value pair.

   ============================================
   Retrieving data for all keys (country names)
   ============================================
   Here is the result retrieved from the database for key Canada:
   34820000|9984670|R
   Unpacked population value: 34820000
   Unpacked area value      : 9984670
   Unpacked drive side value: R
   Here is the result retrieved from the database for key USA:
   314242000|9826675|R
   Unpacked population value: 314242000
   Unpacked area value      : 9826675
   Unpacked drive side value: R
   Here is the result retrieved from the database for key Ireland:
   6399152|84421|L
   Unpacked population value: 6399152
   Unpacked area value      : 84421
   Unpacked drive side value: L
   Here is the result retrieved from the database for key UK:
   62262000|243610|L
   Unpacked population value: 62262000
   Unpacked area value      : 243610
   Unpacked drive side value: L
   Here is the result retrieved from the database for key Mexico:
   113910608|1972550|R
   Unpacked population value: 113910608
   Unpacked area value      : 1972550
   Unpacked drive side value: R
   Here is the result retrieved from the database for key Denmark:
   5543453|43094|R
   Unpacked population value: 5543453
   Unpacked area value      : 43094
   Unpacked drive side value: R
   Here is the result retrieved from the database for key Norway:
   5002942|385252|R
   Unpacked population value: 5002942
   Unpacked area value      : 385252
   Unpacked drive side value: R
   Here is the result retrieved from the database for key UAE:
   8264070|83600|R
   Unpacked population value: 8264070
   Unpacked area value      : 83600
   Unpacked drive side value: R
   Here is the result retrieved from the database for key India:
   1210193422|3287263|L
   Unpacked population value: 1210193422
   Unpacked area value      : 3287263
   Unpacked drive side value: L
   Here is the result retrieved from the database for key China:
   1347350000|9640821|R
   Unpacked population value: 1347350000
   Unpacked area value      : 9640821
   Unpacked drive side value: R
   ```

5. Query the `innodb_memcache.containers` table to view the record you inserted earlier for the `multicol` table. The first record is the sample entry for the `demo_test` table that is created during the initial `daemon_memcached` plugin setup. The second record is the entry you inserted for the `multicol` table.

   ```
   mysql> SELECT * FROM innodb_memcache.containers\G
   *************************** 1. row ***************************
                     name: aaa
                db_schema: test
                 db_table: demo_test
              key_columns: c1
            value_columns: c2
                    flags: c3
               cas_column: c4
       expire_time_column: c5
   unique_idx_name_on_key: PRIMARY
   *************************** 2. row ***************************
                     name: bbb
                db_schema: test
                 db_table: multicol
              key_columns: country
            value_columns: population,area_sq_km,drive_side
                    flags: c3
               cas_column: c4
       expire_time_column: c5
   unique_idx_name_on_key: PRIMARY
   ```

6. Query the `multicol` table to view data inserted by the sample Python application. The data is available for MySQL queries, which demonstrates how the same data can be accessed using SQL or through applications (using the appropriate MySQL Connector or API).

   ```
   mysql> SELECT * FROM test.multicol;
   +---------+------------+------------+------------+------+------+------+
   | country | population | area_sq_km | drive_side | c3   | c4   | c5   |
   +---------+------------+------------+------------+------+------+------+
   | Canada  | 34820000   | 9984670    | R          |    0 |   11 |    0 |
   | China   | 1347350000 | 9640821    | R          |    0 |   20 |    0 |
   | Denmark | 5543453    | 43094      | R          |    0 |   16 |    0 |
   | India   | 1210193422 | 3287263    | L          |    0 |   19 |    0 |
   | Ireland | 6399152    | 84421      | L          |    0 |   13 |    0 |
   | Mexico  | 113910608  | 1972550    | R          |    0 |   15 |    0 |
   | Norway  | 5002942    | 385252     | R          |    0 |   17 |    0 |
   | UAE     | 8264070    | 83600      | R          |    0 |   18 |    0 |
   | UK      | 62262000   | 243610     | L          |    0 |   14 |    0 |
   | USA     | 314242000  | 9826675    | R          |    0 |   12 |    0 |
   +---------+------------+------------+------------+------+------+------+
   ```

   Note

   Always allow sufficient size to hold necessary digits, decimal points, sign characters, leading zeros, and so on when defining the length for columns that are treated as numbers. Too-long values in a string column such as a `VARCHAR` are truncated by removing some characters, which could produce nonsensical numeric values.

7. Optionally, run report-type queries on the `InnoDB` table that stores the **memcached** data.

   You can produce reports through SQL queries, performing calculations and tests across any columns, not just the `country` key column. (Because the following examples use data from only a few countries, the numbers are for illustration purposes only.) The following queries return the average population of countries where people drive on the right, and the average size of countries whose names start with “U”:

   ```
   mysql> SELECT AVG(population) FROM multicol WHERE drive_side = 'R';
   +-------------------+
   | avg(population)   |
   +-------------------+
   | 261304724.7142857 |
   +-------------------+

   mysql> SELECT SUM(area_sq_km) FROM multicol WHERE country LIKE 'U%';
   +-----------------+
   | sum(area_sq_km) |
   +-----------------+
   |        10153885 |
   +-----------------+
   ```

   Because the `population` and `area_sq_km` columns store character data rather than strongly typed numeric data, functions such as `AVG()` and `SUM()` work by converting each value to a number first. This approach *does not work* for operators such as `<` or `>`, for example, when comparing character-based values, `9 > 1000`, which is not expected from a clause such as `ORDER BY population DESC`. For the most accurate type treatment, perform queries against views that cast numeric columns to the appropriate types. This technique lets you issue simple `SELECT *` queries from database applications, while ensuring that casting, filtering, and ordering is correct. The following example shows a view that can be queried to find the top three countries in descending order of population, with the results reflecting the latest data in the `multicol` table, and with population and area figures treated as numbers:

   ```
   mysql> CREATE VIEW populous_countries AS
          SELECT
          country,
          cast(population as unsigned integer) population,
          cast(area_sq_km as unsigned integer) area_sq_km,
          drive_side FROM multicol
          ORDER BY CAST(population as unsigned integer) DESC
          LIMIT 3;

   mysql> SELECT * FROM populous_countries;
   +---------+------------+------------+------------+
   | country | population | area_sq_km | drive_side |
   +---------+------------+------------+------------+
   | China   | 1347350000 |    9640821 | R          |
   | India   | 1210193422 |    3287263 | L          |
   | USA     |  314242000 |    9826675 | R          |
   +---------+------------+------------+------------+

   mysql> DESC populous_countries;
   +------------+---------------------+------+-----+---------+-------+
   | Field      | Type                | Null | Key | Default | Extra |
   +------------+---------------------+------+-----+---------+-------+
   | country    | varchar(128)        | NO   |     |         |       |
   | population | bigint(10) unsigned | YES  |     | NULL    |       |
   | area_sq_km | int(9) unsigned     | YES  |     | NULL    |       |
   | drive_side | varchar(1)          | YES  |     | NULL    |       |
   +------------+---------------------+------+-----+---------+-------+
   ```
