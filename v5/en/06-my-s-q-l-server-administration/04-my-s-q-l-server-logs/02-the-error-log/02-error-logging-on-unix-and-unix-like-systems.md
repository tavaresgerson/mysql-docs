#### 5.4.2.2 Log de Erros em Sistemas Unix e Semelhantes a Unix

Em sistemas Unix e semelhantes a Unix, o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") usa a opção [`--log-error`](server-options.html#option_mysqld_log-error) para determinar se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") grava o error log no console ou em um arquivo e, se for em um arquivo, qual é o nome desse arquivo:

* Se [`--log-error`](server-options.html#option_mysqld_log-error) não for fornecida, o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") grava o error log no console.

* Se [`--log-error`](server-options.html#option_mysqld_log-error) for fornecida sem nomear um arquivo, o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") grava o error log em um arquivo chamado `host_name.err` no data directory.

* Se [`--log-error`](server-options.html#option_mysqld_log-error) for fornecida para nomear um arquivo, o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") grava o error log nesse arquivo (com um sufixo `.err` adicionado se o nome não tiver sufixo). O local do arquivo fica sob o data directory, a menos que seja fornecido um nome de path absoluto para especificar um local diferente.

* Se [`--log-error`](server-options.html#option_mysqld_log-error) for fornecida em um arquivo de opção nas seções `[mysqld]`, `[server]` ou `[mysqld_safe]`, em sistemas que usam o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") para iniciar o server, o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") localiza e usa a opção, e a passa para o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

Nota

É comum que instalações de pacotes Yum ou APT configurem um local de arquivo de error log sob `/var/log` com uma opção como `log-error=/var/log/mysqld.log` em um arquivo de configuração do server. Remover o nome do path da opção faz com que o arquivo `host_name.err` no data directory seja usado.

Se o server gravar o error log no console, ele define a variável de sistema [`log_error`](server-system-variables.html#sysvar_log_error) como `stderr`. Caso contrário, o server grava o error log em um arquivo e define [`log_error`](server-system-variables.html#sysvar_log_error) como o nome do arquivo.