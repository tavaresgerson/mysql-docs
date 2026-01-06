### 24.3.18 A tabela INFORMATION\_SCHEMA PROCESSLIST

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão sendo executadas no servidor. A tabela `PROCESSLIST` é uma fonte de informações sobre os processos. Para uma comparação desta tabela com outras fontes, consulte Fontes de Informações sobre Processos.

A tabela `PROCESSLIST` tem as seguintes colunas:

- `ID`

  O identificador de conexão. Este é o mesmo valor exibido na coluna `Id` da declaração `SHOW PROCESSLIST` (show-processlist.html), exibida na coluna `PROCESSLIST_ID` da tabela do Schema de Desempenho `threads` (performance-schema-threads-table.html) e retornada pela função `CONNECTION_ID()` (information-functions.html#function\_connection-id) dentro do thread.

- `USUARIO`

  O usuário MySQL que emitiu a declaração. Um valor de `usuário do sistema` refere-se a um fio não cliente gerado pelo servidor para lidar com tarefas internamente, por exemplo, um fio de manipulador de linha atrasada ou um fio de I/O ou SQL usado em hosts replicados. Para `usuário do sistema`, não há um host especificado na coluna `Host`. `usuário não autenticado` refere-se a um fio que se associou a uma conexão de cliente, mas para o qual a autenticação do usuário do cliente ainda não ocorreu. `event_scheduler` refere-se ao fio que monitora eventos agendados (veja Seção 23.4, “Usando o Agendamento de Eventos”).

- `HOST`

  O nome do host do cliente que emite a declaração (exceto para o `usuário do sistema`, para o qual não há nenhum host). O nome do host para conexões TCP/IP é relatado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o que.

- `DB`

  O banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

- `COMANDO`

  O tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do thread, consulte Seção 8.14, “Examinando Informações do Thread (Processo) do Servidor”. O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte Seção 5.1.9, “Variáveis de Status do Servidor”.

- `TIME`

  O tempo em segundos que o fio esteve em seu estado atual. Para um fio de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o horário real do host da replica. Veja Seção 16.2.3, “Fios de Replicação”.

- `ESTADO`

  Uma ação, evento ou estado que indica o que o fio está fazendo. Para descrições dos valores de `STATE`, consulte Seção 8.14, “Examinando Informações do Fio do Servidor (Processo”.

  A maioria dos estados corresponde a operações muito rápidas. Se um fio permanecer em um determinado estado por muitos segundos, pode haver um problema que precisa ser investigado.

- `INFO`

  A declaração que o fio está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a enviada ao servidor ou uma declaração mais interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor `INFO` mostrará a declaração `SELECT`.

#### Notas

- `PROCESSLIST` é uma tabela `INFORMATION_SCHEMA` não padrão.

- Assim como a saída da instrução `SHOW PROCESSLIST`, a tabela `PROCESSLIST` fornece informações sobre todos os threads, mesmo aqueles pertencentes a outros usuários, se você tiver o privilégio `PROCESS`. Caso contrário (sem o privilégio `PROCESS`), os usuários não anônimos têm acesso às informações sobre seus próprios threads, mas não sobre os threads de outros usuários, e os usuários anônimos não têm acesso às informações dos threads.

- Se uma instrução SQL se refere à tabela `PROCESSLIST`, o MySQL popula toda a tabela uma vez, quando a execução da instrução começa, garantindo assim a consistência de leitura durante a execução da instrução. Não há consistência de leitura para uma transação com múltiplas instruções.

As seguintes afirmações são equivalentes:

```sql
SELECT * FROM INFORMATION_SCHEMA.PROCESSLIST

SHOW FULL PROCESSLIST
```
