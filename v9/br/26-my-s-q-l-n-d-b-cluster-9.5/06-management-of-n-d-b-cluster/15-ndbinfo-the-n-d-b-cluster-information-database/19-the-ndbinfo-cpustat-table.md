#### 25.6.15.19 Tabela ndbinfo cpustat

A tabela `cpustat` fornece estatísticas de CPU por fio coletadas a cada segundo, para cada fio que está rodando no kernel `NDB`.

A tabela `cpustat` contém as seguintes colunas:

* `node_id`

  ID do nó onde o fio está rodando

* `thr_no`

  ID do fio (específico para este nó)

* `OS_user`

  Tempo do usuário do sistema operacional

* `OS_system`

  Tempo do sistema operacional

* `OS_idle`

  Tempo de inatividade do sistema operacional

* `thread_exec`

  Tempo de execução do fio

* `thread_sleeping`

  Tempo de sono do fio

* `thread_spinning`

  Tempo de rotação do fio

* `thread_send`

  Tempo de envio do fio

* `thread_buffer_full`

  Tempo em que o buffer do fio está cheio

* `elapsed_time`

  Tempo decorrido