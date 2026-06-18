### 23.4.2 Configuração do Event Scheduler

Eventos são executados por uma `thread` especial do agendador de eventos; quando nos referimos ao Event Scheduler, estamos na verdade nos referindo a esta `thread`. Quando em execução, a `thread` do agendador de eventos e seu estado atual podem ser vistos por usuários com o privilégio `PROCESS` na saída de `SHOW PROCESSLIST`, conforme demonstrado na discussão a seguir.

A variável de sistema global `event_scheduler` determina se o Event Scheduler está habilitado e em execução no servidor. Ela possui um dos seguintes valores, que afetam o agendamento de eventos conforme descrito:

* `OFF`: O Event Scheduler está parado. A `thread` do agendador de eventos não é executada, não é exibida na saída de `SHOW PROCESSLIST` e nenhum evento agendado é executado. `OFF` é o valor padrão de `event_scheduler`.

  Quando o Event Scheduler está parado (`event_scheduler` é `OFF`), ele pode ser iniciado definindo o valor de `event_scheduler` como `ON`. (Veja o próximo item.)

* `ON`: O Event Scheduler está iniciado; a `thread` do agendador de eventos é executada e executa todos os eventos agendados.

  Quando o Event Scheduler está `ON`, a `thread` do agendador de eventos é listada na saída de `SHOW PROCESSLIST` como um processo `daemon`, e seu estado é representado conforme mostrado aqui:

  ```sql
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

  O agendamento de eventos pode ser interrompido definindo o valor de `event_scheduler` como `OFF`.

* `DISABLED`: Este valor torna o Event Scheduler não operacional. Quando o Event Scheduler está `DISABLED`, a `thread` do agendador de eventos não é executada (e, portanto, não aparece na saída de `SHOW PROCESSLIST`). Além disso, o estado do Event Scheduler não pode ser alterado em tempo de execução (`runtime`).

Se o status do Event Scheduler não tiver sido definido como `DISABLED`, `event_scheduler` pode ser alternado entre `ON` e `OFF` (usando `SET`). Também é possível usar `0` para `OFF` e `1` para `ON` ao definir esta variável. Assim, qualquer uma das 4 instruções a seguir pode ser usada no cliente **mysql** para ligar o Event Scheduler:

```sql
SET GLOBAL event_scheduler = ON;
SET @@GLOBAL.event_scheduler = ON;
SET GLOBAL event_scheduler = 1;
SET @@GLOBAL.event_scheduler = 1;
```

Da mesma forma, qualquer uma destas 4 instruções pode ser usada para desligar o Event Scheduler:

```sql
SET GLOBAL event_scheduler = OFF;
SET @@GLOBAL.event_scheduler = OFF;
SET GLOBAL event_scheduler = 0;
SET @@GLOBAL.event_scheduler = 0;
```

Embora `ON` e `OFF` tenham equivalentes numéricos, o valor exibido para `event_scheduler` por `SELECT` ou `SHOW VARIABLES` é sempre um dos seguintes: `OFF`, `ON` ou `DISABLED`. *`DISABLED` não possui equivalente numérico*. Por este motivo, `ON` e `OFF` são geralmente preferidos em relação a `1` e `0` ao definir esta variável.

Note que tentar definir `event_scheduler` sem especificá-la como uma variável global causa um erro:

```sql
mysql< SET @@event_scheduler = OFF;
ERROR 1229 (HY000): Variable 'event_scheduler' is a GLOBAL
variable and should be set with SET GLOBAL
```

Importante

É possível definir o Event Scheduler como `DISABLED` apenas na inicialização do servidor (`server startup`). Se `event_scheduler` estiver em `ON` ou `OFF`, você não pode defini-lo como `DISABLED` em tempo de execução. Além disso, se o Event Scheduler for definido como `DISABLED` na inicialização, você não pode alterar o valor de `event_scheduler` em tempo de execução.

Para desabilitar o agendador de eventos, use um dos dois métodos a seguir:

* Como uma opção de linha de comando ao iniciar o servidor:

  ```sql
  --event-scheduler=DISABLED
  ```

* No arquivo de configuração do servidor (`my.cnf`, ou `my.ini` em sistemas Windows), inclua a linha onde ela possa ser lida pelo servidor (por exemplo, em uma seção `[mysqld]`):

  ```sql
  event_scheduler=DISABLED
  ```

Para habilitar o Event Scheduler, reinicie o servidor sem a opção de linha de comando `--event-scheduler=DISABLED`, ou após remover ou comentar a linha contendo `event-scheduler=DISABLED` no arquivo de configuração do servidor, conforme apropriado. Alternativamente, você pode usar `ON` (ou `1`) ou `OFF` (ou `0`) no lugar do valor `DISABLED` ao iniciar o servidor.

Nota

Você pode emitir instruções de manipulação de eventos quando `event_scheduler` está definido como `DISABLED`. Nenhum aviso ou erro é gerado em tais casos (desde que as instruções sejam válidas por si mesmas). No entanto, eventos agendados não podem ser executados até que esta variável seja definida como `ON` (ou `1`). Uma vez que isso tenha sido feito, a `thread` do agendador de eventos executa todos os eventos cujas condições de agendamento são satisfeitas.

Iniciar o servidor MySQL com a opção `--skip-grant-tables` faz com que `event_scheduler` seja definido como `DISABLED`, substituindo qualquer outro valor definido na linha de comando ou no arquivo `my.cnf` ou `my.ini` (Bug #26807).

Para instruções SQL usadas para criar, alterar e descartar (`drop`) eventos, consulte a Seção 23.4.3, “Sintaxe de Eventos”.

O MySQL fornece uma tabela `EVENTS` no `Database` `INFORMATION_SCHEMA`. Esta tabela pode ser consultada (`queried`) para obter informações sobre eventos agendados que foram definidos no servidor. Veja a Seção 23.4.4, “Metadados de Eventos”, e a Seção 24.3.8, “A Tabela INFORMATION_SCHEMA EVENTS”, para mais informações.

Para informações sobre o agendamento de eventos e o sistema de privilégios do MySQL, consulte a Seção 23.4.6, “O Event Scheduler e os Privilégios do MySQL”.