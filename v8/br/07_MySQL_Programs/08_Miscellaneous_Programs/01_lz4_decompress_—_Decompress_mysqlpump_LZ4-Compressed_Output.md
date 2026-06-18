### 6.8.1 lz4\_decompress — Descompactar saída comprimida com LZ4 do mysqlpump

A ferramenta **lz4\_decompress** descomprime a saída do **mysqlpump** que foi criada usando a compressão LZ4.

Nota

O **lz4\_decompress** está desatualizado a partir do MySQL 8.0.34; espere que ele seja removido em uma versão futura do MySQL. Isso ocorre porque o utilitário **mysqlpump** associado está desatualizado a partir do MySQL 8.0.34.

Nota

Se o MySQL foi configurado com a opção `-DWITH_LZ4=system`, o **lz4\_decompress** não é construído. Nesse caso, o comando **lz4** do sistema pode ser usado.

Invoque **lz4\_decompress** da seguinte forma:

```
lz4_decompress input_file output_file
```

Exemplo:

```
mysqlpump --compress-output=LZ4 > dump.lz4
lz4_decompress dump.lz4 dump.txt
```

Para ver uma mensagem de ajuda, invoque **lz4\_decompress** sem argumentos.

Para descomprimir a saída comprimida ZLIB do **mysqlpump**, use **zlib\_decompress**. Veja a Seção 6.8.3, “zlib\_decompress — Descomprima a saída comprimida ZLIB do mysqlpump”.
