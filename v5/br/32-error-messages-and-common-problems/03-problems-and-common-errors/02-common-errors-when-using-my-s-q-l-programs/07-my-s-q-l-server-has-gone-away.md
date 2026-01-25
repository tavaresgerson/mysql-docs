#### B.3.2.7 MySQL server has gone away

Esta seção também aborda o erro relacionado `Lost connection to server during query`.

O motivo mais comum para o erro `MySQL server has gone away` é que o server atingiu o tempo limite (timed out) e fechou a conexão. Neste caso, você normalmente recebe um dos seguintes códigos de erro (qual você recebe depende do sistema operacional).

<table summary="Códigos de erro de MySQL server has gone away e uma descrição de cada código."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Código de Erro</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>CR_SERVER_GONE_ERROR</code></td> <td>O client não conseguiu enviar uma Query ao server.</td> </tr><tr> <td><code>CR_SERVER_LOST</code></td> <td>O client não recebeu um erro ao escrever no server, mas não obteve uma resposta completa (ou qualquer resposta) à Query.</td> </tr></tbody></table>

Por padrão, o server fecha a conexão após oito horas se nada tiver acontecido. Você pode alterar o limite de tempo configurando a variável [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout) ao iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Veja [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

Se você tem um script, você só precisa emitir a Query novamente para que o client realize uma reconexão automática. Isso pressupõe que você tenha a reconexão automática habilitada no client (o que é o padrão para o client de linha de comando `mysql`).

Outras razões comuns para o erro `MySQL server has gone away` incluem:

* Você (ou o administrador do Database) encerrou a Thread em execução com uma instrução [`KILL`](kill.html "13.7.6.4 KILL Statement") ou um comando [**mysqladmin kill**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").

* Você tentou executar uma Query após fechar a conexão com o server. Isso indica um erro de lógica na aplicação que deve ser corrigido.

* Uma aplicação client sendo executada em um host diferente não possui os privilégios necessários para se conectar ao MySQL server a partir desse host.

* Você recebeu um timeout da conexão TCP/IP no lado do client. Isso pode ocorrer se você estiver usando os comandos: [`mysql_options(..., MYSQL_OPT_READ_TIMEOUT,...)`](/doc/c-api/5.7/en/mysql-options.html) ou [`mysql_options(..., MYSQL_OPT_WRITE_TIMEOUT,...)`](/doc/c-api/5.7/en/mysql-options.html). Neste caso, aumentar o timeout pode ajudar a resolver o problema.

* Você encontrou um timeout no lado do server e a reconexão automática no client está desabilitada (o flag `reconnect` na estrutura `MYSQL` é igual a 0).

* Você está usando um client Windows e o server interrompeu a conexão (provavelmente porque [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout) expirou) antes que o comando fosse emitido.

  O problema no Windows é que, em alguns casos, o MySQL não recebe um erro do OS (Sistema Operacional) ao escrever para a conexão TCP/IP com o server, mas sim recebe o erro ao tentar ler a resposta da conexão.

  A solução para isso é realizar um [`mysql_ping()`](/doc/c-api/5.7/en/mysql-ping.html) na conexão se já tiver passado muito tempo desde a última Query (isso é o que o Connector/ODBC faz) ou definir [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout) no server [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") para um valor tão alto que, na prática, ele nunca atinja o tempo limite.

* Você também pode receber esses erros se enviar uma Query ao server que esteja incorreta ou seja muito grande. Se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") receber um pacote muito grande ou fora de ordem, ele assume que algo deu errado com o client e fecha a conexão. Se você precisar de Queries grandes (por exemplo, se estiver trabalhando com grandes colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")), você pode aumentar o limite da Query definindo a variável [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) do server, que tem um valor padrão de 4MB. Você também pode precisar aumentar o tamanho máximo do pacote no lado do client. Mais informações sobre como definir o tamanho do pacote são fornecidas na [Seção B.3.2.8, “Packet Too Large”](packet-too-large.html "B.3.2.8 Packet Too Large").

  Uma instrução [`INSERT`](insert.html "13.2.5 INSERT Statement") ou [`REPLACE`](replace.html "13.2.8 REPLACE Statement") que insere um grande número de linhas também pode causar esses tipos de erros. Ambas as instruções enviam uma única requisição ao server, independentemente do número de linhas a serem inseridas; portanto, você pode frequentemente evitar o erro reduzindo o número de linhas enviadas por [`INSERT`](insert.html "13.2.5 INSERT Statement") ou [`REPLACE`](replace.html "13.2.8 REPLACE Statement").

* Também é possível ver este erro se as pesquisas de nome de host falharem (por exemplo, se o server DNS do qual seu server ou rede depende cair). Isso ocorre porque o MySQL depende do sistema host para resolução de nomes, mas não tem como saber se isso está funcionando — do ponto de vista do MySQL, o problema é indistinguível de qualquer outro network timeout.

  Você também pode ver o erro `MySQL server has gone away` se o MySQL for iniciado com a variável de sistema [`skip_networking`](server-system-variables.html#sysvar_skip_networking) habilitada.

  Outro problema de rede que pode causar este erro ocorre se a porta MySQL (padrão 3306) estiver bloqueada pelo seu firewall, impedindo assim qualquer conexão com o MySQL server.

* Você também pode encontrar este erro com aplicações que criam processos filhos (fork child processes), todos os quais tentam usar a mesma conexão com o MySQL server. Isso pode ser evitado usando uma conexão separada para cada processo filho.

* Você encontrou um Bug onde o server parou enquanto executava a Query.

Você pode verificar se o MySQL server parou e reiniciou executando [**mysqladmin version**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") e examinando o tempo de atividade (uptime) do server. Se a conexão do client foi interrompida porque o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") travou e reiniciou, você deve se concentrar em encontrar a razão do travamento (crash). Comece verificando se a emissão da Query novamente trava o server novamente. Veja [Seção B.3.3.3, “What to Do If MySQL Keeps Crashing”](crashing.html "B.3.3.3 What to Do If MySQL Keeps Crashing").

Você pode obter mais informações sobre conexões perdidas iniciando o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com a variável de sistema [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) definida como 3. Isso registra algumas das mensagens de desconexão no arquivo `hostname.err`. Veja [Seção 5.4.2, “The Error Log”](error-log.html "5.4.2 The Error Log").

Se você deseja criar um relatório de Bug referente a este problema, certifique-se de incluir as seguintes informações:

* Indique se o MySQL server parou. Você pode encontrar informações sobre isso no log de erros do server. Veja [Seção B.3.3.3, “What to Do If MySQL Keeps Crashing”](crashing.html "B.3.3.3 What to Do If MySQL Keeps Crashing").

* Se uma Query específica travar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") e as Tables envolvidas foram verificadas com [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") antes de você executar a Query, você pode fornecer um caso de teste reproduzível? Veja [Seção 5.8, “Debugging MySQL”](debugging-mysql.html "5.8 Debugging MySQL").

* Qual é o valor da variável de sistema [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout) no MySQL server? ([**mysqladmin variables**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") fornece o valor desta variável.)

* Você tentou executar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com o General Query Log habilitado para determinar se a Query problemática aparece no log? (Veja [Seção 5.4.3, “The General Query Log”](query-log.html "5.4.3 The General Query Log").)

Veja também [Seção B.3.2.9, “Communication Errors and Aborted Connections”](communication-errors.html "B.3.2.9 Communication Errors and Aborted Connections"), e [Seção 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems").