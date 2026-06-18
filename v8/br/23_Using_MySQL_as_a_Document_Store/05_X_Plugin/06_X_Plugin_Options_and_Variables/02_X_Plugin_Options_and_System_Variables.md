#### 22.5.6.2 Opções do Plugin e Variáveis do Sistema

Para controlar a ativação do X Plugin, use esta opção:

- `--mysqlx[=value]`

  <table summary="Propriedades para mysqlx"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o X Plugin ao iniciar. No MySQL 8.0, o X Plugin está ativado por padrão, mas esta opção pode ser usada para controlar seu estado de ativação.

  O valor da opção deve ser uma das disponíveis para as opções de carregamento de plugins, conforme descrito na Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Se o X Plugin estiver ativado, ele expõe várias variáveis de sistema que permitem o controle sobre sua operação:

- `mysqlx_bind_address`

  <table summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_bind_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>

  O endereço de rede no qual o X Plugin escuta as conexões TCP/IP. Essa variável não é dinâmica e pode ser configurada apenas durante o início. Esse é o equivalente do X Plugin à variável de sistema `bind_address`; consulte a descrição dessa variável para obter mais informações.

  Por padrão, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor e, se o host do servidor suportar IPv6, em todas as interfaces IPv6. Se `mysqlx_bind_address` for especificado, seu valor deve atender a esses requisitos:

  - Antes do MySQL 8.0.21, `mysqlx_bind_address` aceita um único valor de endereço, que pode especificar um único endereço IP não wildcard (IPv4 ou IPv6), ou um nome de host, ou um dos formatos de endereço wildcard que permitem ouvir em múltiplas interfaces de rede (`*`, `0.0.0.0` ou `::`).

  - A partir do MySQL 8.0.21, `mysqlx_bind_address` aceita um único valor, conforme descrito acima, ou uma lista de valores separados por vírgula. Quando a variável lista múltiplos valores, cada valor deve especificar um endereço IP único (IPv4 ou IPv6) ou um nome de host. Formatos de endereço com caracteres curinga (`*`, `0.0.0.0` ou `::`) não são permitidos em uma lista de valores.

  - A partir do MySQL 8.0.22, o valor pode incluir um especificador de namespace de rede.

  Os endereços IP podem ser especificados como endereços IPv4 ou IPv6. Para qualquer valor que seja um nome de host, o X Plugin resolve o nome para um endereço IP e se vincula a esse endereço. Se um nome de host resolver para múltiplos endereços IP, o X Plugin usa o primeiro endereço IPv4, se houver algum, ou o primeiro endereço IPv6, caso contrário.

  O X Plugin trata diferentes tipos de endereços da seguinte forma:

  - Se o endereço for `*`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor e, se o host do servidor suportar IPv6, em todas as interfaces IPv6. Use este endereço para permitir conexões tanto IPv4 quanto IPv6 para o X Plugin. Este valor é o padrão. Se a variável especificar uma lista de múltiplos valores, este valor não é permitido.

  - Se o endereço for `0.0.0.0`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor. Se a variável especificar uma lista de múltiplos valores, esse valor não é permitido.

  - Se o endereço for `::`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 e IPv6 do host do servidor. Se a variável especificar uma lista de múltiplos valores, esse valor não é permitido.

  - Se o endereço for um endereço mapeado para IPv4, o X Plugin aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o X Plugin estiver vinculado a `::ffff:127.0.0.1`, um cliente como o MySQL Shell pode se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

  - Se o endereço for um endereço IPv4 ou IPv6 “regular” (como `127.0.0.1` ou `::1`), o X Plugin aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

  Essas regras se aplicam à especificação de um namespace de rede para um endereço:

  - Um espaço de rede pode ser especificado para um endereço IP ou um nome de host.

  - Não é possível especificar um espaço de rede para um endereço IP wildcard.

  - Para um endereço específico, o espaço de nome de rede é opcional. Se fornecido, ele deve ser especificado como um sufixo `/ns` imediatamente após o endereço.

  - Um endereço sem o sufixo `/ns` usa o espaço de nomes global do sistema host. Portanto, o espaço de nomes global é o padrão.

  - Um endereço com o sufixo `/ns` usa o namespace chamado `ns`.

  - O sistema de hospedagem deve suportar namespaces de rede e cada namespace nomeado deve ter sido configurado anteriormente. Nomear um namespace inexistente produz um erro.

  - Se o valor da variável especificar múltiplos endereços, ele pode incluir endereços no espaço de nomes global, em espaços de nomes nomeados ou uma mistura.

  Para obter informações adicionais sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a namespaces de rede”.

  Importante

  Como o X Plugin não é um plugin obrigatório, ele não impede o início do servidor se houver um erro no endereço especificado ou na lista de endereços (como o MySQL Server faz para os erros `bind_address`). Com o X Plugin, se um dos endereços listados não puder ser analisado ou se o X Plugin não conseguir se conectar a ele, o endereço é ignorado, uma mensagem de erro é registrada e o X Plugin tenta se conectar a cada um dos endereços restantes. A variável de status `Mysqlx_address` do X Plugin exibe apenas os endereços da lista para os quais a conexão teve sucesso. Se nenhum dos endereços listados resultar em uma conexão bem-sucedida ou se um único endereço especificado falhar, o X Plugin registra a mensagem de erro `ER_XPLUGIN_FAILED_TO_PREPARE_IO_INTERFACES`, afirmando que o X Protocol não pode ser usado. `mysqlx_bind_address` não é dinâmico, então para corrigir quaisquer problemas, você deve parar o servidor, corrigir o valor da variável do sistema e reiniciar o servidor.

- `mysqlx_compression_algorithms`

  <table summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_compression_algorithms</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>deflate_stream,lz4_message,zstd_stream</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>deflate_stream</code>]]</p><p class="valid-value">[[<code>lz4_message</code>]]</p><p class="valid-value">[[<code>zstd_stream</code>]]</p></td> </tr></tbody></table>

  Os algoritmos de compressão permitidos para uso em conexões do X Protocol. Por padrão, os algoritmos Deflate, LZ4 e zstd são permitidos. Para desabilitar qualquer um dos algoritmos, defina `mysqlx_compression_algorithms` para incluir apenas os que você permite. Os nomes dos algoritmos `deflate_stream`, `lz4_message` e `zstd_stream` podem ser especificados em qualquer combinação, e a ordem e o caso não são importantes. Se você definir a variável de sistema para a string vazia, nenhum algoritmo de compressão é permitido e apenas conexões não comprimidas são usadas. Use as variáveis de sistema específicas do algoritmo para ajustar o nível de compressão padrão e máximo para cada algoritmo permitido. Para mais detalhes e informações sobre como a compressão de conexões para o X Protocol se relaciona com as configurações equivalentes para o MySQL Server, consulte a Seção 22.5.5, “Compressão de Conexão com X Plugin”.

- `mysqlx_connect_timeout`

  <table summary="Propriedades para mysqlx_connect_timeout"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-connect-timeout=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_connect_timeout</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>30</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1000000000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  O número de segundos que o X Plugin espera para receber o primeiro pacote de clientes recém-conectados. Isso é o equivalente do X Plugin a `connect_timeout`; veja a descrição daquela variável para mais informações.

- `mysqlx_deflate_default_compression_level`

  <table summary="Propriedades para mysqlx_deflate_default_compression_level"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx_deflate_default_compression_level=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.20</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_deflate_default_compression_level</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>9</code>]]</td> </tr></tbody></table>

  O nível de compressão padrão que o servidor usa para o algoritmo Deflate em conexões do protocolo X. Especifique o nível como um inteiro de 1 (o menor esforço de compressão) a 9 (o maior esforço). Este nível é usado se o cliente não solicitar um nível de compressão durante a negociação de capacidades. Se você não especificar esta variável de sistema, o servidor usa o nível 3 como padrão. Para mais informações, consulte a Seção 22.5.5, “Compressão de Conexão com Plugin X”.

- `mysqlx_deflate_max_client_compression_level`

  <table summary="Propriedades para mysqlx_deflate_max_client_compression_level"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx_deflate_max_client_compression_level=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.20</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_deflate_max_client_compression_level</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>9</code>]]</td> </tr></tbody></table>

  O nível máximo de compressão que o servidor permite para o algoritmo Deflate em conexões do Protocolo X. A faixa é a mesma que para o nível de compressão padrão para este algoritmo. Se o cliente solicitar um nível de compressão mais alto que este, o servidor usará o nível que você definiu aqui. Se você não especificar esta variável de sistema, o servidor define um nível máximo de compressão de 5.

- `mysqlx_document_id_unique_prefix`

  <table summary="Propriedades para mysqlx_document_id_unique_prefix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-document-id-unique-prefix=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_document_id_unique_prefix</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

  Define os primeiros 4 bytes dos IDs de documentos gerados pelo servidor quando os documentos são adicionados a uma coleção. Ao definir essa variável para um valor único por instância, você pode garantir que os IDs de documentos sejam únicos em todas as instâncias. Veja Entendendo IDs de documentos.

- `mysqlx_enable_hello_notice`

  <table summary="Propriedades para mysqlx_enable_hello_notice"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-enable-hello-notice[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_enable_hello_notice</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  Controla as mensagens enviadas para clientes clássicos do protocolo MySQL que tentam se conectar através do protocolo X. Quando ativado, clientes que não suportam o protocolo X que tentam se conectar à porta do servidor X Protocol recebem um erro explicando que estão usando o protocolo errado.

- `mysqlx_idle_worker_thread_timeout`

  <table summary="Propriedades para mysqlx_idle_worker_thread_timeout"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-idle-worker-thread-timeout=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_idle_worker_thread_timeout</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>60</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>3600</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  O número de segundos após o qual os threads de trabalhadores inativos são terminados.

- `mysqlx_interactive_timeout`

  <table summary="Propriedades para mysqlx_interactive_timeout"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-interactive-timeout=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_interactive_timeout</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>28800</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  O valor padrão da variável de sessão `mysqlx_wait_timeout` para clientes interativos. (O número de segundos para aguardar até que os clientes interativos expirem.)

- `mysqlx_lz4_default_compression_level`

  <table summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_bind_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>0

  O nível de compressão padrão que o servidor usa para o algoritmo LZ4 nas conexões do Protocolo X. Especifique o nível como um inteiro de 0 (o menor esforço de compressão) a 16 (o maior esforço). Este nível é usado se o cliente não solicitar um nível de compressão durante a negociação de capacidades. Se você não especificar esta variável de sistema, o servidor usa o nível 2 como padrão. Para mais informações, consulte a Seção 22.5.5, “Compressão de Conexão com Plugin X”.

- `mysqlx_lz4_max_client_compression_level`

  <table summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_bind_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>1

  O nível de compressão máximo que o servidor permite para o algoritmo LZ4 nas conexões do X Protocol. A faixa é a mesma que para o nível de compressão padrão para este algoritmo. Se o cliente solicitar um nível de compressão mais alto que este, o servidor usará o nível que você definiu aqui. Se você não especificar esta variável de sistema, o servidor define um nível de compressão máximo de 8.

- `mysqlx_max_allowed_packet`

  <table summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_bind_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>2

  O tamanho máximo dos pacotes de rede que podem ser recebidos pelo X Plugin. Esse limite também se aplica quando a compressão é usada para a conexão, portanto, o pacote de rede deve ser menor que esse tamanho após a mensagem ter sido descomprimida. Esse é o equivalente do X Plugin de `max_allowed_packet`; veja a descrição daquela variável para mais informações.

- `mysqlx_max_connections`

  <table summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_bind_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>3

  O número máximo de conexões de clientes simultâneos que o X Plugin pode aceitar. Este é o equivalente do `max_connections` do X Plugin; consulte a descrição dessa variável para obter mais informações.

  Para modificações nesta variável, se o novo valor for menor que o número atual de conexões, o novo limite será considerado apenas para novas conexões.

- `mysqlx_min_worker_threads`

  <table summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_bind_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>4

  O número mínimo de threads de trabalhador usado pelo X Plugin para lidar com solicitações do cliente.

- `mysqlx_port`

  <table summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_bind_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>5

  O porta de rede no qual o X Plugin escuta as conexões TCP/IP. Este é o equivalente do X Plugin ao `port`; veja a descrição dessa variável para obter mais informações.

- `mysqlx_port_open_timeout`

  <table summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_bind_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>6

  O número de segundos que o X Plugin espera para uma porta TCP/IP ficar livre.

- `mysqlx_read_timeout`

  <table summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_bind_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>7

  O número de segundos que o X Plugin espera para bloquear operações de leitura a serem concluídas. Após esse tempo, se a operação de leitura não for bem-sucedida, o X Plugin fecha a conexão e retorna um aviso com o código de erro ER\_IO\_READ\_ERROR para o aplicativo cliente.

- `mysqlx_socket`

  <table summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_bind_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>8

  O caminho para um arquivo de soquete Unix que o Plugin X usa para conexões. Esta configuração é usada apenas pelo MySQL Server quando executado em sistemas operacionais Unix. Os clientes podem usar este soquete para se conectar ao MySQL Server usando o Plugin X.

  O caminho e o nome de arquivo padrão `mysqlx_socket` são baseados no caminho e no nome de arquivo padrão para o arquivo de soquete principal do MySQL Server, com a adição de um `x` ao nome do arquivo. O caminho e o nome de arquivo padrão para o arquivo de soquete principal são `/tmp/mysql.sock`, portanto, o caminho e o nome de arquivo padrão para o arquivo de soquete do Plugin X são `/tmp/mysqlx.sock`.

  Se você especificar um caminho alternativo e um nome de arquivo para o arquivo de soquete principal na inicialização do servidor usando a variável de sistema `socket`, isso não afeta o padrão do arquivo de soquete do X Plugin. Nesta situação, se você quiser armazenar ambos os soquetes em um único caminho, você deve definir a variável de sistema `mysqlx_socket` também. Por exemplo, em um arquivo de configuração:

  ```
  socket=/home/sockets/mysqld/mysql.sock
  mysqlx_socket=/home/sockets/xplugin/xplugin.sock
  ```

  Se você alterar o caminho padrão e o nome do arquivo do soquete principal no momento da compilação usando a opção de compilação `MYSQL_UNIX_ADDR`, isso afeta o padrão do arquivo do soquete do Plugin X, que é formado adicionando um `x` ao nome do arquivo `MYSQL_UNIX_ADDR`. Se você quiser definir um padrão diferente para o arquivo do soquete do Plugin X no momento da compilação, use a opção de compilação `MYSQLX_UNIX_ADDR`.

  A variável de ambiente `MYSQLX_UNIX_PORT` também pode ser usada para definir um padrão para o arquivo de soquete do plugin X ao iniciar o servidor (consulte a Seção 6.9, “Variáveis de Ambiente”). Se você definir essa variável de ambiente, ela substituirá o valor compilado `MYSQLX_UNIX_ADDR`, mas será substituída pelo valor `mysqlx_socket`.

- `mysqlx_ssl_ca`

  <table summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-bind-address=addr</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_bind_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>9

  A variável de sistema `mysqlx_ssl_ca` é semelhante à `ssl_ca`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

- `mysqlx_ssl_capath`

  <table summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_compression_algorithms</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>deflate_stream,lz4_message,zstd_stream</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>deflate_stream</code>]]</p><p class="valid-value">[[<code>lz4_message</code>]]</p><p class="valid-value">[[<code>zstd_stream</code>]]</p></td> </tr></tbody></table>0

  A variável de sistema `mysqlx_ssl_capath` é semelhante à `ssl_capath`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

- `mysqlx_ssl_cert`

  <table summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_compression_algorithms</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>deflate_stream,lz4_message,zstd_stream</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>deflate_stream</code>]]</p><p class="valid-value">[[<code>lz4_message</code>]]</p><p class="valid-value">[[<code>zstd_stream</code>]]</p></td> </tr></tbody></table>1

  A variável de sistema `mysqlx_ssl_cert` é semelhante à `ssl_cert`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

- `mysqlx_ssl_cipher`

  <table summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_compression_algorithms</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>deflate_stream,lz4_message,zstd_stream</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>deflate_stream</code>]]</p><p class="valid-value">[[<code>lz4_message</code>]]</p><p class="valid-value">[[<code>zstd_stream</code>]]</p></td> </tr></tbody></table>2

  A variável de sistema `mysqlx_ssl_cipher` é semelhante à `ssl_cipher`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

- `mysqlx_ssl_crl`

  <table summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_compression_algorithms</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>deflate_stream,lz4_message,zstd_stream</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>deflate_stream</code>]]</p><p class="valid-value">[[<code>lz4_message</code>]]</p><p class="valid-value">[[<code>zstd_stream</code>]]</p></td> </tr></tbody></table>3

  A variável de sistema `mysqlx_ssl_crl` é semelhante à `ssl_crl`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

- `mysqlx_ssl_crlpath`

  <table summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_compression_algorithms</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>deflate_stream,lz4_message,zstd_stream</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>deflate_stream</code>]]</p><p class="valid-value">[[<code>lz4_message</code>]]</p><p class="valid-value">[[<code>zstd_stream</code>]]</p></td> </tr></tbody></table>4

  A variável de sistema `mysqlx_ssl_crlpath` é semelhante à `ssl_crlpath`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

- `mysqlx_ssl_key`

  <table summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_compression_algorithms</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>deflate_stream,lz4_message,zstd_stream</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>deflate_stream</code>]]</p><p class="valid-value">[[<code>lz4_message</code>]]</p><p class="valid-value">[[<code>zstd_stream</code>]]</p></td> </tr></tbody></table>5

  A variável de sistema `mysqlx_ssl_key` é semelhante à `ssl_key`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

- `mysqlx_wait_timeout`

  <table summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_compression_algorithms</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>deflate_stream,lz4_message,zstd_stream</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>deflate_stream</code>]]</p><p class="valid-value">[[<code>lz4_message</code>]]</p><p class="valid-value">[[<code>zstd_stream</code>]]</p></td> </tr></tbody></table>6

  O número de segundos que o X Plugin espera por atividade em uma conexão. Após esse tempo, se a operação de leitura não for bem-sucedida, o X Plugin fecha a conexão. Se o cliente não for interativo, o valor inicial da variável de sessão é copiado da variável global `mysqlx_wait_timeout`. Para clientes interativos, o valor inicial é copiado da sessão `mysqlx_interactive_timeout`.

- `mysqlx_write_timeout`

  <table summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_compression_algorithms</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>deflate_stream,lz4_message,zstd_stream</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>deflate_stream</code>]]</p><p class="valid-value">[[<code>lz4_message</code>]]</p><p class="valid-value">[[<code>zstd_stream</code>]]</p></td> </tr></tbody></table>7

  O número de segundos que o X Plugin espera para bloquear operações de escrita para serem concluídas. Após esse tempo, se a operação de escrita não for bem-sucedida, o X Plugin fecha a conexão.

- `mysqlx_zstd_default_compression_level`

  <table summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_compression_algorithms</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>deflate_stream,lz4_message,zstd_stream</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>deflate_stream</code>]]</p><p class="valid-value">[[<code>lz4_message</code>]]</p><p class="valid-value">[[<code>zstd_stream</code>]]</p></td> </tr></tbody></table>8

  O nível de compressão padrão que o servidor usa para o algoritmo zstd nas conexões do protocolo X. Para versões da biblioteca zstd a partir da 1.4.0, você pode definir valores positivos de 1 a 22 (o maior esforço de compressão) ou valores negativos que representam um esforço progressivamente menor. Um valor de 0 é convertido para um valor de 1. Para versões anteriores da biblioteca zstd, você só pode especificar o valor 3. Esse nível é usado se o cliente não solicitar um nível de compressão durante a negociação de capacidades. Se você não especificar essa variável de sistema, o servidor usa o nível 3 como padrão. Para mais informações, consulte a Seção 22.5.5, “Compressão de Conexão com X Plugin”.

- `mysqlx_zstd_max_client_compression_level`

  <table summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--mysqlx-compression-algorithms=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysqlx_compression_algorithms</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td>[[<code>deflate_stream,lz4_message,zstd_stream</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>deflate_stream</code>]]</p><p class="valid-value">[[<code>lz4_message</code>]]</p><p class="valid-value">[[<code>zstd_stream</code>]]</p></td> </tr></tbody></table>9

  O nível de compressão máximo que o servidor permite para o algoritmo zstd nas conexões do X Protocol. A faixa é a mesma que para o nível de compressão padrão para este algoritmo. Se o cliente solicitar um nível de compressão mais alto que este, o servidor usará o nível que você definiu aqui. Se você não especificar esta variável de sistema, o servidor definirá um nível de compressão máximo de 11.
