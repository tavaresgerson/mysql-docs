#### 6.4.4.11 Opções de Comando do Keyring

O MySQL suporta as seguintes opções de linha de comando relacionadas ao Keyring:

* [`--keyring-migration-destination=plugin`](keyring-options.html#option_mysqld_keyring-migration-destination)

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-destination"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--keyring-migration-destination=plugin_name</code></td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O Plugin Keyring de destino para a migração de chaves. Consulte [Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”](keyring-key-migration.html "6.4.4.7 Migrating Keys Between Keyring Keystores"). O formato e a interpretação do valor da opção são os mesmos descritos para a opção [`--keyring-migration-source`](keyring-options.html#option_mysqld_keyring-migration-source).

  Nota

  [`--keyring-migration-source`](keyring-options.html#option_mysqld_keyring-migration-source) e [`--keyring-migration-destination`](keyring-options.html#option_mysqld_keyring-migration-destination) são obrigatórios para todas as operações de migração de Keyring. Os plugins de origem e destino devem ser diferentes, e o servidor de migração deve suportar ambos os plugins.

* [`--keyring-migration-host=host_name`](keyring-options.html#option_mysqld_keyring-migration-host)

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-host"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--keyring-migration-host=host_name</code></td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  A localização do Host do servidor em execução que está usando atualmente um dos Keystores de migração de chaves. Consulte [Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”](keyring-key-migration.html "6.4.4.7 Migrating Keys Between Keyring Keystores"). A migração sempre ocorre no Host local, portanto, a opção sempre especifica um valor para conexão a um servidor local, como `localhost`, `127.0.0.1`, `::1`, ou o endereço IP ou nome do Host local.

* [`--keyring-migration-password[=password]`](keyring-options.html#option_mysqld_keyring-migration-password)

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-password"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--keyring-migration-password[=password]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A password da conta MySQL usada para conectar-se ao servidor em execução que está usando atualmente um dos Keystores de migração de chaves. Consulte [Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”](keyring-key-migration.html "6.4.4.7 Migrating Keys Between Keyring Keystores").

  O valor da password é opcional. Se não for fornecido, o servidor solicitará um. Se fornecido, não deve haver *espaço* entre [`--keyring-migration-password=`](keyring-options.html#option_mysqld_keyring-migration-password) e a password que o segue. Se nenhuma opção de password for especificada, o padrão é não enviar password.

  Especificar uma password na linha de comando deve ser considerado inseguro. Consulte [Section 6.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "6.1.2.1 End-User Guidelines for Password Security"). Você pode usar um arquivo de opção para evitar fornecer a password na linha de comando. Neste caso, o arquivo deve ter um modo restritivo e ser acessível apenas pela conta usada para executar o servidor de migração.

* [`--keyring-migration-port=port_num`](keyring-options.html#option_mysqld_keyring-migration-port)

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-port"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--keyring-migration-port=port_num</code></td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>Numeric</td> </tr><tr><th>Valor Padrão</th> <td><code>3306</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número da Port para conectar-se ao servidor em execução que está usando atualmente um dos Keystores de migração de chaves. Consulte [Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”](keyring-key-migration.html "6.4.4.7 Migrating Keys Between Keyring Keystores").

* [`--keyring-migration-socket=path`](keyring-options.html#option_mysqld_keyring-migration-socket)

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-socket"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--keyring-migration-socket={file_name|pipe_name}</code></td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para arquivos Socket Unix ou conexões de Named Pipe do Windows, o arquivo Socket ou Named Pipe para conectar-se ao servidor em execução que está usando atualmente um dos Keystores de migração de chaves. Consulte [Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”](keyring-key-migration.html "6.4.4.7 Migrating Keys Between Keyring Keystores").

* [`--keyring-migration-source=plugin`](keyring-options.html#option_mysqld_keyring-migration-source)

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-source"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--keyring-migration-source=plugin_name</code></td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O Plugin Keyring de origem para a migração de chaves. Consulte [Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”](keyring-key-migration.html "6.4.4.7 Migrating Keys Between Keyring Keystores").

  O valor da opção é semelhante ao de [`--plugin-load`](server-options.html#option_mysqld_plugin-load), exceto que apenas uma biblioteca de Plugin pode ser especificada. O valor é fornecido como *`plugin_library`* ou *`name`*`=`*`plugin_library`*, onde *`plugin_library`* é o nome de um arquivo de biblioteca que contém código de Plugin, e *`name`* é o nome de um Plugin a ser carregado. Se uma biblioteca de Plugin for nomeada sem nenhum nome de Plugin precedente, o servidor carregará todos os Plugins na biblioteca. Com um nome de Plugin precedente, o servidor carrega apenas o Plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de Plugin no diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir).

  Nota

  [`--keyring-migration-source`](keyring-options.html#option_mysqld_keyring-migration-source) e [`--keyring-migration-destination`](keyring-options.html#option_mysqld_keyring-migration-destination) são obrigatórios para todas as operações de migração de Keyring. Os plugins de origem e destino devem ser diferentes, e o servidor de migração deve suportar ambos os plugins.

* [`--keyring-migration-user=user_name`](keyring-options.html#option_mysqld_keyring-migration-user)

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-user"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--keyring-migration-user=user_name</code></td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome de usuário da conta MySQL usada para conectar-se ao servidor em execução que está usando atualmente um dos Keystores de migração de chaves. Consulte [Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”](keyring-key-migration.html "6.4.4.7 Migrating Keys Between Keyring Keystores").
