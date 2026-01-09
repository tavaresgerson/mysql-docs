### 17.15.4 InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables

The following tables provide metadata for `FULLTEXT` indexes:

```
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_FT%';
+-------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_FT%) |
+-------------------------------------------+
| INNODB_FT_CONFIG                          |
| INNODB_FT_BEING_DELETED                   |
| INNODB_FT_DELETED                         |
| INNODB_FT_DEFAULT_STOPWORD                |
| INNODB_FT_INDEX_TABLE                     |
| INNODB_FT_INDEX_CACHE                     |
+-------------------------------------------+
```

#### Table Overview

* `INNODB_FT_CONFIG`: Provides metadata about the `FULLTEXT` index and associated processing for an `InnoDB` table.

* `INNODB_FT_BEING_DELETED`: Provides a snapshot of the `INNODB_FT_DELETED` table; it is used only during an `OPTIMIZE TABLE` maintenance operation. When `OPTIMIZE TABLE` is run, the `INNODB_FT_BEING_DELETED` table is emptied, and `DOC_ID` values are removed from the `INNODB_FT_DELETED` table. Because the contents of `INNODB_FT_BEING_DELETED` typically have a short lifetime, this table has limited utility for monitoring or debugging. For information about running `OPTIMIZE TABLE` on tables with `FULLTEXT` indexes, see Section 14.9.6, “Fine-Tuning MySQL Full-Text Search”.

* `INNODB_FT_DELETED`: Stores rows that are deleted from the `FULLTEXT` index for an `InnoDB` table. To avoid expensive index reorganization during DML operations for an `InnoDB` `FULLTEXT` index, the information about newly deleted words is stored separately, filtered out of search results when you do a text search, and removed from the main search index only when you issue an `OPTIMIZE TABLE` statement for the `InnoDB` table.

* `INNODB_FT_DEFAULT_STOPWORD`: Holds a list of stopwords that are used by default when creating a `FULLTEXT` index on `InnoDB` tables.

  For information about the `INNODB_FT_DEFAULT_STOPWORD` table, see Section 14.9.4, “Full-Text Stopwords”.

* `INNODB_FT_INDEX_TABLE`: Provides information about the inverted index used to process text searches against the `FULLTEXT` index of an `InnoDB` table.

* `INNODB_FT_INDEX_CACHE`: Provides token information about newly inserted rows in a `FULLTEXT` index. To avoid expensive index reorganization during DML operations, the information about newly indexed words is stored separately, and combined with the main search index only when `OPTIMIZE TABLE` is run, when the server is shut down, or when the cache size exceeds a limit defined by the `innodb_ft_cache_size` or `innodb_ft_total_cache_size` system variable.

Note

With the exception of the `INNODB_FT_DEFAULT_STOPWORD` table, these tables are empty initially. Before querying any of them, set the value of the `innodb_ft_aux_table` system variable to the name (including the database name) of the table that contains the `FULLTEXT` index (for example, `test/articles`).

**Example 17.5 InnoDB FULLTEXT Index INFORMATION_SCHEMA Tables**

This example uses a table with a `FULLTEXT` index to demonstrate the data contained in the `FULLTEXT` index `INFORMATION_SCHEMA` tables.

1. Create a table with a `FULLTEXT` index and insert some data:

   ```
   mysql> CREATE TABLE articles (
            id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
            title VARCHAR(200),
            body TEXT,
            FULLTEXT (title,body)
          ) ENGINE=InnoDB;

   mysql> INSERT INTO articles (title,body) VALUES
          ('MySQL Tutorial','DBMS stands for DataBase ...'),
          ('How To Use MySQL Well','After you went through a ...'),
          ('Optimizing MySQL','In this tutorial we show ...'),
          ('1001 MySQL Tricks','1. Never run mysqld as root. 2. ...'),
          ('MySQL vs. YourSQL','In the following database comparison ...'),
          ('MySQL Security','When configured properly, MySQL ...');
   ```

2. Set the `innodb_ft_aux_table` variable to the name of the table with the `FULLTEXT` index. If this variable is not set, the `InnoDB` `FULLTEXT` `INFORMATION_SCHEMA` tables are empty, with the exception of `INNODB_FT_DEFAULT_STOPWORD`.

   ```
   mysql> SET GLOBAL innodb_ft_aux_table = 'test/articles';
   ```

3. Query the `INNODB_FT_INDEX_CACHE` table, which shows information about newly inserted rows in a `FULLTEXT` index. To avoid expensive index reorganization during DML operations, data for newly inserted rows remains in the `FULLTEXT` index cache until `OPTIMIZE TABLE` is run (or until the server is shut down or cache limits are exceeded).

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE LIMIT 5;
   +------------+--------------+-------------+-----------+--------+----------+
   | WORD       | FIRST_DOC_ID | LAST_DOC_ID | DOC_COUNT | DOC_ID | POSITION |
   +------------+--------------+-------------+-----------+--------+----------+
   | 1001       |            5 |           5 |         1 |      5 |        0 |
   | after      |            3 |           3 |         1 |      3 |       22 |
   | comparison |            6 |           6 |         1 |      6 |       44 |
   | configured |            7 |           7 |         1 |      7 |       20 |
   | database   |            2 |           6 |         2 |      2 |       31 |
   +------------+--------------+-------------+-----------+--------+----------+
   ```

4. Enable the `innodb_optimize_fulltext_only` system variable and run `OPTIMIZE TABLE` on the table that contains the `FULLTEXT` index. This operation flushes the contents of the `FULLTEXT` index cache to the main `FULLTEXT` index. `innodb_optimize_fulltext_only` changes the way the `OPTIMIZE TABLE` statement operates on `InnoDB` tables, and is intended to be enabled temporarily, during maintenance operations on `InnoDB` tables with `FULLTEXT` indexes.

   ```
   mysql> SET GLOBAL innodb_optimize_fulltext_only=ON;

   mysql> OPTIMIZE TABLE articles;
   +---------------+----------+----------+----------+
   | Table         | Op       | Msg_type | Msg_text |
   +---------------+----------+----------+----------+
   | test.articles | optimize | status   | OK       |
   +---------------+----------+----------+----------+
   ```

5. Query the `INNODB_FT_INDEX_TABLE` table to view information about data in the main `FULLTEXT` index, including information about the data that was just flushed from the `FULLTEXT` index cache.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_TABLE LIMIT 5;
   +------------+--------------+-------------+-----------+--------+----------+
   | WORD       | FIRST_DOC_ID | LAST_DOC_ID | DOC_COUNT | DOC_ID | POSITION |
   +------------+--------------+-------------+-----------+--------+----------+
   | 1001       |            5 |           5 |         1 |      5 |        0 |
   | after      |            3 |           3 |         1 |      3 |       22 |
   | comparison |            6 |           6 |         1 |      6 |       44 |
   | configured |            7 |           7 |         1 |      7 |       20 |
   | database   |            2 |           6 |         2 |      2 |       31 |
   +------------+--------------+-------------+-----------+--------+----------+
   ```

   The `INNODB_FT_INDEX_CACHE` table is now empty since the `OPTIMIZE TABLE` operation flushed the `FULLTEXT` index cache.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE LIMIT 5;
   Empty set (0.00 sec)
   ```

6. Delete some records from the `test/articles` table.

   ```
   mysql> DELETE FROM test.articles WHERE id < 4;
   ```

7. Query the `INNODB_FT_DELETED` table. This table records rows that are deleted from the `FULLTEXT` index. To avoid expensive index reorganization during DML operations, information about newly deleted records is stored separately, filtered out of search results when you do a text search, and removed from the main search index when you run `OPTIMIZE TABLE`.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DELETED;
   +--------+
   | DOC_ID |
   +--------+
   |      2 |
   |      3 |
   |      4 |
   +--------+
   ```

8. Run `OPTIMIZE TABLE` to remove the deleted records.

   ```
   mysql> OPTIMIZE TABLE articles;
   +---------------+----------+----------+----------+
   | Table         | Op       | Msg_type | Msg_text |
   +---------------+----------+----------+----------+
   | test.articles | optimize | status   | OK       |
   +---------------+----------+----------+----------+
   ```

   The `INNODB_FT_DELETED` table should now be empty.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DELETED;
   Empty set (0.00 sec)
   ```

9. Query the `INNODB_FT_CONFIG` table. This table contains metadata about the `FULLTEXT` index and related processing:

   * `optimize_checkpoint_limit`: The number of seconds after which an `OPTIMIZE TABLE` run stops.

   * `synced_doc_id`: The next `DOC_ID` to be issued.

   * `stopword_table_name`: The *`database/table`* name for a user-defined stopword table. The `VALUE` column is empty if there is no user-defined stopword table.

   * `use_stopword`: Indicates whether a stopword table is used, which is defined when the `FULLTEXT` index is created.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_CONFIG;
   +---------------------------+-------+
   | KEY                       | VALUE |
   +---------------------------+-------+
   | optimize_checkpoint_limit | 180   |
   | synced_doc_id             | 8     |
   | stopword_table_name       |       |
   | use_stopword              | 1     |
   +---------------------------+-------+
   ```

10. Disable `innodb_optimize_fulltext_only`, since it is intended to be enabled only temporarily:

    ```
    mysql> SET GLOBAL innodb_optimize_fulltext_only=OFF;
    ```
