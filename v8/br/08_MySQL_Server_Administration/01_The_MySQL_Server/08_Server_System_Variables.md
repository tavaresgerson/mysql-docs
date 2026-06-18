### 7.1.8 Variáveis do Sistema de Servidor

O servidor MySQL mantém muitas variáveis de sistema que afetam seu funcionamento. A maioria das variáveis de sistema pode ser definida na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções. A maioria delas pode ser alterada dinamicamente durante a execução usando a instrução `SET`, que permite modificar o funcionamento do servidor sem precisar pará-lo e reiniciá-lo. Algumas variáveis são somente de leitura, e seus valores são determinados pelo ambiente do sistema, pela maneira como o MySQL está instalado no sistema ou, possivelmente, pelas opções usadas para compilar o MySQL. A maioria das variáveis de sistema tem um valor padrão, mas há exceções, incluindo variáveis somente de leitura. Você também pode usar os valores das variáveis de sistema em expressões.

Definir o valor de uma variável de tempo de execução de sistema global normalmente requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`). Definir o valor de uma variável de tempo de execução de sistema de sessão normalmente não requer privilégios especiais e pode ser feito por qualquer usuário, embora existam exceções. Para mais informações, consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”

Existem várias maneiras de ver os nomes e valores das variáveis do sistema:

- Para ver os valores que um servidor usa com base em seus padrões pré-compilados e em quaisquer arquivos de opção que ele lê, use este comando:

  ```
  mysqld --verbose --help
  ```

- Para ver os valores que um servidor usa apenas com base em seus parâmetros pré-definidos, ignorando as configurações em quaisquer arquivos de opção, use este comando:

  ```
  mysqld --no-defaults --verbose --help
  ```

- Para ver os valores atuais usados por um servidor em execução, use a instrução `SHOW VARIABLES` ou as tabelas de variáveis de sistema do Schema de Desempenho. Veja a Seção 29.12.14, “Tabelas de Variáveis de Sistema do Schema de Desempenho”.

Esta seção fornece uma descrição de cada variável do sistema. Para uma tabela de resumo das variáveis do sistema, consulte a Seção 7.1.5, “Referência de variáveis do sistema do servidor”. Para mais informações sobre a manipulação de variáveis do sistema, consulte a Seção 7.1.9, “Usando variáveis do sistema”.

Para informações adicionais sobre variáveis do sistema, consulte estas seções:

- A Seção 7.1.9, “Usando Variáveis do Sistema”, discute a sintaxe para definir e exibir os valores das variáveis do sistema.

- A Seção 7.1.9.2, “Variáveis dinâmicas do sistema”, lista as variáveis que podem ser definidas em tempo de execução.

- Informações sobre as variáveis do sistema de sintonização podem ser encontradas na Seção 7.1.1, “Configurando o Servidor”.

- A seção 17.14, “Opções de inicialização do InnoDB e variáveis de sistema”, lista as variáveis de sistema `InnoDB`.

- A Seção 25.4.3.9.2, “Variáveis do Sistema de NDB Cluster”, lista as variáveis do sistema que são específicas do NDB Cluster.

- Para obter informações sobre as variáveis do sistema do servidor específicas para a replicação, consulte a Seção 19.1.6, “Opções e variáveis de registro binário e replicação”.

Nota

Algumas das seguintes descrições de variáveis referem-se a “ativar” ou “desativar” uma variável. Essas variáveis podem ser ativadas com a instrução `SET` definindo-as para `ON` ou `1`, ou desativadas definindo-as para `OFF` ou `0`. As variáveis booleanas podem ser definidas no início para os valores `ON`, `TRUE`, `OFF` e `FALSE` (não case-sensitive), bem como `1` e `0`. Veja a Seção 6.2.2.4, “Modificadores de Opção do Programa”.

Algumas variáveis do sistema controlam o tamanho dos buffers ou caches. Para um buffer específico, o servidor pode precisar alocar estruturas de dados internas. Essas estruturas são tipicamente alocadas a partir da memória total alocada ao buffer, e a quantidade de espaço necessária pode depender da plataforma. Isso significa que, quando você atribui um valor a uma variável que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor que o valor atribuído. Também é possível que o servidor ajuste um valor para cima. Por exemplo, se você atribuir um valor de 0 a uma variável para a qual o valor mínimo é 1024, o servidor define o valor para 1024.

Os valores para tamanhos de tampão, comprimentos e tamanhos de pilha são fornecidos em bytes, a menos que especificado de outra forma.

Nota

Algumas descrições de variáveis do sistema incluem um tamanho de bloco, caso em que um valor que não seja um múltiplo inteiro do tamanho de bloco declarado é arredondado para o próximo múltiplo inferior do tamanho de bloco antes de ser armazenado pelo servidor, ou seja, `FLOOR(value)` `* block_size`.

*Exemplo*: Suponha que o tamanho do bloco para uma variável específica seja dado como 4096, e você defina o valor da variável para 100000 (assumimos que o valor máximo da variável é maior que este número). Como 100000 / 4096 = 24,4140625, o servidor reduz automaticamente o valor para 98304 (24 \* 4096) antes de armazená-lo.

Em alguns casos, o valor máximo declarado para uma variável é o máximo permitido pelo analisador do MySQL, mas não é um múltiplo exato do tamanho do bloco. Nesses casos, o valor máximo efetivo é o próximo múltiplo menor do tamanho do bloco.

*Exemplo*: O valor máximo de uma variável de sistema é mostrado como 4294967295 (232-1), e seu tamanho de bloco é de 1024. 4294967295 / 1024 = 4194303.9990234375, então, se você definir essa variável para seu valor máximo declarado, o valor realmente armazenado será 4194303 \* 1024 = 4294966272.

Algumas variáveis do sistema aceitam valores de nomes de arquivos. A menos que especificado de outra forma, a localização padrão do arquivo é o diretório de dados se o valor for um nome de caminho relativo. Para especificar a localização explicitamente, use um nome de caminho absoluto. Suponha que o diretório de dados seja `/var/mysql/data`. Se uma variável com valor de arquivo for fornecida como um nome de caminho relativo, ela estará localizada sob `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização será conforme o nome do caminho fornecido.

- `activate_all_roles_on_login`

  <table summary="Propriedades para activate_all_roles_on_login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--activate-all-roles-on-login[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>activate_all_roles_on_login</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Se deve habilitar a ativação automática de todos os papéis concedidos quando os usuários fazem login no servidor:

  - Se `activate_all_roles_on_login` estiver ativado, o servidor ativa todos os papéis concedidos a cada conta no momento do login. Isso tem precedência sobre os papéis padrão especificados com `SET DEFAULT ROLE`.

  - Se `activate_all_roles_on_login` estiver desativado, o servidor ativará os papéis padrão especificados com `SET DEFAULT ROLE`, se houver, no momento do login.

  Os papéis concedidos incluem aqueles concedidos explicitamente ao usuário e aqueles nomeados no valor da variável de sistema `mandatory_roles`.

  `activate_all_roles_on_login` aplica-se apenas no momento do login e no início da execução de programas e visualizações armazenados que sejam executados no contexto do definidor. Para alterar os papéis ativos dentro de uma sessão, use `SET ROLE`. Para alterar os papéis ativos de um programa armazenado, o corpo do programa deve executar `SET ROLE`.

- `admin_address`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  O endereço IP para ouvir conexões TCP/IP na interface de rede administrativa (consulte a Seção 7.1.12.1, “Interfaces de Conexão”). Não há um valor padrão `admin_address`. Se essa variável não for especificada no início, o servidor não manterá nenhuma interface administrativa. O servidor também tem uma variável de sistema `bind_address` para configurar conexões TCP/IP de clientes regulares (não administrativas). Consulte a Seção 7.1.12.1, “Interfaces de Conexão”.

  Se `admin_address` for especificado, seu valor deve satisfazer esses requisitos:

  - O valor deve ser um endereço IPv4 único, um endereço IPv6 ou um nome de host.

  - O valor não pode especificar um formato de endereço com asterisco (`*`, `0.0.0.0` ou `::`).

  - A partir do MySQL 8.0.22, o valor pode incluir um especificador de namespace de rede.

  Um endereço IP pode ser especificado como um endereço IPv4 ou IPv6. Se o valor for um nome de host, o servidor resolve o nome para um endereço IP e se vincula a esse endereço. Se um nome de host resolver para múltiplos endereços IP, o servidor usa o primeiro endereço IPv4, se houver algum, ou o primeiro endereço IPv6, caso contrário.

  O servidor trata diferentes tipos de endereços da seguinte forma:

  - Se o endereço for um endereço mapeado para IPv4, o servidor aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o servidor estiver vinculado a `::ffff:127.0.0.1`, os clientes podem se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

  - Se o endereço for um endereço IPv4 ou IPv6 “regular” (como `127.0.0.1` ou `::1`), o servidor aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

  Essas regras se aplicam à especificação de um namespace de rede para um endereço:

  - Um espaço de rede pode ser especificado para um endereço IP ou um nome de host.

  - Não é possível especificar um espaço de rede para um endereço IP wildcard.

  - Para um endereço específico, o espaço de nome de rede é opcional. Se fornecido, ele deve ser especificado como um sufixo `/ns` imediatamente após o endereço.

  - Um endereço sem o sufixo `/ns` usa o espaço de nomes global do sistema host. Portanto, o espaço de nomes global é o padrão.

  - Um endereço com o sufixo `/ns` usa o namespace chamado `ns`.

  - O sistema de hospedagem deve suportar namespaces de rede e cada namespace nomeado deve ter sido configurado anteriormente. Nomear um namespace inexistente produz um erro.

  Para obter informações adicionais sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a namespaces de rede”.

  Se a vinculação ao endereço falhar, o servidor produz um erro e não inicia.

  A variável de sistema `admin_address` é semelhante à variável de sistema `bind_address`, que vincula o servidor a um endereço para conexões comuns com clientes, mas com essas diferenças:

  - `bind_address` permite múltiplos endereços. `admin_address` permite um único endereço.

  - `bind_address` permite endereços com asteriscos. `admin_address` não permite.

- `admin_port`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>

  O número de porta TCP/IP a ser usado para as conexões na interface de rede administrativa (consulte a Seção 7.1.12.1, “Interfaces de Conexão”). Definir essa variável para 0 faz com que o valor padrão seja usado.

  A definição de `admin_port` não tem efeito se `admin_address` não for especificado, pois, nesse caso, o servidor não mantém nenhuma interface de rede administrativa.

- `admin_ssl_ca`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  A variável de sistema `admin_ssl_ca` é semelhante à `ssl_ca`, exceto que ela se aplica à interface de conexão administrativa, e não à interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

- `admin_ssl_capath`

  <table summary="Propriedades para admin_ssl_capath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-capath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_capath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  A variável de sistema `admin_ssl_capath` é semelhante à `ssl_capath`, exceto que ela se aplica à interface de conexão administrativa, e não à interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

- `admin_ssl_cert`

  <table summary="Propriedades para admin_ssl_cert"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cert=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cert</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  A variável de sistema `admin_ssl_cert` é semelhante à `ssl_cert`, exceto que ela se aplica à interface de conexão administrativa, e não à interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

- `admin_ssl_cipher`

  <table summary="Propriedades para admin_ssl_cipher"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cipher=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cipher</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  A variável de sistema `admin_ssl_cipher` é semelhante à `ssl_cipher`, exceto que ela se aplica à interface de conexão administrativa, e não à interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

- `admin_ssl_crl`

  <table summary="Propriedades para admin_ssl_crl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crl=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crl</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  A variável de sistema `admin_ssl_crl` é semelhante à `ssl_crl`, exceto que ela se aplica à interface de conexão administrativa, e não à interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

- `admin_ssl_crlpath`

  <table summary="Propriedades para admin_ssl_crlpath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crlpath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  A variável de sistema `admin_ssl_crlpath` é semelhante à `ssl_crlpath`, exceto que ela se aplica à interface de conexão administrativa, e não à interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

- `admin_ssl_key`

  <table summary="Propriedades para admin_ssl_key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-key=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_key</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  A variável de sistema `admin_ssl_key` é semelhante à `ssl_key`, exceto que ela se aplica à interface de conexão administrativa, e não à interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

- `admin_tls_ciphersuites`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  A variável de sistema `admin_tls_ciphersuites` é semelhante à `tls_ciphersuites`, exceto que ela se aplica à interface de conexão administrativa, e não à interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

- `admin_tls_version`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  A variável de sistema `admin_tls_version` é semelhante à `tls_version`, exceto que ela se aplica à interface de conexão administrativa, e não à interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

  Importante

  - O suporte aos protocolos de conexão TLSv1 e TLSv1.1 foi removido do MySQL Server a partir do MySQL 8.0.28. Os protocolos foram desatualizados a partir do MySQL 8.0.26. Consulte a remoção do suporte aos protocolos TLSv1 e TLSv1.1 para obter mais informações.

  - O suporte ao protocolo TLSv1.3 está disponível no MySQL Server a partir do MySQL 8.0.16, desde que o MySQL Server tenha sido compilado com o OpenSSL 1.1.1 ou superior. O servidor verifica a versão do OpenSSL no momento do início, e se for menor que 1.1.1, o TLSv1.3 é removido do valor padrão da variável de sistema. Nesse caso, os valores padrão são “`TLSv1,TLSv1.1,TLSv1.2`” até e incluindo o MySQL 8.0.27, e “`TLSv1.2`” a partir do MySQL 8.0.28.

- `authentication_policy`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  Esta variável é usada para administrar as capacidades de autenticação multifator (MFA). Ela se aplica às cláusulas relacionadas ao fator de autenticação das declarações `CREATE USER` e `ALTER USER`, usadas para gerenciar definições de contas do MySQL, onde “fator” corresponde a um método de autenticação ou plugin associado a uma conta:

  - `authentication_policy` controla o número de fatores de autenticação que as contas podem ter. Ou seja, ele controla quais fatores são necessários ou permitidos.

  - `authentication_policy` também controla, para cada fator, quais plugins (ou métodos) são permitidos.

  - `authentication_policy`, em conjunto com `default_authentication_plugin`, determina o plugin de autenticação padrão para especificações de autenticação que não nomeiam explicitamente um plugin.

  Como o `authentication_policy` só se aplica quando contas são criadas ou alteradas, as alterações em seu valor não afetam as contas de usuários existentes.

  Nota

  Embora a variável de sistema `authentication_policy` coloque certas restrições nas cláusulas relacionadas à autenticação das instruções `CREATE USER` e `ALTER USER`, um usuário que possui o privilégio `AUTHENTICATION_POLICY_ADMIN` não está sujeito às restrições. (Um aviso ocorre para instruções que, de outra forma, não seriam permitidas.)

  O valor de `authentication_policy` é uma lista de 1, 2 ou 3 elementos separados por vírgula. Cada elemento presente pode ser o nome de um plugin de autenticação, um asterisco (`*`), vazio ou ausente. (Exceção: o elemento 1 não pode ser vazio ou ausente.) Em todos os casos, um elemento pode ser rodeado por caracteres de espaço em branco e toda a lista deve estar entre aspas simples.

  O tipo de valor especificado para o elemento `N` na lista tem implicações sobre se o fator `N` deve estar presente nas definições da conta e quais plugins de autenticação podem ser usados:

  - Se o elemento `N` for o nome de um plugin de autenticação, um método de autenticação para o fator `N` é necessário e deve usar o plugin nomeado.

    Além disso, o plugin se torna o plugin padrão para os métodos de autenticação do fator `N` que não nomeiam um plugin explicitamente. Para obter detalhes, consulte o Plugin de Autenticação Padrão.

    Os plugins de autenticação que utilizam armazenamento de credenciais internas podem ser especificados apenas para o primeiro elemento e não podem ser repetidos. Por exemplo, as seguintes configurações não são permitidas:

    - `authentication_policy = 'caching_sha2_password, sha256_password'`

    - `authentication_policy = 'caching_sha2_password, authentication_fido, sha256_password'`

  - Se o elemento `N` for um asterisco (`*`), é necessário um método de autenticação para o fator `N`. Ele pode usar qualquer plugin de autenticação válido para o elemento `N` (como descrito mais adiante).

  - Se o elemento `N` estiver vazio, um método de autenticação para o fator `N` é opcional. Se fornecido, ele pode usar qualquer plugin de autenticação válido para o elemento `N` (como descrito mais adiante).

  - Se o elemento `N` estiver ausente da lista (ou seja, houver menos de \*`N`−1 vírgulas no valor), um método de autenticação para o fator `N` é proibido. Por exemplo, um valor de `'*'` permite apenas um único fator e, portanto, impõe a autenticação de um único fator (1FA) para novas contas criadas com `CREATE USER` ou alterações em contas existentes feitas com `ALTER USER`. Nesse caso, tais declarações não podem especificar autenticação para os fatores 2 ou 3.

  Quando um elemento `authentication_policy` nomeia um plugin de autenticação, os nomes de plugins permitidos para o elemento estão sujeitos a essas condições:

  - O elemento 1 deve nomear um plugin que não exija uma etapa de registro. Por exemplo, `authentication_fido` não pode ser nomeado.

  - Os elementos 2 e 3 devem nomear um plugin que não utilize armazenamento de credenciais internas.

    Para obter informações sobre quais plugins de autenticação usam armazenamento de credenciais internas, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

  Quando o elemento `authentication_policy` `N` é `*`, os nomes de plugins permitidos para o fator `N` nas definições de contas estão sujeitos a estas condições:

  - Para o fator 1, as definições de fatores podem usar qualquer plugin. As regras de plugins de autenticação padrão são aplicadas para especificações de autenticação que não nomeiam um plugin. Veja o plugin de autenticação padrão.

  - Para os fatores 2 e 3, as definições de fatores não podem nomear um plugin que use armazenamento de credenciais internas. Por exemplo, com as configurações '`*,*`', '`*,*,*`', '`*,`', '`*,,`' `authentication_policy`', os plugins que usam armazenamento de credenciais internas só são permitidos para o primeiro fator e não podem ser repetidos.

  Quando o elemento `authentication_policy` `N` está vazio, os nomes de plugins permitidos para o fator `N` nas definições de contas estão sujeitos a estas condições:

  - Para o fator 1, isso não se aplica porque o elemento 1 não pode ser vazio.

  - Para os fatores 2 e 3, as definições de fatores não podem nomear um plugin que use armazenamento de credenciais internas.

  Os elementos vazios devem ocorrer no final da lista, após um elemento não vazio. Em outras palavras, o primeiro elemento não pode ser vazio, e nem pode haver nenhum elemento vazio, ou o último elemento deve ser vazio ou os dois últimos elementos devem ser vazios. Por exemplo, um valor de `',,'` não é permitido porque isso significaria que todos os fatores são opcionais. Isso não pode acontecer; as contas devem ter pelo menos um fator de autenticação.

  O valor padrão de `authentication_policy` é `'*,,'`. Isso significa que o fator 1 é necessário nas definições da conta e pode usar qualquer plugin de autenticação, e que os fatores 2 e 3 são opcionais e cada um pode usar qualquer plugin de autenticação que não use armazenamento de credenciais internas.

  A tabela a seguir mostra alguns valores de `authentication_policy` e a política que cada um estabelece para criar ou alterar contas.

  **Tabela 7.4 Exemplos de valores da política de autenticação**

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

- `authentication_windows_log_level`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  Esta variável está disponível apenas se o plugin de autenticação `authentication_windows` do Windows estiver habilitado e o código de depuração estiver ativado. Consulte a Seção 8.4.1.6, “Autenticação Plugável do Windows”.

  Essa variável define o nível de registro para o plugin de autenticação do Windows. A tabela a seguir mostra os valores permitidos.

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

- `authentication_windows_use_principal_name`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  Esta variável está disponível apenas se o plugin de autenticação `authentication_windows` do Windows estiver habilitado. Consulte a Seção 8.4.1.6, “Autenticação Pluggable do Windows”.

  Um cliente que se autentica usando a função `InitSecurityContext()` deve fornecer uma string que identifica o serviço ao qual ele se conecta (`targetName`). O MySQL usa o nome principal (UPN) da conta sob a qual o servidor está em execução. O UPN tem a forma `user_id@computer_name` e não precisa ser registrado em nenhum lugar para ser usado. Esse UPN é enviado pelo servidor no início da troca de mãos de autenticação.

  Essa variável controla se o servidor envia o UPN no desafio inicial. Por padrão, a variável está habilitada. Por razões de segurança, ela pode ser desabilitada para evitar enviar o nome da conta do servidor para um cliente como texto claro. Se a variável for desabilitada, o servidor sempre envia um byte `0x00` no primeiro desafio, o cliente não especifica `targetName` e, como resultado, a autenticação NTLM é usada.

  Se o servidor não conseguir obter seu UPN (o que ocorre principalmente em ambientes que não suportam autenticação Kerberos), o UPN não é enviado pelo servidor e a autenticação NTLM é usada.

- `autocommit`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  O modo de autocommit. Se definido como 1, todas as alterações em uma tabela entram em vigor imediatamente. Se definido como 0, você deve usar `COMMIT` para aceitar uma transação ou `ROLLBACK` para cancelá-la. Se `autocommit` for 0 e você alterá-lo para 1, o MySQL executa um `COMMIT` automático de qualquer transação aberta. Outra maneira de iniciar uma transação é usar uma declaração `START TRANSACTION` ou `BEGIN`. Veja a Seção 15.3.1, “Declarações START TRANSACTION, COMMIT e ROLLBACK”.

  Por padrão, as conexões do cliente começam com `autocommit` definido como 1. Para fazer com que os clientes comecem com um valor padrão de 0, defina o valor global `autocommit` iniciando o servidor com a opção `--autocommit=0`. Para definir a variável usando um arquivo de opções, inclua as seguintes linhas:

  ```
  [mysqld]
  autocommit=0
  ```

- `automatic_sp_privileges`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  Quando essa variável tiver o valor 1 (padrão), o servidor concederá automaticamente os privilégios `EXECUTE` e `ALTER ROUTINE` ao criador de uma rotina armazenada, se o usuário não puder ainda executar e alterar ou descartar a rotina. (O privilégio `ALTER ROUTINE` é necessário para descartar a rotina.) O servidor também descartará automaticamente esses privilégios do criador quando a rotina for descartada. Se `automatic_sp_privileges` for 0, o servidor não adicionará ou descartará automaticamente esses privilégios.

  O criador de uma rotina é a conta usada para executar a instrução `CREATE`. Isso pode não ser a mesma conta nomeada como `DEFINER` na definição da rotina.

  Se você iniciar o **mysqld** com `--skip-new`, o `automatic_sp_privileges` será definido como `OFF`.

  Veja também a Seção 27.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.

- `auto_generate_certs`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  Esta variável controla se o servidor gera automaticamente os arquivos de chave e certificado SSL no diretório de dados, se eles ainda não existirem.

  Ao inicializar, o servidor gera automaticamente os arquivos de certificado e chave SSL do lado do servidor e do lado do cliente no diretório de dados se a variável de sistema `auto_generate_certs` estiver habilitada, não forem especificadas outras opções de SSL além de `--ssl`, e os arquivos SSL do lado do servidor estiverem ausentes do diretório de dados. Esses arquivos permitem conexões seguras do cliente usando SSL; consulte a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

  Para obter mais informações sobre a autogeração de arquivos SSL, incluindo nomes e características dos arquivos, consulte a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”.

  As variáveis de sistema `sha256_password_auto_generate_rsa_keys` e `caching_sha2_password_auto_generate_rsa_keys` estão relacionadas, mas controlam a autogeração de arquivos de par de chaves RSA necessários para a troca segura de senhas usando RSA em conexões não criptografadas.

- `avoid_temporal_upgrade`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>0

  Essa variável controla se o `ALTER TABLE` atualiza implicitamente as colunas temporais que são encontradas no formato anterior a 5.6.4 (as colunas `TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de frações de segundo). A atualização dessas colunas requer a reconstrução da tabela, o que impede o uso de alterações rápidas que poderiam ser aplicadas à operação a ser realizada.

  Esta variável é desabilitada por padrão. Ao a habilitar, o `ALTER TABLE` não reconstruirá as colunas temporais e, assim, poderá aproveitar possíveis alterações rápidas.

  Esta variável está desatualizada; espere-se que ela seja removida em uma futura versão do MySQL.

- `back_log`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>1

  O número de solicitações de conexão pendentes que o MySQL pode ter. Isso entra em jogo quando o principal fio do MySQL recebe muitas solicitações de conexão em um curto período de tempo. Em seguida, leva algum tempo (embora muito pouco) para o fio principal verificar a conexão e iniciar um novo fio. O valor `back_log` indica quantos pedidos podem ser empilhados durante esse curto período antes de o MySQL parar momentaneamente de responder a novos pedidos. Você precisa aumentar isso apenas se você esperar um grande número de conexões em um curto período de tempo.

  Em outras palavras, esse valor é o tamanho da fila de espera para conexões TCP/IP de entrada. Seu sistema operacional tem seu próprio limite para o tamanho dessa fila. A página manual da chamada de sistema Unix `listen()` deve ter mais detalhes. Verifique a documentação do seu sistema operacional para o valor máximo para essa variável. `back_log` não pode ser definido como maior que o limite do seu sistema operacional.

  O valor padrão é o valor de `max_connections`, que permite que o retardo permitido seja ajustado ao número máximo de conexões permitidas.

- `basedir`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>2

  O caminho para o diretório de instalação da base de dados MySQL.

- `big_tables`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>3

  Se ativado, o servidor armazena todas as tabelas temporárias no disco em vez de na memória. Isso previne a maioria dos erros `The table tbl_name is full` para operações `SELECT` que exigem uma grande tabela temporária, mas também desacelera as consultas para as quais tabelas na memória seriam suficientes.

  O valor padrão para novas conexões é `OFF` (use tabelas temporárias internas em memória). Normalmente, nunca é necessário habilitar essa variável. Quando as tabelas temporárias *internas* em memória são gerenciadas pelo motor de armazenamento `TempTable` (o padrão), e a quantidade máxima de memória que pode ser ocupada pelo motor de armazenamento `TempTable` é excedida, o motor de armazenamento `TempTable` começa a armazenar dados em arquivos temporários no disco. Quando as tabelas temporárias em memória são gerenciadas pelo motor de armazenamento `MEMORY`, as tabelas em memória são automaticamente convertidas em tabelas baseadas em disco conforme necessário. Para mais informações, consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

- `bind_address`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>4

  O servidor MySQL escuta em um ou mais soquetes de rede para conexões TCP/IP. Cada soquete está vinculado a um endereço, mas é possível que um endereço seja mapeado para múltiplas interfaces de rede. Para especificar como o servidor deve ouvir conexões TCP/IP, defina a variável de sistema `bind_address` no início do servidor. O servidor também possui uma variável de sistema `admin_address` que permite conexões administrativas em uma interface dedicada. Veja a Seção 7.1.12.1, “Interfaces de Conexão”.

  Se `bind_address` for especificado, seu valor deve satisfazer esses requisitos:

  - Antes do MySQL 8.0.13, `bind_address` aceita um único valor de endereço, que pode especificar um único endereço IP ou nome de host não com asterisco ou um dos formatos de endereço com asterisco que permitem ouvir em múltiplas interfaces de rede (`*`, `0.0.0.0` ou `::`).

  - A partir do MySQL 8.0.13, `bind_address` aceita um único valor, conforme descrito acima, ou uma lista de valores separados por vírgula. Quando a variável lista múltiplos valores, cada valor deve especificar um endereço IP único (IPv4 ou IPv6) ou um nome de host. Formatos de endereço com caracteres curinga (`*`, `0.0.0.0` ou `::`) não são permitidos em uma lista de valores.

  - A partir do MySQL 8.0.22, os endereços podem incluir um especificador de namespace de rede.

  Os endereços IP podem ser especificados como endereços IPv4 ou IPv6. Para qualquer valor que seja um nome de host, o servidor resolve o nome para um endereço IP e se vincula a esse endereço. Se um nome de host resolver para múltiplos endereços IP, o servidor usa o primeiro endereço IPv4, se houver algum, ou o primeiro endereço IPv6, caso contrário.

  O servidor trata diferentes tipos de endereços da seguinte forma:

  - Se o endereço for `*`, o servidor aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor e, se o host do servidor suportar IPv6, em todas as interfaces IPv6. Use este endereço para permitir conexões IPv4 e IPv6 em todas as interfaces do servidor. Este valor é o padrão. Se a variável especificar uma lista de múltiplos valores, este valor não é permitido.

  - Se o endereço for `0.0.0.0`, o servidor aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor. Se a variável especificar uma lista de múltiplos valores, esse valor não é permitido.

  - Se o endereço for `::`, o servidor aceita conexões TCP/IP em todas as interfaces IPv4 e IPv6 do host do servidor. Se a variável especificar uma lista de múltiplos valores, esse valor não é permitido.

  - Se o endereço for um endereço mapeado para IPv4, o servidor aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o servidor estiver vinculado a `::ffff:127.0.0.1`, os clientes podem se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

  - Se o endereço for um endereço IPv4 ou IPv6 “regular” (como `127.0.0.1` ou `::1`), o servidor aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

  Essas regras se aplicam à especificação de um namespace de rede para um endereço:

  - Um espaço de rede pode ser especificado para um endereço IP ou um nome de host.

  - Não é possível especificar um espaço de rede para um endereço IP wildcard.

  - Para um endereço específico, o espaço de nome de rede é opcional. Se fornecido, ele deve ser especificado como um sufixo `/ns` imediatamente após o endereço.

  - Um endereço sem o sufixo `/ns` usa o espaço de nomes global do sistema host. Portanto, o espaço de nomes global é o padrão.

  - Um endereço com o sufixo `/ns` usa o namespace chamado `ns`.

  - O sistema de hospedagem deve suportar namespaces de rede e cada namespace nomeado deve ter sido configurado anteriormente. Nomear um namespace inexistente produz um erro.

  - Se o valor da variável especificar múltiplos endereços, ele pode incluir endereços no espaço de nomes global, em espaços de nomes nomeados ou uma mistura.

  Para obter informações adicionais sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a namespaces de rede”.

  Se a vinculação a qualquer endereço falhar, o servidor produz um erro e não inicia.

  Exemplos:

  - `bind_address=*`

    O servidor escuta em todas as endereços IPv4 ou IPv6, conforme especificado pelo caractere curinga `*`.

  - `bind_address=198.51.100.20`

    O servidor escuta apenas no endereço IPv4 `198.51.100.20`.

  - `bind_address=198.51.100.20,2001:db8:0:f101::1`

    O servidor escuta no endereço IPv4 `198.51.100.20` e no endereço IPv6 `2001:db8:0:f101::1`.

  - `bind_address=198.51.100.20,*`

    Isso produz um erro porque endereços com asteriscos não são permitidos quando os nomes `bind_address` designam uma lista de múltiplos valores.

  - `bind_address=198.51.100.20/red,2001:db8:0:f101::1/blue,192.0.2.50`

    O servidor escuta no endereço IPv4 `198.51.100.20` no espaço de nomes `red` e no endereço IPv6 `2001:db8:0:f101::1` no espaço de nomes `blue`, e no endereço IPv4 `192.0.2.50` no espaço de nomes global.

  Quando `bind_address` nomeia um único valor (wildcard ou não), o servidor escuta em uma única porta, que, para um endereço wildcard, pode estar vinculada a múltiplas interfaces de rede. Quando `bind_address` nomeia uma lista de múltiplos valores, o servidor escuta em uma porta por valor, com cada porta vinculada a uma única interface de rede. O número de portas é linear com o número de valores especificados. Dependendo da eficiência de aceitação de conexões do sistema operacional, listas de valores longas podem gerar uma penalidade de desempenho ao aceitar conexões TCP/IP.

  Como os descritores de arquivo são alocados para soquetes de escuta e arquivos de namespace de rede, pode ser necessário aumentar a variável de sistema `open_files_limit`.

  Se você pretende vincular o servidor a um endereço específico, certifique-se de que a tabela `mysql.user` do sistema contenha uma conta com privilégios administrativos que você possa usar para se conectar a esse endereço. Caso contrário, você não poderá desligar o servidor. Por exemplo, se você vincular o servidor a `*`, você pode se conectar a ele usando todas as contas existentes. Mas se você vincular o servidor a `::1`, ele aceita conexões apenas nesse endereço. Nesse caso, primeiro certifique-se de que a conta `'root'@'::1'` esteja presente na tabela `mysql.user` para que você ainda possa se conectar ao servidor para o desligar.

- `block_encryption_mode`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>5

  Essa variável controla o modo de criptografia de bloco para algoritmos baseados em blocos, como o AES. Ela afeta a criptografia para `AES_ENCRYPT()` e `AES_DECRYPT()`.

  `block_encryption_mode` aceita um valor no formato `aes-keylen-mode`, onde `keylen` é o comprimento da chave em bits e `mode` é o modo de criptografia. O valor não é case-sensitive. Os valores permitidos de `keylen` são 128, 192 e

  256. Os valores permitidos de `mode` são `ECB`, `CBC`, `CFB1`, `CFB8`, `CFB128` e `OFB`.

  Por exemplo, essa declaração faz com que as funções de criptografia AES usem um comprimento de chave de 256 bits e o modo CBC:

  ```
  SET block_encryption_mode = 'aes-256-cbc';
  ```

  Um erro ocorre quando tenta-se definir `block_encryption_mode` para um valor que contenha uma chave de comprimento não suportado ou um modo que a biblioteca SSL não suporte.

- `build_id`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>6

  Esta é uma assinatura de 160 bits `SHA1` que é gerada pelo encadeador ao compilar o servidor em sistemas Linux com `-DWITH_BUILD_ID=ON` (ativado por padrão) e convertida em uma string hexadecimal. Este valor de leitura somente para escrita serve como um ID de compilação único e é escrito no log do servidor ao iniciar.

  `build_id` não é suportado em plataformas que não sejam Linux.

- `bulk_insert_buffer_size`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>7

  `MyISAM` utiliza uma cache especial em forma de árvore para tornar as inserções em massa mais rápidas para `INSERT ... SELECT`, `INSERT ... VALUES (...), (...), ...` e `LOAD DATA` ao adicionar dados a tabelas não vazias. Essa variável limita o tamanho da árvore de cache em bytes por thread. Definindo-a como 0, essa otimização é desativada. O valor padrão é de 8 MB.

  A partir do MySQL 8.0.14, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `caching_sha2_password_digest_rounds`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>8

  O número de rodadas de hash usadas pelo plugin de autenticação `caching_sha2_password` para armazenamento de senhas.

  Aumentar o número de rodadas de hashing acima do valor padrão implica uma penalidade de desempenho que está relacionada à quantidade de aumento:

  - Criar uma conta usando o plugin `caching_sha2_password` não afeta a sessão do cliente na qual a conta é criada, mas o servidor deve realizar as rodadas de hashing para completar a operação.

  - Para conexões de clientes que usam a conta, o servidor deve realizar as rodadas de hashing e salvar o resultado no cache. O resultado é um tempo de login mais longo para a primeira conexão do cliente, mas não para conexões subsequentes. Esse comportamento ocorre após cada reinício do servidor.

- `caching_sha2_password_auto_generate_rsa_keys`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>9

  O servidor usa essa variável para determinar se deve gerar automaticamente arquivos de par de chaves privadas/públicas RSA no diretório de dados, se eles ainda não existirem.

  Ao inicializar, o servidor gera automaticamente arquivos de par de chaves privadas/públicas RSA no diretório de dados se todas essas condições estiverem verdadeiras: A variável de sistema `sha256_password_auto_generate_rsa_keys` ou `caching_sha2_password_auto_generate_rsa_keys` estiver habilitada; nenhuma opção RSA for especificada; os arquivos RSA estiverem ausentes do diretório de dados. Esses arquivos de par de chaves permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password` ou `caching_sha2_password`; consulte a Seção 8.4.1.3, “Autenticação Plugável SHA-256”, e a Seção 8.4.1.2, “Cacheamento da Autenticação Plugável SHA-2”.

  Para obter mais informações sobre a autogeração de arquivos RSA, incluindo nomes e características dos arquivos, consulte a Seção 8.3.3.1, “Criando certificados e chaves SSL e RSA usando MySQL”.

  A variável de sistema `auto_generate_certs` está relacionada, mas controla a autogeração de arquivos de certificado e chave SSL necessários para conexões seguras usando SSL.

- `caching_sha2_password_private_key_path`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>0

  Esta variável especifica o nome do caminho do arquivo de chave privada RSA para o plugin de autenticação `caching_sha2_password`. Se o arquivo estiver nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM.

  Importante

  Como este arquivo armazena uma chave privada, seu modo de acesso deve ser restrito para que apenas o servidor MySQL possa lê-lo.

  Para obter informações sobre `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Conectada SHA-2”.

- `caching_sha2_password_public_key_path`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>1

  Esta variável especifica o nome do caminho do arquivo de chave pública RSA para o plugin de autenticação `caching_sha2_password`. Se o arquivo estiver nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM.

  Para obter informações sobre o `caching_sha2_password`, incluindo informações sobre como os clientes solicitam a chave pública RSA, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Pluggable SHA-2”.

- `character_set_client`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>2

  O conjunto de caracteres para as declarações que chegam do cliente. O valor da sessão desta variável é definido usando o conjunto de caracteres solicitado pelo cliente quando este se conecta ao servidor. (Muitos clientes suportam a opção `--default-character-set` para permitir que este conjunto de caracteres seja especificado explicitamente. Veja também a Seção 12.4, “Conjunto de caracteres de conexão e colagens”). O valor global da variável é usado para definir o valor da sessão nos casos em que o valor solicitado pelo cliente é desconhecido ou não está disponível, ou o servidor está configurado para ignorar solicitações do cliente:

  - O cliente solicita um conjunto de caracteres desconhecido pelo servidor. Por exemplo, um cliente habilitado para japonês solicita `sjis` ao se conectar a um servidor não configurado com suporte para `sjis`.

  - O cliente é de uma versão do MySQL mais antiga que o MySQL 4.1, e, portanto, não solicita um conjunto de caracteres.

  - O **mysqld** foi iniciado com a opção `--skip-character-set-client-handshake`, o que faz com que ele ignore a configuração do conjunto de caracteres do cliente.

  Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente. Tentar usá-los como o valor `character_set_client` produz um erro. Veja Conjuntos de caracteres do cliente impermissíveis.

- `character_set_connection`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>3

  O conjunto de caracteres usado para literais especificados sem um introduzir de conjunto de caracteres e para conversão de número para string. Para informações sobre introdutores, consulte a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

- `character_set_database`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>4

  O conjunto de caracteres usado pelo banco de dados padrão. O servidor define essa variável sempre que o banco de dados padrão muda. Se não houver um banco de dados padrão, a variável terá o mesmo valor que `character_set_server`.

  A partir do MySQL 8.0.14, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

  As variáveis de sistema globais `character_set_database` e `collation_database` estão desatualizadas; espere que elas sejam removidas em uma versão futura do MySQL.

  Atribuir um valor às variáveis de sessão `character_set_database` e `collation_database` é desaconselhável e as atribuições produzem um aviso. Espere que as variáveis de sessão se tornem somente de leitura (e as atribuições a elas produzam um erro) em uma versão futura do MySQL, na qual ainda seja possível acessar as variáveis de sessão para determinar o conjunto de caracteres e a collation do banco de dados padrão.

- `character_set_filesystem`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>5

  Conjunto de caracteres do sistema de arquivos. Esta variável é usada para interpretar literais de string que se referem a nomes de arquivos, como nas instruções `LOAD DATA` e `SELECT ... INTO OUTFILE` e na função `LOAD_FILE()`. Esses nomes de arquivos são convertidos de `character_set_client` para `character_set_filesystem` antes que a tentativa de abertura do arquivo ocorra. O valor padrão é `binary`, o que significa que nenhuma conversão ocorre. Para sistemas nos quais nomes de arquivos multibyte são permitidos, um valor diferente pode ser mais apropriado. Por exemplo, se o sistema representar nomes de arquivos usando UTF-8, defina `character_set_filesystem` para `'utf8mb4'`.

  A partir do MySQL 8.0.14, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `character_set_results`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>6

  O conjunto de caracteres usado para retornar os resultados da consulta ao cliente. Isso inclui dados de resultado, como valores de coluna, metadados de resultado, como nomes de colunas e mensagens de erro.

- `character_set_server`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>7

  O conjunto de caracteres padrão dos servidores. Consulte a Seção 12.15, “Configuração do Conjunto de Caracteres”. Se você definir essa variável, também deve definir `collation_server` para especificar a collation do conjunto de caracteres.

- `character_set_system`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>8

  O conjunto de caracteres usado pelo servidor para armazenar identificadores. O valor é sempre `utf8mb3`.

- `character_sets_dir`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>9

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.

- `check_proxy_users`

  <table summary="Propriedades para admin_ssl_capath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-capath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_capath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>0

  Alguns plugins de autenticação implementam mapeamento de usuários proxy para si mesmos (por exemplo, os plugins de autenticação PAM e Windows). Outros plugins de autenticação não suportam usuários proxy por padrão. Destes, alguns podem solicitar que o próprio servidor MySQL mapeie usuários proxy de acordo com os privilégios de proxy concedidos: `mysql_native_password`, `sha256_password`.

  Se a variável de sistema `check_proxy_users` estiver habilitada, o servidor realiza o mapeamento de usuários proxy para quaisquer plugins de autenticação que façam essa solicitação. No entanto, também pode ser necessário habilitar variáveis de sistema específicas do plugin para aproveitar o suporte ao mapeamento de usuários proxy do servidor:

  - Para o plugin `mysql_native_password`, habilite `mysql_native_password_proxy_users`.

  - Para o plugin `sha256_password`, habilite `sha256_password_proxy_users`.

  Para obter informações sobre o encaminhamento de usuários, consulte a Seção 8.2.19, “Usuários de Proxy”.

- `collation_connection`

  <table summary="Propriedades para admin_ssl_capath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-capath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_capath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>1

  A combinação do conjunto de caracteres de conexão. `collation_connection` é importante para comparações de cadeias literais. Para comparações de cadeias com valores de coluna, `collation_connection` não importa porque as colunas têm sua própria combinação, que tem precedência de combinação mais alta (veja a Seção 12.8.4, “Coercibilidade de combinação em expressões”).

  No MySQL 8.0.33 e versões posteriores, o uso do nome de uma collation definida pelo usuário para essa variável gera uma mensagem de alerta.

- `collation_database`

  <table summary="Propriedades para admin_ssl_capath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-capath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_capath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>2

  A collation usada pelo banco de dados padrão. O servidor define essa variável sempre que o banco de dados padrão muda. Se não houver um banco de dados padrão, a variável terá o mesmo valor que `collation_server`.

  A partir do MySQL 8.0.18, definir o valor da sessão desta variável do sistema deixou de ser uma operação restrita.

  As variáveis de sistema globais `character_set_database` e `collation_database` estão desatualizadas; espere que elas sejam removidas em uma versão futura do MySQL.

  Atribuir um valor às variáveis de sessão `character_set_database` e `collation_database` é desaconselhável e as atribuições geram um aviso. Espere que as variáveis de sessão se tornem somente de leitura (e as atribuições gerem um erro) em uma futura versão do MySQL, na qual ainda seja possível acessar as variáveis de sessão para determinar o conjunto de caracteres do banco de dados e a collation do banco de dados padrão.

  No MySQL 8.0.33 e versões posteriores, o uso do nome de uma collation definida pelo usuário para `collation_database` gera uma mensagem de aviso.

- `collation_server`

  <table summary="Propriedades para admin_ssl_capath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-capath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_capath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>3

  A collation padrão do servidor. Consulte a Seção 12.15, “Configuração do Conjunto de Caracteres”.

  A partir do MySQL 8.0.33, definir isso para o nome de uma collation definida pelo usuário gera uma mensagem de alerta.

- `completion_type`

  <table summary="Propriedades para admin_ssl_capath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-capath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_capath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>4

  O tipo de conclusão da transação. Esta variável pode assumir os valores mostrados na tabela a seguir. A variável pode ser atribuída usando os valores de nome ou os valores inteiros correspondentes.

  <table summary="Propriedades para admin_ssl_capath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-capath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_capath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>5

  `completion_type` afeta transações que começam com `START TRANSACTION` ou `BEGIN` e terminam com `COMMIT` ou `ROLLBACK`. Não se aplica a commits implícitos resultantes da execução das instruções listadas na Seção 15.3.3, “Instruções que Causam um Commit Implícito”. Também não se aplica para `XA COMMIT`, `XA ROLLBACK` ou quando `autocommit=1`.

- `component_scheduler.enabled`

  <table summary="Propriedades para admin_ssl_capath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-capath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_capath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>6

  Quando configurado para `OFF` ao iniciar, o thread de segundo plano não é iniciado. As tarefas ainda podem ser agendadas, mas elas não são executadas até que `component_scheduler` seja habilitado. Quando configurado para `ON` ao iniciar, o componente está totalmente operacional.

  É também possível definir o valor dinamicamente para obter os seguintes efeitos:

  - `ON` inicia a thread de fundo que começa a atender a fila imediatamente.

  - `OFF` sinaliza o término da thread de segundo plano, que aguarda por ela terminar. A thread de segundo plano verifica a bandeira de término antes de acessar a fila para verificar tarefas a serem executadas.

- `concurrent_insert`

  <table summary="Propriedades para admin_ssl_capath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-capath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_capath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>7

  Se for `AUTO` (padrão), o MySQL permite que as instruções `INSERT` e `SELECT` sejam executadas simultaneamente para tabelas `MyISAM` que não têm blocos livres no meio do arquivo de dados.

  Essa variável pode assumir os valores mostrados na tabela a seguir. A variável pode ser atribuída usando os valores de nome ou os valores inteiros correspondentes.

  <table summary="Propriedades para admin_ssl_capath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-capath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_capath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>8

  Se você iniciar o **mysqld** com `--skip-new`, o `concurrent_insert` será definido como `NEVER`.

  Veja também a Seção 10.11.3, “Inserções Concorrentes”.

- `connect_timeout`

  <table summary="Propriedades para admin_ssl_capath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-capath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_capath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>9

  O número de segundos que o servidor **mysqld** espera por um pacote de conexão antes de responder com `Bad handshake`. O valor padrão é de 10 segundos.

  Aumentar o valor do `connect_timeout` pode ajudar se os clientes frequentemente encontrarem erros do tipo `Lost connection to MySQL server at 'XXX', system error: errno`.

- `connection_memory_chunk_size`

  <table summary="Propriedades para admin_ssl_cert"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cert=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cert</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>0

  Defina o tamanho do agrupamento para atualizações do contador de uso da memória global `Global_connection_memory`. A variável de status é atualizada apenas quando o consumo total de memória por todas as conexões do usuário muda em mais que essa quantidade. Desative as atualizações definindo `connection_memory_chunk_size = 0`.

  O cálculo da memória é exclusivo de qualquer memória usada pelos usuários do sistema, como o usuário root do MySQL. A memória usada pelo pool de buffers `InnoDB` também não está incluída.

  Você deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir essa variável.

- `connection_memory_limit`

  <table summary="Propriedades para admin_ssl_cert"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cert=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cert</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>1

  Defina o valor máximo de memória que pode ser usado por uma única conexão de usuário. Se qualquer conexão de usuário usar mais que esse valor, todas as consultas dessa conexão serão rejeitadas com `ER_CONN_LIMIT`, incluindo quaisquer consultas que estejam em execução.

  O limite definido por essa variável não se aplica aos usuários do sistema ou à conta raiz do MySQL. A memória usada pelo pool de buffers `InnoDB` também não está incluída.

  Você deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir essa variável.

- `core_file`

  <table summary="Propriedades para admin_ssl_cert"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cert=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cert</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>2

  Se deve escrever um arquivo de núcleo se o servidor sair inesperadamente. Essa variável é definida pela opção `--core-file`.

- `create_admin_listener_thread`

  <table summary="Propriedades para admin_ssl_cert"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cert=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cert</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>3

  Se deve usar um fio de escuta dedicado para conexões de clientes na interface de rede administrativa (consulte a Seção 7.1.12.1, “Interfaces de Conexão”). O padrão é `OFF`; ou seja, o fio do gerente para conexões comuns na interface principal também lida com conexões para a interface administrativa.

  Dependendo de fatores como o tipo de plataforma e a carga de trabalho, você pode descobrir que uma configuração para essa variável oferece melhor desempenho do que a outra.

  A definição de `create_admin_listener_thread` não tem efeito se `admin_address` não for especificado, pois, nesse caso, o servidor não mantém nenhuma interface de rede administrativa.

- `cte_max_recursion_depth`

  <table summary="Propriedades para admin_ssl_cert"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cert=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cert</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>4

  Profundidade máxima de recursão da expressão de tabela comum (CTE). O servidor termina a execução de qualquer CTE que realize uma recursão em mais níveis do que o valor desta variável. Para obter mais informações, consulte Limitar a recursão de expressão de tabela comum.

- `datadir`

  <table summary="Propriedades para admin_ssl_cert"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cert=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cert</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>5

  O caminho para o diretório de dados do servidor MySQL. Os caminhos relativos são resolvidos em relação ao diretório atual. Se você espera que o servidor seja iniciado automaticamente (ou seja, em contextos para os quais você não pode saber o diretório atual com antecedência), é melhor especificar o valor `datadir` como um caminho absoluto.

- `debug`

  <table summary="Propriedades para admin_ssl_cert"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cert=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cert</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>6

  Esta variável indica as configurações atuais de depuração. Está disponível apenas para servidores construídos com suporte de depuração. O valor inicial vem do valor das instâncias da opção `--debug` fornecida na inicialização do servidor. Os valores globais e de sessão podem ser definidos em tempo de execução.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

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

  Para mais informações, consulte a Seção 7.9.4, “O Pacote DBUG”.

- `debug_sync`

  <table summary="Propriedades para admin_ssl_cert"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cert=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cert</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>7

  Essa variável é a interface de usuário para a ferramenta Debug Sync. O uso do Debug Sync exige que o MySQL seja configurado com a opção `-DWITH_DEBUG=ON` **CMake** (consulte a Seção 2.8.7, “Opções de Configuração de Código do MySQL”); caso contrário, essa variável do sistema não estará disponível.

  O valor da variável global é apenas de leitura e indica se a facilidade está habilitada. Por padrão, o Debug Sync está desabilitado e o valor de `debug_sync` é `OFF`. Se o servidor for iniciado com `--debug-sync-timeout=N`, onde `N` é um valor de tempo de espera maior que 0, o Debug Sync é habilitado e o valor de `debug_sync` é `ON - current signal`, seguido do nome do sinal. Além disso, `N` se torna o tempo de espera padrão para pontos de sincronização individuais.

  O valor da sessão pode ser lido por qualquer usuário e tem o mesmo valor que a variável global. O valor da sessão pode ser definido para controlar os pontos de sincronização.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

  Para uma descrição da funcionalidade Debug Sync e de como usar os pontos de sincronização, consulte a documentação do MySQL Server Doxygen.

- `default_authentication_plugin`

  <table summary="Propriedades para admin_ssl_cert"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cert=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cert</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>8

  O plugin de autenticação padrão. Este deve ser um plugin que utiliza armazenamento de credenciais internas, portanto, esses valores são permitidos:

  - `mysql_native_password`: Use senhas nativas do MySQL; consulte a Seção 8.4.1.1, “Autenticação Pluggable Nativa”.

  - `sha256_password`: Use senhas SHA-256; veja a Seção 8.4.1.3, “Autenticação Pluggable SHA-256”.

  - `caching_sha2_password`: Use senhas SHA-256; veja a Seção 8.4.1.2, “Cacheamento de Autenticação Pluggable SHA-2”.

  Para obter informações sobre quais plugins de autenticação usam armazenamento de credenciais internas, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

  Nota

  No MySQL 8.0, `caching_sha2_password` é o plugin de autenticação padrão, em vez de `mysql_native_password`. Para obter informações sobre as implicações dessa mudança para o funcionamento do servidor e a compatibilidade do servidor com clientes e conectores, consulte caching\_sha2\_password como o plugin de autenticação preferido.

  Antes do MySQL 8.0.27, o valor `default_authentication_plugin` afeta esses aspectos do funcionamento do servidor:

  - Determina qual plugin de autenticação o servidor atribui às novas contas criadas por declarações `CREATE USER` que não especificam explicitamente um plugin de autenticação.

  - Para uma conta criada com uma declaração do seguinte formato, o servidor associa a conta ao plugin de autenticação padrão e atribui à conta a senha fornecida, criptografada conforme exigido por esse plugin:

    ```
    CREATE USER ... IDENTIFIED BY 'cleartext password';
    ```

  A partir do MySQL 8.0.27, que introduz a autenticação multifator, o `default_authentication_plugin` ainda é usado, mas em conjunto com a variável de sistema `authentication_policy` e com menor precedência. Para obter detalhes, consulte o plugin de autenticação padrão. Devido a esse papel diminuído, o `default_authentication_plugin` é desaconselhável a partir do MySQL 8.0.27 e está sujeito à remoção em uma versão futura do MySQL.

- `default_collation_for_utf8mb4`

  <table summary="Propriedades para admin_ssl_cert"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cert=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cert</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>9

  Importante

  A variável de sistema `default_collation_for_utf8mb4` é para uso interno apenas pela replicação do MySQL.

  Essa variável é definida pelo servidor como a collation padrão para o conjunto de caracteres `utf8mb4`. O valor da variável é replicado de uma fonte para uma réplica para que a réplica possa processar corretamente os dados originados de uma fonte com uma collation padrão diferente para `utf8mb4`. Essa variável é destinada principalmente a suportar a replicação de um servidor de origem de replicação MySQL 5.7 ou anterior para um servidor de réplica MySQL 8.0, ou a replicação em grupo com um nó primário MySQL 5.7 e um ou mais segundosários MySQL 8.0. A collation padrão para `utf8mb4` no MySQL 5.7 é `utf8mb4_general_ci`, mas para `utf8mb4_0900_ai_ci` no MySQL 8.0. A variável não está presente em versões anteriores ao MySQL 8.0, então, se a réplica não receber um valor para a variável, ela assume que a fonte é de uma versão anterior e define o valor para a collation padrão anterior `utf8mb4_general_ci`.

  A partir do MySQL 8.0.18, definir o valor da sessão desta variável do sistema deixou de ser uma operação restrita.

  A collation padrão `utf8mb4` é usada nas seguintes instruções:

  - `SHOW COLLATION` e `SHOW CHARACTER SET`.

  - `CREATE TABLE` e `ALTER TABLE` com uma cláusula `CHARACTER SET utf8mb4` sem uma cláusula `COLLATION`, seja para o conjunto de caracteres da tabela ou para o conjunto de caracteres de uma coluna.

  - `CREATE DATABASE` e `ALTER DATABASE` com uma cláusula `CHARACTER SET utf8mb4` sem uma cláusula `COLLATION`.

  - Qualquer declaração que contenha uma literal de string na forma `_utf8mb4'some text'` sem uma cláusula `COLLATE`.

  Veja também a Seção 12.9, “Suporte a Unicode”.

- `default_password_lifetime`

  <table summary="Propriedades para admin_ssl_cipher"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cipher=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cipher</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>0

  Esta variável define a política global de expiração automática da senha. O valor padrão `default_password_lifetime` é 0, que desabilita a expiração automática da senha. Se o valor de `default_password_lifetime` for um inteiro positivo `N`, ele indica a vida útil permitida da senha; as senhas devem ser alteradas a cada `N` dias.

  A política global de expiração de senhas pode ser alterada conforme desejado para contas individuais usando a opção de expiração de senha das instruções `CREATE USER` e `ALTER USER`. Veja a Seção 8.2.15, “Gestão de Senhas”.

- `default_storage_engine`

  <table summary="Propriedades para admin_ssl_cipher"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cipher=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cipher</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>1

  O motor de armazenamento padrão para tabelas. Veja o Capítulo 18, *Motores de Armazenamento Alternativos*. Esta variável define o motor de armazenamento para tabelas permanentes apenas. Para definir o motor de armazenamento para tabelas `TEMPORARY`, defina a variável de sistema `default_tmp_storage_engine`.

  Para ver quais os motores de armazenamento estão disponíveis e habilitados, use a declaração `SHOW ENGINES` ou consulte a tabela `INFORMATION_SCHEMA` `ENGINES`.

  Se você desabilitar o motor de armazenamento padrão ao iniciar o servidor, você deve definir o motor padrão tanto para as tabelas permanentes quanto para as tabelas `TEMPORARY` para um motor diferente, caso contrário, o servidor não será iniciado.

- `default_table_encryption`

  <table summary="Propriedades para admin_ssl_cipher"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cipher=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cipher</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>2

  Define o ajuste de criptografia padrão aplicado a esquemas e espaços de tabelas gerais quando eles são criados sem especificar uma cláusula `ENCRYPTION`.

  A variável `default_table_encryption` é aplicável apenas a esquemas criados pelo usuário e a espaços de tabela gerais. Ela não rege a criptografia do espaço de tabela do sistema `mysql`.

  Para definir o valor de execução de `default_table_encryption`, são necessários os privilégios `SYSTEM_VARIABLES_ADMIN` e `TABLE_ENCRYPTION_ADMIN` ou o privilégio desatualizado `SUPER`.

  O valor de `default_table_encryption` não pode ser alterado enquanto a replicação em grupo estiver em execução.

  O `default_table_encryption` suporta a sintaxe de `SET PERSIST` e `SET PERSIST_ONLY`. Veja a Seção 7.1.9.3, “Variáveis de sistema persistentes”.

  Para obter mais informações, consulte Definindo um padrão de criptografia para esquemas e tabelas gerais.

- `default_tmp_storage_engine`

  <table summary="Propriedades para admin_ssl_cipher"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cipher=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cipher</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>3

  O mecanismo de armazenamento padrão para as tabelas `TEMPORARY` (criadas com `CREATE TEMPORARY TABLE`). Para definir o mecanismo de armazenamento para tabelas permanentes, defina a variável de sistema `default_storage_engine`. Veja também a discussão sobre essa variável em relação aos possíveis valores.

  Se você desabilitar o motor de armazenamento padrão ao iniciar o servidor, você deve definir o motor padrão tanto para as tabelas permanentes quanto para as tabelas `TEMPORARY` para um motor diferente, caso contrário, o servidor não será iniciado.

- `default_week_format`

  <table summary="Propriedades para admin_ssl_cipher"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cipher=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cipher</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>4

  O valor padrão a ser usado para a função `WEEK()`. Consulte a Seção 14.7, “Funções de Data e Hora”.

- `delay_key_write`

  <table summary="Propriedades para admin_ssl_cipher"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cipher=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cipher</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>5

  Esta variável especifica como usar escritas de chave com atraso. Ela se aplica apenas às tabelas `MyISAM`. A escrita de chave com atraso faz com que os buffers de chave não sejam descarregados entre as escritas. Veja também a Seção 18.2.1, “Opções de inicialização do MyISAM”.

  Essa variável pode ter um dos seguintes valores para afetar o tratamento da opção da tabela `DELAY_KEY_WRITE`, que pode ser usada nas instruções `CREATE TABLE`.

  <table summary="Propriedades para admin_ssl_cipher"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cipher=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cipher</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>6

  Nota

  Se você definir essa variável para `ALL`, você não deve usar tabelas `MyISAM` dentro de outro programa (como outro servidor MySQL ou **myisamchk**) quando as tabelas estiverem em uso. Isso leva à corrupção do índice.

  Se `DELAY_KEY_WRITE` estiver habilitado para uma tabela, o buffer de chave não será esvaziado para a tabela em todas as atualizações de índice, mas apenas quando a tabela for fechada. Isso acelera muito os escritos em chaves, mas se você usar esse recurso, deve adicionar a verificação automática de todas as tabelas `MyISAM` ao iniciar o servidor com a variável de sistema `myisam_recover_options` definida (por exemplo, `myisam_recover_options='BACKUP,FORCE'`). Veja a Seção 7.1.8, “Variáveis de Sistema do Servidor”, e a Seção 18.2.1, “Opções de Inicialização do MyISAM”.

  Se você iniciar o **mysqld** com `--skip-new`, o `delay_key_write` será definido como `OFF`.

  Aviso

  Se você ativar o bloqueio externo com `--external-locking`, não haverá proteção contra corrupção de índices para tabelas que utilizam escritas de chave atrasadas.

- `delayed_insert_limit`

  <table summary="Propriedades para admin_ssl_cipher"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cipher=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cipher</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>7

  Essa variável de sistema está desatualizada (porque as inserções `DELAYED` não são suportadas) e você deve esperar que ela seja removida em uma futura versão.

- `delayed_insert_timeout`

  <table summary="Propriedades para admin_ssl_cipher"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cipher=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cipher</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>8

  Essa variável de sistema está desatualizada (porque as inserções `DELAYED` não são suportadas) e você deve esperar que ela seja removida em uma futura versão.

- `delayed_queue_size`

  <table summary="Propriedades para admin_ssl_cipher"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-cipher=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_cipher</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>9

  Essa variável de sistema está desatualizada (porque as inserções `DELAYED` não são suportadas) e você deve esperar que ela seja removida em uma futura versão.

- `disabled_storage_engines`

  <table summary="Propriedades para admin_ssl_crl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crl=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crl</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>0

  Esta variável indica quais motores de armazenamento não podem ser usados para criar tabelas ou espaços de tabelas. Por exemplo, para impedir que novas tabelas `MyISAM` ou `FEDERATED` sejam criadas, inicie o servidor com essas linhas no arquivo de opções do servidor:

  ```
  [mysqld]
  disabled_storage_engines="MyISAM,FEDERATED"
  ```

  Por padrão, `disabled_storage_engines` está vazio (sem motores desabilitados), mas pode ser configurado como uma lista de vírgulas de um ou mais motores (não case-sensitive). Qualquer motor mencionado no valor não pode ser usado para criar tabelas ou espaços de tabela com `CREATE TABLE` ou `CREATE TABLESPACE`, e não pode ser usado com `ALTER TABLE ... ENGINE` ou `ALTER TABLESPACE ... ENGINE` para alterar o motor de armazenamento de tabelas ou espaços de tabela existentes. Tentativas de fazer isso resultam em um erro `ER_DISABLED_STORAGE_ENGINE`.

  `disabled_storage_engines` não restringe outras instruções DDL para tabelas existentes, como `CREATE INDEX`, `TRUNCATE TABLE`, `ANALYZE TABLE`, `DROP TABLE` ou `DROP TABLESPACE`. Isso permite uma transição suave para que tabelas ou espaços de tabelas existentes que utilizam um motor desativado possam ser migradas para um motor permitido por meio de métodos como `ALTER TABLE ... ENGINE permitted_engine`.

  É permitido definir a variável de sistema `default_storage_engine` ou `default_tmp_storage_engine` para um mecanismo de armazenamento desativado. Isso pode fazer com que as aplicações se comportem de forma errática ou falhem, embora isso possa ser uma técnica útil em um ambiente de desenvolvimento para identificar aplicações que usam mecanismos desativados, para que possam ser modificadas.

  `disabled_storage_engines` está desativado e não tem efeito se o servidor for iniciado com qualquer uma dessas opções: `--initialize`, `--initialize-insecure`, `--skip-grant-tables`.

  Nota

  Definir `disabled_storage_engines` pode causar um problema com o **mysql\_upgrade**. Para obter detalhes, consulte a Seção 6.4.5, “mysql\_upgrade — Verificar e atualizar tabelas do MySQL”.

- `disconnect_on_expired_password`

  <table summary="Propriedades para admin_ssl_crl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crl=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crl</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>1

  Esta variável controla como o servidor lida com clientes com senhas expiradas:

  - Se o cliente indicar que pode lidar com senhas expiradas, o valor de `disconnect_on_expired_password` é irrelevante. O servidor permite que o cliente se conecte, mas coloca-o no modo sandbox.

  - Se o cliente não indicar que pode lidar com senhas expiradas, o servidor lida com o cliente de acordo com o valor de `disconnect_on_expired_password`:

    - Se `disconnect_on_expired_password`: estiver ativado, o servidor desconecta o cliente.

    - Se `disconnect_on_expired_password`: estiver desativado, o servidor permite que o cliente se conecte, mas coloca-o no modo sandbox.

  Para obter mais informações sobre a interação entre as configurações do cliente e do servidor relacionadas ao gerenciamento de senhas expiradas, consulte a Seção 8.2.16, “Gerenciamento de senhas expiradas pelo servidor”.

- `div_precision_increment`

  <table summary="Propriedades para admin_ssl_crl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crl=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crl</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>2

  Esta variável indica o número de dígitos pelo qual a escala do resultado das operações de divisão realizadas com o operador `/` deve ser aumentada. O valor padrão é 4. Os valores mínimo e máximo são 0 e 30, respectivamente. O exemplo a seguir ilustra o efeito de aumentar o valor padrão.

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

  <table summary="Propriedades para admin_ssl_crl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crl=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crl</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>3

  As regras de filtro que controlam o funcionamento do componente de filtro do log de erro `log_filter_dragnet`. Se `log_filter_dragnet` não estiver instalado, `dragnet.log_error_filter_rules` não estará disponível. Se `log_filter_dragnet` estiver instalado, mas não ativado, as alterações em `dragnet.log_error_filter_rules` não terão efeito.

  O efeito do valor padrão é semelhante ao da filtragem realizada pelo filtro `log_sink_internal` com um ajuste de `log_error_verbosity=2`.

  A partir do MySQL 8.0.12, a variável de status `dragnet.Status` pode ser consultada para determinar o resultado da atribuição mais recente a `dragnet.log_error_filter_rules`.

  Antes do MySQL 8.0.12, atribuições bem-sucedidas para `dragnet.log_error_filter_rules` em tempo de execução produzem uma nota confirmando o novo valor:

  ```
  mysql> SET GLOBAL dragnet.log_error_filter_rules = 'IF prio <> 0 THEN unset prio.';
  Query OK, 0 rows affected, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Note
     Code: 4569
  Message: filter configuration accepted:
           SET @@GLOBAL.dragnet.log_error_filter_rules=
           'IF prio!=ERROR THEN unset prio.';
  ```

  O valor exibido por `SHOW WARNINGS` indica a representação canônica "desmontada" após o conjunto de regras ter sido analisado e compilado com sucesso para a forma interna. Semanticamente, essa forma canônica é idêntica ao valor atribuído a `dragnet.log_error_filter_rules`, mas pode haver algumas diferenças entre os valores atribuídos e canônicos, como ilustrado pelo exemplo anterior:

  - O operador `<>` é alterado para `!=`.

  - A prioridade numérica de 0 é alterada para o símbolo de prioridade correspondente `ERROR`.

  - Espaços opcionais são removidos.

  Para obter informações adicionais, consulte a Seção 7.4.2.4, “Tipos de Filtragem do Log de Erros”, e a Seção 7.5.3, “Componentes do Log de Erros”.

- `enterprise_encryption.maximum_rsa_key_size`

  <table summary="Propriedades para admin_ssl_crl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crl=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crl</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>4

  Essa variável limita o tamanho máximo das chaves RSA geradas pelo MySQL Enterprise Encryption. A variável está disponível apenas se o componente `component_enterprise_encryption` de MySQL Enterprise Encryption estiver instalado, que está disponível a partir do MySQL 8.0.30. A variável não está disponível se a biblioteca compartilhada `openssl_udf` for usada para fornecer funções de MySQL Enterprise Encryption.

  A configuração mais baixa é de 2048 bits, que é o comprimento mínimo de chave RSA aceitável pelas melhores práticas atuais. A configuração padrão é de 4096 bits. A configuração mais alta é de 16384 bits. Gerar chaves mais longas pode consumir recursos significativos da CPU, então você pode usar essa configuração para limitar as chaves a um comprimento que ofereça segurança adequada para suas necessidades, equilibrando isso com o uso de recursos. Observe que as funções fornecidas pela biblioteca compartilhada `openssl_udf` permitem comprimentos de chave a partir de 1024 bits, e após uma atualização para o componente, o comprimento mínimo da chave é maior que este. Consulte a Seção 8.6.2, “Configurando a Criptografia da MySQL Enterprise”, para obter mais informações.

- `enterprise_encryption.rsa_support_legacy_padding`

  <table summary="Propriedades para admin_ssl_crl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crl=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crl</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>5

  Esta variável controla se os dados criptografados e assinaturas geradas pelo MySQL Enterprise Encryption com as funções da biblioteca compartilhada `openssl_udf` usadas antes do MySQL 8.0.30 podem ser descriptografados ou verificados pelas funções do componente MySQL Enterprise Encryption `component_enterprise_encryption`, que está disponível a partir do MySQL 8.0.30. A variável está disponível apenas se o componente MySQL Enterprise Encryption estiver instalado e não está disponível se a biblioteca compartilhada `openssl_udf` for usada para fornecer funções de MySQL Enterprise Encryption.

  Para que as funções do componente possam suportar a descriptografia e a verificação de conteúdo produzido pelas funções da biblioteca compartilhada `openssl_udf`, você deve definir a variável de sistema padding para `ON`. Quando `ON` é definido, se as funções do componente não conseguirem descriptografar ou verificar o conteúdo assumindo que ele possui o esquema RSAES-OAEP ou RSASSA-PSS (como usado pelas funções da biblioteca compartilhada `openssl_udf`), elas fazem outra tentativa assumindo que ele possui o esquema RSAES-PKCS1-v1\_5 ou RSASSA-PKCS1-v1\_5 (como usado pelas funções da biblioteca compartilhada `openssl_udf`). Quando `OFF` é definido, se as funções do componente não conseguirem descriptografar ou verificar o conteúdo usando seus esquemas normais, elas retornam uma saída nulo. Consulte a Seção 8.6.2, “Configurando a Criptografia MySQL Enterprise”, para obter mais informações.

- `end_markers_in_json`

  <table summary="Propriedades para admin_ssl_crl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crl=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crl</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>6

  Se a saída do otimizador JSON deve adicionar marcadores de fim. Veja a Seção 10.15.9, “A variável de sistema end\_markers\_in\_json”.

- `eq_range_index_dive_limit`

  <table summary="Propriedades para admin_ssl_crl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crl=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crl</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>7

  Essa variável indica o número de intervalos de igualdade em uma condição de comparação de igualdade quando o otimizador deve mudar de usar mergulhos de índice para estatísticas de índice na estimativa do número de linhas qualificadoras. Ela se aplica à avaliação de expressões que têm uma das seguintes formas equivalentes, onde o otimizador usa um índice não único para procurar valores de `col_name`:

  ```
  col_name IN(val1, ..., valN)
  col_name = val1 OR ... OR col_name = valN
  ```

  Em ambos os casos, a expressão contém faixas de igualdade `N`. O otimizador pode fazer estimativas de linha usando mergulhos de índice ou estatísticas de índice. Se `eq_range_index_dive_limit` for maior que 0, o otimizador usa estatísticas de índice existentes em vez de mergulhos de índice se houver `eq_range_index_dive_limit` ou mais faixas de igualdade. Assim, para permitir o uso de mergulhos de índice para até `N` faixas de igualdade, defina `eq_range_index_dive_limit` para `N` + 1. Para desabilitar o uso de estatísticas de índice e sempre usar mergulhos de índice independentemente de `N`, defina `eq_range_index_dive_limit` para 0.

  Para mais informações, consulte a seção Otimização da faixa de igualdade de comparações de vários valores.

  Para atualizar as estatísticas do índice da tabela para as melhores estimativas, use `ANALYZE TABLE`.

- `error_count`

  O número de erros que resultaram da última declaração que gerou mensagens. Essa variável é apenas de leitura. Consulte a Seção 15.7.7.17, "Declaração SHOW ERRORS".

- `event_scheduler`

  <table summary="Propriedades para admin_ssl_crl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crl=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crl</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>8

  Essa variável habilita ou desabilita, e inicia ou para o Cronômetro de Eventos. Os valores de status possíveis são `ON`, `OFF` e `DISABLED`. A configuração do Cronômetro de Eventos `OFF` não é a mesma que desabilitar o Cronômetro de Eventos, que requer a configuração do status para `DISABLED`. Essa variável e seus efeitos na operação do Cronômetro de Eventos são discutidos em mais detalhes na Seção 27.4.2, “Configuração do Cronômetro de Eventos”

- `explain_format`

  <table summary="Propriedades para admin_ssl_crl"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crl=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crl</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>9

  Essa variável determina o formato de saída padrão usado pelo `EXPLAIN` na ausência de uma opção `FORMAT` ao exibir um plano de execução de consulta. Os valores possíveis e seus efeitos estão listados aqui:

  - `TRADITIONAL`: Use a saída tradicional de tabelas do MySQL, como se `FORMAT=TRADITIONAL` tivesse sido especificado como parte da instrução `EXPLAIN`. Este é o valor padrão da variável. `DEFAULT` também é suportado como sinônimo de `TRADITIONAL`, e tem exatamente o mesmo efeito.

    Nota

    `DEFAULT` não pode ser usado como parte da opção `FORMAT` de uma declaração `EXPLAIN`.

  - `JSON`: Use o formato de saída JSON, como se `FORMAT=JSON` tivesse sido especificado.

  - `TREE`: Use o formato de saída baseado em árvore, como se `FORMAT=TREE` tivesse sido especificado.

  O ambiente para essa variável também afeta `EXPLAIN ANALYZE`. Para esse propósito, `DEFAULT` e `TRADITIONAL` são interpretados como `TREE`. Se o valor de `explain_format` for `JSON` e uma instrução `EXPLAIN ANALYZE` sem a opção `FORMAT` for emitida, a instrução gera um erro (`ER_NOT_SUPPORTED_YET`).

  O uso de um especificador de formato com `EXPLAIN` ou `EXPLAIN ANALYZE` substitui qualquer configuração para `explain_format`.

  A variável de sistema `explain_format` não tem efeito na saída `EXPLAIN` quando esta declaração é usada para exibir informações sobre as colunas da tabela.

  Definir o valor da sessão de `explain_format` não requer privilégios especiais; definí-lo em nível global requer `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`). Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

  Para obter mais informações e exemplos, consulte Obtenção de informações sobre o plano de execução.

- `explicit_defaults_for_timestamp`

  <table summary="Propriedades para admin_ssl_crlpath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crlpath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>0

  Esta variável de sistema determina se o servidor habilita certos comportamentos não padrão para valores padrão e o tratamento de valores de `NULL` em colunas de `TIMESTAMP`. Por padrão, `explicit_defaults_for_timestamp` está habilitado, o que desabilita os comportamentos não padrão. Desabilitar `explicit_defaults_for_timestamp` resulta em um aviso.

  A partir do MySQL 8.0.18, definir o valor da sessão desta variável do sistema deixou de ser uma operação restrita.

  Se `explicit_defaults_for_timestamp` estiver desativado, o servidor habilita os comportamentos não padrão e trata as colunas `TIMESTAMP` da seguinte forma:

  - Colunas `TIMESTAMP` não explicitamente declaradas com o atributo `NULL` são declaradas automaticamente com o atributo `NOT NULL`. Atribuir um valor de `NULL` a uma coluna dessa forma é permitido e define a coluna para o timestamp atual. *Exceção*: A partir do MySQL 8.0.22, tentar inserir `NULL` em uma coluna gerada declarada como `TIMESTAMP NOT NULL` é rejeitado com um erro.

  - A primeira coluna `TIMESTAMP` em uma tabela, se não for declarada explicitamente com o atributo `NULL` ou um atributo `DEFAULT` ou `ON UPDATE` explícito, é declarada automaticamente com os atributos `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP`.

  - Colunas que seguem a primeira, se não forem declaradas explicitamente com o atributo `NULL` ou um atributo `DEFAULT` explícito, são declaradas automaticamente como `DEFAULT '0000-00-00 00:00:00'` (o timestamp “zero”). Para linhas inseridas que não especificam um valor explícito para uma coluna desse tipo, a coluna é atribuída a `'0000-00-00 00:00:00'` e nenhum aviso ocorre.

    Dependendo se o modo SQL rigoroso ou o modo SQL `NO_ZERO_DATE` está habilitado, um valor padrão de `'0000-00-00 00:00:00'` pode ser inválido. Tenha em mente que o modo SQL `TRADITIONAL` inclui o modo rigoroso e `NO_ZERO_DATE`. Consulte a Seção 7.1.11, “Modos SQL do Servidor”.

  Os comportamentos não padrão descritos acima estão sendo desaconselhados; espere-os serem removidos em uma futura versão do MySQL.

  Se `explicit_defaults_for_timestamp` estiver habilitado, o servidor desabilita os comportamentos não padrão e trata as colunas `TIMESTAMP` da seguinte forma:

  - Não é possível atribuir um valor de `TIMESTAMP` a uma coluna `NULL` para configurá-la como o timestamp atual. Para atribuir o timestamp atual, configure a coluna para `CURRENT_TIMESTAMP` ou um sinônimo como `NOW()`.

  - Colunas `TIMESTAMP` que não são explicitamente declaradas com o atributo `NOT NULL` são automaticamente declaradas com o atributo `NULL` e permitem valores `NULL`. Ao atribuir um valor a essa coluna de `NULL`, ela é definida como `NULL`, e não pelo timestamp atual.

  - Colunas declaradas com o atributo `NOT NULL` que contêm valores de `NULL` não são permitidos. Para inserções que especificam `NULL` para uma coluna desse tipo, o resultado é um erro para uma inserção de uma única linha se o modo SQL rigoroso estiver ativado, ou `'0000-00-00 00:00:00'` é inserido para inserções de várias linhas com o modo SQL rigoroso desativado. Em nenhum caso, atribuir um valor de `NULL` à coluna o configura para o timestamp atual.

  - Colunas `TIMESTAMP` explicitamente declaradas com o atributo `NOT NULL` e sem um atributo `DEFAULT` explícito são tratadas como não tendo valor padrão. Para linhas inseridas que não especificam um valor explícito para uma coluna desse tipo, o resultado depende do modo SQL. Se o modo SQL rigoroso estiver habilitado, ocorre um erro. Se o modo SQL rigoroso não estiver habilitado, a coluna é declarada com o valor padrão implícito de `'0000-00-00 00:00:00'` e uma mensagem de aviso é exibida. Isso é semelhante ao tratamento que o MySQL dá a outros tipos temporais, como `DATETIME`.

  - Não há uma coluna `TIMESTAMP` declarada automaticamente com os atributos `DEFAULT CURRENT_TIMESTAMP` ou `ON UPDATE CURRENT_TIMESTAMP`. Esses atributos devem ser especificados explicitamente.

  - A primeira coluna `TIMESTAMP` em uma tabela não é tratada de maneira diferente das colunas `TIMESTAMP` que vêm após a primeira.

  Se `explicit_defaults_for_timestamp` for desativado durante a inicialização do servidor, este aviso aparecerá no log de erro:

  ```
  [Warning] TIMESTAMP with implicit DEFAULT value is deprecated.
  Please use --explicit_defaults_for_timestamp server option (see
  documentation for more details).
  ```

  Como indicado pelo aviso, para desabilitar os comportamentos não padrão obsoletos, habilite a variável de sistema `explicit_defaults_for_timestamp` no início do servidor.

  Nota

  `explicit_defaults_for_timestamp` é ele mesmo desatualizado porque seu único propósito é permitir o controle sobre comportamentos desatualizados `TIMESTAMP` que serão removidos em uma futura versão do MySQL. Quando esses comportamentos forem removidos, espere que `explicit_defaults_for_timestamp` também seja removido.

  Para obter informações adicionais, consulte a Seção 13.2.5, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

- `external_user`

  <table summary="Propriedades para admin_ssl_crlpath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crlpath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>1

  O nome de usuário externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com autenticação nativa (incorporada) do MySQL ou se o plugin não definir o valor, essa variável é `NULL`. Veja a Seção 8.2.19, “Usuários de Proxy”.

- `flush`

  <table summary="Propriedades para admin_ssl_crlpath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crlpath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>2

  Aplica-se apenas ao MyISAM.

  Se `ON`, o servidor esvazia (sincroniza) todas as alterações no disco após cada instrução SQL. Normalmente, o MySQL escreve todas as alterações no disco apenas após cada instrução SQL e deixa o sistema operacional lidar com a sincronização com o disco. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”. Esta variável é definida como `ON` se você iniciar o **mysqld** com a opção `--flush`.

  Nota

  Se `flush` estiver habilitado, o valor de `flush_time` não importa e as alterações para `flush_time` não afetam o comportamento de limpeza.

- `flush_time`

  <table summary="Propriedades para admin_ssl_crlpath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crlpath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>3

  Se este valor for diferente de zero, todas as tabelas serão fechadas a cada `flush_time` segundos para liberar recursos e sincronizar dados não limpos no disco. Esta opção é melhor usada apenas em sistemas com recursos mínimos.

  Nota

  Se `flush` estiver habilitado, o valor de `flush_time` não importa e as alterações para `flush_time` não afetam o comportamento de limpeza.

- `foreign_key_checks`

  <table summary="Propriedades para admin_ssl_crlpath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crlpath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>4

  Se definido para 1 (o padrão), as restrições de chave estrangeira são verificadas. Se definido para 0, as restrições de chave estrangeira são ignoradas, com algumas exceções. Ao recriar uma tabela que foi excluída, um erro é retornado se a definição da tabela não atender às restrições de chave estrangeira que a referenciam. Da mesma forma, uma operação `ALTER TABLE` retorna um erro se uma definição de chave estrangeira for formada incorretamente. Para mais informações, consulte a Seção 15.1.20.5, “Restrições de Chave Estrangeira”.

  Definir essa variável tem o mesmo efeito nas tabelas `NDB` que nas tabelas `InnoDB`. Normalmente, você mantém essa configuração habilitada durante o funcionamento normal, para impor a integridade referencial. Desabilitar a verificação de chaves estrangeiras pode ser útil para recarregar as tabelas `InnoDB` em uma ordem diferente da exigida por suas relações pai/filho. Veja a Seção 15.1.20.5, “Restrições de Chave Estrangeira”.

  Definir `foreign_key_checks` para 0 também afeta as declarações de definição de dados: `DROP SCHEMA` exclui um esquema, mesmo que ele contenha tabelas que têm chaves estrangeiras referenciadas por tabelas fora do esquema, e `DROP TABLE` exclui tabelas que têm chaves estrangeiras referenciadas por outras tabelas.

  Nota

  Definir `foreign_key_checks` para 1 não aciona uma varredura dos dados da tabela existente. Portanto, as linhas adicionadas à tabela enquanto `foreign_key_checks = 0` estão não verificadas quanto à consistência.

  Não é permitido excluir um índice exigido por uma restrição de chave estrangeira, mesmo com `foreign_key_checks=0`. A restrição de chave estrangeira deve ser removida antes de excluir o índice.

- `ft_boolean_syntax`

  <table summary="Propriedades para admin_ssl_crlpath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crlpath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>5

  A lista de operadores suportados por pesquisas de texto completo booleanas realizadas usando `IN BOOLEAN MODE`. Veja a Seção 14.9.2, “Pesquisas de Texto Completo Booleanas”.

  O valor padrão da variável é `'+ -><()~*:""&|'`. As regras para alterar o valor são as seguintes:

  - A função do operador é determinada pela posição dentro da string.

  - O valor de substituição deve ser de 14 caracteres.

  - Cada caractere deve ser um caractere não alfanumérico ASCII.

  - O primeiro ou o segundo caractere deve ser um espaço.

  - Não são permitidas duplicações, exceto nas frases que citam operadores nas posições 11 e 12. Esses dois caracteres não precisam ser iguais, mas são os únicos que podem ser.

  - As posições 10, 13 e 14 (que, por padrão, estão configuradas como `:`, `&` e `|`) estão reservadas para futuras extensões.

- `ft_max_word_len`

  <table summary="Propriedades para admin_ssl_crlpath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crlpath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>6

  O comprimento máximo da palavra a ser incluída em um índice `MyISAM` `FULLTEXT`.

  Nota

  Os índices em `FULLTEXT` nas tabelas `MyISAM` devem ser reconstruídos após a alteração desta variável. Use `REPAIR TABLE tbl_name QUICK`.

- `ft_min_word_len`

  <table summary="Propriedades para admin_ssl_crlpath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crlpath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>7

  O comprimento mínimo da palavra a ser incluída em um índice `MyISAM` `FULLTEXT`.

  Nota

  Os índices em `FULLTEXT` nas tabelas `MyISAM` devem ser reconstruídos após a alteração desta variável. Use `REPAIR TABLE tbl_name QUICK`.

- `ft_query_expansion_limit`

  <table summary="Propriedades para admin_ssl_crlpath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crlpath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>8

  O número de partidas principais a serem usadas para pesquisas de texto completo realizadas usando `WITH QUERY EXPANSION`.

- `ft_stopword_file`

  <table summary="Propriedades para admin_ssl_crlpath"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_crlpath</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>9

  O arquivo a partir do qual ler a lista de palavras-chave para pesquisas de texto completo nas tabelas `MyISAM`. O servidor procura o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. Todas as palavras do arquivo são usadas; os comentários *não* são considerados. Por padrão, uma lista embutida de palavras-chave é usada (conforme definido no arquivo `storage/myisam/ft_static.c`). Definir essa variável como uma string vazia (`''`) desativa o filtro de palavras-chave. Veja também a Seção 14.9.4, “Palavras-chave de Texto Completo”.

  Nota

  Os índices `FULLTEXT` nas tabelas `MyISAM` devem ser reconstruídos após a alteração desta variável ou dos conteúdos do arquivo de palavras-chave. Use `REPAIR TABLE tbl_name QUICK`.

- `general_log`

  <table summary="Propriedades para admin_ssl_key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-key=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_key</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>0

  Se o log de consulta geral está habilitado. O valor pode ser 0 (ou `OFF`) para desabilitar o log ou 1 (ou `ON`) para habilitar o log. O destino para a saída do log é controlado pela variável de sistema `log_output`; se esse valor for `NONE`, nenhuma entrada de log é escrita, mesmo que o log esteja habilitado.

- `general_log_file`

  <table summary="Propriedades para admin_ssl_key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-key=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_key</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>1

  O nome do arquivo de log de consulta geral. O valor padrão é `host_name.log`, mas o valor inicial pode ser alterado com a opção `--general_log_file`.

- `generated_random_password_length`

  <table summary="Propriedades para admin_ssl_key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-key=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_key</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>2

  O número máximo de caracteres permitido em senhas aleatórias geradas para as declarações `CREATE USER`, `ALTER USER` e `SET PASSWORD`. Para mais informações, consulte Geração de Senha Aleatória.

- `global_connection_memory_limit`

  <table summary="Propriedades para admin_ssl_key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-key=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_key</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>3

  Defina o valor total de memória que pode ser usado por todas as conexões dos usuários; ou seja, `Global_connection_memory` não deve exceder esse valor. Toda vez que isso ocorrer, todas as consultas (incluindo as que estão sendo executadas) dos usuários regulares serão rejeitadas com `ER_GLOBAL_CONN_LIMIT`.

  A memória usada pelos usuários do sistema, como o usuário root do MySQL, está incluída nesse total, mas não é contabilizada para o limite de desconexão; esses usuários nunca são desconectados devido ao uso da memória.

  A memória usada pelo pool de buffers `InnoDB` é excluída do total.

  Você deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir essa variável.

- `global_connection_memory_tracking`

  <table summary="Propriedades para admin_ssl_key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-key=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_key</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>4

  Determina se o servidor calcula `Global_connection_memory`. Esta variável deve ser habilitada explicitamente; caso contrário, o cálculo da memória não será realizado e `Global_connection_memory` não será definido.

  Você deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir essa variável.

- `group_concat_max_len`

  <table summary="Propriedades para admin_ssl_key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-key=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_key</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>5

  O comprimento máximo permitido do resultado em bytes para a função `GROUP_CONCAT()`. O padrão é 1024.

- `have_compress`

  `YES` se a biblioteca de compressão `zlib` estiver disponível para o servidor, `NO` se não estiver. Caso contrário, as funções `COMPRESS()` e `UNCOMPRESS()` não podem ser usadas.

- `have_dynamic_loading`

  `YES` se o **mysqld** suportar o carregamento dinâmico de plugins, `NO` se não. Se o valor for `NO`, você não pode usar opções como `--plugin-load` para carregar plugins no início do servidor, ou a instrução `INSTALL PLUGIN` para carregar plugins em tempo de execução.

- `have_geometry`

  `YES` se o servidor suportar tipos de dados espaciais, `NO` se

- `have_openssl`

  Esta variável é sinônimo de `have_ssl`.

  A partir do MySQL 8.0.26, `have_openssl` está desatualizado e está sujeito à remoção em uma versão futura do MySQL. Para obter informações sobre as propriedades TLS das interfaces de conexão do MySQL, use a tabela `tls_channel_status`.

- `have_profiling`

  `YES` Se a capacidade de perfilamento de instruções if estiver presente, `NO` Se não estiver. Se estiver presente, a variável de sistema `profiling` controla se essa capacidade está habilitada ou desabilitada. Veja a Seção 15.7.7.31, “Instrução SHOW PROFILES”.

  Essa variável está desatualizada e você deve esperar que ela seja removida em uma futura versão do MySQL.

- `have_query_cache`

  O cache de consultas foi removido no MySQL 8.0.3. `have_query_cache` é desatualizado, sempre tem um valor de `NO`, e você deve esperar que ele seja removido em uma futura versão do MySQL.

- `have_rtree_keys`

  `YES` se os índices `RTREE` estiverem disponíveis, `NO` se não estiverem. (Estes são usados para índices espaciais em tabelas `MyISAM`.)

- `have_ssl`

  <table summary="Propriedades para admin_ssl_key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-key=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_key</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>6

  `YES` se o **mysqld** suportar conexões SSL, `DISABLED` se o servidor foi compilado com suporte SSL, mas não foi iniciado com as opções de criptografia de conexão apropriadas. Para mais informações, consulte a Seção 2.8.6, “Configurando Suporte à Biblioteca SSL”.

  A partir do MySQL 8.0.26, `have_ssl` está desatualizado e está sujeito à remoção em uma versão futura do MySQL. Para obter informações sobre as propriedades TLS das interfaces de conexão do MySQL, use a tabela `tls_channel_status`.

- `have_statement_timeout`

  <table summary="Propriedades para admin_ssl_key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-key=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_key</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>7

  Se a funcionalidade de limite de tempo de execução da declaração está disponível (consulte Dicas de otimização do tempo de execução da declaração). O valor pode ser `NO` se o thread de fundo usado por essa funcionalidade não puder ser inicializado.

- `have_symlink`

  `YES` se o suporte a links simbólicos estiver habilitado, `NO` se não estiver. Isso é necessário no Unix para o suporte às opções de tabelas `DATA DIRECTORY` e `INDEX DIRECTORY`. Se o servidor for iniciado com a opção `--skip-symbolic-links`, o valor é `DISABLED`.

  Essa variável não tem significado no Windows.

  Nota

  O suporte a links simbólicos, juntamente com a opção `--symbolic-links` que o controla, está desatualizado; espere que esses sejam removidos em uma versão futura do MySQL. Além disso, a opção está desativada por padrão. A variável de sistema `have_symlink` relacionada também está desatualizada e você deve esperar que ela seja removida em uma versão futura do MySQL.

- `histogram_generation_max_mem_size`

  <table summary="Propriedades para admin_ssl_key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-key=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_key</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>8

  O valor máximo de memória disponível para gerar estatísticas de histogramas. Consulte a Seção 10.9.6, “Estatísticas do otimizador”, e a Seção 15.7.3.1, “Instrução ANALYZE TABLE”.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `host_cache_size`

  <table summary="Propriedades para admin_ssl_key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-key=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_key</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>9

  O servidor MySQL mantém um cache de hosts em memória que contém informações sobre o nome do host e o endereço IP do cliente e é usado para evitar consultas no Sistema de Nomes de Domínio (DNS); consulte a Seção 7.1.12.3, “Consultas DNS e o Cache de Hosts”.

  A variável `host_cache_size` controla o tamanho do cache do host, bem como o tamanho da tabela do Schema de Desempenho `host_cache` que expõe o conteúdo do cache. Definir `host_cache_size` tem esses efeitos:

  - Definir o tamanho para 0 desabilita o cache do host. Com o cache desativado, o servidor realiza uma pesquisa DNS toda vez que um cliente se conecta.

  - Alterar o tamanho em tempo de execução causa uma operação de limpeza implícita do cache do host, que limpa o cache do host, trunca a tabela `host_cache` e desbloqueia quaisquer hosts bloqueados.

  O valor padrão é dimensionado automaticamente para 128, mais 1 para um valor de `max_connections` até 500, mais 1 para cada incremento de 20 acima de 500 no valor de `max_connections`, limitado a um limite de 2000.

  Usar a opção `--skip-host-cache` é semelhante a definir a variável de sistema `host_cache_size` para 0, mas `host_cache_size` é mais flexível porque também pode ser usado para redimensionar, habilitar e desabilitar o cache do host em tempo de execução, não apenas no início do servidor.

  Iniciar o servidor com `--skip-host-cache` não impede alterações no valor de `host_cache_size` durante a execução, mas essas alterações não têm efeito e o cache não é reativado, mesmo que `host_cache_size` seja definido maior que 0.

  É preferível definir a variável de sistema `host_cache_size` em vez da opção `--skip-host-cache`, pelas razões mencionadas no parágrafo anterior. Além disso, a opção `--skip-host-cache` está desatualizada e sua remoção é esperada em uma versão futura do MySQL; no MySQL 8.0.29 e versões posteriores, o uso da opção gera uma mensagem de alerta.

- `hostname`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>00

  O servidor define essa variável com o nome do host do servidor durante a inicialização. O comprimento máximo é de 255 caracteres a partir do MySQL 8.0.17, conforme a RFC 1034, e 60 caracteres antes disso.

- `identity`

  Essa variável é sinônimo da variável `last_insert_id`. Ela existe para compatibilidade com outros sistemas de banco de dados. Você pode ler seu valor com `SELECT @@identity` e configurá-la com `SET identity`.

- `init_connect`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>01

  Uma cadeia a ser executada pelo servidor para cada cliente que se conecta. A cadeia consiste em uma ou mais instruções SQL, separadas por caracteres ponto e vírgula.

  Para os usuários que possuem o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`), o conteúdo de `init_connect` não é executado. Isso é feito para evitar que um valor incorreto para `init_connect` impeça que todos os clientes se conectem. Por exemplo, o valor pode conter uma declaração com um erro sintático, causando o falha da conexão do cliente. Não executar `init_connect` para usuários que possuem o privilégio `CONNECTION_ADMIN` ou `SUPER` permite que eles abram uma conexão e corrijam o valor de `init_connect`.

  A execução de `init_connect` é ignorada para qualquer usuário do cliente com uma senha expirada. Isso é feito porque um usuário com uma senha expirada não pode executar instruções arbitrárias, e, portanto, a execução de `init_connect` falha, deixando o cliente incapaz de se conectar. Ignorar a execução de `init_connect` permite que o usuário se conecte e mude a senha.

  O servidor descarta quaisquer conjuntos de resultados produzidos por declarações no valor de `init_connect`.

- `information_schema_stats_expiry`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>02

  Algumas tabelas `INFORMATION_SCHEMA` contêm colunas que fornecem estatísticas da tabela:

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

  Essas colunas representam metadados dinâmicos da tabela; ou seja, informações que mudam conforme o conteúdo da tabela muda.

  Por padrão, o MySQL recupera valores armazenados em cache para essas colunas das tabelas de dicionário `mysql.index_stats` e `mysql.table_stats` quando as colunas são consultadas, o que é mais eficiente do que recuperar estatísticas diretamente do mecanismo de armazenamento. Se as estatísticas armazenadas em cache não estiverem disponíveis ou tiverem expirado, o MySQL recupera as estatísticas mais recentes do mecanismo de armazenamento e as armazena nas tabelas de dicionário `mysql.index_stats` e `mysql.table_stats`. Consultas subsequentes recuperam as estatísticas armazenadas em cache até que as estatísticas armazenadas em cache expirem. Uma reinicialização do servidor ou a primeira abertura das tabelas `mysql.index_stats` e `mysql.table_stats` não atualizam automaticamente as estatísticas armazenadas em cache.

  A variável de sessão `information_schema_stats_expiry` define o período de tempo antes que as estatísticas armazenadas em cache expiram. O valor padrão é de 86400 segundos (24 horas), mas o período de tempo pode ser estendido por até um ano.

  Para atualizar os valores armazenados em cache a qualquer momento para uma tabela específica, use `ANALYZE TABLE`.

  Para sempre recuperar as estatísticas mais recentes diretamente do motor de armazenamento e ignorar os valores armazenados em cache, defina `information_schema_stats_expiry` para `0`.

  A consulta de colunas de estatísticas não armazena nem atualiza estatísticas nas tabelas de dicionário `mysql.index_stats` e `mysql.table_stats` nessas circunstâncias:

  - Quando as estatísticas armazenadas em cache não expiraram.

  - Quando `information_schema_stats_expiry` estiver definido como 0.

  - Quando o servidor estiver no modo `read_only`, `super_read_only`, `transaction_read_only` ou `innodb_read_only`.

  - Quando a consulta também recupera dados do Gerenciamento de Desempenho.

  O cache de estatísticas pode ser atualizado durante uma transação com múltiplas instruções antes de se saber se a transação será confirmada. Como resultado, o cache pode conter informações que não correspondem a um estado confirmado conhecido. Isso pode ocorrer com `autocommit=0` ou após `START TRANSACTION`.

  `information_schema_stats_expiry` é uma variável de sessão, e cada sessão de cliente pode definir seu próprio valor de expiração. Estatísticas recuperadas do motor de armazenamento e armazenadas em cache por uma sessão estão disponíveis para outras sessões.

  Para informações relacionadas, consulte a Seção 10.2.3, “Otimizando consultas do INFORMATION\_SCHEMA”.

- `init_file`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>03

  Se especificado, essa variável nomeia um arquivo que contém instruções SQL a serem lidas e executadas durante o processo de inicialização. Antes do MySQL 8.0.18, cada instrução deve estar em uma única linha e não deve incluir comentários. A partir do MySQL 8.0.18, o formato aceitável para as instruções no arquivo é expandido para suportar essas construções:

  - `delimiter ;`, para definir o delimitador de declaração como o caractere `;`.

  - `delimiter $$`, para definir o delimitador de declaração na sequência de caracteres `$$`.

  - Várias declarações na mesma linha, delimitadas pelo delimitador atual.

  - Declarações de várias linhas.

  - Comentários de um personagem `#` até o final da linha.

  - Comentários de uma sequência `--` até o final da linha.

  - Comentários em estilo C de uma sequência `/*` para a sequência `*/` seguinte, incluindo em várias linhas.

  - Literal de string de várias linhas, encerrado por aspas simples (`'`) ou duplas (`"`).

  Se o servidor for iniciado com a opção `--initialize` ou `--initialize-insecure`, ele opera no modo de inicialização e algumas funcionalidades estão indisponíveis, o que limita as instruções permitidas no arquivo. Essas incluem instruções relacionadas à gestão de contas (como `CREATE USER` ou `GRANT`), replicação e identificadores de transações globais. Consulte a Seção 19.1.3, “Replicação com Identificadores de Transações Globais”.

  A partir do MySQL 8.0.17, os threads criados durante o inicialização do servidor são usados para tarefas como a criação do dicionário de dados, execução de procedimentos de atualização e criação de tabelas do sistema. Para garantir um ambiente estável e previsível, esses threads são executados com os valores padrão embutidos no servidor para algumas variáveis do sistema, como `sql_mode`, `character_set_server`, `collation_server`, `completion_type`, `explicit_defaults_for_timestamp` e `default_table_encryption`.

  Esses trechos também são usados para executar as instruções em qualquer arquivo especificado com `init_file` ao iniciar o servidor, portanto, essas instruções são executadas com os valores padrão embutidos do servidor para essas variáveis de sistema.

- `innodb_xxx`

  As variáveis de sistema `InnoDB` estão listadas na Seção 17.14, “Opções de Inicialização e Variáveis de Sistema do InnoDB”. Essas variáveis controlam muitos aspectos do armazenamento, uso de memória e padrões de E/S para as tabelas `InnoDB`, e são especialmente importantes agora que `InnoDB` é o motor de armazenamento padrão.

- `insert_id`

  O valor a ser utilizado pela seguinte declaração `INSERT` ou `ALTER TABLE` ao inserir um valor `AUTO_INCREMENT`. Isso é usado principalmente com o log binário.

- `interactive_timeout`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>04

  O número de segundos que o servidor espera por atividade em uma conexão interativa antes de fechá-la. Um cliente interativo é definido como um cliente que usa a opção `CLIENT_INTERACTIVE` para `mysql_real_connect()`. Veja também `wait_timeout`.

- `internal_tmp_disk_storage_engine`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>05

  Importante

  No MySQL 8.0.16 e versões posteriores, as tabelas temporárias internas no disco sempre usam o mecanismo de armazenamento `InnoDB`; a partir do MySQL 8.0.16, essa variável foi removida e, portanto, não é mais suportada.

  Antes do MySQL 8.0.16, essa variável determina o mecanismo de armazenamento usado para tabelas temporárias internas no disco (consulte Mecanismo de Armazenamento para Tabelas Temporárias Internas no Disco). Os valores permitidos são `MYISAM` e `INNODB` (o padrão).

- `internal_tmp_mem_storage_engine`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>06

  O mecanismo de armazenamento para tabelas temporárias internas de memória (consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”). Os valores permitidos são `TempTable` (o padrão) e `MEMORY`.

  O otimizador usa o mecanismo de armazenamento definido por `internal_tmp_mem_storage_engine` para tabelas temporárias internas de memória.

  A partir do MySQL 8.0.27, a configuração de um ajuste de sessão para `internal_tmp_mem_storage_engine` requer o privilégio `SESSION_VARIABLES_ADMIN` ou `SYSTEM_VARIABLES_ADMIN`.

- `join_buffer_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>07

  O tamanho mínimo do buffer usado para varreduras de índice simples, varreduras de índice de intervalo e junções que não usam índices e, portanto, realizam varreduras completas da tabela. No MySQL 8.0.18 e versões posteriores, essa variável também controla a quantidade de memória usada para junções hash. Normalmente, a melhor maneira de obter junções rápidas é adicionar índices. Aumente o valor de `join_buffer_size` para obter uma junção completa mais rápida quando não for possível adicionar índices. Um buffer de junção é alocado para cada junção completa entre duas tabelas. Para uma junção complexa entre várias tabelas para as quais não são usados índices, pode ser necessário múltiplos buffers de junção.

  O padrão é de 256KB. O ajuste máximo permitido para `join_buffer_size` é de 4GB−1. Valores maiores são permitidos para plataformas de 64 bits (exceto o Windows de 64 bits, para o qual valores grandes são truncados para 4GB−1 com uma advertência). O tamanho do bloco é de 128, e um valor que não seja um múltiplo exato do tamanho do bloco é arredondado para o próximo múltiplo inferior do tamanho do bloco pelo MySQL Server antes de armazenar o valor para a variável do sistema. O analisador permite valores até o valor máximo de inteiro não assinado para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits), mas o máximo real é um tamanho de bloco menor.

  A menos que seja usado um algoritmo de Bloco em Rede ou Acesso a Chave em Massa, não há vantagem em definir o buffer maior do que o necessário para armazenar cada linha correspondente, e todas as junções alocam pelo menos o tamanho mínimo, então use cautela ao definir essa variável para um valor grande globalmente. É melhor manter o ajuste global pequeno e alterar o ajuste da sessão para um valor maior apenas em sessões que realizam junções grandes, ou alterar o ajuste por consulta usando uma dica de otimizador `SET_VAR` (consulte a Seção 10.9.3, “Dicas de Otimizador”). O tempo de alocação de memória pode causar quedas substanciais de desempenho se o tamanho global for maior do que o necessário para a maioria das consultas que o utilizam.

  Quando o Bloco de Loop Aninhado é usado, um buffer de junção maior pode ser benéfico até o ponto em que todas as colunas necessárias de todas as linhas da primeira tabela estejam armazenadas no buffer de junção. Isso depende da consulta; o tamanho ótimo pode ser menor do que o de manter todas as linhas das primeiras tabelas.

  Quando o acesso por chave em lote é usado, o valor de `join_buffer_size` define o tamanho do lote de chaves em cada solicitação ao motor de armazenamento. Quanto maior o buffer, mais acesso sequencial é feito à tabela da direita de uma operação de junção, o que pode melhorar significativamente o desempenho.

  Para obter informações adicionais sobre a junção de buffer, consulte a Seção 10.2.1.7, “Algoritmos de Junção de Loop Aninhado”. Para informações sobre o Acesso a Chave em Batel, consulte a Seção 10.2.1.12, “Junções de Loop Aninhado em Bloco e Acesso a Chave em Batel”. Para informações sobre junções de hash, consulte a Seção 10.2.1.4, “Otimização de Junção de Hash”.

- `keep_files_on_create`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>08

  Se uma tabela `MyISAM` for criada sem a opção `DATA DIRECTORY`, o arquivo `.MYD` será criado no diretório do banco de dados. Por padrão, se `MyISAM` encontrar um arquivo existente `.MYD` neste caso, ele o sobrescreverá. O mesmo se aplica aos arquivos `.MYI` para tabelas criadas sem a opção `INDEX DIRECTORY`. Para suprimir esse comportamento, defina a variável `keep_files_on_create` para `ON` (1), caso em que `MyISAM` não sobrescreverá arquivos existentes e retornará um erro. O valor padrão é `OFF` (0).

  Se uma tabela `MyISAM` for criada com a opção `DATA DIRECTORY` ou `INDEX DIRECTORY` e um arquivo existente `.MYD` ou `.MYI` for encontrado, o MyISAM sempre retorna um erro. Ele não sobrescreve um arquivo no diretório especificado.

- `key_buffer_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>09

  Os blocos de índice para as tabelas `MyISAM` são armazenados em cache e são compartilhados por todos os threads. `key_buffer_size` é o tamanho do buffer usado para os blocos de índice. O buffer de chave também é conhecido como cache de chave.

  O ajuste mínimo permitido é 0, mas você não pode definir `key_buffer_size` para 0 dinamicamente. Um ajuste de 0 elimina o cache de chaves, o que não é permitido durante a execução. Definir `key_buffer_size` para 0 é permitido apenas no início, caso em que o cache de chaves não é inicializado. Alterar o ajuste `key_buffer_size` durante a execução de um valor de 0 para um valor não nulo permitido inicializa o cache de chaves.

  `key_buffer_size` pode ser aumentado ou diminuído apenas em incrementos ou múltiplos de 4096 bytes. Aumentar ou diminuir o ajuste por um valor não compatível produz uma mensagem de alerta e trunca o ajuste para um valor compatível.

  O ajuste máximo permitido para `key_buffer_size` é de 4GB−1 em plataformas de 32 bits. Valores maiores são permitidos em plataformas de 64 bits. O tamanho máximo efetivo pode ser menor, dependendo da RAM física disponível e dos limites de RAM por processo impostos pelo sistema operacional ou pela plataforma de hardware. O valor desta variável indica a quantidade de memória solicitada. Internamente, o servidor aloca a maior quantidade de memória possível até esse valor, mas a alocação real pode ser menor.

  Você pode aumentar o valor para obter uma melhor manipulação do índice para todas as leituras e múltiplos escritos; em um sistema cuja função principal é executar o MySQL usando o mecanismo de armazenamento `MyISAM`, 25% da memória total da máquina é um valor aceitável para essa variável. No entanto, você deve estar ciente de que, se você aumentar o valor muito (por exemplo, mais de 50% da memória total da máquina), seu sistema pode começar a fazer paginação e se tornar extremamente lento. Isso ocorre porque o MySQL depende do sistema operacional para realizar o cache do sistema de arquivos para leituras de dados, então você deve deixar um pouco de espaço para o cache do sistema de arquivos. Você também deve considerar os requisitos de memória de quaisquer outros mecanismos de armazenamento que você possa estar usando além de `MyISAM`.

  Para obter ainda mais velocidade ao escrever muitas linhas ao mesmo tempo, use `LOCK TABLES`. Veja a Seção 10.2.5.1, “Otimizando instruções INSERT”.

  Você pode verificar o desempenho do buffer de chave emitindo uma declaração `SHOW STATUS` e examinando as variáveis de status `Key_read_requests`, `Key_reads`, `Key_write_requests` e `Key_writes`. (Veja a Seção 15.7.7, “Declarações SHOW”.) A razão `Key_reads/Key_read_requests` normalmente deve ser menor que 0,01. A razão `Key_writes/Key_write_requests` geralmente está próxima de 1 se você estiver usando principalmente atualizações e exclusões, mas pode ser muito menor se você tiver a tendência de fazer atualizações que afetam muitas linhas ao mesmo tempo ou se estiver usando a opção de tabela `DELAY_KEY_WRITE`.

  A fração do buffer de chave em uso pode ser determinada usando `key_buffer_size` em conjunto com a variável de status `Key_blocks_unused` e o tamanho do bloco do buffer, que está disponível na variável de sistema `key_cache_block_size`:

  ```
  1 - ((Key_blocks_unused * key_cache_block_size) / key_buffer_size)
  ```

  Esse valor é uma aproximação, pois um espaço interno é alocado para estruturas administrativas no buffer de chave. Os fatores que influenciam a quantidade de overhead dessas estruturas incluem o tamanho do bloco e o tamanho do ponteiro. À medida que o tamanho do bloco aumenta, a porcentagem do buffer de chave perdida para overhead tende a diminuir. Blocos maiores resultam em um menor número de operações de leitura (porque mais chaves são obtidas por leitura), mas, inversamente, um aumento nas leituras de chaves que não são examinadas (se nem todas as chaves de um bloco forem relevantes para uma consulta).

  É possível criar vários caches de chave `MyISAM`. O limite de tamanho de 4 GB aplica-se a cada cache individualmente, não como um grupo. Consulte a Seção 10.10.2, “O Cache de Chave MyISAM”.

- `key_cache_age_threshold`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>10

  Esse valor controla a redução dos buffers da sublista quente de um cache de chaves para a sublista quente. Valores menores fazem com que a redução ocorra mais rapidamente. O valor mínimo é 100. O valor padrão é 300. Veja a Seção 10.10.2, “O Cache de Chaves MyISAM”.

- `key_cache_block_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>11

  O tamanho em bytes dos blocos na cache de chaves. O valor padrão é 1024. Consulte a Seção 10.10.2, “A Cache de Chaves MyISAM”.

- `key_cache_division_limit`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>12

  O ponto de divisão entre as sublistas quentes e quentes da lista de cache de chave da memória cache. O valor é a porcentagem da lista de cache a ser usada para a sublista quente. Os valores permitidos variam de 1 a 100. O valor padrão é 100. Consulte a Seção 10.10.2, “O Cache de Chave MyISAM”.

- `large_files_support`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>13

  Se o **mysqld** foi compilado com opções para suporte a arquivos grandes.

- `large_pages`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>14

  Se o suporte para páginas grandes estiver habilitado (através da opção `--large-pages`). Consulte a Seção 10.12.3.3, “Habilitar Suporte para Páginas Grandes”.

- `large_page_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>15

  Se o suporte a páginas grandes estiver habilitado, isso mostrará o tamanho das páginas de memória. Páginas de memória grandes são suportadas apenas no Linux; em outras plataformas, o valor desta variável é sempre 0. Consulte a Seção 10.12.3.3, “Habilitar Suporte a Páginas Grandes”.

- `last_insert_id`

  O valor a ser retornado a partir de `LAST_INSERT_ID()`. Esse valor é armazenado no log binário quando você usa `LAST_INSERT_ID()` em uma instrução que atualiza uma tabela. Definir essa variável não atualiza o valor retornado pela função de API C `mysql_insert_id()`.

- `lc_messages`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>16

  O local a ser usado para mensagens de erro. O padrão é `en_US`. O servidor converte o argumento em um nome de idioma e o combina com o valor de `lc_messages_dir` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 12.12, “Definindo o Idioma da Mensagem de Erro”.

- `lc_messages_dir`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>17

  O diretório onde as mensagens de erro estão localizadas. O servidor usa o valor junto com o valor de `lc_messages` para determinar a localização do arquivo de mensagem de erro. Veja a Seção 12.12, “Definindo o idioma da mensagem de erro”.

- `lc_time_names`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>18

  Esta variável especifica o local que controla a linguagem usada para exibir os nomes e abreviações dos dias e meses. Esta variável afeta o resultado das funções `DATE_FORMAT()`, `DAYNAME()` e `MONTHNAME()`. Os nomes do local são valores no estilo POSIX, como `'ja_JP'` ou `'pt_BR'`. O valor padrão é `'en_US'`, independentemente da configuração do local do sistema. Para mais informações, consulte a Seção 12.16, “Suporte ao Local do MySQL Server”.

- `license`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>19

  O tipo de licença que o servidor tem.

- `local_infile`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>20

  Essa variável controla a capacidade do servidor `LOCAL` para as instruções `LOAD DATA`. Dependendo da configuração `local_infile`, o servidor pode recusar ou permitir o carregamento de dados locais por clientes que tenham `LOCAL` habilitado no lado do cliente.

  Para fazer com que o servidor explicitamente recusando ou permita as declarações `LOAD DATA LOCAL` (independentemente de como os programas e bibliotecas do cliente são configurados no momento da compilação ou execução), inicie o **mysqld** com `local_infile` desativado ou ativado, respectivamente. `local_infile` também pode ser definido em tempo de execução. Para mais informações, consulte a Seção 8.1.6, “Considerações de Segurança para LOAD DATA LOCAL”.

- `lock_wait_timeout`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>21

  Esta variável especifica o tempo de espera em segundos para tentativas de adquirir bloqueios de metadados. Os valores permitidos variam de 1 a 31536000 (1 ano). O valor padrão é 31536000.

  Esse tempo de espera se aplica a todas as declarações que utilizam bloqueios de metadados. Isso inclui operações DML e DDL em tabelas, visualizações, procedimentos armazenados e funções armazenadas, bem como as declarações `LOCK TABLES`, `FLUSH TABLES WITH READ LOCK` e `HANDLER`.

  Esse tempo de espera não se aplica a acessos implícitos a tabelas do sistema no banco de dados `mysql`, como as tabelas de concessão modificadas por instruções `GRANT` ou `REVOKE` ou instruções de registro de tabelas. O tempo de espera se aplica a tabelas do sistema acessadas diretamente, como com `SELECT` ou `UPDATE`.

  O valor de tempo de espera aplica-se separadamente para cada tentativa de bloqueio de metadados. Uma determinada declaração pode exigir mais de um bloqueio, portanto, é possível que a declaração fique bloqueada por mais tempo do que o valor `lock_wait_timeout` antes de relatar um erro de tempo de espera. Quando o tempo de espera de bloqueio ocorre, `ER_LOCK_WAIT_TIMEOUT` é relatado.

  `lock_wait_timeout` também define o tempo que uma declaração `LOCK INSTANCE FOR BACKUP` espera por um bloqueio antes de desistir.

- `locked_in_memory`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>22

  Se o **mysqld** foi bloqueado na memória com `--memlock`.

- `log_error`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>23

  O destino padrão do log de erros. Se o destino for o console, o valor é `stderr`. Caso contrário, o destino é um arquivo e o valor `log_error` é o nome do arquivo. Veja a Seção 7.4.2, “O Log de Erros”.

- `log_error_services`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>24

  Os componentes para habilitar o registro de erros. A variável pode conter uma lista com 0, 1 ou muitos elementos. No último caso, os elementos podem ser delimitados por ponto e vírgula ou (a partir do MySQL 8.0.12) por vírgula, opcionalmente seguida por espaço. Um determinado ajuste não pode usar tanto o ponto e vírgula quanto a vírgula como delimitador. A ordem dos componentes é importante porque o servidor executa os componentes na ordem listada.

  A partir do MySQL 8.0.30, qualquer componente carregável (não integrado) nomeado no `log_error_services` é carregado implicitamente se ele ainda não estiver carregado. Antes do MySQL 8.0.30, qualquer componente carregável (não integrado) nomeado no valor `log_error_services` deve ser instalado primeiro com `INSTALL COMPONENT`. Para mais informações, consulte a Seção 7.4.2.1, “Configuração do Log de Erros”.

- `log_error_suppression_list`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>25

  A variável de sistema `log_error_suppression_list` aplica-se a eventos destinados ao log de erros e especifica quais eventos devem ser suprimidos quando ocorrem com uma prioridade de `WARNING` ou `INFORMATION`. Por exemplo, se um determinado tipo de aviso é considerado um "ruído" indesejável no log de erros porque ocorre frequentemente, mas não é de interesse, ele pode ser suprimido. Esta variável afeta o filtro realizado pelo componente de filtro do log de erros `log_filter_internal`, que é ativado por padrão (veja a Seção 7.5.3, “Componentes do Log de Erros”). Se `log_filter_internal` for desativado, `log_error_suppression_list` não tem efeito.

  O valor `log_error_suppression_list` pode ser uma string vazia para nenhuma supressão ou uma lista de um ou mais valores separados por vírgula que indicam os códigos de erro a serem suprimidos. Os códigos de erro podem ser especificados em forma simbólica ou numérica. Um código numérico pode ser especificado com ou sem o prefixo `MY-`. Zeros iniciais na parte numérica não são significativos. Exemplos de formatos de código permitidos:

  ```
  ER_SERVER_SHUTDOWN_COMPLETE
  MY-000031
  000031
  MY-31
  31
  ```

  Os valores simbólicos são preferíveis aos valores numéricos para melhorar a legibilidade e a portabilidade. Para obter informações sobre os símbolos e números de erro permitidos, consulte o Referência de Mensagens de Erro do MySQL 8.0.

  O efeito de `log_error_suppression_list` se combina com o de `log_error_verbosity`. Para obter informações adicionais, consulte a Seção 7.4.2.5, “Filtragem do Log de Erros Baseada em Prioridade (log\_filter\_internal)”.

- `log_error_verbosity`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>26

  A variável de sistema `log_error_verbosity` especifica a granularidade para o tratamento de eventos destinados ao log de erros. Essa variável afeta o filtro realizado pelo componente de filtro do log de erros `log_filter_internal`, que é ativado por padrão (consulte a Seção 7.5.3, “Componentes do Log de Erros”). Se `log_filter_internal` estiver desativado, `log_error_verbosity` não terá efeito.

  Os eventos destinados ao log de erros têm uma prioridade de `ERROR`, `WARNING` ou `INFORMATION`. `log_error_verbosity` controla a verbosidade com base nas prioridades permitidas para as mensagens escritas no log, conforme mostrado na tabela a seguir.

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>27

  Há também uma prioridade de `SYSTEM`. Mensagens do sistema sobre situações não de erro são impressas no log de erro, independentemente do valor de `log_error_verbosity`. Essas mensagens incluem mensagens de inicialização e desligamento, e algumas mudanças significativas nas configurações.

  O efeito de `log_error_verbosity` se combina com o de `log_error_suppression_list`. Para obter informações adicionais, consulte a Seção 7.4.2.5, “Filtragem do Log de Erros Baseada em Prioridade (log\_filter\_internal)”.

- `log_output`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>28

  O(s) destino(s) para o registro de consultas gerais e o registro de consultas lentas. O valor é uma lista de uma ou mais palavras separadas por vírgula escolhidas entre `TABLE`, `FILE` e `NONE`. `TABLE` seleciona o registro para as tabelas `general_log` e `slow_log` no esquema de sistema `mysql`. `FILE` seleciona o registro para arquivos de log. `NONE` desabilita o registro. Se `NONE` estiver presente no valor, ele terá precedência sobre quaisquer outras palavras presentes. `TABLE` e `FILE` podem ser usados para selecionar ambos os destinos de saída de log.

  Essa variável seleciona destinos de saída de log, mas não habilita a saída de log. Para isso, habilite as variáveis de sistema `general_log` e `slow_query_log`. Para o registro de `FILE`, as variáveis de sistema `general_log_file` e `slow_query_log_file` determinam os locais dos arquivos de log. Para mais informações, consulte a Seção 7.4.1, “Selecionando destinos de saída de log de consulta geral e log de consulta lenta”.

- `log_queries_not_using_indexes`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>29

  Se você ativar essa variável com o registro de consultas lentas ativado, as consultas que devem recuperar todas as linhas serão registradas. Veja a Seção 7.4.5, “O Registro de Consultas Lentas”. Essa opção não significa necessariamente que nenhum índice é usado. Por exemplo, uma consulta que usa uma varredura completa do índice usa um índice, mas seria registrada porque o índice não limitaria o número de linhas.

- `log_raw`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>30

  A variável de sistema `log_raw` é definida inicialmente com o valor da opção `--log-raw`. Consulte a descrição dessa opção para obter mais informações. A variável de sistema também pode ser definida em tempo de execução para alterar o comportamento de mascaramento da senha.

- `log_slow_admin_statements`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>31

  Inclua declarações administrativas lentas nas declarações escritas para o log de consultas lentas. As declarações administrativas incluem `ALTER TABLE`, `ANALYZE TABLE`, `CHECK TABLE`, `CREATE INDEX`, `DROP INDEX`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

- `log_slow_extra`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>32

  Se o registro de consultas lentas estiver habilitado e o destino de saída incluir `FILE`, o servidor escreve campos adicionais nas linhas do arquivo de log que fornecem informações sobre instruções lentas. Veja a Seção 7.4.5, “O Registro de Consultas Lentas”. A saída `TABLE` não é afetada.

- `log_syslog`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>33

  Antes do MySQL 8.0, essa variável controlava se o registro de erros seria feito no log do sistema (o Log de Eventos no Windows e `syslog` em sistemas Unix e Unix-like).

  No MySQL 8.0, o componente de registro `log_sink_syseventlog` implementa o registro de erros no log do sistema (veja a Seção 7.4.2.8, “Registro de Erros no Log do Sistema”), então esse tipo de registro pode ser habilitado adicionando esse componente à variável de sistema `log_error_services`. `log_syslog` é removido. (Antes do MySQL 8.0.13, `log_syslog` existe, mas é desatualizado e não tem efeito.)

- `log_syslog_facility`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>34

  Essa variável foi removida no MySQL 8.0.13 e substituída por `syseventlog.facility`.

- `log_syslog_include_pid`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>35

  Essa variável foi removida no MySQL 8.0.13 e substituída por `syseventlog.include_pid`.

- `log_syslog_tag`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>36

  Essa variável foi removida no MySQL 8.0.13 e substituída por `syseventlog.tag`.

- `log_timestamps`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>37

  Essa variável controla o fuso horário dos timestamps nas mensagens escritas no log de erros e, de forma geral, nas mensagens do log de consultas rápidas e do log de consultas lentas escritas em arquivos. Ela não afeta o fuso horário das mensagens do log de consultas rápidas e do log de consultas lentas escritas em tabelas (`mysql.general_log`, `mysql.slow_log`). As linhas recuperadas dessas tabelas podem ser convertidas do fuso horário do sistema local para qualquer fuso horário desejado com `CONVERT_TZ()` ou definindo a variável de sistema `time_zone` da sessão.

  Os valores permitidos `log_timestamps` são `UTC` (o padrão) e `SYSTEM` (o fuso horário do sistema local).

  Os timestamps são escritos no formato ISO 8601 / RFC 3339: `YYYY-MM-DDThh:mm:ss.uuuuuu` mais um valor de cauda de `Z` indicando a hora Zulu (UTC) ou `±hh:mm` (um deslocamento em relação ao UTC).

- `log_throttle_queries_not_using_indexes`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>38

  Se o `log_queries_not_using_indexes` estiver habilitado, a variável `log_throttle_queries_not_using_indexes` limita o número de consultas desse tipo por minuto que podem ser escritas no log de consultas lentas. Um valor de 0 (padrão) significa “sem limite”. Para mais informações, consulte a Seção 7.4.5, “O Log de Consultas Lentas”.

- `long_query_time`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>39

  Se uma consulta demorar mais do que esse número de segundos, o servidor incrementa a variável de status `Slow_queries`. Se o registro de consultas lentas estiver habilitado, a consulta é registrada no arquivo de registro de consultas lentas. Esse valor é medido em tempo real, não em tempo de CPU, portanto, uma consulta que está abaixo do limite em um sistema com carga leve pode estar acima do limite em um sistema com carga pesada. Os valores mínimo e padrão de `long_query_time` são 0 e 10, respectivamente. O máximo é 31536000, que é de 365 dias em segundos. O valor pode ser especificado com uma resolução de microsegundos. Veja a Seção 7.4.5, “O Registro de Consultas Lentas”.

  Valores menores dessa variável resultam em mais declarações sendo consideradas de longa duração, com o resultado de que mais espaço é necessário para o log de consultas lentas. Para valores muito pequenos (menos de um segundo), o log pode crescer bastante em um curto período de tempo. Aumentar o número de declarações consideradas de longa duração também pode resultar em falsos positivos para o alerta “Número excessivo de processos de longa duração” no MySQL Enterprise Monitor, especialmente se a Replicação por Grupo estiver habilitada. Por essas razões, valores muito pequenos devem ser usados apenas em ambientes de teste, ou, em ambientes de produção, apenas por um curto período.

  O **mysqldump** realiza uma varredura completa da tabela, o que significa que suas consultas podem frequentemente exceder um valor de `long_query_time` que é útil para consultas regulares. A partir do MySQL 8.0.30, se você quiser excluir a maioria ou todas as consultas do **mysqldump** do log de consultas lentas, você pode definir a opção de linha de comando **mysqldump** `--mysqld-long-query-time` para alterar o valor da variável de sistema da sessão para um valor mais alto.

- `low_priority_updates`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>40

  Se definido como `1`, todas as instruções `INSERT`, `UPDATE`, `DELETE` e `LOCK TABLE WRITE` aguardam até que não haja `SELECT` ou `LOCK TABLE READ` pendentes na tabela afetada. O mesmo efeito pode ser obtido usando `{INSERT | REPLACE | DELETE | UPDATE} LOW_PRIORITY ...` para diminuir a prioridade de apenas uma consulta. Esta variável afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`). Veja a Seção 10.11.2, “Problemas de Bloqueio de Tabela”.

  A partir do MySQL 8.0.27, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `lower_case_file_system`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>41

  Esta variável descreve a sensibilidade à maiúscula ou minúscula dos nomes de arquivos no sistema de arquivos onde o diretório de dados está localizado. `OFF` significa que os nomes de arquivos são sensíveis à maiúscula e minúscula, `ON` significa que não são sensíveis à maiúscula e minúscula. Esta variável é apenas de leitura porque reflete um atributo do sistema de arquivos e definir isso teria nenhum efeito no sistema de arquivos.

- `lower_case_table_names`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>42

  Se definido como 0, os nomes das tabelas são armazenados conforme especificado e as comparações são sensíveis ao caso. Se definido como 1, os nomes das tabelas são armazenados em minúsculas no disco e as comparações não são sensíveis ao caso. Se definido como 2, os nomes das tabelas são armazenados conforme fornecidos, mas comparados em minúsculas. Esta opção também se aplica aos nomes de banco de dados e aos aliases das tabelas. Para obter detalhes adicionais, consulte a Seção 11.2.3, “Sensibilidade ao Caso do Identificador”.

  O valor padrão desta variável depende da plataforma (consulte `lower_case_file_system`). No Linux e em outros sistemas Unix-like, o padrão é `0`. No Windows, o valor padrão é `1`. No macOS, o valor padrão é `2`. No Linux (e em outros sistemas Unix-like), definir o valor para `2` não é suportado; o servidor força o valor para `0` em vez disso.

  Você *não* deve definir `lower_case_table_names` para 0 se estiver executando o MySQL em um sistema onde o diretório de dados reside em um sistema de arquivos sensível a maiúsculas e minúsculas (como no Windows ou no macOS). É uma combinação não suportada que pode resultar em uma condição de travamento ao executar uma operação `INSERT INTO ... SELECT ... FROM tbl_name` com a letra `tbl_name` errada. Com `MyISAM`, o acesso aos nomes das tabelas usando diferentes maiúsculas e minúsculas pode causar corrupção de índices.

  Uma mensagem de erro é impressa e o servidor sai se você tentar iniciar o servidor com `--lower_case_table_names=0` em um sistema de arquivos sensível a maiúsculas e minúsculas.

  A definição desta variável afeta o comportamento das opções de filtragem de replicação em relação à sensibilidade de maiúsculas e minúsculas. Para mais informações, consulte a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”.

  É proibido iniciar o servidor com uma configuração `lower_case_table_names` diferente daquela usada quando o servidor foi inicializado. A restrição é necessária porque as codificações usadas por vários campos de tabelas do dicionário de dados são determinadas pela configuração definida quando o servidor é inicializado, e reiniciar o servidor com uma configuração diferente introduziria inconsistências em relação à ordem e comparação dos identificadores.

  Portanto, é necessário configurar `lower_case_table_names` para o ajuste desejado antes de inicializar o servidor. Na maioria dos casos, isso requer a configuração de `lower_case_table_names` em um arquivo de opção do MySQL antes de iniciar o servidor MySQL pela primeira vez. No entanto, para instalações APT em Debian e Ubuntu, o servidor é inicializado automaticamente, e não há oportunidade de configurar o ajuste em um arquivo de opção previamente. Portanto, você deve usar o utilitário `debconf-set-selection` antes de instalar o MySQL usando o APT para habilitar `lower_case_table_names`. Para fazer isso, execute este comando antes de instalar o MySQL usando o APT:

  ```
  $> sudo debconf-set-selections <<< "mysql-server mysql-server/lowercase-table-names select Enabled"
  ```

  Nota

  A capacidade de habilitar `lower_case_table_names` usando `debconf-set-selections` foi adicionada no MySQL 8.0.17. Habilitar `lower_case_table_names` define o valor para 1.

- `mandatory_roles`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>43

  Papéis que o servidor deve tratar como obrigatórios. Na verdade, esses papéis são concedidos automaticamente a todos os usuários, embora a definição de `mandatory_roles` não mude realmente as contas de usuário, e os papéis concedidos não são visíveis na tabela do sistema `mysql.role_edges`.

  O valor variável é uma lista de nomes de papéis separados por vírgula. Exemplo:

  ```
  SET PERSIST mandatory_roles = '`role1`@`%`,`role2`,role3,role4@localhost';
  ```

  Para definir o valor de execução de `mandatory_roles`, é necessário o privilégio `ROLE_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou do privilégio desatualizado `SUPER`) normalmente necessário para definir o valor de execução de uma variável de sistema global.

  Os nomes dos papéis consistem em uma parte do usuário e uma parte do host no formato `user_name@host_name`. A parte do host, se omitida, tem como padrão `%`. Para obter informações adicionais, consulte a Seção 8.2.5, “Especificação de Nomes de Papéis”.

  O valor `mandatory_roles` é uma string, portanto, nomes de usuário e nomes de host, se estiverem entre aspas, devem ser escritos de uma maneira permitida para aspas dentro de strings entre aspas.

  Os papéis nomeados no valor de `mandatory_roles` não podem ser revogados com `REVOKE` ou removidos com `DROP ROLE` ou `DROP USER`.

  Para evitar que as sessões sejam feitas como sessões do sistema por padrão, um papel que tenha o privilégio `SYSTEM_USER` não pode ser listado no valor da variável de sistema `mandatory_roles`:

  - Se `mandatory_roles` receber um papel no início que tenha o privilégio `SYSTEM_USER`, o servidor escreve uma mensagem no log de erro e sai.

  - Se `mandatory_roles` receber um papel no tempo de execução que tenha o privilégio `SYSTEM_USER`, ocorrerá um erro e o valor `mandatory_roles` permanecerá inalterado.

  Os papéis obrigatórios, assim como os papéis explicitamente concedidos, só entram em vigor quando ativados (consulte Ativação de papéis). No momento do login, a ativação do papel ocorre para todos os papéis concedidos se a variável de sistema `activate_all_roles_on_login` estiver habilitada; caso contrário, ou para papéis que sejam definidos como papéis padrão. No momento da execução, o `SET ROLE` ativa os papéis.

  Os papéis que não existem quando atribuídos a `mandatory_roles`, mas são criados posteriormente, podem exigir um tratamento especial para serem considerados obrigatórios. Para obter detalhes, consulte Definindo papéis obrigatórios.

  `SHOW GRANTS` exibe os papéis obrigatórios de acordo com as regras descritas na Seção 15.7.7.21, “Declaração de GRANTS”.

- `max_allowed_packet`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>44

  O tamanho máximo de um pacote ou qualquer string gerada/intermediária, ou qualquer parâmetro enviado pela função de API C `mysql_stmt_send_long_data()`. O padrão é 64 MB.

  O buffer de mensagens de pacote é inicializado com `net_buffer_length` bytes, mas pode crescer até `max_allowed_packet` bytes quando necessário. Este valor é pequeno por padrão, para capturar pacotes grandes (possíveis incorretos).

  Você deve aumentar esse valor se estiver usando colunas grandes `BLOB` ou strings longas. Ele deve ser tão grande quanto o maior `BLOB` que você deseja usar. O limite do protocolo para `max_allowed_packet` é de 1 GB. O valor deve ser um múltiplo de 1024; os não múltiplos são arredondados para o próximo múltiplo.

  Quando você altera o tamanho do buffer de mensagens alterando o valor da variável `max_allowed_packet`, você também deve alterar o tamanho do buffer no lado do cliente, se o seu programa de cliente permitir. O valor padrão `max_allowed_packet` embutido na biblioteca do cliente é de 1 GB, mas os programas individuais do cliente podem sobrepor isso. Por exemplo, **mysql** e **mysqldump** têm valores padrão de 16 MB e 24 MB, respectivamente. Eles também permitem que você altere o valor do lado do cliente configurando `max_allowed_packet` na linha de comando ou em um arquivo de opção.

  O valor da sessão desta variável é apenas de leitura. O cliente pode receber até tantos bytes quanto o valor da sessão. No entanto, o servidor não envia ao cliente mais bytes do que o valor atual global `max_allowed_packet`. (O valor global pode ser menor que o valor da sessão se o valor global for alterado após a conexão do cliente.)

- `max_connect_errors`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>45

  Após `max_connect_errors` solicitações de conexão consecutivas de um host serem interrompidas sem uma conexão bem-sucedida, o servidor bloqueia esse host de futuras conexões. Se uma conexão de um host for estabelecida com sucesso em menos de `max_connect_errors` tentativas após uma conexão anterior ter sido interrompida, o contador de erros para o host é zerado. Para desbloquear hosts bloqueados, limpe o cache do host; veja Limpar o Cache do Host.

- `max_connections`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>46

  O número máximo de conexões de clientes simultâneos permitido. O valor máximo efetivo é o menor entre o valor efetivo de `open_files_limit` `- 810` e o valor realmente definido para `max_connections`.

  Para mais informações, consulte a Seção 7.1.12.1, “Interfaces de Conexão”.

- `max_delayed_threads`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>47

  Essa variável de sistema está desatualizada (porque as inserções `DELAYED` não são suportadas) e está sujeita à remoção em uma futura versão do MySQL.

  A partir do MySQL 8.0.27, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `max_digest_length`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>48

  O número máximo de bytes de memória reservados por sessão para a computação de resumos normalizados de declarações. Quando essa quantidade de espaço é usada durante a computação do resumo, ocorre a redução: mais tokens de uma declaração analisada não são coletados ou incluídos no valor do resumo. Declarações que diferem apenas após esse número de bytes de tokens analisados produzem o mesmo resumo normalizado de declarações e são consideradas idênticas quando comparadas ou quando agregadas para estatísticas de resumo.

  O comprimento utilizado para calcular um resumo normalizado de uma declaração é a soma do comprimento do resumo normalizado de uma declaração e do comprimento do resumo da declaração. Como o comprimento do resumo da declaração é sempre de 64, isso é equivalente a `LENGTH` `(``STATEMENT_DIGEST_TEXT(statement) ) + 64`. Isso significa que, quando o valor de `max_digest_length` é 1024 (o padrão), o comprimento máximo para uma declaração SQL normalizada antes da ocorrência de truncação é, na verdade, de 960 bytes.

  Aviso

  Definir `max_digest_length` para zero desativa a produção de digestes, o que também desativa a funcionalidade do servidor que requer digestes, como o MySQL Enterprise Firewall.

  Reduzir o valor de `max_digest_length` diminui o uso de memória, mas faz com que o valor do digest de mais declarações se torne indistinguível se elas diferirem apenas no final. Aumentar o valor permite que declarações mais longas sejam distinguidas, mas aumenta o uso de memória, especialmente para cargas de trabalho que envolvem um grande número de sessões simultâneas (o servidor aloca `max_digest_length` bytes por sessão).

  O analisador utiliza essa variável de sistema como um limite para a duração máxima dos resumos normalizados das instruções que ele calcula. O Schema de Desempenho, se ele rastrear os resumos das instruções, faz uma cópia do valor do resumo, usando a variável de sistema `performance_schema_max_digest_length`. Como consequência, se `performance_schema_max_digest_length` for menor que `max_digest_length`, os valores dos resumos armazenados no Schema de Desempenho são truncados em relação aos valores originais dos resumos.

  Para obter mais informações sobre a digestão de declarações, consulte a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”.

- `max_error_count`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>49

  O número máximo de mensagens de erro, aviso e informação que serão armazenadas para serem exibidas pelas instruções `SHOW ERRORS` e `SHOW WARNINGS`. Isso é o mesmo número de áreas de condição na área de diagnóstico, e, portanto, o número de condições que podem ser inspecionadas pelo `GET DIAGNOSTICS`.

  A partir do MySQL 8.0.27, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `max_execution_time`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>50

  O tempo de espera para a execução de instruções `SELECT`, em milissegundos. Se o valor for 0, os tempos de espera não serão habilitados.

  `max_execution_time` se aplica da seguinte forma:

  - O valor global `max_execution_time` fornece o valor padrão para o valor da sessão para novas conexões. O valor da sessão se aplica às execuções `SELECT` executadas dentro da sessão que não incluem nenhuma dica de otimizador `MAX_EXECUTION_TIME(N)` ou para as quais `N` é 0.

  - `max_execution_time` se aplica a declarações `SELECT` apenas de leitura. As declarações que não são apenas de leitura são aquelas que invocam uma função armazenada que modifica dados como efeito colateral.

  - `max_execution_time` é ignorado para declarações `SELECT` em programas armazenados.

- `max_heap_table_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>51

  Esta variável define o tamanho máximo permitido para as tabelas `MEMORY` criadas pelo usuário crescer. O valor da variável é usado para calcular os valores da tabela `MEMORY` `MAX_ROWS`.

  Definir essa variável não afeta nenhuma tabela existente do `MEMORY`, a menos que a tabela seja recarregada com uma instrução como `CREATE TABLE` ou alterada com `ALTER TABLE` ou `TRUNCATE TABLE`. Uma reinicialização do servidor também define o tamanho máximo das tabelas existentes do `MEMORY` com o valor global do `max_heap_table_size`.

  Essa variável também é usada em conjunto com `tmp_table_size` para limitar o tamanho das tabelas internas de memória. Veja a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

  `max_heap_table_size` não é replicado. Consulte a Seção 19.5.1.21, “Replicação e Tabelas de MEMÓRIA”, e a Seção 19.5.1.39, “Replicação e Variáveis”, para obter mais informações.

- `max_insert_delayed_threads`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>52

  Essa variável é sinônimo de `max_delayed_threads`. Assim como `max_delayed_threads`, ela está desatualizada (porque as inserções de `DELAYED` não são suportadas) e está sujeita à remoção em uma futura versão do MySQL.

  A partir do MySQL 8.0.27, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `max_join_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>53

  A partir do MySQL 8.0.31, isso representa um limite para o número máximo de acessos a linhas em tabelas base feitas por uma junção. Se a estimativa do servidor indicar que mais linhas do que `max_join_size` devem ser lidas das tabelas base, a instrução é rejeitada com um erro.

  *MySQL 8.0.30 e versões anteriores*: Não permita declarações que provavelmente precisem examinar mais de `max_join_size` linhas (para declarações de uma única tabela) ou combinações de linhas (para declarações de múltiplas tabelas) ou que provavelmente realizem mais de `max_join_size` buscas no disco. Ao definir esse valor, você pode detectar declarações em que as chaves não são usadas corretamente e que provavelmente levarão muito tempo. Defina-o se seus usuários tendem a realizar junções que carecem de uma cláusula `WHERE`, que levam muito tempo ou que retornam milhões de linhas. Para mais informações, consulte "Usando o modo Safe-Updates (--safe-updates)").

  Independentemente da versão do lançamento do MySQL, ao definir essa variável para um valor diferente de `DEFAULT`, o valor de `sql_big_selects` é redefinido para `0`. Se você definir o valor de `sql_big_selects` novamente, a variável `max_join_size` é ignorada.

- `max_length_for_sort_data`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>54

  Esta variável foi descontinuada a partir do MySQL 8.0.20 devido a alterações no otimizador que a tornaram obsoleta e sem efeito. Anteriormente, ela atuava como o limite de tamanho dos valores do índice que determina qual algoritmo `filesort` deve ser usado. Veja a Seção 10.2.1.16, “Otimização de ORDER BY”.

- `max_points_in_geometry`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>55

  O valor máximo do argumento `points_per_circle` para a função `ST_Buffer_Strategy()`.

- `max_prepared_stmt_count`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>56

  Essa variável limita o número total de declarações preparadas no servidor. Ela pode ser usada em ambientes onde há o potencial de ataques de negação de serviço, baseados em esgotar a memória do servidor ao preparar um grande número de declarações. Se o valor for definido como menor que o número atual de declarações preparadas, as declarações existentes não serão afetadas e podem ser usadas, mas novas declarações não poderão ser preparadas até que o número atual caia abaixo do limite. Definir o valor para 0 desabilita as declarações preparadas.

- `max_seeks_for_key`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>57

  Limite o número máximo de buscas assumido ao procurar linhas com base em uma chave. O otimizador do MySQL assume que não são necessários mais que esse número de buscas por chave ao procurar linhas correspondentes em uma tabela, realizando uma varredura de um índice, independentemente da cardinalidade real do índice (veja a Seção 15.7.7.22, “Instrução SHOW INDEX”). Ao definir esse valor para um valor baixo (digamos, 100), você pode forçar o MySQL a preferir índices em vez de varreduras de tabela.

- `max_sort_length`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>58

  O número de bytes a serem usados ao ordenar valores de string que utilizam `PAD SPACE` collations. O servidor usa apenas os primeiros `max_sort_length` bytes de qualquer valor desse tipo e ignora o resto. Consequentemente, esses valores que diferem apenas após os primeiros `max_sort_length` bytes são considerados iguais para as operações `GROUP BY`, `ORDER BY` e `DISTINCT`. (Esse comportamento difere das versões anteriores do MySQL, onde essa configuração era aplicada a todos os valores usados em comparações.)

  Para aumentar o valor de `max_sort_length`, pode ser necessário aumentar o valor de `sort_buffer_size`. Para obter detalhes, consulte a Seção 10.2.1.16, “Otimização de ORDER BY”

- `max_sp_recursion_depth`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>59

  O número de vezes que um procedimento armazenado específico pode ser chamado recursivamente. O valor padrão para essa opção é 0, que desabilita completamente a recursão em procedimentos armazenados. O valor máximo é 255.

  A recursão de procedimentos armazenados aumenta a demanda por espaço na pilha de threads. Se você aumentar o valor de `max_sp_recursion_depth`, pode ser necessário aumentar o tamanho da pilha de threads aumentando o valor de `thread_stack` durante o início do servidor.

- `max_user_connections`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>60

  O número máximo de conexões simultâneas permitidas para qualquer conta de usuário do MySQL. Um valor de 0 (o padrão) significa "sem limite".

  Essa variável tem um valor global que pode ser definido na inicialização ou durante o runtime do servidor. Ela também tem um valor de sessão somente de leitura que indica o limite efetivo de conexões simultâneas que se aplica à conta associada à sessão atual. O valor da sessão é inicializado da seguinte forma:

  - Se a conta de usuário tiver um limite de recurso `MAX_USER_CONNECTIONS` não nulo, o valor da sessão `max_user_connections` será definido nesse limite.

  - Caso contrário, o valor da sessão `max_user_connections` será definido pelo valor global.

  Os limites de recursos da conta são especificados usando a declaração `CREATE USER` ou `ALTER USER`. Veja a Seção 8.2.21, “Definindo Limites de Recursos da Conta”.

- `max_write_lock_count`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>61

  Após muitas solicitações de bloqueio de escrita, permita que algumas solicitações de bloqueio de leitura pendentes sejam processadas entre elas. As solicitações de bloqueio de escrita têm prioridade maior do que as solicitações de bloqueio de leitura. No entanto, se `max_write_lock_count` estiver definido para um valor baixo (digamos, 10), as solicitações de bloqueio de leitura podem ser preferidas em relação às solicitações de bloqueio de escrita pendentes, se as solicitações de bloqueio de leitura já tiverem sido atendidas em favor de 10 solicitações de bloqueio de escrita. Normalmente, esse comportamento não ocorre porque `max_write_lock_count` tem um valor muito grande por padrão.

- `mecab_rc_file`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>62

  A opção `mecab_rc_file` é usada ao configurar o analisador de texto completo do MeCab.

  A opção `mecab_rc_file` define o caminho para o arquivo de configuração `mecabrc`, que é o arquivo de configuração do MeCab. A opção é somente de leitura e só pode ser definida durante o início. O arquivo de configuração `mecabrc` é necessário para inicializar o MeCab.

  Para obter informações sobre o analisador de texto completo MeCab, consulte a Seção 14.9.9, “Plugin de Analisador de Texto Completo MeCab”.

  Para obter informações sobre as opções que podem ser especificadas no arquivo de configuração do MeCab `mecabrc`, consulte a documentação do MeCab no site do Google Developers.

- `metadata_locks_cache_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>63

  Essa variável de sistema foi removida no MySQL 8.0.13.

- `metadata_locks_hash_instances`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>64

  Essa variável de sistema foi removida no MySQL 8.0.13.

- `min_examined_row_limit`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>65

  As consultas que examinam menos de esse número de linhas não são registradas no log de consultas lentas.

  A partir do MySQL 8.0.27, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `myisam_data_pointer_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>66

  O tamanho padrão do ponteiro em bytes, a ser usado pelo `CREATE TABLE` para as tabelas `MyISAM` quando nenhuma opção `MAX_ROWS` é especificada. Esta variável não pode ser menor que 2 ou maior que 7. O valor padrão é

  6. Veja a Seção B.3.2.10, “A mesa está cheia”.

- `myisam_max_sort_file_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>67

  O tamanho máximo do arquivo temporário que o MySQL é permitido usar enquanto recria um índice `MyISAM` (durante `REPAIR TABLE`, `ALTER TABLE` ou `LOAD DATA`). Se o tamanho do arquivo for maior que esse valor, o índice é criado usando o cache de chaves em vez disso, o que é mais lento. O valor é dado em bytes.

  Se os arquivos de índice `MyISAM` ultrapassarem esse tamanho e houver espaço em disco disponível, aumentar o valor pode ajudar no desempenho. O espaço deve estar disponível no sistema de arquivos que contém o diretório onde o arquivo de índice original está localizado.

- `myisam_mmap_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>68

  O valor máximo de memória a ser usado para mapear a memória de arquivos comprimidos `MyISAM`. Se muitas tabelas compactadas `MyISAM` forem usadas, o valor pode ser reduzido para diminuir a probabilidade de problemas de troca de memória.

- `myisam_recover_options`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>69

  Defina o modo de recuperação do mecanismo de armazenamento `MyISAM`. O valor da variável é qualquer combinação dos valores de `OFF`, `DEFAULT`, `BACKUP`, `FORCE` ou `QUICK`. Se você especificar múltiplos valores, separe-os por vírgula. Especificar a variável sem valor no início do servidor é o mesmo que especificar `DEFAULT`, e especificar com um valor explícito de `""` desabilita a recuperação (mesmo que seja um valor de `OFF`). Se a recuperação estiver habilitada, cada vez que o **mysqld** abre uma tabela `MyISAM`, ele verifica se a tabela está marcada como quebrada ou se não foi fechada corretamente. (A última opção só funciona se você estiver executando com o bloqueio externo desativado.) Nesse caso, o **mysqld** executa uma verificação na tabela. Se a tabela estiver corrompida, o **mysqld** tenta repará-la.

  As seguintes opções afetam o funcionamento da reparação.

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>70

  Antes que o servidor repare automaticamente uma tabela, ele escreve uma nota sobre a reparação no log de erros. Se você quiser ser capaz de recuperar a maioria dos problemas sem intervenção do usuário, você deve usar as opções `BACKUP,FORCE`. Isso força uma reparação de uma tabela, mesmo que algumas linhas sejam excluídas, mas mantém o arquivo de dados antigo como um backup para que você possa examinar mais tarde o que aconteceu.

  Veja a Seção 18.2.1, “Opções de Inicialização do MyISAM”.

- `myisam_repair_threads`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>71

  Nota

  Essa variável de sistema está desatualizada no MySQL 8.0.29 e foi removida no MySQL 8.0.30.

  A partir do MySQL 8.0.29, valores diferentes de 1 geram um aviso.

  Se esse valor for maior que 1, os índices da tabela `MyISAM` serão criados em paralelo (cada índice em seu próprio fio) durante o processo `Repair by sorting`. O valor padrão é 1.

  Nota

  A reparação multithreading é código de qualidade beta.

- `myisam_sort_buffer_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>72

  O tamanho do buffer que é alocado ao ordenar índices `MyISAM` durante uma `REPAIR TABLE` ou ao criar índices com `CREATE INDEX` ou `ALTER TABLE`.

- `myisam_stats_method`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>73

  Como o servidor trata os valores de `NULL` ao coletar estatísticas sobre a distribuição dos valores de índice para as tabelas de `MyISAM`. Esta variável tem três valores possíveis, `nulls_equal`, `nulls_unequal` e `nulls_ignored`. Para `nulls_equal`, todos os valores de índice de `NULL` são considerados iguais e formam um único grupo de valores que tem um tamanho igual ao número de valores de `NULL`. Para `nulls_unequal`, os valores de `NULL` são considerados desiguais, e cada `NULL` forma um grupo de valores distinto de tamanho

  1. Para os valores `nulls_ignored` e `NULL`, os valores são ignorados.

  O método utilizado para gerar estatísticas de tabela influencia a forma como o otimizador escolhe índices para a execução de consultas, conforme descrito na Seção 10.3.8, “Coleta de Estatísticas de Índices InnoDB e MyISAM”.

- `myisam_use_mmap`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>74

  Use mapeamento de memória para leitura e escrita de tabelas `MyISAM`.

- `mysql_native_password_proxy_users`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>75

  Essa variável controla se o plugin de autenticação embutido `mysql_native_password` suporta usuários proxy. Ela não tem efeito a menos que a variável de sistema `check_proxy_users` esteja habilitada. Para obter informações sobre o proxying de usuários, consulte a Seção 8.2.19, “Usuários Proxy”.

- `named_pipe`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>76

  (Apenas para Windows.) Indica se o servidor suporta conexões por meio de tubos nomeados.

- `named_pipe_full_access_group`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>77

  (Apenas para Windows.) O controle de acesso concedido aos clientes na pipe nomeada criada pelo servidor MySQL está configurado para o mínimo necessário para uma comunicação bem-sucedida quando a variável de sistema `named_pipe` está habilitada para suportar conexões por pipe nomeada. Alguns softwares de cliente MySQL podem abrir conexões por pipe nomeada sem nenhuma configuração adicional; no entanto, outros softwares de cliente ainda podem exigir acesso total para abrir uma conexão por pipe nomeada.

  Essa variável define o nome de um grupo local do Windows, cujos membros recebem acesso suficiente do servidor MySQL para usar clientes de pipe nomeado. A partir do MySQL 8.0.24, o valor padrão é definido como uma string vazia, o que significa que nenhum usuário do Windows recebe acesso total ao pipe nomeado.

  Um novo nome de grupo local do Windows (por exemplo, `mysql_access_client_users`) pode ser criado no Windows e, em seguida, usado para substituir o valor padrão quando o acesso for absolutamente necessário. Nesse caso, limite a participação do grupo ao menor número possível de usuários, removendo os usuários do grupo quando o software do cliente for atualizado. Um usuário que não faz parte do grupo e tenta abrir uma conexão ao MySQL com o cliente de canal nomeado afetado é negado o acesso até que um administrador do Windows adicione o usuário ao grupo. Os usuários recém-adicionados devem fazer logout e fazer login novamente para se juntar ao grupo (requisitado pelo Windows).

  Definir o valor para `'*everyone*'` fornece uma maneira independente da linguagem de se referir ao grupo Todos no Windows. O grupo Todos não é seguro por padrão.

- `net_buffer_length`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>78

  Cada fio de cliente está associado a um buffer de conexão e um buffer de resultados. Ambos começam com um tamanho definido por `net_buffer_length`, mas são dinamicamente aumentados até `max_allowed_packet` bytes conforme necessário. O buffer de resultados diminui para `net_buffer_length` após cada instrução SQL.

  Essa variável normalmente não deve ser alterada, mas se você tiver muito pouca memória, pode configurá-la para o comprimento esperado das declarações enviadas pelos clientes. Se as declarações ultrapassarem esse comprimento, o buffer de conexão será automaticamente ampliado. O valor máximo para o qual `net_buffer_length` pode ser configurado é de 1 MB.

  O valor da sessão desta variável é apenas de leitura.

- `net_read_timeout`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>79

  O número de segundos para esperar por mais dados de uma conexão antes de abortar a leitura. Quando o servidor está lendo do cliente, `net_read_timeout` é o valor de tempo de espera que controla quando abortar. Quando o servidor está escrevendo para o cliente, `net_write_timeout` é o valor de tempo de espera que controla quando abortar. Veja também `replica_net_timeout` e `slave_net_timeout`.

- `net_retry_count`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>80

  Se uma leitura ou gravação em um port de comunicação for interrompida, tente novamente esse número de vezes antes de desistir. Esse valor deve ser configurado bastante alto no FreeBSD, pois interrupções internas são enviadas para todos os threads.

- `net_write_timeout`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>81

  O número de segundos para esperar que um bloco seja escrito em uma conexão antes de abortar a escrita. Veja também `net_read_timeout`.

- `new`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>82

  Essa variável foi usada no MySQL 4.0 para ativar alguns comportamentos do 4.1 e foi mantida para compatibilidade reversa. Seu valor é sempre `OFF`.

  Esta variável foi descontinuada a partir do MySQL 8.0.35 e está sujeita à remoção em uma futura versão.

  No NDB Cluster, definir essa variável para `ON` permite o uso de tipos de particionamento diferentes de `KEY` ou `LINEAR KEY` com tabelas `NDB`. Esse recurso experimental não é suportado na produção e agora está desatualizado e, portanto, sujeito à remoção em uma futura versão. Para obter informações adicionais, consulte "Particionamento definido pelo usuário e o mecanismo de armazenamento NDB (NDB Cluster)").

- `ngram_token_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>83

  Define o tamanho do token de n-gramas para o analisador de texto completo de n-gramas. A opção `ngram_token_size` é somente de leitura e só pode ser modificada durante o início. O valor padrão é 2 (bigram). O valor máximo é 10.

  Para obter mais informações sobre como configurar essa variável, consulte a Seção 14.9.8, “Parser de Texto Completo ngram”.

- `offline_mode`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>84

  No modo offline, a instância do MySQL desconecta os usuários do cliente, a menos que eles tenham privilégios relevantes, e não permite que eles iniciem novas conexões. Os clientes que são recusados no acesso recebem um erro `ER_SERVER_OFFLINE_MODE`.

  Para colocar um servidor no modo offline, altere o valor da variável de sistema `offline_mode` de `OFF` para `ON`. Para retomar as operações normais, altere `offline_mode` de `ON` para `OFF`. Para controlar o modo offline, uma conta de administrador deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` e o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`, que abrange ambos os privilégios). `CONNECTION_ADMIN` é necessário a partir do MySQL 8.0.31 e é recomendado em todas as versões para evitar bloqueio acidental.

  O modo offline tem essas características:

  - Os usuários do cliente conectados que não possuem o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`) são desconectados na próxima solicitação, com um erro apropriado. A desconexão inclui o encerramento de instruções em execução e a liberação de bloqueios. Esses clientes também não podem iniciar novas conexões e receberão um erro apropriado.

  - Os usuários de clientes conectados que possuem o privilégio `CONNECTION_ADMIN` ou `SUPER` não são desconectados e podem iniciar novas conexões para gerenciar o servidor.

  - A partir do MySQL 8.0.30, se o usuário que coloca um servidor no modo offline não tiver o privilégio `SYSTEM_USER`, os usuários de clientes conectados que têm o privilégio `SYSTEM_USER` também não serão desconectados. No entanto, esses usuários não podem iniciar novas conexões com o servidor enquanto ele estiver no modo offline, a menos que também tenham os privilégios `CONNECTION_ADMIN` ou `SUPER`. Apenas sua conexão existente não pode ser encerrada, porque o privilégio `SYSTEM_USER` é necessário para matar uma sessão ou instrução que esteja sendo executada com o privilégio `SYSTEM_USER`.

  - Os threads de replicação são autorizados a continuar aplicando dados ao servidor.

- `old`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>85

  `old` é uma variável de compatibilidade. Ela é desabilitada por padrão, mas pode ser habilitada durante o início para reverter o comportamento do servidor para o estado presente em versões anteriores.

  Quando o `old` está habilitado, ele altera o escopo padrão das dicas de índice para o usado antes do MySQL 5.1.17. Ou seja, as dicas de índice sem a cláusula `FOR` se aplicam apenas ao uso de índices para recuperação de linhas e não à resolução das cláusulas `ORDER BY` ou `GROUP BY`. (Veja a Seção 10.9.4, “Dicas de Índice”.) Tenha cuidado ao habilitar isso em uma configuração de replicação. Com o registro binário baseado em declarações, ter modos diferentes para a fonte e réplicas pode levar a erros de replicação.

  Esta variável foi descontinuada a partir do MySQL 8.0.35 e está sujeita à remoção em uma futura versão.

- `old_alter_table`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>86

  Quando essa variável estiver habilitada, o servidor não usará o método otimizado para processar uma operação `ALTER TABLE`. Ele voltará a usar uma tabela temporária, copiando os dados e renomeando a tabela temporária para a original, como era feito pelo MySQL 5.0 e versões anteriores. Para mais informações sobre a operação `ALTER TABLE`, consulte a Seção 15.1.9, “Instrução ALTER TABLE”.

  `ALTER TABLE ... DROP PARTITION` com `old_alter_table=ON` reconstrui a tabela particionada e tenta mover dados da partição eliminada para outra partição com uma definição `PARTITION ... VALUES` compatível. Os dados que não podem ser movidos para outra partição são excluídos. Em versões anteriores, `ALTER TABLE ... DROP PARTITION` com `old_alter_table=ON` exclui os dados armazenados na partição e elimina a partição.

- `open_files_limit`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>87

  O número de descritores de arquivo disponíveis para o **mysqld** do sistema operacional:

  - Ao iniciar, o **mysqld** reserva descritores com `setrlimit()`, usando o valor solicitado ao definir diretamente essa variável ou usando a opção `--open-files-limit` para **mysqld\_safe**. Se o **mysqld** produzir o erro `Too many open files`, tente aumentar o valor de `open_files_limit`. Internamente, o valor máximo para essa variável é o valor máximo de inteiro não assinado, mas o máximo real depende da plataforma.

  - Durante a execução, o valor de `open_files_limit` indica o número de descritores de arquivo realmente permitidos ao **mysqld** pelo sistema operacional, que pode diferir do valor solicitado durante o início. Se o número de descritores de arquivo solicitados durante o início não puder ser alocado, o **mysqld** escreve uma mensagem de aviso no log de erro.

  O valor efetivo do `open_files_limit` é baseado no valor especificado na inicialização do sistema (se houver) e nos valores de `max_connections` e `table_open_cache`, utilizando as seguintes fórmulas:

  - `10 + max_connections + (table_open_cache * 2)`. Ao usar os valores padrão para essas variáveis, o resultado é 8161.

    Apenas no Windows, 2048 (o valor do descritor de arquivo máximo da biblioteca de tempo de execução C) é adicionado a esse número. Isso totaliza 10209, novamente usando os valores padrão para as variáveis de sistema indicadas.

  - `max_connections * 5`

  - MySQL 8.0.19 e superior: Limite do sistema operacional.

  - Antes do MySQL 8.0.19:

    - O limite do sistema operacional, se esse limite for positivo, mas não infinito.

    - Se o limite do sistema operacional for Infinito: `open_files_limit` se o valor for especificado na inicialização, 5000 caso contrário.

  O servidor tenta obter o número de descritores de arquivo usando o máximo desses valores, limitado ao valor máximo de inteiro não assinado. Se não for possível obter tantos descritores, o servidor tenta obter tantos quantos o sistema permitir.

  O valor efetivo é 0 em sistemas onde o MySQL não pode alterar o número de arquivos abertos.

  No Unix, o valor não pode ser maior que o valor exibido pelo comando **ulimit -n**. Em sistemas Linux que utilizam `systemd`, o valor não pode ser maior que `LimitNOFILE` (se `LimitNOFILE` não estiver definido); caso contrário, no Linux, o valor de `open_files_limit` não pode exceder **ulimit -n**.

- `optimizer_prune_level`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>88

  Controla as heurísticas aplicadas durante a otimização da consulta para eliminar planos parciais menos promissores do espaço de busca do otimizador. Um valor de 0 desabilita as heurísticas para que o otimizador realize uma busca exaustiva. Um valor de 1 faz com que o otimizador elimine planos com base no número de linhas recuperadas pelos planos intermediários.

- `optimizer_search_depth`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>89

  A profundidade máxima de pesquisa realizada pelo otimizador de consultas. Valores maiores que o número de relações em um resultado de consulta resultam em melhores planos de consulta, mas demoram mais para gerar um plano de execução para uma consulta. Valores menores que o número de relações em uma consulta retornam um plano de execução mais rápido, mas o plano resultante pode estar longe de ser ótimo. Se definido para 0, o sistema escolhe automaticamente um valor razoável.

- `optimizer_switch`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>90

  A variável de sistema `optimizer_switch` permite o controle do comportamento do otimizador. O valor desta variável é um conjunto de flags, cada uma com um valor de `on` ou `off` para indicar se o comportamento do otimizador correspondente está habilitado ou desabilitado. Esta variável tem valores globais e de sessão e pode ser alterada em tempo de execução. O valor padrão global pode ser definido na inicialização do servidor.

  Para ver o conjunto atual de flags do otimizador, selecione o valor da variável:

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
                      derived_condition_pushdown=on
  ```

  Para obter mais informações sobre a sintaxe dessa variável e os comportamentos do otimizador que ela controla, consulte a Seção 10.9.2, “Otimizações Desativáveis”.

- `optimizer_trace`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>91

  Essa variável controla o rastreamento do otimizador. Para obter detalhes, consulte a Seção 10.15, “Rastreamento do Otimizador”.

- `optimizer_trace_features`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>92

  Essa variável habilita ou desabilita as funcionalidades de rastreamento do otimizador selecionadas. Para obter detalhes, consulte a Seção 10.15, “Rastreamento do Otimizador”.

- `optimizer_trace_limit`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>93

  O número máximo de traços do otimizador a serem exibidos. Para detalhes, consulte a Seção 10.15, “Rastrear o Otimizador”.

- `optimizer_trace_max_mem_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>94

  O tamanho cumulativo máximo de registros armazenados do otimizador. Para obter detalhes, consulte a Seção 10.15, “Rastrear o Otimizador”.

- `optimizer_trace_offset`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>95

  O deslocamento das traças do otimizador para exibição. Para obter detalhes, consulte a Seção 10.15, “Rastrear o Otimizador”.

- `performance_schema_xxx`

  As variáveis do sistema do Schema de Desempenho estão listadas na Seção 29.15, “Variáveis do Sistema do Schema de Desempenho”. Essas variáveis podem ser usadas para configurar a operação do Schema de Desempenho.

- `parser_max_mem_size`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>96

  O valor máximo de memória disponível para o analisador. O valor padrão não define nenhum limite para a memória disponível. O valor pode ser reduzido para proteger contra situações de falta de memória causadas pela análise de instruções SQL longas ou complexas.

- `partial_revokes`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>97

  Ativação desta variável permite revogar privilégios parcialmente. Especificamente, para usuários que têm privilégios no nível global, `partial_revokes` permite que privilégios para esquemas específicos sejam revogados, mantendo os privilégios em vigor para outros esquemas. Por exemplo, um usuário que tem o privilégio global `UPDATE` pode ser restringido de exercer esse privilégio no esquema de sistema `mysql`. (Ou, de outra forma, o usuário é habilitado a exercer o privilégio `UPDATE` em todos os esquemas, exceto o esquema `mysql`.) Nesse sentido, o privilégio global `UPDATE` do usuário é parcialmente revogado.

  Uma vez ativado, `partial_revokes` não pode ser desativado se qualquer conta tiver restrições de privilégio. Se tal conta existir, a desativação de `partial_revokes` falhará:

  - Para tentativas de desabilitar `partial_revokes` ao iniciar, o servidor registra uma mensagem de erro e habilita `partial_revokes`.

  - Para tentativas de desabilitar `partial_revokes` em tempo de execução, ocorre um erro e o valor `partial_revokes` permanece inalterado.

  Para desativar `partial_revokes` neste caso, modifique primeiro cada conta que tenha revogado parcialmente os privilégios, seja concedendo novamente os privilégios ou removendo a conta.

  Nota

  Nas atribuições de privilégios, a ativação de `partial_revokes` faz com que o MySQL interprete as ocorrências de caracteres curinga SQL não escapados `_` e `%` em nomes de esquemas como caracteres literais, assim como se tivessem sido escapados como `_` e `\%`. Como isso altera a forma como o MySQL interpreta os privilégios, pode ser aconselhável evitar caracteres curinga não escapados nas atribuições de privilégios para instalações onde `partial_revokes` pode estar habilitado.

  Além disso, o uso de `_` e `%` como caracteres curinga em concessões é desaconselhável a partir do MySQL 8.0.35, e você deve esperar que o suporte a eles seja removido em uma versão futura do MySQL.

  Para obter mais informações, incluindo instruções para remover revogações parciais, consulte a Seção 8.2.12, “Restrição de privilégio usando revogações parciais”.

- `password_history`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>98

  Esta variável define a política global para controlar a reutilização de senhas anteriores com base no número mínimo de alterações de senha exigido. Para uma senha de conta usada anteriormente, esta variável indica o número de alterações subsequentes da senha da conta que devem ocorrer antes que a senha possa ser reutilizada. Se o valor for 0 (o padrão), não há restrição de reutilização com base no número de alterações de senha.

  As alterações nesta variável serão aplicadas imediatamente a todas as contas definidas com a opção `PASSWORD HISTORY DEFAULT`.

  A política global de reutilização de senha com número de alterações pode ser alterada conforme desejado para contas individuais usando a opção `PASSWORD HISTORY` das instruções `CREATE USER` e `ALTER USER`. Veja a Seção 8.2.15, “Gestão de Senhas”.

- `password_require_current`

  <table summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-address=addr</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_address</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>99

  Esta variável define a política global para controlar se as tentativas de alterar a senha de uma conta devem especificar a senha atual a ser substituída.

  As alterações nesta variável serão aplicadas imediatamente a todas as contas definidas com a opção `PASSWORD REQUIRE CURRENT DEFAULT`.

  A política global que exige verificação pode ser desabilitada conforme desejar para contas individuais usando a opção `PASSWORD REQUIRE` das instruções `CREATE USER` e `ALTER USER`. Veja a Seção 8.2.15, “Gerenciamento de Senhas”.

- `password_reuse_interval`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>00

  Esta variável define a política global para o controle da reutilização de senhas anteriores com base no tempo decorrido. Para uma senha de conta usada anteriormente, essa variável indica o número de dias que devem passar antes que a senha possa ser reutilizada. Se o valor for 0 (o padrão), não há restrição de reutilização com base no tempo decorrido.

  As alterações nesta variável serão aplicadas imediatamente a todas as contas definidas com a opção `PASSWORD REUSE INTERVAL DEFAULT`.

  A política global de reutilização de senha com base no tempo decorrido pode ser alterada conforme desejado para contas individuais usando a opção `PASSWORD REUSE INTERVAL` das instruções `CREATE USER` e `ALTER USER`. Veja a Seção 8.2.15, “Gestão de Senhas”.

- `persisted_globals_load`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>01

  Se carregar as configurações persistentes do arquivo `mysqld-auto.cnf` no diretório de dados. O servidor normalmente processa esse arquivo ao iniciar, após todos os outros arquivos de opção (veja a Seção 6.2.2.2, “Usando arquivos de opção”). Desativar `persisted_globals_load` faz com que a sequência de inicialização do servidor pule `mysqld-auto.cnf`.

  Para modificar o conteúdo do `mysqld-auto.cnf`, use as instruções `SET PERSIST`, `SET PERSIST_ONLY` e `RESET PERSIST`. Veja a Seção 7.1.9.3, “Variáveis de Sistema Persistentes”.

- `persist_only_admin_x509_subject`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>02

  `SET PERSIST` e `SET PERSIST_ONLY` permitem que as variáveis de sistema sejam persistidas no arquivo de opção `mysqld-auto.cnf` no diretório de dados (consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”). A persistência de variáveis de sistema permite alterações na configuração em tempo de execução que afetam reinicializações subsequentes do servidor, o que é conveniente para a administração remota que não requer acesso direto aos arquivos de opção de host do servidor MySQL. No entanto, algumas variáveis de sistema não são persistidas ou podem ser persistidas apenas sob certas condições restritivas.

  A variável de sistema `persist_only_admin_x509_subject` especifica o valor do Sujeito do certificado SSL X.509 que os usuários devem ter para poderem persistir variáveis de sistema que são restritas ao armazenamento persistente. O valor padrão é a string vazia, que desabilita a verificação do Sujeito, de modo que variáveis de sistema restritas ao armazenamento persistente não possam ser persistidas por nenhum usuário.

  Se `persist_only_admin_x509_subject` não estiver vazio, os usuários que se conectam ao servidor usando uma conexão criptografada e fornecem um certificado SSL com o valor do sujeito designado podem usar `SET PERSIST_ONLY` para persistir variáveis de sistema restritas ao persist. Para obter informações sobre variáveis de sistema persistidas e instruções para configurar o MySQL para habilitar `persist_only_admin_x509_subject`, consulte a Seção 7.1.9.4, “Variáveis de sistema não persistidas e persistidas”.

- `persist_sensitive_variables_in_plaintext`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>03

  `persist_sensitive_variables_in_plaintext` controla se o servidor está autorizado a armazenar os valores de variáveis de sistema sensíveis em um formato não criptografado, se o suporte ao componente do chaveiro não estiver disponível no momento em que `SET PERSIST` é usado para definir o valor da variável de sistema. Ele também controla se o servidor pode ser iniciado ou não se os valores criptografados não puderem ser descriptografados. Note que os plugins do chaveiro não suportam o armazenamento seguro de variáveis de sistema sensíveis; um componente do chaveiro (consulte a Seção 8.4.4, “O Chaveiro MySQL”) deve ser habilitado na instância do Servidor MySQL para suportar o armazenamento seguro.

  A configuração padrão, `ON`, criptografa os valores se o suporte ao componente do chaveiro estiver disponível e os persistirá não criptografados (com um aviso) se não estiver. Na próxima vez que uma variável de sistema persistente for definida, se o suporte ao chaveiro estiver disponível naquela época, o servidor criptografará os valores de quaisquer variáveis de sistema sensíveis não criptografadas. A configuração `ON` também permite que o servidor seja iniciado se os valores das variáveis de sistema não criptografadas não puderem ser descriptografados, nesse caso, um aviso é emitido e os valores padrão das variáveis de sistema são usados. Nessa situação, seus valores não podem ser alterados até que possam ser descriptografados.

  A configuração mais segura, `OFF`, significa que os valores sensíveis das variáveis do sistema não podem ser persistentes se o suporte ao componente do chaveiro estiver indisponível. A configuração `OFF` também significa que o servidor não será iniciado se os valores criptografados das variáveis do sistema não puderem ser descriptografados.

  Para obter mais informações, consulte Persistência de variáveis de sistema sensíveis.

- `pid_file`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>04

  O nome do caminho do arquivo no qual o servidor escreve seu ID de processo. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. Se você especificar essa variável, deve especificar um valor. Se você não especificar essa variável, o MySQL usa um valor padrão de `host_name.pid`, onde `host_name` é o nome da máquina do host.

  O arquivo de ID do processo é usado por outros programas, como o **mysqld\_safe**, para determinar o ID do processo do servidor. No Windows, essa variável também afeta o nome do arquivo de log de erro padrão. Veja a Seção 7.4.2, “O Log de Erros”.

- `plugin_dir`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>05

  O nome do caminho do diretório do plugin.

  Se o diretório do plugin for legível pelo servidor, pode ser possível para um usuário escrever código executável em um arquivo no diretório usando `SELECT ... INTO DUMPFILE`. Isso pode ser evitado ao tornar `plugin_dir` somente leitura para o servidor ou ao definir `secure_file_priv` para um diretório onde as escritas de `SELECT` possam ser feitas com segurança.

- `port`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>06

  O número do porto no qual o servidor escuta as conexões TCP/IP. Essa variável pode ser definida com a opção `--port`.

- `preload_buffer_size`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>07

  O tamanho do buffer que é alocado durante o pré-carregamento de índices.

  A partir do MySQL 8.0.27, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `print_identified_with_as_hex`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>08

  Os valores de hash de senha exibidos na cláusula `IDENTIFIED WITH` do resultado de `SHOW CREATE USER` podem conter caracteres não imprimíveis que têm efeitos adversos em telas de terminal e em outros ambientes. Ativação de `print_identified_with_as_hex` faz com que `SHOW CREATE USER` exiba esses valores de hash como strings hexadecimais, em vez de como literais de string regulares. Valores de hash que não contêm caracteres não imprimíveis ainda são exibidos como literais de string regulares, mesmo com essa variável ativada.

- `profiling`

  Se definido como 0 ou `OFF` (o padrão), o perfilamento de declarações é desativado. Se definido como 1 ou `ON`, o perfilamento de declarações é ativado e as declarações `SHOW PROFILE` e `SHOW PROFILES` fornecem acesso às informações de perfilamento. Consulte a Seção 15.7.7.31, “Declaração SHOW PROFILES”.

  Esta variável está desatualizada; espere-se que ela seja removida em uma futura versão do MySQL.

- `profiling_history_size`

  O número de declarações para as quais manter as informações de perfilamento se `profiling` estiver habilitado. O valor padrão é 15. O valor máximo é 100. Definir o valor para 0 desabilita efetivamente o perfilamento. Consulte a Seção 15.7.7.31, “Declaração SHOW PROFILES”.

  Esta variável está desatualizada; espere-se que ela seja removida em uma futura versão do MySQL.

- `protocol_compression_algorithms`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>09

  Os algoritmos de compressão que o servidor permite para conexões de entrada. Isso inclui conexões por programas de cliente e por servidores que participam da replicação de origem/replica ou da replicação em grupo. A compressão não se aplica a conexões para tabelas `FEDERATED`.

  `protocol_compression_algorithms` não controla a compressão de conexão para o protocolo X. Consulte a Seção 22.5.5, “Compressão de Conexão com Plugin X” para obter informações sobre como isso funciona.

  O valor variável é uma lista de um ou mais nomes de algoritmos de compressão separados por vírgula, em qualquer ordem, escolhidos dos seguintes itens (não case-sensitive):

  - `zlib`: Permita conexões que utilizem o algoritmo de compressão `zlib`.

  - `zstd`: Permita conexões que utilizem o algoritmo de compressão `zstd`.

  - `uncompressed`: Permita conexões não compactadas. Se este nome do algoritmo não estiver incluído no valor `protocol_compression_algorithms`, o servidor não permite conexões não compactadas. Ele permite apenas conexões compactadas que utilizam quaisquer outros algoritmos especificados no valor, e não há fallback para conexões não compactadas.

  O valor padrão de `zlib,zstd,uncompressed` indica que o servidor permite todos os algoritmos de compressão.

  Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

- `protocol_version`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>10

  A versão do protocolo cliente/servidor usado pelo servidor MySQL.

- `proxy_user`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>11

  Se o cliente atual for um proxy para outro usuário, essa variável é o nome da conta do usuário proxy. Caso contrário, essa variável é `NULL`. Veja a Seção 8.2.19, “Usuários Proxy”.

- `pseudo_replica_mode`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>12

  A partir do MySQL 8.0.26, `pseudo_replica_mode` é usado em vez de `pseudo_slave_mode`, que foi descontinuado a partir dessa versão. A operação e os efeitos são os mesmos, apenas a terminologia mudou.

  `pseudo_replica_mode` é para uso interno do servidor. Ele auxilia no tratamento correto de transações que foram geradas em servidores mais antigos ou mais novos do que o servidor que está processando atualmente. **mysqlbinlog** define o valor de `pseudo_replica_mode` para verdadeiro antes de executar quaisquer instruções SQL.

  Definir o valor da sessão de `pseudo_replica_mode` é uma operação restrita. O usuário da sessão deve ter o privilégio `REPLICATION_APPLIER` (consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”) ou privilégios suficientes para definir variáveis de sessão restritas (consulte a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”). No entanto, observe que a variável não é destinada para que os usuários a definam; ela é definida automaticamente pela infraestrutura de replicação.

  `pseudo_replica_mode` tem os seguintes efeitos no gerenciamento de transações preparadas XA, que podem ser anexados ou desacoplados da sessão de gerenciamento (por padrão, a sessão que emite `XA START`):

  - Se for verdade, e a sessão de manipulação executou uma instrução `BINLOG` de uso interno, as transações XA são automaticamente desconectadas da sessão assim que a primeira parte da transação até `XA PREPARE` terminar, para que possam ser comprometidas ou revertidas por qualquer sessão que tenha o privilégio `XA_RECOVER_ADMIN`.

  - Se falsa, as transações XA permanecem anexadas à sessão de processamento enquanto essa sessão estiver ativa, durante o qual nenhuma outra sessão poderá confirmar a transação. A transação preparada só é desanexada se a sessão se desconectar ou o servidor reiniciar.

  O `pseudo_replica_mode` tem os seguintes efeitos no timestamp de atraso de replicação do `original_commit_timestamp` e na variável de sistema `original_server_version`:

  - Se for verdade, as transações que não definem explicitamente `original_commit_timestamp` ou `original_server_version` são assumidas como originárias de outro servidor desconhecido, portanto, o valor 0, que significa desconhecido, é atribuído tanto ao timestamp quanto à variável do sistema.

  - Se falso, as transações que não definem explicitamente `original_commit_timestamp` ou `original_server_version` são assumidas como originadas no servidor atual, portanto, o timestamp atual e a versão do servidor atual são atribuídos ao timestamp e à variável do sistema.

  No MySQL 8.0.14 e versões posteriores, `pseudo_replica_mode` tem os seguintes efeitos no tratamento de uma instrução que define um ou mais modos de SQL não suportados (removidos ou desconhecidos):

  - Se for verdade, o servidor ignora o modo não suportado e emite uma mensagem de alerta.

  - Se falsa, o servidor rejeita a declaração com `ER_UNSUPPORTED_SQL_MODE`.

- `pseudo_slave_mode`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>13

  A partir do MySQL 8.0.26, `pseudo_slave_mode` é desaconselhado e o alias `pseudo_replica_mode` é usado em vez disso. `pseudo_slave_mode` é para uso interno do servidor. Ele auxilia no manuseio correto de transações que foram geradas em servidores mais antigos ou mais novos do que o servidor que está processando atualmente. **mysqlbinlog** define o valor de `pseudo_slave_mode` para true antes de executar quaisquer instruções SQL.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter o privilégio `REPLICATION_APPLIER` (consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”) ou privilégios suficientes para definir variáveis de sessão restritas (consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”). No entanto, observe que a variável não é destinada para que os usuários a definam; ela é definida automaticamente pela infraestrutura de replicação.

  Consulte a descrição da variável de sistema `pseudo_replica_mode` para saber os efeitos de `pseudo_slave_mode`.

- `pseudo_thread_id`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>14

  Esta variável é para uso interno do servidor.

  Aviso

  Altere o valor da variável de sessão da variável de sistema `pseudo_thread_id` e o valor retornado pela função `CONNECTION_ID()` será alterado.

  A partir do MySQL 8.0.14, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `query_alloc_block_size`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>15

  O tamanho da alocação em bytes dos blocos de memória que são alocados para objetos criados durante a análise e execução da instrução. Se você tiver problemas com a fragmentação de memória, pode ser útil aumentar este parâmetro.

  O tamanho do bloco para o número de bytes é de 1024. Um valor que não é um múltiplo exato do tamanho do bloco é arredondado para o próximo múltiplo inferior do tamanho do bloco pelo MySQL Server antes de armazenar o valor para a variável do sistema. O analisador permite valores até o valor máximo de inteiro não assinado para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits), mas o máximo real é um tamanho de bloco menor.

- `query_prealloc_size`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>16

  *MySQL 8.0.28 e versões anteriores*: Isso define o tamanho, em bytes, do buffer persistente usado para a análise e execução de instruções. Esse buffer não é liberado entre as instruções. Se você estiver executando consultas complexas, um valor maior para `query_prealloc_size` pode ser útil para melhorar o desempenho, pois pode reduzir a necessidade do servidor de realizar a alocação de memória durante as operações de execução de consultas. Você deve estar ciente de que fazer isso não elimina necessariamente a alocação completamente; o servidor ainda pode alocar memória em algumas situações, como para operações relacionadas a transações ou a programas armazenados.

  A partir do MySQL 8.0.29, `query_prealloc_size` é desatualizado e definir seu valor não tem mais efeito; você deve esperar sua remoção em uma futura versão do MySQL.

- `rand_seed1`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>17

  As variáveis `rand_seed1` e `rand_seed2` existem apenas como variáveis de sessão e podem ser definidas, mas não lidas. As variáveis — mas não seus valores — são exibidas na saída de `SHOW VARIABLES`.

  O propósito dessas variáveis é suportar a replicação da função `RAND()`. Para as instruções que invocam `RAND()`, a fonte passa dois valores para a replica, onde eles são usados para gerar um gerador de números aleatórios. A replica usa esses valores para definir as variáveis de sessão `rand_seed1` e `rand_seed2` para que `RAND()` na replica gere o mesmo valor que na fonte.

- `rand_seed2`

  Veja a descrição para `rand_seed1`.

- `range_alloc_block_size`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>18

  O tamanho em bytes dos blocos alocados durante a otimização de intervalo.

  O tamanho do bloco para o número de bytes é de 1024. Um valor que não é um múltiplo exato do tamanho do bloco é arredondado para o próximo múltiplo inferior do tamanho do bloco pelo MySQL Server antes de armazenar o valor para a variável do sistema. O analisador permite valores até o valor máximo de inteiro não assinado para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits), mas o máximo real é um tamanho de bloco menor.

- `range_optimizer_max_mem_size`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>19

  O limite de consumo de memória para o otimizador de intervalo. Um valor de 0 significa "sem limite". Se um plano de execução considerado pelo otimizador usar o método de acesso de intervalo, mas o otimizador estimar que a quantidade de memória necessária para esse método excederia o limite, ele abandona o plano e considera outros planos. Para mais informações, consulte Limitar o uso de memória para otimização de intervalo.

- `rbr_exec_mode`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>20

  Para uso interno pelo **mysqlbinlog**. Esta variável troca o servidor entre os modos `IDEMPOTENT` e `STRICT`. O modo `IDEMPOTENT` causa a supressão de erros de chave duplicada e chave não encontrada em instruções `BINLOG` geradas pelo **mysqlbinlog**. Este modo é útil ao reproduzir um log binário baseado em linhas em um servidor que causa conflitos com dados existentes. O **mysqlbinlog** define este modo quando você especifica a opção `--idempotent`, escrevendo o seguinte na saída:

  ```
  SET SESSION RBR_EXEC_MODE=IDEMPOTENT;
  ```

  A partir do MySQL 8.0.18, definir o valor da sessão desta variável do sistema deixou de ser uma operação restrita.

- `read_buffer_size`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>21

  Cada fio que realiza uma varredura sequencial para uma tabela `MyISAM` aloca um buffer desse tamanho (em bytes) para cada tabela que ele varre. Se você fizer muitas varreduras sequenciais, talvez queira aumentar esse valor, que tem o valor padrão de 131072. O valor dessa variável deve ser um múltiplo de 4KB. Se for definido para um valor que não é um múltiplo de 4KB, seu valor é arredondado para baixo para o próximo múltiplo de 4KB.

  Essa opção também é usada no seguinte contexto para todos os outros motores de armazenamento, com exceção de `InnoDB`:

  - Para armazenar os índices em um arquivo temporário (não em uma tabela temporária), ao ordenar as linhas para `ORDER BY`.

  - Para inserção em massa em partições.

  - Para armazenar resultados de consultas aninhadas.

  `read_buffer_size` também é usado de outra maneira específica para um motor de armazenamento: para determinar o tamanho do bloco de memória para as tabelas `MEMORY`.

  A partir do MySQL 8.0.22, o valor de `select_into_buffer_size` é usado em vez do valor de `read_buffer_size` para o buffer de cache de E/S usado ao executar as instruções `SELECT INTO DUMPFILE` e `SELECT INTO OUTFILE`. (`read_buffer_size` é usado para o tamanho do buffer de cache de E/S em todos os outros casos.)

  Para obter mais informações sobre o uso da memória durante diferentes operações, consulte a Seção 10.12.3.1, “Como o MySQL usa a memória”.

- `read_only`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>22

  Se a variável de sistema `read_only` estiver habilitada, o servidor não permite atualizações de clientes, exceto para usuários que tenham o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`). Essa variável está desabilitada por padrão.

  O servidor também suporta uma variável de sistema `super_read_only` (desativada por padrão), que tem esses efeitos:

  - Se o `super_read_only` estiver ativado, o servidor proíbe as atualizações do cliente, mesmo de usuários que tenham o privilégio `CONNECTION_ADMIN` ou `SUPER`.

  - Definir `super_read_only` para `ON` faz implicitamente `read_only` para `ON`.

  - Definir `read_only` para `OFF` faz implicitamente `super_read_only` para `OFF`.

  Quando `read_only` está habilitado e quando `super_read_only` está habilitado, o servidor ainda permite essas operações:

  - Atualizações realizadas por threads de replicação, se o servidor for uma replica. Em configurações de replicação, pode ser útil habilitar `read_only` nos servidores replicados para garantir que as réplicas aceitem atualizações apenas do servidor de origem e não dos clientes.

  - Escreve na tabela do sistema `mysql.gtid_executed`, que armazena GTIDs para transações executadas que não estão presentes no arquivo de log binário atual.

  - Uso das instruções `ANALYZE TABLE` ou `OPTIMIZE TABLE`. O propósito do modo de leitura somente é impedir alterações na estrutura ou conteúdo da tabela. Análises e otimizações não se qualificam como tais alterações. Isso significa, por exemplo, que verificações de consistência em réplicas de leitura somente podem ser realizadas com **mysqlcheck** `--all-databases` `--analyze`.

  - Uso das declarações `FLUSH STATUS`, que são sempre escritas no log binário.

  - Operações nas tabelas `TEMPORARY`.

  - Insere nas tabelas de log (`mysql.general_log` e `mysql.slow_log`); veja a Seção 7.4.1, “Selecionando destinos de saída do log de consulta geral e do log de consulta lenta”.

  - Atualizações nas tabelas do Schema de Desempenho, como as operações `UPDATE` ou `TRUNCATE TABLE`.

  As alterações no `read_only` em um servidor de origem de replicação não são replicadas para os servidores de replica. O valor pode ser definido em um replica independente da configuração na origem.

  As seguintes condições se aplicam às tentativas de habilitar `read_only` (incluindo tentativas implícitas resultantes da habilitação de `super_read_only`):

  - A tentativa falha e um erro ocorre se você tiver bloqueios explícitos (adquiridos com `LOCK TABLES`) ou tiver uma transação pendente.

  - A tentativa é bloqueada enquanto outros clientes tiverem uma declaração em andamento, `LOCK TABLES WRITE` ativo ou um compromisso em andamento, até que os bloqueios sejam liberados e as declarações e transações terminem. Enquanto a tentativa de habilitar `read_only` estiver pendente, os pedidos de outros clientes para bloqueios de tabelas ou para iniciar transações também são bloqueados até que `read_only` seja definido.

  - A tentativa é bloqueada se houver transações ativas que mantêm bloqueios de metadados, até que essas transações sejam concluídas.

  - O `read_only` pode ser habilitado enquanto você mantém um bloqueio de leitura global (adquirido com `FLUSH TABLES WITH READ LOCK`) porque isso não envolve bloqueios de tabela.

- `read_rnd_buffer_size`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>23

  Essa variável é usada para leituras de tabelas `MyISAM` e, para qualquer mecanismo de armazenamento, para otimização de leitura de Multi-Range.

  Ao ler linhas de uma tabela `MyISAM` em ordem ordenada após uma operação de ordenação por chave, as linhas são lidas através deste buffer para evitar buscas no disco. Veja a Seção 10.2.1.16, “Otimização de ORDER BY”. Definir a variável para um valor grande pode melhorar muito o desempenho do `ORDER BY`. No entanto, este é um buffer alocado para cada cliente, portanto, você não deve definir a variável global para um valor grande. Em vez disso, altere a variável de sessão apenas dentro dos clientes que precisam executar consultas grandes.

  Para obter mais informações sobre o uso da memória durante diferentes operações, consulte a Seção 10.12.3.1, “Como o MySQL Usa a Memória”. Para informações sobre a otimização da leitura de várias faixas, consulte a Seção 10.2.1.11, “Otimização da Leitura de Várias Faixas”.

- `regexp_stack_limit`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>24

  A memória máxima disponível em bytes para a pilha interna usada para operações de correspondência de expressões regulares realizadas pelo `REGEXP_LIKE()` e funções semelhantes (consulte a Seção 14.8.2, "Expressões Regulares").

- `regexp_time_limit`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>25

  O limite de tempo para operações de correspondência com expressões regulares realizadas por `REGEXP_LIKE()` e funções semelhantes (consulte a Seção 14.8.2, “Expressões Regulares”). Esse limite é expresso como o número máximo permitido de etapas realizadas pelo mecanismo de correspondência, e, portanto, afeta o tempo de execução apenas indiretamente. Tipicamente, é da ordem de milissegundos.

- `require_row_format`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>26

  Esta variável é para uso interno do servidor por meio da replicação e do **mysqlbinlog**. Ela restringe os eventos de DML executados na sessão a eventos codificados apenas no formato de registro binário baseado em linhas, e tabelas temporárias não podem ser criadas. As consultas que não respeitam as restrições falham.

  Definir o valor da sessão desta variável de sistema para `ON` não requer privilégios. Definir o valor da sessão desta variável de sistema para `OFF` é uma operação restrita, e o usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `require_secure_transport`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>27

  Se as conexões do cliente com o servidor são necessárias para usar algum tipo de transporte seguro. Quando essa variável é habilitada, o servidor permite apenas conexões TCP/IP criptografadas usando TLS/SSL, ou conexões que usam um arquivo de soquete (no Unix) ou memória compartilhada (no Windows). O servidor rejeita tentativas de conexão não seguras, que falham com um erro `ER_SECURE_TRANSPORT_REQUIRED`.

  Essa capacidade complementa os requisitos de SSL por conta, que têm precedência. Por exemplo, se uma conta é definida com `REQUIRE SSL`, habilitar `require_secure_transport` não permite usar a conta para se conectar usando um arquivo de socket Unix.

  É possível que um servidor não tenha nenhum transporte seguro disponível. Por exemplo, um servidor no Windows não suporta nenhum transporte seguro se for iniciado sem especificar nenhum certificado SSL ou arquivo de chave e com a variável de sistema `shared_memory` desativada. Nessas condições, tentativas de habilitar `require_secure_transport` ao iniciar causam que o servidor escreva uma mensagem no log de erro e saia. Tentativas de habilitar a variável em tempo de execução falham com um erro `ER_NO_SECURE_TRANSPORTS_CONFIGURED`.

  Todos os membros do grupo de replicação devem ter o mesmo valor para essa variável; caso contrário, alguns membros podem não conseguir se juntar.

  Veja também Configurar conexões criptografadas como obrigatórias.

- `resultset_metadata`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>28

  Para conexões nas quais a transferência de metadados é opcional, o cliente define a variável de sistema `resultset_metadata` para controlar se o servidor retorna os metadados do conjunto de resultados. Os valores permitidos são `FULL` (retornar todos os metadados; este é o padrão) e `NONE` (não retornar metadados).

  Para conexões que não são opcionais de metadados, definir `resultset_metadata` para `NONE` produz um erro.

  Para obter detalhes sobre a gestão da transferência de metadados do conjunto de resultados, consulte Metadados Opcionais do Conjunto de Resultados.

- `secondary_engine_cost_threshold`

  Para uso apenas com o MySQL HeatWave. Consulte Variáveis do Sistema para obter mais informações.

- `schema_definition_cache`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>29

  Define um limite para o número de objetos de definição de esquema, tanto usados quanto não usados, que podem ser mantidos no cache do objeto de dicionário.

  Os objetos de definição de esquema não utilizados são mantidos apenas no cache do objeto do dicionário quando o número em uso é menor que a capacidade definida por `schema_definition_cache`.

  Uma configuração de `0` significa que os objetos de definição de esquema são mantidos apenas no cache do objeto dicionário enquanto estiverem em uso.

  Para obter mais informações, consulte a Seção 16.4, “Cache de Objetos do Dicionário”.

- `secure_file_priv`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>30

  Essa variável é usada para limitar o efeito das operações de importação e exportação de dados, como as realizadas pelas instruções `LOAD DATA` e `SELECT ... INTO OUTFILE` e pela função `LOAD_FILE()`. Essas operações são permitidas apenas para usuários que possuem o privilégio `FILE`.

  `secure_file_priv` pode ser definido da seguinte forma:

  - Se estiver vazia, a variável não terá efeito. Esse não é um ajuste seguro.

  - Se configurado para o nome de um diretório, o servidor limita as operações de importação e exportação para trabalhar apenas com arquivos nesse diretório. O diretório deve existir; o servidor não o cria.

  - Se configurado para `NULL`, o servidor desabilita as operações de importação e exportação.

  O valor padrão é específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` **CMake**, conforme mostrado na tabela a seguir. Para especificar explicitamente o valor padrão da opção `secure_file_priv` se você estiver compilando a partir do código-fonte, use a opção `INSTALL_SECURE_FILE_PRIVDIR` **CMake**.

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>31

  O servidor verifica o valor de `secure_file_priv` ao iniciar e escreve uma mensagem de alerta no log de erros se o valor for inseguro. Um valor que não seja `NULL` é considerado inseguro se for vazio, se o valor for o diretório de dados ou um subdiretório dele, ou se for um diretório acessível por todos os usuários. Se `secure_file_priv` for definido para um caminho inexistente, o servidor escreve uma mensagem de erro no log de erros e sai.

- `select_into_buffer_size`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>32

  Ao usar `SELECT INTO OUTFILE` ou `SELECT INTO DUMPFILE` para drenar dados em um ou mais arquivos para a criação de backups, migração de dados ou outros fins, os registros podem ser frequentemente armazenados em buffer e, em seguida, desencadear uma grande onda de atividade de E/S de escrita no disco ou em outro dispositivo de armazenamento, o que pode interromper outras consultas que são mais sensíveis à latência. Você pode usar essa variável para controlar o tamanho do buffer usado para escrever dados no dispositivo de armazenamento, determinando quando a sincronização do buffer deve ocorrer, e, assim, evitar que ocorram as interrupções de escrita do tipo descrito.

  `select_into_buffer_size` substitui qualquer valor definido para `read_buffer_size`. (`select_into_buffer_size` e `read_buffer_size` têm os mesmos valores padrão, máximo e mínimo.) Você também pode usar `select_into_disk_sync_delay` para definir um tempo de espera a ser observado posteriormente, cada vez que a sincronização ocorrer.

  A partir do MySQL 8.0.27, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `select_into_disk_sync`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>33

  Quando definido em `ON`, habilita a sincronização de buffers de escritas em um arquivo de saída por uma instrução `SELECT INTO OUTFILE` ou `SELECT INTO DUMPFILE` de longa duração usando `select_into_buffer_size`.

- `select_into_disk_sync_delay`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>34

  Quando a sincronização de tampão de escrita em um arquivo de saída por uma instrução `SELECT INTO OUTFILE` ou `SELECT INTO DUMPFILE` de longa duração é habilitada por `select_into_disk_sync`, essa variável define um atraso opcional (em milissegundos) após a sincronização. `0` (o padrão) significa sem atraso.

  A partir do MySQL 8.0.27, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `session_track_gtids`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>35

  Controla se o servidor retorna GTIDs ao cliente, permitindo que o cliente os use para rastrear o estado do servidor. Dependendo do valor da variável, no final da execução de cada transação, os GTIDs do servidor são capturados e retornados ao cliente como parte do reconhecimento. Os valores possíveis para `session_track_gtids` são os seguintes:

  - `OFF`: O servidor não retorna GTIDs ao cliente. Isso é o padrão.

  - `OWN_GTID`: O servidor retorna os GTIDs para todas as transações que foram comprometidas com sucesso por este cliente em sua sessão atual desde o último reconhecimento. Tipicamente, este é o único GTID para a última transação comprometida, mas se um único pedido de cliente resultou em várias transações, o servidor retorna um conjunto de GTIDs contendo todos os GTIDs relevantes.

  - `ALL_GTIDS`: O servidor retorna o valor global da variável de sistema `gtid_executed` do sistema, que ele lê em um ponto após a transação ter sido confirmada com sucesso. Além do GTID da transação que acabou de ser confirmada, este conjunto de GTID inclui todas as transações confirmadas no servidor por qualquer cliente e pode incluir transações confirmadas após o ponto em que a transação atualmente sendo reconhecida foi confirmada.

  `session_track_gtids` não pode ser definido dentro de um contexto transacional.

  Para obter mais informações sobre o rastreamento do estado de sessão, consulte a Seção 7.1.18, “Rastreamento do servidor do estado de sessão do cliente”.

- `session_track_schema`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>36

  Controla se o servidor registra quando o esquema padrão (banco de dados) é definido na sessão atual e notifica o cliente para disponibilizar o nome do esquema.

  Se o rastreador de nomes de esquema estiver habilitado, a notificação de nome ocorrerá toda vez que o esquema padrão for definido, mesmo que o novo nome do esquema seja o mesmo do antigo.

  Para obter mais informações sobre o rastreamento do estado de sessão, consulte a Seção 7.1.18, “Rastreamento do servidor do estado de sessão do cliente”.

- `session_track_state_change`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>37

  Controla se o servidor acompanha as alterações no estado da sessão atual e notifica o cliente quando ocorrem alterações de estado. As alterações podem ser relatadas para esses atributos do estado da sessão do cliente:

  - O esquema padrão (banco de dados).
  - Valores específicos para sessão de variáveis do sistema.
  - Variáveis definidas pelo usuário.
  - Tabelas temporárias.
  - Declarações preparadas.

  Se o rastreador de estado de sessão estiver habilitado, uma notificação será exibida para cada alteração que envolva atributos de sessão rastreados, mesmo que os novos valores dos atributos sejam os mesmos dos antigos. Por exemplo, definir uma variável definida pelo usuário para seu valor atual resulta em uma notificação.

  A variável `session_track_state_change` controla apenas a notificação de quando as alterações ocorrem, não o que são essas alterações. Por exemplo, as notificações de alterações de estado ocorrem quando o esquema padrão é definido ou quando as variáveis do sistema de sessão são atribuídas, mas a notificação não inclui o nome do esquema ou os valores das variáveis do sistema de sessão. Para receber notificações do nome do esquema ou dos valores das variáveis do sistema de sessão, use a variável de sistema `session_track_schema` ou `session_track_system_variables`, respectivamente.

  Nota

  Atribuir um valor a `session_track_state_change` em si não é considerado uma mudança de estado e não é relatado como tal. No entanto, se seu nome estiver listado no valor de `session_track_system_variables`, quaisquer atribuições a ele resultarão em notificação do novo valor.

  Para obter mais informações sobre o rastreamento do estado de sessão, consulte a Seção 7.1.18, “Rastreamento do servidor do estado de sessão do cliente”.

- `session_track_system_variables`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>38

  Controla se o servidor registra as atribuições às variáveis do sistema de sessão e notifica o cliente sobre o nome e o valor de cada variável atribuída. O valor da variável é uma lista separada por vírgula de variáveis para as quais deseja-se registrar as atribuições. Por padrão, a notificação está habilitada para `time_zone`, `autocommit`, `character_set_client`, `character_set_results` e `character_set_connection`. (Os três últimos são as variáveis afetadas por `SET NAMES`.)

  Para exibir o ID da declaração para cada declaração processada, use a variável `statement_id`. Por exemplo:

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

  O valor especial `*` faz com que o servidor acompanhe as atribuições a todas as variáveis de sessão. Se fornecido, esse valor deve ser especificado por si mesmo, sem nomes específicos de variáveis do sistema. Esse valor também permite a exibição do ID da declaração para cada declaração processada com sucesso.

  Para desabilitar a notificação das atribuições de variáveis de sessão, defina `session_track_system_variables` como uma string vazia.

  Se a opção de rastreamento de variáveis de sessão do sistema estiver habilitada, uma notificação será enviada para todas as atribuições às variáveis de sessão rastreadas, mesmo que os novos valores sejam os mesmos dos antigos.

  Para obter mais informações sobre o rastreamento do estado de sessão, consulte a Seção 7.1.18, “Rastreamento do servidor do estado de sessão do cliente”.

- `session_track_transaction_info`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>39

  Controla se o servidor registra o estado e as características das transações dentro da sessão atual e notifica o cliente para disponibilizar essas informações. Esses valores `session_track_transaction_info` são permitidos:

  - `OFF`: Desative o rastreamento do estado da transação. Isso é o padrão.

  - `STATE`: Habilitar o rastreamento do estado da transação sem o rastreamento de características. O rastreamento de estado permite que o cliente determine se uma transação está em andamento e se ela pode ser movida para uma sessão diferente sem ser revertida.

  - `CHARACTERISTICS`: Habilitar o rastreamento do estado da transação, incluindo o rastreamento de características. O rastreamento de características permite que o cliente determine como reiniciar uma transação em outra sessão, para que ela tenha as mesmas características da sessão original. As seguintes características são relevantes para esse propósito:

    ```
    ISOLATION LEVEL
    READ ONLY
    READ WRITE
    WITH CONSISTENT SNAPSHOT
    ```

  Para que um cliente possa transferir uma transação com segurança para outra sessão, ele deve monitorar não apenas o estado da transação, mas também suas características. Além disso, o cliente deve monitorar as variáveis de sistema `transaction_isolation` e `transaction_read_only` para determinar corretamente os padrões da sessão. (Para monitorar essas variáveis, liste-as no valor da variável de sistema `session_track_system_variables`.)

  Para obter mais informações sobre o rastreamento do estado de sessão, consulte a Seção 7.1.18, “Rastreamento do servidor do estado de sessão do cliente”.

- `sha256_password_auto_generate_rsa_keys`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>40

  O servidor usa essa variável para determinar se deve gerar automaticamente arquivos de par de chaves privadas/públicas RSA no diretório de dados, se eles ainda não existirem.

  Ao inicializar, o servidor gera automaticamente arquivos de par de chaves privadas/públicas RSA no diretório de dados se todas essas condições estiverem verdadeiras: A variável de sistema `sha256_password_auto_generate_rsa_keys` ou `caching_sha2_password_auto_generate_rsa_keys` estiver habilitada; nenhuma opção RSA for especificada; os arquivos RSA estiverem ausentes do diretório de dados. Esses arquivos de par de chaves permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password` ou `caching_sha2_password`; consulte a Seção 8.4.1.3, “Autenticação Plugável SHA-256”, e a Seção 8.4.1.2, “Cacheamento da Autenticação Plugável SHA-2”.

  Para obter mais informações sobre a autogeração de arquivos RSA, incluindo nomes e características dos arquivos, consulte a Seção 8.3.3.1, “Criando certificados e chaves SSL e RSA usando MySQL”.

  A variável de sistema `auto_generate_certs` está relacionada, mas controla a autogeração de arquivos de certificado e chave SSL necessários para conexões seguras usando SSL.

- `sha256_password_private_key_path`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>41

  O valor desta variável é o nome do caminho do arquivo da chave privada RSA para o plugin de autenticação `sha256_password`. Se o arquivo estiver nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM.

  Importante

  Como este arquivo armazena uma chave privada, seu modo de acesso deve ser restrito para que apenas o servidor MySQL possa lê-lo.

  Para obter informações sobre `sha256_password`, consulte a Seção 8.4.1.3, “Autenticação Pluggable SHA-256”.

- `sha256_password_proxy_users`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>42

  Essa variável controla se o plugin de autenticação embutido `sha256_password` suporta usuários proxy. Ela não tem efeito a menos que a variável de sistema `check_proxy_users` esteja habilitada. Para obter informações sobre o proxying de usuários, consulte a Seção 8.2.19, “Usuários Proxy”.

- `sha256_password_public_key_path`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>43

  O valor desta variável é o nome do caminho do arquivo de chave pública RSA para o plugin de autenticação `sha256_password`. Se o arquivo estiver nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM. Como este arquivo armazena uma chave pública, as cópias podem ser distribuídas livremente aos usuários do cliente. (Os clientes que especificam explicitamente uma chave pública ao se conectar ao servidor usando criptografia de senha RSA devem usar a mesma chave pública usada pelo servidor.)

  Para obter informações sobre o `sha256_password`, incluindo informações sobre como os clientes especificam a chave pública RSA, consulte a Seção 8.4.1.3, “Autenticação Pluggable SHA-256”.

- `shared_memory`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>44

  (Apenas para Windows.) Se o servidor permite conexões de memória compartilhada.

- `shared_memory_base_name`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>45

  (Apenas para Windows.) O nome da memória compartilhada a ser usado para conexões de memória compartilhada. Isso é útil ao executar múltiplas instâncias do MySQL em uma única máquina física. O nome padrão é `MYSQL`. O nome é sensível a maiúsculas e minúsculas.

  Esta variável só se aplica se o servidor for iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `show_create_table_skip_secondary_engine`

  Para uso apenas com o MySQL HeatWave. Consulte Variáveis do Sistema para obter mais informações.

- `show_create_table_verbosity`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>46

  `SHOW CREATE TABLE` normalmente não exibe a opção de tabela `ROW_FORMAT` se o formato da linha for o formato padrão. Ativação desta variável faz com que `SHOW CREATE TABLE` exiba `ROW_FORMAT` independentemente de ser o formato padrão.

- `show_gipk_in_create_table_and_information_schema`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>47

  Se as chaves primárias invisíveis geradas forem visíveis na saída das instruções `SHOW` e nas tabelas do Schema de Informações. Quando essa variável for definida como `OFF`, essas chaves não serão exibidas.

  Essa variável não é replicada.

  Para obter mais informações, consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”.

- `show_old_temporals`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>48

  Se a saída `SHOW CREATE TABLE` incluir comentários para marcar colunas temporais encontradas no formato anterior a 5.6.4 (colunas `TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de frações de segundo). Essa variável é desabilitada por padrão. Se habilitada, a saída `SHOW CREATE TABLE` ficará assim:

  ```
  CREATE TABLE `mytbl` (
    `ts` timestamp /* 5.5 binary format */ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dt` datetime /* 5.5 binary format */ DEFAULT NULL,
    `t` time /* 5.5 binary format */ DEFAULT NULL
  ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  ```

  A saída para a coluna `COLUMN_TYPE` da tabela do esquema de informações `COLUMNS` é afetada de maneira semelhante.

  Essa variável está desatualizada e está sujeita à remoção em uma futura versão do MySQL.

  A partir do MySQL 8.0.27, definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `skip_external_locking`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>49

  Isso é `OFF` se o **mysqld** usar o bloqueio externo (bloqueio do sistema), `ON` se o bloqueio externo estiver desativado. Isso afeta apenas o acesso à tabela `MyISAM`.

  Essa variável é definida pela opção `--external-locking` ou `--skip-external-locking`. O bloqueio externo é desativado por padrão.

  O bloqueio externo afeta apenas o acesso à tabela `MyISAM`. Para obter mais informações, incluindo as condições em que ele pode e não pode ser usado, consulte a Seção 10.11.5, “Bloqueio Externo”.

- `skip_name_resolve`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>50

  Se resolver nomes de host ao verificar conexões de clientes. Se essa variável for `OFF`, o **mysqld** resolve nomes de host ao verificar conexões de clientes. Se for `ON`, o **mysqld** usa apenas números de IP; nesse caso, todos os valores da coluna `Host` nas tabelas de concessão devem ser endereços IP. Veja a Seção 7.1.12.3, “Consultas DNS e Cache de Host”.

  Dependendo da configuração da rede do seu sistema e dos valores `Host` das suas contas, os clientes podem precisar se conectar usando uma opção explícita `--host`, como `--host=127.0.0.1` ou `--host=::1`.

  Uma tentativa de conexão com o host `127.0.0.1` normalmente resolve para a conta `localhost`. No entanto, isso falha se o servidor for executado com `skip_name_resolve` habilitado. Se você planeja fazer isso, certifique-se de que existe uma conta que possa aceitar uma conexão. Por exemplo, para poder se conectar como `root` usando `--host=127.0.0.1` ou `--host=::1`, crie essas contas:

  ```
  CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
  CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
  ```

- `skip_networking`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>51

  Esta variável controla se o servidor permite conexões TCP/IP. Por padrão, ela está desabilitada (permitir conexões TCP). Se habilitada, o servidor permite apenas conexões locais (não TCP/IP) e toda interação com o **mysqld** deve ser feita usando tubos nomeados ou memória compartilhada (no Windows) ou arquivos de soquete Unix (no Unix). Esta opção é altamente recomendada para sistemas onde apenas clientes locais são permitidos. Veja a Seção 7.1.12.3, “Consultas DNS e Cache de Hospedeiros”.

  Como o servidor é iniciado com `--skip-grant-tables`, as verificações de autenticação são desativadas, e, nesse caso, o servidor também desativa as conexões remotas ao ativar `skip_networking`.

- `skip_show_database`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>52

  Isso impede que as pessoas usem a declaração `SHOW DATABASES` se não tiverem o privilégio `SHOW DATABASES`. Isso pode melhorar a segurança se você tiver preocupações sobre os usuários poderem ver bancos de dados pertencentes a outros usuários. Seu efeito depende do privilégio `SHOW DATABASES`: Se o valor da variável for `ON`, a declaração `SHOW DATABASES` só é permitida para usuários que têm o privilégio `SHOW DATABASES`, e a declaração exibe todos os nomes dos bancos de dados. Se o valor for `OFF`, `SHOW DATABASES` é permitido a todos os usuários, mas exibe os nomes apenas dos bancos de dados para os quais o usuário tem o privilégio `SHOW DATABASES` ou outro privilégio.

  Cuidado

  Como qualquer privilégio global estático é considerado um privilégio para todas as bases de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de base de dados com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` de `INFORMATION_SCHEMA`, exceto as bases de dados que foram restringidas ao nível da base de dados por revogações parciais.

- `slow_launch_time`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>53

  Se a criação de um tópico demorar mais do que esse número de segundos, o servidor incrementa a variável de status `Slow_launch_threads`.

- `slow_query_log`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>54

  Se o registro de consultas lentas está habilitado. O valor pode ser 0 (ou `OFF`) para desabilitar o registro ou 1 (ou `ON`) para habilitar o registro. O destino para a saída do log é controlado pela variável de sistema `log_output`; se esse valor for `NONE`, nenhuma entrada de log é escrita, mesmo que o log esteja habilitado.

  “Lento” é determinado pelo valor da variável `long_query_time`. Veja a Seção 7.4.5, “O Log de Consultas Lentas”.

- `slow_query_log_file`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>55

  O nome do arquivo de registro de consultas lentas. O valor padrão é `host_name-slow.log`, mas o valor inicial pode ser alterado com a opção `--slow_query_log_file`.

- `socket`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>56

  Em plataformas Unix, essa variável é o nome do arquivo de soquete usado para conexões locais de clientes. O padrão é `/tmp/mysql.sock`. (Para alguns formatos de distribuição, o diretório pode ser diferente, como `/var/lib/mysql` para RPMs.)

  No Windows, essa variável é o nome do tubo nomeado que é usado para conexões de clientes locais. O valor padrão é `MySQL` (não case-sensitive).

- `sort_buffer_size`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>57

  Cada sessão que precisa realizar uma ordenação aloca um buffer desse tamanho. `sort_buffer_size` não é específico de nenhum mecanismo de armazenamento e se aplica de maneira geral para otimização. No mínimo, o valor `sort_buffer_size` deve ser grande o suficiente para acomodar quinze tuplas no buffer de ordenação. Além disso, aumentar o valor de `max_sort_length` pode exigir o aumento do valor de `sort_buffer_size`. Para mais informações, consulte a Seção 10.2.1.16, “Otimização de ORDER BY”

  Se você ver muitos `Sort_merge_passes` por segundo na saída de `SHOW GLOBAL STATUS`, você pode considerar aumentar o valor de `sort_buffer_size` para acelerar as operações de `ORDER BY` ou `GROUP BY` que não podem ser melhoradas com otimização de consulta ou indexação aprimorada.

  O otimizador tenta descobrir quanto espaço é necessário, mas pode alocar mais, até o limite. Definir um valor maior que o necessário globalmente desacelera a maioria das consultas que realizam ordenamentos. É melhor aumentá-lo como um ajuste de sessão e apenas para as sessões que precisam de um tamanho maior. No Linux, existem limiares de 256 KB e 2 MB, onde valores maiores podem desacelerar significativamente a alocação de memória, então você deve considerar ficar abaixo de um desses valores. Experimente para encontrar o melhor valor para sua carga de trabalho. Veja a Seção B.3.3.5, “Onde o MySQL Armazena Arquivos Temporários”.

  O ajuste máximo permitido para `sort_buffer_size` é 4GB−1. Valores maiores são permitidos para plataformas de 64 bits (exceto o Windows de 64 bits, para o qual valores grandes são truncados para 4GB−1 com uma mensagem de aviso).

- `sql_auto_is_null`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>58

  Se essa variável estiver habilitada, após uma declaração que insere com sucesso um valor `AUTO_INCREMENT` gerado automaticamente, você poderá encontrar esse valor executando uma declaração do seguinte formato:

  ```
  SELECT * FROM tbl_name WHERE auto_col IS NULL
  ```

  Se a declaração retornar uma linha, o valor retornado será o mesmo se você tivesse invocado a função `LAST_INSERT_ID()`. Para obter detalhes, incluindo o valor de retorno após uma inserção de várias linhas, consulte a Seção 14.15, “Funções de Informação”. Se nenhum valor de `AUTO_INCREMENT` foi inserido com sucesso, a declaração `SELECT` não retornará nenhuma linha.

  O comportamento de recuperar um valor `AUTO_INCREMENT` usando uma comparação com `IS NULL` é utilizado por alguns programas ODBC, como o Access. Veja Como obter valores de autoincremento. Esse comportamento pode ser desativado definindo `sql_auto_is_null` para `OFF`.

  Antes do MySQL 8.0.16, a transformação de `WHERE auto_col IS NULL` para `WHERE auto_col = LAST_INSERT_ID()` era realizada apenas quando a instrução era executada, de modo que o valor de `sql_auto_is_null` durante a execução determinava se a consulta era transformada. No MySQL 8.0.16 e versões posteriores, a transformação é realizada durante a preparação da instrução.

  O valor padrão de `sql_auto_is_null` é `OFF`.

- `sql_big_selects`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>59

  Se configurado para `OFF`, o MySQL interrompe as instruções `SELECT` que provavelmente levarão muito tempo para serem executadas (ou seja, instruções para as quais o otimizador estima que o número de linhas examinadas exceda o valor de `max_join_size`). Isso é útil quando uma instrução `WHERE` desaconselhável foi emitida. O valor padrão para uma nova conexão é `ON`, que permite todas as instruções `SELECT`.

  Se você definir a variável de sistema `max_join_size` para um valor diferente de `DEFAULT`, `sql_big_selects` será definido como `OFF`.

- `sql_buffer_result`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>60

  Se habilitado, `sql_buffer_result` obriga os resultados das instruções `SELECT` a serem colocados em tabelas temporárias. Isso ajuda o MySQL a liberar os bloqueios da tabela mais cedo e pode ser benéfico em casos em que leva muito tempo para enviar os resultados ao cliente. O valor padrão é `OFF`.

- `sql_generate_invisible_primary_key`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>61

  Se este servidor adicionar uma chave primária primária gerada e invisível a qualquer tabela `InnoDB` que for criada sem uma.

  Essa variável não é replicada. Além disso, mesmo que definida na replica, ela é ignorada pelos threads do aplicativo de replicação; isso significa que, por padrão, uma replica não gera uma chave primária para nenhuma tabela replicada que, na fonte, foi criada sem uma. No MySQL 8.0.32 e versões posteriores, você pode fazer com que a replica gere chaves primárias invisíveis para essas tabelas, definindo `REQUIRE_TABLE_PRIMARY_KEY_CHECK = GENERATE` como parte de uma instrução `CHANGE REPLICATION SOURCE TO`, especificando opcionalmente um canal de replicação.

  Para obter mais informações e exemplos, consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”.

- `sql_log_off`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>62

  Essa variável controla se o registro no log de consulta geral está desativado para a sessão atual (assumindo que o próprio log de consulta geral esteja habilitado). O valor padrão é `OFF` (ou seja, habilitar o registro). Para desabilitar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável da sessão `sql_log_off` para `ON` ou `OFF`.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

- `sql_mode`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>63

  O modo SQL do servidor atual, que pode ser definido dinamicamente. Para obter detalhes, consulte a Seção 7.1.11, “Modos SQL do Servidor”.

  Nota

  Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação.

  Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opções que o servidor lê ao iniciar.

- `sql_notes`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>64

  Se habilitada (padrão), os diagnósticos do nível `Note` incrementam `warning_count` e o servidor os registra. Se desabilitada, os diagnósticos de `Note` não incrementam `warning_count` e o servidor não os registra. O **mysqldump** inclui a saída para desabilitar essa variável, para que a recarga do arquivo de dump não produza avisos para eventos que não afetam a integridade da operação de recarga.

- `sql_quote_show_create`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>65

  Se habilitada (padrão), o servidor cita identificadores para as instruções `SHOW CREATE TABLE` e `SHOW CREATE DATABASE`. Se desabilitada, a citação é desativada. Esta opção é habilitada por padrão para que a replicação funcione para identificadores que exigem citação. Consulte a Seção 15.7.7.10, “Instrução SHOW CREATE TABLE”, e a Seção 15.7.7.6, “Instrução SHOW CREATE DATABASE”.

- `sql_require_primary_key`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>66

  Se as declarações que criam novas tabelas ou alteram a estrutura de tabelas existentes obrigam o requisito de que as tabelas tenham uma chave primária.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

  Ativação desta variável ajuda a evitar problemas de desempenho na replicação baseada em linhas que podem ocorrer quando as tabelas não têm uma chave primária. Suponha que uma tabela não tenha uma chave primária e uma atualização ou exclusão modifique várias linhas. No servidor de origem da replicação, essa operação pode ser realizada usando uma única varredura da tabela, mas, quando replicada usando a replicação baseada em linhas, resulta em uma varredura da tabela para cada linha que será modificada na replica. Com uma chave primária, essas varreduras da tabela não ocorrem.

  O `sql_require_primary_key` se aplica tanto às tabelas de base quanto às tabelas `TEMPORARY`, e as alterações em seu valor são replicadas para os servidores de replicação. A partir do MySQL 8.0.18, ele se aplica apenas aos motores de armazenamento que podem participar da replicação.

  Quando ativado, `sql_require_primary_key` tem esses efeitos:

  - As tentativas de criar uma nova tabela sem uma chave primária falham com um erro. Isso inclui `CREATE TABLE ... LIKE`. Também inclui `CREATE TABLE ... SELECT`, a menos que a parte `CREATE TABLE` inclua uma definição de chave primária.

  - As tentativas de remover a chave primária de uma tabela existente falham com um erro, com a exceção de que a remoção da chave primária e a adição de uma chave primária na mesma declaração `ALTER TABLE` são permitidas.

    A exclusão da chave primária falha mesmo se a tabela também contiver um índice `UNIQUE NOT NULL`.

  - As tentativas de importar uma tabela sem uma chave primária falham com um erro.

  A opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` da declaração `CHANGE REPLICATION SOURCE TO` (MySQL 8.0.23 e versões posteriores) ou da declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) permite que uma replica selecione sua própria política para verificações de chave primária. Quando a opção é definida para `ON` para um canal de replicação, a replica sempre usa o valor `ON` para a variável de sistema `sql_require_primary_key` nas operações de replicação, exigindo uma chave primária. Quando a opção é definida para `OFF`, a replica sempre usa o valor `OFF` para a variável de sistema `sql_require_primary_key` nas operações de replicação, de modo que nunca é necessária uma chave primária, mesmo que a fonte a exija. Quando a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` é definida para `STREAM`, que é o padrão, a replica usa qualquer valor que seja replicado da fonte para cada transação. Com a configuração `STREAM` para a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK`, se as verificações de privilégio estiverem em uso para o canal de replicação, a conta `PRIVILEGE_CHECKS_USER` precisa de privilégios suficientes para definir variáveis de sessão restritas, para que possa definir o valor de sessão para a variável de sistema `sql_require_primary_key`. Com as configurações `ON` ou `OFF`, a conta não precisa desses privilégios. Para mais informações, consulte a Seção 19.3.3, “Verificações de Privilégio de Replicação”.

- `sql_safe_updates`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>67

  Se essa variável estiver habilitada, as instruções `UPDATE` e `DELETE` que não utilizam uma chave na cláusula `WHERE` ou na cláusula `LIMIT` produzirão um erro. Isso permite capturar as instruções `UPDATE` e `DELETE` onde as chaves não são usadas corretamente e que provavelmente alterariam ou excluiriam um grande número de linhas. O valor padrão é `OFF`.

  Para o cliente **mysql**, `sql_safe_updates` pode ser habilitado usando a opção `--safe-updates`. Para mais informações, consulte "Usando o modo de atualizações seguras (--safe-updates)".

- `sql_select_limit`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>68

  O número máximo de linhas a serem retornadas a partir das instruções `SELECT`. Para mais informações, consulte "Usando o modo de Atualizações Seguras (--safe-updates)").

  O valor padrão para uma nova conexão é o número máximo de linhas que o servidor permite por tabela. Os valores padrão típicos são (232)−1 ou (264)−1. Se você alterou o limite, o valor padrão pode ser restaurado atribuindo um valor de `DEFAULT`.

  Se uma cláusula `SELECT` tiver uma cláusula `LIMIT`, a cláusula `LIMIT` terá precedência sobre o valor de `sql_select_limit`.

- `sql_warnings`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>69

  Esta variável controla se as instruções `INSERT` de uma única linha produzem uma string de informações se ocorrerem avisos. O padrão é `OFF`. Defina o valor para `ON` para produzir uma string de informações.

- `ssl_ca`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>70

  O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA) no formato PEM. O arquivo contém uma lista de Autoridades de Certificação SSL confiáveis.

  A partir do MySQL 8.0.16, essa variável é dinâmica e pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e monitoramento em tempo de execução no lado do servidor para conexões criptografadas. Antes do MySQL 8.0.16, essa variável só pode ser definida na inicialização do servidor.

- `ssl_capath`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>71

  O nome do caminho do diretório que contém arquivos de certificado da Autoridade de Certificação SSL (CA) confiável no formato PEM. Você deve executar o OpenSSL `rehash` no diretório especificado por esta opção antes de usá-lo. Em sistemas Linux, você pode invocar `rehash` da seguinte maneira:

  ```
  $> openssl rehash path/to/directory
  ```

  Nas plataformas Windows, você pode usar o script `c_rehash` em um prompt de comando, da seguinte maneira:

  ```
  \> c_rehash path/to/directory
  ```

  Consulte openssl-rehash para obter a sintaxe completa e outras informações.

  A partir do MySQL 8.0.16, essa variável é dinâmica e pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e monitoramento em tempo de execução no lado do servidor para conexões criptografadas. Antes do MySQL 8.0.16, essa variável só pode ser definida na inicialização do servidor.

- `ssl_cert`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>72

  O nome do caminho do arquivo de certificado de chave pública SSL do servidor no formato PEM.

  Se o servidor for iniciado com `ssl_cert` definido para um certificado que utiliza qualquer cifra ou categoria de cifra restrita, o servidor será iniciado com o suporte para conexões criptografadas desativado. Para obter informações sobre as restrições de cifra, consulte Configuração de cifra de conexão.

  A partir do MySQL 8.0.16, essa variável é dinâmica e pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e monitoramento em tempo de execução no lado do servidor para conexões criptografadas. Antes do MySQL 8.0.16, essa variável só pode ser definida na inicialização do servidor.

  Nota

  O suporte a certificados SSL encadeados foi adicionado na versão 8.0.30; anteriormente, apenas o primeiro certificado era lido.

- `ssl_cipher`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>73

  A lista de cifra de criptografia permitida para conexões que utilizam protocolos TLS até o TLSv1.2. Se nenhuma cifra na lista for suportada, as conexões criptografadas que utilizam esses protocolos TLS não funcionarão.

  Para maior portabilidade, a lista de cifra deve ser uma lista de um ou mais nomes de cifra, separados por dois pontos (:). O exemplo a seguir mostra dois nomes de cifra separados por dois pontos:

  ```
  [mysqld]
  ssl_cipher="DHE-RSA-AES128-GCM-SHA256:AES128-SHA"
  ```

  O OpenSSL suporta a sintaxe para especificar cifrares descritos na documentação do OpenSSL em <https://www.openssl.org/docs/manmaster/man1/ciphers.html>.

  Para obter informações sobre os criptogramas de encriptação suportados pelo MySQL, consulte a Seção 8.3.2, “Protocolos e criptogramas de conexão TLS encriptados”.

  A partir do MySQL 8.0.16, essa variável é dinâmica e pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e monitoramento em tempo de execução no lado do servidor para conexões criptografadas. Antes do MySQL 8.0.16, essa variável só pode ser definida na inicialização do servidor.

- `ssl_crl`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>74

  O nome do caminho do arquivo que contém as listas de revogação de certificados no formato PEM.

  A partir do MySQL 8.0.16, essa variável é dinâmica e pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e monitoramento em tempo de execução no lado do servidor para conexões criptografadas. Antes do MySQL 8.0.16, essa variável só pode ser definida na inicialização do servidor.

- `ssl_crlpath`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>75

  O caminho do diretório que contém arquivos da lista de revogação de certificados no formato PEM.

  A partir do MySQL 8.0.16, essa variável é dinâmica e pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e monitoramento em tempo de execução no lado do servidor para conexões criptografadas. Antes do MySQL 8.0.16, essa variável só pode ser definida na inicialização do servidor.

- `ssl_fips_mode`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>76

  Controla se o modo FIPS deve ser habilitado no lado do servidor. A variável de sistema `ssl_fips_mode` difere de outras variáveis de sistema `ssl_xxx` porque não é usada para controlar se o servidor permite conexões criptografadas, mas sim para afetar quais operações criptográficas são permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Estes valores `ssl_fips_mode` são permitidos:

  - `OFF` (ou 0): Desative o modo FIPS.
  - `ON` (ou 1): Ative o modo FIPS.
  - `STRICT` (ou 2): Ative o modo FIPS "estricto".

  Nota

  Se o Módulo de Objeto OpenSSL FIPS não estiver disponível, o único valor permitido para `ssl_fips_mode` é `OFF`. Nesse caso, ao definir `ssl_fips_mode` para `ON` ou `STRICT` durante o início, o servidor produzirá uma mensagem de erro e encerrará.

  A partir do MySQL 8.0.34, essa opção é desatualizada e torna-se somente de leitura. Espera-se que ela seja removida em uma versão futura do MySQL.

- `ssl_key`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>77

  O nome do caminho do arquivo de chave privada SSL do servidor no formato PEM. Para maior segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

  Se o arquivo de chave estiver protegido por uma senha, o servidor solicita ao usuário a senha. A senha deve ser fornecida interativamente; ela não pode ser armazenada em um arquivo. Se a senha estiver incorreta, o programa continua como se não conseguisse ler a chave.

  A partir do MySQL 8.0.16, essa variável é dinâmica e pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e monitoramento em tempo de execução no lado do servidor para conexões criptografadas. Antes do MySQL 8.0.16, essa variável só pode ser definida na inicialização do servidor.

- `ssl_session_cache_mode`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>78

  Controla se o cache de sessão deve ser habilitado na memória no lado do servidor e a geração de tickets de sessão pelo servidor. O modo padrão é `ON` (modo de habilitar o cache de sessão). Uma alteração na variável de sistema `ssl_session_cache_mode` tem efeito apenas após a execução da instrução `ALTER INSTANCE RELOAD TLS`, ou após um reinício, se o valor da variável foi persistido.

  Estes valores `ssl_session_cache_mode` são permitidos:

  - `ON`: Habilitar o modo de cache de sessão.
  - `OFF`: Desative o modo de cache de sessão.

  O servidor não anuncia seu suporte à retomada da sessão se o valor desta variável do sistema for `OFF`. Quando executado no OpenSSL 1.0.`x` os ingressos da sessão são sempre gerados, mas os ingressos não são utilizáveis quando `ssl_session_cache_mode` está habilitado.

  O valor atual em vigor para `ssl_session_cache_mode` pode ser observado com a variável de status `Ssl_session_cache_mode`.

- `ssl_session_cache_timeout`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>79

  Define um período de tempo durante o qual a reutilização de sessões anteriores é permitida ao estabelecer uma nova conexão criptografada com o servidor, desde que a variável de sistema `ssl_session_cache_mode` esteja habilitada e os dados da sessão anterior estejam disponíveis. Se o tempo limite da sessão expirar, a sessão não poderá ser reutilizada.

  O valor padrão é de 300 segundos e o valor máximo é de 84600 (ou um dia em segundos). Uma alteração na variável de sistema `ssl_session_cache_timeout` só tem efeito após a execução da instrução `ALTER INSTANCE RELOAD TLS`, ou após um reinício, se o valor da variável foi persistido. O valor atual em vigor para `ssl_session_cache_timeout` pode ser observado com a variável de status `Ssl_session_cache_timeout`.

- `statement_id`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>80

  Cada instrução executada na sessão atual recebe um número de sequência. Isso pode ser usado juntamente com a variável de sistema `session_track_system_variables` para identificar essa instrução nas tabelas do Performance Schema, como a tabela `events_statements_history`.

- `stored_program_cache`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>81

  Define um limite superior suave para o número de rotinas armazenadas em cache por conexão. O valor desta variável é especificado em termos do número de rotinas armazenadas mantidas em cada um dos dois caches mantidos pelo MySQL Server para procedimentos armazenados e funções armazenadas, respectivamente.

  Sempre que uma rotina armazenada é executada, esse tamanho de cache é verificado antes da primeira ou da declaração de nível superior na rotina ser analisada; se o número de rotinas do mesmo tipo (procedimentos armazenados ou funções armazenadas, dependendo de qual está sendo executada) exceder o limite especificado por essa variável, o cache correspondente é esvaziado e a memória previamente alocada para objetos armazenados é liberada. Isso permite que o cache seja esvaziado com segurança, mesmo quando há dependências entre rotinas armazenadas.

  Os caches de procedimentos armazenados e funções armazenadas existem em paralelo com a partição de cache de definição de programas armazenados do cache do objeto do dicionário. Os caches de procedimentos armazenados e funções armazenadas são por conexão, enquanto o cache de definição de programas armazenados é compartilhado. A existência de objetos nos caches de procedimentos armazenados e funções armazenadas não depende da existência de objetos no cache de definição de programas armazenados, e vice-versa. Para mais informações, consulte a Seção 16.4, “Cache do Objeto do Dicionário”.

- `stored_program_definition_cache`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>82

  Define um limite para o número de objetos de definição de programas armazenados, tanto os usados quanto os não usados, que podem ser mantidos no cache do objeto de dicionário.

  Os objetos de definição de programas armazenados não utilizados são mantidos apenas no cache do objeto de dicionário quando o número em uso é menor que a capacidade definida por `stored_program_definition_cache`.

  Um valor de 0 significa que os objetos de definição de programas armazenados são mantidos apenas no cache do objeto dicionário enquanto estiverem em uso.

  A partição de cache de definição de programa armazenado existe em paralelo com os caches de procedimentos armazenados e funções armazenadas que são configurados usando a opção `stored_program_cache`.

  A opção `stored_program_cache` define um limite superior suave para o número de procedimentos ou funções armazenados em cache por conexão, e o limite é verificado toda vez que uma conexão executa um procedimento ou função armazenada. A partição de cache de definição de programas armazenados, por outro lado, é um cache compartilhado que armazena objetos de definição de programas armazenados para outros propósitos. A existência de objetos na partição de cache de definição de programas armazenados não depende da existência de objetos no cache de procedimentos armazenados ou no cache de funções armazenadas, e vice-versa.

  Para informações relacionadas, consulte a Seção 16.4, “Cache de Objetos do Dicionário”.

- `super_read_only`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>83

  Se a variável de sistema `read_only` estiver habilitada, o servidor não permite atualizações de clientes, exceto para usuários que tenham o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`). Se a variável de sistema `super_read_only` também estiver habilitada, o servidor proíbe atualizações de clientes, mesmo para usuários que tenham `CONNECTION_ADMIN` ou `SUPER`. Consulte a descrição da variável de sistema `read_only` para obter uma descrição do modo de leitura somente e informações sobre como `read_only` e `super_read_only` interagem.

  As atualizações do cliente prevenidas quando o `super_read_only` está habilitado incluem operações que nem sempre parecem ser atualizações, como `CREATE FUNCTION` (para instalar uma função carregável), `INSTALL PLUGIN` e `INSTALL COMPONENT`. Essas operações são proibidas porque envolvem alterações em tabelas no esquema de sistema `mysql`.

  Da mesma forma, se o Agendamento de Eventos estiver habilitado, habilitar a variável de sistema `super_read_only` impede que ela atualize os timestamps de "última execução" do evento na tabela do dicionário de dados `events`. Isso faz com que o Agendamento de Eventos pare na próxima vez que tentar executar um evento agendado, após escrever uma mensagem no log de erro do servidor. (Nesse caso, a variável de sistema `event_scheduler` não muda de `ON` para `OFF`. Uma implicação é que essa variável rejeita a *intenção* do DBA de que o Agendamento de Eventos seja habilitado ou desabilitado, onde seu status real de iniciado ou parado pode ser distinto.). Se `super_read_only` for desabilitado posteriormente após ser habilitado, o servidor reinicia automaticamente o Agendamento de Eventos conforme necessário, a partir do MySQL 8.0.26. Antes do MySQL 8.0.26, é necessário reiniciar manualmente o Agendamento de Eventos habilitando-o novamente.

  As alterações no `super_read_only` em um servidor de origem de replicação não são replicadas para os servidores de replica. O valor pode ser definido em um replica independente da configuração na origem.

- `syseventlog.facility`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>84

  A opção de saída do log de erros escrita em `syslog` (que tipo de programa está enviando a mensagem). Esta variável não está disponível, a menos que o componente de log de erros `log_sink_syseventlog` esteja instalado. Veja a Seção 7.4.2.8, “Registro de Erros no Log do Sistema”.

  Os valores permitidos podem variar conforme o sistema operacional; consulte a documentação do seu sistema `syslog`.

  Essa variável não existe no Windows.

- `syseventlog.include_pid`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>85

  Se incluir o ID do processo do servidor em cada linha de saída do log de erro escrito em `syslog`. Essa variável não está disponível, a menos que o componente de log de erro `log_sink_syseventlog` esteja instalado. Veja a Seção 7.4.2.8, “Registro de Erros no Log do Sistema”.

  Essa variável não existe no Windows.

- `syseventlog.tag`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>86

  A tag a ser adicionada ao identificador do servidor na saída do log de erro escrito em `syslog` ou no Log de Eventos do Windows. Essa variável não está disponível, a menos que o componente do log de erro `log_sink_syseventlog` esteja instalado. Veja a Seção 7.4.2.8, “Registro de Erros no Log do Sistema”.

  Por padrão, nenhuma tag é definida, então o identificador do servidor é simplesmente `MySQL` no Windows e `mysqld` em outras plataformas. Se um valor de tag de `tag` for especificado, ele é anexado ao identificador do servidor com um hífen no início, resultando em um identificador `syslog` de `mysqld-tag` (ou `MySQL-tag` no Windows).

  No Windows, para usar uma etiqueta que ainda não existe, o servidor deve ser executado a partir de uma conta com privilégios de administrador, para permitir a criação de uma entrada de registro para a etiqueta. Privilegios elevados não são necessários se a etiqueta já existir.

- `system_time_zone`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>87

  O fuso horário do sistema do servidor. Quando o servidor começa a ser executado, ele herda um ajuste do fuso horário das configurações padrão da máquina, possivelmente modificado pelo ambiente da conta usada para executar o servidor ou pelo script de inicialização. O valor é usado para definir `system_time_zone`. Para especificar explicitamente o fuso horário do sistema, defina a variável de ambiente `TZ` ou use a opção `--timezone` do script **mysqld\_safe**.

  A partir do MySQL 8.0.26, além da inicialização do tempo de início, se o fuso horário do host do servidor for alterado (por exemplo, devido ao horário de verão), `system_time_zone` reflete essa mudança, o que tem essas implicações para as aplicações:

  - As consultas que fazem referência a `system_time_zone` receberão um valor antes de uma mudança de horário de verão e um valor diferente após a mudança.

  - Para consultas que começam a ser executadas antes de uma mudança de horário de verão e terminam após a mudança, o `system_time_zone` permanece constante dentro da consulta, pois o valor geralmente é armazenado em cache no início da execução.

  A variável `system_time_zone` difere da variável `time_zone`. Embora possam ter o mesmo valor, a última variável é usada para inicializar o fuso horário para cada cliente que se conecta. Veja a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.

- `table_definition_cache`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>88

  O número de definições de tabela que podem ser armazenadas no cache de definição de tabela. Se você usar um grande número de tabelas, pode criar um cache de definição de tabela grande para acelerar a abertura das tabelas. O cache de definição de tabela ocupa menos espaço e não usa descritores de arquivo, ao contrário do cache normal de tabela. O valor mínimo é 400. O valor padrão é baseado na seguinte fórmula, limitada a um limite de 2000:

  ```
  MIN(400 + table_open_cache / 2, 2000)
  ```

  Para `InnoDB`, o ajuste `table_definition_cache` atua como um limite suave para o número de instâncias de tabela no cache do objeto de dicionário e o número de espaços de tabela por arquivo que podem ser abertos de uma só vez.

  Se o número de instâncias de tabela no cache do objeto de dicionário exceder o limite `table_definition_cache`, um mecanismo LRU começa a marcar as instâncias de tabela para remoção e, eventualmente, as remove do cache do objeto de dicionário. O número de tabelas abertas com metadados armazenados em cache pode ser maior que o limite `table_definition_cache` devido às instâncias de tabela com relações de chave estrangeira, que não são colocadas na lista LRU.

  O número de espaços de tabela por arquivo que podem ser abertos de uma só vez é limitado pelas configurações `table_definition_cache` e `innodb_open_files`. Se ambas as variáveis forem definidas, a configuração mais alta é usada. Se nenhuma das variáveis for definida, a configuração `table_definition_cache`, que tem um valor padrão mais alto, é usada. Se o número de espaços de tabela abertos exceder o limite definido por `table_definition_cache` ou `innodb_open_files`, um mecanismo LRU pesquisa a lista LRU por arquivos de espaços de tabela que estão completamente descarregados e atualmente não estão sendo estendidos. Esse processo é realizado sempre que um novo espaço de tabela é aberto. Apenas espaços de tabela inativos são fechados.

  O cache de definição de tabela existe em paralelo com a partição de cache de definição de tabela do cache de objetos do dicionário. Ambos os caches armazenam definições de tabela, mas servem partes diferentes do servidor MySQL. Os objetos de um cache não dependem da existência de objetos no outro. Para mais informações, consulte a Seção 16.4, “Cache de Objetos do Dicionário”.

- `table_encryption_privilege_check`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>89

  Controla a verificação de privilégio `TABLE_ENCRYPTION_ADMIN` que ocorre ao criar ou alterar um esquema ou espaço de tabela geral com criptografia que difere da configuração `default_table_encryption`, ou ao criar ou alterar uma tabela com uma configuração de criptografia que difere da criptografia padrão do esquema. A verificação é desabilitada por padrão.

  Definir `table_encryption_privilege_check` em tempo de execução requer o privilégio `SUPER`.

  O `table_encryption_privilege_check` suporta a sintaxe de `SET PERSIST` e `SET PERSIST_ONLY`. Veja a Seção 7.1.9.3, “Variáveis de sistema persistentes”.

  Para obter mais informações, consulte Definindo um padrão de criptografia para esquemas e tabelas gerais.

- `table_open_cache`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>90

  O número de tabelas abertas para todos os threads. Aumentar esse valor aumenta o número de descritores de arquivo que o **mysqld** requer. O valor efetivo dessa variável é o maior entre o valor efetivo de `open_files_limit` `- 10 -` o valor efetivo de `max_connections` `/ 2`, e 400; ou seja

  ```
  MAX(
      (open_files_limit - 10 - max_connections) / 2,
      400
     )
  ```

  Você pode verificar se precisa aumentar o cache da tabela verificando a variável de status `Opened_tables`. Se o valor de `Opened_tables` for grande e você não usar `FLUSH TABLES` com frequência (o que apenas força todas as tabelas a serem fechadas e reabertas), então você deve aumentar o valor da variável `table_open_cache`. Para mais informações sobre o cache da tabela, consulte a Seção 10.4.3.1, “Como o MySQL Abre e Fecha Tabelas”.

- `table_open_cache_instances`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>91

  Número de instâncias de cache de tabelas abertas. Para melhorar a escalabilidade, reduzindo a concorrência entre as sessões, o cache de tabelas abertas pode ser dividido em várias instâncias menores de tamanho `table_open_cache` / `table_open_cache_instances`. Uma sessão precisa bloquear apenas uma instância para acessá-la para instruções DML. Isso segmenta o acesso ao cache entre as instâncias, permitindo um desempenho maior para operações que usam o cache quando há muitas sessões acessando tabelas. (As instruções DDL ainda requerem um bloqueio em todo o cache, mas essas instruções são muito menos frequentes do que as instruções DML.)

  Um valor de 8 ou 16 é recomendado em sistemas que utilizam rotineiramente 16 ou mais núcleos. No entanto, se você tiver muitos gatilhos grandes em suas tabelas que causam um alto consumo de memória, o ajuste padrão para `table_open_cache_instances` pode levar a um uso excessivo de memória. Nessa situação, pode ser útil definir `table_open_cache_instances` para 1 para restringir o uso de memória.

- `tablespace_definition_cache`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>92

  Define um limite para o número de objetos de definição de espaço de tabela, tanto usados quanto não usados, que podem ser mantidos no cache do objeto de dicionário.

  Os objetos de definição de espaço de tabela não utilizados são mantidos apenas no cache do objeto de dicionário quando o número em uso é menor que a capacidade definida por `tablespace_definition_cache`.

  Uma configuração de `0` significa que os objetos de definição de espaço de tabela são mantidos apenas no cache do objeto dicionário enquanto estiverem em uso.

  Para obter mais informações, consulte a Seção 16.4, “Cache de Objetos do Dicionário”.

- `temptable_max_mmap`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>93

  Define o valor máximo de memória (em bytes) que o mecanismo de armazenamento TempTable pode alocar a partir de arquivos temporários mapeados na memória antes de começar a armazenar dados nas tabelas temporárias internas `InnoDB` no disco. Um valor de 0 desabilita a alocação de memória a partir de arquivos temporários mapeados na memória. Para mais informações, consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

- `temptable_max_ram`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>94

  Define o valor máximo de memória que pode ser ocupado pelo motor de armazenamento `TempTable` antes que ele comece a armazenar dados no disco. O valor padrão é de 1073741824 bytes (1GiB). Para mais informações, consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

- `temptable_use_mmap`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>95

  Define se o mecanismo de armazenamento TempTable aloca espaço para tabelas temporárias internas em memória como arquivos temporários mapeados em memória quando a quantidade de memória ocupada pelo mecanismo de armazenamento TempTable excede o limite definido pela variável `temptable_max_ram`. Quando o `temptable_use_mmap` é desativado, o mecanismo de armazenamento TempTable usa as tabelas temporárias internas em disco `InnoDB` em vez disso. Para mais informações, consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

- `thread_cache_size`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>96

  Quantos fios o servidor deve armazenar para reutilização. Quando um cliente se desconecta, os fios do cliente são colocados na cache se houver menos de `thread_cache_size` fios. As solicitações de fios são atendidas reutilizando fios da cache, se possível, e apenas quando a cache estiver vazia, um novo fio é criado. Essa variável pode ser aumentada para melhorar o desempenho se você tiver muitas novas conexões. Normalmente, isso não proporciona uma melhoria notável no desempenho se você tiver uma boa implementação de fios. No entanto, se o seu servidor receber centenas de conexões por segundo, você deve definir `thread_cache_size` o suficiente alto para que a maioria das novas conexões use fios armazenados na cache. Ao examinar a diferença entre as variáveis de status `Connections` e `Threads_created`, você pode ver quão eficiente é a cache de fios. Para detalhes, consulte a Seção 7.1.10, “Variáveis de Status do Servidor”.

  O valor padrão é baseado na seguinte fórmula, limitada a um limite de 100:

  ```
  8 + (max_connections / 100)
  ```

- `thread_handling`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>97

  O modelo de manipulação de threads usado pelo servidor para threads de conexão. Os valores permitidos são `no-threads` (o servidor usa uma única thread para lidar com uma conexão), `one-thread-per-connection` (o servidor usa uma thread para lidar com cada conexão de cliente) e `loaded-dynamically` (definido pelo plugin de pool de threads ao ser inicializado). `no-threads` é útil para depuração no Linux; veja a Seção 7.9, “Depuração do MySQL”.

- `thread_pool_algorithm`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>98

  Esta variável controla qual algoritmo o plugin de pool de threads utiliza:

  - `0`: Use um algoritmo conservador de baixa concorrência.

  - `1`: Use um algoritmo agressivo de alta moeda que funciona melhor com contagem ótima de threads, mas o desempenho pode ser degradado se o número de conexões atingir valores extremamente altos.

  Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado. Consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

- `thread_pool_dedicated_listeners`

  <table summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.14</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_port</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>33062</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>65535</code>]]</td> </tr></tbody></table>99

  Dedicamos um fio de escuta em cada grupo de fios para ouvir declarações recebidas de conexões atribuídas ao grupo.

  - `OFF`: (Padrão) Desabilita as threads de ouvinte dedicadas.

  - `ON`: Dedica uma thread de escuta em cada grupo de threads para ouvir declarações recebidas de conexões atribuídas ao grupo. As threads de escuta dedicadas não executam consultas.

  Ativação de `thread_pool_dedicated_listeners` é útil apenas quando um limite de transação é definido por `thread_pool_max_transactions_limit`. Caso contrário, `thread_pool_dedicated_listeners` não deve ser ativado.

  O serviço MySQL HeatWave introduziu essa variável no MySQL 8.0.23. Está disponível com a Edição Empresarial do MySQL a partir do MySQL 8.0.31.

- `thread_pool_high_priority_connection`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>00

  Esta variável afeta a fila de espera de novas declarações antes da execução. Se o valor for 0 (falso, o padrão), a fila de espera de declarações usa as filas de baixa e alta prioridade. Se o valor for 1 (verdadeiro), as declarações em fila sempre vão para a fila de alta prioridade.

  Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado. Consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

- `thread_pool_max_active_query_threads`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>01

  O número máximo permitido de threads de consulta ativas (em execução) por grupo. Se o valor for 0, o plugin de pool de threads usa até tantos threads quanto estiverem disponíveis.

  Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado. Consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

- `thread_pool_max_transactions_limit`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>02

  O número máximo de transações permitido pelo plugin de pool de threads. Definir um limite de transação vincula um thread a uma transação até que ela seja confirmada, o que ajuda a estabilizar o desempenho durante alta concorrência.

  O valor padrão de 0 significa que não há limite de transação. A variável é dinâmica, mas não pode ser alterada de 0 para um valor maior durante a execução e vice-versa. Um valor diferente de 0 ao iniciar permite a configuração dinâmica durante a execução. O privilégio `CONNECTION_ADMIN` é necessário para configurar `thread_pool_max_transactions_limit` durante a execução.

  Ao definir um limite de transação, a ativação de `thread_pool_dedicated_listeners` cria um fio de ouvinte dedicado em cada grupo de fios. O fio de ouvinte dedicado adicional consome mais recursos e afeta o desempenho do pool de fios. Portanto, `thread_pool_dedicated_listeners` deve ser usado com cautela.

  Quando o limite definido por `thread_pool_max_transactions_limit` for atingido, novas conexões parecem ficar pendentes até que uma ou mais transações existentes sejam concluídas. O mesmo ocorre ao tentar iniciar uma nova transação em uma conexão existente. Se as conexões existentes estiverem bloqueadas ou em execução, pode ser necessário uma conexão privilegiada para acessar o servidor para aumentar o limite, remover o limite ou interromper as transações em execução. Consulte Conexões Privilegiadas.

  O serviço MySQL HeatWave introduziu essa variável no MySQL 8.0.23. Está disponível com a Edição Empresarial do MySQL a partir do MySQL 8.0.31.

- `thread_pool_max_unused_threads`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>03

  O número máximo permitido de threads não utilizadas na pilha de threads. Esta variável permite limitar a quantidade de memória usada por threads em estado de espera.

  Um valor de 0 (o padrão) significa que não há limite no número de threads em espera. Um valor de `N` onde `N` é maior que 0 significa 1 thread consumidor e \*`N`−1 threads de reserva. Nesse caso, se uma thread estiver pronta para dormir, mas o número de threads em espera já estiver no máximo, a thread sai em vez de dormir.

  Um fio de sono está dormindo como um fio de consumo ou um fio de reserva. O pool de fios permite que um fio seja o fio de consumo quando estiver dormindo. Se um fio for colocado em sono e não houver um fio de consumo existente, ele dormirá como um fio de consumo. Quando um fio precisa ser acordado, um fio de consumo é selecionado, se houver um. Um fio de reserva é selecionado apenas quando não houver um fio de consumo para ser acordado.

  Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado. Consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

- `thread_pool_prio_kickup_timer`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>04

  Essa variável afeta as instruções que estão aguardando execução na fila de baixa prioridade. O valor é o número de milissegundos antes que uma instrução em espera seja movida para a fila de alta prioridade. O valor padrão é 1000 (1 segundo).

  Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado. Consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

- `thread_pool_query_threads_per_group`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>05

  O número máximo de threads de consulta permitido em um grupo de threads. O valor máximo é 4096, mas se `thread_pool_max_transactions_limit` estiver definido, `thread_pool_query_threads_per_group` não deve exceder esse valor.

  O valor padrão de 1 significa que há um único fio de consulta ativo em cada grupo de fios, o que funciona bem para muitas cargas de trabalho. Quando você estiver usando o algoritmo de pool de fios de alta concorrência (`thread_pool_algorithm = 1`), considere aumentar o valor se você estiver experimentando tempos de resposta mais lentos devido a transações de longa duração.

  O privilégio `CONNECTION_ADMIN` é necessário para configurar `thread_pool_query_threads_per_group` em tempo de execução.

  Se você diminuir o valor de `thread_pool_query_threads_per_group` durante a execução, os threads que estão atualmente executando consultas de usuário poderão ser concluídos e, em seguida, movidos para o pool de reserva ou terminados. Se você aumentar o valor durante a execução e o grupo de threads precisar de mais threads, esses serão retirados do pool de reserva, se possível, caso contrário, eles serão criados.

  Essa variável está disponível a partir do MySQL 8.0.31 no MySQL HeatWave Service e na MySQL Enterprise Edition.

- `thread_pool_size`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>06

  O número de grupos de threads no pool de threads. Este é o parâmetro mais importante que controla o desempenho do pool de threads. Ele afeta quantos comandos podem ser executados simultaneamente. Se um valor fora do intervalo de valores permitidos for especificado, o plugin do pool de threads não é carregado e o servidor escreve uma mensagem no log de erro.

  Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado. Consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

- `thread_pool_stall_limit`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>07

  Esta variável afeta a execução de instruções. O valor é o tempo que uma instrução tem para terminar após começar a ser executada antes de ser definida como travada, momento em que o grupo de threads permite que o grupo de threads comece a executar outra instrução. O valor é medido em unidades de 10 milissegundos, então o valor padrão de 6 significa 60ms. Valores de espera curtos permitem que os threads comecem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem instruções de execução longa, para evitar iniciar muitas novas instruções enquanto as atuais estão sendo executadas.

  Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado. Consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

- `thread_pool_transaction_delay`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>08

  O período de atraso antes de executar uma nova transação, em milissegundos. O valor máximo é 300000 (5 minutos).

  O atraso de transações pode ser usado em casos em que transações paralelas afetam o desempenho de outras operações devido à disputa por recursos. Por exemplo, se transações paralelas afetarem a criação de índices ou uma operação de redimensionamento do pool de buffers online, você pode configurar um atraso de transação para reduzir a disputa por recursos enquanto essas operações estiverem em execução.

  Os threads do trabalhador dormem por um número de milissegundos especificado por `thread_pool_transaction_delay` antes de executar uma nova transação.

  A configuração `thread_pool_transaction_delay` não afeta as consultas emitidas a partir de uma conexão privilegiada (uma conexão atribuída ao grupo de threads `Admin`). Essas consultas não estão sujeitas a um atraso de transação configurado.

- `thread_stack`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>09

  O tamanho da pilha para cada thread. O padrão é suficiente para o funcionamento normal. Se o tamanho da pilha da thread for muito pequeno, isso limita a complexidade das instruções SQL que o servidor pode manipular, a profundidade de recursividade de procedimentos armazenados e outras ações que consomem memória.

- `time_zone`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>10

  O fuso horário atual. Esta variável é usada para inicializar o fuso horário para cada cliente que se conecta. Por padrão, o valor inicial desta é `'SYSTEM'` (o que significa, “use o valor de `system_time_zone`”). O valor pode ser especificado explicitamente na inicialização do servidor com a opção `--default-time-zone`. Veja a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.

  Nota

  Se configurado para `SYSTEM`, cada chamada de função MySQL que requer um cálculo de fuso horário faz uma chamada à biblioteca do sistema para determinar o fuso horário do sistema atual. Essa chamada pode ser protegida por um mutex global, resultando em concorrência.

- `timestamp`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>11

  Defina o horário para este cliente. Isso é usado para obter o timestamp original se você usar o log binário para restaurar linhas. `timestamp_value` deve ser um timestamp da época Unix (um valor como o retornado por `UNIX_TIMESTAMP()`, não um valor no formato `'YYYY-MM-DD hh:mm:ss'`).

  Definir `timestamp` para um valor constante faz com que ele retorne esse valor até que seja alterado novamente. Definir `timestamp` para `DEFAULT` faz com que seu valor seja a data e hora atuais no momento em que é acessado.

  `timestamp` é um `DOUBLE` em vez de `BIGINT` porque seu valor inclui uma parte em microsegundos. O valor máximo corresponde ao `'2038-01-19 03:14:07'` UTC, o mesmo que para o tipo de dados `TIMESTAMP`.

  `SET timestamp` afeta o valor retornado por `NOW()`, mas não por `SYSDATE()`. Isso significa que as configurações de marcação de tempo no log binário não têm efeito nas invocações de `SYSDATE()`. O servidor pode ser iniciado com a opção `--sysdate-is-now` para fazer com que `SYSDATE()` seja sinônimo de `NOW()`, caso em que `SET timestamp` afeta ambas as funções.

- `tls_ciphersuites`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>12

  Quais as suites de cifra que o servidor permite para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de nomes de suites de cifra separados por vírgula.

  As suítes de cifra que podem ser nomeadas para essa variável dependem da biblioteca SSL usada para compilar o MySQL. Se essa variável não for definida, seu valor padrão é `NULL`, o que significa que o servidor permite o conjunto padrão de suítes de cifra. Se a variável for definida como uma string vazia, nenhuma suíte de cifra será habilitada e conexões criptografadas não poderão ser estabelecidas. Para mais informações, consulte a Seção 8.3.2, “Protocolos e Suítes de Cifra de Conexão Encriptada”.

- `tls_version`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>13

  Quais protocolos o servidor permite para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula, que não são case-sensitive. Os protocolos que podem ser nomeados para esta variável dependem da biblioteca SSL usada para compilar o MySQL. Os protocolos permitidos devem ser escolhidos para não deixar "buracos" na lista. Para detalhes, consulte a Seção 8.3.2, "Protocolos e cifra TLS de Conexão Criptografada".

  A partir do MySQL 8.0.16, essa variável é dinâmica e pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões. Consulte Configuração e monitoramento em tempo de execução no lado do servidor para conexões criptografadas. Antes do MySQL 8.0.16, essa variável só pode ser definida na inicialização do servidor.

  Importante

  - O suporte aos protocolos de conexão TLSv1 e TLSv1.1 foi removido do MySQL Server a partir do MySQL 8.0.28. Os protocolos foram desatualizados a partir do MySQL 8.0.26. Consulte a remoção do suporte aos protocolos TLSv1 e TLSv1.1 para obter mais informações.

  - O suporte ao protocolo TLSv1.3 está disponível no MySQL Server a partir do MySQL 8.0.16, desde que o MySQL Server tenha sido compilado com o OpenSSL 1.1.1 ou superior. O servidor verifica a versão do OpenSSL no momento do início, e se for menor que 1.1.1, o TLSv1.3 é removido do valor padrão da variável de sistema. Nesse caso, os valores padrão são “`TLSv1,TLSv1.1,TLSv1.2`” até e incluindo o MySQL 8.0.27, e “`TLSv1.2`” a partir do MySQL 8.0.28.

  Definir essa variável para uma string vazia desativa as conexões criptografadas.

- `tmp_table_size`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>14

  Define o tamanho máximo das tabelas temporárias internas de memória criadas pelo motor de armazenamento `MEMORY` e, a partir do MySQL 8.0.28, pelo motor de armazenamento `TempTable`. Se uma tabela temporária interna de memória exceder esse tamanho, ela será automaticamente convertida em uma tabela temporária interna em disco.

  A variável `tmp_table_size` não se aplica a tabelas `MEMORY` criadas pelo usuário. As tabelas `TempTable` criadas pelo usuário não são suportadas.

  Ao usar o mecanismo de armazenamento `MEMORY` para tabelas temporárias internas em memória, o limite de tamanho real é o menor entre `tmp_table_size` e `max_heap_table_size`. A configuração `max_heap_table_size` não se aplica às tabelas `TempTable`.

  Aumente o valor de `tmp_table_size` (e `max_heap_table_size` se necessário, ao usar o mecanismo de armazenamento `MEMORY` para tabelas temporárias internas em memória) se você fizer muitas consultas avançadas de `GROUP BY` e tiver muita memória.

  Você pode comparar o número de tabelas temporárias internas criadas no disco com o número total de tabelas temporárias internas criadas comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

  Veja também a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

- `tmpdir`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>15

  O caminho do diretório a ser usado para criar arquivos temporários. Isso pode ser útil se o diretório padrão `/tmp` estiver em uma partição que é muito pequena para armazenar tabelas temporárias. Essa variável pode ser definida como uma lista de vários caminhos que são usados de forma rotativa. Os caminhos devem ser separados por colchetes (`:`) no Unix e por pontos e vírgulas (`;`) no Windows.

  `tmpdir` pode ser um local não permanente, como um diretório em um sistema de arquivos baseado em memória ou um diretório que é limpo quando o host do servidor é reiniciado. Se o servidor MySQL estiver atuando como uma replica e você estiver usando um local não permanente para `tmpdir`, considere definir um diretório temporário diferente para a replica usando a variável `replica_load_tmpdir` ou `slave_load_tmpdir`. Para uma replica, os arquivos temporários usados para replicar as instruções `LOAD DATA` são armazenados neste diretório, então, com um local permanente, eles podem sobreviver a reinicializações de máquina, embora a replicação possa continuar após um reinício se os arquivos temporários tiverem sido removidos.

  Para obter mais informações sobre o local de armazenamento de arquivos temporários, consulte a Seção B.3.3.5, “Onde o MySQL armazena arquivos temporários”.

- `transaction_alloc_block_size`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>16

  O valor em bytes pelo qual aumentar o pool de memória por transação que precisa de memória. Veja a descrição de `transaction_prealloc_size`.

- `transaction_isolation`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>17

  O nível de isolamento de transação. O padrão é `REPEATABLE-READ`.

  O nível de isolamento de transação tem três escopos: global, sessão e próxima transação. Essa implementação de três escopos leva a algumas semânticas de atribuição de nível de isolamento não padrão, conforme descrito mais adiante.

  Para definir o nível de isolamento de transações global ao iniciar, use a opção de servidor `--transaction-isolation`.

  Durante a execução, o nível de isolamento pode ser definido diretamente usando a instrução `SET` para atribuir um valor à variável de sistema `transaction_isolation`, ou indiretamente usando a instrução `SET TRANSACTION`. Se você definir `transaction_isolation` diretamente para um nome de nível de isolamento que contenha um espaço, o nome deve ser colocado entre aspas, com o espaço substituído por uma barra. Por exemplo, use esta instrução `SET` para definir o valor global:

  ```
  SET GLOBAL transaction_isolation = 'READ-COMMITTED';
  ```

  Definir o valor global `transaction_isolation` define o nível de isolamento para todas as sessões subsequentes. As sessões existentes não são afetadas.

  Para definir o valor da sessão ou do nível seguinte `transaction_isolation` use a instrução `SET`. Para a maioria das variáveis do sistema de sessão, essas instruções são formas equivalentes de definir o valor:

  ```
  SET @@SESSION.var_name = value;
  SET SESSION var_name = value;
  SET var_name = value;
  SET @@var_name = value;
  ```

  Como mencionado anteriormente, o nível de isolamento de transação tem um escopo de próxima transação, além dos escopos global e de sessão. Para habilitar o escopo de próxima transação, a sintaxe `SET` para atribuir valores de variáveis de sistema de sessão tem uma semântica não padrão para `transaction_isolation`:

  - Para definir o nível de isolamento de sessão, use qualquer uma dessas sintaxes:

    ```
    SET @@SESSION.transaction_isolation = value;
    SET SESSION transaction_isolation = value;
    SET transaction_isolation = value;
    ```

    Para cada uma dessas sintáticas, essas semânticas se aplicam:

    - Define o nível de isolamento para todas as transações subsequentes realizadas durante a sessão.

    - Permitido dentro das transações, mas não afeta a transação em andamento atual.

    - Se executado entre transações, substitui qualquer declaração anterior que defina o nível de isolamento da próxima transação.

    - Correspondente a `SET SESSION TRANSACTION ISOLATION LEVEL` (com a palavra-chave `SESSION`).

  - Para definir o nível de isolamento da próxima transação, use a seguinte sintaxe:

    ```
    SET @@transaction_isolation = value;
    ```

    Para essa sintaxe, essas semânticas se aplicam:

    - Define o nível de isolamento apenas para a próxima transação única realizada dentro da sessão.

    - As transações subsequentes retornam ao nível de isolamento de sessão.

    - Não é permitido dentro das transações.

    - Correspondente a `SET TRANSACTION ISOLATION LEVEL` (sem a palavra-chave `SESSION`).

  Para obter mais informações sobre o `SET TRANSACTION` e sua relação com a variável de sistema `transaction_isolation`, consulte a Seção 15.3.7, “Instrução SET TRANSACTION”.

- `transaction_prealloc_size`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>18

  Existe um pool de memória por transação a partir do qual várias alocações relacionadas à transação pedem memória. O tamanho inicial do pool em bytes é `transaction_prealloc_size`. Para cada alocação que não pode ser atendida a partir do pool porque não há memória disponível suficiente, o pool é aumentado em `transaction_alloc_block_size` bytes. Quando a transação termina, o pool é truncado para `transaction_prealloc_size` bytes. Ao fazer `transaction_prealloc_size` suficientemente grande para conter todas as instruções dentro de uma única transação, você pode evitar muitas chamadas de `malloc()`.

  A partir do MySQL 8.0.29, `transaction_prealloc_size` é desaconselhado; o tamanho inicial do pool de memória de transação é fixo e definir essa variável não tem mais nenhum efeito. (O funcionamento de `transaction_alloc_block_size` não é afetado por essa mudança.) Espera-se que `transaction_prealloc_size` seja removido em uma futura versão do MySQL.

- `transaction_read_only`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>19

  O modo de acesso à transação. O valor pode ser `OFF` (leitura/escrita; padrão) ou `ON` (somente leitura).

  O modo de acesso à transação tem três escopos: global, sessão e próxima transação. Essa implementação de três escopos leva a algumas semânticas de atribuição de modo de acesso não padrão, conforme descrito mais adiante.

  Para definir o modo de acesso global de transações na inicialização, use a opção de servidor `--transaction-read-only`.

  Durante a execução, o modo de acesso pode ser definido diretamente usando a instrução `SET` para atribuir um valor à variável de sistema `transaction_read_only`, ou indiretamente usando a instrução `SET TRANSACTION`. Por exemplo, use esta instrução `SET` para definir o valor global:

  ```
  SET GLOBAL transaction_read_only = ON;
  ```

  Definir o valor global `transaction_read_only` define o modo de acesso para todas as sessões subsequentes. As sessões existentes não são afetadas.

  Para definir o valor da sessão ou do nível seguinte `transaction_read_only` use a instrução `SET`. Para a maioria das variáveis do sistema de sessão, essas instruções são formas equivalentes de definir o valor:

  ```
  SET @@SESSION.var_name = value;
  SET SESSION var_name = value;
  SET var_name = value;
  SET @@var_name = value;
  ```

  Como mencionado anteriormente, o modo de acesso à transação tem um escopo de próxima transação, além dos escopos global e de sessão. Para habilitar o escopo de próxima transação, a sintaxe `SET` para atribuir valores de variáveis de sistema de sessão tem uma semântica não padrão para `transaction_read_only`,

  - Para definir o modo de acesso à sessão, use qualquer uma dessas sintaxes:

    ```
    SET @@SESSION.transaction_read_only = value;
    SET SESSION transaction_read_only = value;
    SET transaction_read_only = value;
    ```

    Para cada uma dessas sintáticas, essas semânticas se aplicam:

    - Define o modo de acesso para todas as transações subsequentes realizadas durante a sessão.

    - Permitido dentro das transações, mas não afeta a transação em andamento atual.

    - Se executado entre transações, substitui qualquer declaração anterior que defina o modo de acesso da próxima transação.

    - Correspondente a `SET SESSION TRANSACTION {READ WRITE | READ ONLY}` (com a palavra-chave `SESSION`).

  - Para definir o modo de acesso da próxima transação, use a seguinte sintaxe:

    ```
    SET @@transaction_read_only = value;
    ```

    Para essa sintaxe, essas semânticas se aplicam:

    - Define o modo de acesso apenas para a próxima transação única realizada dentro da sessão.

    - As transações subsequentes retornam ao modo de acesso à sessão.

    - Não é permitido dentro das transações.

    - Correspondente a `SET TRANSACTION {READ WRITE | READ ONLY}` (sem a palavra-chave `SESSION`).

  Para obter mais informações sobre o `SET TRANSACTION` e sua relação com a variável de sistema `transaction_read_only`, consulte a Seção 15.3.7, “Instrução SET TRANSACTION”.

- `unique_checks`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>20

  Se definido para 1 (o padrão), as verificações de unicidade para índices secundários nas tabelas `InnoDB` são realizadas. Se definido para 0, os motores de armazenamento são autorizados a assumir que chaves duplicadas não estão presentes nos dados de entrada. Se você sabe com certeza que seus dados não contêm violações de unicidade, você pode definir isso para 0 para acelerar as importações de grandes tabelas para `InnoDB`.

  Definir essa variável para 0 não **obriga** os motores de armazenamento a ignorar chaves duplicadas. Ainda assim, é permitido que o motor verifique essas chaves e emita erros de chave duplicada se as detectar.

- `updatable_views_with_limit`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>21

  Essa variável controla se as atualizações de uma visualização podem ser feitas quando a visualização não contém todas as colunas da chave primária definida na tabela subjacente, se a instrução de atualização contiver uma cláusula `LIMIT`. (Tais atualizações são frequentemente geradas por ferramentas de interface gráfica.) Uma atualização é uma instrução `UPDATE` ou `DELETE`. Chave primária aqui significa um `PRIMARY KEY` ou um índice `UNIQUE` no qual nenhuma coluna pode conter `NULL`.

  A variável pode ter dois valores:

  - `1` ou `YES`: Emitir apenas uma mensagem de alerta (não uma mensagem de erro). Este é o valor padrão.

  - `0` ou `NO`: Proibir a atualização.

- `use_secondary_engine`

  Para uso apenas com o MySQL HeatWave. Consulte Variáveis do Sistema para obter mais informações.

- `validate_password.xxx`

  O componente `validate_password` implementa um conjunto de variáveis de sistema com nomes na forma `validate_password.xxx`. Essas variáveis afetam o teste de senhas desse componente; veja a Seção 8.4.3.2, “Opções e variáveis de validação de senha”.

- `version`

  O número da versão do servidor. O valor também pode incluir um sufixo que indica informações de construção ou configuração do servidor. `-debug` indica que o servidor foi construído com o suporte de depuração habilitado.

- `version_comment`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>22

  O programa de configuração **CMake** tem uma opção `COMPILATION_COMMENT_SERVER` que permite especificar um comentário durante a construção do MySQL. Essa variável contém o valor desse comentário. (Antes do MySQL 8.0.14, `version_comment` é definido pela opção `COMPILATION_COMMENT`.) Veja a Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”.

- `version_compile_machine`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>23

  O tipo do binário do servidor.

- `version_compile_os`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>24

  O tipo de sistema operacional no qual o MySQL foi construído.

- `version_compile_zlib`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>25

  A versão da biblioteca `zlib` compilada.

- `wait_timeout`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>26

  O número de segundos que o servidor espera por atividade em uma conexão não interativa antes de fechá-la.

  Ao iniciar o thread, o valor da sessão `wait_timeout` é inicializado a partir do valor global `wait_timeout` ou a partir do valor global `interactive_timeout`, dependendo do tipo de cliente (definido pela opção de conexão `CLIENT_INTERACTIVE` para `mysql_real_connect()`). Veja também `interactive_timeout`.

- `warning_count`

  O número de erros, avisos e notas resultantes da última declaração que gerou mensagens. Esta variável é apenas de leitura. Consulte a Seção 15.7.7.42, “Declaração SHOW WARNINGS”.

- `windowing_use_high_precision`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>27

  Se calcular operações de janela sem perda de precisão. Consulte a Seção 10.2.1.21, “Otimização da Função de Janela”.

- `xa_detach_on_prepare`

  <table summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--admin-ssl-ca=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>admin_ssl_ca</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>28

  Quando configurado para `ON` (ativado), todas as transações XA são desconectadas (desconectadas) da conexão (sessão) como parte de `XA PREPARE`. Isso significa que a transação XA pode ser confirmada ou revertida por outra conexão, mesmo que a conexão original não tenha sido encerrada, e essa conexão pode iniciar novas transações.

  Tabelas temporárias não podem ser usadas dentro de transações XA desconectadas.

  Quando estiver configurado como `OFF` (desativado), uma transação XA está estritamente associada à mesma conexão até que a sessão se desconecte. Recomenda-se que você ative (o comportamento padrão) para a replicação.

  Para obter mais informações, consulte a Seção 15.3.8.2, “Estados de Transação XA”.
