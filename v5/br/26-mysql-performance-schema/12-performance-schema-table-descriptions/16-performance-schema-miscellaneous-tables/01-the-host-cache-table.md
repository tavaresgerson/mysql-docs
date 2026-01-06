#### 25.12.16.1 Tabela host\_cache

O servidor MySQL mantém um cache de hosts em memória que contém informações sobre o nome do host e o endereço IP do cliente e é usado para evitar consultas no Sistema de Nomes de Domínio (DNS). A tabela `host_cache` expõe o conteúdo desse cache. A variável de sistema `host_cache_size` controla o tamanho do cache de hosts, bem como o tamanho da tabela `host_cache`. Para informações operacionais e de configuração sobre o cache de hosts, consulte Seção 5.1.11.2, “Consultas DNS e o Cache de Hosts”.

Como a tabela `host_cache` exibe o conteúdo do cache do host, ela pode ser examinada usando instruções `SELECT`. Isso pode ajudá-lo a diagnosticar as causas dos problemas de conexão. O Schema de Desempenho deve estar habilitado ou essa tabela estará vazia.

A tabela `host_cache` tem as seguintes colunas:

- `IP`

  O endereço IP do cliente que se conectou ao servidor, expresso como uma string.

- `HOST`

  O nome de host DNS resolvido para esse IP do cliente, ou `NULL` se o nome for desconhecido.

- `HOST_VALIDATED`

  Se a resolução de DNS de IP para nome de host foi realizada com sucesso para o IP do cliente. Se `HOST_VALIDATED` for `YES`, a coluna `HOST` é usada como o nome de host correspondente ao IP, para evitar chamadas adicionais ao DNS. Enquanto `HOST_VALIDATED` for `NO`, a resolução de DNS é realizada para cada tentativa de conexão, até que ela seja concluída com um resultado válido ou um erro permanente. Essas informações permitem que o servidor evite o cache de nomes de host inválidos ou ausentes durante falhas temporárias no DNS, o que afetaria negativamente os clientes para sempre.

- `SUM_CONNECT_ERRORS`

  O número de erros de conexão considerados "bloqueantes" (avaliados contra a variável de sistema `max_connect_errors`). Somente os erros de aperto de protocolo são contados, e apenas para os hosts que passaram pela validação (`HOST_VALIDATED = YES`).

  Quando o valor de `SUM_CONNECT_ERRORS` para um determinado host atinge o valor de `max_connect_errors`, novas conexões desse host são bloqueadas. O valor de `SUM_CONNECT_ERRORS` pode exceder o valor de `max_connect_errors` porque múltiplas tentativas de conexão de um host podem ocorrer simultaneamente enquanto o host não está bloqueado. Qualquer ou todas as tentativas podem falhar, aumentando independentemente o `SUM_CONNECT_ERRORS`, possivelmente além do valor de `max_connect_errors`.

  Suponha que `max_connect_errors` seja 200 e `SUM_CONNECT_ERRORS` para um determinado host seja 199. Se 10 clientes tentarem se conectar simultaneamente desse host, nenhum deles será bloqueado porque `SUM_CONNECT_ERRORS` não atingiu 200. Se ocorrerem erros de bloqueio para cinco dos clientes, `SUM_CONNECT_ERRORS` é incrementado em um para cada cliente, resultando em um valor de `SUM_CONNECT_ERRORS` de 204. Os outros cinco clientes têm sucesso e não são bloqueados porque o valor de `SUM_CONNECT_ERRORS` quando suas tentativas de conexão começaram não havia atingido 200. Novas conexões do host que começam após `SUM_CONNECT_ERRORS` atingir 200 são bloqueadas.

- `CONTAR ERROS BLOQUEADOS NO HOST`

  O número de conexões que foram bloqueadas porque `SUM_CONNECT_ERRORS` excedeu o valor da variável de sistema `max_connect_errors`.

- `COUNT_NAMEINFO_TRANSIENT_ERRORS`

  O número de erros transitórios durante a resolução do nome do host para o DNS.

- `COUNT_NAMEINFO_PERMANENT_ERRORS`

  O número de erros permanentes durante a resolução do nome do host para o nome do IP DNS.

- `ERROS_FORMATO_CONTAGEM`

  Número de erros no formato do nome do host. O MySQL não realiza a correspondência dos valores da coluna `Host` na tabela `mysql.user` do sistema contra nomes de host para os quais um ou mais dos componentes iniciais do nome são inteiramente numéricos, como `1.2.example.com`. O endereço IP do cliente é usado em vez disso. Para saber o motivo pelo qual esse tipo de correspondência não ocorre, consulte Seção 6.2.4, “Especificação de Nomes de Conta”.

- `COUNT_ADDRINFO_TRANSIENT_ERRORS`

  O número de erros transitórios durante a resolução reversa de DNS de nomes de host para IP.

- `COUNT_ADDRINFO_PERMANENT_ERRORS`

  Número de erros permanentes durante a resolução reversa de DNS de nomes de host para IP.

- `CONTAR_ERROS_FCRDNS`

  Número de erros de DNS reversa confirmados antecipadamente. Esses erros ocorrem quando a resolução de DNS de IP para nome de host para IP produz um endereço IP que não corresponde ao endereço IP do cliente de origem.

- `CONTAR ERROS DE ACL DO HOST`

  O número de erros que ocorrem porque nenhum usuário é autorizado a se conectar do host do cliente. Nesses casos, o servidor retorna `ER_HOST_NOT_PRIVILEGED` e nem sequer pede o nome ou a senha do usuário.

- `COUNT_NO_AUTH_PLUGIN_ERRORS`

  O número de erros devido a solicitações para um plugin de autenticação indisponível. Um plugin pode estar indisponível se, por exemplo, ele nunca tiver sido carregado ou se uma tentativa de carregamento falhar.

- `COUNT_AUTH_PLUGIN_ERRORS`

  O número de erros relatados pelos plugins de autenticação.

  Um plugin de autenticação pode relatar diferentes códigos de erro para indicar a causa raiz de uma falha. Dependendo do tipo de erro, uma dessas colunas é incrementada: `COUNT_AUTHENTICATION_ERRORS`, `COUNT_AUTH_PLUGIN_ERRORS`, `COUNT_HANDSHAKE_ERRORS`. Novos códigos de retorno são uma extensão opcional da API do plugin existente. Erros de plugin desconhecidos ou inesperados são contados na coluna `COUNT_AUTH_PLUGIN_ERRORS`.

- `COUNT_HANDSHAKE_ERRORS`

  O número de erros detectados no nível do protocolo de fios.

- `CONTAR_ERROS_DE_USUÁRIO_PROXIMA`

  O número de erros detectados quando o usuário proxy A é redirecionado para outro usuário B que não existe.

- `COUNT_PROXY_USER_ACL_ERRORS`

  O número de erros detectados quando o usuário proxy A é redirecionado para outro usuário B, que existe, mas para o qual A não tem o privilégio `PROXY`.

- `CONTAR ERROS DE AUTENTICAÇÃO`

  O número de erros causados por autenticação falha.

- `CONTAR_ERROS_SSL`

  O número de erros devido a problemas de SSL.

- `CONTAR_ERROS_MAIORES_CONEXÕES_DE_USUÁRIO`

  O número de erros causados pelo excedente das cotas de conexão por usuário. Consulte Seção 6.2.16, “Definir limites de recursos da conta”.

- `CONTAR_MAX_CONEXÕES_POR_USUARIO_POR_HORÁRIOS_ERROS`

  O número de erros causados pelo excedente de conexões por usuário por hora. Consulte Seção 6.2.16, “Definir limites de recursos da conta”.

- `COUNT_DEFAULT_DATABASE_ERRORS`

  O número de erros relacionados ao banco de dados padrão. Por exemplo, o banco de dados não existe ou o usuário não tem privilégios para acessá-lo.

- `COUNT_INIT_CONNECT_ERRORS`

  O número de erros causados por falhas na execução de instruções no valor da variável de sistema `init_connect`.

- `CONTAR ERROS LOCAIS`

  O número de erros específicos da implementação do servidor e não relacionados à rede, autenticação ou autorização. Por exemplo, condições de esgotamento de memória estão nessa categoria.

- `CONTAR ERROS DESCONHECIDOS`

  O número de outros erros desconhecidos não contabilizados por outras colunas nesta tabela. Esta coluna é reservada para uso futuro, caso novas condições de erro precisem ser relatadas, e se for necessário preservar a compatibilidade e a estrutura reversas da tabela `host_cache`.

- `PRIMEIRO_VISTO`

  O horário da primeira tentativa de conexão vista pelo cliente na coluna `IP`.

- `Última visualização`

  O horário da tentativa de conexão mais recente vista pelo cliente na coluna `IP`.

- `PRIMEIRO_ERRO_VISTO`

  O horário do primeiro erro visto pelo cliente na coluna `IP`.

- `LAST_ERROR_SEEN`

  O horário do erro mais recente visto pelo cliente na coluna `IP`.

A operação `TRUNCATE TABLE` é permitida para a tabela `host_cache`. Ela requer o privilégio `DROP` para a tabela. A truncagem da tabela esvazia o cache do host, o que tem os efeitos descritos em Flushing the Host Cache.
