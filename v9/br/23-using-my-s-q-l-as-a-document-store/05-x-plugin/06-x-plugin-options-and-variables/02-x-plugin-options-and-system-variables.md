#### 22.5.6.2 Opções do Plugin e Variáveis do Sistema

Para controlar a ativação do X Plugin, use esta opção:

* `--mysqlx[=valor]`

  <table frame="box" rules="all" summary="Propriedades para mysqlx"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx[=valor]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o X Plugin ao iniciar. No MySQL 9.5, o X Plugin está habilitado por padrão, mas esta opção pode ser usada para controlar seu estado de ativação.

  O valor da opção deve ser um dos disponíveis para as opções de carregamento de plugins, conforme descrito na Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Se o X Plugin estiver habilitado, ele expõe várias variáveis de sistema que permitem o controle de sua operação:

* `mysqlx_bind_address`

<table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--mysqlx-bind-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">*</code></td>
  </tr>
</table>

  O endereço de rede no qual o X Plugin escuta conexões TCP/IP. Esta variável não é dinâmica e pode ser configurada apenas no momento do início. Este é o equivalente do X Plugin à variável de sistema `bind_address`; consulte a descrição dessa variável para obter mais informações.

  Por padrão, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor e, se o host do servidor suportar IPv6, em todas as interfaces IPv6. Se o `mysqlx_bind_address` for especificado, seu valor deve atender a esses requisitos:

  + Um único valor de endereço, que pode especificar um único endereço IP não wildcard (seja IPv4 ou IPv6) ou um nome de host, ou um dos formatos de endereço wildcard que permitem ouvir em múltiplas interfaces de rede (`*`, `0.0.0.0` ou `::`).

+ Uma lista de valores separados por vírgula. Quando a variável lista múltiplos valores, cada valor deve especificar um endereço IP único e não wildcard (seja IPv4 ou IPv6) ou um nome de host. Endereços wildcard (`*`, `0.0.0.0` ou `::`) não são permitidos em uma lista de valores.

+ O valor também pode incluir um especificador de namespace de rede.

+ Endereços IP podem ser especificados como endereços IPv4 ou IPv6. Para qualquer valor que seja um nome de host, o X Plugin resolve o nome para um endereço IP e se vincula a esse endereço. Se um nome de host resolver para múltiplos endereços IP, o X Plugin usa o primeiro endereço IPv4, se houver algum, ou o primeiro endereço IPv6, caso contrário.

+ O X Plugin trata diferentes tipos de endereços da seguinte forma:

+ Se o endereço for `*`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor e, se o host do servidor suportar IPv6, em todas as interfaces IPv6. Use este endereço para permitir conexões tanto IPv4 quanto IPv6 para o X Plugin. Este valor é o padrão. Se a variável especificar uma lista de múltiplos valores, este valor não é permitido.

+ Se o endereço for `0.0.0.0`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor. Se a variável especificar uma lista de múltiplos valores, este valor não é permitido.

+ Se o endereço for `::`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 e IPv6 do host do servidor. Se a variável especificar uma lista de múltiplos valores, este valor não é permitido.

+ Se o endereço for um endereço mapeado para IPv4, o X Plugin aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o X Plugin estiver vinculado a `::ffff:127.0.0.1`, um cliente como o MySQL Shell pode se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

+ Se o endereço for um endereço IPv4 ou IPv6 "regular" (como `127.0.0.1` ou `::1`), o X Plugin aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

Essas regras se aplicam à especificação de um namespace de rede para um endereço:

+ Um namespace de rede pode ser especificado para um endereço IP ou um nome de host.

+ Um namespace de rede não pode ser especificado para um endereço IP wildcard.

+ Para um endereço específico, o namespace de rede é opcional. Se fornecido, ele deve ser especificado como um sufixo `/ns` imediatamente após o endereço.

+ Um endereço sem o sufixo `/ns` usa o namespace global do sistema de host. Portanto, o namespace global é o padrão.

+ Um endereço com o sufixo `/ns` usa o namespace chamado *`ns`*.

+ O sistema de host deve suportar namespaces de rede e cada namespace nomeado deve ter sido configurado anteriormente. Nomear um namespace inexistente produz um erro.

+ Se o valor da variável especificar múltiplos endereços, pode incluir endereços no namespace global, em namespaces nomeados ou uma mistura.

Para obter informações adicionais sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a Namespace de Rede”.

Importante

Como o X Plugin não é um plugin obrigatório, ele não impede o início do servidor se houver um erro no endereço especificado ou na lista de endereços (como o MySQL Server faz para erros de `bind_address`). Com o X Plugin, se um dos endereços listados não puder ser analisado ou se o X Plugin não conseguir se conectar a ele, o endereço é ignorado, uma mensagem de erro é registrada e o X Plugin tenta se conectar a cada um dos endereços restantes. A variável de status `Mysqlx_address` do X Plugin exibe apenas os endereços da lista para os quais a conexão teve sucesso. Se nenhum dos endereços listados resultar em uma conexão bem-sucedida ou se um único endereço especificado falhar, o X Plugin registra a mensagem de erro `ER_XPLUGIN_FAILED_TO_PREPARE_IO_INTERFACES`, afirmando que o X Protocol não pode ser usado. `mysqlx_bind_address` não é dinâmico, então para corrigir quaisquer problemas, você deve parar o servidor, corrigir o valor da variável do sistema e reiniciar o servidor.

<table frame="box" rules="all" summary="Propriedades para mysqlx_compression_algorithms">
<tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-compression-algorithms=valor</code></td> </tr>
<tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_compression_algorithms">mysqlx_compression_algorithms</a></code></td> </tr>
<tr><th>Alcance</th> <td>Global</td> </tr>
<tr><th>Dinâmico</th> <td>Sim</td> </tr>
<tr><th>Hinta de Definição de Variável</th> <td>Não</td> </tr>
<tr><th>Tipo</th> <td>Definir</td> </tr>
<tr><th>Valor Padrão</th> <td><code class="literal">deflate_stream,lz4_message,zstd_stream</code></td> </tr>
<tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">deflate_stream</code></p><p class="valid-value"><code class="literal">lz4_message</code></p><p class="valid-value"><code class="literal">zstd_stream</code></p></td> </tr>
</table>

Os algoritmos de compressão permitidos para uso em conexões do X Protocol. Por padrão, os algoritmos Deflate, LZ4 e zstd são permitidos. Para desabilitar qualquer um dos algoritmos, defina `mysqlx_compression_algorithms` para incluir apenas os que você permitir. Os nomes dos algoritmos `deflate_stream`, `lz4_message` e `zstd_stream` podem ser especificados em qualquer combinação, e a ordem e o caso não são importantes. Se você definir a variável de sistema para a string vazia, nenhum algoritmo de compressão é permitido e apenas conexões não comprimidas são usadas. Use as variáveis de sistema específicas do algoritmo para ajustar o nível de compressão padrão e máximo para cada algoritmo permitido. Para mais detalhes e informações sobre como a compressão de conexões para o X Protocol se relaciona com as configurações equivalentes para o MySQL Server, consulte a Seção 22.5.5, “Compressão de Conexão com X Plugin”.

* `mysqlx_connect_timeout`

<table frame="box" rules="all" summary="Propriedades para mysqlx_connect_timeout">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-connect-timeout=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_connect_timeout">mysqlx_connect_timeout</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">30</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code class="literal">1000000000</code></td> </tr>
  <tr><th>Unidade</th> <td>segundos</td> </tr>
</table>

O número de segundos que o X Plugin espera pelo primeiro pacote ser recebido de clientes recém-conectados. Este é o equivalente do X Plugin a `connect_timeout`; consulte a descrição dessa variável para obter mais informações.

* `mysqlx_deflate_default_compression_level`

<table frame="box" rules="all" summary="Propriedades para mysqlx_deflate_default_compression_level"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx_deflate_default_compression_level=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_deflate_default_compression_level">mysqlx_deflate_default_compression_level</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">3</code></td> </tr><tr><th>Valor Mínimo</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">9</code></td> </tr></tbody></table>

O nível de compressão padrão que o servidor usa para o algoritmo Deflate no X Protocol. Especifique o nível como um inteiro de 1 (o menor esforço de compressão) a 9 (o maior esforço). Este nível é usado se o cliente não solicitar um nível de compressão durante a negociação de capacidades. Se você não especificar esta variável do sistema, o servidor usa o nível 3 como padrão. Para mais informações, consulte a Seção 22.5.5, “Compressão de Conexão com X Plugin”.

* `mysqlx_deflate_max_client_compression_level`

<table frame="box" rules="all" summary="Propriedades para mysqlx_deflate_max_client_compression_level">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx_deflate_max_client_compression_level=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_deflate_max_client_compression_level">mysqlx_deflate_max_client_compression_level</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">5</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code class="literal">9</code></td> </tr>
</table>

O nível máximo de compressão que o servidor permite para o algoritmo Deflate no X Protocol. A faixa é a mesma que para o nível de compressão padrão para este algoritmo. Se o cliente solicitar um nível de compressão maior que este, o servidor usa o nível que você configurou aqui. Se você não especificar esta variável do sistema, o servidor define um nível de compressão máximo de 5.

* `mysqlx_document_id_unique_prefix`

<table frame="box" rules="all" summary="Propriedades para mysqlx_document_id_unique_prefix">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--mysqlx-document-id-unique-prefix=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_document_id_unique_prefix">mysqlx_document_id_unique_prefix</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">0</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code class="literal">0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code class="literal">65535</code></td>
  </tr>
</table>

  Define os primeiros 4 bytes dos IDs de documentos gerados pelo servidor quando os documentos são adicionados a uma coleção. Ao definir essa variável para um valor único por instância, você pode garantir que os IDs de documentos sejam únicos em todas as instâncias. Veja Entendendo IDs de Documentos.

* `mysqlx_enable_hello_notice`

<table frame="box" rules="all" summary="Propriedades para mysqlx_enable_hello_notice">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--mysqlx-enable-hello-notice[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_enable_hello_notice">mysqlx_enable_hello_notice</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">ON</code></td>
  </tr>
</table>

  Controla mensagens enviadas para clientes do protocolo MySQL clássico que tentam se conectar via protocolo X. Quando habilitado, clientes que não suportam o protocolo X que tentam se conectar à porta do servidor X Protocol recebem um erro explicando que estão usando o protocolo errado.

* `mysqlx_idle_worker_thread_timeout`

<table frame="box" rules="all" summary="Propriedades para mysqlx_idle_worker_thread_timeout">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-idle-worker-thread-timeout=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_idle_worker_thread_timeout">mysqlx_idle_worker_thread_timeout</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">60</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code class="literal">3600</code></td> </tr>
  <tr><th>Unidade</th> <td>segundos</td> </tr>
</table>

O número de segundos após o qual os threads de trabalhadores ociosos são encerrados.

<table frame="box" rules="all" summary="Propriedades para mysqlx_interactive_timeout">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-interactive-timeout=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_interactive_timeout">mysqlx_interactive_timeout</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">28800</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code class="literal">1</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code class="literal">2147483</code></td> </tr>
  <tr><th>Unidade</th> <td>segundos</td> </tr>
</table>

O valor padrão da variável de sessão `mysqlx_wait_timeout` para clientes interativos. (O número de segundos para aguardar que clientes interativos excedam o tempo de espera.)

* `mysqlx_lz4_default_compression_level`

<table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-bind-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">*</code></td> </tr></tbody></table>0

O nível de compressão padrão que o servidor usa para o algoritmo LZ4 nas conexões do X Protocol. Especifique o nível como um inteiro de 0 (o menor esforço de compressão) a 16 (o maior esforço). Este nível é usado se o cliente não solicitar um nível de compressão durante a negociação de capacidades. Se você não especificar esta variável do sistema, o servidor usa o nível 2 como padrão. Para mais informações, consulte a Seção 22.5.5, “Compressão de Conexão com X Plugin”.

* `mysqlx_lz4_max_client_compression_level`

<table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--mysqlx-bind-address=addr</code></td> </tr><tr><th>Variável do sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">*</code></td> </tr></tbody></table>1

O nível máximo de compressão que o servidor permite para o algoritmo LZ4 em conexões do X Protocol. A faixa é a mesma que para o nível de compressão padrão para este algoritmo. Se o cliente solicitar um nível de compressão mais alto que este, o servidor usa o nível que você definiu aqui. Se você não especificar esta variável do sistema, o servidor define um nível máximo de compressão de 8.

* `mysqlx_max_allowed_packet`

<table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--mysqlx-bind-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></th></a> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">*</code></td>
  </tr>
</table>
2

O tamanho máximo dos pacotes de rede que podem ser recebidos pelo X Plugin. Esse limite também se aplica quando a compressão é usada para a conexão, portanto, o pacote de rede deve ser menor que esse tamanho após a mensagem ter sido descomprimida. Esse é o equivalente do X Plugin a `max_allowed_packet`; consulte a descrição daquela variável para obter mais informações.

* `mysqlx_max_connections`

<table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--mysqlx-bind-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">*</code></td>
  </tr>
</table>
3

O número máximo de conexões de cliente concorrentes que o X Plugin pode aceitar. Este é o equivalente do X Plugin a `max_connections`; consulte a descrição dessa variável para obter mais informações.

Para modificações nesta variável, se o novo valor for menor que o número atual de conexões, o novo limite é considerado apenas para novas conexões.

* `mysqlx_min_worker_threads`

<table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-bind-address=addr</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">*</code></td> </tr>
</table>
4

O número mínimo de threads de trabalhador usado pelo X Plugin para lidar com solicitações de clientes.

* `mysqlx_port`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-bind-address=addr</code></td> </tr>
    <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code></td> </tr>
    <tr><th>Alcance</th> <td>Global</td> </tr>
    <tr><th>Dinâmico</th> <td>Não</td> </tr>
    <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor Padrão</th> <td><code class="literal">*</code></td> </tr>
  </table>
5

O porta de rede no qual o X Plugin escuta conexões TCP/IP. Este é o equivalente do X Plugin à variável `port`; veja a descrição dessa variável para mais informações.

* `mysqlx_port_open_timeout`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-bind-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de Definição de Variável</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">*</code></td> </tr></tbody></table>6

O número de segundos que o X Plugin espera que um porta TCP/IP fique livre.

* `mysqlx_read_timeout`

<table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--mysqlx-bind-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">*</code></td>
  </tr>
</table>
7

O número de segundos que o Plugin X espera para bloquear operações de leitura até que sejam concluídas. Após esse tempo, se a operação de leitura não for bem-sucedida, o Plugin X fecha a conexão e retorna um aviso com o código de erro ER\_IO\_READ\_ERROR para o aplicativo cliente.

* `mysqlx_socket`

<table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--mysqlx-bind-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">*</code></td>
  </tr>
</table>

  O caminho para um arquivo de socket Unix que o Plugin X usa para conexões. Esta configuração é usada apenas pelo MySQL Server quando executado em sistemas operacionais Unix. Os clientes podem usar este socket para se conectar ao MySQL Server usando o Plugin X.

  O caminho e o nome de arquivo padrão do `mysqlx_socket` são baseados no caminho e no nome de arquivo padrão do arquivo de socket principal do MySQL Server, com a adição de um `x` ao nome do arquivo. O caminho e o nome de arquivo padrão do arquivo de socket principal são `/tmp/mysql.sock`, portanto, o caminho e o nome de arquivo padrão do arquivo de socket do Plugin X são `/tmp/mysqlx.sock`.

  Se você especificar um caminho e um nome de arquivo alternativos para o arquivo de socket principal no início do servidor usando a variável de sistema `socket`, isso não afeta o padrão para o arquivo de socket do Plugin X. Nesta situação, se você quiser armazenar ambos os sockets em um único caminho, você deve definir a variável de sistema `mysqlx_socket` também. Por exemplo, em um arquivo de configuração:

  ```
  socket=/home/sockets/mysqld/mysql.sock
  mysqlx_socket=/home/sockets/xplugin/xplugin.sock
  ```

Se você alterar o caminho padrão e o nome do arquivo para o arquivo de soquete principal no momento da compilação usando a opção de compilação `MYSQL_UNIX_ADDR`, isso afeta o padrão do arquivo de soquete do plugin X, que é formado adicionando um `x` ao nome do arquivo `MYSQL_UNIX_ADDR`. Se você quiser definir um padrão diferente para o arquivo de soquete do plugin X no momento da compilação, use a opção de compilação `MYSQLX_UNIX_ADDR`.

A variável de ambiente `MYSQLX_UNIX_PORT` também pode ser usada para definir um padrão para o arquivo de soquete do plugin X no momento do início do servidor (consulte a Seção 6.9, “Variáveis de Ambiente”). Se você definir essa variável de ambiente, ela substitui o valor compilado de `MYSQLX_UNIX_ADDR`, mas é substituída pelo valor `mysqlx_socket`.

* `mysqlx_ssl_ca`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_bind_address"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-bind-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address">mysqlx_bind_address</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de Configuração de Variáveis Dinâmicas</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">*</code></td> </tr></tbody></table>9

A variável de sistema `mysqlx_ssl_ca` é semelhante à `ssl_ca`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do MySQL Server. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

* `mysqlx_ssl_capath`

  <table frame="box" rules="all" summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-compression-algorithms=valor</code></td> </tr><tr><th>Variável de Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_compression_algorithms">mysqlx_compression_algorithms</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code class="literal">SET_VAR</code></a> Aplicação de Dicas</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">deflate_stream</code></p><p class="valid-value"><code class="literal">lz4_message</code></p><p class="valid-value"><code class="literal">zstd_stream</code></p></td> </tr></tbody></table>0

  A variável de sistema `mysqlx_ssl_capath` é semelhante à `ssl_capath`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do MySQL Server. Para obter informações sobre a configuração do suporte à criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

* `mysqlx_ssl_cert`

<table frame="box" rules="all" summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-compression-algorithms=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_compression_algorithms">mysqlx_compression_algorithms</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">deflate_stream</code></p><p class="valid-value"><code class="literal">lz4_message</code></p><p class="valid-value"><code class="literal">zstd_stream</code></p></td> </tr></tbody></table>1

  A variável de sistema `mysqlx_ssl_cert` é semelhante à `ssl_cert`, exceto que se aplica ao X Plugin em vez da interface de conexão principal do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

* `mysqlx_ssl_cipher`

<table frame="box" rules="all" summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-compression-algorithms=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_compression_algorithms">mysqlx_compression_algorithms</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">deflate_stream</code></p><p class="valid-value"><code class="literal">lz4_message</code></p><p class="valid-value"><code class="literal">zstd_stream</code></p></td> </tr></tbody></table>2

A variável de sistema `mysqlx_ssl_cipher` é semelhante à `ssl_cipher`, exceto que se aplica ao X Plugin em vez da interface principal de conexão do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

* `mysqlx_ssl_crl`

<table frame="box" rules="all" summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-compression-algorithms=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_compression_algorithms">mysqlx_compression_algorithms</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">deflate_stream</code></p><p class="valid-value"><code class="literal">lz4_message</code></p><p class="valid-value"><code class="literal">zstd_stream</code></p></td> </tr></tbody></table>3

A variável de sistema `mysqlx_ssl_crl` é semelhante à `ssl_crl`, exceto que se aplica ao X Plugin em vez da interface principal de conexão do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

* `mysqlx_ssl_crlpath`

<table frame="box" rules="all" summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-compression-algorithms=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_compression_algorithms">mysqlx_compression_algorithms</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">deflate_stream</code></p><p class="valid-value"><code class="literal">lz4_message</code></p><p class="valid-value"><code class="literal">zstd_stream</code></p></td> </tr></tbody></table>4

A variável de sistema `mysqlx_ssl_crlpath` é semelhante à `ssl_crlpath`, exceto que se aplica ao X Plugin em vez da interface de conexão principal do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

* `mysqlx_ssl_key`

<table frame="box" rules="all" summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-compression-algorithms=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_compression_algorithms">mysqlx_compression_algorithms</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de Definição de Variável</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">deflate_stream</code></p><p class="valid-value"><code class="literal">lz4_message</code></p><p class="valid-value"><code class="literal">zstd_stream</code></p></td> </tr></tbody></table>5

A variável de sistema `mysqlx_ssl_key` é semelhante à `ssl_key`, exceto que se aplica ao X Plugin em vez da interface de conexão principal do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando Conexões Criptografadas com o X Plugin”.

* `mysqlx_wait_timeout`

<table frame="box" rules="all" summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-compression-algorithms=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_compression_algorithms">mysqlx_compression_algorithms</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">deflate_stream</code></p><p class="valid-value"><code class="literal">lz4_message</code></p><p class="valid-value"><code class="literal">zstd_stream</code></p></td> </tr></tbody></table>6

O número de segundos que o Plugin X espera por atividade em uma conexão. Após esse tempo, se a operação de leitura não for bem-sucedida, o Plugin X fecha a conexão. Se o cliente não for interativo, o valor inicial da variável de sessão é copiado da variável global `mysqlx_wait_timeout`. Para clientes interativos, o valor inicial é copiado da sessão `mysqlx_interactive_timeout`.

* `mysqlx_write_timeout`

<table frame="box" rules="all" summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-compression-algorithms=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_compression_algorithms">mysqlx_compression_algorithms</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Definição de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">deflate_stream</code></p><p class="valid-value"><code class="literal">lz4_message</code></p><p class="valid-value"><code class="literal">zstd_stream</code></p></td> </tr></tbody></table>7

O número de segundos que o Plugin X espera para completar operações de escrita bloqueantes. Após esse tempo, se a operação de escrita não for bem-sucedida, o Plugin X fecha a conexão.

* `mysqlx_zstd_default_compression_level`

<table frame="box" rules="all" summary="Propriedades para mysqlx_compression_algorithms">
<tr><th>Formato de Linha de Comando</th> <td><code class="literal">--mysqlx-compression-algorithms=valor</code></td> </tr>
<tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_compression_algorithms">mysqlx_compression_algorithms</a></code></td> </tr>
<tr><th>Alcance</th> <td>Global</td> </tr>
<tr><th>Dinâmico</th> <td>Sim</td> </tr>
<tr><th>Hinta de Definição de Variável</th> <td>Não</td> </tr>
<tr><th>Tipo</th> <td>Definir</td> </tr>
<tr><th>Valor Padrão</th> <td><code class="literal">deflate_stream,lz4_message,zstd_stream</code></td> </tr>
<tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">deflate_stream</code></p><p class="valid-value"><code class="literal">lz4_message</code></p><p class="valid-value"><code class="literal">zstd_stream</code></p></td> </tr>
</table>

O nível de compressão padrão que o servidor usa para o algoritmo zstd nas conexões do X Protocol. Para versões da biblioteca zstd a partir da 1.4.0, você pode definir valores positivos de 1 a 22 (o maior esforço de compressão) ou valores negativos que representam esforços progressivamente menores. Um valor de 0 é convertido para um valor de 1. Para versões anteriores da biblioteca zstd, você só pode especificar o valor 3. Esse nível é usado se o cliente não solicitar um nível de compressão durante a negociação de capacidades. Se você não especificar essa variável de sistema, o servidor usa o nível 3 como padrão. Para mais informações, consulte a Seção 22.5.5, “Compressão de Conexão com X Plugin”.

<table frame="box" rules="all" summary="Propriedades para mysqlx_compression_algorithms"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--mysqlx-compression-algorithms=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code class="literal"><a class="link" href="x-plugin-options-system-variables.html#sysvar_mysqlx_compression_algorithms">mysqlx_compression_algorithms</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code class="literal">deflate_stream</code></p><p class="valid-value"><code class="literal">lz4_message</code></p><p class="valid-value"><code class="literal">zstd_stream</code></p></td> </tr></tbody></table>9

O nível máximo de compressão que o servidor permite para o algoritmo zstd nas conexões do Protocolo X. A faixa é a mesma que o nível de compressão padrão para este algoritmo. Se o cliente solicitar um nível de compressão mais alto que este, o servidor usa o nível que você definiu aqui. Se você não especificar esta variável do sistema, o servidor define um nível máximo de compressão de 11.