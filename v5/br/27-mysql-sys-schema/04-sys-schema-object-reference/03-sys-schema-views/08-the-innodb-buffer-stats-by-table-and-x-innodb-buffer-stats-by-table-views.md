#### 26.4.3.8 As Visualizações innodb_buffer_stats_by_table e x$innodb_buffer_stats_by_table

Estas visualizações resumem as informações contidas na tabela `INNODB_BUFFER_PAGE` do `INFORMATION_SCHEMA`, agrupadas por schema e tabela. Por padrão, as linhas são ordenadas pelo tamanho decrescente do Buffer.

Aviso

A Query de Views que acessam a tabela `INNODB_BUFFER_PAGE` pode afetar o desempenho. Não execute Queries nessas Views em um sistema de produção a menos que você esteja ciente do impacto no desempenho e o tenha determinado como aceitável. Para evitar impactar o desempenho em um sistema de produção, reproduza o problema que deseja investigar e consulte as estatísticas do Buffer Pool em uma instância de teste.

As visualizações `innodb_buffer_stats_by_table` e `x$innodb_buffer_stats_by_table` possuem estas colunas:

* `object_schema`

  O nome do schema para o objeto, ou `InnoDB System` se a tabela pertencer ao storage engine `InnoDB`.

* `object_name`

  O nome da tabela.

* `allocated`

  O número total de bytes alocados para a tabela.

* `data`

  O número de bytes de dados alocados para a tabela.

* `pages`

  O número total de pages alocadas para a tabela.

* `pages_hashed`

  O número de pages com hash (hashed pages) alocadas para a tabela.

* `pages_old`

  O número de old pages alocadas para a tabela.

* `rows_cached`

  O número de rows em cache para a tabela.