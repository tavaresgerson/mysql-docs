#### 25.6.15.20 A tabela ndbinfo cpustat_50ms

A tabela `cpustat_50ms` fornece dados brutos de CPU por fio obtidos a cada 50 milissegundos para cada fio que está rodando no kernel `NDB`.

Assim como a `cpustat_1sec` e a `cpustat_20sec`, esta tabela mostra 20 conjuntos de medição por fio, cada um referenciando um período da duração nomeada. Assim, a `cpsustat_50ms` fornece 1 segundo de histórico.

A tabela `cpustat_50ms` contém as seguintes colunas:

* `node_id`

  ID do nó onde o fio está rodando

* `thr_no`

  ID do fio (específico para este nó)

* `OS_user_time`

  Tempo de uso do sistema pelo usuário

* `OS_system_time`

  Tempo de sistema do sistema operacional

* `OS_idle_time`

  Tempo de inatividade do sistema operacional

* `exec_time`

  Tempo de execução do fio

* `sleep_time`

  Tempo de sono do fio

* `spin_time`

  Tempo de rotação do fio

* `send_time`

  Tempo de envio do fio

* `buffer_full_time`

  Tempo em que o buffer do fio está cheio

* `elapsed_time`

  Tempo decorrido