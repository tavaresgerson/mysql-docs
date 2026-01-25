### 14.16.1 Tabelas INFORMATION_SCHEMA do InnoDB sobre Compressão

14.16.1.1 INNODB_CMP e INNODB_CMP_RESET

14.16.1.2 INNODB_CMPMEM e INNODB_CMPMEM_RESET

14.16.1.3 Usando as Tabelas INFORMATION_SCHEMA de Compressão

Existem dois pares de tabelas `INFORMATION_SCHEMA` do `InnoDB` sobre compressão que podem fornecer uma visão de quão bem a compressão está funcionando no geral:

* `INNODB_CMP` e `INNODB_CMP_RESET` fornecem informações sobre o número de operações de compressão e a quantidade de tempo gasto na execução da compressão.

* `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` fornecem informações sobre a forma como a memória é alocada para a compressão.