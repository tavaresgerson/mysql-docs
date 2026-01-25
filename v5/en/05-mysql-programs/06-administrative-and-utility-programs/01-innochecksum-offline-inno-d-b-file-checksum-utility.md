### 4.6.1 innochecksum — Utilitário Offline de Checksum para Arquivos InnoDB

**innochecksum** imprime Checksums para arquivos `InnoDB`. Essa ferramenta lê um arquivo de tablespace `InnoDB`, calcula o Checksum para cada Page, compara o Checksum calculado com o Checksum armazenado e reporta incompatibilidades (*mismatches*), que indicam Pages danificadas. Foi originalmente desenvolvida para acelerar a verificação da integridade de arquivos de tablespace após quedas de energia, mas também pode ser usada após cópias de arquivos. Como incompatibilidades de Checksum fazem com que o `InnoDB` desligue propositalmente um servidor em execução, pode ser preferível usar esta ferramenta em vez de esperar que um servidor em produção encontre as Pages danificadas.

**innochecksum** não pode ser usado em arquivos de tablespace que o servidor já abriu. Para tais arquivos, você deve usar `CHECK TABLE` para verificar tabelas dentro do tablespace. Tentar executar **innochecksum** em um tablespace que o servidor já tem aberto resulta em um erro `Unable to lock file`.

Se forem encontradas incompatibilidades de Checksum, restaure o tablespace a partir do backup ou inicie o servidor e tente usar **mysqldump** para fazer um backup das tabelas dentro do tablespace.

Invoque **innochecksum** desta forma:

```sql
innochecksum [options] file_name
```

#### Opções do innochecksum

**innochecksum** suporta as seguintes opções. Para opções que se referem a números de Page, os números são baseados em zero.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para help"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> </tr></thead><tbody><tr><td><code>--help</code></td> <td>Booleano</td> <td><code>false</code></td> </tr></tbody></table>

  Exibe a ajuda da linha de comando. Exemplo de uso:

  ```sql
  innochecksum --help
  ```

* `--info`, `-I`

  <table frame="box" rules="all" summary="Propriedades para info"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> </tr></thead><tbody><tr><td><code>--info</code></td> <td>Booleano</td> <td><code>false</code></td> </tr></tbody></table>

  Sinônimo para `--help`. Exibe a ajuda da linha de comando. Exemplo de uso:

  ```sql
  innochecksum --info
  ```

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para version"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> </tr></thead><tbody><tr><td><code>--version</code></td> <td>Booleano</td> <td><code>false</code></td> </tr></tbody></table>

  Exibe informações de versão. Exemplo de uso:

  ```sql
  innochecksum --version
  ```

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> </tr></thead><tbody><tr><td><code>--verbose</code></td> <td>Booleano</td> <td><code>false</code></td> </tr></tbody></table>

  Modo Verbose (detalhado); imprime um indicador de progresso no arquivo de log a cada cinco segundos. Para que o indicador de progresso seja impresso, o arquivo de log deve ser especificado usando a opção `--log`. Para ativar o modo `verbose`, execute:

  ```sql
  innochecksum --verbose
  ```

  Para desativar o modo verbose, execute:

  ```sql
  innochecksum --verbose=FALSE
  ```

  As opções `--verbose` e `--log` podem ser especificadas ao mesmo tempo. Por exemplo:

  ```sql
  innochecksum --verbose --log=/var/lib/mysql/test/logtest.txt
  ```

  Para localizar as informações do indicador de progresso no arquivo de log, você pode realizar a seguinte busca:

  ```sql
  cat ./logtest.txt | grep -i "okay"
  ```

  As informações do indicador de progresso no arquivo de log aparecem de forma semelhante ao seguinte:

  ```sql
  page 1663 okay: 2.863% done
  page 8447 okay: 14.537% done
  page 13695 okay: 23.568% done
  page 18815 okay: 32.379% done
  page 23039 okay: 39.648% done
  page 28351 okay: 48.789% done
  page 33023 okay: 56.828% done
  page 37951 okay: 65.308% done
  page 44095 okay: 75.881% done
  page 49407 okay: 85.022% done
  page 54463 okay: 93.722% done
  ...
  ```

* `--count`, `-c`

  <table frame="box" rules="all" summary="Propriedades para count"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> </tr></thead><tbody><tr><td><code>--count</code></td> <td>Nome Base</td> <td><code>true</code></td> </tr></tbody></table>

  Imprime a contagem do número de Pages no arquivo e sai. Exemplo de uso:

  ```sql
  innochecksum --count ../data/test/tab1.ibd
  ```

* `--start-page=num`, `-s num`

  <table frame="box" rules="all" summary="Propriedades para start-page"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> </tr></thead><tbody><tr><td><code>--start-page=#</code></td> <td>Numérico</td> <td><code>0</code></td> </tr></tbody></table>

  Começa neste número de Page. Exemplo de uso:

  ```sql
  innochecksum --start-page=600 ../data/test/tab1.ibd
  ```

  ou:

  ```sql
  innochecksum -s 600 ../data/test/tab1.ibd
  ```

* `--end-page=num`, `-e num`

  <table frame="box" rules="all" summary="Propriedades para end-page"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> <th>Valor Mínimo</th> <th>Valor Máximo</th> </tr></thead><tbody><tr><td><code>--end-page=#</code></td> <td>Numérico</td> <td><code>0</code></td> <td><code>0</code></td> <td><code>18446744073709551615</code></td> </tr></tbody></table>

  Termina neste número de Page. Exemplo de uso:

  ```sql
  innochecksum --end-page=700 ../data/test/tab1.ibd
  ```

  ou:

  ```sql
  innochecksum --p 700 ../data/test/tab1.ibd
  ```

* `--page=num`, `-p num`

  <table frame="box" rules="all" summary="Propriedades para page"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> </tr></thead><tbody><tr><td><code>--page=#</code></td> <td>Inteiro</td> <td><code>0</code></td> </tr></tbody></table>

  Verifica apenas este número de Page. Exemplo de uso:

  ```sql
  innochecksum --page=701 ../data/test/tab1.ibd
  ```

* `--strict-check`, `-C`

  <table frame="box" rules="all" summary="Propriedades para strict-check"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> <th>Valores Válidos</th> </tr></thead><tbody><tr><td><code>--strict-check=algorithm</code></td> <td>Enumeração</td> <td><code>crc32</code></td> <td><p><code>innodb</code></p><p><code>crc32</code></p><p><code>none</code></p></td> </tr></tbody></table>

  Especifica um algoritmo de Checksum estrito. As opções incluem `innodb`, `crc32` e `none`.

  Neste exemplo, o algoritmo de Checksum `innodb` é especificado:

  ```sql
  innochecksum --strict-check=innodb ../data/test/tab1.ibd
  ```

  Neste exemplo, o algoritmo de Checksum `crc32` é especificado:

  ```sql
  innochecksum -C crc32 ../data/test/tab1.ibd
  ```

  As seguintes condições se aplicam:

  + Se você não especificar a opção `--strict-check`, **innochecksum** valida contra `innodb`, `crc32` e `none`.

  + Se você especificar a opção `none`, apenas Checksums gerados por `none` são permitidos.

  + Se você especificar a opção `innodb`, apenas Checksums gerados por `innodb` são permitidos.

  + Se você especificar a opção `crc32`, apenas Checksums gerados por `crc32` são permitidos.

* `--no-check`, `-n`

  <table frame="box" rules="all" summary="Propriedades para no-check"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> </tr></thead><tbody><tr><td><code>--no-check</code></td> <td>Booleano</td> <td><code>false</code></td> </tr></tbody></table>

  Ignora a verificação do Checksum ao reescrever um Checksum. Esta opção só pode ser usada com a opção `--write` do **innochecksum**. Se a opção `--write` não for especificada, **innochecksum** é encerrado.

  Neste exemplo, um Checksum `innodb` é reescrito para substituir um Checksum inválido:

  ```sql
  innochecksum --no-check --write innodb ../data/test/tab1.ibd
  ```

* `--allow-mismatches`, `-a`

  <table frame="box" rules="all" summary="Propriedades para info"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> </tr></thead><tbody><tr><td><code>--info</code></td> <td>Booleano</td> <td><code>false</code></td> </tr></tbody></table>

  O número máximo de incompatibilidades de Checksum permitidas antes que o **innochecksum** seja encerrado. A configuração padrão é 0. Se `--allow-mismatches=`*`N`*, onde `N>=0`, *`N`* incompatibilidades são permitidas e **innochecksum** é encerrado em `N+1`. Quando `--allow-mismatches` é definido como 0, **innochecksum** é encerrado na primeira incompatibilidade de Checksum.

  Neste exemplo, um Checksum `innodb` existente é reescrito para definir `--allow-mismatches` como 1.

  ```sql
  innochecksum --allow-mismatches=1 --write innodb ../data/test/tab1.ibd
  ```

  Com `--allow-mismatches` definido como 1, se houver uma incompatibilidade na Page 600 e outra na Page 700 em um arquivo com 1000 Pages, o Checksum é atualizado para as Pages 0-599 e 601-699. Como `--allow-mismatches` está definido como 1, o Checksum tolera a primeira incompatibilidade e é encerrado na segunda, deixando a Page 600 e as Pages 700-999 inalteradas.

* `--write=name`, `-w num`

  <table frame="box" rules="all" summary="Propriedades para info"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> </tr></thead><tbody><tr><td><code>--info</code></td> <td>Booleano</td> <td><code>false</code></td> </tr></tbody></table>

  Reescreve um Checksum. Ao reescrever um Checksum inválido, a opção `--no-check` deve ser usada juntamente com a opção `--write`. A opção `--no-check` instrui o **innochecksum** a ignorar a verificação do Checksum inválido. Você não precisa especificar a opção `--no-check` se o Checksum atual for válido.

  Um algoritmo deve ser especificado ao usar a opção `--write`. Os valores possíveis para a opção `--write` são:

  + `innodb`: Um Checksum calculado em software, usando o algoritmo original do `InnoDB`.

  + `crc32`: Um Checksum calculado usando o algoritmo `crc32`, possivelmente feito com assistência de hardware.

  + `none`: Um número constante.

  A opção `--write` reescreve Pages inteiras no disco. Se o novo Checksum for idêntico ao Checksum existente, o novo Checksum não é escrito no disco para minimizar I/O.

  **innochecksum** obtém um Lock exclusivo quando a opção `--write` é usada.

  Neste exemplo, um Checksum `crc32` é escrito para `tab1.ibd`:

  ```sql
  innochecksum -w crc32 ../data/test/tab1.ibd
  ```

  Neste exemplo, um Checksum `crc32` é reescrito para substituir um Checksum `crc32` inválido:

  ```sql
  innochecksum --no-check --write crc32 ../data/test/tab1.ibd
  ```

* `--page-type-summary`, `-S`

  <table frame="box" rules="all" summary="Propriedades para info"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> </tr></thead><tbody><tr><td><code>--info</code></td> <td>Booleano</td> <td><code>false</code></td> </tr></tbody></table>

  Exibe uma contagem de cada tipo de Page em um tablespace. Exemplo de uso:

  ```sql
  innochecksum --page-type-summary ../data/test/tab1.ibd
  ```

  Exemplo de saída para `--page-type-summary`:

  ```sql
  File::../data/test/tab1.ibd
  ================PAGE TYPE SUMMARY==============
  #PAGE_COUNT PAGE_TYPE
  ===============================================
         2        Index page
         0        Undo log page
         1        Inode page
         0        Insert buffer free list page
         2        Freshly allocated page
         1        Insert buffer bitmap
         0        System page
         0        Transaction system page
         1        File Space Header
         0        Extent descriptor page
         0        BLOB page
         0        Compressed BLOB page
         0        Other type of page
  ===============================================
  Additional information:
  Undo page type: 0 insert, 0 update, 0 other
  Undo page state: 0 active, 0 cached, 0 to_free, 0 to_purge, 0 prepared, 0 other
  ```

* `--page-type-dump`, `-D`

  <table frame="box" rules="all" summary="Propriedades para info"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> </tr></thead><tbody><tr><td><code>--info</code></td> <td>Booleano</td> <td><code>false</code></td> </tr></tbody></table>

  Despeja as informações do tipo de Page para cada Page em um tablespace para `stderr` ou `stdout`. Exemplo de uso:

  ```sql
  innochecksum --page-type-dump=/tmp/a.txt ../data/test/tab1.ibd
  ```

* `--log`, `-l`

  <table frame="box" rules="all" summary="Propriedades para info"><thead><tr><th>Formato da Linha de Comando</th> <th>Tipo</th> <th>Valor Padrão</th> </tr></thead><tbody><tr><td><code>--info</code></td> <td>Booleano</td> <td><code>false</code></td> </tr></tbody></table>

  Saída de log para a ferramenta **innochecksum**. Um nome de arquivo de log deve ser fornecido. A saída de log contém valores de Checksum para cada Page do tablespace. Para tabelas não compactadas, os valores LSN também são fornecidos. O `--log` substitui a opção `--debug`, que estava disponível em releases anteriores. Exemplo de uso:

  ```sql
  innochecksum --log=/tmp/log.txt ../data/test/tab1.ibd
  ```

  ou:

  ```sql
  innochecksum -l /tmp/log.txt ../data/test/tab1.ibd
  ```

* Opção `-`.

  Especifique a opção `-` para ler da entrada padrão (standard input). Se a opção `-` estiver ausente quando for esperado “leitura da entrada padrão”, **innochecksum** imprime informações de uso do **innochecksum** indicando que a opção “-” foi omitida. Exemplos de uso:

  ```sql
  cat t1.ibd | innochecksum -
  ```

  Neste exemplo, **innochecksum** escreve o algoritmo de Checksum `crc32` para `a.ibd` sem alterar o arquivo original `t1.ibd`.

  ```sql
  cat t1.ibd | innochecksum --write=crc32 - > a.ibd
  ```

#### Executando innochecksum em Múltiplos Arquivos de Tablespace Definidos pelo Usuário

Os exemplos a seguir demonstram como executar **innochecksum** em múltiplos arquivos de tablespace definidos pelo usuário (arquivos `.ibd`).

Execute **innochecksum** para todos os arquivos de tablespace (`.ibd`) no Database “test”:

```sql
innochecksum ./data/test/*.ibd
```

Execute **innochecksum** para todos os arquivos de tablespace (arquivos `.ibd`) cujo nome de arquivo começa com “t”:

```sql
innochecksum ./data/test/t*.ibd
```

Execute **innochecksum** para todos os arquivos de tablespace (arquivos `.ibd`) no diretório `data`:

```sql
innochecksum ./data/*/*.ibd
```

Nota

A execução de **innochecksum** em múltiplos arquivos de tablespace definidos pelo usuário não é suportada em sistemas operacionais Windows, pois shells do Windows como **cmd.exe** não suportam expansão de padrões glob (*glob pattern expansion*). Em sistemas Windows, **innochecksum** deve ser executado separadamente para cada arquivo de tablespace definido pelo usuário. Por exemplo:

```sql
innochecksum.exe t1.ibd
innochecksum.exe t2.ibd
innochecksum.exe t3.ibd
```

#### Executando innochecksum em Múltiplos Arquivos de System Tablespace

Por padrão, existe apenas um arquivo de system tablespace `InnoDB` (`ibdata1`), mas múltiplos arquivos para o system tablespace podem ser definidos usando a opção `innodb_data_file_path`. No exemplo a seguir, três arquivos para o system tablespace são definidos usando a opção `innodb_data_file_path`: `ibdata1`, `ibdata2` e `ibdata3`.

```sql
./bin/mysqld --no-defaults --innodb-data-file-path="ibdata1:10M;ibdata2:10M;ibdata3:10M:autoextend"
```

Os três arquivos (`ibdata1`, `ibdata2` e `ibdata3`) formam um único system tablespace lógico. Para executar **innochecksum** em múltiplos arquivos que formam um único system tablespace lógico, **innochecksum** requer a opção `-` para ler arquivos de tablespace a partir da entrada padrão (standard input), o que é equivalente a concatenar múltiplos arquivos para criar um único arquivo. Para o exemplo fornecido acima, o seguinte comando **innochecksum** seria usado:

```sql
cat ibdata* | innochecksum -
```

Consulte as informações das opções do **innochecksum** para mais detalhes sobre a opção “-”.

Nota

A execução de **innochecksum** em múltiplos arquivos no mesmo tablespace não é suportada em sistemas operacionais Windows, pois shells do Windows como **cmd.exe** não suportam expansão de padrões glob (*glob pattern expansion*). Em sistemas Windows, **innochecksum** deve ser executado separadamente para cada arquivo de system tablespace. Por exemplo:

```sql
innochecksum.exe ibdata1
innochecksum.exe ibdata2
innochecksum.exe ibdata3
```
