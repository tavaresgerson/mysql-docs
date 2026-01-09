### 7.1.8 Variáveis do Sistema do Servidor

O servidor MySQL mantém muitas variáveis de sistema que afetam sua operação. A maioria das variáveis de sistema pode ser definida na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções. A maioria delas pode ser alterada dinamicamente durante a execução usando a instrução `SET`, o que permite modificar a operação do servidor sem precisar pará-lo e reiniciá-lo. Algumas variáveis são somente de leitura, e seus valores são determinados pelo ambiente do sistema, pela maneira como o MySQL está instalado no sistema ou possivelmente pelas opções usadas para compilar o MySQL. A maioria das variáveis de sistema tem um valor padrão, mas há exceções, incluindo variáveis somente de leitura. Você também pode usar os valores das variáveis de sistema em expressões.

Definir o valor de uma variável de sistema global durante a execução normalmente requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`). Definir o valor de uma variável de sistema de sessão durante a execução normalmente não requer privilégios especiais e pode ser feito por qualquer usuário, embora haja exceções. Para mais informações, consulte a Seção 7.1.9.1, “Privilégios das Variáveis de Sistema”

Existem várias maneiras de ver os nomes e valores das variáveis de sistema:

* Para ver os valores que um servidor usa com base em seus valores padrão compilados e em quaisquer arquivos de opções que ele lê, use este comando:

  ```
  mysqld --verbose --help
  ```

* Para ver os valores que um servidor usa com base apenas em seus valores padrão compilados, ignorando as configurações em quaisquer arquivos de opções, use este comando:

  ```
  mysqld --no-defaults --verbose --help
  ```

* Para ver os valores atuais usados por um servidor em execução, use a instrução `SHOW VARIABLES` ou as tabelas de variáveis de sistema do Schema de Desempenho. Veja a Seção 29.12.14, “Tabelas de Variáveis de Sistema do Schema de Desempenho”.

Esta seção fornece uma descrição de cada variável do sistema. Para uma tabela de resumo das variáveis do sistema, consulte a Seção 7.1.5, “Referência de Variáveis do Sistema do Servidor”. Para mais informações sobre a manipulação de variáveis do sistema, consulte a Seção 7.1.9, “Usando Variáveis do Sistema”.

Para informações adicionais sobre variáveis do sistema, consulte estas seções:

* A Seção 7.1.9, “Usando Variáveis do Sistema”, discute a sintaxe para definir e exibir os valores das variáveis do sistema.

* A Seção 7.1.9.2, “Variáveis do Sistema Dinâmicas”, lista as variáveis que podem ser definidas em tempo de execução.

* Informações sobre o ajuste de variáveis do sistema podem ser encontradas na Seção 7.1.1, “Configurando o Servidor”.

* A Seção 17.14, “Opções de Inicialização do InnoDB e Variáveis do Sistema”, lista as variáveis do sistema `InnoDB`.

* A Seção 25.4.3.9.2, “Variáveis do Sistema de NDB Cluster”, lista as variáveis do sistema que são específicas para o NDB Cluster.

* Para informações sobre variáveis do sistema do servidor específicas para replicação, consulte a Seção 19.1.6, “Opções e Variáveis de Registro Binário de Replicação”.

Observação

Algumas das descrições de variáveis a seguir referem-se a “ativar” ou “desativar” uma variável. Essas variáveis podem ser ativadas com a instrução `SET` definindo-as para `ON` ou `1`, ou desativadas definindo-as para `OFF` ou `0`. Variáveis booleanas podem ser definidas no início para os valores `ON`, `TRUE`, `OFF` e `FALSE` (não case-sensitive), bem como `1` e `0`. Consulte a Seção 6.2.2.4, “Modificadores de Opção do Programa”.

Algumas variáveis do sistema controlam o tamanho dos buffers ou caches. Para um buffer dado, o servidor pode precisar alocar estruturas de dados internas. Essas estruturas são tipicamente alocadas a partir da memória total alocada ao buffer, e a quantidade de espaço necessária pode ser dependente da plataforma. Isso significa que, quando você atribui um valor a uma variável que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor que o valor atribuído. Também é possível que o servidor ajuste um valor para cima. Por exemplo, se você atribuir um valor de 0 a uma variável para a qual o valor mínimo é 1024, o servidor define o valor para 1024.

Os valores para tamanhos de buffers, comprimentos e tamanhos de pilhas são fornecidos em bytes, a menos que especificado de outra forma.

Nota

Algumas descrições de variáveis do sistema incluem um tamanho de bloco, caso em que um valor que não é um múltiplo inteiro do tamanho de bloco declarado é arredondado para o próximo múltiplo inferior do tamanho de bloco antes de ser armazenado pelo servidor, ou seja, `FLOOR(valor)` * `tamanho_bloco`.

*Exemplo*: Suponha que o tamanho de bloco para uma variável dada seja dado como 4096, e você defina o valor da variável para 100000 (assumimos que o valor máximo da variável é maior que este número). Como 100000 / 4096 = 24.4140625, o servidor automaticamente reduz o valor para 98304 (24 * 4096) antes de armazená-lo.

Em alguns casos, o valor máximo declarado para uma variável é o máximo permitido pelo analisador MySQL, mas não é um múltiplo exato do tamanho de bloco. Nesses casos, o máximo efetivo é o próximo múltiplo inferior do tamanho de bloco.

*Exemplo*: O valor máximo de uma variável do sistema é mostrado como 4294967295 (232-1), e seu tamanho de bloco é 1024. 4294967295 / 1024 = 4194303.9990234375, então, se você definir essa variável para seu valor máximo declarado, o valor realmente armazenado é 4194303 * 1024 = 4294966272.

Um tamanho de bloco de 0 para uma variável dada indica que não há arredondamento para baixo dos valores de entrada dessa variável. Em geral, para aquelas variáveis mostradas sem tamanho de bloco, você pode assumir que é 0.

Algumas variáveis do sistema aceitam valores de nomes de arquivos. A menos que especificado de outra forma, a localização padrão do arquivo é o diretório de dados se o valor for um nome de caminho relativo. Para especificar a localização explicitamente, use um nome de caminho absoluto. Suponha que o diretório de dados seja `/var/mysql/data`. Se uma variável com valor de arquivo for dada como um nome de caminho relativo, ela está localizada em `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização é conforme o nome do caminho.

* `activate_all_roles_on_login`

  <table frame="box" rules="all" summary="Propriedades para activate_all_roles_on_login"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--activate-all-roles-on-login[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>activate_all_roles_on_login</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

Se ativar ou não a ativação automática de todos os papéis concedidos quando os usuários fazem login no servidor:

+ Se `activate_all_roles_on_login` estiver ativado, o servidor ativa todos os papéis concedidos a cada conta no momento do login. Isso tem precedência sobre os papéis padrão especificados com `SET DEFAULT ROLE`.

+ Se `activate_all_roles_on_login` estiver desativado, o servidor ativa os papéis padrão especificados com `SET DEFAULT ROLE`, se houver, no momento do login.

Os papéis concedidos incluem aqueles concedidos explicitamente ao usuário e aqueles nomeados no valor da variável de sistema `mandatory_roles`.

`activate_all_roles_on_login` aplica-se apenas no momento do login e no início da execução para programas e visualizações armazenadas que sejam executadas no contexto do definidor. Para alterar os papéis ativos dentro de uma sessão, use `SET ROLE`. Para alterar os papéis ativos para um programa armazenado, o corpo do programa deve executar `SET ROLE`.

* `admin_address`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

O endereço IP para ouvir conexões TCP/IP na interface de rede administrativa (consulte a Seção 7.1.12.1, “Interfaces de Conexão”). Não há um valor padrão para `admin_address`. Se essa variável não for especificada no início, o servidor não mantém nenhuma interface administrativa. O servidor também tem uma variável de sistema `bind_address` para configurar conexões TCP/IP de clientes regulares (não administrativas). Consulte a Seção 7.1.12.1, “Interfaces de Conexão”.

Se `admin_address` for especificado, seu valor deve satisfazer esses requisitos:

+ O valor deve ser um endereço IPv4, um endereço IPv6 ou um nome de host.

+ O valor não pode especificar um formato de endereço wildcard (`*`, `0.0.0.0` ou `::`).

+ O valor pode incluir um especificador de namespace de rede.

Um endereço IP pode ser especificado como um endereço IPv4 ou IPv6. Se o valor for um nome de host, o servidor resolve o nome para um endereço IP e se vincula a esse endereço. Se um nome de host resolver para múltiplos endereços IP, o servidor usa o primeiro endereço IPv4, se houver, ou o primeiro endereço IPv6, caso contrário.

O servidor trata diferentes tipos de endereços da seguinte forma:

+ Se o endereço for um endereço mapeado IPv4, o servidor aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o servidor estiver vinculado a `::ffff:127.0.0.1`, os clientes podem se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

+ Se o endereço for um endereço IPv4 ou IPv6 “regular” (como `127.0.0.1` ou `::1`), o servidor aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

Essas regras se aplicam à especificação de um namespace de rede para um endereço:

+ Um namespace de rede pode ser especificado para um endereço IP ou um nome de host.

+ Um namespace de rede não pode ser especificado para um endereço IP wildcard.

+ Para um endereço específico, o namespace de rede é opcional. Se fornecido, ele deve ser especificado como um sufixo `/ns` imediatamente após o endereço.

  + Um endereço sem o sufixo `/ns` usa o namespace global do sistema host. Portanto, o namespace global é o padrão.

  + Um endereço com o sufixo `/ns` usa o namespace chamado *`ns`*.

  + O sistema host deve suportar namespaces de rede e cada namespace nomeado deve ter sido configurado anteriormente. Nomear um namespace inexistente produz um erro.

Para obter informações adicionais sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a Namespace de Rede”.

Se a vinculação ao endereço falhar, o servidor produz um erro e não inicia.

A variável de sistema `admin_address` é semelhante à variável de sistema `bind_address` que vincula o servidor a um endereço para conexões de clientes comuns, mas com essas diferenças:

  + `bind_address` permite múltiplos endereços. `admin_address` permite um único endereço.

  + `bind_address` permite endereços com asterisco. `admin_address` não.
* `admin_port`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr>
</table>

  O número de porta TCP/IP a ser usado para conexões na interface de rede administrativa (ver Seção 7.1.12.1, “Interfaces de Conexão”). Definir esta variável para 0 faz com que o valor padrão seja usado.

  Definir `admin_ssl_ca` não tem efeito se `admin_address` não for especificado, pois, nesse caso, o servidor não mantém nenhuma interface de rede administrativa.

* `admin_ssl_ca`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-ca=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_ca</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de SET_VAR Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

A variável do sistema `admin_ssl_ca` é semelhante à `ssl_ca`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

* `admin_ssl_capath`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_capath">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-capath=dir_name</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_capath</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome de diretório</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

A variável do sistema `admin_ssl_capath` é semelhante à `ssl_capath`, exceto que ela se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

* `admin_ssl_cert`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cert">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-cert=file_name</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_cert</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

A variável do sistema `admin_ssl_cert` é semelhante à `ssl_cert`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Encriptadas.

* `admin_ssl_cipher`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cipher">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-cipher=nome</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_cipher</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  A variável do sistema `admin_ssl_cipher` é semelhante à `ssl_cipher`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

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

  Tentar incluir quaisquer valores na lista de cifra que não estejam mostrados aqui ao configurar esta variável gera um erro (`ER_BLOCKED_CIPHER`).

* `admin_ssl_crl`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_crl">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-crl=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_crl</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de SET_VAR Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

A variável do sistema `admin_ssl_crl` é semelhante à `ssl_crl`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

* `admin_ssl_crlpath`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_crlpath">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-crlpath=nome_pasta</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_crlpath</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome da pasta</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

A variável do sistema `admin_ssl_crlpath` é semelhante à `ssl_crlpath`, exceto que ela se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

* `admin_ssl_key`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_key">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-ssl-key=file_name</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_ssl_key</code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

A variável do sistema `admin_ssl_key` é semelhante à `ssl_key`, exceto que ela se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

* `admin_tls_ciphersuites`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

  A variável de sistema `admin_tls_ciphersuites` é semelhante à `tls_ciphersuites`, exceto que se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte de criptografia para a interface administrativa, consulte Suporte de Interface Administrativa para Conexões Criptografadas.

  O valor é uma lista de zero ou mais nomes de conjuntos de cifra separados por vírgula entre os listados aqui:

  + `TLS_AES_128_GCM_SHA256`
  + `TLS_AES_256_GCM_SHA384`
  + `TLS_CHACHA20_POLY1305_SHA256`
  + `TLS_AES_128_CCM_SHA256`

  Tentar incluir quaisquer valores na lista de cifra que não sejam mostrados aqui ao configurar esta variável gera um erro (`ER_BLOCKED_CIPHER`).

* `admin_tls_version`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

1

A variável de sistema `admin_tls_version` é semelhante à `tls_version`, exceto que ela se aplica à interface de conexão administrativa em vez da interface de conexão principal. Para obter informações sobre a configuração do suporte à criptografia para a interface administrativa, consulte Suporte à Interface Administrativa para Conexões Criptografadas.

Importante

+ O MySQL 9.5 não suporta os protocolos de conexão TLSv1 e TLSv1.1. Consulte Remoção do Suporte aos Protocolos TLSv1 e TLSv1.1 para obter mais informações.

+ O MuySQL 9.5 suporta o protocolo TLSv1.3, desde que o servidor MySQL tenha sido compilado usando OpenSSL 1.1.1 ou uma versão mais recente. O servidor verifica a versão do OpenSSL no início e, se for mais antiga que 1.1.1, o TLSv1.3 é removido do valor padrão para a variável de sistema. Nesse caso, o padrão é `TLSv1.2`.

* `authentication_openid_connect_configuration`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td>admin_address</td>
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
    <th>Hinta de <code>SET_VAR</th></a> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>
3

Especifica uma lista de emissor e suas chaves de assinatura públicas correspondentes usadas para validar a assinatura do token de identidade para a Seção 8.4.1.9, “OpenID Connect Pluggable Authentication”. Aceita uma string JSON com o prefixo `JSON://` ou um caminho completo para um arquivo JSON com o prefixo `file://`.

* `authentication_policy`

Esta variável é usada para administrar as capacidades de autenticação multifator (MFA). Para as instruções `CREATE USER` e `ALTER USER` usadas para gerenciar as definições de contas do MySQL, ela determina quais fatores de autenticação ou fatores podem ser especificados, onde “fator” corresponde a um método de autenticação ou plugin associado a uma conta. `authentication_policy` determina os seguintes aspectos da autenticação multifator:

  + O número de fatores de autenticação.
  + Os plugins (ou métodos) permitidos para cada fator.
  + O plugin de autenticação padrão para especificações de autenticação que não nomeiam explicitamente um plugin.

  Como `authentication_policy` só se aplica quando contas são criadas ou alteradas, as alterações em seu valor não têm efeito em contas de usuários existentes.

  Nota

  Embora a variável de sistema `authentication_policy` coloque certas restrições nas cláusulas relacionadas à autenticação das instruções `CREATE USER` e `ALTER USER`, um usuário que tenha o privilégio `AUTHENTICATION_POLICY_ADMIN` não está sujeito a essas restrições. (Um aviso ocorre para instruções que, de outra forma, não seriam permitidas.)

  O valor de `authentication_policy` é uma lista de 1, 2 ou 3 elementos separados por vírgula, cada um correspondendo a um fator de autenticação e sendo de uma das formas listadas aqui, com seus significados:

  + *empty*

    O fator de autenticação é opcional; qualquer plugin de autenticação pode ser usado.

  + `*`

    O fator de autenticação é obrigatório; qualquer plugin de autenticação pode ser usado.

  + `plugin_name`

    O fator de autenticação é obrigatório; este fator deve ser *`plugin_name`*.

  + `*:plugin_name`

    O fator de autenticação é obrigatório; `plugin_name` é o padrão, mas outro plugin de autenticação pode ser usado.

Em cada caso, um elemento pode ser rodeado por caracteres de espaço em branco. A lista inteira deve ser encerrada em aspas simples.

`authentication_policy` deve conter pelo menos um fator não vazio, e quaisquer fatores vazios devem estar no final da lista, após quaisquer fatores não vazios. Isso significa que `',,'` não é permitido porque isso indica que todos os fatores são opcionais. Cada conta deve ter pelo menos um fator de autenticação.

O valor padrão de `authentication_policy` é `'*,,'`. Isso significa que o fator 1 é necessário nas definições de contas e pode usar qualquer plugin de autenticação (com `caching_sha2_password` sendo o padrão), e que os fatores 2 e 3 são opcionais e cada um pode usar qualquer plugin de autenticação.

Se `authentication_policy` não especificar um plugin padrão para o primeiro fator, o plugin padrão para este fator é `caching_sha2_password`, embora outro plugin possa ser usado.

A tabela a seguir mostra alguns valores possíveis para `authentication_policy` e a política que cada um estabelece para criar ou alterar contas.

**Tabela 7.4 Valores de exemplo de authentication_policy**

<table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

* `authentication_windows_log_level`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Esta variável está disponível apenas se o plugin de autenticação Windows `authentication_windows_log_level` estiver habilitado e o código de depuração estiver habilitado. Veja a Seção 8.4.1.5, “Autenticação Plugável do Windows”.

Esta variável define o nível de registro para o plugin de autenticação Windows. A tabela a seguir mostra os valores permitidos.

<table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

* `authentication_windows_use_principal_name`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Esta variável está disponível apenas se o plugin de autenticação de Windows `authentication_windows_use_principal_name` estiver habilitado. Veja a Seção 8.4.1.5, “Autenticação Windows Pluggable”.

Um cliente que se autentica usando a função `InitSecurityContext()` deve fornecer uma string que identifique o serviço ao qual ele se conecta (*`targetName`*). O MySQL usa o nome do principal (UPN) da conta sob a qual o servidor está em execução. O UPN tem a forma `user_id@computer_name` e não precisa ser registrado em nenhum lugar para ser usado. Esse UPN é enviado pelo servidor no início do handshake de autenticação.

Esta variável controla se o servidor envia o UPN no desafio inicial. Por padrão, a variável está habilitada. Por razões de segurança, ela pode ser desabilitada para evitar enviar o nome da conta do servidor para um cliente como texto claro. Se a variável for desabilitada, o servidor sempre envia um byte `0x00` no primeiro desafio, o cliente não especifica *`targetName`*, e, como resultado, a autenticação NTLM é usada.

Se o servidor não conseguir obter seu UPN (o que acontece principalmente em ambientes que não suportam autenticação Kerberos), o UPN não é enviado pelo servidor e a autenticação NTLM é usada.

* `autocommit`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tr><th>Formato de linha de comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

O modo de autocommit. Se definido como 1, todas as alterações em uma tabela entram em vigor imediatamente. Se definido como 0, você deve usar `COMMIT` para aceitar uma transação ou `ROLLBACK` para cancelá-la. Se `autocommit` é 0 e você o altera para 1, o MySQL realiza um `COMMIT` automático de qualquer transação aberta. Outra maneira de iniciar uma transação é usar uma declaração `START TRANSACTION` ou `BEGIN`. Veja a Seção 15.3.1, “Declarações START TRANSACTION, COMMIT e ROLLBACK”.

Por padrão, as conexões do cliente começam com `autocommit` definido como 1. Para fazer com que os clientes comecem com um valor padrão de 0, defina o valor global `autocommit` iniciando o servidor com a opção `--autocommit=0`. Para definir a variável usando um arquivo de opções, inclua essas linhas:

```
  [mysqld]
  autocommit=0
  ```

* `automatic_sp_privileges`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Quando essa variável tiver o valor 1 (padrão), o servidor concederá automaticamente os privilégios `EXECUTE` e `ALTER ROUTINE` ao criador de uma rotina armazenada, caso o usuário não possa executar e alterar ou descartar a rotina. (O privilégio `ALTER ROUTINE` é necessário para descartar a rotina.) O servidor também descartará automaticamente esses privilégios do criador quando a rotina for descartada. Se `automatic_sp_privileges` for 0, o servidor não adicionará ou descartará automaticamente esses privilégios.

O criador de uma rotina é a conta usada para executar a instrução `CREATE` para ela. Isso pode não ser a mesma conta nomeada como `DEFINER` na definição da rotina.

Se você iniciar o **mysqld** com `--skip-new`, `automatic_sp_privileges` é definido como `OFF`.

Os efeitos dessa variável são os mesmos em relação às bibliotecas JavaScript, assim como em relação às rotinas armazenadas; quando `automatic_sp_privileges` for 1, os privilégios `EXECUTE` e `ALTER ROUTINE` são concedidos automaticamente ao criador de uma biblioteca se o criador não tiver esses privilégios.

Veja também a Seção 27.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.

* `auto_generate_certs`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de Sintaxe para Configuração de SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Esta variável controla se o servidor autogera arquivos de chave e certificado SSL no diretório de dados, se eles ainda não existirem.

  Na inicialização, o servidor gera automaticamente arquivos de certificado e chave SSL do lado do servidor e do lado do cliente no diretório de dados se a variável de sistema `auto_generate_certs` estiver habilitada e os arquivos SSL do lado do servidor estiverem ausentes do diretório de dados. Esses certificados são sempre gerados nestes casos, independentemente dos valores de quaisquer outras opções TLS. Os arquivos de certificado e chave permitem conexões seguras do cliente usando SSL; consulte a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Encriptadas”.

  Para mais informações sobre a autogeração de arquivos SSL, incluindo nomes e características dos arquivos, consulte a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA usando o MySQL”

As variáveis de sistema `sha256_password_auto_generate_rsa_keys` e `caching_sha2_password_auto_generate_rsa_keys` estão relacionadas, mas controlam a geração automática de arquivos de par de chaves RSA necessários para a troca segura de senhas usando RSA em conexões não criptografadas.

* `back_log`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Observação

  Se explicitamente definida como 0 (zero) ou -1, o valor de `max_connections` é usado em vez disso.

O número de solicitações de conexão pendentes que o MySQL pode ter. Isso entra em jogo quando o principal fio do MySQL recebe muitas solicitações de conexão em um curto período de tempo. Em seguida, leva algum tempo (embora muito pouco) para o fio principal verificar a conexão e iniciar um novo fio. O valor `back_log` indica quantos pedidos podem ser empilhados durante esse curto período antes de o MySQL parar momentaneamente de responder a novos pedidos. Você precisa aumentar esse valor apenas se você esperar um grande número de conexões em um curto período de tempo.

Em outras palavras, esse valor é o tamanho da fila de espera para conexões TCP/IP entrantes. Seu sistema operacional tem seu próprio limite de tamanho para essa fila. A página manual da chamada de sistema `listen()` do Unix deve ter mais detalhes. Verifique a documentação do seu SO para o valor máximo para essa variável. `back_log` não pode ser definido como maior que o limite do seu sistema operacional.

Em plataformas Linux, recomenda-se definir os seguintes parâmetros de configuração do sistema operacional para o mesmo valor que o seu valor `max_connections`:

+ `sysctl -w net.core.netdev_max_backlog=10000`

    `sysctl -w net.ipv4.tcp_max_syn_backlog=10000`

    `sysctl -w net.core.somaxconn=10000`

Nota

Se você definir `max_connections` para um valor maior que 10000, recomenda-se definir esses parâmetros de configuração e `back_log` para esse valor também.

* `basedir`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr>
</table>

* `big_tables`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-port=port_num</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_port</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>33062</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>65535</code></td>
  </tr>
</table>
3

  Se habilitado, o servidor armazena todas as tabelas temporárias no disco em vez de na memória. Isso previne a maioria dos erros de `A tabela tbl_name está cheia` para operações `SELECT` que requerem uma grande tabela temporária, mas também desacelera consultas para as quais tabelas na memória seriam suficientes.

O valor padrão para novas conexões é `OFF` (usar tabelas temporárias em memória). Normalmente, nunca é necessário habilitar essa variável. Quando as tabelas temporárias *internas* em memória são gerenciadas pelo mecanismo de armazenamento `TempTable` (o padrão), e a quantidade máxima de memória que pode ser ocupada pelo mecanismo de armazenamento `TempTable` é excedida, o mecanismo de armazenamento `TempTable` começa a armazenar dados em arquivos temporários no disco. Quando as tabelas temporárias em memória são gerenciadas pelo mecanismo de armazenamento `MEMORY`, as tabelas em memória são automaticamente convertidas em tabelas baseadas em disco conforme necessário. Para mais informações, consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

* `bind_address`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

O servidor MySQL escuta em um ou mais sockets de rede para conexões TCP/IP. Cada soquete está vinculado a um endereço, mas é possível que um endereço seja mapeado para múltiplas interfaces de rede. Para especificar como o servidor deve ouvir conexões TCP/IP, defina a variável de sistema `bind_address` no início do servidor. O servidor também possui uma variável de sistema `admin_address` que permite conexões administrativas em uma interface dedicada. Veja a Seção 7.1.12.1, “Interfaces de Conexão”.

Se `bind_address` for especificado, ele aceita uma lista de um ou mais valores de endereço, cada um dos quais pode especificar um único endereço IP não wildcard ou nome de host. Cada endereço pode incluir um especificador de namespace de rede. Se apenas um endereço for especificado, ele pode usar um dos formatos de endereço wildcard que permitem ouvir em múltiplas interfaces de rede (`*`, `0.0.0.0` ou `::`). Múltiplos endereços são separados por vírgulas. Quando múltiplos valores são listados, cada valor deve especificar um único endereço IP não wildcard (seja IPv4 ou IPv6) ou um nome de host, e os formatos de endereço wildcard (`*`, `0.0.0.0` ou `::`) não são permitidos.

Os endereços IP podem ser especificados como endereços IPv4 ou IPv6. Para qualquer valor que seja um nome de host, o servidor resolve o nome para um endereço IP e se vincula a esse endereço. Se um nome de host resolver para múltiplos endereços IP, o servidor usa o primeiro endereço IPv4, se houver algum, ou o primeiro endereço IPv6, caso contrário.

O servidor trata diferentes tipos de endereços da seguinte forma:

+ Se o endereço for `*`, o servidor aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor e, se o host do servidor suportar IPv6, em todas as interfaces IPv6. Use este endereço para permitir conexões tanto IPv4 quanto IPv6 em todas as interfaces do servidor. Este valor é o padrão. Se a variável especificar uma lista de múltiplos valores, este valor não é permitido.

+ Se o endereço for `0.0.0.0`, o servidor aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor. Se a variável especificar uma lista de múltiplos valores, este valor não é permitido.

+ Se o endereço for `::`, o servidor aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o servidor estiver vinculado a `::ffff:127.0.0.1`, os clientes podem se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

+ Se o endereço for um endereço mapeado para IPv4, o servidor aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o servidor estiver vinculado a `::ffff:127.0.0.1`, os clientes podem se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

+ Se o endereço for um endereço IPv4 ou IPv6 "regular" (como `127.0.0.1` ou `::1`), o servidor aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

Essas regras se aplicam à especificação de um namespace de rede para um endereço:

+ Um namespace de rede pode ser especificado para um endereço IP ou um nome de host.

+ Um namespace de rede não pode ser especificado para um endereço IP wildcard.

+ Para um endereço dado, o namespace de rede é opcional. Se fornecido, ele deve ser especificado como um sufixo `/ns` imediatamente após o endereço.

+ Um endereço sem o sufixo `/ns` usa o namespace global do sistema do host. Portanto, o namespace global é o padrão.

+ Um endereço com o sufixo `/ns` usa o namespace chamado *`ns`*.

+ O sistema de hospedagem deve suportar namespaces de rede e cada namespace nomeado deve ter sido configurado previamente. Nomear um namespace inexistente produz um erro.

+ Se o valor da variável especificar múltiplos endereços, pode incluir endereços no namespace global, em namespaces nomeados ou uma mistura.

Para obter informações adicionais sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a Namespace de Rede”.

Se a vinculação a qualquer endereço falhar, o servidor produz um erro e não inicia.

Exemplos:

+ `bind_address=*`

O servidor escuta em todos os endereços IPv4 ou IPv6, conforme especificado pelo caractere `*` wildcard.

+ `bind_address=198.51.100.20`

O servidor escuta apenas no endereço IPv4 `198.51.100.20`.

+ `bind_address=198.51.100.20,2001:db8:0:f101::1`

O servidor escuta no endereço IPv4 `198.51.100.20` e no endereço IPv6 `2001:db8:0:f101::1`.

+ `bind_address=198.51.100.20,*`

Isso produz um erro porque endereços wildcard não são permitidos quando `bind_address` nomeia uma lista de múltiplos valores.

+ `bind_address=198.51.100.20/red,2001:db8:0:f101::1/blue,192.0.2.50`

O servidor escuta no endereço IPv4 `198.51.100.20` no namespace `red`, no endereço IPv6 `2001:db8:0:f101::1` no namespace `blue` e no endereço IPv4 `192.0.2.50` no namespace global.

Quando `bind_address` nomeia um único valor (wildcard ou não wildcard), o servidor escuta em um único soquete, que, para um endereço wildcard, pode estar vinculado a múltiplas interfaces de rede. Quando `bind_address` nomeia uma lista de múltiplos valores, o servidor escuta em um soquete por valor, com cada soquete vinculado a uma única interface de rede. O número de soquetes é linear com o número de valores especificados. Dependendo da eficiência de aceitação de conexões do sistema operacional, listas de valores longas podem gerar uma penalidade de desempenho para a aceitação de conexões TCP/IP.

Como descritores de arquivo são alocados para soquetes de escuta e arquivos de namespace de rede, pode ser necessário aumentar a variável de sistema `open_files_limit`.

Se você pretende vincular o servidor a um endereço específico, certifique-se de que a tabela de sistema `mysql.user` contenha uma conta com privilégios administrativos que você possa usar para se conectar a esse endereço. Caso contrário, você não poderá desligar o servidor. Por exemplo, se você vincular o servidor a `*`, você pode conectá-lo usando todas as contas existentes. Mas se você vincular o servidor a `::1`, ele aceita conexões apenas nesse endereço. Nesse caso, primeiro certifique-se de que a conta `'root'@'::1'` está presente na tabela `mysql.user` para que você ainda possa se conectar ao servidor para desligá-lo.

* `block_encryption_mode`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-port=port_num</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_port</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>33062</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>65535</code></td>
  </tr>
</table>

  Esta variável controla o modo de criptografia de bloco para algoritmos baseados em bloco, como AES. Ela afeta a criptografia para `AES_ENCRYPT()` e `AES_DECRYPT()`.

  `block_encryption_mode` aceita um valor no formato `aes-keylen-mode`, onde *`keylen`* é o comprimento da chave em bits e *`mode`* é o modo de criptografia. O valor não é case-sensitive. Os valores de *`keylen`* permitidos são 128, 192 e 256. Os valores de *`mode`* permitidos são `ECB`, `CBC`, `CFB1`, `CFB8`, `CFB128` e `OFB`.

  Por exemplo, esta declaração faz com que as funções de criptografia AES usem um comprimento de chave de 256 bits e o modo CBC:

  ```
  SET block_encryption_mode = 'aes-256-cbc';
  ```

  Um erro ocorre para tentativas de definir `block_encryption_mode` para um valor que contenha um comprimento de chave não suportado ou um modo que a biblioteca SSL não suporte.

* `build_id`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de Sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

Este é um ID de compilação de 160 bits `SHA1` que é gerado pelo encadeador ao compilar o servidor em sistemas Linux com `-DWITH_BUILD_ID=ON` (ativado por padrão), e convertido em uma string hexadecimal. Este valor de leitura somente serve como um ID de compilação único e é escrito no log do servidor ao iniciar.

`build_id` não é suportado em plataformas que não sejam Linux.

* `bulk_insert_buffer_size`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de Sintaxe de Definição de Variável <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O `MyISAM` usa uma cache especial semelhante a uma árvore para tornar as inserções em massa mais rápidas para `INSERT ... SELECT`, `INSERT ... VALUES (...), (...), ...` e `LOAD DATA` ao adicionar dados a tabelas não vazias. Esta variável limita o tamanho da árvore de cache em bytes por thread. Definir o valor para 0 desativa esta otimização. O valor padrão é 8MB.

  Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sessão”.

* `caching_sha2_password_digest_rounds`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

O número de rodadas de hashing usadas pelo plugin de autenticação `caching_sha2_password` para armazenamento de senhas.

O aumento do número de rodadas de hashing acima do valor padrão causa uma penalidade de desempenho que está relacionada à quantidade de aumento:

+ A criação de uma conta que usa o plugin `caching_sha2_password` não tem impacto na sessão do cliente dentro da qual a conta é criada, mas o servidor deve realizar as rodadas de hashing para completar a operação.

+ Para conexões de cliente que usam a conta, o servidor deve realizar as rodadas de hashing e salvar o resultado no cache. O resultado é um tempo de login mais longo para a primeira conexão do cliente, mas não para conexões subsequentes. Esse comportamento ocorre após cada reinício do servidor.

* `caching_sha2_password_auto_generate_rsa_keys`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-port=port_num</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_port</code></td>
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
    <th>Hinta de SET_VAR Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>33062</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>65535</code></td>
  </tr>
</table>

  O servidor usa essa variável para determinar se deve gerar automaticamente arquivos de par de chaves privadas/públicas RSA no diretório de dados se eles ainda não existirem.

  Na inicialização, o servidor gera automaticamente arquivos de par de chaves privadas/públicas RSA no diretório de dados se todas essas condições forem verdadeiras: A variável de sistema `sha256_password_auto_generate_rsa_keys` ou `caching_sha2_password_auto_generate_rsa_keys` estiver habilitada; nenhuma opção RSA for especificada; os arquivos RSA estiverem ausentes do diretório de dados. Esses arquivos de par de chaves permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password` (desatualizado) ou `caching_sha2_password`; consulte a Seção 8.4.1.2, “Autenticação Conectada SHA-256”, e a Seção 8.4.1.1, “Cache de Autenticação SHA-2 Conectada”.

Para obter mais informações sobre a autogeração de certificados RSA, incluindo nomes e características dos arquivos, consulte a Seção 8.3.3.1, “Criando certificados e chaves SSL e RSA usando MySQL”.

A variável de sistema `auto_generate_certs` está relacionada, mas controla a autogeração de arquivos de certificado e chave SSL necessários para conexões seguras usando SSL.

* `caching_sha2_password_private_key_path`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-ca=nome_do_arquivo</code></td> </tr><tr><th>Variável de sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code></code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Esta variável especifica o nome do caminho do arquivo de chave privada RSA para o plugin de autenticação `caching_sha2_password`. Se o arquivo estiver nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM.

  Importante

  Como este arquivo armazena uma chave privada, seu modo de acesso deve ser restrito para que apenas o servidor MySQL possa lê-lo.

  Para obter informações sobre `caching_sha2_password`, consulte a Seção 8.4.1.1, “Cacheamento de autenticação compatível com SHA-2”.

* `caching_sha2_password_public_key_path`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-ca=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_ca</code></td>
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
    <th>Habilidade de Aplicação da Sugestão de Sintaxe <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Esta variável especifica o nome do arquivo da chave pública RSA para o plugin de autenticação `caching_sha2_password`. Se o arquivo estiver nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O arquivo deve estar no formato PEM.

  Para obter informações sobre `caching_sha2_password`, incluindo informações sobre como os clientes solicitam a chave pública RSA, consulte a Seção 8.4.1.1, “Cache SHA-2 Pluggable Authentication”.

* `character_set_client`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-ca=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_ca</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  O conjunto de caracteres para as declarações que chegam do cliente. O valor da sessão desta variável é definido usando o conjunto de caracteres solicitado pelo cliente quando o cliente se conecta ao servidor. (Muitos clientes suportam uma opção `--default-character-set` para permitir que este conjunto de caracteres seja especificado explicitamente. Veja também a Seção 12.4, “Conjunto de Caracteres de Conexão e Colagens”.) O valor global da variável é usado para definir o valor da sessão em casos em que o valor solicitado pelo cliente é desconhecido ou não está disponível, ou o servidor está configurado para ignorar solicitações do cliente. Isso pode acontecer quando o cliente solicita um conjunto de caracteres desconhecido pelo servidor, como quando um cliente habilitado para japonês solicita `sjis` ao se conectar a um servidor não configurado com suporte para `sjis`.

  Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente. Tentar usá-los como o valor `character_set_client` produz um erro. Veja Conjuntos de Caracteres do Cliente Impermeáveis.

* `character_set_connection`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=nome_do_arquivo</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmica</th> <td>Sim</td> </tr>
  <tr><th>Hinta de SET_VAR Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
</table>

* `character_set_database`
O conjunto de caracteres usado para literais especificados sem um introduzir de conjunto de caracteres e para conversão de número para string. Para informações sobre introdutores, consulte a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-ca=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_ca</code></td>
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
    <th>Hinta de SET_VAR Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>
4

  O conjunto de caracteres usado pelo banco de dados padrão. O servidor define essa variável sempre que o banco de dados padrão muda. Se não houver banco de dados padrão, a variável terá o mesmo valor que `character_set_server`.

  Definir o valor da variável do sistema de sessão é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sessão”.

  As variáveis de sistema globais `character_set_database` e `collation_database` são desatualizadas; espera-se que sejam removidas em uma versão futura do MySQL.

  Atribuir um valor às variáveis de sessão `character_set_database` e `collation_database` é desatualizado e as atribuições produzem uma mensagem de aviso. Espera-se que as variáveis de sessão se tornem de leitura apenas (e as atribuições a elas produzam um erro) em uma versão futura do MySQL na qual ainda seja possível acessar as variáveis de sessão para determinar o conjunto de caracteres do banco de dados e a collation para o banco de dados padrão.

* `character_set_filesystem`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-ca=nome_do_arquivo</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de sintaxe para definição de variável <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Conjunto de caracteres do sistema de arquivos. Esta variável é usada para interpretar literais de string que se referem a nomes de arquivos, como nas instruções `LOAD DATA` e `SELECT ... INTO OUTFILE` e na função `LOAD_FILE()`. Esses nomes de arquivos são convertidos de `character_set_client` para `character_set_filesystem` antes que a tentativa de abertura do arquivo ocorra. O valor padrão é `binary`, o que significa que nenhuma conversão ocorre. Para sistemas em que nomes de arquivos multibyte são permitidos, um valor diferente pode ser mais apropriado. Por exemplo, se o sistema representar nomes de arquivos usando UTF-8, defina `character_set_filesystem` para `'utf8mb4'`.

  Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de variáveis de sessão”.

* `character_set_results`

O conjunto de caracteres usado para retornar os resultados da consulta ao cliente. Isso inclui dados de resultado, como valores de colunas, metadados de resultado, como nomes de colunas, e mensagens de erro.

* `character_set_server`

Conjunto de caracteres padrão dos servidores. Consulte a Seção 12.15, “Configuração do Conjunto de Caracteres”. Se você definir essa variável, também deve definir `collation_server` para especificar a collation do conjunto de caracteres.

* `character_set_system`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></table>

  O conjunto de caracteres usado pelo servidor para armazenar identificadores. O valor é sempre `utf8mb3`.

* `character_sets_dir`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=nome_arquivo</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmica</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
</table>
9

  O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `check_proxy_users`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_capath">
    <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-capath=nome_diretorio</code></td> </tr>
    <tr><th>Variável do Sistema</th> <td><code>admin_ssl_capath</code></td> </tr>
    <tr><th>Alcance</th> <td>Global</td> </tr>
    <tr><th>Dinâmica</th> <td>Sim</td> </tr>
    <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
    <tr><th>Tipo</th> <td>Nome do diretório</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
  </table>

Alguns plugins de autenticação implementam mapeamento de usuários proxy para si mesmos (por exemplo, os plugins de autenticação PAM e Windows). Outros plugins de autenticação não suportam usuários proxy por padrão. Destes, alguns podem solicitar que o próprio servidor MySQL mapeie usuários proxy de acordo com os privilégios de proxy concedidos: `mysql_native_password` (desatualizado), `sha256_password` (desatualizado).

Se a variável de sistema `check_proxy_users` estiver habilitada, o servidor realiza o mapeamento de usuários proxy para quaisquer plugins de autenticação que façam tal solicitação. Para aproveitar o suporte do servidor ao mapeamento de usuários proxy para o plugin `sha256_password`, você deve habilitar `sha256_password_proxy_users`.

Para obter informações sobre o mapeamento de usuários, consulte a Seção 8.2.19, “Usuários Proxy”.

* `collation_connection`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_capath"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-capath=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>admin_ssl_capath</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

A combinação do conjunto de caracteres de conexão. `collation_connection` é importante para comparações de strings literais. Para comparações de strings com valores de colunas, `collation_connection` não importa porque as colunas têm sua própria collation, que tem precedência de collation mais alta (veja a Seção 12.8.4, “Collation Coercibility in Expressions”).

Usar o nome de uma collation definida pelo usuário para essa variável gera uma mensagem de aviso.

* `collation_database`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_capath"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-capath=dir_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_capath</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  A collation usada pelo banco de dados padrão. O servidor define essa variável sempre que o banco de dados padrão muda. Se não houver banco de dados padrão, a variável terá o mesmo valor que `collation_server`.

  As variáveis globais `character_set_database` e `collation_database` são desaconselhadas; espere-se que sejam removidas em uma versão futura do MySQL.

Atribuir um valor às variáveis de sistema `character_set_database` e `collation_database` é desaconselhável e as atribuições geram uma mensagem de aviso. Espere que as variáveis de sessão se tornem somente leitura (e as atribuições gerem um erro) em uma versão futura do MySQL, na qual ainda seja possível acessar as variáveis de sessão para determinar o conjunto de caracteres e a collation do banco de dados padrão.

Usar o nome de uma collation definida pelo usuário para `collation_database` gera um aviso.

* `collation_server`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_capath"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-capath=dir_name</code></td> </tr><tr><th>Variável de sistema</th> <td><code>admin_ssl_capath</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  A collation padrão do servidor. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

  Definir isso para o nome de uma collation definida pelo usuário gera um aviso.

* `completion_type`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_capath">
  <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-capath=nome_pasta</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>admin_ssl_capath</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmica</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome da pasta</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
</table>

  O tipo de conclusão da transação. Esta variável pode assumir os valores mostrados na tabela a seguir. A variável pode ser atribuída usando os valores de nome ou os valores inteiros correspondentes.

<table frame="box" rules="all" summary="Propriedades para admin_ssl_capath">
  <tr>
    <th>Formato de Linha de Comando</th> <td><code>--admin-ssl-capath=nome_pasta</code></td> </tr>
    <tr>
      <th>Variável do Sistema</th> <td><code>admin_ssl_capath</code></td> </tr>
    </tr>
    <tr>
      <th>Alcance</th> <td>Global</td> </tr>
    </tr>
    <tr>
      <th>Dinâmico</th> <td>Sim</td> </tr>
    </tr>
    <tr>
      <th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
    </tr>
    <tr>
      <th>Tipo</th> <td>Nome da pasta</td> </tr>
    </tr>
    <tr>
      <th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
  </table>
5

`completion_type` afeta transações que começam com `START TRANSACTION` ou `BEGIN` e terminam com `COMMIT` ou `ROLLBACK`. Não se aplica a compromissos implícitos resultantes da execução das instruções listadas na Seção 15.3.3, “Instruções que Causam um Compromisso Implícito”. Também não se aplica para `XA COMMIT`, `XA ROLLBACK` ou quando `autocommit=1`.

* `component_connection_control.failed_connections_threshold`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_capath">
  <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-capath=nome_pasta</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>admin_ssl_capath</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de SET_VAR Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome da pasta</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
</table>

O número de tentativas de conexão falhas por um usuário específico antes que o componente de Controle de Conexão instale um atraso de conexão para esse usuário.

Veja a Seção 8.4.2, “O Componente de Controle de Conexão”.

* `component_connection_control.exempt_unknown_users`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_capath">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-capath=dir_name</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_capath</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome de diretório</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>
7

  Configure se as tentativas de conexão falhadas sem credenciais do usuário devem ser penalizadas. Isso melhora a capacidade do componente de Controle de Conexão de lidar com tentativas legítimas de conexão de balanceadores de carga, garantindo melhor disponibilidade do servidor enquanto mantém a eficácia no combate a ataques de força bruta. Uma nova variável de status `Component_connection_control_exempted_unknown_users` fornece informações sobre o número de conexões isentas.

  Veja a Seção 8.4.2, “O Componente de Controle de Conexão”.

* `component_connection_control.max_connection_delay`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_capath">
  <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-capath=nome_pasta</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>admin_ssl_capath</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome da pasta</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
</table>

O tempo máximo (em milissegundos) para o componente de Controle de Conexão atrasar as conexões. Isso deve ser maior ou igual a `component_connection_control.min_connection_delay`.

Consulte a Seção 8.4.2, “O Componente de Controle de Conexão”, para obter mais informações.

* `component_connection_control.min_connection_delay`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_capath">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-ssl-capath=nome_pasta</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_ssl_capath</code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome da pasta</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

9. O tempo mínimo (em milissegundos) para o componente de Controle de Conexão atrasar as conexões. Isso deve ser menor ou igual a `component_connection_control.min_connection_delay`.

Veja a Seção 8.4.2, “O Componente de Controle de Conexão”.

* `component_scheduler.enabled`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cert">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-cert=file_name</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_cert</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Quando definido como `OFF` no início, o thread de fundo não é iniciado. As tarefas ainda podem ser agendadas, mas não são executadas até que o `component_scheduler` seja habilitado. Quando definido como `ON` no início, o componente está totalmente operacional.

  Também é possível definir o valor dinamicamente para obter os seguintes efeitos:

  + `ON` inicia o thread de fundo que começa a atender à fila imediatamente.

  + `OFF` sinaliza a terminação do thread de fundo, que aguarda por ele terminar. O thread de fundo verifica o sinalizador de término antes de acessar a fila para verificar tarefas a serem executadas.

* `concurrent_insert`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cert">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-cert=nome_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_cert</code></td>
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
    <th>Hinta de SET_VAR Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Se `AUTO` (o padrão), o MySQL permite que as instruções `INSERT` e `SELECT` sejam executadas simultaneamente para tabelas `MyISAM` que não têm blocos livres no meio do arquivo de dados.

  Esta variável pode assumir os valores mostrados na tabela a seguir. A variável pode ser atribuída usando os valores de nome ou os valores inteiros correspondentes.

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cert">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-cert=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_cert</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
  </tbody>
</table>
2

Se você iniciar o **mysqld** com `--skip-new`, `concurrent_insert` é definido como `NEVER`.

Veja também a Seção 10.11.3, “Inserções Concorrentes”.

* `connect_timeout`

O número de segundos que o servidor **mysqld** espera por um pacote de conexão antes de responder com `Manchete ruim`. O valor padrão é de 10 segundos.

Aumentar o valor de `connect_timeout` pode ajudar se os clientes frequentemente encontrarem erros da forma `Conexão perdida com o servidor MySQL em 'XXX', erro do sistema: errno`.

* `connection_memory_chunk_size`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_cert"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-cert=file_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_cert</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Defina o tamanho de agrupamento para atualizações no contador de uso de memória global `Global_connection_memory`. A variável de status é atualizada apenas quando o consumo total de memória por todas as conexões do usuário muda em mais que essa quantidade. Desative as atualizações definindo `connection_memory_chunk_size = 0`.

O cálculo da memória é exclusivo de qualquer memória usada por usuários do sistema, como o usuário root do MySQL. A memória usada pelo pool de buffers do `InnoDB` também não está incluída.

Você deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir essa variável.

* `connection_memory_limit`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cert">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-cert=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_cert</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Defina a quantidade máxima de memória que pode ser usada por uma conexão de usuário único. Se qualquer conexão de usuário usar mais dessa quantidade, todas as consultas dessa conexão são rejeitadas com `ER_CONN_LIMIT`, incluindo quaisquer consultas atualmente em execução.

  O limite definido por essa variável não se aplica a usuários do sistema ou à conta raiz do MySQL. A memória usada pelo pool de tampão `InnoDB` também não é incluída.

  Você deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir essa variável.

* `connection_memory_status_limit`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cert"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-cert=nome_do_arquivo</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_cert</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></table>

Este é o valor máximo de memória que pode ser consumido por qualquer conexão de usuário antes que o `Count_hit_query_past_connection_memory_status_limit` seja incrementado.

* `core_file`

Se deve escrever um arquivo de núcleo caso o servidor saia inesperadamente. Essa variável é definida pela opção `--core-file`.

* `create_admin_listener_thread`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_cert"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-cert=file_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_cert</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Se deve usar um thread de escuta dedicado para conexões de clientes na interface de rede administrativa (consulte a Seção 7.1.12.1, “Interfaces de Conexão”). O padrão é `OFF`; ou seja, o thread do gerente para conexões comuns na interface principal também lida com conexões para a interface administrativa.

  Dependendo de fatores como o tipo da plataforma e a carga de trabalho, você pode descobrir que uma configuração para essa variável resulta em melhor desempenho do que a outra configuração.

  Configurar `create_admin_listener_thread` não tem efeito se `admin_address` não for especificado, pois, nesse caso, o servidor não mantém nenhuma interface de rede administrativa.

* `cte_max_recursion_depth`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cert">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-ssl-cert=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_ssl_cert</code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

A profundidade máxima de recursão da expressão de tabela comum (CTE). O servidor termina a execução de qualquer CTE que realize mais níveis do que o valor desta variável. Para obter mais informações, consulte Limitar a recursão de expressões de tabela comuns.

* `datadir`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cipher">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-ssl-cipher=nome</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_ssl_cipher</code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  O caminho para o diretório de dados do servidor MySQL. Caminhos relativos são resolvidos em relação ao diretório atual. Se você espera que o servidor seja iniciado automaticamente (ou seja, em contextos para os quais você não pode saber o diretório atual antecipadamente), é melhor especificar o valor `datadir` como um caminho absoluto.

* `debug`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cipher">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-cipher=nome</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_cipher</code></td>
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
    <th>Dica de Sintaxe para SET_VAR Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

Esta variável indica as configurações atuais de depuração. Está disponível apenas para servidores construídos com suporte de depuração. O valor inicial vem do valor das instâncias da opção `--debug` fornecida na inicialização do servidor. Os valores globais e de sessão podem ser definidos em tempo de execução.

Definir o valor de sessão desta variável de sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sessão”.

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

* `debug_sync`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cipher">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-cipher=nome</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_cipher</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Esta variável é a interface de usuário para a facilidade de Sincronização de Depuração. O uso da Sincronização de Depuração requer que o MySQL seja configurado com a opção `-DWITH_DEBUG=ON` do **CMake** (veja a Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL"); caso contrário, esta variável do sistema não está disponível.

  O valor da variável global é de leitura somente e indica se a facilidade está habilitada. Por padrão, a Sincronização de Depuração está desabilitada e o valor de `debug_sync` é `OFF`. Se o servidor for iniciado com `--debug-sync-timeout=N`, onde *`N`* é um valor de timeout maior que 0, a Sincronização de Depuração é habilitada e o valor de `debug_sync` é `ON - sinal atual`, seguido pelo nome do sinal. Além disso, *`N`* se torna o timeout padrão para pontos de sincronização individuais.

  O valor da sessão pode ser lido por qualquer usuário e tem o mesmo valor que a variável global. O valor da sessão pode ser definido para controlar os pontos de sincronização.

Definir o valor da variável de sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

Para uma descrição da facilidade de sincronização de depuração e de como usar pontos de sincronização, consulte a documentação do MySQL Server Doxygen.

* `default_collation_for_utf8mb4`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_cipher"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-cipher=nome</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>admin_ssl_cipher</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Importante

  A variável de sistema `default_collation_for_utf8mb4` é para uso interno apenas pela Replicação do MySQL.

Essa variável é definida pelo servidor como a collation padrão para o conjunto de caracteres `utf8mb4`. O valor da variável é replicado de uma fonte para uma replica para que a replica possa processar corretamente os dados originados de uma fonte com uma collation padrão diferente para `utf8mb4`. Essa variável é destinada principalmente a suportar a replicação de um servidor de origem de replicação MySQL 5.7 ou anterior para um servidor de replica MySQL posterior, ou a replicação em grupo com um nó primário MySQL 5.7 e um ou mais segundosários MySQL 8.0 ou posteriores. A collation padrão para `utf8mb4` no MySQL 5.7 é `utf8mb4_general_ci`, mas `utf8mb4_0900_ai_ci` nas séries de lançamento posteriores. A variável não está presente em lançamentos anteriores ao MySQL 8.0, então, se a replica não receber um valor para a variável, ela assume que a fonte é de um lançamento anterior e define o valor para a collation padrão anterior `utf8mb4_general_ci`.

A collation padrão `utf8mb4` é usada nas seguintes declarações:

+ `SHOW COLLATION` e `SHOW CHARACTER SET`.

+ `CREATE TABLE` e `ALTER TABLE` com uma cláusula `CHARACTER SET utf8mb4` sem uma cláusula `COLLATION`, seja para o conjunto de caracteres da tabela ou para o conjunto de caracteres de uma coluna.

+ `CREATE DATABASE` e `ALTER DATABASE` com uma cláusula `CHARACTER SET utf8mb4` sem uma cláusula `COLLATION`.

+ Qualquer declaração contendo uma literal de string do tipo `_utf8mb4'texto algum'` sem uma cláusula `COLLATE`.

Veja também a Seção 12.9, “Suporte a Unicode”.

* `default_password_lifetime`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cipher">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-cipher=nome</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_cipher</code></td>
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
    <th>Hinta de Ajuda SET_VAR Aplica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>
4

Esta variável define a política global de expiração automática da senha. O valor padrão de `default_password_lifetime` é 0, o que desabilita a expiração automática da senha. Se o valor de `default_password_lifetime` for um inteiro positivo *`N`*, ele indica o tempo de vida permitido da senha; as senhas devem ser alteradas a cada *`N`* dias.

A política global de expiração da senha pode ser substituída conforme desejado para contas individuais usando a opção de expiração da senha das instruções `CREATE USER` e `ALTER USER`. Veja a Seção 8.2.15, “Gestão de Senhas”.

* `default_storage_engine`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cipher">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-cipher=nome</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_cipher</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  O motor de armazenamento padrão para tabelas. Veja o Capítulo 18, *Motores de Armazenamento Alternativos*. Esta variável define o motor de armazenamento para tabelas permanentes apenas. Para definir o motor de armazenamento para tabelas `TEMPORARY`, defina a variável de sistema `default_tmp_storage_engine`.

  Para ver quais motores de armazenamento estão disponíveis e habilitados, use a instrução `SHOW ENGINES` ou consulte a tabela `ENGINES` do `INFORMATION_SCHEMA`.

  Se você desabilitar o motor de armazenamento padrão no início do servidor, você deve definir o motor padrão tanto para tabelas permanentes quanto para tabelas `TEMPORARY` para um motor diferente, caso contrário, o servidor não será iniciado.

* `default_table_encryption`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cipher">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-cipher=nome</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_cipher</code></td>
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
    <th>Hinta de SET_VAR Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Define o ajuste padrão de criptografia aplicado a esquemas e espaços de tabelas gerais quando eles são criados sem especificar uma cláusula `ENCRYPTION`.

  A variável `default_table_encryption` é aplicável apenas a esquemas e espaços de tabelas gerais criados pelo usuário. Ela não governa a criptografia do espaço de tabela `mysql` do sistema.

  Definir o valor de tempo de execução de `default_table_encryption` requer os privilégios `SYSTEM_VARIABLES_ADMIN` e `TABLE_ENCRYPTION_ADMIN`, ou o privilégio desatualizado `SUPER`.

  O valor de `default_table_encryption` não pode ser alterado enquanto a Replicação em Grupo estiver em execução.

  `default_table_encryption` suporta a sintaxe `SET PERSIST` e `SET PERSIST_ONLY`. Veja a Seção 7.1.9.3, “Variáveis de Sistema Persistidas”.

  Para mais informações, consulte Definindo um Padrão de Criptografia para Esquemas e Espaços de Tabelas Gerais.

* `default_tmp_storage_engine`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_cipher">
  <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-cipher=nome</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>admin_ssl_cipher</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
</table>

O motor de armazenamento padrão para tabelas `TEMPORARY` (criadas com `CREATE TEMPORARY TABLE`). Para definir o motor de armazenamento para tabelas permanentes, defina a variável de sistema `default_storage_engine`. Veja também a discussão sobre essa variável em relação aos possíveis valores.

Se você desabilitar o motor de armazenamento padrão no início do servidor, você deve definir o motor padrão tanto para tabelas permanentes quanto para `TEMPORARY` para um motor diferente, caso contrário, o servidor não será iniciado.

* `default_week_format`

O valor do modo padrão a ser usado para a função `WEEK()`. Veja a Seção 14.7, “Funções de Data e Hora”.

* `delay_key_write`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_cipher"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-cipher=nome</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_cipher</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Sugestão de Sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

Esta variável especifica como usar escritas de chave atrasadas. Ela se aplica apenas a tabelas `MyISAM`. A escrita de chave atrasada faz com que os buffers de chave não sejam descarregados entre as escritas. Veja também a Seção 18.2.1, “Opções de inicialização do MyISAM”.

Esta variável pode ter um dos seguintes valores para afetar o tratamento da opção de tabela `DELAY_KEY_WRITE` que pode ser usada em instruções `CREATE TABLE`.

<table frame="box" rules="all" summary="Propriedades para admin_ssl_crl"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-crl=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_crl</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

Nota

Se você definir esta variável para `ALL`, você não deve usar tabelas `MyISAM` dentro de outro programa (como outro servidor MySQL ou **myisamchk**) quando as tabelas estiverem em uso. Fazer isso leva à corrupção do índice.

Se a opção `DELAY_KEY_WRITE` estiver habilitada para uma tabela, o buffer de chaves não é esvaziado para a tabela em todas as atualizações de índice, mas apenas quando a tabela é fechada. Isso acelera muito os escritos nas chaves, mas se você usar essa funcionalidade, deve adicionar a verificação automática de todas as tabelas `MyISAM` ao iniciar o servidor com a variável de sistema `myisam_recover_options` definida (por exemplo, `myisam_recover_options='BACKUP,FORCE'`). Veja a Seção 7.1.8, “Variáveis de Sistema do Servidor”, e a Seção 18.2.1, “Opções de Inicialização do MyISAM”.

Se você iniciar o **mysqld** com `--skip-new`, `delay_key_write` é definido como `OFF`.

Aviso

Se você habilitar o bloqueio externo com `--external-locking`, não há proteção contra corrupção de índices para tabelas que usam escritas de chaves atrasadas.

* `delayed_insert_limit`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_crl"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-crl=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>admin_ssl_crl</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

Esta variável de sistema está desatualizada (porque as inserções `DELAYED` não são suportadas) e você deve esperar que ela seja removida em uma futura versão.

* `delayed_insert_timeout`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_crl">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-crl=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_crl</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
  </tbody>
</table>
2

Esta variável do sistema está desatualizada (porque as inserções `DELAYED` não são suportadas) e você deve esperar que ela seja removida em uma futura versão.

* `delayed_queue_size`

Esta variável de sistema está desatualizada (porque as inserções `DELAYED` não são suportadas) e você deve esperar que ela seja removida em uma futura versão.

* `disabled_storage_engines`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_crl"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-crl=file_name</code></td> </tr><tr><th>Variável de sistema</th> <td><code>admin_ssl_crl</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Esta variável indica quais motores de armazenamento não podem ser usados para criar tabelas ou espaços de tabelas. Por exemplo, para impedir que novas tabelas `MyISAM` ou `FEDERATED` sejam criadas, inicie o servidor com essas linhas no arquivo de opção do servidor:

  ```
  [mysqld]
  disabled_storage_engines="MyISAM,FEDERATED"
  ```

  Por padrão, `disabled_storage_engines` está vazio (sem motores desabilitados), mas pode ser definido como uma lista de vírgulas de um ou mais motores (não case-sensitive). Qualquer motor nomeado no valor não pode ser usado para criar tabelas ou espaços de tabelas com `CREATE TABLE` ou `CREATE TABLESPACE`, e não pode ser usado com `ALTER TABLE ... ENGINE` ou `ALTER TABLESPACE ... ENGINE` para alterar o motor de armazenamento de tabelas ou espaços de tabelas existentes. Tentativas de fazer isso resultam em um erro `ER_DISABLED_STORAGE_ENGINE`.

`disabled_storage_engines` não restringe outras instruções DDL para tabelas existentes, como `CREATE INDEX`, `TRUNCATE TABLE`, `ANALYZE TABLE`, `DROP TABLE` ou `DROP TABLESPACE`. Isso permite uma transição suave para que tabelas ou espaços de tabelas existentes que usam um motor desativado possam ser migradas para um motor permitido por meio de opções como `ALTER TABLE ... ENGINE permitted_engine`.

É permitido definir a variável de sistema `default_storage_engine` ou `default_tmp_storage_engine` para um motor de armazenamento desativado. Isso pode fazer com que as aplicações se comportem de forma errática ou falhem, embora isso possa ser uma técnica útil em um ambiente de desenvolvimento para identificar aplicações que usam motores desativados, para que possam ser modificadas.

`disabled_storage_engines` está desativado e não tem efeito se o servidor for iniciado com qualquer uma dessas opções: `--initialize`, `--initialize-insecure`, `--skip-grant-tables`.

* `disconnect_on_expired_password`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_crl"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-crl=file_name</code></td> </tr><tr><th>Variável de sistema</th> <td><code>admin_ssl_crl</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

Esta variável controla como o servidor lida com clientes com senhas expiradas:

+ Se o cliente indicar que pode lidar com senhas expiradas, o valor de `disconnect_on_expired_password` é irrelevante. O servidor permite que o cliente se conecte, mas o coloca no modo sandbox.

+ Se o cliente não indicar que pode lidar com senhas expiradas, o servidor lida com o cliente de acordo com o valor de `disconnect_on_expired_password`:

    - Se `disconnect_on_expired_password`: estiver habilitado, o servidor desconecta o cliente.

    - Se `disconnect_on_expired_password`: estiver desabilitado, o servidor permite que o cliente se conecte, mas o coloca no modo sandbox.

Para obter mais informações sobre a interação entre as configurações do cliente e do servidor relacionadas ao tratamento de senhas expiradas, consulte a Seção 8.2.16, “Tratamento de Senhas Expirantes pelo Servidor”.

* `div_precision_increment`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_crl"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-crl=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_crl</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

Essa variável indica o número de dígitos com os quais a escala do resultado das operações de divisão realizadas com o operador `/` será aumentada. O valor padrão é 4. Os valores mínimo e máximo são 0 e 30, respectivamente. O exemplo a seguir ilustra o efeito de aumentar o valor padrão.

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

* `dragnet.log_error_filter_rules`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_crl"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-crl=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_crl</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  As regras de filtro que controlam o componente de filtro de log de erro `log_filter_dragnet`. Se `log_filter_dragnet` não estiver instalado, `dragnet.log_error_filter_rules` estará indisponível. Se `log_filter_dragnet` estiver instalado, mas não habilitado, as alterações em `dragnet.log_error_filter_rules` não terão efeito.

  O efeito do valor padrão é semelhante ao da filtragem realizada pelo filtro `log_sink_internal` com um ajuste de `log_error_verbosity=2`.

  A variável de status `dragnet.Status` pode ser consultada para determinar o resultado da atribuição mais recente a `dragnet.log_error_filter_rules`.

* `enable_secondary_engine_statistics`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_crl">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-ssl-crl=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_ssl_crl</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

8. Quando esta opção for definida como `TRUE`, o otimizador de consultas de hipergrafo pode obter estatísticas do motor secundário, se estiver disponível. Aplica-se apenas ao MySQL HeatWave.

* `enterprise_encryption.maximum_rsa_key_size`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_crl">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-crl=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_crl</code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Esta variável limita o tamanho máximo das chaves RSA geradas pelo MySQL Enterprise Encryption. A variável está disponível apenas se o componente `component_enterprise_encryption` de MySQL Enterprise Encryption estiver instalado.

  O ajuste mais baixo é de 2048 bits, que é o comprimento mínimo da chave RSA aceitável pela melhor prática atual. O valor padrão é de 4096 bits. O ajuste mais alto é de 16384 bits. A geração de chaves mais longas pode consumir recursos significativos do CPU, então você pode usar este ajuste para limitar as chaves a um comprimento que ofereça segurança adequada para suas necessidades, equilibrando isso com o uso de recursos. Veja a Seção 8.6.2, “Configurando o MySQL Enterprise Encryption” para mais informações.

* `enterprise_encryption.rsa_support_legacy_padding`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_crlpath">
  <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-crlpath=nome_pasta</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>admin_ssl_crlpath</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de SET_VAR Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome da pasta</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
</table>

Esta variável controla se os dados criptografados e assinaturas produzidas pelo componente MySQL Enterprise Encryption usando as funções antigas da biblioteca compartilhada `openssl_udf` podem ser descriptografados ou verificados pelo componente MySQL Enterprise Encryption (`component_enterprise_encryption`). A variável está disponível apenas se o componente MySQL Enterprise Encryption estiver instalado.

Para que as funções do componente possam suportar a descriptografia e a verificação de conteúdo produzido pelas antigas funções da biblioteca compartilhada `openssl_udf`, você deve definir a variável de sistema padding para `ON`. Quando `ON` é definido, se as funções do componente não conseguirem descriptografar ou verificar o conteúdo assumindo que ele usa o esquema RSAES-OAEP ou RSASSA-PSS (como usado pelas funções da biblioteca compartilhada `openssl_udf`), elas fazem outra tentativa assumindo que ele usa o esquema RSAES-PKCS1-v1_5 ou RSASSA-PKCS1-v1_5 (como usado pelas funções da biblioteca compartilhada `openssl_udf`). Quando `OFF` é definido, se as funções do componente não conseguirem descriptografar ou verificar o conteúdo usando seus esquemas normais, elas retornam um resultado nulo. Consulte a Seção 8.6.2, “Configurando a Criptografia da MySQL Enterprise” para obter mais informações.

* `end_markers_in_json`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_crlpath"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-crlpath=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>admin_ssl_crlpath</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Se a saída do JSON do otimizador deve adicionar marcadores de fim. Consulte a Seção 10.15.9, “A variável de sistema end_markers_in_json”.

* `eq_range_index_dive_limit`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_crlpath">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-crlpath=nome_pasta</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_crlpath</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome da pasta</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Esta variável indica o número de faixas de igualdade em uma condição de comparação de igualdade quando o otimizador deve alternar entre usar mergulhos de índice e estatísticas de índice na estimativa do número de linhas qualificadoras. Ela se aplica à avaliação de expressões que têm uma das seguintes formas equivalentes, onde o otimizador usa um índice não único para pesquisar valores de *`col_name`*:

  ```
  col_name IN(val1, ..., valN)
  col_name = val1 OR ... OR col_name = valN
  ```

  Em ambos os casos, a expressão contém *`N`* faixas de igualdade. O otimizador pode fazer estimativas de linhas usando mergulhos de índice ou estatísticas de índice. Se `eq_range_index_dive_limit` for maior que 0, o otimizador usa estatísticas de índice existentes em vez de mergulhos de índice se houver *`eq_range_index_dive_limit` ou mais faixas de igualdade. Assim, para permitir o uso de mergulhos de índice para até *`N`* faixas de igualdade, defina `eq_range_index_dive_limit` para *`N`* + 1. Para desabilitar o uso de estatísticas de índice e sempre usar mergulhos de índice independentemente de *`N`*, defina `eq_range_index_dive_limit` para 0.

Para obter mais informações, consulte a seção Otimização da faixa de igualdade de comparações de vários valores.

Para atualizar as estatísticas do índice da tabela para as melhores estimativas, use `ANALYSE TABLE`.

* `error_count`

  O número de erros que resultaram da última instrução que gerou mensagens. Essa variável é apenas de leitura. Consulte a Seção 15.7.7.19, “Instrução SHOW ERRORS”.

* `event_scheduler`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_crlpath"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-crlpath=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_crlpath</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Essa variável habilita ou desabilita, e inicia ou para, o Agendamento de Eventos. Os possíveis valores de status são `ON`, `OFF` e `DISABLED`. Desativar o Agendamento de Eventos não é o mesmo que desabilitar o Agendamento de Eventos, o que requer definir o status para `DISABLED`. Essa variável e seus efeitos na operação do Agendamento de Eventos são discutidos em maior detalhe na Seção 27.5.2, “Configuração do Agendamento de Eventos”

* `explain_format`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_crlpath">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-crlpath=nome_pasta</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_crlpath</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome da pasta</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Esta variável determina o formato de saída padrão usado pelo `EXPLAIN` na ausência de uma opção `FORMAT` ao exibir um plano de execução de consulta. Os valores possíveis e seus efeitos são listados aqui:

  + `TRADITIONAL`: Use o formato de saída baseado em tabelas tradicional do MySQL, como se a opção `FORMAT=TRADITIONAL` tivesse sido especificada como parte da declaração `EXPLAIN`. Este é o valor padrão da variável. `DEFAULT` também é suportado como sinônimo de `TRADITIONAL` e tem exatamente o mesmo efeito.

    Nota

    `DEFAULT` não pode ser usado como parte da opção `FORMAT` de uma declaração `EXPLAIN`.

  + `JSON`: Use o formato de saída baseado em JSON, como se a opção `FORMAT=JSON` tivesse sido especificada.

  + `TREE`: Use o formato de saída baseado em árvore, como se a opção `FORMAT=TREE` tivesse sido especificada.

O ambiente para essa variável também afeta `EXPLAIN ANALYZE`. Para esse propósito, `DEFAULT` e `TRADITIONAL` são interpretados como `TREE`. Se o valor de `explain_format` for `JSON` e uma instrução `EXPLAIN ANALYZE` sem a opção `FORMAT` for emitida, a instrução gera um erro (`ER_NOT_SUPPORTED_YET`).

Usar um especificador de formato com `EXPLAIN` ou `EXPLAIN ANALYZE` substitui qualquer configuração para `explain_format`.

A variável de sistema `explain_format` não tem efeito na saída de `EXPLAIN` quando essa instrução é usada para exibir informações sobre as colunas das tabelas.

Definir o valor da sessão de `explain_format` não requer privilégios especiais; definí-lo em nível global requer `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`). Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

Para mais informações e exemplos, consulte Obter Informações do Plano de Execução.

* `explain_json_format_version`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_crlpath"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-crlpath=dir_name</code></td> </tr><tr><th>Sistema de Variáveis</th> <td><code>admin_ssl_crlpath</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

Determina a versão do formato de saída JSON usado pelas instruções `EXPLAIN FORMAT=JSON`. Definir essa variável para `1` faz com que o servidor use a Versão 1, que é o formato linear usado para a saída de tais instruções em versões mais antigas do MySQL. Definir `explain_json_format_version` para `2` faz com que o formato da Versão 2 seja usado; esse formato de saída JSON é baseado em caminhos de acesso e é destinado a fornecer melhor compatibilidade com futuras versões do Otimizador do MySQL. Ele também inclui o número da versão do formato JSON em sua saída.

Para um exemplo de uso, consulte Obtenção de Informações do Plano de Execução.

* `explicit_defaults_for_timestamp`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_crlpath"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-crlpath=dir_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_crlpath</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Dicas Aplicadas</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Esta variável do sistema determina se o servidor habilita certos comportamentos não padrão para valores padrão e manipulação de valores `NULL` em colunas `TIMESTAMP`. Por padrão, `explicit_defaults_for_timestamp` está habilitado, o que desabilita os comportamentos não padrão. Desabilitar `explicit_defaults_for_timestamp` resulta em um aviso.

Se `explicit_defaults_for_timestamp` estiver desativado, o servidor habilita os comportamentos não padrão e trata as colunas `TIMESTAMP` da seguinte forma:

  + Colunas `TIMESTAMP` não declaradas explicitamente com o atributo `NULL` são automaticamente declaradas com o atributo `NOT NULL`. Atribuir um valor `NULL` a uma coluna desse tipo é permitido e define a coluna para o timestamp atual. *Exceção*: Tentativa de inserir `NULL` em uma coluna gerada declarada como `TIMESTAMP NOT NULL` é rejeitada com um erro.

  + A primeira coluna `TIMESTAMP` em uma tabela, se não declarada explicitamente com o atributo `NULL` ou um atributo `DEFAULT` ou `ON UPDATE` explícito, é automaticamente declarada com os atributos `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP`.

  + Colunas `TIMESTAMP` que seguem a primeira, se não declaradas explicitamente com o atributo `NULL` ou um atributo `DEFAULT`, são automaticamente declaradas como `DEFAULT '0000-00-00 00:00:00'` (o timestamp "zero"). Para linhas inseridas que não especificam um valor explícito para essa coluna, a coluna é atribuída `'0000-00-00 00:00:00'` e nenhum aviso ocorre.

    Dependendo se o modo SQL rigoroso ou o modo SQL `NO_ZERO_DATE` está habilitado, um valor padrão de `'0000-00-00 00:00:00'` pode ser inválido. Esteja ciente de que o modo SQL `TRADITIONAL` inclui o modo rigoroso e `NO_ZERO_DATE`. Veja a Seção 7.1.11, “Modos SQL do Servidor”.

Os comportamentos não padrão descritos acima são desaconselhados; espere-os serem removidos em uma futura versão do MySQL.

Se `explicit_defaults_for_timestamp` estiver habilitado, o servidor desabilita os comportamentos não padrão e trata as colunas `TIMESTAMP` da seguinte forma:

+ Não é possível atribuir um valor `NULL` à coluna `TIMESTAMP` para defini-la como o timestamp atual. Para atribuir o timestamp atual, defina a coluna para `CURRENT_TIMESTAMP` ou um sinônimo como `NOW()`.

  + Colunas `TIMESTAMP` não declaradas explicitamente com o atributo `NOT NULL` são declaradas automaticamente com o atributo `NULL` e permitem valores `NULL`. Atribuir um valor `NULL` a uma coluna desse tipo define-a como `NULL`, não como o timestamp atual.

  + Colunas `TIMESTAMP` declaradas com o atributo `NOT NULL` não permitem valores `NULL`. Para inserções que especificam `NULL` para uma coluna desse tipo, o resultado é um erro para uma inserção de uma única linha se o modo SQL rigoroso estiver habilitado, ou `'0000-00-00 00:00:00'` é inserido para inserções de várias linhas com o modo SQL rigoroso desativado. Em nenhum caso, atribuir um valor `NULL` à coluna define-a como o timestamp atual.

  + Colunas `TIMESTAMP` declaradas explicitamente com o atributo `NOT NULL` e sem um atributo `DEFAULT` explícito são tratadas como não tendo um valor padrão. Para linhas inseridas que não especificam um valor explícito para uma coluna desse tipo, o resultado depende do modo SQL. Se o modo SQL rigoroso estiver habilitado, ocorre um erro. Se o modo SQL rigoroso não estiver habilitado, a coluna é declarada com o valor padrão implícito de `'0000-00-00 00:00:00'` e ocorre uma mensagem de aviso. Isso é semelhante ao modo como o MySQL trata outros tipos temporais, como `DATETIME`.

  + Nenhuma coluna `TIMESTAMP` é declarada automaticamente com os atributos `DEFAULT CURRENT_TIMESTAMP` ou `ON UPDATE CURRENT_TIMESTAMP`. Esses atributos devem ser especificados explicitamente.

  + A primeira coluna `TIMESTAMP` em uma tabela não é tratada de maneira diferente das colunas `TIMESTAMP` que a seguem.

Se `explicit_defaults_for_timestamp` for desativado na inicialização do servidor, este aviso aparece no log de erro:

```
  [Warning] TIMESTAMP with implicit DEFAULT value is deprecated.
  Please use --explicit_defaults_for_timestamp server option (see
  documentation for more details).
  ```

Como indicado pelo aviso, para desativar os comportamentos não padrão obsoletos, habilite a variável de sistema `explicit_defaults_for_timestamp` na inicialização do servidor.

Nota

`explicit_defaults_for_timestamp` é obsoleto porque seu único propósito é permitir o controle sobre comportamentos `TIMESTAMP` obsoletos que serão removidos em uma futura versão do MySQL. Quando a remoção desses comportamentos ocorrer, espere que `explicit_defaults_for_timestamp` também seja removido.

Para obter informações adicionais, consulte a Seção 13.2.5, “Inicialização e Atualização Automáticas para TIMESTAMP e DATETIME”.

* `external_user`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_crlpath"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-crlpath=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>admin_ssl_crlpath</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

O nome de usuário externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com a autenticação nativa (incorporada) do MySQL ou se o plugin não definir o valor, essa variável é `NULL`. Veja a Seção 8.2.19, “Usuários de Proxy”.

* `flush`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_crlpath"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-crlpath=nome_pasta</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_crlpath</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome da pasta</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Aplica-se apenas ao MyISAM.

  Se `ON`, o servidor limpa (sincroniza) todas as alterações no disco após cada instrução SQL. Normalmente, o MySQL escreve todas as alterações no disco apenas após cada instrução SQL e deixa o sistema operacional lidar com a sincronização no disco. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”. Esta variável é definida como `ON` se você iniciar o **mysqld** com a opção `--flush`.

  Observação

  Se `flush` estiver habilitado, o valor de `flush_time` não importa e alterações no `flush_time` não têm efeito no comportamento de limpeza.

* `flush_time`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_crlpath">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-ssl-crlpath=nome_pasta</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_ssl_crlpath</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome da pasta</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Se este valor for definido para um valor não nulo, todas as tabelas são fechadas a cada `flush_time` segundos para liberar recursos e sincronizar dados não fechados no disco. Esta opção é melhor usada apenas em sistemas com recursos mínimos.

  Nota

  Se `flush` estiver habilitado, o valor de `flush_time` não importa e alterações no `flush_time` não têm efeito no comportamento de flush.

* `foreign_key_checks`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_key">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-key=file_name</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_key</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Se definido para 1 (o padrão), as restrições de chave estrangeira são verificadas. Se definido para 0, as restrições de chave estrangeira são ignoradas, com algumas exceções. Ao recriar uma tabela que foi excluída, um erro é retornado se a definição da tabela não atender às restrições de chave estrangeira que a referenciam. Da mesma forma, uma operação `ALTER TABLE` retorna um erro se uma definição de chave estrangeira for incorretamente formada. Para mais informações, consulte a Seção 15.1.24.5, “Restrições de Chave Estrangeira”.

  Definir essa variável tem o mesmo efeito em tabelas `NDB` quanto em tabelas `InnoDB`. Normalmente, você deixa essa configuração habilitada durante o funcionamento normal, para impor a integridade referencial. Desabilitar a verificação de chave estrangeira pode ser útil para recarregar tabelas `InnoDB` em uma ordem diferente da exigida por suas relações pai/filho. Consulte a Seção 15.1.24.5, “Restrições de Chave Estrangeira”.

Definir `foreign_key_checks` para 0 também afeta as declarações de definição de dados: `DROP SCHEMA` exclui um esquema, mesmo que ele contenha tabelas que têm chaves estrangeiras referenciadas por tabelas fora do esquema, e `DROP TABLE` exclui tabelas que têm chaves estrangeiras referenciadas por outras tabelas.

Nota

Definir `foreign_key_checks` para 1 não dispara uma varredura dos dados da tabela existente. Portanto, as linhas adicionadas à tabela enquanto `foreign_key_checks = 0` não são verificadas quanto à consistência.

A exclusão de um índice exigido por uma restrição de chave estrangeira não é permitida, mesmo com `foreign_key_checks=0`. A restrição de chave estrangeira deve ser removida antes de excluir o índice.

* `ft_boolean_syntax`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_key">
    
    <tbody>
      <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-key=file_name</code></td> </tr>
      <tr><th>Variável do Sistema</th> <td><code>admin_ssl_key</code></td> </tr>
      <tr><th>Alcance</th> <td>Global</td> </tr>
      <tr><th>Dinâmico</th> <td>Sim</td> </tr>
      <tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
      <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
      <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
    </tbody>
  </table>
1

A lista de operadores suportados por pesquisas de texto completo booleanas realizadas usando `IN BOOLEAN MODE`. Veja a Seção 14.9.2, “Pesquisas de Texto Completo Booleanas”.

O valor padrão da variável é `'+ -><()~*:""&|'`. As regras para alterar o valor são as seguintes:

+ A função do operador é determinada pela posição na string.

+ O valor de substituição deve ser de 14 caracteres.
+ Cada caractere deve ser um caractere não alfanumérico ASCII.
+ O primeiro ou segundo caractere deve ser um espaço.
+ Não são permitidas duplicatas, exceto as frases que citam operadores nas posições 11 e 12. Esses dois caracteres não precisam ser iguais, mas são os únicos que podem ser.

+ As posições 10, 13 e 14 (que, por padrão, estão definidas como `:`, `&` e `|`) são reservadas para futuras extensões.

* `ft_max_word_len`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_key"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-key=file_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_key</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O comprimento máximo da palavra a ser incluída em um índice `FULLTEXT` de `MyISAM`.

  Nota

  Os índices `FULLTEXT` em tabelas `MyISAM` devem ser reconstruídos após a alteração desta variável. Use `REPAIR TABLE tbl_name QUICK`.

* `ft_min_word_len`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_key">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-ssl-key=file_name</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_ssl_key</code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>
3

O comprimento mínimo da palavra a ser incluída em um índice `FULLTEXT` de `MyISAM`.

Nota

Os índices `FULLTEXT` em tabelas `MyISAM` devem ser reconstruídos após a alteração desta variável. Use `REPAIR TABLE tbl_name QUICK`.

* `ft_query_expansion_limit`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_key">
  <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-key=file_name</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>admin_ssl_key</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
</table>
4
  O número de resultados principais a serem usados para pesquisas de texto completo realizadas usando `WITH QUERY EXPANSION`.

* `ft_stopword_file`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_key">
    <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-key=file_name</code></td> </tr>
    <tr><th>Variável do Sistema</th> <td><code>admin_ssl_key</code></td> </tr>
    <tr><th>Alcance</th> <td>Global</td> </tr>
    <tr><th>Dinâmico</th> <td>Sim</td> </tr>
    <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
    <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
  </table>
5

O arquivo a partir do qual ler a lista de palavras-chave para pesquisas de texto completo em tabelas `MyISAM`. O servidor procura o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. Todas as palavras do arquivo são usadas; os comentários *não* são considerados. Por padrão, uma lista integrada de palavras-chave é usada (conforme definido no arquivo `storage/myisam/ft_static.c`). Definir essa variável para a string vazia (`''`) desabilita o filtro de palavras-chave. Veja também a Seção 14.9.4, “Palavras-chave de Texto Completo”.

Nota

Os índices `FULLTEXT` em tabelas `MyISAM` devem ser reconstruídos após a alteração desta variável ou do conteúdo do arquivo de palavras-chave. Use `REPAIR TABLE tbl_name QUICK`.

* `general_log`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_key"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-key=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_key</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Se o log de consultas gerais está habilitado. O valor pode ser 0 (ou `OFF`) para desabilitar o log ou 1 (ou `ON`) para habilitar o log. O destino da saída do log é controlado pela variável de sistema `log_output`; se esse valor for `NONE`, nenhuma entrada de log é escrita, mesmo que o log esteja habilitado.

* `arquivo_log_geral`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_key"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-key=nome_do_arquivo</code></td> </tr><tr><th>Variável de sistema</th> <td><code>admin_ssl_key</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O nome do arquivo de log de consulta geral. O valor padrão é `nome_do_host.log`, mas o valor inicial pode ser alterado com a opção `--general_log_file`.

<table frame="box" rules="all" summary="Propriedades para admin_ssl_key">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-key=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_key</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

O número máximo de caracteres permitido em senhas aleatórias geradas para as instruções `CREATE USER`, `ALTER USER` e `SET PASSWORD`. Para mais informações, consulte Geração de Senhas Aleatórias.

* `global_connection_memory_limit`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_key">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-key=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_key</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

9. Defina o total de memória que pode ser usada por todas as conexões de usuário; ou seja, `Global_connection_memory` não deve exceder esse valor. Toda vez que isso ocorrer, todas as consultas (incluindo quaisquer que estejam em execução) de usuários regulares são rejeitadas com `ER_GLOBAL_CONN_LIMIT`.

A memória usada pelos usuários do sistema, como o usuário root do MySQL, está incluída neste total, mas não é contabilizada para o limite de desconexão; esses usuários nunca são desconectados devido ao uso de memória.

A memória usada pelo pool de buffer do `InnoDB` é excluída do total.

Você deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir esta variável.

* `global_connection_memory_status_limit`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

Este é o valor máximo de memória que pode ser consumido por todas as conexões do usuário antes que `Count_hit_query_past_global_connection_memory_status_limit` seja incrementado.

* `global_connection_memory_tracking`

Determina se o servidor calcula `Global_connection_memory`. Essa variável deve ser habilitada explicitamente; caso contrário, o cálculo de memória não é realizado e `Global_connection_memory` não é definido.

Você deve ter o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER` para definir essa variável.

* `group_concat_max_len`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tr><th>Formato de linha de comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O comprimento máximo permitido do resultado em bytes para a função `GROUP_CONCAT()`. O padrão é 1024.

* `have_compress`

  `YES` se a biblioteca de compressão `zlib` estiver disponível para o servidor, `NO` se não estiver. Se não estiver, as funções `COMPRESS()` e `UNCOMPRESS()` não podem ser usadas.

* `have_dynamic_loading`

  `YES` se o **mysqld** suportar o carregamento dinâmico de plugins, `NO` se não suportar. Se o valor for `NO`, você não pode usar opções como `--plugin-load` para carregar plugins no início do servidor ou a instrução `INSTALL PLUGIN` para carregar plugins em tempo de execução.

* `have_geometry`

  `YES` se o servidor suportar tipos de dados espaciais, `NO` se não suportar.

`SIM` se a capacidade de perfilamento estiver presente, `NÃO` se não estiver. Se estiver presente, a variável `profiling` controla se essa capacidade está habilitada ou desabilitada. Veja a Seção 15.7.7.34, “Instrução SHOW PROFILES”.

Esta variável está desatualizada; você deve esperar que ela seja removida em uma futura versão do MySQL.

* `have_query_cache`

  `have_query_cache` está desatualizada, sempre tem um valor de `NÃO`, e você deve esperar que ela seja removida em uma futura versão do MySQL.

* `have_rtree_keys`

  `YES` se os índices `RTREE` estiverem disponíveis, `NO` se não estiverem. (Esses são usados para índices espaciais em tabelas `MyISAM`.)

* `have_statement_timeout`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se a funcionalidade de limite de tempo de execução da instrução estiver disponível (veja Dicas de otimização de tempo de execução da execução de instruções). O valor pode ser `NÃO` se o thread de fundo usado por essa funcionalidade não puder ser inicializado.

* `have_symlink`

`SIM` se o suporte a links simbólicos estiver habilitado, `NÃO` se não estiver. Isso é necessário no Unix para o suporte às opções de tabelas `DIR_DATA` e `DIR_INDEX`. Se o servidor for iniciado com a opção `--skip-symbolic-links`, o valor é `DESABILITADO`.

Esta variável não tem significado no Windows.

Nota

O suporte a links simbólicos, juntamente com a opção `--symbolic-links` que o controla, está desatualizado; espere que esses sejam removidos em uma versão futura do MySQL. Além disso, a opção é desabilitada por padrão. A variável de sistema relacionada `have_symlink` também está desatualizada e você deve esperar que ela seja removida em uma versão futura do MySQL.

* `histogram_generation_max_mem_size`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tr><th>Formato de linha de comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável de sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A quantidade máxima de memória disponível para gerar estatísticas de histogramas. Veja a Seção 10.9.6, “Estatísticas do otimizador”, e a Seção 15.7.3.1, “Instrução ANALYZE TABLE”.

  Definir o valor da sessão desta variável de sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 7.1.9.1, “Privilégios de variáveis de sistema”.

* `host_cache_size`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

  O servidor MySQL mantém um cache de hosts de memória que contém informações sobre o nome do host e o endereço IP do cliente e é usado para evitar consultas no Sistema de Nomes de Domínio (DNS); consulte a Seção 7.1.12.3, “Consultas DNS e o Cache de Hosts”.

  A variável `host_cache_size` controla o tamanho do cache de hosts, bem como o tamanho da tabela `host_cache` do Schema de Desempenho que expõe o conteúdo do cache. Definir `host_cache_size` tem esses efeitos:

  + Definir o tamanho para 0 desabilita o cache de hosts. Com o cache desativado, o servidor realiza uma consulta no DNS toda vez que um cliente se conecta.

  + Alterar o tamanho em tempo de execução causa uma operação de limpeza implícita do cache de hosts que limpa o cache de hosts, trunca a tabela `host_cache` e desbloqueia quaisquer hosts bloqueados.

  O valor padrão é dimensionado automaticamente para 128, mais 1 para um valor de `max_connections` até 500, mais 1 para cada incremento de 20 acima de 500 no valor de `max_connections`, limitado a um limite de 2000.

* `hostname`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td>admin_address</td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</th></a> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

O servidor define essa variável com o nome do host do servidor no momento do início. O comprimento máximo é de 255 caracteres.

* `identity`

  Esta variável é um sinônimo da variável `last_insert_id`. Ela existe para compatibilidade com outros sistemas de banco de dados. Você pode ler seu valor com `SELECT @@identity` e configurá-lo usando `SET identity`.

* `init_connect`

Uma cadeia a ser executada pelo servidor para cada cliente que se conecta. A cadeia consiste em uma ou mais instruções SQL, separadas por caracteres ponto-e-vírgula.

Para usuários que têm o privilégio `CONNECTION_ADMIN` (ou o desatualizado privilégio `SUPER`), o conteúdo de `init_connect` não é executado. Isso é feito para evitar que um valor errôneo para `init_connect` impeça que todos os clientes se conectem. Por exemplo, o valor pode conter uma instrução com um erro sintático, causando o falha da conexão do cliente. Não executar `init_connect` para usuários que têm o privilégio `CONNECTION_ADMIN` ou `SUPER` permite que eles abram uma conexão e corrijam o valor de `init_connect`.

A execução de `init_connect` é ignorada para qualquer usuário do cliente com uma senha expirada. Isso é feito porque um usuário com uma senha expirada não pode executar instruções arbitrárias, e, portanto, a execução de `init_connect` falha, deixando o cliente incapaz de se conectar. Ignorar a execução de `init_connect` permite que o usuário se conecte e mude a senha.

O servidor descarta quaisquer conjuntos de resultados produzidos por instruções no valor de `init_connect`.

* `information_schema_stats_expiry`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

Algumas tabelas do `INFORMATION_SCHEMA` contêm colunas que fornecem estatísticas da tabela:

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

Essas colunas representam metadados dinâmicos da tabela; ou seja, informações que mudam à medida que o conteúdo da tabela muda.

Por padrão, o MySQL recupera valores cacheados para essas colunas das tabelas `mysql.index_stats` e `mysql.table_stats` quando as colunas são consultadas, o que é mais eficiente do que recuperar estatísticas diretamente do motor de armazenamento. Se as estatísticas cacheadas não estiverem disponíveis ou tiverem expirado, o MySQL recupera as estatísticas mais recentes do motor de armazenamento e as cacheia nas tabelas `mysql.index_stats` e `mysql.table_stats`. Consultas subsequentes recuperam as estatísticas cacheadas até que as estatísticas cacheadas expirem. Um reinício do servidor ou a primeira abertura das tabelas `mysql.index_stats` e `mysql.table_stats` não atualizam automaticamente as estatísticas cacheadas.

A variável de sessão `information_schema_stats_expiry` define o período de tempo antes que as estatísticas armazenadas em cache expirem. O valor padrão é de 86400 segundos (24 horas), mas o período de tempo pode ser estendido para até um ano.

Para atualizar os valores armazenados em cache a qualquer momento para uma determinada tabela, use `ANALYZE TABLE`.

Para sempre recuperar as estatísticas mais recentes diretamente do motor de armazenamento e ignorar os valores armazenados em cache, defina `information_schema_stats_expiry` para `0`.

A consulta de estatísticas não armazena ou atualiza estatísticas nas tabelas de dicionário `mysql.index_stats` e `mysql.table_stats` nessas circunstâncias:

+ Quando as estatísticas armazenadas em cache não expiraram.
+ Quando `information_schema_stats_expiry` está definido como 0.
+ Quando o servidor está no modo `read_only`, `super_read_only`, `transaction_read_only` ou `innodb_read_only`.
+ Quando a consulta também recupera dados do Schema de Desempenho.

O cache de estatísticas pode ser atualizado durante uma transação com múltiplas instruções antes de se saber se a transação será confirmada. Como resultado, o cache pode conter informações que não correspondem a um estado confirmado conhecido. Isso pode ocorrer com `autocommit=0` ou após `START TRANSACTION`.

`information_schema_stats_expiry` é uma variável de sessão, e cada sessão de cliente pode definir seu próprio valor de expiração. As estatísticas recuperadas do motor de armazenamento e armazenadas em cache por uma sessão estão disponíveis para outras sessões.

Para informações relacionadas, consulte a Seção 10.2.3, “Otimizando Consultas do INFORMATION_SCHEMA”.

* `init_file`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

Se especificado, esta variável nomeia um arquivo que contém instruções SQL a serem lidas e executadas durante o processo de inicialização. O formato aceitável para as instruções neste arquivo suporta os seguintes construtos:

+ `delimiter ;`, para definir o delimitador da instrução como o caractere `;`.

+ `delimiter $$`, para definir o delimitador da instrução como a sequência de caracteres `$$`.

+ Instruções múltiplas na mesma linha, delimitadas pelo delimitador atual.

+ Instruções de várias linhas.
  
  Comentários a partir de um caractere `#` até o final da linha.

  Comentários a partir de uma sequência `--` até o final da linha.

  Comentários em estilo C a partir de uma sequência `/*` até a sequência `*/` seguinte, incluindo em várias linhas.

  Literais de string de várias linhas fechados entre caracteres de aspas simples (`'`) ou duplas (`"`).

Se o servidor for iniciado com a opção `--initialize` ou `--initialize-insecure`, ele opera no modo de inicialização e algumas funcionalidades estão indisponíveis, o que limita as instruções permitidas no arquivo. Essas incluem instruções relacionadas à gestão de contas (como `CREATE USER` ou `GRANT`), replicação e identificadores de transações globais. Veja a Seção 19.1.3, “Replicação com Identificadores de Transações Globais”.

Os threads criados durante o início do servidor são usados para tarefas como a criação do dicionário de dados, execução de procedimentos de atualização e criação de tabelas do sistema. Para garantir um ambiente estável e previsível, esses threads são executados com os valores padrão do servidor para algumas variáveis do sistema, como `sql_mode`, `character_set_server`, `collation_server`, `completion_type`, `explicit_defaults_for_timestamp` e `default_table_encryption`.

Esses threads também são usados para executar as instruções em qualquer arquivo especificado com `init_file` ao iniciar o servidor, então essas instruções são executadas com os valores padrão do servidor para essas variáveis do sistema.

* `innodb_xxx`

As variáveis do sistema `InnoDB` estão listadas na Seção 17.14, “Opções de Inicialização do InnoDB e Variáveis do Sistema”. Essas variáveis controlam muitos aspectos do armazenamento, uso de memória e padrões de E/S para tabelas `InnoDB`, e são especialmente importantes agora que `InnoDB` é o motor de armazenamento padrão.

* `insert_id`

O valor a ser usado pela seguinte instrução `INSERT` ou `ALTER TABLE` ao inserir um valor `AUTO_INCREMENT`. Isso é usado principalmente com o log binário.

* `interactive_timeout`

<table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

O número de segundos que o servidor espera por atividade em uma conexão interativa antes de fechá-la. Um cliente interativo é definido como um cliente que usa a opção `CLIENT_INTERACTIVE` em `mysql_real_connect()`. Veja também `wait_timeout`.

* `internal_tmp_mem_storage_engine`

O mecanismo de armazenamento para tabelas temporárias internas em memória (consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas em MySQL”). Os valores permitidos são `TempTable` (o padrão) e `MEMORY`.

O otimizador usa o mecanismo de armazenamento definido por `internal_tmp_mem_storage_engine` para tabelas temporárias internas em memória.

Configurar uma configuração de sessão para `internal_tmp_mem_storage_engine` requer o privilégio `SESSION_VARIABLES_ADMIN` ou `SYSTEM_VARIABLES_ADMIN`.

* `join_buffer_size`

<table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

O tamanho mínimo do buffer que é usado para varreduras de índice simples, varreduras de índice de intervalo e junções que não usam índices e, portanto, realizam varreduras completas da tabela. Esta variável também controla a quantidade de memória usada para junções hash. Normalmente, a melhor maneira de obter junções rápidas é adicionar índices. Aumente o valor de `join_buffer_size` para obter uma junção completa mais rápida quando não for possível adicionar índices. Um buffer de junção é alocado para cada junção completa entre duas tabelas. Para uma junção complexa entre várias tabelas para as quais não são usados índices, pode ser necessário múltiplos buffers de junção.

O valor padrão é de 256 KB. O ajuste máximo permitido para `join_buffer_size` é de 4 GB−1. Valores maiores são permitidos para plataformas de 64 bits (exceto o Windows de 64 bits, para o qual valores grandes são truncados para 4 GB−1 com uma advertência). O tamanho do bloco é de 128, e um valor que não é um múltiplo exato do tamanho do bloco é arredondado para o próximo múltiplo inferior do tamanho do bloco pelo MySQL Server antes de armazenar o valor para a variável do sistema. O analisador permite valores até o valor máximo de inteiro não assinado para a plataforma (4294967295 ou 232−1 para um sistema de 32 bits, 18446744073709551615 ou 264−1 para um sistema de 64 bits), mas o valor máximo real é menor.

A menos que um algoritmo de Bloco em Rede ou Acesso a Chave em Batel seja usado, não há ganho em definir o buffer maior do que o necessário para armazenar cada linha correspondente, e todas as junções alocam pelo menos o tamanho mínimo, então use cautela ao definir essa variável para um valor grande globalmente. É melhor manter o ajuste global pequeno e alterar o ajuste da sessão para um valor maior apenas em sessões que estão fazendo junções grandes, ou alterar o ajuste por consulta individual usando uma dica de otimizador `SET_VAR` (veja a Seção 10.9.3, “Dicas de Otimizador”). O tempo de alocação de memória pode causar quedas substanciais de desempenho se o tamanho global for maior do que o necessário pela maioria das consultas que o usam.

Quando o Bloco em Rede é usado, um buffer de junção maior pode ser benéfico até o ponto em que todas as colunas necessárias de todas as linhas da primeira tabela são armazenadas no buffer de junção. Isso depende da consulta; o tamanho ótimo pode ser menor do que manter todas as linhas das primeiras tabelas.

Quando o acesso por chave em lote é usado, o valor de `join_buffer_size` define o tamanho do lote de chaves em cada solicitação ao motor de armazenamento. Quanto maior o buffer, mais acesso sequencial é feito à tabela da direita de uma operação de junção, o que pode melhorar significativamente o desempenho.

Para informações adicionais sobre o buffer de junção, consulte a Seção 10.2.1.7, “Algoritmos de Junção de Loop Aninhado”. Para informações sobre o acesso por chave em lote, consulte a Seção 10.2.1.12, “Junções de Loop Aninhado e Acesso por Chave em Lote”. Para informações sobre junções hash, consulte a Seção 10.2.1.4, “Otimização de Junção Hash”.

* `keep_files_on_create`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Se uma tabela `MyISAM` for criada sem a opção `DATA DIRECTORY`, o arquivo `.MYD` será criado no diretório do banco de dados. Por padrão, se `MyISAM` encontrar um arquivo `.MYD` existente nesse caso, ele o sobrescreverá. O mesmo se aplica aos arquivos `.MYI` para tabelas criadas sem a opção `INDEX DIRECTORY`. Para suprimir esse comportamento, defina a variável `keep_files_on_create` para `ON` (1), caso contrário, `MyISAM` não sobrescreverá arquivos existentes e retornará um erro. O valor padrão é `OFF` (0).

Se uma tabela `MyISAM` for criada com a opção `DATA DIRECTORY` ou `INDEX DIRECTORY` e um arquivo `.MYD` ou `.MYI` existente for encontrado, `MyISAM` sempre retornará um erro. Ele não sobrescreverá um arquivo no diretório especificado.

* `key_buffer_size`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Os blocos de índice para tabelas `MyISAM` são bufferados e compartilhados por todos os threads. `key_buffer_size` é o tamanho do buffer usado para blocos de índice. O buffer de chave também é conhecido como cache de chave.

O ajuste mínimo permitido é 0, mas você não pode definir `key_buffer_size` para 0 dinamicamente. Um ajuste de 0 elimina o cache de chaves, o que não é permitido em tempo de execução. Definir `key_buffer_size` para 0 é permitido apenas no início, caso em que o cache de chaves não é inicializado. Alterar o ajuste de `key_buffer_size` em tempo de execução de um valor de 0 para um valor permitido não nulo inicializa o cache de chaves.

`key_buffer_size` pode ser aumentado ou diminuído apenas em incrementos ou múltiplos de 4096 bytes. Aumentar ou diminuir o ajuste por um valor não compatível produz uma mensagem de aviso e trunca o ajuste para um valor compatível.

O ajuste máximo permitido para `key_buffer_size` é 4GB−1 em plataformas de 32 bits. Valores maiores são permitidos para plataformas de 64 bits. O tamanho máximo efetivo pode ser menor, dependendo da RAM física disponível e dos limites de RAM por processo impostos pelo seu sistema operacional ou plataforma de hardware. O valor desta variável indica a quantidade de memória solicitada. Internamente, o servidor aloca a maior quantidade de memória possível até esse valor, mas a alocação real pode ser menor.

Você pode aumentar o valor para obter um melhor gerenciamento de índices para todas as leituras e múltiplas escritas; em um sistema cuja função principal é executar o MySQL usando o mecanismo de armazenamento `MyISAM`, 25% da memória total da máquina é um valor aceitável para essa variável. No entanto, você deve estar ciente de que, se você aumentar o valor muito (por exemplo, mais de 50% da memória total da máquina), seu sistema pode começar a usar páginas e se tornar extremamente lento. Isso ocorre porque o MySQL depende do sistema operacional para realizar o cache do sistema de arquivos para leituras de dados, então você deve deixar um pouco de espaço para o cache do sistema de arquivos. Você também deve considerar os requisitos de memória de quaisquer outros mecanismos de armazenamento que você possa estar usando além do `MyISAM`.

Para ainda mais velocidade ao escrever muitas linhas ao mesmo tempo, use `LOCK TABLES`. Veja a Seção 10.2.5.1, “Otimizando Instruções INSERT”.

Você pode verificar o desempenho do buffer de chave emitindo uma instrução `SHOW STATUS` e examinando as variáveis de status `Key_read_requests`, `Key_reads`, `Key_write_requests` e `Key_writes`. (Veja a Seção 15.7.7, “Instruções SHOW”.) A proporção `Key_reads/Key_read_requests` normalmente deve ser menor que 0,01. A proporção `Key_writes/Key_write_requests` geralmente está próxima de 1 se você estiver usando principalmente atualizações e exclusões, mas pode ser muito menor se você tende a fazer atualizações que afetam muitas linhas ao mesmo tempo ou se estiver usando a opção de tabela `DELAY_KEY_WRITE`.

A fração do buffer de chave em uso pode ser determinada usando `key_buffer_size` em conjunto com a variável de status `Key_blocks_unused` e o tamanho do bloco de buffer, que está disponível a partir da variável de sistema `key_cache_block_size`:

```
  1 - ((Key_blocks_unused * key_cache_block_size) / key_buffer_size)
  ```

Esse valor é uma aproximação, pois um espaço interno é alocado para estruturas administrativas no buffer de chave. Os fatores que influenciam a quantidade de overhead para essas estruturas incluem o tamanho do bloco e o tamanho do ponteiro. À medida que o tamanho do bloco aumenta, a porcentagem do buffer de chave perdida para overhead tende a diminuir. Blocos maiores resultam em um menor número de operações de leitura (porque mais chaves são obtidas por leitura), mas, por outro lado, um aumento nas leituras de chaves que não são examinadas (se nem todas as chaves em um bloco são relevantes para uma consulta).

É possível criar múltiplas caches de chave `MyISAM`. O limite de tamanho de 4 GB aplica-se a cada cache individualmente, não como um grupo. Veja a Seção 10.10.2, “O Cache de Chave MyISAM”.

* `key_cache_age_threshold`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Este valor controla a degradação dos buffers da sublista quente de um cache de chave para a sublista fria. Valores menores causam a degradação mais rapidamente. O valor mínimo é 100. O valor padrão é 300. Veja a Seção 10.10.2, “O Cache de Chave MyISAM”.

* `key_cache_block_size`

O tamanho em bytes dos blocos na cache de chaves. O valor padrão é 1024. Veja a Seção 10.10.2, “A Cache de Chaves MyISAM”.

* `key_cache_division_limit`

O ponto de divisão entre as sublistas quentes e frias do cache de chaves da lista de buffers de chave. O valor é a porcentagem da lista de buffers a ser usada para a sublista quente. Os valores permitidos variam de 1 a 100. O valor padrão é 100. Veja a Seção 10.10.2, “O Cache de Chaves MyISAM”.

* `large_files_support`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code></code> Dicas Aplicadas</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se o **mysqld** foi compilado com opções para suporte a arquivos grandes.

* `large_pages`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</th></a> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>
19

* `large_page_size`

  <table frame="box" rules="all" summary="Propriedades para admin_address">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--admin-address=addr</code></td>
    </tr>
    <tr>
      <th>Variável do sistema</th>
      <td><code>admin_address</code></td>
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
      <th>Hinta de <code>SET_VAR</th></a> Aplica-se</th>
      <td>Não</td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
  </table>
20

Se o suporte a páginas grandes estiver habilitado, isso mostrará o tamanho das páginas de memória. Páginas de memória grandes são suportadas apenas no Linux; em outras plataformas, o valor desta variável é sempre 0. Veja a Seção 10.12.3.3, “Habilitar Suporte a Páginas Grandes”.

* `last_insert_id`

  O valor a ser retornado por `LAST_INSERT_ID()`. Este é armazenado no log binário quando você usa `LAST_INSERT_ID()` em uma instrução que atualiza uma tabela. Definir esta variável não atualiza o valor retornado pela função C `mysql_insert_id()`.

* `lc_messages`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O idioma a ser usado para mensagens de erro. O padrão é `en_US`. O servidor converte o argumento em um nome de idioma e o combina com o valor de `lc_messages_dir` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 12.12, “Configurar o Idioma da Mensagem de Erro”.

* `lc_messages_dir`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>
22

O diretório onde os mensagens de erro estão localizadas. O servidor usa o valor juntamente com o valor de `lc_messages` para produzir a localização do arquivo de mensagem de erro. Veja a Seção 12.12, “Configurando a Linguagem da Mensagem de Erro”.

* `lc_time_names`

Esta variável especifica o local que controla a linguagem usada para exibir os nomes e abreviações de dia e mês. Esta variável afeta a saída das funções `DATE_FORMAT()`, `DAYNAME()` e `MONTHNAME()`. Os nomes do local são valores no estilo POSIX, como `'ja_JP'` ou `'pt_BR'`. O valor padrão é `'en_US'` independentemente da configuração do local do sistema. Para mais informações, consulte a Seção 12.16, “Suporte ao Local do MySQL Server”.

* `license`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O tipo de licença que o servidor possui.

* `local_infile`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

  Esta variável controla a capacidade `LOCAL` do servidor para as instruções `LOAD DATA`. Dependendo da configuração de `local_infile`, o servidor recusa ou permite o carregamento de dados locais por clientes que têm `LOCAL` habilitado no lado do cliente.

  Para causar explicitamente que o servidor recuse ou permita as instruções `LOAD DATA LOCAL`, inicie o **mysqld** com `local_infile` desativado ou ativado, respectivamente. `local_infile` também pode ser definido em tempo de execução. Para mais informações, consulte a Seção 8.1.6, “Considerações de Segurança para LOAD DATA LOCAL”.

* `lock_wait_timeout`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

  Esta variável especifica o tempo de espera em segundos para tentativas de adquirir travões de metadados. Os valores permitidos variam de 1 a 31536000 (1 ano). O padrão é 31536000.

  Este tempo de espera aplica-se a todas as instruções que utilizam travões de metadados. Estes incluem operações DML e DDL em tabelas, visualizações, procedimentos armazenados e funções armazenadas, bem como instruções `LOCK TABLES`, `FLUSH TABLES WITH READ LOCK` e `HANDLER`.

  Este tempo de espera não se aplica a acessos implícitos a tabelas de sistema no banco de dados `mysql`, como tabelas de concessão modificadas por instruções `GRANT` ou `REVOKE` ou instruções de registro de tabela. O tempo de espera se aplica a tabelas de sistema acessadas diretamente, como com `SELECT` ou `UPDATE`.

  O valor do tempo de espera se aplica separadamente para cada tentativa de travão de metadados. Uma instrução dada pode exigir mais de um travão, portanto, é possível que a instrução bloqueie por mais tempo do que o valor de `lock_wait_timeout` antes de relatar um erro de tempo de espera. Quando ocorre o tempo de espera de travão, é relatado `ER_LOCK_WAIT_TIMEOUT`.

`lock_wait_timeout` também define o tempo que uma declaração `LOCK INSTANCE FOR BACKUP` espera por um bloqueio antes de desistir.

* `locked_in_memory`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Se o **mysqld** foi bloqueado na memória com `--memlock`.

* `log_error`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

O destino padrão do log de erros. Se o destino for o console, o valor é `stderr`. Caso contrário, o destino é um arquivo e o valor `log_error` é o nome do arquivo. Veja a Seção 7.4.2, “O Log de Erros”.

* `log_error_services`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code></code> Dicas Aplicadas</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

  Os componentes para habilitar o registro de erros. A variável pode conter uma lista com 0, 1 ou muitos elementos. No último caso, os elementos podem ser delimitados por vírgulas ou pontos e vírgulas, opcionalmente seguidos por espaço. Um determinado ajuste não pode usar tanto o separador ponto e vírgula quanto o ponto e vírgula. A ordem dos componentes é significativa porque o servidor executa os componentes na ordem listada.

  Qualquer componente carregável (não embutido) nomeado em `log_error_services` é carregado implicitamente se ainda não estiver carregado. Para mais informações, consulte a Seção 7.4.2.1, “Configuração do Log de Erros”.

* `log_error_suppression_list`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

30

Os valores simbólicos são preferíveis aos valores numéricos para melhorar a legibilidade e a portabilidade. Para obter informações sobre os símbolos e números de erro permitidos, consulte o Referência de Mensagens de Erro do MySQL 9.5.

O efeito de `log_error_suppression_list` se combina com o de `log_error_verbosity`. Para obter informações adicionais, consulte a Seção 7.4.2.5, “Filtragem do Log de Erros Baseada em Prioridade (log_filter_internal”)”).

* `log_error_verbosity`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code></code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

A variável de sistema `log_error_verbosity` especifica a verbosidade para o tratamento de eventos destinados ao log de erros. Esta variável afeta o filtro realizado pelo componente de filtro de log de erro `log_filter_internal`, que está habilitado por padrão (consulte a Seção 7.5.3, “Componentes do Log de Erros”). Se `log_filter_internal` estiver desabilitado, `log_error_verbosity` não tem efeito.

Os eventos destinados ao log de erros têm uma prioridade de `ERROR`, `WARNING` ou `INFORMATION`. `log_error_verbosity` controla a verbosidade com base nas prioridades permitidas para mensagens escritas no log, conforme mostrado na tabela a seguir.

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

32

Há também uma prioridade de `SYSTEM`. Mensagens de sistema sobre situações não de erro são impressas no log de erro, independentemente do valor de `log_error_verbosity`. Essas mensagens incluem mensagens de inicialização e desligamento e algumas mudanças significativas nas configurações.

O efeito de `log_error_verbosity` se combina com o de `log_error_suppression_list`. Para informações adicionais, consulte a Seção 7.4.2.5, “Filtragem de Log de Erro Baseada em Prioridade (log_filter_internal”)”).

* `log_output`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

  Os destinos ou destinos para a saída do log de consulta geral e do log de consultas lentas. O valor é uma lista de uma ou mais palavras separadas por vírgula escolhidas entre `TABLE`, `FILE` e `NONE`. `TABLE` seleciona o registro no `general_log` e `slow_log` tabelas no esquema de sistema `mysql`. `FILE` seleciona o registro em arquivos de log. `NONE` desativa o registro. Se `NONE` estiver presente no valor, ele tem precedência sobre quaisquer outras palavras presentes. `TABLE` e `FILE` podem ser usados para selecionar ambos os destinos de saída de log.

  Esta variável seleciona os destinos de saída de log, mas não habilita a saída de log. Para isso, habilite as variáveis de sistema `general_log` e `slow_query_log`. Para o registro de log por `FILE`, as variáveis de sistema `general_log_file` e `slow_query_log_file` determinam os locais dos arquivos de log. Para mais informações, consulte a Seção 7.4.1, “Selecionando Destinos de Saída de Log de Consulta Geral e de Consulta Lenta”.

* `log_queries_not_using_indexes`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

34. Se você habilitar essa variável com o registro de consultas lentas habilitado, as consultas que esperam recuperar todas as linhas serão registradas. Veja a Seção 7.4.5, “O Registro de Consultas Lentas”. Essa opção não significa necessariamente que nenhum índice é usado. Por exemplo, uma consulta que usa uma varredura completa do índice usa um índice, mas seria registrada porque o índice não limitaria o número de linhas.

* `log_raw`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

A variável de sistema `log_raw` é inicialmente definida pelo valor da opção `--log-raw`. Consulte a descrição dessa opção para obter mais informações. A variável de sistema também pode ser definida em tempo de execução para alterar o comportamento de mascaramento da senha.

* `log_slow_admin_statements`

Inclua declarações administrativas lentas nas declarações escritas para o log de consultas lentas. As declarações administrativas incluem `ALTER TABLE`, `ANALYZE TABLE`, `CHECK TABLE`, `CREATE INDEX`, `DROP INDEX`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

* `log_slow_extra`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</code></a> Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

  Se o log de consultas lentas estiver habilitado e o destino de saída incluir `FILE`, o servidor escreve campos adicionais nas linhas do arquivo de log que fornecem informações sobre declarações lentas. Veja a Seção 7.4.5, “O Log de Consultas Lentas”. A saída `TABLE` não é afetada.

* `log_timestamps`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hint do `SET_VAR` Aplica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

38

Esta variável controla o fuso horário dos timestamps nas mensagens escritas no log de erros e, em geral, nas mensagens do log de consultas e do log de consultas lentas escritas em arquivos. Ela não afeta o fuso horário das mensagens do log de consultas e do log de consultas lentas escritas em tabelas (`mysql.general_log`, `mysql.slow_log`). As linhas recuperadas dessas tabelas podem ser convertidas do fuso horário do sistema local para qualquer fuso horário desejado com `CONVERT_TZ()` ou definindo a variável de sistema `time_zone` da sessão.

Os valores permitidos de `log_timestamps` são `UTC` (o padrão) e `SYSTEM` (o fuso horário do sistema local).

Os timestamps são escritos no formato ISO 8601 / RFC 3339: `YYYY-MM-DDThh:mm:ss.uuuuuu` mais um valor de cauda de `Z` que indica o horário Zulu (UTC) ou `±hh:mm` (um deslocamento em relação ao UTC).

* `log_throttle_queries_not_using_indexes`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>
39

Se `log_queries_not_using_indexes` estiver habilitado, a variável `log_throttle_queries_not_using_indexes` limita o número de consultas desse tipo por minuto que podem ser escritas no log de consultas lentas. Um valor de 0 (padrão) significa “sem limite”. Para mais informações, consulte a Seção 7.4.5, “O Log de Consultas Lentas”.

* `long_query_time`

Se uma consulta demorar mais do que esse número de segundos, o servidor incrementa a variável de status `Slow_queries`. Se o log de consultas lentas estiver habilitado, a consulta é registrada no arquivo de log de consultas lentas. Esse valor é medido em tempo real, não em tempo de CPU, então uma consulta que está abaixo do limite em um sistema com carga leve pode estar acima do limite em um sistema com carga pesada. Os valores mínimo e padrão de `long_query_time` são 0 e 10, respectivamente. O máximo é 31536000, que é 365 dias em segundos. O valor pode ser especificado com uma resolução de microsegundos. Veja a Seção 7.4.5, “O Log de Consultas Lentas”.

Valores menores dessa variável resultam em mais instruções sendo consideradas de longa duração, com o resultado de que mais espaço é necessário para o log de consultas lentas. Para valores muito pequenos (menos de um segundo), o log pode crescer bastante em um curto período de tempo. Aumentar o número de instruções consideradas de longa duração também pode resultar em falsos positivos para o alerta “Número excessivo de processos de longa duração” no MySQL Enterprise Monitor, especialmente se a Replicação por Grupo estiver habilitada. Por essas razões, valores muito pequenos devem ser usados apenas em ambientes de teste, ou, em ambientes de produção, apenas por um curto período.

O **mysqldump** realiza uma varredura completa da tabela, o que significa que suas consultas podem frequentemente exceder um ajuste de `long_query_time` que é útil para consultas regulares. Se você quiser excluir a maioria ou todas as consultas geradas pelo **mysqldump** do log de consultas lentas, você pode usar `--mysqld-long-query-time` para alterar o valor da sessão da variável do sistema para um valor mais alto.

* `low_priority_updates`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td>admin_address</td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de SET_VAR Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

  Se definido como `1`, todas as instruções `INSERT`, `UPDATE`, `DELETE` e `LOCK TABLE WRITE` aguardam até que não haja uma consulta pendente `SELECT` ou `LOCK TABLE READ` na tabela afetada. O mesmo efeito pode ser obtido usando `{INSERT | REPLACE | DELETE | UPDATE} LOW_PRIORITY ...` para diminuir a prioridade de apenas uma consulta. Esta variável afeta apenas os motores de armazenamento que usam apenas o bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`). Veja a Seção 10.11.2, “Problemas de Bloqueio de Tabela”.

  Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

* `lower_case_file_system`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td>admin_address</td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

Esta variável descreve a sensibilidade à maiúscula e minúscula dos nomes de arquivos no sistema de arquivos onde o diretório de dados está localizado. `OFF` significa que os nomes de arquivos são sensíveis à maiúscula, `ON` significa que não são sensíveis à maiúscula. Esta variável é de leitura somente porque reflete um atributo do sistema de arquivos e configurá-la não teria efeito no sistema de arquivos.

* `lower_case_table_names`

Se definido como 0, os nomes das tabelas são armazenados conforme especificado e as comparações são sensíveis ao caso. Se definido como 1, os nomes das tabelas são armazenados em minúsculas no disco e as comparações não são sensíveis ao caso. Se definido como 2, os nomes das tabelas são armazenados conforme fornecidos, mas comparados em minúsculas. Esta opção também se aplica aos nomes de banco de dados e aos aliases das tabelas. Para obter detalhes adicionais, consulte a Seção 11.2.3, “Sensibilidade ao Caso dos Identificadores”.

O valor padrão desta variável depende da plataforma (consulte `lower_case_file_system`). No Linux e em outros sistemas semelhantes ao Unix, o padrão é `0`. No Windows, o valor padrão é `1`. No macOS, o valor padrão é `2`. No Linux (e em outros sistemas semelhantes ao Unix), definir o valor para `2` não é suportado; o servidor força o valor para `0` em vez disso.

Você *não* deve definir `lower_case_table_names` para 0 se estiver executando o MySQL em um sistema onde o diretório de dados reside em um sistema de arquivos não sensível ao caso (como no Windows ou no macOS). É uma combinação não suportada que pode resultar em uma condição de travamento ao executar uma operação `INSERT INTO ... SELECT ... FROM tbl_name` com a letra `tbl_name` errada. Com o `MyISAM`, acessar os nomes das tabelas usando diferentes letras poderia causar corrupção de índices.

Uma mensagem de erro é impressa e o servidor é encerrado se você tentar iniciar o servidor com `--lower_case_table_names=0` em um sistema não sensível ao caso.

A definição desta variável afeta o comportamento das opções de filtragem de replicação em relação à sensibilidade ao caso. Para obter mais informações, consulte a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”.

É proibido iniciar o servidor com um valor de `lower_case_table_names` diferente do valor usado quando o servidor foi inicializado. A restrição é necessária porque as colunas usadas por vários campos de tabelas do dicionário de dados são determinadas pelo valor definido quando o servidor é inicializado, e reiniciar o servidor com um valor diferente introduziria inconsistências na ordem e comparação dos identificadores.

Portanto, é necessário configurar `lower_case_table_names` para o valor desejado antes de inicializar o servidor. Na maioria dos casos, isso requer configurar `lower_case_table_names` em um arquivo de opção do MySQL antes de iniciar o servidor MySQL pela primeira vez. No entanto, para instalações APT em Debian e Ubuntu, o servidor é inicializado automaticamente, e não há oportunidade de configurar o valor em um arquivo de opção previamente. Portanto, você deve usar o utilitário `debconf-set-selection` antes de instalar o MySQL usando o APT para habilitar `lower_case_table_names`. Para fazer isso, execute este comando antes de instalar o MySQL usando o APT:

```
  ER_SERVER_SHUTDOWN_COMPLETE
  MY-000031
  000031
  MY-31
  31
  ```

* `mandatory_roles`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de SET_VAR Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

  Rotas que o servidor deve tratar como obrigatórias. Na prática, essas rotas são concedidas automaticamente a todos os usuários, embora a configuração de `mandatory_roles` não mude realmente as contas de usuário, e as rotas concedidas não são visíveis na tabela de sistema `mysql.role_edges`.

  O valor da variável é uma lista de nomes de rotas separados por vírgula. Exemplo:

  ```
  $> sudo debconf-set-selections <<< "mysql-server mysql-server/lowercase-table-names select Enabled"
  ```

  A configuração do valor de tempo de execução de `mandatory_roles` requer o privilégio `ROLE_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`) normalmente necessário para configurar o valor de tempo de execução de uma variável de sistema global.

  Os nomes das rotas consistem em uma parte de usuário e uma parte de host no formato `user_name@host_name`. A parte de host, se omitida, tem como padrão `%`. Para informações adicionais, consulte a Seção 8.2.5, “Especificação de Nomes de Rotas”.

  O valor de `mandatory_roles` é uma string, portanto, os nomes de usuário e de host, se citados, devem ser escritos de uma maneira permitida para citação dentro de strings citadas.

Os papéis nomeados no valor de `mandatory_roles` não podem ser revogados com `REVOKE` ou removidos com `DROP ROLE` ou `DROP USER`.

Para evitar que as sessões sejam feitas como sessões do sistema por padrão, um papel que tenha o privilégio `SYSTEM_USER` não pode ser listado no valor da variável de sistema `mandatory_roles`:

+ Se `mandatory_roles` receber um papel no momento do início que tenha o privilégio `SYSTEM_USER`, o servidor escreve uma mensagem no log de erro e sai.

+ Se `mandatory_roles` receber um papel no momento da execução que tenha o privilégio `SYSTEM_USER`, ocorre um erro e o valor de `mandatory_roles` permanece inalterado.

Os papéis obrigatórios, como os papéis concedidos explicitamente, só entram em vigor quando ativados (veja Ativando Papéis). No momento do login, a ativação do papel ocorre para todos os papéis concedidos se a variável de sistema `activate_all_roles_on_login` estiver habilitada; caso contrário, ou para papéis que sejam definidos como papéis padrão de outra forma. No momento da execução, `SET ROLE` ativa os papéis.

Papéis que não existem quando atribuídos a `mandatory_roles` mas são criados posteriormente podem exigir um tratamento especial para serem considerados obrigatórios. Para detalhes, consulte Definindo Papéis Obrigatórios.

`SHOW GRANTS` exibe os papéis obrigatórios de acordo com as regras descritas na Seção 15.7.7.23, “Instrução SHOW GRANTS”.

* `activate_mandatory_roles`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td>admin_address</td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

45

Ativa funções obrigatórias.

+ Se `activate_all_roles_on_login` estiver habilitado, `activate_mandatory_roles` é ignorado e tanto as funções obrigatórias quanto as concedidas são ativadas. Se `activate_all_roles_on_login` estiver desativado e `activate_mandatory_roles` estiver habilitado, as funções obrigatórias são ativadas além de quaisquer funções padrão associadas à conta.

* `max_allowed_packet`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>
46

O tamanho máximo de um pacote ou qualquer string gerada/intermediária, ou qualquer parâmetro enviado pela função C `mysql_stmt_send_long_data()`. O valor padrão é de 64 MB.

O buffer de mensagem do pacote é inicializado com `net_buffer_length` bytes, mas pode crescer até `max_allowed_packet` bytes quando necessário. Esse valor, por padrão, é pequeno, para capturar pacotes grandes (possíveis incorretos).

Você deve aumentar esse valor se estiver usando colunas `BLOB` grandes ou strings longas. Ele deve ser tão grande quanto o maior `BLOB` que você deseja usar. O limite do protocolo para `max_allowed_packet` é de 1 GB. O valor deve ser um múltiplo de 1024; valores que não são múltiplos são arredondados para o próximo múltiplo.

Quando você altera o tamanho do buffer de mensagem alterando o valor da variável `max_allowed_packet`, você também deve alterar o tamanho do buffer no lado do cliente, se o seu programa cliente permitir. O valor padrão de `max_allowed_packet` embutido na biblioteca do cliente é de 1GB, mas os programas clientes individuais podem sobrepor isso. Por exemplo, **mysql** e **mysqldump** têm valores padrão de 16MB e 24MB, respectivamente. Eles também permitem que você altere o valor do lado do cliente configurando `max_allowed_packet` na linha de comando ou em um arquivo de opção.

O valor da sessão desta variável é somente leitura. O cliente pode receber até tantos bytes quanto o valor da sessão. No entanto, o servidor não envia ao cliente mais bytes do que o valor atual do `max_allowed_packet` global. (O valor global pode ser menor que o valor da sessão se o valor global for alterado após o cliente se conectar.)

* `max_connect_errors`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Após `max_connect_errors` solicitações de conexão consecutivas de um host serem interrompidas sem uma conexão bem-sucedida, o servidor bloqueia esse host de futuras conexões. Se uma conexão de um host for estabelecida com sucesso em menos de `max_connect_errors` tentativas após uma conexão anterior ter sido interrompida, o contador de erros para o host é zerado. Para desbloquear hosts bloqueados, limpe o cache do host; veja Limpar o Cache do Host.

* `max_connections`

  <table frame="box" rules="all" summary="Propriedades para admin_address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-address=addr</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_address</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O número máximo de conexões de clientes simultâneas permitidas. O valor máximo efetivo é o menor entre o valor efetivo de `open_files_limit` `- 810` e o valor realmente definido para `max_connections`.

  Para mais informações, consulte a Seção 7.1.12.1, “Interfaces de Conexão”.

* `max_delayed_threads`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de SET_VAR Aplica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

49

Esta variável do sistema está desatualizada (porque os inserções `DELAYED` não são suportadas) e está sujeita à remoção em uma futura versão do MySQL.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de variáveis do sistema”.

* `max_digest_length`

<table frame="box" rules="all" summary="Propriedades para admin_address">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-address=addr</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_address</code></td>
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
    <th>Hinta de SET_VAR Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
</table>

  O número máximo de bytes de memória reservado por sessão para a computação de digests de declarações normalizados. Quando essa quantidade de espaço é usada durante a computação do digest, ocorre a troncamento: mais tokens de uma declaração analisada não são coletados ou incluídos no seu valor de digest. Declarações que diferem apenas após tantos bytes de tokens analisados produzem o mesmo digest de declaração normalizada e são consideradas idênticas se comparadas ou se agregadas para estatísticas de digest.

  O comprimento usado para calcular um digest de declaração normalizado é a soma do comprimento do digest de declaração normalizada e do comprimento do digest da declaração. Como o comprimento do digest da declaração é sempre 64, isso é equivalente a `LENGTH` (```
  SET PERSIST mandatory_roles = '`role1`@`%`,`role2`,role3,role4@localhost';
  ```SXpwdkQG6y```
     SELECT ATTR_VALUE INTO @sreason
     FROM performance_schema.global_variable_attributes
     WHERE VARIABLE_NAME='offline_mode' AND ATTR_NAME='reason';
     ```6WKaYG4RYm```
     SELECT SET_TIME INTO @stime
     FROM performance.schema_variables_info
     WHERE VARIABLE_NAME='offline_mode';
     ```oBJTgvYXCw```
       The server is currently in offline mode since @stime, reason: @sreason
       ```o7SZVKc4sw```
     SELECT SET_TIME, SET_USER INTO @stime, @suser
     FROM performance.schema_variables_info
     WHERE VARIABLE_NAME='offline_mode';
     ```MFRj6bmdgP```
       The server is currently in offline mode since @stime, set by user @suser
       ```uQcxOXpDwm```
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
  ```WbhrdfAqYm```
  SET SESSION RBR_EXEC_MODE=IDEMPOTENT;
  ```F57GX9Tzb1```
  mysql>  SET @@SESSION.session_track_system_variables='statement_id'
  mysql>  SELECT 1;
  +---+
  | 1 |
  +---+
  | 1 |
  +---+
  1 row in set (0.0006 sec)
  Statement ID: 603835
  ```MrnyrMDxFC```
    ISOLATION LEVEL
    READ ONLY
    READ WRITE
    WITH CONSISTENT SNAPSHOT
    ```S6K4EUub8a
* `skip_networking`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

Esta variável controla se o servidor permite conexões TCP/IP. Por padrão, ela está desabilitada (permitir conexões TCP). Se habilitada, o servidor permite apenas conexões locais (não TCP/IP) e toda interação com **mysqld** deve ser feita usando pipes nomeados ou memória compartilhada (no Windows) ou arquivos de socket Unix (no Unix). Esta opção é altamente recomendada para sistemas onde apenas clientes locais são permitidos. Veja a Seção 7.1.12.3, “Consultas DNS e Cache de Hospedeiros”.

Como iniciar o servidor com `--skip-grant-tables` desativa as verificações de autenticação, o servidor também desativa as conexões remotas nesse caso, habilitando `skip_networking`.

* `skip_show_database`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Isso impede que as pessoas usem a instrução `SHOW DATABASES` se não tiverem o privilégio `SHOW DATABASES`. Isso pode melhorar a segurança se você tiver preocupações sobre usuários poderem ver bancos de dados pertencentes a outros usuários. Seu efeito depende do privilégio `SHOW DATABASES`: Se o valor da variável for `ON`, a instrução `SHOW DATABASES` é permitida apenas para usuários que têm o privilégio `SHOW DATABASES`, e a instrução exibe todos os nomes de banco de dados. Se o valor for `OFF`, `SHOW DATABASES` é permitido a todos os usuários, mas exibe os nomes apenas dos bancos de dados para os quais o usuário tem o privilégio `SHOW DATABASES` ou outro privilégio.

  Cuidado

Como qualquer privilégio global estático é considerado um privilégio para todas as bases de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de bases de dados com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` de `INFORMATION_SCHEMA`, exceto as bases de dados que foram restringidas ao nível da base de dados por revogações parciais.

* `slow_launch_time`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de Sintaxe de Definição de Variável</th> <td><code>SET_VAR</a></code></td> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Se a criação de um tópico demorar mais que esse número de segundos, o servidor incrementa a variável de status `Slow_launch_threads`.

* `slow_query_log`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Se o log de consultas lentas estiver habilitado. O valor pode ser 0 (ou `OFF`) para desabilitar o log ou 1 (ou `ON`) para habilitar o log. O destino da saída do log é controlado pela variável `log_output`; se esse valor for `NONE`, nenhuma entrada de log é escrita, mesmo que o log esteja habilitado.

  “Lenta” é determinada pelo valor da variável `long_query_time`. Veja a Seção 7.4.5, “O Log de Consultas Lentas”.

* `slow_query_log_file`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr>
  <tr><th>Âmbito</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>33062</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>65535</code></td> </tr>
</table>

* `socket`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Em plataformas Unix, essa variável é o nome do arquivo de soquete que é usado para conexões de clientes locais. O padrão é `/tmp/mysql.sock`. (Para alguns formatos de distribuição, o diretório pode ser diferente, como `/var/lib/mysql` para RPMs.)

  Em Windows, essa variável é o nome do pipe nomeado que é usado para conexões de clientes locais. O valor padrão é `MySQL` (não case-sensitive).

* `sort_buffer_size`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de Sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

Cada sessão que deve realizar uma ordenação aloca um buffer desse tamanho. `sort_buffer_size` não é específico de nenhum motor de armazenamento e se aplica de maneira geral para otimização. No mínimo, o valor de `sort_buffer_size` deve ser grande o suficiente para acomodar quinze tuplas no buffer de ordenação. Além disso, aumentar o valor de `max_sort_length` pode exigir aumentar o valor de `sort_buffer_size`. Para mais informações, consulte a Seção 10.2.1.16, “Otimização de <code>SET_VAR”

O otimizador tenta descobrir quanto espaço é necessário, mas pode alocar mais, até o limite. Definir um valor maior que o necessário globalmente desacelera a maioria das consultas que realizam ordenamentos. É melhor aumentá-lo como um ajuste de sessão e apenas para as sessões que precisam de um tamanho maior. No Linux, existem limiares de 256KB e 2MB, onde valores maiores podem desacelerar significativamente a alocação de memória, então você deve considerar ficar abaixo de um desses valores. Experimente para encontrar o melhor valor para sua carga de trabalho. Veja a Seção B.3.3.5, “Onde o MySQL Armazena Arquivos Temporários”.

O ajuste máximo permitido para `sort_buffer_size` é 4GB−1. Valores maiores são permitidos para plataformas de 64 bits (exceto o Windows de 64 bits, para o qual valores grandes são truncados para 4GB−1 com um aviso).

* `sql_auto_is_null`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

Se essa variável estiver habilitada, após uma instrução que insere com sucesso um valor `AUTO_INCREMENT` gerado automaticamente, você poderá encontrar esse valor executando uma instrução do seguinte formato:

```
  CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
  CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
  ```

Se a instrução retornar uma linha, o valor retornado é o mesmo que se você tivesse invocado a função `LAST_INSERT_ID()`. Para obter detalhes, incluindo o valor de retorno após uma inserção de várias linhas, consulte a Seção 14.15, “Funções de Informação”. Se nenhum valor `AUTO_INCREMENT` foi inserido com sucesso, a instrução `SELECT` não retorna nenhuma linha.

O comportamento de recuperar um valor `AUTO_INCREMENT` usando uma comparação `IS NULL` é usado por alguns programas ODBC, como o Access. Veja Obter Valores de Auto-Incremento. Esse comportamento pode ser desabilitado definindo `sql_auto_is_null` para `OFF`.

O valor padrão de `sql_auto_is_null` é `OFF`.

* `sql_big_selects`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

Se definido como `OFF`, o MySQL interrompe as instruções `SELECT` que provavelmente levarão muito tempo para serem executadas (ou seja, instruções para as quais o otimizador estima que o número de linhas examinadas exceda o valor de `max_join_size`). Isso é útil quando uma instrução `WHERE` desaconselhável foi emitida. O valor padrão para uma nova conexão é `ON`, que permite todas as instruções `SELECT`.

Se você definir a variável de sistema `max_join_size` para um valor diferente de `DEFAULT`, `sql_big_selects` é definido como `OFF`.

* `sql_buffer_result`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Se habilitado, `sql_buffer_result` obriga os resultados das instruções `SELECT` a serem colocados em tabelas temporárias. Isso ajuda o MySQL a liberar os bloqueios da tabela mais cedo e pode ser benéfico em casos em que leva muito tempo enviar os resultados ao cliente. O valor padrão é `OFF`.

* `sql_generate_invisible_primary_key`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code></code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Se este servidor adiciona uma chave primária primária gerada invisível a qualquer tabela `InnoDB` que seja criada sem uma.

  Esta variável não é replicada. Além disso, mesmo que seja definida na replica, é ignorada pelos threads do aplicável de replicação; isso significa que, por padrão, uma replica não gera uma chave primária para qualquer tabela replicada que, na fonte, foi criada sem uma. Você pode fazer com que a replica gere chaves primárias invisíveis para tais tabelas definindo `REQUIRE_TABLE_PRIMARY_KEY_CHECK = GENERATE` como parte de uma declaração `CHANGE REPLICATION SOURCE TO`, especificando opcionalmente um canal de replicação.

  Para mais informações e exemplos, consulte a Seção 15.1.24.11, “Chaves primárias invisíveis geradas”.

* `sql_log_off`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

Esta variável controla se o registro no log de consultas gerais está desativado para a sessão atual (assumindo que o próprio log de consultas gerais esteja habilitado). O valor padrão é `OFF` (ou seja, habilite o registro). Para desabilitar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável de sessão `sql_log_off` para `ON` ou `OFF`.

Definir o valor de sessão desta variável do sistema é uma operação restrita. O usuário de sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sessão”.

* `sql_mode`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-port=port_num</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_port</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>33062</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>65535</code></td>
  </tr>
</table>

  O modo SQL atual do servidor, que pode ser configurado dinamicamente. Para detalhes, consulte a Seção 7.1.11, “Modos SQL do Servidor”.

  Nota

  Os programas de instalação do MySQL podem configurar o modo SQL durante o processo de instalação.

  Se o modo SQL for diferente do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opção que o servidor lê ao inicializar.

* `sql_notes`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr>
    <th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr>
  <tr>
    <th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr>
  <tr>
    <th>Alcance</th> <td>Global</td> </tr>
  <tr>
    <th>Dinâmica</th> <td>Não</td> </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr>
  <tr>
    <th>Tipo</th> <td>Inteiro</td> </tr>
  <tr>
    <th>Valor Padrão</th> <td><code>33062</code></td> </tr>
  <tr>
    <th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr>
    <th>Valor Máximo</th> <td><code>65535</code></td> </tr>
  </table>

62

Se habilitada (o padrão), os diagnósticos de nível `Note` incrementam `warning_count` e o servidor os registra. Se desabilitada, os diagnósticos de nível `Note` não incrementam `warning_count` e o servidor não os registra. O **mysqldump** inclui a saída para desabilitar essa variável para que a recarga do arquivo de dump não produza avisos para eventos que não afetam a integridade da operação de recarga.

* `sql_quote_show_create`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-port=port_num</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_port</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>33062</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>65535</code></td>
  </tr>
</table>

Se habilitado (o padrão), o servidor cita identificadores para as instruções `SHOW CREATE TABLE` e `SHOW CREATE DATABASE`. Se desabilitado, a citação é desativada. Esta opção é habilitada por padrão para que a replicação funcione para identificadores que requerem citação. Veja a Seção 15.7.7.12, “Instrução SHOW CREATE TABLE”, e a Seção 15.7.7.7, “Instrução SHOW CREATE DATABASE”.

* `sql_require_primary_key`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de Sintaxe para SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

As instruções que criam novas tabelas ou alteram a estrutura de tabelas existentes exigem que as tabelas tenham uma chave primária.

Definir o valor da sessão desta variável do sistema é uma operação restrita. O usuário da sessão deve ter privilégios suficientes para definir variáveis de sessão restritas. Consulte a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

Ativação desta variável ajuda a evitar problemas de desempenho na replicação baseada em linhas que podem ocorrer quando as tabelas não têm uma chave primária. Suponha que uma tabela não tenha uma chave primária e uma atualização ou exclusão modifique várias linhas. No servidor de origem da replicação, essa operação pode ser realizada usando uma única varredura da tabela, mas, quando replicada usando a replicação baseada em linhas, resulta em uma varredura da tabela para cada linha a ser modificada na replica. Com uma chave primária, essas varreduras da tabela não ocorrem.

`sql_require_primary_key` se aplica tanto às tabelas base quanto às tabelas `TEMPORARY`, e as alterações em seu valor são replicadas para os servidores replicados. A tabela deve usar os motores de armazenamento MySQL que podem participar da replicação.

Quando habilitado, `sql_require_primary_key` tem esses efeitos:

+ Tentativas de criar uma nova tabela sem uma chave primária falham com um erro. Isso inclui `CREATE TABLE ... LIKE`. Também inclui `CREATE TABLE ... SELECT`, a menos que a parte `CREATE TABLE` inclua uma definição de chave primária.

+ Tentativas de remover a chave primária de uma tabela existente falham com um erro, com a exceção de que remover a chave primária e adicionar uma chave primária na mesma declaração `ALTER TABLE` é permitido.

+ A remoção da chave primária falha mesmo se a tabela também contiver um índice `UNIQUE NOT NULL`.

+ Tentativas de importar uma tabela sem uma chave primária falham com um erro.

A opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` da instrução `CHANGE REPLICATION SOURCE TO` permite que uma replica selecione sua própria política para verificações de chave primária. Quando a opção é definida como `ON` para um canal de replicação, a replica sempre usa o valor `ON` para a variável de sistema `sql_require_primary_key` em operações de replicação que exigem uma chave primária. Quando a opção é definida como `OFF`, a replica sempre usa o valor `OFF` para a variável de sistema `sql_require_primary_key` em operações de replicação, de modo que uma chave primária nunca seja necessária, mesmo que a fonte a exija. Quando a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` é definida como `STREAM`, que é o padrão, a replica usa o valor que é replicado da fonte para cada transação. Com o ajuste `STREAM` para a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK`, se as verificações de privilégio estiverem em uso para o canal de replicação, a conta `PRIVILEGE_CHECKS_USER` precisa de privilégios suficientes para definir variáveis de sessão restritas, para que possa definir o valor de sessão para a variável de sistema `sql_require_primary_key`. Com as configurações `ON` ou `OFF`, a conta não precisa desses privilégios. Para mais informações, consulte a Seção 19.3.3, “Verificações de Privilégios de Replicação”.

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de Sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

Se essa variável estiver habilitada, as instruções `UPDATE` e `DELETE` que não utilizam uma chave na cláusula `WHERE` ou uma cláusula `LIMIT` produzem um erro. Isso permite capturar instruções `UPDATE` e `DELETE` onde as chaves não são usadas corretamente e que provavelmente alterariam ou excluiriam um grande número de linhas. O valor padrão é `OFF`.

Para o cliente **mysql**, `sql_safe_updates` pode ser habilitado usando a opção `--safe-updates`. Para mais informações, consulte "Usando o Modo de Atualizações Seguras (--safe-updates)").

* `sql_select_limit`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

O número máximo de linhas a serem retornadas por instruções `SELECT`. Para mais informações, consulte "Usando o Modo de Atualizações Seguras (--safe-updates)").

O valor padrão para uma nova conexão é o número máximo de linhas que o servidor permite por tabela. Valores padrão típicos são (232)−1 ou (264)−1. Se você alterou o limite, o valor padrão pode ser restaurado atribuindo um valor de `DEFAULT`.

Se uma instrução `SELECT` tiver uma cláusula `LIMIT`, a cláusula `LIMIT` tem precedência sobre o valor de `sql_select_limit`.

* `sql_warnings`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr>
    <th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr>
  <tr>
    <th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr>
  <tr>
    <th>Alcance</th> <td>Global</td> </tr>
  <tr>
    <th>Dinâmica</th> <td>Não</td> </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr>
    <th>Tipo</th> <td>Inteiro</td> </tr>
  <tr>
    <th>Valor Padrão</th> <td><code>33062</code></td> </tr>
  <tr>
    <th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr>
    <th>Valor Máximo</th> <td><code>65535</code></td> </tr>
  </table>

  Esta variável controla se as instruções `INSERT` de uma única linha produzem uma string de informações se ocorrerem avisos. O valor padrão é `OFF`. Defina o valor para `ON` para produzir uma string de informações.

* `ssl_ca`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA) no formato PEM. O arquivo contém uma lista de Autoridades de Certificados SSL confiáveis.

Esta variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e Monitoramento em Tempo de Execução do Servidor para Conexões Encriptadas.

* `ssl_capath`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O nome do caminho do diretório que contém os arquivos de certificado da Autoridade de Certificação SSL (CA) confiável no formato PEM. Você deve executar o `rehash` do OpenSSL no diretório especificado por esta opção antes de usá-lo. Em sistemas Linux, você pode invocar o `rehash` da seguinte maneira:

  ```
  SELECT * FROM tbl_name WHERE auto_col IS NULL
  ```

  Em plataformas Windows, você pode usar o script `c_rehash` em um prompt de comando, da seguinte maneira:

  ```
  $> openssl rehash path/to/directory
  ```

  Consulte [openssl-rehash](https://docs.openssl.org/3.1/man1/openssl-rehash.1.html) para obter a sintaxe completa e outras informações.

  Esta variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e monitoramento de configuração em tempo de execução no lado do servidor para conexões criptografadas.

* `ssl_cert`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O nome do caminho do arquivo de certificado público SSL do servidor no formato PEM.

  Se o servidor for iniciado com `ssl_cert` definido para um certificado que use qualquer cifra ou categoria de cifra restrita, o servidor será iniciado com o suporte para conexões criptografadas desativado. Para obter informações sobre restrições de cifra, consulte Configuração de cifra de conexão.

  Esta variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício se o valor da variável foi persistido. Consulte Configuração e Monitoramento em Tempo de Execução no Servidor para Conexões Criptografadas.

* `ssl_cipher`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

A lista de cifra de criptografia permitida para conexões que usam TLSv1.2. Se nenhuma cifra na lista for suportada, as conexões criptografadas que usam este protocolo TLS não funcionam.

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

Tentar incluir quaisquer valores na lista de cifra que não sejam mostrados aqui ao definir esta variável gera um erro (`ER_BLOCKED_CIPHER`).

Para maior portabilidade, a lista de cifra deve ser uma lista de um ou mais nomes de cifra, separados por dois pontos (:). O exemplo a seguir mostra dois nomes de cifra separados por dois pontos:

```
  \> c_rehash path/to/directory
  ```

O OpenSSL suporta a sintaxe para especificar cifras descritas na documentação do OpenSSL em <https://www.openssl.org/docs/manmaster/man1/ciphers.html>.

Para informações sobre quais cifras de criptografia o MySQL suporta, consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão encriptada”.

Esta variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e monitoramento dinâmico do lado do servidor para conexões encriptadas.

* `ssl_crl`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></table>

O nome do caminho do arquivo que contém listas de revogação de certificados no formato PEM.

Esta variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e Monitoramento em Tempo de Execução no Servidor para Conexões Encriptadas.

* `ssl_crlpath`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O caminho do diretório que contém arquivos de lista de revogação de certificados no formato PEM.

  Esta variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e Monitoramento em Tempo de Execução no Servidor para Conexões Encriptadas.

* `ssl_fips_mode`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

Controla se o modo FIPS deve ser habilitado no lado do servidor. A variável do sistema `ssl_fips_mode` difere de outras variáveis do sistema `ssl_xxx` porque não é usada para controlar se o servidor permite conexões criptografadas, mas sim para afetar quais operações criptográficas são permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Estes valores de `ssl_fips_mode` são permitidos:

+ `OFF` (ou 0): Desabilitar o modo FIPS.
+ `ON` (ou 1): Habilitar o modo FIPS.
+ `STRICT` (ou 2): Habilitar o modo FIPS “estricto”.

Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `ssl_fips_mode` é `OFF`. Nesse caso, definir `ssl_fips_mode` para `ON` ou `STRICT` no início faz com que o servidor produza uma mensagem de erro e saia.

Esta opção é desatualizada e torna-se somente leitura. Espere que ela seja removida em uma versão futura do MySQL.

* `ssl_key`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

O nome do caminho do arquivo de chave privada SSL do servidor no formato PEM. Para maior segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

Se o arquivo de chave estiver protegido por uma senha, o servidor solicita ao usuário a senha. A senha deve ser fornecida interativamente; ela não pode ser armazenada em um arquivo. Se a senha estiver incorreta, o programa continua como se não pudesse ler a chave.

Esta variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` ou após um reinício, se o valor da variável foi persistido. Consulte Configuração e Monitoramento em Tempo de Execução no Servidor para Conexões Encriptadas.

* `ssl_session_cache_mode`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-port=port_num</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_port</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>33062</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>65535</code></td>
  </tr>
</table>

76

Controla se o cache de sessão na memória no lado do servidor e a geração de tickets de sessão pelo servidor devem ser habilitados. O modo padrão é `ON` (modo de cache de sessão habilitado). Uma mudança na variável de sistema `ssl_session_cache_mode` tem efeito apenas após a instrução `ALTER INSTANCE RELOAD TLS` ter sido executada ou após um reinício se o valor da variável for persistido.

Estes valores de `ssl_session_cache_mode` são permitidos:

+ `ON`: Habilitar o modo de cache de sessão.
+ `OFF`: Desabilitar o modo de cache de sessão.

O servidor não anuncia seu suporte para a retomada da sessão se o valor desta variável de sistema for `OFF`. Ao ser executado no OpenSSL 1.0.`x`, os tickets de sessão são sempre gerados, mas os tickets não são utilizáveis quando o `ssl_session_cache_mode` está habilitado.

O valor atual em vigor para `ssl_session_cache_mode` pode ser observado com a variável `Ssl_session_cache_mode`.

* `ssl_session_cache_timeout`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Define um período de tempo durante o qual a reutilização de sessões anteriores é permitida ao estabelecer uma nova conexão criptografada com o servidor, desde que a variável `ssl_session_cache_mode` esteja habilitada e os dados da sessão anterior estejam disponíveis. Se o tempo de espera da sessão expirar, uma sessão não poderá ser reutilizada.

O valor padrão é de 300 segundos e o valor máximo é de 84600 (ou um dia em segundos). Uma alteração na variável de sistema `ssl_session_cache_timeout` só tem efeito após a execução da instrução `ALTER INSTANCE RELOAD TLS`, ou após um reinício, se o valor da variável foi persistido. O valor atual em vigor para `ssl_session_cache_timeout` pode ser observado com a variável de status `Ssl_session_cache_timeout`.

* `statement_id`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável de sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Cada instrução executada na sessão atual é atribuída um número de sequência. Isso pode ser usado juntamente com a variável de sistema `session_track_system_variables` para identificar essa instrução nas tabelas do Performance Schema, como a tabela `events_statements_history`.

* `stored_program_cache`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr>
    <th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr>
  <tr>
    <th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr>
  <tr>
    <th>Alcance</th> <td>Global</td> </tr>
  <tr>
    <th>Dinâmica</th> <td>Não</td> </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr>
    <th>Tipo</th> <td>Inteiro</td> </tr>
  <tr>
    <th>Valor Padrão</th> <td><code>33062</code></td> </tr>
  <tr>
    <th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr>
    <th>Valor Máximo</th> <td><code>65535</code></td> </tr>
  </table>
79

  Define um limite superior suave para o número de rotinas armazenadas em cache por conexão. O valor desta variável é especificado em termos do número de rotinas armazenadas em cada um dos dois caches mantidos pelo MySQL Server para, respectivamente, procedimentos armazenados e funções armazenadas.

  Sempre que uma rotina armazenada é executada, esse tamanho de cache é verificado antes do primeiro ou da instrução de nível superior na rotina ser analisada; se o número de rotinas do mesmo tipo (procedimentos armazenados ou funções armazenadas, conforme o que está sendo executado) exceder o limite especificado por esta variável, o cache correspondente é esvaziado e a memória previamente alocada para objetos em cache é liberada. Isso permite que o cache seja esvaziado com segurança, mesmo quando há dependências entre rotinas armazenadas.

Os caches de procedimentos armazenados e funções armazenadas existem em paralelo com a partição de cache de definição de programas armazenados do cache de objetos do dicionário. Os caches de procedimentos armazenados e funções armazenadas são por conexão, enquanto o cache de definição de programas armazenados é compartilhado. A existência de objetos nos caches de procedimentos armazenados e funções armazenadas não depende da existência de objetos no cache de definição de programas armazenados, e vice-versa. Para mais informações, consulte a Seção 16.4, “Cache de Objetos do Dicionário”.

* `cache_of_stored_program_definition`

Os objetos de definição de programas armazenados não utilizados são mantidos apenas no cache do objeto de dicionário quando o número em uso é menor que a capacidade definida por `cache_de_definição_de_programas_armazenados`.

Uma configuração de 0 significa que os objetos de definição de programas armazenados são mantidos apenas no cache do objeto de dicionário enquanto estão em uso.

A partição do cache de definição de programas armazenados existe em paralelo com os caches de procedimentos armazenados e funções armazenadas que são configurados usando a opção `cache_de_programas_armazenados`.

A opção `cache_de_programas_armazenados` define um limite superior suave para o número de procedimentos ou funções armazenadas em cache por conexão, e o limite é verificado cada vez que uma conexão executa um procedimento ou função armazenada. A partição do cache de definição de programas armazenados, por outro lado, é um cache compartilhado que armazena objetos de definição de programas armazenados para outros propósitos. A existência de objetos na partição do cache de definição de programas armazenados não depende da existência de objetos nos caches de procedimentos armazenados ou nos caches de funções armazenadas, e vice-versa.

Para informações relacionadas, consulte a Seção 16.4, “Cache do objeto de dicionário”.

* `super_read_only`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-port=port_num</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_port</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>33062</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>65535</code></td>
  </tr>
</table>

  Se a variável de sistema `read_only` estiver habilitada, o servidor não permite atualizações de clientes, exceto por usuários que tenham o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`). Se a variável de sistema `super_read_only` também estiver habilitada, o servidor proíbe atualizações de clientes, mesmo por usuários que tenham `CONNECTION_ADMIN` ou `SUPER`. Veja a descrição da variável de sistema `read_only` para obter uma descrição do modo de leitura e informações sobre como `read_only` e `super_read_only` interagem.

  As atualizações de cliente impedidas quando `super_read_only` está habilitado incluem operações que não necessariamente parecem ser atualizações, como `CREATE FUNCTION` (para instalar uma função carregável), `INSTALL PLUGIN` e `INSTALL COMPONENT`. Essas operações são proibidas porque envolvem alterações em tabelas no esquema do sistema `mysql`.

Da mesma forma, se o Agendamento de Eventos estiver habilitado, habilitar a variável de sistema `super_read_only` impede que ela atualize os timestamps de "última execução" do evento nos registros de dados `events`. Isso faz com que o Agendamento de Eventos pare na próxima vez que tentar executar um evento agendado, após escrever uma mensagem no log de erro do servidor. (Nesse caso, a variável de sistema `event_scheduler` não muda de `ON` para `OFF`. Uma implicação é que essa variável rejeita a *intenção* do DBA de que o Agendamento de Eventos seja habilitado ou desabilitado, onde seu status real de iniciado ou parado pode ser distinto.). Se `super_read_only` for posteriormente desabilitado após ser habilitado, o servidor reinicia automaticamente o Agendamento de Eventos conforme necessário.

As alterações em `super_read_only` em um servidor de origem de replicação não são replicadas para os servidores replicados. O valor pode ser definido em um replica independente da configuração na fonte.

* `syseventlog.facility`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

A facilidade para a saída do log de erro escrita no `syslog` (que tipo de programa está enviando a mensagem). Esta variável não está disponível a menos que o componente de log de erro `log_sink_syseventlog` esteja instalado. Consulte a Seção 7.4.2.8, “Log de Erros no Log do Sistema”.

Os valores permitidos podem variar de acordo com o sistema operacional; consulte a documentação do `syslog` do seu sistema.

Esta variável não existe no Windows.

* `syseventlog.include_pid`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-port=port_num</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_port</code></td>
  </tr>
  <tr>
    <th>Âmbito</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>33062</code></td>
  </tr>
  <tr>
    <th>Valor mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor máximo</th>
    <td><code>65535</code></td>
  </tr>
</table>

83

Se incluir o ID do processo do servidor em cada linha de saída do log de erro escrito no `syslog`. Esta variável não está disponível a menos que o componente de log de erro `log_sink_syseventlog` esteja instalado. Consulte a Seção 7.4.2.8, “Log de erro no log do sistema”.

Esta variável não existe no Windows.

* `syseventlog.tag`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  A tag a ser adicionada ao identificador do servidor na saída do log de erro escrito no `syslog` ou no Log de Eventos do Windows. Essa variável não está disponível, a menos que o componente de log de erro `log_sink_syseventlog` esteja instalado. Veja a Seção 7.4.2.8, “Log de Erros no Log do Sistema”.

  Por padrão, nenhuma tag é definida, portanto, o identificador do servidor é simplesmente `MySQL` no Windows e `mysqld` em outras plataformas. Se um valor de tag de *`tag`* for especificado, ele é anexado ao identificador do servidor com um hífen antes, resultando em um identificador `syslog` de `mysqld-tag` (ou `MySQL-tag` no Windows).

  Em Windows, para usar uma tag que não existe, o servidor deve ser executado a partir de uma conta com privilégios de Administrador, para permitir a criação de uma entrada de registro para a tag. Privilegios elevados não são necessários se a tag já existir.

* `system_time_zone`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de Sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  O fuso horário do sistema do servidor. Quando o servidor começa a executar, ele herda um ajuste do fuso horário da máquina, possivelmente modificado pelo ambiente da conta usada para executar o servidor ou pelo script de inicialização. O valor é usado para definir `system_time_zone`. Para especificar explicitamente o fuso horário do sistema, defina a variável de ambiente `TZ` ou use a opção `--timezone` do script **mysqld_safe**.

  Além da inicialização do tempo de inicialização, se o fuso horário do host do servidor mudar (por exemplo, devido ao horário de verão), `system_time_zone` refletirá essa mudança, o que tem essas implicações para as aplicações:

  + Consultas que fazem referência a `system_time_zone` obterão um valor antes de uma mudança de horário de verão e um valor diferente após a mudança.

+ Para consultas que começam a ser executadas antes de uma mudança de horário de verão e terminam após a mudança, o `system_time_zone` permanece constante dentro da consulta porque o valor geralmente é armazenado em cache no início da execução.

A variável `system_time_zone` difere da variável `time_zone`. Embora possam ter o mesmo valor, a última variável é usada para inicializar o fuso horário para cada cliente que se conecta. Veja a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.

* `table_definition_cache`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

O número de definições de tabela que podem ser armazenadas no cache de definições de tabela. Se você usar um grande número de tabelas, pode criar um cache de definições de tabela grande para acelerar a abertura das tabelas. O cache de definições de tabela ocupa menos espaço e não usa descritores de arquivo, ao contrário do cache normal de tabela. O valor mínimo é 400. O valor padrão é baseado na seguinte fórmula, limitada a um limite de 2000:

```
  [mysqld]
  ssl_cipher="DHE-RSA-AES128-GCM-SHA256:AES128-SHA"
  ```

Para o `InnoDB`, o ajuste `table_definition_cache` atua como um limite suave para o número de instâncias de tabela no cache do objeto de dicionário e o número de espaços de tabela por arquivo que podem ser abertos de uma vez.

Se o número de instâncias de tabela no cache do objeto de dicionário exceder o limite do `table_definition_cache`, um mecanismo LRU começa a marcar as instâncias de tabela para expulsão e eventualmente as remove do cache do objeto de dicionário. O número de tabelas abertas com metadados armazenados no cache pode ser maior que o limite do `table_definition_cache` devido às instâncias de tabela com relações de chave estrangeira, que não são colocadas na lista LRU.

O número de espaços de tabela por arquivo que podem ser abertos de uma vez é limitado tanto pelo ajuste `table_definition_cache` quanto pelo ajuste `innodb_open_files`. Se ambas as variáveis forem definidas, o ajuste mais alto é usado. Se nenhuma variável for definida, o ajuste do `table_definition_cache`, que tem um valor padrão mais alto, é usado. Se o número de espaços de tabela abertos exceder o limite definido por `table_definition_cache` ou `innodb_open_files`, um mecanismo LRU busca os arquivos de espaço de tabela na lista LRU que estão completamente descarregados e atualmente não estão sendo estendidos. Esse processo é realizado cada vez que um novo espaço de tabela é aberto. Apenas os espaços de tabela inativos são fechados.

O cache de definição de tabela existe em paralelo com a partição de cache de definição de tabela do cache de objetos do dicionário. Ambos os caches armazenam definições de tabelas, mas servem partes diferentes do servidor MySQL. Os objetos de um cache não dependem da existência de objetos no outro. Para mais informações, consulte a Seção 16.4, “Cache de Objetos do Dicionário”.

* `table_encryption_privilege_check`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code></code> Dicas de sintaxe de configuração de variável Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Controla a verificação de privilégio `TABLE_ENCRYPTION_ADMIN` que ocorre ao criar ou alterar um esquema ou espaço de tabela geral com criptografia diferente do ajuste `default_table_encryption`, ou ao criar ou alterar uma tabela com um ajuste de criptografia diferente da criptografia padrão do esquema. A verificação é desabilitada por padrão.

  Definir `table_encryption_privilege_check` em tempo de execução requer o privilégio `SUPER`.

`table_encryption_privilege_check` suporta a sintaxe `SET PERSIST` e `SET PERSIST_ONLY`. Veja a Seção 7.1.9.3, “Variáveis de sistema persistidas”.

Para mais informações, consulte Definindo um padrão de criptografia para esquemas e espaços de tabelas gerais.

* `table_open_cache`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável de sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code></code> Dicas de sintaxe de definição de variável aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

O número de tabelas abertas para todos os threads. Aumentar esse valor aumenta o número de descritores de arquivo que o **mysqld** requer. O valor efetivo dessa variável é o maior entre o valor efetivo de `open_files_limit` `- 10 -` o valor efetivo de `max_connections` / 2, e 400; ou seja

```
  MIN(400 + table_open_cache / 2, 2000)
  ```

Você pode verificar se precisa aumentar o cache de tabelas verificando a variável `Opened_tables`. Se o valor de `Opened_tables` for grande e você não usar o `FLUSH TABLES` com frequência (o que força todas as tabelas a serem fechadas e reabertas), então você deve aumentar o valor da variável `table_open_cache`. Para mais informações sobre o cache de tabelas, consulte a Seção 10.4.3.1, “Como o MySQL Abre e Fecha Tabelas”.

* `table_open_cache_instances`

O número de instâncias de cache de tabelas abertas. Para melhorar a escalabilidade reduzindo a concorrência entre as sessões, o cache de tabelas abertas pode ser particionado em várias instâncias menores de tamanho `table_open_cache` / `table_open_cache_instances`. Uma sessão precisa bloquear apenas uma instância para acessá-la para instruções DML. Isso segmenta o acesso ao cache entre as instâncias, permitindo um desempenho maior para operações que usam o cache quando há muitas sessões acessando tabelas. (As instruções DDL ainda requerem um bloqueio em todo o cache, mas tais instruções são muito menos frequentes do que as instruções DML.)

Um valor de 8 ou 16 é recomendado em sistemas que usam rotineiramente 16 ou mais núcleos. No entanto, se você tiver muitos gatilhos grandes em suas tabelas que causam uma alta carga de memória, o ajuste padrão para `table_open_cache_instances` pode levar a um uso excessivo de memória. Nessa situação, pode ser útil definir `table_open_cache_instances` para 1 para restringir o uso de memória.

* `table_open_cache_triggers`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

O número máximo total de tabelas abertas em cache com gatilhos totalmente carregados. Isso inclui tanto tabelas usadas quanto tabelas não usadas com gatilhos totalmente carregados.

`table_open_cache_triggers` é semelhante a `table_open_cache`, mas controla um mecanismo de evicção especificamente para tabelas com gatilhos totalmente carregados. O valor padrão para `table_open_cache_triggers` é o mesmo que o máximo; definir o valor menor que este ativa a lógica de evicção específica para tabelas com gatilhos totalmente carregados. Deixar `table_open_cache_triggers` no valor padrão significa que nenhuma tabela é evicida do cache com base se ela tem algum gatilho totalmente carregado, o que é o mesmo comportamento das versões do MySQL anteriores a 9.1.

O número máximo de tabelas em cache com gatilhos, por instância de cache, é determinado por `table_open_cache_triggers`/`table_open_cache_instances`. Quando essas variáveis de sistema são permitidas a reter seus valores padrão, esse valor é de 32768.

* `tablespace_definition_cache`

  <table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Define um limite para o número de objetos de definição de tabelaspace, tanto usados quanto não usados, que podem ser mantidos no cache do objeto de dicionário.

  Objetos de definição de tabelaspace não usados são mantidos apenas no cache do objeto de dicionário quando o número em uso é menor que a capacidade definida por `tablespace_definition_cache`.

  Um valor de `0` significa que os objetos de definição de tabelaspace são mantidos apenas no cache do objeto de dicionário enquanto estão em uso.

  Para mais informações, consulte a Seção 16.4, “Cache de Objetos de Dicionário”.

* `telemetry.resource_provider`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

Nome do componente a ser invocado que fornece uma implementação do serviço de provedor de recursos. A invocação do serviço de provedor de recursos permite obter os detalhes sobre o recurso opentelemetry usado, que depende da implementação.

* `telemetry.secret_provider`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr>
    <th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr>
  <tr>
    <th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr>
  <tr>
    <th>Alcance</th> <td>Global</td> </tr>
  <tr>
    <th>Dinâmica</th> <td>Não</td> </tr>
  <tr>
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr>
    <th>Tipo</th> <td>Inteiro</td> </tr>
  <tr>
    <th>Valor Padrão</th> <td><code>33062</code></td> </tr>
  <tr>
    <th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr>
    <th>Valor Máximo</th> <td><code>65535</code></td> </tr>
  </table>

  Nome do componente a ser invocado que fornece uma implementação do serviço de provedor de segredo. O conteúdo das seguintes variáveis de sistema é decodificado usando o componente especificado:

  + `telemetry.otel_exporter_otlp_traces_secret_headers`
  + `telemetry.otel_exporter_otlp_metrics_secret_headers`
  + `telemetry.otel_exporter_otlp_logs_secret_headers`
* `temptable_max_mmap`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Define a quantidade máxima de memória (em bytes) que o motor de armazenamento TempTable é permitido alocar a partir de arquivos temporários mapeados em memória antes de começar a armazenar dados em tabelas temporárias internas `InnoDB` no disco. Um ajuste de 0 (padrão) desativa a alocação de memória a partir de arquivos temporários mapeados em memória. Para mais informações, consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

  Antes do MySQL 8.4, essa opção era definida para 1 GiB em vez de 0.

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de Sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

  Define a quantidade máxima de memória que pode ser ocupada pelo motor de armazenamento `TempTable` antes de começar a armazenar dados no disco. O valor padrão é 3% da memória total disponível no servidor, com um intervalo padrão mínimo e máximo de 1-4 GiB. Para mais informações, consulte a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

  A variável de status `TempTable_count_hit_max_ram` conta o número de vezes que o motor `TempTable` atingiu o limite `temptable_max_ram`.

  Antes do MySQL 8.4, o valor padrão era sempre 1 GiB.

* `thread_cache_size`

<table frame="box" rules="all" summary="Propriedades para admin_port">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-port=port_num</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_port</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>33062</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>65535</code></td>
  </tr>
</table>

Quantos fios o servidor deve armazenar para reutilização. Quando um cliente se desconecta, os fios do cliente são colocados na cache se houver menos de `thread_cache_size` fios na cache. As solicitações de fios são atendidas reutilizando fios da cache, se possível, e apenas quando a cache estiver vazia é criado um novo fio. Essa variável pode ser aumentada para melhorar o desempenho se você tiver muitas novas conexões. Normalmente, isso não proporciona uma melhoria notável no desempenho se você tiver uma boa implementação de fios. No entanto, se o seu servidor receber centenas de conexões por segundo, você deve definir `thread_cache_size` o suficiente alto para que a maioria das novas conexões use fios armazenados na cache. Ao examinar a diferença entre as variáveis de status `Connections` e `Threads_created`, você pode ver o quão eficiente é a cache de fios. Para detalhes, consulte a Seção 7.1.10, “Variáveis de Status do Servidor”.

O valor padrão é baseado na seguinte fórmula, limitada a um limite de 100:

```
  MAX(
      (open_files_limit - 10 - max_connections) / 2,
      400
     )
  ```

* `thread_handling`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de Sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

O modelo de manipulação de threads usado pelo servidor para threads de conexão. Os valores permitidos são `no-threads` (o servidor usa um único thread para lidar com uma conexão), `one-thread-per-connection` (o servidor usa um thread para cada conexão de cliente) e `loaded-dynamically` (definido pelo plugin de pool de threads ao ser inicializado). `no-threads` é útil para depuração no Linux; veja a Seção 7.9, “Depuração do MySQL”.

* `thread_pool_algorithm`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de Sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>65535</code></td> </tr></tbody></table>

Esta variável controla qual algoritmo o plugin de pool de threads usa:

+ `0`: Use um algoritmo conservador de baixa concorrência.

+ `1`: Use um algoritmo agressivo de alta concorrência que funciona melhor com contagem ótima de threads, mas o desempenho pode ser degradado se o número de conexões atingir valores extremamente altos.

Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado. Consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

* `thread_pool_dedicated_listeners`

<table frame="box" rules="all" summary="Propriedades para admin_port"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-port=port_num</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_port</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>33062</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>65535</code></td> </tr></tbody></table>

Dedica um fio de escuta em cada grupo de fios para ouvir declarações recebidas de conexões atribuídas ao grupo.

+ `OFF`: (Padrão) Desabilita os fios de escuta dedicados.

+ `ON`: Dedica um fio de escuta em cada grupo de fios para ouvir declarações recebidas de conexões atribuídas ao grupo. Os fios de escuta dedicados não executam consultas.

Ativação de `thread_pool_dedicated_listeners` é útil apenas quando um limite de transação é definido por `thread_pool_max_transactions_limit`. Caso contrário, `thread_pool_dedicated_listeners` não deve ser ativado.

Esta variável está disponível apenas com a Edição Empresarial do MySQL e não é suportada no MySQL 9.5.

* `thread_pool_high_priority_connection`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-ca=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_ca</code></td>
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
    <th>Hinta de Sintaxe de Definição de Variável</th>
    <td><code>SET_VAR</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

Esta variável afeta a fila de espera de novas declarações antes da execução. Se o valor for 0 (falso, o padrão), a fila de espera de declarações usa tanto as filas de baixa prioridade quanto as de alta prioridade. Se o valor for 1 (verdadeiro), as declarações em fila sempre vão para a fila de alta prioridade.

Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado. Consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

* `thread_pool_longrun_trx_limit`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-ca=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_ca</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Quando o `thread_pool_max_transactions_limit` está em uso, há um número máximo de transações que podem estar ativas em cada grupo de threads. Se todo o número disponível estiver sendo usado por transações de longa duração, qualquer transação adicional atribuída ao grupo é bloqueada até que uma das transações de longa duração seja concluída, o que os usuários podem perceber como um travamento inexplicável.

  Para mitigar esse problema, o limite para um determinado grupo de threads é suspenso se todos os threads que estão consumindo o máximo de transações estiverem sendo executados por mais tempo do que o intervalo (em milissegundos) especificado por `thread_pool_longrun_trx_limit`. Quando o número de transações de longa duração diminui, o `thread_pool_max_transactions_limit` pode (e é) habilitado novamente. Para que isso aconteça, o número de transações em andamento deve ser menor que `thread_pool_max_transactions_limit / 2` para o intervalo definido, conforme mostrado:

  ```
  8 + (max_connections / 100)
  ```

O privilégio `CONNECTION_ADMIN` é necessário para configurar `thread_pool_longrun_trx_limit` em tempo de execução.

Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado. Consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

* `thread_pool_max_active_query_threads`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de sintaxe de definição de variável</th> <td><code>SET_VAR</code></a></td> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O número máximo permitido de threads de consulta ativos (em execução) por grupo. Se o valor for 0, o plugin de pool de threads usa até tantos threads quanto estiverem disponíveis.

  Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado. Consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

  O privilégio `CONNECTION_ADMIN` é necessário para configurar `thread_pool_max_active_query_threads` em tempo de execução.

* `thread_pool_max_transactions_limit`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=nome_do_arquivo</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmica</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
</table>

O número máximo de transações permitido pelo plugin de pool de threads. Definir um limite de transação vincula um thread a uma transação até que ela seja confirmada, o que ajuda a estabilizar o desempenho durante a alta concorrência.

O valor padrão de 0 significa que não há limite de transação. A variável é dinâmica, mas não pode ser alterada de 0 para um valor maior no tempo de execução e vice-versa. Um valor não nulo no início permite a configuração dinâmica no tempo de execução. O privilégio `CONNECTION_ADMIN` é necessário para configurar `thread_pool_max_transactions_limit` no tempo de execução.

Quando você define um limite de transação, a ativação de `thread_pool_dedicated_listeners` cria um thread de ouvinte dedicado em cada grupo de threads. O thread de ouvinte dedicado adicional consome mais recursos e afeta o desempenho do pool de threads. Portanto, `thread_pool_dedicated_listeners` deve ser usado com cautela.

Quando o limite definido por `thread_pool_max_transactions_limit` for atingido, novas conexões ou transações em conexões existentes podem parecer bloqueadas até que uma ou mais transações existentes sejam concluídas. Em muitos casos, é possível mitigar esse problema configurando `thread_pool_longrun_trx_limit` para que o máximo de transações possa ser relaxado quando o número de transações em andamento corresponder a ele por um determinado período de tempo. Se as conexões existentes continuarem bloqueadas ou a serem executadas por muito tempo mesmo após essa tentativa, pode ser necessário uma conexão privilegiada para acessar o servidor para aumentar o limite, remover o limite ou interromper as transações em execução. Consulte Conexões Privilegiadas.

Esta variável está disponível apenas na Edição Empresarial do MySQL e não é suportada no MySQL 9.5.

* `thread_pool_max_unused_threads`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O número máximo permitido de threads não utilizadas no pool de threads. Esta variável permite limitar a quantidade de memória usada por threads em espera.

Um valor de 0 (o padrão) significa que não há limite no número de threads de sono. Um valor de *`N`* onde *`N`* é maior que 0 significa 1 thread de consumidor e *`N`−1* threads de reserva. Neste caso, se um thread estiver pronto para dormir, mas o número de threads de sono já estiver no máximo, o thread sai em vez de dormir.

Um thread de sono está dormindo como um thread de consumidor ou um thread de reserva. O pool de threads permite que um thread seja o thread de consumidor ao dormir. Se um thread for colocado em sono e não houver um thread de consumidor existente, ele dorme como um thread de consumidor. Quando um thread precisa ser acordado, um thread de consumidor é selecionado, se houver um. Um thread de reserva é selecionado apenas quando não há um thread de consumidor para ser acordado.

Esta variável está disponível apenas se o plugin do pool de threads estiver habilitado. Veja a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

* `thread_pool_prio_kickup_timer`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

Esta variável afeta as declarações que estão aguardando execução na fila de baixa prioridade. O valor é o número de milissegundos antes que uma declaração em espera seja movida para a fila de alta prioridade. O valor padrão é 1000 (1 segundo).

Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado. Consulte a Seção 7.6.3, “Pool de Threads do MySQL Enterprise”.

* `thread_pool_query_threads_per_group`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O número máximo de threads de consulta permitidos em um grupo de threads. O valor máximo é 4096, mas se `thread_pool_max_transactions_limit` estiver definido, `thread_pool_query_threads_per_group` não deve exceder esse valor.

  O valor padrão de 1 significa que há um único thread de consulta ativo em cada grupo de threads, o que funciona bem para muitas cargas de trabalho. Quando você estiver usando o algoritmo de pool de threads de alta concorrência (`thread_pool_algorithm = 1`), considere aumentar o valor se você estiver experimentando tempos de resposta mais lentos devido a transações de longa duração.

O privilégio `CONNECTION_ADMIN` é necessário para configurar `thread_pool_query_threads_per_group` em tempo de execução.

Se você diminuir o valor de `thread_pool_query_threads_per_group` em tempo de execução, os threads que estão executando consultas de usuário atualmente são permitidos a concluir, depois movidos para o pool de reserva ou terminados. Se você aumentar o valor em tempo de execução e o grupo de threads precisar de mais threads, esses são tomados do pool de reserva, se possível, caso contrário, são criados.

Esta variável está disponível apenas com a Edição Empresarial do MySQL e não é suportada no MySQL 9.5.

* `thread_pool_size`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O número de grupos de threads no pool de threads. Este é o parâmetro mais importante que controla o desempenho do pool de threads. Isso afeta quantos comandos podem ser executados simultaneamente. Se um valor fora do intervalo de valores permitidos for especificado, o plugin do pool de threads não é carregado e o servidor escreve uma mensagem no log de erro.

  Nota

Iniciar o servidor com `--thread-pool-size=0` inicia o servidor com `--thread-pool-size=1`

Para desabilitar o plugin do Pool de Threads, você deve executar o servidor com `--thread-pool-size=OFF`.

Esta variável está disponível apenas se o plugin do Pool de Threads estiver habilitado. Consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”.

* `thread_pool_stall_limit`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

Esta variável afeta a execução de instruções. O valor é o tempo que uma instrução tem para terminar após começar a ser executada antes de ser definida como parada, momento em que o pool de threads permite que o grupo de threads comece a executar outra instrução. O valor é medido em unidades de 10 milissegundos, então o valor padrão de 6 significa 60ms. Valores de espera curtos permitem que os threads comecem mais rapidamente. Valores curtos também são melhores para evitar situações de deadlock. Valores de espera longos são úteis para cargas de trabalho que incluem instruções de longa duração, para evitar iniciar muitas novas instruções enquanto as atuais executam.

Esta variável está disponível apenas se o plugin de pool de threads estiver habilitado. Veja a Seção 7.6.3, “Pool de Threads do MySQL Enterprise”.

* `thread_pool_transaction_delay`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O período de atraso antes de executar uma nova transação, em milissegundos. O valor máximo é 300000 (5 minutos).

  O atraso de transação pode ser usado em casos em que transações paralelas afetam o desempenho de outras operações devido à concorrência de recursos. Por exemplo, se transações paralelas afetarem a criação de índices ou uma operação de redimensionamento do pool de buffers online, você pode configurar um atraso de transação para reduzir a concorrência de recursos enquanto essas operações estão em execução.

  Os threads do trabalhador dormem por o número de milissegundos especificado por `thread_pool_transaction_delay` antes de executar uma nova transação.

  O ajuste `thread_pool_transaction_delay` não afeta as consultas emitidas a partir de uma conexão privilegiada (uma conexão atribuída ao grupo de threads `Admin`). Essas consultas não estão sujeitas a um atraso de transação configurado.

O privilégio `CONNECTION_ADMIN` é necessário para configurar `thread_pool_transaction_delay` em tempo de execução.

* `thread_stack`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></table>

  O tamanho da pilha para cada thread. O padrão é grande o suficiente para o funcionamento normal. Se o tamanho da pilha de thread for muito pequeno, isso limita a complexidade das instruções SQL que o servidor pode processar, a profundidade de recursão de procedimentos armazenados e outras ações que consomem memória.

* `time_zone`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-ca=nome_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_ca</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  O fuso horário atual. Esta variável é usada para inicializar o fuso horário para cada cliente que se conecta. Por padrão, o valor inicial desta é `'SYSTEM'` (o que significa, “usar o valor de `system_time_zone`”). O valor pode ser especificado explicitamente na inicialização do servidor com a opção `--default-time-zone`. Veja a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL”.

  Nota

  Se definido como `SYSTEM`, cada chamada de função MySQL que requer um cálculo de fuso horário faz uma chamada à biblioteca do sistema para determinar o fuso horário do sistema atual. Essa chamada pode ser protegida por um mutex global, resultando em disputa.

* `timestamp`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-ca=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_ca</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

12. Defina o tempo para este cliente. Isso é usado para obter o timestamp original se você usar o log binário para restaurar linhas. *`timestamp_value`* deve ser um timestamp de epoch Unix (um valor como o retornado por `UNIX_TIMESTAMP()`, não um valor no formato `'YYYY-MM-DD hh:mm:ss'`).

Definir `timestamp` para um valor constante faz com que ele retorne esse valor até que seja alterado novamente. Definir `timestamp` para `DEFAULT` faz com que seu valor seja a data e hora atuais na hora em que é acessado.

`timestamp` é um `DOUBLE` em vez de `BIGINT` porque seu valor inclui uma parte em microsegundos. O valor máximo corresponde a `'2038-01-19 03:14:07'` UTC, o mesmo que para o tipo de dados `TIMESTAMP`.

`SET timestamp` afeta o valor retornado por `NOW()` mas não por `SYSDATE()`. Isso significa que as configurações de temporizador no log binário não têm efeito nas invocações de `SYSDATE()`. O servidor pode ser iniciado com a opção `--sysdate-is-now` para fazer com que `SYSDATE()` seja sinônimo de `NOW()`, caso em que `SET timestamp` afeta ambas as funções.

* `tls_certificates_enforced_validation`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Durante a inicialização, o servidor garante que a localização de cada arquivo de certificado SSL necessário esteja presente no diretório de dados padrão, se as localizações dos arquivos não forem fornecidas na linha de comando. No entanto, o servidor não valida os arquivos de certificado e, como resultado, é capaz de iniciar com um certificado inválido. A variável de sistema `tls_certificates_enforced_validation` controla se a validação de certificados é aplicada na inicialização. O descobrimento de um certificado inválido interrompe a execução da inicialização quando a aplicação da validação é habilitada. Por padrão, a aplicação da validação de certificados é desabilitada (`OFF`).

A execução da validação pode ser habilitada especificando a opção `--tls-certificates-enforced-validation` na linha de comando com ou sem o valor `ON`. Com a validação da certificação habilitada, as certificações também são validadas no momento da recarga delas através da instrução `ALTER INSTANCE RELOAD TLS`. Essa variável de sistema não pode ser persistente após reinicializações. Para mais informações, consulte Configurando a Execução da Validação de Certificados.

* `tls_ciphersuites`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Quais ciphersuites o servidor permite para conexões criptografadas que usam TLSv1.3. O valor é uma lista de zero ou mais nomes de ciphersuites separados por vírgula, entre os listados aqui:

  + `TLS_AES_128_GCM_SHA256`
  + `TLS_AES_256_GCM_SHA384`
  + `TLS_CHACHA20_POLY1305_SHA256`
  + `TLS_AES_128_CCM_SHA256`

  Tentar incluir quaisquer valores na lista de cifra que não sejam mostrados aqui ao configurar essa variável gera um erro (`ER_BLOCKED_CIPHER`).

As suítes de cifra que podem ser nomeadas para essa variável dependem da biblioteca SSL usada para compilar o MySQL. Se essa variável não for definida, seu valor padrão é `NULL`, o que significa que o servidor permite o conjunto padrão de suítes de cifra. Se a variável for definida como uma string vazia, nenhuma suítes de cifra é habilitada e conexões criptografadas não podem ser estabelecidas. Para mais informações, consulte a Seção 8.3.2, “Protocolos e Suítes de Cifra de Conexão Encriptada”.

* `tls_version`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Quais protocolos o servidor permite para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula, que não são case-sensitive. Os protocolos que podem ser nomeados para essa variável dependem da biblioteca SSL usada para compilar o MySQL. Os protocolos permitidos devem ser escolhidos de forma a não deixar “buracos” na lista. Para detalhes, consulte a Seção 8.3.2, “Protocolos e Suítes de Cifra de Conexão Encriptada”.

Essa variável pode ser modificada em tempo de execução para afetar o contexto TLS que o servidor usa para novas conexões. Veja Configuração e Monitoramento em Tempo de Execução no Servidor para Conexões Encriptadas.

Importante

+ O MySQL 9.5 não suporta os protocolos de conexão TLSv1 e TLSv1.1. Veja Remoção do Suporte aos Protocolos TLSv1 e TLSv1.1 para mais informações.

+ O suporte ao protocolo TLSv1.3 está disponível no MySQL 9.5, desde que o MySQL Server tenha sido compilado usando OpenSSL 1.1.1 ou superior. O servidor verifica a versão do OpenSSL no início e, se for menor que 1.1.1, o TLSv1.3 é removido do valor padrão da variável do sistema. Nesse caso, o padrão é `TLSv1.2`.

Definir essa variável para uma string vazia desativa as conexões encriptadas.

* `tmp_table_size`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

Define o tamanho máximo de tabelas temporárias internas de memória criadas pelos motores de armazenamento `MEMORY` e `TempTable`. Se uma tabela temporária interna de memória exceder esse tamanho, ela é automaticamente convertida em uma tabela temporária interna em disco.

A variável `tmp_table_size` não se aplica a tabelas `MEMORY` criadas pelo usuário. As tabelas `TempTable` criadas pelo usuário não são suportadas.

Ao usar o motor de armazenamento `MEMORY` para tabelas temporárias internas de memória, o limite de tamanho real é o menor entre `tmp_table_size` e `max_heap_table_size`. O ajuste `max_heap_table_size` não se aplica às tabelas `TempTable`.

Aumente o valor de `tmp_table_size` (e `max_heap_table_size`, se necessário, ao usar o motor de armazenamento `MEMORY` para tabelas temporárias internas de memória) se você fizer muitas consultas avançadas de `GROUP BY` e tiver muita memória.

A variável de status `Count_hit_tmp_table_size` conta o número de tabelas temporárias internas que foram convertidas de memória para disco devido ao atingimento de limites de tamanho para o motor de armazenamento `TempTable` ou `MEMORY`.

Você pode comparar o número de tabelas temporárias internas em disco criadas com o número total de tabelas temporárias internas criadas comparando os valores de `Created_tmp_disk_tables` e `Created_tmp_tables`.

Veja também a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

* `tmpdir`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmica</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
</table>

O caminho do diretório a ser usado para criar arquivos temporários. Isso pode ser útil se o diretório padrão `/tmp` estiver em uma partição que é muito pequena para armazenar tabelas temporárias. Essa variável pode ser definida como uma lista de vários caminhos que são usados de forma round-robin. Os caminhos devem ser separados por colchetes (`) no Unix e por pontos e vírgulas (`;`) no Windows.

`tmpdir` pode ser um local não permanente, como um diretório em um sistema de arquivos baseado em memória ou um diretório que é limpo quando o host do servidor é reiniciado. Se o servidor MySQL estiver atuando como uma replica e você estiver usando um local não permanente para `tmpdir`, considere definir um diretório temporário diferente para a replica usando a variável `replica_load_tmpdir`. Para uma replica, os arquivos temporários usados para replicar as instruções `LOAD DATA` são armazenados neste diretório, então, com um local permanente, eles podem sobreviver a reinicializações de máquina, embora a replicação possa continuar após um reinício se os arquivos temporários tiverem sido removidos.

Para mais informações sobre o local de armazenamento dos arquivos temporários, consulte a Seção B.3.3.5, “Onde o MySQL Armazena Arquivos Temporários”.

* `transaction_alloc_block_size`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

A quantidade em bytes pela qual aumentar um pool de memória por transação que precisa de memória. Veja a descrição de `transaction_prealloc_size`.

* `transaction_isolation`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-ca=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_ca</code></td>
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
    <th>Hinta de <code>SET_VAR</th></th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  O nível de isolamento de transação. O padrão é `REPEATABLE-READ`.

  O nível de isolamento de transação tem três escopos: global, sessão e próxima transação. Essa implementação de três escopos leva a algumas semânticas de atribuição de nível de isolamento não padrão, conforme descrito mais adiante.

  Para definir o nível de isolamento de transação global no início, use a opção de servidor `--transaction-isolation`.

  Em tempo de execução, o nível de isolamento pode ser definido diretamente usando a instrução `SET` para atribuir um valor à variável de sistema `transaction_isolation`, ou indiretamente usando a instrução `SET TRANSACTION`. Se você definir `transaction_isolation` diretamente para um nome de nível de isolamento que contenha um espaço, o nome deve ser colocado entre aspas, com o espaço substituído por uma barra. Por exemplo, use esta instrução `SET` para definir o valor global:

  ```
  MIN( MAX(thread_pool_longrun_trx_limit * 15, 5000), 30000)
  ```

  Definir o valor global de `transaction_isolation` define o nível de isolamento para todas as sessões subsequentes. As sessões existentes não são afetadas.

Para definir o valor da sessão ou do nível de `transaction_isolation`, use a instrução `SET`. Para a maioria das variáveis de sistema de sessão, essas instruções são maneiras equivalentes de definir o valor:

```
  SET GLOBAL transaction_isolation = 'READ-COMMITTED';
  ```

Como mencionado anteriormente, o nível de isolamento de transação tem um escopo de transação subsequente, além dos escopos global e de sessão. Para habilitar o escopo de transação subsequente, a sintaxe `SET` para atribuir valores às variáveis de sistema de sessão tem semântica não padrão para `transaction_isolation`:

+ Para definir o nível de isolamento de sessão, use qualquer uma dessas sintaxes:

    ```
  SET @@SESSION.var_name = value;
  SET SESSION var_name = value;
  SET var_name = value;
  SET @@var_name = value;
  ```

    Para cada uma dessas sintaxes, essas semânticas se aplicam:

    - Define o nível de isolamento para todas as transações subsequentes realizadas dentro da sessão.

    - Permitido dentro de transações, mas não afeta a transação atual em andamento.

    - Se executado entre transações, substitui qualquer declaração anterior que defina o nível de isolamento de transação subsequente.

    - Corresponde a `SET SESSION TRANSACTION ISOLATION LEVEL` (com a palavra-chave `SESSION`).

+ Para definir o nível de isolamento de transação subsequente, use esta sintaxe:

    ```
    SET @@SESSION.transaction_isolation = value;
    SET SESSION transaction_isolation = value;
    SET transaction_isolation = value;
    ```

    Para essa sintaxe, essas semânticas se aplicam:

    - Define o nível de isolamento apenas para a próxima transação única realizada dentro da sessão.

    - Transações subsequentes retornam ao nível de isolamento de sessão.

    - Não permitido dentro de transações.
    - Corresponde a `SET TRANSACTION ISOLATION LEVEL` (sem a palavra-chave `SESSION`).

Para mais informações sobre `SET TRANSACTION` e sua relação com a variável de sistema `transaction_isolation`, consulte a Seção 15.3.7, “Instrução SET TRANSACTION”.

* `transaction_prealloc_size`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=nome_do_arquivo</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmica</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr>
</table>

20

Há um pool de memória por transação a partir do qual várias alocações relacionadas à transação pegam memória. O tamanho inicial do pool em bytes é `transaction_prealloc_size`. Para cada alocação que não pode ser atendida do pool porque tem memória insuficiente disponível, o pool é aumentado em `transaction_alloc_block_size` bytes. Quando a transação termina, o pool é truncado para `transaction_prealloc_size` bytes. Ao fazer `transaction_prealloc_size` suficientemente grande para conter todas as instruções dentro de uma única transação, você pode evitar muitas chamadas de `malloc()`.

`transaction_prealloc_size` é desatualizado e definir essa variável não tem mais efeito. Espere `transaction_prealloc_size` ser removido em uma futura versão do MySQL.

* `transaction_read_only`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-ssl-ca=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_ssl_ca</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  O modo de acesso à transação. O valor pode ser `OFF` (leitura/escrita; o padrão) ou `ON` (leitura apenas).

  O modo de acesso à transação tem três escopos: global, sessão e próxima transação. Essa implementação de três escopos leva a algumas semânticas de atribuição de modo de acesso não padrão, conforme descrito mais adiante.

  Para definir o modo de acesso à transação global no início, use a opção de servidor `--transaction-read-only`.

  Em tempo de execução, o modo de acesso pode ser definido diretamente usando a instrução `SET` para atribuir um valor à variável de sistema `transaction_read_only`, ou indiretamente usando a instrução `SET TRANSACTION`. Por exemplo, use esta instrução `SET` para definir o valor global:

  ```
    SET @@transaction_isolation = value;
    ```

  Definir o valor global de `transaction_read_only` define o modo de acesso para todas as sessões subsequentes. As sessões existentes não são afetadas.

  Para definir o valor de `transaction_read_only` de sessão ou nível subsequente, use a instrução `SET`. Para a maioria das variáveis de sistema de sessão, essas instruções são maneiras equivalentes de definir o valor:

Como mencionado anteriormente, o modo de acesso à transação tem um escopo de próxima transação, além dos escopos global e de sessão. Para habilitar o escopo de próxima transação, a sintaxe `SET` para atribuir valores às variáveis de sistema de sessão tem semântica não padrão para `transaction_read_only`,

+ Para definir o modo de acesso de sessão, use qualquer uma dessas sintaxes:

    ```
  SET GLOBAL transaction_read_only = ON;
  ```

    Para cada uma dessas sintaxes, essas semânticas se aplicam:

    - Define o modo de acesso para todas as transações subsequentes realizadas dentro da sessão.

    - Permitido dentro de transações, mas não afeta a transação em andamento atual.

    - Se executado entre transações, substitui qualquer declaração anterior que defina o modo de acesso de próxima transação.

    - Corresponde a `SET SESSION TRANSACTION {READ WRITE | READ ONLY}` (com a palavra-chave `SESSION`).

+ Para definir o modo de acesso de próxima transação, use esta sintaxe:

    ```
  SET @@SESSION.var_name = value;
  SET SESSION var_name = value;
  SET var_name = value;
  SET @@var_name = value;
  ```

    Para essa sintaxe, essas semânticas se aplicam:

    - Define o modo de acesso apenas para a próxima única transação realizada dentro da sessão.

    - Transações subsequentes retornam ao modo de acesso de sessão.

    - Não permitido dentro de transações.
    - Corresponde a `SET TRANSACTION {READ WRITE | READ ONLY}` (sem a palavra-chave `SESSION`).

Para mais informações sobre `SET TRANSACTION` e sua relação com a variável de sistema `transaction_read_only`, consulte a Seção 15.3.7, “Instrução SET TRANSACTION”.

* `unique_checks`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-ca=file_name</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_ca</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Se definido para 1 (o padrão), as verificações de unicidade para índices secundários em tabelas `InnoDB` são realizadas. Se definido para 0, os mecanismos de armazenamento são autorizados a assumir que chaves duplicadas não estão presentes nos dados de entrada. Se você tem certeza de que seus dados não contêm violações de unicidade, pode definir isso para 0 para acelerar a importação de grandes tabelas para `InnoDB`.

  Definir essa variável para 0 não *obriga* os mecanismos de armazenamento a ignorar chaves duplicadas. Um mecanismo ainda é autorizado a verificá-las e emitir erros de chave duplicada se detectá-las.

* `updatable_views_with_limit`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--admin-ssl-ca=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code>admin_ssl_ca</code></td>
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
    <th>Hinta de <code>SET_VAR</th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Esta variável controla se atualizações para uma visualização podem ser feitas quando a visualização não contém todas as colunas da chave primária definida na tabela subjacente, se a instrução de atualização contiver uma cláusula `LIMIT`. (Tais atualizações são frequentemente geradas por ferramentas de GUI.) Uma atualização é uma instrução `UPDATE` ou `DELETE`. Chave primária aqui significa uma `PRIMARY KEY`, ou um índice `UNIQUE` no qual nenhuma coluna pode conter `NULL`.

  A variável pode ter dois valores:

  + `1` ou `YES`: Emitir uma mensagem de aviso apenas (não uma mensagem de erro). Este é o valor padrão.

  + `0` ou `NO`: Proibir a atualização.

* `use_secondary_engine`

  Para uso apenas com MySQL HeatWave. Consulte Variáveis do sistema, para mais informações.

* `validate_password.xxx`

  O componente `validate_password` implementa um conjunto de variáveis do sistema com nomes na forma `validate_password.xxx`. Essas variáveis afetam o teste de senha por esse componente; consulte Seção 8.4.4.2, “Opções e variáveis de validação de senha”.

* `version`

O número da versão do servidor. O valor também pode incluir um sufixo que indica informações de compilação ou configuração do servidor. `-debug` indica que o servidor foi compilado com o suporte de depuração habilitado.

* `version_comment`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=nome_arquivo</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</code> Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

O programa de configuração **CMake** tem uma opção `COMPILATION_COMMENT_SERVER` que permite especificar um comentário ao compilar o MySQL. Essa variável contém o valor desse comentário.

* `version_compile_machine`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-ca=nome_do_arquivo</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O tipo do binário do servidor.

* `version_compile_os`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-ca=nome_do_arquivo</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O tipo do sistema operacional em que o MySQL foi compilado.

* `version_compile_zlib`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-ca=nome_do_arquivo</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Sugestão de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></table>

  A versão da biblioteca `zlib` integrada.

* `wait_timeout`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tr><th>Formato de linha de comando</th> <td><code>--admin-ssl-ca=nome_do_arquivo</code></td> </tr><tr><th>Variável do sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Sugestão de sintaxe para <code>SET_VAR</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></table>

  O número de segundos que o servidor espera por atividade em uma conexão não interativa antes de fechá-la.

Ao iniciar o thread, o valor da sessão `wait_timeout` é inicializado a partir do valor global `wait_timeout` ou do valor global `interactive_timeout`, dependendo do tipo de cliente (definido pela opção de conexão `CLIENT_INTERACTIVE` para `mysql_real_connect()`). Veja também `interactive_timeout`.

* `warning_count`

  O número de erros, avisos e notas resultantes da última instrução que gerou mensagens. Essa variável é somente de leitura. Veja a Seção 15.7.7.43, “Instrução SHOW WARNINGS”.

* `windowing_use_high_precision`

  <table frame="box" rules="all" summary="Propriedades para admin_ssl_ca"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--admin-ssl-ca=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>admin_ssl_ca</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Se os cálculos das operações de janela devem ser realizados sem perda de precisão. Veja a Seção 10.2.1.21, “Otimização da Função de Janela”.

* `xa_detach_on_prepare`

<table frame="box" rules="all" summary="Propriedades para admin_ssl_ca">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--admin-ssl-ca=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code>admin_ssl_ca</code></td>
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
    <th>Hinta de <code>SET_VAR</code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Quando configurado para `ON` (ativado), todas as transações XA são desconectadas (desconectadas) da conexão (sessão) como parte do `XA PREPARE`. Isso significa que a transação XA pode ser confirmada ou revertida por outra conexão, mesmo que a conexão original não tenha sido encerrada, e essa conexão pode iniciar novas transações.

  Tabelas temporárias não podem ser usadas dentro de transações XA desconectadas.

  Quando configurado para `OFF` (desativado), uma transação XA é estritamente associada à mesma conexão até que a sessão se desconecte. Recomenda-se que você ative (o comportamento padrão) para a replicação.

  Para mais informações, consulte a Seção 15.3.8.2, “Estados de Transações XA”.