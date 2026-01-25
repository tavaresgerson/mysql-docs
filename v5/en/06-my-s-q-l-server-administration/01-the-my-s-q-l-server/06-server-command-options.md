### 5.1.6 Opções de Comando do Servidor

Ao iniciar o servidor [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), você pode especificar opções do programa usando qualquer um dos métodos descritos na [Seção 4.2.2, “Especificando Opções do Programa”](program-options.html "4.2.2 Especificando Opções do Programa"). Os métodos mais comuns são fornecer opções em um arquivo de opção ou na linha de comando. No entanto, na maioria dos casos, é desejável garantir que o servidor use as mesmas opções toda vez que for executado. A melhor maneira de garantir isso é listá-las em um arquivo de opção. Consulte a [Seção 4.2.2.2, “Usando Arquivos de Opção”](option-files.html "4.2.2.2 Usando Arquivos de Opção"). Essa seção também descreve o formato e a sintaxe do arquivo de opção.

[**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") lê opções dos grupos `[mysqld]` e `[server]`. [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") lê opções dos grupos `[mysqld]`, `[server]`, `[mysqld_safe]` e `[safe_mysqld]`. [**mysql.server**](mysql-server.html "4.3.3 mysql.server — MySQL Server Startup Script") lê opções dos grupos `[mysqld]` e `[mysql.server]`.

Um servidor MySQL embarcado geralmente lê opções dos grupos `[server]`, `[embedded]` e `[xxxxx_SERVER]`, onde *`xxxxx`* é o nome da aplicação na qual o servidor está embarcado.

[**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") aceita muitas opções de comando. Para um breve resumo, execute este comando:

```sql
mysqld --help
```

Para ver a lista completa, use este comando:

```sql
mysqld --verbose --help
```

Alguns dos itens na lista são, na verdade, variáveis de sistema que podem ser definidas na inicialização do servidor. Elas podem ser exibidas em tempo de execução usando a instrução [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement"). Alguns itens exibidos pelo comando [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") precedente não aparecem na saída do [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement"); isso ocorre porque são apenas opções e não variáveis de sistema.

A lista a seguir mostra algumas das opções de servidor mais comuns. Opções adicionais são descritas em outras seções:

* Opções que afetam a segurança: Consulte a [Seção 6.1.4, “Opções e Variáveis mysqld Relacionadas à Segurança”](security-options.html "6.1.4 Opções e Variáveis mysqld Relacionadas à Segurança").

* Opções relacionadas a SSL: Consulte [Opções de Comando para Conexões Criptografadas](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections").

* Opções de controle de Binary Log: Consulte a [Seção 5.4.4, “O Binary Log”](binary-log.html "5.4.4 O Binary Log").
* Opções relacionadas à Replication: Consulte a [Seção 16.1.6, “Opções e Variáveis de Binary Logging e Replication”](replication-options.html "16.1.6 Opções e Variáveis de Binary Logging e Replication").

* Opções para carregamento de Plugins, como storage engines plugáveis: Consulte a [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Instalando e Desinstalando Plugins").

* Opções específicas para Storage Engines particulares: Consulte a [Seção 14.15, “Opções de Inicialização e Variáveis de Sistema InnoDB”](innodb-parameters.html "14.15 Opções de Inicialização e Variáveis de Sistema InnoDB") e a [Seção 15.2.1, “Opções de Inicialização MyISAM”](myisam-start.html "15.2.1 Opções de Inicialização MyISAM").

Algumas opções controlam o tamanho de buffers ou caches. Para um determinado buffer, o servidor pode precisar alocar estruturas de dados internas. Essas estruturas são tipicamente alocadas a partir da memória total alocada ao buffer, e a quantidade de espaço necessária pode depender da plataforma. Isso significa que, ao atribuir um valor a uma opção que controla o tamanho de um buffer, a quantidade de espaço realmente disponível pode diferir do valor atribuído. Em alguns casos, a quantidade pode ser menor do que o valor atribuído. Também é possível que o servidor ajuste um valor para cima. Por exemplo, se você atribuir o valor 0 a uma opção para a qual o valor mínimo é 1024, o servidor define o valor como 1024.

Os valores para tamanhos de buffer, comprimentos e tamanhos de Stack são dados em bytes, a menos que especificado de outra forma.

Algumas opções aceitam valores de nome de arquivo. A menos que especificado de outra forma, o local padrão do arquivo é o data directory, se o valor for um nome de caminho relativo. Para especificar explicitamente a localização, use um nome de caminho absoluto. Suponha que o data directory seja `/var/mysql/data`. Se uma opção com valor de arquivo for fornecida como um nome de caminho relativo, ela será localizada em `/var/mysql/data`. Se o valor for um nome de caminho absoluto, sua localização será conforme especificado pelo nome do caminho.

Você também pode definir os valores das variáveis de sistema do servidor na inicialização do servidor usando nomes de variáveis como opções. Para atribuir um valor a uma variável de sistema do servidor, use uma opção no formato `--var_name=value`. Por exemplo, [`--sort_buffer_size=384M`](server-system-variables.html#sysvar_sort_buffer_size) define a variável [`sort_buffer_size`](server-system-variables.html#sysvar_sort_buffer_size) para um valor de 384MB.

Ao atribuir um valor a uma variável, o MySQL pode corrigir automaticamente o valor para permanecer dentro de um determinado intervalo, ou ajustar o valor para o valor permitido mais próximo, se apenas certos valores forem permitidos.

Para restringir o valor máximo para o qual uma variável de sistema pode ser definida em tempo de execução com a instrução [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"), especifique esse máximo usando uma opção no formato `--maximum-var_name=value` na inicialização do servidor.

Você pode alterar os valores da maioria das variáveis de sistema em tempo de execução com a instrução [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"). Consulte a [Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

A [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Variáveis de Sistema do Servidor"), fornece uma descrição completa de todas as variáveis e informações adicionais para configurá-las na inicialização e em tempo de execução do servidor. Para obter informações sobre como alterar variáveis de sistema, consulte a [Seção 5.1.1, “Configurando o Servidor”](server-configuration.html "5.1.1 Configurando o Servidor").

* [`--help`](server-options.html#option_mysqld_help), `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma breve mensagem de ajuda e sai. Use ambas as opções [`--verbose`](server-options.html#option_mysqld_verbose) e [`--help`](server-options.html#option_mysqld_help) para ver a mensagem completa.

* [`--allow-suspicious-udfs`](server-options.html#option_mysqld_allow-suspicious-udfs)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Esta opção controla se funções carregáveis (loadable functions) que têm apenas um símbolo `xxx` para a função principal podem ser carregadas. Por padrão, a opção está desativada e apenas funções carregáveis que têm pelo menos um símbolo auxiliar podem ser carregadas; isso evita tentativas de carregar funções de arquivos de objeto compartilhado (shared object files) que não sejam aqueles que contêm funções legítimas. Consulte [Precauções de Segurança para Funções Carregáveis](/doc/extending-mysql/5.7/en/adding-loadable-function.html#loadable-function-security).

* [`--ansi`](server-options.html#option_mysqld_ansi)

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  Usa a sintaxe SQL padrão (ANSI) em vez da sintaxe MySQL. Para um controle mais preciso sobre o SQL mode do servidor, use a opção [`--sql-mode`](server-options.html#option_mysqld_sql-mode). Consulte a [Seção 1.6, “Conformidade com Padrões MySQL”](compatibility.html "1.6 MySQL Standards Compliance") e a [Seção 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

* [`--basedir=dir_name`](server-system-variables.html#sysvar_basedir), [`-b dir_name`](server-system-variables.html#sysvar_basedir)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>padrão dependente da configuração</code></td> </tr></tbody></table>

  O caminho para o diretório de instalação do MySQL. Esta opção define a variável de sistema [`basedir`](server-system-variables.html#sysvar_basedir).

* [`--bootstrap`](server-options.html#option_mysqld_bootstrap)

  <table frame="box" rules="all" summary="Properties for bootstrap"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bootstrap</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr></tbody></table>

  Esta opção é usada pelo programa [**mysql_install_db**](mysql-install-db.html "4.4.2 mysql_install_db — Initialize MySQL Data Directory") para criar as privilege tables do MySQL sem ter que iniciar um servidor MySQL completo.

  Note

  [**mysql_install_db**](mysql-install-db.html "4.4.2 mysql_install_db — Initialize MySQL Data Directory") está descontinuado porque sua funcionalidade foi integrada ao [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), o servidor MySQL. Consequentemente, a opção [`--bootstrap`](server-options.html#option_mysqld_bootstrap) do servidor que [**mysql_install_db**](mysql-install-db.html "4.4.2 mysql_install_db — Initialize MySQL Data Directory") passa para [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") também está descontinuada. Para inicializar uma instalação MySQL, invoque [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com a opção [`--initialize`](server-options.html#option_mysqld_initialize) ou [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure). Para mais informações, consulte a [Seção 2.9.1, “Inicializando o Data Directory”](data-directory-initialization.html "2.9.1 Inicializando o Data Directory"). Espere que [**mysql_install_db**](mysql-install-db.html "4.4.2 mysql_install_db — Initialize MySQL Data Directory") e a opção [`--bootstrap`](server-options.html#option_mysqld_bootstrap) do servidor sejam removidas em uma versão futura do MySQL.

  [`--bootstrap`](server-options.html#option_mysqld_bootstrap) é mutuamente exclusivo com [`--daemonize`](server-options.html#option_mysqld_daemonize), [`--initialize`](server-options.html#option_mysqld_initialize) e [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure).

  Global Transaction Identifiers (GTIDs) não são desativados quando [`--bootstrap`](server-options.html#option_mysqld_bootstrap) é usado. [`--bootstrap`](server-options.html#option_mysqld_bootstrap) foi usado (Bug #20980271). Consulte a [Seção 16.1.3, “Replication com Global Transaction Identifiers”](replication-gtids.html "16.1.3 Replication with Global Transaction Identifiers").

  Quando o servidor opera no modo bootstrap, algumas funcionalidades não estão disponíveis, o que limita as instruções permitidas em qualquer arquivo nomeado pela variável de sistema [`init_file`](server-system-variables.html#sysvar_init_file). Para mais informações, consulte a descrição dessa variável. Além disso, a variável de sistema [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) não tem efeito.

* [`--character-set-client-handshake`](server-options.html#option_mysqld_character-set-client-handshake)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Não ignora a informação de character set enviada pelo cliente. Para ignorar a informação do cliente e usar o character set padrão do servidor, use [`--skip-character-set-client-handshake`](server-options.html#option_mysqld_character-set-client-handshake); isso faz com que o MySQL se comporte como o MySQL 4.0.

* [`--chroot=dir_name`](server-options.html#option_mysqld_chroot), `-r dir_name`

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr></tbody></table>

  Coloca o servidor [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") em um ambiente fechado durante a inicialização, usando a chamada de sistema `chroot()`. Esta é uma medida de segurança recomendada. O uso desta opção limita um pouco [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") e [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement").

* [`--console`](server-options.html#option_mysqld_console)

  <table frame="box" rules="all" summary="Properties for console"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--console</code></td> </tr><tr><th>Específico da Plataforma</th> <td>Windows</td> </tr></tbody></table>

  (Apenas Windows.) Escreve o error log para `stderr` e `stdout` (o console). [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") não fecha a janela do console se esta opção for usada.

  [`--console`](server-options.html#option_mysqld_console) tem precedência sobre [`--log-error`](server-options.html#option_mysqld_log-error) se ambas forem fornecidas. (No MySQL 5.5 e 5.6, isso é invertido: [`--log-error`](server-options.html#option_mysqld_log-error) tem precedência sobre [`--console`](server-options.html#option_mysqld_console) se ambas forem fornecidas.)

* [`--core-file`](server-options.html#option_mysqld_core-file)

  <table frame="box" rules="all" summary="Properties for core-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Quando esta opção é usada, um core file é escrito se [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") falhar; nenhum argumento é necessário (ou aceito). O nome e a localização do core file dependem do sistema. No Linux, um core file chamado `core.pid` é escrito no diretório de trabalho atual do processo, que para [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") é o data directory. *`pid`* representa o Process ID (PID) do processo do servidor. No macOS, um core file chamado `core.pid` é escrito no diretório `/cores`. No Solaris, use o comando **coreadm** para especificar onde escrever o core file e como nomeá-lo.

  Para alguns sistemas, para obter um core file, você também deve especificar a opção [`--core-file-size`](mysqld-safe.html#option_mysqld_safe_core-file-size) para [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"). Consulte a [Seção 4.3.2, “mysqld_safe — MySQL Server Startup Script”](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"). Em alguns sistemas, como o Solaris, você não obtém um core file se também estiver usando a opção [`--user`](server-options.html#option_mysqld_user). Pode haver restrições ou limitações adicionais. Por exemplo, pode ser necessário executar **ulimit -c unlimited** antes de iniciar o servidor. Consulte a documentação do seu sistema.

* [`--daemonize`](server-options.html#option_mysqld_daemonize)

  <table frame="box" rules="all" summary="Properties for daemonize"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--daemonize[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Esta opção faz com que o servidor seja executado como um daemon de *forking* tradicional, permitindo que funcione com sistemas operacionais que usam systemd para controle de processo. Para mais informações, consulte a [Seção 2.5.10, “Gerenciando o MySQL Server com systemd”](using-systemd.html "2.5.10 Managing MySQL Server with systemd").

  [`--daemonize`](server-options.html#option_mysqld_daemonize) é mutuamente exclusivo com [`--bootstrap`](server-options.html#option_mysqld_bootstrap), [`--initialize`](server-options.html#option_mysqld_initialize) e [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure).

* [`--datadir=dir_name`](server-system-variables.html#sysvar_datadir), `-h dir_name`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  O caminho para o data directory do MySQL server. Esta opção define a variável de sistema [`datadir`](server-system-variables.html#sysvar_datadir). Consulte a descrição dessa variável.

* [`--debug[=debug_options]`](server-options.html#option_mysqld_debug), `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se o MySQL estiver configurado com a opção **CMake** [`-DWITH_DEBUG=1`](source-configuration-options.html#option_cmake_with_debug), você pode usar esta opção para obter um trace file do que [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") está fazendo. Uma string *`debug_options`* típica é `d:t:o,file_name`. O padrão é `d:t:i:o,/tmp/mysqld.trace` no Unix e `d:t:i:O,\mysqld.trace` no Windows.

  Usar [`-DWITH_DEBUG=1`](source-configuration-options.html#option_cmake_with_debug) para configurar o MySQL com suporte a debugging permite que você use a opção [`--debug="d,parser_debug"`](server-options.html#option_mysqld_debug) ao iniciar o servidor. Isso faz com que o parser Bison usado para processar as instruções SQL despeje um trace do parser na saída de erro padrão do servidor. Tipicamente, essa saída é escrita no error log.

  Esta opção pode ser fornecida várias vezes. Valores que começam com `+` ou `-` são adicionados ou subtraídos do valor anterior. Por exemplo, [`--debug=T`](server-options.html#option_mysqld_debug) [`--debug=+P`](server-options.html#option_mysqld_debug) define o valor como `P:T`.

  Para mais informações, consulte a [Seção 5.8.3, “O Pacote DBUG”](dbug-package.html "5.8.3 O Pacote DBUG").

* [`--debug-sync-timeout[=N]`](server-options.html#option_mysqld_debug-sync-timeout)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Controla se o recurso Debug Sync para testes e debugging está habilitado. O uso do Debug Sync requer que o MySQL seja configurado com a opção **CMake** [`-DWITH_DEBUG=ON`](source-configuration-options.html#option_cmake_with_debug) (consulte a [Seção 2.8.7, “Opções de Configuração de Fonte MySQL”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options")). Se o Debug Sync não for compilado, esta opção não estará disponível. O valor da opção é um timeout em segundos. O valor padrão é 0, que desabilita o Debug Sync. Para habilitá-lo, especifique um valor maior que 0; este valor também se torna o timeout padrão para pontos de sincronização individuais. Se a opção for fornecida sem um valor, o timeout será definido como 300 segundos.

  Para uma descrição do recurso Debug Sync e como usar pontos de sincronização, consulte [MySQL Internals: Test Synchronization](/doc/internals/en/test-synchronization.html).

* [`--default-time-zone=timezone`](server-options.html#option_mysqld_default-time-zone)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define o time zone padrão do servidor. Esta opção define a variável de sistema global [`time_zone`](server-system-variables.html#sysvar_time_zone). Se esta opção não for fornecida, o time zone padrão é o mesmo que o time zone do sistema (dado pelo valor da variável de sistema [`system_time_zone`](server-system-variables.html#sysvar_system_time_zone)).

  A variável [`system_time_zone`](server-system-variables.html#sysvar_system_time_zone) difere de [`time_zone`](server-system-variables.html#sysvar_time_zone). Embora possam ter o mesmo valor, esta última variável é usada para inicializar o time zone para cada cliente que se conecta. Consulte a [Seção 5.1.13, “Suporte a Time Zone do MySQL Server”](time-zone-support.html "5.1.13 MySQL Server Time Zone Support").

* [`--defaults-extra-file=file_name`](server-options.html#option_mysqld_defaults-extra-file)

  Lê este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou for inacessível, ocorre um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual. Esta deve ser a primeira opção na linha de comando se for usada.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, consulte a [Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](server-options.html#option_mysqld_defaults-file)

  Lê apenas o arquivo de opção fornecido. Se o arquivo não existir ou for inacessível, ocorre um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Note

  Esta deve ser a primeira opção na linha de comando se for usada, exceto que, se o servidor for iniciado com as opções [`--defaults-file`](server-options.html#option_mysqld_defaults-file) e [`--install`](server-options.html#option_mysqld_install) (ou [`--install-manual`](server-options.html#option_mysqld_install-manual)), [`--install`](server-options.html#option_mysqld_install) (ou [`--install-manual`](server-options.html#option_mysqld_install-manual)) deve ser a primeira.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, consulte a [Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-group-suffix=str`](server-options.html#option_mysqld_defaults-group-suffix)

  Lê não apenas os grupos de opção usuais, mas também grupos com os nomes usuais e um sufixo *`str`*. Por exemplo, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") normalmente lê o grupo `[mysqld]`. Se esta opção for fornecida como [`--defaults-group-suffix=_other`](server-options.html#option_mysqld_defaults-group-suffix), [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") também lê o grupo `[mysqld_other]`.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, consulte a [Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--des-key-file=file_name`](server-options.html#option_mysqld_des-key-file)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Lê as DES keys padrão deste arquivo. Estas keys são usadas pelas funções [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt) e [`DES_DECRYPT()`](encryption-functions.html#function_des-decrypt).

  Note

  As funções [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt) e [`DES_DECRYPT()`](encryption-functions.html#function_des-decrypt) estão descontinuadas no MySQL 5.7, são removidas no MySQL 8.0 e não devem mais ser usadas. Consequentemente, [`--des-key-file`](server-options.html#option_mysqld_des-key-file) também está descontinuada e será removida no MySQL 8.0.

* [`--disable-partition-engine-check`](server-options.html#option_mysqld_disable-partition-engine-check)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se deve desativar a verificação de inicialização para tabelas com partitioning não nativo.

  A partir do MySQL 5.7.17, o manipulador de partitioning genérico no MySQL server está descontinuado e é removido no MySQL 8.0, quando se espera que o storage engine usado para uma determinada tabela forneça seu próprio manipulador de partitioning (“nativo”). Atualmente, apenas os storage engines [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") e [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") fazem isso.

  O uso de tabelas com partitioning não nativo resulta em um aviso [`ER_WARN_DEPRECATED_SYNTAX`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_warn_deprecated_syntax). No MySQL 5.7.17 a 5.7.20, o servidor executa automaticamente uma verificação na inicialização para identificar tabelas que usam partitioning não nativo; para qualquer uma encontrada, o servidor escreve uma mensagem em seu error log. Para desativar esta verificação, use a opção [`--disable-partition-engine-check`](server-options.html#option_mysqld_disable-partition-engine-check). No MySQL 5.7.21 e posterior, esta verificação *não* é executada; nessas versões, você deve iniciar o servidor com [`--disable-partition-engine-check=false`](server-options.html#option_mysqld_disable-partition-engine-check), se desejar que o servidor verifique as tabelas usando o manipulador de partitioning genérico (Bug #85830, Bug #25846957).

  O uso de tabelas com partitioning não nativo resulta em um aviso [`ER_WARN_DEPRECATED_SYNTAX`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_warn_deprecated_syntax). Além disso, o servidor executa uma verificação na inicialização para identificar tabelas que usam partitioning não nativo; para qualquer uma encontrada, o servidor escreve uma mensagem em seu error log. Para desativar esta verificação, use a opção [`--disable-partition-engine-check`](server-options.html#option_mysqld_disable-partition-engine-check).

  Para se preparar para a migração para o MySQL 8.0, qualquer tabela com partitioning não nativo deve ser alterada para usar um engine que forneça partitioning nativo, ou ser transformada em não-particionada. Por exemplo, para alterar uma tabela para `InnoDB`, execute esta instrução:

  ```sql
  ALTER TABLE table_name ENGINE = INNODB;
  ```

* [`--early-plugin-load=plugin_list`](server-options.html#option_mysqld_early-plugin-load)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Esta opção informa ao servidor quais plugins carregar antes de carregar plugins built-in obrigatórios e antes da inicialização do storage engine. O carregamento antecipado (early loading) é suportado apenas para plugins compilados com `PLUGIN_OPT_ALLOW_EARLY`. Se múltiplas opções [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) forem fornecidas, apenas a última se aplica.

  O valor da opção é uma lista separada por ponto e vírgula de *`plugin_library`* e valores *`name`*`=`*`plugin_library`*. Cada *`plugin_library`* é o nome de um arquivo de biblioteca que contém código de plugin, e cada *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugin for nomeada sem nenhum nome de plugin precedente, o servidor carrega todos os plugins na biblioteca. Com um nome de plugin precedente, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugin no diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir).

  Por exemplo, se os plugins nomeados `myplug1` e `myplug2` estiverem contidos nos arquivos de biblioteca de plugin `myplug1.so` e `myplug2.so`, use esta opção para realizar um carregamento antecipado de plugin:

  ```sql
  mysqld --early-plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

  Aspas envolvem o valor do argumento porque, caso contrário, alguns interpretadores de comando interpretariam o ponto e vírgula (`;`) como um caractere especial. (Por exemplo, shells Unix o tratam como um terminador de comando.)

  Cada plugin nomeado é carregado antecipadamente para uma única invocação de [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Após um restart, o plugin não é carregado antecipadamente, a menos que [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) seja usado novamente.

  Se o servidor for iniciado usando [`--initialize`](server-options.html#option_mysqld_initialize) ou [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure), os plugins especificados por [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) não são carregados.

  Se o servidor for executado com [`--help`](server-options.html#option_mysqld_help), os plugins especificados por [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) são carregados, mas não inicializados. Este comportamento garante que as opções de plugin sejam exibidas na mensagem de ajuda.

  A criptografia de tablespace `InnoDB` depende do MySQL Keyring para gerenciamento de encryption key, e o keyring plugin a ser usado deve ser carregado antes da inicialização do storage engine para facilitar a recovery do `InnoDB` para tabelas criptografadas. Por exemplo, administradores que desejam que o plugin `keyring_file` seja carregado na inicialização devem usar [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) com o valor de opção apropriado (como `keyring_file.so` em sistemas Unix e Unix-like ou `keyring_file.dll` no Windows).

  Important

  No MySQL 5.7.11, o valor padrão de [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) é o nome do arquivo de biblioteca do plugin `keyring_file`, fazendo com que esse plugin seja carregado por padrão. No MySQL 5.7.12 e superior, o valor padrão de [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) está vazio; para carregar o plugin `keyring_file`, você deve especificar explicitamente a opção com um valor que nomeie o arquivo de biblioteca do plugin `keyring_file`.

  Esta mudança no valor padrão de [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) introduz uma incompatibilidade para criptografia de tablespace `InnoDB` para upgrades do 5.7.11 para o 5.7.12 ou superior. Os administradores que têm tablespaces `InnoDB` criptografados devem tomar medidas explícitas para garantir o carregamento contínuo do keyring plugin: Inicie o servidor com uma opção [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) que nomeie o arquivo de biblioteca do plugin. Para informações adicionais, consulte a [Seção 6.4.4.1, “Instalação do Keyring Plugin”](keyring-plugin-installation.html "6.4.4.1 Keyring Plugin Installation").

  Para informações sobre criptografia de tablespace `InnoDB`, consulte a [Seção 14.14, “Criptografia de Dados em Repouso InnoDB”](innodb-data-encryption.html "14.14 InnoDB Data-at-Rest Encryption"). Para informações gerais sobre carregamento de plugins, consulte a [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

* [`--exit-info[=flags]`](server-options.html#option_mysqld_exit-info), `-T [flags]`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Esta é uma bitmask de diferentes flags que você pode usar para debugging do servidor [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Não use esta opção a menos que você saiba *exatamente* o que ela faz!

* [`--external-locking`](server-options.html#option_mysqld_external-locking)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Habilita external locking (system locking), que é desativado por padrão. Se você usar esta opção em um sistema onde o `lockd` não funciona completamente (como Linux), é fácil para o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") entrar em deadlock.

  Para desativar explicitamente o external locking, use `--skip-external-locking`.

  O external locking afeta apenas o acesso a tabelas [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"). Para mais informações, incluindo as condições sob as quais pode e não pode ser usado, consulte a [Seção 8.11.5, “External Locking”](external-locking.html "8.11.5 External Locking").

* [`--flush`](server-options.html#option_mysqld_flush)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Executa Flush (sincroniza) todas as alterações para o disco após cada instrução SQL. Normalmente, o MySQL realiza uma gravação de todas as alterações no disco somente após cada instrução SQL e deixa o sistema operacional lidar com a sincronização para o disco. Consulte a [Seção B.3.3.3, “O que Fazer se o MySQL Continuar Crashando”](crashing.html "B.3.3.3 What to Do If MySQL Keeps Crashing").

  Note

  Se [`--flush`](server-options.html#option_mysqld_flush) for especificado, o valor de [`flush_time`](server-system-variables.html#sysvar_flush_time) não importa e as alterações em [`flush_time`](server-system-variables.html#sysvar_flush_time) não têm efeito no comportamento do Flush.

* [`--gdb`](server-options.html#option_mysqld_gdb)

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  Instala um manipulador de interrupção para `SIGINT` (necessário para parar [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com `^C` para definir breakpoints) e desativa stack tracing e o manuseio de core file. Consulte a [Seção 5.8.1.4, “Debugging mysqld sob gdb”](using-gdb-on-mysqld.html "5.8.1.4 Debugging mysqld under gdb").

* [`--ignore-db-dir=dir_name`](server-options.html#option_mysqld_ignore-db-dir)

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  Esta opção informa ao servidor para ignorar o nome do diretório fornecido para fins da instrução [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") ou tabelas `INFORMATION_SCHEMA`. Por exemplo, se uma configuração MySQL localizar o data directory na raiz de um file system no Unix, o sistema pode criar um diretório `lost+found` lá que o servidor deve ignorar. Iniciar o servidor com [`--ignore-db-dir=lost+found`](server-options.html#option_mysqld_ignore-db-dir) faz com que esse nome não seja listado como um Database.

  Para especificar mais de um nome, use esta opção várias vezes, uma para cada nome. Especificar a opção com um valor vazio (ou seja, como [`--ignore-db-dir=`](server-options.html#option_mysqld_ignore-db-dir)) redefine a lista de diretórios para a lista vazia.

  Instâncias desta opção fornecidas na inicialização do servidor são usadas para definir a variável de sistema [`ignore_db_dirs`](server-system-variables.html#sysvar_ignore_db_dirs).

  Esta opção está descontinuada no MySQL 5.7. Com a introdução do data dictionary no MySQL 8.0, tornou-se supérflua e foi removida nessa versão.

* [`--initialize`](server-options.html#option_mysqld_initialize)

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  Esta opção é usada para inicializar uma instalação MySQL criando o data directory e populando as tabelas no `mysql` system database. Para mais informações, consulte a [Seção 2.9.1, “Inicializando o Data Directory”](data-directory-initialization.html "2.9.1 Inicializando o Data Directory").

  Esta opção limita os efeitos de, ou é incompatível com, várias outras opções de inicialização para o MySQL server. Algumas das questões mais comuns desse tipo são observadas aqui:

  + Recomendamos fortemente, ao inicializar o data directory com `--initialize`, que você não especifique opções adicionais além de [`--datadir`](server-system-variables.html#sysvar_datadir), outras opções usadas para definir localizações de diretório, como [`--basedir`](server-system-variables.html#sysvar_basedir), e possivelmente [`--user`](server-options.html#option_mysqld_user), se necessário. As opções para o MySQL server em execução podem ser especificadas ao iniciá-lo, uma vez que a inicialização tenha sido concluída e [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") tenha sido encerrado. Isso também se aplica ao usar [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure) em vez de `--initialize`.

  + Quando o servidor é iniciado com `--initialize`, algumas funcionalidades não estão disponíveis, o que limita as instruções permitidas em qualquer arquivo nomeado pela variável de sistema [`init_file`](server-system-variables.html#sysvar_init_file). Para mais informações, consulte a descrição dessa variável. Além disso, a variável de sistema [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) não tem efeito.

  + A opção [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) é ignorada quando usada em conjunto com `--initialize`.

  + `--initialize` é mutuamente exclusivo com [`--bootstrap`](server-options.html#option_mysqld_bootstrap) e [`--daemonize`](server-options.html#option_mysqld_daemonize).

  Os itens na lista anterior também se aplicam ao inicializar o servidor usando a opção [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure).

* [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure)

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  Esta opção é usada para inicializar uma instalação MySQL criando o data directory e populando as tabelas no `mysql` system database. Esta opção implica [`--initialize`](server-options.html#option_mysqld_initialize), e as mesmas restrições e limitações se aplicam; para mais informações, consulte a descrição dessa opção e a [Seção 2.9.1, “Inicializando o Data Directory”](data-directory-initialization.html "2.9.1 Inicializando o Data Directory").

  Warning

  Esta opção cria um usuário `root` do MySQL com uma Password vazia, o que é inseguro. Por esta razão, não a use em produção sem definir esta Password manualmente. Consulte [Post-Initialization root Password Assignment](data-directory-initialization.html#data-directory-initialization-password-assignment "Post-Initialization root Password Assignment"), para obter informações sobre como fazer isso.

* `--innodb-xxx`

  Define uma opção para o storage engine `InnoDB`. As opções `InnoDB` estão listadas na [Seção 14.15, “Opções de Inicialização e Variáveis de Sistema InnoDB”](innodb-parameters.html "14.15 InnoDB Startup Options and System Variables").

* [`--install [service_name]`](server-options.html#option_mysqld_install)

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  (Apenas Windows) Instala o servidor como um Windows service que é iniciado automaticamente durante a inicialização do Windows. O nome padrão do service é `MySQL` se nenhum valor *`service_name`* for fornecido. Para mais informações, consulte a [Seção 2.3.4.8, “Iniciando o MySQL como um Windows Service”](windows-start-service.html "2.3.4.8 Starting MySQL as a Windows Service").

  Note

  Se o servidor for iniciado com as opções [`--defaults-file`](server-options.html#option_mysqld_defaults-file) e [`--install`](server-options.html#option_mysqld_install), [`--install`](server-options.html#option_mysqld_install) deve ser a primeira.

* [`--install-manual [service_name]`](server-options.html#option_mysqld_install-manual)

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  (Apenas Windows) Instala o servidor como um Windows service que deve ser iniciado manualmente. Ele não inicia automaticamente durante a inicialização do Windows. O nome padrão do service é `MySQL` se nenhum valor *`service_name`* for fornecido. Para mais informações, consulte a [Seção 2.3.4.8, “Iniciando o MySQL como um Windows Service”](windows-start-service.html "2.3.4.8 Starting MySQL as a Windows Service").

  Note

  Se o servidor for iniciado com as opções [`--defaults-file`](option-file-options.html#option_general_defaults-file) e [`--install-manual`](server-options.html#option_mysqld_install-manual), [`--install-manual`](server-options.html#option_mysqld_install-manual) deve ser a primeira.

* [`--language=lang_name, -L lang_name`](server-options.html#option_mysqld_language)

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  O idioma a ser usado para error messages. *`lang_name`* pode ser fornecido como o nome do idioma ou como o nome do caminho completo para o diretório onde os arquivos de idioma estão instalados. Consulte a [Seção 10.12, “Configurando o Idioma das Mensagens de Erro”](error-message-language.html "10.12 Setting the Error Message Language").

  [`--lc-messages-dir`](server-options.html#option_mysqld_lc-messages-dir) e [`--lc-messages`](server-options.html#option_mysqld_lc-messages) devem ser usados em vez de [`--language`](server-options.html#option_mysqld_language), que está descontinuada (e tratada como um sinônimo para [`--lc-messages-dir`](server-options.html#option_mysqld_lc-messages-dir)). Você deve esperar que a opção [`--language`](server-options.html#option_mysqld_language) seja removida em uma versão futura do MySQL.

* [`--large-pages`](server-options.html#option_mysqld_large-pages)

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  Algumas arquiteturas de hardware/sistema operacional suportam memory pages maiores do que o padrão (geralmente 4KB). A implementação real deste suporte depende do hardware e do sistema operacional subjacentes. Aplicações que executam muitos acessos à memória podem obter melhorias de performance usando large pages devido à redução de Translation Lookaside Buffer (TLB) misses.

  O MySQL suporta a implementação Linux de suporte a large page (que é chamada de HugeTLB no Linux). Consulte a [Seção 8.12.4.3, “Habilitando o Suporte a Large Page”](large-page-support.html "8.12.4.3 Enabling Large Page Support"). Para suporte a large pages no Solaris, consulte a descrição da opção [`--super-large-pages`](server-options.html#option_mysqld_super-large-pages).

  [`--large-pages`](server-options.html#option_mysqld_large-pages) é desativada por padrão.

* [`--lc-messages=locale_name`](server-options.html#option_mysqld_lc-messages)

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  O locale a ser usado para error messages. O padrão é `en_US`. O servidor converte o argumento em um nome de idioma e o combina com o valor de [`--lc-messages-dir`](server-options.html#option_mysqld_lc-messages-dir) para produzir a localização para o arquivo de mensagem de erro. Consulte a [Seção 10.12, “Configurando o Idioma das Mensagens de Erro”](error-message-language.html "10.12 Setting the Error Message Language").

* [`--lc-messages-dir=dir_name`](server-options.html#option_mysqld_lc-messages-dir)

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ansi</code></td> </tr></tbody></table>

  O diretório onde as error messages estão localizadas. O servidor usa o valor junto com o valor de [`--lc-messages`](server-options.html#option_mysqld_lc-messages) para produzir a localização para o arquivo de mensagem de erro. Consulte a [Seção 10.12, “Configurando o Idioma das Mensagens de Erro”](error-message-language.html "10.12 Setting the Error Message Language").

* [`--local-service`](server-options.html#option_mysqld_local-service)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>padrão dependente da configuração</code></td> </tr></tbody></table>

  (Apenas Windows) Uma opção `--local-service` após o nome do service faz com que o servidor seja executado usando a conta `LocalService` do Windows, que tem privilégios de sistema limitados. Se tanto [`--defaults-file`](option-file-options.html#option_general_defaults-file) quanto `--local-service` forem fornecidos após o nome do service, eles podem estar em qualquer ordem. Consulte a [Seção 2.3.4.8, “Iniciando o MySQL como um Windows Service”](windows-start-service.html "2.3.4.8 Starting MySQL as a Windows Service").

* [`--log-error[=file_name]`](server-options.html#option_mysqld_log-error)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>padrão dependente da configuração</code></td> </tr></tbody></table>

  Escreve o error log e as mensagens de inicialização neste arquivo. Consulte a [Seção 5.4.2, “O Error Log”](error-log.html "5.4.2 The Error Log").

  Se a opção não nomear um arquivo, o nome do arquivo de error log em sistemas Unix e Unix-like é `host_name.err` no data directory. O nome do arquivo no Windows é o mesmo, a menos que a opção [`--pid-file`](server-system-variables.html#sysvar_pid_file) seja especificada. Nesse caso, o nome do arquivo é o nome base do PID file com um sufixo `.err` no data directory.

  Se a opção nomear um arquivo, o arquivo de error log terá esse nome (com um sufixo `.err` adicionado se o nome não tiver sufixo), localizado sob o data directory, a menos que um nome de caminho absoluto seja fornecido para especificar um local diferente.

  No Windows, [`--console`](server-options.html#option_mysqld_console) tem precedência sobre [`--log-error`](server-options.html#option_mysqld_log-error) se ambos forem fornecidos. Neste caso, o servidor escreve o error log para o console, em vez de para um arquivo. (No MySQL 5.5 e 5.6, isso é invertido: [`--log-error`](server-options.html#option_mysqld_log-error) tem precedência sobre [`--console`](server-options.html#option_mysqld_console) se ambos forem fornecidos.)

* [`--log-isam[=file_name]`](server-options.html#option_mysqld_log-isam)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>padrão dependente da configuração</code></td> </tr></tbody></table>

  Registra todas as alterações `MyISAM` neste arquivo (usado apenas durante o debugging do `MyISAM`).

* [`--log-raw`](server-options.html#option_mysqld_log-raw)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>padrão dependente da configuração</code></td> </tr></tbody></table>

  Passwords em certas instruções escritas no general query log, slow query log e binary log são reescritas pelo servidor para não aparecerem literalmente em plain text. A reescrita de Password pode ser suprimida para o general query log iniciando o servidor com a opção [`--log-raw`](server-options.html#option_mysqld_log-raw). Esta opção pode ser útil para fins de diagnóstico, para ver o texto exato das instruções conforme recebidas pelo servidor, mas por motivos de segurança, não é recomendada para uso em produção.

  Se um query rewrite plugin estiver instalado, a opção [`--log-raw`](server-options.html#option_mysqld_log-raw) afeta o log de instruções da seguinte forma:

  + Sem [`--log-raw`](server-options.html#option_mysqld_log-raw), o servidor registra a instrução retornada pelo query rewrite plugin. Isso pode diferir da instrução conforme recebida.

  + Com [`--log-raw`](server-options.html#option_mysqld_log-raw), o servidor registra a instrução original conforme recebida.

  Para mais informações, consulte a [Seção 6.1.2.3, “Passwords e Logging”](password-logging.html "6.1.2.3 Passwords and Logging").

* [`--log-short-format`](server-options.html#option_mysqld_log-short-format)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>padrão dependente da configuração</code></td> </tr></tbody></table>

  Registra menos informações no slow query log, se ele tiver sido ativado.

* [`--log-tc=file_name`](server-options.html#option_mysqld_log-tc)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>padrão dependente da configuração</code></td> </tr></tbody></table>

  O nome do arquivo de log do transaction coordinator mapeado por memória (para XA transactions que afetam múltiplos storage engines quando o binary log está desativado). O nome padrão é `tc.log`. O arquivo é criado sob o data directory, se não for fornecido como um nome de caminho completo. Esta opção não é utilizada.

* [`--log-tc-size=size`](server-options.html#option_mysqld_log-tc-size)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>padrão dependente da configuração</code></td> </tr></tbody></table>

  O tamanho em bytes do log do transaction coordinator mapeado por memória. Os valores padrão e mínimo são 6 vezes o page size, e o valor deve ser um múltiplo do page size. (Antes do MySQL 5.7.21, o tamanho padrão é 24KB.)

* [`--log-warnings[=level]`](server-options.html#option_mysqld_log-warnings), `-W [level]`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>padrão dependente da configuração</code></td> </tr></tbody></table>

  Note

  A variável de sistema [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) é preferida em relação e deve ser usada em vez da opção [`--log-warnings`](server-options.html#option_mysqld_log-warnings) ou da variável de sistema [`log_warnings`](server-system-variables.html#sysvar_log_warnings). Para mais informações, consulte as descrições de [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) e [`log_warnings`](server-system-variables.html#sysvar_log_warnings). A opção de linha de comando [`--log-warnings`](server-options.html#option_mysqld_log-warnings) e a variável de sistema [`log_warnings`](server-system-variables.html#sysvar_log_warnings) estão descontinuadas; espere que sejam removidas em uma versão futura do MySQL.

  Se deve produzir error messages adicionais para o error log. Esta opção está habilitada por padrão. Para desativá-la, use [`--log-warnings=0`](server-options.html#option_mysqld_log-warnings). Especificar a opção sem um valor *`level`* incrementa o valor atual em 1. O servidor registra mensagens sobre instruções que são inseguras para statement-based logging se o valor for maior que 0. Conexões abortadas e erros de access-denied para novas tentativas de conexão são registrados se o valor for maior que 1. Consulte a [Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”](communication-errors.html "B.3.2.9 Communication Errors and Aborted Connections").

* [`--memlock`](server-options.html#option_mysqld_memlock)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>padrão dependente da configuração</code></td> </tr></tbody></table>

  Bloqueia o processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") na memória. Esta opção pode ajudar se você tiver um problema onde o sistema operacional está fazendo com que [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") faça swap para o disco.

  [`--memlock`](server-options.html#option_mysqld_memlock) funciona em sistemas que suportam a chamada de sistema `mlockall()`; isso inclui Solaris, a maioria das distribuições Linux que usam um kernel 2.4 ou superior, e talvez outros sistemas Unix. Em sistemas Linux, você pode saber se `mlockall()` (e, portanto, esta opção) é suportado verificando se está definido no arquivo `mman.h` do sistema, assim:

  ```sql
  $> grep mlockall /usr/include/sys/mman.h
  ```

  Se `mlockall()` for suportado, você deverá ver na saída do comando anterior algo como o seguinte:

  ```sql
  extern int mlockall (int __flags) __THROW;
  ```

  Important

  O uso desta opção pode exigir que você execute o servidor como `root`, o que, por razões de segurança, normalmente não é uma boa ideia. Consulte a [Seção 6.1.5, “Como Executar o MySQL como um Usuário Normal”](changing-mysql-user.html "6.1.5 How to Run MySQL as a Normal User").

  No Linux e talvez em outros sistemas, você pode evitar a necessidade de executar o servidor como `root` alterando o arquivo `limits.conf`. Consulte as notas relativas ao limite memlock na [Seção 8.12.4.3, “Habilitando o Suporte a Large Page”](large-page-support.html "8.12.4.3 Enabling Large Page Support").

  Você não deve usar esta opção em um sistema que não suporta a chamada de sistema `mlockall()`; se o fizer, é muito provável que [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") saia assim que você tentar iniciá-lo.

* [`--myisam-block-size=N`](server-options.html#option_mysqld_myisam-block-size)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>basedir</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr><tr><th>Valor Padrão</th> <td><code>padrão dependente da configuração</code></td> </tr></tbody></table>

  O block size a ser usado para MyISAM index pages.

* [`--no-defaults`](server-options.html#option_mysqld_no-defaults)

  Não lê nenhum arquivo de opção. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção, [`--no-defaults`](server-options.html#option_mysqld_no-defaults) pode ser usado para evitar que sejam lidas. Esta deve ser a primeira opção na linha de comando se for usada.

  Para informações adicionais sobre esta e outras opções de arquivo de opção, consulte a [Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--old-style-user-limits`](server-options.html#option_mysqld_old-style-user-limits)

  <table frame="box" rules="all" summary="Properties for bootstrap"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bootstrap</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr></tbody></table>

  Habilita user limits no estilo antigo. (Antes do MySQL 5.0.3, os resource limits da conta eram contados separadamente para cada host a partir do qual um usuário se conectava, em vez de por linha de conta na `user` table.) Consulte a [Seção 6.2.16, “Configurando Limites de Recursos da Conta”](user-resources.html "6.2.16 Setting Account Resource Limits").

* [`--partition[=value]`](server-options.html#option_mysqld_partition)

  <table frame="box" rules="all" summary="Properties for bootstrap"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bootstrap</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr></tbody></table>

  Habilita ou desabilita o suporte a user-defined partitioning no MySQL Server.

  Esta opção está descontinuada no MySQL 5.7.16 e é removida do MySQL 8.0 porque no MySQL 8.0, o partitioning engine é substituído por native partitioning, que não pode ser desativado.

* `--performance-schema-xxx`

  Configura uma opção do Performance Schema. Para detalhes, consulte a [Seção 25.14, “Opções de Comando do Performance Schema”](performance-schema-options.html "25.14 Performance Schema Command Options").

* [`--plugin-load=plugin_list`](server-options.html#option_mysqld_plugin-load)

  <table frame="box" rules="all" summary="Properties for bootstrap"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bootstrap</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr></tbody></table>

  Esta opção informa ao servidor para carregar os plugins nomeados na inicialização. Se múltiplas opções [`--plugin-load`](server-options.html#option_mysqld_plugin-load) forem fornecidas, apenas a última se aplica. Plugins adicionais a serem carregados podem ser especificados usando opções [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

  O valor da opção é uma lista separada por ponto e vírgula de *`plugin_library`* e valores *`name`*`=`*`plugin_library`*. Cada *`plugin_library`* é o nome de um arquivo de biblioteca que contém código de plugin, e cada *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugin for nomeada sem nenhum nome de plugin precedente, o servidor carrega todos os plugins na biblioteca. Com um nome de plugin precedente, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura por arquivos de biblioteca de plugin no diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir).

  Por exemplo, se os plugins nomeados `myplug1` e `myplug2` estiverem contidos nos arquivos de biblioteca de plugin `myplug1.so` e `myplug2.so`, use esta opção para realizar um carregamento de plugin antecipado:

  ```sql
  mysqld --plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

  Aspas envolvem o valor do argumento porque, caso contrário, alguns interpretadores de comando interpretariam o ponto e vírgula (`;`) como um caractere especial. (Por exemplo, shells Unix o tratam como um terminador de comando.)

  Cada plugin nomeado é carregado para uma única invocação de [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Após um restart, o plugin não é carregado, a menos que [`--plugin-load`](server-options.html#option_mysqld_plugin-load) seja usado novamente. Isso contrasta com [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"), que adiciona uma entrada à tabela `mysql.plugins` para fazer com que o plugin seja carregado em cada inicialização normal do servidor.

  Durante a sequência normal de inicialização, o servidor determina quais plugins carregar lendo a tabela de sistema `mysql.plugins`. Se o servidor for iniciado com a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables), os plugins registrados na tabela `mysql.plugins` não são carregados e ficam indisponíveis. [`--plugin-load`](server-options.html#option_mysqld_plugin-load) permite que plugins sejam carregados mesmo quando [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) é fornecido. [`--plugin-load`](server-options.html#option_mysqld_plugin-load) também permite que plugins sejam carregados na inicialização que não podem ser carregados em tempo de execução.

  Esta opção não define uma variável de sistema correspondente. A saída de [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela `PLUGINS` do Information Schema ([`INFORMATION_SCHEMA PLUGINS Table`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table")). Consulte a [Seção 5.5.2, “Obtendo Informações de Plugin do Servidor”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information").

  Para informações adicionais sobre carregamento de plugins, consulte a [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

* [`--plugin-load-add=plugin_list`](server-options.html#option_mysqld_plugin-load-add)

  <table frame="box" rules="all" summary="Properties for bootstrap"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bootstrap</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr></tbody></table>

  Esta opção complementa a opção [`--plugin-load`](server-options.html#option_mysqld_plugin-load). [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) adiciona um ou mais plugins ao conjunto de plugins a serem carregados na inicialização. O formato do argumento é o mesmo que para [`--plugin-load`](server-options.html#option_mysqld_plugin-load). [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) pode ser usado para evitar a especificação de um grande conjunto de plugins como um único argumento [`--plugin-load`](server-options.html#option_mysqld_plugin-load) longo e complicado.

  [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) pode ser fornecido na ausência de [`--plugin-load`](server-options.html#option_mysqld_plugin-load), mas qualquer instância de [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) que apareça antes de [`--plugin-load`](server-options.html#option_mysqld_plugin-load) não tem efeito, pois [`--plugin-load`](server-options.html#option_mysqld_plugin-load) redefine o conjunto de plugins a serem carregados. Em outras palavras, estas opções:

  ```sql
  --plugin-load=x --plugin-load-add=y
  ```

  são equivalentes a esta opção:

  ```sql
  --plugin-load="x;y"
  ```

  Mas estas opções:

  ```sql
  --plugin-load-add=y --plugin-load=x
  ```

  são equivalentes a esta opção:

  ```sql
  --plugin-load=x
  ```

  Esta opção não define uma variável de sistema correspondente. A saída de [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") fornece informações sobre os plugins carregados. Informações mais detalhadas podem ser encontradas na tabela `PLUGINS` do Information Schema ([`INFORMATION_SCHEMA PLUGINS Table`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table")). Consulte a [Seção 5.5.2, “Obtendo Informações de Plugin do Servidor”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information").

  Para informações adicionais sobre carregamento de plugins, consulte a [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

* [`--plugin-xxx`](server-options.html#option_mysqld_plugin-xxx)

  Especifica uma opção que pertence a um server plugin. Por exemplo, muitos storage engines podem ser construídos como plugins e, para tais engines, suas opções podem ser especificadas com um prefixo `--plugin`. Assim, a opção [`--innodb-file-per-table`](innodb-parameters.html#sysvar_innodb_file_per_table) para `InnoDB` pode ser especificada como [`--plugin-innodb-file-per-table`](innodb-parameters.html#sysvar_innodb_file_per_table).

  Para opções booleanas que podem ser habilitadas ou desabilitadas, o prefixo `--skip` e outros formatos alternativos também são suportados (consulte a [Seção 4.2.2.4, “Modificadores de Opção de Programa”](option-modifiers.html "4.2.2.4 Program Option Modifiers")). Por exemplo, [`--skip-plugin-innodb-file-per-table`](innodb-parameters.html#sysvar_innodb_file_per_table) desabilita [`innodb-file-per-table`](innodb-parameters.html#sysvar_innodb_file_per_table).

  A razão para o prefixo `--plugin` é que ele permite que as opções de plugin sejam especificadas sem ambiguidade se houver um conflito de nome com uma opção built-in do servidor. Por exemplo, se um desenvolvedor de plugin nomeasse um plugin de “sql” e implementasse uma opção “mode”, o nome da opção poderia ser [`--sql-mode`](server-options.html#option_mysqld_sql-mode), o que entraria em conflito com a opção built-in de mesmo nome. Nesses casos, as referências ao nome conflitante são resolvidas em favor da opção built-in. Para evitar a ambiguidade, os usuários podem especificar a opção de plugin como `--plugin-sql-mode`. O uso do prefixo `--plugin` para opções de plugin é recomendado para evitar qualquer questão de ambiguidade.

* [`--port=port_num`](server-options.html#option_mysqld_port), `-P port_num`

  <table frame="box" rules="all" summary="Properties for bootstrap"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bootstrap</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr></tbody></table>

  O port number a ser usado ao escutar por conexões TCP/IP. No Unix e sistemas Unix-like, o port number deve ser 1024 ou superior, a menos que o servidor seja iniciado pelo usuário `root` do sistema operacional. Definir esta opção como 0 faz com que o valor padrão seja usado.

* [`--port-open-timeout=num`](server-options.html#option_mysqld_port-open-timeout)

  <table frame="box" rules="all" summary="Properties for bootstrap"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bootstrap</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr></tbody></table>

  Em alguns sistemas, quando o servidor é parado, a porta TCP/IP pode não ficar disponível imediatamente. Se o servidor for reiniciado rapidamente em seguida, sua tentativa de reabrir a porta pode falhar. Esta opção indica quantos segundos o servidor deve esperar para que a porta TCP/IP fique livre, caso não possa ser aberta. O padrão é não esperar.

* [`--print-defaults`](server-options.html#option_mysqld_print-defaults)

  Imprime o nome do programa e todas as opções que ele obtém dos arquivos de opção. Os valores de Password são mascarados. Esta deve ser a primeira opção na linha de comando se for usada, exceto que pode ser usada imediatamente após [`--defaults-file`](server-options.html#option_mysqld_defaults-file) ou [`--defaults-extra-file`](server-options.html#option_mysqld_defaults-extra-file).

  Para informações adicionais sobre esta e outras opções de arquivo de opção, consulte a [Seção 4.2.2.3, “Opções de Linha de Comando que Afetam o Tratamento de Arquivos de Opção”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--remove [service_name]`](server-options.html#option_mysqld_remove)

  <table frame="box" rules="all" summary="Properties for bootstrap"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bootstrap</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr></tbody></table>

  (Apenas Windows) Remove um MySQL Windows service. O nome padrão do service é `MySQL` se nenhum valor *`service_name`* for fornecido. Para mais informações, consulte a [Seção 2.3.4.8, “Iniciando o MySQL como um Windows Service”](windows-start-service.html "2.3.4.8 Starting MySQL as a Windows Service").

* [`--safe-user-create`](server-options.html#option_mysqld_safe-user-create)

  <table frame="box" rules="all" summary="Properties for bootstrap"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bootstrap</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr></tbody></table>

  Se esta opção estiver habilitada, um usuário não pode criar novos usuários MySQL usando a instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), a menos que o usuário tenha o privilégio [`INSERT`](privileges-provided.html#priv_insert) para a tabela de sistema `mysql.user` ou qualquer coluna na tabela. Se você deseja que um usuário tenha a capacidade de criar novos usuários que tenham os privilégios que o usuário tem o direito de conceder, você deve conceder ao usuário o seguinte privilégio:

  ```sql
  GRANT INSERT(user) ON mysql.user TO 'user_name'@'host_name';
  ```

  Isso garante que o usuário não possa alterar diretamente nenhuma coluna de privilégio, mas tenha que usar a instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement") para conceder privilégios a outros usuários.

* [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables)

  <table frame="box" rules="all" summary="Properties for bootstrap"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bootstrap</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr></tbody></table>

  Esta opção afeta a sequência de inicialização do servidor:

  + [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) faz com que o servidor não leia as grant tables no `mysql` system database e, portanto, inicie sem usar o privilege system. Isso dá a qualquer pessoa com acesso ao servidor *acesso irrestrito a todos os Databases*.

    Para fazer com que um servidor iniciado com [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) carregue as grant tables em tempo de execução, execute uma operação de privilege-flushing, o que pode ser feito das seguintes maneiras:

    - Emita uma instrução MySQL [`FLUSH PRIVILEGES`](flush.html#flush-privileges) após conectar-se ao servidor.

    - Execute um comando [**mysqladmin flush-privileges**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") ou [**mysqladmin reload**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") a partir da linha de comando.

    O privilege flushing também pode ocorrer implicitamente como resultado de outras ações realizadas após a inicialização, fazendo com que o servidor comece a usar as grant tables. Por exemplo, [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") faz o Flush dos privilégios durante o procedimento de upgrade.

  + [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) faz com que o servidor não carregue certos outros objetos registrados no `mysql` system database:

    - Plugins instalados usando [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") e registrados na tabela de sistema `mysql.plugin`.

      Para fazer com que os plugins sejam carregados mesmo ao usar [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables), use a opção [`--plugin-load`](server-options.html#option_mysqld_plugin-load) ou [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

    - Eventos agendados instalados usando [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") e registrados na tabela de sistema `mysql.event`.

    - Funções carregáveis instaladas usando [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") e registradas na tabela de sistema `mysql.func`.

  + [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) faz com que a variável de sistema [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) não tenha efeito.

* [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache)

  <table frame="box" rules="all" summary="Properties for bootstrap"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--bootstrap</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr></tbody></table>

  Desativa o uso do host cache interno para uma resolução mais rápida de nome para IP. Com o cache desativado, o servidor realiza um DNS lookup toda vez que um cliente se conecta.

  O uso de [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache) é semelhante a definir a variável de sistema [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) para 0, mas [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) é mais flexível porque também pode ser usada para redimensionar, habilitar ou desabilitar o host cache em tempo de execução, não apenas na inicialização do servidor.

  Iniciar o servidor com [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache) não impede alterações em tempo de execução no valor de [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size), mas tais alterações não têm efeito e o cache não é reativado, mesmo que [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) seja definido como maior que 0.

  Para mais informações sobre como o host cache funciona, consulte a [Seção 5.1.11.2, “DNS Lookups e o Host Cache”](host-cache.html "5.1.11.2 DNS Lookups and the Host Cache").

* [`--skip-innodb`](innodb-parameters.html#option_mysqld_innodb)

  Desativa o storage engine `InnoDB`. Neste caso, como o default storage engine é [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), o servidor não pode iniciar a menos que você também use [`--default-storage-engine`](server-system-variables.html#sysvar_default_storage_engine) e [`--default-tmp-storage-engine`](server-system-variables.html#sysvar_default_tmp_storage_engine) para definir o padrão para algum outro engine para tabelas permanentes e `TEMPORARY`.

  O storage engine `InnoDB` não pode ser desativado, e a opção [`--skip-innodb`](innodb-parameters.html#option_mysqld_innodb) está descontinuada e não tem efeito. Seu uso resulta em um aviso. Espere que esta opção seja removida em uma versão futura do MySQL.

* [`--skip-new`](server-options.html#option_mysqld_skip-new)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta opção desativa comportamentos novos (o que costumava ser considerado) e possivelmente inseguros. Ela resulta nas seguintes configurações: [`delay_key_write=OFF`](server-system-variables.html#sysvar_delay_key_write), [`concurrent_insert=NEVER`](server-system-variables.html#sysvar_concurrent_insert), [`automatic_sp_privileges=OFF`](server-system-variables.html#sysvar_automatic_sp_privileges). Também faz com que [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") seja mapeado para [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") para storage engines para os quais [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") não é suportado.

* [`--skip-partition`](server-options.html#option_mysqld_skip-partition)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Desativa o user-defined partitioning. Tabelas particionadas podem ser vistas usando [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") ou consultando a tabela `TABLES` do Information Schema ([`INFORMATION_SCHEMA TABLES Table`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table")), mas não podem ser criadas ou modificadas, nem os dados em tais tabelas podem ser acessados. Todas as colunas específicas de partition na tabela `PARTITIONS` do Information Schema ([`INFORMATION_SCHEMA PARTITIONS Table`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table")) exibem `NULL`.

  Como [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") remove arquivos de definição de tabela (`.frm`), esta instrução funciona em tabelas particionadas mesmo quando o partitioning está desativado usando a opção. A instrução, no entanto, não remove as partition definitions associadas a tabelas particionadas em tais casos. Por esta razão, você deve evitar dropar tabelas particionadas com o partitioning desativado, ou tomar medidas para remover arquivos `.par` órfãos manualmente (se presentes).

  Note

  No MySQL 5.7, os arquivos de definição de partition (`.par`) não são mais criados para tabelas `InnoDB` particionadas. Em vez disso, as partition definitions são armazenadas no data dictionary interno do `InnoDB`. Os arquivos de definição de partition (`.par`) continuam a ser usados para tabelas `MyISAM` particionadas.

  Esta opção está descontinuada no MySQL 5.7.16 e é removida do MySQL 8.0 porque no MySQL 8.0, o partitioning engine é substituído por native partitioning, que não pode ser desativado.

* [`--skip-show-database`](server-options.html#option_mysqld_skip-show-database)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta opção define a variável de sistema [`skip_show_database`](server-system-variables.html#sysvar_skip_show_database) que controla quem tem permissão para usar a instrução [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement"). Consulte a [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Server System Variables").

* [`--skip-stack-trace`](server-options.html#option_mysqld_skip-stack-trace)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Não escreve stack traces. Esta opção é útil quando você está executando [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") sob um debugger. Em alguns sistemas, você também deve usar esta opção para obter um core file. Consulte a [Seção 5.8, “Debugging MySQL”](debugging-mysql.html "5.8 Debugging MySQL").

* [`--slow-start-timeout=timeout`](server-options.html#option_mysqld_slow-start-timeout)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta opção controla o timeout de inicialização do service do Windows service control manager. O valor é o número máximo de milissegundos que o service control manager espera antes de tentar encerrar o windows service durante a inicialização. O valor padrão é 15000 (15 segundos). Se o MySQL service demorar muito para iniciar, você pode precisar aumentar este valor. Um valor de 0 significa que não há timeout.

* [`--socket=path`](server-options.html#option_mysqld_socket)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  No Unix, esta opção especifica o Unix socket file a ser usado ao escutar por conexões locais. O valor padrão é `/tmp/mysql.sock`. Se esta opção for fornecida, o servidor cria o arquivo no data directory, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. No Windows, a opção especifica o pipe name a ser usado ao escutar por conexões locais que usam um named pipe. O valor padrão é `MySQL` (não é case-sensitive).

* [`--sql-mode=value[,value[,value...`](server-options.html#option_mysqld_sql-mode)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Define o SQL mode. Consulte a [Seção 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

  Note

  Os programas de instalação do MySQL podem configurar o SQL mode durante o processo de instalação. Se o SQL mode diferir do padrão ou do que você espera, verifique se há uma configuração em um arquivo de opção que o servidor lê na inicialização.

* [`--ssl`](server-options.html#option_mysqld_ssl), [`--skip-ssl`](server-options.html#option_mysqld_ssl)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  A opção [`--ssl`](server-options.html#option_mysqld_ssl) especifica que o servidor permite, mas não exige, conexões criptografadas. Esta opção está habilitada por padrão.

  [`--ssl`](server-options.html#option_mysqld_ssl) pode ser especificada em forma negada como [`--skip-ssl`](server-options.html#option_mysqld_ssl) ou um sinônimo ([`--ssl=OFF`](server-options.html#option_mysqld_ssl), [`--disable-ssl`](server-options.html#option_mysqld_ssl)). Neste caso, a opção especifica que o servidor *não* permite conexões criptografadas, independentemente das configurações das variáveis de sistema `tls_xxx` e `ssl_xxx`.

  Para mais informações sobre como configurar se o servidor permite que clientes se conectem usando SSL e como indicar onde encontrar chaves e certificados SSL, consulte a [Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections"), que também descreve os recursos do servidor para autogeração e autodescoberta de certificado e key file. Considere definir pelo menos as variáveis de sistema [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert) e [`ssl_key`](server-system-variables.html#sysvar_ssl_key) no lado do servidor e a opção [`--ssl-ca`](connection-options.html#option_general_ssl-ca) (ou [`--ssl-capath`](connection-options.html#option_general_ssl-capath)) no lado do cliente.

* [`--standalone`](server-options.html#option_mysqld_standalone)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Disponível apenas no Windows; instrui o MySQL server a não ser executado como um service.

* [`--super-large-pages`](server-options.html#option_mysqld_super-large-pages)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  O uso padrão de large pages no MySQL tenta usar o maior tamanho suportado, até 4MB. No Solaris, um recurso de “super large pages” permite o uso de pages de até 256MB. Este recurso está disponível para plataformas SPARC recentes. Ele pode ser habilitado ou desabilitado usando a opção [`--super-large-pages`](server-options.html#option_mysqld_super-large-pages) ou [`--skip-super-large-pages`](server-options.html#option_mysqld_super-large-pages).

* [`--symbolic-links`](server-options.html#option_mysqld_symbolic-links), [`--skip-symbolic-links`](server-options.html#option_mysqld_symbolic-links)

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr></tbody></table>

  Habilita ou desabilita o suporte a symbolic link. No Unix, habilitar symbolic links significa que você pode linkar um MyISAM index file ou data file para outro diretório com a opção `INDEX DIRECTORY` ou `DATA DIRECTORY` da instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). Se você deletar ou renomear a tabela, os arquivos para os quais seus symbolic links apontam também são deletados ou renomeados. Consulte a [Seção 8.12.3.2, “Usando Symbolic Links para Tabelas MyISAM no Unix”](symbolic-links-to-tables.html "8.12.3.2 Using Symbolic Links for MyISAM Tables on Unix").

  Esta opção não tem significado no Windows.

* [`--sysdate-is-now`](server-options.html#option_mysqld_sysdate-is-now)

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr></tbody></table>

  [`SYSDATE()`](date-and-time-functions.html#function_sysdate), por padrão, retorna a hora em que é executada, e não a hora em que a instrução em que ocorre começa a ser executada. Isso difere do comportamento de [`NOW()`](date-and-time-functions.html#function_now). Esta opção faz com que [`SYSDATE()`](date-and-time-functions.html#function_sysdate) seja um sinônimo para [`NOW()`](date-and-time-functions.html#function_now). Para obter informações sobre as implicações para binary logging e replication, consulte a descrição de [`SYSDATE()`](date-and-time-functions.html#function_sysdate) na [Seção 12.7, “Funções de Data e Hora”](date-and-time-functions.html "12.7 Date and Time Functions") e para `SET TIMESTAMP` na [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Server System Variables").

* [`--tc-heuristic-recover={COMMIT|ROLLBACK}`](server-options.html#option_mysqld_tc-heuristic-recover)

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr></tbody></table>

  A decisão a ser usada em uma manual heuristic recovery.

  Se uma opção `--tc-heuristic-recover` for especificada, o servidor sai, independentemente de a manual heuristic recovery ser bem-sucedida.

  Em sistemas com mais de um storage engine capaz de two-phase commit, a opção `ROLLBACK` não é segura e faz com que a recovery seja interrompida com o seguinte erro:

  ```sql
  [ERROR] --tc-heuristic-recover rollback
  strategy is not safe on systems with more than one 2-phase-commit-capable
  storage engine. Aborting crash recovery.
  ```

* [`--temp-pool`](server-options.html#option_mysqld_temp-pool)

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr></tbody></table>

  Esta opção é ignorada, exceto no Linux. No Linux, ela faz com que a maioria dos temporary files criados pelo servidor use um pequeno conjunto de nomes, em vez de um nome exclusivo para cada novo arquivo. Isso contorna um problema no kernel Linux ao lidar com a criação de muitos novos arquivos com nomes diferentes. Com o comportamento antigo, o Linux parece “vazar” memória, pois ela está sendo alocada para o cache de entrada de diretório em vez de para o disk cache.

  A partir do MySQL 5.7.18, esta opção está descontinuada e será removida no MySQL 8.0.

* [`--transaction-isolation=level`](server-options.html#option_mysqld_transaction-isolation)

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr></tbody></table>

  Define o transaction isolation level padrão. O valor `level` pode ser [`READ-UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted), [`READ-COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed), [`REPEATABLE-READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read) ou [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable). Consulte a [Seção 13.3.6, “Instrução SET TRANSACTION”](set-transaction.html "13.3.6 SET TRANSACTION Statement").

  O transaction isolation level padrão também pode ser definido em tempo de execução usando a instrução [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") ou definindo a variável de sistema [`tx_isolation`](server-system-variables.html#sysvar_tx_isolation) (ou, a partir do MySQL 5.7.20, [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation)).

* [`--transaction-read-only`](server-options.html#option_mysqld_transaction-read-only)

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr></tbody></table>

  Define o transaction access mode padrão. Por padrão, o read-only mode é desativado, então o mode é read/write.

  Para definir o transaction access mode padrão em tempo de execução, use a instrução [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") ou defina a variável de sistema [`tx_read_only`](server-system-variables.html#sysvar_tx_read_only) (ou, a partir do MySQL 5.7.20, [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only)). Consulte a [Seção 13.3.6, “Instrução SET TRANSACTION”](set-transaction.html "13.3.6 SET TRANSACTION Statement").

* [`--tmpdir=dir_name`](server-options.html#option_mysqld_tmpdir), `-t dir_name`

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr></tbody></table>

  O caminho do diretório a ser usado para criar temporary files. Pode ser útil se o seu diretório `/tmp` padrão residir em uma partition que é muito pequena para armazenar temporary tables. Esta opção aceita vários caminhos que são usados em rodízio (round-robin fashion). Os caminhos devem ser separados por caracteres de dois pontos (`:`) no Unix e caracteres de ponto e vírgula (`;`) no Windows.

  [`--tmpdir`](server-options.html#option_mysqld_tmpdir) pode ser um local não permanente, como um diretório em um file system baseado em memória ou um diretório que é limpo quando o host do servidor é reiniciado. Se o MySQL server estiver atuando como uma replica e você estiver usando um local não permanente para [`--tmpdir`](server-options.html#option_mysqld_tmpdir), considere definir um diretório temporário diferente para a replica usando a variável de sistema [`slave_load_tmpdir`](replication-options-replica.html#sysvar_slave_load_tmpdir). Para uma replication replica, os temporary files usados para replicar instruções [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") são armazenados neste diretório, então, com um local permanente, eles podem sobreviver a reinicializações da máquina, embora a replication possa agora continuar após um restart, mesmo que os temporary files tenham sido removidos.

  Para mais informações sobre o local de armazenamento de temporary files, consulte a [Seção B.3.3.5, “Onde o MySQL Armazena Temporary Files”](temporary-files.html "B.3.3.5 Where MySQL Stores Temporary Files").

* [`--user={user_name|user_id}`](server-options.html#option_mysqld_user), `-u {user_name|user_id}`

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr></tbody></table>

  Executa o servidor [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") como o usuário que tem o nome *`user_name`* ou o ID numérico do usuário *`user_id`*. (“Usuário” neste contexto refere-se a uma conta de login do sistema, não a um usuário MySQL listado nas grant tables.)

  Esta opção é *obrigatória* ao iniciar [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") como `root`. O servidor altera seu user ID durante sua sequência de inicialização, fazendo com que ele seja executado como esse usuário em particular, em vez de como `root`. Consulte a [Seção 6.1.1, “Diretrizes de Segurança”](security-guidelines.html "6.1.1 Security Guidelines").

  Para evitar uma possível security hole onde um usuário adiciona uma opção [`--user=root`](server-options.html#option_mysqld_user) a um arquivo `my.cnf` (fazendo com que o servidor seja executado como `root`), [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") usa apenas a primeira opção [`--user`](server-options.html#option_mysqld_user) especificada e produz um aviso se houver múltiplas opções [`--user`](server-options.html#option_mysqld_user). As opções em `/etc/my.cnf` e `$MYSQL_HOME/my.cnf` são processadas antes das opções de linha de comando, portanto, é recomendável que você coloque uma opção [`--user`](server-options.html#option_mysqld_user) em `/etc/my.cnf` e especifique um valor diferente de `root`. A opção em `/etc/my.cnf` é encontrada antes de quaisquer outras opções [`--user`](server-options.html#option_mysqld_user), o que garante que o servidor seja executado como um usuário diferente de `root` e que resulte em um aviso se qualquer outra opção [`--user`](server-options.html#option_mysqld_user) for encontrada.

* [`--validate-user-plugins[={OFF|ON}]`](server-options.html#option_mysqld_validate-user-plugins)

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de Diretório</td> </tr></tbody></table>

  Se esta opção estiver habilitada (o padrão), o servidor verifica cada conta de usuário e produz um aviso se forem encontradas condições que tornariam a conta inutilizável:

  + A conta requer um authentication plugin que não está carregado.

  + A conta requer o authentication plugin `sha256_password`, mas o servidor foi iniciado sem SSL nem RSA habilitados, conforme exigido por este plugin.

  A habilitação de [`--validate-user-plugins`](server-options.html#option_mysqld_validate-user-plugins) retarda a inicialização do servidor e o [`FLUSH PRIVILEGES`](flush.html#flush-privileges). Se você não precisar da verificação adicional, pode desativar esta opção na inicialização para evitar a diminuição de performance.

* [`--verbose`](server-options.html#option_mysqld_verbose), [`-v`](server-options.html#option_mysqld_verbose)

  Use esta opção com a opção [`--help`](server-options.html#option_mysqld_help) para obter ajuda detalhada.

* [`--version`](server-options.html#option_mysqld_version), `-V`

  Exibe as informações da versão e sai.