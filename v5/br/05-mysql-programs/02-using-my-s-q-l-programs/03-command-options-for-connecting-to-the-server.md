### 4.2.3 Opções de comando para conectar ao servidor

Esta seção descreve as opções suportadas pela maioria dos programas clientes do MySQL que controlam como os programas clientes estabelecem conexões com o servidor e se as conexões são criptografadas. Essas opções podem ser fornecidas na linha de comando ou em um arquivo de opções.

- Opções de comando para estabelecimento de conexão
- Opções de comando para conexões criptografadas

#### Opções de comando para estabelecimento de conexão

Esta seção descreve as opções que controlam a forma como os programas cliente estabelecem conexões com o servidor. Para obter informações adicionais e exemplos de como usá-las, consulte a Seção 4.2.4, “Conectando-se ao Servidor MySQL Usando Opções de Comando”.

**Tabela 4.4 Resumo da Opção de Estabelecimento de Conexão**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para estabelecer conexões com o servidor."><col style="width: 31%"/><col style="width: 56%"/><col style="width: 12%"/><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Desatualizado</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="connection-options.html#option_general_default-auth">--default-auth</a></th> <td>Plugin de autenticação a ser usado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_host">--host</a></th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_password">--senha</a></th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_pipe">--pipe</a></th> <td>Conecte-se ao servidor usando o pipe nomeado (apenas Windows)</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_plugin-dir">--plugin-dir</a></th> <td>Diretório onde os plugins são instalados</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_port">--port</a></th> <td>Número de porta TCP/IP para a conexão</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_protocol">--protocolo</a></th> <td>Protocolo de transporte a ser utilizado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_secure-auth">--secure-auth</a></th> <td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_shared-memory-base-name">--shared-memory-base-name</a></th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_socket">--socket</a></th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_user">--user</a></th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> </tr></tbody></table>

- `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost</code>]]</td> </tr></tbody></table>

  O host em que o servidor MySQL está rodando. O valor pode ser um nome de host, endereço IPv4 ou endereço IPv6. O valor padrão é `localhost`.

- `--password[=pass_val]`, `-p[pass_val]`

  <table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--password[=passwor<code class="literal">[none]</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o programa cliente solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o programa cliente não deve solicitar uma senha, use a opção `--skip-password`.

- `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para tubulação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--pipe</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para plugin-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--plugin-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o programa cliente não encontrá-lo. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para porto"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--port=port_num</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">3306</code>]]</td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado. O número de porta padrão é 3306.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para protocolo"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--protocol=type</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[see tex<code class="literal">TCP</code></code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code class="literal">TCP</code>]]</p><p class="valid-value">[[<code class="literal">SOCKET</code>]]</p><p class="valid-value">[[<code class="literal">PIPE</code>]]</p><p class="valid-value">[[<code class="literal">MEMORY</code>]]</p></td> </tr></tbody></table>

  Esta opção especifica explicitamente qual protocolo de transporte usar para se conectar ao servidor. É útil quando outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Por exemplo, as conexões no Unix para `localhost` são feitas usando um arquivo de socket Unix por padrão:

  ```sql
  mysql --host=localhost
  ```

  Para forçar o uso do transporte TCP/IP em vez disso, especifique uma opção `--protocol`:

  ```sql
  mysql --host=localhost --protocol=TCP
  ```

  A tabela a seguir mostra os valores permitidos da opção `--protocol` e indica as plataformas aplicáveis para cada valor. Os valores não são sensíveis ao caso.

  <table summary="Valores do protocolo de transporte permitidos, o protocolo de transporte utilizado como resultado e as plataformas aplicáveis para cada valor."><col style="width: 20%"/><col style="width: 50%"/><col style="width: 30%"/><thead><tr> <th scope="col"><a class="link" href="connection-options.html#option_general_protocol">[[<code class="option">--protocol</code>]]</a>Valor</th> <th scope="col">Protocolo de transporte utilizado</th> <th scope="col">Plataformas aplicáveis</th> </tr></thead><tbody><tr> <th scope="row">[[<code class="literal">TCP</code>]]</th> <td>Transporte TCP/IP para servidor local ou remoto</td> <td>Tudo</td> </tr><tr> <th scope="row">[[<code class="literal">SOCKET</code>]]</th> <td>Transporte de arquivo de soquete Unix para servidor local</td> <td>Unix e sistemas semelhantes ao Unix</td> </tr><tr> <th scope="row">[[<code class="literal">PIPE</code>]]</th> <td>Transporte de tubos nomeados para servidor local</td> <td>Windows</td> </tr><tr> <th scope="row">[[<code class="literal">MEMORY</code>]]</th> <td>Transporte de memória compartilhada para servidor local</td> <td>Windows</td> </tr></tbody></table>

  Veja também a Seção 4.2.5, “Protocolos de Transporte de Conexão”

- `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para autenticação segura"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--secure-auth</code>]]</td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>

  Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

  A partir do MySQL 5.7.5, essa opção é desaconselhada; espere-se que ela seja removida em uma futura versão do MySQL. Ela está sempre habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

  Nota

  Senhas que usam o método de hashing pré-4.1 são menos seguras do que senhas que usam o método de hashing de senha nativo e devem ser evitadas. Senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

- `--shared-memory-base-name=nome`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada com um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é case-sensitive.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  Em Unix, o nome do arquivo de soquete Unix a ser usado para conexões feitas usando um tubo nomeado para um servidor local. O nome padrão do arquivo de soquete Unix é `/tmp/mysql.sock`.

  No Windows, o nome do pipe nomeado a ser usado para conexões a um servidor local. O nome padrão do pipe do Windows é `MySQL`. O nome do pipe não é case-sensitive.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor. O nome de usuário padrão é `ODBC` no Windows ou o nome de login do Unix no Unix.

#### Opções de comando para conexões criptografadas

Esta seção descreve as opções para programas cliente que especificam se devem ser usadas conexões criptografadas com o servidor, os nomes dos arquivos de certificado e chave, e outros parâmetros relacionados ao suporte de conexões criptografadas. Para exemplos de uso sugerido e como verificar se uma conexão está criptografada, consulte a Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.

Nota

Essas opções têm efeito apenas para conexões que utilizam um protocolo de transporte sujeito à criptografia; ou seja, conexões TCP/IP e Unix socket-file. Veja a Seção 4.2.5, “Protocolos de Transporte de Conexão”

Para obter informações sobre o uso de conexões criptografadas a partir da API C do MySQL, consulte Suporte para Conexões Criptografadas.

**Tabela 4.5 Resumo da opção de criptografia de conexão**

<table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

- `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Conectada SHA-2”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

- `--server-public-key-path=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Esta opção está disponível apenas se o MySQL foi construído com o OpenSSL.

  Para obter informações sobre os módulos `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação com Pluggable SHA-256” e a Seção 6.4.1.4, “Cache de Autenticação com Pluggable SHA-2”.

- `--ssl`, `--skip-ssl`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  Nota

  A opção `--ssl` do lado do cliente é desaconselhada a partir do MySQL 5.7.11 e será removida no MySQL 8.0. Para programas cliente, use `--ssl-mode` em vez disso:

  - Use `--ssl-mode=REQUIRED` em vez de `--ssl=1` ou `--enable-ssl`.

  - Use `--ssl-mode=DESATIVADO` em vez de `--ssl=0`, `--skip-ssl` ou `--disable-ssl`.

  - A opção `--ssl-mode` explícita não é equivalente à opção `--ssl` explícita.

  A opção `--ssl` no lado do servidor *não* está desatualizada.

  Por padrão, os programas clientes do MySQL tentam estabelecer uma conexão criptografada se o servidor suportar conexões criptografadas, com controle adicional disponível através da opção `--ssl`: A opção `--ssl` do lado do cliente funciona da seguinte forma:

  - Na ausência da opção `--ssl`, os clientes tentam se conectar usando criptografia, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida.

  - A presença de uma opção explícita `--ssl` ou um sinônimo (`--ssl=1`, `--enable-ssl`) é prescritiva: os clientes exigem uma conexão criptografada e falham se não puderem ser estabelecidas.

  - Com a opção `--ssl=0` ou um sinônimo (`--skip-ssl`, `--disable-ssl`), os clientes usam uma conexão não criptografada.

  Para exigir o uso de conexões criptografadas por uma conta MySQL, use `CREATE USER` para criar a conta com uma cláusula `REQUIRE SSL`, ou use `ALTER USER` para uma conta existente para adicionar uma cláusula `REQUIRE SSL`. Isso faz com que as tentativas de conexão por clientes que usam a conta sejam rejeitadas, a menos que o MySQL suporte conexões criptografadas e uma conexão criptografada possa ser estabelecida.

  A cláusula `REQUIRE` permite outras opções relacionadas à criptografia, que podem ser usadas para impor requisitos de segurança mais rigorosos do que `REQUIRE SSL`. Para obter detalhes adicionais sobre quais opções de comando podem ou devem ser especificadas por clientes que se conectam usando contas configuradas usando as várias opções `REQUIRE`, consulte Opções de CREATE USER SSL/TLS.

  Para especificar parâmetros adicionais para conexões criptografadas, considere definir pelo menos as variáveis de sistema `ssl_cert` e `ssl_key` no lado do servidor e a opção `--ssl-ca` no lado do cliente. Veja a Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”, que também descreve as capacidades do servidor para autogeração e autodescoberta de arquivos de certificado e chave.

- `--ssl-ca=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA) no formato PEM. O arquivo contém uma lista de Autoridades de Certificação SSL confiáveis.

  Para informar ao cliente que não deve autenticar o certificado do servidor ao estabelecer uma conexão criptografada com o servidor, não especifique `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente e ainda usa quaisquer valores das variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

  Para especificar o arquivo CA do servidor, defina a variável de sistema `ssl_ca`.

- `--ssl-capath=dir_name`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  O nome do caminho do diretório que contém os arquivos de certificado da autoridade de certificação SSL (CA) confiável no formato PEM. O suporte para essa capacidade depende da biblioteca SSL usada para compilar o MySQL; consulte a Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.

  Para informar ao cliente que não deve autenticar o certificado do servidor ao estabelecer uma conexão criptografada com o servidor, não especifique `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente e ainda usa quaisquer valores das variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

  Para especificar o diretório CA do servidor, defina a variável de sistema `ssl_capath`.

- `--ssl-cert=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost</code>]]</td> </tr></tbody></table>0

  O nome do caminho do arquivo de certificado público de SSL do cliente no formato PEM.

  Para especificar o arquivo de certificado da chave pública SSL do servidor, defina a variável de sistema `ssl_cert`.

- `--ssl-cipher=cipher_list`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost</code>]]</td> </tr></tbody></table>1

  A lista de cifra permitida para a criptografia da conexão. Se nenhuma cifra na lista for suportada, as conexões criptografadas não funcionarão.

  Para maior portabilidade, *`cipher_list`* deve ser uma lista de um ou mais nomes de cifra, separados por colchetes. Esse formato é compreendido tanto pelo OpenSSL quanto pelo yaSSL. Exemplos:

  ```sql
  --ssl-cipher=AES128-SHA
  --ssl-cipher=DHE-RSA-AES128-GCM-SHA256:AES128-SHA
  ```

  O OpenSSL suporta uma sintaxe mais flexível para especificar cifra, conforme descrito na documentação do OpenSSL em <https://www.openssl.org/docs/manmaster/man1/ciphers.html>. O yaSSL não suporta essa sintaxe estendida, portanto, tentativas de usar essa sintaxe estendida falham para uma distribuição do MySQL compilada com o yaSSL.

  Para obter informações sobre os criptogramas de encriptação suportados pelo MySQL, consulte a Seção 6.3.2, “Protocolos e criptogramas de conexão TLS encriptados”.

  Para especificar os criptogramas de criptografia para o servidor, defina a variável de sistema `ssl_cipher`.

- `--ssl-crl=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost</code>]]</td> </tr></tbody></table>2

  O nome do caminho do arquivo que contém as listas de revogação de certificados no formato PEM. O suporte para a capacidade de listas de revogação depende da biblioteca SSL usada para compilar o MySQL. Consulte a Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.

  Se não for fornecido o parâmetro `--ssl-crl` nem `--ssl-crlpath`, não serão realizadas verificações de CRL, mesmo que o caminho da CA contenha listas de revogação de certificados.

  Para especificar o arquivo da lista de revogação para o servidor, defina a variável de sistema `ssl_crl`.

- `--ssl-crlpath=dir_name`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost</code>]]</td> </tr></tbody></table>3

  O nome do caminho do diretório que contém arquivos da lista de revogação de certificados no formato PEM. O suporte para a capacidade de lista de revogação depende da biblioteca SSL usada para compilar o MySQL. Consulte a Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.

  Se não for fornecido o parâmetro `--ssl-crl` nem `--ssl-crlpath`, não serão realizadas verificações de CRL, mesmo que o caminho da CA contenha listas de revogação de certificados.

  Para especificar o diretório da lista de revogação para o servidor, defina a variável de sistema `ssl_crlpath`.

- `--ssl-key=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost</code>]]</td> </tr></tbody></table>4

  O nome do caminho do arquivo de chave privada SSL do cliente no formato PEM. Para maior segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

  Se o arquivo de chave estiver protegido por uma senha, o programa cliente solicita ao usuário a senha. A senha deve ser fornecida interativamente; ela não pode ser armazenada em um arquivo. Se a senha estiver incorreta, o programa continua como se não conseguisse ler a chave.

  Para especificar o arquivo de chave privada SSL do servidor, defina a variável de sistema `ssl_key`.

- `--ssl-mode=mode`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost</code>]]</td> </tr></tbody></table>5

  Esta opção especifica o estado de segurança desejado da conexão com o servidor. Esses valores de modo são permitidos, em ordem de rigor crescente:

  - `DISABLED`: Estabelecer uma conexão não criptografada. Isso é como a opção `--ssl=0` ou seus sinônimos (`--skip-ssl`, `--disable-ssl`).

  - `PREFERRED`: Estabeleça uma conexão criptografada se o servidor suportar conexões criptografadas, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Isso é o padrão se `--ssl-mode` não for especificado.

    As conexões através de arquivos de soquete Unix não são criptografadas com o modo `PREFERRED`. Para impor a criptografia para conexões de arquivos de soquete Unix, use um modo de `REQUIRED` ou mais rigoroso. (No entanto, o transporte de arquivos de soquete é seguro por padrão, portanto, criptografar uma conexão de arquivo de soquete não a torna mais segura e aumenta a carga da CPU.)

  - `REQUERIDO`: Estabeleça uma conexão criptografada se o servidor suportar conexões criptografadas. A tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida.

  - `VERIFY_CA`: Como `REQUIRED`, mas também verifique o certificado da Autoridade de Certificação (CA) do servidor contra os certificados de CA configurados. A tentativa de conexão falha se nenhum certificado de CA correspondente válido for encontrado.

  - `VERIFY_IDENTITY`: Assim como `VERIFY_CA`, mas, adicionalmente, realize a verificação da identidade do nome do host, verificando o nome do host que o cliente usa para se conectar ao servidor contra a identidade no certificado que o servidor envia ao cliente:

    - A partir do MySQL 5.7.23, se o cliente usar o OpenSSL 1.0.2 ou superior, o cliente verifica se o nome do host que ele usa para se conectar corresponde ao valor da Alternativa de Nome do Assunto ou ao valor do Nome Comum no certificado do servidor. A verificação da identidade do nome do host também funciona com certificados que especificam o Nome Comum usando asteriscos.

    - Caso contrário, o cliente verifica se o nome do host que ele usa para se conectar corresponde ao valor do Nome Comum no certificado do servidor.

    A conexão falha se houver uma incompatibilidade. Para conexões criptografadas, essa opção ajuda a prevenir ataques de homem no meio. Isso é como a opção antiga `--ssl-verify-server-cert`.

    Nota

    A verificação de identidade do nome do host com `VERIFY_IDENTITY` não funciona com certificados autoassinados que são criados automaticamente pelo servidor ou manualmente usando **mysql\_ssl\_rsa\_setup** (consulte a Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”). Esses certificados autoassinados não contêm o nome do servidor como valor do Nome Comum.

  Importante

  A configuração padrão, `--ssl-mode=PREFERRED`, cria uma conexão criptografada se as outras configurações padrão não forem alteradas. No entanto, para ajudar a prevenir ataques sofisticados de intermediário, é importante que o cliente verifique a identidade do servidor. As configurações `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que a configuração padrão para ajudar a prevenir esse tipo de ataque. Para implementar uma dessas configurações, você deve primeiro garantir que o certificado CA do servidor esteja disponível de forma confiável para todos os clientes que o utilizam em seu ambiente, caso contrário, problemas de disponibilidade ocorrerão. Por essa razão, elas não são a configuração padrão.

  A opção `--ssl-mode` interage com as opções de certificado CA da seguinte forma:

  - Se o modo `--ssl-mode` não for explicitamente definido de outra forma, o uso de `--ssl-ca` ou `--ssl-capath` implica `--ssl-mode=VERIFY_CA`.

  - Para os valores de `--ssl-mode` de `VERIFY_CA` ou `VERIFY_IDENTITY`, também é necessário o uso de `--ssl-ca` ou `--ssl-capath`, para fornecer um certificado CA que corresponda ao usado pelo servidor.

  - Uma opção explícita `--ssl-mode` com um valor diferente de `VERIFY_CA` ou `VERIFY_IDENTITY`, juntamente com uma opção explícita `--ssl-ca` ou `--ssl-capath`, produz um aviso de que nenhuma verificação do certificado do servidor é realizada, apesar de uma opção de certificado CA ter sido especificada.

  A opção `--ssl-mode` foi adicionada no MySQL 5.7.11.

  Para exigir o uso de conexões criptografadas por uma conta MySQL, use `CREATE USER` para criar a conta com uma cláusula `REQUIRE SSL`, ou use `ALTER USER` para uma conta existente para adicionar uma cláusula `REQUIRE SSL`. Isso faz com que as tentativas de conexão por clientes que usam a conta sejam rejeitadas, a menos que o MySQL suporte conexões criptografadas e uma conexão criptografada possa ser estabelecida.

  A cláusula `REQUIRE` permite outras opções relacionadas à criptografia, que podem ser usadas para impor requisitos de segurança mais rigorosos do que `REQUIRE SSL`. Para obter detalhes adicionais sobre quais opções de comando podem ou devem ser especificadas por clientes que se conectam usando contas configuradas usando as várias opções `REQUIRE`, consulte Opções de CREATE USER SSL/TLS.

- `--ssl-verify-server-cert`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost</code>]]</td> </tr></tbody></table>6

  Nota

  A opção `--ssl-verify-server-cert` está desatualizada a partir do MySQL 5.7.11 e será removida no MySQL 8.0. Use `--ssl-mode=VERIFY_IDENTITY` em vez disso.

  Essa opção faz com que o cliente realize a verificação de identidade do nome do host, verificando o nome do host que o cliente usa para se conectar ao servidor contra a identidade no certificado que o servidor envia ao cliente:

  - A partir do MySQL 5.7.23, se o cliente usar o OpenSSL 1.0.2 ou superior, o cliente verifica se o nome do host que ele usa para se conectar corresponde ao valor da Nome Alternativo do Assunto ou ao valor do Nome Comum no certificado do servidor.

  - Caso contrário, o cliente verifica se o nome do host que ele usa para se conectar corresponde ao valor do Nome Comum no certificado do servidor.

  A conexão falha se houver uma incompatibilidade. Para conexões criptografadas, essa opção ajuda a prevenir ataques de homem no meio. A verificação de identidade do nome do host é desativada por padrão.

  Nota

  A verificação de identidade do nome do host não funciona com certificados autoassinados criados automaticamente pelo servidor ou manualmente usando **mysql\_ssl\_rsa\_setup** (consulte a Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”). Esses certificados autoassinados não contêm o nome do servidor como valor do Nome Comum.

  A verificação de identidade do nome do host também não funciona com certificados que especificam o Nome Comum usando caracteres curinga, porque esse nome é comparado literalmente ao nome do servidor.

- `--tls-version=lista_protocolos`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost</code>]]</td> </tr></tbody></table>7

  Esta opção especifica os protocolos TLS que o cliente permite para conexões criptografadas. O valor é uma lista de uma ou mais versões de protocolo separadas por vírgula. Por exemplo:

  ```sql
  mysql --tls-version="TLSv1.1,TLSv1.2"
  ```

  Os protocolos que podem ser nomeados para essa opção dependem da biblioteca SSL usada para compilar o MySQL. Os protocolos permitidos devem ser escolhidos para não deixar "buracos" na lista. Por exemplo, esses valores não têm buracos:

  ```sql
  --tls-version="TLSv1,TLSv1.1,TLSv1.2"
  --tls-version="TLSv1.1,TLSv1.2"
  --tls-version="TLSv1.2"
  ```

  Esse valor tem um buraco e não deve ser usado:

  ```sql
  --tls-version="TLSv1,TLSv1.2"
  ```

  Para obter detalhes, consulte a Seção 6.3.2, “Protocolos e cifra de conexão criptografada TLS”.

  Essa opção foi adicionada no MySQL 5.7.10.

  Para especificar quais protocolos TLS o servidor permite, defina a variável de sistema `tls_version`.
