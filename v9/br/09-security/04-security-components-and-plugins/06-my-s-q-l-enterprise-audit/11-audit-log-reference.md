#### 8.4.6.11 Referência do Log de Auditoria

As seções a seguir fornecem uma referência aos elementos de Auditoria do MySQL Enterprise:

* Tabelas do Log de Auditoria
* Funções do Log de Auditoria
* Referência de Opções e Variáveis do Log de Auditoria
* Opções e Variáveis do Log de Auditoria
* Variáveis de Status do Log de Auditoria

Para instalar as tabelas e funções do log de auditoria, use as instruções fornecidas na Seção 8.4.6.2, “Instalando ou Desinstalando a Auditoria do MySQL Enterprise”. A menos que esses objetos sejam instalados, o plugin `audit_log` opera no modo (desatualizado) legado. Veja a Seção 8.4.6.10, “Filtragem do Log de Auditoria no Modo Legado”.

##### Tabelas do Log de Auditoria

O MySQL Enterprise Audit usa tabelas no banco de dados do sistema `mysql` para armazenamento persistente de dados de filtro e de contas de usuário. As tabelas só podem ser acessadas por usuários que tenham privilégios para esse banco de dados. Para usar um banco de dados diferente, defina a variável de sistema `audit_log_database` na inicialização do servidor. As tabelas usam o mecanismo de armazenamento `InnoDB`.

Se essas tabelas estiverem ausentes, o plugin `audit_log` opera no modo (desatualizado) legado. Veja a Seção 8.4.6.10, “Filtragem do Log de Auditoria no Modo Legado”.

A tabela `audit_log_filter` armazena definições de filtro. A tabela tem essas colunas:

* `NAME`

  O nome do filtro.

* `FILTER`

  A definição de filtro associada ao nome do filtro. As definições são armazenadas como valores `JSON`.

A tabela `audit_log_user` armazena informações de contas de usuário. A tabela tem essas colunas:

* `USER`

  A parte do nome do usuário de uma conta. Para uma conta `user1@localhost`, a parte `USER` é `user1`.

* `HOST`

  A parte do nome do host de uma conta. Para uma conta `user1@localhost`, a parte `HOST` é `localhost`.

* `FILTERNAME`

  O nome do filtro atribuído à conta. O nome do filtro associa a conta a um filtro definido na tabela `audit_log_filter`.

##### Funções do Log de Auditoria

Esta seção descreve, para cada função do log de auditoria, seu propósito, sequência de chamada e valor de retorno. Para informações sobre as condições sob as quais essas funções podem ser invocadas, consulte a Seção 8.4.6.7, “Filtragem do Log de Auditoria”.

Cada função do log de auditoria retorna uma string que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: mensagem` indica falha.

As funções do log de auditoria convertem argumentos de string para `utf8mb4` e os valores de retorno de string são strings `utf8mb4`. Anteriormente, as funções do log de auditoria tratavam argumentos de string como strings binárias (o que significa que não distinguiam maiúsculas e minúsculas), e os valores de retorno de string eram strings binárias.

Se uma função do log de auditoria for invocada dentro do cliente **mysql**, os resultados de string binária são exibidos usando notação hexadecimal, dependendo do valor da `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

Para verificar a instalação das funções do log de auditoria, use este comando:

```
SELECT * FROM performance_schema.user_defined_functions;
```

Para saber mais, consulte a Seção 7.7.2, “Obtendo Informações Sobre Funções Carregáveis”.

Estas funções do log de auditoria estão disponíveis:

* `audit_log_encryption_password_get([keyring_id])`

  Esta função recupera uma senha de criptografia do log de auditoria do conjunto de chaves MySQL, que deve estar habilitada ou ocorrerá um erro. Qualquer componente ou plugin do conjunto de chaves pode ser usado; para instruções, consulte a Seção 8.4.5, “O Conjunto de Chaves MySQL”.

  Sem argumento, a função recupera a senha de criptografia atual como uma string binária. Um argumento pode ser fornecido para especificar qual senha de criptografia do log de auditoria deve ser recuperada. O argumento deve ser o ID do conjunto de chaves da senha atual ou uma senha arquivada.

Para obter informações adicionais sobre a criptografia do log de auditoria, consulte Criptografar arquivos de log de auditoria.

Argumentos:

* `keyring_id`*: Este argumento opcional indica o ID do conjunto de chaves do log de auditoria da senha a ser recuperada. O comprimento máximo permitido é de 766 bytes. Se omitido, a função recupera a senha atual.

Valor de retorno:

A string da senha para sucesso (até 766 bytes) ou `NULL` e um erro para falha.

Exemplo:

Recuperar a senha atual:

```
  mysql> SELECT audit_log_encryption_password_get();
  +-------------------------------------+
  | audit_log_encryption_password_get() |
  +-------------------------------------+
  | secret                              |
  +-------------------------------------+
  ```

Para recuperar uma senha por ID, você pode determinar quais IDs de conjunto de chaves de log de auditoria existem consultando a tabela `keyring_keys` do Schema de Desempenho:

```
  mysql> SELECT KEY_ID FROM performance_schema.keyring_keys
         WHERE KEY_ID LIKE 'audit_log%'
         ORDER BY KEY_ID;
  +-----------------------------+
  | KEY_ID                      |
  +-----------------------------+
  | audit_log-20190415T152248-1 |
  | audit_log-20190415T153507-1 |
  | audit_log-20190416T125122-1 |
  | audit_log-20190416T141608-1 |
  +-----------------------------+
  mysql> SELECT audit_log_encryption_password_get('audit_log-20190416T125122-1');
  +------------------------------------------------------------------+
  | audit_log_encryption_password_get('audit_log-20190416T125122-1') |
  +------------------------------------------------------------------+
  | segreto                                                          |
  +------------------------------------------------------------------+
  ```

* `audit_log_encryption_password_set(password)`

Define a senha atual de criptografia do log de auditoria para o argumento e armazena a senha no conjunto de chaves MySQL. A senha é armazenada como uma string `utf8mb4`. Anteriormente, a senha era armazenada em formato binário.

Se a criptografia estiver habilitada, esta função realiza uma operação de rotação de arquivo de log que renomeia o arquivo de log atual e inicia um novo arquivo de log criptografado com a senha. O conjunto de chaves deve estar habilitado ou ocorrerá um erro. Pode-se usar qualquer componente ou plugin do conjunto de chaves; consulte a Seção 8.4.5, “O Conjunto de Chaves MySQL” para instruções.

Para obter informações adicionais sobre a criptografia do log de auditoria, consulte Criptografar arquivos de log de auditoria.

Argumentos:

* `password`*: A string da senha. O comprimento máximo permitido é de 766 bytes.

Valor de retorno:

1 para sucesso, 0 para falha.

Exemplo:

```
  mysql> SELECT audit_log_encryption_password_set(password);
  +---------------------------------------------+
  | audit_log_encryption_password_set(password) |
  +---------------------------------------------+
  | 1                                           |
  +---------------------------------------------+
  ```

Chamar qualquer uma das outras funções de filtragem afeta imediatamente a filtragem do log de auditoria operacional e atualiza as tabelas do log de auditoria. Se, em vez disso, você modificar o conteúdo dessas tabelas diretamente usando instruções como `INSERT`, `UPDATE` e `DELETE`, as alterações não afetam a filtragem imediatamente. Para descartar suas alterações e torná-las operacionais, chame `audit_log_filter_flush()`.

Aviso

`audit_log_filter_flush()` deve ser usado apenas após modificar as tabelas de auditoria diretamente, para forçar a recarga de todos os filtros. Caso contrário, essa função deve ser evitada. É, na verdade, uma versão simplificada de desmontar e montar novamente o plugin `audit_log` com `UNINSTALL PLUGIN` mais `INSTALL PLUGIN`.

`audit_log_filter_flush()` afeta todas as sessões atuais e as desliga de seus filtros anteriores. As sessões atuais não são mais registradas, a menos que elas desconectem e se reconectem ou executem uma operação de mudança de usuário.

Se essa função falhar, uma mensagem de erro é retornada e o log de auditoria é desativado até a próxima chamada bem-sucedida de `audit_log_filter_flush()`.

Argumentos:

Nenhum.

Valor de retorno:

Uma string que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: mensagem` indica falha.

Exemplo:

```
  mysql> SELECT audit_log_filter_flush();
  +--------------------------+
  | audit_log_filter_flush() |
  +--------------------------+
  | OK                       |
  +--------------------------+
  ```

* `audit_log_filter_remove_filter(filter_name)`

Dado um nome de filtro, remove o filtro do conjunto atual de filtros. Não é um erro se o filtro não existir.

Se um filtro removido for atribuído a quaisquer contas de usuário, esses usuários deixam de ser filtrados (são removidos da tabela `audit_log_user`). A interrupção da filtragem inclui quaisquer sessões atuais para esses usuários: Eles são desligados do filtro e não mais registrados.

Argumentos:

+ *`filter_name`*: Uma string que especifica o nome do filtro.

Valor de retorno:

Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: mensagem` indica falha.

Exemplo:

```
  mysql> SELECT audit_log_filter_remove_filter('SomeFilter');
  +----------------------------------------------+
  | audit_log_filter_remove_filter('SomeFilter') |
  +----------------------------------------------+
  | OK                                           |
  +----------------------------------------------+
  ```

* `audit_log_filter_remove_user(nome_usuario)`

  Dado o nome de uma conta de usuário, faça com que o usuário não seja mais atribuído a um filtro. Não há erro se o usuário não tiver nenhum filtro atribuído. O filtro de sessões atuais para o usuário permanece inalterado. Novas conexões para o usuário são filtradas usando o filtro de conta padrão, se houver, e não são registradas caso contrário.

  Se o nome for `%`, a função remove o filtro de conta padrão que é usado para qualquer conta de usuário que não tenha um filtro atribuído explicitamente.

  Argumentos:

  + *`nome_usuario`*: O nome da conta de usuário como uma cadeia no formato `nome_usuario@nome_host`, ou `%` para representar a conta padrão.

  Valor de retorno:

  Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: mensagem` indica falha.

  Exemplo:

  ```
  mysql> SELECT audit_log_filter_remove_user('user1@localhost');
  +-------------------------------------------------+
  | audit_log_filter_remove_user('user1@localhost') |
  +-------------------------------------------------+
  | OK                                              |
  +-------------------------------------------------+
  ```

* `audit_log_filter_set_filter(nome_filtro, definição)`

  Dado o nome de um filtro e sua definição, adiciona o filtro ao conjunto atual de filtros. Se o filtro já existir e estiver sendo usado por qualquer sessão atual, essas sessões são desacopladas do filtro e não são mais registradas. Isso ocorre porque a nova definição de filtro tem um novo ID de filtro que difere do seu ID anterior.

  Argumentos:

  + *`nome_filtro`*: Uma cadeia que especifica o nome do filtro.

  + *`definição`*: Um valor `JSON` que especifica a definição do filtro.

  Valor de retorno:

  Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: mensagem` indica falha.

  Exemplo:

  ```
  mysql> SET @f = '{ "filter": { "log": false } }';
  mysql> SELECT audit_log_filter_set_filter('SomeFilter', @f);
  +-----------------------------------------------+
  | audit_log_filter_set_filter('SomeFilter', @f) |
  +-----------------------------------------------+
  | OK                                            |
  +-----------------------------------------------+
  ```

* `audit_log_filter_set_user(nome_usuario, nome_filtro)`

Dada uma nome de conta de usuário e um nome de filtro, atribui o filtro ao usuário. Um usuário pode ser atribuído apenas um filtro, portanto, se o usuário já tiver sido atribuído um filtro, a atribuição é substituída. O filtro de sessões atuais para o usuário permanece inalterado. Novas conexões são filtradas usando o novo filtro.

Como caso especial, o nome `%` representa a conta padrão. O filtro é usado para conexões de qualquer conta de usuário que não tenha um filtro atribuído explicitamente.

Argumentos:

+ *`user_name`*: O nome da conta de usuário como uma string no formato `user_name@host_name`, ou `%` para representar a conta padrão.

+ *`filter_name`*: Uma string que especifica o nome do filtro.

Valor de retorno:

Uma string que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

Exemplo:

```
  mysql> SELECT audit_log_filter_set_user('user1@localhost', 'SomeFilter');
  +------------------------------------------------------------+
  | audit_log_filter_set_user('user1@localhost', 'SomeFilter') |
  +------------------------------------------------------------+
  | OK                                                         |
  +------------------------------------------------------------+
  ```

* `audit_log_read([arg])`

Lê o log de auditoria e retorna um resultado em string `JSON`. Se o formato do log de auditoria não for `JSON`, ocorre um erro.

Sem argumento ou com um argumento `JSON` hash, `audit_log_read()` lê eventos do log de auditoria e retorna uma string `JSON` contendo um array de eventos de auditoria. Os itens no argumento hash influenciam como a leitura ocorre, conforme descrito mais adiante. Cada elemento no array retornado é um evento representado como um hash `JSON`, com a exceção de que o último elemento pode ser um valor `JSON` `null` para indicar que não há eventos seguintes disponíveis para leitura.

Com um argumento consistindo de um valor `JSON` `null`, `audit_log_read()` fecha a sequência de leitura atual.

Para obter mais detalhes sobre o processo de leitura de log de auditoria, consulte a Seção 8.4.6.6, “Leitura de Arquivos de Log de Auditoria”.

Argumentos:

Para obter um marcador para o evento mais recentemente escrito, chame `audit_log_read_bookmark()`.

*`arg`*: O argumento é opcional. Se omitido, a função lê eventos a partir da posição atual. Se presente, o argumento pode ser um valor `JSON` `null` para fechar a sequência de leitura ou um hash `JSON`. Dentro de um argumento hash, os itens são opcionais e controlam aspectos da operação de leitura, como a posição em que começar a ler ou quantos eventos ler. Os seguintes itens são significativos (outros itens são ignorados):

  + `start`: A posição dentro do log de auditoria do primeiro evento a ser lido. A posição é dada como um valor de timestamp e a leitura começa a partir do primeiro evento que ocorre no valor do timestamp ou após ele. O item `start` tem este formato, onde *`value`* é um valor literal de timestamp:

    ```
    "start": { "timestamp": "value" }
    ```

  + `timestamp`, `id`: A posição dentro do log de auditoria do primeiro evento a ser lido. Os itens `timestamp` e `id` juntos compõem um marcador que identifica de forma única um evento particular. Se um argumento `audit_log_read()` incluir qualquer um desses itens, ele deve incluir ambos para especificar completamente uma posição ou ocorre um erro.

  + `max_array_length`: O número máximo de eventos a serem lidos do log. Se este item for omitido, o padrão é ler até o final do log ou até que o buffer de leitura esteja cheio, o que ocorrer primeiro.

Para especificar uma posição de início para `audit_log_read()`, passe um argumento hash que inclua o item `start` ou um marcador composto pelos itens `timestamp` e `id`. Se um argumento hash incluir tanto um item `start` quanto um marcador, ocorre um erro.

Se um argumento hash especificar nenhuma posição de início, a leitura continua a partir da posição atual.

Se um valor de timestamp não incluir nenhuma parte de hora, uma parte de hora de `00:00:00` é assumida.

Valor de retorno:

Se a chamada for bem-sucedida, o valor de retorno é uma string `JSON` contendo um array de eventos de auditoria, ou um valor `JSON` `null` se isso foi passado como argumento para fechar a sequência de leitura. Se a chamada falhar, o valor de retorno é `NULL` e ocorre um erro.

Exemplo:

```
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

* `audit_log_read_bookmark()`

Retorna uma string `JSON` representando um marcador para o evento de log de auditoria mais recentemente escrito. Se o formato do log de auditoria não for `JSON`, ocorre um erro.

O marcador é um hash `JSON` com itens `timestamp` e `id` que identificam de forma única a posição de um evento dentro do log de auditoria. É adequado para ser passado ao `audit_log_read()` para indicar a função a qual posição começar a leitura.

Para obter detalhes adicionais sobre o processo de leitura do log de auditoria, consulte a Seção 8.4.6.6, “Leitura de Arquivos de Log de Auditoria”.

Argumentos:

Nenhum.

Valor de retorno:

Uma string `JSON` contendo um marcador para sucesso, ou `NULL` e um erro para falha.

Exemplo:

```
  mysql> SELECT audit_log_read_bookmark();
  +-------------------------------------------------+
  | audit_log_read_bookmark()                       |
  +-------------------------------------------------+
  | { "timestamp": "2019-10-03 21:03:44", "id": 0 } |
  +-------------------------------------------------+
  ```

* `audit_log_rotate()`

Argumentos:

Nenhum.

Valor de retorno:

O nome do arquivo renomeado.

Exemplo:

```
  mysql> SELECT audit_log_rotate();
  ```

A utilização de `audit_log_rotate()` requer o privilégio `AUDIT_ADMIN`.

##### Referência de Opção e Variável de Log de Auditoria

**Tabela 8.44 Referência de Opção e Variável de Log de Auditoria**

<table frame="box" rules="all" summary="Referência para opções de linha de comando do log de auditoria, variáveis de sistema e variáveis de status.">
<tr>
<th>Nome</th>
<th>Cmd-Line</th>
<th>Arquivo de Opção</th>
<th>Var de Sistema</th>
<th>Var de Status</th>
<th>Alcance da Var</th>
<th>Dinâmica</th>
</tr>
<tr>
<th>audit-log</th>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>audit_log_buffer_size</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>audit_log_compression</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>audit_log_connection_policy</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Sim</td>
</tr>
<tr>
<th>audit_log_current_session</th>
<td></td>
<td></td>
<td>Sim</td>
<td></td>
<th>Ambos</th>
<td>Não</td>
</tr>
<tr>
<th>Audit_log_current_size</th>
<td></td>
<td></td>
<td>Sim</td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>audit_log_database</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>Audit_log_direct_writes</th>
<td></td>
<td></td>
<td>Sim</td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>audit_log_disable</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Sim</td>
</tr>
<tr>
<th>audit_log_encryption</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>Audit_log_event_max_drop_size</th>
<td></td>
<td></td>
<td>Sim</td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>Audit_log_events</th>
<td></td>
<td></td>
<td>Sim</td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>Audit_log_events_filtered</th>
<td></td>
<td></td>
<td>Sim</td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>Audit_log_events_lost</th>
<td></td>
<td></td>
<td>Sim</td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>Audit_log_events_written</th>
<td></td>
<td></td>
<td>Sim</td>
<td>Sim</td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>audit_log_exclude_accounts</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Sim</td>
</tr>
<tr>
<th>audit_log_file</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>audit_log_filter_id</th>
<td></td>
<td></td>
<td>Sim</td>
<td></td>
<th>Ambos</th>
<td>Não</td>
</tr>
<tr>
<th>audit_log_flush</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Sim</td>
</tr>
<tr>
<th>audit_log_flush_interval_seconds</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>audit_log_format</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>audit_log_include_accounts</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Sim</td>
</tr>
<tr>
<th>audit_log_max_size</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Sim</td>
</tr>
<tr>
<th>audit_log_password_history_keep_days</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Sim</td>
</tr>
<tr>
<th>audit_log_policy</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>audit_log_prune_seconds</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Sim</td>
</tr>
<tr>
<th>audit_

##### Opções e Variáveis do Registro de Auditoria

Esta seção descreve as opções de comando e as variáveis do sistema que configuram o funcionamento do MySQL Enterprise Audit. Se os valores especificados no momento do início forem incorretos, o plugin `audit_log` pode não ser inicializado corretamente e o servidor não carregá-lo. Nesse caso, o servidor também pode produzir mensagens de erro para outras configurações do log de auditoria porque não as reconhece.

Para configurar a ativação do plugin de log de auditoria, use esta opção:

* `--audit-log[=valor]`

  <table frame="box" rules="all" summary="Propriedades para audit-log"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--audit-log[=valor]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o plugin `audit_log` no início. Está disponível apenas se o plugin tiver sido registrado anteriormente com `INSTALL PLUGIN` ou tiver sido carregado com `--plugin-load` ou `--plugin-load-add`. Veja a Seção 8.4.6.2, “Instalando ou Desinstalando o MySQL Enterprise Audit”.

  O valor da opção deve ser um dos disponíveis para as opções de carregamento de plugins, conforme descrito na Seção 7.6.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--audit-log=FORCE_PLUS_PERMANENT` indica ao servidor que carregue o plugin e impeça sua remoção enquanto o servidor estiver em execução.

Se o plugin do log de auditoria estiver habilitado, ele expõe várias variáveis de sistema que permitem o controle do registro:

```
mysql> SHOW VARIABLES LIKE 'audit_log%';
+--------------------------------------+--------------+
| Variable_name                        | Value        |
+--------------------------------------+--------------+
| audit_log_buffer_size                | 1048576      |
| audit_log_compression                | NONE         |
| audit_log_connection_policy          | ALL          |
| audit_log_current_session            | OFF          |
| audit_log_database                   | mysql        |
| audit_log_disable                    | OFF          |
| audit_log_encryption                 | NONE         |
| audit_log_exclude_accounts           |              |
| audit_log_file                       | audit.log    |
| audit_log_filter_id                  | 0            |
| audit_log_flush                      | OFF          |
| audit_log_flush_interval_seconds     | 0            |
| audit_log_format                     | NEW          |
| audit_log_format_unix_timestamp      | OFF          |
| audit_log_include_accounts           |              |
| audit_log_max_size                   | 0            |
| audit_log_password_history_keep_days | 0            |
| audit_log_policy                     | ALL          |
| audit_log_prune_seconds              | 0            |
| audit_log_read_buffer_size           | 32768        |
| audit_log_rotate_on_size             | 0            |
| audit_log_statement_policy           | ALL          |
| audit_log_strategy                   | ASYNCHRONOUS |
+--------------------------------------+--------------+
```

Você pode definir qualquer uma dessas variáveis no início do servidor e algumas delas no tempo de execução. Aquelas que estão disponíveis apenas para o filtro de log de auditoria no modo legado são destacadas.

* `audit_log_buffer_size`

  <table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1048576</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>4096</code></td> </tr><tr><th>Valor Máximo (Plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor Máximo (Plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr></tbody></table>

Quando o plugin de log de auditoria escreve eventos no log de forma assíncrona, ele usa um buffer para armazenar o conteúdo dos eventos antes de escrevê-los. Essa variável controla o tamanho desse buffer, em bytes. O servidor ajusta o valor para um múltiplo de 4096. O plugin usa um único buffer, que aloca quando inicializa e remove quando termina. O plugin aloca esse buffer apenas se a logagem for assíncrona.

* `audit_log_compression`

  <table frame="box" rules="all" summary="Propriedades para audit_log_compression"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--audit-log-compression=value</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>audit_log_compression</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>NONE</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>NONE</code></p><p><code>GZIP</code></p></td> </tr></tbody></table>

  O tipo de compressão para o arquivo de log de auditoria. Os valores permitidos são `NONE` (sem compressão; o padrão) e `GZIP` (compressão GNU Zip). Para mais informações, consulte Compressão de Arquivos de Log de Auditoria.

* `audit_log_connection_policy`

<table frame="box" rules="all" summary="Propriedades para a política de registro de auditoria_log_connection_policy">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--audit-log-connection-policy=valor</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>audit_log_connection_policy</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>ALL</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p><code>ALL</code></p><p><code>ERRORS</code></p><p><code>NONE</code></p></td>
  </tr>
</table>

  Nota

  Esta variável desatualizada aplica-se apenas ao filtro do registro de auditoria no modo legado (consulte a Seção 8.4.6.10, “Filtro de Registro de Auditoria no Modo Legado”).

  A política que controla como o plugin de registro de auditoria escreve eventos de conexão no seu arquivo de log. A tabela a seguir mostra os valores permitidos.

<table summary="Valores permitidos para a variável audit_log_connection_policy."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>ALL</code></td> <td>Logar todos os eventos de conexão</td> </tr><tr> <td><code>ERRORS</code></td> <td>Logar apenas eventos de conexão falhados</td> </tr><tr> <td><code>NONE</code></td> <td>Não logar eventos de conexão</td> </tr></tbody></table>

  Nota

  No momento do início do servidor, qualquer valor explícito fornecido para `audit_log_connection_policy` pode ser substituído se `audit_log_policy` também for especificado, conforme descrito na Seção 8.4.6.5, “Configurando as Características de Registro de Auditoria”.

* `audit_log_current_session`

  <table frame="box" rules="all" summary="Propriedades para audit_log_current_session"><tbody><tr><th>Variável do Sistema</th> <td><code>audit_log_current_session</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>depends on filtering policy</code></td> </tr></tbody></table>

Se o registro de auditoria está habilitado para a sessão atual. O valor da sessão desta variável é somente leitura. É definido quando a sessão começa com base nos valores das variáveis de sistema `audit_log_include_accounts` e `audit_log_exclude_accounts`. O plugin de log de auditoria usa o valor da sessão para determinar se deve auditar eventos para a sessão. (Há um valor global, mas o plugin não o usa.)

* `audit_log_database`

  <table frame="box" rules="all" summary="Propriedades para audit_log_database"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--audit-log-database=value</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>audit_log_database</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>mysql</code></td> </tr></tbody></table>

  Especifica qual banco de dados o plugin `audit_log` usa para encontrar suas tabelas. Esta variável é somente leitura. Para mais informações, consulte a Seção 8.4.6.2, “Instalando ou Desinstalando MySQL Enterprise Audit”).

* `audit_log_disable`

<table frame="box" rules="all" summary="Propriedades para audit_log_disable">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--audit-log-disable[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>audit_log_disable</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de SET_VAR Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>OFF</code></td>
  </tr>
</table>

Permite desativar o registro de auditoria para todas as sessões de conexão e conectadas. Além do privilégio `SYSTEM_VARIABLES_ADMIN`, para desativar o registro de auditoria, é necessário o privilégio `AUDIT_ADMIN`. Consulte a Seção 8.4.6.9, “Desativar o Registro de Auditoria”.

* `audit_log_encryption`

<table frame="box" rules="all" summary="Propriedades para audit_log_encryption">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--audit-log-encryption=value</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>audit_log_encryption</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Enumeração</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NONE</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p><code>NONE</code></p><p><code>AES</code></p></td>
  </tr>
</table>

  O tipo de criptografia para o arquivo de log de auditoria. Os valores permitidos são `NONE` (sem criptografia; o padrão) e `AES` (criptografia com cifra AES-256-CBC). Para mais informações, consulte Criptografar Arquivos de Log de Auditoria.

* `audit_log_exclude_accounts`

<table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--audit-log[=valor]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Nota

  Esta variável desatualizada aplica-se apenas ao filtro do log de auditoria no modo legado (consulte a Seção 8.4.6.10, “Filtro de Log de Auditoria no Modo Legado”).

  As contas para as quais os eventos não devem ser registrados. O valor deve ser `NULL` ou uma string contendo uma lista de um ou mais nomes de contas separados por vírgula. Para mais informações, consulte a Seção 8.4.6.7, “Filtro de Log de Auditoria”.

  As modificações em `audit_log_exclude_accounts` afetam apenas as conexões criadas após a modificação, e não as conexões existentes.

* `audit_log_file`

<table frame="box" rules="all" summary="Propriedades para o plugin de log de auditoria"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--audit-log[=valor]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  O nome base e o sufixo do arquivo para o qual o plugin de log de auditoria escreve eventos. O valor padrão é `audit.log`, independentemente do formato de registro. Para que o sufixo do nome corresponda ao formato, defina o nome explicitamente, escolhendo um sufixo diferente (por exemplo, `audit.xml` para o formato XML, `audit.json` para o formato JSON).

  Se o valor de `audit_log_file` for um nome de caminho relativo, o plugin interpreta-o em relação ao diretório de dados. Se o valor for um nome de caminho completo, o plugin usa o valor como está. Um nome de caminho completo pode ser útil se for desejável localizar arquivos de auditoria em um sistema de arquivos ou diretório separado. Por razões de segurança, escreva o arquivo de log de auditoria em um diretório acessível apenas ao servidor MySQL e aos usuários com um motivo legítimo para visualizar o log.

  Para obter detalhes sobre como o plugin de log de auditoria interpreta o valor de `audit_log_file` e as regras para renomear arquivos que ocorrem na inicialização e término do plugin, consulte Convenções de Nomenclatura para Arquivos de Log de Auditoria.

O plugin de log de auditoria usa o diretório que contém o arquivo de log de auditoria (determinado pelo valor `audit_log_file`) como a localização para procurar arquivos de log de auditoria legíveis. Esses arquivos de log e o arquivo atual são usados pelo plugin para construir uma lista dos que estão sujeitos ao uso com as funções de marcação e leitura de log de auditoria. Veja a Seção 8.4.6.6, “Leitura de Arquivos de Log de Auditoria”.

* `audit_log_filter_id`

  <table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  O valor da sessão desta variável indica o ID mantido internamente do filtro de auditoria para a sessão atual. Um valor de 0 significa que a sessão não tem nenhum filtro atribuído.

* `audit_log_flush`

<table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--audit-log[=valor]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Nota

  A variável `audit_log_flush` está desatualizada; espera-se que o suporte a ela seja removido em uma versão futura do MySQL. Ela é substituída pela função `audit_log_rotate()`.

  Se `audit_log_rotate_on_size` for 0, a rotação automática do arquivo de log de auditoria é desativada e a rotação ocorre apenas quando realizada manualmente. Nesse caso, habilitar `audit_log_flush` definindo-o para 1 ou `ON` faz com que o plugin de log de auditoria feche e reabra seu arquivo de log para esvaziá-lo. (O valor da variável permanece `OFF` para que você não precise desabilitá-la explicitamente antes de habilitá-la novamente para realizar outra rotação.) Para mais informações, consulte a Seção 8.4.6.5, “Configurando as Características de Registro de Auditoria”.

* `audit_log_flush_interval_seconds`

<table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log[=valor]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

Este sistema depende do componente `scheduler`, que deve ser instalado e habilitado (consulte a Seção 7.5.5, “Componente scheduler”). Para verificar o status do componente:

```
  SHOW VARIABLES LIKE 'component_scheduler%';
  +-----------------------------+-------+
  | Variable_name               | Value |
  +-----------------------------+-------|
  | component_scheduler.enabled | On    |
  +-----------------------------+-------+
  ```

Quando `audit_log_flush_interval_seconds` tem um valor de zero (o padrão), não há atualização automática dos privilégios, mesmo que o componente `scheduler` esteja habilitado (`ON`).

Os valores entre `0` e `60` (1 a 59) não são reconhecidos; em vez disso, esses valores ajustam-se automaticamente para `60` e o servidor emite uma mensagem de aviso. Valores maiores que `60` definem o número de segundos que o componente `scheduler` espera desde a inicialização ou desde o início da execução anterior, até tentar agendar outra execução.

Para persistir esta variável de sistema global no arquivo `mysqld-auto.cnf` sem definir o valor da variável global runtime, antecipe o nome da variável com a palavra-chave `PERSIST_ONLY` ou o qualificador `@@PERSIST_ONLY.`.

* `audit_log_format`

<table frame="box" rules="all" summary="Propriedades para log de auditoria">
  <tr><th>Formato do arquivo de log de auditoria</th> <td><code>--audit-log[=valor]</code></td> </tr>
  <tr><th>Tipo</th> <td>Enumeração</td> </tr>
  <tr><th>Valor padrão</th> <td><code>ON</code></td> </tr>
  <tr><th>Valores válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr>
</table>

* `audit_log_format_timestamp_unix`

Esta variável só se aplica à saída do log de auditoria no formato JSON. Quando estiver ativada, a ativação desta variável faz com que cada registro do arquivo de log inclua um campo `time`. O valor do campo é um inteiro que representa o valor do timestamp UNIX, indicando a data e a hora em que o evento de auditoria foi gerado.

A alteração do valor desta variável em tempo de execução faz com que o arquivo de log seja rotado, de modo que, para um arquivo de log no formato JSON específico, todos os registros no arquivo incluam ou não o campo `time`.

A definição do valor em tempo de execução de `audit_log_format_unix_timestamp` requer o privilégio `AUDIT_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`) normalmente necessário para definir o valor em tempo de execução de uma variável de sistema global.

* `audit_log_include_accounts`

  <table frame="box" rules="all" summary="Propriedades para o filtro do log de auditoria"><tr><th>Formato de Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Observação

  Esta variável desatualizada só se aplica ao filtro do log de auditoria no modo legado (consulte a Seção 8.4.6.10, “Filtro do Log de Auditoria no Modo Legado”).

  As contas para as quais os eventos devem ser registrados. O valor deve ser `NULL` ou uma string contendo uma lista de um ou mais nomes de contas separados por vírgula. Para mais informações, consulte a Seção 8.4.6.7, “Filtro do Log de Auditoria”.

As modificações em `audit_log_include_accounts` afetam apenas as conexões criadas após a modificação, e não as conexões existentes.

* `audit_log_max_size`

  <table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tr><th>Formato de Linha de Comando</th> <td><code>--audit-log[=valor]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></table>

  `audit_log_max_size` diz respeito à poda do arquivo de log de auditoria, que é suportada apenas para arquivos de log no formato JSON. Ele controla a poda com base no tamanho combinado do arquivo de log:

  + Um valor de 0 (o padrão) desativa a poda baseada no tamanho. Não há limite de tamanho aplicado.

  + Um valor maior que 0 habilita a poda baseada no tamanho. O valor é o tamanho combinado acima do qual os arquivos de log de auditoria passam a ser objeto de poda.

  Se você definir `audit_log_max_size` para um valor que não é um múltiplo de 4096, ele é truncado para o próximo múltiplo. Em particular, definindo-o para um valor menor que 4096, ele é definido para 0 e não ocorre poda baseada no tamanho.

Se tanto `audit_log_max_size` quanto `audit_log_rotate_on_size` forem maiores que 0, `audit_log_max_size` deve ser maior que 7 vezes o valor de `audit_log_rotate_on_size`. Caso contrário, uma mensagem de aviso é escrita no log de erro do servidor porque, neste caso, a "granularidade" da poda baseada em tamanho pode ser insuficiente para impedir a remoção de todos ou a maioria dos arquivos de log rotados cada vez que isso ocorre.

Nota

Definir `audit_log_max_size` isoladamente não é suficiente para fazer com que a poda de arquivos de log ocorra, porque o algoritmo de poda usa `audit_log_rotate_on_size`, `audit_log_max_size` e `audit_log_prune_seconds` em conjunto. Para mais detalhes, consulte Gerenciamento de Espaço de Arquivos de Log de Auditoria.

* `audit_log_password_history_keep_days`

  <table frame="box" rules="all" summary="Propriedades para o plugin de log de auditoria"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  O plugin de log de auditoria implementa a criptografia de arquivos de log usando senhas de criptografia armazenadas no chaveiro MySQL (consulte Criptografar Arquivos de Log de Auditoria). O plugin também implementa o histórico de senhas, que inclui arquivamento e expiração de senhas (remoção).

Quando o plugin de log de auditoria cria uma nova senha de criptografia, ele arquiviza a senha anterior, se existir, para uso posterior. A variável `audit_log_password_history_keep_days` controla a remoção automática de senhas arquivadas expiradas. Seu valor indica o número de dias após o qual as senhas de criptografia do log de auditoria arquivadas são removidas. O valor padrão de 0 desabilita a expiração da senha: o período de retenção da senha é para sempre.

Novas senhas de criptografia do log de auditoria são criadas nessas circunstâncias:

+ Durante a inicialização do plugin, se o plugin encontrar que a criptografia do arquivo de log está habilitada, ele verifica se o chaveiro contém uma senha de criptografia do log de auditoria. Se não, o plugin gera automaticamente uma senha de criptografia inicial aleatória.

+ Quando a função `audit_log_encryption_password_set()` é chamada para definir uma senha específica.

Em cada caso, o plugin armazena a nova senha no chaveiro e a usa para criptografar novos arquivos de log.

A remoção de senhas de criptografia do log de auditoria expiradas ocorre nessas circunstâncias:

+ Durante a inicialização do plugin.
+ Quando a função `audit_log_encryption_password_set()` é chamada.
+ Quando o valor de tempo de execução de `audit_log_password_history_keep_days` é alterado de seu valor atual para um valor maior que 0. As alterações de valor de tempo de execução ocorrem para as instruções `SET` que usam a palavra-chave `GLOBAL` ou `PERSIST`, mas não a palavra-chave `PERSIST_ONLY`. `PERSIST_ONLY` escreve a configuração da variável em `mysqld-auto.cnf`, mas não tem efeito no valor de tempo de execução.

Quando a remoção da senha ocorre, o valor atual de `audit_log_password_history_keep_days` determina quais senhas serão removidas:

+ Se o valor for 0, o plugin não remove senhas.
+ Se o valor for *`N`* > 0, o plugin remove senhas com mais de *`N`* dias de idade.

Nota

Tenha cuidado para não expirar senhas antigas que ainda são necessárias para ler arquivos de registro criptografados arquivados.

Se você normalmente deixar a expiração de senhas desativada (ou seja, `audit_log_password_history_keep_days` tem um valor de 0), é possível realizar uma operação de limpeza sob demanda, atribuindo temporariamente à variável um valor maior que zero. Por exemplo, para expirar senhas mais antigas que 365 dias, faça o seguinte:

```
  SET GLOBAL audit_log_password_history_keep_days = 365;
  SET GLOBAL audit_log_password_history_keep_days = 0;
  ```

Definir o valor de tempo de execução de `audit_log_password_history_keep_days` requer o privilégio `AUDIT_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio `SUPER`, que está sendo descontinuado) normalmente necessário para definir o valor de tempo de execução de uma variável de sistema global.

* `audit_log_policy`

<table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--audit-log-buffer-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>audit_log_buffer_size</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>1048576</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>4096</code></td>
  </tr>
  <tr>
    <th>Valor Máximo (Plataformas de 64 bits)</th>
    <td><code>18446744073709547520</code></td>
  </tr>
  <tr>
    <th>Valor Máximo (Plataformas de 32 bits)</th>
    <td><code>4294967295</code></td>
  </tr>
  <tr>
    <th>Unidade</th>
    <td>bytes</td>
  </tr>
  <tr>
    <th>Tamanho do Bloco</th>
    <td><code>4096</code></td>
  </tr>
  <tr>
    <th>Nota</th>
  </tr>
</table>

  Nota

  Esta variável desatualizada aplica-se apenas ao filtro de log de auditoria no modo legado (consulte a Seção 8.4.6.10, “Filtro de Log de Auditoria no Modo Legado”).

  A política que controla como o plugin de auditoria escreve eventos em seu arquivo de log. A tabela a seguir mostra os valores permitidos.

<table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size">
<tr><th>Formato de Linha de Comando</th> <td><code>--audit-log-buffer-size=#</code></td> </tr>
<tr><th>Variável do Sistema</th> <td><code>audit_log_buffer_size</code></td> </tr>
<tr><th>Alcance</th> <td>Global</td> </tr>
<tr><th>Dinâmico</th> <td>Não</td> </tr>
<tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
<tr><th>Tipo</th> <td>Inteiro</td> </tr>
<tr><th>Valor Padrão</th> <td><code>1048576</code></td> </tr>
<tr><th>Valor Mínimo</th> <td><code>4096</code></td> </tr>
<tr><th>Valor Máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr>
<tr><th>Valor Máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr>
<tr><th>Unidade</th> <td>bytes</td> </tr>
<tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr>
</table>

`audit_log_policy` pode ser definido apenas no início da inicialização do servidor. Em tempo de execução, é uma variável de leitura somente. Outras duas variáveis do sistema, `audit_log_connection_policy` e `audit_log_statement_policy`, fornecem um controle mais fino sobre a política de registro e podem ser definidas no início ou em tempo de execução. Se você usar `audit_log_policy` no início em vez das outras duas variáveis, o servidor usa seu valor para definir essas variáveis. Para mais informações sobre as variáveis de política e sua interação, consulte a Seção 8.4.6.5, “Configurando as Características de Registro de Auditoria”.

* `audit_log_prune_seconds`

<table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--audit-log-buffer-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>audit_log_buffer_size</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de SET_VAR Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>1048576</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>4096</code></td>
  </tr>
  <tr>
    <th>Valor Máximo (Plataformas de 64 bits)</th>
    <td><code>18446744073709547520</code></td>
  </tr>
  <tr>
    <th>Valor Máximo (Plataformas de 32 bits)</th>
    <td><code>4294967295</code></td>
  </tr>
  <tr>
    <th>Unidade</th>
    <td>bytes</td>
  </tr>
  <tr>
    <th>Tamanho do Bloco</th>
    <td><code>4096</code></td>
  </tr>
</table>

`audit_log_prune_seconds` diz respeito à poda do arquivo de log de auditoria, que é suportada apenas para arquivos de log no formato JSON. Ele controla a poda com base na idade do arquivo de log:

+ Um valor de 0 (o padrão) desativa a poda baseada na idade. Não há limite de idade aplicado.

+ Um valor maior que 0 habilita a poda baseada na idade. O valor é o número de segundos após os quais os arquivos de log de auditoria passam a ser objeto de poda.

Nota

Definir `audit_log_prune_seconds` por si só não é suficiente para fazer com que o corte de arquivos de log ocorra, pois o algoritmo de corte usa `audit_log_rotate_on_size`, `audit_log_max_size` e `audit_log_prune_seconds` em conjunto. Para obter detalhes, consulte Gerenciamento de Espaço de Arquivos de Log de Auditoria.

* `audit_log_read_buffer_size`

  <table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size"><tr><th>Formato de Linha de Comando</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1048576</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>4096</code></td> </tr><tr><th>Valor Máximo (Plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor Máximo (Plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr></table>

O tamanho do buffer para leitura do arquivo de log de auditoria, em bytes. A função `audit_log_read()` não lê mais do que esse número de bytes. A leitura de arquivos de log é suportada apenas para o formato de log JSON. Para mais informações, consulte a Seção 8.4.6.6, “Leitura de Arquivos de Log de Auditoria”.

Esta variável tem um valor padrão de 32 KB e pode ser definida em tempo de execução. Cada cliente deve definir o valor de sessão `audit_log_read_buffer_size` apropriadamente para seu uso da função `audit_log_read()`.

* `audit_log_rotate_on_size`

  <table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1048576</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>4096</code></td> </tr><tr><th>Valor Máximo (Plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor Máximo (Plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do Bloco</th> <td><code>4096</code></td> </tr></table>

Se `audit_log_rotate_on_size` for 0, o plugin de log de auditoria não realiza a rotação automática de arquivos de log baseada em tamanho. Se a rotação ocorrer, você deve realizá-la manualmente; consulte Rotação Manual de Arquivos de Log de Auditoria.

Se `audit_log_rotate_on_size` for maior que 0, a rotação automática de arquivos de log baseada em tamanho ocorre. Sempre que uma escrita no arquivo de log faz com que seu tamanho exceda o valor de `audit_log_rotate_on_size`, o plugin de log de auditoria renomeia o arquivo de log atual e abre um novo arquivo de log atual usando o nome original.

Se você definir `audit_log_rotate_on_size` para um valor que não seja um múltiplo de 4096, ele será truncado para o próximo múltiplo. Especificamente, definindo-o para um valor menor que 4096, ele é definido para 0 e nenhuma rotação ocorre, exceto manualmente.

Nota

`audit_log_rotate_on_size` controla se a rotação de arquivos de log de auditoria ocorre. Também pode ser usado em conjunto com `audit_log_max_size` e `audit_log_prune_seconds` para configurar a poda de arquivos de log em formato JSON rotados. Para detalhes, consulte Gerenciamento de Espaço de Arquivos de Log de Auditoria.

* `audit_log_statement_policy`

<table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--audit-log-buffer-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>audit_log_buffer_size</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>1048576</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>4096</code></td>
  </tr>
  <tr>
    <th>Valor Máximo (Plataformas de 64 bits)</th>
    <td><code>18446744073709547520</code></td>
  </tr>
  <tr>
    <th>Valor Máximo (Plataformas de 32 bits)</th>
    <td><code>4294967295</code></td>
  </tr>
  <tr>
    <th>Unidade</th>
    <td>bytes</td>
  </tr>
  <tr>
    <th>Tamanho do Bloco</th>
    <td><code>4096</code></td>
  </tr>
</table>

  Nota

  Esta variável desatualizada aplica-se apenas ao filtro de log de auditoria no modo legado (consulte a Seção 8.4.6.10, “Filtro de Log de Auditoria no Modo Legado”).

  A política que controla como o plugin de log de auditoria escreve eventos de declaração no seu arquivo de log. A tabela a seguir mostra os valores permitidos.

<table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--audit-log-buffer-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>audit_log_buffer_size</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>1048576</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>4096</code></td>
  </tr>
  <tr>
    <th>Valor Máximo (Plataformas de 64 bits)</th>
    <td><code>18446744073709547520</code></td>
  </tr>
  <tr>
    <th>Valor Máximo (Plataformas de 32 bits)</th>
    <td><code>4294967295</code></td>
  </tr>
  <tr>
    <th>Unidade</th>
    <td>bytes</td>
  </tr>
  <tr>
    <th>Tamanho do Bloco</th>
    <td><code>4096</code></td>
  </tr>
  <tr>
    <th>Tamanho do Bloco</th>
  </tr>
</table>

  Nota

  No momento do início do servidor, qualquer valor explícito fornecido para `audit_log_statement_policy` pode ser sobrescrito se `audit_log_policy` também for especificado, conforme descrito na Seção 8.4.6.5, “Configurando Características de Registro de Auditoria”.

* `audit_log_strategy`

<table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--audit-log-buffer-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>audit_log_buffer_size</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>1048576</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>4096</code></td>
  </tr>
  <tr>
    <th>Valor Máximo (Plataformas de 64 bits)</th>
    <td><code>18446744073709547520</code></td>
  </tr>
  <tr>
    <th>Valor Máximo (Plataformas de 32 bits)</th>
    <td><code>4294967295</code></td>
  </tr>
  <tr>
    <th>Unidade</th>
    <td>bytes</td>
  </tr>
  <tr>
    <th>Tamanho do Bloco</th>
    <td><code>4096</code></td>
  </tr>
</table>

  O método de registro utilizado pelo plugin de log de auditoria. Esses valores de estratégia são permitidos:

  + `ASYNCHRONOUS`: Registre assincronicamente. Aguarde espaço no buffer de saída.

  + `PERFORMANCE`: Registre assincronicamente. Descarte solicitações para as quais não há espaço suficiente no buffer de saída.

  + `SEMISYNCHRONOUS`: Registre sincronamente. Permita o cache pelo sistema operacional.

  + `SYNCHRONOUS`: Registre sincronamente. Chame `sync()` após cada solicitação.

##### Variáveis de Status do Log de Auditoria

Se o plugin de log de auditoria estiver habilitado, ele expõe várias variáveis de status que fornecem informações operacionais. Essas variáveis estão disponíveis para o filtro de auditoria no modo legado (desatualizado) e o filtro de auditoria no modo JSON.

* `Audit_log_current_size`

  O tamanho do arquivo de log de auditoria atual. O valor aumenta quando um evento é escrito no log e é redefinido para 0 quando o log é rotado.

* `Audit_log_direct_writes`

  Quando o plugin de log de auditoria escreve eventos no log de auditoria no formato JSON, ele usa um buffer para armazenar o conteúdo do evento antes de escrevê-lo. Se o comprimento da consulta for maior que o tamanho do buffer, o plugin escreve o evento diretamente no log, ignorando o buffer. Esta variável mostra o número de escritas diretas. O plugin determina a contagem com base na estratégia de escrita atual em uso (veja `audit_log_strategy`).

**Tabela 8.45 Efeito da Estratégia de Escrita na Contagem de Escrita Direta**

<table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--audit-log-buffer-size=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>audit_log_buffer_size</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>1048576</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>4096</code></td>
  </tr>
  <tr>
    <th>Valor Máximo (Plataformas de 64 bits)</th>
    <td><code>18446744073709547520</code></td>
  </tr>
  <tr>
    <th>Valor Máximo (Plataformas de 32 bits)</th>
    <td><code>4294967295</code></td>
  </tr>
  <tr>
    <th>Unidade</th>
    <td>bytes</td>
  </tr>
  <tr>
    <th>Tamanho do Bloco</th>
    <td><code>4096</code></td>
  </tr>
</table>

* `Audit_log_event_max_drop_size`

  O tamanho do evento mais grande descartado no modo de registro de desempenho. Para uma descrição dos modos de registro, consulte a Seção 8.4.6.5, “Configurando Características de Registro de Auditoria”.

* `Audit_log_events`

  O número de eventos tratados pelo plugin de registro de auditoria, independentemente de terem sido escritos no log com base na política de filtragem (consulte a Seção 8.4.6.5, “Configurando Características de Registro de Auditoria”).

* `Audit_log_events_filtered`

O número de eventos tratados pelo plugin de log de auditoria que foram filtrados (não escritos no log) com base na política de filtragem (consulte a Seção 8.4.6.5, “Configurando Características de Registro de Auditoria”).

* `Audit_log_events_perdidos`

  O número de eventos perdidos no modo de registro de desempenho porque um evento era maior que o espaço de buffer do log de auditoria disponível. Esse valor pode ser útil para avaliar como configurar `audit_log_buffer_size` para dimensionar o buffer para o modo de desempenho. Para uma descrição dos modos de registro, consulte a Seção 8.4.6.5, “Configurando Características de Registro de Auditoria”.

* `Audit_log_events_escritos`

  O número de eventos escritos no log de auditoria.

* `Audit_log_tamanho_total`

  O tamanho total dos eventos escritos em todos os arquivos de log de auditoria. Ao contrário de `Audit_log_tamanho_atual`, o valor de `Audit_log_tamanho_total` aumenta mesmo quando o log é rotado.

* `Audit_log_esperas_de_escrita`

  O número de vezes que um evento teve que esperar por espaço no buffer de log de auditoria no modo de registro assíncrono. Para uma descrição dos modos de registro, consulte a Seção 8.4.6.5, “Configurando Características de Registro de Auditoria”.