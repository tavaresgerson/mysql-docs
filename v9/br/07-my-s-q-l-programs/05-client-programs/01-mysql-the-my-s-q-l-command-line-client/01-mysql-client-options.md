#### 6.5.1.1 Opções do Cliente do MySQL

O **mysql** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.10 Opções do Cliente do MySQL**

options.html#option_mysql_skip-output-header">--skip-output-header</a></td> <td>Skip output header</td> </tr><tr><td>--skip-query-output</td> <td>Skip query output</td> </tr><tr><td>--skip-result-set-metadata</td> <td>Skip result set metadata</td> </tr><tr><td>--skip-show-host-info</td> <td>Skip show host information</td> </tr><tr><td>--skip-show-server-info</td> <td>Skip show server information</td> </tr><tr><td>--skip-show-variables</td> <td>Skip show variables</td> </tr><tr><td>--skip-show-variables-in-output</td> <td>Skip show variables in output</td> </tr><tr><td>--skip-show-warnings</td> <td>Skip show warnings</td> </tr><tr><td>--skip-show-version</td> <td>Skip show version</td> </tr><tr><td>--skip-show-variables-in-output</td> <td>Skip show variables in output</td> </tr><tr><td>--skip-show-variables</td> <td>Skip show variables</td> </tr><tr><td>--skip-show-variables-in-output</td> <td>Skip show variables in output</td> </tr><tr><td>--skip-show-variables-in-output</td> <td>Skip show variables in output</td> </tr><tr><td>--skip-show-variables-in-output</td> <td>Skip show variables in output</td> </tr><tr><td>--skip-show-variables-in-output</td> <td>Skip show variables in output</td> </tr><tr><td>--skip-show-variables-in-output</td> <td>Skip show variables in output</td> </tr><tr><td>--skip-show-variables-in-output</td> <td>Skip show variables in output</td> </tr><tr><td>--skip-show-variables-in-output</td> <td>Skip show variables in output</td> </tr><tr><td>--skip-show-variables-in-output</td> <td>Skip show variables in output</td> </tr><tr><td>--skip-show-variables-in-output</td> <td>Skip

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></table>

  Exibir uma mensagem de ajuda e sair.

* `--authentication-oci-client-config-profile`

  <table frame="box" rules="all" summary="Propriedades para authentication-oci-client-config-profile"><tr><th>Formato de linha de comando</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

  Especificar o nome do perfil de configuração OCI a ser usado. Se não for definido, o perfil padrão é usado.

* `--authentication-openid-connect-client-id-token-file`

  <table frame="box" rules="all" summary="Propriedades para authentication-openid-connect-client-id-token-file"><tr><th>Formato de linha de comando</th> <td><code>--authentication-openid-connect-client-id-token-file</code></td> </tr></table>

  Para OpenID Connect, isso define o token de identidade necessário para autenticar com um usuário mapeado no MySQL. É um caminho completo para o arquivo do token de identidade usado ao se conectar ao servidor MySQL. Para informações adicionais, consulte a Seção 8.4.1.9, “OpenID Connect Pluggable Authentication”.

* `--auto-rehash`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tr><th>Formato de linha de comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></table>

Ative a rehashing automático. Esta opção está ativada por padrão, o que permite a conclusão de nomes de banco de dados, tabelas e colunas. Use `--disable-auto-rehash` para desativar o rehashing. Isso faz com que o **mysql** comece mais rápido, mas você deve emitir o comando `rehash` ou sua abreviação `\#` se quiser usar a conclusão de nomes.

Para completar um nome, insira a primeira parte e pressione Tab. Se o nome for inequívoco, o **mysql** o completa. Caso contrário, você pode pressionar Tab novamente para ver os nomes possíveis que começam com o que você digitou até agora. A conclusão não ocorre se não houver um banco de dados padrão.

Nota

Esta funcionalidade requer um cliente MySQL compilado com a biblioteca **readline**. Normalmente, a biblioteca **readline** não está disponível no Windows.

* `--auto-vertical-output`

  <table frame="box" rules="all" summary="Propriedades para auto-vertical-output"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Exiba os conjuntos de resultados verticalmente se eles forem muito largos para a janela atual e use o formato tabular normal caso contrário. (Isso se aplica a instruções terminadas por `;` ou `\G`.)

* `--batch`, `-B`

  <table frame="box" rules="all" summary="Propriedades para batch"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  Imprima os resultados usando tab como separador de colunas, com cada linha em uma nova linha. Com esta opção, o **mysql** não usa o arquivo de histórico.

O modo batch resulta em um formato de saída não tabular e na escapamento de caracteres especiais. O escapamento pode ser desativado usando o modo bruto; veja a descrição da opção `--raw`.

* `--binary-as-hex`

<table frame="box" rules="all" summary="Propriedades para binário como hexadecimal">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--binary-as-hex</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>FALSE no modo não interativo</code></td>
  </tr>
  </tbody>
</table>

  Quando esta opção é fornecida, o **mysql** exibe dados binários usando a notação hexadecimal (`0xvalue`). Isso ocorre independentemente do formato de exibição de saída geral ser tabular, vertical, HTML ou XML.

  `--binary-as-hex` quando habilitado afeta a exibição de todas as strings binárias, incluindo aquelas retornadas por funções como `CHAR()` e `UNHEX()`. O exemplo a seguir demonstra isso usando o código ASCII para `A` (65 decimal, 41 hexadecimal):

  + `--binary-as-hex` desabilitado:

    ```
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------+-------------+
    | CHAR(0x41) | UNHEX('41') |
    +------------+-------------+
    | A          | A           |
    +------------+-------------+
    ```

  + `--binary-as-hex` habilitado:

    ```
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------------------+--------------------------+
    | CHAR(0x41)             | UNHEX('41')              |
    +------------------------+--------------------------+
    | 0x41                   | 0x41                     |
    +------------------------+--------------------------+
    ```

  Para escrever uma expressão de string binária de modo que ela seja exibida como uma string de caracteres, independentemente de `--binary-as-hex` estar habilitado ou não, use essas técnicas:

  + A função `CHAR()` tem uma cláusula `USING charset`:

    ```
    mysql> SELECT CHAR(0x41 USING utf8mb4);
    +--------------------------+
    | CHAR(0x41 USING utf8mb4) |
    +--------------------------+
    | A                        |
    +--------------------------+
    ```

  + De forma mais geral, use `CONVERT()` para converter uma expressão para um conjunto de caracteres específico:

    ```
    mysql> SELECT CONVERT(UNHEX('41') USING utf8mb4);
    +------------------------------------+
    | CONVERT(UNHEX('41') USING utf8mb4) |
    +------------------------------------+
    | A                                  |
    +------------------------------------+
    ```

  Quando o **mysql** opera no modo interativo, esta opção é habilitada por padrão. Além disso, a saída do comando `status` (ou `\s`) inclui esta linha quando a opção é habilitada implicitamente ou explicitamente:

  ```
  Binary data as: Hexadecimal
  ```

  Para desabilitar a notação hexadecimal, use `--skip-binary-as-hex`

* `--binary-mode`

<table frame="box" rules="all" summary="Propriedades para o modo binário">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--binary-mode</code></td>
  </tr>
</table>

  Esta opção ajuda ao processar a saída do **mysqlbinlog** que pode conter valores `BLOB`. Por padrão, o **mysql** traduz `\r\n` em strings de instruções para `\n` e interpreta `\0` como o final da instrução. `--binary-mode` desabilita ambos os recursos. Também desabilita todos os comandos do **mysql**, exceto `charset` e `delimiter` no modo não interativo (para entrada canalizada para o **mysql** ou carregada usando o comando `source`).

  `--binary-mode`, quando ativado, faz com que o servidor ignore qualquer configuração para `--commands`.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--bind-address=ip_address</code></td>
    </tr>
  </table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--help</code></td>
    </tr>
  </table>

  O diretório onde os conjuntos de caracteres estão instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--column-names`

  <table frame="box" rules="all" summary="Propriedades para ajuda">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--help</code></td>
    </tr>
  </table>

  Escreva os nomes das colunas nos resultados.

* `--column-type-info`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir metadados do conjunto de resultados. Essas informações correspondem ao conteúdo das estruturas de dados C API `MYSQL_FIELD`. Veja Estruturas de Dados Básicas da API C.

* `--commands`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Se habilitar ou desabilitar o processamento de comandos do cliente **mysql** local. Definir essa opção para `FALSE` desabilita esse processamento e tem os efeitos listados aqui:

  + Os seguintes comandos do cliente **mysql** são desabilitados:

    - `charset` (`/C` permanece habilitado)

    - `clear`
    - `connect`
    - `edit`
    - `ego`
    - `exit`
    - `go`
    - `help`
    - `nopager`
    - `notee`
    - `nowarning`
    - `pager`
    - `print`
    - `prompt`
    - `query_attributes`
    - `quit`
    - `rehash`
    - `resetconnection`
    - `ssl_session_data_print`
    - `source`
    - `status`
    - `system`
    - `tee`
    - `\u` (`use` é passado para o servidor)

    - `warnings`
  + Os comandos `\C` e `delimiter` permanecem habilitados.

  + A opção `--system-command` é ignorada e não tem efeito.

  Esta opção não tem efeito quando `--binary-mode` está habilitado.

  Quando `--commands` está habilitado, é possível desabilitar (apenas) o comando do sistema usando a opção `--system-command`.

* `--comments`, `-c`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--help</code></td>
  </tr>
</table>
4

  Se os comentários devem ser preservados ou removidos das instruções enviadas ao servidor. O padrão é preservá-los; para removê-los, inicie o **mysql** com `--skip-comments`.

  Nota

  O cliente **mysql** sempre passa dicas de otimização ao servidor, independentemente de esta opção ser fornecida.

  A remoção de comentários está desatualizada. Espere que essa funcionalidade e as opções para controlá-la sejam removidas em uma futura versão do MySQL.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades de ajuda">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--help</code></td>
    </tr>
  </table>
5

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de compressão de conexão”.

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL. Consulte Configurando a compressão de conexão legada.

* `--compression-algorithms=valor`

  <table frame="box" rules="all" summary="Propriedades de ajuda">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--help</code></td>
    </tr>
  </table>
6

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.

* `--connect-expired-password`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr>
</table>

  Indique ao servidor que o cliente pode lidar com o modo sandbox se a conta usada para a conexão tiver uma senha expirada. Isso pode ser útil para chamadas não interativas do **mysql** porque, normalmente, o servidor desconecta clientes não interativos que tentam se conectar usando uma conta com senha expirada. (Veja a Seção 8.2.16, “Tratamento do servidor de senhas expiradas”.)

* `--connect-timeout=valor`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr>
</table>

  O número de segundos antes do tempo limite de conexão. (O valor padrão é `0`.)

* `--database=nome_do_banco`, `-D nome_do_banco`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr>
</table>

  O banco de dados a ser usado. Isso é útil principalmente em um arquivo de opção.

* `--debug[=opções_de_depuração], `-# [opções_de_depuração]`

<table frame="box" rules="all" summary="Propriedades de autenticação-oci-client-config-profile">
  <tr><th>Formato de linha de comando</th> <td><code>--authentication-oci-client-config-profile=nome_do_perfil</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
</table>

  Escreva um log de depuração. Uma string típica de `opções_de_depuração` é `d:t:o,nome_do_arquivo.log`. O padrão é `d:t:o,/tmp/mysql.trace`.

Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para authentication-oci-client-config-profile"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Propriedades para authentication-oci-client-config-profile"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para authentication-oci-client-config-profile"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente usar. Veja a Seção 8.2.17, “Autenticação Personalizável”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para o perfil de configuração de autenticação-oci-client-config-profile"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Use *`charset_name`* como o conjunto de caracteres padrão para o cliente e a conexão.

  Esta opção pode ser útil se o sistema operacional usar um conjunto de caracteres e o cliente **mysql** usar outro por padrão. Nesse caso, a saída pode ser formatada incorretamente. Geralmente, você pode corrigir esses problemas usando essa opção para forçar o cliente a usar o conjunto de caracteres do sistema em vez disso.

  Para mais informações, consulte a Seção 12.4, “Conjunto de caracteres de conexão e colatações” e a Seção 12.15, “Configuração de conjunto de caracteres”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para o perfil de configuração de autenticação-oci-client-config-profile"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de configuração”.

* `--defaults-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para autenticação-oci-client-config-profile"><tbody><tr><th>Formato de linha de comando</th> <td><code>--autenticação-oci-client-config-profile=nome_do_perfil</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`nome_do_arquivo`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de configuração”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para autenticação-oci-client-config-profile"><tbody><tr><th>Formato de linha de comando</th> <td><code>--autenticação-oci-client-config-profile=nome_do_perfil</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Leia não apenas os grupos de opção usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysql** normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysql** também lê os grupos `[client_other]` e `[mysql_other]`.

Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--delimiter=str`

  <table frame="box" rules="all" summary="Propriedades para autenticação-oci-client-config-profile"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Defina o delimitador da declaração. O padrão é o caractere ponto-e-vírgula (`;`).

* `--disable-commands-named`

  Desative os comandos nomeados. Use apenas a forma `\*`, ou use comandos nomeados apenas no início de uma linha que termina com um ponto-e-vírgula (`;`). **mysql** começa com esta opção *ativada* por padrão. No entanto, mesmo com esta opção, os comandos de formato longo ainda funcionam a partir da primeira linha. Consulte a Seção 6.5.1.2, “Comandos do cliente MySQL”.

* `--dns-srv-name=name`

  <table frame="box" rules="all" summary="Propriedades para autenticação-oci-client-config-profile"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Especifica o nome de um registro DNS SRV que determina os hosts candidatos a serem usados para estabelecer uma conexão com um servidor MySQL. Para obter informações sobre o suporte a DNS SRV no MySQL, consulte a Seção 6.2.6, “Conectando ao servidor usando registros DNS SRV”.

  Suponha que o DNS esteja configurado com essas informações SRV para o domínio `example.com`:

  ```
  Name                     TTL   Class   Priority Weight Port Target
  _mysql._tcp.example.com. 86400 IN SRV  0        5      3306 host1.example.com
  _mysql._tcp.example.com. 86400 IN SRV  0        10     3306 host2.example.com
  _mysql._tcp.example.com. 86400 IN SRV  10       5      3306 host3.example.com
  _mysql._tcp.example.com. 86400 IN SRV  20       5      3306 host4.example.com
  ```

  Para usar esse registro DNS SRV, inicie o **mysql** da seguinte forma:

  ```
  mysql --dns-srv-name=_mysql._tcp.example.com
  ```

**mysql** tenta então estabelecer uma conexão com cada servidor do grupo até que uma conexão bem-sucedida seja estabelecida. Uma falha na conexão ocorre apenas se não for possível estabelecer uma conexão com nenhum dos servidores. Os valores de prioridade e peso no registro DNS SRV determinam a ordem em que os servidores devem ser tentados.

Quando invocado com `--dns-srv-name`, **mysql** tenta estabelecer conexões TCP apenas.

A opção `--dns-srv-name` tem precedência sobre a opção `--host` se ambas forem fornecidas. `--dns-srv-name` faz com que o estabelecimento da conexão use a função C `mysql_real_connect_dns_srv()` em vez de `mysql_real_connect()`. No entanto, se o comando `connect` for usado subsequentemente em tempo de execução e especificar um argumento de nome de host, esse nome de host tem precedência sobre qualquer opção `--dns-srv-name` fornecida no **mysql** para especificar um registro DNS SRV.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para autenticação-openid-connect-client-id-token-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Veja a Seção 8.4.1.3, “Autenticação Pluggable de Texto Claro do Lado do Cliente”.)

* `--execute=statement`, `-e statement`

  <table frame="box" rules="all" summary="Propriedades para autenticação-openid-connect-client-id-token-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

Execute a declaração e saia. O formato de saída padrão é o mesmo produzido com `--batch`. Veja a Seção 6.2.2.1, “Usando Opções na Linha de Comando”, para alguns exemplos. Com esta opção, o **mysql** não usa o arquivo de histórico.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para authentication-openid-connect-client-id-token-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Continue mesmo que ocorra um erro SQL.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para authentication-openid-connect-client-id-token-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Solicitar ao servidor a chave pública necessária para a troca de senha com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

* `--histignore`

<table frame="box" rules="all" summary="Propriedades para o arquivo de token de cliente de autenticação-openid-connect"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Uma lista de um ou mais padrões separados por vírgula que especificam as instruções a serem ignoradas para fins de registro. Esses padrões são adicionados à lista de padrão padrão (`"*IDENTIFIED*:*PASSWORD*"`). O valor especificado para essa opção afeta o registro de instruções escritas no arquivo de histórico e no `syslog` se a opção `--syslog` for fornecida. Para mais informações, consulte a Seção 6.5.1.3, “Registro de cliente do MySQL”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para o arquivo de token de cliente de autenticação-openid-connect"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Conecte-se ao servidor MySQL no host fornecido.

  A opção `--dns-srv-name` tem precedência sobre a opção `--host` se ambas forem fornecidas. `--dns-srv-name` faz com que o estabelecimento da conexão use a função C `mysql_real_connect_dns_srv()` em vez de `mysql_real_connect()`. No entanto, se o comando `connect` for usado posteriormente em tempo de execução e especificar um argumento de nome de host, esse nome de host tem precedência sobre qualquer opção `--dns-srv-name` fornecida durante o **início do MySQL** para especificar um registro DNS SRV.

* `--html`, `-H`

<table frame="box" rules="all" summary="Propriedades para authentication-openid-connect-client-id-token-file"><tr><th>Formato de linha de comando</th><td><code>--authentication-openid-connect-client-id-token-file</code></td> </tr></table>

  Ignore espaços após os nomes das funções. O efeito disso é descrito na discussão sobre o modo SQL `IGNORE_SPACE` (veja a Seção 7.1.11, “Modos SQL do servidor”).

* `--init-command=str`

  <table frame="box" rules="all" summary="Propriedades para authentication-openid-connect-client-id-token-file"><tr><th>Formato de linha de comando</th><td><code>--authentication-openid-connect-client-id-token-file</code></td> </tr></table>

  Uma única instrução SQL para executar após a conexão com o servidor. Se o auto-reconexão estiver habilitada, a instrução é executada novamente após a reconexão. A definição reinicia as instruções existentes definidas por ela ou por `init-command-add`.

* `--init-command-add=str`

Adicione uma declaração SQL adicional para ser executada após a conexão ou reconexão ao servidor MySQL. Ela pode ser usada sem o uso de `--init-command`, mas não terá efeito se for usada antes dele, pois o `init-command` redefini o conjunto de comandos a serem chamados.

* `--line-numbers`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Escreva os números de linha para erros. Desabilite essa opção com `--skip-line-numbers`.

* `--load-data-local-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Esta opção afeta a capacidade `LOCAL` do lado do cliente para operações `LOAD DATA`. Especifica o diretório onde os arquivos mencionados nas instruções `LOAD DATA LOCAL` devem estar localizados. O efeito da opção `--load-data-local-dir` depende se a carga de dados `LOCAL` está habilitada ou desabilitada:

  + Se a carga de dados `LOCAL` estiver habilitada, seja por padrão na biblioteca do cliente MySQL ou especificando `--local-infile[=1]`, a opção `--load-data-local-dir` é ignorada.

  + Se a carga de dados `LOCAL` estiver desabilitada, seja por padrão na biblioteca do cliente MySQL ou especificando `--local-infile=0`, a opção `--load-data-local-dir` se aplica.

Quando `--load-data-local-dir` é aplicado, o valor da opção designa o diretório em que os arquivos de dados locais devem estar localizados. A comparação do nome do caminho do diretório e do nome do caminho dos arquivos a serem carregados é case-sensitive, independentemente da sensibilidade de caso do sistema de arquivos subjacente. Se o valor da opção for a string vazia, não é nomeado nenhum diretório, com o resultado de que nenhum arquivo é permitido para o carregamento de dados locais.

Por exemplo, para desabilitar explicitamente o carregamento de dados locais, exceto para arquivos localizados no diretório `/my/local/data`, invoque **mysql** da seguinte forma:

```
  mysql --local-infile=0 --load-data-local-dir=/my/local/data
  ```

Quando `--local-infile` e `--load-data-local-dir` são fornecidos, a ordem em que são fornecidos não importa.

O uso bem-sucedido das operações de carregamento `LOCAL` dentro de **mysql** também requer que o servidor permita o carregamento local; veja a Seção 8.1.6, “Considerações de Segurança para LOAD DATA LOCAL”

* `--local-infile[={0|1}]`

<table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

Por padrão, a capacidade `LOCAL` para `LOAD DATA` é determinada pelo padrão compilado na biblioteca do cliente MySQL. Para habilitar ou desabilitar explicitamente o carregamento de dados `LOCAL`, use a opção `--local-infile`. Quando fornecido sem valor, a opção habilita o carregamento de dados `LOCAL`. Quando fornecido como `--local-infile=0` ou `--local-infile=1`, a opção desabilita ou habilita o carregamento de dados `LOCAL`.

Se a capacidade `LOCAL` for desabilitada, a opção `--load-data-local-dir` pode ser usada para permitir o carregamento local restrito de arquivos localizados em um diretório designado.

O uso bem-sucedido das operações de carregamento `LOCAL` dentro do **mysql** também exige que o servidor permita o carregamento local; veja a Seção 8.1.6, “Considerações de segurança para LOAD DATA LOCAL”

* `--login-path=nome`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Leia opções de entrada do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de configuração MySQL”.

  Para obter informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Ignora a leitura de opções do arquivo de caminho de login.

  Veja `--login-path` para informações relacionadas.

  Para obter informações adicionais sobre isso e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--max-allowed-packet=valor`

<table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desativado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  O tamanho máximo do buffer para a comunicação cliente/servidor. O valor padrão é de 16 MB, o máximo é de 1 GB.

* `--max-join-size=valor`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desativado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  O limite automático para linhas em uma junção ao usar `--safe-updates`. (O valor padrão é de 1.000.000.)

* `--named-commands`, `-G`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desativado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Ative comandos **mysql** nomeados. São permitidos comandos de formato longo, não apenas comandos de formato curto. Por exemplo, `quit` e `\q` são ambos reconhecidos. Use `--skip-named-commands` para desativar comandos nomeados. Veja a Seção 6.5.1.2, “Comandos do cliente mysql”.

* `--net-buffer-length=valor`

<table frame="box" rules="all" summary="Propriedades para rehash automático"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desativado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  O tamanho do buffer para comunicação TCP/IP e socket. (O valor padrão é 16KB.)

* `--network-namespace=nome`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desativado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  O namespace de rede a ser usado para conexões TCP/IP. Se omitido, a conexão usa o namespace padrão (global). Para informações sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a Namespace de Rede”.

  Esta opção está disponível apenas em plataformas que implementam suporte a namespaces de rede.

* `--no-auto-rehash`, `-A`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Tem o mesmo efeito que `--skip-auto-rehash`. Consulte a descrição para `--auto-rehash`.

* `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Não emita um sinal sonoro quando ocorrerem erros.

* `--no-defaults`

<table frame="box" rules="all" summary="Propriedades para saída vertical automática"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Não leia arquivos de opções. Se o início do programa falhar ao ler opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

  Para obter informações adicionais sobre essa e outras opções de arquivos de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.

* `--oci-config-file=PATH`

<table frame="box" rules="all" summary="Propriedades para saída vertical automática"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Caminho alternativo para o arquivo de configuração da Oracle Cloud Infrastructure CLI. Especifique a localização do arquivo de configuração. Se o seu perfil padrão existente for o correto, você não precisa especificar essa opção. No entanto, se você tiver um arquivo de configuração existente, com múltiplos perfis ou um padrão diferente do da entidade do usuário com quem deseja se conectar, especifique essa opção.

* `--one-database`, `-o`

<table frame="box" rules="all" summary="Propriedades para saída vertical automática">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--auto-vertical-output</code></td>
  </tr>
</table>
4

  Ignore as instruções, exceto aquelas que ocorrem enquanto a base de dados padrão é a nomeada na linha de comando. Esta opção é rudimentar e deve ser usada com cuidado. O filtro de instruções é baseado apenas em instruções `USE`.

  Inicialmente, o **mysql** executa as instruções no input porque especificar um banco de dados *`db_name`* na linha de comando é equivalente a inserir `USE db_name` no início do input. Então, para cada instrução `USE` encontrada, o **mysql** aceita ou rejeita as instruções seguintes dependendo se o nome do banco de dados é o da linha de comando. O conteúdo das instruções é irrelevante.

  Suponha que o **mysql** seja invocado para processar este conjunto de instruções:

  ```
  DELETE FROM db2.t2;
  USE db2;
  DROP TABLE db1.t1;
  CREATE TABLE db1.t1 (i INT);
  USE db1;
  INSERT INTO t1 (i) VALUES(1);
  CREATE TABLE db2.t1 (j INT);
  ```

  Se a linha de comando for **mysql --force --one-database db1**, o **mysql** lida com o input da seguinte forma:

  + A instrução `DELETE` é executada porque o banco de dados padrão é `db1`, mesmo que a instrução nomeie uma tabela em um banco de dados diferente.

  + As instruções `DROP TABLE` e `CREATE TABLE` não são executadas porque o banco de dados padrão não é `db1`, mesmo que as instruções nomeiem uma tabela em `db1`.

  + As instruções `INSERT` e `CREATE TABLE` são executadas porque o banco de dados padrão é `db1`, mesmo que a instrução `CREATE TABLE` nomeie uma tabela em um banco de dados diferente.

* `--pager[=command]`

<table frame="box" rules="all" summary="Propriedades para saída vertical automática"><tr><th>Formato de Linha de Comando</th><td><code>--auto-vertical-output</code></td> </tr></table>

  Use o comando fornecido para a saída de consultas de paginação. Se o comando for omitido, o visualizador padrão é o valor da variável de ambiente `PAGER`. Os visualizadores válidos são **less**, **more**, **cat [> nome_do_arquivo]** e assim por diante. Esta opção funciona apenas no Unix e apenas no modo interativo. Para desativar a paginação, use a opção `--skip-pager`. A seção 6.5.1.2, “Comandos do Cliente do MySQL”, discute a paginação de saída mais detalhadamente.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><tr><th>Formato de Linha de Comando</th><td><code>--auto-vertical-output</code></td> </tr></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysql** solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o **mysql** não deve solicitar uma, use a opção `--skip-password`.

* `--password1[=pass_val]`

A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysql** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

Para especificar explicitamente que não há senha e que o **mysql** não deve solicitar uma, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica de `--password1`; consulte a descrição dessa opção para detalhes.

* `--password3[=pass_val]`

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica de `--password1`; consulte a descrição dessa opção para detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-authentication-kerberos-client-mode=value`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Em Windows, o plugin de autenticação `authentication_kerberos_client` suporta esta opção de plugin. Ele fornece dois valores possíveis que o usuário do cliente pode definir em tempo de execução: `SSPI` e `GSSAPI`.

  O valor padrão para a opção de plugin do lado do cliente usa a Interface de Suporte de Suporte de Segurança (SSPI), que é capaz de adquirir credenciais do cache in-memory do Windows. Alternativamente, o usuário do cliente pode selecionar um modo que suporte a Interface de Programa de Aplicação de Generic Security Service (GSSAPI) através da biblioteca MIT Kerberos em Windows. O GSSAPI é capaz de adquirir credenciais armazenadas anteriormente geradas usando o comando **kinit**.

  Para mais informações, consulte Comandos para Clientes do Windows no Modo GSSAPI.

* `--plugin-authentication-webauthn-client-preserve-privacy={OFF|ON}`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

Determina como as asserções são enviadas ao servidor caso haja mais de uma credencial detectável armazenada para um ID de RP específico (um nome único dado ao servidor da parte de confiança, que é o servidor MySQL). Se o dispositivo FIDO2 contiver várias chaves residentes para um ID de RP específico, essa opção permite que o usuário escolha uma chave a ser usada para a asserção. Ela fornece dois valores possíveis que o usuário do cliente pode definir. O valor padrão é `OFF`. Se definido como `OFF`, o desafio é assinado por todas as credenciais disponíveis para um ID de RP específico e todas as assinaturas são enviadas ao servidor. Se definido como `ON`, o usuário é solicitado a escolher a credencial a ser usada para a assinatura.

Nota

Esta opção não tem efeito se o dispositivo não suportar a funcionalidade de chave residente.

Para mais informações, consulte a Seção 8.4.1.11, “Autenticação Plugável WebAuthn”.

* `--plugin-authentication-webauthn-device=#`

  <table frame="box" rules="all" summary="Propriedades para lote"><tbody><tr><th>Formato de linha de comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  Determina qual dispositivo usar para a autenticação `libfido`. O padrão é o primeiro dispositivo (`0`).

Nota

Especificar um dispositivo inexistente gera um erro.

Para mais informações, consulte a Seção 8.4.1.11, “Autenticação Plugável WebAuthn”.

* `--plugin-dir=dir_name`

O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysql** não encontrá-lo. Veja a Seção 8.2.17, “Autenticação Personalizável”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para lote"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  O número de porta a ser usado para conexões TCP/IP.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para lote"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivos de opção, veja a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”.

* `--prompt=format_str`

  <table frame="box" rules="all" summary="Propriedades para lote"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  Defina o prompt para o formato especificado. O padrão é `mysql>`. As sequências especiais que o prompt pode conter são descritas na Seção 6.5.1.2, “Comandos do Cliente mysql”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para lote"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Propriedades para lote"><tr><th>Formato de Linha de Comando</th> <td><code>--batch</code></td> </tr></table>

  Não cache cada resultado da consulta, imprima cada linha conforme ela é recebida. Isso pode atrasar o servidor se a saída for suspensa. Com esta opção, o **mysql** não usa o arquivo de histórico.

Por padrão, o **mysql** recupera todas as linhas de resultado antes de produzir qualquer saída; ao armazená-las, ele calcula um comprimento máximo de coluna em execução a partir do valor real de cada coluna em sucessão. Ao imprimir a saída, ele usa esse máximo para formatá-la. Quando a opção `--quick` é especificada, o **mysql** não tem as linhas para as quais calcular o comprimento antes de começar, e, portanto, usa o comprimento máximo. No exemplo a seguir, a tabela `t1` tem uma única coluna do tipo `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e contém 4 linhas. A saída padrão tem 9 caracteres de largura; essa largura é igual ao número máximo de caracteres em qualquer um dos valores da coluna nas linhas retornadas (5), mais 2 caracteres cada para os espaços usados como preenchimento e os caracteres `|` usados como delimitadores de coluna). A saída ao usar a opção `--quick` tem 25 caracteres de largura; isso é igual ao número de caracteres necessários para representar `-9223372036854775808`, que é o valor mais longo possível que pode ser armazenado em uma coluna `BIGINT` (assinada), ou 19 caracteres, mais os 4 caracteres usados para preenchimento e delimitadores de coluna. A diferença pode ser vista aqui:

  ```
  $> mysql -t test -e "SELECT * FROM t1"
  +-------+
  | c1    |
  +-------+
  |   100 |
  |  1000 |
  | 10000 |
  |    10 |
  +-------+

  $> mysql --quick -t test -e "SELECT * FROM t1"
  +----------------------+
  | c1                   |
  +----------------------+
  |                  100 |
  |                 1000 |
  |                10000 |
  |                   10 |
  +----------------------+
  ```
* `--raw`, `-r`

  <table frame="box" rules="all" summary="Propriedades para batch"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

Para saída tabular, o "alinhamento" das colunas permite que um valor de coluna seja distinguido de outro. Para saída não tabular (como a produzida em modo batch ou quando a opção `--batch` ou `--silent` é fornecida), caracteres especiais são escapados na saída para que possam ser identificados facilmente. Novo linha, tabulação, `NUL` e barra invertida são escritos como `\n`, `\t`, `\0` e `\\`. A opção `--raw` desabilita esse escapagem de caracteres.

O exemplo a seguir demonstra a saída tabular versus não tabular e o uso do modo bruto para desabilitar o escapagem:

```
  % mysql
  mysql> SELECT CHAR(92);
  +----------+
  | CHAR(92) |
  +----------+
  | \        |
  +----------+

  % mysql -s
  mysql> SELECT CHAR(92);
  CHAR(92)
  \\

  % mysql -s -r
  mysql> SELECT CHAR(92);
  CHAR(92)
  \
  ```dG2DzOfiWj

Uma conta que requer registro para o segundo e terceiro fatores de autenticação invoca o cliente **mysql** da seguinte forma:

  ```
  mysql --user=user_name --register-factor=3
  ```

  Se o registro for bem-sucedido, uma conexão é estabelecida. Se houver um fator de autenticação com um registro pendente, uma conexão é colocada no modo de registro pendente ao tentar se conectar ao servidor. Nesse caso, desconecte e reconecte com o valor correto de `--register-factor` para completar o registro.

  O registro é um processo de duas etapas, que inclui as etapas *iniciar registro* e *terminar registro*. A etapa de iniciar registro executa esta declaração:

  ```
  mysql --user=user_name --register-factor=2,3
  ```

  A declaração retorna um conjunto de resultados contendo um desafio de 32 bytes, o nome do usuário e o ID da parte confiável (ver `authentication_webauthn_rp_id`).

  A etapa de terminar registro executa esta declaração:

  ```
  ALTER USER user factor INITIATE REGISTRATION
  ```

  A declaração completa o registro e envia as seguintes informações para o servidor como parte do *`auth_string`*: dados do autenticador, um certificado de atestação opcional no formato X.509 e uma assinatura.

  As etapas de iniciar e terminar registro devem ser executadas em uma única conexão, pois o desafio recebido pelo cliente durante a etapa de iniciar é salvo no manipulador de conexão do cliente. O registro falharia se a etapa de registro fosse executada por uma conexão diferente. A opção `--register-factor` executa tanto as etapas de iniciar quanto de terminar, o que evita o cenário de falha descrito acima e impede a necessidade de executar as declarações de iniciar e terminar `ALTER USER` manualmente.

  A opção `--register-factor` está disponível apenas para os clientes **mysql** e MySQL Shell. Outros programas de cliente MySQL não a suportam.

Para obter informações relacionadas, consulte o uso da autenticação WebAuthn.

* `--safe-updates`, `--i-am-a-dummy`, `-U`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><tr><th>Formato de linha de comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE no modo não interativo</code></td> </tr></table>

  Se essa opção estiver habilitada, as instruções `UPDATE` e `DELETE` que não utilizam uma chave na cláusula `WHERE` ou uma cláusula `LIMIT` produzem um erro. Além disso, restrições são aplicadas às instruções `SELECT` que produzem (ou são estimadas para produzir) conjuntos de resultados muito grandes. Se você configurou essa opção em um arquivo de opções, pode usar `--skip-safe-updates` na linha de comando para sobrescrevê-la. Para obter mais informações sobre essa opção, consulte o uso do modo Safe-Updates (--safe-updates)").

* `--select-limit=value`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><tr><th>Formato de linha de comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE no modo não interativo</code></td> </tr></table>

  O limite automático para as instruções `SELECT` ao usar `--safe-updates`. (O valor padrão é 1.000.)

* `--server-public-key-path=file_name`

<table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><tr><th style="width: 30%">Formato de linha de comando</th><td><code>--binary-as-hex</code></td></tr><tr><th style="width: 70%">Tipo</th><td>Booleano</td></tr><tr><th style="width: 70%">Valor padrão</th><td><code>FALSE no modo não interativo</code></td></tr></table>

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção só se aplica se o MySQL foi compilado usando OpenSSL.

  Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.2, “Autenticação Personalizável SHA-256”, e a Seção 8.4.1.1, “Autenticação Personalizável SHA-2”.

* `--shared-memory-base-name=name`

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada com um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--show-warnings`

  <table frame="box" rules="all" summary="Propriedades para binary-as-hex"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE no modo não interativo</code></td> </tr></tbody></table>

  Exibir avisos após cada instrução se houver algum. Esta opção se aplica ao modo interativo e ao modo lote.

* `--sigint-ignore`

  <table frame="box" rules="all" summary="Propriedades para binary-as-hex"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE no modo não interativo</code></td> </tr></tbody></table>

  Ignorar sinais `SIGINT` (tipicamente o resultado de digitar **Control+C**).

  Sem esta opção, digitar **Control+C** interrompe a instrução atual, se houver uma, ou cancela qualquer linha de entrada parcial, caso contrário.

* `--silent`, `-s`

<table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><tr><th>Formato de linha de comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE no modo não interativo</code></td> </tr></table>

  Modo silencioso. Produza menos saída. Esta opção pode ser dada várias vezes para produzir cada vez menos saída.

  Esta opção resulta em um formato de saída não tabular e na escavação de caracteres especiais. A escavação pode ser desativada usando o modo bruto; consulte a descrição da opção `--raw`.

* `--skip-column-names`, `-N`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><tr><th>Formato de linha de comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE no modo não interativo</code></td> </tr></table>

  Não escreva nomes de colunas nos resultados. O uso desta opção faz com que a saída seja alinhada à direita, como mostrado aqui:

  ```
  ALTER USER user factor FINISH REGISTRATION SET CHALLENGE_RESPONSE AS 'auth_string'
  ```

* `--skip-line-numbers`, `-L`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><tr><th>Formato de linha de comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE no modo não interativo</code></td> </tr></table>

  Não escreva números de linha para erros. Útil quando você deseja comparar arquivos de resultado que incluem mensagens de erro.

* `--skip-system-command`

<table frame="box" rules="all" summary="Propriedades para modo binário como hexadecimal">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--binary-as-hex</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>FALSE no modo não interativo</code></td>
  </tr>
  </tbody>
</table>

  Desabilita o comando `system` (`\!`). Equivalente a `--system-command=OFF`.

* `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para modo binário">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--binary-mode</code></td>
    </tr>
  </tbody>
  </table>

  Para conexões com `localhost`, o arquivo de socket Unix a ser usado ou, em Windows, o nome do pipe nomeado a ser usado.

  Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se se deseja conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Propriedades para modo binário">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--binary-mode</code></td>
    </tr>
  </tbody>
  </table>

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Estes valores de `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.
+ `ON`: Habilitar o modo FIPS.
+ `STRICT`: Habilitar o modo FIPS “estricto”.

Nota

Se o Módulo de Objeto FIPS do OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza uma mensagem de aviso ao iniciar e opere no modo não FIPS.

Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.

* `--syslog`, `-j`

  <table frame="box" rules="all" summary="Propriedades para o modo binário"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  Esta opção faz com que o **mysql** envie instruções interativas para a facilidade de registro do sistema. No Unix, isso é `syslog`; no Windows, é o Registro de Eventos do Windows. O destino onde as mensagens registradas aparecem depende do sistema. No Linux, o destino é frequentemente o arquivo `/var/log/messages`.

  Aqui está uma amostra de saída gerada no Linux usando `--syslog`. Essa saída é formatada para melhor legibilidade; cada mensagem registrada na verdade ocupa uma única linha.

  ```
  $> echo "SELECT * FROM t1" | mysql -t test
  +-------+
  | c1    |
  +-------+
  | a,c,d |
  | c     |
  +-------+
  $> echo "SELECT * FROM t1" | ./mysql -uroot -Nt test
  +-------+
  | a,c,d |
  |     c |
  +-------+
  ```

  Para mais informações, consulte a Seção 6.5.1.3, “Registro do Cliente do mysql”.

* `--system-command[={ON|OFF}]`

<table frame="box" rules="all" summary="Propriedades para modo binário">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--binary-mode</code></td>
  </tr>
</table>
3

  Ative ou desative o comando `system` (`\!`). Esta opção está desativada por padrão, o que significa que o comando `system` é rejeitado com um erro. Para ativá-lo, use `--system-command=ON`.

  `--commands`, quando desativado (definido como `FALSE`), faz com que o servidor ignore qualquer configuração para esta opção.

* `--table`, `-t`

  <table frame="box" rules="all" summary="Propriedades para modo binário">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--binary-mode</code></td>
    </tr>
  </table>
4

  Exiba a saída em formato de tabela. Esta é a opção padrão para uso interativo, mas pode ser usada para produzir saída em tabela em modo de lote.

* `--tee=nome_arquivo`

  <table frame="box" rules="all" summary="Propriedades para modo binário">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--binary-mode</code></td>
    </tr>
  </table>
5

  Adicione uma cópia da saída ao arquivo fornecido. Esta opção funciona apenas no modo interativo. A seção 6.5.1.2, “Comandos do cliente MySQL”, discute mais sobre arquivos `tee`.

* `--tls-ciphersuites=lista_ciphersuites`

  <table frame="box" rules="all" summary="Propriedades para modo binário">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--binary-mode</code></td>
    </tr>
  </table>
6

As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequências de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de Conexão Criptografada”.

* `--tls-sni-servername=server_name`

  <table frame="box" rules="all" summary="Propriedades para modo binário"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que esta opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para modo binário"><tbody><tr><th>Formato de linha de comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de Conexão Criptografada”.

* `--unbuffered`, `-n`

<table frame="box" rules="all" summary="Propriedades para modo binário"><tr><th>Formato de linha de comando</th><td><code>--binary-mode</code></td> </tr></table>

Limpe o buffer após cada consulta.

* `--user=nome_do_usuário`, `-u nome_do_usuário`

<table frame="box" rules="all" summary="Propriedades para endereço de conexão"><tr><th>Formato de linha de comando</th><td><code>--bind-address=endereço_ip</code></td> </tr></table>

O nome do usuário da conta MySQL a ser usado para se conectar ao servidor.

* `--verbose`, `-v`

<table frame="box" rules="all" summary="Propriedades para endereço de conexão"><tr><th>Formato de linha de comando</th><td><code>--bind-address=endereço_ip</code></td> </tr></table>

Modo de verbosidade. Produza mais saída sobre o que o programa faz. Esta opção pode ser dada várias vezes para produzir mais e mais saída. (Por exemplo, `-v -v -v` produz o formato de saída da tabela mesmo no modo em lote.)

* `--version`, `-V`

<table frame="box" rules="all" summary="Propriedades para endereço de conexão"><tr><th>Formato de linha de comando</th><td><code>--bind-address=endereço_ip</code></td> </tr></table>

Exibir informações de versão e sair.

* `--vertical`, `-E`

<table frame="box" rules="all" summary="Propriedades para endereço de conexão"><tr><th>Formato de linha de comando</th><td><code>--bind-address=endereço_ip</code></td> </tr></table>

Imprima as linhas de saída da consulta verticalmente (uma linha por valor da coluna). Sem essa opção, você pode especificar a saída vertical para declarações individuais terminando-as com `\G`.

* `--wait`, `-w`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Se a conexão não puder ser estabelecida, aguarde e tente novamente em vez de abortar.

* `--xml`, `-X`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Produza saída em formato XML.

  ```
  Mar  7 12:39:25 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
  Mar  7 12:39:28 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
  ```

  A saída quando `--xml` é usado com **mysql** corresponde à do **mysqldump** `--xml`. Veja a Seção 6.5.4, “mysqldump — Um programa de backup de banco de dados”, para detalhes.

  A saída XML também usa um namespace XML, como mostrado aqui:

  ```
  <field name="column_name">NULL</field>
  ```

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis de compressão crescentes. O nível de compressão padrão é 3. O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.

* `telemetry_client`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Habilita o plugin do cliente de telemetria (apenas Linux).

  Para mais informações, consulte o Capítulo 35, *Telemetria*.