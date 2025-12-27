#### 6.5.8.1 Opções

O **mysqldm** aceita as opções padrão de conexão do MySQL e várias opções específicas do **mysqldm**.

##### Opções específicas do **mysqldm**

**Tabela 6.17 Opções do **mysqldm****

<table frame="box" rules="all" summary="Referência para opções do mysqldm.">
<tr><th>Nome da Opção</th> <th>Descrição</th> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_authentication-oci-client-config-profile">--authentication-oci-client-config-profile</a></td> <td>Nome do perfil OCI definido no arquivo de configuração OCI a ser usado</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_authentication-openid-connect-client-id-token-file">--authentication-openid-connect-client-id-token-file</a></td> <td>Caminho completo do arquivo de token de identidade OpenID Connect do cliente</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_character-sets-dir">--character-sets-dir</a></td> <td>Diretório onde os conjuntos de caracteres são instalados</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_compress">--compress</a></td> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_compression-algorithms">--compression-algorithms</a></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_debug">--debug</a></td> <td>Escrever o log de depuração; suportado apenas se o MySQL foi compilado com suporte a depuração</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_default-auth">--default-auth</a></td> <td>Plugin de autenticação a ser usado</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_defaults-extra-file">--defaults-extra-file</a></td> <td>Ler o arquivo de opção adicional além dos arquivos de opção usuais</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_defaults-file">--defaults-file</a></td> <td>Ler o arquivo de opção apenas</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_delay">--delay</a></td> <td>Número de segundos entre iterações</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Ativar o plugin de autenticação sem criptografia</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_get-server-public-key">--get-server-public-key</a></td> <td>Solicitar a chave pública do servidor do servidor</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_help">--help</a></td> <td>Exibir a mensagem de ajuda e sair</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_host">--host</a></td> <td>Host em que o servidor MySQL está localizado</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_iterations">--iterations</a></td> <td>Número de iterações</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_login-path">--login-path</a></td> <td>Ler as opções de caminho de login a partir de .mylogin.cnf</td> </tr>
<tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_no-defaults">--no-defaults</a></td> <td>Ler sem arquivos de opção</td> </tr>
<tr><td><a class="link"

* `--delay=númeroDeSegundos`

  <table frame="box" rules="all" summary="Propriedades para delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">30</code></td> </tr></tbody></table>

  O tempo de atraso entre as iterações de diagnóstico, em segundos.

* `--iterations=númeroDeIterações`

  <table frame="box" rules="all" summary="Propriedades para iterações"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">10</code></td> </tr></tbody></table>

  O número de iterações de diagnóstico.

* `--output-dir=caminho`

  <table frame="box" rules="all" summary="Propriedades para output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--output-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">.</code></td> </tr></tbody></table>

  O caminho onde o arquivo de diagnóstico é gerado. Um diretório temporário contendo os arquivos gerados é criado nesse local e, em seguida, excluído quando os diagnósticos estiverem completos e o arquivo gerado.

##### Opções do servidor mysqldm

Esta seção lista as opções comuns do servidor usadas pelo **mysqldm**.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--authentication-oci-client-config-profile`

  <table frame="box" rules="all" summary="Propriedades para authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Especifique o nome do perfil de configuração OCI a ser usado. Se não for definido, o perfil padrão é usado.

* `--authentication-openid-connect-client-id-token-file`

  <table frame="box" rules="all" summary="Propriedades para authentication-openid-connect-client-id-token-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Para OpenID Connect, isso define o token de identidade necessário para autenticar com um usuário mapeado no MySQL. É o caminho completo do arquivo do token de identidade usado ao se conectar ao servidor MySQL. Para informações adicionais, consulte a Seção 8.4.1.9, “Autenticação Plugável OpenID Connect”.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--compress`, `-C`

<table frame="box" rules="all" summary="Propriedades para compressão">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--compress[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">OFF</code></td>
  </tr>
  </tbody>
</table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de compressão de conexão”.

  Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Consulte Configurando a compressão de conexão legada.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Propriedades para compression-algorithms">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--compression-algorithms=value</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Conjunto</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">uncompressed</code></td>
    </tr>
    <tr>
      <th>Valores válidos</th>
      <td><p class="valid-value"><code class="literal">zlib</code></p><p class="valid-value"><code class="literal">zstd</code></p><p class="valid-value"><code class="literal">uncompressed</code></p></td>
    </tr>
  </table>

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.

* `--debug[=debug_options]`, `-# [debug_options]`

<table frame="box" rules="all" summary="Propriedades para atraso">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--delay=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">30</code></td> </tr>
</table>0

  <table frame="box" rules="all" summary="Propriedades para atraso">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--default-auth=plugin</code></td> </tr>
  <tr><th>Tipo</th> <td>Plugin de autenticação do lado do cliente</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">plugin</code></td> </tr>
</table>1

  Uma dica sobre qual plugin de autenticação do lado do cliente usar. Veja a Seção 8.2.17, “Autenticação Personalizável”.

  <table frame="box" rules="all" summary="Propriedades para atraso">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-extra-file=file_name</code></td> </tr>
  <tr><th>Tipo</th> <td>Arquivo de configuração adicional</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">file_name</code></td> </tr>
</table>2

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de configuração”.

* `--defaults-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para delay"><tr><th>Formato de linha de comando</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">30</code></td> </tr></table>3

  Use apenas o arquivo de configuração fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se `nome_do_arquivo` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de configuração”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para delay"><tr><th>Formato de linha de comando</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">30</code></td> </tr></table>4

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysql** normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysql** também lê os grupos `[client_other]` e `[mysql_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de configuração”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para atraso"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">30</code></td> </tr></tbody></table>5

  Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Consulte a Seção 8.4.1.3, “Autenticação Pluggable de Texto Claro do Cliente”).

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para atraso"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">30</code></td> </tr></tbody></table>6

  Peça à servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.1, “Autenticação Pluggable SHA-2”.

* `--host=host_name`, `-h host_name`

Conecte-se ao servidor MySQL no host fornecido.

* `--login-path=nome`

  <table frame="box" rules="all" summary="Propriedades para atraso"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">30</code></td> </tr></tbody></table>8

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um "caminho de login" é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de configuração do MySQL”.

  Para obter informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para atraso"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">30</code></td> </tr></tbody></table>9

  Ignora a leitura de opções do arquivo de caminho de login.

  Veja `--login-path` para informações relacionadas.

Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de opções de arquivo”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para iterações"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">10</code></td> </tr></tbody></table>0

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de opções de arquivo”.

* `--oci-config-file=PATH`

  <table frame="box" rules="all" summary="Propriedades para iterações"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">10</code></td> </tr></tbody></table>1

Caminho alternativo para o arquivo de configuração da Oracle Cloud Infrastructure CLI. Especifique a localização do arquivo de configuração. Se o perfil padrão existente for o correto, não é necessário especificar essa opção. No entanto, se houver um arquivo de configuração existente, com múltiplos perfis ou um valor padrão diferente do da entidade do usuário com quem deseja se conectar, especifique essa opção.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para iterações"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">10</code></td> </tr></tbody></table>2

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqldm** solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Consulte a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança de Senhas”.

* `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqldm** solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

`--password1` e `--password` são sinônimos.

* `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.

* `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para iterações"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da Linha de Comando</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">10</code></td> </tr></tbody></table>3

  No Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-authentication-kerberos-client-mode=value`

<table frame="box" rules="all" summary="Propriedades para iterações">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--iterations=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">10</code></td> </tr>
</table>4

  No Windows, o plugin de autenticação `authentication_kerberos_client` suporta essa opção do plugin. Ele fornece dois valores possíveis que o usuário do cliente pode definir em tempo de execução: `SSPI` e `GSSAPI`.

  O valor padrão para a opção do plugin do lado do cliente usa a Interface de Suporte de Suporte de Segurança (SSPI), que é capaz de adquirir credenciais do cache de memória do Windows. Alternativamente, o usuário do cliente pode selecionar um modo que suporte a Interface de Programa de Aplicação de Generic Security Service (GSSAPI) através da biblioteca MIT Kerberos no Windows. O GSSAPI é capaz de adquirir credenciais armazenadas anteriormente geradas usando o comando **kinit**.

  Para mais informações, consulte Comandos para Clientes do Windows no Modo GSSAPI.

* `--plugin-authentication-webauthn-client-preserve-privacy={OFF|ON}`

  <table frame="box" rules="all" summary="Propriedades para iterações">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--iterations=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor Padrão</th> <td><code class="literal">10</code></td> </tr>
  </table>5

Determina como as asserções são enviadas ao servidor caso haja mais de uma credencial detectável armazenada para um ID de RP específico (um nome único dado ao servidor da parte de confiança, que é o servidor MySQL). Se o dispositivo FIDO2 contiver várias chaves residentes para um ID de RP específico, essa opção permite que o usuário escolha a chave a ser usada para a asserção. Ela fornece dois valores possíveis que o usuário do cliente pode definir. O valor padrão é `OFF`. Se definido como `OFF`, o desafio é assinado por todas as credenciais disponíveis para um ID de RP específico e todas as assinaturas são enviadas ao servidor. Se definido como `ON`, o usuário é solicitado a escolher a credencial a ser usada para a assinatura.

Nota

Esta opção não tem efeito se o dispositivo não suportar a funcionalidade de chave residente.

Para mais informações, consulte a Seção 8.4.1.11, “Autenticação Personalizável WebAuthn”.

* `--plugin-authentication-webauthn-device=#`

  <table frame="box" rules="all" summary="Propriedades para iterações"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">10</code></td> </tr></tbody></table>6

  Determina qual dispositivo usar para a autenticação `libfido`. O padrão é o primeiro dispositivo (`0`).

Nota

Especificar um dispositivo inexistente gera um erro.

Para mais informações, consulte a Seção 8.4.1.11, “Autenticação Personalizável WebAuthn”.

* `--plugin-dir=dir_name`

<table frame="box" rules="all" summary="Propriedades para iterações">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--iterations=#</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">10</code></td>
  </tr>
</table>7

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqldm** não o encontrar. Veja a Seção 8.2.17, “Autenticação Personalizável”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para iterações">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--iterations=#</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Inteiro</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">10</code></td>
    </tr>
  </table>8

  Para conexões TCP/IP, o número de porta a ser usado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para iterações">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--iterations=#</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Inteiro</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">10</code></td>
    </tr>
  </table>9

  Imprimir o nome do programa e todas as opções que ele obtém de arquivos de opções.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

<table frame="box" rules="all" summary="Propriedades para output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--output-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">.</code></td> </tr></tbody></table>0

  O protocolo de transporte a ser usado para conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de transporte de conexão”.

* `--server-public-key-path=nome_arquivo`

  <table frame="box" rules="all" summary="Propriedades para output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--output-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">.</code></td> </tr></tbody></table>1

  O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=nome_arquivo` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção se aplica apenas se o MySQL foi compilado usando o OpenSSL.

Para obter informações sobre os módulos `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.2, “Autenticação com Autenticação Desbloqueada SHA-256” e a Seção 8.4.1.1, “Cache de Autenticação SHA-2 Desbloqueada”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Propriedades para output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--output-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">.</code></td> </tr></tbody></table>2

  Em Windows, o nome da memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é `MYSQL`. O nome da memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--output-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">.</code></td> </tr></tbody></table>3

  Para conexões com `localhost`, o arquivo de socket Unix a ser usado, ou, em Windows, o nome do pipe nomeado a ser usado.

  Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de Comando para Conexões Criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Propriedades para output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--output-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">.</code></td> </tr></tbody></table>4

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja Seção 8.8, “Suporte FIPS”.

  Esses valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  Observação

  Se o Módulo de Objeto FIPS do OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza uma mensagem de aviso no início e opere no modo não FIPS.

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Propriedades para output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--output-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">.</code></td> </tr></tbody></table>5

As suíte de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de suíte de cifra separados por vírgula. As suíte de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de Conexão Encriptada”.

* `--tls-sni-servername=server_name`

  <table frame="box" rules="all" summary="Propriedades para output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--output-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">.</code></td> </tr></tbody></table>6

  Quando especificada, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que esta opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.

* `--tls-version=lista_protocolos`

  <table frame="box" rules="all" summary="Propriedades para output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--output-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">.</code></td> </tr></tbody></table>7

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de Conexão Encriptada”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--output-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">.</code></td> </tr></tbody></table>8

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--output-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">.</code></td> </tr></tbody></table>9

  Exibir informações de versão e sair.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Propriedades de ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--help</code></td> </tr></tbody></table>0

  O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis de compressão crescentes. O nível de compressão padrão `zstd` é 3. A configuração do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.

Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.