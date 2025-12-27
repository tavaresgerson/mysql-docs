## 10.6 Otimizando para Tabelas MyISAM

O mecanismo de armazenamento `MyISAM` funciona melhor com dados que são lidos principalmente ou com operações de baixa concorrência, pois os bloqueios de tabela limitam a capacidade de realizar atualizações simultâneas. No MySQL, o mecanismo de armazenamento `InnoDB` é o padrão, e não `MyISAM`.