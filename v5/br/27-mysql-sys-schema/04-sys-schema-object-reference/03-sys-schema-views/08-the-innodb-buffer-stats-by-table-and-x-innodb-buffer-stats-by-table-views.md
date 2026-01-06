#### 26.4.3.8 As visualizações innodb\_buffer\_stats\_by\_table e x$innodb\_buffer\_stats\_by\_table

Esses pontos resumem as informações na tabela `INFORMATION_SCHEMA` `INNODB_BUFFER_PAGE`, agrupadas por esquema e tabela. Por padrão, as linhas são ordenadas em ordem decrescente de tamanho do buffer.

Aviso

Consultar vistas que acessam a tabela `INNODB_BUFFER_PAGE` pode afetar o desempenho. Não consulte essas vistas em um sistema de produção, a menos que você esteja ciente do impacto no desempenho e tenha determinado que ele é aceitável. Para evitar afetar o desempenho em um sistema de produção, reproduza o problema que você deseja investigar e consulte as estatísticas do pool de buffers em uma instância de teste.

As vistas `innodb_buffer_stats_by_table` e `x$innodb_buffer_stats_by_table` possuem as seguintes colunas:

- `objeto_esquema`

  O nome do esquema para o objeto, ou `InnoDB System` se a tabela pertencer ao mecanismo de armazenamento `InnoDB`.

- `nome_objeto`

  O nome da tabela.

- "atribuído"

  O número total de bytes alocados para a tabela.

- `dados`

  O número de bytes de dados alocados para a tabela.

- `pages`

  O número total de páginas alocadas para a tabela.

- `pages_hashed`

  O número de páginas hash alocadas para a tabela.

- `pages_old`

  O número de páginas antigas alocadas para a tabela.

- `rows_cached`

  O número de linhas armazenadas em cache para a tabela.
