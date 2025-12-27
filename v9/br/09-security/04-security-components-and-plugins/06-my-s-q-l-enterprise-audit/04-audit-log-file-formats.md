#### 8.4.6.4 Formatos de Arquivo de Registro de Auditoria

O servidor MySQL chama o plugin de registro de auditoria para escrever um registro de auditoria em seu arquivo de log sempre que um evento audível ocorrer. Tipicamente, o primeiro registro de auditoria escrito após o início do plugin contém a descrição do servidor e as opções de inicialização. Os elementos que seguem esse primeiro representam eventos como conexões e desconexões de clientes, instruções SQL executadas, e assim por diante. Apenas as instruções de nível superior são registradas, não as instruções dentro de programas armazenados, como gatilhos ou procedimentos armazenados. O conteúdo dos arquivos referenciados por instruções como `LOAD DATA` não é registrado.

Para selecionar o formato de log que o plugin de registro de auditoria usa para escrever seu arquivo de log, defina a variável de sistema `audit_log_format` na inicialização do servidor. Esses formatos estão disponíveis:

* Formato XML de novo estilo (`audit_log_format=NEW`): Um formato XML que tem melhor compatibilidade com o Oracle Audit Vault do que o formato XML de estilo antigo. O MySQL 9.5 usa o formato XML de novo estilo por padrão.

* Formato XML de estilo antigo (`audit_log_format=OLD`): O formato de registro de auditoria original usado por padrão nas versões mais antigas do MySQL.

* Formato JSON (`audit_log_format=JSON`): Escreve o registro de auditoria como um array JSON. Apenas esse formato suporta as estatísticas opcionais de tempo de consulta e tamanho.

Por padrão, o conteúdo do arquivo de log de auditoria é escrito no formato XML de novo estilo, sem compressão ou criptografia.

Se você alterar `audit_log_format`, é recomendável que você também altere `audit_log_file`. Por exemplo, se você definir `audit_log_format` para `JSON`, defina `audit_log_file` para `audit.json`. Caso contrário, novos arquivos de log terão um formato diferente dos arquivos mais antigos, mas todos terão o mesmo nome de base sem nada que indique quando o formato foi alterado.

* Formato de Arquivo de Registro de Auditoria de Novo Estilo
* Formato de Arquivo de Registro de Auditoria de Estilo Antigo
* Formato de Arquivo de Registro de Auditoria JSON

##### Novo Formato de Arquivo de Registro de Auditoria XML

Aqui está um arquivo de registro de auditoria em formato XML de novo estilo (`audit_log_format=NEW`), reformatado levemente para melhor legibilidade:

```
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
  <CONNECTION_ATTRIBUTES>
   <ATTRIBUTE>
    <NAME>_pid</NAME>
    <VALUE>42794</VALUE>
   </ATTRIBUTE>
   ...
   <ATTRIBUTE>
    <NAME>program_name</NAME>
    <VALUE>mysqladmin</VALUE>
   </ATTRIBUTE>
  </CONNECTION_ATTRIBUTES>
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

O arquivo de registro de auditoria é escrito em XML, usando UTF-8 (até 4 bytes por caractere). O elemento raiz é `<AUDIT>`. O elemento raiz contém elementos `<AUDIT_RECORD>`, cada um dos quais fornece informações sobre um evento auditado. Quando o plugin de registro de auditoria começa a escrever um novo arquivo de registro, ele escreve a declaração XML e a tag de abertura do elemento raiz `<AUDIT>`. Quando o plugin fecha um arquivo de registro, ele escreve a tag de fechamento `</AUDIT>`. A tag de fechamento não está presente enquanto o arquivo estiver aberto.

Os elementos dentro dos elementos `<AUDIT_RECORD>` têm essas características:

* Alguns elementos aparecem em todos os elementos `<AUDIT_RECORD>`. Outros são opcionais e podem aparecer dependendo do tipo de registro de auditoria.

* A ordem dos elementos dentro de um elemento `<AUDIT_RECORD>` não é garantida.

* Os valores dos elementos não têm comprimento fixo. Valores longos podem ser truncados conforme indicado nas descrições dos elementos fornecidas mais adiante.

* Os caracteres `<`, `>`, `"`, e `&` são codificados como `&lt;`, `&gt;`, `&quot;`, e `&amp;`, respectivamente. Os bytes NUL (U+00) são codificados como o caractere `?`.

* Caracteres não válidos como caracteres XML são codificados usando referências de caracteres numéricas. Os caracteres XML válidos são:

  ```
  #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
  ```

Os seguintes elementos são obrigatórios em todos os elementos `<AUDIT_RECORD>`:

* `<NAME>`

  Uma string representando o tipo de instrução que gerou o evento de auditoria, como um comando que o servidor recebeu de um cliente.

  Exemplo:

  ```
  <NAME>Query</NAME>
  ```

  Alguns valores comuns de `<NAME>`:

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

Os possíveis valores são `Audit`, `Binlog Dump`, `Alterar usuário`, `Fechar stmt`, `Conectar Saída`, `Conectar`, `Criar DB`, `Daemon`, `Depuração`, `Inserção atrasada`, `Remover DB`, `Executar`, `Buscar`, `Lista de campos`, `Inicializar DB`, `Desligar`, `Dados longos`, `Sem auditoria`, `Ping`, `Preparar`, `Processlist`, `Consulta`, `Sair`, `Atualizar`, `Registrar escravo`, `Reiniciar stmt`, `Definir opção`, `Fechar`, `Dormir`, `Estatísticas`, `Dump de tabela`, `Excluir tabela`, `Inserir tabela`, `Ler tabela`, `Atualizar tabela`, `Tempo`.

Muitos desses valores correspondem aos valores dos comandos `COM_xxx` listados no arquivo de cabeçalho `my_command.h`. Por exemplo, `Criar DB` e `Alterar usuário` correspondem a `COM_CREATE_DB` e `COM_CHANGE_USER`, respectivamente.

Eventos com valores `<NAME>` de `TableXXX` acompanham eventos `Query`. Por exemplo, a seguinte declaração gera um evento `Query`, dois eventos `TableRead` e um evento `TableInsert`:

```
  INSERT INTO t3 SELECT t1.* FROM t1 JOIN t2;
  ```

Cada evento `TableXXX` contém elementos `<TABLE>` e `<DB>` para identificar a tabela a qual o evento se refere e o banco de dados que contém a tabela.

* `<RECORD_ID>`

Um identificador único para o registro de auditoria. O valor é composto por um número de sequência e um timestamp, no formato `SEQ_TIMESTAMP`. Quando o plugin de log de auditoria abre o arquivo de log de auditoria, ele inicializa o número de sequência para o tamanho do arquivo de log de auditoria, e depois incrementa o número de sequência em 1 para cada registro registrado. O timestamp é um valor UTC no formato `YYYY-MM-DDThh:mm:ss`, indicando a data e hora em que o plugin de log de auditoria abriu o arquivo.

Exemplo:

```
  <RECORD_ID>12_2019-10-03T14:06:33</RECORD_ID>
  ```

* `<TIMESTAMP>`

Uma cadeia que representa um valor UTC no formato `YYYY-MM-DDThh:mm:ss UTC`, indicando a data e a hora em que o evento de auditoria foi gerado. Por exemplo, o evento correspondente à execução de uma instrução SQL recebida de um cliente tem um valor `<TIMESTAMP>` ocorrendo após a conclusão da instrução, e não quando foi recebida.

Exemplo:

```
  <TIMESTAMP>2019-10-03T14:09:45 UTC</TIMESTAMP>
  ```

Os seguintes elementos são opcionais nos elementos `<AUDIT_RECORD>`. Muitos deles ocorrem apenas com valores específicos do elemento `<NAME>`.

* `<COMMAND_CLASS>`

  Uma cadeia que indica o tipo de ação realizada.

  Exemplo:

  ```
  <COMMAND_CLASS>drop_table</COMMAND_CLASS>
  ```

  Os valores correspondem aos contadores de comandos `statement/sql/xxx`. Por exemplo, *`xxx`* é `drop_table` e `select` para as instruções `DROP TABLE` e `SELECT`, respectivamente. A seguinte declaração exibe os nomes possíveis:

  ```
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

* `<CONNECTION_ATTRIBUTES>`

  Eventos com um valor `<COMMAND_CLASS>` de `connect` podem incluir um elemento `<CONNECTION_ATTRIBUTES>` para exibir os atributos de conexão passados pelo cliente no momento do `connect`. (Para informações sobre esses atributos, que também são exibidos nas tabelas do Schema de Desempenho, consulte a Seção 29.12.9, “Tabelas de Atributos de Conexão do Schema de Desempenho”.)

  O elemento `<CONNECTION_ATTRIBUTES>` contém um elemento `<ATTRIBUTE>` por atributo, cada um dos quais contém elementos `<NAME>` e `<VALUE>` para indicar o nome e o valor do atributo, respectivamente.

  Exemplo:

  ```
  <CONNECTION_ATTRIBUTES>
   <ATTRIBUTE>
    <NAME>_pid</NAME>
    <VALUE>42794</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>_os</NAME>
    <VALUE>macos0.14</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>_platform</NAME>
    <VALUE>x86_64</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>_client_version</NAME>
    <VALUE>8.4.0</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>_client_name</NAME>
    <VALUE>libmysql</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>program_name</NAME>
    <VALUE>mysqladmin</VALUE>
   </ATTRIBUTE>
  </CONNECTION_ATTRIBUTES>
  ```

  Se não houver atributos de conexão no evento, nenhum deles é registrado e nenhum elemento `<CONNECTION_ATTRIBUTES>` aparece. Isso pode ocorrer se a tentativa de conexão não for bem-sucedida, o cliente não passar nenhum atributo ou a conexão ocorrer internamente, como durante o inicialização do servidor ou quando iniciada por um plugin.

* `<CONNECTION_ID>`

Um inteiro não assinado que representa o identificador de conexão do cliente. Isso é o mesmo valor retornado pela função `CONNECTION_ID()` dentro da sessão.

Exemplo:

```
  <CONNECTION_ID>127</CONNECTION_ID>
  ```

* `<CONNECTION_TYPE>`

  O estado de segurança da conexão com o servidor. Os valores permitidos são `TCP/IP` (conexão TCP/IP estabelecida sem criptografia), `SSL/TLS` (conexão TCP/IP estabelecida com criptografia), `Socket` (conexão de arquivo socket Unix), `Named Pipe` (conexão de pipe nomeada do Windows) e `Shared Memory` (conexão de memória compartilhada do Windows).

  Exemplo:

  ```
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
  ```

* `<DB>`

  Uma string que representa o nome de um banco de dados.

  Exemplo:

  ```
  <DB>test</DB>
  ```

  Para eventos de conexão, este elemento indica o banco de dados padrão; o elemento está vazio se não houver um banco de dados padrão. Para eventos de acesso a tabelas, o elemento indica o banco de dados ao qual a tabela acessada pertence.

* `<HOST>`

  Uma string que representa o nome do host do cliente.

  Exemplo:

  ```
  <HOST>localhost</HOST>
  ```

* `<IP>`

  Uma string que representa o endereço IP do cliente.

  Exemplo:

  ```
  <IP>127.0.0.1</IP>
  ```

* `<MYSQL_VERSION>`

  Uma string que representa a versão do servidor MySQL. Isso é o mesmo valor da função `VERSION()` ou da variável de sistema `version`.

  Exemplo:

  ```
  <MYSQL_VERSION>5.7.21-log</MYSQL_VERSION>
  ```

* `<OS_LOGIN>`

  Uma string que representa o nome do usuário externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com autenticação MySQL nativa (incorporada) ou se o plugin não definir o valor, este elemento está vazio. O valor é o mesmo da variável de sistema `external_user` (veja Seção 8.2.19, “Usuários Proxy”).

  Exemplo:

  ```
  <OS_LOGIN>jeffrey</OS_LOGIN>
  ```

* `<OS_VERSION>`

  Uma string que representa o sistema operacional em que o servidor foi construído ou está sendo executado.

  Exemplo:

```
  <OS_VERSION>x86_64-Linux</OS_VERSION>
  ```
* `<PRIV_USER>`

  Uma string que representa o usuário pelo qual o servidor autenticou o cliente. Esse é o nome do usuário que o servidor usa para verificação de privilégios e pode diferir do valor de `<USER>`.

  Exemplo:

  ```
  <PRIV_USER>jeffrey</PRIV_USER>
  ```
* `<PROXY_USER>`

  Uma string que representa o usuário proxy (consulte a Seção 8.2.19, “Usuários Proxy”). O valor é vazio se o proxy estiver desativado.

  Exemplo:

  ```
  <PROXY_USER>developer</PROXY_USER>
  ```
* `<SERVER_ID>`

  Um inteiro não assinado que representa o ID do servidor. Esse é o mesmo valor da variável de sistema `server_id`.

  Exemplo:

  ```
  <SERVER_ID>1</SERVER_ID>
  ```
* `<SQLTEXT>`

  Uma string que representa o texto de uma instrução SQL. O valor pode ser vazio. Valores longos podem ser truncados. A string, assim como o próprio arquivo de log de auditoria, é escrita usando UTF-8 (até 4 bytes por caractere), então o valor pode ser o resultado de uma conversão. Por exemplo, a instrução original pode ter sido recebida do cliente como uma string SJIS.

  Exemplo:

  ```
  <SQLTEXT>DELETE FROM t1</SQLTEXT>
  ```
* `<STARTUP_OPTIONS>`

  Uma string que representa as opções fornecidas na linha de comando ou em arquivos de opção quando o servidor MySQL foi iniciado. A primeira opção é o caminho para o executável do servidor.

  Exemplo:

  ```
  <STARTUP_OPTIONS>/usr/local/mysql/bin/mysqld
    --port=3306 --log_output=FILE</STARTUP_OPTIONS>
  ```
* `<STATUS>`

  Um inteiro não assinado que representa o status do comando: 0 para sucesso, um número não nulo se ocorrer um erro. Esse é o mesmo valor da função C `mysql_errno()`. Consulte a descrição de `<STATUS_CODE>` para informações sobre como ele difere de `<STATUS>`.

  O log de auditoria não contém o valor SQLSTATE ou a mensagem de erro. Para ver as associações entre códigos de erro, valores SQLSTATE e mensagens, consulte a Referência de Mensagens de Erro do Servidor.

  As advertências não são registradas.

  Exemplo:

  ```
  <STATUS>1051</STATUS>
  ```
* `<STATUS_CODE>`

Um inteiro não assinado que representa o status do comando: 0 para sucesso, 1 se ocorrer um erro.

O valor `STATUS_CODE` difere do valor `STATUS`: `STATUS_CODE` é 0 para sucesso e 1 para erro, o que é compatível com o consumidor EZ_collector para o Audit Vault. `STATUS` é o valor da função C `mysql_errno()`. Isso é 0 para sucesso e não nulo para erro, e, portanto, não é necessariamente 1 para erro.

Exemplo:

```
  <STATUS_CODE>0</STATUS_CODE>
  ```

* `<TABLE>`

  Uma string que representa o nome da tabela.

  Exemplo:

  ```
  <TABLE>t3</TABLE>
  ```

* `<USER>`

  Uma string que representa o nome do usuário enviado pelo cliente. Isso pode diferir do valor `<PRIV_USER>`.

  Exemplo:

  ```
  <USER>root[root] @ localhost [127.0.0.1]</USER>
  ```

* `<VERSION>`

  Um inteiro não assinado que representa a versão do formato do arquivo de log de auditoria.

  Exemplo:

  ```
  <VERSION>1</VERSION>
  ```

##### Formato de Arquivo de Log de Auditoria de Estilo Antigo

Aqui está um arquivo de log de exemplo no formato de XML de estilo antigo (`audit_log_format=OLD`), reformatado ligeiramente para melhor legibilidade:

```
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

O arquivo de log de auditoria é escrito em XML, usando UTF-8 (até 4 bytes por caractere). O elemento raiz é `<AUDIT>`. O elemento raiz contém elementos `<AUDIT_RECORD>`, cada um dos quais fornece informações sobre um evento auditado. Quando o plugin de log de auditoria começa a escrever um novo arquivo de log, ele escreve a declaração XML e a tag de abertura do elemento raiz `<AUDIT>`. Quando o plugin fecha um arquivo de log, ele escreve a tag de fechamento do elemento raiz `<AUDIT>`. A tag de fechamento não está presente enquanto o arquivo está aberto.

Os atributos dos elementos `<AUDIT_RECORD>` têm essas características:

* Alguns atributos aparecem em todos os elementos `<AUDIT_RECORD>`. Outros são opcionais e podem aparecer dependendo do tipo de registro de auditoria.

* A ordem dos atributos dentro de um elemento `<AUDIT_RECORD>` não é garantida.

* Os valores dos atributos não têm comprimento fixo. Valores longos podem ser truncados conforme indicado nas descrições dos atributos fornecidas mais adiante.

* Os caracteres `<`, `>`, `"`, e `&` são codificados como `&lt;`, `&gt;`, `&quot;`, e `&amp;`, respectivamente. Os bytes NUL (U+00) são codificados como o caractere `?`.

* Caracteres não válidos como caracteres XML são codificados usando referências de caracteres numéricas. Caracteres XML válidos são:

  ```
  #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
  ```

Os seguintes atributos são obrigatórios em todo o elemento `<AUDIT_RECORD>`:

* `NAME`

  Uma string que representa o tipo de instrução que gerou o evento de auditoria, como um comando que o servidor recebeu de um cliente.

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

  Os valores possíveis são `Audit`, `Binlog Dump`, `Change user`, `Close stmt`, `Connect Out`, `Connect`, `Create DB`, `Daemon`, `Debug`, `Delayed insert`, `Drop DB`, `Execute`, `Fetch`, `Field List`, `Init DB`, `Kill`, `Long Data`, `NoAudit`, `Ping`, `Prepare`, `Processlist`, `Query`, `Quit`, `Refresh`, `Register Slave`, `Reset stmt`, `Set option`, `Shutdown`, `Sleep`, `Statistics`, `Table Dump`, `TableDelete`, `TableInsert`, `TableRead`, `TableUpdate`, `Time`.

  Muitos desses valores correspondem aos valores dos comandos `COM_xxx` listados no arquivo de cabeçalho `my_command.h`. Por exemplo, `"Create DB"` e `"Change user"` correspondem a `COM_CREATE_DB` e `COM_CHANGE_USER`, respectivamente.

  Eventos com valores de `NAME` de `TableXXX` acompanham eventos de `Query`. Por exemplo, a seguinte declaração gera um evento `Query`, dois eventos `TableRead` e um evento `TableInsert`:

  ```
  INSERT INTO t3 SELECT t1.* FROM t1 JOIN t2;
  ```

  Cada evento `TableXXX` tem atributos `TABLE` e `DB` para identificar a tabela a qual o evento se refere e o banco de dados que contém a tabela.

Os eventos `Connect` para o formato de log de auditoria XML de estilo antigo não incluem atributos de conexão.

* `RECORD_ID`

  Um identificador único para o registro de auditoria. O valor é composto por um número de sequência e um timestamp, no formato `SEQ_TIMESTAMP`. Quando o plugin de log de auditoria abre o arquivo de log de auditoria, ele inicializa o número de sequência para o tamanho do arquivo de log de auditoria, e depois incrementa o número de sequência em 1 para cada registro registrado. O timestamp é um valor UTC no formato `YYYY-MM-DDThh:mm:ss`, indicando a data e hora em que o plugin de log de auditoria abriu o arquivo.

  Exemplo: `RECORD_ID="12_2019-10-03T14:25:00"`

* `TIMESTAMP`

  Uma string que representa um valor UTC no formato `YYYY-MM-DDThh:mm:ss UTC`, indicando a data e hora em que o evento de auditoria foi gerado. Por exemplo, o evento correspondente à execução de uma instrução SQL recebida de um cliente tem um valor `TIMESTAMP` ocorrendo após a conclusão da instrução, e não quando foi recebida.

  Exemplo: `TIMESTAMP="2019-10-03T14:25:32 UTC"`

Os seguintes atributos são opcionais nos elementos `<AUDIT_RECORD>`. Muitos deles ocorrem apenas para elementos com valores específicos do atributo `NAME`.

* `COMMAND_CLASS`

  Uma string que indica o tipo de ação realizada.

  Exemplo: `COMMAND_CLASS="drop_table"`

  Os valores correspondem aos contadores de comandos `statement/sql/xxx`. Por exemplo, *`xxx`* é `drop_table` e `select` para as instruções `DROP TABLE` e `SELECT`, respectivamente. A seguinte declaração exibe os nomes possíveis:

  ```
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

* `CONNECTION_ID`

  Um inteiro não signatário que representa o identificador de conexão do cliente. Este é o mesmo valor retornado pela função `CONNECTION_ID()` dentro da sessão.

  Exemplo: `CONNECTION_ID="127"`

* `CONNECTION_TYPE`

O estado de segurança da conexão com o servidor. Os valores permitidos são `TCP/IP` (conexão TCP/IP estabelecida sem criptografia), `SSL/TLS` (conexão TCP/IP estabelecida com criptografia), `Socket` (conexão de arquivo de socket Unix), `Named Pipe` (conexão de pipe nomeado do Windows) e `Shared Memory` (conexão de memória compartilhada do Windows).

Exemplo: `CONNECTION_TYPE="SSL/TLS"`

* `DB`

  Uma string representando o nome de um banco de dados.

  Exemplo: `DB="test"`

  Para eventos de conexão, este atributo indica o banco de dados padrão; o atributo está vazio se não houver um banco de dados padrão. Para eventos de acesso a tabelas, o atributo indica o banco de dados ao qual a tabela acessada pertence.

* `HOST`

  Uma string representando o nome do host do cliente.

  Exemplo: `HOST="localhost"`

* `IP`

  Uma string representando o endereço IP do cliente.

  Exemplo: `IP="127.0.0.1"`

* `MYSQL_VERSION`

  Uma string representando a versão do servidor MySQL. Este é o mesmo valor da função `VERSION()` ou da variável de sistema `version`.

  Exemplo: `MYSQL_VERSION="5.7.21-log"`

* `OS_LOGIN`

  Uma string representando o nome do usuário externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com autenticação MySQL nativa (incorporada) ou se o plugin não definir o valor, este atributo está vazio. O valor é o mesmo da variável de sistema `external_user` (veja a Seção 8.2.19, “Usuários Proxy”).

  Exemplo: `OS_LOGIN="jeffrey"`

* `OS_VERSION`

  Uma string representando o sistema operacional em que o servidor foi construído ou está sendo executado.

  Exemplo: `OS_VERSION="x86_64-Linux"`

* `PRIV_USER`

Uma cadeia de caracteres que representa o usuário pelo qual o servidor autenticou o cliente. Esse é o nome do usuário que o servidor usa para verificação de privilégios e pode diferir do valor `USER`.

Exemplo: `PRIV_USER="jeffrey"`

* `PROXY_USER`

  Uma cadeia de caracteres que representa o usuário do proxy (consulte a Seção 8.2.19, “Usuários de Proxy”). O valor é vazio se o proxy estiver desativado.

  Exemplo: `PROXY_USER="developer"`

* `SERVER_ID`

  Um inteiro não assinado que representa o ID do servidor. Esse é o mesmo valor da variável de sistema `server_id`.

  Exemplo: `SERVER_ID="1"`

* `SQLTEXT`

  Uma cadeia de caracteres que representa o texto de uma instrução SQL. O valor pode ser vazio. Valores longos podem ser truncados. A cadeia de caracteres, assim como o próprio arquivo de log de auditoria, é escrita usando UTF-8 (até 4 bytes por caractere), então o valor pode ser o resultado de uma conversão. Por exemplo, a instrução original pode ter sido recebida do cliente como uma string SJIS.

  Exemplo: `SQLTEXT="DELETE FROM t1"`

* `STARTUP_OPTIONS`

  Uma cadeia de caracteres que representa as opções fornecidas na linha de comando ou em arquivos de opção quando o servidor MySQL foi iniciado.

  Exemplo: `STARTUP_OPTIONS="--port=3306 --log_output=FILE"`

* `STATUS`

  Um inteiro não assinado que representa o status do comando: 0 para sucesso, um número não nulo se um erro ocorreu. Esse é o mesmo valor da função C `mysql_errno()`. Consulte a descrição de `STATUS_CODE` para informações sobre como ele difere de `STATUS`.

  O log de auditoria não contém o valor SQLSTATE ou a mensagem de erro. Para ver as associações entre códigos de erro, valores SQLSTATE e mensagens, consulte a Referência de Mensagens de Erro do Servidor.

  As advertências não são registradas.

  Exemplo: `STATUS="1051"`

* `STATUS_CODE`

  Um inteiro não assinado que representa o status do comando: 0 para sucesso, 1 se um erro ocorreu.

O valor `STATUS_CODE` difere do valor `STATUS`: `STATUS_CODE` é 0 para sucesso e 1 para erro, o que é compatível com o consumidor EZ_collector para o Audit Vault. `STATUS` é o valor da função C `mysql_errno()`. Isso é 0 para sucesso e não nulo para erro, e, portanto, não é necessariamente 1 para erro.

Exemplo: `STATUS_CODE="0"`

* `TABLE`

  Uma string representando o nome de uma tabela.

  Exemplo: `TABLE="t3"`

* `USER`

  Uma string representando o nome do usuário enviado pelo cliente. Isso pode diferir do valor `PRIV_USER`.

* `VERSION`

  Um inteiro não assinado representando a versão do formato do arquivo de log de auditoria.

  Exemplo: `VERSION="1"`

##### Formato de Arquivo de Log de Auditoria JSON

Para o registro de auditoria no formato JSON (`audit_log_format=JSON`), o conteúdo do arquivo de log forma um array `JSON` com cada elemento do array representando um evento auditado como um hash `JSON` de pares chave-valor. Exemplos de registros de eventos completos aparecem mais adiante nesta seção. O seguinte é um trecho de eventos parciais:

```
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

O arquivo de log de auditoria é escrito usando UTF-8 (até 4 bytes por caractere). Quando o plugin de auditoria começa a escrever um novo arquivo de log, ele escreve o marcador de array de abertura `[` . Quando o plugin fecha um arquivo de log, ele escreve o marcador de array de fechamento `]` . O marcador de fechamento não está presente enquanto o arquivo está aberto.

Os itens dentro dos registros de auditoria têm essas características:

* Alguns itens aparecem em todos os registros de auditoria. Outros são opcionais e podem aparecer dependendo do tipo de registro de auditoria.

* A ordem dos itens dentro de um registro de auditoria não é garantida.
* Os valores dos itens não têm comprimento fixo. Valores longos podem ser truncados conforme indicado nas descrições dos itens fornecidas mais adiante.

* Os caracteres `"` e `\` são codificados como `\"` e `\\`, respectivamente.

O formato JSON é o único formato de arquivo de log de auditoria que suporta as estatísticas opcionais de tempo e tamanho da consulta. Esses dados estão disponíveis no log de consultas lentas para consultas qualificadas e, no contexto do log de auditoria, ajudam a detectar valores atípicos para a análise de atividades.

Para adicionar as estatísticas da consulta ao arquivo de log, você deve configurá-las como um filtro usando a função `audit_log_filter_set_filter()` como o elemento de serviço da sintaxe de filtragem JSON. Para obter instruções sobre como fazer isso, consulte Adicionar estatísticas de consulta para detecção de valores atípicos. Para que os campos `bytes_sent` e `bytes_received` sejam preenchidos, a variável de sistema `log_slow_extra` deve estar configurada para ON.

Os seguintes exemplos mostram os formatos de objeto JSON para diferentes tipos de eventos (indicados pelos itens `class` e `event`), reformatados levemente para melhor legibilidade:

Evento de auditoria de inicialização:

```
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

Quando o plugin de log de auditoria é iniciado como resultado da inicialização do servidor (ao contrário de ser habilitado em tempo de execução), `connection_id` é definido como 0 e `account` e `login` não estão presentes.

Evento de auditoria de desligamento:

```
{ "timestamp": "2019-10-03 14:28:20",
  "id": 3,
  "class": "audit",
  "event": "shutdown",
  "connection_id": 0,
  "shutdown_data": { "server_id": 1 } }
```

Quando o plugin de log de auditoria é desinstalado como resultado do desligamento do servidor (ao contrário de ser desabilitado em tempo de execução), `connection_id` é definido como 0 e `account` e `login` não estão presentes.

Evento de conexão ou mudança de usuário:

```
{ "timestamp": "2019-10-03 14:23:18",
  "id": 1,
  "class": "connection",
  "event": "connect",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" },
  "connection_data": { "connection_type": "ssl",
                       "status": 0,
                       "db": "test",
                       "connection_attributes": {
                         "_pid": "43236",
                         ...
                         "program_name": "mysqladmin"
                       } }
}
```

Evento de desconexão:

```
{ "timestamp": "2019-10-03 14:24:45",
  "id": 3,
  "class": "connection",
  "event": "disconnect",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" },
  "connection_data": { "connection_type": "ssl" } }
```

Evento de consulta:

```
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

Evento de consulta com estatísticas de consulta opcionais para detecção de valores atípicos:

```
{ "timestamp": "2022-01-28 13:09:30",
  "id": 0,
  "class": "general",
  "event": "status",
  "connection_id": 46,
  "account": { "user": "user", "host": "localhost" },
  "login": { "user": "user", “os": "", “ip": "127.0.0.1", “proxy": "" },
  "general_data": { "command": "Query",
                    "sql_command": "insert",
	            "query": "INSERT INTO audit_table VALUES(4)",
	            "status": 1146 }
  "query_statistics": { "query_time": 0.116250,
                        "bytes_sent": 18384,
                        "bytes_received": 78858,
                        "rows_sent": 3,
                        "rows_examined": 20878 } }
```

Evento de acesso à tabela (leitura, exclusão, inserção, atualização):

```
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

Os itens da lista a seguir aparecem no nível superior dos registros de auditoria no formato JSON: Cada valor do item é um escalar ou um hash `JSON`. Para itens que têm um valor de hash, a descrição lista apenas os nomes dos itens dentro desse hash. Para descrições mais completas dos itens de hash de segundo nível, consulte mais adiante nesta seção.

* `account`

  A conta MySQL associada ao evento. O valor é um hash contendo esses itens equivalentes ao valor da função `CURRENT_USER()` na seção: `user`, `host`.

  Exemplo:

  ```
  "account": { "user": "root", "host": "localhost" }
  ```

* `class`

  Uma string que representa a classe do evento. A classe define o tipo de evento, quando combinada com o item `event` que especifica a subclasse do evento.

  Exemplo:

  ```
  "class": "connection"
  ```

A tabela a seguir mostra as combinações permitidas de valores de `class` e `event`.

**Tabela 8.34 Combinações de Classe de Log de Auditoria e Valores de Evento**

<table summary="Combinações permitidas de valores de classe de log de auditoria e valores de evento."><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th>Valor da Classe</th> <th>Valores Permitidos de Eventos</th> </tr></thead><tbody><tr> <td><code class="literal">audit</code></td> <td><code class="literal">startup</code>, <code class="literal">shutdown</code></td> </tr><tr> <td><code class="literal">connection</code></td> <td><code class="literal">connect</code>, <code class="literal">change_user</code>, <code class="literal">disconnect</code></td> </tr><tr> <td><code class="literal">general</code></td> <td><code class="literal">status</code></td> </tr><tr> <td><code class="literal">table_access_data</code></td> <td><code class="literal">read</code>, <code class="literal">delete</code>, <code class="literal">insert</code>, <code class="literal">update</code></td> </tr></tbody></table>

Informações sobre uma conexão de cliente. O valor é um hash contendo esses itens: `tipo_conexão`, `status`, `db` e, possivelmente, `atributos_conexão`. Este item ocorre apenas para registros de auditoria com um valor de `classe` de `conexão`.

Exemplo:

```
  "connection_data": { "connection_type": "ssl",
                       "status": 0,
                       "db": "test" }
  ```

Eventos com um valor de `classe` de `conexão` e um valor de `evento` de `conectar` podem incluir um item `atributos_conexão` para exibir os atributos de conexão passados pelo cliente no momento do conectar. (Para informações sobre esses atributos, que também são exibidos nas tabelas do Gerenciador de Desempenho, consulte a Seção 29.12.9, “Tabelas de Atributos de Conexão do Gerenciador de Desempenho”.)

O valor `atributos_conexão` é um hash que representa cada atributo por seu nome e valor.

Exemplo:

```
  "connection_attributes": {
    "_pid": "43236",
    "_os": "macos0.14",
    "_platform": "x86_64",
    "_client_version": "8.4.0",
    "_client_name": "libmysql",
    "program_name": "mysqladmin"
  }
  ```

Se nenhum atributo de conexão estiver presente no evento, nenhum será registrado e o item `atributos_conexão` não aparecerá. Isso pode ocorrer se a tentativa de conexão falhar, o cliente não passar nenhum atributo ou a conexão ocorrer internamente, como durante o inicialização do servidor ou quando iniciada por um plugin.

* `id_conexão`

  Um inteiro não assinado representando o identificador de conexão do cliente. Este é o mesmo valor retornado pela função `CONNECTION_ID()` dentro da sessão.

  Exemplo:

  ```
  "connection_id": 5
  ```

* `evento`

  Uma string representando a subclasse da classe de evento. A subclasse define o tipo de evento, quando combinada com o item `classe` que especifica a classe de evento. Para mais informações, consulte a descrição do item `classe`.

  Exemplo:

  ```
  "event": "connect"
  ```

* `dados_gerais`

  Informações sobre uma instrução ou comando executado. O valor é um hash contendo esses itens: `comando`, `sql_command`, `query`, `status`. Este item ocorre apenas para registros de auditoria com um valor de `classe` de `geral`.

Exemplo:

```
  "general_data": { "command": "Query",
                    "sql_command": "show_variables",
                    "query": "SHOW VARIABLES",
                    "status": 0 }
  ```

* `id`

  Um inteiro não assinado que representa um ID de evento.

  Exemplo:

  ```
  "id": 2
  ```

  Para registros de auditoria que têm o mesmo valor de `timestamp`, seus valores `id` os distinguem e formam uma sequência. Dentro do log de auditoria, os pares `timestamp`/`id` são únicos. Esses pares são marcadores que identificam os locais dos eventos dentro do log.

* `login`

  Informações que indicam como um cliente se conectou ao servidor. O valor é um hash contendo esses itens: `user`, `os`, `ip`, `proxy`.

  Exemplo:

  ```
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" }
  ```

* `query_statistics`

  Estatísticas de consulta opcionais para detecção de valores atípicos. O valor é um hash contendo esses itens: `query_time`, `rows_sent`, `rows_examined`, `bytes_received`, `bytes_sent`. Para instruções sobre como configurar as estatísticas de consulta, consulte Adicionando Estatísticas de Consulta para Detecção de Valores Atípicos.

  Exemplo:

  ```
  "query_statistics": { "query_time": 0.116250,
                        "bytes_sent": 18384,
                        "bytes_received": 78858,
                        "rows_sent": 3,
                        "rows_examined": 20878 }
  ```

* `shutdown_data`

  Informações relacionadas à terminação do plugin de log de auditoria. O valor é um hash contendo esses itens: `server_id`. Esse item ocorre apenas para registros de auditoria com valores de `class` e `event` de `audit` e `shutdown`, respectivamente.

  Exemplo:

  ```
  "shutdown_data": { "server_id": 1 }
  ```

* `startup_data`

  Informações relacionadas à inicialização do plugin de log de auditoria. O valor é um hash contendo esses itens: `server_id`, `os_version`, `mysql_version`, `args`. Esse item ocorre apenas para registros de auditoria com valores de `class` e `event` de `audit` e `startup`, respectivamente.

  Exemplo:

  ```
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

  Informações sobre um acesso a uma tabela. O valor é um hash contendo esses itens: `db`, `table`, `query`, `sql_command`. Esse item ocorre apenas para registros de auditoria com um valor de `class` de `table_access`.

  Exemplo:

  ```
  "table_access_data": { "db": "test",
                         "table": "t1",
                         "query": "INSERT INTO t1 (i) VALUES(1),(2),(3)",
                         "sql_command": "insert" }
  ```

* `time`

Este campo é semelhante ao do campo `timestamp`, mas o valor é um inteiro e representa o valor do timestamp do UNIX que indica a data e a hora em que o evento de auditoria foi gerado.

Exemplo:

```
  "time" : 1618498687
  ```

O campo `time` ocorre em arquivos de log no formato JSON apenas se a variável de sistema `audit_log_format_unix_timestamp` estiver habilitada.

* `timestamp`

  Uma string que representa um valor UTC no formato *`YYYY-MM-DD hh:mm:ss`* indicando a data e a hora em que o evento de auditoria foi gerado. Por exemplo, o evento correspondente à execução de uma instrução SQL recebida de um cliente tem um valor de `timestamp` ocorrendo após a execução da instrução, e não quando ela foi recebida.

  Exemplo:

  ```
  "timestamp": "2019-10-03 13:50:01"
  ```

  Para registros de auditoria que têm o mesmo valor de `timestamp`, seus valores de `id` os distinguem e formam uma sequência. Dentro do log de auditoria, os pares `timestamp`/`id` são únicos. Esses pares são marcadores que identificam os locais dos eventos dentro do log.

Esses itens aparecem dentro de valores de hash associados a itens de nível superior de registros de auditoria no formato JSON:

* `args`

  Um array de opções que foram fornecidas na linha de comando ou em arquivos de opção quando o servidor MySQL foi iniciado. A primeira opção é o caminho para o executável do servidor.

  Exemplo:

  ```
  "args": ["/usr/local/mysql/bin/mysqld",
           "--loose-audit-log-format=JSON",
           "--log-error=log.err",
           "--pid-file=mysqld.pid",
           "--port=3306" ]
  ```

* `bytes_received`

  O número de bytes recebidos do cliente. Este item faz parte das estatísticas de consulta opcionais. Para que este campo seja preenchido, a variável de sistema `log_slow_extra` deve ser definida como `ON`.

  Exemplo:

  ```
  "bytes_received": 78858
  ```

* `bytes_sent`

  O número de bytes enviados ao cliente. Este item faz parte das estatísticas de consulta opcionais. Para que este campo seja preenchido, a variável de sistema `log_slow_extra` deve ser definida como `ON`.

  Exemplo:

  ```
  "bytes_sent": 18384
  ```

* `command`

Uma cadeia que representa o tipo de instrução que gerou o evento de auditoria, como um comando que o servidor recebeu de um cliente.

Exemplo:

```
  "command": "Query"
  ```

* `connection_type`

  O estado de segurança da conexão com o servidor. Os valores permitidos são `tcp/ip` (conexão TCP/IP estabelecida sem criptografia), `ssl` (conexão TCP/IP estabelecida com criptografia), `socket` (conexão de arquivo socket Unix), `named_pipe` (conexão de pipe nomeado do Windows) e `shared_memory` (conexão de memória compartilhada do Windows).

  Exemplo:

  ```
  "connection_type": "tcp/tcp"
  ```

* `db`

  Uma cadeia que representa o nome de um banco de dados. Para `connection_data`, é o banco de dados padrão. Para `table_access_data`, é o banco de dados da tabela.

  Exemplo:

  ```
  "db": "test"
  ```

* `host`

  Uma cadeia que representa o nome do host do cliente.

  Exemplo:

  ```
  "host": "localhost"
  ```

* `ip`

  Uma cadeia que representa o endereço IP do cliente.

  Exemplo:

  ```
  "ip": "::1"
  ```

* `mysql_version`

  Uma cadeia que representa a versão do servidor MySQL. Este é o mesmo valor da função `VERSION()` ou da variável de sistema `version`.

  Exemplo:

  ```
  "mysql_version": "5.7.21-log"
  ```

* `os`

  Uma cadeia que representa o nome do usuário externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com autenticação MySQL nativa (incorporada) ou se o plugin não definir o valor, este atributo está vazio. O valor é o mesmo da variável de sistema `external_user`. Veja a Seção 8.2.19, “Usuários Proxy”.

  Exemplo:

  ```
  "os": "jeffrey"
  ```

* `os_version`

  Uma cadeia que representa o sistema operacional em que o servidor foi construído ou está em execução.

  Exemplo:

  ```
  "os_version": "i686-Linux"
  ```

* `proxy`

  Uma cadeia que representa o usuário proxy (veja a Seção 8.2.19, “Usuários Proxy”). O valor está vazio se o proxy estiver desativado.

  Exemplo:

```
  "proxy": "developer"
  ```
* `query`

  Uma string que representa o texto de uma instrução SQL. O valor pode ser vazio. Valores longos podem ser truncados. A string, assim como o próprio arquivo de log de auditoria, é escrita usando UTF-8 (até 4 bytes por caractere), então o valor pode ser o resultado de uma conversão. Por exemplo, a instrução original pode ter sido recebida do cliente como uma string SJIS.

  Exemplo:

  ```
  "query": "DELETE FROM t1"
  ```
* `query_time`

  O tempo de execução da consulta em microsegundos (se o tipo de dados `longlong` for selecionado) ou segundos (se o tipo de dados `double` for selecionado). Este item faz parte das estatísticas de consulta opcionais.

  Exemplo:

  ```
  "query_time": 0.116250
  ```
* `rows_examined`

  O número de linhas acessadas durante a consulta. Este item faz parte das estatísticas de consulta opcionais.

  Exemplo:

  ```
  "rows_examined": 20878
  ```
* `rows_sent`

  O número de linhas enviadas ao cliente como resultado. Este item faz parte das estatísticas de consulta opcionais.

  Exemplo:

  ```
  "rows_sent": 3
  ```
* `server_id`

  Um inteiro sem sinal que representa o ID do servidor. Este é o mesmo valor da variável de sistema `server_id`.

  Exemplo:

  ```
  "server_id": 1
  ```
* `sql_command`

  Uma string que indica o tipo de instrução SQL.

  Exemplo:

  ```
  "sql_command": "insert"
  ```
  Os valores correspondem aos contadores de comandos `statement/sql/xxx`. Por exemplo, *`xxx`* é `drop_table` e `select` para as instruções `DROP TABLE` e `SELECT`, respectivamente. A seguinte instrução exibe os nomes possíveis:

  ```
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```
* `status`

  Um inteiro sem sinal que representa o status do comando: 0 para sucesso, um número não nulo se ocorreu um erro. Este é o mesmo valor da função `mysql_errno()` da API C.

O log de auditoria não contém o valor SQLSTATE ou a mensagem de erro. Para ver as associações entre códigos de erro, valores SQLSTATE e mensagens, consulte a Referência de Mensagens de Erro do Servidor.

As advertências não são registradas.

Exemplo:

```
  "status": 1051
  ```

* `table`

  Uma string que representa o nome de uma tabela.

  Exemplo:

  ```
  "table": "t1"
  ```

* `user`

  Uma string que representa o nome de um usuário. O significado difere dependendo do item em que `user` ocorre:

  + Dentro dos itens `account`, `user` é uma string que representa o usuário pelo qual o servidor autenticou o cliente. Esse é o nome de usuário que o servidor usa para verificação de privilégios.

  + Dentro dos itens `login`, `user` é uma string que representa o nome de usuário enviado pelo cliente.

  Exemplo:

  ```
  "user": "root"
  ```