### 6.6.8 mysql_migrate_keyring — Ferramenta de Migração de Chaveiros

O utilitário **mysql_migrate_keyring** migra chaves entre um componente de chaveiro e outro. Ele suporta migrações offline e online.

Inicie o **mysql_migrate_keyring** da seguinte forma (insira o comando em uma única linha):

```
mysql_migrate_keyring
  --component-dir=dir_name
  --source-keyring=name
  --destination-keyring=name
  [other options]
```

Para obter informações sobre migrações de chaves e instruções sobre como executá-las usando o **mysql_migrate_keyring** e outros métodos, consulte a Seção 8.4.5.14, “Migrar Chaves entre Keystores de Chaveiros”.

O **mysql_migrate_keyring** suporta as seguintes opções, que podem ser especificadas na linha de comando ou no grupo `[mysql_migrate_keyring]` de um arquivo de opções. Para obter informações sobre arquivos de opções usados pelos programas MySQL, consulte a Seção 6.2.2.2, “Usar Arquivos de Opções”.

**Tabela 6.20 Opções do mysql_migrate_keyring**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysql_migrate_keyring">
<tr><th>Nome da Opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_component-dir">--component-dir</a></td> <td>Diretório para componentes do keyring</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_defaults-extra-file">--defaults-extra-file</a></td> <td>Ler arquivo de opção nomeado além dos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_defaults-file">--defaults-file</a></td> <td>Ler apenas arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_destination-keyring">--destination-keyring</a></td> <td>Nome do componente do keyring de destino</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_destination-keyring-configuration-dir">--destination-keyring-configuration-dir</a></td> <td>Diretório de configuração do componente do keyring de destino</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_get-server-public-key">--get-server-public-key</a></td> <td>Solicitar chave pública RSA do servidor</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_help">--help</a></td> <td>Exibir mensagem de ajuda e sair</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_host">--host</a></td> <td>Host em que o servidor MySQL está localizado</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_login-path">--login-path</a></td> <td>Ler caminhos de login a partir de .mylogin.cnf</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_no-defaults">--no-defaults</a></td> <td>Ler nenhum arquivo de opção</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_no-login-paths">--no-login-paths</a></td> <td>Não ler caminhos de login a partir do arquivo de caminhos de login</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_online-migration">--online-migration</a></td> <td>A migração é uma fonte ativa do servidor</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_password">--password</a></td> <td>Senha para se conectar ao servidor</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_port">--port</a></td> <td>Número de porta TCP/IP para a conexão</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_print-defaults">--print-defaults</a></td> <td>Imprimir opções padrão</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_server-public-key-path">--server-public-key-path</a></td> <td>Nome do caminho do arquivo que contém a chave pública RSA do servidor</td></tr>
<tr><td><a class="link" href="mysql-migrate-keyring.html#option_mysql_migrate_keyring_socket">--socket</a></td> <td>Ficheiro Unix socket ou canal de nomeado Windows para usar

* `--help`, `-h`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></table>

  Exibir uma mensagem de ajuda e sair.

* `--component-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para component-dir"><tr><th>Formato de linha de comando</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></table>

  O diretório onde os componentes do keyring estão localizados. Geralmente, é o valor da variável de sistema `plugin_dir` do servidor MySQL local.

  Nota

  `--component-dir`, `--source-keyring` e `--destination-keyring` são obrigatórios para todas as operações de migração do keyring realizadas pelo **mysql\_migrate\_keyring**. Além disso, os componentes de origem e destino devem ser diferentes e ambos devem estar corretamente configurados para que o **mysql\_migrate\_keyring** possa carregá-los e usá-los.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></table>

  Ler este arquivo de opções após o arquivo de opções globais, mas (no Unix) antes do arquivo de opções do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o gerenciamento de arquivos de configuração”.

* `--defaults-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para defaults-file">
    <tr><th>Formato da linha de comando</th> <td><code>--defaults-file=nome_do_arquivo</code></td> </tr>
    <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  </table>

  Use apenas o arquivo de configuração fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`nome_do_arquivo`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o gerenciamento de arquivos de configuração”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix">
    <tr><th>Formato da linha de comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
  </table>

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysql\_migrate\_keyring** normalmente lê o grupo `[mysql_migrate_keyring]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysql\_migrate\_keyring** também lê o grupo `[mysql_migrate_keyring_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o gerenciamento de arquivos de configuração”.

* `--destination-keyring=nome`

<table frame="box" rules="all" summary="Propriedades para destination-keyring"><tbody><tr><th>Formato de linha de comando</th> <td><code>--destination-keyring=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O componente de chave de destino para migração de chaves. O formato e a interpretação do valor da opção são os mesmos descritos para a opção `--source-keyring`.

  Nota

  `--component-dir`, `--source-keyring` e `--destination-keyring` são obrigatórios para todas as operações de migração de chaves realizadas pelo **mysql\_migrate\_keyring**. Além disso, os componentes de origem e destino devem diferir e ambos devem ser configurados corretamente para que o **mysql\_migrate\_keyring** possa carregá-los e usá-los.

* `--destination-keyring-configuration-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para destination-keyring-configuration-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--destination-keyring-configuration-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Esta opção só se aplica se o arquivo de configuração global do componente de chave de destino contiver `"read_local_config": true`, indicando que a configuração do componente está contida no arquivo de configuração local. O valor da opção especifica o diretório que contém esse arquivo local.

* `--get-server-public-key`

<table frame="box" rules="all" summary="Propriedades para get-server-public-key">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--get-server-public-key</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  </tbody>
</table>

  Peça ao servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como no caso de o cliente se conectar ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.1, “Cacheamento de Autenticação Pluggable SHA-2”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para host">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--host=host_name</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>localhost</code></td>
    </tr>
  </tbody>
  </table>

  A localização do host do servidor em execução que está atualmente usando um dos keystores de migração de chaves. A migração sempre ocorre no host local, portanto, a opção sempre especifica um valor para conectar-se a um servidor local, como `localhost`, `127.0.0.1`, `::1`, ou o endereço IP do host local ou o nome do host.

* `--login-path=name`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--help</code></td>
  </tr>
</table>
0

Ler opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração do MySQL”.

Para obter informações adicionais sobre esta e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--no-login-paths`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--help</code></td>
  </tr>
</table>
1

Ignorar a leitura de opções do arquivo de caminho de login.

Veja `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--no-defaults`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--help</code></td>
  </tr>
</table>
2

Não ler nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para obter informações adicionais sobre essa e outras opções de arquivo, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.

* `--online-migration`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Esta opção é obrigatória quando um servidor em execução está usando o chaveiro. Ela indica ao **mysql\_migrate\_keyring** que realize uma migração de chave online. A opção tem esses efeitos:

  + **mysql\_migrate\_keyring** se conecta ao servidor usando quaisquer opções de conexão especificadas; essas opções são ignoradas caso contrário.

  + Após **mysql\_migrate\_keyring** se conectar ao servidor, ele indica ao servidor que pause as operações do chaveiro. Quando a cópia de chaves estiver completa, **mysql\_migrate\_keyring** indica ao servidor que pode retomar as operações do chaveiro antes de se desconectar.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves. O valor da senha é opcional. Se não for fornecido, o **mysql_migrate_keyring** solicita uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

Para especificar explicitamente que não há senha e que o **mysql_migrate_keyring** não deve solicitar uma senha, use a opção `--skip-password`.

* `--port=port_num`, `-P port_num`

<table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves.

* `--print-defaults`

<table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

  Para obter informações adicionais sobre esta e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.

* `--server-public-key-path=file_name`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--help</code></td>
  </tr>
</table>

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção só se aplica se o MySQL foi compilado usando OpenSSL.

  Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.2, “Autenticação Personalizável SHA-256” e a Seção 8.4.1.1, “Autenticação Personalizável SHA-2”.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Propriedades de ajuda">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--help</code></td>
    </tr>
  </table>

  Para conexões de arquivo de socket Unix ou tubo nomeado do Windows, o arquivo de socket ou tubo nomeado para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves.

Em Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--source-keyring=name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O componente de chave de origem para migração de chaves. Este é o nome do arquivo da biblioteca de componentes especificado sem qualquer extensão específica da plataforma, como `.so` ou `.dll`. Por exemplo, para usar o componente para o qual o arquivo da biblioteca é `component_keyring_file.so`, especifique a opção como `--source-keyring=component_keyring_file`.

  Nota

  `--component-dir`, `--source-keyring` e `--destination-keyring` são obrigatórios para todas as operações de migração de chaves realizadas pelo **mysql\_migrate\_keyring**. Além disso, os componentes de origem e destino devem diferir e ambos os componentes devem ser configurados corretamente para que o **mysql\_migrate\_keyring** possa carregá-los e usá-los.

* `--source-keyring-configuration-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para component-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

Esta opção só se aplica se o arquivo de configuração global do componente do chaveiro de origem contiver `"read_local_config": true`, indicando que a configuração do componente está contida no arquivo de configuração local. O valor da opção especifica o diretório que contém esse arquivo local.

* `--ssl*`

  As opções que começam com `--ssl` especificam se se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de Comando para Conexões Criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Propriedades para component-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja Seção 8.8, “Suporte FIPS”.

  Esses valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza uma mensagem de aviso no início e opere no modo não FIPS.

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.

* `--tls-ciphersuites=ciphersuite_list`

<table frame="box" rules="all" summary="Propriedades para component-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  As suíte de cifra permitidas para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de suíte de cifra separados por vírgula. As suíte de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e suíte de cifra TLS de Conexão Criptografada”.

* `--tls-sni-servername=server_name`

  <table frame="box" rules="all" summary="Propriedades para component-dir"><tbody><tr><th>Formato de linha de comando</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Quando especificada, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que esta opção funcione). A implementação do SNI do MySQL representa apenas o lado do cliente.

* `--tls-version=lista_protocolos`

<table frame="box" rules="all" summary="Propriedades para component-dir">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--component-dir=dir_name</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do diretório</td>
  </tr>
  </tbody>
</table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de Conexão Criptografada”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para component-dir">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--component-dir=dir_name</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do diretório</td>
    </tr>
  </tbody>
  </table>

  O nome do usuário da conta MySQL usada para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para component-dir">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--component-dir=dir_name</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do diretório</td>
    </tr>
  </tbody>
  </table>

  Modo de verbosidade. Produza mais saída sobre o que o programa faz.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para component-dir">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--component-dir=dir_name</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do diretório</td>
    </tr>
  </tbody>
  </table>

Exibir informações da versão e sair.