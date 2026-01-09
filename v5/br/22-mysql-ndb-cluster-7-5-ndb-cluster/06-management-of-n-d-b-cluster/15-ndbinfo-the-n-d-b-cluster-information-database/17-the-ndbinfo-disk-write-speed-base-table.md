#### 21.6.15.17 Tabela ndbinfo disk_write_speed_base

A tabela `disk_write_speed_base` fornece informações básicas sobre a velocidade de escrita em disco durante operações de LCP, backup e restauração.

A tabela `disk_write_speed_base` contém as seguintes colunas:

- `node_id`

  ID do nó deste nó

- `thr_no`

  ID do fio deste fio LDM

- `millis_ago`

  Milissegundos desde o término deste período de relatórios

- `millis_passed`

  Milissegundos se passaram neste período de relatórios

- `backup_lcp_bytes_written`

  Número de bytes escritos no disco por pontos de verificação locais e processos de backup durante este período

- `redo_bytes_written`

  Número de bytes escritos no log REDO durante este período

- `target_disk_write_speed`

  Velocidade real de escrita de disco por fio LDM (dados básicos)
