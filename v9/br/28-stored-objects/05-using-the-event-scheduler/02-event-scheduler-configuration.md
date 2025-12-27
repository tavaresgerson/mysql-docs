### 27.5.2 Configuração do Agendamento de Eventos

Os eventos são executados por uma thread especial do agendamento de eventos; quando nos referimos ao Agendamento de Eventos, na verdade, estamos nos referindo a essa thread. Quando em execução, a thread do agendamento de eventos e seu estado atual podem ser vistos por usuários com o privilégio `PROCESS` na saída de `SHOW PROCESSLIST`, conforme mostrado na discussão a seguir.

A variável de sistema global `event_scheduler` determina se o Agendamento de Eventos está habilitado e em execução no servidor. Ela tem um dos seguintes valores, que afetam o agendamento de eventos conforme descrito:

* `ON`: O Agendamento de Eventos é iniciado; a thread do agendamento de eventos é executada e executa todos os eventos agendados. `ON` é o valor padrão de `event_scheduler`.

  Quando o Agendamento de Eventos está em `ON`, a thread do agendamento de eventos é listada na saída de `SHOW PROCESSLIST` como um processo daemon, e seu estado é representado como mostrado aqui:

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

  O agendamento de eventos pode ser interrompido definindo o valor de `event_scheduler` para `OFF`.

* `OFF`: O Agendamento de Eventos é parado. A thread do agendamento de eventos não é executada, não é mostrada na saída de `SHOW PROCESSLIST` e nenhum evento agendado é executado.

  Quando o Agendamento de Eventos é parado (`event_scheduler` é `OFF`), ele pode ser iniciado definindo o valor de `event_scheduler` para `ON`. (Veja o próximo item.)

* `DISABLED`: Esse valor torna o Agendamento de Eventos inoperacional. Quando o Agendamento de Eventos está em `DISABLED`, a thread do agendamento de eventos não é executada (e, portanto, não aparece na saída de `SHOW PROCESSLIST`). Além disso, o estado do Agendamento de Eventos não pode ser alterado em tempo de execução.

Se o status do Agendamento de Eventos não estiver definido como `DESABILITADO`, o `event_scheduler` pode ser alternado entre `LIGADO` e `DESLIGADO` (usando `SET`). Também é possível usar `0` para `DESLIGADO` e `1` para `LIGADO` ao definir essa variável. Assim, qualquer uma das seguintes 4 instruções pode ser usada no cliente **mysql** para ativar o Agendamento de Eventos:

```
SET GLOBAL event_scheduler = ON;
SET @@GLOBAL.event_scheduler = ON;
SET GLOBAL event_scheduler = 1;
SET @@GLOBAL.event_scheduler = 1;
```

Da mesma forma, qualquer uma dessas 4 instruções pode ser usada para desativar o Agendamento de Eventos:

```
SET GLOBAL event_scheduler = OFF;
SET @@GLOBAL.event_scheduler = OFF;
SET GLOBAL event_scheduler = 0;
SET @@GLOBAL.event_scheduler = 0;
```

Observação

Se o Agendamento de Eventos estiver ativado, ativar a variável de sistema `super_read_only` impede que ela atualize os timestamps de "última execução" de eventos na tabela `events` do dicionário de dados. Isso faz com que o Agendamento de Eventos pare na próxima vez que ele tentar executar um evento agendado, após escrever uma mensagem no log de erro do servidor. (Nesse caso, a variável de sistema `event_scheduler` não muda de `LIGADO` para `DESLIGADO`. Isso implica que essa variável rejeita a intenção do DBA de que o Agendamento de Eventos seja ativado ou desativado, onde seu status real de iniciado ou parado pode ser distinto.). Se `super_read_only` for posteriormente desativado após ser ativado, o servidor reinicia automaticamente o Agendamento de Eventos conforme necessário.

Embora `LIGADO` e `DESLIGADO` tenham equivalentes numéricos, o valor exibido para `event_scheduler` por `SELECT` ou `SHOW VARIABLES` é sempre um de `DESLIGADO`, `LIGADO` ou `DESABILITADO`. *`DESABILITADO` não tem equivalente numérico*. Por essa razão, `LIGADO` e `DESLIGADO` são geralmente preferidos a `1` e `0` ao definir essa variável.

Observe que tentar definir `event_scheduler` sem especificá-lo como uma variável global causa um erro:

```
mysql< SET @@event_scheduler = OFF;
ERROR 1229 (HY000): Variable 'event_scheduler' is a GLOBAL
variable and should be set with SET GLOBAL
```

Importante

É possível definir o Agendamento de Eventos como `DESATIVADO` apenas no início da inicialização do servidor. Se `event_scheduler` estiver em `ON` ou `OFF`, você não pode defini-lo como `DESATIVADO` durante a execução. Além disso, se o Agendamento de Eventos estiver definido como `DESATIVADO` no início, você não pode alterar o valor de `event_scheduler` durante a execução.

Para desativar o agendamento de eventos, use um dos dois métodos a seguir:

* Como opção de linha de comando ao iniciar o servidor:

  ```
  --event-scheduler=DISABLED
  ```

* No arquivo de configuração do servidor (`my.cnf`, ou `my.ini` em sistemas Windows), inclua a linha onde ele pode ser lido pelo servidor (por exemplo, em uma seção `[mysqld]`)

  ```
  event_scheduler=DISABLED
  ```

Para habilitar o Agendamento de Eventos, reinicie o servidor sem a opção de linha de comando `--event-scheduler=DESATIVADO`, ou após remover ou comentar a linha que contém `event-scheduler=DESATIVADO` no arquivo de configuração do servidor, conforme apropriado. Alternativamente, você pode usar `ON` (ou `1`) ou `OFF` (ou `0`) no lugar do valor `DESATIVADO` ao iniciar o servidor.

Observação

Você pode emitir declarações de manipulação de eventos quando `event_scheduler` estiver definido como `DESATIVADO`. Não são gerados avisos ou erros nessas situações (desde que as declarações sejam válidas). No entanto, os eventos agendados não podem ser executados até que essa variável seja definida como `ON` (ou `1`). Uma vez feito isso, o thread do agendamento de eventos executa todos os eventos cujas condições de agendamento são atendidas.

Iniciar o servidor MySQL com a opção `--skip-grant-tables` faz com que `event_scheduler` seja definido como `DESATIVADO`, superpondo qualquer outro valor definido na linha de comando ou no arquivo `my.cnf` ou `my.ini` (Bug #26807).

Para declarações SQL usadas para criar, alterar e excluir eventos, consulte a Seção 27.5.3, “Sintaxe de Eventos”.

O MySQL fornece uma tabela `EVENTS` no banco de dados `INFORMATION_SCHEMA`. Essa tabela pode ser consultada para obter informações sobre eventos agendados que foram definidos no servidor. Consulte a Seção 27.5.4, “Metadados do Evento”, e a Seção 28.3.14, “A Tabela INFORMATION_SCHEMA EVENTS”, para obter mais informações.

Para informações sobre a agendamento de eventos e o sistema de privilégios do MySQL, consulte a Seção 27.5.6, “O Agendamento de Eventos e os Privilégios do MySQL”.