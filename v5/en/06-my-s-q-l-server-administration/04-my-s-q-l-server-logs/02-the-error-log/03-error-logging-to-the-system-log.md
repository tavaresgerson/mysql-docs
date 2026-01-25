#### 5.4.2.3 Registro de Erros no System Log

É possível configurar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") para gravar o error log no system log (o Event Log no Windows, e `syslog` em sistemas Unix e similares a Unix). Para fazer isso, utilize estas system variables:

* [`log_syslog`](server-system-variables.html#sysvar_log_syslog): Habilite esta variável para enviar o error log para o system log. (No Windows, [`log_syslog`](server-system-variables.html#sysvar_log_syslog) é habilitada por padrão.)

  Se [`log_syslog`](server-system-variables.html#sysvar_log_syslog) estiver habilitada, as seguintes system variables também podem ser usadas para um controle mais refinado.

* [`log_syslog_facility`](server-system-variables.html#sysvar_log_syslog_facility): A facility padrão para mensagens `syslog` é `daemon`. Defina esta variável para especificar uma facility diferente.

* [`log_syslog_include_pid`](server-system-variables.html#sysvar_log_syslog_include_pid): Define se o ID do processo do servidor (PID) deve ser incluído em cada linha da saída do `syslog`.

* [`log_syslog_tag`](server-system-variables.html#sysvar_log_syslog_tag): Esta variável define uma tag a ser adicionada ao identificador do servidor (`mysqld`) nas mensagens do `syslog`. Se definida, a tag é anexada ao identificador com um hífen inicial.

Nota

O registro de erros (Error logging) no system log pode exigir configuração adicional do sistema. Consulte a documentação do system log para sua plataforma.

Em sistemas Unix e similares a Unix, o controle da saída para o `syslog` também está disponível usando [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"), que pode capturar a saída de erro do servidor e passá-la para o `syslog`.

Nota

O uso do [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") para registro de erros no `syslog` (error logging) está obsoleto (deprecated); você deve usar as system variables do servidor em vez disso.

[**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") possui três opções de registro de erros (error-logging): [`--syslog`](mysqld-safe.html#option_mysqld_safe_syslog), [`--skip-syslog`](mysqld-safe.html#option_mysqld_safe_syslog) e [`--log-error`](mysqld-safe.html#option_mysqld_safe_log-error). O padrão, sem opções de logging ou com [`--skip-syslog`](mysqld-safe.html#option_mysqld_safe_syslog), é usar o arquivo de log padrão. Para especificar explicitamente o uso de um arquivo de error log, especifique [`--log-error=file_name`](mysqld-safe.html#option_mysqld_safe_log-error) para o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"), que então providencia para que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") grave as mensagens em um arquivo de log. Para usar o `syslog`, especifique a opção [`--syslog`](mysqld-safe.html#option_mysqld_safe_syslog). Para a saída do `syslog`, uma tag pode ser especificada com [`--syslog-tag=tag_val`](mysqld-safe.html#option_mysqld_safe_syslog-tag); esta é anexada ao identificador do servidor `mysqld` com um hífen inicial.