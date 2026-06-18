#### 15.7.7.29 Declaração PROCESSLIST

```
SHOW [FULL] PROCESSLIST
```

Importante

A implementação do esquema de informações `SHOW PROCESSLIST` está desatualizada e está sujeita à remoção em uma futura versão do MySQL. Recomenda-se usar a implementação do esquema de desempenho `SHOW PROCESSLIST` em vez disso.

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão sendo executadas no servidor. A instrução `SHOW PROCESSLIST` é uma fonte de informações sobre os processos. Para uma comparação desta instrução com outras fontes, consulte Fontes de Informações sobre Processos.

Nota

A partir do MySQL 8.0.22, uma implementação alternativa para `SHOW PROCESSLIST` está disponível com base na tabela do Schema de Desempenho `processlist`, que, ao contrário da implementação padrão `SHOW PROCESSLIST`, não requer um mutex e possui melhores características de desempenho. Para detalhes, consulte a Seção 29.12.21.7, “A tabela processlist”.

Se você tiver o privilégio `PROCESS`, poderá ver todos os tópicos, mesmo os pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESS`), os usuários não anônimos têm acesso às informações sobre seus próprios tópicos, mas não sobre os tópicos de outros usuários, e os usuários anônimos não têm acesso às informações dos tópicos.

Sem a palavra-chave `FULL`, `SHOW PROCESSLIST` exibe apenas os primeiros 100 caracteres de cada declaração no campo `Info`.

A declaração `SHOW PROCESSLIST` é muito útil se você receber a mensagem de erro “existem muitas conexões” e quiser descobrir o que está acontecendo. O MySQL reserva uma conexão extra para ser usada por contas que têm o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`), para garantir que os administradores sempre possam se conectar e verificar o sistema (assumindo que você não esteja dando esse privilégio a todos os seus usuários).

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

A saída `SHOW PROCESSLIST` tem essas colunas:

- `Id`

  O identificador de conexão. Este é o mesmo valor exibido na coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, exibida na coluna `PROCESSLIST_ID` da tabela do Schema de Desempenho `threads`, e retornada pela função `CONNECTION_ID()` dentro do thread.

- `User`

  O usuário do MySQL que emitiu a declaração. Um valor de `system user` refere-se a um fio não cliente gerado pelo servidor para lidar com tarefas internamente, por exemplo, um fio de manipulador de linha atrasada ou um fio de I/O (receptor) ou SQL (aplicador) usado em hosts replicados. Para `system user`, não há nenhum host especificado na coluna `Host`. `unauthenticated user` refere-se a um fio que se tornou associado a uma conexão com o cliente, mas para o qual a autenticação do usuário do cliente ainda não ocorreu. `event_scheduler` refere-se ao fio que monitora eventos agendados (veja a Seção 27.4, “Usando o Agendamento de Eventos”).

  Nota

  Um valor `User` de `system user` é distinto do privilégio `SYSTEM_USER`. O primeiro designa threads internas. O segundo distingue as categorias de contas de usuário do sistema e as contas de usuário regulares (consulte a Seção 8.2.11, “Categorias de Conta”).

- `Host`

  O nome do host do cliente que emite a declaração (exceto para `system user`, para o qual não há um host). O nome do host para conexões TCP/IP é relatado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o que.

- `db`

  O banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

- `Command`

  O tipo de comando que o fio está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do fio, consulte a Seção 10.14, “Examinando Informações do Fio (Processo) do Servidor” (Informações”). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte a Seção 7.1.10, “Variáveis de Status do Servidor”.

- `Time`

  O tempo em segundos que o fio esteve em seu estado atual. Para um fio de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o horário real do host da replica. Veja a Seção 19.2.3, “Fios de Replicação”.

- `State`

  Uma ação, evento ou estado que indica o que o fio está fazendo. Para descrições dos valores de `State`, consulte a Seção 10.14, “Examinando Informações do Fio do Servidor (Processo”) (Informações”).

  A maioria dos estados corresponde a operações muito rápidas. Se um fio permanecer em um determinado estado por muitos segundos, pode haver um problema que precisa ser investigado.

- `Info`

  A declaração que o fio está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a enviada ao servidor ou uma declaração mais interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor `Info` mostrará a declaração `SELECT`.
