#### 15.7.7.32 Declaração SHOW PROCESSLIST

```
SHOW [FULL] PROCESSLIST
```

Importante

A implementação do esquema de informações `SHOW PROCESSLIST` é desatualizada e está sujeita à remoção em uma futura versão do MySQL. Recomenda-se usar a implementação do Schema de Desempenho de `SHOW PROCESSLIST` em vez disso.

A lista de processos do MySQL indica as operações atualmente sendo realizadas pelo conjunto de threads que estão executando no servidor. A declaração `SHOW PROCESSLIST` é uma fonte de informações sobre os processos. Para uma comparação desta declaração com outras fontes, consulte Fontes de Informações sobre Processos.

Observação

Uma implementação alternativa para `SHOW PROCESSLIST` está disponível com base na tabela `processlist` do Schema de Desempenho, que, ao contrário da implementação padrão de `SHOW PROCESSLIST`, não requer um mutex e tem melhores características de desempenho. Para detalhes, consulte Seção 29.12.22.9, “A tabela processlist”.

Se você tiver o privilégio `PROCESS`, poderá ver todos os threads, mesmo aqueles pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESS`), os usuários não anônimos têm acesso às informações sobre seus próprios threads, mas não sobre os threads de outros usuários, e os usuários anônimos não têm acesso às informações sobre os threads.

Sem a palavra-chave `FULL`, `SHOW PROCESSLIST` exibe apenas os primeiros 100 caracteres de cada declaração no campo `Info`.

A declaração `SHOW PROCESSLIST` é muito útil se você receber a mensagem de erro “muitas conexões” e quiser descobrir o que está acontecendo. O MySQL reserva uma conexão extra para ser usada por contas que têm o privilégio `CONNECTION_ADMIN` (ou o privilégio `SUPER` desatualizado), para garantir que os administradores sempre possam se conectar e verificar o sistema (assumindo que você não está dando esse privilégio a todos os seus usuários).

Os threads podem ser interrompidos com a instrução `KILL`. Veja a Seção 15.7.8.4, “Instrução KILL”.

Exemplo de saída do `SHOW PROCESSLIST`:

```
mysql> SHOW FULL PROCESSLIST\G
*************************** 1. row ***************************
     Id: 1
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 1030455
  State: Waiting for source to send event
   Info: NULL
*************************** 2. row ***************************
     Id: 2
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 1004
  State: Has read all relay log; waiting for the replica
         I/O thread to update it
   Info: NULL
*************************** 3. row ***************************
     Id: 3112
   User: replikator
   Host: artemis:2204
     db: NULL
Command: Binlog Dump
   Time: 2144
  State: Has sent all binlog to replica; waiting for binlog to be updated
   Info: NULL
*************************** 4. row ***************************
     Id: 3113
   User: replikator
   Host: iconnect2:45781
     db: NULL
Command: Binlog Dump
   Time: 2086
  State: Has sent all binlog to replica; waiting for binlog to be updated
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

A saída do `SHOW PROCESSLIST` tem essas colunas:

* `Id`

  O identificador de conexão. Esse é o mesmo valor exibido na coluna `ID` da tabela `PROCESSLIST` do `INFORMATION_SCHEMA`, exibida na coluna `PROCESSLIST_ID` da tabela `threads` do Schema de Desempenho, e retornada pela função `CONNECTION_ID()` dentro do thread.

* `User`

  O usuário MySQL que emitiu a instrução. Um valor de `usuário do sistema` refere-se a um thread não cliente gerado pelo servidor para lidar com tarefas internamente, por exemplo, um thread de manipulador de linhas atrasadas ou um thread de I/O (receptor) ou thread de aplicação de SQL (aplicador) usado em hosts replicados. Para `usuário do sistema`, não há um host especificado na coluna `Host`. `usuário não autenticado` refere-se a um thread que se associou a uma conexão cliente, mas para o qual a autenticação do usuário cliente ainda não ocorreu. `event_scheduler` refere-se ao thread que monitora eventos agendados (veja a Seção 27.5, “Usando o Agendamento de Eventos”).

  Nota

  O valor `User` de `usuário do sistema` é distinto do privilégio `SYSTEM_USER`. O primeiro designa threads internas. O segundo distingue as categorias de contas de usuário do sistema e do usuário comum (veja a Seção 8.2.11, “Categorias de Conta”).

* `Host`

  O nome do host do cliente que emitiu a instrução (exceto para `usuário do sistema`, para o qual não há host). O nome do host para conexões TCP/IP é relatado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o que.

* `db`

  O banco de dados padrão para o thread, ou `NULL` se nenhum tiver sido selecionado.

* `Command`

O tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do thread, consulte a Seção 10.14, “Examinando Informações do Thread (Processo) do Servidor” (Informações”). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte a Seção 7.1.10, “Variáveis de Status do Servidor”.

* `Time`

  O tempo em segundos que o thread está em seu estado atual. Para um thread SQL de replica, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Consulte a Seção 19.2.3, “Threads de Replicação”.

* `State`

  Uma ação, evento ou estado que indica o que o thread está fazendo. Para descrições dos valores de `State`, consulte a Seção 10.14, “Examinando Informações do Thread (Processo) do Servidor” (Informações”).

  A maioria dos estados corresponde a operações muito rápidas. Se um thread permanecer em um estado específico por muitos segundos, pode haver um problema que precisa ser investigado.

* `Info`

  A instrução que o thread está executando, ou `NULL` se não estiver executando nenhuma instrução. A instrução pode ser a enviada ao servidor ou uma instrução mais interna se a instrução executar outras instruções. Por exemplo, se uma instrução `CALL` executar um procedimento armazenado que está executando uma instrução `SELECT`, o valor de `Info` mostra a instrução `SELECT`.