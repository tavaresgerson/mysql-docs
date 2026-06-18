### 10.3.9 Comparison of B-Tree and Hash Indexes

Understanding the B-tree and hash data structures can help
predict how different queries perform on different storage
engines that use these data structures in their indexes,
particularly for the `MEMORY` storage engine
that lets you choose B-tree or hash indexes.

* [B-Tree Index Characteristics](index-btree-hash.html#btree-index-characteristics "B-Tree Index Characteristics")
* [Hash Index Characteristics](index-btree-hash.html#hash-index-characteristics "Hash Index Characteristics")

#### B-Tree Index Characteristics

A B-tree index can be used for column comparisons in
expressions that use the
[`=`](comparison-operators.html#operator_equal),
[`>`](comparison-operators.html#operator_greater-than),
[`>=`](comparison-operators.html#operator_greater-than-or-equal),
[`<`](comparison-operators.html#operator_less-than),
[`<=`](comparison-operators.html#operator_less-than-or-equal),
or [`BETWEEN`](comparison-operators.html#operator_between) operators. The index
also can be used for [`LIKE`](string-comparison-functions.html#operator_like)
comparisons if the argument to
[`LIKE`](string-comparison-functions.html#operator_like) is a constant string that
does not start with a wildcard character. For example, the
following [`SELECT`](select.html "15.2.13 SELECT Statement") statements use
indexes:

```
SELECT * FROM tbl_name WHERE key_col LIKE 'Patrick%';
SELECT * FROM tbl_name WHERE key_col LIKE 'Pat%_ck%';
```

In the first statement, only rows with `'Patrick'
<= key_col <
'Patricl'` are considered. In the second statement,
only rows with `'Pat' <=
key_col < 'Pau'` are
considered.

The following [`SELECT`](select.html "15.2.13 SELECT Statement") statements
do not use indexes:

```
SELECT * FROM tbl_name WHERE key_col LIKE '%Patrick%';
SELECT * FROM tbl_name WHERE key_col LIKE other_col;
```

In the first statement, the [`LIKE`](string-comparison-functions.html#operator_like)
value begins with a wildcard character. In the second
statement, the [`LIKE`](string-comparison-functions.html#operator_like) value is not
a constant.

If you use `... LIKE
'%string%'` and
*`string`* is longer than three
characters, MySQL uses the Turbo
Boyer-Moore algorithm to initialize the pattern for
the string and then uses this pattern to perform the search
more quickly.

A search using `col_name IS
NULL` employs indexes if
*`col_name`* is indexed.

Any index that does not span all
[`AND`](logical-operators.html#operator_and) levels in the
`WHERE` clause is not used to optimize the
query. In other words, to be able to use an index, a prefix of
the index must be used in every
[`AND`](logical-operators.html#operator_and) group.

The following `WHERE` clauses use indexes:

```
... WHERE index_part1=1 AND index_part2=2 AND other_column=3

    /* index = 1 OR index = 2 */
... WHERE index=1 OR A=10 AND index=2

    /* optimized like "index_part1='hello'" */
... WHERE index_part1='hello' AND index_part3=5

    /* Can use index on index1 but not on index2 or index3 */
... WHERE index1=1 AND index2=2 OR index1=3 AND index3=3;
```

These `WHERE` clauses do
*not* use indexes:

```
    /* index_part1 is not used */
... WHERE index_part2=1 AND index_part3=2

    /*  Index is not used in both parts of the WHERE clause  */
... WHERE index=1 OR A=10

    /* No index spans all rows  */
... WHERE index_part1=1 OR index_part2=10
```

Sometimes MySQL does not use an index, even if one is
available. One circumstance under which this occurs is when
the optimizer estimates that using the index would require
MySQL to access a very large percentage of the rows in the
table. (In this case, a table scan is likely to be much faster
because it requires fewer seeks.) However, if such a query
uses `LIMIT` to retrieve only some of the
rows, MySQL uses an index anyway, because it can much more
quickly find the few rows to return in the result.

#### Hash Index Characteristics

Hash indexes have somewhat different characteristics from
those just discussed:

* They are used only for equality comparisons that use the
  `=` or `<=>`
  operators (but are *very* fast). They
  are not used for comparison operators such as
  `<` that find a range of values.
  Systems that rely on this type of single-value lookup are
  known as “key-value stores”; to use MySQL for
  such applications, use hash indexes wherever possible.

* The optimizer cannot use a hash index to speed up
  `ORDER BY` operations. (This type of
  index cannot be used to search for the next entry in
  order.)

* MySQL cannot determine approximately how many rows there
  are between two values (this is used by the range
  optimizer to decide which index to use). This may affect
  some queries if you change a `MyISAM` or
  `InnoDB` table to a hash-indexed
  `MEMORY` table.

* Only whole keys can be used to search for a row. (With a
  B-tree index, any leftmost prefix of the key can be used
  to find rows.)