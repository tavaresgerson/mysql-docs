## 10.6 Otimizando tabelas MyISAM

10.6.1 Otimizando consultas MyISAM

10.6.2 Carregamento de dados em lote para tabelas MyISAM

10.6.3 Otimizando instruções REPAIR TABLE

O mecanismo de armazenamento `MyISAM` funciona melhor com dados que são acessados principalmente para leitura ou com operações de baixa concorrência, pois os bloqueios de tabela limitam a capacidade de realizar atualizações simultâneas. No MySQL, o mecanismo de armazenamento `InnoDB` é o padrão, e não `MyISAM`.