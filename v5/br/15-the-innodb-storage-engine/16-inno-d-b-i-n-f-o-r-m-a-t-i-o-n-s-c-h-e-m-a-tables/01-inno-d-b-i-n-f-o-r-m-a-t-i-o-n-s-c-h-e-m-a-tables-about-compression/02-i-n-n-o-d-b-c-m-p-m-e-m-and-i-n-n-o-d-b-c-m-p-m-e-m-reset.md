#### 14.16.1.2 INNODB\_CMPMEM e INNODB\_CMPMEM\_RESET

As tabelas `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` fornecem informações de status sobre as páginas compactadas que residem no pool de buffer. Consulte a Seção 14.9, “Compressão de Tabelas e Páginas InnoDB”, para obter mais informações sobre tabelas compactadas e o uso do pool de buffer. As tabelas `INNODB_CMP` e `INNODB_CMP_RESET` devem fornecer estatísticas mais úteis sobre a compressão.

##### Detalhes internos

O `InnoDB` utiliza um sistema de alocador de amigos para gerenciar a memória alocada para páginas de vários tamanhos, de 1 KB a 16 KB. Cada linha das duas tabelas descritas aqui corresponde a um único tamanho de página.

As tabelas `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` têm conteúdos idênticos, mas a leitura de `INNODB_CMPMEM_RESET` redefiniu as estatísticas sobre operações de realocação. Por exemplo, se você arquivasse a saída de `INNODB_CMPMEM_RESET` a cada 60 minutos, ela mostraria as estatísticas horárias. Se você nunca tivesse lido `INNODB_CMPMEM_RESET` e tivesse monitorado a saída de `INNODB_CMPMEM` em vez disso, ela mostraria as estatísticas acumuladas desde que o `InnoDB` foi iniciado.

Para a definição da tabela, consulte a Seção 24.4.6, “As tabelas INFORMATION\_SCHEMA INNODB\_CMPMEM e INNODB\_CMPMEM\_RESET”.
