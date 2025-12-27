### 28.3.28 A Tabela INFORMATION_SCHEMA.PROCESSLIST

Importante

`INFORMATION_SCHEMA.PROCESSLIST` está desatualizada e está sujeita à remoção em uma futura versão do MySQL. Como tal, a implementação de `SHOW PROCESSLIST` que usa essa tabela também está desatualizada. Recomenda-se usar a implementação do Schema de Desempenho de `PROCESSLIST` em vez disso.

A lista de processos do MySQL indica as operações atualmente sendo realizadas pelo conjunto de threads que estão executando dentro do servidor. A tabela `PROCESSLIST` é uma fonte de informações sobre os processos. Para uma comparação dessa tabela com outras fontes, consulte Fontes de Informações sobre Processos.

A tabela `PROCESSLIST` tem as seguintes colunas:

* `ID`

  O identificador de conexão. Este é o mesmo valor exibido na coluna `Id` da declaração `SHOW PROCESSLIST`, exibida na coluna `PROCESSLIST_ID` da tabela `threads` do Schema de Desempenho e retornada pela função `CONNECTION_ID()` dentro do thread.

* `USER`

  O usuário MySQL que emitiu a declaração. Um valor de `usuário do sistema` refere-se a um thread não cliente gerado pelo servidor para lidar com tarefas internamente, por exemplo, um thread de manipulador de linhas atrasadas ou um thread de I/O ou SQL usado em hosts replicados. Para `usuário do sistema`, não há um host especificado na coluna `Host`. `usuário não autenticado` refere-se a um thread que se associou a uma conexão de cliente, mas para o qual a autenticação do usuário do cliente ainda não ocorreu. `event_scheduler` refere-se ao thread que monitora eventos agendados (veja Seção 27.5, “Usando o Agendador de Eventos”).

  Nota

  O valor `USER` de `usuário do sistema` é distinto do privilégio `SYSTEM_USER`. O primeiro designa threads internas. O segundo distingue as categorias de contas do usuário do sistema e do usuário regular (veja Seção 8.2.11, “Categorias de Conta”).

* `HOST`

O nome do host do cliente que emite a declaração (exceto para o `usuário do sistema`, para o qual não há host). O nome do host para conexões TCP/IP é informado no formato `host_name:port_cliente` para facilitar a determinação de qual cliente está fazendo o que.

* `DB`

  O banco de dados padrão para o thread, ou `NULL` se nenhum tiver sido selecionado.

* `COMMAND`

  O tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do thread, consulte a Seção 10.14, “Examinando Informações do Thread (Processo) do Servidor” (Informações"). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte a Seção 7.1.10, “Variáveis de Status do Servidor”.

* `TIME`

  O tempo em segundos que o thread está em seu estado atual. Para um thread SQL replica, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Consulte a Seção 19.2.3, “Threads de Replicação”.

* `STATE`

  Uma ação, evento ou estado que indica o que o thread está fazendo. Para descrições dos valores de `STATE`, consulte a Seção 10.14, “Examinando Informações do Thread (Processo) do Servidor” (Informações").

  A maioria dos estados corresponde a operações muito rápidas. Se um thread permanecer em um estado específico por muitos segundos, pode haver um problema que precisa ser investigado.

* `INFO`

  A declaração que o thread está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a enviada ao servidor ou uma declaração mais interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor de `INFO` mostra a declaração `SELECT`.

#### Notas

* `PROCESSLIST` é uma tabela não padrão da `INFORMATION_SCHEMA`.

* Assim como a saída da instrução `SHOW PROCESSLIST`, a tabela `PROCESSLIST` fornece informações sobre todos os threads, mesmo aqueles pertencentes a outros usuários, se você tiver o privilégio `PROCESS`. Caso contrário (sem o privilégio `PROCESS`), os usuários não anônimos têm acesso às informações sobre seus próprios threads, mas não sobre os threads de outros usuários, e os usuários anônimos não têm acesso às informações dos threads.

* Se uma instrução SQL se refere à tabela `PROCESSLIST`, o MySQL popula toda a tabela uma vez, quando a execução da instrução começa, garantindo assim a consistência de leitura durante a instrução. Não há consistência de leitura para uma transação de múltiplas instruções.

As seguintes instruções são equivalentes:

```
SELECT * FROM INFORMATION_SCHEMA.PROCESSLIST

SHOW FULL PROCESSLIST
```

Você pode obter informações sobre o uso desta tabela verificando os valores das variáveis de status do servidor `Deprecated_use_i_s_processlist_count` e `Deprecated_use_i_s_processlist_last_timestamp`. `Deprecated_use_i_s_processlist_count` mostra o número de vezes que a tabela `PROCESSLIST` foi acessada desde a última reinicialização do servidor; `Deprecated_use_i_s_processlist_last_timestamp` fornece a última vez que a tabela foi acessada, como um timestamp Unix.