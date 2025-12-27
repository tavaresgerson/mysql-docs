#### 25.6.15.28 Tabela ndbinfo disk_write_speed_base

A tabela `disk_write_speed_base` fornece informações básicas sobre a velocidade de escrita de discos durante operações de LCP, backup e restauração.

A tabela `disk_write_speed_base` contém as seguintes colunas:

* `node_id`

  ID do nó deste nó

* `thr_no`

  ID de thread deste thread LDM

* `millis_ago`

  Milissegundos desde o término deste período de relatório

* `millis_passed`

  Milissegundos decorridos neste período de relatório

* `backup_lcp_bytes_written`

  Número de bytes escritos no disco por pontos de verificação locais e processos de backup durante este período

* `redo_bytes_written`

  Número de bytes escritos no log REDO durante este período

* `target_disk_write_speed`

  Velocidade real de escrita de discos por thread LDM (dados básicos)