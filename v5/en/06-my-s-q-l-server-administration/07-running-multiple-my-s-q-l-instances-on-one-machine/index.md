## 5.7 Executando Múltiplas Instâncias do MySQL em Uma Máquina

[5.7.1 Configurando Múltiplos Data Directories](multiple-data-directories.html)

[5.7.2 Executando Múltiplas Instâncias do MySQL no Windows](multiple-windows-servers.html)

[5.7.3 Executando Múltiplas Instâncias do MySQL no Unix](multiple-unix-servers.html)

[5.7.4 Usando Programas Client em um Ambiente de Múltiplos Servers](multiple-server-clients.html)

Em alguns casos, você pode querer executar múltiplas instâncias do MySQL em uma única máquina. Você pode querer testar um novo release do MySQL enquanto deixa uma configuração de produção existente inalterada. Ou você pode querer dar a usuários diferentes acesso a diferentes Servers [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") que eles mesmos gerenciam. (Por exemplo, você pode ser um Provedor de Serviços de Internet que deseja fornecer instalações independentes do MySQL para clientes diferentes.)

É possível usar um binário do MySQL Server diferente por instância, ou usar o mesmo binário para múltiplas instâncias, ou qualquer combinação das duas abordagens. Por exemplo, você pode executar um Server do MySQL 5.6 e um do MySQL 5.7, para ver como versões diferentes lidam com uma determinada workload. Ou você pode executar múltiplas instâncias da versão de produção atual, cada uma gerenciando um conjunto diferente de Databases.

Independentemente de você usar binários de Server distintos ou não, cada instância que você executa deve ser configurada com valores exclusivos para vários parâmetros operacionais. Isso elimina o potencial de conflito entre instâncias. Os parâmetros podem ser definidos na linha de comando, em option files ou configurando environment variables. Consulte [Section 4.2.2, “Specifying Program Options”](program-options.html "4.2.2 Specifying Program Options"). Para ver os valores usados por uma determinada instância, conecte-se a ela e execute uma instrução [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement").

O recurso primário gerenciado por uma instância do MySQL é o Data Directory. Cada instância deve usar um Data Directory diferente, cuja localização é especificada usando a opção [`--datadir=dir_name`](server-system-variables.html#sysvar_datadir). Para métodos de configuração de cada instância com seu próprio Data Directory, e advertências sobre os perigos de não fazê-lo, consulte [Section 5.7.1, “Setting Up Multiple Data Directories”](multiple-data-directories.html "5.7.1 Setting Up Multiple Data Directories").

Além de usar Data Directories diferentes, várias outras opções devem ter valores distintos para cada instância do Server:

* [`--port=port_num`](server-options.html#option_mysqld_port)

  [`--port`](server-options.html#option_mysqld_port) controla o número da port para conexões TCP/IP. Alternativamente, se o host tiver múltiplos endereços de rede, você pode definir a system variable [`bind_address`](server-system-variables.html#sysvar_bind_address) para fazer com que cada Server escute um endereço diferente.

* [`--socket={file_name|pipe_name}`](server-options.html#option_mysqld_socket)

  [`--socket`](server-options.html#option_mysqld_socket) controla o path do Unix socket file no Unix ou o nome do named-pipe no Windows. No Windows, é necessário especificar nomes de pipe distintos apenas para os Servers configurados para permitir conexões named-pipe.

* [`--shared-memory-base-name=name`](server-system-variables.html#sysvar_shared_memory_base_name)

  Esta opção é usada apenas no Windows. Ela designa o nome da shared-memory usado por um Server Windows para permitir que Clients se conectem usando shared memory. É necessário especificar nomes de shared-memory distintos apenas para os Servers configurados para permitir conexões shared-memory.

* [`--pid-file=file_name`](server-system-variables.html#sysvar_pid_file)

  Esta opção indica o path name do arquivo no qual o Server escreve seu ID de processo (process ID).

Se você usar as seguintes opções de log file, seus valores devem ser diferentes para cada Server:

* [`--general_log_file=file_name`](server-system-variables.html#sysvar_general_log_file)
* [`--log-bin[=file_name]`](replication-options-binary-log.html#option_mysqld_log-bin)
* [`--slow_query_log_file=file_name`](server-system-variables.html#sysvar_slow_query_log_file)
* [`--log-error[=file_name]`](server-options.html#option_mysqld_log-error)

Para mais discussões sobre opções de log file, consulte [Section 5.4, “MySQL Server Logs”](server-logs.html "5.4 MySQL Server Logs").

Para obter melhor performance, você pode especificar a seguinte opção de forma diferente para cada Server, para distribuir o load entre vários discos físicos:

* [`--tmpdir=dir_name`](server-options.html#option_mysqld_tmpdir)

Ter temporary directories diferentes também facilita a determinação de qual MySQL Server criou um determinado temporary file.

Se você tiver múltiplas instalações do MySQL em locais diferentes, você pode especificar o base directory para cada instalação com a opção [`--basedir=dir_name`](server-system-variables.html#sysvar_basedir). Isso faz com que cada instância use automaticamente um Data Directory, log files e PID file diferentes, pois o default para cada um desses parâmetros é relativo ao base directory. Nesse caso, as únicas outras opções que você precisa especificar são [`--socket`](server-options.html#option_mysqld_socket) e [`--port`](server-options.html#option_mysqld_port). Suponha que você instale diferentes versões do MySQL usando distribuições binárias de arquivos `tar`. Estas são instaladas em locais diferentes, então você pode iniciar o Server para cada instalação usando o comando **bin/mysqld_safe** sob o seu base directory correspondente. O [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") determina a opção [`--basedir`](server-system-variables.html#sysvar_basedir) apropriada para passar para o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), e você precisa especificar apenas as opções [`--socket`](mysqld-safe.html#option_mysqld_safe_socket) e [`--port`](mysqld-safe.html#option_mysqld_safe_port) para o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script").

Conforme discutido nas seções seguintes, é possível iniciar Servers adicionais especificando opções de comando apropriadas ou configurando environment variables. No entanto, se você precisar executar múltiplos Servers em uma base mais permanente, é mais conveniente usar option files para especificar, para cada Server, os valores de opção que devem ser exclusivos para ele. A opção [`--defaults-file`](option-file-options.html#option_general_defaults-file) é útil para este propósito.