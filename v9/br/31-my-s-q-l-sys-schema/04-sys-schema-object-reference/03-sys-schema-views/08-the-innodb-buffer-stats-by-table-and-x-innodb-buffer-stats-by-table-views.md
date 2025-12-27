#### 30.4.3.8 As visualizações innodb\_buffer\_stats\_by\_table e x$innodb\_buffer\_stats\_by\_table

Essas visualizações resumem as informações da tabela `INFORMATION_SCHEMA` `INNODB_BUFFER_PAGE`, agrupadas por esquema e tabela. Por padrão, as linhas são ordenadas em ordem decrescente de tamanho do buffer.

Aviso

A consulta a visualizações que acessam a tabela `INNODB_BUFFER_PAGE` pode afetar o desempenho. Não consulte essas visualizações em um sistema de produção, a menos que esteja ciente do impacto no desempenho e tenha determinado que ele é aceitável. Para evitar afetar o desempenho em um sistema de produção, reproduza o problema que deseja investigar e consulte as estatísticas do pool de buffers em uma instância de teste.

As visualizações `innodb_buffer_stats_by\_table` e `x$innodb_buffer_stats\_by\_table` têm essas colunas:

* `object_schema`

  O nome do esquema para o objeto, ou `InnoDB System` se a tabela pertencer ao motor de armazenamento `InnoDB`.

* `object_name`

  O nome da tabela.

* `allocated`

  O número total de bytes alocados para a tabela.

* `data`

  O número de bytes de dados alocados para a tabela.

* `pages`

  O número total de páginas alocadas para a tabela.

* `pages_hashed`

  O número de páginas hash alocadas para a tabela.

* `pages_old`

  O número de páginas antigas alocadas para a tabela.

* `rows_cached`

  O número de linhas em cache para a tabela.