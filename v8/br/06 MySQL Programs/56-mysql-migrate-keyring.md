### 6.6.8 `mysql_migrate_keyring` — Ferramenta de Migração de Chaveiros

A ferramenta `mysql_migrate_keyring` migra chaves entre um componente de chaveiro e outro. Ela suporta migrações offline e online.

Invoque `mysql_migrate_keyring` da seguinte forma (insira o comando em uma única linha):

```
mysql_migrate_keyring
  --component-dir=dir_name
  --source-keyring=name
  --destination-keyring=name
  [other options]
```

Para obter informações sobre migrações de chaves e instruções sobre como executá-las usando `mysql_migrate_keyring` e outros métodos, consulte a Seção 8.4.4.11, “Migrar Chaves entre Keystores de Chaveiros”.

`mysql_migrate_keyring` suporta as seguintes opções, que podem ser especificadas na linha de comando ou no grupo `[mysql_migrate_keyring]` de um arquivo de opções. Para obter informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, “Usar Arquivos de Opções”.

**Tabela 6.19 Opções de `mysql_migrate_keyring`**

<table>
   <thead>
      <tr>
         <th>Nome da Opção</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>--component-dir</code></td>
         <td>Diretório para componentes do keyring</td>
      </tr>
      <tr>
         <td><code>--defaults-extra-file</code></td>
         <td>Ler o arquivo de opção nomeado além dos arquivos de opção usuais</td>
      </tr>
      <tr>
         <td><code>--defaults-file</code></td>
         <td>Ler apenas o arquivo de opção nomeado</td>
      </tr>
      <tr>
         <td><code>--defaults-group-suffix</code></td>
         <td>Valor do sufixo do grupo de opções</td>
      </tr>
      <tr>
         <td><code>--destination-keyring</code></td>
         <td>Nome do componente do keyring de destino</td>
      </tr>
      <tr>
         <td><code>--destination-keyring-configuration-dir</code></td>
         <td>Diretório de configuração do componente do keyring de destino</td>
      </tr>
      <tr>
         <td><code>--get-server-public-key</code></td>
         <td>Solicitar a chave pública RSA do servidor</td>
      </tr>
      <tr>
         <td><code>--help</code></td>
         <td>Exibir mensagem de ajuda e sair</td>
      </tr>
      <tr>
         <td><code>--host</code></td>
         <td>Host em que o servidor MySQL está localizado</td>
      </tr>
      <tr>
         <td><code>--login-path</code></td>
         <td>Ler as opções de caminho de login a partir de .mylogin.cnf</td>
      </tr>
      <tr>
         <td><code>--no-defaults</code></td>
         <td>Ler nenhum arquivo de opção</td>
      </tr>
      <tr>
         <td><code>--no-login-paths</code></td>
         <td>Não ler caminhos de login do arquivo de caminhos de login</td>
      </tr>
      <tr>
         <td><code>--online-migration</code></td>
         <td>A fonte de migração é um servidor ativo</td>
      </tr>
      <tr>
         <td><code>--password</code></td>
         <td>Senha a ser usada ao se conectar ao servidor</td>
      </tr>
      <tr>
         <td><code>--port</code></td>
         <td>Número de porta TCP/IP para a conexão</td>
      </tr>
      <tr>
         <td><code>--print-defaults</code></td>
         <td>Imprimir opções padrão</td>
      </tr>
      <tr>
         <td><code>--server-public-key-path</code></td>
         <td>Nome do caminho do arquivo que contém a chave pública RSA</td>
      </tr>
      <tr>
         <td><code>--socket</code></td>
         <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td>
      </tr>
      <tr>
         <td><code>--source-keyring</code></td>
         <td>Nome do componente do keyring de origem</td>
      </tr>
      <tr>
         <td><code>--source-keyring-configuration-dir</code></td>
         <td>Diretório de configuração do componente do keyring de origem</td>
      </tr>
      <tr>
         <td><code>--ssl-ca</code></td>
         <td>Arquivo que contém a lista de Autoridades de Certificados SSL confiáveis</td>
      </tr>
      <tr>
         <td><code>--ssl-capath</code></td>
         <td>Diretório que contém os arquivos de certificado de Autoridade de Certificados SSL confiáveis</td>
      </tr>
      <tr>
         <td><code>--ssl-cert</code></td>
         <td>Arquivo que contém o certificado X.509</td>
      </tr>
      <tr>
         <td><code>--ssl-cipher</code></td>
         <td>Cifras permitidas para a criptografia da conexão</td>
      </tr>
      <tr>
         <td><code>--ssl-crl</code></td>
         <td>Arquivo que contém listas de revogação de certificados</td>
      </tr>
      <tr>
         <td><code>--ssl-crlpath</code></td>
         <td>Diretório que contém os arquivos de lista de revogação de certificados</td>
      </tr>
      <tr>
         <td><code>--ssl-fips-mode</code></td>
         <td>Se o modo <code>FIPS</code> deve ser habilitado no lado do cliente</td>
      </tr>
      <tr>
         <td><code>--ssl-key</code></td>
         <td>Arquivo que contém a chave X.509</td>
      </tr>
      <tr>
         <td><code>--ssl-mode</code></td>
         <td>Estado de segurança desejado da conexão com o servidor</td>
      </tr>
      <tr>
         <td><code>--ssl-session-data</code></td>
         <td>Arquivo que contém os dados da sessão SSL</td>
      </tr>
      <tr>
         <td><code>--ssl-session-data-continue-on-failed-reuse</code></td>
         <td>Se as conexões devem ser estabelecidas se a reutilização da sessão falhar</td>
      </tr>
      <tr>
         <td><code>--tls-ciphersuites</code></td>
         <td>Cifras TLS

*  `--help`, `-h`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.
*  `--component-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os componentes do keyring estão localizados. Normalmente, é o valor da variável de sistema `plugin_dir` do servidor MySQL local.

  ::: info Nota

   `--component-dir`, `--source-keyring` e `--destination-keyring` são obrigatórios para todas as operações de migração do keyring realizadas pelo  `mysql_migrate_keyring`. Além disso, os componentes de origem e destino devem ser diferentes e ambos devem estar corretamente configurados para que o  `mysql_migrate_keyring` possa carregá-los e usá-los.

  :::

Para obter informações adicionais sobre essa e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o gerenciamento de arquivos de opções”.
*  `--defaults-group-suffix=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de `str`. Por exemplo, `mysql_migrate_keyring` normalmente lê o grupo `[mysql_migrate_keyring]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, `mysql_migrate_keyring` também lê o grupo `[mysql_migrate_keyring_other]`.

  Para obter informações adicionais sobre essa e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o gerenciamento de arquivos de opções”.
*  `--destination-keyring=name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--destination-keyring=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O componente de chave de destino para migração de chaves. O formato e a interpretação do valor da opção são os mesmos descritos para a opção `--source-keyring`.

  ::: info Nota

   `--component-dir`, `--source-keyring` e `--destination-keyring` são obrigatórios para todas as operações de migração de chaves realizadas pelo `mysql_migrate_keyring`. Além disso, os componentes de origem e destino devem diferir e ambos devem ser configurados corretamente para que o `mysql_migrate_keyring` possa carregá-los e usá-los.

  :::

Esta opção só se aplica se o arquivo de configuração global do componente de chave de destino contiver `"read_local_config": true`, indicando que a configuração do componente está contida no arquivo de configuração local. O valor da opção especifica o diretório que contém esse arquivo local.
*  `--get-server-public-key`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr></tbody></table>

  Solicitar ao servidor a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.
*  `--host=host_name`, `-h host_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  A localização do host do servidor em execução que está atualmente usando um dos keystores de migração de chaves. A migração sempre ocorre no host local, portanto, a opção sempre especifica um valor para conectar-se a um servidor local, como `localhost`, `127.0.0.1`, `::1`, ou o endereço IP do host local ou o nome do host.
*  `--login-path=name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um "caminho de login" é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário `mysql_config_editor`. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivos de configuração, veja  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
*  `--no-login-paths`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

  Ignora a leitura de opções do arquivo de caminho de login.

  Veja `--login-path` para informações relacionadas.

  Para informações adicionais sobre esta e outras opções de arquivos de configuração, veja  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
*  `--no-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não leia nenhum arquivo de opção. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção, `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário `mysql_config_editor`.

  Para informações adicionais sobre esta e outras opções de arquivos de configuração, veja  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
*  `--online-migration`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--online-migration</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

Esta opção é obrigatória quando um servidor em execução está usando o conjunto de chaves. Ela informa ao `mysql_migrate_keyring` para realizar uma migração de chave online. A opção tem esses efeitos:

+ O `mysql_migrate_keyring` se conecta ao servidor usando quaisquer opções de conexão especificadas; essas opções são ignoradas caso contrário.
+ Após o `mysql_migrate_keyring` se conectar ao servidor, ele informa ao servidor para pausar as operações do conjunto de chaves. Quando a cópia da chave estiver completa, o `mysql_migrate_keyring` informa ao servidor que pode retomar as operações do conjunto de chaves antes de se desconectar.
*  `--password[=password]`, `-p[password]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor em execução que está atualmente usando um dos armazenamentos de chaves de migração de chaves. O valor da senha é opcional. Se não for fornecido, o `mysql_migrate_keyring` solicitará uma. Se for fornecido, não deve haver *espaço* entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o `mysql_migrate_keyring` não deve solicitar uma, use a opção `--skip-password`.
*  `--port=port_num`, `-P port_num`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>0</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta para se conectar ao servidor em execução que está atualmente usando um dos armazenamentos de chaves de migração de chaves.
*  `--print-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para obter informações adicionais sobre essa e outras opções de arquivos de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
* `--server-public-key-path=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--server-public-key-path=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password` (desatualizado), esta opção se aplica apenas se o MySQL foi compilado usando o OpenSSL.

  Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Personalizável SHA-256”, e a Seção 8.4.1.2, “Autenticação Personalizável SHA-2”.
* `--socket=path`, `-S path`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--socket={file_name|pipe_name}</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para conexões de socket Unix ou tubos nomeados do Windows, o arquivo de socket ou o tubo nomeado para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves.

Em Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
*  `--source-keyring=name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--source-keyring=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O componente de chave de origem para migração de chaves. Este é o nome do arquivo da biblioteca do componente especificado sem qualquer extensão específica da plataforma, como `.so` ou `.dll`. Por exemplo, para usar o componente para o qual o arquivo da biblioteca é `component_keyring_file.so`, especifique a opção como `--source-keyring=component_keyring_file`.

  ::: info Nota

  `--component-dir`, `--source-keyring` e `--destination-keyring` são obrigatórios para todas as operações de migração de chaves realizadas pelo  `mysql_migrate_keyring`. Além disso, os componentes de origem e destino devem diferir e ambos devem ser configurados corretamente para que o  `mysql_migrate_keyring` possa carregá-los e usá-los.

  :::
*  `--source-keyring-configuration-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--source-keyring-configuration-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr></tbody></table>

  Esta opção só se aplica se o arquivo de configuração global do componente de chave de origem contiver `"read_local_config": true`, indicando que a configuração do componente está contida no arquivo de configuração local. O valor da opção especifica o diretório que contém esse arquivo local.
* `--ssl*`

  Opções que começam com `--ssl` especificam se a conexão com o servidor deve ser feita usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.
*  `--ssl-fips-mode={OFF|ON|STRICT}`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores Válidos</th> <td><code>OFF</code><code>ON</code><code>STRICT</code></td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Consulte  Seção 8.8, “Suporte FIPS”.

  Estes valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  ::: info Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza uma mensagem de aviso no início e opere no modo não FIPS.

  :::

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.
*  `--tls-ciphersuites=ciphersuite_list`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--tls-ciphersuites=ciphersuite_list</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Os ciphersuites permitidos para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de ciphersuites separados por vírgula. Os ciphersuites que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte Seção 8.3.2, “Protocolos e Criptografadores TLS de Conexão Criptografada”.
*  `--tls-sni-servername=server_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--tls-sni-servername=server_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que essa opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.
*  `--tls-version=protocol_list`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-version=protocol_list</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code> (OpenSSL 1.1.1 ou superior)<code>TLSv1,TLSv1.1,TLSv1.2</code> (caso contrário)</td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para essa opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.
*  `--user=user_name`, `-u user_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--user=user_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome do usuário da conta MySQL usado para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves.
*  `--verbose`, `-v`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose. Produza mais saída sobre o que o programa faz.
*  `--version`, `-V`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--version</code></td> </tr></tbody></table>

  Exibir informações de versão e sair.