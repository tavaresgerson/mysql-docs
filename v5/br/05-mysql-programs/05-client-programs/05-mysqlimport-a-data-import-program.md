### 4.5.5 mysqlimport — Um programa de importação de dados

O cliente **mysqlimport** fornece uma interface de linha de comando para a instrução SQL `LOAD DATA`. A maioria das opções do **mysqlimport** corresponde diretamente a cláusulas da sintaxe `LOAD DATA`. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

Invoque **mysqlimport** da seguinte forma:

```sql
mysqlimport [options] db_name textfile1 [textfile2 ...]
```

Para cada arquivo de texto nomeado na linha de comando, o **mysqlimport** remove qualquer extensão do nome do arquivo e usa o resultado para determinar o nome da tabela na qual os conteúdos do arquivo serão importados. Por exemplo, arquivos com os nomes `paciente.txt`, `paciente.text` e `paciente` seriam todos importados em uma tabela chamada `paciente`.

O **mysqlimport** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqlimport]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.17 Opções de mysqlimport**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysqlimport."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> <th scope="col">Desatualizado</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_bind-address">--bind-address</a></th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_character-sets-dir">--sets-de-caracteres-dir</a></th> <td>Diretório onde os conjuntos de caracteres podem ser encontrados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_columns">--colunas</a></th> <td>Esta opção aceita uma lista de nomes de colunas separados por vírgula como seu valor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_compress">--compress</a></th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_debug">--debug</a></th> <td>Escreva o log de depuração</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_debug-check">--debug-check</a></th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_debug-info">--debug-info</a></th> <td>Imprimir informações de depuração, memória e estatísticas da CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_default-auth">--default-auth</a></th> <td>Plugin de autenticação a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_default-character-set">--default-character-set</a></th> <td>Especifique o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_defaults-extra-file">--defaults-extra-file</a></th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_defaults-file">--defaults-file</a></th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_defaults-group-suffix">--defaults-group-suffix</a></th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_delete">--delete</a></th> <td>Esvazie a tabela antes de importar o arquivo de texto</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_enable-cleartext-plugin">--enable-cleartext-plugin</a></th> <td>Habilitar o plugin de autenticação em texto claro</td> <td>5.7.10</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_fields">--campos-cercados-por</a></th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_fields">--campos-escavados-por</a></th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_fields">--campos opcionalmente delimitados por</a></th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_fields">--campos-terminados-por</a></th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_force">--force</a></th> <td>Continue mesmo que ocorra um erro SQL</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_get-server-public-key">--get-server-public-key</a></th> <td>Solicitar chave pública RSA do servidor</td> <td>5.7.23</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_help">--help</a></th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_host">--host</a></th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_ignore">--ignore</a></th> <td>Veja a descrição da opção --replace</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_ignore-lines">--ignore-lines</a></th> <td>Ignore as primeiras N linhas do arquivo de dados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_lines-terminated-by">--lines-terminated-by</a></th> <td>Esta opção tem o mesmo significado que a cláusula correspondente para LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_local">--local</a></th> <td>Ler arquivos de entrada localmente a partir do host do cliente</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_lock-tables">--lock-tables</a></th> <td>Bloquear todas as tabelas para escrita antes de processar quaisquer arquivos de texto</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_login-path">--login-path</a></th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_low-priority">--baixa prioridade</a></th> <td>Use LOW_PRIORITY ao carregar a tabela</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_no-defaults">--no-defaults</a></th> <td>Não ler arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_password">--senha</a></th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_pipe">--pipe</a></th> <td>Conecte-se ao servidor usando o pipe nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_plugin-dir">--plugin-dir</a></th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_port">--port</a></th> <td>Número de porta TCP/IP para a conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_print-defaults">--print-defaults</a></th> <td>Opções padrão de impressão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_protocol">--protocolo</a></th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_replace">--replace</a></th> <td>As opções --replace e --ignore controlam o tratamento das linhas de entrada que duplicam linhas existentes com valores de chave únicos.</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_secure-auth">--secure-auth</a></th> <td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td> <td></td> <td>Sim</td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_server-public-key-path">--server-public-key-path</a></th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td>5.7.23</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_shared-memory-base-name">--shared-memory-base-name</a></th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_silent">--silencioso</a></th> <td>Produza a saída apenas quando ocorrerem erros</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_socket">--socket</a></th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_ssl">--ssl</a></th> <td>Ative a criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_ssl">--ssl-ca</a></th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_ssl">--ssl-capath</a></th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_ssl">--ssl-cert</a></th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_ssl">--ssl-cipher</a></th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_ssl">--ssl-crl</a></th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_ssl">--ssl-crlpath</a></th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_ssl">--ssl-chave</a></th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_ssl">--ssl-mode</a></th> <td>Estado de segurança desejado da conexão com o servidor</td> <td>5.7.11</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_ssl">--ssl-verify-server-cert</a></th> <td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_tls-version">--tls-version</a></th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_use-threads">--use-threads</a></th> <td>Número de threads para carregamento paralelo de arquivos</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_user">--user</a></th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_verbose">--verbose</a></th> <td>Modo verbosos</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlimport.html#option_mysqlimport_version">--version</a></th> <td>Exibir informações da versão e sair</td> <td></td> <td></td> </tr></tbody></table>

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>

  Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

- `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 10.15, “Configuração de Conjunto de Caracteres”.

- `--columns=column_list`, `-c column_list`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>

  Esta opção aceita uma lista de nomes de colunas separados por vírgula como seu valor. A ordem dos nomes de colunas indica como corresponder as colunas do arquivo de dados às colunas da tabela.

- `--compress`, `-C`

  <table frame="box" rules="all" summary="Propriedades para comprimir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 4.2.6, “Controle de Compressão de Conexão”.

- `--debug[=opções_de_depuração]`, `-# [opções_de_depuração]`

  <table frame="box" rules="all" summary="Propriedades para depuração"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug[=debug_option<code>d:t:o</code></code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>d:t:o</code>]]</td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--debug-check`

  <table frame="box" rules="all" summary="Propriedades para verificação de depuração"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug-check</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--debug-info`

  <table frame="box" rules="all" summary="Propriedades para debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug-info</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Imprima informações de depuração, estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Propriedades para conjunto de caracteres padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-character-set=charset_name</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 10.15, “Configuração do Conjunto de Caracteres”.

- `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>0

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--defaults-extra-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>1

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>2

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>3

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlimport** normalmente lê os grupos `[client]` e `[mysqlimport]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysqlimport** também lê os grupos `[client_other]` e `[mysqlimport_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--delete`, `-D`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>4

  Esvazie a tabela antes de importar o arquivo de texto.

- `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>5

  Ative o plugin de autenticação de texto claro `mysql_clear_password`. (Consulte a Seção 6.4.1.6, “Autenticação Pluggable de Texto Claro no Cliente”.)

  Essa opção foi adicionada no MySQL 5.7.10.

- `--campos-terminados-por=...`, `--campos-envolvidos-por=...`, `--campos-opcionalmente-envolvidos-por=...`, `--campos-e-escapedos-por=...`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>6

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>7

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>8

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>9

  Essas opções têm o mesmo significado das cláusulas correspondentes para `LOAD DATA`. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

- `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>0

  Ignore os erros. Por exemplo, se uma tabela para um arquivo de texto não existir, continue processando os arquivos restantes. Sem `--force`, o **mysqlimport** sai se uma tabela não existir.

- `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>1

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Conectada SHA-2”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

- `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>2

  Importe os dados para o servidor MySQL no host fornecido. O host padrão é `localhost`.

- `--ignore`, `-i`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>3

  Veja a descrição da opção `--replace`.

- `--ignore-lines=N`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>4

  Ignore as primeiras *`N`* linhas do arquivo de dados.

- `--lines-terminated-by=...`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>5

  Esta opção tem o mesmo significado da cláusula correspondente para `LOAD DATA`. Por exemplo, para importar arquivos do Windows que têm linhas terminadas por pares de retorno de carro/pula de linha, use `--lines-terminated-by="\r\n"`. (Você pode precisar duplicar as barras invertidas, dependendo das convenções de escape do seu interpretador de comandos.) Veja a Seção 13.2.6, “Instrução LOAD DATA”.

- `--local`, `-L`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>6

  Por padrão, os arquivos são lidos pelo servidor no host do servidor. Com esta opção, o **mysqlimport** lê os arquivos de entrada localmente no host do cliente.

  O uso bem-sucedido de operações de carregamento `LOCAL` dentro do **mysqlimport** também exige que o servidor permita o carregamento local; consulte a Seção 6.1.6, “Considerações de segurança para LOAD DATA LOCAL”

- `--lock-tables`, `-l`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>7

  Bloquear *todas* as tabelas para escrita antes de processar quaisquer arquivos de texto. Isso garante que todas as tabelas estejam sincronizadas no servidor.

- `--login-path=nome`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>8

  Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam qual servidor MySQL conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Utilitário de Configuração MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--low-priority`

  <table frame="box" rules="all" summary="Propriedades para endereço de ligação"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--bind-address=ip_address</code>]]</td> </tr></tbody></table>9

  Use `LOW_PRIORITY` ao carregar a tabela. Isso afeta apenas os motores de armazenamento que usam apenas bloqueio de nível de tabela (como `MyISAM`, `MEMORY` e `MERGE`).

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>0

  Não leia nenhum arquivo de opções. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se ele existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>1

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysqlimport** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o **mysqlimport** não deve solicitar uma senha, use a opção `--skip-password`.

- `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>2

  No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>3

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlimport** não encontrá-lo. Veja a Seção 6.2.13, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>4

  Para conexões TCP/IP, o número de porta a ser usado.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>5

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>6

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

- `--replace`, `-r`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>7

  As opções `--replace` e `--ignore` controlam o tratamento das linhas de entrada que duplicam linhas existentes com valores de chave únicos. Se você especificar `--replace`, as novas linhas substituem as linhas existentes que têm o mesmo valor de chave única. Se você especificar `--ignore`, as linhas de entrada que duplicam uma linha existente com um valor de chave único são ignoradas. Se você não especificar nenhuma dessas opções, um erro ocorre quando um valor de chave duplicado é encontrado, e o resto do arquivo de texto é ignorado.

- `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>8

  Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

  A partir do MySQL 5.7.5, essa opção é desaconselhada; espere-se que ela seja removida em uma futura versão do MySQL. Ela está sempre habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

  Nota

  Senhas que usam o método de hashing pré-4.1 são menos seguras do que senhas que usam o método de hashing de senha nativo e devem ser evitadas. Senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql\_old\_password”.

- `--server-public-key-path=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--character-sets-dir=path</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>9

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para `sha256_password`, essa opção só se aplica se o MySQL foi construído usando o OpenSSL.

  Para obter informações sobre os módulos `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação com Pluggable SHA-256” e a Seção 6.4.1.4, “Cache de Autenticação com Pluggable SHA-2”.

  A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

- `--shared-memory-base-name=nome`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>0

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada com um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é case-sensitive.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>1

  Modo silencioso. Produza a saída apenas quando ocorrerem erros.

- `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>2

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--tls-version=lista_protocolos`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>3

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 6.3.2, “Protocolos e cifra TLS de conexão criptografada”.

  Essa opção foi adicionada no MySQL 5.7.10.

- `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>4

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

- `--use-threads=N`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>5

  Carregue arquivos em paralelo usando *`N`* threads.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>6

  Modo verbose. Imprima mais informações sobre o que o programa faz.

- `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para colunas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--columns=column_list</code>]]</td> </tr></tbody></table>7

  Exibir informações da versão e sair.

Aqui está uma sessão de exemplo que demonstra o uso do **mysqlimport**:

```sql
$> mysql -e 'CREATE TABLE imptest(id INT, n VARCHAR(30))' test
$> ed
a
100     Max Sydow
101     Count Dracula
.
w imptest.txt
32
q
$> od -c imptest.txt
0000000   1   0   0  \t   M   a   x       S   y   d   o   w  \n   1   0
0000020   1  \t   C   o   u   n   t       D   r   a   c   u   l   a  \n
0000040
$> mysqlimport --local test imptest.txt
test.imptest: Records: 2  Deleted: 0  Skipped: 0  Warnings: 0
$> mysql -e 'SELECT * FROM imptest' test
+------+---------------+
| id   | n             |
+------+---------------+
|  100 | Max Sydow     |
|  101 | Count Dracula |
+------+---------------+
```
