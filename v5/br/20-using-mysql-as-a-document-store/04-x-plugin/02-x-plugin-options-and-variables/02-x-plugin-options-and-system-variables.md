#### 19.4.2.2 Opções e Variáveis de Sistema do X Plugin

Para controlar a ativação do X Plugin, use esta opção:

* `--mysqlx[=value]`

  <table frame="box" rules="all" summary="Propriedades para mysqlx"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx[=value]</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.12</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Esta opção controla como o Server carrega o X Plugin na inicialização. Está disponível apenas se o Plugin tiver sido registrado anteriormente com `INSTALL PLUGIN` ou se for carregado com `--plugin-load` ou `--plugin-load-add`.

  O valor da opção deve ser um daqueles disponíveis para opções de carregamento de Plugin, conforme descrito na Seção 5.5.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--mysqlx=FORCE_PLUS_PERMANENT` instrui o Server a carregar o Plugin e impedir que ele seja removido enquanto o Server estiver em execução.

Se o X Plugin estiver habilitado, ele expõe várias variáveis de sistema que permitem controlar sua operação:

* `mysqlx_bind_address`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>*</code></td> </tr></tbody></table>

  O endereço de rede no qual o X Plugin escuta por conexões TCP/IP. Esta variável não é Dynamic e só pode ser configurada na inicialização. Este é o equivalente do X Plugin para a variável de sistema `bind_address`; consulte a descrição dessa variável para mais informações.

  `mysqlx_bind_address` aceita um único valor de endereço, que pode especificar um único endereço IP não-wildcard ou nome de host, ou um dos formatos de endereço wildcard que permitem escutar em múltiplas interfaces de rede (`*`, `0.0.0.0` ou `::`).

  Um endereço IP pode ser especificado como um endereço IPv4 ou IPv6. Se o valor for um nome de host, o X Plugin resolve o nome para um endereço IP e faz o bind para esse endereço. Se um nome de host resolver para múltiplos endereços IP, o X Plugin usa o primeiro endereço IPv4, se houver, ou o primeiro endereço IPv6, caso contrário.

  O X Plugin trata diferentes tipos de endereços da seguinte forma:

  + Se o endereço for `*`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 do Server host e, se o Server host suportar IPv6, em todas as interfaces IPv6. Use este endereço para permitir conexões IPv4 e IPv6 para o X Plugin. Este valor é o padrão.

  + Se o endereço for `0.0.0.0`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 do Server host.

  + Se o endereço for `::`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 e IPv6 do Server host.

  + Se o endereço for um endereço mapeado para IPv4, o X Plugin aceita conexões TCP/IP para esse endereço, tanto no formato IPv4 quanto IPv6. Por exemplo, se o X Plugin estiver ligado a `::ffff:127.0.0.1`, um Client como o MySQL Shell pode conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

  + Se o endereço for um endereço IPv4 ou IPv6 “regular” (como `127.0.0.1` ou `::1`), o X Plugin aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

  Se o bind para o endereço falhar, o X Plugin gera um erro e o Server não o carrega.

* `mysqlx_connect_timeout`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_connect_timeout"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-connect-timeout=#</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.12</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_connect_timeout</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>30</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1000000000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  O número de segundos que o X Plugin espera para que o primeiro pacote seja recebido de Clients recém-conectados. Este é o equivalente do X Plugin para `connect_timeout`; consulte a descrição dessa variável para mais informações.

* `mysqlx_idle_worker_thread_timeout`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_idle_worker_thread_timeout"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-idle-worker-thread-timeout=#</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.12</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_idle_worker_thread_timeout</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>60</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>3600</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  O número de segundos após o qual as worker threads ociosas são encerradas.

* `mysqlx_max_allowed_packet`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_max_allowed_packet"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-max-allowed-packet=#</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.12</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_max_allowed_packet</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>67108864</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>512</code></td> </tr><tr><th>Valor Máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr></tbody></table>

  O tamanho máximo dos pacotes de rede que podem ser recebidos pelo X Plugin. Este é o equivalente do X Plugin para `max_allowed_packet`; consulte a descrição dessa variável para mais informações.

* `mysqlx_max_connections`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_max_connections"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-max-connections=#</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.12</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_max_connections</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>100</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O número máximo de conexões de Client simultâneas que o X Plugin pode aceitar. Este é o equivalente do X Plugin para `max_connections`; consulte a descrição dessa variável para mais informações.

  Para modificações nesta variável, se o novo valor for menor que o número atual de conexões, o novo limite é levado em consideração apenas para novas conexões.

* `mysqlx_min_worker_threads`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_min_worker_threads"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-min-worker-threads=#</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.12</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_min_worker_threads</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>2</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>100</code></td> </tr></tbody></table>

  O número mínimo de worker threads usadas pelo X Plugin para lidar com solicitações de Client.

* `mysqlx_port`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-port=port_num</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.12</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_port</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>33060</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  A porta de rede na qual o X Plugin escuta por conexões TCP/IP. Este é o equivalente do X Plugin para `port`; consulte a descrição dessa variável para mais informações.

* `mysqlx_port_open_timeout`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_port_open_timeout"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-port-open-timeout=#</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_port_open_timeout</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>120</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  O número de segundos que o X Plugin espera para que uma porta TCP/IP se torne livre.

* `mysqlx_socket`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_socket"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-socket=file_name</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.15</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_socket</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>/tmp/mysqlx.sock</code></td> </tr></tbody></table>

  O caminho para um arquivo Unix socket que o X Plugin usa para conexões. Esta configuração é usada apenas pelo MySQL Server quando executado em sistemas operacionais Unix. Os Clients podem usar este socket para conectar-se ao MySQL Server usando o X Plugin.

  O caminho e nome de arquivo padrão `mysqlx_socket` são baseados no caminho e nome de arquivo padrão para o arquivo socket principal do MySQL Server, com a adição de um 'x' anexado ao nome do arquivo. O caminho e nome de arquivo padrão para o arquivo socket principal é `/tmp/mysql.sock`, portanto, o caminho e nome de arquivo padrão para o arquivo socket do X Plugin é `/tmp/mysqlx.sock`.

  Se você especificar um caminho e nome de arquivo alternativos para o arquivo socket principal na inicialização do Server usando a variável de sistema `socket`, isso não afeta o padrão para o arquivo socket do X Plugin. Nesta situação, se você quiser armazenar ambos os sockets em um único caminho, você também deve definir a variável de sistema `mysqlx_socket`. Por exemplo, em um arquivo de configuração:

  ```sql
  socket=/home/sockets/mysqld/mysql.sock
  mysqlx_socket=/home/sockets/xplugin/xplugin.sock
  ```

  Se você alterar o caminho e nome de arquivo padrão para o arquivo socket principal no momento da compilação usando a opção de compilação `MYSQL_UNIX_ADDR`, isso afeta o padrão para o arquivo socket do X Plugin, que é formado anexando um 'x' ao nome de arquivo `MYSQL_UNIX_ADDR`. Se você quiser definir um padrão diferente para o arquivo socket do X Plugin no momento da compilação, use a opção de compilação `MYSQLX_UNIX_ADDR`.

  A variável de ambiente `MYSQLX_UNIX_PORT` também pode ser usada para definir um padrão para o arquivo socket do X Plugin na inicialização do Server (consulte a Seção 4.9, “Environment Variables”). Se você definir esta variável de ambiente, ela anula o valor compilado `MYSQLX_UNIX_ADDR`, mas é anulada pelo valor de `mysqlx_socket`.

* `mysqlx_ssl_ca`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>*</code></td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_ca` é como `ssl_ca`, exceto que se aplica ao X Plugin em vez da interface de conexão principal do MySQL Server. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com X Plugin”.

* `mysqlx_ssl_capath`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>*</code></td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_capath` é como `ssl_capath`, exceto que se aplica ao X Plugin em vez da interface de conexão principal do MySQL Server. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com X Plugin”.

* `mysqlx_ssl_cert`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>*</code></td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_cert` é como `ssl_cert`, exceto que se aplica ao X Plugin em vez da interface de conexão principal do MySQL Server. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com X Plugin”.

* `mysqlx_ssl_cipher`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>*</code></td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_cipher` é como `ssl_cipher`, exceto que se aplica ao X Plugin em vez da interface de conexão principal do MySQL Server. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com X Plugin”.

* `mysqlx_ssl_crl`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>*</code></td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_crl` é como `ssl_crl`, exceto que se aplica ao X Plugin em vez da interface de conexão principal do MySQL Server. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com X Plugin”.

* `mysqlx_ssl_crlpath`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>*</code></td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_crlpath` é como `ssl_crlpath`, exceto que se aplica ao X Plugin em vez da interface de conexão principal do MySQL Server. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com X Plugin”.

* `mysqlx_ssl_key`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduzido em</th> <td>5.7.17</td> </tr><tr><th>Variável de Sistema</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>*</code></td> </tr></tbody></table>

  A variável de sistema `mysqlx_ssl_key` é como `ssl_key`, exceto que se aplica ao X Plugin em vez da interface de conexão principal do MySQL Server. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 19.4.1, “Usando Conexões Criptografadas com X Plugin”.
