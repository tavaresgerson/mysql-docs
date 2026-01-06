### 4.8.1 lz4\_decompress — Descompactar saída comprimida do mysqlpump com LZ4

O utilitário **lz4\_decompress** descomprime a saída do **mysqlpump** que foi criada usando a compressão LZ4. O **lz4\_decompress** foi adicionado no MySQL 5.7.10.

Invoque **lz4\_decompress** da seguinte forma:

```sql
lz4_decompress input_file output_file
```

Exemplo:

```sql
mysqlpump --compress-output=LZ4 > dump.lz4
lz4_decompress dump.lz4 dump.txt
```

Para ver uma mensagem de ajuda, invoque **lz4\_decompress** sem argumentos.

Para descomprimir a saída comprimida ZLIB do **mysqlpump**, use **zlib\_decompress**. Veja a Seção 4.8.5, “zlib\_decompress — Descomprima a saída comprimida ZLIB do mysqlpump”.
