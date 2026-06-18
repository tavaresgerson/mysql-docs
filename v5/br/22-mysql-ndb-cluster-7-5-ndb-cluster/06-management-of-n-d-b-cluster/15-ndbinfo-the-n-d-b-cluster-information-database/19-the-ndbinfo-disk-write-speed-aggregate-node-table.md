#### 21.6.15.19 A Tabela ndbinfo disk_write_speed_aggregate_node

A tabela `disk_write_speed_aggregate_node` fornece informações agregadas por node sobre a velocidade das gravações em disco (disk writes) durante as operações de LCP, backup e restore.

A tabela `disk_write_speed_aggregate_node` contém as seguintes colunas:

* `node_id`

  ID do Node (Node ID) deste node

* `backup_lcp_speed_last_sec`

  Número de bytes gravados no disco (disk) pelos processos de backup e LCP no último segundo

* `redo_speed_last_sec`

  Número de bytes gravados no redo log no último segundo

* `backup_lcp_speed_last_10sec`

  Número de bytes gravados no disco (disk) pelos processos de backup e LCP por segundo, com média calculada nos últimos 10 segundos

* `redo_speed_last_10sec`

  Número de bytes gravados no redo log a cada segundo, com média calculada nos últimos 10 segundos

* `backup_lcp_speed_last_60sec`

  Número de bytes gravados no disco (disk) pelos processos de backup e LCP por segundo, com média calculada nos últimos 60 segundos

* `redo_speed_last_60sec`

  Número de bytes gravados no redo log a cada segundo, com média calculada nos últimos 60 segundos