#### 4.5.1.1 Opções do cliente do MySQL

O **mysql** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql]` e `[client]` de um arquivo de opções. Para obter informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.13 Opções do cliente do MySQL**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para o cliente mysql."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> <th scope="col">Desatualizado</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_auto-rehash">--auto-rehash</a></th> <td>Ative a rehashing automático</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_auto-vertical-output">--auto-vertical-output</a></th> <td>Ative a exibição automática do conjunto de resultados vertical</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_batch">--batch</a></th> <td>Não use o arquivo de histórico</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_binary-as-hex">--binary-as-hex</a></th> <td>Exibir valores binários na notação hexadecimal</td> <td>5.7.19</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_binary-mode">--binary-mode</a></th> <td>Desative a tradução \r\n - para - \n e o tratamento de \0 como fim da consulta</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_bind-address">--bind-address</a></th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_character-sets-dir">--sets-de-caracteres-dir</a></th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_column-names">--colunas-nomes</a></th> <td>Escreva os nomes das colunas nos resultados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_column-type-info">--column-type-info</a></th> <td>Exibir metadados do conjunto de resultados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_commands">--commands</a></th> <td>Ativar ou desativar o processamento de comandos do cliente MySQL local</td> <td>5.7.44-ndb-7.6.35</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_comments">--comentários</a></th> <td>Se deve manter ou remover comentários em declarações enviadas ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_compress">--compress</a></th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_connect-expired-password">--connect-expired-password</a></th> <td>Indique ao servidor que o cliente pode lidar com o modo sandbox de senha expirada</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_connect-timeout">--connect-timeout</a></th> <td>Número de segundos antes do tempo limite de conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_database">--database</a></th> <td>O banco de dados a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_debug">--debug</a></th> <td>Escreva o log de depuração; é suportado apenas se o MySQL foi compilado com suporte de depuração</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_debug-check">--debug-check</a></th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_debug-info">--debug-info</a></th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_default-auth">--default-auth</a></th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_default-character-set">--default-character-set</a></th> <td>Especifique o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_defaults-extra-file">--defaults-extra-file</a></th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_defaults-file">--defaults-file</a></th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_defaults-group-suffix">--defaults-group-suffix</a></th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_delimiter">--delimiter</a></th> <td>Defina o delimitador de declaração</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_enable-cleartext-plugin">--enable-cleartext-plugin</a></th> <td>Habilitar o plugin de autenticação em texto claro</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_execute">--execute</a></th> <td>Execute a declaração e saia</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_force">--force</a></th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_get-server-public-key">--get-server-public-key</a></th> <td>Solicitar chave pública RSA do servidor</td> <td>5.7.23</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_help">--help</a></th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_histignore">--histignore</a></th> <td>Padrões que especificam quais declarações ignorar para o registro</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_host">--host</a></th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_html">--html</a></th> <td>Gerar saída HTML</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ignore-spaces">--ignore-spaces</a></th> <td>Ignorar espaços após os nomes das funções</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_init-command">--init-command</a></th> <td>Instrução SQL para executar após a conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_line-numbers">--número-de-linhas</a></th> <td>Escreva os números de linha para os erros</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_local-infile">--local-infile</a></th> <td>Ative ou desative a capacidade LOCAL para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_login-path">--login-path</a></th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_max-allowed-packet">--max-allowed-packet</a></th> <td>Comprimento máximo do pacote para enviar ou receber do servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_max-join-size">--max-join-size</a></th> <td>O limite automático para linhas em uma junção ao usar --safe-updates</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_named-commands">--comando-nomeado</a></th> <td>Ative comandos do MySQL com nomes</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_net-buffer-length">--net-buffer-length</a></th> <td>Tamanho do buffer para comunicação TCP/IP e socket</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_no-auto-rehash">--no-auto-rehash</a></th> <td>Desative a rehash automática</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_no-beep">--no-beep</a></th> <td>Não emita um sinal sonoro quando ocorrerem erros</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_no-defaults">--no-defaults</a></th> <td>Não ler arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_one-database">--one-database</a></th> <td>Ignore declarações, exceto as para o banco de dados padrão nomeado na linha de comando</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_pager">--pager</a></th> <td>Use o comando fornecido para a saída da consulta de paginação</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_password">--senha</a></th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_pipe">--pipe</a></th> <td>Conecte-se ao servidor usando o pipe nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_plugin-dir">--plugin-dir</a></th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_port">--port</a></th> <td>Número de porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_print-defaults">--print-defaults</a></th> <td>Opções padrão de impressão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_prompt">--prompt</a></th> <td>Defina o prompt no formato especificado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_protocol">--protocolo</a></th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_quick">--rápido</a></th> <td>Não cache cada resultado da consulta</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_raw">--raw</a></th> <td>Escreva os valores da coluna sem conversão de escape</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_reconnect">--reconnect</a></th> <td>Se a conexão com o servidor for perdida, tente reconectar automaticamente</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_safe-updates">--updates-seguras</a>,<a class="link" href="mysql-command-options.html#option_mysql_safe-updates">--i-am-a-dummy</a></th> <td>Permitir apenas instruções UPDATE e DELETE que especifiquem valores de chave</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_secure-auth">--secure-auth</a></th> <td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td> <td></td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_select-limit">--selecionar-limite</a></th> <td>O limite automático para as instruções SELECT ao usar --safe-updates</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_server-public-key-path">--server-public-key-path</a></th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_shared-memory-base-name">--shared-memory-base-name</a></th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_show-warnings">--show-warnings</a></th> <td>Mostre avisos após cada declaração, se houver alguma</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_sigint-ignore">--sigint-ignore</a></th> <td>Ignorar sinais SIGINT (geralmente o resultado de digitar Control+C)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_silent">--silencioso</a></th> <td>Modo silencioso</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_auto-rehash">--skip-auto-rehash</a></th> <td>Desative a rehash automática</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_skip-column-names">--skip-column-names</a></th> <td>Não escreva nomes de colunas nos resultados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_skip-line-numbers">--skip-line-numbers</a></th> <td>Saltar números de linha para erros</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_named-commands">--skip-named-commands</a></th> <td>Desativar comandos nomeados do MySQL</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_pager">--skip-pager</a></th> <td>Desativar a navegação por páginas</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_reconnect">--skip-reconnect</a></th> <td>Desativar a reconexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_socket">--socket</a></th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl</a></th> <td>Ative a criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-ca</a></th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-capath</a></th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-cert</a></th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-cipher</a></th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-crl</a></th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-crlpath</a></th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-chave</a></th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-mode</a></th> <td>Estado de segurança desejado da conexão com o servidor</td> <td>5.7.11</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-verify-server-cert</a></th> <td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_syslog">--syslog</a></th> <td>Registre declarações interativas no syslog</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_table">--tabela</a></th> <td>Exibir a saída em formato tabular</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_tee">--tee</a></th> <td>Adicione uma cópia do resultado a um arquivo nomeado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_tls-version">--tls-version</a></th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_unbuffered">--unbuffered</a></th> <td>Esvazie o buffer após cada consulta</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_user">--user</a></th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_verbose">--verbose</a></th> <td>Modo verbosos</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_version">--version</a></th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_vertical">--vertical</a></th> <td>Imprimir linhas de saída de consulta verticalmente (uma linha por valor da coluna)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_wait">--wait</a></th> <td>Se a conexão não puder ser estabelecida, aguarde e tente novamente, em vez de abortar</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_xml">--xml</a></th> <td>Produzir saída XML</td> <td></td> <td></td> </tr></tbody></table>

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--auto-rehash`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-rehash</code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code>skip-auto-rehash</code>]]</td> </tr></tbody></table>

  Ative a rehash automática. Esta opção está ativada por padrão, o que permite a conclusão de nomes de banco de dados, tabelas e colunas. Use `--disable-auto-rehash` para desativar a rehash. Isso faz com que o **mysql** comece mais rápido, mas você deve emitir o comando `rehash` ou seu atalho `\#` se quiser usar a conclusão de nomes.

  Para completar um nome, insira a primeira parte e pressione Tab. Se o nome for inequívoco, o **mysql** o completa. Caso contrário, você pode pressionar Tab novamente para ver os nomes possíveis que começam com o que você digitou até agora. A conclusão não ocorre se não houver um banco de dados padrão.

  Nota

  Esse recurso requer um cliente MySQL compilado com a biblioteca **readline**. Normalmente, a biblioteca **readline** não está disponível no Windows.

- `--auto-vertical-output`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-vertical-output</code>]]</td> </tr></tbody></table>

  Faça com que os conjuntos de resultados sejam exibidos verticalmente se forem muito largos para a janela atual, e use o formato tabular normal caso contrário. (Isso se aplica a declarações terminadas por `;` ou `\G`.)

- `--batch`, `-B`

  <table frame="box" rules="all" summary="Propriedades para lote"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--batch</code>]]</td> </tr></tbody></table>

  Imprima os resultados usando a tecla Tab como separador de colunas, com cada linha em uma nova linha. Com esta opção, o **mysql** não usa o arquivo de histórico.

  O modo lote resulta em um formato de saída não tabular e na fuga de caracteres especiais. A fuga pode ser desativada usando o modo bruto; consulte a descrição da opção `--raw`.

- `--binary-as-hex`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-as-hex</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Quando essa opção é ativada, o **mysql** exibe dados binários usando a notação hexadecimal (`0xvalue`). Isso ocorre independentemente do formato de exibição de saída geral ser tabular, vertical, HTML ou XML.

  `--binary-as-hex`, quando ativado, afeta a exibição de todas as strings binárias, incluindo aquelas retornadas por funções como `CHAR()` e `UNHEX()`. O exemplo a seguir demonstra isso usando o código ASCII para `A` (65 decimal, 41 hexadecimal):

  - `--binary-as-hex` desativado:

    ```sql
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------+-------------+
    | CHAR(0x41) | UNHEX('41') |
    +------------+-------------+
    | A          | A           |
    +------------+-------------+
    ```

  - `--binary-as-hex` ativado:

    ```sql
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------------------+--------------------------+
    | CHAR(0x41)             | UNHEX('41')              |
    +------------------------+--------------------------+
    | 0x41                   | 0x41                     |
    +------------------------+--------------------------+
    ```

  Para escrever uma expressão de string binária de forma que ela seja exibida como uma string de caracteres, independentemente de `--binary-as-hex` estar habilitado, use essas técnicas:

  - A função `CHAR()` tem uma cláusula `USING charset`:

    ```sql
    mysql> SELECT CHAR(0x41 USING utf8mb4);
    +--------------------------+
    | CHAR(0x41 USING utf8mb4) |
    +--------------------------+
    | A                        |
    +--------------------------+
    ```

  - De forma mais geral, use `CONVERT()` para converter uma expressão para um conjunto de caracteres específico:

    ```sql
    mysql> SELECT CONVERT(UNHEX('41') USING utf8mb4);
    +------------------------------------+
    | CONVERT(UNHEX('41') USING utf8mb4) |
    +------------------------------------+
    | A                                  |
    +------------------------------------+
    ```

  Essa opção foi adicionada no MySQL 5.7.19.

- `--binary-mode`

  <table frame="box" rules="all" summary="Propriedades para modo binário"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-mode</code>]]</td> </tr></tbody></table>

  Esta opção ajuda no processamento de saída do **mysqlbinlog** que pode conter valores `BLOB`. Por padrão, o **mysql** traduz `\r\n` em strings de instruções para `\n` e interpreta `\0` como o final da instrução. A opção `--binary-mode` desativa ambos os recursos. Também desativa todos os comandos do **mysql**, exceto `charset` e `delimiter` no modo não interativo (para entrada canalizada para o **mysql** ou carregada usando o comando `source`).

  (*NBD Cluster 7.6.35 e versões posteriores:*) `--binary-mode`, quando ativado, faz com que o servidor ignore qualquer configuração para `--commands`.

- `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>

  Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 10.15, “Configuração de Conjunto de Caracteres”.

- `--column-names`

  <table frame="box" rules="all" summary="Propriedades para nomes de colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--column-names</code>]]</td> </tr></tbody></table>

  Escreva os nomes das colunas nos resultados.

- `--column-type-info`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>0

  Exibir metadados do conjunto de resultados. Essas informações correspondem ao conteúdo das estruturas de dados C API `MYSQL_FIELD`. Veja Estruturas de Dados Básicas da API C.

- `--commands`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>1

  Se deve habilitar ou desabilitar o processamento de comandos do cliente **mysql** local. Definir essa opção como `FALSE` desabilita esse processamento e tem os efeitos listados aqui:

  - Os seguintes comandos do cliente **mysql** estão desativados:

    - `charset` (`/C` permanece ativado)

    - `limpar`

    - `conectar`

    - `editar`

    - "ego"

    - `sair`

    - `ir`

    - `ajuda`

    - `nopager`

    - `notee`

    - `nowarning`

    - `paginador`

    - `imprimir`

    - `prompt`

    - `query_attributes`

    - `sair`

    - `rehash`

    - `resetconnection`

    - `ssl_session_data_print`

    - `fonte`

    - `status`

    - `sistema`

    - `tee`

    - `\u` (`use` é passado para o servidor)

    - `avaliações de risco`

  - Os comandos `\C` e `delimiter` permanecem ativados.

  - A opção `--system-command` é ignorada e não tem efeito.

  Esta opção não tem efeito quando o modo binário é ativado.

  Quando a opção `--commands` está habilitada, é possível desabilitar (apenas) o comando do sistema usando a opção `--system-command`.

  Essa opção foi adicionada no NDB Cluster 7.6.35.

- `--comments`, `-c`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>2

  Se os comentários devem ser removidos ou preservados nas declarações enviadas ao servidor. O padrão é `--skip-comments` (remover comentários), habilite com `--comments` (preservar comentários).

  Nota

  No MySQL 5.7, o cliente **mysql** sempre envia dicas de otimização para o servidor, independentemente de essa opção ser fornecida. Para garantir que as dicas de otimização não sejam removidas se você estiver usando uma versão mais antiga do cliente **mysql** com uma versão do servidor que entende dicas de otimização, inicie o **mysql** com a opção `--comments`.

  O comentário de remoção é desaconselhável a partir do MySQL 5.7.20. Você deve esperar que esse recurso e as opções para controlá-lo sejam removidos em uma futura versão do MySQL.

- `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>3

  Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 4.2.6, “Controle de Compressão de Conexão”.

- `--connect-expired-password`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>4

  Indique ao servidor que o cliente pode lidar com o modo sandbox se a conta usada para a conexão tiver uma senha expirada. Isso pode ser útil para chamadas não interativas do **mysql**, pois, normalmente, o servidor desconecta clientes não interativos que tentam se conectar usando uma conta com senha expirada. (Veja a Seção 6.2.12, “Tratamento do Servidor de Senhas Expirantes”).

- `--connect-timeout=valor`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>5

  O número de segundos antes do tempo limite de conexão. (O valor padrão é `0`.

- `--database=db_name`, `-D db_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>6

  O banco de dados a ser usado. Isso é útil principalmente em um arquivo de opção.

- `--debug[=opções_de_depuração]`, `-# [opções_de_depuração]`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>7

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o,/tmp/mysql.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>8

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>9

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-rehash</code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code>skip-auto-rehash</code>]]</td> </tr></tbody></table>0

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-rehash</code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code>skip-auto-rehash</code>]]</td> </tr></tbody></table>1

  Use *`charset_name`* como o conjunto de caracteres padrão para o cliente e a conexão.

  Esta opção pode ser útil se o sistema operacional usar um conjunto de caracteres e o cliente **mysql** usar outro por padrão. Nesse caso, a saída pode ser formatada incorretamente. Geralmente, você pode corrigir esses problemas usando essa opção para forçar o cliente a usar o conjunto de caracteres do sistema.

  Para obter mais informações, consulte a Seção 10.4, “Conjunto de caracteres de conexão e codificações”, e a Seção 10.15, “Configuração do conjunto de caracteres”.

- `--defaults-extra-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-rehash</code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code>skip-auto-rehash</code>]]</td> </tr></tbody></table>2

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-rehash</code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code>skip-auto-rehash</code>]]</td> </tr></tbody></table>3

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-rehash</code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code>skip-auto-rehash</code>]]</td> </tr></tbody></table>4

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysql** normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysql** também lê os grupos `[client_other]` e `[mysql_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--delimiter=str`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-rehash</code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code>skip-auto-rehash</code>]]</td> </tr></tbody></table>5

  Defina o delimitador de declaração. O padrão é o caractere ponto e vírgula (`;`).

- `--disable-named-commands`

  Desative os comandos nomeados. Use apenas o formato `\*`, ou use apenas comandos nomeados no início de uma linha que termine com um ponto e vírgula (`;`). **mysql** começa com esta opção *ativada* por padrão. No entanto, mesmo com esta opção, os comandos de formato longo ainda funcionam a partir da primeira linha. Veja a Seção 4.5.1.2, “Comandos do Cliente MySQL”.

- `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-rehash</code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code>skip-auto-rehash</code>]]</td> </tr></tbody></table>6

  Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Consulte a Seção 6.4.1.6, “Autenticação Pluggable de Texto Claro no Cliente”.)

- `--execute=statement`, `-e statement`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-rehash</code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code>skip-auto-rehash</code>]]</td> </tr></tbody></table>7

  Execute a declaração e saia. O formato de saída padrão é semelhante ao produzido com `--batch`. Veja a Seção 4.2.2.1, “Usando Opções na Linha de Comando”, para alguns exemplos. Com esta opção, o **mysql** não usa o arquivo de histórico.

- `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-rehash</code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code>skip-auto-rehash</code>]]</td> </tr></tbody></table>8

  Continue mesmo que ocorra um erro SQL.

- `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para rehash automático"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-rehash</code>]]</td> </tr><tr><th>Incapaz de</th> <td>[[<code>skip-auto-rehash</code>]]</td> </tr></tbody></table>9

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Conectada SHA-2”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

- `--histignore`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-vertical-output</code>]]</td> </tr></tbody></table>0

  Uma lista de um ou mais padrões separados por vírgula, especificando as declarações a serem ignoradas para fins de registro. Esses padrões são adicionados à lista de padrões padrão (`"*IDENTIFIED*:*PASSWORD*"`). O valor especificado para essa opção afeta o registro de declarações escritas no arquivo de histórico e no `syslog` se a opção `--syslog` for fornecida. Para mais informações, consulte a Seção 4.5.1.3, “Registro do Cliente do MySQL”.

- `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-vertical-output</code>]]</td> </tr></tbody></table>1

  Conecte-se ao servidor MySQL no host fornecido.

- `--html`, `-H`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-vertical-output</code>]]</td> </tr></tbody></table>2

  Produza a saída HTML.

- `--ignore-spaces`, `-i`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-vertical-output</code>]]</td> </tr></tbody></table>3

  Ignore espaços após os nomes das funções. O efeito disso é descrito na discussão sobre o modo SQL `IGNORE_SPACE` (veja a Seção 5.1.10, “Modos SQL do servidor”).

- `--init-command=str`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-vertical-output</code>]]</td> </tr></tbody></table>4

  Instrução SQL para executar após a conexão com o servidor. Se o recurso de reconexão automática estiver habilitado, a instrução será executada novamente após a reconexão.

- `--line-numbers`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-vertical-output</code>]]</td> </tr></tbody></table>5

  Escreva os números de linha para os erros. Desative isso com `--skip-line-numbers`.

- `--local-infile[={0|1}]`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-vertical-output</code>]]</td> </tr></tbody></table>6

  Por padrão, a capacidade `LOCAL` para `LOAD DATA` é determinada pelo padrão compilado na biblioteca do cliente MySQL. Para habilitar ou desabilitar explicitamente o carregamento de dados `LOCAL`, use a opção `--local-infile`. Quando não é fornecido valor, a opção habilita o carregamento de dados `LOCAL`. Quando fornecida como `--local-infile=0` ou `--local-infile=1`, a opção desabilita ou habilita o carregamento de dados `LOCAL`.

  O uso bem-sucedido de operações de carregamento `LOCAL` dentro do **mysql** também exige que o servidor permita o carregamento local; consulte a Seção 6.1.6, “Considerações de segurança para LOAD DATA LOCAL”

- `--login-path=nome`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-vertical-output</code>]]</td> </tr></tbody></table>7

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--max-allowed-packet=valor`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-vertical-output</code>]]</td> </tr></tbody></table>8

  O tamanho máximo do buffer para a comunicação cliente/servidor. O padrão é de 16 MB, e o máximo é de 1 GB.

- `--max-join-size=valor`

  <table frame="box" rules="all" summary="Propriedades para saída vertical automática"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--auto-vertical-output</code>]]</td> </tr></tbody></table>9

  O limite automático para linhas em uma junção ao usar `--safe-updates`. (O valor padrão é 1.000.000.)

- `--named-commands`, `-G`

  <table frame="box" rules="all" summary="Propriedades para lote"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--batch</code>]]</td> </tr></tbody></table>0

  Ative os comandos **mysql** nomeados. Os comandos de formato longo são permitidos, não apenas comandos de formato curto. Por exemplo, `quit` e `\q` são ambos reconhecidos. Use `--skip-named-commands` para desabilitar os comandos nomeados. Consulte a Seção 4.5.1.2, “Comandos do Cliente MySQL”.

- `--net-buffer-length=valor`

  <table frame="box" rules="all" summary="Propriedades para lote"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--batch</code>]]</td> </tr></tbody></table>1

  O tamanho do buffer para a comunicação TCP/IP e socket. (O valor padrão é 16 KB.)

- `--no-auto-rehash`, `-A`

  <table frame="box" rules="all" summary="Propriedades para lote"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--batch</code>]]</td> </tr></tbody></table>2

  Isso tem o mesmo efeito que `--skip-auto-rehash`. Veja a descrição de `--auto-rehash`.

- `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Propriedades para lote"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--batch</code>]]</td> </tr></tbody></table>3

  Não emita um sinal sonoro quando ocorrerem erros.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para lote"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--batch</code>]]</td> </tr></tbody></table>4

  Não leia nenhum arquivo de opções. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se ele existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--one-database`, `-o`

  <table frame="box" rules="all" summary="Propriedades para lote"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--batch</code>]]</td> </tr></tbody></table>5

  Ignore declarações, exceto aquelas que ocorrem enquanto o banco de dados padrão é o nomeado na linha de comando. Esta opção é rudimentar e deve ser usada com cuidado. O filtro de declarações é baseado apenas em declarações `USE`.

  Inicialmente, o **mysql** executa as instruções na entrada porque especificar um banco de dados *`db_name`* na linha de comando é equivalente a inserir `USE db_name` no início da entrada. Em seguida, para cada instrução `USE` encontrada, o **mysql** aceita ou rejeita as instruções seguintes, dependendo se o nome do banco de dados especificado é o mesmo da linha de comando. O conteúdo das instruções é irrelevante.

  Suponha que **mysql** seja invocado para processar este conjunto de instruções:

  ```sql
  DELETE FROM db2.t2;
  USE db2;
  DROP TABLE db1.t1;
  CREATE TABLE db1.t1 (i INT);
  USE db1;
  INSERT INTO t1 (i) VALUES(1);
  CREATE TABLE db2.t1 (j INT);
  ```

  Se a linha de comando for **mysql --force --one-database db1**, o **mysql** processa a entrada da seguinte forma:

  - A instrução `DELETE` é executada porque o banco de dados padrão é `db1`, mesmo que a instrução nomeie uma tabela em um banco de dados diferente.

  - As instruções `DROP TABLE` e `CREATE TABLE` não são executadas porque o banco de dados padrão não é `db1`, mesmo que as instruções nomeiem uma tabela em `db1`.

  - As instruções `INSERT` e `CREATE TABLE` são executadas porque o banco de dados padrão é `db1`, mesmo que a instrução `CREATE TABLE` nomeie uma tabela em um banco de dados diferente.

- `--pager[=comando]`

  <table frame="box" rules="all" summary="Propriedades para lote"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--batch</code>]]</td> </tr></tbody></table>6

  Use o comando fornecido para a saída da consulta de paginação. Se o comando for omitido, o gerenciador padrão é o valor da variável de ambiente `PAGER`. Os gerenciadores válidos são **less**, **more**, **cat \[> nome\_do\_arquivo]** e assim por diante. Esta opção funciona apenas no Unix e apenas no modo interativo. Para desabilitar a paginação, use `--skip-pager`. A seção 4.5.1.2, “Comandos do cliente do MySQL”, discute a paginação de saída mais detalhadamente.

- `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para lote"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--batch</code>]]</td> </tr></tbody></table>7

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysql** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysql** não deve solicitar uma senha, use a opção `--skip-password`.

- `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para lote"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--batch</code>]]</td> </tr></tbody></table>8

  No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para lote"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--batch</code>]]</td> </tr></tbody></table>9

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysql** não encontrá-lo. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-as-hex</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>0

  Para conexões TCP/IP, o número de porta a ser usado.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-as-hex</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>1

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--prompt=format_str`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-as-hex</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>2

  Defina o prompt no formato especificado. O padrão é `mysql>`. As sequências especiais que o prompt pode conter estão descritas na Seção 4.5.1.2, “Comandos do Cliente MySQL”.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-as-hex</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>3

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

- `--quick`, `-q`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-as-hex</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>4

  Não cache cada resultado da consulta, imprima cada linha conforme ela é recebida. Isso pode desacelerar o servidor se a saída for suspensa. Com esta opção, o **mysql** não usa o arquivo de histórico.

  Por padrão, o **mysql** recupera todas as linhas de resultado antes de produzir qualquer saída; ao armazená-las, ele calcula um comprimento máximo de coluna em execução a partir do valor real de cada coluna em sucessão. Ao imprimir a saída, ele usa esse máximo para formatá-la. Quando a opção `--quick` é especificada, o **mysql** não tem as linhas para as quais calcular o comprimento antes de começar, e, portanto, usa o comprimento máximo. No exemplo a seguir, a tabela `t1` tem uma única coluna do tipo `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e contendo 4 linhas. A saída padrão tem 9 caracteres de largura; essa largura é igual ao número máximo de caracteres em qualquer um dos valores das colunas nas linhas retornadas (5), mais 2 caracteres cada para os espaços usados como preenchimento e os caracteres `|` usados como delimitadores de coluna). A saída ao usar a opção `--quick` tem 25 caracteres de largura; isso é igual ao número de caracteres necessários para representar `-9223372036854775808`, que é o valor mais longo possível que pode ser armazenado em uma coluna `BIGINT` (assinada), ou 19 caracteres, mais os 4 caracteres usados para preenchimento e delimitadores de coluna. A diferença pode ser vista aqui:

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

- `--raw`, `-r`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-as-hex</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>5

  Para saída tabular, o "alinhamento" das colunas permite que um valor de uma coluna seja distinguido de outro. Para saída não tabular (como a produzida em modo batch ou quando a opção `--batch` ou `--silent` é fornecida), caracteres especiais são escapados na saída para que possam ser identificados facilmente. Novo linha, tabulação, `NUL` e barra invertida são escritos como `\n`, `\t`, `\0` e `\\`. A opção `--raw` desabilita essa escavação de caracteres.

  O exemplo a seguir demonstra a saída tabular versus não tabular e o uso do modo bruto para desabilitar a escavação:

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

- `--reconnect`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-as-hex</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>6

  Se a conexão com o servidor for perdida, tente reconectar automaticamente. Uma única tentativa de reconexão é feita toda vez que a conexão for perdida. Para suprimir o comportamento de reconexão, use `--skip-reconnect`.

- `--safe-updates`, `--i-am-a-dummy`, `-U`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-as-hex</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>7

  Se essa opção estiver habilitada, as instruções `UPDATE` e `DELETE` que não utilizam uma chave na cláusula `WHERE` ou na cláusula `LIMIT` produzem um erro. Além disso, restrições são aplicadas às instruções `SELECT` que produzem (ou são estimadas para produzir) conjuntos de resultados muito grandes. Se você configurou essa opção em um arquivo de opções, pode usar `--skip-safe-updates` na linha de comando para sobrescrevê-la. Para obter mais informações sobre essa opção, consulte "Usando o modo Safe-Updates (--safe-updates)").

- `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-as-hex</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>8

  Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

  A partir do MySQL 5.7.5, essa opção é desaconselhada; espere-se que ela seja removida em uma futura versão do MySQL. Ela está sempre habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

  Nota

  Senhas que usam o método de hashing pré-4.1 são menos seguras do que senhas que usam o método de hashing de senha nativo e devem ser evitadas. Senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

- `--select-limit=valor`

  <table frame="box" rules="all" summary="Propriedades para binário como hexadecimal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-as-hex</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>9

  O limite automático para as instruções `SELECT` ao usar `--safe-updates`. (O valor padrão é 1.000.)

- `--server-public-key-path=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para modo binário"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-mode</code>]]</td> </tr></tbody></table>0

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, essa opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os módulos `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação com Pluggable SHA-256” e a Seção 6.4.1.4, “Cache de Autenticação com Pluggable SHA-2”.

- `--shared-memory-base-name=nome`

  <table frame="box" rules="all" summary="Propriedades para modo binário"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-mode</code>]]</td> </tr></tbody></table>1

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada com um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é case-sensitive.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--show-warnings`

  <table frame="box" rules="all" summary="Propriedades para modo binário"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-mode</code>]]</td> </tr></tbody></table>2

  Se houver alguma advertência, ela será exibida após cada declaração. Esta opção se aplica ao modo interativo e ao modo lote.

- `--sigint-ignore`

  <table frame="box" rules="all" summary="Propriedades para modo binário"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-mode</code>]]</td> </tr></tbody></table>3

  Ignore os sinais `SIGINT` (geralmente o resultado de digitar **Control+C**).

  Sem essa opção, pressionar **Control+C** interrompe a declaração atual, se houver uma, ou cancela qualquer linha de entrada parcial, caso contrário.

- `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para modo binário"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-mode</code>]]</td> </tr></tbody></table>4

  Modo silencioso. Produza menos saída. Esta opção pode ser dada várias vezes para produzir cada vez menos saída.

  Essa opção resulta em um formato de saída não tabular e na escavação de caracteres especiais. A escavação pode ser desativada usando o modo bruto; consulte a descrição da opção `--raw`.

- `--skip-column-names`, `-N`

  <table frame="box" rules="all" summary="Propriedades para modo binário"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-mode</code>]]</td> </tr></tbody></table>5

  Não escreva os nomes das colunas nos resultados. O uso desta opção faz com que a saída seja alinhada à direita, como mostrado aqui:

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

- `--skip-line-numbers`, `-L`

  <table frame="box" rules="all" summary="Propriedades para modo binário"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-mode</code>]]</td> </tr></tbody></table>6

  Não escreva números de linha para erros. Útil quando você deseja comparar arquivos de resultado que incluem mensagens de erro.

- `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para modo binário"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-mode</code>]]</td> </tr></tbody></table>7

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--syslog`, `-j`

  <table frame="box" rules="all" summary="Propriedades para modo binário"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-mode</code>]]</td> </tr></tbody></table>8

  Essa opção faz com que o **mysql** envie declarações interativas para a ferramenta de registro do sistema. No Unix, isso é o `syslog`; no Windows, é o Registro de Eventos do Windows. O destino onde as mensagens registradas aparecem depende do sistema. No Linux, o destino é frequentemente o arquivo `/var/log/messages`.

  Aqui está uma amostra de saída gerada no Linux usando `--syslog`. Essa saída é formatada para melhor legibilidade; cada mensagem registrada na verdade ocupa uma única linha.

  ```sql
  Mar  7 12:39:25 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
  Mar  7 12:39:28 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
  ```

  Para obter mais informações, consulte a Seção 4.5.1.3, “Registro do cliente do MySQL”.

- `--table`, `-t`

  <table frame="box" rules="all" summary="Propriedades para modo binário"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--binary-mode</code>]]</td> </tr></tbody></table>9

  Exiba a saída em formato de tabela. Isso é o padrão para uso interativo, mas pode ser usado para produzir a saída em tabela em modo de lote.

- `--tee=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>0

  Adicione uma cópia do resultado ao arquivo fornecido. Esta opção só funciona no modo interativo. A seção 4.5.1.2, “Comandos do cliente do MySQL”, discute mais sobre os arquivos tee.

- `--tls-version=lista_protocolos`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>1

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 6.3.2, “Protocolos e cifra TLS de conexão criptografada”.

  Essa opção foi adicionada no MySQL 5.7.10.

- `--unbuffered`, `-n`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>2

  Esvazie o buffer após cada consulta.

- `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>3

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>4

  Modo verbose. Produza mais informações sobre o que o programa faz. Esta opção pode ser dada várias vezes para produzir mais e mais informações. (Por exemplo, `-v -v -v` produz o formato de saída da tabela mesmo no modo em lote.)

- `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>5

  Exibir informações da versão e sair.

- `--vertical`, `-E`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>6

  Imprima as linhas de saída da consulta verticalmente (uma linha por valor da coluna). Sem essa opção, você pode especificar a saída vertical para declarações individuais terminando-as com `\G`.

- `--wait`, `-w`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>7

  Se a conexão não puder ser estabelecida, aguarde e tente novamente, em vez de abortar.

- `--xml`, `-X`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>8

  Produza a saída XML.

  ```sql
  <field name="column_name">NULL</field>
  ```

  A saída quando o comando `--xml` é usado com o **mysql** corresponde à do **mysqldump** `--xml`. Consulte a Seção 4.5.4, “mysqldump — Um programa de backup de banco de dados”, para obter detalhes.

  A saída XML também utiliza um espaço de nome XML, conforme mostrado aqui:

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
