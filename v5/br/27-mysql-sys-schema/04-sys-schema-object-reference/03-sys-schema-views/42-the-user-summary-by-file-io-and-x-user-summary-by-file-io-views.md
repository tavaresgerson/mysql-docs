#### 26.4.3.42 As visualizações user\_summary\_by\_file\_io e x$user\_summary\_by\_file\_io

Esses pontos resumem o acesso e gravação de arquivos, agrupados por usuário. Por padrão, as linhas são ordenadas em ordem decrescente de latência total de acesso e gravação de arquivos.

As views `user_summary_by_file_io` e `x$user_summary_by_file_io` possuem essas colunas:

- `usuário`

  O nome de usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

- `ios`

  O número total de eventos de entrada/saída de arquivos para o usuário.

- `io_latency`

  O tempo total de espera de eventos de E/S de arquivos com temporizador para o usuário.
