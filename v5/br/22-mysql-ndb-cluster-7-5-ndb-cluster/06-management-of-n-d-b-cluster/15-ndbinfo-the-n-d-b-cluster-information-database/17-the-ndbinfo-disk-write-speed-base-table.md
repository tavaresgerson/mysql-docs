#### 21.6.15.17 A Tabela ndbinfo disk_write_speed_base

A tabela `disk_write_speed_base` fornece informações base sobre a velocidade das gravações em Disk durante operações de LCP, backup e restore.

A tabela `disk_write_speed_base` contém as seguintes colunas:

* `node_id`

  ID do Node (Nó)

* `thr_no`

  ID da Thread desta LDM thread

* `millis_ago`

  Milissegundos desde que este período de relatório terminou

* `millis_passed`

  Milissegundos decorridos neste período de relatório

* `backup_lcp_bytes_written`

  Número de bytes escritos no Disk por checkpoints locais e processos de backup durante este período

* `redo_bytes_written`

  Número de bytes escritos no REDO log durante este período

* `target_disk_write_speed`

  Velocidade real das gravações em Disk por LDM thread (dados base)