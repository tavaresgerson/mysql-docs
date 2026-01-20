#### 21.6.15.11 Tabela ndbinfo cpustat

A tabela `cpustat` fornece estatísticas de CPU por thread coletadas a cada segundo, para cada thread que está rodando no kernel `NDB`.

A tabela `cpustat` contém as seguintes colunas:

- `node_id`

  ID do nó onde o thread está sendo executado

- `thr_no`

  ID do thread (específico para este nó)

- `OS_user`

  Tempo de uso do sistema operacional

- `OS_system`

  Horário do sistema do OS

- `OS_idle`

  Tempo de inatividade

- `thread_exec`

  Tempo de execução do thread

- `thread_sleeping`

  Tempo de sono do thread

- `thread_spinning`

  Tempo de rotação do thread

- `thread_send`

  Tempo de envio do thread

- `thread_buffer_full`

  Buffer de thread em tempo integral

- `tempo_transcorrido`

  Tempo decorrido

##### Notas

Esta tabela foi adicionada no NDB 7.5.2.
