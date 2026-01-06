#### 26.4.3.2 As visualizações host\_summary\_by\_file\_io e x$host\_summary\_by\_file\_io

Esses pontos resumem o acesso e gravação de arquivos, agrupados por host. Por padrão, as linhas são ordenadas em ordem decrescente de latência total de acesso e gravação de arquivos.

As views `host_summary_by_file_io` e `x$host_summary_by_file_io` possuem essas colunas:

- `host`

  O host a partir do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Gerenciamento de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

- `ios`

  O número total de eventos de E/S de arquivos para o host.

- `io_latency`

  O tempo total de espera de eventos de E/S de arquivos com temporizador para o host.
