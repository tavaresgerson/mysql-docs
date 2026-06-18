#### B.3.2.7 O servidor MySQL desapareceu

Esta seção também abrange o erro relacionado `Lost connection to server during query`.

A razão mais comum para o erro `MySQL server has gone away` é que o servidor expirou o tempo de espera e fechou a conexão. Nesse caso, você normalmente recebe um dos seguintes códigos de erro (o que você recebe depende do sistema operacional).

<table summary="Códigos de erro do servidor MySQL e uma descrição de cada código."><thead><tr> <th>Código de erro</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[<code>CR_SERVER_GONE_ERROR</code>]]</td> <td>O cliente não conseguiu enviar uma pergunta ao servidor.</td> </tr><tr> <td>[[<code>CR_SERVER_LOST</code>]]</td> <td>O cliente não recebeu um erro ao escrever para o servidor, mas não recebeu uma resposta completa (ou nenhuma resposta) à pergunta.</td> </tr></tbody></table>

Por padrão, o servidor fecha a conexão após oito horas se nada acontecer. Você pode alterar o limite de tempo configurando a variável `wait_timeout` quando iniciar o **mysqld**. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

Se você tiver um script, basta emitir a consulta novamente para que o cliente faça uma reconexão automática. Isso pressupõe que você tenha a reconexão automática habilitada no cliente de linha de comando `mysql` (o que é o padrão para o cliente de linha de comando).

Outras razões comuns para o erro `MySQL server has gone away` são:

- Você (ou o administrador do banco de dados) matou o thread em execução com uma declaração `KILL` ou um comando **mysqladmin kill**.

- Você tentou executar uma consulta após fechar a conexão com o servidor. Isso indica um erro lógico na aplicação que deve ser corrigido.

- Um aplicativo cliente que está rodando em um host diferente não tem os privilégios necessários para se conectar ao servidor MySQL a partir desse host.

- Você recebeu um tempo de espera da conexão TCP/IP no lado do cliente. Isso pode acontecer se você tiver usado os comandos: `mysql_options(..., MYSQL_OPT_READ_TIMEOUT,...)` ou `mysql_options(..., MYSQL_OPT_WRITE_TIMEOUT,...)`. Nesse caso, aumentar o tempo de espera pode ajudar a resolver o problema.

- Você encontrou um tempo de espera no lado do servidor e a reconexão automática no cliente está desativada (a bandeira `reconnect` na estrutura `MYSQL` é igual a 0).

- Você está usando um cliente do Windows e o servidor interrompeu a conexão (provavelmente porque o `wait_timeout` expirou) antes que o comando fosse emitido.

  O problema no Windows é que, em alguns casos, o MySQL não recebe um erro do sistema operacional ao escrever na conexão TCP/IP com o servidor, mas, em vez disso, recebe o erro ao tentar ler a resposta da conexão.

  A solução para isso é realizar um `mysql_ping()` na conexão se há muito tempo desde a última consulta (isso é o que o Connector/ODBC faz) ou definir `wait_timeout` no servidor **mysqld** tão alto que, na prática, ele nunca expire.

- Você também pode receber esses erros se enviar uma consulta ao servidor que está incorreta ou muito grande. Se o **mysqld** receber um pacote muito grande ou fora de ordem, ele assume que algo deu errado com o cliente e fecha a conexão. Se você precisar de consultas grandes (por exemplo, se estiver trabalhando com colunas grandes de `BLOB`), você pode aumentar o limite da consulta definindo a variável `max_allowed_packet` do servidor, que tem um valor padrão de 64 MB. Você também pode precisar aumentar o tamanho máximo do pacote no cliente. Mais informações sobre a definição do tamanho do pacote estão no item B.3.2.8, “Pacote muito grande”.

  Uma declaração `INSERT` ou `REPLACE` que insere muitas linhas também pode causar esse tipo de erro. Uma dessas declarações envia um único pedido ao servidor, independentemente do número de linhas a serem inseridas; assim, você pode evitar o erro reduzindo o número de linhas enviadas por `INSERT` ou `REPLACE`.

- É também possível ver esse erro se as consultas de nome de host falharem (por exemplo, se o servidor DNS em que seu servidor ou rede depende falhar). Isso ocorre porque o MySQL depende do sistema de host para a resolução de nomes, mas não tem como saber se está funcionando — do ponto de vista do MySQL, o problema é indistinguível de qualquer outro tempo de espera de rede.

  Você também pode ver o erro `MySQL server has gone away` se o MySQL for iniciado com a variável de sistema `skip_networking` habilitada.

  Outro problema de rede que pode causar esse erro ocorre se a porta MySQL (padrão 3306) for bloqueada pelo seu firewall, impedindo assim qualquer conexão com o servidor MySQL.

- Você também pode encontrar esse erro em aplicativos que criam processos filhos, todos os quais tentam usar a mesma conexão com o servidor MySQL. Isso pode ser evitado usando uma conexão separada para cada processo filho.

- Você encontrou um erro em que o servidor morreu enquanto executava a consulta.

Você pode verificar se o servidor MySQL morreu e reiniciou executando **mysqladmin versão** e examinando o tempo de atividade do servidor. Se a conexão do cliente foi interrompida porque o **mysqld** travou e reiniciou, você deve se concentrar em encontrar a razão do travamento. Comece verificando se emitir a consulta novamente mata o servidor novamente. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar travando”.

Você pode obter mais informações sobre conexões perdidas iniciando o **mysqld** com a variável de sistema `log_error_verbosity` definida como 3. Isso registra algumas das mensagens de desconexão no arquivo `hostname.err`. Veja a Seção 7.4.2, “O Log de Erros”.

Se você quiser criar um relatório de erro sobre esse problema, certifique-se de incluir as seguintes informações:

- Indique se o servidor MySQL morreu. Você pode encontrar informações sobre isso no log de erro do servidor. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

- Se uma consulta específica matar o **mysqld** e as tabelas envolvidas foram verificadas com `CHECK TABLE` antes de você executar a consulta, você pode fornecer um caso de teste reproduzível? Veja a Seção 7.9, “Depuração do MySQL”.

- Qual é o valor da variável de sistema `wait_timeout` no servidor MySQL? (**mysqladmin variables** fornece o valor desta variável.)

- Você já tentou executar o **mysqld** com o log de consultas gerais habilitado para determinar se a consulta com o problema aparece no log? (Veja a Seção 7.4.3, “O Log de Consultas Gerais”.)

Veja também a Seção B.3.2.9, “Erros de Comunicação e Conexões Interrompidas”, e a Seção 1.5, “Como Relatar Bugs ou Problemas”.
