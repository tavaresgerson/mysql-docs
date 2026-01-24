#### 13.4.2.2 CHANGE REPLICATION FILTER Statement

```sql
CHANGE REPLICATION FILTER filter[, filter][, ...]

filter: {
    REPLICATE_DO_DB = (db_list)
  | REPLICATE_IGNORE_DB = (db_list)
  | REPLICATE_DO_TABLE = (tbl_list)
  | REPLICATE_IGNORE_TABLE = (tbl_list)
  | REPLICATE_WILD_DO_TABLE = (wild_tbl_list)
  | REPLICATE_WILD_IGNORE_TABLE = (wild_tbl_list)
  | REPLICATE_REWRITE_DB = (db_pair_list)
}

db_list:
    db_name[, db_name][, ...]

tbl_list:
    db_name.table_name[, db_table_name][, ...]
wild_tbl_list:
    'db_pattern.table_pattern'[, 'db_pattern.table_pattern'][, ...]

db_pair_list:
    (db_pair)[, (db_pair)][, ...]

db_pair:
    from_db, to_db
```

`CHANGE REPLICATION FILTER` sets one or more replication filtering rules on the replica in the same way as starting the replica [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with replication filtering options such as [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) or [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table). Filters set using this statement differ from those set using the server options in two key respects:

1. The statement does not require restarting the server to take effect, only that the replication SQL thread be stopped using [`STOP SLAVE SQL_THREAD`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") first (and restarted with [`START SLAVE SQL_THREAD`](start-slave.html "13.4.2.5 START SLAVE Statement") afterwards).

2. The effects of the statement are not persistent; any filters set using `CHANGE REPLICATION FILTER` are lost following a restart of the replica [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

[`CHANGE REPLICATION FILTER`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement") requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

Note

Replication filters cannot be set on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

The following list shows the `CHANGE REPLICATION FILTER` options and how they relate to `--replicate-*` server options:

* `REPLICATE_DO_DB`: Include updates based on database name. Equivalent to [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db).

* `REPLICATE_IGNORE_DB`: Exclude updates based on database name. Equivalent to [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db).

* `REPLICATE_DO_TABLE`: Include updates based on table name. Equivalent to [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table).

* `REPLICATE_IGNORE_TABLE`: Exclude updates based on table name. Equivalent to [`--replicate-ignore-table`](replication-options-replica.html#option_mysqld_replicate-ignore-table).

* `REPLICATE_WILD_DO_TABLE`: Include updates based on wildcard pattern matching table name. Equivalent to [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table).

* `REPLICATE_WILD_IGNORE_TABLE`: Exclude updates based on wildcard pattern matching table name. Equivalent to [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table).

* `REPLICATE_REWRITE_DB`: Perform updates on replica after substituting new name on replica for specified database on source. Equivalent to [`--replicate-rewrite-db`](replication-options-replica.html#option_mysqld_replicate-rewrite-db).

The precise effects of `REPLICATE_DO_DB` and `REPLICATE_IGNORE_DB` filters are dependent on whether statement-based or row-based replication is in effect. See [Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules"), for more information.

Multiple replication filtering rules can be created in a single `CHANGE REPLICATION FILTER` statement by separating the rules with commas, as shown here:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (d1), REPLICATE_IGNORE_DB = (d2);
```

Issuing the statement just shown is equivalent to starting the replica [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with the options [`--replicate-do-db=d1`](replication-options-replica.html#option_mysqld_replicate-do-db) [`--replicate-ignore-db=d2`](replication-options-replica.html#option_mysqld_replicate-ignore-db).

If the same filtering rule is specified multiple times, only the *last* such rule is actually used. For example, the two statements shown here have exactly the same effect, because the first `REPLICATE_DO_DB` rule in the first statement is ignored:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db1, db2), REPLICATE_DO_DB = (db3, db4);

CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db3,db4);
```

Caution

This behavior differs from that of the `--replicate-*` filter options where specifying the same option multiple times causes the creation of multiple filter rules.

Names of tables and database not containing any special characters need not be quoted. Values used with `REPLICATION_WILD_TABLE` and `REPLICATION_WILD_IGNORE_TABLE` are string expressions, possibly containing (special) wildcard characters, and so must be quoted. This is shown in the following example statements:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_WILD_DO_TABLE = ('db1.old%');

CHANGE REPLICATION FILTER
    REPLICATE_WILD_IGNORE_TABLE = ('db1.new%', 'db2.new%');
```

Values used with `REPLICATE_REWRITE_DB` represent *pairs* of database names; each such value must be enclosed in parentheses. The following statement rewrites statements occurring on database `db1` on the source to database `db2` on the replica:

```sql
CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB = ((db1, db2));
```

The statement just shown contains two sets of parentheses, one enclosing the pair of database names, and the other enclosing the entire list. This is perhaps more easily seen in the following example, which creates two `rewrite-db` rules, one rewriting database `dbA` to `dbB`, and one rewriting database `dbC` to `dbD`:

```sql
CHANGE REPLICATION FILTER
  REPLICATE_REWRITE_DB = ((dbA, dbB), (dbC, dbD));
```

This statement leaves any existing replication filtering rules unchanged; to unset all filters of a given type, set the filter's value to an explicitly empty list, as shown in this example, which removes all existing `REPLICATE_DO_DB` and `REPLICATE_IGNORE_DB` rules:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (), REPLICATE_IGNORE_DB = ();
```

Setting a filter to empty in this way removes all existing rules, does not create any new ones, and does not restore any rules set at mysqld startup using `--replicate-*` options on the command line or in the configuration file.

Values employed with `REPLICATE_WILD_DO_TABLE` and `REPLICATE_WILD_IGNORE_TABLE` must be in the format `db_name.tbl_name`. Prior to MySQL 5.7.5, this was not strictly enforced, although using nonconforming values with these options could lead to erroneous results (Bug #18095449).

For more information, see [Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules").
