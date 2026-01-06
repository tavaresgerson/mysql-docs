### 4.8.5 zlib\_decompress — Descompactar o resultado comprimido do mysqlpump com o formato ZLIB

O utilitário **zlib\_decompress** descomprime a saída do **mysqlpump** que foi criada usando a compressão ZLIB. O **zlib\_decompress** foi adicionado no MySQL 5.7.10.

Invoque **zlib\_decompress** da seguinte forma:

```sql
zlib_decompress input_file output_file
```

Exemplo:

```sql
mysqlpump --compress-output=ZLIB > dump.zlib
zlib_decompress dump.zlib dump.txt
```

Para ver uma mensagem de ajuda, invoque **zlib\_decompress** sem argumentos.

Para descomprimir a saída comprimida com LZ4 do **mysqlpump**, use **lz4\_decompress**. Veja a Seção 4.8.1, “lz4\_decompress — Descomprima a saída comprimida com LZ4 do mysqlpump”.
