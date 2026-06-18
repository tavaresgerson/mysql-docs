## 10.6 Otimização para tabelas MyISAM

10.6.1 Otimizando consultas MyISAM

10.6.2 Carregamento de dados em lote para tabelas MyISAM

10.6.3 Otimização das declarações da Tabela de REPARO

O motor de armazenamento `MyISAM` funciona melhor com dados que são lidos principalmente ou com operações de baixa concorrência, porque os bloqueios de tabela limitam a capacidade de realizar atualizações simultâneas. No MySQL, `InnoDB` é o motor de armazenamento padrão, e não `MyISAM`.
