## 6.8 Programas Diversos

### 6.8.1 lz4_decompress — Descomprima saída mysqlpump comprimida por LZ4

A utilitária **lz4_decompress** descomprime a saída do **mysqlpump** que foi criada usando compressão LZ4.

Nota

O **lz4_decompress** é descontinuado a partir do MySQL 8.0.34; espere que ele seja removido em uma versão futura do MySQL. Isso ocorre porque o utilitário associado **mysqlpump** é descontinuado a partir do MySQL 8.0.34.

Nota

Se o MySQL foi configurado com a opção `-DWITH_LZ4=system`, o **lz4_decompress** não é construído. Nesse caso, o comando do sistema **lz4** pode ser usado em vez disso.

Invoque **lz4_decompress** da seguinte forma:

```
lz4_decompress input_file output_file
```

Exemplo:

```
mysqlpump --compress-output=LZ4 > dump.lz4
lz4_decompress dump.lz4 dump.txt
```

Para ver uma mensagem de ajuda, invoque **lz4_decompress** sem argumentos.

Para descomprimir a saída comprimida por ZLIB do **mysqlpump**, use **zlib_decompress**. Veja a Seção 6.8.3, “zlib_decompress — Descomprima a saída comprimida por ZLIB do mysqlpump”.

### 6.8.2 perror — Exibir informações do erro do MySQL

**perror** exibe a mensagem de erro para códigos de erro do MySQL ou do sistema operacional. Invoque **perror** da seguinte forma:

```
perror [options] errorcode ...
```

O **perror** tenta ser flexível na compreensão de seus argumentos. Por exemplo, para o erro `ER_WRONG_VALUE_FOR_VAR`, o **perror** entende qualquer um desses argumentos: `1231`, `001231`, `MY-1231` ou `MY-001231`, ou `ER_WRONG_VALUE_FOR_VAR`.

```
$> perror 1231
MySQL error code MY-001231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s'
can't be set to the value of '%-.200s'
```

Se um número de erro estiver na faixa onde os erros do MySQL e do sistema operacional se sobrepõem, o **perror** exibe ambas as mensagens de erro:

```
$> perror 1 13
OS error code   1:  Operation not permitted
MySQL error code MY-000001: Can't create/write to file '%s' (OS errno %d - %s)
OS error code  13:  Permission denied
MySQL error code MY-000013: Can't get stat of '%s' (OS errno %d - %s)
```

Para obter a mensagem de erro para um código de erro do MySQL Cluster, use o utilitário **ndb_perror**.

O significado das mensagens de erro do sistema pode depender do seu sistema operacional. Um código de erro específico pode significar coisas diferentes em diferentes sistemas operacionais.

O **perror** suporta as seguintes opções.

* `--help`, `--info`, `-I`, `-?`

Exibir uma mensagem de ajuda e sair.

* `--ndb`

Imprima a mensagem de erro para um código de erro do MySQL Cluster.

Essa opção foi removida no MySQL 8.0.13. Use o utilitário **ndb_perror** em vez disso.

* `--silent`, `-s`

Modo silencioso. Imprima apenas a mensagem de erro.

* `--verbose`, `-v`

Modo detalhado. Imprimir código de erro e mensagem. Este é o comportamento padrão.

* `--version`, `-V`

Exibir informações da versão e sair.

### 6.8.3 zlib_decompress — Descomprima o resultado comprimido ZLIB do mysqlpump

O utilitário **zlib_decompress** descomprime a saída do **mysqlpump** que foi criada usando compressão ZLIB.

Nota

O **zlib_decompress** é descontinuado a partir do MySQL 8.0.34; espere que ele seja removido em uma versão futura do MySQL. Isso ocorre porque o utilitário associado **mysqlpump** é descontinuado a partir do MySQL 8.0.34.

Nota

Se o MySQL foi configurado com a opção `-DWITH_ZLIB=system`, o **zlib_decompress** não é construído. Nesse caso, o comando **openssl zlib** pode ser usado em vez disso.

Invoque **zlib_decompress** da seguinte forma:

```
zlib_decompress input_file output_file
```

Exemplo:

```
mysqlpump --compress-output=ZLIB > dump.zlib
zlib_decompress dump.zlib dump.txt
```

Para ver uma mensagem de ajuda, invoque **zlib_decompress** sem argumentos.

Para descomprimir a saída comprimida com LZ4 do **mysqlpump**, use **lz4_decompress**. Veja a Seção 6.8.1, “lz4_decompress — Descomprima saída comprimida mysqlpump com LZ4”.