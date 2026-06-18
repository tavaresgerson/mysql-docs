### 4.8.5 zlib_decompress — Descompactar o resultado comprimido do mysqlpump com o formato ZLIB

O utilitário **zlib_decompress** descomprime a saída do **mysqlpump** que foi criada usando a compressão ZLIB. O **zlib_decompress** foi adicionado no MySQL 5.7.10.

Invoque **zlib_decompress** da seguinte forma:

```sh
zlib_decompress input_file output_file
```

Exemplo:

```sh
mysqlpump --compress-output=ZLIB > dump.zlib
zlib_decompress dump.zlib dump.txt
```

Para ver uma mensagem de ajuda, invoque **zlib_decompress** sem argumentos.

Para descomprimir a saída comprimida com LZ4 do **mysqlpump**, use **lz4_decompress**. Veja a Seção 4.8.1, “lz4_decompress — Descomprima a saída comprimida com LZ4 do mysqlpump”.
