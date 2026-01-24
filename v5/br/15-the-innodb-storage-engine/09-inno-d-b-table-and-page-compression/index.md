## 14.9 InnoDB Table and Page Compression

14.9.1 InnoDB Table Compression

14.9.2 InnoDB Page Compression

This section provides information about the `InnoDB` table compression and `InnoDB` page compression features. The page compression feature is referred to as transparent page compression.

Using the compression features of `InnoDB`, you can create tables where the data is stored in compressed form. Compression can help to improve both raw performance and scalability. The compression means less data is transferred between disk and memory, and takes up less space on disk and in memory. The benefits are amplified for tables with secondary indexes, because index data is compressed also. Compression can be especially important for SSD storage devices, because they tend to have lower capacity than HDD devices.
