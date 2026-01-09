#### 21.6.15.14 Tabela ndbinfo cpustat_20sec

A tabela `cpustat_20sec` fornece dados brutos de CPU por fio obtidos a cada 20 segundos, para cada fio que está rodando no kernel `NDB`.

Assim como `cpustat_50ms` e `cpustat_1sec`, esta tabela mostra 20 conjuntos de medição por fio, cada um referenciando um período da duração nomeada. Assim, `cpsustat_20sec` fornece 400 segundos de histórico.

A tabela `cpustat_20sec` contém as seguintes colunas:

- `node_id`

  ID do nó onde o fio está sendo executado

- `thr_no`

  ID do fio (específico para este nó)

- `OS_user_time`

  Tempo de uso do sistema operacional

- `OS_system_time`

  Horário do sistema do OS

- `OS_idle_time`

  Tempo de inatividade

- `exec_time`

  Tempo de execução do fio

- `sleep_time`

  Tempo de sono do fio

- `spin_time`

  Tempo de rotação do fio

- `send_time`

  Tempo de envio do fio

- `buffer_full_time`

  Buffer de fio em tempo integral

- `tempo_transcorrido`

  Tempo decorrido

##### Notas

Esta tabela foi adicionada no NDB 7.5.2.
