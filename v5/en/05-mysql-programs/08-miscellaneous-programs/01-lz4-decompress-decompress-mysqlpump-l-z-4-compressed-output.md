### 4.8.1 lz4_decompress — Descomprimir Saída Comprimida em LZ4 do mysqlpump

A utilidade **lz4_decompress** descomprime a saída do **mysqlpump** que foi criada usando a compressão LZ4. **lz4_decompress** foi adicionada no MySQL 5.7.10.

Invoque **lz4_decompress** da seguinte forma:

```sql
lz4_decompress input_file output_file
```

Exemplo:

```sql
mysqlpump --compress-output=LZ4 > dump.lz4
lz4_decompress dump.lz4 dump.txt
```

Para visualizar uma mensagem de ajuda, invoque **lz4_decompress** sem argumentos.

Para descomprimir a saída comprimida em ZLIB do **mysqlpump**, use **zlib_decompress**. Consulte Seção 4.8.5, “zlib_decompress — Descomprimir Saída Comprimida em ZLIB do mysqlpump”.