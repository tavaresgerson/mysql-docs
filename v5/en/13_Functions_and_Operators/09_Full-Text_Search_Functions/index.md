## 12.9 Full-Text Search Functions

[12.9.1 Natural Language Full-Text Searches](fulltext-natural-language.html)

[12.9.2 Boolean Full-Text Searches](fulltext-boolean.html)

[12.9.3 Full-Text Searches with Query Expansion](fulltext-query-expansion.html)

[12.9.4 Full-Text Stopwords](fulltext-stopwords.html)

[12.9.5 Full-Text Restrictions](fulltext-restrictions.html)

[12.9.6 Fine-Tuning MySQL Full-Text Search](fulltext-fine-tuning.html)

[12.9.7 Adding a User-Defined Collation for Full-Text Indexing](full-text-adding-collation.html)

[12.9.8 ngram Full-Text Parser](fulltext-search-ngram.html)

[12.9.9 MeCab Full-Text Parser Plugin](fulltext-search-mecab.html)

[`MATCH
(col1,col2,...)
AGAINST (expr
[search_modifier])`](fulltext-search.html#function_match)

```sql
search_modifier:
  {
       IN NATURAL LANGUAGE MODE
     | IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION
     | IN BOOLEAN MODE
     | WITH QUERY EXPANSION
  }
```

MySQL has support for full-text indexing and searching:

* A full-text index in MySQL is an index of type
  `FULLTEXT`.

* Full-text indexes can be used only with
  [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") or
  [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables, and can be created
  only for [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"),
  [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), or
  [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns.

* MySQL provides a built-in full-text ngram parser that supports
  Chinese, Japanese, and Korean (CJK), and an installable MeCab
  full-text parser plugin for Japanese. Parsing differences are
  outlined in [Section 12.9.8, “ngram Full-Text Parser”](fulltext-search-ngram.html "12.9.8 ngram Full-Text Parser"), and
  [Section 12.9.9, “MeCab Full-Text Parser Plugin”](fulltext-search-mecab.html "12.9.9 MeCab Full-Text Parser Plugin").

* A `FULLTEXT` index definition can be given in
  the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement when
  a table is created, or added later using
  [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") or
  [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement").

* For large data sets, it is much faster to load your data into
  a table that has no `FULLTEXT` index and then
  create the index after that, than to load data into a table
  that has an existing `FULLTEXT` index.

Full-text searching is performed using
[`MATCH() AGAINST()`](fulltext-search.html#function_match) syntax.
[`MATCH()`](fulltext-search.html#function_match) takes a comma-separated
list that names the columns to be searched.
`AGAINST` takes a string to search for, and an
optional modifier that indicates what type of search to perform.
The search string must be a string value that is constant during
query evaluation. This rules out, for example, a table column
because that can differ for each row.

There are three types of full-text searches:

* A natural language search interprets the search string as a
  phrase in natural human language (a phrase in free text).
  There are no special operators, with the exception of double
  quote (") characters. The stopword list applies. For more
  information about stopword lists, see
  [Section 12.9.4, “Full-Text Stopwords”](fulltext-stopwords.html "12.9.4 Full-Text Stopwords").

  Full-text searches are natural language searches if the
  `IN NATURAL LANGUAGE MODE` modifier is given
  or if no modifier is given. For more information, see
  [Section 12.9.1, “Natural Language Full-Text Searches”](fulltext-natural-language.html "12.9.1 Natural Language Full-Text Searches").

* A boolean search interprets the search string using the rules
  of a special query language. The string contains the words to
  search for. It can also contain operators that specify
  requirements such that a word must be present or absent in
  matching rows, or that it should be weighted higher or lower
  than usual. Certain common words (stopwords) are omitted from
  the search index and do not match if present in the search
  string. The `IN BOOLEAN MODE` modifier
  specifies a boolean search. For more information, see
  [Section 12.9.2, “Boolean Full-Text Searches”](fulltext-boolean.html "12.9.2 Boolean Full-Text Searches").

* A query expansion search is a modification of a natural
  language search. The search string is used to perform a
  natural language search. Then words from the most relevant
  rows returned by the search are added to the search string and
  the search is done again. The query returns the rows from the
  second search. The `IN NATURAL LANGUAGE MODE WITH
  QUERY EXPANSION` or `WITH QUERY
  EXPANSION` modifier specifies a query expansion
  search. For more information, see
  [Section 12.9.3, “Full-Text Searches with Query Expansion”](fulltext-query-expansion.html "12.9.3 Full-Text Searches with Query Expansion").

For information about `FULLTEXT` query
performance, see [Section 8.3.4, “Column Indexes”](column-indexes.html "8.3.4 Column Indexes").

For more information about `InnoDB`
`FULLTEXT` indexes, see
[Section 14.6.2.4, “InnoDB Full-Text Indexes”](innodb-fulltext-index.html "14.6.2.4 InnoDB Full-Text Indexes").

Constraints on full-text searching are listed in
[Section 12.9.5, “Full-Text Restrictions”](fulltext-restrictions.html "12.9.5 Full-Text Restrictions").

The [**myisam\_ftdump**](myisam-ftdump.html "4.6.2 myisam_ftdump — Display Full-Text Index information") utility dumps the contents of
a `MyISAM` full-text index. This may be helpful
for debugging full-text queries. See
[Section 4.6.2, “myisam\_ftdump — Display Full-Text Index information”](myisam-ftdump.html "4.6.2 myisam_ftdump — Display Full-Text Index information").