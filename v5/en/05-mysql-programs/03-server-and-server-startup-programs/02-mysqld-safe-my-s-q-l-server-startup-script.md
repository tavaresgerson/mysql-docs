### 4.3.2 mysqld_safe — Script de Inicialização do Servidor MySQL

[**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") é a maneira recomendada de iniciar um servidor [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") no Unix. [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") adiciona alguns recursos de segurança, como reiniciar o servidor quando um erro ocorre e registrar informações de tempo de execução (runtime information) em um error log. Uma descrição do registro de erros é fornecida mais adiante nesta seção.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte a systemd para gerenciar a inicialização e o desligamento do servidor MySQL. Nessas plataformas, [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") não é instalado porque é desnecessário. Para mais informações, consulte [Section 2.5.10, “Managing MySQL Server with systemd”](using-systemd.html "2.5.10 Managing MySQL Server with systemd").

Uma implicação do não uso de [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") em plataformas que utilizam systemd para gerenciamento do servidor é que o uso das seções `[mysqld_safe]` ou `[safe_mysqld]` em option files não é suportado e pode levar a um comportamento inesperado.

[**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") tenta iniciar um executável chamado [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Para sobrescrever o comportamento padrão e especificar explicitamente o nome do servidor que você deseja executar, especifique uma opção [`--mysqld`](mysqld-safe.html#option_mysqld_safe_mysqld) ou [`--mysqld-version`](mysqld-safe.html#option_mysqld_safe_mysqld-version) para [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"). Você também pode usar [`--ledir`](mysqld-safe.html#option_mysqld_safe_ledir) para indicar o diretório onde [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") deve procurar pelo servidor.

Muitas das opções para [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") são as mesmas que as opções para [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Consulte [Section 5.1.6, “Server Command Options”](server-options.html "5.1.6 Server Command Options").

Opções desconhecidas para [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") são passadas para [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") se forem especificadas na command line, mas são ignoradas se forem especificadas no grupo `[mysqld_safe]` de um option file. Consulte [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files").

[**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") lê todas as opções das seções `[mysqld]`, `[server]` e `[mysqld_safe]` nos option files. Por exemplo, se você especificar uma seção `[mysqld]` como esta, [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") encontrará e usará a opção [`--log-error`](mysqld-safe.html#option_mysqld_safe_log-error):

```sql
[mysqld]
log-error=error.log
```

Para compatibilidade retroativa (backward compatibility), [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") também lê as seções `[safe_mysqld]`, mas para estar atualizado você deve renomear essas seções para `[mysqld_safe]`.

[**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") aceita opções na command line e em option files, conforme descrito na tabela a seguir. Para obter informações sobre option files usados por programas MySQL, consulte [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files").

**Table 4.6 Opções do mysqld_safe**

<table frame="box" rules="all" summary="Command-line options available for mysqld_safe."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> <th>Introduzido</th> <th>Obsoleto</th> </tr></thead><tbody><tr><th>--basedir</th> <td>Caminho para o diretório de instalação do MySQL</td> <td></td> <td></td> </tr><tr><th>--core-file-size</th> <td>Tamanho do core file que o mysqld deve ser capaz de criar</td> <td></td> <td></td> </tr><tr><th>--datadir</th> <td>Caminho para o data directory</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Lê o option file nomeado além dos option files usuais</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Lê apenas o option file nomeado</td> <td></td> <td></td> </tr><tr><th>--help</th> <td>Exibe a mensagem de ajuda e sai</td> <td></td> <td></td> </tr><tr><th>--ledir</th> <td>Caminho para o diretório onde o servidor está localizado</td> <td></td> <td></td> </tr><tr><th>--log-error</th> <td>Escreve o error log no arquivo nomeado</td> <td></td> <td></td> </tr><tr><th>--malloc-lib</th> <td>Biblioteca malloc alternativa a ser usada pelo mysqld</td> <td></td> <td></td> </tr><tr><th>--mysqld</th> <td>Nome do programa do servidor a ser iniciado (no diretório ledir)</td> <td></td> <td></td> </tr><tr><th>--mysqld-safe-log-timestamps</th> <td>Formato de timestamp para logging</td> <td>5.7.11</td> <td></td> </tr><tr><th>--mysqld-version</th> <td>Sufixo para o nome do programa do servidor</td> <td></td> <td></td> </tr><tr><th>--nice</th> <td>Usa o programa nice para definir a prioridade de scheduling do servidor</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Não lê option files</td> <td></td> <td></td> </tr><tr><th>--open-files-limit</th> <td>Número de files que o mysqld deve ser capaz de abrir</td> <td></td> <td></td> </tr><tr><th>--pid-file</th> <td>Path name do arquivo de ID de processo do servidor</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins estão instalados</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>Número da porta na qual escutar por conexões TCP/IP</td> <td></td> <td></td> </tr><tr><th>--skip-kill-mysqld</th> <td>Não tenta encerrar processos mysqld extraviados</td> <td></td> <td></td> </tr><tr><th>--skip-syslog</th> <td>Não escreve mensagens de erro no syslog; usa o arquivo de error log</td> <td></td> <td>Sim</td> </tr><tr><th>--socket</th> <td>Arquivo socket no qual escutar por conexões socket Unix</td> <td></td> <td></td> </tr><tr><th>--syslog</th> <td>Escreve mensagens de erro no syslog</td> <td></td> <td>Sim</td> </tr><tr><th>--syslog-tag</th> <td>Sufixo de tag para mensagens escritas no syslog</td> <td></td> <td>Sim</td> </tr><tr><th>--timezone</th> <td>Define a variável de ambiente de time zone TZ para o valor nomeado</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>Executa o mysqld como o user que tem o nome user_name ou ID de user numérico user_id</td> <td></td> <td></td> </tr> </tbody></table>

* [`--help`](mysqld-safe.html#option_mysqld_safe_help)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* [`--basedir=dir_name`](mysqld-safe.html#option_mysqld_safe_basedir)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  O caminho para o diretório de instalação do MySQL.

* [`--core-file-size=size`](mysqld-safe.html#option_mysqld_safe_core-file-size)

  <table frame="box" rules="all" summary="Properties for core-file-size"><tbody><tr><th>Command-Line Format</th> <td><code>--core-file-size=size</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  O tamanho do core file que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") deve ser capaz de criar. O valor da opção é passado para **ulimit -c**.

* [`--datadir=dir_name`](mysqld-safe.html#option_mysqld_safe_datadir)

  <table frame="box" rules="all" summary="Properties for datadir"><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  O caminho para o data directory.

* [`--defaults-extra-file=file_name`](mysqld-safe.html#option_mysqld_safe_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Lê este option file além dos option files usuais. Se o arquivo não existir ou for inacessível por outros motivos, o servidor sai com um erro. Se *`file_name`* não for um absolute path name, ele será interpretado em relação ao diretório atual. Esta deve ser a primeira opção na command line se for utilizada.

  Para informações adicionais sobre esta e outras opções de option file, consulte [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](mysqld-safe.html#option_mysqld_safe_defaults-file)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Usa apenas o option file fornecido. Se o arquivo não existir ou for inacessível por outros motivos, o servidor sai com um erro. Se *`file_name`* não for um absolute path name, ele será interpretado em relação ao diretório atual. Esta deve ser a primeira opção na command line se for utilizada.

  Para informações adicionais sobre esta e outras opções de option file, consulte [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--ledir=dir_name`](mysqld-safe.html#option_mysqld_safe_ledir)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Se [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") não conseguir encontrar o servidor, use esta opção para indicar o path name do diretório onde o servidor está localizado.

  A partir do MySQL 5.7.17, esta opção é aceita apenas na command line, e não em option files. Em plataformas que usam systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Consulte [Section 2.5.10, “Managing MySQL Server with systemd”](using-systemd.html "2.5.10 Managing MySQL Server with systemd").

* [`--log-error=file_name`](mysqld-safe.html#option_mysqld_safe_log-error)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Escreve o error log no arquivo fornecido. Consulte [Section 5.4.2, “The Error Log”](error-log.html "5.4.2 The Error Log").

* [`--mysqld-safe-log-timestamps`](mysqld-safe.html#option_mysqld_safe_mysqld-safe-log-timestamps)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Esta opção controla o formato dos timestamps na saída de log produzida por [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"). A lista a seguir descreve os valores permitidos. Para qualquer outro valor, [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") registra um warning e usa o formato `UTC`.

  + `UTC`, `utc`

    Formato ISO 8601 UTC (o mesmo que [`--log_timestamps=UTC`](server-system-variables.html#sysvar_log_timestamps) para o servidor). Este é o padrão.

  + `SYSTEM`, `system`

    Formato ISO 8601 de hora local (o mesmo que [`--log_timestamps=SYSTEM`](server-system-variables.html#sysvar_log_timestamps) para o servidor).

  + `HYPHEN`, `hyphen`

    Formato *`YY-MM-DD h:mm:ss`*, como em [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") para MySQL 5.6.

  + `LEGACY`, `legacy`

    Formato *`YYMMDD hh:mm:ss`*, como em [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") anterior ao MySQL 5.6.

  Esta opção foi adicionada no MySQL 5.7.11.

* [`--malloc-lib=[lib_name]`](mysqld-safe.html#option_mysqld_safe_malloc-lib)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  O nome da biblioteca a ser usada para alocação de memória em vez da biblioteca `malloc()` do sistema. A partir do MySQL 5.7.15, o valor da opção deve ser um dos diretórios `/usr/lib`, `/usr/lib64`, `/usr/lib/i386-linux-gnu` ou `/usr/lib/x86_64-linux-gnu`. Antes do MySQL 5.7.15, qualquer biblioteca poderia ser usada especificando seu path name, mas há uma forma de atalho para permitir o uso da biblioteca `tcmalloc` que é fornecida com as distribuições binárias do MySQL para Linux no MySQL 5.7. É possível que a forma de atalho não funcione em certas configurações, caso em que você deve especificar um path name em vez disso.

  Nota

  A partir do MySQL 5.7.13, as distribuições do MySQL não incluem mais uma biblioteca `tcmalloc`.

  A opção [`--malloc-lib`](mysqld-safe.html#option_mysqld_safe_malloc-lib) funciona modificando o valor do ambiente `LD_PRELOAD` para afetar a linkedição dinâmica, permitindo que o loader encontre a biblioteca de alocação de memória quando [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") é executado:

  + Se a opção não for fornecida, ou for fornecida sem um valor ([`--malloc-lib=`](mysqld-safe.html#option_mysqld_safe_malloc-lib)), `LD_PRELOAD` não é modificado e nenhuma tentativa é feita para usar `tcmalloc`.

  + Antes do MySQL 5.7.31, se a opção for fornecida como [`--malloc-lib=tcmalloc`](mysqld-safe.html#option_mysqld_safe_malloc-lib), [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") procura uma biblioteca `tcmalloc` em `/usr/lib` e depois no local `pkglibdir` do MySQL (por exemplo, `/usr/local/mysql/lib` ou o que for apropriado). Se `tmalloc` for encontrado, seu path name é adicionado ao início do valor `LD_PRELOAD` para [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Se `tcmalloc` não for encontrado, [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") é abortado com um erro.

    A partir do MySQL 5.7.31, `tcmalloc` não é um valor permitido para a opção [`--malloc-lib`](mysqld-safe.html#option_mysqld_safe_malloc-lib).

  + Se a opção for fornecida como [`--malloc-lib=/path/to/some/library`](mysqld-safe.html#option_mysqld_safe_malloc-lib), esse caminho completo é adicionado ao início do valor `LD_PRELOAD`. Se o caminho completo apontar para um arquivo inexistente ou ilegível, [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") é abortado com um erro.

  + Para os casos em que [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") adiciona um path name a `LD_PRELOAD`, ele adiciona o caminho ao início de qualquer valor existente que a variável já possua.

  Nota

  Em sistemas que gerenciam o servidor usando systemd, [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") não está disponível. Em vez disso, especifique a biblioteca de alocação configurando `LD_PRELOAD` em `/etc/sysconfig/mysql`.

  Usuários Linux podem usar o `libtcmalloc_minimal.so` incluído em pacotes binários adicionando estas linhas ao arquivo `my.cnf`:

  ```sql
  [mysqld_safe]
  malloc-lib=tcmalloc
  ```

  Essas linhas também são suficientes para usuários em qualquer plataforma que tenham instalado um pacote `tcmalloc` em `/usr/lib`. Para usar uma biblioteca `tcmalloc` específica, especifique seu full path name. Exemplo:

  ```sql
  [mysqld_safe]
  malloc-lib=/opt/lib/libtcmalloc_minimal.so
  ```

* [`--mysqld=prog_name`](mysqld-safe.html#option_mysqld_safe_mysqld)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  O nome do programa do servidor (no diretório `ledir`) que você deseja iniciar. Esta opção é necessária se você usar a distribuição binária do MySQL, mas tiver o data directory fora da distribuição binária. Se [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") não conseguir encontrar o servidor, use a opção [`--ledir`](mysqld-safe.html#option_mysqld_safe_ledir) para indicar o path name do diretório onde o servidor está localizado.

  A partir do MySQL 5.7.15, esta opção é aceita apenas na command line, e não em option files. Em plataformas que usam systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Consulte [Section 2.5.10, “Managing MySQL Server with systemd”](using-systemd.html "2.5.10 Managing MySQL Server with systemd").

* [`--mysqld-version=suffix`](mysqld-safe.html#option_mysqld_safe_mysqld-version)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Esta opção é semelhante à opção [`--mysqld`](mysqld-safe.html#option_mysqld_safe_mysqld), mas você especifica apenas o sufixo para o nome do programa do servidor. O nome base é assumido como sendo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Por exemplo, se você usar [`--mysqld-version=debug`](mysqld-safe.html#option_mysqld_safe_mysqld-version), [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") iniciará o programa [**mysqld-debug**](mysqld.html "4.3.1 mysqld — The MySQL Server") no diretório `ledir`. Se o argumento para [`--mysqld-version`](mysqld-safe.html#option_mysqld_safe_mysqld-version) estiver vazio, [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") usará [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") no diretório `ledir`.

  A partir do MySQL 5.7.15, esta opção é aceita apenas na command line, e não em option files. Em plataformas que usam systemd, o valor pode ser especificado no valor de `MYSQLD_OPTS`. Consulte [Section 2.5.10, “Managing MySQL Server with systemd”](using-systemd.html "2.5.10 Managing MySQL Server with systemd").

* [`--nice=priority`](mysqld-safe.html#option_mysqld_safe_nice)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Usa o programa `nice` para definir a prioridade de scheduling do servidor para o valor fornecido.

* [`--no-defaults`](mysqld-safe.html#option_mysqld_safe_no-defaults)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Não lê option files. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um option file, [`--no-defaults`](mysqld-safe.html#option_mysqld_safe_no-defaults) pode ser usado para evitar que sejam lidas. Esta deve ser a primeira opção na command line se for utilizada.

  Para informações adicionais sobre esta e outras opções de option file, consulte [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--open-files-limit=count`](mysqld-safe.html#option_mysqld_safe_open-files-limit)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  O número de files que [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") deve ser capaz de abrir. O valor da opção é passado para **ulimit -n**.

  Nota

  Você deve iniciar [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") como `root` para que isso funcione corretamente.

* [`--pid-file=file_name`](mysqld-safe.html#option_mysqld_safe_pid-file)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  O path name que [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") deve usar para seu arquivo de ID de processo (process ID file).

  Do MySQL 5.7.2 a 5.7.17, [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") tem seu próprio arquivo de ID de processo, que é sempre chamado `mysqld_safe.pid` e localizado no data directory do MySQL.

* [`--plugin-dir=dir_name`](mysqld-safe.html#option_mysqld_safe_plugin-dir)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  O path name do diretório de plugin.

* [`--port=port_num`](mysqld-safe.html#option_mysqld_safe_port)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  O número da porta que o servidor deve usar ao escutar por conexões TCP/IP. O número da porta deve ser 1024 ou superior, a menos que o servidor seja iniciado pelo user do sistema operacional `root`.

* [`--skip-kill-mysqld`](mysqld-safe.html#option_mysqld_safe_skip-kill-mysqld)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Não tenta encerrar processos [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") extraviados na inicialização. Esta opção funciona apenas no Linux.

* [`--socket=path`](mysqld-safe.html#option_mysqld_safe_socket)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  O arquivo socket Unix que o servidor deve usar ao escutar por conexões locais.

* [`--syslog`](mysqld-safe.html#option_mysqld_safe_syslog), [`--skip-syslog`](mysqld-safe.html#option_mysqld_safe_syslog)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  [`--syslog`](mysqld-safe.html#option_mysqld_safe_syslog) faz com que as mensagens de erro sejam enviadas para o `syslog` em sistemas que suportam o programa **logger**. `--skip-syslog` suprime o uso de `syslog`; as mensagens são escritas em um arquivo de error log.

  Quando `syslog` é usado para error logging, a facilidade/severidade `daemon.err` é usada para todas as mensagens de log.

  O uso dessas opções para controlar o logging de [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") é obsoleto a partir do MySQL 5.7.5. Use a variável de sistema do servidor [`log_syslog`](server-system-variables.html#sysvar_log_syslog) em vez disso. Para controlar a facilidade, use a variável de sistema do servidor [`log_syslog_facility`](server-system-variables.html#sysvar_log_syslog_facility). Consulte [Section 5.4.2.3, “Error Logging to the System Log”](error-log-syslog.html "5.4.2.3 Error Logging to the System Log").

* [`--syslog-tag=tag`](mysqld-safe.html#option_mysqld_safe_syslog-tag)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Para logging no `syslog`, as mensagens de [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") e [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") são escritas com identificadores de `mysqld_safe` e `mysqld`, respectivamente. Para especificar um sufixo para os identificadores, use [`--syslog-tag=tag`](mysqld-safe.html#option_mysqld_safe_syslog-tag), que modifica os identificadores para serem `mysqld_safe-tag` e `mysqld-tag`.

  O uso desta opção para controlar o logging de [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") é obsoleto a partir do MySQL 5.7.5. Use a variável de sistema do servidor [`log_syslog_tag`](server-system-variables.html#sysvar_log_syslog_tag) em vez disso. Consulte [Section 5.4.2.3, “Error Logging to the System Log”](error-log-syslog.html "5.4.2.3 Error Logging to the System Log").

* [`--timezone=timezone`](mysqld-safe.html#option_mysqld_safe_timezone)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Define a variável de ambiente de time zone `TZ` para o valor da opção fornecida. Consulte a documentação do seu sistema operacional para formatos de especificação de time zone válidos.

* [`--user={user_name|user_id}`](mysqld-safe.html#option_mysqld_safe_user)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  Executa o servidor [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") como o user que tem o nome *`user_name`* ou o ID de user numérico *`user_id`*. (O termo "User" neste contexto refere-se a uma conta de login do sistema, não a um user MySQL listado nas grant tables.)

Se você executar [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") com a opção [`--defaults-file`](mysqld-safe.html#option_mysqld_safe_defaults-file) ou [`--defaults-extra-file`](mysqld-safe.html#option_mysqld_safe_defaults-extra-file) para nomear um option file, a opção deve ser a primeira fornecida na command line, caso contrário, o option file não será usado. Por exemplo, este comando não usa o option file nomeado:

```sql
mysql> mysqld_safe --port=port_num --defaults-file=file_name
```

Em vez disso, use o seguinte comando:

```sql
mysql> mysqld_safe --defaults-file=file_name --port=port_num
```

O script [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") é escrito de modo que ele normalmente possa iniciar um servidor que foi instalado a partir de uma distribuição binária ou de código-fonte (source distribution) do MySQL, embora esses tipos de distribuições geralmente instalem o servidor em locais ligeiramente diferentes. (Consulte [Section 2.1.5, “Installation Layouts”](installation-layouts.html "2.1.5 Installation Layouts").) [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") espera que uma das seguintes condições seja verdadeira:

* O servidor e os databases podem ser encontrados em relação ao working directory (o diretório a partir do qual [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") é invocado). Para distribuições binárias, [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") procura por diretórios `bin` e `data` em seu working directory. Para distribuições de código-fonte, ele procura por diretórios `libexec` e `var`. Essa condição deve ser atendida se você executar [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") a partir do seu diretório de instalação do MySQL (por exemplo, `/usr/local/mysql` para uma distribuição binária).

* Se o servidor e os databases não puderem ser encontrados em relação ao working directory, [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") tentará localizá-los por absolute path names. Locais típicos são `/usr/local/libexec` e `/usr/local/var`. Os locais reais são determinados pelos valores configurados na distribuição no momento em que foi construída. Eles devem estar corretos se o MySQL estiver instalado no local especificado no momento da configuração.

Como [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") tenta encontrar o servidor e os databases em relação ao seu próprio working directory, você pode instalar uma distribuição binária do MySQL em qualquer lugar, contanto que você execute [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") a partir do diretório de instalação do MySQL:

```sql
cd mysql_installation_directory
bin/mysqld_safe &
```

Se [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") falhar, mesmo quando invocado a partir do diretório de instalação do MySQL, especifique as opções [`--ledir`](mysqld-safe.html#option_mysqld_safe_ledir) e [`--datadir`](mysqld-safe.html#option_mysqld_safe_datadir) para indicar os diretórios onde o servidor e os databases estão localizados no seu sistema.

[**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") tenta usar os utilitários de sistema **sleep** e **date** para determinar quantas vezes por segundo ele tentou iniciar. Se esses utilitários estiverem presentes e o número de tentativas de início por segundo for maior que 5, [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") espera 1 segundo completo antes de iniciar novamente. Isso visa prevenir o uso excessivo da CPU no caso de falhas repetidas. (Bug #11761530, Bug #54035)

Quando você usa [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") para iniciar [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") providencia que as mensagens de erro (e notice) dele mesmo e de [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") sejam direcionadas para o mesmo destino.

Existem várias opções de [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") para controlar o destino dessas mensagens:

* [`--log-error=file_name`](mysqld-safe.html#option_mysqld_safe_log-error): Escreve mensagens de erro no arquivo de erro nomeado.

* [`--syslog`](mysqld-safe.html#option_mysqld_safe_syslog): Escreve mensagens de erro no `syslog` em sistemas que suportam o programa **logger**.

* [`--skip-syslog`](mysqld-safe.html#option_mysqld_safe_syslog): Não escreve mensagens de erro no `syslog`. As mensagens são escritas no arquivo de error log padrão (`host_name.err` no data directory), ou em um arquivo nomeado se a opção [`--log-error`](mysqld-safe.html#option_mysqld_safe_log-error) for fornecida.

Se nenhuma dessas opções for fornecida, o padrão é [`--skip-syslog`](mysqld-safe.html#option_mysqld_safe_syslog).

Quando [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") escreve uma mensagem, as notices vão para o destino de logging (`syslog` ou o arquivo de error log) e `stdout`. Os erros vão para o destino de logging e `stderr`.

Nota

Controlar o logging de [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") a partir de [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") é obsoleto a partir do MySQL 5.7.5. Use o suporte nativo a `syslog` do servidor em vez disso. Para mais informações, consulte [Section 5.4.2.3, “Error Logging to the System Log”](error-log-syslog.html "5.4.2.3 Error Logging to the System Log").