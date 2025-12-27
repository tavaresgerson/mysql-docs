### 17.8.10 Configurando Estatísticas do Otimizador para `InnoDB`

17.8.10.1 Configurando Parâmetros de Estatísticas do Otimizador Persistentes

17.8.10.2 Configurando Parâmetros de Estatísticas do Otimizador Não Persistentes

17.8.10.3 Estimativa da Complexidade da Tabela ANALYZE para Tabelas `InnoDB`

Esta seção descreve como configurar estatísticas do otimizador persistentes e não persistentes para tabelas `InnoDB`.

As estatísticas do otimizador persistentes são mantidas mesmo após reinicializações do servidor, permitindo maior estabilidade dos planos e desempenho de consultas mais consistente. As estatísticas do otimizador persistentes também oferecem controle e flexibilidade com esses benefícios adicionais:

* Você pode usar a opção de configuração `innodb_stats_auto_recalc` para controlar se as estatísticas são atualizadas automaticamente após alterações substanciais em uma tabela.

* Você pode usar as cláusulas `STATS_PERSISTENT`, `STATS_AUTO_RECALC` e `STATS_SAMPLE_PAGES` com as instruções `CREATE TABLE` e `ALTER TABLE` para configurar estatísticas do otimizador para tabelas individuais.

* Você pode consultar os dados das estatísticas do otimizador nas tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats`.

* Você pode visualizar a coluna `last_update` das tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats` para ver quando as estatísticas foram atualizadas pela última vez.

* Você pode modificar manualmente as tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats` para forçar um plano de otimização de consulta específico ou para testar planos alternativos sem modificar o banco de dados.

O recurso de estatísticas do otimizador persistentes está habilitado por padrão (`innodb_stats_persistent=ON`).

As estatísticas do otimizador não persistentes são limpas em cada reinício do servidor e após algumas outras operações, e recomputadas na próxima vez que o usuário acessar a tabela. Como resultado, diferentes estimativas podem ser produzidas ao recomputar as estatísticas, levando a diferentes escolhas nos planos de execução e variações no desempenho das consultas.

Esta seção também fornece informações sobre a estimativa da complexidade da consulta `ANALYZE TABLE`, o que pode ser útil ao tentar alcançar um equilíbrio entre estatísticas precisas e tempo de execução da consulta `ANALYZE TABLE`.