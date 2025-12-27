#### 25.6.15.30 Tabela `disk_write_speed_aggregate_node`

A tabela `disk_write_speed_aggregate_node` fornece informações agregadas por nó sobre a velocidade de escrita de discos durante operações de LCP, backup e restauração.

A tabela `disk_write_speed_aggregate_node` contém as seguintes colunas:

* `node_id`

  ID do nó deste nó

* `backup_lcp_speed_last_sec`

  Número de bytes escritos no disco pelos processos de backup e LCP na última segundo

* `redo_speed_last_sec`

  Número de bytes escritos no log de redo no último segundo

* `backup_lcp_speed_last_10sec`

  Número de bytes escritos no disco pelos processos de backup e LCP por segundo, com média nos últimos 10 segundos

* `redo_speed_last_10sec`

  Número de bytes escritos no log de redo a cada segundo, com média nos últimos 10 segundos

* `backup_lcp_speed_last_60sec`

  Número de bytes escritos no disco pelos processos de backup e LCP por segundo, com média nos últimos 60 segundos

* `redo_speed_last_60sec`

  Número de bytes escritos no log de redo a cada segundo, com média nos últimos 60 segundos