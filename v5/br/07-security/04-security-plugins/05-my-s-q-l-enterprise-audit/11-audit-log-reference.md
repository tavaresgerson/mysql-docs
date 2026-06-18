#### 6.4.5.11 Referência do Log de Auditoria

As seções a seguir fornecem uma referência aos elementos de auditoria do MySQL Enterprise:

- Tabelas do Log de Auditoria [audit-log-reference.html#audit-log-tables]
- Funções do Log de Auditoria
- Opção de Registro de Auditoria e Referência de Variável
- Opções e variáveis do log de auditoria
- Variáveis do Registro de Auditoria

Para instalar as tabelas e funções do log de auditoria, use as instruções fornecidas em Seção 6.4.5.2, “Instalando ou Desinstalando o Auditoria MySQL Enterprise”. A menos que esses objetos sejam instalados, o plugin `audit_log` opera no modo legado. Veja Seção 6.4.5.10, “Filtragem do Log de Auditoria no Modo Legado”.

##### Tabelas de registro de auditoria

O MySQL Enterprise Audit utiliza tabelas no banco de dados do sistema `mysql` para armazenamento persistente de dados de filtro e contas de usuário. As tabelas só podem ser acessadas por usuários que tenham privilégios para esse banco de dados. As tabelas utilizam o mecanismo de armazenamento `InnoDB` (`MyISAM` antes do MySQL 5.7.21).

Se essas tabelas estiverem ausentes, o plugin `audit_log` opera no modo legado. Consulte Seção 6.4.5.10, “Filtragem do Log de Auditoria no Modo Legado”.

A tabela `audit_log_filter` armazena definições de filtros. A tabela tem as seguintes colunas:

- `NOME`

  O nome do filtro.

- `FILTER`

  A definição do filtro associada ao nome do filtro. As definições são armazenadas como valores de `JSON`.

A tabela `audit_log_user` armazena informações da conta de usuário. A tabela tem as seguintes colunas:

- `USER`

  A parte do nome de usuário de uma conta. Para uma conta `user1@localhost`, a parte `USER` é `user1`.

- `HOST`

  A parte do nome do host de uma conta. Para uma conta `user1@localhost`, a parte `HOST` é `localhost`.

- `FILTERNAME`

  O nome do filtro atribuído à conta. O nome do filtro associa a conta a um filtro definido na tabela `audit_log_filter`.

##### Funções do Log de Auditoria

Esta seção descreve, para cada função do log de auditoria, seu propósito, sequência de chamadas e valor de retorno. Para informações sobre as condições sob as quais essas funções podem ser invocadas, consulte Seção 6.4.5.7, “Filtragem do Log de Auditoria”.

Cada função de registro de auditoria retorna uma string que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: mensagem` indica falha.

As funções do log de auditoria tratam argumentos de string como strings binárias (o que significa que elas não distinguem maiúsculas e minúsculas) e os valores de retorno de string são strings binárias.

Se uma função de registro de auditoria for invocada dentro do cliente **mysql**, os resultados em string binária são exibidos usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

Estas funções do log de auditoria estão disponíveis:

- `audit_log_encryption_password_get()`

  Recupera a senha de criptografia do log de auditoria atual como uma string binária. A senha é obtida do conjunto de chaves MySQL, que deve estar habilitado ou ocorrerá um erro. Qualquer plugin de conjunto de chaves pode ser usado; para instruções, consulte Seção 6.4.4, “O Conjunto de Chaves MySQL”.

  Para obter informações adicionais sobre a criptografia do log de auditoria, consulte Criptografar arquivos de log de auditoria.

  Argumentos:

  Nenhum.

  Valor de retorno:

  A string de senha para sucesso (até 766 bytes) ou `NULL` e um erro para falha.

  Exemplo:

  ```sql
  mysql> SELECT audit_log_encryption_password_get();
  +-------------------------------------+
  | audit_log_encryption_password_get() |
  +-------------------------------------+
  | secret                              |
  +-------------------------------------+
  ```

- `audit_log_encryption_password_set(password)`

  Define a senha de criptografia do log de auditoria como o argumento, armazena a senha no chaveiro MySQL. Se a criptografia estiver habilitada, a função executa uma operação de rotação de arquivo de log que renomeia o arquivo de log atual e inicia um novo arquivo de log criptografado com a senha. O chaveiro deve estar habilitado ou ocorrerá um erro. Qualquer plugin do chaveiro pode ser usado; consulte Seção 6.4.4, “O Chaveiro MySQL” para instruções.

  Para obter informações adicionais sobre a criptografia do log de auditoria, consulte Criptografar arquivos de log de auditoria.

  Argumentos:

  *`password`*: A string da senha. O comprimento máximo permitido é de 766 bytes.

  Valor de retorno:

  1 para o sucesso, 0 para o fracasso.

  Exemplo:

  ```sql
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

  A função `audit_log_filter_flush()` deve ser usada apenas após a modificação direta das tabelas de auditoria, para forçar a recarga de todos os filtros. Caso contrário, essa função deve ser evitada. É, na verdade, uma versão simplificada de desinstalar e reinstalar o plugin `audit_log` com `UNINSTALL PLUGIN` mais `INSTALL PLUGIN`.

  `audit_log_filter_flush()` afeta todas as sessões atuais e as desliga de seus filtros anteriores. As sessões atuais não são mais registradas, a menos que elas desconectem e se reconectem ou executem uma operação de mudança de usuário.

  Se essa função falhar, uma mensagem de erro é retornada e o log de auditoria é desativado até a próxima chamada bem-sucedida para `audit_log_filter_flush()`.

  Argumentos:

  Nenhum.

  Valor de retorno:

  Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: mensagem` indica falha.

  Exemplo:

  ```sql
  mysql> SELECT audit_log_filter_flush();
  +--------------------------+
  | audit_log_filter_flush() |
  +--------------------------+
  | OK                       |
  +--------------------------+
  ```

- `audit_log_filter_remove_filter(filter_name)`

  Dada um nome de filtro, remove o filtro do conjunto atual de filtros. Não é um erro se o filtro não existir.

  Se um filtro removido for atribuído a quaisquer contas de usuário, esses usuários deixam de ser filtrados (são removidos da tabela `audit_log_user`). A interrupção do filtro inclui todas as sessões atuais desses usuários: eles são desconectados do filtro e não são mais registrados.

  Argumentos:

  - *`filter_name`*: Uma string que especifica o nome do filtro.

  Valor de retorno:

  Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: mensagem` indica falha.

  Exemplo:

  ```sql
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

  - *`user_name`*: O nome da conta do usuário como uma string no formato `user_name@host_name`, ou `%` para representar a conta padrão.

  Valor de retorno:

  Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: mensagem` indica falha.

  Exemplo:

  ```sql
  mysql> SELECT audit_log_filter_remove_user('user1@localhost');
  +-------------------------------------------------+
  | audit_log_filter_remove_user('user1@localhost') |
  +-------------------------------------------------+
  | OK                                              |
  +-------------------------------------------------+
  ```

- `audit_log_filter_set_filter(filtro_nome, definição)`

  Dada um nome e uma definição de filtro, adiciona o filtro ao conjunto atual de filtros. Se o filtro já existir e estiver sendo usado por alguma sessão atual, essas sessões são desconectadas do filtro e deixam de ser registradas. Isso ocorre porque a nova definição de filtro tem um novo ID de filtro que difere do seu ID anterior.

  Argumentos:

  - *`filter_name`*: Uma string que especifica o nome do filtro.

  - *`definição`*: Um valor de `JSON` que especifica a definição do filtro.

  Valor de retorno:

  Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: mensagem` indica falha.

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

- `audit_log_filter_set_user(nome_do_usuário, nome_do_filtro)`

  Dada uma nome de conta de usuário e um nome de filtro, atribui o filtro ao usuário. Um usuário pode ser atribuído apenas um filtro, portanto, se o usuário já tiver sido atribuído um filtro, a atribuição é substituída. A filtragem de sessões atuais para o usuário permanece inalterada. Novas conexões são filtradas usando o novo filtro.

  Como caso especial, o nome `%` representa a conta padrão. O filtro é usado para conexões de qualquer conta de usuário que não tenha um filtro atribuído explicitamente.

  Argumentos:

  - *`user_name`*: O nome da conta do usuário como uma string no formato `user_name@host_name`, ou `%` para representar a conta padrão.

  - *`filter_name`*: Uma string que especifica o nome do filtro.

  Valor de retorno:

  Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: mensagem` indica falha.

  Exemplo:

  ```sql
  mysql> SELECT audit_log_filter_set_user('user1@localhost', 'SomeFilter');
  +------------------------------------------------------------+
  | audit_log_filter_set_user('user1@localhost', 'SomeFilter') |
  +------------------------------------------------------------+
  | OK                                                         |
  +------------------------------------------------------------+
  ```

- `audit_log_read([arg])`

  Leitura do log de auditoria e retorno de uma string binária de resultado em formato `JSON` (json.html). Se o formato do log de auditoria não for `JSON` (json.html), ocorrerá um erro.

  Sem argumento ou argumento de hash de `JSON`, `audit_log_read()` lê eventos do log de auditoria e retorna uma string de `JSON` contendo um array de eventos de auditoria. Os itens no argumento de hash influenciam como a leitura ocorre, conforme descrito mais adiante. Cada elemento no array retornado é um evento representado como um hash de `JSON`, com a exceção de que o último elemento pode ser um valor `JSON` `null` para indicar que não há eventos seguintes disponíveis para leitura.

  Com um argumento que consiste em um valor `null` de `JSON` (`json.html`), o `audit_log_read()` (`audit-log-reference.html#function_audit-log-read`) fecha a sequência de leitura atual.

  Para obter informações adicionais sobre o processo de leitura do log de auditoria, consulte Seção 6.4.5.6, “Leitura de arquivos de log de auditoria”.

  Argumentos:

  *`arg`*: O argumento é opcional. Se omitido, a função lê eventos a partir da posição atual. Se presente, o argumento pode ser um valor `null` de `JSON` para fechar a sequência de leitura ou um hash de `JSON`. Dentro de um argumento hash, os itens são opcionais e controlam aspectos da operação de leitura, como a posição em que começar a ler ou quantos eventos ler. Os seguintes itens são significativos (outros itens são ignorados):

  - `timestamp`, `id`: A posição dentro do log de auditoria do primeiro evento a ser lido. Se a posição for omitida do argumento, a leitura continua a partir da posição atual. Os itens `timestamp` e `id` juntos compõem um marcador que identifica de forma única um evento específico. Se um argumento de `audit_log_read()` incluir qualquer um desses itens, ele deve incluir ambos para especificar completamente uma posição, caso contrário, ocorrerá um erro.

    Para obter um marcador para o evento mais recentemente escrito, chame `audit_log_read_bookmark()`.

  - `max_array_length`: O número máximo de eventos a serem lidos do log. Se este item for omitido, o padrão é ler até o final do log ou até que o buffer de leitura esteja cheio, o que ocorrer primeiro.

  Valor de retorno:

  Se a chamada for bem-sucedida, o valor de retorno é uma string binária de `JSON` (json.html) contendo um array de eventos de auditoria, ou um valor `JSON` (json.html) `null` se isso foi passado como argumento para fechar a sequência de leitura. Se a chamada falhar, o valor de retorno é `NULL` e ocorre um erro.

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

- `audit_log_read_bookmark()`

  Retorna uma string binária de `JSON` que representa um marcador para o evento de registro de auditoria mais recentemente escrito. Se o formato do registro de auditoria não for `JSON`, ocorrerá um erro.

  O marcador é um hash `JSON` com os itens `timestamp` e `id` que identificam de forma única a posição de um evento dentro do log de auditoria. É adequado para ser passado para `audit_log_read()` para indicar àquela função a posição em que deve começar a leitura.

  Para obter informações adicionais sobre o processo de leitura do log de auditoria, consulte Seção 6.4.5.6, “Leitura de arquivos de log de auditoria”.

  Argumentos:

  Nenhum.

  Valor de retorno:

  Uma string binária `JSON` contendo um marcador de sucesso, ou `NULL` e um erro para falha.

  Exemplo:

  ```sql
  mysql> SELECT audit_log_read_bookmark();
  +-------------------------------------------------+
  | audit_log_read_bookmark()                       |
  +-------------------------------------------------+
  | { "timestamp": "2019-10-03 21:03:44", "id": 0 } |
  +-------------------------------------------------+
  ```

##### Opção de Registro de Auditoria e Referência de Variável

**Tabela 6.34 Opção de Log de Auditoria e Referência de Variável**

<table frame="box" rules="all" summary="Referência para opções de linha de comando do log de auditoria, variáveis de sistema e variáveis de status."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Nome</th> <th>Linha de comando</th> <th>Arquivo de Opções</th> <th>Sistema Var</th> <th>Status Var</th> <th>Var Scope</th> <th>Dinâmico</th> </tr></thead><tbody><tr><th>registro de auditoria</th> <td>Sim</td> <td>Sim</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>buffer_de_registro_de_auditoria</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>audit_log_compression</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>política_de_conexão_do_registro_de_auditoria</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>audit_log_sessão_atual</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Não</td> </tr><tr><th>log_de_auditoria_tamanho_atual</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>audit_log_disable</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>audit_log_encryption</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>log_evento_de_auditoria_max_drop_size</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>eventos_log_de_auditoria</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>eventos_de_log_de_auditoria_filtrados</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>log_eventos_de_auditoria_perdidos</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>eventos_de_audit_escritos</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>audit_log_exclude_accounts</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>arquivo_de_registro_de_auditoria</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>audit_log_filter_id</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Ambos</td> <td>Não</td> </tr><tr><th>audit_log_flush</th> <td></td> <td></td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>audit_log_format</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>audit_log_include_accounts</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>política_registro_de_auditoria</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>tamanho_do_buffer_de_registro_de_auditoria</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Varia</td> <td>Varia</td> </tr><tr><th>audit_log_rotate_on_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>política_de_declaração_do_registro_de_auditoria</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>audit_log_strategy</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>log_audit_total_size</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr><tr><th>Registro de auditoria_espera_de_escrita</th> <td></td> <td></td> <td></td> <td>Sim</td> <td>Global</td> <td>Não</td> </tr></tbody></table>

##### Opções e variáveis do registro de auditoria

Esta seção descreve as opções de comando e as variáveis de sistema que configuram o funcionamento do MySQL Enterprise Audit. Se os valores especificados no momento do início estiverem incorretos, o plugin `audit_log` pode não ser inicializado corretamente e o servidor não carregá-lo. Nesse caso, o servidor também pode emitir mensagens de erro para outras configurações do log de auditoria, pois não as reconhece.

Para configurar a ativação do plugin de registro de auditoria, use esta opção:

- `--audit-log[=valor]`

  <table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o plugin `audit_log` ao iniciar. Está disponível apenas se o plugin tiver sido registrado anteriormente com `INSTALL PLUGIN` ou tiver sido carregado com `--plugin-load` ou `--plugin-load-add`. Veja Seção 6.4.5.2, “Instalando ou Desinstalando o Auditoria do MySQL Enterprise”.

  O valor da opção deve ser uma das disponíveis para as opções de carregamento de plugins, conforme descrito em Seção 5.5.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--audit-log=FORCE_PLUS_PERMANENT` indica ao servidor que carregue o plugin e impeça sua remoção enquanto o servidor estiver em execução.

Se o plugin do log de auditoria estiver habilitado, ele expõe várias variáveis de sistema que permitem o controle do registro:

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

Você pode definir qualquer uma dessas variáveis no início do servidor e algumas delas durante a execução. Aquelas que estão disponíveis apenas para o registro de auditoria no modo legado são destacadas.

- `audit_log_buffer_size`

  <table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>1048576</code></td> </tr><tr><th>Valor mínimo</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td><code>4096</code></td> </tr></tbody></table>

  Quando o plugin de registro de auditoria escreve eventos no log de forma assíncrona, ele usa um buffer para armazenar o conteúdo dos eventos antes de escrevê-los. Essa variável controla o tamanho desse buffer, em bytes. O servidor ajusta o valor para um múltiplo de 4096. O plugin usa um único buffer, que ele aloca quando inicializa e remove quando termina. O plugin aloca esse buffer apenas se o registro for assíncrono.

- `audit_log_compression`

  <table frame="box" rules="all" summary="Propriedades para audit_log_compression"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log-compression=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Variável do sistema</th> <td><code>audit_log_compression</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>NONE</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>NONE</code></p><p><code>GZIP</code></p></td> </tr></tbody></table>

  O tipo de compressão para o arquivo de registro de auditoria. Os valores permitidos são `NONE` (sem compressão; o padrão) e `GZIP` (compressão GNU Zip). Para mais informações, consulte Compactação de Arquivos de Registro de Auditoria.

- `audit_log_connection_policy`

  <table frame="box" rules="all" summary="Propriedades para audit_log_connection_policy"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log-connection-policy=value</code></td> </tr><tr><th>Variável do sistema</th> <td><code>audit_log_connection_policy</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ALL</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ALL</code></p><p><code>ERRORS</code></p><p><code>NONE</code></p></td> </tr></tbody></table>

  Nota

  Esta variável só se aplica à filtragem do log de auditoria no modo legado (consulte Seção 6.4.5.10, “Filtragem do Log de Auditoria no Modo Legado”).

  A política que controla a forma como o plugin de registro de auditoria escreve eventos de conexão em seu arquivo de log. A tabela a seguir mostra os valores permitidos.

  <table summary="Valores permitidos para a variável audit_log_connection_policy."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>ALL</code></td> <td>Registre todos os eventos de conexão</td> </tr><tr> <td><code>ERRORS</code></td> <td>Registrar apenas eventos de conexão falha</td> </tr><tr> <td><code>NONE</code></td> <td>Não registrar eventos de conexão</td> </tr></tbody></table>

  Nota

  Ao iniciar o servidor, qualquer valor explícito fornecido para `audit_log_connection_policy` pode ser substituído se `audit_log_policy` também for especificado, conforme descrito na Seção 6.4.5.5, “Configurando as Características do Registro de Auditoria”.

- `audit_log_current_session`

  <table frame="box" rules="all" summary="Propriedades para audit_log_current_session"><tbody><tr><th>Variável do sistema</th> <td><code>audit_log_current_session</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>depends on filtering policy</code></td> </tr></tbody></table>

  Se o registro de auditoria está habilitado para a sessão atual. O valor da sessão desta variável é apenas de leitura. É definido quando a sessão começa com base nos valores das variáveis de sistema `audit_log_include_accounts` e `audit_log_exclude_accounts`. O plugin de log de auditoria usa o valor da sessão para determinar se deve auditar eventos para a sessão. (Existe um valor global, mas o plugin não o usa.)

- `audit_log_disable`

  <table frame="box" rules="all" summary="Propriedades para audit_log_disable"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log-disable[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.37</td> </tr><tr><th>Variável do sistema</th> <td><code>audit_log_disable</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Permite desativar o registro de auditoria para todas as sessões de conexão e conectadas. Para desativar o registro de auditoria, é necessário o privilégio `SUPER`. Consulte Seção 6.4.5.9, “Desativar o Registro de Auditoria”.

- `audit_log_encryption`

  <table frame="box" rules="all" summary="Propriedades para audit_log_encryption"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log-encryption=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Variável do sistema</th> <td><code>audit_log_encryption</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>NONE</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>NONE</code></p><p><code>AES</code></p></td> </tr></tbody></table>

  O tipo de criptografia para o arquivo de registro de auditoria. Os valores permitidos são `NONE` (sem criptografia; o padrão) e `AES` (criptografia com cifra AES-256-CBC). Para mais informações, consulte Criptografando arquivos de registro de auditoria.

- `audit_log_exclude_accounts`

  <table frame="box" rules="all" summary="Propriedades para audit_log_exclude_accounts"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log-exclude-accounts=value</code></td> </tr><tr><th>Variável do sistema</th> <td><code>audit_log_exclude_accounts</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Nota

  Esta variável só se aplica à filtragem do log de auditoria no modo legado (consulte Seção 6.4.5.10, “Filtragem do Log de Auditoria no Modo Legado”).

  As contas para as quais os eventos não devem ser registrados. O valor deve ser `NULL` ou uma string contendo uma lista de um ou mais nomes de contas separados por vírgula. Para mais informações, consulte Seção 6.4.5.7, “Filtragem do Log de Auditoria”.

  As modificações em `audit_log_exclude_accounts` afetam apenas as conexões criadas após a modificação, e não as conexões existentes.

- `audit_log_file`

  <table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  O nome de base e o sufixo do arquivo para o qual o plugin do log de auditoria escreve eventos. O valor padrão é `audit.log`, independentemente do formato de registro. Para que o sufixo do nome corresponda ao formato, defina o nome explicitamente, escolhendo um sufixo diferente (por exemplo, `audit.xml` para o formato XML, `audit.json` para o formato JSON).

  Se o valor de `audit_log_file` for um nome de caminho relativo, o plugin interpreta-o em relação ao diretório de dados. Se o valor for um nome de caminho completo, o plugin usa o valor como está. Um nome de caminho completo pode ser útil se for desejável localizar arquivos de auditoria em um sistema de arquivos ou diretório separado. Por razões de segurança, escreva o arquivo de log de auditoria em um diretório acessível apenas ao servidor MySQL e aos usuários que tenham um motivo legítimo para visualizar o log.

  Para obter detalhes sobre como o plugin do log de auditoria interpreta o valor `audit_log_file` e as regras para renomear arquivos que ocorrem na inicialização e término do plugin, consulte Convenções de Nomenclatura para Arquivos de Log de Auditoria.

  A partir do MySQL 5.7.21, o plugin de log de auditoria usa o diretório que contém o arquivo de log de auditoria (determinado pelo valor de `audit_log_file`) como o local para procurar arquivos de log de auditoria legíveis. Esses arquivos de log e o arquivo atual são usados pelo plugin para criar uma lista dos que estão sujeitos ao uso com as funções de marcação e leitura de log de auditoria. Veja Seção 6.4.5.6, “Leitura de Arquivos de Log de Auditoria”.

- `audit_log_filter_id`

  <table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  O valor da sessão desta variável indica o ID mantido internamente do filtro de auditoria para a sessão atual. Um valor de 0 significa que a sessão não tem nenhum filtro atribuído.

- `audit_log_flush`

  <table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Se `audit_log_rotate_on_size` for 0, a rotação automática do arquivo de registro de auditoria é desativada e a rotação ocorre apenas quando realizada manualmente. Nesse caso, habilitar `audit_log_flush` definindo-o para 1 ou `ON` faz com que o plugin de registro de auditoria feche e volte a abrir seu arquivo de registro para esvaziá-lo. (O valor da variável permanece `OFF` para que você não precise desabilitá-la explicitamente antes de habilitá-la novamente para realizar outra esvaziamento.) Para mais informações, consulte Seção 6.4.5.5, “Configurando Características de Registro de Auditoria”.

- `audit_log_format`

  <table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  O formato do arquivo de registro de auditoria. Os valores permitidos são `OLD` (XML antigo), `NEW` (XML novo; o padrão) e (a partir do MySQL 5.7.21) `JSON`. Para obter detalhes sobre cada formato, consulte Seção 6.4.5.4, “Formatos de arquivos de registro de auditoria”.

  Nota

  Para obter informações sobre os problemas a serem considerados ao alterar o formato do log, consulte Selecionando o formato do arquivo de log de auditoria.

- `audit_log_format_unix_timestamp`

  <table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Esta variável só se aplica à saída do log de auditoria no formato JSON. Quando estiver ativada, essa variável faz com que cada registro do arquivo de log inclua um campo `time`. O valor do campo é um inteiro que representa o valor do timestamp UNIX, indicando a data e a hora em que o evento de auditoria foi gerado.

  Alterar o valor dessa variável em tempo de execução faz com que o arquivo de registro seja rotado, de modo que, para um arquivo de registro no formato JSON específico, todos os registros no arquivo incluem ou não o campo `time`.

- `audit_log_include_accounts`

  <table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Nota

  Esta variável só se aplica à filtragem do log de auditoria no modo legado (consulte Seção 6.4.5.10, “Filtragem do Log de Auditoria no Modo Legado”).

  As contas para as quais os eventos devem ser registrados. O valor deve ser `NULL` ou uma string contendo uma lista de um ou mais nomes de contas separados por vírgula. Para mais informações, consulte Seção 6.4.5.7, “Filtragem do Log de Auditoria”.

  As modificações em `audit_log_include_accounts` afetam apenas as conexões criadas após a modificação, e não as conexões existentes.

- `audit_log_policy`

  <table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Nota

  Esta variável só se aplica à filtragem do log de auditoria no modo legado (consulte Seção 6.4.5.10, “Filtragem do Log de Auditoria no Modo Legado”).

  A política que controla como o plugin de registro de auditoria escreve eventos em seu arquivo de log. A tabela a seguir mostra os valores permitidos.

  <table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  A variável `audit_log_policy` (audit-log-reference.html#sysvar_audit_log_policy) só pode ser definida na inicialização do servidor. Durante a execução, ela é uma variável de leitura somente. Outras duas variáveis de sistema, `audit_log_connection_policy` (audit-log-reference.html#sysvar_audit_log_connection_policy) e `audit_log_statement_policy` (audit-log-reference.html#sysvar_audit_log_statement_policy), oferecem um controle mais preciso sobre a política de registro e podem ser definidas na inicialização ou durante a execução. Se você usar `audit_log_policy` (audit-log-reference.html#sysvar_audit_log_policy) na inicialização em vez das outras duas variáveis, o servidor usará seu valor para definir essas variáveis. Para obter mais informações sobre as variáveis de política e sua interação, consulte Seção 6.4.5.5, “Configurando as Características do Registro de Auditoria”.

- `audit_log_read_buffer_size`

  <table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  O tamanho do buffer para leitura do arquivo de log de auditoria, em bytes. A função `audit_log_read()` não lê mais do que esse número de bytes. A leitura de arquivos de log é suportada apenas para o formato de log JSON. Para mais informações, consulte Seção 6.4.5.6, “Leitura de arquivos de log de auditoria”.

  A partir do MySQL 5.7.23, essa variável tem um valor padrão de 32 KB e pode ser definida em tempo de execução. Cada cliente deve definir o valor da sessão de `audit_log_read_buffer_size` de forma apropriada para o uso de `audit_log_read()`. Antes do MySQL 5.7.23, `audit_log_read_buffer_size` tem um valor padrão de 1 MB, afeta todos os clientes e só pode ser alterado na inicialização do servidor.

- `audit_log_rotate_on_size`

  <table frame="box" rules="all" summary="Propriedades para o log de auditoria"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Se `audit_log_rotate_on_size` for 0, o plugin de log de auditoria não realiza a rotação automática dos arquivos de log com base no tamanho. Se a rotação ocorrer, você deve realizá-la manualmente; consulte Rotação Manual do Arquivo de Log de Auditoria.

  Se `audit_log_rotate_on_size` for maior que 0, a rotação automática do arquivo de log com base no tamanho ocorre. Sempre que uma escrita no arquivo de log faz com que seu tamanho exceda o valor de `audit_log_rotate_on_size`, o plugin de log de auditoria renomeia o arquivo de log atual e abre um novo arquivo de log atual usando o nome original.

  Se você definir `audit_log_rotate_on_size` para um valor que não seja múltiplo de 4096, ele será truncado para o múltiplo mais próximo. Especificamente, definindo-o para um valor menor que 4096, ele será definido como 0 e nenhuma rotação ocorrerá, exceto manualmente.

  Para obter mais informações sobre a rotação do arquivo de registro de auditoria, consulte Gestão de Espaço de Arquivos de Registro de Auditoria.

- `audit_log_statement_policy`

  <table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>1048576</code></td> </tr><tr><th>Valor mínimo</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td><code>4096</code></td> </tr></tbody></table>

  Nota

  Esta variável só se aplica à filtragem do log de auditoria no modo legado (consulte Seção 6.4.5.10, “Filtragem do Log de Auditoria no Modo Legado”).

  A política que controla a forma como o plugin de registro de auditoria escreve eventos de declaração em seu arquivo de log. A tabela a seguir mostra os valores permitidos.

  <table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>1048576</code></td> </tr><tr><th>Valor mínimo</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td><code>4096</code></td> </tr></tbody></table>

  Nota

  Ao iniciar o servidor, qualquer valor explícito fornecido para `audit_log_statement_policy` pode ser substituído se `audit_log_policy` também for especificado, conforme descrito na Seção 6.4.5.5, “Configurando as Características do Registro de Auditoria”.

- `audit_log_strategy`

  <table frame="box" rules="all" summary="Propriedades para audit_log_buffer_size"><tbody><tr><th>Formato de linha de comando</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>1048576</code></td> </tr><tr><th>Valor mínimo</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td><code>4096</code></td> </tr></tbody></table>

  O método de registro usado pelo plugin de log de auditoria. Esses valores de estratégia são permitidos:

  - `ASYNCHRONOUS`: Registre de forma assíncrona. Aguarde espaço no buffer de saída.

  - `PERFORMANCE`: Registre de forma assíncrona. Descarte solicitações para as quais não há espaço suficiente no buffer de saída.

  - `SEMISYNCHRONOUS`: Registre de forma síncrona. Permita o cache pelo sistema operacional.

  - `SYNCHRONOUS`: Registre de forma síncrona. Chame `sync()` após cada solicitação.

##### Variáveis de Status do Registro de Auditoria

Se o plugin do log de auditoria estiver habilitado, ele exibe várias variáveis de status que fornecem informações operacionais. Essas variáveis estão disponíveis para o filtro de auditoria no modo legado e o filtro de auditoria no modo JSON.

- `Audit_log_current_size`

  O tamanho do arquivo de registro de auditoria atual. O valor aumenta quando um evento é escrito no log e é redefinido para 0 quando o log é rotado.

- `Audit_log_event_max_drop_size`

  O tamanho do maior evento excluído no modo de registro de desempenho. Para uma descrição dos modos de registro, consulte Seção 6.4.5.5, “Configurando as Características de Registro de Auditoria”.

- `Audit_log_events`

  O número de eventos gerenciados pelo plugin do log de auditoria, independentemente de terem sido escritos no log com base na política de filtragem (consulte Seção 6.4.5.5, "Configurando as Características do Registro de Auditoria").

- `Audit_log_events_filtered`

  O número de eventos tratados pelo plugin de registro de auditoria que foram filtrados (e não registrados no log) com base na política de filtragem (consulte Seção 6.4.5.5, "Configurando as Características do Registro de Auditoria").

- `Audit_log_events_lost`

  O número de eventos perdidos no modo de registro de desempenho porque um evento era maior que o espaço de buffer do log de auditoria disponível. Esse valor pode ser útil para avaliar como definir `audit_log_buffer_size` para dimensionar o buffer para o modo de desempenho. Para uma descrição dos modos de registro, consulte Seção 6.4.5.5, “Configurando Características de Registro de Auditoria”.

- `Audit_log_events_written`

  O número de eventos registrados no log de auditoria.

- `Audit_log_total_size`

  O tamanho total dos eventos gravados em todos os arquivos do log de auditoria. Ao contrário de `Audit_log_current_size`, o valor de `Audit_log_total_size` aumenta mesmo quando o log é rotado.

- `Audit_log_write_waits`

  O número de vezes que um evento teve que esperar por espaço no buffer do log de auditoria no modo de registro assíncrono. Para uma descrição dos modos de registro, consulte Seção 6.4.5.5, “Configurando as Características do Registro de Auditoria”.
