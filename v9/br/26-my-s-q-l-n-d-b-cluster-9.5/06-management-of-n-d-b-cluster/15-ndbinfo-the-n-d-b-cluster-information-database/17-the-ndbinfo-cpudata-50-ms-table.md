#### 25.6.15.17 A tabela ndbinfo cpudata_50ms

A tabela `cpudata_50ms` fornece dados sobre o uso da CPU em intervalos de 50 milissegundos no último segundo.

A tabela `cpustat` contém as seguintes colunas:

* `node_id`

  ID do nó

* `measurement_id`

  ID da sequência de medição; as medições posteriores têm IDs menores

* `cpu_no`

  ID da CPU

* `cpu_online`

  1 se a CPU estiver online no momento, caso contrário 0

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

* `elapsed_time`

  Tempo em microsegundos usado para essa medição

##### Notas

A tabela `cpudata_50ms` está disponível apenas nos sistemas operacionais Linux e Solaris.