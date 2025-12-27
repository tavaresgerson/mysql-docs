#### 8.4.4.15 Opções de Comando do Pendrive de Chave

O MySQL suporta as seguintes opções de linha de comando relacionadas ao pendrive de chave:

*  `--keyring-migration-destination=plugin`

  <table><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--keyring-migration-destination=plugin_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O plugin ou componente do pendrive de chave de destino para migração de chaves. Consulte  Seção 8.4.4.11, “Migrar Chaves entre Pendrives de Chave”. A interpretação do valor da opção depende de se `--keyring-migration-to-component` ou `--keyring-migration-from-component` é especificado:

  + Se `--keyring-migration-to-component` for usado, o valor da opção é um plugin do pendrive de chave, interpretado da mesma maneira que para `--keyring-migration-source`.
  + Se `--keyring-migration-to-component` for usado, o valor da opção é um componente do pendrive de chave, especificado como o nome da biblioteca do componente no diretório do plugin, incluindo qualquer extensão específica da plataforma, como `.so` ou `.dll`.
  
  ::: info Nota

   `--keyring-migration-source` e `--keyring-migration-destination` são obrigatórios para todas as operações de migração do pendrive de chave. A fonte e o destino devem ser diferentes, e o servidor de migração deve suportar ambos.

  :::

*  `--keyring-migration-from-component`

  <table><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--keyring-migration-from-component[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Indica que uma migração de chave é de um componente do pendrive de chave para um plugin do pendrive de chave. Esta opção permite migrar chaves de um componente do pendrive de chave para um plugin do pendrive de chave.

  Para migração de um plugin do pendrive de chave para um componente do pendrive de chave, use a opção `--keyring-migration-to-component`. Para migração de chave de um componente do pendrive de chave para outro, use o utilitário `mysql_migrate_keyring`. Consulte  Seção 8.4.4.11, “Migrar Chaves entre Pendrives de Chave”.

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keyring-migration-host=nome_do_host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  A localização do host do servidor em execução que está atualmente usando um dos keystores de armazenamento de chaves de migração. Consulte a Seção 8.4.4.11, “Migrar chaves entre keystores de armazenamento de chaves de keyring”. A migração sempre ocorre no host local, portanto, a opção sempre especifica um valor para conectar a um servidor local, como `localhost`, `127.0.0.1`, `::1`, ou o endereço IP do host local ou o nome do host.
*  `--keyring-migration-password[=senha]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keyring-migration-password[=senha]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha da conta MySQL usada para conectar ao servidor em execução que está atualmente usando um dos keystores de armazenamento de chaves de migração. Consulte a Seção 8.4.4.11, “Migrar chaves entre keystores de armazenamento de chaves de keyring”.

  O valor da senha é opcional. Se não for fornecido, o servidor solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--keyring-migration-password=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Consulte a Seção 8.1.2.1, “Diretrizes do usuário final para segurança de senhas”. Você pode usar um arquivo de opção para evitar fornecer a senha na linha de comando. Nesse caso, o arquivo deve ter um modo restritivo e ser acessível apenas para a conta usada para executar o servidor de migração.
*  `--keyring-migration-port=número_de_porta`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keyring-migration-port=número_de_porta</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>3306</code></td> </tr></tbody></table>

Para conexões TCP/IP, o número de porta para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves. Veja a Seção 8.4.4.11, “Migrar Chaves Entre Keystores de Keyring”.
*  `--keyring-migration-socket=caminho`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--keyring-migration-socket={nome_arquivo|nome_pipe}</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para conexões de socket Unix ou pipes nomeados do Windows, o arquivo de socket ou o pipe nomeado para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves. Veja a Seção 8.4.4.11, “Migrar Chaves Entre Keystores de Keyring”.
*  `--keyring-migration-source=plugin`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--keyring-migration-source=nome_plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O plugin de keyring de origem para migração de chaves. Veja a Seção 8.4.4.11, “Migrar Chaves Entre Keystores de Keyring”.

  O valor da opção é semelhante ao da opção `--plugin-load`, exceto que apenas uma biblioteca de plugins pode ser especificada. O valor é dado como *`plugin_library`* ou *`name`*=`*`plugin_library`, onde *`plugin_library`* é o nome de um arquivo de biblioteca que contém o código do plugin, e *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugins tiver um nome sem qualquer nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugins no diretório nomeado pela variável de sistema `plugin_dir`.

  ::: info Nota

   `--keyring-migration-source` e `--keyring-migration-destination` são obrigatórios para todas as operações de migração de keyring. Os plugins de origem e destino devem ser diferentes, e o servidor de migração deve suportar ambos os plugins.

  :::

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keyring-migration-to-component[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Indica que a migração de uma chave é de um plugin de chaveiro para um componente de chaveiro. Esta opção permite migrar chaves de um plugin de chaveiro para um componente de chaveiro.

  Para a migração de um componente de chaveiro para um plugin de chaveiro, use a opção `--keyring-migration-from-component`. Para a migração de uma chave de um componente de chaveiro para outro, use o utilitário `mysql_migrate_keyring`. Consulte a Seção 8.4.4.11, “Migrar Chaves Entre Keystores de Chaveiro”.
*  `--keyring-migration-user=user_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keyring-migration-user=user_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome de usuário da conta MySQL usada para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaveiro. Consulte a Seção 8.4.4.11, “Migrar Chaves Entre Keystores de Chaveiro”.