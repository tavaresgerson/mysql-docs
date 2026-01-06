#### 13.7.5.29 Declaração PROCESSLIST

```sql
SHOW [FULL] PROCESSLIST
```

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão sendo executadas no servidor. A instrução `SHOW PROCESSLIST` é uma fonte de informações sobre os processos. Para uma comparação dessa instrução com outras fontes, consulte Fontes de Informações sobre Processos.

Se você tiver o privilégio `PROCESSO`, poderá ver todas as threads, mesmo aquelas pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESSO`), os usuários não anônimos têm acesso às informações sobre suas próprias threads, mas não sobre as threads de outros usuários, e os usuários anônimos não têm acesso às informações das threads.

Sem a palavra-chave `FULL`, o comando `SHOW PROCESSLIST` exibe apenas os primeiros 100 caracteres de cada declaração no campo `Info`.

A instrução `SHOW PROCESSLIST` é muito útil se você receber a mensagem de erro “conexões em excesso” e quiser descobrir o que está acontecendo. O MySQL reserva uma conexão extra para ser usada por contas que têm o privilégio `SUPER`, para garantir que os administradores sempre possam se conectar e verificar o sistema (assumindo que você não esteja dando esse privilégio a todos os seus usuários).

Os threads podem ser interrompidos com a instrução `KILL`. Veja Seção 13.7.6.4, “Instrução KILL”.

Exemplo de saída do `SHOW PROCESSLIST`:

```sql
mysql> SHOW FULL PROCESSLIST\G
*************************** 1. row ***************************
     Id: 1
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 1030455
  State: Waiting for master to send event
   Info: NULL
*************************** 2. row ***************************
     Id: 2
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 1004
  State: Has read all relay log; waiting for the slave
         I/O thread to update it
   Info: NULL
*************************** 3. row ***************************
     Id: 3112
   User: replikator
   Host: artemis:2204
     db: NULL
Command: Binlog Dump
   Time: 2144
  State: Has sent all binlog to slave; waiting for binlog to be updated
   Info: NULL
*************************** 4. row ***************************
     Id: 3113
   User: replikator
   Host: iconnect2:45781
     db: NULL
Command: Binlog Dump
   Time: 2086
  State: Has sent all binlog to slave; waiting for binlog to be updated
   Info: NULL
*************************** 5. row ***************************
     Id: 3123
   User: stefan
   Host: localhost
     db: apollon
Command: Query
   Time: 0
  State: NULL
   Info: SHOW FULL PROCESSLIST
```

A saída `SHOW PROCESSLIST` tem essas colunas:

- `Id`

  O identificador de conexão. Este é o mesmo valor exibido na coluna `ID` da tabela `INFORMATION_SCHEMA `PROCESSLIST``, exibida na coluna `PROCESSLIST_ID` da tabela do Schema de Desempenho `threads` e retornada pela função `CONNECTION_ID()` dentro do thread.

- `Usuário`

  O usuário MySQL que emitiu a declaração. Um valor de `usuário do sistema` refere-se a um fio não cliente gerado pelo servidor para lidar com tarefas internamente, por exemplo, um fio de manipulador de linha atrasada ou um fio de I/O ou SQL usado em hosts replicados. Para `usuário do sistema`, não há um host especificado na coluna `Host`. `usuário não autenticado` refere-se a um fio que se associou a uma conexão de cliente, mas para o qual a autenticação do usuário do cliente ainda não ocorreu. `event_scheduler` refere-se ao fio que monitora eventos agendados (veja Seção 23.4, “Usando o Agendamento de Eventos”).

- `Anfitrião`

  O nome do host do cliente que emite a declaração (exceto para o `usuário do sistema`, para o qual não há nenhum host). O nome do host para conexões TCP/IP é relatado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o que.

- `db`

  O banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

- `Comando`

  O tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do thread, consulte Seção 8.14, “Examinando Informações do Thread (Processo) do Servidor”. O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte Seção 5.1.9, “Variáveis de Status do Servidor”.

- `Tempo`

  O tempo em segundos que o fio esteve em seu estado atual. Para um fio de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o horário real do host da replica. Veja Seção 16.2.3, “Fios de Replicação”.

- "Estado"

  Uma ação, evento ou estado que indica o que o fio está fazendo. Para descrições dos valores de `State`, consulte Seção 8.14, “Examinando Informações do Fio do Servidor (Processo”.

  A maioria dos estados corresponde a operações muito rápidas. Se um fio permanecer em um determinado estado por muitos segundos, pode haver um problema que precisa ser investigado.

- `Info`

  A declaração que o fio está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a enviada ao servidor ou uma declaração mais interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor `Info` mostrará a declaração `SELECT`.
