#### 26.4.3.7 As Views innodb_buffer_stats_by_schema e x$innodb_buffer_stats_by_schema

Essas views resumem as informações contidas na tabela `INFORMATION_SCHEMA` `INNODB_BUFFER_PAGE`, agrupadas por schema. Por padrão, as linhas são ordenadas por tamanho de buffer decrescente.

Aviso

Fazer Query em views que acessam a tabela `INNODB_BUFFER_PAGE` pode afetar o performance. Não faça Query nessas views em um sistema de produção, a menos que você esteja ciente do impacto no performance e tenha determinado que ele é aceitável. Para evitar impactar o performance em um sistema de produção, reproduza o problema que você deseja investigar e faça Query nas estatísticas do Buffer Pool em uma instância de teste.

As views `innodb_buffer_stats_by_schema` e `x$innodb_buffer_stats_by_schema` contêm estas colunas:

* `object_schema`

  O nome do schema para o objeto, ou `InnoDB System` se a tabela pertencer ao storage engine `InnoDB`.

* `allocated`

  O número total de bytes alocados para o schema.

* `data`

  O número total de bytes de dados alocados para o schema.

* `pages`

  O número total de pages alocadas para o schema.

* `pages_hashed`

  O número total de pages com hash alocadas para o schema.

* `pages_old`

  O número total de old pages alocadas para o schema.

* `rows_cached`

  O número total de rows em cache para o schema.