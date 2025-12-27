#### 25.6.15.29 Tabela `disk_write_speed_aggregate` do ndbinfo

A tabela `disk_write_speed_aggregate` fornece informações agregadas sobre a velocidade de escrita em disco durante operações de LCP, backup e restauração.

A tabela `disk_write_speed_aggregate` contém as seguintes colunas:

* `node_id`

  ID do nó deste nó

* `thr_no`

  ID de thread deste thread LDM

* `backup_lcp_speed_last_sec`

  Número de bytes escritos em disco pelos processos de backup e LCP na última segundo

* `redo_speed_last_sec`

  Número de bytes escritos no log REDO na última segundo

* `backup_lcp_speed_last_10sec`

  Número de bytes escritos em disco pelos processos de backup e LCP por segundo, calculado em média nos últimos 10 segundos

* `redo_speed_last_10sec`

  Número de bytes escritos no log REDO por segundo, calculado em média nos últimos 10 segundos

* `std_dev_backup_lcp_speed_last_10sec`

  Desvio padrão no número de bytes escritos em disco pelos processos de backup e LCP por segundo, calculado em média nos últimos 10 segundos

* `std_dev_redo_speed_last_10sec`

  Desvio padrão no número de bytes escritos no log REDO por segundo, calculado em média nos últimos 10 segundos

* `backup_lcp_speed_last_60sec`

  Número de bytes escritos em disco pelos processos de backup e LCP por segundo, calculado em média nos últimos 60 segundos

* `redo_speed_last_60sec`

  Número de bytes escritos no log REDO por segundo, calculado em média nos últimos 10 segundos

* `std_dev_backup_lcp_speed_last_60sec`

  Desvio padrão no número de bytes escritos em disco pelos processos de backup e LCP por segundo, calculado em média nos últimos 60 segundos

* `std_dev_redo_speed_last_60sec`

  Desvio padrão no número de bytes escritos no log REDO por segundo, calculado em média nos últimos 60 segundos

* `slowdowns_due_to_io_lag`

Número de segundos desde o último início do nó em que as escritas no disco foram retardadas devido à latência do log REDO

* `reduções_devido_ao_alto_cpu`

Número de segundos desde o último início do nó em que as escritas no disco foram retardadas devido ao uso elevado da CPU

* `velocidade_de_escrita_do_disco_definida_para_min`

Número de segundos desde o último início do nó em que a velocidade de escrita do disco foi definida para o mínimo

* `velocidade_atual_de_escrita_do_disco_por_thread_ldm` (agregada)

Velocidade atual de escrita do disco por thread LDM (agregada)