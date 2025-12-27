#### 6.5.1.1 Opções do Cliente `mysql`

O `mysql` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.10 Opções do Cliente `mysql`**

<table>
   <thead>
      <tr>
         <th>Nome da Opção</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>--authentication-oci-client-config-profile</td>
         <td>Nome do perfil OCI definido no arquivo de configuração OCI que usar</td>
      </tr>
      <tr>
         <td><code>--auto-rehash</code></td>
         <td>Ativar rehash automático</td>
      </tr>
      <tr>
         <td><code>--auto-vertical-output</code></td>
         <td>Ativar exibição de resultado de conjunto de resultados vertical automaticamente</td>
      </tr>
      <tr>
         <td><code>--batch</code></td>
         <td>Não usar arquivo de histórico de histórico</td>
      </tr>
      <tr>
         <td><code>--binary-as-hex</code></td>
         <td>Exibir valores binários em notação hexadecimal</td>
      </tr>
      <tr>
         <td><code>--binary-mode</code></td>
         <td>Desativar tradução e tratamento de <code>\r\n</code> - <code>\n</code></td>
      </tr>
      <tr>
         <td><code>--bind-address</code></td>
         <td>Usar a interface de rede especificada para se conectar ao servidor MySQL</td>
      </tr>
      <tr>
         <td><code>--character-sets-dir</code></td>
         <td>Diretório onde os conjuntos de caracteres são instalados</td>
      </tr>
      <tr>
         <td><code>--column-names</code></td>
         <td>Escrever nomes de coluna nos resultados</td>
      </tr>
      <tr>
         <td><code>--column-type-info</code></td>
         <td>Exibir informações de metadados do conjunto de resultados</td>
      </tr>
      <tr>
         <td><code>--commands</code></td>
         <td>Ativar ou desativar processamento de comandos locais do cliente MySQL</td>
      </tr>
      <tr>
         <td><code>--comments</code></td>
         <td>Se incluir ou não comentários nos comandos enviados ao servidor</td>
      </tr>
      <tr>
         <td><code>--compress</code></td>
         <td>Compressar todas as informações enviadas entre cliente e servidor</td>
      </tr>
      <tr>
         <td><code>--compression-algorithms</code></td>
         <td>Algoritmos de compressão permitidos para conexões com servidor</td>
      </tr>
      <tr>
         <td><code>--connect-expired-password</code></td>
         <td>Indica ao servidor que o cliente pode lidar com modo sandbox com senha expirada</td>
      </tr>
      <tr>
         <td><code>--connect-timeout</code></td>
         <td>Número de segundos antes do timeout da conexão</td>
      </tr>
      <tr>
         <td><code>--database</code></td>
         <td>Banco de dados a usar</td>
      </tr>
      <tr>
         <td><code>--debug</code></td>
         <td>Escrever log de depuração; suportado apenas se o MySQL foi compilado com suporte a depuração</td>
      </tr>
      <tr>
         <td><code>--debug-check</code></td>
         <td>Imprimir informações de depuração quando o programa sai</td>
      </tr>
      <tr>
         <td><code>--debug-info</code></td>
         <td>Imprimir informações de depuração, estatísticas de memória e estatísticas de CPU quando o programa sai</td>
      </tr>
      <tr>
         <td><code>--default-auth</code></td>
         <td>Plugin de autenticação padrão a usar</td>
      </tr>
      <tr>
         <td><code>--default-character-set</code></td>
         <td>Especificar o conjunto de caracteres padrão</td>
      </tr>
      <tr>
         <td><code>--defaults-extra-file</code></td>
         <td>Ler o arquivo de opção adicional além dos arquivos de opção padrão</td>
      </tr>
      <tr>
         <td><code>--defaults-file</code></td>
         <td>Ler apenas o arquivo de opção padrão</td>
      </tr>
      <tr>
         <td><code>--defaults-group-suffix</code></td>
         <td>Valor do sufixo do grupo de opção</td>
      </tr>
      <tr>
         <td><code>--delimiter</code></td>
         <td>Definir o delimitador</td>
      </tr>
      <tr>
         <td><code>--dns-srv-name</code></td>
         <td>Usar busca de nome SRV para informações de host</td>
      </tr>
      <tr>
         <td><code>--enable-cleartext-plugin</code></td>
         <td>Ativar plugin de texto claro</td>
      </tr>
      <tr>
         <td><code>--execute</code></td>
         <td>Executar a declaração SQL e sair</td>
      </tr>
      <tr>
         <td><code>--force</code></td>
         <td>Prosseguir mesmo se ocorrer um erro SQL</td>
      </tr>
      <tr>
         <td><code>--get-server-public-key</code></td>
         <td>Solicitar chave pública RSA do servidor</td>
      </tr>
      <tr>
         <td><code>--help</code></td>
         <td>Imprimir mensagem de ajuda e sair</td>
      </tr>
      <tr>
         <td><code>--histignore</code></td>
         <td>Pad

* `--help`, `-?`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.
* `--authentication-oci-client-config-profile`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Especificar o nome do perfil de configuração OCI a ser usado. Se não for definido, o perfil padrão é usado.
* `--auto-rehash`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Ativar a rehashing automática. Esta opção está ativada por padrão, o que permite a conclusão de nomes de banco de dados, tabelas e colunas. Use `--disable-auto-rehash` para desativar a rehashing. Isso faz com que o `mysql` comece mais rápido, mas você deve emitir o comando `rehash` ou sua abreviação `\#` se quiser usar a conclusão de nomes.

  Para completar um nome, insira a primeira parte e pressione Tab. Se o nome for inequívoco, o `mysql` o completa. Caso contrário, você pode pressionar Tab novamente para ver os nomes possíveis que começam com o que você digitou até agora. A conclusão não ocorre se não houver um banco de dados padrão.

  ::: info Nota

  Este recurso requer um cliente MySQL compilado com a biblioteca `readline`. Tipicamente, a biblioteca `readline` não está disponível no Windows.

  :::

* `--auto-vertical-output`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Fazer com que os conjuntos de resultados sejam exibidos verticalmente se forem muito largos para a janela atual, e usar o formato tabular normal caso contrário. (Isso se aplica a instruções terminadas por `;` ou `\G`.)
* `--batch`, `-B`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--batch</code></td> </tr></tbody></table>

Imprima os resultados usando a barra como separador de colunas, com cada linha em uma nova linha. Com esta opção, o `mysql` não usa o arquivo de histórico.

O modo de lote resulta em um formato de saída não tabular e na escavação de caracteres especiais. A escavação pode ser desativada usando o modo bruto; veja a descrição da opção `--raw`.
*  `--binary-as-hex`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE no modo não interativo</code></td> </tr></tbody></table>

  Quando esta opção é fornecida, o `mysql` exibe dados binários usando a notação hexadecimal (`0xvalue`). Isso ocorre independentemente do formato de exibição da saída geral ser tabular, vertical, HTML ou XML.

   `--binary-as-hex` quando habilitado afeta a exibição de todas as strings binárias, incluindo aquelas retornadas por funções como `CHAR()` e `UNHEX()`. O exemplo a seguir demonstra isso usando o código ASCII para `A` (65 decimal, 41 hexadecimal):

  + `--binary-as-hex` desativado:

    ```
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------+-------------+
    | CHAR(0x41) | UNHEX('41') |
    +------------+-------------+
    | A          | A           |
    +------------+-------------+
    ```
  + `--binary-as-hex` ativado:

    ```
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------------------+--------------------------+
    | CHAR(0x41)             | UNHEX('41')              |
    +------------------------+--------------------------+
    | 0x41                   | 0x41                     |
    +------------------------+--------------------------+
    ```

  Para escrever uma expressão de string binária de modo que ela seja exibida como uma string de caracteres, independentemente de `--binary-as-hex` estar habilitado, use estas técnicas:

  + A função `CHAR()` tem uma cláusula `USING charset`:

    ```
    mysql> SELECT CHAR(0x41 USING utf8mb4);
    +--------------------------+
    | CHAR(0x41 USING utf8mb4) |
    +--------------------------+
    | A                        |
    +--------------------------+
    ```
  + Mais geralmente, use `CONVERT()` para converter uma expressão para um conjunto de caracteres específico:

    ```
    mysql> SELECT CONVERT(UNHEX('41') USING utf8mb4);
    +------------------------------------+
    | CONVERT(UNHEX('41') USING utf8mb4) |
    +------------------------------------+
    | A                                  |
    +------------------------------------+
    ```

  Quando o `mysql` opera no modo interativo, esta opção é habilitada por padrão. Além disso, a saída do comando `status` (ou `\s`) inclui esta linha quando a opção é habilitada implicitamente ou explicitamente:

  ```
  Binary data as: Hexadecimal
  ```

  Para desabilitar a notação hexadecimal, use `--skip-binary-as-hex`
*  `--binary-mode`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

Esta opção ajuda ao processar a saída do `mysqlbinlog` que pode conter valores `BLOB`. Por padrão, o `mysql` traduz `\r\n` em strings de instruções para `\n` e interpreta `\0` como o final da instrução. `--binary-mode` desabilita ambos os recursos. Também desabilita todos os comandos do `mysql`, exceto `charset` e `delimiter`, no modo não interativo (para entrada canalizada para o `mysql` ou carregada usando o comando `source`).

(*MySQL 8.4.6 e versões posteriores:*) `--binary-mode`, quando ativado, faz com que o servidor ignore qualquer configuração para `--commands`.
*  `--bind-address=ip_address`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.
*  `--character-sets-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.
*  `--column-names`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--column-names</code></td> </tr></tbody></table>

  Escreva os nomes das colunas nos resultados.
*  `--column-type-info`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--column-type-info</code></td> </tr></tbody></table>

  Exibir metadados do conjunto de resultados. Esta informação corresponde ao conteúdo das estruturas de dados `MYSQL_FIELD` da API C. Veja a API C Estruturas de Dados Básicas.
*  `--commands`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--commands</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Se habilitar ou desabilitar o processamento de comandos do cliente local do `mysql`. Definir esta opção para `FALSE` desabilita esse processamento e tem os efeitos listados aqui:

Os seguintes comandos do cliente `mysql` estão desativados:

- `charset` (`/C` permanece ativado)
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

+ Os comandos `\C` e `delimiter` permanecem ativados.
+ A opção `--system-command` é ignorada e não tem efeito.

Esta opção não tem efeito quando a opção `--binary-mode` está ativada.

Quando a opção `--commands` está ativada, é possível desativar (apenas) o comando do sistema usando a opção `--system-command`.

Esta opção foi adicionada no MySQL 8.4.6.
* `--comments`, `-c`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--comments</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

Se deseja preservar ou remover comentários em instruções enviadas ao servidor. O padrão é preservá-los; para remover, inicie o `mysql` com `--skip-comments`.

::: info Nota

O cliente `mysql` sempre passa dicas de otimização ao servidor, independentemente de esta opção ser fornecida.

A remoção de comentários está desatualizada. Espere que essa funcionalidade e as opções para controlá-la sejam removidas em uma futura versão do MySQL.

:::

Esta opção está desatualizada. Espera-se que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legado.
* `--compression-algorithms=valor`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--compression-algorithms=valor</code></td> </tr><tr><th>Tipo</th> <td>Definir</td> </tr><tr><th>Valor Padrão</th> <td><code>não comprimido</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>zlib</code></p><p><code>zstd</code></p><p><code>não comprimido</code></p></td> </tr></tbody></table>

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `não comprimido`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.
* `--connect-expired-password`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-expired-password</code></td> </tr></tbody></table>

  Indique ao servidor que o cliente pode lidar com o modo sandbox se a conta usada para conectar tiver uma senha expirada. Isso pode ser útil para chamadas não interativas do `mysql` porque, normalmente, o servidor desconecta clientes não interativos que tentam se conectar usando uma conta com senha expirada. (Veja a Seção 8.2.16, “Tratamento do Servidor de Senhas Expirantes”.)
* `--connect-timeout=valor`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--connect-timeout=valor</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr></tbody></table>

  O número de segundos antes do tempo limite de conexão. (O valor padrão é `0`.)
* `--database=db_name`, `-D db_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--database=dbname</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A base de dados a ser usada. Isso é útil principalmente em um arquivo de opção.
* `--debug[=debug_options]`, `-# [debug_options]`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug[=opções_de_debuggamento]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>d:t:o,/tmp/mysql.trace</code></td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica de `opções_de_debuggamento` é `d:t:o,nome_do_arquivo`. O valor padrão é `d:t:o,/tmp/mysql.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--debug-check`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--debug-info`, `-T`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--default-auth=plugin`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente usar. Consulte  Seção 8.2.17, “Autenticação Personalizável”.
*  `--default-character-set=nome_do_charset`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--default-character-set=nome_do_charset</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Use *`charset_name`* como o conjunto de caracteres padrão para o cliente e a conexão.

Esta opção pode ser útil se o sistema operacional usar um conjunto de caracteres e o cliente `mysql` usar outro por padrão. Nesse caso, a saída pode ser formatada incorretamente. Geralmente, você pode corrigir esses problemas usando essa opção para forçar o cliente a usar o conjunto de caracteres do sistema em vez disso.

Para mais informações, consulte a Seção 12.4, “Conjunto de caracteres de conexão e colatações” e a Seção 12.15, “Configuração do conjunto de caracteres”.
*  `--defaults-extra-file=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Leia este arquivo de opções após o arquivo de opções globais, mas (no Unix) antes do arquivo de opções do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para informações adicionais sobre essa e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.
*  `--defaults-file=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas o arquivo de opções fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para informações adicionais sobre essa e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.
*  `--defaults-group-suffix=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, `mysql` normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for dada como `--defaults-group-suffix=_other`, `mysql` também lê os grupos `[client_other]` e `[mysql_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivo de opções”.
*  `--delimiter=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--delimiter=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>;</code></td> </tr></tbody></table>

  Defina o delimitador da declaração. O valor padrão é o caractere ponto-e-vírgula (`;`).
*  `--disable-named-commands`

  Desative comandos nomeados. Use a forma `\*` apenas, ou use comandos nomeados apenas no início de uma linha que termina com um ponto-e-vírgula (`;`). `mysql` começa com esta opção *ativada* por padrão. No entanto, mesmo com esta opção, os comandos de formato longo ainda funcionam a partir da primeira linha. Consulte  Seção 6.5.1.2, “Comandos do cliente mysql”.
*  `--dns-srv-name=name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--dns-srv-name=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Especifica o nome de um registro DNS SRV que determina os hosts candidatos a serem usados para estabelecer uma conexão com um servidor MySQL. Para informações sobre o suporte a DNS SRV no MySQL, consulte  Seção 6.2.6, “Conectando ao servidor usando registros DNS SRV”.

  Suponha que o DNS esteja configurado com essas informações SRV para o domínio `example.com`:

  ```
  Name                     TTL   Class   Priority Weight Port Target
  _mysql._tcp.example.com. 86400 IN SRV  0        5      3306 host1.example.com
  _mysql._tcp.example.com. 86400 IN SRV  0        10     3306 host2.example.com
  _mysql._tcp.example.com. 86400 IN SRV  10       5      3306 host3.example.com
  _mysql._tcp.example.com. 86400 IN SRV  20       5      3306 host4.example.com
  ```

  Para usar esse registro DNS SRV, inicie o `mysql` da seguinte forma:

  ```
  mysql --dns-srv-name=_mysql._tcp.example.com
  ```

`mysql` tenta então estabelecer uma conexão com cada servidor do grupo até que uma conexão bem-sucedida seja estabelecida. Uma falha na conexão ocorre apenas se uma conexão não puder ser estabelecida com nenhum dos servidores. Os valores de prioridade e peso no registro DNS SRV determinam a ordem em que os servidores devem ser tentados.

Quando invocado com `--dns-srv-name`, `mysql` tenta estabelecer conexões TCP apenas.

A opção `--dns-srv-name` tem precedência sobre a opção `--host` se ambas forem fornecidas. `--dns-srv-name` faz com que o estabelecimento da conexão use a função C `mysql_real_connect_dns_srv()` em vez de `mysql_real_connect()`. No entanto, se o comando `connect` for usado posteriormente em tempo de execução e especificar um argumento de nome de host, esse nome de host tem precedência sobre qualquer opção `--dns-srv-name` fornecida no início do `mysql` para especificar um registro DNS SRV.
*  `--enable-cleartext-plugin`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Ative o plugin de autenticação `mysql_clear_password` em texto claro. (Veja a Seção 8.4.1.4, “Autenticação Pluggable em Texto Claro do Lado do Cliente”).
*  `--execute=statement`, `-e statement`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--execute=statement</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Execute a declaração e saia. O formato de saída padrão é como o produzido com `--batch`. Veja a Seção 6.2.2.1, “Usando Opções na Linha de Comando”, para alguns exemplos. Com esta opção, `mysql` não usa o arquivo de histórico.
*  `--force`, `-f`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--force</code></td> </tr></tbody></table>

  Continuar mesmo que ocorra um erro SQL.
*  `--get-server-public-key`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr></tbody></table>

  Peça ao servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Pluggable SHA-2”.
*  `--histignore`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--histignore=pattern_list</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Uma lista de um ou mais padrões separados por vírgula que especificam declarações a serem ignoradas para fins de registro. Esses padrões são adicionados à lista de padrões padrão (`"*IDENTIFIED*:*PASSWORD*"`). O valor especificado para esta opção afeta o registro de declarações escritas no arquivo de histórico e no `syslog` se a opção `--syslog` for fornecida. Para mais informações, consulte a Seção 6.5.1.3, “Registro de Cliente MySQL”.
*  `--host=host_name`, `-h host_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  Conecte-se ao servidor MySQL no host fornecido.

A opção `--dns-srv-name` tem precedência sobre a opção `--host` se ambas forem fornecidas. `--dns-srv-name` faz com que o estabelecimento da conexão use a função C `mysql_real_connect_dns_srv()` em vez de `mysql_real_connect()`. No entanto, se o comando `connect` for usado posteriormente em tempo de execução e especificar um argumento de nome de host, esse nome de host tem precedência sobre qualquer opção `--dns-srv-name` fornecida no início do `mysql` para especificar um registro DNS SRV.
*  `--html`, `-H`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--html</code></td> </tr></tbody></table>

  Produza saída HTML.
*  `--ignore-spaces`, `-i`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ignore-spaces</code></td> </tr></tbody></table>

  Ignore espaços após os nomes das funções. O efeito disso é descrito na discussão para o modo SQL `IGNORE_SPACE` (veja a Seção 7.1.11, “Modos SQL do Servidor”).
*  `--init-command=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--init-command=str</code></td> </tr></tbody></table>

  Uma única instrução SQL a ser executada após a conexão com o servidor. Se o auto-reconexão estiver habilitada, a instrução é executada novamente após a reconexão ocorrer. A definição redefini o(s) comando(s) existente(s) definido(s) por ela ou `init-command-add`.
*  `--init-command-add=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--init-command-add=str</code></td> </tr></tbody></table>

  Adicione uma instrução SQL adicional a ser executada após a conexão ou reconexão com o servidor MySQL. É utilizável sem `--init-command`, mas não tem efeito se usado antes dele porque `init-command` redefini a lista de comandos a serem chamados.
*  `--line-numbers`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--line-numbers</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-line-numbers</code></td> </tr></tbody></table>

  Escreva números de linha para erros. Desabilite isso com `--skip-line-numbers`.
*  `--load-data-local-dir=dir_name`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--load-data-local-dir=nome_pasta</code></td> </tr><tr><th>Tipo</th> <td>Nome da pasta</td> </tr><tr><th>Valor padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  Esta opção afeta a capacidade `LOCAL` do lado do cliente para operações `LOAD DATA`. Especifica o diretório em que os arquivos nomeados nas declarações `LOAD DATA LOCAL` devem estar localizados. O efeito de `--load-data-local-dir` depende se a carga de dados `LOCAL` está habilitada ou desabilitada:

  + Se a carga de dados `LOCAL` estiver habilitada, seja por padrão na biblioteca do cliente MySQL ou especificando `--local-infile[=1]`, a opção `--load-data-local-dir` é ignorada.
  + Se a carga de dados `LOCAL` estiver desabilitada, seja por padrão na biblioteca do cliente MySQL ou especificando `--local-infile=0`, a opção `--load-data-local-dir` se aplica.

  Quando `--load-data-local-dir` se aplica, o valor da opção designa o diretório em que os arquivos de dados locais devem estar localizados. A comparação do nome do caminho da pasta e do nome do caminho dos arquivos a serem carregados é case-sensitive, independentemente da sensibilidade de caso do sistema de arquivos subjacente. Se o valor da opção for a string vazia, não é nomeada nenhuma pasta, com o resultado de que nenhum arquivo é permitido para a carga de dados locais.

  Por exemplo, para desabilitar explicitamente a carga de dados locais, exceto para arquivos localizados no diretório `/my/local/data`, invoque o `mysql` da seguinte forma:

  ```
  mysql --local-infile=0 --load-data-local-dir=/my/local/data
  ```

  Quando `--local-infile` e `--load-data-local-dir` são fornecidos, a ordem em que são fornecidos não importa.

  O uso bem-sucedido das operações de carga `LOCAL` dentro do `mysql` também requer que o servidor permita a carga local; consulte a Seção 8.1.6, “Considerações de segurança para LOAD DATA LOCAL”
*  `--local-infile[={0|1}]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--local-infile[={0|1}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

Por padrão, a capacidade `LOCAL` para `LOAD DATA` é determinada pelo padrão compilado na biblioteca do cliente MySQL. Para habilitar ou desabilitar explicitamente o carregamento de dados `LOCAL`, use a opção `--local-infile`. Quando não é fornecido valor, a opção habilita o carregamento de dados `LOCAL`. Quando fornecida como `--local-infile=0` ou `--local-infile=1`, a opção desabilita ou habilita o carregamento de dados `LOCAL`.

Se a capacidade `LOCAL` for desativada, a opção `--load-data-local-dir` pode ser usada para permitir o carregamento local restrito de arquivos localizados em um diretório designado.

O uso bem-sucedido das operações de carregamento `LOCAL` dentro do `mysql` também requer que o servidor permita o carregamento local; consulte a Seção 8.1.6, “Considerações de Segurança para LOAD DATA LOCAL”
* `--login-path=name`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Leia opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contêm opções que especificam para qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário `mysql_config_editor`. Consulte a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração MySQL”.

Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.
* `--no-login-paths`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

Ignora a leitura de opções do arquivo de caminho de login.

Consulte `--login-path` para informações relacionadas.

Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opções”.
* `--max-allowed-packet=value`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--max-allowed-packet=valor</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>16777216</code></td> </tr></tbody></table>

  O tamanho máximo do buffer para a comunicação cliente/servidor. O valor padrão é de 16MB, o máximo é de 1GB.
*  `--max-join-size=valor`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--max-join-size=valor</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>1.000.000</code></td> </tr></tbody></table>

  O limite automático para linhas em uma junção ao usar `--safe-updates`. (O valor padrão é de 1.000.000.)
*  `--named-commands`, `-G`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--named-commands</code></td> </tr><tr><th>Desativado por</th> <td><code>skip-named-commands</code></td> </tr></tbody></table>

  Ative comandos `mysql` nomeados. Os comandos de formato longo são permitidos, não apenas comandos de formato curto. Por exemplo, `quit` e `\q` são reconhecidos. Use `--skip-named-commands` para desativar comandos nomeados. Veja a Seção 6.5.1.2, “Comandos do Cliente mysql”.
*  `--net-buffer-length=valor`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--net-buffer-length=valor</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>16384</code></td> </tr></tbody></table>

  O tamanho do buffer para a comunicação TCP/IP e socket. (O valor padrão é de 16KB.)
*  `--network-namespace=nome`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--network-namespace=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O namespace de rede a ser usado para conexões TCP/IP. Se omitido, a conexão usa o namespace padrão (global). Para informações sobre namespaces de rede, veja a Seção 7.1.14, “Suporte a Namespace de Rede”.

  Esta opção está disponível apenas em plataformas que implementam suporte a namespaces de rede.
*  `--no-auto-rehash`, `-A`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-auto-rehash</code></td> </tr><tr><th>Descontinuado</th> <td>Sim</td> </tr></tbody></table>

  Isso tem o mesmo efeito que `--skip-auto-rehash`. Veja a descrição de `--auto-rehash`.
*  `--no-beep`, `-b`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-beep</code></td> </tr></tbody></table>

  Não emita um sinal sonoro quando ocorrerem erros.
*  `--no-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não leia arquivos de opções. Se o programa não conseguir iniciar devido à leitura de opções desconhecidas de um arquivo de opções, a opção `--no-defaults` pode ser usada para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando `--no-defaults` é usada. Para criar `.mylogin.cnf`, use o utilitário `mysql_config_editor`. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.
*  `--oci-config-file=PATH`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--oci-config-file</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code></code></td> </tr></tbody></table>

  Caminho alternativo para o arquivo de configuração da Oracle Cloud Infrastructure CLI. Especifique a localização do arquivo de configuração. Se o perfil padrão existente for o correto, você não precisa especificar esta opção. No entanto, se você tiver um arquivo de configuração existente, com vários perfis ou um padrão diferente do da entidade do usuário com quem deseja se conectar, especifique esta opção.
*  `--one-database`, `-o`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--one-database</code></td> </tr></tbody></table>

Ignore as declarações, exceto aquelas que ocorrem enquanto o banco de dados padrão é o nomeado na linha de comando. Esta opção é rudimentar e deve ser usada com cuidado. O filtro de declarações é baseado apenas em declarações `USE`.

Inicialmente, o `mysql` executa as declarações na entrada porque especificar um banco de dados *`db_name`* na linha de comando é equivalente a inserir `USE db_name` no início da entrada. Em seguida, para cada declaração `USE` encontrada, o `mysql` aceita ou rejeita as seguintes declarações, dependendo se o nome do banco de dados é o mesmo da linha de comando. O conteúdo das declarações é irrelevante.

Suponha que o `mysql` seja invocado para processar este conjunto de declarações:

```
  DELETE FROM db2.t2;
  USE db2;
  DROP TABLE db1.t1;
  CREATE TABLE db1.t1 (i INT);
  USE db1;
  INSERT INTO t1 (i) VALUES(1);
  CREATE TABLE db2.t1 (j INT);
  ```

Se a linha de comando for `mysql --force --one-database db1`, o `mysql` lida com a entrada da seguinte forma:

+ A declaração `DELETE` é executada porque o banco de dados padrão é `db1`, mesmo que a declaração nomeie uma tabela em um banco de dados diferente.
+ As declarações `DROP TABLE` e `CREATE TABLE` não são executadas porque o banco de dados padrão não é `db1`, mesmo que as declarações nomeiem uma tabela em `db1`.
+ As declarações `INSERT` e `CREATE TABLE` são executadas porque o banco de dados padrão é `db1`, mesmo que a declaração `CREATE TABLE` nomeie uma tabela em um banco de dados diferente.
*  `--pager[=command]`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--pager[=command]</code></td> </tr><tr><th>Desativado por</th> <td><code>skip-pager</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Use o comando fornecido para paginar a saída da consulta. Se o comando for omitido, o pager padrão é o valor da variável de ambiente `PAGER`. Os pagers válidos são `less`, `more`, `cat [> filename]` e assim por diante. Esta opção funciona apenas no Unix e apenas no modo interativo. Para desativar a paginação, use `--skip-pager`. A seção 6.5.1.2, “Comandos do Cliente do mysql”, discute a paginação de saída mais detalhadamente.
*  `--password[=password]`, `-p[password]`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password[=senha]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysql` solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Consulte a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o `mysql` não deve solicitar uma, use a opção `--skip-password`.
*  `--password1[=pass_val]`

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysql` solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Consulte a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o `mysql` não deve solicitar uma, use a opção `--skip-password1`.

   `--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.
*  `--password2[=pass_val]`

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.
*  `--password3[=pass_val]`

A senha para o fator de autenticação multifatorial 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para obter detalhes.
*  `--pipe`, `-W`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
*  `--plugin-authentication-kerberos-client-mode=value`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--plugin-authentication-kerberos-client-mode</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>SSPI</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>GSSAPI</code></p><p><code>SSPI</code></p></td> </tr></tbody></table>

  Em Windows, o plugin de autenticação `authentication_kerberos_client` suporta esta opção de plugin. Ele fornece dois valores possíveis que o usuário cliente pode definir em tempo de execução: `SSPI` e `GSSAPI`.

  O valor padrão para a opção de plugin do lado do cliente usa a Interface de Suporte de Suporte de Segurança (SSPI), que é capaz de adquirir credenciais do cache in-memory do Windows. Alternativamente, o usuário cliente pode selecionar um modo que suporte a Interface de Programa de Aplicação de Serviços de Segurança Genérico (GSSAPI) através da biblioteca MIT Kerberos em Windows. O GSSAPI é capaz de adquirir credenciais armazenadas anteriormente geradas usando o comando `kinit`.

  Para mais informações, consulte Comandos para Clientes em Windows no Modo GSSAPI.
*  `--plugin-authentication-webauthn-client-preserve-privacy={OFF|ON}`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--plugin-authentication-webauthn-client-preserve-privacy</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Determina como as asserções são enviadas ao servidor caso haja mais de uma credencial detectável armazenada para um ID de RP específico (um nome único dado ao servidor da parte de confiança, que é o servidor MySQL). Se o dispositivo FIDO2 contiver várias chaves residentes para um ID de RP específico, essa opção permite que o usuário escolha uma chave a ser usada para a asserção. Ela oferece dois valores possíveis que o usuário do cliente pode definir. O valor padrão é `OFF`. Se definido como `OFF`, o desafio é assinado por todas as credenciais disponíveis para um ID de RP específico e todas as assinaturas são enviadas ao servidor. Se definido como `ON`, o usuário é solicitado a escolher a credencial a ser usada para a assinatura.

  ::: info Nota

  Esta opção não tem efeito se o dispositivo não suportar a funcionalidade de chave residente.

  :::

  Para mais informações, consulte a Seção 8.4.1.11, “Autenticação Pluggable WebAuthn”.
*  `--plugin-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o `mysql` não o encontrar. Consulte a Seção 8.2.17, “Autenticação Pluggable”.
*  `--port=port_num`, `-P port_num`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Número</number></td> </tr><tr><th>Valor padrão</th> <td><code>3306</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado.
*  `--print-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para obter informações adicionais sobre isso e outras opções de arquivos de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
* `--prompt=format_str`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--prompt=format_str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>mysql></code></td> </tr></tbody></table>

Defina o prompt para o formato especificado. O padrão é `mysql>`. As sequências especiais que o prompt pode conter estão descritas na Seção 6.5.1.2, “Comandos do cliente mysql”.
* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--protocol=type</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[ver texto]</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>TCP</code></p><p><code>SOCKET</code></p><p><code>PIPE</code></p><p><code>MEMORY</code></p></td> </tr></tbody></table>

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de transporte de conexão”.
* `--quick`, `-q`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--quick</code></td> </tr></tbody></table>

Não cache cada resultado da consulta, imprima cada linha conforme ela é recebida. Isso pode atrasar o servidor se a saída for suspensa. Com esta opção, o `mysql` não usa o arquivo de histórico.

Por padrão, o `mysql` recupera todas as linhas de resultado antes de produzir qualquer saída; ao armazená-las, ele calcula um comprimento máximo de coluna em execução a partir do valor real de cada coluna em sucessão. Ao imprimir a saída, ele usa esse máximo para formatá-la. Quando a opção `--quick` é especificada, o `mysql` não tem as linhas para as quais calcular o comprimento antes de começar, e, portanto, usa o comprimento máximo. No exemplo a seguir, a tabela `t1` tem uma única coluna do tipo `BIGINT` (`INTEGER`, `INT`, `SMALLINT`, `TINYINT`, `MEDIUMINT`, `BIGINT`) e contém 4 linhas. A saída padrão tem 9 caracteres de largura; essa largura é igual ao número máximo de caracteres em qualquer um dos valores das colunas nas linhas retornadas (5), mais 2 caracteres cada para os espaços usados como preenchimento e os caracteres `|` usados como delimitadores de coluna). A saída ao usar a opção `--quick` tem 25 caracteres de largura; essa é igual ao número de caracteres necessários para representar `-9223372036854775808`, que é o valor mais longo possível que pode ser armazenado em uma coluna `BIGINT` (assinada), ou 19 caracteres, mais os 4 caracteres usados para preenchimento e delimitadores de coluna. A diferença pode ser vista aqui:

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
*  `--raw`, `-r`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--raw</code></td> </tr></tbody></table>

  Para a saída tabular, o "encaixe" ao redor das colunas permite que um valor de coluna seja distinguido de outro. Para a saída não tabular (como a produzida em modo batch ou quando a opção `--batch` ou `--silent` é dada), caracteres especiais são escavados na saída para que possam ser facilmente identificados. Novo linha, tabulação, `NUL` e barra invertida são escritos como `\n`, `\t`, `\0` e `\\`. A opção `--raw` desabilita esse escavação de caracteres.

  O exemplo a seguir demonstra a saída tabular versus não tabular e o uso do modo raw para desabilitar a escavação:

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
  ```
*  `--reconnect`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--reconnect</code></td> </tr><tr><th>Desativado por</th> <td><code>skip-reconnect</code></td> </tr></tbody></table>

  Se a conexão com o servidor for perdida, tente reconectar automaticamente. Uma única tentativa de reconexão é feita cada vez que a conexão é perdida. Para suprimir o comportamento de reconexão, use `--skip-reconnect`.
*  `--register-factor=value`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--register-factor=value</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O fator ou fatores para os quais o registro do dispositivo FIDO/FIDO2 deve ser realizado antes que a autenticação baseada em dispositivo WebAuthn possa ser usada. Este valor da opção deve ser um único valor, ou dois valores separados por vírgulas. Cada valor deve ser 2 ou 3, portanto, os valores permitidos da opção são `'2'`, `'3'`, `'2,3'` e `'3,2'`.

  Por exemplo, uma conta que requer registro para um terceiro fator de autenticação invoca o cliente `mysql` da seguinte forma:

  ```
  mysql --user=user_name --register-factor=3
  ```

  Uma conta que requer registro para o segundo e terceiro fatores de autenticação invoca o cliente `mysql` da seguinte forma:

  ```
  mysql --user=user_name --register-factor=2,3
  ```

  Se o registro for bem-sucedido, uma conexão é estabelecida. Se houver um fator de autenticação com um registro pendente, uma conexão é colocada no modo de registro pendente ao tentar se conectar ao servidor. Nesse caso, desconecte e reconecte com o valor correto da `--register-factor` para completar o registro.

  O registro é um processo de duas etapas, que compreende as etapas *iniciar o registro* e *terminar o registro*. A etapa de iniciar o registro executa esta declaração:

  ```
  ALTER USER user factor INITIATE REGISTRATION
  ```

  A declaração retorna um conjunto de resultados contendo um desafio de 32 bytes, o nome do usuário e o ID da parte de confiança (veja `authentication_webauthn_rp_id`).

  A etapa de terminar o registro executa esta declaração:

  ```
  ALTER USER user factor FINISH REGISTRATION SET CHALLENGE_RESPONSE AS 'auth_string'
  ```

A declaração completa o registro e envia as seguintes informações para o servidor como parte da `auth_string`: dados do autenticador, um certificado de atestação opcional no formato X.509 e uma assinatura.

As etapas de início e registro devem ser realizadas em uma única conexão, pois o desafio recebido pelo cliente durante a etapa de início é salvo no manipulador de conexão do cliente. O registro falharia se a etapa de registro fosse realizada por uma conexão diferente. A opção `--register-factor` executa tanto as etapas de início quanto de registro, o que evita o cenário de falha descrito acima e evita a necessidade de executar as declarações de início e registro `ALTER USER` manualmente.

A opção `--register-factor` está disponível apenas para os clientes `mysql` e MySQL Shell. Outros programas de clientes MySQL não a suportam.

Para informações relacionadas, consulte Usar a Autenticação WebAuthn. * `--safe-updates`, `--i-am-a-dummy`, `-U`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><p><code>--safe-updates</code></p><p><code>--i-am-a-dummy</code></p></td> </tr><tr><th>Tipo</th> <td><code>Booleano</code></td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

Se esta opção estiver habilitada, as declarações `UPDATE` e `DELETE` que não usam uma chave na cláusula `WHERE` ou uma cláusula `LIMIT` produzem um erro. Além disso, restrições são aplicadas às declarações `SELECT` que produzem (ou são estimadas para produzir) conjuntos de resultados muito grandes. Se você configurou esta opção em um arquivo de opções, pode usar `--skip-safe-updates` na linha de comando para sobrescrevê-la. Para obter mais informações sobre esta opção, consulte Usar o Modo Safe-Updates (`--safe-updates`)". * `--select-limit=value`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--select-limit=value</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>1000</code></td> </tr></tbody></table>

O limite automático para as instruções `SELECT` ao usar `--safe-updates`. (O valor padrão é `1`, `000`. )
* `--server-public-key-path=file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--server-public-key-path=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que autenticam-se com o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`. Esta opção é ignorada para contas que não autenticam-se com um desses plugins. Também é ignorada se a troca de senhas com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password` (desatualizado), esta opção aplica-se apenas se o MySQL foi compilado usando OpenSSL.

  Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Personalizável SHA-256”, e a Seção 8.4.1.2, “Autenticação Personalizável SHA-2”.
* `--shared-memory-base-name=name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--shared-memory-base-name=name</code></td> </tr></tbody></table>

  Em Windows, o nome da memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é `MYSQL`. O nome da memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção aplica-se apenas se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões com memória compartilhada.
* `--show-warnings`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--show-warnings</code></td> </tr></tbody></table>

Assegure-se de que as advertências sejam exibidas após cada declaração, se houver alguma. Esta opção aplica-se ao modo interativo e ao modo lote.
* `--sigint-ignore`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--sigint-ignore</code></td> </tr></tbody></table>

  Ignore os sinais `SIGINT` (geralmente o resultado de digitar `Control+C`).

  Sem esta opção, digitar `Control+C` interrompe a declaração atual, se houver, ou cancela qualquer linha de entrada parcial, caso contrário.
* `--silent`, `-s`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--silent</code></td> </tr></tbody></table>

  Modo silencioso. Produza menos saída. Esta opção pode ser dada várias vezes para produzir cada vez menos saída.

  Esta opção resulta em um formato de saída não tabular e na escavação de caracteres especiais. A escavação pode ser desativada usando o modo bruto; veja a descrição da opção `--raw`.
* `--skip-column-names`, `-N`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-column-names</code></td> </tr></tbody></table>

  Não escreva os nomes das colunas nos resultados. O uso desta opção faz com que a saída seja alinhada à direita, como mostrado aqui:

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
* `--skip-line-numbers`, `-L`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-line-numbers</code></td> </tr></tbody></table>

  Não escreva os números das linhas para erros. Útil quando você deseja comparar arquivos de resultado que incluem mensagens de erro.
* `--skip-system-command`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-system-command</code></td> </tr></tbody></table>

  Desabilita o comando `system` (`\!`). Equivalente a `--system-command=OFF`.
* `--socket=caminho`, `-S caminho`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--socket={nome_do_arquivo|nome_do_canal}</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Para conexões com `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do canal nomeado a ser usado.

Em Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
* `--ssl*`

  As opções que começam com `--ssl` especificam se a conexão com o servidor deve ser feita usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de Comando para Conexões Criptografadas.
*  `--ssl-fips-mode={OFF|ON|STRICT}`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Descontinuado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>STRICT</code></p></td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas.

  Esses valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS "estricto".
  
  ::: info Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza uma mensagem de aviso no início e opere no modo não FIPS.

  :::

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.
*  `--syslog`, `-j`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--syslog</code></td> </tr></tbody></table>

Essa opção faz com que o `mysql` envie declarações interativas para a ferramenta de registro do sistema. No Unix, isso é o `syslog`; no Windows, é o Registro de Eventos do Windows. O destino onde as mensagens registradas aparecem depende do sistema. No Linux, o destino é frequentemente o arquivo `/var/log/messages`.

Aqui está um exemplo de saída gerada no Linux usando `--syslog`. Essa saída é formatada para melhor legibilidade; cada mensagem registrada na verdade ocupa uma única linha.

```
  Mar  7 12:39:25 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
  Mar  7 12:39:28 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
  ```

Para mais informações, consulte a Seção 6.5.1.3, “Registro do Cliente do MySQL”.
*  `--system-command[={ON|OFF}]`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--system-command[={ON|OFF}]</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-system-command</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

Ative ou desabilite o comando `system` (`\!`). Quando essa opção é desativada, seja por `--system-command=OFF` ou por `--skip-system-command`, o comando `system` é rejeitado com um erro.

(*MySQL 8.4.6 e versões posteriores:*) `--commands`, quando desativado (definido como `FALSE`), faz com que o servidor ignore qualquer configuração para essa opção.
*  `--table`, `-t`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--table</code></td> </tr></tbody></table>

Exiba a saída em formato de tabela. Isso é o padrão para uso interativo, mas pode ser usado para produzir saída em tabela em modo batch.
*  `--tee=nome_arquivo`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--tee=nome_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

Adicione uma cópia da saída ao arquivo especificado. Essa opção funciona apenas no modo interativo. A Seção 6.5.1.2, “Comandos do Cliente do MySQL”, discute mais sobre arquivos tee.
*  `--tls-ciphersuites=lista_suites_de_cifras`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-ciphersuites=lista_de_cifra_suíte</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr></tbody></table>

  As cifra_suítes permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de cifra_suítes separados por vírgula. As cifra_suítes que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra_suítes TLS de Conexão Criptografada”.
*  `--tls-sni-servername=nome_do_servidor`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-sni-servername=nome_do_servidor</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr></tbody></table>

  Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que esta opção funcione). A implementação do SNI do MySQL representa apenas o lado do cliente.
*  `--tls-version=lista_de_protocolos`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-version=lista_de_protocolos</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr><tr><th>Valor padrão</th> <td><p><code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code> (OpenSSL 1.1.1 ou superior)</p><p><code>TLSv1,TLSv1.1,TLSv1.2</code> (caso contrário)</p></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra_suítes TLS de Conexão Criptografada”.
*  `--unbuffered`, `-n`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--unbuffered</code></td> </tr></tbody></table>

  Esvazie o buffer após cada consulta.
*  `--user=user_name`, `-u user_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--user=user_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome do usuário da conta MySQL a ser usado para se conectar ao servidor.
*  `--verbose`, `-v`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose. Produza mais saída sobre o que o programa faz. Esta opção pode ser dada várias vezes para produzir mais e mais saída. (Por exemplo, `-v -v -v` produz o formato de saída da tabela mesmo no modo batch.)
*  `--version`, `-V`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--version</code></td> </tr></tbody></table>

  Exibir informações da versão e sair.
*  `--vertical`, `-E`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--vertical</code></td> </tr></tbody></table>

  Imprima as linhas de saída da consulta verticalmente (uma linha por valor da coluna). Sem esta opção, você pode especificar a saída vertical para declarações individuais terminando-as com `\G`.
*  `--wait`, `-w`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--wait</code></td> </tr></tbody></table>

  Se a conexão não puder ser estabelecida, espere e tente novamente em vez de abortar.
*  `--xml`, `-X`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--xml</code></td> </tr></tbody></table>

  Produza saída em formato XML.

  ```
  <field name="column_name">NULL</field>
  ```

  A saída quando `--xml` é usado com `mysql` corresponde à do `mysqldump` `--xml`. Veja a Seção 6.5.4, “mysqldump — Um programa de backup de banco de dados”, para detalhes.

  A saída XML também usa um namespace XML, como mostrado aqui:

  ```
  $> mysql --xml -uroot -e "SHOW VARIABLES LIKE 'version%'"
  <?xml version="1.0"?>

  <resultset statement="SHOW VARIABLES LIKE 'version%'" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <row>
  <field name="Variable_name">version</field>
  <field name="Value">5.0.40-debug</field>
  </row>

  <row>
  <field name="Variable_name">version_comment</field>
  <field name="Value">Source distribution</field>
  </row>

  <row>
  <field name="Variable_name">version_compile_machine</field>
  <field name="Value">i686</field>
  </row>

  <row>
  <field name="Variable_name">version_compile_os</field>
  <field name="Value">suse-linux-gnu</field>
  </row>
  </resultset>
  ```
*  `--zstd-compression-level=level`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--zstd-compression-level=#</code></td> </tr><tr><th>Tipo</th> <td><code>Inteiro</code></td> </tr></tbody></table>

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão é 3. O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”. *  `telemetry_client`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--telemetry_client</code></td> </tr><tr><th>Tipo</th> <td><code>Booleano</code></td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Habilita o plugin de cliente de telemetria (apenas Linux).

  Para mais informações, consulte o Capítulo 35, *Telemetria*.