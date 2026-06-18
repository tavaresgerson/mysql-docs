### 17.8.10 Configurando estatísticas do otimizador para InnoDB

17.8.10.1 Configurando parâmetros de estatísticas do otimizador persistente

17.8.10.2 Configurando Parâmetros de Estatísticas de Otimizador Não Persistentes

17.8.10.3 Estimativa da complexidade da tabela ANALYZE para tabelas InnoDB

Esta seção descreve como configurar estatísticas de otimizador persistentes e não persistentes para as tabelas `InnoDB`.

As estatísticas do otimizador persistentes são mantidas mesmo após o reinício do servidor, permitindo maior estabilidade do plano e desempenho de consulta mais consistente. As estatísticas do otimizador persistentes também oferecem controle e flexibilidade com esses benefícios adicionais:

- Você pode usar a opção de configuração `innodb_stats_auto_recalc` para controlar se as estatísticas são atualizadas automaticamente após alterações substanciais em uma tabela.

- Você pode usar as cláusulas `STATS_PERSISTENT`, `STATS_AUTO_RECALC` e `STATS_SAMPLE_PAGES` com as instruções `CREATE TABLE` e `ALTER TABLE` para configurar estatísticas do otimizador para tabelas individuais.

- Você pode consultar os dados das estatísticas do otimizador nas tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats`.

- Você pode visualizar a coluna `last_update` das tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats` para ver quando as estatísticas foram atualizadas pela última vez.

- Você pode modificar manualmente as tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats` para forçar um plano de otimização de consulta específico ou para testar planos alternativos sem modificar o banco de dados.

A funcionalidade de otimização persistente de estatísticas está habilitada por padrão (`innodb_stats_persistent=ON`).

As estatísticas do otimizador não persistentes são limpas em cada reinício do servidor e após algumas outras operações, e recomputadas na próxima vez que a tabela for acessada. Como resultado, diferentes estimativas podem ser produzidas ao recomputar as estatísticas, levando a diferentes escolhas nos planos de execução e variações no desempenho das consultas.

Esta seção também fornece informações sobre a estimativa da complexidade do `ANALYZE TABLE` e pode ser útil ao tentar alcançar um equilíbrio entre estatísticas precisas e tempo de execução do `ANALYZE TABLE`.
