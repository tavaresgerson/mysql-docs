### 6.6.8 mysql\_migrate\_keyring — Ferramenta de migração de chave do Keyring

O utilitário **mysql\_migrate\_keyring** migra chaves entre um componente de chaveiro e outro. Ele suporta migrações offline e online.

Invoque **mysql\_migrate\_keyring** da seguinte forma (insira o comando em uma única linha):

```
mysql_migrate_keyring
  --component-dir=dir_name
  --source-keyring=name
  --destination-keyring=name
  [other options]
```

Para obter informações sobre migrações-chave e instruções sobre como executá-las usando **mysql\_migrate\_keyring** e outros métodos, consulte a Seção 8.4.4.14, “Migração de Chaves entre Keystores do Keyring”.

O **mysql\_migrate\_keyring** suporta as seguintes opções, que podem ser especificadas na linha de comando ou no grupo `[mysql_migrate_keyring]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.22 Opções de mysql\_migrate\_keyring**

<table summary="Opções de linha de comando disponíveis para mysql_migrate_keyring."><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> <th scope="col">Desatualizado</th> </tr></thead><tbody><tr><th>--component-dir</th> <td>Diretório de componentes do chaveiro</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--destination-keyring</th> <td>Nome do componente de chave de destino</td> <td></td> <td></td> </tr><tr><th>--destination-keyring-configuration-dir</th> <td>Diretório de configuração do componente de chave de destino</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th>--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não ler arquivos de opção</td> <td></td> <td></td> </tr><tr><th>--migração online</th> <td>A fonte de migração é um servidor ativo</td> <td></td> <td></td> </tr><tr><th>--senha</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número de porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Opções padrão de impressão</td> <td></td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--source-keyring</th> <td>Nome do componente do chaveiro de fonte</td> <td></td> <td></td> </tr><tr><th>--source-keyring-configuration-dir</th> <td>Diretório de configuração do componente de chave de fenda</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th>--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th>--ssl-chave</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th>--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th>--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th>--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Modo verbosos</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr></tbody></table>

- `--help`, `-h`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--component-dir=dir_name`

  <table summary="Propriedades para component-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--component-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os componentes do chaveiro estão localizados. Geralmente, esse é o valor da variável de sistema `plugin_dir` do servidor MySQL local.

  Nota

  `--component-dir`, `--source-keyring` e `--destination-keyring` são obrigatórios para todas as operações de migração de chaveiros realizadas pelo **mysql\_migrate\_keyring**. Além disso, os componentes de origem e destino devem ser diferentes e ambos devem estar corretamente configurados para que o **mysql\_migrate\_keyring** possa carregá-los e usá-los.

- `--defaults-extra-file=file_name`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=file_name`

  <table summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-group-suffix=str</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de `str`. Por exemplo, **mysql\_migrate\_keyring** normalmente lê o grupo `[mysql_migrate_keyring]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysql\_migrate\_keyring** também lê o grupo `[mysql_migrate_keyring_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--destination-keyring=name`

  <table summary="Propriedades para o keyring de destino"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--destination-keyring=name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  O componente de chave de destino para migração de chaves. O formato e a interpretação do valor da opção são os mesmos descritos para a opção `--source-keyring`.

  Nota

  `--component-dir`, `--source-keyring` e `--destination-keyring` são obrigatórios para todas as operações de migração de chaveiros realizadas pelo **mysql\_migrate\_keyring**. Além disso, os componentes de origem e destino devem ser diferentes e ambos devem estar corretamente configurados para que o **mysql\_migrate\_keyring** possa carregá-los e usá-los.

- `--destination-keyring-configuration-dir=dir_name`

  <table summary="Propriedades para o diretório de configuração do porta-destino"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--destination-keyring-configuration-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Esta opção só se aplica se o arquivo de configuração global do componente de chave de destino contiver `"read_local_config": true`, indicando que a configuração do componente está contida no arquivo de configuração local. O valor da opção especifica o diretório que contém esse arquivo local.

- `--get-server-public-key`

  <table summary="Propriedades para get-server-public-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr></tbody></table>

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Conectada a SHA-2”.

- `--host=host_name`, `-h host_name`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>

  O local do host do servidor em execução que está atualmente usando um dos keystores de migração de chave. A migração sempre ocorre no host local, portanto, a opção sempre especifica um valor para conectar a um servidor local, como `localhost`, `127.0.0.1`, `::1` ou o endereço IP ou nome do host do host local.

- `--login-path=name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>0

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--no-defaults`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>1

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Utilitário de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--online-migration`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>2

  Esta opção é obrigatória quando um servidor em execução está usando o chaveiro. Ela informa ao **mysql\_migrate\_keyring** para realizar uma migração de chave online. A opção tem esses efeitos:

  - O **mysql\_migrate\_keyring** se conecta ao servidor usando quaisquer opções de conexão especificadas; essas opções são ignoradas de qualquer maneira.

  - Depois que o **mysql\_migrate\_keyring** se conecta ao servidor, ele instrui o servidor a pausar as operações do chaveiro. Quando a cópia da chave estiver concluída, o **mysql\_migrate\_keyring** instrui o servidor a retomar as operações do chaveiro antes de se desconectar.

- `--password[=password]`, `-p[password]`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>3

  A senha da conta MySQL usada para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves. O valor da senha é opcional. Se não for fornecido, o **mysql\_migrate\_keyring** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysql\_migrate\_keyring** não deve solicitar uma senha, use a opção `--skip-password`.

- `--port=port_num`, `-P port_num`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>4

  Para conexões TCP/IP, o número de porta para se conectar ao servidor em execução que está usando atualmente um dos keystores de chave de migração.

- `--print-defaults`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>5

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--server-public-key-path=file_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>6

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Conectada a SHA-256”, e a Seção 8.4.1.2, “Cache de Autenticação Conectada a SHA-2”.

- `--socket=path`, `-S path`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>7

  Para conexões de arquivo de soquete Unix ou de tubo nomeado do Windows, o arquivo de soquete ou o tubo nomeado para conectar ao servidor em execução que está usando atualmente um dos keystores de chave de migração.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--source-keyring=name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>8

  O componente de chave de fonte para migração de chaves. Este é o nome do arquivo da biblioteca do componente especificado sem qualquer extensão específica da plataforma, como `.so` ou `.dll`. Por exemplo, para usar o componente para o qual o arquivo da biblioteca é `component_keyring_file.so`, especifique a opção como `--source-keyring=component_keyring_file`.

  Nota

  `--component-dir`, `--source-keyring` e `--destination-keyring` são obrigatórios para todas as operações de migração de chaveiros realizadas pelo **mysql\_migrate\_keyring**. Além disso, os componentes de origem e destino devem ser diferentes e ambos devem estar corretamente configurados para que o **mysql\_migrate\_keyring** possa carregá-los e usá-los.

- `--source-keyring-configuration-dir=dir_name`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>9

  Esta opção só se aplica se o arquivo de configuração global do componente de chave de segurança da fonte contiver `"read_local_config": true`, indicando que a configuração do componente está contida no arquivo de configuração local. O valor da opção especifica o diretório que contém esse arquivo local.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table summary="Propriedades para component-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--component-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>0

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Estes valores `--ssl-fips-mode` são permitidos:

  - `OFF`: Desative o modo FIPS.
  - `ON`: Habilitar o modo FIPS.
  - `STRICT`: Habilitar o modo FIPS "estricto".

  Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente emita um aviso na inicialização e opere no modo não FIPS.

  A partir do MySQL 8.0.34, essa opção está desatualizada. Espera-se que ela seja removida em uma versão futura do MySQL.

- `--tls-ciphersuites=ciphersuite_list`

  <table summary="Propriedades para component-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--component-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>1

  As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequências de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra de conexão criptografada TLS”.

- `--tls-version=protocol_list`

  <table summary="Propriedades para component-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--component-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>2

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.

- `--user=user_name`, `-u user_name`

  <table summary="Propriedades para component-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--component-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>3

  O nome de usuário da conta MySQL usado para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chave.

- `--verbose`, `-v`

  <table summary="Propriedades para component-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--component-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>4

  Modo verbose. Produza mais informações sobre o que o programa faz.

- `--version`, `-V`

  <table summary="Propriedades para component-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--component-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>5

  Exibir informações da versão e sair.
