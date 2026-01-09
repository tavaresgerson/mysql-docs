#### 26.4.3.4 As visualizações host_summary_by_stages e x$host_summary_by_stages

Essas visualizações resumem as etapas da declaração, agrupadas por host. Por padrão, as linhas são ordenadas por host e latência total decrescente.

As views `host_summary_by_stages` e `x$host_summary_by_stages` possuem essas colunas:

- `host`

  O host a partir do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Gerenciamento de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

- `nome_do_evento`

  O nome do evento em palco.

- `total`

  O número total de ocorrências do evento em andamento para o anfitrião.

- `total_latency`

  O tempo total de espera de eventos cronometrados do evento em andamento para o anfitrião.

- `avg_latency`

  O tempo médio de espera por ocorrência cronometrada do evento em andamento para o anfitrião.
