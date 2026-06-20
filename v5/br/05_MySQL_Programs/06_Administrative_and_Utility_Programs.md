## 4.6 Programas Administrativos e Utilitários

Esta seção descreve programas administrativos e programas que realizam operações de utilidade diversificadas.

### 4.6.1 innochecksum — Ferramenta de verificação de checksum de arquivo InnoDB off-line

O **innochecksum** imprime checksums para arquivos `InnoDB`. Esta ferramenta lê um arquivo de espaço de tabela `InnoDB`, calcula o checksum de cada página, compara o checksum calculado com o checksum armazenado e reporta desalinhamentos, que indicam páginas danificadas. Foi originalmente desenvolvido para acelerar a verificação da integridade dos arquivos de espaço de tabela após interrupções de energia, mas também pode ser usado após cópias de arquivos. Como desalinhamentos de checksum causam `InnoDB` a desligar deliberadamente um servidor em execução, pode ser preferível usar essa ferramenta em vez de esperar que um servidor em produção encontre as páginas danificadas.

**innochecksum** não pode ser usado em arquivos de tablespace que o servidor já tenha aberto. Para esses arquivos, você deve usar `CHECK TABLE` para verificar tabelas dentro do tablespace. Tentar executar **innochecksum** em um tablespace que o servidor já tenha aberto resulta em um erro de "Impossível de bloquear o arquivo".

Se forem encontrados desalinhamentos de verificação de checksum, restaure o tablespace a partir do backup ou inicie o servidor e tente usar o **mysqldump** para fazer um backup dos dados dentro do tablespace.

Invoque **innochecksum** da seguinte forma:

```sql
innochecksum [options] file_name
```

#### innochecksum Opções

**innochecksum** suporta as seguintes opções. Para as opções que se referem a números de página, os números são baseados em zero.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Exibe ajuda na string de comando. Exemplo de uso:

  ```sql
  innochecksum --help
  ```

* `--info`, `-I`

  <table frame="box" rules="all" summary="Properties for info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Sinônimo de `--help`. Exibe ajuda na string de comando. Exemplo de uso:

  ```sql
  innochecksum --info
  ```

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Exibe informações sobre a versão. Exemplo de uso:

  ```sql
  innochecksum --version
  ```

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Modo detalhado; imprime um indicador de progresso no arquivo de registro a cada cinco segundos. Para que o indicador de progresso seja impresso, o arquivo de registro deve ser especificado usando o `--log option`. Para ativar o modo `verbose`, execute:

  ```sql
  innochecksum --verbose
  ```

Para desativar o modo verbose, execute:

  ```sql
  innochecksum --verbose=FALSE
  ```

A opção `--verbose` e a opção `--log` podem ser especificadas ao mesmo tempo. Por exemplo:

  ```sql
  innochecksum --verbose --log=/var/lib/mysql/test/logtest.txt
  ```

Para localizar as informações do indicador de progresso no arquivo de registro, você pode realizar a seguinte pesquisa:

  ```sql
  cat ./logtest.txt | grep -i "okay"
  ```

As informações do indicador de progresso no arquivo de registro aparecem semelhantes às seguintes:

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

  <table frame="box" rules="all" summary="Properties for count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--count</code></td> </tr><tr><th>Type</th> <td>Base name</td> </tr><tr><th>Default Value</th> <td><code>true</code></td> </tr></tbody></table>

Imprima um contador do número de páginas no arquivo e saia. Exemplo de uso:

  ```sql
  innochecksum --count ../data/test/tab1.ibd
  ```

* `--start-page=num`, `-s num`

  <table frame="box" rules="all" summary="Properties for start-page"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--start-page=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

Comece a partir deste número de página. Exemplo de uso:

  ```sql
  innochecksum --start-page=600 ../data/test/tab1.ibd
  ```

ou:

  ```sql
  innochecksum -s 600 ../data/test/tab1.ibd
  ```

* `--end-page=num`, `-e num`

  <table frame="box" rules="all" summary="Properties for end-page"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--end-page=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr></tbody></table>

Finalize nesta página. Exemplo de uso:

  ```sql
  innochecksum --end-page=700 ../data/test/tab1.ibd
  ```

ou:

  ```sql
  innochecksum --p 700 ../data/test/tab1.ibd
  ```

* `--page=num`, `-p num`

  <table frame="box" rules="all" summary="Properties for page"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--page=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

Verifique apenas este número da página. Exemplo de uso:

  ```sql
  innochecksum --page=701 ../data/test/tab1.ibd
  ```

* `--strict-check`, `-C`

  <table frame="box" rules="all" summary="Properties for strict-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--strict-check=algorithm</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>crc32</code></td> </tr><tr><th>Valores válidos</th> <td><code>innodb</code><code>crc32</code><code>none</code></td> </tr></tbody></table>

Especifique um algoritmo de verificação de checksum rigoroso. As opções incluem `innodb`, `crc32` e `none`.

Neste exemplo, o algoritmo de verificação de checksum `innodb` é especificado:

  ```sql
  innochecksum --strict-check=innodb ../data/test/tab1.ibd
  ```

Neste exemplo, o algoritmo de verificação de checksum `crc32` é especificado:

  ```sql
  innochecksum -C crc32 ../data/test/tab1.ibd
  ```

As condições a seguir se aplicam:

+ Se você não especificar a opção `--strict-check`, o **innochecksum** valida contra `innodb`, `crc32` e `none`.

+ Se você especificar a opção `none`, apenas os checksums gerados por `none` são permitidos.

+ Se você especificar a opção `innodb`, apenas os checksums gerados por `innodb` são permitidos.

+ Se você especificar a opção `crc32`, apenas os checksums gerados por `crc32` são permitidos.

* `--no-check`, `-n`

  <table frame="box" rules="all" summary="Properties for no-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Ignore a verificação de checksum ao reescrever um checksum. Esta opção só pode ser usada com a opção **innochecksum** `--write`. Se a opção `--write` não for especificada, **innochecksum** termina.

Neste exemplo, um checksum `innodb` é reescrito para substituir um checksum inválido:

  ```sql
  innochecksum --no-check --write innodb ../data/test/tab1.ibd
  ```

* `--allow-mismatches`, `-a`

  <table frame="box" rules="all" summary="Properties for info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>0

O número máximo de desalinhamentos de verificação de checksums permitidos antes de o **innochecksum** terminar. O ajuste padrão é 0. Se `--allow-mismatches=`*`N`*, onde `N>=0`, *`N`* são permitidos desalinhamentos e o **innochecksum** termina em `N+1`. Quando `--allow-mismatches` é definido como 0, o **innochecksum** termina no primeiro desalinhamento de verificação de checksums.

Neste exemplo, um checksum existente `innodb` é reescrito para definir `--allow-mismatches` como 1.

  ```sql
  innochecksum --allow-mismatches=1 --write innodb ../data/test/tab1.ibd
  ```

Com `--allow-mismatches` definido como 1, se houver uma incompatibilidade na página 600 e outra na página 700 em um arquivo com 1000 páginas, o checksum é atualizado para as páginas 0-599 e 601-699. Como `--allow-mismatches` está definido como 1, o checksum tolera a primeira incompatibilidade e termina na segunda incompatibilidade, deixando a página 600 e as páginas 700-999 inalteradas.

* `--write=name`, `-w num`

  <table frame="box" rules="all" summary="Properties for info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>1

Reescrever um checksum. Ao reescrever um checksum inválido, a opção `--no-check` deve ser usada juntamente com a opção `--write`. A opção `--no-check` informa ao **innochecksum** para ignorar a verificação do checksum inválido. Você não precisa especificar a opção `--no-check` se o checksum atual for válido.

Um algoritmo deve ser especificado ao usar a opção `--write`. Os valores possíveis para a opção `--write` são:

+ `innodb`: Um checksum calculado em software, usando o algoritmo original de `InnoDB`.

+ `crc32`: Um checksum calculado usando o algoritmo `crc32`, possivelmente feito com assistência de hardware.

+ `none`: Um número constante.

A opção `--write` reescreve páginas inteiras no disco. Se o novo checksum for idêntico ao checksum existente, o novo checksum não é escrito no disco para minimizar o I/O.

**innochecksum** obtém um bloqueio exclusivo quando a opção `--write` é usada.

Neste exemplo, um `crc32` checksum é escrito para `tab1.ibd`:

  ```sql
  innochecksum -w crc32 ../data/test/tab1.ibd
  ```

Neste exemplo, um `crc32` checksum é reescrito para substituir um checksum `crc32` inválido:

  ```sql
  innochecksum --no-check --write crc32 ../data/test/tab1.ibd
  ```

* `--page-type-summary`, `-S`

  <table frame="box" rules="all" summary="Properties for info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>2

Exibir um contador de cada tipo de página em um espaço de tabela. Exemplo de uso:

  ```sql
  innochecksum --page-type-summary ../data/test/tab1.ibd
  ```

Saída de exemplo para `--page-type-summary`:

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

  <table frame="box" rules="all" summary="Properties for info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>3

Descarte as informações do tipo de página para cada página em um espaço de tabelas para `stderr` ou `stdout`. Exemplo de uso:

  ```sql
  innochecksum --page-type-dump=/tmp/a.txt ../data/test/tab1.ibd
  ```

* `--log`, `-l`

  <table frame="box" rules="all" summary="Properties for info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>4

Saída de registro para a ferramenta **innochecksum**. Um nome de arquivo de registro deve ser fornecido. A saída de registro contém valores de verificação de checksum para cada página do espaço de tabelas. Para tabelas não compactadas, os valores LSN também são fornecidos. O `--log` substitui a opção `--debug`, que estava disponível em versões anteriores. Exemplo de uso:

  ```sql
  innochecksum --log=/tmp/log.txt ../data/test/tab1.ibd
  ```

ou:

  ```sql
  innochecksum -l /tmp/log.txt ../data/test/tab1.ibd
  ```

* opção `-`.

Especifique a opção `-` para ler a entrada padrão. Se a opção `-` estiver ausente quando se espera "ler a partir da entrada padrão", o **innochecksum** exibe informações de uso do **innochecksum**, indicando que a opção "-" foi omitida. Exemplos de uso:

  ```sql
  cat t1.ibd | innochecksum -
  ```

Neste exemplo, **innochecksum** escreve o algoritmo de verificação de checksum `crc32` para `a.ibd` sem alterar o arquivo original `t1.ibd`.

  ```sql
  cat t1.ibd | innochecksum --write=crc32 - > a.ibd
  ```

#### Executando innochecksum em vários arquivos de espaço de tabela definidos pelo usuário

Os exemplos a seguir demonstram como executar o **innochecksum** em vários arquivos de espaço de tabela definidos pelo usuário (arquivos `.ibd`).

Execute **innochecksum** para todos os arquivos de espaço de tabela (`.ibd`) no banco de dados “test”:

```sql
innochecksum ./data/test/*.ibd
```

Execute **innochecksum** para todos os arquivos de espaço de tabela (arquivos `.ibd`) que tenham um nome de arquivo que comece com “t”:

```sql
innochecksum ./data/test/t*.ibd
```

Execute **innochecksum** para todos os arquivos de espaço de tabela (arquivos `.ibd`) no diretório `data`:

```sql
innochecksum ./data/*/*.ibd
```

Nota

Executar **innochecksum** em vários arquivos de espaço de tabela definidos pelo usuário não é suportado em sistemas operacionais Windows, pois as escovas do Windows, como **cmd.exe**, não suportam expansão de padrões globais. Em sistemas Windows, **innochecksum** deve ser executado separadamente para cada arquivo de espaço de tabela definido pelo usuário. Por exemplo:

```sql
innochecksum.exe t1.ibd
innochecksum.exe t2.ibd
innochecksum.exe t3.ibd
```

#### Executando innochecksum em arquivos de espaço de tabela de sistema múltiplo

Por padrão, há apenas um arquivo de espaço de tabela de sistema `InnoDB` (`ibdata1`) e vários arquivos para o espaço de tabela do sistema podem ser definidos usando a opção `innodb_data_file_path`. No exemplo a seguir, três arquivos para o espaço de tabela do sistema são definidos usando a opção `innodb_data_file_path`: `ibdata1`, `ibdata2` e `ibdata3`.

```sql
./bin/mysqld --no-defaults --innodb-data-file-path="ibdata1:10M;ibdata2:10M;ibdata3:10M:autoextend"
```

Os três arquivos (`ibdata1`, `ibdata2` e `ibdata3`) formam um espaço de tabela lógico. Para executar o **innochecksum** em vários arquivos que formam um espaço de tabela lógico, o **innochecksum** requer a opção `-` para ler os arquivos do espaço de tabela a partir da entrada padrão, o que é equivalente a concatenar vários arquivos para criar um único arquivo. Para o exemplo fornecido acima, o seguinte comando **innochecksum** seria usado:

```sql
cat ibdata* | innochecksum -
```

Consulte as informações sobre as opções **innochecksum** para obter mais informações sobre a opção “-”.

Nota

Executar **innochecksum** em vários arquivos no mesmo espaço de tabela não é suportado em sistemas operacionais Windows, pois as escovas do Windows, como **cmd.exe**, não suportam a expansão de padrões globais. Em sistemas Windows, **innochecksum** deve ser executado separadamente para cada arquivo do espaço de tabela do sistema. Por exemplo:

```sql
innochecksum.exe ibdata1
innochecksum.exe ibdata2
innochecksum.exe ibdata3
```

### 4.6.2 myisam_ftdump — Exibir informações do índice de texto completo

O **myisam_ftdump** exibe informações sobre os índices `FULLTEXT` nas tabelas `MyISAM`. Ele lê o arquivo do índice `MyISAM` diretamente, portanto, ele deve ser executado no host do servidor onde a tabela está localizada. Antes de usar o **myisam_ftdump**, certifique-se de emitir uma declaração `FLUSH TABLES` primeiro, se o servidor estiver em execução.

O **myisam_ftdump** examina e descarrega todo o índice, o que não é particularmente rápido. Por outro lado, a distribuição das palavras não muda com frequência, então não precisa ser executada com frequência.

Invoque **myisam_ftdump** da seguinte forma:

```sql
myisam_ftdump [options] tbl_name index_num
```

O argumento *`tbl_name`* deve ser o nome de uma tabela `MyISAM`. Você também pode especificar uma tabela nomeando seu arquivo de índice (o arquivo com o sufixo `.MYI`). Se você não invocar **myisam_ftdump** no diretório onde os arquivos da tabela estão localizados, o nome do arquivo da tabela ou do índice deve ser precedido pelo nome do caminho para o diretório do banco de dados da tabela. Os números de índice começam com 0.

Exemplo: Suponha que o banco de dados `test` contenha uma tabela chamada `mytexttable` que tem a seguinte definição:

```sql
CREATE TABLE mytexttable
(
  id   INT NOT NULL,
  txt  TEXT NOT NULL,
  PRIMARY KEY (id),
  FULLTEXT (txt)
) ENGINE=MyISAM;
```

O índice em `id` é o índice 0 e o índice em `txt` em `test` é o índice 1. Se o diretório de trabalho é o diretório do banco de dados `test`, invoque **myisam_ftdump** da seguinte forma:

```sql
myisam_ftdump mytexttable 1
```

Se o nome do caminho para o diretório do banco de dados `test` for `/usr/local/mysql/data/test`, você também pode especificar o argumento do nome da tabela usando esse nome de caminho. Isso é útil se você não invocar **myisam_ftdump** no diretório do banco de dados:

```sql
myisam_ftdump /usr/local/mysql/data/test/mytexttable 1
```

Você pode usar **myisam_ftdump** para gerar uma lista de entradas de índice em ordem de frequência de ocorrência, como este exemplo em sistemas semelhantes ao Unix:

```sql
myisam_ftdump -c mytexttable 1 | sort -r
```

Em Windows, use:

```sql
myisam_ftdump -c mytexttable 1 | sort /R
```

**myisam_ftdump** suporta as seguintes opções:

* `--help`, `-h` `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--count`, `-c`

  <table frame="box" rules="all" summary="Properties for count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--count</code></td> </tr></tbody></table>

Calcular estatísticas por palavra (contagem e pesos globais).

* `--dump`, `-d`

  <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--dump</code></td> </tr></tbody></table>

Descarte o índice, incluindo os deslocamentos de dados e os pesos das palavras.

* `--length`, `-l`

  <table frame="box" rules="all" summary="Properties for length"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--length</code></td> </tr></tbody></table>

Informe a distribuição do comprimento.

* `--stats`, `-s`

  <table frame="box" rules="all" summary="Properties for stats"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--stats</code></td> </tr></tbody></table>

Relatar estatísticas do índice global. Esta é a operação padrão se nenhuma outra operação for especificada.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

Modo detalhado. Imprima mais informações sobre o que o programa faz.

### 4.6.3 myisamchk — Ferramenta de manutenção de tabelas MyISAM

A ferramenta **myisamchk** obtém informações sobre as tabelas ou verificações do seu banco de dados, realiza reparos ou otimiza-as. **myisamchk** funciona com tabelas `MyISAM` (tabelas que possuem arquivos `.MYD` e `.MYI` para armazenar dados e índices).

Você também pode usar as declarações `CHECK TABLE` e `REPAIR TABLE` para verificar e reparar as tabelas `MyISAM`. Veja a Seção 13.7.2.2, “Declaração CHECK TABLE”, e a Seção 13.7.2.5, “Declaração REPAIR TABLE”.

O uso do **myisamchk** com tabelas particionadas não é suportado.

Cuidado

É melhor fazer um backup de uma tabela antes de realizar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. As possíveis causas incluem, mas não estão limitadas a, erros do sistema de arquivos.

Invoque o **myisamchk** da seguinte forma:

```sql
myisamchk [options] tbl_name ...
```

Os *`options`* especificam o que você deseja que o **myisamchk** faça. Eles são descritos nas seções a seguir. Você também pode obter uma lista de opções ao invocar **myisamchk --help**.

Sem opções, o **myisamchk** simplesmente verifica sua tabela como operação padrão. Para obter mais informações ou para dizer ao **myisamchk** que tome medidas corretivas, especifique as opções conforme descrito na discussão a seguir.

*`tbl_name`* é a tabela do banco de dados que você deseja verificar ou reparar. Se você executar **myisamchk** em algum lugar que não seja o diretório do banco de dados, você deve especificar o caminho para o diretório do banco de dados, porque o **myisamchk** não tem ideia de onde o banco de dados está localizado. Na verdade, o **myisamchk** não se importa realmente se os arquivos que você está trabalhando estão localizados em um diretório de banco de dados. Você pode copiar os arquivos que correspondem a uma tabela de banco de dados para algum outro local e realizar operações de recuperação neles.

Você pode nomear várias tabelas na string de comando **myisamchk** se desejar. Você também pode especificar uma tabela ao nomear seu arquivo de índice (o arquivo com o sufixo `.MYI`). Isso permite que você especifique todas as tabelas em um diretório usando o padrão `*.MYI`. Por exemplo, se você estiver em um diretório de banco de dados, você pode verificar todas as tabelas `MyISAM` nesse diretório da seguinte maneira:

```sql
myisamchk *.MYI
```

Se você não estiver no diretório do banco de dados, pode verificar todas as tabelas lá, especificando o caminho para o diretório:

```sql
myisamchk /path/to/database_dir/*.MYI
```

Você pode até verificar todas as tabelas em todos os bancos de dados, especificando um caractere curinga com o caminho do diretório de dados do MySQL:

```sql
myisamchk /path/to/datadir/*/*.MYI
```

A maneira recomendada para verificar rapidamente todas as tabelas `MyISAM` é:

```sql
myisamchk --silent --fast /path/to/datadir/*/*.MYI
```

Se você deseja verificar todas as tabelas `MyISAM` e reparar quaisquer que estejam corrompidas, você pode usar o seguinte comando:

```sql
myisamchk --silent --force --fast --update-state \
          --key_buffer_size=64M --myisam_sort_buffer_size=64M \
          --read_buffer_size=1M --write_buffer_size=1M \
          /path/to/datadir/*/*.MYI
```

Este comando pressupõe que você tenha mais de 64 MB disponíveis. Para mais informações sobre a alocação de memória com **myisamchk**, consulte a Seção 4.6.3.6, “Uso de memória do myisamchk”.

Para obter informações adicionais sobre o uso do **myisamchk**, consulte a Seção 7.6, “Manutenção e recuperação em caso de falha de tabela MyISAM”.

Importante

*Você deve garantir que nenhum outro programa esteja usando as tabelas enquanto estiver executando o **myisamchk**. A maneira mais eficaz de fazer isso é desligar o servidor MySQL enquanto estiver executando o **myisamchk**, ou bloquear todas as tabelas nas quais o **myisamchk** está sendo usado.

Caso contrário, quando você executar **myisamchk**, pode exibir a seguinte mensagem de erro:

```sql
warning: clients are using or haven't closed the table properly
```

Isso significa que você está tentando verificar uma tabela que foi atualizada por outro programa (como o servidor `mysqld`) que ainda não fechou o arquivo ou que morreu sem fechar o arquivo corretamente, o que às vezes pode levar à corrupção de uma ou mais tabelas `MyISAM`.

Se o `mysqld` estiver em execução, você deve forçar-o a limpar quaisquer modificações de tabela que ainda estejam em buffer na memória usando o `FLUSH TABLES`. Em seguida, você deve garantir que ninguém esteja usando as tabelas enquanto você estiver executando o **myisamchk**

No entanto, a maneira mais fácil de evitar esse problema é usar `CHECK TABLE` em vez de **myisamchk** para verificar tabelas. Veja a Seção 13.7.2.2, “Instrução CHECK TABLE”.

O **myisamchk** suporta as seguintes opções, que podem ser especificadas na string de comando ou no grupo `[myisamchk]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.21 Opções do myisamchk**

<table frame="box" rules="all" summary="Command-line options available for myisamchk.">
<col style="width: 35%"/>
<col style="width: 64%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Descrição</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>--analyze</code></td>
<td>Analise a distribuição dos valores-chave</td>
</tr>
<tr>
<td><code>--backup</code></td>
<td>Faça um backup do arquivo .MYD como file_name-time.BAK</td>
</tr>
<tr>
<td><code>--block-search</code></td>
<td>Encontre o registro de que um bloco no deslocamento dado pertence</td>
</tr>
<tr>
<td><code>--character-sets-dir</code></td>
<td>Diretório onde os conjuntos de caracteres podem ser encontrados</td>
</tr>
<tr>
<td><code>--check</code></td>
<td>Verifique a tabela em busca de erros</td>
</tr>
<tr>
<td><code>--check-only-changed</code></td>
<td>Verifique apenas as tabelas que foram alteradas desde a última verificação</td>
</tr>
<tr>
<td><code>--correct-checksum</code></td>
<td>Corrija as informações de verificação de checksum da tabela</td>
</tr>
<tr>
<td><code>--data-file-length</code></td>
<td>Comprimento máximo do arquivo de dados (quando o arquivo de dados é recriado quando está cheio)</td>
</tr>
<tr>
<td><code>--debug</code></td>
<td>Escreva o log de depuração</td>
</tr>
<tr>
<td><code>--decode_bits</code></td>
<td>Decode_bits</td>
</tr>
<tr>
<td><code>--defaults-extra-file</code></td>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
</tr>
<tr>
<td><code>--defaults-file</code></td>
<td>Arquivo de opção de leitura apenas nomeado</td>
</tr>
<tr>
<td><code>--defaults-group-suffix</code></td>
<td>Valor do sufixo do grupo de opções</td>
</tr>
<tr>
<td><code>--description</code></td>
<td>Imprima algumas informações descritivas sobre a mesa</td>
</tr>
<tr>
<td><code>--extend-check</code></td>
<td>Faça uma verificação ou reparo muito detalhado da tabela que tenta recuperar todas as strings possíveis do arquivo de dados</td>
</tr>
<tr>
<td><code>--fast</code></td>
<td>Verifique apenas as tabelas que não foram fechadas corretamente</td>
</tr>
<tr>
<td><code>--force</code></td>
<td>Realize uma operação de reparo automaticamente se o isamchk encontrar erros na tabela</td>
</tr>
<tr>
<td><code>--force</code></td>
<td>Escreva sobre arquivos temporários antigos. Para uso com a opção -r ou -o</td>
</tr>
<tr>
<td><code>--ft_max_word_len</code></td>
<td>Comprimento máximo de palavra para índices FULLTEXT</td>
</tr>
<tr>
<td><code>--ft_min_word_len</code></td>
<td>Tamanho mínimo de palavra para índices FULLTEXT</td>
</tr>
<tr>
<td><code>--ft_stopword_file</code></td>
<td>Use palavras-chave de parada deste arquivo em vez da lista embutida</td>
</tr>
<tr>
<td><code>--HELP</code></td>
<td>Exibir mensagem de ajuda e sair</td>
</tr>
<tr>
<td><code>--help</code></td>
<td>Exibir mensagem de ajuda e sair</td>
</tr>
<tr>
<td><code>--information</code></td>
<td>Imprima estatísticas informativas sobre a tabela que está verificada</td>
</tr>
<tr>
<td><code>--key_buffer_size</code></td>
<td>Tamanho do buffer usado para blocos de índice para tabelas MyISAM</td>
</tr>
<tr>
<td><code>--keys-used</code></td>
<td>Um valor de bit que indica quais índices devem ser atualizados</td>
</tr>
<tr>
<td><code>--max-record-length</code></td>
<td>Ignorar strings maiores que o comprimento dado se o myisamchk não conseguir alocar memória para mantê-las</td>
</tr>
<tr>
<td><code>--medium-check</code></td>
<td>Faça uma verificação que seja mais rápida do que uma operação de --extend-check</td>
</tr>
<tr>
<td><code>--myisam_block_size</code></td>
<td>Tamanho do bloco a ser usado para páginas de índice MyISAM</td>
</tr>
<tr>
<td><code>--myisam_sort_buffer_size</code></td>
<td>O buffer que é alocado ao ordenar o índice ao realizar uma REPAR ou ao criar índices com CREATE INDEX ou ALTER TABLE</td>
</tr>
<tr>
<td><code>--no-defaults</code></td>
<td>Não leia arquivos de opção</td>
</tr>
<tr>
<td><code>--parallel-recover</code></td>
<td>Usa a mesma técnica que -r e -n, mas cria todas as chaves em paralelo, usando diferentes threads (beta)</td>
</tr>
<tr>
<td><code>--print-defaults</code></td>
<td>Imprimir opções padrão</td>
</tr>
<tr>
<td><code>--quick</code></td>
<td>Obtenha uma reparação mais rápida sem modificar o arquivo de dados</td>
</tr>
<tr>
<td><code>--read_buffer_size</code></td>
<td>Cada thread que realiza uma varredura sequencial aloca um buffer desse tamanho para cada tabela que ele varre.</td>
</tr>
<tr>
<td><code>--read-only</code></td>
<td>Não marque a tabela como marcada</td>
</tr>
<tr>
<td><code>--recover</code></td>
<td>Faça uma reparação que possa corrigir quase qualquer problema, exceto chaves únicas que não são únicas</td>
</tr>
<tr>
<td><code>--safe-recover</code></td>
<td>Faça uma reparação usando um método de recuperação antigo que lê todas as strings em ordem e atualiza todas as árvores de índice com base nas strings encontradas.</td>
</tr>
<tr>
<td><code>--set-auto-increment</code></td>
<td>Forçar a numeração AUTO_INCREMENT para novos registros para começar no valor especificado</td>
</tr>
<tr>
<td><code>--set-collation</code></td>
<td>Especifique a collation a ser usada para ordenar índices de tabela</td>
</tr>
<tr>
<td><code>--silent</code></td>
<td>Modo silencioso</td>
</tr>
<tr>
<td><code>--sort_buffer_size</code></td>
<td>O buffer que é alocado ao ordenar o índice ao realizar uma REPAR ou ao criar índices com CREATE INDEX ou ALTER TABLE</td>
</tr>
<tr>
<td><code>--sort-index</code></td>
<td>Classifique os blocos da árvore de índice em ordem de alto para baixo</td>
</tr>
<tr>
<td><code>--sort_key_blocks</code></td>
<td>sort_key_blocks</td>
</tr>
<tr>
<td><code>--sort-records</code></td>
<td>Classificar os registros de acordo com um índice específico</td>
</tr>
<tr>
<td><code>--sort-recover</code></td>
<td>Forçar o myisamchk a usar a classificação para resolver as chaves, mesmo que os arquivos temporários fossem muito grandes</td>
</tr>
<tr>
<td><code>--stats_method</code></td>
<td>Especifica como o código de coleta de estatísticas de índice MyISAM deve tratar os NULLs</td>
</tr>
<tr>
<td><code>--tmpdir</code></td>
<td>Diretório a ser utilizado para armazenar arquivos temporários</td>
</tr>
<tr>
<td><code>--unpack</code></td>
<td>Descompacte uma tabela que foi compactada com myisampack</td>
</tr>
<tr>
<td><code>--update-state</code></td>
<td>Armazene informações no arquivo .MYI para indicar quando a tabela foi verificada e se a tabela falhou</td>
</tr>
<tr>
<td><code>--verbose</code></td>
<td>Modo verbosos</td>
</tr>
<tr>
<td><code>--version</code></td>
<td>Exibir informações da versão e sair</td>
</tr>
<tr>
<td><code>--wait</code></td>
<td>Aguarde a tabela bloqueada ser desbloqueada, em vez de terminar</td>
</tr>
<tr>
<td><code>--write_buffer_size</code></td>
<td>Tamanho do buffer de escrita</td>
</tr>
</tbody>
</table>

#### 4.6.3.1 Opções gerais do myisamchk

As opções descritas nesta seção podem ser usadas para qualquer tipo de operação de manutenção de tabela realizada pelo **myisamchk**. As seções que seguem esta descrevem opções que se aplicam apenas a operações específicas, como verificação ou reparo de tabela.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair. As opções são agrupadas por tipo de operação.

* `--HELP`, `-H`

  <table frame="box" rules="all" summary="Properties for HELP"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--HELP</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair. As opções são apresentadas em uma única lista.

* `--debug=debug_options`, `-# debug_options`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o,/tmp/myisamchk.trace</code></td> </tr></tbody></table>

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/myisamchk.trace`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **myisamchk** normalmente lê o grupo `[myisamchk]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **myisamchk** também lê o grupo [[`[myisamchk_other]`].

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na string de comando, mesmo quando o `--no-defaults` é usado. Para criar o `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 4.6.6, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for silent"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--silent</code></td> </tr></tbody></table>

Modo silencioso. Escreva a saída apenas quando ocorrerem erros. Você pode usar `-s` duas vezes (`-ss`) para tornar o **myisamchk** muito silencioso.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

Modo detalhado. Imprima mais informações sobre o que o programa faz. Isso pode ser usado com `-d` e `-e`. Use `-v` várias vezes (`-vv`, `-vvv`) para obter ainda mais saída.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for HELP"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--HELP</code></td> </tr></tbody></table>0

Exibir informações da versão e sair.

* `--wait`, `-w`

  <table frame="box" rules="all" summary="Properties for HELP"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--HELP</code></td> </tr></tbody></table>1

Em vez de encerrar com um erro se a tabela estiver bloqueada, espere até que a tabela seja desbloqueada antes de continuar. Se você estiver executando `mysqld` com o bloqueio externo desativado, a tabela só pode ser bloqueada por outro comando **myisamchk**.

Você também pode definir as seguintes variáveis usando a sintaxe `--var_name=value`:

<table frame="box" rules="all" summary="Properties for HELP"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--HELP</code></td> </tr></tbody></table>2

As possíveis variáveis **myisamchk** e seus valores padrão podem ser examinadas com **myisamchk --help**:

`myisam_sort_buffer_size` é usado quando as chaves são reparadas por meio de classificação de chaves, que é o caso normal quando você usa `--recover`. `sort_buffer_size` é um sinônimo descontinuado para `myisam_sort_buffer_size`.

`key_buffer_size` é usado quando você está verificando a tabela com `--extend-check` ou quando as chaves são reparadas inserindo strings de chave uma a uma na tabela (como ao fazer inserções normais). A reparação através do buffer de chave é usada nos seguintes casos:

* Você usa `--safe-recover`.
* Os arquivos temporários necessários para ordenar as chaves seriam mais do que o dobro do tamanho quando o arquivo de chave é criado diretamente. Isso geralmente acontece quando você tem grandes valores de chave para as colunas `CHAR`, `VARCHAR` ou `TEXT`, porque a operação de ordenação precisa armazenar os valores completos da chave conforme o processo prossegue. Se você tem muito espaço temporário e pode forçar o **myisamchk** a ser reparado por ordenação, você pode usar a opção `--sort-recover`.

A reparação através do buffer chave ocupa muito menos espaço em disco do que o uso de classificação, mas também é muito mais lenta.

Se você deseja uma reparação mais rápida, defina as variáveis `key_buffer_size` e `myisam_sort_buffer_size` em cerca de 25% da sua memória disponível. Você pode definir ambas as variáveis em valores grandes, pois apenas uma delas é usada de cada vez.

`myisam_block_size` é o tamanho utilizado para blocos de índice.

`stats_method` influencia a forma como os valores de `NULL` são tratados para a coleta de estatísticas de índice quando a opção `--analyze` é dada. Atua como a variável de sistema `myisam_stats_method`. Para mais informações, consulte a descrição de `myisam_stats_method` na Seção 5.1.7, “Variáveis do Sistema do Servidor”, e na Seção 8.3.7, “Coleta de Estatísticas de Índices de InnoDB e MyISAM”.

`ft_min_word_len` e `ft_max_word_len` indicam o comprimento mínimo e máximo da palavra para os índices `FULLTEXT` nas tabelas `MyISAM`. `ft_stopword_file` nomeia o arquivo de palavras-stop. Esses precisam ser definidos nas seguintes circunstâncias.

Se você usar o **myisamchk** para realizar uma operação que modifique os índices de tabela (como reparo ou análise), os índices `FULLTEXT` são reconstruídos usando os valores padrão dos parâmetros de texto completo para comprimento mínimo e máximo da palavra e o arquivo de palavras-chave, a menos que você especifique o contrário. Isso pode resultar em consultas que falham.

O problema ocorre porque esses parâmetros são conhecidos apenas pelo servidor. Eles não são armazenados nos arquivos de índice `MyISAM`. Para evitar o problema, se você modificou o comprimento mínimo ou máximo da palavra ou o arquivo de palavras irrelevantes no servidor, especifique os mesmos valores de `ft_min_word_len`, `ft_max_word_len` e `ft_stopword_file` para o **myisamchk** que você usa para `mysqld`. Por exemplo, se você definiu o comprimento mínimo da palavra para 3, pode reparar uma tabela com o **myisamchk** da seguinte forma:

```sql
myisamchk --recover --ft_min_word_len=3 tbl_name.MYI
```

Para garantir que **myisamchk** e o servidor utilizem os mesmos valores para os parâmetros de texto completo, você pode colocar cada um deles nas seções `[mysqld]` e `[myisamchk]` de um arquivo de opções:

```sql
[mysqld]
ft_min_word_len=3

[myisamchk]
ft_min_word_len=3
```

Uma alternativa para usar o **myisamchk** é usar o `REPAIR TABLE`, `ANALYZE TABLE`, `OPTIMIZE TABLE` ou `ALTER TABLE`. Essas declarações são realizadas pelo servidor, que conhece os valores adequados dos parâmetros de texto completo a serem usados.

#### 4.6.3.2 Verificar opções do myisamchk

**myisamchk** suporta as seguintes opções para operações de verificação de tabela:

* `--check`, `-c`

  <table frame="box" rules="all" summary="Properties for check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check</code></td> </tr></tbody></table>

Verifique a tabela em busca de erros. Esta é a operação padrão se você não especificar nenhuma opção que selecione explicitamente um tipo de operação.

* `--check-only-changed`, `-C`

  <table frame="box" rules="all" summary="Properties for check-only-changed"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check-only-changed</code></td> </tr></tbody></table>

Verifique apenas as tabelas que foram alteradas desde a última verificação.

* `--extend-check`, `-e`

  <table frame="box" rules="all" summary="Properties for extend-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--extend-check</code></td> </tr></tbody></table>

Verifique a tabela com muito cuidado. Isso é bastante lento se a tabela tiver muitos índices. Essa opção só deve ser usada em casos extremos. Normalmente, **myisamchk** ou **myisamchk --medium-check** deve ser capaz de determinar se há algum erro na tabela.

Se você está usando `--extend-check` e tem muita memória, definir a variável `key_buffer_size` para um valor grande ajuda a operação de reparo a ser executada mais rapidamente.

Veja também a descrição desta opção na tabela de opções de reparo.

Para uma descrição do formato de saída, consulte a Seção 4.6.3.5, “Obtenção de informações de tabela com myisamchk”.

* `--fast`, `-F`

  <table frame="box" rules="all" summary="Properties for fast"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--fast</code></td> </tr></tbody></table>

Verifique apenas as tabelas que não foram fechadas corretamente.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for force"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--force</code></td> </tr></tbody></table>

Realize uma operação de reparo automaticamente se o **myisamchk** encontrar quaisquer erros na tabela. O tipo de reparo é o mesmo especificado com a opção `--recover` ou `-r`.

* `--information`, `-i`

  <table frame="box" rules="all" summary="Properties for information"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--information</code></td> </tr></tbody></table>

Imprima estatísticas informativas sobre a tabela que está verificada.

* `--medium-check`, `-m`

  <table frame="box" rules="all" summary="Properties for medium-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--medium-check</code></td> </tr></tbody></table>

Faça uma verificação que seja mais rápida do que uma operação `--extend-check`. Isso encontra apenas 99,99% de todos os erros, o que deve ser suficiente na maioria dos casos.

* `--read-only`, `-T`

  <table frame="box" rules="all" summary="Properties for read-only"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--read-only</code></td> </tr></tbody></table>

Não marque a tabela como verificada. Isso é útil se você usar **myisamchk** para verificar uma tabela que está sendo usada por algum outro aplicativo que não usa bloqueio, como `mysqld` quando executado com bloqueio externo desativado.

* `--update-state`, `-U`

  <table frame="box" rules="all" summary="Properties for update-state"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--update-state</code></td> </tr></tbody></table>

Armazene informações no arquivo `.MYI` para indicar quando a tabela foi verificada e se a tabela foi travada. Isso deve ser usado para obter o máximo benefício da opção `--check-only-changed`, mas você não deve usar essa opção se o servidor `mysqld` estiver usando a tabela e você estiver executando-o com bloqueio externo desativado.
#### 4.6.3.3 Opções de reparo do myisamchk


O **myisamchk** suporta as seguintes opções para operações de reparo de tabela (operações realizadas quando uma opção como `--recover` ou `--safe-recover` é fornecida):

* `--backup`, `-B`

  <table frame="box" rules="all" summary="Properties for backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup</code></td> </tr></tbody></table>

Faça um backup do arquivo `.MYD` como `file_name-time.BAK`

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 10.15, “Configuração de Conjunto de Caracteres”.

* `--correct-checksum`

  <table frame="box" rules="all" summary="Properties for correct-checksum"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--correct-checksum</code></td> </tr></tbody></table>

Corrija as informações de verificação de checksum da tabela.

* `--data-file-length=len`, `-D len`

  <table frame="box" rules="all" summary="Properties for data-file-length"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--data-file-length=len</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

O comprimento máximo do arquivo de dados (quando o arquivo de dados é recriado quando está "cheio").

* `--extend-check`, `-e`

  <table frame="box" rules="all" summary="Properties for extend-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--extend-check</code></td> </tr></tbody></table>

Faça uma reparação que tente recuperar todas as possíveis strings do arquivo de dados. Normalmente, isso também encontra muitas strings de lixo. Não use esta opção a menos que esteja desesperado.

Veja também a descrição desta opção na tabela de opções de verificação.

Para uma descrição do formato de saída, consulte a Seção 4.6.3.5, “Obtenção de informações de tabela com myisamchk”.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for force"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--force</code></td> </tr></tbody></table>

Sobreescreva arquivos intermediários antigos (arquivos com nomes como `tbl_name.TMD`) em vez de abortar.

* `--keys-used=val`, `-k val`

  <table frame="box" rules="all" summary="Properties for keys-used"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keys-used=val</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

Para **myisamchk**, o valor da opção é um valor binário que indica quais índices devem ser atualizados. Cada bit binário do valor da opção corresponde a um índice de tabela, onde o primeiro índice é o bit 0. Um valor de opção de 0 desativa as atualizações para todos os índices, o que pode ser usado para obter inserções mais rápidas. Os índices desativados podem ser reativados usando **myisamchk -r**.

* `--max-record-length=len`

  <table frame="box" rules="all" summary="Properties for max-record-length"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-record-length=len</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

Ignorar strings maiores que o comprimento dado se o **myisamchk** não puder alocar memória para mantê-las.

* `--parallel-recover`, `-p`

  <table frame="box" rules="all" summary="Properties for parallel-recover"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--parallel-recover</code></td> </tr></tbody></table>

Nota

Essa opção é desatualizada no MySQL 5.7.38 e removida no MySQL 5.7.39.

Use a mesma técnica que `-r` e `-n`, mas crie todas as chaves em paralelo, usando diferentes threads. *Este é um código de qualidade beta. Use a seu próprio risco!*

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for quick"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--quick</code></td> </tr></tbody></table>

Obtenha uma reparação mais rápida, modificando apenas o arquivo de índice, não o arquivo de dados. Você pode especificar essa opção duas vezes para forçar o **myisamchk** a modificar o arquivo de dados original, no caso de chaves duplicadas.

* `--recover`, `-r`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Faça uma reparação que possa corrigir quase qualquer problema, exceto chaves únicas que não são únicas (o que é um erro extremamente improvável com as tabelas `MyISAM`). Se você deseja recuperar uma tabela, esta é a opção a tentar primeiro. Você deve tentar `--safe-recover` apenas se o **myisamchk** relatar que a tabela não pode ser recuperada usando `--recover`. (No caso improvável de que o `--recover` falhe, o arquivo de dados permanece intacto.)

Se você tem muita memória, deve aumentar o valor de `myisam_sort_buffer_size`.

* `--safe-recover`, `-o`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

Faça uma reparação usando um método de recuperação antigo que lê todas as strings em ordem e atualiza todas as árvores de índice com base nas strings encontradas. Esse método é uma ordem de magnitude mais lento que `--recover`, mas pode lidar com alguns casos muito improváveis que `--recover` não pode. Esse método de recuperação também usa muito menos espaço em disco que `--recover`. Normalmente, você deve reparar primeiro usando `--recover`, e depois com `--safe-recover` apenas se `--recover` falhar.

Se você tem muita memória, deve aumentar o valor de `key_buffer_size`.

* `--set-collation=name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

Especifique a collation a ser usada para ordenar índices de tabela. O nome do conjunto de caracteres é implícito pela primeira parte do nome da collation.

* `--sort-recover`, `-n`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

Forçar o **myisamchk** a usar o recurso de classificação para resolver as chaves, mesmo que os arquivos temporários sejam muito grandes.

* `--tmpdir=dir_name`, `-t dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

O caminho do diretório a ser usado para armazenar arquivos temporários. Se não for definido, o **myisamchk** usa o valor da variável de ambiente `TMPDIR`. `--tmpdir` pode ser definido como uma lista de caminhos de diretórios que são usados sucessivamente de forma round-robin para criar arquivos temporários. O caractere de separador entre os nomes de diretórios é o colon (`:`) no Unix e o ponto e vírgula (`;`) no Windows.

* `--unpack`, `-u`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

Descompacte uma tabela que foi compactada com **myisampack**.

#### 4.6.3.4 Outras opções do myisamchk

O **myisamchk** suporta as seguintes opções para ações que não são verificações e reparos de tabela:

* `--analyze`, `-a`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

Analise a distribuição dos valores-chave. Isso melhora o desempenho da junção, permitindo que o otimizador de junção escolha melhor a ordem em que unir as tabelas e quais índices deve usar. Para obter informações sobre a distribuição dos valores-chave, use o comando **myisamchk --description --verbose *`tbl_name`*** ou a declaração `SHOW INDEX FROM tbl_name`.

* `--block-search=offset`, `-b offset`

  <table frame="box" rules="all" summary="Properties for block-search"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--block-search=offset</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

Encontre o registro ao qual pertence um bloco no deslocamento dado.

* `--description`, `-d`

  <table frame="box" rules="all" summary="Properties for description"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--description</code></td> </tr></tbody></table>

Imprima algumas informações descritivas sobre a tabela. Especificar a opção `--verbose` uma ou duas vezes produz informações adicionais. Veja a Seção 4.6.3.5, “Obtenção de informações da tabela com myisamchk”.

* `--set-auto-increment[=value]`, `-A[value]`

Forçar a numeração `AUTO_INCREMENT` para novos registros para começar no valor especificado (ou superior, se houver registros existentes com valores `AUTO_INCREMENT` desse tamanho). Se *`value`* não for especificado, os números `AUTO_INCREMENT` para novos registros começam com o maior valor atualmente na tabela, mais um.

* `--sort-index`, `-S`

  <table frame="box" rules="all" summary="Properties for sort-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--sort-index</code></td> </tr></tbody></table>

Sorteie os blocos da árvore de índice em ordem de alto para baixo. Isso otimiza os buscas e torna os varreduras de tabela que utilizam índices mais rápidos.

* `--sort-records=N`, `-R N`

  <table frame="box" rules="all" summary="Properties for sort-records"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--sort-records=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

Classifique os registros de acordo com um índice específico. Isso torna seus dados muito mais localizados e pode acelerar as operações de `SELECT` e `ORDER BY` baseadas em intervalo que utilizam esse índice. (A primeira vez que você usa essa opção para classificar uma tabela, ela pode ser muito lenta.) Para determinar os números dos índices de uma tabela, use `SHOW INDEX`, que exibe os índices de uma tabela na mesma ordem que o **myisamchk** os vê. Os índices são numerados começando com 1.

Se as chaves não forem compactadas (`PACK_KEYS=0`), elas têm o mesmo comprimento, então, quando o **myisamchk** ordena e move os registros, ele simplesmente sobrescreve os deslocamentos dos registros no índice. Se as chaves forem compactadas (`PACK_KEYS=1`), o **myisamchk** deve descompactuar os blocos de chave primeiro, então recriar os índices e descompactuar os blocos de chave novamente. (Neste caso, recriar os índices é mais rápido do que atualizar os deslocamentos para cada índice.)

#### 4.6.3.5 Obter informações da tabela com myisamchk

Para obter uma descrição de uma tabela `MyISAM` ou estatísticas sobre ela, use os comandos mostrados aqui. A saída desses comandos é explicada mais adiante nesta seção.

* **myisamchk -d *`tbl_name`***

Execute **myisamchk** no modo "descrever" para produzir uma descrição da sua tabela. Se você iniciar o servidor MySQL com bloqueio externo desativado, **myisamchk** pode relatar um erro para uma tabela que é atualizada enquanto ele está em execução. No entanto, como **myisamchk** não altera a tabela no modo "descrever", não há risco de destruir dados.

* **myisamchk -dv *`tbl_name`***

Adicionar `-v` executa o **myisamchk** no modo verbose, de modo que ele produza mais informações sobre a tabela. Adicionar `-v` uma segunda vez produz ainda mais informações.

* **myisamchk -eis *`tbl_name`***

Mostra apenas as informações mais importantes de uma tabela. Essa operação é lenta porque deve ler toda a tabela.

* **myisamchk -eiv *`tbl_name`***

Isto é como `-eis`, mas diz o que está sendo feito.

O argumento *`tbl_name`* pode ser o nome de uma tabela `MyISAM` ou o nome de seu arquivo de índice, conforme descrito na Seção 4.6.3, “myisamchk — Ferramenta de manutenção de tabela MyISAM”. Pode-se fornecer vários argumentos *`tbl_name`*.

Suponha que uma tabela chamada `person` tenha a seguinte estrutura. (A opção de tabela `MAX_ROWS` é incluída para que, no exemplo de saída do **myisamchk** mostrado mais tarde, alguns valores sejam menores e se encaixem mais facilmente no formato de saída.)

```sql
CREATE TABLE person
(
  id         INT NOT NULL AUTO_INCREMENT,
  last_name  VARCHAR(20) NOT NULL,
  first_name VARCHAR(20) NOT NULL,
  birth      DATE,
  death      DATE,
  PRIMARY KEY (id),
  INDEX (last_name, first_name),
  INDEX (birth)
) MAX_ROWS = 1000000 ENGINE=MYISAM;
```

Suponha também que a tabela tenha esses tamanhos de dados e arquivos de índice:

```sql
-rw-rw----  1 mysql  mysql  9347072 Aug 19 11:47 person.MYD
-rw-rw----  1 mysql  mysql  6066176 Aug 19 11:47 person.MYI
```

Exemplo de saída do **myisamchk -dvv**:

```sql
MyISAM file:         person
Record format:       Packed
Character set:       latin1_swedish_ci (8)
File-version:        1
Creation time:       2009-08-19 16:47:41
Recover time:        2009-08-19 16:47:56
Status:              checked,analyzed,optimized keys
Auto increment key:              1  Last value:                306688
Data records:               306688  Deleted blocks:                 0
Datafile parts:             306688  Deleted data:                   0
Datafile pointer (bytes):        4  Keyfile pointer (bytes):        3
Datafile length:           9347072  Keyfile length:           6066176
Max datafile length:    4294967294  Max keyfile length:   17179868159
Recordlength:                   54

table description:
Key Start Len Index   Type                 Rec/key         Root  Blocksize
1   2     4   unique  long                       1        99328       1024
2   6     20  multip. varchar prefix           512      3563520       1024
    27    20          varchar                  512
3   48    3   multip. uint24 NULL           306688      6065152       1024

Field Start Length Nullpos Nullbit Type
1     1     1
2     2     4                      no zeros
3     6     21                     varchar
4     27    21                     varchar
5     48    3      1       1       no zeros
6     51    3      1       2       no zeros
```

Aqui estão as explicações para os tipos de informações que o **myisamchk** produz. “Keyfile” se refere ao arquivo de índice. “Registro” e “string” são sinônimos, assim como “campo” e “coluna”.

A parte inicial da descrição da tabela contém esses valores:

* `MyISAM file`

Nome do arquivo `MyISAM` (índice).

* `Record format`

O formato usado para armazenar strings de tabela. Os exemplos anteriores usam `Fixed length`. Outros valores possíveis são `Compressed` e `Packed`. (`Packed` corresponde ao que `SHOW TABLE STATUS` relata como `Dynamic`.).

* `Chararacter set`

O conjunto de caracteres padrão da tabela.

* `File-version`

Versão do formato `MyISAM`. Sempre 1.

* `Creation time`

Quando o arquivo de dados foi criado.

* `Recover time`

Quando o arquivo de índice/dados foi reconstruído pela última vez.

* `Status`

Indicadores de status da tabela. Os valores possíveis são `crashed`, `open`, `changed`, `analyzed`, `optimized keys` e `sorted index pages`.

* `Auto increment key`, `Last value`

O número chave associado à coluna `AUTO_INCREMENT` da tabela e o valor mais recentemente gerado para essa coluna. Esses campos não aparecem se não houver tal coluna.

* `Data records`

O número de strings na tabela.

* `Deleted blocks`

Quantos blocos excluídos ainda têm espaço reservado. Você pode otimizar sua tabela para minimizar esse espaço. Veja a Seção 7.6.4, “Otimização da tabela MyISAM”.

* `Datafile parts`

Para o formato de string dinâmica, isso indica quantos blocos de dados existem. Para uma tabela otimizada sem strings fragmentadas, isso é o mesmo que `Data records`.

* `Deleted data`

Quantos bytes de dados excluídos não recuperados existem. Você pode otimizar sua tabela para minimizar esse espaço. Veja a Seção 7.6.4, “Otimização da tabela MyISAM”.

* `Datafile pointer`

O tamanho do ponteiro do arquivo de dados, em bytes. Geralmente é de 2, 3, 4 ou 5 bytes. A maioria das tabelas consegue lidar com 2 bytes, mas isso ainda não pode ser controlado pelo MySQL. Para tabelas fixas, este é um endereço de string. Para tabelas dinâmicas, este é um endereço de byte.

* `Keyfile pointer`

O tamanho do ponteiro do arquivo de índice, em bytes. Geralmente é 1, 2 ou 3 bytes. A maioria das tabelas consegue lidar com 2 bytes, mas isso é calculado automaticamente pelo MySQL. É sempre um endereço de bloco.

* `Max datafile length`

Quanto tempo o arquivo de dados da tabela pode se tornar, em bytes.

* `Max keyfile length`

Quanto tempo o arquivo de índice da tabela pode se tornar, em bytes.

* `Recordlength`

Quanto espaço cada string ocupa, em bytes.

A parte `table description` do resultado inclui uma lista de todas as chaves na tabela. Para cada chave, **myisamchk** exibe algumas informações de nível baixo:

* `Key`

Este é o número da chave. Este valor é mostrado apenas para a primeira coluna da chave. Se este valor estiver ausente, a string corresponde à segunda ou à coluna posterior de uma chave de múltiplas colunas. Para a tabela mostrada no exemplo, há duas strings `table description` para o segundo índice. Isso indica que é um índice de várias partes com duas partes.

* `Start`

Onde na string essa parte do índice começa.

* `Len`

Quanto tempo essa parte do índice é. Para números compactados, isso deve ser sempre o comprimento total da coluna. Para strings, pode ser mais curto que o comprimento total da coluna indexada, porque você pode indexar um prefixo de uma coluna de string. O comprimento total de uma chave de múltiplas partes é a soma dos valores `Len` para todas as partes da chave.

* `Index`

Se um valor chave pode existir várias vezes no índice. Os valores possíveis são `unique` ou `multip.` (múltiplos).

* `Type`

Que tipo de dado essa porção do índice tem. Este é um tipo de dados `MyISAM` com os possíveis valores `packed`, `stripped` ou `empty`.

* `Root`

Endereço do bloco de índice raiz.

* `Blocksize`

O tamanho de cada bloco do índice. Por padrão, esse valor é 1024, mas o valor pode ser alterado no momento da compilação quando o MySQL é construído a partir de fonte.

* `Rec/key`

Este é um valor estatístico usado pelo otimizador. Ele indica quantas strings há por valor para este índice. Um índice único sempre tem um valor de 1. Este valor pode ser atualizado após uma tabela ser carregada (ou muito alterada) com **myisamchk -a**. Se este valor não for atualizado de forma alguma, é dado um valor padrão de 30.

A última parte do resultado fornece informações sobre cada coluna:

* `Field`

O número da coluna.

* `Start`

A posição do byte da coluna dentro das strings da tabela.

* `Length`

O comprimento da coluna em bytes.

* `Nullpos`, `Nullbit`

Para colunas que podem ser `NULL`, o `MyISAM` armazena os valores `NULL` como uma bandeira em um byte. Dependendo de quantas colunas nulos existem, pode haver um ou mais bytes usados para esse propósito. Os valores `Nullpos` e `Nullbit`, se não vazios, indicam qual byte e bit contém aquela bandeira que indica se a coluna é `NULL`.

A posição e o número de bytes utilizados para armazenar as `NULL` são mostrados na string do campo

1. É por isso que existem seis strings `Field` para a tabela `person`, mesmo que ela tenha apenas cinco colunas.

* `Type`

O tipo de dados. O valor pode conter qualquer um dos seguintes descritores:

+ `constant`

Todas as strings têm o mesmo valor.

+ `no endspace`

Não armazene endspace.

+ `no endspace, not_always`

Não armazene endspace e não faça compressão de endspace para todos os valores.

+ `no endspace, no empty`

Não armazene endspace. Não armazene valores vazios.

+ `table-lookup`

A coluna foi convertida em um `ENUM`.

+ `zerofill(N)`

Os bytes mais significativos do valor *`N`* são sempre 0 e não são armazenados.

+ `no zeros`

Não armazene zeros.

+ `always zero`

Os valores zero são armazenados usando um bit.

* `Huff tree`

O número da árvore de Huffman associada à coluna.

* `Bits`

O número de bits utilizados na árvore de Huffman.

Os campos `Huff tree` e `Bits` são exibidos se a tabela tiver sido comprimida com **myisampack**. Consulte a Seção 4.6.5, “myisampack — Gerar tabelas MyISAM comprimidas e somente de leitura”, para um exemplo dessas informações.

Exemplo de saída do **myisamchk -eiv**:

```sql
Checking MyISAM file: person
Data records:  306688   Deleted blocks:       0
- check file-size
- check record delete-chain
No recordlinks
- check key delete-chain
block_size 1024:
- check index reference
- check data record references index: 1
Key:  1:  Keyblocks used:  98%  Packed:    0%  Max levels:  3
- check data record references index: 2
Key:  2:  Keyblocks used:  99%  Packed:   97%  Max levels:  3
- check data record references index: 3
Key:  3:  Keyblocks used:  98%  Packed:  -14%  Max levels:  3
Total:    Keyblocks used:  98%  Packed:   89%

- check records and index references
*** LOTS OF ROW NUMBERS DELETED ***

Records:            306688  M.recordlength:       25  Packed:            83%
Recordspace used:       97% Empty space:           2% Blocks/Record:   1.00
Record blocks:      306688  Delete blocks:         0
Record data:       7934464  Deleted data:          0
Lost space:         256512  Linkdata:        1156096

User time 43.08, System time 1.68
Maximum resident set size 0, Integral resident set size 0
Non-physical pagefaults 0, Physical pagefaults 0, Swaps 0
Blocks in 0 out 7, Messages in 0 out 0, Signals 0
Voluntary context switches 0, Involuntary context switches 0
Maximum memory usage: 1046926 bytes (1023k)
```

A saída do comando **myisamchk -eiv** inclui as seguintes informações:

* `Data records`

O número de strings na tabela.

* `Deleted blocks`

Quantos blocos excluídos ainda têm espaço reservado. Você pode otimizar sua tabela para minimizar esse espaço. Veja a Seção 7.6.4, “Otimização da tabela MyISAM”.

* `Key`

O número chave.

* `Keyblocks used`

Que porcentagem dos keyblocks é usada. Quando uma tabela foi reorganizada com **myisamchk**, os valores são muito altos (muito próximos do máximo teórico).

* `Packed`

O MySQL tenta embalar valores-chave que têm um sufixo comum. Isso só pode ser usado para índices nas colunas `CHAR` e `VARCHAR`. Para strings indexadas longas que têm partes semelhantes na parte mais à esquerda, isso pode reduzir significativamente o espaço usado. No exemplo anterior, a segunda chave tem 40 bytes de comprimento e uma redução de 97% no espaço é alcançada.

* `Max levels`

Quão profundo o B-tree para esta chave é. Grandes tabelas com valores de chave longos obtêm valores altos.

* `Records`

Quantas strings tem a tabela.

* `M.recordlength`

O comprimento médio da string. Este é o comprimento exato da string para tabelas com strings de comprimento fixo, porque todas as strings têm o mesmo comprimento.

* `Packed`

O MySQL elimina espaços do final das cadeias de caracteres. O valor `Packed` indica a porcentagem de economia alcançada ao fazer isso.

* `Recordspace used`

Que porcentagem do arquivo de dados é usada.

* `Empty space`

Que porcentagem do arquivo de dados está inutilizada.

* `Blocks/Record`

Número médio de blocos por string (ou seja, quantos links uma string fragmentada é composta). Isso é sempre 1,0 para tabelas de formato fixo. Esse valor deve ficar o mais próximo possível de 1,0. Se ficar muito grande, você pode reorganizar a tabela. Veja a Seção 7.6.4, “Otimização da Tabela MyISAM”.

* `Recordblocks`

Quantos blocos (links) são usados. Para tabelas de formato fixo, isso é o mesmo que o número de strings.

* `Deleteblocks`

Quantos blocos (links) são excluídos.

* `Recorddata`

Quantos bytes no arquivo de dados são usados.

* `Deleted data`

Quantos bytes no arquivo de dados são excluídos (não utilizados).

* `Lost space`

Se uma string for atualizada para um comprimento mais curto, alguns espaços são perdidos. Essa é a soma de todas essas perdas, em bytes.

* `Linkdata`

Quando o formato de tabela dinâmica é utilizado, os fragmentos de string são vinculados com ponteiros (4 a 7 bytes cada). `Linkdata` é a soma da quantidade de armazenamento utilizada por todos esses ponteiros.

#### 4.6.3.6 Uso de memória do myisamchk

A alocação de memória é importante quando você executa **myisamchk**. **myisamchk** não usa mais memória do que as suas variáveis relacionadas à memória estão configuradas. Se você vai usar **myisamchk** em tabelas muito grandes, você deve primeiro decidir quanto memória você quer que ele use. O padrão é usar apenas cerca de 3 MB para realizar as reparações. Ao usar valores maiores, você pode fazer com que **myisamchk** opere mais rápido. Por exemplo, se você tiver mais de 512 MB de RAM disponível, você pode usar opções como estas (a parte de opções adicionais que você especificar):

```sql
myisamchk --myisam_sort_buffer_size=256M \
           --key_buffer_size=512M \
           --read_buffer_size=64M \
           --write_buffer_size=64M ...
```

Usar `--myisam_sort_buffer_size=16M` provavelmente é suficiente para a maioria dos casos.

Tenha em atenção que o **myisamchk** utiliza ficheiros temporários em `TMPDIR`. Se `TMPDIR` apontar para um sistema de ficheiros de memória, erros de esgotamento de memória podem ocorrer facilmente. Se isso acontecer, execute o **myisamchk** com a opção `--tmpdir=dir_name` para especificar um diretório localizado num sistema de ficheiros que tenha mais espaço.

Ao realizar operações de reparo, o **myisamchk** também precisa de muito espaço em disco:

* O dobro do tamanho do arquivo de dados (o arquivo original e uma cópia). Esse espaço não é necessário se você fizer uma reparação com `--quick`; nesse caso, apenas o arquivo de índice é recriado. *Esse espaço deve estar disponível no mesmo sistema de arquivos que o arquivo de dados original*, pois a cópia é criada no mesmo diretório que o original.

* Espaço para o novo arquivo de índice que substitui o antigo. O arquivo de índice antigo é truncado no início da operação de reparo, então você geralmente ignora esse espaço. Esse espaço deve estar disponível no mesmo sistema de arquivos que o arquivo de dados original.

* Ao usar `--recover` ou `--sort-recover` (mas não quando usa `--safe-recover`), você precisa de espaço em disco para a classificação. Esse espaço é alocado no diretório temporário (especificado por `TMPDIR` ou `--tmpdir=dir_name`). A seguinte fórmula fornece a quantidade de espaço necessária:

  ```sql
  (largest_key + row_pointer_length) * number_of_rows * 2
  ```

Você pode verificar o comprimento das chaves e o *`row_pointer_length`* com **myisamchk -dv *`tbl_name`*** (consulte Seção 4.6.3.5, “Obtenção de Informações da Tabela com myisamchk”). Os valores de *`row_pointer_length`* e *`number_of_rows`* são os valores de `Datafile pointer` e `Data records` na descrição da tabela. Para determinar o valor de *`largest_key`*, verifique as strings de `Key` na descrição da tabela. A coluna `Len` indica o número de bytes para cada parte da chave. Para um índice de múltiplas colunas, o tamanho da chave é a soma dos valores de `Len` para todas as partes da chave.

Se você tiver um problema com o espaço em disco durante a reparação, você pode tentar `--safe-recover` em vez de `--recover`.

### 4.6.4 myisamlog — Exibir o conteúdo do arquivo de registro MyISAM

O **myisamlog** processa o conteúdo de um arquivo de registro `MyISAM`. Para criar um arquivo desse tipo, inicie o servidor com uma opção `--log-isam=log_file`.

Invoque **myisamlog** da seguinte forma:

```sql
myisamlog [options] [file_name [tbl_name] ...]
```

A operação padrão é a atualização (`-u`). Se uma recuperação for realizada (`-r`), todas as escritas e, possivelmente, atualizações e exclusões são realizadas e os erros são contados apenas. O nome do arquivo de registro padrão é `myisam.log` se não for fornecido o argumento *`log_file`*. Se as tabelas forem nomeadas na string de comando, apenas essas tabelas serão atualizadas.

**myisamlog** suporta as seguintes opções:

* `-?`, `-I`

Exibir uma mensagem de ajuda e sair.

* `-c N`

Execute apenas os comandos *`N`*.

* `-f N`

Especifique o número máximo de arquivos abertos.

* `-F filepath/`

Especifique o caminho do arquivo com uma barra final.

* `-i`

Exibir informações extras antes de sair.

* `-o offset`

Especifique o deslocamento inicial.

* `-p N`

Remova os componentes *`N`* do caminho.

* `-r`

Realize uma operação de recuperação.

* `-R record_pos_file record_pos`

Especifique o arquivo de posição de registro e a posição de registro.

* `-u`

Realize uma operação de atualização.

* `-v`

Modo detalhado. Imprima mais informações sobre o que o programa faz. Esta opção pode ser dada várias vezes para produzir mais e mais saída.

* `-w write_file`

Especifique o arquivo de escrita.

* `-V`

Exibir informações da versão.

### 4.6.5 myisampack — Gerar tabelas MyISAM comprimidas e somente de leitura

A utilidade **myisampack** comprime as tabelas `MyISAM`. **myisampack** funciona comprimindo cada coluna da tabela separadamente. Geralmente, **myisampack** compacta o arquivo de dados de 40% a 70%.

Quando a tabela é usada posteriormente, o servidor lê na memória as informações necessárias para descomprimir as colunas. Isso resulta em um desempenho muito melhor ao acessar strings individuais, porque você só precisa descomprimir exatamente uma string.

O MySQL utiliza `mmap()` quando possível para realizar mapeamento de memória em tabelas compactadas. Se `mmap()` não funcionar, o MySQL recorre a operações normais de leitura/escrita de arquivos.

Por favor, observe o seguinte:

* Se o servidor `mysqld` foi invocado com bloqueio externo desativado, não é uma boa ideia invocar o **myisampack** se a tabela for atualizada pelo servidor durante o processo de embalagem. É mais seguro comprimir as tabelas com o servidor parado.

* Após embalar uma tabela, ela se torna somente de leitura. Isso é geralmente intencional (como quando acessa tabelas embaladas em um CD).

* **myisampack** não suporta tabelas particionadas.

Invoque o **myisampack** da seguinte forma:

```sql
myisampack [options] file_name ...
```

Cada argumento de nome de arquivo deve ser o nome de um arquivo de índice (`.MYI`). Se você não estiver no diretório do banco de dados, você deve especificar o nome do caminho do arquivo. É permitido omitir a extensão `.MYI`.

Depois de comprimir uma tabela com **myisampack**, use **myisamchk -rq** para reconstruir seus índices. Seção 4.6.3, “myisamchk — Ferramenta de manutenção de tabela MyISAM”.

O **myisampack** suporta as seguintes opções. Ele também lê arquivos de opções e suporta as opções para processá-las descritas na Seção 4.2.2.3, “Opções de string de comando que afetam o manuseio de arquivos de opção”.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--backup`, `-b`

  <table frame="box" rules="all" summary="Properties for backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup</code></td> </tr></tbody></table>

Faça um backup do arquivo de dados de cada tabela usando o nome `tbl_name.OLD`.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 10.15, “Configuração de Conjunto de Caracteres”.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o</code></td> </tr></tbody></table>

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for force"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--force</code></td> </tr></tbody></table>

Produza uma tabela compactada mesmo que ela se torne maior que a original ou se o arquivo intermediário de uma invocação anterior do **myisampack** exista. (O **myisampack** cria um arquivo intermediário chamado `tbl_name.TMD` no diretório do banco de dados enquanto comprime a tabela. Se você interromper o **myisampack**, o arquivo `.TMD` pode não ser excluído.) Normalmente, o **myisampack** sai com um erro se encontrar que o arquivo `tbl_name.TMD` existe. Com o `--force`, o **myisampack** compacta a tabela de qualquer forma.

* `--join=big_tbl_name`, `-j big_tbl_name`

  <table frame="box" rules="all" summary="Properties for join"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--join=big_tbl_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Junte todas as tabelas nomeadas na string de comando em uma única tabela compactada *`big_tbl_name`*. Todas as tabelas que devem ser combinadas *devem* ter estrutura idêntica (mesma nomes de colunas e tipos, mesmos índices, etc.).

*`big_tbl_name`* não deve existir antes da operação de junção. Todas as tabelas de origem nomeadas na string de comando a serem reunidas em *`big_tbl_name`* devem existir. As tabelas de origem são lidas para a operação de junção, mas não são modificadas.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for silent"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--silent</code></td> </tr></tbody></table>

Modo silencioso. Escreva a saída apenas quando ocorrerem erros.

* `--test`, `-t`

  <table frame="box" rules="all" summary="Properties for test"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--test</code></td> </tr></tbody></table>

Não embale a mesa, apenas teste a embalagem.

* `--tmpdir=dir_name`, `-T dir_name`

  <table frame="box" rules="all" summary="Properties for tmpdir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--tmpdir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

Use o diretório nomeado como o local onde o **myisampack** cria arquivos temporários.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

Modo detalhado. Escreva informações sobre o progresso da operação de embalagem e seu resultado.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup</code></td> </tr></tbody></table>0

Exibir informações da versão e sair.

* `--wait`, `-w`

  <table frame="box" rules="all" summary="Properties for backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup</code></td> </tr></tbody></table>1

Aguarde e tente novamente se a tabela estiver em uso. Se o servidor `mysqld` foi invocado com bloqueio externo desativado, não é uma boa ideia invocar o **myisampack** se a tabela pode ser atualizada pelo servidor durante o processo de embalagem.

A sequência de comandos a seguir ilustra uma sessão típica de compressão de tabela:

```sql
$> ls -l station.*
-rw-rw-r--   1 jones    my         994128 Apr 17 19:00 station.MYD
-rw-rw-r--   1 jones    my          53248 Apr 17 19:00 station.MYI
-rw-rw-r--   1 jones    my           5767 Apr 17 19:00 station.frm

$> myisamchk -dvv station

MyISAM file:     station
Isam-version:  2
Creation time: 1996-03-13 10:08:58
Recover time:  1997-02-02  3:06:43
Data records:              1192  Deleted blocks:              0
Datafile parts:            1192  Deleted data:                0
Datafile pointer (bytes):     2  Keyfile pointer (bytes):     2
Max datafile length:   54657023  Max keyfile length:   33554431
Recordlength:               834
Record format: Fixed length

table description:
Key Start Len Index   Type                 Root  Blocksize    Rec/key
1   2     4   unique  unsigned long        1024       1024          1
2   32    30  multip. text                10240       1024          1

Field Start Length Type
1     1     1
2     2     4
3     6     4
4     10    1
5     11    20
6     31    1
7     32    30
8     62    35
9     97    35
10    132   35
11    167   4
12    171   16
13    187   35
14    222   4
15    226   16
16    242   20
17    262   20
18    282   20
19    302   30
20    332   4
21    336   4
22    340   1
23    341   8
24    349   8
25    357   8
26    365   2
27    367   2
28    369   4
29    373   4
30    377   1
31    378   2
32    380   8
33    388   4
34    392   4
35    396   4
36    400   4
37    404   1
38    405   4
39    409   4
40    413   4
41    417   4
42    421   4
43    425   4
44    429   20
45    449   30
46    479   1
47    480   1
48    481   79
49    560   79
50    639   79
51    718   79
52    797   8
53    805   1
54    806   1
55    807   20
56    827   4
57    831   4

$> myisampack station.MYI
Compressing station.MYI: (1192 records)
- Calculating statistics

normal:     20  empty-space:   16  empty-zero:     12  empty-fill:  11
pre-space:   0  end-space:     12  table-lookups:   5  zero:         7
Original trees:  57  After join: 17
- Compressing file
87.14%
Remember to run myisamchk -rq on compressed tables

$> myisamchk -rq station
- check record delete-chain
- recovering (with sort) MyISAM-table 'station'
Data records: 1192
- Fixing index 1
- Fixing index 2

$> mysqladmin -uroot flush-tables

$> ls -l station.*
-rw-rw-r--   1 jones    my         127874 Apr 17 19:00 station.MYD
-rw-rw-r--   1 jones    my          55296 Apr 17 19:04 station.MYI
-rw-rw-r--   1 jones    my           5767 Apr 17 19:00 station.frm

$> myisamchk -dvv station

MyISAM file:     station
Isam-version:  2
Creation time: 1996-03-13 10:08:58
Recover time:  1997-04-17 19:04:26
Data records:               1192  Deleted blocks:              0
Datafile parts:             1192  Deleted data:                0
Datafile pointer (bytes):      3  Keyfile pointer (bytes):     1
Max datafile length:    16777215  Max keyfile length:     131071
Recordlength:                834
Record format: Compressed

table description:
Key Start Len Index   Type                 Root  Blocksize    Rec/key
1   2     4   unique  unsigned long       10240       1024          1
2   32    30  multip. text                54272       1024          1

Field Start Length Type                         Huff tree  Bits
1     1     1      constant                             1     0
2     2     4      zerofill(1)                          2     9
3     6     4      no zeros, zerofill(1)                2     9
4     10    1                                           3     9
5     11    20     table-lookup                         4     0
6     31    1                                           3     9
7     32    30     no endspace, not_always              5     9
8     62    35     no endspace, not_always, no empty    6     9
9     97    35     no empty                             7     9
10    132   35     no endspace, not_always, no empty    6     9
11    167   4      zerofill(1)                          2     9
12    171   16     no endspace, not_always, no empty    5     9
13    187   35     no endspace, not_always, no empty    6     9
14    222   4      zerofill(1)                          2     9
15    226   16     no endspace, not_always, no empty    5     9
16    242   20     no endspace, not_always              8     9
17    262   20     no endspace, no empty                8     9
18    282   20     no endspace, no empty                5     9
19    302   30     no endspace, no empty                6     9
20    332   4      always zero                          2     9
21    336   4      always zero                          2     9
22    340   1                                           3     9
23    341   8      table-lookup                         9     0
24    349   8      table-lookup                        10     0
25    357   8      always zero                          2     9
26    365   2                                           2     9
27    367   2      no zeros, zerofill(1)                2     9
28    369   4      no zeros, zerofill(1)                2     9
29    373   4      table-lookup                        11     0
30    377   1                                           3     9
31    378   2      no zeros, zerofill(1)                2     9
32    380   8      no zeros                             2     9
33    388   4      always zero                          2     9
34    392   4      table-lookup                        12     0
35    396   4      no zeros, zerofill(1)               13     9
36    400   4      no zeros, zerofill(1)                2     9
37    404   1                                           2     9
38    405   4      no zeros                             2     9
39    409   4      always zero                          2     9
40    413   4      no zeros                             2     9
41    417   4      always zero                          2     9
42    421   4      no zeros                             2     9
43    425   4      always zero                          2     9
44    429   20     no empty                             3     9
45    449   30     no empty                             3     9
46    479   1                                          14     4
47    480   1                                          14     4
48    481   79     no endspace, no empty               15     9
49    560   79     no empty                             2     9
50    639   79     no empty                             2     9
51    718   79     no endspace                         16     9
52    797   8      no empty                             2     9
53    805   1                                          17     1
54    806   1                                           3     9
55    807   20     no empty                             3     9
56    827   4      no zeros, zerofill(2)                2     9
57    831   4      no zeros, zerofill(1)                2     9
```

**myisampack** exibe os seguintes tipos de informações:

* `normal`

O número de colunas para as quais não é usada embalagem extra.

* `empty-space`

O número de colunas que contêm valores que são apenas espaços. Essas ocupam um bit.

* `empty-zero`

O número de colunas que contêm valores que são apenas zeros binários. Esses ocupam um bit.

* `empty-fill`

O número de colunas inteiras que não ocupam a faixa completa de bytes do seu tipo. Essas são alteradas para um tipo menor. Por exemplo, uma coluna `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (oito bytes) pode ser armazenada como uma coluna `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (um byte) se todos os seus valores estiverem na faixa de `-128` a `127`.

* `pre-space`

O número de colunas decimais que são armazenadas com espaços em branco no início. Neste caso, cada valor contém um contador para o número de espaços em branco no início.

* `end-space`

O número de colunas que têm muitos espaços em branco no final. Neste caso, cada valor contém um contador para o número de espaços em branco no final.

* `table-lookup`

A coluna tinha apenas um pequeno número de valores diferentes, que foram convertidos em `ENUM` antes da compressão de Huffman.

* `zero`

O número de colunas para as quais todos os valores são zero.

* `Original trees`

O número inicial de árvores de Huffman.

* `After join`

O número de árvores de Huffman distintas que restam após a junção de árvores para economizar espaço no cabeçalho.

Após uma tabela ter sido comprimida, as strings `Field` exibidas por **myisamchk -dvv** incluem informações adicionais sobre cada coluna:

* `Type`

O tipo de dados. O valor pode conter qualquer um dos seguintes descritores:

+ `constant`

Todas as strings têm o mesmo valor.

+ `no endspace`

Não armazene endspace.

+ `no endspace, not_always`

Não armazene endspace e não faça compressão de endspace para todos os valores.

+ `no endspace, no empty`

Não armazene endspace. Não armazene valores vazios.

+ `table-lookup`

A coluna foi convertida em um `ENUM`.

+ `zerofill(N)`

Os bytes mais significativos do valor *`N`* são sempre 0 e não são armazenados.

+ `no zeros`

Não armazene zeros.

+ `always zero`

Os valores zero são armazenados usando um bit.

* `Huff tree`

O número da árvore de Huffman associada à coluna.

* `Bits`

O número de bits utilizados na árvore de Huffman.

Depois de executar o **myisampack**, use o **myisamchk** para recriar quaisquer índices. Neste momento, você também pode ordenar os blocos do índice e criar estatísticas necessárias para que o otimizador do MySQL funcione de forma mais eficiente:

```sql
myisamchk -rq --sort-index --analyze tbl_name.MYI
```

Depois de ter instalado a tabela compactada no diretório do banco de dados MySQL, você deve executar **mysqladmin flush-tables** para forçar o `mysqld` a começar a usar a nova tabela.

Para descompactar uma tabela compactada, use a opção `--unpack` para o **myisamchk**.

### 4.6.6 mysql_config_editor — Ferramenta de configuração do MySQL

O utilitário **mysql_config_editor** permite que você armazene as credenciais de autenticação em um arquivo de caminho de login ofuscado chamado `.mylogin.cnf`. O local do arquivo é o diretório `%APPDATA%\MySQL` no Windows e o diretório de usuário atual no sistema não Windows. O arquivo pode ser lido posteriormente por programas do cliente MySQL para obter as credenciais de autenticação para conectar ao MySQL Server.

O formato não obscurecido do arquivo de caminho de login `.mylogin.cnf` consiste em grupos de opções, semelhante a outros arquivos de opções. Cada grupo de opções em `.mylogin.cnf` é chamado de "caminho de login", que é um grupo que permite apenas certas opções: `host`, `user`, `password`, `port` e `socket`. Pense em um grupo de opções de caminho de login como um conjunto de opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Aqui está um exemplo não obscurecido:

```sql
[client]
user = mydefaultname
password = mydefaultpass
host = 127.0.0.1
[mypath]
user = myothername
password = myotherpass
host = localhost
```

Quando você invoca um programa cliente para se conectar ao servidor, o cliente usa `.mylogin.cnf` em conjunto com outros arquivos de opção. Sua precedência é maior do que outros arquivos de opção, mas menor do que as opções especificadas explicitamente na string de comando do cliente. Para informações sobre a ordem em que os arquivos de opção são usados, consulte a Seção 4.2.2.2, “Usando arquivos de opção”.

Para especificar um nome de arquivo de caminho de login alternativo, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`. Essa variável é reconhecida pelo **mysql_config_editor**, pelos clientes padrão do MySQL (**mysql**, **mysqladmin** e assim por diante) e pelo utilitário de teste **mysql-test-run.pl**.

Os programas utilizam grupos no arquivo de caminho de login da seguinte forma:

* O **mysql_config_editor** opera no caminho de login `client` por padrão, se você não especificar nenhuma opção `--login-path=name` para indicar explicitamente qual caminho de login deve ser usado.

* Sem a opção `--login-path`, os programas do cliente leem os mesmos grupos de opções do arquivo de caminho de login que leem de outros arquivos de opção. Considere este comando:

  ```sql
  mysql
  ```

Por padrão, o cliente **mysql** lê os grupos `[client]` e `[mysql]` de outros arquivos de opção, então ele os lê também do arquivo de caminho de login.

* Com a opção `--login-path`, os programas de cliente também leem o caminho de login nomeado a partir do arquivo de caminho de login. Os grupos de leitura das outras opções dos arquivos de opção permanecem os mesmos. Considere este comando:

  ```sql
  mysql --login-path=mypath
  ```

O cliente **mysql** lê `[client]` e `[mysql]` de outros arquivos de opção, e `[client]`, `[mysql]` e `[mypath]` do arquivo de caminho de login.

* Os programas do cliente leem o arquivo de caminho de login mesmo quando a opção `--no-defaults` é usada, a menos que `--no-login-paths` esteja definido. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na string de comando, mesmo que `--no-defaults` esteja presente.

O **mysql_config_editor** ofusca o arquivo `.mylogin.cnf` para que ele não possa ser lido como texto claro, e seus conteúdos, quando não ofuscados por programas de cliente, são usados apenas na memória. Dessa forma, as senhas podem ser armazenadas em um arquivo em formato não claro e usadas posteriormente sem a necessidade de serem expostas na string de comando ou em uma variável de ambiente. O **mysql_config_editor** fornece um comando `print` para exibir os conteúdos do arquivo do caminho de login, mas mesmo nesse caso, os valores das senhas são mascarados para que nunca apareçam de uma maneira que outros usuários possam vê-los.

A ofuscação usada pelo **mysql_config_editor** impede que as senhas apareçam no `.mylogin.cnf` como texto claro e oferece uma medida de segurança ao impedir a exposição acidental das senhas. Por exemplo, se você exibe um arquivo de opção `my.cnf` regular e não ofuscado na tela, quaisquer senhas que ele contém são visíveis para qualquer pessoa. Com o `.mylogin.cnf`, isso não é verdade, mas a ofuscação usada provavelmente não impedirá um invasor determinado e você não deve considerá-la inquebrável. Um usuário que pode obter privilégios de administração do sistema na sua máquina para acessar seus arquivos pode ofuscar o arquivo `.mylogin.cnf` com algum esforço.

O arquivo de caminho de login deve ser legível e gravável pelo usuário atual e inacessível para outros usuários. Caso contrário, o **mysql_config_editor** o ignora, e os programas cliente também não o utilizam.

Invoque o **mysql_config_editor** da seguinte forma:

```sql
mysql_config_editor [program_options] command [command_options]
```

Se o arquivo de caminho de login não existir, o **mysql_config_editor** cria-o.

Os argumentos do comando são fornecidos da seguinte forma:

* *`program_options`* consiste em opções gerais do **mysql_config_editor**.

* `command` indica qual ação deve ser realizada no arquivo do caminho de login `.mylogin.cnf`. Por exemplo, `set` escreve um caminho de login no arquivo, `remove` remove um caminho de login e `print` exibe o conteúdo do caminho de login.

* *`command_options`* indica quaisquer opções adicionais específicas para o comando, como o nome do caminho de login e os valores a serem usados no caminho de login.

A posição do nome do comando dentro do conjunto de argumentos do programa é significativa. Por exemplo, essas strings de comando têm os mesmos argumentos, mas produzem resultados diferentes:

```sql
mysql_config_editor --help set
mysql_config_editor set --help
```

A primeira string de comando exibe uma mensagem de ajuda geral do **mysql_config_editor** e ignora o comando `set`. A segunda string de comando exibe uma mensagem de ajuda específica para o comando `set`.

Suponha que você queira estabelecer um caminho de login `client` que defina seus parâmetros de conexão padrão e um caminho de login adicional chamado `remote` para se conectar ao servidor MySQL hospedado em `remote.example.com`. Você deseja fazer login da seguinte forma:

* Por padrão, para o servidor local com nome de usuário e senha de `localuser` e `localpass`

* Para o servidor remoto com nome de usuário e senha de `remoteuser` e `remotepass`

Para configurar as permissões de login no arquivo `.mylogin.cnf`, use os seguintes comandos `set`. Digite cada comando em uma única string e, quando solicitado, insira as senhas apropriadas:

```sql
$> mysql_config_editor set --login-path=client
         --host=localhost --user=localuser --password
Enter password: enter password "localpass" here
$> mysql_config_editor set --login-path=remote
         --host=remote.example.com --user=remoteuser --password
Enter password: enter password "remotepass" here
```

O **mysql_config_editor** usa o caminho de login `client` por padrão, portanto, a opção `--login-path=client` pode ser omitida no primeiro comando sem alterar seu efeito.

Para ver o que o **mysql_config_editor** escreve no arquivo `.mylogin.cnf`, use o comando `print`:

```sql
$> mysql_config_editor print --all
[client]
user = localuser
password = *****
host = localhost
[remote]
user = remoteuser
password = *****
host = remote.example.com
```

O comando `print` exibe cada caminho de login como um conjunto de strings que começam com um cabeçalho de grupo indicando o nome do caminho de login entre colchetes, seguido pelos valores das opções para o caminho de login. Os valores da senha são mascarados e não aparecem como texto claro.

Se você não especificar `--all` para exibir todos os caminhos de login ou `--login-path=name` para exibir um caminho de login com nome, o comando `print` exibe o caminho de login `client` por padrão, se houver um.

Como mostrado no exemplo anterior, o arquivo de caminho de login pode conter vários caminhos de login. Dessa forma, o **mysql_config_editor** facilita a configuração de várias "personalidades" para conectar a diferentes servidores MySQL, ou para conectar a um servidor específico usando diferentes contas. Qualquer uma dessas pode ser selecionada pelo nome posteriormente usando a opção `--login-path` quando você invoca um programa cliente. Por exemplo, para se conectar ao servidor remoto, use este comando:

```sql
mysql --login-path=remote
```

Aqui, o **mysql** lê os grupos de opções `[client]` e `[mysql]` dos outros arquivos de opções, e os grupos `[client]`, `[mysql]` e `[remote]` do arquivo de caminho de login.

Para se conectar ao servidor local, use este comando:

```sql
mysql --login-path=client
```

Como o **mysql** lê os caminhos de login `client` e `mysql` por padrão, a opção `--login-path` não adiciona nada neste caso. Esse comando é equivalente a este:

```sql
mysql
```

As opções lidas do arquivo de caminho de login têm precedência sobre as opções lidas de outros arquivos de opção. As opções lidas de grupos de caminho de login que aparecem mais tarde no arquivo de caminho de login têm precedência sobre as opções lidas de grupos que aparecem mais cedo no arquivo.

O **mysql_config_editor** adiciona caminhos de login ao arquivo de caminhos de login na ordem em que os cria, então você deve criar caminhos de login mais gerais primeiro e caminhos mais específicos depois. Se você precisar mover um caminho de login dentro do arquivo, pode removê-lo e, em seguida, recriá-lo para adicioná-lo ao final. Por exemplo, um caminho de login `client` é mais geral, pois é lido por todos os programas cliente, enquanto um caminho de login `mysqldump` é lido apenas pelo **mysqldump**. As opções especificadas mais tarde substituem as opções especificadas anteriormente, então colocar os caminhos de login na ordem `client`, `mysqldump` permite que as opções específicas do **mysqldump** substituam as opções do `client`.

Quando você usa o comando `set` com o **mysql_config_editor** para criar um caminho de login, você não precisa especificar todos os valores das opções possíveis (nome do host, nome do usuário, senha, porta, soquete). Apenas os valores fornecidos são escritos no caminho. Quaisquer valores faltantes necessários posteriormente podem ser especificados quando você invoca um caminho de cliente para se conectar ao servidor MySQL, seja em outros arquivos de opção ou na string de comando. Quaisquer opções especificadas na string de comando substituem aquelas especificadas no arquivo de caminho de login ou em outros arquivos de opção. Por exemplo, se as credenciais no caminho de login `remote` também se aplicam ao host `remote2.example.com`, conecte-se ao servidor nesse host da seguinte forma:

```sql
mysql --login-path=remote --host=remote2.example.com
```

#### mysql_config_editor Opções gerais

O **mysql_config_editor** suporta as seguintes opções gerais, que podem ser usadas antes de qualquer comando nomeado na string de comando. Para descrições de opções específicas de comando, consulte os comandos e opções específicas de comando do mysql_config_editor.

**Tabela 4.22 mysql_config_editor Opções Gerais**

<table frame="box" rules="all" summary="General Command-line options available for mysql_config_editor."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--debug</td> <td>Escreva o log de depuração</td> </tr><tr><td>--help</td> <td>Exibir mensagem de ajuda e sair</td> </tr><tr><td>--verbose</td> <td>Modo verbosos</td> </tr><tr><td>--version</td> <td>Exibir informações da versão e sair</td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda geral e sair.

Para ver uma mensagem de ajuda específica para um comando, invoque **mysql_config_editor** da seguinte forma, onde *`command`* é um comando diferente de `help`:

  ```sql
  mysql_config_editor command --help
  ```

* `--debug[=debug_options]`, `-# debug_options`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o</code></td> </tr></tbody></table>

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysql_config_editor.trace`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

Modo detalhado. Imprima mais informações sobre o que o programa faz. Esta opção pode ser útil para diagnosticar problemas, caso uma operação não tenha o efeito esperado.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr></tbody></table>

Exibir informações da versão e sair.

#### mysql_config_editor Comandos e Opções Específicas de Comando

Esta seção descreve os comandos permitidos do **mysql_config_editor** e, para cada um deles, as opções específicas do comando permitidas após o nome do comando na string de comando.

Além disso, o **mysql_config_editor** suporta opções gerais que podem ser usadas antes de qualquer comando. Para descrições dessas opções, consulte Opções gerais do mysql_config_editor.

O **mysql_config_editor** suporta esses comandos:

* `help`

Exibir uma mensagem de ajuda geral e sair. Este comando não aceita opções adicionais.

Para ver uma mensagem de ajuda específica para um comando, invoque **mysql_config_editor** da seguinte forma, onde *`command`* é um comando diferente de `help`:

  ```sql
  mysql_config_editor command --help
  ```

* `print [options]`

Imprima o conteúdo do arquivo de caminho de login em forma não desfocada, com exceção de que as senhas são exibidas como `*****`.

O nome padrão do caminho de login é `client` se nenhum caminho de login estiver nomeado. Se os caminhos `--all` e `--login-path` forem fornecidos, o `--all` terá precedência.

O comando `print` permite essas opções após o nome do comando:

+ `--help`, `-?`

Exiba uma mensagem de ajuda para o comando `print` e saia.

Para ver uma mensagem de ajuda geral, use **mysql_config_editor --help**.

+ `--all`

Imprima o conteúdo de todos os caminhos de login no arquivo de caminho de login.

+ `--login-path=name`, `-G name`

Imprima o conteúdo do caminho de login nomeado.

* `remove [options]`

Remova um caminho de login do arquivo de caminhos de login, ou modifique um caminho de login removendo opções dele.

Este comando remove do caminho de login apenas as opções especificadas com as opções `--host`, `--password`, `--port`, `--socket` e `--user`. Se nenhuma dessas opções for fornecida, o `remove` remove todo o caminho de login. Por exemplo, este comando remove apenas a opção `user` do caminho de login `mypath` em vez de todo o caminho de login `mypath`:

  ```sql
  mysql_config_editor remove --login-path=mypath --user
  ```

Este comando remove o caminho de login inteiro `mypath`:

  ```sql
  mysql_config_editor remove --login-path=mypath
  ```

O comando `remove` permite essas opções após o nome do comando:

+ `--help`, `-?`

Exiba uma mensagem de ajuda para o comando `remove` e saia.

Para ver uma mensagem de ajuda geral, use **mysql_config_editor --help**.

+ `--host`, `-h`

Remova o nome do host do caminho de login.

+ `--login-path=name`, `-G name`

O caminho de login para remover ou modificar. O nome padrão do caminho de login é `client` se esta opção não for fornecida.

+ `--password`, `-p`

Remova a senha do caminho de login.

+ `--port`, `-P`

Remova o número da porta TCP/IP do caminho de login.

+ `--socket`, `-S`

Remova o nome do arquivo de socket Unix do caminho de login.

+ `--user`, `-u`

Remova o nome do usuário do caminho de login.

+ `--warn`, `-w`

Alerte e peça confirmação ao usuário se o comando tentar remover o caminho de login padrão (`client`) e `--login-path=client` não foi especificado. Esta opção é ativada por padrão; use `--skip-warn` para desativá-la.

* `reset [options]`

Esvazie o conteúdo do arquivo do caminho de login.

O comando `reset` permite essas opções após o nome do comando:

+ `--help`, `-?`

Exiba uma mensagem de ajuda para o comando `reset` e saia.

Para ver uma mensagem de ajuda geral, use **mysql_config_editor --help**.

* `set [options]`

Escreva um caminho de login para o arquivo de caminho de login.

Este comando escreve no caminho de login apenas as opções especificadas com as opções `--host`, `--password`, `--port`, `--socket` e `--user`. Se nenhuma dessas opções for fornecida, o **mysql_config_editor** escreve o caminho de login como um grupo vazio.

O comando `set` permite essas opções após o nome do comando:

+ `--help`, `-?`

Exiba uma mensagem de ajuda para o comando `set` e saia.

Para ver uma mensagem de ajuda geral, use **mysql_config_editor --help**.

+ `--host=host_name`, `-h host_name`

O nome do host para escrever no caminho de login.

+ `--login-path=name`, `-G name`

O caminho de login para criar. O nome padrão do caminho de login é `client` se esta opção não for fornecida.

+ `--password`, `-p`

Solicitar uma senha para escrever no caminho de login. Após o **mysql_config_editor** exibir o prompt, digite a senha e pressione Enter. Para evitar que outros usuários vejam a senha, o **mysql_config_editor** não a exibe.

Para especificar uma senha vazia, pressione Enter na prompt de senha. O caminho de login resultante, escrito no arquivo de caminho de login, inclui uma string como esta:

    ```sql
    password =
    ```

+ `--port=port_num`, `-P port_num`

O número de porta TCP/IP para escrever no caminho de login.

+ `--socket=file_name`, `-S file_name`

O nome do arquivo de socket Unix para escrever no caminho de login.

+ `--user=user_name`, `-u user_name`

O nome do usuário para escrever no caminho de login.

+ `--warn`, `-w`

Alerte e peça confirmação ao usuário se o comando tentar sobrescrever um caminho de login existente. Esta opção é habilitada por padrão; use `--skip-warn` para desabilitá-la.

### 4.6.7 mysqlbinlog — Ferramenta para processar arquivos de registro binário

O log binário do servidor consiste em arquivos que contêm "eventos" que descrevem as modificações nos conteúdos do banco de dados. O servidor escreve esses arquivos em formato binário. Para exibir seus conteúdos em formato de texto, use o utilitário **mysqlbinlog**. Você também pode usar **mysqlbinlog** para exibir os conteúdos dos arquivos de log de relevo escritos por um servidor replica em uma configuração de replicação, pois os logs de relevo têm o mesmo formato dos logs binários. O log binário e o log de relevo são discutidos mais adiante na Seção 5.4.4, "O Log Binário", e na Seção 16.2.4, "Repositórios de Log de Relevo e Metadados de Replicação".

Invoque o **mysqlbinlog** da seguinte forma:

```sql
mysqlbinlog [options] log_file ...
```

Por exemplo, para exibir o conteúdo do arquivo de registro binário denominado `binlog.000003`, use este comando:

```sql
mysqlbinlog binlog.000003
```

A saída inclui eventos contidos em `binlog.000003`. Para o registro baseado em declarações, as informações dos eventos incluem a declaração SQL, o ID do servidor em que ela foi executada, o timestamp quando a declaração foi executada, quanto tempo levou, e assim por diante. Para o registro baseado em strings, o evento indica uma mudança de string em vez de uma declaração SQL. Consulte a Seção 16.2.1, “Formatos de Replicação”, para informações sobre os modos de registro.

Os eventos são precedidos por comentários de cabeçalho que fornecem informações adicionais. Por exemplo:

```sql
# at 141
#100309  9:28:36 server id 123  end_log_pos 245
  Query thread_id=3350  exec_time=11  error_code=0
```

Na primeira string, o número que segue `at` indica o deslocamento do arquivo, ou a posição inicial, do evento no arquivo de registro binário.

A segunda string começa com uma data e uma hora que indicam quando a declaração começou no servidor onde o evento se originou. Para a replicação, este timestamp é propagado para os servidores replicados. `server id` é o valor `server_id` do servidor onde o evento se originou. `end_log_pos` indica onde o próximo evento começa (ou seja, é a posição final do evento atual + 1). `thread_id` indica qual thread executou o evento. `exec_time` é o tempo gasto executando o evento, em um servidor de origem de replicação. Em uma replica, é a diferença do tempo de execução final na replica menos o tempo de início de execução na fonte. A diferença serve como um indicador de quanto a replicação fica para trás em relação à fonte. `error_code` indica o resultado da execução do evento. Zero significa que não ocorreu nenhum erro.

Nota

Ao usar grupos de eventos, os deslocamentos de arquivo dos eventos podem ser agrupados e os comentários dos eventos podem ser agrupados. Não confunda esses eventos agrupados com deslocamentos de arquivo em branco.

A saída do **mysqlbinlog** pode ser reexecutada (por exemplo, usando-o como entrada para **mysql**) para repetir as declarações no log. Isso é útil para operações de recuperação após uma saída inesperada do servidor. Para outros exemplos de uso, consulte a discussão mais adiante nesta seção e na Seção 7.5, “Recuperação Ponto no Tempo (Incremental) de Recuperação”).

Você pode usar **mysqlbinlog** para ler arquivos de registro binário diretamente e aplicá-los ao servidor MySQL local. Você também pode ler logs binários de um servidor remoto usando a opção `--read-from-remote-server`. Para ler logs binários remotos, as opções de parâmetros de conexão podem ser fornecidas para indicar como se conectar ao servidor. Essas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`.

Ao executar o **mysqlbinlog** em um registro binário grande, tenha cuidado para que o sistema de arquivos tenha espaço suficiente para os arquivos resultantes. Para configurar o diretório que o **mysqlbinlog** usa para arquivos temporários, use a variável de ambiente `TMPDIR`.

O **mysqlbinlog** define o valor de `pseudo_slave_mode` como verdadeiro antes de executar quaisquer instruções SQL. Essa variável do sistema afeta o tratamento de transações XA.

O **mysqlbinlog** suporta as seguintes opções, que podem ser especificadas na string de comando ou nos grupos `[mysqlbinlog]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.23 Opções do mysqlbinlog**

<table frame="box" rules="all" summary="Command-line options available for mysqlbinlog.">
<col style="width: 27%"/>
<col style="width: 50%"/>
<col style="width: 11%"/>
<col style="width: 11%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--base64-output</code></th>
<td>Imprimir entradas de registro binário usando codificação base-64</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--bind-address</code></th>
<td>Use a interface de rede especificada para se conectar ao servidor MySQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--binlog-row-event-max-size</code></th>
<td>Tamanho máximo do evento de registro binário</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--character-sets-dir</code></th>
<td>Diretório onde os conjuntos de caracteres são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--connection-server-id</code></th>
<td>Utilizado para testes e depuração. Consulte o texto para obter os valores padrão aplicáveis e outras informações</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--database</code></th>
<td>Lista de entradas apenas para este banco de dados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug</code></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-check</code></th>
<td>Imprimir informações de depuração quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--debug-info</code></th>
<td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--default-auth</code></th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-extra-file</code></th>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-file</code></th>
<td>Arquivo de opção de leitura apenas nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--defaults-group-suffix</code></th>
<td>Valor do sufixo do grupo de opções</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--disable-log-bin</code></th>
<td>Disable binary logging</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--exclude-gtids</code></th>
<td>Não mostre nenhum dos grupos no conjunto de GTID fornecido</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--force-if-open</code></th>
<td>Leia arquivos de registro binários mesmo que estejam abertos ou não fechados corretamente</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--force-read</code></th>
<td>Se o mysqlbinlog ler um evento de registro binário que ele não reconhece, ele imprime um aviso</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--get-server-public-key</code></th>
<td>Solicitar chave pública RSA do servidor</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--help</code></th>
<td>Exibir mensagem de ajuda e sair</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--hexdump</code></th>
<td>Exibir um dump hexadecimal dos comentários do log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--idempotent</code></th>
<td>Fazer com que o servidor use o modo idempotente ao processar atualizações de log binário desta sessão apenas</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--include-gtids</code></th>
<td>Mostrar apenas os grupos no conjunto GTID fornecido</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--local-load</code></th>
<td>Prepare arquivos temporários locais para o LOAD DATA no diretório especificado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--login-path</code></th>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--no-defaults</code></th>
<td>Não leia arquivos de opção</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--offset</code></th>
<td>Pular as primeiras N entradas no log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--open-files-limit</code></th>
<td>Especifique o número de descritores de arquivo abertos a serem reservados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--plugin-dir</code></th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--print-defaults</code></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--raw</code></th>
<td>Escreva eventos em formato bruto (binário) para arquivos de saída</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--read-from-remote-master</code></th>
<td>Leia o log binário de um servidor de fonte de replicação MySQL em vez de ler um arquivo de log local</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--read-from-remote-server</code></th>
<td>Leia o log binário do servidor MySQL em vez do arquivo de log local</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--result-file</code></th>
<td>Saída direta para um arquivo nomeado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--rewrite-db</code></th>
<td>Crie regras de reescrita para bancos de dados ao reproduzir dados de logs escritos em formato baseado em string. Pode ser usado várias vezes</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--secure-auth</code></th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td></td>
<td>Sim</td>
</tr>
<tr>
<th><code>--server-id</code></th>
<td>Extraia apenas os eventos criados pelo servidor com o ID do servidor fornecido</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--server-id-bits</code></th>
<td>Informe ao mysqlbinlog como interpretar os IDs do servidor no log binário quando o log foi escrito por um mysqld com seus bits de ID de servidor definidos como menores que o máximo; suportado apenas pela versão do mysqlbinlog do MySQL Cluster</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--server-public-key-path</code></th>
<td>Nome do caminho para o arquivo que contém a chave pública RSA</td>
<td>5.7.23</td>
<td></td>
</tr>
<tr>
<th><code>--set-charset</code></th>
<td>Add a SET NAMES charset_name statement to the output</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--shared-memory-base-name</code></th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--short-form</code></th>
<td>Exibir apenas as declarações contidas no log</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--skip-gtids</code></th>
<td>Não inclua os GTIDs dos arquivos de registro binário no arquivo de dump de saída</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl</code></th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-ca</code></th>
<td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-capath</code></th>
<td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cert</code></th>
<td>Arquivo que contém o certificado X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-cipher</code></th>
<td>Cifras permitidas para criptografia de conexão</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crl</code></th>
<td>Arquivo que contém listas de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-crlpath</code></th>
<td>Diretório que contém arquivos de lista de revogação de certificados</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-key</code></th>
<td>Arquivo que contém a chave X.509</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--ssl-mode</code></th>
<td>Estado de segurança desejado da conexão com o servidor</td>
<td>5.7.11</td>
<td></td>
</tr>
<tr>
<th><code>--ssl-verify-server-cert</code></th>
<td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--start-datetime</code></th>
<td>Leia o log binário do primeiro evento com o timestamp igual ou posterior ao argumento datetime</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--start-position</code></th>
<td>Decodifique o registro binário a partir do primeiro evento com posição igual a ou maior que o argumento</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--stop-datetime</code></th>
<td>Pare de ler o registro binário no primeiro evento com o timestamp igual ou maior que o argumento datetime</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--stop-never</code></th>
<td>Mantenha-se conectado ao servidor após ler o último arquivo de registro binário</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--stop-never-slave-server-id</code></th>
<td>ID do servidor escravo para relatar ao conectar-se ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--stop-position</code></th>
<td>Pare de decodificar o log binário no primeiro evento com posição igual ou maior que o argumento</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--tls-version</code></th>
<td>Protocolos TLS permitidos para conexões criptografadas</td>
<td>5.7.10</td>
<td></td>
</tr>
<tr>
<th><code>--to-last-log</code></th>
<td>Não pare no final do log binário solicitado de um servidor MySQL, mas sim continue imprimindo até o final do último log binário.</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verbose</code></th>
<td>Reconstrua eventos de string como declarações SQL</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--verify-binlog-checksum</code></th>
<td>Verifique os checksums no log binário</td>
<td></td>
<td></td>
</tr>
<tr>
<th><code>--version</code></th>
<td>Exibir informações da versão e sair</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--base64-output=value`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>

Essa opção determina quando os eventos devem ser exibidos codificados como strings baseadas em 64 usando as declarações `BINLOG`. A opção tem esses valores permitidos (não sensíveis ao caso):

+ `AUTO` ("automático") ou `UNSPEC` ("especificado") exibe as declarações `BINLOG` automaticamente quando necessário (ou seja, para eventos de descrição de formato e eventos de string). Se não for dada a opção `--base64-output`, o efeito é o mesmo que `--base64-output=AUTO`.

Nota

O display automático `BINLOG` é o único comportamento seguro se você pretende usar a saída do **mysqlbinlog** para reexecutar o conteúdo do arquivo de registro binário. Os outros valores das opções são destinados apenas para fins de depuração ou teste, pois podem produzir saída que não inclui todos os eventos na forma executável.

+ `NEVER` faz com que as declarações `BINLOG` não sejam exibidas. **mysqlbinlog** sai com um erro se for encontrado um evento de string que deve ser exibido usando `BINLOG`.

+ `DECODE-ROWS` especifica para **mysqlbinlog** que você pretende que os eventos de string sejam decodificados e exibidos como declarações SQL comentadas, especificando também a opção `--verbose`. Assim como `NEVER`, `DECODE-ROWS` suprime a exibição de declarações `BINLOG`, mas, ao contrário de `NEVER`, não sai com um erro se um evento de string for encontrado.

Para exemplos que mostram o efeito de `--base64-output` e `--verbose` na saída de eventos de string, consulte a Seção 4.6.7.2, “Exibição de Eventos de String de mysqlbinlog”.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--binlog-row-event-max-size=N`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>

Especifique o tamanho máximo de um evento de registro binário baseado em string, em bytes. As strings são agrupadas em eventos menores que este tamanho, se possível. O valor deve ser um múltiplo de 256. O padrão é 4 GB.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 10.15, “Configuração de Conjunto de Caracteres”.

* `--connection-server-id=server_id`

  <table frame="box" rules="all" summary="Properties for connection-server-id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-server-id=#]</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0 (1)</code></td> </tr><tr><th>Minimum Value</th> <td><code>0 (1)</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

Esta opção é usada para testar um servidor MySQL quanto ao suporte à bandeira de conexão `BINLOG_DUMP_NON_BLOCK`. Não é necessária para operações normais.

Os valores eficazes de falha e mínimo para esta opção dependem de se o **mysqlbinlog** é executado em modo de bloqueio ou modo não-bloqueio. Quando o **mysqlbinlog** é executado em modo de bloqueio, o valor padrão (e mínimo) é 1; quando executado em modo não-bloqueio, o valor padrão (e mínimo) é 0.

* `--database=db_name`, `-d db_name`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=db_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Essa opção faz com que o **mysqlbinlog** exiba entradas do log binário (apenas o log local) que ocorrem enquanto *`db_name`* é selecionado como o banco de dados padrão pelo `USE`.

A opção `--database` para o **mysqlbinlog** é semelhante à opção `--binlog-do-db` para o `mysqld`, mas pode ser usada para especificar apenas um banco de dados. Se `--database` for fornecido várias vezes, apenas a última instância será usada.

Os efeitos desta opção dependem de se o formato de registro baseado em declaração ou baseado em string está em uso, da mesma forma que os efeitos de `--binlog-do-db` dependem de se o registro baseado em declaração ou baseado em string está em uso.

**Registro baseado em declarações.** A opção `--database` funciona da seguinte forma:

+ Embora *`db_name`* seja o banco de dados padrão, as declarações são exibidas se elas modificam tabelas em *`db_name`* ou em outro banco de dados.

+ A menos que *`db_name`* seja selecionado como banco de dados padrão, as declarações não são exibidas, mesmo que modifiquem tabelas em *`db_name`*.

+ Há uma exceção para `CREATE DATABASE`, `ALTER DATABASE` e `DROP DATABASE`. O banco de dados que está sendo *criado, alterado ou descartado* é considerado o banco de dados padrão ao determinar se deve ser emitida a declaração.

Suponha que o log binário foi criado executando essas declarações usando o registro baseado em declarações:

  ```sql
  INSERT INTO test.t1 (i) VALUES(100);
  INSERT INTO db2.t2 (j)  VALUES(200);
  USE test;
  INSERT INTO test.t1 (i) VALUES(101);
  INSERT INTO t1 (i)      VALUES(102);
  INSERT INTO db2.t2 (j)  VALUES(201);
  USE db2;
  INSERT INTO test.t1 (i) VALUES(103);
  INSERT INTO db2.t2 (j)  VALUES(202);
  INSERT INTO t2 (j)      VALUES(203);
  ```

**mysqlbinlog --database=test** não exibe as duas primeiras declarações `INSERT` porque não há um banco de dados padrão. Exibe as três declarações `INSERT` após `USE test`, mas não as três declarações `INSERT` após `USE db2`.

**mysqlbinlog --database=db2** não exibe as duas primeiras declarações `INSERT` porque não há um banco de dados padrão. Não exibe as três declarações `INSERT` após `USE test`, mas exibe as três declarações `INSERT` após `USE db2`.

**Registro baseado em strings.** **mysqlbinlog** emite apenas entradas que alteram tabelas pertencentes a *`db_name`*. O banco de dados padrão não tem efeito sobre isso. Suponha que o registro binário recém-descrito tenha sido criado usando registro baseado em strings, em vez de registro baseado em declarações. **mysqlbinlog --database=test** emite apenas aquelas entradas que modificam `t1` no banco de dados de teste, independentemente de `USE` ter sido emitido ou qual é o banco de dados padrão.

Se um servidor estiver rodando com `binlog_format` definido como `MIXED` e você deseja que seja possível usar **mysqlbinlog** com a opção `--database`, você deve garantir que as tabelas que são modificadas estejam no banco de dados selecionado por `USE`. (Em particular, não devem ser usadas atualizações cruzadas entre bancos de dados.)

Quando utilizado em conjunto com a opção `--rewrite-db`, a opção `--rewrite-db` é aplicada primeiro; em seguida, a opção `--database` é aplicada, utilizando o nome do banco de dados reescrito. A ordem em que as opções são fornecidas não faz diferença nesse aspecto.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o,/tmp/mysqlbinlog.trace</code></td> </tr></tbody></table>

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysqlbinlog.trace`.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for debug-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--debug-info`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação substituível”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysqlbinlog** normalmente lê os grupos `[client]` e `[mysqlbinlog]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysqlbinlog** também lê os grupos `[client_other]` e `[mysqlbinlog_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--disable-log-bin`, `-D`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

Desative o registro binário. Isso é útil para evitar um loop infinito se você usar a opção `--to-last-log` e estiver enviando a saída para o mesmo servidor MySQL. Esta opção também é útil ao restaurar após uma saída inesperada para evitar a duplicação das declarações que você registrou.

Essa opção faz com que o **mysqlbinlog** inclua uma declaração `SET sql_log_bin = 0` em sua saída para desabilitar o registro binário do restante da saída. Manipular o valor da sessão da variável de sistema `sql_log_bin` é uma operação restrita, portanto, essa opção exige que você tenha privilégios suficientes para definir variáveis de sessão restritas. Veja a Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”.

* `--exclude-gtids=gtid_set`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

Não exiba nenhum dos grupos listados no *`gtid_set`*.

* `--force-if-open`, `-F`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

Leia arquivos de registro binários mesmo que estejam abertos ou não tenham sido fechados corretamente.

* `--force-read`, `-f`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

Com esta opção, se o **mysqlbinlog** lê um evento de registro binário que não reconhece, ele exibe um aviso, ignora o evento e continua. Sem esta opção, o **mysqlbinlog** para se parar se ler tal evento.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

Solicitar a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação SHA-2 Pluggable”.

A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--hexdump`, `-H`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>0

Exiba um dump hexadecimal do log em comentários, conforme descrito na Seção 4.6.7.1, "Formato de Dump Hexadecimal mysqlbinlog". A saída hexadecimal pode ser útil para depuração de replicação.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>1

Obtenha o log binário do servidor MySQL no host fornecido.

* `--idempotent`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>2

Informe ao servidor MySQL para usar o modo idempotente durante o processamento de atualizações; isso causa a supressão de quaisquer erros de chave duplicada ou chave não encontrada que o servidor encontre na sessão atual durante o processamento de atualizações. Esta opção pode ser útil sempre que seja desejável ou necessário refazer um ou mais logs binários para um servidor MySQL que pode não conter todos os dados aos quais os logs se referem.

O escopo de efeito para esta opção inclui apenas o cliente e a sessão atuais **mysqlbinlog**.

* `--include-gtids=gtid_set`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>3

Exibir apenas os grupos listados no *`gtid_set`*.

* `--local-load=dir_name`, `-l dir_name`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>4

Para operações de carregamento de dados correspondentes às declarações `LOAD DATA`, o **mysqlbinlog** extrai os arquivos dos eventos do log binário, os escreve como arquivos temporários no sistema de arquivos local e escreve as declarações `LOAD DATA LOCAL` para carregar os arquivos. Por padrão, o **mysqlbinlog** escreve esses arquivos temporários em um diretório específico do sistema operacional. A opção `--local-load` pode ser usada para especificar explicitamente o diretório onde o **mysqlbinlog** deve preparar arquivos temporários locais.

Importante

Esses arquivos temporários não são removidos automaticamente pelo **mysqlbinlog** ou por qualquer outro programa do MySQL.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>5

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>6

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na string de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 4.6.6, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--offset=N`, `-o N`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>7

Ignorar as primeiras entradas *`N`* no log.

* `--open-files-limit=N`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>8

Especifique o número de descritores de arquivo abertos a serem reservados.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for base64-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--base64-output=value</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>AUTO</code></td> </tr><tr><th>Valores válidos</th> <td><code>AUTO</code><code>NEVER</code><code>DECODE-ROWS</code></td> </tr></tbody></table>9

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecida, o **mysqlbinlog** solicita uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de opção de senha, o padrão é não enviar senha.

Especificar uma senha na string de comando deve ser considerado inseguro. Para evitar fornecer a senha na string de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysqlbinlog** não deve solicitar uma senha, use a opção `--skip-password`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysqlbinlog** não o encontrar. Veja a Seção 6.2.13, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

O número do porto TCP/IP a ser usado para se conectar a um servidor remoto.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de string de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

* `--raw`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

Por padrão, o **mysqlbinlog** lê arquivos de registro binário e escreve eventos no formato de texto. A opção `--raw` informa ao **mysqlbinlog** que deve escrevê-los em seu formato binário original. Seu uso exige que `--read-from-remote-server` também seja usado, porque os arquivos são solicitados de um servidor. O **mysqlbinlog** escreve um arquivo de saída para cada arquivo lido do servidor. A opção `--raw` pode ser usada para fazer um backup do log binário de um servidor. Com a opção `--stop-never`, o backup é “ativo” porque o **mysqlbinlog** permanece conectado ao servidor. Por padrão, os arquivos de saída são escritos no diretório atual com os mesmos nomes dos arquivos de registro originais. Os nomes dos arquivos de saída podem ser modificados usando a opção `--result-file`. Para mais informações, consulte a Seção 4.6.7.3, “Usando o mysqlbinlog para fazer backup de arquivos de registro binário”.

* `--read-from-remote-master=type`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

Leia logs binários de um servidor MySQL com os comandos `COM_BINLOG_DUMP` ou `COM_BINLOG_DUMP_GTID`, definindo o valor da opção em `BINLOG-DUMP-NON-GTIDS` ou `BINLOG-DUMP-GTIDS`, respectivamente. Se `--read-from-remote-master=BINLOG-DUMP-GTIDS` for combinado com `--exclude-gtids`, as transações podem ser filtradas por fonte, evitando tráfego de rede desnecessário.

As opções de parâmetros de conexão são usadas com esta opção ou com a opção `--read-from-remote-server`. Estas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`. Se nenhuma das opções remotas for especificada, as opções de parâmetros de conexão são ignoradas.

O privilégio `REPLICATION SLAVE` é necessário para usar esta opção.

* `--read-from-remote-server=file_name`, `-R`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

Leia o log binário de um servidor MySQL em vez de ler um arquivo de log local. Esta opção exige que o servidor remoto esteja em execução. Funciona apenas para arquivos de log binário no servidor remoto, não para arquivos de log de relevo, e assume apenas o nome do arquivo de log binário (incluindo o sufixo numérico) como seu argumento, ignorando qualquer caminho.

As opções de parâmetros de conexão são usadas com esta opção ou com a opção `--read-from-remote-master`. Estas opções são `--host`, `--password`, `--port`, `--protocol`, `--socket` e `--user`. Se nenhuma das opções remotas for especificada, as opções de parâmetros de conexão são ignoradas.

O privilégio `REPLICATION SLAVE` é necessário para usar esta opção.

Esta opção é como `--read-from-remote-master=BINLOG-DUMP-NON-GTIDS`.

* `--result-file=name`, `-r name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

Sem a opção `--raw`, esta opção indica o arquivo para o qual o **mysqlbinlog** escreve a saída de texto. Com `--raw`, o **mysqlbinlog** escreve um arquivo de saída binário para cada arquivo de registro transferido do servidor, escrevendo-os, por padrão, no diretório atual usando os mesmos nomes do arquivo de registro original. Neste caso, o valor da opção `--result-file` é tratado como um prefixo que modifica os nomes dos arquivos de saída.

* `--rewrite-db='from_name->to_name'`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

Ao ler de um log baseado em string ou em declarações, reescreva todas as ocorrências de *`from_name`* para *`to_name`*. A reescrita é feita nas strings, para logs baseados em strings, bem como nas cláusulas `USE`, para logs baseados em declarações. Em versões do MySQL anteriores a 5.7.8, esta opção era apenas para uso ao restaurar tabelas registradas usando o formato baseado em string.

Aviso

As declarações nas quais os nomes de tabela são qualificados com nomes de banco de dados não são reescritas para usar o novo nome ao usar esta opção.

A regra de reescrita empregada como valor para esta opção é uma string na forma `'from_name->to_name'`, conforme mostrado anteriormente, e, por essa razão, deve ser fechada entre aspas.

Para empregar várias regras de reescrita, especifique a opção várias vezes, conforme mostrado aqui:

  ```sql
  mysqlbinlog --rewrite-db='dbcurrent->dbold' --rewrite-db='dbtest->dbcurrent' \
      binlog.00001 > /tmp/statements.sql
  ```

Quando usado juntamente com a opção `--database`, a opção `--rewrite-db` é aplicada primeiro; em seguida, a opção `--database` é aplicada, usando o nome do banco de dados reescrito. A ordem em que as opções são fornecidas não faz diferença nesse aspecto.

Isso significa, por exemplo, que se o **mysqlbinlog** for iniciado com `--rewrite-db='mydb->yourdb' --database=yourdb`, todas as atualizações em quaisquer tabelas nos bancos de dados `mydb` e `yourdb` serão incluídas na saída. Por outro lado, se for iniciado com `--rewrite-db='mydb->yourdb' --database=mydb`, o **mysqlbinlog** não emitirá nenhuma declaração: uma vez que todas as atualizações em `mydb` são reescritas primeiro como atualizações em `yourdb` antes de aplicar a opção `--database`, não restam atualizações que correspondam a `--database=mydb`.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

A partir do MySQL 5.7.5, essa opção é desatualizada; espere que ela seja removida em um lançamento futuro do MySQL. Ela sempre está habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

Nota

As senhas que utilizam o método de hashing pré-4.1 são menos seguras do que as senhas que utilizam o método nativo de hashing de senha e devem ser evitadas. As senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql_old_password”.

* `--server-id=id`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>0

Exibir apenas os eventos criados pelo servidor com o ID do servidor fornecido.

* `--server-id-bits=N`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>1

Use apenas os primeiros *`N`* bits do `server_id` para identificar o servidor. Se o log binário foi escrito por um `mysqld` com bits de ID do servidor definidos em menos de 32 e os dados do usuário armazenados no bit mais significativo, executando **mysqlbinlog** com `--server-id-bits` definido em 32, esses dados podem ser vistos.

Esta opção é suportada apenas pela versão do **mysqlbinlog** fornecida com a distribuição do NDB Cluster ou construída com suporte ao NDB Cluster.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>2

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha com base em par de chave RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação substituível SHA-256”, e a Seção 6.4.1.4, “Cache de autenticação substituível SHA-2”.

A opção `--server-public-key-path` foi adicionada no MySQL 5.7.23.

* `--set-charset=charset_name`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>3

Adicione uma declaração `SET NAMES charset_name` ao resultado para especificar o conjunto de caracteres a ser usado para o processamento de arquivos de registro.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>4

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--short-form`, `-s`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>5

Exiba apenas as declarações contidas no log, sem nenhuma informação adicional ou eventos baseados em strings. Isso é apenas para testes e não deve ser usado em sistemas de produção.

* `--skip-gtids[=(true|false)]`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>6

Não inclua os GTIDs dos arquivos de registro binário no arquivo de dump de saída. Por exemplo:

  ```sql
  mysqlbinlog --skip-gtids binlog.000001 >  /tmp/dump.sql
  mysql -u root -p -e "source /tmp/dump.sql"
  ```

Normalmente, você não deve usar essa opção em produção ou em recuperação, exceto nos cenários específicos e raros em que os GTIDs são ativamente indesejados. Por exemplo, um administrador pode querer duplicar transações selecionadas (como definições de tabela) de uma implantação para outra, não relacionada, que não se replicará para ou a partir do original. Nesse cenário, `--skip-gtids` pode ser usado para permitir que o administrador aplique as transações como se fossem novas e garanta que as implantações permaneçam não relacionadas. No entanto, você deve usar essa opção apenas se a inclusão dos GTIDs causar um problema conhecido para seu caso de uso.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>7

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do pipe nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--start-datetime=datetime`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>8

Comece a ler o log binário no primeiro evento com um timestamp igual ou posterior ao argumento *`datetime`*. O valor *`datetime`* é relativo ao fuso horário local da máquina onde você executa o **mysqlbinlog**. O valor deve estar em um formato aceito para os tipos de dados `DATETIME` ou `TIMESTAMP`. Por exemplo:

  ```sql
  mysqlbinlog --start-datetime="2005-12-25 11:25:56" binlog.000003
  ```

Essa opção é útil para recuperação em ponto no tempo. Veja a Seção 7.5, “Recuperação em Ponto no Tempo (Incremental) (Recuperação)”.

* `--start-position=N`, `-j N`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>4294967040</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709547520</code></td> </tr></tbody></table>9

Comece a ler o log binário no primeiro evento com uma posição igual a ou maior que *`N`*. Esta opção se aplica ao primeiro arquivo de log nomeado na string de comando.

Essa opção é útil para recuperação em ponto no tempo. Veja a Seção 7.5, “Recuperação em Ponto no Tempo (Incremental) (Recuperação)”.

* `--stop-datetime=datetime`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>0

Pare de ler o log binário no primeiro evento com um timestamp igual a ou posterior ao argumento *`datetime`*. Consulte a descrição da opção `--start-datetime` para obter informações sobre o valor *`datetime`*.

Essa opção é útil para recuperação em ponto no tempo. Veja a Seção 7.5, “Recuperação em Ponto no Tempo (Incremental) (Recuperação)”.

* `--stop-never`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>1

Esta opção é usada com `--read-from-remote-server`. Ela informa ao **mysqlbinlog** que deve permanecer conectado ao servidor. Caso contrário, o **mysqlbinlog** sai quando o último arquivo de registro tiver sido transferido do servidor. `--stop-never` implica em `--to-last-log`, portanto, apenas o primeiro arquivo de registro a ser transferido precisa ser nomeado na string de comando.

`--stop-never` é comumente usado com `--raw` para fazer um backup de registro binário ao vivo, mas também pode ser usado sem `--raw` para manter uma exibição contínua de texto dos eventos do registro à medida que o servidor os gera.

* `--stop-never-slave-server-id=id`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>2

Com `--stop-never`, o **mysqlbinlog** reporta um ID do servidor de 65535 quando se conecta ao servidor. `--stop-never-slave-server-id` especifica explicitamente o ID do servidor a ser reportado. Ele pode ser usado para evitar um conflito com o ID de um servidor replica ou outro processo **mysqlbinlog**. Veja a Seção 4.6.7.4, “Especificando o ID do servidor mysqlbinlog”.

* `--stop-position=N`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>3

Pare de ler o log binário no primeiro evento com uma posição igual a ou maior que *`N`*. Esta opção se aplica ao último arquivo de log nomeado na string de comando.

Essa opção é útil para recuperação em ponto no tempo. Veja a Seção 7.5, “Recuperação em Ponto no Tempo (Incremental) (Recuperação)”.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>4

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 6.3.2, “Protocolos e cifras TLS de conexão criptografada”.

Essa opção foi adicionada no MySQL 5.7.10.

* `--to-last-log`, `-t`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>5

Não pare no final do log binário solicitado de um servidor MySQL, mas sim continue imprimindo até o final do último log binário. Se você enviar a saída para o mesmo servidor MySQL, isso pode levar a um loop infinito. Esta opção requer `--read-from-remote-server`.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>6

O nome de usuário da conta MySQL a ser usado ao se conectar a um servidor remoto.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>7

Reconstrua os eventos da string e exiba-os como declarações SQL comentadas. Se esta opção for dada duas vezes (através da passagem de "-vv" ou "--verbose --verbose"), a saída inclui comentários para indicar os tipos de dados das colunas e alguns metadados, e eventos de log de consulta de string, se assim configurado.

Para exemplos que mostram o efeito de `--base64-output` e `--verbose` na saída de eventos de string, consulte a Seção 4.6.7.2, “Exibição de Eventos de String de mysqlbinlog”.

* `--verify-binlog-checksum`, `-c`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>8

Verifique os checksums nos arquivos de registro binários.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>9

Exibir informações da versão e sair.

Em MySQL 5.7, o número da versão exibido pelo **mysqlbinlog** quando você usa essa opção é 3.4.

Você pode redirecionar a saída do **mysqlbinlog** para o cliente **mysql** para executar os eventos contidos no log binário. Essa técnica é usada para recuperar de uma saída inesperada quando você tem um backup antigo (consulte a Seção 7.5, “Recuperação Ponto no Tempo (Incremental)”). Por exemplo:

```sql
mysqlbinlog binlog.000001 | mysql -u root -p
```

Ou:

```sql
mysqlbinlog binlog.[0-9]* | mysql -u root -p
```

Se as declarações produzidas por **mysqlbinlog** podem conter valores `BLOB`, esses podem causar problemas quando o **mysql** os processa. Neste caso, invoque o **mysql** com a opção `--binary-mode`.

Você também pode redirecionar a saída do **mysqlbinlog** para um arquivo de texto, se precisar modificar o log de declarações primeiro (por exemplo, para remover declarações que você não deseja executar por algum motivo). Após editar o arquivo, execute as declarações que ele contém, usando-o como entrada para o programa **mysql**:

```sql
mysqlbinlog binlog.000001 > tmpfile
... edit tmpfile ...
mysql -u root -p < tmpfile
```

Quando o **mysqlbinlog** é invocado com a opção `--start-position`, ele exibe apenas aqueles eventos com um deslocamento no log binário maior ou igual a uma posição dada (a posição dada deve corresponder ao início de um evento). Também tem opções para parar e começar quando ele vê um evento com uma data e hora dadas. Isso permite que você realize a recuperação em um ponto no tempo usando a opção `--stop-datetime` (para poder dizer, por exemplo, “volte meus bancos de dados para como estavam hoje às 10:30”).

**Processamento de vários arquivos.** Se você tem mais de um log binário para executar no servidor MySQL, o método seguro é processá-los todos usando uma única conexão com o servidor. Aqui está um exemplo que demonstra o que pode ser *inseguro*:

```sql
mysqlbinlog binlog.000001 | mysql -u root -p # DANGER!!
mysqlbinlog binlog.000002 | mysql -u root -p # DANGER!!
```

O processamento de logs binários dessa maneira, usando múltiplas conexões ao servidor, causa problemas se o primeiro arquivo de log contiver uma declaração `CREATE TEMPORARY TABLE` e o segundo log contiver uma declaração que usa a tabela temporária. Quando o primeiro processo **mysql** termina, o servidor elimina a tabela temporária. Quando o segundo processo **mysql** tenta usar a tabela, o servidor relata “tabela desconhecida”.

Para evitar problemas como esse, use um *único* processo *mysql* para executar o conteúdo de todos os logs binários que você deseja processar. Aqui está uma maneira de fazer isso:

```sql
mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Outra abordagem é escrever todos os logs em um único arquivo e, em seguida, processar o arquivo:

```sql
mysqlbinlog binlog.000001 >  /tmp/statements.sql
mysqlbinlog binlog.000002 >> /tmp/statements.sql
mysql -u root -p -e "source /tmp/statements.sql"
```

**mysqlbinlog** pode produzir uma saída que reproduz uma operação `LOAD DATA` sem o arquivo de dados original. **mysqlbinlog** copia os dados para um arquivo temporário e escreve uma declaração `LOAD DATA LOCAL` que se refere ao arquivo. A localização padrão do diretório onde esses arquivos são escritos é específica do sistema. Para especificar um diretório explicitamente, use a opção `--local-load`.

Como o **mysqlbinlog** converte as instruções `LOAD DATA` em instruções `LOAD DATA LOCAL` (ou seja, adiciona `LOCAL`, o cliente e o servidor que você usa para processar as instruções devem ser configurados com a capacidade `LOCAL` habilitada. Veja a Seção 6.1.6, “Considerações de segurança para LOAD DATA LOCAL”.

Aviso

Os arquivos temporários criados para as declarações `LOAD DATA LOCAL` *não são* automaticamente apagados, pois são necessários até que você execute essas declarações. Você deve apagar os arquivos temporários você mesmo depois de não precisar mais do log da declaração. Os arquivos podem ser encontrados no diretório de arquivos temporários e têm nomes como *`original_file_name-#-#`*.

#### 4.6.7.1 Formato de Hexa Dump do mysqlbinlog

A opção `--hexdump` faz com que o **mysqlbinlog** produza um dump hexadecimal do conteúdo do log binário:

```sql
mysqlbinlog --hexdump master-bin.000001
```

A saída hex consiste em strings de comentário que começam com `#`, então a saída pode parecer assim para o comando anterior:

```sql
/*!40019 SET @@SESSION.max_insert_delayed_threads=0*/;
/*!50003 SET @OLD_COMPLETION_TYPE=@@COMPLETION_TYPE,COMPLETION_TYPE=0*/;
# at 4
#051024 17:24:13 server id 1  end_log_pos 98
# Position  Timestamp   Type   Master ID        Size      Master Pos    Flags
# 00000004 9d fc 5c 43   0f   01 00 00 00   5e 00 00 00   62 00 00 00   00 00
# 00000017 04 00 35 2e 30 2e 31 35  2d 64 65 62 75 67 2d 6c |..5.0.15.debug.l|
# 00000027 6f 67 00 00 00 00 00 00  00 00 00 00 00 00 00 00 |og..............|
# 00000037 00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00 |................|
# 00000047 00 00 00 00 9d fc 5c 43  13 38 0d 00 08 00 12 00 |.......C.8......|
# 00000057 04 04 04 04 12 00 00 4b  00 04 1a                |.......K...|
#       Start: binlog v 4, server v 5.0.15-debug-log created 051024 17:24:13
#       at startup
ROLLBACK;
```

A saída de exibição de depuração hexadecimal atualmente contém os elementos na lista a seguir. Esse formato está sujeito a alterações. Para mais informações sobre o formato de log binário, consulte MySQL Internals: The Binary Log.

* `Position`: A posição do byte dentro do arquivo de registro.

* `Timestamp`: O timestamp do evento. No exemplo mostrado, `'9d fc 5c 43'` é a representação de `'051024 17:24:13'` em hexadecimal.

* `Type`: O código do tipo de evento.  
* `Master ID`: O ID do servidor da fonte de replicação que criou o evento.

* `Size`: O tamanho em bytes do evento.

* `Master Pos`: A posição do próximo evento no arquivo de registro original da fonte.

* `Flags`: Valores de sinalização de evento.

#### 4.6.7.2 Exibição de Eventos de String mysqlbinlog

Os exemplos a seguir ilustram como o **mysqlbinlog** exibe eventos de string que especificam modificações de dados. Esses correspondem a eventos com os códigos de tipo `WRITE_ROWS_EVENT`, `UPDATE_ROWS_EVENT` e `DELETE_ROWS_EVENT`. As opções `--base64-output=DECODE-ROWS` e `--verbose` podem ser usadas para afetar a saída de eventos de string.

Suponha que o servidor esteja usando registro binário baseado em string e que você execute a seguinte sequência de instruções:

```sql
CREATE TABLE t
(
  id   INT NOT NULL,
  name VARCHAR(20) NOT NULL,
  date DATE NULL
) ENGINE = InnoDB;

START TRANSACTION;
INSERT INTO t VALUES(1, 'apple', NULL);
UPDATE t SET name = 'pear', date = '2009-01-01' WHERE id = 1;
DELETE FROM t WHERE id = 1;
COMMIT;
```

Por padrão, o **mysqlbinlog** exibe eventos de string codificados como strings baseadas em 64 usando as declarações `BINLOG`. Omitindo strings desnecessárias, a saída para os eventos de string produzidos pela sequência de declarações anteriores parece assim:

```sql
$> mysqlbinlog log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAANoAAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBcBAAAAKAAAAAIBAAAQABEAAAAAAAEAA//8AQAAAAVhcHBsZQ==
'/*!*/;
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
```

Para ver os eventos da string como comentários na forma de declarações de "pseudo-SQL", execute o **mysqlbinlog** com a opção `--verbose` ou `-v`. A saída contém strings que começam com `###`:

```sql
$> mysqlbinlog -v log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAANoAAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBcBAAAAKAAAAAIBAAAQABEAAAAAAAEAA//8AQAAAAVhcHBsZQ==
'/*!*/;
### INSERT INTO test.t
### SET
###   @1=1
###   @2='apple'
###   @3=NULL
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
### UPDATE test.t
### WHERE
###   @1=1
###   @2='apple'
###   @3=NULL
### SET
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
### DELETE FROM test.t
### WHERE
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
```

Especifique `--verbose` ou `-v` duas vezes para exibir também os tipos de dados e alguns metadados para cada coluna. A saída contém um comentário adicional após cada alteração na coluna:

```sql
$> mysqlbinlog -vv log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAANoAAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBcBAAAAKAAAAAIBAAAQABEAAAAAAAEAA//8AQAAAAVhcHBsZQ==
'/*!*/;
### INSERT INTO test.t
### SET
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='apple' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3=NULL /* VARSTRING(20) meta=0 nullable=1 is_null=1 */
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
### UPDATE test.t
### WHERE
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='apple' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3=NULL /* VARSTRING(20) meta=0 nullable=1 is_null=1 */
### SET
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='pear' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3='2009:01:01' /* DATE meta=0 nullable=1 is_null=0 */
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
### DELETE FROM test.t
### WHERE
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='pear' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3='2009:01:01' /* DATE meta=0 nullable=1 is_null=0 */
```

Você pode informar ao **mysqlbinlog** para suprimir as declarações `BINLOG` para eventos de string usando a opção `--base64-output=DECODE-ROWS`. Isso é semelhante ao `--base64-output=NEVER`, mas não sai com um erro se um evento de string for encontrado. A combinação de `--base64-output=DECODE-ROWS` e `--verbose` fornece uma maneira conveniente de ver eventos de string apenas como declarações SQL:

```sql
$> mysqlbinlog -v --base64-output=DECODE-ROWS log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F
### INSERT INTO test.t
### SET
###   @1=1
###   @2='apple'
###   @3=NULL
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F
### UPDATE test.t
### WHERE
###   @1=1
###   @2='apple'
###   @3=NULL
### SET
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F
### DELETE FROM test.t
### WHERE
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
```

Nota

Você não deve suprimir as declarações de `BINLOG` se você pretender reexecutar a saída do **mysqlbinlog**.

As instruções SQL produzidas por `--verbose` para eventos de string são muito mais legíveis do que as instruções correspondentes de `BINLOG`. No entanto, elas não correspondem exatamente às instruções SQL originais que geraram os eventos. As seguintes limitações se aplicam:

* Os nomes originais das colunas estão perdidos e substituídos por `@N`, onde *`N`* é um número de coluna.

* As informações sobre o conjunto de caracteres não estão disponíveis no log binário, o que afeta a exibição das colunas de texto:

Não há distinção feita entre os tipos de string binários e não binários correspondentes (`BINARY` e `CHAR`, `VARBINARY` e `VARCHAR`, `BLOB` e `TEXT`). A saída utiliza um tipo de dados de `STRING` para strings de comprimento fixo e `VARSTRING` para strings de comprimento variável.

+ Para conjuntos de caracteres multibyte, o número máximo de bytes por caractere não está presente no log binário, então o comprimento para os tipos de string é exibido em bytes e não em caracteres. Por exemplo, `STRING(4)` é usado como o tipo de dados para valores de qualquer um desses tipos de coluna:

    ```sql
    CHAR(4) CHARACTER SET latin1
    CHAR(2) CHARACTER SET ucs2
    ```

+ Devido ao formato de armazenamento para eventos do tipo `UPDATE_ROWS_EVENT`, as declarações `UPDATE` são exibidas com a cláusula `WHERE` antes da cláusula `SET`.

A interpretação adequada dos eventos de string requer as informações da descrição do formato do evento no início do log binário. Como o **mysqlbinlog** não sabe antecipadamente se o resto do log contém eventos de string, por padrão, ele exibe o evento de descrição do formato usando uma declaração `BINLOG` na parte inicial do resultado.

Se o log binário for conhecido por não conter quaisquer eventos que exijam uma declaração `BINLOG` (ou seja, sem eventos de string), a opção `--base64-output=NEVER` pode ser usada para impedir que esse cabeçalho seja escrito.

#### 4.6.7.3 Usando mysqlbinlog para fazer backup de arquivos de log binário

Por padrão, o **mysqlbinlog** lê arquivos de registro binário e exibe seu conteúdo em formato de texto. Isso permite que você examine os eventos dentro dos arquivos de forma mais fácil e os execute novamente (por exemplo, usando a saída como entrada para o **mysql**). O **mysqlbinlog** pode ler arquivos de registro diretamente do sistema de arquivos local, ou, com a opção `--read-from-remote-server`, pode se conectar a um servidor e solicitar o conteúdo do registro binário desse servidor. O **mysqlbinlog** escreve a saída de texto em sua saída padrão ou no arquivo nomeado como o valor da opção `--result-file=file_name`, se essa opção for fornecida.

* Capacidades de backup do mysqlbinlog
* Opções de backup do mysqlbinlog
* Resumos estáticos e ao vivo
* Nomeação do arquivo de saída
* Exemplo: mysqldump + mysqlbinlog para backup e restauração
* Restrições de backup do mysqlbinlog

Capacidades de backup do mysqlbinlog

O **mysqlbinlog** pode ler arquivos de registro binário e escrever novos arquivos contendo o mesmo conteúdo, ou seja, em formato binário e não em formato de texto. Essa capacidade permite que você faça um backup de um registro binário em seu formato original. O **mysqlbinlog** pode fazer um backup estático, fazendo backup de um conjunto de arquivos de registro e parando quando o fim do último arquivo é alcançado. Também pode fazer um backup contínuo (“ao vivo”), permanecendo conectado ao servidor quando ele alcança o fim do último arquivo de registro e continuando a copiar novos eventos à medida que são gerados. Na operação de backup contínuo, o **mysqlbinlog** funciona até que a conexão termine (por exemplo, quando o servidor sai) ou o **mysqlbinlog** seja interrompido forçadamente. Quando a conexão termina, o **mysqlbinlog** não espera e não tenta a conexão novamente, ao contrário de um servidor replica. Para continuar um backup ao vivo após o servidor ter sido reiniciado, você também deve reiniciar o **mysqlbinlog**.

Opções de backup do mysqlbinlog

O backup de log binário exige que você invoque **mysqlbinlog** com pelo menos duas opções:

* A opção `--read-from-remote-server` (ou `-R`) informa ao **mysqlbinlog** para se conectar a um servidor e solicitar seu log binário. (Isso é semelhante a um servidor replica conectando-se ao seu servidor de fonte de replicação.)

* A opção `--raw` indica que o **mysqlbinlog** deve escrever saída bruta (binária), e não saída de texto.

Juntamente com `--read-from-remote-server`, é comum especificar outras opções: `--host` indica onde o servidor está sendo executado, e você também pode precisar especificar opções de conexão, como `--user` e `--password`.

Várias outras opções são úteis em conjunto com `--raw`:

* `--stop-never`: Mantenha-se conectado ao servidor após atingir o final do último arquivo de registro e continue a ler novos eventos.

* `--stop-never-slave-server-id=id`: O ID do servidor que o **mysqlbinlog** reporta ao servidor quando o `--stop-never` é usado. O padrão é 65535. Isso pode ser usado para evitar um conflito com o ID de um servidor replica ou outro processo do **mysqlbinlog**. Veja a Seção 4.6.7.4, “Especificando o ID do servidor do mysqlbinlog”.

* `--result-file`: Um prefixo para os nomes dos arquivos de saída, conforme descrito mais adiante.

##### Resumos estáticos e ao vivo

Para fazer backup dos arquivos de log binários de um servidor com o **mysqlbinlog**, você deve especificar nomes de arquivos que realmente existam no servidor. Se você não conhece os nomes, conecte-se ao servidor e use a declaração `SHOW BINARY LOGS` para ver os nomes atuais. Suponha que a declaração produza esta saída:

```sql
mysql> SHOW BINARY LOGS;
+---------------+-----------+
| Log_name      | File_size |
+---------------+-----------+
| binlog.000130 |     27459 |
| binlog.000131 |     13719 |
| binlog.000132 |     43268 |
+---------------+-----------+
```

Com essas informações, você pode usar o **mysqlbinlog** para fazer backup do log binário no diretório atual da seguinte forma (entre cada comando em uma única string):

* Para fazer um backup estático de `binlog.000130` através de `binlog.000132`, use um dos seguintes comandos:

  ```sql
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    binlog.000130 binlog.000131 binlog.000132

  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --to-last-log binlog.000130
  ```

O primeiro comando especifica explicitamente cada nome de arquivo. O segundo nomeia apenas o primeiro arquivo e usa `--to-last-log` para ler o último. Uma diferença entre esses comandos é que, se o servidor abrir `binlog.000133` antes de **mysqlbinlog** alcançar o final de `binlog.000132`, o primeiro comando não o lê, mas o segundo comando sim.

* Para fazer um backup em tempo real no qual o **mysqlbinlog** começa com `binlog.000130` para copiar os arquivos de log existentes, e depois permanece conectado para copiar novos eventos conforme o servidor os gera:

  ```sql
  mysqlbinlog --read-from-remote-server --host=host_name --raw
    --stop-never binlog.000130
  ```

Com `--stop-never`, não é necessário especificar `--to-last-log` para ler o último arquivo de registro, pois essa opção é implícita.

##### Nomeação do arquivo de saída

Sem `--raw`, o **mysqlbinlog** produz saída de texto e a opção `--result-file`, se fornecida, especifica o nome do único arquivo para o qual toda a saída é escrita. Com `--raw`, o **mysqlbinlog** escreve um arquivo de saída binário para cada arquivo de registro transferido do servidor. Por padrão, o **mysqlbinlog** escreve os arquivos no diretório atual com os mesmos nomes dos arquivos de registro originais. Para modificar os nomes dos arquivos de saída, use a opção `--result-file`. Em conjunto com `--raw`, o valor da opção `--result-file` é tratado como um prefixo que modifica os nomes dos arquivos de saída.

Suponha que um servidor atualmente tenha arquivos de registro binários com os nomes `binlog.000999` e assim por diante. Se você usar **mysqlbinlog --raw** para fazer backup dos arquivos, a opção `--result-file` produz nomes de arquivos de saída conforme mostrado na tabela a seguir. Você pode escrever os arquivos em um diretório específico, começando o valor `--result-file` com o caminho do diretório. Se o valor `--result-file` consista apenas em um nome de diretório, o valor deve terminar com o caractere do separador de caminho. Os arquivos de saída são sobrescritos se existirem.

<table summary="mysqlbinlog --result-file options and corresponding output file names, as described in the example in the preceding text."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th><code>--result-file</code> Option</th> <th>Nomes dos arquivos de saída</th> </tr></thead><tbody><tr> <td><code>--result-file=x</code></td> <td><code>xbinlog.000999</code>e para cima</td> </tr><tr> <td><code>--result-file=/tmp/</code></td> <td><code>/tmp/binlog.000999</code>e para cima</td> </tr><tr> <td><code>--result-file=/tmp/x</code></td> <td><code>/tmp/xbinlog.000999</code>e para cima</td> </tr></tbody></table>

##### Exemplo: mysqldump + mysqlbinlog para backup e restauração

O exemplo a seguir descreve um cenário simples que mostra como usar **mysqldump** e **mysqlbinlog** juntos para fazer backup dos dados e do log binário de um servidor, e como usar o backup para restaurar o servidor se ocorrer perda de dados. O exemplo assume que o servidor está sendo executado no host *`host_name`* e que seu primeiro arquivo de log binário é chamado `binlog.000999`. Digite cada comando em uma única string.

Use **mysqlbinlog** para fazer um backup contínuo do log binário:

```sql
mysqlbinlog --read-from-remote-server --host=host_name --raw
  --stop-never binlog.000999
```

Use o **mysqldump** para criar um arquivo de dump como um instantâneo dos dados do servidor. Use `--all-databases`, `--events` e `--routines` para fazer backup de todos os dados, e `--master-data=2` para incluir as coordenadas do log binário atual no arquivo de dump.

```sql
mysqldump --host=host_name --all-databases --events --routines --master-data=2> dump_file
```

Execute o comando **mysqldump** periodicamente para criar instantâneos mais recentes conforme desejado.

Se ocorrer perda de dados (por exemplo, se o servidor sair inesperadamente), use o arquivo de implantação mais recente para restaurar os dados:

```sql
mysql --host=host_name -u root -p < dump_file
```

Em seguida, use o backup de registro binário para reexecutar eventos que foram escritos após as coordenadas listadas no arquivo de depuração. Suponha que as coordenadas no arquivo pareçam assim:

```sql
-- CHANGE MASTER TO MASTER_LOG_FILE='binlog.001002', MASTER_LOG_POS=27284;
```

Se o arquivo de registro mais recente com backup estiver com o nome `binlog.001004`, execute os eventos de registro novamente da seguinte forma:

```sql
mysqlbinlog --start-position=27284 binlog.001002 binlog.001003 binlog.001004
  | mysql --host=host_name -u root -p
```

Você pode achar mais fácil copiar os arquivos de backup (arquivo de dump e arquivos de registro binário) para o host do servidor para facilitar a operação de restauração, ou se o MySQL não permitir acesso remoto ao `root`.

##### Restrições de backup do mysqlbinlog

Os backups de log binário com **mysqlbinlog** estão sujeitos a essas restrições:

* **mysqlbinlog** não se reconecta automaticamente ao servidor MySQL se a conexão for perdida (por exemplo, se ocorrer um reinício do servidor ou houver uma interrupção de rede).

* Antes do MySQL 5.7.19, o **mysqlbinlog** não recebe todos os eventos conforme eles são comprometidos, mesmo que o servidor esteja configurado com `sync_binlog=1`. Isso significa que alguns dos eventos mais recentes podem estar faltando. Para garantir que o **mysqlbinlog** veja os eventos mais recentes, limpe o log binário no servidor que você está fazendo backup.

* O atraso para um backup é semelhante ao atraso para um servidor replica.

#### 4.6.7.4 Especificando o ID do servidor mysqlbinlog

Quando invocado com a opção `--read-from-remote-server`, o **mysqlbinlog** se conecta a um servidor MySQL, especifica um ID de servidor para se identificar e solicita arquivos de log binários do servidor. Você pode usar o **mysqlbinlog** para solicitar arquivos de log de um servidor de várias maneiras:

* Especifique um conjunto de arquivos explicitamente nomeado: Para cada arquivo, o **mysqlbinlog** se conecta e emite um comando `Binlog dump`. O servidor envia o arquivo e se desconecta. Há uma conexão por arquivo.

* Especifique o arquivo inicial e `--to-last-log`: o **mysqlbinlog** se conecta e emite um comando `Binlog dump` para todos os arquivos. O servidor envia todos os arquivos e se desconecta.

* Especifique o arquivo inicial e `--stop-never` (o que implica em `--to-last-log`): **mysqlbinlog** conecta e emite um comando `Binlog dump` para todos os arquivos. O servidor envia todos os arquivos, mas não se desconecta após enviar o último.

Apenas com `--read-from-remote-server`, o **mysqlbinlog** se conecta usando um ID de servidor de 0, o que indica ao servidor que se desconecte após enviar o último arquivo de registro solicitado.

Com `--read-from-remote-server` e `--stop-never`, o **mysqlbinlog** se conecta usando um ID de servidor não nulo, para que o servidor não se desconecte após enviar o último arquivo de registro. O ID de servidor é 65535 por padrão, mas isso pode ser alterado com `--stop-never-slave-server-id`.

Assim, para os dois primeiros modos de solicitação de arquivos, o servidor se desconecta porque o **mysqlbinlog** especifica um ID de servidor de 0. Não se desconecta se `--stop-never` for fornecido porque o **mysqlbinlog** especifica um ID de servidor não nulo.

### 4.6.8 mysqldumpslow — Resumir arquivos de registro de consultas lentas

O registro de consultas lentas do MySQL contém informações sobre as consultas que levam um longo tempo para serem executadas (consulte a Seção 5.4.5, “O registro de consultas lentas”). O **mysqldumpslow** analisa os arquivos de registro de consultas lentas do MySQL e resume seu conteúdo.

Normalmente, o **mysqldumpslow** agrupa consultas que são semelhantes, exceto pelos valores específicos dos dados numéricos e de cadeia. Ele “abstrai” esses valores para `N` e `'S'` ao exibir o resultado resumido. Para modificar o comportamento de abstração de valor, use as opções `-a` e `-n`.

Invoque o **mysqldumpslow** da seguinte forma:

```sql
mysqldumpslow [options] [log_file ...]
```

Exemplo de saída sem opções fornecidas:

```sql
Reading mysql slow query log from /usr/local/mysql/data/mysqld57-slow.log
Count: 1  Time=4.32s (4s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1

Count: 3  Time=2.53s (7s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t2 select * from t1 limit N

Count: 3  Time=2.13s (6s)  Lock=0.00s (0s)  Rows=0.0 (0), root[root]@localhost
 insert into t1 select * from t1
```

O **mysqldumpslow** suporta as seguintes opções.

**Tabela 4.24 Opções mysqldumpslow**

<table frame="box" rules="all" summary="Command-line options available for mysqldumpslow."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td>-a</td> <td>Não abstraia todos os números para N e as strings para 'S</td> </tr><tr><td>-n</td> <td>Números abstratos com pelo menos os dígitos especificados</td> </tr><tr><td>--debug</td> <td>Escreva informações de depuração</td> </tr><tr><td>-g</td> <td>Considere apenas as declarações que correspondem ao padrão</td> </tr><tr><td>--help</td> <td>Exibir mensagem de ajuda e sair</td> </tr><tr><td>-h</td> <td>Nome do nome de host do servidor no nome do arquivo de log</td> </tr><tr><td>-i</td> <td>Nome da instância do servidor</td> </tr><tr><td>-l</td> <td>Não subtraia o tempo de bloqueio do tempo total</td> </tr><tr><td>-r</td> <td>Reverter a ordem de classificação</td> </tr><tr><td>-s</td> <td>Como classificar a saída</td> </tr><tr><td>-t</td> <td>Exibir apenas as primeiras consultas num</td> </tr><tr><td>--verbose</td> <td>Modo verbosos</td> </tr></tbody></table>

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `-a`

Não abstraia todos os números para `N` e as strings para `'S'`.

* `--debug`, `-d`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug</code></td> </tr></tbody></table>

Execute em modo de depuração.

Essa opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

* `-g pattern`

  <table frame="box" rules="all" summary="Properties for grep"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Considere apenas as consultas que correspondem ao padrão (estilo **grep**).

* `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

Nome do nome de domínio do servidor MySQL para o nome do arquivo `*-slow.log`. O valor pode conter um caractere curinga. O padrão é `*` (corresponda a todos).

* `-i name`

  <table frame="box" rules="all" summary="Properties for instance"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Nome da instância do servidor (se estiver usando o script de inicialização **mysql.server**).

* `-l`

Não subtraia o tempo de bloqueio do tempo total.

* `-n N`

  <table frame="box" rules="all" summary="Properties for abstract-numbers"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

Números abstratos com pelo menos *`N`* dígitos dentro dos nomes.

* `-r`

Reverter a ordem de classificação.

* `-s sort_type`

  <table frame="box" rules="all" summary="Properties for sort"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>at</code></td> </tr></tbody></table>

Como ordenar a saída. O valor de *`sort_type`* deve ser escolhido da seguinte lista:

+ `t`, `at`: Classificar por tempo de consulta ou tempo médio de consulta

+ `l`, `al`: Ordenar por tempo de bloqueio ou tempo médio de bloqueio

+ `r`, `ar`: Ordenar por filas enviadas ou filas enviadas em média

+ `c`: Ordenar por contagem

Por padrão, o **mysqldumpslow** ordena por tempo médio de consulta (equivalente a `-s at`).

* `-t N`

  <table frame="box" rules="all" summary="Properties for top"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

Exiba apenas as primeiras consultas *`N`* no resultado.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

Modo detalhado. Imprima mais informações sobre o que o programa faz.

