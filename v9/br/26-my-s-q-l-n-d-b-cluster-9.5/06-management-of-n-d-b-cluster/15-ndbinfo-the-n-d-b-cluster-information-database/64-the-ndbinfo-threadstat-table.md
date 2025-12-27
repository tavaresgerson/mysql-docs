#### 25.6.15.64 Tabela threadstat do ndbinfo

A tabela `threadstat` fornece um instantâneo aproximado das estatísticas dos threads que estão em execução no kernel `NDB`.

A tabela `threadstat` contém as seguintes colunas:

* `node_id`

  ID do nó

* `thr_no`

  ID do thread

* `thr_nm`

  Nome do thread

* `c_loop`

  Número de loops no loop principal

* `c_exec`

  Número de sinais executados

* `c_wait`

  Número de vezes em que o thread está esperando por entrada adicional

* `c_l_sent_prioa`

  Número de sinais de prioridade A enviados para o próprio nó

* `c_l_sent_priob`

  Número de sinais de prioridade B enviados para o próprio nó

* `c_r_sent_prioa`

  Número de sinais de prioridade A enviados para o nó remoto

* `c_r_sent_priob`

  Número de sinais de prioridade B enviados para o nó remoto

* `os_tid`

  ID do thread do sistema

* `os_now`

  Tempo do sistema (ms)

* `os_ru_utime`

  Tempo de CPU do usuário do sistema (µs)

* `os_ru_stime`

  Tempo de CPU do sistema do sistema (µs)

* `os_ru_minflt`

  Reclamações de páginas (falhas de paginação suave) do sistema

* `os_ru_majflt`

  Falhas de página (falhas de paginação dura) do sistema

* `os_ru_nvcsw`

  Conversões voluntárias de contexto do sistema

* `os_ru_nivcsw`

  Conversões involuntárias de contexto do sistema

##### Notas

O `os_time` usa a chamada `gettimeofday()` do sistema.

Os valores das colunas `os_ru_utime`, `os_ru_stime`, `os_ru_minflt`, `os_ru_majflt`, `os_ru_nvcsw` e `os_ru_nivcsw` são obtidos usando a chamada `getrusage()` do sistema, ou o equivalente.

Como esta tabela contém contagens tomadas em um determinado momento, para obter os melhores resultados, é necessário consultar essa tabela periodicamente e armazenar os resultados em uma ou mais tabelas intermediárias. O Cronograma de Eventos do MySQL Server pode ser empregado para automatizar esse monitoramento. Para mais informações, consulte a Seção 27.5, “Usando o Cronograma de Eventos”.