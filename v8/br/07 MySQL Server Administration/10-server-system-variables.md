### 7.1.8 Variáveis do Sistema do Servidor

O servidor MySQL mantém muitas variáveis de sistema que afetam sua operação. A maioria das variáveis de sistema pode ser definida na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções. A maioria delas pode ser alterada dinamicamente durante a execução usando a instrução `SET`, o que permite modificar a operação do servidor sem precisar pará-lo e reiniciá-lo. Algumas variáveis são somente de leitura, e seus valores são determinados pelo ambiente do sistema, pela maneira como o MySQL está instalado no sistema ou, possivelmente, pelas opções usadas para compilar o MySQL. A maioria das variáveis de sistema tem um valor padrão, mas há exceções, incluindo variáveis somente de leitura. Você também pode usar os valores das variáveis de sistema em expressões.

Definir o valor de uma variável de sistema global durante a execução normalmente requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`). Definir o valor de uma variável de sistema de sessão durante a execução normalmente não requer privilégios especiais e pode ser feito por qualquer usuário, embora haja exceções. Para mais informações, consulte a Seção 7.1.9.1, “Privilégios das Variáveis de Sistema”.

Existem várias maneiras de ver os nomes e valores das variáveis de sistema:

* Para ver os valores que um servidor usa com base em seus valores padrão compilados e em quaisquer arquivos de opções que ele lê, use este comando:

  ```
  mysqld --verbose --help
  ```
* Para ver os valores que um servidor usa com base apenas em seus valores padrão compilados, ignorando as configurações em quaisquer arquivos de opções, use este comando:

  ```
  mysqld --no-defaults --verbose --help
  ```
* Para ver os valores atuais usados por um servidor em execução, use a instrução `SHOW VARIABLES` ou as tabelas de variáveis de sistema do Performance Schema. Consulte a Seção 29.12.14, “Tabelas de Variáveis de Sistema do Performance Schema”.

Esta seção fornece uma descrição de cada variável de sistema. Para uma tabela de resumo das variáveis de sistema, consulte a Seção 7.1.5, “Referência das Variáveis de Sistema do Servidor”. Para mais informações sobre a manipulação das variáveis de sistema, consulte a Seção 7.1.9, “Usando Variáveis de Sistema”.

Para informações adicionais sobre variáveis de sistema, consulte estas seções:

*  Seção 7.1.9, “Usando Variáveis de Sistema”, discute a sintaxe para definir e exibir os valores das variáveis de sistema.
*  Seção 7.1.9.2, “Variáveis de Sistema Dinâmicas”, lista as variáveis que podem ser definidas em tempo de execução.
* Informações sobre o ajuste das variáveis de sistema podem ser encontradas na Seção 7.1.1, “Configurando o Servidor”.
*  Seção 17.14, “Opções de Inicialização do InnoDB e Variáveis de Sistema”, lista as variáveis de sistema `InnoDB`.
*  Seção 25.4.3.9.2, “Variáveis de Sistema de NDB Cluster”, lista as variáveis de sistema específicas para o NDB Cluster.
* Para informações sobre variáveis de sistema do servidor específicas para replicação, consulte  Seção 19.1.6, “Opções e Variáveis de Registro Binário de Replicação”.

::: info Nota

Algumas das descrições de variáveis a seguir referem-se a “ativar” ou “desativar” uma variável. Essas variáveis podem ser ativadas com a instrução `SET` definindo-as para `ON` ou `1`, ou desativadas definindo-as para `OFF` ou `0`. Variáveis booleanas podem ser definidas no início para os valores `ON`, `TRUE`, `OFF` e `FALSE` (não case-sensitive), bem como `1` e `0`. Veja  Seção 6.2.2.4, “Modificadores de Opção do Programa”.

:::

Algumas variáveis de sistema controlam o tamanho dos buffers ou caches. Para um buffer dado, o servidor pode precisar alocar estruturas de dados internas. Essas estruturas são tipicamente alocadas a partir da memória total alocada ao buffer, e a quantidade de espaço necessária pode ser dependente da plataforma. Isso significa que, quando você atribui um valor a uma variável de sistema que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor que o valor atribuído. Também é possível que o servidor ajuste um valor para cima. Por exemplo, se você atribuir um valor de 0 a uma variável para a qual o valor mínimo é 1024, o servidor define o valor para 1024.

Os valores para tamanhos de buffers, comprimentos e tamanhos de pilhas são fornecidos em bytes, a menos que especificado de outra forma.

::: info Nota
Português (Brasil):

Algumas descrições de variáveis do sistema incluem um tamanho de bloco, no caso, um valor que não é um múltiplo inteiro do tamanho de bloco declarado é arredondado para o próximo múltiplo inferior do tamanho de bloco antes de ser armazenado pelo servidor, ou seja, `FLOOR(valor) * tamanho_de_bloco`.

*Exemplo*: Suponha que o tamanho de bloco para uma variável dada seja dado como 4096, e você defina o valor da variável para 100000 (assumimos que o valor máximo da variável é maior que este número). Como 100000 / 4096 = 24.4140625, o servidor automaticamente reduz o valor para 98304 (24 * 4096) antes de armazená-lo.

Em alguns casos, o valor máximo declarado para uma variável é o máximo permitido pelo analisador MySQL, mas não é um múltiplo exato do tamanho de bloco. Nesses casos, o máximo efetivo é o próximo múltiplo inferior do tamanho de bloco.

*Exemplo*: O valor máximo de uma variável do sistema é mostrado como 4294967295 (232-1), e seu tamanho de bloco é 1024. 4294967295 / 1024 = 4194303.9990234375, então, se você definir esta variável para seu valor máximo declarado, o valor realmente armazenado é 4194303 * 1024 = 4294966272.

:::

Algumas variáveis do sistema aceitam valores de nomes de arquivos. A menos que especificado de outra forma, a localização padrão do arquivo é o diretório de dados se o valor for um nome de caminho relativo. Para especificar a localização explicitamente, use um nome de caminho absoluto. Suponha que o diretório de dados seja `/var/mysql/data`. Se uma variável com valor de arquivo for dada como um nome de caminho relativo, ela está localizada sob `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização é conforme o nome do caminho.

*  `activate_all_roles_on_login`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--activate-all-roles-on-login[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>activate_all_roles_on_login</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se ativar a ativação automática de todos os papéis concedidos quando os usuários fazem login no servidor:

  + Se `activate_all_roles_on_login` estiver habilitado, o servidor ativa todos os papéis concedidos a cada conta no momento do login. Isso tem precedência sobre os papéis padrão especificados com `SET DEFAULT ROLE`.
  + Se `activate_all_roles_on_login` estiver desabilitado, o servidor ativa os papéis padrão especificados com `SET DEFAULT ROLE`, se houver, no momento do login.

  Os papéis concedidos incluem aqueles concedidos explicitamente ao usuário e aqueles nomeados no valor da variável de sistema `mandatory_roles`.

   `activate_all_roles_on_login` aplica-se apenas no momento do login e no início da execução para programas e visualizações armazenadas que executam no contexto do definidor. Para alterar os papéis ativos dentro de uma sessão, use `SET ROLE`. Para alterar os papéis ativos para um programa armazenado, o corpo do programa deve executar `SET ROLE`.
*  `admin_address`

O endereço IP para ouvir conexões TCP/IP na interface de rede administrativa (consulte a Seção 7.1.12.1, “Interfaces de Conexão”). Não há um valor padrão para `admin_address`. Se essa variável não for especificada no início, o servidor não manterá nenhuma interface administrativa. O servidor também tem uma variável de sistema `bind_address` para configurar conexões TCP/IP de clientes regulares (não administrativas). Consulte a Seção 7.1.12.1, “Interfaces de Conexão”.

Se `admin_address` for especificado, seu valor deve atender a esses requisitos:

+ O valor deve ser um endereço IPv4, endereço IPv6 ou nome de host único.
+ O valor não pode especificar um formato de endereço wildcard (`*`, `0.0.0.0` ou `::`).
+ O valor pode incluir um especificador de namespace de rede.

Um endereço IP pode ser especificado como um endereço IPv4 ou IPv6. Se o valor for um nome de host, o servidor resolve o nome para um endereço IP e se vincula a esse endereço. Se um nome de host resolver para múltiplos endereços IP, o servidor usa o primeiro endereço IPv4, se houver algum, ou o primeiro endereço IPv6, caso contrário.

O servidor trata diferentes tipos de endereços da seguinte forma:

+ Se o endereço for um endereço mapeado IPv4, o servidor aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o servidor estiver vinculado a `::ffff:127.0.0.1`, os clientes podem se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.
+ Se o endereço for um endereço IPv4 ou IPv6 “regular” (como `127.0.0.1` ou `::1`), o servidor aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

Essas regras se aplicam à especificação de um namespace de rede para um endereço:

+ Um namespace de rede pode ser especificado para um endereço IP ou um nome de host.
+ Um namespace de rede não pode ser especificado para um endereço IP wildcard.
+ Para um endereço específico, o namespace de rede é opcional. Se fornecido, ele deve ser especificado como um sufixo `/ns` imediatamente após o endereço.
+ Um endereço sem o sufixo `/ns` usa o namespace global do sistema de host. Portanto, o namespace global é o padrão.
+ Um endereço com o sufixo `/ns` usa o namespace chamado *`ns`*.
+ O sistema de host deve suportar namespaces de rede e cada namespace nomeado deve ter sido configurado anteriormente. Nomear um namespace inexistente produz um erro.

Para obter informações adicionais sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a Namespace de Rede”.

Se a vinculação ao endereço falhar, o servidor produz um erro e não inicia.

A variável de sistema `admin_address` é semelhante à variável de sistema `bind_address` que vincula o servidor a um endereço para conexões de clientes comuns, mas com essas diferenças:

+ `bind_address` permite múltiplos endereços. `admin_address` permite um único endereço.
+ `bind_address` permite endereços wildcard. `admin_address` não.
*  `admin_port`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

O número de porta TCP/IP a ser usado para conexões na interface de rede administrativa (consulte a Seção 7.1.12.1, “Interfaces de Conexão”). Definir essa variável para 0 faz com que o valor padrão seja usado.

A definição de `admin_port` não tem efeito se `admin_address` não for especificado, pois, nesse caso, o servidor não mantém nenhuma interface de rede administrativa.
* `admin_ssl_ca`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-ca=nome_arquivo</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  A variável de sistema `admin_ssl_ca` é semelhante à `ssl_ca`, exceto que se aplica à interface de conexão administrativa, e não à interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.
* `admin_ssl_capath`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-capath=nome_pasta</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_capath</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de pasta</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  A variável de sistema `admin_ssl_capath` é semelhante à `ssl_capath`, exceto que se aplica à interface de conexão administrativa, e não à interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.
* `admin_ssl_cert`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-cert=nome_do_arquivo</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_cert</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  A variável do sistema `admin_ssl_cert` é semelhante ao `ssl_cert`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.
*  `admin_ssl_cipher`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-cipher=nome</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_cipher</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  A variável do sistema `admin_ssl_cipher` é semelhante ao `ssl_cipher`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

  A lista especificada por esta variável pode incluir qualquer um dos seguintes valores:

+ `ECDHE-ECDSA-AES128-GCM-SHA256`
+ `ECDHE-ECDSA-AES256-GCM-SHA384`
+ `ECDHE-RSA-AES128-GCM-SHA256`
+ `ECDHE-RSA-AES256-GCM-SHA384`
+ `ECDHE-ECDSA-CHACHA20-POLY1305`
+ `ECDHE-RSA-CHACHA20-POLY1305`
+ `ECDHE-ECDSA-AES256-CCM`
+ `ECDHE-ECDSA-AES128-CCM`
+ `DHE-RSA-AES128-GCM-SHA256`
+ `DHE-RSA-AES256-GCM-SHA384`
+ `DHE-RSA-AES256-CCM`
+ `DHE-RSA-AES128-CCM`
+ `DHE-RSA-CHACHA20-POLY1305`

  Tentar incluir quaisquer valores na lista de cifra que não estejam mostrados aqui ao configurar esta variável gera um erro ( `ER_BLOCKED_CIPHER`).
*  `admin_ssl_crl`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-crl=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_crl</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  A variável do sistema `admin_ssl_crl` é semelhante à `ssl_crl`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Encriptadas.
*  `admin_ssl_crlpath`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-crlpath=dir_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_crlpath</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

A variável de sistema `admin_ssl_crlpath` é semelhante à `ssl_crlpath`, exceto que ela se aplica à interface de conexão administrativa, em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte à criptografia para a interface administrativa, consulte Suporte à Interface Administrativa para Conexões Criptografadas.
*  `admin_ssl_key`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-key=nome_arquivo</code></td> </tr><tr><th>Variável de sistema</th> <td><code>admin_ssl_key</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da dica <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  A variável de sistema `admin_ssl_key` é semelhante à `ssl_key`, exceto que ela se aplica à interface de conexão administrativa, em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte à criptografia para a interface administrativa, consulte Suporte à Interface Administrativa para Conexões Criptografadas.
*  `admin_tls_ciphersuites`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-tls-ciphersuites=lista_ciphersuites</code></td> </tr><tr><th>Variável de sistema</th> <td><code>admin_tls_ciphersuites</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da dica <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  A variável de sistema `admin_tls_ciphersuites` é semelhante à `tls_ciphersuites`, exceto que ela se aplica à interface de conexão administrativa, em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte à criptografia para a interface administrativa, consulte Suporte à Interface Administrativa para Conexões Criptografadas.

O valor é uma lista de nomes de conjuntos de cifra, separados por vírgula e precedidos de dois pontos, entre os listados aqui:

  + `TLS_AES_128_GCM_SHA256`
  + `TLS_AES_256_GCM_SHA384`
  + `TLS_CHACHA20_POLY1305_SHA256`
  + `TLS_AES_128_CCM_SHA256`

  Tentar incluir quaisquer valores na lista de cifra que não estejam listados aqui ao configurar esta variável gera um erro ( `ER_BLOCKED_CIPHER`).
*  `admin_tls_version`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-tls-version=protocol_list</code></td> </tr><tr><th>Variável do Sistema</th> <td>`admin_tls_version`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>TLSv1.2,TLSv1.3</code></td> </tr></tbody></table>

  A variável do sistema `admin_tls_version` é semelhante à `tls_version`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte à criptografia para a interface administrativa, consulte Suporte à Interface Administrativa para Conexões Criptografadas.

  Importante
  + O MySQL 8.4 não suporta os protocolos de conexão TLSv1 e TLSv1.1. Consulte Remoção do Suporte aos Protocolos TLSv1 e TLSv1.1 para obter mais informações.
  + O MuySQL 8.4 suporta o protocolo TLSv1.3, desde que o servidor MySQL tenha sido compilado usando o OpenSSL 1.1.1 ou uma versão mais recente. O servidor verifica a versão do OpenSSL no início e, se for mais antiga que 1.1.1, o TLSv1.3 é removido do valor padrão da variável do sistema. Nesse caso, o valor padrão é `TLSv1.2`.
*  `authentication_policy`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-policy=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_policy</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>*,,</code></td> </tr></tbody></table>

  Esta variável é usada para administrar as capacidades de autenticação multifator (MFA). Para as instruções `CREATE USER` e `ALTER USER` usadas para gerenciar definições de contas do MySQL, determina quais fatores de autenticação ou fatores podem ser especificados, onde “fator” corresponde a um método de autenticação ou plugin associado a uma conta. `authentication_policy` determina os seguintes aspectos da autenticação multifator:

  + O número de fatores de autenticação.
  + Os plugins (ou métodos) permitidos para cada fator.
  + O plugin de autenticação padrão para especificações de autenticação que não nomeiam explicitamente um plugin.

  Como `authentication_policy` só se aplica quando contas são criadas ou alteradas, as alterações em seu valor não têm efeito em contas de usuários existentes.

  ::: info Nota

  Embora a variável do sistema `authentication_policy` coloque certas restrições nas cláusulas relacionadas à autenticação das instruções `CREATE USER` e `ALTER USER`, um usuário que tenha o privilégio `AUTHENTICATION_POLICY_ADMIN` não está sujeito a essas restrições. (Um aviso ocorre para instruções que, de outra forma, não seriam permitidas.)

  :::

  O valor de `authentication_policy` é uma lista de 1, 2 ou 3 elementos separados por vírgula, cada um correspondendo a um fator de autenticação e sendo de uma das formas listadas aqui, com seus significados:

  + *empty*

    O fator de autenticação é opcional; qualquer plugin de autenticação pode ser usado.
  + `*`

    O fator de autenticação é obrigatório; qualquer plugin de autenticação pode ser usado.
  + `plugin_name`

O fator de autenticação é obrigatório; este fator deve ser `*`plugin_name`*.

  `*:plugin_name`

    O fator de autenticação é obrigatório; `plugin_name` é o padrão, mas pode ser usado outro plugin de autenticação.

  Em cada caso, um elemento pode ser rodeado por caracteres de espaço em branco. A lista inteira deve ser encerrada em aspas simples.

  `authentication_policy` deve conter pelo menos um fator não vazio, e quaisquer fatores vazios devem estar no final da lista, após quaisquer fatores não vazios. Isso significa que `',,'` não é permitido porque isso indica que todos os fatores são opcionais. Cada conta deve ter pelo menos um fator de autenticação.

  O valor padrão de `authentication_policy` é `'*,,'`. Isso significa que o fator 1 é obrigatório nas definições de contas e pode usar qualquer plugin de autenticação (com `caching_sha2_password` sendo o padrão), e que os fatores 2 e 3 são opcionais e cada um pode usar qualquer plugin de autenticação.

  Se `authentication_policy` não especificar um plugin padrão para o primeiro fator, o plugin padrão para este fator é `caching_sha2_password`, embora outro plugin possa ser usado.

  A tabela a seguir mostra alguns valores possíveis para `authentication_policy` e a política que cada um estabelece para criar ou alterar contas.

  **Tabela 7.4 Valores de `authentication_policy`**

<table>
  <thead>
    <tr>
        <th><code>authentication_policy</code></th>
        <th>Política</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td><code>'*'</code></td>
        <td>Apenas um fator, que usa <code>caching_sha2_password</code>, embora outro plugin possa ser usado.</td>
    </tr>
    <tr>
        <td><code>'*,*'</code></td>
        <td>Apenas dois fatores; o primeiro fator usa <code>caching_sha2_password</code> por padrão, embora outro plugin possa ser usado; o segundo pode usar qualquer plugin.</td>
    </tr>
    <tr>
        <td><code>'*,*,*'</code></td>
        <td>Apenas três fatores, onde o primeiro fator usa <code>caching_sha2_password</code> por padrão, embora outro plugin possa ser usado; o segundo e terceiro fatores podem usar qualquer plugin.</td>
    </tr>
    <tr>
        <td><code>'*,'</code></td>
        <td>Um ou dois fatores, onde o primeiro fator usa <code>caching_sha2_password</code> por padrão, embora outro plugin possa ser usado; o segundo fator é opcional e pode usar qualquer plugin.</td>
    </tr>
    <tr>
        <td><code>'*,,'</code></td>
        <td>Um, dois ou três fatores, onde o primeiro fator usa <code>caching_sha2_password</code> por padrão, embora outro plugin possa ser usado; o segundo fator e os terceiros fatores são opcionais e podem usar qualquer plugin.</td>
    </tr>
    <tr>
        <td><code>'*,*,'</code></td>
        <td>Dois ou três fatores, onde o primeiro fator usa <code>caching_sha2_password</code> por padrão, embora outro plugin possa ser usado; o segundo fator é obrigatório e o terceiro fator é opcional; os segundo e terceiro fatores podem usar qualquer plugin.</td>
    </tr>
    <tr>
        <td><code>'*,auth_plugin'</code></td>
        <td>Dois fatores, onde o primeiro fator usa <code>caching_sha2_password</code> por padrão, embora outro plugin possa ser usado; o segundo fator deve ser o plugin nomeado.</td>
    </tr>
    <tr>
        <td><code>'auth_plugin,*,'</code></td>
        <td>Dois ou três fatores, onde o primeiro fator deve ser o plugin nomeado; o segundo fator é obrigatório, mas pode usar qualquer plugin; o terceiro fator é opcional e pode usar qualquer plugin.</td>
    </tr>
    <tr>
        <td><code>'*,*:auth_plugin'</code></td>
        <td>Dois fatores, onde o primeiro fator usa <code>caching_sha2_password</code> por padrão, embora outro plugin possa ser usado; o segundo fator é obrigatório e usa o plugin nomeado, mas outro plugin pode ser usado.</td>
    </tr>
    <tr>
        <td><code>'auth_plugin,'</code></td>
        <td>Um ou dois fatores, onde o primeiro fator deve ser o plugin nomeado; o segundo fator é opcional e pode usar qualquer plugin.</td>
    </tr>
    <tr>
        <td><code>'*:auth_plugin,*,'</code></td>
        <td>Dois ou três fatores, onde o primeiro fator deve ser o plugin nomeado; o segundo fator é obrigatório e pode usar qualquer plugin, e o terceiro fator é opcional e pode usar qualquer plugin.</td>
    </tr>
    <tr>
        <td><code>'auth_plugin,auth_plugin,auth_plugin'</code></td>
        <td>Três fatores, onde todos os três fatores devem usar os plugins nomeados.</td>
    </tr>
  </tbody>
</table>
*  `authentication_windows_log_level`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-log-level=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_windows_log_level</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>2</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4</code></td> </tr></tbody></table>

  Esta variável está disponível apenas se o plugin de autenticação Windows `authentication_windows` estiver habilitado e o código de depuração estiver ativado. Consulte a Seção 8.4.1.6, “Autenticação Personalizável de Windows”.

  Esta variável define o nível de registro para o plugin de autenticação Windows. A tabela a seguir mostra os valores permitidos.

  <table><thead><tr> <th>Valor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>0</td> <td>Sem registro</td> </tr><tr> <td>1</td> <td>Registro apenas de mensagens de erro</td> </tr><tr> <td>2</td> <td>Mensagens de nível de log 1 e mensagens de aviso</td> </tr><tr> <td>3</td> <td>Mensagens de nível de log 2 e notas de informação</td> </tr><tr> <td>4</td> <td>Mensagens de nível de log 3 e mensagens de depuração</td> </tr></tbody></table>
* `authentication_windows_use_principal_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_windows_use_principal_name</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável está disponível apenas se o plugin de autenticação Windows `authentication_windows` estiver habilitado. Consulte a Seção 8.4.1.6, “Autenticação Personalizável de Windows”.

Um cliente que se autentica usando a função `InitSecurityContext()` deve fornecer uma string que identifica o serviço ao qual ele se conecta (*`targetName`*). O MySQL usa o nome do principal (UPN) da conta sob a qual o servidor está em execução. O UPN tem a forma `user_id@computer_name` e não precisa ser registrado em nenhum lugar para ser usado. Esse UPN é enviado pelo servidor no início do handshake de autenticação.

Esta variável controla se o servidor envia o UPN no desafio inicial. Por padrão, a variável está habilitada. Por razões de segurança, ela pode ser desabilitada para evitar enviar o nome da conta do servidor para um cliente como texto claro. Se a variável for desabilitada, o servidor envia sempre um byte `0x00` no primeiro desafio, o cliente não especifica *`targetName`*, e, como resultado, a autenticação NTLM é usada.

Se o servidor não conseguir obter seu UPN (o que acontece principalmente em ambientes que não suportam autenticação Kerberos), o UPN não é enviado pelo servidor e a autenticação NTLM é usada.
*  `autocommit`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td>`autocommit`</td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tbody></table>

  O modo autocommit. Se definido para 1, todas as alterações em uma tabela entram em vigor imediatamente. Se definido para 0, você deve usar `COMMIT` para aceitar uma transação ou `ROLLBACK` para cancelá-la. Se `autocommit` é 0 e você o altera para 1, o MySQL realiza um `COMMIT` automático de qualquer transação aberta. Outra maneira de iniciar uma transação é usar uma declaração `START TRANSACTION` ou `BEGIN`. Veja a Seção 15.3.1, “Declarações START TRANSACTION, COMMIT e ROLLBACK”.

Por padrão, as conexões do cliente começam com `autocommit` definido como 1. Para fazer com que os clientes comecem com um valor padrão de 0, defina o valor global `autocommit` iniciando o servidor com a opção `--autocommit=0`. Para definir a variável usando um arquivo de opção, inclua as seguintes linhas:

  ```
  [mysqld]
  autocommit=0
  ```hUgfMiHZ4t```
  SET block_encryption_mode = 'aes-256-cbc';
  ```VmGqgHIGEr```
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
  ```ckkvbGNmIV```
  [mysqld]
  disabled_storage_engines="MyISAM,FEDERATED"
  ```h3VabxIQyB```
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
  ```bmGDem4yOc```
  col_name IN(val1, ..., valN)
  col_name = val1 OR ... OR col_name = valN
  ```OWKWLdR4YF```
  [Warning] TIMESTAMP with implicit DEFAULT value is deprecated.
  Please use --explicit_defaults_for_timestamp server option (see
  documentation for more details).
  ```EEtBGionyT```
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
  ```TVlHJQZQyg```
  1 - ((Key_blocks_unused * key_cache_block_size) / key_buffer_size)
  ```jrBNQKyvGg```
  ER_SERVER_SHUTDOWN_COMPLETE
  MY-000031
  000031
  MY-31
  31
  ```uqrp5UYVEu

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--mandatory-roles=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>mandatory_roles</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  Rotulações que o servidor deve tratar como obrigatórias. Na prática, essas rotulações são concedidas automaticamente a todos os usuários, embora a definição de `mandatory_roles` não mude efetivamente nenhuma conta de usuário, e as rotulações concedidas não sejam visíveis na tabela de borda de sistema `mysql.role_edges`.

  O valor da variável é uma lista de nomes de rotulações separados por vírgula. Exemplo:

  ```
  $> sudo debconf-set-selections <<< "mysql-server mysql-server/lowercase-table-names select Enabled"
  ```

  Para definir o valor dinâmico de `mandatory_roles` no tempo de execução, é necessário o privilégio `ROLE_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`) normalmente necessário para definir o valor de uma variável de sistema global no tempo de execução.

  Os nomes das rotulações consistem em uma parte de usuário e uma parte de host no formato `user_name@host_name`. A parte de host, se omitida, tem o valor padrão `%`. Para obter informações adicionais, consulte a Seção 8.2.5, “Especificação de Nomes de Rotulações”.

  O valor de `mandatory_roles` é uma string, portanto, os nomes de usuário e de host, se citados, devem ser escritos de uma maneira permitida para citação dentro de strings citadas.

  Rotulações nomeadas no valor de `mandatory_roles` não podem ser revogadas com `REVOKE` ou excluídas com `DROP ROLE` ou `DROP USER`.

  Para impedir que as sessões sejam feitas como sessões de sistema por padrão, uma rotação que tenha o privilégio `SYSTEM_USER` não pode ser listada no valor da variável de sistema `mandatory_roles`:

+ Se `mandatory_roles` receber um papel no início, que tenha o privilégio `SYSTEM_USER`, o servidor escreve uma mensagem no log de erro e sai.
+ Se `mandatory_roles` receber um papel no tempo de execução que tenha o privilégio `SYSTEM_USER`, ocorre um erro e o valor de `mandatory_roles` permanece inalterado.

Os papéis obrigatórios, como os papéis concedidos explicitamente, só entram em vigor quando ativados (consulte Ativação de papéis). No momento do login, a ativação do papel ocorre para todos os papéis concedidos se a variável de sistema `activate_all_roles_on_login` estiver habilitada; caso contrário, ou para papéis que sejam definidos como papéis padrão caso contrário. No tempo de execução, o `SET ROLE` ativa os papéis.

Os papéis que não existem quando atribuídos a `mandatory_roles`, mas são criados posteriormente, podem exigir um tratamento especial para serem considerados obrigatórios. Para obter detalhes, consulte Definindo papéis obrigatórios.

`SHOW GRANTS` exibe os papéis obrigatórios de acordo com as regras descritas na Seção 15.7.7.22, "Instrução SHOW GRANTS".
*  `max_allowed_packet`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--max-allowed-packet=#</code></td> </tr><tr><th>Variável de sistema</th> <td><code>max_allowed_packet</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hint de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>67108864</code></td> </tr><tr><th>Valor mínimo</th> <td><code>1024</code></td> </tr><tr><th>Valor máximo</th> <td><code>1073741824</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tr><tr><th>Tamanho do bloco</th> <td><code>1024</code></td> </tbody></table>

  O tamanho máximo de um pacote ou qualquer string gerada/intermediária, ou qualquer parâmetro enviado pela função C `mysql_stmt_send_long_data()`. O padrão é de 64 MB.

O buffer de mensagens de pacote é inicializado com `net_buffer_length` bytes, mas pode crescer até `max_allowed_packet` bytes quando necessário. Esse valor, por padrão, é pequeno, para capturar pacotes grandes (possíveis incorretos).

Você deve aumentar esse valor se estiver usando colunas `BLOB` grandes ou strings longas. Ele deve ser tão grande quanto o maior `BLOB` que você deseja usar. O limite do protocolo para `max_allowed_packet` é de 1GB. O valor deve ser um múltiplo de 1024; os não múltiplos são arredondados para o próximo múltiplo.

Quando você altera o tamanho do buffer de mensagens alterando o valor da variável  `max_allowed_packet`, você também deve alterar o tamanho do buffer no lado do cliente, se o seu programa cliente permitir. O valor padrão de `max_allowed_packet` embutido na biblioteca do cliente é de 1GB, mas programas clientes individuais podem sobrepor isso. Por exemplo, `mysql` e  `mysqldump` têm valores padrão de 16MB e 24MB, respectivamente. Eles também permitem que você altere o valor do lado do cliente configurando `max_allowed_packet` na linha de comando ou em um arquivo de opção.

O valor da sessão dessa variável é de leitura apenas. O cliente pode receber até tantos bytes quanto o valor da sessão. No entanto, o servidor não envia ao cliente mais bytes do que o valor atual do `max_allowed_packet` global. (O valor global pode ser menor que o valor da sessão se o valor global for alterado após o cliente se conectar.)

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--max-connect-errors=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>max_connect_errors</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>100</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo (Plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (Plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Após `max_connect_errors`, os pedidos de conexão sucessivos de um host são interrompidos sem uma conexão bem-sucedida, o servidor bloqueia esse host de futuras conexões. Se uma conexão de um host for estabelecida com sucesso em menos de `max_connect_errors` tentativas após uma conexão anterior ter sido interrompida, o contador de erros para o host é zerado. Para desbloquear hosts bloqueados, limpe o cache do host; consulte Limpeza do Cache do Host.
*  `max_connections`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--max-connections=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>max_connections</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>151</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>100000</code></td> </tr></tbody></table>

  O número máximo de conexões de clientes simultâneas permitidas. O valor efetivo máximo é o menor entre o valor efetivo de `open_files_limit` `- 810` e o valor realmente definido para `max_connections`.

  Para mais informações, consulte a Seção 7.1.12.1, “Interfaces de Conexão”.
*  `max_delayed_threads`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--max-threads-atrasados=#</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do Sistema</th> <td><code>max_threads_atrasados</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>20</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>16384</code></td> </tr></tbody></table>

Esta variável do sistema está desatualizada (porque as inserções `DELAYED` não são suportadas) e está sujeita à remoção em uma futura versão do MySQL.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios da Variável do Sistema”.
* `max_digest_length`

O número máximo de bytes de memória reservados por sessão para a computação de resumos normalizados de declarações. Quando essa quantidade de espaço é usada durante a computação do resumo, ocorre a redução: não são coletados mais tokens de uma declaração analisada ou incluídos em seu valor de resumo. Declarações que diferem apenas após esse número de bytes de tokens analisados produzem o mesmo resumo normalizado de declarações e são consideradas idênticas quando comparadas ou quando agregadas para estatísticas de resumo.

O comprimento usado para calcular um resumo normalizado de declarações é a soma do comprimento do resumo normalizado de declarações e do comprimento do resumo da declaração. Como o comprimento do resumo da declaração é sempre 64, isso é equivalente a `LENGTH` (```
  SET PERSIST mandatory_roles = '`role1`@`%`,`role2`,role3,role4@localhost';
  ```SMDLfH1Fkt```
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
  ```4W9JdgIjm3```
  SET SESSION RBR_EXEC_MODE=IDEMPOTENT;
  ```bO5l0B0K2Y```
  mysql>  SET @@SESSION.session_track_system_variables='statement_id'
  mysql>  SELECT 1;
  +---+
  | 1 |
  +---+
  | 1 |
  +---+
  1 row in set (0.0006 sec)
  Statement ID: 603835
  ```vevh2Nr4y5```
    ISOLATION LEVEL
    READ ONLY
    READ WRITE
    WITH CONSISTENT SNAPSHOT
    ```BdFkaaNRrV
*  `skip_networking`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--skip-networking[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>skip_networking</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Esta variável controla se o servidor permite conexões TCP/IP. Por padrão, ela está desabilitada (permite conexões TCP). Se habilitada, o servidor permite apenas conexões locais (não TCP/IP) e toda interação com `mysqld` deve ser feita usando tubos nomeados ou memória compartilhada (no Windows) ou arquivos de socket Unix (no Unix). Esta opção é altamente recomendada para sistemas onde apenas clientes locais são permitidos. Veja  Seção 7.1.12.3, “Consultas DNS e Cache de Hospedeiros”.

Como iniciar o servidor com `--skip-grant-tables` desabilita as verificações de autenticação, o servidor também desabilita as conexões remotas nesse caso, habilitando `skip_networking`.
*  `skip_show_database`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--skip-show-database</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>skip_show_database</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Isso impede que as pessoas usem a instrução `SHOW DATABASES` se não tiverem o privilégio `SHOW DATABASES`. Isso pode melhorar a segurança se você tiver preocupações sobre os usuários poderem ver bancos de dados pertencentes a outros usuários. Seu efeito depende do privilégio `SHOW DATABASES`: Se o valor da variável for `ON`, a instrução `SHOW DATABASES` é permitida apenas para usuários que têm o privilégio `SHOW DATABASES`, e a instrução exibe todos os nomes de banco de dados. Se o valor for `OFF`, `SHOW DATABASES` é permitido a todos os usuários, mas exibe os nomes apenas dos bancos de dados para os quais o usuário tem o privilégio `SHOW DATABASES` ou outro privilégio.

Cuidado

Como qualquer privilégio global estático é considerado um privilégio para todos os bancos de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de banco de dados com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` de `INFORMATION_SCHEMA`, exceto bancos de dados que tenham sido restringidos no nível do banco de dados por revogações parciais.
*  `slow_launch_time`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--slow-launch-time=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>slow_launch_time</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>2</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tbody></table>

  Se a criação de um tópico levar mais tempo do que esse número de segundos, o servidor incrementa a variável de status `Slow_launch_threads`.
*  `slow_query_log`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--slow-query-log[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>slow_query_log</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se o log de consultas lentas está habilitado. O valor pode ser 0 (ou `OFF`) para desabilitar o log ou 1 (ou `ON`) para habilitar o log. O destino da saída do log é controlado pela variável `log_output`; se esse valor for `NONE`, nenhuma entrada de log é escrita, mesmo que o log esteja habilitado.

  “Lenta” é determinada pelo valor da variável `long_query_time`. Veja a Seção 7.4.5, “O Log de Consultas Lentas”.
*  `slow_query_log_file`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--slow-query-log-file=nome_do_arquivo</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>slow_query_log_file</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>host_name-slow.log</code></td> </tr></tbody></table>

  O nome do arquivo de log de consultas lentas. O valor padrão é `host_name-slow.log`, mas o valor inicial pode ser alterado com a opção `--slow_query_log_file`.
*  `socket`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--socket={nome_do_arquivo|nome_do_pipe}</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>socket</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão (Windows)</th> <td><code>MySQL</code></td> </tr><tr><th>Valor Padrão (Outros)</th> <td><code>/tmp/mysql.sock</code></td> </tr></tbody></table>

  Em plataformas Unix, esta variável é o nome do arquivo de soquete que é usado para conexões de clientes locais. O valor padrão é `/tmp/mysql.sock`. (Para alguns formatos de distribuição, o diretório pode ser diferente, como `/var/lib/mysql` para RPMs.)

  Em Windows, esta variável é o nome do pipe nomeado que é usado para conexões de clientes locais. O valor padrão é `MySQL` (não case-sensitive).
*  `sort_buffer_size`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--sort-buffer-size=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>sort_buffer_size</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>262144</code></td> </tr><tr><th>Valor Mínima</th> <td><code>32768</code></td> </tr><tr><th>Valor Máximo (Windows)</th> <td><code>4294967295</code></td> </tr><tr><th>Valor Máximo (Outros, plataformas de 64 bits)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Máximo (Outros, plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unidade</th> <td>bytes</td> </tbody></table>

Cada sessão que precisa realizar uma ordenação aloca um buffer desse tamanho. O `sort_buffer_size` não é específico de nenhum motor de armazenamento e é aplicado de maneira geral para otimização. No mínimo, o valor de `sort_buffer_size` deve ser grande o suficiente para acomodar quinze tuplas no buffer de ordenação. Além disso, aumentar o valor de `max_sort_length` pode exigir aumentar o valor de `sort_buffer_size`. Para mais informações, consulte a Seção 10.2.1.16, “Otimização de ORDER BY”

Se você ver muitos `Sort_merge_passes` por segundo na saída do `SHOW GLOBAL STATUS`, você pode considerar aumentar o valor de `sort_buffer_size` para acelerar as operações `ORDER BY` ou `GROUP BY` que não podem ser melhoradas com otimização de consulta ou indexação aprimorada.

O otimizador tenta descobrir quanto espaço é necessário, mas pode alocar mais, até o limite. Definir um valor maior que o necessário globalmente desacelera a maioria das consultas que realizam ordenações. É melhor aumentá-lo como um ajuste de sessão e apenas para as sessões que precisam de um tamanho maior. No Linux, existem limiares de 256KB e 2MB onde valores maiores podem desacelerar significativamente a alocação de memória, então você deve considerar ficar abaixo de um desses valores. Experimente para encontrar o melhor valor para sua carga de trabalho. Consulte a Seção B.3.3.5, “Onde o MySQL Armazena Arquivos Temporários”.

O ajuste máximo permitido para `sort_buffer_size` é 4GB−1. Valores maiores são permitidos para plataformas de 64 bits (exceto para o Windows de 64 bits, para o qual valores grandes são truncados para 4GB−1 com um aviso).
* `sql_auto_is_null`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>sql_auto_is_null</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>O Hino `SET_VAR` Aplica-se</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Se essa variável estiver habilitada, após uma instrução que insere com sucesso um valor `AUTO_INCREMENT` gerado automaticamente, você poderá encontrar esse valor executando uma instrução do seguinte formato:

```
  CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
  CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
  ```

Se a instrução retornar uma linha, o valor retornado é o mesmo que se você tivesse invocado a função `LAST_INSERT_ID()`. Para obter detalhes, incluindo o valor de retorno após uma inserção de várias linhas, consulte a Seção 14.15, “Funções de Informação”. Se nenhum valor `AUTO_INCREMENT` foi inserido com sucesso, a instrução `SELECT` não retorna nenhuma linha.

O comportamento de recuperar um valor `AUTO_INCREMENT` usando uma comparação `IS NULL` é usado por alguns programas ODBC, como o Access. Veja Obter Valores de Auto-Incremento. Esse comportamento pode ser desabilitado definindo `sql_auto_is_null` para `OFF`.

O valor padrão de `sql_auto_is_null` é `OFF`.
*  `sql_big_selects`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>sql_big_selects</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

Se definido para `OFF`, o MySQL interrompe as instruções `SELECT` que provavelmente levarão muito tempo para serem executadas (ou seja, instruções para as quais o otimizador estima que o número de linhas examinadas exceda o valor de `max_join_size`). Isso é útil quando uma instrução `WHERE` desaconselhável foi emitida. O valor padrão para uma nova conexão é `ON`, que permite todas as instruções `SELECT`.

Se você definir a variável de sistema `max_join_size` para um valor diferente de `DEFAULT`, `sql_big_selects` é definido para `OFF`.
*  `sql_buffer_result`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>sql_buffer_result</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se habilitado,  `sql_buffer_result` obriga os resultados das instruções `SELECT` a serem colocados em tabelas temporárias. Isso ajuda o MySQL a liberar os bloqueios da tabela mais cedo e pode ser benéfico em casos em que leva muito tempo para enviar os resultados ao cliente. O valor padrão é `OFF`.
*  `sql_generate_invisible_primary_key`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--sql-generate-invisible-primary-key[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>sql_generate_invisible_primary_key</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se este servidor adicionar uma chave primária invisível gerada a qualquer tabela `InnoDB` que seja criada sem uma.

  Esta variável não é replicada. Além disso, mesmo que seja definida na replica, ela é ignorada pelos threads do aplicador de replicação; isso significa que, por padrão, uma replica não gera uma chave primária para nenhuma tabela replicada que, na fonte, foi criada sem uma. Você pode fazer com que a replica gere chaves primárias invisíveis para tais tabelas definindo `REQUIRE_TABLE_PRIMARY_KEY_CHECK = GENERATE` como parte de uma declaração `CHANGE REPLICATION SOURCE TO`, especificando opcionalmente um canal de replicação.

  Para mais informações e exemplos, consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”.
*  `sql_log_off`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>sql_log_off</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code> (desabilitar o registro no log de consultas gerais)</p><p><code>ON</code> (habilitar o registro de consultas gerais)</p></td> </tr></tbody></table>

  Esta variável controla se o registro no log de consultas gerais está desativado para a sessão atual (assumindo que o próprio log de consultas gerais esteja habilitado). O valor padrão é `OFF` (ou seja, habilitar o registro). Para desabilitar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável de sessão `sql_log_off` para `ON` ou `OFF`.

  Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--sql-mode=nome</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>sql_mode</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code>ONLY_FULL_GROUP_BY STRICT_TRANS_TABLES NO_ZERO_IN_DATE NO_ZERO_DATE ERROR_FOR_DIVISION_BY_ZERO NO_ENGINE_SUBSTITUTION</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ALLOW_INVALID_DATES</code></p><p><code>ANSI_QUOTES</code></p><p><code>ERROR_FOR_DIVISION_BY_ZERO</code></p><p><code>HIGH_NOT_PRECEDENCE</code></p><p><code>IGNORE_SPACE</code></p><p><code>NO_AUTO_VALUE_ON_ZERO</code></p><p><code>NO_BACKSLASH_ESCAPES</code></p><p><code>NO_DIR_IN_CREATE</code></p><p><code>NO_ENGINE_SUBSTITUTION</code></p><p><code>NO_UNSIGNED_SUBTRACTION</code></p><p><code>NO_ZERO_DATE</code></p><p><code>NO_ZERO_IN_DATE</code></p><p><code>ONLY_FULL_GROUP_BY</code></p><p><code>PAD_CHAR_TO_FULL_LENGTH</code></p><p><code>PIPES_AS_CONCAT</code></p><p><code>REAL_AS_FLOAT</code></p><p><code>STRICT_ALL_TABLES</code></p><p><code>STRICT_TRANS_TABLES</code></p><p><code>TIME_TRUNCATE_FRACTIONAL</code></p></td> </tr></tbody></table>

  O modo SQL atual do servidor, que pode ser definido dinamicamente. Para obter detalhes, consulte  Seção 7.1.11, “Modos SQL do Servidor”.

  ::: info Nota

  Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação.

Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opção que o servidor lê ao iniciar.

  :::

*  `sql_notes`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>sql_notes</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se habilitado (o padrão), os diagnósticos de nível `Note` incrementam `warning_count` e o servidor os registra. Se desabilitado, os diagnósticos de `Note` não incrementam `warning_count` e o servidor não os registra. O `mysqldump` inclui a saída para desabilitar essa variável para que a recarga do arquivo de dump não produza avisos para eventos que não afetam a integridade da operação de recarga.
*  `sql_quote_show_create`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>sql_quote_show_create</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se habilitado (o padrão), o servidor cita identificadores para as instruções `SHOW CREATE TABLE` e `SHOW CREATE DATABASE`. Se desabilitado, a citação é desabilitada. Esta opção é habilitada por padrão para que a replicação funcione para identificadores que requerem citação. Veja  Seção 15.7.7.11, “Instrução SHOW CREATE TABLE”, e  Seção 15.7.7.7, “Instrução SHOW CREATE DATABASE”.
*  `sql_require_primary_key`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--sql-require-primary-key[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>sql_require_primary_key</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  As instruções que criam novas tabelas ou alteram a estrutura de tabelas existentes exigem que as tabelas tenham uma chave primária.

  Definir o valor da variável de sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

  Ativação desta variável ajuda a evitar problemas de desempenho na replicação baseada em linhas que podem ocorrer quando as tabelas não têm uma chave primária. Suponha que uma tabela não tenha uma chave primária e uma atualização ou exclusão modifique várias linhas. No servidor de origem da replicação, essa operação pode ser realizada usando uma única varredura da tabela, mas, quando replicada usando a replicação baseada em linhas, resulta em uma varredura da tabela para cada linha a ser modificada na replica. Com uma chave primária, essas varreduras da tabela não ocorrem.

   `sql_require_primary_key` se aplica tanto às tabelas base quanto às tabelas `TEMPORARY`, e as alterações em seu valor são replicadas para os servidores de replica. A tabela deve usar os motores de armazenamento MySQL que podem participar da replicação.

  Quando ativado, `sql_require_primary_key` tem esses efeitos:

+ Tentativas de criar uma nova tabela sem uma chave primária falham com um erro. Isso inclui `CREATE TABLE ... LIKE`. Também inclui `CREATE TABLE ... SELECT`, a menos que a parte `CREATE TABLE` inclua uma definição de chave primária.
  + Tentativas de excluir a chave primária de uma tabela existente falham com um erro, com a exceção de que excluir a chave primária e adicionar uma chave primária na mesma declaração `ALTER TABLE` é permitido.
    A exclusão da chave primária falha mesmo se a tabela também contiver um índice `UNIQUE NOT NULL`.
  + Tentativas de importar uma tabela sem uma chave primária falham com um erro.

A opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` da declaração `CHANGE REPLICATION SOURCE TO` habilita uma replica a selecionar sua própria política para verificações de chave primária. Quando a opção é definida como `ON` para um canal de replicação, a replica sempre usa o valor `ON` para a variável de sistema `sql_require_primary_key` em operações de replicação, exigindo uma chave primária. Quando a opção é definida como `OFF`, a replica sempre usa o valor `OFF` para a variável de sistema `sql_require_primary_key` em operações de replicação, de modo que uma chave primária nunca seja necessária, mesmo que a fonte a exigiu. Quando a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` é definida como `STREAM`, que é o padrão, a replica usa o valor que é replicado da fonte para cada transação. Com o ajuste `STREAM` para a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK`, se as verificações de privilégio estiverem em uso para o canal de replicação, a conta `PRIVILEGE_CHECKS_USER` precisa de privilégios suficientes para definir variáveis de sessão restritas, para que possa definir o valor de sessão para a variável de sistema `sql_require_primary_key`. Com as configurações `ON` ou `OFF`, a conta não precisa desses privilégios. Para mais informações, consulte a Seção 19.3.3, “Verificações de Privilégios de Replicação”.
* `sql_safe_updates`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>sql_safe_updates</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se essa variável estiver habilitada, as instruções `UPDATE` e `DELETE` que não utilizam uma chave na cláusula `WHERE` ou uma cláusula `LIMIT` produzem um erro. Isso permite capturar instruções `UPDATE` e `DELETE` onde as chaves não são usadas corretamente e que provavelmente mudariam ou excluiriam um grande número de linhas. O valor padrão é `OFF`.

  Para o cliente `mysql`, `sql_safe_updates` pode ser habilitado usando a opção `--safe-updates`. Para mais informações, consulte  Usando o Modo de Atualizações Seguras (--safe-updates)").
*  `sql_select_limit`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>sql_select_limit</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>18446744073709551615</code></td> </tr></tbody></table>

  O número máximo de linhas a serem retornadas das instruções `SELECT`. Para mais informações, consulte  Usando o Modo de Atualizações Seguras (--safe-updates)").

  O valor padrão para uma nova conexão é o número máximo de linhas que o servidor permite por tabela. Valores padrão típicos são (232)−1 ou (264)−1. Se você alterou o limite, o valor padrão pode ser restaurado atribuindo um valor de `DEFAULT`.

  Se uma `SELECT` tiver uma cláusula `LIMIT`, a `LIMIT` tem precedência sobre o valor de `sql_select_limit`.
*  `sql_warnings`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>sql_warnings</code></td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Esta variável controla se as instruções de inserção de uma única linha produzem uma string de informações se ocorrerem avisos. O valor padrão é `OFF`. Defina o valor para `ON` para produzir uma string de informações.
*  `ssl_ca`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-ca=nome_arquivo</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ssl_ca</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA) no formato PEM. O arquivo contém uma lista de Autoridades de Certificação SSL confiáveis.

  Esta variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e Monitoramento em Tempo de Execução no Lado do Servidor para Conexões Encriptadas.
*  `ssl_capath`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-capath=nome_diretorio</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ssl_capath</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

O nome do caminho do diretório que contém os arquivos de certificado da Autoridade de Certificação SSL (CA) confiável no formato PEM. Você deve executar o `rehash` do OpenSSL no diretório especificado por esta opção antes de usá-lo. Em sistemas Linux, você pode invocar o `rehash` da seguinte maneira:

  ```
  SELECT * FROM tbl_name WHERE auto_col IS NULL
  ```

  Em plataformas Windows, você pode usar o script `c_rehash` em um prompt de comando, da seguinte maneira:

  ```
  $> openssl rehash path/to/directory
  ```

  Consulte openssl-rehash para obter a sintaxe completa e outras informações.

  Esta variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e Monitoramento em Tempo de Execução no Servidor para Conexões Encriptadas.
*  `ssl_cert`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-cert=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td>`ssl_cert`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tbody></table>

  O nome do caminho do arquivo de certificado público SSL do servidor no formato PEM.

  Se o servidor for iniciado com `ssl_cert` definido para um certificado que usa qualquer cifra ou categoria de cifra restrita, o servidor começa com suporte para conexões encriptadas desativado. Para informações sobre restrições de cifra, consulte Configuração de Cifra de Conexão.

  Esta variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e Monitoramento em Tempo de Execução no Servidor para Conexões Encriptadas.
*  `ssl_cipher`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-cipher=nome</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ssl_cipher</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Sugestão de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  A lista de cifra de criptografia permitida para conexões que utilizam TLSv1.2. Se nenhum dos cifrados na lista for suportado, as conexões criptografadas que utilizam este protocolo TLS não funcionarão.

  A lista pode incluir qualquer um dos seguintes valores:

  + `ECDHE-ECDSA-AES128-GCM-SHA256`
  + `ECDHE-ECDSA-AES256-GCM-SHA384`
  + `ECDHE-RSA-AES128-GCM-SHA256`
  + `ECDHE-RSA-AES256-GCM-SHA384`
  + `ECDHE-ECDSA-CHACHA20-POLY1305`
  + `ECDHE-RSA-CHACHA20-POLY1305`
  + `ECDHE-ECDSA-AES256-CCM`
  + `ECDHE-ECDSA-AES128-CCM`
  + `DHE-RSA-AES128-GCM-SHA256`
  + `DHE-RSA-AES256-GCM-SHA384`
  + `DHE-RSA-AES256-CCM`
  + `DHE-RSA-AES128-CCM`
  + `DHE-RSA-CHACHA20-POLY1305`

  Tentar incluir quaisquer valores na lista de cifrados que não são mostrados aqui ao definir esta variável gera um erro ( `ER_BLOCKED_CIPHER`).

  Para maior portabilidade, a lista de cifrados deve ser uma lista de um ou mais nomes de cifrados, separados por colchetes. O exemplo seguinte mostra dois nomes de cifrados separados por um colchete:

  ```
  \> c_rehash path/to/directory
  ```

  O OpenSSL suporta a sintaxe para especificar cifrados descritos na documentação do OpenSSL em <https://www.openssl.org/docs/manmaster/man1/ciphers.html>.

  Para informações sobre quais cifrados de criptografia o MySQL suporta, consulte a Seção 8.3.2, “Protocolos e Cifrados TLS de Conexão Encriptada”.

Essa variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Veja Configuração e Monitoramento em Tempo de Execução no Servidor para Conexões Encriptadas.
*  `ssl_crl`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-crl=nome_arquivo</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ssl_crl</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O nome do caminho do arquivo que contém listas de revogação de certificados no formato PEM.

  Essa variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Veja Configuração e Monitoramento em Tempo de Execução no Servidor para Conexões Encriptadas.
*  `ssl_crlpath`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-crlpath=nome_diretório</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ssl_crlpath</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O caminho do diretório que contém arquivos de lista de revogação de certificados no formato PEM.

  Essa variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Veja Configuração e Monitoramento em Tempo de Execução no Servidor para Conexões Encriptadas.
*  `ssl_fips_mode`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do Sistema</th> <td><code>ssl_fips_mode</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code> (ou 0)</p><p><code>ON</code> (ou 1)</p><p><code>STRICT</code> (ou 2)</p></td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do servidor. A variável do sistema `ssl_fips_mode` difere de outras variáveis do sistema `ssl_xxx` porque não é usada para controlar se o servidor permite conexões criptografadas, mas sim para afetar quais operações criptográficas são permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Esses valores de `ssl_fips_mode` são permitidos:

  + `OFF` (ou 0): Desabilitar o modo FIPS.
  + `ON` (ou 1): Habilitar o modo FIPS.
  + `STRICT` (ou 2): Habilitar o modo FIPS “estricto”.

::: info Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `ssl_fips_mode` é `OFF`. Nesse caso, definir `ssl_fips_mode` para `ON` ou `STRICT` no início faz com que o servidor produza uma mensagem de erro e saia.

:::

Esta opção está desatualizada e tornou-se somente leitura. Espere-se que ela seja removida em uma versão futura do MySQL. *  `ssl_key`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-key=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ssl_key</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

O nome do caminho do arquivo de chave privada SSL do servidor no formato PEM. Para maior segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

Se o arquivo de chave estiver protegido por uma senha, o servidor solicita ao usuário a senha. A senha deve ser fornecida interativamente; ela não pode ser armazenada em um arquivo. Se a senha estiver incorreta, o programa continua como se não pudesse ler a chave.

Esta variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução da instrução `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e Monitoramento em Tempo de Execução no Lado do Servidor para Conexões Encriptadas.
*  `ssl_session_cache_mode`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl_session_cache_mode={ON|OFF}</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>ssl_session_cache_mode</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p></td> </tr></tbody></table>

  Controla se o cache de sessão na memória no lado do servidor e a geração de tickets de sessão pelo servidor devem ser habilitados. O modo padrão é `ON` (habilitar o modo de cache de sessão). Uma mudança na variável do sistema `ssl_session_cache_mode` tem efeito apenas após a instrução `ALTER INSTANCE RELOAD TLS` ter sido executada ou após um reinício, se o valor da variável foi persistido.

Estes valores de `ssl_session_cache_mode` são permitidos:

+ `ON`: Habilitar o modo de cache de sessão.
+ `OFF`: Desabilitar o modo de cache de sessão.

O servidor não anuncia seu suporte à retomada de sessão se o valor desta variável do sistema for `OFF`. Ao ser executado no OpenSSL 1.0.`x`, os ingressos de sessão são sempre gerados, mas os ingressos não são utilizáveis quando o `ssl_session_cache_mode` está habilitado.

O valor atual em vigor para `ssl_session_cache_mode` pode ser observado com a variável de status `Ssl_session_cache_mode`.
*  `ssl_session_cache_timeout`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ssl_session_cache_timeout</code></td> </tr><tr><th>Variável do sistema</th> <td>`ssl_session_cache_timeout`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de `SET_VAR` Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>300</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>84600</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tbody></table>

  Define um período de tempo durante o qual a reutilização de sessões é permitida ao estabelecer uma nova conexão criptografada com o servidor, desde que o `ssl_session_cache_mode` variável do sistema esteja habilitada e os dados da sessão anteriores estejam disponíveis. Se o tempo de espera da sessão expirar, uma sessão não poderá ser reutilizada.

  O valor padrão é de 300 segundos e o valor máximo é de 84600 (ou um dia em segundos). Uma alteração na variável `ssl_session_cache_timeout` do sistema tem efeito apenas após a execução da instrução `ALTER INSTANCE RELOAD TLS`, ou após um reinício se o valor da variável foi persistido. O valor atual em vigor para `ssl_session_cache_timeout` pode ser observado com a variável de status `Ssl_session_cache_timeout`.
*  `statement_id`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>statement_id</code></td> </tr><tr><th>Âmbito</th> <td>Sessão</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr></tbody></table>

  Cada instrução executada na sessão atual é atribuída um número de sequência. Isso pode ser usado em conjunto com a variável do sistema `session_track_system_variables` para identificar essa instrução nas tabelas do Gerenciamento de Desempenho, como a tabela `events_statements_history`.
*  `stored_program_cache`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--stored-program-cache=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>stored_program_cache</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>256</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>16</code></td> </tr><tr><th>Valor Máximo</th> <td><code>524288</code></td> </tr></tbody></table>

  Define um limite superior suave para o número de rotinas armazenadas em cache por conexão. O valor desta variável é especificado em termos do número de rotinas armazenadas em cada um dos dois caches mantidos pelo MySQL Server, respectivamente, para procedimentos armazenados e funções armazenadas.

  Sempre que uma rotina armazenada é executada, esse tamanho de cache é verificado antes do primeiro ou da instrução de nível superior na rotina ser analisada; se o número de rotinas do mesmo tipo (procedimentos armazenados ou funções armazenadas, conforme o que está sendo executado) exceder o limite especificado por esta variável, o cache correspondente é esvaziado e a memória previamente alocada para objetos em cache é liberada. Isso permite que o cache seja esvaziado com segurança, mesmo quando há dependências entre rotinas armazenadas.

Os caches de procedimentos armazenados e funções armazenadas existem em paralelo com a partição de cache de definição de programas armazenados do objeto cache de dicionário. Os caches de procedimentos armazenados e funções armazenadas são por conexão, enquanto o cache de definição de programas armazenados é compartilhado. A existência de objetos nos caches de procedimentos armazenados e funções armazenadas não depende da existência de objetos no cache de definição de programas armazenados, e vice-versa. Para mais informações, consulte a Seção 16.4, “Cache de Objeto de Dicionário”.
* `stored_program_definition_cache`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--stored-program-definition-cache=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>stored_program_definition_cache</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hint de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>256</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>256</code></td> </tr><tr><th>Valor Máximo</th> <td><code>524288</code></td> </tr></tbody></table>

  Define um limite para o número de objetos de definição de programas armazenados, tanto usados quanto não usados, que podem ser mantidos no cache de objeto dicionário.

  Objetos de definição de programas armazenados não usados são mantidos apenas no cache de objeto dicionário quando o número em uso é menor que a capacidade definida por `stored_program_definition_cache`.

  Uma configuração de 0 significa que objetos de definição de programas armazenados são mantidos apenas no cache de objeto dicionário enquanto estão em uso.

  A partição de cache de definição de programas armazenados existe em paralelo com os caches de procedimentos armazenados e funções armazenadas que são configurados usando a opção `stored_program_cache`.

A opção `stored_program_cache` define um limite superior flexível para o número de procedimentos ou funções armazenadas em cache por conexão, e o limite é verificado toda vez que uma conexão executa um procedimento ou função armazenada. A partição de cache de definição de programas armazenados, por outro lado, é um cache compartilhado que armazena objetos de definição de programas armazenados para outros propósitos. A existência de objetos na partição de cache de definição de programas armazenados não depende da existência de objetos no cache de procedimentos armazenados ou no cache de funções armazenadas, e vice-versa.

Para informações relacionadas, consulte a Seção 16.4, “Cache de Objetos de Dicionário”.
*  `super_read_only`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--super-read-only[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>super_read_only</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se a variável de sistema `read_only` estiver habilitada, o servidor não permite atualizações do cliente, exceto por usuários que tenham o privilégio `CONNECTION_ADMIN` (ou o desatualizado privilégio `SUPER`). Se a variável de sistema `super_read_only` também estiver habilitada, o servidor proíbe atualizações do cliente, mesmo por usuários que tenham `CONNECTION_ADMIN` ou `SUPER`. Consulte a descrição da variável de sistema `read_only` para obter uma descrição do modo de leitura apenas e informações sobre como `read_only` e `super_read_only` interagem.

  As atualizações do cliente impedidas quando `super_read_only` está habilitado incluem operações que não necessariamente parecem ser atualizações, como `CREATE FUNCTION` (para instalar uma função carregável), `INSTALL PLUGIN` e `INSTALL COMPONENT`. Essas operações são proibidas porque envolvem alterações em tabelas no esquema do sistema `mysql`.

Da mesma forma, se o Agendamento de Eventos estiver habilitado, habilitar a variável de sistema `super_read_only` impede que ela atualize os timestamps de "última execução" dos eventos na tabela do dicionário de dados `events`. Isso faz com que o Agendamento de Eventos pare na próxima vez que tentar executar um evento agendado, após escrever uma mensagem no log de erro do servidor. (Nesse caso, a variável `event_scheduler` não muda de `ON` para `OFF`. Uma implicação é que essa variável rejeita a intenção do DBA de que o Agendamento de Eventos seja habilitado ou desabilitado, onde seu status real de iniciado ou parado pode ser distinto.). Se `super_read_only` for posteriormente desabilitado após ser habilitado, o servidor reinicia automaticamente o Agendamento de Eventos conforme necessário.

Alterações em `super_read_only` em um servidor de fonte de replicação não são replicadas para os servidores replicados. O valor pode ser definido em um replica independente da configuração na fonte.
*  `syseventlog.facility`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--syseventlog.facility=value</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>syseventlog.facility</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de `SET_VAR` Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>daemon</code></td> </tbody></table>

  A facilidade para a saída do log de erro escrita no `syslog` (que tipo de programa está enviando a mensagem). Essa variável não está disponível a menos que o componente de log de erro `log_sink_syseventlog` esteja instalado. Consulte a Seção 7.4.2.8, “Log de Erros no Log do Sistema”.

  Os valores permitidos podem variar de acordo com o sistema operacional; consulte a documentação do `syslog` do seu sistema.

  Esta variável não existe no Windows.
*  `syseventlog.include_pid`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--syseventlog.include-pid[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>syseventlog.include_pid</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se incluir o ID do processo do servidor em cada linha de saída do log de erro escrito no `syslog`. Esta variável não está disponível a menos que o componente de log de erro `log_sink_syseventlog` esteja instalado. Consulte  Seção 7.4.2.8, “Registro de Erros no Log do Sistema”.

  Esta variável não existe no Windows.
*  `syseventlog.tag`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--syseventlog.tag=tag</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>syseventlog.tag</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  O rótulo a ser adicionado ao identificador do servidor na saída do log de erro escrito no `syslog` ou no Registro de Eventos do Windows. Esta variável não está disponível a menos que o componente de log de erro `log_sink_syseventlog` esteja instalado. Consulte  Seção 7.4.2.8, “Registro de Erros no Log do Sistema”.

  Por padrão, nenhum rótulo é definido, portanto, o identificador do servidor é simplesmente `MySQL` no Windows e `mysqld` em outras plataformas. Se um valor de rótulo de *`tag`* for especificado, ele é anexado ao identificador do servidor com um hífen antes, resultando em um identificador de `syslog` de `mysqld-tag` (ou `MySQL-tag` no Windows).

Em Windows, para usar uma tag que ainda não existe, o servidor deve ser executado a partir de uma conta com privilégios de administrador, para permitir a criação de uma entrada de registro para a tag. Privilegios elevados não são necessários se a tag já existir.
* `system_time_zone`

  <table><tbody><tr><th>Variável do sistema</th> <td><code>system_time_zone</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O fuso horário do sistema do servidor. Quando o servidor começa a ser executado, herda um ajuste de fuso horário das configurações padrão da máquina, possivelmente modificado pelo ambiente da conta usada para executar o servidor ou pelo script de inicialização. O valor é usado para definir `system_time_zone`. Para especificar explicitamente o fuso horário do sistema, defina a variável de ambiente `TZ` ou use a opção `--timezone` do script `mysqld_safe`.

  Além da inicialização do tempo de inicialização, se o fuso horário do host do servidor mudar (por exemplo, devido ao horário de verão), `system_time_zone` reflete essa mudança, o que tem essas implicações para as aplicações:

  + Consultas que fazem referência a `system_time_zone` obterão um valor antes de uma mudança de horário de verão e um valor diferente após a mudança.
  + Para consultas que começam a ser executadas antes de uma mudança de horário de verão e terminam após a mudança, o `system_time_zone` permanece constante dentro da consulta porque o valor geralmente é armazenado em cache no início da execução.

  A variável `system_time_zone` difere da variável `time_zone`. Embora possam ter o mesmo valor, a última variável é usada para inicializar o fuso horário para cada cliente que se conecta. Veja a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.
* `table_definition_cache`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--table-definition-cache=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>table_definition_cache</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Sugestão de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>-1</code> (significa autodimensionamento; não atribua este valor literal)</td> </tr><tr><th>Valor Mínimo</th> <td><code>400</code></td> </tr><tr><th>Valor Máximo</th> <td><code>524288</code></td> </tr></tbody></table>

O número de definições de tabela que podem ser armazenadas no cache de definição de tabela. Se você usar um grande número de tabelas, pode criar um cache de definição de tabela grande para acelerar a abertura das tabelas. O cache de definição de tabela ocupa menos espaço e não usa descritores de arquivo, ao contrário do cache normal de tabela. O valor mínimo é 400. O valor padrão é baseado na seguinte fórmula, limitada a um limite de 2000:

```
  [mysqld]
  ssl_cipher="DHE-RSA-AES128-GCM-SHA256:AES128-SHA"
  ```o2nTf2jDNR```
  MIN(400 + table_open_cache / 2, 2000)
  ```qMralOxtTM```
  MAX(
      (open_files_limit - 10 - max_connections) / 2,
      400
     )
  ```tpk9UDTL5b```
  8 + (max_connections / 100)
  ```ArqR2BlRpy```
  MIN( MAX(thread_pool_longrun_trx_limit * 15, 5000), 30000)
  ```Xn1TGc36sK```
  SET GLOBAL transaction_isolation = 'READ-COMMITTED';
  ```v8Bvkp1QCA```
  SET @@SESSION.var_name = value;
  SET SESSION var_name = value;
  SET var_name = value;
  SET @@var_name = value;
  ```VVss30tz9C```
    SET @@SESSION.transaction_isolation = value;
    SET SESSION transaction_isolation = value;
    SET transaction_isolation = value;
    ```python
```
    SET @@transaction_isolation = value;
    ```bBa7XE8mW9```
  SET GLOBAL transaction_read_only = ON;
  ```8qdCJ4rp0f```
  SET @@SESSION.var_name = value;
  SET SESSION var_name = value;
  SET var_name = value;
  SET @@var_name = value;
  ```3u4nBtIzyh```
    SET @@SESSION.transaction_read_only = value;
    SET SESSION transaction_read_only = value;
    SET transaction_read_only = value;
    ```Mc0lNiyKf1```

    Para essa sintaxe, essas semânticas se aplicam:

    - Define o modo de acesso apenas para a próxima única transação realizada dentro da sessão.
    - Transações subsequentes retornam ao modo de acesso da sessão.
    - Não permitido dentro das transações.
    - Corresponde a `SET TRANSACTION {READ WRITE | READ ONLY}` (sem a palavra-chave `SESSION`).

  Para obter mais informações sobre `SET TRANSACTION` e sua relação com a variável de sistema `transaction_read_only`, consulte a Seção 15.3.7, “Instrução SET TRANSACTION”.
*  `unique_checks`

  <table><tbody><tr><th>Variável de Sistema</th> <td><code>unique_checks</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas `SET_VAR`</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Se definido para 1 (o valor padrão), as verificações de unicidade para índices secundários em tabelas `InnoDB` são realizadas. Se definido para 0, os mecanismos de armazenamento são permitidos a assumir que chaves duplicadas não estão presentes nos dados de entrada. Se você tem certeza de que seus dados não contêm violações de unicidade, pode definir isso para 0 para acelerar a importação de grandes tabelas para `InnoDB`.

  Definir essa variável para 0 não *obriga* os mecanismos de armazenamento a ignorar chaves duplicadas. Um mecanismo ainda é permitido verificar por elas e emitir erros de chave duplicada se detectá-las.
*  `updatable_views_with_limit`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--updatable-views-with-limit[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>updatable_views_with_limit</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr></tbody></table>

  Esta variável controla se as atualizações de uma vista podem ser feitas quando a vista não contém todas as colunas da chave primária definida na tabela subjacente, se a declaração de atualização contiver uma cláusula `LIMIT`. (Tais atualizações são frequentemente geradas por ferramentas de GUI.) Uma atualização é uma declaração `UPDATE` ou `DELETE`. Chave primária aqui significa uma `PRIMARY KEY`, ou um `UNIQUE` índice em que nenhuma coluna pode conter `NULL`.

  A variável pode ter dois valores:

  + `1` ou `YES`: Emitir uma mensagem de aviso apenas (não uma mensagem de erro). Este é o valor padrão.
  + `0` ou `NO`: Proibir a atualização.
*  `use_secondary_engine`

  Para uso apenas com MySQL HeatWave. Consulte Variáveis do Sistema, para mais informações.
* `validate_password.xxx`

  O componente `validate_password` implementa um conjunto de variáveis do sistema com nomes na forma `validate_password.xxx`. Essas variáveis afetam o teste de senha por esse componente; consulte Seção 8.4.3.2, “Opções e Variáveis de Validação de Senha”.
*  `version`

  O número da versão do servidor. O valor também pode incluir um sufixo indicando informações de construção ou configuração do servidor. `-debug` indica que o servidor foi construído com suporte de depuração habilitado.
*  `version_comment`

O programa de configuração `CMake` tem uma opção `COMPILATION_COMMENT_SERVER` que permite especificar um comentário ao compilar o MySQL. Essa variável contém o valor desse comentário.
*  `version_compile_machine`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>version_compile_machine</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O tipo do binário do servidor.
*  `version_compile_os`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>version_compile_os</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O tipo do sistema operacional em que o MySQL foi compilado.
*  `version_compile_zlib`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>version_compile_zlib</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A versão da biblioteca `zlib` compilada.
*  `wait_timeout`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--wait-timeout=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>wait_timeout</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>28800</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo (Windows)</th> <td><code>2147483</code></td> </tr><tr><th>Valor Máximo (Outros)</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

O número de segundos que o servidor espera por atividade em uma conexão não interativa antes de fechá-la.

Na inicialização do thread, o valor da sessão `wait_timeout` é inicializado a partir do valor global `wait_timeout` ou do valor global `interactive_timeout`, dependendo do tipo de cliente (definido pela opção de conexão `CLIENT_INTERACTIVE` em `mysql_real_connect()`). Veja também `interactive_timeout`.
* `warning_count`

O número de erros, avisos e notas resultantes da última instrução que gerou mensagens. Essa variável é somente de leitura. Veja a Seção 15.7.7.42, “Instrução SHOW WARNINGS”.
* `windowing_use_high_precision`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--windowing-use-high-precision[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>windowing_use_high_precision</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

Se os cálculos das operações de janela devem ser realizados sem perda de precisão. Veja a Seção 10.2.1.21, “Otimização da Função Window”.
* `xa_detach_on_prepare`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--xa-detach-on-prepare[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>xa_detach_on_prepare</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

Quando configurado para `ON` (ativado), todas as transações XA são desconectadas (desconectadas) da conexão (sessão) como parte do `XA PREPARE`. Isso significa que a transação XA pode ser confirmada ou revertida por outra conexão, mesmo que a conexão original não tenha sido encerrada, e essa conexão pode iniciar novas transações.

Tabelas temporárias não podem ser usadas dentro de transações XA desconectadas.

Quando configurado para `OFF` (desativado), uma transação XA é estritamente associada à mesma conexão até que a sessão se desconecte. Recomenda-se que você ative (o comportamento padrão) para a replicação.

Para mais informações, consulte a Seção 15.3.8.2, “Estados de transações XA”.