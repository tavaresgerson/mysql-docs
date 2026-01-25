#### 6.4.5.4 Formatos de Arquivos de Log de Auditoria

O servidor MySQL chama o audit log plugin para gravar um registro de auditoria em seu arquivo de log sempre que um evento auditável ocorre. Tipicamente, o primeiro registro de auditoria gravado após a inicialização do plugin contém a descrição do servidor e as opções de startup. Os elementos seguintes representam eventos como eventos de conexão e desconexão de clientes, instruções SQL executadas e assim por diante. Apenas as instruções de nível superior são registradas, não as instruções dentro de stored programs como triggers ou stored procedures. O conteúdo de arquivos referenciados por instruções como [`LOAD DATA`](load-data.html "13.2.6 Instrução LOAD DATA") não é registrado.

Para selecionar o formato de log que o audit log plugin usa para gravar seu arquivo de log, defina a variável de sistema [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format) na inicialização do servidor (server startup). Estes formatos estão disponíveis:

* Formato XML de novo estilo ([`audit_log_format=NEW`](audit-log-reference.html#sysvar_audit_log_format)): Um formato XML que possui melhor compatibilidade com o Oracle Audit Vault do que o formato XML de estilo antigo. O MySQL 5.7 usa o formato XML de novo estilo por padrão.

* Formato XML de estilo antigo ([`audit_log_format=OLD`](audit-log-reference.html#sysvar_audit_log_format)): O formato de audit log original usado por padrão em séries mais antigas do MySQL.

* Formato JSON ([`audit_log_format=JSON`](audit-log-reference.html#sysvar_audit_log_format))

Por padrão, o conteúdo do arquivo de audit log é gravado no formato XML de novo estilo, sem compressão ou encryption.

Nota

Para obter informações sobre questões a considerar ao alterar o formato de log, consulte [Selecionando o Formato do Arquivo de Log de Auditoria](audit-log-logging-configuration.html#audit-log-file-format "Selecionando o Formato do Arquivo de Log de Auditoria").

As seções a seguir descrevem os formatos de log de auditoria disponíveis:

* [Formato de Arquivo de Log de Auditoria XML de Novo Estilo](audit-log-file-formats.html#audit-log-file-new-style-xml-format "Formato de Arquivo de Log de Auditoria XML de Novo Estilo")
* [Formato de Arquivo de Log de Auditoria XML de Estilo Antigo](audit-log-file-formats.html#audit-log-file-old-style-xml-format "Formato de Arquivo de Log de Auditoria XML de Estilo Antigo")
* [Formato de Arquivo de Log de Auditoria JSON](audit-log-file-formats.html#audit-log-file-json-format "Formato de Arquivo de Log de Auditoria JSON")

##### Formato de Arquivo de Log de Auditoria XML de Novo Estilo

Aqui está um exemplo de arquivo de log no formato XML de novo estilo ([`audit_log_format=NEW`](audit-log-reference.html#sysvar_audit_log_format)), ligeiramente reformatado para melhor legibilidade:

```sql
<?xml version="1.0" encoding="utf-8"?>
<AUDIT>
 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:06:33 UTC</TIMESTAMP>
  <RECORD_ID>1_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Audit</NAME>
  <SERVER_ID>1</SERVER_ID>
  <VERSION>1</VERSION>
  <STARTUP_OPTIONS>/usr/local/mysql/bin/mysqld
    --socket=/usr/local/mysql/mysql.sock
    --port=3306</STARTUP_OPTIONS>
  <OS_VERSION>i686-Linux</OS_VERSION>
  <MYSQL_VERSION>5.7.21-log</MYSQL_VERSION>
 </AUDIT_RECORD>
 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:38 UTC</TIMESTAMP>
  <RECORD_ID>2_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Connect</NAME>
  <CONNECTION_ID>5</CONNECTION_ID>
  <STATUS>0</STATUS>
  <STATUS_CODE>0</STATUS_CODE>
  <USER>root</USER>
  <OS_LOGIN/>
  <HOST>localhost</HOST>
  <IP>127.0.0.1</IP>
  <COMMAND_CLASS>connect</COMMAND_CLASS>
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
  <PRIV_USER>root</PRIV_USER>
  <PROXY_USER/>
  <DB>test</DB>
 </AUDIT_RECORD>

...

 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:38 UTC</TIMESTAMP>
  <RECORD_ID>6_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Query</NAME>
  <CONNECTION_ID>5</CONNECTION_ID>
  <STATUS>0</STATUS>
  <STATUS_CODE>0</STATUS_CODE>
  <USER>root[root] @ localhost [127.0.0.1]</USER>
  <OS_LOGIN/>
  <HOST>localhost</HOST>
  <IP>127.0.0.1</IP>
  <COMMAND_CLASS>drop_table</COMMAND_CLASS>
  <SQLTEXT>DROP TABLE IF EXISTS t</SQLTEXT>
 </AUDIT_RECORD>

...

 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:39 UTC</TIMESTAMP>
  <RECORD_ID>8_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Quit</NAME>
  <CONNECTION_ID>5</CONNECTION_ID>
  <STATUS>0</STATUS>
  <STATUS_CODE>0</STATUS_CODE>
  <USER>root</USER>
  <OS_LOGIN/>
  <HOST>localhost</HOST>
  <IP>127.0.0.1</IP>
  <COMMAND_CLASS>connect</COMMAND_CLASS>
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
 </AUDIT_RECORD>

...

 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:43 UTC</TIMESTAMP>
  <RECORD_ID>11_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Quit</NAME>
  <CONNECTION_ID>6</CONNECTION_ID>
  <STATUS>0</STATUS>
  <STATUS_CODE>0</STATUS_CODE>
  <USER>root</USER>
  <OS_LOGIN/>
  <HOST>localhost</HOST>
  <IP>127.0.0.1</IP>
  <COMMAND_CLASS>connect</COMMAND_CLASS>
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
 </AUDIT_RECORD>
 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:45 UTC</TIMESTAMP>
  <RECORD_ID>12_2019-10-03T14:06:33</RECORD_ID>
  <NAME>NoAudit</NAME>
  <SERVER_ID>1</SERVER_ID>
 </AUDIT_RECORD>
</AUDIT>
```

O arquivo de audit log é gravado como XML, usando UTF-8 (até 4 bytes por caractere). O elemento raiz é `<AUDIT>`. O elemento raiz contém elementos `<AUDIT_RECORD>`, cada um dos quais fornece informações sobre um evento auditado. Quando o audit log plugin começa a gravar um novo arquivo de log, ele grava a declaração XML e a tag de abertura do elemento raiz `<AUDIT>`. Quando o plugin fecha um arquivo de log, ele grava a tag de fechamento do elemento raiz `</AUDIT>`. A tag de fechamento não está presente enquanto o arquivo está aberto.

Os elementos dentro dos elementos `<AUDIT_RECORD>` possuem estas características:

* Alguns elementos aparecem em cada elemento `<AUDIT_RECORD>`. Outros são opcionais e podem aparecer dependendo do tipo de registro de auditoria.

* A ordem dos elementos dentro de um elemento `<AUDIT_RECORD>` não é garantida.

* Os valores dos elementos não possuem comprimento fixo. Valores longos podem ser truncados conforme indicado nas descrições dos elementos fornecidas posteriormente.

* Os caracteres `<`, `>`, `"`, e `&` são codificados como `&lt;`, `&gt;`, `&quot;`, e `&amp;`, respectivamente. Bytes NUL (U+00) são codificados como o caractere `?`.

* Caracteres que não são válidos como caracteres XML são codificados usando referências numéricas de caracteres. Caracteres XML válidos são:

```sql
  #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
  ```

Os seguintes elementos são obrigatórios em todo elemento `<AUDIT_RECORD>`:

* `<NAME>`

  Uma string que representa o tipo de instrução que gerou o evento de auditoria, como um comando que o servidor recebeu de um cliente.

  Exemplo:

  ```sql
  <NAME>Query</NAME>
  ```

  Alguns valores comuns de `<NAME>`:

  ```sql
  Audit    When auditing starts, which may be server startup time
  Connect  When a client connects, also known as logging in
  Query    An SQL statement (executed directly)
  Prepare  Preparation of an SQL statement; usually followed by Execute
  Execute  Execution of an SQL statement; usually follows Prepare
  Shutdown Server shutdown
  Quit     When a client disconnects
  NoAudit  Auditing has been turned off
  ```

  Os valores possíveis são `Audit`, `Binlog Dump`, `Change user`, `Close stmt`, `Connect Out`, `Connect`, `Create DB`, `Daemon`, `Debug`, `Delayed insert`, `Drop DB`, `Execute`, `Fetch`, `Field List`, `Init DB`, `Kill`, `Long Data`, `NoAudit`, `Ping`, `Prepare`, `Processlist`, `Query`, `Quit`, `Refresh`, `Register Slave`, `Reset stmt`, `Set option`, `Shutdown`, `Sleep`, `Statistics`, `Table Dump`, `TableDelete`, `TableInsert`, `TableRead`, `TableUpdate`, `Time`.

  Muitos desses valores correspondem aos valores de comando `COM_xxx` listados no arquivo header `my_command.h`. Por exemplo, `Create DB` e `Change user` correspondem a `COM_CREATE_DB` e `COM_CHANGE_USER`, respectivamente.

  Eventos com valores `<NAME>` de `TableXXX` acompanham eventos `Query`. Por exemplo, a seguinte instrução gera um evento `Query`, dois eventos `TableRead` e um evento `TableInsert`:

  ```sql
  INSERT INTO t3 SELECT t1.* FROM t1 JOIN t2;
  ```

  Cada evento `TableXXX` contém elementos `<TABLE>` e `<DB>` para identificar a table à qual o evento se refere e o Database que contém a table.

* `<RECORD_ID>`

  Um identificador exclusivo para o registro de auditoria. O valor é composto por um número de sequência e um timestamp, no formato `SEQ_TIMESTAMP`. Quando o audit log plugin abre o arquivo de log de auditoria, ele inicializa o número de sequência para o tamanho do arquivo de log de auditoria e, em seguida, incrementa a sequência em 1 para cada registro logado. O timestamp é um valor UTC no formato `YYYY-MM-DDThh:mm:ss` indicando a data e hora em que o audit log plugin abriu o arquivo.

  Exemplo:

  ```sql
  <RECORD_ID>12_2019-10-03T14:06:33</RECORD_ID>
  ```

* `<TIMESTAMP>`

  Uma string que representa um valor UTC no formato `YYYY-MM-DDThh:mm:ss UTC` indicando a data e hora em que o evento de auditoria foi gerado. Por exemplo, o evento correspondente à execução de uma instrução SQL recebida de um cliente tem um valor `<TIMESTAMP>` que ocorre após a instrução ser concluída, e não quando foi recebida.

  Exemplo:

  ```sql
  <TIMESTAMP>2019-10-03T14:09:45 UTC</TIMESTAMP>
  ```

Os seguintes elementos são opcionais nos elementos `<AUDIT_RECORD>`. Muitos deles ocorrem apenas com valores de elemento `<NAME>` específicos.

* `<COMMAND_CLASS>`

  Uma string que indica o tipo de ação realizada.

  Exemplo:

  ```sql
  <COMMAND_CLASS>drop_table</COMMAND_CLASS>
  ```

  Os valores correspondem aos contadores de comando `statement/sql/xxx`. Por exemplo, *`xxx`* é `drop_table` e `select` para instruções [`DROP TABLE`](drop-table.html "13.1.29 Instrução DROP TABLE") e [`SELECT`](select.html "13.2.9 Instrução SELECT"), respectivamente. A instrução a seguir exibe os nomes possíveis:

  ```sql
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

* `<CONNECTION_ID>`

  Um inteiro não assinado que representa o identificador de conexão do cliente. Este é o mesmo valor retornado pela função [`CONNECTION_ID()`](information-functions.html#function_connection-id) dentro da session.

  Exemplo:

  ```sql
  <CONNECTION_ID>127</CONNECTION_ID>
  ```

* `<CONNECTION_TYPE>`

  O estado de segurança da conexão com o servidor. Os valores permitidos são `TCP/IP` (conexão TCP/IP estabelecida sem encryption), `SSL/TLS` (conexão TCP/IP estabelecida com encryption), `Socket` (conexão de arquivo socket Unix), `Named Pipe` (conexão de pipe nomeado do Windows) e `Shared Memory` (conexão de memória compartilhada do Windows).

  Exemplo:

  ```sql
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
  ```

* `<DB>`

  Uma string que representa um nome de Database.

  Exemplo:

  ```sql
  <DB>test</DB>
  ```

  Para eventos de conexão, este elemento indica o default database; o elemento é vazio se não houver um default database. Para eventos de acesso a table, o elemento indica o Database ao qual a table acessada pertence.

* `<HOST>`

  Uma string que representa o host name do cliente.

  Exemplo:

  ```sql
  <HOST>localhost</HOST>
  ```

* `<IP>`

  Uma string que representa o endereço IP do cliente.

  Exemplo:

  ```sql
  <IP>127.0.0.1</IP>
  ```

* `<MYSQL_VERSION>`

  Uma string que representa a versão do MySQL server. Este é o mesmo que o valor da função [`VERSION()`](information-functions.html#function_version) ou da variável de sistema [`version`](server-system-variables.html#sysvar_version).

  Exemplo:

  ```sql
  <MYSQL_VERSION>5.7.21-log</MYSQL_VERSION>
  ```

* `<OS_LOGIN>`

  Uma string que representa o user name externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com a autenticação MySQL nativa (embutida), ou se o plugin não definir o valor, este elemento estará vazio. O valor é o mesmo que o da variável de sistema [`external_user`](server-system-variables.html#sysvar_external_user) (consulte [Seção 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users")).

  Exemplo:

  ```sql
  <OS_LOGIN>jeffrey</OS_LOGIN>
  ```

* `<OS_VERSION>`

  Uma string que representa o operating system no qual o servidor foi construído ou está sendo executado.

  Exemplo:

  ```sql
  <OS_VERSION>x86_64-Linux</OS_VERSION>
  ```

* `<PRIV_USER>`

  Uma string que representa o user que o servidor autenticou como cliente. Este é o user name que o servidor usa para privilege checking, e pode ser diferente do valor de `<USER>`.

  Exemplo:

  ```sql
  <PRIV_USER>jeffrey</PRIV_USER>
  ```

* `<PROXY_USER>`

  Uma string que representa o proxy user (consulte [Seção 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users")). O valor é vazio se o user proxying não estiver em vigor.

  Exemplo:

  ```sql
  <PROXY_USER>developer</PROXY_USER>
  ```

* `<SERVER_ID>`

  Um inteiro não assinado que representa o Server ID. Este é o mesmo que o valor da variável de sistema [`server_id`](replication-options.html#sysvar_server_id).

  Exemplo:

  ```sql
  <SERVER_ID>1</SERVER_ID>
  ```

* `<SQLTEXT>`

  Uma string que representa o texto de uma instrução SQL. O valor pode ser vazio. Valores longos podem ser truncados. A string, assim como o próprio arquivo de audit log, é gravada usando UTF-8 (até 4 bytes por caractere), portanto, o valor pode ser resultado de conversão. Por exemplo, a instrução original pode ter sido recebida do cliente como uma string SJIS.

  Exemplo:

  ```sql
  <SQLTEXT>DELETE FROM t1</SQLTEXT>
  ```

* `<STARTUP_OPTIONS>`

  Uma string que representa as opções fornecidas na linha de comando ou em option files quando o MySQL server foi iniciado. A primeira opção é o path para o executável do servidor.

  Exemplo:

  ```sql
  <STARTUP_OPTIONS>/usr/local/mysql/bin/mysqld
    --port=3306 --log_output=FILE</STARTUP_OPTIONS>
  ```

* `<STATUS>`

  Um inteiro não assinado que representa o status do comando: 0 para sucesso, diferente de zero se ocorreu um error. Este é o mesmo valor da função C API [`mysql_errno()`](/doc/c-api/5.7/en/mysql-errno.html). Consulte a descrição de `<STATUS_CODE>` para obter informações sobre como ele difere de `<STATUS>`.

  O audit log não contém o valor SQLSTATE ou a mensagem de error. Para ver as associações entre error codes, valores SQLSTATE e mensagens, consulte [Referência de Mensagens de Erro do Servidor](/doc/mysql-errors/5.7/en/server-error-reference.html).

  Warnings não são registrados.

  Exemplo:

  ```sql
  <STATUS>1051</STATUS>
  ```

* `<STATUS_CODE>`

  Um inteiro não assinado que representa o status do comando: 0 para sucesso, 1 se ocorreu um error.

  O valor `STATUS_CODE` difere do valor `STATUS`: `STATUS_CODE` é 0 para sucesso e 1 para error, o que é compatível com o consumidor EZ_collector para Audit Vault. `STATUS` é o valor da função C API [`mysql_errno()`](/doc/c-api/5.7/en/mysql-errno.html). Este é 0 para sucesso e diferente de zero para error, portanto, não é necessariamente 1 para error.

  Exemplo:

  ```sql
  <STATUS_CODE>0</STATUS_CODE>
  ```

* `<TABLE>`

  Uma string que representa um nome de table.

  Exemplo:

  ```sql
  <TABLE>t3</TABLE>
  ```

* `<USER>`

  Uma string que representa o user name enviado pelo cliente. Este pode ser diferente do valor de `<PRIV_USER>`.

  Exemplo:

  ```sql
  <USER>root[root] @ localhost [127.0.0.1]</USER>
  ```

* `<VERSION>`

  Um inteiro não assinado que representa a versão do formato do arquivo de audit log.

  Exemplo:

  ```sql
  <VERSION>1</VERSION>
  ```

##### Formato de Arquivo de Log de Auditoria XML de Estilo Antigo

Aqui está um exemplo de arquivo de log no formato XML de estilo antigo ([`audit_log_format=OLD`](audit-log-reference.html#sysvar_audit_log_format)), ligeiramente reformatado para melhor legibilidade:

```sql
<?xml version="1.0" encoding="utf-8"?>
<AUDIT>
  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:00 UTC"
    RECORD_ID="1_2019-10-03T14:25:00"
    NAME="Audit"
    SERVER_ID="1"
    VERSION="1"
    STARTUP_OPTIONS="--port=3306"
    OS_VERSION="i686-Linux"
    MYSQL_VERSION="5.7.21-log"/>
  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:24 UTC"
    RECORD_ID="2_2019-10-03T14:25:00"
    NAME="Connect"
    CONNECTION_ID="4"
    STATUS="0"
    STATUS_CODE="0"
    USER="root"
    OS_LOGIN=""
    HOST="localhost"
    IP="127.0.0.1"
    COMMAND_CLASS="connect"
    CONNECTION_TYPE="SSL/TLS"
    PRIV_USER="root"
    PROXY_USER=""
    DB="test"/>

...

  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:24 UTC"
    RECORD_ID="6_2019-10-03T14:25:00"
    NAME="Query"
    CONNECTION_ID="4"
    STATUS="0"
    STATUS_CODE="0"
    USER="root[root] @ localhost [127.0.0.1]"
    OS_LOGIN=""
    HOST="localhost"
    IP="127.0.0.1"
    COMMAND_CLASS="drop_table"
    SQLTEXT="DROP TABLE IF EXISTS t"/>

...

  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:24 UTC"
    RECORD_ID="8_2019-10-03T14:25:00"
    NAME="Quit"
    CONNECTION_ID="4"
    STATUS="0"
    STATUS_CODE="0"
    USER="root"
    OS_LOGIN=""
    HOST="localhost"
    IP="127.0.0.1"
    COMMAND_CLASS="connect"
    CONNECTION_TYPE="SSL/TLS"/>
  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:32 UTC"
    RECORD_ID="12_2019-10-03T14:25:00"
    NAME="NoAudit"
    SERVER_ID="1"/>
</AUDIT>
```

O arquivo de audit log é gravado como XML, usando UTF-8 (até 4 bytes por caractere). O elemento raiz é `<AUDIT>`. O elemento raiz contém elementos `<AUDIT_RECORD>`, cada um dos quais fornece informações sobre um evento auditado. Quando o audit log plugin começa a gravar um novo arquivo de log, ele grava a declaração XML e a tag de abertura do elemento raiz `<AUDIT>`. Quando o plugin fecha um arquivo de log, ele grava a tag de fechamento do elemento raiz `</AUDIT>`. A tag de fechamento não está presente enquanto o arquivo está aberto.

Os atributos dos elementos `<AUDIT_RECORD>` possuem estas características:

* Alguns atributos aparecem em cada elemento `<AUDIT_RECORD>`. Outros são opcionais e podem aparecer dependendo do tipo de registro de auditoria.

* A ordem dos atributos dentro de um elemento `<AUDIT_RECORD>` não é garantida.

* Os valores dos atributos não possuem comprimento fixo. Valores longos podem ser truncados conforme indicado nas descrições dos atributos fornecidas posteriormente.

* Os caracteres `<`, `>`, `"`, e `&` são codificados como `&lt;`, `&gt;`, `&quot;`, e `&amp;`, respectivamente. Bytes NUL (U+00) são codificados como o caractere `?`.

* Caracteres que não são válidos como caracteres XML são codificados usando referências numéricas de caracteres. Caracteres XML válidos são:

```sql
  #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
  ```

Os seguintes atributos são obrigatórios em todo elemento `<AUDIT_RECORD>`:

* `NAME`

  Uma string que representa o tipo de instrução que gerou o evento de auditoria, como um comando que o servidor recebeu de um cliente.

  Exemplo: `NAME="Query"`

  Alguns valores comuns de `NAME`:

  ```sql
  Audit    When auditing starts, which may be server startup time
  Connect  When a client connects, also known as logging in
  Query    An SQL statement (executed directly)
  Prepare  Preparation of an SQL statement; usually followed by Execute
  Execute  Execution of an SQL statement; usually follows Prepare
  Shutdown Server shutdown
  Quit     When a client disconnects
  NoAudit  Auditing has been turned off
  ```

  Os valores possíveis são `Audit`, `Binlog Dump`, `Change user`, `Close stmt`, `Connect Out`, `Connect`, `Create DB`, `Daemon`, `Debug`, `Delayed insert`, `Drop DB`, `Execute`, `Fetch`, `Field List`, `Init DB`, `Kill`, `Long Data`, `NoAudit`, `Ping`, `Prepare`, `Processlist`, `Query`, `Quit`, `Refresh`, `Register Slave`, `Reset stmt`, `Set option`, `Shutdown`, `Sleep`, `Statistics`, `Table Dump`, `TableDelete`, `TableInsert`, `TableRead`, `TableUpdate`, `Time`.

  Muitos desses valores correspondem aos valores de comando `COM_xxx` listados no arquivo header `my_command.h`. Por exemplo, `"Create DB"` e `"Change user"` correspondem a `COM_CREATE_DB` e `COM_CHANGE_USER`, respectivamente.

  Eventos com valores `NAME` de `TableXXX` acompanham eventos `Query`. Por exemplo, a seguinte instrução gera um evento `Query`, dois eventos `TableRead` e um evento `TableInsert`:

  ```sql
  INSERT INTO t3 SELECT t1.* FROM t1 JOIN t2;
  ```

  Cada evento `TableXXX` tem atributos `TABLE` e `DB` para identificar a table à qual o evento se refere e o Database que contém a table.

* `RECORD_ID`

  Um identificador exclusivo para o registro de auditoria. O valor é composto por um número de sequência e um timestamp, no formato `SEQ_TIMESTAMP`. Quando o audit log plugin abre o arquivo de log de auditoria, ele inicializa o número de sequência para o tamanho do arquivo de log de auditoria e, em seguida, incrementa a sequência em 1 para cada registro logado. O timestamp é um valor UTC no formato `YYYY-MM-DDThh:mm:ss` indicando a data e hora em que o audit log plugin abriu o arquivo.

  Exemplo: `RECORD_ID="12_2019-10-03T14:25:00"`

* `TIMESTAMP`

  Uma string que representa um valor UTC no formato `YYYY-MM-DDThh:mm:ss UTC` indicando a data e hora em que o evento de auditoria foi gerado. Por exemplo, o evento correspondente à execução de uma instrução SQL recebida de um cliente tem um valor `TIMESTAMP` que ocorre após a instrução ser concluída, e não quando foi recebida.

  Exemplo: `TIMESTAMP="2019-10-03T14:25:32 UTC"`

Os seguintes atributos são opcionais nos elementos `<AUDIT_RECORD>`. Muitos deles ocorrem apenas para elementos com valores específicos do atributo `NAME`.

* `COMMAND_CLASS`

  Uma string que indica o tipo de ação realizada.

  Exemplo: `COMMAND_CLASS="drop_table"`

  Os valores correspondem aos contadores de comando `statement/sql/xxx`. Por exemplo, *`xxx`* é `drop_table` e `select` para instruções [`DROP TABLE`](drop-table.html "13.1.29 Instrução DROP TABLE") e [`SELECT`](select.html "13.2.9 Instrução SELECT"), respectivamente. A instrução a seguir exibe os nomes possíveis:

  ```sql
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

* `CONNECTION_ID`

  Um inteiro não assinado que representa o identificador de conexão do cliente. Este é o mesmo valor retornado pela função [`CONNECTION_ID()`](information-functions.html#function_connection-id) dentro da session.

  Exemplo: `CONNECTION_ID="127"`

* `CONNECTION_TYPE`

  O estado de segurança da conexão com o servidor. Os valores permitidos são `TCP/IP` (conexão TCP/IP estabelecida sem encryption), `SSL/TLS` (conexão TCP/IP estabelecida com encryption), `Socket` (conexão de arquivo socket Unix), `Named Pipe` (conexão de pipe nomeado do Windows) e `Shared Memory` (conexão de memória compartilhada do Windows).

  Exemplo: `CONNECTION_TYPE="SSL/TLS"`

* `DB`

  Uma string que representa um nome de Database.

  Exemplo: `DB="test"`

  Para eventos de conexão, este atributo indica o default database; o atributo é vazio se não houver um default database. Para eventos de acesso a table, o atributo indica o Database ao qual a table acessada pertence.

* `HOST`

  Uma string que representa o host name do cliente.

  Exemplo: `HOST="localhost"`

* `IP`

  Uma string que representa o endereço IP do cliente.

  Exemplo: `IP="127.0.0.1"`

* `MYSQL_VERSION`

  Uma string que representa a versão do MySQL server. Este é o mesmo que o valor da função [`VERSION()`](information-functions.html#function_version) ou da variável de sistema [`version`](server-system-variables.html#sysvar_version).

  Exemplo: `MYSQL_VERSION="5.7.21-log"`

* `OS_LOGIN`

  Uma string que representa o user name externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com a autenticação MySQL nativa (embutida), ou se o plugin não definir o valor, este atributo estará vazio. O valor é o mesmo que o da variável de sistema [`external_user`](server-system-variables.html#sysvar_external_user) (consulte [Seção 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users")).

  Exemplo: `OS_LOGIN="jeffrey"`

* `OS_VERSION`

  Uma string que representa o operating system no qual o servidor foi construído ou está sendo executado.

  Exemplo: `OS_VERSION="x86_64-Linux"`

* `PRIV_USER`

  Uma string que representa o user que o servidor autenticou como cliente. Este é o user name que o servidor usa para privilege checking, e pode ser diferente do valor `USER`.

  Exemplo: `PRIV_USER="jeffrey"`

* `PROXY_USER`

  Uma string que representa o proxy user (consulte [Seção 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users")). O valor é vazio se o user proxying não estiver em vigor.

  Exemplo: `PROXY_USER="developer"`

* `SERVER_ID`

  Um inteiro não assinado que representa o Server ID. Este é o mesmo que o valor da variável de sistema [`server_id`](replication-options.html#sysvar_server_id).

  Exemplo: `SERVER_ID="1"`

* `SQLTEXT`

  Uma string que representa o texto de uma instrução SQL. O valor pode ser vazio. Valores longos podem ser truncados. A string, assim como o próprio arquivo de audit log, é gravada usando UTF-8 (até 4 bytes por caractere), portanto, o valor pode ser resultado de conversão. Por exemplo, a instrução original pode ter sido recebida do cliente como uma string SJIS.

  Exemplo: `SQLTEXT="DELETE FROM t1"`

* `STARTUP_OPTIONS`

  Uma string que representa as opções fornecidas na linha de comando ou em option files quando o MySQL server foi iniciado.

  Exemplo: `STARTUP_OPTIONS="--port=3306 --log_output=FILE"`

* `STATUS`

  Um inteiro não assinado que representa o status do comando: 0 para sucesso, diferente de zero se ocorreu um error. Este é o mesmo valor da função C API [`mysql_errno()`](/doc/c-api/5.7/en/mysql-errno.html). Consulte a descrição de `STATUS_CODE` para obter informações sobre como ele difere de `STATUS`.

  O audit log não contém o valor SQLSTATE ou a mensagem de error. Para ver as associações entre error codes, valores SQLSTATE e mensagens, consulte [Referência de Mensagens de Erro do Servidor](/doc/mysql-errors/5.7/en/server-error-reference.html).

  Warnings não são registrados.

  Exemplo: `STATUS="1051"`

* `STATUS_CODE`

  Um inteiro não assinado que representa o status do comando: 0 para sucesso, 1 se ocorreu um error.

  O valor `STATUS_CODE` difere do valor `STATUS`: `STATUS_CODE` é 0 para sucesso e 1 para error, o que é compatível com o consumidor EZ_collector para Audit Vault. `STATUS` é o valor da função C API [`mysql_errno()`](/doc/c-api/5.7/en/mysql-errno.html). Este é 0 para sucesso e diferente de zero para error, e, portanto, não é necessariamente 1 para error.

  Exemplo: `STATUS_CODE="0"`

* `TABLE`

  Uma string que representa um nome de table.

  Exemplo: `TABLE="t3"`

* `USER`

  Uma string que representa o user name enviado pelo cliente. Este pode ser diferente do valor `PRIV_USER`.

* `VERSION`

  Um inteiro não assinado que representa a versão do formato do arquivo de audit log.

  Exemplo: `VERSION="1"`

##### Formato de Arquivo de Log de Auditoria JSON

Para o registro de auditoria no formato JSON ([`audit_log_format=JSON`](audit-log-reference.html#sysvar_audit_log_format)), o conteúdo do arquivo de log forma um array [`JSON`](json.html "11.5 O Tipo de Dado JSON") onde cada elemento do array representa um evento auditado como um hash [`JSON`](json.html "11.5 O Tipo de Dado JSON") de pares chave-valor. Exemplos de registros de eventos completos aparecem mais adiante nesta seção. O seguinte é um excerto de eventos parciais:

```sql
[
  {
    "timestamp": "2019-10-03 13:50:01",
    "id": 0,
    "class": "audit",
    "event": "startup",
    ...
  },
  {
    "timestamp": "2019-10-03 15:02:32",
    "id": 0,
    "class": "connection",
    "event": "connect",
    ...
  },
  ...
  {
    "timestamp": "2019-10-03 17:37:26",
    "id": 0,
    "class": "table_access",
    "event": "insert",
      ...
  }
  ...
]
```

O arquivo de audit log é gravado usando UTF-8 (até 4 bytes por caractere). Quando o audit log plugin começa a gravar um novo arquivo de log, ele grava o marcador de abertura do array `[`. Quando o plugin fecha um arquivo de log, ele grava o marcador de fechamento do array `]`. O marcador de fechamento não está presente enquanto o arquivo está aberto.

Os itens dentro dos registros de auditoria possuem estas características:

* Alguns itens aparecem em todos os registros de auditoria. Outros são opcionais e podem aparecer dependendo do tipo de registro de auditoria.
* A ordem dos itens dentro de um registro de auditoria não é garantida.
* Os valores dos itens não possuem comprimento fixo. Valores longos podem ser truncados conforme indicado nas descrições dos itens fornecidas posteriormente.
* Os caracteres `"` e `\` são codificados como `\"` e `\\`, respectivamente.

Os exemplos a seguir mostram os formatos de objeto JSON para diferentes tipos de eventos (conforme indicados pelos itens `class` e `event`), ligeiramente reformatados para melhor legibilidade:

Evento de startup de auditoria:

```sql
{ "timestamp": "2019-10-03 14:21:56",
  "id": 0,
  "class": "audit",
  "event": "startup",
  "connection_id": 0,
  "startup_data": { "server_id": 1,
                    "os_version": "i686-Linux",
                    "mysql_version": "5.7.21-log",
                    "args": ["/usr/local/mysql/bin/mysqld",
                             "--loose-audit-log-format=JSON",
                             "--log-error=log.err",
                             "--pid-file=mysqld.pid",
                             "--port=3306" ] } }
```

Quando o audit log plugin é iniciado como resultado do startup do servidor (em oposição a ser habilitado em tempo de execução), `connection_id` é definido como 0, e `account` e `login` não estão presentes.

Evento de shutdown de auditoria:

```sql
{ "timestamp": "2019-10-03 14:28:20",
  "id": 3,
  "class": "audit",
  "event": "shutdown",
  "connection_id": 0,
  "shutdown_data": { "server_id": 1 } }
```

Quando o audit log plugin é desinstalado como resultado do shutdown do servidor (em oposição a ser desabilitado em tempo de execução), `connection_id` é definido como 0, e `account` e `login` não estão presentes.

Evento de conexão ou mudança de user (change-user):

```sql
{ "timestamp": "2019-10-03 14:23:18",
  "id": 1,
  "class": "connection",
  "event": "connect",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" },
  "connection_data": { "connection_type": "ssl",
                       "status": 0,
                       "db": "test" } }
```

Evento de desconexão:

```sql
{ "timestamp": "2019-10-03 14:24:45",
  "id": 3,
  "class": "connection",
  "event": "disconnect",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" },
  "connection_data": { "connection_type": "ssl" } }
```

Evento de Query:

```sql
{ "timestamp": "2019-10-03 14:23:35",
  "id": 2,
  "class": "general",
  "event": "status",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" },
  "general_data": { "command": "Query",
                    "sql_command": "show_variables",
                    "query": "SHOW VARIABLES",
                    "status": 0 } }
```

Evento de acesso a table (read, delete, insert, update):

```sql
{ "timestamp": "2019-10-03 14:23:41",
  "id": 0,
  "class": "table_access",
  "event": "insert",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "127.0.0.1", "proxy": "" },
  "table_access_data": { "db": "test",
                         "table": "t1",
                         "query": "INSERT INTO t1 (i) VALUES(1),(2),(3)",
                         "sql_command": "insert" } }
```

Os itens na lista a seguir aparecem no nível superior dos registros de auditoria no formato JSON: Cada valor de item é um escalar ou um hash [`JSON`](json.html "11.5 O Tipo de Dado JSON"). Para itens que possuem um valor hash, a descrição lista apenas os nomes dos itens dentro desse hash. Para descrições mais completas dos itens hash de segundo nível, consulte mais adiante nesta seção.

* `account`

  A conta MySQL associada ao evento. O valor é um hash contendo estes itens equivalentes ao valor da função [`CURRENT_USER()`](information-functions.html#function_current-user) dentro da seção: `user`, `host`.

  Exemplo:

  ```sql
  "account": { "user": "root", "host": "localhost" }
  ```

* `class`

  Uma string que representa a classe do evento. A classe define o tipo de evento, quando considerada em conjunto com o item `event` que especifica a subclasse do evento.

  Exemplo:

  ```sql
  "class": "connection"
  ```

  A tabela a seguir mostra as combinações permitidas de valores `class` e `event`.

  **Tabela 6.25 Combinações de Classe e Evento do Log de Auditoria**

  | Valor da Classe | Valores de Evento Permitidos |
  |---|---|
  | `audit` | `startup`, `shutdown` |
  | `connection` | `connect`, `change_user`, `disconnect` |
  | `general` | `status` |
  | `table_access_data` | `read`, `delete`, `insert`, `update` |

* `connection_data`

  Informações sobre uma conexão de cliente. O valor é um hash contendo estes itens: `connection_type`, `status`, `db`. Este item ocorre apenas para registros de auditoria com valor `class` de `connection`.

  Exemplo:

  ```sql
  "connection_data": { "connection_type": "ssl",
                       "status": 0,
                       "db": "test" }
  ```

* `connection_id`

  Um inteiro não assinado que representa o identificador de conexão do cliente. Este é o mesmo valor retornado pela função [`CONNECTION_ID()`](information-functions.html#function_connection-id) dentro da session.

  Exemplo:

  ```sql
  "connection_id": 5
  ```

* `event`

  Uma string que representa a subclasse da classe do evento. A subclasse define o tipo de evento, quando considerada em conjunto com o item `class` que especifica a classe do evento. Para mais informações, consulte a descrição do item `class`.

  Exemplo:

  ```sql
  "event": "connect"
  ```

* `general_data`

  Informações sobre uma instrução ou comando executado. O valor é um hash contendo estes itens: `command`, `sql_command`, `query`, `status`. Este item ocorre apenas para registros de auditoria com valor `class` de `general`.

  Exemplo:

  ```sql
  "general_data": { "command": "Query",
                    "sql_command": "show_variables",
                    "query": "SHOW VARIABLES",
                    "status": 0 }
  ```

* `id`

  Um inteiro não assinado que representa um ID de evento.

  Exemplo:

  ```sql
  "id": 2
  ```

  Para registros de auditoria que têm o mesmo valor `timestamp`, seus valores `id` os distinguem e formam uma sequência. Dentro do audit log, os pares `timestamp`/`id` são exclusivos. Estes pares são bookmarks que identificam localizações de eventos dentro do log.

* `login`

  Informações indicando como um cliente se conectou ao servidor. O valor é um hash contendo estes itens: `user`, `os`, `ip`, `proxy`.

  Exemplo:

  ```sql
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" }
  ```

* `shutdown_data`

  Informações relativas à terminação do audit log plugin. O valor é um hash contendo estes itens: `server_id`. Este item ocorre apenas para registros de auditoria com valores `class` e `event` de `audit` e `shutdown`, respectivamente.

  Exemplo:

  ```sql
  "shutdown_data": { "server_id": 1 }
  ```

* `startup_data`

  Informações relativas à inicialização do audit log plugin. O valor é um hash contendo estes itens: `server_id`, `os_version`, `mysql_version`, `args`. Este item ocorre apenas para registros de auditoria com valores `class` e `event` de `audit` e `startup`, respectivamente.

  Exemplo:

  ```sql
  "startup_data": { "server_id": 1,
                    "os_version": "i686-Linux",
                    "mysql_version": "5.7.21-log",
                    "args": ["/usr/local/mysql/bin/mysqld",
                             "--loose-audit-log-format=JSON",
                             "--log-error=log.err",
                             "--pid-file=mysqld.pid",
                             "--port=3306" ] }
  ```

* `table_access_data`

  Informações sobre um acesso a uma table. O valor é um hash contendo estes itens: `db`, `table`, `query`, `sql_command`. Este item ocorre apenas para registros de auditoria com valor `class` de `table_access`.

  Exemplo:

  ```sql
  "table_access_data": { "db": "test",
                         "table": "t1",
                         "query": "INSERT INTO t1 (i) VALUES(1),(2),(3)",
                         "sql_command": "insert" }
  ```

* `time`

  Este campo é semelhante ao campo `timestamp`, mas o valor é um inteiro e representa o valor UNIX timestamp indicando a data e hora em que o evento de auditoria foi gerado.

  Exemplo:

  ```sql
  "time" : 1618498687
  ```

  O campo `time` ocorre em arquivos de log no formato JSON apenas se a variável de sistema [`audit_log_format_unix_timestamp`](audit-log-reference.html#sysvar_audit_log_format_unix_timestamp) estiver habilitada.

* `timestamp`

  Uma string que representa um valor UTC no formato *`YYYY-MM-DD hh:mm:ss`* indicando a data e hora em que o evento de auditoria foi gerado. Por exemplo, o evento correspondente à execução de uma instrução SQL recebida de um cliente tem um valor `timestamp` que ocorre após a instrução ser concluída, e não quando foi recebida.

  Exemplo:

  ```sql
  "timestamp": "2019-10-03 13:50:01"
  ```

  Para registros de auditoria que têm o mesmo valor `timestamp`, seus valores `id` os distinguem e formam uma sequência. Dentro do audit log, os pares `timestamp`/`id` são exclusivos. Estes pares são bookmarks que identificam localizações de eventos dentro do log.

Estes itens aparecem dentro dos valores hash associados aos itens de nível superior dos registros de auditoria no formato JSON:

* `args`

  Um array de opções que foram fornecidas na linha de comando ou em option files quando o MySQL server foi iniciado. A primeira opção é o path para o executável do servidor.

  Exemplo:

  ```sql
  "args": ["/usr/local/mysql/bin/mysqld",
           "--loose-audit-log-format=JSON",
           "--log-error=log.err",
           "--pid-file=mysqld.pid",
           "--port=3306" ]
  ```

* `command`

  Uma string que representa o tipo de instrução que gerou o evento de auditoria, como um comando que o servidor recebeu de um cliente.

  Exemplo:

  ```sql
  "command": "Query"
  ```

* `connection_type`

  O estado de segurança da conexão com o servidor. Os valores permitidos são `tcp/ip` (conexão TCP/IP estabelecida sem encryption), `ssl` (conexão TCP/IP estabelecida com encryption), `socket` (conexão de arquivo socket Unix), `named_pipe` (conexão de pipe nomeado do Windows) e `shared_memory` (conexão de memória compartilhada do Windows).

  Exemplo:

  ```sql
  "connection_type": "tcp/tcp"
  ```

* `db`

  Uma string que representa um nome de Database. Para `connection_data`, é o default database. Para `table_access_data`, é o Database da table.

  Exemplo:

  ```sql
  "db": "test"
  ```

* `host`

  Uma string que representa o host name do cliente.

  Exemplo:

  ```sql
  "host": "localhost"
  ```

* `ip`

  Uma string que representa o endereço IP do cliente.

  Exemplo:

  ```sql
  "ip": "::1"
  ```

* `mysql_version`

  Uma string que representa a versão do MySQL server. Este é o mesmo que o valor da função [`VERSION()`](information-functions.html#function_version) ou da variável de sistema [`version`](server-system-variables.html#sysvar_version).

  Exemplo:

  ```sql
  "mysql_version": "5.7.21-log"
  ```

* `os`

  Uma string que representa o user name externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com a autenticação MySQL nativa (embutida), ou se o plugin não definir o valor, este atributo estará vazio. O valor é o mesmo que o da variável de sistema [`external_user`](server-system-variables.html#sysvar_external_user). Consulte [Seção 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

  Exemplo:

  ```sql
  "os": "jeffrey"
  ```

* `os_version`

  Uma string que representa o operating system no qual o servidor foi construído ou está sendo executado.

  Exemplo:

  ```sql
  "os_version": "i686-Linux"
  ```

* `proxy`

  Uma string que representa o proxy user (consulte [Seção 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users")). O valor é vazio se o user proxying não estiver em vigor.

  Exemplo:

  ```sql
  "proxy": "developer"
  ```

* `query`

  Uma string que representa o texto de uma instrução SQL. O valor pode ser vazio. Valores longos podem ser truncados. A string, assim como o próprio arquivo de audit log, é gravada usando UTF-8 (até 4 bytes por caractere), portanto, o valor pode ser resultado de conversão. Por exemplo, a instrução original pode ter sido recebida do cliente como uma string SJIS.

  Exemplo:

  ```sql
  "query": "DELETE FROM t1"
  ```

* `server_id`

  Um inteiro não assinado que representa o Server ID. Este é o mesmo que o valor da variável de sistema [`server_id`](replication-options.html#sysvar_server_id).

  Exemplo:

  ```sql
  "server_id": 1
  ```

* `sql_command`

  Uma string que indica o tipo de instrução SQL.

  Exemplo:

  ```sql
  "sql_command": "insert"
  ```

  Os valores correspondem aos contadores de comando `statement/sql/xxx`. Por exemplo, *`xxx`* é `drop_table` e `select` para instruções [`DROP TABLE`](drop-table.html "13.1.29 Instrução DROP TABLE") e [`SELECT`](select.html "13.2.9 Instrução SELECT"), respectivamente. A instrução a seguir exibe os nomes possíveis:

  ```sql
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

* `status`

  Um inteiro não assinado que representa o status do comando: 0 para sucesso, diferente de zero se ocorreu um error. Este é o mesmo valor da função C API [`mysql_errno()`](/doc/c-api/5.7/en/mysql-errno.html).

  O audit log não contém o valor SQLSTATE ou a mensagem de error. Para ver as associações entre error codes, valores SQLSTATE e mensagens, consulte [Referência de Mensagens de Erro do Servidor](/doc/mysql-errors/5.7/en/server-error-reference.html).

  Warnings não são registrados.

  Exemplo:

  ```sql
  "status": 1051
  ```

* `table`

  Uma string que representa um nome de table.

  Exemplo:

  ```sql
  "table": "t1"
  ```

* `user`

  Uma string que representa um user name. O significado difere dependendo do item dentro do qual `user` ocorre:

  + Dentro dos itens `account`, `user` é uma string que representa o user que o servidor autenticou como cliente. Este é o user name que o servidor usa para privilege checking.

  + Dentro dos itens `login`, `user` é uma string que representa o user name enviado pelo cliente.

  Exemplo:

  ```sql
  "user": "root"
  ```
