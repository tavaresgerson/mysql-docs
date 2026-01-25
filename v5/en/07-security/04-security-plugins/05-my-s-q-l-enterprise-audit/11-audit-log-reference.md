#### 6.4.5.11 Referência do Audit Log

As seções a seguir fornecem uma referência aos elementos do MySQL Enterprise Audit:

* [Tabelas do Audit Log](audit-log-reference.html#audit-log-tables "Tabelas do Audit Log")
* [Funções do Audit Log](audit-log-reference.html#audit-log-routines "Funções do Audit Log")
* [Referência de Opções e Variáveis do Audit Log](audit-log-reference.html#audit-log-option-variable-reference "Referência de Opções e Variáveis do Audit Log")
* [Opções e Variáveis do Audit Log](audit-log-reference.html#audit-log-options-variables "Opções e Variáveis do Audit Log")
* [Variáveis de Status do Audit Log](audit-log-reference.html#audit-log-status-variables "Variáveis de Status do Audit Log")

Para instalar as tabelas e funções do audit log, use as instruções fornecidas na [Seção 6.4.5.2, “Instalando ou Desinstalando o MySQL Enterprise Audit”](audit-log-installation.html "6.4.5.2 Instalando ou Desinstalando o MySQL Enterprise Audit"). A menos que esses objetos estejam instalados, o `audit_log` plugin opera em modo legado (legacy mode). Consulte a [Seção 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering").

##### Tabelas do Audit Log

O MySQL Enterprise Audit utiliza tabelas no Database de sistema `mysql` para armazenamento persistente de dados de filtro e contas de usuário. As tabelas podem ser acessadas apenas por usuários que possuam privilégios para esse Database. As tabelas utilizam o storage engine `InnoDB` (`MyISAM` antes do MySQL 5.7.21).

Se essas tabelas estiverem ausentes, o `audit_log` plugin opera em modo legado (legacy mode). Consulte a [Seção 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering").

A tabela `audit_log_filter` armazena as definições de filtro. A tabela possui estas colunas:

* `NAME`

  O nome do filtro.

* `FILTER`

  A definição de filtro associada ao nome do filtro. As definições são armazenadas como valores [`JSON`](json.html "11.5 The JSON Data Type").

A tabela `audit_log_user` armazena informações da conta de usuário. A tabela possui estas colunas:

* `USER`

  A parte do nome de usuário de uma conta. Para uma conta `user1@localhost`, a parte `USER` é `user1`.

* `HOST`

  A parte do nome do host de uma conta. Para uma conta `user1@localhost`, a parte `HOST` é `localhost`.

* `FILTERNAME`

  O nome do filtro atribuído à conta. O nome do filtro associa a conta a um filtro definido na tabela `audit_log_filter`.

##### Funções do Audit Log

Esta seção descreve, para cada função do audit log, seu propósito, sequência de chamada e valor de retorno. Para obter informações sobre as condições sob as quais essas funções podem ser invocadas, consulte a [Seção 6.4.5.7, “Audit Log Filtering” (Filtragem do Log de Auditoria)](audit-log-filtering.html "6.4.5.7 Audit Log Filtering").

Cada função do audit log retorna uma string que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

As funções do audit log tratam os argumentos de string como binary strings (o que significa que não distinguem maiúsculas de minúsculas), e os valores de retorno de string são binary strings.

Se uma função do audit log for invocada a partir do cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), os resultados de binary string serão exibidos usando notação hexadecimal, dependendo do valor de [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex). Para obter mais informações sobre essa opção, consulte a [Seção 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

Estas funções do audit log estão disponíveis:

* [`audit_log_encryption_password_get()`](audit-log-reference.html#function_audit-log-encryption-password-get)

  Recupera a senha de encryption atual do audit log como uma binary string. A senha é obtida a partir do MySQL keyring, que deve estar habilitado ou um erro ocorrerá. Qualquer Keyring Plugin pode ser usado; para instruções, consulte a [Seção 6.4.4, “The MySQL Keyring”](keyring.html "6.4.4 The MySQL Keyring").

  Para informações adicionais sobre a encryption do audit log, consulte [Encrypting Audit Log Files (Criptografando Arquivos de Audit Log)](audit-log-logging-configuration.html#audit-log-file-encryption "Encrypting Audit Log Files").

  Argumentos:

  Nenhum.

  Valor de retorno:

  A string da senha em caso de sucesso (up to 766 bytes), ou `NULL` e um erro em caso de falha.

  Exemplo:

  ```sql
  mysql> SELECT audit_log_encryption_password_get();
  +-------------------------------------+
  | audit_log_encryption_password_get() |
  +-------------------------------------+
  | secret                              |
  +-------------------------------------+
  ```

* [`audit_log_encryption_password_set(password)`](audit-log-reference.html#function_audit-log-encryption-password-set)

  Define a senha de encryption do audit log para o argumento fornecido, armazena a senha no MySQL keyring. Se a encryption estiver habilitada, a função realiza uma operação de rotação do arquivo de log que renomeia o arquivo de log atual e inicia um novo arquivo de log criptografado com a senha. O Keyring deve estar habilitado ou um erro ocorrerá. Qualquer Keyring Plugin pode ser usado; para instruções, consulte a [Seção 6.4.4, “The MySQL Keyring”](keyring.html "6.4.4 The MySQL Keyring").

  Para informações adicionais sobre a encryption do audit log, consulte [Encrypting Audit Log Files (Criptografando Arquivos de Audit Log)](audit-log-logging-configuration.html#audit-log-file-encryption "Encrypting Audit Log Files").

  Argumentos:

  *`password`*: A string da senha. O comprimento máximo permitido é de 766 bytes.

  Valor de retorno:

  1 para sucesso, 0 para falha.

  Exemplo:

  ```sql
  mysql> SELECT audit_log_encryption_password_set(password);
  +---------------------------------------------+
  | audit_log_encryption_password_set(password) |
  +---------------------------------------------+
  | 1                                           |
  +---------------------------------------------+
  ```

* [`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush)

  Chamar qualquer uma das outras funções de filtering afeta a filtragem operacional do audit log imediatamente e atualiza as tabelas do audit log. Se, em vez disso, você modificar o conteúdo dessas tabelas diretamente usando comandos como [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement") e [`DELETE`](delete.html "13.2.2 DELETE Statement"), as alterações não afetam o filtering imediatamente. Para descarregar (flush) suas alterações e torná-las operacionais, chame [`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush).

  Aviso

  [`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush) deve ser usado apenas após modificar as tabelas de auditoria diretamente, para forçar o recarregamento de todos os filtros. Caso contrário, esta função deve ser evitada. É, na verdade, uma versão simplificada do descarregamento e recarregamento do `audit_log` plugin com [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") mais [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement").

  [`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush) afeta todas as Sessions atuais e as desvincula de seus filtros anteriores. As Sessions atuais não são mais logadas, a menos que se desconectem e reconectem, ou executem uma operação de troca de usuário (change-user).

  Se esta função falhar, uma mensagem de erro é retornada e o audit log é desabilitado até a próxima chamada bem-sucedida de [`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush).

  Argumentos:

  Nenhum.

  Valor de retorno:

  Uma string que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

  Exemplo:

  ```sql
  mysql> SELECT audit_log_filter_flush();
  +--------------------------+
  | audit_log_filter_flush() |
  +--------------------------+
  | OK                       |
  +--------------------------+
  ```

* [`audit_log_filter_remove_filter(filter_name)`](audit-log-reference.html#function_audit-log-filter-remove-filter)

  Dado um nome de filtro, remove o filtro do conjunto atual de filtros. Não é um erro se o filtro não existir.

  Se um filtro removido estiver atribuído a quaisquer contas de usuário, esses usuários param de ser filtrados (eles são removidos da tabela `audit_log_user`). O término do filtering inclui quaisquer Sessions atuais para esses usuários: elas são desvinculadas do filtro e não são mais logadas.

  Argumentos:

  + *`filter_name`*: Uma string que especifica o nome do filtro.

  Valor de retorno:

  Uma string que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

  Exemplo:

  ```sql
  mysql> SELECT audit_log_filter_remove_filter('SomeFilter');
  +----------------------------------------------+
  | audit_log_filter_remove_filter('SomeFilter') |
  +----------------------------------------------+
  | OK                                           |
  +----------------------------------------------+
  ```

* [`audit_log_filter_remove_user(user_name)`](audit-log-reference.html#function_audit-log-filter-remove-user)

  Dado um nome de conta de usuário, faz com que o usuário não seja mais atribuído a um filtro. Não é um erro se o usuário não tiver um filtro atribuído. O filtering das Sessions atuais para o usuário permanece inalterado. Novas Connections para o usuário são filtradas usando o filtro de conta padrão se houver um, e não são logadas caso contrário.

  Se o nome for `%`, a função remove o filtro de conta padrão que é usado para qualquer conta de usuário que não tenha um filtro explicitamente atribuído.

  Argumentos:

  + *`user_name`*: O nome da conta de usuário como uma string no formato `user_name@host_name`, ou `%` para representar a conta padrão.

  Valor de retorno:

  Uma string que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

  Exemplo:

  ```sql
  mysql> SELECT audit_log_filter_remove_user('user1@localhost');
  +-------------------------------------------------+
  | audit_log_filter_remove_user('user1@localhost') |
  +-------------------------------------------------+
  | OK                                              |
  +-------------------------------------------------+
  ```

* [`audit_log_filter_set_filter(filter_name, definition)`](audit-log-reference.html#function_audit-log-filter-set-filter)

  Dado um nome de filtro e uma definição, adiciona o filtro ao conjunto atual de filtros. Se o filtro já existir e for usado por quaisquer Sessions atuais, essas Sessions são desvinculadas do filtro e não são mais logadas. Isso ocorre porque a nova definição de filtro tem um novo Filter ID que difere do seu ID anterior.

  Argumentos:

  + *`filter_name`*: Uma string que especifica o nome do filtro.

  + *`definition`*: Um valor [`JSON`](json.html "11.5 The JSON Data Type") que especifica a definição do filtro.

  Valor de retorno:

  Uma string que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

  Exemplo:

  ```sql
  mysql> SET @f = '{ "filter": { "log": false } }';
  mysql> SELECT audit_log_filter_set_filter('SomeFilter', @f);
  +-----------------------------------------------+
  | audit_log_filter_set_filter('SomeFilter', @f) |
  +-----------------------------------------------+
  | OK                                            |
  +-----------------------------------------------+
  ```

* [`audit_log_filter_set_user(user_name, filter_name)`](audit-log-reference.html#function_audit-log-filter-set-user)

  Dado um nome de conta de usuário e um nome de filtro, atribui o filtro ao usuário. Um usuário pode ter apenas um filtro atribuído, portanto, se o usuário já tinha um filtro atribuído, a atribuição é substituída. O filtering das Sessions atuais para o usuário permanece inalterado. Novas Connections são filtradas usando o novo filtro.

  Como um caso especial, o nome `%` representa a conta padrão. O filtro é usado para Connections de qualquer conta de usuário que não tenha um filtro explicitamente atribuído.

  Argumentos:

  + *`user_name`*: O nome da conta de usuário como uma string no formato `user_name@host_name`, ou `%` para representar a conta padrão.

  + *`filter_name`*: Uma string que especifica o nome do filtro.

  Valor de retorno:

  Uma string que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

  Exemplo:

  ```sql
  mysql> SELECT audit_log_filter_set_user('user1@localhost', 'SomeFilter');
  +------------------------------------------------------------+
  | audit_log_filter_set_user('user1@localhost', 'SomeFilter') |
  +------------------------------------------------------------+
  | OK                                                         |
  +------------------------------------------------------------+
  ```

* [`audit_log_read([arg])`](audit-log-reference.html#function_audit-log-read)

  Lê o audit log e retorna uma binary string [`JSON`](json.html "11.5 The JSON Data Type") como resultado. Se o formato do audit log não for [`JSON`](json.html "11.5 The JSON Data Type"), ocorre um erro.

  Sem argumento ou com um argumento hash [`JSON`](json.html "11.5 The JSON Data Type"), [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) lê eventos do audit log e retorna uma string [`JSON`](json.html "11.5 The JSON Data Type") contendo um array de eventos de auditoria. Os itens no argumento hash influenciam como a leitura ocorre, conforme descrito posteriormente. Cada elemento no array retornado é um evento representado como um hash [`JSON`](json.html "11.5 The JSON Data Type"), com a exceção de que o último elemento pode ser um valor `null` [`JSON`](json.html "11.5 The JSON Data Type") para indicar que não há eventos seguintes disponíveis para leitura.

  Com um argumento que consiste em um valor `null` [`JSON`](json.html "11.5 The JSON Data Type"), [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) fecha a sequência de leitura atual.

  Para detalhes adicionais sobre o processo de leitura do audit log, consulte a [Seção 6.4.5.6, “Reading Audit Log Files” (Lendo Arquivos de Audit Log)](audit-log-file-reading.html "6.4.5.6 Reading Audit Log Files").

  Argumentos:

  *`arg`*: O argumento é opcional. Se omitido, a função lê eventos a partir da posição atual. Se presente, o argumento pode ser um valor `null` [`JSON`](json.html "11.5 The JSON Data Type") para fechar a sequência de leitura, ou um hash [`JSON`](json.html "11.5 The JSON Data Type"). Dentro de um argumento hash, os itens são opcionais e controlam aspectos da operação de leitura, como a posição em que a leitura deve começar ou quantos eventos devem ser lidos. Os seguintes itens são significativos (outros itens são ignorados):

  + `timestamp`, `id`: A posição dentro do audit log do primeiro evento a ser lido. Se a posição for omitida do argumento, a leitura continua a partir da posição atual. Os itens `timestamp` e `id` juntos compreendem um bookmark (marcador) que identifica um evento específico de forma única. Se um argumento [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) incluir qualquer um dos itens, ele deve incluir ambos para especificar completamente uma posição, ou um erro ocorrerá.

    Para obter um bookmark para o evento escrito mais recentemente, chame [`audit_log_read_bookmark()`](audit-log-reference.html#function_audit-log-read-bookmark).

  + `max_array_length`: O número máximo de eventos a serem lidos a partir do log. Se este item for omitido, o padrão é ler até o final do log ou até que o Buffer de leitura esteja cheio, o que ocorrer primeiro.

  Valor de retorno:

  Se a chamada for bem-sucedida, o valor de retorno é uma binary string [`JSON`](json.html "11.5 The JSON Data Type") contendo um array de eventos de auditoria, ou um valor `null` [`JSON`](json.html "11.5 The JSON Data Type") se este foi passado como argumento para fechar a sequência de leitura. Se a chamada falhar, o valor de retorno é `NULL` e ocorre um erro.

  Exemplo:

  ```sql
  mysql> SELECT audit_log_read(audit_log_read_bookmark());
  +-----------------------------------------------------------------------+
  | audit_log_read(audit_log_read_bookmark())                             |
  +-----------------------------------------------------------------------+
  | [ {"timestamp":"2020-05-18 22:41:24","id":0,"class":"connection", ... |
  +-----------------------------------------------------------------------+
  mysql> SELECT audit_log_read('null');
  +------------------------+
  | audit_log_read('null') |
  +------------------------+
  | null                   |
  +------------------------+
  ```

* [`audit_log_read_bookmark()`](audit-log-reference.html#function_audit-log-read-bookmark)

  Retorna uma binary string [`JSON`](json.html "11.5 The JSON Data Type") representando um bookmark para o evento de audit log escrito mais recentemente. Se o formato do audit log não for `JSON`, um erro ocorrerá.

  O bookmark é um hash [`JSON`](json.html "11.5 The JSON Data Type") com os itens `timestamp` e `id` que identificam de forma única a posição de um evento dentro do audit log. Ele é adequado para ser passado para [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) para indicar a essa função a posição em que a leitura deve começar.

  Para detalhes adicionais sobre o processo de leitura do audit log, consulte a [Seção 6.4.5.6, “Reading Audit Log Files” (Lendo Arquivos de Audit Log)](audit-log-file-reading.html "6.4.5.6 Reading Audit Log Files").

  Argumentos:

  Nenhum.

  Valor de retorno:

  Uma binary string [`JSON`](json.html "11.5 The JSON Data Type") contendo um bookmark para sucesso, ou `NULL` e um erro para falha.

  Exemplo:

  ```sql
  mysql> SELECT audit_log_read_bookmark();
  +-------------------------------------------------+
  | audit_log_read_bookmark()                       |
  +-------------------------------------------------+
  | { "timestamp": "2019-10-03 21:03:44", "id": 0 } |
  +-------------------------------------------------+
  ```

##### Referência de Opções e Variáveis do Audit Log

**Tabela 6.34 Referência de Opções e Variáveis do Audit Log**

| Nome | Linha de Comando (Cmd-Line) | Arquivo de Opções (Option File) | Variável de Sistema (System Var) | Variável de Status (Status Var) | Escopo da Variável (Var Scope) | Dinâmico (Dynamic) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| audit-log | Sim | Sim | | | | |
| audit_log_buffer_size | Sim | Sim | Sim | | Global | Não |
| audit_log_compression | Sim | Sim | Sim | | Global | Não |
| audit_log_connection_policy | Sim | Sim | Sim | | Global | Sim |
| audit_log_current_session | | | Sim | | Ambos (Both) | Não |
| Audit_log_current_size | | | | Sim | Global | Não |
| audit_log_disable | Sim | Sim | Sim | | Global | Sim |
| audit_log_encryption | Sim | Sim | Sim | | Global | Não |
| Audit_log_event_max_drop_size | | | | Sim | Global | Não |
| Audit_log_events | | | | Sim | Global | Não |
| Audit_log_events_filtered | | | | Sim | Global | Não |
| Audit_log_events_lost | | | | Sim | Global | Não |
| Audit_log_events_written | | | | Sim | Global | Não |
| audit_log_exclude_accounts | Sim | Sim | Sim | | Global | Sim |
| audit_log_file | Sim | Sim | Sim | | Global | Não |
| audit_log_filter_id | | | Sim | | Ambos (Both) | Não |
| audit_log_flush | | | Sim | | Global | Sim |
| audit_log_format | Sim | Sim | Sim | | Global | Não |
| audit_log_include_accounts | Sim | Sim | Sim | | Global | Sim |
| audit_log_policy | Sim | Sim | Sim | | Global | Não |
| audit_log_read_buffer_size | Sim | Sim | Sim | | Varia (Varies) | Varia (Varies) |
| audit_log_rotate_on_size | Sim | Sim | Sim | | Global | Sim |
| audit_log_statement_policy | Sim | Sim | Sim | | Global | Sim |
| audit_log_strategy | Sim | Sim | Sim | | Global | Não |
| Audit_log_total_size | | | | Sim | Global | Não |
| Audit_log_write_waits | | | | Sim | Global | Não |

##### Opções e Variáveis do Audit Log

Esta seção descreve as opções de comando e as System Variables que configuram a operação do MySQL Enterprise Audit. Se os valores especificados no momento da inicialização estiverem incorretos, o `audit_log` plugin pode falhar ao inicializar corretamente e o servidor não o carrega. Neste caso, o servidor também pode produzir mensagens de erro para outras configurações do audit log porque não as reconhece.

Para configurar a ativação do `audit log plugin`, use esta opção:

* [`--audit-log[=value]`](audit-log-reference.html#option_mysqld_audit-log)

  <table frame="box" rules="all" summary="Propriedades para audit-log"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o `audit_log` plugin na inicialização (startup). Ela está disponível apenas se o Plugin tiver sido registrado anteriormente com [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") ou for carregado com [`--plugin-load`](server-options.html#option_mysqld_plugin-load) ou [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add). Consulte a [Seção 6.4.5.2, “Instalando ou Desinstalando o MySQL Enterprise Audit”](audit-log-installation.html "6.4.5.2 Installing or Uninstalling MySQL Enterprise Audit").

  O valor da opção deve ser um daqueles disponíveis para opções de carregamento de Plugin (plugin-loading options), conforme descrito na [Seção 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins"). Por exemplo, [`--audit-log=FORCE_PLUS_PERMANENT`](audit-log-reference.html#option_mysqld_audit-log) informa ao servidor para carregar o Plugin e impedir que ele seja removido enquanto o servidor estiver em execução.

Se o `audit log plugin` estiver habilitado, ele expõe várias System Variables que permitem o controle sobre o logging:

```sql
mysql> SHOW VARIABLES LIKE 'audit_log%';
+--------------------------------------+--------------+
| Variable_name                        | Value        |
+--------------------------------------+--------------+
| audit_log_buffer_size                | 1048576      |
| audit_log_compression                | NONE         |
| audit_log_connection_policy          | ALL          |
| audit_log_current_session            | OFF          |
| audit_log_disable                    | OFF          |
| audit_log_encryption                 | NONE         |
| audit_log_exclude_accounts           |              |
| audit_log_file                       | audit.log    |
| audit_log_filter_id                  | 0            |
| audit_log_flush                      | OFF          |
| audit_log_format                     | NEW          |
| audit_log_format_unix_timestamp      | OFF          |
| audit_log_include_accounts           |              |
| audit_log_policy                     | ALL          |
| audit_log_read_buffer_size           | 32768        |
| audit_log_rotate_on_size             | 0            |
| audit_log_statement_policy           | ALL          |
| audit_log_strategy                   | ASYNCHRONOUS |
+--------------------------------------+--------------+
```

Você pode definir qualquer uma dessas variáveis na inicialização do servidor, e algumas delas em runtime. Aquelas que estão disponíveis apenas para legacy mode audit log filtering são assim indicadas.

* [`audit_log_buffer_size`](audit-log-reference.html#sysvar_audit_log_buffer_size)

  <table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1048576</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>4096</code></td> </tr><tr><th>Valor Máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor Máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco (Block Size)</th> <td><code>4096</code></td> </tr></tbody></table>

  Quando o `audit log plugin` escreve eventos no log de forma assíncrona, ele usa um Buffer para armazenar o conteúdo dos eventos antes de escrevê-los. Esta variável controla o tamanho desse Buffer, em bytes. O servidor ajusta o valor para um múltiplo de 4096. O Plugin usa um único Buffer, que ele aloca quando inicializa e remove quando termina. O Plugin aloca este Buffer apenas se o logging for assíncrono.

* [`audit_log_compression`](audit-log-reference.html#sysvar_audit_log_compression)

  <table frame="box" rules="all" summary="Propriedades para audit_log_compression"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log-compression=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Variável de Sistema</th> <td><code>audit_log_compression</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>NONE</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>NONE</code></p><p><code>GZIP</code></p></td> </tr></tbody></table>

  O tipo de compression para o arquivo de audit log. Os valores permitidos são `NONE` (nenhuma compression; o padrão) e `GZIP` (compressão GNU Zip). Para mais informações, consulte [Compressing Audit Log Files (Comprimindo Arquivos de Audit Log)](audit-log-logging-configuration.html#audit-log-file-compression "Compressing Audit Log Files").

* [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy)

  <table frame="box" rules="all" summary="Propriedades para audit_log_connection_policy"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log-connection-policy=value</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>audit_log_connection_policy</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ALL</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ALL</code></p><p><code>ERRORS</code></p><p><code>NONE</code></p></td> </tr></tbody></table>

  Note

  Esta variável se aplica apenas ao legacy mode audit log filtering (consulte a [Seção 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering")).

  A política que controla como o `audit log plugin` escreve eventos de Connection em seu arquivo de log. A tabela a seguir mostra os valores permitidos.

  <table summary="Valores permitidos para a variável audit_log_connection_policy."><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>ALL</code></td> <td>Loga todos os eventos de Connection</td> </tr><tr> <td><code>ERRORS</code></td> <td>Loga apenas eventos de Connection que falharam</td> </tr><tr> <td><code>NONE</code></td> <td>Não loga eventos de Connection</td> </tr></tbody></table>

  Note

  Na inicialização do servidor (server startup), qualquer valor explícito fornecido para [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) pode ser substituído se [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) também for especificado, conforme descrito na [Seção 6.4.5.5, “Configuring Audit Logging Characteristics” (Configurando Características de Logging de Auditoria)](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").

* [`audit_log_current_session`](audit-log-reference.html#sysvar_audit_log_current_session)

  <table frame="box" rules="all" summary="Propriedades para audit_log_current_session"><tbody><tr><th>Variável de Sistema</th> <td><code>audit_log_current_session</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>depende da política de filtering</code></td> </tr></tbody></table>

  Se o audit logging está habilitado para a Session atual. O valor de Session desta variável é somente leitura. Ele é definido quando a Session começa, com base nos valores das System Variables [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) e [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts). O `audit log plugin` usa o valor de Session para determinar se deve auditar eventos para a Session. (Existe um valor Global, mas o Plugin não o usa.)

* [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable)

  <table frame="box" rules="all" summary="Propriedades para audit_log_disable"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log-disable[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.37</td> </tr><tr><th>Variável de Sistema</th> <td><code>audit_log_disable</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Permite desabilitar o audit logging para todas as Sessions de Connection e conectadas. Desabilitar o audit logging requer o privilégio [`SUPER`](privileges-provided.html#priv_super). Consulte a [Seção 6.4.5.9, “Disabling Audit Logging” (Desabilitando o Audit Logging)](audit-log-disabling.html "6.4.5.9 Disabling Audit Logging").

* [`audit_log_encryption`](audit-log-reference.html#sysvar_audit_log_encryption)

  <table frame="box" rules="all" summary="Propriedades para audit_log_encryption"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log-encryption=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Variável de Sistema</th> <td><code>audit_log_encryption</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>NONE</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>NONE</code></p><p><code>AES</code></p></td> </tr></tbody></table>

  O tipo de encryption para o arquivo de audit log. Os valores permitidos são `NONE` (nenhuma encryption; o padrão) e `AES` (encryption de cifra AES-256-CBC). Para mais informações, consulte [Encrypting Audit Log Files (Criptografando Arquivos de Audit Log)](audit-log-logging-configuration.html#audit-log-file-encryption "Encrypting Audit Log Files").

* [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts)

  <table frame="box" rules="all" summary="Propriedades para audit_log_exclude_accounts"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log-exclude-accounts=value</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>audit_log_exclude_accounts</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Note

  Esta variável se aplica apenas ao legacy mode audit log filtering (consulte a [Seção 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering")).

  As contas para as quais os eventos não devem ser logados. O valor deve ser `NULL` ou uma string contendo uma lista de um ou mais nomes de conta separados por vírgula. Para mais informações, consulte a [Seção 6.4.5.7, “Audit Log Filtering”](audit-log-filtering.html "6.4.5.7 Audit Log Filtering").

  Modificações em [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts) afetam apenas Connections criadas subsequentemente à modificação, e não Connections existentes.

* [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file)

  <table frame="box" rules="all" summary="Propriedades para audit-log"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  O nome base e o sufixo do arquivo para o qual o `audit log plugin` escreve eventos. O valor padrão é `audit.log`, independentemente do formato de logging. Para que o sufixo do nome corresponda ao formato, defina o nome explicitamente, escolhendo um sufixo diferente (por exemplo, `audit.xml` para formato XML, `audit.json` para formato JSON).

  Se o valor de [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) for um nome de caminho relativo, o Plugin o interpreta em relação ao diretório de dados (data directory). Se o valor for um nome de caminho completo, o Plugin usa o valor como está. Um nome de caminho completo pode ser útil se for desejável localizar arquivos de auditoria em um file system ou diretório separado. Por motivos de segurança, escreva o arquivo de audit log em um diretório acessível apenas ao MySQL server e a usuários com um motivo legítimo para visualizar o log.

  Para detalhes sobre como o `audit log plugin` interpreta o valor de [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) e as regras para a renomeação de arquivos que ocorre na inicialização e encerramento do Plugin, consulte [Naming Conventions for Audit Log Files (Convenções de Nomenclatura para Arquivos de Audit Log)](audit-log-logging-configuration.html#audit-log-file-name "Naming Conventions for Audit Log Files").

  A partir do MySQL 5.7.21, o `audit log plugin` usa o diretório que contém o arquivo de audit log (determinado a partir do valor [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file)) como o local para procurar arquivos de audit log legíveis. A partir desses arquivos de log e do arquivo atual, o Plugin constrói uma lista daqueles que estão sujeitos a serem usados com as funções de bookmarking e leitura do audit log. Consulte a [Seção 6.4.5.6, “Reading Audit Log Files”](audit-log-file-reading.html "6.4.5.6 Reading Audit Log Files").

* [`audit_log_filter_id`](audit-log-reference.html#sysvar_audit_log_filter_id)

  <table frame="box" rules="all" summary="Propriedades para audit-log"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  O valor de Session desta variável indica o ID, mantido internamente, do filtro de auditoria para a Session atual. Um valor de 0 significa que a Session não tem filtro atribuído.

* [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush)

  <table frame="box" rules="all" summary="Propriedades para audit-log"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Se [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) for 0, a rotação automática do arquivo de audit log por tamanho é desabilitada e a rotação ocorre apenas quando realizada manualmente. Nesse caso, habilitar [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush) definindo-o como 1 ou `ON` faz com que o `audit log plugin` feche e reabra seu arquivo de log para descarregá-lo (flush). (O valor da variável permanece `OFF` para que você não precise desabilitá-la explicitamente antes de habilitá-la novamente para realizar outro flush.) Para mais informações, consulte a [Seção 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").

* [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format)

  <table frame="box" rules="all" summary="Propriedades para audit-log"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  O formato do arquivo de audit log. Os valores permitidos são `OLD` (XML estilo antigo), `NEW` (XML estilo novo; o padrão) e (a partir do MySQL 5.7.21) `JSON`. Para detalhes sobre cada formato, consulte a [Seção 6.4.5.4, “Audit Log File Formats” (Formatos de Arquivo de Audit Log)](audit-log-file-formats.html "6.4.5.4 Audit Log File Formats").

  Note

  Para informações sobre questões a serem consideradas ao alterar o formato do log, consulte [Selecting Audit Log File Format (Selecionando o Formato do Arquivo de Audit Log)](audit-log-logging-configuration.html#audit-log-file-format "Selecting Audit Log File Format").

* [`audit_log_format_unix_timestamp`](audit-log-reference.html#sysvar_audit_log_format_unix_timestamp)

  <table frame="box" rules="all" summary="Propriedades para audit-log"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Esta variável se aplica apenas à saída do audit log no formato JSON. Quando isso é verdadeiro, habilitar esta variável faz com que cada registro do arquivo de log inclua um campo `time`. O valor do campo é um Integer que representa o UNIX timestamp indicando a data e hora em que o evento de auditoria foi gerado.

  Alterar o valor desta variável em runtime causa a rotação do arquivo de log, de modo que, para um determinado arquivo de log no formato JSON, todos os registros no arquivo incluem ou não o campo `time`.

* [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts)

  <table frame="box" rules="all" summary="Propriedades para audit-log"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Note

  Esta variável se aplica apenas ao legacy mode audit log filtering (consulte a [Seção 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering")).

  As contas para as quais os eventos devem ser logados. O valor deve ser `NULL` ou uma string contendo uma lista de um ou mais nomes de conta separados por vírgula. Para mais informações, consulte a [Seção 6.4.5.7, “Audit Log Filtering”](audit-log-filtering.html "6.4.5.7 Audit Log Filtering").

  Modificações em [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) afetam apenas Connections criadas subsequentemente à modificação, e não Connections existentes.

* [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy)

  <table frame="box" rules="all" summary="Propriedades para audit-log"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Note

  Esta variável se aplica apenas ao legacy mode audit log filtering (consulte a [Seção 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering")).

  A política que controla como o `audit log plugin` escreve eventos em seu arquivo de log. A tabela a seguir mostra os valores permitidos.

  <table frame="box" rules="all" summary="Propriedades para audit-log"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) pode ser definida apenas na inicialização do servidor. Em runtime, é uma variável somente leitura. Duas outras System Variables, [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) e [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy), fornecem um controle mais refinado sobre a política de logging e podem ser definidas tanto na inicialização quanto em runtime. Se você usar [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) na inicialização em vez das outras duas variáveis, o servidor usa seu valor para definir essas variáveis. Para mais informações sobre as variáveis de política e sua interação, consulte a [Seção 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").

* [`audit_log_read_buffer_size`](audit-log-reference.html#sysvar_audit_log_read_buffer_size)

  <table frame="box" rules="all" summary="Propriedades para audit-log"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  O Buffer size para leitura do arquivo de audit log, em bytes. A função [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) lê no máximo esta quantidade de bytes. A leitura de arquivo de log é suportada apenas para o formato de log JSON. Para mais informações, consulte a [Seção 6.4.5.6, “Reading Audit Log Files”](audit-log-file-reading.html "6.4.5.6 Reading Audit Log Files").

  A partir do MySQL 5.7.23, esta variável tem um valor padrão de 32KB e pode ser definida em runtime. Cada cliente deve definir seu valor de Session de [`audit_log_read_buffer_size`](audit-log-reference.html#sysvar_audit_log_read_buffer_size) apropriadamente para seu uso de [`audit_log_read()`](audit-log-reference.html#function_audit-log-read). Antes do MySQL 5.7.23, [`audit_log_read_buffer_size`](audit-log-reference.html#sysvar_audit_log_read_buffer_size) tinha um padrão de 1MB, afeta todos os clientes e só podia ser alterada na inicialização do servidor.

* [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size)

  <table frame="box" rules="all" summary="Propriedades para audit-log"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Se [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) for 0, o `audit log plugin` não realiza a rotação automática do arquivo de log baseada em tamanho. Se a rotação for necessária, você deve realizá-la manualmente; consulte [Manual Audit Log File Rotation (Rotação Manual de Arquivo de Audit Log)](audit-log-logging-configuration.html#audit-log-manual-rotation "Manual Audit Log File Rotation").

  Se [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) for maior que 0, ocorre a rotação automática do arquivo de log baseada em tamanho. Sempre que uma escrita no arquivo de log faz com que seu tamanho exceda o valor de [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size), o `audit log plugin` renomeia o arquivo de log atual e abre um novo arquivo de log atual usando o nome original.

  Se você definir [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) para um valor que não é múltiplo de 4096, ele é truncado para o múltiplo mais próximo. Em particular, defini-lo para um valor inferior a 4096 o define como 0 e nenhuma rotação ocorre, exceto manualmente.

  Para mais informações sobre a rotação do arquivo de audit log, consulte [Space Management of Audit Log Files (Gerenciamento de Espaço de Arquivos de Audit Log)](audit-log-logging-configuration.html#audit-log-space-management "Space Management of Audit Log Files").

* [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy)

  <table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1048576</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>4096</code></td> </tr><tr><th>Valor Máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor Máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco (Block Size)</th> <td><code>4096</code></td> </tr></tbody></table>

  Note

  Esta variável se aplica apenas ao legacy mode audit log filtering (consulte a [Seção 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering")).

  A política que controla como o `audit log plugin` escreve eventos de statement em seu arquivo de log. A tabela a seguir mostra os valores permitidos.

  <table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1048576</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>4096</code></td> </tr><tr><th>Valor Máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor Máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco (Block Size)</th> <td><code>4096</code></td> </tr></tbody></table>

  Note

  Na inicialização do servidor (server startup), qualquer valor explícito fornecido para [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy) pode ser substituído se [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) também for especificado, conforme descrito na [Seção 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").

* [`audit_log_strategy`](audit-log-reference.html#sysvar_audit_log_strategy)

  <table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1048576</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>4096</code></td> </tr><tr><th>Valor Máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor Máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco (Block Size)</th> <td><code>4096</code></td> </tr></tbody></table>

  O método de logging usado pelo `audit log plugin`. Estes valores de estratégia são permitidos:

  + `ASYNCHRONOUS`: Loga assincronamente. Espera por espaço no Buffer de saída.

  + `PERFORMANCE`: Loga assincronamente. Descarta (Drop) as solicitações para as quais não há espaço suficiente no Buffer de saída.

  + `SEMISYNCHRONOUS`: Loga sincronamente. Permite caching pelo sistema operacional.

  + `SYNCHRONOUS`: Loga sincronamente. Chama `sync()` após cada solicitação.

##### Variáveis de Status do Audit Log

Se o `audit log plugin` estiver habilitado, ele expõe várias Status Variables que fornecem informações operacionais. Estas variáveis estão disponíveis para legacy mode audit filtering e JSON mode audit filtering.

* [`Audit_log_current_size`](audit-log-reference.html#statvar_Audit_log_current_size)

  O tamanho do arquivo de audit log atual. O valor aumenta quando um evento é escrito no log e é redefinido para 0 quando o log é rotacionado.

* [`Audit_log_event_max_drop_size`](audit-log-reference.html#statvar_Audit_log_event_max_drop_size)

  O tamanho do maior evento descartado no modo performance logging. Para uma descrição dos modos de logging, consulte a [Seção 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").

* [`Audit_log_events`](audit-log-reference.html#statvar_Audit_log_events)

  O número de eventos manipulados pelo `audit log plugin`, independentemente de terem sido escritos no log com base na política de filtering (consulte a [Seção 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics")).

* [`Audit_log_events_filtered`](audit-log-reference.html#statvar_Audit_log_events_filtered)

  O número de eventos manipulados pelo `audit log plugin` que foram filtrados (não escritos no log) com base na política de filtering (consulte a [Seção 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics")).

* [`Audit_log_events_lost`](audit-log-reference.html#statvar_Audit_log_events_lost)

  O número de eventos perdidos no modo performance logging porque um evento era maior do que o espaço disponível no Buffer do audit log. Este valor pode ser útil para avaliar como definir [`audit_log_buffer_size`](audit-log-reference.html#sysvar_audit_log_buffer_size) para dimensionar o Buffer para o modo de performance. Para uma descrição dos modos de logging, consulte a [Seção 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").

* [`Audit_log_events_written`](audit-log-reference.html#statvar_Audit_log_events_written)

  O número de eventos escritos no audit log.

* [`Audit_log_total_size`](audit-log-reference.html#statvar_Audit_log_total_size)

  O tamanho total de eventos escritos em todos os arquivos de audit log. Diferentemente de [`Audit_log_current_size`](audit-log-reference.html#statvar_Audit_log_current_size), o valor de [`Audit_log_total_size`](audit-log-reference.html#statvar_Audit_log_total_size) aumenta mesmo quando o log é rotacionado.

* [`Audit_log_write_waits`](audit-log-reference.html#statvar_Audit_log_write_waits)

  O número de vezes que um evento teve que esperar por espaço no Buffer do audit log no modo asynchronous logging. Para uma descrição dos modos de logging, consulte a [Seção 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").