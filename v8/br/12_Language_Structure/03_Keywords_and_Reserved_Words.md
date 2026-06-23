## 11.3 Palavras-chave e Palavras Reservadas

Palavras-chave são palavras que têm significado no SQL. Algumas palavras-chave, como `SELECT`, `DELETE` ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), são reservadas e requerem tratamento especial para uso como identificadores, como nomes de tabelas e colunas. Isso também pode ser verdadeiro para os nomes de funções embutidas.

A maioria das palavras-chave não reservadas é permitida como identificadores sem citação. Algumas palavras-chave que, de outra forma, são consideradas não reservadas, são restritas ao uso como identificadores não citados para papéis, rótulos de programas armazenados ou, em alguns casos, para ambos. Consulte Palavras-chave restritas do MySQL 8.0, para listas dessas palavras-chave.

Palavras reservadas são permitidas como identificadores se forem citadas conforme descrito na Seção 11.2, “Nomes de Objeto do Esquema”:

```
mysql> CREATE TABLE interval (begin INT, end INT);
ERROR 1064 (42000): You have an error in your SQL syntax ...
near 'interval (begin INT, end INT)'
```

`BEGIN` e `END` são palavras-chave, mas não são reservadas, portanto, seu uso como identificadores não requer citação. `INTERVAL` é uma palavra-chave reservada e deve ser citada para ser usada como identificador:

```
mysql> CREATE TABLE `interval` (begin INT, end INT);
Query OK, 0 rows affected (0.01 sec)
```

Exceção: uma palavra que segue um ponto em um nome qualificado deve ser um identificador, portanto, não precisa ser citada, mesmo que seja reservada:

```
mysql> CREATE TABLE mydb.interval (begin INT, end INT);
Query OK, 0 rows affected (0.01 sec)
```

Os nomes das funções embutidas são permitidos como identificadores, mas podem exigir cuidado para serem usados como tais. Por exemplo, `COUNT` é aceitável como nome de coluna. No entanto, por padrão, não há espaço em branco permitido em invocações de função entre o nome da função e o caractere seguinte `(`. Esse requisito permite que o analisador distinga se o nome é usado em uma chamada de função ou em um contexto não funcional. Para mais detalhes sobre o reconhecimento de nomes de funções, consulte a Seção 11.2.5, “Análise e Resolução de Nomes de Função”.

A tabela `INFORMATION_SCHEMA.KEYWORDS` lista as palavras consideradas palavras-chave pelo MySQL e indica se elas são reservadas. Veja a Seção 28.3.17, “A tabela INFORMATION_SCHEMA KEYWORDS”.

* Palavras-chave e palavras reservadas do MySQL 8.0
* Novas palavras-chave e palavras reservadas do MySQL 8.0
* Palavras-chave e palavras reservadas removidas do MySQL 8.0
* Palavras-chave restritas do MySQL 8.0

### Palavras-chave e Palavras Reservadas do MySQL 8.0

A lista a seguir mostra as palavras-chave e as palavras reservadas no MySQL 8.0, juntamente com as alterações nas palavras individuais de uma versão para outra. As palavras-chave reservadas são marcadas com (R). Além disso, `_FILENAME` é reservado.

Em algum momento, você pode fazer uma atualização para uma versão mais alta, então é uma boa ideia dar uma olhada nas palavras reservadas do futuro também. Você pode encontrar essas palavras nos manuais que cobrem versões mais altas do MySQL. A maioria das palavras reservadas na lista é proibida pelo SQL padrão como nomes de colunas ou tabelas (por exemplo, `GROUP`). Algumas são reservadas porque o MySQL as precisa e usa um analisador **yacc**.

A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z

A

* `ACCESSIBLE` (R)
* `ACCOUNT`
* `ACTION`
* `ACTIVE`; adicionado em 8.0.14 (não reservado)
* `ADD` (R)
* `ADMIN`; tornou-se não reservado em 8.0.12
* `AFTER`
* `AGAINST`
* `AGGREGATE`
* `ALGORITHM`
* `ALL` (R)
* `ALTER` (R)
* `ALWAYS`
* `ANALYSE`; removido em 8.0.1
* `ANALYZE` (R)
* `AND` (R)
* `ANY`
* `ARRAY`; adicionado em 8.0.17 (reservado); tornou-se não reservado em 8.0.19
* `AS` (R)
* `ASC` (R)
* `ASCII`
* `ASENSITIVE` (R)
* `AT`
* `ATTRIBUTE`; adicionado em 8.0.21 (não reservado)
* `AUTHENTICATION`; adicionado em 8.0.27 (não reservado)
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
* `BUCKETS`; adicionado em 8.0.2 (não reservado)
* `BULK`; adicionado em 8.0.32 (não reservado)
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
* `CHALLENGE_RESPONSE`; adicionado em 8.0.27 (não reservado)
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
* `CLONE`; adicionado em 8.0.3 (não reservado)
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
* `CUBE` (R); tornou-se reservado em 8.0.1
* `CUME_DIST` (R); adicionado em 8.0.2 (reservado)
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
* `DEFINITION`; adicionado em 8.0.4 (não reservado)
* `DELAYED` (R)
* `DELAY_KEY_WRITE`
* `DELETE` (R)
* `DENSE_RANK` (R); adicionado em 8.0.2 (reservado)
* `DESC` (R)
* `DESCRIBE` (R)
* `DESCRIPTION`; adicionado em 8.0.4 (não reservado)
* `DES_KEY_FILE`; removido em 8.0.3
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
* `EMPTY` (R); adicionado em 8.0.4 (reservado)
* `ENABLE`
* `ENCLOSED` (R)
* `ENCRYPTION`
* `END`
* `ENDS`
* [[`ENFORCED`]; adicionado em 8.0.16 (não reservado)
* `ENGINE`
* `ENGINES`
* [[`ENGINE_ATTRIBUTE`]; adicionado em 8.0.21 (não reservado)
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
* [[`EXCLUDE`]; adicionado em 8.0.2 (não reservado)
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

* `FACTOR`; adicionado em 8.0.27 (não reservado)
* `FAILED_LOGIN_ATTEMPTS`; adicionado em 8.0.19 (não reservado)
* `FALSE` (R)
* `FAST`
* `FAULTS`
* `FETCH` (R)
* `FIELDS`
* `FILE`
* `FILE_BLOCK_SIZE`
* `FILTER`
* `FINISH`; adicionado em 8.0.27 (não reservado)
* `FIRST`
* `FIRST_VALUE` (R); adicionado em 8.0.2 (reservado)
* `FIXED`
* `FLOAT` (R)
* `FLOAT4` (R)
* `FLOAT8` (R)
* `FLUSH`
* `FOLLOWING`; adicionado em 8.0.2 (não reservado)
* `FOLLOWS`
* `FOR` (R)
* `FORCE` (R)
* `FOREIGN` (R)
* `FORMAT`
* `FOUND`
* `FROM` (R)
* `FULL`
* `FULLTEXT` (R)
* `FUNCTION` (R); tornou-se reservado em 8.0.1

G

* `GENERAL`
* `GENERATE`; adicionado em 8.0.32 (não reservado)
* `GENERATED` (R)
* `GEOMCOLLECTION`; adicionado em 8.0.11 (não reservado)
* `GEOMETRY`
* `GEOMETRYCOLLECTION`
* `GET` (R)
* `GET_FORMAT`
* `GET_MASTER_PUBLIC_KEY`; adicionado em 8.0.4 (reservado); tornou-se não reservado em 8.0.11
* `GET_SOURCE_PUBLIC_KEY`; adicionado em 8.0.23 (não reservado)
* `GLOBAL`
* `GRANT` (R)
* `GRANTS`
* `GROUP` (R)
* `GROUPING` (R); adicionado em 8.0.1 (reservado)
* `GROUPS` (R); adicionado em 8.0.2 (reservado)
* `GROUP_REPLICATION`
* `GTID_ONLY`; adicionado em 8.0.27 (não reservado)

H

* `HANDLER`
* `HASH`
* `HAVING` (R)
* `HELP`
* `HIGH_PRIORITY` (R)
* `HISTOGRAM`; adicionado em 8.0.2 (não reservado)
* `HISTORY`; adicionado em 8.0.3 (não reservado)
* `HOST`
* `HOSTS`
* `HOUR`
* `HOUR_MICROSECOND` (R)
* `HOUR_MINUTE` (R)
* `HOUR_SECOND` (R)

Eu

* `IDENTIFIED`
* `IF` (R)
* `IGNORE` (R)
* `IGNORE_SERVER_IDS`
* `IMPORT`
* `IN` (R)
* `INACTIVE`; adicionado em 8.0.14 (não reservado)
* `INDEX` (R)
* `INDEXES`
* `INFILE` (R)
* `INITIAL`; adicionado em 8.0.27 (não reservado)
* `INITIAL_SIZE`
* `INITIATE`; adicionado em 8.0.27 (não reservado)
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
* `INTERSECT` (R); adicionado em 8.0.31 (reservado)
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
* `JSON_TABLE` (R); adicionado em 8.0.4 (reservado)
* `JSON_VALUE`; adicionado em 8.0.21 (não reservado)

K

* `KEY` (R)
* `KEYRING`; adicionado em 8.0.24 (não reservado)
* `KEYS` (R)
* `KEY_BLOCK_SIZE`
* `KILL` (R)

L

* `LAG` (R); adicionado em 8.0.2 (reservado)
* `LANGUAGE`
* `LAST`
* `LAST_VALUE` (R); adicionado em 8.0.2 (reservado)
* `LATERAL` (R); adicionado em 8.0.14 (reservado)
* `LEAD` (R); adicionado em 8.0.2 (reservado)
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
* `LOCKED`; adicionado em 8.0.1 (não reservado)
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
* `MASTER_COMPRESSION_ALGORITHMS`; adicionado em 8.0.18 (não reservado)
* `MASTER_CONNECT_RETRY`
* `MASTER_DELAY`
* `MASTER_HEARTBEAT_PERIOD`
* `MASTER_HOST`
* `MASTER_LOG_FILE`
* `MASTER_LOG_POS`
* `MASTER_PASSWORD`
* `MASTER_PORT`
* `MASTER_PUBLIC_KEY_PATH`; adicionado em 8.0.4 (não reservado)
* `MASTER_RETRY_COUNT`
* `MASTER_SERVER_ID`; removido em 8.0.23
* `MASTER_SSL`
* `MASTER_SSL_CA`
* `MASTER_SSL_CAPATH`
* `MASTER_SSL_CERT`
* `MASTER_SSL_CIPHER`
* `MASTER_SSL_CRL`
* `MASTER_SSL_CRLPATH`
* `MASTER_SSL_KEY`
* `MASTER_SSL_VERIFY_SERVER_CERT` (R)
* `MASTER_TLS_CIPHERSUITES`; adicionado em 8.0.19 (não reservado)
* `MASTER_TLS_VERSION`
* `MASTER_USER`
* `MASTER_ZSTD_COMPRESSION_LEVEL`; adicionado em 8.0.18 (não reservado)
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
* `MEMBER`; adicionado em 8.0.17 (reservado); tornou-se não reservado em 8.0.19
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
* `NESTED`; adicionado em 8.0.4 (não reservado)
* `NETWORK_NAMESPACE`; adicionado em 8.0.16 (não reservado)
* `NEVER`
* `NEW`
* `NEXT`
* `NO`
* `NODEGROUP`
* `NONE`
* `NOT` (R)
* `NOWAIT`; adicionado em 8.0.1 (não reservado)
* `NO_WAIT`
* `NO_WRITE_TO_BINLOG` (R)
* `NTH_VALUE` (R); adicionado em 8.0.2 (reservado)
* `NTILE` (R); adicionado em 8.0.2 (reservado)
* `NULL` (R)
* `NULLS`; adicionado em 8.0.2 (não reservado)
* `NUMBER`
* `NUMERIC` (R)
* `NVARCHAR`

O

* `OF` (R); adicionado em 8.0.1 (reservado)
* `OFF`; adicionado em 8.0.20 (não reservado)
* `OFFSET`
* `OJ`; adicionado em 8.0.16 (não reservado)
* `OLD`; adicionado em 8.0.14 (não reservado)
* `ON` (R)
* `ONE`
* `ONLY`
* `OPEN`
* `OPTIMIZE` (R)
* `OPTIMIZER_COSTS` (R)
* `OPTION` (R)
* `OPTIONAL`; adicionado em 8.0.13 (não reservado)
* `OPTIONALLY` (R)
* `OPTIONS`
* `OR` (R)
* `ORDER` (R)
* `ORDINALITY`; adicionado em 8.0.4 (não reservado)
* `ORGANIZATION`; adicionado em 8.0.4 (não reservado)
* `OTHERS`; adicionado em 8.0.2 (não reservado)
* `OUT` (R)
* `OUTER` (R)
* `OUTFILE` (R)
* `OVER` (R); adicionado em 8.0.2 (reservado)
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
* `PASSWORD_LOCK_TIME`; adicionado em 8.0.19 (não reservado)
* `PATH`; adicionado em 8.0.4 (não reservado)
* `PERCENT_RANK` (R); adicionado em 8.0.2 (reservado)
* `PERSIST`; tornou-se não reservado em 8.0.16
* `PERSIST_ONLY`; adicionado em 8.0.2 (reservado); tornou-se não reservado em 8.0.16
* `PHASE`
* `PLUGIN`
* `PLUGINS`
* `PLUGIN_DIR`
* `POINT`
* `POLYGON`
* `PORT`
* `PRECEDES`
* `PRECEDING`; adicionado em 8.0.2 (não reservado)
* `PRECISION` (R)
* `PREPARE`
* `PRESERVE`
* `PREV`
* `PRIMARY` (R)
* `PRIVILEGES`
* `PRIVILEGE_CHECKS_USER`; adicionado em 8.0.18 (não reservado)
* `PROCEDURE` (R)
* `PROCESS`; adicionado em 8.0.11 (não reservado)
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

* `RANDOM`; adicionado em 8.0.18 (não reservado)
* `RANGE` (R)
* `RANK` (R); adicionado em 8.0.2 (reservado)
* `READ` (R)
* `READS` (R)
* `READ_ONLY`
* `READ_WRITE` (R)
* `REAL` (R)
* `REBUILD`
* `RECOVER`
* `RECURSIVE` (R); adicionado em 8.0.1 (reservado)
* `REDOFILE`; removido em 8.0.3
* `REDO_BUFFER_SIZE`
* `REDUNDANT`
* `REFERENCE`; adicionado em 8.0.4 (não reservado)
* `REFERENCES` (R)
* `REGEXP` (R)
* `REGISTRATION`; adicionado em 8.0.27 (não reservado)
* `RELAY`
* `RELAYLOG`
* `RELAY_LOG_FILE`
* `RELAY_LOG_POS`
* `RELAY_THREAD`
* `RELEASE` (R)
* `RELOAD`
* `REMOTE`; adicionado em 8.0.3 (não reservado); removido em 8.0.14
* `REMOVE`
* `RENAME` (R)
* `REORGANIZE`
* `REPAIR`
* `REPEAT` (R)
* `REPEATABLE`
* `REPLACE` (R)
* `REPLICA`; adicionado em 8.0.22 (não reservado)
* `REPLICAS`; adicionado em 8.0.22 (não reservado)
* `REPLICATE_DO_DB`
* `REPLICATE_DO_TABLE`
* `REPLICATE_IGNORE_DB`
* `REPLICATE_IGNORE_TABLE`
* `REPLICATE_REWRITE_DB`
* `REPLICATE_WILD_DO_TABLE`
* `REPLICATE_WILD_IGNORE_TABLE`
* `REPLICATION`
* `REQUIRE` (R)
* `REQUIRE_ROW_FORMAT`; adicionado em 8.0.19 (não reservado)
* `RESET`
* `RESIGNAL` (R)
* `RESOURCE`; adicionado em 8.0.3 (não reservado)
* `RESPECT`; adicionado em 8.0.2 (não reservado)
* `RESTART`; adicionado em 8.0.4 (não reservado)
* `RESTORE`
* `RESTRICT` (R)
* `RESUME`
* `RETAIN`; adicionado em 8.0.14 (não reservado)
* `RETURN` (R)
* `RETURNED_SQLSTATE`
* `RETURNING`; adicionado em 8.0.21 (não reservado)
* `RETURNS`
* `REUSE`; adicionado em 8.0.3 (não reservado)
* `REVERSE`
* `REVOKE` (R)
* `RIGHT` (R)
* `RLIKE` (R)
* `ROLE`; tornou-se não reservado em 8.0.1
* `ROLLBACK`
* `ROLLUP`
* `ROTATE`
* `ROUTINE`
* `ROW` (R); tornou-se reservado em 8.0.2
* `ROWS` (R); tornou-se reservado em 8.0.2

S

* `SAVEPOINT`
* `SCHEDULE`
* `SCHEMA` (R)
* `SCHEMAS` (R)
* `SCHEMA_NAME`
* `SECOND`
* `SECONDARY`; adicionado em 8.0.16 (não reservado)
* `SECONDARY_ENGINE`; adicionado em 8.0.13 (não reservado)
* `SECONDARY_ENGINE_ATTRIBUTE`; adicionado em 8.0.21 (não reservado)
* `SECONDARY_LOAD`; adicionado em 8.0.13 (não reservado)
* `SECONDARY_UNLOAD`; adicionado em 8.0.13 (não reservado)
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
* `SKIP`; adicionado em 8.0.1 (não reservado)
* `SLAVE`
* `SLOW`
* `SMALLINT` (R)
* `SNAPSHOT`
* `SOCKET`
* `SOME`
* `SONAME`
* `SOUNDS`
* `SOURCE`
* `SOURCE_AUTO_POSITION`; adicionado em 8.0.23 (não reservado)
* `SOURCE_BIND`; adicionado em 8.0.23 (não reservado)
* `SOURCE_COMPRESSION_ALGORITHMS`; adicionado em 8.0.23 (não reservado)
* `SOURCE_CONNECT_RETRY`; adicionado em 8.0.23 (não reservado)
* `SOURCE_DELAY`; adicionado em 8.0.23 (não reservado)
* `SOURCE_HEARTBEAT_PERIOD`; adicionado em 8.0.23 (não reservado)
* `SOURCE_HOST`; adicionado em 8.0.23 (não reservado)
* `SOURCE_LOG_FILE`; removido em 8.0.3
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
* `SQL_CACHE`; removido em 8.0.3

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
* `THREAD_PRIORITY`; adicionado em 8.0.3 (não reservado)
* `TIES`; adicionado em 8.0.2 (não reservado)
* `TIME`
* `TIMESTAMP`
* `TIMESTAMPADD`
* `TIMESTAMPDIFF`
* `TINYBLOB` (R)
* `TINYINT` (R)
* `TINYTEXT` (R)
* `TLS`; adicionado em 8.0.21 (não reservado)
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

* `UNBOUNDED`; adicionado em 8.0.2 (não reservado)
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
* `UNREGISTER`; adicionado em 8.0.27 (não reservado)
* `UNSIGNED` (R)
* `UNTIL`
* `UPDATE` (R)
* `UPGRADE`
* `URL`; adicionado em 8.0.32 (não reservado)
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
* `VCPU`; adicionado em 8.0.3 (não reservado)
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
* `WINDOW` (R); adicionado em 8.0.2 (reservado)
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
* `ZONE`; adicionado em 8.0.22 (não reservado)

### Palavras-chave e palavras reservadas do MySQL 8.0

A lista a seguir mostra as palavras-chave e as palavras reservadas que são adicionadas no MySQL 8.0, em comparação com o MySQL 5.7. As palavras-chave reservadas são marcadas com (R).

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

Eu

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

### MySQL 8.0 remove palavras-chave e palavras reservadas

A lista a seguir mostra as palavras-chave e as palavras reservadas que são removidas no MySQL 8.0, em comparação com o MySQL 5.7. As palavras-chave reservadas são marcadas com (R).

* `ANALYSE`
* `DES_KEY_FILE`
* `MASTER_SERVER_ID`
* `PARSE_GCOL_EXPR`
* `REDOFILE`
* `SQL_CACHE`

### Palavras-chave restritas do MySQL 8.0

Alguns termos-chave do MySQL não são reservados, mas mesmo assim devem ser citados em certas circunstâncias. Esta seção fornece listas desses termos-chave.

* Palavras-chave que devem ser citadas quando usadas como rótulos
* Palavras-chave que devem ser citadas quando usadas como nomes de papéis
* Palavras-chave que devem ser citadas quando usadas como rótulos ou nomes de papéis

#### Palavras-chave que devem ser citadas quando usadas como rótulos

As palavras-chave listadas aqui devem ser citadas quando usadas como rótulos em programas armazenados no MySQL:

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

Eu

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

#### Palavras-chave que devem ser citadas quando usadas como nomes de papel

As palavras-chave listadas aqui devem ser citadas quando usadas como nomes de papéis:

* `EVENT`
* `FILE`
* `NONE`
* `PROCESS`
* `PROXY`
* `RELOAD`
* `REPLICATION`
* `RESOURCE`
* `SUPER`

#### Palavras-chave que devem ser citadas quando usadas como rótulos ou nomes de papéis

As palavras-chave listadas aqui devem ser citadas quando usadas como rótulos em programas armazenados ou como nomes de papéis:

* `EXECUTE`
* `RESTART`
* `SHUTDOWN`