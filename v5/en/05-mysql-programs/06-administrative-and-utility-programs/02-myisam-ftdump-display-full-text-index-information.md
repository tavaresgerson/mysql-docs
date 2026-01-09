### 4.6.2 myisam_ftdump — Display Full-Text Index information

**myisam_ftdump** displays information about `FULLTEXT` indexes in `MyISAM` tables. It reads the `MyISAM` index file directly, so it must be run on the server host where the table is located. Before using **myisam_ftdump**, be sure to issue a `FLUSH TABLES` statement first if the server is running.

**myisam_ftdump** scans and dumps the entire index, which is not particularly fast. On the other hand, the distribution of words changes infrequently, so it need not be run often.

Invoke **myisam_ftdump** like this:

```sql
myisam_ftdump [options] tbl_name index_num
```

The *`tbl_name`* argument should be the name of a `MyISAM` table. You can also specify a table by naming its index file (the file with the `.MYI` suffix). If you do not invoke **myisam_ftdump** in the directory where the table files are located, the table or index file name must be preceded by the path name to the table's database directory. Index numbers begin with 0.

Example: Suppose that the `test` database contains a table named `mytexttable` that has the following definition:

```sql
CREATE TABLE mytexttable
(
  id   INT NOT NULL,
  txt  TEXT NOT NULL,
  PRIMARY KEY (id),
  FULLTEXT (txt)
) ENGINE=MyISAM;
```

The index on `id` is index 0 and the `FULLTEXT` index on `txt` is index 1. If your working directory is the `test` database directory, invoke **myisam_ftdump** as follows:

```sql
myisam_ftdump mytexttable 1
```

If the path name to the `test` database directory is `/usr/local/mysql/data/test`, you can also specify the table name argument using that path name. This is useful if you do not invoke **myisam_ftdump** in the database directory:

```sql
myisam_ftdump /usr/local/mysql/data/test/mytexttable 1
```

You can use **myisam_ftdump** to generate a list of index entries in order of frequency of occurrence like this on Unix-like systems:

```sql
myisam_ftdump -c mytexttable 1 | sort -r
```

On Windows, use:

```sql
myisam_ftdump -c mytexttable 1 | sort /R
```

**myisam_ftdump** supports the following options:

* `--help`, `-h` `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--count`, `-c`

  <table frame="box" rules="all" summary="Properties for count"><tbody><tr><th>Command-Line Format</th> <td><code>--count</code></td> </tr></tbody></table>

  Calculate per-word statistics (counts and global weights).

* `--dump`, `-d`

  <table frame="box" rules="all" summary="Properties for dump"><tbody><tr><th>Command-Line Format</th> <td><code>--dump</code></td> </tr></tbody></table>

  Dump the index, including data offsets and word weights.

* `--length`, `-l`

  <table frame="box" rules="all" summary="Properties for length"><tbody><tr><th>Command-Line Format</th> <td><code>--length</code></td> </tr></tbody></table>

  Report the length distribution.

* `--stats`, `-s`

  <table frame="box" rules="all" summary="Properties for stats"><tbody><tr><th>Command-Line Format</th> <td><code>--stats</code></td> </tr></tbody></table>

  Report global index statistics. This is the default operation if no other operation is specified.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Verbose mode. Print more output about what the program does.
