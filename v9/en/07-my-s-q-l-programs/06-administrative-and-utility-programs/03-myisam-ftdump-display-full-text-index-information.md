### 6.6.3 myisam\_ftdump — Display Full-Text Index information

**myisam\_ftdump** displays information about `FULLTEXT` indexes in `MyISAM` tables. It reads the `MyISAM` index file directly, so it must be run on the server host where the table is located. Before using **myisam\_ftdump**, be sure to issue a `FLUSH TABLES` statement first if the server is running.

**myisam\_ftdump** scans and dumps the entire index, which is not particularly fast. On the other hand, the distribution of words changes infrequently, so it need not be run often.

Invoke **myisam\_ftdump** like this:

```
myisam_ftdump [options] tbl_name index_num
```

The *`tbl_name`* argument should be the name of a `MyISAM` table. You can also specify a table by naming its index file (the file with the `.MYI` suffix). If you do not invoke **myisam\_ftdump** in the directory where the table files are located, the table or index file name must be preceded by the path name to the table's database directory. Index numbers begin with 0.

Example: Suppose that the `test` database contains a table named `mytexttable` that has the following definition:

```
CREATE TABLE mytexttable
(
  id   INT NOT NULL,
  txt  TEXT NOT NULL,
  PRIMARY KEY (id),
  FULLTEXT (txt)
) ENGINE=MyISAM;
```

The index on `id` is index 0 and the `FULLTEXT` index on `txt` is index 1. If your working directory is the `test` database directory, invoke **myisam\_ftdump** as follows:

```
myisam_ftdump mytexttable 1
```

If the path name to the `test` database directory is `/usr/local/mysql/data/test`, you can also specify the table name argument using that path name. This is useful if you do not invoke **myisam\_ftdump** in the database directory:

```
myisam_ftdump /usr/local/mysql/data/test/mytexttable 1
```

You can use **myisam\_ftdump** to generate a list of index entries in order of frequency of occurrence like this on Unix-like systems:

```
myisam_ftdump -c mytexttable 1 | sort -r
```

On Windows, use:

```
myisam_ftdump -c mytexttable 1 | sort /R
```

**myisam\_ftdump** supports the following options:

* `--help`, `-h` `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--count`, `-c`

  <table frame="box" rules="all" summary="Properties for count"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--count</code></td> </tr></tbody></table>

  Calculate per-word statistics (counts and global weights).

* `--dump`, `-d`

  <table frame="box" rules="all" summary="Properties for dump"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--dump</code></td> </tr></tbody></table>

  Dump the index, including data offsets and word weights.

* `--length`, `-l`

  <table frame="box" rules="all" summary="Properties for length"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--length</code></td> </tr></tbody></table>

  Report the length distribution.

* `--stats`, `-s`

  <table frame="box" rules="all" summary="Properties for stats"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--stats</code></td> </tr></tbody></table>

  Report global index statistics. This is the default operation if no other operation is specified.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--verbose</code></td> </tr></tbody></table>

  Verbose mode. Print more output about what the program does.
