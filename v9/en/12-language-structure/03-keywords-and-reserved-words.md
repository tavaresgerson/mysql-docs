## 11.3 Keywords and Reserved Words

Keywords are words that have significance in SQL. Certain keywords, such as `SELECT`, `DELETE`, or `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), are reserved and require special treatment for use as identifiers such as table and column names. This may also be true for the names of built-in functions.

Most nonreserved keywords are permitted as identifiers without quoting. Some keywords which are otherwise considered nonreserved are restricted from use as unquoted identifiers for roles, stored program labels, or, in some cases, both. See MySQL 9.5 Restricted Keywords, for listings of these keywords.

Reserved words are permitted as identifiers if you quote them as described in Section 11.2, “Schema Object Names”:

```
mysql> CREATE TABLE interval (begin INT, end INT);
ERROR 1064 (42000): You have an error in your SQL syntax ...
near 'interval (begin INT, end INT)'
```

`BEGIN` and `END` are keywords but not reserved, so their use as identifiers does not require quoting. `INTERVAL` is a reserved keyword and must be quoted to be used as an identifier:

```
mysql> CREATE TABLE `interval` (begin INT, end INT);
Query OK, 0 rows affected (0.01 sec)
```

Exception: A word that follows a period in a qualified name must be an identifier, so it need not be quoted even if it is reserved:

```
mysql> CREATE TABLE mydb.interval (begin INT, end INT);
Query OK, 0 rows affected (0.01 sec)
```

Names of built-in functions are permitted as identifiers but may require care to be used as such. For example, `COUNT` is acceptable as a column name. However, by default, no whitespace is permitted in function invocations between the function name and the following `(` character. This requirement enables the parser to distinguish whether the name is used in a function call or in nonfunction context. For further details on recognition of function names, see Section 11.2.5, “Function Name Parsing and Resolution”.

The `INFORMATION_SCHEMA.KEYWORDS` table lists the words considered keywords by MySQL and indicates whether they are reserved. See Section 28.3.17, “The INFORMATION_SCHEMA KEYWORDS Table”.

* MySQL 9.5 Keywords and Reserved Words
* MySQL 9.5 New Keywords and Reserved Words
* MySQL 9.5 Removed Keywords and Reserved Words
* MySQL 9.5 Restricted Keywords

### MySQL 9.5 Keywords and Reserved Words

The following list shows the keywords and reserved words in MySQL 9.5, along with changes to individual words from version to version. Reserved keywords are marked with (R). In addition, `_FILENAME` is reserved.

At some point, you might upgrade to a higher version, so it is a good idea to have a look at future reserved words, too. You can find these in the manuals that cover higher versions of MySQL. Most of the reserved words in the list are forbidden by standard SQL as column or table names (for example, `GROUP`). A few are reserved because MySQL needs them and uses a **yacc** parser.

A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z

A

* `ABSENT`
* `ACCESSIBLE` (R)
* `ACCOUNT`
* `ACTION`
* `ACTIVE`
* `ADD` (R)
* `ADMIN`
* `AFTER`
* `AGAINST`
* `AGGREGATE`
* `ALGORITHM`
* `ALL` (R)
* `ALLOW_MISSING_FILES`
* `ALTER` (R)
* `ALWAYS`
* `ANALYZE` (R)
* `AND` (R)
* `ANY`
* `ARRAY`
* `AS` (R)
* `ASC` (R)
* `ASCII`
* `ASENSITIVE` (R)
* `AT`
* `ATTRIBUTE`
* `AUTHENTICATION`
* `AUTO`
* `AUTOEXTEND_SIZE`
* `AUTO_INCREMENT`
* `AUTO_REFRESH`
* `AUTO_REFRESH_SOURCE`
* `AVG`
* `AVG_ROW_LENGTH`

B

* `BACKUP`
* `BEFORE` (R)
* `BEGIN`
* `BERNOULLI`
* `BETWEEN` (R)
* `BIGINT` (R)
* `BINARY` (R)
* `BINLOG`
* `BIT`
* `BLOB` (R)
* `BLOCK`
* `BOOL`
* `BOOLEAN`
* `BOTH` (R)
* `BTREE`
* `BUCKETS`
* `BULK`
* `BY` (R)
* `BYTE`

C

* `CACHE`
* `CALL` (R)
* `CASCADE` (R)
* `CASCADED`
* `CASE` (R)
* `CATALOG_NAME`
* `CHAIN`
* `CHALLENGE_RESPONSE`
* `CHANGE` (R)
* `CHANGED`
* `CHANNEL`
* `CHAR` (R)
* `CHARACTER` (R)
* `CHARSET`
* `CHECK` (R)
* `CHECKSUM`
* `CIPHER`
* `CLASS_ORIGIN`
* `CLIENT`
* `CLONE`
* `CLOSE`
* `COALESCE`
* `CODE`
* `COLLATE` (R)
* `COLLATION`
* `COLUMN` (R)
* `COLUMNS`
* `COLUMN_FORMAT`
* `COLUMN_NAME`
* `COMMENT`
* `COMMIT`
* `COMMITTED`
* `COMPACT`
* `COMPLETION`
* `COMPONENT`
* `COMPRESSED`
* `COMPRESSION`
* `CONCURRENT`
* `CONDITION` (R)
* `CONNECTION`
* `CONSISTENT`
* `CONSTRAINT` (R)
* `CONSTRAINT_CATALOG`
* `CONSTRAINT_NAME`
* `CONSTRAINT_SCHEMA`
* `CONTAINS`
* `CONTEXT`
* `CONTINUE` (R)
* `CONVERT` (R)
* `CPU`
* `CREATE` (R)
* `CROSS` (R)
* `CUBE` (R)
* `CUME_DIST` (R)
* `CURRENT`
* `CURRENT_DATE` (R)
* `CURRENT_TIME` (R)
* `CURRENT_TIMESTAMP` (R)
* `CURRENT_USER` (R)
* `CURSOR` (R)
* `CURSOR_NAME`

D

* `DATA`
* `DATABASE` (R)
* `DATABASES` (R)
* `DATAFILE`
* `DATE`
* `DATETIME`
* `DAY`
* `DAY_HOUR` (R)
* `DAY_MICROSECOND` (R)
* `DAY_MINUTE` (R)
* `DAY_SECOND` (R)
* `DEALLOCATE`
* `DEC` (R)
* `DECIMAL` (R)
* `DECLARE` (R)
* `DEFAULT` (R)
* `DEFAULT_AUTH`
* `DEFINER`
* `DEFINITION`
* `DELAYED` (R)
* `DELAY_KEY_WRITE`
* `DELETE` (R)
* `DENSE_RANK` (R)
* `DESC` (R)
* `DESCRIBE` (R)
* `DESCRIPTION`
* `DETERMINISTIC` (R)
* `DIAGNOSTICS`
* `DIRECTORY`
* `DISABLE`
* `DISCARD`
* `DISK`
* `DISTINCT` (R)
* `DISTINCTROW` (R)
* `DIV` (R)
* `DO`
* `DOUBLE` (R)
* `DROP` (R)
* `DUAL` (R)
* `DUALITY`
* `DUMPFILE`
* `DUPLICATE`
* `DYNAMIC`

E

* `EACH` (R)
* `ELSE` (R)
* `ELSEIF` (R)
* `EMPTY` (R)
* `ENABLE`
* `ENCLOSED` (R)
* `ENCRYPTION`
* `END`
* `ENDS`
* `ENFORCED`
* `ENGINE`
* `ENGINES`
* `ENGINE_ATTRIBUTE`
* `ENUM`
* `ERROR`
* `ERRORS`
* `ESCAPE`
* `ESCAPED` (R)
* `EVENT`
* `EVENTS`
* `EVERY`
* `EXCEPT` (R)
* `EXCHANGE`
* `EXCLUDE`
* `EXECUTE`
* `EXISTS` (R)
* `EXIT` (R)
* `EXPANSION`
* `EXPIRE`
* `EXPLAIN` (R)
* `EXPORT`
* `EXTENDED`
* `EXTENT_SIZE`
* `EXTERNAL` (R)
* `EXTERNAL_FORMAT`

F

* `FACTOR`
* `FAILED_LOGIN_ATTEMPTS`
* `FALSE` (R)
* `FAST`
* `FAULTS`
* `FETCH` (R)
* `FIELDS`
* `FILE`
* `FILES`
* `FILE_BLOCK_SIZE`
* `FILE_FORMAT`
* `FILE_NAME`
* `FILE_PATTERN`
* `FILE_PREFIX`
* `FILTER`
* `FINISH`
* `FIRST`
* `FIRST_VALUE` (R)
* `FIXED`
* `FLOAT` (R)
* `FLOAT4` (R)
* `FLOAT8` (R)
* `FLUSH`
* `FOLLOWING`
* `FOLLOWS`
* `FOR` (R)
* `FORCE` (R)
* `FOREIGN` (R)
* `FORMAT`
* `FOUND`
* `FROM` (R)
* `FULL`
* `FULLTEXT` (R)
* `FUNCTION` (R)

G

* `GENERAL`
* `GENERATE`
* `GENERATED` (R)
* `GEOMCOLLECTION`
* `GEOMETRY`
* `GEOMETRYCOLLECTION`
* `GET` (R)
* `GET_FORMAT`
* `GET_SOURCE_PUBLIC_KEY`
* `GLOBAL`
* `GRANT` (R)
* `GRANTS`
* `GROUP` (R)
* `GROUPING` (R)
* `GROUPS` (R)
* `GROUP_REPLICATION`
* `GTIDS`
* `GTID_ONLY`
* `GUIDED`

H

* `HANDLER`
* `HASH`
* `HAVING` (R)
* `HEADER`
* `HELP`
* `HIGH_PRIORITY` (R)
* `HISTOGRAM`
* `HISTORY`
* `HOST`
* `HOSTS`
* `HOUR`
* `HOUR_MICROSECOND` (R)
* `HOUR_MINUTE` (R)
* `HOUR_SECOND` (R)

I

* `IDENTIFIED`
* `IF` (R)
* `IGNORE` (R)
* `IGNORE_SERVER_IDS`
* `IMPORT`
* `IN` (R)
* `INACTIVE`
* `INDEX` (R)
* `INDEXES`
* `INFILE` (R)
* `INITIAL`
* `INITIAL_SIZE`
* `INITIATE`
* `INNER` (R)
* `INOUT` (R)
* `INSENSITIVE` (R)
* `INSERT` (R)
* `INSERT_METHOD`
* `INSTALL`
* `INSTANCE`
* `INT` (R)
* `INT1` (R)
* `INT2` (R)
* `INT3` (R)
* `INT4` (R)
* `INT8` (R)
* `INTEGER` (R)
* `INTERSECT` (R)
* `INTERVAL` (R)
* `INTO` (R)
* `INVISIBLE`
* `INVOKER`
* `IO`
* `IO_AFTER_GTIDS` (R)
* `IO_BEFORE_GTIDS` (R)
* `IO_THREAD`
* `IPC`
* `IS` (R)
* `ISOLATION`
* `ISSUER`
* `ITERATE` (R)

J

* `JOIN` (R)
* `JSON`
* `JSON_TABLE` (R)
* `JSON_VALUE`

K

* `KEY` (R)
* `KEYRING`
* `KEYS` (R)
* `KEY_BLOCK_SIZE`
* `KILL` (R)

L

* `LAG` (R)
* `LANGUAGE`
* `LAST`
* `LAST_VALUE` (R)
* `LATERAL` (R)
* `LEAD` (R)
* `LEADING` (R)
* `LEAVE` (R)
* `LEAVES`
* `LEFT` (R)
* `LESS`
* `LEVEL`
* `LIBRARY` (R)
* `LIKE` (R)
* `LIMIT` (R)
* `LINEAR` (R)
* `LINES` (R)
* `LINESTRING`
* `LIST`
* `LOAD` (R)
* `LOCAL`
* `LOCALTIME` (R)
* `LOCALTIMESTAMP` (R)
* `LOCK` (R)
* `LOCKED`
* `LOCKS`
* `LOG`
* `LOGFILE`
* `LOGS`
* `LONG` (R)
* `LONGBLOB` (R)
* `LONGTEXT` (R)
* `LOOP` (R)
* `LOW_PRIORITY` (R)

M

* `MANUAL` (R)
* `MASTER`
* `MATCH` (R)
* `MATERIALIZED`
* `MAXVALUE` (R)
* `MAX_CONNECTIONS_PER_HOUR`
* `MAX_QUERIES_PER_HOUR`
* `MAX_ROWS`
* `MAX_SIZE`
* `MAX_UPDATES_PER_HOUR`
* `MAX_USER_CONNECTIONS`
* `MEDIUM`
* `MEDIUMBLOB` (R)
* `MEDIUMINT` (R)
* `MEDIUMTEXT` (R)
* `MEMBER`
* `MEMORY`
* `MERGE`
* `MESSAGE_TEXT`
* `MICROSECOND`
* `MIDDLEINT` (R)
* `MIGRATE`
* `MINUTE`
* `MINUTE_MICROSECOND` (R)
* `MINUTE_SECOND` (R)
* `MIN_ROWS`
* `MOD` (R)
* `MODE`
* `MODIFIES` (R)
* `MODIFY`
* `MONTH`
* `MULTILINESTRING`
* `MULTIPOINT`
* `MULTIPOLYGON`
* `MUTEX`
* `MYSQL_ERRNO`

N

* `NAME`
* `NAMES`
* `NATIONAL`
* `NATURAL` (R)
* `NCHAR`
* `NDB`
* `NDBCLUSTER`
* `NESTED`
* `NETWORK_NAMESPACE`
* `NEVER`
* `NEW`
* `NEXT`
* `NO`
* `NODEGROUP`
* `NONE`
* `NOT` (R)
* `NOWAIT`
* `NO_WAIT`
* `NO_WRITE_TO_BINLOG` (R)
* `NTH_VALUE` (R)
* `NTILE` (R)
* `NULL` (R)
* `NULLS`
* `NUMBER`
* `NUMERIC` (R)
* `NVARCHAR`

O

* `OF` (R)
* `OFF`
* `OFFSET`
* `OJ`
* `OLD`
* `ON` (R)
* `ONE`
* `ONLY`
* `OPEN`
* `OPTIMIZE` (R)
* `OPTIMIZER_COSTS` (R)
* `OPTION` (R)
* `OPTIONAL`
* `OPTIONALLY` (R)
* `OPTIONS`
* `OR` (R)
* `ORDER` (R)
* `ORDINALITY`
* `ORGANIZATION`
* `OTHERS`
* `OUT` (R)
* `OUTER` (R)
* `OUTFILE` (R)
* `OVER` (R)
* `OWNER`

P

* `PACK_KEYS`
* `PAGE`
* `PARALLEL` (R)
* `PARAMETERS`
* `PARSER`
* `PARSE_TREE`
* `PARTIAL`
* `PARTITION` (R)
* `PARTITIONING`
* `PARTITIONS`
* `PASSWORD`
* `PASSWORD_LOCK_TIME`
* `PATH`
* `PERCENT_RANK` (R)
* `PERSIST`
* `PERSIST_ONLY`
* `PHASE`
* `PLUGIN`
* `PLUGINS`
* `PLUGIN_DIR`
* `POINT`
* `POLYGON`
* `PORT`
* `PRECEDES`
* `PRECEDING`
* `PRECISION` (R)
* `PREPARE`
* `PRESERVE`
* `PREV`
* `PRIMARY` (R)
* `PRIVILEGES`
* `PRIVILEGE_CHECKS_USER`
* `PROCEDURE` (R)
* `PROCESS`
* `PROCESSLIST`
* `PROFILE`
* `PROFILES`
* `PROXY`
* `PURGE` (R)

Q

* `QUALIFY` (R)
* `QUARTER`
* `QUERY`
* `QUICK`

R

* `RANDOM`
* `RANGE` (R)
* `RANK` (R)
* `READ` (R)
* `READS` (R)
* `READ_ONLY`
* `READ_WRITE` (R)
* `REAL` (R)
* `REBUILD`
* `RECOVER`
* `RECURSIVE` (R)
* `REDO_BUFFER_SIZE`
* `REDUNDANT`
* `REFERENCE`
* `REFERENCES` (R)
* `REGEXP` (R)
* `REGISTRATION`
* `RELATIONAL`
* `RELAY`
* `RELAYLOG`
* `RELAY_LOG_FILE`
* `RELAY_LOG_POS`
* `RELAY_THREAD`
* `RELEASE` (R)
* `RELOAD`
* `REMOVE`
* `RENAME` (R)
* `REORGANIZE`
* `REPAIR`
* `REPEAT` (R)
* `REPEATABLE`
* `REPLACE` (R)
* `REPLICA`
* `REPLICAS`
* `REPLICATE_DO_DB`
* `REPLICATE_DO_TABLE`
* `REPLICATE_IGNORE_DB`
* `REPLICATE_IGNORE_TABLE`
* `REPLICATE_REWRITE_DB`
* `REPLICATE_WILD_DO_TABLE`
* `REPLICATE_WILD_IGNORE_TABLE`
* `REPLICATION`
* `REQUIRE` (R)
* `REQUIRE_ROW_FORMAT`
* `RESET`
* `RESIGNAL` (R)
* `RESOURCE`
* `RESPECT`
* `RESTART`
* `RESTORE`
* `RESTRICT` (R)
* `RESUME`
* `RETAIN`
* `RETURN` (R)
* `RETURNED_SQLSTATE`
* `RETURNING`
* `RETURNS`
* `REUSE`
* `REVERSE`
* `REVOKE` (R)
* `RIGHT` (R)
* `RLIKE` (R)
* `ROLE`
* `ROLLBACK`
* `ROLLUP`
* `ROTATE`
* `ROUTINE`
* `ROW` (R)
* `ROWS` (R)
* `ROW_COUNT`
* `ROW_FORMAT`
* `ROW_NUMBER` (R)
* `RTREE`

S

* `S3`
* `SAVEPOINT`
* `SCHEDULE`
* `SCHEMA` (R)
* `SCHEMAS` (R)
* `SCHEMA_NAME`
* `SECOND`
* `SECONDARY`
* `SECONDARY_ENGINE`
* `SECONDARY_ENGINE_ATTRIBUTE`
* `SECONDARY_LOAD`
* `SECONDARY_UNLOAD`
* `SECOND_MICROSECOND` (R)
* `SECURITY`
* `SELECT` (R)
* `SENSITIVE` (R)
* `SEPARATOR` (R)
* `SERIAL`
* `SERIALIZABLE`
* `SERVER`
* `SESSION`
* `SET` (R)
* `SHARE`
* `SHOW` (R)
* `SHUTDOWN`
* `SIGNAL` (R)
* `SIGNED`
* `SIMPLE`
* `SKIP`
* `SLAVE`
* `SLOW`
* `SMALLINT` (R)
* `SNAPSHOT`
* `SOCKET`
* `SOME`
* `SONAME`
* `SOUNDS`
* `SOURCE`
* `SOURCE_AUTO_POSITION`
* `SOURCE_BIND`
* `SOURCE_COMPRESSION_ALGORITHMS`
* `SOURCE_CONNECT_RETRY`
* `SOURCE_DELAY`
* `SOURCE_HEARTBEAT_PERIOD`
* `SOURCE_HOST`
* `SOURCE_LOG_FILE`
* `SOURCE_LOG_POS`
* `SOURCE_PASSWORD`
* `SOURCE_PORT`
* `SOURCE_PUBLIC_KEY_PATH`
* `SOURCE_RETRY_COUNT`
* `SOURCE_SSL`
* `SOURCE_SSL_CA`
* `SOURCE_SSL_CAPATH`
* `SOURCE_SSL_CERT`
* `SOURCE_SSL_CIPHER`
* `SOURCE_SSL_CRL`
* `SOURCE_SSL_CRLPATH`
* `SOURCE_SSL_KEY`
* `SOURCE_SSL_VERIFY_SERVER_CERT`
* `SOURCE_TLS_CIPHERSUITES`
* `SOURCE_TLS_VERSION`
* `SOURCE_USER`
* `SOURCE_ZSTD_COMPRESSION_LEVEL`
* `SPATIAL` (R)
* `SPECIFIC` (R)
* `SQL` (R)
* `SQLEXCEPTION` (R)
* `SQLSTATE` (R)
* `SQLWARNING` (R)
* `SQL_AFTER_GTIDS`
* `SQL_AFTER_MTS_GAPS`
* `SQL_BEFORE_GTIDS`
* `SQL_BIG_RESULT` (R)
* `SQL_BUFFER_RESULT`
* `SQL_CALC_FOUND_ROWS` (R)
* `SQL_NO_CACHE`
* `SQL_SMALL_RESULT` (R)
* `SQL_THREAD`
* `SQL_TSI_DAY`
* `SQL_TSI_HOUR`
* `SQL_TSI_MINUTE`
* `SQL_TSI_MONTH`
* `SQL_TSI_QUARTER`
* `SQL_TSI_SECOND`
* `SQL_TSI_WEEK`
* `SQL_TSI_YEAR`
* `SRID`
* `SSL` (R)
* `STACKED`
* `START`
* `STARTING` (R)
* `STARTS`
* `STATS_AUTO_RECALC`
* `STATS_PERSISTENT`
* `STATS_SAMPLE_PAGES`
* `STATUS`
* `STOP`
* `STORAGE`
* `STORED` (R)
* `STRAIGHT_JOIN` (R)
* `STREAM`
* `STRICT_LOAD`
* `STRING`
* `SUBCLASS_ORIGIN`
* `SUBJECT`
* `SUBPARTITION`
* `SUBPARTITIONS`
* `SUPER`
* `SUSPEND`
* `SWAPS`
* `SWITCHES`
* `SYSTEM` (R)

T

* `TABLE` (R)
* `TABLES`
* `TABLESAMPLE` (R)
* `TABLESPACE`
* `TABLE_CHECKSUM`
* `TABLE_NAME`
* `TEMPORARY`
* `TEMPTABLE`
* `TERMINATED` (R)
* `TEXT`
* `THAN`
* `THEN` (R)
* `THREAD_PRIORITY`
* `TIES`
* `TIME`
* `TIMESTAMP`
* `TIMESTAMPADD`
* `TIMESTAMPDIFF`
* `TINYBLOB` (R)
* `TINYINT` (R)
* `TINYTEXT` (R)
* `TLS`
* `TO` (R)
* `TRAILING` (R)
* `TRANSACTION`
* `TRIGGER` (R)
* `TRIGGERS`
* `TRUE` (R)
* `TRUNCATE`
* `TYPE`
* `TYPES`

U

* `UNBOUNDED`
* `UNCOMMITTED`
* `UNDEFINED`
* `UNDO` (R)
* `UNDOFILE`
* `UNDO_BUFFER_SIZE`
* `UNICODE`
* `UNINSTALL`
* `UNION` (R)
* `UNIQUE` (R)
* `UNKNOWN`
* `UNLOCK` (R)
* `UNREGISTER`
* `UNSIGNED` (R)
* `UNTIL`
* `UPDATE` (R)
* `UPGRADE`
* `URI`
* `URL`
* `USAGE` (R)
* `USE` (R)
* `USER`
* `USER_RESOURCES`
* `USE_FRM`
* `USING` (R)
* `UTC_DATE` (R)
* `UTC_TIME` (R)
* `UTC_TIMESTAMP` (R)

V

* `VALIDATION`
* `VALUE`
* `VALUES` (R)
* `VARBINARY` (R)
* `VARCHAR` (R)
* `VARCHARACTER` (R)
* `VARIABLES`
* `VARYING` (R)
* `VCPU`
* `VECTOR`
* `VERIFY_KEY_CONSTRAINTS`
* `VIEW`
* `VIRTUAL` (R)
* `VISIBLE`

W

* `WAIT`
* `WARNINGS`
* `WEEK`
* `WEIGHT_STRING`
* `WHEN` (R)
* `WHERE` (R)
* `WHILE` (R)
* `WINDOW` (R)
* `WITH` (R)
* `WITHOUT`
* `WORK`
* `WRAPPER`
* `WRITE` (R)

X

* `X509`
* `XA`
* `XID`
* `XML`
* `XOR` (R)

Y

* `YEAR`
* `YEAR_MONTH` (R)

Z

* `ZEROFILL` (R)
* `ZONE`

### MySQL 9.5 New Keywords and Reserved Words

The following list shows the keywords and reserved words that are added in MySQL 9.5, compared to MySQL 8.4. Reserved keywords are marked with (R).

A | D | E | F | G | H | L | M | P | R | S | U | V

A

* `ABSENT`
* `ALLOW_MISSING_FILES`
* `AUTO_REFRESH`
* `AUTO_REFRESH_SOURCE`

D

* `DUALITY`

E

* `EXTERNAL` (R)
* `EXTERNAL_FORMAT`

F

* `FILES`
* `FILE_FORMAT`
* `FILE_NAME`
* `FILE_PATTERN`
* `FILE_PREFIX`

G

* `GUIDED`

H

* `HEADER`

L

* `LIBRARY` (R)

M

* `MATERIALIZED`

P

* `PARAMETERS`

R

* `RELATIONAL`

S

* `STRICT_LOAD`

U

* `URI`

V

* `VECTOR`
* `VERIFY_KEY_CONSTRAINTS`

### MySQL 9.5 Removed Keywords and Reserved Words

The following list shows the keywords and reserved words that are removed in MySQL 9.5, compared to MySQL 8.4. Reserved keywords are marked with (R).

There are no keywords removed between MySQL 8.4-9.5.

### MySQL 9.5 Restricted Keywords

Some MySQL keywords are not reserved but even so must be quoted in certain circumstances. This section provides listings of these keywords.

* Keywords which must be quoted when used as labels
* Keywords which must be quoted when used as role names
* Keywords which must be quoted when used as labels or role names

#### Keywords which must be quoted when used as labels

The keywords listed here must be quoted when used as labels in MySQL stored programs:

A | B | C | D | E | F | H | I | L | N | P | R | S | T | U | X

A

* `ASCII`

B

* `BEGIN`
* `BINLOG`
* `BYTE`

C

* `CACHE`
* `CHARSET`
* `CHECKSUM`
* `CLONE`
* `COMMENT`
* `COMMIT`
* `CONTAINS`

D

* `DEALLOCATE`
* `DO`

E

* `END`

F

* `FLUSH`
* `FOLLOWS`

H

* `HANDLER`
* `HELP`

I

* `IMPORT`
* `INSTALL`

L

* `LANGUAGE`

N

* `NO`

P

* `PRECEDES`
* `PREPARE`

R

* `REPAIR`
* `RESET`
* `ROLLBACK`

S

* `SAVEPOINT`
* `SIGNED`
* `SLAVE`
* `START`
* `STOP`

T

* `TRUNCATE`

U

* `UNICODE`
* `UNINSTALL`

X

* `XA`

#### Keywords which must be quoted when used as role names

The keywords listed here must be quoted when used as names of roles:

* `EVENT`
* `FILE`
* `NONE`
* `PROCESS`
* `PROXY`
* `RELOAD`
* `REPLICATION`
* `RESOURCE`
* `SUPER`

#### Keywords which must be quoted when used as labels or role names

The keywords listed here must be quoted when used as labels in stored programs, or as names of roles:

* `EXECUTE`
* `RESTART`
* `SHUTDOWN`
