### 28.3.23 A tabela INFORMATION\_SCHEMA PROCESSLIST

Importante

`INFORMATION_SCHEMA.PROCESSLIST` está desatualizado e está sujeito à remoção em uma futura versão do MySQL. Como tal, a implementação de `SHOW PROCESSLIST`, que usa essa tabela, também está desatualizada. Recomenda-se usar a implementação do Schema de Desempenho de `PROCESSLIST` em vez disso.

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão sendo executadas no servidor. A tabela `PROCESSLIST` é uma fonte de informações sobre os processos. Para uma comparação desta tabela com outras fontes, consulte Fontes de Informações sobre Processos.

A tabela `PROCESSLIST` tem essas colunas:

- `ID`

  O identificador de conexão. Este é o mesmo valor exibido na coluna `Id` da declaração `SHOW PROCESSLIST`, exibida na coluna `PROCESSLIST_ID` da tabela do Schema de Desempenho `threads`, e retornada pela função `CONNECTION_ID()` dentro do thread.

- `USER`

  O usuário do MySQL que emitiu a declaração. Um valor de `system user` refere-se a um fio não cliente gerado pelo servidor para lidar com tarefas internamente, por exemplo, um fio de manipulação de linha atrasada ou um fio de I/O ou SQL usado em hosts replicados. Para `system user`, não há nenhum host especificado na coluna `Host`. `unauthenticated user` refere-se a um fio que se tornou associado a uma conexão com o cliente, mas para o qual a autenticação do usuário do cliente ainda não ocorreu. `event_scheduler` refere-se ao fio que monitora eventos agendados (veja a Seção 27.4, “Usando o Agendador de Eventos”).

  Nota

  Um valor `USER` de `system user` é distinto do privilégio `SYSTEM_USER`. O primeiro designa threads internas. O segundo distingue as categorias de contas de usuário do sistema e as contas de usuário regulares (consulte a Seção 8.2.11, “Categorias de Conta”).

- `HOST`

  O nome do host do cliente que emite a declaração (exceto para `system user`, para o qual não há um host). O nome do host para conexões TCP/IP é relatado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o que.

- `DB`

  O banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

- `COMMAND`

  O tipo de comando que o fio está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do fio, consulte a Seção 10.14, “Examinando Informações do Fio (Processo) do Servidor” (Informações”). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte a Seção 7.1.10, “Variáveis de Status do Servidor”.

- `TIME`

  O tempo em segundos que o fio esteve em seu estado atual. Para um fio de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o horário real do host da replica. Veja a Seção 19.2.3, “Fios de Replicação”.

- `STATE`

  Uma ação, evento ou estado que indica o que o fio está fazendo. Para descrições dos valores de `STATE`, consulte a Seção 10.14, “Examinando Informações do Fio do Servidor (Processo”) (Informações”).

  A maioria dos estados corresponde a operações muito rápidas. Se um fio permanecer em um determinado estado por muitos segundos, pode haver um problema que precisa ser investigado.

- `INFO`

  A declaração que o fio está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a enviada ao servidor ou uma declaração mais interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor `INFO` mostrará a declaração `SELECT`.

#### Notas

- `PROCESSLIST` é uma tabela não padrão `INFORMATION_SCHEMA`.

- Assim como a saída da instrução `SHOW PROCESSLIST`, a tabela `PROCESSLIST` fornece informações sobre todos os threads, mesmo aqueles pertencentes a outros usuários, se você tiver o privilégio `PROCESS`. Caso contrário (sem o privilégio `PROCESS`), os usuários não anônimos têm acesso às informações sobre seus próprios threads, mas não sobre os threads de outros usuários, e os usuários anônimos não têm acesso às informações dos threads.

- Se uma instrução SQL se refere à tabela `PROCESSLIST`, o MySQL popula toda a tabela uma vez, quando a execução da instrução começa, garantindo assim a consistência de leitura durante a execução da instrução. Não há consistência de leitura para uma transação de múltiplas instruções.

As seguintes afirmações são equivalentes:

```
SELECT * FROM INFORMATION_SCHEMA.PROCESSLIST

SHOW FULL PROCESSLIST
```
