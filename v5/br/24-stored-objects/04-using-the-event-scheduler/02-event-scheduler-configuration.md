### 23.4.2 Configuração do Agendador de Eventos

Os eventos são executados por uma thread especial do planejador de eventos; quando nos referimos ao Planejador de Eventos, na verdade, estamos nos referindo a essa thread. Quando em execução, a thread do planejador de eventos e seu estado atual podem ser vistos por usuários que possuem o privilégio `PROCESS` na saída do `SHOW PROCESSLIST`, conforme mostrado na discussão a seguir.

A variável de sistema global `event_scheduler` determina se o Agendamento de Eventos está habilitado e em execução no servidor. Ela tem um dos seguintes valores, que afetam o agendamento de eventos conforme descrito:

- `OFF`: O Agendamento de Eventos está parado. O thread do agendamento de eventos não é executado, não é exibido na saída do `SHOW PROCESSLIST` e nenhum evento agendado é executado. `OFF` é o valor padrão do `event_scheduler`.

  Quando o Agendamento de Eventos é interrompido (`event_scheduler` está em `OFF`), ele pode ser iniciado definindo o valor de `event_scheduler` para `ON`. (Veja o próximo item.)

- `ON`: O Agendamento de Eventos é iniciado; a thread do agendamento de eventos é executada e executa todos os eventos agendados.

  Quando o Agendamento de Eventos está ativado, o thread do agendamento de eventos é listado na saída do comando `SHOW PROCESSLIST` como um processo daemon, e seu estado é representado conforme mostrado aqui:

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

  A programação de eventos pode ser interrompida definindo o valor de `event_scheduler` para `OFF`.

- `DESATIVADO`: Esse valor torna o Agendamento de Eventos inoperante. Quando o Agendamento de Eventos está em `DESATIVADO`, o thread do agendamento de eventos não é executado (e, portanto, não aparece na saída do `SHOW PROCESSLIST`). Além disso, o estado do Agendamento de Eventos não pode ser alterado em tempo de execução.

Se o status do Agendamento de Eventos não estiver definido como `DESABILITADO`, o `event_scheduler` pode ser alternado entre `ON` e `OFF` (usando `SET`). Também é possível usar `0` para `OFF` e `1` para `ON` ao definir essa variável. Assim, qualquer uma das seguintes 4 instruções pode ser usada no cliente **mysql** para ativar o Agendamento de Eventos:

```sql
SET GLOBAL event_scheduler = ON;
SET @@GLOBAL.event_scheduler = ON;
SET GLOBAL event_scheduler = 1;
SET @@GLOBAL.event_scheduler = 1;
```

Da mesma forma, qualquer uma dessas 4 declarações pode ser usada para desativar o Agendamento de Eventos:

```sql
SET GLOBAL event_scheduler = OFF;
SET @@GLOBAL.event_scheduler = OFF;
SET GLOBAL event_scheduler = 0;
SET @@GLOBAL.event_scheduler = 0;
```

Embora `ON` e `OFF` tenham equivalentes numéricos, o valor exibido para `event_scheduler` por `SELECT` ou `SHOW VARIABLES` é sempre um de `OFF`, `ON` ou `DISABLED`. *`DISABLED` não tem equivalente numérico*. Por essa razão, `ON` e `OFF` são geralmente preferidos a `1` e `0` ao definir essa variável.

Observe que tentar definir `event_scheduler` sem especificá-lo como uma variável global causa um erro:

```sql
mysql< SET @@event_scheduler = OFF;
ERROR 1229 (HY000): Variable 'event_scheduler' is a GLOBAL
variable and should be set with SET GLOBAL
```

Importante

É possível definir o Agendamento de Eventos como `DESATIVADO` apenas durante o início do servidor. Se `event_scheduler` estiver em `ON` ou `OFF`, você não pode defini-lo como `DESATIVADO` durante a execução. Além disso, se o Agendamento de Eventos estiver definido como `DESATIVADO` durante o início, você não pode alterar o valor de `event_scheduler` durante a execução.

Para desativar o planejador de eventos, use um dos dois métodos a seguir:

- Como opção de linha de comando ao iniciar o servidor:

  ```sql
  --event-scheduler=DISABLED
  ```

- No arquivo de configuração do servidor (`my.cnf`, ou `my.ini` em sistemas Windows), inclua a linha onde ele pode ser lido pelo servidor (por exemplo, em uma seção `[mysqld]`):

  ```sql
  event_scheduler=DISABLED
  ```

Para habilitar o Agendamento de Eventos, reinicie o servidor sem a opção de linha de comando `--event-scheduler=DISABLED`, ou após remover ou comentar a linha que contém `event-scheduler=DISABLED` no arquivo de configuração do servidor, conforme apropriado. Alternativamente, você pode usar `ON` (ou `1`) ou `OFF` (ou `0`) no lugar do valor `DISABLED` ao iniciar o servidor.

Nota

Você pode emitir declarações de manipulação de eventos quando `event_scheduler` estiver definido como `DISABLED`. Nesse caso, não serão gerados avisos ou erros (desde que as próprias declarações sejam válidas). No entanto, os eventos agendados não podem ser executados até que essa variável seja definida como `ON` (ou `1`). Uma vez feito isso, o thread do agendador de eventos executa todos os eventos cujas condições de agendamento são atendidas.

Iniciar o servidor MySQL com a opção `--skip-grant-tables` faz com que `event_scheduler` seja definido como `DISABLED`, substituindo qualquer outro valor definido na linha de comando ou no arquivo `my.cnf` ou `my.ini` (Bug #26807).

Para instruções SQL usadas para criar, alterar e excluir eventos, consulte a Seção 23.4.3, “Sintaxe de Evento”.

O MySQL fornece uma tabela `EVENTS` no banco de dados `INFORMATION_SCHEMA`. Essa tabela pode ser consultada para obter informações sobre eventos agendados que foram definidos no servidor. Consulte a Seção 23.4.4, “Metadados de Eventos”, e a Seção 24.3.8, “A Tabela INFORMATION_SCHEMA EVENTS”, para obter mais informações.

Para obter informações sobre a programação de eventos e o sistema de privilégios do MySQL, consulte a Seção 23.4.6, “O Agendamento de Eventos e Privilégios do MySQL”.
