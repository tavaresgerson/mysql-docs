#### 8.4.4.18 Opções de comando do porta-chaves

O MySQL suporta as seguintes opções de linha de comando relacionadas ao chaveiro:

- `--keyring-migration-destination=plugin`

  <table summary="Propriedades para destino de migração de chave de fenda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-migration-destination=plugin_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  O plugin de chave de destino para migração de chaves. Consulte a Seção 8.4.4.14, “Migrar Chaves entre Keystores de Chave de Destino”. A interpretação do valor da opção depende de se o `--keyring-migration-to-component` é especificado:

  - Se não, o valor da opção é um plugin de chave de segurança, interpretado da mesma maneira que para `--keyring-migration-source`.

  - Se sim, o valor da opção é um componente de chave, especificado como o nome da biblioteca de componentes no diretório do plugin, incluindo qualquer extensão específica da plataforma, como `.so` ou `.dll`.

  Nota

  `--keyring-migration-source` e `--keyring-migration-destination` são obrigatórios para todas as operações de migração de chaveiros. Os plugins de origem e destino devem ser diferentes, e o servidor de migração deve suportar ambos os plugins.

- `--keyring-migration-host=host_name`

  <table summary="Propriedades para o host de migração de chave de fenda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-migration-host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>

  O local do host do servidor em execução que está atualmente usando um dos keystores de chave de migração. Veja a Seção 8.4.4.14, “Migrar Chaves entre Keystores de Keyring”. A migração sempre ocorre no host local, portanto, a opção sempre especifica um valor para conectar a um servidor local, como `localhost`, `127.0.0.1`, `::1` ou o endereço IP ou nome do host do host local.

- `--keyring-migration-password[=password]`

  <table summary="Propriedades para senha de migração de chave de fenda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-migration-password[=password]</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves. Veja a Seção 8.4.4.14, “Migrar Chaves entre Keystores de Keychain”.

  O valor da senha é opcional. Se não for fornecido, o servidor solicitará um. Se for fornecido, não deve haver *espaço* entre `--keyring-migration-password=` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Consulte a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”. Você pode usar um arquivo de opção para evitar fornecer a senha na linha de comando. Nesse caso, o arquivo deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor de migração.

- `--keyring-migration-port=port_num`

  <table summary="Propriedades para migração de chave de fenda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-migration-port=port_num</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>3306</code>]]</td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta para se conectar ao servidor em execução que está usando atualmente um dos keystores de chave de migração. Consulte a Seção 8.4.4.14, “Migrar Chaves entre Keystores de Keychain”.

- `--keyring-migration-socket=path`

  <table summary="Propriedades para socket de migração de chave de fenda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-migration-socket={file_name|pipe_name}</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Para conexões de arquivo de soquete Unix ou de tubo nomeado do Windows, o arquivo de soquete ou o tubo nomeado para se conectar ao servidor em execução que está usando atualmente um dos keystores de chave de migração. Consulte a Seção 8.4.4.14, “Migrar Chaves entre Keystores do Keyring”.

- `--keyring-migration-source=plugin`

  <table summary="Propriedades para migração de chave de registro-fonte"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-migration-source=plugin_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  O plugin de chave de origem para migração de chaves. Veja a Seção 8.4.4.14, “Migrar Chaves entre Keystores de Chave de Origens”.

  O valor da opção é semelhante ao da opção `--plugin-load`, exceto que apenas uma biblioteca de plugins pode ser especificada. O valor é fornecido como `plugin_library` ou `name``=``plugin_library`, onde `plugin_library` é o nome de um arquivo de biblioteca que contém o código do plugin, e `name` é o nome do plugin a ser carregado. Se uma biblioteca de plugins for nomeada sem nenhum nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugins no diretório nomeado pela variável de sistema `plugin_dir`.

  Nota

  `--keyring-migration-source` e `--keyring-migration-destination` são obrigatórios para todas as operações de migração de chaveiros. Os plugins de origem e destino devem ser diferentes, e o servidor de migração deve suportar ambos os plugins.

- `--keyring-migration-to-component`

  <table summary="Propriedades para migração de chave de fenda para componente"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-migration-to-component[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Indica que uma migração chave é de um plugin de chave de segurança para um componente de chave de segurança. Esta opção permite migrar chaves de qualquer plugin de chave de segurança para qualquer componente de chave de segurança, o que facilita a transição de uma instalação do MySQL de plugins de chave de segurança para componentes de chave de segurança.

  Para migrar chaves de um componente de chaveiro para outro, use o utilitário **mysql\_migrate\_keyring**. A migração de um componente de chaveiro para um plugin de chaveiro não é suportada. Consulte a Seção 8.4.4.14, “Migrar Chaves Entre Keystores de Chaveiro”.

- `--keyring-migration-user=user_name`

  <table summary="Propriedades para migração de chave de fenda para usuário"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-migration-user=user_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  O nome de usuário da conta MySQL usado para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves. Veja a Seção 8.4.4.14, “Migrar Chaves entre Keystores de Keychain”.
