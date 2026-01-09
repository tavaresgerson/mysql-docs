### 6.5.6 mysqlshow — Exibir informações de banco de dados, tabela e coluna

O cliente **mysqlshow** pode ser usado para ver rapidamente quais bancos de dados existem, suas tabelas ou colunas de uma tabela ou índices.

O **mysqlshow** fornece uma interface de linha de comando para várias instruções **SHOW** do SQL. Veja a Seção 15.7.7, “Instruções SHOW”. As mesmas informações podem ser obtidas usando diretamente essas instruções. Por exemplo, você pode executá-las a partir do programa cliente **mysql**.

Inicie o **mysqlshow** da seguinte forma:

```
mysqlshow [options] [db_name [tbl_name [col_name]]]
```

* Se nenhum banco de dados for fornecido, uma lista de nomes de bancos de dados é exibida.
* Se nenhuma tabela for fornecida, todas as tabelas correspondentes no banco de dados são exibidas.

* Se nenhuma coluna for fornecida, todas as colunas e tipos de coluna correspondentes na tabela são exibidas.

A saída exibe apenas os nomes dos bancos de dados, tabelas ou colunas para os quais você tem algum privilégio.

Se o último argumento contiver caracteres curinga de shell ou SQL (`*`, `?`, `%` ou `_`) ou traços de escape, apenas esses nomes que correspondem ao curinga são exibidos. Se um nome de banco de dados contiver underscores, esses devem ser escapados com uma barra invertida (algumas caixas de entrada Unix exigem duas) para obter uma lista das tabelas ou colunas corretas. Os caracteres `*` e `?` são convertidos em caracteres curinga SQL `%` e `_`. Isso pode causar alguma confusão quando você tenta exibir as colunas de uma tabela com um `_` no nome, porque, neste caso, o **mysqlshow** mostra apenas os nomes das tabelas que correspondem ao padrão. Isso é facilmente corrigido adicionando um `%` extra no final da linha de comando como um argumento separado.

O **mysqlshow** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlshow]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, veja a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.15 Opções mysqlshow**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlshow">
<tr><th>Nome da Opção</th><th>Descrição</th></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_bind-address">--bind-address</a></td><td>Use a interface de rede especificada para se conectar ao servidor MySQL</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_character-sets-dir">--character-sets-dir</a></td><td>Diretório onde os conjuntos de caracteres podem ser encontrados</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_compress">--compress</a></td><td>Compressar todas as informações enviadas entre o cliente e o servidor</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_compression-algorithms">--compression-algorithms</a></td><td>Algoritmos de compressão permitidos para conexões com o servidor</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_count">--count</a></td><td>Mostrar o número de linhas por tabela</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_debug">--debug</a></td><td>Escrever log de depuração</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_debug-check">--debug-check</a></td><td>Imprimir informações de depuração quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_debug-info">--debug-info</a></td><td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_default-character-set">--default-character-set</a></td><td>Especificar o conjunto de caracteres padrão</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_defaults-extra-file">--defaults-extra-file</a></td><td>Ler o arquivo de opção nomeado em adição aos arquivos de opção usuais</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_defaults-file">--defaults-file</a></td><td>Ler apenas o arquivo de opção nomeado</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_defaults-group-suffix">--defaults-group-suffix</a></td><td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_enable-cleartext-plugin">--enable-cleartext-plugin</a></td><td>Habilitar o plugin de autenticação clara</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_get-server-public-key">--get-server-public-key</a></td><td>Solicitar a chave pública RSA do servidor</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_help">--help</a></td><td>Exibir a mensagem de ajuda e sair</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_host">--host</a></td><td>Host em que o servidor MySQL está localizado</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_keys">--keys</a></td><td>Mostrar índices da tabela</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_login-path">--login-path</a></td><td>Ler as opções de caminho de login a partir de .mylogin.cnf</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_no-defaults">--no-defaults</a></td><td>Ler sem arquivos de opção</td></tr>
<tr><td><a class="link" href="mysqlshow.html#option_mysqlshow_no-login-paths">--no-login-paths

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></table>

  Exibir uma mensagem de ajuda e sair.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></table>

  O diretório onde os conjuntos de caracteres estão instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para compress"><tr><th>Formato de Linha de Comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 6.2.8, “Controle de Compressão da Conexão”.

Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legado.

* `--compression-algorithms=valor`

  <table frame="box" rules="all" summary="Propriedades para compressão-algoritmos"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--compression-algorithms=valor</code></td> </tr><tr><th>Tipo</th> <td>Definível</td> </tr><tr><th>Valor Padrão</th> <td><code>não comprimido</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>não comprimido</code></p></td> </tr></tbody></table>

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `não comprimido`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

* `--count`

  <table frame="box" rules="all" summary="Propriedades para count"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--count</code></td> </tr></tbody></table>

  Mostrar o número de linhas por tabela. Isso pode ser lento para tabelas que não são `MyISAM`.

* `--debug[=opções_de_debug]`, `-# [opções_de_debug]`

  <table frame="box" rules="all" summary="Propriedades para debug"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug[=opções_de_debug]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>d:t:o</code></td> </tr></tbody></table>

Escreva um log de depuração. Uma string típica de `*debug_options*` é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o`.

Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para debug-check"><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Propriedades para debug-info"><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação Extensível”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opção, veja a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

Para obter informações adicionais sobre esta e outras opções de arquivo, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Leia não apenas os grupos de opções habituais, mas também grupos com os nomes habituais e um sufixo de `str`. Por exemplo, o **mysqlshow** normalmente lê os grupos `[client]` e `[mysqlshow]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o **mysqlshow** também lê os grupos `[client_other]` e `[mysqlshow_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opção”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Ative o plugin de autenticação de texto claro `mysql_clear_password` (consulte a Seção 8.4.1.3, “Autenticação de texto claro plugável do lado do cliente”).

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

Solicitar a chave pública RSA que o servidor usa para a troca de senhas baseada em pares de chaves. Esta opção se aplica a clientes que se conectam ao servidor usando uma conta que autentica com o plugin de autenticação `caching_sha2_password`. Para conexões por tais contas, o servidor não envia a chave pública ao cliente a menos que seja solicitado. A opção é ignorada para contas que não autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for necessária, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.1, “Cacheamento de Autenticação SHA-2 Pluggable”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Conectar-se ao servidor MySQL no host fornecido.

* `--keys`, `-k`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Mostrar índices de tabela.

* `--login-path=name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um "caminho de login" é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para obter informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Ignora a leitura de opções do arquivo de caminho de login.

  Veja `--login-path` para informações relacionadas.

  Para obter informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção, `--no-defaults` pode ser usado para impedir que sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para obter informações adicionais sobre essa e outras opções de arquivo, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tr><th>Formato de Linha de Comando</th><td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlshow** solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o **mysqlshow** não deve solicitar uma, use a opção `--skip-password`.

A senha para o fator de autenticação multifatorial 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlshow** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

Para especificar explicitamente que não há senha e que o **mysqlshow** não deve solicitar uma senha, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

  A senha para o fator de autenticação multifatorial 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.

* `--password3[=pass_val]`

  A senha para o fator de autenticação multifatorial 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor tiver sido iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlshow** não o encontrar. Veja a Seção 8.2.17, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivos de opção, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

<table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O nome do caminho para um arquivo em formato PEM contendo uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção se aplica apenas se o MySQL foi compilado usando OpenSSL.

  Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.2, “Autenticação Personalizável SHA-256” e a Seção 8.4.1.1, “Autenticação Personalizável SHA-2”.

* `--shared-memory-base-name=name`

<table frame="box" rules="all" summary="Propriedades para bind-address">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--bind-address=ip_address</code></td>
  </tr>
</table>

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--show-table-type`, `-t`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--character-sets-dir=path</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>[none]</code></td>
    </tr>
  </tbody></table>

  Mostre uma coluna indicando o tipo de tabela, como em `SHOW FULL TABLES`. O tipo é `BASE TABLE` ou `VIEW`.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--character-sets-dir=path</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>[none]</code></td>
    </tr>
  </tbody></table>

  Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, em Windows, o nome do pipe nomeado a ser usado.

Em Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

  As opções que começam com `--ssl` especificam se a conexão com o servidor deve ser feita usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de Comando para Conexões Criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja Seção 8.8, “Suporte FIPS”.

  Esses valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  Observação

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente emita uma mensagem de aviso no momento do inicialização e opere no modo não FIPS.

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.

* `--status`, `-i`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--character-sets-dir=caminho</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>[nenhum]</code></td>
  </tr>
  </tbody>
</table>

  Exibir informações extras sobre cada tabela.

* `--tls-ciphersuites=lista_ciphersuites`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--character-sets-dir=caminho</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code>[nenhum]</code></td>
    </tr>
  </tbody>
  </table>

  As suitas de cifra permitidas para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de suitas de cifra separados por vírgula. As suitas de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e suitas de cifra TLS de Conexão Criptografada”.

* `--tls-sni-servername=nome_do_servidor`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--character-sets-dir=caminho</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code>[nenhum]</code></td>
    </tr>
  </tbody>
  </table>

Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que essa opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para essa opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e Cifras TLS de Conexão Criptografada”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O nome do usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--verbose`, `-v`

<table frame="box" rules="all" summary="Propriedades para character-sets-dir">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--character-sets-dir=caminho</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>[nenhum]</code></td>
  </tr>
</table>

  Modo detalhado. Imprima mais informações sobre o que o programa faz. Esta opção pode ser usada várias vezes para aumentar a quantidade de informações.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--character-sets-dir=caminho</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>[nenhum]</code></td>
    </tr>
  </table>

  Exibir informações da versão e sair.

* `--zstd-compression-level=nível`

  <table frame="box" rules="all" summary="Propriedades para compress">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--compress[={OFF|ON}]</code></td>
    </tr>
    <tr>
      <th>Desatualizado</th>
      <td>Sim</td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Booleano</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>OFF</code></td>
    </tr>
  </table>

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.

Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.