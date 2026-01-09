#### B.3.2.7 O servidor MySQL desapareceu

Esta seção também abrange o erro relacionado `Perda de conexão com o servidor durante a consulta`.

A razão mais comum para o erro "O servidor MySQL desapareceu" é que o servidor expirou o tempo limite e fechou a conexão. Nesse caso, você normalmente recebe um dos seguintes códigos de erro (o que você recebe depende do sistema operacional).

<table summary="Códigos de erro do servidor MySQL e uma descrição de cada código."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Código de erro</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><a class="ulink" href="/doc/mysql-errors/5.7/en/client-error-reference.html#error_cr_server_gone_error" target="_top">[[<code class="literal">CR_SERVER_GONE_ERROR</code>]]</a></td> <td>O cliente não conseguiu enviar uma pergunta ao servidor.</td> </tr><tr> <td><a class="ulink" href="/doc/mysql-errors/5.7/en/client-error-reference.html#error_cr_server_lost" target="_top">[[<code class="literal">CR_SERVER_LOST</code>]]</a></td> <td>O cliente não recebeu um erro ao escrever para o servidor, mas não recebeu uma resposta completa (ou nenhuma resposta) à pergunta.</td> </tr></tbody></table>

Por padrão, o servidor fecha a conexão após oito horas se nada acontecer. Você pode alterar o limite de tempo configurando a variável [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout) ao iniciar o [**mysqld**](mysqld.html). Veja [Seção 5.1.7, “Variáveis do Sistema do Servidor”](server-system-variables.html).

Se você tiver um script, basta emitir a consulta novamente para que o cliente faça uma reconexão automática. Isso pressupõe que você tenha a reconexão automática habilitada no cliente (o que é o padrão para o cliente de linha de comando `mysql`).

Algumas outras razões comuns para o erro "O servidor MySQL desapareceu" são:

- Você (ou o administrador do banco de dados) matou o thread em execução com uma declaração [`KILL`](kill.html) ou um comando [**mysqladmin kill**](mysqladmin.html).

- Você tentou executar uma consulta após fechar a conexão com o servidor. Isso indica um erro lógico na aplicação que deve ser corrigido.

- Um aplicativo cliente que está rodando em um host diferente não tem os privilégios necessários para se conectar ao servidor MySQL a partir desse host.

- Você recebeu um tempo de espera da conexão TCP/IP no lado do cliente. Isso pode acontecer se você tiver usado os comandos: [`mysql_options(..., MYSQL_OPT_READ_TIMEOUT,...)`](/doc/c-api/5.7/pt-BR/mysql-options.html) ou [`mysql_options(..., MYSQL_OPT_WRITE_TIMEOUT,...)`](/doc/c-api/5.7/pt-BR/mysql-options.html). Nesse caso, aumentar o tempo de espera pode ajudar a resolver o problema.

- Você encontrou um tempo de espera no lado do servidor e a reconexão automática no cliente está desativada (a bandeira `reconnect` na estrutura `MYSQL` é igual a 0).

- Você está usando um cliente do Windows e o servidor interrompeu a conexão (provavelmente porque o [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout) expirou) antes que o comando fosse emitido.

  O problema no Windows é que, em alguns casos, o MySQL não recebe um erro do sistema operacional ao escrever na conexão TCP/IP com o servidor, mas, em vez disso, recebe o erro ao tentar ler a resposta da conexão.

  A solução para isso é realizar uma consulta [`mysql_ping()`](/doc/c-api/5.7/pt-BR/mysql-ping.html) na conexão se há muito tempo desde a última consulta (isso é o que o Connector/ODBC faz) ou definir o valor de [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout) no servidor do [**mysqld**](mysqld.html) tão alto que ele nunca seja interrompido na prática.

- Você também pode receber esses erros se enviar uma consulta ao servidor que está incorreta ou muito grande. Se o [**mysqld**](mysqld.html) receber um pacote muito grande ou fora de ordem, ele assume que algo deu errado com o cliente e fecha a conexão. Se você precisar de consultas grandes (por exemplo, se estiver trabalhando com colunas grandes de [`BLOB`](blob.html), você pode aumentar o limite da consulta definindo a variável [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) do servidor, que tem um valor padrão de 4 MB. Você também pode precisar aumentar o tamanho máximo do pacote no cliente. Mais informações sobre como definir o tamanho do pacote estão disponíveis em [Seção B.3.2.8, “Pacote muito grande”](packet-too-large.html).

  Uma instrução [`INSERT`](insert.html) ou [`REPLACE`](replace.html) que insere muitas linhas também pode causar esse tipo de erro. Uma dessas instruções envia um único pedido ao servidor, independentemente do número de linhas a serem inseridas; assim, você pode evitar o erro reduzindo o número de linhas enviadas por [`INSERT`](insert.html) ou [`REPLACE`](replace.html).

- É também possível ver esse erro se as consultas de nome de host falharem (por exemplo, se o servidor DNS em que seu servidor ou rede depende falhar). Isso ocorre porque o MySQL depende do sistema de host para a resolução de nomes, mas não tem como saber se está funcionando — do ponto de vista do MySQL, o problema é indistinguível de qualquer outro tempo de espera de rede.

  Você também pode ver o erro "O servidor MySQL desapareceu" se o MySQL for iniciado com a variável de sistema [`skip_networking`](server-system-variables.html#sysvar_skip_networking) habilitada.

  Outro problema de rede que pode causar esse erro ocorre se a porta MySQL (padrão 3306) for bloqueada pelo seu firewall, impedindo assim qualquer conexão com o servidor MySQL.

- Você também pode encontrar esse erro em aplicativos que criam processos filhos, todos os quais tentam usar a mesma conexão com o servidor MySQL. Isso pode ser evitado usando uma conexão separada para cada processo filho.

- Você encontrou um erro em que o servidor morreu enquanto executava a consulta.

Você pode verificar se o servidor MySQL morreu e reiniciou executando [**mysqladmin versão**](mysqladmin.html) e examinando o tempo de atividade do servidor. Se a conexão do cliente foi interrompida porque o [**mysqld**](mysqld.html) travou e reiniciou, você deve se concentrar em encontrar a razão do travamento. Comece verificando se emitir a consulta novamente mata o servidor novamente. Veja [Seção B.3.3.3, “O que fazer se o MySQL continuar travando”](crashing.html).

Você pode obter mais informações sobre conexões perdidas iniciando [**mysqld**](mysqld.html) com a variável de sistema [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) definida como 3. Isso registra algumas das mensagens de desconexão no arquivo `hostname.err`. Veja [Seção 5.4.2, “O Log de Erros”](error-log.html).

Se você quiser criar um relatório de erro sobre esse problema, certifique-se de incluir as seguintes informações:

- Indique se o servidor MySQL morreu. Você pode encontrar informações sobre isso no log de erro do servidor. Veja [Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”](crashing.html).

- Se uma consulta específica matar [**mysqld**](mysqld.html) e as tabelas envolvidas foram verificadas com [`CHECK TABLE`](check-table.html) antes de você executar a consulta, você pode fornecer um caso de teste reproduzível? Veja [Seção 5.8, “Depuração do MySQL”](debugging-mysql.html).

- Qual é o valor da variável de sistema [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout) no servidor MySQL? ([**mysqladmin variables**](mysqladmin.html) fornece o valor desta variável.)

- Você tentou executar [**mysqld**](mysqld.html) com o log de consultas gerais habilitado para determinar se a consulta com o problema aparece no log? (Veja [Seção 5.4.3, “O Log de Consultas Gerais”](query-log.html).)

Veja também [Seção B.3.2.9, “Erros de Comunicação e Conexões Interrompidas”](communication-errors.html) e [Seção 1.5, “Como Relatar Bugs ou Problemas”](bug-reports.html).
