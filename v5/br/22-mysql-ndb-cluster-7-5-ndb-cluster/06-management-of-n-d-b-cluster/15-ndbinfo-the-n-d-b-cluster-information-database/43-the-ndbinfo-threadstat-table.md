#### 21.6.15.43 A tabela Threadstat do ndbinfo

A tabela `threadstat` fornece um instantâneo aproximado das estatísticas dos threads que estão em execução no kernel `NDB`.

A tabela `threadstat` contém as seguintes colunas:

- `node_id`

  ID do nó

- `thr_no`

  ID do fio

- `thr_nm`

  Nome do fio

- `c_loop`

  Número de loops no loop principal

- `c_exec`

  Número de sinais executados

- `c_wait`

  Número de vezes que você precisa esperar por uma entrada adicional

- `c_l_sent_prioa`

  Número de sinais de prioridade A enviados para o próprio nó

- `c_l_sent_priob`

  Número de sinais de prioridade B enviados para o próprio nó

- `c_r_sent_prioa`

  Número de sinais de prioridade A enviados para o nó remoto

- `c_r_sent_priob`

  Número de sinais de prioridade B enviados para o nó remoto

- `os_tid`

  ID do fio do sistema operacional

- `os_now`

  Tempo do sistema operacional (ms)

- `os_ru_utime`

  Tempo de CPU do usuário do OS (µs)

- `os_ru_stime`

  Tempo de CPU do sistema operacional (µs)

- `os_ru_minflt`

  Reclamações de página (falhas de página suaves)

- `os_ru_majflt`

  Falhas de página (falhas de página pesada)

- `os_ru_nvcsw`

  Os comutações voluntárias do contexto

- `os_ru_nivcsw`

  OS trocas involuntárias de contexto

##### Notas

`os_time` usa a chamada `gettimeofday()` do sistema.

Os valores das colunas `os_ru_utime`, `os_ru_stime`, `os_ru_minflt`, `os_ru_majflt`, `os_ru_nvcsw` e `os_ru_nivcsw` são obtidos usando a chamada do sistema `getrusage()` ou o equivalente.

Como esta tabela contém contagens coletadas em um determinado momento, para obter os melhores resultados, é necessário consultar essa tabela periodicamente e armazenar os resultados em uma ou mais tabelas intermediárias. O Cronômetro de Eventos do MySQL Server pode ser utilizado para automatizar esse monitoramento. Para obter mais informações, consulte Seção 23.4, “Usando o Cronômetro de Eventos”.
