### 17.15.1 Tabelas do Schema de Informações InnoDB sobre Compressão

17.15.1.1 INNODB_CMP e INNODB_CMP_RESET

17.15.1.2 INNODB_CMPMEM e INNODB_CMPMEM_RESET

17.15.1.3 Uso das Tabelas do Schema de Informações de Compressão

Existem dois pares de tabelas do `InnoDB` `INFORMATION_SCHEMA` sobre compressão que podem fornecer informações sobre o quão bem a compressão está funcionando no geral:

* `INNODB_CMP` e `INNODB_CMP_RESET` fornecem informações sobre o número de operações de compressão e a quantidade de tempo gasto realizando a compressão.

* `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` fornecem informações sobre a forma como a memória é alocada para a compressão.