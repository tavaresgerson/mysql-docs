#### 26.4.3.11 As visualizações io_global_by_file_by_bytes e x$io_global_by_file_by_bytes

Esses pontos de vista resumem os consumidores globais de E/S para exibir a quantidade de E/S, agrupada por arquivo. Por padrão, as linhas são ordenadas em ordem decrescente de total de E/S (bytes lidos e escritos).

As vistas `io_global_by_file_by_bytes` e `x$io_global_by_file_by_bytes` possuem essas colunas:

- `arquivo`

  O nome do caminho do arquivo.

- `count_read`

  O número total de eventos de leitura do arquivo.

- `total_read`

  O número total de bytes lidos do arquivo.

- `avg_read`

  O número médio de bytes por leitura do arquivo.

- `count_write`

  O número total de eventos de escrita para o arquivo.

- `total_escrito`

  O número total de bytes escritos no arquivo.

- `avg_write`

  O número médio de bytes por escrita no arquivo.

- `total`

  O número total de bytes lidos e escritos para o arquivo.

- `write_pct`

  A porcentagem dos bytes totais de E/S que foram escritos.
