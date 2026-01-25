#### 4.5.1.1 Opções do Cliente mysql

O **mysql** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, consulte Seção 4.2.2.2, “Usando Arquivos de Opções”.

**Tabela 4.13 Opções do Cliente mysql**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para o cliente mysql."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> <th>Introduzida</th> <th>Descontinuada</th> </tr></thead><tbody><tr><th>--auto-rehash</th> <td>Habilita o rehashing automático</td> <td></td> <td></td> </tr><tr><th>--auto-vertical-output</th> <td>Habilita a exibição automática vertical de result sets</td> <td></td> <td></td> </tr><tr><th>--batch</th> <td>Não usa arquivo de histórico</td> <td></td> <td></td> </tr><tr><th>--binary-as-hex</th> <td>Exibe valores binários em notação hexadecimal</td> <td>5.7.19</td> <td></td> </tr><tr><th>--binary-mode</th> <td>Desabilita a tradução de \r\n para \n e o tratamento de \0 como fim-de-Query</td> <td></td> <td></td> </tr><tr><th>--bind-address</th> <td>Usa a interface de rede especificada para conectar ao MySQL Server</td> <td></td> <td></td> </tr><tr><th>--character-sets-dir</th> <td>Diretório onde os character sets estão instalados</td> <td></td> <td></td> </tr><tr><th>--column-names</th> <td>Escreve nomes de colunas nos resultados</td> <td></td> <td></td> </tr><tr><th>--column-type-info</th> <td>Exibe metadados do result set</td> <td></td> <td></td> </tr><tr><th>--commands</th> <td>Habilita ou desabilita o processamento de comandos locais do cliente mysql</td> <td>5.7.44-ndb-7.6.35</td> <td></td> </tr><tr><th>--comments</th> <td>Se deve reter ou remover comentários em statements enviados ao servidor</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Compacta todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td></td> </tr><tr><th>--connect-expired-password</th> <td>Indica ao servidor que o cliente pode lidar com o modo sandbox de password expirada</td> <td></td> <td></td> </tr><tr><th>--connect-timeout</th> <td>Número de segundos antes do timeout da conexão</td> <td></td> <td></td> </tr><tr><th>--database</th> <td>O Database a ser usado</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Escreve log de debugging; suportado apenas se o MySQL foi construído com suporte a debugging</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Imprime informações de debugging quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Imprime informações de debugging, memória e estatísticas de CPU quando o programa é encerrado</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Plugin de Authentication a ser usado</td> <td></td> <td></td> </tr><tr><th>--default-character-set</th> <td>Especifica o character set padrão</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Lê o arquivo de opções nomeado além dos arquivos de opções usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Lê apenas o arquivo de opções nomeado</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th>--delimiter</th> <td>Define o statement delimiter</td> <td></td> <td></td> </tr><tr><th>--enable-cleartext-plugin</th> <td>Habilita o plugin de Authentication cleartext</td> <td></td> <td></td> </tr><tr><th>--execute</th> <td>Executa o statement e sai</td> <td></td> <td></td> </tr><tr><th>--force</th> <td>Continua mesmo se ocorrer um erro SQL</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Solicita a public key RSA do servidor</td> <td>5.7.23</td> <td></td> </tr><tr><th>--help</th> <td>Exibe mensagem de ajuda e sai</td> <td></td> <td></td> </tr><tr><th>--histignore</th> <td>Padrões especificando quais statements ignorar para logging</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Host onde o MySQL server está localizado</td> <td></td> <td></td> </tr><tr><th>--html</th> <td>Produz saída HTML</td> <td></td> <td></td> </tr><tr><th>--ignore-spaces</th> <td>Ignora espaços após nomes de funções</td> <td></td> <td></td> </tr><tr><th>--init-command</th> <td>Statement SQL para executar após a conexão</td> <td></td> <td></td> </tr><tr><th>--line-numbers</th> <td>Escreve números de linha para erros</td> <td></td> <td></td> </tr><tr><th>--local-infile</th> <td>Habilita ou desabilita a capacidade LOCAL para LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Lê opções de login path de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--max-allowed-packet</th> <td>Comprimento máximo do packet para enviar ou receber do servidor</td> <td></td> <td></td> </tr><tr><th>--max-join-size</th> <td>O limite automático para linhas em um JOIN ao usar --safe-updates</td> <td></td> <td></td> </tr><tr><th>--named-commands</th> <td>Habilita comandos mysql nomeados</td> <td></td> <td></td> </tr><tr><th>--net-buffer-length</th> <td>Tamanho do Buffer para comunicação TCP/IP e socket</td> <td></td> <td></td> </tr><tr><th>--no-auto-rehash</th> <td>Desabilita rehashing automático</td> <td></td> <td></td> </tr><tr><th>--no-beep</th> <td>Não emite bipe quando ocorrem erros</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não lê arquivos de opções</td> <td></td> <td></td> </tr><tr><th>--one-database</th> <td>Ignora statements, exceto aqueles para o Database padrão nomeado na linha de comando</td> <td></td> <td></td> </tr><tr><th>--pager</th> <td>Usa o comando fornecido para paginação da saída de Query</td> <td></td> <td></td> </tr><tr><th>--password</th> <td>Password para usar ao conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--pipe</th> <td>Conecta ao servidor usando named pipe (somente Windows)</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins estão instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número da porta TCP/IP para conexão</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Imprime opções padrão</td> <td></td> <td></td> </tr><tr><th>--prompt</th> <td>Define o prompt para o formato especificado</td> <td></td> <td></td> </tr><tr><th>--protocol</th> <td>Protocolo de transporte a ser usado</td> <td></td> <td></td> </tr><tr><th>--quick</th> <td>Não faz cache de cada resultado de Query</td> <td></td> <td></td> </tr><tr><th>--raw</th> <td>Escreve valores de coluna sem conversão de escape</td> <td></td> <td></td> </tr><tr><th>--reconnect</th> <td>Se a conexão com o servidor for perdida, tenta reconectar automaticamente</td> <td></td> <td></td> </tr><tr><th>--safe-updates, --i-am-a-dummy</th> <td>Permite apenas statements UPDATE e DELETE que especificam valores de chave</td> <td></td> <td></td> </tr><tr><th>--secure-auth</th> <td>Não envia passwords para o servidor no formato antigo (pré-4.1)</td> <td></td> <td>Sim</td> </tr><tr><th>--select-limit</th> <td>O limite automático para statements SELECT ao usar --safe-updates</td> <td></td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Nome do caminho para o arquivo contendo a public key RSA</td> <td></td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome da shared-memory para conexões de shared-memory (somente Windows)</td> <td></td> <td></td> </tr><tr><th>--show-warnings</th> <td>Mostra warnings após cada statement, se houver</td> <td></td> <td></td> </tr><tr><th>--sigint-ignore</th> <td>Ignora sinais SIGINT (geralmente resultado de digitar Control+C)</td> <td></td> <td></td> </tr><tr><th>--silent</th> <td>Modo silencioso</td> <td></td> <td></td> </tr><tr><th>--skip-auto-rehash</th> <td>Desabilita rehashing automático</td> <td></td> <td></td> </tr><tr><th>--skip-column-names</th> <td>Não escreve nomes de colunas nos resultados</td> <td></td> <td></td> </tr><tr><th>--skip-line-numbers</th> <td>Ignora números de linha para erros</td> <td></td> <td></td> </tr><tr><th>--skip-named-commands</th> <td>Desabilita comandos mysql nomeados</td> <td></td> <td></td> </tr><tr><th>--skip-pager</th> <td>Desabilita paginação</td> <td></td> <td></td> </tr><tr><th>--skip-reconnect</th> <td>Desabilita a reconexão</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo socket Unix ou named pipe Windows a ser usado</td> <td></td> <td></td> </tr><tr><th>--ssl</th> <td>Habilita a criptografia da conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>Arquivo que contém a lista de Certificate Authorities SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Diretório que contém arquivos de certificado de Certificate Authority SSL confiáveis</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Ciphers permitidos para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificado</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificado</td> <td></td> <td></td> </tr><tr><th>--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td>5.7.11</td> <td></td> </tr><tr><th>--ssl-verify-server-cert</th> <td>Verifica o nome do host em relação à identidade Common Name do certificado do servidor</td> <td></td> <td></td> </tr><tr><th>--syslog</th> <td>Registra statements interativos no syslog</td> <td></td> <td></td> </tr><tr><th>--table</th> <td>Exibe a saída em formato de tabela</td> <td></td> <td></td> </tr><tr><th>--tee</th> <td>Anexa uma cópia da saída ao arquivo nomeado</td> <td></td> <td></td> </tr><tr><th>--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> <td></td> </tr><tr><th>--unbuffered</th> <td>Limpa o Buffer após cada Query</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Nome de usuário MySQL a ser usado ao conectar ao servidor</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Modo verbose</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Exibe informações de versão e sai</td> <td></td> <td></td> </tr><tr><th>--vertical</th> <td>Imprime linhas de saída de Query verticalmente (uma linha por valor de coluna)</td> <td></td> <td></td> </tr><tr><th>--wait</th> <td>Se a conexão não puder ser estabelecida, espera e tenta novamente em vez de abortar</td> <td></td> <td></td> </tr><tr><th>--xml</th> <td>Produz saída XML</td> <td></td> <td></td> </tr> </tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `--auto-rehash`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Habilita rehashing automático. Esta opção está ativada por padrão, o que permite o preenchimento automático de nomes de Databases, tabelas e colunas. Use `--disable-auto-rehash` para desabilitar o rehashing. Isso faz com que o **mysql** inicie mais rapidamente, mas você deve emitir o comando `rehash` ou seu atalho `\#` se quiser usar o preenchimento automático de nomes.

  Para preencher um nome, digite a primeira parte e pressione Tab. Se o nome for inequívoco, o **mysql** o preenche. Caso contrário, você pode pressionar Tab novamente para ver os nomes possíveis que começam com o que você digitou até agora. O preenchimento automático não ocorre se não houver um Database padrão.

  Nota

  Este recurso requer um cliente MySQL compilado com a biblioteca **readline**. Tipicamente, a biblioteca **readline** não está disponível no Windows.

* `--auto-vertical-output`

  <table frame="box" rules="all" summary="Propriedades para auto-vertical-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Faz com que os result sets sejam exibidos verticalmente se forem muito largos para a janela atual, e usem o formato tabular normal caso contrário. (Isso se aplica a statements terminados por `;` ou `\G`.)

* `--batch`, `-B`

  <table frame="box" rules="all" summary="Propriedades para batch"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  Imprime resultados usando tabulação como separador de colunas, com cada linha em uma nova linha. Com esta opção, o **mysql** não usa o arquivo de histórico.

  O modo Batch resulta em formato de saída não tabular e escape de caracteres especiais. O escape pode ser desabilitado usando o modo raw; consulte a descrição para a opção `--raw`.

* `--binary-as-hex`

  <table frame="box" rules="all" summary="Propriedades para binary-as-hex"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduzida</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Quando esta opção é fornecida, o **mysql** exibe dados binários usando notação hexadecimal (`0xvalue`). Isso ocorre independentemente de o formato de exibição da saída geral ser tabular, vertical, HTML ou XML.

  O `--binary-as-hex` quando ativado afeta a exibição de todas as strings binárias, incluindo aquelas retornadas por funções como `CHAR()` e `UNHEX()`. O exemplo a seguir demonstra isso usando o código ASCII para `A` (65 decimal, 41 hexadecimal):

  + `--binary-as-hex` desativado:

    ```sql
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------+-------------+
    | CHAR(0x41) | UNHEX('41') |
    +------------+-------------+
    | A          | A           |
    +------------+-------------+
    ```

  + `--binary-as-hex` ativado:

    ```sql
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------------------+--------------------------+
    | CHAR(0x41)             | UNHEX('41')              |
    +------------------------+--------------------------+
    | 0x41                   | 0x41                     |
    +------------------------+--------------------------+
    ```

  Para escrever uma expressão de string binária de modo que ela seja exibida como uma string de caracteres, independentemente de `--binary-as-hex` estar ativado, use estas técnicas:

  + A função `CHAR()` tem uma cláusula `USING charset`:

    ```sql
    mysql> SELECT CHAR(0x41 USING utf8mb4);
    +--------------------------+
    | CHAR(0x41 USING utf8mb4) |
    +--------------------------+
    | A                        |
    +--------------------------+
    ```

  + De forma mais geral, use `CONVERT()` para converter uma expressão para um determinado character set:

    ```sql
    mysql> SELECT CONVERT(UNHEX('41') USING utf8mb4);
    +------------------------------------+
    | CONVERT(UNHEX('41') USING utf8mb4) |
    +------------------------------------+
    | A                                  |
    +------------------------------------+
    ```

  Esta opção foi adicionada no MySQL 5.7.19.

* `--binary-mode`

  <table frame="box" rules="all" summary="Propriedades para binary-mode"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  Esta opção ajuda ao processar a saída do **mysqlbinlog** que pode conter valores `BLOB`. Por padrão, o **mysql** traduz `\r\n` em statement strings para `\n` e interpreta `\0` como o terminador de statement. O `--binary-mode` desabilita ambas as funcionalidades. Ele também desabilita todos os comandos **mysql**, exceto `charset` e `delimiter` em modo não interativo (para input canalizado para o **mysql** ou carregado usando o comando `source`).

  (*NDB Cluster 7.6.35 e posterior:*) O `--binary-mode`, quando ativado, faz com que o servidor desconsidere qualquer configuração para `--commands`.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para conectar ao MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Directory name</td> </tr></tbody></table>

  O diretório onde os character sets estão instalados. Consulte Seção 10.15, “Configuração de Character Set”.

* `--column-names`

  <table frame="box" rules="all" summary="Propriedades para column-names"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--column-names</code></td> </tr></tbody></table>

  Escreve nomes de colunas nos resultados.

* `--column-type-info`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe metadados do result set. Esta informação corresponde ao conteúdo das estruturas de dados `MYSQL_FIELD` da C API. Consulte Estruturas Básicas de Dados da C API.

* `--commands`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Se deve habilitar ou desabilitar o processamento de comandos locais do cliente **mysql**. Definir esta opção como `FALSE` desabilita tal processamento e tem os efeitos listados aqui:

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

  Esta opção não tem efeito quando `--binary-mode` está ativado.

  Quando `--commands` está ativado, é possível desabilitar (somente) o comando `system` usando a opção `--system-command`.

  Esta opção foi adicionada no NDB Cluster 7.6.35.

* `--comments`, `-c`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Se deve remover ou preservar comentários em statements enviados ao servidor. O padrão é `--skip-comments` (remover comentários), habilite com `--comments` (preservar comentários).

  Nota

  No MySQL 5.7, o cliente **mysql** sempre passa optimizer hints para o servidor, independentemente de esta opção ser fornecida. Para garantir que os optimizer hints não sejam removidos se você estiver usando uma versão mais antiga do cliente **mysql** com uma versão do servidor que entenda optimizer hints, invoque o **mysql** com a opção `--comments`.

  A remoção de comentários está descontinuada a partir do MySQL 5.7.20. Você deve esperar que este recurso e as opções para controlá-lo sejam removidos em uma futura release do MySQL.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Compacta todas as informações enviadas entre o cliente e o servidor, se possível. Consulte Seção 4.2.6, “Controle de Compressão de Conexão”.

* `--connect-expired-password`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Indica ao servidor que o cliente pode lidar com o modo sandbox se a conta usada para conectar tiver um password expirado. Isso pode ser útil para invocações não interativas do **mysql** porque, normalmente, o servidor desconecta clientes não interativos que tentam conectar usando uma conta com um password expirado. (Consulte Seção 6.2.12, “Tratamento de Passwords Expirados pelo Servidor”.)

* `--connect-timeout=value`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O número de segundos antes do timeout da conexão. (O valor padrão é `0`.)

* `--database=db_name`, `-D db_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O Database a ser usado. Isso é útil principalmente em um arquivo de opções.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Escreve um log de debugging. Uma string *`debug_options`* típica é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysql.trace`.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de release do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Imprime algumas informações de debugging quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de release do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Imprime informações de debugging e estatísticas de uso de memória e CPU quando o programa é encerrado.

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de release do MySQL fornecidos pela Oracle *não* são construídos usando esta opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Uma dica sobre qual plugin de Authentication do lado do cliente usar. Consulte Seção 6.2.13, “Authentication Pluggable”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Usa *`charset_name`* como o character set padrão para o cliente e a conexão.

  Esta opção pode ser útil se o sistema operacional usar um character set e o cliente **mysql** usar outro por padrão. Neste caso, a saída pode ser formatada incorretamente. Você geralmente pode corrigir tais problemas usando esta opção para forçar o cliente a usar o character set do sistema.

  Para mais informações, consulte Seção 10.4, “Character Sets e Collations de Conexão”, e Seção 10.15, “Configuração de Character Set”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Lê este arquivo de opções após o arquivo de opções global, mas (no Unix) antes do arquivo de opções do usuário. Se o arquivo não existir ou estiver inacessível, ocorre um erro. Se *`file_name`* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual.

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Manuseio de Arquivos de Opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Usa apenas o arquivo de opções fornecido. Se o arquivo não existir ou estiver inacessível, ocorre um erro. Se *`file_name`* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, programas cliente leem `.mylogin.cnf`.

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Manuseio de Arquivos de Opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Lê não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o **mysql** normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for dada como `--defaults-group-suffix=_other`, o **mysql** também lê os grupos `[client_other]` e `[mysql_other]`.

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Manuseio de Arquivos de Opções”.

* `--delimiter=str`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Define o statement delimiter. O padrão é o caractere ponto e vírgula (`;`).

* `--disable-named-commands`

  Desabilita comandos nomeados. Use a forma `\*` apenas, ou use comandos nomeados apenas no início de uma linha que termina com ponto e vírgula (`;`). O **mysql** inicia com esta opção *ativada* por padrão. No entanto, mesmo com esta opção, comandos de formato longo ainda funcionam a partir da primeira linha. Consulte Seção 4.5.1.2, “Comandos do Cliente mysql”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Habilita o plugin de Authentication cleartext `mysql_clear_password`. (Consulte Seção 6.4.1.6, “Authentication Pluggable Cleartext do Lado do Cliente”.)

* `--execute=statement`, `-e statement`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Executa o statement e sai. O formato de saída padrão é como o produzido com `--batch`. Consulte Seção 4.2.2.1, “Usando Opções na Linha de Comando”, para alguns exemplos. Com esta opção, o **mysql** não usa o arquivo de histórico.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Continua mesmo se ocorrer um erro SQL.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para auto-rehash"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Solicita do servidor a public key necessária para a troca de password baseada em par de chaves RSA. Esta opção se aplica a clientes que autenticam com o plugin de Authentication `caching_sha2_password`. Para esse plugin, o servidor não envia a public key, a menos que seja solicitada. Esta opção é ignorada para contas que não autenticam com esse plugin. Também é ignorada se a troca de password baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de public key válido, ele terá precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte Seção 6.4.1.4, “Authentication Pluggable Caching SHA-2”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--histignore`

  <table frame="box" rules="all" summary="Propriedades para auto-vertical-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Uma lista de um ou mais padrões separados por dois pontos especificando statements a serem ignorados para fins de logging. Esses padrões são adicionados à lista de padrões padrão (`"*IDENTIFIED*:*PASSWORD*"`). O valor especificado para esta opção afeta o logging de statements escritos no arquivo de histórico, e no `syslog` se a opção `--syslog` for fornecida. Para mais informações, consulte Seção 4.5.1.3, “Logging do Cliente mysql”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para auto-vertical-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Conecta ao MySQL server no host fornecido.

* `--html`, `-H`

  <table frame="box" rules="all" summary="Propriedades para auto-vertical-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Produz saída HTML.

* `--ignore-spaces`, `-i`

  <table frame="box" rules="all" summary="Propriedades para auto-vertical-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Ignora espaços após nomes de funções. O efeito disso é descrito na discussão para o modo SQL `IGNORE_SPACE` (consulte Seção 5.1.10, “Modos SQL do Servidor”).

* `--init-command=str`

  <table frame="box" rules="all" summary="Propriedades para auto-vertical-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Statement SQL para executar após conectar ao servidor. Se a reconexão automática estiver ativada, o statement é executado novamente após a reconexão.

* `--line-numbers`

  <table frame="box" rules="all" summary="Propriedades para auto-vertical-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Escreve números de linha para erros. Desabilite isso com `--skip-line-numbers`.

* `--local-infile[={0|1}]`

  <table frame="box" rules="all" summary="Propriedades para auto-vertical-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Por padrão, a capacidade `LOCAL` para `LOAD DATA` é determinada pelo padrão compilado na biblioteca cliente MySQL. Para habilitar ou desabilitar explicitamente o carregamento de dados `LOCAL`, use a opção `--local-infile`. Quando fornecida sem valor, a opção habilita o carregamento de dados `LOCAL`. Quando fornecida como `--local-infile=0` ou `--local-infile=1`, a opção desabilita ou habilita o carregamento de dados `LOCAL`.

  O uso bem-sucedido de operações de carregamento `LOCAL` dentro do **mysql** também requer que o servidor permita o carregamento local; consulte Seção 6.1.6, “Considerações de Segurança para LOAD DATA LOCAL”.

* `--login-path=name`

  <table frame="box" rules="all" summary="Propriedades para auto-vertical-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Lê opções do login path nomeado no arquivo de login path `.mylogin.cnf`. Um “login path” é um grupo de opções contendo opções que especificam a qual MySQL server conectar e com qual conta autenticar. Para criar ou modificar um arquivo de login path, use a utility **mysql_config_editor**. Consulte Seção 4.6.6, “mysql_config_editor — Utility de Configuração MySQL”.

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Manuseio de Arquivos de Opções”.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Propriedades para auto-vertical-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  O tamanho máximo do Buffer para comunicação cliente/servidor. O padrão é 16MB, o máximo é 1GB.

* `--max-join-size=value`

  <table frame="box" rules="all" summary="Propriedades para auto-vertical-output"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  O limite automático para linhas em um JOIN ao usar `--safe-updates`. (O valor padrão é 1.000.000.)

* `--named-commands`, `-G`

  <table frame="box" rules="all" summary="Propriedades para batch"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  Habilita comandos **mysql** nomeados. Comandos de formato longo são permitidos, não apenas comandos de formato curto. Por exemplo, `quit` e `\q` são reconhecidos. Use `--skip-named-commands` para desabilitar comandos nomeados. Consulte Seção 4.5.1.2, “Comandos do Cliente mysql”.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Propriedades para batch"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  O tamanho do Buffer para comunicação TCP/IP e socket. (O valor padrão é 16KB.)

* `--no-auto-rehash`, `-A`

  <table frame="box" rules="all" summary="Propriedades para batch"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  Isso tem o mesmo efeito que `--skip-auto-rehash`. Consulte a descrição para `--auto-rehash`.

* `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Propriedades para batch"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  Não emite bipe quando ocorrem erros.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para batch"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  Não lê nenhum arquivo de opções. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que sejam lidos.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que passwords sejam especificados de forma mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use a utility **mysql_config_editor**. Consulte Seção 4.6.6, “mysql_config_editor — Utility de Configuração MySQL”.

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Manuseio de Arquivos de Opções”.

* `--one-database`, `-o`

  <table frame="box" rules="all" summary="Propriedades para batch"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  Ignora statements, exceto aqueles que ocorrem enquanto o Database padrão é o nomeado na linha de comando. Esta opção é rudimentar e deve ser usada com cautela. A filtragem de statement é baseada apenas em statements `USE`.

  Inicialmente, o **mysql** executa statements na entrada porque especificar um Database *`db_name`* na linha de comando é equivalente a inserir `USE db_name` no início da entrada. Em seguida, para cada statement `USE` encontrado, o **mysql** aceita ou rejeita os statements seguintes, dependendo se o Database nomeado é o da linha de comando. O conteúdo dos statements é imaterial.

  Suponha que o **mysql** seja invocado para processar este conjunto de statements:

  ```sql
  DELETE FROM db2.t2;
  USE db2;
  DROP TABLE db1.t1;
  CREATE TABLE db1.t1 (i INT);
  USE db1;
  INSERT INTO t1 (i) VALUES(1);
  CREATE TABLE db2.t1 (j INT);
  ```

  Se a linha de comando for **mysql --force --one-database db1**, o **mysql** lida com a entrada da seguinte forma:

  + O statement `DELETE` é executado porque o Database padrão é `db1`, embora o statement nomeie uma tabela em um Database diferente.

  + Os statements `DROP TABLE` e `CREATE TABLE` não são executados porque o Database padrão não é `db1`, embora os statements nomeiem uma tabela em `db1`.

  + Os statements `INSERT` e `CREATE TABLE` são executados porque o Database padrão é `db1`, embora o statement `CREATE TABLE` nomeie uma tabela em um Database diferente.

* `--pager[=command]`

  <table frame="box" rules="all" summary="Propriedades para batch"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  Usa o comando fornecido para paginação da saída de Query. Se o comando for omitido, o pager padrão é o valor de sua variável de ambiente `PAGER`. Pagers válidos são **less**, **more**, **cat [> filename]**, e assim por diante. Esta opção funciona apenas no Unix e somente em modo interativo. Para desabilitar a paginação, use `--skip-pager`. A Seção 4.5.1.2, “Comandos do Cliente mysql”, discute a paginação de saída em mais detalhes.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para batch"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  O password da conta MySQL usada para conectar ao servidor. O valor do password é opcional. Se não for fornecido, o **mysql** solicitará um. Se fornecido, não deve haver *espaço* entre `--password=` ou `-p` e o password que o segue. Se nenhuma opção de password for especificada, o padrão é não enviar password.

  Especificar um password na linha de comando deve ser considerado inseguro. Para evitar fornecer o password na linha de comando, use um arquivo de opções. Consulte Seção 6.1.2.1, “Diretrizes do Usuário Final para Segurança de Password”.

  Para especificar explicitamente que não há password e que o **mysql** não deve solicitá-lo, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para batch"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  No Windows, conecta ao servidor usando um named pipe. Esta opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` ativada para suportar conexões de named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para batch"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--batch</code></td> </tr></tbody></table>

  O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de Authentication, mas o **mysql** não o encontrar. Consulte Seção 6.2.13, “Authentication Pluggable”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para binary-as-hex"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduzida</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número da porta a ser usado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para binary-as-hex"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduzida</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprime o nome do programa e todas as opções que ele obtém dos arquivos de opções.

  Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Manuseio de Arquivos de Opções”.

* `--prompt=format_str`

  <table frame="box" rules="all" summary="Propriedades para binary-as-hex"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduzida</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Define o prompt para o formato especificado. O padrão é `mysql>`. As sequências especiais que o prompt pode conter estão descritas na Seção 4.5.1.2, “Comandos do Cliente mysql”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para binary-as-hex"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduzida</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente daquele que você deseja. Para detalhes sobre os valores permitidos, consulte Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Propriedades para binary-as-hex"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduzida</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Não armazena em cache (cache) o resultado de cada Query, imprime cada linha à medida que é recebida. Isso pode atrasar o servidor se a saída for suspensa. Com esta opção, o **mysql** não usa o arquivo de histórico.

  Por padrão, o **mysql** busca todas as linhas de resultado antes de produzir qualquer saída; enquanto as armazena, ele calcula um comprimento máximo de coluna contínuo a partir do valor real de cada coluna em sucessão. Ao imprimir a saída, ele usa este máximo para formatá-la. Quando `--quick` é especificado, o **mysql** não tem as linhas para as quais calcular o comprimento antes de começar e, portanto, usa o comprimento máximo. No exemplo a seguir, a tabela `t1` tem uma única coluna do tipo `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e contém 4 linhas. A saída padrão tem 9 caracteres de largura; esta largura é igual ao número máximo de caracteres em qualquer um dos valores de coluna nas linhas retornadas (5), mais 2 caracteres para os espaços usados como padding e os caracteres `|` usados como delimitadores de coluna. A saída ao usar a opção `--quick` tem 25 caracteres de largura; isso é igual ao número de caracteres necessários para representar `-9223372036854775808`, que é o maior valor possível que pode ser armazenado em uma coluna `BIGINT` (assinada), ou 19 caracteres, mais os 4 caracteres usados para padding e delimitadores de coluna. A diferença pode ser vista aqui:

  ```sql
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

  <table frame="box" rules="all" summary="Propriedades para binary-as-hex"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduzida</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Para saída tabular, o “enquadramento” em torno das colunas permite que um valor de coluna seja distinguido de outro. Para saída não tabular (como a produzida no modo batch ou quando a opção `--batch` ou `--silent` é fornecida), caracteres especiais são escapados na saída para que possam ser facilmente identificados. Nova linha, tabulação, `NUL` e barra invertida são escritos como `\n`, `\t`, `\0` e `\\`. A opção `--raw` desabilita este escape de caracteres.

  O exemplo a seguir demonstra a saída tabular versus não tabular e o uso do modo raw para desabilitar o escape:

  ```sql
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

* `--reconnect`

  <table frame="box" rules="all" summary="Propriedades para binary-as-hex"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduzida</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Se a conexão com o servidor for perdida, tenta reconectar automaticamente. Uma única tentativa de reconexão é feita cada vez que a conexão é perdida. Para suprimir o comportamento de reconexão, use `--skip-reconnect`.

* `--safe-updates`, `--i-am-a-dummy`, `-U`

  <table frame="box" rules="all" summary="Propriedades para binary-as-hex"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduzida</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Se esta opção estiver ativada, statements `UPDATE` e `DELETE` que não usam uma chave na cláusula `WHERE` ou uma cláusula `LIMIT` produzem um erro. Além disso, restrições são impostas a statements `SELECT` que produzem (ou são estimados a produzir) result sets muito grandes. Se você definiu esta opção em um arquivo de opções, você pode usar `--skip-safe-updates` na linha de comando para anulá-la. Para mais informações sobre esta opção, consulte Usando o Modo Safe-Updates (--safe-updates)").

* `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para binary-as-hex"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduzida</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Não envia passwords para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de password mais recente.

  A partir do MySQL 5.7.5, esta opção está descontinuada; espere que ela seja removida em uma futura release do MySQL. Ela está sempre ativada e tentar desativá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, esta opção é ativada por padrão, mas pode ser desativada.

  Nota

  Passwords que usam o método de hashing pré-4.1 são menos seguras do que passwords que usam o método nativo de hashing de password e devem ser evitadas. Passwords pré-4.1 estão descontinuadas e o suporte a elas foi removido no MySQL 5.7.5. Para instruções de upgrade de conta, consulte Seção 6.4.1.3, “Migrando de Hashing de Password Pré-4.1 e do Plugin mysql_old_password”.

* `--select-limit=value`

  <table frame="box" rules="all" summary="Propriedades para binary-as-hex"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduzida</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  O limite automático para statements `SELECT` ao usar `--safe-updates`. (O valor padrão é 1.000.)

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Propriedades para binary-mode"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  O nome do caminho para um arquivo no formato PEM contendo uma cópia do lado do cliente da public key exigida pelo servidor para troca de password baseada em par de chaves RSA. Esta opção se aplica a clientes que autenticam com o plugin de Authentication `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não autenticam com um desses plugins. Também é ignorada se a troca de password baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de public key válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, esta opção se aplica apenas se o MySQL foi construído usando OpenSSL.

  Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte Seção 6.4.1.5, “Authentication Pluggable SHA-256”, e Seção 6.4.1.4, “Authentication Pluggable Caching SHA-2”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Propriedades para binary-mode"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  No Windows, o nome da shared-memory a ser usado para conexões feitas usando shared memory para um servidor local. O valor padrão é `MYSQL`. O nome da shared-memory diferencia maiúsculas de minúsculas.

  Esta opção aplica-se apenas se o servidor foi iniciado com a variável de sistema `shared_memory` ativada para suportar conexões de shared-memory.

* `--show-warnings`

  <table frame="box" rules="all" summary="Propriedades para binary-mode"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  Faz com que warnings sejam exibidos após cada statement, se houver. Esta opção se aplica ao modo interativo e batch.

* `--sigint-ignore`

  <table frame="box" rules="all" summary="Propriedades para binary-mode"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  Ignora sinais `SIGINT` (geralmente resultado de digitar **Control+C**).

  Sem esta opção, digitar **Control+C** interrompe o statement atual, se houver, ou cancela qualquer linha de entrada parcial, caso contrário.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para binary-mode"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  Modo silencioso. Produz menos saída. Esta opção pode ser fornecida múltiplas vezes para produzir cada vez menos saída.

  Esta opção resulta em formato de saída não tabular e escape de caracteres especiais. O escape pode ser desabilitado usando o modo raw; consulte a descrição para a opção `--raw`.

* `--skip-column-names`, `-N`

  <table frame="box" rules="all" summary="Propriedades para binary-mode"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  Não escreve nomes de colunas nos resultados. O uso desta opção faz com que a saída seja alinhada à direita, como mostrado aqui:

  ```sql
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

  <table frame="box" rules="all" summary="Propriedades para binary-mode"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  Não escreve números de linha para erros. Útil quando você deseja comparar arquivos de resultado que incluem mensagens de erro.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Propriedades para binary-mode"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  Para conexões a `localhost`, o arquivo socket Unix a ser usado ou, no Windows, o nome do named pipe a ser usado.

  No Windows, esta opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` ativada para suportar conexões de named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar chaves e certificados SSL. Consulte Opções de Comando para Conexões Criptografadas.

* `--syslog`, `-j`

  <table frame="box" rules="all" summary="Propriedades para binary-mode"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  Esta opção faz com que o **mysql** envie statements interativos para a facilidade de logging do sistema. No Unix, este é o `syslog`; no Windows, é o Log de Eventos do Windows. O destino onde as mensagens registradas aparecem depende do sistema. No Linux, o destino é frequentemente o arquivo `/var/log/messages`.

  Aqui está uma amostra da saída gerada no Linux usando `--syslog`. Esta saída é formatada para legibilidade; cada mensagem registrada na verdade ocupa uma única linha.

  ```sql
  Mar  7 12:39:25 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
  Mar  7 12:39:28 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
  ```

  Para mais informações, consulte Seção 4.5.1.3, “Logging do Cliente mysql”.

* `--table`, `-t`

  <table frame="box" rules="all" summary="Propriedades para binary-mode"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  Exibe a saída em formato de tabela. Este é o padrão para uso interativo, mas pode ser usado para produzir saída em tabela no modo batch.

* `--tee=file_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Anexa uma cópia da saída ao arquivo fornecido. Esta opção funciona apenas em modo interativo. A Seção 4.5.1.2, “Comandos do Cliente mysql”, discute arquivos tee em mais detalhes.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte Seção 6.3.2, “Protocolos e Ciphers TLS de Conexão Criptografada”.

  Esta opção foi adicionada no MySQL 5.7.10.

* `--unbuffered`, `-n`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Limpa o Buffer após cada Query.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  O nome de usuário da conta MySQL a ser usado para conectar ao servidor.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Modo verbose. Produz mais saída sobre o que o programa faz. Esta opção pode ser fornecida múltiplas vezes para produzir cada vez mais saída. (Por exemplo, `-v -v -v` produz formato de saída em tabela mesmo no modo batch.)

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.

* `--vertical`, `-E`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Imprime linhas de saída de Query verticalmente (uma linha por valor de coluna). Sem esta opção, você pode especificar a saída vertical para statements individuais, terminando-os com `\G`.

* `--wait`, `-w`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Se a conexão não puder ser estabelecida, espera e tenta novamente em vez de abortar.

* `--xml`, `-X`

  <table frame="box" rules="all" summary="Propriedades para bind-address"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Produz saída XML.

  ```sql
  <field name="column_name">NULL</field>
  ```

  A saída quando `--xml` é usado com **mysql** corresponde à do **mysqldump --xml**. Consulte Seção 4.5.4, “mysqldump — Um Programa de Backup de Database”, para detalhes.

  A saída XML também usa um namespace XML, como mostrado aqui:

  ```sql
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
