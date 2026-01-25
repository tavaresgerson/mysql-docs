#### 21.6.15.43 A Tabela ndbinfo threadstat

A tabela `threadstat` fornece um instantâneo aproximado das estatísticas para os threads em execução no kernel `NDB`.

A tabela `threadstat` contém as seguintes colunas:

* `node_id`

  ID do Node

* `thr_no`

  ID do Thread

* `thr_nm`

  Nome do Thread

* `c_loop`

  Número de loops no loop principal

* `c_exec`

  Número de sinais executados

* `c_wait`

  Número de vezes aguardando por entrada adicional

* `c_l_sent_prioa`

  Número de sinais de prioridade A enviados ao próprio node

* `c_l_sent_priob`

  Número de sinais de prioridade B enviados ao próprio node

* `c_r_sent_prioa`

  Número de sinais de prioridade A enviados a um node remoto

* `c_r_sent_priob`

  Número de sinais de prioridade B enviados a um node remoto

* `os_tid`

  ID do thread do OS

* `os_now`

  Tempo do OS (ms)

* `os_ru_utime`

  Tempo de CPU de usuário do OS (µs)

* `os_ru_stime`

  Tempo de CPU de sistema do OS (µs)

* `os_ru_minflt`

  Recuperações de página do OS (soft page faults)

* `os_ru_majflt`

  Page faults do OS (hard page faults)

* `os_ru_nvcsw`

  Trocas de contexto voluntárias do OS

* `os_ru_nivcsw`

  Trocas de contexto involuntárias do OS

##### Notas

`os_time` usa a chamada de sistema `gettimeofday()`.

Os valores das colunas `os_ru_utime`, `os_ru_stime`, `os_ru_minflt`, `os_ru_majflt`, `os_ru_nvcsw` e `os_ru_nivcsw` são obtidos usando a chamada de sistema `getrusage()`, ou equivalente.

Visto que esta tabela contém contagens tiradas em um determinado ponto no tempo, para melhores resultados é necessário fazer uma Query nesta tabela periodicamente e armazenar os resultados em uma ou mais tabelas intermediárias. O Event Scheduler do MySQL Server pode ser empregado para automatizar tal monitoramento. Para mais informações, consulte [Seção 23.4, “Usando o Event Scheduler”](event-scheduler.html "23.4 Using the Event Scheduler").