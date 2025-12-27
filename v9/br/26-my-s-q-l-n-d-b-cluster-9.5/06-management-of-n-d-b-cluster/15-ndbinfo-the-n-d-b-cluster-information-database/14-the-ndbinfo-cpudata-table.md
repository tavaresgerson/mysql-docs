#### 25.6.15.14 A tabela ndbinfo cpudata

A tabela `cpudata` fornece dados sobre o uso da CPU no último segundo.

A tabela `cpustat` contém as seguintes colunas:

* `node_id`

  ID do nó

* `cpu_no`

  ID da CPU

* `cpu_online`

  1 se a CPU estiver online atualmente, caso contrário, 0

* `cpu_userspace_time`

  Tempo de CPU gasto no espaço do usuário

* `cpu_idle_time`

  Tempo de CPU gasto em estado de espera

* `cpu_system_time`

  Tempo de CPU gasto no tempo do sistema

* `cpu_interrupt_time`

  Tempo de CPU gasto lidando com interrupções (hardware e software)

* `cpu_exec_vm_time`

  Tempo de CPU gasto na execução de máquinas virtuais

##### Notas

A tabela `cpudata` está disponível apenas nos sistemas operacionais Linux e Solaris.