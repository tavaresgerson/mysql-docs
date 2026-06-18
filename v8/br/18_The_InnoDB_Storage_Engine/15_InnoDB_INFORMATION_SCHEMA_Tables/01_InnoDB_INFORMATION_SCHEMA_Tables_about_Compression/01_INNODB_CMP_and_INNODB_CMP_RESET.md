#### 17.15.1.1 INNODB\_CMP e INNODB\_CMP\_RESET

As tabelas `INNODB_CMP` e `INNODB_CMP_RESET` fornecem informações de status sobre operações relacionadas a tabelas compactadas, que são descritas na Seção 17.9, “Compactação de Tabelas e Páginas InnoDB”. A coluna `PAGE_SIZE` relata o tamanho da página compactada.

Essas duas tabelas têm conteúdos idênticos, mas a leitura de `INNODB_CMP_RESET` redefiniu as estatísticas sobre operações de compressão e descompactação. Por exemplo, se você arquivar a saída de `INNODB_CMP_RESET` a cada 60 minutos, você verá as estatísticas para cada período horário. Se você monitorar a saída de `INNODB_CMP` (garantido que nunca leia `INNODB_CMP_RESET`), você verá as estatísticas acumuladas desde que o InnoDB foi iniciado.

Para a definição da tabela, consulte a Seção 28.4.6, “As tabelas INFORMATION\_SCHEMA INNODB\_CMP e INNODB\_CMP\_RESET”.
