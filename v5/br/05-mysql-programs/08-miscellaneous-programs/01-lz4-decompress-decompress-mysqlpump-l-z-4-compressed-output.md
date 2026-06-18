### 4.8.1 lz4_decompress — Descompactar saída comprimida do mysqlpump com LZ4

O utilitário **lz4_decompress** descomprime a saída do **mysqlpump** que foi criada usando a compressão LZ4. O **lz4_decompress** foi adicionado no MySQL 5.7.10.

Invoque **lz4_decompress** da seguinte forma:

```sh
lz4_decompress input_file output_file
```

Exemplo:

```sh
mysqlpump --compress-output=LZ4 > dump.lz4
lz4_decompress dump.lz4 dump.txt
```

Para ver uma mensagem de ajuda, invoque **lz4_decompress** sem argumentos.

Para descomprimir a saída comprimida ZLIB do **mysqlpump**, use **zlib_decompress**. Veja a Seção 4.8.5, “zlib_decompress — Descomprima a saída comprimida ZLIB do mysqlpump”.
