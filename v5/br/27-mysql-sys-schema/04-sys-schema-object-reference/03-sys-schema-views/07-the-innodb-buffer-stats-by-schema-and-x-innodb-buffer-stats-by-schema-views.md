#### 26.4.3.7 As visualizações innodb\_buffer\_stats\_by\_schema e x$innodb\_buffer\_stats\_by\_schema

Esses pontos resumem as informações na tabela `INFORMATION_SCHEMA` `INNODB_BUFFER_PAGE`, agrupadas por esquema. Por padrão, as linhas são ordenadas em ordem decrescente de tamanho do buffer.

Aviso

Consultar vistas que acessam a tabela `INNODB_BUFFER_PAGE` pode afetar o desempenho. Não consulte essas vistas em um sistema de produção, a menos que você esteja ciente do impacto no desempenho e tenha determinado que ele é aceitável. Para evitar afetar o desempenho em um sistema de produção, reproduza o problema que você deseja investigar e consulte as estatísticas do pool de buffers em uma instância de teste.

As vistas `innodb_buffer_stats_by_schema` e `x$innodb_buffer_stats_by_schema` possuem as seguintes colunas:

- `objeto_esquema`

  O nome do esquema para o objeto, ou `InnoDB System` se a tabela pertencer ao mecanismo de armazenamento `InnoDB`.

- "atribuído"

  O número total de bytes alocados para o esquema.

- `dados`

  O número total de bytes de dados alocados para o esquema.

- `pages`

  O número total de páginas alocadas para o esquema.

- `pages_hashed`

  O número total de páginas hash alocadas para o esquema.

- `pages_old`

  O número total de páginas antigas alocadas para o esquema.

- `rows_cached`

  O número total de linhas armazenadas em cache para o esquema.
