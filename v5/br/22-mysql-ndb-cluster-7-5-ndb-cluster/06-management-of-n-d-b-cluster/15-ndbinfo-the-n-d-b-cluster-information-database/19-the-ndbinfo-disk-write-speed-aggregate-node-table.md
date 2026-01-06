#### 21.6.15.19 Tabela ndbinfo disk\_write\_speed\_aggregate\_node

A tabela `disk_write_speed_aggregate_node` fornece informações agregadas por nó sobre a velocidade de escrita em discos durante operações de LCP, backup e restauração.

A tabela `disk_write_speed_aggregate_node` contém as seguintes colunas:

- `node_id`

  ID do nó deste nó

- `backup_lcp_speed_last_sec`

  Número de bytes escritos no disco pelos processos de backup e LCP no último segundo

- `redo_speed_last_sec`

  Número de bytes escritos no log de refazer na última segundo

- `backup_lcp_speed_last_10sec`

  Número de bytes escritos no disco pelos processos de backup e LCP por segundo, calculado em média nos últimos 10 segundos

- `redo_speed_last_10sec`

  Número de bytes escritos no log de refazer a cada segundo, calculado em média nos últimos 10 segundos

- `backup_lcp_speed_last_60sec`

  Número de bytes escritos no disco pelos processos de backup e LCP por segundo, calculado em média nos últimos 60 segundos

- `redo_speed_last_60sec`

  Número de bytes escritos no log de refazer a cada segundo, calculado em média nos últimos 60 segundos
