### 6.6.2 innochecksum  Utilidade de checksum de arquivo InnoDB offline

**innochecksum** imprime checksums para arquivos `InnoDB` . Esta ferramenta lê um arquivo de tabela de espaço `InnoDB`, calcula a soma de verificação para cada página, compara a soma de verificação calculada com a soma de verificação armazenada e relata incompatibilidades, que indicam páginas danificadas. Foi originalmente desenvolvido para acelerar a verificação da integridade dos arquivos de tabela de espaço após quedas de energia, mas também pode ser usado após cópias de arquivos. Como as incompatibilidades de soma de verificação causam o `InnoDB` a desligar deliberadamente um servidor em execução, pode ser preferível usar esta ferramenta ao invés de esperar que um servidor em produção encontre as páginas danificadas.

**innochecksum** não pode ser usado em arquivos de tablespace que o servidor já tem abertos. Para esses arquivos, você deve usar `CHECK TABLE` para verificar tabelas dentro do tablespace. Tentando executar **innochecksum** em um tablespace que o servidor já tem resultados abertos em um Impossível bloquear o arquivo erro.

Se forem encontradas incompatibilidades de soma de verificação, restaure o tablespace a partir do backup ou inicie o servidor e tente usar `mysqldump` para fazer um backup das tabelas dentro do tablespace.

Invocar **innochecksum** assim:

```
innochecksum [options] file_name
```

#### Opções

**innochecksum** suporta as seguintes opções. Para opções que se referem a números de página, os números são baseados em zero.

- `--help`, `-?`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Exemplo de utilização:

```
innochecksum --help
```

- `--info`, `-I`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--info</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Sinônimo de `--help`. Mostra ajuda de linha de comando. Exemplo de uso:

```
innochecksum --info
```

- `--version`, `-V`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Exemplo de utilização:

```
innochecksum --version
```

- `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Modo Verbose; imprime um indicador de progresso no arquivo de log a cada cinco segundos. Para que o indicador de progresso seja impresso, o arquivo de log deve ser especificado usando o `--log option`.

```
innochecksum --verbose
```

Para desativar o modo verbo, execute:

```
innochecksum --verbose=FALSE
```

A opção `--verbose` e a opção `--log` podem ser especificadas ao mesmo tempo. Por exemplo:

```
innochecksum --verbose --log=/var/lib/mysql/test/logtest.txt
```

Para localizar as informações do indicador de progresso no ficheiro de registo, pode efectuar a seguinte pesquisa:

```
cat ./logtest.txt | grep -i "okay"
```

As informações sobre o indicador de progresso no ficheiro de registo são semelhantes às seguintes:

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

- `--count`, `-c`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--count</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome da base</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>true</code>]]</td> </tr></tbody></table>

Imprima uma contagem do número de páginas no arquivo e saia. Exemplo de uso:

```
innochecksum --count ../data/test/tab1.ibd
```

- `--start-page=num`, `-s num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--start-page=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

Comece por este número de página.

```
innochecksum --start-page=600 ../data/test/tab1.ibd
```

ou:

```
innochecksum -s 600 ../data/test/tab1.ibd
```

- `--end-page=num`, `-e num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--end-page=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr></tbody></table>

Exemplo de utilização:

```
innochecksum --end-page=700 ../data/test/tab1.ibd
```

ou:

```
innochecksum --p 700 ../data/test/tab1.ibd
```

- `--page=num`, `-p num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--page=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

Verifique apenas este número de página.

```
innochecksum --page=701 ../data/test/tab1.ibd
```

- `--strict-check`, `-C`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--strict-check=algorithm</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>crc32</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>innodb</code>]]</p><p class="valid-value">[[<code>crc32</code>]]</p><p class="valid-value">[[<code>none</code>]]</p></td> </tr></tbody></table>

Especifique um algoritmo de soma de verificação rigorosa. As opções incluem `innodb`, `crc32`, e `none`.

Neste exemplo, o algoritmo de soma de verificação `innodb` é especificado:

```
innochecksum --strict-check=innodb ../data/test/tab1.ibd
```

Neste exemplo, o algoritmo de soma de verificação `crc32` é especificado:

```
innochecksum -C crc32 ../data/test/tab1.ibd
```

Aplicam-se as seguintes condições:

- Se você não especificar a opção `--strict-check`, **innochecksum** valida contra `innodb`, `crc32` e `none`.
- Se você especificar a opção `none` , somas de verificação geradas por `none` são permitidas.
- Se você especificar a opção `innodb` , somas de verificação geradas por `innodb` são permitidas.
- Se você especificar a opção `crc32` , somas de verificação geradas por `crc32` são permitidas.

* `--no-check`, `-n`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-check</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Ignore a verificação do checksum ao reescrever um checksum. Esta opção só pode ser usada com a opção **innochecksum** `--write`. Se a opção `--write` não for especificada, **innochecksum** termina.

Neste exemplo, uma soma de verificação `innodb` é reescrita para substituir uma soma de verificação inválida:

```
innochecksum --no-check --write innodb ../data/test/tab1.ibd
```

- `--allow-mismatches`, `-a`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--allow-mismatches=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>18446744073709551615</code>]]</td> </tr></tbody></table>

O número máximo de incompatibilidades de soma de verificação permitidas antes de **innochecksum** terminar. A configuração padrão é 0. Se `--allow-mismatches=``N`, onde `N>=0`, `N` incompatibilidades são permitidas e **innochecksum** termina em `N+1`. Quando `--allow-mismatches` é definido para 0, **innochecksum** termina na primeira incompatibilidade de soma de verificação.

Neste exemplo, uma soma de verificação existente `innodb` é reescrita para definir `--allow-mismatches` em 1.

```
innochecksum --allow-mismatches=1 --write innodb ../data/test/tab1.ibd
```

Com `--allow-mismatches` definido para 1, se houver um desajuste na página 600 e outro na página 700 em um arquivo com 1000 páginas, o checksum é atualizado para as páginas 0-599 e 601-699.

- `--write=name`, `-w num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--write=algorithm</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>crc32</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>innodb</code>]]</p><p class="valid-value">[[<code>crc32</code>]]</p><p class="valid-value">[[<code>none</code>]]</p></td> </tr></tbody></table>

Reescreva um checksum. Ao reescrever um checksum inválido, a opção `--no-check` deve ser usada juntamente com a opção `--write`. A opção `--no-check` diz ao **innochecksum** para ignorar a verificação do checksum inválido. Você não precisa especificar a opção `--no-check` se o checksum atual for válido.

Um algoritmo deve ser especificado ao usar a opção `--write`.

- `innodb`: Uma soma de verificação calculada em software, usando o algoritmo original de `InnoDB`.
- `crc32`: Uma soma de verificação calculada usando o algoritmo `crc32`, possivelmente feito com uma assistência de hardware.
- `none`: Um número constante.

A opção `--write` reescreve páginas inteiras no disco. Se a nova soma de verificação for idêntica à soma de verificação existente, a nova soma de verificação não será escrita no disco para minimizar as entradas e saídas.

**innochecksum** obtém um bloqueio exclusivo quando a opção `--write` é usada.

Neste exemplo, uma `crc32` checksum é escrita para `tab1.ibd`:

```
innochecksum -w crc32 ../data/test/tab1.ibd
```

Neste exemplo, uma soma de verificação `crc32` é reescrita para substituir uma soma de verificação `crc32` inválida:

```
innochecksum --no-check --write crc32 ../data/test/tab1.ibd
```

- `--page-type-summary`, `-S`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--page-type-summary</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Mostrar uma contagem de cada tipo de página em um espaço de tabela. Exemplo de uso:

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

- `--page-type-dump`, `-D`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--page-type-dump=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

Dump as informações do tipo de página para cada página em um espaço de tabela para `stderr` ou `stdout`.

```
innochecksum --page-type-dump=/tmp/a.txt ../data/test/tab1.ibd
```

- `--log`, `-l`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log=path</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

Saída de log para a ferramenta **innochecksum**. Um nome de arquivo de log deve ser fornecido. Saída de log contém valores de checksum para cada página de tablespace. Para tabelas não comprimidas, os valores de LSN também são fornecidos. Exemplo de uso:

```
innochecksum --log=/tmp/log.txt ../data/test/tab1.ibd
```

ou:

```
innochecksum -l /tmp/log.txt ../data/test/tab1.ibd
```

- `-` opção.

  Especifique a opção `-` para ler a partir da entrada padrão. Se a opção `-` estiver ausente quando read from standard in é esperado, **innochecksum** imprime **innochecksum** informações de uso indicando que a opção - foi omitida.

  ```
  cat t1.ibd | innochecksum -
  ```

  Neste exemplo, **innochecksum** escreve o algoritmo de soma de verificação `crc32` para `a.ibd` sem alterar o arquivo original `t1.ibd`.

  ```
  cat t1.ibd | innochecksum --write=crc32 - > a.ibd
  ```

#### Executar soma sem verificação em múltiplos arquivos de tablespace definidos pelo usuário

Os exemplos a seguir demonstram como executar **innochecksum** em vários arquivos de tablespace definidos pelo usuário (arquivos `.ibd`).

Execute **innochecksum** para todos os arquivos de tablespace (`.ibd`) na base de dados test:

```
innochecksum ./data/test/*.ibd
```

Execute **innochecksum** para todos os arquivos de tablespace (arquivos `.ibd`) que tenham um nome de arquivo começando com t:

```
innochecksum ./data/test/t*.ibd
```

Execute **innochecksum** para todos os arquivos de tablespace (arquivos `.ibd`) no diretório `data`:

```
innochecksum ./data/*/*.ibd
```

::: info Note

A execução de **innochecksum** em múltiplos arquivos de tablespace definidos pelo usuário não é suportada em sistemas operacionais Windows, pois shells do Windows como **cmd.exe** não suportam a expansão de padrões glob. Em sistemas Windows, **innochecksum** deve ser executado separadamente para cada arquivo de tablespace definido pelo usuário. Por exemplo:

```
innochecksum.exe t1.ibd
innochecksum.exe t2.ibd
innochecksum.exe t3.ibd
```

:::

#### Executar soma sem verificação em vários arquivos de espaço de tabela do sistema

Por padrão, há apenas um arquivo de tabela de espaço do sistema (`ibdata1`), mas vários arquivos para o tabela de espaço do sistema podem ser definidos usando a opção `innodb_data_file_path`. No exemplo a seguir, três arquivos para o tabela de espaço do sistema são definidos usando a opção `innodb_data_file_path`: `ibdata1`, `ibdata2` e `ibdata3`.

```
./bin/mysqld --no-defaults --innodb-data-file-path="ibdata1:10M;ibdata2:10M;ibdata3:10M:autoextend"
```

Os três arquivos (`ibdata1`, `ibdata2`, e `ibdata3`) formam um espaço de tabela de sistema lógico. Para executar **innochecksum** em vários arquivos que formam um espaço de tabela de sistema lógico, **innochecksum** requer a opção `-` para ler arquivos de espaço de tabela a partir da entrada padrão, o que é equivalente a concatenar vários arquivos para criar um único arquivo. Para o exemplo fornecido acima, o seguinte comando **innochecksum** seria usado:

```
cat ibdata* | innochecksum -
```

Para obter mais informações sobre a opção -, consulte a informação sobre as opções de **somas não verificadas**.

::: info Note

A execução de **innochecksum** em vários arquivos no mesmo tablespace não é suportada em sistemas operacionais Windows, pois shells do Windows como **cmd.exe** não suportam a expansão do padrão glob. Em sistemas Windows, **innochecksum** deve ser executado separadamente para cada arquivo de tablespace do sistema. Por exemplo:

```
innochecksum.exe ibdata1
innochecksum.exe ibdata2
innochecksum.exe ibdata3
```

:::
