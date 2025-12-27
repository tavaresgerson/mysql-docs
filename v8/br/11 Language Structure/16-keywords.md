## 11.3 Palavras-chave e Palavras Reservadas

Palavras-chave são palavras que têm significado no SQL. Algumas palavras-chave, como `SELECT`, `DELETE` ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT`, são reservadas e requerem tratamento especial para serem usadas como identificadores, como nomes de tabelas e colunas. Isso também pode ser verdadeiro para os nomes de funções integradas.

A maioria das palavras-chave não reservadas é permitida como identificadores sem aspas. Algumas palavras-chave que, de outra forma, são consideradas não reservadas, estão restritas ao uso como identificadores não-aspas para papéis, rótulos de programas armazenados ou, em alguns casos, ambos. Veja Palavras-chave Restritivas do MySQL 8.4, para listas dessas palavras-chave.

Palavras-chave reservadas são permitidas como identificadores se forem citadas conforme descrito na Seção 11.2, “Nomes de Objetos do Schema”:

```
mysql> CREATE TABLE interval (begin INT, end INT);
ERROR 1064 (42000): You have an error in your SQL syntax ...
near 'interval (begin INT, end INT)'
```

`BEGIN` e `END` são palavras-chave, mas não reservadas, então seu uso como identificadores não requer aspas. `INTERVAL` é uma palavra-chave reservada e deve ser citada para ser usada como um identificador:

```
mysql> CREATE TABLE `interval` (begin INT, end INT);
Query OK, 0 rows affected (0.01 sec)
```

Exceção: Uma palavra que segue um ponto em um nome qualificado deve ser um identificador, então não precisa ser citada, mesmo que seja reservada:

```
mysql> CREATE TABLE mydb.interval (begin INT, end INT);
Query OK, 0 rows affected (0.01 sec)
```

Os nomes de funções integradas são permitidos como identificadores, mas podem exigir cuidado para serem usados como tais. Por exemplo, `COUNT` é aceitável como um nome de coluna. No entanto, por padrão, não há espaço em branco permitido em invocações de função entre o nome da função e o caractere `(` seguinte. Esse requisito permite que o analisador distinga se o nome é usado em uma chamada de função ou em um contexto não-funcional. Para mais detalhes sobre o reconhecimento de nomes de funções, veja Seção 11.2.5, “Análise e Resolução de Nomes de Funções”.

A tabela `INFORMATION_SCHEMA.KEYWORDS` lista as palavras consideradas palavras-chave pelo MySQL e indica se são reservadas. Veja Seção 28.3.17, “A Tabela `INFORMATION_SCHEMA` KEYWORDS”.

* Palavras-chave e palavras reservadas do MySQL 8.4
* Novas palavras-chave e palavras reservadas do MySQL 8.4
* Palavras-chave e palavras reservadas removidas do MySQL 8.4
* Palavras-chave restritas do MySQL 8.4

### Palavras-chave e Palavras Reservadas do MySQL 8.4

A lista a seguir mostra as palavras-chave e palavras reservadas no MySQL 8.4, juntamente com as alterações em palavras individuais de uma versão para outra. As palavras-chave reservadas são marcadas com (R). Além disso, `_FILENAME` é reservado.

Em algum momento, você pode fazer uma atualização para uma versão superior, então é uma boa ideia dar uma olhada nas palavras reservadas futuras também. Você pode encontrá-las nos manuais que cobrem versões superiores do MySQL. A maioria das palavras reservadas na lista é proibida pelo SQL padrão como nomes de colunas ou tabelas (por exemplo, `GROUP`). Algumas são reservadas porque o MySQL as precisa e usa um analisador `yacc`.

 A |  B |  C |  D |  E |  F |  G |  H |  I |  J |  K |  L |  M |  N |  O |  P |  Q |  R |  S |  T |  U |  V |  W |  X |  Y |  Z

A

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

* `FACTOR`
* `FAILED_LOGIN_ATTEMPTS`
* `FALSE` (R)
* `FAST`
* `FAULTS`
* `FETCH` (R)
* `FIELDS`
* `FILE`
* `FILE_BLOCK_SIZE`
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

H

* `HANDLER`
* `HASH`
* `HAVING` (R)
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

* `PACK_KEYS`
* `PAGE`
* `PARALELO` (R)
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
* `POLIGON`
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

* `TABELA` (R)
* `TABELAS`
* `TABELAMPLICE` (R)
* `TABELA_CHECKSUM`
* `NOME_TABELA`
* `TEMPORÁRIO`
* `TEMPTÁVEL`
* `TERMINADO` (R)
* `TEXTO`
* `ANTES`
* `ENTÃO` (R)
* `PRIEDADE_DE_CORRENTE`
* `TIES`
* `TEMPO`
* `TIMESTAMP`
* `TIMESTAMPADD`
* `TIMESTAMPDIFF`
* `TINYBLOB` (R)
* `TINYINT` (R)
* `TINYTEXT` (R)
* `TLS`
* `PARA` (R)
* `TRALHEIROS` (R)
* `TRANSAÇÃo`
* `TRIGUEIRO` (R)
* `TRIGUEIROS`
* `VERDADEIRO` (R)
* `TRUNCATE`
* `TIPO`
* `TIPOS`

U

* `INDEFINIDO`
* `INCOMMITIDO`
* `DESIGUAL`
* `UNDO` (R)
* `UNDOFILE`
* `TAMANHO_BUFFER_UNDO`
* `UNICODE`
* `DESINSTALAÇÃO`
* `UNIÃO` (R)
* `ÚNICO` (R)
* `DESCONHECIDO`
* `DESBLOQUEAR` (R)
* `DESREGISTRAR`
* `DESIGUAL` (R)
* `ATÉ`
* `ATUALIZAR` (R)
* `APRESTADO`
* `URL`
* `USO` (R)
* `UTILIZAR` (R)
* `USUARIO`
* `RECURSOS_USUARIO`
* `UTILIZAR_FRM`
* `USANDO` (R)
* `DATA_UTC` (R)
* `TEMPO_UTC` (R)
* `TIMESTAMP_UTC` (R)

V

* `VALIDAÇÃO`
* `VALOR`
* `VALORES` (R)
* `VARBINARY` (R)
* `VARCHAR` (R)
* `VARCHARACTER` (R)
* `VARIAVEIS`
* `VARYING` (R)
* `VCPU`
* `VISTA`
* `VIRTUAIS` (R)
* `VISÍVEL`

W

* `AGUARDA`
* `AVISO`
* `SEMANA`
* `PESO_STRING`
* `QUANDO` (R)
* `QUANDO` (R)
* `ENQUANTO` (R)
* `JANELA` (R)
* `COM` (R)
* `SEM` (R)
* `WORK`
* `WRAPPER`
* `ESCREVER` (R)

X

* `X509`
* `XA`
* `XID`
* `XML`
* `XOR` (R)

Y

* `ANO`
* `MÊS_ANO` (R)

Z

* `ZEROFILL` (R)
* `ZONA`

* `MASTER_AUTO_POSITION`
* `MASTER_BIND` (R)
* `MASTER_COMPRESSION_ALGORITHMS`
* `MASTER_CONNECT_RETRY`
* `MASTER_DELAY`
* `MASTER_HEARTBEAT_PERIOD`
* `MASTER_HOST`
* `MASTER_LOG_FILE`
* `MASTER_LOG_POS`
* `MASTER_PASSWORD`
* `MASTER_PORT`
* `MASTER_PUBLIC_KEY_PATH`
* `MASTER_RETRY_COUNT`
* `MASTER_SSL`
* `MASTER_SSL_CA`
* `MASTER_SSL_CAPATH`
* `MASTER_SSL_CERT`
* `MASTER_SSL_CIPHER`
* `MASTER_SSL_CRL`
* `MASTER_SSL_CRLPATH`
* `MASTER_SSL_KEY`
* `MASTER_SSL_VERIFY_SERVER_CERT` (R)
* `MASTER_TLS_CIPHERSUITES`
* `MASTER_TLS_VERSION`
* `MASTER_USER`
* `MASTER_ZSTD_COMPRESSION_LEVEL`

### Palavras-chave Restritivas do MySQL 8.4

Algumas palavras-chave do MySQL não são reservadas, mas ainda assim devem ser citadas em certas circunstâncias. Esta seção fornece listas dessas palavras-chave.

* Palavras-chave que devem ser citadas quando usadas como rótulos
* Palavras-chave que devem ser citadas quando usadas como nomes de papéis
* Palavras-chave que devem ser citadas quando usadas como rótulos ou nomes de papéis

#### Palavras-chave que devem ser citadas quando usadas como rótulos

As palavras-chave listadas aqui devem ser citadas quando usadas como rótulos em programas armazenados do MySQL:

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

#### Palavras-chave que devem ser citadas quando usadas como nomes de papéis

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

As palavras-chave listadas aqui devem ser citadas quando usadas como rótulos em programas armazenados, ou como nomes de papéis:

* EXECUTAR
* REINICIAR
* DESLIGAR