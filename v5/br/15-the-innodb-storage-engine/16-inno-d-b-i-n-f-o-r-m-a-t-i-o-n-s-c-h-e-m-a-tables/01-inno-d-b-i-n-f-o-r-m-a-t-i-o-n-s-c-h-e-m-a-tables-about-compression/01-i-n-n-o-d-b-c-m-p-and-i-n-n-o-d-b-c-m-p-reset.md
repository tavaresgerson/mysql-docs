#### 14.16.1.1 INNODB_CMP e INNODB_CMP_RESET

As tabelas `INNODB_CMP` e `INNODB_CMP_RESET` fornecem informações de *status* sobre operações relacionadas a tabelas comprimidas, que são descritas na Seção 14.9, “Compressão de Tabela e Página InnoDB”. A coluna `PAGE_SIZE` reporta o tamanho da página comprimida.

Estas duas tabelas possuem conteúdo idêntico, mas a leitura de `INNODB_CMP_RESET` reinicia as *statistics* sobre operações de *compression* e descompressão. Por exemplo, se você arquivar o *output* de `INNODB_CMP_RESET` a cada 60 minutos, você verá as *statistics* para cada período horário. Se você monitorar o *output* de `INNODB_CMP` (certificando-se de nunca ler `INNODB_CMP_RESET`), você verá as *statistics* cumulativas desde que o InnoDB foi iniciado.

Para a definição da tabela, veja a Seção 24.4.5, “As Tabelas INFORMATION_SCHEMA INNODB_CMP e INNODB_CMP_RESET”.