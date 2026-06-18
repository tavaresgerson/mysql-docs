### 14.8.11 Configurando as Estatísticas do Otimizador para InnoDB

14.8.11.1 Configurando Parâmetros de Estatísticas do Otimizador Persistentes

14.8.11.2 Configurando Parâmetros de Estatísticas do Otimizador Não-Persistentes

14.8.11.3 Estimando a Complexidade do ANALYZE TABLE para Tabelas InnoDB

Esta seção descreve como configurar as estatísticas do otimizador persistentes e não-persistentes para tabelas `InnoDB`.

As estatísticas do otimizador persistentes são mantidas após as reinicializações do servidor (*server restarts*), permitindo maior estabilidade do plano e um desempenho de Query mais consistente. As estatísticas do otimizador persistentes também fornecem controle e flexibilidade com estes benefícios adicionais:

*   Você pode usar a opção de configuração `innodb_stats_auto_recalc` para controlar se as estatísticas são atualizadas automaticamente após mudanças substanciais em uma tabela.

*   Você pode usar as cláusulas `STATS_PERSISTENT`, `STATS_AUTO_RECALC` e `STATS_SAMPLE_PAGES` com as instruções `CREATE TABLE` e `ALTER TABLE` para configurar as estatísticas do otimizador para tabelas individuais.

*   Você pode consultar os dados das estatísticas do otimizador nas tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats`.

*   Você pode visualizar a coluna `last_update` das tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats` para ver quando as estatísticas foram atualizadas pela última vez.

*   Você pode modificar manualmente as tabelas `mysql.innodb_table_stats` e `mysql.innodb_index_stats` para forçar um plano de otimização de Query específico ou para testar planos alternativos sem modificar o Database.

O recurso de estatísticas do otimizador persistentes é habilitado por padrão (`innodb_stats_persistent=ON`).

As estatísticas do otimizador não-persistentes são limpas a cada reinicialização do servidor (*server restart*) e após algumas outras operações, sendo recalculadas no próximo acesso à tabela. Como resultado, diferentes estimativas podem ser produzidas ao recalcular as estatísticas, levando a diferentes escolhas nos planos de execução e variações no desempenho de Query.

Esta seção também fornece informações sobre a estimativa da complexidade do `ANALYZE TABLE`, o que pode ser útil ao tentar alcançar um equilíbrio entre estatísticas precisas e o tempo de execução do `ANALYZE TABLE`.