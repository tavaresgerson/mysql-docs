#### 25.6.16.18 Tabela ndbinfo cpustat

A tabela `cpustat` fornece estatísticas de CPU por fio coletadas a cada segundo, para cada fio que está rodando no kernel `NDB`.

A tabela `cpustat` contém as seguintes colunas:

- `node_id`

  ID do nó onde o fio está sendo executado

- `thr_no`

  ID do fio (específico para este nó)

- `OS_user`

  Tempo de uso do sistema operacional

- `OS_system`

  Horário do sistema do OS

- `OS_idle`

  Tempo de inatividade

- `thread_exec`

  Tempo de execução do fio

- `thread_sleeping`

  Tempo de sono do fio

- `thread_spinning`

  Tempo de rotação do fio

- `thread_send`

  Tempo de envio do fio

- `thread_buffer_full`

  Buffer de fio em tempo integral

- `elapsed_time`

  Tempo decorrido
