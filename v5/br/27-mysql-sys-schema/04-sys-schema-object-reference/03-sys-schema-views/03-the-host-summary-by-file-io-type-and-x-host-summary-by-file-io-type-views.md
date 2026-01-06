#### 26.4.3.3 As visualizações host\_summary\_by\_file\_io\_type e x$host\_summary\_by\_file\_io\_type

Essas visualizações resumem o acesso e gravação de arquivos, agrupados por host e tipo de evento. Por padrão, as linhas são ordenadas por host e latência total de I/O em ordem decrescente.

As views `host_summary_by_file_io_type` e `x$host_summary_by_file_io_type` possuem essas colunas:

- `host`

  O host a partir do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Gerenciamento de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

- `nome_do_evento`

  O nome do evento de E/S do arquivo.

- `total`

  O número total de ocorrências do evento de E/S de arquivo para o host.

- `total_latency`

  O tempo total de espera de ocorrências temporizadas do evento de E/S do arquivo para o host.

- `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada do evento de E/S do arquivo para o host.
