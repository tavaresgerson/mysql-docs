#### 8.4.5.18 Opções de comando do cartela de chave

O MySQL suporta as seguintes opções de linha de comando relacionadas ao cartela de chave:

* `--keyring-migration-destination=plugin`

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-destination"><tbody><tr><th>Formato da linha de comando</th> <td><code class="literal">--keyring-migration-destination=plugin_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O plugin ou componente do cartela de chave de destino para migração de chaves. Veja a Seção 8.4.5.14, “Migrar chaves entre cartelas de chave de armazenamento”. A interpretação do valor da opção depende de se `--keyring-migration-to-component` ou `--keyring-migration-from-component` é especificado:

  + Se `--keyring-migration-to-component` for usado, o valor da opção é um plugin do cartela de chave, interpretado da mesma maneira que para `--keyring-migration-source`.

  + Se `--keyring-migration-to-component` for usado, o valor da opção é um componente do cartela de chave, especificado como o nome da biblioteca do componente no diretório do plugin, incluindo qualquer extensão específica da plataforma, como `.so` ou `.dll`.

  Nota

  `--keyring-migration-source` e `--keyring-migration-destination` são obrigatórios para todas as operações de migração do cartela de chave. A fonte e o destino devem ser diferentes, e o servidor de migração deve suportar ambos.

* `--keyring-migration-from-component`

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-from-component"><tbody><tr><th>Formato da linha de comando</th> <td><code class="literal">--keyring-migration-from-component[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

Indica que uma migração importante é de um componente de chaveiro para um plugin de chaveiro. Esta opção permite migrar chaves de um componente de chaveiro para um plugin de chaveiro.

Para a migração de um plugin de chaveiro para um componente de chaveiro, use a opção `--keyring-migration-to-component`. Para a migração de chaves de um componente de chaveiro para outro, use o utilitário **mysql\_migrate\_keyring**. Veja a Seção 8.4.5.14, “Migrando Chaves Entre Keystores de Chaveiro”.

* `--keyring-migration-host=host_name`

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-host">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--keyring-migration-host=host_name</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor Padrão</th> <td><code class="literal">localhost</code></td> </tr>
  </table>

  A localização do servidor em execução que está atualmente usando um dos keystores de migração de chaves. Veja a Seção 8.4.5.14, “Migrando Chaves Entre Keystores de Chaveiro”. A migração sempre ocorre no host local, então a opção sempre especifica um valor para se conectar a um servidor local, como `localhost`, `127.0.0.1`, `::1`, ou o endereço IP ou nome do host do servidor local.

* `--keyring-migration-password[=password]`

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-password">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--keyring-migration-password[=password]</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
  </table>

A senha da conta MySQL usada para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves. Veja a Seção 8.4.5.14, “Migrar Chaves Entre Keystores de Keychain”.

O valor da senha é opcional. Se não for fornecido, o servidor solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--keyring-migration-password=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Veja a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança de Senhas”. Você pode usar um arquivo de opção para evitar fornecer a senha na linha de comando. Nesse caso, o arquivo deve ter um modo restritivo e ser acessível apenas para a conta usada para executar o servidor de migração.

* `--keyring-migration-port=port_num`

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-port"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--keyring-migration-port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">3306</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chaves. Veja a Seção 8.4.5.14, “Migrar Chaves Entre Keystores de Keychain”.

* `--keyring-migration-socket=caminho`

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-socket"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--keyring-migration-socket={file_name|pipe_name}</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Para conexões de arquivo de soquete Unix ou tubo nomeado do Windows, o arquivo de soquete ou o tubo nomeado para conectar ao servidor em execução que está atualmente usando um dos keystores de chave chave. Veja a Seção 8.4.5.14, “Migrando Chaves Entre Keystores de Keychain”.

* `--keyring-migration-source=plugin`

  <table frame="box" rules="all" summary="Propriedades para keyring-migration-source"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--keyring-migration-source=plugin_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O plugin de keychain de origem para migração de chaves. Veja a Seção 8.4.5.14, “Migrando Chaves Entre Keystores de Keychain”.

  O valor da opção é semelhante ao da opção `--plugin-load`, exceto que apenas uma biblioteca de plugins pode ser especificada. O valor é dado como *`plugin_library`* ou *`name`=`*`plugin_library`*, onde *`plugin_library`* é o nome de um arquivo de biblioteca de plugins que contém o código do plugin, e *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugins for nomeada sem qualquer nome de plugin anterior, o servidor carrega todos os plugins na biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugins no diretório nomeado pela variável de sistema `plugin_dir`.

  Nota

  `--keyring-migration-source` e `--keyring-migration-destination` são obrigatórios para todas as operações de migração de keychain. Os plugins de origem e destino devem ser diferentes, e o servidor de migração deve suportar ambos os plugins.

* `--keyring-migration-to-component`

<table frame="box" rules="all" summary="Propriedades para migração de chave de um plugin de chave para um componente de chave"><tr><th>Formato de linha de comando</th> <td><code class="literal">--keyring-migration-to-component[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">OFF</code></td> </tr></table>

Indica que a migração de uma chave é de um plugin de chave para um componente de chave. Esta opção permite migrar chaves de um plugin de chave para um componente de chave.

Para a migração de um componente de chave para um plugin de chave, use a opção `--keyring-migration-from-component`. Para a migração de uma chave de um componente de chave para outro, use o utilitário **mysql\_migrate\_keyring**. Consulte a Seção 8.4.5.14, “Migração de Chaves entre Keystores de Chave”.

* `--keyring-migration-user=user_name`

<table frame="box" rules="all" summary="Propriedades para keyring-migration-user"><tr><th>Formato de linha de comando</th> <td><code class="literal">--keyring-migration-user=user_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

O nome de usuário da conta MySQL usada para se conectar ao servidor em execução que está atualmente usando um dos keystores de migração de chave. Consulte a Seção 8.4.5.14, “Migração de Chaves entre Keystores de Chave”.