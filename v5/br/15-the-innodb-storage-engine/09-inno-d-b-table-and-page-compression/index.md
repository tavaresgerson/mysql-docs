## 14.9 InnoDB Table e Page Compression

14.9.1 InnoDB Table Compression

14.9.2 InnoDB Page Compression

Esta seção fornece informações sobre os recursos de InnoDB table compression e InnoDB page compression. O recurso de Page Compression é referido como transparent page compression.

Usando os recursos de Compression do `InnoDB`, você pode criar tables onde os dados são armazenados de forma compactada. O Compression pode ajudar a melhorar tanto o raw performance quanto a scalability. O Compression significa que menos dados são transferidos entre o disco e a memória, e ocupam menos espaço no disco e na memória. Os benefícios são amplificados para tables com secondary Indexes, porque os dados do Index também são compactados. O Compression pode ser especialmente importante para dispositivos de armazenamento SSD, porque eles tendem a ter uma capacidade menor do que os dispositivos HDD.