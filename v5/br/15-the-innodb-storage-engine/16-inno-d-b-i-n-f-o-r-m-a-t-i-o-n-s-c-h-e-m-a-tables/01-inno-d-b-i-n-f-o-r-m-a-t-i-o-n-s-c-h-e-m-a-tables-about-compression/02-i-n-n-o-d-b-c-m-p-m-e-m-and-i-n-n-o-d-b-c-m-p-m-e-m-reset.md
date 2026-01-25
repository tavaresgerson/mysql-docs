#### 14.16.1.2 INNODB_CMPMEM e INNODB_CMPMEM_RESET

As tabelas `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` fornecem informações de status sobre páginas compactadas que residem no Buffer Pool. Consulte a Seção 14.9, “InnoDB Table and Page Compression” para obter mais informações sobre tabelas compactadas e o uso do Buffer Pool. As tabelas `INNODB_CMP` e `INNODB_CMP_RESET` devem fornecer estatísticas mais úteis sobre compactação.

##### Detalhes Internos

O `InnoDB` usa um sistema buddy allocator para gerenciar a memória alocada a páginas de vários tamanhos, de 1KB a 16KB. Cada linha das duas tabelas descritas aqui corresponde a um único tamanho de página.

As tabelas `INNODB_CMPMEM` e `INNODB_CMPMEM_RESET` possuem conteúdo idêntico, mas a leitura de `INNODB_CMPMEM_RESET` redefine as estatísticas sobre operações de realocação. Por exemplo, se a cada 60 minutos você arquivasse a saída de `INNODB_CMPMEM_RESET`, ela mostraria as estatísticas horárias. Se você nunca ler `INNODB_CMPMEM_RESET` e, em vez disso, monitorar a saída de `INNODB_CMPMEM`, ela exibirá as estatísticas acumuladas desde que o `InnoDB` foi iniciado.

Para a definição da tabela, consulte a Seção 24.4.6, “The INFORMATION_SCHEMA INNODB_CMPMEM and INNODB_CMPMEM_RESET Tables”.