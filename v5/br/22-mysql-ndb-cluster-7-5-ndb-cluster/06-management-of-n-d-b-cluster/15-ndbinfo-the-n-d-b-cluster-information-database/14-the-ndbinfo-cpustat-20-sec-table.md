#### 21.6.15.14 A Tabela ndbinfo cpustat_20sec

A tabela `cpustat_20sec` fornece dados brutos de CPU, por Thread, obtidos a cada 20 segundos, para cada Thread em execução no kernel `NDB`.

Assim como [`cpustat_50ms`](mysql-cluster-ndbinfo-cpustat-50ms.html "21.6.15.12 The ndbinfo cpustat_50ms Table") e [`cpustat_1sec`](mysql-cluster-ndbinfo-cpustat-1sec.html "21.6.15.13 The ndbinfo cpustat_1sec Table"), esta tabela mostra 20 conjuntos de medição por Thread, cada um referenciando um período da duração nomeada. Dessa forma, `cpsustat_20sec` fornece 400 segundos de histórico.

A tabela `cpustat_20sec` contém as seguintes colunas:

| Coluna | Descrição |
| :--- | :--- |
| `node_id` | ID do node onde o Thread está sendo executado |
| `thr_no` | ID do Thread (específico para este node) |
| `OS_user_time` | Tempo de usuário do OS |
| `OS_system_time` | Tempo de sistema do OS |
| `OS_idle_time` | Tempo ocioso do OS |
| `exec_time` | Tempo de execução do Thread |
| `sleep_time` | Tempo de suspensão (sleep) do Thread |
| `spin_time` | Tempo de spin do Thread |
| `send_time` | Tempo de envio do Thread |
| `buffer_full_time` | Tempo de Buffer cheio do Thread |
| `elapsed_time` | Tempo decorrido |

##### Notas

Esta tabela foi adicionada no NDB 7.5.2.