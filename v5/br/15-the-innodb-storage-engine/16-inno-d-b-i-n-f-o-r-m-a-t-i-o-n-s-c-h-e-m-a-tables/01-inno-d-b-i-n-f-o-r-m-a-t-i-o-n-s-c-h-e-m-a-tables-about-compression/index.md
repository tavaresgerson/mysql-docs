### 14.16.1 Tabelas do esquema de informações InnoDB sobre compressão

14.16.1.1 INNODB_CMP e INNODB_CMP_RESET

14.16.1.2 INNODB_CMPMEM e INNODB_CMPMEM_RESET

14.16.1.3 Usar as tabelas do esquema de informações de compressão

Existem dois pares de tabelas do `INFORMATION_SCHEMA` do `InnoDB` sobre compressão que podem fornecer informações sobre o quão bem a compressão está funcionando no geral:

- `INNODB_CMP` e `INNODB_CMP_RESET` fornecem informações sobre o número de operações de compressão e o tempo gasto realizando a compressão.

- `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` fornecem informações sobre a forma como a memória é alocada para a compressão.
