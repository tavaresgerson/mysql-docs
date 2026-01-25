#### 25.12.16.1 A Tabela host_cache

O servidor MySQL mantém um *host cache* (cache de host) na memória que contém informações de nome de host e endereço IP do cliente e é usado para evitar buscas no Domain Name System (DNS) (*DNS lookups*). A tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") expõe o conteúdo deste cache. A variável de sistema [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) controla o tamanho do *host cache*, bem como o tamanho da tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table"). Para informações operacionais e de configuração sobre o *host cache*, consulte [Seção 5.1.11.2, “DNS Lookups and the Host Cache”](host-cache.html "5.1.11.2 DNS Lookups and the Host Cache").

Como a tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") expõe o conteúdo do *host cache*, ela pode ser examinada usando comandos [`SELECT`](select.html "13.2.9 SELECT Statement"). Isso pode ajudar a diagnosticar as causas de problemas de conexão. O Performance Schema deve estar habilitado ou esta tabela estará vazia.

A tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") possui as seguintes colunas:

* `IP`

  O endereço IP do cliente que se conectou ao servidor, expresso como uma string.

* `HOST`

  O nome de host DNS resolvido para aquele IP de cliente, ou `NULL` se o nome for desconhecido.

* `HOST_VALIDATED`

  Se a resolução DNS de IP para nome de host para IP foi realizada com sucesso para o IP do cliente. Se `HOST_VALIDATED` for `YES`, a coluna `HOST` é usada como o nome de host correspondente ao IP para que chamadas adicionais ao DNS possam ser evitadas. Enquanto `HOST_VALIDATED` for `NO`, a resolução DNS é tentada para cada tentativa de conexão, até que ela finalmente seja concluída com um resultado válido ou um erro permanente. Esta informação permite que o servidor evite armazenar em cache nomes de host ruins ou ausentes durante falhas temporárias de DNS, o que afetaria negativamente os clientes para sempre.

* `SUM_CONNECT_ERRORS`

  O número de erros de conexão que são considerados "bloqueadores" (avaliados em relação à variável de sistema [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors)). Apenas erros de *handshake* de protocolo são contados, e apenas para hosts que passaram na validação (`HOST_VALIDATED = YES`).

  Uma vez que `SUM_CONNECT_ERRORS` para um determinado host atinge o valor de [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors), novas conexões desse host são bloqueadas. O valor de `SUM_CONNECT_ERRORS` pode exceder o valor de [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors) porque múltiplas tentativas de conexão de um host podem ocorrer simultaneamente enquanto o host não está bloqueado. Qualquer uma ou todas elas podem falhar, incrementando `SUM_CONNECT_ERRORS` independentemente, possivelmente além do valor de [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors).

  Suponha que [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors) seja 200 e `SUM_CONNECT_ERRORS` para um determinado host seja 199. Se 10 clientes tentarem se conectar a partir desse host simultaneamente, nenhum deles será bloqueado porque `SUM_CONNECT_ERRORS` não atingiu 200. Se ocorrerem erros de bloqueio para cinco dos clientes, `SUM_CONNECT_ERRORS` é aumentado em um para cada cliente, resultando em um valor de `SUM_CONNECT_ERRORS` de 204. Os outros cinco clientes são bem-sucedidos e não são bloqueados porque o valor de `SUM_CONNECT_ERRORS` quando suas tentativas de conexão começaram não havia atingido 200. Novas conexões do host que começam depois que `SUM_CONNECT_ERRORS` atinge 200 são bloqueadas.

* `COUNT_HOST_BLOCKED_ERRORS`

  O número de conexões que foram bloqueadas porque `SUM_CONNECT_ERRORS` excedeu o valor da variável de sistema [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors).

* `COUNT_NAMEINFO_TRANSIENT_ERRORS`

  O número de erros transitórios durante a resolução DNS de IP para nome de host.

* `COUNT_NAMEINFO_PERMANENT_ERRORS`

  O número de erros permanentes durante a resolução DNS de IP para nome de host.

* `COUNT_FORMAT_ERRORS`

  O número de erros de formato de nome de host. O MySQL não realiza a correspondência de valores da coluna `Host` na tabela de sistema `mysql.user` com nomes de host para os quais um ou mais dos componentes iniciais do nome são inteiramente numéricos, como `1.2.example.com`. O endereço IP do cliente é usado em vez disso. Para a justificativa pela qual este tipo de correspondência não ocorre, consulte [Seção 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names").

* `COUNT_ADDRINFO_TRANSIENT_ERRORS`

  O número de erros transitórios durante a resolução DNS reversa de nome de host para IP.

* `COUNT_ADDRINFO_PERMANENT_ERRORS`

  O número de erros permanentes durante a resolução DNS reversa de nome de host para IP.

* `COUNT_FCRDNS_ERRORS`

  O número de erros de DNS reverso confirmado para frente (*forward-confirmed reverse DNS*). Esses erros ocorrem quando a resolução DNS de IP para nome de host para IP produz um endereço IP que não corresponde ao endereço IP de origem do cliente.

* `COUNT_HOST_ACL_ERRORS`

  O número de erros que ocorrem porque nenhum usuário tem permissão para se conectar a partir do host cliente. Nesses casos, o servidor retorna [`ER_HOST_NOT_PRIVILEGED`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_host_not_privileged) e nem mesmo solicita um nome de usuário ou senha.

* `COUNT_NO_AUTH_PLUGIN_ERRORS`

  O número de erros devido a solicitações de um *plugin* de autenticação indisponível. Um *plugin* pode estar indisponível se, por exemplo, nunca foi carregado ou uma tentativa de carregamento falhou.

* `COUNT_AUTH_PLUGIN_ERRORS`

  O número de erros reportados por *plugins* de autenticação.

  Um *plugin* de autenticação pode reportar diferentes códigos de erro para indicar a causa raiz de uma falha. Dependendo do tipo de erro, uma destas colunas é incrementada: `COUNT_AUTHENTICATION_ERRORS`, `COUNT_AUTH_PLUGIN_ERRORS`, `COUNT_HANDSHAKE_ERRORS`. Novos códigos de retorno são uma extensão opcional para a API de *plugin* existente. Erros de *plugin* desconhecidos ou inesperados são contados na coluna `COUNT_AUTH_PLUGIN_ERRORS`.

* `COUNT_HANDSHAKE_ERRORS`

  O número de erros detectados no nível do protocolo de rede (*wire protocol*).

* `COUNT_PROXY_USER_ERRORS`

  O número de erros detectados quando o usuário *proxy* A é *proxied* para outro usuário B que não existe.

* `COUNT_PROXY_USER_ACL_ERRORS`

  O número de erros detectados quando o usuário *proxy* A é *proxied* para outro usuário B que existe, mas para o qual A não possui o privilégio [`PROXY`](privileges-provided.html#priv_proxy).

* `COUNT_AUTHENTICATION_ERRORS`

  O número de erros causados por falha na autenticação.

* `COUNT_SSL_ERRORS`

  O número de erros devido a problemas de SSL.

* `COUNT_MAX_USER_CONNECTIONS_ERRORS`

  O número de erros causados por exceder as cotas de conexão por usuário. Consulte [Seção 6.2.16, “Setting Account Resource Limits”](user-resources.html "6.2.16 Setting Account Resource Limits").

* `COUNT_MAX_USER_CONNECTIONS_PER_HOUR_ERRORS`

  O número de erros causados por exceder as cotas de conexões por hora por usuário. Consulte [Seção 6.2.16, “Setting Account Resource Limits”](user-resources.html "6.2.16 Setting Account Resource Limits").

* `COUNT_DEFAULT_DATABASE_ERRORS`

  O número de erros relacionados ao Database padrão. Por exemplo, o Database não existe ou o usuário não tem privilégios para acessá-lo.

* `COUNT_INIT_CONNECT_ERRORS`

  O número de erros causados por falhas de execução de comandos no valor da variável de sistema [`init_connect`](server-system-variables.html#sysvar_init_connect).

* `COUNT_LOCAL_ERRORS`

  O número de erros locais à implementação do servidor e não relacionados à rede, autenticação ou autorização. Por exemplo, condições de falta de memória (*out-of-memory*) se enquadram nesta categoria.

* `COUNT_UNKNOWN_ERRORS`

  O número de outros erros desconhecidos não contabilizados por outras colunas nesta tabela. Esta coluna é reservada para uso futuro, caso novas condições de erro precisem ser relatadas, e se a preservação da compatibilidade reversa e da estrutura da tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") for necessária.

* `FIRST_SEEN`

  O timestamp da primeira tentativa de conexão vista do cliente na coluna `IP`.

* `LAST_SEEN`

  O timestamp da tentativa de conexão mais recente vista do cliente na coluna `IP`.

* `FIRST_ERROR_SEEN`

  O timestamp do primeiro erro visto do cliente na coluna `IP`.

* `LAST_ERROR_SEEN`

  O timestamp do erro mais recente visto do cliente na coluna `IP`.

O comando [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table"). Ele requer o privilégio [`DROP`](privileges-provided.html#priv_drop) para a tabela. Truncar a tabela limpa o *host cache* (*flushes*), o que tem os efeitos descritos em [Flushing the Host Cache](host-cache.html#host-cache-flushing "Flushing the Host Cache").