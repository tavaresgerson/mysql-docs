## 27.4 Usando o Cronograma de Eventos

O Cronograma de Eventos do MySQL gerencia a programação e a execução de eventos, ou seja, tarefas que são executadas de acordo com um cronograma. A discussão a seguir aborda o Cronograma de Eventos e é dividida nas seguintes seções:

* A Seção 27.4.1, “Visão Geral do Cronômetro de Eventos”, fornece uma introdução e uma visão conceitual dos Eventos do MySQL.

* A Seção 27.4.3, “Sintaxe de Eventos”, discute as declarações SQL para criar, alterar e descartar Eventos MySQL.

* A seção 27.4.4, “Metadados do evento”, mostra como obter informações sobre eventos e como essas informações são armazenadas pelo MySQL Server.

* A seção 27.4.6, “O Cronômetro de Eventos e os Privilegios do MySQL”, discute os privilégios necessários para trabalhar com eventos e as ramificações que os eventos têm em relação aos privilégios ao serem executados.

As rotinas armazenadas exigem a tabela do dicionário de dados `events` no banco de dados do sistema `mysql`. Esta tabela é criada durante o procedimento de instalação do MySQL 8.0. Se você estiver atualizando para o MySQL 8.0 a partir de uma versão anterior, certifique-se de realizar o procedimento de atualização para garantir que o banco de dados do seu sistema esteja atualizado. Veja o Capítulo 3, *Atualizando o MySQL*.

### Recursos adicionais

* Há algumas restrições sobre o uso de eventos; veja a Seção 27.8, “Restrições sobre programas armazenados”.

* O registro binário para eventos ocorre conforme descrito na Seção 27.7, “Registro binário de programas armazenados”.

* Você também pode achar útil o [Fórum de Usuários do MySQL][(https://forums.mysql.com/list.php?20)].

### 27.4.1 Visão geral do Cronograma de Eventos

Os eventos do MySQL são tarefas que são executadas de acordo com um cronograma. Por isso, às vezes os chamamos de eventos *programados*. Ao criar um evento, você está criando um objeto de banco de dados com um nome que contém uma ou mais instruções SQL a serem executadas em um ou mais intervalos regulares, começando e terminando em uma data e hora específicas. Conceitualmente, isso é semelhante à ideia do Unix `crontab` (também conhecido como "cron job") ou ao Gerenciador de Tarefas do Windows.

As tarefas agendadas desse tipo também são, às vezes, conhecidas como “interruptores temporais”, o que implica que esses são objetos que são acionados pela passagem do tempo. Embora isso seja essencialmente correto, preferimos usar o termo *eventos* para evitar confusão com interruptores do tipo discutido na Seção 27.3, “Usando interruptores”. Os eventos não devem ser confundidos mais especificamente com “interruptores temporários”. Enquanto um interruptor é um objeto de banco de dados cujas declarações são executadas em resposta a um tipo específico de evento que ocorre em uma determinada tabela, um (agendado) evento é um objeto cujas declarações são executadas em resposta à passagem de um intervalo de tempo especificado.

Embora não haja disposição no Padrão SQL para agendamento de eventos, há precedentes em outros sistemas de banco de dados, e você pode notar algumas semelhanças entre essas implementações e as encontradas no MySQL Server.

Os eventos do MySQL possuem as seguintes características e propriedades principais:

* Em MySQL, um evento é identificado de forma única por seu nome e pelo esquema ao qual ele é atribuído.

* Um evento realiza uma ação específica de acordo com um cronograma. Essa ação consiste em uma declaração SQL, que pode ser uma declaração composta em um bloco `BEGIN ... END`(begin-end.html "15.6.1 BEGIN ... END Compound Statement") se desejado (veja Seção 15.6, “Sintaxe de Declaração Composta”). O cronograma de um evento pode ser único ou recorrente. Um evento único é executado apenas uma vez. Um evento recorrente repete sua ação em um intervalo regular, e o cronograma de um evento recorrente pode ser atribuído um dia e hora específicos de início, dia e hora de término, ambos ou nenhum deles. (Por padrão, o cronograma de um evento recorrente começa assim que é criado e continua indefinidamente, até que seja desativado ou excluído.)

Se um evento repetitivo não terminar dentro do seu intervalo de programação, o resultado pode ser várias instâncias do evento executando simultaneamente. Se isso não for desejado, você deve instituir um mecanismo para impedir instâncias simultâneas. Por exemplo, você pode usar a função `GET_LOCK()` ou o bloqueio de linha ou tabela.

* Os usuários podem criar, modificar e excluir eventos agendados usando instruções SQL destinadas a esses fins. As instruções de criação e modificação de eventos sintaticamente inválidas falham com uma mensagem de erro apropriada. * Um usuário pode incluir instruções na ação de um evento que exigem privilégios que o usuário não possui realmente. A declaração de criação ou modificação do evento é bem-sucedida, mas a ação do evento falha. Veja a Seção 27.4.6, “O Agendamento de Eventos e Privilégios MySQL” para detalhes.

* Muitas das propriedades de um evento podem ser definidas ou modificadas usando instruções SQL. Essas propriedades incluem o nome do evento, o momento, a persistência (ou seja, se é preservado após a expiração do seu cronograma), o status (ativado ou desativado), a ação a ser realizada e o esquema ao qual é atribuído. Veja a Seção 15.1.3, “Instrução ALTER EVENT”.

O definidor padrão de um evento é o usuário que criou o evento, a menos que o evento tenha sido alterado, nesse caso, o definidor é o usuário que emitiu a última declaração `ALTER EVENT` que afeta esse evento. Um evento pode ser modificado por qualquer usuário que tenha o privilégio `EVENT` no banco de dados para o qual o evento é definido. Veja a Seção 27.4.6, “O Cronômetro de Eventos e os Privilégios do MySQL”.

* A declaração de ação de um evento pode incluir a maioria das declarações SQL permitidas dentro de rotinas armazenadas. Para restrições, consulte a Seção 27.8, “Restrições em programas armazenados”.

### 27.4.2 Configuração do Cronograma de Eventos

Os eventos são executados por um fio especial do cronograma de eventos; quando nos referimos ao Cronograma de Eventos, na verdade, referimo-nos a este fio. Quando em execução, o fio do cronograma de eventos e seu estado atual podem ser vistos por usuários que possuem o privilégio `PROCESS` na saída de `SHOW PROCESSLIST`, conforme mostrado na discussão que segue.

A variável de sistema global `event_scheduler` determina se o Agendamento de Eventos está habilitado e em execução no servidor. Ela tem um dos seguintes valores, que afetam o agendamento de eventos conforme descrito:

* `ON`: O Agendamento de Eventos é iniciado; o fio do agendamento de eventos é executado e executa todos os eventos agendados. `ON` é o valor padrão de `event_scheduler`.

Quando o Agendamento de Eventos é `ON`, o fio do agendamento de eventos é listado na saída de `SHOW PROCESSLIST` como um processo de daemon, e seu estado é representado como mostrado aqui:

  ```
  mysql> SHOW PROCESSLIST\G
  *************************** 1. row ***************************
       Id: 1
     User: root
     Host: localhost
       db: NULL
  Command: Query
     Time: 0
    State: NULL
     Info: show processlist
  *************************** 2. row ***************************
       Id: 2
     User: event_scheduler
     Host: localhost
       db: NULL
  Command: Daemon
     Time: 3
    State: Waiting for next activation
     Info: NULL
  2 rows in set (0.00 sec)
  ```

O agendamento de eventos pode ser interrompido ao definir o valor de `event_scheduler` para `OFF`.

* `OFF`: O Agendamento de Eventos está parado. O fio do agendamento de eventos não é executado, não é mostrado na saída de `SHOW PROCESSLIST`, e nenhum evento agendado é executado.

Quando o Agendamento de Eventos é interrompido (`event_scheduler` é `OFF`), ele pode ser iniciado definindo o valor de `event_scheduler` para `ON`. (Veja o próximo item.)

* `DISABLED`: Esse valor torna o Agendamento de Eventos inoperante. Quando o Agendamento de Eventos está em `DISABLED`, o fio do agendamento de eventos não é executado (e, portanto, não aparece na saída de `SHOW PROCESSLIST`). Além disso, o estado do Agendamento de Eventos não pode ser alterado em tempo real.

Se o status do Agendamento de Eventos não tiver sido definido como `DISABLED`, o `event_scheduler` pode ser alternado entre `ON` e `OFF` (usando `SET`). Também é possível usar `0` para `OFF` e `1` para `ON` ao definir essa variável. Assim, qualquer uma das seguintes 4 declarações pode ser usada no cliente **mysql** para ativar o Agendamento de Eventos:

```
SET GLOBAL event_scheduler = ON;
SET @@GLOBAL.event_scheduler = ON;
SET GLOBAL event_scheduler = 1;
SET @@GLOBAL.event_scheduler = 1;
```

Da mesma forma, qualquer uma dessas 4 declarações pode ser usada para desativar o Agendamento de Eventos:

```
SET GLOBAL event_scheduler = OFF;
SET @@GLOBAL.event_scheduler = OFF;
SET GLOBAL event_scheduler = 0;
SET @@GLOBAL.event_scheduler = 0;
```

Nota

Se o Agendamento de Eventos estiver habilitado, habilitar a variável de sistema `super_read_only` impede que ela atualize os timestamps de “última execução” do evento no `events` tabela do dicionário de dados. Isso faz com que o Agendamento de Eventos pare a próxima vez que ele tentar executar um evento agendado, após escrever uma mensagem no log de erro do servidor. (Nessa situação, a variável `event_scheduler` não muda de `ON` para `OFF`. Uma implicação é que essa variável rejeita a intenção do DBA de que o Agendamento de Eventos seja habilitado ou desabilitado, onde seu status real de iniciado ou parado pode ser distinto). Se `super_read_only` for posteriormente desabilitado após ser habilitado, o servidor reinicia automaticamente o Agendamento de Eventos conforme necessário, a partir do MySQL 8.0.26. Antes do MySQL 8.0.26, é necessário reiniciar manualmente o Agendamento de Eventos habilitando-o novamente.

Embora `ON` e `OFF` tenham equivalentes numéricos, o valor exibido para `event_scheduler` por `SELECT` ou [`SHOW VARIABLES`](show-variables.html "15.7.7.41 SHOW VARIABLES Statement") é sempre um dos `OFF`, `ON` ou `DISABLED`. *`DISABLED` não tem equivalente numérico*. Por essa razão, `ON` e `OFF` são geralmente preferidos em relação a `1` e `0` ao definir essa variável.

Observe que tentar definir `event_scheduler` sem especificá-lo como uma variável global causa um erro:

```
mysql< SET @@event_scheduler = OFF;
ERROR 1229 (HY000): Variable 'event_scheduler' is a GLOBAL
variable and should be set with SET GLOBAL
```

Importante

É possível configurar o Agendamento de Eventos para `DISABLED` apenas na inicialização do servidor. Se `event_scheduler` for `ON` ou `OFF`, não é possível configurá-lo para `DISABLED` no runtime. Além disso, se o Agendamento de Eventos estiver configurado para `DISABLED` na inicialização, não é possível alterar o valor de `event_scheduler` no runtime.

Para desativar o cronograma de eventos, use um dos dois métodos a seguir:

* Como opção de linha de comando ao iniciar o servidor:

  ```
  --event-scheduler=DISABLED
  ```

* No arquivo de configuração do servidor (`my.cnf`, ou `my.ini` em sistemas Windows), inclua a linha onde ela pode ser lida pelo servidor (por exemplo, em uma seção `[mysqld]`):

  ```
  event_scheduler=DISABLED
  ```

Para habilitar o Agendamento de Eventos, reinicie o servidor sem a opção de linha de comando `--event-scheduler=DISABLED`, ou após remover ou comentar a linha que contém `event-scheduler=DISABLED` no arquivo de configuração do servidor, conforme apropriado. Alternativamente, você pode usar `ON` (ou `1`) ou `OFF` (ou `0`) no lugar do valor `DISABLED` ao iniciar o servidor.

Nota

Você pode emitir declarações de manipulação de eventos quando `event_scheduler` está definido como `DISABLED`. Não são gerados avisos ou erros em tais casos (desde que as próprias declarações sejam válidas). No entanto, os eventos agendados não podem ser executados até que essa variável seja definida como `ON` (ou `1`). Uma vez que isso tenha sido feito, o fio do cronômetro de eventos executa todos os eventos cujas condições de agendamento são satisfeitas.

Iniciar o servidor MySQL com a opção `--skip-grant-tables` faz com que `event_scheduler` seja definido como `DISABLED`, substituindo qualquer outro valor definido na linha de comando ou no arquivo `my.cnf` ou `my.ini` (Bug #26807).

Para declarações SQL usadas para criar, alterar e descartar eventos, consulte a Seção 27.4.3, “Sintaxe de evento”.

O MySQL fornece uma tabela `EVENTS` no banco de dados `INFORMATION_SCHEMA`. Essa tabela pode ser consultada para obter informações sobre eventos agendados que foram definidos no servidor. Consulte a Seção 27.4.4, “Metadados do Evento”, e a Seção 28.3.14, “A Tabela INFORMATION_SCHEMA EVENTS”, para obter mais informações.

Para informações sobre a programação de eventos e o sistema de privilégios do MySQL, consulte a Seção 27.4.6, “O Cronômetro de Eventos e os Privilegios do MySQL”.

### 27.4.3 Sintaxe de Evento

O MySQL oferece vários comandos SQL para trabalhar com eventos agendados:

* Novos eventos são definidos usando a declaração `CREATE EVENT`(create-event.html "15.1.13 CREATE EVENT Statement"). Veja a Seção 15.1.13, “Declaração CREATE EVENT”.

* A definição de um evento existente pode ser alterada por meio da declaração `ALTER EVENT`. Veja a Seção 15.1.3, “Declaração ALTER EVENT”.

* Quando um evento agendado não é mais desejado ou necessário, ele pode ser excluído do servidor pelo seu definidor usando a declaração `DROP EVENT`. Veja a Seção 15.1.25, “Declaração DROP EVENT”. Se um evento persistir após o término de sua agenda, isso também depende de sua cláusula `ON COMPLETION`, se tiver uma. Veja a Seção 15.1.13, “Declaração CREATE EVENT”.

Um evento pode ser excluído por qualquer usuário que tenha o privilégio `EVENT` para o banco de dados no qual o evento está definido. Veja a Seção 27.4.6, “O Cronômetro de Eventos e os Privilegios do MySQL”.

### 27.4.4 Metadados do evento

Para obter metadados sobre eventos:

* Consulte a tabela `EVENTS` do banco de dados `INFORMATION_SCHEMA`. Veja a Seção 28.3.14, “A tabela de eventos do INFORMATION_SCHEMA”.

* Utilize a declaração `SHOW CREATE EVENT`. Veja a Seção 15.7.7.7, “Declaração SHOW CREATE EVENT”.

* Utilize a declaração `SHOW EVENTS`. Veja a Seção 15.7.7.18, “Declaração SHOW EVENTS”.

**Representação do horário do cronograma de eventos**

Cada sessão no MySQL tem um fuso horário de sessão (STZ). Esse é o valor `time_zone` da sessão que é inicializado a partir do valor global do servidor `time_zone` quando a sessão começa, mas pode ser alterado durante a sessão.

O fuso horário da sessão que está em vigor quando uma declaração `CREATE EVENT` ou `ALTER EVENT` é executada é usado para interpretar os horários especificados na definição do evento. Isso se torna o fuso horário do evento (ETZ); ou seja, o fuso horário que é usado para a programação do evento e que está em vigor dentro do evento conforme ele é executado.

Para a representação das informações do evento no dicionário de dados, os horários `execute_at`, `starts` e `ends` são convertidos para UTC e armazenados juntamente com o fuso horário do evento. Isso permite que a execução do evento prossiga conforme definido, independentemente de quaisquer alterações subsequentes no fuso horário do servidor ou efeitos do horário de verão. O horário `last_executed` também é armazenado em UTC.

Os horários dos eventos podem ser obtidos selecionando a tabela do esquema de informações `EVENTS` ou a partir de `SHOW EVENTS`, mas são reportados como valores ETZ ou STZ. O quadro a seguir resume a representação dos horários dos eventos.

<table summary="Summary of event time representation (as UTC, EZT, or STZ values) from INFORMATION_SCHEMA.EVENTS, and SHOW EVENTS."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">Value</th> <th scope="col"><code>EVENTS</code> Table</th> <th scope="col"><code>SHOW EVENTS</code></th> </tr></thead><tbody><tr> <th scope="row">Execute at</th> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th scope="row">Starts</th> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th scope="row">Ends</th> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th scope="row">Last executed</th> <td>ETZ</td> <td>n/a</td> </tr><tr> <th scope="row">Created</th> <td>STZ</td> <td>n/a</td> </tr><tr> <th scope="row">Last altered</th> <td>STZ</td> <td>n/a</td> </tr></tbody></table>

### 27.4.5 Status do Cronômetro de Eventos

O Agendamento de Eventos escreve informações sobre a execução de eventos que terminam com um erro ou aviso no log de erro do servidor MySQL. Consulte a Seção 27.4.6, “O Agendamento de Eventos e os Privilegios do MySQL”, para um exemplo.

Para obter informações sobre o estado do Agendamento de Eventos para fins de depuração e solução de problemas, execute [**mysqladmin debug**][(mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program")] (consulte Seção 6.5.2, “mysqladmin — Um programa de administração do servidor MySQL”); após executar este comando, o log de erro do servidor contém saída relacionada ao Agendamento de Eventos, semelhante ao que é mostrado aqui:

```
Events status:
LLA = Last Locked At  LUA = Last Unlocked At
WOC = Waiting On Condition  DL = Data Locked

Event scheduler status:
State      : INITIALIZED
Thread id  : 0
LLA        : n/a:0
LUA        : n/a:0
WOC        : NO
Workers    : 0
Executed   : 0
Data locked: NO

Event queue status:
Element count   : 0
Data locked     : NO
Attempting lock : NO
LLA             : init_queue:95
LUA             : init_queue:103
WOC             : NO
Next activation : never
```

Em declarações que ocorrem como parte de eventos executados pelo Cronômetro de Eventos, mensagens de diagnóstico (não apenas erros, mas também avisos) são escritas no log de erro e, no Windows, no log de eventos da aplicação. Para eventos executados com frequência, isso pode resultar em muitas mensagens registradas. Por exemplo, para declarações de `SELECT ... INTO var_list`, se a consulta não retornar nenhuma linha, ocorre um aviso com o código de erro 1329 (`No data`) e os valores das variáveis permanecem inalterados. Se a consulta retornar várias linhas, ocorre o erro 1172 (`Result consisted of more than one row`). Para qualquer uma dessas condições, é possível evitar que os avisos sejam registrados ao declarar um manipulador de condição; veja Seção 15.6.7.2, “Declaração ... HANDLER”. Para declarações que podem recuperar várias linhas, outra estratégia é usar `LIMIT 1` para limitar o conjunto de resultados a uma única linha.

### 27.4.6 O Cronograma de Eventos e os Privilegios do MySQL

Para habilitar ou desabilitar a execução de eventos agendados, é necessário definir o valor da variável de sistema global `event_scheduler`. Isso requer privilégios suficientes para definir variáveis de sistema globais. Veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

O privilégio `EVENT` rege a criação, modificação e exclusão de eventos. Este privilégio pode ser concedido usando `GRANT`. Por exemplo, esta declaração `GRANT` confere o privilégio `EVENT` para o esquema denominado `myschema` sobre o usuário `jon@ghidora`:

```
GRANT EVENT ON myschema.* TO jon@ghidora;
```

(Suponhamos que essa conta de usuário já exista e que deseje que ela permaneça inalterada, caso contrário.)

Para conceder a este mesmo usuário o privilégio `EVENT` em todos os esquemas, use a seguinte declaração:

```
GRANT EVENT ON *.* TO jon@ghidora;
```

O privilégio `EVENT` tem escopo global ou de nível de esquema. Portanto, tentar concedi-lo em uma única tabela resulta em um erro, conforme mostrado:

```
mysql> GRANT EVENT ON myschema.mytable TO jon@ghidora;
ERROR 1144 (42000): Illegal GRANT/REVOKE command; please
consult the manual to see which privileges can be used
```

É importante entender que um evento é executado com os privilégios do seu definidor, e que ele não pode realizar nenhuma ação para a qual seu definidor não tenha os privilégios necessários. Por exemplo, suponha que `jon@ghidora` tenha o privilégio `EVENT` para `myschema`. Suponha também que este usuário tenha o privilégio `SELECT` para `myschema`, mas nenhum outro privilégio para este esquema. É possível que `jon@ghidora` crie um novo evento como este:

```
CREATE EVENT e_store_ts
    ON SCHEDULE
      EVERY 10 SECOND
    DO
      INSERT INTO myschema.mytable VALUES (UNIX_TIMESTAMP());
```

O usuário espera por cerca de um minuto e, em seguida, realiza uma consulta `SELECT * FROM mytable;`, esperando ver várias novas linhas na tabela. Em vez disso, a tabela está vazia. Como o usuário não tem o privilégio `INSERT` para a tabela em questão, o evento não tem efeito.

Se você examinar o registro de erro do MySQL (`hostname.err`), poderá ver que o evento está sendo executado, mas a ação que está tentando realizar falha:

```
2013-09-24T12:41:31.261992Z 25 [ERROR] Event Scheduler:
[jon@ghidora][cookbook.e_store_ts] INSERT command denied to user
'jon'@'ghidora' for table 'mytable'
2013-09-24T12:41:31.262022Z 25 [Note] Event Scheduler:
[jon@ghidora].[myschema.e_store_ts] event execution failed.
2013-09-24T12:41:41.271796Z 26 [ERROR] Event Scheduler:
[jon@ghidora][cookbook.e_store_ts] INSERT command denied to user
'jon'@'ghidora' for table 'mytable'
2013-09-24T12:41:41.272761Z 26 [Note] Event Scheduler:
[jon@ghidora].[myschema.e_store_ts] event execution failed.
```

Como esse usuário provavelmente não tem acesso ao log de erro, é possível verificar se a declaração de ação do evento é válida executando-a diretamente:

```
mysql> INSERT INTO myschema.mytable VALUES (UNIX_TIMESTAMP());
ERROR 1142 (42000): INSERT command denied to user
'jon'@'ghidora' for table 'mytable'
```

A inspeção da tabela do esquema de informações `EVENTS` mostra que `e_store_ts` existe e está habilitado, mas sua coluna `LAST_EXECUTED` é `NULL`:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.EVENTS
     >     WHERE EVENT_NAME='e_store_ts'
     >     AND EVENT_SCHEMA='myschema'\G
*************************** 1. row ***************************
   EVENT_CATALOG: NULL
    EVENT_SCHEMA: myschema
      EVENT_NAME: e_store_ts
         DEFINER: jon@ghidora
      EVENT_BODY: SQL
EVENT_DEFINITION: INSERT INTO myschema.mytable VALUES (UNIX_TIMESTAMP())
      EVENT_TYPE: RECURRING
      EXECUTE_AT: NULL
  INTERVAL_VALUE: 5
  INTERVAL_FIELD: SECOND
        SQL_MODE: NULL
          STARTS: 0000-00-00 00:00:00
            ENDS: 0000-00-00 00:00:00
          STATUS: ENABLED
   ON_COMPLETION: NOT PRESERVE
         CREATED: 2006-02-09 22:36:06
    LAST_ALTERED: 2006-02-09 22:36:06
   LAST_EXECUTED: NULL
   EVENT_COMMENT:
1 row in set (0.00 sec)
```

Para revogar o privilégio `EVENT`, use a declaração `REVOKE`. Neste exemplo, o privilégio `EVENT` no esquema `myschema` é removido da conta de usuário `jon@ghidora`:

```
REVOKE EVENT ON myschema.* FROM jon@ghidora;
```

Importante

Retirar o privilégio `EVENT` de um usuário não exclui ou desativa quaisquer eventos que possam ter sido criados por esse usuário.

Um evento não é migrado ou excluído como resultado da renomeação ou exclusão do usuário que o criou.

Suponha que o usuário `jon@ghidora` tenha sido concedido os privilégios `EVENT` e `INSERT` no esquema `myschema`. Esse usuário, em seguida, cria o seguinte evento:

```
CREATE EVENT e_insert
    ON SCHEDULE
      EVERY 7 SECOND
    DO
      INSERT INTO myschema.mytable;
```

Após a criação deste evento, `root` revoga o privilégio de `EVENT` para `jon@ghidora`. No entanto, `e_insert` continua a executar, inserindo uma nova linha em `mytable` a cada sete segundos. O mesmo aconteceria se `root` tivesse emitido qualquer uma dessas declarações:

* `DROP USER jon@ghidora;`
* `RENAME USER jon@ghidora TO someotherguy@ghidora;`

Você pode verificar que isso é verdade examinando a tabela do esquema de informações `EVENTS` antes e depois de emitir uma declaração `DROP USER` ou `RENAME USER`.

As definições de eventos são armazenadas no dicionário de dados. Para descartar um evento criado por outra conta de usuário, você deve ser o usuário `root` do MySQL ou outro usuário com os privilégios necessários.

Os privilégios dos usuários `EVENT` são armazenados nas colunas `Event_priv` das tabelas `mysql.user` e `mysql.db`. Em ambos os casos, essa coluna contém um dos valores '`Y`' ou '`N`'. '`N`' é o padrão. `mysql.user.Event_priv` é definido como '`Y`' para um usuário específico apenas se esse usuário tiver o privilégio global `EVENT` (ou seja, se o privilégio foi concedido usando `GRANT EVENT ON *.*`). Para um privilégio de nível de esquema `EVENT`, `GRANT` cria uma linha em `mysql.db` e define a coluna `Db` dessa linha para o nome do esquema, a coluna `User` para o nome do usuário e a coluna `Event_priv` para '`Y`'. Nunca haverá necessidade de manipular essas tabelas diretamente, uma vez que as instruções [[`GRANT EVENT`](grant.html "15.7.1.6 GRANT Statement") e `REVOKE EVENT` realizam as operações necessárias nelas.

Cinco variáveis de status fornecem contagens de operações relacionadas a eventos (mas *não* de declarações executadas por eventos; veja Seção 27.8, “Restrições sobre Programas Armazenados”). Estas são:

* `Com_create_event`: O número de declarações `CREATE EVENT` executadas desde o último reinício do servidor.

* `Com_alter_event`: O número de declarações `ALTER EVENT` executadas desde o último reinício do servidor.

* `Com_drop_event`: O número de declarações `DROP EVENT` executadas desde o último reinício do servidor.

* `Com_show_create_event`: O número de declarações `SHOW CREATE EVENT` executadas desde o último reinício do servidor.

* `Com_show_events`: O número de declarações `SHOW EVENTS` executadas desde o último reinício do servidor.

Você pode visualizar os valores atuais para todos esses itens ao mesmo tempo, executando a declaração `SHOW STATUS LIKE '%event%';`.