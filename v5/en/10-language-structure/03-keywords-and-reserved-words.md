## 9.3 Palavras-Chave e Palavras Reservadas

Palavras-chave (Keywords) são palavras que têm significado em SQL. Certas palavras-chave, como `SELECT`, `DELETE` ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), são reservadas (reserved) e requerem tratamento especial para serem usadas como identificadores, como nomes de tabelas e colunas. Isso também pode ser verdade para nomes de funções embutidas (built-in functions).

Palavras-chave não reservadas são permitidas como identificadores sem a necessidade de aspas (quoting). Palavras reservadas são permitidas como identificadores se você as incluir entre aspas, conforme descrito na Seção 9.2, “Nomes de Objetos de Schema”:

```sql
mysql> CREATE TABLE interval (begin INT, end INT);
ERROR 1064 (42000): You have an error in your SQL syntax ...
near 'interval (begin INT, end INT)'
```

`BEGIN` e `END` são palavras-chave, mas não reservadas, portanto, seu uso como identificadores não requer aspas. `INTERVAL` é uma palavra-chave reservada e deve ser colocada entre aspas para ser usada como um identificador:

```sql
mysql> CREATE TABLE `interval` (begin INT, end INT);
Query OK, 0 rows affected (0.01 sec)
```

Exceção: Uma palavra que segue um ponto em um nome qualificado deve ser um identificador, então não precisa ser colocada entre aspas, mesmo que seja reservada:

```sql
mysql> CREATE TABLE mydb.interval (begin INT, end INT);
Query OK, 0 rows affected (0.01 sec)
```

Nomes de funções embutidas são permitidos como identificadores, mas podem requerer cautela para serem usados como tal. Por exemplo, `COUNT` é aceitável como nome de coluna. No entanto, por padrão, não é permitido nenhum espaço em branco em invocações de função entre o nome da função e o caractere `(` seguinte. Este requisito permite que o parser distinga se o nome está sendo usado em uma chamada de função ou em um contexto que não seja de função. Para mais detalhes sobre o reconhecimento de nomes de função, consulte a Seção 9.2.5, “Análise e Resolução de Nomes de Funções”.

* Palavras-Chave e Palavras Reservadas do MySQL 5.7
* Novas Palavras-Chave e Palavras Reservadas do MySQL 5.7
* Palavras-Chave e Palavras Reservadas Removidas no MySQL 5.7

### Palavras-Chave e Palavras Reservadas do MySQL 5.7

A lista a seguir mostra as palavras-chave e palavras reservadas no MySQL 5.7, juntamente com as mudanças em palavras individuais de versão para versão. Palavras-chave reservadas são marcadas com (R). Além disso, `_FILENAME` é reservada.

Em algum momento, você pode fazer upgrade para uma versão superior, portanto, é uma boa ideia dar uma olhada nas futuras palavras reservadas também. Você pode encontrá-las nos manuais que cobrem versões superiores do MySQL. A maioria das palavras reservadas na lista é proibida pelo padrão SQL como nomes de coluna ou tabela (por exemplo, `GROUP`). Algumas são reservadas porque o MySQL precisa delas e usa um parser **yacc**.

A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z

A

* `ACCESSIBLE` (R)
* `ACCOUNT`; adicionada em 5.7.6 (não reservada)
* `ACTION`
* `ADD` (R)
* `AFTER`
* `AGAINST`
* `AGGREGATE`
* `ALGORITHM`
* `ALL` (R)
* `ALTER` (R)
* `ALWAYS`; adicionada em 5.7.6 (não reservada)
* `ANALYSE`
* `ANALYZE` (R)
* `AND` (R)
* `ANY`
* `AS` (R)
* `ASC` (R)
* `ASCII`
* `ASENSITIVE` (R)
* `AT`
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
* `CHANGE` (R)
* `CHANGED`
* `CHANNEL`; adicionada em 5.7.6 (não reservada)
* `CHAR` (R)
* `CHARACTER` (R)
* `CHARSET`
* `CHECK` (R)
* `CHECKSUM`
* `CIPHER`
* `CLASS_ORIGIN`
* `CLIENT`
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
* `COMPRESSED`
* `COMPRESSION`; adicionada em 5.7.8 (não reservada)
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
* `CUBE`
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
* `DELAYED` (R)
* `DELAY_KEY_WRITE`
* `DELETE` (R)
* `DESC` (R)
* `DESCRIBE` (R)
* `DES_KEY_FILE`
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
* `ENABLE`
* `ENCLOSED` (R)
* `ENCRYPTION`; adicionada em 5.7.11 (não reservada)
* `END`
* `ENDS`
* `ENGINE`
* `ENGINES`
* `ENUM`
* `ERROR`
* `ERRORS`
* `ESCAPE`
* `ESCAPED` (R)
* `EVENT`
* `EVENTS`
* `EVERY`
* `EXCHANGE`
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

* `FALSE` (R)
* `FAST`
* `FAULTS`
* `FETCH` (R)
* `FIELDS`
* `FILE`
* `FILE_BLOCK_SIZE`; adicionada em 5.7.6 (não reservada)
* `FILTER`; adicionada em 5.7.3 (não reservada)
* `FIRST`
* `FIXED`
* `FLOAT` (R)
* `FLOAT4` (R)
* `FLOAT8` (R)
* `FLUSH`
* `FOLLOWS`; adicionada em 5.7.2 (não reservada)
* `FOR` (R)
* `FORCE` (R)
* `FOREIGN` (R)
* `FORMAT`
* `FOUND`
* `FROM` (R)
* `FULL`
* `FULLTEXT` (R)
* `FUNCTION`

G

* `GENERAL`
* `GENERATED` (R); adicionada em 5.7.6 (reservada)
* `GEOMETRY`
* `GEOMETRYCOLLECTION`
* `GET` (R)
* `GET_FORMAT`
* `GLOBAL`
* `GRANT` (R)
* `GRANTS`
* `GROUP` (R)
* `GROUP_REPLICATION`; adicionada em 5.7.6 (não reservada)

H

* `HANDLER`
* `HASH`
* `HAVING` (R)
* `HELP`
* `HIGH_PRIORITY` (R)
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
* `INDEX` (R)
* `INDEXES`
* `INFILE` (R)
* `INITIAL_SIZE`
* `INNER` (R)
* `INOUT` (R)
* `INSENSITIVE` (R)
* `INSERT` (R)
* `INSERT_METHOD`
* `INSTALL`
* `INSTANCE`; adicionada em 5.7.11 (não reservada)
* `INT` (R)
* `INT1` (R)
* `INT2` (R)
* `INT3` (R)
* `INT4` (R)
* `INT8` (R)
* `INTEGER` (R)
* `INTERVAL` (R)
* `INTO` (R)
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
* `JSON`; adicionada em 5.7.8 (não reservada)

K

* `KEY` (R)
* `KEYS` (R)
* `KEY_BLOCK_SIZE`
* `KILL` (R)

L

* `LANGUAGE`
* `LAST`
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
* `MASTER_CONNECT_RETRY`
* `MASTER_DELAY`
* `MASTER_HEARTBEAT_PERIOD`
* `MASTER_HOST`
* `MASTER_LOG_FILE`
* `MASTER_LOG_POS`
* `MASTER_PASSWORD`
* `MASTER_PORT`
* `MASTER_RETRY_COUNT`
* `MASTER_SERVER_ID`
* `MASTER_SSL`
* `MASTER_SSL_CA`
* `MASTER_SSL_CAPATH`
* `MASTER_SSL_CERT`
* `MASTER_SSL_CIPHER`
* `MASTER_SSL_CRL`
* `MASTER_SSL_CRLPATH`
* `MASTER_SSL_KEY`
* `MASTER_SSL_VERIFY_SERVER_CERT` (R)
* `MASTER_TLS_VERSION`; adicionada em 5.7.10 (não reservada)
* `MASTER_USER`
* `MATCH` (R)
* `MAXVALUE` (R)
* `MAX_CONNECTIONS_PER_HOUR`
* `MAX_QUERIES_PER_HOUR`
* `MAX_ROWS`
* `MAX_SIZE`
* `MAX_STATEMENT_TIME`; adicionada em 5.7.4 (não reservada); removida em 5.7.8
* `MAX_UPDATES_PER_HOUR`
* `MAX_USER_CONNECTIONS`
* `MEDIUM`
* `MEDIUMBLOB` (R)
* `MEDIUMINT` (R)
* `MEDIUMTEXT` (R)
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
* `NEVER`; adicionada em 5.7.4 (não reservada)
* `NEW`
* `NEXT`
* `NO`
* `NODEGROUP`
* `NONBLOCKING`; removida em 5.7.6
* `NONE`
* `NOT` (R)
* `NO_WAIT`
* `NO_WRITE_TO_BINLOG` (R)
* `NULL` (R)
* `NUMBER`
* `NUMERIC` (R)
* `NVARCHAR`

O

* `OFFSET`
* `OLD_PASSWORD`; removida em 5.7.5
* `ON` (R)
* `ONE`
* `ONLY`
* `OPEN`
* `OPTIMIZE` (R)
* `OPTIMIZER_COSTS` (R); adicionada em 5.7.5 (reservada)
* `OPTION` (R)
* `OPTIONALLY` (R)
* `OPTIONS`
* `OR` (R)
* `ORDER` (R)
* `OUT` (R)
* `OUTER` (R)
* `OUTFILE` (R)
* `OWNER`

P

* `PACK_KEYS`
* `PAGE`
* `PARSER`
* `PARSE_GCOL_EXPR`; adicionada em 5.7.6 (reservada); tornou-se não reservada em 5.7.8
* `PARTIAL`
* `PARTITION` (R)
* `PARTITIONING`
* `PARTITIONS`
* `PASSWORD`
* `PHASE`
* `PLUGIN`
* `PLUGINS`
* `PLUGIN_DIR`
* `POINT`
* `POLYGON`
* `PORT`
* `PRECEDES`; adicionada em 5.7.2 (não reservada)
* `PRECISION` (R)
* `PREPARE`
* `PRESERVE`
* `PREV`
* `PRIMARY` (R)
* `PRIVILEGES`
* `PROCEDURE` (R)
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

* `RANGE` (R)
* `READ` (R)
* `READS` (R)
* `READ_ONLY`
* `READ_WRITE` (R)
* `REAL` (R)
* `REBUILD`
* `RECOVER`
* `REDOFILE`
* `REDO_BUFFER_SIZE`
* `REDUNDANT`
* `REFERENCES` (R)
* `REGEXP` (R)
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
* `REPLICATE_DO_DB`; adicionada em 5.7.3 (não reservada)
* `REPLICATE_DO_TABLE`; adicionada em 5.7.3 (não reservada)
* `REPLICATE_IGNORE_DB`; adicionada em 5.7.3 (não reservada)
* `REPLICATE_IGNORE_TABLE`; adicionada em 5.7.3 (não reservada)
* `REPLICATE_REWRITE_DB`; adicionada em 5.7.3 (não reservada)
* `REPLICATE_WILD_DO_TABLE`; adicionada em 5.7.3 (não reservada)
* `REPLICATE_WILD_IGNORE_TABLE`; adicionada em 5.7.3 (não reservada)
* `REPLICATION`
* `REQUIRE` (R)
* `RESET`
* `RESIGNAL` (R)
* `RESTORE`
* `RESTRICT` (R)
* `RESUME`
* `RETURN` (R)
* `RETURNED_SQLSTATE`
* `RETURNS`
* `REVERSE`
* `REVOKE` (R)
* `RIGHT` (R)
* `RLIKE` (R)
* `ROLLBACK`
* `ROLLUP`
* `ROTATE`; adicionada em 5.7.11 (não reservada)
* `ROUTINE`
* `ROW`
* `ROWS`
* `ROW_COUNT`
* `ROW_FORMAT`
* `RTREE`

S

* `SAVEPOINT`
* `SCHEDULE`
* `SCHEMA` (R)
* `SCHEMAS` (R)
* `SCHEMA_NAME`
* `SECOND`
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
* `SLAVE`
* `SLOW`
* `SMALLINT` (R)
* `SNAPSHOT`
* `SOCKET`
* `SOME`
* `SONAME`
* `SOUNDS`
* `SOURCE`
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
* `SQL_CACHE`
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
* `STORED` (R); adicionada em 5.7.6 (reservada)
* `STRAIGHT_JOIN` (R)
* `STRING`
* `SUBCLASS_ORIGIN`
* `SUBJECT`
* `SUBPARTITION`
* `SUBPARTITIONS`
* `SUPER`
* `SUSPEND`
* `SWAPS`
* `SWITCHES`

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
* `TIME`
* `TIMESTAMP`
* `TIMESTAMPADD`
* `TIMESTAMPDIFF`
* `TINYBLOB` (R)
* `TINYINT` (R)
* `TINYTEXT` (R)
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
* `UNSIGNED` (R)
* `UNTIL`
* `UPDATE` (R)
* `UPGRADE`
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

* `VALIDATION`; adicionada em 5.7.5 (não reservada)
* `VALUE`
* `VALUES` (R)
* `VARBINARY` (R)
* `VARCHAR` (R)
* `VARCHARACTER` (R)
* `VARIABLES`
* `VARYING` (R)
* `VIEW`
* `VIRTUAL` (R); adicionada em 5.7.6 (reservada)

W

* `WAIT`
* `WARNINGS`
* `WEEK`
* `WEIGHT_STRING`
* `WHEN` (R)
* `WHERE` (R)
* `WHILE` (R)
* `WITH` (R)
* `WITHOUT`; adicionada em 5.7.5 (não reservada)
* `WORK`
* `WRAPPER`
* `WRITE` (R)

X

* `X509`
* `XA`
* `XID`; adicionada em 5.7.5 (não reservada)
* `XML`
* `XOR` (R)

Y

* `YEAR`
* `YEAR_MONTH` (R)

Z

* `ZEROFILL` (R)

### Novas Palavras-Chave e Palavras Reservadas do MySQL 5.7

A lista a seguir mostra as palavras-chave e palavras reservadas que foram adicionadas no MySQL 5.7, em comparação com o MySQL 5.6. Palavras-chave reservadas são marcadas com (R).

A | C | E | F | G | I | J | M | N | O | P | R | S | V | W | X

A

* `ACCOUNT`
* `ALWAYS`

C

* `CHANNEL`
* `COMPRESSION`

E

* `ENCRYPTION`

F

* `FILE_BLOCK_SIZE`
* `FILTER`
* `FOLLOWS`

G

* `GENERATED` (R)
* `GROUP_REPLICATION`

I

* `INSTANCE`

J

* `JSON`

M

* `MASTER_TLS_VERSION`

N

* `NEVER`

O

* `OPTIMIZER_COSTS` (R)

P

* `PARSE_GCOL_EXPR`
* `PRECEDES`

R

* `REPLICATE_DO_DB`
* `REPLICATE_DO_TABLE`
* `REPLICATE_IGNORE_DB`
* `REPLICATE_IGNORE_TABLE`
* `REPLICATE_REWRITE_DB`
* `REPLICATE_WILD_DO_TABLE`
* `REPLICATE_WILD_IGNORE_TABLE`
* `ROTATE`

S

* `STACKED`
* `STORED` (R)

V

* `VALIDATION`
* `VIRTUAL` (R)

W

* `WITHOUT`

X

* `XID`

### Palavras-Chave e Palavras Reservadas Removidas no MySQL 5.7

A lista a seguir mostra as palavras-chave e palavras reservadas que foram removidas no MySQL 5.7, em comparação com o MySQL 5.6. Palavras-chave reservadas são marcadas com (R).

* `OLD_PASSWORD`