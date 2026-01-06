## 14.9 Compressão de Tabelas e Páginas do InnoDB

14.9.1 Compressão de Tabelas InnoDB

14.9.2 Compressão de Páginas do InnoDB

Esta seção fornece informações sobre as funcionalidades de compressão de tabela `InnoDB` e compressão de página `InnoDB`. O recurso de compressão de página é conhecido como compressão transparente de página.

Usando as funcionalidades de compressão do `InnoDB`, você pode criar tabelas onde os dados são armazenados em formato comprimido. A compressão pode ajudar a melhorar tanto o desempenho bruto quanto a escalabilidade. A compressão significa que menos dados são transferidos entre o disco e a memória, e ocupa menos espaço no disco e na memória. Os benefícios são amplificados para tabelas com índices secundários, porque os dados do índice também são comprimidos. A compressão pode ser especialmente importante para dispositivos de armazenamento SSD, porque eles tendem a ter menor capacidade do que os dispositivos HDD.
