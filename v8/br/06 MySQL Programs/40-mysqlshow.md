### 6.5.6 `mysqlshow` — Exibir Informações de Banco de Dados, Tabela e Coluna

O cliente `mysqlshow` pode ser usado para ver rapidamente quais bancos de dados existem, suas tabelas ou colunas de uma tabela ou índices.

O `mysqlshow` fornece uma interface de linha de comando para várias instruções `SHOW` SQL. As mesmas informações podem ser obtidas usando diretamente essas instruções. Por exemplo, você pode executá-las a partir do programa cliente `mysql`.

Invoque `mysqlshow` da seguinte forma:

```
mysqlshow [options] [db_name [tbl_name [col_name]]]
```

* Se nenhum banco de dados for fornecido, uma lista de nomes de bancos de dados é exibida.
* Se nenhuma tabela for fornecida, todas as tabelas correspondentes no banco de dados são exibidas.
* Se nenhuma coluna for fornecida, todas as colunas e tipos de coluna correspondentes na tabela são exibidas.

A saída exibe apenas os nomes dos bancos de dados, tabelas ou colunas para os quais você tem algum privilégio.

Se o último argumento contiver caracteres curinga de shell ou SQL (`*`, `?`, `%` ou `_`) ou sublinhados, apenas esses nomes que correspondem ao curinga são exibidos. Se um nome de banco de dados contiver sublinhados, eles devem ser escapados com uma barra invertida (algumas caixas de entrada Unix exigem duas) para obter uma lista das tabelas ou colunas corretas. Os caracteres `*` e `?` são convertidos em caracteres curinga SQL `%` e `_`. Isso pode causar alguma confusão quando você tenta exibir as colunas de uma tabela com um `_` no nome, porque, neste caso, `mysqlshow` mostra apenas os nomes das tabelas que correspondem ao padrão. Isso é facilmente corrigido adicionando um `%` extra no final da linha de comando como um argumento separado.

O `mysqlshow` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlshow]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.15 Opções `mysqlshow`**

<table>
   <thead>
      <tr>
         <th>Nome da Opção</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>--bind-address</code></td>
         <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
      </tr>
      <tr>
         <td><code>--character-sets-dir</code></td>
         <td>Diretório onde os conjuntos de caracteres podem ser encontrados</td>
      </tr>
      <tr>
         <td><code>--compress</code></td>
         <td>Compressar todas as informações enviadas entre o cliente e o servidor</td>
      </tr>
      <tr>
         <td><code>--compression-algorithms</code></td>
         <td>Algoritmos de compressão permitidos para conexões com o servidor</td>
      </tr>
      <tr>
         <td><code>--count</code></td>
         <td>Mostrar o número de linhas por tabela</td>
      </tr>
      <tr>
         <td><code>--debug</code></td>
         <td>Escrever o log de depuração</td>
      </tr>
      <tr>
         <td><code>--debug-check</code></td>
         <td>Imprimir informações de depuração quando o programa sair</td>
      </tr>
      <tr>
         <td><code>--debug-info</code></td>
         <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sair</td>
      </tr>
      <tr>
         <td><code>--default-auth</code></td>
         <td>Plugin de autenticação a ser usado</td>
      </tr>
      <tr>
         <td><code>--default-character-set</code></td>
         <td>Especificar o conjunto de caracteres padrão</td>
      </tr>
      <tr>
         <td><code>--defaults-extra-file</code></td>
         <td>Ler o arquivo de opções nomeadas além dos arquivos de opções usuais</td>
      </tr>
      <tr>
         <td><code>--defaults-file</code></td>
         <td>Ler apenas o arquivo de opções nomeadas</td>
      </tr>
      <tr>
         <td><code>--defaults-group-suffix</code></td>
         <td>Valor do sufixo do grupo de opções</td>
      </tr>
      <tr>
         <td><code>--enable-cleartext-plugin</code></td>
         <td>Habilitar o plugin de autenticação sem criptografia</td>
      </tr>
      <tr>
         <td><code>--get-server-public-key</code></td>
         <td>Solicitar a chave pública RSA do servidor</td>
      </tr>
      <tr>
         <td><code>--help</code></td>
         <td>Mostrar a mensagem de ajuda e sair</td>
      </tr>
      <tr>
         <td><code>--host</code></td>
         <td>O host em que o servidor MySQL está localizado</td>
      </tr>
      <tr>
         <td><code>--keys</code></td>
         <td>Mostrar índices de tabelas</td>
      </tr>
      <tr>
         <td><code>--login-path</code></td>
         <td>Ler as opções de caminho de login a partir de .mylogin.cnf</td>
      </tr>
      <tr>
         <td><code>--no-defaults</code></td>
         <td>Ler nenhum arquivo de opções</td>
      </tr>
      <tr>
         <td><code>--no-login-paths</code></td>
         <td>Não ler caminhos de login do arquivo de caminhos de login</td>
      </tr>
      <tr>
         <td><code>--password</code></td>
         <td>Senha a ser usada ao se conectar ao servidor</td>
      </tr>
      <tr>
         <td><code>--password1</code></td>
         <td>Primeira senha de autenticação multifator a ser usada ao se conectar ao servidor</td>
      </tr>
      <tr>
         <td><code>--password2</code></td>
         <td>Segunda senha de autenticação multifator a ser usada ao se conectar ao servidor</td>
      </tr>
      <tr>
         <td><code>--password3</code></td>
         <td>Terceira senha de autenticação multifator a ser usada ao se conectar ao servidor</td>
      </tr>
      <tr>
         <td><code>--pipe</code></td>
         <td>Conectar-se ao servidor usando um pipe nomeado (apenas Windows)</td>
      </tr>
      <tr>
         <td><code>--plugin-dir</code></td>
         <td>Diretório onde os plugins estão instalados</td>
      </tr>
      <tr>
         <td><code>--port</code></td>
         <td>Número de porta TCP/IP para a conexão</td>
      </tr>
      <tr>
         <td><code>--print-defaults</code></td>
         <td>Imprimir as opções padrão</td>
      </tr>
      <tr>
         <td><code>--protocol</code></td>
         <td>Protocolo de transporte a ser usado</td>
      </tr>
      <tr>
         <td><code>--server-public-key-path</code></td>
         <td>Nome do arquivo que contém a chave pública RSA do servidor</td>
      </tr>
      <tr>
         <td><code>--shared-memory-base-name</code></td>
         <td>Nome da base de memória compartilhada (apenas Windows)</td>
      </tr>
      <tr>
         <td><code>--show-table-type</code></td>
         <td>Mostrar uma coluna indicando o

* `--help`, `-?`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.
* `--bind-address=ip_address`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.
* `--character-sets-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres estão instalados. Consulte a Seção 12.15, “Configuração de Conjunto de Caracteres”.
* `--compress`, `-C`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.
* `--compression-algorithms=value`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor padrão</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>zlib</code></p><p><code>zstd</code></p><p><code>uncompressed</code></p></td> </tr></tbody></table>

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos que a variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para obter mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.
*  `--count`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--count</code></td> </tr></tbody></table>

  Mostre o número de linhas por tabela. Isso pode ser lento para tabelas que não são do tipo `MyISAM`.
*  `--debug[=debug_options]`, `-# [debug_options]`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O valor padrão é `d:t:o`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--debug-check`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--debug-info`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--default-character-set=charset_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Use *`charset_name`* como o conjunto de caracteres padrão. Veja  Seção 12.15, “Configuração do Conjunto de Caracteres”.
*  `--default-auth=plugin`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja  Seção 8.2.17, “Autenticação Extensível”.
*  `--defaults-extra-file=file_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Leia este arquivo de opções após o arquivo de opções globais, mas (no Unix) antes do arquivo de opções do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte  Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.
*  `--defaults-file=file_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas o arquivo de opções fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `file_name` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte  Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.
*  `--defaults-group-suffix=str`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, `mysqlshow` normalmente lê os grupos `[client]` e `[mysqlshow]` . Se esta opção for dada como `--defaults-group-suffix=_other`, `mysqlshow` também lê os grupos `[client_other]` e `[mysqlshow_other]` .

Para informações adicionais sobre isso e outras opções de arquivo de opção, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
*  `--enable-cleartext-plugin`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Ative o plugin de autenticação de texto claro `mysql_clear_password` . (Consulte Seção 8.4.1.4, “Autenticação de texto claro plugável do lado do cliente”.)
*  `--get-server-public-key`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr></tbody></table>

  Peça ao servidor a chave pública RSA que ele usa para a troca de senhas baseada em pares de chaves. Esta opção se aplica a clientes que se conectam ao servidor usando uma conta que autentica com o plugin `caching_sha2_password`. Para conexões por tais contas, o servidor não envia a chave pública ao cliente a menos que seja solicitado. A opção é ignorada para contas que não autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for necessária, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for dado e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte Seção 8.4.1.2, “Autenticação plugável SHA-2 de cache”.
*  `--host=host_name`, `-h host_name`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--host=nome_do_host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  Conecte-se ao servidor MySQL no host fornecido.
*  `--keys`, `-k`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keys</code></td> </tr></tbody></table>

  Mostre os índices das tabelas.
*  `--login-path=nome`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--login-path=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Leia as opções do caminho de login especificado no arquivo de caminho de login `.mylogin.cnf`. Um "caminho de login" é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário `mysql_config_editor`.

  Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
*  `--no-login-paths`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

  Ignora a leitura de opções do arquivo de caminho de login.

  Veja `--login-path` para informações relacionadas.

  Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
*  `--no-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não leia nenhum arquivo de opção. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção, `--no-defaults` pode ser usado para evitar que sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário `mysql_config_editor`. Veja a Seção 6.6.7, “`mysql_config_editor` — Ferramenta de Configuração do MySQL”.

Para obter informações adicionais sobre esta e outras opções de arquivo, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
*  `--password[=password]`, `-p[password]`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysqlshow` solicitará uma. Se for fornecido, não deve haver *espaço* entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o `mysqlshow` não deve solicitar uma, use a opção `--skip-password`.
*  `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysqlshow` solicitará uma. Se for fornecido, não deve haver *espaço* entre `--password1=` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança de Senhas”.

Para especificar explicitamente que não há senha e que o `mysqlshow` não deve solicitar uma senha, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.
*  `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica de `--password1`; consulte a descrição dessa opção para detalhes.
*  `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica de `--password1`; consulte a descrição dessa opção para detalhes.
*  `--pipe`, `-W`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
*  `--plugin-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o `mysqlshow` não o encontrar. Consulte a Seção 8.2.17, “Autenticação Personalizável”.
*  `--port=port_num`, `-P port_num`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Número</number></td> </tr><tr><th>Valor padrão</th> <td><code>3306</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado.
*  `--print-defaults`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivos de opção, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
*  `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--protocol=type</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[ver texto]</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>TCP</code></p><p><code>SOCKET</code></p><p><code>PIPE</code></p><p><code>MEMORY</code></p></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para detalhes sobre os valores permitidos, consulte Seção 6.2.7, “Protocolos de transporte de conexão”.
*  `--server-public-key-path=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--server-public-key-path=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para `sha256_password` (desatualizado), esta opção só se aplica se o MySQL foi compilado usando o OpenSSL.

Para obter informações sobre os módulos `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação com Autenticação Personalizável SHA-256” e a Seção 8.4.1.2, “Autenticação com Autenticação SHA-2 Personalizável”.
*  `--shared-memory-base-name=name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--shared-memory-base-name=name</code></td> </tr><tr><th>Especifica Plataforma</th> <td>Windows</td> </tr></tbody></table>

  Em Windows, o nome da memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome da memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões com memória compartilhada.
*  `--show-table-type`, `-t`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--show-table-type</code></td> </tr></tbody></table>

  Mostre uma coluna indicando o tipo de tabela, como em `SHOW FULL TABLES`. O tipo é `BASE TABLE` ou `VIEW`.
*  `--socket=path`, `-S path`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--socket={file_name|pipe_name}</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, em Windows, o nome do pipe nomeado a ser usado.

  Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões com pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
* `--ssl*`

  Opções que começam com `--ssl` especificam se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de Comando para Conexões Criptografadas.
*  `--ssl-fips-mode={OFF|ON|STRICT}`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>STRICT</code></p></td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Consulte  Seção 8.8, “Suporte FIPS”.

  Esses valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  ::: info Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

  :::

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.
*  `--status`, `-i`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--status</code></td> </tr></tbody></table>

  Exibir informações extras sobre cada tabela.
*  `--tls-ciphersuites=ciphersuite_list`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--tls-ciphersuites=ciphersuite_list</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Os ciphersuites permitidos para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de ciphersuites separados por vírgula. Os ciphersuites que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte Seção 8.3.2, “Protocolos e Criptografadores TLS de Conexão Criptografada”.
*  `--tls-sni-servername=server_name`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-sni-servername=servername</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome de servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que essa opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.
*  `--tls-version=lista_protocolos`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-version=lista_protocolos</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><p class="valor-válido"><code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code> (OpenSSL 1.1.1 ou superior)</p><p class="valor-válido"><code>TLSv1,TLSv1.1,TLSv1.2</code> (caso contrário)</p></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para essa opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de Conexão Criptografada”.
*  `--user=nome_do_usuario`, `-u nome_do_usuario`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--user=nome_do_usuario,</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome do usuário da conta MySQL a ser usado para se conectar ao servidor.
*  `--verbose`, `-v`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose. Imprima mais informações sobre o que o programa faz. Esta opção pode ser usada várias vezes para aumentar a quantidade de informações.
*  `--version`, `-V`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--version</code></td> </tr></tbody></table>

  Exibir informações da versão e sair.
*  `--zstd-compression-level=level`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--zstd-compression-level=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr></tbody></table>

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão é 3. O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.