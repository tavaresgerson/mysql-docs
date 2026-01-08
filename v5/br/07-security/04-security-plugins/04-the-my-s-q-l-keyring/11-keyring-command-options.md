#### 6.4.4.11 Opções de comando do porta-chaves

O MySQL suporta as seguintes opções de linha de comando relacionadas ao chaveiro:

- `--keyring-migration-destination=plugin`

  <table frame="box" rules="all" summary="Propriedades para destino de migração de chave de fenda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--keyring-migration-destination=plugin_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O plugin de chave de destino para migração de chaves. Veja Seção 6.4.4.7, “Migração de Chaves entre Keystores de Chave de Chave”. O formato e a interpretação do valor da opção são os mesmos descritos para a opção `--keyring-migration-source`.

  Nota

  `--keyring-migration-source` e `--keyring-migration-destination` são obrigatórios para todas as operações de migração de chaveiros. Os plugins de origem e destino devem ser diferentes, e o servidor de migração deve suportar ambos os plugins.

- `--keyring-migration-host=nome_do_host`

  <table frame="box" rules="all" summary="Propriedades para o host de migração de chave de fenda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--keyring-migration-host=host_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">localhost</code>]]</td> </tr></tbody></table>

  O local do host do servidor em execução que está atualmente usando um dos keystores de chave de migração. Veja Seção 6.4.4.7, “Migração de Chaves entre Keystores de Keychain”. A migração sempre ocorre no host local, portanto, a opção sempre especifica um valor para conectar a um servidor local, como `localhost`, `127.0.0.1`, `::1`, ou o endereço IP ou nome do host do host local.

- `--keyring-migration-password[=senha]`

  <table frame="box" rules="all" summary="Propriedades para senha de migração de chave de fenda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--keyring-migration-password[=password]</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves. Veja Seção 6.4.4.7, “Migração de Chaves entre Keystores do Keyring”.

  O valor da senha é opcional. Se não for fornecido, o servidor solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--keyring-migration-password=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Consulte Seção 6.1.2.1, “Diretrizes para Usuários Finais sobre Segurança de Senhas”. Você pode usar um arquivo de opção para evitar fornecer a senha na linha de comando. Nesse caso, o arquivo deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor de migração.

- `--keyring-migration-port=port_num`

  <table frame="box" rules="all" summary="Propriedades para migração de chave de fenda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--keyring-migration-port=port_num</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">3306</code>]]</td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta para se conectar ao servidor em execução que está usando atualmente um dos keystores de chave de migração. Consulte Seção 6.4.4.7, “Migração de Chaves entre Keystores de Keyring”.

- `--keyring-migration-socket=caminho`

  <table frame="box" rules="all" summary="Propriedades para socket de migração de chave de fenda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--keyring-migration-socket={file_name|pipe_name}</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para conexões de arquivo de soquete Unix ou de tubo nomeado do Windows, o arquivo de soquete ou o tubo nomeado para se conectar ao servidor em execução que está usando atualmente um dos keystores de migração de chave. Consulte Seção 6.4.4.7, “Migração de Chaves entre Keystores do Keyring”.

- `--keyring-migration-source=plugin`

  <table frame="box" rules="all" summary="Propriedades para migração de chave de registro-fonte"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--keyring-migration-source=plugin_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O plugin de chave de origem para migração de chaves. Veja Seção 6.4.4.7, “Migração de Chaves entre Keystores de Chave de Origens”.

  O valor da opção é semelhante ao da opção `--plugin-load`, exceto que apenas uma biblioteca de plugins pode ser especificada. O valor é fornecido como *`plugin_library`* ou *`name``=`*`plugin_library`\*, onde *`plugin_library`* é o nome de um arquivo de biblioteca que contém o código do plugin, e *`name`* é o nome do plugin a ser carregado. Se uma biblioteca de plugins for nomeada sem nenhum nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugins no diretório nomeado pela variável de sistema `plugin_dir`.

  Nota

  `--keyring-migration-source` e `--keyring-migration-destination` são obrigatórios para todas as operações de migração de chaveiros. Os plugins de origem e destino devem ser diferentes, e o servidor de migração deve suportar ambos os plugins.

- `--keyring-migration-user=nome_do_usuário`

  <table frame="box" rules="all" summary="Propriedades para migração de chave de fenda para usuário"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--keyring-migration-user=user_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome de usuário da conta MySQL usado para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves. Veja Seção 6.4.4.7, “Migração de Chaves entre Keystores de Keychain”.
