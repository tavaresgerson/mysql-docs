### 6.8.3 zlib\_decompress — Descompactar o resultado comprimido do mysqlpump com o formato ZLIB

O utilitário **zlib\_decompress** descomprime a saída do **mysqlpump** que foi criada usando a compressão ZLIB.

Nota

O **zlib\_decompress** está desatualizado a partir do MySQL 8.0.34; espere que ele seja removido em uma versão futura do MySQL. Isso ocorre porque o utilitário **mysqlpump** associado está desatualizado a partir do MySQL 8.0.34.

Nota

Se o MySQL foi configurado com a opção `-DWITH_ZLIB=system`, o **zlib\_decompress** não é construído. Nesse caso, o comando **openssl zlib** do sistema pode ser usado.

Invoque **zlib\_decompress** da seguinte forma:

```
zlib_decompress input_file output_file
```

Exemplo:

```
mysqlpump --compress-output=ZLIB > dump.zlib
zlib_decompress dump.zlib dump.txt
```

Para ver uma mensagem de ajuda, invoque **zlib\_decompress** sem argumentos.

Para descomprimir a saída comprimida com LZ4 do **mysqlpump**, use **lz4\_decompress**. Veja a Seção 6.8.1, “lz4\_decompress — Descomprima a saída comprimida com LZ4 do mysqlpump”.
