## 8.6 Otimização para tabelas MyISAM

8.6.1 Otimizando consultas MyISAM

8.6.2 Carregamento de dados em lote para tabelas MyISAM

8.6.3 Otimização das declarações da Tabela de Reparo

O mecanismo de armazenamento `MyISAM` funciona melhor com dados que são lidos principalmente ou com operações de baixa concorrência, pois os bloqueios de tabela limitam a capacidade de realizar atualizações simultâneas. No MySQL, o mecanismo de armazenamento `InnoDB` é o padrão, e não `MyISAM`.
