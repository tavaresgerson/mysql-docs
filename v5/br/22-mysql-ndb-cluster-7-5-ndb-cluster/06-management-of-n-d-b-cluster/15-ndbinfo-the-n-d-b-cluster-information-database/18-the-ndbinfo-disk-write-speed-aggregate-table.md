#### 21.6.15.18 Tabela ndbinfo disk\_write\_speed\_aggregate

A tabela `disk_write_speed_aggregate` fornece informações agregadas sobre a velocidade de escrita em disco durante operações de LCP, backup e restauração.

A tabela `disk_write_speed_aggregate` contém as seguintes colunas:

- `node_id`

  ID do nó deste nó

- `thr_no`

  ID do fio deste fio LDM

- `backup_lcp_speed_last_sec`

  Número de bytes escritos no disco pelos processos de backup e LCP no último segundo

- `redo_speed_last_sec`

  Número de bytes escritos no log REDO na última segundo

- `backup_lcp_speed_last_10sec`

  Número de bytes escritos no disco pelos processos de backup e LCP por segundo, calculado em média nos últimos 10 segundos

- `redo_speed_last_10sec`

  Número de bytes escritos no log REDO por segundo, calculado em média nos últimos 10 segundos

- `std_dev_backup_lcp_speed_last_10sec`

  Desvio padrão no número de bytes escritos no disco pelos processos de backup e LCP por segundo, calculado em média nos últimos 10 segundos

- `std_dev_redo_speed_last_10sec`

  Desvio padrão no número de bytes escritos no log REDO por segundo, calculado em média nos últimos 10 segundos

- `backup_lcp_speed_last_60sec`

  Número de bytes escritos no disco pelos processos de backup e LCP por segundo, calculado em média nos últimos 60 segundos

- `redo_speed_last_60sec`

  Número de bytes escritos no log REDO por segundo, calculado em média nos últimos 10 segundos

- `std_dev_backup_lcp_speed_last_60sec`

  Desvio padrão no número de bytes escritos no disco pelos processos de backup e LCP por segundo, calculado em média nos últimos 60 segundos

- `std_dev_redo_speed_last_60sec`

  Desvio padrão no número de bytes escritos no log REDO por segundo, calculado em média nos últimos 60 segundos

- "reduções de velocidade devido ao atraso de I/O"

  Número de segundos desde o último início do nó em que as gravações de disco foram retardadas devido à lacuna de I/O do log REDO

- "reduções de velocidade devido ao alto uso do CPU"

  Número de segundos desde o último início do nó em que as gravações de disco foram reduzidas devido ao uso elevado da CPU

- `defina a velocidade de escrita do disco para o mínimo`

  Número de segundos desde o último início do nó em que a velocidade de escrita do disco foi definida para o mínimo

- `current_target_disk_write_speed`

  Velocidade real de escrita de disco por fio LDM (agregada)
