#### 25.6.15.33 A tabela ndbinfo diskstats_1sec

A tabela `diskstats_1sec` fornece informações sobre as escritas nas tabelaspaces de dados de disco nos últimos 20 segundos.

A tabela `diskstat` contém as seguintes colunas:

* `node_id`

  ID do nó deste nó

* `block_instance`

  ID da instância de relatório do `PGMAN`

* `pages_made_dirty`

  Páginas tornadas sujas durante o intervalo de 1 segundo designado

* `reads_issued`

  Leitura emitida durante o intervalo de 1 segundo designado

* `reads_completed`

  Leitura concluída durante o intervalo de 1 segundo designado

* `writes_issued`

  Escrita emitida durante o intervalo de 1 segundo designado

* `writes_completed`

  Escrita concluída durante o intervalo de 1 segundo designado

* `log_writes_issued`

  Número de vezes que uma escrita de página exigiu uma escrita de log durante o intervalo de 1 segundo designado

* `log_writes_completed`

  Número de escritas de log concluídas durante o intervalo de 1 segundo designado

* `get_page_calls_issued`

  Número de chamadas `get_page()` emitidas durante o intervalo de 1 segundo designado

* `get_page_reqs_issued`

  Número de vezes que uma chamada `get_page()` resultou em uma espera por I/O ou conclusão de I/O já iniciada durante o intervalo de 1 segundo designado

* `get_page_reqs_completed`

  Número de chamadas `get_page()` em espera por I/O ou conclusão de I/O que foram concluídas durante o intervalo de 1 segundo designado

* `seconds_ago`

  Número de intervalos de 1 segundo no passado do intervalo ao qual esta linha se aplica

##### Notas

Cada linha desta tabela corresponde a uma instância do `PGMAN` durante um intervalo de 1 segundo que ocorreu de 0 a 19 segundos atrás; há uma instância por fio LDM mais uma instância adicional para cada nó de dados.