### 24.4.10 The INFORMATION\_SCHEMA INNODB\_FT\_DEFAULT\_STOPWORD Table

The [`INNODB_FT_DEFAULT_STOPWORD`](information-schema-innodb-ft-default-stopword-table.html "24.4.10 The INFORMATION_SCHEMA INNODB_FT_DEFAULT_STOPWORD Table") table holds a list of [stopwords](glossary.html#glos_stopword "stopword") that are used by default when creating a `FULLTEXT` index on `InnoDB` tables. For information about the default `InnoDB` stopword list and how to define your own stopword lists, see [Section 12.9.4, “Full-Text Stopwords”](fulltext-stopwords.html "12.9.4 Full-Text Stopwords").

For related usage information and examples, see [Section 14.16.4, “InnoDB INFORMATION\_SCHEMA FULLTEXT Index Tables”](innodb-information-schema-fulltext_index-tables.html "14.16.4 InnoDB INFORMATION_SCHEMA FULLTEXT Index Tables").

The [`INNODB_FT_DEFAULT_STOPWORD`](information-schema-innodb-ft-default-stopword-table.html "24.4.10 The INFORMATION_SCHEMA INNODB_FT_DEFAULT_STOPWORD Table") table has these columns:

* `value`

  A word that is used by default as a stopword for `FULLTEXT` indexes on `InnoDB` tables. This is not used if you override the default stopword processing with either the [`innodb_ft_server_stopword_table`](innodb-parameters.html#sysvar_innodb_ft_server_stopword_table) or the [`innodb_ft_user_stopword_table`](innodb-parameters.html#sysvar_innodb_ft_user_stopword_table) system variable.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DEFAULT_STOPWORD;
+-------+
| value |
+-------+
| a     |
| about |
| an    |
| are   |
| as    |
| at    |
| be    |
| by    |
| com   |
| de    |
| en    |
| for   |
| from  |
| how   |
| i     |
| in    |
| is    |
| it    |
| la    |
| of    |
| on    |
| or    |
| that  |
| the   |
| this  |
| to    |
| was   |
| what  |
| when  |
| where |
| who   |
| will  |
| with  |
| und   |
| the   |
| www   |
+-------+
36 rows in set (0.00 sec)
```

#### Notes

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.

* For more information about `InnoDB` `FULLTEXT` search, see [Section 14.6.2.4, “InnoDB Full-Text Indexes”](innodb-fulltext-index.html "14.6.2.4 InnoDB Full-Text Indexes"), and [Section 12.9, “Full-Text Search Functions”](fulltext-search.html "12.9 Full-Text Search Functions").
