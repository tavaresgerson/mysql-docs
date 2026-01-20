## 9.3 Palavras-chave e Palavras Reservadas

Palavras-chave são palavras que têm significado no SQL. Algumas palavras-chave, como `SELECT`, `DELETE` ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), são reservadas e exigem tratamento especial para serem usadas como identificadores, como nomes de tabelas e colunas. Isso também pode ser verdadeiro para os nomes de funções integradas.

Palavras-chave não reservadas são permitidas como identificadores sem aspas. Palavras reservadas são permitidas como identificadores se forem citadas conforme descrito na Seção 9.2, "Nomes de Objetos do Esquema":

```sql
mysql> CREATE TABLE interval (begin INT, end INT);
ERROR 1064 (42000): You have an error in your SQL syntax ...
near 'interval (begin INT, end INT)'
```

`BEGIN` e `END` são palavras-chave, mas não são reservadas, portanto, seu uso como identificadores não requer aspas. `INTERVAL` é uma palavra-chave reservada e deve ser citada para ser usada como identificador:

```sql
mysql> CREATE TABLE `interval` (begin INT, end INT);
Query OK, 0 rows affected (0.01 sec)
```

Exceção: uma palavra que segue um ponto em um nome qualificado deve ser um identificador, portanto, não precisa ser citada, mesmo que esteja reservada:

```sql
mysql> CREATE TABLE mydb.interval (begin INT, end INT);
Query OK, 0 rows affected (0.01 sec)
```

Os nomes das funções embutidas são permitidos como identificadores, mas podem exigir cuidado para serem usados como tais. Por exemplo, `COUNT` é aceitável como nome de coluna. No entanto, por padrão, não há espaço em branco permitido em chamadas de função entre o nome da função e o caractere `(` seguinte. Essa exigência permite que o analisador distinga se o nome é usado em uma chamada de função ou em um contexto não funcional. Para mais detalhes sobre o reconhecimento de nomes de funções, consulte a Seção 9.2.5, “Análise e Resolução de Nomes de Função”.

- Palavras-chave e palavras reservadas do MySQL 5.7
- Palavras-chave e palavras reservadas do MySQL 5.7
- MySQL 5.7 remove palavras-chave e palavras reservadas

### Palavras-chave e palavras reservadas do MySQL 5.7

A lista a seguir mostra as palavras-chave e as palavras reservadas no MySQL 5.7, juntamente com as alterações nas palavras individuais de uma versão para outra. As palavras-chave reservadas são marcadas com (R). Além disso, `_FILENAME` é reservado.

Em algum momento, você pode fazer a atualização para uma versão mais recente, então é uma boa ideia dar uma olhada nas palavras reservadas futuras também. Você pode encontrá-las nos manuais que cobrem versões mais recentes do MySQL. A maioria das palavras reservadas na lista é proibida pelo SQL padrão como nomes de colunas ou tabelas (por exemplo, `GROUP`). Algumas são reservadas porque o MySQL as precisa e usa um analisador **yacc**.

A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z

A
* `ACCESSIBLE` (R)
* `ACCOUNT`; adicionado em 5.7.6 (não reservado)
* `ACTION`
* `ADD` (R)
* `AFTER`
* `AGAINST`
* `AGGREGATE`
* `ALGORITHM`
* `ALL` (R)
* `ALTER` (R)
* `ALWAYS`; adicionado em 5.7.6 (não reservado)
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
* `CHANNEL`; adicionado em 5.7.6 (não reservado)
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
* `COMPRESSION`; adicionado em 5.7.8 (não reservado)
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
* `ENCRYPTION`; adicionado em 5.7.11 (não reservado)
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
* `FILE_BLOCK_SIZE`; adicionado em 5.7.6 (não reservado)
* `FILTER`; adicionado em 5.7.3 (não reservado)
* `FIRST`
* `FIXED`
* `FLOAT` (R)
* `FLOAT4` (R)
* `FLOAT8` (R)
* `FLUSH`
* `FOLLOWS`; adicionado em 5.7.2 (não reservado)
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
* `GENERATED` (R); adicionado em 5.7.6 (reservado)
* `GEOMETRY`
* `GEOMETRYCOLLECTION`
* `GET` (R)
* `GET_FORMAT`
* `GLOBAL`
* `GRANT` (R)
* `GRANTS`
* `GROUP` (R)
* `GROUP_REPLICATION`; adicionado em 5.7.6 (não reservado)

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
* `INSTANCE`; adicionado em 5.7.11 (não reservado)
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
* `JSON`; adicionado em 5.7.8 (não reservado)

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
* `MASTER_TLS_VERSION`; adicionado em 5.7.10 (não reservado)
* `MASTER_USER`
* `MATCH` (R)
* `MAXVALUE` (R)
* `MAX_CONNECTIONS_PER_HOUR`
* `MAX_QUERIES_PER_HOUR`
* `MAX_ROWS`
* `MAX_SIZE`
* `MAX_STATEMENT_TIME`; adicionado em 5.7.4 (não reservado); removido em 5.7.8
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
* `NEVER`; adicionado em 5.7.4 (não reservado)
* `NEW`
* `NEXT`
* `NO`
* `NODEGROUP`
* `NONBLOCKING`; removido em 5.7.6
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
* `OLD_PASSWORD`; removido em 5.7.5
* `ON` (R)
* `ONE`
* `ONLY`
* `OPEN`
* `OPTIMIZE` (R)
* `OPTIMIZER_COSTS` (R); adicionado em 5.7.5 (reservado)
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
* `PARSE_GCOL_EXPR`; adicionado em 5.7.6 (reservado); tornou-se não reservado in 5.7.8
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
* `PRECEDES`; adicionado em 5.7.2 (não reservado)
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
* `REDO_BUFFER_SIZE`tornou
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
* `REPLICATE_DO_DB`; adicionado em 5.7.3 (não reservado)
* `REPLICATE_DO_TABLE`; adicionado em 5.7.3 (não reservado)
* `REPLICATE_IGNORE_DB`; adicionado em 5.7.3 (não reservado)
* `REPLICATE_IGNORE_TABLE`; adicionado em 5.7.3 (não reservado)
* `REPLICATE_REWRITE_DB`; adicionado em 5.7.3 (não reservado)
* `REPLICATE_WILD_DO_TABLE`; adicionado em 5.7.3 (não reservado)
* `REPLICATE_WILD_IGNORE_TABLE`; adicionado em 5.7.3 (não reservado)
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
* `ROTATE`; adicionado em 5.7.11 (não reservado)
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
* `STORED` (R); adicionado em 5.7.6 (reservado)
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

* `VALIDATION`; adicionado em 5.7.5 (não reservado)
* `VALUE`
* `VALUES` (R)
* `VARBINARY` (R)
* `VARCHAR` (R)
* `VARCHARACTER` (R)
* `VARIABLES`
* `VARYING` (R)
* `VIEW`
* `VIRTUAL` (R); adicionado em 5.7.6 (reservado)

W

* `WAIT`
* `WARNINGS`
* `WEEK`
* `WEIGHT_STRING`
* `WHEN` (R)
* `WHERE` (R)
* `WHILE` (R)
* `WITH` (R)
* `WITHOUT`; adicionado em 5.7.5 (não reservado)
* `WORK`
* `WRAPPER`
* `WRITE` (R)

X

* `X509`
* `XA`
* `XID`; adicionado em 5.7.5 (não reservado)
* `XML`
* `XOR` (R)

Y

* `YEAR`
* `YEAR_MONTH` (R)

Z

* `ZEROFILL` (R)

### Palavras-chave e palavras reservadas do MySQL 5.7

A lista a seguir mostra as palavras-chave e as palavras reservadas que são adicionadas no MySQL 5.7, em comparação com o MySQL 5.6. As palavras-chave reservadas são marcadas com (R).

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

### MySQL 5.7 remove palavras-chave e palavras reservadas

A lista a seguir mostra as palavras-chave e as palavras reservadas que são removidas no MySQL 5.7, em comparação com o MySQL 5.6. As palavras-chave reservadas são marcadas com (R).

- `OLD_PASSWORD`
