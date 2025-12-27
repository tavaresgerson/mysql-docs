#### 25.6.15.50 A tabela ndbinfo pgman_time_track_stats

Esta tabela fornece informações sobre a latência das operações de disco para os espaços de dados de disco do NDB Cluster.

A tabela `pgman_time_track_stats` contém as seguintes colunas:

* `node_id`

  ID único do nó deste nó no cluster

* `block_number`

  Número do bloco (da tabela `blocks`)

* `block_instance`

  Número de instância do bloco

* `upper_bound`

  Limite superior

* `page_reads`

  Latência de leitura de página (ms)

* `page_writes`

  Latência de escrita de página (ms)

* `log_waits`

  Latência de espera no log (`log_waits`) (ms)

* `get_page`

  Latência das chamadas `get_page()` (ms)

##### Notas

A latência de leitura (`coluna page_reads`) mede o tempo entre o envio da solicitação de leitura ao thread do sistema de arquivos até a conclusão da leitura e o retorno ao thread de execução. A latência de escrita (`coluna page_writes`) é calculada de maneira semelhante. O tamanho da página lida ou escrita de um espaço de dados de disco é sempre de 32 KB.

A latência de espera no log (`coluna log_waits`) é o tempo que uma escrita de página deve esperar para que o log de desfazer seja descarregado, o que deve ser feito antes de cada escrita de página.