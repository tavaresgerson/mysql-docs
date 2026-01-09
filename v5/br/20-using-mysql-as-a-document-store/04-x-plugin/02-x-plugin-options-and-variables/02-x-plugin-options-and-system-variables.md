#### 19.4.2.2 Opções do Plugin e Variáveis do Sistema

Para controlar a ativação do X Plugin, use esta opção:

- `--mysqlx[=valor]`

  <table frame="box" rules="all" summary="Propriedades para mysqlx"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx[=valu<code>ON</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.12</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o X Plugin ao iniciar. Está disponível apenas se o plugin tiver sido registrado anteriormente com `INSTALL PLUGIN` ou estiver carregado com `--plugin-load` ou `--plugin-load-add`.

  O valor da opção deve ser uma das disponíveis para as opções de carregamento de plugins, conforme descrito na Seção 5.5.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--mysqlx=FORCE_PLUS_PERMANENT` indica ao servidor que carregue o plugin e impeça sua remoção enquanto o servidor estiver em execução.

Se o X Plugin estiver ativado, ele expõe várias variáveis de sistema que permitem o controle sobre sua operação:

- `mysqlx_bind_address`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>

  O endereço de rede no qual o X Plugin escuta as conexões TCP/IP. Essa variável não é dinâmica e pode ser configurada apenas durante o início. Esse é o equivalente do X Plugin à variável de sistema `bind_address`; consulte a descrição dessa variável para obter mais informações.

  `mysqlx_bind_address` aceita um único valor de endereço, que pode especificar um único endereço IP ou nome de host não com asterisco, ou um dos formatos de endereço com asterisco que permitem ouvir em múltiplas interfaces de rede (`*`, `0.0.0.0` ou `::`).

  Um endereço IP pode ser especificado como um endereço IPv4 ou IPv6. Se o valor for um nome de host, o X Plugin resolve o nome para um endereço IP e se vincula a esse endereço. Se um nome de host resolver para múltiplos endereços IP, o X Plugin usa o primeiro endereço IPv4, se houver algum, ou o primeiro endereço IPv6, caso contrário.

  O X Plugin trata diferentes tipos de endereços da seguinte forma:

  - Se o endereço for `*`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor e, se o host do servidor suportar IPv6, em todas as interfaces IPv6. Use este endereço para permitir conexões tanto IPv4 quanto IPv6 para o X Plugin. Este valor é o padrão.

  - Se o endereço for `0.0.0.0`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor.

  - Se o endereço for `::`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 e IPv6 do host do servidor.

  - Se o endereço for um endereço mapeado para IPv4, o X Plugin aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o X Plugin estiver vinculado a `::ffff:127.0.0.1`, um cliente como o MySQL Shell pode se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

  - Se o endereço for um endereço IPv4 ou IPv6 “regular” (como `127.0.0.1` ou `::1`), o X Plugin aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

  Se a vinculação ao endereço falhar, o X Plugin produz um erro e o servidor não carrega o plugin.

- `mysqlx_connect_timeout`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_connect_timeout"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-connect-timeout=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.12</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_connect_timeout">mysqlx_connect_timeout</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>30</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1000000000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  O número de segundos que o X Plugin espera para receber o primeiro pacote de clientes recém-conectados. Isso é o equivalente do `connect_timeout` do X Plugin; consulte a descrição dessa variável para obter mais informações.

- `mysqlx_idle_worker_thread_timeout`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_idle_worker_thread_timeout"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-idle-worker-thread-timeout=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.12</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_idle_worker_thread_timeout">mysqlx_idle_worker_thread_timeout</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>60</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>3600</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  O número de segundos após o qual os threads de trabalhadores inativos são terminados.

- `mysqlx_max_allowed_packet`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_max_allowed_packet"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-max-allowed-packet=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.12</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_max_allowed_packet">mysqlx_max_allowed_packet</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>67108864</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>512</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  O tamanho máximo dos pacotes de rede que podem ser recebidos pelo X Plugin. Este é o equivalente do X Plugin para `max_allowed_packet`; consulte a descrição dessa variável para obter mais informações.

- `mysqlx_max_connections`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_max_connections"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-max-connections=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.12</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_max_connections">mysqlx_max_connections</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>100</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

  O número máximo de conexões de clientes simultâneos que o X Plugin pode aceitar. Este é o equivalente do X Plugin para `max_connections`; consulte a descrição dessa variável para obter mais informações.

  Para modificações nesta variável, se o novo valor for menor que o número atual de conexões, o novo limite será considerado apenas para novas conexões.

- `mysqlx_min_worker_threads`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_min_worker_threads"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-min-worker-threads=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.12</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_min_worker_threads">mysqlx_min_worker_threads</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>2</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>100</code>]]</td> </tr></tbody></table>

  O número mínimo de threads de trabalhador usado pelo X Plugin para lidar com solicitações do cliente.

- `mysqlx_port`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.12</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_port">mysqlx_port</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33060</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

  O porta de rede no qual o X Plugin escuta conexões TCP/IP. Este é o equivalente do X Plugin à variável `port`; consulte a descrição dessa variável para obter mais informações.

- `mysqlx_port_open_timeout`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_port_open_timeout"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-port-open-timeout=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_port_open_timeout">mysqlx_port_open_timeout</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>120</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  O número de segundos que o X Plugin espera para uma porta TCP/IP ficar livre.

- `mysqlx_socket`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_socket"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-socket=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.15</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_socket">mysqlx_socket</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>/tmp/mysqlx.sock</code>]]</td> </tr></tbody></table>

  O caminho para um arquivo de soquete Unix que o Plugin X usa para conexões. Esta configuração é usada apenas pelo MySQL Server quando executado em sistemas operacionais Unix. Os clientes podem usar este soquete para se conectar ao MySQL Server usando o Plugin X.

  O caminho e o nome de arquivo padrão `mysqlx_socket` são baseados no caminho e no nome de arquivo padrão do arquivo de soquete principal do MySQL Server, com a adição de um `x` ao nome do arquivo. O caminho e o nome de arquivo padrão do arquivo de soquete principal são `/tmp/mysql.sock`, portanto, o caminho e o nome de arquivo padrão do arquivo de soquete do Plugin X são `/tmp/mysqlx.sock`.

  Se você especificar um caminho alternativo e um nome de arquivo para o arquivo de soquete principal na inicialização do servidor usando a variável de sistema `socket`, isso não afeta o padrão do arquivo de soquete do X Plugin. Nesta situação, se você quiser armazenar ambos os soquetes em um único caminho, você deve definir a variável de sistema `mysqlx_socket` também. Por exemplo, em um arquivo de configuração:

  ```sql
  socket=/home/sockets/mysqld/mysql.sock
  mysqlx_socket=/home/sockets/xplugin/xplugin.sock
  ```

  Se você alterar o caminho padrão e o nome do arquivo do soquete principal no momento da compilação usando a opção de compilação `MYSQL_UNIX_ADDR`, isso afetará o padrão do arquivo do soquete do Plugin X, que é formado adicionando um `x` ao nome do arquivo `MYSQL_UNIX_ADDR`. Se você quiser definir um padrão diferente para o arquivo do soquete do Plugin X no momento da compilação, use a opção de compilação `MYSQLX_UNIX_ADDR`.

  A variável de ambiente `MYSQLX_UNIX_PORT` também pode ser usada para definir um padrão para o arquivo de soquete do plugin X no início da inicialização do servidor (consulte a Seção 4.9, “Variáveis de Ambiente”). Se você definir essa variável de ambiente, ela substituirá o valor compilado `MYSQLX_UNIX_ADDR`, mas será substituída pelo valor `mysqlx_socket`.

- `mysqlx_ssl_ca`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_ca` é semelhante à `ssl_ca`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com o X Plugin”.

- `mysqlx_ssl_capath`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_capath` é semelhante à `ssl_capath`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com o X Plugin”.

- `mysqlx_ssl_cert`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_cert` é semelhante à `ssl_cert`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com o X Plugin”.

- `mysqlx_ssl_cipher`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_cipher` é semelhante à `ssl_cipher`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com o X Plugin”.

- `mysqlx_ssl_crl`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_crl` é semelhante à `ssl_crl`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com o X Plugin”.

- `mysqlx_ssl_crlpath`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_crlpath` é semelhante à `ssl_crlpath`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com o X Plugin”.

- `mysqlx_ssl_key`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.17</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_key` é semelhante à `ssl_key`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com o X Plugin”.
