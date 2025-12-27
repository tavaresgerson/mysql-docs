#### 30.4.3.7 As visualizações innodb\_buffer\_stats\_by\_schema e x$innodb\_buffer\_stats\_by\_schema

Essas visualizações resumem as informações da tabela `INFORMATION_SCHEMA` `INNODB_BUFFER_PAGE`, agrupadas por esquema. Por padrão, as linhas são ordenadas em ordem decrescente de tamanho do buffer.

Aviso

A consulta a visualizações que acessam a tabela `INNODB_BUFFER_PAGE` pode afetar o desempenho. Não consulte essas visualizações em um sistema de produção, a menos que esteja ciente do impacto no desempenho e tenha determinado que ele é aceitável. Para evitar afetar o desempenho em um sistema de produção, reproduza o problema que deseja investigar e consulte as estatísticas do pool de buffers em uma instância de teste.

As visualizações `innodb_buffer_stats_by\_schema` e `x$innodb_buffer_stats\_by\_schema` têm essas colunas:

* `object\_schema`

  O nome do esquema para o objeto, ou `InnoDB System` se a tabela pertencer ao motor de armazenamento `InnoDB`.

* `allocated`

  O número total de bytes alocados para o esquema.

* `data`

  O número total de bytes de dados alocados para o esquema.

* `pages`

  O número total de páginas alocadas para o esquema.

* `pages\_hashed`

  O número total de páginas hash alocadas para o esquema.

* `pages\_old`

  O número total de páginas antigas alocadas para o esquema.

* `rows\_cached`

  O número total de linhas em cache para o esquema.