### 7.1.8 Variaveis do sistema do servidor

O servidor MySQL mantém muitas variáveis do sistema que afetam sua operação. A maioria das variáveis do sistema pode ser definida na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções. A maioria delas pode ser alterada dinamicamente no tempo de execução usando a instrução `SET`, que permite modificar a operação do servidor sem ter que pará-lo e reiniciá-lo. Algumas variáveis são somente de leitura, e seus valores são determinados pelo ambiente do sistema, por como o MySQL está instalado no sistema, ou possivelmente pelas opções usadas para compilar o MySQL. A maioria das variáveis do sistema tem um valor padrão, mas há exceções, incluindo variáveis de somente leitura. Você também pode usar valores de variáveis do sistema em expressões.

A definição de um valor de tempo de execução de uma variável de sistema global normalmente requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio depreciado `SUPER`). A definição de um valor de variável de tempo de execução de um sistema de sessão normalmente não requer privilégios especiais e pode ser feita por qualquer usuário, embora haja exceções. Para mais informações, consulte a Seção 7.1.9.1,  Privilégios de variáveis de sistema

Existem várias maneiras de ver os nomes e valores das variáveis do sistema:

- Para ver os valores que um servidor usa com base em seus padrões compilados e quaisquer arquivos de opção que ele lê, use este comando:

  ```
  mysqld --verbose --help
  ```
- Para ver os valores que um servidor usa com base apenas em seus padrões compilados, ignorando as configurações em quaisquer arquivos de opção, use este comando:

  ```
  mysqld --no-defaults --verbose --help
  ```
- Para ver os valores atuais usados por um servidor em execução, use a instrução `SHOW VARIABLES` ou as tabelas de variáveis do sistema do Esquema de Desempenho.

Esta secção fornece uma descrição de cada variável do sistema. Para uma tabela resumida de variáveis do sistema, consulte a Seção 7.1.5, "Referência de variáveis do sistema do servidor". Para mais informações sobre a manipulação de variáveis do sistema, consulte a Seção 7.1.9, "Uso de variáveis do sistema".

Para informações adicionais sobre as variáveis do sistema, ver as seguintes secções:

- A secção 7.1.9, "Utilizar variáveis do sistema", discute a sintaxe para definir e exibir valores de variáveis do sistema.
- A secção 7.1.9.2, "Variaveis do sistema dinâmico", enumera as variáveis que podem ser definidas durante a execução.
- As informações sobre as variáveis de ajuste do sistema podem ser encontradas na secção 7.1.1, "Configuração do servidor".
- A seção 17.14, "Opções de inicialização do InnoDB e variáveis do sistema", lista as variáveis do sistema `InnoDB`.
- A secção 25.4.3.9.2, Variaveis do sistema de cluster NDB, enumera as variáveis do sistema que são específicas do cluster NDB.
- Para obter informações sobre as variáveis do sistema de servidor específicas para a replicação, ver Secção 19.1.6, "Opções e variáveis de replicação e registo binário".

::: info Note

Algumas das seguintes descrições de variáveis referem-se a  habilitar ou  desativar uma variável. Estas variáveis podem ser ativadas com a instrução `SET` definindo-as em `ON` ou `1`, ou desativadas definindo-as em `OFF` ou `0`. As variáveis booleanas podem ser definidas na inicialização para os valores `ON`, `TRUE`, `OFF`, e `FALSE` (não sensível a maiúscula e minúscula), bem como `1` e `0`.

:::

Algumas variáveis do sistema controlam o tamanho de buffers ou caches. Para um determinado buffer, o servidor pode precisar alocar estruturas de dados internas. Estas estruturas são normalmente alocadas a partir da memória total alocada ao buffer, e a quantidade de espaço necessário pode ser dependente da plataforma. Isso significa que quando você atribui um valor a uma variável do sistema que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor do que o valor atribuído. Também é possível que o servidor ajuste um valor para cima. Por exemplo, se você atribuir um valor de 0 a uma variável para a qual o valor mínimo é 1024, o servidor define o valor para 1024.

Os valores para os tamanhos de buffer, comprimentos e tamanhos de pilha são dados em bytes, salvo indicação em contrário.

::: info Note

Algumas descrições de variáveis de sistema incluem um tamanho de bloco, caso em que um valor que não é um múltiplo inteiro do tamanho de bloco declarado é arredondado para o próximo múltiplo inferior do tamanho do bloco antes de ser armazenado pelo servidor, ou seja, para `FLOOR(value)` `* block_size`.

*Exemplo*: Suponha que o tamanho do bloco para uma determinada variável é dado como 4096, e você defina o valor da variável em 100000 (assumimos que o valor máximo da variável é maior do que este número). Uma vez que 100000 / 4096 = 24.4140625, o servidor reduz automaticamente o valor para 98304 (24 \* 4096) antes de armazená-lo.

Em alguns casos, o máximo declarado para uma variável é o máximo permitido pelo analisador MySQL, mas não é um múltiplo exato do tamanho do bloco.

*Exemplo*: O valor máximo de uma variável de sistema é mostrado como 4294967295 (232-1), e seu tamanho de bloco é 1024. 4294967295 / 1024 = 4194303.9990234375, então se você definir essa variável para o seu máximo declarado, o valor realmente armazenado é 4194303 \* 1024 = 4294966272.

:::

Algumas variáveis do sistema tomam valores de nome de arquivo. A menos que especificado de outra forma, o local padrão do arquivo é o diretório de dados se o valor for um nome de caminho relativo. Para especificar o local explicitamente, use um nome de caminho absoluto. Suponha que o diretório de dados seja `/var/mysql/data`. Se uma variável de valor de arquivo for dada como um nome de caminho relativo, ela estará localizada em `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização será dada pelo nome do caminho.

- `activate_all_roles_on_login`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--activate-all-roles-on-login[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>activate_all_roles_on_login</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Ativar ou não a ativação automática de todas as funções concedidas quando os utilizadores efetuarem o login no servidor:

- Se `activate_all_roles_on_login` estiver habilitado, o servidor ativará todas as funções atribuídas a cada conta no momento do login. Isso tem precedência sobre as funções padrão especificadas com `SET DEFAULT ROLE`.
- Se `activate_all_roles_on_login` for desativado, o servidor ativará as funções padrão especificadas com `SET DEFAULT ROLE`, se houver, no momento do login.

As funções concedidas incluem aquelas concedidas explicitamente ao usuário e aquelas nomeadas no valor da variável do sistema `mandatory_roles`.

Para alterar as funções ativas dentro de uma sessão, use `SET ROLE`. Para alterar as funções ativas para um programa armazenado, o corpo do programa deve executar `SET ROLE`.

- `admin_address`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O endereço IP para ouvir as conexões TCP/IP na interface de rede administrativa (ver Seção 7.1.12.1, Connection Interfaces). Não há valor padrão `admin_address`. Se esta variável não for especificada no início, o servidor não mantém nenhuma interface administrativa. O servidor também tem uma variável de sistema `bind_address` para configurar conexões TCP/IP de cliente regulares (não administrativas).

Se for especificado o código PH, o seu valor deve satisfazer os seguintes requisitos:

- O valor deve ser um único endereço IPv4, endereço IPv6 ou nome de host.
- O valor não pode especificar um formato de endereço com código-comodão (`*`, `0.0.0.0`, ou `::`).
- O valor pode incluir um especificador de espaço de nomes de rede.

Um endereço IP pode ser especificado como um endereço IPv4 ou IPv6. Se o valor for um nome de host, o servidor resolve o nome para um endereço IP e se liga a esse endereço. Se um nome de host resolve para vários endereços IP, o servidor usa o primeiro endereço IPv4 se houver algum, ou o primeiro endereço IPv6 caso contrário.

O servidor trata diferentes tipos de endereços da seguinte forma:

- Se o endereço for um endereço mapeado IPv4, o servidor aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o servidor estiver vinculado ao `::ffff:127.0.0.1`, os clientes podem se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.
- Se o endereço for um endereço regular IPv4 ou IPv6 (como `127.0.0.1` ou `::1`), o servidor aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

Estas regras são aplicáveis à especificação de um espaço de nomes de rede para um endereço:

- Um espaço de nomes de rede pode ser especificado para um endereço IP ou um nome de host.
- Não é possível especificar um espaço de nomes de rede para um endereço IP com código-fonte.
- Para um determinado endereço, o espaço de nomes de rede é opcional. Se dado, ele deve ser especificado como um sufixo `/ns` imediatamente após o endereço.
- Um endereço sem o sufixo `/ns` usa o espaço de nomes global do sistema host. O espaço de nomes global é, portanto, o padrão.
- Um endereço com um sufixo `/ns` usa o espaço de nomes chamado `ns`.
- O sistema host deve suportar espaços de nomes de rede e cada espaço de nomes nomeado deve ter sido previamente configurado.

Para informações adicionais sobre espaços de nomes de rede, ver Seção 7.1.14, "Suporte para espaços de nomes de rede".

Se a ligação ao endereço falhar, o servidor produz um erro e não inicia.

A variável do sistema `admin_address` é semelhante à variável do sistema `bind_address` que liga o servidor a um endereço para conexões de cliente comuns, mas com estas diferenças:

- `bind_address` permite vários endereços. `admin_address` permite um único endereço.
- O `bind_address` permite endereços com caracteres em branco. O `admin_address`

* `admin_port`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

O número da porta TCP/IP a utilizar para as ligações na interface de rede administrativa (ver secção 7.1.12.1, "Interfaces de ligação").

A definição de `admin_port` não tem efeito se `admin_address` não for especificado porque, nesse caso, o servidor não mantém nenhuma interface de rede administrativa.

- `admin_ssl_ca`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

A variável de sistema `admin_ssl_ca` é como `ssl_ca`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal.

- `admin_ssl_capath`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--admin-ssl-capath=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_capath</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

A variável de sistema `admin_ssl_capath` é como `ssl_capath`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal.

- `admin_ssl_cert`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--admin-ssl-cert=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cert</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

A variável de sistema `admin_ssl_cert` é como `ssl_cert`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal.

- `admin_ssl_cipher`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--admin-ssl-cipher=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cipher</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

A variável de sistema `admin_ssl_cipher` é como `ssl_cipher`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal.

A lista especificada por esta variável pode incluir qualquer um dos seguintes valores:

- `ECDHE-ECDSA-AES128-GCM-SHA256`
- `ECDHE-ECDSA-AES256-GCM-SHA384`
- `ECDHE-RSA-AES128-GCM-SHA256`
- `ECDHE-RSA-AES256-GCM-SHA384`
- `ECDHE-ECDSA-CHACHA20-POLY1305`
- `ECDHE-RSA-CHACHA20-POLY1305`
- `ECDHE-ECDSA-AES256-CCM`
- `ECDHE-ECDSA-AES128-CCM`
- `DHE-RSA-AES128-GCM-SHA256`
- `DHE-RSA-AES256-GCM-SHA384`
- `DHE-RSA-AES256-CCM`
- `DHE-RSA-AES128-CCM`
- `DHE-RSA-CHACHA20-POLY1305`

Tentar incluir quaisquer valores na lista de criptografia que não são mostrados aqui ao definir esta variável gera um erro (`ER_BLOCKED_CIPHER`).

- `admin_ssl_crl`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--admin-ssl-crl=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crl</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

A variável de sistema `admin_ssl_crl` é como `ssl_crl`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal.

- `admin_ssl_crlpath`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--admin-ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crlpath</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

A variável de sistema `admin_ssl_crlpath` é como `ssl_crlpath`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal.

- `admin_ssl_key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--admin-ssl-key=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_key</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

A variável de sistema `admin_ssl_key` é como `ssl_key`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal.

- `admin_tls_ciphersuites`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--admin-tls-ciphersuites=ciphersuite_list</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_tls_ciphersuites</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

A variável de sistema `admin_tls_ciphersuites` é como `tls_ciphersuites`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal.

O valor é uma lista de zero ou mais códigos separados por pontos entre os nomes aqui listados:

- `TLS_AES_128_GCM_SHA256`
- `TLS_AES_256_GCM_SHA384`
- `TLS_CHACHA20_POLY1305_SHA256`
- `TLS_AES_128_CCM_SHA256`

Tentar incluir quaisquer valores na lista de criptografia que não são mostrados aqui ao definir esta variável gera um erro (`ER_BLOCKED_CIPHER`).

- `admin_tls_version`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--admin-tls-version=protocol_list</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_tls_version</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>TLSv1.2,TLSv1.3</code>]]</td> </tr></tbody></table>

A variável de sistema `admin_tls_version` é como `tls_version`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal.

Importância

- O MySQL 8.4 não suporta os protocolos de conexão TLSv1 e TLSv1.
- O MuySQL 8.4 suporta o protocolo TLSv1.3, desde que o servidor MySQL tenha sido compilado usando o OpenSSL 1.1.1 ou mais recente. O servidor verifica a versão do OpenSSL na inicialização e, se for mais antigo que 1.1.1, o TLSv1.3 é removido do valor padrão para a variável do sistema. Nesse caso, o padrão é `TLSv1.2`.

* `authentication_policy`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--authentication-policy=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_policy</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>*,,</code>]]</td> </tr></tbody></table>

Esta variável é usada para administrar capacidades de autenticação multifator (MFA). Para as instruções `CREATE USER` e `ALTER USER` usadas para gerenciar definições de contas do MySQL, ela determina qual fator ou fatores de autenticação podem ser especificados, onde factor corresponde a um método de autenticação ou plugin associado a uma conta. `authentication_policy` determina os seguintes aspectos da autenticação multifator:

- Número de fatores de autenticação.
- Os plugins (ou métodos) permitidos para cada fator.
- O plugin de autenticação padrão para especificações de autenticação que não nomeiam um plugin explicitamente.

Como o `authentication_policy` se aplica apenas quando as contas são criadas ou alteradas, as alterações ao seu valor não têm efeito nas contas de usuário existentes.

::: info Note

Embora a variável do sistema `authentication_policy` coloque certas restrições nas cláusulas relacionadas à autenticação das instruções `CREATE USER` e `ALTER USER`, um usuário que tenha o privilégio `AUTHENTICATION_POLICY_ADMIN` não está sujeito a essas restrições. (Um aviso ocorre para instruções que de outra forma não seriam permitidas.)

:::

O valor de `authentication_policy` é uma lista de 1, 2 ou 3 elementos separados por vírgulas, cada um correspondendo a um fator de autenticação e cada um sendo de uma das formas listadas aqui, com seus significados:

- *vazio*

  O fator de autenticação é opcional; pode ser utilizado qualquer plugin de autenticação.
- `*`

  O fator de autenticação é necessário; pode ser utilizado qualquer plugin de autenticação.
- `plugin_name`

  É necessário o fator de autenticação; este fator deve ser `plugin_name`.
- `*:plugin_name`

  O fator de autenticação é necessário; `plugin_name` é o padrão, mas outro plugin de autenticação pode ser usado.

Em cada caso, um elemento pode ser cercado por caracteres em branco.

`authentication_policy` deve conter pelo menos um fator não vazio, e quaisquer fatores vazios devem vir no final da lista, seguindo quaisquer fatores não vazios. Isso significa que `',,'` não é permitido porque isso significa que todos os fatores são opcionais. Cada conta deve ter pelo menos um fator de autenticação.

O valor padrão de `authentication_policy` é `'*,,'`. Isso significa que o fator 1 é necessário nas definições de conta e pode usar qualquer plugin de autenticação (com `caching_sha2_password` sendo o padrão), e que os fatores 2 e 3 são opcionais e cada um pode usar qualquer plugin de autenticação.

Se `authentication_policy` não especificar um plugin padrão para o primeiro fator, o plugin padrão para este fator é `caching_sha2_password`, embora outro plugin possa ser usado.

A tabela a seguir mostra alguns valores possíveis para `authentication_policy` e a política que cada um estabelece para criar ou alterar contas.

**Tabela 7.4 Exemplo de autenticação\_valores da política**

  <table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>política de autenticação</th> <th>Políticas</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>'*,*,'</code>]</td> <td>Apenas um fator, que usa [[PH_HTML_CODE_<code>'*,*,'</code>], embora outro plugin possa ser usado.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>'*,<em><code>auth_plugin</code>]</td> <td>Dois fatores apenas; o primeiro fator usa [[PH_HTML_CODE_<code>caching_sha2_password</code>] por padrão, embora outro plugin possa ser usado; o segundo pode usar qualquer plugin.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>'<em><code>auth_plugin</code>]</td> <td>Apenas três fatores, onde o primeiro fator usa [[PH_HTML_CODE_<code>'*,*:<em><code>auth_plugin</code>] por padrão, embora outro plugin possa ser usado; o segundo e o terceiro fatores podem usar qualquer plugin.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>caching_sha2_password</code>]</td> <td>Um ou dois fatores, onde o primeiro fator usa [[PH_HTML_CODE_<code>'<em><code>auth_plugin</code>] por padrão, embora outro plugin possa ser usado; o segundo fator é opcional e pode usar qualquer plugin.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>'*:<em><code>auth_plugin</code>]</td> <td>Um, dois ou três fatores, onde o primeiro fator usa [[PH_HTML_CODE_<code>'<em><code>auth_plugin</code>] por padrão, embora outro plugin possa ser usado; o segundo fator e o terceiro fatores são opcionais e podem usar qualquer plugin.</td> </tr><tr> <td>[[<code>'*,*,'</code>]]</td> <td>Dois ou três fatores, onde o primeiro fator usa [[<code>caching_sha2_password</code><code>'*,*,'</code>] por padrão, embora outro plugin possa ser usado; o segundo fator é necessário e o terceiro fator é opcional; o segundo e o terceiro fatores podem usar qualquer plugin.</td> </tr><tr> <td>[[<code>'*,<em><code>auth_plugin</code>]]</em>"</code></td> <td>Dois fatores, onde o primeiro fator usa [[<code>caching_sha2_password</code>]] por padrão, embora outro plugin possa ser usado; o segundo fator deve ser o plugin nomeado.</td> </tr><tr> <td>[[<code>'<em><code>auth_plugin</code>]]</em>,*",</code></td> <td>Dois ou três fatores, onde o primeiro fator deve ser o plugin nomeado; o segundo fator é necessário, mas pode usar qualquer plugin; o terceiro fator é opcional e pode usar qualquer plugin.</td> </tr><tr> <td>[[<code>'*,*:<em><code>auth_plugin</code>]]</em>"</code></td> <td>Dois fatores, onde o primeiro fator usa [[<code>caching_sha2_password</code>]] por padrão, embora outro plugin possa ser usado; o segundo fator é necessário e usa o plugin nomeado, mas outro plugin pode ser usado.</td> </tr><tr> <td>[[<code>'<em><code>auth_plugin</code>]]</em>",</code></td> <td>Um ou dois fatores, onde o primeiro fator deve ser o plugin nomeado; o segundo fator é opcional e pode usar qualquer plugin.</td> </tr><tr> <td>[[<code>'*:<em><code>auth_plugin</code>]]</em>,*",</code></td> <td>Dois ou três fatores, onde o primeiro fator deve ser o plugin nomeado; o segundo fator é necessário e pode usar qualquer plugin, e o terceiro fator é opcional e pode usar qualquer plugin.</td> </tr><tr> <td>[[<code>'<em><code>auth_plugin</code>]]</em>,<em>[[<code>'*,*'</code><code>'*,*,'</code>]</em>,<em>[[<code>'*,*'</code><code>'*,*,'</code>]</em>"</code></td> <td>Três fatores, onde todos os três fatores devem usar os plugins nomeados.</td> </tr></tbody></table>* [[PH_BACKTICK_2<code>'*,<em><code>auth_plugin</code>]

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--authentication-windows-log-level=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_windows_log_level</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>2</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4</code>]]</td> </tr></tbody></table>

Esta variável só está disponível se o plug-in de autenticação do Windows `authentication_windows` estiver habilitado e o código de depuração estiver habilitado.

Esta variável define o nível de registro para o plugin de autenticação do Windows. A tabela a seguir mostra os valores permitidos.

  <table><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0 0</td> <td>Sem extração de madeira</td> </tr><tr> <td>1 .</td> <td>Registre apenas mensagens de erro</td> </tr><tr> <td>2 .</td> <td>Registro de mensagens de nível 1 e mensagens de aviso</td> </tr><tr> <td>3 .</td> <td>Mensagens e notas de informação de nível 2 do registo</td> </tr><tr> <td>Quatro</td> <td>Registro de mensagens de nível 3 e mensagens de depuração</td> </tr></tbody></table>* [[`authentication_windows_use_principal_name`]]

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--authentication-windows-use-principal-name[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_windows_use_principal_name</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Esta variável só está disponível se o plug-in de autenticação do Windows `authentication_windows` estiver ativado. Veja Seção 8.4.1.6, "Windows Pluggable Authentication".

Um cliente que autentica usando a função `InitSecurityContext()` deve fornecer uma string identificando o serviço ao qual se conecta (`targetName`). O MySQL usa o nome principal (UPN) da conta sob a qual o servidor está sendo executado. O UPN tem o formato `user_id@computer_name` e não precisa ser registrado em nenhum lugar para ser usado. Este UPN é enviado pelo servidor no início do aperto de mão de autenticação.

Esta variável controla se o servidor envia o UPN no desafio inicial. Por padrão, a variável é habilitada. Por razões de segurança, ela pode ser desativada para evitar o envio do nome da conta do servidor para um cliente como texto claro. Se a variável for desativada, o servidor sempre envia um byte `0x00` no primeiro desafio, o cliente não especifica `targetName`, e, como resultado, a autenticação NTLM é usada.

Se o servidor não conseguir obter seu UPN (o que acontece principalmente em ambientes que não suportam a autenticação Kerberos), o UPN não é enviado pelo servidor e a autenticação NTLM é usada.

- `autocommit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--autocommit[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>autocommit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

O modo autocommit. Se definido para 1, todas as alterações em uma tabela entram em vigor imediatamente. Se definido para 0, você deve usar `COMMIT` para aceitar uma transação ou `ROLLBACK` para cancelá-la. Se `autocommit` é 0 e você mudá-lo para 1, o MySQL executa um `COMMIT` automático de qualquer transação aberta. Outra maneira de iniciar uma transação é usar uma `START TRANSACTION` ou `BEGIN` instrução. Veja Seção 15.3.1, START TRANSACTION, COMMIT, e ROLLBACK Statements.

Por padrão, as conexões do cliente começam com o valor padrão de 0 para fazer com que os clientes comecem com um padrão de 0, defina o valor global de 1 iniciando o servidor com a opção 2. Para definir a variável usando um arquivo de opção, inclua estas linhas:

```
[mysqld]
autocommit=0
```

- `automatic_sp_privileges`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--automatic-sp-privileges[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>automatic_sp_privileges</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Quando essa variável tem um valor de 1 (o padrão), o servidor automaticamente concede os privilégios `EXECUTE` e `ALTER ROUTINE` ao criador de uma rotina armazenada, se o usuário não puder executar e alterar ou descartar a rotina. (O privilégio `ALTER ROUTINE` é necessário para descartar a rotina.) O servidor também descartará automaticamente esses privilégios do criador quando a rotina for descartada. Se `automatic_sp_privileges` for 0, o servidor não adiciona ou descartará automaticamente esses privilégios.

O criador de uma rotina é a conta usada para executar a instrução `CREATE` para ela. Isso pode não ser o mesmo que a conta nomeada como `DEFINER` na definição da rotina.

Se você iniciar `mysqld` com `--skip-new`, `automatic_sp_privileges` é definido como `OFF`.

Ver também a Secção 27.2.2, "Rutinas armazenadas e privilégios MySQL".

- `auto_generate_certs`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--auto-generate-certs[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>auto_generate_certs</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Esta variável controla se o servidor gera automaticamente os arquivos de chave e certificado SSL no diretório de dados, se ainda não existirem.

Na inicialização, o servidor gera automaticamente o certificado SSL do lado do servidor e do lado do cliente e arquivos-chave no diretório de dados se a variável de sistema `auto_generate_certs` estiver ativada e os arquivos SSL do lado do servidor estiverem ausentes no diretório de dados. Estes certificados são sempre gerados em tais casos, independentemente dos valores de quaisquer outras opções TLS. Os arquivos de certificado e chave permitem conexões seguras do cliente usando SSL; veja Seção 8.3.1,  Configurando o MySQL para usar conexões criptografadas.

Para obter mais informações sobre a geração automática de arquivos SSL, incluindo nomes e características de arquivos, consulte a Seção 8.3.3.1, Criação de certificados e chaves SSL e RSA usando MySQL

As variáveis do sistema `sha256_password_auto_generate_rsa_keys` e `caching_sha2_password_auto_generate_rsa_keys` estão relacionadas, mas controlam a geração automática de arquivos de pares de chaves RSA necessários para troca segura de senhas usando RSA em conexões não criptografadas.

- `back_log`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--back-log=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>back_log</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>-1</code>]] (significa auto-dimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

O número de solicitações de conexão pendentes que o MySQL pode ter. Isso entra em jogo quando o tópico principal do MySQL recebe muitos pedidos de conexão em um tempo muito curto. Leva algum tempo (embora muito pouco) para o tópico principal verificar a conexão e iniciar um novo tópico. O valor `back_log` indica quantos pedidos podem ser empilhados durante esse curto tempo antes que o MySQL pare momentaneamente de responder a novos pedidos. Você precisa aumentar isso apenas se você espera um grande número de conexões em um curto período de tempo.

Em outras palavras, este valor é o tamanho da fila de escuta para conexões TCP/IP de entrada. Seu sistema operacional tem seu próprio limite sobre o tamanho desta fila. A página do manual para a chamada do sistema `listen()` do Unix deve ter mais detalhes. Verifique a documentação do seu sistema operacional para o valor máximo para esta variável. `back_log` não pode ser definido acima do limite do seu sistema operacional.

O valor padrão é o valor de `max_connections`, que permite que o backlog permitido se ajuste ao número máximo permitido de conexões.

- `basedir`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--basedir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>basedir</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>parent of mysqld installation directory</code>]]</td> </tr></tbody></table>

O caminho para o diretório da base de instalação do MySQL.

- `big_tables`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--big-tables[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>big_tables</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se ativado, o servidor armazena todas as tabelas temporárias no disco e não na memória. Isso evita a maioria dos erros `The table tbl_name is full` para operações `SELECT` que requerem uma grande tabela temporária, mas também retarda consultas para as quais tabelas na memória seriam suficientes.

O valor padrão para novas conexões é `OFF` (use in-memory temporary tables). Normalmente, nunca deve ser necessário habilitar essa variável. Quando as tabelas temporárias *internas* em memória são gerenciadas pelo mecanismo de armazenamento `TempTable` (o padrão), e a quantidade máxima de memória que pode ser ocupada pelo mecanismo de armazenamento `TempTable` é excedida, o mecanismo de armazenamento `TempTable` começa a armazenar dados em arquivos temporários no disco. Quando as tabelas temporárias em memória são gerenciadas pelo mecanismo de armazenamento `MEMORY`, as tabelas em memória são automaticamente convertidas em tabelas baseadas em disco, conforme necessário. Para mais informações, consulte a Seção 10.4.4, Uso de Tabela Temporária Interna no MySQL.

- `bind_address`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--bind-address=addr</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>bind_address</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>*</code>]]</td> </tr></tbody></table>

O servidor MySQL escuta em um ou mais soquetes de rede para conexões TCP/IP. Cada soquete é vinculado a um endereço, mas é possível que um endereço seja mapeado em várias interfaces de rede. Para especificar como o servidor deve ouvir por conexões TCP/IP, defina a variável de sistema `bind_address` na inicialização do servidor. O servidor também tem uma variável de sistema `admin_address` que permite conexões administrativas em uma interface dedicada.

Se `bind_address` for especificado, aceita uma lista de um ou mais valores de endereço, cada um dos quais pode especificar um único endereço IP não-wildcard ou nome de host. Cada endereço pode incluir um especificador de espaço de nomes de rede. Se apenas um endereço for especificado, ele pode usar um dos formatos de endereço wildcard que permitem ouvir em várias interfaces de rede (`*`, `0.0.0.0`, ou `::`). Vários endereços são separados por vírgulas. Quando vários valores são listados, cada valor deve especificar um único endereço IP não-wildcard (seja IPv4 ou IPv6) ou um nome de host, e os formatos de endereço wildcard (`*`, `0.0.0.0`, ou `::`) não são permitidos.

Os endereços IP podem ser especificados como endereços IPv4 ou IPv6. Para qualquer valor que seja um nome de host, o servidor resolve o nome para um endereço IP e se liga a esse endereço. Se um nome de host resolve para vários endereços IP, o servidor usa o primeiro endereço IPv4 se houver algum, ou o primeiro endereço IPv6 caso contrário.

O servidor trata diferentes tipos de endereços da seguinte forma:

- Se o endereço for `*`, o servidor aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor e, se o host do servidor suportar IPv6, em todas as interfaces IPv6. Use este endereço para permitir conexões IPv4 e IPv6 em todas as interfaces do servidor. Este valor é o padrão. Se a variável especificar uma lista de múltiplos valores, este valor não é permitido.
- Se o endereço for `0.0.0.0`, o servidor aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor. Se a variável especificar uma lista de múltiplos valores, este valor não é permitido.
- Se o endereço for `::`, o servidor aceita conexões TCP/IP em todas as interfaces IPv4 e IPv6 do host do servidor. Se a variável especificar uma lista de múltiplos valores, este valor não é permitido.
- Se o endereço for um endereço mapeado IPv4, o servidor aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o servidor estiver vinculado ao `::ffff:127.0.0.1`, os clientes podem se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.
- Se o endereço for um endereço regular IPv4 ou IPv6 (como `127.0.0.1` ou `::1`), o servidor aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

Estas regras são aplicáveis à especificação de um espaço de nomes de rede para um endereço:

- Um espaço de nomes de rede pode ser especificado para um endereço IP ou um nome de host.
- Não é possível especificar um espaço de nomes de rede para um endereço IP com código-fonte.
- Para um determinado endereço, o espaço de nomes de rede é opcional. Se dado, ele deve ser especificado como um sufixo `/ns` imediatamente após o endereço.
- Um endereço sem o sufixo `/ns` usa o espaço de nomes global do sistema host. O espaço de nomes global é, portanto, o padrão.
- Um endereço com um sufixo `/ns` usa o espaço de nomes chamado `ns`.
- O sistema host deve suportar espaços de nomes de rede e cada espaço de nomes nomeado deve ter sido previamente configurado.
- Se o valor da variável especificar vários endereços, ele pode incluir endereços no espaço de nomes global, em espaços de nomes nomeados ou uma mistura.

Para informações adicionais sobre espaços de nomes de rede, ver Seção 7.1.14, "Suporte para espaços de nomes de rede".

Se a ligação a qualquer endereço falhar, o servidor produz um erro e não inicia.

Exemplos:

- `bind_address=*`

  O servidor escuta todos os endereços IPv4 ou IPv6, conforme especificado pelo wildcard.
- `bind_address=198.51.100.20`

  O servidor ouve apenas o endereço IPv4 `198.51.100.20`.
- `bind_address=198.51.100.20,2001:db8:0:f101::1`

  O servidor escuta no endereço IPv4 `198.51.100.20` e no endereço IPv6 `2001:db8:0:f101::1`.
- `bind_address=198.51.100.20,*`

  Isso produz um erro porque os endereços com wildcard não são permitidos quando `bind_address` nomeia uma lista de múltiplos valores.
- `bind_address=198.51.100.20/red,2001:db8:0:f101::1/blue,192.0.2.50`

  O servidor escuta o endereço IPv4 `198.51.100.20` no espaço de nomes `red`, o endereço IPv6 `2001:db8:0:f101::1` no espaço de nomes `blue` e o endereço IPv4 `192.0.2.50` no espaço de nomes global.

Quando \[`bind_address`] nomeia um único valor (wildcard ou não-wildcard), o servidor escuta em um único soquete, que para um endereço wildcard pode ser vinculado a várias interfaces de rede. Quando \[`bind_address`] nomeia uma lista de múltiplos valores, o servidor escuta em um soquete por valor, com cada soquete vinculado a uma única interface de rede. O número de soquetes é linear com o número de valores especificados. Dependendo da eficiência de aceitação de conexão do sistema operacional, listas de valores longas podem incorrer em uma penalização de desempenho para aceitar conexões TCP / IP.

Como os descritores de arquivo são alocados para soquetes de escuta e arquivos de namespace de rede, pode ser necessário aumentar a variável de sistema `open_files_limit`.

Se você pretende vincular o servidor a um endereço específico, certifique-se de que a tabela de sistema `mysql.user` contém uma conta com privilégios administrativos que você pode usar para se conectar a esse endereço. Caso contrário, você não pode desligar o servidor. Por exemplo, se você vincular o servidor a `*`, você pode se conectar a ele usando todas as contas existentes. Mas se você vincular o servidor a `::1`, ele aceita conexões apenas nesse endereço. Nesse caso, primeiro verifique se a conta `'root'@'::1'` está presente na tabela `mysql.user` para que você ainda possa se conectar ao servidor para desligá-lo.

- `block_encryption_mode`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--block-encryption-mode=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>block_encryption_mode</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>aes-128-ecb</code>]]</td> </tr></tbody></table>

Esta variável controla o modo de criptografia de blocos para algoritmos baseados em blocos, como o AES. Ela afeta a criptografia para `AES_ENCRYPT()` e `AES_DECRYPT()`.

\[`block_encryption_mode`] toma um valor no formato \[`aes-keylen-mode`], onde \[`keylen`] é o comprimento da chave em bits e \[`mode`] é o modo de criptografia. O valor não é sensível a maiúsculas e minúsculas. Os valores permitidos \[`keylen`] são 128, 192 e 256. Os valores permitidos \[`mode`] são \[`ECB`], \[`CBC`], \[`CFB1`], \[`CFB8`], \[`CFB128`], e \[`OFB`].

Por exemplo, esta instrução faz com que as funções de criptografia AES usem um comprimento de chave de 256 bits e o modo CBC:

```
SET block_encryption_mode = 'aes-256-cbc';
```

Ocorre um erro para tentativas de definir `block_encryption_mode` para um valor contendo um comprimento de chave não suportado ou um modo que a biblioteca SSL não suporta.

- `build_id`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>build_id</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Específicos da plataforma</th> <td>Linux (em inglês)</td> </tr></tbody></table>

Esta é uma assinatura de `SHA1` de 160 bits que é gerada pelo linker ao compilar o servidor em sistemas Linux com `-DWITH_BUILD_ID=ON` (ativado por padrão), e convertido em uma string hexadecimal. Este valor somente leitura serve como um ID de compilação exclusivo, e é escrito no log do servidor na inicialização.

`build_id` não é suportado em plataformas que não sejam Linux.

- `bulk_insert_buffer_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--bulk-insert-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>bulk_insert_buffer_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>8388608</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes/thread</td> </tr></tbody></table>

A `MyISAM` usa um cache especial semelhante a uma árvore para fazer inserções em massa mais rápidas para `INSERT ... SELECT`, `INSERT ... VALUES (...), (...), ...`, e `LOAD DATA` ao adicionar dados a tabelas não vazias. Esta variável limita o tamanho da árvore de cache em bytes por thread. A definição para 0 desativa esta otimização. O valor padrão é 8MB.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

- `caching_sha2_password_digest_rounds`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--caching-sha2-password-digest-rounds=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>caching_sha2_password_digest_rounds</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>5000</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>5000</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4095000</code>]]</td> </tr></tbody></table>

O número de rodadas de hash usadas pelo plugin de autenticação `caching_sha2_password` para armazenamento de senhas.

O aumento do número de rodadas de hash acima do valor padrão acarreta uma penalização de desempenho que se correlaciona com o montante do aumento:

- A criação de uma conta que usa o plugin `caching_sha2_password` não tem impacto na sessão do cliente dentro da qual a conta é criada, mas o servidor deve executar as rodadas de hash para concluir a operação.
- Para conexões de cliente que usam a conta, o servidor deve executar as rodadas de hash e salvar o resultado no cache. O resultado é um tempo de login mais longo para a primeira conexão de cliente, mas não para conexões subsequentes. Este comportamento ocorre após cada reinicialização do servidor.

* `caching_sha2_password_auto_generate_rsa_keys`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--caching-sha2-password-auto-generate-rsa-keys[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>caching_sha2_password_auto_generate_rsa_keys</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

O servidor usa essa variável para determinar se deve gerar automaticamente arquivos de pares de chaves privadas/públicas RSA no diretório de dados se eles ainda não existirem.

Na inicialização, o servidor gera automaticamente arquivos de pares de chaves privadas/públicas RSA no diretório de dados se todas as seguintes condições forem verdadeiras: A variável de sistema `sha256_password_auto_generate_rsa_keys` ou `caching_sha2_password_auto_generate_rsa_keys` está habilitada; nenhuma opção RSA está especificada; os arquivos RSA estão ausentes do diretório de dados. Estes arquivos de pares de chaves permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password` (obsoleto) ou `caching_sha2_password`; veja Seção 8.4.1.3, SHA-256 Pluggable Authentication, e Seção 8.4.1.2, Caching SHA-2 Pluggable Authentication.

Para obter mais informações sobre a geração automática de arquivos RSA, incluindo nomes e características de arquivos, consulte a Seção 8.3.3.1, Criação de certificados e chaves SSL e RSA usando MySQL

A variável do sistema `auto_generate_certs` está relacionada, mas controla a geração automática de certificados SSL e arquivos de chave necessários para conexões seguras usando SSL.

- `caching_sha2_password_private_key_path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--caching-sha2-password-private-key-path=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>caching_sha2_password_private_key_path</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>private_key.pem</code>]]</td> </tr></tbody></table>

Esta variável especifica o nome do caminho do arquivo de chave privada RSA para o plug-in de autenticação `caching_sha2_password`. Se o arquivo for nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM.

Importância

Como este arquivo armazena uma chave privada, seu modo de acesso deve ser restrito para que apenas o servidor MySQL possa lê-lo.

Para obter informações sobre \[`caching_sha2_password`], consulte a secção 8.4.1.2, "Cache SHA-2 Pluggable Authentication".

- `caching_sha2_password_public_key_path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--caching-sha2-password-public-key-path=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>caching_sha2_password_public_key_path</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>public_key.pem</code>]]</td> </tr></tbody></table>

Esta variável especifica o nome do caminho do arquivo de chave pública da RSA para o plugin de autenticação `caching_sha2_password`. Se o arquivo for nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM.

Para obter informações sobre o `caching_sha2_password`, incluindo informações sobre como os clientes solicitam a chave pública do RSA, consulte a Seção 8.4.1.2,  Caching SHA-2 Pluggable Authentication.

- `character_set_client`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>character_set_client</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>utf8mb4</code>]]</td> </tr></tbody></table>

O conjunto de caracteres para instruções que chegam do cliente. O valor de sessão desta variável é definido usando o conjunto de caracteres solicitado pelo cliente quando o cliente se conecta ao servidor. (Muitos clientes suportam uma opção `--default-character-set` para permitir que este conjunto de caracteres seja especificado explicitamente. Veja também Seção 12.4,  Conjuntos de Caracteres de Conexão e Collações.) O valor global da variável é usado para definir o valor de sessão nos casos em que o valor solicitado pelo cliente é desconhecido ou não está disponível, ou o servidor está configurado para ignorar solicitações do cliente. Isso pode acontecer quando o cliente solicita um conjunto de caracteres desconhecido para o servidor, como quando um cliente habilitado para japonês solicita `sjis` ao se conectar a um servidor não configurado com suporte `sjis`.

Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente. Tentando usá-los como o valor `character_set_client` produz um erro.

- `character_set_connection`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>character_set_connection</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>utf8mb4</code>]]</td> </tr></tbody></table>

O conjunto de caracteres utilizado para literais especificados sem um introdutor de conjunto de caracteres e para a conversão de número para cadeia.

- `character_set_database`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>character_set_database</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>utf8mb4</code>]]</td> </tr><tr><th>Nota de rodapé</th> <td>Esta opção é dinâmica, mas deve ser definida apenas pelo servidor.</td> </tr></tbody></table>

O conjunto de caracteres usado pelo banco de dados padrão. O servidor define esta variável sempre que o banco de dados padrão muda. Se não houver banco de dados padrão, a variável tem o mesmo valor que `character_set_server`.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

As variáveis de sistema globais `character_set_database` e `collation_database` estão desatualizadas; espere que sejam removidas em uma versão futura do MySQL.

A atribuição de um valor para as variáveis de sistema de sessão `character_set_database` e `collation_database` está desatualizada e as atribuições produzem um aviso. Espere que as variáveis de sessão se tornem somente leitura (e as atribuições a elas produzam um erro) em uma versão futura do MySQL em que permanece possível acessar as variáveis de sessão para determinar o conjunto de caracteres de banco de dados e a coleta para o banco de dados padrão.

- `character_set_filesystem`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--character-set-filesystem=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>character_set_filesystem</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>binary</code>]]</td> </tr></tbody></table>

O conjunto de caracteres do sistema de arquivos. Esta variável é usada para interpretar literais de cadeia que se referem a nomes de arquivos, como nas instruções `LOAD DATA` e `SELECT ... INTO OUTFILE` e na função `LOAD_FILE()`. Tais nomes de arquivos são convertidos de `character_set_client` para `character_set_filesystem` antes da tentativa de abertura do arquivo. O valor padrão é `binary`, o que significa que nenhuma conversão ocorre. Para sistemas em que nomes de arquivos multibyte são permitidos, um valor diferente pode ser mais apropriado. Por exemplo, se o sistema representa nomes de arquivos usando UTF-8, configure `character_set_filesystem` para `'utf8mb4'`.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

- `character_set_results`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>character_set_results</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>utf8mb4</code>]]</td> </tr></tbody></table>

O conjunto de caracteres utilizado para devolver os resultados da consulta ao cliente. Isto inclui dados de resultado como valores de colunas, metadados de resultado como nomes de colunas e mensagens de erro.

- `character_set_server`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--character-set-server=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>character_set_server</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>utf8mb4</code>]]</td> </tr></tbody></table>

O conjunto de caracteres padrão dos servidores. Veja Seção 12.15, Caracter Set Configuration. Se você definir esta variável, você também deve definir `collation_server` para especificar a coleta para o conjunto de caracteres.

- `character_set_system`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>character_set_system</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>utf8mb3</code>]]</td> </tr></tbody></table>

O conjunto de caracteres usado pelo servidor para armazenar identificadores. O valor é sempre `utf8mb3`.

- `character_sets_dir`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>character_sets_dir</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório onde estão instalados os conjuntos de caracteres.

- `check_proxy_users`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--check-proxy-users[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>check_proxy_users</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Alguns plugins de autenticação implementam mapeamento de usuários proxy para si mesmos (por exemplo, os plugins de autenticação PAM e Windows). Outros plugins de autenticação não suportam usuários proxy por padrão.

Se a variável de sistema `check_proxy_users` estiver habilitada, o servidor executa o mapeamento de usuário proxy para qualquer plug-in de autenticação que faça tal solicitação. Também pode ser necessário habilitar variáveis de sistema específicas de plug-in para aproveitar o suporte de mapeamento de usuário proxy do servidor:

- Para o plug-in depreciado `mysql_native_password` (depreciado), ative `mysql_native_password_proxy_users`.
- Para o plug-in `sha256_password` (desatualizado), ative `sha256_password_proxy_users`.

Para obter informações sobre o proxy dos utilizadores, ver Secção 8.2.19, "Usuários proxy".

- `collation_connection`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>collation_connection</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A coleta do conjunto de caracteres de conexão. `collation_connection` é importante para comparações de strings literais. Para comparações de strings com valores de colunas, `collation_connection` não importa porque as colunas têm sua própria coleta, que tem uma precedência de coleta mais alta (ver Seção 12.8.4, Collation Coercibility in Expressions).

O uso do nome de uma coleta definida pelo usuário para esta variável gera um aviso.

- `collation_database`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>collation_database</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>utf8mb4_0900_ai_ci</code>]]</td> </tr><tr><th>Nota de rodapé</th> <td>Esta opção é dinâmica, mas deve ser definida apenas pelo servidor.</td> </tr></tbody></table>

A coleta usada pelo banco de dados padrão. O servidor define esta variável sempre que o banco de dados padrão muda. Se não houver banco de dados padrão, a variável tem o mesmo valor que `collation_server`.

As variáveis de sistema globais `character_set_database` e `collation_database` estão desatualizadas; espere que sejam removidas em uma versão futura do MySQL.

A atribuição de um valor para as variáveis de sistema de sessão `character_set_database` e `collation_database` está desatualizada e as atribuições produzem um aviso. Espere que as variáveis de sessão se tornem somente leitura (e as atribuições produzam um erro) em uma versão futura do MySQL em que permanece possível acessar as variáveis de sessão para determinar o conjunto de caracteres de banco de dados e a coleta para o banco de dados padrão.

O uso do nome de uma coleta definida pelo usuário para `collation_database` gera um aviso.

- `collation_server`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--collation-server=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>collation_server</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>utf8mb4_0900_ai_ci</code>]]</td> </tr></tbody></table>

A collação padrão do servidor. Ver Secção 12.15, "Configuração do conjunto de caracteres".

Definir isso para o nome de uma coleta definida pelo usuário gera um aviso.

- `completion_type`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--completion-type=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>completion_type</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NO_CHAIN</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>NO_CHAIN</code>]]</p><p class="valid-value">[[<code>CHAIN</code>]]</p><p class="valid-value">[[<code>RELEASE</code>]]</p><p class="valid-value">[[<code>0</code>]]</p><p class="valid-value">[[<code>1</code>]]</p><p class="valid-value">[[<code>2</code>]]</p></td> </tr></tbody></table>

O tipo de conclusão da transação. Esta variável pode ter os valores mostrados na tabela a seguir. A variável pode ser atribuída usando os valores de nome ou os valores inteiros correspondentes.

  <table><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>ROLLBACK</code>] (ou 0)</td> <td>[[PH_HTML_CODE_<code>ROLLBACK</code>] e [[PH_HTML_CODE_<code>ROLLBACK RELEASE</code>] não são afetados. Este é o valor padrão.</td> </tr><tr> <td>[[<code>CHAIN</code>]] (ou 1)</td> <td>[[<code>COMMIT</code>]] e [[<code>ROLLBACK</code>]] são equivalentes a [[<code>COMMIT AND CHAIN</code>]] e [[<code>ROLLBACK AND CHAIN</code>]], respectivamente. (Uma nova transação começa imediatamente com o mesmo nível de isolamento que a transação terminada.)</td> </tr><tr> <td>[[<code>RELEASE</code>]] (ou 2)</td> <td>O [[<code>COMMIT</code>]] e o [[<code>ROLLBACK</code>]] são equivalentes ao [[<code>COMMIT</code><code>ROLLBACK</code>] e ao [[<code>ROLLBACK RELEASE</code>]], respectivamente. (O servidor desconecta após o término da transação.)</td> </tr></tbody></table>

Ele não se aplica a compromissos implícitos resultantes da execução das instruções listadas na Seção 15.3.3, "Instruções que causam um compromisso implícito". Ele também não se aplica a "`XA COMMIT`", "`XA ROLLBACK`", ou quando "`autocommit=1`".

- `component_scheduler.enabled`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--component-scheduler.enabled[=valu<code>component_scheduler.enabled</code></code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>component_scheduler.enabled</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Quando definido para `OFF` na inicialização, o thread de fundo não é iniciado. As tarefas ainda podem ser agendadas, mas não são executadas até que `component_scheduler` seja ativado. Quando definido para `ON` na inicialização, o componente está totalmente operacional.

É também possível definir o valor de forma dinâmica para obter os seguintes efeitos:

- `ON` inicia o thread de fundo que começa a atender a fila imediatamente.
- `OFF` sinaliza um término do thread de fundo, que espera que ele termine. O thread de fundo verifica a bandeira de término antes de acessar a fila para verificar se há tarefas a executar.

* `concurrent_insert`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--concurrent-insert[=valu<code>concurrent_insert</code></code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>concurrent_insert</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>AUTO</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>NEVER</code>]]</p><p class="valid-value">[[<code>AUTO</code>]]</p><p class="valid-value">[[<code>ALWAYS</code>]]</p><p class="valid-value">[[<code>0</code>]]</p><p class="valid-value">[[<code>1</code>]]</p><p class="valid-value">[[<code>2</code>]]</p></td> </tr></tbody></table>

Se `AUTO` (o padrão), o MySQL permite que as instruções `INSERT` e `SELECT` sejam executadas simultaneamente para tabelas `MyISAM` que não têm blocos livres no meio do arquivo de dados.

Esta variável pode ter os valores mostrados na tabela a seguir. A variável pode ser atribuída usando os valores de nome ou os valores inteiros correspondentes.

  <table><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[<code>NEVER</code>]] (ou 0)</td> <td>Desativar inserções simultâneas</td> </tr><tr> <td>[[<code>AUTO</code>]] (ou 1)</td> <td>(Default) Permite inserir simultaneamente para tabelas [[<code>MyISAM</code>]] que não têm buracos</td> </tr><tr> <td>[[<code>ALWAYS</code>]] (ou 2)</td> <td>Permite inserções simultâneas para todas as tabelas [[<code>MyISAM</code>]], mesmo aquelas que têm buracos. Para uma tabela com um buraco, novas linhas são inseridas no final da tabela se estiver em uso por outro thread. Caso contrário, o MySQL adquire um bloqueio de escrita normal e insere a linha no buraco.</td> </tr></tbody></table>

Se você iniciar `mysqld` com `--skip-new`, `concurrent_insert` é definido como `NEVER`.

Ver também a secção 10.11.3, "Inserções simultâneas".

- `connect_timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--connect-timeout=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>connect_timeout</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>10</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>2</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

O número de segundos que o servidor `mysqld` espera por um pacote de conexão antes de responder com `Bad handshake`. O valor padrão é 10 segundos.

Aumentar o valor `connect_timeout` pode ajudar se os clientes frequentemente encontrarem erros do tipo `Lost connection to MySQL server at 'XXX', system error: errno`.

- `connection_memory_chunk_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--connection-memory-chunk-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>connection_memory_chunk_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>8192</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>536870912</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

Configure o tamanho de fragmentação para atualizações para o contador de uso de memória global `Global_connection_memory`. A variável de status é atualizada somente quando o consumo total de memória por todas as conexões de usuário muda mais do que essa quantidade. Desative atualizações definindo `connection_memory_chunk_size = 0`.

O cálculo de memória é exclusivo de qualquer memória usada por usuários do sistema, como o usuário raiz do MySQL. A memória usada pelo pool de buffer `InnoDB` também não está incluída.

Você deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir esta variável.

- `connection_memory_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--connection-memory-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>connection_memory_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>2097152</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

Defina a quantidade máxima de memória que pode ser usada por uma única conexão de usuário. Se qualquer conexão de usuário usar mais do que essa quantidade, todas as consultas dessa conexão serão rejeitadas com `ER_CONN_LIMIT`, incluindo quaisquer consultas atualmente em execução.

O limite definido por esta variável não se aplica aos usuários do sistema ou à conta raiz do MySQL. A memória usada pelo pool de buffer `InnoDB` também não está incluída.

Você deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir esta variável.

- `core_file`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>core_file</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se escrever um arquivo central se o servidor sair inesperadamente. Esta variável é definida pela opção `--core-file`.

- `create_admin_listener_thread`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--create-admin-listener-thread[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>create_admin_listener_thread</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se deve usar um thread de escuta dedicado para conexões de cliente na interface de rede administrativa (ver Seção 7.1.12.1, Connection Interfaces). O padrão é `OFF`; isto é, o thread de gerenciamento para conexões comuns na interface principal também lida com conexões para a interface administrativa.

Dependendo de fatores como o tipo de plataforma e a carga de trabalho, você pode achar que uma configuração para esta variável produz um melhor desempenho do que a outra configuração.

A definição de `create_admin_listener_thread` não tem efeito se `admin_address` não for especificado porque, nesse caso, o servidor não mantém nenhuma interface de rede administrativa.

- `cte_max_recursion_depth`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--cte-max-recursion-depth=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>cte_max_recursion_depth</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1000</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

A profundidade máxima de recursão da expressão de tabela comum (CTE). O servidor termina a execução de qualquer CTE que recorra a mais níveis do que o valor desta variável. Para mais informações, consulte Limitar a recursão da expressão de tabela comum.

- `datadir`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--datadir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>datadir</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O caminho para o diretório de dados do servidor MySQL. Os caminhos relativos são resolvidos em relação ao diretório atual. Se você espera que o servidor seja iniciado automaticamente (ou seja, em contextos para os quais você não pode saber o diretório atual com antecedência), é melhor especificar o valor `datadir` como um caminho absoluto.

- `debug`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug[=debug_option<code>debug</code></code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>debug</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor padrão (Unix)</th> <td>[[<code>d:t:i:o,/tmp/mysqld.trace</code>]]</td> </tr><tr><th>Valor padrão (Windows)</th> <td>[[<code>d:t:i:O,\mysqld.trace</code>]]</td> </tr></tbody></table>

Esta variável indica as configurações de depuração atuais. Está disponível apenas para servidores construídos com suporte de depuração. O valor inicial vem do valor de instâncias da opção `--debug` dada na inicialização do servidor. Os valores globais e de sessão podem ser definidos no tempo de execução.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

Atribuir um valor que começa com `+` ou `-` faz com que o valor seja adicionado ou subtraído do valor atual:

```
mysql> SET debug = 'T';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| T       |
+---------+

mysql> SET debug = '+P';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| P:T     |
+---------+

mysql> SET debug = '-P';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| T       |
+---------+
```

Para mais informações, ver secção 7.9.4, "O pacote DBUG".

- `debug_sync`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>debug_sync</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Esta variável é a interface do usuário para a facilidade de Debug Sync. O uso de Debug Sync requer que o MySQL seja configurado com a opção `-DWITH_DEBUG=ON` **CMake** (ver Seção 2.8.7, Opções de Configuração de Fonte do MySQL); caso contrário, esta variável do sistema não está disponível.

O valor da variável global é somente de leitura e indica se a facilidade está habilitada. Por padrão, a Sincronização de Debug é desativada e o valor de `debug_sync` é `OFF`. Se o servidor for iniciado com `--debug-sync-timeout=N`, onde \* `N` \* é um valor de tempo de espera maior que 0, a Sincronização de Debug é habilitada e o valor de `debug_sync` é `ON - current signal` seguido do nome do sinal. Além disso, \* `N` \* torna-se o tempo de espera padrão para pontos de sincronização individuais.

O valor da sessão pode ser lido por qualquer usuário e tem o mesmo valor que a variável global. O valor da sessão pode ser definido para controlar os pontos de sincronização.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

Para uma descrição da facilidade de Debug Sync e como usar pontos de sincronização, consulte MySQL Internals: Test Synchronization.

- `default_collation_for_utf8mb4`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>default_collation_for_utf8mb4</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>utf8mb4_0900_ai_ci</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>utf8mb4_0900_ai_ci</code>]]</p><p class="valid-value">[[<code>utf8mb4_general_ci</code>]]</p></td> </tr></tbody></table>Importância

A variável de sistema `default_collation_for_utf8mb4` é para uso interno apenas pela replicação MySQL.

Esta variável é definida pelo servidor para a collação padrão para o conjunto de caracteres `utf8mb4`. O valor da variável é replicado de uma fonte para uma réplica para que a réplica possa processar corretamente dados originados de uma fonte com uma collação padrão diferente para `utf8mb4`. Esta variável destina-se principalmente a suportar a replicação de um servidor de origem de replicação MySQL 5.7 ou mais antigo para um servidor de réplica MySQL posterior, ou a replicação em grupo com um nó primário MySQL 5.7 e um ou mais secundários MySQL 8.0 ou posteriores. A collação padrão para `utf8mb4` no MySQL 5.7 é `utf8mb4_general_ci`, mas \[\[PH\_CODE\_CODE\_4]] em séries de versões posteriores. A variável não está presente em versões anteriores ao MySQL 8.0, portanto, se a réplica não receber um valor para a variável de origem, assume que a versão anterior é uma versão anterior e define o valor padrão padr

A coleta padrão `utf8mb4` é usada nas seguintes instruções:

- `SHOW COLLATION` e `SHOW CHARACTER SET`.
- `CREATE TABLE` e `ALTER TABLE` com uma cláusula `CHARACTER SET utf8mb4` sem uma cláusula `COLLATION`, seja para o conjunto de caracteres de tabela ou para um conjunto de caracteres de coluna.
- `CREATE DATABASE` e `ALTER DATABASE` com uma cláusula `CHARACTER SET utf8mb4` sem uma cláusula `COLLATION`.
- Qualquer instrução que contenha um literal de string da forma `_utf8mb4'some text'` sem uma cláusula `COLLATE`.

Ver também a secção 12.9, "Suporte de Unicode".

- `default_password_lifetime`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-password-lifetime=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>default_password_lifetime</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr><tr><th>Unidade</th> <td>dias</td> </tr></tbody></table>

Esta variável define a política global de expiração automática de senhas. O valor padrão `default_password_lifetime` é 0, o que desativa a expiração automática de senhas. Se o valor de `default_password_lifetime` for um número inteiro positivo `N`, ele indica o tempo de vida permitido da senha; as senhas devem ser alteradas a cada `N` dias.

A política de expiração de senha global pode ser substituída conforme desejado para contas individuais usando a opção de expiração de senha das instruções `CREATE USER` e `ALTER USER`.

- `default_storage_engine`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-storage-engine=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>default_storage_engine</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>InnoDB</code>]]</td> </tr></tbody></table>

O motor de armazenamento padrão para tabelas. Veja Capítulo 18, *Motores de armazenamento alternativos*. Esta variável define o motor de armazenamento apenas para tabelas permanentes. Para definir o motor de armazenamento para tabelas `TEMPORARY`, defina a variável de sistema `default_tmp_storage_engine`.

Para ver quais motores de armazenamento estão disponíveis e habilitados, use a instrução `SHOW ENGINES` ou consulte a tabela `INFORMATION_SCHEMA` `ENGINES`.

Se você desativar o motor de armazenamento padrão na inicialização do servidor, você deve definir o motor padrão para ambas as tabelas permanentes e `TEMPORARY` para um motor diferente, ou então o servidor não será iniciado.

- `default_table_encryption`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-table-encryption[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>default_table_encryption</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Define a configuração de encriptação padrão aplicada aos esquemas e aos espaços de tabela gerais quando são criados sem especificar uma cláusula `ENCRYPTION`.

A variável `default_table_encryption` só é aplicável aos esquemas criados pelo usuário e aos espaços de tabelas gerais. Ela não rege a criptografia do espaço de tabelas do sistema `mysql`.

A definição do valor de tempo de execução de `default_table_encryption` requer os privilégios `SYSTEM_VARIABLES_ADMIN` e `TABLE_ENCRYPTION_ADMIN`, ou o privilégio depreciado `SUPER`.

O valor de `default_table_encryption` não pode ser alterado enquanto a Replicação de Grupo estiver em execução.

O `default_table_encryption` suporta a sintaxe `SET PERSIST` e `SET PERSIST_ONLY`.

Para mais informações, consulte Definir um padrão de criptografia para esquemas e espaços de tabelas gerais.

- `default_tmp_storage_engine`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-tmp-storage-engine=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>default_tmp_storage_engine</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>InnoDB</code>]]</td> </tr></tbody></table>

O motor de armazenamento padrão para tabelas `TEMPORARY` (criado com `CREATE TEMPORARY TABLE`). Para definir o motor de armazenamento para tabelas permanentes, defina a variável de sistema `default_storage_engine`. Veja também a discussão dessa variável em relação a possíveis valores.

Se você desativar o motor de armazenamento padrão na inicialização do servidor, você deve definir o motor padrão para ambas as tabelas permanentes e `TEMPORARY` para um motor diferente, ou então o servidor não será iniciado.

- `default_week_format`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-week-format=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>default_week_format</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>7</code>]]</td> </tr></tbody></table>

O valor do modo padrão a utilizar para a função `WEEK()`. Ver Secção 14.7, Funções de data e hora.

- `delay_key_write`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--delay-key-write[={OFF|ON|ALL}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>delay_key_write</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>ALL</code>]]</p></td> </tr></tbody></table>

Esta variável especifica como usar as gravações de chaves atrasadas. Aplica-se apenas às tabelas `MyISAM`. A gravação de chaves atrasadas faz com que os buffers de chaves não sejam limpos entre as gravações. Veja também a Seção 18.2.1, Opções de inicialização do MyISAM.

Esta variável pode ter um dos seguintes valores para afetar o manuseamento da opção de tabela `DELAY_KEY_WRITE` que pode ser usada em instruções `CREATE TABLE`.

  <table><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Opção</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[<code>OFF</code>]]</td> <td>[[<code>DELAY_KEY_WRITE</code>]] é ignorado.</td> </tr><tr> <td>[[<code>ON</code>]]</td> <td>O MySQL honra qualquer opção [[<code>DELAY_KEY_WRITE</code>]] especificada nas instruções [[<code>CREATE TABLE</code>]]. Este é o valor padrão.</td> </tr><tr> <td>[[<code>ALL</code>]]</td> <td>Todas as novas tabelas abertas são tratadas como se fossem criadas com a opção [[<code>DELAY_KEY_WRITE</code>]] ativada.</td> </tr></tbody></table>

::: info Note

Se você definir esta variável como `ALL`, você não deve usar tabelas `MyISAM` de dentro de outro programa (como outro servidor MySQL ou `myisamchk`) quando as tabelas estão em uso. Fazer isso leva à corrupção do índice.

:::

Se `DELAY_KEY_WRITE` estiver habilitado para uma tabela, o buffer de chaves não é limpo para a tabela em cada atualização de índice, mas apenas quando a tabela é fechada. Isso acelera a gravação em chaves muito, mas se você usar esse recurso, você deve adicionar a verificação automática de todas as tabelas `MyISAM` iniciando o servidor com o conjunto de variáveis do sistema `myisam_recover_options` (por exemplo, `myisam_recover_options='BACKUP,FORCE'`). Veja Seção 7.1.8, Variáveis do sistema do servidor, e Seção 18.2.1, Opções de inicialização do MyISAM.

Se você iniciar `mysqld` com `--skip-new`, `delay_key_write` é definido como `OFF`.

Advertência

Se você habilitar o bloqueio externo com `--external-locking`, não há proteção contra a corrupção do índice para tabelas que usam gravações de chave atrasadas.

- `delayed_insert_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--delayed-insert-limit=#</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>delayed_insert_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>100</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

Esta variável de sistema está desatualizada (porque as inserções de `DELAYED` não são suportadas), e você deve esperar que ela seja removida em uma versão futura.

- `delayed_insert_timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--delayed-insert-timeout=#</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>delayed_insert_timeout</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>300</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

Esta variável de sistema está desatualizada (porque as inserções de `DELAYED` não são suportadas), e você deve esperar que ela seja removida em uma versão futura.

- `delayed_queue_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--delayed-queue-size=#</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>delayed_queue_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1000</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

Esta variável de sistema está desatualizada (porque as inserções de `DELAYED` não são suportadas), e você deve esperar que ela seja removida em uma versão futura.

- `disabled_storage_engines`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--disabled-storage-engines=engine[,engin<code>disabled_storage_engines</code>...</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>disabled_storage_engines</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

Esta variável indica quais motores de armazenamento não podem ser usados para criar tabelas ou tablespaces. Por exemplo, para evitar que novas tabelas `MyISAM` ou `FEDERATED` sejam criadas, inicie o servidor com estas linhas no arquivo de opções do servidor:

```
[mysqld]
disabled_storage_engines="MyISAM,FEDERATED"
```

Por padrão, `disabled_storage_engines` está vazio (sem motores desativados), mas pode ser definido como uma lista separada por vírgula de um ou mais motores (não sensível a maiúsculas e minúsculas). Qualquer motor nomeado no valor não pode ser usado para criar tabelas ou tablespaces com `CREATE TABLE` ou `CREATE TABLESPACE`, e não pode ser usado com `ALTER TABLE ... ENGINE` ou `ALTER TABLESPACE ... ENGINE` para alterar o motor de armazenamento de tabelas ou tablespaces existentes. Tentativas de fazê-lo resultam em um erro `ER_DISABLED_STORAGE_ENGINE`.

O `disabled_storage_engines` não restringe outras instruções DDL para tabelas existentes, como `CREATE INDEX`, `TRUNCATE TABLE`, `ANALYZE TABLE`, `DROP TABLE`, ou `DROP TABLESPACE`. Isso permite uma transição suave para que tabelas ou espaços de tabelas existentes que usam um motor desativado possam ser migrados para um motor permitido por meios como `ALTER TABLE ... ENGINE permitted_engine`.

É permitido definir a variável do sistema `default_storage_engine` ou `default_tmp_storage_engine` para um motor de armazenamento desativado. Isso pode fazer com que os aplicativos se comportem de forma errática ou falhem, embora isso possa ser uma técnica útil em um ambiente de desenvolvimento para identificar aplicativos que usam motores desativados, para que possam ser modificados.

`disabled_storage_engines` está desativado e não tem efeito se o servidor for iniciado com qualquer uma dessas opções: `--initialize`, `--initialize-insecure`, `--skip-grant-tables`.

- `disconnect_on_expired_password`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--disconnect-on-expired-password[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>disconnect_on_expired_password</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Esta variável controla como o servidor lida com clientes com senhas expiradas:

- Se o cliente indicar que pode lidar com senhas expiradas, o valor de `disconnect_on_expired_password` é irrelevante. O servidor permite que o cliente se conecte, mas coloca-o no modo sandbox.
- Se o cliente não indicar que pode lidar com senhas expiradas, o servidor lida com o cliente de acordo com o valor de \[`disconnect_on_expired_password`]:

  - Se `disconnect_on_expired_password`: estiver habilitado, o servidor desconecta o cliente.
  - Se `disconnect_on_expired_password`: estiver desativado, o servidor permite que o cliente se conecte, mas coloca-o no modo sandbox.

Para obter mais informações sobre a interação entre as configurações do cliente e do servidor relacionadas com o tratamento de senhas caducadas, ver Secção 8.2.16, "Controle do servidor de senhas caducadas".

- `div_precision_increment`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--div-precision-increment=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>div_precision_increment</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>4</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>30</code>]]</td> </tr></tbody></table>

Esta variável indica o número de dígitos para aumentar a escala do resultado das operações de divisão realizadas com o operador `/`. O valor padrão é 4. Os valores mínimo e máximo são 0 e 30, respectivamente. O exemplo a seguir ilustra o efeito do aumento do valor padrão.

```
mysql> SELECT 1/7;
+--------+
| 1/7    |
+--------+
| 0.1429 |
+--------+
mysql> SET div_precision_increment = 12;
mysql> SELECT 1/7;
+----------------+
| 1/7            |
+----------------+
| 0.142857142857 |
+----------------+
```

- `dragnet.log_error_filter_rules`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--dragnet.log-error-filter-rules=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>dragnet.log_error_filter_rules</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>IF prio&gt;=INFORMATION THEN drop. IF EXISTS source_line THEN unset source_line.</code>]]</td> </tr></tbody></table>

As regras do filtro que controlam a operação do componente de filtro de registro de erros `log_filter_dragnet`. Se `log_filter_dragnet` não estiver instalado, `dragnet.log_error_filter_rules` não estará disponível. Se `log_filter_dragnet` estiver instalado, mas não ativado, as alterações no `dragnet.log_error_filter_rules` não terão efeito.

O efeito do valor padrão é semelhante à filtragem realizada pelo filtro `log_sink_internal` com uma configuração de `log_error_verbosity=2`.

A variável de status `dragnet.Status` pode ser consultada para determinar o resultado da atribuição mais recente para `dragnet.log_error_filter_rules`.

- `enterprise_encryption.maximum_rsa_key_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--enterprise-encryption.maximum-rsa-key-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>enterprise_encryption.maximum_rsa_key_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>2048</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>16384</code>]]</td> </tr></tbody></table>

Esta variável limita o tamanho máximo das chaves RSA geradas pela MySQL Enterprise Encryption. A variável está disponível apenas se o componente MySQL Enterprise Encryption `component_enterprise_encryption` estiver instalado.

A configuração mais baixa é de 2048 bits, que é o comprimento mínimo da chave RSA que é aceitável pela melhor prática atual. A configuração padrão é de 4096 bits. A configuração mais alta é de 16384 bits. A geração de chaves mais longas pode consumir recursos significativos da CPU, então você pode usar essa configuração para limitar as chaves a um comprimento que forneça segurança adequada para suas necessidades, equilibrando isso com o uso de recursos.

- `enterprise_encryption.rsa_support_legacy_padding`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--enterprise-encryption.rsa_support_legacy_padding[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>enterprise_encryption.rsa_support_legacy_padding</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta variável controla se os dados criptografados e as assinaturas que a MySQL Enterprise Encryption produziu usando as antigas funções de biblioteca compartilhada `openssl_udf` podem ser decifradas ou verificadas pelo componente MySQL Enterprise Encryption (`component_enterprise_encryption`).

Para que as funções do componente suportem a descriptografia e verificação do conteúdo produzido pelas antigas funções de biblioteca compartilhada `openssl_udf`, você deve definir o preenchimento da variável do sistema em `ON`. Quando `ON` é definido, se as funções do componente não podem descriptografar ou verificar o conteúdo quando assumir que ele tem o esquema RSAES-OAEP ou RSASSA-PSS (como usado pelo componente), elas fazem outra tentativa assumindo que ele tem o esquema RSAES-PKCS1-v1\_5 ou RSASSA-PKCS1-v1\_5 (como usado pelas funções de biblioteca compartilhada `openssl_udf`). Quando `OFF` é definido, se as funções do componente não podem descriptografar ou verificar o conteúdo usando seus esquemas normais, elas retornam a saída nula. Veja Seção 8.6.2,  Configurando a criptografia MySQL Enterprise para obter mais informações.

- `end_markers_in_json`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--end-markers-in-json[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>end_markers_in_json</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se a saída JSON do optimizador deve adicionar marcadores de fim. Ver Seção 10.15.9, "The end\_markers\_in\_json System Variable" (A variável do sistema end\_markers\_in\_json).

- `eq_range_index_dive_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--eq-range-index-dive-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>eq_range_index_dive_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>200</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

Esta variável indica o número de intervalos de igualdade em uma condição de comparação de igualdade quando o otimizador deve mudar de usar mergulhos de índice para estatísticas de índice na estimativa do número de linhas qualificadas. Aplica-se à avaliação de expressões que têm uma dessas formas equivalentes, onde o otimizador usa um índice não exclusivo para procurar valores \* `col_name` \*:

```
col_name IN(val1, ..., valN)
col_name = val1 OR ... OR col_name = valN
```

Em ambos os casos, a expressão contém \* `N` \* intervalos de igualdade. O otimizador pode fazer estimativas de linhas usando mergulhos de índice ou estatísticas de índice. Se `eq_range_index_dive_limit` é maior que 0, o otimizador usa estatísticas de índice existentes em vez de mergulhos de índice se houver `eq_range_index_dive_limit` ou mais intervalos de igualdade. Assim, para permitir o uso de mergulhos de índice para até \* `N` \* intervalos de igualdade, configure `eq_range_index_dive_limit` para \* `N` \* + 1. Para desativar o uso de estatísticas de índice e sempre usar mergulhos de índice independentemente de \* `N`, configure `eq_range_index_dive_limit` para 0.

Para mais informações, consulte Optimização do Intervalo de Igualdade de Comparações de Muitos Valores.

Para atualizar as estatísticas de índice de tabela para as melhores estimativas, use `ANALYZE TABLE`.

- `error_count`

O número de erros resultantes da última instrução que gerou mensagens. Esta variável é apenas de leitura. Ver secção 15.7.7.18, "SHOW ERRORS Statement".

- `event_scheduler`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--event-scheduler[=valu<code>event_scheduler</code></code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>event_scheduler</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>DISABLED</code>]]</p></td> </tr></tbody></table>

Esta variável ativa ou desativa, e inicia ou interrompe, o Agendador de Eventos. Os possíveis valores de status são `ON`, `OFF`, e `DISABLED`. Virar o Agendador de Eventos `OFF` não é o mesmo que desativar o Agendador de Eventos, o que requer definir o status para `DISABLED`. Esta variável e seus efeitos sobre a operação do Agendador de Eventos são discutidos em maior detalhe na Seção 27.4.2,  Configuração do Agendador de Eventos

- `explain_format`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--explain-format=format</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>explain_format</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>TRADITIONAL</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>TRADITIONAL</code>]]</p><p class="valid-value">[[<code>JSON</code>]]</p><p class="valid-value">[[<code>TREE</code>]]</p></td> </tr></tbody></table>

Esta variável determina o formato de saída padrão usado por `EXPLAIN` na ausência de uma `FORMAT` opção ao exibir um plano de execução de consulta.

- `TRADITIONAL`: Use a saída tradicional baseada em tabela do MySQL, como se `FORMAT=TRADITIONAL` tivesse sido especificado como parte da instrução `EXPLAIN`. Este é o valor padrão da variável. `DEFAULT` também é suportado como sinônimo de `TRADITIONAL`, e tem exatamente o mesmo efeito.

  ::: info Note

  `DEFAULT` não pode ser usado como parte da opção `FORMAT` de uma instrução `EXPLAIN`.

  :::

- `JSON`: Use o formato de saída JSON, como se `FORMAT=JSON` tivesse sido especificado.

- `TREE`: Use o formato de saída baseado em árvore, como se `FORMAT=TREE` tivesse sido especificado.

A configuração desta variável também afeta o `EXPLAIN ANALYZE`. Para este propósito, o `DEFAULT` e o `TRADITIONAL` são interpelados como `TREE`. Se o valor do `explain_format` é `JSON` e uma instrução `EXPLAIN ANALYZE` sem opção `FORMAT` é emitida, a instrução gera um erro `ER_NOT_SUPPORTED_YET`.

O uso de um especificador de formato com `EXPLAIN` ou `EXPLAIN ANALYZE` substitui qualquer configuração para `explain_format`.

A variável de sistema `explain_format` não tem efeito sobre a saída `EXPLAIN` quando esta instrução é usada para exibir informações sobre colunas de tabela.

A definição do valor de sessão de `explain_format` não requer privilégios especiais; configurá-lo no nível global requer `SYSTEM_VARIABLES_ADMIN` (ou o privilégio depreciado `SUPER`).

Para mais informações e exemplos, ver Obter informações sobre o plano de execução.

- `explain_json_format_version`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--explain-json-format-version=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>explain_json_format_version</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2</code>]]</td> </tr></tbody></table>

Determina a versão do formato de saída JSON usado pelas instruções `EXPLAIN FORMAT=JSON`. A definição desta variável como `1` faz com que o servidor use a Versão 1, que é o formato linear usado para a saída de tais instruções em versões mais antigas do MySQL; este é o padrão no MySQL 8.4. A definição de `explain_json_format_version` como `2` faz com que o formato da Versão 2 seja usado; este formato de saída JSON é baseado em caminhos de acesso e destina-se a fornecer melhor compatibilidade com futuras versões do MySQL Optimizer.

Para um exemplo de utilização, ver Obtenção de Informações sobre o Plano de Execução.

- `explicit_defaults_for_timestamp`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--explicit-defaults-for-timestamp[={OFF|ON}]</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>explicit_defaults_for_timestamp</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Esta variável de sistema determina se o servidor permite certos comportamentos não padrão para valores padrão e manipulação de valores de `NULL` nas colunas `TIMESTAMP`. Por padrão, `explicit_defaults_for_timestamp` está habilitado, o que desativa os comportamentos não padrão. Desativar `explicit_defaults_for_timestamp` resulta em um aviso.

Se `explicit_defaults_for_timestamp` for desativado, o servidor habilita os comportamentos não padrão e lida com as colunas `TIMESTAMP` da seguinte forma:

- As colunas `TIMESTAMP` não declaradas explicitamente com o atributo `NULL` são declaradas automaticamente com o atributo `NOT NULL`. A atribuição de tal coluna um valor de `NULL` é permitida e define a coluna para o carimbo de tempo atual. *Exceção*: A tentativa de inserir `NULL` em uma coluna gerada declarada como `TIMESTAMP NOT NULL` é rejeitada com um erro.
- A primeira coluna `TIMESTAMP` em uma tabela, se não for declarada explicitamente com o atributo `NULL` ou um atributo `DEFAULT` ou `ON UPDATE` explícito, é declarada automaticamente com os atributos `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP`.
- As colunas `TIMESTAMP` que seguem a primeira, se não forem declaradas explicitamente com o atributo `NULL` ou um atributo `DEFAULT` explícito, são declaradas automaticamente como `DEFAULT '0000-00-00 00:00:00'` (o carimbo de tempo zero).

```
Depending on whether strict SQL mode or the `NO_ZERO_DATE` SQL mode is enabled, a default value of `'0000-00-00 00:00:00'` may be invalid. Be aware that the `TRADITIONAL` SQL mode includes strict mode and `NO_ZERO_DATE`. See Section 7.1.11, “Server SQL Modes”.
```

Os comportamentos não-padrão que acabamos de descrever são depreciados; espere que eles sejam removidos em uma futura versão do MySQL.

Se `explicit_defaults_for_timestamp` estiver habilitado, o servidor desativa os comportamentos não padrão e lida com as colunas `TIMESTAMP` da seguinte forma:

- Não é possível atribuir a uma coluna `TIMESTAMP` um valor de `NULL` para configurá-la no carimbo atual. Para atribuir o carimbo atual, configure a coluna em `CURRENT_TIMESTAMP` ou um sinônimo como `NOW()`.
- As colunas `TIMESTAMP` não declaradas explicitamente com o atributo `NOT NULL` são declaradas automaticamente com o atributo `NULL` e permitem valores `NULL`.
- As colunas de `TIMESTAMP` declaradas com o atributo `NOT NULL` não permitem valores de `NULL`. Para inserções que especificam `NULL` para tal coluna, o resultado é um erro para uma inserção de linha única se o modo SQL estrito estiver habilitado, ou `'0000-00-00 00:00:00'` é inserido para inserções de linhas múltiplas com o modo SQL estrito desativado. Em nenhum caso, atribuir a coluna um valor de `NULL` define-a para o carimbo de hora atual.
- As colunas explicitamente declaradas com o atributo `TIMESTAMP` e sem um atributo explicito `DEFAULT` são tratadas como não tendo valor padrão. Para linhas inseridas que não especificam nenhum valor explícito para tal coluna, o resultado depende do modo SQL. Se o modo SQL estrito estiver habilitado, ocorre um erro. Se o modo SQL estrito não estiver habilitado, a coluna é declarada com o padrão implícito de `'0000-00-00 00:00:00'` e ocorre um aviso. Isso é semelhante a como o MySQL trata outros tipos temporais, como `DATETIME`.
- Nenhuma coluna `TIMESTAMP` é declarada automaticamente com os atributos `DEFAULT CURRENT_TIMESTAMP` ou `ON UPDATE CURRENT_TIMESTAMP`.
- A primeira coluna `TIMESTAMP` de uma tabela não é tratada de forma diferente das colunas `TIMESTAMP` seguintes à primeira.

Se `explicit_defaults_for_timestamp` for desativado na inicialização do servidor, este aviso aparecerá no log de erros:

```
[Warning] TIMESTAMP with implicit DEFAULT value is deprecated.
Please use --explicit_defaults_for_timestamp server option (see
documentation for more details).
```

Como indicado pelo aviso, para desativar os comportamentos não padrão depreciados, habilite a variável de sistema `explicit_defaults_for_timestamp` na inicialização do servidor.

::: info Note

`explicit_defaults_for_timestamp` é em si depreciado porque seu único propósito é permitir o controle sobre depreciado `TIMESTAMP` comportamentos que devem ser removidos em uma futura versão do MySQL. Quando a remoção desses comportamentos ocorre, espere `explicit_defaults_for_timestamp` para ser removido também.

:::

Para informações adicionais, ver secção 13.2.5, "Initialização e atualização automáticas para TIMESTAMP e DATETIME".

- `external_user`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>external_user</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O nome de usuário externo usado durante o processo de autenticação, definido pelo plugin usado para autenticar o cliente. Com autenticação nativa (integrada) do MySQL, ou se o plugin não definir o valor, essa variável é `NULL`.

- `flush`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--flush[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>flush</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Aplica-se apenas ao MyISAM.

Se `ON`, o servidor limpa (sincroniza) todas as alterações no disco após cada instrução SQL. Normalmente, o MySQL faz uma gravação de todas as alterações no disco apenas após cada instrução SQL e deixa o sistema operacional lidar com a sincronização no disco. Veja Seção B.3.3.3, "O que fazer se o MySQL continuar falhando". Esta variável é definida como `ON` se você iniciar `mysqld` com a opção `--flush`.

::: info Note

Se `flush` estiver ativado, o valor de `flush_time` não importa e as mudanças em `flush_time` não têm efeito no comportamento de descarga.

:::

- `flush_time`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--flush-time=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>flush_time</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

Se este for definido para um valor diferente de zero, todas as tabelas são fechadas a cada `flush_time` segundos para liberar recursos e sincronizar dados não descarregados no disco. Esta opção é melhor usada apenas em sistemas com recursos mínimos.

::: info Note

Se `flush` estiver ativado, o valor de `flush_time` não importa e as mudanças em `flush_time` não têm efeito no comportamento de descarga.

:::

- `foreign_key_checks`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>foreign_key_checks</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Se definido em 1 (o padrão), as restrições de chave estrangeira são verificadas. Se definido em 0, as restrições de chave estrangeira são ignoradas, com algumas exceções. Ao recriar uma tabela que foi descartada, um erro é retornado se a definição da tabela não estiver em conformidade com as restrições de chave estrangeira referenciando a tabela. Da mesma forma, uma operação `ALTER TABLE` retorna um erro se uma definição de chave estrangeira for incorrectamente formada. Para mais informações, consulte a Seção 15.1.20.5, FOREIGN KEY Constraints.

A definição desta variável tem o mesmo efeito nas tabelas `NDB` que nas tabelas `InnoDB`. Normalmente, esta definição é deixada ativada durante a operação normal, para reforçar a integridade referencial. A desativação da verificação de chaves externas pode ser útil para recarregar tabelas `InnoDB` em uma ordem diferente da requerida pelas suas relações pai/filho.

A definição de `foreign_key_checks` para 0 também afeta as instruções de definição de dados: `DROP SCHEMA` abandona um esquema mesmo que ele contenha tabelas que tenham chaves estrangeiras que são referenciadas por tabelas fora do esquema, e `DROP TABLE` abandona tabelas que têm chaves estrangeiras que são referenciadas por outras tabelas.

::: info Note

A definição de `foreign_key_checks` para 1 não desencadeia uma varredura dos dados da tabela existente. Portanto, as linhas adicionadas à tabela enquanto `foreign_key_checks = 0` não são verificadas para consistência.

Não é permitido deixar cair um índice exigido por uma restrição de chave externa, mesmo com `foreign_key_checks=0`. A restrição de chave externa deve ser removida antes de deixar cair o índice.

:::

- `ft_boolean_syntax`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ft-boolean-syntax=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ft_boolean_syntax</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>+ -&gt;&lt;()~*:""&amp;|</code>]]</td> </tr></tbody></table>

A lista de operadores suportados por buscas de texto completo booleano realizadas usando `IN BOOLEAN MODE`.

O valor da variável padrão é `'+ -><()~*:""&|'`. As regras para mudar o valor são as seguintes:

- A função do operador é determinada pela posição dentro da cadeia.
- O valor de substituição deve ser de 14 caracteres.
- Cada carácter deve ser um carácter ASCII não alfanumérico.
- O primeiro ou o segundo caractere deve ser um espaço.
- Não são permitidos duplicados, excepto a frase que cita os operadores nas posições 11 e 12.
- As posições 10, 13 e 14 (que por padrão são definidas como `:`, `&`, e `|`) estão reservadas para futuras extensões.

* `ft_max_word_len`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ft-max-word-len=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ft_max_word_len</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>84</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>10</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>84</code>]]</td> </tr></tbody></table>

O comprimento máximo da palavra a ser incluída num índice `MyISAM` `FULLTEXT`.

::: info Note

Os índices de `FULLTEXT` nas tabelas de `MyISAM` devem ser reconstruídos depois de alterar esta variável. Use `REPAIR TABLE tbl_name QUICK`.

:::

- `ft_min_word_len`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ft-min-word-len=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ft_min_word_len</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>4</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>82</code>]]</td> </tr></tbody></table>

O comprimento mínimo da palavra a ser incluída num índice `MyISAM` `FULLTEXT`.

::: info Note

Os índices de `FULLTEXT` nas tabelas de `MyISAM` devem ser reconstruídos depois de alterar esta variável. Use `REPAIR TABLE tbl_name QUICK`.

:::

- `ft_query_expansion_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ft-query-expansion-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ft_query_expansion_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>20</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1000</code>]]</td> </tr></tbody></table>

O número de melhores correspondências a serem usadas para pesquisas em texto completo realizadas usando `WITH QUERY EXPANSION`.

- `ft_stopword_file`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ft-stopword-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ft_stopword_file</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O arquivo a partir do qual ler a lista de palavras-paradas para pesquisas de texto completo nas tabelas PH. O servidor procura o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja dado para especificar um diretório diferente. Todas as palavras do arquivo são usadas; comentários são \* não \* honrados. Por padrão, uma lista integrada de palavras-paradas é usada (como definido no arquivo PH. Definindo esta variável para a cadeia vazia (PH.CODE.2) desativa o filtro de palavras-paradas. Veja também a Seção 14.9.4,  Palavras-paradas em texto completo.

::: info Note

Os índices de `FULLTEXT` nas tabelas de `MyISAM` devem ser reconstruídos depois de alterar esta variável ou o conteúdo do arquivo de stopword. Use `REPAIR TABLE tbl_name QUICK`.

:::

- `general_log`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--general-log[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>general_log</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se o log de consulta geral está habilitado. O valor pode ser 0 (ou `OFF`) para desativar o log ou 1 (ou `ON`) para habilitar o log. O destino para a saída do log é controlado pela variável do sistema `log_output`; se esse valor for `NONE`, nenhuma entrada de log é escrita mesmo que o log esteja habilitado.

- `general_log_file`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--general-log-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>general_log_file</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>host_name.log</code>]]</td> </tr></tbody></table>

O nome do arquivo de registro de consulta geral. O valor padrão é `host_name.log`, mas o valor inicial pode ser alterado com a opção `--general_log_file`.

- `generated_random_password_length`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--generated-random-password-length=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>generated_random_password_length</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>20</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>5</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>255</code>]]</td> </tr></tbody></table>

O número máximo de caracteres permitidos em senhas aleatórias geradas para as instruções `CREATE USER`, `ALTER USER`, e `SET PASSWORD`.

- `global_connection_memory_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--global-connection-memory-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>global_connection_memory_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>16777216</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

Defina a quantidade total de memória que pode ser usada por todas as conexões de usuários; isto é, o `Global_connection_memory` não deve exceder essa quantidade.

A memória usada pelos usuários do sistema, como o usuário raiz do MySQL, está incluída neste total, mas não é contada no limite de desconexão; esses usuários nunca são desconectados devido ao uso de memória.

A memória usada pelo pool de tampão `InnoDB` é excluída do total.

Você deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir esta variável.

- `global_connection_memory_tracking`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--global-connection-memory-tracking={TRUE|FALSE}</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>global_connection_memory_tracking</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Determina se o servidor calcula `Global_connection_memory`. Esta variável deve ser ativada explicitamente; caso contrário, o cálculo de memória não é executado e `Global_connection_memory` não é definido.

Você deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir esta variável.

- `group_concat_max_len`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--group-concat-max-len=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>group_concat_max_len</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

O comprimento máximo de resultado permitido em bytes para a função `GROUP_CONCAT()`. O padrão é 1024.

- `have_compress`

`YES` se a biblioteca de compressão `zlib` estiver disponível para o servidor, `NO` se não. Se não, as funções `COMPRESS()` e `UNCOMPRESS()` não podem ser usadas.

- `have_dynamic_loading`

`YES` se `mysqld` suportar o carregamento dinâmico de plugins, `NO` se não. Se o valor for `NO`, você não pode usar opções como `--plugin-load` para carregar plugins na inicialização do servidor, ou a instrução `INSTALL PLUGIN` para carregar plugins no tempo de execução.

- `have_geometry`

`YES` se o servidor suportar tipos de dados espaciais, `NO` caso contrário.

- `have_profiling`

`YES` se a capacidade de criação de perfis estiver presente, `NO` se não estiver. Se estiver presente, a variável do sistema `profiling` controla se essa capacidade está ativada ou desativada. Veja Seção 15.7.7.33, SHOW PROFILES Statement.

Esta variável está desatualizada; você deve esperar que ela seja removida em uma futura versão do MySQL.

- `have_query_cache`

  `have_query_cache` está desatualizado, sempre tem um valor de `NO`, e você deve esperar que ele seja removido em uma futura versão do MySQL.
- `have_rtree_keys`

`YES` se os índices `RTREE` estiverem disponíveis, `NO` se não estiverem. (Estes são usados para índices espaciais nas tabelas `MyISAM`.)

- `have_statement_timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>have_statement_timeout</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr></tbody></table>

Se o recurso de tempo de execução da instrução está disponível (ver Sugestões do Otimizador de Tempo de Execução da instrução). O valor pode ser `NO` se o thread de fundo usado por este recurso não puder ser inicializado.

- `have_symlink`

Se o servidor é iniciado com a opção `--skip-symbolic-links`, o valor é `DISABLED`.

Esta variável não tem significado no Windows.

::: info Note

O suporte ao link simbólico, juntamente com a opção `--symbolic-links` que o controla, está desatualizado; espere que estes sejam removidos em uma versão futura do MySQL. Além disso, a opção está desativada por padrão. A variável de sistema `have_symlink` relacionada também está desatualizada e você deve esperar que seja removida em uma versão futura do MySQL.

:::

- `histogram_generation_max_mem_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--histogram-generation-max-mem-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>histogram_generation_max_mem_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>20000000</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1000000</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

A quantidade máxima de memória disponível para a geração de estatísticas de histograma. Ver secção 10.9.6, "Estatísticas do optimizador" e secção 15.7.3.1, "Informação da tabela de análise".

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

- `host_cache_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--host-cache-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>host_cache_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>-1</code>]] (significa auto-dimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65536</code>]]</td> </tr></tbody></table>

O servidor MySQL mantém um cache de host em memória que contém informações sobre o nome do host do cliente e o endereço IP e é usado para evitar pesquisas do Sistema de Nomes de Domínio (DNS); veja Seção 7.1.12.3, "Pesquisas de DNS e o Cache de Host".

A variável `host_cache_size` controla o tamanho do cache do host, bem como o tamanho da tabela do Esquema de Desempenho `host_cache` que expõe o conteúdo do cache.

- A configuração do tamanho em 0 desativa o cache do host. Com o cache desativado, o servidor executa uma pesquisa de DNS toda vez que um cliente se conecta.
- Mudar o tamanho no tempo de execução provoca uma operação de limpeza do cache do host implícita que limpa o cache do host, trunca a tabela `host_cache` e desbloqueia todos os hosts bloqueados.

O valor padrão é auto dimensionado para 128, mais 1 para um valor de \[`max_connections`] até 500, mais 1 para cada incremento de 20 sobre 500 no valor \[`max_connections`], limitado a um limite de 2000.

- `hostname`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>hostname</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O servidor define esta variável para o nome do host do servidor no início. O comprimento máximo é de 255 caracteres.

- `identity`

Esta variável é um sinônimo da variável `last_insert_id`. Ela existe para compatibilidade com outros sistemas de banco de dados. Você pode ler seu valor com `SELECT @@identity`, e configurá-lo usando `SET identity`.

- `init_connect`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--init-connect=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>init_connect</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Uma string a ser executada pelo servidor para cada cliente que se conecta. A string consiste em uma ou mais instruções SQL, separadas por caracteres de ponto e vírgula.

Para usuários que têm o privilégio `CONNECTION_ADMIN` (ou o privilégio `SUPER` obsoleto), o conteúdo do `init_connect` não é executado. Isso é feito para que um valor errôneo para `init_connect` não impeça todos os clientes de se conectar. Por exemplo, o valor pode conter uma instrução que tem um erro de sintaxe, causando falhas nas conexões do cliente. Não executar `init_connect` para usuários que têm o privilégio `CONNECTION_ADMIN` ou `SUPER` permite que eles abram uma conexão e corrigam o valor `init_connect`.

A execução do `init_connect` é ignorada para qualquer usuário cliente com uma senha expirada. Isso é feito porque tal usuário não pode executar instruções arbitrárias e, portanto, a execução do `init_connect` falha, deixando o cliente incapaz de se conectar.

O servidor descarta qualquer conjunto de resultados produzido por instruções no valor de `init_connect`.

- `information_schema_stats_expiry`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--information-schema-stats-expiry=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>information_schema_stats_expiry</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>86400</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

Algumas tabelas de `INFORMATION_SCHEMA` contêm colunas que fornecem estatísticas de tabelas:

```
STATISTICS.CARDINALITY
TABLES.AUTO_INCREMENT
TABLES.AVG_ROW_LENGTH
TABLES.CHECKSUM
TABLES.CHECK_TIME
TABLES.CREATE_TIME
TABLES.DATA_FREE
TABLES.DATA_LENGTH
TABLES.INDEX_LENGTH
TABLES.MAX_DATA_LENGTH
TABLES.TABLE_ROWS
TABLES.UPDATE_TIME
```

Essas colunas representam metadados dinâmicos da tabela, ou seja, informações que mudam à medida que o conteúdo da tabela muda.

Por padrão, o MySQL recupera os valores em cache para essas colunas das tabelas do dicionário `mysql.index_stats` e `mysql.table_stats` quando as colunas são consultadas, o que é mais eficiente do que recuperar estatísticas diretamente do mecanismo de armazenamento. Se as estatísticas em cache não estiverem disponíveis ou tiverem expirado, o MySQL recupera as estatísticas mais recentes do mecanismo de armazenamento e as armazenará em cache nas tabelas do dicionário `mysql.index_stats` e `mysql.table_stats`. As consultas subsequentes recuperam as estatísticas em cache até que as estatísticas em cache expirem. Um reinicio do servidor ou a primeira abertura das tabelas `mysql.index_stats` e `mysql.table_stats` não atualizam automaticamente as estatísticas em cache.

A variável `information_schema_stats_expiry` de sessão define o período de tempo antes que as estatísticas em cache expirem. O padrão é 86400 segundos (24 horas), mas o período de tempo pode ser estendido para até um ano.

Para atualizar valores em cache a qualquer momento para uma tabela dada, use `ANALYZE TABLE`.

Para sempre recuperar as estatísticas mais recentes diretamente do mecanismo de armazenamento e ignorar os valores em cache, defina `information_schema_stats_expiry` para `0`.

A consulta de colunas de estatísticas não armazena ou atualiza estatísticas nas tabelas do dicionário `mysql.index_stats` e `mysql.table_stats` nas seguintes circunstâncias:

- Quando as estatísticas armazenadas em cache não expirarem.
- Quando `information_schema_stats_expiry` é definido como 0.
- Quando o servidor está no modo `read_only`, `super_read_only`, `transaction_read_only`, ou `innodb_read_only`.
- Quando a consulta também obtém dados do Performance Schema.

O cache de estatísticas pode ser atualizado durante uma transação de declarações múltiplas antes de saber se a transação é comprometida. Como resultado, o cache pode conter informações que não correspondem a um estado comprometido conhecido. Isso pode ocorrer com o `autocommit=0` ou depois do `START TRANSACTION`.

`information_schema_stats_expiry` é uma variável de sessão, e cada sessão do cliente pode definir seu próprio valor de expiração. Estatísticas que são recuperadas do mecanismo de armazenamento e armazenadas em cache por uma sessão estão disponíveis para outras sessões.

Para obter informações relacionadas, ver a secção 10.2.3, "Otimização das consultas INFORMATION\_SCHEMA".

- `init_file`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--init-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>init_file</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Se especificada, esta variável nomeia um arquivo contendo instruções SQL a serem lidas e executadas durante o processo de inicialização. O formato aceitável para instruções neste arquivo suporta as seguintes construções:

- `delimiter ;`, para definir o delimitador de instruções para o caractere `;`.
- `delimiter $$`, para definir o delimitador de instrução para a sequência de caracteres `$$`.
- Múltiplas declarações na mesma linha, delimitadas pelo delimitador actual.
- Declarações de linhas múltiplas.
- Comentários de um carácter `#` até ao fim da linha.
- Comentários de uma sequência `--` até ao final da linha.
- Comentários de estilo C de uma sequência de `/*` para a seguinte sequência de `*/`, incluindo várias linhas.
- Literais de cadeia de linhas múltiplas fechadas dentro de citações simples (`'`) ou citações duplas (`"`) caracteres.

Se o servidor é iniciado com a opção `--initialize` ou `--initialize-insecure`, ele opera no modo de inicialização e algumas funcionalidades não estão disponíveis que limitam as instruções permitidas no arquivo. Estas incluem instruções relacionadas ao gerenciamento de contas (como `CREATE USER` ou `GRANT`), replicação e identificadores globais de transações. Veja Seção 19.1.3,  Replicação com identificadores globais de transações.

Os threads criados durante a inicialização do servidor são usados para tarefas como criar o dicionário de dados, executar procedimentos de atualização e criar tabelas de sistema. Para garantir um ambiente estável e previsível, esses threads são executados com os padrões embutidos no servidor para algumas variáveis do sistema, como `sql_mode`, `character_set_server`, `collation_server`, `completion_type`, `explicit_defaults_for_timestamp`, e `default_table_encryption`.

Esses threads também são usados para executar as instruções em qualquer arquivo especificado com `init_file` ao iniciar o servidor, então essas instruções executam com os valores padrão embutidos do servidor para essas variáveis do sistema.

- `innodb_xxx`

  As variáveis do sistema `InnoDB` estão listadas na Seção 17.14, "Opções de inicialização do InnoDB e variáveis do sistema". Essas variáveis controlam muitos aspectos de armazenamento, uso de memória e padrões de E/S para as tabelas `InnoDB`, e são especialmente importantes agora que `InnoDB` é o motor de armazenamento padrão.
- `insert_id`

O valor a ser usado pela seguinte instrução `INSERT` ou `ALTER TABLE` ao inserir um valor `AUTO_INCREMENT`.

- `interactive_timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--interactive-timeout=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>interactive_timeout</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>28800</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

O número de segundos que o servidor espera por atividade em uma conexão interativa antes de fechá-la. Um cliente interativo é definido como um cliente que usa a opção `CLIENT_INTERACTIVE` para `mysql_real_connect()`.

- `internal_tmp_mem_storage_engine`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--internal-tmp-mem-storage-engine=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>internal_tmp_mem_storage_engine</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>TempTable</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>MEMORY</code>]]</p><p class="valid-value">[[<code>TempTable</code>]]</p></td> </tr></tbody></table>

O motor de armazenamento para tabelas temporárias internas em memória (ver Seção 10.4.4, "Utilização de tabelas temporárias internas no MySQL"). Os valores permitidos são `TempTable` (o padrão) e `MEMORY`.

O optimizador usa o mecanismo de armazenamento definido por `internal_tmp_mem_storage_engine` para tabelas temporárias internas na memória.

Configurar uma configuração de sessão para `internal_tmp_mem_storage_engine` requer o privilégio `SESSION_VARIABLES_ADMIN` ou `SYSTEM_VARIABLES_ADMIN`.

- `join_buffer_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--join-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>join_buffer_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>262144</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>128</code>]]</td> </tr><tr><th>Valor máximo (Windows)</th> <td>[[<code>4294967168</code>]]</td> </tr><tr><th>Valor máximo (outras plataformas de 64 bits)</th> <td>[[<code>18446744073709551488</code>]]</td> </tr><tr><th>Valor máximo (outras plataformas de 32 bits)</th> <td>[[<code>4294967168</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>128</code>]]</td> </tr></tbody></table>

O tamanho mínimo do buffer que é usado para varreduras de índice simples, varreduras de índice de intervalo e junções que não usam índices e, portanto, executam varreduras de tabela completas. Esta variável também controla a quantidade de memória usada para junções de hash. Normalmente, a melhor maneira de obter junções rápidas é adicionar índices. Aumentar o valor de `join_buffer_size` para obter uma junção completa mais rápida ao adicionar índices não é possível. Um buffer de junção é alocado para cada junção completa entre duas tabelas. Para uma junção complexa entre várias tabelas para as quais os índices não são usados, vários buffers de junção podem ser necessários.

O padrão é de 256KB. A configuração máxima permitida para `join_buffer_size` é de 4GB−1. Valores maiores são permitidos para plataformas de 64 bits (exceto Windows de 64 bits, para as quais os valores grandes são truncados para 4GB−1 com um aviso). O tamanho do bloco é de 128, e um valor que não é um múltiplo exato do tamanho do bloco é arredondado para o próximo múltiplo inferior do tamanho do bloco pelo MySQL Server antes de armazenar o valor para a variável do sistema. O analisador permite valores até o valor inteiro não assinado máximo para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits), mas o tamanho máximo real é um bloco menor.

A menos que um algoritmo de acesso de chave em bloco seja usado, não há ganho ao definir o buffer maior do que o necessário para manter cada linha correspondente, e todas as junções alocam pelo menos o tamanho mínimo, portanto, tenha cuidado ao definir essa variável para um valor grande globalmente. É melhor manter a configuração global pequena e alterar a configuração da sessão para um valor maior apenas em sessões que estão fazendo grandes junções, ou alterar a configuração por consulta usando uma sugestão de otimizador `SET_VAR` (veja Seção 10.9.3, Optimizer Hints). O tempo de alocação de memória pode causar quedas substanciais de desempenho se o tamanho global for maior do que o necessário pela maioria das consultas que o usam.

Quando o Block Nested-Loop é usado, um buffer de junção maior pode ser benéfico até o ponto em que todas as colunas necessárias de todas as linhas da primeira tabela são armazenadas no buffer de junção.

Quando o Batched Key Access é usado, o valor de `join_buffer_size` define o tamanho do lote de chaves em cada solicitação ao mecanismo de armazenamento. Quanto maior o buffer, mais acesso sequencial é feito à tabela da mão direita de uma operação de junção, o que pode melhorar significativamente o desempenho.

Para informações adicionais sobre buffer de junção, consulte a Seção 10.2.1.7, "Algoritmos de junção de loop aninhado". Para informações sobre acesso de chave em lote, consulte a Seção 10.2.1.12, "Bloquear junções de acesso de chave aninhado e em lote". Para informações sobre junções de hash, consulte a Seção 10.2.1.4, "Otimização de junção de hash".

- `keep_files_on_create`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--keep-files-on-create[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keep_files_on_create</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se uma `MyISAM` tabela é criada sem a `DATA DIRECTORY` opção, o `.MYD` arquivo é criado no diretório do banco de dados. Por padrão, se o `MyISAM` encontra um arquivo existente `.MYD` neste caso, ele sobrescreve-o. O mesmo se aplica aos `.MYI` arquivos para tabelas criadas sem a `INDEX DIRECTORY` opção. Para suprimir este comportamento, defina a variável `keep_files_on_create` para \[\[`ON` (1),]] no qual caso `MyISAM` não sobrescreve arquivos existentes e retorna um erro em vez disso. O valor padrão é \[\[`OFF` (0).

Se uma `MyISAM` tabela é criada com uma `DATA DIRECTORY` ou `INDEX DIRECTORY` opção e um existente `.MYD` ou `.MYI` arquivo é encontrado, MyISAM sempre retorna um erro. Ele não sobrescreve um arquivo no diretório especificado.

- `key_buffer_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--key-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>key_buffer_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>8388608</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>OS_PER_PROCESS_LIMIT</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

Os blocos de índice para tabelas `MyISAM` são armazenados em buffer e são compartilhados por todos os tópicos. `key_buffer_size` é o tamanho do buffer usado para blocos de índice. O buffer de chave também é conhecido como cache de chave.

A configuração mínima permitida é 0, mas você não pode definir `key_buffer_size` para 0 dinamicamente. Uma configuração de 0 deixa cair o cache da chave, o que não é permitido no tempo de execução. A configuração de `key_buffer_size` para 0 é permitida apenas na inicialização, caso em que o cache da chave não é inicializado. Mudar a configuração `key_buffer_size` no tempo de execução de um valor de 0 para um valor não-zero permitido inicializa o cache da chave.

`key_buffer_size` pode ser aumentado ou diminuído apenas em incrementos ou múltiplos de 4096 bytes. Aumentar ou diminuir a configuração por um valor não conforme produz um aviso e truncar a configuração para um valor conforme.

A configuração máxima permitida para `key_buffer_size` é 4GB-1 em plataformas de 32 bits. Valores maiores são permitidos para plataformas de 64 bits. O tamanho máximo efetivo pode ser menor, dependendo da RAM física disponível e dos limites de RAM por processo impostos pelo seu sistema operacional ou plataforma de hardware. O valor desta variável indica a quantidade de memória solicitada. Internamente, o servidor aloca a maior quantidade de memória possível até essa quantidade, mas a alocação real pode ser menor.

Você pode aumentar o valor para obter um melhor controle de índice para todas as leituras e múltiplas gravações; em um sistema cuja função principal é executar o MySQL usando o motor de armazenamento `MyISAM`, 25% da memória total da máquina é um valor aceitável para esta variável. No entanto, você deve estar ciente de que, se você fizer o valor muito grande (por exemplo, mais de 50% da memória total da máquina), seu sistema pode começar a paginá-lo e tornar-se extremamente lento. Isso ocorre porque o MySQL depende do sistema operacional para executar o cache do sistema de arquivos para leituras de dados, então você deve deixar algum espaço para o cache do sistema de arquivos. Você também deve considerar os requisitos de memória de quaisquer outros motores de armazenamento que você possa estar usando além do \[\[PH\_CODE\_DE1]].

Para ainda mais velocidade ao escrever muitas linhas ao mesmo tempo, use `LOCK TABLES`.

Você pode verificar o desempenho do buffer de chave emitindo uma instrução `SHOW STATUS` e examinando as variáveis de status `Key_read_requests`, `Key_reads`, `Key_write_requests`, e `Key_writes`. (Veja Seção 15.7.7, SHOW Statements.) A relação `Key_reads/Key_read_requests` normalmente deve ser menor que 0.01. A relação `Key_writes/Key_write_requests` geralmente é próxima de 1 se você estiver usando principalmente atualizações e exclusões, mas pode ser muito menor se você tender a fazer atualizações que afetam muitas linhas ao mesmo tempo ou se estiver usando a opção de tabela `DELAY_KEY_WRITE`.

A fração do buffer de chave em uso pode ser determinada usando `key_buffer_size` em conjunto com a variável de status `Key_blocks_unused` e o tamanho do bloco de buffer, que está disponível na variável de sistema `key_cache_block_size`:

```
1 - ((Key_blocks_unused * key_cache_block_size) / key_buffer_size)
```

Este valor é uma aproximação porque algum espaço no buffer de chaves é alocado internamente para estruturas administrativas. Fatores que influenciam a quantidade de overhead para essas estruturas incluem o tamanho do bloco e o tamanho do ponteiro. À medida que o tamanho do bloco aumenta, a porcentagem do buffer de chaves perdido tende a diminuir. Blocos maiores resultam em um menor número de operações de leitura (porque mais chaves são obtidas por leitura), mas, inversamente, um aumento nas leituras de chaves que não são examinadas (se nem todas as chaves em um bloco são relevantes para uma consulta).

É possível criar vários cache de chaves PH. O limite de tamanho de 4GB se aplica a cada cache individualmente, não como um grupo. Veja Seção 10.10.2, The MyISAM Key Cache.

- `key_cache_age_threshold`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--key-cache-age-threshold=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>key_cache_age_threshold</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>300</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>100</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551516</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967196</code>]]</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>100</code>]]</td> </tr></tbody></table>

Este valor controla a degradação de buffers da sublista quente de um cache de chaves para a sublista quente. Valores mais baixos fazem com que a degradação aconteça mais rapidamente. O valor mínimo é 100. O valor padrão é 300. Veja Seção 10.10.2, The MyISAM Key Cache.

- `key_cache_block_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--key-cache-block-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>key_cache_block_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>512</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>16384</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>512</code>]]</td> </tr></tbody></table>

O tamanho em bytes dos blocos no cache de chave. O valor padrão é 1024. Ver Seção 10.10.2, "O cache de chave MyISAM".

- `key_cache_division_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--key-cache-division-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>key_cache_division_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>100</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>100</code>]]</td> </tr></tbody></table>

O ponto de divisão entre as sublistas quentes e quentes da lista de cache de chaves. O valor é a porcentagem da lista de buffer a ser usada para a sublista quente. Os valores permitidos variam de 1 a 100. O valor padrão é 100.

- `large_files_support`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>large_files_support</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr></tbody></table>

Se o `mysqld` foi compilado com opções para suporte a arquivos grandes.

- `large_pages`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--large-pages[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>large_pages</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Específicos da plataforma</th> <td>Linux (em inglês)</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se o suporte de páginas grandes está habilitado (através da opção `--large-pages`). Ver Seção 10.12.3.3, Ativação de suporte de páginas grandes.

- `large_page_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>large_page_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

Se o suporte de páginas grandes estiver habilitado, isso mostra o tamanho das páginas de memória. Páginas de memória grandes são suportadas apenas no Linux; em outras plataformas, o valor desta variável é sempre 0.

- `last_insert_id`

O valor a ser retornado de `LAST_INSERT_ID()`. Ele é armazenado no log binário quando você usa `LAST_INSERT_ID()` em uma instrução que atualiza uma tabela. A definição desta variável não atualiza o valor retornado pela função `mysql_insert_id()` da API C.

- `lc_messages`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lc-messages=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lc_messages</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>en_US</code>]]</td> </tr></tbody></table>

O local a ser usado para mensagens de erro. O padrão é `en_US`. O servidor converte o argumento em um nome de idioma e combina-o com o valor de `lc_messages_dir` para produzir a localização para o arquivo de mensagem de erro. Veja Seção 12.12,  Configuração da linguagem da mensagem de erro.

- `lc_messages_dir`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lc-messages-dir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lc_messages_dir</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório onde as mensagens de erro estão localizadas. O servidor usa o valor juntamente com o valor de `lc_messages` para produzir a localização para o arquivo da mensagem de erro. Veja Seção 12.12,  Configuração da linguagem da mensagem de erro.

- `lc_time_names`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lc-time-names=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lc_time_names</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Esta variável especifica a localização que controla a linguagem usada para exibir nomes e abreviaturas de dias e meses. Esta variável afeta a saída das funções `DATE_FORMAT()`, `DAYNAME()` e `MONTHNAME()`. Nomes de localização são valores de estilo POSIX, como `'ja_JP'` ou `'pt_BR'`. O valor padrão é `'en_US'` independentemente da configuração de localização do seu sistema. Para mais informações, consulte a Seção 12.16, Suporte de localização do servidor MySQL.

- `license`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>license</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>GPL</code>]]</td> </tr></tbody></table>

O tipo de licença que o servidor tem.

- `local_infile`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--local-infile[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>local_infile</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta variável controla a capacidade de `LOCAL` do lado do servidor para as instruções `LOAD DATA`. Dependendo da configuração `local_infile`, o servidor recusa ou permite o carregamento de dados locais por clientes que tenham `LOCAL` habilitado no lado do cliente.

Para explicitamente fazer com que o servidor recuse ou permita as instruções `LOAD DATA LOCAL` (independentemente de como os programas e bibliotecas do cliente estão configurados no tempo de compilação ou no tempo de execução), inicie `mysqld` com `local_infile` desativado ou habilitado, respectivamente. `local_infile` também pode ser definido no tempo de execução. Para mais informações, consulte a Seção 8.1.6, "Considerações de segurança para LOAD DATA LOCAL".

- `lock_wait_timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lock-wait-timeout=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lock_wait_timeout</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

Esta variável especifica o tempo limite em segundos para tentativas de aquisição de bloqueios de metadados. Os valores permitidos variam de 1 a 31536000 (1 ano). O padrão é 31536000.

Este timeout se aplica a todas as instruções que usam bloqueios de metadados. Estes incluem operações DML e DDL em tabelas, vistas, procedimentos armazenados e funções armazenadas, bem como instruções `LOCK TABLES`, `FLUSH TABLES WITH READ LOCK`, e `HANDLER`.

Este tempo limite não se aplica a acessos implícitos a tabelas do sistema no banco de dados `mysql`, como tabelas de concessão modificadas por instruções `GRANT` ou `REVOKE` ou instruções de registro de tabelas. O tempo limite se aplica a tabelas do sistema acessadas diretamente, como com `SELECT` ou `UPDATE`.

O valor de timeout é aplicado separadamente para cada tentativa de bloqueio de metadados. Uma determinada instrução pode exigir mais de um bloqueio, por isso é possível que a instrução bloqueie por mais tempo do que o valor `lock_wait_timeout` antes de relatar um erro de timeout. Quando ocorre um timeout de bloqueio, é relatado `ER_LOCK_WAIT_TIMEOUT`.

`lock_wait_timeout` também define a quantidade de tempo que uma instrução `LOCK INSTANCE FOR BACKUP` espera por um bloqueio antes de desistir.

- `locked_in_memory`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>locked_in_memory</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se `mysqld` foi bloqueado na memória com `--memlock`.

- `log_error`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-error[=file_nam<code>log_error</code></code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_error</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O destino padrão do log de erros. Se o destino for o console, o valor é `stderr`. Caso contrário, o destino é um arquivo e o valor `log_error` é o nome do arquivo. Veja Seção 7.4.2, The Error Log.

- `log_error_services`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-error-services=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_error_services</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>log_filter_internal; log_sink_internal</code>]]</td> </tr></tbody></table>

Os componentes para permitir o registro de erros. A variável pode conter uma lista com 0, 1, ou muitos elementos. No último caso, os elementos podem ser delimitados por pontos e vírgulas, opcionalmente seguidos por espaço. Uma determinada configuração não pode usar separadores de pontos e vírgulas. A ordem dos componentes é significativa porque o servidor executa os componentes na ordem listada.

Qualquer componente carregável (não incorporado) nomeado em `log_error_services` é carregado implicitamente se não estiver já carregado. Para mais informações, consulte a Seção 7.4.2.1, Configuração do Registro de Erros.

- `log_error_suppression_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-error-suppression-list=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_error_suppression_list</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

A variável do sistema `log_error_suppression_list` aplica-se a eventos destinados ao log de erros e especifica quais eventos devem ser suprimidos quando ocorrem com uma prioridade de `WARNING` ou `INFORMATION`. Por exemplo, se um determinado tipo de aviso é considerado indesejável ruído no log de erros porque ocorre com frequência, mas não é de interesse, ele pode ser suprimido. Esta variável afeta a filtragem realizada pelo componente de filtro de log de erros `log_filter_internal`, que é ativado por padrão (ver Seção 7.5.3, Componentes de Log de Erros). Se `log_filter_internal` estiver desativado, `log_error_suppression_list` não tem efeito.

O valor `log_error_suppression_list` pode ser a cadeia vazia para nenhuma supressão, ou uma lista de um ou mais valores separados por vírgula indicando os códigos de erro a serem suprimidos. Os códigos de erro podem ser especificados em forma simbólica ou numérica. Um código numérico pode ser especificado com ou sem o prefixo `MY-` . Os zeros iniciais na parte numérica não são significativos.

```
ER_SERVER_SHUTDOWN_COMPLETE
MY-000031
000031
MY-31
31
```

Os valores simbólicos são preferíveis aos valores numéricos para leitura e portabilidade.

O efeito de `log_error_suppression_list` combina com o de `log_error_verbosity`. Para informações adicionais, consulte a Seção 7.4.2.5, "Filtragem de registro de erros baseada em prioridade (log\_filter\_internal) ").

- `log_error_verbosity`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-error-verbosity=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_error_verbosity</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>2</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>3</code>]]</td> </tr></tbody></table>

A variável de sistema `log_error_verbosity` especifica a verbosidade para o manuseio de eventos destinados ao log de erros. Esta variável afeta a filtragem realizada pelo componente de filtro de log de erros `log_filter_internal`, que é ativado por padrão (ver Seção 7.5.3, Componentes de Log de Erros). Se `log_filter_internal` está desativado, `log_error_verbosity` não tem efeito.

Os eventos destinados ao log de erros têm uma prioridade de `ERROR`, `WARNING`, ou `INFORMATION`. `log_error_verbosity` controla a verbosidade com base em quais prioridades permitir mensagens escritas no log, como mostrado na tabela a seguir.

  <table><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Valor do log_error_verbosity</th> <th>Prioridades de mensagens permitidas</th> </tr></thead><tbody><tr> <td>1 .</td> <td>[[<code>ERROR</code>]]</td> </tr><tr> <td>2 .</td> <td>[[<code>ERROR</code>]], [[<code>WARNING</code>]]</td> </tr><tr> <td>3 .</td> <td>[[<code>ERROR</code>]], [[<code>WARNING</code>]], [[<code>INFORMATION</code>]]</td> </tr></tbody></table>

Há também uma prioridade de `SYSTEM`. mensagens do sistema sobre situações não-error são impressas no log de erro, independentemente do valor `log_error_verbosity`.

O efeito de `log_error_verbosity` combina com o de `log_error_suppression_list`. Para informações adicionais, consulte a Seção 7.4.2.5, "Filtragem de registro de erros baseada em prioridade (log\_filter\_internal) ").

- `log_output`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-output=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_output</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Conjunto</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FILE</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>TABLE</code>]]</p><p class="valid-value">[[<code>FILE</code>]]</p><p class="valid-value">[[<code>NONE</code>]]</p></td> </tr></tbody></table>

O destino ou destinos para o log de consulta geral e saída lenta do log de consulta. O valor é uma lista de uma ou mais palavras separadas por vírgulas escolhidas de `TABLE`, `FILE`, e `NONE`. `TABLE` seleciona o registro para as tabelas `general_log` e `slow_log` no esquema do sistema `mysql` . `FILE` seleciona o registro para arquivos de registro. `NONE` desativa o registro. Se `NONE` estiver presente no valor, ele tem precedência sobre qualquer outra palavra que esteja presente. `TABLE` e `FILE` podem ser dados para selecionar ambos os destinos de saída do log.

Esta variável seleciona os destinos de saída de log, mas não permite a saída de log. Para fazer isso, habilite as variáveis de sistema `general_log` e `slow_query_log`. Para o registro `FILE`, as variáveis de sistema `general_log_file` e `slow_query_log_file` determinam as localizações dos arquivos de log. Para mais informações, consulte a Seção 7.4.1, Seleção de Destinos de Saída de Log de Consulta Geral e Consulta Lenta.

- `log_queries_not_using_indexes`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-queries-not-using-indexes[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_queries_not_using_indexes</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se você habilitar esta variável com o registro de consulta lenta habilitado, as consultas que são esperadas para recuperar todas as linhas são registradas. Veja Seção 7.4.5, "O Registro de consulta lenta". Esta opção não significa necessariamente que nenhum índice é usado. Por exemplo, uma consulta que usa uma varredura de índice completo usa um índice, mas seria registrada porque o índice não limitaria o número de linhas.

- `log_raw`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-raw[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_raw</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

A variável de sistema `log_raw` é inicialmente definida como o valor da opção `--log-raw`. Veja a descrição dessa opção para obter mais informações. A variável de sistema também pode ser definida no tempo de execução para alterar o comportamento de mascaramento de senha.

- `log_slow_admin_statements`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-slow-admin-statements[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_slow_admin_statements</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Incluir instruções administrativas lentas nas instruções escritas para o registro de consulta lenta. As instruções administrativas incluem `ALTER TABLE`, `ANALYZE TABLE`, `CHECK TABLE`, `CREATE INDEX`, `DROP INDEX`, `OPTIMIZE TABLE`, e `REPAIR TABLE`.

- `log_slow_extra`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-slow-extra[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_slow_extra</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se o registro de consulta lenta estiver habilitado e o destino de saída incluir `FILE`, o servidor escreve campos adicionais para linhas de arquivo de registro que fornecem informações sobre instruções lentas.

- `log_timestamps`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-timestamps=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_timestamps</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>UTC</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>UTC</code>]]</p><p class="valid-value">[[<code>SYSTEM</code>]]</p></td> </tr></tbody></table>

Esta variável controla o fuso horário dos carimbos de tempo nas mensagens escritas para o registro de erros e, em geral, no registro de consultas e mensagens de registro de consultas lentas escritas para arquivos. Ela não afeta o fuso horário do registro de consultas gerais e mensagens de registro de consultas lentas escritas para tabelas (`mysql.general_log` , `mysql.slow_log`). As linhas recuperadas dessas tabelas podem ser convertidas do fuso horário do sistema local para qualquer fuso horário desejado com `CONVERT_TZ()` ou definindo a variável de sessão do sistema `time_zone`.

Os valores permitidos de `log_timestamps` são `UTC` (o padrão) e `SYSTEM` (o fuso horário do sistema local).

Os carimbos de tempo são escritos usando o formato ISO 8601 / RFC 3339: `YYYY-MM-DDThh:mm:ss.uuuuuu` mais um valor de cauda de `Z` significando o tempo Zulu (UTC) ou `±hh:mm` (um deslocamento do UTC).

- `log_throttle_queries_not_using_indexes`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log-throttle-queries-not-using-indexes=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>log_throttle_queries_not_using_indexes</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

Se `log_queries_not_using_indexes` estiver habilitado, a variável `log_throttle_queries_not_using_indexes` limita o número de consultas por minuto que podem ser escritas no registro de consultas lentas. Um valor de 0 (o padrão) significa não há limite. Para mais informações, consulte a Seção 7.4.5, The Slow Query Log.

- `long_query_time`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--long-query-time=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>long_query_time</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>10</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

Se uma consulta demorar mais do que este número de segundos, o servidor aumenta a variável de status `Slow_queries`. Se o registro de consulta lenta estiver habilitado, a consulta é registrada no arquivo de registro de consulta lenta. Este valor é medido em tempo real, não no tempo da CPU, de modo que uma consulta que esteja abaixo do limite em um sistema com carga leve pode estar acima do limite em um sistema com carga pesada. Os valores mínimos e padrão de `long_query_time` são 0 e 10, respectivamente. O máximo é 31536000, que é 365 dias em segundos. O valor pode ser especificado para uma resolução de microssegundos.

Valores menores desta variável resultam em mais instruções sendo consideradas longas, com o resultado de que mais espaço é necessário para o registro de consulta lento. Para valores muito pequenos (menos de um segundo), o registro pode crescer bastante em pouco tempo. Aumentar o número de instruções consideradas longas também pode resultar em falsos positivos para o alerta "Número excessivo de processos longos" no MySQL Enterprise Monitor, especialmente se a replicação de grupo estiver habilitada. Por essas razões, valores muito pequenos devem ser usados apenas em ambientes de teste ou, em ambientes de produção, apenas por um curto período.

`mysqldump` executa uma varredura de tabela completa, o que significa que suas consultas podem frequentemente exceder uma configuração `long_query_time` que é útil para consultas regulares. Se você quiser excluir a maioria ou todas as consultas geradas por `mysqldump` do registro de consultas lentas, você pode usar `--mysqld-long-query-time` para alterar o valor de sessão da variável do sistema para um valor mais alto.

- `low_priority_updates`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--low-priority-updates[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>low_priority_updates</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se definido como `1`, todas as instruções `INSERT`, `UPDATE`, `DELETE`, e `LOCK TABLE WRITE` esperam até que não haja pendentes `SELECT` ou `LOCK TABLE READ` na tabela afetada. O mesmo efeito pode ser obtido usando `{INSERT | REPLACE | DELETE | UPDATE} LOW_PRIORITY ...` para baixar a prioridade de apenas uma consulta. Esta variável afeta apenas os motores de armazenamento que usam apenas bloqueio em nível de tabela (como `MyISAM`, `MEMORY`, e `MERGE`).

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

- `lower_case_file_system`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>lower_case_file_system</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr></tbody></table>

Esta variável descreve a sensibilidade a maiúsculas e minúsculas de nomes de arquivos no sistema de arquivos onde o diretório de dados está localizado. `OFF` significa que os nomes de arquivos são sensíveis a maiúsculas e minúsculas, `ON` significa que eles não são sensíveis a maiúsculas e minúsculas. Esta variável é lida apenas porque reflete um atributo do sistema de arquivos e configurá-lo não teria nenhum efeito no sistema de arquivos.

- `lower_case_table_names`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--lower-case-table-names[=#]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>lower_case_table_names</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor padrão (macOS)</th> <td>[[<code>2</code>]]</td> </tr><tr><th>Valor padrão (Unix)</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor padrão (Windows)</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2</code>]]</td> </tr></tbody></table>

Se definido em 0, os nomes das tabelas são armazenados como especificado e as comparações são case-sensitivas. Se definido em 1, os nomes das tabelas são armazenados em minúsculas no disco e as comparações não são case-sensitivas. Se definido em 2, os nomes das tabelas são armazenados como dados, mas comparados em minúsculas. Esta opção também se aplica a nomes de banco de dados e aliases de tabelas.

O valor padrão desta variável é dependente da plataforma (ver `lower_case_file_system`). No Linux e outros sistemas Unix-like, o padrão é `0`. No Windows, o valor padrão é `1`. No macOS, o valor padrão é `2`. No Linux (e outros sistemas Unix-like), a configuração do valor para `2` não é suportada; o servidor força o valor para `0` em vez disso.

Você deve \* não \* definir `lower_case_table_names` para 0 se você estiver executando o MySQL em um sistema onde o diretório de dados reside em um sistema de arquivos insensível a maiúsculas e minúsculas (como no Windows ou macOS). É uma combinação não suportada que pode resultar em uma condição de suspensão ao executar uma operação `INSERT INTO ... SELECT ... FROM tbl_name` com a maiúscula e minúscula errada. Com `MyISAM`, acessar nomes de tabelas usando diferentes maiúsculas e minúsculas pode causar corrupção do índice.

Uma mensagem de erro é impressa e o servidor sai se você tentar iniciar o servidor com `--lower_case_table_names=0` em um sistema de arquivos insensível a maiúsculas e minúsculas.

A configuração desta variável afeta o comportamento das opções de filtragem de replicação em relação à sensibilidade a casos.

É proibido iniciar o servidor com uma configuração `lower_case_table_names` que seja diferente da configuração usada quando o servidor foi inicializado. A restrição é necessária porque as cotações usadas por vários campos de tabela de dicionário de dados são determinadas pela configuração definida quando o servidor é inicializado, e reiniciar o servidor com uma configuração diferente introduziria inconsistências em relação a como os identificadores são ordenados e comparados.

É, portanto, necessário configurar `lower_case_table_names` para a configuração desejada antes de inicializar o servidor. Na maioria dos casos, isso requer configurar `lower_case_table_names` em um arquivo de opções do MySQL antes de iniciar o servidor do MySQL pela primeira vez. Para instalações de APT no Debian e Ubuntu, no entanto, o servidor é inicializado para você, e não há oportunidade de configurar a configuração em um arquivo de opções de antemão. Portanto, você deve usar o utilitário `debconf-set-selection` antes de instalar o MySQL usando o APT para ativar `lower_case_table_names`. Para isso, execute este comando antes de instalar o MySQL usando o APT:

```
$> sudo debconf-set-selections <<< "mysql-server mysql-server/lowercase-table-names select Enabled"
```

- `mandatory_roles`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--mandatory-roles=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mandatory_roles</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

Funções que o servidor deve tratar como obrigatórias. Na verdade, essas funções são concedidas automaticamente a todos os usuários, embora a configuração `mandatory_roles` não mude nenhuma conta de usuário, e as funções concedidas não são visíveis na tabela de sistema `mysql.role_edges`.

O valor da variável é uma lista de nomes de funções separados por vírgulas.

```
SET PERSIST mandatory_roles = '`role1`@`%`,`role2`,role3,role4@localhost';
```

A definição do valor de tempo de execução de \[`mandatory_roles`] requer o privilégio \[`ROLE_ADMIN`], além do privilégio \[`SYSTEM_VARIABLES_ADMIN`] (ou do privilégio depreciado \[`SUPER`]) normalmente necessário para definir um valor de tempo de execução de variável de sistema global.

Os nomes de papéis consistem em uma parte usuário e uma parte host no formato `user_name@host_name`. A parte host, se omitida, é padrão para `%`.

O valor `mandatory_roles` é uma string, então nomes de usuários e nomes de host, se citados, devem ser escritos de uma forma permitida para citação dentro de strings citadas.

As funções nomeadas no valor de `mandatory_roles` não podem ser revogadas com `REVOKE` ou descartadas com `DROP ROLE` ou `DROP USER`.

Para evitar que as sessões sejam feitas sessões do sistema por padrão, uma função que tenha o privilégio `SYSTEM_USER` não pode ser listada no valor da variável do sistema `mandatory_roles`:

- Se `mandatory_roles` é atribuído uma função no início que tem o privilégio `SYSTEM_USER`, o servidor escreve uma mensagem para o log de erros e sai.
- Se `mandatory_roles` é atribuído uma função no tempo de execução que tem o privilégio `SYSTEM_USER`, ocorre um erro e o valor `mandatory_roles` permanece inalterado.

As funções obrigatórias, como as funções explicitamente concedidas, não entram em vigor até serem ativadas (ver Ativar funções). No momento do login, a ativação de funções ocorre para todas as funções concedidas se a variável de sistema `activate_all_roles_on_login` estiver ativada; caso contrário, ou para funções definidas como funções padrão.

Funções que não existem quando atribuídas ao `mandatory_roles` mas são criadas posteriormente podem exigir tratamento especial para serem consideradas obrigatórias.

\[`SHOW GRANTS`]] exibe funções obrigatórias de acordo com as regras descritas na secção 15.7.7.22, SHOW GRANTS Statement.

- `max_allowed_packet`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-allowed-packet=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_allowed_packet</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>67108864</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

O tamanho máximo de um pacote ou qualquer string gerado/intermediário, ou qualquer parâmetro enviado pela função `mysql_stmt_send_long_data()` C API. O padrão é 64MB.

O buffer de mensagens de pacotes é inicializado em `net_buffer_length` bytes, mas pode crescer até `max_allowed_packet` bytes quando necessário. Este valor por padrão é pequeno, para capturar pacotes grandes (possivelmente incorretos).

Você deve aumentar esse valor se estiver usando colunas grandes ou strings longas. Ele deve ser tão grande quanto o maior `BLOB` que você deseja usar. O limite de protocolo para `max_allowed_packet` é 1GB. O valor deve ser um múltiplo de 1024; não múltiplos são arredondados para o múltiplo mais próximo.

Quando você altera o tamanho do buffer de mensagens alterando o valor da variável `max_allowed_packet`, você também deve alterar o tamanho do buffer no lado do cliente, se o seu programa cliente permitir. O valor padrão `max_allowed_packet` incorporado na biblioteca do cliente é de 1GB, mas programas individuais do cliente podem substituir isso. Por exemplo, `mysql` e `mysqldump` têm padrões de 16MB e 24MB, respectivamente. Eles também permitem que você altere o valor do lado do cliente, definindo `max_allowed_packet` na linha de comando ou em um arquivo de opções.

O valor de sessão desta variável é somente de leitura. O cliente pode receber até tantos bytes quanto o valor de sessão. No entanto, o servidor não envia ao cliente mais bytes do que o valor global atual `max_allowed_packet` (O valor global pode ser menor que o valor da sessão se o valor global for alterado após o cliente se conectar).

- `max_connect_errors`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-connect-errors=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_connect_errors</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>100</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

Se uma conexão de um host for estabelecida com sucesso em menos de uma tentativa de conexão após uma conexão anterior ter sido interrompida, a contagem de erros para o host é limpa para zero. Para desbloquear hosts bloqueados, limpe o cache do host; veja Flushing the Host Cache.

- `max_connections`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-connections=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_connections</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>151</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>100000</code>]]</td> </tr></tbody></table>

O número máximo permitido de conexões de cliente simultâneas. O valor efetivo máximo é o menor entre o valor efetivo de \[`open_files_limit`] \[`- 810`] e o valor realmente definido para \[`max_connections`].

Para mais informações, ver ponto 7.1.12.1, "Interfaces de ligação".

- `max_delayed_threads`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-delayed-threads=#</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_delayed_threads</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>20</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>16384</code>]]</td> </tr></tbody></table>

Esta variável de sistema está desatualizada (porque as inserções de `DELAYED` não são suportadas) e sujeita a remoção em uma versão futura do MySQL.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

- `max_digest_length`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-digest-length=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_digest_length</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

O número máximo de bytes de memória reservados por sessão para o cálculo de digest de instruções normalizadas. Uma vez que essa quantidade de espaço é usada durante o cálculo de digest, ocorre o truncamento: nenhum outro token de uma instrução analisada é coletado ou figura em seu valor de digest. Instruções que diferem apenas depois de que muitos bytes de tokens analisados produzem o mesmo digest de instruções normalizadas e são consideradas idênticas se comparadas ou se agregadas para estatísticas de digest.

O comprimento usado para calcular um resumo de instruções normalizadas é a soma do comprimento do resumo de instruções normalizadas e do comprimento do resumo de instruções. Como o comprimento do resumo de instruções é sempre 64, isso é equivalente a `LENGTH` `(``STATEMENT_DIGEST_TEXT(statement) ) + 64`. Isso significa que, quando o valor de `max_digest_length` é 1024 (o padrão), o comprimento máximo para uma instrução SQL normalizada antes do truncamento ocorrer é de 960 bytes.

Advertência

A definição de `max_digest_length` para zero desativa a produção de digest, que também desativa a funcionalidade do servidor que requer digest, como o MySQL Enterprise Firewall.

A diminuição do valor `max_digest_length` reduz o uso de memória, mas faz com que o valor de digestão de mais instruções se torne indistinguível se elas diferirem apenas no final. Aumentar o valor permite que instruções mais longas sejam distinguidas, mas aumenta o uso de memória, particularmente para cargas de trabalho que envolvem um grande número de sessões simultâneas (o servidor aloca bytes `max_digest_length` por sessão).

O analisador usa essa variável do sistema como um limite para o comprimento máximo de digestões de instruções normalizadas que ele computa. O Esquema de Desempenho, se rastrear digestões de instruções, faz uma cópia do valor de digestão, usando o `performance_schema_max_digest_length`. A variável do sistema como um limite para o comprimento máximo de digestões que ele armazena. Consequentemente, se `performance_schema_max_digest_length` é menor que `max_digest_length`, os valores de digestão armazenados no Esquema de Desempenho são truncados em relação aos valores de digestão originais.

Para obter mais informações sobre a análise de declarações, ver secção 29.10, "Performance Schema Statement Digests and Sampling"

- `max_error_count`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-error-count=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_error_count</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

O número máximo de mensagens de erro, aviso e informação a ser armazenado para exibição pelas instruções `SHOW ERRORS` e `SHOW WARNINGS`. Este é o mesmo que o número de áreas de condição na área de diagnóstico, e, portanto, o número de condições que podem ser inspecionadas por `GET DIAGNOSTICS`.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

- `max_execution_time`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-execution-time=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_execution_time</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>milissegundos</td> </tr></tbody></table>

O tempo de execução para as instruções `SELECT`, em milissegundos. Se o valor for 0, os timeouts não são habilitados.

\[`max_execution_time`] aplica-se da seguinte forma:

- O valor global `max_execution_time` fornece o padrão para o valor da sessão para novas conexões. O valor da sessão se aplica às execuções `SELECT` executadas dentro da sessão que não incluem nenhuma sugestão de otimizador `MAX_EXECUTION_TIME(N)` ou para as quais \* `N` \* é 0.
- As instruções que não são apenas de leitura são aquelas que invocam uma função armazenada que modifica os dados como um efeito colateral.
- `max_execution_time` é ignorado para `SELECT` instruções em programas armazenados.

* `max_heap_table_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-heap-table-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_heap_table_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>16777216</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>16384</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709550592</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294966272</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

Esta variável define o tamanho máximo para o qual as tabelas criadas pelo usuário podem crescer. O valor da variável é usado para calcular os valores da tabela `MEMORY` da tabela `MAX_ROWS`.

A configuração desta variável não tem efeito em qualquer tabela existente, a menos que a tabela seja recriada com uma instrução como `CREATE TABLE` ou alterada com `ALTER TABLE` ou `TRUNCATE TABLE` Um reinicio do servidor também define o tamanho máximo das tabelas existentes `MEMORY` para o valor global `max_heap_table_size`.

Esta variável também é usada em conjunto com o `tmp_table_size` para limitar o tamanho das tabelas internas na memória.

O `max_heap_table_size` não é replicado. Ver Seção 19.5.1.21, Tabelas de Replicação e MEMÓRIA, e Seção 19.5.1.39, Replicação e Variáveis, para mais informações.

- `max_insert_delayed_threads`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_insert_delayed_threads</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>20</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>16384</code>]]</td> </tr></tbody></table>

Esta variável é um sinônimo de `max_delayed_threads`. Tal como `max_delayed_threads`, está desatualizado (porque as inserções de `DELAYED` não são suportadas) e sujeito a remoção em uma versão futura do MySQL.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

- `max_join_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-join-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_join_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr></tbody></table>

Se a estimativa do servidor indicar que um número maior de linhas do que o `max_join_size` deve ser lido a partir das tabelas de base, a instrução é rejeitada com um erro.

Se você definir a `sql_big_selects` novamente, a `max_join_size` será ignorada.

- `max_length_for_sort_data`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-length-for-sort-data=#</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_length_for_sort_data</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>8388608</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

Esta variável é depreciada e não tem efeito no MySQL 8.4.

- `max_points_in_geometry`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-points-in-geometry=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_points_in_geometry</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>65536</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>3</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr></tbody></table>

O valor máximo do argumento `points_per_circle` para a função `ST_Buffer_Strategy()`.

- `max_prepared_stmt_count`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-prepared-stmt-count=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_prepared_stmt_count</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>16382</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4194304</code>]]</td> </tr></tbody></table>

Esta variável limita o número total de instruções preparadas no servidor. Pode ser usada em ambientes onde há o potencial de ataques de negação de serviço baseados em executar o servidor fora de memória, preparando um grande número de instruções. Se o valor for definido abaixo do número atual de instruções preparadas, instruções existentes não são afetadas e podem ser usadas, mas nenhuma nova instrução pode ser preparada até que o número atual caia abaixo do limite. Definir o valor para 0 desativa instruções preparadas.

- `max_seeks_for_key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-seeks-for-key=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_seeks_for_key</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor padrão (Windows)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Valor por defeito (outras plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor por defeito (outras plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo (Windows)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Valor máximo (outras plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (outras plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

Limitar o número máximo de buscas quando se procura por linhas com base em uma chave. O optimizador MySQL assume que não são necessárias mais do que esse número de buscas de chaves quando se procura por linhas correspondentes em uma tabela por meio da varredura de um índice, independentemente da cardinalidade real do índice (ver Seção 15.7.7.23, SHOW INDEX Statement). Ao definir isso em um valor baixo (digamos, 100), você pode forçar o MySQL a preferir índices em vez de varreduras de tabela.

- `max_sort_length`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-sort-length=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_sort_length</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>8388608</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

O número de bytes a serem usados ao classificar valores de string que usam collações `PAD SPACE`. O servidor usa apenas os primeiros bytes `max_sort_length` de qualquer valor e ignora o resto. Consequentemente, esses valores que diferem apenas após os primeiros bytes `max_sort_length` são comparados como iguais para as operações `GROUP BY`, `ORDER BY` e `DISTINCT`. (Este comportamento difere das versões anteriores do MySQL, onde esta configuração foi aplicada a todos os valores usados em comparações.)

Aumentar o valor de \[`max_sort_length`] pode exigir aumentar o valor de \[`sort_buffer_size`] também. Para detalhes, consulte a Seção 10.2.1.16, ORDER BY Optimization

- `max_sp_recursion_depth`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-sp-recursion-depth[=#]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_sp_recursion_depth</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>255</code>]]</td> </tr></tbody></table>

O número de vezes que qualquer dado procedimento armazenado pode ser chamado recursivamente. O valor padrão para esta opção é 0, o que desativa completamente a recursão em procedimentos armazenados. O valor máximo é 255.

A recursão de procedimento armazenado aumenta a demanda de espaço na pilha de threads. Se você aumentar o valor de `max_sp_recursion_depth`, pode ser necessário aumentar o tamanho da pilha de threads aumentando o valor de `thread_stack` na inicialização do servidor.

- `max_user_connections`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-user-connections=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_user_connections</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

O número máximo de conexões simultâneas permitidas para qualquer conta de usuário MySQL. Um valor de 0 (o padrão) significa não há limite.

Esta variável tem um valor global que pode ser definido na inicialização do servidor ou no tempo de execução. Ele também tem um valor de sessão de somente leitura que indica o limite de conexão simultânea efetiva que se aplica à conta associada à sessão atual. O valor da sessão é inicializado da seguinte forma:

- Se a conta de usuário tiver um limite de recursos `MAX_USER_CONNECTIONS` diferente de zero, o valor da sessão `max_user_connections` é definido para esse limite.
- Caso contrário, o valor da sessão `max_user_connections` é definido como o valor global.

Os limites de recursos da conta são especificados usando a instrução `CREATE USER` ou `ALTER USER`.

- `max_write_lock_count`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--max-write-lock-count=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>max_write_lock_count</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor padrão (Windows)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Valor por defeito (outras plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor por defeito (outras plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo (Windows)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Valor máximo (outras plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (outras plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

Depois disso, muitos bloqueios de gravação permitem que alguns pedidos pendentes de bloqueio de leitura sejam processados no meio. Os pedidos de bloqueio de gravação têm prioridade mais alta do que os pedidos de bloqueio de leitura. No entanto, se `max_write_lock_count` for definido como um valor baixo (digamos, 10), os pedidos de bloqueio de leitura podem ser preferidos aos pedidos pendentes de bloqueio de gravação se os pedidos de bloqueio de leitura já tiverem sido passados em favor de 10 pedidos de bloqueio de gravação. Normalmente, esse comportamento não ocorre porque `max_write_lock_count` por padrão tem um valor muito grande.

- `mecab_rc_file`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--mecab-rc-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mecab_rc_file</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

A opção `mecab_rc_file` é usada ao configurar o analisador de texto completo do MeCab.

A opção `mecab_rc_file` define o caminho para o arquivo de configuração `mecabrc`, que é o arquivo de configuração do MeCab. A opção é somente de leitura e só pode ser definida no início. O arquivo de configuração `mecabrc` é necessário para inicializar o MeCab.

Para obter informações sobre o analisador de texto completo MeCab, ver Secção 14.9.9, "MeCab Full-Text Parser Plugin".

Para obter informações sobre as opções que podem ser especificadas no arquivo de configuração do MeCab `mecabrc`, consulte a Documentação do MeCab no site do Google Developers.

- `min_examined_row_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--min-examined-row-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>min_examined_row_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

As consultas que examinam menos do que este número de linhas não são registradas no registro de consultas lentas.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

- `myisam_data_pointer_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--myisam-data-pointer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>myisam_data_pointer_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>6</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>2</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

O tamanho padrão do ponteiro em bytes, a ser usado por `CREATE TABLE` para tabelas `MyISAM` quando nenhuma opção `MAX_ROWS` é especificada. Esta variável não pode ser menor que 2 ou maior que 7. O valor padrão é 6. Veja Seção B.3.2.10, A tabela está cheia.

- `myisam_max_sort_file_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--myisam-max-sort-file-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>myisam_max_sort_file_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor padrão (Windows)</th> <td>[[<code>2146435072</code>]]</td> </tr><tr><th>Valor por defeito (outras plataformas de 64 bits)</th> <td>[[<code>9223372036853727232</code>]]</td> </tr><tr><th>Valor por defeito (outras plataformas de 32 bits)</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo (Windows)</th> <td>[[<code>2146435072</code>]]</td> </tr><tr><th>Valor máximo (outras plataformas de 64 bits)</th> <td>[[<code>9223372036853727232</code>]]</td> </tr><tr><th>Valor máximo (outras plataformas de 32 bits)</th> <td>[[<code>2147483648</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

O tamanho máximo do arquivo temporário que o MySQL está autorizado a usar ao recriar um índice `MyISAM` (durante `REPAIR TABLE`, `ALTER TABLE`, ou `LOAD DATA`). Se o tamanho do arquivo for maior do que este valor, o índice é criado usando o cache da chave, que é mais lento. O valor é dado em bytes.

Se os arquivos de índice `MyISAM` excederem esse tamanho e houver espaço disponível no disco, aumentar o valor pode ajudar o desempenho. O espaço deve estar disponível no sistema de arquivos que contém o diretório onde o arquivo de índice original está localizado.

- `myisam_mmap_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--myisam-mmap-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>myisam_mmap_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor por defeito (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>7</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

A quantidade máxima de memória a ser usada para mapeamento de arquivos comprimidos `MyISAM`. Se muitas tabelas comprimidas `MyISAM` forem usadas, o valor pode ser diminuído para reduzir a probabilidade de problemas de troca de memória.

- `myisam_recover_options`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--myisam-recover-options[=lis<code>myisam_recover_options</code></code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>myisam_recover_options</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>DEFAULT</code>]]</p><p class="valid-value">[[<code>BACKUP</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>QUICK</code>]]</p></td> </tr></tbody></table>

Se você especificar vários valores, separe-os por vírgulas. Especificar a variável sem valor na inicialização do servidor é o mesmo que especificar a variável `DEFAULT` e especificar com um valor explícito de `""` desativa a recuperação (o mesmo que um valor de `OFF`). Se a recuperação for habilitada, cada vez que `mysqld` abre uma tabela `MyISAM`, ela verifica se a tabela está marcada como avariada ou não foi fechada corretamente. (A última opção funciona apenas se você estiver executando com bloqueio externo desativado.) \*\* Se esse for o caso, execute uma verificação no servidor. \*\*Se a tabela foi corrompida, a tabela será corrompida. \*\*

As seguintes opções afetam o funcionamento da reparação.

  <table><col style="width: 15%"/><col style="width: 70%"/><thead><tr> <th>Opção</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[<code>OFF</code>]]</td> <td>Sem recuperação.</td> </tr><tr> <td>[[<code>DEFAULT</code>]]</td> <td>Recuperação sem backup, forçando, ou verificação rápida.</td> </tr><tr> <td>[[<code>BACKUP</code>]]</td> <td>Se o arquivo de dados foi alterado durante a recuperação, salve um backup do [[<code><em><code>tbl_name</code>]]</em>.MYD</code>arquivo como [[<code><em><code>tbl_name-datetime</code>]]</em>.BAK</code></td> </tr><tr> <td>[[<code>FORCE</code>]]</td> <td>Executar a recuperação mesmo se perdermos mais de uma linha do arquivo [[<code>.MYD</code>]].</td> </tr><tr> <td>[[<code>QUICK</code>]]</td> <td>Não verifique as linhas da tabela se não existirem blocos de exclusão.</td> </tr></tbody></table>

Antes que o servidor automaticamente repare uma tabela, ele escreve uma nota sobre o reparo no registro de erros. Se você quiser ser capaz de se recuperar da maioria dos problemas sem a intervenção do usuário, você deve usar as opções `BACKUP,FORCE`. Isso força um reparo de uma tabela mesmo que algumas linhas sejam excluídas, mas mantém o arquivo de dados antigo como um backup para que você possa examinar mais tarde o que aconteceu.

Ver secção 18.2.1, "Opções de arranque do MyISAM".

- `myisam_sort_buffer_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--myisam-sort-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>myisam_sort_buffer_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>8388608</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

O tamanho do buffer que é alocado ao classificar índices `MyISAM` durante um `REPAIR TABLE` ou ao criar índices com `CREATE INDEX` ou `ALTER TABLE`.

- `myisam_stats_method`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--myisam-stats-method=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>myisam_stats_method</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>nulls_unequal</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>nulls_unequal</code>]]</p><p class="valid-value">[[<code>nulls_equal</code>]]</p><p class="valid-value">[[<code>nulls_ignored</code>]]</p></td> </tr></tbody></table>

Como o servidor trata os valores de `NULL` ao coletar estatísticas sobre a distribuição de valores de índice para tabelas de `MyISAM`. Esta variável tem três valores possíveis, `nulls_equal`, `nulls_unequal`, e `nulls_ignored`. Para `nulls_equal`, todos os valores de índice `NULL` são considerados iguais e formam um único grupo de valores que tem um tamanho igual ao número de valores de `NULL`. Para `nulls_unequal`, os valores de `NULL` são considerados desiguais, e cada valor de `NULL` forma um grupo distinto de tamanho.

1. Para `nulls_ignored`, os valores de `NULL` são ignorados.

O método que é usado para gerar estatísticas de tabela influencia a forma como o otimizador escolhe índices para execução de consulta, conforme descrito na Seção 10.3.8, InnoDB e MyISAM Index Statistics Collection.

- `myisam_use_mmap`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--myisam-use-mmap[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>myisam_use_mmap</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Use mapeamento de memória para ler e escrever tabelas `MyISAM`.

- `mysql_native_password_proxy_users`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--mysql-native-password-proxy-users[={OFF|ON}]</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>mysql_native_password_proxy_users</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta variável controla se o plug-in de autenticação embutida do `mysql_native_password` (desatualizado) suporta usuários proxy. Ele não tem efeito a menos que a variável do sistema `check_proxy_users` e o plug-in `mysql_native_password` estejam habilitados. Para informações sobre o proxy do usuário, consulte a Seção 8.2.19,  Usuários Proxy.

- `named_pipe`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--named-pipe[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>named_pipe</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Indica se o servidor suporta conexões através de tubos nomeados.

- `named_pipe_full_access_group`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--named-pipe-full-access-group=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>named_pipe_full_access_group</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>empty string</code>]]</p><p class="valid-value">[[<code>valid Windows local group name</code>]]</p><p class="valid-value">[[<code>*everyone*</code>]]</p></td> </tr></tbody></table>

O controle de acesso concedido aos clientes no tubo nomeado criado pelo servidor MySQL é definido para o mínimo necessário para uma comunicação bem-sucedida quando a variável do sistema `named_pipe` é habilitada para suportar conexões de tubo nomeado.

Esta variável define o nome de um grupo local do Windows cujos membros são concedidos acesso suficiente pelo servidor MySQL para usar clientes de named-pipe. O valor padrão é uma string vazia, o que significa que nenhum usuário do Windows é concedido acesso total ao named-pipe.

Um novo nome de grupo local do Windows (por exemplo, `mysql_access_client_users`) pode ser criado no Windows e, em seguida, usado para substituir o valor padrão quando o acesso é absolutamente necessário. Neste caso, limite a associação do grupo ao menor número possível de usuários, removendo os usuários do grupo quando seu software cliente é atualizado. Um não-membro do grupo que tenta abrir uma conexão com o MySQL com o cliente named-pipe afetado é negado o acesso até que um administrador do Windows adicione o usuário ao grupo. Os usuários recém-adicionados devem sair e entrar novamente para se juntar ao grupo (requerido pelo Windows).

Definir o valor como `'*everyone*'` fornece uma maneira independente do idioma de se referir ao grupo Todo mundo no Windows. O grupo Todo mundo não é seguro por padrão.

- `net_buffer_length`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--net-buffer-length=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>net_buffer_length</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>16384</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

Cada thread do cliente é associado a um buffer de conexão e buffer de resultado. Ambos começam com um tamanho dado por `net_buffer_length` mas são ampliados dinamicamente até 1 byte conforme necessário. O buffer de resultado encolhe para `net_buffer_length` após cada instrução SQL.

Esta variável normalmente não deve ser alterada, mas se você tiver pouca memória, você pode configurá-la para o comprimento esperado de instruções enviadas pelos clientes. Se as instruções excederem esse comprimento, o buffer de conexão será automaticamente ampliado. O valor máximo para o qual o `net_buffer_length` pode ser configurado é de 1MB.

O valor de sessão desta variável é apenas de leitura.

- `net_read_timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--net-read-timeout=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>net_read_timeout</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>30</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

O número de segundos para esperar por mais dados de uma conexão antes de interromper a leitura. Quando o servidor está lendo do cliente, `net_read_timeout` é o valor de tempo de espera controlando quando interromper. Quando o servidor está escrevendo para o cliente, `net_write_timeout` é o valor de tempo de espera controlando quando interromper. Veja também `replica_net_timeout`.

- `net_retry_count`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--net-retry-count=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>net_retry_count</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>10</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

Se uma leitura ou escrita em uma porta de comunicação for interrompida, tente isso várias vezes antes de desistir. Este valor deve ser definido bastante alto no FreeBSD porque interrupções internas são enviadas para todos os threads.

- `net_write_timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--net-write-timeout=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>net_write_timeout</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>60</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

O número de segundos para esperar que um bloco seja escrito em uma conexão antes de abortar a gravação. Veja também `net_read_timeout`.

- `ngram_token_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ngram-token-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ngram_token_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>2</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>10</code>]]</td> </tr></tbody></table>

Define o tamanho do token n-gram para o parser de texto completo n-gram. A opção `ngram_token_size` é somente de leitura e só pode ser modificada no início. O valor padrão é 2 (bigram). O valor máximo é 10.

Para obter mais informações sobre a configuração desta variável, ver secção 14.9.8, ngram Full-Text Parser.

- `offline_mode`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--offline-mode[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>offline_mode</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

No modo offline, a instância MySQL desconecta os usuários do cliente a menos que tenham privilégios relevantes e não lhes permita iniciar novas conexões.

Para colocar um servidor no modo offline, mude o valor da variável do sistema `offline_mode` de `OFF` para `ON`. Para retomar as operações normais, mude `offline_mode` de `ON` para `OFF`. Para controlar o modo offline, uma conta de administrador deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` e o privilégio `CONNECTION_ADMIN` (ou o privilégio depreciado `SUPER`, que cobre ambos esses privilégios). `CONNECTION_ADMIN` é necessário, para evitar o bloqueio acidental.

O modo offline tem estas características:

- Usuários de clientes conectados que não têm o privilégio `CONNECTION_ADMIN` (ou o privilégio depreciado `SUPER`) são desconectados na próxima solicitação, com um erro apropriado.
- Os usuários clientes conectados que têm o privilégio `CONNECTION_ADMIN` ou `SUPER` não são desconectados e podem iniciar novas conexões para gerenciar o servidor.
- Se o usuário que coloca um servidor no modo offline não tem o privilégio `SYSTEM_USER`, os usuários de cliente conectados que têm o privilégio `SYSTEM_USER` também não são desconectados. No entanto, esses usuários não podem iniciar novas conexões com o servidor enquanto ele estiver no modo offline, a menos que tenham também o privilégio `CONNECTION_ADMIN` ou `SUPER`. É apenas sua conexão existente que não pode ser encerrada, porque o privilégio `SYSTEM_USER` é necessário para matar uma sessão ou instrução que está sendo executada com o privilégio `SYSTEM_USER`.
- Os threads de replicação podem continuar aplicando dados ao servidor.

* `old_alter_table`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--old-alter-table[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>old_alter_table</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Quando esta variável está habilitada, o servidor não usa o método otimizado de processamento de uma operação PH. Ele retorna ao uso de uma tabela temporária, copiando os dados e, em seguida, renomeando a tabela temporária para o original, como usado pelo MySQL 5.0 e anteriores.

`ALTER TABLE ... DROP PARTITION` com `old_alter_table=ON` reconstrui a tabela particionada e tenta mover dados da partição descartada para outra partição com uma definição compatível `PARTITION ... VALUES`. Dados que não podem ser movidos para outra partição são excluídos. Em versões anteriores, `ALTER TABLE ... DROP PARTITION` com `old_alter_table=ON` exclui dados armazenados na partição e descartam a partição.

- `open_files_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--open-files-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>open_files_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>5000, with possible adjustment</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>platform dependent</code>]]</td> </tr></tbody></table>

O número de descritores de ficheiros disponíveis para `mysqld` a partir do sistema operativo:

- Na inicialização, `mysqld` reserva os descritores com `setrlimit()`, usando o valor solicitado ao definir esta variável diretamente ou usando a opção `--open-files-limit` para **mysqld\_safe**. Se `mysqld` produzir o erro `Too many open files`, tente aumentar o valor `open_files_limit`. Internamente, o valor máximo para esta variável é o valor inteiro máximo não assinado, mas o valor máximo real é dependente da plataforma.
- No tempo de execução, o valor de `open_files_limit` indica o número de descritores de arquivo realmente permitidos para `mysqld` pelo sistema operacional, que pode diferir do valor solicitado no início. Se o número de descritores de arquivo solicitados durante o início não puder ser alocado, `mysqld` escreve um aviso para o log de erros.

O valor efetivo `open_files_limit` é baseado no valor especificado na inicialização do sistema (se houver) e nos valores de `max_connections` e `table_open_cache`, usando estas fórmulas:

- Usando os padrões para essas variáveis, obtemos 8161.

  Somente no Windows, 2048 (o valor do máximo do descritor de arquivo da C Run-Time Library) é adicionado a este número. Este total é 10209, novamente usando os valores padrão para as variáveis de sistema indicadas.
- `max_connections * 5`
- O limite do sistema operacional.

O servidor tenta obter o número de descritores de arquivos usando o máximo desses valores, limitado ao valor inteiro máximo não assinado. Se muitos descritores não puderem ser obtidos, o servidor tenta obter tantos quanto o sistema permite.

O valor efetivo é 0 em sistemas em que o MySQL não pode alterar o número de arquivos abertos.

No Unix, o valor não pode ser definido maior do que o valor exibido pelo comando **ulimit -n**. Em sistemas Linux usando `systemd`, o valor não pode ser definido maior do que `LimitNOFILE` (isto é `DefaultLimitNOFILE`, se `LimitNOFILE` não for definido); caso contrário, no Linux, o valor de `open_files_limit` não pode exceder **ulimit -n**.

- `optimizer_prune_level`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--optimizer-prune-level=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>optimizer_prune_level</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>

Controla a heurística aplicada durante a otimização de consulta para podar planos parciais menos promissores do espaço de pesquisa do otimizador. Um valor de 0 desativa a heurística para que o otimizador execute uma pesquisa exaustiva. Um valor de 1 faz com que o otimizador corte os planos com base no número de linhas recuperadas pelos planos intermediários.

- `optimizer_search_depth`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--optimizer-search-depth=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>optimizer_search_depth</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>62</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>62</code>]]</td> </tr></tbody></table>

A profundidade máxima de busca realizada pelo otimizador de consulta. Valores maiores do que o número de relações em uma consulta resultam em melhores planos de consulta, mas levam mais tempo para gerar um plano de execução para uma consulta. Valores menores do que o número de relações em uma consulta retornam um plano de execução mais rápido, mas o plano resultante pode estar longe de ser otimizado. Se definido em 0, o sistema automaticamente escolhe um valor razoável.

- `optimizer_switch`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[PH_HTML_CODE_<code>firstmatch={on|off}</code>]</td> </tr><tr><th>Variável do sistema</th> <td>[[PH_HTML_CODE_<code>firstmatch={on|off}</code>]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[PH_HTML_CODE_<code>index_condition_pushdown={on|off}</code>] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Conjunto</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[PH_HTML_CODE_<code>index_merge={on|off}</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>index_merge_intersection={on|off}</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>index_merge_sort_union={on|off}</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>index_merge_union={on|off}</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>loosescan={on|off}</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>materialization={on|off}</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>mrr={on|off}</code>]</p><p class="valid-value">[[<code>firstmatch={on|off}</code>]]</p><p class="valid-value">[[<code>optimizer_switch</code><code>firstmatch={on|off}</code>]</p><p class="valid-value">[[<code>index_condition_pushdown={on|off}</code>]]</p><p class="valid-value">[[<code>index_merge={on|off}</code>]]</p><p class="valid-value">[[<code>index_merge_intersection={on|off}</code>]]</p><p class="valid-value">[[<code>index_merge_sort_union={on|off}</code>]]</p><p class="valid-value">[[<code>index_merge_union={on|off}</code>]]</p><p class="valid-value">[[<code>loosescan={on|off}</code>]]</p><p class="valid-value">[[<code>materialization={on|off}</code>]]</p><p class="valid-value">[[<code>mrr={on|off}</code>]]</p><p class="valid-value">[[<code>SET_VAR</code><code>firstmatch={on|off}</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>firstmatch={on|off}</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>index_condition_pushdown={on|off}</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>index_merge={on|off}</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>index_merge_intersection={on|off}</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>index_merge_sort_union={on|off}</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>index_merge_union={on|off}</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>loosescan={on|off}</code>]</p></td> </tr></tbody></table>

A variável de sistema `optimizer_switch` permite o controle sobre o comportamento do optimizador. O valor desta variável é um conjunto de bandeiras, cada uma das quais tem um valor de `on` ou `off` para indicar se o comportamento do optimizador correspondente está habilitado ou desativado. Esta variável tem valores globais e de sessão e pode ser alterada no tempo de execução. O padrão global pode ser definido na inicialização do servidor.

Para ver o conjunto atual de sinais de otimização, selecione o valor da variável:

```
mysql> SELECT @@optimizer_switch\G
*************************** 1. row ***************************
@@optimizer_switch: index_merge=on,index_merge_union=on,
                    index_merge_sort_union=on,index_merge_intersection=on,
                    engine_condition_pushdown=on,index_condition_pushdown=on,
                    mrr=on,mrr_cost_based=on,block_nested_loop=on,
                    batched_key_access=off,materialization=on,semijoin=on,
                    loosescan=on,firstmatch=on,duplicateweedout=on,
                    subquery_materialization_cost_based=on,
                    use_index_extensions=on,condition_fanout_filter=on,
                    derived_merge=on,use_invisible_indexes=off,skip_scan=on,
                    hash_join=on,subquery_to_derived=off,
                    prefer_ordering_index=on,hypergraph_optimizer=off,
                    derived_condition_pushdown=on,hash_set_operations=on
1 row in set (0.00 sec)
```

Para obter mais informações sobre a sintaxe desta variável e os comportamentos do otimizador que ela controla, consulte a Seção 10.9.2, "Otimizações comutáveis".

- `optimizer_trace`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--optimizer-trace=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>optimizer_trace</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Esta variável controla o rastreamento do optimizador.

- `optimizer_trace_features`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--optimizer-trace-features=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>optimizer_trace_features</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Esta variável ativa ou desativa recursos de rastreamento de otimizador selecionados.

- `optimizer_trace_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--optimizer-trace-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>optimizer_trace_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483647</code>]]</td> </tr></tbody></table>

O número máximo de traços do optimizador a exibir. Para mais detalhes, ver Secção 10.15, "Tracing the Optimizer".

- `optimizer_trace_max_mem_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--optimizer-trace-max-mem-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>optimizer_trace_max_mem_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

O tamanho máximo acumulado dos traços do optimizador armazenados.

- `optimizer_trace_offset`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--optimizer-trace-offset=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>optimizer_trace_offset</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>-1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-2147483647</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483647</code>]]</td> </tr></tbody></table>

Para mais detalhes, ver Secção 10.15, "Rastreamento do Otimizador".

- `performance_schema_xxx`

  As variáveis do sistema do esquema de desempenho são enumeradas na secção 29.15, "Variáveis do sistema do esquema de desempenho", que podem ser utilizadas para configurar a operação do esquema de desempenho.
- `parser_max_mem_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--parser-max-mem-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>parser_max_mem_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor por defeito (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>10000000</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

A quantidade máxima de memória disponível para o analisador. O valor padrão não coloca limite na memória disponível. O valor pode ser reduzido para proteger contra situações de falta de memória causadas pela análise de instruções SQL longas ou complexas.

- `partial_revokes`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--partial-revokes[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>partial_revokes</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td><p class="valid-value">[[<code>OFF</code>]] (se não existirem revogações parciais)</p><p class="valid-value">[[<code>ON</code>]] (se existirem revogações parciais)</p></td> </tr></tbody></table>

Por exemplo, um usuário que tem o privilégio global de `UPDATE` pode ser impedido de exercer esse privilégio no esquema do sistema `mysql` (ou, dito de outra forma, o usuário está habilitado a exercer o privilégio de `UPDATE` em todos os esquemas, exceto no `mysql`). Neste sentido, o privilégio global de `UPDATE` do usuário é parcialmente revogado.

Uma vez habilitado, `partial_revokes` não pode ser desativado se qualquer conta tiver restrições de privilégios. Se qualquer conta existir, desativar `partial_revokes` falha:

- Para tentativas de desativar `partial_revokes` na inicialização, o servidor registra uma mensagem de erro e habilita `partial_revokes`.
- Para tentativas de desativar `partial_revokes` no tempo de execução, ocorre um erro e o valor `partial_revokes` permanece inalterado.

Para desativar o `partial_revokes` neste caso, primeiro modifique cada conta que tenha privilégios parcialmente revogados, seja re-concedendo os privilégios ou removendo a conta.

::: info Note

Em atribuições de privilégios, habilitar `partial_revokes` faz com que o MySQL interprete ocorrências de caracteres de wildcard SQL não escapados `_` e `%` em nomes de esquema como caracteres literais, assim como se eles tivessem sido escapados como `\_` e `\%`.

Além disso, o uso de `_` e `%` como caracteres de wildcard em concessões é depreciado, e você deve esperar que o suporte a eles seja removido em uma versão futura do MySQL.

:::

Para obter mais informações, incluindo instruções para a remoção de revogações parciais, consulte a Secção 8.2.12, "Restrição de privilégios utilizando revogações parciais".

- `password_history`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password-history=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>password_history</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

Esta variável define a política global para controlar a reutilização de senhas anteriores com base no número mínimo necessário de alterações de senha. Para uma senha de conta usada anteriormente, esta variável indica o número de alterações subsequentes de senha de conta que devem ocorrer antes que a senha possa ser reutilizada. Se o valor for 0 (o padrão), não há restrição de reutilização com base no número de alterações de senha.

As alterações a esta variável aplicam-se imediatamente a todas as contas definidas com a opção `PASSWORD HISTORY DEFAULT`.

A política global de reutilização de senhas de número de alterações pode ser substituída conforme desejado para contas individuais usando a opção `PASSWORD HISTORY` das instruções `CREATE USER` e `ALTER USER`.

- `password_require_current`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password-require-current[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>password_require_current</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta variável define a política global para controlar se as tentativas de alteração de uma senha de conta devem especificar a senha atual a ser substituída.

As alterações a esta variável aplicam-se imediatamente a todas as contas definidas com a opção `PASSWORD REQUIRE CURRENT DEFAULT`.

A política de verificação global exigida pode ser substituída conforme desejado para contas individuais usando a opção `PASSWORD REQUIRE` das instruções `CREATE USER` e `ALTER USER`.

- `password_reuse_interval`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password-reuse-interval=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>password_reuse_interval</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>dias</td> </tr></tbody></table>

Esta variável define a política global para controlar a reutilização de senhas anteriores com base no tempo decorrido. Para uma senha de conta usada anteriormente, esta variável indica o número de dias que devem passar antes que a senha possa ser reutilizada. Se o valor for 0 (o padrão), não há restrição de reutilização com base no tempo decorrido.

As alterações a esta variável aplicam-se imediatamente a todas as contas definidas com a opção `PASSWORD REUSE INTERVAL DEFAULT`.

A política global de reutilização de senhas com lapso de tempo pode ser substituída conforme desejado para contas individuais usando a opção `PASSWORD REUSE INTERVAL` das instruções `CREATE USER` e `ALTER USER`.

- `persisted_globals_load`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--persisted-globals-load[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>persisted_globals_load</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Se as configurações de configuração persistentes devem ser carregadas a partir do arquivo `mysqld-auto.cnf` no diretório de dados. O servidor normalmente processa este arquivo no início depois de todos os outros arquivos de opção (ver Seção 6.2.2.2, Using Option Files). A desativação de `persisted_globals_load` faz com que a sequência de inicialização do servidor ignore `mysqld-auto.cnf`.

Para modificar o conteúdo do `mysqld-auto.cnf`, use as instruções `SET PERSIST`, `SET PERSIST_ONLY`, e `RESET PERSIST`.

- `persist_only_admin_x509_subject`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--persist-only-admin-x509-subject=string</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>persist_only_admin_x509_subject</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

As variáveis de sistema persistentes permitem alterações de configuração de tempo de execução que afetam reinicializações subsequentes do servidor, o que é conveniente para administração remota que não requer acesso direto aos arquivos de opção do host do servidor MySQL. No entanto, algumas variáveis de sistema não são persistentes ou podem ser persistentes apenas sob certas condições restritivas.

A variável de sistema `persist_only_admin_x509_subject` especifica o valor de sujeito do certificado SSL X.509 que os usuários devem ter para poder persistir em variáveis de sistema que são restritas a persistência. O valor padrão é a string vazia, que desativa a verificação de sujeito para que as variáveis de sistema restritas a persistência não possam ser persistidas por qualquer usuário.

Se `persist_only_admin_x509_subject` não for vazio, os usuários que se conectam ao servidor usando uma conexão criptografada e fornecem um certificado SSL com o valor Subject designado, então, podem usar `SET PERSIST_ONLY` para persistir variáveis de sistema com restrição de persistência. Para informações sobre variáveis de sistema com restrição de persistência e instruções para configurar o MySQL para habilitar `persist_only_admin_x509_subject`, veja Seção 7.1.9.4, Variaveis de sistema não persistentes e persistentes.

- `persist_sensitive_variables_in_plaintext`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--persist_sensitive_variables_in_plaintext[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>persist_sensitive_variables_in_plaintext</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

\[`persist_sensitive_variables_in_plaintext`]] controla se o servidor tem permissão para armazenar os valores de variáveis sensíveis do sistema em um formato não criptografado, se o suporte ao componente de chaveamento não estiver disponível no momento em que \[`SET PERSIST`]] é usado para definir o valor da variável do sistema. Ele também controla se o servidor pode iniciar ou não se os valores criptografados não puderem ser decifrados. Note que os plugins de chaveamento não suportam o armazenamento seguro de variáveis sensíveis do sistema; um componente de chaveamento (ver Seção 8.4.4, The MySQL Keyring) deve ser habilitado na instância do MySQL Server para suportar o armazenamento seguro.

A configuração padrão, `ON`, criptografa os valores se o suporte ao componente de chave está disponível, e persiste sem criptografia (com um aviso) se não estiver. Na próxima vez que qualquer variável do sistema persistente for definida, se o suporte à chave estiver disponível naquele momento, o servidor criptografa os valores de quaisquer variáveis sensíveis do sistema não criptografadas. A configuração `ON` também permite que o servidor inicie se os valores das variáveis do sistema criptografadas não puderem ser decifrados, caso em que um aviso é emitido e os valores padrão para as variáveis do sistema são usados. Nessa situação, seus valores não podem ser alterados até que possam ser decifrados.

A configuração mais segura, `OFF`, significa que os valores das variáveis do sistema sensíveis não podem ser mantidos se o suporte de componentes de chaveamento não estiver disponível. A configuração `OFF` também significa que o servidor não inicia se os valores das variáveis do sistema criptografados não puderem ser decifrados.

Para mais informações, consulte Persisting Sensitive System Variables.

- `pid_file`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--pid-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>pid_file</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O nome de caminho do arquivo no qual o servidor escreve o ID do processo. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja dado para especificar um diretório diferente. Se você especificar essa variável, você deve especificar um valor. Se você não especificar essa variável, o MySQL usa um valor padrão de `host_name.pid`, onde `host_name` é o nome da máquina host.

O arquivo de ID de processo é usado por outros programas, como **mysqld\_safe** para determinar o ID de processo do servidor. No Windows, essa variável também afeta o nome do arquivo de registro de erro padrão.

- `plugin_dir`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--plugin-dir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>plugin_dir</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>BASEDIR/lib/plugin</code>]]</td> </tr></tbody></table>

O nome do caminho do diretório do plugin.

Se o diretório do plugin for escrevível pelo servidor, pode ser possível para um usuário escrever código executável para um arquivo no diretório usando `SELECT ... INTO DUMPFILE`. Isso pode ser evitado fazendo `plugin_dir` ler apenas para o servidor ou definindo `secure_file_priv` para um diretório onde `SELECT` escreve pode ser feito com segurança.

- `port`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--port=port_num</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>port</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>3306</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

O número da porta em que o servidor escuta para conexões TCP/IP. Esta variável pode ser definida com a opção `--port`.

- `preload_buffer_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--preload-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>preload_buffer_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1073741824</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

O tamanho do buffer que é atribuído ao pré-carregar índices.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

- `print_identified_with_as_hex`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--print-identified-with-as-hex[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>print_identified_with_as_hex</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Os valores de hash de senha exibidos na cláusula de saída `IDENTIFIED WITH` de `SHOW CREATE USER` podem conter caracteres imprimíveis que têm efeitos adversos nos monitores de terminais e em outros ambientes. Ativar `print_identified_with_as_hex` faz com que `SHOW CREATE USER` exiba esses valores de hash como strings hexadecimais em vez de literais de string regulares. Os valores de hash que não contêm caracteres imprimíveis ainda são exibidos como literais de string regulares, mesmo com essa variável ativada.

- `profiling`

Se definido em 0 ou \[`OFF`] (o padrão), o perfil de instruções é desativado. Se definido em 1 ou \[`ON`], o perfil de instruções é habilitado e as instruções \[`SHOW PROFILE`] e \[`SHOW PROFILES`] fornecem acesso a informações de perfil. Veja Seção 15.7.7.33, SHOW PROFILES Statement.

Esta variável está desatualizada; espere que seja removida em uma futura versão do MySQL.

- `profiling_history_size`

O número de instruções para as quais manter informações de perfil se `profiling` estiver habilitado. O valor padrão é 15. O valor máximo é 100. A definição do valor para 0 desativa efetivamente o perfil. Veja Seção 15.7.7.33, SHOW PROFILES Statement.

Esta variável está desatualizada; espere que seja removida em uma futura versão do MySQL.

- `protocol_compression_algorithms`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--protocol-compression-algorithms=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>protocol_compression_algorithms</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Conjunto</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>zlib,zstd,uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>

Os algoritmos de compressão que o servidor permite para conexões de entrada. Estes incluem conexões por programas clientes e por servidores que participam de replicação de fonte / réplica ou replicação de grupo. A compressão não se aplica a conexões para tabelas `FEDERATED`.

`protocol_compression_algorithms` não controla a compressão de conexão para o protocolo X. Veja a Seção 22.5.5, Compressão de conexão com o Plugin X para informações sobre como isso funciona.

O valor da variável é uma lista de um ou mais nomes de algoritmos de compressão separados por vírgulas, em qualquer ordem, escolhidos entre os seguintes itens (não sensíveis a maiúsculas e minúsculas):

- `zlib`: Permitir conexões que usam o algoritmo de compressão `zlib`.
- `zstd`: Permitir conexões que usam o algoritmo de compressão `zstd`.
- `uncompressed`: Permitir conexões não comprimidas. Se este nome de algoritmo não estiver incluído no valor `protocol_compression_algorithms`, o servidor não permitirá conexões não comprimidas. Ele permitirá apenas conexões comprimidas que usem quaisquer outros algoritmos especificados no valor, e não há fallback para conexões não comprimidas.

O valor padrão de `zlib,zstd,uncompressed` indica que o servidor permite todos os algoritmos de compressão.

Para mais informações, ver ponto 6.2.8, "Controlo da compressão da ligação".

- `protocol_version`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>protocol_version</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>10</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

A versão do protocolo cliente/servidor utilizada pelo servidor MySQL.

- `proxy_user`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>proxy_user</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Se o cliente atual é um proxy para outro usuário, essa variável é o nome da conta de usuário do proxy. Caso contrário, essa variável é `NULL`.

- `pseudo_replica_mode`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>pseudo_replica_mode</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr></tbody></table>

É para uso interno do servidor. Ele auxilia com o tratamento correto de transações que se originaram em servidores mais antigos ou mais novos do que o servidor atualmente processando-os. **mysqlbinlog** define o valor de `pseudo_replica_mode` para verdadeiro antes de executar qualquer instrução SQL.

A definição do valor de sessão de `pseudo_replica_mode` é uma operação restrita. O usuário de sessão deve ter o privilégio `REPLICATION_APPLIER` (ver Seção 19.3.3,  Verificações de Privilégios de Replicação), ou privilégios suficientes para definir variáveis de sessão restritas (ver Seção 7.1.9.1,  Privilégios de Variaveis de Sistema). No entanto, note que a variável não é destinada a ser definida pelos usuários; ela é definida automaticamente pela infraestrutura de replicação.

O `pseudo_replica_mode` tem os seguintes efeitos sobre o processamento de transações XA preparadas, que podem ser anexadas ou desligadas da sessão de processamento (por padrão, a sessão que emite o `XA START`):

- Se for verdade, e a sessão de manipulação executou uma instrução de uso interno `BINLOG`, as transações XA são automaticamente desligadas da sessão assim que a primeira parte da transação até `XA PREPARE` terminar, para que possam ser comprometidas ou revertidas por qualquer sessão que tenha o privilégio `XA_RECOVER_ADMIN`.
- Se for false, as transações XA permanecem ligadas à sessão de manipulação enquanto essa sessão estiver ativa, período durante o qual nenhuma outra sessão pode cometer a transação.

`pseudo_replica_mode` tem os seguintes efeitos sobre o `original_commit_timestamp` replicação de atraso timestamp e a `original_server_version` sistema variável:

- Se for verdade, as transações que não definem explicitamente `original_commit_timestamp` ou `original_server_version` são assumidas como originadas em outro servidor desconhecido, de modo que o valor 0, que significa desconhecido, é atribuído ao carimbo de tempo e à variável do sistema.
- Se for false, as transações que não definem explicitamente `original_commit_timestamp` ou `original_server_version` são assumidas como originárias do servidor atual, de modo que o carimbo de tempo atual e a versão do servidor atual são atribuídos ao carimbo de tempo e à variável do sistema.

`pseudo_replica_mode` tem os seguintes efeitos no tratamento de uma instrução que define um ou mais modos SQL não suportados (removidos ou desconhecidos):

- Se for verdade, o servidor ignora o modo não suportado e cria um aviso.
- Se for falso, o servidor rejeita a instrução com `ER_UNSUPPORTED_SQL_MODE`.

* `pseudo_slave_mode`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>pseudo_slave_mode</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr></tbody></table>

Alias deprecado para `pseudo_replica_mode`.

- `pseudo_thread_id`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>pseudo_thread_id</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>2147483647</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483647</code>]]</td> </tr></tbody></table>

Esta variável é para uso interno do servidor.

Advertência

Mudar o valor da sessão da variável do sistema `pseudo_thread_id` altera o valor retornado pela função `CONNECTION_ID()`.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

- `query_alloc_block_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--query-alloc-block-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>query_alloc_block_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>8192</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294966272</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

O tamanho de alocação em bytes de blocos de memória que são alocados para objetos criados durante a análise e execução de instruções. Se você tiver problemas com fragmentação de memória, pode ajudar a aumentar este parâmetro.

O tamanho do bloco para o número de bytes é 1024. Um valor que não é um múltiplo exato do tamanho do bloco é arredondado para o próximo múltiplo inferior do tamanho do bloco pelo MySQL Server antes de armazenar o valor para a variável do sistema. O analisador permite valores até o valor inteiro não assinado máximo para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits), mas o máximo real é um tamanho de bloco menor.

- `query_prealloc_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--query-prealloc-size=#</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>query_prealloc_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>8192</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>8192</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709550592</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294966272</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

`query_prealloc_size` é depreciado, e sua configuração não tem efeito; você deve esperar sua remoção em uma versão futura do MySQL.

- `rand_seed1`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>rand_seed1</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>N/A</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

As variáveis `rand_seed1` e `rand_seed2` existem apenas como variáveis de sessão, e podem ser definidas, mas não lidas. As variáveis, mas não seus valores, são mostrados na saída de `SHOW VARIABLES`.

O propósito dessas variáveis é suportar a replicação da função `RAND()`. Para instruções que invocam `RAND()`, a fonte passa dois valores para a réplica, onde eles são usados para gerar o gerador de números aleatórios. A réplica usa esses valores para definir as variáveis de sessão `rand_seed1` e `rand_seed2` de modo que `RAND()` na réplica gera o mesmo valor que na fonte.

- `rand_seed2`

Ver a descrição para `rand_seed1`.

- `range_alloc_block_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--range-alloc-block-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>range_alloc_block_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709550592</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294966272</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

O tamanho em bytes dos blocos que são alocados ao fazer otimização de alcance.

O tamanho do bloco para o número de bytes é 1024. Um valor que não é um múltiplo exato do tamanho do bloco é arredondado para o próximo múltiplo inferior do tamanho do bloco pelo MySQL Server antes de armazenar o valor para a variável do sistema. O analisador permite valores até o valor inteiro não assinado máximo para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits), mas o máximo real é um tamanho de bloco menor.

- `range_optimizer_max_mem_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--range-optimizer-max-mem-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>range_optimizer_max_mem_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>8388608</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

O limite de consumo de memória para o otimizador de alcance. Um valor de 0 significa não há limite. Se um plano de execução considerado pelo otimizador usa o método de acesso de alcance, mas o otimizador estima que a quantidade de memória necessária para este método excederia o limite, ele abandona o plano e considera outros planos. Para mais informações, consulte Limitar o uso de memória para otimização de alcance.

- `rbr_exec_mode`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>rbr_exec_mode</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>STRICT</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>STRICT</code>]]</p><p class="valid-value">[[<code>IDEMPOTENT</code>]]</p></td> </tr></tbody></table>

Para uso interno pelo **mysqlbinlog**. Esta variável alterna o servidor entre o modo `IDEMPOTENT` e o modo `STRICT`. O modo `IDEMPOTENT` causa a supressão de erros de chave duplicada e de chave não encontrada nas instruções `BINLOG` geradas pelo **mysqlbinlog**. Este modo é útil quando se reproduz um log binário baseado em linhas em um servidor que causa conflitos com dados existentes. **mysqlbinlog** define este modo quando você especifica a opção `--idempotent` escrevendo o seguinte na saída:

```
SET SESSION RBR_EXEC_MODE=IDEMPOTENT;
```

- `read_buffer_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--read-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>read_buffer_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>131072</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>8192</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147479552</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>

Cada thread que faz uma varredura sequencial para uma tabela PH atribui um buffer deste tamanho (em bytes) para cada tabela que ele varre. Se você fizer muitas varreduras sequenciais, você pode querer aumentar este valor, que por padrão é 131072. O valor desta variável deve ser um múltiplo de 4KB. Se ele é definido para um valor que não é um múltiplo de 4KB, seu valor é arredondado para o múltiplo mais próximo de 4KB.

Esta opção também é usada no seguinte contexto para todos os outros motores de armazenamento, com exceção de \[`InnoDB`]:

- Para armazenar em cache os índices em um arquivo temporário (não uma tabela temporária), ao ordenar linhas para `ORDER BY`.
- Para inserção a granel em divisórias.
- Para armazenar em cache os resultados de consultas aninhadas.

O `read_buffer_size` também é usado de outra maneira específica do motor de armazenamento: para determinar o tamanho do bloco de memória para as tabelas `MEMORY`.

`select_into_buffer_size` é usado para o buffer de cache de I/O para as instruções `SELECT INTO DUMPFILE` e `SELECT INTO OUTFILE`. `read_buffer_size` é usado para o tamanho do buffer de cache de I/O em todos os outros casos.)

Para mais informações sobre o uso da memória durante diferentes operações, ver Secção 10.12.3.1, "Como o MySQL usa a memória".

- `read_only`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--read-only[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>read_only</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se a variável de sistema `read_only` estiver ativada, o servidor não permitirá atualizações de clientes, exceto de usuários que tenham o privilégio `CONNECTION_ADMIN` (ou o privilégio depreciado `SUPER`). Esta variável está desativada por padrão.

O servidor também suporta uma variável de sistema `super_read_only` (desativada por padrão), que tem estes efeitos:

- Se `super_read_only` estiver habilitado, o servidor proíbe atualizações do cliente, mesmo de usuários que têm o privilégio `CONNECTION_ADMIN` ou `SUPER`.
- Definir `super_read_only` para `ON` implicitamente força `read_only` para `ON`.
- Definir `read_only` para `OFF` implicitamente força `super_read_only` para `OFF`.

Quando `read_only` está habilitado e quando `super_read_only` está habilitado, o servidor ainda permite estas operações:

- Atualizações realizadas por threads de replicação, se o servidor for uma réplica. Em configurações de replicação, pode ser útil habilitar o `read_only` em servidores de réplica para garantir que as réplicas aceitem atualizações apenas do servidor de origem e não de clientes.
- Escreve para a tabela de sistema `mysql.gtid_executed`, que armazena GTIDs para transações executadas que não estão presentes no arquivo de registro binário atual.
- O objetivo do modo somente leitura é evitar alterações na estrutura ou conteúdo da tabela. Análise e otimização não se qualificam como tais alterações. Isso significa, por exemplo, que as verificações de consistência em réplicas somente leitura podem ser realizadas com `mysqlcheck` `--all-databases` `--analyze`.
- Uso de instruções `FLUSH STATUS`, que são sempre escritas no log binário.
- Operações em tabelas `TEMPORARY`.
- Inserções nas tabelas de log (`mysql.general_log` e `mysql.slow_log`); ver Seção 7.4.1, "Seleção de Destinos de saída de log de consulta geral e de log de consulta lenta".
- Atualizações de tabelas de esquema de desempenho, como operações `UPDATE` ou `TRUNCATE TABLE`.

Mudanças em `read_only` em um servidor de origem de replicação não são replicadas em servidores de réplica. O valor pode ser definido em uma réplica independente da configuração na fonte.

As seguintes condições se aplicam às tentativas de ativar o `read_only` (incluindo tentativas implícitas resultantes da ativação do `super_read_only`):

- A tentativa falha e ocorre um erro se você tiver quaisquer bloqueios explícitos (adquiridos com `LOCK TABLES`) ou tiver uma transação pendente.
- A tentativa bloqueia enquanto outros clientes têm qualquer instrução em andamento, ativo \[`LOCK TABLES WRITE`], ou comprometimento em andamento, até que os bloqueios sejam liberados e as instruções e transações terminem. Enquanto a tentativa de habilitar \[`read_only`] está pendente, solicitações de outros clientes para bloqueios de tabela ou para iniciar transações também bloqueiam até que \[`read_only`] tenha sido definido.
- A tentativa é bloqueada se houver transações ativas que contenham bloqueios de metadados, até que essas transações terminem.
- `read_only` pode ser ativado enquanto você mantém um bloqueio de leitura global (adquirido com `FLUSH TABLES WITH READ LOCK`) porque isso não envolve bloqueios de tabela.

* `read_rnd_buffer_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--read-rnd-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>read_rnd_buffer_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>262144</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483647</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

Esta variável é usada para leituras de tabelas `MyISAM` e, para qualquer mecanismo de armazenamento, para otimização de leitura de Multi-Range.

Ao ler linhas de uma tabela `MyISAM` em ordem ordenada após uma operação de classificação de chaves, as linhas são lidas através deste buffer para evitar buscas de disco. Veja Seção 10.2.1.16, "ORDER BY Optimization". A definição da variável para um valor grande pode melhorar o desempenho do `ORDER BY` em muito. No entanto, este é um buffer alocado para cada cliente, então você não deve definir a variável global para um valor grande. Em vez disso, mude a variável de sessão apenas dentro daqueles clientes que precisam executar consultas grandes.

Para obter mais informações sobre o uso de memória durante diferentes operações, consulte a Seção 10.12.3.1, "Como o MySQL usa memória". Para obter informações sobre a otimização de leitura em vários intervalos, consulte a Seção 10.2.1.11, "Otimização de leitura em vários intervalos".

- `regexp_stack_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--regexp-stack-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>regexp_stack_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>8000000</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483647</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

A memória máxima disponível em bytes para a pilha interna utilizada para operações de correspondência de expressões regulares realizadas por `REGEXP_LIKE()` e funções semelhantes (ver Secção 14.8.2, "Expressões Regulares").

- `regexp_time_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--regexp-time-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>regexp_time_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>32</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483647</code>]]</td> </tr></tbody></table>

O limite de tempo para as operações de correspondência de expressões regulares executadas por `REGEXP_LIKE()` e funções semelhantes (ver Seção 14.8.2, "Expressões Regulares"). Este limite é expresso como o número máximo permitido de etapas executadas pelo mecanismo de correspondência, e, portanto, afeta o tempo de execução apenas indiretamente.

- `require_row_format`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>require_row_format</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta variável é para uso interno do servidor por replicação e **mysqlbinlog**. Ele restringe eventos DML executados na sessão a eventos codificados em formato de registro binário baseado em linhas apenas, e tabelas temporárias não podem ser criadas. As consultas que não respeitam as restrições falham.

Definir o valor de sessão desta variável do sistema em `ON` não requer privilégios. Definir o valor de sessão desta variável do sistema em `OFF` é uma operação restrita, e o usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Veja Seção 7.1.9.1, "Privilégios de variáveis do sistema".

- `require_secure_transport`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--require-secure-transport[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>require_secure_transport</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se as conexões do cliente com o servidor são necessárias para usar alguma forma de transporte seguro. Quando esta variável é habilitada, o servidor permite apenas conexões TCP/IP criptografadas usando TLS/SSL, ou conexões que usam um arquivo de soquete (em Unix) ou memória compartilhada (em Windows). O servidor rejeita tentativas de conexão não seguras, que falham com um erro `ER_SECURE_TRANSPORT_REQUIRED`.

Esta capacidade complementa os requisitos SSL por conta, que têm precedência. Por exemplo, se uma conta é definida com `REQUIRE SSL`, habilitando `require_secure_transport` não torna possível usar a conta para se conectar usando um arquivo de soquete Unix.

É possível que um servidor não tenha nenhum transporte seguro disponível. Por exemplo, um servidor no Windows não suporta nenhum transporte seguro se iniciado sem especificar nenhum certificado SSL ou arquivos-chave e com a variável de sistema `shared_memory` desativada. Sob essas condições, as tentativas de habilitar `require_secure_transport` no início fazem com que o servidor escreva uma mensagem para o log de erros e saia. As tentativas de habilitar a variável no tempo de execução falham com um erro `ER_NO_SECURE_TRANSPORTS_CONFIGURED`.

Todos os membros do grupo de replicação devem ter o mesmo valor para esta variável; caso contrário, alguns membros podem não ser capazes de se juntar.

Ver também Configurar conexões criptografadas como obrigatórias.

- `restrict_fk_on_non_standard_key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--restrict-fk-on-non-standard-key</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>restrict_fk_on_non_standard_key</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Esta variável, quando `ON` (o padrão), impede o uso de chaves não únicas ou chaves parciais como chaves externas. Para permitir que tais chaves sejam usadas como chaves externas na sessão atual, use `SET @@session.restrict_fk_on_non_standard_key=OFF`; para permitir que elas sejam usadas globalmente, defina a variável global ou inicie o servidor com `--skip-restrict-fk-on-non-standard-key`.

O uso de chaves não únicas ou parciais como chaves estranhas em uma instrução `CREATE TABLE` ou `ALTER TABLE` é depreciado, e você deve esperar que o suporte para ele seja removido em uma versão futura do MySQL. Quando `restrict_fk_on_non_standard_key` é `ON`, as tentativas de fazê-lo são rejeitadas com `ER_FK_NO_INDEX_PARENT`; quando é `OFF`, esse uso é permitido, mas ainda levanta `ER_WARN_DEPRECATED_NON_STANDARD_KEY` como um aviso.

`restrict_fk_on_non_standard_key` está desatualizado, e sujeito a remoção em uma versão futura do MySQL. Configurar ele levanta um aviso de desatualização.

\*\* Implicação para a replicação MySQL. \*\* Quando uma chave externa é criada em uma chave não padrão na primária porque `restrict_fk_on_non_standard_key` é `OFF`, a instrução é bem sucedida na réplica, independentemente de qualquer configuração na réplica para esta variável.

- `resultset_metadata`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>resultset_metadata</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FULL</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>FULL</code>]]</p><p class="valid-value">[[<code>NONE</code>]]</p></td> </tr></tbody></table>

Para conexões para as quais a transferência de metadados é opcional, o cliente define a variável de sistema `resultset_metadata` para controlar se o servidor retorna o conjunto de metadados do resultado. Os valores permitidos são `FULL` (retorna todos os metadados; este é o padrão) e `NONE` (retorna nenhum metadado).

Para conexões que não são metadados opcionais, a configuração de `resultset_metadata` para `NONE` produz um erro.

Para mais informações sobre a gestão da transferência de metadados do conjunto de resultados, ver Metadados do conjunto de resultados opcionais.

- `secondary_engine_cost_threshold`

Para uso com o MySQL HeatWave apenas. Veja Variaveis do Sistema, para mais informações.

- `schema_definition_cache`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--schema-definition-cache=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>schema_definition_cache</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>524288</code>]]</td> </tr></tbody></table>

Define um limite para o número de objetos de definição de esquema, usados e não usados, que podem ser mantidos no cache de objetos do dicionário.

Objetos de definição de esquema não usados só são mantidos no cache de objetos do dicionário quando o número em uso é menor do que a capacidade definida por `schema_definition_cache`.

Uma configuração de `0` significa que os objetos de definição de esquema são mantidos apenas no cache de objetos do dicionário enquanto estão em uso.

Para mais informações, ver Secção 16.4, "Dictionary Object Cache".

- `secure_file_priv`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--secure-file-priv=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>secure_file_priv</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>platform specific</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>empty string</code>]]</p><p class="valid-value">[[<code>dirname</code>]]</p><p class="valid-value">[[<code>NULL</code>]]</p></td> </tr></tbody></table>

Esta variável é usada para limitar o efeito das operações de importação e exportação de dados, como as executadas pelas instruções `LOAD DATA` e `SELECT ... INTO OUTFILE` e pela função `LOAD_FILE()`.

\[`secure_file_priv`]] pode ser definido da seguinte forma:

- Se estiver vazio, a variável não tem efeito. Esta não é uma configuração segura.
- Se definido para o nome de um diretório, o servidor limita as operações de importação e exportação para trabalhar apenas com arquivos nesse diretório. O diretório deve existir; o servidor não o cria.
- Se definido como `NULL`, o servidor desativa as operações de importação e exportação.

O valor padrão é específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` **CMake**, conforme mostrado na tabela a seguir. Para especificar o valor padrão `secure_file_priv` explicitamente se você estiver construindo a partir do código-fonte, use a opção `INSTALL_SECURE_FILE_PRIVDIR` **CMake**.

  <table><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>[<code>INSTALL_LAYOUT</code>] Valor</th> <th>Valor padrão [[<code>secure_file_priv</code>]]</th> </tr></thead><tbody><tr> <td>[[<code>STANDALONE</code>]]</td> <td>vazio</td> </tr><tr> <td>[[<code>DEB</code>]], [[<code>RPM</code>]], [[<code>SVR4</code>]]</td> <td>[[<code>/var/lib/mysql-files</code>]]</td> </tr><tr> <td>Caso contrário</td> <td>[[<code>mysql-files</code>]] sob o valor [[<code class="option">CMAKE_INSTALL_PREFIX</code>]]</td> </tr></tbody></table>

O servidor verifica o valor de `secure_file_priv` na inicialização e escreve uma advertência para o registro de erros se o valor for inseguro. Um valor não-`NULL` é considerado inseguro se estiver vazio, ou o valor for o diretório de dados ou um subdiretório dele, ou um diretório acessível por todos os usuários. Se `secure_file_priv` for definido para um caminho inexistente, o servidor escreve uma mensagem de erro para o registro de erros e sai.

- `select_into_buffer_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--select-into-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>select_into_buffer_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>131072</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>8192</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147479552</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>

Ao usar `SELECT INTO OUTFILE` ou `SELECT INTO DUMPFILE` para despejar dados em um ou mais arquivos para criação de backup, migração de dados ou outros propósitos, as gravações podem muitas vezes ser armazenadas em buffer e, em seguida, desencadear uma grande explosão de atividade de E/S de gravação para o disco ou outro dispositivo de armazenamento e interromper outras consultas que são mais sensíveis à latência. Você pode usar essa variável para controlar o tamanho do buffer usado para escrever dados para o dispositivo de armazenamento para determinar quando a sincronização do buffer deve ocorrer e, assim, evitar que ocorram paradas de gravação do tipo descrito.

`select_into_buffer_size` sobrepõe qualquer valor definido para `read_buffer_size`. (`select_into_buffer_size` e `read_buffer_size` têm os mesmos valores padrão, máximo e mínimo.) Você também pode usar `select_into_disk_sync_delay` para definir um tempo limite a ser observado posteriormente, cada vez que a sincronização ocorre.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

- `select_into_disk_sync`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--select-into-disk-sync={ON|OFF}</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>select_into_disk_sync</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p></td> </tr></tbody></table>

Quando definido em `ON`, permite a sincronização do buffer de gravações em um arquivo de saída por uma instrução `SELECT INTO OUTFILE` ou `SELECT INTO DUMPFILE` de longa execução usando `select_into_buffer_size`.

- `select_into_disk_sync_delay`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--select-into-disk-sync-delay=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>select_into_disk_sync_delay</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>milissegundos</td> </tr></tbody></table>

Quando a sincronização do buffer de gravações em um arquivo de saída por uma instrução de `SELECT INTO OUTFILE` ou `SELECT INTO DUMPFILE` de longa duração é ativada por `select_into_disk_sync`, esta variável define um atraso opcional (em milissegundos) após a sincronização. `0` (o padrão) significa nenhum atraso.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

- `session_track_gtids`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--session-track-gtids=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>session_track_gtids</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>OWN_GTID</code>]]</p><p class="valid-value">[[<code>ALL_GTIDS</code>]]</p></td> </tr></tbody></table>

Controla se o servidor devolve GTIDs ao cliente, permitindo que o cliente os use para rastrear o estado do servidor. Dependendo do valor da variável, no final da execução de cada transação, os GTIDs do servidor são capturados e devolvidos ao cliente como parte do reconhecimento. Os valores possíveis para \[`session_track_gtids`] são os seguintes:

- `OFF`: O servidor não retorna GTIDs para o cliente. Este é o padrão.
- `OWN_GTID`: O servidor retorna os GTIDs para todas as transações que foram cometidas com sucesso por este cliente em sua sessão atual desde o último reconhecimento. Tipicamente, este é o único GTID para a última transação comprometida, mas se uma única solicitação do cliente resultou em múltiplas transações, o servidor retorna um conjunto de GTIDs contendo todos os GTIDs relevantes.
- `ALL_GTIDS`: O servidor retorna o valor global de sua variável de sistema `gtid_executed`, que ele lê em um ponto após a transação ser comprometida com sucesso. Assim como o GTID para a transação apenas comprometida, este conjunto de GTID inclui todas as transações comprometidas no servidor por qualquer cliente, e pode incluir transações cometidas após o ponto em que a transação atualmente sendo reconhecida foi comprometida.

\[`session_track_gtids`]] não pode ser definido no contexto transacional.

Para mais informações sobre o rastreamento do estado da sessão, ver Seção 7.1.18, "Rastreamento do estado da sessão do cliente pelo servidor".

- `session_track_schema`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--session-track-schema[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>session_track_schema</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Controla se o servidor rastreia quando o esquema (base de dados) padrão é definido na sessão atual e notifica o cliente para disponibilizar o nome do esquema.

Se o rastreador de nomes de esquema estiver ativado, a notificação de nomes ocorre cada vez que o esquema padrão é definido, mesmo que o novo nome de esquema seja o mesmo que o antigo.

Para mais informações sobre o rastreamento do estado da sessão, ver Seção 7.1.18, "Rastreamento do estado da sessão do cliente pelo servidor".

- `session_track_state_change`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--session-track-state-change[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>session_track_state_change</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Controla se o servidor rastreia alterações no estado da sessão atual e notifica o cliente quando ocorrem alterações de estado. As alterações podem ser relatadas para estes atributos do estado da sessão do cliente:

- O esquema padrão (base de dados).
- Valores específicos da sessão para as variáveis do sistema.
- Variáveis definidas pelo utilizador.
- Mesas temporárias.
- Declarações preparadas.

Se o rastreador de estado de sessão estiver habilitado, a notificação ocorre para cada alteração que envolva atributos de sessão rastreados, mesmo que os novos valores de atributo sejam os mesmos que os antigos. Por exemplo, definir uma variável definida pelo usuário para seu valor atual resulta em uma notificação.

A variável `session_track_state_change` controla apenas a notificação de quando ocorrem alterações, não quais são as alterações. Por exemplo, as notificações de alteração de estado ocorrem quando o esquema padrão é definido ou as variáveis do sistema de sessão rastreadas são atribuídas, mas a notificação não inclui o nome do esquema ou os valores das variáveis do sistema de sessão. Para receber notificação do nome do esquema ou dos valores das variáveis do sistema de sessão, use a variável do sistema `session_track_schema` ou `session_track_system_variables`, respectivamente.

::: info Note

A atribuição de um valor ao próprio `session_track_state_change` não é considerada uma mudança de estado e não é relatada como tal. No entanto, se o seu nome estiver listado no valor de `session_track_system_variables`, qualquer atribuição a ele resulta na notificação do novo valor.

:::

Para mais informações sobre o rastreamento do estado da sessão, ver Seção 7.1.18, "Rastreamento do estado da sessão do cliente pelo servidor".

- `session_track_system_variables`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--session-track-system-variables=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>session_track_system_variables</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>time_zone, autocommit, character_set_client, character_set_results, character_set_connection</code>]]</td> </tr></tbody></table>

Controla se o servidor rastreia as atribuições às variáveis do sistema de sessão e notifica o cliente do nome e valor de cada variável atribuída. O valor da variável é uma lista separada por vírgula de variáveis para rastrear atribuições. Por padrão, a notificação é ativada para `time_zone`, `autocommit`, `character_set_client`, `character_set_results`, e `character_set_connection`. (As três últimas variáveis são as afetadas por `SET NAMES`.)

Para habilitar a exibição do ID de instrução para cada instrução processada, use a variável `statement_id`.

```
mysql>  SET @@SESSION.session_track_system_variables='statement_id'
mysql>  SELECT 1;
+---+
| 1 |
+---+
| 1 |
+---+
1 row in set (0.0006 sec)
Statement ID: 603835
```

O valor especial `*` (asterisco) faz com que o servidor rastreie atribuições a todas as variáveis de sessão. Se for dado, este valor deve ser especificado por si mesmo sem nomes de variáveis de sistema específicos. Este valor também permite a exibição do ID de instrução para cada instrução processada com sucesso.

Para desativar a notificação de atribuições de variáveis de sessão, defina `session_track_system_variables` na cadeia vazia.

Se o rastreamento de variáveis do sistema de sessão estiver ativado, a notificação ocorre para todas as atribuições a variáveis de sessão rastreadas, mesmo que os novos valores sejam os mesmos que os antigos.

Para mais informações sobre o rastreamento do estado da sessão, ver Seção 7.1.18, "Rastreamento do estado da sessão do cliente pelo servidor".

- `session_track_transaction_info`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--session-track-transaction-info=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>session_track_transaction_info</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>STATE</code>]]</p><p class="valid-value">[[<code>CHARACTERISTICS</code>]]</p></td> </tr></tbody></table>

Controla se o servidor rastreia o estado e as características das transações na sessão atual e notifica o cliente para disponibilizar essas informações.

- `OFF`: Desativar o rastreamento do estado da transação. É o padrão.
- `STATE`: Ativar o rastreamento do estado da transação sem o rastreamento das características. O rastreamento do estado permite ao cliente determinar se uma transação está em andamento e se ela pode ser movida para uma sessão diferente sem ser revertida.
- `CHARACTERISTICS`: Ativar o rastreamento do estado da transação, incluindo o rastreamento de características. O rastreamento de características permite ao cliente determinar como reiniciar uma transação em outra sessão para que ela tenha as mesmas características da sessão original. As seguintes características são relevantes para este propósito:

  ```
  ISOLATION LEVEL
  READ ONLY
  READ WRITE
  WITH CONSISTENT SNAPSHOT
  ```

Para que um cliente possa realocar uma transação para outra sessão com segurança, ele deve rastrear não apenas o estado da transação, mas também as características da transação. Além disso, o cliente deve rastrear as variáveis do sistema `transaction_isolation` e `transaction_read_only` para determinar corretamente os padrões de sessão. (Para rastrear essas variáveis, listá-las no valor da variável do sistema `session_track_system_variables`.)

Para mais informações sobre o rastreamento do estado da sessão, ver Seção 7.1.18, "Rastreamento do estado da sessão do cliente pelo servidor".

- `set_operations_buffer_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--set-operations-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>set_operations_buffer_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>256K</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>16K</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1 GB</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>128</code>]]</td> </tr></tbody></table>

Define o tamanho do buffer para as operações `INTERSECT` e `EXCEPT` que usam tabelas de hash quando o interruptor do optimizador `hash_set_operations` é `ON`. Em geral, aumentar o tamanho deste buffer melhora o desempenho dessas operações quando a otimização de hash está habilitada.

- `sha256_password_auto_generate_rsa_keys`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--sha256-password-auto-generate-rsa-keys[={OFF|ON}]</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>sha256_password_auto_generate_rsa_keys</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

O servidor usa essa variável para determinar se deve gerar automaticamente arquivos de pares de chaves privadas/públicas RSA no diretório de dados se eles ainda não existirem.

Na inicialização, o servidor gera automaticamente arquivos de pares de chaves privadas/públicas RSA no diretório de dados se todas as seguintes condições forem verdadeiras: A variável de sistema `sha256_password_auto_generate_rsa_keys` ou `caching_sha2_password_auto_generate_rsa_keys` está habilitada; nenhuma opção RSA está especificada; os arquivos RSA estão ausentes do diretório de dados. Estes arquivos de pares de chaves permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password` (obsoleto) ou `caching_sha2_password`; veja Seção 8.4.1.3, SHA-256 Pluggable Authentication, e Seção 8.4.1.2, Caching SHA-2 Pluggable Authentication.

Para obter mais informações sobre a geração automática de arquivos RSA, incluindo nomes e características de arquivos, consulte a Seção 8.3.3.1, Criação de certificados e chaves SSL e RSA usando MySQL

A variável do sistema `auto_generate_certs` está relacionada, mas controla a geração automática de certificados SSL e arquivos de chave necessários para conexões seguras usando SSL.

- `sha256_password_private_key_path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--sha256-password-private-key-path=file_name</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>sha256_password_private_key_path</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>private_key.pem</code>]]</td> </tr></tbody></table>

O valor desta variável é o nome do caminho do arquivo de chave privada RSA para o plug-in de autenticação \[`sha256_password`]. Se o arquivo for nomeado como um caminho relativo, ele é interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM.

Importância

Como este arquivo armazena uma chave privada, seu modo de acesso deve ser restrito para que apenas o servidor MySQL possa lê-lo.

Para obter informações sobre \[`sha256_password`], ver Secção 8.4.1.3, SHA-256 Pluggable Authentication.

- `sha256_password_proxy_users`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--sha256-password-proxy-users[={OFF|ON}]</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>sha256_password_proxy_users</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta variável controla se o plug-in de autenticação embutida do `sha256_password` (desatualizado) suporta usuários proxy. Ele não tem efeito a menos que a variável do sistema `check_proxy_users` esteja habilitada. Para informações sobre o proxy do usuário, consulte a Seção 8.2.19,  Usuários Proxy.

- `sha256_password_public_key_path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--sha256-password-public-key-path=file_name</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>sha256_password_public_key_path</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>public_key.pem</code>]]</td> </tr></tbody></table>

O valor desta variável é o nome do caminho do arquivo de chave pública RSA para o plug-in de autenticação \[`sha256_password`]. Se o arquivo for nomeado como um caminho relativo, ele é interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM. Como este arquivo armazena uma chave pública, cópias podem ser livremente distribuídas aos usuários do cliente. (Clientes que especificam explicitamente uma chave pública ao se conectar ao servidor usando criptografia de senha RSA devem usar a mesma chave pública usada pelo servidor.)

Para obter informações sobre o `sha256_password` (obsoleto), incluindo informações sobre como os clientes especificam a chave pública RSA, consulte a Seção 8.4.1.3, SHA-256 Pluggable Authentication.

- `shared_memory`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--shared-memory[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>shared_memory</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se o servidor permite conexões de memória compartilhada.

- `shared_memory_base_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--shared-memory-base-name=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>shared_memory_base_name</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>MYSQL</code>]]</td> </tr></tbody></table>

O nome da memória compartilhada para usar para conexões de memória compartilhada. Isso é útil quando executar várias instâncias do MySQL em uma única máquina física. O nome padrão é `MYSQL`. O nome é sensível a maiúscula e minúscula.

Esta variável aplica-se apenas se o servidor for iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `show_create_table_skip_secondary_engine`

Para uso com o MySQL HeatWave apenas. Veja Variaveis do Sistema, para mais informações.

- `show_create_table_verbosity`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--show-create-table-verbosity[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>show_create_table_verbosity</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

`SHOW CREATE TABLE` normalmente não mostra a opção de tabela `ROW_FORMAT` se o formato de linha for o formato padrão. Ativar esta variável faz com que `SHOW CREATE TABLE` exiba `ROW_FORMAT` independentemente de ser o formato padrão.

- `show_gipk_in_create_table_and_information_schema`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--show-gipk-in-create-table-and-information-schema[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>show_gipk_in_create_table_and_information_schema</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Se as chaves primárias invisíveis geradas são visíveis na saída das instruções `SHOW` e nas tabelas de esquema de informações. Quando esta variável é definida como `OFF`, essas chaves não são exibidas.

Esta variável não é replicada.

Para obter mais informações, ver a secção 15.1.20.11, "Generated Invisible Primary Keys" (Chaves primárias invisíveis geradas).

- `skip_external_locking`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-external-locking[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>skip_external_locking</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Este é `OFF` se `mysqld` usa bloqueio externo (bloqueio do sistema), `ON` se o bloqueio externo está desativado. Isso afeta apenas o acesso à tabela `MyISAM`.

Esta variável é definida pela opção `--external-locking` ou `--skip-external-locking`.

O bloqueio externo afeta apenas o acesso à tabela `MyISAM`.Para mais informações, incluindo as condições sob as quais ele pode e não pode ser usado, consulte a Seção 10.11.5, Ferramento externo.

- `skip_name_resolve`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-name-resolve[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>skip_name_resolve</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se resolver nomes de host ao verificar conexões de cliente. Se esta variável for `OFF`, `mysqld` resolve nomes de host ao verificar conexões de cliente. Se for `ON`, `mysqld` usa apenas números de IP; neste caso, todos os valores da coluna `Host` nas tabelas de concessão devem ser endereços IP. Veja Seção 7.1.12.3, DNS Lookups e o Cache de Host.

Dependendo da configuração de rede do seu sistema e dos valores `Host` para suas contas, os clientes podem precisar se conectar usando uma opção `--host` explícita, como `--host=127.0.0.1` ou `--host=::1`.

Uma tentativa de se conectar ao host `127.0.0.1` normalmente resolve para a conta `localhost` . No entanto, isso falha se o servidor é executado com `skip_name_resolve` habilitado. Se você planeja fazer isso, verifique se existe uma conta que pode aceitar uma conexão. Por exemplo, para poder se conectar como `root` usando `--host=127.0.0.1` ou `--host=::1`, crie essas contas:

```
CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
```

- `skip_networking`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-networking[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>skip_networking</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta variável controla se o servidor permite conexões TCP/IP. Por padrão, está desativado (permitir conexões TCP/IP). Se ativado, o servidor permite apenas conexões locais (não TCP/IP) e toda a interação com `mysqld` deve ser feita usando tubos nomeados ou memória compartilhada (no Windows) ou arquivos de soquete Unix (no Unix). Esta opção é altamente recomendada para sistemas onde apenas clientes locais são permitidos.

Como iniciar o servidor com `--skip-grant-tables` desativa as verificações de autenticação, o servidor também desativa conexões remotas nesse caso ativando `skip_networking`.

- `skip_show_database`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-show-database</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>skip_show_database</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Isso impede que as pessoas usem a instrução `SHOW DATABASES` se não tiverem o privilégio `SHOW DATABASES`. Isso pode melhorar a segurança se você tiver preocupações sobre os usuários poderem ver bancos de dados pertencentes a outros usuários. Seu efeito depende do privilégio `SHOW DATABASES`: Se o valor da variável for `ON`, a instrução `SHOW DATABASES` é permitida apenas para usuários que têm o privilégio `SHOW DATABASES` e a instrução exibe todos os nomes de banco de dados. Se o valor for `OFF`, `SHOW DATABASES` é permitido para todos os usuários, mas exibe os nomes apenas daqueles bancos de dados para os quais o usuário tem o privilégio `SHOW DATABASES` ou outro.

Precaução

Como qualquer privilégio global estático é considerado um privilégio para todos os bancos de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de banco de dados com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` de `INFORMATION_SCHEMA`, exceto bancos de dados que foram restritos no nível do banco de dados por revogações parciais.

- `slow_launch_time`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--slow-launch-time=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>slow_launch_time</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>2</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

Se a criação de um thread demorar mais do que este número de segundos, o servidor aumenta a variável de status `Slow_launch_threads`.

- `slow_query_log`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--slow-query-log[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>slow_query_log</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se o log de consulta lenta está habilitado. O valor pode ser 0 (ou `OFF`) para desativar o log ou 1 (ou `ON`) para habilitar o log. O destino para a saída do log é controlado pela variável do sistema `log_output`; se esse valor é `NONE`, nenhuma entrada de log é escrita mesmo que o log esteja habilitado.

Slow é determinado pelo valor da variável `long_query_time` Ver Seção 7.4.5, The Slow Query Log.

- `slow_query_log_file`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--slow-query-log-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>slow_query_log_file</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>host_name-slow.log</code>]]</td> </tr></tbody></table>

O nome do arquivo de registro de consulta lenta. O valor padrão é `host_name-slow.log`, mas o valor inicial pode ser alterado com a opção `--slow_query_log_file`.

- `socket`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--socket={file_name|pipe_name}</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>socket</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor padrão (Windows)</th> <td>[[<code>MySQL</code>]]</td> </tr><tr><th>Valor padrão (outras)</th> <td>[[<code>/tmp/mysql.sock</code>]]</td> </tr></tbody></table>

Em plataformas Unix, esta variável é o nome do arquivo de soquete que é usado para conexões de cliente local. O padrão é `/tmp/mysql.sock`. (Para alguns formatos de distribuição, o diretório pode ser diferente, como `/var/lib/mysql` para RPMs.)

No Windows, esta variável é o nome do tubo nomeado que é usado para conexões de cliente local. O valor padrão é `MySQL` (não sensível a maiúsculas e minúsculas).

- `sort_buffer_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--sort-buffer-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>sort_buffer_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>262144</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>32768</code>]]</td> </tr><tr><th>Valor máximo (Windows)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Valor máximo (outras plataformas de 64 bits)</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor máximo (outras plataformas de 32 bits)</th> <td>[[<code>4294967295</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

Cada sessão que deve executar uma classificação aloca um buffer deste tamanho. `sort_buffer_size` não é específico para qualquer mecanismo de armazenamento e se aplica de maneira geral para otimização. No mínimo, o valor `sort_buffer_size` deve ser grande o suficiente para acomodar quinze tuplas no buffer de classificação. Também, aumentar o valor de `max_sort_length` pode exigir aumentar o valor de `sort_buffer_size`.

Se você ver muitos `Sort_merge_passes` por segundo na saída `SHOW GLOBAL STATUS`, você pode considerar aumentar o valor `sort_buffer_size` para acelerar as operações `ORDER BY` ou `GROUP BY` que não podem ser melhoradas com otimização de consulta ou indexação aprimorada.

O optimizador tenta calcular quanto espaço é necessário, mas pode alocar mais, até o limite. A definição maior do que o necessário globalmente retarda a maioria das consultas que executam ordens. É melhor aumentá-lo como uma configuração de sessão, e apenas para as sessões que precisam de um tamanho maior. No Linux, existem limites de 256KB e 2MB onde valores maiores podem retardar significativamente a alocação de memória, então você deve considerar ficar abaixo de um desses valores. Experimente para encontrar o melhor valor para sua carga de trabalho. Veja Seção B.3.3.5, "Onde o MySQL armazena arquivos temporários".

A configuração máxima permitida para `sort_buffer_size` é 4GB-1. Valores maiores são permitidos para plataformas de 64 bits (exceto Windows de 64 bits, para os quais os valores grandes são truncados para 4GB-1 com um aviso).

- `sql_auto_is_null`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>sql_auto_is_null</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se esta variável estiver habilitada, então depois de uma instrução que inserir com sucesso um valor gerado automaticamente, você pode encontrar esse valor emitindo uma instrução da seguinte forma:

```
SELECT * FROM tbl_name WHERE auto_col IS NULL
```

Se a instrução retornar uma linha, o valor retornado é o mesmo que se você invocasse a função `LAST_INSERT_ID()`. Para detalhes, incluindo o valor de retorno após uma inserção de várias linhas, veja Seção 14.15, Funções de Informação. Se nenhum valor `AUTO_INCREMENT` foi inserido com sucesso, a instrução `SELECT` não retorna nenhuma linha.

O comportamento de recuperação de um valor `AUTO_INCREMENT` usando uma comparação `IS NULL` é usado por alguns programas ODBC, como o Access. Veja Obtendo valores de aumento automático. Este comportamento pode ser desativado definindo `sql_auto_is_null` para `OFF`.

O valor padrão de `sql_auto_is_null` é `OFF`.

- `sql_big_selects`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>sql_big_selects</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Se definido para `OFF`, o MySQL aborda as instruções `SELECT` que provavelmente levarão muito tempo para serem executadas (isto é, instruções para as quais o otimizador estima que o número de linhas examinadas excede o valor de `max_join_size`). Isso é útil quando uma instrução `WHERE` não recomendada foi emitida. O valor padrão para uma nova conexão é `ON`, que permite todas as instruções `SELECT`.

Se você definir a variável de sistema `max_join_size` para um valor diferente de `DEFAULT`, `sql_big_selects` é definido como `OFF`.

- `sql_buffer_result`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>sql_buffer_result</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se ativado, `sql_buffer_result` força os resultados das instruções `SELECT` a serem colocados em tabelas temporárias. Isso ajuda o MySQL a liberar os bloqueios de tabela mais cedo e pode ser benéfico nos casos em que leva muito tempo para enviar resultados ao cliente. O valor padrão é `OFF`.

- `sql_generate_invisible_primary_key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--sql-generate-invisible-primary-key[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>sql_generate_invisible_primary_key</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se este servidor adiciona uma chave primária invisível gerada a qualquer tabela `InnoDB` que seja criada sem uma.

Esta variável não é replicada. Além disso, mesmo que definida na réplica, ela é ignorada pelos threads de aplicadores de replicação; isso significa que, por padrão, uma réplica não gera uma chave primária para qualquer tabela replicada que, na fonte, foi criada sem uma. Você pode fazer com que a réplica gere chaves primárias invisíveis para tais tabelas definindo `REQUIRE_TABLE_PRIMARY_KEY_CHECK = GENERATE` como parte de uma instrução `CHANGE REPLICATION SOURCE TO`, opcionalmente especificando um canal de replicação.

Para obter mais informações e exemplos, ver a secção 15.1.20.11, "Generated Invisible Primary Keys" (Chaves primárias invisíveis geradas).

- `sql_log_off`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>sql_log_off</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]] (permitir o registo)</p><p class="valid-value">[[<code>ON</code>]] (desativar o registo)</p></td> </tr></tbody></table>

Esta variável controla se o registro do registro de consultas gerais é desativado para a sessão atual (assumindo que o próprio registro de consultas gerais esteja habilitado). O valor padrão é `OFF` (isto é, habilitar o registro). Para desativar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável `sql_log_off` para `ON` ou `OFF`.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

- `sql_mode`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[PH_HTML_CODE_<code>NO_BACKSLASH_ESCAPES</code>]</td> </tr><tr><th>Variável do sistema</th> <td>[[PH_HTML_CODE_<code>NO_BACKSLASH_ESCAPES</code>]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[PH_HTML_CODE_<code>NO_ENGINE_SUBSTITUTION</code>] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Conjunto</td> </tr><tr><th>Valor por defeito</th> <td>[[PH_HTML_CODE_<code>NO_UNSIGNED_SUBTRACTION</code>]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[PH_HTML_CODE_<code>NO_ZERO_DATE</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>NO_ZERO_IN_DATE</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>ONLY_FULL_GROUP_BY</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>PAD_CHAR_TO_FULL_LENGTH</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>PIPES_AS_CONCAT</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>REAL_AS_FLOAT</code>]</p><p class="valid-value">[[<code>NO_BACKSLASH_ESCAPES</code>]]</p><p class="valid-value">[[<code>sql_mode</code><code>NO_BACKSLASH_ESCAPES</code>]</p><p class="valid-value">[[<code>NO_ENGINE_SUBSTITUTION</code>]]</p><p class="valid-value">[[<code>NO_UNSIGNED_SUBTRACTION</code>]]</p><p class="valid-value">[[<code>NO_ZERO_DATE</code>]]</p><p class="valid-value">[[<code>NO_ZERO_IN_DATE</code>]]</p><p class="valid-value">[[<code>ONLY_FULL_GROUP_BY</code>]]</p><p class="valid-value">[[<code>PAD_CHAR_TO_FULL_LENGTH</code>]]</p><p class="valid-value">[[<code>PIPES_AS_CONCAT</code>]]</p><p class="valid-value">[[<code>REAL_AS_FLOAT</code>]]</p><p class="valid-value">[[<code>SET_VAR</code><code>NO_BACKSLASH_ESCAPES</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>NO_BACKSLASH_ESCAPES</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>NO_ENGINE_SUBSTITUTION</code>]</p></td> </tr></tbody></table>

O modo SQL do servidor atual, que pode ser definido dinamicamente.

::: info Note

Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação.

Se o modo SQL difere do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opções que o servidor lê no início.

:::

- `sql_notes`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>sql_notes</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Se ativado (o padrão), o diagnóstico do incremento de nível `Note` `warning_count` e o servidor os grava. Se desativado, o diagnóstico `Note` não incrementa `warning_count` e o servidor não os grava. `mysqldump` inclui saída para desativar esta variável para que o recarregamento do arquivo de descarregamento não produza avisos para eventos que não afetam a integridade da operação de recarregamento.

- `sql_quote_show_create`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>sql_quote_show_create</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Se ativado (o padrão), o servidor cita identificadores para as instruções `SHOW CREATE TABLE` e `SHOW CREATE DATABASE`. Se desativado, a citação é desativada. Esta opção é ativada por padrão para que a replicação funcione para identificadores que requerem citação. Veja Seção 15.7.7.11, SHOW CREATE TABLE Statement, e Seção 15.7.7.7, SHOW CREATE DATABASE Statement.

- `sql_require_primary_key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--sql-require-primary-key[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>sql_require_primary_key</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se as instruções que criam novas tabelas ou alteram a estrutura de tabelas existentes impõem o requisito de que as tabelas tenham uma chave primária.

A definição do valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Ver Seção 7.1.9.1, "Privilégios de variáveis de sistema".

A ativação desta variável ajuda a evitar problemas de desempenho na replicação baseada em linhas que podem ocorrer quando as tabelas não têm chave primária. Suponha que uma tabela não tenha chave primária e uma atualização ou exclusão modifique várias linhas. No servidor de origem da replicação, essa operação pode ser realizada usando uma única varredura de tabela, mas, quando replicada usando replicação baseada em linhas, resulta em uma varredura de tabela para cada linha a ser modificada na réplica. Com uma chave primária, essas varreduras de tabela não ocorrem.

A tabela `sql_require_primary_key` aplica-se tanto às tabelas base quanto às tabelas `TEMPORARY`, e as mudanças em seu valor são replicadas nos servidores de réplica. A tabela deve usar mecanismos de armazenamento MySQL que possam participar da replicação.

Quando ativado, o `sql_require_primary_key` tem estes efeitos:

- As tentativas de criar uma nova tabela sem chave primária falham com um erro. Isto inclui `CREATE TABLE ... LIKE`. Também inclui `CREATE TABLE ... SELECT`, a menos que a parte `CREATE TABLE` inclua uma definição de chave primária.
- As tentativas de soltar a chave primária de uma tabela existente falham com um erro, com a exceção de que soltar a chave primária e adicionar uma chave primária na mesma instrução `ALTER TABLE` é permitido.

  Deixar cair a chave primária falha mesmo que a tabela também contenha um índice `UNIQUE NOT NULL`.
- Tentativas de importar uma tabela sem chave primária falham com um erro.

A opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` da instrução `CHANGE REPLICATION SOURCE TO` permite que uma réplica selecione sua própria política para verificações de chave primária. Quando a opção é definida como `ON` para um canal de replicação, a réplica sempre usa o valor `ON` para a variável do sistema `sql_require_primary_key` em operações de replicação, exigindo uma chave primária. Quando a opção é definida como `OFF`, a réplica sempre usa o valor `OFF` para a variável do sistema `sql_require_primary_key` em operações de replicação, de modo que uma chave primária nunca é necessária, mesmo que a fonte seja necessária. Quando a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` é definida como \[\[CO`STREAM`]], que é a opção padrão, a réplica usa o valor da fonte replicada para a transação. Com a configuração `ON` para cada canal de replicação, a réplica sempre usa o

- `sql_safe_updates`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>sql_safe_updates</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se esta variável estiver habilitada, as instruções `UPDATE` e `DELETE` que não usam uma chave na cláusula `WHERE` ou uma cláusula `LIMIT` produzem um erro. Isso torna possível capturar instruções `UPDATE` e `DELETE` onde as chaves não são usadas corretamente e que provavelmente alterariam ou excluiriam um grande número de linhas. O valor padrão é `OFF`.

Para o cliente `mysql`, `sql_safe_updates` pode ser ativado usando a opção `--safe-updates`. Para mais informações, consulte Usando o Modo de Atualizações Seguras (--safe-updates) ").

- `sql_select_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>sql_select_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr></tbody></table>

O número máximo de linhas a retornar das instruções `SELECT`. Para mais informações, consulte Using Safe-Updates Mode (--safe-updates) ").

O valor padrão para uma nova conexão é o número máximo de linhas que o servidor permite por tabela. Os valores padrão típicos são (232) -1 ou (264) -1. Se você alterou o limite, o valor padrão pode ser restaurado atribuindo um valor de `DEFAULT`.

Se um `SELECT` tem uma cláusula `LIMIT`, o `LIMIT` tem precedência sobre o valor de `sql_select_limit`.

- `sql_warnings`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>sql_warnings</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Esta variável controla se as instruções de linha única `INSERT` produzem uma string de informação se ocorrerem avisos. O padrão é `OFF`.

- `ssl_ca`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-ca=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ssl_ca</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

Nome do caminho para o ficheiro de certificado da autoridade de certificação (CA) no formato PEM. O ficheiro contém uma lista de autoridades de certificação SSL de confiança.

Esta variável pode ser modificada no tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após uma reinicialização se o valor da variável persistir.

- `ssl_capath`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-capath=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ssl_capath</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

O nome do caminho do diretório que contém os arquivos de certificado da Autoridade de Certificação SSL (CA) confiáveis no formato PEM. Você deve executar o OpenSSL `rehash` no diretório especificado por esta opção antes de usá-lo. Em sistemas Linux, você pode invocar `rehash` assim:

```
$> openssl rehash path/to/directory
```

Nas plataformas Windows, você pode usar o script `c_rehash` em um prompt de comando, assim:

```
\> c_rehash path/to/directory
```

Veja openssl-rehash para a sintaxe completa e outras informações.

Esta variável pode ser modificada no tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após uma reinicialização se o valor da variável persistir.

- `ssl_cert`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-cert=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ssl_cert</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

O nome do caminho do ficheiro de certificado de chave pública SSL do servidor no formato PEM.

Se o servidor é iniciado com o código `ssl_cert` definido para um certificado que usa qualquer cifra ou categoria de cifra restrita, o servidor inicia com o suporte para conexões criptografadas desativado.

Esta variável pode ser modificada no tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após uma reinicialização se o valor da variável persistir.

- `ssl_cipher`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-cipher=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ssl_cipher</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

A lista de códigos de criptografia permitidos para conexões que usam TLSv1.2. Se nenhuma cifra na lista for suportada, as conexões criptografadas que usam este protocolo TLS não funcionam.

A lista pode incluir qualquer um dos seguintes valores:

- `ECDHE-ECDSA-AES128-GCM-SHA256`
- `ECDHE-ECDSA-AES256-GCM-SHA384`
- `ECDHE-RSA-AES128-GCM-SHA256`
- `ECDHE-RSA-AES256-GCM-SHA384`
- `ECDHE-ECDSA-CHACHA20-POLY1305`
- `ECDHE-RSA-CHACHA20-POLY1305`
- `ECDHE-ECDSA-AES256-CCM`
- `ECDHE-ECDSA-AES128-CCM`
- `DHE-RSA-AES128-GCM-SHA256`
- `DHE-RSA-AES256-GCM-SHA384`
- `DHE-RSA-AES256-CCM`
- `DHE-RSA-AES128-CCM`
- `DHE-RSA-CHACHA20-POLY1305`

Tentar incluir quaisquer valores na lista de criptografia que não são mostrados aqui ao definir esta variável gera um erro (`ER_BLOCKED_CIPHER`).

Para maior portabilidade, a lista de cifras deve ser uma lista de um ou mais nomes de cifras, separados por dois pontos.

```
[mysqld]
ssl_cipher="DHE-RSA-AES128-GCM-SHA256:AES128-SHA"
```

O OpenSSL suporta a sintaxe para especificar as cifras descritas na documentação do OpenSSL em \[<https://www.openssl.org/docs/manmaster/man1/ciphers.html>]

Para obter informações sobre quais criptografias o MySQL suporta, consulte a Seção 8.3.2, Encrypted Connection TLS Protocols and Ciphers.

Esta variável pode ser modificada no tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após uma reinicialização se o valor da variável persistir.

- `ssl_crl`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-crl=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ssl_crl</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

Nome do caminho do ficheiro que contém listas de revogação de certificados no formato PEM.

Esta variável pode ser modificada no tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após uma reinicialização se o valor da variável persistir.

- `ssl_crlpath`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ssl_crlpath</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

O caminho do diretório que contém ficheiros de lista de revogação de certificados no formato PEM.

Esta variável pode ser modificada no tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após uma reinicialização se o valor da variável persistir.

- `ssl_fips_mode`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-fips-mode={OFF|ON|STRICT}</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ssl_fips_mode</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]] (ou 0)</p><p class="valid-value">[[<code>ON</code>]] (ou 1)</p><p class="valid-value">[[<code>STRICT</code>]] (ou 2)</p></td> </tr></tbody></table>

Controla se o modo FIPS deve ser habilitado no lado do servidor. A variável do sistema `ssl_fips_mode` difere de outras variáveis do sistema `ssl_xxx` na medida em que não é usada para controlar se o servidor permite conexões criptografadas, mas sim para afetar quais operações criptográficas são permitidas.

São permitidos os seguintes valores de \[`ssl_fips_mode`]:

- \[`OFF`]] (ou 0): Desativar o modo FIPS.
- \[`ON`]] (ou 1): Ativar o modo FIPS.
- \[`STRICT`]] (ou 2): Ativar o modo FIPS "estritamente".

::: info Note

Se o módulo de objeto OpenSSL FIPS não estiver disponível, o único valor permitido para `ssl_fips_mode` é `OFF`. Neste caso, definir `ssl_fips_mode` para `ON` ou `STRICT` no início faz com que o servidor produza uma mensagem de erro e saia.

:::

Esta opção é depreciada e feita somente para leitura. Espera-se que seja removida em uma versão futura do MySQL.

- `ssl_key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-key=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ssl_key</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

O nome do caminho do ficheiro de chave privada do servidor SSL no formato PEM. Para uma melhor segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

Se o arquivo de chave for protegido por uma senha, o servidor solicita ao usuário a senha. A senha deve ser dada interativamente; ela não pode ser armazenada em um arquivo. Se a senha for incorreta, o programa continua como se não pudesse ler a chave.

Esta variável pode ser modificada no tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após uma reinicialização se o valor da variável persistir.

- `ssl_session_cache_mode`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl_session_cache_mode={ON|OFF}</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ssl_session_cache_mode</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p></td> </tr></tbody></table>

Controla se deve habilitar o cache de sessão na memória do lado do servidor e a geração de tickets de sessão pelo servidor. O modo padrão é `ON` (abilitar o modo de cache de sessão). Uma alteração na variável do sistema `ssl_session_cache_mode` só tem efeito após a instrução `ALTER INSTANCE RELOAD TLS` ter sido executada, ou após uma reinicialização se o valor da variável persistir.

São permitidos os seguintes valores de \[`ssl_session_cache_mode`]:

- `ON`: Ativar o modo cache de sessão.
- `OFF`: Desativar o modo cache de sessão.

O servidor não anuncia seu suporte para a retomada da sessão se o valor desta variável do sistema for `OFF`. Quando executado no OpenSSL 1.0. `x` os tickets de sessão são sempre gerados, mas os tickets não são utilizáveis quando `ssl_session_cache_mode` está habilitado.

O valor atual em vigor para `ssl_session_cache_mode` pode ser observado com a variável de status `Ssl_session_cache_mode`.

- `ssl_session_cache_timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl_session_cache_timeout</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>ssl_session_cache_timeout</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>300</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>84600</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

Define um período de tempo durante o qual a reutilização de sessão anterior é permitida ao estabelecer uma nova conexão criptografada com o servidor, desde que a variável de sistema `ssl_session_cache_mode` esteja habilitada e os dados de sessão anterior estejam disponíveis. Se o tempo de sessão expirar, uma sessão não poderá mais ser reutilizada.

O valor padrão é de 300 segundos e o valor máximo é de 84600 (ou um dia em segundos). Uma alteração na variável do sistema `ssl_session_cache_timeout` só tem efeito após a instrução `ALTER INSTANCE RELOAD TLS` ter sido executada, ou após uma reinicialização se o valor da variável persistir. O valor atual em vigor para `ssl_session_cache_timeout` pode ser observado com a variável de status `Ssl_session_cache_timeout`.

- `statement_id`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>statement_id</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr></tbody></table>

Cada instrução executada na sessão atual recebe um número de sequência. Isso pode ser usado junto com a variável de sistema `session_track_system_variables` para identificar essa instrução em tabelas de esquema de desempenho, como a tabela `events_statements_history`.

- `stored_program_cache`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--stored-program-cache=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>stored_program_cache</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>16</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>524288</code>]]</td> </tr></tbody></table>

Define um limite superior suave para o número de rotinas armazenadas em cache por conexão. O valor desta variável é especificado em termos do número de rotinas armazenadas mantidas em cada um dos dois caches mantidos pelo MySQL Server para, respectivamente, procedimentos armazenados e funções armazenadas.

Sempre que uma rotina armazenada é executada, esse tamanho do cache é verificado antes que a primeira ou a instrução de nível superior na rotina seja analisada; se o número de rotinas do mesmo tipo (procedimentos armazenados ou funções armazenadas de acordo com as quais está sendo executado) exceder o limite especificado por esta variável, o cache correspondente é limpo e a memória previamente alocada para objetos em cache é liberada. Isso permite que o cache seja limpo com segurança, mesmo quando há dependências entre rotinas armazenadas.

O cache de procedimento armazenado e função armazenada existe em paralelo com a partição de cache de definição de programa armazenada do cache de objeto do dicionário. O cache de procedimento armazenado e função armazenada são por conexão, enquanto o cache de definição de programa armazenado é compartilhado. A existência de objetos no cache de procedimento armazenado e função armazenada não tem dependência da existência de objetos no cache de definição de programa armazenado e vice-versa.

- `stored_program_definition_cache`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--stored-program-definition-cache=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>stored_program_definition_cache</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>524288</code>]]</td> </tr></tbody></table>

Define um limite para o número de objetos de definição de programa armazenados, usados e não usados, que podem ser mantidos no cache de objetos do dicionário.

Os objetos de definição de programa armazenados não utilizados são mantidos no cache de objetos do dicionário apenas quando o número em uso é menor do que a capacidade definida por `stored_program_definition_cache`.

Uma configuração de 0 significa que os objetos de definição de programa armazenados são mantidos apenas no cache de objetos do dicionário enquanto estão em uso.

A partição de cache de definição de programa armazenada existe em paralelo com o cache de procedimento armazenado e função armazenada que são configurados usando a opção `stored_program_cache`.

A opção `stored_program_cache` define um limite superior suave para o número de procedimentos ou funções armazenados em cache por conexão, e o limite é verificado cada vez que uma conexão executa um procedimento ou função armazenada. A partição de cache de definição de programa armazenada, por outro lado, é um cache compartilhado que armazena objetos de definição de programa armazenados para outros fins. A existência de objetos na partição de cache de definição de programa armazenada não tem dependência da existência de objetos no procedimento de cache armazenado ou no cache de função armazenada, e vice-versa.

Para informações relacionadas, ver Secção 16.4, "Dictionary Object Cache".

- `super_read_only`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--super-read-only[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>super_read_only</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Se a variável de sistema `read_only` estiver habilitada, o servidor não permitirá atualizações de clientes, exceto de usuários que tenham o privilégio `CONNECTION_ADMIN` (ou o privilégio depreciado `SUPER`). Se a variável de sistema `super_read_only` também estiver habilitada, o servidor proibirá atualizações de clientes, mesmo de usuários que tenham `CONNECTION_ADMIN` ou `SUPER`. Veja a descrição da variável de sistema `read_only` para uma descrição do modo de somente leitura e informações sobre como interagem `read_only` e `super_read_only`.

As atualizações do cliente impedidas quando o `super_read_only` está habilitado incluem operações que não parecem necessariamente atualizações, como `CREATE FUNCTION` (para instalar uma função carregável), `INSTALL PLUGIN`, e `INSTALL COMPONENT`. Estas operações são proibidas porque envolvem alterações nas tabelas no `mysql` esquema do sistema.

Da mesma forma, se o Agendador de Eventos estiver ativado, ativar a variável do sistema `super_read_only` impede que ela atualize o evento last executed timestamps na tabela do dicionário de dados `events`. Isso faz com que o Agendador de Eventos pare na próxima vez que tentar executar um evento agendado, depois de escrever uma mensagem para o log de erro do servidor. (Nesta situação, a variável do sistema `event_scheduler` não muda de `ON` para `OFF`. Uma implicação é que esta variável rejeita a intenção do DBA de que o Agendador de Eventos seja ativado ou desativado, onde seu status real de início ou parada pode ser distinto.). Se o `super_read_only` for posteriormente desativado depois de ser ativado, o servidor reinicia automaticamente o Agendador conforme necessário.

Mudanças em `super_read_only` em um servidor de origem de replicação não são replicadas em servidores de réplica. O valor pode ser definido em uma réplica independente da configuração na fonte.

- `syseventlog.facility`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--syseventlog.facility=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>syseventlog.facility</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>daemon</code>]]</td> </tr></tbody></table>

A facilidade para a saída de log de erro escrita para `syslog` (que tipo de programa está enviando a mensagem). Esta variável não está disponível a menos que o componente de log de erro `log_sink_syseventlog` esteja instalado. Veja Seção 7.4.2.8, Error Logging to the System Log.

Os valores permitidos podem variar de acordo com o sistema operacional; consulte a documentação do seu sistema `syslog`.

Esta variável não existe no Windows.

- `syseventlog.include_pid`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--syseventlog.include-pid[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>syseventlog.include_pid</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Se o ID do processo do servidor deve ser incluído em cada linha de saída do log de erro escrito em `syslog`. Esta variável não está disponível a menos que o componente de log de erro `log_sink_syseventlog` esteja instalado. Veja Seção 7.4.2.8, Error Logging to the System Log.

Esta variável não existe no Windows.

- `syseventlog.tag`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--syseventlog.tag=tag</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>syseventlog.tag</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

A tag a ser adicionada ao identificador do servidor na saída do log de erro escrita em `syslog` ou no Windows Event Log. Esta variável não está disponível a menos que o componente de log de erro `log_sink_syseventlog` esteja instalado. Veja Seção 7.4.2.8, Error Logging to the System Log.

Por padrão, nenhuma tag é definida, de modo que o identificador do servidor é simplesmente `MySQL` no Windows, e `mysqld` em outras plataformas. Se um valor de tag de \* `tag` \* for especificado, ele é anexado ao identificador do servidor com um hífen inicial, resultando em um identificador `syslog` de `mysqld-tag` (ou `MySQL-tag` no Windows).

No Windows, para usar uma tag que ainda não existe, o servidor deve ser executado a partir de uma conta com privilégios de administrador, para permitir a criação de uma entrada de registro para a tag.

- `system_time_zone`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>system_time_zone</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O fuso horário do sistema do servidor. Quando o servidor começa a executar, ele herda uma configuração de fuso horário dos padrões da máquina, possivelmente modificada pelo ambiente da conta usada para executar o servidor ou o script de inicialização. O valor é usado para definir `system_time_zone`. Para especificar explicitamente o fuso horário do sistema, defina a variável de ambiente `TZ` ou use a opção `--timezone` do script **mysqld\_safe**.

Além da inicialização do tempo de inicialização, se o servidor host mudar o fuso horário (por exemplo, devido ao horário de verão), o `system_time_zone` reflete essa mudança, o que tem estas implicações para as aplicações:

- As consultas que fazem referência a `system_time_zone` receberão um valor antes de uma mudança de horário de verão e um valor diferente após a mudança.
- Para consultas que começam a ser executadas antes de uma mudança de horário de verão e terminam após a mudança, o `system_time_zone` permanece constante dentro da consulta porque o valor geralmente é armazenado em cache no início da execução.

A variável `system_time_zone` difere da variável `time_zone`. Embora possam ter o mesmo valor, a última variável é usada para inicializar o fuso horário para cada cliente que se conecta.

- `table_definition_cache`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--table-definition-cache=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>table_definition_cache</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>-1</code>]] (significa auto-dimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>400</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>524288</code>]]</td> </tr></tbody></table>

O número de definições de tabela que podem ser armazenadas no cache de definição de tabela. Se você usar um grande número de tabelas, você pode criar um grande cache de definição de tabela para acelerar a abertura de tabelas. O cache de definição de tabela ocupa menos espaço e não usa descritores de arquivo, ao contrário do cache de tabela normal. O valor mínimo é 400. O valor padrão é baseado na seguinte fórmula, com um limite de 2000:

```
MIN(400 + table_open_cache / 2, 2000)
```

Para `InnoDB`, a configuração `table_definition_cache` atua como um limite suave para o número de instâncias de tabela no cache de objetos do dicionário e o número de arquivos por tabela que podem ser abertos ao mesmo tempo.

Se o número de instâncias de tabela no cache de objetos do dicionário exceder o limite `table_definition_cache`, um mecanismo LRU começa a marcar instâncias de tabela para despejo e eventualmente as remove do cache de objetos do dicionário. O número de tabelas abertas com metadados armazenados em cache pode ser maior do que o limite `table_definition_cache` devido a instâncias de tabela com relações de chave estrangeira, que não são colocadas na lista LRU.

O número de tablespaces de arquivos por tabela que podem ser abertos de uma só vez é limitado pelas configurações `table_definition_cache` e `innodb_open_files`. Se ambas as variáveis estiverem definidas, a configuração mais alta é usada. Se nenhuma das variáveis estiver definida, a configuração `table_definition_cache`, que tem um valor padrão mais alto, é usada. Se o número de tablespaces abertos exceder o limite definido por `table_definition_cache` ou `innodb_open_files`, um mecanismo LRU pesquisa a lista LRU para arquivos de tablespaces que estão totalmente limpos e não estão sendo atualmente estendidos. Este processo é executado cada vez que um novo tablespace é aberto. Apenas os tablespaces inativos são fechados.

O cache de definição de tabela existe em paralelo com a partição de cache de definição de tabela do cache de objetos do dicionário. Ambos os caches armazenam definições de tabela, mas servem diferentes partes do servidor MySQL. Os objetos em um cache não têm dependência da existência de objetos no outro. Para mais informações, consulte a Seção 16.4, Cache de Objeto do Dicionário.

- `table_encryption_privilege_check`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--table-encryption-privilege-check[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>table_encryption_privilege_check</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Controla a verificação de privilégios `TABLE_ENCRYPTION_ADMIN` que ocorre ao criar ou alterar um esquema ou espaço de tabelas geral com criptografia que difere da configuração `default_table_encryption`, ou ao criar ou alterar uma tabela com uma configuração de criptografia que difere da criptografia de esquema padrão. A verificação é desativada por padrão.

A definição de `table_encryption_privilege_check` no tempo de execução requer o privilégio `SUPER`.

O `table_encryption_privilege_check` suporta a sintaxe `SET PERSIST` e `SET PERSIST_ONLY`.

Para mais informações, consulte Definir um padrão de criptografia para esquemas e espaços de tabelas gerais.

- `table_open_cache`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--table-open-cache=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>table_open_cache</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>4000</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>524288</code>]]</td> </tr></tbody></table>

O número de tabelas abertas para todos os tópicos. Aumentando este valor aumenta o número de descritores de arquivos que `mysqld` requer. O valor efetivo desta variável é o maior do valor efetivo de `open_files_limit` `- 10 -` o valor efetivo de `max_connections` `/ 2`, e 400; isto é

```
MAX(
    (open_files_limit - 10 - max_connections) / 2,
    400
   )
```

Você pode verificar se você precisa aumentar o cache da tabela verificando a variável de status `Opened_tables`. Se o valor de `Opened_tables` for grande e você não usar `FLUSH TABLES` frequentemente (o que apenas força todas as tabelas a serem fechadas e reabertas), então você deve aumentar o valor da variável `table_open_cache`.

- `table_open_cache_instances`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--table-open-cache-instances=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>table_open_cache_instances</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>16</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>64</code>]]</td> </tr></tbody></table>

O número de instâncias de cache de tabelas abertas. Para melhorar a escalabilidade, reduzindo a contenção entre as sessões, o cache de tabelas abertas pode ser particionado em várias instâncias de cache menores do tamanho `table_open_cache` / `table_open_cache_instances` . Uma sessão precisa bloquear apenas uma instância para acessá-la para instruções DML. Isso segmenta o acesso ao cache entre as instâncias, permitindo maior desempenho para operações que usam o cache quando há muitas sessões acessando tabelas.

Um valor de 8 ou 16 é recomendado em sistemas que rotineiramente usam 16 ou mais núcleos. No entanto, se você tiver muitos gatilhos grandes em suas tabelas que causam uma carga de memória alta, a configuração padrão para `table_open_cache_instances` pode levar ao uso excessivo de memória. Nessa situação, pode ser útil definir `table_open_cache_instances` em 1 para restringir o uso de memória.

- `tablespace_definition_cache`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tablespace-definition-cache=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>tablespace_definition_cache</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>256</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>524288</code>]]</td> </tr></tbody></table>

Define um limite para o número de objetos de definição de tablespace, usados e não usados, que podem ser mantidos no cache de objetos do dicionário.

Os objetos de definição de tablespace não utilizados só são mantidos no cache de objetos do dicionário quando o número em uso é menor do que a capacidade definida por `tablespace_definition_cache`.

Uma configuração de `0` significa que os objetos de definição de tablespace são mantidos apenas no cache de objetos do dicionário enquanto estão em uso.

Para mais informações, ver Secção 16.4, "Dictionary Object Cache".

- `temptable_max_mmap`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--temptable-max-mmap=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>temptable_max_mmap</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2^64-1</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

Define a quantidade máxima de memória (em bytes) que o mecanismo de armazenamento TempTable pode alocar a partir de arquivos temporários mapeados na memória antes de começar a armazenar dados em tabelas temporárias internas no disco. Uma configuração de 0 (padrão) desativa a alocação de memória a partir de arquivos temporários mapeados na memória.

Antes do MySQL 8.4, essa opção era definida em 1 GiB em vez de 0.

- `temptable_max_ram`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--temptable-max-ram=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>temptable_max_ram</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>3% of total memory: min 1 GB, max 4 GB</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>2097152</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2^64-1</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

Define a quantidade máxima de memória que pode ser ocupada pelo motor de armazenamento `TempTable` antes de começar a armazenar dados no disco. O valor padrão é 3% da memória total disponível no servidor, com um intervalo mínimo e máximo padrão de 1-4 GiB. Para mais informações, consulte a Seção 10.4.4, "Uso de tabela temporária interna no MySQL".

Antes do MySQL 8.4, o valor padrão era sempre 1 GiB.

- `temptable_use_mmap`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--temptable-use-mmap[={OFF|ON}]</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>temptable_use_mmap</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Define se o mecanismo de armazenamento TempTable aloca espaço para tabelas temporárias internas na memória como arquivos temporários mapeados na memória quando a quantidade de memória ocupada pelo mecanismo de armazenamento TempTable excede o limite definido pela variável `temptable_max_ram`. Quando `temptable_use_mmap` está desativado (padrão), o mecanismo de armazenamento TempTable usa tabelas temporárias internas `InnoDB` no disco. Para mais informações, consulte a Seção 10.4.4, Tabela de Uso Temporário Interno no MySQL.

- `thread_cache_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-cache-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_cache_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>-1</code>]] (significa auto-dimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>16384</code>]]</td> </tr></tbody></table>

Quantos threads o servidor deve armazenar em cache para reutilização. Quando um cliente se desconecta, os threads do cliente são colocados no cache se houver menos de `thread_cache_size` threads lá. As solicitações de threads são satisfeitas reutilizando threads tirados do cache, se possível, e apenas quando o cache está vazio é criado um novo thread. Esta variável pode ser aumentada para melhorar o desempenho se você tiver muitas novas conexões. Normalmente, isso não fornece uma melhoria notável de desempenho se você tiver uma boa implementação de thread. No entanto, se seu servidor vê centenas de conexões por segundo, você deve normalmente definir `thread_cache_size` alto o suficiente para que a maioria das novas conexões use threads armazenados em cache. Ao examinar a diferença entre as variáveis de status `Connections` e \[\[PH\_CODE\_CODE\_3]], você pode ver o quão eficiente é o thread no cache. Para detalhes, consulte a Seção 7.0,  Status Variables do servidor

O valor por defeito baseia-se na seguinte fórmula, com um limite máximo de 100:

```
8 + (max_connections / 100)
```

- `thread_handling`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-handling=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_handling</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>one-thread-per-connection</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>no-threads</code>]]</p><p class="valid-value">[[<code>one-thread-per-connection</code>]]</p><p class="valid-value">[[<code>loaded-dynamically</code>]]</p></td> </tr></tbody></table>

O modelo de processamento de threads usado pelo servidor para threads de conexão. Os valores permitidos são `no-threads` (o servidor usa um único thread para processar uma conexão), `one-thread-per-connection` (o servidor usa um thread para processar cada conexão do cliente) e `loaded-dynamically` (definido pelo plugin do pool de threads quando inicializa). `no-threads` é útil para depuração no Linux; veja Seção 7.9, Debugging MySQL.

- `thread_pool_algorithm`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-pool-algorithm=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_pool_algorithm</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>

Esta variável controla o algoritmo que o plugin do pool de tópicos usa:

- `0`: Use um algoritmo conservador de baixa coincidência.
- `1`: Use um algoritmo agressivo de alta moeda que tenha melhor desempenho com contagens ótimas de threads, mas o desempenho pode ser degradado se o número de conexões atingir valores extremamente altos.

Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado.

- `thread_pool_dedicated_listeners`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-pool-dedicated-listeners</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_pool_dedicated_listeners</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Dedica um thread de ouvinte em cada grupo de threads para ouvir instruções de entrada de conexões atribuídas ao grupo.

- `OFF`: (padrão) Desativa tópicos de ouvinte dedicados.
- `ON`: Dedica um thread de escuta em cada grupo de threads para ouvir instruções de entrada de conexões atribuídas ao grupo.

A habilitação de `thread_pool_dedicated_listeners` só é útil quando um limite de transação é definido por `thread_pool_max_transactions_limit`. Caso contrário, `thread_pool_dedicated_listeners` não deve ser ativado.

Esta variável está disponível apenas com o MySQL Enterprise Edition, e não é suportado no MySQL 8.4.

- `thread_pool_high_priority_connection`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-pool-high-priority-connection=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_pool_high_priority_connection</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>

Esta variável afeta a fila de novas instruções antes da execução. Se o valor for 0 (falso, o padrão), a fila de instruções usa as filas de baixa prioridade e de alta prioridade. Se o valor for 1 (verdadeiro), as instruções em fila sempre vão para a fila de alta prioridade.

Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado.

- `thread_pool_longrun_trx_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-pool-longrun-trx-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_pool_longrun_trx_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>2000</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>10</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>60*60*24</code>]]</td> </tr><tr><th>Unidade</th> <td>m.s.</td> </tr></tbody></table>

Quando `thread_pool_max_transactions_limit` está em uso, há um número máximo de transações que podem estar ativas em cada grupo de tópicos. Se o número inteiro disponível estiver sendo usado por transações de longa duração, qualquer transação adicional atribuída ao grupo será bloqueada até que uma das transações de longa duração seja concluída, o que os usuários podem perceber como um impasse inexplicável.

Para mitigar este problema, o limite para um determinado grupo de threads é suspenso se todos os threads que usam o máximo de transações estiverem sendo executados por mais tempo do que o intervalo (em milissegundos) especificado por `thread_pool_longrun_trx_limit`. Quando o número de transações de longa duração diminui, `thread_pool_max_transactions_limit` pode ser (e é) ativado novamente. Para que isso aconteça, o número de transações em andamento deve ser menor que `thread_pool_max_transactions_limit / 2` para o intervalo definido como mostrado:

```
MIN( MAX(thread_pool_longrun_trx_limit * 15, 5000), 30000)
```

Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado.

- `thread_pool_max_active_query_threads`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-pool-max-active-query-threads</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_pool_max_active_query_threads</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>512</code>]]</td> </tr></tbody></table>

O número máximo permitido de threads de consulta ativos (em execução) por grupo. Se o valor for 0, o plugin do pool de threads usa até o máximo de threads disponíveis.

Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado.

- `thread_pool_max_transactions_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-pool-max-transactions-limit</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_pool_max_transactions_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>1000000</code>]]</td> </tr></tbody></table>

O número máximo de transações permitidas pelo plugin do pool de threads. Definir um limite de transação liga um thread a uma transação até que ele seja comprometido, o que ajuda a estabilizar o throughput durante alta concurrencia.

O valor padrão de 0 significa que não há limite de transação. A variável é dinâmica, mas não pode ser alterada de 0 para um valor maior no tempo de execução e vice-versa. Um valor diferente de zero no início permite a configuração dinâmica no tempo de execução. O privilégio `CONNECTION_ADMIN` é necessário para configurar `thread_pool_max_transactions_limit` no tempo de execução.

Quando você define um limite de transação, ativando `thread_pool_dedicated_listeners` cria um thread dedicado de ouvinte em cada grupo de threads. O thread dedicado de ouvinte adicional consome mais recursos e afeta o desempenho do pool de threads. `thread_pool_dedicated_listeners` deve, portanto, ser usado com cautela.

Quando o limite definido por `thread_pool_max_transactions_limit` é atingido, novas conexões ou transações em conexões existentes podem parecer penduradas até que uma ou mais transações existentes sejam concluídas. Deve ser possível, em muitos casos, atenuar esse problema definindo `thread_pool_longrun_trx_limit` de modo que o máximo de transações possa ser relaxado quando o número de transações em andamento coincide com ele por um determinado período de tempo. Se as conexões existentes continuarem bloqueadas ou de longa duração mesmo depois de tentar isso, uma conexão privilegiada pode ser necessária para acessar o servidor para aumentar o limite, remover o limite ou matar transações em execução.

Esta variável está disponível apenas com o MySQL Enterprise Edition, e não é suportado no MySQL 8.4.

- `thread_pool_max_unused_threads`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-pool-max-unused-threads=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_pool_max_unused_threads</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>

O número máximo permitido de threads não utilizados no pool de threads. Esta variável permite limitar a quantidade de memória usada por threads em repouso.

Um valor de 0 (o padrão) significa que não há limite para o número de threads em repouso. Um valor de `N` onde `N` é maior que 0 significa 1 thread de consumo e `N`−1 threads de reserva. Neste caso, se um thread está pronto para dormir, mas o número de threads em repouso já está no máximo, o thread sai em vez de ir para o sono.

Um thread adormecido está adormecido como um thread consumidor ou um thread de reserva. O pool de threads permite que um thread seja o thread consumidor quando adormecido. Se um thread for adormecido e não houver nenhum thread consumidor existente, ele adormece como um thread consumidor. Quando um thread deve ser despertado, um thread consumidor é selecionado se houver um. Um thread de reserva é selecionado apenas quando não há nenhum thread consumidor para ser despertado.

Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado.

- `thread_pool_prio_kickup_timer`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-pool-prio-kickup-timer=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_pool_prio_kickup_timer</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1000</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967294</code>]]</td> </tr><tr><th>Unidade</th> <td>milissegundos</td> </tr></tbody></table>

Esta variável afeta as instruções que aguardam execução na fila de baixa prioridade. O valor é o número de milissegundos antes de uma instrução de espera ser movida para a fila de alta prioridade. O padrão é 1000 (1 segundo).

Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado.

- `thread_pool_query_threads_per_group`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-pool-query-threads-per-group</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_pool_query_threads_per_group</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4096</code>]]</td> </tr></tbody></table>

O número máximo de tópicos de consulta permitidos em um grupo de tópicos. O valor máximo é 4096, mas se `thread_pool_max_transactions_limit` for definido, `thread_pool_query_threads_per_group` não deve exceder esse valor.

O valor padrão de 1 significa que há um thread de consulta ativo em cada grupo de threads, o que funciona bem para muitos carregamentos.

O privilégio `CONNECTION_ADMIN` é necessário para configurar `thread_pool_query_threads_per_group` no tempo de execução.

Se você diminuir o valor de `thread_pool_query_threads_per_group` no tempo de execução, os tópicos que estão executando consultas de usuários são permitidos para completar, em seguida, movido para o pool de reserva ou terminado. se você aumentar o valor no tempo de execução e o grupo de tópicos precisa de mais tópicos, estes são retirados do pool de reserva, se possível, caso contrário, eles são criados.

Esta variável está disponível apenas com o MySQL Enterprise Edition, e não é suportado no MySQL 8.4.

- `thread_pool_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-pool-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_pool_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>16</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>512</code>]]</td> </tr></tbody></table>

O número de grupos de threads no pool de threads. Este é o parâmetro mais importante que controla o desempenho do pool de threads. Ele afeta quantas instruções podem ser executadas simultaneamente. Se um valor fora do intervalo de valores permitidos for especificado, o plugin do pool de threads não será carregado e o servidor escreverá uma mensagem para o log de erros.

Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado.

- `thread_pool_stall_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-pool-stall-limit=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_pool_stall_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>6</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>4</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>600</code>]]</td> </tr><tr><th>Unidade</th> <td>milissegundos * 10</td> </tr></tbody></table>

Esta variável afeta a execução de instruções. O valor é a quantidade de tempo que uma instrução tem que terminar depois de começar a ser executada antes de ser definida como estagnada, momento em que o grupo de tópicos permite que o grupo de tópicos comece a executar outra instrução. O valor é medido em unidades de 10 milissegundos, então o padrão de 6 significa 60ms. Valores de espera curtos permitem que os tópicos sejam iniciados mais rapidamente. Valores de espera curtos também são melhores para evitar situações de impasse. Valores de espera longa são úteis para cargas de trabalho que incluem instruções de execução longa, para evitar iniciar muitas novas instruções enquanto as atuais são executadas.

Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado.

- `thread_pool_transaction_delay`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-pool-transaction-delay</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_pool_transaction_delay</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>300000</code>]]</td> </tr></tbody></table>

O período de atraso antes da execução de uma nova transacção, em milissegundos.

Um atraso de transação pode ser usado em casos em que transações paralelas afetam o desempenho de outras operações devido à contenção de recursos. Por exemplo, se transações paralelas afetam a criação de índice ou uma operação de redimensionamento de pool de buffer on-line, você pode configurar um atraso de transação para reduzir a contenção de recursos enquanto essas operações estão sendo executadas.

Os threads de trabalho ficam em repouso pelo número de milissegundos especificado por \[`thread_pool_transaction_delay`]] antes de executar uma nova transação.

A configuração `thread_pool_transaction_delay` não afeta consultas emitidas a partir de uma conexão privilegiada (uma conexão atribuída ao grupo de threads `Admin`).

- `thread_stack`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--thread-stack=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>thread_stack</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1048576</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>131072</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td>[[<code>18446744073709550592</code>]]</td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td>[[<code>4294966272</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

O tamanho da pilha para cada thread. O padrão é grande o suficiente para a operação normal. Se o tamanho da pilha de threads é muito pequeno, ele limita a complexidade das instruções SQL que o servidor pode lidar, a profundidade de recursão de procedimentos armazenados e outras ações que consomem memória.

- `time_zone`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>time_zone</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>SYSTEM</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>-13:59</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>+14:00</code>]]</td> </tr></tbody></table>

O fuso horário atual. Esta variável é usada para inicializar o fuso horário para cada cliente que se conecta. Por padrão, o valor inicial é `'SYSTEM'` (o que significa, use the value of `system_time_zone`). O valor pode ser especificado explicitamente na inicialização do servidor com a opção `--default-time-zone`.

::: info Note

Se definido como `SYSTEM`, cada chamada de função MySQL que requer um cálculo de fuso horário faz uma chamada de biblioteca do sistema para determinar o fuso horário atual do sistema. Esta chamada pode ser protegida por um mutex global, resultando em contenção.

:::

- `timestamp`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>timestamp</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>UNIX_TIMESTAMP()</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>2147483647</code>]]</td> </tr></tbody></table>

Estabeleça a hora para este cliente. Isso é usado para obter o carimbo original se você usar o log binário para restaurar linhas. \* `timestamp_value`\* deve ser um carimbo de época do Unix (um valor como o retornado por `UNIX_TIMESTAMP()`, não um valor no formato `'YYYY-MM-DD hh:mm:ss'`) ou `DEFAULT`.

A definição de `timestamp` para um valor constante faz com que ele mantenha esse valor até que seja alterado novamente. A definição de `timestamp` para `DEFAULT` faz com que seu valor seja a data e hora atuais a partir do momento em que é acessado.

O valor máximo corresponde ao `'2038-01-19 03:14:07'` UTC, o mesmo que para o tipo de dados `TIMESTAMP`.

O servidor pode ser iniciado com a opção `--sysdate-is-now` para fazer com que `SYSDATE()` seja um sinônimo de `NOW()`, caso em que `SET timestamp` afeta ambas as funções.

- `tls_certificates_enforced_validation`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-certificates-enforced-validation[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>tls_certificates_enforced_validation</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Durante a inicialização, o servidor garante que a localização de cada arquivo de certificado SSL necessário esteja presente no diretório de dados padrão se os locais de arquivo não forem dados na linha de comando. No entanto, o servidor não valida os arquivos de certificado e, como resultado, é capaz de iniciar com um certificado inválido. A variável do sistema `tls_certificates_enforced_validation` controla se a validação do certificado é executada na inicialização. A descoberta de um certificado inválido interrompe a execução de inicialização quando a execução de validação é ativada. Por padrão, a execução de validação do certificado é desativada (`OFF`).

A aplicação da validação pode ser habilitada especificando a opção `--tls-certificates-enforced-validation` na linha de comando com ou sem o valor `ON`. Com a aplicação da validação habilitada, os certificados também são validados no momento de recarregá-los através da instrução `ALTER INSTANCE RELOAD TLS`. Esta variável do sistema não pode ser persistente em reinicializações. Para mais informações, consulte Configurando a aplicação da validação de certificados.

- `tls_ciphersuites`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-ciphersuites=ciphersuite_list</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>tls_ciphersuites</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

Qual ciphersuite o servidor permite para conexões criptografadas que usam TLSv1.3. O valor é uma lista de zero ou mais nomes de ciphersuite separados por pontos entre os listados aqui:

- `TLS_AES_128_GCM_SHA256`
- `TLS_AES_256_GCM_SHA384`
- `TLS_CHACHA20_POLY1305_SHA256`
- `TLS_AES_128_CCM_SHA256`

Tentar incluir quaisquer valores na lista de criptografia que não são mostrados aqui ao definir esta variável gera um erro (`ER_BLOCKED_CIPHER`).

Se esta variável não for definida, seu valor padrão é `NULL`, o que significa que o servidor permite o conjunto padrão de ciphersuites. Se a variável for definida na string vazia, nenhum ciphersuites será habilitado e conexões criptografadas não poderão ser estabelecidas.

- `tls_version`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-version=protocol_list</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>tls_version</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>TLSv1.2,TLSv1.3</code>]]</td> </tr></tbody></table>

Quais protocolos o servidor permite para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula, que não são sensíveis a maiúsculas e minúsculas. Os protocolos que podem ser nomeados para esta variável dependem da biblioteca SSL usada para compilar o MySQL. Os protocolos permitidos devem ser escolhidos de modo a não deixar  buracos na lista. Para detalhes, consulte a Seção 8.3.2,  Protocolos e Cifras de Conexão Criptografada TLS.

Esta variável pode ser modificada no tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões.

Importância

- O MySQL 8.4 não suporta os protocolos de conexão TLSv1 e TLSv1.
- O suporte para o protocolo TLSv1.3 está disponível no MySQL 8.4, desde que o MySQL Server tenha sido compilado usando o OpenSSL 1.1.1 ou superior. O servidor verifica a versão do OpenSSL na inicialização e, se for inferior a 1.1.1, o TLSv1.3 é removido do valor padrão para a variável do sistema. Nesse caso, o padrão é `TLSv1.2`.

Definir esta variável para uma string vazia desativa conexões criptografadas.

- `tmp_table_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tmp-table-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>tmp_table_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>16777216</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr></tbody></table>

Define o tamanho máximo de tabelas temporárias internas na memória criadas pelos motores de armazenamento `MEMORY` e `TempTable`. Se uma tabela temporária interna na memória exceder esse tamanho, ela é automaticamente convertida em uma tabela temporária interna no disco.

A variável `tmp_table_size` não se aplica às tabelas `MEMORY` criadas pelo usuário.

Ao usar o motor de armazenamento `MEMORY` para tabelas temporárias de memória interna, o limite de tamanho real é o menor de `tmp_table_size` e `max_heap_table_size`.

Aumente o valor de `tmp_table_size` (e `max_heap_table_size` se necessário ao usar o motor de armazenamento `MEMORY` para tabelas temporárias internas de memória) se você fizer muitas consultas `GROUP BY` avançadas e tiver muita memória.

Você pode comparar o número de tabelas temporárias internas no disco criadas com o número total de tabelas temporárias internas criadas comparando os valores `Created_tmp_disk_tables` e `Created_tmp_tables`.

Ver também a secção 10.4.4, "Utilização de tabelas temporárias internas no MySQL".

- `tmpdir`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tmpdir=dir_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>tmpdir</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O caminho do diretório a ser usado para criar arquivos temporários. Pode ser útil se o seu diretório padrão `/tmp` residir em uma partição que é muito pequena para armazenar tabelas temporárias. Esta variável pode ser definida como uma lista de vários caminhos que são usados de forma round-robin. Os caminhos devem ser separados por caracteres de colon (`:`) no Unix e caracteres de ponto e vírgula (`;`) no Windows.

O `tmpdir` pode ser um local não-permanente, como um diretório em um sistema de arquivos baseado em memória ou um diretório que é limpo quando o host do servidor é reiniciado. Se o servidor MySQL está agindo como uma réplica, e você está usando um local não-permanente para o `tmpdir`, considere definir um diretório temporário diferente para a réplica usando a variável `replica_load_tmpdir`. Para uma réplica, os arquivos temporários usados para replicar as instruções `LOAD DATA` são armazenados neste diretório, então com um local permanente eles podem sobreviver às reinicializações da máquina, embora a replicação possa continuar após uma reinicialização se os arquivos temporários forem removidos.

Para mais informações sobre o local de armazenamento dos ficheiros temporários, ver Secção B.3.3.5, "Onde o MySQL armazena ficheiros temporários".

- `transaction_alloc_block_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--transaction-alloc-block-size=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>transaction_alloc_block_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>8192</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>131072</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

A quantidade em bytes para aumentar um pool de memória por transação que precisa de memória. Veja a descrição de `transaction_prealloc_size`.

- `transaction_isolation`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--transaction-isolation=name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>transaction_isolation</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>REPEATABLE-READ</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>READ-UNCOMMITTED</code>]]</p><p class="valid-value">[[<code>READ-COMMITTED</code>]]</p><p class="valid-value">[[<code>REPEATABLE-READ</code>]]</p><p class="valid-value">[[<code>SERIALIZABLE</code>]]</p></td> </tr></tbody></table>

O nível de isolamento da transação. O padrão é `REPEATABLE-READ`.

O nível de isolamento de transação tem três escopo: global, sessão e próxima transação.

Para definir o nível de isolamento de transação global na inicialização, use a opção do servidor `--transaction-isolation`.

No tempo de execução, o nível de isolamento pode ser definido diretamente usando a instrução `SET` para atribuir um valor à variável do sistema `transaction_isolation`, ou indiretamente usando a instrução `SET TRANSACTION`. Se você definir `transaction_isolation` diretamente para um nome de nível de isolamento que contém um espaço, o nome deve ser encerrado entre aspas, com o espaço substituído por um traço. Por exemplo, use esta instrução `SET` para definir o valor global:

```
SET GLOBAL transaction_isolation = 'READ-COMMITTED';
```

A definição do valor global `transaction_isolation` define o nível de isolamento para todas as sessões subsequentes. As sessões existentes não são afetadas.

Para definir o valor da sessão ou do nível seguinte, use a instrução `SET`. Para a maioria das variáveis do sistema de sessão, essas instruções são maneiras equivalentes de definir o valor:

```
SET @@SESSION.var_name = value;
SET SESSION var_name = value;
SET var_name = value;
SET @@var_name = value;
```

Como mencionado anteriormente, o nível de isolamento de transação tem um escopo de transação seguinte, além dos escopos global e de sessão. Para permitir que o escopo de transação seguinte seja definido, a sintaxe `SET` para atribuir valores de variáveis do sistema de sessão tem semântica não padrão para `transaction_isolation`:

- Para definir o nível de isolamento da sessão, use qualquer uma destas sintaxes:

  ```
  SET @@SESSION.transaction_isolation = value;
  SET SESSION transaction_isolation = value;
  SET transaction_isolation = value;
  ```

  Para cada uma dessas sintaxes, aplica-se a seguinte semântica:

  - Define o nível de isolamento para todas as transacções subsequentes realizadas no decurso da sessão.
  - Permitido no âmbito de transacções, mas não afecta a transacção em curso.
  - Se executado entre transações, anula qualquer instrução anterior que defina o nível de isolamento da próxima transação.
  - Corresponde a `SET SESSION TRANSACTION ISOLATION LEVEL` (com a palavra-chave `SESSION`).
- Para definir o nível de isolamento da próxima transação, use a seguinte sintaxe:

  ```
  SET @@transaction_isolation = value;
  ```

  Para essa sintaxe, aplica-se a seguinte semântica:

  - Estabelece o nível de isolamento apenas para a próxima transação única realizada dentro da sessão.
  - As transacções subsequentes regressam ao nível de isolamento da sessão.
  - Não é permitido nas transacções.
  - Corresponde a `SET TRANSACTION ISOLATION LEVEL` (sem a palavra-chave `SESSION`).

Para obter mais informações sobre o `SET TRANSACTION` e a sua relação com a variável do sistema `transaction_isolation`, consulte a secção 15.3.7, DECLARAÇÃO DE TRANSAÇÃO DE SET.

- `transaction_prealloc_size`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--transaction-prealloc-size=#</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>transaction_prealloc_size</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>4096</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1024</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>131072</code>]]</td> </tr><tr><th>Unidade</th> <td>bytes (byte)</td> </tr><tr><th>Tamanho do bloco</th> <td>[[<code>1024</code>]]</td> </tr></tbody></table>

Há um pool de memória por transação do qual várias alocações relacionadas a transações tomam memória. O tamanho inicial do pool em bytes é `transaction_prealloc_size`. Para cada alocação que não pode ser satisfeita a partir do pool porque não tem memória suficiente disponível, o pool é aumentado em `transaction_alloc_block_size` bytes. Quando a transação termina, o pool é truncado em `transaction_prealloc_size` bytes. Ao tornar `transaction_prealloc_size` suficientemente grande para conter todas as instruções dentro de uma única transação, você pode evitar muitas chamadas `malloc()`.

\[`transaction_prealloc_size`]] está desatualizado, e a definição desta variável não tem mais qualquer efeito.

- `transaction_read_only`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--transaction-read-only[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>transaction_read_only</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

O modo de acesso à transação. O valor pode ser `OFF` (ler/escrever; o padrão) ou `ON` (ler apenas).

O modo de acesso de transação tem três escopos: global, sessão e próxima transação.

Para configurar o modo de acesso à transação global na inicialização, use a opção do servidor `--transaction-read-only`.

No tempo de execução, o modo de acesso pode ser definido diretamente usando a instrução `SET` para atribuir um valor à variável do sistema `transaction_read_only`, ou indiretamente usando a instrução `SET TRANSACTION`. Por exemplo, use esta instrução `SET` para definir o valor global:

```
SET GLOBAL transaction_read_only = ON;
```

A definição do valor global `transaction_read_only` define o modo de acesso para todas as sessões subsequentes. As sessões existentes não são afetadas.

Para definir o valor da sessão ou do nível seguinte, use a instrução `SET`. Para a maioria das variáveis do sistema de sessão, essas instruções são maneiras equivalentes de definir o valor:

```
SET @@SESSION.var_name = value;
SET SESSION var_name = value;
SET var_name = value;
SET @@var_name = value;
```

Como mencionado anteriormente, o modo de acesso à transação tem um escopo de transação seguinte, além dos escopos global e de sessão. Para permitir que o escopo de transação seguinte seja definido, a sintaxe `SET` para atribuir valores de variáveis do sistema de sessão tem semântica não padrão para `transaction_read_only`,

- Para definir o modo de acesso à sessão, use qualquer uma destas sintaxes:

  ```
  SET @@SESSION.transaction_read_only = value;
  SET SESSION transaction_read_only = value;
  SET transaction_read_only = value;
  ```

  Para cada uma dessas sintaxes, aplica-se a seguinte semântica:

  - Define o modo de acesso para todas as transacções subsequentes realizadas na sessão.
  - Permitido no âmbito de transacções, mas não afecta a transacção em curso.
  - Se executado entre transações, anula qualquer instrução anterior que defina o modo de acesso da próxima transação.
  - Corresponde a `SET SESSION TRANSACTION {READ WRITE | READ ONLY}` (com a palavra-chave `SESSION`).
- Para definir o modo de acesso à próxima transação, use esta sintaxe:

  ```
  SET @@transaction_read_only = value;
  ```

  Para essa sintaxe, aplica-se a seguinte semântica:

  - Estabelece o modo de acesso apenas para a próxima transacção única executada na sessão.
  - As transacções subsequentes regressam ao modo de acesso de sessão.
  - Não é permitido nas transacções.
  - Corresponde a `SET TRANSACTION {READ WRITE | READ ONLY}` (sem a palavra-chave `SESSION`).

Para obter mais informações sobre o `SET TRANSACTION` e a sua relação com a variável do sistema `transaction_read_only`, consulte a secção 15.3.7, DECLARAÇÃO DE TRANSAÇÃO DE SET.

- `unique_checks`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>unique_checks</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Se definido em 1 (o padrão), verificações de unicidade para índices secundários em tabelas \[`InnoDB`] são realizadas. Se definido em 0, os motores de armazenamento são autorizados a assumir que chaves duplicadas não estão presentes nos dados de entrada. Se você sabe com certeza que seus dados não contêm violações de unicidade, você pode definir isso em 0 para acelerar as importações de grandes tabelas para \[`InnoDB`].

Definir esta variável em 0 não *exige* que os motores de armazenamento ignorem chaves duplicadas. Um motor ainda pode verificar se há e emitir erros de chaves duplicadas se as detectar.

- `updatable_views_with_limit`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--updatable-views-with-limit[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>updatable_views_with_limit</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>1</code>]]</td> </tr></tbody></table>

Esta variável controla se as atualizações de um modo de exibição podem ser feitas quando o modo de exibição não contém todas as colunas da chave primária definida na tabela subjacente, se a instrução de atualização contém uma cláusula `LIMIT`. (Tais atualizações são geralmente geradas por ferramentas GUI.) Uma atualização é uma instrução `UPDATE` ou `DELETE`.

A variável pode ter dois valores:

- `1` ou `YES`: Emite apenas um aviso (não uma mensagem de erro). Este é o valor padrão.
- `0` ou `NO`: Proibir a atualização.

* `use_secondary_engine`

Para uso com o MySQL HeatWave apenas. Veja Variaveis do Sistema, para mais informações.

- `validate_password.xxx`

  O componente `validate_password` implementa um conjunto de variáveis do sistema com nomes da forma `validate_password.xxx`.
- `version`

O número de versão para o servidor. O valor também pode incluir um sufixo indicando construção do servidor ou informações de configuração. `-debug` indica que o servidor foi construído com suporte de depuração habilitado.

- `version_comment`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>version_comment</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O programa de configuração **CMake** tem uma opção `COMPILATION_COMMENT_SERVER` que permite que um comentário seja especificado ao construir o MySQL. Esta variável contém o valor desse comentário.

- `version_compile_machine`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>version_compile_machine</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O tipo de servidor binário.

- `version_compile_os`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>version_compile_os</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O tipo de sistema operacional em que o MySQL foi construído.

- `version_compile_zlib`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code>version_compile_zlib</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Globalmente</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A versão da biblioteca `zlib` compilada.

- `wait_timeout`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--wait-timeout=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>wait_timeout</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>28800</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor máximo (Windows)</th> <td>[[<code>2147483</code>]]</td> </tr><tr><th>Valor máximo (outros)</th> <td>[[<code>31536000</code>]]</td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

O número de segundos em que o servidor aguarda atividade numa ligação não interativa antes de a fechar.

No início do thread, o valor da sessão `wait_timeout` é inicializado a partir do valor global `wait_timeout` ou do valor global `interactive_timeout`, dependendo do tipo de cliente (conforme definido pela opção `CLIENT_INTERACTIVE` conectar-se a `mysql_real_connect()`).

- `warning_count`

Número de erros, avisos e notas resultantes da última instrução que gerou mensagens. Esta variável é apenas de leitura.

- `windowing_use_high_precision`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--windowing-use-high-precision[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>windowing_use_high_precision</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Se as operações de janela devem ser calculadas sem perda de precisão, ver ponto 10.2.1.21, "Otimização da função de janela".

- `xa_detach_on_prepare`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--xa-detach-on-prepare[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>xa_detach_on_prepare</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

Quando definido para \[`ON`] (abilitado), todas as transações XA são desligadas (desconectadas) da conexão (sessão) como parte de \[`XA PREPARE`]. Isso significa que a transação XA pode ser comprometida ou revertida por outra conexão, mesmo que a conexão de origem não tenha terminado, e essa conexão pode iniciar novas transações.

As tabelas temporárias não podem ser utilizadas no interior de transacções XA separadas.

Quando este é `OFF` (desativado), uma transação XA é estritamente associada à mesma conexão até que a sessão se desconecte. É recomendado que você permita que ela seja habilitada (o comportamento padrão) para replicação.

Para mais informações, ver secção 15.3.8.2, Estados da transacção XA.
