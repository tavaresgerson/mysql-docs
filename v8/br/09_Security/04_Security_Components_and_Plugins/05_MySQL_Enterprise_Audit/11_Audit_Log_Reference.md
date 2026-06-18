#### 8.4.5.11 Referência do Log de Auditoria

As seções a seguir fornecem uma referência aos elementos de auditoria do MySQL Enterprise:

- Tabelas de registro de auditoria
- Funções do Log de Auditoria
- Opção de Registro de Auditoria e Referência de Variável
- Opções e variáveis do registro de auditoria
- Variáveis de Status do Registro de Auditoria

Para instalar as tabelas e funções do log de auditoria, use as instruções fornecidas na Seção 8.4.5.2, “Instalando ou Desinstalando o Auditoria MySQL Enterprise”. A menos que esses objetos sejam instalados, o plugin `audit_log` opera no modo legado (desatualizado no MySQL 8.0.34). Veja a Seção 8.4.5.10, “Filtragem do Log de Auditoria no Modo Legado”.

##### Tabelas de registro de auditoria

O MySQL Enterprise Audit utiliza tabelas no banco de dados do sistema `mysql` para armazenamento persistente de dados de filtro e contas de usuário. As tabelas só podem ser acessadas por usuários que tenham privilégios para esse banco de dados. Para usar um banco de dados diferente, defina a variável de sistema `audit_log_database` na inicialização do servidor. As tabelas usam o mecanismo de armazenamento `InnoDB`.

Se essas tabelas estiverem ausentes, o plugin `audit_log` opera no modo (desatualizado) legado. Veja a Seção 8.4.5.10, “Filtragem do Log de Auditoria no Modo Legado”.

A tabela `audit_log_filter` armazena definições de filtros. A tabela tem as seguintes colunas:

- `NAME`

  O nome do filtro.

- `FILTER`

  A definição do filtro associada ao nome do filtro. As definições são armazenadas como valores `JSON`.

A tabela `audit_log_user` armazena informações da conta do usuário. A tabela tem as seguintes colunas:

- `USER`

  A parte do nome de usuário de uma conta. Para uma conta `user1@localhost`, a parte `USER` é `user1`.

- `HOST`

  A parte do nome do host de uma conta. Para uma conta `user1@localhost`, a parte `HOST` é `localhost`.

- `FILTERNAME`

  O nome do filtro atribuído à conta. O nome do filtro associa a conta a um filtro definido na tabela `audit_log_filter`.

##### Funções do Log de Auditoria

Esta seção descreve, para cada função do log de auditoria, seu propósito, sequência de chamadas e valor de retorno. Para informações sobre as condições sob as quais essas funções podem ser invocadas, consulte a Seção 8.4.5.7, “Filtragem do Log de Auditoria”.

Cada função de registro de auditoria retorna uma string que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

A partir do MySQL 8.0.19, as funções de log de auditoria convertem argumentos de string em `utf8mb4` e os valores de retorno de string são strings `utf8mb4`. Antes do MySQL 8.0.19, as funções de log de auditoria tratam argumentos de string como strings binárias (o que significa que elas não distinguem maiúsculas e minúsculas), e os valores de retorno de string são strings binárias.

Se uma função de registro de auditoria for invocada dentro do cliente **mysql**, os resultados em cadeia binária são exibidos usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

Para verificar a instalação das funções do log de auditoria, use este comando:

```
SELECT * FROM performance_schema.user_defined_functions;
```

Para saber mais, consulte a Seção 7.7.2, “Obtendo Informações sobre Funções Carregáveis”.

Estas funções do log de auditoria estão disponíveis:

- `audit_log_encryption_password_get([keyring_id])`

  Essa função obtém uma senha de criptografia de log de auditoria do conjunto de chaves MySQL, que deve estar habilitada ou ocorrerá um erro. Qualquer componente ou plugin do conjunto de chaves pode ser usado; para instruções, consulte a Seção 8.4.4, “O Conjunto de Chaves MySQL”.

  Sem argumento, a função recupera a senha de criptografia atual como uma string binária. Um argumento pode ser fornecido para especificar qual senha de criptografia do log de auditoria será recuperada. O argumento deve ser o ID do chaveiro da senha atual ou uma senha arquivada.

  Para obter informações adicionais sobre a criptografia do log de auditoria, consulte Criptografar arquivos de log de auditoria.

  Argumentos:

  `keyring_id`: A partir do MySQL 8.0.17, este argumento opcional indica o ID do conjunto de chaves da senha a ser recuperada. O comprimento máximo permitido é de 766 bytes. Se omitido, a função recupera a senha atual.

  Antes do MySQL 8.0.17, nenhum argumento é permitido. A função sempre recupera a senha atual.

  Valor de retorno:

  A string de senha para sucesso (até 766 bytes), ou `NULL` e um erro para falha.

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

  Para recuperar uma senha por ID, você pode determinar quais IDs de chave de registro de log de auditoria existem consultando a tabela do Schema de Desempenho `keyring_keys`:

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

- `audit_log_encryption_password_set(password)`

  Define a senha de criptografia do log de auditoria atual como o argumento e armazena a senha no conjunto de chaves do MySQL. A partir do MySQL 8.0.19, a senha é armazenada como uma string `utf8mb4`. Antes do MySQL 8.0.19, a senha é armazenada em formato binário.

  Se a criptografia estiver habilitada, essa função executa uma operação de rotação de arquivo de registro que renomeia o arquivo de registro atual e inicia um novo arquivo de registro criptografado com a senha. O conjunto de chaves deve estar habilitado ou ocorrerá um erro. Qualquer componente ou plugin do conjunto de chaves pode ser usado; consulte a Seção 8.4.4, “O Conjunto de Chaves MySQL”, para obter instruções.

  Para obter informações adicionais sobre a criptografia do log de auditoria, consulte Criptografar arquivos de log de auditoria.

  Argumentos:

  `password`: A string da senha. O comprimento máximo permitido é de 766 bytes.

  Valor de retorno:

  1 para o sucesso, 0 para o fracasso.

  Exemplo:

  ```
  mysql> SELECT audit_log_encryption_password_set(password);
  +---------------------------------------------+
  | audit_log_encryption_password_set(password) |
  +---------------------------------------------+
  | 1                                           |
  +---------------------------------------------+
  ```

- `audit_log_filter_flush()`

  Chamar qualquer uma das outras funções de filtragem afeta imediatamente a filtragem do log de auditoria operacional e atualiza as tabelas do log de auditoria. Se, em vez disso, você modificar o conteúdo dessas tabelas diretamente usando instruções como `INSERT`, `UPDATE` e `DELETE`, as alterações não afetam a filtragem imediatamente. Para descartar suas alterações e torná-las operacionais, chame `audit_log_filter_flush()`.

  Aviso

  `audit_log_filter_flush()` deve ser usado apenas após modificar as tabelas de auditoria diretamente, para forçar a recarga de todos os filtros. Caso contrário, essa função deve ser evitada. É, na verdade, uma versão simplificada de descarregar e recarregar o plugin `audit_log` com `UNINSTALL PLUGIN` mais `INSTALL PLUGIN`.

  `audit_log_filter_flush()` afeta todas as sessões atuais e as desliga de seus filtros anteriores. As sessões atuais não são mais registradas, a menos que elas desconectem e se reconectem ou executem uma operação de mudança de usuário.

  Se essa função falhar, uma mensagem de erro é retornada e o registro de auditoria é desativado até a próxima chamada bem-sucedida para `audit_log_filter_flush()`.

  Argumentos:

  None.

  Valor de retorno:

  Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

  Exemplo:

  ```
  mysql> SELECT audit_log_filter_flush();
  +--------------------------+
  | audit_log_filter_flush() |
  +--------------------------+
  | OK                       |
  +--------------------------+
  ```

- `audit_log_filter_remove_filter(filter_name)`

  Dada um nome de filtro, remove o filtro do conjunto atual de filtros. Não é um erro se o filtro não existir.

  Se um filtro removido for atribuído a quaisquer contas de usuário, esses usuários deixam de ser filtrados (são removidos da tabela `audit_log_user`). A interrupção do filtro inclui todas as sessões atuais desses usuários: eles são desconectados do filtro e não mais registrados.

  Argumentos:

  - `filter_name`: Uma string que especifica o nome do filtro.

  Valor de retorno:

  Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

  Exemplo:

  ```
  mysql> SELECT audit_log_filter_remove_filter('SomeFilter');
  +----------------------------------------------+
  | audit_log_filter_remove_filter('SomeFilter') |
  +----------------------------------------------+
  | OK                                           |
  +----------------------------------------------+
  ```

- `audit_log_filter_remove_user(user_name)`

  Dada um nome de conta de usuário, faça com que o usuário não seja mais atribuído a um filtro. Não há erro se o usuário não tiver nenhum filtro atribuído. O filtro de sessões atuais para o usuário permanece inalterado. Novas conexões para o usuário são filtradas usando o filtro de conta padrão, se houver, e não são registradas caso contrário.

  Se o nome for `%`, a função remove o filtro de conta padrão que é usado para qualquer conta de usuário que não tenha um filtro atribuído explicitamente.

  Argumentos:

  - `user_name`: O nome da conta do usuário como uma string no formato `user_name@host_name` ou `%` para representar a conta padrão.

  Valor de retorno:

  Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

  Exemplo:

  ```
  mysql> SELECT audit_log_filter_remove_user('user1@localhost');
  +-------------------------------------------------+
  | audit_log_filter_remove_user('user1@localhost') |
  +-------------------------------------------------+
  | OK                                              |
  +-------------------------------------------------+
  ```

- `audit_log_filter_set_filter(filter_name, definition)`

  Dada um nome e uma definição de filtro, adiciona o filtro ao conjunto atual de filtros. Se o filtro já existir e estiver sendo usado por alguma sessão atual, essas sessões são desconectadas do filtro e deixam de ser registradas. Isso ocorre porque a nova definição de filtro tem um novo ID de filtro que difere do seu ID anterior.

  Argumentos:

  - `filter_name`: Uma string que especifica o nome do filtro.

  - `definition`: Um valor `JSON` que especifica a definição do filtro.

  Valor de retorno:

  Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

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

- `audit_log_filter_set_user(user_name, filter_name)`

  Dada uma nome de conta de usuário e um nome de filtro, atribui o filtro ao usuário. Um usuário pode ser atribuído apenas um filtro, portanto, se o usuário já tiver sido atribuído um filtro, a atribuição é substituída. A filtragem de sessões atuais para o usuário permanece inalterada. Novas conexões são filtradas usando o novo filtro.

  Como caso especial, o nome `%` representa a conta padrão. O filtro é usado para conexões de qualquer conta de usuário que não tenha um filtro atribuído explicitamente.

  Argumentos:

  - `user_name`: O nome da conta do usuário como uma string no formato `user_name@host_name` ou `%` para representar a conta padrão.

  - `filter_name`: Uma string que especifica o nome do filtro.

  Valor de retorno:

  Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

  Exemplo:

  ```
  mysql> SELECT audit_log_filter_set_user('user1@localhost', 'SomeFilter');
  +------------------------------------------------------------+
  | audit_log_filter_set_user('user1@localhost', 'SomeFilter') |
  +------------------------------------------------------------+
  | OK                                                         |
  +------------------------------------------------------------+
  ```

- `audit_log_read([arg])`

  Leitura do log de auditoria e retorno de um resultado da string `JSON`. Se o formato do log de auditoria não for `JSON`, ocorrerá um erro.

  Sem argumento ou argumento de hash `JSON`, o `audit_log_read()` lê eventos do log de auditoria e retorna uma string `JSON` contendo um array de eventos de auditoria. Os itens do argumento de hash influenciam como a leitura ocorre, conforme descrito mais adiante. Cada elemento no array retornado é um evento representado como um hash `JSON`, com a exceção de que o último elemento pode ser um valor `JSON` `null` para indicar que não há eventos seguintes disponíveis para leitura.

  Com um argumento que consiste em um valor `JSON` `null`, `audit_log_read()` fecha a sequência de leitura atual.

  Para obter informações adicionais sobre o processo de leitura do log de auditoria, consulte a Seção 8.4.5.6, “Leitura de arquivos de log de auditoria”.

  Argumentos:

  Para obter um marcador para o evento mais recentemente escrito, ligue para `audit_log_read_bookmark()`.

  `arg`: O argumento é opcional. Se omitido, a função lê eventos a partir da posição atual. Se presente, o argumento pode ser um valor `JSON` `null` para fechar a sequência de leitura, ou um hash `JSON`. Dentro de um argumento de hash, os itens são opcionais e controlam aspectos da operação de leitura, como a posição em que começar a ler ou quantos eventos ler. Os seguintes itens são significativos (outros itens são ignorados):

  - `start`: A posição dentro do log de auditoria do primeiro evento a ser lido. A posição é fornecida como um timestamp e a leitura começa a partir do primeiro evento que ocorre no valor do timestamp ou após ele. O item `start` tem este formato, onde `value` é um valor literal de timestamp:

    ```
    "start": { "timestamp": "value" }
    ```

    O item `start` é permitido a partir do MySQL 8.0.22.

  - `timestamp`, `id`: A posição dentro do log de auditoria do primeiro evento a ser lido. Os itens `timestamp` e `id` juntos compõem um marcador que identifica de forma única um evento específico. Se um argumento `audit_log_read()` incluir qualquer um desses itens, ele deve incluir ambos para especificar completamente uma posição ou ocorrerá um erro.

  - `max_array_length`: O número máximo de eventos para ler do log. Se este item for omitido, o padrão é ler até o final do log ou até que o buffer de leitura esteja cheio, o que ocorrer primeiro.

  Para especificar uma posição inicial para `audit_log_read()`, passe um argumento de hash que inclua um item `start` ou um marcador composto por itens `timestamp` e `id`. Se um argumento de hash incluir tanto um item `start` quanto um marcador, ocorrerá um erro.

  Se um argumento hash não especificar uma posição inicial, a leitura continua a partir da posição atual.

  Se um valor de marcação de tempo não incluir nenhuma parte de hora, uma parte de hora de `00:00:00` é assumida.

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

  Notas:

  Antes do MySQL 8.0.19, os valores de retorno de strings são strings binárias `JSON`. Para obter informações sobre a conversão desses valores em strings não binárias, consulte a Seção 8.4.5.6, “Leitura de arquivos de registro de auditoria”.

- `audit_log_read_bookmark()`

  Retorna uma string `JSON` que representa um marcador para o evento de registro de auditoria mais recentemente escrito. Se o formato do registro de auditoria não for `JSON`, ocorrerá um erro.

  O marcador é um hash `JSON` com os itens `timestamp` e `id` que identificam de forma única a posição de um evento dentro do log de auditoria. É adequado para ser passado para `audit_log_read()` para indicar àquela função a posição em que deve começar a leitura.

  Para obter informações adicionais sobre o processo de leitura do log de auditoria, consulte a Seção 8.4.5.6, “Leitura de arquivos de log de auditoria”.

  Argumentos:

  None.

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

  Notas:

  Antes do MySQL 8.0.19, os valores de retorno de strings são strings binárias `JSON`. Para obter informações sobre a conversão desses valores em strings não binárias, consulte a Seção 8.4.5.6, “Leitura de arquivos de registro de auditoria”.

- `audit_log_rotate()`

  Argumentos:

  None.

  Valor de retorno:

  O nome do arquivo renomeado.

  Exemplo:

  ```
  mysql> SELECT audit_log_rotate();
  ```

  Para usar `audit_log_rotate()`, é necessário o privilégio `AUDIT_ADMIN`.

##### Opção de Registro de Auditoria e Referência de Variável

**Tabela 8.44 Opção de Log de Auditoria e Referência de Variável**

<table summary="Referência para opções de linha de comando do log de auditoria, variáveis de sistema e variáveis de status."><thead><tr><th scope="col">Nome</th> <th scope="col">Linha de comando</th> <th scope="col">Arquivo de Opções</th> <th scope="col">Sistema Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dinâmico</th> </tr></thead><tbody><tr><th>registro de auditoria</th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>buffer_de_registro_de_auditoria</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>audit_log_compression</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>política_de_conexão_do_registro_de_auditoria</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>audit_log_sessão_atual</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Não</td> </tr><tr><th>log_de_auditoria_tamanho_atual</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>audit_log_database</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>audit_log_disable</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>audit_log_encryption</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>log_evento_de_auditoria_max_drop_size</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>eventos_log_de_auditoria</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>eventos_de_log_de_auditoria_filtrados</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>log_eventos_de_auditoria_perdidos</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>eventos_de_audit_escritos</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>audit_log_exclude_accounts</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>arquivo_de_registro_de_auditoria</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>audit_log_filter_id</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Não</td> </tr><tr><th>audit_log_flush</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>intervalo_de_varredura_de_log_de_auditoria_segundos</th> <td>Sim</td> <td></td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>audit_log_format</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>audit_log_include_accounts</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>audit_log_max_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>história_de_senha_de_auditoria_manter_dias</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>política_registro_de_auditoria</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>audit_log_prune_seconds</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>tamanho_do_buffer_de_registro_de_auditoria</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Varia</td> <td>Varia</td> </tr><tr><th>audit_log_rotate_on_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>política_de_declaração_do_registro_de_auditoria</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>audit_log_strategy</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>log_audit_total_size</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Registro de auditoria_espera_de_escrita</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr></tbody></table>

##### Opções e variáveis do registro de auditoria

Esta seção descreve as opções de comando e variáveis de sistema que configuram o funcionamento do MySQL Enterprise Audit. Se os valores especificados no momento do início estiverem incorretos, o plugin `audit_log` pode não ser inicializado corretamente e o servidor não o carregará. Nesse caso, o servidor também pode emitir mensagens de erro para outras configurações do log de auditoria, pois não as reconhece.

Para configurar a ativação do plugin de registro de auditoria, use esta opção:

- `--audit-log[=value]`

  <table summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o plugin `audit_log` ao iniciar. Está disponível apenas se o plugin tiver sido registrado anteriormente com `INSTALL PLUGIN` ou estiver carregado com `--plugin-load` ou `--plugin-load-add`. Consulte a Seção 8.4.5.2, “Instalando ou Desinstalando o MySQL Enterprise Audit”.

  O valor da opção deve ser uma das disponíveis para as opções de carregamento de plugins, conforme descrito na Seção 7.6.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--audit-log=FORCE_PLUS_PERMANENT` indica ao servidor que deve carregar o plugin e impedir que ele seja removido enquanto o servidor estiver em execução.

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

Você pode definir qualquer uma dessas variáveis no início do servidor e algumas delas durante a execução. Aquelas que estão disponíveis apenas para o registro de auditoria no modo legado são destacadas.

- `audit_log_buffer_size`

  <table summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709547520</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>

  Quando o plugin de registro de auditoria escreve eventos no log de forma assíncrona, ele usa um buffer para armazenar o conteúdo dos eventos antes de escrevê-los. Essa variável controla o tamanho desse buffer, em bytes. O servidor ajusta o valor para um múltiplo de 4096. O plugin usa um único buffer, que ele aloca quando inicializa e remove quando termina. O plugin aloca esse buffer apenas se o registro for assíncrono.

- `audit_log_compression`

  <table summary="Propriedades para audit_log_compression"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-compression=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_compression</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NONE</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>NONE</code>]]</p><p class="valid-value">[[<code>GZIP</code>]]</p></td> </tr></tbody></table>

  O tipo de compressão para o arquivo de registro de auditoria. Os valores permitidos são `NONE` (sem compressão; o padrão) e `GZIP` (compressão GNU Zip). Para mais informações, consulte Compressar arquivos de registro de auditoria.

- `audit_log_connection_policy`

  <table summary="Propriedades para audit_log_connection_policy"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-connection-policy=value</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.34</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_connection_policy</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ALL</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ALL</code>]]</p><p class="valid-value">[[<code>ERRORS</code>]]</p><p class="valid-value">[[<code>NONE</code>]]</p></td> </tr></tbody></table>

  Nota

  Essa variável desatualizada se aplica apenas ao filtro do log de auditoria no modo legado (consulte a Seção 8.4.5.10, “Filtro do Log de Auditoria no Modo Legado”).

  A política que controla a forma como o plugin de registro de auditoria escreve eventos de conexão em seu arquivo de log. A tabela a seguir mostra os valores permitidos.

  <table summary="Valores permitidos para a variável audit_log_connection_policy."><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[<code>ALL</code>]]</td> <td>Registre todos os eventos de conexão</td> </tr><tr> <td>[[<code>ERRORS</code>]]</td> <td>Registrar apenas eventos de conexão falha</td> </tr><tr> <td>[[<code>NONE</code>]]</td> <td>Não registrar eventos de conexão</td> </tr></tbody></table>

  Nota

  Ao iniciar o servidor, qualquer valor explícito fornecido para `audit_log_connection_policy` pode ser substituído se `audit_log_policy` também for especificado, conforme descrito na Seção 8.4.5.5, “Configurando as Características do Registro de Auditoria”.

- `audit_log_current_session`

  <table summary="Propriedades para audit_log_current_session"><tbody><tr><th>Variável do sistema</th> <td>[[<code>audit_log_current_session</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>depends on filtering policy</code>]]</td> </tr></tbody></table>

  Se o registro de auditoria está habilitado para a sessão atual. O valor da sessão desta variável é apenas de leitura. Ele é definido quando a sessão começa com base nos valores das variáveis de sistema `audit_log_include_accounts` e `audit_log_exclude_accounts`. O plugin de log de auditoria usa o valor da sessão para determinar se deve auditar eventos para a sessão. (Há um valor global, mas o plugin não o usa.)

- `audit_log_database`

  <table summary="Propriedades para audit_log_database"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-database=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.33</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_database</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mysql</code>]]</td> </tr></tbody></table>

  Especifica qual banco de dados o plugin `audit_log` usa para encontrar suas tabelas. Essa variável é somente de leitura. Para mais informações, consulte a Seção 8.4.5.2, “Instalando ou Desinstalando o MySQL Enterprise Audit”).

- `audit_log_disable`

  <table summary="Propriedades para audit_log_disable"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-disable[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.28</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_disable</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Permite desativar o registro de auditoria para todas as sessões de conexão e conectadas. Além do privilégio `SYSTEM_VARIABLES_ADMIN`, a desativação do registro de auditoria requer o privilégio `AUDIT_ADMIN`. Veja a Seção 8.4.5.9, “Desativar o Registro de Auditoria”.

- `audit_log_encryption`

  <table summary="Propriedades para audit_log_encryption"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-encryption=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_encryption</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NONE</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>NONE</code>]]</p><p class="valid-value">[[<code>AES</code>]]</p></td> </tr></tbody></table>

  O tipo de criptografia para o arquivo de registro de auditoria. Os valores permitidos são `NONE` (sem criptografia; o padrão) e `AES` (criptografia com cifra AES-256-CBC). Para mais informações, consulte Criptografar arquivos de registro de auditoria.

- `audit_log_exclude_accounts`

  <table summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>0

  Nota

  Essa variável desatualizada se aplica apenas ao filtro do log de auditoria no modo legado (consulte a Seção 8.4.5.10, “Filtro do Log de Auditoria no Modo Legado”).

  As contas para as quais os eventos não devem ser registrados. O valor deve ser `NULL` ou uma string contendo uma lista de um ou mais nomes de contas separados por vírgula. Para mais informações, consulte a Seção 8.4.5.7, “Filtragem do Log de Auditoria”.

  As modificações em `audit_log_exclude_accounts` afetam apenas as conexões criadas após a modificação, e não as conexões existentes.

- `audit_log_file`

  <table summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>1

  O nome da base e o sufixo do arquivo ao qual o plugin do log de auditoria escreve eventos. O valor padrão é `audit.log`, independentemente do formato de registro. Para que o sufixo do nome corresponda ao formato, defina o nome explicitamente, escolhendo um sufixo diferente (por exemplo, `audit.xml` para o formato XML, `audit.json` para o formato JSON).

  Se o valor de `audit_log_file` for um nome de caminho relativo, o plugin interpreta-o em relação ao diretório de dados. Se o valor for um nome de caminho completo, o plugin usa o valor como está. Um nome de caminho completo pode ser útil se for desejável localizar arquivos de auditoria em um sistema de arquivos ou diretório separado. Por razões de segurança, escreva o arquivo de log de auditoria em um diretório acessível apenas ao servidor MySQL e aos usuários que tenham uma razão legítima para visualizar o log.

  Para obter detalhes sobre como o plugin do log de auditoria interpreta o valor `audit_log_file` e as regras para renomear arquivos que ocorrem na inicialização e término do plugin, consulte as Convenções de Nomenclatura para Arquivos de Log de Auditoria.

  O plugin de registro de auditoria usa o diretório que contém o arquivo de registro de auditoria (determinado pelo valor `audit_log_file`) como local para procurar arquivos de registro de auditoria legíveis. Esses arquivos de log e o arquivo atual são usados pelo plugin para criar uma lista dos que estão sujeitos ao uso com as funções de marcação e leitura de registro de auditoria. Veja a Seção 8.4.5.6, “Leitura de Arquivos de Registro de Auditoria”.

- `audit_log_filter_id`

  <table summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>2

  O valor da sessão desta variável indica o ID mantido internamente do filtro de auditoria para a sessão atual. Um valor de 0 significa que a sessão não tem nenhum filtro atribuído.

- `audit_log_flush`

  <table summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>3

  Nota

  A variável `audit_log_flush` está desatualizada a partir do MySQL 8.0.31; espere que o suporte a ela seja removido em uma versão futura do MySQL. Ela é substituída pela função `audit_log_rotate()`.

  Se `audit_log_rotate_on_size` for 0, o rolamento automático do arquivo de registro de auditoria é desativado e o rolamento ocorre apenas quando realizado manualmente. Nesse caso, ao habilitar `audit_log_flush` definindo-o como 1 ou `ON`, o plugin de registro de auditoria é fechado e o arquivo de registro é reaberto para esvaziá-lo. (O valor da variável permanece `OFF`, para que você não precise desativá-la explicitamente antes de a reativar para realizar outro esvaziamento.) Para obter mais informações, consulte a Seção 8.4.5.5, “Configurando as Características de Registro de Auditoria”.

- `audit_log_flush_interval_seconds`

  <table summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>4

  Essa variável de sistema depende do componente `scheduler`, que deve ser instalado e habilitado (consulte a Seção 7.5.5, “Componente do Cronograma”). Para verificar o status do componente:

  ```
  SHOW VARIABLES LIKE 'component_scheduler%';
  +-----------------------------+-------+
  | Variable_name               | Value |
  +-----------------------------+-------|
  | component_scheduler.enabled | On    |
  +-----------------------------+-------+
  ```

  Quando `audit_log_flush_interval_seconds` tem o valor zero (o padrão), não ocorre atualização automática dos privilégios, mesmo que o componente `scheduler` esteja habilitado (`ON`).

  Os valores de `1` e `59` não são permitidos; em vez disso, esses valores ajustam-se automaticamente para `60` e o servidor emite um aviso. Valores maiores que `60` definem o número de segundos que o componente `scheduler` espera desde a inicialização ou desde o início da execução anterior, até tentar agendar outra execução.

  Para persistir essa variável de sistema global no arquivo `mysqld-auto.cnf` sem definir o valor da variável de tempo de execução, antecipe o nome da variável com a palavra-chave `PERSIST_ONLY` ou o qualificador `@@PERSIST_ONLY.`.

- `audit_log_format`

  <table summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>5

  O formato do arquivo de registro de auditoria. Os valores permitidos são `OLD` (XML de estilo antigo), `NEW` (XML de estilo novo; o padrão) e `JSON`. Para obter detalhes sobre cada formato, consulte a Seção 8.4.5.4, “Formatos de arquivos de registro de auditoria”.

- `audit_log_format_unix_timestamp`

  <table summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>6

  Esta variável só se aplica à saída do log de auditoria no formato JSON. Quando estiver ativada, a ativação desta variável faz com que cada registro do arquivo de log inclua um campo `time`. O valor do campo é um número inteiro que representa o valor do timestamp UNIX, indicando a data e a hora em que o evento de auditoria foi gerado.

  Alterar o valor dessa variável em tempo de execução faz com que o arquivo de registro seja rotado, de modo que, para um arquivo de registro no formato JSON específico, todos os registros no arquivo incluem ou não o campo `time`.

  Para definir o valor de execução de `audit_log_format_unix_timestamp`, é necessário o privilégio `AUDIT_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou do privilégio desatualizado `SUPER`) normalmente necessário para definir o valor de execução de uma variável de sistema global.

- `audit_log_include_accounts`

  <table summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>7

  Nota

  Essa variável desatualizada se aplica apenas ao filtro do log de auditoria no modo legado (consulte a Seção 8.4.5.10, “Filtro do Log de Auditoria no Modo Legado”).

  As contas para as quais os eventos devem ser registrados. O valor deve ser `NULL` ou uma string contendo uma lista de um ou mais nomes de contas separados por vírgula. Para mais informações, consulte a Seção 8.4.5.7, “Filtragem do Log de Auditoria”.

  As modificações em `audit_log_include_accounts` afetam apenas as conexões criadas após a modificação, e não as conexões existentes.

- `audit_log_max_size`

  <table summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>8

  `audit_log_max_size` refere-se à poda do arquivo de registro de auditoria, que é suportada apenas para arquivos de registro no formato JSON. Ele controla a poda com base no tamanho combinado do arquivo de registro:

  - Um valor de 0 (padrão) desativa a poda baseada no tamanho. Nenhum limite de tamanho é aplicado.

  - Um valor maior que 0 habilita a poda baseada no tamanho. O valor é o tamanho combinado acima do qual os arquivos do log de auditoria passam a ser objeto de poda.

  Se você definir `audit_log_max_size` para um valor que não seja múltiplo de 4096, ele será truncado para o múltiplo mais próximo. Especificamente, definindo-o para um valor menor que 4096, ele será definido como 0 e não ocorrerá poda baseada no tamanho.

  Se tanto `audit_log_max_size` quanto `audit_log_rotate_on_size` forem maiores que 0, `audit_log_max_size` deve ser mais de 7 vezes o valor de `audit_log_rotate_on_size`. Caso contrário, um aviso é escrito no log de erro do servidor, pois, nesse caso, a “granularidade” da poda baseada em tamanho pode ser insuficiente para evitar a remoção de todos ou a maioria dos arquivos de log rotados cada vez que isso ocorre.

  Nota

  Definir `audit_log_max_size` por si só não é suficiente para fazer com que o corte de arquivos de log ocorra, porque o algoritmo de corte usa `audit_log_rotate_on_size`, `audit_log_max_size` e `audit_log_prune_seconds` em conjunto. Para obter detalhes, consulte Gerenciamento de Espaço de Arquivos de Log de Auditoria.

- `audit_log_password_history_keep_days`

  <table summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>9

  O plugin de registro de auditoria implementa a criptografia de arquivos de registro usando senhas de criptografia armazenadas no chaveiro MySQL (veja Criptografar arquivos de registro de auditoria). O plugin também implementa o histórico de senhas, que inclui arquivamento e expiração de senhas (remoção).

  Quando o plugin do log de auditoria cria uma nova senha de criptografia, ele arquiviza a senha anterior, se existir, para uso posterior. A variável `audit_log_password_history_keep_days` controla a remoção automática de senhas de criptografia de log de auditoria arquivadas. Seu valor indica o número de dias após o qual as senhas de criptografia de log de auditoria arquivadas são removidas. O valor padrão de 0 desabilita a expiração da senha: o período de retenção da senha é para sempre.

  Novas senhas de criptografia do log de auditoria são criadas nessas circunstâncias:

  - Durante a inicialização do plugin, se o plugin encontrar que o criptografia de arquivo de log está habilitada, ele verifica se o chaveiro contém uma senha de criptografia de log de auditoria. Se não, o plugin gera automaticamente uma senha de criptografia inicial aleatória.

  - Quando a função `audit_log_encryption_password_set()` é chamada para definir uma senha específica.

  Em cada caso, o plugin armazena a nova senha no anel de chaves e usa-a para criptografar novos arquivos de log.

  A remoção das senhas de criptografia do log de auditoria expiradas ocorre nessas circunstâncias:

  - Durante a inicialização do plugin.

  - Quando a função `audit_log_encryption_password_set()` for chamada.

  - Quando o valor de execução de `audit_log_password_history_keep_days` é alterado de seu valor atual para um valor maior que 0. As alterações no valor de execução ocorrem para as instruções `SET` que usam as palavras-chave `GLOBAL` ou `PERSIST`, mas não a palavra-chave `PERSIST_ONLY`. `PERSIST_ONLY` escreve o valor da variável para `mysqld-auto.cnf`, mas não tem efeito no valor de execução.

  Quando a remoção da senha ocorre, o valor atual de `audit_log_password_history_keep_days` determina quais senhas serão removidas:

  - Se o valor for 0, o plugin não remove nenhuma senha.
  - Se o valor for `N` > 0, o plugin remove senhas com mais de `N` dias de idade.

  Nota

  Tenha cuidado para não expirar senhas antigas que ainda são necessárias para ler arquivos de registro criptografados arquivados.

  Se você normalmente deixar a expiração da senha desativada (ou seja, `audit_log_password_history_keep_days` tem um valor de 0), é possível realizar uma operação de limpeza sob demanda, atribuindo temporariamente à variável um valor maior que zero. Por exemplo, para expirar senhas mais antigas que 365 dias, faça o seguinte:

  ```
  SET GLOBAL audit_log_password_history_keep_days = 365;
  SET GLOBAL audit_log_password_history_keep_days = 0;
  ```

  Para definir o valor de execução de `audit_log_password_history_keep_days`, é necessário o privilégio `AUDIT_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou do privilégio desatualizado `SUPER`) normalmente necessário para definir o valor de execução de uma variável de sistema global.

- `audit_log_policy`

  <table summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709547520</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>0

  Nota

  Essa variável desatualizada se aplica apenas ao filtro do log de auditoria no modo legado (consulte a Seção 8.4.5.10, “Filtro do Log de Auditoria no Modo Legado”).

  A política que controla como o plugin de registro de auditoria escreve eventos em seu arquivo de log. A tabela a seguir mostra os valores permitidos.

  <table summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709547520</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>1

  `audit_log_policy` pode ser definido apenas no início do servidor. No tempo de execução, é uma variável de leitura somente. Outras duas variáveis do sistema, `audit_log_connection_policy` e `audit_log_statement_policy`, fornecem um controle mais preciso sobre a política de registro e podem ser definidas no início ou no tempo de execução. Se você usar `audit_log_policy` no início em vez das outras duas variáveis, o servidor usa seu valor para definir essas variáveis. Para mais informações sobre as variáveis de política e sua interação, consulte a Seção 8.4.5.5, “Configurando as Características do Registro de Auditoria”.

- `audit_log_prune_seconds`

  <table summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709547520</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>2

  `audit_log_prune_seconds` refere-se à poda do arquivo de registro de auditoria, que é suportada apenas para arquivos de registro no formato JSON. Ele controla a poda com base na idade do arquivo de registro:

  - Um valor de 0 (padrão) desativa a poda baseada na idade. Nenhum limite de idade é aplicado.

  - Um valor maior que 0 habilita a poda baseada na idade. O valor é o número de segundos após os quais os arquivos do log de auditoria passam a ser objeto de poda.

  Nota

  Definir `audit_log_prune_seconds` por si só não é suficiente para fazer com que o corte de arquivos de log ocorra, porque o algoritmo de corte usa `audit_log_rotate_on_size`, `audit_log_max_size` e `audit_log_prune_seconds` em conjunto. Para obter detalhes, consulte Gerenciamento de Espaço de Arquivos de Log de Auditoria.

- `audit_log_read_buffer_size`

  <table summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709547520</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>3

  O tamanho do buffer para leitura do arquivo de log de auditoria, em bytes. A função `audit_log_read()` não lê mais do que esse número de bytes. A leitura de arquivos de log é suportada apenas para o formato de log JSON. Para mais informações, consulte a Seção 8.4.5.6, “Leitura de Arquivos de Log de Auditoria”.

  A partir do MySQL 8.0.12, essa variável tem um valor padrão de 32 KB e pode ser definida em tempo de execução. Cada cliente deve definir seu valor de sessão de `audit_log_read_buffer_size` de forma apropriada para seu uso de `audit_log_read()`. Antes do MySQL 8.0.12, `audit_log_read_buffer_size` tem um valor padrão de 1 MB, afeta todos os clientes e pode ser alterado apenas na inicialização do servidor.

- `audit_log_rotate_on_size`

  <table summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709547520</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>4

  Se `audit_log_rotate_on_size` for 0, o plugin do log de auditoria não realiza a rotação automática dos arquivos de log com base no tamanho. Se a rotação ocorrer, você deve realizá-la manualmente; consulte "Rotação manual do arquivo de log de auditoria (antes do MySQL 8.0.31").")

  Se `audit_log_rotate_on_size` for maior que 0, a rotação automática do arquivo de registro com base no tamanho ocorrerá. Sempre que uma escrita no arquivo de registro faz com que seu tamanho exceda o valor `audit_log_rotate_on_size`, o plugin de log de auditoria renomeia o arquivo de log atual e abre um novo arquivo de log atual usando o nome original.

  Se você definir `audit_log_rotate_on_size` para um valor que não seja múltiplo de 4096, ele será truncado para o múltiplo mais próximo. Especificamente, definindo-o para um valor menor que 4096, ele será definido como 0 e nenhuma rotação ocorrerá, exceto manualmente.

  Nota

  `audit_log_rotate_on_size` controla se a rotação do arquivo de registro de auditoria ocorre. Também pode ser usado em conjunto com `audit_log_max_size` e `audit_log_prune_seconds` para configurar a poda de arquivos de log em formato JSON rotados. Para obter detalhes, consulte Gerenciamento de Espaço de Arquivos de Registro de Auditoria.

- `audit_log_statement_policy`

  <table summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709547520</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>5

  Nota

  Essa variável desatualizada se aplica apenas ao filtro do log de auditoria no modo legado (consulte a Seção 8.4.5.10, “Filtro do Log de Auditoria no Modo Legado”).

  A política que controla a forma como o plugin de registro de auditoria escreve eventos de declaração em seu arquivo de log. A tabela a seguir mostra os valores permitidos.

  <table summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709547520</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>6

  Nota

  Ao iniciar o servidor, qualquer valor explícito fornecido para `audit_log_statement_policy` pode ser substituído se `audit_log_policy` também for especificado, conforme descrito na Seção 8.4.5.5, “Configurando as Características do Registro de Auditoria”.

- `audit_log_strategy`

  <table summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--audit-log-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>audit_log_buffer_size</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709547520</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>7

  O método de registro usado pelo plugin de log de auditoria. Esses valores de estratégia são permitidos:

  - `ASYNCHRONOUS`: Registre de forma assíncrona. Aguarde um espaço no buffer de saída.

  - `PERFORMANCE`: Registre de forma assíncrona. Descarte solicitações para as quais não há espaço suficiente no buffer de saída.

  - `SEMISYNCHRONOUS`: Faça o log de forma síncrona. Permita o cacheamento pelo sistema operacional.

  - `SYNCHRONOUS`: Faça o log de forma sincrônica. Chame `sync()` após cada solicitação.

##### Variáveis de Status do Registro de Auditoria

Se o plugin de registro de auditoria estiver habilitado, ele exibe várias variáveis de status que fornecem informações operacionais. Essas variáveis estão disponíveis para o filtro de auditoria no modo legado (desatualizado no MySQL 8.0.34) e o filtro de auditoria no modo JSON.

- `Audit_log_current_size`

  O tamanho do arquivo de registro de auditoria atual. O valor aumenta quando um evento é escrito no log e é redefinido para 0 quando o log é rotado.

- `Audit_log_event_max_drop_size`

  O tamanho do evento mais grande que foi excluído no modo de registro de desempenho. Para uma descrição dos modos de registro, consulte a Seção 8.4.5.5, “Configurando as Características de Registro de Auditoria”.

- `Audit_log_events`

  O número de eventos gerenciados pelo plugin do log de auditoria, independentemente de terem sido registrados no log com base na política de filtragem (consulte a Seção 8.4.5.5, “Configurando as Características do Registro de Auditoria”).

- `Audit_log_events_filtered`

  O número de eventos tratados pelo plugin de registro de auditoria que foram filtrados (e não registrados no log) com base na política de filtragem (consulte a Seção 8.4.5.5, “Configurando as Características do Registro de Auditoria”).

- `Audit_log_events_lost`

  O número de eventos perdidos no modo de registro de desempenho porque um evento era maior que o espaço de buffer do log de auditoria disponível. Esse valor pode ser útil para avaliar como configurar `audit_log_buffer_size` para dimensionar o buffer para o modo de desempenho. Para uma descrição dos modos de registro, consulte a Seção 8.4.5.5, “Configurando as Características de Registro de Auditoria”.

- `Audit_log_events_written`

  O número de eventos registrados no log de auditoria.

- `Audit_log_total_size`

  O tamanho total dos eventos registrados em todos os arquivos do log de auditoria. Ao contrário de `Audit_log_current_size`, o valor de `Audit_log_total_size` aumenta mesmo quando o log é rotado.

- `Audit_log_write_waits`

  O número de vezes que um evento teve que esperar por espaço no buffer do log de auditoria no modo de registro assíncrono. Para uma descrição dos modos de registro, consulte a Seção 8.4.5.5, “Configurando as Características de Registro de Auditoria”.
