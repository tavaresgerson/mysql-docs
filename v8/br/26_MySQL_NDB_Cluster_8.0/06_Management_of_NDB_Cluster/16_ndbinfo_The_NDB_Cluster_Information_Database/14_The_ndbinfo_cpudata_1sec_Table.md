#### 25.6.16.14 Tabela ndbinfo cpudata\_1sec

A tabela `cpudata_1sec` fornece dados sobre o uso da CPU por segundo nos últimos 20 segundos.

A tabela `cpustat` contém as seguintes colunas:

- `node_id`

  ID do nó

- `measurement_id`

  Sequência de medição ID; as medições posteriores têm IDs menores

- `cpu_no`

  ID da CPU

- `cpu_online`

  1 se a CPU estiver online atualmente, caso contrário, 0

- `cpu_userspace_time`

  Tempo de CPU gasto no espaço do usuário

- `cpu_idle_time`

  Tempo de CPU gasto em modo inativo

- `cpu_system_time`

  Tempo de CPU gasto no tempo do sistema

- `cpu_interrupt_time`

  Tempo de CPU gasto lidando com interrupções (hardware e software)

- `cpu_exec_vm_time`

  Tempo de CPU gasto na execução da máquina virtual

- `elapsed_time`

  Tempo em microsegundos utilizado para essa medição

##### Notas

A tabela `cpudata_1sec` está disponível apenas nos sistemas operacionais Linux e Solaris.

Esta tabela foi adicionada no NDB 8.0.23.
