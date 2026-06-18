#### 29.12.21.3 Tabela host\_cache

O servidor MySQL mantém um cache de hosts em memória que contém informações sobre o nome do host e o endereço IP do cliente e é usado para evitar consultas no Sistema de Nomes de Domínio (DNS). A tabela `host_cache` exibe o conteúdo desse cache. A variável de sistema `host_cache_size` controla o tamanho do cache de hosts, bem como o tamanho da tabela `host_cache`. Para informações operacionais e de configuração sobre o cache de hosts, consulte a Seção 7.1.12.3, “Consultas DNS e o Cache de Hosts”.

Como a tabela `host_cache` exibe o conteúdo do cache do host, ela pode ser examinada usando instruções `SELECT`. Isso pode ajudá-lo a diagnosticar as causas dos problemas de conexão.

A tabela `host_cache` tem essas colunas:

- `IP`

  O endereço IP do cliente que se conectou ao servidor, expresso como uma string.

- `HOST`

  O nome de host DNS resolvido para esse IP do cliente, ou `NULL` se o nome for desconhecido.

- `HOST_VALIDATED`

  Se a resolução de DNS de IP para nome de host para IP foi realizada com sucesso para o IP do cliente. Se `HOST_VALIDATED` for `YES`, a coluna `HOST` é usada como o nome de host correspondente ao IP para evitar chamadas adicionais ao DNS. Enquanto `HOST_VALIDATED` for `NO`, a resolução de DNS é realizada para cada tentativa de conexão, até que ela seja concluída com um resultado válido ou um erro permanente. Essas informações permitem que o servidor evite o cache de nomes de host ruins ou ausentes durante falhas temporárias no DNS, o que afetaria negativamente os clientes para sempre.

- `SUM_CONNECT_ERRORS`

  O número de erros de conexão considerados “bloqueantes” (avaliados contra a variável de sistema `max_connect_errors`). Somente os erros de aperto de protocolo são contados, e apenas para os hosts que passaram na validação (`HOST_VALIDATED = YES`).

  Quando o `SUM_CONNECT_ERRORS` para um determinado host atinge o valor de `max_connect_errors`, novas conexões desse host são bloqueadas. O valor `SUM_CONNECT_ERRORS` pode exceder o valor `max_connect_errors`, pois múltiplas tentativas de conexão de um host podem ocorrer simultaneamente enquanto o host não está bloqueado. Qualquer ou todas elas podem falhar, incrementando independentemente o `SUM_CONNECT_ERRORS`, possivelmente além do valor de `max_connect_errors`.

  Suponha que `max_connect_errors` seja 200 e `SUM_CONNECT_ERRORS` para um host específico seja 199. Se 10 clientes tentarem se conectar simultaneamente desse host, nenhum deles será bloqueado porque `SUM_CONNECT_ERRORS` ainda não atingiu 200. Se ocorrerem erros de bloqueio para cinco dos clientes, `SUM_CONNECT_ERRORS` é incrementado em um para cada cliente, resultando em um valor de `SUM_CONNECT_ERRORS` de 204. Os outros cinco clientes conseguem e não são bloqueados porque o valor de `SUM_CONNECT_ERRORS` quando suas tentativas de conexão começaram ainda não havia atingido 200. Novas conexões do host que começam após `SUM_CONNECT_ERRORS` atingir 200 são bloqueadas.

- `COUNT_HOST_BLOCKED_ERRORS`

  O número de conexões que foram bloqueadas porque `SUM_CONNECT_ERRORS` excedeu o valor da variável de sistema `max_connect_errors`.

- `COUNT_NAMEINFO_TRANSIENT_ERRORS`

  O número de erros transitórios durante a resolução do nome do host para o DNS.

- `COUNT_NAMEINFO_PERMANENT_ERRORS`

  O número de erros permanentes durante a resolução do nome do host para o nome do IP DNS.

- `COUNT_FORMAT_ERRORS`

  Número de erros no formato do nome do host. O MySQL não realiza a correspondência dos valores da coluna `Host` na tabela de sistema `mysql.user` contra nomes de host para os quais um ou mais dos componentes iniciais do nome são inteiramente numéricos, como `1.2.example.com`. O endereço IP do cliente é usado em vez disso. Para saber o motivo pelo qual esse tipo de correspondência não ocorre, consulte a Seção 8.2.4, “Especificação de Nomes de Conta”.

- `COUNT_ADDRINFO_TRANSIENT_ERRORS`

  O número de erros transitórios durante a resolução reversa de DNS de nomes de host para IP.

- `COUNT_ADDRINFO_PERMANENT_ERRORS`

  Número de erros permanentes durante a resolução reversa de DNS de nomes de host para IP.

- `COUNT_FCRDNS_ERRORS`

  Número de erros de DNS reversa confirmados antecipadamente. Esses erros ocorrem quando a resolução de DNS de IP para nome de host para IP produz um endereço IP que não corresponde ao endereço IP do cliente de origem.

- `COUNT_HOST_ACL_ERRORS`

  O número de erros que ocorrem porque nenhum usuário é autorizado a se conectar do host do cliente. Nesses casos, o servidor retorna `ER_HOST_NOT_PRIVILEGED` e nem sequer pede um nome de usuário ou senha.

- `COUNT_NO_AUTH_PLUGIN_ERRORS`

  O número de erros devido a solicitações para um plugin de autenticação indisponível. Um plugin pode estar indisponível se, por exemplo, ele nunca tiver sido carregado ou se uma tentativa de carregamento falhar.

- `COUNT_AUTH_PLUGIN_ERRORS`

  O número de erros relatados pelos plugins de autenticação.

  Um plugin de autenticação pode relatar diferentes códigos de erro para indicar a causa raiz de uma falha. Dependendo do tipo de erro, uma dessas colunas é incrementada: `COUNT_AUTHENTICATION_ERRORS`, `COUNT_AUTH_PLUGIN_ERRORS`, `COUNT_HANDSHAKE_ERRORS`. Novos códigos de retorno são uma extensão opcional da API do plugin existente. Erros de plugin desconhecidos ou inesperados são contados na coluna `COUNT_AUTH_PLUGIN_ERRORS`.

- `COUNT_HANDSHAKE_ERRORS`

  O número de erros detectados no nível do protocolo de fios.

- `COUNT_PROXY_USER_ERRORS`

  O número de erros detectados quando o usuário proxy A é redirecionado para outro usuário B que não existe.

- `COUNT_PROXY_USER_ACL_ERRORS`

  O número de erros detectados quando o usuário proxy A é redirecionado para outro usuário B, que existe, mas para o qual A não tem o privilégio `PROXY`.

- `COUNT_AUTHENTICATION_ERRORS`

  O número de erros causados por autenticação falha.

- `COUNT_SSL_ERRORS`

  O número de erros devido a problemas de SSL.

- `COUNT_MAX_USER_CONNECTIONS_ERRORS`

  O número de erros causados pelo excedente das cotas de conexão por usuário. Consulte a Seção 8.2.21, "Definindo Limites de Recursos da Conta".

- `COUNT_MAX_USER_CONNECTIONS_PER_HOUR_ERRORS`

  O número de erros causados pelo excedente de conexões por usuário por hora. Consulte a Seção 8.2.21, “Definir limites de recursos da conta”.

- `COUNT_DEFAULT_DATABASE_ERRORS`

  O número de erros relacionados ao banco de dados padrão. Por exemplo, o banco de dados não existe ou o usuário não tem privilégios para acessá-lo.

- `COUNT_INIT_CONNECT_ERRORS`

  O número de erros causados por falhas na execução de instruções na variável de sistema `init_connect`.

- `COUNT_LOCAL_ERRORS`

  O número de erros específicos da implementação do servidor e não relacionados à rede, autenticação ou autorização. Por exemplo, condições de esgotamento de memória estão nessa categoria.

- `COUNT_UNKNOWN_ERRORS`

  O número de outros erros desconhecidos não contabilizados por outras colunas nesta tabela. Esta coluna é reservada para uso futuro, caso novas condições de erro precisem ser relatadas, e se for necessário preservar a compatibilidade e a estrutura retroativas da tabela `host_cache`.

- `FIRST_SEEN`

  O timestamp da primeira tentativa de conexão vista pelo cliente na coluna `IP`.

- `LAST_SEEN`

  O timestamp da tentativa de conexão mais recente vista do cliente na coluna `IP`.

- `FIRST_ERROR_SEEN`

  O timestamp do primeiro erro visto pelo cliente na coluna `IP`.

- `LAST_ERROR_SEEN`

  O timestamp do erro mais recente visto pelo cliente na coluna `IP`.

A tabela `host_cache` tem esses índices:

- Chave primária em (`IP`)
- Índice sobre (`HOST`)

O `TRUNCATE TABLE` é permitido para a tabela `host_cache`. Ele requer o privilégio `DROP` para a tabela. A truncagem da tabela esvazia o cache do host, o que tem os efeitos descritos em Esvaziar o Cache do Host.
