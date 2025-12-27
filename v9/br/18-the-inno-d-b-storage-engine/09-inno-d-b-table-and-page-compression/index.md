## 17.9 Compressão de Tabelas e Páginas InnoDB

17.9.1 Compressão de Tabelas InnoDB

17.9.2 Compressão de Páginas InnoDB

Esta seção fornece informações sobre as funcionalidades de compressão de tabelas `InnoDB` e compressão de páginas `InnoDB`. O recurso de compressão de páginas também é conhecido como compressão transparente de páginas.

Ao usar as funcionalidades de compressão de `InnoDB`, você pode criar tabelas onde os dados são armazenados em formato comprimido. A compressão pode ajudar a melhorar tanto o desempenho bruto quanto a escalabilidade. A compressão significa que menos dados são transferidos entre o disco e a memória, e ocupa menos espaço no disco e na memória. Os benefícios são amplificados para tabelas com índices secundários, porque os dados do índice também são comprimidos. A compressão pode ser especialmente importante para dispositivos de armazenamento SSD, pois eles tendem a ter menor capacidade do que dispositivos HDD.