### 6.6.8 mysql\_migrate\_keyring  Utilidade de migração de chaves Keyring

O utilitário **mysql\_migrate\_keyring** migra chaves entre um componente de chaveiro e outro. Ele suporta migrações offline e online.

Invocar **mysql\_migrate\_keyring** assim (inserir o comando em uma única linha):

```
mysql_migrate_keyring
  --component-dir=dir_name
  --source-keyring=name
  --destination-keyring=name
  [other options]
```

Para obter informações sobre as migrações de chaves e instruções que descrevem como realizá-las usando **mysql\_migrate\_keyring** e outros métodos, consulte a secção 8.4.4.11, "Migração de chaves entre lojas de chaves".

**mysql\_migrate\_keyring** suporta as seguintes opções, que podem ser especificadas na linha de comando ou no grupo `[mysql_migrate_keyring]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, Using Option Files.

**Tabela 6.19 mysql\_migrate\_keyring Opções**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--componente-dir</td> <td>Repertório de componentes de chaveiros</td> </tr><tr><td>--defaults-extra-file</td> <td>Leia arquivo de opção nomeado além dos arquivos de opção habituais</td> </tr><tr><td>--defaults-file</td> <td>Arquivo de opções nomeadas somente para leitura</td> </tr><tr><td>--defaults-group-suffix</td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td>- Destino-chave.</td> <td>Nome do componente do chaveiro de destino</td> </tr><tr><td>--destino-chave-configuração-dir</td> <td>Diretório de configuração de componentes do chaveiro de destino</td> </tr><tr><td>--get-server-public-key</td> <td>Solicitar a chave pública RSA do servidor</td> </tr><tr><td>- Ajuda .</td> <td>Mostrar mensagem de ajuda e sair</td> </tr><tr><td>- Hospedeiro</td> <td>Host em que o servidor MySQL está localizado</td> </tr><tr><td>--login-path</td> <td>Leia as opções de caminho de login em .mylogin.cnf</td> </tr><tr><td>- Não há padrões</td> <td>Não ler arquivos de opções</td> </tr><tr><td>--não-login-caminhos</td> <td>Não ler os caminhos de login no arquivo de caminho de login</td> </tr><tr><td>Migração online</td> <td>Fonte de migração é um servidor ativo</td> </tr><tr><td>--senha</td> <td>Senha para usar quando se conectar ao servidor</td> </tr><tr><td>- Porto</td> <td>Número de porta TCP/IP para conexão</td> </tr><tr><td>- Impressão padrão</td> <td>Opções padrão de impressão</td> </tr><tr><td>--server-chave pública-caminho</td> <td>Nome do caminho para o ficheiro que contém a chave pública RSA</td> </tr><tr><td>- Soquete</td> <td>Arquivo de soquete do Unix ou tubo nomeado do Windows para usar</td> </tr><tr><td>- ... fonte-chave</td> <td>Nome do componente do chaveiro de origem</td> </tr><tr><td>- Configuração de chave de origem</td> <td>Diretório de configuração de componentes de chaveamento de origem</td> </tr><tr><td>- O quê?</td> <td>Arquivo que contém lista de autoridades de certificação SSL confiáveis</td> </tr><tr><td>--ssl-capath</td> <td>Diretório que contém ficheiros de certificados SSL confiáveis</td> </tr><tr><td>--ssl-cert</td> <td>Arquivo que contém o certificado X.509</td> </tr><tr><td>--SSL-cifrado</td> <td>Códigos permitidos para a encriptação da ligação</td> </tr><tr><td>--ssl-crl</td> <td>Arquivo que contém listas de revogação de certificados</td> </tr><tr><td>--ssl-crlpath</td> <td>Diretório que contém ficheiros de lista de revogação de certificado</td> </tr><tr><td>--ssl-fips-modo</td> <td>Ativar o modo FIPS do lado do cliente</td> </tr><tr><td>--ssl-chave</td> <td>Arquivo que contém a chave X.509</td> </tr><tr><td>- Modo SSL</td> <td>Estado de segurança desejado da ligação ao servidor</td> </tr><tr><td>--ssl-data-de-sessão</td> <td>Arquivo que contém dados de sessão SSL</td> </tr><tr><td>--ssl-session-data-continue-on-failed-reuse</td> <td>Estabelecer conexões se a reutilização da sessão falhar</td> </tr><tr><td>--tls-ciphersuites</td> <td>Suítes de encriptação TLSv1.3 permitidas para conexões criptografadas</td> </tr><tr><td>--tls-sni-nome do servidor</td> <td>Nome do servidor fornecido pelo cliente</td> </tr><tr><td>- Versão TLS</td> <td>Protocolos TLS admissíveis para ligações encriptadas</td> </tr><tr><td>-- utilizador</td> <td>Nome do usuário do MySQL para usar quando se conectar ao servidor</td> </tr><tr><td>- Verbosos.</td> <td>Modo Verbose</td> </tr><tr><td>- versão</td> <td>Informações de versão de exibição e saída</td> </tr></tbody></table>

- `--help`, `-h`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

Mostra uma mensagem de ajuda e sai.

- `--component-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--component-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório onde os componentes do keyring estão localizados. Este é tipicamente o valor da variável do sistema `plugin_dir` para o servidor MySQL local.

::: info Note

`--component-dir`, `--source-keyring`, e `--destination-keyring` são obrigatórios para todas as operações de migração de keyring realizadas por **mysql\_migrate\_keyring**. Além disso, os componentes de origem e destino devem ser diferentes, e ambos os componentes devem ser configurados corretamente para que **mysql\_migrate\_keyring** possa carregá-los e usá-los.

:::

- `--defaults-extra-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-extra-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou for inacessível, ocorre um erro. Se \* `file_name` \* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-file=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Use apenas o arquivo de opção dado. Se o arquivo não existir ou for inacessível, ocorre um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas cliente lêem `.mylogin.cnf`.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--defaults-group-suffix=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-group-suffix=str</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também os grupos com os nomes usuais e um sufixo de `str`. Por exemplo, **mysql\_migrate\_keyring** normalmente lê o grupo `[mysql_migrate_keyring]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysql\_migrate\_keyring** também lê o grupo `[mysql_migrate_keyring_other]`.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--destination-keyring=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--destination-keyring=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O formato e a interpretação do valor da opção são os mesmos descritos para a opção `--source-keyring`.

::: info Note

`--component-dir`, `--source-keyring`, e `--destination-keyring` são obrigatórios para todas as operações de migração de keyring realizadas por **mysql\_migrate\_keyring**. Além disso, os componentes de origem e destino devem ser diferentes, e ambos os componentes devem ser configurados corretamente para que **mysql\_migrate\_keyring** possa carregá-los e usá-los.

:::

- `--destination-keyring-configuration-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--destination-keyring-configuration-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

Esta opção aplica-se apenas se o arquivo de configuração global do componente de chaveiro de destino contiver `"read_local_config": true`, indicando que a configuração do componente está contida no arquivo de configuração local. O valor da opção especifica o diretório que contém esse arquivo local.

- `--get-server-public-key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr></tbody></table>

Solicitar do servidor a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para obter informações sobre o plug-in `caching_sha2_password`, consulte a Seção 8.4.1.2, Caching SHA-2 Pluggable Authentication.

- `--host=host_name`, `-h host_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>

A localização do host do servidor em execução que está atualmente usando um dos principais keystores de migração. A migração sempre ocorre no host local, então a opção sempre especifica um valor para se conectar a um servidor local, como `localhost`, `127.0.0.1`, `::1`, ou o endereço IP do host local ou nome do host.

- `--login-path=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--login-path=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Leia opções do caminho de login nomeado no arquivo de caminho de login. Um caminho de login é um grupo de opções que contém opções que especificam a qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-login-paths`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-login-paths</code>]]</td> </tr></tbody></table>

Salta opções de leitura do arquivo de caminho de login.

Ver `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--no-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para impedi-las de serem lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma forma mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--online-migration`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--online-migration</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

Esta opção é obrigatória quando um servidor em execução está usando o keyring. Ele diz **mysql\_migrate\_keyring** para executar uma migração de chave on-line. A opção tem estes efeitos:

- **mysql\_migrate\_keyring** conecta-se ao servidor usando qualquer opção de conexão especificada; caso contrário, essas opções são ignoradas.
- Depois que **mysql\_migrate\_keyring** se conecta ao servidor, ele informa o servidor para pausar as operações de keyring. Quando a cópia da chave é completa, **mysql\_migrate\_keyring** informa o servidor que pode retomar as operações de keyring antes de desconectar.

* `--password[=password]`, `-p[password]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password[=password]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves. O valor da senha é opcional. Se não for fornecido, **mysql\_migrate\_keyring** solicita um. Se for fornecido, deve haver \* nenhum espaço \* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

A especificação de uma senha na linha de comando deve ser considerada insegura. Para evitar a indicação da senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, "Diretrizes do Usuário Final para a Segurança de Senhas".

Para especificar explicitamente que não há senha e que **mysql\_migrate\_keyring** não deve solicitar uma, use a opção `--skip-password`.

- `--port=port_num`, `-P port_num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--port=port_num</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

Para as conexões TCP/IP, o número de porta para a conexão com o servidor em execução que está a utilizar actualmente um dos keystores de migração de chaves.

- `--print-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--print-defaults</code>]]</td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

Para obter informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

- `--server-public-key-path=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--server-public-key-path=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O nome do caminho para um arquivo no formato PEM contendo uma cópia do lado do cliente da chave pública exigida pelo servidor para troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plug-in de autenticação `sha256_password` (obsoleto) ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plug-ins. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para `sha256_password` (deprecated), esta opção aplica-se apenas se o MySQL foi construído usando OpenSSL.

Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, Autenticação Pluggable SHA-256, e a Seção 8.4.1.2, Cache SHA-2 Pluggable Authentication.

- `--socket=path`, `-S path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--socket={file_name|pipe_name}</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Para o arquivo de soquete do Unix ou as conexões de tubos nomeados do Windows, o arquivo de soquete ou o tubo nomeado para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves.

No Windows, essa opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de name-pipe. Além disso, o usuário que faz a conexão deve ser um membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--source-keyring=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--source-keyring=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O componente de chave de origem para a migração de chaves. Este é o nome do arquivo da biblioteca de componentes especificado sem qualquer extensão específica de plataforma, como `.so` ou `.dll`. Por exemplo, para usar o componente para o qual o arquivo da biblioteca é `component_keyring_file.so`, especifique a opção como `--source-keyring=component_keyring_file`.

::: info Note

`--component-dir`, `--source-keyring`, e `--destination-keyring` são obrigatórios para todas as operações de migração de keyring realizadas por **mysql\_migrate\_keyring**. Além disso, os componentes de origem e destino devem ser diferentes, e ambos os componentes devem ser configurados corretamente para que **mysql\_migrate\_keyring** possa carregá-los e usá-los.

:::

- `--source-keyring-configuration-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--source-keyring-configuration-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

Esta opção aplica-se apenas se o arquivo de configuração global do componente de chaveiro de origem contiver `"read_local_config": true`, indicando que a configuração do componente está contida no arquivo de configuração local. O valor da opção especifica o diretório que contém esse arquivo local.

- `--ssl*`

  As opções que começam com `--ssl` especificam se deve se conectar ao servidor usando criptografia e indicam onde encontrar chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.
- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-fips-mode={OFF|ON|STRICT}</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>STRICT</code>]]</p></td> </tr></tbody></table>

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere das outras opções `--ssl-xxx` na medida em que não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja Seção 8.8, Suporte FIPS.

São permitidos os seguintes valores de \[`--ssl-fips-mode`]:

- `OFF`: Desativar o modo FIPS.
- `ON`: Ativar o modo FIPS.
- `STRICT`: Ativar o modo FIPS strict.

::: info Note

Se o módulo de objeto OpenSSL FIPS não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e funcione no modo não-FIPS.

:::

Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL.

- `--tls-ciphersuites=ciphersuite_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-ciphersuites=ciphersuite_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Os ciphersuites permitidos para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de ciphersuite separados por duas vírgulas. Os ciphersuites que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, "Protocolos e Cipheres TLS de Conexão Criptografada".

- `--tls-sni-servername=server_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-sni-servername=server_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é sensível a maiúsculas e minúsculas. Para mostrar qual nome de servidor o cliente especificou para a sessão atual, se houver, verifique a variável de status `Tls_sni_server_name`.

O Server Name Indication (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado usando extensões TLS para que esta opção funcione).

- `--tls-version=protocol_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-version=protocol_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td><p class="valid-value">[[<code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code>]] (OpenSSL 1.1.1 ou superior)</p><p class="valid-value">[[<code>TLSv1,TLSv1.1,TLSv1.2</code>]] (caso contrário)</p></td> </tr></tbody></table>

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgulas. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, "Protocolos e cifras TLS de conexão criptografada".

- `--user=user_name`, `-u user_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--user=user_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Nome do utilizador da conta MySQL utilizada para se conectar ao servidor em execução que está a utilizar actualmente um dos depósitos de chaves de migração.

- `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

Produza mais resultados sobre o que o programa faz.

- `--version`, `-V`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version</code>]]</td> </tr></tbody></table>

Informações de versão e saída.
