### 6.6.2 innochecksum — Ferramenta de Verificação de Criptografia de Arquivos InnoDB Offline

O **innochecksum** imprime criptografias de arquivos `InnoDB`. Esta ferramenta lê um arquivo de espaço de tabela `InnoDB`, calcula a criptografia para cada página, compara a criptografia calculada com a criptografia armazenada e relata desalinhamentos, que indicam páginas danificadas. Foi originalmente desenvolvido para acelerar a verificação da integridade dos arquivos de espaço de tabela após interrupções de energia, mas também pode ser usado após cópias de arquivos. Como desalinhamentos de criptografia fazem com que o `InnoDB` desligue deliberadamente um servidor em execução, pode ser preferível usar essa ferramenta em vez de esperar que um servidor em produção encontre as páginas danificadas.

O **innochecksum** não pode ser usado em arquivos de espaço de tabela que o servidor já tenha aberto. Para esses arquivos, você deve usar `CHECK TABLE` para verificar tabelas dentro do espaço de tabela. Tentar executar **innochecksum** em um espaço de tabela que o servidor já tenha aberto resulta em um erro "Impossível de bloquear o arquivo".

Se desalinhamentos de criptografia forem encontrados, restaure o espaço de tabela a partir de um backup ou inicie o servidor e tente usar o **mysqldump** para fazer um backup das tabelas dentro do espaço de tabela.

Invoque o **innochecksum** da seguinte forma:

```
innochecksum [options] file_name
```

#### Opções do innochecksum

O **innochecksum** suporta as seguintes opções. Para opções que se referem a números de página, os números são baseados em zero.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--help</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">false</code></td> </tr></tbody></table>

  Exibe a ajuda da linha de comando. Exemplo de uso:

  ```
  innochecksum --help
  ```

* `--info`, `-I`

<table frame="box" rules="all" summary="Propriedades para informações">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--info</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">false</code></td>
  </tr>
</table>

  Símbolo para `--help`. Exibe a ajuda da linha de comando. Exemplo de uso:

  ```
  innochecksum --info
  ```

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para versão">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code class="literal">--version</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Booleano</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code class="literal">false</code></td>
    </tr>
  </table>

  Exibe informações da versão. Exemplo de uso:

  ```
  innochecksum --version
  ```

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code class="literal">--verbose</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Booleano</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code class="literal">false</code></td>
    </tr>
  </table>

  Modo verbose; imprime um indicador de progresso no arquivo de log a cada cinco segundos. Para que o indicador de progresso seja impresso, o arquivo de log deve ser especificado usando a opção `--log`. Para ativar o modo `verbose`, execute:

  ```
  innochecksum --verbose
  ```

  Para desativar o modo verbose, execute:

  ```
  innochecksum --verbose=FALSE
  ```

  A opção `--verbose` e a opção `--log` podem ser especificadas ao mesmo tempo. Por exemplo:

  ```
  innochecksum --verbose --log=/var/lib/mysql/test/logtest.txt
  ```

  Para localizar as informações do indicador de progresso no arquivo de log, você pode realizar a seguinte busca:

  ```
  cat ./logtest.txt | grep -i "okay"
  ```

As informações do indicador de progresso no arquivo de log aparecem semelhantes ao seguinte:

```
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

  <table frame="box" rules="all" summary="Propriedades para contagem">
    <col style="width: 30%"/><col style="width: 70%"/>
    <tbody>
      <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--count</code></td> </tr>
      <tr><th>Tipo</th> <td>Nome base</td> </tr>
      <tr><th>Valor Padrão</th> <td><code class="literal">true</code></td> </tr>
    </tbody>
  </table>

  Imprima uma contagem do número de páginas no arquivo e saia. Exemplo de uso:

  ```
  innochecksum --count ../data/test/tab1.ibd
  ```

* `--start-page=num`, `-s num`

  <table frame="box" rules="all" summary="Propriedades para start-page">
    <col style="width: 30%"/><col style="width: 70%"/>
    <tbody>
      <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--start-page=#</code></td> </tr>
      <tr><th>Tipo</th> <td>Numérico</td> </tr>
      <tr><th>Valor Padrão</th> <td><code class="literal">0</code></td> </tr>
    </tbody>
  </table>

  Comece nesta página. Exemplo de uso:

  ```
  innochecksum --start-page=600 ../data/test/tab1.ibd
  ```

  ou:

  ```
  innochecksum -s 600 ../data/test/tab1.ibd
  ```

* `--end-page=num`, `-e num`

  <table frame="box" rules="all" summary="Propriedades para end-page">
    <col style="width: 30%"/><col style="width: 70%"/>
    <tbody>
      <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--end-page=#</code></td> </tr>
      <tr><th>Tipo</th> <td>Numérico</td> </tr>
      <tr><th>Valor Padrão</th> <td><code class="literal">0</code></td> </tr>
      <tr><th>Valor mínimo</th> <td><code class="literal">0</code></td> </tr>
      <tr><th>Valor máximo</th> <td><code class="literal">18446744073709551615</code></td> </tr>
    </tbody>
  </table>

  Termine nesta página. Exemplo de uso:

  ```
  innochecksum --end-page=700 ../data/test/tab1.ibd
  ```

  ou:

  ```
  innochecksum --p 700 ../data/test/tab1.ibd
  ```

* `--page=num`, `-p num`

<table frame="box" rules="all" summary="Propriedades para a verificação de página"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--page=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">0</code></td> </tr></tbody></table>

  Verifique apenas este número de página. Exemplo de uso:

  ```
  innochecksum --page=701 ../data/test/tab1.ibd
  ```

* `--strict-check`, `-C`

  <table frame="box" rules="all" summary="Propriedades para a verificação rigorosa"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--strict-check=algorithm</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">crc32</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code class="literal">innodb</code></p><p class="valid-value"><code class="literal">crc32</code></p><p class="valid-value"><code class="literal">none</code></p></td> </tr></tbody></table>

  Especifique um algoritmo de verificação de checksum rigoroso. As opções incluem `innodb`, `crc32` e `none`.

  Neste exemplo, o algoritmo de checksum `innodb` é especificado:

  ```
  innochecksum --strict-check=innodb ../data/test/tab1.ibd
  ```

  Neste exemplo, o algoritmo de checksum `crc32` é especificado:

  ```
  innochecksum -C crc32 ../data/test/tab1.ibd
  ```

As seguintes condições se aplicam:

  + Se você não especificar a opção `--strict-check`, o **innochecksum** valida contra `innodb`, `crc32` e `none`.

  + Se você especificar a opção `none`, apenas os checksums gerados por `none` são permitidos.

  + Se você especificar a opção `innodb`, apenas os checksums gerados por `innodb` são permitidos.

  + Se você especificar a opção `crc32`, apenas os checksums gerados por `crc32` são permitidos.

* `--no-check`, `-n`

<table frame="box" rules="all" summary="Propriedades para não verificação de checksums"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--no-check</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">false</code></td> </tr></tbody></table>

  Ignorar a verificação de checksums ao reescrever um checksum. Esta opção só pode ser usada com a opção **innochecksum** `--write`. Se a opção `--write` não for especificada, o **innochecksum** termina.

  Neste exemplo, um checksum `innodb` é reescrito para substituir um checksum inválido:

  ```
  innochecksum --no-check --write innodb ../data/test/tab1.ibd
  ```

* `--allow-mismatches`, `-a`

  <table frame="box" rules="all" summary="Propriedades para info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">false</code></td> </tr></tbody></table>0

  O número máximo de desalinhamentos de checksums permitidos antes de o **innochecksum** terminar. O valor padrão é 0. Se `--allow-mismatches=`*`N`*, onde `N>=0`, *`N`* desalinhamentos são permitidos e o **innochecksum** termina em `N+1`. Quando `--allow-mismatches` é definido como 0, o **innochecksum** termina no primeiro desalinhamento de checksums.

  Neste exemplo, um checksum `innodb` existente é reescrito para definir `--allow-mismatches` como 1.

  ```
  innochecksum --allow-mismatches=1 --write innodb ../data/test/tab1.ibd
  ```

Com `--allow-mismatches` definido para 1, se houver uma discrepância na página 600 e outra na página 700 em um arquivo com 1000 páginas, o checksum é atualizado para as páginas 0-599 e 601-699. Como `--allow-mismatches` está definido para 1, o checksum tolera a primeira discrepância e termina na segunda discrepância, deixando a página 600 e as páginas 700-999 inalteradas.

* `--write=name`, `-w num`

  <table frame="box" rules="all" summary="Propriedades para informações"><tr><th>Formato de linha de comando</th> <td><code class="literal">--info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">false</code></td> </tr></table>1

  Reescrever um checksum. Ao reescrever um checksum inválido, a opção `--no-check` deve ser usada juntamente com a opção `--write`. A opção `--no-check` informa ao **innochecksum** para ignorar a verificação do checksum inválido. Você não precisa especificar a opção `--no-check` se o checksum atual for válido.

  Um algoritmo deve ser especificado ao usar a opção `--write`. Os valores possíveis para a opção `--write` são:

  + `innodb`: Um checksum calculado em software, usando o algoritmo original do `InnoDB`.

  + `crc32`: Um checksum calculado usando o algoritmo `crc32`, possivelmente com assistência de hardware.

  + `none`: Um número constante.

  A opção `--write` reescreve páginas inteiras no disco. Se o novo checksum for idêntico ao checksum existente, o novo checksum não é escrito no disco para minimizar o I/O.

  **innochecksum** obtém um bloqueio exclusivo quando a opção `--write` é usada.

  Neste exemplo, um checksum `crc32` é escrito para `tab1.ibd`:

  ```
  innochecksum -w crc32 ../data/test/tab1.ibd
  ```

Neste exemplo, um checksum `crc32` é reescrito para substituir um checksum `crc32` inválido:

  ```
  innochecksum --no-check --write crc32 ../data/test/tab1.ibd
  ```

* `--page-type-summary`, `-S`

  <table frame="box" rules="all" summary="Propriedades para informações"><tr><th>Formato de linha de comando</th> <td><code class="literal">--info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">false</code></td> </tr></tbody></table>2

  Exibir um contador de cada tipo de página em um espaço de páginas. Exemplo de uso:

  ```
  innochecksum --page-type-summary ../data/test/tab1.ibd
  ```

  Saída de amostra para `--page-type-summary`:

  ```
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

  <table frame="box" rules="all" summary="Propriedades para informações"><tr><th>Formato de linha de comando</th> <td><code class="literal">--info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">false</code></td> </tr></tbody></table>3

  Exibir as informações do tipo de página para cada página em um espaço de páginas no `stderr` ou `stdout`. Exemplo de uso:

  ```
  innochecksum --page-type-dump=/tmp/a.txt ../data/test/tab1.ibd
  ```

* `--log`, `-l`

  <table frame="box" rules="all" summary="Propriedades para informações"><tr><th>Formato de linha de comando</th> <td><code class="literal">--info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">false</code></td> </tr></tbody></table>4

  Saída de log para a ferramenta **innochecksum**. Um nome de arquivo de log deve ser fornecido. A saída de log contém valores de checksum para cada página do espaço de páginas. Para tabelas não compactadas, os valores LSN também são fornecidos. Exemplo de uso:

  ```
  innochecksum --log=/tmp/log.txt ../data/test/tab1.ibd
  ```

  ou:

  ```
  innochecksum -l /tmp/log.txt ../data/test/tab1.ibd
  ```

* Opção `-`.

Especifique a opção `-` para ler do padrão de entrada. Se a opção `-` estiver ausente quando se espera que seja lida a partir do padrão de entrada, o **innochecksum** imprime informações de uso do **innochecksum**, indicando que a opção `-` foi omitida. Exemplos de uso:

```
  cat t1.ibd | innochecksum -
  ```

Neste exemplo, o **innochecksum** escreve o algoritmo de verificação de checksum `crc32` no arquivo `a.ibd` sem alterar o arquivo original `t1.ibd`.

```
  cat t1.ibd | innochecksum --write=crc32 - > a.ibd
  ```

#### Executando o innochecksum em vários arquivos de espaço de tabelas definidos pelo usuário

Os seguintes exemplos demonstram como executar o **innochecksum** em vários arquivos de espaço de tabelas definidos pelo usuário (arquivos `.ibd`).

Execute o **innochecksum** para todos os arquivos de espaço de tabelas (`.ibd`) no banco de dados "test":

```
innochecksum ./data/test/*.ibd
```

Execute o **innochecksum** para todos os arquivos de espaço de tabelas (arquivos `.ibd`) que têm um nome de arquivo começando com "t":

```
innochecksum ./data/test/t*.ibd
```

Execute o **innochecksum** para todos os arquivos de espaço de tabelas (arquivos `.ibd`) no diretório `data`:

```
innochecksum ./data/*/*.ibd
```

Observação

Executar o **innochecksum** em vários arquivos de espaço de tabelas definidos pelo usuário não é suportado em sistemas operacionais Windows, pois as janelas do Windows, como o **cmd.exe**, não suportam a expansão de padrões globais. Em sistemas Windows, o **innochecksum** deve ser executado separadamente para cada arquivo de espaço de tabelas definido pelo usuário. Por exemplo:

```
innochecksum.exe t1.ibd
innochecksum.exe t2.ibd
innochecksum.exe t3.ibd
```

#### Executando o innochecksum em vários arquivos de espaço de tabelas do sistema

Por padrão, há apenas um arquivo de espaço de tabelas `InnoDB` (`ibdata1`) do sistema, mas vários arquivos para o espaço de tabelas do sistema podem ser definidos usando a opção `innodb_data_file_path`. No exemplo a seguir, três arquivos para o espaço de tabelas do sistema são definidos usando a opção `innodb_data_file_path`: `ibdata1`, `ibdata2` e `ibdata3`.

```
./bin/mysqld --no-defaults --innodb-data-file-path="ibdata1:10M;ibdata2:10M;ibdata3:10M:autoextend"
```

Os três arquivos (`ibdata1`, `ibdata2` e `ibdata3`) formam um espaço de tabelas lógico do sistema. Para executar o **innochecksum** em vários arquivos que formam um espaço de tabelas lógico do sistema, o **innochecksum** requer a opção `-` para ler os arquivos do espaço de tabelas do padrão de entrada, o que é equivalente a concatenar vários arquivos para criar um único arquivo. Para o exemplo fornecido acima, o seguinte comando **innochecksum** seria usado:

```
cat ibdata* | innochecksum -
```

Consulte as informações sobre as opções do **innochecksum** para obter mais informações sobre a opção `-`.

Nota

Executar o **innochecksum** em vários arquivos no mesmo espaço de tabelas não é suportado nos sistemas operacionais Windows, pois as janelas do Windows, como o **cmd.exe**, não suportam a expansão de padrões globais. Nos sistemas Windows, o **innochecksum** deve ser executado separadamente para cada arquivo do espaço de tabelas do sistema. Por exemplo:

```
innochecksum.exe ibdata1
innochecksum.exe ibdata2
innochecksum.exe ibdata3
```