#### 21.6.15.13 A Tabela ndbinfo cpustat_1sec

A tabela `cpustat-1sec` fornece dados de CPU brutos, por Thread, obtidos a cada segundo para cada Thread em execução no kernel `NDB`.

Assim como [`cpustat_50ms`](mysql-cluster-ndbinfo-cpustat-50ms.html "21.6.15.12 A Tabela ndbinfo cpustat_50ms") e [`cpustat_20sec`](mysql-cluster-ndbinfo-cpustat-20sec.html "21.6.15.14 A Tabela ndbinfo cpustat_20sec"), esta tabela exibe 20 conjuntos de medição por Thread, cada um referenciando um período da duração nomeada. Assim, `cpsustat_1sec` fornece 20 segundos de histórico.

A tabela `cpustat_1sec` contém as seguintes colunas:

* `node_id`

  ID do node onde o Thread está em execução

* `thr_no`

  ID do Thread (específico para este node)

* `OS_user_time`

  Tempo de usuário do OS

* `OS_system_time`

  Tempo de sistema do OS

* `OS_idle_time`

  Tempo ocioso do OS

* `exec_time`

  Tempo de execução do Thread

* `sleep_time`

  Tempo de sleep do Thread

* `spin_time`

  Tempo de spin do Thread

* `send_time`

  Tempo de envio do Thread

* `buffer_full_time`

  Tempo de Buffer full do Thread

* `elapsed_time`

  Tempo decorrido

##### Notas

Esta tabela foi adicionada no NDB 7.5.2.