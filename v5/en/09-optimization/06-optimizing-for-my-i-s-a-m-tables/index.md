## 8.6 Otimizando para Tabelas MyISAM

8.6.1 Otimizando Queries MyISAM

8.6.2 Carregamento de Dados em Massa para Tabelas MyISAM

8.6.3 Otimizando Declarações REPAIR TABLE

O `storage engine` `MyISAM` apresenta o melhor desempenho com dados predominantemente de leitura (*read-mostly data*) ou com operações de baixa *concurrency*, pois os *table locks* limitam a capacidade de executar *updates* simultâneos. No MySQL, `InnoDB` é o `default storage engine`, e não o `MyISAM`.