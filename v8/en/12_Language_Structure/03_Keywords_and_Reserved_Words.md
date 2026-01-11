## 11.3 Keywords and Reserved Words

Keywords are words that have significance in SQL. Certain keywords, such as `SELECT`, `DELETE`, or `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), are reserved and require special treatment for use as identifiers such as table and column names. This may also be true for the names of built-in functions.

Most nonreserved keywords are permitted as identifiers without quoting. Some keywords which are otherwise considered nonreserved are restricted from use as unquoted identifiers for roles, stored program labels, or, in some cases, both. See MySQL 8.0 Restricted Keywords, for listings of these keywords.

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

* MySQL 8.0 Keywords and Reserved Words
* MySQL 8.0 New Keywords and Reserved Words
* MySQL 8.0 Removed Keywords and Reserved Words
* MySQL 8.0 Restricted Keywords

### MySQL 8.0 Keywords and Reserved Words

The following list shows the keywords and reserved words in MySQL 8.0, along with changes to individual words from version to version. Reserved keywords are marked with (R). In addition, `_FILENAME` is reserved.

At some point, you might upgrade to a higher version, so it is a good idea to have a look at future reserved words, too. You can find these in the manuals that cover higher versions of MySQL. Most of the reserved words in the list are forbidden by standard SQL as column or table names (for example, `GROUP`). A few are reserved because MySQL needs them and uses a **yacc** parser.

A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z

A

* `ACCESSIBLE` (R)
* `ACCOUNT`
* `ACTION`
* `ACTIVE`; added in 8.0.14 (nonreserved)
* `ADD` (R)
* `ADMIN`; became nonreserved in 8.0.12
* `AFTER`
* `AGAINST`
* `AGGREGATE`
* `ALGORITHM`
* `ALL` (R)
* `ALTER` (R)
* `ALWAYS`
* `ANALYSE`; removed in 8.0.1
* `ANALYZE` (R)
* `AND` (R)
* `ANY`
* `ARRAY`; added in 8.0.17 (reserved); became nonreserved in 8.0.19
* `AS` (R)
* `ASC` (R)
* `ASCII`
* `ASENSITIVE` (R)
* `AT`
* `ATTRIBUTE`; added in 8.0.21 (nonreserved)
* `AUTHENTICATION`; added in 8.0.27 (nonreserved)
* `AUTOEXTEND_SIZE`
* `AUTO_INCREMENT`
* `AVG`
* `AVG_ROW_LENGTH`

B

* `BACKUP`
* `BEFORE` (R)
* `BEGIN`
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
* `BUCKETS`; added in 8.0.2 (nonreserved)
* `BULK`; added in 8.0.32 (nonreserved)
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
* `CHALLENGE_RESPONSE`; added in 8.0.27 (nonreserved)
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
* `CLONE`; added in 8.0.3 (nonreserved)
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
* `CUBE` (R); became reserved in 8.0.1
* `CUME_DIST` (R); added in 8.0.2 (reserved)
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
* `DEFINITION`; added in 8.0.4 (nonreserved)
* `DELAYED` (R)
* `DELAY_KEY_WRITE`
* `DELETE` (R)
* `DENSE_RANK` (R); added in 8.0.2 (reserved)
* `DESC` (R)
* `DESCRIBE` (R)
* `DESCRIPTION`; added in 8.0.4 (nonreserved)
* `DES_KEY_FILE`; removed in 8.0.3
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
* `DUMPFILE`
* `DUPLICATE`
* `DYNAMIC`

E

* `EACH` (R)
* `ELSE` (R)
* `ELSEIF` (R)
* `EMPTY` (R); added in 8.0.4 (reserved)
* `ENABLE`
* `ENCLOSED` (R)
* `ENCRYPTION`
* `END`
* `ENDS`
* `ENFORCED`; added in 8.0.16 (nonreserved)
* `ENGINE`
* `ENGINES`
* `ENGINE_ATTRIBUTE`; added in 8.0.21 (nonreserved)
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
* `EXCLUDE`; added in 8.0.2 (nonreserved)
* `EXECUTE`
* `EXISTS` (R)
* `EXIT` (R)
* `EXPANSION`
* `EXPIRE`
* `EXPLAIN` (R)
* `EXPORT`
* `EXTENDED`
* `EXTENT_SIZE`

F

* `FACTOR`; added in 8.0.27 (nonreserved)
* `FAILED_LOGIN_ATTEMPTS`; added in 8.0.19 (nonreserved)
* `FALSE` (R)
* `FAST`
* `FAULTS`
* `FETCH` (R)
* `FIELDS`
* `FILE`
* `FILE_BLOCK_SIZE`
* `FILTER`
* `FINISH`; added in 8.0.27 (nonreserved)
* `FIRST`
* `FIRST_VALUE` (R); added in 8.0.2 (reserved)
* `FIXED`
* `FLOAT` (R)
* `FLOAT4` (R)
* `FLOAT8` (R)
* `FLUSH`
* `FOLLOWING`; added in 8.0.2 (nonreserved)
* `FOLLOWS`
* `FOR` (R)
* `FORCE` (R)
* `FOREIGN` (R)
* `FORMAT`
* `FOUND`
* `FROM` (R)
* `FULL`
* `FULLTEXT` (R)
* `FUNCTION` (R); became reserved in 8.0.1

G

* `GENERAL`
* `GENERATE`; added in 8.0.32 (nonreserved)
* `GENERATED` (R)
* `GEOMCOLLECTION`; added in 8.0.11 (nonreserved)
* `GEOMETRY`
* `GEOMETRYCOLLECTION`
* `GET` (R)
* `GET_FORMAT`
* `GET_MASTER_PUBLIC_KEY`; added in 8.0.4 (reserved); became nonreserved in 8.0.11
* `GET_SOURCE_PUBLIC_KEY`; added in 8.0.23 (nonreserved)
* `GLOBAL`
* `GRANT` (R)
* `GRANTS`
* `GROUP` (R)
* `GROUPING` (R); added in 8.0.1 (reserved)
* `GROUPS` (R); added in 8.0.2 (reserved)
* `GROUP_REPLICATION`
* `GTID_ONLY`; added in 8.0.27 (nonreserved)

H

* `HANDLER`
* `HASH`
* `HAVING` (R)
* `HELP`
* `HIGH_PRIORITY` (R)
* `HISTOGRAM`; added in 8.0.2 (nonreserved)
* `HISTORY`; added in 8.0.3 (nonreserved)
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
* `INACTIVE`; added in 8.0.14 (nonreserved)
* `INDEX` (R)
* `INDEXES`
* `INFILE` (R)
* `INITIAL`; added in 8.0.27 (nonreserved)
* `INITIAL_SIZE`
* `INITIATE`; added in 8.0.27 (nonreserved)
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
* `INTERSECT` (R); added in 8.0.31 (reserved)
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
* `JSON_TABLE` (R); added in 8.0.4 (reserved)
* `JSON_VALUE`; added in 8.0.21 (nonreserved)

K

* `KEY` (R)
* `KEYRING`; added in 8.0.24 (nonreserved)
* `KEYS` (R)
* `KEY_BLOCK_SIZE`
* `KILL` (R)

L

* `LAG` (R); added in 8.0.2 (reserved)
* `LANGUAGE`
* `LAST`
* `LAST_VALUE` (R); added in 8.0.2 (reserved)
* `LATERAL` (R); added in 8.0.14 (reserved)
* `LEAD` (R); added in 8.0.2 (reserved)
* `LEADING` (R)
* `LEAVE` (R)
* `LEAVES`
* `LEFT` (R)
* `LESS`
* `LEVEL`
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
* `LOCKED`; added in 8.0.1 (nonreserved)
* `LOCKS`
* `LOGFILE`
* `LOGS`
* `LONG` (R)
* `LONGBLOB` (R)
* `LONGTEXT` (R)
* `LOOP` (R)
* `LOW_PRIORITY` (R)

M

* `MASTER`
* `MASTER_AUTO_POSITION`
* `MASTER_BIND` (R)
* `MASTER_COMPRESSION_ALGORITHMS`; added in 8.0.18 (nonreserved)
* `MASTER_CONNECT_RETRY`
* `MASTER_DELAY`
* `MASTER_HEARTBEAT_PERIOD`
* `MASTER_HOST`
* `MASTER_LOG_FILE`
* `MASTER_LOG_POS`
* `MASTER_PASSWORD`
* `MASTER_PORT`
* `MASTER_PUBLIC_KEY_PATH`; added in 8.0.4 (nonreserved)
* `MASTER_RETRY_COUNT`
* `MASTER_SERVER_ID`; removed in 8.0.23
* `MASTER_SSL`
* `MASTER_SSL_CA`
* `MASTER_SSL_CAPATH`
* `MASTER_SSL_CERT`
* `MASTER_SSL_CIPHER`
* `MASTER_SSL_CRL`
* `MASTER_SSL_CRLPATH`
* `MASTER_SSL_KEY`
* `MASTER_SSL_VERIFY_SERVER_CERT` (R)
* `MASTER_TLS_CIPHERSUITES`; added in 8.0.19 (nonreserved)
* `MASTER_TLS_VERSION`
* `MASTER_USER`
* `MASTER_ZSTD_COMPRESSION_LEVEL`; added in 8.0.18 (nonreserved)
* `MATCH` (R)
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
* `MEMBER`; added in 8.0.17 (reserved); became nonreserved in 8.0.19
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
* `NESTED`; added in 8.0.4 (nonreserved)
* `NETWORK_NAMESPACE`; added in 8.0.16 (nonreserved)
* `NEVER`
* `NEW`
* `NEXT`
* `NO`
* `NODEGROUP`
* `NONE`
* `NOT` (R)
* `NOWAIT`; added in 8.0.1 (nonreserved)
* `NO_WAIT`
* `NO_WRITE_TO_BINLOG` (R)
* `NTH_VALUE` (R); added in 8.0.2 (reserved)
* `NTILE` (R); added in 8.0.2 (reserved)
* `NULL` (R)
* `NULLS`; added in 8.0.2 (nonreserved)
* `NUMBER`
* `NUMERIC` (R)
* `NVARCHAR`

O

* `OF` (R); added in 8.0.1 (reserved)
* `OFF`; added in 8.0.20 (nonreserved)
* `OFFSET`
* `OJ`; added in 8.0.16 (nonreserved)
* `OLD`; added in 8.0.14 (nonreserved)
* `ON` (R)
* `ONE`
* `ONLY`
* `OPEN`
* `OPTIMIZE` (R)
* `OPTIMIZER_COSTS` (R)
* `OPTION` (R)
* `OPTIONAL`; added in 8.0.13 (nonreserved)
* `OPTIONALLY` (R)
* `OPTIONS`
* `OR` (R)
* `ORDER` (R)
* `ORDINALITY`; added in 8.0.4 (nonreserved)
* `ORGANIZATION`; added in 8.0.4 (nonreserved)
* `OTHERS`; added in 8.0.2 (nonreserved)
* `OUT` (R)
* `OUTER` (R)
* `OUTFILE` (R)
* `OVER` (R); added in 8.0.2 (reserved)
* `OWNER`

P

* `PACK_KEYS`
* `PAGE`
* `PARSER`
* `PARTIAL`
* `PARTITION` (R)
* `PARTITIONING`
* `PARTITIONS`
* `PASSWORD`
* `PASSWORD_LOCK_TIME`; added in 8.0.19 (nonreserved)
* `PATH`; added in 8.0.4 (nonreserved)
* `PERCENT_RANK` (R); added in 8.0.2 (reserved)
* `PERSIST`; became nonreserved in 8.0.16
* `PERSIST_ONLY`; added in 8.0.2 (reserved); became nonreserved in 8.0.16
* `PHASE`
* `PLUGIN`
* `PLUGINS`
* `PLUGIN_DIR`
* `POINT`
* `POLYGON`
* `PORT`
* `PRECEDES`
* `PRECEDING`; added in 8.0.2 (nonreserved)
* `PRECISION` (R)
* `PREPARE`
* `PRESERVE`
* `PREV`
* `PRIMARY` (R)
* `PRIVILEGES`
* `PRIVILEGE_CHECKS_USER`; added in 8.0.18 (nonreserved)
* `PROCEDURE` (R)
* `PROCESS`; added in 8.0.11 (nonreserved)
* `PROCESSLIST`
* `PROFILE`
* `PROFILES`
* `PROXY`
* `PURGE` (R)

Q

* `QUARTER`
* `QUERY`
* `QUICK`

R

* `RANDOM`; added in 8.0.18 (nonreserved)
* `RANGE` (R)
* `RANK` (R); added in 8.0.2 (reserved)
* `READ` (R)
* `READS` (R)
* `READ_ONLY`
* `READ_WRITE` (R)
* `REAL` (R)
* `REBUILD`
* `RECOVER`
* `RECURSIVE` (R); added in 8.0.1 (reserved)
* `REDOFILE`; removed in 8.0.3
* `REDO_BUFFER_SIZE`
* `REDUNDANT`
* `REFERENCE`; added in 8.0.4 (nonreserved)
* `REFERENCES` (R)
* `REGEXP` (R)
* `REGISTRATION`; added in 8.0.27 (nonreserved)
* `RELAY`
* `RELAYLOG`
* `RELAY_LOG_FILE`
* `RELAY_LOG_POS`
* `RELAY_THREAD`
* `RELEASE` (R)
* `RELOAD`
* `REMOTE`; added in 8.0.3 (nonreserved); removed in 8.0.14
* `REMOVE`
* `RENAME` (R)
* `REORGANIZE`
* `REPAIR`
* `REPEAT` (R)
* `REPEATABLE`
* `REPLACE` (R)
* `REPLICA`; added in 8.0.22 (nonreserved)
* `REPLICAS`; added in 8.0.22 (nonreserved)
* `REPLICATE_DO_DB`
* `REPLICATE_DO_TABLE`
* `REPLICATE_IGNORE_DB`
* `REPLICATE_IGNORE_TABLE`
* `REPLICATE_REWRITE_DB`
* `REPLICATE_WILD_DO_TABLE`
* `REPLICATE_WILD_IGNORE_TABLE`
* `REPLICATION`
* `REQUIRE` (R)
* `REQUIRE_ROW_FORMAT`; added in 8.0.19 (nonreserved)
* `RESET`
* `RESIGNAL` (R)
* `RESOURCE`; added in 8.0.3 (nonreserved)
* `RESPECT`; added in 8.0.2 (nonreserved)
* `RESTART`; added in 8.0.4 (nonreserved)
* `RESTORE`
* `RESTRICT` (R)
* `RESUME`
* `RETAIN`; added in 8.0.14 (nonreserved)
* `RETURN` (R)
* `RETURNED_SQLSTATE`
* `RETURNING`; added in 8.0.21 (nonreserved)
* `RETURNS`
* `REUSE`; added in 8.0.3 (nonreserved)
* `REVERSE`
* `REVOKE` (R)
* `RIGHT` (R)
* `RLIKE` (R)
* `ROLE`; became nonreserved in 8.0.1
* `ROLLBACK`
* `ROLLUP`
* `ROTATE`
* `ROUTINE`
* `ROW` (R); became reserved in 8.0.2
* `ROWS` (R); became reserved in 8.0.2
* `ROW_COUNT`
* `ROW_FORMAT`
* `ROW_NUMBER` (R); added in 8.0.2 (reserved)
* `RTREE`

S

* `SAVEPOINT`
* `SCHEDULE`
* `SCHEMA` (R)
* `SCHEMAS` (R)
* `SCHEMA_NAME`
* `SECOND`
* `SECONDARY`; added in 8.0.16 (nonreserved)
* `SECONDARY_ENGINE`; added in 8.0.13 (nonreserved)
* `SECONDARY_ENGINE_ATTRIBUTE`; added in 8.0.21 (nonreserved)
* `SECONDARY_LOAD`; added in 8.0.13 (nonreserved)
* `SECONDARY_UNLOAD`; added in 8.0.13 (nonreserved)
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
* `SKIP`; added in 8.0.1 (nonreserved)
* `SLAVE`
* `SLOW`
* `SMALLINT` (R)
* `SNAPSHOT`
* `SOCKET`
* `SOME`
* `SONAME`
* `SOUNDS`
* `SOURCE`
* `SOURCE_AUTO_POSITION`; added in 8.0.23 (nonreserved)
* `SOURCE_BIND`; added in 8.0.23 (nonreserved)
* `SOURCE_COMPRESSION_ALGORITHMS`; added in 8.0.23 (nonreserved)
* `SOURCE_CONNECT_RETRY`; added in 8.0.23 (nonreserved)
* `SOURCE_DELAY`; added in 8.0.23 (nonreserved)
* `SOURCE_HEARTBEAT_PERIOD`; added in 8.0.23 (nonreserved)
* `SOURCE_HOST`; added in 8.0.23 (nonreserved)
* `SOURCE_LOG_FILE`; added in 8.0.23 (nonreserved)
* `SOURCE_LOG_POS`; added in 8.0.23 (nonreserved)
* `SOURCE_PASSWORD`; added in 8.0.23 (nonreserved)
* `SOURCE_PORT`; added in 8.0.23 (nonreserved)
* `SOURCE_PUBLIC_KEY_PATH`; added in 8.0.23 (nonreserved)
* `SOURCE_RETRY_COUNT`; added in 8.0.23 (nonreserved)
* `SOURCE_SSL`; added in 8.0.23 (nonreserved)
* `SOURCE_SSL_CA`; added in 8.0.23 (nonreserved)
* `SOURCE_SSL_CAPATH`; added in 8.0.23 (nonreserved)
* `SOURCE_SSL_CERT`; added in 8.0.23 (nonreserved)
* `SOURCE_SSL_CIPHER`; added in 8.0.23 (nonreserved)
* `SOURCE_SSL_CRL`; added in 8.0.23 (nonreserved)
* `SOURCE_SSL_CRLPATH`; added in 8.0.23 (nonreserved)
* `SOURCE_SSL_KEY`; added in 8.0.23 (nonreserved)
* `SOURCE_SSL_VERIFY_SERVER_CERT`; added in 8.0.23 (nonreserved)
* `SOURCE_TLS_CIPHERSUITES`; added in 8.0.23 (nonreserved)
* `SOURCE_TLS_VERSION`; added in 8.0.23 (nonreserved)
* `SOURCE_USER`; added in 8.0.23 (nonreserved)
* `SOURCE_ZSTD_COMPRESSION_LEVEL`; added in 8.0.23 (nonreserved)
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
* `SQL_CACHE`; removed in 8.0.3
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
* `SRID`; added in 8.0.3 (nonreserved)
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
* `STREAM`; added in 8.0.20 (nonreserved)
* `STRING`
* `SUBCLASS_ORIGIN`
* `SUBJECT`
* `SUBPARTITION`
* `SUBPARTITIONS`
* `SUPER`
* `SUSPEND`
* `SWAPS`
* `SWITCHES`
* `SYSTEM` (R); added in 8.0.3 (reserved)

T

* `TABLE` (R)
* `TABLES`
* `TABLESPACE`
* `TABLE_CHECKSUM`
* `TABLE_NAME`
* `TEMPORARY`
* `TEMPTABLE`
* `TERMINATED` (R)
* `TEXT`
* `THAN`
* `THEN` (R)
* `THREAD_PRIORITY`; added in 8.0.3 (nonreserved)
* `TIES`; added in 8.0.2 (nonreserved)
* `TIME`
* `TIMESTAMP`
* `TIMESTAMPADD`
* `TIMESTAMPDIFF`
* `TINYBLOB` (R)
* `TINYINT` (R)
* `TINYTEXT` (R)
* `TLS`; added in 8.0.21 (nonreserved)
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

* `UNBOUNDED`; added in 8.0.2 (nonreserved)
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
* `UNREGISTER`; added in 8.0.27 (nonreserved)
* `UNSIGNED` (R)
* `UNTIL`
* `UPDATE` (R)
* `UPGRADE`
* `URL`; added in 8.0.32 (nonreserved)
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
* `VCPU`; added in 8.0.3 (nonreserved)
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
* `WINDOW` (R); added in 8.0.2 (reserved)
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
* `ZONE`; added in 8.0.22 (nonreserved)

### MySQL 8.0 New Keywords and Reserved Words

The following list shows the keywords and reserved words that are added in MySQL 8.0, compared to MySQL 5.7. Reserved keywords are marked with (R).

A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | R | S | T | U | V | W | Z

A

* `ACTIVE`
* `ADMIN`
* `ARRAY`
* `ATTRIBUTE`
* `AUTHENTICATION`

B

* `BUCKETS`
* `BULK`

C

* `CHALLENGE_RESPONSE`
* `CLONE`
* `COMPONENT`
* `CUME_DIST` (R)

D

* `DEFINITION`
* `DENSE_RANK` (R)
* `DESCRIPTION`

E

* `EMPTY` (R)
* `ENFORCED`
* `ENGINE_ATTRIBUTE`
* `EXCEPT` (R)
* `EXCLUDE`

F

* `FACTOR`
* `FAILED_LOGIN_ATTEMPTS`
* `FINISH`
* `FIRST_VALUE` (R)
* `FOLLOWING`

G

* `GENERATE`
* `GEOMCOLLECTION`
* `GET_MASTER_PUBLIC_KEY`
* `GET_SOURCE_PUBLIC_KEY`
* `GROUPING` (R)
* `GROUPS` (R)
* `GTID_ONLY`

H

* `HISTOGRAM`
* `HISTORY`

I

* `INACTIVE`
* `INITIAL`
* `INITIATE`
* `INTERSECT` (R)
* `INVISIBLE`

J

* `JSON_TABLE` (R)
* `JSON_VALUE`

K

* `KEYRING`

L

* `LAG` (R)
* `LAST_VALUE` (R)
* `LATERAL` (R)
* `LEAD` (R)
* `LOCKED`

M

* `MASTER_COMPRESSION_ALGORITHMS`
* `MASTER_PUBLIC_KEY_PATH`
* `MASTER_TLS_CIPHERSUITES`
* `MASTER_ZSTD_COMPRESSION_LEVEL`
* `MEMBER`

N

* `NESTED`
* `NETWORK_NAMESPACE`
* `NOWAIT`
* `NTH_VALUE` (R)
* `NTILE` (R)
* `NULLS`

O

* `OF` (R)
* `OFF`
* `OJ`
* `OLD`
* `OPTIONAL`
* `ORDINALITY`
* `ORGANIZATION`
* `OTHERS`
* `OVER` (R)

P

* `PASSWORD_LOCK_TIME`
* `PATH`
* `PERCENT_RANK` (R)
* `PERSIST`
* `PERSIST_ONLY`
* `PRECEDING`
* `PRIVILEGE_CHECKS_USER`
* `PROCESS`

R

* `RANDOM`
* `RANK` (R)
* `RECURSIVE` (R)
* `REFERENCE`
* `REGISTRATION`
* `REPLICA`
* `REPLICAS`
* `REQUIRE_ROW_FORMAT`
* `RESOURCE`
* `RESPECT`
* `RESTART`
* `RETAIN`
* `RETURNING`
* `REUSE`
* `ROLE`
* `ROW_NUMBER` (R)

S

* `SECONDARY`
* `SECONDARY_ENGINE`
* `SECONDARY_ENGINE_ATTRIBUTE`
* `SECONDARY_LOAD`
* `SECONDARY_UNLOAD`
* `SKIP`
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
* `SRID`
* `STREAM`
* `SYSTEM` (R)

T

* `THREAD_PRIORITY`
* `TIES`
* `TLS`

U

* `UNBOUNDED`
* `UNREGISTER`
* `URL`

V

* `VCPU`
* `VISIBLE`

W

* `WINDOW` (R)

Z

* `ZONE`

### MySQL 8.0 Removed Keywords and Reserved Words

The following list shows the keywords and reserved words that are removed in MySQL 8.0, compared to MySQL 5.7. Reserved keywords are marked with (R).

* `ANALYSE`
* `DES_KEY_FILE`
* `MASTER_SERVER_ID`
* `PARSE_GCOL_EXPR`
* `REDOFILE`
* `SQL_CACHE`

### MySQL 8.0 Restricted Keywords

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
