#### 21.6.15.18 A Tabela ndbinfo disk_write_speed_aggregate

A tabela `disk_write_speed_aggregate` fornece informações agregadas sobre a velocidade de escritas em disco (disk writes) durante operações de LCP, backup e restore.

A tabela `disk_write_speed_aggregate` contém as seguintes colunas:

* `node_id`

  ID do Node desta instância

* `thr_no`

  ID da Thread (Thread ID) desta Thread LDM

* `backup_lcp_speed_last_sec`

  Número de bytes escritos em disco por processos de backup e LCP no último segundo

* `redo_speed_last_sec`

  Número de bytes escritos no REDO log no último segundo

* `backup_lcp_speed_last_10sec`

  Número de bytes escritos em disco por processos de backup e LCP por segundo, com média nos últimos 10 segundos

* `redo_speed_last_10sec`

  Número de bytes escritos no REDO log por segundo, com média nos últimos 10 segundos

* `std_dev_backup_lcp_speed_last_10sec`

  Desvio padrão no número de bytes escritos em disco por processos de backup e LCP por segundo, com média nos últimos 10 segundos

* `std_dev_redo_speed_last_10sec`

  Desvio padrão no número de bytes escritos no REDO log por segundo, com média nos últimos 10 segundos

* `backup_lcp_speed_last_60sec`

  Número de bytes escritos em disco por processos de backup e LCP por segundo, com média nos últimos 60 segundos

* `redo_speed_last_60sec`

  Número de bytes escritos no REDO log por segundo, com média nos últimos 10 segundos

* `std_dev_backup_lcp_speed_last_60sec`

  Desvio padrão no número de bytes escritos em disco por processos de backup e LCP por segundo, com média nos últimos 60 segundos

* `std_dev_redo_speed_last_60sec`

  Desvio padrão no número de bytes escritos no REDO log por segundo, com média nos últimos 60 segundos

* `slowdowns_due_to_io_lag`

  Número de segundos desde a última inicialização do node em que as escritas em disco foram lentificadas devido a I/O lag do REDO log

* `slowdowns_due_to_high_cpu`

  Número de segundos desde a última inicialização do node em que as escritas em disco foram lentificadas devido ao alto uso de CPU

* `disk_write_speed_set_to_min`

  Número de segundos desde a última inicialização do node em que a velocidade de escrita em disco foi definida como mínima

* `current_target_disk_write_speed`

  Velocidade real das escritas em disco por Thread LDM (agregada)