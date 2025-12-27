## 11.3 Palavras-chave e Palavras Reservadas

Palavras-chave são palavras que têm significado no SQL. Algumas palavras-chave, como `SELECT`, `DELETE` ou `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), são reservadas e requerem tratamento especial para serem usadas como identificadores, como nomes de tabelas e colunas. Isso também pode ser verdadeiro para os nomes de funções integradas.

A maioria das palavras-chave não reservadas é permitida como identificadores sem aspas. Algumas palavras-chave que, de outra forma, são consideradas não reservadas, estão restritas ao uso como identificadores não citados para papéis, rótulos de programas armazenados ou, em alguns casos, ambos. Veja Palavras-chave Restritivas do MySQL 9.5, para listas dessas palavras-chave.

Palavras-chave reservadas são permitidas como identificadores se forem citadas conforme descrito na Seção 11.2, “Nomes de Objetos do Esquema”:

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

Os nomes de funções integradas são permitidos como identificadores, mas podem exigir cuidado para serem usados como tais. Por exemplo, `COUNT` é aceitável como um nome de coluna. No entanto, por padrão, nenhum espaço em branco é permitido em invocações de função entre o nome da função e o caractere `(` seguinte. Esse requisito permite que o analisador distinga se o nome é usado em uma chamada de função ou em um contexto não funcional. Para mais detalhes sobre o reconhecimento de nomes de funções, consulte a Seção 11.2.5, “Análise e Resolução de Nomes de Funções”.

A tabela `INFORMATION_SCHEMA.KEYWORDS` lista as palavras consideradas palavras-chave pelo MySQL e indica se elas são reservadas. Veja a Seção 28.3.17, “A Tabela INFORMATION_SCHEMA KEYWORDS”.

* Palavras-chave e palavras reservadas do MySQL 9.5
* Novas palavras-chave e palavras reservadas do MySQL 9.5
* Palavras-chave e palavras reservadas removidas do MySQL 9.5
* Palavras-chave restritas do MySQL 9.5

### Palavras-chave e palavras reservadas do MySQL 9.5

A lista a seguir mostra as palavras-chave e palavras reservadas no MySQL 9.5, juntamente com as alterações em palavras individuais de uma versão para outra. As palavras-chave reservadas são marcadas com (R). Além disso, `_FILENAME` é reservado.

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
* `DYNAMIC

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

* `IDENTIFICADO`
* `SE` (R)
* `IGNORAR` (R)
* `IGNORAR_ID_SERVIDOR`
* `IMPORTAR`
* `IN` (R)
* `INATIVO`
* `ÍNDICE` (R)
* `ÍNDICES`
* `INFILE` (R)
* `INICIAL`
* `TAMANHO_INICIAL`
* `INICIAR`
* `INTERNO` (R)
* `IN/OUT` (R)
* `INSENSÍVEL` (R)
* `INSERTAR` (R)
* `MÉTODO_INSERTAR`
* `INSTALAR`
* `INSTÂNCIA`
* `INT` (R)
* `INT1` (R)
* `INT2` (R)
* `INT3` (R)
* `INT4` (R)
* `INT8` (R)
* `INTEIRO` (R)
* `INTERSEÇÃO` (R)
* `INTERVALO` (R)
* `EM` (R)
* `INVISÍVEL`
* `INVOKADOR`
* `IO`
* `IO_AFTER_GTIDS` (R)
* `IO_BEFORE_GTIDS` (R)
* `IO_FILHO`
* `IPC`
* `É` (R)
* `ISOLAÇÃO`
* `EMISSOR`
* `REPETIR` (R)

J

* `UNIR` (R)
* `JSON`
* `TABELA_JSON` (R)
* `VALOR_JSON`

K

* `CHAVE` (R)
* `CHIFRE`
* `CHAVES` (R)
* `TAMANHO_BLOCO_CHAVE`
* `MATAR` (R)

L

* `LAG` (R)
* `LÍNGUA`
* `ULTIMO`
* `VALOR_ULTIMO` (R)
* `LATERAL` (R)
* `LEAD` (R)
* `LEADINDO` (R)
* `SAIR` (R)
* `SAÍDOS`
* `ESQUERDA` (R)
* `MENOR`
* `NÚMERO`
* `BIBLIOTECA` (R)
* `LIKE` (R)
* `LIMITE` (R)
* `LINEAR` (R)
* `LINHAS` (R)
* `LINHETA`
* `LISTA`
* `CARREGAR` (R)
* `LOCAL`
* `LOCALTIME` (R)
* `LOCALTIMESTAMP` (R)
* `BLOQUEAR` (R)
* `BLOQUEADO`
* `BLOQUEIOS`
* `LOGAR`
* `LOGFILE`
* `LOGS`
* `LONGO` (R)
* `LONGBLOB` (R)
* `TEXTO_LONGO` (R)
* `LUGAR`
* `MEMÓRIA`
* `UNIR` (R)
* `TEXTO_DE_MENSAGE`
* `MICROSEGUNDO`
* `INT_MÉDIO` (R)
* `MIGRAR`
* `MINUTO`
* `MINUTO_MICROSEGUNDO` (R)
* `MINUTO_SEGUNDO` (R)
* `MIN_LINHAS`
* `MODULAR`
* `MODO`
* `MODIFICAR` (R)
* `ALTERAR`
* `MÊS`
* `MULTILINHETA`
* `MULTIPONTO`
* `MULTIPONTO`
* `MUTEX`
* `ERRNO_MYSQL`

N

* `NOME`
* `NOSSOS NOME`
* `NACIONAL`
* `NATURAL` (R)
* `NCHAR`
* `NDB`
* `NDBCLUSTER`
* `NESTADO`
* `NÚMERO DE NAVEGAÇÃO`
* `NÃO` (R)
* `NOVO`
* `PRÓXIMO`
* `NÃO`
* `GRUPO DE NODES`
* `NENHUM`
* `NÃO` (R)
* `AGORA`
* `SEM ESPERAR`
* `SEM ESCRITURA NO BINLOG` (R)
* `VALOR NÂO TÉRMINADO` (R)
* `DIVISÃO N` (R)
* `NULL` (R)
* `NULLS`
* `NÚMERO`
* `NUMÉRICO` (R)
* `NVARCHAR`

O

* `DE` (R)
* `DESLIGADO`
* `DESLOCAMENTO`
* `OJ`
* `VELOCIDADE` (R)
* `VELOCIDADE DE PROCESSAMENTO`
* `PARALELISMO` (R)
* `PARAMETROS`
* `ANALISADOR`
* `ÁRVORE DE ANÁLISE`
* `PARTIAL`
* `PARTIÇÃO` (R)
* `PARTILHAÇÃO`
* `PARTIÇÕES`
* `SENHA`
* `TEMPO DE BLOCO DE SENHA`
* `CAMADA`
* `PERCENTUAL` (R)
* `PRESERVAR`
* `PRESERVAR SOMENTE`
* `FASE`
* `PLUGIN`
* `PLUGIN`
* `DIR_PLUGIN`
* `PONTO`
* `POLÍGONO`
* `PORTA`
* `PRECEDER`
* `PRECEDENTE`
* `PRECISÃO` (R)
* `PREPARAR`
* `PRESERVAR`
* `PRECEDENTE`
* `PRIMÁRIO` (R)
* `PRIVILEGIOS`
* `VERIFICAR PRIVILEGIOS DO USUÁRIO`
* `PROCEDURE` (R)
* `PROCESSO`
* `LISTA DE PROCESSOS`
* `PROFILO`
* `PROFILOS`
* `PROXIMA`
* `LIMPAR` (R)

Q

* `QUALIFICAR` (R)
* `QUARTO`
* `QUERY`
* `RÁPIDO`

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
* `REENAME` (R)
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

* `TABELA` (R)
* `TABELAS`
* `TABELAMPLIAMENTO` (R)
* `TABELA_ESPACAMENTO`
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
* `TRALHE` (R)
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
* `DESREGISTRAR`
* `UNIÃO` (R)
* `ÚNICO` (R)
* `DESCONHECIDO`
* `DESBLOQUEAR` (R)
* `DESREGISTRAR`
* `ÍNDICES` (R)
* `UNSIGNED` (R)
* `ATÉ`
* `ATUALIZAR` (R)
* `APRENDER`
* `URI`
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
* `VECTOR`
* `VERIFICAR_CONSTRAINTS_DE_CHAVE`
* `VISÃO`
* `VIRTUÁLEO` (R)
* `VISÍVEL`

W

* `AGUARDA`
* `ADVERTENCIAS`
* `SEMANA`
* `STRINGA_PESO`
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

* `GUIDADO`

H

* `CABEçalho`

L

* `BIBLIOTECA` (R)

M

* `MATERIALIZADO`

P

* `PARAMÉTRICOS`

R

* `RELACIONAL`

S

* `CARREGAMENTO ESTRICTO`

U

* `URI`

V

* `VETOR`
* `VERIFICAR CONSTRAINTS DE CHAVE`

### Palavras-chave e Palavras Reservadas Removidas no MySQL 9.5

A lista a seguir mostra as palavras-chave e palavras reservadas que são removidas no MySQL 9.5, em comparação com o MySQL 8.4. As palavras-chave reservadas estão marcadas com (R).

Não há palavras-chave removidas entre o MySQL 8.4-9.5.

### Palavras-chave Restritivas do MySQL 9.5

Algumas palavras-chave do MySQL não são reservadas, mas ainda assim devem ser citadas em certas circunstâncias. Esta seção fornece listas dessas palavras-chave.

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

#### Palavras-chave que devem ser citadas quando usadas como nomes de papéis

As palavras-chave listadas aqui devem ser citadas quando usadas como nomes de papéis:

* `EVENTO`
* `FILE`
* `NONE`
* `PROCESS`
* `PROXY`
* `RELOAD`
* `REPLICATION`
* `RESOURCE`
* `SUPER`

As palavras-chave listadas aqui devem ser citadas quando usadas como rótulos em programas armazenados ou como nomes de papéis:

* `EXECUTAR`
* `REINICIAR`
* `FECHAR`