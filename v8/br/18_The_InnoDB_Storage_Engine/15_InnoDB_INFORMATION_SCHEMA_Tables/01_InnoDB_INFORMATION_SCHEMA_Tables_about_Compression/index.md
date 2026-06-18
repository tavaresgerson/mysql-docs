### 17.15.1 Tabelas do esquema de informações InnoDB sobre compressão

17.15.1.1 INNODB\_CMP e INNODB\_CMP\_RESET

17.15.1.2 INNODB\_CMPMEM e INNODB\_CMPMEM\_RESET

17.15.1.3 Usar as tabelas do esquema de informações de compressão

Existem dois pares de tabelas `InnoDB` `INFORMATION_SCHEMA` sobre compressão que podem fornecer informações sobre o quão bem a compressão está funcionando no geral:

- `INNODB_CMP` e `INNODB_CMP_RESET` fornecem informações sobre o número de operações de compressão e o tempo gasto na execução da compressão.

- `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` fornecem informações sobre a forma como a memória é alocada para a compressão.
