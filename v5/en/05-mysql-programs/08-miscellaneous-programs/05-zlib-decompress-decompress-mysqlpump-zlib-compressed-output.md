### 4.8.5 zlib_decompress — Descomprimir Output Comprimido com ZLIB do mysqlpump

O utilitário **zlib_decompress** descompacta o *Output* do **mysqlpump** que foi criado usando compressão ZLIB. **zlib_decompress** foi adicionado no MySQL 5.7.10.

Invoque **zlib_decompress** da seguinte maneira:

```sql
zlib_decompress input_file output_file
```

Exemplo:

```sql
mysqlpump --compress-output=ZLIB > dump.zlib
zlib_decompress dump.zlib dump.txt
```

Para visualizar uma mensagem de ajuda, invoque **zlib_decompress** sem argumentos.

Para descompactar o *Output* comprimido com LZ4 do **mysqlpump**, use **lz4_decompress**. Consulte a Seção 4.8.1, “lz4_decompress — Descomprimir Output Comprimido com LZ4 do mysqlpump”.