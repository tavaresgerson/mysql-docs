#### 6.4.5.4 Formatos de arquivo de registro de auditoria

O servidor MySQL chama o plugin de log de auditoria para escrever um registro de auditoria em seu arquivo de log sempre que um evento audível ocorrer. Normalmente, o primeiro registro de auditoria escrito após o início do plugin contém a descrição do servidor e as opções de inicialização. Os elementos que seguem esse registro representam eventos como conexões e desconexões de clientes, instruções SQL executadas, entre outros. Apenas as instruções de nível superior são registradas, não as instruções dentro de programas armazenados, como gatilhos ou procedimentos armazenados. O conteúdo dos arquivos referenciados por instruções como `LOAD DATA` não é registrado.

Para selecionar o formato de log que o plugin de log de auditoria usa para gravar seu arquivo de log, defina a variável de sistema `audit_log_format` na inicialização do servidor. Esses formatos estão disponíveis:

- Novo formato XML (`audit_log_format=NEW`): Um formato XML que tem melhor compatibilidade com o Oracle Audit Vault do que o formato XML antigo. O MySQL 5.7 usa o formato XML de estilo novo como padrão.

- Formato XML antigo (`audit_log_format=OLD`): O formato original do log de auditoria usado por padrão nas versões mais antigas do MySQL.

- Formato JSON (`audit_log_format=JSON`)

Por padrão, o conteúdo do arquivo de registro de auditoria é escrito no formato XML de novo estilo, sem compressão ou criptografia.

Nota

Para obter informações sobre os problemas a serem considerados ao alterar o formato do log, consulte Selecionando o formato do arquivo de log de auditoria.

As seções a seguir descrevem os formatos de registro de auditoria disponíveis:

- Novo formato de arquivo de registro de auditoria XML
- Formato de arquivo de registro de auditoria de XML de estilo antigo
- Formato de arquivo de registro de auditoria JSON

##### Novo formato de arquivo de registro de auditoria XML

Aqui está um arquivo de registro de exemplo no formato XML de novo estilo (`audit_log_format=NEW`), reformatado ligeiramente para melhor legibilidade:

```xml
<?xml version="1.0" encoding="utf-8"?><AUDIT><AUDIT_RECORD><TIMESTAMP>2019-10-03T14:06:33 UTC</TIMESTAMP><RECORD_ID>1_2019-10-03T14:06:33</RECORD_ID><NAME>Audit</NAME><SERVER_ID>1</SERVER_ID><VERSION>1</VERSION><STARTUP_OPTIONS>/usr/local/mysql/bin/mysqld
    --socket=/usr/local/mysql/mysql.sock
    --port=3306</STARTUP_OPTIONS><OS_VERSION>i686-Linux</OS_VERSION><MYSQL_VERSION>5.7.21-log</MYSQL_VERSION></AUDIT_RECORD><AUDIT_RECORD><TIMESTAMP>2019-10-03T14:09:38 UTC</TIMESTAMP><RECORD_ID>2_2019-10-03T14:06:33</RECORD_ID><NAME>Connect</NAME><CONNECTION_ID>5</CONNECTION_ID><STATUS>0</STATUS><STATUS_CODE>0</STATUS_CODE><USER>root</USER><OS_LOGIN/><HOST>localhost</HOST><IP>127.0.0.1</IP><COMMAND_CLASS>connect</COMMAND_CLASS><CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE><PRIV_USER>root</PRIV_USER><PROXY_USER/><DB>test</DB></AUDIT_RECORD>

...

 <AUDIT_RECORD><TIMESTAMP>2019-10-03T14:09:38 UTC</TIMESTAMP><RECORD_ID>6_2019-10-03T14:06:33</RECORD_ID><NAME>Query</NAME><CONNECTION_ID>5</CONNECTION_ID><STATUS>0</STATUS><STATUS_CODE>0</STATUS_CODE><USER>root[root] @ localhost [127.0.0.1]</USER><OS_LOGIN/><HOST>localhost</HOST><IP>127.0.0.1</IP><COMMAND_CLASS>drop_table</COMMAND_CLASS><SQLTEXT>DROP TABLE IF EXISTS t</SQLTEXT></AUDIT_RECORD>

...

 <AUDIT_RECORD><TIMESTAMP>2019-10-03T14:09:39 UTC</TIMESTAMP><RECORD_ID>8_2019-10-03T14:06:33</RECORD_ID><NAME>Quit</NAME><CONNECTION_ID>5</CONNECTION_ID><STATUS>0</STATUS><STATUS_CODE>0</STATUS_CODE><USER>root</USER><OS_LOGIN/><HOST>localhost</HOST><IP>127.0.0.1</IP><COMMAND_CLASS>connect</COMMAND_CLASS><CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE></AUDIT_RECORD>

...

 <AUDIT_RECORD><TIMESTAMP>2019-10-03T14:09:43 UTC</TIMESTAMP><RECORD_ID>11_2019-10-03T14:06:33</RECORD_ID><NAME>Quit</NAME><CONNECTION_ID>6</CONNECTION_ID><STATUS>0</STATUS><STATUS_CODE>0</STATUS_CODE><USER>root</USER><OS_LOGIN/><HOST>localhost</HOST><IP>127.0.0.1</IP><COMMAND_CLASS>connect</COMMAND_CLASS><CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE></AUDIT_RECORD><AUDIT_RECORD><TIMESTAMP>2019-10-03T14:09:45 UTC</TIMESTAMP><RECORD_ID>12_2019-10-03T14:06:33</RECORD_ID><NAME>NoAudit</NAME><SERVER_ID>1</SERVER_ID></AUDIT_RECORD></AUDIT>
```

O arquivo de registro de auditoria é escrito em formato XML, usando UTF-8 (até 4 bytes por caractere). O elemento raiz é `<AUDIT>`. O elemento raiz contém elementos `<AUDIT_RECORD>`, cada um dos quais fornece informações sobre um evento auditado. Quando o plugin de registro de auditoria começa a escrever um novo arquivo de log, ele escreve a declaração XML e a tag de abertura do elemento raiz `<AUDIT>`. Quando o plugin fecha um arquivo de log, ele escreve a tag de fechamento do elemento raiz `<AUDIT>`. A tag de fechamento não está presente enquanto o arquivo estiver aberto.

Os elementos dentro dos elementos `<AUDIT_RECORD>` têm essas características:

- Alguns elementos aparecem em todos os elementos `<AUDIT_RECORD>`. Outros são opcionais e podem aparecer dependendo do tipo de registro de auditoria.

- A ordem dos elementos dentro de um elemento `<AUDIT_RECORD>` não é garantida.

- Os valores dos elementos não têm comprimento fixo. Valores longos podem ser truncados conforme indicado nas descrições dos elementos fornecidas mais adiante.

- Os caracteres `<`, `>`, `"`, e `&` são codificados como `&lt;`, `&gt;`, `&quot;`, e `&amp;`, respectivamente. Os bytes NUL (U+00) são codificados como o caractere `?`.

- Caracteres não válidos como caracteres XML são codificados usando referências de caracteres numéricas. Caracteres XML válidos são:

  ```sql
  #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
  ```

Os seguintes elementos são obrigatórios em todo o elemento `<AUDIT_RECORD>`:

- `<NOME>`

  Uma cadeia que representa o tipo de instrução que gerou o evento de auditoria, como um comando que o servidor recebeu de um cliente.

  Exemplo:

  ```xml
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

  Os possíveis valores são `Audit`, `Binlog Dump`, `Change user`, `Close stmt`, `Connect Out`, `Connect`, `Create DB`, `Daemon`, `Debug`, `Delayed insert`, `Drop DB`, `Execute`, `Fetch`, `Field List`, `Init DB`, `Kill`, `Long Data`, `NoAudit`, `Ping`, `Prepare`, `Processlist`, `Query`, `Quit`, `Refresh`, `Register Slave`, `Reset stmt`, `Set option`, `Shutdown`, `Sleep`, `Statistics`, `Table Dump`, `TableDelete`, `TableInsert`, `TableRead`, `TableUpdate`, `Time`.

  Muitos desses valores correspondem aos valores do comando `COM_xxx` listados no arquivo de cabeçalho `my_command.h`. Por exemplo, `Create DB` e `Change user` correspondem a `COM_CREATE_DB` e `COM_CHANGE_USER`, respectivamente.

  Eventos com valores `<NOME>` de `TableXXX` acompanham eventos `Query`. Por exemplo, a seguinte declaração gera um evento `Query`, dois eventos `TableRead` e um evento `TableInsert`:

  ```sql
  INSERT INTO t3 SELECT t1.* FROM t1 JOIN t2;
  ```

  Cada evento `TableXXX` contém elementos `<TABLE>` e `<DB>` para identificar a tabela a qual o evento se refere e o banco de dados que contém a tabela.

- `<RECORD_ID>`

  Um identificador único para o registro de auditoria. O valor é composto por um número de sequência e um timestamp, no formato `SEQ_TIMESTAMP`. Quando o plugin de log de auditoria abre o arquivo de log de auditoria, ele inicializa o número de sequência para o tamanho do arquivo de log de auditoria, e depois incrementa o número de sequência em 1 para cada registro registrado. O timestamp é um valor UTC no formato `YYYY-MM-DDThh:mm:ss`, indicando a data e a hora em que o plugin de log de auditoria abriu o arquivo.

  Exemplo:

  ```sql
  <RECORD_ID>12_2019-10-03T14:06:33</RECORD_ID>
  ```

- `<TIMESTAMP>`

  Uma cadeia que representa um valor UTC no formato `YYYY-MM-DDThh:mm:ss UTC`, indicando a data e a hora em que o evento de auditoria foi gerado. Por exemplo, o evento correspondente à execução de uma instrução SQL recebida de um cliente tem um valor `<TIMESTAMP>` após a instrução terminar, e não quando ela foi recebida.

  Exemplo:

  ```sql
  <TIMESTAMP>2019-10-03T14:09:45 UTC</TIMESTAMP>
  ```

Os seguintes elementos são opcionais nos elementos `<AUDIT_RECORD>` Muitos deles ocorrem apenas com valores específicos dos elementos `<NAME>`.

- `<COMMAND_CLASS>`

  Uma cadeia que indica o tipo de ação realizada.

  Exemplo:

  ```sql
  <COMMAND_CLASS>drop_table</COMMAND_CLASS>
  ```

  Os valores correspondem aos contadores de comandos `statement/sql/xxx`. Por exemplo, *`xxx`* é `drop_table` e `select` para os comandos `DROP TABLE` e `SELECT`, respectivamente. A seguinte declaração exibe os nomes possíveis:

  ```sql
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

- `<CONNECTION_ID>`

  Um inteiro não assinado que representa o identificador de conexão do cliente. Isso é o mesmo valor retornado pela função `CONNECTION_ID()` dentro da sessão.

  Exemplo:

  ```sql
  <CONNECTION_ID>127</CONNECTION_ID>
  ```

- `<CONNECTION_TYPE>`

  O estado de segurança da conexão com o servidor. Os valores permitidos são `TCP/IP` (conexão TCP/IP estabelecida sem criptografia), `SSL/TLS` (conexão TCP/IP estabelecida com criptografia), `Socket` (conexão de arquivo de soquete Unix), `Named Pipe` (conexão de named pipe do Windows) e `Shared Memory` (conexão de memória compartilhada do Windows).

  Exemplo:

  ```sql
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
  ```

- `<DB>`

  Uma cadeia que representa o nome de um banco de dados.

  Exemplo:

  ```sql
  <DB>test</DB>
  ```

  Para eventos de conexão, este elemento indica o banco de dados padrão; o elemento está vazio se não houver um banco de dados padrão. Para eventos de acesso a tabelas, o elemento indica o banco de dados ao qual a tabela acessada pertence.

- `<HOST>`

  Uma cadeia que representa o nome do host do cliente.

  Exemplo:

  ```sql
  <HOST>localhost</HOST>
  ```

- `<IP>`

  Uma cadeia que representa o endereço IP do cliente.

  Exemplo:

  ```sql
  <IP>127.0.0.1</IP>
  ```

- `<MYSQL_VERSION>`

  Uma cadeia que representa a versão do servidor MySQL. Isso é o mesmo que o valor da função `VERSION()` ou da variável de sistema `version`.

  Exemplo:

  ```sql
  <MYSQL_VERSION>5.7.21-log</MYSQL_VERSION>
  ```

- `<OS_LOGIN>`

  Uma cadeia que representa o nome do usuário externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com a autenticação nativa (incorporada) do MySQL ou se o plugin não definir o valor, este elemento está vazio. O valor é o mesmo da variável de sistema `external_user` (consulte Seção 6.2.14, “Usuários Proxy”).

  Exemplo:

  ```sql
  <OS_LOGIN>jeffrey</OS_LOGIN>
  ```

- `<OS_VERSION>`

  Uma cadeia que representa o sistema operacional em que o servidor foi construído ou está sendo executado.

  Exemplo:

  ```sql
  <OS_VERSION>x86_64-Linux</OS_VERSION>
  ```

- `<PRIV_USER>`

  Uma cadeia que representa o usuário pelo qual o servidor autenticou o cliente. Esse é o nome do usuário que o servidor usa para verificar privilégios e pode diferir do valor `<USER>`.

  Exemplo:

  ```sql
  <PRIV_USER>jeffrey</PRIV_USER>
  ```

- `<PROXY_USER>`

  Uma cadeia que representa o usuário proxy (consulte Seção 6.2.14, “Usuários Proxy”). O valor está vazio se o proxy do usuário não estiver em vigor.

  Exemplo:

  ```sql
  <PROXY_USER>developer</PROXY_USER>
  ```

- `<SERVER_ID>`

  Um inteiro não assinado que representa o ID do servidor. Isso é o mesmo que o valor da variável de sistema `server_id`.

  Exemplo:

  ```sql
  <SERVER_ID>1</SERVER_ID>
  ```

- `<SQLTEXT>`

  Uma cadeia que representa o texto de uma instrução SQL. O valor pode ser vazio. Valores longos podem ser truncados. A cadeia, assim como o próprio arquivo de log de auditoria, é escrita usando UTF-8 (até 4 bytes por caractere), então o valor pode ser o resultado de uma conversão. Por exemplo, a instrução original pode ter sido recebida do cliente como uma cadeia SJIS.

  Exemplo:

  ```sql
  <SQLTEXT>DELETE FROM t1</SQLTEXT>
  ```

- `<STARTUP_OPTIONS>`

  Uma cadeia que representa as opções fornecidas na linha de comando ou em arquivos de opção quando o servidor MySQL foi iniciado. A primeira opção é o caminho para o executável do servidor.

  Exemplo:

  ```sql
  <STARTUP_OPTIONS>/usr/local/mysql/bin/mysqld
    --port=3306 --log_output=FILE</STARTUP_OPTIONS>
  ```

- `<STATUS>`

  Um inteiro não assinado que representa o status do comando: 0 para sucesso, um número não nulo se um erro ocorrer. Isso é o mesmo que o valor da função C API `mysql_errno()`. Consulte a descrição de `<STATUS_CODE>` para obter informações sobre como ele difere de `<STATUS>`.

  O registro de auditoria não contém o valor SQLSTATE ou a mensagem de erro. Para ver as associações entre códigos de erro, valores SQLSTATE e mensagens, consulte Referência de Mensagens de Erro do Servidor.

  As advertências não são registradas.

  Exemplo:

  ```sql
  <STATUS>1051</STATUS>
  ```

- `<STATUS_CODE>`

  Um número inteiro não assinado que representa o status do comando: 0 para sucesso, 1 se ocorrer um erro.

  O valor `STATUS_CODE` difere do valor `STATUS`: `STATUS_CODE` é 0 para sucesso e 1 para erro, o que é compatível com o consumidor EZ_collector para o Audit Vault. `STATUS` é o valor da função C API `mysql_errno()`. Este valor é 0 para sucesso e não nulo para erro, e, portanto, não é necessariamente 1 para erro.

  Exemplo:

  ```sql
  <STATUS_CODE>0</STATUS_CODE>
  ```

- `<TABLE>`

  Uma cadeia que representa o nome de uma tabela.

  Exemplo:

  ```sql
  <TABLE>t3</TABLE>
  ```

- `<USER>`

  Uma cadeia que representa o nome do usuário enviado pelo cliente. Isso pode diferir do valor `<PRIV_USER>`.

  Exemplo:

  ```sql
  <USER>root[root] @ localhost [127.0.0.1]</USER>
  ```

- `<VERSION>`

  Um número inteiro não assinado que representa a versão do formato do arquivo de log de auditoria.

  Exemplo:

  ```sql
  <VERSION>1</VERSION>
  ```

##### Formato de arquivo de registro de auditoria XML de estilo antigo

Aqui está um arquivo de registro de exemplo no formato XML antigo (`audit_log_format=OLD`), reformatado levemente para melhor legibilidade:

```xml
<?xml version="1.0" encoding="utf-8"?><AUDIT><AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:00 UTC"
    RECORD_ID="1_2019-10-03T14:25:00"
    NAME="Audit"
    SERVER_ID="1"
    VERSION="1"
    STARTUP_OPTIONS="--port=3306"
    OS_VERSION="i686-Linux"
    MYSQL_VERSION="5.7.21-log"/><AUDIT_RECORD
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
    CONNECTION_TYPE="SSL/TLS"/><AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:32 UTC"
    RECORD_ID="12_2019-10-03T14:25:00"
    NAME="NoAudit"
    SERVER_ID="1"/></AUDIT>
```

O arquivo de registro de auditoria é escrito em formato XML, usando UTF-8 (até 4 bytes por caractere). O elemento raiz é `<AUDIT>`. O elemento raiz contém elementos `<AUDIT_RECORD>`, cada um dos quais fornece informações sobre um evento auditado. Quando o plugin de registro de auditoria começa a escrever um novo arquivo de log, ele escreve a declaração XML e a tag de abertura do elemento raiz `<AUDIT>`. Quando o plugin fecha um arquivo de log, ele escreve a tag de fechamento do elemento raiz `<AUDIT>`. A tag de fechamento não está presente enquanto o arquivo estiver aberto.

Os atributos dos elementos `<AUDIT_RECORD>` têm essas características:

- Alguns atributos aparecem em todos os elementos `<AUDIT_RECORD>`. Outros são opcionais e podem aparecer dependendo do tipo de registro de auditoria.

- A ordem dos atributos dentro de um elemento `<AUDIT_RECORD>` não é garantida.

- Os valores de atributo não têm comprimento fixo. Valores longos podem ser truncados conforme indicado nas descrições de atributo fornecidas mais adiante.

- Os caracteres `<`, `>`, `"`, e `&` são codificados como `&lt;`, `&gt;`, `&quot;`, e `&amp;`, respectivamente. Os bytes NUL (U+00) são codificados como o caractere `?`.

- Caracteres não válidos como caracteres XML são codificados usando referências de caracteres numéricas. Caracteres XML válidos são:

  ```sql
  #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
  ```

Os seguintes atributos são obrigatórios em todo o elemento `<AUDIT_RECORD>`:

- `NAME`

  Uma cadeia que representa o tipo de instrução que gerou o evento de auditoria, como um comando que o servidor recebeu de um cliente.

  Exemplo: `NAME="Query"`

  Alguns valores comuns de `NAME`:

  ```
  Audit    When auditing starts, which may be server startup time
  Connect  When a client connects, also known as logging in
  Query    An SQL statement (executed directly)
  Prepare  Preparation of an SQL statement; usually followed by Execute
  Execute  Execution of an SQL statement; usually follows Prepare
  Shutdown Server shutdown
  Quit     When a client disconnects
  NoAudit  Auditing has been turned off
  ```

  Os possíveis valores são `Audit`, `Binlog Dump`, `Change user`, `Close stmt`, `Connect Out`, `Connect`, `Create DB`, `Daemon`, `Debug`, `Delayed insert`, `Drop DB`, `Execute`, `Fetch`, `Field List`, `Init DB`, `Kill`, `Long Data`, `NoAudit`, `Ping`, `Prepare`, `Processlist`, `Query`, `Quit`, `Refresh`, `Register Slave`, `Reset stmt`, `Set option`, `Shutdown`, `Sleep`, `Statistics`, `Table Dump`, `TableDelete`, `TableInsert`, `TableRead`, `TableUpdate`, `Time`.

  Muitos desses valores correspondem aos valores do comando `COM_xxx` listados no arquivo de cabeçalho `my_command.h`. Por exemplo, `"Create DB"` e `"Change user"` correspondem a `COM_CREATE_DB` e `COM_CHANGE_USER`, respectivamente.

  Eventos com valores de `NOME` de `TableXXX` acompanham eventos `Query`. Por exemplo, a seguinte declaração gera um evento `Query`, dois eventos `TableRead` e um evento `TableInsert`:

  ```sql
  INSERT INTO t3 SELECT t1.* FROM t1 JOIN t2;
  ```

  Cada evento `TableXXX` tem os atributos `TABLE` e `DB` para identificar a tabela a qual o evento se refere e o banco de dados que contém a tabela.

- `RECORD_ID`

  Um identificador único para o registro de auditoria. O valor é composto por um número de sequência e um timestamp, no formato `SEQ_TIMESTAMP`. Quando o plugin de log de auditoria abre o arquivo de log de auditoria, ele inicializa o número de sequência para o tamanho do arquivo de log de auditoria, e depois incrementa o número de sequência em 1 para cada registro registrado. O timestamp é um valor UTC no formato `YYYY-MM-DDThh:mm:ss`, indicando a data e a hora em que o plugin de log de auditoria abriu o arquivo.

  Exemplo: `RECORD_ID="12_2019-10-03T14:25:00"`

- `TIMESTAMP`

  Uma cadeia que representa um valor UTC no formato `YYYY-MM-DDThh:mm:ss UTC`, indicando a data e a hora em que o evento de auditoria foi gerado. Por exemplo, o evento correspondente à execução de uma instrução SQL recebida de um cliente tem um valor `TIMESTAMP` que ocorre após a execução da instrução, e não quando ela foi recebida.

  Exemplo: `TIMESTAMP="2019-10-03T14:25:32 UTC"`

Os seguintes atributos são opcionais nos elementos `<AUDIT_RECORD>` Muitos deles ocorrem apenas para elementos com valores específicos do atributo `NAME`.

- `COMMAND_CLASS`

  Uma cadeia que indica o tipo de ação realizada.

  Exemplo: `COMMAND_CLASS="drop_table"`

  Os valores correspondem aos contadores de comandos `statement/sql/xxx`. Por exemplo, *`xxx`* é `drop_table` e `select` para os comandos `DROP TABLE` e `SELECT`, respectivamente. A seguinte declaração exibe os nomes possíveis:

  ```sql
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

- `CONNECTION_ID`

  Um inteiro não assinado que representa o identificador de conexão do cliente. Isso é o mesmo valor retornado pela função `CONNECTION_ID()` dentro da sessão.

  Exemplo: `CONNECTION_ID="127"`

- `CONNECTION_TYPE`

  O estado de segurança da conexão com o servidor. Os valores permitidos são `TCP/IP` (conexão TCP/IP estabelecida sem criptografia), `SSL/TLS` (conexão TCP/IP estabelecida com criptografia), `Socket` (conexão de arquivo de soquete Unix), `Named Pipe` (conexão de named pipe do Windows) e `Shared Memory` (conexão de memória compartilhada do Windows).

  Exemplo: `CONNECTION_TYPE="SSL/TLS"`

- `DB`

  Uma cadeia que representa o nome de um banco de dados.

  Exemplo: `DB="test"`

  Para eventos de conexão, este atributo indica o banco de dados padrão; o atributo está vazio se não houver um banco de dados padrão. Para eventos de acesso a tabelas, o atributo indica o banco de dados ao qual a tabela acessada pertence.

- `HOST`

  Uma cadeia que representa o nome do host do cliente.

  Exemplo: `HOST="localhost"`

- `IP`

  Uma cadeia que representa o endereço IP do cliente.

  Exemplo: `IP="127.0.0.1"`

- `MYSQL_VERSION`

  Uma cadeia que representa a versão do servidor MySQL. Isso é o mesmo que o valor da função `VERSION()` ou da variável de sistema `version`.

  Exemplo: `MYSQL_VERSION="5.7.21-log"`

- `OS_LOGIN`

  Uma cadeia que representa o nome do usuário externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com a autenticação nativa (incorporada) do MySQL ou se o plugin não definir o valor, este atributo está vazio. O valor é o mesmo da variável de sistema `external_user` (veja Seção 6.2.14, “Usuários Proxy”).

  Exemplo: `OS_LOGIN="jeffrey"`

- `OS_VERSION`

  Uma cadeia que representa o sistema operacional em que o servidor foi construído ou está sendo executado.

  Exemplo: `OS_VERSION="x86_64-Linux"`

- `PRIV_USER`

  Uma cadeia que representa o usuário pelo qual o servidor autenticou o cliente. Esse é o nome do usuário que o servidor usa para verificar privilégios, e pode diferir do valor `USER`.

  Exemplo: `PRIV_USER="jeffrey"`

- `PROXY_USER`

  Uma cadeia que representa o usuário proxy (consulte Seção 6.2.14, “Usuários Proxy”). O valor está vazio se o proxy do usuário não estiver em vigor.

  Exemplo: `PROXY_USER="desenvolvedor"`

- `SERVER_ID`

  Um inteiro não assinado que representa o ID do servidor. Isso é o mesmo que o valor da variável de sistema `server_id`.

  Exemplo: `SERVER_ID="1"`

- `SQLTEXT`

  Uma cadeia que representa o texto de uma instrução SQL. O valor pode ser vazio. Valores longos podem ser truncados. A cadeia, assim como o próprio arquivo de log de auditoria, é escrita usando UTF-8 (até 4 bytes por caractere), então o valor pode ser o resultado de uma conversão. Por exemplo, a instrução original pode ter sido recebida do cliente como uma cadeia SJIS.

  Exemplo: `SQLTEXT="DELETE FROM t1"`

- `STARTUP_OPTIONS`

  Uma cadeia que representa as opções fornecidas na linha de comando ou em arquivos de opção quando o servidor MySQL foi iniciado.

  Exemplo: `STARTUP_OPTIONS="--port=3306 --log_output=FILE"`

- `STATUS`

  Um inteiro não assinado que representa o status do comando: 0 para sucesso, um número não nulo se um erro ocorrer. Isso é o mesmo que o valor da função C API `mysql_errno()`. Veja a descrição de `STATUS_CODE` para obter informações sobre como ele difere de `STATUS`.

  O registro de auditoria não contém o valor SQLSTATE ou a mensagem de erro. Para ver as associações entre códigos de erro, valores SQLSTATE e mensagens, consulte Referência de Mensagens de Erro do Servidor.

  As advertências não são registradas.

  Exemplo: `STATUS="1051"`

- `STATUS_CODE`

  Um número inteiro não assinado que representa o status do comando: 0 para sucesso, 1 se ocorrer um erro.

  O valor `STATUS_CODE` difere do valor `STATUS`: `STATUS_CODE` é 0 para sucesso e 1 para erro, o que é compatível com o consumidor EZ_collector para o Audit Vault. `STATUS` é o valor da função C API `mysql_errno()`. Este valor é 0 para sucesso e não nulo para erro, e, portanto, não é necessariamente 1 para erro.

  Exemplo: `STATUS_CODE="0"`

- `TABLE`

  Uma cadeia que representa o nome de uma tabela.

  Exemplo: `TABLE="t3"`

- `USER`

  Uma cadeia que representa o nome do usuário enviado pelo cliente. Isso pode diferir do valor `PRIV_USER`.

- `VERSION`

  Um número inteiro não assinado que representa a versão do formato do arquivo de log de auditoria.

  Exemplo: `VERSION="1"`

##### Formato de arquivo de registro de auditoria JSON

Para o registro de auditoria no formato JSON (`audit_log_format=JSON`), o conteúdo do arquivo de log forma um array de JSON (`JSON`) com cada elemento do array representando um evento auditado como um hash de pares chave-valor em JSON (`JSON`). Exemplos de registros completos de eventos aparecem mais adiante nesta seção. O seguinte é um trecho de eventos parciais:

```json
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

O arquivo de registro de auditoria é escrito usando UTF-8 (até 4 bytes por caractere). Quando o plugin de registro de auditoria começa a escrever um novo arquivo de registro, ele escreve o marcador de matriz de abertura `[` . Quando o plugin fecha um arquivo de registro, ele escreve o marcador de matriz de fechamento `]` . O marcador de fechamento não está presente enquanto o arquivo estiver aberto.

Os itens nos registros de auditoria possuem essas características:

- Alguns itens aparecem em todos os registros de auditoria. Outros são opcionais e podem aparecer dependendo do tipo de registro de auditoria.

- A ordem dos itens dentro de um registro de auditoria não é garantida.

- Os valores dos itens não têm comprimento fixo. Valores longos podem ser truncados conforme indicado nas descrições dos itens fornecidas mais adiante.

- Os caracteres `"` e `\` são codificados como `\"` e `\\`, respectivamente.

Os exemplos a seguir mostram os formatos dos objetos JSON para diferentes tipos de eventos (indicados pelos itens `class` e `event`), reformatados levemente para melhor legibilidade:

Evento de lançamento de startup de auditoria:

```json
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

Quando o plugin de registro de auditoria é iniciado como resultado da inicialização do servidor (em vez de ser habilitado durante a execução), o `connection_id` é definido como 0 e `account` e `login` não estão presentes.

Evento de encerramento da auditoria:

```sql
{ "timestamp": "2019-10-03 14:28:20",
  "id": 3,
  "class": "audit",
  "event": "shutdown",
  "connection_id": 0,
  "shutdown_data": { "server_id": 1 } }
```

Quando o plugin do log de auditoria é desinstalado como resultado do desligamento do servidor (ao contrário de ser desabilitado durante a execução), o `connection_id` é definido como 0 e `account` e `login` não estão presentes.

Evento de conexão ou alteração de usuário:

```json
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

Desconexão de evento:

```json
{ "timestamp": "2019-10-03 14:24:45",
  "id": 3,
  "class": "connection",
  "event": "disconnect",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" },
  "connection_data": { "connection_type": "ssl" } }
```

Pergunta sobre o evento:

```json
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

Evento de acesso à tabela (leitura, exclusão, inserção, atualização):

```json
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

Os itens da lista a seguir aparecem no nível superior dos registros de auditoria no formato JSON: Cada valor do item é um escalar ou um hash de `JSON` (json.html). Para itens que têm um valor de hash, a descrição lista apenas os nomes dos itens dentro desse hash. Para descrições mais completas dos itens de hash de segundo nível, consulte mais adiante nesta seção.

- conta

  A conta MySQL associada ao evento. O valor é um hash contendo esses itens equivalentes ao valor da função `CURRENT_USER()` na seção: `user`, `host`.

  Exemplo:

  ```json
  "account": { "user": "root", "host": "localhost" }
  ```

- `classe`

  Uma cadeia que representa a classe do evento. A classe define o tipo de evento, quando combinada com o item `event` que especifica a subclasse do evento.

  Exemplo:

  ```json
  "class": "connection"
  ```

  A tabela a seguir mostra as combinações permitidas de valores de `class` e `event`.

  **Tabela 6.25 Combinações de Classe e Evento do Registro de Auditoria**

  <table summary="Combinações permitidas de classe de registro de auditoria e valores de evento."><thead><tr><th>Valor da classe</th><th>Valores de eventos permitidos</th></tr></thead><tbody><tr><td><code>audit</code></td><td><code>startup</code>, <code>shutdown</code></td></tr><tr><td><code>connection</code></td><td><code>connect</code>, <code>change_user</code>, <code>disconnect</code></td></tr><tr><td><code>general</code></td><td><code>status</code></td></tr><tr><td><code>table_access_data</code></td><td><code>read</code>, <code>delete</code>, <code>insert</code>, <code>update</code></td></tr></tbody></table>

- `connection_data`

  Informações sobre uma conexão de cliente. O valor é um hash contendo os seguintes itens: `connection_type`, `status`, `db`. Este item ocorre apenas para registros de auditoria com um valor de `class` de `connection`.

  Exemplo:

  ```sql
  "connection_data": { "connection_type": "ssl",
                       "status": 0,
                       "db": "test" }
  ```

- `connection_id`

  Um inteiro não assinado que representa o identificador de conexão do cliente. Isso é o mesmo valor retornado pela função `CONNECTION_ID()` dentro da sessão.

  Exemplo:

  ```sql
  "connection_id": 5
  ```

- `event`

  Uma cadeia que representa a subclasse da classe de evento. A subclasse define o tipo de evento, quando combinada com o item `class` que especifica a classe de evento. Para mais informações, consulte a descrição do item `class`.

  Exemplo:

  ```
  "event": "connect"
  ```

- `general_data`

  Informações sobre uma declaração ou comando executado. O valor é um hash contendo os seguintes itens: `command`, `sql_command`, `query`, `status`. Este item ocorre apenas para registros de auditoria com um valor de `class` de `general`.

  Exemplo:

  ```sql
  "general_data": { "command": "Query",
                    "sql_command": "show_variables",
                    "query": "SHOW VARIABLES",
                    "status": 0 }
  ```

- `id`

  Um número inteiro não assinado que representa um ID de evento.

  Exemplo:

  ```sql
  "id": 2
  ```

  Para registros de auditoria que têm o mesmo valor de `timestamp`, seus valores de `id` os distinguem e formam uma sequência. Dentro do log de auditoria, os pares `timestamp`/`id` são únicos. Esses pares são marcadores que identificam os locais dos eventos dentro do log.

- `login`

  Informações que indicam como um cliente se conectou ao servidor. O valor é um hash contendo os seguintes itens: `user`, `os`, `ip`, `proxy`.

  Exemplo:

  ```sql
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" }
  ```

- `shutdown_data`

  Informações sobre a finalização do plugin do log de auditoria. O valor é um hash contendo os seguintes itens: `server_id` Este item ocorre apenas para registros de auditoria com os valores `class` e `event` de `audit` e `shutdown`, respectivamente.

  Exemplo:

  ```sql
  "shutdown_data": { "server_id": 1 }
  ```

- `startup_data`

  Informações relacionadas à inicialização do plugin do log de auditoria. O valor é um hash contendo os seguintes itens: `server_id`, `os_version`, `mysql_version`, `args`. Este item ocorre apenas para registros de auditoria com os valores `class` e `event` de `audit` e `startup`, respectivamente.

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

- `table_access_data`

  Informações sobre o acesso a uma tabela. O valor é um hash contendo os seguintes itens: `db`, `table`, `query`, `sql_command`. Este item ocorre apenas para registros de auditoria com um valor de `class` de `table_access`.

  Exemplo:

  ```sql
  "table_access_data": { "db": "test",
                         "table": "t1",
                         "query": "INSERT INTO t1 (i) VALUES(1),(2),(3)",
                         "sql_command": "insert" }
  ```

- `time`

  Esse campo é semelhante ao do campo `timestamp`, mas o valor é um número inteiro e representa o valor do timestamp do UNIX que indica a data e a hora em que o evento de auditoria foi gerado.

  Exemplo:

  ```sql
  "time" : 1618498687
  ```

  O campo `time` ocorre em arquivos de log no formato JSON apenas se a variável de sistema `audit_log_format_unix_timestamp` estiver habilitada.

- `timestamp`

  Uma cadeia que representa um valor UTC no formato *`YYYY-MM-DD hh:mm:ss`* indicando a data e a hora em que o evento de auditoria foi gerado. Por exemplo, o evento correspondente à execução de uma instrução SQL recebida de um cliente tem um valor `timestamp` que ocorre após a execução da instrução, e não quando ela foi recebida.

  Exemplo:

  ```sql
  "timestamp": "2019-10-03 13:50:01"
  ```

  Para registros de auditoria que têm o mesmo valor de `timestamp`, seus valores de `id` os distinguem e formam uma sequência. Dentro do log de auditoria, os pares `timestamp`/`id` são únicos. Esses pares são marcadores que identificam os locais dos eventos dentro do log.

Esses itens aparecem dentro de valores hash associados a itens de nível superior de registros de auditoria no formato JSON:

- `args`

  Uma série de opções que foram fornecidas na linha de comando ou em arquivos de opção quando o servidor MySQL foi iniciado. A primeira opção é o caminho para o executável do servidor.

  Exemplo:

  ```sql
  "args": ["/usr/local/mysql/bin/mysqld",
           "--loose-audit-log-format=JSON",
           "--log-error=log.err",
           "--pid-file=mysqld.pid",
           "--port=3306" ]
  ```

- `command`

  Uma cadeia que representa o tipo de instrução que gerou o evento de auditoria, como um comando que o servidor recebeu de um cliente.

  Exemplo:

  ```sql
  "command": "Query"
  ```

- `connection_type`

  O estado de segurança da conexão com o servidor. Os valores permitidos são `tcp/ip` (conexão TCP/IP estabelecida sem criptografia), `ssl` (conexão TCP/IP estabelecida com criptografia), `socket` (conexão de arquivo de soquete Unix), `named_pipe` (conexão de named pipe do Windows) e `shared_memory` (conexão de memória compartilhada do Windows).

  Exemplo:

  ```sql
  "connection_type": "tcp/tcp"
  ```

- `db`

  Uma cadeia que representa o nome de um banco de dados. Para `connection_data`, é o banco de dados padrão. Para `table_access_data`, é o banco de dados da tabela.

  Exemplo:

  ```sql
  "db": "test"
  ```

- `host`

  Uma cadeia que representa o nome do host do cliente.

  Exemplo:

  ```sql
  "host": "localhost"
  ```

- `ip`

  Uma cadeia que representa o endereço IP do cliente.

  Exemplo:

  ```sql
  "ip": "::1"
  ```

- `mysql_version`

  Uma cadeia que representa a versão do servidor MySQL. Isso é o mesmo que o valor da função `VERSION()` ou da variável de sistema `version`.

  Exemplo:

  ```sql
  "mysql_version": "5.7.21-log"
  ```

- `os`

  Uma cadeia que representa o nome do usuário externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com a autenticação nativa (incorporada) do MySQL ou se o plugin não definir o valor, este atributo está vazio. O valor é o mesmo da variável de sistema `external_user`. Veja Seção 6.2.14, “Usuários Proxy”.

  Exemplo:

  ```sql
  "os": "jeffrey"
  ```

- `os_version`

  Uma cadeia que representa o sistema operacional em que o servidor foi construído ou está sendo executado.

  Exemplo:

  ```sql
  "os_version": "i686-Linux"
  ```

- `proxy`

  Uma cadeia que representa o usuário proxy (consulte Seção 6.2.14, “Usuários Proxy”). O valor está vazio se o proxy do usuário não estiver em vigor.

  Exemplo:

  ```sql
  "proxy": "developer"
  ```

- `query`

  Uma cadeia que representa o texto de uma instrução SQL. O valor pode ser vazio. Valores longos podem ser truncados. A cadeia, assim como o próprio arquivo de log de auditoria, é escrita usando UTF-8 (até 4 bytes por caractere), então o valor pode ser o resultado de uma conversão. Por exemplo, a instrução original pode ter sido recebida do cliente como uma cadeia SJIS.

  Exemplo:

  ```sql
  "query": "DELETE FROM t1"
  ```

- `server_id`

  Um inteiro não assinado que representa o ID do servidor. Isso é o mesmo que o valor da variável de sistema `server_id`.

  Exemplo:

  ```sql
  "server_id": 1
  ```

- `sql_command`

  Uma cadeia que indica o tipo de instrução SQL.

  Exemplo:

  ```sql
  "sql_command": "insert"
  ```

  Os valores correspondem aos contadores de comandos `statement/sql/xxx`. Por exemplo, *`xxx`* é `drop_table` e `select` para os comandos `DROP TABLE` e `SELECT`, respectivamente. A seguinte declaração exibe os nomes possíveis:

  ```sql
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

- `status`

  Um inteiro não assinado que representa o status do comando: 0 para sucesso, um número não nulo se ocorrer um erro. Isso é o mesmo que o valor da função C API `mysql_errno()`.

  O registro de auditoria não contém o valor SQLSTATE ou a mensagem de erro. Para ver as associações entre códigos de erro, valores SQLSTATE e mensagens, consulte Referência de Mensagens de Erro do Servidor.

  As advertências não são registradas.

  Exemplo:

  ```sql
  "status": 1051
  ```

- `table`

  Uma cadeia que representa o nome de uma tabela.

  Exemplo:

  ```sql
  "table": "t1"
  ```

- `user`

  Uma cadeia que representa um nome de usuário. O significado difere dependendo do item no qual `user` ocorre:

  - Nos itens `account`, `user` é uma string que representa o usuário pelo qual o servidor autenticou o cliente. Esse é o nome do usuário que o servidor usa para verificar privilégios.

  - Dentro dos itens `login`, `user` é uma string que representa o nome do usuário enviado pelo cliente.

  Exemplo:

  ```sql
  "user": "root"
  ```
