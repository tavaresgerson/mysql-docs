#### 17.15.1.2 INNODB_CMPMEM e INNODB_CMPMEM_RESET

As tabelas `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` fornecem informações de status sobre as páginas compactadas que residem no pool de buffer. Consulte a Seção 17.9, “Compressão de Tabelas e Páginas do InnoDB” para obter mais informações sobre tabelas compactadas e o uso do pool de buffer. As tabelas `INNODB_CMP` e `INNODB_CMP_RESET` devem fornecer estatísticas mais úteis sobre a compressão.

##### Detalhes Internos

O `InnoDB` usa um sistema de alocador buddy para gerenciar a memória alocada para páginas de vários tamanhos, de 1KB a 16KB. Cada linha das duas tabelas descritas aqui corresponde a um único tamanho de página.

As tabelas `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` têm conteúdos idênticos, mas a leitura de `INNODB_CMPMEM_RESET` reescreve as estatísticas sobre operações de realocação. Por exemplo, se você arquivar a saída de `INNODB_CMPMEM_RESET` a cada 60 minutos, ela mostraria as estatísticas horárias. Se você nunca ler `INNODB_CMPMEM_RESET` e monitorar a saída de `INNODB_CMPMEM` em vez disso, ela mostraria as estatísticas cumulativas desde que o `InnoDB` foi iniciado.

Para a definição da tabela, consulte a Seção 28.4.7, “As tabelas `INFORMATION_SCHEMA INNODB_CMPMEM` e `INNODB_CMPMEM_RESET`”.