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

- `ACCESÍVEL` (R)
- `ACCOUNT`; adicionado em 5.7.6 (não reservado)
- `AÇÃO`
- `ADD` (R)
- `DEPOIS`
- `DESSE LADO DE`
- `AGREGADO`
- ALGORITMO
- `TODOS` (R)
- `ALTERAR` (R)
- `Sempre`; adicionado em 5.7.6 (não reservado)
- `ANÁLISE`
- `ANALISE` (R)
- `E` (R)
- `QUALQUER`
- `AS` (R)
- `ASC` (R)
- `ASCII`
- `ASENSITIVE` (R)
- `AT`
- `AUTOEXTEND_SIZE`
- `AUTO_INCREMENT`
- `AVG`
- `AVG_ROW_LENGTH`

B

- `BACKUP`
- `ANTES` (R)
- `COMEÇO`
- `ENTRE` (R)
- `BIGINT` (R)
- `BINARY` (R)
- `BINLOG`
- `BIT`
- `BLOB` (R)
- `BLOQUEAR`
- `BOOL`
- `BOOLEAN`
- `Ambos` (R)
- `BTREE`
- `PELA` (R)
- `BYTE`

C

- `CACHE`
- `CHAMAR` (R)
- `CASCADE` (R)
- `CASCADADO`
- `CASO` (R)
- `CATALOG_NAME`
- `CADEIA`
- `MUDAR` (R)
- `ALTERADO`
- `CANAL`; adicionado em 5.7.6 (não reservado)
- `CHAR` (R)
- `PERSONAGEM` (R)
- `CHARSET`
- `VER` (R)
- `CHECKSUM`
- CIPHER
- `CLASS_ORIGIN`
- `CLIENTE`
- `FECHAR`
- `COALESCE`
- `CÓDIGO`
- `COLLATE` (R)
- `COLAÇAO`
- `COLUNA` (R)
- `COLUNAS`
- `COLUMN_FORMAT`
- `NOME_COLUNA`
- `COMENTÁRIO`
- `COMPROMETIDO`
- `COMPROMETIDO`
- `COMPACT`
- `CONCLUSÃO`
- COMPACTADO
- `COMPRESSION`; adicionado em 5.7.8 (não reservado)
- `CONCURRENT`
- `CONDICIONAL` (R)
- `CONEXÃO`
- `CONSISTENTE`
- `CONSTRAINT` (R)
- `CONSTRAINT_CATALOG`
- `CONSTRAINT_NAME`
- `CONSTRAINT_SCHEMA`
- CONTEVE
- `CONTEXTO`
- `CONTINUE` (R)
- `CONVERT` (R)
- `CPU`
- `Crie` (R)
- `CROSS` (R)
- `CUBE`
- `ATUAL`
- `DATA_ATUAL` (R)
- `CURRENT_TIME` (R)
- `CURRENT_TIMESTAMP` (R)
- `USUARIO_CORRENTE` (R)
- `CURSOR` (R)
- `CURSOR_NAME`

D

- `Dados`
- `DATABASE` (R)
- `DATABASES` (R)
- `DATAFILE`
- `DATA`
- `DATETIME`
- `DIA`
- `DIA_HORA` (R)
- `DAY_MICROSECOND` (R)
- `DIA_MINUTO` (R)
- `DIA_SEGUNDO` (R)
- `DEALLOCATE`
- `DEC` (R)
- `DECIMAL` (R)
- `DECLARAR` (R)
- `DEFAULT` (R)
- `DEFAULT_AUTH`
- `DEFINIR`
- `ATRASADO` (R)
- `DELAY_KEY_WRITE`
- `DELETAR` (R)
- `DESC` (R)
- `DESCRIBE` (R)
- `DES_KEY_FILE`
- `DETERMINÍSTICO` (R)
- `DIAGNÓSTICOS`
- `DIR`
- `DESABILITAR`
- `DESCARTE`
- `DISK`
- `DISTINCT` (R)
- `DISTINCTROW` (R)
- `DIV` (R)
- `DO`
- `DOBLAR` (R)
- `DROP` (R)
- `DUAL` (R)
- `DUMPFILE`
- `DUPLICADO`
- `DINÂMICA`

E

- `EACH` (R)
- `ELSE` (R)
- `ELSEIF` (R)
- `ATIVAR`
- `ENCLOSED` (R)
- `ENCRYPTION`; adicionado em 5.7.11 (não reservado)
- `FIM`
- `FIM`
- `MOTOR`
- MOTORES
- `ENUM`
- `ERRO`
- `ERROS`
- `ESCAPAR`
- `ESCAPED` (R)
- `Evento`
- `EVENTOS`
- `TODOS`
- `TROCA`
- `EXECUTAR`
- `EXISTE` (R)
- `SAÍDA` (R)
- `EXPANSÃO`
- `EXPIRAR`
- `EXPLAIN` (R)
- `EXPORTAR`
- `EXTENDIDO`
- `EXTENT_SIZE`

F

- `FALSO` (R)
- `FAST`
- FALHAS
- `FETCH` (R)
- `CAMPOS`
- `Arquivo`
- `FILE_BLOCK_SIZE`; adicionado em 5.7.6 (não reservado)
- `FILTER`; adicionado em 5.7.3 (não reservado)
- `PRIMEIRO`
- `CORRIGIDO`
- `FLOAT` (R)
- `FLOAT4` (R)
- `FLOAT8` (R)
- `FLUSH`
- `Segue`; adicionado em 5.7.2 (não reservado)
- `PARA` (R)
- `FORÇA` (R)
- `ESTRANGEIRO` (R)
- `FORMATO`
- `ENCONTRADO`
- `DE` (R)
- `TOTAL`
- `FULLTEXT` (R)
- `FUNÇÃO`

G

- `GERAL`
- `GENERATED` (R); adicionado em 5.7.6 (reservado)
- `GEOMETRIA`
- `GEOMETRYCOLLECTION`
- `GET` (R)
- `GET_FORMAT`
- `GLOBAL`
- `CONCEDA` (R)
- `BÔNUS`
- `GRUPO` (R)
- `GROUP_REPLICATION`; adicionado em 5.7.6 (não reservado)

H

- `HANDLER`
- `HASH`
- `HAVENDO` (R)
- `AJUDA`
- `ALTA_PRIORIDADE` (R)
- `HOST`
- `HOSTS`
- `HORÁRIA`
- `HOUR_MICROSECOND` (R)
- `HOUR_MINUTE` (R)
- `HOUR_SECOND` (R)

Eu

- `IDENTIFICADO`
- `SE` (R)
- `IGNORAR` (R)
- `IGNORE_SERVER_IDS`
- `IMPORTE`
- `IN` (R)
- `ÍNDICE` (R)
- `ÍNDICES`
- `INFILE` (R)
- `INITIAL_SIZE`
- `INNER` (R)
- `INOUT` (R)
- `INSENSÍVEL` (R)
- `INSERT` (R)
- `INSERT_METHOD`
- `INSTALAR`
- `INSTANCE`; adicionado em 5.7.11 (não reservado)
- `INT` (R)
- `INT1` (R)
- `INT2` (R)
- `INT3` (R)
- `INT4` (R)
- `INT8` (R)
- `INTEIRO` (R)
- `INTERVALO` (R)
- `INTO` (R)
- `INVOKER`
- `IO`
- `IO_AFTER_GTIDS` (R)
- `IO_BEFORE_GTIDS` (R)
- `IO_THREAD`
- `IPC`
- `IS` (R)
- `ISOLAÇÃO`
- `EMISSOR`
- `ITERAR` (R)

J

- `JUNTAR` (R)
- `JSON`; adicionado em 5.7.8 (não reservado)

K

- `CHAVE` (R)
- `CHAVES` (R)
- `KEY_BLOCK_SIZE`
- `KILL` (R)

L

- `LINGUAGEM`
- `Última`
- `LIDER` (R)
- `SAÍDA` (R)
- "FOLHAS"
- `ESQUERDA` (R)
- `LESS`
- `NÍVEL`
- `LIKE` (R)
- `LIMITE` (R)
- `LINEAR` (R)
- `LINHAS` (R)
- `LINESTRING`
- `LISTA`
- `CARREGAR` (R)
- `LOCAL`
- `LOCALTIME` (R)
- `LOCALTIMESTAMP` (R)
- `LOCK` (R)
- `LÂMINAS DE ALCANCE`
- `LOGFILE`
- `LOGS`
- `LONGO` (R)
- `LONGBLOB` (R)
- `LONGTEXT` (R)
- `LOOP` (R)
- `BAIXA PRIORIDADE` (R)

M

- `MESTRE`
- `MASTER_AUTO_POSITION`
- `MASTER_BIND` (R)
- `MASTER_CONNECT_RETRY`
- `MASTER_DELAY`
- `MASTER_HEARTBEAT_PERIOD`
- `MASTER_HOST`
- `MASTER_LOG_FILE`
- `MASTER_LOG_POS`
- `SENHA_MAESTRA`
- `MASTER_PORT`
- `MASTER_RETRY_COUNT`
- `MASTER_SERVER_ID`
- `MASTER_SSL`
- `MASTER_SSL_CA`
- `MASTER_SSL_CAPATH`
- `MASTER_SSL_CERT`
- `MASTER_SSL_CIPHER`
- `MASTER_SSL_CRL`
- `MASTER_SSL_CRLPATH`
- `MASTER_SSL_KEY`
- `MASTER_SSL_VERIFY_SERVER_CERT` (R)
- `MASTER_TLS_VERSION`; adicionado em 5.7.10 (não reservado)
- `MASTER_USER`
- `MATCH` (R)
- `MAXVALUE` (R)
- `MAX_CONNECTIONS_PER_HOUR`
- `MAX_QUERIES_PER_HOUR`
- `MAX_ROWS`
- `MAX_SIZE`
- `MAX_STATEMENT_TIME`; adicionado em 5.7.4 (não reservado); removido em 5.7.8
- `MAX_UPDATES_PER_HOUR`
- `MAX_USER_CONNECTIONS`
- `MÉDIO`
- `MEDIUMBLOB` (R)
- `MEDIUMINT` (R)
- `MEDIUMTEXT` (R)
- `MEMORY`
- `JUNTAR`
- `MESSAGE_TEXT`
- `MICROSEGUNDO`
- `MIDDLEINT` (R)
- `MIGRATE`
- `MINUTO`
- `MINUTE_MICROSECOND` (R)
- `MINUTE_SECOND` (R)
- `MIN_ROWS`
- `MOD` (R)
- `MODO`
- `MODIFICA` (R)
- `MODIFICAR`
- `MÊS`
- `MULTILINESTRING`
- `MULTIPOINT`
- `MULTIPOLIGÔNIO`
- `MUTEX`
- `MYSQL_ERRNO`

N

- `NOME`
- `NÚMEROS`
- `NACIONAL`
- `NATURAL` (R)
- `NCHAR`
- `NDB`
- `NDBCLUSTER`
- `NÃO`; adicionado em 5.7.4 (não reservado)
- `NOVO`
- `Próximo`
- Não
- `NODEGROUP`
- `NONBLOCKING`; removido em 5.7.6
- `NÃO HÁ`
- `NÃO` (R)
- `NO_WAIT`
- `NO_WRITE_TO_BINLOG` (R)
- `NULL` (R)
- `NÚMERO`
- `NUMÉRICO` (R)
- `NVARCHAR`

O

- `OFFSET`
- `OLD_PASSWORD`; removido em 5.7.5
- `ON` (R)
- `ONE`
- `SOMENTE`
- `ABERTO`
- `Otimizar` (R)
- `OPTIMIZER_COSTS` (R); adicionado em 5.7.5 (reservado)
- `OPCÃO` (R)
- `OPCIONALMENTE` (R)
- `OPCÕES`
- `OU` (R)
- `ORDEM` (R)
- `OUT` (R)
- `OUTER` (R)
- `OUTFILE` (R)
- `PROPRIETÁRIO`

P

- `PACK_KEYS`
- `Página`
- `PARSER`
- `PARSE_GCOL_EXPR`; adicionado em 5.7.6 (reservado); tornou-se não reservado em 5.7.8
- `PARCIAL`
- `PARTITION` (R)
- `PARticionamento`
- `PARTIÇÕES`
- `SENHA`
- `FASE`
- `PLUGIN`
- `PLUGINS`
- `PLUGIN_DIR`
- `PONTO`
- `POLÍGONO`
- `PORT`
- `PRECEDES`; adicionado em 5.7.2 (não reservado)
- `PRECISÃO` (R)
- `PREPARE`
- `PRESERVAR`
- `PREV`
- `PRIMÁRIO` (R)
- PRÉMIOS
- `PROCEDIMENTO` (R)
- `PROCESSLIST`
- `PROFILO`
- `PERFIS`
- `PROXY`
- `PURGE` (R)

Q

- "QUARTO"
- `QUERY`
- `RÁPIDO`

R

- `RANGE` (R)
- `LEIA` (R)
- `LEIA` (R)
- `READ_ONLY`
- `LEIA E ESCREVA` (R)
- `REAL` (R)
- `REBUILD`
- `RECOVER`
- `REDOFILE`
- `REDO_BUFFER_SIZE`
- `REPETIDO`
- `REFERÊNCIAS` (R)
- `REGEXP` (R)
- `RELAY`
- `RELAYLOG`
- `RELAY_LOG_FILE`
- `RELAY_LOG_POS`
- `RELAY_THREAD`
- `RELÂNCIA` (R)
- `RELOAD`
- `Remover`
- `RENOMEAR` (R)
- `REORGANIZAR`
- `REPAIR`
- `REPETIR` (R)
- REPETÍVEL
- `REPLACE` (R)
- `REPLICATE_DO_DB`; adicionado em 5.7.3 (não reservado)
- `REPLICATE_DO_TABLE`; adicionado em 5.7.3 (não reservado)
- `REPLICATE_IGNORE_DB`; adicionado em 5.7.3 (não reservado)
- `REPLICATE_IGNORE_TABLE`; adicionado em 5.7.3 (não reservado)
- `REPLICATE_REWRITE_DB`; adicionado em 5.7.3 (não reservado)
- `REPLICATE_WILD_DO_TABLE`; adicionado em 5.7.3 (não reservado)
- `REPLICATE_WILD_IGNORE_TABLE`; adicionado em 5.7.3 (não reservado)
- `REPLICAÇÃO`
- `REQUERER` (R)
- `REESTAR`
- `RESIGNAL` (R)
- `REESTABELECER`
- `RESTRIÇÃO` (R)
- `RESUMÃO`
- `RETORNAR` (R)
- `RETURNED_SQLSTATE`
- `RETIRADOS`
- `REVERSAR`
- `REVOKE` (R)
- `DIREITO` (R)
- `RLIKE` (R)
- `REVERTAR`
- `ROLLUP`
- `ROTATE`; adicionado em 5.7.11 (não reservado)
- `ROTINA`
- `LINHA`
- `LINHAS`
- `ROW_COUNT`
- `ROW_FORMAT`
- `RTREE`

S

- `SAVEPOINT`
- `PROGRAMA`
- `SCHEMA` (R)
- `SCHEMAS` (R)
- `SCHEMA_NAME`
- `SEGUNDO`
- `SEGUNDO_MICROSEGUNDO` (R)
- SEGURANÇA
- `SELECT` (R)
- `SENSITIVE` (R)
- `SEPARATOR` (R)
- `SERIAL`
- `SERIALIZÁVEL`
- `SERVIDOR`
- `SESSÃO`
- `SET` (R)
- `PARtilhar`
- `SHOW` (R)
- `FECHAR`
- `SINAL` (R)
- ASSINADO
- `SIMPLES`
- `ESCRAVO`
- `LENTO`
- `SMALLINT` (R)
- `SNAPSHOT`
- `SOCKET`
- `alguns`
- `SONAME`
- `Sons`
- `FONTE`
- `SPATIAL` (R)
- `ESPECÍFICA` (R)
- `SQL` (R)
- `SQLEXCEPTION` (R)
- `SQLSTATE` (R)
- `SQLWARNING` (R)
- `SQL_AFTER_GTIDS`
- `SQL_AFTER_MTS_GAPS`
- `SQL_BEFORE_GTIDS`
- `SQL_BIG_RESULT` (R)
- `SQL_BUFFER_RESULT`
- `SQL_CACHE`
- `SQL_CALC_FOUND_ROWS` (R)
- `SQL_NO_CACHE`
- `SQL_SMALL_RESULT` (R)
- `SQL_THREAD`
- `SQL_TSI_DAY`
- `SQL_TSI_HOUR`
- `SQL_TSI_MINUTE`
- `SQL_TSI_MÊS`
- `SQL_TSI_QUARTER`
- `SQL_TSI_SECOND`
- `SQL_TSI_WEEK`
- `SQL_TSI_YEAR`
- `SSL` (R)
- `EM PILHA`
- `COMEÇAR`
- `INICIANDO` (R)
- `INÍCIO`
- `STATS_AUTO_RECALC`
- `STATS_PERSISTENT`
- `STATS_SAMPLE_PAGES`
- `STATUS`
- `PARAR`
- `Armazenamento`
- `STORED` (R); adicionado em 5.7.6 (reservado)
- `STRAIGHT_JOIN` (R)
- `STRING`
- `SUBCLASS_ORIGIN`
- `ASSUNTO`
- `SUBPARTITION`
- `SUBPARTITIONS`
- `SUPER`
- `SUSPENDER`
- `SWAPS`
- `SWITCHES`

T

- `TABELA` (R)
- `TABELAS`
- `TABLESPACE`
- `TABLE_CHECKSUM`
- `NOME_TABELA`
- `TEMPORÁRIA`
- `TENTAÇÃO`
- `TERMINADO` (R)
- `TEXT`
- `DO QUE`
- `ENTÃO` (R)
- `TIME`
- `TIMESTAMP`
- `TIMESTAMPADD`
- `TIMESTAMPDIFF`
- `TINYBLOB` (R)
- `TINYINT` (R)
- `TINYTEXT` (R)
- `TO` (R)
- `DESLIZANTE` (R)
- `TRANSAÇÃO`
- `TRIGGER` (R)
- `TRIGGERS`
- `TRUE` (R)
- `TRUNCATE`
- `TIPO`
- `TIPOS`

U

- `UNCOMMITTED`
- `DESCONHECIDO`
- `DESFAZER` (R)
- `UNDOFILE`
- `UNDO_BUFFER_SIZE`
- `UNICODE`
- `DESINSTALAR`
- `UNIÃO` (R)
- `ÚNICA` (R)
- `DESCONHECIDO`
- `DESBLOQUEAR` (R)
- `DESIGUALADO` (R)
- `ATÉ`
- `ATUALIZAR` (R)
- `UPGRADE`
- `USO` (R)
- `USE` (R)
- `USUARIO`
- `USER_RESOURCES`
- `USE_FRM`
- `USANDO` (R)
- `UTC_DATE` (R)
- `UTC_TIME` (R)
- `UTC_TIMESTAMP` (R)

V

- `VALIDAÇÃO`; adicionado em 5.7.5 (não reservado)
- `VALOR`
- `VALORES` (R)
- `VARBINARY` (R)
- `VARCHAR` (R)
- `VARCHARACTER` (R)
- `VARIAVEIS`
- `VARYING` (R)
- `VISUALIZAR`
- `VIRTUAL` (R); adicionado em 5.7.6 (reservado)

W

- `Aguarde`
- `AVISO`
- `SEMANA`
- `WEIGHT_STRING`
- `QUANDO` (R)
- `WHERE` (R)
- `ENQUANTO` (R)
- `COM` (R)
- `SEM`; adicionado em 5.7.5 (não reservado)
- `Trabalho`
- `WRAPPER`
- `ESCREVA` (R)

X

- `X509`
- `XA`
- `XID`; adicionado em 5.7.5 (não reservado)
- `XML`
- `XOR` (R)

Y

- `ANO`
- `ANO_MÊS` (R)

Z

- `ZEROFILL` (R)

### Palavras-chave e palavras reservadas do MySQL 5.7

A lista a seguir mostra as palavras-chave e as palavras reservadas que são adicionadas no MySQL 5.7, em comparação com o MySQL 5.6. As palavras-chave reservadas são marcadas com (R).

A | C | E | F | G | I | J | M | N | O | P | R | S | V | W | X

A

- `CONTROLE DE CONTA`
- `ALTA VEZ`

C

- `CANAL`
- COMPRESSÃO

E

- Criptografia

F

- `FILE_BLOCK_SIZE`
- `FILTRO`
- FAZ SEGUINTE

G

- `GERADO` (R)
- `REPLICAÇÃO DE GRUPO`

Eu

- `INSTANCE`

J

- `JSON`

M

- `MASTER_TLS_VERSION`

N

- `NUNCA`

O

- `OPTIMIZER_COSTS` (R)

P

- `PARSE_GCOL_EXPR`
- `PRECEDES`

R

- `REPLICATE_DO_DB`
- `REPLICATE_DO_TABLE`
- `REPLICATE_IGNORE_DB`
- `REPLICATE_IGNORE_TABLE`
- `REPLICATE_REWRITE_DB`
- `REPLICATE_WILD_DO_TABLE`
- `REPLICATE_WILD_IGNORE_TABLE`
- `ROTAR`

S

- `EM PILHA`
- `Armazenado` (R)

V

- `VALIDAÇÃO`
- `VIRTUAL` (R)

W

- `SEM`

X

- `XID`

### MySQL 5.7 remove palavras-chave e palavras reservadas

A lista a seguir mostra as palavras-chave e as palavras reservadas que são removidas no MySQL 5.7, em comparação com o MySQL 5.6. As palavras-chave reservadas são marcadas com (R).

- `SENHA_ANTIGA`
