#### 6.6.4.4 Other myisamchk Options

[**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") supports the following options for
actions other than table checks and repairs:

* [`--analyze`](myisamchk-other-options.html#option_myisamchk_analyze),
  `-a`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--analyze</code></td>
</tr></tbody></table>

  Analyze the distribution of key values. This improves join
  performance by enabling the join optimizer to better choose
  the order in which to join the tables and which indexes it
  should use. To obtain information about the key
  distribution, use a [**myisamchk --description
  --verbose *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility")
  command or the `SHOW INDEX FROM
  tbl_name` statement.

* [`--block-search=offset`](myisamchk-other-options.html#option_myisamchk_block-search),
  `-b offset`

  <table frame="box" rules="all" summary="Properties for block-search"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--block-search=offset</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>

  Find the record that a block at the given offset belongs to.

* [`--description`](myisamchk-other-options.html#option_myisamchk_description),
  `-d`

  <table frame="box" rules="all" summary="Properties for description"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--description</code></td>
</tr></tbody></table>

  Print some descriptive information about the table.
  Specifying the [`--verbose`](myisamchk-general-options.html#option_myisamchk_verbose)
  option once or twice produces additional information. See
  [Section 6.6.4.5, “Obtaining Table Information with myisamchk”](myisamchk-table-info.html "6.6.4.5 Obtaining Table Information with myisamchk").

* [`--set-auto-increment[=value]`](myisamchk-other-options.html#option_myisamchk_set-auto-increment),
  `-A[value]`

  Force `AUTO_INCREMENT` numbering for new
  records to start at the given value (or higher, if there are
  existing records with `AUTO_INCREMENT`
  values this large). If *`value`* is
  not specified, `AUTO_INCREMENT` numbers for
  new records begin with the largest value currently in the
  table, plus one.

* [`--sort-index`](myisamchk-other-options.html#option_myisamchk_sort-index),
  `-S`

  <table frame="box" rules="all" summary="Properties for sort-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--sort-index</code></td>
</tr></tbody></table>

  Sort the index tree blocks in high-low order. This optimizes
  seeks and makes table scans that use indexes faster.

* [`--sort-records=N`](myisamchk-other-options.html#option_myisamchk_sort-records),
  `-R N`

  <table frame="box" rules="all" summary="Properties for sort-records"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--sort-records=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>

  Sort records according to a particular index. This makes
  your data much more localized and may speed up range-based
  [`SELECT`](select.html "15.2.13 SELECT Statement") and `ORDER
  BY` operations that use this index. (The first time
  you use this option to sort a table, it may be very slow.)
  To determine a table's index numbers, use
  [`SHOW INDEX`](show-index.html "15.7.7.24 SHOW INDEX Statement"), which displays a
  table's indexes in the same order that
  [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") sees them. Indexes are numbered
  beginning with 1.

  If keys are not packed (`PACK_KEYS=0`),
  they have the same length, so when
  [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") sorts and moves records, it
  just overwrites record offsets in the index. If keys are
  packed (`PACK_KEYS=1`),
  [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") must unpack key blocks first,
  then re-create indexes and pack the key blocks again. (In
  this case, re-creating indexes is faster than updating
  offsets for each index.)