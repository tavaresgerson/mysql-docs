#### 25.6.16.32 A tabela ndbinfo diskstats\_1sec

A tabela `diskstats_1sec` fornece informações sobre os registros nas tabelaspaces de Dados de disco nos últimos 20 segundos.

A tabela `diskstat` contém as seguintes colunas:

- `node_id`

  ID do nó deste nó

- `block_instance`

  ID da instância de relatório de `PGMAN`

- `pages_made_dirty`

  Páginas ficaram sujas durante o intervalo de 1 segundo designado

- `reads_issued`

  Leitura emitida durante o intervalo de 1 segundo designado

- `reads_completed`

  Leitura concluída durante o intervalo de 1 segundo designado

- `writes_issued`

  Mensagens emitidas durante o intervalo de 1 segundo designado

- `writes_completed`

  Textos concluídos durante o intervalo de 1 segundo designado

- `log_writes_issued`

  Número de vezes que uma escrita na página exigiu uma escrita no log durante o intervalo de 1 segundo designado

- `log_writes_completed`

  Número de gravações de log concluídas durante o intervalo de 1 segundo designado

- `get_page_calls_issued`

  Número de chamadas `get_page()` emitidas durante o intervalo de 1 segundo designado

- `get_page_reqs_issued`

  Número de vezes que uma chamada `get_page()` resultou em espera por I/O ou conclusão de I/O já iniciada durante o intervalo designado de 1 segundo

- `get_page_reqs_completed`

  Número de chamadas `get_page()` aguardando I/O ou conclusão de I/O que foram concluídas durante o intervalo de 1 segundo designado

- `seconds_ago`

  Número de intervalos de 1 segundo no passado do intervalo ao qual esta linha se aplica

##### Notas

Cada linha desta tabela corresponde a uma instância de `PGMAN` durante um intervalo de 1 segundo, ocorrendo de 0 a 19 segundos atrás; há uma dessas instâncias por thread do LDM, além de uma instância adicional para cada nó de dados.
