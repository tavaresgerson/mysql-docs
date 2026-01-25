#### 21.6.15.12 A Tabela ndbinfo cpustat_50ms

A tabela `cpustat_50ms` fornece dados de CPU brutos por Thread (per-thread), coletados a cada 50 milissegundos para cada Thread em execução no kernel do `NDB`.

Assim como [`cpustat_1sec`](mysql-cluster-ndbinfo-cpustat-1sec.html "21.6.15.13 A Tabela ndbinfo cpustat_1sec") e [`cpustat_20sec`](mysql-cluster-ndbinfo-cpustat-20sec.html "21.6.15.14 A Tabela ndbinfo cpustat_20sec"), esta tabela exibe 20 conjuntos de medição por Thread, cada um referenciando um período com a duração especificada. Portanto, `cpsustat_50ms` fornece 1 segundo de histórico.

A tabela `cpustat_50ms` contém as seguintes colunas:

* `node_id`

  ID do nó onde o Thread está em execução

* `thr_no`

  ID do Thread (específico para este nó)

* `OS_user_time`

  Tempo de usuário do OS

* `OS_system_time`

  Tempo de sistema do OS

* `OS_idle_time`

  Tempo ocioso (idle time) do OS

* `exec_time`

  Tempo de execução do Thread

* `sleep_time`

  Tempo de suspensão (sleep time) do Thread

* `spin_time`

  Tempo de espera ativa (spin time) do Thread

* `send_time`

  Tempo de envio (send time) do Thread

* `buffer_full_time`

  Tempo de Buffer full (buffer cheio) do Thread

* `elapsed_time`

  Tempo decorrido (elapsed time)

##### Notas

Esta tabela foi adicionada no NDB 7.5.2.