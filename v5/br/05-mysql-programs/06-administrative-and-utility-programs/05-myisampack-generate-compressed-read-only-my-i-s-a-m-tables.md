### 4.6.5 myisampack — Gerar tabelas MyISAM comprimidas e somente de leitura

O utilitário **myisampack** comprime as tabelas **MyISAM**. **myisampack** funciona comprimindo cada coluna da tabela separadamente. Normalmente, **myisampack** compacta o arquivo de dados de 40% a 70%.

Quando a tabela é usada posteriormente, o servidor lê na memória as informações necessárias para descomprimir as colunas. Isso resulta em um desempenho muito melhor ao acessar linhas individuais, porque você só precisa descomprimir exatamente uma linha.

O MySQL usa `mmap()` quando possível para realizar mapeamento de memória em tabelas compactadas. Se o `mmap()` não funcionar, o MySQL recorre a operações normais de leitura/escrita de arquivos.

Por favor, observe o seguinte:

- Se o servidor **mysqld** foi invocado com o bloqueio externo desativado, não é uma boa ideia invocar o **myisampack** se a tabela for atualizada pelo servidor durante o processo de compactação. É mais seguro comprimir as tabelas com o servidor desligado.

- Depois de compactar uma tabela, ela se torna somente de leitura. Isso é geralmente intencional (como quando você acessa tabelas compactadas em um CD).

- O **myisampack** não suporta tabelas particionadas.

Invoque o **myisampack** da seguinte forma:

```sql
myisampack [options] file_name ...
```

Cada argumento de nome de arquivo deve ser o nome de um arquivo de índice (`.MYI`). Se você não estiver no diretório do banco de dados, você deve especificar o nome do caminho do arquivo. É permitido omitir a extensão `.MYI`.

Depois de comprimir uma tabela com **myisampack**, use **myisamchk -rq** para reconstruir seus índices. Veja a Seção 4.6.3, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”.

O **myisampack** suporta as seguintes opções. Ele também lê arquivos de opções e suporta as opções para processá-las descritas na Seção 4.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--backup`, `-b`

  <table frame="box" rules="all" summary="Propriedades para backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup</code>]]</td> </tr></tbody></table>

  Faça um backup do arquivo de dados de cada tabela usando o nome `tbl_name.OLD`.

- `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--character-sets-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde os conjuntos de caracteres são instalados. Consulte a Seção 10.15, “Configuração de Conjunto de Caracteres”.

- `--debug[=opções_de_depuração]`, `-# [opções_de_depuração]`

  <table frame="box" rules="all" summary="Propriedades para depuração"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--debug[=debug_option<code class="literal">d:t:o</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">d:t:o</code>]]</td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--force`, `-f`

  <table frame="box" rules="all" summary="Propriedades para força"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--force</code>]]</td> </tr></tbody></table>

  Produza uma tabela compactada mesmo que ela fique maior que a original ou se o arquivo intermediário de uma invocação anterior do **myisampack** existir. (O **myisampack** cria um arquivo intermediário chamado `tbl_name.TMD` no diretório do banco de dados enquanto comprime a tabela. Se você interromper o **myisampack**, o arquivo `.TMD` pode não ser excluído.) Normalmente, o **myisampack** sai com um erro se encontrar que `tbl_name.TMD` existe. Com `--force`, o **myisampack** compactua a tabela de qualquer forma.

- `--join=big_tbl_name`, `-j big_tbl_name`

  <table frame="box" rules="all" summary="Propriedades para junção"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--join=big_tbl_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Junte todas as tabelas nomeadas na linha de comando em uma única tabela compactada *`big_tbl_name`*. Todas as tabelas que devem ser combinadas *devem* ter estrutura idêntica (mesmos nomes de colunas e tipos, mesmos índices, etc.).

  *`big_tbl_name`* não pode existir antes da operação de junção. Todas as tabelas de origem nomeadas na linha de comando a serem unidas em *`big_tbl_name`* devem existir. As tabelas de origem são lidas para a operação de junção, mas não são modificadas.

- `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para silencioso"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--silent</code>]]</td> </tr></tbody></table>

  Modo silencioso. Escreva a saída apenas quando ocorrerem erros.

- `--test`, `-t`

  <table frame="box" rules="all" summary="Propriedades para teste"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--test</code>]]</td> </tr></tbody></table>

  Não embale a mesa, apenas teste a embalagem.

- `--tmpdir=dir_name`, `-T dir_name`

  <table frame="box" rules="all" summary="Propriedades para tmpdir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--tmpdir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Use o diretório nomeado como o local onde o **myisampack** cria arquivos temporários.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--verbose</code>]]</td> </tr></tbody></table>

  Modo verbose. Escreva informações sobre o progresso da operação de embalagem e seu resultado.

- `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup</code>]]</td> </tr></tbody></table>0

  Exibir informações da versão e sair.

- `--wait`, `-w`

  <table frame="box" rules="all" summary="Propriedades para backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--backup</code>]]</td> </tr></tbody></table>1

  Aguarde e tente novamente se a tabela estiver em uso. Se o servidor **mysqld** foi invocado com o bloqueio externo desativado, não é uma boa ideia invocar **myisampack** se a tabela for atualizada pelo servidor durante o processo de compactação.

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

O **myisampack** exibe os seguintes tipos de informações:

- `normal`

  O número de colunas para as quais não é utilizada embalagem extra.

- `espaço vazio`

  O número de colunas que contêm valores que são apenas espaços. Essas ocupam um bit.

- `vazio-zero`

  O número de colunas que contêm valores que são apenas zeros binários. Essas ocupam um bit.

- `vazio-preenchimento`

  O número de colunas inteiras que não ocupam a faixa completa de bytes do seu tipo. Essas são alteradas para um tipo menor. Por exemplo, uma coluna `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (oito bytes) pode ser armazenada como uma coluna `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (um byte) se todos os seus valores estiverem no intervalo de `-128` a `127`.

- `pre-space`

  O número de colunas decimais armazenadas com espaços em branco no início. Neste caso, cada valor contém um contador para o número de espaços em branco no início.

- `espaço final`

  O número de colunas que têm muitos espaços em branco no final. Neste caso, cada valor contém um número de contagem para o número de espaços em branco no final.

- `tabela de consulta`

  A coluna tinha apenas um pequeno número de valores diferentes, que foram convertidos em `ENUM` antes da compressão de Huffman.

- `zero`

  O número de colunas para as quais todos os valores são zero.

- "Árvores originais"

  O número inicial de árvores de Huffman.

- `Após a adesão`

  O número de árvores de Huffman distintas que restam após a junção de árvores para economizar espaço no cabeçalho.

Após a compactação de uma tabela, as linhas de `Field` exibidas pelo **myisamchk -dvv** incluem informações adicionais sobre cada coluna:

- `Tipo`

  O tipo de dado. O valor pode conter qualquer um dos seguintes descritores:

  - `constante`

    Todas as linhas têm o mesmo valor.

  - `sem espaço de término`

    Não armazene o espaço final.

  - `sem espaço final, não_sempre`

    Não armazene o espaço final e não faça compressão de espaço final para todos os valores.

  - `sem espaço final, sem vazio`

    Não armazene o espaço final. Não armazene valores vazios.

  - `tabela de consulta`

    A coluna foi convertida em `ENUM`.

  - `zerofill(N)`

    Os bytes *`N`* mais significativos no valor são sempre 0 e não são armazenados.

  - `sem zeros`

    Não armazene zeros.

  - "sempre zero"

    Os valores zero são armazenados usando um bit.

- "árvore de hifas"

  O número da árvore de Huffman associada à coluna.

- "Bits"

  O número de bits utilizados na árvore de Huffman.

Depois de executar o **myisampack**, use o **myisamchk** para recriar quaisquer índices. Neste momento, você também pode ordenar os blocos do índice e criar estatísticas necessárias para que o otimizador do MySQL funcione de forma mais eficiente:

```sql
myisamchk -rq --sort-index --analyze tbl_name.MYI
```

Depois de instalar a tabela compactada no diretório do banco de dados MySQL, você deve executar **mysqladmin flush-tables** para forçar o **mysqld** a começar a usar a nova tabela.

Para descompactar uma tabela compactada, use a opção `--unpack` no **myisamchk**.
