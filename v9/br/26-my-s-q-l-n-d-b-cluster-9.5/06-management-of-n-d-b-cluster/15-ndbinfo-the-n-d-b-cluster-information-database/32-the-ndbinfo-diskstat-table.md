#### 25.6.15.32 A tabela ndbinfo diskstat

A tabela `diskstat` fornece informações sobre os escritos nas tabelaspaces de dados de disco nos últimos 1 segundo.

A tabela `diskstat` contém as seguintes colunas:

* `node_id`

  ID do nó deste nó

* `block_instance`

  ID da instância de relatório do `PGMAN`

* `pages_made_dirty`

  Número de páginas tornadas sujas durante o último segundo

* `reads_issued`

  Leitura emitida durante o último segundo

* `reads_completed`

  Leitura concluída durante o último segundo

* `writes_issued`

  Escrita emitida durante o último segundo

* `writes_completed`

  Escrita concluída durante o último segundo

* `log_writes_issued`

  Número de vezes que uma escrita de página exigiu uma escrita de log durante o último segundo

* `log_writes_completed`

  Número de escritas de log concluídas durante o último segundo

* `get_page_calls_issued`

  Número de chamadas `get_page()` emitidas durante o último segundo

* `get_page_reqs_issued`

  Número de vezes que uma chamada `get_page()` resultou em uma espera por I/O ou conclusão de I/O já iniciada durante o último segundo

* `get_page_reqs_completed`

  Número de chamadas `get_page()` aguardando I/O ou conclusão de I/O que foram concluídas durante o último segundo

##### Notas

Cada linha desta tabela corresponde a uma instância do `PGMAN`; há uma instância por fio LDM, além de uma instância adicional para cada nó de dados.