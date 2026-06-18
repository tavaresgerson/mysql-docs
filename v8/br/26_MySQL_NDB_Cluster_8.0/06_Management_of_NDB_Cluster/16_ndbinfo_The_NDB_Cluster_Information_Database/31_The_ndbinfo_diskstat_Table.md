#### 25.6.16.31 A tabela ndbinfo diskstat

A tabela `diskstat` fornece informações sobre os registros nas tabelaspaces de Dados de disco nos últimos 1 segundo.

A tabela `diskstat` contém as seguintes colunas:

- `node_id`

  ID do nó deste nó

- `block_instance`

  ID da instância de relatório de `PGMAN`

- `pages_made_dirty`

  Número de páginas que ficaram sujas no último segundo

- `reads_issued`

  Leitura emitida durante o último segundo

- `reads_completed`

  Leitura concluída durante o último segundo

- `writes_issued`

  Textos emitidos durante o último segundo

- `writes_completed`

  Escreve concluído durante o último segundo

- `log_writes_issued`

  Número de vezes que uma escrita na página exigiu uma escrita no log durante o último segundo

- `log_writes_completed`

  Número de gravações de log concluídas no último segundo

- `get_page_calls_issued`

  Número de chamadas `get_page()` emitidas durante o último segundo

- `get_page_reqs_issued`

  Número de vezes que uma chamada `get_page()` resultou em espera por I/O ou conclusão de I/O já iniciada no último segundo

- `get_page_reqs_completed`

  Número de chamadas `get_page()` aguardando I/O ou conclusão de I/O que foram concluídas no último segundo

##### Notas

Cada linha desta tabela corresponde a uma instância do `PGMAN`; há uma instância para cada fio do LDM, além de uma instância adicional para cada nó de dados.
